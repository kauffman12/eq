function SMap(list) {
  let map = new Map();
  list.forEach(item => map.set(item, true));
  return map;
}

export const SPELL_DATA = {
  AS: {
    baseDmg: 1773,
    castTime: 0,
    focusable: true,
    id: 'AS',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Arcane Symphony Effect III',
    origCastTime: 0,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 98,
    target: 'SINGLE',
    timer: 'AS',
    type3Dmg: 0
  },
  ASVI: {
    base1: 100,
    baseDmg: 225,
    castTime: 0,
    focusable: true,
    id: 'ASVI',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Arcane Strike VI',
    origCastTime: 0,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 52,
    spellDmgCap: 225,
    target: 'SINGLE',
    timer: 'ASVI',
    type3Dmg: 0
  },
  BFVI: {
    base1: 100,
    baseDmg: 10000,
    castTime: 0,
    focusable: true,
    id: 'BFVI',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Blaze of Fire VI',
    origCastTime: 0,
    recastTime: 0,
    resist: 'FIRE',
    skill: 52,
    target: 'SINGLE',
    timer: 'BFVI',
    type3Dmg: 0
  },
  BOFVI: {
    base1: 100,
    baseDmg: 4000,
    castTime: 0,
    focusable: true,
    id: 'BOFVI',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Burst of Flames VI',
    origCastTime: 0,
    recastTime: 0,
    resist: 'FIRE',
    skill: 52,
    target: 'SINGLE',
    timer: 'BOFVI',
    type3Dmg: 0
  },
  BOFVII: {
    base1: 100,
    baseDmg: 4400,
    castTime: 0,
    focusable: true,
    id: 'BOFVII',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Burst of Flames VII',
    origCastTime: 0,
    recastTime: 0,
    resist: 'FIRE',
    skill: 52,
    target: 'SINGLE',
    timer: 'BOFVII',
    type3Dmg: 0
  },
  BOIVI: {
    base1: 100,
    baseDmg: 510,
    castTime: 0,
    focusable: true,
    id: 'BOVI',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Burst of Ice VI',
    origCastTime: 0,
    recastTime: 0,
    resist: 'COLD',
    skill: 52,
    target: 'SINGLE',
    timer: 'BOVI',
    type3Dmg: 0
  },
  BOIX: {
    base1: 100,
    baseDmg: 1050,
    castTime: 0,
    focusable: true,
    id: 'BOIX',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Burst of Ice X',
    origCastTime: 0,
    recastTime: 0,
    resist: 'COLD',
    skill: 52,
    target: 'SINGLE',
    timer: 'BOIX',
    type3Dmg: 0
  },
  EBOFV: {
    base1: 100,
    baseDmg: 3600,
    castTime: 0,
    focusable: true,
    id: 'EBOFV',
    level: 255,
    limitMana: 100,
    limitResists: SMap(['FIRE', 'CHROMATIC']),
    lockoutTime: 0,
    manaCost: 0,
    name: 'Burst of Flames V',
    origCastTime: 0,
    recastTime: 0,
    resist: 'FIRE',
    skill: 52,
    target: 'SINGLE',
    timer: 'EBOFV',
    type3Dmg: 0
  },
  ESOMV: {
    base1: 100,
    baseDmg: 3600,
    castTime: 0,
    focusable: true,
    id: 'ESOMV',
    level: 255,
    limitMana: 100,
    limitResists: SMap(['MAGIC', 'CHROMATIC']),
    lockoutTime: 0,
    manaCost: 0,
    name: 'Spike of Magic V',
    origCastTime: 0,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 52,
    target: 'SINGLE',
    timer: 'ESOMV',
    type3Dmg: 0
  },
  EBOFVIII: {
    base1: 100,
    baseDmg: 4800,
    castTime: 0,
    focusable: true,
    id: 'EBOFVIII',
    level: 255,
    limitMana: 100,
    limitResists: SMap(['FIRE', 'CHROMATIC']),
    lockoutTime: 0,
    manaCost: 0,
    name: 'Burst of Flames VIII',
    origCastTime: 0,
    recastTime: 0,
    resist: 'FIRE',
    skill: 52,
    target: 'SINGLE',
    timer: 'EBOFVIII',
    type3Dmg: 0
  },
  ESOMVIII: {
    base1: 100,
    baseDmg: 4800,
    castTime: 0,
    focusable: true,
    id: 'ESOMVIII',
    level: 255,
    limitMana: 100,
    limitResists: SMap(['MAGIC', 'CHROMATIC']),
    lockoutTime: 0,
    manaCost: 0,
    name: 'Spike of Magic VIII',
    origCastTime: 0,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 52,
    target: 'SINGLE',
    timer: 'ESOMVIII',
    type3Dmg: 0
  },
  RF: {
    base1: 100,
    baseDmg: 12000,
    castTime: 0,
    focusable: false,
    id: 'RF',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    max: 0,
    name: 'Restless Focus Spell',
    origCastTime: 0,
    recastTime: 0,
    resist: 'DISEASE',
    skill: 24,
    target: 'SINGLE',
    timer: 'RF',
    type3Dmg: 0
  },
  DRS: {
    base1: 160,
    baseDmg: 24193,
    castTime: 0,
    focusable: true,
    id: 'DR',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Dissident Reinforced Strike 6',
    origCastTime: 0,
    recastTime: 6000,
    resist: 'CHROMATIC',
    skill: 24,
    target: 'SINGLE',
    timer: 'DR',
    type3Dmg: 0
  },
  FCVII: {
    base1: 100,
    baseDmg: 540,
    castTime: 0,
    focusable: true,
    id: 'FCVII',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Force of Corruption VII',
    origCastTime: 0,
    recastTime: 0,
    resist: 'CORRUPTION',
    skill: 52,
    target: 'SINGLE',
    timer: 'FCVII',
    type3Dmg: 0
  },
  FCX: {
    base1: 100,
    baseDmg: 945,
    castTime: 0,
    focusable: true,
    id: 'FCX',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Force of Corruption X',
    origCastTime: 0,
    recastTime: 0,
    resist: 'CORRUPTION',
    skill: 52,
    target: 'SINGLE',
    timer: 'FCX',
    type3Dmg: 0
  },
  FOMIX: {
    base1: 100,
    baseDmg: 900,
    castTime: 0,
    focusable: true,
    id: 'FOMIX',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Force of Magic IX',
    origCastTime: 0,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 52,
    target: 'SINGLE',
    timer: 'FOMIX',
    type3Dmg: 0
  },
  FOMVII: {
    base1: 100,
    baseDmg: 600,
    castTime: 0,
    focusable: true,
    id: 'FOMVII',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Force of Magic VII',
    origCastTime: 0,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 52,
    target: 'SINGLE',
    timer: 'FOMVII',
    type3Dmg: 0
  },
  FOMXIII: {
    base1: 100,
    baseDmg: 1500,
    castTime: 0,
    focusable: true,
    id: 'FOMXIII',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Force of Magic XIII',
    origCastTime: 0,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 52,
    target: 'SINGLE',
    timer: 'FOMXIII',
    type3Dmg: 0
  },
  FOMXV: {
    base1: 100,
    baseDmg: 1800,
    castTime: 0,
    focusable: true,
    id: 'FOMXV',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Force of Magic XV',
    origCastTime: 0,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 52,
    target: 'SINGLE',
    timer: 'FOMXV',
    type3Dmg: 0
  },
  FSVI: {
    base1: 100,
    baseDmg: 225,
    castTime: 0,
    focusable: true,
    id: 'FSVI',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Fiery Strike VI',
    origCastTime: 0,
    recastTime: 0,
    resist: 'FIRE',
    skill: 52,
    spellDmgCap: 225,
    target: 'SINGLE',
    timer: 'FSVI',
    type3Dmg: 0
  },
  FSVII: {
    base1: 100,
    baseDmg: 250,
    castTime: 0,
    focusable: true,
    id: 'FSVII',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Fiery Strike VII',
    origCastTime: 0,
    recastTime: 0,
    resist: 'FIRE',
    skill: 52,
    spellDmgCap: 250,
    target: 'SINGLE',
    timer: 'FSVII',
    type3Dmg: 0
  },
  FZVI: {
    base1: 100,
    baseDmg: 225,
    castTime: 0,
    focusable: true,
    id: 'FZVI',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Freezing Strike VI',
    origCastTime: 0,
    recastTime: 0,
    resist: 'COLD',
    skill: 52,
    spellDmgCap: 225,
    target: 'SINGLE',
    timer: 'FZVI',
    type3Dmg: 0
  },
  FW: {
    baseDmg: 5624,
    castTime: 0,
    focusable: true,
    id: 'FW',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Icerend Strike III',
    origCastTime: 0,
    recastTime: 0,
    resist: 'COLD',
    skill: 24,
    target: 'SINGLE',
    timer: 'FW',
    type3Dmg: 0
  },
  HOMIII: {
    base1: 100,
    baseDmg: 7000,
    castTime: 0,
    focusable: true,
    id: 'HOMIII',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Hammer of Magic III',
    origCastTime: 0,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 52,
    target: 'SINGLE',
    timer: 'HOMIII',
    type3Dmg: 0
  },
  HOMVII: {
    base1: 100,
    baseDmg: 11000,
    castTime: 0,
    focusable: true,
    id: 'HOMVII',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Hammer of Magic VII',
    origCastTime: 0,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 52,
    target: 'SINGLE',
    timer: 'HOMVII',
    type3Dmg: 0
  },
  BOFVIII: {
    base1: 100,
    baseDmg: 12000,
    castTime: 0,
    focusable: true,
    id: 'BOFVIII',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Blaze of Fire VIII',
    origCastTime: 0,
    recastTime: 0,
    resist: 'FIRE',
    skill: 52,
    target: 'SINGLE',
    timer: 'BOFVIII',
    type3Dmg: 0
  },
  MR: {
    baseDmg: 6086,
    castTime: 0,
    focusable: true,
    id: 'MR',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    max: 0,
    name: 'Mana Replication Strike III',
    origCastTime: 0,
    recastTime: 0,
    resist: 'CHROMATIC',
    skill: 5,
    target: 'SINGLE',
    timer: 'MRR',
    type3Dmg: 0
  },
  MRR: {
    baseDmg: 11160,
    castTime: 0,
    focusable: true,
    id: 'MRR',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    max: 0,
    name: 'Mana Re-Replication Strike III',
    origCastTime: 0,
    recastTime: 0,
    resist: 'CHROMATIC',
    skill: 5,
    target: 'SINGLE',
    timer: 'MRR',
    type3Dmg: 0
  },
  MRRR: {
    baseDmg: 11718,
    castTime: 0,
    focusable: true,
    id: 'MRRR',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    max: 0,
    name: 'Mana Re-Re-Replication Strike III',
    origCastTime: 0,
    recastTime: 0,
    resist: 'CHROMATIC',
    skill: 5,
    target: 'SINGLE',
    timer: 'MRRR',
    type3Dmg: 0
  },
  MRRRR: {
    baseDmg: 12304,
    castTime: 0,
    focusable: true,
    id: 'MRRRR',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    max: 0,
    name: 'Mana Re-Re-Re-Replication Strike III',
    origCastTime: 0,
    recastTime: 0,
    resist: 'CHROMATIC',
    skill: 5,
    target: 'SINGLE',
    timer: 'MRRRR',
    type3Dmg: 0
  },
  OS: {
    base1: 100,
    baseDmg: 4000,
    castTime: 0,
    focusable: false,
    id: 'OS',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Obulus Strike',
    origCastTime: 0,
    recastTime: 0,
    resist: 'CHROMATIC',
    skill: 52,
    target: 'SINGLE',
    timer: 'OS',
    type3Dmg: 0
  },
  POP99: {
    base1: 100,
    baseDmg: 10000,
    castTime: 0,
    focusable: true,
    id: 'POP99',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Perfusion of Plague lvl 99',
    origCastTime: 0,
    recastTime: 0,
    resist: 'DISEASE',
    skill: 52,
    target: 'SINGLE',
    timer: 'POP99',
    type3Dmg: 0
  },  
  SOCI: {
    base1: 100,
    baseDmg: 1800,
    castTime: 0,
    focusable: true,
    id: 'SOCI',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Spike of Corruption I',
    origCastTime: 0,
    recastTime: 0,
    resist: 'CORRUPTION',
    skill: 52,
    target: 'SINGLE',
    timer: 'SOCI',
    type3Dmg: 0
  },
  SOCII: {
    base1: 100,
    baseDmg: 2160,
    castTime: 0,
    focusable: true,
    id: 'SOCII',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Spike of Corruption II',
    origCastTime: 0,
    recastTime: 0,
    resist: 'CORRUPTION',
    skill: 52,
    target: 'SINGLE',
    timer: 'SOCII',
    type3Dmg: 0
  },
  SOCV: {
    base1: 100,
    baseDmg: 3240,
    castTime: 0,
    focusable: true,
    id: 'SOCV',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Spike of Corruption V',
    origCastTime: 0,
    recastTime: 0,
    resist: 'CORRUPTION',
    skill: 52,
    target: 'SINGLE',
    timer: 'SOCV',
    type3Dmg: 0
  },
  SOC47: {
    base1: 100,
    baseDmg: 4320,
    castTime: 0,
    focusable: true,
    id: 'SOC47',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Spike of Corruption lvl 47',
    origCastTime: 0,
    recastTime: 0,
    resist: 'CORRUPTION',
    skill: 52,
    target: 'SINGLE',
    timer: 'SOC47',
    type3Dmg: 0
  },  
  SODIX: {
    base1: 100,
    baseDmg: 900,
    castTime: 0,
    focusable: true,
    id: 'SODIX',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Strike of Disease IV',
    origCastTime: 0,
    recastTime: 0,
    resist: 'DISEASE',
    skill: 52,
    target: 'SINGLE',
    timer: 'SODIX',
    type3Dmg: 0
  },
  SOFV: {
    base1: 100,
    baseDmg: 420,
    castTime: 0,
    focusable: true,
    id: 'SOFV',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Strike of Flames V',
    origCastTime: 0,
    recastTime: 0,
    resist: 'FIRE',
    skill: 52,
    target: 'SINGLE',
    timer: 'SOFV',
    type3Dmg: 0
  },
  SOFXIII: {
    base1: 100,
    baseDmg: 1500,
    castTime: 0,
    focusable: true,
    id: 'SOFXIII',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Strike of Flames XIII',
    origCastTime: 0,
    recastTime: 0,
    resist: 'FIRE',
    skill: 52,
    target: 'SINGLE',
    timer: 'SOFXIII',
    type3Dmg: 0
  },
  SOFXIV: {
    base1: 100,
    baseDmg: 1650,
    castTime: 0,
    focusable: true,
    id: 'SOFXIV',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Strike of Flames XIV',
    origCastTime: 0,
    recastTime: 0,
    resist: 'FIRE',
    skill: 52,
    target: 'SINGLE',
    timer: 'SOFXIV',
    type3Dmg: 0
  },
  SOII: {
    base1: 100,
    baseDmg: 5000,
    castTime: 0,
    focusable: true,
    id: 'SOII',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    limitMana: 100,
    name: 'Surge of Ice I',
    origCastTime: 0,
    recastTime: 0,
    resist: 'COLD',
    skill: 52,
    target: 'SINGLE',
    timer: 'SOII',
    type3Dmg: 0
  },    
  SOIII: {
    base1: 100,
    baseDmg: 6000,
    castTime: 0,
    focusable: true,
    id: 'SOIII',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    limitMana: 100,
    name: 'Surge of Ice II',
    origCastTime: 0,
    recastTime: 0,
    resist: 'COLD',
    skill: 52,
    target: 'SINGLE',
    timer: 'SOIII',
    type3Dmg: 0
  },   
  SOIV: {
    base1: 100,
    baseDmg: 9000,
    castTime: 0,
    focusable: true,
    id: 'SOIV',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Surge of Ice V',
    origCastTime: 0,
    recastTime: 0,
    resist: 'COLD',
    skill: 52,
    target: 'SINGLE',
    timer: 'SOIV',
    type3Dmg: 0
  },
  SOI19: {
    base1: 100,
    baseDmg: 2000,
    castTime: 0,
    focusable: true,
    id: 'SOI19',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Spike of Ice lvl 19',
    origCastTime: 0,
    recastTime: 0,
    resist: 'COLD',
    skill: 52,
    target: 'SINGLE',
    timer: 'SOI19',
    type3Dmg: 0
  },  
  SOI21: {
    base1: 100,
    baseDmg: 2200,
    castTime: 0,
    focusable: true,
    id: 'SOI21',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Spike of Ice lvl 21',
    origCastTime: 0,
    recastTime: 0,
    resist: 'COLD',
    skill: 52,
    target: 'SINGLE',
    timer: 'SOI21',
    type3Dmg: 0
  },  
  SOI29: {
    base1: 100,
    baseDmg: 2800,
    castTime: 0,
    focusable: true,
    id: 'SOI29',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Surge of Ice lvl 29',
    origCastTime: 0,
    recastTime: 0,
    resist: 'COLD',
    skill: 52,
    target: 'SINGLE',
    timer: 'SOI29',
    type3Dmg: 0
  },
  SOI99: {
    base1: 100,
    baseDmg: 10000,
    castTime: 0,
    focusable: true,
    id: 'SOI99',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Surge of Ice lvl 99',
    origCastTime: 0,
    recastTime: 0,
    resist: 'COLD',
    skill: 52,
    target: 'SINGLE',
    timer: 'SOI99',
    type3Dmg: 0
  },
  SOI109: {
    base1: 100,
    baseDmg: 11000,
    castTime: 0,
    focusable: true,
    id: 'SOI109',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Surge of Ice lvl 109',
    origCastTime: 0,
    recastTime: 0,
    resist: 'COLD',
    skill: 52,
    target: 'SINGLE',
    timer: 'SOI109',
    type3Dmg: 0
  },  
  SOI129: {
    base1: 100,
    baseDmg: 13000,
    castTime: 0,
    focusable: true,
    id: 'SOI129',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Surge of Ice lvl 129',
    origCastTime: 0,
    recastTime: 0,
    resist: 'COLD',
    skill: 52,
    target: 'SINGLE',
    timer: 'SOI129',
    type3Dmg: 0
  },
  SOM51: {
    base1: 100,
    baseDmg: 5200,
    castTime: 0,
    focusable: true,
    id: 'SOM51',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Spike of Magic lvl 51',
    origCastTime: 0,
    recastTime: 0,
    resist: 'COLD',
    skill: 52,
    target: 'SINGLE',
    timer: 'SOM51',
    type3Dmg: 0
  },
  SOM43: {
    base1: 100,
    baseDmg: 4000,
    castTime: 0,
    focusable: true,
    id: 'SOM43',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Spike of Magic lvl 43',
    origCastTime: 0,
    recastTime: 0,
    resist: 'COLD',
    skill: 52,
    target: 'SINGLE',
    timer: 'SOM43',
    type3Dmg: 0
  },  
  TC: {
    baseDmg: 0,
    beneficial: true,
    castTime: 0,
    focusable: false,
    id: 'TC',
    level: 85,
    lockoutTime: 1500,
    manaCost: 1,
    name: 'Twincast Rk. III',
    origCastTime: 0,
    recastTime: 300000,
    resist: 'NONE',
    skill: 4,
    target: 'SELF',
    timer: 'twincast',
    type3Dmg: 0
  },
  WSYN2: {
    baseDmg: 30000,
    castTime: 0,
    focusable: false,
    id: 'WSYN',
    level: 254,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Evoker\'s Synergy Strike II',
    origCastTime: 0,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 98,
    spellDmgCap: 0,
    target: 'SINGLE',
    timer: 'WSYN'
  },
  WSYN3: {
    baseDmg: 60000,
    castTime: 0,
    focusable: false,
    id: 'WSYN',
    level: 254,
    lockoutTime: 0,
    manaCost: 0,
    name: 'Evoker\'s Synergy Strike III',
    origCastTime: 0,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 98,
    spellDmgCap: 0,
    target: 'SINGLE',
    timer: 'WSYN'
  }  
}

// Dark Shield of the Scholar procs Force of Magic XV so use that for default
// settings
SPELL_DATA.DS = Object.assign({}, SPELL_DATA.FOMXV, {
  castTime: 100,
  id: 'DS',
  inventory: true,
  manaCost: 10,
  name: 'Dark Shield of the Scholar',
  origCastTime: 100,
  skill: 52,
  target: 'SINGLE',
  timer: 'recast-3'
});