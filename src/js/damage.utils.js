import {globals as G} from './settings.js';
import * as abilities from './abilities.js';
import * as dom from './dom.js';
import * as stats from './stats.js';
import * as utils from './utils.js';
//import * as testData from './test/test.data.js';

// Wiz Settings
export const FUSE_PROC_CHANCE = 0.35;
export const FUSE_PROC_INDIVIDUAL_SPELL_CHANCE = 0.32;
export const WILDMAGIC_CHAOS_CHANCE = 0.35;
export const WILDMAGIC_RIMEBLAST_CHANCE = 0.35;
export const WILDMAGIC_PURE_CHANCE = 0.30;
export const WIZ_INNATE_CRIT_RATE = 2;
export const WIZ_INNATE_CRIT_DMG = 100;
export const FUSE_PROC_SPELL_CHANCE = FUSE_PROC_CHANCE * FUSE_PROC_INDIVIDUAL_SPELL_CHANCE;

// Enc Settings
export const ENC_INNATE_CRIT_RATE = 0;
export const ENC_INNATE_CRIT_DMG = 100;

// Mage Settings
export const MAGE_INNATE_CRIT_RATE = 0;
export const MAGE_INNATE_CRIT_DMG = 100;

export const MANCY_PROC_RATE = 0.30; //100 / (100 * 0.30);
export const FBSINGE_PROC_RATE = 100 / (100 * 0.25);

export const SC_MAX_DMG_MOD = 1.0;
export const SP_MAX_DMG_MOD = 1.2;
export const SH_MAX_DMG_MOD = 1.2;
export const SC_MIN_DMG_MOD = 0.1;
export const SP_MIN_DMG_MOD = 0.6;
export const SH_MIN_DMG_MOD = 0.6;
export const SC_MAX_DMG_UNIT = 10;
export const SP_MAX_DMG_UNIT = 20;
export const SH_MAX_DMG_UNIT = 5;
export const SC_DMG_PER_UNIT = (1.0 - 0.1) / (60 - 10);
export const SP_DMG_PER_UNIT = (1.2 - 0.6) / (60 - 20);
export const SH_DMG_PER_UNIT = (1.2 - 0.6) / (30 - 5);

// Claw/Chaotic effect proc rates per 100 casts
export const CLAW_SPELL_PROC_RATES = {
  wiz: {
    CG: {
      SYLLMAGIC: 100 / (100 * 0.05),
      SYLLICE: 100 / (100 * 0.35),
      SYLLFIRE: 100 / (100 * 0.05),
      SYLLMASTER: 100 / (100 * 0.12),
      TC: 100 / (100 * 0.10),
      REFRESH: 100 / (100 * 0.06)
    },
    CS: {
      SYLLMAGIC: 100 / (100 * 0.05),
      SYLLICE: 100 / (100 * 0.05),
      SYLLFIRE: 100 / (100 * 0.35),
      SYLLMASTER: 100 / (100 * 0.12),
      TC: 100 / (100 * 0.10),
      REFRESH: 100 / (100 * 0.06)
    }
  },
  mag: {
    CP: {
      FPWR: 100 / (100 * 0.28),
      FWEAK: 100 / (100 * 0.01),
      TC: 100 / (100 * 0.10),
      REFRESH: 100 / (100 * 0.06)
    }
  }
};

export const FC_SPELL_PROC_RATES = {
  FPWR: 100 / (100 * 0.25),
  FWEAK: 100 / (100 * 0.01)
};

export const LUCK_VALUES = [
  0.075, 0.125, 0.175, 0.225, 0.245, 0.275, 0.295, 0.305, 0.315, 0.325, 0.335, 0.345, 0.355
];

// Spell/Abilities the proc from the result of a spell cast
export const SPELL_PROC_ABILITIES = [
  'ARCO', 'CDG', 'ESYN2', 'ESYN3', 'MSYN3', 'VFX', 'WSYN4', 'SYLLFIRERk1',
  'SYLLFIRERk2', 'SYLLFIRERk3', 'SYLLMAGICRk1', 'SYLLMAGICRk2', 'SYLLMAGICRk3', 'SYLLICERk1', 'SYLLICERk2',
  'SYLLICERk3', 'SYLLMASTERRk1', 'SYLLMASTERRk2', 'SYLLMASTERRk3', 'TC', 'FPWR', 'FWEAK',
  'GCH', 'FBSINGERk1', 'FBSINGERk2', 'FBSINGERk3'
];

// Spell/Abilities that exist on both spell timeline and adps (they can overlap)
export const PREEMPT_SPELL_CASTS = ['TC', 'MBRN', 'DR'];

const LIMIT_RULES_FOR_FAILURE = {
  activated: (effect, spell) => true, // custom check for non spell casts like AA nukes or orb clicks
  class: (effect, spell, value) => value !== G.MODE, 
  currentHitPoints: (effect, spell) => spell.baseDmg === undefined,
  exSkills: (effect, spell, value) => value.has(spell.skill),
  exSpells: (effect, spell, value) => value.has(spell.id),
  exTargets: (effect, spell, value) => value.has(spell.target),
  exTwincastMarker: (effect, spell) => spell.canTwincast === false,
  onSpellUse: (effect, spell) => !spell.focusable || spell.inventory, // focusable spells NOT from inventory
  maxCastTime: (effect, spell, value) => spell.origCastTime > value,
  maxDuration: (effect, spell, value) => spell.duration > value,
  maxLevel: (effect, spell, value) => (spell.level > value && !effect.decay),
  maxManaCost: (effect, spell, value) => spell.manaCost > value,
  minCastTime: (effect, spell, value) => spell.origCastTime < value,
  minDmg: (effect, spell, value) => spell.baseDmg < value,
  minLevel: (effect, spell, value) => spell.level < value,
  minManaCost: (effect, spell, value) => spell.manaCost < value,
  nonRepeating: (effect, spell) => (spell.duration > 0 && spell.spa !== 79), // dots or enc dot nukes
  resists: (effect, spell, value) => !value.has(spell.resist),
  spells: (effect, spell, value) => !value.has(spell.id),
  targets: (effect, spell, value) => !value.has(spell.target),
  type: (effect, spell, value) => !isSpellType(value, spell)
}

function checkLimits(id, spell, effect) {
  let key = 'checkLimit-' + id + '-' + spell.id + '-' + (effect.spa || '')
    + '-' + (effect.slot || '') + '-' + (effect.proc || '');

  return utils.useCache(key, () => {
    let pass = true;
    let check;
    let ability = abilities.get(id);
    let decayLevel = 0;

    // check basics for a spell object
    if (!spell.id || !spell.level) {
      check = 'not a spell';
      pass = false;
    } else if (!spell.baseDmg && !abilities.SPA_NO_DMG.has(effect.spa)) {
      check = 'no damage';
      pass = false;
    } else if (!spell.focusable && abilities.SPA_FOCUSABLE.has(effect.spa)) {
      check = 'not focusable';
      pass = false;
    } else if (spell.inventory && abilities.SPA_EFFECTIVENESS.has(effect.spa)) {
      check = 'inventory';
      pass = false;
    } else if (effect.limits) {
      effect.limits.find(limit => {
        let key = Object.keys(limit)[0]; // each limit has 1 key
        if (LIMIT_RULES_FOR_FAILURE[key](effect, spell, limit[key])) {
          pass = false; check = key;
          return true;
        } else {
          // special case for dark shield of shield and ITC
          if (ability.charges && !effect.proc && (spell.skill === 52 && spell.inventory)) {
            pass = false; check = 'hit type';
            return true;
          }

          // save the level to decay on
          if (effect.decay && key === 'maxLevel') {
            decayLevel = limit[key];
          }
        }
      });
    }
    
    if (!pass) {
      //console.debug(spell.id + " failed on " + check + " -> " + id);
    }

    let result = { pass: pass, failure: check };
    if (decayLevel) { // include decay level in result
      result.decayLevel = decayLevel;
    }

    return result;
  });
}

function buildSPAKey(effect) {
  return String(effect.spa) + '-' + String(effect.type) + '-' + String(effect.slot);
}

function parseSPAKey(key) {
  return {
    spa: Number.parseInt(key.substr(0,3)),
    slot: Number.parseInt(key.substr(7))
    //type: key.substr(4,2),
  };
}

function getChargeCount(state, id, mod) {
  // bug for Dicho using extra counters
  // really should make Dicho have a proc
  if (state.spell.id === 'CF' && (id === 'AD' || id === 'FD')) {
    return mod * 2;
  }

  // sometimes charged elsewhere or not needed atall
  if (id === 'DR' || state.aeWave || (id === 'ITC' && state.inTwincast)) {
    return 0;
  }
 
  return mod;
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
  let dontChargeSet = new Set();
  let spaSet = new Set();
  
  ids.forEach(id => {
    let ability = abilities.get(id);

    ability.effects.forEach(effect => {
      let result = spell ? checkLimits(id, spell, effect) : false;
      if (!result || result.pass) {
        let key = buildSPAKey(effect);
        let existing = spaMap.get(key);

        if ((!existing || (effect.value < 0 && effect.value < existing.value) || // negative effects override all
          effect.value >= existing.value)) {

          // special case for FD/AD stacking
          if (id === 'FD' && abilitySet.has('AD')) {
            dontChargeSet.add(id);
          }

          if (existing) {
            abilitySet.delete(existing.id);
          }

          spaSet.add(effect.spa);
          spaMap.set(key, { value: effect.value, spa: effect.spa, id: id });
          abilitySet.add(id);
        }
      } else {
        // dont charge for abilities when any SPA fails unless hit type allows for any (Mana Charge)
        if (ability.charges && ability.hitType !== 'any' && result && result.failure) {
          dontChargeSet.add(id);
        }
      }
    });
  });
  
  return {abilitySet: abilitySet, dontChargeSet: dontChargeSet, spaMap: spaMap, spaSet: spaSet};
}

export function checkSingleEffectLimit(spell, id) {
  let result;

  abilities.get(id).effects.find(effect => {
    if (checkLimits(id, spell, effect).pass) {
      result = effect;
      return true;
    }
  });

  return result;
}

export function computeSPAs(state, mod, dotMod) {
  let spell = state.spell;
  dotMod = dotMod || 0;

  let spaValues = {};
  abilities.SPA_KEY_MAP.forEach((v, k) => { spaValues[v] = 0; });

  let charged = new Map();
  let result = buildSPAData(state.activeAbilities, spell);

  result.spaMap.forEach((v, k) => {
    let parsed = parseSPAKey(k);
    let spa = parsed.spa;
    let slot = parsed.slot;

    let key = abilities.SPA_KEY_MAP.get(spa);
    if (key) {
      let partUsed = 1; // default
      let update = v.value;

      if (result.abilitySet.has(v.id) && abilities.get(v.id).charges && !result.dontChargeSet.has(v.id)) {
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

      // special case for 483 getting double benefit when used with 484
      if (spa === 483 && result.spaSet.has(484)) {
        update = update * 2;
      }

      // some SPA breakup effect over each tick
      if ([303, 462].find(x => x === spa)) {
        update = update / dotMod;
      }

      spaValues[key] += update * partUsed;
    }
  });
   
  return {abilitySet: result.abilitySet, spaValues: spaValues};
}

export function getMultiplier(castTime) {
  var multiplier = 0.2499;

  if(castTime >= 2500 && castTime <= 7000) {
    multiplier = .000167 * (castTime - 1000);
  } else if(castTime > 7000) {
    multiplier = 1 * castTime / 7000;
  }

  return multiplier;
}

export function getRSDPS(state) {
  return dom.getRemorselessServantDPSValue() * (state[utils.getCounterKeys('RS').counter] || 0);
}

export function getProcEffect(spell, id) {
  let result;

  let ability = abilities.get(id);
  let effect = abilities.getProcEffectForAbility(ability);

  if (effect && effect.proc != spell.id) { // check self
    let check = checkLimits(id, spell, effect);
    if (check.pass) {
      result = effect;
    }
  }

  return result;
}

export function getBaseCritDmg() {
  // Wiz Pet is Crit DMG Focus Spell (SPA 170)
  // Definitely stacks with FD and works with CF and AA Nukes
  return (dom.getDestructiveFuryValue() + dom.getCritDmgValue()) / 100;
}

export function getBaseDoTCritDmg() {
  return (dom.getDestructiveCascadeValue() + dom.getCritDmgValue()) / 100;
}

export function getBaseCritRate() {
  return (dom.getDoNValue() + dom.getFuryOfMagicValue() + dom.getCritRateValue()) / 100;
}

export function getBaseDoTCritRate() {
  return (dom.getDoNValue() + dom.getCriticalAfflicationValue() + dom.getCritRateValue()) / 100;
}

// Self-Combustion
export function getSCDmgMod(units) {
  return utils.useCache('sc-dmg-mod-' + units, function() {
    let maxDmgUnit = (units > SC_MAX_DMG_UNIT) ? units - SC_MAX_DMG_UNIT : 0;
    let dmgMod = SC_MAX_DMG_MOD - (maxDmgUnit * SC_DMG_PER_UNIT);
    if (dmgMod < SC_MIN_DMG_MOD) {
      dmgMod = SC_MIN_DMG_MOD;
    }
    return dmgMod;  
  });
}

// Level 100 splash
export function getSPDmgMod(units) {
  return utils.useCache('sp-dmg-mod-' + units, function() {
    let maxDmgUnit = (units > SP_MAX_DMG_UNIT) ? units - SP_MAX_DMG_UNIT : 0;
    let dmgMod = SP_MAX_DMG_MOD - (maxDmgUnit * SP_DMG_PER_UNIT);
    if (dmgMod < SP_MIN_DMG_MOD) {
      dmgMod = SP_MIN_DMG_MOD;
    }
    return dmgMod;  
  });
}

// Level 90 and 95 splash
export function getSHDmgMod(units) {
  return utils.useCache('sh-dmg-mod-' + units, function() {
    let maxDmgUnit = (units > SH_MAX_DMG_UNIT) ? units - SH_MAX_DMG_UNIT : 0;
    let dmgMod = SH_MAX_DMG_MOD - (maxDmgUnit * SH_DMG_PER_UNIT);
    if (dmgMod < SH_MIN_DMG_MOD) {
      dmgMod = SH_MIN_DMG_MOD;
    }
    return dmgMod;  
  });
}

export function getCompoundSpellList(id) {
  return utils.useCache('compound-spell-list-' + id, function() {
    return {
      'WS': [
        { id: 'WX', chance: 1.0 },
        { id: 'PS', chance: WILDMAGIC_PURE_CHANCE },
        { id: 'RC', chance: WILDMAGIC_RIMEBLAST_CHANCE },
        { id: 'CB', chance: WILDMAGIC_CHAOS_CHANCE }
      ],
      'WE': [
        { id: 'PE', chance: WILDMAGIC_PURE_CHANCE },
        { id: 'HC', chance: WILDMAGIC_RIMEBLAST_CHANCE },
        { id: 'CI', chance: WILDMAGIC_CHAOS_CHANCE }
      ],
      'EC': [
        { id: 'EB', chance: FUSE_PROC_SPELL_CHANCE },
        { id: 'RI', chance: FUSE_PROC_SPELL_CHANCE },
        { id: 'ET', chance: FUSE_PROC_SPELL_CHANCE }
      ]
    }[id];
  });
}

export function getEqpProcs(spell) {
  // find eqp procs
  let procList = utils.useCache('get-eqp-procs-' + spell.id, () => {
    return [ 
      dom.getArmorProc1Value(), dom.getArmorProc2Value(), dom.getArmorProc3Value(),
      dom.getArmorProc4Value(), dom.getArmorProc5Value(), dom.getStaffProcValue(),
      dom.getBeltProcValue(), dom.getRangeAugValue(), dom.getDPSAug1AugValue(),
      dom.getDPSAug2AugValue(), dom.getShieldProcValue() 
    ].filter(id => {
      if (id !== 'NONE') {
        let procSpell = utils.getSpellData(id);
        let limitCheck1 = procSpell && (!procSpell.limitResists || procSpell.limitResists.get(spell.resist))
        let limitCheck2 = procSpell && (!procSpell.limitMana || spell.manaCost >= procSpell.limitMana)
        return (limitCheck1 && limitCheck2 && procSpell.id && procSpell.id != spell.id); // check self
      }
    });
  });

  // if there are any and this spell can proc them
  if (procList.length > 0 && checkSingleEffectLimit(spell, 'EQPPROC')) {
    return procList;
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

export function getProcRate(spell, proc) {
  let rate = 1.0;
  
  if (proc.base1)
  {
    rate = proc.base1 / 100 * getNormalizer(spell);
  }
  else if (proc.fixedRate)
  {
    rate = proc.fixedRate / 100;
  }
  
  return rate;
}

export function getNormalizer(spell) {
  return getMultiplier(spell.origCastTime);
}

export function isCastDetSpell(spell) {
  return spell.manaCost > 0 && !![5, 14, 24, 98].find(x => x === spell.skill) && !spell.aa && !spell.inventory;
}

export function isCastDetSpellOrAbility(spell) {
  return (isCastDetSpell(spell) || spell.aa || spell.inventory);
}

export function processCounter(state, id, mod) {
  let keys = utils.getCounterKeys(id);
  let partUsed;
  let counterUsed = 0;
  let current = state[keys.counter];
  let start = (current >= 1) ? 1 : current;

  if (current >= mod) {
    if (current >= 1) {
      current -= mod;
      counterUsed = mod;
      partUsed = start;
      // use full amount if it's available
    } else {
      current -= (mod * current);
      counterUsed = (mod * current);
      partUsed = counterUsed;
    }
  } else {
    partUsed = current;
    counterUsed = current;
    current = 0;
  }

  // update stats
  state[keys.counter] = (current < 0.000001) ? 0 : current;
  stats.addSpellStatistics(state, keys.charges, counterUsed);

  // Why x start? So, 1 charge is normally required. mod that for twincast. Easy.
  // But if there's only 0.5 total left then it's really only half strength. ie think proc damage
  return partUsed;
}

export function round(value)
{
  return utils.asDecimal32Precision(value);
}

export function trunc(value) {
  return Math.trunc(utils.asDecimal32Precision(value));
}

export function displaySpellInfo(target, testData) {
  $(target).css('height', '600px');
  $(target).css('overflow-y', 'auto');
  let test = $(target).find('.test-data');  
  let current = $(target).find('.current-data'); 

  if (test.find('pre').length > 0) {
    return; // content already loaded
  }

  let count = 1;
  let lines = [];

  let rankMarker = new RegExp(/Rk\d/);
  utils.getAllSpellData().forEach(data => {
    Object.keys(data.spells).sort((a, b) => {
      if (data.spells[a].name > data.spells[b].name) { return 1; }
      if (data.spells[b].name > data.spells[a].name) { return -1; }
      return 0;
    }).forEach(sid => {
      if (rankMarker.test(sid) === false) {
        let spell = data.spells[sid];

        lines.push(String(count++).padStart(4, '0') + ': <strong style="font-size: 15px;">' + spell.name + '</strong>');

        abilities.getAll().forEach(aid => {
          let ability = abilities.get(aid);
     
          // dont mix mage/wiz spells and abilities
          if (!ability.mode || data.name === 'gen' || ability.mode === data.name) {
            ability.effects.forEach(effect => {
              let eName = 'Misc';
              if (effect.spa) eName = 'SPA ' + effect.spa;
              if (effect.proc !== undefined) eName = 'Proc';

              let result = checkLimits(aid, spell, effect);
              if (result.pass) {
                lines.push(String(count++).padStart(4, '0') + ':   <em style="color: green;">Pass</em> ' + eName + ' ' + ability.name);
              } else {
                lines.push(String(count++).padStart(4, '0') + ':   <em style="color: red;">Fail</em> ' + eName + ' ' + ability.name + ' (' + result.failure + ')');
              }
            });
          }
        });
      }
    });
  });

  let preCurrent = $('<pre><code>');
  let preTest = $('<pre><code>');

  lines.forEach(line => preCurrent.append(line + '\n'));
  testData.forEach(line => preTest.append(line + '\n'));

  // do this and view page source...
  //let w = window.open('', 'Test Data');
  //w.document.clear();
  //w.document.write('<xmp>');
  //lines.forEach(line => w.document.writeln(line));
  //w.document.write('</xmp>');

  $(test).append(preTest);
  $(current).append(preCurrent);

  // check for errors
  let error = -1;
  for (let i=0; i<lines.length; i++) {
    if (!lines[i].includes(testData[i])) {
      console.debug(lines[i]);
      console.debug(testData[i]);
      error = i + 1;
      break;
    }
  }

  if (error === -1) {
    $('.modal-header .errorMsg').append(' -- All Results Match Test Data');
  } else {
    $('.modal-header .errorMsg').append(' -- Rule Mis-match Line: ' + error); 
  }
}
