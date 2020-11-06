export const globals = {
  VERSION: 'Version 1.953',
  MAX_LEVEL: 115,
  CLASSES: {
    mag: {
      title: 'EQ Mage DPS Tool',
      critRate: 'MAGE_INNATE_CRIT_RATE',
      critDmg: 'MAGE_INNATE_CRIT_DMG',
      cookie: 'mode=mag',
      css: 'mag-only'
    },
    wiz: {
      title: 'EQ Wizard DPS Tool',
      critRate: 'WIZ_INNATE_CRIT_RATE',
      critDmg: 'WIZ_INNATE_CRIT_DMG',
      cookie: 'mode=wiz',
      css: 'wiz-only'
    }
  }
};

// wizard spells to display in spell drop down
export const wizSpellList = [
  'CF', 'CG', 'CS', 'CT', 'ET', 'EB', 'EC', 'EI', 'ES', 'FP', 'FB', 'FBC', 'LF', 'RI', 'SB', 
  'SH', 'SP', 'SR', 'SI', 'TV', 'TW', 'VD', 'WE', 'WS'
];

// mage spells to display in spell drop down
export const magSpellList = [
  'BM', 'BS', 'CC', 'CP', 'FB', 'FBC', 'IS', 'KB', 'RU', 'RM', 'RK', 'RS', 'SH', 'SA', 'SK', 'SM'
];

// enc spells to display in spell drop down
export const encSpellList = [
  'CA', 'CD', 'CS', 'CR', 'GT', 'MT', 'MS', 'MC', 'PA', //'PG'
];

// values need to be strings for HTML dom nodes
export const basicDmgFocusContext = [
  {
    id: 'restless-focus',
    value: '0.1',
    desc: 'Luminous Restless Ice (6/6)',
    data: [
      { value: '0.1', desc: 'Luminous Restless Ice (6/6)' },
      { value: '0.09', desc: 'Luminous Restless Ice (5/6)' },
      { value: '0.07', desc: 'Luminous Restless Ice (4/6)' },
      { value: '0.05', desc: 'Luminous Restless Ice (3/6)' },
      { value: '0.03', desc: 'Luminous Restless Ice (2/6)' },
      { value: '0.01', desc: 'Luminous Restless Ice (1/6)' },
      { value: '0', desc: 'No Luminous Restless Ice Selected' }
    ]
  },
  {
    id: 'eye-decay',
    value: '0.1',
    desc: 'Eyes of Life and Decay (6/6)',
    data: [
      { value: '0.1', desc: 'Eyes of Life and Decay (6/6)' },
      { value: '0.09', desc: 'Eye of Decay (5/6)' },
      { value: '0.07', desc: 'Eye of Decay (4/6)' },
      { value: '0.05', desc: 'Eye of Decay (3/6)' },
      { value: '0.03', desc: 'Eye of Decay (2/6)' },
      { value: '0.01', desc: 'Eye of Decay (1/6)' },
      { value: '0', desc: 'No Eye of Decay Selected' }
    ]
  },
  {
    id: 'wn-type3',
    value: 'true',
    desc: 'Use Relevant Type3 Augs',
    data: [
      { value: 'true', desc: 'Use Relevant Type3 Augs' },
      { value: 'false', desc: 'Use No Type3 Augs' }
    ]
  },
  {
    id: 'wn-fhead',
    value: 'FMAGIC100135',
    desc: 'Hoarfrost/Velium End Cap',
    data: [
      { value: 'FMAGIC100135', desc: 'Hoarfrost/Velium End Cap' },
      { value: 'FMAGIC85123', desc: 'Ice Woven/Velium Emp Cap' },
      { value: 'FMAGIC70120', desc: 'Heavenly/Veiled Cap' },
      { value: 'FMAGIC70', desc: 'Scaleborn Cap' },
      { value: 'FMAGIC75', desc: 'Icebound/Velium Infused Cap' },      
      { value: 'FMAGIC6090', desc: 'Snowbound/Adamant/Battle Cap' },
      { value: 'NONE', desc: 'No Cap Selected' }
    ]
  },
  {
    id: 'wn-fhand',
    value: 'FCOLD100135',
    desc: 'Hoarfrost/Velium End Gloves',
    data: [
      { value: 'FCOLD100135', desc: 'Hoarfrost/Velium End Gloves' },
      { value: 'FCOLD85123', desc: 'Ice Woven/Velium Emp Gloves' },    
      { value: 'FCOLD85123', desc: 'White Platinum Threaded Satin Gloves' },
      { value: 'FCOLD70120', desc: 'Heavenly/Veiled Gloves' },
      { value: 'FCOLD70', desc: 'Scaleborn Gloves' },
      { value: 'FCOLD75', desc: 'Icebound/Velium Infused Cap' },          
      { value: 'FCOLD6090', desc: 'Snowbound/Adamant/Battle Gloves' },
      { value: 'NONE', desc: 'No Gloves Selected' }
    ]
  },
  {
    id: 'wn-farm',
    value: 'FFIRE100135',
    desc: 'Hoarfrost/Velium End Sleeves',
    data: [
      { value: 'FFIRE100135', desc: 'Hoarfrost/Velium End Sleeves' },
      { value: 'FFIRE85123', desc: 'Ice Woven/Velium Emp Sleeves' },
      { value: 'FFIRE70120', desc: 'Heavenly/Veiled Sleeves' },
      { value: 'FFIRE70', desc: 'Scaleborn Sleeves' },
      { value: 'FFIRE75', desc: 'Icebound/Velium Infused Cap' },          
      { value: 'FFIRE6090', desc: 'Snowbound/Adamant/Battle Sleeves' },
      { value: 'NONE', desc: 'No Sleeves Selected' }
    ]
  },
  {
    id: 'wn-fchest',
    value: 'ESD9',
    desc: 'Ice Woven/Velium Emp Robe',
    data: [
      { value: 'ESD9', desc: 'Ice Woven/Velium Emp Robe' },    
      { value: 'OESD9', desc: 'Heavenly/Veiled Robe' },
      { value: 'OESD9', desc: 'Scaleborn Robe' },
      { value: 'ESD7', desc: 'Snowbound Robe' },
      { value: 'OESD7', desc: 'Adamant/Battle Robe' },
      { value: 'NONE', desc: 'No Robe Selected' }
    ]
  },
  {
    id: 'armor-proc1',
    value: 'NONE',
    desc: 'No TBL Type 19 Aug Selected',
    data: [
      { value: 'EBOFVIII', desc: 'Blazing Euphoria Casting Fire' },
      { value: 'ESOMVIII', desc: 'Blazing Euphoria Casting Magic' },
      { value: 'NONE', desc: 'No TBL Type 19 Aug Selected' }
    ]
  },
  {
    id: 'armor-proc2',
    value: 'NONE',
    desc: 'No TBL Type 18 Aug Selected',
    data: [
      { value: 'EBOFV', desc: 'Whispering Midnight Casting Fire' },
      { value: 'ESOMV', desc: 'Whispering Midnight Casting Magic' },
      { value: 'NONE', desc: 'No TBL Type 18 Aug Selected' }
    ]
  },
  {
    id: 'armor-proc3',
    value: 'NONE',
    desc: 'No ToV Type 19 Aug Selected',
    data: [
      { value: 'SOIII', desc: 'Rallos Zek Devotee\'s Casting Ice' },
      { value: 'NONE', desc: 'No ToV Type 19 Aug Selected' }
    ]
  },
  {
    id: 'armor-proc4',
    value: 'NONE',
    desc: 'No ToV Type 18 Aug Selected',
    data: [
      { value: 'SOII', desc: 'Rallos Zek Acolyte\'s Casting Ice' },
      { value: 'NONE', desc: 'No ToV Type 18 Aug Selected' }
    ]
  },  
  {
    id: 'armor-proc5',
    value: 'NONE',
    desc: 'No ToV Type 7 Armor Aug Selected',
    data: [
      { value: 'SOI19', desc: 'Velium Empowered Gem of Freezing' },
      { value: 'NONE', desc: 'No ToV Type 7 Armor Aug Selected' }
    ]
  },  
  {
    id: 'staff-proc',
    value: 'NONE',
    desc: 'No Weapon Selected',
    data: [
      { value: 'SOI129', desc: 'Velium Enhanced Arcane Staff' },
      { value: 'BOFVIII', desc: 'Ascending Sun Arcane Staff / Heavy Onyx' },
      { value: 'HOMVII', desc: 'Rod of Ri`zyr' },
      { value: 'SOI109', desc: 'Velium Infused Arcane Staff / T2 Group' },      
      { value: 'SOI99', desc: 'ToV T1 Group' },
      { value: 'POP99', desc: 'Premier Staff' },
      { value: 'BFVI', desc: 'Nightfear\'s Halo / Bloodstaff' },
      { value: 'SOIV', desc: 'Mute Spiral / Fathomless Staff' },
      { value: 'SOM51', desc: 'Velium Enhanced Wand / T1 Raid' },      
      { value: 'SOC47', desc: 'Ascending Sun Bodkin / Deep Cavern' },
      { value: 'SOM43', desc: 'Velium Infused Wand / T2 Group' },        
      { value: 'BOFVII', desc: 'Shissar Arcanist\'s Stylet' },
      { value: 'BOFVI', desc: 'Crystal Misericorde' },
      { value: 'SOCV', desc: 'Eldritch Misericorde' },
      { value: 'NONE', desc: 'No Primary Weapon Selected' }
    ]
  },
  {
    id: 'shield-proc',
    value: 'NONE',
    desc: 'No Secondary Item Selected',
    data: [
      { value: 'OS', desc: 'Tome of Obulous' },
      { value: 'NONE', desc: 'No Secondary Item Selected' }
    ]
  },
  {
    id: 'belt-proc',
    value: 'NONE',
    desc: 'No Belt Selected',
    data: [
      { value: 'FCX', desc: 'Runed Belt of Boromas' },
      { value: 'THREADSP', desc: 'Velium Threaded Girdle (Threads)' },
      { value: 'SEERS', desc: 'Crystalline Buckle (Seers)' },
      { value: 'NONE', desc: 'No Belt Selected' }
    ]
  },
  {
    id: 'dps-aug1',
    value: 'NONE',
    desc: 'No Additional Aug1 Selected',
    data: [
      { value: 'SOI29', desc: 'Complimentary Gem of Devestation' },
      { value: 'SOCII', desc: 'Elemental Curio of Ondine Force' },
      { value: 'SOCI', desc: 'Elemental Gem of Stone' },
      { value: 'BOIX', desc: 'Bone Shards of Frozen Marrow' },
      { value: 'FOMIX', desc: 'Ancient Diamond Spellcharm' },
      { value: 'SODIX', desc: 'Exotic Gem' },
      { value: 'FOMVII', desc: 'Tempest Magic' },
      { value: 'FCVII', desc: 'The Heart of Narikor' },
      { value: 'SOFV', desc: 'Spirit of the Gorgon' },
      { value: 'NONE', desc: 'No Additional Aug2 Selected' }
    ]
  },
  {
    id: 'dps-aug2',
    value: 'NONE',
    desc: 'No Additional Aug2 Selected',
    data: [
      { value: 'SOI29', desc: 'Complimentary Gem of Devestation' },
      { value: 'SOCII', desc: 'Elemental Curio of Ondine Force' },
      { value: 'SOCI', desc: 'Elemental Gem of Stone' },
      { value: 'BOIX', desc: 'Bone Shards of Frozen Marrow' },
      { value: 'FOMIX', desc: 'Ancient Diamond Spellcharm' },
      { value: 'SODIX', desc: 'Exotic Gem' },
      { value: 'FOMVII', desc: 'Tempest Magic' },
      { value: 'FCVII', desc: 'The Heart of Narikor' },
      { value: 'SOFV', desc: 'Spirit of the Gorgon' },
      { value: 'NONE', desc: 'No Additional Aug2 Selected' }
    ]
  },
  {
    id: 'range-aug',
    value: 'NONE',
    desc: 'No Range Aug Selected',
    data: [
      { value: 'SOI21', desc: 'Complimentary Velium Gem of Striking' },
      { value: 'FSVI', desc: 'Sodkee\'s Sympathetic Stone' },
      { value: 'FZVI', desc: 'Nra`Vruu\'s Sympathetic Stone' },
      { value: 'ASVI', desc: 'SaNril\'s Sympathetic Stone' },
      { value: 'NONE', desc: 'No Range Aug Selected' }
    ]
  }
];

export const wizSpellFocusAAContext = [
  {
    id: 'aa-wsyn',
    value: '13',
    desc: 'Evoker\'s Synergy (13/13)',
    data: [
      { value: '13', desc: 'Evoker\'s Synergy (13/13)' },
      { value: '0', desc: 'Evoker\'s Synergy (0/13)' }
    ]
  },
  {
    id: 'aa-beams',
    value: '15',
    desc: 'Beams (15/15)',
    data: [
      { value: '15', desc: 'Beams (15/15)' },
      { value: '14', desc: 'Beams (14/15)' },
      { value: '13', desc: 'Beams (13/15)' },
      { value: '12', desc: 'Beams (12/15)' },
      { value: '0', desc: 'Beams (0/15)' }
    ]
  },
  {
    id: 'aa-chaos',
    value: '15',
    desc: 'Chaos Scintillation (15/15)',
    data: [
      { value: '15', desc: 'Chaos Scintillation (15/15)' },
      { value: '14', desc: 'Chaos Scintillation (14/15)' },
      { value: '13', desc: 'Chaos Scintillation (13/15)' },
      { value: '12', desc: 'Chaos Scintillation (12/15)' },
      { value: '0', desc: 'Chaos Scintillation (0/15)' }
    ]
  },
  {
    id: 'aa-claws',
    value: '15',
    desc: 'Claws (15/15)',
    data: [
      { value: '15', desc: 'Claws (15/15)' },
      { value: '14', desc: 'Claws (14/15)' },
      { value: '13', desc: 'Claws (13/15)' },
      { value: '12', desc: 'Claws (12/15)' },
      { value: '0', desc: 'Claws (0/15)' }
    ]
  },
  {
    id: 'aa-cloudb',
    value: '15',
    desc: 'Cloudburst Stormstrike (15/15)',
    data: [
      { value: '15', desc: 'Cloudburst Stormstrike (15/15)' },
      { value: '14', desc: 'Cloudburst Stormstrike (14/15)' },
      { value: '13', desc: 'Cloudburst Stormstrike (13/15)' },
      { value: '12', desc: 'Cloudburst Stormstrike (12/15)' },
      { value: '0', desc: 'Cloudburst Stormstrike (0/15)' }
    ]
  },
  {
    id: 'aa-corona',
    value: '15',
    desc: 'Corona of Flame (15/15)',
    data: [
      { value: '15', desc: 'Corona of Flame (15/15)' },
      { value: '14', desc: 'Corona of Flame (14/15)' },
      { value: '13', desc: 'Corona of Flame (13/15)' },
      { value: '12', desc: 'Corona of Flame (12/15)' },
      { value: '0', desc: 'Corona of Flame (0/15)' }
    ]
  },
  {
    id: 'aa-eflash',
    value: '15',
    desc: 'Ethereal Flash (15/15)',
    data: [
      { value: '15', desc: 'Ethereal Flash (15/15)' },
      { value: '14', desc: 'Ethereal Flash (14/15)' },
      { value: '13', desc: 'Ethereal Flash (13/15)' },
      { value: '12', desc: 'Ethereal Flash (12/15)' },
      { value: '0', desc: 'Ethereal Flash (0/15)' }
    ]
  },
  {
    id: 'aa-erime',
    value: '15',
    desc: 'Ethereal Rimeblast (15/15)',
    data: [
      { value: '15', desc: 'Ethereal Rimeblast (15/15)' },
      { value: '14', desc: 'Ethereal Rimeblast (14/15)' },
      { value: '13', desc: 'Ethereal Rimeblast (13/15)' },
      { value: '12', desc: 'Ethereal Rimeblast (12/15)' },
      { value: '11', desc: 'Ethereal Rimeblast (11/15)' },
      { value: '10', desc: 'Ethereal Rimeblast (10/15)' },
      { value: '9', desc: 'Ethereal Rimeblast (9/15)' },
      { value: '0', desc: 'Ethereal Rimeblast (0/15)' }
    ]
  },
  {
    id: 'aa-eblaze',
    value: '15',
    desc: 'Ethereal Skyblaze (15/15)',
    data: [
      { value: '15', desc: 'Ethereal Skyblaze (15/15)' },
      { value: '14', desc: 'Ethereal Skyblaze (14/15)' },
      { value: '13', desc: 'Ethereal Skyblaze (13/15)' },
      { value: '12', desc: 'Ethereal Skyblaze (12/15)' },
      { value: '11', desc: 'Ethereal Skyblaze (11/15)' },
      { value: '10', desc: 'Ethereal Skyblaze (10/15)' },
      { value: '9', desc: 'Ethereal Skyblaze (9/15)' },
      { value: '0', desc: 'Ethereal Skyblaze (0/15)' }
    ]
  },
  {
    id: 'aa-flashchar',
    value: '15',
    desc: 'Flashchar (15/15)',
    data: [
      { value: '15', desc: 'Flashchar (15/15)' },
      { value: '14', desc: 'Flashchar (14/15)' },
      { value: '13', desc: 'Flashchar (13/15)' },
      { value: '12', desc: 'Flashchar (12/15)' },
      { value: '0', desc: 'Flashchar (0/15)' }
    ]
  },
  {
    id: 'aa-pills',
    value: '15',
    desc: 'Pillars (15/15)',
    data: [
      { value: '15', desc: 'Pillars (15/15)' },
      { value: '14', desc: 'Pillars (14/15)' },
      { value: '13', desc: 'Pillars (13/15)' },
      { value: '12', desc: 'Pillars (12/15)' },
      { value: '0', desc: 'Pillars (0/15)' },
    ]
  },
  {
    id: 'aa-pure',
    value: '15',
    desc: 'Pure Wildflash (15/15)',
    data: [
      { value: '15', desc: 'Pure Wildflash (15/15)' },
      { value: '14', desc: 'Pure Wildflash (14/15)' },
      { value: '13', desc: 'Pure Wildflash (13/15)' },
      { value: '12', desc: 'Pure Wildflash (12/15)' },
      { value: '0', desc: 'Pure Wildflash (0/15)' }
    ]
  },
  {
    id: 'aa-rains',
    value: '15',
    desc: 'Rains (15/15)',
    data: [
      { value: '15', desc: 'Rains (15/15)' },
      { value: '14', desc: 'Rains (14/15)' },
      { value: '13', desc: 'Rains (13/15)' },
      { value: '12', desc: 'Rains (12/15)' },
      { value: '0', desc: 'Rains (0/15)' }
    ]
  },
  {
    id: 'aa-rimeb',
    value: '15',
    desc: 'Rimeblast Cascade (15/15)',
    data: [
      { value: '15', desc: 'Rimeblast Cascade (15/15)' },
      { value: '14', desc: 'Rimeblast Cascade (14/15)' },
      { value: '13', desc: 'Rimeblast Cascade (13/15)' },
      { value: '12', desc: 'Rimeblast Cascade (12/15)' },
      { value: '0', desc: 'Rimeblast Cascade (0/15)' }
    ]
  },
  {
    id: 'aa-selfc',
    value: '15',
    desc: 'Self-Combustion (14/14)',
    data: [
      { value: '15', desc: 'Self-Combustion (14/14)' },
      { value: '14', desc: 'Self-Combustion (13/14)' },
      { value: '0', desc: 'Self-Combustion (0/14)' }
    ]
  },
  {
    id: 'aa-vortex',
    value: '15',
    desc: 'Vortexes (14/14)',
    data: [
      { value: '15', desc: 'Vortexes (14/14)' },
      { value: '14', desc: 'Vortexes (13/14)' },
      { value: '0', desc: 'Vortexes (0/14)' }
    ]
  }
];

export const magSpellFocusAAContext = [
  {
    id: 'aa-msyn',
    value: '12',
    desc: 'Conjurer\'s Synergy (12/12)',
    data: [
      { value: '12', desc: 'Conjurer\'s Synergy (12/12)' },
      { value: '0', desc: 'Conjurer\'s Synergy (0/12)' }
    ]
  },
  {
    id: 'aa-beam-molten',
    value: '15',
    desc: 'Beam of Molten Shieldstone (15/15)',
    data: [
      { value: '15', desc: 'Beam of Molten Shieldstone (15/15)' },
      { value: '14', desc: 'Beam of Molten Shieldstone (14/15)' },
      { value: '13', desc: 'Beam of Molten Shieldstone (13/15)' },
      { value: '12', desc: 'Beam of Molten Shieldstone (12/15)' },
      { value: '0', desc: 'Beam of Molten Shieldstone (0/15)' },
    ]
  },
  {
    id: 'aa-beam-scythes',
    value: '15',
    desc: 'Beam of Scythes (15/15)',
    data: [
      { value: '15', desc: 'Beam of Scythes (15/15)' },
      { value: '14', desc: 'Beam of Scythes (14/15)' },
      { value: '13', desc: 'Beam of Scythes (13/15)' },
      { value: '12', desc: 'Beam of Scythes (12/15)' },
      { value: '0', desc: 'Beam of Scythes (0/15)' },
    ]
  },
  {
    id: 'aa-capricious',
    value: '15',
    desc: 'Capricious Fire (14/14)',
    data: [
      { value: '15', desc: 'Capricious Fire (14/14)' },
      { value: '14', desc: 'Capricious Fire (13/14)' },
      { value: '13', desc: 'Capricious Fire (12/14)' },
      { value: '12', desc: 'Capricious Fire (11/14)' },
      { value: '11', desc: 'Capricious Fire (10/14)' },
      { value: '10', desc: 'Capricious Fire (9/14)' },
      { value: '0', desc: 'Capricious Fire (0/14)' },
    ]
  },
  {
    id: 'aa-coronal',
    value: '15',
    desc: 'Coronal Rain (15/15)',
    data: [
      { value: '15', desc: 'Coronal Rain (15/15)' },
      { value: '14', desc: 'Coronal Rain (14/15)' },
      { value: '13', desc: 'Coronal Rain (13/15)' },
      { value: '12', desc: 'Coronal Rain (12/15)' },
      { value: '0', desc: 'Coronal Rain (0/15)' }
    ]
  },
  {
    id: 'aa-eradun',
    value: '15',
    desc: 'Eradicate the Unnatural (15/15)',
    data: [
      { value: '15', desc: 'Eradicate the Unnatural (15/15)' },
      { value: '14', desc: 'Eradicate the Unnatural (14/15)' },
      { value: '13', desc: 'Eradicate the Unnatural (13/13)' },
      { value: '12', desc: 'Eradicate the Unnatural (12/13)' },
      { value: '0', desc: 'Eradicate the Unnatural (0/13)' }
    ]
  },
  {
    id: 'aa-flames-pwr',
    value: '7',
    desc: 'Flames of Power (7/7)',
    data: [
      { value: '7', desc: 'Flames of Power (7/7)' },
      { value: '6', desc: 'Flames of Power (6/7)' },
      { value: '5', desc: 'Flames of Power (5/7)' },
      { value: '4', desc: 'Flames of Power (4/7)' },
      { value: '0', desc: 'Flames of Power (0/7)' }
    ]
  },
  {
    id: 'aa-servant',
    value: '6',
    desc: 'Hastened Raging Servant (3/3)',
    data: [
      { value: '6', desc: 'Hastened Raging Servant (3/3)' },
      { value: '4', desc: 'Hastened Raging Servant (2/3)' },
      { value: '2', desc: 'Hastened Raging Servant (1/3)' },
      { value: '0', desc: 'Hastened Raging Servant (0/3)' }
    ]
  },
  {
    id: 'aa-meteor',
    value: '15',
    desc: 'Meteoric Bolt (14/14)',
    data: [
      { value: '15', desc: 'Meteoric Bolt (14/14)' },
      { value: '14', desc: 'Meteoric Bolt (13/14)' },
      { value: '13', desc: 'Meteoric Bolt (12/14)' },
      { value: '12', desc: 'Meteoric Bolt (11/14)' },
      { value: '11', desc: 'Meteoric Bolt (10/14)' },
      { value: '10', desc: 'Meteoric Bolt (9/14)' },
      { value: '0', desc: 'Meteoric Bolt (0/13)' },
    ]
  },  
  {
    id: 'aa-raincut',
    value: '15',
    desc: 'Rain of Cutlasses (15/15)',
    data: [
      { value: '15', desc: 'Rain of Cutlasses (15/15)' },
      { value: '14', desc: 'Rain of Cutlasses (14/15)' },
      { value: '13', desc: 'Rain of Cutlasses (13/15)' },
      { value: '12', desc: 'Rain of Cutlasses (12/15)' },
      { value: '0', desc: 'Rain of Cutlasses (0/15)' },
    ]
  },  
  {
    id: 'aa-sear',
    value: '15',
    desc: 'Searing Blast (15/15)',
    data: [
      { value: '15', desc: 'Searing Blast (15/15)' },
      { value: '14', desc: 'Searing Blast (14/15)' },
      { value: '13', desc: 'Searing Blast (13/15)' },
      { value: '12', desc: 'Searing Blast (12/15)' },
      { value: '0', desc: 'Searing Blast (0/15)' }
    ]
  },
  {
    id: 'aa-sands',
    value: '15',
    desc: 'Searing Sands (15/15)',
    data: [
      { value: '15', desc: 'Searing Sands (15/15)' },
      { value: '14', desc: 'Searing Sands (14/15)' },
      { value: '13', desc: 'Searing Sands (13/15)' },
      { value: '12', desc: 'Searing Sands (12/15)' },
      { value: '0', desc: 'Searing Sands (0/15)' }
    ]
  },  
  {
    id: 'aa-shockd',
    value: '15',
    desc: 'Shock of Darksteel  (15/15)',
    data: [
      { value: '15', desc: 'Shock of Darksteel (15/15)' },
      { value: '14', desc: 'Shock of Darksteel (14/15)' },
      { value: '13', desc: 'Shock of Darksteel (13/15)' },
      { value: '12', desc: 'Shock of Darksteel (12/15)' },
      { value: '0', desc: 'Shock of Darksteel (0/15)' },
    ]
  },
  {
    id: 'aa-spearm',
    value: '15',
    desc: 'Spear of Molten Shieldstone (15/15)',
    data: [
      { value: '15', desc: 'Spear of Molten Shieldstone (15/15)' },
      { value: '14', desc: 'Spear of Molten Shieldstone (14/15)' },
      { value: '13', desc: 'Spear of Molten Shieldstone (13/15)' },
      { value: '12', desc: 'Spear of Molten Shieldstone (12/15)' },
      { value: '11', desc: 'Spear of Molten Shieldstone (11/15)' },
      { value: '10', desc: 'Spear of Molten Shieldstone (10/15)' },
      { value: '9', desc: 'Spear of Molten Shieldstone (9/15)' },
      { value: '0', desc: 'Spear of Molten Shieldstone (0/15)' }
    ]
  },
  {
    id: 'aa-storm',
    value: '15',
    desc: 'Storm of Many (15/15)',
    data: [
      { value: '15', desc: 'Storm of Many (15/15)' },
      { value: '14', desc: 'Storm of Many (14/15)' },
      { value: '13', desc: 'Storm of Many (13/15)' },
      { value: '12', desc: 'Storm of Many (12/15)' },
      { value: '0', desc: 'Storm of Many (0/15)' }
    ]
  }
];

export const encSpellFocusAAContext = [
  {
    id: 'aa-esyn',
    value: '12',
    desc: 'Beguiler\'s Synergy (12/12)',
    data: [
      { value: '12', desc: 'Beguiler\'s Synergy (12/12)' },
      { value: '11', desc: 'Beguiler\'s Synergy (11/12)' },
      { value: '0', desc: 'Beguiler\'s Synergy (0/12)' }
    ]
  },
  {
    id: 'aa-chromarift',
    value: '13',
    desc: 'Chromarift (13/13)',
    data: [
      { value: '13', desc: 'Chromarift (13/13)' },
      { value: '12', desc: 'Chromarift (12/13)' },
      { value: '0', desc: 'Chromarift (0/13)' }
    ]
  },
  {
    id: 'aa-chromablink',
    value: '13',
    desc: 'Chromatic Blink (13/13)',
    data: [
      { value: '13', desc: 'Chromatic Blink (13/13)' },
      { value: '12', desc: 'Chromatic Blink (12/13)' },
      { value: '0', desc: 'Chromatic Blink (0/13)' }
    ]
  },
  {
    id: 'aa-gravity-twist',
    value: '13',
    desc: 'Gravity Twist (13/13)',
    data: [
      { value: '13', desc: 'Gravity Twist (13/13)' },
      { value: '12', desc: 'Gravity Twist (12/13)' },
      { value: '11', desc: 'Gravity Twist (11/13)' },
      { value: '10', desc: 'Gravity Twist (10/13)' },
      { value: '9', desc: 'Gravity Twist (9/13)' },
      { value: '0', desc: 'Gravity Twist (0/13)' }
    ]
  },
  {
    id: 'aa-mindsunder',
    value: '13',
    desc: 'Mindsunder (13/13)',
    data: [
      { value: '13', desc: 'Mindsunder (13/13)' },
      { value: '12', desc: 'Mindsunder (12/13)' },
      { value: '11', desc: 'Mindsunder (11/13)' },
      { value: '10', desc: 'Mindsunder (10/13)' },
      { value: '9', desc: 'Mindsunder (9/13)' },
      { value: '0', desc: 'Mindsunder (0/13)' }
    ]
  },
  {
    id: 'aa-poly-ass',
    value: '13',
    desc: 'Polyrefractive Assault (13/13)',
    data: [
      { value: '13', desc: 'Polyrefractive Assault (13/13)' },
      { value: '12', desc: 'Polyrefractive Assault (12/13)' },
      { value: '0', desc: 'Polyrefractive Assault (0/13)' }
    ]
  }
];

export const wizDPSAAContext = [
  {
    id: 'aa-afusion',
    value: 'AFU6',
    desc: 'Arcane Fusion (6/6)',
    data: [
      { value: 'AFU6', desc: 'Arcane Fusion (6/6)' },
      { value: 'AFU5', desc: 'Arcane Fusion (5/6)' },
      { value: 'AFU4', desc: 'Arcane Fusion (4/6)' },
      { value: 'AFU3', desc: 'Arcane Fusion (3/6)' },
      { value: 'AFU2', desc: 'Arcane Fusion (2/6)' },
      { value: 'AFU1', desc: 'Arcane Fusion (1/6)' },
      { value: 'NONE', desc: 'Arcane Fusion (0/6)' }
    ]
  },
  {
    id: 'aa-dadept',
    value: '0.10',
    desc: 'Destructive Adept (10/10)',
    data: [
      { value: '0.10', desc: 'Destructive Adept (10/10)' },
      { value: '0.09', desc: 'Destructive Adept (9/10)' },
      { value: '0.08', desc: 'Destructive Adept (8/10)' },
      { value: '0.07', desc: 'Destructive Adept (7/10)' },
      { value: '0.06', desc: 'Destructive Adept (6/10)' },
      { value: '0.05', desc: 'Destructive Adept (5/10)' },
      { value: '0.04', desc: 'Destructive Adept (4/10)' },
      { value: '0.03', desc: 'Destructive Adept (3/10)' },
      { value: '0.02', desc: 'Destructive Adept (2/10)' },
      { value: '0.01', desc: 'Destructive Adept (1/10)' },
      { value: '0', desc: 'Destructive Adept (0/10)' }
    ]
  },
  {
    id: 'aa-destfury',
    value: '340',
    desc: 'Destructive Fury (39/39)',
    data: [
      { value: '340', desc: 'Destructive Fury (39/39)' },
      { value: '335', desc: 'Destructive Fury (38/39)' },
      { value: '330', desc: 'Destructive Fury (37/39)' },
      { value: '325', desc: 'Destructive Fury (36/39)' },
      { value: '320', desc: 'Destructive Fury (35/39)' },
      { value: '315', desc: 'Destructive Fury (34/39)' },
      { value: '310', desc: 'Destructive Fury (33/39)' },
      { value: '300', desc: 'Destructive Fury (32/39)' },
      { value: '290', desc: 'Destructive Fury (31/39)' },
      { value: '280', desc: 'Destructive Fury (30/39)' },
      { value: '278', desc: 'Destructive Fury (29/39)' },
      { value: '276', desc: 'Destructive Fury (28/39)' },
      { value: '274', desc: 'Destructive Fury (27/39)' },
      { value: '264', desc: 'Destructive Fury (26/39)' },
      { value: '254', desc: 'Destructive Fury (25/39)' },
      { value: '249', desc: 'Destructive Fury (24/39)' },
      { value: '242', desc: 'Destructive Fury (23/39)' },
      { value: '235', desc: 'Destructive Fury (22/39)' },
      { value: '228', desc: 'Destructive Fury (21/39)' },
      { value: '221', desc: 'Destructive Fury (20/39)' },
      { value: '214', desc: 'Destructive Fury (19/39)' },
      { value: '207', desc: 'Destructive Fury (18/39)' },
      { value: '200', desc: 'Destructive Fury (17/39)' },
      { value: '193', desc: 'Destructive Fury (16/39)' },
      { value: '186', desc: 'Destructive Fury (15/39)' },
      { value: '179', desc: 'Destructive Fury (14/39)' },
      { value: '172', desc: 'Destructive Fury (13/39)' },
      { value: '165', desc: 'Destructive Fury (12/39)' },
      { value: '160', desc: 'Destructive Fury (11/39)' },
      { value: '155', desc: 'Destructive Fury (10/39)' },
      { value: '150', desc: 'Destructive Fury (9/39)' },
      { value: '141', desc: 'Destructive Fury (8/39)' },
      { value: '133', desc: 'Destructive Fury (7/39)' },
      { value: '125', desc: 'Destructive Fury (6/39)' },
      { value: '115', desc: 'Destructive Fury (5/39)' },
      { value: '107', desc: 'Destructive Fury (4/39)' },
      { value: '100', desc: 'Destructive Fury (3/39)' },
      { value: '60', desc: 'Destructive Fury (2/39)' },
      { value: '30', desc: 'Destructive Fury (1/39)' },
      { value: '0', desc: 'Destructive Fury (0/39)' }
    ]
  },
  {
    id: 'aa-don',
    value: '1',
    desc: 'Dark Reign/Keepers DoN (5/5)',
    data: [
      { value: '1', desc: 'Dark Reign/Keepers DoN (5/5)' },
      { value: '1', desc: 'Dark Reign/Keepers DoN (4/5)' },
      { value: '0', desc: 'Dark Reign/Keepers DoN (3/5)' },
      { value: '0', desc: 'Dark Reign/Keepers DoN (2/5)' },
      { value: '0', desc: 'Dark Reign/Keepers DoN (1/5)' },
      { value: '0', desc: 'Dark Reign/Keepers DoN (0/5)' }
    ]
  },
  {
    id: 'aa-forceflame',
    value: 'FF12',
    desc: 'Force of Flame (12/12)',
    data: [
      { value: 'FF12', desc: 'Force of Flame (12/12)' },
      { value: 'FF11', desc: 'Force of Flame (11/12)' },
      { value: 'FF10', desc: 'Force of Flame (10/12)' },
      { value: 'FF9', desc: 'Force of Flame (9/12)' },
      { value: 'FF8', desc: 'Force of Flame (8/12)' },
      { value: 'FF7', desc: 'Force of Flame (7/12)' },
      { value: 'FF6', desc: 'Force of Flame (6/12)' },
      { value: 'FF5', desc: 'Force of Flame (5/12)' },
      { value: 'FF4', desc: 'Force of Flame (4/12)' }
    ]
  },
  {
    id: 'aa-forceice',
    value: 'FI12',
    desc: 'Force of Ice (12/12)',
    data: [
      { value: 'FI12', desc: 'Force of Ice (12/12)' },
      { value: 'FI11', desc: 'Force of Ice (11/12)' },
      { value: 'FI10', desc: 'Force of Ice (10/12)' },
      { value: 'FI9', desc: 'Force of Ice (9/12)' },
      { value: 'FI8', desc: 'Force of Ice (8/12)' },
      { value: 'FI7', desc: 'Force of Ice (7/12)' },
      { value: 'FI6', desc: 'Force of Ice (6/12)' },
      { value: 'FI5', desc: 'Force of Ice (5/12)' },
      { value: 'FI4', desc: 'Force of Ice (4/12)' }
    ]
  },
  {
    id: 'aa-forcewill',
    value: 'FW32',
    desc: 'Force of Will (32/32)',
    data: [
      { value: 'FW32', desc: 'Force of Will (32/32)' },
      { value: 'FW31', desc: 'Force of Will (31/32)' },
      { value: 'FW30', desc: 'Force of Will (30/32)' },
      { value: 'FW29', desc: 'Force of Will (29/32)' },
      { value: 'FW28', desc: 'Force of Will (28/32)' },
      { value: 'FW27', desc: 'Force of Will (27/32)' },
      { value: 'FW26', desc: 'Force of Will (26/32)' },
      { value: 'FW25', desc: 'Force of Will (25/32)' },
      { value: 'FW24', desc: 'Force of Will (24/32)' }
    ]
  },
  {
    id: 'aa-furymagic',
    value: '50',
    desc: 'Fury of Magic (35/35)',
    data: [
      { value: '50', desc: 'Fury of Magic (35/35)' },
      { value: '49', desc: 'Fury of Magic (34/35)' },
      { value: '47', desc: 'Fury of Magic (33/35)' },
      { value: '45', desc: 'Fury of Magic (32/35)' },
      { value: '43', desc: 'Fury of Magic (31/35)' },
      { value: '41', desc: 'Fury of Magic (30/35)' },
      { value: '39', desc: 'Fury of Magic (29/35)' },
      { value: '38', desc: 'Fury of Magic (28/35)' },
      { value: '37', desc: 'Fury of Magic (27/35)' },
      { value: '36', desc: 'Fury of Magic (26/35)' },
      { value: '35', desc: 'Fury of Magic (25/35)' },
      { value: '34', desc: 'Fury of Magic (24/35)' },
      { value: '33', desc: 'Fury of Magic (23/35)' },
      { value: '32', desc: 'Fury of Magic (22/35)' },
      { value: '31', desc: 'Fury of Magic (21/35)' },
      { value: '30', desc: 'Fury of Magic (20/35)' },
      { value: '29', desc: 'Fury of Magic (19/35)' },
      { value: '28', desc: 'Fury of Magic (18/35)' },
      { value: '27', desc: 'Fury of Magic (17/35)' },
      { value: '26', desc: 'Fury of Magic (16/35)' },
      { value: '25', desc: 'Fury of Magic (15/35)' },
      { value: '24', desc: 'Fury of Magic (14/35)' },
      { value: '22', desc: 'Fury of Magic (13/35)' },
      { value: '20', desc: 'Fury of Magic (12/35)' },
      { value: '18', desc: 'Fury of Magic (11/35)' },
      { value: '17', desc: 'Fury of Magic (10/35)' },
      { value: '16', desc: 'Fury of Magic (9/35)' },
      { value: '15', desc: 'Fury of Magic (8/35)' },
      { value: '14', desc: 'Fury of Magic (7/35)' },
      { value: '13', desc: 'Fury of Magic (6/35)' },
      { value: '11', desc: 'Fury of Magic (5/35)' },
      { value: '9', desc: 'Fury of Magic (4/35)' },
      { value: '7', desc: 'Fury of Magic (3/35)' },
      { value: '4', desc: 'Fury of Magic (2/35)' },
      { value: '2', desc: 'Fury of Magic (1/35)' },
      { value: '0', desc: 'Fury of Magic (0/35)' }
    ]
  },
  {
    id: 'spell-pet-focus',
    value: 'IMPF',
    desc: 'Improved Familiar (30)',
    data: [
      { value: 'IMPF', desc: 'Improved Familiar (30)' },
      { value: '', desc: 'No Familiar Selected' }
    ]
  },
  {
    id: 'aa-sveng',
    value: '7000',
    desc: 'Sorcerer\'s Vengeance (30/30)',
    data: [
      { value: '7000', desc: 'Sorcerer\'s Vengeance (30/30)' },
      { value: '6700', desc: 'Sorcerer\'s Vengeance (29/30)' },
      { value: '6400', desc: 'Sorcerer\'s Vengeance (28/30)' },
      { value: '6100', desc: 'Sorcerer\'s Vengeance (27/30)' },
      { value: '5800', desc: 'Sorcerer\'s Vengeance (26/30)' },
      { value: '5500', desc: 'Sorcerer\'s Vengeance (25/30)' },
      { value: '5200', desc: 'Sorcerer\'s Vengeance (24/30)' },
      { value: '4900', desc: 'Sorcerer\'s Vengeance (23/30)' },
      { value: '4600', desc: 'Sorcerer\'s Vengeance (22/30)' },
      { value: '4300', desc: 'Sorcerer\'s Vengeance (21/30)' },
      { value: '4000', desc: 'Sorcerer\'s Vengeance (20/30)' },
      { value: '3650', desc: 'Sorcerer\'s Vengeance (19/30)' },
      { value: '3375', desc: 'Sorcerer\'s Vengeance (18/30)' },
      { value: '3100', desc: 'Sorcerer\'s Vengeance (17/30)' },
      { value: '2825', desc: 'Sorcerer\'s Vengeance (16/30)' },
      { value: '2550', desc: 'Sorcerer\'s Vengeance (15/30)' },
      { value: '2275', desc: 'Sorcerer\'s Vengeance (14/30)' },
      { value: '2000', desc: 'Sorcerer\'s Vengeance (13/30)' },
      { value: '1800', desc: 'Sorcerer\'s Vengeance (12/30)' },
      { value: '1600', desc: 'Sorcerer\'s Vengeance (11/30)' },
      { value: '1400', desc: 'Sorcerer\'s Vengeance (10/30)' },
      { value: '0', desc: 'Sorcerer\'s Vengeance (0/30)' }
    ]
  },
  {
    id: 'aa-trif',
    value: 'TRIF',
    desc: 'Trifurcating Magic XXX (60)',
    data: [
      { value: 'TRIF', desc: 'Trifurcating Magic XXX (60)' },
      { value: '', desc: 'Trifurcating Magic (0/60)' }
    ]
  },  
  {
    id: 'aa-twincast',
    value: '0.05',
    desc: 'Twincast (5/5)',
    data: [
      { value: '0.05', desc: 'Twincast (5/5)' },
      { value: '0.04', desc: 'Twincast (4/5)' },
      { value: '0.03', desc: 'Twincast (3/5)' },
      { value: '0.02', desc: 'Twincast (2/5)' },
      { value: '0.01', desc: 'Twincast (1/5)' },
      { value: '0', desc: 'Twincast (0/5)' }
    ]
  },
  {
    id: 'aa-twinproc',
    value: '0.21',
    desc: 'Twinproc (9/9)',
    data: [
      { value: '0.21', desc: 'Twinproc (9/9)' },
      { value: '0.20', desc: 'Twinproc (8/9)' },
      { value: '0.19', desc: 'Twinproc (7/9)' },
      { value: '0.18', desc: 'Twinproc (6/9)' },
      { value: '0.15', desc: 'Twinproc (5/9)' },
      { value: '0.12', desc: 'Twinproc (4/9)' },
      { value: '0.09', desc: 'Twinproc (3/9)' },
      { value: '0.06', desc: 'Twinproc (2/9)' },
      { value: '0.03', desc: 'Twinproc (1/9)' },
      { value: '0', desc: 'Twinproc (0/9)' }
    ]
  }
];

export const magDPSAAContext = [
  {
    id: 'aa-destfury',
    value: '355',
    desc: 'Destructive Fury (41/41)',
    data: [
      { value: '355', desc: 'Destructive Fury (41/41)' },
      { value: '350', desc: 'Destructive Fury (40/41)' },
      { value: '345', desc: 'Destructive Fury (39/41)' },
      { value: '340', desc: 'Destructive Fury (38/41)' },
      { value: '335', desc: 'Destructive Fury (37/41)' },
      { value: '330', desc: 'Destructive Fury (36/41)' },
      { value: '320', desc: 'Destructive Fury (35/41)' },
      { value: '310', desc: 'Destructive Fury (34/41)' },
      { value: '301', desc: 'Destructive Fury (33/41)' },
      { value: '296', desc: 'Destructive Fury (32/41)' },
      { value: '291', desc: 'Destructive Fury (31/41)' },
      { value: '286', desc: 'Destructive Fury (30/41)' },
      { value: '279', desc: 'Destructive Fury (29/41)' },
      { value: '272', desc: 'Destructive Fury (28/41)' },
      { value: '265', desc: 'Destructive Fury (27/41)' },
      { value: '251', desc: 'Destructive Fury (26/41)' },
      { value: '238', desc: 'Destructive Fury (25/41)' },
      { value: '230', desc: 'Destructive Fury (24/41)' },
      { value: '222', desc: 'Destructive Fury (23/41)' },
      { value: '214', desc: 'Destructive Fury (22/41)' },
      { value: '206', desc: 'Destructive Fury (21/41)' },
      { value: '199', desc: 'Destructive Fury (20/41)' },
      { value: '192', desc: 'Destructive Fury (19/41)' },
      { value: '185', desc: 'Destructive Fury (18/41)' },
      { value: '180', desc: 'Destructive Fury (17/41)' },
      { value: '175', desc: 'Destructive Fury (16/41)' },
      { value: '170', desc: 'Destructive Fury (15/41)' },
      { value: '165', desc: 'Destructive Fury (14/41)' },
      { value: '160', desc: 'Destructive Fury (13/41)' },
      { value: '155', desc: 'Destructive Fury (12/41)' },
      { value: '150', desc: 'Destructive Fury (11/41)' },
      { value: '145', desc: 'Destructive Fury (10/41)' },
      { value: '140', desc: 'Destructive Fury (9/41)' },
      { value: '135', desc: 'Destructive Fury (8/41)' },
      { value: '130', desc: 'Destructive Fury (7/41)' },
      { value: '125', desc: 'Destructive Fury (6/41)' },
      { value: '115', desc: 'Destructive Fury (5/41)' },
      { value: '107', desc: 'Destructive Fury (4/41)' },
      { value: '100', desc: 'Destructive Fury (3/41)' },
      { value: '60', desc: 'Destructive Fury (2/41)' },
      { value: '30', desc: 'Destructive Fury (1/41)' },
      { value: '0', desc: 'Destructive Fury (0/41)  ' }
    ]
  },
  {
    id: 'aa-don',
    value: '1',
    desc: 'Dark Reign/Keepers DoN (5/5)',
    data: [
      { value: '1', desc: 'Dark Reign/Keepers DoN (5/5)' },
      { value: '1', desc: 'Dark Reign/Keepers DoN (4/5)' },
      { value: '0', desc: 'Dark Reign/Keepers DoN (3/5)' },
      { value: '0', desc: 'Dark Reign/Keepers DoN (2/5)' },
      { value: '0', desc: 'Dark Reign/Keepers DoN (1/5)' },
      { value: '0', desc: 'Dark Reign/Keepers DoN (0/5)' }
    ]
  },
  {
    id: 'aa-force-of-elements',
    value: 'FE21',
    desc: 'Force of Elements (21/21)',
    data: [
      { value: 'FE21', desc: 'Force of Elements (21/21)' },
      { value: 'FE20', desc: 'Force of Elements (20/21)' },
      { value: 'FE19', desc: 'Force of Elements (19/21)' },
      { value: 'FE18', desc: 'Force of Elements (18/21)' },
      { value: 'FE17', desc: 'Force of Elements (17/21)' },
      { value: 'FE16', desc: 'Force of Elements (16/21)' },
      { value: 'FE15', desc: 'Force of Elements (15/21)' },
      { value: 'FE14', desc: 'Force of Elements (14/21)' },
      { value: 'FE13', desc: 'Force of Elements (13/21)' }
    ]
  },
  {
    id: 'aa-furymagic',
    value: '57',
    desc: 'Fury of Magic (30/30)',
    data: [
      { value: '57', desc: 'Fury of Magic (30/30)' },
      { value: '55', desc: 'Fury of Magic (29/30)' },
      { value: '53', desc: 'Fury of Magic (28/30)' },
      { value: '52', desc: 'Fury of Magic (27/30)' },
      { value: '50', desc: 'Fury of Magic (26/30)' },
      { value: '48', desc: 'Fury of Magic (25/30)' },
      { value: '46', desc: 'Fury of Magic (24/30)' },
      { value: '44', desc: 'Fury of Magic (23/30)' },
      { value: '42', desc: 'Fury of Magic (22/30)' },
      { value: '40', desc: 'Fury of Magic (21/30)' },
      { value: '38', desc: 'Fury of Magic (20/30)' },
      { value: '36', desc: 'Fury of Magic (19/30)' },
      { value: '34', desc: 'Fury of Magic (18/30)' },
      { value: '32', desc: 'Fury of Magic (17/30)' },
      { value: '30', desc: 'Fury of Magic (16/30)' },
      { value: '25', desc: 'Fury of Magic (15/30)' },
      { value: '24', desc: 'Fury of Magic (14/30)' },
      { value: '23', desc: 'Fury of Magic (13/30)' },
      { value: '22', desc: 'Fury of Magic (12/30)' },
      { value: '20', desc: 'Fury of Magic (11/30)' },
      { value: '18', desc: 'Fury of Magic (10/30)' },
      { value: '16', desc: 'Fury of Magic (9/30)' },
      { value: '15', desc: 'Fury of Magic (8/30)' },
      { value: '14', desc: 'Fury of Magic (7/30)' },
      { value: '13', desc: 'Fury of Magic (6/30)' },
      { value: '11', desc: 'Fury of Magic (5/30)' },
      { value: '9', desc: 'Fury of Magic (4/30)' },
      { value: '7', desc: 'Fury of Magic (3/30)' },
      { value: '4', desc: 'Fury of Magic (2/30)' },
      { value: '2', desc: 'Fury of Magic (1/30)' },
      { value: '0', desc: 'Fury of Magic (0/30)' }
    ]
  },
  {
    id: 'aa-steelveng',
    value: '17',
    desc: 'Steel Vengeance (17/17)',
    data: [
      { value: '17', desc: 'Steel Vengeance (17/17)' },
      { value: '16', desc: 'Steel Vengeance (16/17)' },
      { value: '15', desc: 'Steel Vengeance (15/17)' },
      { value: '14', desc: 'Steel Vengeance (14/17)' },
      { value: '13', desc: 'Steel Vengeance (13/17)' },
      { value: '12', desc: 'Steel Vengeance (12/17)' },
      { value: '11', desc: 'Steel Vengeance (11/17)' },
      { value: '10', desc: 'Steel Vengeance (10/17)' },
      { value: '0', desc: 'Steel Vengeance (0/17)' }
    ]
  },
  {
    id: 'aa-twincast',
    value: '0.05',
    desc: 'Twincast (5/5)',
    data: [
      { value: '0.05', desc: 'Twincast (5/5)' },
      { value: '0.04', desc: 'Twincast (4/5)' },
      { value: '0.03', desc: 'Twincast (3/5)' },
      { value: '0.02', desc: 'Twincast (2/5)' },
      { value: '0.01', desc: 'Twincast (1/5)' },
      { value: '0', desc: 'Twincast (0/5)' }
    ]
  },
  {
    id: 'aa-twinproc',
    value: '0.21',
    desc: 'Twinproc (9/9)',
    data: [
      { value: '0.21', desc: 'Twinproc (9/9)' },
      { value: '0.20', desc: 'Twinproc (8/8)' },
      { value: '0.19', desc: 'Twinproc (7/8)' },
      { value: '0.18', desc: 'Twinproc (6/8)' },
      { value: '0.15', desc: 'Twinproc (5/8)' },
      { value: '0.12', desc: 'Twinproc (4/8)' },
      { value: '0.09', desc: 'Twinproc (3/8)' },
      { value: '0.06', desc: 'Twinproc (2/8)' },
      { value: '0.03', desc: 'Twinproc (1/8)' },
      { value: '0', desc: 'Twinproc (0/8)' }
    ]
  }
];

export const encDPSAAContext = [
  {
    id: 'aa-critafflic',
    value: '33',
    desc: 'Critical Affliction (11/11)',
    data: [
      { value: '33', desc: 'Critical Affliction (11/11)' },
      { value: '30', desc: 'Critical Affliction (10/11)' },
      { value: '27', desc: 'Critical Affliction (9/11)' },
      { value: '24', desc: 'Critical Affliction (8/11)' },
      { value: '21', desc: 'Critical Affliction (7/11)' },
      { value: '18', desc: 'Critical Affliction (6/11)' },
      { value: '15', desc: 'Critical Affliction (5/11)' },
      { value: '12', desc: 'Critical Affliction (4/11)' },
      { value: '9', desc: 'Critical Affliction (3/11)' },
      { value: '6', desc: 'Critical Affliction (2/11)' },
      { value: '3', desc: 'Critical Affliction (1/11)' },
      { value: '0', desc: 'Critical Affliction (0/11)  ' }
    ]
  },
  {
    id: 'aa-destcascade',
    value: '375',
    desc: 'Destructive Cascade (39/39)',
    data: [
      { value: '375', desc: 'Destructive Cascade (39/39)' },
      { value: '370', desc: 'Destructive Cascade (38/39)' },
      { value: '365', desc: 'Destructive Cascade (37/39)' },
      { value: '360', desc: 'Destructive Cascade (36/39)' },
      { value: '356', desc: 'Destructive Cascade (35/39)' },
      { value: '352', desc: 'Destructive Cascade (34/39)' },
      { value: '347', desc: 'Destructive Cascade (33/39)' },
      { value: '343', desc: 'Destructive Cascade (32/39)' },
      { value: '338', desc: 'Destructive Cascade (31/39)' },
      { value: '334', desc: 'Destructive Cascade (30/39)' },
      { value: '329', desc: 'Destructive Cascade (29/39)' },
      { value: '325', desc: 'Destructive Cascade (28/39)' },
      { value: '321', desc: 'Destructive Cascade (27/39)' },
      { value: '318', desc: 'Destructive Cascade (26/39)' },
      { value: '315', desc: 'Destructive Cascade (25/39)' },
      { value: '310', desc: 'Destructive Cascade (24/39)' },
      { value: '305', desc: 'Destructive Cascade (23/39)' },
      { value: '300', desc: 'Destructive Cascade (22/39)' },
      { value: '295', desc: 'Destructive Cascade (21/39)' },
      { value: '290', desc: 'Destructive Cascade (20/39)' },
      { value: '285', desc: 'Destructive Cascade (19/39)' },
      { value: '280', desc: 'Destructive Cascade (18/39)' },
      { value: '275', desc: 'Destructive Cascade (17/39)' },
      { value: '270', desc: 'Destructive Cascade (16/39)' },
      { value: '265', desc: 'Destructive Cascade (15/39)' },
      { value: '260', desc: 'Destructive Cascade (14/39)' },
      { value: '250', desc: 'Destructive Cascade (13/39)' },
      { value: '240', desc: 'Destructive Cascade (12/39)' },
      { value: '230', desc: 'Destructive Cascade (11/39)' },
      { value: '215', desc: 'Destructive Cascade (10/39)' },
      { value: '200', desc: 'Destructive Cascade (9/39)' },
      { value: '175', desc: 'Destructive Cascade (8/39)' },
      { value: '150', desc: 'Destructive Cascade (7/39)' },
      { value: '140', desc: 'Destructive Cascade (6/39)' },
      { value: '135', desc: 'Destructive Cascade (5/39)' },
      { value: '130', desc: 'Destructive Cascade (4/39)' },
      { value: '125', desc: 'Destructive Cascade (3/39)' },
      { value: '115', desc: 'Destructive Cascade (2/39)' },
      { value: '107', desc: 'Destructive Cascade (1/39)' },
      { value: '0', desc: 'Destructive Cascade (0/39)  ' }
    ]
  },
  {
    id: 'aa-destfury',
    value: '355',
    desc: 'Destructive Fury (41/41)',
    data: [
      { value: '355', desc: 'Destructive Fury (41/41)' },
      { value: '350', desc: 'Destructive Fury (40/41)' },
      { value: '345', desc: 'Destructive Fury (39/41)' },
      { value: '340', desc: 'Destructive Fury (38/41)' },
      { value: '335', desc: 'Destructive Fury (37/41)' },
      { value: '330', desc: 'Destructive Fury (36/41)' },
      { value: '320', desc: 'Destructive Fury (35/41)' },
      { value: '310', desc: 'Destructive Fury (34/41)' },
      { value: '301', desc: 'Destructive Fury (33/41)' },
      { value: '296', desc: 'Destructive Fury (32/41)' },
      { value: '291', desc: 'Destructive Fury (31/41)' },
      { value: '286', desc: 'Destructive Fury (30/41)' },
      { value: '279', desc: 'Destructive Fury (29/41)' },
      { value: '272', desc: 'Destructive Fury (28/41)' },
      { value: '265', desc: 'Destructive Fury (27/41)' },
      { value: '251', desc: 'Destructive Fury (26/41)' },
      { value: '238', desc: 'Destructive Fury (25/41)' },
      { value: '230', desc: 'Destructive Fury (24/41)' },
      { value: '222', desc: 'Destructive Fury (23/41)' },
      { value: '214', desc: 'Destructive Fury (22/41)' },
      { value: '206', desc: 'Destructive Fury (21/41)' },
      { value: '199', desc: 'Destructive Fury (20/41)' },
      { value: '192', desc: 'Destructive Fury (19/41)' },
      { value: '185', desc: 'Destructive Fury (18/41)' },
      { value: '180', desc: 'Destructive Fury (17/41)' },
      { value: '175', desc: 'Destructive Fury (16/41)' },
      { value: '170', desc: 'Destructive Fury (15/41)' },
      { value: '165', desc: 'Destructive Fury (14/41)' },
      { value: '160', desc: 'Destructive Fury (13/41)' },
      { value: '155', desc: 'Destructive Fury (12/41)' },
      { value: '150', desc: 'Destructive Fury (11/41)' },
      { value: '145', desc: 'Destructive Fury (10/41)' },
      { value: '140', desc: 'Destructive Fury (9/41)' },
      { value: '135', desc: 'Destructive Fury (8/41)' },
      { value: '130', desc: 'Destructive Fury (7/41)' },
      { value: '125', desc: 'Destructive Fury (6/41)' },
      { value: '115', desc: 'Destructive Fury (5/41)' },
      { value: '107', desc: 'Destructive Fury (4/41)' },
      { value: '100', desc: 'Destructive Fury (3/41)' },
      { value: '60', desc: 'Destructive Fury (2/41)' },
      { value: '30', desc: 'Destructive Fury (1/41)' },
      { value: '0', desc: 'Destructive Fury (0/41)  ' }
    ]
  },
  {
    id: 'aa-don',
    value: '1',
    desc: 'Dark Reign/Keepers DoN (5/5)',
    data: [
      { value: '1', desc: 'Dark Reign/Keepers DoN (5/5)' },
      { value: '1', desc: 'Dark Reign/Keepers DoN (4/5)' },
      { value: '0', desc: 'Dark Reign/Keepers DoN (3/5)' },
      { value: '0', desc: 'Dark Reign/Keepers DoN (2/5)' },
      { value: '0', desc: 'Dark Reign/Keepers DoN (1/5)' },
      { value: '0', desc: 'Dark Reign/Keepers DoN (0/5)' }
    ]
  },
  {
    id: 'aa-furymagic',
    value: '57',
    desc: 'Fury of Magic (30/30)',
    data: [
      { value: '57', desc: 'Fury of Magic (30/30)' },
      { value: '55', desc: 'Fury of Magic (29/30)' },
      { value: '53', desc: 'Fury of Magic (28/30)' },
      { value: '52', desc: 'Fury of Magic (27/30)' },
      { value: '50', desc: 'Fury of Magic (26/30)' },
      { value: '48', desc: 'Fury of Magic (25/30)' },
      { value: '46', desc: 'Fury of Magic (24/30)' },
      { value: '44', desc: 'Fury of Magic (23/30)' },
      { value: '42', desc: 'Fury of Magic (22/30)' },
      { value: '40', desc: 'Fury of Magic (21/30)' },
      { value: '38', desc: 'Fury of Magic (20/30)' },
      { value: '36', desc: 'Fury of Magic (19/30)' },
      { value: '34', desc: 'Fury of Magic (18/30)' },
      { value: '32', desc: 'Fury of Magic (17/30)' },
      { value: '30', desc: 'Fury of Magic (16/30)' },
      { value: '25', desc: 'Fury of Magic (15/30)' },
      { value: '24', desc: 'Fury of Magic (14/30)' },
      { value: '23', desc: 'Fury of Magic (13/30)' },
      { value: '22', desc: 'Fury of Magic (12/30)' },
      { value: '20', desc: 'Fury of Magic (11/30)' },
      { value: '18', desc: 'Fury of Magic (10/30)' },
      { value: '16', desc: 'Fury of Magic (9/30)' },
      { value: '15', desc: 'Fury of Magic (8/30)' },
      { value: '14', desc: 'Fury of Magic (7/30)' },
      { value: '13', desc: 'Fury of Magic (6/30)' },
      { value: '11', desc: 'Fury of Magic (5/30)' },
      { value: '9', desc: 'Fury of Magic (4/30)' },
      { value: '7', desc: 'Fury of Magic (3/30)' },
      { value: '4', desc: 'Fury of Magic (2/30)' },
      { value: '2', desc: 'Fury of Magic (1/30)' },
      { value: '0', desc: 'Fury of Magic (0/30)' }
    ]
  },
  {
    id: 'aa-hazy',
    value: '0.08',
    desc: 'Gift of Hazy Thoughts (1/1)',
    data: [
      { value: '0.08', desc: 'Gift of Hazy Thoughts (1/1)' },
      { value: '0', desc: 'Gift of Hazy Thoughts (0/1)' }
    ]
  },
  {
    id: 'aa-twincast',
    value: '0.05',
    desc: 'Twincast (5/5)',
    data: [
      { value: '0.05', desc: 'Twincast (5/5)' },
      { value: '0.04', desc: 'Twincast (4/5)' },
      { value: '0.03', desc: 'Twincast (3/5)' },
      { value: '0.02', desc: 'Twincast (2/5)' },
      { value: '0.01', desc: 'Twincast (1/5)' },
      { value: '0', desc: 'Twincast (0/5)' }
    ]
  },
  {
    id: 'aa-twinproc',
    value: '0.21',
    desc: 'Twinproc (9/9)',
    data: [
      { value: '0.21', desc: 'Twinproc (9/9)' },
      { value: '0.20', desc: 'Twinproc (8/8)' },
      { value: '0.19', desc: 'Twinproc (7/8)' },
      { value: '0.18', desc: 'Twinproc (6/8)' },
      { value: '0.15', desc: 'Twinproc (5/8)' },
      { value: '0.12', desc: 'Twinproc (4/8)' },
      { value: '0.09', desc: 'Twinproc (3/8)' },
      { value: '0.06', desc: 'Twinproc (2/8)' },
      { value: '0.03', desc: 'Twinproc (1/8)' },
      { value: '0', desc: 'Twinproc (0/8)' }
    ]
  }
];

export const chartOptions = {
  spellline: {
    showCurrentTime: false,
    showMajorLabels: false,
    showMinorLabels: true,
    align: 'center',
    zoomable: true,
    editable: false,
    clickToUse: false,
    maxHeight: '160px',
    minHeight: '100px',
    selectable: false
  },
  timeline: {
    showCurrentTime: false,
    showMajorLabels: false,
    showMinorLabels: true,
    align: 'left',
    zoomable: true,
    editable: {
      add: false,
      updateTime: true,
      remove:true
    },
    clickToUse: false
  },
  graphcritr: {
    showCurrentTime: false,
    showMajorLabels: false,
    showMinorLabels: true,
    zoomable: true,
    dataAxis: {
      left: {
        range: {
          min: -20,
          max: 130
        },
        title: {
          text: 'Crit Rate'
        }
      },
      visible: false
    },
    interpolation: true,
    height: '85px',
    drawPoints: {
      size: 0
    },
    sort: false,
    clickToUse: false,
    shaded: {
      enabled: true
    }
  },
  graphcritd: {
    showCurrentTime: false,
    showMajorLabels: false,
    showMinorLabels: true,
    zoomable: true,
    dataAxis: {
      left: {
        range: {
          min: -200,
          max: 1200
        },
        title: {
          text: 'Crit Dmg%'
        }
      },
      visible: false
    },
    interpolation: true,
    height: '85px',
    drawPoints: {
      size: 0
    },
    sort: false,
    clickToUse: false,
    shaded: {
      enabled: true
    }
  },
  graphdmg: {
    showCurrentTime: false,
    showMajorLabels: false,
    showMinorLabels: true,
    zoomable: true,
    dataAxis: {
      left: {
        title: {
          text: 'Damage'
        }
      },
      visible: false
    },
    interpolation: false,
    height: '130px',
    drawPoints: {
      size: 1,
      style: 'circle'
    },
    sort: false,
    clickToUse: false,
    shaded: {
      enabled: true
    }
  }
};
