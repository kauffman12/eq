import {globals as G} from './settings.js';
import * as dom from './dom.js';
import * as stats from './stats.js';
import * as utils from './utils.js';

// Wiz Settings
export const ARCANE_FURY_FOCUS = 0.15;
export const ARCANE_FUSION_CHANCE = 0.04;
export const CLAW_PROC_MAGIC_CHANCE = 0.05;
export const CLAW_PROC_ICE_CHANCE = 0.05;
export const CLAW_PROC_FIRE_CHANCE = 0.35;
export const CLAW_PROC_SPECIFIC_DMG = 3469;
export const CLAW_PROC_ANY_CHANCE = 0.12;
export const CLAW_PROC_ANY_DMG = 4232;
export const CLAW_REFRESH_CHANCE = 0.06;
export const CLAW_TWINCAST_CHANCE = 0.10;
export const FURY_RO_DMG = 2500;
export const FURY_ECI_DMG = 2500;
export const FURY_DRUZ_DMG = 2500;
export const FURY_KERA_DMG = 1550;
export const FUSE_PROC_CHANCE = 0.35;
export const FUSE_PROC_INDIVIDUAL_SPELL_CHANCE = 0.32;
export const IMPROVED_FAMILIAR_CRIT = 0.27;
export const KERA_FAMILIAR_FOCUS = 0.50;
export const AVG_VORTEX_FOCUS = 0.75;
export const VORTEX_EFFECT_TIMER = 21000;
export const WILDMAGIC_CHAOS_CHANCE = 0.35;
export const WILDMAGIC_RIMEBLAST_CHANCE = 0.35;
export const WILDMAGIC_PURE_CHANCE = 0.30;
export const WIZ_INNATE_CRIT_RATE = 2;
export const WIZ_INNATE_CRIT_DMG = 100;

// Mage Settings
export const MAGE_INNATE_CRIT_RATE = 0;
export const MAGE_INNATE_CRIT_DMG = 100;
export const FLAMES_POWER_TIMER = 30000;
export const FLAMES_POWER_FOCUS = 1.05;
export const FLAMES_POWER_RATE = 0.25;
export const FLAMES_WEAKNESS_TIMER = 15000;
export const FLAMES_WEAKNESS_FOCUS = -0.25;
export const FLAMES_WEAKNESS_RATE = 0.01;
export const FIREBOUND_ORB_COUNT = 10;

// ADPS Settings
export const AUG_AURA_PERCENT = 0.04;
export const ARIA_MAETANRUS_PERCENT = 0.45;
export const ENC_SYNERGY_PERCENT = 0.40;
export const SYNERGY_TIMER = 12000;
export const ENC_HAZY_CRIT_RATE = 1.00;
export const ENC_HAZY_FOCUS = 0.40;
export const ENC_HAZY_TIMER = 12000;
export const MAG_SYNERGY_PERCENT = 0.50;
export const NEC_SYNERGY_PERCENT = 0.15;
export const NILSARA_ARIA_DMG = 1638;
export const FW_COUNTERS = 6;
export const FW_TIMER = 18000;
export const MR_COUNTERS = 6;
export const MR_TIMER = 18000;
export const LINGERING_CRY_FOCUS = 0.08;
export const BLIZARD_BREATH_FOCUS = 0.055;
export const MALO_FOCUS = 0.055;
export const SEEDLINGS_FOCUS = 0.065;
export const TC_AURA_PERCENT = 0.11;

// Other Settings
export const FIZZLE_RATE = 0.005;

// Calculated Settings
export const FUSE_PROC_SPELL_CHANCE = FUSE_PROC_CHANCE * FUSE_PROC_INDIVIDUAL_SPELL_CHANCE;
export const REFRESH_CAST_COUNT = Math.ceil(1 / CLAW_REFRESH_CHANCE);

function getMultiplier(castTime) {
  var multiplier = 0.25;

  if(castTime >= 2.5 && castTime <= 7) {
    multiplier = 0.167 * (castTime - 1);
  } else if(castTime > 7) {
    multiplier = 1 * castTime / 7;
  }

  return multiplier;
}

function initFlames(state, update) {
  utils.initNumberProperties(state, ['flamesWeaknessCounter']);
  utils.initListProperties(state, ['flamesWeaknessTimers']);
  state.fpwrExpireTime = state.workingTime + FLAMES_POWER_TIMER;
  state.fpwrCounter = (dom.getFlamesOfPowerValue() === 4) ? 2.0 : 1.0;

  // Count the number of potential weaknesses applied sort of like Claw
  state.flamesWeaknessCounter += update;
  state.flamesWeaknessTimers.push(utils.createTimer(state.workingTime + FLAMES_WEAKNESS_TIMER, function(value) {
    return value - update;
  }));
}

export function applyDichoBug(state, id) {
  var keys = utils.getCounterKeys(id);
  // special case for Dicho to eat extra counter
  if (state.spell.id === 'DF') {
    if (state[keys.counter] >= 1) {
      state[keys.counter]--;
      stats.addSpellStatistics(state, keys.charges, 1);
    } else {
      stats.addSpellStatistics(state, keys.charges, state[keys.counter]);
      state[keys.counter] = 0;
    }
  }
}

export function applyPostSpellProcs(state, mod) {
  var update = mod ? mod : 1;

  switch(state.spell.id) {
    // Claw of the Flameweaver + Mage Chaotic Fire
    case 'CF':
      // Claw only
      if (G.MODE === 'wiz') {
        utils.initNumberProperties(state, ['clawCounter']);
        // Number of claws cast used when handling syllables
        state.clawCounter += update;
      } else if (G.MODE === 'mage') {
        initFlames(state, update);
      }

      var tcLength = utils.readAdpsOption('TC', 'offset');
      utils.initNumberProperties(state, ['clawRefreshCount', 'clawTcProcRate']);
      utils.initListProperties(state, ['clawTcTimers']);

      // Update claw proc chance
      state.clawTcProcRate += CLAW_TWINCAST_CHANCE * update;
      state.clawTcTimers.push(utils.createTimer(state.workingTime + tcLength, function(value) {
        return value - CLAW_TWINCAST_CHANCE * update;
      }));

      // only count main spells for normalization
      state.clawRefreshCount += update;

      // skip ahead since we just cast a spell
      // if Claw is cast then reduce timers by 6% including gcd
      state.spells.forEach((t) => {
        var theSpell = utils.getSpellData(t);
        var last = state.lastCastMap[theSpell.timer];
        var count = Math.floor(state.clawRefreshCount);
        if (last && last > 0 && (((REFRESH_CAST_COUNT - count + dom.getRefreshOffsetValue())) % REFRESH_CAST_COUNT === 0)) {
          delete state.lastCastMap[theSpell.timer];
        }
      });
      break;
    case 'SV':
      state.vfxCounter = dom.getShockingVortexEffectValue();
      state.vfxExpireTime = state.workingTime + VORTEX_EFFECT_TIMER;
      state.wsynCounter = dom.getEvokersSynergyValue();
      state.wsynExpireTime = state.workingTime + SYNERGY_TIMER + 3000;
      break;
    case 'FC':
      // FC is used my mages and wizards
      if (G.MODE === 'mage') {
        initFlames(state, update);
      }
      break;
  }
}

export function applyPreSpellProcs(state, twincastChance) {
  // Check for effects to cancel
  utils.checkSimpleTimer(state, state.workingTime, 'VFX');
  utils.checkSimpleTimer(state, state.workingTime, 'WSYN');
  utils.checkSimpleTimer(state, state.workingTime, 'FPWR');
  utils.checkTimerList(state, state.workingTime, 'clawTcProcRate', 'clawTcTimers');
  utils.checkTimerList(state, state.workingTime, 'flamesWeaknessCounter', 'flamesWeaknessTimers');

  // Update Storm of Many damage based on selected value
  // Start handling spell recast timer mods, etc here instead of in run or
  // using origRecastTimer or anything like that
  switch(state.spell.id) {
    case 'SM':
      state.spell.baseDmg = state.spell['baseDmg' + dom.getStormOfManyCountValue()];
      break;
  }
}

export function getCompoundSpellList(id) {
  return utils.useCache('compound-spell-list-' + id, function() {
    return {
      'WF': [
        { id: 'PF', chance: WILDMAGIC_PURE_CHANCE },
        { id: 'RC2', chance: WILDMAGIC_RIMEBLAST_CHANCE },
        { id: 'CS2', chance: WILDMAGIC_CHAOS_CHANCE }
      ],
      'WE': [
        { id: 'PE', chance: WILDMAGIC_PURE_CHANCE },
        { id: 'HC', chance: WILDMAGIC_RIMEBLAST_CHANCE },
        { id: 'CI', chance: WILDMAGIC_CHAOS_CHANCE }          
      ],
      'FU': [
        { id: 'ES', chance: FUSE_PROC_SPELL_CHANCE },
        { id: 'ER', chance: FUSE_PROC_SPELL_CHANCE },
        { id: 'EF', chance: FUSE_PROC_SPELL_CHANCE }        
      ]
    }[id];
  });
}

export function getFickleRate(rate) {
  var additionalChance = 0;

  switch(dom.getFlamesOfPowerValue()) {
    case 4: case 3:
      additionalChance = 0.34;
      break;
    case 2:
      additionalChance = 0.30;
      break;
    case 1:
      additionalChance = 0.27;
      break;
  }

  return rate + (additionalChance * (1 - rate) * rate);
}

export function getProcRate(spell, proc) {
  // spell being cast vs spell id of what is being proc'd
  return (proc.base1) ? proc.base1 / 100 * getNormalizer(spell) : 1.0;
}

export function getSpellDamage(spell) {
  // dicho/fuse needs to use an alternative time since it's really 2 spell casts
  // that get applied differently depending on what we're looking for
  var recastTime = spell.recastTime2 ? spell.recastTime2 : spell.recastTime;

  var totalCastTime = spell.origCastTime +
    ((recastTime > spell.lockoutTime) ? recastTime : spell.lockoutTime);

  var multiplier = getMultiplier(totalCastTime);
  return Math.trunc(utils.asDecimal32Precision(dom.getSpellDamageValue() * multiplier));
}

export function getNormalizer(spell) {
  return getMultiplier(spell.origCastTime);
}

export function isCastSpell(spell) {
  return (spell.skill === 24 || spell.skill === 14) && spell.level <= 250;
}

export function isEqpProc(spell) {
  return spell.skill === 52;
}

export function isFocusableSpellProc(spell) {
  return (isCastDetSpell(spell) && spell.level <= 250) || 
    (isEqpProc(spell) && spell.partialResist) || (isSpellProc(spell) && !spell.partialResist);  
}

export function isSpellProc(spell) {
  // The skill 5 with no max value is only thing I can find on eqresource to avoid alliance fulminations
  // without adding a special case
  return spell.level > 250 && !spell.discRefresh && (spell.skill === 24 || (spell.skill === 5 && !spell.max));
}

export function canTwincast(spell) {
  return isCastSpell(spell) && spell.manaCost >= 10 && spell.canTwincast !== false;
}

export function canTwinproc(spell) {
  return (isSpellProc(spell) && !spell.partialResist) || (isEqpProc(spell) && spell.partialResist);
}

export function canProcSpells(spell) {
  return isFocusableSpellProc(spell) && !spell.discRefresh;
}

export function isCastDetSpellOrAbility(spell) { 
  return isCastDetSpell(spell) || spell.discRefresh > 0;
}

export function isCastDetSpell(spell) {
  // cant think of a good fix for wildmagic procs at the moment
  return spell.baseDmg > 0 && [5, 14, 24].find(x => x === spell.skill) && 
    spell.max !== 0 && !(spell.skill === 24 && spell.level > 250);
}

export function passRequirements(reqs, state) {
  var spell = state.spell;

  if (reqs) {
    if (reqs.minManaCost && spell.manaCost < reqs.minManaCost) {
      return false;
    } else if (reqs.minLevel && spell.level < reqs.minlevel) {
      return false;
    } else if (reqs.maxLevel && spell.level > reqs.maxLevel) {
      return false;
    } else if (reqs.minCastTime && spell.origCastTime < reqs.minCastTime) {
      return false;
    } else if (reqs.minDamage && spell.baseDmg < reqs.minDamage) {
      return false;
    } else if (reqs.castSpellOnly && !isCastSpell(spell)) {
      return false;
    } else if (reqs.canProcSpells && !canProcSpells(spell)) {
      return false
    } else if (reqs.focusableSpellProc && !isFocusableSpellProc(spell)) {
      return false;
    } else if (reqs.resists && !reqs.resists.find(x => x === spell.resist)) {
      return false;
    }
  }
  
  return true;
}

export function processCounter(state, id, mod, value, calcOnly) {
  var keys = utils.getCounterKeys(id);
  var partUsed = 1;
  var counterUsed = 0;
  var current = state[keys.counter];

  if (current >= mod) {
    current -= mod;
    counterUsed = mod;
    // use full amount if it's available
  } else {
    partUsed = current;
    counterUsed = current;
    current = 0;
  }

  // calcuation but not updating of statistics
  if (!calcOnly) {
    state[keys.counter] = current;
    stats.addSpellStatistics(state, keys.charges, counterUsed);
  }

  return partUsed * value;
}