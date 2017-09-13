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
  let keys = getCounterKeys(key);
  if (state[keys.counter] > 0 && state.workingTime > state[keys.expireTime]) {
    state[keys.counter] = 0;
  }
}

export function checkStacking(hasUsedMap, map, item, key) {
  let result = item[key] || 0;

  if (result) {
    if ( !(hasUsedMap['FE'] && item.id === 'IOG') ) {
      let lookup = item.spa + "-" + item.slot;
      if (lookup) {
        let previous = map[lookup];
        if ((item.id === 'FE' && hasUsedMap['IOG']) || !previous || previous < result) {
          // save highest value
          map[lookup] = result;
          // return the difference to make up for what was
          // already accounted for
          result -= (previous || 0);
        } else {
          result = 0; // do nothing
        }
      }
    } else {
      result = 0;
    }
  }

  hasUsedMap[item.id] = true;
  return result;
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

export function collapseMenu(p) {
  let className = (G.MODE === 'wiz') ? '.mage-only' : '.wiz-only';
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

export function getCounterBasedAdps() {
  return useCache('counter-based-adps', () => {
    let options = readAdpsConfig('options');
    return readAdpsConfig('displayList').filter(id => options[id].chargeBased);
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

  return ((second - first) > 0 ? '+' : '-') + value.toFixed(2) + '%';
}

export function getSpellData(id) {
  switch(G.MODE) {
    case 'mage':
      return GEN_SPELLS[id] || MAGE_SPELLS[id] || {};
    case 'wiz':
      return GEN_SPELLS[id] || WIZ_SPELLS[id] || {};
    default:
      return {};
  }
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

export function initListProperties(obj, propList) {
  $(propList).each(function(i, item) {
    if (!obj[item]) {
      obj[item] = [];
    }
  });
}

export function initNumberProperties(obj, propList) {
  $(propList).each(function(i, item) {
    if (!obj[item]) {
      obj[item] = 0;
    }
  });
}

export function isCounterActive(state, key) {
  let keys = getCounterKeys(key);
  if (keys && keys.counter) {
    return (state[keys.counter] > 0);
  }

  return false;
}

export function numberWithCommas(x) {
  if (!x) return x;
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function readAdpsConfig(cfg) {
  return SETTINGS.adpsConfig[cfg];
}

export function readAdpsOption(opt, value) {
  let adpsOption = readAdpsConfig('options')[opt];
  return (value === undefined) ? adpsOption : adpsOption[value];
}

export function readAdditionalModifiers() {
  return [
    { id: 'additionalModifiersSection', section: SETTINGS.additionalModifiers },
    { id: 'additionalModifiersDebuffsSection', section: SETTINGS.additionalModifiersDebuffs }
  ];
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
  let className = (G.MODE === 'wiz') ? 'mage' : 'wiz';
  let classInfo = className ? "?class=" + className : "";
  window.location.assign(window.location.protocol + "//" +
    window.location.hostname + window.location.pathname +
    classInfo);
}

export function useCache(cacheKey, readFunc) {
  let value = QUERY_CACHE[cacheKey];
  if (value === undefined) {
    value = readFunc();
    QUERY_CACHE[cacheKey] = value;
  }

  return value;
}