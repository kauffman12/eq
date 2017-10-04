import {globals as G} from './settings.js';
import * as SETTINGS from './settings.js';
import {SPELL_DATA as GEN_SPELLS} from './spells/spelldata.general.js';
import {SPELL_DATA as WIZ_SPELLS} from './spells/spelldata.wiz.js';
import {SPELL_DATA as MAGE_SPELLS} from './spells/spelldata.mage.js';

let QUERY_CACHE = {};

export function appendHtml(context, html, count) {
  for (let i=0; i<count; i++) {
    context.append(html);
  }
}

export function asDecimal32Precision(value) {
  return Number(value.toFixed(7));
}

export function checkSimpleTimer(state, key) {
  let expired = false;
  
  let keys = getCounterKeys(key);
  if ((state[keys.expireTime] !== -1 && state.workingTime > state[keys.expireTime]) || state[keys.counter] === 0) {
    state[keys.expireTime] = -1;
    expired = true;

    // cleanup counters if any
    if (state[keys.counter]) {
      state[keys.counter] = 0;
    }
  }
  
  return expired;
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
  let className = (G.MODE === 'wiz') ? '.mag-only' : '.wiz-only';
  let hidden = $(p).siblings('li:hidden:not(' + className + ')');
  if (hidden.length > 0) {
    hidden.show();
    $(p).find('span.glyphicon').addClass('glyphicon-chevron-down')
    $(p).find('span.glyphicon').removeClass('glyphicon-chevron-left');
  } else {
    $(p).siblings('li').hide();
    $(p).find('span.glyphicon').removeClass('glyphicon-chevron-down')
    $(p).find('span.glyphicon').addClass('glyphicon-chevron-left');
  }
}

export function createTimer(expireTime, updateFunc) {
  return { expireTime: expireTime, update: updateFunc };
}

export function displayPercent(value) {
  return value ? (value * 100).toFixed(2) + "%" : "0%";
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
  let keys = getCounterKeys(key);
  return state[keys.expireTime] >= state.workingTime || state[keys.counter] > 0;
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

export function switchMode() {
  let className = (G.MODE === 'wiz') ? 'mag' : 'wiz';
  let classInfo = className ? "?class=" + className : "";
  window.location.assign(
    window.location.protocol + "//" +
    window.location.hostname +
    ((window.location.port !== '') ? (':' +  window.location.port) : '') +
    window.location.pathname +
    classInfo
  );
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