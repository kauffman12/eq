export const SPELL_DATA = {
  BB: {
    baseDmg: 12917,
    castTime: 2000,
    focusable: true,
    id: 'BB',
    level: 109,
    lockoutTime: 1500,
    manaCost:  	3438,
    maxHits: 20,
    name: 'Burning Blast Rk. III',
    origCastTime: 4000,
    recastTime: 12000,
    resist: 'FIRE',
    skill: 24,
    target: 'CasterPB',
    timer: '2'
  },
  BJ: {
    baseDmg: 28769,
    castTime: 0,
    focusable: true,
    id: 'BJ',
    inventory: true,
    level: 102,
    lockoutTime: 1500,
    manaCost: 10,
    name: 'Blazing Jet III',
    origCastTime: 0,
    recastTime: 6000,
    resist: 'FIRE',
    skill: 24,
    target: 'SINGLE',
    timer: 'recast-5' // from clickie
  },
  BS: {
    baseDmg: 14335,
    castTime: 1500,
    focusable: true,
    id: 'BS',
    level: 113,
    lockoutTime: 1500,
    manaCost: 1687,
    maxHits: 12,
    name: 'Beam of Scimitars Rk. III',
    origCastTime: 3000,
    recastTime: 1500,
    resist: 'MAGIC',
    skill: 14,
    target: 'FrontalAE',
    timer: 'beam-scimitars'
  },
  BSRk1: {
    name: 'Beam of Scimitars Rk. I',
    baseDmg: 13002
  },
  BSRk2: {
    name: 'Beam of Scimitars Rk. II',
    baseDmg: 13652
  },
  BSRk3: {
    name: 'Beam of Scimitars Rk. III',
    baseDmg: 14335
  },
  BM: {
    baseDmg: 17107,
    castTime: 1500,
    focusable: true,
    id: 'BM',
    level: 112,
    lockoutTime: 1500,
    manaCost: 2015,
    maxHits: 12,
    name: 'Beam of Molten Komatiite Rk. III',
    origCastTime: 3000,
    recastTime: 1500,
    resist: 'FIRE',
    skill: 14,
    target: 'FrontalAE',
    timer: 'beam-molten'
  },
  BMRk1: {
    name: 'Beam of Molten Komatiite Rk. I',
    baseDmg: 15516
  },
  BMRk2: {
    name: 'Beam of Molten Komatiite Rk. II',
    baseDmg: 16292
  },
  BMRk3: {
    name: 'Beam of Molten Komatiite Rk. III',
    baseDmg: 17107
  },
  BK: {
    baseDmg: 25415,
    castTime: 1500,
    focusable: true,
    id: 'BK',
    level: 111,
    lockoutTime: 1500,
    manaCost: 2701,
    name: 'Bolt of Molten Komatiite Rk. III',
    origCastTime: 3000,
    recastTime: 6000,
    resist: 'FIRE',
    skill: 24,
    target: 'LOS',
    timer: 'boltofkom',
    type3DmgAug: 1815
  },
  BKRk1: {
    name: 'Bolt of Molten Komatiite Rk. I',
    baseDmg: 23052
  },
  BKRk2: {
    name: 'Bolt of Molten Komatiite Rk. II',
    baseDmg: 24205
  },
  BKRk3: {
    name: 'Bolt of Molten Komatiite Rk. III',
    baseDmg: 25415
  },
  CP: {
    baseDmg: 31616,
    castTime: 1200,
    focusable: true,
    id: 'CP',
    level: 115,
    lockoutTime: 1500,
    manaCost: 3782,
    name: 'Chaotic Pyroclasm Rk. III',
    origCastTime: 1500,
    recastTime: 5250,
    resist: 'FIRE',
    skill: 24,
    target: 'SINGLE',
    timer: '4',
    type3DmgAug: 2258
  },
  CPRk1: {
    name: 'Chaotic Pyroclasm Rk. I',
    baseDmg: 28676
  },
  CPRk2: {
    name: 'Chaotic Pyroclasm Rk. II',
    baseDmg: 30110
  },
  CPRk3: {
    name: 'Chaotic Pyroclasm Rk. III',
    baseDmg: 31616
  },
  DC: {
    baseDmg: 0,
    canTwincast: false,
    castTime: 400,
    focusable: true,
    id: 'DC',
    level: 250,
    lockoutTime: 1500,
    manaCost: 100,
    name: 'Dissident Companion 6',
    origCastTime: 500,
    recastTime: 60000,
    recastTime2: 6000,
    resist: 'NONE',
    skill: 4,
    target: 'SINGLE',
    timer: 'dicho'
  },
  RM: {
    baseDmg: 25183,
    castTime: 2000,
    focusable: true,
    id: 'RM',
    level: 113,
    lockoutTime: 1500,
    manaCost: 2845,
    maxCritRate: 0.40,
    maxHits: 4,
    name: 'Rain of Molten Komatiite Rk. III',
    origCastTime: 4000,
    recastTime: 12000,
    resist: 'FIRE',
    skill: 24,
    target: 'TargetAE',
    timer: '3'
  },
  RMRk1: {
    name: 'Rain of Molten Komatiite Rk. I',
    baseDmg: 22842
  },
  RMRk2: {
    name: 'Rain of Molten Komatiite Rk. II',
    baseDmg: 23984
  },
  RMRk3: {
    name: 'Rain of Molten Komatiite Rk. III',
    baseDmg: 25183
  },
  FBC: {
    castTime: 1980,
    focusable: true,
    id: 'FBC',
    level: 110,
    lockoutTime: 1500,
    manaCost: 12214,
    name: 'Firebound Covenant Rk. III',
    origCastTime: 3000,
    recastTime: 60000,
    resist: 'FIRE',
    skill: 5,
    target: 'SINGLE',
    timer: '13'
  },
  FAR: {
    baseDmg: 2717455,
    castTime: 0,
    focusable: false,
    id: 'FAR',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    max: 2717455,
    maxCritRate: 0,
    name: 'Firebound Resolution III',
    origCastTime: 0,
    recastTime: 0,
    resist: 'FIRE',
    skill: 5,
    spellDmgCap: 0,
    target: 'SINGLE',
    timer: 'ff'
  },
  FC: {
    baseDmg: 16954,
    castTime: 1200,
    focusable: true,
    id: 'FC',
    level: 105,
    lockoutTime: 1500,
    manaCost: 1941,
    name: 'Fickle Conflagration Rk. III',
    origCastTime: 1500,
    recastTime: 5250,
    resist: 'FIRE',
    skill: 24,
    target: 'SINGLE',
    timer: 'fickleconflag',
    type3DmgAug: 1211
  },
  FE13: {
    aa: true,
    baseDmg: 17530,
    castTime: 500,
    focusable: false,
    id: 'FE13',
    level: 254,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Force of Elements XIII',
    origCastTime: 500,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 24,
    target: 'SINGLE',
    timer: '73'
  },
  FE14: {
    aa: true,
    baseDmg: 18800,
    castTime: 500,
    focusable: false,
    id: 'FE14',
    level: 254,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Force of Elements XIV',
    origCastTime: 500,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 24,
    target: 'SINGLE',
    timer: '73'
  },
  FE15: {
    aa: true,
    baseDmg: 20105,
    castTime: 500,
    focusable: false,
    id: 'FE15',
    level: 254,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Force of Elements XV',
    origCastTime: 500,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 24,
    target: 'SINGLE',
    timer: '73'
  },
  FE16: {
    aa: true,
    baseDmg: 21450,
    castTime: 500,
    focusable: false,
    id: 'FE16',
    level: 254,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Force of Elements XVI',
    origCastTime: 500,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 24,
    target: 'SINGLE',
    timer: '73'
  },
  FE17: {
    aa: true,
    baseDmg: 23000,
    castTime: 500,
    focusable: false,
    id: 'FE17',
    level: 254,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Force of Elements XVII',
    origCastTime: 500,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 24,
    target: 'SINGLE',
    timer: '73'
  },
  FE18: {
    aa: true,
    baseDmg: 24375,
    castTime: 500,
    focusable: false,
    id: 'FE18',
    level: 254,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Force of Elements XVIII',
    origCastTime: 500,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 24,
    target: 'SINGLE',
    timer: '73'
  },
  KB: {
    baseDmg: 22495,
    castTime: 1500,
    focusable: true,
    id: 'KB',
    level: 108,
    lockoutTime: 1500,
    manaCost: 2000,
    name: 'Korascian Bolt Rk. III',
    origCastTime: 3000,
    recastTime: 6000,
    resist: 'MAGIC',
    skill: 24,
    target: 'LOS',
    timer: 'korbolt',
    type3DmgAug: 0
  },
  RK: {
    baseDmg: 24573,
    castTime: 2000,
    focusable: true,
    id: 'RK',
    level: 114,
    lockoutTime: 1500,
    manaCost: 2737,
    maxCritRate: 0.40,
    maxHits: 4,
    name: 'Rain of Scimitars Rk. III',
    origCastTime: 4000,
    recastTime: 12000,
    resist: 'MAGIC',
    skill: 24,
    target: 'TargetAE',
    timer: '7',
    type3DmgAug: 1755
  },
  RKRk1: {
    name: 'Rain of Scimitars Rk. I',
    baseDmg: 22289
  },
  RKRk2: {
    name: 'Rain of Scimitars Rk. II',
    baseDmg: 23403
  },
  RKRk3: {
    name: 'Rain of Scimitars Rk. III',
    baseDmg: 24573
  },
  RS: {
    baseDmg: 2,
    canTwincast: false,
    castTime: 800,
    focusable: true,
    id: 'RS',
    level: 115,
    lockoutTime: 1500,
    manaCost: 6050,
    name: 'Riotous Servant Rk. III',
    origCastTime: 1000,
    recastTime: 19000,
    resist: 'NONE',
    skill: 14,
    spellDmgCap: 0,
    target: 'SINGLE',
    timer: 'riotousserv',
    type3Aug: 1000
  },
  RSRk1: {
    name: 'Riotous Servant Rk. I'
  },
  RSRk2: {
    name: 'Riotous Servant Rk. II'
  },
  RSRk3: {
    name: 'Riotous Servant Rk. III'
  },
  RD: {
    baseDmg: 400000,
    castTime: 0,
    focusable: false,
    id: 'RD',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Obliterate Destruction',
    origCastTime: 0,
    recastTime: 0,
    resist: 'UNRESISTABLE',
    skill: 98,
    target: 'SINGLE',
    timer: 'repudiateDest',
    type3DmgAug: 0
  },
  RU: {
    baseDmg: 26645,
    castTime: 1200,
    focusable: true,
    id: 'RU',
    level: 113,
    lockoutTime: 1500,
    manaCost: 2050,
    name: 'Obliterate the Unnatural Rk. III',
    origCastTime: 1500,
    recastTime: 5750,
    resist: 'MAGIC',
    skill: 24,
    target: 'SINGLE',
    timer: 'repudiateUnnatural',
    type3DmgAug: 1903
  },
  RURk1: {
    name: 'Obliterate the Unnatural Rk. I',
    baseDmg: 24168
  },
  RURk2: {
    name: 'Obliterate the Unnatural Rk. II',
    baseDmg: 25376
  },
  RURk3: {
    name: 'Obliterate the Unnatural Rk. III',
    baseDmg: 26645
  },
  SFB: {
    baseDmg: 0,
    beneficial: true,
    castTime: 3500,
    focusable: true,
    id: 'SFB',
    level: 102,
    lockoutTime: 1500,
    manaCost: 9453,
    name: 'Summon Firebound Orb Rk. III',
    origCastTime: 7000,
    recastTime: 6000,
    resist: 'NONE',
    skill: 14,
    target: 'SELF',
    timer: 'summonfirebound'
  },
  SK: {
    baseDmg: 46358,
    castTime: 1750,
    focusable: true,
    id: 'SK',
    level: 115,
    lockoutTime: 1500,
    manaCost: 7358,
    name: 'Spear of Molten Komatiite Rk. III',
    origCastTime: 3500,
    recastTime: 9000,
    resist: 'FIRE',
    skill: 24,
    target: 'LOS',
    timer: 'spearkom',
    type3DmgAug: 3470
  },
  SKRk1: {
    name: 'Spear of Molten Komatiite Rk. I',
    baseDmg: 44150
  },
  SKRk2: {
    name: 'Spear of Molten Komatiite Rk. II',
    baseDmg: 46358
  },
  SKRk3: {
    name: 'Spear of Molten Komatiite Rk. III',
    baseDmg: 48676
  },
  SA: {
    baseDmg: 36056,
    castTime: 1750,
    focusable: true,
    id: 'SA',
    level: 110,
    lockoutTime: 1500,
    manaCost: 5886,
    name: 'Spear of Molten Arcronite Rk. III',
    origCastTime: 3500,
    recastTime: 9000,
    resist: 'FIRE',
    skill: 24,
    target: 'LOS',
    timer: 'speararconite',
    type3DmgAug: 2575
  },
  SH: {
    baseDmg: 17547,
    castTime: 1625,
    focusable: true,
    id: 'SH',
    level: 112,
    lockoutTime: 1500,
    manaCost: 1610,
    name: 'Shock of Burning Steel Rk. III',
    origCastTime: 3250,
    recastTime: 5250,
    resist: 'MAGIC',
    skill: 14,
    target: 'SINGLE',
    timer: 'shockofburn',
    type3DmgAug: 1253
  },
  SHRk1: {
    name: 'Shock of Burning Steel Rk. I',
    baseDmg: 15915
  },
  SHRk2: {
    name: 'Shock of Burning Steel Rk. II',
    baseDmg: 16711
  },
  SHRk3: {
    name: 'Shock of Burning Steel Rk. III',
    baseDmg: 17547
  },
  SV10: {
    baseDmg: 40000,
    castTime: 0,
    focusable: true,
    id: 'SV10',
    level: 254,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Steel Vengeance X',
    origCastTime: 0,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 98,
    target: 'SINGLE',
    timer: 'steelveng',
    type3DmgAug: 0
  },
  SV11: {
    baseDmg: 50000,
    castTime: 0,
    focusable: true,
    id: 'SV11',
    level: 254,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Steel Vengeance XI',
    origCastTime: 0,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 98,
    target: 'SINGLE',
    timer: 'steelveng',
    type3DmgAug: 0
  },
  SV12: {
    baseDmg: 60000,
    castTime: 0,
    focusable: true,
    id: 'SV12',
    level: 254,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Steel Vengeance XII',
    origCastTime: 0,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 98,
    target: 'SINGLE',
    timer: 'steelveng',
    type3DmgAug: 0
  },
  SV13: {
    baseDmg: 63000,
    castTime: 0,
    focusable: true,
    id: 'SV13',
    level: 254,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Steel Vengeance XIII',
    origCastTime: 0,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 98,
    target: 'SINGLE',
    timer: 'steelveng',
    type3DmgAug: 0
  },
  SV14: {
    baseDmg: 66000,
    castTime: 0,
    focusable: true,
    id: 'SV14',
    level: 254,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Steel Vengeance XIV',
    origCastTime: 0,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 98,
    target: 'SINGLE',
    timer: 'steelveng',
    type3DmgAug: 0
  },
  SV15: {
    baseDmg: 70000,
    castTime: 0,
    focusable: true,
    id: 'SV15',
    level: 254,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Steel Vengeance XV',
    origCastTime: 0,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 98,
    target: 'SINGLE',
    timer: 'steelveng',
    type3DmgAug: 0
  },  
  
  SM: {
    baseDmg: 6032,
    baseDmg1: 6032,
    baseDmg2: 6032,
    baseDmg3: 12999,
    baseDmg4: 12999,
    baseDmg5: 12999,
    baseDmg6: 21916,
    baseDmg7: 21916,
    baseDmg8: 21916,
    baseDmg9: 21916,
    baseDmg10: 35874,
    baseDmg11: 35874,
    baseDmg12: 35874,
    baseDmg13: 35874,
    baseDmg14: 35874,
    baseDmg15: 56574,
    castTime: 600,
    focusable: true,
    id: 'SM',
    level: 112,
    lockoutTime: 1500,
    manaCost: 2681,
    name: 'Strike of Many Rk. III',
    origCastTime: 750,
    recastTime: 9000,
    resist: 'FIRE',
    skill: 24,
    target: 'LOS',
    timer: '6',
    type3DmgAug: 341
  },
  SMRk1: {
    name: 'Strike of Many Rk. I',
    baseDmg: 5471,
    baseDmg1: 5471,
    baseDmg2: 5471,
    baseDmg3: 11790,
    baseDmg4: 11790,
    baseDmg5: 11790,
    baseDmg6: 19878,
    baseDmg7: 19878,
    baseDmg8: 19878,
    baseDmg9: 19878,
    baseDmg10: 32539,
    baseDmg11: 32539,
    baseDmg12: 32539,
    baseDmg13: 32539,
    baseDmg14: 32539,
    baseDmg15: 51315
  },
  SMRk2: {
    name: 'Strike of Many Rk. II',
    baseDmg: 5745,
    baseDmg1: 5745,
    baseDmg2: 5745,
    baseDmg3: 12380,
    baseDmg4: 12380,
    baseDmg5: 12380,
    baseDmg6: 20872,
    baseDmg7: 20872,
    baseDmg8: 20872,
    baseDmg9: 20872,
    baseDmg10: 34166,
    baseDmg11: 34166,
    baseDmg12: 34166,
    baseDmg13: 34166,
    baseDmg14: 34166,
    baseDmg15: 53881
  },
  SMRk3: {
    name: 'Strike of Many Rk. III',
    baseDmg: 6032,
    baseDmg1: 6032,
    baseDmg2: 6032,
    baseDmg3: 12999,
    baseDmg4: 12999,
    baseDmg5: 12999,
    baseDmg6: 21916,
    baseDmg7: 21916,
    baseDmg8: 21916,
    baseDmg9: 21916,
    baseDmg10: 35874,
    baseDmg11: 35874,
    baseDmg12: 35874,
    baseDmg13: 35874,
    baseDmg14: 35874,
    baseDmg15: 56574
  }
}