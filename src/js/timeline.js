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

const REPEATED_ABILITIES = [
  { id: 'ESYN', enabled: dom.isUsingEncSynergy, rate: dom.getEncSynergyRate, timer: dmgU.SYNERGY_TIMER, count: 1 },
  { id: 'EHAZY', enabled: dom.isUsingEncHazy, rate: dom.getEncHazyRate, timer: dmgU.ENC_HAZY_TIMER, count: 1 },
  { id: 'MSYN', enabled: dom.isUsingMagSynergy, rate: dom.getMagSynergyRate, timer: dmgU.SYNERGY_TIMER, count: 1 },
  { id: 'NSYN', enabled: dom.isUsingNecSynergy, rate: dom.getNecSynergyRate, timer: dmgU.SYNERGY_TIMER, count: 1 },
  { id: 'WSYN', enabled: dom.isUsingWizSynergy, rate: dom.getWizSynergyRate, timer: dmgU.SYNERGY_TIMER, count: 1 },
  { id: 'MR', enabled: dom.isUsingMR, rate: () => dmgU.MR_TIMER, timer: dmgU.MR_TIMER * 10, count: dmgU.MR_COUNTERS },
  { id: 'FW', enabled: dom.isUsingFW, rate: () => dmgU.FW_TIMER, timer: dmgU.FW_TIMER * 10, count: dmgU.FW_COUNTERS }
];

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

function castFirebound(state, time, chartIndex) {
  let result = null;

  if (G.MODE === 'mage' && state.fbOrbCounter > 0) {
    result = castForceNuke(state, ['BJ'], time, chartIndex);
    if (result != null) {
      state.fbOrbCounter--;
    }
  }

  return result;
}

function castForceNuke(state, forceNukes, time, chartIndex) {
  let aaNuke = isSpellReady(forceNukes, time, state.lastCastMap);

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
    let aaNukeDmg = damage.computeDamage(state);

    // update spell timeline
    let content = SPELL_ITEM_TEMPLATE({title: aaNuke.spell.name, id: aaNuke.spell.id.substring(0,2), spellNumber: chartIndex})
    let spellTime = {id: chartIndex, content: content, start: aaNuke.time, editable: false};
    let dmgTime = {id: aaNuke.time, x: aaNuke.time, y: aaNukeDmg};
    dmgTime.label = {content: aaNukeDmg, yOffset: 15};

    return { nuke: aaNuke, spellTime: spellTime, dmgTime: dmgTime, dmg: aaNukeDmg };
  }

  return null;
}

function isSpellReady(ids, time, lastCastMap) {
  let result;
  
  ids.forEach(id => {
    let spell = utils.getSpellData(id);
    let refresh = spell.discRefresh * 1000;

    if (!lastCastMap[spell.timer] || (lastCastMap[spell.timer] + refresh) < time) {
      result = { spell: spell, time: time };
    }
  });
  
  return result;
}

function getRSDamage(state) {
  return dom.getRemorselessServantDPSValue() * state.rsCount;
}

function handleRepeatedProc(state, hasProc, lastProcMap, key, workingTime, offset, timer, refreshCount) {
  let keys = utils.getCounterKeys(key);

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

export function getCritDataAtTime(time) {
  let result;

  if (CRITR_DATA.get(time)) {
    result = {
      critRate: CRITR_DATA.get(time).y / 100,
      critDmgMult: CRITD_DATA.get(time).y / 100
    };
  }

  return result;
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

export function initCounterBasedADPS(state, adpsKey) {
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
}

export function loadRates() {
  BASE_CRIT_DATA = [];
  let baseRate = damage.calcBaseCritRate();
  let baseDmg = damage.calcBaseCritDmg();
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

export function postCounterBasedADPS(state, adpsKey) {
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

  let spellTimeline = [];
  let spellDmgTimeline = [];
  let spells = dom.getSelectedSpells();
  let timeRange = dom.getSpellTimeRangeValue() * 1000;
  let totalAvgDmg = 0;
  let totalAvgPetDmg = 0;
  let chartIndex = 0;
  let maxHit = 0;
  let additionalCast = null;

  let gcd = dom.getGCDValue() * 1000;
  let hasTwincast = TIMELINE_DATA.get('TC');
  let hasForcedRejuv = TIMELINE_DATA.get('FR');
  let hasManaburn = TIMELINE_DATA.get('MBRN');

  let workingTime = CURRENT_TIME;
  let end = CURRENT_TIME + timeRange;
  let sp = 0;
  let fullSpellsCast = [];
  let twincastHasBeenCast = false;
  let usingAANukes = dom.isUsingAAForceNukes();
  let forceNukes = dom.getForceNukes();
  let lastProcMap = {};
  let usingFireboundOrb = dom.isUsingFireboundOrb();
  let remorselessTTL = dom.getRemorselessServantTTLValue() * 1000;
  let gcdWaitTime = 0;
  let reportRSDamage = 0;
  let lastAddCastTime = 0;
  let allianceTimer = dom.getAllianceFulminationValue() * 1000;

  let state = {
    hasStatistics: true,
    twincastChance: 0,
    updatedCritRValues: [],
    updatedCritDValues: [],
    lastCastMap: {},
    spells: spells,
    fbOrbCounter: dmgU.FIREBOUND_ORB_COUNT,
    rsCount: 0,
    rsTimers: []
  };

  while (workingTime < end) {
    // temp fix for twincast to work with Blazing Jet when no spells selected
    if (hasTwincast) {
      let tcTime = getTime(hasTwincast);
      if (workingTime >= tcTime.start && workingTime <= tcTime.end) {
        state.twincastChance = 1.0;
      }
    }

    // Check if remorseless servants have expired
    utils.checkTimerList(state, workingTime, 'rsCount', 'rsTimers');

    // Report damage every second
    if (state.rsCount > 0 && workingTime % 1000 === 0) {
      reportRSDamage = getRSDamage(state);
    }

    // Don't do anything if we're duing the GCD phase
    if (gcdWaitTime < workingTime) {
      // Recent spell last cast times on a Forced Rejuvination
      if (hasForcedRejuv) {
        let rejuvTime = getTime(hasForcedRejuv);
        if (withinTimeFrame(workingTime, rejuvTime)) {
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
        } else if (state.fboundAllianceTimer && state.fboundAllianceTimer <= workingTime) {
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
        let timeDifference = workingTime - ((state.lastCastMap[current.timer] ? state.lastCastMap[current.timer] : 0) + (current.recastTime * 1000 + recastMod));
        let lockoutTime = current.lockoutTime ? (((current.lockoutTime * 1000) > gcd) ? (current.lockoutTime * 1000) : gcd) : 0;
        state.twincastChance = 0;

        // check if twincast needs to be cast soon
        let waitForTc = false;
        if (hasTwincast) {
          let tcTime = getTime(hasTwincast);
          let timeToCastTc = workingTime + lockoutTime;

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
                let diff = hasTwincast.end - hasTwincast.start;
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
          REPEATED_ABILITIES.forEach((item) => {
            handleRepeatedProc(state, item.enabled(), lastProcMap, item.id, workingTime, item.rate(), item.timer, item.count);
          });

          fullSpellsCast.push({ id: id, time: workingTime });

          // update spell timeline
          let content = SPELL_ITEM_TEMPLATE({title: current.name, id: id, spellNumber: chartIndex})
          spellTimeline.push({id: chartIndex, content: content, start: workingTime, editable: false});

          state.workingTime = workingTime;
          state.spell = current;
          stats.updateSpellStatistics(state, 'id', current.id);

          // only compute for spells that do damage
          let avgDmg = (current.target != 'self') ? damage.computeDamage(state) : 0;

          if (avgDmg > 0) {
            //if (current.id != 'RS') {
              totalAvgDmg += avgDmg;
              maxHit = (avgDmg > maxHit) ? avgDmg : maxHit;
            //}

            totalAvgPetDmg += reportRSDamage;

            // Add RS Damage to current point if time happens to be the same
            let plotDmg = reportRSDamage + avgDmg;
            let dmgPoint = {id: workingTime, x: workingTime, y: plotDmg, content: plotDmg, yOffset: 0};
            dmgPoint.label = {content: plotDmg, yOffset: 15};
            spellDmgTimeline.push(dmgPoint);
            reportRSDamage = 0;
          }

          // Handle post-cast adjustments
          switch(current.id) {
            case 'RS':
              // For Mage mode
              if (dom.getConjurersSynergyValue() > 0) {
                let keys = utils.getCounterKeys('MSYN');
                state[keys.expireTime] = state.workingTime + dmgU.SYNERGY_TIMER + 3000;
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
          gcdWaitTime = workingTime + Math.round(gcd + gcd * dmgU.FIZZLE_RATE);

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

      let dmgPoint = {id: workingTime, x: workingTime, y: reportRSDamage, content: reportRSDamage, yOffset: 0};
      if (workingTime % 10000 === 0) {
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
        // Abilities that can be enabled and repeat every so often like Enc Synergy
        $(REPEATED_ABILITIES).each(function(i, item) {
          handleRepeatedProc(state, item.enabled(), lastProcMap, item.id, workingTime, item.rate(), item.timer, item.count);
        });

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
           spellTimeline.push(additionalCast.spellTime);
           spellDmgTimeline.push(additionalCast.dmgTime);
           state.lastCastMap[additionalCast.nuke.spell.timer] = additionalCast.nuke.time;
           chartIndex++;

           additionalCast = null;
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
  connectPopovers();

  // print spellStats window
  stats.printStats($('#spellCountStats'), state, totalAvgDmg, totalAvgPetDmg, timeRange, maxHit);
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