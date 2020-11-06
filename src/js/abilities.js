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
// 462 - increase spell damage                   (after crit addition)
// 483 - increase spell and dot damage taken     (after SPA 461 mutliplyer)
// 484 - increase spell damage taken             (after SPA 461 addition not modifiable)
// 507 - increase spell damage                   (after SPA 461 multiplayer)

// Notes
// tick durations rounded up 1/2 tick since it seems random what you really get
//   Ex: twincast is 3 ticks and gets 18 to 24 seconds so I go with 21
// 
// repeatEvery -1 means repeat always
//              0 means dont repeat
//             +N repeat every N 
//             -999 repeat when activated by some means like proc/cast

export const SPA_483_FOCUS = SMap([483]);
export const SPA_AFTER_CRIT_ADD = SMap([286]);
export const SPA_AFTER_CRIT_FOCUS = SMap([]);
export const SPA_AFTER_SPA_461_ADD = SMap([462, 484]);
export const SPA_AFTER_SPA_461_FOCUS = SMap([507]);
export const SPA_BEFORE_CRIT_ADD = SMap([297, 303]);
export const SPA_BEFORE_CRIT_FOCUS = SMap([296, 302]);
export const SPA_BEFORE_DOT_CRIT_FOCUS = SMap([124]);
export const SPA_461_FOCUS = SMap([461]);
export const SPA_CRIT_DMG_DOT = SMap([375]);
export const SPA_CRIT_RATE_DOT = SMap([273]);
export const SPA_CRIT_DMG_NUKE = SMap([170]);
export const SPA_CRIT_RATE_NUKE = SMap([212, 294]);
export const SPA_EFFECTIVENESS = SMap([413]);
export const SPA_FOCUSABLE = SMap([124, 212, 286, 296, 297, 302, 303, 399, 461, 462, 483, 484, 507]);
export const SPA_NO_DMG = SMap([389, 399]);
export const SPA_TWINCAST = SMap([399]);

// Build SPA to key Map
export const SPA_KEY_MAP = new Map();
SPA_CRIT_RATE_NUKE.forEach((val, spa) => SPA_KEY_MAP.set(spa, 'addCritRate'));
SPA_CRIT_DMG_NUKE.forEach((val, spa) => SPA_KEY_MAP.set(spa, 'addCritDmg'));
SPA_483_FOCUS.forEach((val, spa) => SPA_KEY_MAP.set(spa, 'spa483Focus'));
SPA_AFTER_CRIT_ADD.forEach((val, spa) => SPA_KEY_MAP.set(spa, 'afterCritAdd'));
SPA_AFTER_CRIT_FOCUS.forEach((val, spa) => SPA_KEY_MAP.set(spa, 'afterCritFocus'));
SPA_AFTER_SPA_461_ADD.forEach((val, spa) => SPA_KEY_MAP.set(spa, 'afterSPA461Add'));
SPA_AFTER_SPA_461_FOCUS.forEach((val, spa) => SPA_KEY_MAP.set(spa, 'afterSPA461Focus'));
SPA_BEFORE_CRIT_ADD.forEach((val, spa) => SPA_KEY_MAP.set(spa, 'beforeCritAdd'));
SPA_BEFORE_CRIT_FOCUS.forEach((val, spa) => SPA_KEY_MAP.set(spa, 'beforeCritFocus'));
SPA_BEFORE_DOT_CRIT_FOCUS.forEach((val, spa) => SPA_KEY_MAP.set(spa, 'beforeDoTCritFocus'));
SPA_461_FOCUS.forEach((val, spa) => SPA_KEY_MAP.set(spa, 'spa461Focus'));
SPA_EFFECTIVENESS.forEach((val, spa) => SPA_KEY_MAP.set(spa, 'effectiveness'));
SPA_TWINCAST.forEach((val, spa) => SPA_KEY_MAP.set(spa, 'twincast'));

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

export function getAbilityList(repeating) {
  let list = [];

  Object.keys(ABILITIES).forEach(key => {
    let ability = ABILITIES[key];

    if ((!ability.mode || (ability.mode && ability.mode === G.MODE)) && (!ability.noClass || !ability.noClass.find(cls => cls === G.MODE))) {
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

function abilitySorter(a, b) {
  let aClass = (G.MODE !== a.class || a.otherCast) ? a.class : '';
  let bClass = (G.MODE !== b.class || b.otherCast) ? b.class : '';
  let aName = (aClass || '') + a.name;
  let bName = (bClass || '') + b.name;

  if (aName > bName) return 1;
  if (bName > aName) return -1;
  return 0;
}

function SMap(list) {
  let map = new Map();
  list.forEach(item => map.set(item, true));
  return map;
}

const COMBAT_SKILLS = SMap([]); // not needed yet
const TARGET_LOS = SMap(['LOS']);
const TARGET_SINGLE = SMap(['SINGLE']);
const TICK_OFFSET = 3000;

const ABILITIES = {
  AB: {
    charges: 4,
    class: 'brd',
    duration: 24000 + TICK_OFFSET, // about 4 ticks
    level: 115,
    name: 'Arcane Symphony Rk. III',
    refreshTime: 12000, // varies depending on bard melody set
    repeatEvery: -1,
    effects: [
      {
        proc: 'AS',
        limits: [
          { onSpellUse: true },
          { currentHitPoints: true },
          { exSpells: SMap(['AB']) },
          { maxLevel: 115 },
          { type: 'detrimental' },
          { exSkills: COMBAT_SKILLS },
          { minManaCost: 10 }
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
    name: 'Arcane Destruction VII',
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
    name: 'Arcane Fury V',
    effects: [
      {
        spa: 302,
        slot: 1,
        type: 'sp',
        value: 0.25,
        limits: [
          { maxDuration: 0 },
          { type: 'detrimental' },
          { minManaCost: 10 },
          { maxLevel: 115 }
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
          { minLevel: 100 },
          { minCastTime: 3000 }
        ]
      }
    ]
  },
  CHROMEA: {
    adpsDropdown: true,
    class: 'enc',
    charges: 6,
    duration: 18000 + TICK_OFFSET,
    level: 108,
    mode: 'enc',
    name: 'Chromatic Covenant Rk. III',
    otherCast: true,
    effects: [
      {
        spa: 484,
        slot: 1,
        type: 'sp',
        value: 51182,
        limits: [
          { targets: TARGET_SINGLE },
          { currentHitPoints: true },
          { type: 'detrimental' },
          { minLevel: 101 },
          { maxLevel: 115 },
          { maxDuration: 0 },
          { minManaCost: 10 },
          { minDmg: 2500 }
        ]
      }
    ]
  },
  CI: {
    adpsDropdown: true,
    charges: 27,
    class: 'enc',
    duration: 240000,
    level: 254,
    mode: 'enc',
    name: 'Calculated Insanity XVII',
    effects: [
      {
        spa: 212,
        slot: 1,
        type: 'sp',
        value: 0.95,
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
        value: 0.10
      }
    ]
  },
  RF: {
    level: 255,
    name: 'Restless Focus',
    repeatEvery: -1,
    effects: [
      {
        proc: 'RF',
        limits: [
          { onSpellUse: true },
          { minManaCost: 10 },
          { minLevel: 75 },
          { type: 'detrimental' },
          { exSkills: COMBAT_SKILLS },
        ]
      }
    ]
  },
  SD: {
    level: 255,
    name: 'Standard of the Drybone Skeleton',
    repeatEvery: -1,
    effects: [
      {
        spa: 124,
        slot: 1,
        type: 'sp',
        value: 0.105,
        limits: [
          { maxDuration: 0 },
          { type: 'detrimental' },
          { maxLevel: 253 }, // from testing
          { exSkills: COMBAT_SKILLS }, // from testing
        ]
      }
    ]
  },  
  ARCO: {
    class: 'wiz',
    charges: 5,
    duration: 30000 + TICK_OFFSET,
    level: 255,
    mode: 'wiz',
    name: 'Arcomancy XXX',
    effects: [
      {
        spa: 462,
        slot: 1,
        type: 'sp',
        value: 13000,
        limits: [
          { minManaCost: 10 },
          { maxDuration: 0 },
          { maxLevel: 115 }
        ]
      }
    ]
  },  
  ARIA: {
    class: 'brd',
    level: 111,
    name: 'Aria of Margidor Rk. III',
    refreshTime: 12000,
    repeatEvery: -1,
    effects: [
      {
        spa: 124,
        slot: 1,
        type: 'sp',
        value: 0.46,
        limits: [
          { maxLevel: 115 },
          { type: 'detrimental' },
          { exTargets: SMap(['TargetAE', 'CasterPB']) },
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
    name: 'Auspice of the Hunter XXX',
    effects: [
      {
        spa: 294,
        slot: 1,
        type: 'sp',
        value: 0.33
      },
      {
        spa: 273,
        slot: 5,
        type: 'sp',
        value: 0.33
      }
    ]
  },
  B2: {
    adpsDropdown: true,
    class: 'brd',
    duration: 90000,
    level: 254,
    name: 'Spire of the Minstrels XII',
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
  BA: {
    charges: 24, // game only uses half of spell data?
    class: 'enc',
    duration: 50000,
    level: 113,
    name: 'Fortifying Aura Rk. III',
    refreshTime: 30000,
    repeatEvery: -1,
    effects: [
      {
        spa: 413,
        slot: 1,
        type: 'sp',
        value: 0.04,
        limits: [
          { maxLevel: 115 },
          { type: 'detrimental' },
          { minManaCost: 10 },
          { exTargets: SMap(['TargetAE', 'CasterPB']) },
          { exSkills: COMBAT_SKILLS }
        ]
      }
    ]
  },
  CDG: {
    charges: 2,
    duration: 18000 + TICK_OFFSET,
    level: 254,
    name: 'Chaotic Delusion Gift',
    effects: [
      {
        spa: 399,
        slot: 1,
        type: 'sp',
        value: 1.0,
        limits: [
          { currentHitPoints: true },
          { maxDuration: 0 },
          { minManaCost: 10 },
          { exSkills: COMBAT_SKILLS },
          { type: 'detrimental' },
          { maxLevel: 115 },
          { exTwincastMarker: true }
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
    name: 'Chromatic Haze IX',
    effects: [
      {
        spa: 302,
        slot: 1,
        type: 'sp',
        value: 3.85,
        limits: [
          { type: 'detrimental' },
          { maxDuration: 0 },
          { minManaCost: 10 },
          { maxLevel: 115 },
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
    name: 'Dissident Reinforcement 6',
    effects: [
      {
        proc: 'DRS',
        limits: [
          { onSpellUse: true },
          { maxLevel: 115 },
          { type: 'detrimental' },
          { exSpells: SMap(['DRS']) },
          { minManaCost: 100 }
        ]
      },
      {
        spa: 303,
        slot: 8,
        type: 'sp',
        value: 4365,
        limits: [
          { maxLevel: 115 },
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
    timer: 'recast-3',
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
    name: 'Spire of Enchantment XII',
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
          { maxLevel: 110 },
          { currentHitPoints: true }
          // others not sure how to handle and prob dont need to
        ]
      }
    ]
  },
  RFOCUS: {
    level: 255,
    name: 'Luminous Restless Ice',
    effects: [
      {
        spa: 413,
        slot: 1,
        type: 'wn',
        value: 0.0, // value read from settings/UI choice
        limits: [
          { maxLevel: 120 },
          { currentHitPoints: true }
          // others not sure how to handle and prob dont need to
        ]
      }
    ]
  },
  OESD7: {
    level: 255,
    name: 'Ethereal/Spear Damage 7',
    effects: [
      {
        spa: 302,
        slot: 1,
        type: 'wn',
        value: 0.07,
        limits: [
          { spells: SMap(['ES', 'SA', 'MS', 'MC']) }
        ]
      }
    ]
  },  
  ESD7: {
    level: 255,
    name: 'Ethereal/Spear Damage 7',
    effects: [
      {
        spa: 302,
        slot: 1,
        type: 'wn',
        value: 0.07,
        limits: [
          { spells: SMap(['EB', 'ES', 'SK', 'SA', 'MT', 'MS', 'MC']) }
        ]
      }
    ]
  },
  OESD9: {
    level: 255,
    name: 'Ethereal/Spear Damage 9',
    effects: [
      {
        spa: 302,
        slot: 1,
        type: 'wn',
        value: 0.09,
        limits: [
          { spells: SMap(['ES', 'SA', 'MS', 'MC']) }
        ]
      }
    ]
  },  
  ESD9: {
    level: 255,
    name: 'Ethereal/Spear Damage 9',
    effects: [
      {
        spa: 302,
        slot: 1,
        type: 'wn',
        value: 0.09,
        limits: [
          { spells: SMap(['EB', 'ES', 'SK', 'SA', 'MT', 'MS', 'MC']) }
        ]
      }
    ]
  },
  ESYN2: {
    charges: 1,
    class: 'enc',
    duration: 12000 + TICK_OFFSET,
    level: 254,
    name: 'Beguiler\'s Synergy II',
    otherCast: true,
    tooltip: 'How often to proc a single Beguiler\'s Synergy (in seconds).\rDefaults to minimum time for chain casting Mindrift.',
    effects: [
      {
        spa: 461,
        slot: 1,
        type: 'sp',
        value: 0.45,
        limits: [
         { resists: SMap(['MAGIC', 'FIRE', 'COLD']) },
         { maxLevel: 249 },
         { minDmg: 100 },
         { nonRepeating: true }
        ]
      }
    ]
  },
  ESYN3: {
    charges: 1,
    class: 'enc',
    duration: 12000 + TICK_OFFSET,
    level: 254,
    name: 'Beguiler\'s Synergy III',
    otherCast: true,
    repeatEvery: 11000,
    tooltip: 'How often to proc a single Beguiler\'s Synergy (in seconds).\rDefaults to minimum time for chain casting Mindrift.',
    effects: [
      {
        spa: 461,
        slot: 1,
        type: 'sp',
        value: 0.55,
        limits: [
         { resists: SMap(['MAGIC', 'FIRE', 'COLD']) },
         { maxLevel: 249 },
         { minDmg: 100 },
         { nonRepeating: true }
        ]
      }
    ]
  },  
  FD: {
    adpsDropdown: true,
    charges: 55,
    class: 'wiz',
    duration: 410000,
    level: 254,
    mode: 'wiz',
    name: 'Frenzied Devastation XXXI',
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
        value: 0.90
      }
    ]
  },
  FIERCE: {
    adpsDropdown: true,
    class: 'brd',
    duration: 132000,
    level: 115,
    name: 'Fierce Eye VI',
    effects: [
      {
        spa: 294,
        slot: 6,
        type: 'sp',
        value: 0.15
      },
      {
        spa: 273,
        slot: 7,
        type: 'sp',
        value: 0.15
      },
      {
        spa: 170,
        slot: 11,
        type: 'sp',
        value: 0.15
      },
      {
        spa: 507,
        slot: 12,
        type: 'sp',
        value: 0.13
      }
    ]
  },
  FCOLD6090: {
    level: 255,
    name: 'Cold Damage 60-90 L115',
    effects: [
      {
        spa: 124,
        slot: 1,
        type: 'wn',
        value: 0.75,
        limits: [
          { maxLevel: 115 },
          { type: 'detrimental' },
          { exTargets: SMap(['TargetAE', 'CasterPB']) },
          { exSkills: COMBAT_SKILLS },
          { resists: SMap(['COLD']) }
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
          { exTargets: SMap(['TargetAE', 'CasterPB']) },
          { exSkills: COMBAT_SKILLS },
          { resists: SMap(['COLD']) }
        ]
      }
    ]
  },
  FCOLD70: {
    level: 255,
    name: 'Cold Damage 70-100 L115',
    effects: [
      {
        spa: 124,
        slot: 1,
        type: 'wn',
        value: 0.85,
        limits: [
          { maxLevel: 115 },
          { type: 'detrimental' },
          { exTargets: SMap(['TargetAE', 'CasterPB']) },
          { exSkills: COMBAT_SKILLS },
          { resists: SMap(['COLD']) }
        ]
      }
    ]
  },
  FCOLD75: {
    level: 255,
    name: 'Cold Damage 75-90 L120',
    effects: [
      {
        spa: 124,
        slot: 1,
        type: 'wn',
        value: 0.825,
        limits: [
          { maxLevel: 120 },
          { type: 'detrimental' },
          { exTargets: SMap(['TargetAE', 'CasterPB']) },
          { exSkills: COMBAT_SKILLS },
          { resists: SMap(['COLD']) }
        ]
      }
    ]
  },  
  FCOLD70120: {
    level: 255,
    name: 'Cold Damage 70-120 L115',
    effects: [
      {
        spa: 124,
        slot: 1,
        type: 'wn',
        value: 0.95,
        limits: [
          { maxLevel: 115 },
          { type: 'detrimental' },
          { exTargets: SMap(['TargetAE', 'CasterPB']) },
          { exSkills: COMBAT_SKILLS },
          { resists: SMap(['COLD']) }
        ]
      }
    ]
  },
  FCOLD85123: {
    level: 255,
    name: 'Cold Damage 85-123 L120',
    effects: [
      {
        spa: 124,
        slot: 1,
        type: 'wn',
        value: 1.04,
        limits: [
          { maxLevel: 120 },
          { type: 'detrimental' },
          { exTargets: SMap(['TargetAE', 'CasterPB']) },
          { exSkills: COMBAT_SKILLS },
          { resists: SMap(['COLD']) }
        ]
      }
    ]
  },
  FCOLD100135: {
    level: 255,
    name: 'Cold Damage 100-135 L120',
    effects: [
      {
        spa: 124,
        slot: 1,
        type: 'wn',
        value: 1.175,
        limits: [
          { maxLevel: 120 },
          { type: 'detrimental' },
          { exTargets: SMap(['TargetAE', 'CasterPB']) },
          { exSkills: COMBAT_SKILLS },
          { resists: SMap(['COLD']) }
        ]
      }
    ]
  },    
  FCHROM6090: {
    level: 255,
    name: 'Chromatic Damage 60-90 L115',
    effects: [
      {
        spa: 124,
        slot: 1,
        type: 'wn',
        value: 0.75,
        limits: [
          { maxLevel: 115 },
          { type: 'detrimental' },
          { exTargets: SMap(['TargetAE', 'CasterPB']) },
          { exSkills: COMBAT_SKILLS },
          { resists: SMap(['CHROMATIC']) }
        ]
      }
    ]
  },
  FCHROM67: {
    level: 255,
    name: 'Chromatic Damage 67-100 L115',
    effects: [
      {
        spa: 124,
        slot: 1,
        type: 'wn',
        value: 0.84,
        limits: [
          { maxLevel: 110 },
          { type: 'detrimental' },
          { exTargets: SMap(['TargetAE', 'CasterPB']) },
          { exSkills: COMBAT_SKILLS },
          { resists: SMap(['CHROMATIC']) }
        ]
      }
    ]
  },
  FCHROM70: {
    level: 255,
    name: 'Chromatic Damage 70-100 L115',
    effects: [
      {
        spa: 124,
        slot: 1,
        type: 'wn',
        value: 0.85,
        limits: [
          { maxLevel: 115 },
          { type: 'detrimental' },
          { exTargets: SMap(['TargetAE', 'CasterPB']) },
          { exSkills: COMBAT_SKILLS },
          { resists: SMap(['CHROMATIC']) }
        ]
      }
    ]
  },
  FCHROM75: {
    level: 255,
    name: 'Chromatic Damage 75-90 L120',
    effects: [
      {
        spa: 124,
        slot: 1,
        type: 'wn',
        value: 0.825,
        limits: [
          { maxLevel: 120 },
          { type: 'detrimental' },
          { exTargets: SMap(['TargetAE', 'CasterPB']) },
          { exSkills: COMBAT_SKILLS },
          { resists: SMap(['CHROMATIC']) }
        ]
      }
    ]
  },   
  FCHROM70120: {
    level: 255,
    name: 'Chromatic Damage 70-120 L115',
    effects: [
      {
        spa: 124,
        slot: 1,
        type: 'wn',
        value: 0.95,
        limits: [
          { maxLevel: 115 },
          { type: 'detrimental' },
          { exTargets: SMap(['TargetAE', 'CasterPB']) },
          { exSkills: COMBAT_SKILLS },
          { resists: SMap(['CHROMATIC']) }
        ]
      }
    ]
  },
  FCHROM85123: {
    level: 255,
    name: 'Chromatic Damage 85-123 L120',
    effects: [
      {
        spa: 124,
        slot: 1,
        type: 'wn',
        value: 1.04,
        limits: [
          { maxLevel: 120 },
          { type: 'detrimental' },
          { exTargets: SMap(['TargetAE', 'CasterPB']) },
          { exSkills: COMBAT_SKILLS },
          { resists: SMap(['CHROMATIC']) }
        ]
      }
    ]
  },  
  FFIRE6090: {
    level: 255,
    name: 'Fire Damage 60-90 L115',
    effects: [
      {
        spa: 124,
        slot: 1,
        type: 'wn',
        value: 0.75,
        limits: [
          { maxLevel: 115 },
          { type: 'detrimental' },
          { exTargets: SMap(['TargetAE', 'CasterPB']) },
          { exSkills: COMBAT_SKILLS },
          { resists: SMap(['FIRE']) }
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
          { exTargets: SMap(['TargetAE', 'CasterPB']) },
          { exSkills: COMBAT_SKILLS },
          { resists: SMap(['FIRE']) }
        ]
      }
    ]
  },
  FFIRE70: {
    level: 255,
    name: 'Fire Damage 70-100 L115',
    effects: [
      {
        spa: 124,
        slot: 1,
        type: 'wn',
        value: 0.85,
        limits: [
          { maxLevel: 115 },
          { type: 'detrimental' },
          { exTargets: SMap(['TargetAE', 'CasterPB']) },
          { exSkills: COMBAT_SKILLS },
          { resists: SMap(['FIRE']) }
        ]
      }
    ]
  },
  FFIRE75: {
    level: 255,
    name: 'Fire Damage 75-90 L120',
    effects: [
      {
        spa: 124,
        slot: 1,
        type: 'wn',
        value: 0.825,
        limits: [
          { maxLevel: 120 },
          { type: 'detrimental' },
          { exTargets: SMap(['TargetAE', 'CasterPB']) },
          { exSkills: COMBAT_SKILLS },
          { resists: SMap(['FIRE']) }
        ]
      }
    ]
  },    
  FFIRE70120: {
    level: 255,
    name: 'Fire Damage 70-120 L115',
    effects: [
      {
        spa: 124,
        slot: 1,
        type: 'wn',
        value: 0.95,
        limits: [
          { maxLevel: 115 },
          { type: 'detrimental' },
          { exTargets: SMap(['TargetAE', 'CasterPB']) },
          { exSkills: COMBAT_SKILLS },
          { resists: SMap(['FIRE']) }
        ]
      }
    ]
  },
  FFIRE85123: {
    level: 255,
    name: 'Fire Damage 85-123 L120',
    effects: [
      {
        spa: 124,
        slot: 1,
        type: 'wn',
        value: 1.04,
        limits: [
          { maxLevel: 120 },
          { type: 'detrimental' },
          { exTargets: SMap(['TargetAE', 'CasterPB']) },
          { exSkills: COMBAT_SKILLS },
          { resists: SMap(['FIRE']) }
        ]
      }
    ]
  },
  FFIRE100135: {
    level: 255,
    name: 'Fire Damage 100-130 L120',
    effects: [
      {
        spa: 124,
        slot: 1,
        type: 'wn',
        value: 1.175,
        limits: [
          { maxLevel: 120 },
          { type: 'detrimental' },
          { exTargets: SMap(['TargetAE', 'CasterPB']) },
          { exSkills: COMBAT_SKILLS },
          { resists: SMap(['FIRE']) }
        ]
      }
    ]
  },  
  FMAGIC6090: {
    level: 255,
    name: 'Magic Damage 60-90 L115',
    effects: [
      {
        spa: 124,
        slot: 1,
        type: 'wn',
        value: 0.75,
        limits: [
          { maxLevel: 115 },
          { type: 'detrimental' },
          { exTargets: SMap(['TargetAE', 'CasterPB']) },
          { exSkills: COMBAT_SKILLS },
          { resists: SMap(['MAGIC']) }
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
          { exTargets: SMap(['TargetAE', 'CasterPB']) },
          { exSkills: COMBAT_SKILLS },
          { resists: SMap(['MAGIC']) }
        ]
      }
    ]
  },
  FMAGIC70: {
    level: 255,
    name: 'Magic Damage 70-100 L115',
    effects: [
      {
        spa: 124,
        slot: 1,
        type: 'wn',
        value: 0.85,
        limits: [
          { maxLevel: 115 },
          { type: 'detrimental' },
          { exTargets: SMap(['TargetAE', 'CasterPB']) },
          { exSkills: COMBAT_SKILLS },
          { resists: SMap(['MAGIC']) }
        ]
      }
    ]
  },
  FMAGIC75: {
    level: 255,
    name: 'Magic Damage 75-90 L120',
    effects: [
      {
        spa: 124,
        slot: 1,
        type: 'wn',
        value: 0.825,
        limits: [
          { maxLevel: 120 },
          { type: 'detrimental' },
          { exTargets: SMap(['TargetAE', 'CasterPB']) },
          { exSkills: COMBAT_SKILLS },
          { resists: SMap(['MAGIC']) }
        ]
      }
    ]
  },  
  FMAGIC70120: {
    level: 255,
    name: 'Magic Damage 70-120 L115',
    effects: [
      {
        spa: 124,
        slot: 1,
        type: 'wn',
        value: 0.95,
        limits: [
          { maxLevel: 115 },
          { type: 'detrimental' },
          { exTargets: SMap(['TargetAE', 'CasterPB']) },
          { exSkills: COMBAT_SKILLS },
          { resists: SMap(['MAGIC']) }
        ]
      }
    ]
  },
  FMAGIC85123: {
    level: 255,
    name: 'Magic Damage 85-123 L120',
    effects: [
      {
        spa: 124,
        slot: 1,
        type: 'wn',
        value: 1.04,
        limits: [
          { maxLevel: 120 },
          { type: 'detrimental' },
          { exTargets: SMap(['TargetAE', 'CasterPB']) },
          { exSkills: COMBAT_SKILLS },
          { resists: SMap(['MAGIC']) }
        ]
      }
    ]
  },
  FMAGIC100135: {
    level: 255,
    name: 'Magic Damage 100-135 L120',
    effects: [
      {
        spa: 124,
        slot: 1,
        type: 'wn',
        value: 1.175,
        limits: [
          { maxLevel: 120 },
          { type: 'detrimental' },
          { exTargets: SMap(['TargetAE', 'CasterPB']) },
          { exSkills: COMBAT_SKILLS },
          { resists: SMap(['MAGIC']) }
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
          { exSpells: SMap(['TC']) }
        ]
      }
    ]
  },
  FRA: {
    charges: 6,
    class: 'dru',
    duration: 18000 + TICK_OFFSET,
    level: 113,
    name: 'Icerend Aura Rk. III',
    refreshTime: 18000,
    repeatEvery: -1,
    effects: [
      {
        proc: 'FW',
        limits: [
          { onSpellUse: true },
          { type: 'detrimental' },
          { currentHitPoints: true },
          { exSpells: SMap(['FW']) },
          { exSkills: COMBAT_SKILLS },
          { maxLevel: 120 },
          { minManaCost: 10 }
        ]
      }
    ]
  },
  FRB: {
    class: 'dru',
    debuff: true,
    level: 123,
    name: 'Icerend Breath Rk. III',
    repeatEvery: -1,
    effects: [
      {
        spa: 296,
        slot: 1,
        type: 'sp',
        value: 0.06,
        limits: [
          { maxLevel: 115 },
          { type: 'detrimental' },
          { exSkills: COMBAT_SKILLS },
          { resists: SMap(['COLD']) }
        ]
      }
    ]
  },
  FGODS: {
    adpsDropdown: true,
    class: 'wiz',
    duration: 240000,
    level: 254,
    mode: 'wiz',
    name: 'Fury of the Gods LIV',
    effects: [
      {
        spa: 303,
        slot: 1,
        type: 'sp',
        value: 4500,
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
    name: 'Komatiite Orb',
    refreshTime: 12000,
    refreshTrigger: 'SKB',
    repeatEvery: -1,
    timer: 'recast-5',
    effects: [
      { 
        proc: 'KB2',
        limits: [
          { activated: true }
        ]
      }
    ]
  },
  FBSINGERk1: {
    class: 'wiz',
    charges: 1,
    duration: 12000 + TICK_OFFSET,
    level: 255,
    name: 'Flashbrand Singe I',
    effects: [
      {
        spa: 303,
        slot: 1,
        type: 'sp',
        value: 4374,
        limits: [
          { minCastTime: 3000 }, 
          { currentHitPoints: true },
          { type: 'detrimental' },
          { exSkills: COMBAT_SKILLS },          
          { maxLevel: 115 },
          { minManaCost: 10 }
        ]
      }
    ]
  },    
  FBSINGERk2: {
    class: 'wiz',
    charges: 1,
    duration: 12000 + TICK_OFFSET,
    level: 255,
    name: 'Flashbrand Singe II',
    effects: [
      {
        spa: 303,
        slot: 1,
        type: 'sp',
        value: 4593,
        limits: [
          { minCastTime: 3000 }, 
          { currentHitPoints: true },
          { type: 'detrimental' },
          { exSkills: COMBAT_SKILLS },          
          { maxLevel: 115 },
          { minManaCost: 10 }
        ]
      }
    ]
  },    
  FBSINGERk3: {
    class: 'wiz',
    charges: 1,
    duration: 12000 + TICK_OFFSET,
    level: 255,
    name: 'Flashbrand Singe III',
    effects: [
      {
        spa: 303,
        slot: 1,
        type: 'sp',
        value: 4823,
        limits: [
          { minCastTime: 3000 }, 
          { currentHitPoints: true },
          { type: 'detrimental' },
          { exSkills: COMBAT_SKILLS },          
          { maxLevel: 115 },
          { minManaCost: 10 }
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
    name: 'Firebound Coalition Rk. III',
    otherCast: true,
    effects: [
      {
        spa: 484,
        slot: 1,
        type: 'sp',
        value: 51444,
        limits: [
          { targets: TARGET_LOS },
          { currentHitPoints: true },
          { type: 'detrimental' },
          { minLevel: 106 },
          { maxLevel: 120 },
          { maxDuration: 0 },
          { minManaCost: 10 },
          { minDmg: 3050 }
        ]
      }
    ]
  },
  FROSTBA: {
    adpsDropdown: true,
    class: 'wiz',
    charges: 8,
    duration: 18000 + TICK_OFFSET,
    level: 112,
    mode: 'wiz',
    name: 'Frostbound Coalition Rk. III',
    otherCast: true,
    effects: [
      {
        spa: 484,
        slot: 1,
        type: 'sp',
        value: 67549,
        limits: [
          { targets: TARGET_SINGLE },
          { currentHitPoints: true },
          { type: 'detrimental' },
          { minLevel: 106 },
          { maxLevel: 120 },
          { maxDuration: 0 },
          { minManaCost: 10 },
          { minDmg: 3050 }
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
  GBW: {
    adpsDropdown: true,
    class: 'dru',
    duration: 225000,
    level: 254,
    name: 'Group Spirit of the Great Wolf XV',
    effects: [
      {
        spa: 294,
        slot: 8,
        type: 'sp',
        value: 0.12
      },
      {
        spa: 170,
        slot: 9,
        type: 'sp',
        value: 1.1
      }
    ]
  },
  GCH: {
    charges: 1,
    class: 'enc',
    duration: 12000 + TICK_OFFSET,
    level: 254,
    name: 'Gift of Chroma Haze IV',
    repeatEvery: 20000,
    tooltip: 'How often to proc a single Gift of Chromatic Haze (in seconds).\rKeep in mind that it procs only 8% of the time an Enchanter casts a DD, DoT, or Stun so you may want it fairly high.',
    effects: [
      {
        spa: 302,
        slot: 1,
        type: 'sp',
        value: 0.55,
        limits: [
          { type: 'detrimental' },
          { maxDuration: 0 },
          { minManaCost: 10 },
          { maxLevel: 115 },
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
  FATE: {
    class: 'brd',
    level: 112,
    name: 'Fatesong of Radiwol Rk. III',
    refreshTime: 12000,
    repeatEvery: -1,
    effects: [
      {
        spa: 286,
        slot: 1,
        type: 'sp',
        value: 3526,
        limits: [
          { minLevel: 106 },
          { maxLevel: 115 },
          { type: 'detrimental' },
          { exTargets: SMap(['TargetAE', 'CasterPB']) },
          { maxDuration: 0 },
          { minManaCost: 10 },
          { resists: SMap(['COLD']) }
        ]
      }
    ]
  },
  FPWR: {
    class: 'mag',
    charges: 3,
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
          { exTargets: SMap(['TargetAE', 'CasterPB']) },
          { exSkills: COMBAT_SKILLS },
          { minManaCost: 10 },
          { maxLevel: 115 } // need to really verify
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
          { exTargets: SMap(['TargetAE', 'CasterPB']) },
          { exSkills: COMBAT_SKILLS },
          { maxLevel: 115 } // need to really verify
        ]
      }
    ]
  },
  GLYPHC: {
    adpsDropdown: true,
    duration: 120000,
    level: 254,
    name: 'Glyph of Destruction IV',
    effects: [
      {
        spa: 294,
        slot: 7,
        type: 'sp',
        value: 0.15
      },
      {
        spa: 375,
        slot: 8,
        type: 'sp',
        value: 0.6
      },
      {
        spa: 170,
        slot: 10,
        type: 'sp',
        value: 0.6
      }
    ]
  },
  HOF: {
    adpsDropdown: true,
    class: 'mag',
    duration: 360000,
    level: 254,
    mode: 'mag',
    name: 'Heart of Skyfire XXIX',
    effects: [
      {
        spa: 124,
        slot: 1, // workaround so it dont stack with other spells
        type: 'sp',
        value: 1.20,
        limits: [
          { maxLevel: 115 },
          { type: 'detrimental' },
          { exSkills: COMBAT_SKILLS }
        ]
      },
      {
        spa: 170,
        slot: 5,
        type: 'sp',
        value: 0.50
      }
    ]
  },
  IMPF: {
    class: 'wiz',
    level: 254,
    mode: 'wiz',
    name: 'Improved Familiar XXXII',
    effects: [
      {
        spa: 124,
        slot: 1,
        type: 'sp',
        value: 0.575,
        limits: [
          { maxDuration: 0 },
          { type: 'detrimental' },
          { targets: SMap(['SINGLE']) },
          { maxLevel: 115 }, // from testing
          { exSkills: COMBAT_SKILLS }, // from testing
        ]
      },
      {
        spa: 170, // moved rules up from testing
        slot: 5,
        type: 'sp',
        value: 0.35,
      }
    ]
  },
  INTENSE: {
    adpsDropdown: true,
    duration: 60000,
    level: 254,
    name: 'Intensity of the Resolute',
    effects: [
      {
        spa: 294,
        slot: 7,
        type: 'sp',
        value: 0.50
      },
      {
        spa: 273,
        slot: 9,
        type: 'sp',
        value: 0.50
      }
    ]
  },
  ITC: {
    adpsDropdown: true,
    charges: 20,
    duration: 150000,
    level: 254,
    name: 'Improved Twincast VIII',
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
    name: 'Illusions of Grandeur IV',
    effects: [
      {
        spa: 273,
        slot: 4,
        type: 'sp',
        value: 0.13
      },
      {
        spa: 294,
        slot: 5,
        type: 'sp',
        value: 0.13
      },
      {
        spa: 375,
        slot: 6,
        type: 'sp',
        value: 1.30
      },
      {
        spa: 170,
        slot: 12,
        type: 'sp',
        value: 1.70
      }
    ]
  },
  HFLM: {
    class: 'npc',
    debuff: true,
    level: 255,
    name: 'Highly Flammable',
    repeatEvery: -1,
    effects: [
      {
        spa: 483,
        slot: 1,
        type: 'sp',
        value: 85.0,
        limits: [
          { resists: SMap(['FIRE']) }
        ]
      }
    ]
  },
  HFRZ: {
    class: 'npc',
    debuff: true,
    level: 255,
    name: 'Highly Freezable',
    repeatEvery: -1,
    effects: [
      {
        spa: 483,
        slot: 1,
        type: 'sp',
        value: 120.75,
        limits: [
          { resists: SMap(['COLD']) }
        ]
      }
    ]
  },
  LING: {
    class: 'enc',
    debuff: true,
    level: 255,
    name: 'Tashan\'s Lingering Cry VI',
    repeatEvery: -1,
    effects: [
      {
        spa: 483,
        slot: 1,
        type: 'sp',
        value: 0.105,
        limits: [
          { maxLevel: 115 },
          { minManaCost: 10 }
        ]
      }
    ]
  },
  MALO: {
    class: 'mag',
    debuff: true,
    level: 111,
    name: 'Malosinara Rk. III',
    otherCast: true,
    repeatEvery: -1,
    effects: [
      {
        spa: 296,
        slot: 1,
        type: 'sp',
        value: 0.06,
        limits: [
          { maxLevel: 115 },
          { type: 'detrimental' },
          { resists: SMap(['MAGIC']) },
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
    name: 'Mana Burn XVIII',
    effects: [
      {
        spa: 484,
        slot: 1,
        type: 'sp',
        value: 25000,
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
    name: 'Spire of the Elements XII',
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
    level: 115,
    name: 'Mana Replication Aura Rk. III',
    refreshTime: 18000,
    repeatEvery: -1,
    effects: [
      {
        proc: 'MR',
        limits: [
          { onSpellUse: true },
          { type: 'detrimental' },
          { exSkills: COMBAT_SKILLS },
          { exSpells: SMap(['MR']) },
          { maxLevel: 115 },
          { minManaCost: 10 }
        ]
      }
    ]
  },
  MSYN3: {
    class: 'mag',
    charges: 1,
    duration: 12000 + TICK_OFFSET,
    level: 254,
    name: 'Conjurer\'s Synergy III',
    otherCast: true,
    repeatEvery: 13000,
    tooltip: 'How often to proc a single Conjurer\'s Synergy (in seconds).\rDefaults to minimum time for chain casting Riotous Servant.',
    effects: [
      {
        spa: 302,
        slot: 1,
        type: 'sp',
        value: 0.75,
        limits: [
          { resists: SMap(['FIRE', 'CHROMATIC']) },
          { maxLevel: 250 },
          { minDmg: 100 },
          { nonRepeating: true }
        ]
      }
    ]
  },  
  NSYN: {
    charges: 999,
    class: 'nec',
    duration: 12000 + TICK_OFFSET,
    level: 254,
    name: 'Defiler\'s Synergy III',
    repeatEvery: 7000,
    tooltip: 'How often to proc a single Defiler\'s Synergy (in seconds).\rDefaults to minimum time for chain casting Assert for Blood.',
    effects: [
      {
        spa: 170,
        slot: 1,
        type: 'sp',
        value: 0.30
      },
      {
        spa: 375,
        slot: 2,
        type: 'sp',
        value: 0.30
      }
    ]
  },
  QT: {
    adpsDropdown: true,
    class: 'brd',
    duration: 240000,
    level: 115,
    name: 'Quick Time IX',
    effects: []
  },
  QUNARD: {
    class: 'brd',
    level: 113,
    name: 'Sontalak\'s Aria Rk. III',
    refreshTime: 12000,
    repeatEvery: -1,
    effects: [
      {
        spa: 286,
        slot: 1,
        type: 'sp',
        value: 2519,
        limits: [
          { minLevel: 106 },
          { maxLevel: 115 },
          { type: 'detrimental' },
          { exTargets: SMap(['TargetAE', 'CasterPB']) },
          { maxDuration: 0 },
          { minManaCost: 10 },
          { resists: SMap(['FIRE']) }
        ]
      }
    ]
  },
  REA: {
    adpsDropdown: true,
    class: 'rng',
    debuff: true,
    duration: 60000,
    level: 115,
    name: 'Elemental Arrow XI',
    otherCast: true,
    effects: [
      {
        spa: 296,
        slot: 1,
        type: 'sp',
        value: 0.15,
        limits: [
          { resists: SMap(['FIRE', 'COLD']) }
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
  SUMAC: {
    class: 'dru',
    debuff: true,
    level: 110,
    name: 'Skin to Sumac Rk. III',
    repeatEvery: -1,
    effects: [
      {
        spa: 296,
        slot: 1,
        type: 'sp',
        value: 0.07,
        limits: [
          { maxLevel: 110 },
          { type: 'detrimental' },
          { resists: SMap(['FIRE']) },
          { exSkills: COMBAT_SKILLS }
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
          { maxLevel: 254 },
          { maxDuration: 0 }
        ]
      }
    ]
  },
  SYLLICERk1: {
    charges: 1,
    class: 'wiz',
    duration: 30000 + TICK_OFFSET,
    level: 255,
    mode: 'wiz',
    name: 'Syllable of Ice Azia IX',
    effects: [
      {
        spa: 303,
        slot: 1,
        type: 'sp',
        value: 4838,
        limits: [
          { minCastTime: 3000 }, 
          { currentHitPoints: true },
          { type: 'detrimental' },
          { exSkills: COMBAT_SKILLS },
          { maxLevel: 115 },
          { minManaCost: 10 },
          { resists: SMap(['COLD']) }
        ]
      }
    ]
  },
  SYLLICERk2: {
    charges: 1,
    class: 'wiz',
    duration: 30000 + TICK_OFFSET,
    level: 255,
    mode: 'wiz',
    name: 'Syllable of Ice Beza IX',
    effects: [
      {
        spa: 303,
        slot: 1,
        type: 'sp',
        value: 5080,
        limits: [
          { minCastTime: 3000 }, 
          { currentHitPoints: true },
          { type: 'detrimental' },
          { exSkills: COMBAT_SKILLS },
          { maxLevel: 115 },
          { minManaCost: 10 },
          { resists: SMap(['COLD']) }
        ]
      }
    ]
  },
  SYLLICERk3: {
    charges: 1,
    class: 'wiz',
    duration: 30000 + TICK_OFFSET,
    level: 255,
    mode: 'wiz',
    name: 'Syllable of Ice Caza IX',
    effects: [
      {
        spa: 303,
        slot: 1,
        type: 'sp',
        value: 5334,
        limits: [
          { minCastTime: 3000 }, 
          { currentHitPoints: true },
          { type: 'detrimental' },
          { exSkills: COMBAT_SKILLS },
          { maxLevel: 115 },
          { minManaCost: 10 },
          { resists: SMap(['COLD']) }
        ]
      }
    ]
  },
  SYLLFIRERk1: {
    class: 'wiz',
    charges: 1,
    duration: 30000 + TICK_OFFSET,
    level: 255,
    mode: 'wiz',
    name: 'Syllable of Fire Azia IX',
    effects: [
      {
        spa: 303,
        slot: 1,
        type: 'sp',
        value: 4838,
        limits: [
          { minCastTime: 3000 }, 
          { currentHitPoints: true },
          { type: 'detrimental' },
          { exSkills: COMBAT_SKILLS },
          { maxLevel: 115 },
          { minManaCost: 10 },
          { resists: SMap(['FIRE']) }
        ]
      }
    ]
  },
  SYLLFIRERk2: {
    class: 'wiz',
    charges: 1,
    duration: 30000 + TICK_OFFSET,
    level: 255,
    mode: 'wiz',
    name: 'Syllable of Fire Beza IX',
    effects: [
      {
        spa: 303,
        slot: 1,
        type: 'sp',
        value: 5080,
        limits: [
          { minCastTime: 3000 }, 
          { currentHitPoints: true },
          { type: 'detrimental' },
          { exSkills: COMBAT_SKILLS },
          { maxLevel: 115 },
          { minManaCost: 10 },
          { resists: SMap(['FIRE']) }
        ]
      }
    ]
  },
  SYLLFIRERk3: {
    class: 'wiz',
    charges: 1,
    duration: 30000 + TICK_OFFSET,
    level: 255,
    mode: 'wiz',
    name: 'Syllable of Fire Caza IX',
    effects: [
      {
        spa: 303,
        slot: 1,
        type: 'sp',
        value: 5334,
        limits: [
          { minCastTime: 3000 }, 
          { currentHitPoints: true },
          { type: 'detrimental' },
          { exSkills: COMBAT_SKILLS },
          { maxLevel: 115 },
          { minManaCost: 10 },
          { resists: SMap(['FIRE']) }
        ]
      }
    ]
  },
  SYLLMAGICRk1: {
    class: 'wiz',
    charges: 1,
    duration: 30000 + TICK_OFFSET,
    level: 255,
    mode: 'wiz',
    name: 'Syllable of Magic IX Azia',
    effects: [
      {
        spa: 303,
        slot: 1,
        type: 'sp',
        value: 4838,
        limits: [
          { minCastTime: 3000 }, 
          { currentHitPoints: true },
          { type: 'detrimental' },
          { exSkills: COMBAT_SKILLS },
          { maxLevel: 115 },
          { minManaCost: 10 },
          { resists: SMap(['MAGIC']) }
        ]
      }
    ]
  },
  SYLLMAGICRk2: {
    class: 'wiz',
    charges: 1,
    duration: 30000 + TICK_OFFSET,
    level: 255,
    mode: 'wiz',
    name: 'Syllable of Magic IX Beza',
    effects: [
      {
        spa: 303,
        slot: 1,
        type: 'sp',
        value: 5080,
        limits: [
          { minCastTime: 3000 }, 
          { currentHitPoints: true },
          { type: 'detrimental' },
          { exSkills: COMBAT_SKILLS },
          { maxLevel: 115 },
          { minManaCost: 10 },
          { resists: SMap(['MAGIC']) }
        ]
      }
    ]
  },
  SYLLMAGICRk3: {
    class: 'wiz',
    charges: 1,
    duration: 30000 + TICK_OFFSET,
    level: 255,
    mode: 'wiz',
    name: 'Syllable of Magic IX Caza',
    effects: [
      {
        spa: 303,
        slot: 1,
        type: 'sp',
        value: 5334,
        limits: [
          { minCastTime: 3000 }, 
          { currentHitPoints: true },
          { type: 'detrimental' },
          { exSkills: COMBAT_SKILLS },
          { maxLevel: 115 },
          { minManaCost: 10 },
          { resists: SMap(['MAGIC']) }
        ]
      }
    ]
  },
  SYLLMASTERRk1: {
    class: 'wiz',
    charges: 1,
    duration: 30000 + TICK_OFFSET,
    level: 255,
    mode: 'wiz',
    name: 'Syllable of Mastery Azia IX',
    effects: [
      {
        spa: 303,
        slot: 1,
        type: 'sp',
        value: 5902,
        limits: [
          { minCastTime: 3000 }, 
          { currentHitPoints: true },
          { type: 'detrimental' },
          { exSkills: COMBAT_SKILLS },
          { maxLevel: 115 },
          { minManaCost: 10 }
        ]
      }
    ]
  },
  SYLLMASTERRk2: {
    class: 'wiz',
    charges: 1,
    duration: 30000 + TICK_OFFSET,
    level: 255,
    mode: 'wiz',
    name: 'Syllable of Mastery Beza IX',
    effects: [
      {
        spa: 303,
        slot: 1,
        type: 'sp',
        value: 6197,
        limits: [
          { minCastTime: 3000 }, 
          { currentHitPoints: true },
          { type: 'detrimental' },
          { exSkills: COMBAT_SKILLS },
          { maxLevel: 115 },
          { minManaCost: 10 }
        ]
      }
    ]
  },
  SYLLMASTERRk3: {
    class: 'wiz',
    charges: 1,
    duration: 30000 + TICK_OFFSET,
    level: 255,
    mode: 'wiz',
    name: 'Syllable of Mastery Caza IX',
    effects: [
      {
        spa: 303,
        slot: 1,
        type: 'sp',
        value: 6507,
        limits: [
          { minCastTime: 3000 }, 
          { currentHitPoints: true },
          { type: 'detrimental' },
          { exSkills: COMBAT_SKILLS },
          { maxLevel: 115 },
          { minManaCost: 10 }
        ]
      }
    ]
  },
  SW: {
    adpsDropdown: true,
    class: 'dru',
    duration: 60000,
    level: 254,
    name: 'Season\'s Wrath VIII',
    effects: [
      {
        spa: 296,
        slot: 1,
        type: 'sp',
        value: 0.25,
        limits: [
          { type: 'detrimental' },
          { resists: SMap(['FIRE', 'COLD']) }
        ]
      }
    ]
  },
  TC: {
    adpsDropdown: true,
    duration: 18000,
    level: 85,
    name: 'Twincast Rk. III',
    noClass: ['enc'],
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
  TF: {
    adpsDropdown: true,
    class: 'mag',
    duration: 180000,
    level: 254,
    mode: 'mag',
    name: 'Thaumaturge\'s Focus XIX',
    effects: [
      {
        spa: 212,
        slot: 1,
        type: 'sp',
        value: 0.10,
        limits: [
          { maxLevel: 115 },
          { currentHitPoints: true },
          { minManaCost: 10 },
          { type: 'detrimental' },
          { maxDuration: 0 },
          { resists: SMap(['MAGIC']) },
          { minDmg: 100 }
        ]
      },
      {
        spa: 461,
        slot: 1, // workaround so it doesnt stack with enc synergy
        type: 'sp',
        value: 0.65,
        limits: [
          { maxLevel: 115 },
          { currentHitPoints: true },
          { minManaCost: 10 },
          { type: 'detrimental' },
          { maxDuration: 0 },
          { resists: SMap(['MAGIC']) },
          { minDmg: 100 }
        ]
      }
    ]
  },
  THREADSP: {
    level: 255,
    name: 'Threads of Potential',
    effects: [
      {
        spa: 462,
        slot: 1,
        type: 'wn',
        value: 5000,
        limits: [
          { currentHitPoints: true },
          { nonRepeating: true },
          { type: 'detrimental' },
          { minManaCost: 100 },
          { exSkills: COMBAT_SKILLS }
        ]
      }
    ]
  },
  TRIF: {
    class: 'wiz',
    level: 115,
    name: 'Trifurcating Magic XXX',
    effects: [] // handle in damage.js
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
  TRTAL: {
    level: 254,
    name: 'Trophy of Talendor',
    repeatEvery: -1,
    effects: [
      {
        spa: 170,
        slot: 1,
        type: 'wn',
        value: 0.10
      },
      {
        spa: 375,
        slot: 2,
        type: 'wn',
        value: 0.10
      }
    ]
  },
  TRTOR: {
    level: 254,
    name: 'Trophy of Tormax',
    repeatEvery: -1,
    effects: [
      {
        spa: 399,
        slot: 1,
        type: 'wn',
        value: 0.01,
        limits: [
          { currentHitPoints: true },
          { exTwincastMarker: true },
          { minManaCost: 10 },
          { exSkills: COMBAT_SKILLS }
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
      },
      {
        spa: 273,
        slot: 10,
        type: 'sp',
        value: 0.12
      }
    ]
  },
  VFX: {
    class: 'wiz',
    charges: 24,
    duration: 18000 + TICK_OFFSET,
    level: 113,
    mode: 'wiz',
    name: 'Thaumaturgic Vortex Effect',
    effects: [
      {
        spa: 296,
        slot: 1,
        type: 'sp',
        value: 0.875,
        limits: [
          { maxLevel: 120 },
          { type: 'detrimental' },
          { maxDuration: 0 },
          { minManaCost: 100 }
        ]
      }
    ]
  },
  W1: {
    adpsDropdown: true,
    class: 'wiz',
    duration: 90000,
    level: 254,
    mode: 'wiz',
    name: 'Spire of Arcanum XII',
    effects: [
      {
        spa: 294,
        slot: 2,
        type: 'sp',
        value: 0.16
      },
      {
        spa: 170,
        slot: 3,
        type: 'sp',
        value: 1.6
      }      
    ]
  },
  WSYN4: {
    charges: 1,
    class: 'wiz',
    duration: 12000 + TICK_OFFSET,
    level: 254,
    name: 'Evoker\'s Synergy IV',
    otherCast: true,
    repeatEvery: 38000,
    tooltip: 'How often to proc a single Evoker\'s Synergy (in seconds).\rDefaults to minimum time for chain casting Stormjolt Vortex.',
    effects: [
      {
        proc: 'WSYN4',
        limits: [
          { onSpellUse: true },
          { resists: SMap(['MAGIC', 'COLD', 'POISON', 'DISEASE', 'CORRUPTION', 'CHROMATIC']) },
          { type: 'detrimental' }
        ]
      }
    ]
  }  
};
