import {globals as G} from './settings.js';
import * as abilities from './abilities.js';
import * as utils from './utils.js';

// What to query on to find a spell focus value by ID
const FOCUS_AA_KEYS = {
  enc: {
    'CR': '.aa-chromarift .dropdown-toggle',
    'CS': '.aa-chromablink .dropdown-toggle',
    'GT': '.aa-gravity-twist .dropdown-toggle',
    'MT': '.aa-mindsunder .dropdown-toggle',
    'MC': '.aa-mindsunder .dropdown-toggle',    
    'MS': '.aa-mindsunder .dropdown-toggle',
    'PA': '.aa-poly-ass .dropdown-toggle'
  },
  mag: {
    'BB': '.aa-sear .dropdown-toggle',
    'BM': '.aa-beam-molten .dropdown-toggle',
    'BS': '.aa-beam-scythes .dropdown-toggle',
    'BK': '.aa-boltm .dropdown-toggle',
    'RM': '.aa-coronal .dropdown-toggle',
    'RU': '.aa-eradun .dropdown-toggle',
    'FC': '.aa-capricious .dropdown-toggle',
    'CP': '.aa-capricious .dropdown-toggle',    
    'RK': '.aa-raincut .dropdown-toggle',
    'SM': '.aa-storm .dropdown-toggle',
    'SK': '.aa-spearm .dropdown-toggle',
    'SA': '.aa-spearm .dropdown-toggle',
    'SH': '.aa-shockd .dropdown-toggle',
    'KB': '.aa-meteor .dropdown-toggle'
  },
  wiz: {
    'SB': '.aa-beams .dropdown-toggle',
    'CS': '.aa-claws .dropdown-toggle',
    'CG': '.aa-claws .dropdown-toggle',
    'CT': '.aa-cloudb .dropdown-toggle',
    'CB': '.aa-chaos .dropdown-toggle',
    'ET': '.aa-eflash .dropdown-toggle',
    'ES': '.aa-eblaze .dropdown-toggle',
    'EB': '.aa-eblaze .dropdown-toggle',
    'EI': '.aa-erime .dropdown-toggle',
    'RI': '.aa-erime .dropdown-toggle',
    'FB': '.aa-flashchar .dropdown-toggle',
    'VD': '.aa-rains .dropdown-toggle',
    'PS': '.aa-pure .dropdown-toggle',
    'RC': '.aa-rimeb .dropdown-toggle',
    'SC': '.aa-selfc .dropdown-toggle',
    'FP': '.aa-pills .dropdown-toggle',
    'SJ': '.aa-vortex .dropdown-toggle',
    'LF': '.aa-corona .dropdown-toggle'
  }
};

// Methods for easy lookup of values from DOM nodes related to configuration of
// AAs, spells, equipment options, etc
//
// Some of these use a cache based on those being used most according to profiling
//   --- should probably add more to cache
//

export function getAERainHitsValue() {
  return utils.useCache('.ae-rain-hits', () => {
    return utils.getNumberValue($('#aeRainHits').val());
  });
}

export function getAEUnitDistanceValue() {
  return utils.useCache('.ae-unit-distance', () => {
    return utils.getNumberValue($('#aeUnitDistance').val());
  });
}

export function getConfiguredAbilities(state) {
  return utils.useCache('active-configured-abilities', () => {
    let active = [];
    let spellProc = [];

    // add if set and if specified has a value > 0
    let addAbility = (id, value, spa) => {
      if (id && id !== 'NONE') {
        if (value === undefined || value > 0) {
          let ability = abilities.get(id);
          if (ability) {
            active.push(id);

            if (value > 0) {
              abilities.setSPAValue(id, spa, value);
            }
          }
        }
      }
    };

    let setSpellProc = (id, value) => {
      if (id !== 'NONE') {
        if (value === 'NONE') {
          value = '';
        }

        let ability = abilities.get(id);
        if (value && ability) {
          abilities.setProcValue(id, value);

          // only configure manual abilities here
          // dont return them
          if (!ability.manuallyActivated && ability.class === G.MODE) {
            spellProc.push(id);
          }
        }
      }
    };

    // class specific abilities
    switch(G.MODE) {
      case 'wiz':
        // familiar
        addAbility(getFamiliarValue());
        setSpellProc('AFU', getArcaneFusionValue());
        setSpellProc('FF', getForceOfFlameValue());
        setSpellProc('FI', getForceOfIceValue());
        setSpellProc('FW', getForceOfWillValue());
        addAbility('DADEPT', getDestructiveAdeptValue(), 124);
        addAbility('SVENG', getSorcererVengeananceValue(), 286);
        break;

      case 'mag':
        setSpellProc('FE', getForceOfElementsValue());

        // Setup Flames of Power
        abilities.setCharges('FPWR', (getFlamesOfPowerValue() === 4) ? 2 : 1);
        break;
    }

    addAbility(getRobeValue());
    addAbility(getBeltProcValue());
    addAbility('EDECAY', getEyeOfDecayValue(), 413);
    addAbility('TCAA', getTwincastAAValue(), 399);
    addAbility('TP', getTwinprocAAValue(), 399);
    getWornDamageFocusList().forEach(id => addAbility(id));

    return { active: active, spellProc: spellProc };
  });
}

export function getActiveRepeatingAbilities() {
  return utils.useCache('active-repeating-abilities', () => {
    return $('input.repeating-ability:checked').toArray().map(item => item.id);
  });
}

export function getAbilityCharges(id) {
  return utils.useCache('ability-charges-' + id, () => {
    let charges;
    let $node = $('#' + id + 'Charges');
    if ($node.length > 0) {
      charges = utils.getNumberValue($node.val());
    }

    return charges;
  });
}

export function getAbilityRate(id) {
  return utils.useCache('ability-rate-' + id, () => {
    return 1000 * utils.getNumberValue(($('#' + id + 'Rate').val()));
  });
}

export function getAddAfterCritFocusValue() {
  return utils.useCache('.add-after-crit-focus', () => {
    return utils.getNumberValue($('#addAfterCritFocus').val() / 100);
  });
}

export function getAddAfterCritAddValue() {
  return utils.useCache('.add-after-crit-add', () => {
    return utils.getNumberValue($('#addAfterCritAdd').val());
  });
}
export function getAddAfterSPA461AddValue() {
  return utils.useCache('.add-after-spa-461-add', () => {
    return utils.getNumberValue($('#addAfterSPA461Add').val());
  });
}

export function getAddAfterSPA461FocusValue() {
  return utils.useCache('.add-after-spa-461-focus', () => {
    return utils.getNumberValue($('#addAfterSPA461Focus').val() / 100);
  });
}

export function getAddBeforeCritFocusValue() {
  return utils.useCache('.add-before-crit-focus', () => {
    return utils.getNumberValue($('#addBeforeCritFocus').val() / 100);
  });
}

export function getAddBeforeCritAddValue() {
  return utils.useCache('.add-before-crit-add', () => {
    return utils.getNumberValue($('#addBeforeCritAdd').val());
  });
}

export function getAddBeforeDoTCritFocusValue() {
  return utils.useCache('.add-before-dot-crit-focus', () => {
    return utils.getNumberValue($('#addBeforeDoTCritFocus').val() / 100);
  });
}

export function getAddEffectivenessValue() {
  return utils.useCache('.add-effectiveness', () => {
    return utils.getNumberValue($('#addEffectiveness').val() / 100);
  });
}

export function getAddSPA461FocusValue() {
  return utils.useCache('.add-SPA461Focus', () => {
    return utils.getNumberValue($('#addSPA461Focus').val() / 100);
  });
}

export function getAddTwincastValue() {
  return utils.useCache('.add-twincast', () => {
    return utils.getNumberValue($('#addTwincast').val() / 100);
  });
}

export function getAllianceFulminationValue() {
  return utils.useCache('.allianceFulmination', () => {
    return 1000 * utils.getNumberValue($('#allianceFulmination').val());
  });
}

export function getArcaneFusionValue() {
  return utils.useCache('.aa-afusion', () => {
    return $('.aa-afusion .dropdown-toggle').data('value');
  });
}

export function getWornDamageFocusList() {
  return utils.useCache('avg-worn-dmg-focus-list', () => {
    return [
      $('.wn-farm .dropdown-toggle').data('value'),
      $('.wn-fhand .dropdown-toggle').data('value'),
      $('.wn-fhead .dropdown-toggle').data('value'),
      $('.wn-fwrist .dropdown-toggle').data('value')
    ];
  });
}

export function getBeltProcValue() {
  return utils.useCache('.belt-proc', () => {
    return $('.belt-proc .dropdown-toggle').data('value');
  });
}

export function getBeguilersSynergyValue() {
  return utils.useCache('.aa-esyn', () => {
    return utils.getNumberValue($('.aa-esyn .dropdown-toggle').data('value'));
  });
}

export function getConjurersSynergyValue() {
  return utils.useCache('.aa-msyn', () => {
    return utils.getNumberValue($('.aa-msyn .dropdown-toggle').data('value'));
  });
}

export function getCritDmgValue() {
  return utils.getNumberValue($('#innatCritDmg').val());
}

export function getCritRateValue() {
  return utils.getNumberValue($('#innatCritRate').val());
}

export function getArmorProc1Value() {
  return utils.useCache('.armor-proc1', () => {
    return $('.armor-proc1 .dropdown-toggle').data('value');
  });
}

export function getArmorProc2Value() {
  return utils.useCache('.armor-proc2', () => {
    return $('.armor-proc2 .dropdown-toggle').data('value');
  });
}

export function getDPSAug1AugValue() {
  return utils.useCache('.dps-aug1', () => {
    return $('.dps-aug1 .dropdown-toggle').data('value');
  });
}

export function getDPSAug2AugValue() {
  return utils.useCache('dps-aug2', () => {
    return $('.dps-aug2 .dropdown-toggle').data('value');
  });
}

export function getDestructiveAdeptValue() {
  return utils.useCache('.aa-dadept', () => {
    return utils.getNumberValue($('.aa-dadept .dropdown-toggle').data('value'));
  });
}

export function getEyeOfDecayValue() {
  return utils.useCache('.eye-decay', () => {
    return utils.getNumberValue($('.eye-decay .dropdown-toggle').data('value'));
  });
}

export function getFlamesOfPowerValue() {
  return utils.useCache('.aa-flames-pwr', () => {
    return utils.getNumberValue($('.aa-flames-pwr .dropdown-toggle').data('value'));
  });
}

export function getForceOfElementsValue() {
  return utils.useCache('.aa-force-of-elements', () => {
    return $('.aa-force-of-elements .dropdown-toggle').data('value');
  });
}

export function getForceOfFlameValue() {
  return utils.useCache('.aa-forceflame', () => {
    return $('.aa-forceflame .dropdown-toggle').data('value');
  });
}

export function getForceOfIceValue() {
  return utils.useCache('.aa-forceice', () => {
    return $('.aa-forceice .dropdown-toggle').data('value');
  });
}

export function getForceOfWillValue() {
  return utils.useCache('.aa-forcewill', () => {
    return $('.aa-forcewill .dropdown-toggle').data('value');
  });
}

export function getGCDValue() {
  return utils.useCache('.gcd-value', () => {
    return 1000 * utils.getNumberValue($('#gcd').val());
  });
}

export function getLuckValue() {
  return utils.useCache('.luck', () => {
    return utils.getNumberValue($('#luck').val());
  });
}

export function getSteelVengeanceValue() {
  return utils.useCache('.aa-steelveng', () => {
    return $('.aa-steelveng .dropdown-toggle').data('value');
  });
}

export function getDomForCritDGraph() {
  return $('#critDGraph').get(0);
}

export function getDomForDoTCritDGraph() {
  return $('#critDDoTGraph').get(0);
}

export function getDomForCritRGraph() {
  return $('#critRGraph').get(0);
}

export function getDomForDoTCritRGraph() {
  return $('#critRDoTGraph').get(0);
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

export function getEvokersSynergyValue() {
  return utils.useCache('.aa-wsyn', () => {
    return utils.getNumberValue($('.aa-wsyn .dropdown-toggle').data('value'));
  });
}

export function getHastenedServantValue() {
  return utils.useCache('.aa-servant', () => {
    return 1000 * utils.getNumberValue($('.aa-servant .dropdown-toggle').data('value'));
  });
}

export function getRangeAugValue() {
  return utils.useCache('.range-aug', () => {
    return $('.range-aug .dropdown-toggle').data('value');
  });
}

export function getRemorselessServantDPSValue() {
  return utils.useCache('.remorseless-servant-dps', () => {
    return utils.getNumberValue($('#remorselessDPS').val());
  });
}

export function getRemorselessServantTTLValue() {
  return utils.useCache('.remorseless-servant-ttl', () => {
    return 1000 * utils.getNumberValue($('#remorselessTTL').val());
  });
}

export function getRobeValue() {
  return utils.useCache('.wn-fchest', () => {
    return $('.wn-fchest .dropdown-toggle').data('value');
  });
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
  return utils.useCache('.shield-proc', () => {
    return $('.shield-proc .dropdown-toggle').data('value');
  });
}

export function getSorcererVengeananceValue() {
  return utils.useCache('.aa-sveng', () => {
    return utils.getNumberValue($('.aa-sveng .dropdown-toggle').data('value'));
  });
}

export function getSpellDamageValue() {
  return utils.useCache('.spell-damage', () => {
    return utils.getNumberValue($('#spellDamage').val());
  });
}

export function getSpellFocusAAValue(id) {
  return utils.useCache('.spell-focus-aa-' + id, () => {
    let value = 0;

    let keys = FOCUS_AA_KEYS[G.MODE];
    if (keys && keys[id]) {
      value = utils.getNumberValue($(keys[id]).data('value'));
      let spell = utils.getSpellData(id);

      if (id === 'SM') {
        if (value === 13) {
          value = 0.6;
        } else if (value === 12) {
          value = 0.55;
        }
        else {
          value = 0;
        }
      }
      else if (value === 9 && spell && spell.level <= 110) {
        value = 0.16;
      } else if(value === 10 && spell && spell.level <= 110) {
        value = 0.18;
      } else if(value === 11 && spell && spell.level <= 110) {
        value = 0.20;
      } else if (value === 12) {
        value = 0.22;
      } else if ( value === 13) {
        value = 0.25;
      }
      else {
        value = 0.0;
      }
    }

    return value;
  });
}

export function getSpellTimeRangeControl() {
  return $('#spellTimeRange');
}

export function getSpellTimeRangeValue() {
  let timeRange = utils.getNumberValue(getSpellTimeRangeControl().val());
  if (timeRange > 1000) {
    timeRange = 1000;
  }
  return 1000 * ((timeRange < 0) ? 0 : timeRange);
}

export function getStaffProcValue() {
  return utils.useCache('.staff-proc', () => {
    return $('.staff-proc .dropdown-toggle').data('value');
  });
}

export function getVolleyOfManyCountValue() {
  return utils.useCache('.volley-of-many-count', () => {
    return utils.getNumberValue($('#volleyOfManyCount').val());
  });
}

export function getTwincastAAValue() {
  return utils.useCache('.aa-twincast', () => {
    return utils.getNumberValue($('.aa-twincast .dropdown-toggle').data('value'));
  });
}

export function getTwinprocAAValue() {
  return utils.useCache('.aa-twinproc', () => {
    return utils.getNumberValue($('.aa-twinproc .dropdown-toggle').data('value'));
  });
}

export function getType3AugValue(spell) {
  return utils.useCache('.wn-type3-' + spell.id, () => {
    return $('.wn-type3 .dropdown-toggle').data('value') ? spell.type3Aug || 0 : 0;
  });
}

export function getType3DmdAugValue(spell) {
  return utils.useCache('.worn-type3dmgaugs-' + spell.id, () => {
    return $('.wn-type3 .dropdown-toggle').data('value') ? spell.type3DmgAug || 0 : 0;
  });
}

export function isUsingArcaneFusion() {
  return (getArcaneFusionValue() != 'NONE');
}

// Don't cache these since load rates is called before cache is cleared
// Fix sometime
export function getCriticalAfflicationValue() {
  return utils.getNumberValue($('.aa-critafflic .dropdown-toggle').data('value'));
}

export function getDestructiveCascadeValue() {
  return utils.getNumberValue($('.aa-destcascade .dropdown-toggle').data('value'));
}

export function getDestructiveFuryValue() {
  return utils.getNumberValue($('.aa-destfury .dropdown-toggle').data('value'));
}

export function getDoNValue() {
  return utils.getNumberValue($('.aa-don .dropdown-toggle').data('value'));
}

export function getFuryOfMagicValue() {
  return utils.getNumberValue($('.aa-furymagic .dropdown-toggle').data('value'));
}

export function getFamiliarValue() {
  return $('.spell-pet-focus .dropdown-toggle').data('value');
}

export function getGiftOfHazyValue() {
  return utils.getNumberValue($('.aa-hazy .dropdown-toggle').data('value'));
}

export function getLockoutTime(spell) {
  return spell.lockoutTime ? ((spell.lockoutTime > getGCDValue()) ? spell.lockoutTime : getGCDValue()) : 0;
}