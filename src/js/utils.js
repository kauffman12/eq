import {globals as G} from './settings.js';
import * as SETTINGS from './settings.js';
import {SPELL_DATA as GEN_SPELLS} from './spells/spelldata.general.js';
import {SPELL_DATA as WIZ_SPELLS} from './spells/spelldata.wiz.js';
import {SPELL_DATA as MAGE_SPELLS} from './spells/spelldata.mage.js';
import {SPELL_DATA as ENC_SPELLS} from './spells/spelldata.enc.js';

let QUERY_CACHE = {};

export const CLASS_TO_NAME = {
  brd: 'Bard',
  dru: 'Druid',
  enc: 'Enchanter',
  rng: 'Ranger',
  nec: 'Necromancer',
  mag: 'Magician',
  war: 'Warrior',
  wiz: 'Wizard'
};

function getActiveState(state, key) {
  let keys = getCounterKeys(key);
  let activeTimer;

  if (state[keys.expireTime] !== undefined &&state[keys.expireTime] !== -1) {
    if (state[keys.expireTime] < state.workingTime) {
      state[keys.expireTime] = -1;

      // clear counters if expired
      if (state[keys.counter] !== undefined) {
        state[keys.counter] = 0;
      }    
      return 'expired';
    } else {
      activeTimer = true;
    }
  }

  if (state[keys.counter] !== undefined) {
    if (state[keys.counter] <= 0) {
      return false;
    } else if(activeTimer || activeTimer === undefined) {
      return true;
    }
  }

  return !!activeTimer;
}

export function appendHtml(context, html, count) {
  for (let i=0; i<count; i++) {
    context.append(html);
  }
}

export function asDecimal32Precision(value) {
  return Number(value.toFixed(7));
}

export function checkTimerList(state, counterKey, timerKey) {
  let timers = state[timerKey];

  if (timers && timers.length > 0) {
    let updatedTimers = [];
    $(timers).each(function(i, timer) {
      if (state.workingTime > timer.expireTime) {
        state[counterKey] = timer.update(state[counterKey]);
      } else {
        updatedTimers.push(timer);
      }
    });

    state[timerKey] = updatedTimers;
  }
}

export function clearCache() {
  QUERY_CACHE = {};
}

export function createLabel(ability, date) {
  let label;
  if (!ability.instant) {
    label = ability.name + ' (zzz)';

    let m = date.getMinutes();
    let s = date.getSeconds();
    if (m > 0) {
      if (s > 0) {
        label = label.replace('zzz', (m + 'm' + s));
      } else {
        label = label.replace('zzz', (m + 'm'));
      }
    } else {
      label = label.replace('zzz', (s + 's'));
    }
  } else {
    label = ability.name;
  }

  return label;
}

export function collapseMenu(p) {
  let doShow = (hidden) => {
    if (hidden.length > 0) {
      hidden.show();
      $(p).find('span.glyphicon').addClass('glyphicon-chevron-down')
      $(p).find('span.glyphicon').removeClass('glyphicon-chevron-left');
    } else {
      $(p).siblings('li').hide();
      $(p).find('span.glyphicon').removeClass('glyphicon-chevron-down')
      $(p).find('span.glyphicon').addClass('glyphicon-chevron-left');
    }
  };

  console.debug("collapse");

  switch(G.MODE) {
    case 'wiz':
      doShow($(p).siblings('li:hidden:not(".enc-only,.mag-only")'));
      break;
    case 'mag':
      doShow($(p).siblings('li:hidden:not(".enc-only,.wiz-only")'));
      break;
    case 'enc':
      doShow($(p).siblings('li:hidden:not(".wiz-only,.mag-only")'));
      break;
  }
}

export function createTimer(expireTime, updateFunc) {
  return { expireTime: expireTime, update: updateFunc };
}

export function displayPercent(value) {
  return value ? (value * 100).toFixed(2) + "%" : "0%";
}

export function getCastTime(state, spell) {
  let castTime = spell.castTime;

  // cast spells that can be adjusted
  // DF is listed as 250 atm 
  if (spell.level <= 250 && spell.castTime > 0) {
    let adjust = 0;
    if (state && state.activeAbilities.has('QT')) {
      adjust = 250;
    }

    let origCastTime = spell.origCastTime;
    if (spell.mez) { // enc mez have 30% bonus AA
      origCastTime -= adjust;
      castTime = origCastTime - origCastTime * 0.30; 
    } else if (origCastTime >= 3000) {
      origCastTime -= adjust;
      if (['DF', 'FA'].find(id => id === spell.id)) {
        // DF and FA don't receive benefit from AA quicker damage
        castTime = origCastTime - origCastTime * 0.34; 
      } else {
        // most spells hit 50% cap with piety + legs + AA (11 + 23 + 20)
        castTime = origCastTime - origCastTime * 0.50; 
      }
    } else {
      origCastTime -= adjust;
      // spells with low cast times only receive AA benefit
      castTime = origCastTime - origCastTime * 0.20;
    }
  }

  return castTime;
}

export function getCurrentTime() {
  let date = new Date();
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date.getTime();
}

export function getCounterKeys(key) {
  return useCache('counter-key-' + key, function() {
    let lower = key.toLowerCase();
    return {
      counter: lower + 'Counter',
      charges: lower + 'ChargesUsed',
      addDmg: lower + 'AddDmg',
      expireTime: lower + 'ExpireTime',
      timers: lower + 'Timers'
    };
  });
}

export function getNumberValue(n) {
  return Number(n) || 0;
}

export function getPercentClass(first, second) {
  let className = "";
  if (first > second) {
    className = 'stat-down';
  } else if (first < second) {
    className = 'stat-up';
  }

  return className;
}

export function getPercentText(first, second) {
  let value = (second - first);
  if (value != 0) {
    value = (value > 0 ? second / first * 100 - 100 : 100 - second / first * 100);
  }

  value = (value > 99999) ? value.toExponential(2) : value.toFixed(2);
  return ((second - first) > 0 ? '+' : '-') + value + '%';
}

export function getSpellData(id) {
  switch(G.MODE) {
    case 'enc':
      return GEN_SPELLS[id] || ENC_SPELLS[id] || {};
    case 'mag':
      return GEN_SPELLS[id] || MAGE_SPELLS[id] || {};
    case 'wiz':
      return GEN_SPELLS[id] || WIZ_SPELLS[id] || {};
  }
}

export function getAllSpellData() {
  return [
    { name: 'gen', spells: GEN_SPELLS },
    { name: 'mag', spells: MAGE_SPELLS },
    { name: 'wiz', spells: WIZ_SPELLS }
  ];
}

export function getUrlParameter(sParam) {
  let sPageURL = decodeURIComponent(window.location.search.substring(1)),
    sURLVariables = sPageURL.split('&'),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : sParameterName[1];
    }
  }
}

export function isAbilityActive(state, key) {
  let activeState = getActiveState(state, key);

  if (activeState === 'expired') {
    return false;
  }

  return activeState;
}

export function isAbilityExpired(state, key) {
  return (getActiveState(state, key) === 'expired');
}

export function numberWithCommas(x) {
  if (!x) return x;
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function readChartOptions(key, time) {
  let opts = SETTINGS['chartOptions'][key];
  opts.start = time - 5000;
  opts.end = time + 120000;
  opts.min = time - 5000;
  return opts;
}

export function readDmgFocusContext() {
  return SETTINGS['basicDmgFocusContext'];
}

export function readMainContext() {
  return SETTINGS[G.MODE + 'DPSAAContext'];
}

export function readSpellFocusContext() {
  return SETTINGS[G.MODE + 'SpellFocusAAContext'];
}

export function readSpellList() {
  let list = [];
  $(SETTINGS[G.MODE + 'SpellList']).each(function(i, id) {
    list.push(getSpellData(id));
  });
  return list;
}

export function switchMode(toMode) {
  if (G.MODE !== toMode) {
    let className = toMode;
    let classInfo = className ? "?class=" + className : "";
    window.location.assign(
      window.location.protocol + "//" +
      window.location.hostname +
      ((window.location.port !== '') ? (':' +  window.location.port) : '') +
      window.location.pathname +
      classInfo
    );
  }
}

export function toUpper(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function useCache(cacheKey, readFunc) {
  let value = QUERY_CACHE[cacheKey];
  if (value === undefined) {
    value = readFunc();
    QUERY_CACHE[cacheKey] = value;
  }

  return value;
}