import {globals as G} from './settings.js';
import * as dmgU from './damage.utils.js';
import * as utils from './utils.js';

// What to query on to find a spell focus value by ID
const MAGE_FOCUS_AA_KEYS = {
  'BS': '.aa-focus-bolt-molten .dropdown-toggle',
  'CR': '.aa-focus-coronal-rain .dropdown-toggle',
  'FC': '.aa-focus-fickle-conflag .dropdown-toggle',
  'RC': '.aa-focus-rain-cutlasses .dropdown-toggle',
  'SM': '.aa-focus-storm-many .dropdown-toggle',
  'SS': '.aa-focus-spear-molten .dropdown-toggle'
};

// What to query on to find a spell focus value by ID
const WIZ_FOCUS_AA_KEYS = {
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

export function getAERainHitsValue() {
  return utils.useCache('.ae-rain-hits', function() {
    return utils.getNumberValue($('#aeRainHits').val());
  });
}

export function getAddAfterCritFocusValue() {
  return utils.useCache('.add-after-crit-focus', function() {
    return utils.getNumberValue($('#addAfterCritFocus').val() / 100);
  });
}

export function getAddAfterCritAddValue() {
  return utils.useCache('.add-after-crit-add', function() {
    return utils.getNumberValue($('#addAfterCritAdd').val());
  });
}

export function getAddBeforeCritFocusValue() {
  return utils.useCache('.add-before-crit-focus', function() {
    return utils.getNumberValue($('#addBeforeCritFocus').val() / 100);
  });
}

export function getAddBeforeCritAddValue() {
  return utils.useCache('.add-before-crit-add', function() {
    return utils.getNumberValue($('#addBeforeCritAdd').val());
  });
}

export function getAddEffectivenessValue() {
  return utils.useCache('.add-effectiveness', function() {
    return utils.getNumberValue($('#addEffectiveness').val() / 100);
  });
}

export function getAllianceFulminationValue() {
  return utils.useCache('.allianceFulmination', function() {
    return utils.getNumberValue($('#allianceFulmination').val());
  });
}

export function getArcaneFusionValue() {
  return utils.useCache('.aa-arcane-fusion', function() {
    return $('.aa-arcane-fusion .dropdown-toggle').data('value');
  });
}

export function getAriaMaetanrusValue() {
  return $('#ariaMaetanrus').is(':checked') ? dmgU.ARIA_MAETANRUS_PERCENT : 0;
}

export function getAugmentingAuraValue() {
  return $('#augAura').is(':checked') ? dmgU.AUG_AURA_PERCENT : 0;
}

export function getAvgWornDamageFocus(resist) {
  return utils.useCache('avg-worn-dmg-focus-' + resist, function() {
    let value = 0;

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
}

export function getBeltProcValue() {
  return utils.useCache('.belt-proc', function() {
    return $('.belt-proc .dropdown-toggle').data('value');
  });
}

export function getBlizzardBreathValue() {
  return $('#blizzard').is(':checked') ? dmgU.MALO_FOCUS : 0;
}

export function getConjurersSynergyValue() {
  return utils.useCache('.conjurers-synergy', function() {
    return utils.getNumberValue($('.aa-conjurers-synergy .dropdown-toggle').data('value'));
  });
}

export function getCritDmgValue() {
  return utils.useCache('.innate-crit-dmg', function() {
    return utils.getNumberValue($('#innatCritDmg').val());
  });
}

export function getCritRateValue() {
  return utils.useCache('.innate-crit-rate', function() {
    return utils.getNumberValue($('#innatCritRate').val());
  });
}

export function getDPSAug1AugValue() {
  return utils.useCache('.add-dps-aug1', function() {
    return $('.add-dps-aug1 .dropdown-toggle').data('value');
  });
}

export function getDPSAug2AugValue() {
  return utils.useCache('.add-dps-aug2', function() {
    return $('.add-dps-aug2 .dropdown-toggle').data('value');
  });
}

export function getDestructiveAdeptValue() {
  return utils.useCache('.aa-destructive-adept', function() {
    return utils.getNumberValue($('.aa-destructive-adept .dropdown-toggle').data('value'));
  });
}

export function getDestructiveFuryValue() {
  return utils.getNumberValue($('.aa-destructive-fury .dropdown-toggle').data('value'));
}

export function getDoNValue() {
  return utils.getNumberValue($('.aa-don .dropdown-toggle').data('value'));
}

export function getEncHazyRate() {
  return 1000 * utils.getNumberValue(($('#encHazyRate').val()));
}

export function getEncSynergyRate() {
  return 1000 * utils.getNumberValue(($('#encSynergyRate').val()));
}

export function getEvokersSynergyValue() {
  return utils.useCache('.evokers-synergy', function() {
    return utils.getNumberValue($('.aa-evokers-synergy .dropdown-toggle').data('value'));
  });
}

export function getEyeOfDecayValue() {
  return utils.useCache('.eye-of-decay', function() {
    return utils.getNumberValue($('.eye-of-decay .dropdown-toggle').data('value'));
  });
}

export function getFlamesOfPowerValue() {
  return utils.useCache('.aa-flames-of-power', function() {
    return utils.getNumberValue($('.aa-flames-of-power .dropdown-toggle').data('value'));
  });
}

export function getActivatedNukes(state) {
  let list = [];
  
  if (isUsingAANukes()) {
    let version = utils.getNumberValue($('.aa-force-of-will .dropdown-toggle').data('value'));
    if (version > 0) list.push('FW' + version);
    version = utils.getNumberValue($('.aa-force-of-flame .dropdown-toggle').data('value'));
    if (version > 0) list.push('FF' + version);
    version = utils.getNumberValue($('.aa-force-of-ice .dropdown-toggle').data('value'));
    if (version > 0) list.push('FI' + version);
    version = utils.getNumberValue($('.aa-force-of-elements .dropdown-toggle').data('value'));
    if (version > 0) list.push('FE' + version);
  }
 
  if (isUsingDarkShield()) {
    list.push('DS');
  }
  
  if (isUsingFireboundOrb()) {
    list.push('BJ');
  }
  
  return list;
}

export function getFuryOfMagicValue() {
  return utils.getNumberValue($('.aa-fury-of-magic .dropdown-toggle').data('value'));
}

export function getGCDValue() {
  return utils.useCache('.gcd-value', function() {
    return utils.getNumberValue($('#gcd').val());
  });
}

export function getDomForCritDGraph() {
  return $('#critDGraph').get(0);
}

export function getDomForCritRGraph() {
  return $('#critRGraph').get(0);
}

export function getDomForDmgGraph() {
  return $('#dmgGraph').get(0);
}

export function getDomForSpellline() {
  return $('#spellline').get(0);
}

export function getDomForTimeline() {
  return $('#timeline').get(0);
}

export function getHastenedServantValue() {
  return utils.useCache('.aa-hastened-servant', function() {
    return utils.getNumberValue($('.aa-hastened-servant .dropdown-toggle').data('value'));
  });
}

export function getLingeringCryValue() {
  return $('#lingeringcry').is(':checked') ? dmgU.LINGERING_CRY_FOCUS : 0;
}

export function getMagSynergyRate() {
  return 1000 * utils.getNumberValue(($('#magSynergyRate').val()));
}

export function getMaloValue() {
  return $('#malo').is(':checked') ? dmgU.MALO_FOCUS : 0;
}

export function getNecSynergyRate() {
  return 1000 * utils.getNumberValue(($('#necSynergyRate').val()));
}

export function getNilsaraAriaValue() {
  return $('#nilsara').is(':checked') ? dmgU.NILSARA_ARIA_DMG : 0;
}

export function getPetCritFocusValue() {
  if (G.MODE === 'wiz') {
    let type = $('.spell-pet-focus .dropdown-toggle').data('value');
    if (['improved', 'improvedKera'].find(t => t === type)) {
      return dmgU.IMPROVED_FAMILIAR_CRIT * 100;
    }
  }
  return 0;
}

export function getPetDmgFocusValue() {
  if (G.MODE =='wiz') {
    let type = $('.spell-pet-focus .dropdown-toggle').data('value');
    if (['kera', 'improvedKera'].find(t => t === type)) {
      return dmgU.KERA_FAMILIAR_FOCUS;
    }
  } 
  return 0;
}

export function getRangeAugValue() {
  return utils.useCache('.range-aug', function() {
    return $('.range-aug .dropdown-toggle').data('value');
  });
}

export function getRefreshOffsetValue() {
  return utils.useCache('.refresh-offset', function() {
    return utils.getNumberValue($('#refreshOffset').val());
  });
}

export function getRemorselessServantDPSValue() {
  return utils.useCache('.remorseless-servant-dps', function() {
    return utils.getNumberValue($('#remorselessDPS').val());
  });
}

export function getRemorselessServantTTLValue() {
  return utils.useCache('.remorseless-servant-ttl', function() {
    return 1000 * utils.getNumberValue($('#remorselessTTL').val());
  });
}

export function getRobeValue() {
  return utils.useCache('.worn-chest-focus', function() {
    return utils.getNumberValue($('.worn-chest-focus .dropdown-toggle').data('value'));
  });
}

export function getSeedlingsValue() {
  return $('#seedlings').is(':checked') ? dmgU.SEEDLINGS_FOCUS : 0;
}

export function getSelectedSpells() {
  let spells = [];
  $('#spellButtons div.spell button').each(function(item, b) {
    let spellId = $(b).data('value');
    if (spellId != 'NONE') {
      spells.push(spellId);
    }
  });

  return spells;
}

export function getShieldProcValue() {
  return utils.useCache('.shield-proc', function() {
    return $('.shield-proc .dropdown-toggle').data('value');
  });
}

export function getShockingVortexEffectValue() {
  return utils.useCache('.vortex-effects', function() {
    return utils.getNumberValue($('#vortexEffects').val());
  });
}

export function getSorcererVengeananceValue() {
  return utils.useCache('.aa-sorcerer-vengeance', function() {
    return utils.getNumberValue($('.aa-sorcerer-vengeance .dropdown-toggle').data('value'));
  });
}

export function getSpellDamageValue() {
  return utils.useCache('.spell-damage', function() {
    return utils.getNumberValue($('#spellDamage').val());
  });
}

export function getSpellFocusAAValue(id) {
  return utils.useCache('.spell-focus-aa-' + id, function() {
    let value = 0;

    let keys = (G.MODE === 'wiz') ? WIZ_FOCUS_AA_KEYS : MAGE_FOCUS_AA_KEYS;
    if (keys[id]) {
      value = utils.getNumberValue($(keys[id]).data('value'));
    }

    return value ? value : 0;
  });
}

export function getSpellTimeRangeControl() {
  return $('#spellTimeRange');
}

export function getSpellTimeRangeValue() {
  let timeRange = utils.getNumberValue(getSpellTimeRangeControl().val());
  return (timeRange < 0) ? 0 : timeRange;
}

export function getStaffProcValue() {
  return utils.useCache('.staff-proc', function() {
    return $('.staff-proc .dropdown-toggle').data('value');
  });
}

export function getStormOfManyCountValue() {
  return utils.useCache('.storm-of-many-count', function() {
    return utils.getNumberValue($('#stormOfManyCount').val());
  });
}

export function getTwincastAAValue() {
  return utils.useCache('.aa-twincast', function() {
    return utils.getNumberValue($('.aa-twincast .dropdown-toggle').data('value'));
  });
}

export function getTwincastAuraValue() {
  return $('#tcAura').is(':checked') ? dmgU.TC_AURA_PERCENT : 0;
}

export function getTwinprocValue() {
  return utils.useCache('.aa-twinproc', function() {
    return utils.getNumberValue($('.aa-twinproc .dropdown-toggle').data('value'));
  });
}

export function getType3AugValue(spell) {
  return utils.useCache('.worn-type3augs-' + spell.id, function() {
    return $('.worn-type3augs .dropdown-toggle').data('value') ? spell.type3Aug || 0 : 0;
  });
}

export function getWizSynergyRate() {
  return 1000 * utils.getNumberValue(($('#wizSynergyRate').val()));
}

export function isUsingAANukes() {
  return $('#aaForceNukes').is(':checked');
}

export function isUsingArcaneFusion() {
  return (getArcaneFusionValue() != 'NONE');
}

export function isUsingDarkShield() {
  return $('#darkShield').is(':checked');
}

export function isUsingEncHazy() {
  return $('#encHazy').is(':checked');
}

export function isUsingEncSynergy() {
  return $('#encSynergy').is(':checked');
}

export function isUsingFireboundOrb() {
  return $('#fireboundOrb').is(':checked');
}

export function isUsingFW() {
  return $('#fwAura').is(':checked');
}

export function isUsingHedgewizard() {
  return $('#hedgewizard').is(':checked');
}

export function isUsingMagSynergy() {
  return $('#magSynergy').is(':checked');
}

export function isUsingMR() {
  return $('#mrAura').is(':checked');
}

export function isUsingNecSynergy() {
  return $('#necSynergy').is(':checked');
}

export function isUsingWizSynergy() {
  return $('#wizSynergy').is(':checked');
}