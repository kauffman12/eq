export const globals = {
  VERSION: 'Version 0.83',
  MAGE_TITLE: 'EQ Mage DPS Tool',
  WIZ_TITLE: 'EQ Wizard DPS Tool'
}

// wizard spells to display in spell drop down
export const wizSpellList = [
  'CF', 'CS', 'DF', 'EF', 'FU', 'ER', 'ES', 'FA',
  'FC', 'MB', 'SV', 'WF', 'WE'
];

// mage spells to display in spell drop down
export const mageSpellList = [
  'BS', 'CF', 'CR', 'FA', 'FC', 'RC', 'RS', 'SB',
  'SS', 'SM'
];

// values need to be strings for HTML dom nodes
export const basicDmgFocusContext = [
  {
    id: 'eye-of-decay',
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
    id: 'worn-type3augs',
    value: 'true',
    desc: 'Use Relevant Type3 Augs',
    data: [
      { value: 'true', desc: 'Use Relevant Type3 Augs' },
      { value: 'false', desc: 'Use No Type3 Augs' }
    ]
  },
  {
    id: 'worn-head-focus',
    value: '0.84',
    desc: 'Velazul\'s Cap',
    data: [
      { value: '0.84', desc: 'Velazul\'s Cap' },
      { value: '0.66', desc: 'Selrach\'s Cap' },
      { value: '0.825', desc: 'Deathseeker\'s Cap' },
      { value: '0.65', desc: 'Crypt-Hunter\'s Cap' },
      { value: '0', desc: 'No Cap Selected' }
    ]
  },
  {
    id: 'worn-hands-focus',
    value: '0.84',
    desc: 'Velazul\'s Gloves',
    data: [
      { value: '0.84', desc: 'Velazul\'s Gloves' },
      { value: '0.66', desc: 'Selrach\'s Gloves' },
      { value: '0.825', desc: 'Deathseeker\'s Gloves' },
      { value: '0.65', desc: 'Crypt-Hunter\'s Gloves' },
      { value: '0', desc: 'No Gloves Selected' }
    ]
  },
  {
    id: 'worn-chest-focus',
    value: '0.07',
    desc: 'Velazul\'s Robe',
    data: [
      { value: '0.07', desc: 'Velazul\'s Robe' },
      { value: '0.05', desc: 'Selrach\'s Robe' },
      { value: '0.07', desc: 'Deathseeker\'s Robe' },
      { value: '0.05', desc: 'Crypt-Hunter\'s Robe' },
      { value: '0', desc: 'No Robe Selected' }
    ]
  },
  {
    id: 'worn-arms-focus',
    value: '0.84',
    desc: 'Velazul\'s Sleeves',
    data: [
      { value: '0.84', desc: 'Velazul\'s Sleeves' },
      { value: '0.66', desc: 'Selrach\'s Sleeves' },
      { value: '0.825', desc: 'Deathseeker\'s Sleeves' },
      { value: '0.65', desc: 'Crypt-Hunter\'s Sleeves' },
      { value: '0', desc: 'No Sleeves Selected' }
    ]
  },
  {
    id: 'staff-proc',
    value: 'NONE',
    desc: 'No Weapon Selected',
    data: [
      { value: 'BFVI', desc: 'Nightfear\'s Halo' },
      { value: 'VOSIV', desc: 'Darkened Trakanon\'s Tooth' },
      { value: 'WOC4', desc: 'Advisor\'s Guide' },
      { value: 'HOM3', desc: 'Bronzewood Mindstaff' },
      { value: 'FOMXV', desc: 'High Bokon Mangling Staff' },
      { value: 'SOFXIV', desc: 'Staff of Undead Legions' },
      { value: 'SOFXIII', desc: 'Fleshburner of Boromas' },
      { value: 'FOMXIII', desc: 'Beater of the Teeth' },
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
      { value: '500-proconly', desc: 'Emblazoned Belt of Boromas' },
      { value: '1000-magic', desc: 'Parogressio' },
      { value: '500-fire', desc: 'Burning Sash of Ro' },
      { value: 'NONE', desc: 'No Belt Selected' }
    ]
  },
  {
    id: 'add-dps-aug1',
    value: 'NONE',
    desc: 'No Additional Aug1 Selected',
    data: [
      { value: 'BOIX', desc: 'Bone Shards of Frozen Marrow' },
      { value: 'FOMIX', desc: 'Ancient Diamond Spellcharm' },
      { value: 'FOMVII', desc: 'Tempest Magic' },
      { value: 'FCVII', desc: 'The Heart of Narikor' },
      { value: 'SOFV', desc: 'Spirit of the Gorgon' },
      { value: 'FSVII', desc: 'Living Golem Heart' },
      { value: 'NONE', desc: 'No Additional Aug1 Selected' }
    ]
  },
  {
    id: 'add-dps-aug2',
    value: 'NONE',
    desc: 'No Additional Aug2 Selected',
    data: [
      { value: 'BOIX', desc: 'Bone Shards of Frozen Marrow' },
      { value: 'FOMIX', desc: 'Ancient Diamond Spellcharm' },
      { value: 'FOMVII', desc: 'Tempest Magic' },
      { value: 'FCVII', desc: 'The Heart of Narikor' },
      { value: 'SOFV', desc: 'Spirit of the Gorgon' },
      { value: 'FSVII', desc: 'Living Golem Heart' },
      { value: 'NONE', desc: 'No Additional Aug2 Selected' }
    ]
  },
  {
    id: 'range-aug',
    value: 'NONE',
    desc: 'No Range Aug Selected',
    data: [
      { value: 'FSVI', desc: 'Sodkee\'s Sympathetic Stone' },
      { value: 'ASVI', desc: 'SaNril\'s Sympathetic Stone' },
      { value: 'NONE', desc: 'No Range Aug Selected' }
    ]
  }
];

export const wizSpellFocusAAContext = [
  {
    id: 'aa-evokers-synergy',
    value: '1',
    desc: 'Evoker\'s Synergy (10/10)',
    data: [
      { value: '1', desc: 'Evoker\'s Synergy (10/10)' },
      { value: '0.9', desc: 'Evoker\'s Synergy (9/10)' },
      { value: '0.8', desc: 'Evoker\'s Synergy (8/10)' },
      { value: '0.7', desc: 'Evoker\'s Synergy (7/10)' },
      { value: '0.6', desc: 'Evoker\'s Synergy (6/10)' },
      { value: '0.5', desc: 'Evoker\'s Synergy (5/10)' },
      { value: '0.4', desc: 'Evoker\'s Synergy (4/10)' },
      { value: '0.3', desc: 'Evoker\'s Synergy (3/10)' },
      { value: '0.2', desc: 'Evoker\'s Synergy (2/10)' },
      { value: '0.1', desc: 'Evoker\'s Synergy (1/10)' },
      { value: '0', desc: 'Evoker\'s Synergy (0/10)' }
    ]
  },
  {
    id: 'aa-focus-chaos',
    value: '0.16',
    desc: 'Chaos Scintillation (8/8)',
    data: [
      { value: '0.16', desc: 'Chaos Scintillation (8/8)' },
      { value: '0.14', desc: 'Chaos Scintillation (7/8)' },
      { value: '0.12', desc: 'Chaos Scintillation (6/8)' },
      { value: '0.1', desc: 'Chaos Scintillation (5/8)' },
      { value: '0.08', desc: 'Chaos Scintillation (4/8)' },
      { value: '0.06', desc: 'Chaos Scintillation (3/8)' },
      { value: '0.04', desc: 'Chaos Scintillation (2/8)' },
      { value: '0.02', desc: 'Chaos Scintillation (1/8)' },
      { value: '0', desc: 'Chaos Scintillation (0/8)' }
    ]
  },
  {
    id: 'aa-focus-claws',
    value: '0.16',
    desc: 'Claws (8/8)',
    data: [
      { value: '0.16', desc: 'Claws (8/8)' },
      { value: '0.14', desc: 'Claws (7/8)' },
      { value: '0.12', desc: 'Claws (6/8)' },
      { value: '0.1', desc: 'Claws (5/8)' },
      { value: '0.08', desc: 'Claws (4/8)' },
      { value: '0.06', desc: 'Claws (3/8)' },
      { value: '0.04', desc: 'Claws (2/8)' },
      { value: '0.02', desc: 'Claws (1/8)' },
      { value: '0', desc: 'Claws (0/8)' }
    ]
  },
  {
    id: 'aa-focus-cloudburst',
    value: '0.16',
    desc: 'Cloudburst Stormstrike (8/8)',
    data: [
      { value: '0.16', desc: 'Cloudburst Stormstrike (8/8)' },
      { value: '0.14', desc: 'Cloudburst Stormstrike (7/8)' },
      { value: '0.12', desc: 'Cloudburst Stormstrike (6/8)' },
      { value: '0.1', desc: 'Cloudburst Stormstrike (5/8)' },
      { value: '0.08', desc: 'Cloudburst Stormstrike (4/8)' },
      { value: '0.06', desc: 'Cloudburst Stormstrike (3/8)' },
      { value: '0.04', desc: 'Cloudburst Stormstrike (2/8)' },
      { value: '0.02', desc: 'Cloudburst Stormstrike (1/8)' },
      { value: '0', desc: 'Cloudburst Stormstrike (0/8)' }
    ]
  },
  {
    id: 'aa-focus-ethereal-flash',
    value: '0.16',
    desc: 'Ethereal Flash (8/8)',
    data: [
      { value: '0.16', desc: 'Ethereal Flash (8/8)' },
      { value: '0.14', desc: 'Ethereal Flash (7/8)' },
      { value: '0.12', desc: 'Ethereal Flash (6/8)' },
      { value: '0.10', desc: 'Ethereal Flash (5/8)' },
      { value: '0.08', desc: 'Ethereal Flash (4/8)' },
      { value: '0.06', desc: 'Ethereal Flash (3/8)' },
      { value: '0.04', desc: 'Ethereal Flash (2/8)' },
      { value: '0.02', desc: 'Ethereal Flash (1/8)' },
      { value: '0', desc: 'Ethereal Flash (0/8)' }
    ]
  },
  {
    id: 'aa-focus-ethereal-rimeblast',
    value: '0.16',
    desc: 'Ethereal Rimeblast (8/8)',
    data: [
      { value: '0.16', desc: 'Ethereal Rimeblast (8/8)' },
      { value: '0.14', desc: 'Ethereal Rimeblast (7/8)' },
      { value: '0.12', desc: 'Ethereal Rimeblast (6/8)' },
      { value: '0.1', desc: 'Ethereal Rimeblast (5/8)' },
      { value: '0.08', desc: 'Ethereal Rimeblast (4/8)' },
      { value: '0.06', desc: 'Ethereal Rimeblast (3/8)' },
      { value: '0.04', desc: 'Ethereal Rimeblast (2/8)' },
      { value: '0.02', desc: 'Ethereal Rimeblast (1/8)' },
      { value: '0', desc: 'Ethereal Rimeblast (0/8)' }
    ]
  },
  {
    id: 'aa-focus-ethereal-skyblaze',
    value: '0.16',
    desc: 'Ethereal Skyblaze (8/8)',
    data: [
      { value: '0.16', desc: 'Ethereal Skyblaze (8/8)' },
      { value: '0.14', desc: 'Ethereal Skyblaze (7/8)' },
      { value: '0.12', desc: 'Ethereal Skyblaze (6/8)' },
      { value: '0.1', desc: 'Ethereal Skyblaze (5/8)' },
      { value: '0.08', desc: 'Ethereal Skyblaze (4/8)' },
      { value: '0.06', desc: 'Ethereal Skyblaze (3/8)' },
      { value: '0.04', desc: 'Ethereal Skyblaze (2/8)' },
      { value: '0.02', desc: 'Ethereal Skyblaze (1/8)' },
      { value: '0', desc: 'Ethereal Skyblaze (0/8)' }
    ]
  },
  {
    id: 'aa-focus-flashchar',
    value: '0.16',
    desc: 'Flashchar (8/8)',
    data: [
      { value: '0.16', desc: 'Flashchar (8/8)' },
      { value: '0.14', desc: 'Flashchar (7/8)' },
      { value: '0.12', desc: 'Flashchar (6/8)' },
      { value: '0.1', desc: 'Flashchar (5/8)' },
      { value: '0.08', desc: 'Flashchar (4/8)' },
      { value: '0.06', desc: 'Flashchare (3/8)' },
      { value: '0.04', desc: 'Flashchar (2/8)' },
      { value: '0.02', desc: 'Flashchar (1/8)' },
      { value: '0', desc: 'Flashchar (0/8)' }
    ]
  },
  {
    id: 'aa-focus-purewild',
    value: '0.16',
    desc: 'Pure Wildflash (8/8)',
    data: [
      { value: '0.16', desc: 'Pure Wildflash (8/8)' },
      { value: '0.14', desc: 'Pure Wildflash (7/8)' },
      { value: '0.12', desc: 'Pure Wildflash (6/8)' },
      { value: '0.1', desc: 'Pure Wildflash (5/8)' },
      { value: '0.08', desc: 'Pure Wildflash (4/8)' },
      { value: '0.06', desc: 'Pure Wildflash (3/8)' },
      { value: '0.04', desc: 'Pure Wildflash (2/8)' },
      { value: '0.02', desc: 'Pure Wildflash (1/8)' },
      { value: '0', desc: 'Pure Wildflash (0/8)' }
    ]
  },
  {
    id: 'aa-focus-rains',
    value: '0.16',
    desc: 'Rains (8/8)',
    data: [
      { value: '0.16', desc: 'Rains (8/8)' },
      { value: '0.14', desc: 'Rains (7/8)' },
      { value: '0.12', desc: 'Rains (6/8)' },
      { value: '0.1', desc: 'Rains (5/8)' },
      { value: '0.08', desc: 'Rains (4/8)' },
      { value: '0.06', desc: 'Rains (3/8)' },
      { value: '0.04', desc: 'Rains (2/8)' },
      { value: '0.02', desc: 'Rains (1/8)' },
      { value: '0', desc: 'Rains (0/8)' }
    ]
  },
  {
    id: 'aa-focus-rimeblastcascade',
    value: '0.16',
    desc: 'Rimeblast Cascade (8/8)',
    data: [
      { value: '0.16', desc: 'Rimeblast Cascade (8/8)' },
      { value: '0.14', desc: 'Rimeblast Cascade (7/8)' },
      { value: '0.12', desc: 'Rimeblast Cascade (6/8)' },
      { value: '0.1', desc: 'Rimeblast Cascade (5/8)' },
      { value: '0.08', desc: 'Rimeblast Cascade (4/8)' },
      { value: '0.06', desc: 'Rimeblast Cascade (3/8)' },
      { value: '0.04', desc: 'Rimeblast Cascade (2/8)' },
      { value: '0.02', desc: 'Rimeblast Cascade (1/8)' },
      { value: '0', desc: 'Rimeblast Cascade (0/8)' }
    ]
  },
  {
    id: 'aa-focus-vortexes',
    value: '0.16',
    desc: 'Vortexes (8/8)',
    data: [
      { value: '0.16', desc: 'Vortexes (8/8)' },
      { value: '0.14', desc: 'Vortexes (7/8)' },
      { value: '0.12', desc: 'Vortexes (6/8)' },
      { value: '0.1', desc: 'Vortexes (5/8)' },
      { value: '0.08', desc: 'Vortexes (4/8)' },
      { value: '0.06', desc: 'Vortexes (3/8)' },
      { value: '0.04', desc: 'Vortexes (2/8)' },
      { value: '0.02', desc: 'Vortexes (1/8)' },
      { value: '0', desc: 'Vortexes (0/8)' }
    ]
  }
];

export const mageSpellFocusAAContext = [
  {
    id: 'aa-conjurers-synergy',
    value: '1',
    desc: 'Conjurer\'s Synergy (10/10)',
    data: [
      { value: '1', desc: 'Conjurer\'s Synergy (10/10)' },
      { value: '0.9', desc: 'Conjurer\'s Synergy (9/10)' },
      { value: '0.8', desc: 'Conjurer\'s Synergy (8/10)' },
      { value: '0.7', desc: 'Conjurer\'s Synergy (7/10)' },
      { value: '0.6', desc: 'Conjurer\'s Synergy (6/10)' },
      { value: '0.5', desc: 'Conjurer\'s Synergy (5/10)' },
      { value: '0.4', desc: 'Conjurer\'s Synergy (4/10)' },
      { value: '0.3', desc: 'Conjurer\'s Synergy (3/10)' },
      { value: '0.2', desc: 'Conjurer\'s Synergy (2/10)' },
      { value: '0.1', desc: 'Conjurer\'s Synergy (1/10)' },
      { value: '0', desc: 'Conjurer\'s Synergy (0/10)' }
    ]
  },
  {
    id: 'aa-focus-bolt-molten',
    value: '0.16',
    desc: 'Bolt of Molten Shieldstone (8/8)',
    data: [
      { value: '0.16', desc: 'Bolt of Molten Shieldstone (8/8)' },
      { value: '0.14', desc: 'Bolt of Molten Shieldstone (7/8)' },
      { value: '0.12', desc: 'Bolt of Molten Shieldstone (6/8)' },
      { value: '0.1', desc: 'Bolt of Molten Shieldstone (5/8)' },
      { value: '0.08', desc: 'Bolt of Molten Shieldstone (4/8)' },
      { value: '0.06', desc: 'Bolt of Molten Shieldstone (3/8)' },
      { value: '0.04', desc: 'Bolt of Molten Shieldstone (2/8)' },
      { value: '0.02', desc: 'Bolt of Molten Shieldstone (1/8)' },
      { value: '0', desc: 'Bolt of Molten Shieldstone (0/8)' }
    ]
  },
  {
    id: 'aa-focus-coronal-rain',
    value: '0.16',
    desc: 'Coronal Rain (8/8)',
    data: [
      { value: '0.16', desc: 'Coronal Rain (8/8)' },
      { value: '0.14', desc: 'Coronal Rain (7/8)' },
      { value: '0.12', desc: 'Coronal Rain (6/8)' },
      { value: '0.1', desc: 'Coronal Rain (5/8)' },
      { value: '0.08', desc: 'Coronal Rain (4/8)' },
      { value: '0.06', desc: 'Coronal Rain (3/8)' },
      { value: '0.04', desc: 'Coronal Rain (2/8)' },
      { value: '0.02', desc: 'Coronal Rain (1/8)' },
      { value: '0', desc: 'Coronal Rain (0/8)' }
    ]
  },
  {
    id: 'aa-focus-fickle-conflag',
    value: '0.16',
    desc: 'Fickle Conflagration (8/8)',
    data: [
      { value: '0.16', desc: 'Fickle Conflagration (8/8)' },
      { value: '0.14', desc: 'Fickle Conflagration (7/8)' },
      { value: '0.12', desc: 'Fickle Conflagration (6/8)' },
      { value: '0.1', desc: 'Fickle Conflagration (5/8)' },
      { value: '0.08', desc: 'Fickle Conflagration (4/8)' },
      { value: '0.06', desc: 'Fickle Conflagration (3/8)' },
      { value: '0.04', desc: 'Fickle Conflagration (2/8)' },
      { value: '0.02', desc: 'Fickle Conflagration (1/8)' },
      { value: '0', desc: 'Fickle Conflagration (0/8)' }
    ]
  },
  {
    id: 'aa-flames-of-power',
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
    id: 'aa-hastened-servant',
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
    id: 'aa-focus-rain-cutlasses',
    value: '0.16',
    desc: 'Rain of Cutlasses (8/8)',
    data: [
      { value: '0.16', desc: 'Rain of Cutlasses (8/8)' },
      { value: '0.14', desc: 'Rain of Cutlasses (7/8)' },
      { value: '0.12', desc: 'Rain of Cutlasses (6/8)' },
      { value: '0.1', desc: 'Rain of Cutlasses (5/8)' },
      { value: '0.08', desc: 'Rain of Cutlasses (4/8)' },
      { value: '0.06', desc: 'Rain of Cutlasses (3/8)' },
      { value: '0.04', desc: 'Rain of Cutlasses (2/8)' },
      { value: '0.02', desc: 'Rain of Cutlasses (1/8)' },
      { value: '0', desc: 'Rain of Cutlasses (0/8)' }
    ]
  },
  {
    id: 'aa-focus-spear-molten',
    value: '0.16',
    desc: 'Spear of Molten Shieldstone (8/8)',
    data: [
      { value: '0.16', desc: 'Spear of Molten Shieldstone (8/8)' },
      { value: '0.14', desc: 'Spear of Molten Shieldstone (7/8)' },
      { value: '0.12', desc: 'Spear of Molten Shieldstone (6/8)' },
      { value: '0.1', desc: 'Spear of Molten Shieldstone (5/8)' },
      { value: '0.08', desc: 'Spear of Molten Shieldstone (4/8)' },
      { value: '0.06', desc: 'Spear of Molten Shieldstone (3/8)' },
      { value: '0.04', desc: 'Spear of Molten Shieldstone (2/8)' },
      { value: '0.02', desc: 'Spear of Molten Shieldstone (1/8)' },
      { value: '0', desc: 'Spear of Molten Shieldstone (0/8)' }
    ]
  },
  {
    id: 'aa-focus-storm-many',
    value: '0.40',
    desc: 'Storm of Many (8/8)',
    data: [
      { value: '0.40', desc: 'Storm of Many (8/8)' },
      { value: '0.35', desc: 'Storm of Many (7/8)' },
      { value: '0.30', desc: 'Storm of Many (6/8)' },
      { value: '0.25', desc: 'Storm of Many (5/8)' },
      { value: '0.20', desc: 'Storm of Many (4/8)' },
      { value: '0.15', desc: 'Storm of Many (3/8)' },
      { value: '0.10', desc: 'Storm of Many (2/8)' },
      { value: '0.05', desc: 'Storm of Many (1/8)' },
      { value: '0', desc: 'Storm of Many (0/8)' }
    ]
  }
];

export const wizDPSAAContext = [
  {
    id: 'aa-arcane-fusion',
    value: 'AFU2',
    desc: 'Arcane Fusion (2/2)',
    data: [
      { value: 'AFU2', desc: 'Arcane Fusion (2/2)' },
      { value: 'AFU1', desc: 'Arcane Fusion (1/2)' },
      { value: 'NONE', desc: 'Arcane Fusion (0/2)' }
    ]
  },
  {
    id: 'aa-destructive-adept',
    value: '0.06',
    desc: 'Destructive Adept (6/6)',
    data: [
      { value: '0.06', desc: 'Destructive Adept (6/6)' },
      { value: '0.05', desc: 'Destructive Adept (5/6)' },
      { value: '0.04', desc: 'Destructive Adept (4/6)' },
      { value: '0.03', desc: 'Destructive Adept (3/6)' },
      { value: '0.02', desc: 'Destructive Adept (2/6)' },
      { value: '0.01', desc: 'Destructive Adept (1/6)' },
      { value: '0', desc: 'Destructive Adept (0/6)' }
    ]
  },
  {
    id: 'aa-destructive-fury',
    value: '310',
    desc: 'Destructive Fury (33/33)',
    data: [
      { value: '310', desc: 'Destructive Fury (33/33)' },
      { value: '300', desc: 'Destructive Fury (32/33)' },
      { value: '290', desc: 'Destructive Fury (31/33)' },
      { value: '280', desc: 'Destructive Fury (30/33)' },
      { value: '278', desc: 'Destructive Fury (29/33)' },
      { value: '276', desc: 'Destructive Fury (28/33)' },
      { value: '274', desc: 'Destructive Fury (27/33)' },
      { value: '264', desc: 'Destructive Fury (26/33)' },
      { value: '254', desc: 'Destructive Fury (25/33)' },
      { value: '249', desc: 'Destructive Fury (24/33)' },
      { value: '242', desc: 'Destructive Fury (23/33)' },
      { value: '235', desc: 'Destructive Fury (22/33)' },
      { value: '228', desc: 'Destructive Fury (21/33)' },
      { value: '221', desc: 'Destructive Fury (20/33)' },
      { value: '214', desc: 'Destructive Fury (19/33)' },
      { value: '207', desc: 'Destructive Fury (18/33)' },
      { value: '200', desc: 'Destructive Fury (17/33)' },
      { value: '193', desc: 'Destructive Fury (16/33)' },
      { value: '186', desc: 'Destructive Fury (15/33)' },
      { value: '179', desc: 'Destructive Fury (14/33)' },
      { value: '172', desc: 'Destructive Fury (13/33)' },
      { value: '165', desc: 'Destructive Fury (12/33)' },
      { value: '160', desc: 'Destructive Fury (11/33)' },
      { value: '155', desc: 'Destructive Fury (10/33)' },
      { value: '150', desc: 'Destructive Fury (9/33)' },
      { value: '141', desc: 'Destructive Fury (8/33)' },
      { value: '133', desc: 'Destructive Fury (7/33)' },
      { value: '125', desc: 'Destructive Fury (6/33)' },
      { value: '115', desc: 'Destructive Fury (5/33)' },
      { value: '107', desc: 'Destructive Fury (4/33)' },
      { value: '100', desc: 'Destructive Fury (3/33)' },
      { value: '60', desc: 'Destructive Fury (2/33)' },
      { value: '30', desc: 'Destructive Fury (1/33)' },
      { value: '0', desc: 'Destructive Fury (0/33)' }
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
    id: 'aa-force-of-flame',
    value: '6',
    desc: 'Force of Flame (6/6)',
    data: [
      { value: '6', desc: 'Force of Flame (6/6)' },
      { value: '5', desc: 'Force of Flame (5/6)' },
      { value: '4', desc: 'Force of Flame (4/6)' },
      { value: '3', desc: 'Force of Flame (3/6)' },
      { value: '2', desc: 'Force of Flame (2/6)' },
      { value: '1', desc: 'Force of Flame (1/6)' },
      { value: '0', desc: 'Force of Flame (0/6)' }
    ]
  },
  {
    id: 'aa-force-of-ice',
    value: '6',
    desc: 'Force of Ice (6/6)',
    data: [
      { value: '6', desc: 'Force of Ice (6/6)' },
      { value: '5', desc: 'Force of Ice (5/6)' },
      { value: '4', desc: 'Force of Ice (4/6)' },
      { value: '3', desc: 'Force of Ice (3/6)' },
      { value: '2', desc: 'Force of Ice (2/6)' },
      { value: '1', desc: 'Force of Ice (1/6)' },
      { value: '0', desc: 'Force of Ice (0/6)' }
    ]
  },
  {
    id: 'aa-force-of-will',
    value: '26',
    desc: 'Force of Will (26/26)',
    data: [
      { value: '26', desc: 'Force of Will (26/26)' },
      { value: '25', desc: 'Force of Will (25/26)' },
      { value: '24', desc: 'Force of Will (24/26)' },
      { value: '23', desc: 'Force of Will (23/26)' },
      { value: '22', desc: 'Force of Will (22/26)' },
      { value: '21', desc: 'Force of Will (21/26)' },
      { value: '20', desc: 'Force of Will (20/26)' },
      { value: '19', desc: 'Force of Will (19/26)' },
      { value: '18', desc: 'Force of Will (18/26)' },
      { value: '17', desc: 'Force of Will (17/26)' },
      { value: '16', desc: 'Force of Will (16/26)' },
      { value: '15', desc: 'Force of Will (15/26)' },
      { value: '14', desc: 'Force of Will (14/26)' },
      { value: '13', desc: 'Force of Will (13/26)' },
      { value: '12', desc: 'Force of Will (12/26)' },
      { value: '11', desc: 'Force of Will (11/26)' },
      { value: '10', desc: 'Force of Will (10/26)' },
      { value: '9', desc: 'Force of Will (9/26)' },
      { value: '8', desc: 'Force of Will (8/26)' },
      { value: '7', desc: 'Force of Will (7/26)' },
      { value: '6', desc: 'Force of Will (6/26)' },
      { value: '5', desc: 'Force of Will (5/26)' },
      { value: '4', desc: 'Force of Will (4/26)' },
      { value: '3', desc: 'Force of Will (3/26)' },
      { value: '2', desc: 'Force of Will (4/26)' },
      { value: '1', desc: 'Force of Will (3/26)' },
      { value: '0', desc: 'Force of Will (0/26)' }
    ]
  },
  {
    id: 'aa-fury-of-magic',
    value: '45',
    desc: 'Fury of Magic (32/32)',
    data: [
      { value: '45', desc: 'Fury of Magic (32/32)' },
      { value: '43', desc: 'Fury of Magic (31/32)' },
      { value: '41', desc: 'Fury of Magic (30/32)' },
      { value: '39', desc: 'Fury of Magic (29/32)' },
      { value: '38', desc: 'Fury of Magic (28/32)' },
      { value: '37', desc: 'Fury of Magic (27/32)' },
      { value: '36', desc: 'Fury of Magic (26/32)' },
      { value: '35', desc: 'Fury of Magic (25/32)' },
      { value: '34', desc: 'Fury of Magic (24/32)' },
      { value: '33', desc: 'Fury of Magic (23/32)' },
      { value: '32', desc: 'Fury of Magic (22/32)' },
      { value: '31', desc: 'Fury of Magic (21/32)' },
      { value: '30', desc: 'Fury of Magic (20/32)' },
      { value: '29', desc: 'Fury of Magic (19/32)' },
      { value: '28', desc: 'Fury of Magic (18/32)' },
      { value: '27', desc: 'Fury of Magic (17/32)' },
      { value: '26', desc: 'Fury of Magic (16/32)' },
      { value: '25', desc: 'Fury of Magic (15/32)' },
      { value: '24', desc: 'Fury of Magic (14/32)' },
      { value: '22', desc: 'Fury of Magic (13/32)' },
      { value: '20', desc: 'Fury of Magic (12/32)' },
      { value: '18', desc: 'Fury of Magic (11/32)' },
      { value: '17', desc: 'Fury of Magic (10/32)' },
      { value: '16', desc: 'Fury of Magic (9/32)' },
      { value: '15', desc: 'Fury of Magic (8/32)' },
      { value: '14', desc: 'Fury of Magic (7/32)' },
      { value: '13', desc: 'Fury of Magic (6/32)' },
      { value: '11', desc: 'Fury of Magic (5/32)' },
      { value: '9', desc: 'Fury of Magic (4/32)' },
      { value: '7', desc: 'Fury of Magic (3/32)' },
      { value: '4', desc: 'Fury of Magic (2/32)' },
      { value: '2', desc: 'Fury of Magic (1/32)' },
      { value: '0', desc: 'Fury of Magic (0/32)' }
    ]
  },
  {
    id: 'spell-pet-focus',
    value: 'kera',
    desc: 'Kerafyrm\'s Prismatic Familiar (4)',
    data: [
      { value: 'kera', desc: 'Kerafyrm\'s Prismatic Familiar (4)' },
      { value: 'improved', desc: 'Improved Familiar (9)' },
      { value: 'improvedKera', desc: 'Improved Familiar (28) (Test)' },
      { value: 'none', desc: 'No Familiar Selected' }
    ]
  },
  {
    id: 'aa-sorcerer-vengeance',
    value: '1200',
    desc: 'Sorcerer\'s Vengeance (9/9)',
    data: [
      { value: '1200', desc: 'Sorcerer\'s Vengeance (9/9)' },
      { value: '1100', desc: 'Sorcerer\'s Vengeance (8/9)' },
      { value: '1000', desc: 'Sorcerer\'s Vengeance (7/9)' },
      { value: '900', desc: 'Sorcerer\'s Vengeance (6/9)' },
      { value: '800', desc: 'Sorcerer\'s Vengeance (5/9)' },
      { value: '700', desc: 'Sorcerer\'s Vengeance (4/9)' },
      { value: '600', desc: 'Sorcerer\'s Vengeance (3/9)' },
      { value: '400', desc: 'Sorcerer\'s Vengeance (2/9)' },
      { value: '200', desc: 'Sorcerer\'s Vengeance (1/9)' },
      { value: '0', desc: 'Sorcerer\'s Vengeance (0/9)' }
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
    value: '0.19',
    desc: 'Twinproc (7/7)',
    data: [
      { value: '0.19', desc: 'Twinproc (7/7)' },
      { value: '0.18', desc: 'Twinproc (6/7)' },
      { value: '0.15', desc: 'Twinproc (5/7)' },
      { value: '0.12', desc: 'Twinproc (4/7)' },
      { value: '0.09', desc: 'Twinproc (3/7)' },
      { value: '0.06', desc: 'Twinproc (2/7)' },
      { value: '0.03', desc: 'Twinproc (1/7)' },
      { value: '0', desc: 'Twinproc (0/7)' }
    ]
  }
];

export const mageDPSAAContext = [
  {
    id: 'aa-destructive-fury',
    value: '330',
    desc: 'Destructive Fury (36/36)',
    data: [
      { value: '330', desc: 'Destructive Fury (36/36)' },
      { value: '320', desc: 'Destructive Fury (35/36)' },
      { value: '310', desc: 'Destructive Fury (34/36)' },
      { value: '301', desc: 'Destructive Fury (33/36)' },
      { value: '296', desc: 'Destructive Fury (32/36)' },
      { value: '291', desc: 'Destructive Fury (31/36)' },
      { value: '286', desc: 'Destructive Fury (30/36)' },
      { value: '279', desc: 'Destructive Fury (29/36)' },
      { value: '272', desc: 'Destructive Fury (28/36)' },
      { value: '265', desc: 'Destructive Fury (27/36)' },
      { value: '251', desc: 'Destructive Fury (26/36)' },
      { value: '238', desc: 'Destructive Fury (25/36)' },
      { value: '230', desc: 'Destructive Fury (24/36)' },
      { value: '222', desc: 'Destructive Fury (23/36)' },
      { value: '214', desc: 'Destructive Fury (22/36)' },
      { value: '206', desc: 'Destructive Fury (21/36)' },
      { value: '199', desc: 'Destructive Fury (20/36)' },
      { value: '192', desc: 'Destructive Fury (19/36)' },
      { value: '185', desc: 'Destructive Fury (18/36)' },
      { value: '180', desc: 'Destructive Fury (17/36)' },
      { value: '175', desc: 'Destructive Fury (16/36)' },
      { value: '170', desc: 'Destructive Fury (15/36)' },
      { value: '165', desc: 'Destructive Fury (14/36)' },
      { value: '160', desc: 'Destructive Fury (13/36)' },
      { value: '155', desc: 'Destructive Fury (12/36)' },
      { value: '150', desc: 'Destructive Fury (11/36)' },
      { value: '145', desc: 'Destructive Fury (10/36)' },
      { value: '140', desc: 'Destructive Fury (9/36)' },
      { value: '135', desc: 'Destructive Fury (8/36)' },
      { value: '130', desc: 'Destructive Fury (7/36)' },
      { value: '125', desc: 'Destructive Fury (6/36)' },
      { value: '115', desc: 'Destructive Fury (5/36)' },
      { value: '107', desc: 'Destructive Fury (4/36)' },
      { value: '100', desc: 'Destructive Fury (3/36)' },
      { value: '60', desc: 'Destructive Fury (2/36)' },
      { value: '30', desc: 'Destructive Fury (1/36)' },
      { value: '0', desc: 'Destructive Fury (0/36)  ' }
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
    value: '15',
    desc: 'Force of Elements (15/15)',
    data: [
      { value: '15', desc: 'Force of Elements (15/15)' },
      { value: '14', desc: 'Force of Elements (14/15)' },
      { value: '13', desc: 'Force of Elements (13/15)' },
      { value: '12', desc: 'Force of Elements (12/15)' },
      { value: '11', desc: 'Force of Elements (11/15)' },
      { value: '10', desc: 'Force of Elements (10/15)' },
      { value: '9', desc: 'Force of Elements (9/15)' },
      { value: '8', desc: 'Force of Elements (8/15)' },
      { value: '7', desc: 'Force of Elements (7/15)' },
      { value: '6', desc: 'Force of Elements (6/15)' },
      { value: '5', desc: 'Force of Elements (5/15)' },
      { value: '4', desc: 'Force of Elements (4/15)' },
      { value: '3', desc: 'Force of Elements (3/15)' },
      { value: '2', desc: 'Force of Elements (2/15)' },
      { value: '1', desc: 'Force of Elements (1/15)' },
      { value: '0', desc: 'Force of Elements (0/15)' }
    ]
  },
  {
    id: 'aa-fury-of-magic',
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
    value: '0.19',
    desc: 'Twinproc (7/7)',
    data: [
      { value: '0.19', desc: 'Twinproc (7/7)' },
      { value: '0.18', desc: 'Twinproc (6/7)' },
      { value: '0.15', desc: 'Twinproc (5/7)' },
      { value: '0.12', desc: 'Twinproc (4/7)' },
      { value: '0.09', desc: 'Twinproc (3/7)' },
      { value: '0.06', desc: 'Twinproc (2/7)' },
      { value: '0.03', desc: 'Twinproc (1/7)' },
      { value: '0', desc: 'Twinproc (0/7)' }
    ]
  }
];

export const additionalModifiers = {
  options: {
    aaForceNukes: { enabled: false, title: 'AA Force Nukes' },
    fireboundOrb: { enabled: false, title: 'Firebound Orb Rk. III  (Blazing Jet)', mode: 'mage' },
    darkShield: { enabled: false, title: 'Dark Shield of the Scholar'},
    hedgewizard: { enabled: false, title: 'Ancient Hedgewizards Brew' },
    ariaMaetanrus: { enabled: false, title: 'Aria of Maetanrus Rk. III' },
    nilsara: { enabled: false, title: 'Nilsara\'s Aria Rk. III' },
    augAura: { enabled: false, title: 'Augmenting Aura Rk. III' },
    encHazy: {
      enabled: false,
      hasInput: true,
      title: 'Gift of Hazy Thoughts',
      tooltip: 'How often to proc a single Gift of Hazy Thoughts (in seconds).\rKeep in mind that it procs only 8% of the time an Enchanter casts a DD, DoT, or Stun so you may want it fairly high.',
      defaultTime: 20
    },
    encSynergy: {
      enabled: false,
      hasInput: true,
      title: 'Beguiler\'s Synergy I',
      tooltip: 'How often to proc a single Beguiler\'s Synergy (in seconds).\rDefaults to minimum time for chain casting Mindsunder.',
      defaultTime: 11
    },
    magSynergy: {
      enabled: false,
      hasInput: true,
      title: 'Conjurer\'s Synergy I',
      tooltip: 'How often to proc a single Conjurer\'s Synergy (in seconds).\rDefaults to minimum time for chain casting Remorseless Servant.',
      defaultTime: 13,
      mode: 'wiz'
    },
    necSynergy: {
      enabled: false,
      hasInput: true,
      title: 'Defiler\'s Synergy I',
      tooltip: 'How often to proc a single Defiler\'s Synergy (in seconds).\rDefaults to minimum time for chain casting Impose for Blood.',
      defaultTime: 7
    },
    wizSynergy: {
      enabled: false,
      hasInput: true,
      title: 'Evoker\'s Synergy I',
      tooltip: 'How often to proc a single Evoker\'s Synergy (in seconds).\rDefaults to minimum time for chain casting Shocking Vortex.',
      defaultTime: 25,
      mode: 'mage'
    },
    mrAura: { enabled: false, title: 'Mana Reciprocation Aura Rk. III' },
    tcAura: { enabled: false, title: 'Twincast Aura Rk. III' },
    fwAura: { enabled: false, title: 'Frostweave Aura Rk. III' }
  },
  displayList: [ 'aaForceNukes', 'darkShield', 'fireboundOrb', 'hedgewizard', 'ariaMaetanrus',  'nilsara', 'augAura',
     'fwAura', 'mrAura', 'tcAura', 'encHazy', 'encSynergy', 'magSynergy', 'necSynergy', 'wizSynergy']
};

export const additionalModifiersDebuffs = {
  options: {
    blizzard: { enabled: false, title: 'Blizzard Breath Rk. III' },
    malo: { enabled: false, title: 'Malosenete Rk. III' },
    seedlings: { enabled: false, title: 'Skin to Seedlings Rk. III' },
    lingeringcry: { enabled: false, title: 'Tashan\'s Lingering Cry IV' }
  },
  displayList: [ 'blizzard', 'malo',  'seedlings', 'lingeringcry' ]
};

export const adpsConfig = {
  options: {
    AD: {
      id: 'AD',
      content: 'Arcane Destruction V',
      class: 'wiz',
      offset: 280000,
      charges: 24,
      critRateMod: 60,
      chargeBased: true,
      spa: 212,
      slot: 1
    },
    AF: {
      id: 'AF',
      content: 'Arcane Fury III',
      class: 'wiz',
      offset: 245000,
      spa: 302,
      slot: 1
    },
    AUS: {
      id: 'AUS',
      critRateMod: 33,
      content: 'Auspice of the Hunter',
      offset: 96000,
      spa: 294,
      slot: 1
    },
    BW: {
      id: 'BW',
      critRateMod: 10,
      critDmgMod: 100,
      content: 'Group Spirit of Black Wolf',
      offset: 225000,
      spa: 294,
      slot: 8
    },    
    CH: {
      id: 'CH',
      critDmgMod: 375,
      critRateMod: 100,
      charges: 2,
      content: 'Chroma Haze VII',
      offset: 12000,
      chargeBased: true,
      spa: 302,
      slot: 1
    },
    DR: {
      id: 'DR',
      charges: 16,
      content: 'Dichotomic Reinforcement 6',
      offset: 18000,
      beforeCritAdd: 3959,
      chargeBased: true,
      spa: 303,
      slot: 8,
      requirements: {
        minManaCost: 100,
        maxLevel: 110,
        castSpellOnly: true
      }      
    },
    E3: {
      id: 'E3',
      critRateMod: 9,
      content: 'Enchanter 3rd Spire',
      offset: 90000,
      spa: 294,
      slot: 11
    },
    EU: {
      id: 'EU',
      afterCritMult: 0.95,
      content: 'Elemental Union XIII',
      class: 'mage',
      offset: 144000,
      spa: 124,
      slot: 1
    },
    FR: {
      id: 'FR',
      content: 'Forceful Rejuvenation',
      offset: 20000,
      instant: true
    },
    FD: {
      id: 'FD',
      content: 'Frenzied Devestation XIX',
      class: 'wiz',
      offset: 410000,
      charges: 45,
      critDmgMod: 80,
      critRateMod: 50,
      chargeBased: true,
      spa: 212,
      slot: 1
    },
    FE: {
      id: 'FE',
      critRateMod: 12,
      critDmgMod: 12,
      content: 'Fierce Eye',
      offset: 120000,
      spa: 294,
      slot: 5
    },
    FURYDRUZ: {
      id: 'FURYDRUZ',
      content: 'Fury of Druzzil XIII',
      class: 'wiz',
      offset: 600000,
      resist: 'MAGIC',
      spa: 303,
      slot: 1
    },
    FURYECI: {
      id: 'FURYECI',
      content: 'Fury of Eci XIII',
      class: 'wiz',
      offset: 600000,
      resist: 'ICE',
      spa: 303,
      slot: 1
    },
    FURYRO: {
      id: 'FURYRO',
      content: 'Fury of Ro XIII',
      class: 'wiz',
      offset: 600000,
      resist: 'FIRE',
      spa: 303,
      slot: 1
    },
    FURYKERA: {
      id: 'FURYKERA',
      content: 'Fury of Kerafyrm IX',
      class: 'wiz',
      offset: 600000,
      resist: 'ANY',
      spa: 303,
      slot: 1
    },
    GLYPH: {
      id: 'GLYPH',
      critDmgMod: 60,
      content: 'Glyph of Destruction II',
      offset: 120000,
      spa: 294,
      slot: 7
    },
    HF: {
      id: 'HF',
      afterCritMult: 1.10,
      content: 'Heart of Flames XII',
      class: 'mage',
      offset: 276000,
      resist: 'FIRE',
      spa: 124,
      slot: 1
    },
    MBRN: {
      id: 'MBRN',
      charges: 500,
      content: 'Mana Burn XVI',
      offset: 120000,
      afterCritAdd: 19200,
      chargeBased: true,
      spa: 484,
      slot: 1,
      requirements: {
        focusable: true
      }      
    },    
    MC: {
      id: 'MC',
      critDmgMod: 50,
      critRateMod: 175,
      charges: 3,
      content: 'Mana Charge',
      offset: 42000,
      chargeBased: true,
      spa: 294,
      slot: 1
    },
    HV: {
      id: 'HV',
      critDmgMod: 35,
      critRateMod: 0,
      content: 'Heart of Vapor XIV',
      class: 'mage',
      offset: 276000,
      spa: 294,
      slot: 99
    },
    IOG: {
      id: 'IOG',
      critRateMod: 12,
      critDmgMod: 155,
      content: 'Illusions of Grandeur',
      offset: 120000,
      spa: 294,
      slot: 5
    },
    ITC: {
      id: 'ITC',
      content: 'Improved Twincast',
      offset: 150000,
      chargeBased: true,
      charges: 18
    },
    M1: {
      id: 'M1',
      critRateMod: 24,
      content: 'First Spire of Elements IV',
      class: 'mage',
      offset: 90000,
      spa: 294,
      slot: 2
    },
    TC: {
      id: 'TC',
      content: 'Twincast Spell',
      offset: 21000
    },
    SW: {
      id: 'SW',
      beforeCritFocus: 0.185,
      content: 'Season\'s Wrath V',
      offset: 30000,
      spa: 296,
      slot: 1
    },
    VES: {
      id: 'VES',
      critRateMod: 12,
      content: 'Spirit of Vesagran (Bard Epic)',
      offset: 120000,
      spa: 294,
      slot: 9
    },
    W2: {
      id: 'W2',
      critDmgMod: 160,
      content: 'Second Spire of Arcanum IV',
      class: 'wiz',
      offset: 90000,
      spa: 294,
      slot: 3
    }
  },
  displayList: [
    'AD', 'AF', 'AUS', 'CH', 'DR', 'EU', 'E3', 'FE', 'M1', 'FR', 'FD', 'FURYDRUZ', 'FURYECI', 'FURYRO', 'FURYKERA', 'GLYPH',
    'BW', 'HF', 'HV', 'IOG', 'ITC', 'MBRN', 'MC', 'SW', 'W2', 'VES',  'TC'
  ]
};

export const chartOptions = {
  spellline: {
    showCurrentTime: false,
    showMajorLabels: false,
    showMinorLabels: true,
    align: 'center',
    zoomable: true,
    editable: false,
    clickToUse: false,
    maxHeight: '155px',
    selectable: false
  },
  timeline: {
    showCurrentTime: false,
    showMajorLabels: false,
    showMinorLabels: true,
    align: 'left',
    zoomable: true,
    editable: true,
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
          min: 0,
          max: 110
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
          min: 0,
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