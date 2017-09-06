var settings = require('./settings.js');
var spelldata = require('./spelldata.js');

var QUERY_CACHE = {};

var self = module.exports = {
  appendHtml: function(context, html, count) {
    for (var i=0; i<count; i++) {
      context.append(html);
    }
  },
  asDecimal32Precision: function(value) {
    return Number(value.toFixed(7));
  },
  buildCompoundSpellMap: function(c) {
    return {
      'WE': [c + 'PE', c + 'HC', c + 'CI'],
      'WF': [c + 'PF', c + 'RC2', c + 'CS2'],
      'FU': [c + 'ES', c + 'ER', c + 'EF']
    };
  },
  checkSimpleTimer: function(state, workingTime, key) {
    var keys = self.getCounterKeys(key);
    if (state[keys.counter] > 0 && workingTime > state[keys.expireTime]) {
      state[keys.counter] = 0;
    }
  },
  checkStacking: function(hasUsedMap, map, item, key) {
    var result = item[key] || 0;
    
    if (result) {
      if ( !(hasUsedMap['FE'] && item.id == 'IOG') ) {
        var lookup = item.spa + "-" + item.slot;
        if (lookup) {
          var previous = map[lookup];
          if ((item.id == 'FE' && hasUsedMap['IOG']) || !previous || previous < result) {
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
  },
  checkTimerList: function(state, workingTime, counterKey, timerKey) {
    var timers = state[timerKey];

    if (timers && timers.length > 0) {
      var updatedTimers = [];
      $(timers).each(function(i, timer) {
        if (workingTime > timer.expireTime) {
          state[counterKey] = timer.update(state[counterKey]);
        } else {
          updatedTimers.push(timer);
        }
      });
      
      state[timerKey] = updatedTimers;
    }
  },
  clearCache: function() {
    QUERY_CACHE = {};
  },
  collapseMenu: function(p) {
    var className = (MODE == 'wiz') ? '.mage-only' : '.wiz-only';
    var hidden = $(p).siblings('li:hidden:not(' + className + ')');
    if (hidden.length > 0) {
      hidden.show();
      $(p).find('span.glyphicon').addClass('glyphicon-chevron-down')
      $(p).find('span.glyphicon').removeClass('glyphicon-chevron-left');
    } else {
      $(p).siblings('li').hide();
      $(p).find('span.glyphicon').removeClass('glyphicon-chevron-down')
      $(p).find('span.glyphicon').addClass('glyphicon-chevron-left');
    }
  },  
  createTimer: function(expireTime, updateFunc) {
    return { expireTime: expireTime, update: updateFunc };
  },
  displayPercent: function(value) {
    return value ? (value * 100).toFixed(2) + "%" : "0%";
  },
  getCurrentTime: function() {
    var date = new Date();
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date.getTime();    
  },
  getCompoundSpellList: function(id) {
    return self.useCache('compound-spell-list-' + id, function() {
      return {
        'WF': [
          { id: 'PF', chance: WILDMAGIC_PURE_CHANCE },
          { id: 'RC2', chance: WILDMAGIC_RIMEBLAST_CHANCE },
          { id: 'CS2', chance: WILDMAGIC_CHAOS_CHANCE }
        ],
        'WE': [
          { id: 'PE', chance: WILDMAGIC_PURE_CHANCE },
          { id: 'HC', chance: WILDMAGIC_RIMEBLAST_CHANCE },
          { id: 'CI', chance: WILDMAGIC_CHAOS_CHANCE }          
        ],
        'FU': [
          { id: 'ES', chance: FUSE_PROC_SPELL_CHANCE },
          { id: 'ER', chance: FUSE_PROC_SPELL_CHANCE },
          { id: 'EF', chance: FUSE_PROC_SPELL_CHANCE }        
        ]
      }[id];
    });
  },
  getCounterKeys: function(key) {
    return self.useCache('counter-key-' + key, function() {
      var lower = key.toLowerCase();
      return {
        counter: lower + 'Counter',
        charges: lower + 'ChargesUsed',
        addDmg: lower + 'AddDmg',
        expireTime: lower + 'ExpireTime'
      };
    });
  },
  getNumberValue: function(n) {
    return Number(n) || 0;
  },
  getPercentClass: function(first, second) {
    var className = "";
    if (first > second) {
      className = 'stat-down';
    } else if (first < second) {
      className = 'stat-up';      
    }
    
    return className;
  }, 
  getPercentText: function(first, second) {
    var value = (second - first);
    if (value != 0) {
      value = (value > 0 ? second / first * 100 - 100 : 100 - second / first * 100);
    }
    
    return ((second - first) > 0 ? '+' : '-') + value.toFixed(2) + '%';
  },
  getSpellData: function(id) {
    return spelldata.get(id) || {};
  },
  getUrlParameter: function(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i;

    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');

      if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined ? true : sParameterName[1];
      }
    }
  },
  initListProperties: function(obj, propList) {
    $(propList).each(function(i, item) {
      if (!obj[item]) {
        obj[item] = [];
      }
    });
  },
  initNumberProperties: function(obj, propList) {
    $(propList).each(function(i, item) {
      if (!obj[item]) {
        obj[item] = 0;
      }
    });
  },
  isCounterActive: function(state, key) {
    var keys = self.getCounterKeys(key);
    if (keys && keys.counter) {
      return (state[keys.counter] > 0);
    }
    
    return false;
  },
  numberWithCommas: function(x) {
    if (!x) return x;
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },
  readAdpsConfig: function(cfg) {
    return settings.adpsConfig[cfg];
  },
  readAdpsOption: function(opt, value) {
    var adpsOption = self.readAdpsConfig('options')[opt];
    return (value == undefined) ? adpsOption : adpsOption[value];
  },
  readAdditionalModifiers: function() {
    return [
      { id: 'additionalModifiersSection', section: settings.additionalModifiers },
      { id: 'additionalModifiersDebuffsSection', section: settings.additionalModifiersDebuffs }
    ];       
  },
  readChartOptions: function(key) {
    return settings['chartOptions'][key];
  },
  readDmgFocusContext: function() {
    return settings['basicDmgFocusContext'];
  },
  readMainContext: function() {
    return settings[MODE + "DPSAAContext"];
  },
  readSpellFocusContext: function() {
    return settings[MODE + "SpellFocusAAContext"];
  },
  readSpellList: function() {
    var list = [];
    $(settings[MODE + 'SpellList']).each(function(i, id) {
      list.push(spelldata.get(id));
    });
    return list;
  },
  switchMode: function() {
    var className = (MODE == 'wiz') ? 'mage' : 'wiz';
    var classInfo = className ? "?class=" + className : "";
    window.location.assign(window.location.protocol + "//" + 
      window.location.hostname + window.location.pathname + 
      classInfo);
  },
  updateSpellCounts: function(spellCountMap, id) {
    if (spellCountMap[id] == undefined){
      spellCountMap[id] = 1;
    } else {
      spellCountMap[id]++;
    }
  },  
  useCache: function(cacheKey, readFunc) {
    var value = QUERY_CACHE[cacheKey];
    if (value == undefined) {
      value = readFunc();
      QUERY_CACHE[cacheKey] = value;
    }
    
    return value;
  }
};