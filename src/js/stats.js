import * as dmgU from './damage.utils.js';
import * as dom from './dom.js';
import * as utils from './utils.js';

const STATISTICS = { spells: new Map(), aggr: new Map(), _ids: new Map(), _totals: new Map() };
const STAT_CHANGE_TEMPLATE = Handlebars.compile($('#stat-change-template').html());
const STAT_SUB_TEMPLATE = Handlebars.compile($('#stat-sub-template').html());

function addNumberStatDescription(data, title, value, force) {
  if (value || force) {
    data.push({ title: title, value: utils.numberWithCommas(Math.round(value)) });
  }
}

function addDecimalStatDescription(data, title, value, force, fixed) {
  if (value || force) {
    data.push({ title: title, value: value.toFixed(fixed || 2) });
  }
}

function addPercentStatDescription(data, title, value, force) {
  if (value || force) {
    data.push({ title: title, value: utils.displayPercent(value) });
  }
}

function updateStatSection(sectionId, avgDPS, label, text, value, key) {
  let prev = STATISTICS._totals.get(key);
  let change = (prev && avgDPS > 0) ? utils.getPercentText(prev, value) : "";
  let className = utils.getPercentClass(prev, value);
  change = (className === "") ? "" : change;
  $(sectionId).html('');
  $(sectionId).append(STAT_CHANGE_TEMPLATE({ className: className, label: label, value: text, change: change}));
  STATISTICS._totals.set(key, value);
}

export function getStatisticsSummary(spellStats) {
  let data = [];
  let spell = utils.getSpellData(spellStats.get('id'));

  addNumberStatDescription(data, "Chart ID", spellStats.get('chartIndex'), true);
  addDecimalStatDescription(data, "Cast Time(s)", spell.castTime / 1000, true, 3);
  addDecimalStatDescription(data, "Cast Interval(s)", spellStats.get('castInterval'), false, 3);
  addDecimalStatDescription(data, "Recast Delay(s)", spellStats.get('castInterval') - (spell.castTime / 1000));
  addNumberStatDescription(data, "Pet Count", spellStats.get('rsCounter'));
  addNumberStatDescription(data, "Pet DPS", spellStats.get('rsDPS'));

    // Only print spellStats for spells that do damage and not WE/WF
  if (spellStats.get('avgBaseDmg') > 0) {
    addDecimalStatDescription(data, "AD Charges", spellStats.get('adChargesUsed'));
    addDecimalStatDescription(data, "FD Charges", spellStats.get('fdChargesUsed'));
    addDecimalStatDescription(data, "ITC Charges", spellStats.get('itcChargesUsed'));
    addDecimalStatDescription(data, "DR Charges", spellStats.get('drChargesUsed'));
    addDecimalStatDescription(data, "AAura Charges", spellStats.get('aaChargesUsed'));
    addDecimalStatDescription(data, "AMelody Charges", spellStats.get('amChargesUsed'));
    addDecimalStatDescription(data, "Arcomancy Charges", spellStats.get('arcoChargesUsed'));
    addDecimalStatDescription(data, "FWeave Charges", spellStats.get('fwaeChargesUsed'));
    addDecimalStatDescription(data, "Firebound Charges", spellStats.get('firebaChargesUsed'));
    addDecimalStatDescription(data, "Frostbound Charges", spellStats.get('frostbaChargesUsed'));
    addDecimalStatDescription(data, "MR Charges", spellStats.get('mraChargesUsed'));
    addDecimalStatDescription(data, "MBRN Charges", spellStats.get('mbrnChargesUsed'));
    addDecimalStatDescription(data, "Fire Syllable", spellStats.get('syllfireChargesUsed'));
    addDecimalStatDescription(data, "Magic Syllable", spellStats.get('syllmagicChargesUsed'));
    addDecimalStatDescription(data, "Mastery Syllable", spellStats.get('syllmasterChargesUsed'));
    addDecimalStatDescription(data, "Ice Syllable", spellStats.get('sylliceChargesUsed'));
    addDecimalStatDescription(data, "Vortex Effects", spellStats.get('vfxChargesUsed'));
    addDecimalStatDescription(data, "Chroma Haze", spellStats.get('chChargesUsed'));
    addDecimalStatDescription(data, "Gift of Chroma", spellStats.get('gchChargesUsed'));
    addDecimalStatDescription(data, "Mana Charge", spellStats.get('mcChargesUsed'));
    addDecimalStatDescription(data, "Enc Synergy", spellStats.get('esynChargesUsed'));
    addDecimalStatDescription(data, "Mag Synergy", spellStats.get('msynChargesUsed'));
    addDecimalStatDescription(data, "Nec Synergy", spellStats.get('nsynChargesUsed'));
    addDecimalStatDescription(data, "Wiz Synergy", spellStats.get('wsynChargesUsed'));
    addDecimalStatDescription(data, "FlamesPwr Charges", spellStats.get('fpwrChargesUsed'));
    addDecimalStatDescription(data, "FlamesWeak Effect", spellStats.get('fweakChargesUsed'));

    addPercentStatDescription(data, "Crit Dmg Mult", spellStats.get('critDmgMult'), true);
    addPercentStatDescription(data, "Crit Rate", spellStats.get('critRate'), true);
    addPercentStatDescription(data, "Twincast Rate", spellStats.get('twincastRate'), true);
    
    if (!['WF', 'WE'].find(x => x === spell.id)) {    
      addNumberStatDescription(data, "Spell Damage", spellStats.get('spellDmg'));
      addPercentStatDescription(data, "Effectiveness", spellStats.get('effectiveness'));
      addPercentStatDescription(data, "Before Crit Focus", spellStats.get('beforeCritFocus'));
      addNumberStatDescription(data, "Before Crit Add", spellStats.get('beforeCritAdd'));
      addPercentStatDescription(data, "Before DoT Crit Focus", spellStats.get('beforeDoTCritFocus'));
      addPercentStatDescription(data, "After Crit Focus", spellStats.get('afterCritFocus'));
      addNumberStatDescription(data, "After Crit Add", spellStats.get('afterCritAdd'));
      addPercentStatDescription(data, "After Crit Focus NM", spellStats.get('afterCritFocusNoMod'));
      addNumberStatDescription(data, "After Crit Add NM", spellStats.get('afterCritAddNoMod'));
      addPercentStatDescription(data, "Post Calc Focus", spellStats.get('postCalcFocus'));

      addNumberStatDescription(data, "Orig Base Dmg", spell.baseDmg);
      addNumberStatDescription(data, "Calc Base Dmg", spellStats.get('avgBaseDmg'));
      addNumberStatDescription(data, "Calc Crit Dmg", spellStats.get('avgCritDmg'));
      addNumberStatDescription(data, "Avg AE Hit1", spellStats.get('aeHit1'));
      addNumberStatDescription(data, "Avg AE Hit2", spellStats.get('aeHit2'));
      addNumberStatDescription(data, "Avg AE Hit3", spellStats.get('aeHit3'));
      addNumberStatDescription(data, "Avg AE Hit4", spellStats.get('aeHit4'));
    }
    
    addNumberStatDescription(data, "Avg Dmg", spellStats.get('avgDmg'));
    addNumberStatDescription(data, "Avg TC Dmg", spellStats.get('tcAvgDmg'));
    addNumberStatDescription(data, "Sub Total", spellStats.get('avgDmg') + spellStats.get('tcAvgDmg'));
  }

  addNumberStatDescription(data, "Aug/Eqp Procs", spellStats.get('eqpAddDmg'));
  addNumberStatDescription(data, "Arcane Fusion", spellStats.get('afuAddDmg'));
  addNumberStatDescription(data, "AMelody Proc", spellStats.get('amAddDmg'));
  addNumberStatDescription(data, "Cryo Proc", spellStats.get('cryoAddDmg'));
  addNumberStatDescription(data, "DR Proc", spellStats.get('drAddDmg'));
  addNumberStatDescription(data, "FWeave Proc", spellStats.get('fwaeAddDmg'));
  addNumberStatDescription(data, "MR Proc", spellStats.get('mraAddDmg'));
  addNumberStatDescription(data, "Hedgewizards", spellStats.get('ahbAddDmg'));

  addNumberStatDescription(data, "Wiz Synergy Dmg", spellStats.get('wsynAddDmg'));

  addNumberStatDescription(data, "Est Fuse Proc", spellStats.get('fuseProcDmg'));
  addNumberStatDescription(data, "Total Dmg", spellStats.get('totalDmg'));

  let dps = Math.trunc((spellStats.get('totalDmg') || 0) / (spell.castTime + dom.getGCDValue()) * 1000);
  data.push({ title: "DPS", value: utils.numberWithCommas(dps) + "/s"});
  return data;
}

export function printStats(output, state) {
  let timerange = (state.castTimeLast - state.castTimeFirst);
  if (timerange < 1000) {
    timerange = 1000; // no less than 1 second
  }

  timerange = Math.ceil(timerange / 1000);

  let totalAvgDmg = getSpellCastInfo().get('totalAvgDmg') || 0;
  let totalAvgPetDmg = getSpellCastInfo().get('totalAvgPetDmg') || 0;
  let totalDotDmg = getSpellCastInfo().get('totalDotDmg') || 0;
  let totalProcs = getSpellCastInfo().get('totalProcs') || 0;
  let avgDPS = (totalAvgDmg + totalAvgPetDmg + totalDotDmg) / timerange;

  let maxHit = getSpellCastInfo().get('maxHit') || 0;
  let aggrSpellCount = getSpellCastInfo().get('spellCount') || 0;
  let aggrCritRate = getSpellCastInfo().get('critRate') || 0;
  let totalAvgTcRate = getSpellCastInfo().get('totalAvgTcRate') || 0;
  let totalCastCount = getSpellCastInfo().get('totalCastCount') || 0;
  let totalDetCastCount = getSpellCastInfo().get('detCastCount') || 0;
  
  // Spell Count
  updateStatSection('#spellCountStats', avgDPS, 'Spells', totalCastCount, totalCastCount, 'totalCastCount');

  // Cast Time
  updateStatSection('#castTimeStats', 0, 'Cast Time ', timerange + 's', timerange, 'timerange');

  // DPS
  updateStatSection('#dpsStats', avgDPS, 'DPS ', utils.numberWithCommas(avgDPS.toFixed(2)), avgDPS, 'avgDPS');

  // Max Hit
  updateStatSection('#maxHitStats', avgDPS, 'Max Cast', utils.numberWithCommas(Math.trunc(maxHit)), maxHit, 'maxHit');

  // Avg Hit
  let avgHit = (totalDetCastCount > 0) ? totalAvgDmg / totalDetCastCount : 0;
  updateStatSection('#averageHitStats', avgDPS, 'Avg Cast', utils.numberWithCommas(Math.trunc(avgHit)), avgHit, 'avgHit');

  // Total Damage from Spell Casts
  updateStatSection('#castDamageStats', avgDPS, 'Cast Damage ', utils.numberWithCommas(Math.trunc(totalAvgDmg)), totalAvgDmg, 'totalAvgCastDmg');

  // Total Pet Damage
  (totalAvgPetDmg > 0) ? $('#petDamageStats').show() : $('#petDamageStats').hide();
  updateStatSection('#petDamageStats', avgDPS, 'Pet Damage ', utils.numberWithCommas(Math.trunc(totalAvgPetDmg)), totalAvgPetDmg, 'totalAvgPetDmg');

  // Total Pet Damage
  (totalDotDmg > 0) ? $('#dotDamageStats').show() : $('#dotDamageStats').hide();
  updateStatSection('#dotDamageStats', avgDPS, 'DoT Damage ', utils.numberWithCommas(Math.trunc(totalDotDmg)), totalDotDmg, 'totalDotDmg');

  // Total Damage
  let finalTotal = Math.trunc(totalAvgDmg + totalAvgPetDmg + totalDotDmg);
  updateStatSection('#totalDamageStats', avgDPS, 'Total Damage ', utils.numberWithCommas(finalTotal), finalTotal, 'totalAvgDmg');

  // Avg Crit Rate
  let avgCritRate = aggrSpellCount ? aggrCritRate / aggrSpellCount * 100 : 0;
  updateStatSection('#critRateStats', avgDPS, 'Crit Rate ', avgCritRate.toFixed(2) + '%', avgCritRate, 'avgCritRate');

  // Avg TC Rate
  let avgTcRate = (totalDetCastCount > 0) && totalAvgTcRate ? totalAvgTcRate / totalDetCastCount * 100 : 0;
  updateStatSection('#tcRateStats', avgDPS, 'TC Rate ', avgTcRate.toFixed(2) + '%', avgTcRate, 'avgTcRate');

  // Avg Proc Rate
  let avgProcRate = totalProcs / timerange;
  updateStatSection('#procRateStats', avgDPS, 'PPS', avgProcRate.toFixed(4), avgProcRate, 'avgProcRate');

  getSpellCastInfo().get('castMap').forEach((v, k) => {
    output.append(STAT_SUB_TEMPLATE({ label: utils.getSpellData(k).name, value: v}));
  });

  avgDPS > 0 ? $('.stats').addClass('stats-available') : $('.stats').removeClass('stats-available');
}

// Functions for working with spell statistics
function incrementStat(mapName, key) {
  let count = STATISTICS[mapName].get(key);
  STATISTICS[mapName].set(key, count ? count + 1 : 1);  
}

function initSpellStatistics(index, name, value) {
  if (STATISTICS.spells.has(index)) {
    // keep track of spell counts per ID
    if (name === 'id' && value !== undefined) {
      incrementStat('_ids', value);
      incrementStat('aggr', 'totalCastCount');
    }

    return STATISTICS.spells.get(index);
  }

  let indexMap = new Map();
  STATISTICS.spells.set(index, indexMap);
  return indexMap;
}

export function addAggregateStatistics(name, value) {
  let count = STATISTICS.aggr.get(name) || 0;
  STATISTICS.aggr.set(name, count + value);
}

export function addMaxAggregateStatistics(name, value) {
  let count = STATISTICS.aggr.get(name) || 0;
  if (value > count) {
    STATISTICS.aggr.set(name, value);
  }
}

export function addSpellStatistics(state, name, value) {
  let indexMap = initSpellStatistics(state.chartIndex, name, value);
  indexMap.set(name, indexMap.has(name) ? indexMap.get(name) + value : value);
}

export function getSpellCastInfo() {
  let info = new Map([...STATISTICS.aggr]);
  let sortedList = [...STATISTICS._ids].sort((a,b) => { return a[1] < b[1]; })
  info.set('castMap', new Map(sortedList));
  return info;
}

export function getSpellStatistics(state, key) {
  return STATISTICS.spells.get(state.chartIndex).get(key);
}

export function getSpellStatisticsForIndex(index) {
  return STATISTICS.spells.get(index) || new Map();
}

export function clear() {
  STATISTICS.spells.clear();
  STATISTICS.aggr.clear();
  STATISTICS._ids.clear();
}

export function updateSpellStatistics(state, name, value) {
  let indexMap = initSpellStatistics(state.chartIndex, name, value);
  if (!indexMap.has(name)) {
    indexMap.set(name, value);
  }
}