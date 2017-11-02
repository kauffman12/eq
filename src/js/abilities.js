import {globals as G} from './settings.js';

// SPA
// 124 - increase spell damage                   (before DoT crit)
// 170 - increase nuke crit damage
// 212 - increase nuke crit chance
// 273 - increase dot crit chance
// 286 - increase spell damage                   (after crit addition)
// 294 - increase nuke crit chance
// 296 - increase spell damage                   (before crit multiplyer)
// 297 - increase spell damage                   (before crit addition)
// 302 - increase spell damage                   (before crit multiplyer)
// 303 - increase spell damage                   (before crit addition)
// 375 - increase dot crit damage
// 399 - increase twincast rate
// 413 - increase spell effectiveness            (effectiveness multiplyer)
// 461 - increase spell damage v2                (special crit multiplier)
// 483 - increase spell and dot damage taken     (after crit multiplyer not modifiable)
// 484 - increase spell damage taken             (after crit addition not modifiable)

// Notes
// tick durations rounded up 1/2 tick since it seems random what you really get
//   Ex: twincast is 3 ticks and gets 18 to 24 seconds so I go with 21
// 
// repeatEvery -1 means repeat always
//              0 means dont repeat
//             +N repeat every N 
//             -999 repeat when activated by some means like proc/cast

export const SPA_AFTER_CRIT_ADD = new Set([286]);
export const SPA_AFTER_CRIT_ADD_NO_MOD = new Set([484]);
export const SPA_AFTER_CRIT_FOCUS_NO_MOD = new Set([483]);
export const SPA_BEFORE_CRIT_ADD = new Set([297, 303]);
export const SPA_BEFORE_CRIT_FOCUS = new Set([296, 302]);
export const SPA_BEFORE_DOT_CRIT_FOCUS = new Set([124]);
export const SPA_POST_CALC_FOCUS = new Set([461]);
export const SPA_CRIT_DMG_NUKE = new Set([170]);
export const SPA_CRIT_RATE_NUKE = new Set([212, 294]);
export const SPA_EFFECTIVENESS = new Set([413]);
export const SPA_FOCUSABLE = new Set([124, 212, 286, 296, 297, 302, 303, 399, 461, 484]);
export const SPA_NO_DMG = new Set([389, 399]);
export const SPA_TWINCAST = new Set([399]);

// Build SPA to key Map
export const SPA_KEY_MAP = new Map();
SPA_CRIT_RATE_NUKE.forEach(spa => SPA_KEY_MAP.set(spa, 'addCritRate'));
SPA_CRIT_DMG_NUKE.forEach(spa => SPA_KEY_MAP.set(spa, 'addCritDmg'));
SPA_AFTER_CRIT_ADD.forEach(spa => SPA_KEY_MAP.set(spa, 'afterCritAdd'));
SPA_AFTER_CRIT_ADD_NO_MOD.forEach(spa => SPA_KEY_MAP.set(spa, 'afterCritAddNoMod'));
SPA_AFTER_CRIT_FOCUS_NO_MOD.forEach(spa => SPA_KEY_MAP.set(spa, 'afterCritFocusNoMod'));
SPA_BEFORE_CRIT_ADD.forEach(spa => SPA_KEY_MAP.set(spa, 'beforeCritAdd'));
SPA_BEFORE_CRIT_FOCUS.forEach(spa => SPA_KEY_MAP.set(spa, 'beforeCritFocus'));
SPA_BEFORE_DOT_CRIT_FOCUS.forEach(spa => SPA_KEY_MAP.set(spa, 'beforeDoTCritFocus'));
SPA_POST_CALC_FOCUS.forEach(spa => SPA_KEY_MAP.set(spa, 'postCalcFocus'));
SPA_EFFECTIVENESS.forEach(spa => SPA_KEY_MAP.set(spa, 'effectiveness'));
SPA_TWINCAST.forEach(spa => SPA_KEY_MAP.set(spa, 'twincast'));

export function get(ability) {
  return ABILITIES[ability];
}

export function getAll() {
  return Object.keys(ABILITIES).sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    }
  
    if (b.name > a.name) {
      return -1;
    }

    return 0;
  });
}

export function getProcEffectForAbility(ability) {
  if (ability && ability.effects) {
    return ability.effects.find(effect => effect.proc !== undefined);
  }
}

function abilitySorter(a, b) {
  let aClass = (G.MODE !== a.class || a.otherCast) ? a.class : '';
  let bClass = (G.MODE !== b.class || b.otherCast) ? b.class : '';
  let aName = (aClass || '') + a.name;
  let bName = (bClass || '') + b.name;

  if (aName > bName) return 1;
  if (bName > aName) return -1;
  return 0;
}

export function getAbilityList(repeating) {
  let list = [];

  Object.keys(ABILITIES).forEach(key => {
    let ability = ABILITIES[key];

    if (!ability.mode || (ability.mode && ability.mode === G.MODE)) {
      if ((!repeating && ability.adpsDropdown) || (repeating && ability.repeatEvery)) {
        list.push(
          {
            class: ability.class,
            debuff: !!ability.debuff,
            id: key,
            manuallyActivated: ability.manuallyActivated,
            name: ability.name,
            otherCast: ability.otherCast,
            refreshTime: ability.refreshTime,
            repeatEvery: ability.repeatEvery,
            tooltip: ability.tooltip
          }
        );
      }
    }
  });

  return list.sort(abilitySorter);
}

export function hasSPA(ability, spaSet) {
  return ability ? ability.effects.find(effect => spaSet.has(effect.spa)) : false;
}

export function setCharges(id, value) {
  if (ABILITIES[id]) {
    ABILITIES[id].charges = value;
  }
}

export function setProcValue(id, value) {
  if (ABILITIES[id]) {
    let found = ABILITIES[id].effects.find(effect => effect.proc !== undefined);
    if (found) {
      found.proc = value;
    }
  }
}

export function setSPAValue(id, spa, value) {
  if (ABILITIES[id]) {
    let found = ABILITIES[id].effects.find(effect => effect.spa === spa);
    if (found) {
      found.value = value;
    }
  }
}

const COMBAT_SKILLS = new Set([]); // not needed yet
const TARGET_AES = new Set(['AE']);
const TARGET_LOS = new Set(['LOS']);
const TARGET_SINGLE = new Set(['SINGLE']);
const TICK_OFFSET = 3000;

const ABILITIES = {
  AA: {
    charges: 22, // game displays double
    class: 'enc',
    duration: 50000,
    level: 103,
    name: 'Augmenting Aura Rk. III',
    refreshTime: 30000,
    repeatEvery: -1,
    effects: [
      {
        spa: 413,
        slot: 1,
        type: 'sp',
        value: 0.04,
        limits: [
          { maxLevel: 105 },
          { type: 'detrimental' },
          { minManaCost: 10 },
          { exTargets: TARGET_AES },
          { exSkills: COMBAT_SKILLS }
        ]
      }
    ]
  },
  AD: {
    adpsDropdown: true,
    charges: 24,
    class: 'wiz',
    duration: 280000,
    level: 254,
    mode: 'wiz',
    name: 'Arcane Destruction V',
    effects: [
      {
        spa: 212,
        slot: 1,
        type: 'sp',
        value: 0.60,
        limits: [
          { maxDuration: 0 },
          { type: 'detrimental' },
          { minDmg: 100 },
          { exSkills: COMBAT_SKILLS },
          { minManaCost: 10 }
        ]
      }
    ]
  },
  AF: {
    adpsDropdown: true,
    class: 'wiz',
    duration: 240000,
    level: 254,
    mode: 'wiz',
    name: 'Arcane Fury III',
    effects: [
      {
        spa: 302,
        slot: 1,
        type: 'sp',
        value: 0.15,
        limits: [
          { maxDuration: 0 },
          { type: 'detrimental' },
          { minManaCost: 10 },
          { maxLevel: 110 }
        ]
      }
    ]
  },
  AFU: {
    class: 'wiz',
    level: 254,
    mode: 'wiz',
    name: 'Arcane Fusion',
    effects: [
      {
        proc: '', // value read from settings/UI choice
        limits: [
          { onSpellUse: true },
          { maxDuration: 0 },
          { minManaCost: 10 },
          { minLevel: 95 },
          { minCastTime: 3000 }
        ]
      }
    ]
  },
  AHB: {
    level: 255,
    name: 'Ancient Hedgewizard Brew',
    repeatEvery: -1,
    effects: [
      {
        proc: 'AHB',
        limits: [
          { onSpellUse: true },
          { minManaCost: 10 },
          { type: 'detrimental' },
          { exSkills: COMBAT_SKILLS },
        ]
      }
    ]
  },
  AM: {
    charges: 4,
    class: 'brd',
    duration: 24000 + TICK_OFFSET, // about 4 ticks
    level: 105,
    name: 'Arcane Melody III',
    refreshTime: 12000, // varies depending on bard melody set
    repeatEvery: -1,
    effects: [
      {
        proc: 'AM',
        limits: [
          { onSpellUse: true },
          { currentHitPoints: true },
          { exSpells: new Set(['AM']) },
          { maxLevel: 105 },
          { type: 'detrimental' },
          { exSkills: COMBAT_SKILLS },
          { minManaCost: 10 }
        ]
      }
    ]
  },
  ARCO: {
    charges: 5,
    class: 'wiz',
    debuff: true,
    duration: 30000 + TICK_OFFSET,
    level: 254,
    mode: 'wiz',
    name: 'Arcomancy XXIV',
    repeatEvery: -999,
    type: 'sp',
    effects: [
      {
        slot: 1,
        spa: 297,
        value: 2050,
        limits: [
          { maxLevel: 105 },
          { minLevel: 75 },
          { minManaCost: 10 }
        ]
      }
    ]
  },
  ARIA: {
    class: 'brd',
    level: 101,
    name: 'Aria of Maetanrus Rk. III',
    refreshTime: 12000,
    repeatEvery: -1,
    effects: [
      {
        spa: 124,
        slot: 1,
        type: 'sp',
        value: 0.45,
        limits: [
          { maxLevel: 105 },
          { type: 'detrimental' },
          { exTargets: TARGET_AES },
          { exSkills: COMBAT_SKILLS }
        ]
      }
    ]
  },
  AUS: {
    adpsDropdown: true,
    class: 'rng',
    duration: 96000,
    level: 254,
    name: 'Auspice of the Hunter XXVI',
    effects: [
      {
        spa: 294,
        slot: 1,
        type: 'sp',
        value: 0.33
      }
/*
      {
        spa: 273,
        slot: 5,
        type: 'sp',
        value: 0.33
      }
*/
    ]
  },
  B2: {
    adpsDropdown: true,
    class: 'brd',
    duration: 90000,
    level: 254,
    name: 'Second Spire of the Minstrels IV',
    effects: [
      {
        spa: 286,
        slot: 1,
        type: 'sp',
        value: 2000,
        limits: [
          { type: 'detrimental' },
          { minManaCost: 10 }
        ]
      }
    ]
  },
  BLIZZARD: {
    class: 'dru',
    debuff: true,
    level: 102,
    name: 'Blizzard Breath Rk. III',
    repeatEvery: -1,
    effects: [
      {
        spa: 296,
        slot: 1,
        type: 'sp',
        value: 0.055,
        limits: [
          { maxLevel: 105 },
          { type: 'detrimental' },
          { exSkills: COMBAT_SKILLS },
          { resists: new Set(['COLD']) }
        ]
      }
    ]
  },
  BONDF: {
    level: 255,
    name: 'Bond of the Flame',
    effects: [
      {
        spa: 286,
        slot: 1,
        type: 'wn',
        value: 500,
        limits: [
          { resists: new Set(['FIRE']) },
          { currentHitPoints: true },
          { nonRepeating: true },
          { type: 'detrimental' },
          { minManaCost: 100 },
          { exSkills: COMBAT_SKILLS }
        ]
      }
    ]
  },
  CH: {
    adpsDropdown: true,
    charges: 2,
    class: 'enc',
    duration: 12000 + TICK_OFFSET,
    level: 254,
    name: 'Chromatic Haze VII',
    effects: [
      {
        spa: 302,
        slot: 1,
        type: 'sp',
        value: 3.75,
        limits: [
          { type: 'detrimental' },
          { maxDuration: 0 },
          { minManaCost: 10 },
          { maxLevel: 110 },
          { minDmg: 100 },
          { nonRepeating: true }
        ]
      },
      {
        spa: 294,
        slot: 10,
        type: 'sp',
        value: 1.0
      }
    ]
  },
  CRYO: {
    charges: 1,
    class: 'wiz',
    debuff: true,
    level: 254,
    mode: 'wiz',
    name: 'Cryomancy XXIV',
    repeatEvery: -999,
    effects: [
      {
        proc: 'CRYO',
        limits: [
          { onSpellUse: true },
          { type: 'detrimental' },
          { resists: new Set(['COLD']) },
          { minLevel: 70 },
          { maxLevel: 105 },
          { maxDuration: 0 },
          { minManaCost: 10 }
        ]
      }
    ]
  },
  DADEPT: {
    class: 'wiz',
    mode: 'wiz',
    name: 'Destructive Adept AA',
    effects: [
      {
        spa: 124,
        slot: 1,
        type: 'aa',
        value: 0, // value read from settings/UI choice
        limits: [
          { type: 'detrimental' },
          { maxDuration: 0 },
          { minManaCost: 10 }
        ]
      }
    ]
  },
  DR: {
    adpsDropdown: true,
    charges: 16,
    class: 'enc',
    duration: 18000 + TICK_OFFSET, // Test similar to MR
    level: 250,
    name: 'Dichotomic Reinforcement 6',
    effects: [
      {
        proc: 'DR',
        limits: [
          { onSpellUse: true },
          { maxLevel: 110 },
          { type: 'detrimental' },
          { exSpells: new Set(['DR']) },
          { minManaCost: 100 }
        ]
      },
      {
        spa: 303,
        slot: 8,
        type: 'sp',
        value: 3959,
        limits: [
          { maxLevel: 110 },
          { type: 'detrimental' },
          { minManaCost: 100 }
        ]
      }
    ]
  },
  DS: {
    manuallyActivated: true,
    name: 'Dark Shield of the Scholar',
    refreshTime: 10000,
    repeatEvery: -1,
    timer: '3',
    effects: [
      {
        proc: 'DS',
        limits: [
          { activated: true }
        ]
      }
    ]
  },
  E3: {
    adpsDropdown: true,
    class: 'enc',
    duration: 90000,
    level: 254,
    name: 'Third Spire of Enchantment IV',
    effects: [
      {
        spa: 294,
        slot: 11,
        type: 'sp',
        value: 0.09
      }
    ]
  },
  EDECAY: {
    level: 255,
    name: 'Eyes of Life and Decay',
    effects: [
      {
        spa: 413,
        slot: 1,
        type: 'wn',
        value: 0.0, // value read from settings/UI choice
        limits: [
          { maxLevel: 105 },
          { currentHitPoints: true }
          // others not sure how to handle and prob dont need to
        ]
      }
    ]
  },
  ESYN: {
    charges: 1,
    class: 'enc',
    duration: 12000 + TICK_OFFSET,
    level: 254,
    name: 'Beguiler\'s Synergy I',
    repeatEvery: 11000,
    tooltip: 'How often to proc a single Beguiler\'s Synergy (in seconds).\rDefaults to minimum time for chain casting Mindsunder.',
    effects: [
      {
        spa: 461,
        slot: 1,
        type: 'sp',
        value: 0.4,
        limits: [
         { resists: new Set(['MAGIC', 'FIRE', 'COLD']) },
         { maxLevel: 249 },
         { minDmg: 100 },
         { nonRepeating: true }
        ]
      }
    ]
  },
  EU: {
    adpsDropdown: true,
    class: 'mag',
    duration: 144000,
    level: 254,
    mode: 'mag',
    name: 'Elemental Union XIII',
    effects: [
      {
        spa: 124,
        slot: 1,
        type: 'sp',
        value: 0.95,
        limits: [
          { maxLevel: 105 },
          { type: 'detrimental' },
          { exSkills: COMBAT_SKILLS },
          { exTargets: TARGET_AES }
        ]
      }
    ]
  },
  FD: {
    adpsDropdown: true,
    charges: 45,
    class: 'wiz',
    duration: 410000,
    level: 254,
    mode: 'wiz',
    name: 'Frenzied Devastation XXIX',
    effects: [
      {
        spa: 212,
        slot: 1,
        type: 'sp',
        value: 0.51,
        limits: [
          { maxDuration: 0 },
          { type: 'detrimental' },
          { minDmg: 100 },
          { exSkills: COMBAT_SKILLS },
          { minManaCost: 10 }
        ]
      },
      {
        spa: 170,
        slot: 8,
        type: 'sp',
        value: 0.80
      }
    ]
  },
  FIERCE: {
    adpsDropdown: true,
    class: 'brd',
    duration: 120000,
    level: 105,
    name: 'Fierce Eye III',
    effects: [
/*
      {
        spa: 273,
        slot: 2,
        type: 'sp',
        value: 0.12
      }
*/
      {
        spa: 294,
        slot: 5,
        type: 'sp',
        value: 0.12
      },
      {
        spa: 170,
        slot: 6,
        type: 'sp',
        value: 0.12
      }
    ]
  },
  FCOLD55: {
    level: 255,
    name: 'Cold Damage 55-75 L110',
    effects: [
      {
        spa: 124,
        slot: 1,
        type: 'wn',
        value: 0.65,
        limits: [
          { maxLevel: 110 },
          { type: 'detrimental' },
          { exTargets: TARGET_AES },
          { exSkills: COMBAT_SKILLS },
          { resists: new Set(['COLD']) }
        ]
      }
    ]
  },
  FCOLD57: {
    level: 255,
    name: 'Cold Damage 57-75 L115',
    effects: [
      {
        spa: 124,
        slot: 1,
        type: 'wn',
        value: 0.66,
        limits: [
          { maxLevel: 110 },
          { type: 'detrimental' },
          { exTargets: TARGET_AES },
          { exSkills: COMBAT_SKILLS },
          { resists: new Set(['COLD']) }
        ]
      }
    ]
  },
  FCOLD65: {
    level: 255,
    name: 'Cold Damage 65-100 L110',
    effects: [
      {
        spa: 124,
        slot: 1,
        type: 'wn',
        value: 0.825,
        limits: [
          { maxLevel: 110 },
          { type: 'detrimental' },
          { exTargets: TARGET_AES },
          { exSkills: COMBAT_SKILLS },
          { resists: new Set(['COLD']) }
        ]
      }
    ]
  },
  FCOLD67: {
    level: 255,
    name: 'Cold Damage 67-100 L115',
    effects: [
      {
        spa: 124,
        slot: 1,
        type: 'wn',
        value: 0.84,
        limits: [
          { maxLevel: 110 },
          { type: 'detrimental' },
          { exTargets: TARGET_AES },
          { exSkills: COMBAT_SKILLS },
          { resists: new Set(['COLD']) }
        ]
      }
    ]
  },
  FFIRE55: {
    level: 255,
    name: 'Fire Damage 55-75 L110',
    effects: [
      {
        spa: 124,
        slot: 1,
        type: 'wn',
        value: 0.65,
        limits: [
          { maxLevel: 110 },
          { type: 'detrimental' },
          { exTargets: TARGET_AES },
          { exSkills: COMBAT_SKILLS },
          { resists: new Set(['FIRE']) }
        ]
      }
    ]
  },
  FFIRE57: {
    level: 255,
    name: 'Fire Damage 57-75 L115',
    effects: [
      {
        spa: 124,
        slot: 1,
        type: 'wn',
        value: 0.66,
        limits: [
          { maxLevel: 110 },
          { type: 'detrimental' },
          { exTargets: TARGET_AES },
          { exSkills: COMBAT_SKILLS },
          { resists: new Set(['FIRE']) }
        ]
      }
    ]
  },
  FFIRE65: {
    level: 255,
    name: 'Fire Damage 65-100 L110',
    effects: [
      {
        spa: 124,
        slot: 1,
        type: 'wn',
        value: 0.825,
        limits: [
          { maxLevel: 110 },
          { type: 'detrimental' },
          { exTargets: TARGET_AES },
          { exSkills: COMBAT_SKILLS },
          { resists: new Set(['FIRE']) }
        ]
      }
    ]
  },
  FFIRE67: {
    level: 255,
    name: 'Fire Damage 67-100 L115',
    effects: [
      {
        spa: 124,
        slot: 1,
        type: 'wn',
        value: 0.84,
        limits: [
          { maxLevel: 110 },
          { type: 'detrimental' },
          { exTargets: TARGET_AES },
          { exSkills: COMBAT_SKILLS },
          { resists: new Set(['FIRE']) }
        ]
      }
    ]
  },
  FMAGIC55: {
    level: 255,
    name: 'Magic Damage 55-75 L110',
    effects: [
      {
        spa: 124,
        slot: 1,
        type: 'wn',
        value: 0.65,
        limits: [
          { maxLevel: 110 },
          { type: 'detrimental' },
          { exTargets: TARGET_AES },
          { exSkills: COMBAT_SKILLS },
          { resists: new Set(['MAGIC']) }
        ]
      }
    ]
  },
  FMAGIC57: {
    level: 255,
    name: 'Magic Damage 57-75 L115',
    effects: [
      {
        spa: 124,
        slot: 1,
        type: 'wn',
        value: 0.66,
        limits: [
          { maxLevel: 110 },
          { type: 'detrimental' },
          { exTargets: TARGET_AES },
          { exSkills: COMBAT_SKILLS },
          { resists: new Set(['MAGIC']) }
        ]
      }
    ]
  },
  FMAGIC65: {
    level: 255,
    name: 'Magic Damage 65-100 L110',
    effects: [
      {
        spa: 124,
        slot: 1,
        type: 'wn',
        value: 0.825,
        limits: [
          { maxLevel: 110 },
          { type: 'detrimental' },
          { exTargets: TARGET_AES },
          { exSkills: COMBAT_SKILLS },
          { resists: new Set(['MAGIC']) }
        ]
      }
    ]
  },
  FMAGIC67: {
    level: 255,
    name: 'Magic Damage 67-100 L115',
    effects: [
      {
        spa: 124,
        slot: 1,
        type: 'wn',
        value: 0.84,
        limits: [
          { maxLevel: 110 },
          { type: 'detrimental' },
          { exTargets: TARGET_AES },
          { exSkills: COMBAT_SKILLS },
          { resists: new Set(['MAGIC']) }
        ]
      }
    ]
  },
  FR: {
    adpsDropdown: true,
    duration: 20000,
    instant: true,
    level: 254,
    name: 'Forceful Rejuvenation',
    effects: [
      {
        spa: 389,
        slot: 1,
        type: 'aa',
        limits: [
          { exSpells: new Set(['TC']) }
        ]
      }
    ]
  },
  FURYGODS: {
    adpsDropdown: true,
    class: 'wiz',
    duration: 240000,
    level: 254,
    mode: 'wiz',
    name: 'Fury of the Gods XLVIII',
    effects: [
      {
        spa: 303,
        slot: 1,
        type: 'sp',
        value: 3600,
        limits: [
          { type: 'detrimental' },
          { maxDuration: 0 }
        ]
      }
    ]
  },
  FE: { // generated
    class: 'mag',
    level: 254,
    manuallyActivated: true,
    mode: 'mag',
    name: 'Force of Elements',
    refreshTime: 20000,
    repeatEvery: -1,
    timer: '73',
    effects: [
      { 
        proc: '',
        limits: [
          { activated: true }
        ]
      }
    ]
  },
  FI: { // generated
    class: 'wiz',
    level: 254,
    manuallyActivated: true,
    mode: 'wiz',
    name: 'Force of Ice',
    refreshTime: 20000,
    repeatEvery: -1,
    timer: '44',
    effects: [
       { 
        proc: '',
        limits: [
          { activated: true }
        ]
      }
    ]
  },
  FBO: {
    charges: 10,
    class: 'mag',
    manuallyActivated: true,
    mode: 'mag',
    name: 'Firebound Orb III',
    refreshTime: 12000,
    refreshTrigger: 'SFB',
    repeatEvery: -1,
    timer: '5',
    effects: [
      { 
        proc: 'BJ',
        limits: [
          { activated: true }
        ]
      }
    ]
  },
  FF: { // generated
    class: 'wiz',
    level: 254,
    manuallyActivated: true,
    mode: 'wiz',
    name: 'Force of Flame',
    refreshTime: 20000,
    repeatEvery: -1,
    timer: '36',
    effects: [
      { 
        proc: '',
        limits: [
          { activated: true }
        ]
      }
    ]
  },
  FIREBA: {
    adpsDropdown: true,
    class: 'mag',
    charges: 8,
    duration: 18000 + TICK_OFFSET,
    level: 101,
    mode: 'mag',
    name: 'Firebound Alliance Rk. III',
    otherCast: true,
    effects: [
      {
        spa: 484,
        slot: 1,
        type: 'sp',
        value: 36643,
        limits: [
          { targets: TARGET_LOS },
          { currentHitPoints: true },
          { type: 'detrimental' },
          { minLevel: 96 },
          { maxLevel: 110 },
          { maxDuration: 0 },
          { minManaCost: 10 },
          { minDmg: 2500 }
        ]
      }
    ]
  },
  FROSTBA: {
    adpsDropdown: true,
    class: 'wiz',
    charges: 8,
    duration: 18000 + TICK_OFFSET,
    level: 102,
    mode: 'wiz',
    name: 'Frostbound Alliance Rk. III',
    otherCast: true,
    effects: [
      {
        spa: 484,
        slot: 1,
        type: 'sp',
        value: 48115,
        limits: [
          { targets: TARGET_SINGLE },
          { currentHitPoints: true },
          { type: 'detrimental' },
          { minLevel: 96 },
          { maxLevel: 110 },
          { maxDuration: 0 },
          { minManaCost: 10 },
          { minDmg: 2500 }
        ]
      }
    ]
  },
  FW: { // generated
    class: 'wiz',
    level: 254,
    manuallyActivated: true,
    mode: 'wiz',
    name: 'Force of Will',
    refreshTime: 12000,
    repeatEvery: -1,
    timer: '37',
    effects: [
      { 
        proc: '',
        limits: [
          { activated: true }
        ]
      }
    ]
  },
  FWAE: {
    charges: 6,
    class: 'dru',
    duration: 18000 + TICK_OFFSET,
    level: 103,
    name: 'Frostweave Aura III',
    refreshTime: 18000,
    repeatEvery: -1,
    effects: [
      {
        proc: 'FW',
        limits: [
          { onSpellUse: true },
          { type: 'detrimental' },
          { currentHitPoints: true },
          { exSpells: new Set(['FW']) },
          { exSkills: COMBAT_SKILLS },
          { maxLevel: 110 },
          { minManaCost: 10 }
        ]
      }
    ]
  },
  GBW: {
    adpsDropdown: true,
    class: 'dru',
    duration: 225000,
    level: 254,
    name: 'Group Spirit of the Black Wolf VI',
    effects: [
      {
        spa: 294,
        slot: 8,
        type: 'sp',
        value: 0.1
      },
      {
        spa: 170,
        slot: 9,
        type: 'sp',
        value: 1.0
      }
    ]
  },
  GCH: {
    charges: 1,
    class: 'enc',
    duration: 12000 + TICK_OFFSET,
    level: 254,
    name: 'Gift of Chroma Haze',
    repeatEvery: 20000,
    tooltip: 'How often to proc a single Gift of Chromatic Haze (in seconds).\rKeep in mind that it procs only 8% of the time an Enchanter casts a DD, DoT, or Stun so you may want it fairly high.',
    effects: [
      {
        spa: 302,
        slot: 1,
        type: 'sp',
        value: 0.40,
        limits: [
          { type: 'detrimental' },
          { maxDuration: 0 },
          { minManaCost: 10 },
          { maxLevel: 110 },
          { minDmg: 100 },
          { nonRepeating: true }
        ]
      },
      {
        spa: 294,
        slot: 10,
        type: 'sp',
        value: 1.0
      }
    ]
  },
  EQPPROC: {
    level: 255,
    name: 'General EQP Proc Rules',
    effects: [
      {
        limits: [
          { onSpellUse: true },
          { type: 'detrimental' },
          { minLevel: 70 },
          { minManaCost: 10 },
          { exSkills: COMBAT_SKILLS }
        ]
      }
    ]
  },
  GLYPHC: {
    adpsDropdown: true,
    duration: 120000,
    level: 254,
    name: 'Glyph of the Cataclysm',
    effects: [
      {
        spa: 170,
        slot: 10,
        type: 'sp',
        value: 0.6
      }
/*
      {
        spa: 375,
        slot: 8,
        type: 'sp',
        value: 0.6
      }
*/
    ]
  },
  FPWR: {
    class: 'mag',
    charges: 2,
    duration: 60000,
    level: 255,
    mode: 'mag',
    name: 'Flames of Power IV',
    effects: [
      {
        spa: 124,
        slot: 1,
        type: 'sp',
        value: 1.05,
        limits: [
          { minDmg: 100 },
          { type: 'detrimental' },
          { exTargets: TARGET_AES },
          { exSkills: COMBAT_SKILLS },
          { minManaCost: 10 },
          { maxLevel: 105 } // need to really verify
        ]
      }
    ]
  },
  FWEAK: {
    class: 'mag',
    charges: 1000, // workaround to see count in stats
    duration: 12000 + TICK_OFFSET,
    level: 255,
    mode: 'mag',
    name: 'Flames of Weakness IV',
    effects: [
      {
        spa: 124,
        slot: 1,
        type: 'sp',
        value: -0.25,
        limits: [
          { currentHitPoints: true },
          { type: 'detrimental' },
          { exTargets: TARGET_AES },
          { exSkills: COMBAT_SKILLS },
          { maxLevel: 105 } // need to really verify
        ]
      }
    ]
  },
  HOF: {
    adpsDropdown: true,
    class: 'mag',
    duration: 276000,
    level: 254,
    mode: 'mag',
    name: 'Heart of Flames XII',
    effects: [
      {
        spa: 124,
        slot: 1,
        type: 'sp',
        value: 1.1,
        limits: [
          { maxLevel: 105 },
          { resists: new Set(['FIRE']) },
          { type: 'detrimental' },
          { exSkills: COMBAT_SKILLS },
          { exTargets: TARGET_AES }
        ]
      }
    ]
  },
  HOV: {
    adpsDropdown: true,
    class: 'mag',
    duration: 276000,
    level: 254,
    mode: 'mag',
    name: 'Heart of Vapor XIV',
    effects: [
      {
        spa: 170,
        slot: 6,
        type: 'sp',
        value: 0.35
      }
    ]
  },
  IMPF: {
    class: 'wiz',
    level: 254,
    mode: 'wiz',
    name: 'Improved Familiar XXVIII',
    effects: [
      {
        spa: 124,
        slot: 1,
        type: 'sp',
        value: 0.5,
        limits: [
          { maxDuration: 0 },
          { type: 'detrimental' },
          { exTargets: TARGET_AES },
          { maxLevel: 105 }, // from testing
          { exSkills: COMBAT_SKILLS }, // from testing
        ]
      },
      {
        spa: 170, // moved rules up from testing
        slot: 5,
        type: 'sp',
        value: 0.27,
      }
    ]
  },
  INTENSE: {
    adpsDropdown: true,
    duration: 60000,
    level: 254,
    name: 'Intensity of the Resolute',
    effects: [
/*
      {
        spa: 273,
        slot: 2,
        type: 'sp',
        value: 0.50
      },

*/
      {
        spa: 294,
        slot: 5,
        type: 'sp',
        value: 0.50
      }
    ]
  },
  ITC: {
    adpsDropdown: true,
    charges: 18,
    duration: 150000,
    level: 254,
    name: 'Improved Twincast VI',
    effects: [
      {
        spa: 399,
        slot: 1,
        type: 'sp',
        value: 1.0,
        limits: [
          { currentHitPoints: true },
          { exTwincastMarker: true },
          { minManaCost: 10 },
          { exSkills: COMBAT_SKILLS },
          { type: 'detrimental' }
        ]
      }
    ]
  },
  IOG: {
    adpsDropdown: true,
    class: 'enc',
    duration: 120000,
    level: 105,
    name: 'Illusions of Grandeur II',
    effects: [
/*
      {
        spa: 273,
        slot: 2,
        type: 'sp',
        value: 0.12
      },
      {
        spa: 375,
        slot: 3,
        type: 'sp',
        value: 1.15
      },
*/
      {
        spa: 294,
        slot: 5,
        type: 'sp',
        value: 0.12
      },
      {
        spa: 170,
        slot: 6,
        type: 'sp',
        value: 1.55
      }
    ]
  },
  LINGERING: {
    class: 'enc',
    debuff: true,
    level: 255,
    name: 'Tashan\'s Lingering Cry IV',
    repeatEvery: -1,
    effects: [
      {
        spa: 483,
        slot: 1,
        type: 'sp',
        value: 0.08,
        limits: [
          { maxLevel: 110 },
          { minManaCost: 10 }
        ]
      }
    ]
  },
  MALO: {
    class: 'mag',
    debuff: true,
    level: 101,
    name: 'Malosenete Rk. III',
    otherCast: true,
    repeatEvery: -1,
    effects: [
      {
        spa: 296,
        slot: 1,
        type: 'sp',
        value: 0.055,
        limits: [
          { maxLevel: 105 },
          { type: 'detrimental' },
          { resists: new Set(['MAGIC']) },
          { exSkills: COMBAT_SKILLS }
        ]
      }
    ]
  },
  MBRN: {
    adpsDropdown: true,
    class: 'wiz',
    charges: 500,
    duration: 120000,
    level: 254,
    name: 'Mana Burn XVI',
    effects: [
      {
        spa: 484,
        slot: 1,
        type: 'sp',
        value: 19200,
        limits: [
          { maxDuration: 0 }
        ]
      }
    ]
  },
  M1: {
    adpsDropdown: true,
    class: 'mag',
    duration: 90000,
    level: 254,
    mode: 'mag',
    name: 'First Spire of Elements IV',
    effects: [
      {
        spa: 294,
        slot: 2,
        type: 'sp',
        value: 0.24
      }
    ]
  },
  MC: {
    adpsDropdown: true,
    charges: 3,
    duration: 24000 + TICK_OFFSET,
    hitType: 'any',
    level: 255,
    name: 'Mana Charge',
    effects: [
      {
        spa: 294,
        slot: 1,
        type: 'sp',
        value: 1.75
      },
      {
        spa: 170,
        slot: 2,
        type: 'sp',
        value: 0.50
      }
    ]
  },
  MRA: {
    charges: 6,
    class: 'enc',
    duration: 18000 + TICK_OFFSET,
    level: 105,
    name: 'Mana Reciprocation Aura Rk. III',
    refreshTime: 18000,
    repeatEvery: -1,
    effects: [
      {
        proc: 'MR',
        limits: [
          { onSpellUse: true },
          { type: 'detrimental' },
          { exSkills: COMBAT_SKILLS },
          { exSpells: new Set(['MR']) },
          { maxLevel: 105 },
          { minManaCost: 10 }
        ]
      }
    ]
  },
  MSYN: {
    class: 'mag',
    charges: 1,
    duration: 12000 + TICK_OFFSET,
    level: 254,
    name: 'Conjurer\'s Synergy I',
    otherCast: true,
    repeatEvery: 13000,
    tooltip: 'How often to proc a single Conjurer\'s Synergy (in seconds).\rDefaults to minimum time for chain casting Remorseless Servant.',
    effects: [
      {
        spa: 302,
        slot: 1,
        type: 'sp',
        value: 0.50,
        limits: [
          { resists: new Set(['FIRE', 'CHROMATIC']) },
          { maxLevel: 250 },
          { minDmg: 100 },
          { nonRepeating: true }
        ]
      }
    ]
  },
  NILSARA: {
    class: 'brd',
    level: 103,
    name: 'Nilsara\'s Aria Rk. III',
    refreshTime: 12000,
    repeatEvery: -1,
    effects: [
      {
        spa: 286,
        slot: 1,
        type: 'sp',
        value: 1638,
        limits: [
          { minLevel: 96 },
          { maxLevel: 105 },
          { type: 'detrimental' },
          { exTargets: TARGET_AES },
          { maxDuration: 0 },
          { minManaCost: 10 },
          { resists: new Set(['FIRE']) }
        ]
      }
    ]
  },
  NSYN: {
    charges: 1,
    class: 'nec',
    duration: 12000 + TICK_OFFSET,
    level: 254,
    name: 'Defiler\'s Synergy I',
    repeatEvery: 7000,
    tooltip: 'How often to proc a single Defiler\'s Synergy (in seconds).\rDefaults to minimum time for chain casting Impose for Blood.',
    effects: [
      {
        spa: 170,
        slot: 1,
        type: 'sp',
        value: 0.15
      }
/*
      {
        spa: 375,
        slot: 2,
        type: 'sp',
        value: 0.15
      }
*/
    ]
  },
  PYRO: {
    class: 'wiz',
    debuff: true,
    duration: 36000, // dot does 5 ticks of damage plus 1 at the end
    level: 254,
    mode: 'wiz',
    name: 'Pyromancy XXIV',
    repeatEvery: -999,
    effects: [] // handled by DOT generator and constants in dmgU
  },
  SEEDLINGS: {
    class: 'dru',
    debuff: true,
    level: 98,
    name: 'Skin to Seedlings Rk. III',
    repeatEvery: -1,
    effects: [
      {
        spa: 296,
        slot: 1,
        type: 'sp',
        value: 0.065,
        limits: [
          { maxLevel: 105 },
          { type: 'detrimental' },
          { resists: new Set(['FIRE']) },
          { exSkills: COMBAT_SKILLS }
        ]
      }
    ]
  },
  SEERS: {
    level: 255,
    name: 'Boon of the Seeress',
    effects: [
      {
        spa: 286,
        slot: 1,
        type: 'sp',
        value: 500,
        limits: [
          { currentHitPoints: true },
          { nonRepeating: true },
          { maxManaCost: 0 },
          { type: 'detrimental' },
          { exSkills: COMBAT_SKILLS },
          { minLevel: 254 },
          { maxDuration: 0 },
          { maxCastTime: 0 }
        ]
      }
    ]
  },
  SVENG: {
    class: 'wiz',
    mode: 'wiz',
    name: 'Sorcerer\'s Vengeance AA',
    effects: [
      {
        spa: 286,
        slot: 1,
        type: 'aa',
        value: 0, // value read from settings/UI choice
        limits: [
          { type: 'detrimental' },
          { minCastTime: 1 },
          { minManaCost: 10 },
          { maxDuration: 0 }
        ]
      }
    ]
  },
  SYLLICE: {
    charges: 1,
    class: 'wiz',
    duration: 30000 + TICK_OFFSET,
    level: 255,
    mode: 'wiz',
    name: 'Syllable of Ice III',
    effects: [
      {
        spa: 303,
        slot: 1,
        type: 'sp',
        value: 3469,
        limits: [
          { minCastTime: 3000 }, 
          { currentHitPoints: true },
          { type: 'detrimental' },
          { exSkills: COMBAT_SKILLS },
          { maxLevel: 105 },
          { minManaCost: 10 },
          { resists: new Set(['COLD']) }
        ]
      }
    ]
  },
  SYLLFIRE: {
    class: 'wiz',
    charges: 1,
    duration: 30000 + TICK_OFFSET,
    level: 255,
    mode: 'wiz',
    name: 'Syllable of Fire III',
    effects: [
      {
        spa: 303,
        slot: 1,
        type: 'sp',
        value: 3469,
        limits: [
          { minCastTime: 3000 }, 
          { currentHitPoints: true },
          { type: 'detrimental' },
          { exSkills: COMBAT_SKILLS },
          { maxLevel: 105 },
          { minManaCost: 10 },
          { resists: new Set(['FIRE']) }
        ]
      }
    ]
  },
  SYLLMAGIC: {
    class: 'wiz',
    charges: 1,
    duration: 30000 + TICK_OFFSET,
    level: 255,
    mode: 'wiz',
    name: 'Syllable of Magic III',
    effects: [
      {
        spa: 303,
        slot: 1,
        type: 'sp',
        value: 3469,
        limits: [
          { minCastTime: 3000 }, 
          { currentHitPoints: true },
          { type: 'detrimental' },
          { exSkills: COMBAT_SKILLS },
          { maxLevel: 105 },
          { minManaCost: 10 },
          { resists: new Set(['MAGIC']) }
        ]
      }
    ]
  },
  SYLLMASTER: {
    class: 'wiz',
    charges: 1,
    duration: 30000 + TICK_OFFSET,
    level: 255,
    mode: 'wiz',
    name: 'Syllable of Mastery III',
    effects: [
      {
        spa: 303,
        slot: 1,
        type: 'sp',
        value: 4232,
        limits: [
          { minCastTime: 3000 }, 
          { currentHitPoints: true },
          { type: 'detrimental' },
          { exSkills: COMBAT_SKILLS },
          { maxLevel: 105 },
          { minManaCost: 10 }
        ]
      }
    ]
  },
  SW: {
    adpsDropdown: true,
    class: 'dru',
    duration: 30000 + TICK_OFFSET,
    level: 254,
    name: 'Season\'s Wrath V',
    effects: [
      {
        spa: 296,
        slot: 1,
        type: 'sp',
        value: 0.185,
        limits: [
          { type: 'detrimental' },
          { resists: new Set(['FIRE', 'COLD']) }
        ]
      }
    ]
  },
  TC: {
    adpsDropdown: true,
    duration: 18000 + TICK_OFFSET,
    level: 85,
    name: 'Twincast Rk. III',
    effects: [
      {
        spa: 399,
        slot: 1,
        type: 'sp',
        value: 1.0,
        limits: [
          { currentHitPoints: true },
          { exTwincastMarker: true },
          { minManaCost: 10 },
          { exSkills: COMBAT_SKILLS },
          { type: 'detrimental' }
        ]
      }
    ]
  },
  TCA: {
    class: 'enc',
    level: 84,
    name: 'Twincast Aura Rk. III',
    refreshTime: 12000,
    repeatEvery: -1,
    effects: [
      {
        spa: 399,
        slot: 1,
        type: 'sp',
        value: 0.11,
        limits: [
          { currentHitPoints: true },
          { exTwincastMarker: true },
          { minManaCost: 10 },
          { exSkills: COMBAT_SKILLS },
          { type: 'detrimental' }
        ]
      }
    ]
  },
  TCAA: {
    name: 'Twincast AA',
    effects: [
      {
        spa: 399,
        slot: 1,
        type: 'aa',
        value: 0, // value read from settings/UI choice
        limits: [
          { maxDuration: 0 },
          { type: 'detrimental' },
          { maxLevel: 254 },
          { minManaCost: 10 },
          { currentHitPoints: true },
          { exSkills: COMBAT_SKILLS },
          { exTwincastMarker: true }
        ]
      }
    ]
  },
  THREADS: {
    level: 255,
    name: 'Threads of Mana',
    effects: [
      {
        spa: 286,
        slot: 1,
        type: 'wn',
        value: 1000,
        limits: [
          { resists: new Set(['MAGIC']) },
          { currentHitPoints: true },
          { nonRepeating: true },
          { type: 'detrimental' },
          { minManaCost: 100 },
          { exSkills: COMBAT_SKILLS }
        ]
      }
    ]
  },
  TP: {
    name: 'Twinproc AA',
    effects: [
      {
        spa: 399,
        slot: 1,
        type: 'aa',
        value: 0, // value read from settings/UI choice
        limits: [
          { maxDuration: 0 },
          { type: 'detrimental' },
          { maxDuration: 0 },
          { minLevel: 255 },
          { maxManaCost: 0 },
          { exSkills: COMBAT_SKILLS },
          { exTwincastMarker: true }
        ]
      }
    ]
  },
  VES: {
    adpsDropdown: true,
    class: 'brd',
    duration: 120000,
    level: 255,
    name: 'Spirit of Vesagran',
    effects: [
      {
        spa: 294,
        slot: 9,
        type: 'sp',
        value: 0.12
      }
/*
      {
        spa: 273,
        slot: 10,
        type: 'sp',
        value: 0.12
      }
*/
    ]
  },
  VFX: {
    class: 'wiz',
    charges: 24,
    duration: 18000 + TICK_OFFSET,
    level: 103,
    mode: 'wiz',
    name: 'Shocking Vortex Effect',
    effects: [
      {
        spa: 296,
        slot: 1,
        type: 'sp',
        value: 0.75,
        limits: [
          { maxLevel: 110 },
          { type: 'detrimental' },
          { maxDuration: 0 },
          { minManaCost: 100 }
        ]
      }
    ]
  },
  W2: {
    adpsDropdown: true,
    class: 'wiz',
    duration: 90000,
    level: 254,
    mode: 'wiz',
    name: 'Second Spire of Arcanum IV',
    effects: [
      {
        spa: 170,
        slot: 3,
        type: 'sp',
        value: 1.6
      }
    ]
  },
  WIZED5: {
    class: 'wiz',
    level: 255,
    mode: 'wiz',
    name: 'WIZ Ethereal Damage 5',
    effects: [
      {
        spa: 413,
        slot: 1,
        type: 'wn',
        value: 0.05,
        limits: [
       //   { class: 'wiz' }, // messes up tester when in mage mode
          { spells: new Set(['ES']) }
        ]
      }
    ]
  },
  WIZED7: {
    class: 'wiz',
    level: 255,
    mode: 'wiz',
    name: 'WIZ Ethereal Damage 7',
    effects: [
      {
        spa: 413,
        slot: 1,
        type: 'wn',
        value: 0.07,
        limits: [
         // { class: 'wiz' }, // messes up tester when in mage mode
          { spells: new Set(['ES']) }
        ]
      }
    ]
  },
  WSYN: {
    charges: 1,
    class: 'wiz',
    duration: 12000 + TICK_OFFSET,
    level: 254,
    name: 'Evoker\'s Synergy I',
    otherCast: true,
    repeatEvery: 25000,
    tooltip: 'How often to proc a single Evoker\'s Synergy (in seconds).\rDefaults to minimum time for chain casting Shocking Vortex.',
    effects: [
      {
        proc: 'WSYN',
        limits: [
          { onSpellUse: true },
          { resists: new Set(['MAGIC', 'COLD', 'POISON', 'DISEASE', 'CORRUPTION', 'CHROMATIC']) },
          { type: 'detrimental' }
        ]
      }
    ]
  }
};