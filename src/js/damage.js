var dom = require('./dom.js');
var stats = require('./stats.js');
var utils = require('./utils.js');
var dmgUtils = require('./damage.utils.js');

// specified during API calls
var timeline;

var addAEWaves = function(state, mod, current) {
  var value = 0;
  stats.updateSpellStatistics(state, 'aeHit1', current);

  // Only support AE rain spells right now. Add two more waves but
  // without procs
  state.aeWave = true;

  // for each additional wave
  for (var i=1; i<dom.getAERainHitsValue(); i++) {
    var wave = calcAvgDamage(state, mod);
    value += wave;
    stats.updateSpellStatistics(state, 'aeHit' + (i+1), wave);
    stats.addSpellStatistics(state, 'newTotal', wave);
  }

  state.aeWave = false;
  return value;
};

var addIndividualProcs = function(state, mod) {
  var value = 0;
  var time = state.workingTime;

  // be sure to add Evoker's Synergy before post spell so vortex doesn't get used up right away
  $(['WSYN', 'MR', 'FW']).each(function(i, id) {
    value += utils.isCounterActive(state, id) ? executeProc(id, state, mod) : 0;
  });
  
  // enc dicho
  value += utils.isCounterActive(state, 'DR') ? executeProc('DRS6', state, mod, 'DR') : 0;
  
  // add Ancient Hedgewizard Brew procs
  value += dom.isUsingHedgewizard() ? executeProc('AB', state, mod) : 0;
  
  // add eqp aug procs
  $(dom.getEqpProcIDs()).each(function(i, id) {
    value += executeProc(id, state, mod, 'EQP');
  });

  switch (MODE) {
    case 'wiz':
      // add Arcane Fusion proc
      value += dom.isUsingArcaneFusion() ? executeProc(dom.getArcaneFusionValue(), state, mod, 'AFU') : 0;
      break;
    case 'mage':
      // TODO - if there are any
      break;
  }

  return value;
};

// Using Beimeth's post as a starting point for a lot of this
// http://elitegamerslounge.com/home/eqwizards/viewtopic.php?f=22&t=26
var calcAvgDamage = function(state, mod) {
  // Default to full strength
  // mod takes a percentage of results and counters if set
  mod = (mod == undefined) ? 1 : mod;

  // average damage
  var avgDmg = 0;

  if (state.spell.type != 'beneficial') {
    // Get Crit Dmg Multiplyer -- maybe keep this first since FD/AD counters modified in crit rate
    var critDmgMult = getCritDmgMult(state, mod);
    // Get Crit Rate
    var critRate = getCritRate(state, mod);

    // Get Effectiveness
    var effectiveness = getEffectiveness(state.spell) + dom.getAddEffectivenessValue();
    // Get Before Crit Focus
    var beforeCritMult = getBeforeCritFocus(state, mod) + dom.getAddBeforeCritFocusValue();
    // Get Before Crit Add
    var beforeCritAdd = getBeforeCritAdd(state, mod) + dom.getAddBeforeCritAddValue();
    // Get After Crit Focus
    var afterCritMult = getAfterCritFocus(state, mod) + dom.getAddAfterCritFocusValue();
    // Get After Crit Add
    var afterCritAdd = getAfterCritAdd(state.spell) + dom.getAddAfterCritAddValue();
    // Get New SPA 461 Focus
    var postCalcMult = getPostCalcMult(state);

    // find avergage non crit
    var effDmg = state.spell.baseDmg + Math.trunc(utils.asDecimal32Precision(state.spell.baseDmg * effectiveness));
    var critFocusDmg = effDmg + Math.trunc(utils.asDecimal32Precision(effDmg * beforeCritMult)) + beforeCritAdd;
    var avgBaseDmg = critFocusDmg + Math.trunc(utils.asDecimal32Precision(effDmg * afterCritMult)) + afterCritAdd;
    // find average crit
    var avgCritDmg = avgBaseDmg + Math.trunc(utils.asDecimal32Precision(critFocusDmg * critDmgMult));
    // apply post calculation modifier for SPA 461
    avgBaseDmg += Math.trunc(avgBaseDmg * postCalcMult);
    avgCritDmg += Math.trunc(avgCritDmg * postCalcMult);

    // find average damage overall before additional twincasts
    avgDmg = Math.trunc((avgBaseDmg * (1.0 - critRate)) + avgCritDmg * critRate);
    // apply mod
    avgDmg = Math.trunc(avgDmg * mod);

    // Handle AE waves if current spell is an AE
    avgDmg += (state.spell.target == 'AE' && !state.aeWave) ? addAEWaves(state, mod, avgDmg) : 0;

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

    if (!state.inTwincast && !state.aeWave) {
      // Update graph
      if (state.spell.manaCost > 0) {
        state.updatedCritRValues.push({ time: state.timeEst, y: Math.round(critRate * 100)});
        state.updatedCritDValues.push({ time: state.timeEst, y: Math.round(critDmgMult * 100)});
      }
      
      stats.updateSpellStatistics(state, 'avgDmg', avgDmg);
    } else if (state.inTwincast && state.spell.level <= 110 && !state.aeWave) {
      stats.addSpellStatistics(state, 'tcAvgDmg', avgDmg);
    }
    
    if (state.inFuseProc && state.spell.level <= 110) {
      stats.addSpellStatistics(state, 'fuseProcDmg', avgDmg);  
    }
  }

  // calc damage of procs from this spell
  return avgDmg += state.aeWave ? 0 : addIndividualProcs(state, mod);
};

var calcAvgMRProcDamage = function(state, mod) {
  return Math.trunc(
    calcAvgProcDamage(state, utils.getSpellData('MR'), mod) +
    calcAvgProcDamage(state, utils.getSpellData('MRR'), mod) * 0.1 +
    calcAvgProcDamage(state, utils.getSpellData('MRRR'), mod) * 0.01 +
    calcAvgProcDamage(state, utils.getSpellData('MRRRR'), mod) * 0.001
  );
};

var calcAvgProcDamage = function(state, proc, mod) {
  var procRate = dmgUtils.getProcRate(state.spell, proc);
  var prevSpell = state.spell;

  state.spell = proc;
  var value = calcAvgDamage(state, procRate * mod);
  state.spell = prevSpell;

  // add twinproc dmg
  return (value += (proc.level > 254 && proc.manaCost == 0) ? Math.trunc(value * dom.getTwinprocValue()) : 0);
};

var calcClawProcDamage = function(state, current303SpellAdd, resistMatchChance, mod) {
  var value = current303SpellAdd;

  if (utils.isCounterActive(state, 'CLAW')) {
    // amount the any magic syllable would have increased over current SPA 303 value
    var anyIncrease = Math.trunc((CLAW_PROC_ANY_DMG - current303SpellAdd) * CLAW_PROC_ANY_CHANCE);
    // amount the any resistance specific syllable would have increased over current SPA 303 value
    var specificIncrease = Math.trunc((CLAW_PROC_SPECIFIC_DMG - current303SpellAdd) * resistMatchChance);
    // amount increase (zero) that happens otherwise with a damage increasing claw proc
    var noIncrease = current303SpellAdd;

    var clawProcDmg = anyIncrease + specificIncrease + noIncrease;
    if (clawProcDmg > value) {
      // dont need to update statistics for this one (clawChargesUsed not used anywhere)
      value = Math.trunc(dmgUtils.processCounter(state, 'CLAW', mod, clawProcDmg));
    }
  }

  return value;
};

var calcCompoundSpellDamage = function(state, mod, spellList) {
  var value = 0;
  var origSpell = state.spell;
  
  $(spellList).each(function(i, item) {
    state.spell = utils.getSpellData(item.id);
    state.childId = item.id;
    value += Math.trunc(calcTotalAvgDamage(state, item.chance * mod));
  });

  delete state.childId;
  state.spell = origSpell;
  return value;
};

var calcFuseDamage = function(state, mod) {
  var value = 0;
  
  // Fuse is really just a Skyblaze
  state.spell = utils.getSpellData('ES');
  var origSpell = state.spell;
  value = calcAvgDamage(state, mod);
  state.spell = origSpell;
  
  // Only add one fuse proc since Fuse itself
  // doesn't twincast
  if (!state.inTwincast) {  
    state.inFuseProc = true;
    value += calcCompoundSpellDamage(state, mod, utils.getCompoundSpellList('FU'));
    state.inFuseProc = false;
  }
  
  return value;
};

var calcTotalAvgDamage = function(state, mod) {
  // Default to full strength
  mod = (mod == undefined) ? 1 : mod;

  // initialize counter based ADPS Arcane Destruction
  timeline.initCounterBasedADPS(state, 'AD');
  // initialize counter based ADPS Frenzied Devestation
  timeline.initCounterBasedADPS(state, 'FD');
  // initialize counter based ADPS Improved Twincast
  timeline.initCounterBasedADPS(state, 'ITC');
  // initialize counter based ADPS Chromatic Haze
  timeline.initCounterBasedADPS(state, 'CH');
  // initialize counter based ADPS Mana Charge
  timeline.initCounterBasedADPS(state, 'MC');
  // initialize counter based ADPS Dichotomic Reinforcement 6
  timeline.initCounterBasedADPS(state, 'DR');

  // add any pre spell cast checks required
  dmgUtils.applyPreSpellProcs(state);

  // avg damage for one spell cast
  var avgDmg = (state.spell.type != 'debuff') ? lookupCalcDmgFunction(state.spell)(state, mod) : 0;

  // Current twincast rate before procs may increase it
  var twincastChance = (state.spell.canTwincast) ? calcTwincastChance(state, mod) : 0;

  // add any post spell procs/mods before we're ready to
  // twincast another spell
  dmgUtils.applyPostSpellProcs(state);

  // now twincast the spell
  if (twincastChance > 0 && !state.aeWave) {
    // add any pre spell cast checks required
    dmgUtils.applyPreSpellProcs(state, twincastChance);

    // cast twincast and increment the inTwincast state for cases like
    // wildether where it can twincast from a twincast so we don't turn the property off
    state.inTwincast = (state.inTwincast > 0) ? state.inTwincast + 1 : 1;
    var twincastDmg = Math.trunc(lookupCalcDmgFunction(state.spell)(state, mod * twincastChance));
    state.inTwincast--;

    // add additional damage
    avgDmg += twincastDmg;

    // handle post checks
    dmgUtils.applyPostSpellProcs(state, twincastChance);
  }

  // post checks for counter based ADPS
  timeline.postCounterBasedADPS(state, 'AD', 'adCounter');
  timeline.postCounterBasedADPS(state, 'FD', 'fdCounter');
  timeline.postCounterBasedADPS(state, 'ITC', 'itcCounter');
  timeline.postCounterBasedADPS(state, 'CH', 'chCounter');
  timeline.postCounterBasedADPS(state, 'MC', 'mcCounter');
  timeline.postCounterBasedADPS(state, 'DR', 'drCounter');

  stats.updateSpellStatistics(state, 'twincastChance', twincastChance);
  return avgDmg;
};

var calcTwincastChance = function(state, mod) {
  var value = 0;

  if (state.spell.canTwincast) {
    if (!state.itcCounter || state.itcCounter <= 0) {
      // AA Twincast, Twincast Aura, and other passed in modifiers
      // Max sure it never goes over 100%
      value += (state.twincastChance + dom.getTwincastAAValue() + dom.getTwincastAuraValue());

      // Add tc chance from claw procs taking out value which would negate the need
      if (state.clawTcProcRate > 0) {
        var scaledValue = ((1 - value) * state.clawTcProcRate + (1 - state.clawTcProcRate) * value);
        value = (value > scaledValue) ? value : scaledValue;
      }
    } else {
      value = dmgUtils.processCounter(state, 'ITC', mod, 1);
    }
  }

  return (value > 1.0) ? 1.0 : value;
};

var executeProc = function(id, state, mod, statId) {
  var value = 0;
  var key = statId ? statId : id;
  var proc = utils.getSpellData(id);

  // Procs like FW have counters set during updateSpellChart while Hedgewizards has none
  if (proc.id && state && proc != state.spell) {
    if (dmgUtils.passRequirements(proc.requirements, state)) {
      value = (id != 'MR') ? calcAvgProcDamage(state, proc, mod) : calcAvgMRProcDamage(state, mod);

      // update counters if it uses them
      if (utils.isCounterActive(state, key)) {
        var chargesPer = (statId != 'DR') ? 1 : 1 + dmgUtils.getProcRate(state.spell, proc); // fix for DR issue
        value = Math.trunc(dmgUtils.processCounter(state, key, mod * chargesPer, value));
      }

      stats.addSpellStatistics(state, utils.getCounterKeys(key).addDmg, value);
    }
  }

  return value;
};

var getAfterCritAdd = function(spell) {
  var value = 0;
  var belt = dom.getBeltProcValue();

  if (spell.manaCost >= 10 && !spell.discRefresh) {
    value = spell.origCastTime > 0 ? dom.getSorcererVengeananceValue() : 0;
  }

  if (spell.manaCost >= 10 && spell.resist == 'FIRE' && spell.level <= 105 && spell.target != 'AE') {
    value += dom.getNilsaraAriaValue();  // SPA 286
  }

  if (belt == '500-proconly' && spell.level >= 254 && spell.manaCost == 0) {
    value += 500;
  } else if (belt == '1000-magic' && spell.manaCost >= 10 && !spell.discRefresh && spell.resist == 'MAGIC') {
    value += 1000;
  } else if (belt == '500-fire' && spell.manaCost >= 10 && !spell.discRefresh && spell.resist == 'FIRE') {
    value += 500;
  }

  return value;
};

var getAfterCritFocus = function(state, mod) {
  var afterCritMult = 0;
  var spell = state.spell;
  var time = state.workingTime;

  // Damage Focus AA (SPA 124)
  // AA seems to focus everything even spells labeled non focus
  var afterCritMult = (spell.manaCost >= 10 && !spell.discRefresh) ? dom.getDestructiveAdeptValue() : 0;

  // Worn and Spell SPA 124 generally exclude AEs
  if (spell.level <= 105 && spell.target != 'AE') {
    // Damage Focus Spell (SPA 124) Slot 1
    // avg pre-calculated (min+max) / 2 in spell data json
    var spa124Spell = dom.getPetDmgFocusValue();

    // Damge Focus Spell (SPA 124) Slot 1
    var bardFocus = dom.getAriaMaetanrusValue();
    spa124Spell = (spa124Spell > bardFocus) ? spa124Spell : bardFocus;

    // Damge Focus Spell (SPA 124) Slot 1
    var elementalUnion = timeline.getElementalUnionValue(time);
    spa124Spell = (spa124Spell > elementalUnion) ? spa124Spell : elementalUnion;

    // Damge Focus Spell (SPA 124) Slot 1
    var heartFlames = timeline.getHeartOfFlamesValue(time);
    spa124Spell = (spa124Spell > heartFlames) ? spa124Spell : heartFlames;

    // Do this one last
    // Net effect is to increase SPA 124 Spell by the difference between
    // Flames of Power and the current ability taking into account the counter
    // is based on Flames of Power only being available 25% of the time after
    // Fickle Conflag is used
    if (utils.isCounterActive(state, 'FPWR') && state.spell.manaCost >= 10) {
      if (FLAMES_POWER_FOCUS > spa124Spell) {
        var powerRate = dmgUtils.getFickleRate(FLAMES_POWER_RATE);
        var value = (FLAMES_POWER_FOCUS - spa124Spell) * powerRate;
        value = dmgUtils.processCounter(state, 'FPWR', mod, value);
        spa124Spell += value;

        // Store rate which be based off mod during partial counter
        if (!state.inTwincast) {
          stats.updateSpellStatistics(state, 'fpwr', value);
        }
      }
    }

    // 1% of the time you get the Flames of Weakness rate and the rest the current rate
    if (state.flamesWeaknessCounter && state.spell.manaCost >= 10) {
      var totalRate = 0;
      var flamesRate = dmgUtils.getFickleRate(FLAMES_WEAKNESS_RATE);
      var count = state.flamesWeaknessCounter;
      while (count > 0) {
        var mod = (count < 1) ? count : 1;
        totalRate += (flamesRate * mod);
        count--;
      }

      // When weakness is active all previous SPA 124 Spell is canceled out
      // Final value is weakness * chance that weakness happened + value if it didnt
      var weakness = FLAMES_WEAKNESS_FOCUS * totalRate;
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
};

var getBeforeCritAdd = function(state, mod) {
  var spell = state.spell;

  // Get Spell Damage
  var spellDmg = dmgUtils.getSpellDamage(spell);

  // The ranged augs seem to get stuck at 2x their damage
  if (spell.spellDmgCap && spellDmg > spell.spellDmgCap) {
    spellDmg = spell.spellDmgCap;
  }

  stats.updateSpellStatistics(state, 'spellDmg', spellDmg);

  // Before Crit Worn (SPA 303) Before Crit Type3 Augs
  // Include SpellDmg in before crit ADD
  var beforeCritAdd = state.spell.isZeroFocusable ? 0 : spellDmg + dom.getType3AugValue(state.spell);

  // + Before Crit Spell (SPA 303) Fury of Ro,Kera, etc
  // Fury of Kera/Ro, etc
  return beforeCritAdd + getSPA303Spell(state, mod);
};

var getBeforeCritFocus = function(state, mod) {
  // Before Crit Focus (SPA 302) + Spell DMG% Incoming (SPA 296)
  return getSPA302Focus(state, mod) + getSPA296Focus(state, mod);
};

var getCritRate = function(state, mod) {
  var rate = state.critRate;

  var addition = 0;
  var usedAD = false;
  if (utils.isCounterActive(state, 'AD') && !state.aeWave && state.spell.manaCost > 0 && !state.spell.discRefresh) {
    addition = utils.readAdpsOption('AD', 'critRateMod') / 100;
    addition = dmgUtils.processCounter(state, 'AD', mod, addition);
    dmgUtils.applyDichoBug(state, 'AD');
    usedAD = true;
  }

  if (utils.isCounterActive(state, 'FD') && !usedAD && !state.aeWave && state.spell.manaCost > 0 && !state.spell.discRefresh) {
    addition = utils.readAdpsOption('FD', 'critRateMod') / 100;
    addition = dmgUtils.processCounter(state, 'FD', mod, addition);
    dmgUtils.applyDichoBug(state, 'FD');
  }

  // Mana Charge seems to always get used up no matter what and the rate
  // is really high so overriding one of these others isn't really an issue
  // FIXME - There is stacking issue with 2nd spire or something going on
  if (utils.isCounterActive(state, 'MC')) {
    addition = utils.readAdpsOption('MC', 'critRateMod') / 100;
    addition = dmgUtils.processCounter(state, 'MC', mod, addition);
  }

  // Chromatic Haze charges considered in other section
  // How the game works right now is that Dicho and AA Nukes will crit 100% of the time with CH running
  // and will not use a charge. Other spells will use it but will also use AD/FD if it's up
  // So let the crit damage section worry about subtracting charges and don't mind that AD is wasted
  // here considering it has a lower crit rate than Chromatic Haze
  if (utils.isCounterActive(state, 'CH') && state.spell.manaCost >= 10) {
    addition = utils.readAdpsOption('CH', 'critRateMod') / 100;
  } else if(utils.isCounterActive(state, 'EHAZY')) {
    addition = ENC_HAZY_CRIT_RATE; // It's 100% so addition would be maxed out in almost all these cases
  }

  // add addition
  rate += addition;
  // Check for spells with max crit rate
  rate = (state.spell.maxCritRate != undefined) ? state.spell.maxCritRate : rate;
  // Check if we've gone over 100%
  rate = (rate > 1.0) ? 1.0 : rate;

  return rate;
};

var getCritDmgMult = function(state, mod) {
  var mult = state.critDmgMult;
  var keys = utils.getCounterKeys('NSYN');

  // Crit DMG Focus Spell (SPA 170)
  // AA Nukes and aug procs will increase in crit damage without using a charge
  if (state[keys.counter] > 0) {
    mult += NEC_SYNERGY_PERCENT;
    if (state.spell.manaCost > 0 && state.spell.level <= 250) {
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
    var fdMod = utils.readAdpsOption('FD', 'critDmgMod') / 100;
    fdMod = (state.spell.manaCost > 0 && state.spell.level <= 250) ?
      dmgUtils.processCounter(state, 'FD', mod, fdMod, true) : fdMod;
    mult += fdMod;
  }

  return mult;
};

var getEffectiveness = function(spell) {
  var effectiveness = 0;

  // Added the discRefresh checks solely for Firebound Orb since there's nothing
  // obvious why 413 doesn't work with it

  // Effectiveness Worn (SPA 413)
  // Robe focus only applies to Skyblaze and Fuse
  var robeFocus = (spell.id == 'ES' || spell.id == 'FU') ? dom.getRobeValue() : 0;
  var eyeOfDecay = (spell.level <= 110 && !spell.discRefresh) ? dom.getEyeOfDecayValue() : 0;  // Should be max level 110
  var effectiveness = (eyeOfDecay > robeFocus) ? eyeOfDecay : robeFocus;

  // Effectiveness Spell (SPA 413) Augmenting Aura
  effectiveness += (spell.manaCost >= 10 && spell.level <= 105 && !spell.discRefresh) ? dom.getAugmentingAuraValue() : 0;

  if (spell.id != 'EF' && spell.id != 'SV' && spell.id != 'CF') {
    // Effectiveness AA (SPA 413) Focus: Skyblaze, Rimeblast, etc
    effectiveness += dom.getSpellFocusAAValue(spell.id);
  }

  return effectiveness;
};

var getPostCalcMult = function(state) {
  var value = 0;
  
  if (utils.isCounterActive(state, 'ESYN') && state.spell.level <= 249) {
    value = ENC_SYNERGY_PERCENT;
    stats.addSpellStatistics(state, utils.getCounterKeys('ESYN').charges, 1);
    state[keys.counter]--;
  }
  
  return value;
};

var getSPA296Focus = function(state, mod) {
  var beforeCritMult = 0;
  var time = state.workingTime;

  if (state.spell.manaCost > 0 && state.spell.level <= 110) {
    // Before Crit Focus Spell (SPA 296)
    if (utils.isCounterActive(state, 'VFX') && state.spell.manaCost >= 100) {
      beforeCritMult = AVG_VORTEX_FOCUS;
      beforeCritMult = dmgUtils.processCounter(state, 'VFX', mod, beforeCritMult);
    }

    // Before Crit Focus Spell (SPA 296) Season's Wrath
    var swValue = timeline.getAdpsDataIfActive('SW', time, 'beforeCritFocus') || 0;
    beforeCritMult = (beforeCritMult > swValue) ? beforeCritMult : swValue;

    var debuff = 0;
    switch(state.spell.resist) {
      case 'FIRE':
        // Before Crit Focus Spell (SPA 296) Fire Only
        debuff = dom.getSeedlingsValue();
        break;
      case 'ICE':
        // Before Crit Focus Spell (SPA 296) Ice Only
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
};

var getSPA302Focus = function(state, mod) {
  var spell = state.spell;
  var beforeCritMult = 0;

  // Before Crit Focus AA (SPA 302) only for Focus: Ethereal Flash and Shocking Vortex
  if (spell.id == 'EF' || spell.id == 'SV' || spell.id == 'CF') {
    beforeCritMult += dom.getSpellFocusAAValue(spell.id);
  }

  // Before Crit Focus Spell (SPA 302)
  // Add level 105 check to CH maybe
  if (spell.manaCost >= 10 && spell.level <= 110) {
    var spa302SpellValue = 0

    // Chromatic Haze
    var ch = utils.isCounterActive(state, 'CH') ? utils.readAdpsOption('CH', 'critDmgMod') / 100 : 0;
    // Gift of Chromatic Haze
    var ehazy = utils.isCounterActive(state, 'EHAZY') ? ENC_HAZY_FOCUS : 0;
    // Conjurer's Synergy I
    var msyn = (spell.resist == 'FIRE' && utils.isCounterActive(state, 'MSYN')) ?  MAG_SYNERGY_PERCENT : 0;

    if (ch > ehazy) {
      if (ch > msyn) {
        spa302SpellValue = dmgUtils.processCounter(state, 'CH', mod, ch);
      } else if (ch) {
        spa302SpellValue = dmgUtils.processCounter(state, 'MSYN', mod, msyn);
      }
    } else {
      if (ehazy > msyn) {
        spa302SpellValue = dmgUtils.processCounter(state, 'EHAZY', mod, ehazy);
      } else if(msyn) {
        spa302SpellValue = dmgUtils.processCounter(state, 'MSYN', mod, msyn);
      }
    }

    // Arcane Fury
    var arcaneFury = timeline.getArcaneFuryValue(state.workingTime);
    beforeCritMult += ((arcaneFury > spa302SpellValue) ? arcaneFury : spa302SpellValue);
  }

  return beforeCritMult;
};

var getSPA303Spell = function(state, mod) {
  var time = state.workingTime;
  var spell = state.spell;
  var beforeCritAdd = 0;

  // Definitely eliminate Evoker's Synergy, Arcane Fusion
  // May need additional check in the future since weapon procs benefit from SPA 303 somehow
  if (!spell.isZeroFocusable && !spell.discRefresh) {
    // Before Crit Add Spell (SPA 303) Magic/Fire/Ice
    var furyKera = 0;
    // checking for AB since disease from hedgewizards doesnt get benefit but disease
    // from weapon procs do for some reason
    if (spell.id != 'AB' && spell.resist != 'OS' && timeline.getAdpsDataIfActive('FURYKERA', time)) {
      beforeCritAdd = furyKera = FURY_KERA_DMG;
    }

    switch(spell.resist) {
      case 'FIRE':
        // Fury of Ro XIII
        if (timeline.getAdpsDataIfActive('FURYRO', time)) {
          beforeCritAdd = (beforeCritAdd > FURY_RO_DMG) ? beforeCritAdd : FURY_RO_DMG;
        } else {
          beforeCritAdd = furyKera;
        }

        // Handle Claw of Flameweaver which doesn't stack with Fury Of X
        beforeCritAdd = calcClawProcDamage(state, beforeCritAdd, CLAW_PROC_FIRE_CHANCE, mod);
        break;
      case 'ICE':
        // Fury of Eci XIII
        if (timeline.getAdpsDataIfActive('FURYECI', time)) {
          beforeCritAdd = (beforeCritAdd > FURY_ECI_DMG) ? beforeCritAdd : FURY_ECI_DMG;
        } else {
          beforeCritAdd = furyKera;
        }

        // Handle Claw of Flameweaver which doesn't stack with Fury Of X
        beforeCritAdd = calcClawProcDamage(state, beforeCritAdd, CLAW_PROC_ICE_CHANCE, mod);
        break;
      case 'MAGIC':
        // Fury of Druzzil XIII
        if (timeline.getAdpsDataIfActive('FURYDRUZ', time)) {
           beforeCritAdd = (beforeCritAdd > FURY_DRUZ_DMG) ? beforeCritAdd : FURY_DRUZ_DMG;
        } else {
          beforeCritAdd = furyKera;
        }

        // Handle Claw of Flameweaver which doesn't stack with Fury Of X
        beforeCritAdd = calcClawProcDamage(state, beforeCritAdd, CLAW_PROC_MAGIC_CHANCE, mod);
        break;
    }
  }

  if (spell.manaCost >= 100 && spell.level <= 110) {
    // Enc Dicho, charges are accounted for when procs are handled
    if (timeline.getAdpsDataIfActive('DR', time)) {
      var drChargePer = 1 + dmgUtils.getProcRate(spell, utils.getSpellData('DRS6'));
      var value = utils.readAdpsOption('DR', 'beforeCritAdd');
      beforeCritAdd += Math.trunc(dmgUtils.processCounter(state, 'DR', mod * drChargePer, value, true));
    }
  }

  return beforeCritAdd;
};

var lookupCalcDmgFunction = function(spell) {
  switch(spell.id) {
    case 'WF': case 'WE':
      return function(arg1, arg2) {
        return calcCompoundSpellDamage(arg1, arg2, utils.getCompoundSpellList(spell.id));
      };
    case 'FU':
      return calcFuseDamage;
    default:
      return calcAvgDamage;
  }
};

var self = module.exports = {
  calcBaseCritDmg: function() {
    // Wiz Pet is Crit DMG Focus Spell (SPA 170)
    // Definitely stacks with FD and works with DF and AA Nukes
    return dom.getPetCritFocusValue() + dom.getDestructiveFuryValue() + dom.getCritDmgValue();
  },
  calcBaseCritRate: function() {
    return dom.getDoNValue() + dom.getFuryOfMagicValue() + dom.getCritRateValue();
  },
  calcCompoundSpellCritRate: function(c) {
    var spellStats = stats.getSpellStatisticsForIndex(c);
    var critRate = 0;

    var list = utils.buildCompoundSpellMap(c)[spellStats.id] || [];
    $(list).each(function(i, item) {
       var subSpell = stats.getSpellStatisticsForIndex(item);
       critRate += subSpell.critRate;
    });

    return list.length > 0 ? critRate / list.length : spellStats.critRate;
  },
  computeDamage: function(state, timelineRef) {
    timeline = timelineRef;

    // Round to nearest second to check against current spell landing time
    state.timeEst = Math.round(state.workingTime / 1000) * 1000;

    var critData = timeline.getCritDataAtTime(state.timeEst);
    if (!critData) {
      console.debug('out of range');
      return 0;
    }

    // Total Crit Chance
    state.critRate = critData.critRate;
    // Total Critical Multiplier
    state.critDmgMult = critData.critDmgMult;
    
    var value = calcTotalAvgDamage(state);
    stats.updateSpellStatistics(state, 'totalDmg', value);
    
    return value;
  }
};