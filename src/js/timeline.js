import {globals as G} from './settings.js';
import * as abilities from './abilities.js';
import * as damage from './damage.js';
import * as dmgU from './damage.utils.js';
import * as dom  from './dom.js';
import * as stats from './stats.js';
import * as utils from './utils.js';

// html templates for spell icon popup and the icon themselves on the spell timeline
const SPELL_DETAILS_TEMPLATE = Handlebars.compile($('#spell-details-template').html());
const SPELL_ITEM_TEMPLATE = Handlebars.compile($('#spell-timeline-item-template').html());

// timelines start at the time the browser loads and then the date/time info is removed
const CURRENT_TIME = utils.getCurrentTime();

// create the graphs and data set objects
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

let BASE_CRIT_DATA = []; // crit info so it doesn't have to be re-calculated all the time
let UPDATING_CHART = -1; // used to throttle calls to update the chart data
let TIME_INCREMENT = 50;

// helper for creating a timeline
function createTimeline(id, time, dom, data, template) {
  let opts = utils.readChartOptions(id, time);
  if (template) opts.template = template;
  return new vis.Timeline(dom, data, opts);
}

// helper for creating a graph
function createGraph(id, time, dom, data) {
  let opts = utils.readChartOptions(id, time);
  return new vis.Graph2d(dom, data, opts);
}

function castSpell(state, spell, adjCastTime) {
  // update current state with spell
  state.chartIndex++;
  state.spell = spell;

  adjCastTime = adjCastTime || utils.getCastTime(state, spell);
  let neededTime = state.workingTime + adjCastTime;
  if (neededTime > state.endTime) return false; // Time EXCEEDED

  // if twincast spell is no longer active
  utils.isAbilityActive(state, 'TC');

  // abilities that can be enabled and repeat every so often like Enc Synergy
  // cancel or reset counters based on timer, only need to check once per workingTime
  updateActiveAbilities(state, false, neededTime)

  // advance dot damage until we hit end of cast time
  for (state.workingTime; state.workingTime<=neededTime; state.workingTime+= TIME_INCREMENT) {
    getDoTDamage(state);
  }

  // initialize stats
  stats.updateSpellStatistics(state, 'chartIndex', state.chartIndex);
  stats.updateSpellStatistics(state, 'adjCastTime', adjCastTime);
  stats.updateSpellStatistics(state, 'id', spell.id);

  // set time of last cast and update statistics for interval
  if (state.lastCastMap[spell.timer]) {
   stats.updateSpellStatistics(state, 'castInterval', (state.workingTime - state.lastCastMap[spell.timer]) / 1000);
  }

  state.lastCastMap[spell.timer] = state.workingTime;
  state.spellTimerMap[spell.timer] = state.workingTime;

  // update spell timeline
  let spellId = (spell.id.length > 2 && isNaN(parseInt(spell.id[2]))) ? spell.id : spell.id.substr(0,2);
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
  let avgDmg = damage.execute(state);

  let plotDmg = 0;
  // update stats
  if (avgDmg > 0) {
    stats.addAggregateStatistics('totalAvgTcRate', stats.getSpellStatistics(state, 'twincastRate') || 0);
    stats.addAggregateStatistics('totalAvgDmg', avgDmg);
    stats.addAggregateStatistics('detCastCount', 1);
    stats.addMaxAggregateStatistics('maxHit', avgDmg);
    plotDmg += avgDmg;
  }

  // upgrade graph
  updateDmgGraph(state, plotDmg);
  return true;
}

function getDoTDamage(state, end) {
  if (state.dotGenerator) {
    let dmg = state.dotGenerator.next(!!end).value;

    if (dmg > 0) {
      updateDmgGraph(state, dmg);
    }
  }
}

function initAbility(state, id, ability, neededTime) {
  let active = false;

  if (ability.charges) {
    let keys = utils.getCounterKeys(id);

    if (ability.manuallyActivated) {
      // init manual ability (should move this at some point)
      if (state[keys.counter] === undefined) {
        state[keys.counter] = ability.charges;
      }

      active = utils.isAbilityActive(state, id);
    }
 
    // abilties that get repeated periodically
    else if (ability.repeatEvery && !ability.manuallyActivated) {
      let lastProcMap = state.lastProcMap;
      // get rate from UI if there is an override or use default refresh time
      let rate = dom.getAbilityRate(id) || ability.refreshTime;

      if (rate) {
        if (!lastProcMap[id] || lastProcMap[id] + rate < state.workingTime) {
          if (!lastProcMap[id]) {
            lastProcMap[id] = CURRENT_TIME;
            state[keys.expireTime] = CURRENT_TIME + ability.duration;
          } else {
            lastProcMap[id] += rate;
            state[keys.expireTime] = lastProcMap[id] + ability.duration;
          }

          state[keys.counter] = ability.charges;
        }

        active = utils.isAbilityActive(state, id);
      } else {
        active = false; // Ex like Arcomancy
      }
    } 

    // abilities that only get used once
    else if (!ability.repeatEvery) {
      let item = TIMELINE_DATA.get(id);
      let time = getTime(item);
      let startTime = (neededTime || state.workingTime);

      if (withinTimeFrame(startTime, getTime(item))) {
        active = true;

        // initialize for first use
        if (state[keys.counter] === undefined) {
          state[keys.counter] = dom.getAbilityCharges(id) || ability.charges;
        } else {
          if (state[keys.counter] === 0) {
            // this is the last one
            item.end = state.workingTime;
            item.content = utils.createLabel(ability, new Date(state.workingTime - time.start));
            item.title = item.content;
            silentUpdateTimeline(item);
            state[keys.counter] = -1;
            active = false;
          } else if (state[keys.counter] > 0) {
            if ( (time.end - time.start) != ability.duration) {
              item.end = time.start + ability.duration;
              item.content = utils.createLabel(ability, new Date(ability.duration));
              item.title = item.content;
              silentUpdateTimeline(item);
            }
          }
        }
      }
    }
  } else {
    let item = TIMELINE_DATA.get(id);

    if (item) {
      let time = getTime(item);
      let startTime = (neededTime || state.workingTime);

      active = withinTimeFrame(startTime, getTime(item));
    } else {
      active = (ability.repeatEvery >= -1);
    }
  }

  return active;
}

// Get list of active abilities by ID
function updateActiveAbilities(state, duringGCD, neededTime) {
  let preConfigured = dom.getConfiguredAbilities();
  state.activeAbilities = new Set(preConfigured.active);
  state.spellProcAbilities = new Set(preConfigured.spellProc);
  state.manualAbilities = new Set();
  state.enabledButInActive = new Set();

  // get abilities the user has enabled to repeat from the
  // activated abilities options
  dom.getActiveRepeatingAbilities().forEach(id => {
    let ability = abilities.get(id);
 
    // dont process everything during GCD time
    if (!duringGCD || ability.manuallyActivated) {
      if (initAbility(state, id, ability)) {
        if (ability.manuallyActivated) {
          state.manualAbilities.add(id);
        } else {
          if (!abilities.getProcEffectForAbility(ability)) {
            state.activeAbilities.add(id);
          } else {
            state.spellProcAbilities.add(id);
          }
        }
      } else {
        state.enabledButInActive.add(id);
      }
    }
  });
 
  // add any on the timeline
  TIMELINE_DATA.forEach(item => {
    let ability = abilities.get(item.id);

    // make sure ability is active if it has charges
    if (initAbility(state, item.id, ability, neededTime)) {
      // all of these included here
      state.activeAbilities.add(item.id);

      // some of these also proc spells
      if (abilities.getProcEffectForAbility(ability)) {
        state.spellProcAbilities.add(item.id);
      }
    }
  });

  // not casting spells
  if (!duringGCD) {
    // add spell procs that may result from spells being cast
    dmgU.SPELL_PROC_ABILITIES.filter(id => utils.isAbilityActive(state, id))
      .forEach(id => addSpellProcAbility(state, id));
  }

  // Misc checks, check if RS pets have completed
  let rsKeys = utils.getCounterKeys('RS');
  utils.checkTimerList(state, rsKeys.counter, rsKeys.timers);
}

// RS has type 3 aug and AAs that reduce the recast so account for that here
function getModifiedSpellRecastTime(spell) {
  return utils.useCache('spell-recast-time' + spell.id, () => {
    let recastMod = (spell.id === 'RS') ? (dom.getHastenedServantValue() + dom.getType3AugValue(spell)) * -1 : 0;
    return (spell.recastTime + recastMod);
  });
}

// Returns the first ability from list that has able to be cast based on recast timers
function executeManualAbilities(state) {
  let idSet = state.manualAbilities;

  if (idSet && idSet.size > 0) {
    let spell;
    let ability;
    let abilityId;

    let ready = [...idSet].find(id => {
      ability = abilities.get(id);
      abilityId = id;

      let effect = abilities.getProcEffectForAbility(ability);
      spell = utils.getSpellData(effect.proc);
      return (state.workingTime + spell.castTime < state.gcdWaitTime) &&
        (!state.spellTimerMap[ability.timer] || ((state.spellTimerMap[ability.timer] + ability.refreshTime) < state.workingTime));
    });

    if (ready) {
      castSpell(state, spell);
      state.spellTimerMap[ability.timer] = state.workingTime;

     if (ability.charges) {
       let keys = utils.getCounterKeys(abilityId);
       state[keys.counter]--;

       if (state[keys.counter] <= 0 && ability.refreshTrigger) {
         state.castQueue.push(ability.refreshTrigger);
       }
     }
    }
  }
}

// Adjust start time of a timeline item
function setTimelineItemStart(time, item, offset) {
  let newStartTime = time + offset;
  let newEndTime = newStartTime + (item.end - item.start);
  
  if (item.start != newStartTime) {
    item.start = newStartTime;
    item.end = newEndTime;
    silentUpdateTimeline(item);
  }
}

// Turn off events when updating the timeline programmatically
function silentUpdateTimeline(data) {
  TIMELINE_DATA.off('update', visTimelineListener);
  TIMELINE_DATA.update(data);
  TIMELINE_DATA.on('update', visTimelineListener);
}

// The start and end time of a vis.js timeline object is inconsistent depending
// on whether it's set somewhere hear or via drag/move events. This just gives
// back one representation using time in millis
function getTime(item) {
  let result = {};

  if (item) {
    let start = item.start.getTime ? item.start.getTime() : item.start;
    let end = item.end.getTime ? item.end.getTime() : item.end;
    result.start = start;
    result.end = end;
  }

  return result;
}

// Clears and redraws the crit graphs from the starting dataset
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

function updateDmgGraph(state, dmg) {
  if (dmg >= 0) {

    // in case were plotting multiple damage at some point
    let pointData = DMG_DATA.get(state.workingTime);
    if (pointData) {
      pointData.y += dmg;

      // update label if it exists
      if (pointData.label) {
        pointData.label.content = pointData.y;
      }

      DMG_DATA.update(pointData);
    } else {
      pointData = {id: state.workingTime, x: state.workingTime, y: dmg, yOffset: 0};
      pointData.label = {content: pointData.y, yOffset: 15};
      DMG_DATA.add(pointData);
    }
  }
}

function willCastDuring(state, time, spell, adjCastTime) {
  let lockout = false;
  let lockoutTime = spell.lockoutTime ? ((spell.lockoutTime > state.gcd) ? (spell.lockoutTime) : state.gcd) : 0;
  lockoutTime += adjCastTime; // total time the spell will be busy
  let timeToCast = state.workingTime + lockoutTime;

  return (timeToCast >= time.start && state.workingTime < time.end);
}

function withinTimeFrame(time, data) {
  return (data && (data.start <= time && data.end >= time));
}

export function addSpellProcAbility(state, id, mod, initialize) {
  mod = (mod === undefined) ? 1 : mod;

  let ability = abilities.get(id);
  if (!ability) return;

  // init ability in addition to checking if active
  if (initialize) {
    let keys = utils.getCounterKeys(id);
    if (ability.charges) {
      // mod initially added for conjurer's synergy proc rate
      let charges = dom.getAbilityCharges(id);
      if (charges == undefined) {
        charges = ability.charges;
      }

      state[keys.counter] = mod * charges;
    }

    if (ability.duration) {
      state[keys.expireTime] = state.workingTime + ability.duration;
    }
  }

  if (utils.isAbilityActive(state, id)) {
    if (!abilities.getProcEffectForAbility(ability)) {
      state.activeAbilities.add(id);
    } else {
      state.spellProcAbilities.add(id);
    }
  }
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
    let statInfo = stats.getSpellStatisticsForIndex(index);
    let popover = $('#spellPopover' + index);
    popover.html('');
    popover.append(SPELL_DETAILS_TEMPLATE({ data: stats.getStatisticsSummary(statInfo) }));
  });
}

export function createAdpsItem(id) {
  let ability = abilities.get(id);
  let adpsItem = { id: id, start: CURRENT_TIME, end: CURRENT_TIME + ability.duration };
  let label = utils.createLabel(ability, new Date(adpsItem.end - adpsItem.start));

  adpsItem.content = label;
  adpsItem.title = label;
  TIMELINE_DATA.add(adpsItem);

  return adpsItem;
}

export function init() {
  // connect all the zoom/pan/range events together of the charts
  let chartList = [SPELL_TIMELINE, TIMELINE, GRAPH_CRITR, GRAPH_CRITD, GRAPH_DMG];
  $(chartList).each(function(index, chart) {
    chart.on('rangechanged', function(update) {
      updateWindow(chart, update, chartList);
    });
  });

  TIMELINE_DATA.on('add', visTimelineListener);
  TIMELINE_DATA.on('update', visTimelineListener);
  TIMELINE_DATA.on('remove', visTimelineListener);
}

export function getTimelineItemTime(id) {
  return getTime(TIMELINE_DATA.get(id));
}

export function loadRates() {
  BASE_CRIT_DATA = [];
  let baseRate = dmgU.getBaseCritRate();
  let baseDmg = dmgU.getBaseCritDmg();
  let seconds = dom.getSpellTimeRangeValue();

  // add all the timeline items
  let ids = TIMELINE_DATA.getIds().filter(id => {
    let ability = abilities.get(id);
    return !ability.charges && 
           (abilities.hasSPA(ability, abilities.SPA_CRIT_RATE_NUKE) ||
            abilities.hasSPA(ability, abilities.SPA_CRIT_DMG_NUKE));
  });

  for(let i=0; i<=seconds; i+=1000) {
    let time = CURRENT_TIME + i;
    let rate = baseRate;
    let dmg = baseDmg;

    let abilityList = [];
    ids.forEach(id => {
      let adpsItem = TIMELINE_DATA.get(id);
      if (withinTimeFrame(time, adpsItem)) {
        abilityList.push(id);
      }
    });

    dmgU.buildSPAData(abilityList).spaMap.forEach((value, key) => {
      let spa = Number.parseInt(key.substring(0, 3));

      if (abilities.SPA_CRIT_RATE_NUKE.has(spa)) {
        rate += value.value;
      }
      if (abilities.SPA_CRIT_DMG_NUKE.has(spa)) {
        dmg += value.value;
      }
    });
    
    rate = dmgU.trunc(rate * 100);
    dmg = dmgU.trunc(dmg * 100);
    BASE_CRIT_DATA.push({time: time, rate: rate, dmg: dmg});
  }
}

export function quiet() {
  TIMELINE_DATA.off('add', visTimelineListener);
  TIMELINE_DATA.off('remove', visTimelineListener);
}

export function resume() {
  TIMELINE_DATA.on('add', visTimelineListener);
  TIMELINE_DATA.on('remove', visTimelineListener);
  setTimeout(loadRates, 5);
  callUpdateSpellChart();
}

export function removeAdpsItem(id) {
  TIMELINE_DATA.remove(id);
}

export function removePopovers() {
  $('.popover').remove();
}

export function resetTimers(state) {
  state.spells.forEach(id => { delete state.spellTimerMap[utils.getSpellData(id).timer] });
  state.gcdWaitTime = state.workingTime;
}

export function setTitle(data, adpsOption, date) {
  let ability = abilities.get(adpsOption.id);
  let label = utils.createLabel(ability, date);
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

  let hasForcedRejuv = TIMELINE_DATA.get('FR');
  let sp = 0;
  let lockout = false;
  let preemptSpells = [];
  
  let state = {
    cache: {},
    castQueue: [],
    chartIndex: -1, 
    gcd: dom.getGCDValue(),
    gcdWaitTime: 0,
    updatedCritRValues: [],
    updatedCritDValues: [],
    spellTimerMap: {},
    plotFreq: Math.round(dom.getSpellTimeRangeValue() / 100000) * 100,
    lastCastMap: {},
    lastProcMap: {},
    spells: dom.getSelectedSpells(),
    endTime: CURRENT_TIME + dom.getSpellTimeRangeValue(),
    workingTime:  CURRENT_TIME
  };

  // Items that exist both as abilties on the spell timeline as well as ADPS chart. They need to be in sync.
  // Check that spell exists since it may not depending on Mage vs Wiz abilities
  dmgU.PREEMPT_SPELL_CASTS.filter(id => utils.getSpellData(id).id !== undefined).forEach(id => {
    let item = TIMELINE_DATA.get(id);
    
    if (item) {
      preemptSpells.push({ id: id, item: item, iTime: getTime(item), spell: utils.getSpellData(id), hasBeenCast: false });
    }
  });
  
  let checkPreempt = (entry, current, spellReady) => {
    // stop after first spell that's successful using 'update'
    if (entry.item && !entry.hasBeenCast) {
      // if we're about to cast a spell but it won't land until after this ability is supposed to be
      // cast then do nothing and wait
      let adjCastTime = utils.getCastTime(state, entry.spell);
      lockout = current && (spellReady && willCastDuring(state, entry.iTime, current, adjCastTime));

      if (withinTimeFrame(state.workingTime + adjCastTime, entry.item)) {
        // Fix start point on timeline if its out of bounds
        let adpsStartTime = state.workingTime;
        
        castSpell(state, entry.spell, adjCastTime);
        setTimelineItemStart(adpsStartTime, entry.item, adjCastTime);
        entry.hasBeenCast = true;
        lockout = false;

        if (entry.spell.lockoutTime !== 0) { // some spells like Manaburn dont have one at all
          state.gcdWaitTime = state.workingTime + state.gcd;            
        }          
          
        return true;
      }
    }
    
    return false;
  };

  while (state.workingTime <= state.endTime) {
    // workaround to get these on the timeline for AA or abilities like Firebound Orb
    preemptSpells.find(entry => checkPreempt(entry));
        
     // Forced Rejuvination resets lockouts and end GCD
    if (hasForcedRejuv && withinTimeFrame(state.workingTime, getTime(hasForcedRejuv))) {
      hasForcedRejuv = false;
      resetTimers(state);
    }

    // Display/Cast alliance damage when timer expires
    if (utils.isAbilityExpired(state, 'FA')) {
      castSpell(state, utils.getSpellData('FAF'));
      continue;
    }

    // abilities that can be enabled and repeat every so often like Enc Synergy
    // cancel or reset counters based on timer, only need to check once per workingTime
    updateActiveAbilities(state, true);

    // Don't do any spell cast if we're during the GCD lockout phase
    if (state.gcdWaitTime <= state.workingTime) {
      // if any spells proc or automated spells are pending
      if (state.castQueue.length > 0) {
        let id = state.castQueue.shift();
        castSpell(state, utils.getSpellData(id));
      }

      // find a spell to cast
      for (sp = 0; sp < state.spells.length; sp++) {
        let current = utils.getSpellData(state.spells[sp]);
        let recastTime = getModifiedSpellRecastTime(current);
        let spellReady = (state.workingTime - ((state.spellTimerMap[current.timer] || 0) + recastTime) > 0);

        // check if these spells need to be cast soon
        if (preemptSpells.find(entry => checkPreempt(entry, current, spellReady))) { break; }

        if (!lockout && spellReady) {
          // if cast successful update gcd wait time
          if (castSpell(state, current)) {
            if (current.lockoutTime !== 0) { // some spells like Manaburn dont have one at all
              state.gcdWaitTime = state.workingTime + state.gcd;            
            }
          }

          break; // break and try again at the updated workingTime
        }
      }
    }

    // spell not available so handle other click/AA abilities
    if (sp === state.spells.length || state.gcdWaitTime > state.workingTime) {
      // try to cast force nuke early to prevent conflicts later on
      // Ex FD can update crit dmg in the chart itself
      executeManualAbilities(state);

      // add dot damage
      getDoTDamage(state);
    }

    // do nothing if additional casts available otherwise increment time
    state.workingTime += TIME_INCREMENT;
  }

  // add left over dot damage
  state.workingTime = state.endTime;
  getDoTDamage(state, true);

  // update charts
  state.updatedCritRValues.forEach(rV => {
    updateCritGraphValue(CRITR_DATA, rV.time, rV.y);
  });
  state.updatedCritDValues.forEach(rV => {
    updateCritGraphValue(CRITD_DATA, rV.time, rV.y);
  });

  // connect up popover
  connectPopovers();

  // print spellStats window
  stats.printStats($('#spellCountStats'), state, dom.getSpellTimeRangeValue());
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
  let ability = abilities.get(item.items[0]);
  if (ability) {
    if (e === 'remove') {
      $('#adps-dropdown').multiselect('deselect', item.items[0], false);
    } else if (e === 'update') {
      let lineItem = TIMELINE_DATA.get(item.items[0]);
      let time = new Date(lineItem.end - lineItem.start);
      setTitle(TIMELINE_DATA, lineItem, time);
    }

    // only update rates when changing abilities that effect them
    if (!ability.charges && (abilities.hasSPA(ability, abilities.SPA_CRIT_RATE_NUKE) ||
      abilities.hasSPA(ability, abilities.SPA_CRIT_DMG_NUKE))) {
      setTimeout(loadRates, 5);
    }

    if (e != 'update' || item.oldData[0].start != item.data[0].start || item.oldData[0].end != item.data[0].end) {
      callUpdateSpellChart();
    }
  }
}