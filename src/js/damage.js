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
      // remove if execute failed to do anything
      if (!executeProc(item.proc, state, mod, item.id)) {
        state.spellProcAbilities.delete(item.id);
      }
    });

  // add eqp and aug procs
  dmgU.getEqpProcs(state.spell).forEach(id => { executeProc(id, state, mod, 'EQP') });
}

function applyPostSpellEffects(state, mod) {
  mod = (mod === undefined) ? 1 : mod;
  let spell = state.spell;

  // keep track of a counter based on main spell cast + twincast
  // average DPS sometimes goes down when it shouldnt because some gains
  // are lost during a small twincast. Check mod > 50% ? worth testing anyway
  // Same as with Arcomancy. I think this matters less for damage procs.
  // MSYN and others dont have as big an issue because they always start on main spell cast
  // VFX procs another one when it twincasts, etc
  let cfickleSpells;
  switch(spell.id) {
    case 'CF': case 'FC':
      cfickleSpells = 1;
      if (mod < 0.50) {
        state.cfickleSpells = mod;
        cfickleSpells = 0;
      } else { // this one is deciding what to increment by unlike ARCO
        cfickleSpells += state.cfickleSpells || 0;
        state.cfickleSpells = 0;
      }
      break;
  }

  switch(spell.resist) {
    case 'MAGIC':
      if (dmgU.isCastDetSpell(spell)) {
        state.magicSpells = mod + (state.magicSpells || 0);

        // keep track of a counter based on main spell cast + twincast
        // average DPS sometimes goes down when it shouldnt because some gains
        // are lost during a small twincast. Check mod > 50% ? worth testing anyway
        // Same as with Fickle. I think this matters less for damage procs.
        // MSYN and others dont have as big an issue because they always start on main spell cast
        // VFX procs another one when it twincasts, etc
        if (mod >= 0.50 && G.MODE === 'wiz' && state.enabledButInActive.has('ARCO') && state.magicSpells > dmgU.ARCO_PROC_RATE) {
          timeline.addSpellProcAbility(state, 'ARCO', 1, true);
          state.magicSpells = 0;
        }
      }
      break;
  }

  switch(spell.id) {
    // Claw of the Flameweaver + Mage Chaotic Fire
    case 'CF':
      // generate proc effects
      state.cfSpellProcGenerator.next(cfickleSpells).value.forEach(id => {
        if (id === 'REFRESH') {
          timeline.resetTimers(state);
        } else {
          timeline.addSpellProcAbility(state, id, 1, true);
        }
      });
      break;
    case 'FC':
      if (G.MODE === 'mag' && !state.inTwincast) {
        state.fcSpellProcGenerator.next(cfickleSpells).value.forEach(id => timeline.addSpellProcAbility(state, id, 1, true));
      }
      break;
    case 'SV':
      timeline.addSpellProcAbility(state, 'VFX', 1, true);
      timeline.addSpellProcAbility(state, 'WSYN', dom.getEvokersSynergyValue(), true);
      break;
    case 'RS':
      timeline.addSpellProcAbility(state, 'MSYN', dom.getConjurersSynergyValue(), true);

      let keys = utils.getCounterKeys('RS');
      if (state[keys.timers] === undefined) {
        state[keys.timers] = [];
      }

      state[keys.counter] = 1 + state[keys.counter] || 0;
      state[keys.timers].push(
        utils.createTimer(state.workingTime + dom.getRemorselessServantTTLValue(), (value) => { return value - 1; })
      );
      
      stats.updateSpellStatistics(state, 'rsDPS', dom.getRemorselessServantDPSValue() * state[keys.counter]);
      stats.updateSpellStatistics(state, keys.counter, state[keys.counter]);
      
      if (!state.dotGenerator) {
        state.dotGenerator = genDamageOverTime(state);
      }
      break;
    case 'FA':
      state[utils.getCounterKeys('FA').expireTime] = state.workingTime + dom.getAllianceFulminationValue();
      break;
    case 'SFB':
      state[utils.getCounterKeys('FBO').counter] = abilities.get('FBO').charges;
      break;
    case 'FU':
      // Fuse is really just a Skyblaze
      let origSpell = spell;
      state.spell = utils.getSpellData('ES');
      execute(state);
      state.spell = origSpell;

      // Only add one fuse proc since Fuse itself doesn't twincast (the way im implementing it)
      calcCompoundSpellProcDamage(state, mod, dmgU.getCompoundSpellList('FU'), 'fuseProcDmg');
      break;
    case 'WF': case 'WE':
      calcCompoundSpellProcDamage(state, mod, dmgU.getCompoundSpellList(spell.id));
      break;
  }
}

function applyPreSpellChecks(state, mod) {
  // Update Storm of Many damage based on selected value
  // Start handling spell recast timer mods, etc here instead of in run or
  // using origRecastTimer or anything like that
  switch(state.spell.id) {
    case 'CF':
      if (!state.cfSpellProcGenerator) {
        // Mage Chaotic Fire seems to twinproc its chaotic fire chance
        // so increase the counter by that amount
        let offset = G.MODE === 'mag' ? dom.getTwinprocAAValue() : 0.0;
        state.cfSpellProcGenerator = genSpellProc(dmgU.CF_SPELL_PROC_RATES[G.MODE], offset);
      }
      break;
    case 'FC':
      if (G.MODE === 'mag') {
        if (!state.fcSpellProcGenerator) {
          // AA modifies the proc chance
          let offset = 0;
          switch(dom.getFlamesOfPowerValue()) {
            case 1: offset = 0.27; break;
            case 2: offset = 0.30; break;
            case 3: case 4: offset = 0.34; break; 
          }
          state.fcSpellProcGenerator = genSpellProc(dmgU.FC_SPELL_PROC_RATES, offset);
        }
      }
      break;
    case 'SM':
      let baseDmg = state.spell['baseDmg' + dom.getStormOfManyCountValue()];
      state.spell.baseDmg = baseDmg || state.spell.baseDmg;
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

    // Get Spell Damage
    let spellDmg = calcSpellDamage(state);
    // Get Effectiveness
    let effectiveness = getEffectiveness(state, spaValues) + dom.getAddEffectivenessValue();
    // Get Before Crit Focus
    let beforeCritFocus = getBeforeCritFocus(state, spaValues) + dom.getAddBeforeCritFocusValue();
    // Get Before Crit Add
    let beforeCritAdd = dom.getType3DmdAugValue(state.spell) + spaValues.beforeCritAdd + dom.getAddBeforeCritAddValue();
    // Get Before DoT Crit Focus
    let beforeDoTCritFocus = spaValues.beforeDoTCritFocus + dom.getAddBeforeDoTCritFocusValue();
    // Get After Crit Focus
    let afterCritFocus = dom.getAddAfterCritFocusValue();
    // Get After Crit Add
    let afterCritAdd = spaValues.afterCritAdd + dom.getAddAfterCritAddValue();
    // Get AfterCrit Add (SPA 484) (not modifiable)
    let afterCritAddNoMod = spaValues.afterCritAddNoMod + dom.getAddAfterCritAddNoModValue();
    // Get AfterCrit Focus (not modifiable)
    let afterCritFocusNoMod = spaValues.afterCritFocusNoMod + dom.getAddAfterCritFocusNoModValue();
    // Get New SPA 461 Focus
    let postCalcFocus = spaValues.postCalcFocus;

    // find avergage non crit
    let effDmg = state.spell.baseDmg + dmgU.trunc(state.spell.baseDmg * effectiveness);
    let beforeCritDmg = effDmg + dmgU.trunc(effDmg * beforeCritFocus) + beforeCritAdd + spellDmg;
    let beforeDoTCritDmg = dmgU.trunc(effDmg * beforeDoTCritFocus);
    let afterCritDmg = dmgU.trunc(effDmg * afterCritFocus) + afterCritAdd;

    // special case for manaburn. it's the only SPA 484 but 483 seems to get doubled with it
    // like it's counting as a 2nd hit? need to test with other kinds of after crit add
    let afterCritNoModDmg = (dmgU.trunc(effDmg * afterCritFocusNoMod) * (afterCritAddNoMod ? 2 : 1)) + afterCritAddNoMod;
    let avgBaseDmg = beforeCritDmg + beforeDoTCritDmg + afterCritDmg;
    let avgCritDmg = avgBaseDmg + dmgU.trunc(beforeCritDmg * critDmgMult);

    // add SPA 461 and after crit that's not modifiable (only based on effective damage)
    avgBaseDmg += dmgU.trunc(avgBaseDmg * postCalcFocus) + afterCritNoModDmg;
    avgCritDmg += dmgU.trunc(avgCritDmg * postCalcFocus) + afterCritNoModDmg;

    // find average damage overall before additional twincasts
    avgDmg = (avgBaseDmg * (1.0 - critRate)) + avgCritDmg * critRate;

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

      // update core stats in main spell cast
      stats.updateSpellStatistics(state, 'critRate', critRate);
      stats.updateSpellStatistics(state, 'critDmgMult', critDmgMult);
      stats.updateSpellStatistics(state, 'spellDmg', spellDmg);
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

      if (!state.aeWave && critRate > 0) { // dont want Frostbound Fulmination showing up as 0
        // Update graph
        state.updatedCritRValues.push({time: state.timeEst, y: Math.round(critRate * 100)});
        state.updatedCritDValues.push({time: state.timeEst, y: Math.round(critDmgMult * 100)});
      }
    }

    // add spell procs last
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
  execute(state, procRate * mod, dmgKey);
  state.spell = prevSpell;
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
    execute(state, item.chance * mod, inTwincast ? 'tcAvgDmg' : dmgKey);
  });

  state.inTwincast = inTwincast;
  state.spell = origSpell;
}

function calcSpellDamage(state) {
  let spell = state.spell;

  // dicho/fuse needs to use an alternative time since it's really 2 spell casts
  // that get applied differently depending on what we're looking for
  var recastTime = spell.recastTime2 ? spell.recastTime2 : spell.recastTime;

  var totalCastTime = spell.origCastTime +
    ((recastTime > spell.lockoutTime) ? recastTime : spell.lockoutTime);

  var multiplier = dmgU.getMultiplier(totalCastTime);
  let spellDmg = Math.trunc(utils.asDecimal32Precision(dom.getSpellDamageValue() * multiplier));

  // The ranged augs seem to get stuck at 2x their damage
  if (spell.spellDmgCap !== undefined && spellDmg > spell.spellDmgCap) {
    spellDmg = spell.spellDmgCap;
  }

  return spellDmg;
}

function executeProc(id, state, mod, statId) {
  let value = 0;
  let key = statId ? statId : id;
  let keys = utils.getCounterKeys(key);
  let proc = utils.getSpellData(id);
  let partUsed = 1;

  // update counters if it uses them
  if (utils.isAbilityActive(state, key)) {
    let chargesPer = (statId != 'DR') ? 1 : 1 + dmgU.getProcRate(state.spell, proc); // fix for DR issue
    partUsed = dmgU.processCounter(state, key, mod * chargesPer);
  }

  if (partUsed > 0) { // if charges were consumed for abilities that need them
    partUsed = partUsed * mod;
    (id != 'MR') ? calcAvgProcDamage(state, proc, partUsed, keys.addDmg) : calcAvgMRProcDamage(state, partUsed, keys.addDmg);
  }

  return partUsed > 0;
}

function* genSpellProc(rateInfo, offset) {
  let count = 1 + offset;
  let lastProcCounts = [];

  if (rateInfo) {
    Object.keys(rateInfo).forEach(key => {
      lastProcCounts.push({ id: key, count: rateInfo[key] });
    });
  }
 
  while (true) {
    let incr = yield (
      lastProcCounts.filter(item => {
        if (count >= item.count) {
          item.count += rateInfo[item.id];
          return true;
        } else {
          return false;
        }
      }).map(item => item.id)
    );

    count += (incr + (offset * incr));
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

function getBeforeCritFocus(state, spaValues) {
  let spell = state.spell;
  let beforeCritFocus = spaValues.beforeCritFocus;

  // Before Crit Focus AA (SPA 302) only for Focus: Ethereal Flash and Shocking Vortex
  if (['EF', 'SV', 'CF'].find(id => id === spell.id)) {
    beforeCritFocus = beforeCritFocus + dom.getSpellFocusAAValue(spell.id);
  }

  return beforeCritFocus;
}

function getEffectiveness(state, spaValues) {
  let spell = state.spell;
  let effectiveness = spaValues.effectiveness;

    // Effectiveness AA (SPA 413) Focus: Skyblaze, Rimeblast, etc
  if (! ['EF', 'SV', 'CF'].find(id => id === spell.id)) {
    effectiveness += dom.getSpellFocusAAValue(spell.id);
  }

  return effectiveness;
}

function getTwincastRate(state, spaValues) {
  let rate = (spaValues.twincast > 1.0) ? 1.0 : spaValues.twincast;

  // prevent from procs from setting the stat for everything
  if (rate && dmgU.isCastDetSpellOrAbility(state.spell)) {
    stats.updateSpellStatistics(state, 'twincastRate', rate);
  }

  return rate;
}

export function execute(state, mod, dmgKey) {
  // Default to full strength
  mod = (mod === undefined) ? 1 : mod;

  // add any pre spell cast checks
  applyPreSpellChecks(state);
  // avg damage for one spell cast
  let result = calcAvgDamage(state, mod, dmgKey);
  // add any post spell procs/mods before we're ready to
  // twincast another spell
  applyPostSpellEffects(state);

  // get twincast rate
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