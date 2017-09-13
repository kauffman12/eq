import {globals as G} from './settings.js';
import * as damage from './damage.js';
import * as dmgU from './damage.utils.js';
import * as dom  from './dom.js';
import * as stats from './stats.js';
import * as utils from './utils.js';

const SPELL_DETAILS_TEMPLATE = Handlebars.compile($('#spell-details-template').html());
const SPELL_ITEM_TEMPLATE = Handlebars.compile($('#spell-timeline-item-template').html());

const CURRENT_TIME = utils.getCurrentTime();
const CRITR_DATA = new vis.DataSet([]);
const CRITD_DATA = new vis.DataSet([]);
const DMG_DATA = new vis.DataSet([]);
const SPELLLINE_DATA = new vis.DataSet([]);
const TIMELINE_DATA = new vis.DataSet([]);

const GRAPH_CRITR = createGraph('graphcritr', CURRENT_TIME, dom.getDomForCritRGraph(), CRITR_DATA);
const GRAPH_CRITD = createGraph('graphcritd', CURRENT_TIME, dom.getDomForCritDGraph(), CRITD_DATA);
const GRAPH_DMG = createGraph('graphdmg', CURRENT_TIME, dom.getDomForDmgGraph(), DMG_DATA);
const SPELL_TIMELINE = createTimeline('spellline', CURRENT_TIME, dom.getDomForSpellline(), SPELLLINE_DATA);
const TIMELINE = createTimeline('timeline', CURRENT_TIME, dom.getDomForTimeline(), TIMELINE_DATA);

let BASE_CRIT_DATA = [];
let UPDATING_CHART = -1;

function createTimeline(id, time, dom, data, template) {
  let opts = utils.readChartOptions(id, time);

  if (template) {
    opts.template = template;
  }

  return new vis.Timeline(dom, data, opts);
}

function createGraph(id, time, dom, data) {
  let opts = utils.readChartOptions(id, time);
  return new vis.Graph2d(dom, data, opts);
}

function castFirebound(state) { 
  if (G.MODE === 'mage' && state.fbOrbCounter > 0) {
    let result = castForceNuke(state, ['BJ']);
    if (result) {
      state.fbOrbCounter--;
    }
    
    return result;
  }
}

function castForceNuke(state, forceNukes) {
  let aaNuke = isSpellReady(state, forceNukes);
  
  if (aaNuke) {
    castSpell(state, aaNuke);
    return true;
  }
}

function castSpell(state, spell) {  
  // update current state with spell
  state.chartIndex++;
  state.spell = spell;
  
  // abilities that can be enabled and repeat every so often like Enc Synergy
  // cancel or reset counters based on timer, only need to check once per workingTime
  dmgU.ACTIVATED_ABILITIES.forEach(item => initActivatedAbility(state, item)); 
  
  // check if RS pets have completed  
  let rsKeys = utils.getCounterKeys('RS');
  utils.checkTimerList(state, rsKeys.counter, rsKeys.timers);
  
  // initialize stats
  stats.updateSpellStatistics(state, 'chartIndex', state.chartIndex);
  stats.updateSpellStatistics(state, 'id', spell.id);

  // set time of last cast and update statistics for interval
  if (state.lastCastMap[spell.timer]) {
   stats.updateSpellStatistics(state, 'castInterval', (state.workingTime - state.lastCastMap[spell.timer]) / 1000);
  } 
  
  state.lastCastMap[spell.timer] = state.workingTime;

  // update spell timeline
  let spellId = (spell.id.length === 3 && isNaN(parseInt(spell.id[2]))) ? spell.id : spell.id.substr(0,2);
  let content = SPELL_ITEM_TEMPLATE({title: spell.name, id: spellId, spellNumber: state.chartIndex})
  SPELLLINE_DATA.add({id: state.chartIndex, content: content, start: state.workingTime, editable: false});

  // round to nearest second to check against current spell landing time
  state.timeEst = Math.round(state.workingTime / 1000) * 1000;

  // figure out current crit change/damage mod
  if (CRITR_DATA.get(state.timeEst)) {
    state.critRate = CRITR_DATA.get(state.timeEst).y / 100;
    state.critDmgMult = CRITD_DATA.get(state.timeEst).y / 100;
  } else {
    console.debug('out of range');
    return;
  }

  // only compute for spells that do damage
  let avgDmg = (spell.target != 'self') ? damage.calcTotalAvgDamage(state) : 0;

  // dmg including other dots or abilities that have been accumulating (just RS right now)
  let dotDmg = state.dotGenerator ? Math.trunc(state.dotGenerator.next().value) : 0;

  // update stats
  if (avgDmg > 0) {
    stats.addAggregateStatistics('totalAvgDmg', avgDmg);
    stats.addMaxAggregateStatistics('maxHit', avgDmg);
  }
  
  // update stats
  if (dotDmg > 0) { // pet damage is all we currently have
    stats.addAggregateStatistics('totalAvgPetDmg', dotDmg);
  }
  
  if (avgDmg > 0 || dotDmg > 0) {
    // update damage graph
    let dmgPoint = {id: state.workingTime, x: state.workingTime, y: avgDmg + dotDmg, yOffset: 0};
    dmgPoint.label = {content: avgDmg + dotDmg, yOffset: 15};
    DMG_DATA.add(dmgPoint);
  }
}

function isSpellReady(state, ids) {
  let spell;
  
  return ids.find(id => {
    spell = utils.getSpellData(id);
    let refresh = spell.discRefresh * 1000;
    return !state.lastCastMap[spell.timer] || ((state.lastCastMap[spell.timer] + refresh) < state.workingTime);
  }) ? spell : undefined;
}

function getRSDamage(state) {
  return dom.getRemorselessServantDPSValue() * state.rsCounter;
}

function initActivatedAbility(state, item) {
  let keys = utils.getCounterKeys(item.id);
  let lastProcMap = state.lastProcMap;

  if (item.enabled()) {
    if (!lastProcMap[item.id] || lastProcMap[item.id] + item.rate() < state.workingTime) {
      if (!lastProcMap[item.id]) {
        lastProcMap[item.id] = CURRENT_TIME;
        state[keys.expireTime] = CURRENT_TIME + item.timer;
      } else {
        lastProcMap[item.id] += item.rate();
        state[keys.expireTime] = state.workingTime + item.timer;
      }

      state[keys.counter] = item.count;
    }
  }

  utils.checkSimpleTimer(state, item.id);
}

function silentUpdateTimeline(data) {
  TIMELINE_DATA.off('update', visTimelineListener);
  TIMELINE_DATA.update(data);
  TIMELINE_DATA.on('update', visTimelineListener);
}

function updateCritGraphs() {
  CRITR_DATA.clear();
  CRITD_DATA.clear();

  let critRPoints = [];
  let critDPoints = [];
  let prevRate = 0;
  let prevDmg = 0;
  let lastRateLabel = 0;
  let lastDmgLabel = 0;

  $(BASE_CRIT_DATA).each(function(i, item) {
    let rp = {id: item.time, x: item.time, y: item.rate};
    let dp = {id: item.time, x: item.time, y: item.dmg};

    if (prevRate != item.rate || lastRateLabel % 10 === 0) {
      rp.label = {content: item.rate + '%', yOffset: 15};
      lastRateLabel = 0;
    }

    lastRateLabel++;
    prevRate = item.rate;

    if (prevDmg != item.dmg || lastDmgLabel % 10 === 0) {
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
}

function updateCritGraphValue(data, time, value) {
  let item = data.get(time);
  if (item.y != value) {
    if (item.label) {
      let l = item.label.content;
      item.label.content = value + l.substring(l.indexOf('%'), l.length);
    }

    item.y = value;
    data.update(item);
  }
}

function withinTimeFrame(time, data) {
  return (data && (data.start <= time && data.end >= time));
}

export function callUpdateSpellChart() {
  if (UPDATING_CHART === -1) {
    UPDATING_CHART = setTimeout(function() {
      updateSpellChart();
      UPDATING_CHART = -1;
    }, 350);
  } else {
    clearTimeout(UPDATING_CHART);
    UPDATING_CHART = -1;
    callUpdateSpellChart();
  }
}

export function connectPopovers() {
  let items = $('#spellline div.vis-center div.vis-itemset div.vis-foreground a[data-toggle="popover"]');
  items.popover({html: true});

  items.unbind('inserted.bs.popover');
  items.on('inserted.bs.popover', function(e) {
    let index = $(e.currentTarget).data('value');
    let statInfo = stats.getSpellStatistics(index);

    let popover = $('#spellPopover' + index);
    popover.html('');
    popover.append(SPELL_DETAILS_TEMPLATE({ data: stats.getStatisticsSummary(statInfo) }));
  });
}

export function createAdpsItem(adpsOption, repeat) {
  let adpsItem = {
    id: adpsOption.id,
    start: CURRENT_TIME,
    end: CURRENT_TIME + adpsOption.offset
  };

  let label = createLabel(adpsOption, new Date(adpsItem.end - adpsItem.start));
  adpsItem.content = label;
  adpsItem.title = label;
  adpsItem.group = utils.readAdpsConfig('displayList').indexOf(adpsOption.id);
  TIMELINE_DATA.add(adpsItem);
  return adpsItem;
}

export function createLabel(adpsOption, date) {
  let label;
  if (!adpsOption.instant) {
    label = adpsOption.content + ' (zzz)';

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
    label = adpsOption.content;
  }

  return label;
}

export function getAdpsDataIfActive(id, time, key) {
  let item = TIMELINE_DATA.get(id);

  if (item && withinTimeFrame(time, getTime(item))) {
    let adpsOption = utils.readAdpsOption(id);
    return (key === undefined) ? adpsOption : adpsOption[key];
  }

  return null;
}

export function getAdpsGroups() {
  let groups = new vis.DataSet();
  let displayList = utils.readAdpsConfig('displayList');

  $(displayList).each(function(i, item) {
    groups.add({id: i, content: utils.readAdpsOption(item)});
  });
}

export function getArcaneFuryValue(time) {
  if (G.MODE === 'wiz' && getAdpsDataIfActive('AF', time)) {
    return dmgU.ARCANE_FURY_FOCUS;
  }

  return 0;
}

export function getElementalUnionValue(time) {
  return ((G.MODE === 'mage') ? getAdpsDataIfActive('EU', time, 'afterCritMult') : 0) || 0;
}

export function getHeartOfFlamesValue(time) {
  return ((G.MODE === 'mage') ? getAdpsDataIfActive('HF', time, 'afterCritMult') : 0) || 0;
}

export function getTime(item) {
  let result = {};

  if (item) {
    let start = item.start.getTime ? item.start.getTime() : item.start;
    let end = item.end.getTime ? item.end.getTime() : item.end;
    result.start = start;
    result.end = end;
  }

  return result;
}

export function init() {
  // connect all the zoom/pan/range events together of the charts
  let chartList = [SPELL_TIMELINE, TIMELINE, GRAPH_CRITR, GRAPH_CRITD, GRAPH_DMG];
  $(chartList).each(function(index, chart) {
    chart.on('rangechanged', function(update) {
      updateWindow(chart, update, chartList);
    });
  });

  TIMELINE.setGroups(getAdpsGroups());
  TIMELINE_DATA.on('add', visTimelineListener);
  TIMELINE_DATA.on('update', visTimelineListener);
  TIMELINE_DATA.on('remove', visTimelineListener);
}

export function initCounterBasedADPS(state) {
  utils.getCounterBasedAdps().forEach(adpsKey => {
    let counter = utils.getCounterKeys(adpsKey).counter;
    let item = TIMELINE_DATA.get(adpsKey);

    if (item) {
      let time = getTime(item);
      let timeLimit = utils.readAdpsOption(adpsKey, 'offset');
      let maxTimeFrame = { start: time.start, end: time.start + timeLimit };

      if (withinTimeFrame(state.workingTime, maxTimeFrame)) {
        if (state[counter] === undefined) {
          state[counter] = utils.readAdpsOption(adpsKey, 'charges');
        }
      } else if (time.start + timeLimit < state.workingTime) {
        state[counter] = -1;
      }
    }
  });
}

export function loadRates() {
  BASE_CRIT_DATA = [];
  let baseRate = dmgU.getBaseCritRate();
  let baseDmg = dmgU.getBaseCritDmg();
  let seconds = dom.getSpellTimeRangeValue();
  let displayList = utils.readAdpsConfig('displayList');

  for(let i=0; i<=(seconds*1000); i+=1000) {
    let time = CURRENT_TIME + i;
    let rate = baseRate;
    let dmg = baseDmg;
    let rateStacking = {};
    let dmgStacking = {};
    let hasUsedMap = {};

    $(displayList).each(function(index, item) {
      let adpsItem = TIMELINE_DATA.get(item);
      if (withinTimeFrame(time, adpsItem)) {
        let adpsOption = utils.readAdpsOption(item);
        if (!adpsOption.chargeBased) {
          rate += utils.checkStacking(hasUsedMap, rateStacking, adpsOption, 'critRateMod');
          dmg += utils.checkStacking(hasUsedMap, dmgStacking, adpsOption, 'critDmgMod');
        }
      }
    });

    BASE_CRIT_DATA.push({time: time, rate: rate, dmg: dmg});
  }
}

export function postCounterBasedADPS(state) {
  utils.getCounterBasedAdps().forEach(adpsKey => {
    let counter = utils.getCounterKeys(adpsKey).counter;
    let item = TIMELINE_DATA.get(adpsKey);

    if (item) {
      let time = getTime(item);
      let adpsOption = utils.readAdpsOption(adpsKey);
      if (state[counter] === 0) {
        // this is the last one
        item.end = state.workingTime;
        item.content = createLabel(adpsOption, new Date(state.workingTime - time.start));
        item.title = item.content;
        silentUpdateTimeline(item);
        state[counter] = -1;
      } else if (state[counter] > 0) {
        let timeLimit = adpsOption.offset;
        if ( (time.end - time.start) != timeLimit ) {
          item.end = time.start + timeLimit;
          item.content = createLabel(adpsOption, new Date(timeLimit));
          item.title = item.content;
          silentUpdateTimeline(item);
        }
      }
    }
  });
}

export function removeAdpsItemById(id) {
  TIMELINE_DATA.remove(id);
}

export function removePopovers() {
  $('.popover').remove();
}

export function setTitle(data, adpsOption, date) {
  let label = createLabel(adpsOption, date);
  let lineItem = data.get(adpsOption.id);
  if (lineItem.content != label) {
    lineItem.content = label;
    lineItem.title = label;
    data.update(lineItem);
  }
}

export function updateSpellChart() {
  utils.clearCache();
  SPELLLINE_DATA.clear();
  DMG_DATA.clear();
  stats.clear();
  updateCritGraphs();
  removePopovers();

  let spellDmgTimeline = [];
  let spells = dom.getSelectedSpells();
  let timeRange = dom.getSpellTimeRangeValue() * 1000;
  let additionalCast;

  let gcd = dom.getGCDValue() * 1000;
  let hasTwincast = TIMELINE_DATA.get('TC');
  let hasForcedRejuv = TIMELINE_DATA.get('FR');

  let end = CURRENT_TIME + timeRange;
  let sp = 0;
  let twincastHasBeenCast = false;
  let usingAANukes = dom.isUsingAAForceNukes();
  let forceNukes = dom.getForceNukes();
  let usingFireboundOrb = dom.isUsingFireboundOrb();
  let gcdWaitTime = 0;
  let reportRSDamage = 0;
  let lastAddCastTime = 0;
  let allianceTimer = dom.getAllianceFulminationValue() * 1000;

  let state = {
    chartIndex: -1,
    twincastChance: 0,
    updatedCritRValues: [],
    updatedCritDValues: [],
    lastCastMap: {},
    lastProcMap: {},
    spells: spells,
    fbOrbCounter: dmgU.FIREBOUND_ORB_COUNT,
    workingTime:  CURRENT_TIME
  };
   
  while (state.workingTime < end) {
    // temp fix for twincast to work with Blazing Jet when no spells selected
    if (hasTwincast) {
      let tcTime = getTime(hasTwincast);
      if (state.workingTime >= tcTime.start && state.workingTime <= tcTime.end) {
        state.twincastChance = 1.0;
      }
    }
 
    // Don't do anything if we're duing the GCD phase
    if (gcdWaitTime < state.workingTime) {
      // Recent spell last cast times on a Forced Rejuvination
      if (hasForcedRejuv) {
        let rejuvTime = getTime(hasForcedRejuv);
        if (withinTimeFrame(state.workingTime, rejuvTime)) {
          hasForcedRejuv = false;
          $(spells).each(function(i, id) {
            delete state.lastCastMap[utils.getSpellData(id).timer]
          });
        }
      }

      for (sp = 0; sp < spells.length; sp++) {
        let id = spells[sp];
        let current = utils.getSpellData(id);
        let recastMod = 0;

        // Override current spell if we need to cast more orbs
        if (state.fbOrbCounter <= 0) {
          id = 'SFB';
          current = utils.getSpellData('SFB');
          state.fbOrbCounter = dmgU.FIREBOUND_ORB_COUNT;
        } else if (state.fboundAllianceTimer && state.fboundAllianceTimer <= state.workingTime) {
          id = 'FAF';
          current = utils.getSpellData('FAF');
          state.fboundAllianceTimer = 0;
        }

        // Handle pre-cast adjustments
        switch(current.id) {
          case 'RS':
            recastMod = (dom.getHastenedServantValue() + dom.getType3AugValue(current)) * -1000;
            break;
        }

        let neededTime = current.castTime * 1000;
        let timeDifference = state.workingTime - ((state.lastCastMap[current.timer] ? state.lastCastMap[current.timer] : 0) + (current.recastTime * 1000 + recastMod));
        let lockoutTime = current.lockoutTime ? (((current.lockoutTime * 1000) > gcd) ? (current.lockoutTime * 1000) : gcd) : 0;
        state.twincastChance = 0;

        // check if twincast needs to be cast soon
        let waitForTc = false;
        if (hasTwincast) {
          let tcTime = getTime(hasTwincast);
          let timeToCastTc = state.workingTime + lockoutTime;

          // if we're about to cast a spell but it won't land until after Twincast is supposed to be
          // cast then do nothing and wait for the cast of Twincast
          if (timeDifference >= 0 && timeToCastTc >= tcTime.start && state.workingTime < tcTime.end && !twincastHasBeenCast) {
            waitForTc = true;
          }

          // Cast Twincast once we go the point where end of lockout time basically coincides
          // with where the timeline has Twincast starting
          if (((state.workingTime + gcd) >= tcTime.start) && (state.workingTime < tcTime.end) && state.twincastChance < 1.0) {
            // cast twincast only once (ie increment time)
            if (!twincastHasBeenCast) {
              id = 'TC';
              current = utils.getSpellData('TC');
              timeDifference = 0;
              neededTime = 0;

              // Fix start point on timeline if its out of bounds
              if (hasTwincast.start != state.workingTime) {
                let diff = hasTwincast.end - hasTwincast.start;
                hasTwincast.start = state.workingTime;
                hasTwincast.end = hasTwincast.start + diff;
                silentUpdateTimeline(hasTwincast);
              }
            }

            state.twincastChance = 1.0;
            waitForTc = false;
            twincastHasBeenCast = true;
          }

          // End twincast once we're out of the time range
          if (state.workingTime + neededTime > tcTime.end && state.twincastChance > 0) {
            state.twincastChance = 0;
          }
        }

        if (!waitForTc && timeDifference >= 0) {
          state.workingTime += neededTime;
          if (state.workingTime >= end) break; // Time EXCEEDED

          castSpell(state, current);

          // Handle post-cast adjustments
          switch(current.id) {
            case 'RS':
              stats.updateSpellStatistics(state, 'rsDPS', getRSDamage(state));
              break;
            case 'FA':
              if (allianceTimer > 0) {
                state.fboundAllianceTimer = state.workingTime + allianceTimer;
              }
              break;
          }

          gcdWaitTime = state.workingTime + Math.round(gcd + gcd * dmgU.FIZZLE_RATE);

          // since we did found a spell that could be cast at current time
          // break and try again at the updated workingTime
          break;
        }
      }
    }

    // all spells were on lockout so increment time
    if (gcdWaitTime >= state.workingTime || sp >= (spells.length-1)) {
      // do nothing for a bit
      state.workingTime += 50;

      // dont cast abilities between lockout too fast
      if (!lastAddCastTime || (state.workingTime - lastAddCastTime) >= 1000) {
        // try to cast force nuke early to prevent conflicts later on
        // Ex FD can update crit dmg in the chart itself
        // Use a time during this free bit
        additionalCast = (usingAANukes && !additionalCast) ?
          castForceNuke(state, forceNukes) : additionalCast;
        // try firebound orb
        additionalCast = (!additionalCast && usingFireboundOrb) ?
          castFirebound(state) : additionalCast;

        // handle additional cast damage
        if (additionalCast) {
           additionalCast = undefined;
           state.workingTime += 50;
           lastAddCastTime = state.workingTime;
        } else {
          // If RS Damage hasn't been reported yet
          if (state.workingTime % 500 === 0) {
            // check if RS pets have completed  
            let rsKeys = utils.getCounterKeys('RS');
            utils.checkTimerList(state, rsKeys.counter, rsKeys.timers);
            
            let dotDmg = state.dotGenerator ? state.dotGenerator.next().value : 0;
            if (dotDmg > 0) {
              stats.addAggregateStatistics('totalAvgPetDmg', dotDmg);

              let dmgPoint = {id: state.workingTime, x: state.workingTime, y: dotDmg, yOffset: 0};
              if (state.workingTime % 10000 === 0) {
                dmgPoint.label = {content: dotDmg, yOffset: 15};
              }
              
              DMG_DATA.add(dmgPoint);
            }
          }    
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

  // connect up popover
  connectPopovers();

  // print spellStats window
  stats.printStats($('#spellCountStats'), state, timeRange);
}

export function updateWindow(caller, update, windowList){
  // remove/reconnect any popover when changing window view
  removePopovers();
  connectPopovers();

  // sync up defaults to current view
  for (let w in windowList) {
    let chart = windowList[w];
    if (chart && (caller != chart)) {
      let w = chart.getWindow();
      if (w.start != update.start || w.end != update.end) {
        chart.setWindow(update.start, update.end, {animation: false})
      }
    }
  }
}

export function visTimelineListener(e, item) {
  let opt = utils.readAdpsOption(item.items[0]);
  if (opt) {
    if (e === 'remove') {
      $('#spellButtons div.adps li > a[data-value=' + item.items[0] + ']')
        .parent().removeClass('disabled');
      $('#spellButtons div.remove-adps li > a[data-value=' + item.items[0] + ']')
        .parent().addClass('disabled');
    } else if (e === 'update') {
      let lineItem = TIMELINE_DATA.get(item.items[0]);
      let time = new Date(lineItem.end - lineItem.start);
      setTitle(TIMELINE_DATA, opt, time);
    }

    // don't really have to reload rate data for every type
    switch(item.items[0]) {
      case 'TC': case 'ITC': case 'FURYDRUZ': case 'FURYRO': case 'FURYECI':
      case 'FURYKERA': case 'AF': case 'FR': case 'FD': case 'AD':
        break;
      default:
        setTimeout(loadRates, 5);
        break;
    }

    if (e != 'update' || item.oldData[0].start != item.data[0].start || item.oldData[0].end != item.data[0].end) {
      callUpdateSpellChart();
    }
  }
}