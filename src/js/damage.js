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

  switch(spell.id) {
    // Claw of the Flameweaver + Mage Chaotic Fire
    case 'CF':
      // generae proc effects
      state.cfSpellProcGenerator.next(mod).value.forEach(id => {
          if (id === 'REFRESH') {
            timeline.resetTimers(state);
          } else {
            timeline.addSpellProcAbility(state, id, true);
          }
      });
      break;
    case 'FC':
      state.fcSpellProcGenerator.next(mod).value.forEach(id => timeline.addSpellProcAbility(state, id, true));
      break;
    case 'SV':
      timeline.addSpellProcAbility(state, 'VFX', true);
      timeline.addSpellProcAbility(state, 'WSYN', true);
      break;
    case 'RS':
      timeline.addSpellProcAbility(state, 'MSYN', true);

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
        let offset = G.MODE === 'mag' ? dom.getTwinprocValue() : 0.0;
        state.cfSpellProcGenerator = genSpellProc(dmgU.CF_SPELL_PROC_RATES[G.MODE], offset);
      }
      break;
    case 'FC':
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
    let spellDmg = getSpellDamage(state);
    // Get Effectiveness
    let effectiveness = getEffectiveness(state, spaValues) + dom.getAddEffectivenessValue();
    // Get Before Crit Focus
    let beforeCritFocus = getBeforeCritFocus(state, spaValues) + dom.getAddBeforeCritFocusValue();
    // Get Before Crit Add
    let beforeCritAdd = dom.getType3DmdAugValue(state.spell) + spaValues.beforeCritAdd + dom.getAddBeforeCritAddValue();
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
    let beforeCritDmg = effDmg + dmgU.trunc(effDmg * beforeCritFocus) + beforeCritAdd + spellDmg;
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

function executeProc(id, state, mod, statId) {
  let value = 0;
  let key = statId ? statId : id;
  let proc = utils.getSpellData(id);
  let partUsed = 1;

  // update counters if it uses the
  if (utils.isAbilityActive(state, key)) {
    let chargesPer = (statId != 'DR') ? 1 : 1 + dmgU.getProcRate(state.spell, proc); // fix for DR issue
    partUsed = dmgU.processCounter(state, key, mod * chargesPer);
  }

  if (partUsed > 0) { // if charges were consumed for abilities that need them
    let dmgKey = utils.getCounterKeys(key).addDmg;
    (id != 'MR') ? calcAvgProcDamage(state, proc, mod, dmgKey) : calcAvgMRProcDamage(state, mod, dmgKey);
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

function getAfterCritAdd(state, spaValues) {
  let afterCritAdd = spaValues.afterCritAdd;

  // AA SPA 286
  if (G.MODE === 'wiz') {
    afterCritAdd += dmgU.getSorcerersVengeanceAdd(state.spell);
  }

  // Worn SPA 286
  afterCritAdd += dmgU.getBeltFocus(state.spell);

  return afterCritAdd;
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
  let value = spaValues.beforeDoTCritFocus; // Spell (SPA 124)

  // Ex: Flames of Weakness is negative and cancels everything out
  if (value >= 0) {
    // Damage Focus Worn (SPA 124)
    value += dmgU.getWornDamageFocus(state.spell); 

    // Damage Focus AA (SPA 124)
    // AA seems to focus everything even spells labeled non focus
    if (G.MODE === 'wiz') {
      value += dmgU.getDestructiveAdeptFocus(state.spell);
    }
  }

  return value;
}

function getEffectiveness(state, spaValues) {
  let spell = state.spell;

  // Added the discRefresh checks solely for Firebound Orb since there's nothing
  // obvious why 413 doesn't work with it

  // Effectiveness Worn (SPA 413)
  // Robe focus only applies to Skyblaze and Fuse
  let robeFocus = (spell.id === 'ES' || spell.id === 'FU') ? dom.getRobeValue() : 0;
  let eyeOfDecay = (spell.level <= 110 && spell.focusable) ? dom.getEyeOfDecayValue() : 0;
  let effectiveness = (eyeOfDecay > robeFocus) ? eyeOfDecay : robeFocus;

  // Effectiveness Spell (SPA 413) Augmenting Aura
  effectiveness += spaValues.effectiveness;

  if (spell.id != 'EF' && spell.id != 'SV' && spell.id != 'CF') {
    // Effectiveness AA (SPA 413) Focus: Skyblaze, Rimeblast, etc
    effectiveness += dom.getSpellFocusAAValue(spell.id);
  }

  return effectiveness;
}

function getSpellDamage(state) {
  let spell = state.spell;

  // Get Spell Damage
  let spellDmg = dmgU.getSpellDamage(spell);

  // The ranged augs seem to get stuck at 2x their damage
  if (spell.spellDmgCap !== undefined && spellDmg > spell.spellDmgCap) {
    spellDmg = spell.spellDmgCap;
  }

  return spellDmg;
}

function getTwincastRate(state, spaValues) {
  let spell = state.spell;

  let rate = spaValues.twincast + dmgU.getTwincastAA(spell) + dmgU.getTwinprocAA(spell);
  rate = (rate > 1.0) ? 1.0 : rate;

  if (rate) {
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