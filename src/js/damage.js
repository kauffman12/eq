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

function addIndividualProcs(state, mod) {
  let time = state.workingTime;

  // be sure to add Evoker's Synergy before post spell so vortex doesn't get used up right away
  ['WSYN', 'MR', 'FW']
    .filter(id => utils.isCounterActive(state, id))
    .forEach(id => { executeProc(id, state, mod) });

  // enc dicho
  if (utils.isCounterActive(state, 'DR')) {
    executeProc('DRS6', state, mod, 'DR');
  }

  // add Ancient Hedgewizard Brew procs
  if (dom.isUsingHedgewizard()) {
    executeProc('AB', state, mod);
  }

  // add eqp aug procs
  [ dom.getStaffProcValue(), dom.getBeltProcValue(), dom.getRangeAugValue(), dom.getDPSAug1AugValue(),
    dom.getDPSAug2AugValue(), dom.getShieldProcValue() ]
      .filter(id => id !== 'NONE')
      .forEach(id => { executeProc(id, state, mod, 'EQP') });


  switch (G.MODE) {
    case 'wiz':
      // add Arcane Fusion proc
      if (dom.isUsingArcaneFusion()) {
        executeProc(dom.getArcaneFusionValue(), state, mod, 'AFU');
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

  let avgDmg = 0;
  let avgDmgKey = state.inTwincast ? 'tcAvgDmg' : 'avgDmg';

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
    let postCalcMult = getPostCalcMult(state);

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
    addIndividualProcs(state, mod);
  }
}

function calcAvgMRProcDamage(state, mod, dmgKey) {
  calcAvgProcDamage(state, utils.getSpellData('MR'), mod, dmgKey);
  calcAvgProcDamage(state, utils.getSpellData('MRR'), mod * 0.1, dmgKey);
  calcAvgProcDamage(state, utils.getSpellData('MRRR'), mod * 0.01, dmgKey);
  calcAvgProcDamage(state, utils.getSpellData('MRRRR'), mod * 0.001, dmgKey);
}

function calcAvgProcDamage(state, proc, mod, dmgKey) {
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

  // Only add one fuse proc since Fuse itself
  // doesn't twincast
  if (!state.inTwincast) {
    calcCompoundSpellDamage(state, mod, 'fuseProcDmg', dmgU.getCompoundSpellList('FU'));
  }
}

function calcTwincastChance(state, mod) {
  let value = 0;

  // Added extra max level check to avoid special case for Dark Shield of Scholar
  if (dmgU.passRequirements({canTwincast: true, maxLevel: 250}, state)) {
    if (!state.itcCounter || state.itcCounter <= 0) {
      // AA Twincast, Twincast Aura, and other passed in modifiers
      // Max sure it never goes over 100%
      value += (state.twincastChance + dom.getTwincastAAValue() + dom.getTwincastAuraValue());

      // Add tc chance from claw procs taking out value which would negate the need
      if (state.clawTcProcRate > 0) {
        let scaledValue = ((1 - value) * state.clawTcProcRate + (1 - state.clawTcProcRate) * value);
        value = (value > scaledValue) ? value : scaledValue;
      }
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
    if (dmgU.passRequirements(proc.requirements, state)) {
      let dmgKey = utils.getCounterKeys(key).addDmg;
      (id != 'MR') ? calcAvgProcDamage(state, proc, mod, dmgKey) : calcAvgMRProcDamage(state, mod, dmgKey);

      // update counters if it uses them
      if (utils.isCounterActive(state, key)) {
        let chargesPer = (statId != 'DR') ? 1 : 1 + dmgU.getProcRate(state.spell, proc); // fix for DR issue
        dmgU.processCounter(state, key, mod * chargesPer);
      }
    }
  }
}

function getAfterCritAdd(state, mod) {
  let time = state.workingTime;
  let spell = state.spell;
  let afterCritAdd = 0;
  let belt = dom.getBeltProcValue();

  if (spell.manaCost >= 10 && !spell.discRefresh) {
    afterCritAdd = spell.origCastTime > 0 ? dom.getSorcererVengeananceValue() : 0;
  }

  if (spell.manaCost >= 10 && spell.resist === 'FIRE' && spell.level <= 105 && spell.target != 'AE') {
    afterCritAdd += dom.getNilsaraAriaValue();  // SPA 286
  }

  if (belt === '500-proconly' && spell.level >= 254 && spell.manaCost === 0) {
    afterCritAdd += 500;
  } else if (belt === '1000-magic' && spell.manaCost >= 10 && !spell.discRefresh && spell.resist === 'MAGIC') {
    afterCritAdd += 1000;
  } else if (belt === '500-fire' && spell.manaCost >= 10 && !spell.discRefresh && spell.resist === 'FIRE') {
    afterCritAdd += 500;
  }
  
  // Enc Dicho, charges are accounted for when procs are handled
  if (timeline.getAdpsDataIfActive('MBRN', time)) {
    let adpsOption = utils.readAdpsOption('MBRN');
    
    if (dmgU.passRequirements(adpsOption.requirements, state)) {
      afterCritAdd += Math.trunc(dmgU.processCounter(state, 'MBRN', mod, adpsOption.afterCritAdd));
    }
  }

  return afterCritAdd;
}

function getAfterCritFocus(state, mod) {
  let afterCritMult = 0;
  let spell = state.spell;
  let time = state.workingTime;

  // Damage Focus AA (SPA 124)
  // AA seems to focus everything even spells labeled non focus
  afterCritMult = (spell.manaCost >= 10 && !spell.discRefresh) ? dom.getDestructiveAdeptValue() : 0;

  // Worn and Spell SPA 124 are generally max level but recent armor is max+5
  // always exclude AEs
  if (spell.level <= 110 && spell.target != 'AE') {
    // Damage Focus Spell (SPA 124) Slot 1
    // avg pre-calculated (min+max) / 2 in spell data json
    let spa124Spell = dom.getPetDmgFocusValue();

    // Damge Focus Spell (SPA 124) Slot 1
    let bardFocus = dom.getAriaMaetanrusValue();
    spa124Spell = (spa124Spell > bardFocus) ? spa124Spell : bardFocus;

    // Damge Focus Spell (SPA 124) Slot 1
    let elementalUnion = timeline.getElementalUnionValue(time);
    spa124Spell = (spa124Spell > elementalUnion) ? spa124Spell : elementalUnion;

    // Damge Focus Spell (SPA 124) Slot 1
    let heartFlames = timeline.getHeartOfFlamesValue(time);
    spa124Spell = (spa124Spell > heartFlames) ? spa124Spell : heartFlames;

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
  let beforeCritAdd = spellDmg + dom.getType3AugValue(state.spell);

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

  let addition = 0;
  let usedAD = false;
  if (utils.isCounterActive(state, 'AD') && !state.aeWave && state.spell.manaCost > 0 && !state.spell.discRefresh) {
    addition = utils.readAdpsOption('AD', 'critRateMod') / 100;
    addition = dmgU.processCounter(state, 'AD', mod, addition);
    dmgU.applyDichoBug(state, 'AD');
    usedAD = true;
  }

  if (utils.isCounterActive(state, 'FD') && !usedAD && !state.aeWave && state.spell.manaCost > 0 && !state.spell.discRefresh) {
    addition = utils.readAdpsOption('FD', 'critRateMod') / 100;
    addition = dmgU.processCounter(state, 'FD', mod, addition);
    dmgU.applyDichoBug(state, 'FD');
  }

  // Mana Charge seems to always get used up no matter what and the rate
  // is really high so overriding one of these others isn't really an issue
  // FIXME - There is stacking issue with 2nd spire or something going on
  if (utils.isCounterActive(state, 'MC')) {
    addition = utils.readAdpsOption('MC', 'critRateMod') / 100;
    addition = dmgU.processCounter(state, 'MC', mod, addition);
  }

  // Chromatic Haze charges considered in other section
  // How the game works right now is that Dicho and AA Nukes will crit 100% of the time with CH running
  // and will not use a charge. Other spells will use it but will also use AD/FD if it's up
  // So let the crit damage section worry about subtracting charges and don't mind that AD is wasted
  // here considering it has a lower crit rate than Chromatic Haze
  if (utils.isCounterActive(state, 'CH') && state.spell.manaCost >= 10) {
    addition = utils.readAdpsOption('CH', 'critRateMod') / 100;
  } else if(utils.isCounterActive(state, 'EHAZY')) {
    addition = dmgU.ENC_HAZY_CRIT_RATE; // It's 100% so addition would be maxed out in almost all these cases
  }

  // add addition
  rate += addition;
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
  if (utils.isCounterActive(state, 'FD')) {
    let fdMod = utils.readAdpsOption('FD', 'critDmgMod') / 100;
    fdMod = (state.spell.manaCost > 0 && state.spell.level <= 250) ?
      dmgU.processCounter(state, 'FD', mod, fdMod, true) : fdMod;
    mult += fdMod;
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

function getPostCalcMult(state) {
  let value = 0;

  if (utils.isCounterActive(state, 'ESYN') &&
    dmgU.passRequirements({ maxLevel: 249, resists: ['FIRE', 'MAGIC', 'ICE']}, state)) {
      value = dmgU.ENC_SYNERGY_PERCENT;
      stats.addSpellStatistics(state, utils.getCounterKeys('ESYN').charges, 1);
      state[utils.getCounterKeys('ESYN').counter]--;
  }

  return value;
}

function getSPA296Focus(state, mod) {
  let beforeCritMult = 0;
  let time = state.workingTime;

  if (dmgU.passRequirements({focusable: true, maxLevel: 110}, state)) {
    // Before Crit Focus Spell (SPA 296)
    if (utils.isCounterActive(state, 'VFX') && dmgU.passRequirements({minManaCost: 100}, state)) {
      beforeCritMult = dmgU.AVG_VORTEX_FOCUS;
      beforeCritMult = dmgU.processCounter(state, 'VFX', mod, beforeCritMult);
    }

    // Before Crit Focus Spell (SPA 296) Season's Wrath
    let swValue = timeline.getAdpsDataIfActive('SW', time, 'beforeCritFocus') || 0; 

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
  let spa302SpellValue = 0

  let ch, ehazy = 0;
  if (dmgU.passRequirements({ minManaCost: 10, minDamage: 100, maxLevel: 110 }, state)) {
    // Chromatic Haze
    ch = utils.isCounterActive(state, 'CH') ? utils.readAdpsOption('CH', 'critDmgMod') / 100 : 0;
    // Gift of Chromatic Haze
    ehazy = utils.isCounterActive(state, 'EHAZY') ? dmgU.ENC_HAZY_FOCUS : 0;  
  }
  
  let msyn = 0;
  if (dmgU.passRequirements({ minDamage: 100, maxLevel: 250, resists: ['FIRE', 'CHROMATIC'] }, state)) {
    // Conjurer's Synergy I
    msyn = utils.isCounterActive(state, 'MSYN') ?  dmgU.MAG_SYNERGY_PERCENT : 0;
  }

  if (ch > ehazy) {
    if (ch > msyn) {
      spa302SpellValue = dmgU.processCounter(state, 'CH', mod, ch);
    } else if (ch) { // check they all weren't zero
      spa302SpellValue = dmgU.processCounter(state, 'MSYN', mod, msyn);
    }
  } else {
    if (ehazy > msyn) {
      spa302SpellValue = dmgU.processCounter(state, 'EHAZY', mod, ehazy);
    } else if(msyn) { // check they all weren't zero
      spa302SpellValue = dmgU.processCounter(state, 'MSYN', mod, msyn);
    }
  }

  if (dmgU.passRequirements({ minManaCost: 10, maxLevel: 110 }, state)) {
    // Arcane Fury
    let arcaneFury = timeline.getArcaneFuryValue(state.workingTime);
    beforeCritMult += ((arcaneFury > spa302SpellValue) ? arcaneFury : spa302SpellValue);
  }
  
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
    if (timeline.getAdpsDataIfActive('FURYKERA', time)) {
      beforeCritAdd = furyKera = dmgU.FURY_KERA_DMG;
    }

    switch(state.spell.resist) {
      case 'FIRE':
        // Fury of Ro XIII
        if (timeline.getAdpsDataIfActive('FURYRO', time)) {
          beforeCritAdd = (beforeCritAdd > dmgU.FURY_RO_DMG) ? beforeCritAdd : dmgU.FURY_RO_DMG;
        } else {
          beforeCritAdd = furyKera;
        }

        // Handle Claw of Flameweaver which doesn't stack with Fury Of X
        beforeCritAdd = calcClawSpellAdd(state, beforeCritAdd, dmgU.CLAW_PROC_FIRE_CHANCE, mod);
        break;
      case 'ICE':
        // Fury of Eci XIII
        if (timeline.getAdpsDataIfActive('FURYECI', time)) {
          beforeCritAdd = (beforeCritAdd > dmgU.FURY_ECI_DMG) ? beforeCritAdd : dmgU.FURY_ECI_DMG;
        } else {
          beforeCritAdd = furyKera;
        }

        // Handle Claw of Flameweaver which doesn't stack with Fury Of X
        beforeCritAdd = calcClawSpellAdd(state, beforeCritAdd, dmgU.CLAW_PROC_ICE_CHANCE, mod);
        break;
      case 'MAGIC':
        // Fury of Druzzil XIII
        if (timeline.getAdpsDataIfActive('FURYDRUZ', time)) {
           beforeCritAdd = (beforeCritAdd > dmgU.FURY_DRUZ_DMG) ? beforeCritAdd : dmgU.FURY_DRUZ_DMG;
        } else {
          beforeCritAdd = furyKera;
        }

        // Handle Claw of Flameweaver which doesn't stack with Fury Of X
        beforeCritAdd = calcClawSpellAdd(state, beforeCritAdd, dmgU.CLAW_PROC_MAGIC_CHANCE, mod);
        break;
    }
  }

  let drData = timeline.getAdpsDataIfActive('DR', time);
  if (drData && dmgU.passRequirements(drData.requirements, state)) {
    // Enc Dicho, charges are accounted for when procs are handled
    let drChargePer = 1 + dmgU.getProcRate(state.spell, utils.getSpellData('DRS6'));
    let value = utils.readAdpsOption('DR', 'beforeCritAdd');
    value = Math.trunc(dmgU.processCounter(state, 'DR', mod * drChargePer, value, true));
    beforeCritAdd = (value > beforeCritAdd) ? value : beforeCritAdd; // they dont stack
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
  dmgU.applyPreSpellProcs(state);

  // avg damage for one spell cast
  lookupCalcDmgFunction(state.spell)(state, mod, dmgKey);

  // add any post spell procs/mods before we're ready to
  // twincast another spell
  dmgU.applyPostSpellProcs(state);

  // Current twincast rate before procs may increase it
  let twincastChance = calcTwincastChance(state, mod);

  // now twincast the spell
  if (twincastChance > 0 && !state.aeWave) {
    // add any pre spell cast checks required
    dmgU.applyPreSpellProcs(state, twincastChance);

    // cast twincast and increment the inTwincast state for cases like
    // wildether where it can twincast from a twincast so we don't turn the property off
    state.inTwincast = (state.inTwincast > 0) ? state.inTwincast + 1 : 1;
    lookupCalcDmgFunction(state.spell)(state, mod * twincastChance, dmgKey);

    // handle post checks
    dmgU.applyPostSpellProcs(state, twincastChance);
    state.inTwincast--;
  }

  // post checks for counter based ADPS
  timeline.postCounterBasedADPS(state);

  stats.updateSpellStatistics(state, 'twincastChance', twincastChance);
  return stats.getSpellStatistics(state.chartIndex).get('totalDmg') || 0; // Alliance
}