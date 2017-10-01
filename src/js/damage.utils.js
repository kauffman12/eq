import {globals as G} from './settings.js';
import * as abilities from './abilities.js';
import * as dom from './dom.js';
import * as stats from './stats.js';
import * as utils from './utils.js';

// Wiz Settings
export const ARCANE_FUSION_CHANCE = 0.04;
export const CLAW_PROC_MAGIC_CHANCE = 0.05;
export const CLAW_PROC_ICE_CHANCE = 0.05;
export const CLAW_PROC_FIRE_CHANCE = 0.35;
export const CLAW_PROC_SPECIFIC_DMG = 3469;
export const CLAW_PROC_ANY_CHANCE = 0.12;
export const CLAW_PROC_ANY_DMG = 4232;
export const CLAW_REFRESH_CHANCE = 0.06;
export const CLAW_TWINCAST_CHANCE = 0.10;
export const FUSE_PROC_CHANCE = 0.35;
export const FUSE_PROC_INDIVIDUAL_SPELL_CHANCE = 0.32;
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

// Calculated Settings
export const FUSE_PROC_SPELL_CHANCE = FUSE_PROC_CHANCE * FUSE_PROC_INDIVIDUAL_SPELL_CHANCE;
export const REFRESH_CAST_COUNT = Math.ceil(1 / CLAW_REFRESH_CHANCE);

// Spell/Abilities that exist on both spell timeline and adps (they can overlap)
export const PREEMPT_SPELL_CASTS = ['TC', 'MBRN'];

// Spell/Abilities the proc from the result of a spell cast
export const SPELL_PROC_ABILITIES = ['MSYN', 'VFX', 'WSYN'];

const LIMIT_RULES_FOR_FAILURE = {
  canProcSpells: (spell) => !canProcSpells(spell),
  currentHitPoints: (spell) => spell.baseDmg === undefined,
  exSkills: (spell, value) => value.has(spell.skill),
  exSpells: (spell, value) => value.has(spell.id),
  exTargets: (spell, value) => value.has(spell.target),
  exTwincastMarker: (spell) => spell.canTwincast === false,
  maxDuration: (spell, value) => spell.duration > value,
  maxLevel: (spell, value) => spell.level > value,
  minCastTime: (spell, value) => spell.origCastTime < value,
  minDmg: (spell, value) => spell.baseDmg < value,
  minLevel: (spell, value) => spell.level < value,
  minManaCost: (spell, value) => spell.manaCost < value,
  nonRepeating: (spell) => spell.duration > 0,
  resists: (spell, value) => !value.has(spell.resist),
  type: (spell, value) => !isSpellType(value, spell)
} 

function checkLimits(id, spell, effect) {
  let pass = true;
  let check;

  // check basics for a spell object
  if (!spell.id || !spell.level) {
    check = 'not a spell';
    pass = false;
  } else if (!spell.focusable && abilities.SPA_FOCUSABLE.has(effect.spa)) {
    check = 'not focusable';
    pass = false;
  } else if (!spell.baseDmg && !abilities.SPA_TWINCAST.has(effect.spa)) {
    check = 'spa requires damage';
    pass = false;
  } else if (effect.limits) {
    effect.limits.find(limit => {
      let key = Object.keys(limit)[0]; // each limit has 1 key
      if (LIMIT_RULES_FOR_FAILURE[key](spell, limit[key])) {
        pass = false; check = key;
        return true;
      }
    });
  }
  
  return { pass: pass, failure: check };
}

function checkSingleEffectLimit(spell, id) {
  let ability = abilities.get(id);
  return ability && ability.effects.find(effect => checkLimits(id, spell, effect).pass);
}

function getChargeCount(state, id, mod) {
  // bug for Dicho using extra counters
  // really should make Dicho have a proc
  if (state.spell.id === 'DF' && (id === 'AD' || id === 'FD')) {
    return mod * 2;
  }

  // sometimes charged elsewhere or not needed atall
  if (id === 'DR' || state.aeWave || (id === 'ITC' && state.inTwincast)) {
    return 0;
  }
 
  return mod;
}

function getMultiplier(castTime) {
  var multiplier = 0.25;

  if(castTime >= 2500 && castTime <= 7000) {
    multiplier = .000167 * (castTime - 1000);
  } else if(castTime > 7000) {
    multiplier = 1 * castTime / 7000;
  }

  return multiplier;
}

function isSpellType(type, spell) {
  switch (type) {
    case 'detrimental':
      return !spell.beneficial;
    case 'beneficial':
      return !!spell.benefical;
  }
}

export function buildSPAData(ids, spell) {
  let spaMap = new Map();
  let abilitySet = new Set();
  
  ids.forEach(id => {
    let ability = abilities.get(id);

    ability.effects.forEach(effect => {
      let result = spell ? checkLimits(id, spell, effect) : false;
      if (!result || result.pass) {
        let key = String(effect.spa) + '-' + String(effect.slot);
        let existing = spaMap.get(key);
        
        if (!existing || existing.level < ability.level || (existing.level === ability.level && effect.value > existing.value)) {
          spaMap.set(key, { value: effect.value, level: ability.level, id: id });
          abilitySet.add(id);

          if (existing) {
            abilitySet.delete(existing.id);
          }
        }
      } else {
        //console.debug(spell.id + " failed on " + result.failure + " for " + ability.name);
      }
    });
  });
  
  return {abilitySet: abilitySet, spaMap: spaMap};
}

export function computeSPAs(state, mod) {
  let spaValues = {
    addCritRate: 0,
    addCritDmg: 0,
    afterCritAdd: 0,
    afterCritAddNoMod: 0,
    afterCritFocusNoMod: 0,
    beforeCritAdd: 0,
    beforeCritFocus: 0,
    beforeDoTCritFocus: 0,
    postCalcFocus: 0,
    effectiveness: 0,
    twincast: 0
  };

  let charged = new Map();
  let result = buildSPAData(state.activeAbilities, state.spell);

  result.spaMap.forEach((v, k) => {
    let spa = Number.parseInt(k.substring(0, 3));

    let key;
    if (abilities.SPA_CRIT_RATE_NUKE.has(spa)) {
      key = 'addCritRate';
    } else if (abilities.SPA_CRIT_DMG_NUKE.has(spa)) {
      key = 'addCritDmg';
    } else if (abilities.SPA_AFTER_CRIT_ADD.has(spa)) {
      key = 'afterCritAdd';
    } else if (abilities.SPA_AFTER_CRIT_ADD_NO_MOD.has(spa)) {
      key = 'afterCritAddNoMod';
    } else if (abilities.SPA_AFTER_CRIT_FOCUS_NO_MOD.has(spa)) {
      key = 'afterCritFocusNoMod';
    } else if (abilities.SPA_BEFORE_CRIT_ADD.has(spa)) {
      key = 'beforeCritAdd';
    } else if (abilities.SPA_BEFORE_CRIT_FOCUS.has(spa)) {
      key = 'beforeCritFocus';
    } else if (abilities.SPA_BEFORE_DOT_CRIT_FOCUS.has(spa)) {
      key = 'beforeDoTCritFocus';
    } else if (abilities.SPA_POST_CALC_FOCUS.has(spa)) {
      key = 'postCalcFocus';
    } else if (abilities.SPA_EFFECTIVENESS.has(spa)) {
      key = 'effectiveness';
    } else if (abilities.SPA_TWINCAST.has(spa)) {
      key = 'twincast';
    }

    if (key) {
      let partUsed = 1; // default
      let update = v.value;

      // ability set should only contain what needs to be charged
      // dont charge for non spell casts like arcane fusion or AAs
      if (result.abilitySet.has(v.id) && abilities.get(v.id).charges && isCastSpell(state.spell)) {
        // if charge based then only use part
        partUsed = mod;

        // check if counter already charged
        let alreadyCharged = charged.has(v.id);

        if (!alreadyCharged) {
          // some abilities have special cases for charges
          // Ex: additional charge OR no need to count them here
          let count = getChargeCount(state, v.id, mod);
          partUsed = processCounter(state, v.id, count);
          charged.set(v.id, partUsed);
        } else {
          partUsed = charged.get(v.id);
        }
      }

      spaValues[key] = spaValues[key] + update * partUsed;
    }
  });

  return {abilitySet: result.abilitySet, spaValues: spaValues};
}

export function getProcEffect(spell, id) {
  let effect;

  let ability = abilities.get(id);
  effect = abilities.getProcEffectForAbility(ability);

  if (effect) {
    let result = checkLimits(id, spell, effect);
    if (!result.pass) {
      effect = undefined;
    }
  }

  return effect;
}

export function getBaseCritDmg() {
  // Wiz Pet is Crit DMG Focus Spell (SPA 170)
  // Definitely stacks with FD and works with DF and AA Nukes
  return (dom.getDestructiveFuryValue() + dom.getCritDmgValue()) / 100;
}

export function getBaseCritRate() {
  return (dom.getDoNValue() + dom.getFuryOfMagicValue() + dom.getCritRateValue()) / 100;
}

export function getClawTwincastRate(state, value) {
  // Add tc chance from claw procs taking out value which would negate the need
  if (state.clawTcCounter > 0) {
    let cacheKey = String(state.clawTcCounter) + value;
    let rate = state.cache[cacheKey];
    if (!rate) {
      let procRate = CLAW_TWINCAST_CHANCE + CLAW_TWINCAST_CHANCE * value;
      for (let i=0; i<state.clawTcCounter; i++) {
        procRate = procRate + value * procRate;
        value = value + procRate;            
      }
      
      state.cache[cacheKey] = value;
    } else {
      value = rate;        
    }
  }
  
  return value;
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

export function getEqpProcs(spell) {
  if (checkSingleEffectLimit(spell, 'EQPPROC')) {
    return [ 
      dom.getStaffProcValue(), dom.getBeltProcValue(),
      dom.getRangeAugValue(), dom.getDPSAug1AugValue(),
      dom.getDPSAug2AugValue(), dom.getShieldProcValue() 
    ].filter(id => id !== 'NONE');
  }

  return [];
}

export function getSpellProcs(abilities, spell) {
  let list = [];

  abilities.forEach(id => {
    let effect = getProcEffect(spell, id);

    if (effect) {
      list.push({proc: effect.proc, id: id, hasCharges: !!abilities.charges});
    }
  });

  return list;
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

export function getDestructiveAdeptFocus(spell) {
  // check if it's even set
  let dadept = dom.getDestructiveAdeptValue();
  return checkSingleEffectLimit(spell, 'DADEPT') ? dadept : 0;
}

export function getSorcerersVengeanceAdd(spell) {
  // check if it's even set
  let sveng = dom.getSorcererVengeananceValue();
  return checkSingleEffectLimit(spell, 'SVENG') ? sveng : 0;
}

export function getWornDamageFocus(spell) {
  let wornFocus = 0;

  dom.getWornDamageFocusList().find(id => {
    let ability = abilities.get(id);

    if (ability) {
      ability.effects.forEach(effect => {
        if (checkLimits(id, spell, effect).pass) {
          wornFocus = effect.value;
        }
      });
    }

    return wornFocus > 0;
  });

  return wornFocus;
}

export function getNormalizer(spell) {
  return getMultiplier(spell.origCastTime);
}

export function trunc(value) {
  return Math.trunc(utils.asDecimal32Precision(value));
}

export function isCastSpell(spell) {
  return (spell.skill === 24 || spell.skill === 14) && spell.level <= 250;
}

export function isEqpProc(spell) {
  return spell.skill === 52;
}

export function isSpellProc(spell) {
  // The skill 5 with no max value is only thing I can find on eqresource to avoid alliance fulminations
  // without adding a special case
  return spell.level > 250 && !spell.discRefresh && (spell.skill === 24 || (spell.skill === 5 && !spell.max) || spell.skill === 98);
}

export function isSpellOrEqpProc(spell) {
  return isSpellProc(spell) || isEqpProc(spell);
}

export function canTwincast(spell) {
  // final case covers Dark Shield of Scholar
  return spell.canTwincast !== false && !spell.beneficial && spell.manaCost >= 10 && (isCastSpell(spell) || (isEqpProc(spell) && spell.discRefresh > 0));
}

export function canTwinproc(spell) {
  return (isSpellProc(spell) && spell.focusable) || (isEqpProc(spell) && !spell.discRefresh && spell.focusable);
}

export function canProcSpells(spell) {
  return spell.focusable && spell.baseDmg > 0 && !spell.discRefresh;
}

export function isCastDetSpellOrAbility(spell) {
  return isCastDetSpell(spell) || spell.discRefresh > 0;
}

export function isCastDetSpell(spell) {
  return spell.baseDmg > 0 && [5, 14, 24].find(x => x === spell.skill) &&
    spell.max !== 0 && !(spell.skill === 24 && spell.level > 250);
}

export function passReqs(reqs, state) {
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
    } else if (reqs.castDetSpellOrAbility && !isCastDetSpellOrAbility(spell)) {
      return false;
    } else if (reqs.canProcSpells && !canProcSpells(spell)) {
      return false
    } else if (reqs.canTwincast && !canTwincast(spell)) {
      return false
    } else if (reqs.focusable && !spell.focusable) {
      return false;
    } else if (reqs.spellOrEqpProc && !isSpellOrEqpProc(spell)) {
      return false;
    } else if (reqs.exTargets && reqs.exTargets.find(x => x === spell.target)) {
      return false;
    } else if (reqs.resists && !reqs.resists.find(x => x === spell.resist)) {
      return false;
    }
  }

  return true;
}

export function processCounter(state, id, mod) {
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

  // update stats
  state[keys.counter] = (current < 0.000001) ? 0 : current;
  stats.addSpellStatistics(state, keys.charges, counterUsed);

  return partUsed;
}

let VALID_TEST_DATA = [{"title":"Is Equip Proc","General-19":["ASVI","BFVI","BOIX","DS","FCVII","FCX","FOMIX","FOMVII","FOMXIII","FOMXV","FSVI","FSVII","HOM3","OS","SOFV","SOFXIII","SOFXIV","VOSIV","WOC4"],"Mage-0":[],"Wizard-0":[]},{"title":"Is Spell Proc","General-9":["AHB","AM","DR","FW","MR","MRR","MRRR","MRRRR","WSYN"],"Mage-0":[],"Wizard-2":["AFU1","AFU2"]},{"title":"Is Focusable","General-25":["AM","ASVI","BFVI","BOIX","DR","DS","FCVII","FCX","FOMIX","FOMVII","FOMXIII","FOMXV","FSVI","FSVII","FW","HOM3","MR","MRR","MRRR","MRRRR","SOFV","SOFXIII","SOFXIV","VOSIV","WOC4"],"Mage-21":["BJ","BS","CF","CR","FA","FC","FE1","FE2","FE3","FE4","FE5","FE6","FE7","FE8","FE9","RC","RS","SB","SFB","SM","SS"],"Wizard-19":["CF","CI","CS","CS2","DF","EF","ER","ES","FA","FC","FU","HC","MB","PE","PF","RC2","SV","WE","WF"]},{"title":"Is Focusable Spell Or Eqp Proc","General-25":["AM","ASVI","BFVI","BOIX","DR","DS","FCVII","FCX","FOMIX","FOMVII","FOMXIII","FOMXV","FSVI","FSVII","FW","HOM3","MR","MRR","MRRR","MRRRR","SOFV","SOFXIII","SOFXIV","VOSIV","WOC4"],"Mage-0":[],"Wizard-0":[]},{"title":"Can Proc Spells Effects","General-24":["AM","ASVI","BFVI","BOIX","DR","FCVII","FCX","FOMIX","FOMVII","FOMXIII","FOMXV","FSVI","FSVII","FW","HOM3","MR","MRR","MRRR","MRRRR","SOFV","SOFXIII","SOFXIV","VOSIV","WOC4"],"Mage-9":["BS","CF","CR","FC","RC","RS","SB","SM","SS"],"Wizard-16":["CF","CI","CS","CS2","DF","EF","ER","ES","FC","FU","HC","MB","PE","PF","RC2","SV"]},{"title":"Can Twincast","General-1":["DS"],"Mage-9":["BJ","BS","CF","CR","FC","RC","SB","SM","SS"],"Wizard-14":["CF","CI","CS","EF","ER","ES","FC","FU","HC","MB","PE","SV","WE","WF"]},{"title":"Can Twinproc","General-24":["AM","ASVI","BFVI","BOIX","DR","FCVII","FCX","FOMIX","FOMVII","FOMXIII","FOMXV","FSVI","FSVII","FW","HOM3","MR","MRR","MRRR","MRRRR","SOFV","SOFXIII","SOFXIV","VOSIV","WOC4"],"Mage-0":[],"Wizard-0":[]},{"title":"Is Cast Detrimental","General-0":[],"Mage-11":["BJ","BS","CF","CR","FAF","FC","RC","RS","SB","SM","SS"],"Wizard-17":["CF","CI","CS","CS2","DF","EF","ER","ES","FAF","FC","FU","HC","MB","PE","PF","RC2","SV"]},{"title":"Is Cast Detrimental OR Used Ability","General-1":["DS"],"Mage-26":["BJ","BS","CF","CR","FAF","FC","FE1","FE10","FE11","FE12","FE13","FE14","FE15","FE2","FE3","FE4","FE5","FE6","FE7","FE8","FE9","RC","RS","SB","SM","SS"],"Wizard-56":["CF","CI","CS","CS2","DF","EF","ER","ES","FAF","FC","FF1","FF2","FF3","FF4","FF5","FF6","FI1","FI2","FI3","FI4","FI5","FI6","FU","FW1","FW10","FW11","FW12","FW13","FW14","FW15","FW16","FW17","FW18","FW19","FW2","FW20","FW21","FW22","FW23","FW24","FW25","FW26","FW3","FW4","FW5","FW6","FW7","FW8","FW9","HC","MB","MBRN","PE","PF","RC2","SV"]}];

export function displaySpellInfo(target) {
  $(target).css('height', '600px');
  $(target).css('overflow-y', 'auto');

  let test = $(target).find('.test-data');  
  let current = $(target).find('.current-data');  
  let list = [];
  
  list.push(getSpellSection('Is Equip Proc', isEqpProc)); 
  list.push(getSpellSection('Is Spell Proc', isSpellProc)); 
  list.push(getSpellSection('Is Focusable', (spell) => spell.focusable)); 
  list.push(getSpellSection('Is Focusable Spell Or Eqp Proc', (spell) => spell.focusable && isSpellOrEqpProc(spell))); 
  list.push(getSpellSection('Can Proc Spells Effects', canProcSpells)); 
  list.push(getSpellSection('Can Twincast', canTwincast)); 
  list.push(getSpellSection('Can Twinproc', canTwinproc)); 
  list.push(getSpellSection('Is Cast Detrimental', isCastDetSpell)); 
  list.push(getSpellSection('Is Cast Detrimental OR Used Ability', isCastDetSpellOrAbility));
  
  let foundError = false;
  let section;
  VALID_TEST_DATA.forEach((item, i) => {
    if (!foundError) {
      Object.keys(item).forEach(key => {
        if (key === 'title') {
          foundError = foundError ? foundError : item[key] !== list[i][key];
        } else {
          foundError = foundError ? foundError : item[key].length !== (list[i][key] ? list[i][key].length : -1);
          item[key].forEach(id => {
            foundError = foundError ? foundError : (list[i][key].find(x => id === x) === undefined);
          });
        }
      })
    } 
    
    if (section === undefined && foundError) {
      section = i + 1;
    }
  });
 
  if (foundError) {
    let txt = $('#myModal .modal-title').text(); 
    $('#myModal .modal-title').text(txt + ' (Error Section #' + section + ')'); 
  }
  
  // $(current).append('<pre>' + JSON.stringify(list)+ '</pre>');
  $(current).append('<pre>' + JSON.stringify(list, null, 2)+ '</pre>');
  $(test).append('<pre>' + JSON.stringify(VALID_TEST_DATA, null, 2)+ '</pre>');
}

function getSpellSection(title, f) {
  let result = { title: title };

  utils.getAllSpellData().forEach(data => {
    let filtered = Object.keys(data.spells).map(key => key).sort().filter(i => f(data.spells[i]));
    result[data.name + '-' + filtered.length] = filtered;
  });    

  return result;
}