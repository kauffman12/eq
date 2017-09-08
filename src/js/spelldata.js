import {globals as G} from './settings.js';
import {SPELL_DATA as GENERAL} from './spells/spelldata.general.js';
import {SPELL_DATA as WIZ} from './spells/spelldata.wiz.js';
import {SPELL_DATA as MAGE} from './spells/spelldata.mage.js';

export function get(id) {
  switch(G.MODE) {
    case 'mage':
      return GENERAL[id] || MAGE[id] || {};
    case 'wiz':
      return GENERAL[id] || WIZ[id] || {};
    default:
      return {};
  }
}