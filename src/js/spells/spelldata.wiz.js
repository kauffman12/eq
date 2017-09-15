export const SPELL_DATA = {
  AFU1: {
    id: 'AFU1',
    name: 'Arcane Fusion I',
    baseDmg: 73450,
    castTime: 0.0,
    origCastTime: 0.0,
    recastTime: 0,
    lockoutTime: 1.5,
    resist: 'MAGIC',
    type3Aug: 0,
    timer: 'afusion',
    manaCost: 0,
    maxCritRate: 0.15,
    base1: 10,
    isFocusable: false,
    skill: 24,
    level: 254,
    requirements: {
      minManaCost: 10,
      minCastTime: 3,
      minDamage: 1
    }
  },
  AFU2: {
    id: 'AFU2',
    name: 'Arcane Fusion II',
    baseDmg: 100000,
    castTime: 0.0,
    origCastTime: 0.0,
    recastTime: 0,
    lockoutTime: 1.5,
    resist: 'MAGIC',
    type3Aug: 0,
    timer: 'afusion',
    manaCost: 0,
    maxCritRate: 0.15,
    base1: 10,
    isFocusable: false,
    skill: 24,
    level: 254,
    requirements: {
      minManaCost: 10,
      minCastTime: 3,
      minDamage: 1
    }
  },
  MBRN: {
    id: 'MBRN',
    name: 'Mana Burn XVI',
    baseDmg: 2400000,
    castTime: 3.0,
    origCastTime: 3.0,
    recastTime: 0,
    lockoutTime: 0,
    resist: 'MAGIC',
    type3Aug: 0,
    timer: 'MBRN',
    manaCost: 60000,
    maxCritRate: 0,
    isFocusable: false,
    skill: 98,
    spellDmgCap: 0,
    level: 254
  },  
  CF: {
    id: 'CF',
    name: 'Claw of the Flameweaver Rk. III',
    baseDmg: 21666,
    castTime: 1.5,
    origCastTime: 3.0,
    recastTime: 6.0,
    lockoutTime: 1.5,
    resist: 'FIRE',
    type3Aug: 1392,
    timer: '11',
    manaCost: 1676,
    isFocusable: true,
    skill: 24,
    level: 103
  },
  CS: {
    id: 'CS',
    name: 'Cloudburst Stormstrike Rk. III',
    baseDmg: 17947,
    castTime: 0.0,
    origCastTime: 0.0,
    recastTime: 3,
    lockoutTime: 1.5,
    resist: 'MAGIC',
    type3Aug: 1282,
    timer: '2',
    manaCost: 3080,
    isFocusable: true,
    skill: 24,
    level: 102
  },
  DF: {
    id: 'DF',
    name: 'Dichotomic Fire 6',
    baseDmg: 127710,
    castTime: 2.0,
    origCastTime: 0.0,
    recastTime: 60,
    recastTime2: 6,
    lockoutTime: 1.5,
    resist: 'FIRE',
    type3Aug: 0,
    canTwincast: false,
    timer: 'dicho',
    manaCost: 100,
    isFocusable: true,
    skill: 24,
    level: 250
  },
  FA: {
    id: 'FA',
    name: 'Frostbound Alliance Rk. III',
    baseDmg: 0,
    castTime: 2.0,
    origCastTime: 3.0,
    recastTime: 60,
    lockoutTime: 1.5,
    resist: 'ICE',
    type3Aug: 0,
    timer: '14',
    manaCost: 13261,
    isFocusable: true,
    skill: 5,
    level: 102
  },
  FAF: {
    id: 'FAF',
    name: 'Frostbound Fulmination III',
    baseDmg: 2696520,
    castTime: 0,
    origCastTime: 0,
    recastTime: 0,
    lockoutTime: 0,
    resist: 'ICE',
    type3Aug: 0,
    timer: 'ff',
    max: 2696520,
    manaCost: 0,
    maxCritRate: 0,
    spellDmgCap: 0,
    isFocusable: false,
    skill: 5,
    level: 255
  },
  FU: {
    id: 'FU',
    name: 'Ethereal Fuse Rk. III',
    baseDmg: 33330,
    castTime: 1.5,
    origCastTime: 3.0,
    recastTime: 36,
    recastTime2: 6.25,
    lockoutTime: 1.5,
    resist: 'FIRE',
    type3Aug: 2381,
    timer: 'efuse',
    manaCost: 5911,
    isFocusable: true,
    skill: 24,
    level: 105
  },
  EF: {
    id: 'EF',
    name: 'Ethereal Flash Rk. III',
    baseDmg: 28201,
    castTime: 1.9,
    origCastTime: 3.75,
    recastTime: 5.5,
    lockoutTime: 1.5,
    resist: 'MAGIC',
    type3Aug: 2381,
    timer: 'eflash',
    manaCost: 4980,
    recastTime2: 0,
    isFocusable: true,
    skill: 24,
    level: 102
  },
  ES: {
    id: 'ES',
    name: 'Ethereal Skyblaze Rk. III',
    baseDmg: 33330,
    castTime: 1.9,
    origCastTime: 3.75,
    recastTime: 5.5,
    lockoutTime: 1.5,
    resist: 'FIRE',
    type3Aug: 2381,
    timer: 'eskyblaze',
    manaCost: 5158,
    isFocusable: true,
    skill: 24,
    level: 105
  },
  ER: {
    id: 'ER',
    name: 'Ethereal Rimeblast Rk. III',
    baseDmg: 29975,
    castTime: 1.9,
    origCastTime: 3.75,
    recastTime: 5.25,
    lockoutTime: 1.5,
    resist: 'ICE',
    type3Aug: 2381,
    timer: 'erimeblast',
    manaCost: 4639,
    isFocusable: true,
    skill: 24,
    level: 104
  },
  FC: {
    id: 'FC',
    name: 'Flashchar Rk. III',
    baseDmg: 15294,
    castTime: 0.0,
    origCastTime: 0.0,
    recastTime: 8.25,
    lockoutTime: 1.5,
    resist: 'FIRE',
    type3Aug: 1040,
    timer: '2',
    manaCost: 2467,
    isFocusable: true,
    skill: 24,
    level: 104
  },
  MB: {
    id: 'MB',
    name: 'Magmatic Burst Rk. III',
    baseDmg: 13435,
    castTime: 1.5,
    origCastTime: 3.0,
    recastTime: 12,
    lockoutTime: 1.5,
    resist: 'FIRE',
    type3Aug: 902,
    timer: '6',
    target: 'AE',
    manaCost: 1681,
    maxCritRate: 0.40,
    isFocusable: true,
    skill: 24,
    level: 104
  },
  CS2: {
    id: 'CS2',
    name: 'Chaos Scintillation III',
    baseDmg: 8469,
    castTime: 0.0,
    origCastTime: 0.0,
    recastTime: 4.75,
    lockoutTime: 1.5,
    resist: 'FIRE',
    type3Aug: 793,
    timer: 'chaos2',
    canTwincast: false,
    manaCost: 100,
    isFocusable: true,
    skill: 24,
    level: 101
  },
  RC2: {
    id: 'RC2',
    name: 'Rimeblast Cascade Rk. III',
    baseDmg: 21062,
    castTime: 0.0,
    origCastTime: 0.0,
    recastTime: 9.0,
    lockoutTime: 1.5,
    resist: 'ICE',
    type3Aug: 1504,
    canTwincast: false,
    timer: 'rimecascade2',
    manaCost: 100,
    isFocusable: true,
    skill: 24,
    level: 101
  },
  PF: {
    id: 'PF',
    name: 'Pure Wildflash III',
    baseDmg: 13049,
    castTime: 0.75,
    origCastTime: 0.75,
    recastTime: 4.0,
    lockoutTime: 1.5,
    resist: 'MAGIC',
    type3Aug: 932,
    canTwincast: false,
    timer: 'pwildflash',
    manaCost: 50,
    isFocusable: true,
    skill: 24,
    level: 105
  },
  WF: {
    id: 'WF',
    name: 'Wildflash Barrage Rk. III',
    baseDmg: 0,
    castTime: 0.6,
    origCastTime: 0.75,
    recastTime: 4.0,
    lockoutTime: 1.5,
    resist: 'MAGIC',
    type3Aug: 0,
    timer: 'wildflash',
    manaCost: 669,
    isFocusable: true,
    skill: 24,
    level: 101
  },
  CI: {
    id: 'CI',
    name: 'Chaos Incandescence Rk. III',
    baseDmg: 7237,
    castTime: 0.6,
    origCastTime: 0.75,
    recastTime: 4.0,
    lockoutTime: 1.5,
    resist: 'FIRE',
    type3Aug: 673,
    timer: 'chaosinc',
    manaCost: 714,
    isFocusable: true,
    skill: 24,
    level: 99
  },
  HC: {
    id: 'HC',
    name: 'Hoarfrost Cascade Rk. III',
    baseDmg: 19104,
    castTime: 1.5,
    origCastTime: 3.0,
    recastTime: 6.0,
    lockoutTime: 1.5,
    resist: 'ICE',
    type3Aug: 1345,
    timer: 'hoarcascade',
    manaCost: 1964,
    isFocusable: true,
    skill: 24,
    level: 99
  },
  PE: {
    id: 'PE',
    name: 'Pure Wildether III',
    baseDmg: 11272,
    castTime: 0.6,
    origCastTime: 0.75,
    recastTime: 4.0,
    lockoutTime: 1.5,
    resist: 'MAGIC',
    type3Aug: 794,
    timer: 'pwildether',
    manaCost: 50,
    isFocusable: true,
    skill: 24,
    level: 100
  },
  WE: {
    id: 'WE',
    name: 'Wildether Barrage Rk. III',
    baseDmg: 0,
    castTime: 0.6,
    origCastTime: 0.75,
    recastTime: 4.0,
    lockoutTime: 1.5,
    resist: 'MAGIC',
    type3Aug: 0,
    timer: 'wildether',
    manaCost: 583,
    isFocusable: true,
    skill: 24,
    level: 96
  },
  SV: {
    id: 'SV',
    name: 'Shocking Vortex Rk. III',
    baseDmg: 14388,
    castTime: 0.8,
    origCastTime: 1.0,
    recastTime: 24.0,
    lockoutTime: 1.5,
    resist: 'MAGIC',
    type3Aug: 0,
    timer: 'vortex',
    manaCost: 1246,
    isFocusable: true,
    skill: 24,
    level: 103
  },
  FI6: {
    id: 'FI6',
    name: 'Force of Ice VI',
    baseDmg: 15985,
    castTime: 0.5,
    origCastTime: 0.5,
    recastTime: 0.0,
    lockoutTime: 0.0,
    resist: 'ICE',
    type3Aug: 0,
    timer: 'FI',
    manaCost: 1750,
    discRefresh: 20.0,
    isFocusable: false,
    skill: 24,
    level: 254
  },
  FI5: {
    id: 'FI5',
    name: 'Force of Ice V',
    baseDmg: 15000,
    castTime: 0.5,
    origCastTime: 0.5,
    recastTime: 0.0,
    lockoutTime: 0.0,
    resist: 'ICE',
    type3Aug: 0,
    timer: 'FI',
    manaCost: 1750,
    discRefresh: 20.0,
    isFocusable: false,
    skill: 24,
    level: 254
  },
  FI4: {
    id: 'FI4',
    name: 'Force of Ice IV',
    baseDmg: 14010,
    castTime: 0.5,
    origCastTime: 0.5,
    recastTime: 0.0,
    lockoutTime: 0.0,
    resist: 'ICE',
    type3Aug: 0,
    timer: 'FI',
    manaCost: 1750,
    discRefresh: 20.0,
    isFocusable: false,
    skill: 24,
    level: 254
  },
  FI3: {
    id: 'FI3',
    name: 'Force of Ice III',
    baseDmg: 13065,
    castTime: 0.5,
    origCastTime: 0.5,
    recastTime: 0.0,
    lockoutTime: 0.0,
    resist: 'ICE',
    type3Aug: 0,
    timer: 'FI',
    manaCost: 1750,
    discRefresh: 20.0,
    isFocusable: false,
    skill: 24,
    level: 254
  },
  FI2: {
    id: 'FI2',
    name: 'Force of Ice II',
    baseDmg: 11195,
    castTime: 0.5,
    origCastTime: 0.5,
    recastTime: 0.0,
    lockoutTime: 0.0,
    resist: 'ICE',
    type3Aug: 0,
    timer: 'FI',
    manaCost: 1750,
    discRefresh: 20.0,
    isFocusable: false,
    skill: 24,
    level: 254
  },
  FI1: {
    id: 'FI1',
    name: 'Force of Ice I',
    baseDmg: 10275,
    castTime: 0.5,
    origCastTime: 0.5,
    recastTime: 0.0,
    lockoutTime: 0.0,
    resist: 'ICE',
    type3Aug: 0,
    timer: 'FI',
    manaCost: 1750,
    discRefresh: 20.0,
    isFocusable: false,
    skill: 24,
    level: 254
  },
  FF6: {
    id: 'FF6',
    name: 'Force of Flame VI',
    baseDmg: 15985,
    castTime: 0.5,
    origCastTime: 0.5,
    recastTime: 0.0,
    lockoutTime: 0.0,
    resist: 'FIRE',
    type3Aug: 0,
    timer: 'FF',
    manaCost: 1750,
    discRefresh: 20.0,
    isFocusable: false,
    skill: 24,
    level: 254
  },
  FF5: {
    id: 'FF5',
    name: 'Force of Flame V',
    baseDmg: 15000,
    castTime: 0.5,
    origCastTime: 0.5,
    recastTime: 0.0,
    lockoutTime: 0.0,
    resist: 'FIRE',
    type3Aug: 0,
    timer: 'FF',
    manaCost: 1750,
    discRefresh: 20.0,
    isFocusable: false,
    skill: 24,
    level: 254
  },
  FF4: {
    id: 'FF4',
    name: 'Force of Flame IV',
    baseDmg: 14010,
    castTime: 0.5,
    origCastTime: 0.5,
    recastTime: 0.0,
    lockoutTime: 0.0,
    resist: 'FIRE',
    type3Aug: 0,
    timer: 'FF',
    manaCost: 1750,
    discRefresh: 20.0,
    isFocusable: false,
    skill: 24,
    level: 254
  },
  FF3: {
    id: 'FF3',
    name: 'Force of Flame III',
    baseDmg: 13065,
    castTime: 0.5,
    origCastTime: 0.5,
    recastTime: 0.0,
    lockoutTime: 0.0,
    resist: 'FIRE',
    type3Aug: 0,
    timer: 'FF',
    manaCost: 1750,
    discRefresh: 20.0,
    isFocusable: false,
    skill: 24,
    level: 254
  },
  FF2: {
    id: 'FF2',
    name: 'Force of Flame II',
    baseDmg: 11195,
    castTime: 0.5,
    origCastTime: 0.5,
    recastTime: 0.0,
    lockoutTime: 0.0,
    resist: 'FIRE',
    type3Aug: 0,
    timer: 'FF',
    manaCost: 1750,
    discRefresh: 20.0,
    isFocusable: false,
    skill: 24,
    level: 254
  },
  FF1: {
    id: 'FF1',
    name: 'Force of Flame I',
    baseDmg: 10275,
    castTime: 0.5,
    origCastTime: 0.5,
    recastTime: 0.0,
    lockoutTime: 0.0,
    resist: 'FIRE',
    type3Aug: 0,
    timer: 'FF',
    manaCost: 1750,
    discRefresh: 20.0,
    isFocusable: false,
    skill: 24,
    level: 254
  },
  FW26: {
    id: 'FW26',
    name: 'Force of Will XVIII',
    baseDmg: 15985,
    castTime: 0.5,
    origCastTime: 0.5,
    recastTime: 0.0,
    lockoutTime: 0.0,
    resist: 'FIRE',
    type3Aug: 0,
    timer: 'FW',
    manaCost: 1750,
    discRefresh: 12.0,
    isFocusable: false,
    skill: 24,
    level: 254
  },
  FW25: {
    id: 'FW25',
    name: 'Force of Will XVII',
    baseDmg: 15000,
    castTime: 0.5,
    origCastTime: 0.5,
    recastTime: 0.0,
    lockoutTime: 0.0,
    resist: 'FIRE',
    type3Aug: 0,
    timer: 'FW',
    manaCost: 1750,
    discRefresh: 12.0,
    isFocusable: false,
    skill: 24,
    level: 254
  },
  FW24: {
    id: 'FW24',
    name: 'Force of Will XVI',
    baseDmg: 14010,
    castTime: 0.5,
    origCastTime: 0.5,
    recastTime: 0.0,
    lockoutTime: 0.0,
    resist: 'FIRE',
    type3Aug: 0,
    timer: 'FW',
    manaCost: 1750,
    discRefresh: 12.0,
    isFocusable: false,
    skill: 24,
    level: 254
  },
  FW23: {
    id: 'FW23',
    name: 'Force of Will XV',
    baseDmg: 13065,
    castTime: 0.5,
    origCastTime: 0.5,
    recastTime: 0.0,
    lockoutTime: 0.0,
    resist: 'FIRE',
    type3Aug: 0,
    timer: 'FW',
    manaCost: 1750,
    discRefresh: 12.0,
    isFocusable: false,
    skill: 24,
    level: 254
  },
  FW22: {
    id: 'FW22',
    name: 'Force of Will XIV',
    baseDmg: 11195,
    castTime: 0.5,
    origCastTime: 0.5,
    recastTime: 0.0,
    lockoutTime: 0.0,
    resist: 'FIRE',
    type3Aug: 0,
    timer: 'FW',
    manaCost: 1750,
    discRefresh: 12.0,
    isFocusable: false,
    skill: 24,
    level: 254
  },
  FW21: {
    id: 'FW21',
    name: 'Force of Will XIII',
    baseDmg: 10275,
    castTime: 0.5,
    origCastTime: 0.5,
    recastTime: 0.0,
    lockoutTime: 0.0,
    resist: 'FIRE',
    type3Aug: 0,
    timer: 'FW',
    manaCost: 1750,
    discRefresh: 12.0,
    isFocusable: false,
    skill: 24,
    level: 254
  },
  FW20: {
    id: 'FW20',
    name: 'Force of Will XII',
    baseDmg: 5350,
    castTime: 0.5,
    origCastTime: 0.5,
    recastTime: 0.0,
    lockoutTime: 0.0,
    resist: 'FIRE',
    type3Aug: 0,
    timer: 'FW',
    manaCost: 1750,
    discRefresh: 12.0,
    isFocusable: false,
    skill: 24,
    level: 254
  },
  FW19: {
    id: 'FW19',
    name: 'Force of Will XI',
    baseDmg: 4550,
    castTime: 0.5,
    origCastTime: 0.5,
    recastTime: 0.0,
    lockoutTime: 0.0,
    resist: 'FIRE',
    type3Aug: 0,
    timer: 'FW',
    manaCost: 1750,
    discRefresh: 12.0,
    isFocusable: false,
    skill: 24,
    level: 254
  },
  FW18: {
    id: 'FW18',
    name: 'Force of Will X',
    baseDmg: 3750,
    castTime: 0.5,
    origCastTime: 0.5,
    recastTime: 0.0,
    lockoutTime: 0.0,
    resist: 'FIRE',
    type3Aug: 0,
    timer: 'FW',
    manaCost: 1750,
    discRefresh: 12.0,
    isFocusable: false,
    skill: 24,
    level: 254
  },
  FW17: {
    id: 'FW17',
    name: 'Force of Will IX',
    baseDmg: 2950,
    castTime: 0.5,
    origCastTime: 0.5,
    recastTime: 0.0,
    lockoutTime: 0.0,
    resist: 'FIRE',
    type3Aug: 0,
    timer: 'FW',
    manaCost: 1750,
    discRefresh: 12.0,
    isFocusable: false,
    skill: 24,
    level: 254
  },
  FW16: {
    id: 'FW16',
    name: 'Force of Will IX',
    baseDmg: 2950,
    castTime: 0.5,
    origCastTime: 0.5,
    recastTime: 0.0,
    lockoutTime: 0.0,
    resist: 'FIRE',
    type3Aug: 0,
    timer: 'FW',
    manaCost: 1750,
    discRefresh: 13.0,
    isFocusable: false,
    skill: 24,
    level: 254
  },
  FW15: {
    id: 'FW15',
    name: 'Force of Will IX',
    baseDmg: 2950,
    castTime: 0.5,
    origCastTime: 0.5,
    recastTime: 0.0,
    lockoutTime: 0.0,
    resist: 'FIRE',
    type3Aug: 0,
    timer: 'FW',
    manaCost: 1750,
    discRefresh: 14.0,
    isFocusable: false,
    skill: 24,
    level: 254
  },
  FW14: {
    id: 'FW14',
    name: 'Force of Will IX',
    baseDmg: 2950,
    castTime: 0.5,
    origCastTime: 0.5,
    recastTime: 0.0,
    lockoutTime: 0.0,
    resist: 'FIRE',
    type3Aug: 0,
    timer: 'FW',
    manaCost: 1750,
    discRefresh: 15.0,
    isFocusable: false,
    skill: 24,
    level: 254
  },
  FW13: {
    id: 'FW13',
    name: 'Force of Will VIII',
    baseDmg: 2550,
    castTime: 0.5,
    origCastTime: 0.5,
    recastTime: 0.0,
    lockoutTime: 0.0,
    resist: 'FIRE',
    type3Aug: 0,
    timer: 'FW',
    manaCost: 1750,
    discRefresh: 15.0,
    isFocusable: false,
    skill: 24,
    level: 254
  },
  FW12: {
    id: 'FW12',
    name: 'Force of Will VII',
    baseDmg: 2150,
    castTime: 0.5,
    origCastTime: 0.5,
    recastTime: 0.0,
    lockoutTime: 0.0,
    resist: 'FIRE',
    type3Aug: 0,
    timer: 'FW',
    manaCost: 1750,
    discRefresh: 15.0,
    isFocusable: false,
    skill: 24,
    level: 254
  },
  FW11: {
    id: 'FW11',
    name: 'Force of Will VI',
    baseDmg: 1750,
    castTime: 0.5,
    origCastTime: 0.5,
    recastTime: 0.0,
    lockoutTime: 0.0,
    resist: 'FIRE',
    type3Aug: 0,
    timer: 'FW',
    manaCost: 1750,
    discRefresh: 15.0,
    isFocusable: false,
    skill: 24,
    level: 254
  },
  FW10: {
    id: 'FW10',
    name: 'Force of Will V',
    baseDmg: 1550,
    castTime: 0.5,
    origCastTime: 0.5,
    recastTime: 0.0,
    lockoutTime: 0.0,
    resist: 'FIRE',
    type3Aug: 0,
    timer: 'FW',
    manaCost: 1750,
    discRefresh: 15.0,
    isFocusable: false,
    skill: 24,
    level: 254
  },
  FW9: {
    id: 'FW9',
    name: 'Force of Will IV',
    baseDmg: 1350,
    castTime: 0.5,
    origCastTime: 0.5,
    recastTime: 0.0,
    lockoutTime: 0.0,
    resist: 'FIRE',
    type3Aug: 0,
    timer: 'FW',
    manaCost: 1750,
    discRefresh: 15.0,
    isFocusable: false,
    skill: 24,
    level: 254
  },
  FW8: {
    id: 'FW8',
    name: 'Force of Will III',
    baseDmg: 1150,
    castTime: 0.5,
    origCastTime: 0.5,
    recastTime: 0.0,
    lockoutTime: 0.0,
    resist: 'FIRE',
    type3Aug: 0,
    timer: 'FW',
    manaCost: 1750,
    discRefresh: 15.0,
    isFocusable: false,
    skill: 24,
    level: 254
  },
  FW7: {
    id: 'FW7',
    name: 'Force of Will III',
    baseDmg: 1150,
    castTime: 0.5,
    origCastTime: 0.5,
    recastTime: 0.0,
    lockoutTime: 0.0,
    resist: 'FIRE',
    type3Aug: 0,
    timer: 'FW',
    manaCost: 1750,
    discRefresh: 16.0,
    isFocusable: false,
    skill: 24,
    level: 254
  },
  FW6: {
    id: 'FW6',
    name: 'Force of Will III',
    baseDmg: 1150,
    castTime: 0.5,
    origCastTime: 0.5,
    recastTime: 0.0,
    lockoutTime: 0.0,
    resist: 'FIRE',
    type3Aug: 0,
    timer: 'FW',
    manaCost: 1750,
    discRefresh: 17.0,
    isFocusable: false,
    skill: 24,
    level: 254
  },
  FW5: {
    id: 'FW5',
    name: 'Force of Will III',
    baseDmg: 1150,
    castTime: 0.5,
    origCastTime: 0.5,
    recastTime: 0.0,
    lockoutTime: 0.0,
    resist: 'FIRE',
    type3Aug: 0,
    timer: 'FW',
    manaCost: 1750,
    discRefresh: 18.0,
    isFocusable: false,
    skill: 24,
    level: 254
  },
  FW4: {
    id: 'FW4',
    name: 'Force of Will III',
    baseDmg: 1150,
    castTime: 0.5,
    origCastTime: 0.5,
    recastTime: 0.0,
    lockoutTime: 0.0,
    resist: 'FIRE',
    type3Aug: 0,
    timer: 'FW',
    manaCost: 1750,
    discRefresh: 19.0,
    isFocusable: false,
    skill: 24,
    level: 254
  },
  FW3: {
    id: 'FW3',
    name: 'Force of Will III',
    baseDmg: 1150,
    castTime: 0.5,
    origCastTime: 0.5,
    recastTime: 0.0,
    lockoutTime: 0.0,
    resist: 'FIRE',
    type3Aug: 0,
    timer: 'FW',
    manaCost: 1750,
    discRefresh: 20.0,
    isFocusable: false,
    skill: 24,
    level: 254
  },
  FW2: {
    id: 'FW2',
    name: 'Force of Will II',
    baseDmg: 1050,
    castTime: 0.5,
    origCastTime: 0.5,
    recastTime: 0.0,
    lockoutTime: 0.0,
    resist: 'FIRE',
    type3Aug: 0,
    timer: 'FW',
    manaCost: 1750,
    discRefresh: 20.0,
    isFocusable: false,
    skill: 24,
    level: 254
  },
  FW1: {
    id: 'FW1',
    name: 'Force of Will I',
    baseDmg: 950,
    castTime: 0.5,
    origCastTime: 0.5,
    recastTime: 0.0,
    lockoutTime: 0.0,
    resist: 'FIRE',
    type3Aug: 0,
    timer: 'FW',
    manaCost: 1750,
    discRefresh: 20.0,
    isFocusable: false,
    skill: 24,
    level: 254
  }
};