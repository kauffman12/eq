export const globals = {
  VERSION: 'Version 1.67',
  MAX_LEVEL: 115,
  CLASSES: {
    enc: {
      title: 'EQ Enchanter DPS Tool',
      critRate: 'ENC_INNATE_CRIT_RATE',
      critDmg: 'ENC_INNATE_CRIT_DMG',
      cookie: 'mode=enc',
      css: 'enc-only'
    },
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
  'BB', 'CQ', 'CO', 'CT', 'DF', 'EB', 'ER', 'EI', 'EZ', 'ES', 'EV', 'FB',
  'FBC', 'ME', 'SC', 'SF', 'SR', 'SH', 'SP', 'SJ', 'TW', 'WE', 'WF', 'WH'
];

// mage spells to display in spell drop down
export const magSpellList = [
  'BK', 'BM', 'BS', 'BB', 'CI', 'DC', 'FC', 'FBC', 'MB', 'RK', 'RM', 'RU', 'RS', 'SH', 'SB', 'SS', 'SA', 'VM'
];

// enc spells to display in spell drop down
export const encSpellList = [
  'CA', 'CD', 'CF', 'CR', 'GT', 'MC', 'MU', 'MS', 'PA', //'ST'
];

// values need to be strings for HTML dom nodes
export const basicDmgFocusContext = [
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
    value: 'FMAGIC85123',
    desc: 'Ice Woven/Velium Emp Cap',
    data: [
      { value: 'FMAGIC85123', desc: 'Ice Woven/Velium Emp Cap' },
      { value: 'FMAGIC70120', desc: 'Heavenly/Veiled Cap' },
      { value: 'FMAGIC70', desc: 'Scaleborn Cap' },
      { value: 'FMAGIC67', desc: 'Velazul\'s Cap' },
      { value: 'FMAGIC75', desc: 'Icebound/Velium Infused Cap' },      
      { value: 'FMAGIC6090', desc: 'Snowbound/Adamant/Battle Cap' },
      { value: 'NONE', desc: 'No Cap Selected' }
    ]
  },
  {
    id: 'wn-fhand',
    value: 'FCOLD85123',
    desc: 'Ice Woven/Velium Emp Gloves',
    data: [
      { value: 'FCOLD85123', desc: 'Ice Woven/Velium Emp Gloves' },    
      { value: 'FCOLD85123', desc: 'White Platinum Threaded Satin Gloves' },
      { value: 'FCOLD70120', desc: 'Heavenly/Veiled Gloves' },
      { value: 'FCOLD70', desc: 'Scaleborn Gloves' },
      { value: 'FCOLD67', desc: 'Velazul\'s Gloves' },
      { value: 'FCOLD75', desc: 'Icebound/Velium Infused Cap' },          
      { value: 'FCOLD6090', desc: 'Snowbound/Adamant/Battle Gloves' },
      { value: 'NONE', desc: 'No Gloves Selected' }
    ]
  },
  {
    id: 'wn-farm',
    value: 'FFIRE85123',
    desc: 'Ice Woven/Velium Emp Sleeves',
    data: [
      { value: 'FFIRE85123', desc: 'Ice Woven/Velium Emp Sleeves' },
      { value: 'FFIRE70120', desc: 'Heavenly/Veiled Sleeves' },
      { value: 'FFIRE70', desc: 'Scaleborn Sleeves' },
      { value: 'FFIRE67', desc: 'Velazul\'s Sleeves' },
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
      { value: 'ESD9', desc: 'Heavenly/Veiled Robe' },
      { value: 'ESD9', desc: 'Scaleborn Robe' },
      { value: 'ESD7', desc: 'Snowbound/Adamant/Battle Robe' },
      { value: 'NONE', desc: 'No Robe Selected' }
    ]
  },
  {
    id: 'wn-fwrist',
    value: 'FCHROM85123',
    desc: 'Ice Woven/Velium Emp Wristguard',
    data: [
      { value: 'FCHROM85123', desc: 'Ice Woven/Velium Emp Wristguard' },   
      { value: 'FCHROM70120', desc: 'Heavenly/Veiled Wristguard' },
      { value: 'FCHROM70', desc: 'Scaleborn Wristguard' },
      { value: 'FCHROM67', desc: 'Velazul\'s Wristguard' },
      { value: 'FCHROM75', desc: 'Icebound/Velium Infused Cap' },          
      { value: 'FCHROM6090', desc: 'Snowbound/Adamant/Battle Wristguard' },
      { value: 'NONE', desc: 'No Wristguard Selected' }
    ]
  },
  {
    id: 'armor-proc1',
    value: 'NONE',
    desc: 'No Evolving Armor Aug1 Selected',
    data: [
      { value: 'EBOFVIII', desc: 'Blazing Paradise Casting Fire' },
      { value: 'ESOMVIII', desc: 'Blazing Paradise Casting Magic' },
      { value: 'NONE', desc: 'No Evolving Armor Aug Selected' }
    ]
  },
  {
    id: 'armor-proc2',
    value: 'NONE',
    desc: 'No Evolving Armor Aug2 Selected',
    data: [
      { value: 'EBOFV', desc: 'Whispering Midnight Casting Fire' },
      { value: 'ESOMV', desc: 'Whispering Midnight Casting Magic' },
      { value: 'NONE', desc: 'No Evolving Armor Aug Selected' }
    ]
  },
  {
    id: 'staff-proc',
    value: 'NONE',
    desc: 'No Weapon Selected',
    data: [
      { value: 'BOFVIII', desc: 'Blaze of Fire VIII 2H' },
      { value: 'HOMVII', desc: 'Rod of Ri`zyr' },
      { value: 'BFVI', desc: 'Nightfear\'s Halo' },
      { value: 'BFVI', desc: 'Bloodstaff' },
      { value: 'WOCVI', desc: 'Wave of Corruption VI 1H' },
      { value: 'SOIV', desc: 'Mute Spiral' },
      { value: 'SOIV', desc: 'Fathomless Staff of Warding' },
      { value: 'BFIV', desc: 'Blackened August Warhammer' },
      { value: 'BOFVII', desc: 'Shissar Arcanist\'s Stylet' },
      { value: 'BOFVI', desc: 'Crystal Misericorde' },
      { value: 'SOCV', desc: 'Eldritch Misericorde' },
      { value: 'VOSIV', desc: 'Darkened Trakanon\'s Tooth' },
      { value: 'WOCIV', desc: 'Advisor\'s Guide' },
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
      { value: 'THREADSP', desc: 'Skywing Threaded Sash (Threads)' },
      { value: 'SEERS', desc: 'Sash of the Dar Brood (Seers)' },
      { value: 'THREADSM', desc: 'Parogressio' },
      { value: 'BONDF', desc: 'Burning Sash of Ro' },
      { value: 'NONE', desc: 'No Belt Selected' }
    ]
  },
  {
    id: 'dps-aug1',
    value: 'NONE',
    desc: 'No Additional Aug1 Selected',
    data: [
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
    value: '11',
    desc: 'Evoker\'s Synergy (11/11)',
    data: [
      { value: '11', desc: 'Evoker\'s Synergy (11/11)' },
      { value: '10', desc: 'Evoker\'s Synergy (10/11)' },
      { value: '9', desc: 'Evoker\'s Synergy (9/11)' },
      { value: '8', desc: 'Evoker\'s Synergy (8/11)' },
      { value: '7', desc: 'Evoker\'s Synergy (7/11)' },
      { value: '6', desc: 'Evoker\'s Synergy (6/11)' },
      { value: '5', desc: 'Evoker\'s Synergy (5/11)' },
      { value: '4', desc: 'Evoker\'s Synergy (4/11)' },
      { value: '3', desc: 'Evoker\'s Synergy (3/11)' },
      { value: '2', desc: 'Evoker\'s Synergy (2/11)' },
      { value: '1', desc: 'Evoker\'s Synergy (1/11)' },
      { value: '0', desc: 'Evoker\'s Synergy (0/11)' }
    ]
  },
  {
    id: 'aa-beams',
    value: '0.20',
    desc: 'Beams (11/11)',
    data: [
      { value: '0.20', desc: 'Beams (11/11)' },
      { value: '0.18', desc: 'Beams (10/11)' },
      { value: '0.16', desc: 'Beams (9/11)' },
      { value: '0', desc: 'Beams (8/11)' },
      { value: '0', desc: 'Beams (7/11)' },
      { value: '0', desc: 'Beams (6/11)' },
      { value: '0', desc: 'Beams (5/11)' },
      { value: '0', desc: 'Beams (4/11)' },
      { value: '0', desc: 'Beams (3/11)' },
      { value: '0', desc: 'Beams (2/11)' },
      { value: '0', desc: 'Beams (1/11)' },
      { value: '0', desc: 'Beams (0/11)' }
    ]
  },
  {
    id: 'aa-chaos',
    value: '0.20',
    desc: 'Chaos Scintillation (11/11)',
    data: [
      { value: '0.20', desc: 'Chaos Scintillation (11/11)' },
      { value: '0.18', desc: 'Chaos Scintillation (10/11)' },
      { value: '0.16', desc: 'Chaos Scintillation (9/11)' },
      { value: '0', desc: 'Chaos Scintillation (8/11)' },
      { value: '0', desc: 'Chaos Scintillation (7/11)' },
      { value: '0', desc: 'Chaos Scintillation (6/11)' },
      { value: '0', desc: 'Chaos Scintillation (5/11)' },
      { value: '0', desc: 'Chaos Scintillation (4/11)' },
      { value: '0', desc: 'Chaos Scintillation (3/11)' },
      { value: '0', desc: 'Chaos Scintillation (2/11)' },
      { value: '0', desc: 'Chaos Scintillation (1/11)' },
      { value: '0', desc: 'Chaos Scintillation (0/11)' }
    ]
  },
  {
    id: 'aa-claws',
    value: '0.20',
    desc: 'Claws (11/11)',
    data: [
      { value: '0.20', desc: 'Claws (11/11)' },
      { value: '0.18', desc: 'Claws (10/11)' },
      { value: '0.16', desc: 'Claws (9/11)' },
      { value: '0', desc: 'Claws (8/11)' },
      { value: '0', desc: 'Claws (7/11)' },
      { value: '0', desc: 'Claws (6/11)' },
      { value: '0', desc: 'Claws (5/11)' },
      { value: '0', desc: 'Claws (4/11)' },
      { value: '0', desc: 'Claws (3/11)' },
      { value: '0', desc: 'Claws (2/11)' },
      { value: '0', desc: 'Claws (1/11)' },
      { value: '0', desc: 'Claws (0/11)' }
    ]
  },
  {
    id: 'aa-cloudb',
    value: '0.20',
    desc: 'Cloudburst Stormstrike (11/11)',
    data: [
      { value: '0.20', desc: 'Cloudburst Stormstrike (11/11)' },
      { value: '0.18', desc: 'Cloudburst Stormstrike (10/11)' },
      { value: '0.16', desc: 'Cloudburst Stormstrike (9/11)' },
      { value: '0', desc: 'Cloudburst Stormstrike (8/11)' },
      { value: '0', desc: 'Cloudburst Stormstrike (7/11)' },
      { value: '0', desc: 'Cloudburst Stormstrike (6/11)' },
      { value: '0', desc: 'Cloudburst Stormstrike (5/11)' },
      { value: '0', desc: 'Cloudburst Stormstrike (4/11)' },
      { value: '0', desc: 'Cloudburst Stormstrike (3/11)' },
      { value: '0', desc: 'Cloudburst Stormstrike (2/11)' },
      { value: '0', desc: 'Cloudburst Stormstrike (1/11)' },
      { value: '0', desc: 'Cloudburst Stormstrike (0/11)' }
    ]
  },
  {
    id: 'aa-corona',
    value: '0.20',
    desc: 'Corona of Flame (11/11)',
    data: [
      { value: '0.20', desc: 'Corona of Flame (11/11)' },
      { value: '0.18', desc: 'Corona of Flame (10/11)' },
      { value: '0.16', desc: 'Corona of Flame (9/11)' },
      { value: '0', desc: 'Corona of Flame (8/11)' },
      { value: '0', desc: 'Corona of Flame (7/11)' },
      { value: '0', desc: 'Corona of Flame (6/11)' },
      { value: '0', desc: 'Corona of Flame (5/11)' },
      { value: '0', desc: 'Corona of Flame (4/11)' },
      { value: '0', desc: 'Corona of Flame (3/11)' },
      { value: '0', desc: 'Corona of Flame (2/11)' },
      { value: '0', desc: 'Corona of Flame (1/11)' },
      { value: '0', desc: 'Corona of Flame (0/11)' }
    ]
  },
  {
    id: 'aa-eflash',
    value: '0.20',
    desc: 'Ethereal Flash (11/11)',
    data: [
      { value: '0.20', desc: 'Ethereal Flash (11/11)' },
      { value: '0.18', desc: 'Ethereal Flash (10/11)' },
      { value: '0.16', desc: 'Ethereal Flash (9/11)' },
      { value: '0', desc: 'Ethereal Flash (8/11)' },
      { value: '0', desc: 'Ethereal Flash (7/11)' },
      { value: '0', desc: 'Ethereal Flash (6/11)' },
      { value: '0', desc: 'Ethereal Flash (5/11)' },
      { value: '0', desc: 'Ethereal Flash (4/11)' },
      { value: '0', desc: 'Ethereal Flash (3/11)' },
      { value: '0', desc: 'Ethereal Flash (2/11)' },
      { value: '0', desc: 'Ethereal Flash (1/11)' },
      { value: '0', desc: 'Ethereal Flash (0/11)' }
    ]
  },
  {
    id: 'aa-erime',
    value: '11',
    desc: 'Ethereal Rimeblast (11/11)',
    data: [
      { value: '11', desc: 'Ethereal Rimeblast (11/11)' },
      { value: '10', desc: 'Ethereal Rimeblast (10/11)' },
      { value: '9', desc: 'Ethereal Rimeblast (9/11)' },
      { value: '0.16', desc: 'Ethereal Rimeblast (8/11)' },
      { value: '0.14', desc: 'Ethereal Rimeblast (7/11)' },
      { value: '0.12', desc: 'Ethereal Rimeblast (6/11)' },
      { value: '0.10', desc: 'Ethereal Rimeblast (5/11)' },
      { value: '0.08', desc: 'Ethereal Rimeblast (4/11)' },
      { value: '0.06', desc: 'Ethereal Rimeblast (3/11)' },
      { value: '0.04', desc: 'Ethereal Rimeblast (2/11)' },
      { value: '0.02', desc: 'Ethereal Rimeblast (1/11)' },
      { value: '0', desc: 'Ethereal Rimeblast (0/11)' }
    ]
  },
  {
    id: 'aa-eblaze',
    value: '11',
    desc: 'Ethereal Skyblaze (11/11)',
    data: [
      { value: '11', desc: 'Ethereal Skyblaze (11/11)' },
      { value: '10', desc: 'Ethereal Skyblaze (10/11)' },
      { value: '9', desc: 'Ethereal Skyblaze (9/11)' },
      { value: '0.16', desc: 'Ethereal Skyblaze (8/11)' },
      { value: '0.14', desc: 'Ethereal Skyblaze (7/11)' },
      { value: '0.12', desc: 'Ethereal Skyblaze (6/11)' },
      { value: '0.10', desc: 'Ethereal Skyblaze (5/11)' },
      { value: '0.08', desc: 'Ethereal Skyblaze (4/11)' },
      { value: '0.06', desc: 'Ethereal Skyblaze (3/11)' },
      { value: '0.04', desc: 'Ethereal Skyblaze (2/11)' },
      { value: '0.02', desc: 'Ethereal Skyblaze (1/11)' },
      { value: '0', desc: 'Ethereal Skyblaze (0/11)' }
    ]
  },
  {
    id: 'aa-flashchar',
    value: '0.20',
    desc: 'Flashchar (11/11)',
    data: [
      { value: '0.20', desc: 'Flashchar (11/11)' },
      { value: '0.18', desc: 'Flashchar (10/11)' },
      { value: '0.16', desc: 'Flashchar (9/11)' },
      { value: '0', desc: 'Flashchar (8/11)' },
      { value: '0', desc: 'Flashchar (7/11)' },
      { value: '0', desc: 'Flashchar (6/11)' },
      { value: '0', desc: 'Flashchar (5/11)' },
      { value: '0', desc: 'Flashchar (4/11)' },
      { value: '0', desc: 'Flashchare (3/11)' },
      { value: '0', desc: 'Flashchar (2/11)' },
      { value: '0', desc: 'Flashchar (1/11)' },
      { value: '0', desc: 'Flashchar (0/11)' }
    ]
  },
  {
    id: 'aa-pills',
    value: '0.20',
    desc: 'Pillars (11/11)',
    data: [
      { value: '0.20', desc: 'Pillars (11/11)' },
      { value: '0.18', desc: 'Pillars (10/11)' },
      { value: '0.16', desc: 'Pillars (9/11)' },
      { value: '0', desc: 'Pillars (8/11)' },
      { value: '0', desc: 'Pillars (7/11)' },
      { value: '0', desc: 'Pillars (6/11)' },
      { value: '0', desc: 'Pillars (5/11)' },
      { value: '0', desc: 'Pillars (4/11)' },
      { value: '0', desc: 'Pillars (3/11)' },
      { value: '0', desc: 'Pillars (2/11)' },
      { value: '0', desc: 'Pillars (1/11)' },
      { value: '0', desc: 'Pillars (0/11)' }
    ]
  },
  {
    id: 'aa-pure',
    value: '0.20',
    desc: 'Pure Wildflash (11/11)',
    data: [
      { value: '0.20', desc: 'Pure Wildflash (11/11)' },
      { value: '0.18', desc: 'Pure Wildflash (10/11)' },
      { value: '0.16', desc: 'Pure Wildflash (9/11)' },
      { value: '0', desc: 'Pure Wildflash (8/11)' },
      { value: '0', desc: 'Pure Wildflash (7/11)' },
      { value: '0', desc: 'Pure Wildflash (6/11)' },
      { value: '0', desc: 'Pure Wildflash (5/11)' },
      { value: '0', desc: 'Pure Wildflash (4/11)' },
      { value: '0', desc: 'Pure Wildflash (3/11)' },
      { value: '0', desc: 'Pure Wildflash (2/11)' },
      { value: '0', desc: 'Pure Wildflash (1/11)' },
      { value: '0', desc: 'Pure Wildflash (0/11)' }
    ]
  },
  {
    id: 'aa-rains',
    value: '0.20',
    desc: 'Rains (11/11)',
    data: [
      { value: '0.20', desc: 'Rains (11/11)' },
      { value: '0.18', desc: 'Rains (10/11)' },
      { value: '0.16', desc: 'Rains (9/11)' },
      { value: '0', desc: 'Rains (8/11)' },
      { value: '0', desc: 'Rains (7/11)' },
      { value: '0', desc: 'Rains (6/11)' },
      { value: '0', desc: 'Rains (5/11)' },
      { value: '0', desc: 'Rains (4/11)' },
      { value: '0', desc: 'Rains (3/11)' },
      { value: '0', desc: 'Rains (2/11)' },
      { value: '0', desc: 'Rains (1/11)' },
      { value: '0', desc: 'Rains (0/11)' }
    ]
  },
  {
    id: 'aa-rimeb',
    value: '0.20',
    desc: 'Rimeblast Cascade (11/11)',
    data: [
      { value: '0.20', desc: 'Rimeblast Cascade (11/11)' },
      { value: '0.18', desc: 'Rimeblast Cascade (10/11)' },
      { value: '0.16', desc: 'Rimeblast Cascade (9/11)' },
      { value: '0', desc: 'Rimeblast Cascade (8/11)' },
      { value: '0', desc: 'Rimeblast Cascade (7/11)' },
      { value: '0', desc: 'Rimeblast Cascade (6/11)' },
      { value: '0', desc: 'Rimeblast Cascade (5/11)' },
      { value: '0', desc: 'Rimeblast Cascade (4/11)' },
      { value: '0', desc: 'Rimeblast Cascade (3/11)' },
      { value: '0', desc: 'Rimeblast Cascade (2/11)' },
      { value: '0', desc: 'Rimeblast Cascade (1/11)' },
      { value: '0', desc: 'Rimeblast Cascade (0/11)' }
    ]
  },
  {
    id: 'aa-selfc',
    value: '0.20',
    desc: 'Self-Combustion (10/11)',
    data: [
      { value: '0.20', desc: 'Self-Combustion (10/10)' },
      { value: '0.18', desc: 'Self-Combustion (9/10)' },
      { value: '0.16', desc: 'Self-Combustion (8/10)' },
      { value: '0.14', desc: 'Self-Combustion (7/10)' },
      { value: '0.12', desc: 'Self-Combustion (6/10)' },
      { value: '0.10', desc: 'Self-Combustion (5/10)' },
      { value: '0.08', desc: 'Self-Combustion (4/10)' },
      { value: '0.06', desc: 'Self-Combustion (3/10)' },
      { value: '0.04', desc: 'Self-Combustion (2/10)' },
      { value: '0.02', desc: 'Self-Combustion (1/10)' },
      { value: '0', desc: 'Self-Combustion (0/10)' }
    ]
  },
  {
    id: 'aa-thrice',
    value: '0.20',
    desc: 'Thricewoven Stormstrike (11/11)',
    data: [
      { value: '0.20', desc: 'Thricewoven Stormstrike (11/11)' },
      { value: '0.18', desc: 'Thricewoven Stormstrike (10/11)' },
      { value: '0.16', desc: 'Thricewoven Stormstrike (9/11)' },
      { value: '0', desc: 'Thricewoven Stormstrike (8/11)' },
      { value: '0', desc: 'Thricewoven Stormstrike (7/11)' },
      { value: '0', desc: 'Thricewoven Stormstrike (6/11)' },
      { value: '0', desc: 'Thricewoven Stormstrike (5/11)' },
      { value: '0', desc: 'Thricewoven Stormstrike (4/11)' },
      { value: '0', desc: 'Thricewoven Stormstrike (3/11)' },
      { value: '0', desc: 'Thricewoven Stormstrike (2/11)' },
      { value: '0', desc: 'Thricewoven Stormstrike (1/11)' },
      { value: '0', desc: 'Thricewoven Stormstrike (0/11)' }
    ]
  },
  {
    id: 'aa-vortex',
    value: '0.20',
    desc: 'Vortexes (10/10)',
    data: [
      { value: '0.20', desc: 'Vortexes (10/10)' },
      { value: '0.18', desc: 'Vortexes (9/10)' },
      { value: '0', desc: 'Vortexes (8/10)' },
      { value: '0', desc: 'Vortexes (7/10)' },
      { value: '0', desc: 'Vortexes (6/10)' },
      { value: '0', desc: 'Vortexes (5/10)' },
      { value: '0', desc: 'Vortexes (4/10)' },
      { value: '0', desc: 'Vortexes (3/10)' },
      { value: '0', desc: 'Vortexes (2/10)' },
      { value: '0', desc: 'Vortexes (1/10)' },
      { value: '0', desc: 'Vortexes (0/10)' }
    ]
  }
];

export const magSpellFocusAAContext = [
  {
    id: 'aa-msyn',
    value: '11',
    desc: 'Conjurer\'s Synergy (11/11)',
    data: [
      { value: '11', desc: 'Conjurer\'s Synergy (11/11)' },
      { value: '10', desc: 'Conjurer\'s Synergy (10/11)' },
      { value: '9', desc: 'Conjurer\'s Synergy (9/11)' },
      { value: '8', desc: 'Conjurer\'s Synergy (8/11)' },
      { value: '7', desc: 'Conjurer\'s Synergy (7/11)' },
      { value: '6', desc: 'Conjurer\'s Synergy (6/11)' },
      { value: '5', desc: 'Conjurer\'s Synergy (5/11)' },
      { value: '4', desc: 'Conjurer\'s Synergy (4/11)' },
      { value: '3', desc: 'Conjurer\'s Synergy (3/11)' },
      { value: '2', desc: 'Conjurer\'s Synergy (2/11)' },
      { value: '1', desc: 'Conjurer\'s Synergy (1/11)' },
      { value: '0', desc: 'Conjurer\'s Synergy (0/11)' }
    ]
  },
  {
    id: 'aa-beam-molten',
    value: '0.20',
    desc: 'Beam of Molten Shieldstone (11/11)',
    data: [
      { value: '0.20', desc: 'Beam of Molten Shieldstone (11/11)' },
      { value: '0.18', desc: 'Beam of Molten Shieldstone (10/11)' },
      { value: '0.16', desc: 'Beam of Molten Shieldstone (9/11)' },
      { value: '0', desc: 'Beam of Molten Shieldstone (8/11)' },
      { value: '0', desc: 'Beam of Molten Shieldstone (7/11)' },
      { value: '0', desc: 'Beam of Molten Shieldstone (6/11)' },
      { value: '0', desc: 'Beam of Molten Shieldstone (5/11)' },
      { value: '0', desc: 'Beam of Molten Shieldstone (4/11)' },
      { value: '0', desc: 'Beam of Molten Shieldstone (3/11)' },
      { value: '0', desc: 'Beam of Molten Shieldstone (2/11)' },
      { value: '0', desc: 'Beam of Molten Shieldstone (1/11)' },
      { value: '0', desc: 'Beam of Molten Shieldstone (0/11)' }
    ]
  },
  {
    id: 'aa-beam-scythes',
    value: '0.20',
    desc: 'Beam of Scythes (11/11)',
    data: [
      { value: '0.20', desc: 'Beam of Scythes (11/11)' },
      { value: '0.18', desc: 'Beam of Scythes (10/11)' },
      { value: '0.16', desc: 'Beam of Scythes (9/11)' },
      { value: '0', desc: 'Beam of Scythes (8/11)' },
      { value: '0', desc: 'Beam of Scythes (7/11)' },
      { value: '0', desc: 'Beam of Scythes (6/11)' },
      { value: '0', desc: 'Beam of Scythes (5/11)' },
      { value: '0', desc: 'Beam of Scythes (4/11)' },
      { value: '0', desc: 'Beam of Scythes (3/11)' },
      { value: '0', desc: 'Beam of Scythes (2/11)' },
      { value: '0', desc: 'Beam of Scythes (1/11)' },
      { value: '0', desc: 'Beam of Scythes (0/11)' }
    ]
  },
  {
    id: 'aa-boltm',
    value: '0.20',
    desc: 'Bolt of Molten Shieldstone (11/11)',
    data: [
      { value: '0.20', desc: 'Bolt of Molten Shieldstone (11/11)' },
      { value: '0.18', desc: 'Bolt of Molten Shieldstone (10/11)' },
      { value: '0.16', desc: 'Bolt of Molten Shieldstone (9/11)' },
      { value: '0', desc: 'Bolt of Molten Shieldstone (8/11)' },
      { value: '0', desc: 'Bolt of Molten Shieldstone (7/11)' },
      { value: '0', desc: 'Bolt of Molten Shieldstone (6/11)' },
      { value: '0', desc: 'Bolt of Molten Shieldstone (5/11)' },
      { value: '0', desc: 'Bolt of Molten Shieldstone (4/11)' },
      { value: '0', desc: 'Bolt of Molten Shieldstone (3/11)' },
      { value: '0', desc: 'Bolt of Molten Shieldstone (2/11)' },
      { value: '0', desc: 'Bolt of Molten Shieldstone (1/11)' },
      { value: '0', desc: 'Bolt of Molten Shieldstone (0/11)' }
    ]
  },
  {
    id: 'aa-coronal',
    value: '0.20',
    desc: 'Coronal Rain (11/11)',
    data: [
      { value: '0.20', desc: 'Coronal Rain (11/11)' },
      { value: '0.18', desc: 'Coronal Rain (10/11)' },
      { value: '0.16', desc: 'Coronal Rain (9/11)' },
      { value: '0', desc: 'Coronal Rain (8/11)' },
      { value: '0', desc: 'Coronal Rain (7/11)' },
      { value: '0', desc: 'Coronal Rain (6/11)' },
      { value: '0', desc: 'Coronal Rain (5/11)' },
      { value: '0', desc: 'Coronal Rain (4/11)' },
      { value: '0', desc: 'Coronal Rain (3/11)' },
      { value: '0', desc: 'Coronal Rain (2/11)' },
      { value: '0', desc: 'Coronal Rain (1/11)' },
      { value: '0', desc: 'Coronal Rain (0/11)' }
    ]
  },
  {
    id: 'aa-eradun',
    value: '0.20',
    desc: 'Eradicate the Unnatural (11/11)',
    data: [
      { value: '0.20', desc: 'Eradicate the Unnatural (11/11)' },
      { value: '0.18', desc: 'Eradicate the Unnatural (10/11)' },
      { value: '0.16', desc: 'Eradicate the Unnatural (9/11)' },
      { value: '0', desc: 'Eradicate the Unnatural (8/11)' },
      { value: '0', desc: 'Eradicate the Unnatural (7/11)' },
      { value: '0', desc: 'Eradicate the Unnatural (6/11)' },
      { value: '0', desc: 'Eradicate the Unnatural (5/11)' },
      { value: '0', desc: 'Eradicate the Unnatural (4/11)' },
      { value: '0', desc: 'Eradicate the Unnatural (3/11)' },
      { value: '0', desc: 'Eradicate the Unnatural (2/11)' },
      { value: '0', desc: 'Eradicate the Unnatural (1/11)' },
      { value: '0', desc: 'Eradicate the Unnatural (0/11)' }
    ]
  },
  {
    id: 'aa-fickle',
    value: '0.20',
    desc: 'Fickle Conflagration (10/10)',
    data: [
      { value: '0.20', desc: 'Fickle Conflagration (10/10)' },
      { value: '0.18', desc: 'Fickle Conflagration (9/10)' },
      { value: '0.16', desc: 'Fickle Conflagration (8/10)' },
      { value: '0.14', desc: 'Fickle Conflagration (7/10)' },
      { value: '0.12', desc: 'Fickle Conflagration (6/10)' },
      { value: '0.1', desc: 'Fickle Conflagration (5/10)' },
      { value: '0.08', desc: 'Fickle Conflagration (4/10)' },
      { value: '0.06', desc: 'Fickle Conflagration (3/10)' },
      { value: '0.04', desc: 'Fickle Conflagration (2/10)' },
      { value: '0.02', desc: 'Fickle Conflagration (1/10)' },
      { value: '0', desc: 'Fickle Conflagration (0/10)' }
    ]
  },
  {
    id: 'aa-flames-pwr',
    value: '4',
    desc: 'Flames of Power (4/4)',
    data: [
      { value: '4', desc: 'Flames of Power (4/4)' },
      { value: '3', desc: 'Flames of Power (3/4)' },
      { value: '2', desc: 'Flames of Power (2/4)' },
      { value: '1', desc: 'Flames of Power (1/4)' },
      { value: '0', desc: 'Flames of Power (0/4)' }
    ]
  },
  {
    id: 'aa-sear',
    value: '0.20',
    desc: 'Searing Blast (11/11)',
    data: [
      { value: '0.20', desc: 'Searing Blast (11/11)' },
      { value: '0.18', desc: 'Searing Blast (10/11)' },
      { value: '0.16', desc: 'Searing Blast (9/11)' },
      { value: '0', desc: 'Searing Blast (8/11)' },
      { value: '0', desc: 'Searing Blast (7/11)' },
      { value: '0', desc: 'Searing Blast (6/11)' },
      { value: '0', desc: 'Searing Blast (5/11)' },
      { value: '0', desc: 'Searing Blast (4/11)' },
      { value: '0', desc: 'Searing Blast (3/11)' },
      { value: '0', desc: 'Searing Blast (2/11)' },
      { value: '0', desc: 'Searing Blast (1/11)' },
      { value: '0', desc: 'Searing Blast (0/11)' }
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
    id: 'aa-raincut',
    value: '0.20',
    desc: 'Rain of Cutlasses (11/11)',
    data: [
      { value: '0.20', desc: 'Rain of Cutlasses (11/11)' },
      { value: '0.18', desc: 'Rain of Cutlasses (10/11)' },
      { value: '0.16', desc: 'Rain of Cutlasses (9/11)' },
      { value: '0', desc: 'Rain of Cutlasses (8/11)' },
      { value: '0', desc: 'Rain of Cutlasses (7/11)' },
      { value: '0', desc: 'Rain of Cutlasses (6/11)' },
      { value: '0', desc: 'Rain of Cutlasses (5/11)' },
      { value: '0', desc: 'Rain of Cutlasses (4/11)' },
      { value: '0', desc: 'Rain of Cutlasses (3/11)' },
      { value: '0', desc: 'Rain of Cutlasses (2/11)' },
      { value: '0', desc: 'Rain of Cutlasses (1/11)' },
      { value: '0', desc: 'Rain of Cutlasses (0/11)' }
    ]
  },
  {
    id: 'aa-shockd',
    value: '11',
    desc: 'Shock of Darksteel  (11/11)',
    data: [
      { value: '11', desc: 'Shock of Darksteel (11/11)' },
      { value: '10', desc: 'Shock of Darksteel (10/11)' },
      { value: '9', desc: 'Shock of Darksteel (9/11)' },
      { value: '0.16', desc: 'Shock of Darksteel (8/11)' },
      { value: '0.14', desc: 'Shock of Darksteel (7/11)' },
      { value: '0.12', desc: 'Shock of Darksteel (6/11)' },
      { value: '0.10', desc: 'Shock of Darksteel (5/11)' },
      { value: '0.08', desc: 'Shock of Darksteel (4/11)' },
      { value: '0.06', desc: 'Shock of Darksteel (3/11)' },
      { value: '0.04', desc: 'Shock of Darksteel (2/11)' },
      { value: '0.02', desc: 'Shock of Darksteel (1/11)' },
      { value: '0', desc: 'Shock of Darksteel (0/11)' }
    ]
  },
  {
    id: 'aa-spearm',
    value: '11',  // special case to check new spear vs old. uses 16%
    desc: 'Spear of Molten Shieldstone (11/11)',
    data: [
      { value: '11', desc: 'Spear of Molten Shieldstone (11/11)' },
      { value: '10', desc: 'Spear of Molten Shieldstone (10/11)' },
      { value: '9', desc: 'Spear of Molten Shieldstone (9/11)' },
      { value: '0.16', desc: 'Spear of Molten Shieldstone (8/11)' },
      { value: '0.14', desc: 'Spear of Molten Shieldstone (7/11)' },
      { value: '0.12', desc: 'Spear of Molten Shieldstone (6/11)' },
      { value: '0.10', desc: 'Spear of Molten Shieldstone (5/11)' },
      { value: '0.08', desc: 'Spear of Molten Shieldstone (4/11)' },
      { value: '0.06', desc: 'Spear of Molten Shieldstone (3/11)' },
      { value: '0.04', desc: 'Spear of Molten Shieldstone (2/11)' },
      { value: '0.02', desc: 'Spear of Molten Shieldstone (1/11)' },
      { value: '0', desc: 'Spear of Molten Shieldstone (0/11)' }
    ]
  },
  {
    id: 'aa-storm',
    value: '0.50',
    desc: 'Storm of Many (11/11)',
    data: [
      { value: '0.50', desc: 'Storm of Many (11/11)' },
      { value: '0.45', desc: 'Storm of Many (10/11)' },
      { value: '0.40', desc: 'Storm of Many (9/11)' },
      { value: '0', desc: 'Storm of Many (8/11)' },
      { value: '0', desc: 'Storm of Many (7/11)' },
      { value: '0', desc: 'Storm of Many (6/11)' },
      { value: '0', desc: 'Storm of Many (5/11)' },
      { value: '0', desc: 'Storm of Many (4/11)' },
      { value: '0', desc: 'Storm of Many (3/11)' },
      { value: '0', desc: 'Storm of Many (2/11)' },
      { value: '0', desc: 'Storm of Many (1/11)' },
      { value: '0', desc: 'Storm of Many (0/11)' }
    ]
  }
];

export const encSpellFocusAAContext = [
  {
    id: 'aa-esyn',
    value: '11',
    desc: 'Beguiler\'s Synergy (11/11)',
    data: [
      { value: '11', desc: 'Beguiler\'s Synergy (11/11)' },
      { value: '10', desc: 'Beguiler\'s Synergy (10/11)' },
      { value: '9', desc: 'Beguiler\'s Synergy (9/11)' },
      { value: '8', desc: 'Beguiler\'s Synergy (8/11)' },
      { value: '7', desc: 'Beguiler\'s Synergy (7/11)' },
      { value: '6', desc: 'Beguiler\'s Synergy (6/11)' },
      { value: '5', desc: 'Beguiler\'s Synergy (5/11)' },
      { value: '4', desc: 'Beguiler\'s Synergy (4/11)' },
      { value: '3', desc: 'Beguiler\'s Synergy (3/11)' },
      { value: '2', desc: 'Beguiler\'s Synergy (2/11)' },
      { value: '1', desc: 'Beguiler\'s Synergy (1/11)' },
      { value: '0', desc: 'Beguiler\'s Synergy (0/11)' }
    ]
  },
  {
    id: 'aa-chromarift',
    value: '0.20',
    desc: 'Chromarift (11/11)',
    data: [
      { value: '0.20', desc: 'Chromarift (11/11)' },
      { value: '0.18', desc: 'Chromarift (10/11)' },
      { value: '0.16', desc: 'Chromarift (9/11)' },
      { value: '0', desc: 'Chromarift (8/11)' },
      { value: '0', desc: 'Chromarift (7/11)' },
      { value: '0', desc: 'Chromarift (6/11)' },
      { value: '0', desc: 'Chromarift (5/11)' },
      { value: '0', desc: 'Chromarift (4/11)' },
      { value: '0', desc: 'Chromarift (3/11)' },
      { value: '0', desc: 'Chromarift (2/11)' },
      { value: '0', desc: 'Chromarift (1/11)' },
      { value: '0', desc: 'Chromarift (0/11)' }
    ]
  },
  {
    id: 'aa-chromablink',
    value: '0.20',
    desc: 'Chromatic Blink (11/11)',
    data: [
      { value: '0.20', desc: 'Chromatic Blink (11/11)' },
      { value: '0.18', desc: 'Chromatic Blink (10/11)' },
      { value: '0.16', desc: 'Chromatic Blink (9/11)' },
      { value: '0', desc: 'Chromatic Blink (8/11)' },
      { value: '0', desc: 'Chromatic Blink (7/11)' },
      { value: '0', desc: 'Chromatic Blink (6/11)' },
      { value: '0', desc: 'Chromatic Blink (5/11)' },
      { value: '0', desc: 'Chromatic Blink (4/11)' },
      { value: '0', desc: 'Chromatic Blink (3/11)' },
      { value: '0', desc: 'Chromatic Blink (2/11)' },
      { value: '0', desc: 'Chromatic Blink (1/11)' },
      { value: '0', desc: 'Chromatic Blink (0/11)' }
    ]
  },
  {
    id: 'aa-gravity-twist',
    value: '0.20',
    desc: 'Gravity Twist (10/10)',
    data: [
      { value: '0.20', desc: 'Gravity Twist (10/10)' },
      { value: '0.18', desc: 'Gravity Twist (9/10)' },
      { value: '0.16', desc: 'Gravity Twist (8/10)' },
      { value: '0.14', desc: 'Gravity Twist (7/10)' },
      { value: '0.12', desc: 'Gravity Twist (6/10)' },
      { value: '0.10', desc: 'Gravity Twist (5/10)' },
      { value: '0.08', desc: 'Gravity Twist (4/10)' },
      { value: '0.06', desc: 'Gravity Twist (3/10)' },
      { value: '0.04', desc: 'Gravity Twist (2/10)' },
      { value: '0.02', desc: 'Gravity Twist (1/10)' },
      { value: '0', desc: 'Gravity Twist (0/10)' }
    ]
  },
  {
    id: 'aa-mindsunder',
    value: '11',
    desc: 'Mindsunder (11/11)',
    data: [
      { value: '11', desc: 'Mindsunder (11/11)' },
      { value: '10', desc: 'Mindsunder (10/11)' },
      { value: '9', desc: 'Mindsunder (9/11)' },
      { value: '0.16', desc: 'Mindsunder (8/11)' },
      { value: '0.14', desc: 'Mindsunder (7/11)' },
      { value: '0.12', desc: 'Mindsunder (6/11)' },
      { value: '0.10', desc: 'Mindsunder (5/11)' },
      { value: '0.08', desc: 'Mindsunder (4/11)' },
      { value: '0.06', desc: 'Mindsunder (3/11)' },
      { value: '0.04', desc: 'Mindsunder (2/11)' },
      { value: '0.02', desc: 'Mindsunder (1/11)' },
      { value: '0', desc: 'Mindsunder (0/11)' }
    ]
  },
  {
    id: 'aa-poly-ass',
    value: '0.20',
    desc: 'Polyrefractive Assault (11/11)',
    data: [
      { value: '0.20', desc: 'Polyrefractive Assault (11/11)' },
      { value: '0.18', desc: 'Polyrefractive Assault (10/11)' },
      { value: '0.16', desc: 'Polyrefractive Assault (9/11)' },
      { value: '0', desc: 'Polyrefractive Assault (8/11)' },
      { value: '0', desc: 'Polyrefractive Assault (7/11)' },
      { value: '0', desc: 'Polyrefractive Assault (6/11)' },
      { value: '0', desc: 'Polyrefractive Assault (5/11)' },
      { value: '0', desc: 'Polyrefractive Assault (4/11)' },
      { value: '0', desc: 'Polyrefractive Assault (3/11)' },
      { value: '0', desc: 'Polyrefractive Assault (2/11)' },
      { value: '0', desc: 'Polyrefractive Assault (1/11)' },
      { value: '0', desc: 'Polyrefractive Assault (0/11)' }
    ]
  }
];

export const wizDPSAAContext = [
  {
    id: 'aa-afusion',
    value: 'AFU4',
    desc: 'Arcane Fusion (4/4)',
    data: [
      { value: 'AFU4', desc: 'Arcane Fusion (4/4)' },
      { value: 'AFU3', desc: 'Arcane Fusion (3/4)' },
      { value: 'AFU2', desc: 'Arcane Fusion (2/4)' },
      { value: 'AFU1', desc: 'Arcane Fusion (1/4)' },
      { value: 'NONE', desc: 'Arcane Fusion (0/4)' }
    ]
  },
  {
    id: 'aa-dadept',
    value: '0.08',
    desc: 'Destructive Adept (8/8)',
    data: [
      { value: '0.08', desc: 'Destructive Adept (8/8)' },
      { value: '0.07', desc: 'Destructive Adept (7/8)' },
      { value: '0.06', desc: 'Destructive Adept (6/8)' },
      { value: '0.05', desc: 'Destructive Adept (5/8)' },
      { value: '0.04', desc: 'Destructive Adept (4/8)' },
      { value: '0.03', desc: 'Destructive Adept (3/8)' },
      { value: '0.02', desc: 'Destructive Adept (2/8)' },
      { value: '0.01', desc: 'Destructive Adept (1/8)' },
      { value: '0', desc: 'Destructive Adept (0/8)' }
    ]
  },
  {
    id: 'aa-destfury',
    value: '325',
    desc: 'Destructive Fury (36/36)',
    data: [
      { value: '325', desc: 'Destructive Fury (36/36)' },
      { value: '320', desc: 'Destructive Fury (35/36)' },
      { value: '315', desc: 'Destructive Fury (34/36)' },
      { value: '310', desc: 'Destructive Fury (33/36)' },
      { value: '300', desc: 'Destructive Fury (32/36)' },
      { value: '290', desc: 'Destructive Fury (31/36)' },
      { value: '280', desc: 'Destructive Fury (30/36)' },
      { value: '278', desc: 'Destructive Fury (29/36)' },
      { value: '276', desc: 'Destructive Fury (28/36)' },
      { value: '274', desc: 'Destructive Fury (27/36)' },
      { value: '264', desc: 'Destructive Fury (26/36)' },
      { value: '254', desc: 'Destructive Fury (25/36)' },
      { value: '249', desc: 'Destructive Fury (24/36)' },
      { value: '242', desc: 'Destructive Fury (23/36)' },
      { value: '235', desc: 'Destructive Fury (22/36)' },
      { value: '228', desc: 'Destructive Fury (21/36)' },
      { value: '221', desc: 'Destructive Fury (20/36)' },
      { value: '214', desc: 'Destructive Fury (19/36)' },
      { value: '207', desc: 'Destructive Fury (18/36)' },
      { value: '200', desc: 'Destructive Fury (17/36)' },
      { value: '193', desc: 'Destructive Fury (16/36)' },
      { value: '186', desc: 'Destructive Fury (15/36)' },
      { value: '179', desc: 'Destructive Fury (14/36)' },
      { value: '172', desc: 'Destructive Fury (13/36)' },
      { value: '165', desc: 'Destructive Fury (12/36)' },
      { value: '160', desc: 'Destructive Fury (11/36)' },
      { value: '155', desc: 'Destructive Fury (10/36)' },
      { value: '150', desc: 'Destructive Fury (9/36)' },
      { value: '141', desc: 'Destructive Fury (8/36)' },
      { value: '133', desc: 'Destructive Fury (7/36)' },
      { value: '125', desc: 'Destructive Fury (6/36)' },
      { value: '115', desc: 'Destructive Fury (5/36)' },
      { value: '107', desc: 'Destructive Fury (4/36)' },
      { value: '100', desc: 'Destructive Fury (3/36)' },
      { value: '60', desc: 'Destructive Fury (2/36)' },
      { value: '30', desc: 'Destructive Fury (1/36)' },
      { value: '0', desc: 'Destructive Fury (0/36)' }
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
    value: 'FF9',
    desc: 'Force of Flame (9/9)',
    data: [
      { value: 'FF9', desc: 'Force of Flame (9/9)' },
      { value: 'FF8', desc: 'Force of Flame (8/9)' },
      { value: 'FF7', desc: 'Force of Flame (7/9)' },
      { value: 'FF6', desc: 'Force of Flame (6/9)' },
      { value: 'FF5', desc: 'Force of Flame (5/9)' },
      { value: 'FF4', desc: 'Force of Flame (4/9)' }
    ]
  },
  {
    id: 'aa-forceice',
    value: 'FI9',
    desc: 'Force of Ice (9/9)',
    data: [
      { value: 'FI9', desc: 'Force of Ice (9/9)' },
      { value: 'FI8', desc: 'Force of Ice (8/9)' },
      { value: 'FI7', desc: 'Force of Ice (7/9)' },
      { value: 'FI6', desc: 'Force of Ice (6/9)' },
      { value: 'FI5', desc: 'Force of Ice (5/9)' },
      { value: 'FI4', desc: 'Force of Ice (4/9)' }
    ]
  },
  {
    id: 'aa-forcewill',
    value: 'FW29',
    desc: 'Force of Will (29/29)',
    data: [
      { value: 'FW29', desc: 'Force of Will (29/29)' },
      { value: 'FW28', desc: 'Force of Will (28/29)' },
      { value: 'FW27', desc: 'Force of Will (27/29)' },
      { value: 'FW26', desc: 'Force of Will (26/29)' },
      { value: 'FW25', desc: 'Force of Will (25/29)' },
      { value: 'FW24', desc: 'Force of Will (24/29)' }
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
    value: '4000',
    desc: 'Sorcerer\'s Vengeance (20/20)',
    data: [
      { value: '4000', desc: 'Sorcerer\'s Vengeance (20/20)' },
      { value: '3650', desc: 'Sorcerer\'s Vengeance (19/20)' },
      { value: '3375', desc: 'Sorcerer\'s Vengeance (18/20)' },
      { value: '3100', desc: 'Sorcerer\'s Vengeance (17/20)' },
      { value: '2825', desc: 'Sorcerer\'s Vengeance (16/20)' },
      { value: '2550', desc: 'Sorcerer\'s Vengeance (15/20)' },
      { value: '2275', desc: 'Sorcerer\'s Vengeance (14/20)' },
      { value: '2000', desc: 'Sorcerer\'s Vengeance (13/20)' },
      { value: '1800', desc: 'Sorcerer\'s Vengeance (12/20)' },
      { value: '1600', desc: 'Sorcerer\'s Vengeance (11/20)' },
      { value: '1400', desc: 'Sorcerer\'s Vengeance (10/20)' },
      { value: '1200', desc: 'Sorcerer\'s Vengeance (9/20)' },
      { value: '1100', desc: 'Sorcerer\'s Vengeance (8/20)' },
      { value: '1000', desc: 'Sorcerer\'s Vengeance (7/20)' },
      { value: '900', desc: 'Sorcerer\'s Vengeance (6/20)' },
      { value: '800', desc: 'Sorcerer\'s Vengeance (5/20)' },
      { value: '700', desc: 'Sorcerer\'s Vengeance (4/20)' },
      { value: '600', desc: 'Sorcerer\'s Vengeance (3/20)' },
      { value: '400', desc: 'Sorcerer\'s Vengeance (2/20)' },
      { value: '200', desc: 'Sorcerer\'s Vengeance (1/20)' },
      { value: '0', desc: 'Sorcerer\'s Vengeance (0/20)' }
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
    value: '0.20',
    desc: 'Twinproc (8/8)',
    data: [
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

export const magDPSAAContext = [
  {
    id: 'aa-destfury',
    value: '340',
    desc: 'Destructive Fury (38/38)',
    data: [
      { value: '340', desc: 'Destructive Fury (38/38)' },
      { value: '335', desc: 'Destructive Fury (37/38)' },
      { value: '330', desc: 'Destructive Fury (36/38)' },
      { value: '320', desc: 'Destructive Fury (35/38)' },
      { value: '310', desc: 'Destructive Fury (34/38)' },
      { value: '301', desc: 'Destructive Fury (33/38)' },
      { value: '296', desc: 'Destructive Fury (32/38)' },
      { value: '291', desc: 'Destructive Fury (31/38)' },
      { value: '286', desc: 'Destructive Fury (30/38)' },
      { value: '279', desc: 'Destructive Fury (29/38)' },
      { value: '272', desc: 'Destructive Fury (28/38)' },
      { value: '265', desc: 'Destructive Fury (27/38)' },
      { value: '251', desc: 'Destructive Fury (26/38)' },
      { value: '238', desc: 'Destructive Fury (25/38)' },
      { value: '230', desc: 'Destructive Fury (24/38)' },
      { value: '222', desc: 'Destructive Fury (23/38)' },
      { value: '214', desc: 'Destructive Fury (22/38)' },
      { value: '206', desc: 'Destructive Fury (21/38)' },
      { value: '199', desc: 'Destructive Fury (20/38)' },
      { value: '192', desc: 'Destructive Fury (19/38)' },
      { value: '185', desc: 'Destructive Fury (18/38)' },
      { value: '180', desc: 'Destructive Fury (17/38)' },
      { value: '175', desc: 'Destructive Fury (16/38)' },
      { value: '170', desc: 'Destructive Fury (15/38)' },
      { value: '165', desc: 'Destructive Fury (14/38)' },
      { value: '160', desc: 'Destructive Fury (13/38)' },
      { value: '155', desc: 'Destructive Fury (12/38)' },
      { value: '150', desc: 'Destructive Fury (11/38)' },
      { value: '145', desc: 'Destructive Fury (10/38)' },
      { value: '140', desc: 'Destructive Fury (9/38)' },
      { value: '135', desc: 'Destructive Fury (8/38)' },
      { value: '130', desc: 'Destructive Fury (7/38)' },
      { value: '125', desc: 'Destructive Fury (6/38)' },
      { value: '115', desc: 'Destructive Fury (5/38)' },
      { value: '107', desc: 'Destructive Fury (4/38)' },
      { value: '100', desc: 'Destructive Fury (3/38)' },
      { value: '60', desc: 'Destructive Fury (2/38)' },
      { value: '30', desc: 'Destructive Fury (1/38)' },
      { value: '0', desc: 'Destructive Fury (0/38)  ' }
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
    value: 'FE18',
    desc: 'Force of Elements (18/18)',
    data: [
      { value: 'FE18', desc: 'Force of Elements (18/18)' },
      { value: 'FE17', desc: 'Force of Elements (17/18)' },
      { value: 'FE16', desc: 'Force of Elements (16/18)' },
      { value: 'FE15', desc: 'Force of Elements (15/18)' },
      { value: 'FE14', desc: 'Force of Elements (14/18)' },
      { value: 'FE13', desc: 'Force of Elements (13/18)' }
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
    value: '12',
    desc: 'Steel Vengeance (12/12)',
    data: [
      { value: '12', desc: 'Steel Vengeance (12/12)' },
      { value: '11', desc: 'Steel Vengeance (11/12)' },
      { value: '10', desc: 'Steel Vengeance (10/12)' },
      { value: '0', desc: 'Steel Vengeance (0/12)' }
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
    value: '0.20',
    desc: 'Twinproc (8/8)',
    data: [
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
    value: '340',
    desc: 'Destructive Fury (38/38)',
    data: [
      { value: '340', desc: 'Destructive Fury (38/38)' },
      { value: '335', desc: 'Destructive Fury (37/38)' },
      { value: '330', desc: 'Destructive Fury (36/38)' },
      { value: '320', desc: 'Destructive Fury (35/38)' },
      { value: '310', desc: 'Destructive Fury (34/38)' },
      { value: '301', desc: 'Destructive Fury (33/38)' },
      { value: '296', desc: 'Destructive Fury (32/38)' },
      { value: '291', desc: 'Destructive Fury (31/38)' },
      { value: '286', desc: 'Destructive Fury (30/38)' },
      { value: '279', desc: 'Destructive Fury (29/38)' },
      { value: '272', desc: 'Destructive Fury (28/38)' },
      { value: '265', desc: 'Destructive Fury (27/38)' },
      { value: '251', desc: 'Destructive Fury (26/38)' },
      { value: '238', desc: 'Destructive Fury (25/38)' },
      { value: '230', desc: 'Destructive Fury (24/38)' },
      { value: '222', desc: 'Destructive Fury (23/38)' },
      { value: '214', desc: 'Destructive Fury (22/38)' },
      { value: '206', desc: 'Destructive Fury (21/38)' },
      { value: '199', desc: 'Destructive Fury (20/38)' },
      { value: '192', desc: 'Destructive Fury (19/38)' },
      { value: '185', desc: 'Destructive Fury (18/38)' },
      { value: '180', desc: 'Destructive Fury (17/38)' },
      { value: '175', desc: 'Destructive Fury (16/38)' },
      { value: '170', desc: 'Destructive Fury (15/38)' },
      { value: '165', desc: 'Destructive Fury (14/38)' },
      { value: '160', desc: 'Destructive Fury (13/38)' },
      { value: '155', desc: 'Destructive Fury (12/38)' },
      { value: '150', desc: 'Destructive Fury (11/38)' },
      { value: '145', desc: 'Destructive Fury (10/38)' },
      { value: '140', desc: 'Destructive Fury (9/38)' },
      { value: '135', desc: 'Destructive Fury (8/38)' },
      { value: '130', desc: 'Destructive Fury (7/38)' },
      { value: '125', desc: 'Destructive Fury (6/38)' },
      { value: '115', desc: 'Destructive Fury (5/38)' },
      { value: '107', desc: 'Destructive Fury (4/38)' },
      { value: '100', desc: 'Destructive Fury (3/38)' },
      { value: '60', desc: 'Destructive Fury (2/38)' },
      { value: '30', desc: 'Destructive Fury (1/38)' },
      { value: '0', desc: 'Destructive Fury (0/38)  ' }
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
    value: '0.20',
    desc: 'Twinproc (8/8)',
    data: [
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
