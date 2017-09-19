import {globals as G} from './settings.js';
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

function addSpellProcs(state, mod) {
  let time = state.workingTime;

  // should look these up at some point
  ['WSYN', 'MR', 'FW', 'AM', 'AHB']
    .filter(id => dmgU.getAbilityData(state, id))
    .forEach(id => { executeProc(id, state, mod) });
  
  // DR only timeline ability with proc at the moment
  if (timeline.getAdpsData(state, 'DR', state.workingTime)) {
    executeProc('DR', state, mod);
  }

  // add eqp and aug procs
  dmgU.getEqpProcs(state).forEach(id => { executeProc(id, state, mod, 'EQP') });

  switch (G.MODE) {
    case 'wiz':
      // add Arcane Fusion proc
      if (dom.isUsingArcaneFusion()) {
        if (dmgU.passReqs({minManaCost: 10, minCastTime: 3000, minDamage: 1, castSpellOnly: true}, state)) {
          executeProc(dom.getArcaneFusionValue(), state, mod, 'AFU');
        }
      }
      break;
    case 'mage':
      // TODO - if there are any
      break;
  }
}

// Using Beimeth's post as a starting point for a lot of this
// http://elitegamerslounge.com/home/eqwizards/viewtopic.php?f=22&t=26
function calcAvgDamage(state, mod, dmgKey) {
  // Default to full strength
  // mod takes a percentage of results and counters if set
  mod = (mod === undefined) ? 1 : mod;

  if (state.spell.baseDmg > 0) {
  // Get Crit Dmg Multiplyer -- maybe keep this first since FD/AD counters modified in crit rate
    let critDmgMult = getCritDmgMult(state, mod);
    // Get Crit Rate
    let critRate = getCritRate(state, mod);

    // Get Effectiveness
    let effectiveness = getEffectiveness(state.spell) + dom.getAddEffectivenessValue();
    // Get Before Crit Focus
    let beforeCritMult = getBeforeCritFocus(state, mod) + dom.getAddBeforeCritFocusValue();
    // Get Before Crit Add
    let beforeCritAdd = getBeforeCritAdd(state, mod) + dom.getAddBeforeCritAddValue();
    // Get After Crit Focus
    let afterCritMult = getAfterCritFocus(state, mod) + dom.getAddAfterCritFocusValue();
    // Get After Crit Add
    let afterCritAdd = getAfterCritAdd(state, mod) + dom.getAddAfterCritAddValue();
    // Get New SPA 461 Focus
    let postCalcMult = getPostCalcMult(state, mod);

    // find avergage non crit
    let effDmg = state.spell.baseDmg + dmgU.trunc(state.spell.baseDmg * effectiveness);
    let critFocusDmg = effDmg + dmgU.trunc(effDmg * beforeCritMult) + beforeCritAdd;
    let avgBaseDmg = critFocusDmg + dmgU.trunc(effDmg * afterCritMult) + afterCritAdd;

    // find average crit
    let avgCritDmg = avgBaseDmg + dmgU.trunc(critFocusDmg * critDmgMult);

    // apply post calculation modifier for SPA 461
    avgBaseDmg += dmgU.trunc(avgBaseDmg * postCalcMult);
    avgCritDmg += dmgU.trunc(avgCritDmg * postCalcMult);

    // save stats of everything we just calculated
    stats.updateSpellStatistics(state, 'critRate', critRate);
    stats.updateSpellStatistics(state, 'critDmgMult', critDmgMult);
    stats.updateSpellStatistics(state, 'effectiveness', effectiveness);
    stats.updateSpellStatistics(state, 'beforeCritMult', beforeCritMult);
    stats.updateSpellStatistics(state, 'beforeCritAdd', beforeCritAdd);
    stats.updateSpellStatistics(state, 'afterCritMult', afterCritMult);
    stats.updateSpellStatistics(state, 'afterCritAdd', afterCritAdd);
    stats.updateSpellStatistics(state, 'postCalcMult', postCalcMult);
    stats.updateSpellStatistics(state, 'avgBaseDmg', avgBaseDmg);
    stats.updateSpellStatistics(state, 'avgCritDmg', avgCritDmg);

    // find average damage overall before additional twincasts
    let avgDmg = (avgBaseDmg * (1.0 - critRate)) + avgCritDmg * critRate;

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
  }

  // calc damage of procs from this spell which include beneficial and other types
  if (!state.aeWave) {
    addSpellProcs(state, mod);
  }
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

function calcCompoundSpellDamage(state, mod, dmgKey, spellList) {
  let origSpell = state.spell;

  // spells like fuse and wildmagic require casting multiple spells and
  // averaging the results
  $(spellList).each(function(i, item) {
    state.spell = utils.getSpellData(item.id);
    calcTotalAvgDamage(state, item.chance * mod, dmgKey);
  });

  state.spell = origSpell;
}

function calcFuseDamage(state, mod) {
  // Fuse is really just a Skyblaze
  let origSpell = state.spell;
  state.spell = utils.getSpellData('ES');
  calcAvgDamage(state, mod);
  state.spell = origSpell;

  // Only add one fuse proc since Fuse itself doesn't twincast (the way im implementing it)
  if (!state.inTwincast) {
    calcCompoundSpellDamage(state, mod, 'fuseProcDmg', dmgU.getCompoundSpellList('FU'));
  }
}

function calcTwincastChance(state, mod) {
  let value = 0;

  // Added extra max level check to avoid special case for Dark Shield of Scholar
  if (dmgU.canTwincast(state.spell)) {
    if (!state.itcCounter || state.itcCounter <= 0 || state.spell.level >= 250) { // Dark Shield of Scholar hack
      // AA Twincast, Twincast Aura, and other passed in modifiers
      // Max sure it never goes over 100%
      value += (state.tcCounter + dom.getTwincastAAValue() + dom.getTwincastAuraValue());
      value = dmgU.getClawTwincastRate(state, value);
    } else {
      value = dmgU.processCounter(state, 'ITC', mod, 1);
    }
  }

  return (value > 1.0) ? 1.0 : value;
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

function getAfterCritAdd(state, mod) {
  let time = state.workingTime;
  let spell = state.spell;
  let afterCritAdd = 0;

  // AA SPA 286
  let sorcVeng = dom.getSorcererVengeananceValue() || 0; // lookup gets cached so mode not a big deal to check
  if (sorcVeng > 0 && dmgU.passReqs({minManaCost: 10, minCastTime: 1, focusable: true}, state)) {
    afterCritAdd = sorcVeng;
  }

  // Worn SPA 286
  let belt = dom.getBeltProcValue();
  if (belt === '500-proconly' && dmgU.passReqs({focusable: true, spellOrEqpProc: true}, state)) {
    afterCritAdd += 500;
  } else if (belt === '1000-magic' && dmgU.passReqs({castSpellOnly: true, focusable: true, minManaCost: 10, resists: ['MAGIC']}, state)) {
    afterCritAdd += 1000;
  } else if (belt === '500-fire' && dmgU.passReqs({castSpellOnly: true, focusable: true, minManaCost: 10, resists: ['FIRE']}, state)) {
    afterCritAdd += 500;
  }

  // SPA 286 Manaburn stacks with the others
  let mbrn = timeline.getAdpsData(state, 'MBRN', time, 'afterCritAdd');
  if (mbrn > 0) {
    afterCritAdd += Math.trunc(dmgU.processCounter(state, 'MBRN', mod, mbrn));
  }

  // Spell SPA 286 bard nilsara
  let nilsara = dmgU.getAbilityData(state, 'NILSARA', 'afterCritAdd') || 0;
  // Spell SPA 286 bard 2nd spire
  let b2 = timeline.getAdpsData(state, 'B2', time, 'afterCritAdd') || 0;
  
  afterCritAdd += Math.max(nilsara, b2);

  return afterCritAdd;
}

function getAfterCritFocus(state, mod) {
  let afterCritMult = 0;
  let spell = state.spell;
  let time = state.workingTime;

  // Damage Focus AA (SPA 124)
  // AA seems to focus everything even spells labeled non focus
  afterCritMult = dmgU.passReqs({focusable: true, minManaCost: 10}, state) ? dom.getDestructiveAdeptValue() : 0;

  // Worn and Spell SPA 124 are generally max level but recent armor is max+5
  // always exclude AEs
  if (spell.level <= 110 && spell.target != 'AE') {
    // Damage Focus Spell (SPA 124) Slot 1
    // avg pre-calculated (min+max) / 2 in spell data json
    let spa124Spell = dom.getPetDmgFocusValue();

    // Damge Focus Spell (SPA 124) Slot 1
    let bardFocus = dom.getAriaMaetanrusValue();
    spa124Spell = Math.max(spa124Spell, bardFocus);

    // Damage Focus Spell (SPA 124) Slot 1
    spa124Spell = Math.max(spa124Spell, timeline.getAdpsData(state, 'EU', time, 'afterCritMult') || 0);

    // Damage Focus Spell (SPA 124) Slot 1
    spa124Spell = Math.max(spa124Spell, timeline.getAdpsData(state, 'HF', time, 'afterCritMult') || 0);

    // Do this one last
    // Net effect is to increase SPA 124 Spell by the difference between
    // Flames of Power and the current ability taking into account the counter
    // is based on Flames of Power only being available 25% of the time after
    // Fickle Conflag is used
    if (utils.isCounterActive(state, 'FPWR') && state.spell.manaCost >= 10) {
      if (dmgU.FLAMES_POWER_FOCUS > spa124Spell) {
        let powerRate = dmgU.getFickleRate(dmgU.FLAMES_POWER_RATE);
        let value = (dmgU.FLAMES_POWER_FOCUS - spa124Spell) * powerRate;
        value = dmgU.processCounter(state, 'FPWR', mod, value);
        spa124Spell += value;

        // Store rate which be based off mod during counter update
        if (!state.inTwincast) {
          stats.updateSpellStatistics(state, 'fpwr', value);
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

    // add SPA 124 spell
    afterCritMult += spa124Spell;

    // Damage Focus Worn (SPA 124)
    // avg pre-calculated (min+max) / 2 in spell data json
    afterCritMult += dom.getAvgWornDamageFocus(spell.resist);
  }

  // Spell Focus Amount (SPA 483) Tash
  afterCritMult += (spell.level <= 110) ? dom.getLingeringCryValue() : 0;

  return afterCritMult;
}

function getBeforeCritAdd(state, mod) {
  let spell = state.spell;

  // Get Spell Damage
  let spellDmg = dmgU.getSpellDamage(spell);

  // The ranged augs seem to get stuck at 2x their damage
  if (spell.spellDmgCap !== undefined && spellDmg > spell.spellDmgCap) {
    spellDmg = spell.spellDmgCap;
  }

  stats.updateSpellStatistics(state, 'spellDmg', spellDmg);

  // Before Crit Worn (SPA 303) Before Crit Type3 Augs
  // Include SpellDmg in before crit ADD
  let beforeCritAdd = spellDmg + dom.getType3DmdAugValue(state.spell);

  // + Before Crit Spell (SPA 303) Fury of Ro,Kera, etc
  // Fury of Kera/Ro, etc
  return beforeCritAdd + getSPA303Spell(state, mod);
}

function getBeforeCritFocus(state, mod) {
  // Before Crit Focus (SPA 302) + Spell DMG% Incoming (SPA 296)
  return getSPA302Focus(state, mod) + getSPA296Focus(state, mod);
}

function getCritRate(state, mod) {
  let rate = state.critRate;
  let critRateAdd = 0;
  
  // Arcane Destruction
  if (!state.spell.discRefresh) { // AAs for example gain crit dmg but not rate
    let adRate = timeline.getAdpsData(state, 'AD', state.workingTime, 'critRateMod') || 0;
    if (adRate > 0) {
      critRateAdd += dmgU.processCounter(state, 'AD', mod, adRate);
      dmgU.applyDichoBug(state, 'AD'); // dicho uses extra counters
    } else {
      // Frenzied Devestation if AD wasn't used
      let fdRate = timeline.getAdpsData(state, 'FD', state.workingTime, 'critRateMod') || 0;
      if (fdRate > 0) {
        critRateAdd += dmgU.processCounter(state, 'FD', mod, fdRate);
        dmgU.applyDichoBug(state, 'FD'); // dicho uses extra counters
      }
    }
  }

  // Mana Charge seems to always get used up no matter what and the rate
  // is really high so overriding one of these others isn't really an issue
  let mc = timeline.getAdpsData(state, 'MC', state.workingTime, 'critRateMod') || 0;
  if (mc > 0) {
    critRateAdd += dmgU.processCounter(state, 'MC', mod, mc);
  }

  // How the game works right now is that Dicho and AA Nukes will crit 100% of the time with CH running
  // and will not use a charge. Other spells will use it but will also use AD/FD if it's up
  // So let the crit damage section worry about subtracting charges and don't mind that AD is wasted
  // here considering it has a lower crit rate than Chromatic Haze
  let ch = timeline.getAdpsData(state, 'CH', state.workingTime, 'critRateMod') || 0;
  if (ch > 0) {
    critRateAdd += ch;
  } else {
    critRateAdd += dmgU.getAbilityData(state, 'EHAZY', 'critRateMod') || 0;
  }
  
  // add critRateAdd
  rate += critRateAdd;
  // Check for spells with max crit rate
  rate = (state.spell.maxCritRate != undefined) ? state.spell.maxCritRate : rate;
  // Check if we've gone over 100%
  rate = (rate > 1.0) ? 1.0 : rate;

  return rate;
}

function getCritDmgMult(state, mod) {
  let mult = state.critDmgMult;
  let keys = utils.getCounterKeys('NSYN');

  // Crit DMG Focus Spell (SPA 170)
  // AA Nukes and aug procs will increase in crit damage without using a charge
  if (state[keys.counter] > 0) {
    mult += dmgU.NEC_SYNERGY_PERCENT;
    if (dmgU.isCastDetSpell(state.spell)) {
      state[keys.counter]--;
      stats.addSpellStatistics(state, keys.charges, 1);
    }
  }

  // Crit DMG Focus Spell (SPA 170)
  // Mana Charge is on Slot 2 and seems to work with everything but always uses charges
  // Which are handled in crit rate section
  if (state.mcCounter > 0) {
    mult += utils.readAdpsOption('MC', 'critDmgMod') / 100;
  }

  // Crit DMG Focus Spell (SPA 170)
  // Need to verify stacking
  // FD counters handled in crit rate section
  // AA Nukes and aug procs will increase in crit damage without using a charge
  let fdDmg = timeline.getAdpsData(state, 'FD', state.workingTime, 'critDmgMod') || 0;
  if (fdDmg > 0) {
    mult += dmgU.processCounter(state, 'FD', mod, fdDmg, true);
  }

  return mult;
}

function getEffectiveness(spell) {
  // Added the discRefresh checks solely for Firebound Orb since there's nothing
  // obvious why 413 doesn't work with it

  // Effectiveness Worn (SPA 413)
  // Robe focus only applies to Skyblaze and Fuse
  let robeFocus = (spell.id === 'ES' || spell.id === 'FU') ? dom.getRobeValue() : 0;
  let eyeOfDecay = (spell.level <= 110 && !spell.discRefresh) ? dom.getEyeOfDecayValue() : 0;  // Should be max level 110
  let effectiveness = (eyeOfDecay > robeFocus) ? eyeOfDecay : robeFocus;

  // Effectiveness Spell (SPA 413) Augmenting Aura
  effectiveness += (spell.manaCost >= 10 && spell.level <= 105 && !spell.discRefresh) ? dom.getAugmentingAuraValue() : 0;

  if (spell.id != 'EF' && spell.id != 'SV' && spell.id != 'CF') {
    // Effectiveness AA (SPA 413) Focus: Skyblaze, Rimeblast, etc
    effectiveness += dom.getSpellFocusAAValue(spell.id);
  }

  return effectiveness;
}

function getPostCalcMult(state, mod) {
  let value = dmgU.getAbilityData(state, 'ESYN', 'postCalcMult') || 0;
  
  if (value > 0) {
    value = dmgU.processCounter(state, 'ESYN', mod, value);
  }

  return value;
}

function getSPA296Focus(state, mod) {
  let beforeCritMult = 0;
  let time = state.workingTime;

  if (dmgU.passReqs({focusable: true, maxLevel: 110}, state)) {
    // Before Crit Focus Spell (SPA 296)
    if (utils.isCounterActive(state, 'VFX') && dmgU.passReqs({minManaCost: 100}, state)) {
      beforeCritMult = dmgU.AVG_VORTEX_FOCUS;
      beforeCritMult = dmgU.processCounter(state, 'VFX', mod, beforeCritMult);
    }

    // Before Crit Focus Spell (SPA 296) Season's Wrath
    let swValue = timeline.getAdpsData(state, 'SW', time, 'beforeCritMult') || 0;

    let debuff = 0;
    switch(state.spell.resist) {
      case 'FIRE':
        // Before Crit Focus Spell (SPA 296) Fire Only
        beforeCritMult = (beforeCritMult > swValue) ? beforeCritMult : swValue;
        debuff = dom.getSeedlingsValue();
        break;
      case 'ICE':
        // Before Crit Focus Spell (SPA 296) Ice Only
        beforeCritMult = (beforeCritMult > swValue) ? beforeCritMult : swValue;
        debuff = dom.getBlizzardBreathValue();
        break;
      case 'MAGIC':
        // Before Crit Focus Spell (SPA 296) Magic Only
        debuff = dom.getMaloValue();
        break;
    }

    beforeCritMult = (beforeCritMult > debuff) ? beforeCritMult : debuff;
  }

  return beforeCritMult;
}

function getSPA302Focus(state, mod) {
  let spell = state.spell;
  let beforeCritMult = 0;

  // Before Crit Focus AA (SPA 302) only for Focus: Ethereal Flash and Shocking Vortex
  if (['EF', 'SV', 'CF'].find(id => id === spell.id)) {
    beforeCritMult += dom.getSpellFocusAAValue(spell.id);
  }

  // Before Crit Focus Spell (SPA 302)
  let spa302SpellValue = 0;

  let ch, ehazy = 0;
  // add level check for crit damage only
  if (dmgU.passReqs({ minManaCost: 10, minDamage: 100, maxLevel: 110 }, state)) {
    // Chromatic Haze
    ch = timeline.getAdpsData(state, 'CH', state.workingTime, 'beforeCritMult') || 0;
    // Gift of Chromatic Haze
    ehazy = dmgU.getAbilityData(state, 'EHAZY', 'beforeCritMult') || 0;
  }

  // Conjurer's Synergy I
  let msyn = dmgU.getAbilityData(state, 'MSYN', 'beforeCritMult') || 0;

  if (ch > ehazy) {
    if (ch > msyn) {
      spa302SpellValue = dmgU.processCounter(state, 'CH', mod, ch);
    } else if (ch) { // check they all weren't zero
      spa302SpellValue = dmgU.processCounter(state, 'MSYN', mod, msyn) || 0;
    }
  } else {
    if (ehazy > msyn) {
      spa302SpellValue = dmgU.processCounter(state, 'EHAZY', mod, ehazy);
    } else if(msyn) { // check they all weren't zero
      spa302SpellValue = dmgU.processCounter(state, 'MSYN', mod, msyn) || 0;
    }
  }

  // Arcane Fury
  let af = timeline.getAdpsData(state, 'AF', state.workingTime, 'beforeCritMult') || 0;
  beforeCritMult += Math.max(af, spa302SpellValue);

  return beforeCritMult;
}

function getSPA303Spell(state, mod) {
  let time = state.workingTime;
  let beforeCritAdd = 0;

  if (state.spell.isFocusable) {
    // Before Crit Add Spell (SPA 303) Magic/Fire/Ice
    let furyKera = 0;
    // checking for AB since disease from hedgewizards doesnt get benefit but disease
    // from weapon procs do for some reason
    if (timeline.getAdpsData(state, 'FURYKERA', time)) {
      beforeCritAdd = furyKera = dmgU.FURY_KERA_DMG;
    }

    switch(state.spell.resist) {
      case 'FIRE':
        // Fury of Ro XIII
        if (timeline.getAdpsData(state, 'FURYRO', time)) {
          beforeCritAdd = Math.max(beforeCritAdd, dmgU.FURY_RO_DMG);
        } else {
          beforeCritAdd = furyKera;
        }

        // Handle Claw of Flameweaver which doesn't stack with Fury Of X
        beforeCritAdd = calcClawSpellAdd(state, beforeCritAdd, dmgU.CLAW_PROC_FIRE_CHANCE, mod);
        break;
      case 'ICE':
        // Fury of Eci XIII
        if (timeline.getAdpsData(state, 'FURYECI', time)) {
          beforeCritAdd = Math.max(beforeCritAdd, dmgU.FURY_ECI_DMG);
        } else {
          beforeCritAdd = furyKera;
        }

        // Handle Claw of Flameweaver which doesn't stack with Fury Of X
        beforeCritAdd = calcClawSpellAdd(state, beforeCritAdd, dmgU.CLAW_PROC_ICE_CHANCE, mod);
        break;
      case 'MAGIC':
        // Fury of Druzzil XIII
        if (timeline.getAdpsData(state, 'FURYDRUZ', time)) {
           beforeCritAdd = Math.max(beforeCritAdd, dmgU.FURY_DRUZ_DMG);
        } else {
          beforeCritAdd = furyKera;
        }

        // Handle Claw of Flameweaver which doesn't stack with Fury Of X
        beforeCritAdd = calcClawSpellAdd(state, beforeCritAdd, dmgU.CLAW_PROC_MAGIC_CHANCE, mod);
        break;
    }
  }

  let drData = timeline.getAdpsData(state, 'DR', time);
  if (drData && dmgU.passReqs(drData.requirements, state)) {
    // Enc Dicho, charges are accounted for when procs are handled
    let drChargePer = 1 + dmgU.getProcRate(state.spell, utils.getSpellData('DR'));
    let value = utils.readAdpsOption('DR', 'beforeCritAdd');
    value = Math.trunc(dmgU.processCounter(state, 'DR', mod * drChargePer, value, true));
    beforeCritAdd = Math.max(value, beforeCritAdd); // they dont stack
  }

  return beforeCritAdd;
}

function lookupCalcDmgFunction(spell) {
  switch(spell.id) {
    case 'WF': case 'WE':
      return function(arg1, arg2, arg3) {
        return calcCompoundSpellDamage(arg1, arg2, arg3, dmgU.getCompoundSpellList(spell.id));
      };
    case 'FU':
      return calcFuseDamage;
    default:
      return calcAvgDamage;
  }
}

export function calcTotalAvgDamage(state, mod, dmgKey) {
  // Default to full strength
  mod = (mod === undefined) ? 1 : mod;

  // abilities enabled on the ADPS timeline that have counters
  // needs to be called every time since counters are modified by procs/twincasts
  timeline.initCounterBasedADPS(state);

  // add any pre spell cast checks
  dmgU.applyPreSpellProcs(state, timeline);

  // current twincast rate before procs may increase it
  // set this early so Wildflash gets its value updated... should fix
  let twincastChance = calcTwincastChance(state, mod);
  stats.updateSpellStatistics(state, 'twincastChance', twincastChance);

  // avg damage for one spell cast
  lookupCalcDmgFunction(state.spell)(state, mod, dmgKey);

  // add any post spell procs/mods before we're ready to
  // twincast another spell
  dmgU.applyPostSpellProcs(state, timeline);

  // now twincast the spell
  if (twincastChance > 0 && !state.aeWave) {
    // add any pre spell cast checks required
    dmgU.applyPreSpellProcs(state, twincastChance, timeline);

    // cast twincast and increment the inTwincast state for cases like
    // wildether where it can twincast from a twincast so we don't turn the property off
    state.inTwincast = (state.inTwincast > 0) ? state.inTwincast + 1 : 1;
    lookupCalcDmgFunction(state.spell)(state, mod * twincastChance, dmgKey);

    // handle post checks
    dmgU.applyPostSpellProcs(state, timeline, twincastChance);
    state.inTwincast--;
  }

  // post checks for counter based ADPS
  timeline.postCounterBasedADPS(state);

  return stats.getSpellStatistics(state, 'totalDmg') || 0; // Alliance
}