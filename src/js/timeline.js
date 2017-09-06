var damage = require('./damage.js');
var dom = require('./dom.js');
var stats = require('./stats.js');
var utils = require('./utils.js');

var SPELL_DETAILS_TEMPLATE = Handlebars.compile($('#spell-details-template').html());
var SPELL_ITEM_TEMPLATE = Handlebars.compile($('#spell-timeline-item-template').html());
var TIMELINE_ITEM_TEMPLATE = Handlebars.compile($('#timeline-item-template').html());

var CURRENT_TIME = utils.getCurrentTime();
var BASE_CRIT_DATA = [];
var UPDATING_CHART = -1;

var CRITR_DATA = new vis.DataSet([]);
var CRITD_DATA = new vis.DataSet([]);
var DMG_DATA = new vis.DataSet([]);
var SPELLLINE_DATA = new vis.DataSet([]);
var TIMELINE_DATA = new vis.DataSet([]);

var CHART_TIMES = {
  start: CURRENT_TIME - 5000,
  end: CURRENT_TIME + 120000,
  min: CURRENT_TIME - 5000
};

var GRAPH_CRITR_OPTS = $.extend(utils.readChartOptions('graphcritr'), CHART_TIMES);
var GRAPH_CRITD_OPTS = $.extend(utils.readChartOptions('graphcritd'), CHART_TIMES);
var GRAPH_DMG_OPTIONS = $.extend(utils.readChartOptions('graphdmg'), CHART_TIMES);
var SPELLLINE_OPTIONS = $.extend(utils.readChartOptions('spellline'), CHART_TIMES);
var TIMELINE_OPTIONS = $.extend(utils.readChartOptions('timeline'), CHART_TIMES);
TIMELINE_OPTIONS.template = TIMELINE_ITEM_TEMPLATE;

var GRAPH_CRITR = new vis.Graph2d(dom.getDomForCritRGraph(), CRITR_DATA, GRAPH_CRITR_OPTS);
var GRAPH_CRITD = new vis.Graph2d(dom.getDomForCritDGraph(), CRITD_DATA, GRAPH_CRITD_OPTS);
var GRAPH_DMG = new vis.Graph2d(dom.getDomForDmgGraph(), DMG_DATA, GRAPH_DMG_OPTIONS);
var SPELL_TIMELINE = new vis.Timeline(dom.getDomForSpellline(), SPELLLINE_DATA, SPELLLINE_OPTIONS);
var TIMELINE = new vis.Timeline(dom.getDomForTimeline(), TIMELINE_DATA, TIMELINE_OPTIONS);

var REPEATED_ABILITIES = [
  { id: 'ESYN', enabled: dom.isUsingEncSynergy, rate: dom.getEncSynergyRate, timer: SYNERGY_TIMER, count: 1 },
  { id: 'EHAZY', enabled: dom.isUsingEncHazy, rate: dom.getEncHazyRate, timer: ENC_HAZY_TIMER, count: 1 },
  { id: 'MSYN', enabled: dom.isUsingMagSynergy, rate: dom.getMagSynergyRate, timer: SYNERGY_TIMER, count: 1 },
  { id: 'NSYN', enabled: dom.isUsingNecSynergy, rate: dom.getNecSynergyRate, timer: SYNERGY_TIMER, count: 1 },
  { id: 'WSYN', enabled: dom.isUsingWizSynergy, rate: dom.getWizSynergyRate, timer: SYNERGY_TIMER, count: 1 },
  { id: 'MR', enabled: dom.isUsingMR, rate: dom.getMRRate, timer: MR_TIMER * 10, count: MR_COUNTERS },
  { id: 'FW', enabled: dom.isUsingFW, rate: dom.getFWRate, timer: FW_TIMER * 10, count: FW_COUNTERS }  
];

var castFirebound = function(state, time, chartIndex) {
  var result = null;
  
  if (MODE == 'mage' && state.fbOrbCounter > 0) {
    result = castForceNuke(state, ['BJ'], time, chartIndex);
    if (result != null) {
      state.fbOrbCounter--;
    }
  }
  
  return result;
};

var castForceNuke = function(state, forceNukes, time, chartIndex) {
  var aaNuke = isSpellReady(forceNukes, time, state.lastCastMap);

  if (aaNuke) {
    state.chartIndex = chartIndex;
    stats.updateSpellStatistics(state, 'chartIndex', state.chartIndex);

    state.workingTime = aaNuke.time;
    state.spell = aaNuke.spell;
    state.hasStatistics = true;

    // Save time since last cast
    if (state.lastCastMap[aaNuke.spell.timer]) {
     stats.updateSpellStatistics(state, 'castInterval', (state.workingTime - state.lastCastMap[aaNuke.spell.timer]) / 1000);
    }

    stats.updateSpellStatistics(state, 'id', aaNuke.spell.id);
    var aaNukeDmg = damage.computeDamage(state, self);

    // update spell timeline
    var content = SPELL_ITEM_TEMPLATE({title: aaNuke.spell.name, id: aaNuke.spell.id.substring(0,2), spellNumber: chartIndex})
    var spellTime = {id: chartIndex, content: content, start: aaNuke.time, editable: false};
    var dmgTime = {id: aaNuke.time, x: aaNuke.time, y: aaNukeDmg};
    dmgTime.label = {content: aaNukeDmg, yOffset: 15};

    return { nuke: aaNuke, spellTime: spellTime, dmgTime: dmgTime, dmg: aaNukeDmg };
  }

  return null;
};

var isSpellReady = function(ids, time, lastCastMap) {
  var result = null;
  
  $(ids).each(function(i, id) {
    var spell = utils.getSpellData(id);
    var refresh = spell.discRefresh * 1000;
  
    if (!lastCastMap[spell.timer] || (lastCastMap[spell.timer] + refresh) < time) {
      result = { spell: spell, time: time };
      return false; // exit each loop
    }
  });
  
  return result;
};

var getRSDamage = function(state) {
  return dom.getRemorselessServantDPSValue() * state.rsCount;
};

var handleRepeatedProc = function(state, hasProc, lastProcMap, key, workingTime, offset, timer, refreshCount) {
  var keys = utils.getCounterKeys(key);
  
  if (hasProc) {
    if (!lastProcMap[key] || lastProcMap[key] + offset < workingTime) {
      if (!lastProcMap[key]) {
        lastProcMap[key] = CURRENT_TIME;
        state[keys.expireTime] = CURRENT_TIME + timer;
      } else {
        lastProcMap[key] += offset;
        state[keys.expireTime] = workingTime + timer;
      }

      state[keys.counter] = refreshCount;
    }
  }

  utils.checkSimpleTimer(state, workingTime, key);
};

var silentUpdateTimeline = function(data) {
  TIMELINE_DATA.off('update', self.visTimelineListener);
  TIMELINE_DATA.update(data);
  TIMELINE_DATA.on('update', self.visTimelineListener);
};

var updateCritGraphs = function() {
  CRITR_DATA.clear();
  CRITD_DATA.clear();

  var critRPoints = [];
  var critDPoints = [];
  var prevRate = 0;
  var prevDmg = 0;
  var lastRateLabel = 0;
  var lastDmgLabel = 0;

  $(BASE_CRIT_DATA).each(function(i, item) {
    var rp = {id: item.time, x: item.time, y: item.rate};
    var dp = {id: item.time, x: item.time, y: item.dmg};

    if (prevRate != item.rate || lastRateLabel % 10 == 0) {
      rp.label = {content: item.rate + '%', yOffset: 15};
      lastRateLabel = 0;
    }

    lastRateLabel++;
    prevRate = item.rate;

    if (prevDmg != item.dmg || lastDmgLabel % 10 == 0) {
      dp.label = {content: '+' + item.dmg + '%', yOffset: 15};
      lastDmgLabel = 0;
    }

    lastDmgLabel++;
    prevDmg = item.dmg;

    critRPoints.push(rp);
    critDPoints.push(dp);
  });

  // Update graph
  CRITR_DATA.add(critRPoints);
  CRITD_DATA.add(critDPoints);
};

var updateCritGraphValue = function(data, time, value) {
  var item = data.get(time);
  if (item.y != value) {
    if (item.label) {
      var l = item.label.content;
      item.label.content = '%' + value + l.substring(l.indexOf('%'), l.length);
    }

    item.y = value;
    data.update(item);
  }
};

var self = module.exports = {
  callUpdateSpellChart: function() {
    if (UPDATING_CHART == -1) {
      UPDATING_CHART = setTimeout(function() {
        self.updateSpellChart();
        UPDATING_CHART = -1;
      }, 350);
    } else {
      clearTimeout(UPDATING_CHART);
      UPDATING_CHART = -1;
      self.callUpdateSpellChart();
    }
  },
  connectPopovers: function() {
    var items = $('#spellline div.vis-center div.vis-itemset div.vis-foreground a[data-toggle="popover"]');
    items.popover({html: true});

    items.unbind('inserted.bs.popover');
    items.on('inserted.bs.popover', function(e) {
      var index = $(e.currentTarget).data('value');
      var statInfo = stats.getSpellStatisticsForIndex(index);

      var popover = $('#spellPopover' + index);
      popover.html('');
      popover.append(SPELL_DETAILS_TEMPLATE({ data: stats.getStatisticsSummary(statInfo) }));
    });
  },
  createAdpsItem: function(adpsOption, repeat) {
    var adpsItem = {
      id: adpsOption.id,
      start: CURRENT_TIME,
      end: CURRENT_TIME + adpsOption.offset
    };

    var label = self.createLabel(adpsOption, new Date(adpsItem.end - adpsItem.start));
    adpsItem.content = label;
    adpsItem.title = label;
    adpsItem.group = utils.readAdpsConfig('displayList').indexOf(adpsOption.id);
    TIMELINE_DATA.add(adpsItem);
    return adpsItem;
  },
  createLabel: function(adpsOption, date) {
    var label;
    if (!adpsOption.instant) {
      var label = adpsOption.content + ' (zzz)';

      var m = date.getMinutes();
      var s = date.getSeconds();
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
      label = adpsOption.content;
    }

    return label;
  },
  getAdpsDataIfActive: function(id, time, key) {
    var item = TIMELINE_DATA.get(id);
    if (item && self.withinTimeFrame(time, self.getTime(item))) {
      var adpsOption = utils.readAdpsOption(id);
      return (key == undefined) ? adpsOption : adpsOption[key];
    }
    return null;
  },
  getAdpsGroups: function() {
    var groups = new vis.DataSet();
    var displayList = utils.readAdpsConfig('displayList');
    $(displayList).each(function(i, item) {
      groups.add({id: i, content: utils.readAdpsOption(item)});
    });
  },
  getArcaneFuryValue: function(time) {
    if (MODE == 'wiz' && self.getAdpsDataIfActive('AF', time)) {
      return ARCANE_FURY_FOCUS;
    }
    return 0;
  },
  getCritDataAtTime: function(time) {
    var result;
    
    if (CRITR_DATA.get(time)) {
      result = {
        critRate: CRITR_DATA.get(time).y / 100,
        critDmgMult: CRITD_DATA.get(time).y / 100
      };
    }
    
    return result;
  },
  getElementalUnionValue: function(time) {
    var value = (MODE == 'mage') ? self.getAdpsDataIfActive('EU', time, 'afterCritMult') : 0;
    return value || 0;
  },
  getHeartOfFlamesValue: function(time) {
    var value = (MODE == 'mage') ? self.getAdpsDataIfActive('HF', time, 'afterCritMult') : 0;
    return value || 0;
  },
  getItem: function(id) {
    return TIMELINE_DATA.get(id);
  },
  getTime: function(item) {
    var result = {};
    
    if (item) {
      var start = item.start.getTime ? item.start.getTime() : item.start;
      var end = item.end.getTime ? item.end.getTime() : item.end;
      result.start = start;
      result.end = end;
    }
    
    return result;
  },
  init: function() {
    // connect all the zoom/pan/range events together of the charts
    var chartList = [SPELL_TIMELINE, TIMELINE, GRAPH_CRITR, GRAPH_CRITD, GRAPH_DMG];
    $(chartList).each(function(index, chart) {
      chart.on('rangechanged', function(update) {
        self.updateWindow(chart, update, chartList);
      });
    });

    TIMELINE.setGroups(self.getAdpsGroups());
    TIMELINE_DATA.on('add', self.visTimelineListener);
    TIMELINE_DATA.on('update', self.visTimelineListener);
    TIMELINE_DATA.on('remove', self.visTimelineListener);
  },
  initCounterBasedADPS: function(state, adpsKey) {
    var counter = utils.getCounterKeys(adpsKey).counter;
    var item = self.getItem(adpsKey);
    
    if (item) {
      var time = self.getTime(item);
      var timeLimit = utils.readAdpsOption(adpsKey, 'offset');
      var maxTimeFrame = { start: time.start, end: time.start + timeLimit };

      if (self.withinTimeFrame(state.workingTime, maxTimeFrame)) {
        if (state[counter] == undefined) {
          state[counter] = utils.readAdpsOption(adpsKey, 'charges');
        }
      } else if (time.start + timeLimit < state.workingTime) {
        state[counter] = -1;
      }
    }
  },
  loadRates: function() {
    BASE_CRIT_DATA = [];
    var baseRate = damage.calcBaseCritRate();
    var baseDmg = damage.calcBaseCritDmg();
    var seconds = dom.getSpellTimeRangeValue();
    var displayList = utils.readAdpsConfig('displayList');

    for(var i=0; i<=(seconds*1000); i+=1000) {
      var time = CURRENT_TIME + i;
      var rate = baseRate;
      var dmg = baseDmg;
      var rateStacking = {};
      var dmgStacking = {};
      var hasUsedMap = {};

      $(displayList).each(function(index, item) {
        var adpsItem = TIMELINE_DATA.get(item);
        if (self.withinTimeFrame(time, adpsItem)) {
          var adpsOption = utils.readAdpsOption(item);
          if (!adpsOption.chargeBased) {
            rate += utils.checkStacking(hasUsedMap, rateStacking, adpsOption, 'critRateMod');
            dmg += utils.checkStacking(hasUsedMap, dmgStacking, adpsOption, 'critDmgMod');
          }
        }
      });

      BASE_CRIT_DATA.push({time: time, rate: rate, dmg: dmg});
    }
  },
  postCounterBasedADPS: function(state, adpsKey) {
    var counter = utils.getCounterKeys(adpsKey).counter;
    
    var item = self.getItem(adpsKey);
    if (item) {
      var time = self.getTime(item);
      var adpsOption = utils.readAdpsOption(adpsKey);
      if (state[counter] == 0) {
        // this is the last one
        item.end = state.workingTime;
        item.content = self.createLabel(adpsOption, new Date(state.workingTime - time.start));
        item.title = item.content;
        silentUpdateTimeline(item);
        state[counter] = -1;
      } else if (state[counter] > 0) {
        var timeLimit = adpsOption.offset;
        if ( (time.end - time.start) != timeLimit ) {
          item.end = time.start + timeLimit;
          item.content = self.createLabel(adpsOption, new Date(timeLimit));
          item.title = item.content;
          silentUpdateTimeline(item);
        }
      }
    }
  },    
  removeAdpsItemById: function(id) {
    TIMELINE_DATA.remove(id);
  },
  removePopovers: function() {
    $('.popover').remove();
  },
  setTitle: function(data, adpsOption, date) {
    var label = self.createLabel(adpsOption, date);
    var lineItem = data.get(adpsOption.id);
    if (lineItem.content != label) {
      lineItem.content = label;
      lineItem.title = label;
      data.update(lineItem);
    }
  },
  updateSpellChart: function() {
    utils.clearCache();
    SPELLLINE_DATA.clear();
    DMG_DATA.clear();
    stats.resetSpellStats();
    updateCritGraphs();
    self.removePopovers();

    var spellTimeline = [];
    var spellDmgTimeline = [];
    var spells = dom.getSelectedSpells();
    var timeRange = dom.getSpellTimeRangeValue() * 1000;
    var totalAvgDmg = 0;
    var totalAvgPetDmg = 0;
    var chartIndex = 0;
    var totalCritRate = 0;
    var maxHit = 0;
    var spellCountMap = {};
    var detSpellCount = 0;
    var additionalCast = null;

    var gcd = dom.getGCDValue() * 1000;
    var hasTwincast = TIMELINE_DATA.get('TC');
    var hasForcedRejuv = TIMELINE_DATA.get('FR');

    var workingTime = CURRENT_TIME;
    var end = CURRENT_TIME + timeRange;
    var sp = 0;
    var fullSpellsCast = [];
    var twincastHasBeenCast = false;
    var usingAANukes = dom.isUsingAAForceNukes();
    var forceNukes = dom.getForceNukes();
    var lastProcMap = {};
    var usingFireboundOrb = dom.isUsingFireboundOrb();
    var remorselessTTL = dom.getRemorselessServantTTLValue() * 1000;
    var gcdWaitTime = 0;
    var reportRSDamage = 0;
    var lastAddCastTime = 0;
    var allianceTimer = dom.getAllianceFulminationValue() * 1000;

    var state = {
      hasStatistics: true,
      twincastChance: 0,
      updatedCritRValues: [],
      updatedCritDValues: [],
      lastCastMap: {},
      spells: spells,
      fbOrbCounter: FIREBOUND_ORB_COUNT,
      rsCount: 0,
      rsTimers: []
    };

    while (workingTime < end) {
      // temp fix for twincast to work with Blazing Jet when no spells selected
      if (hasTwincast) {
        var tcTime = self.getTime(hasTwincast);
        if (workingTime >= tcTime.start && workingTime <= tcTime.end) {
          state.twincastChance = 1.0;
        }
      }

      // Check if remorseless servants have expired
      utils.checkTimerList(state, workingTime, 'rsCount', 'rsTimers');

      // Report damage every second
      if (state.rsCount > 0 && workingTime % 1000 == 0) {
        reportRSDamage = getRSDamage(state);
      }

      // Don't do anything if we're duing the GCD phase
      if (gcdWaitTime < workingTime) {
        // Recent spell last cast times on a Forced Rejuvination
        if (hasForcedRejuv) {
          var rejuvTime = self.getTime(hasForcedRejuv);
          if (self.withinTimeFrame(workingTime, rejuvTime)) {
            hasForcedRejuv = false;
            $(spells).each(function(i, id) {
              delete state.lastCastMap[utils.getSpellData(id).timer]
            });
          }
        }

        for (sp = 0; sp < spells.length; sp++) {
          var id = spells[sp];
          var current = utils.getSpellData(id);
          var recastMod = 0;

          // Override current spell if we need to cast more orbs
          if (state.fbOrbCounter <= 0) {
            id = "SFB";
            current = utils.getSpellData('SFB');
            state.fbOrbCounter = FIREBOUND_ORB_COUNT;
          }

          // Override current spell if alliance is fullfilled
          if (state.fboundAllianceTimer && state.fboundAllianceTimer <= workingTime) {
            id = "FF";
            current = utils.getSpellData('FF');
            state.fboundAllianceTimer = 0;
          }

          // Handle pre-cast adjustments
          switch(current.id) {
            case 'RS':
              recastMod = (dom.getHastenedServantValue() + dom.getType3AugValue(current)) * -1000;
              break;
          }

          var neededTime = current.castTime * 1000;
          var timeDifference = workingTime - ((state.lastCastMap[current.timer] ? state.lastCastMap[current.timer] : 0) + (current.recastTime * 1000 + recastMod));
          var lockoutTime = ((current.lockoutTime * 1000) > gcd) ? (current.lockoutTime * 1000) : gcd;
          state.twincastChance = 0;

          // check if twincast needs to be cast soon
          var waitForTc = false;
          if (hasTwincast) {
            var tcTime = self.getTime(hasTwincast);
            var timeToCastTc = workingTime + neededTime + lockoutTime;

            // if we're about to cast a spell but it won't land until after Twincast is supposed to be
            // cast then do nothing and wait for the cast of Twincast
            if (timeDifference >= 0 && timeToCastTc >= tcTime.start && workingTime < tcTime.end && !twincastHasBeenCast) {
              waitForTc = true;
            }

            // Cast Twincast once we go the point where end of lockout time basically coincides
            // with where the timeline has Twincast starting
            if (((workingTime + gcd) >= tcTime.start) && (workingTime < tcTime.end) && state.twincastChance < 1.0) {
              // cast twincast only once (ie increment time)
              if (!twincastHasBeenCast) {
                id = 'TC';
                current = utils.getSpellData('TC');
                timeDifference = 0;
                neededTime = 0;

                // Fix start point on timeline if its out of bounds
                if (hasTwincast.start != workingTime) {
                  var diff = hasTwincast.end - hasTwincast.start;
                  hasTwincast.start = workingTime;
                  hasTwincast.end = hasTwincast.start + diff;
                  silentUpdateTimeline(hasTwincast);
                }
              }

              state.twincastChance = 1.0;
              waitForTc = false;
              twincastHasBeenCast = true;
            }

            // End twincast once we're out of the time range
            if (workingTime + neededTime > tcTime.end && state.twincastChance > 0) {
              state.twincastChance = 0;
            }
          }

          if (!waitForTc && timeDifference >= 0) {
            workingTime += neededTime;

            // update spell damage timeline
            state.chartIndex = chartIndex;
            stats.updateSpellStatistics(state, 'chartIndex', state.chartIndex);

            // Save time since last cast
            if (state.lastCastMap[current.timer]) {
             stats.updateSpellStatistics(state, 'castInterval', (workingTime - state.lastCastMap[current.timer]) / 1000);
            }

            state.lastCastMap[current.timer] = workingTime;
            if (workingTime >= end) break; // Time EXCEEDED
            
            // Abilities that can be enabled and repeat every so often like Enc Synergy
            $(REPEATED_ABILITIES).each(function(i, item) {
              handleRepeatedProc(state, item.enabled(), lastProcMap, item.id, workingTime, item.rate(), item.timer, item.count);
            });

            fullSpellsCast.push({ id: id, time: workingTime });

            // update spell timeline
            var content = SPELL_ITEM_TEMPLATE({title: current.name, id: id, spellNumber: chartIndex})
            spellTimeline.push({id: chartIndex, content: content, start: workingTime, editable: false});

            state.workingTime = workingTime;
            state.spell = current;
            stats.updateSpellStatistics(state, 'id', current.id);

            // only compute for spells that do damage
            var avgDmg = (current.target != 'self') ? damage.computeDamage(state, self) : 0;
            utils.updateSpellCounts(spellCountMap, current.id);

            if (avgDmg > 0) {
              totalAvgDmg += avgDmg;
              maxHit = (avgDmg > maxHit) ? avgDmg : maxHit;
              totalCritRate += damage.calcCompoundSpellCritRate(chartIndex);
              totalAvgPetDmg += reportRSDamage;

              // Add RS Damage to current point if time happens to be the same
              var plotDmg = reportRSDamage + avgDmg;
              var dmgPoint = {id: workingTime, x: workingTime, y: plotDmg, content: plotDmg, yOffset: 0};
              dmgPoint.label = {content: plotDmg, yOffset: 15};
              spellDmgTimeline.push(dmgPoint);
              reportRSDamage = 0;
              detSpellCount++;
            }

            // Handle post-cast adjustments
            switch(current.id) {
              case 'RS':
                // For Mage mode
                if (dom.getConjurersSynergyValue() > 0) {
                  var keys = utils.getCounterKeys('MSYN');
                  state[keys.expireTime] = state.workingTime + SYNERGY_TIMER + 3000;
                  state[keys.counter] = dom.getConjurersSynergyValue();
                }

                // Check if remorseless servants have expired
                utils.checkTimerList(state, workingTime, 'rsCount', 'rsTimers');

                state.rsCount++;
                stats.updateSpellStatistics(state, 'rsCount', state.rsCount);
                stats.updateSpellStatistics(state, 'rsDPS', getRSDamage(state));

                state.rsTimers.push(
                  utils.createTimer(workingTime + remorselessTTL, function(value) { return value - 1; })
                );
                break;
              case 'FA':
                if (allianceTimer > 0) {
                  state.fboundAllianceTimer = state.workingTime + allianceTimer;
                }
                break;
            }

            chartIndex++;
            gcdWaitTime = workingTime + Math.round(gcd + gcd * FIZZLE_RATE);

            // since we did found a spell that could be cast at current time
            // break and try again at the updated workingTime
            break;
          }
        }
      }

      // If RS Damage hasn't been reported yet
      if (reportRSDamage > 0) {
        // Add RS Damage to current point if time happens to be the same
        totalAvgPetDmg += reportRSDamage;

        var dmgPoint = {id: workingTime, x: workingTime, y: reportRSDamage, content: reportRSDamage, yOffset: 0};
        if (workingTime % 10000 == 0) {
          dmgPoint.label = {content: reportRSDamage, yOffset: 15};
        }
        spellDmgTimeline.push(dmgPoint);
        reportRSDamage = 0;
      }

      // all spells were on lockout so increment time
      if (gcdWaitTime >= workingTime || sp >= (spells.length-1)) {
        // do nothing for a bit
        workingTime += 50;

        // dont cast abilities between lockout too fast
        if (!lastAddCastTime || (workingTime - lastAddCastTime) >= 1000) {
          // try to cast force nuke early to prevent conflicts later on
          // Ex FD can update crit dmg in the chart itself
          // Use a time during this free bit
          additionalCast = (usingAANukes && !additionalCast) ?
            castForceNuke(state, forceNukes, workingTime, chartIndex) : additionalCast;
          // try firebound orb
          additionalCast = (!additionalCast && usingFireboundOrb) ?
            castFirebound(state, workingTime, chartIndex) : additionalCast;

          // handle additional cast damage
          if (additionalCast) {
             totalAvgDmg += additionalCast.dmg;
             maxHit = (additionalCast.dmg > maxHit) ? additionalCast.dmg : maxHit;
             utils.updateSpellCounts(spellCountMap, additionalCast.nuke.spell.id);

             totalCritRate += stats.getSpellStatisticsForIndex(chartIndex).critRate;
             spellTimeline.push(additionalCast.spellTime);
             spellDmgTimeline.push(additionalCast.dmgTime);
             state.lastCastMap[additionalCast.nuke.spell.timer] = additionalCast.nuke.time;
             chartIndex++;

             additionalCast = null;
             detSpellCount++;
             workingTime += 50;
             lastAddCastTime = workingTime;
          }
        }
      }
    }

    // update charts
    $(state.updatedCritRValues).each(function(rI, rV) {
      updateCritGraphValue(CRITR_DATA, rV.time, rV.y);
    });
    $(state.updatedCritDValues).each(function(rI, rV) {
      updateCritGraphValue(CRITD_DATA, rV.time, rV.y);
    });

    // Update timelines
    SPELLLINE_DATA.add(spellTimeline);
    DMG_DATA.add(spellDmgTimeline);

    // connect up popover
    self.connectPopovers();

    // print spellStats window
    stats.printStats($('#spellCountStats'), totalAvgDmg, totalAvgPetDmg, timeRange, totalCritRate, maxHit, detSpellCount, spellCountMap);
  },
  updateWindow: function(caller, update, windowList){
    // remove/reconnect any popover when changing window view
    self.removePopovers();
    self.connectPopovers();

    // sync up defaults to current view
    for (w in windowList) {
      var chart = windowList[w];
      if (chart && (caller != chart)) {
        var w = chart.getWindow();
        if (w.start != update.start || w.end != update.end) {
          chart.setWindow(update.start, update.end, {animation: false})
        }
      }
    }
  },
  visTimelineListener: function(e, item) {
    var opt = utils.readAdpsOption(item.items[0]);
    if (opt) {
      if (e == 'remove') {
        $('#spellButtons div.adps li > a[data-value=' + item.items[0] + ']')
          .parent().removeClass('disabled');
        $('#spellButtons div.remove-adps li > a[data-value=' + item.items[0] + ']')
          .parent().addClass('disabled');
      } else if (e == 'update') {
        var lineItem = TIMELINE_DATA.get(item.items[0]);
        var time = new Date(lineItem.end - lineItem.start);
        self.setTitle(TIMELINE_DATA, opt, time);
      }

      // don't really have to reload rate data for every type
      switch(item.items[0]) {
        case 'TC': case 'ITC': case 'FURYDRUZ': case 'FURYRO': case 'FURYECI':
        case 'FURYKERA': case 'AF': case 'FR': case 'FD': case 'AD':
        break;
        default:
        setTimeout(self.loadRates, 5);
        break;
      }

      if (e != 'update' || item.oldData[0].start != item.data[0].start || item.oldData[0].end != item.data[0].end) {
        self.callUpdateSpellChart();
      }
    }
  },
  withinTimeFrame: function(time, data) {
    return (data && (data.start <= time && data.end >= time));
  }
};