import {globals as G} from './settings.js';
import * as abilities from './abilities.js';
import * as dmgU from './damage.utils.js';
import * as dom from './dom.js';
import * as stats from './stats.js';
import * as timeline from './timeline.js';
import * as utils from './utils.js';

function addAEWaves(state, mod, current) {
  stats.updateSpellStatistics(state, 'aeHit1', current);

  // Only support AE rain spells right now. Add two more waves but
  // without procs
  state.aeWave = true;

  // for each additional wave
  for (let i=1; i<dom.getAERainHitsValue(); i++) {
    calcAvgDamage(state, mod, 'aeHit' + (i+1));
  }

  state.aeWave = false;
}

function addSpellAndEqpProcs(state, mod) {
  let time = state.workingTime;

  // should look these up at some point
  dmgU.getSpellProcs(state.spellProcAbilities, state.spell)
    .forEach(item => {
      // previous procs can use up the current so always
      // check if active before executing
      if (item.hasCharges && !utils.isCounterActive(state, item.id)) {
        state.spellProcAbilities.delete(item.id);
      } else {
        executeProc(item.proc, state, mod, item.id);
      }
    });

  // add eqp and aug procs
  dmgU.getEqpProcs(state.spell).forEach(id => { executeProc(id, state, mod, 'EQP') });
}

function applyPostSpellEffects(state, mod) {
  let update = mod ? mod : 1;
  let spell = state.spell;

  switch(spell.id) {
    case 'BJ':
      state.fbOrbCounter = state.inTwincast ? state.fbOrbCounter : state.fbOrbCounter - 1;
      break;    
    // Claw of the Flameweaver + Mage Chaotic Fire
    case 'CF':
      // Claw only
      if (G.MODE === 'wiz') {
        utils.initNumberProperties(state, ['clawCounter']);
        // Number of claws cast used when handling syllables
        state.clawCounter += update;
      } else if (G.MODE === 'mag') {
        initFlames(state, update);
      }

      var tcLength = abilities.get('TC').duration;
      utils.initNumberProperties(state, ['clawRefreshCount', 'clawTcCounter']);
      utils.initListProperties(state, ['clawTcTimers']);
      
      if (!state.inTwincast) {
        state.clawTcCounter++;
        state.clawTcTimers.push(utils.createTimer(state.workingTime + tcLength, (value) => value - 1 ));
      }

      // only count main spells for normalization
      state.clawRefreshCount += update;

      // skip ahead since we just cast a spell
      // if Claw is cast then reduce timers by 6% including gcd
      state.spells.forEach((t) => {
        var theSpell = utils.getSpellData(t);
        var last = state.lastCastMap[theSpell.timer];
        var count = Math.floor(state.clawRefreshCount);
        if (last && last > 0 && (((dmgU.REFRESH_CAST_COUNT - count + dom.getRefreshOffsetValue())) % dmgU.REFRESH_CAST_COUNT === 0)) {
          delete state.lastCastMap[theSpell.timer];
        }
      });
      break;
    case 'SV':
      timeline.addSpellProcAbility(state, 'VFX', true);
      timeline.addSpellProcAbility(state, 'WSYN', true);
      break;
    case 'FC':
      // FC is used my mages and wizards
      if (G.MODE === 'mag') {
        initFlames(state, update);
      }
      break;
    case 'RS':
      timeline.addSpellProcAbility(state, 'MSYN', true);
      let keys = utils.getCounterKeys('RS');
      utils.initNumberProperties(state, [keys.counter]);
      utils.initListProperties(state, [keys.timers]);
      state[keys.counter]++;
      stats.updateSpellStatistics(state, keys.counter, state[keys.counter]);
      state[keys.timers].push(
        utils.createTimer(state.workingTime + dom.getRemorselessServantTTLValue(), (value) => { return value - 1; })
      );
      
      // save simple for expected DPS at this time
      stats.updateSpellStatistics(state, 'rsDPS', dom.getRemorselessServantDPSValue() * state[keys.counter]);
      
      if (!state.dotGenerator) {
        state.dotGenerator = genDamageOverTime(state);
      }
      break;
    case 'FA':
      state[utils.getCounterKeys('FA').expireTime] = state.workingTime + dom.getAllianceFulminationValue();
      break;
    case 'SFB':
      state.fbOrbCounter = dmgU.FIREBOUND_ORB_COUNT;f
      break;
    case 'FU':
      // Fuse is really just a Skyblaze
      let origSpell = spell;
      state.spell = utils.getSpellData('ES');
      calcTotalAvgDamage(state);
      state.spell = origSpell;

      // Only add one fuse proc since Fuse itself doesn't twincast (the way im implementing it)
      calcCompoundSpellProcDamage(state, update, dmgU.getCompoundSpellList('FU'), 'fuseProcDmg');
      break;
    case 'WF': case 'WE':
      calcCompoundSpellProcDamage(state, update, dmgU.getCompoundSpellList(spell.id));
      break;
  }
}

function applyPreSpellChecks(state, mod) {
  // Check for effects to cancel
  ['FPWR'].forEach(id => utils.checkSimpleTimer(state, id)); // simple timers
  utils.checkTimerList(state, 'clawTcCounter', 'clawTcTimers');
  utils.checkTimerList(state, 'flamesWeaknessCounter', 'flamesWeaknessTimers');

  // Update Storm of Many damage based on selected value
  // Start handling spell recast timer mods, etc here instead of in run or
  // using origRecastTimer or anything like that
  switch(state.spell.id) {
    case 'SM':
      state.spell.baseDmg = state.spell['baseDmg' + dom.getStormOfManyCountValue()];
      break;
    }
}

// Using Beimeth's post as a starting point for a lot of this
// http://elitegamerslounge.com/home/eqwizards/viewtopic.php?f=22&t=26
function calcAvgDamage(state, mod, dmgKey) {
  // Default to full strength
  // mod takes a percentage of results and counters if set
  mod = (mod === undefined) ? 1 : mod;

  // average damage
  let avgDmg = 0;

  // get SPA info
  let spaValues = dmgU.computeSPAs(state, mod).spaValues;

  if (state.spell.baseDmg > 0) {
    // Get Crit Dmg Multiplyer -- maybe keep this first since FD/AD counters modified in crit rate
    let critDmgMult = dmgU.getBaseCritDmg() + spaValues.addCritDmg;

    // Get Crit Rate
    let critRate = dmgU.getBaseCritRate() + spaValues.addCritRate;
    // Check for spells with max crit rate
    critRate = (state.spell.maxCritRate != undefined) ? state.spell.maxCritRate : critRate;
    // Check if we've gone over 100%
    critRate = (critRate > 1.0) ? 1.0 : critRate;

    // Get Effectiveness
    let effectiveness = getEffectiveness(state, spaValues) + dom.getAddEffectivenessValue();
    // Get Before Crit Focus
    let beforeCritFocus = getBeforeCritFocus(state, spaValues) + dom.getAddBeforeCritFocusValue();
    // Get Before Crit Add
    let beforeCritAdd = getBeforeCritAdd(state, spaValues) + dom.getAddBeforeCritAddValue();
    // Get Before DoT Crit Focus
    let beforeDoTCritFocus = getBeforeDoTCritFocus(state, spaValues, mod) + dom.getAddBeforeDoTCritFocusValue();
    // Get After Crit Focus
    let afterCritFocus = dom.getAddAfterCritFocusValue();
    // Get After Crit Add
    let afterCritAdd = getAfterCritAdd(state, spaValues) + dom.getAddAfterCritAddValue();
    // Get AfterCrit Add (SPA 484) (not modifiable)
    let afterCritAddNoMod = spaValues.afterCritAddNoMod + dom.getAddAfterCritAddNoModValue();
    // Get AfterCrit Focus (not modifiable)
    let afterCritFocusNoMod = spaValues.afterCritFocusNoMod + dom.getAddAfterCritFocusNoModValue();
    // Get New SPA 461 Focus
    let postCalcFocus = spaValues.postCalcFocus;

    // find avergage non crit
    let effDmg = state.spell.baseDmg + dmgU.trunc(state.spell.baseDmg * effectiveness);
    let beforeCritDmg = effDmg + dmgU.trunc(effDmg * beforeCritFocus) + beforeCritAdd;
    let beforeDoTCritDmg = dmgU.trunc(effDmg * beforeDoTCritFocus);
    let afterCritDmg = dmgU.trunc(effDmg * afterCritFocus) + afterCritAdd;

    // special case for manaburn. it's the only SPA 484 but 483 seems to get doubled with it
    // like it's counting as a 2nd hit? need to test with other kinds of after crit add
    let afterCritNoModDmg = (dmgU.trunc(effDmg * afterCritFocusNoMod) * (afterCritAddNoMod ? 2 : 1))+ afterCritAddNoMod;
    let avgBaseDmg = beforeCritDmg + beforeDoTCritDmg + afterCritDmg;
    let avgCritDmg = avgBaseDmg + dmgU.trunc(beforeCritDmg * critDmgMult);

    // add SPA 461 and after crit that's not modifiable (only based on effective damage)
    avgBaseDmg += dmgU.trunc(avgBaseDmg * postCalcFocus) + afterCritNoModDmg;
    avgCritDmg += dmgU.trunc(avgCritDmg * postCalcFocus) + afterCritNoModDmg;

    // save stats of everything we just calculated
    stats.updateSpellStatistics(state, 'critRate', critRate);
    stats.updateSpellStatistics(state, 'critDmgMult', critDmgMult);
    stats.updateSpellStatistics(state, 'effectiveness', effectiveness);
    stats.updateSpellStatistics(state, 'beforeCritFocus', beforeCritFocus);
    stats.updateSpellStatistics(state, 'beforeCritAdd', beforeCritAdd);
    stats.updateSpellStatistics(state, 'beforeDoTCritFocus', beforeDoTCritFocus);
    stats.updateSpellStatistics(state, 'afterCritFocus', afterCritFocus);
    stats.updateSpellStatistics(state, 'afterCritAdd', afterCritAdd);
    stats.updateSpellStatistics(state, 'afterCritFocusNoMod', afterCritFocusNoMod);
    stats.updateSpellStatistics(state, 'afterCritAddNoMod', afterCritAddNoMod);
    stats.updateSpellStatistics(state, 'postCalcFocus', postCalcFocus);
    stats.updateSpellStatistics(state, 'avgBaseDmg', avgBaseDmg);
    stats.updateSpellStatistics(state, 'avgCritDmg', avgCritDmg);

    // find average damage overall before additional twincasts
    avgDmg = (avgBaseDmg * (1.0 - critRate)) + avgCritDmg * critRate;

    // add twinproc dmg
    avgDmg += dmgU.canTwinproc(state.spell) ? avgDmg * dom.getTwinprocValue() : 0;

    // apply mod
    avgDmg = dmgU.trunc(avgDmg * mod);

    // Handle AE waves if current spell is an AE
    if (state.spell.target === 'AE' && !state.aeWave) {
      addAEWaves(state, mod, avgDmg);
    }

    // update totals
    stats.addSpellStatistics(state, 'totalDmg', avgDmg);

    // save avg damage of main spell
    let avgDmgKey = state.inTwincast ? 'tcAvgDmg' : 'avgDmg';
    if (!dmgKey || state.aeWave) {
      stats.addSpellStatistics(state, avgDmgKey, avgDmg);
    }

    // dont count twincast damage in AE Hits
    if (dmgKey && !(state.aeWave && state.inTwincast)) {
      stats.addSpellStatistics(state, dmgKey, avgDmg);
    }

    // update stats for main damage spells
    if (dmgU.isCastDetSpellOrAbility(state.spell)) {
      // save total crit rate including from twincats and procs plus associated count
      stats.addAggregateStatistics('critRate', critRate * mod);
      stats.addAggregateStatistics('spellCount', mod);

      if (!state.aeWave && critRate > 0) { // dont want Frostbound Fulmination showing up as 0
        // Update graph
        state.updatedCritRValues.push({ time: state.timeEst, y: Math.round(critRate * 100)});
        state.updatedCritDValues.push({ time: state.timeEst, y: Math.round(critDmgMult * 100)});
      }
    }

    if (!state.aeWave) {
      addSpellAndEqpProcs(state, mod);
    }
  }
 
  return {avgDmg: avgDmg, spaValues: spaValues};
}

function calcAvgMRProcDamage(state, mod, dmgKey) {
  // Mana reciprocation has a chance to proc more procs
  calcAvgProcDamage(state, utils.getSpellData('MR'), mod, dmgKey);
  calcAvgProcDamage(state, utils.getSpellData('MRR'), mod * 0.1, dmgKey);
  calcAvgProcDamage(state, utils.getSpellData('MRRR'), mod * 0.01, dmgKey);
  calcAvgProcDamage(state, utils.getSpellData('MRRRR'), mod * 0.001, dmgKey);
}

function calcAvgProcDamage(state, proc, mod, dmgKey) {
  // proc damage is based on normal spell damage modified by proc rate and whether or not
  // we're in a twincast
  let procRate = dmgU.getProcRate(state.spell, proc);
  let prevSpell = state.spell;

  state.spell = proc;
  calcAvgDamage(state, procRate * mod, dmgKey);
  state.spell = prevSpell;
}

function calcClawSpellAdd(state, current303SpellAdd, resistMatchChance, mod) {
  let value = current303SpellAdd;

  if (utils.isCounterActive(state, 'CLAW')) {
    // amount the any magic syllable would have increased over current SPA 303 value
    let anyIncrease = Math.trunc((dmgU.CLAW_PROC_ANY_DMG - current303SpellAdd) * dmgU.CLAW_PROC_ANY_CHANCE);
    // amount the any resistance specific syllable would have increased over current SPA 303 value
    let specificIncrease = Math.trunc((dmgU.CLAW_PROC_SPECIFIC_DMG - current303SpellAdd) * resistMatchChance);
    // amount increase (zero) that happens otherwise with a damage increasing claw proc
    let noIncrease = current303SpellAdd;

    let clawProcDmg = anyIncrease + specificIncrease + noIncrease;
    if (clawProcDmg > value) {
      // dont need to update statistics for this one (clawChargesUsed not used anywhere)
      value = Math.trunc(dmgU.processCounter(state, 'CLAW', mod, clawProcDmg));
    }
  }

  return value;
}

function calcCompoundSpellProcDamage(state, mod, spellList, dmgKey) {
  let origSpell = state.spell;
  let inTwincast = state.inTwincast;
  state.inTwincast = false;

  // spells like fuse and wildmagic require casting multiple spells and
  // averaging the results
  $(spellList).each(function(i, item) {
    state.spell = utils.getSpellData(item.id);

    // procs are their own un-twincasted spell but if they were triggered
    // from a twincast of the parent then record the damage there
    calcTotalAvgDamage(state, item.chance * mod, inTwincast ? 'tcAvgDmg' : dmgKey);
  });

  state.inTwincast = inTwincast;
  state.spell = origSpell;
}

function executeProc(id, state, mod, statId) {
  let value = 0;
  let key = statId ? statId : id;
  let proc = utils.getSpellData(id);

  // Procs like FW have counters set during updateSpellChart while Hedgewizards has none
  if (proc.id && state && proc != state.spell) {
    let dmgKey = utils.getCounterKeys(key).addDmg;
    (id != 'MR') ? calcAvgProcDamage(state, proc, mod, dmgKey) : calcAvgMRProcDamage(state, mod, dmgKey);

    // update counters if it uses them
    if (utils.isCounterActive(state, key)) {
      let chargesPer = (statId != 'DR') ? 1 : 1 + dmgU.getProcRate(state.spell, proc); // fix for DR issue
      dmgU.processCounter(state, key, mod * chargesPer);
    }
  }
}

export function* genDamageOverTime(state) {
  let dps = dom.getRemorselessServantDPSValue();
  let keys = utils.getCounterKeys('RS');
  let current = state.workingTime;
  
  while (dps > 0) {
    let result = (state[keys.counter] || 0) * dps * ((state.workingTime - current) / 1000);
    current = state.workingTime;
    yield result;
  }

  return 0;
}

function getAfterCritAdd(state, spaValues) {
  let afterCritAdd = spaValues.afterCritAdd;

  // AA SPA 286
  afterCritAdd += dmgU.getSorcerersVengeanceAdd(state.spell);

  // Worn SPA 286
  let belt = dom.getBeltProcValue();
  if (belt === '500-proconly' && dmgU.passReqs({focusable: true, spellOrEqpProc: true}, state)) {
    afterCritAdd += 500;
  } else if (belt === '1000-magic' && dmgU.passReqs({castSpellOnly: true, focusable: true, minManaCost: 10, resists: ['MAGIC']}, state)) {
    afterCritAdd += 1000;
  } else if (belt === '500-fire' && dmgU.passReqs({castSpellOnly: true, focusable: true, minManaCost: 10, resists: ['FIRE']}, state)) {
    afterCritAdd += 500;
  }

  return afterCritAdd;
}

function getBeforeCritAdd(state, spaValues) {
  let spell = state.spell;

  // Get Spell Damage
  let spellDmg = dmgU.getSpellDamage(spell);

  // The ranged augs seem to get stuck at 2x their damage
  if (spell.spellDmgCap !== undefined && spellDmg > spell.spellDmgCap) {
    spellDmg = spell.spellDmgCap;
  }

  stats.updateSpellStatistics(state, 'spellDmg', spellDmg);

  // calcClawSpellAdd(state, beforeCritAdd, dmgU.CLAW_PROC_MAGIC_CHANCE, mod);
  // FIX - add something for claw

  // type 3 aug is SPA 303
  return spellDmg + dom.getType3DmdAugValue(state.spell) + spaValues.beforeCritAdd;
}

function getBeforeCritFocus(state, spaValues) {
  let spell = state.spell;
  let beforeCritFocus = spaValues.beforeCritFocus;

  // Before Crit Focus AA (SPA 302) only for Focus: Ethereal Flash and Shocking Vortex
  if (['EF', 'SV', 'CF'].find(id => id === spell.id)) {
    beforeCritFocus = beforeCritFocus + dom.getSpellFocusAAValue(spell.id);
  }

  return beforeCritFocus;
}

function getBeforeDoTCritFocus(state, spaValues, mod) {
  let spell = state.spell;
  let value = 0;

  // Damage Focus Worn (SPA 124)
  value += dmgU.getWornDamageFocus(state.spell); 

  // Damage Focus AA (SPA 124)
  // AA seems to focus everything even spells labeled non focus
  value += dmgU.getDestructiveAdeptFocus(state.spell);

  // SPA 124 is all we really have right now being calculated
  let spa124Spell = spaValues.beforeDoTCritFocus;

  // Worn and Spell SPA 124 are generally max level but recent armor is max+5
  // always exclude AEs
  if (spell.level <= 110 && spell.target != 'AE') {
    // Do this one last
    // Net effect is to increase SPA 124 Spell by the difference between
    // Flames of Power and the current ability taking into account the counter
    // is based on Flames of Power only being available 25% of the time after
    // Fickle Conflag is used
    if (utils.isCounterActive(state, 'FPWR') && state.spell.manaCost >= 10) {
      if (dmgU.FLAMES_POWER_FOCUS > spa124Spell) {
        let powerRate = dmgU.getFickleRate(dmgU.FLAMES_POWER_RATE);
        let powerValue = (dmgU.FLAMES_POWER_FOCUS - spa124Spell) * powerRate;
        powerValue = dmgU.processCounter(state, 'FPWR', mod, powerValue);
        spa124Spell += powerValue;

        // Store rate which be based off mod during counter update
        if (!state.inTwincast) {
          stats.updateSpellStatistics(state, 'fpwr', powerValue);
        }
      }
    }

    // 1% of the time you get the Flames of Weakness rate and the rest the current rate
    if (state.flamesWeaknessCounter && state.spell.manaCost >= 10) {
      let totalRate = 0;
      let flamesRate = dmgU.getFickleRate(dmgU.FLAMES_WEAKNESS_RATE);
      let count = state.flamesWeaknessCounter;
      while (count > 0) {
        let mod = (count < 1) ? count : 1;
        totalRate += (flamesRate * mod);
        count--;
      }

      // When weakness is active all previous SPA 124 Spell is canceled out
      // Final value is weakness * chance that weakness happened + value if it didnt
      let weakness = dmgU.FLAMES_WEAKNESS_FOCUS * totalRate;
      spa124Spell = weakness + spa124Spell * (1.0 - totalRate);

      if (!state.inTwincast) {
        stats.updateSpellStatistics(state, 'fpwrWeaknessRate', totalRate);
      }
    }
  }

  // add SPA 124 spell
  value += spa124Spell;

  return value;
}

function getEffectiveness(state, spaValues) {
  let spell = state.spell;

  // Added the discRefresh checks solely for Firebound Orb since there's nothing
  // obvious why 413 doesn't work with it

  // Effectiveness Worn (SPA 413)
  // Robe focus only applies to Skyblaze and Fuse
  let robeFocus = (spell.id === 'ES' || spell.id === 'FU') ? dom.getRobeValue() : 0;
  let eyeOfDecay = (spell.level <= 110 && !spell.discRefresh) ? dom.getEyeOfDecayValue() : 0;  // Should be max level 110
  let effectiveness = (eyeOfDecay > robeFocus) ? eyeOfDecay : robeFocus;

  // Effectiveness Spell (SPA 413) Augmenting Aura
  effectiveness += spaValues.effectiveness;

  if (spell.id != 'EF' && spell.id != 'SV' && spell.id != 'CF') {
    // Effectiveness AA (SPA 413) Focus: Skyblaze, Rimeblast, etc
    effectiveness += dom.getSpellFocusAAValue(spell.id);
  }

  return effectiveness;
}


function getTwincastRate(state, spaValues) {
  let rate = spaValues.twincast;
  rate = (rate > 1.0) ? 1.0 : rate;

  if (rate) {
    stats.updateSpellStatistics(state, 'twincastRate', rate);
  }

  return rate;
}

function initFlames(state, update) {
  utils.initNumberProperties(state, ['flamesWeaknessCounter']);
  utils.initListProperties(state, ['flamesWeaknessTimers']);
  state.fpwrExpireTime = state.workingTime + dmgU.FLAMES_POWER_TIMER;
  state.fpwrCounter = (dom.getFlamesOfPowerValue() === 4) ? 2.0 : 1.0;

  // Count the number of potential weaknesses applied sort of like Claw
  state.flamesWeaknessCounter += update;
  state.flamesWeaknessTimers.push(utils.createTimer(state.workingTime + dmgU.FLAMES_WEAKNESS_TIMER, (value) => {value - update}));
}

export function calcTotalAvgDamage(state, mod, dmgKey) {
  // Default to full strength
  mod = (mod === undefined) ? 1 : mod;

  // add any pre spell cast checks
  applyPreSpellChecks(state);
  // avg damage for one spell cast
  let result = calcAvgDamage(state, mod, dmgKey);
  // add any post spell procs/mods before we're ready to
  // twincast another spell
  applyPostSpellEffects(state);

  // save rate so procs dont modify it
  let twincastRate = getTwincastRate(state, result.spaValues);

  // now twincast the spell
  if (twincastRate > 0 && !state.aeWave) {
    state.inTwincast = true;

    // add any pre spell cast checks required
    applyPreSpellChecks(state);
    calcAvgDamage(state, mod * twincastRate, dmgKey);
    // handle post checks
    applyPostSpellEffects(state, twincastRate);

    state.inTwincast = false;
  }

  return stats.getSpellStatistics(state, 'totalDmg') || 0; // Alliance
}