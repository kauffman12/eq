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

// Mage Settings
export const MAGE_INNATE_CRIT_RATE = 0;
export const MAGE_INNATE_CRIT_DMG = 100;

export const ARCO_PROC_RATE = 100 / (100 * 0.30);
export const CRYO_PROC_RATE = 100 / (100 * 0.25);
export const PYRO_PROC_RATE = 100 / (100 * 0.21);
export const PYRO_DPS = 20400 / 6;

// Claw/Chaotic effect proc rates per 100 casts
export const CLAW_SPELL_PROC_RATES = {
  wiz: {
    CO: {
      SYLLMAGIC: 100 / (100 * 0.05),
      SYLLICE: 100 / (100 * 0.35),
      SYLLFIRE: 100 / (100 * 0.05),
      SYLLMASTER: 100 / (100 * 0.12),
      TC: 100 / (100 * 0.10),
      REFRESH: 100 / (100 * 0.06)
    },
    CQ: {
      SYLLMAGIC: 100 / (100 * 0.05),
      SYLLICE: 100 / (100 * 0.05),
      SYLLFIRE: 100 / (100 * 0.35),
      SYLLMASTER: 100 / (100 * 0.12),
      TC: 100 / (100 * 0.10),
      REFRESH: 100 / (100 * 0.06)
    }
  },
  mag: {
    CI: {
      FPWR: 100 / (100 * 0.28),
      FWEAK: 100 / (100 * 0.01),
      TC: 100 / (100 * 0.10),
      REFRESH: 100 / (100 * 0.06)
    }
  }
};

export const TW_SPELL_PROC_RATES = {
  THPWR: 100 / (100 * 0.25),
  THWEAK: 100 / (100 * 0.01)
}

export const FC_SPELL_PROC_RATES = {
  FPWR: 100 / (100 * 0.25),
  FWEAK: 100 / (100 * 0.01)
}

// Spell/Abilities the proc from the result of a spell cast
export const SPELL_PROC_ABILITIES = [
  'ARCO', 'CRYO', 'MSYN1', 'MSYN2', 'PYRO', 'VFX', 'WSYN1', 'WSYN2', 'SYLLFIRE',
  'SYLLMAGIC', 'SYLLICE', 'SYLLMASTER', 'TC', 'FPWR', 'FWEAK', 'THPWR', 'THWEAK'
];

// Spell/Abilities that exist on both spell timeline and adps (they can overlap)
export const PREEMPT_SPELL_CASTS = ['TC', 'MBRN'];

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
  nonRepeating: (effect, spell) => spell.duration > 0,
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

function blockAbility(spaMap, id) {
  abilities.get(id).effects.forEach(effect => {
    let key = buildSPAKey(effect);
    let existing = spaMap.get(key);

    if (existing && existing.id === id) {
      spaMap.delete(key);
    }
  });
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
  let blocked = new Set();
  let spaSet = new Set();
  
  ids.forEach(id => {
    let ability = abilities.get(id);

    ability.effects.forEach(effect => {
      let result = spell ? checkLimits(id, spell, effect) : false;
      if (!result || result.pass) {
        let key = buildSPAKey(effect);
        let existing = spaMap.get(key);

        if (!blocked.has(id) && (!existing || (effect.value < 0 && effect.value < existing.value) ||       // negative effects override all
          effect.value >= existing.value)) {

          if (existing) {
            abilitySet.delete(existing.id);

            // block whatever was on there before when its SPA 294
            // only cases that current matter are intensity > FE || IOG and FE == IOG
            if (effect.spa === 294) {
              blockAbility(spaMap, existing.id);
              blocked.add(existing.id);
            }
          }

          let value = effect.value;
          if (effect.decay && result.decayLevel && (spell.level > result.decayLevel)) {
            value -= (effect.decay * (spell.level - result.decayLevel));
            if (value < 0) {
              value = 0;
            }
          }

          spaSet.add(effect.spa);
          spaMap.set(key, { value: value, spa: effect.spa, id: id });
          abilitySet.add(id);
        } else if (existing && effect.spa === 294) {
          abilitySet.delete(id);
          blockAbility(spaMap, id);
          blocked.add(id);
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

export function computeSPAs(state, mod) {
  let spell = state.spell;

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

      spaValues[key] += update * partUsed;
    }
  });
   
  return {abilitySet: result.abilitySet, spaValues: spaValues};
}

export function getMultiplier(castTime) {
  var multiplier = 0.25;

  if(castTime >= 2500 && castTime <= 7000) {
    multiplier = .000167 * (castTime - 1000);
  } else if(castTime > 7000) {
    multiplier = 1 * castTime / 7000;
  }

  return multiplier;
}

export function getPyroDPS(state) {
  return utils.isAbilityActive(state, 'PYRO') ? PYRO_DPS : 0;
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
  // Definitely stacks with FD and works with DF and AA Nukes
  return (dom.getDestructiveFuryValue() + dom.getCritDmgValue()) / 100;
}

export function getBaseCritRate() {
  return (dom.getDoNValue() + dom.getFuryOfMagicValue() + dom.getCritRateValue()) / 100;
}

export function getCompoundSpellList(id) {
  return utils.useCache('compound-spell-list-' + id, function() {
    return {
      'WF': [
        { id: 'PF', chance: WILDMAGIC_PURE_CHANCE },
        { id: 'IC', chance: WILDMAGIC_RIMEBLAST_CHANCE },
        { id: 'CB', chance: WILDMAGIC_CHAOS_CHANCE }
      ],
      'WE': [
        { id: 'PE', chance: WILDMAGIC_PURE_CHANCE },
        { id: 'HC', chance: WILDMAGIC_RIMEBLAST_CHANCE },
        { id: 'CI', chance: WILDMAGIC_CHAOS_CHANCE }
      ],
      'EB': [
        { id: 'ES', chance: FUSE_PROC_SPELL_CHANCE },
        { id: 'EI', chance: FUSE_PROC_SPELL_CHANCE },
        { id: 'EV', chance: FUSE_PROC_SPELL_CHANCE }
      ]
    }[id];
  });
}

export function getEqpProcs(spell) {
  // find eqp procs
  let procList = utils.useCache('get-eqp-procs', () => {
    return [ 
      dom.getStaffProcValue(), dom.getBeltProcValue(), dom.getRangeAugValue(),
      dom.getDPSAug1AugValue(), dom.getDPSAug2AugValue(), dom.getShieldProcValue() 
    ].filter(id => {
      if (id !== 'NONE') {
        let procSpell = utils.getSpellData(id);
        return (procSpell && procSpell.id && procSpell.id != spell.id); // check self
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
  return (proc.base1) ? proc.base1 / 100 * getNormalizer(spell) : 1.0;
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
    current -= mod;
    counterUsed = mod;
    partUsed = start;
    // use full amount if it's available
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

  utils.getAllSpellData().forEach(data => {
    Object.keys(data.spells).sort((a, b) => {
      if (data.spells[a].name > data.spells[b].name) { return 1; }
      if (data.spells[b].name > data.spells[a].name) { return -1; }
      return 0;
    }).forEach(sid => {
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
    });
  });

  let preCurrent = $('<pre><code>');
  let preTest = $('<pre><code>');

  lines.forEach(line => preCurrent.append(line + '\n'));
  testData.forEach(line => preTest.append(line + '\n'));

  // do this and view page source...
  //let w = window.open('', 'Test Data');
  //w.document.write(JSON.stringify(lines));

  $(test).append(preTest);
  $(current).append(preCurrent);

  // check for errors
  let error = -1;
  for (let i=0; i<lines.length; i++) {
    if (lines[i] !== testData[i]) {
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