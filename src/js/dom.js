var utils = require('./utils.js');

// What to query on to find a spell focus value by ID
var MAGE_FOCUS_AA_KEYS = {
  'BS': '.aa-focus-bolt-molten .dropdown-toggle',
  'CR': '.aa-focus-coronal-rain .dropdown-toggle',
  'FC': '.aa-focus-fickle-conflag .dropdown-toggle',
  'RC': '.aa-focus-rain-cutlasses .dropdown-toggle',
  'SM': '.aa-focus-storm-many .dropdown-toggle',
  'SS': '.aa-focus-spear-molten .dropdown-toggle'
};

// What to query on to find a spell focus value by ID
var WIZ_FOCUS_AA_KEYS = {
  'CF': '.aa-focus-claws .dropdown-toggle',
  'CS': '.aa-focus-cloudburst .dropdown-toggle',
  'CS2': '.aa-focus-chaos .dropdown-toggle',
  'EF': '.aa-focus-ethereal-flash .dropdown-toggle',
  'ES': '.aa-focus-ethereal-skyblaze .dropdown-toggle',
  'FU': '.aa-focus-ethereal-skyblaze .dropdown-toggle',
  'ER': '.aa-focus-ethereal-rimeblast .dropdown-toggle',
  'FC': '.aa-focus-flashchar .dropdown-toggle',
  'MB': '.aa-focus-rains .dropdown-toggle',
  'PW': '.aa-focus-purewild .dropdown-toggle',
  'RC2': '.aa-focus-rimeblastcascade .dropdown-toggle',
  'SV': '.aa-focus-vortexes .dropdown-toggle',
  'TS': '.aa-focus-thricewoven .dropdown-toggle'
};

// Methods for easy lookup of values from DOM nodes related to configuration of
// AAs, spells, equipment options, etc
//
// Some of these use a cache based on those being used most according to profiling
//   --- should probably add more to cache
//
var self = module.exports = {
  getAERainHitsValue: function() {
    return utils.useCache('.ae-rain-hits', function() {
      return utils.getNumberValue($('#aeRainHits').val());
    });
  },  
  getAddAfterCritFocusValue: function() {
    return utils.useCache('.add-after-crit-focus', function() {
      return utils.getNumberValue($('#addAfterCritFocus').val() / 100);
    });
  },
  getAddAfterCritAddValue: function() {
    return utils.useCache('.add-after-crit-add', function() {
      return utils.getNumberValue($('#addAfterCritAdd').val());
    });
  },
  getAddBeforeCritFocusValue: function() {
    return utils.useCache('.add-before-crit-focus', function() {
      return utils.getNumberValue($('#addBeforeCritFocus').val() / 100);
    });
  },
  getAddBeforeCritAddValue: function() {
    return utils.useCache('.add-before-crit-add', function() {
      return utils.getNumberValue($('#addBeforeCritAdd').val());
    });
  },
  getAddEffectivenessValue: function() {
    return utils.useCache('.add-effectiveness', function() {
      return utils.getNumberValue($('#addEffectiveness').val() / 100);
    });
  },
  getAllianceFulminationValue: function() {
    return utils.useCache('.allianceFulmination', function() {
      return utils.getNumberValue($('#allianceFulmination').val());
    });
  },
  getArcaneFusionValue: function() {
    return utils.useCache('.aa-arcane-fusion', function() {
      return $('.aa-arcane-fusion .dropdown-toggle').data('value');
    });
  },  
  getAriaMaetanrusValue: function() {
    return $('#ariaMaetanrus').is(':checked') ? ARIA_MAETANRUS_PERCENT : 0;
  },  
  getAugmentingAuraValue: function() {
    return $('#augAura').is(':checked') ? AUG_AURA_PERCENT : 0;    
  },  
  getAvgWornDamageFocus: function(resist) {
    return utils.useCache('avg-worn-dmg-focus-' + resist, function() {
      var value = 0;
    
      switch(resist) {
        case 'FIRE':
          // avg pre-calculated (min+max) / 2 in spell data json
          value = utils.getNumberValue($('.worn-arms-focus .dropdown-toggle').data('value'));
          break;
        case 'ICE':
          // avg pre-calculated (min+max) / 2 in spell data json
          value = utils.getNumberValue($('.worn-hands-focus .dropdown-toggle').data('value'));
          break;
        case 'MAGIC':
          // avg pre-calculated (min+max) / 2 in spell data json
          value = utils.getNumberValue($('.worn-head-focus .dropdown-toggle').data('value'));
          break;
      }
      
      return value;
    });
  },  
  getBeltProcValue: function() {
    return utils.useCache('.belt-proc', function() {
      return $('.belt-proc .dropdown-toggle').data('value');
    });
  },
  getBlizzardBreathValue: function() {
    return $('#blizzard').is(':checked') ? MALO_FOCUS : 0;    
  },
  getConjurersSynergyValue: function() {
    return utils.useCache('.conjurers-synergy', function() {
      return utils.getNumberValue($('.aa-conjurers-synergy .dropdown-toggle').data('value'));
    });      
  }, 
  getCritDmgValue: function() {
    return utils.useCache('.innate-crit-dmg', function() {
      return utils.getNumberValue($('#innatCritDmg').val());
    });
  },
  getCritRateValue: function() {
    return utils.useCache('.innate-crit-rate', function() {
      return utils.getNumberValue($('#innatCritRate').val());
    });
  },  
  getDPSAug1AugValue: function() {
    return utils.useCache('.add-dps-aug1', function() {
      return $('.add-dps-aug1 .dropdown-toggle').data('value');
    });
  },
  getDPSAug2AugValue: function() {
    return utils.useCache('.add-dps-aug2', function() {
      return $('.add-dps-aug2 .dropdown-toggle').data('value');
    });
  },  
  getDestructiveAdeptValue: function() {
    return utils.useCache('.aa-destructive-adept', function() {
      return utils.getNumberValue($('.aa-destructive-adept .dropdown-toggle').data('value'));
    });
  },  
  getDestructiveFuryValue: function() {
    return utils.getNumberValue($('.aa-destructive-fury .dropdown-toggle').data('value'));   
  },  
  getDoNValue: function() {
    return utils.getNumberValue($('.aa-don .dropdown-toggle').data('value'));   
  },  
  getEncHazyRate: function() {
    return 1000 * utils.getNumberValue(($('#encHazyRate').val()));    
  },
  getEncSynergyRate: function() {
    return 1000 * utils.getNumberValue(($('#encSynergyRate').val()));    
  },  
  getEqpProcIDs: function() {
    var result = [];
    
    $([
      self.getStaffProcValue(), self.getBeltProcValue(), self.getRangeAugValue(),
      self.getDPSAug1AugValue(), self.getDPSAug2AugValue(), self.getShieldProcValue()
    ]).each(function(i, id) {
      if (id != 'NONE') {
        result.push(id);
      }  
    });
    
    return result;
  },
  getEvokersSynergyValue: function() {
    return utils.useCache('.evokers-synergy', function() {
      return utils.getNumberValue($('.aa-evokers-synergy .dropdown-toggle').data('value'));
    });      
  },
  getEyeOfDecayValue: function() {
    return utils.useCache('.eye-of-decay', function() {
      return utils.getNumberValue($('.eye-of-decay .dropdown-toggle').data('value'));
    });      
  },  
  getFlamesOfPowerValue: function() {
    return utils.useCache('.aa-flames-of-power', function() {
      return utils.getNumberValue($('.aa-flames-of-power .dropdown-toggle').data('value'));
    });
  },  
  getForceNukes: function() {
    var list = [];
    var version = utils.getNumberValue($('.aa-force-of-will .dropdown-toggle').data('value'));
    if (version > 0) list.push('FW' + version);
    version = utils.getNumberValue($('.aa-force-of-flame .dropdown-toggle').data('value'));
    if (version > 0) list.push('FF' + version);
    version = utils.getNumberValue($('.aa-force-of-ice .dropdown-toggle').data('value'));
    if (version > 0) list.push('FI' + version);
    version = utils.getNumberValue($('.aa-force-of-elements .dropdown-toggle').data('value'));
    if (version > 0) list.push('FE' + version);
    return list;
  },
  getFuryOfMagicValue: function() {
    return utils.getNumberValue($('.aa-fury-of-magic .dropdown-toggle').data('value'));
  },  
  getGCDValue: function() {
    return utils.useCache('.gcd-value', function() {
      return utils.getNumberValue($('#gcd').val());
    });
  },
  getDomForCritDGraph: function() {
    return $('#critDGraph').get(0);
  },
  getDomForCritRGraph: function() {
    return $('#critRGraph').get(0);
  },
  getDomForDmgGraph: function() {
    return $('#dmgGraph').get(0);
  },
  getDomForSpellline: function() {
    return $('#spellline').get(0);
  },
  getDomForTimeline: function() {
    return $('#timeline').get(0);
  },    
  getFWRate: function() {
    return FW_TIMER;
  },
  getHastenedServantValue: function() {
    return utils.useCache('.aa-hastened-servant', function() {
      return utils.getNumberValue($('.aa-hastened-servant .dropdown-toggle').data('value'));
    });
  },  
  getLingeringCryValue: function() {
    return $('#lingeringcry').is(':checked') ? LINGERING_CRY_FOCUS : 0;    
  },
  getMagSynergyRate: function() {
    return 1000 * utils.getNumberValue(($('#magSynergyRate').val()));  
  },
  getMaloValue: function() {
    return $('#malo').is(':checked') ? MALO_FOCUS : 0;    
  },
  getMRRate: function() {
    return MR_TIMER;
  },
  getNecSynergyRate: function() {
    return 1000 * utils.getNumberValue(($('#necSynergyRate').val()));  
  },
  getNilsaraAriaValue: function() {
    return $('#nilsara').is(':checked') ? NILSARA_ARIA_DMG : 0;    
  },
  getPetCritFocusValue: function() {
    if (MODE == 'wiz') {
      var petFocus = self.getWizPetFocus();
      if (petFocus.type == 'improved') {
        return petFocus.value * 100;
      }    
    }
    return 0;    
  },
  getPetDmgFocusValue: function() {
    if (MODE =='wiz') {
      var petFocus = self.getWizPetFocus();
      if (petFocus.type == 'kera') {
        return petFocus.value;
      }  
    }
    return 0;
  },
  getRangeAugValue: function() {
    return utils.useCache('.range-aug', function() {
      return $('.range-aug .dropdown-toggle').data('value');
    });
  },
  getRefreshOffsetValue: function() {
    return utils.useCache('.refresh-offset', function() {
      return utils.getNumberValue($('#refreshOffset').val());
    });
  },  
  getRemorselessServantDPSValue: function() {
    return utils.useCache('.remorseless-servant-dps', function() {
      return utils.getNumberValue($('#remorselessDPS').val());
    });
  },
  getRemorselessServantTTLValue: function() {
    return utils.useCache('.remorseless-servant-ttl', function() {
      return utils.getNumberValue($('#remorselessTTL').val());
    });
  },
  getRobeValue: function() {
    return utils.useCache('.worn-chest-focus', function() {
      return utils.getNumberValue($('.worn-chest-focus .dropdown-toggle').data('value'));
    });
  },
  getSeedlingsValue: function() {
    return $('#seedlings').is(':checked') ? SEEDLINGS_FOCUS : 0;    
  },
  getSelectedSpells: function() {
    var spells = [];
    $('#spellButtons div.spell button').each(function(item, b) {
      var spellId = $(b).data('value');
      if (spellId != 'NONE') {
        spells.push(spellId);
      }
    });
    
    return spells;
  },
  getShieldProcValue: function() {
    return utils.useCache('.shield-proc', function() {
      return $('.shield-proc .dropdown-toggle').data('value');
    });
  },  
  getShockingVortexEffectValue: function() {
    return utils.useCache('.vortex-effects', function() {
      return utils.getNumberValue($('#vortexEffects').val());
    });
  },
  getSorcererVengeananceValue: function() {
    return utils.useCache('.aa-sorcerer-vengeance', function() {
      return utils.getNumberValue($('.aa-sorcerer-vengeance .dropdown-toggle').data('value'));
    });
  },
  getSpellDamageValue: function() {
    return utils.useCache('.spell-damage', function() {
      return utils.getNumberValue($('#spellDamage').val());
    });
  },
  getSpellFocusAAValue: function(id) {
    return utils.useCache('.spell-focus-aa-' + id, function() {
      var value = 0;
      
      var keys = (MODE == 'wiz') ? WIZ_FOCUS_AA_KEYS : MAGE_FOCUS_AA_KEYS;
      if (keys[id]) {
        value = utils.getNumberValue($(keys[id]).data('value'));
      }
      
      return value ? value : 0;
    });
  },  
  getSpellTimeRangeControl: function() {
    return $('#spellTimeRange');
  },
  getSpellTimeRangeValue: function() {
    var timeRange = utils.getNumberValue(self.getSpellTimeRangeControl().val());
    return (timeRange < 0) ? 0 : timeRange;
  },
  getStaffProcValue: function() {
    return utils.useCache('.staff-proc', function() {
      return $('.staff-proc .dropdown-toggle').data('value');
    });
  },  
  getStormOfManyCountValue: function() {
    return utils.useCache('.storm-of-many-count', function() {
      return utils.getNumberValue($('#stormOfManyCount').val());
    });
  },
  getTwincastAAValue: function() {
    return utils.useCache('.aa-twincast', function() {
      return utils.getNumberValue($('.aa-twincast .dropdown-toggle').data('value'));
    });
  },
  getTwincastAuraValue: function() {
    return $('#tcAura').is(':checked') ? TC_AURA_PERCENT : 0;
  },
  getTwinprocValue: function() {
    return utils.useCache('.aa-twinproc', function() {
      return utils.getNumberValue($('.aa-twinproc .dropdown-toggle').data('value'));
    });
  },
  getType3AugValue: function(spell) {
    return utils.useCache('.worn-type3augs-' + spell.id, function() {
      return $('.worn-type3augs .dropdown-toggle').data('value') ? spell.type3Aug || 0 : 0;
    });
  },
  getWizPetFocus: function() {
    var value;
    var type = $('.spell-pet-focus .dropdown-toggle').data('value');
    if (type == "improved") {
      value = IMPROVED_FAMILIAR_CRIT;
    } else if(type == "kera") {
      value = KERA_FAMILIAR_FOCUS;
    }
  
    return {type: type, value: value};
  },  
  getWizSynergyRate: function() {
    return 1000 * utils.getNumberValue(($('#wizSynergyRate').val()));  
  },
  isUsingAAForceNukes: function() {
    return $('#aaForceNukes').is(':checked');
  },
  isUsingArcaneFusion: function() {
    return (self.getArcaneFusionValue() != 'NONE');
  },
  isUsingEncHazy: function() {
    return $('#encHazy').is(':checked');
  },
  isUsingEncSynergy: function() {
    return $('#encSynergy').is(':checked');
  },
  isUsingFireboundOrb: function() {
    return $('#fireboundOrb').is(':checked');
  },
  isUsingFW: function() {
    return $('#fwAura').is(':checked');
  },
  isUsingHedgewizard: function() {
    return $('#hedgewizard').is(':checked');
  },
  isUsingMagSynergy: function() {
    return $('#magSynergy').is(':checked');
  },
  isUsingMR: function() {
    return $('#mrAura').is(':checked');
  },
  isUsingNecSynergy: function() {
    return $('#necSynergy').is(':checked');
  },
  isUsingWizSynergy: function() {
    return $('#wizSynergy').is(':checked');
  }
};