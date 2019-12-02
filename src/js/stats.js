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
    data.push({ title: title, value: value.toFixed(fixed||3) });
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
  addNumberStatDescription(data, "Level", spell.level, true);
  data.push({ title: "Time Left(s)", value: spellStats.get('timeLeft')});
  addDecimalStatDescription(data, "Cast Time(s)", spellStats.get('adjCastTime') / 1000, true, 3);
  addDecimalStatDescription(data, "Cast Interval(s)", spellStats.get('castInterval'), false, 3);
  addDecimalStatDescription(data, "Recast Delay(s)", spellStats.get('castInterval') - (spell.castTime / 1000));
  addNumberStatDescription(data, "Pet Count", spellStats.get('rsCounter'));
  //addNumberStatDescription(data, "Pet DPS", spellStats.get('rsDPS'));

    // Only print spellStats for spells that do damage and not WE/WF
  if (spellStats.get('avgBaseDmg') > 0) {
    addDecimalStatDescription(data, "AD Charges", spellStats.get('adChargesUsed'));
    addDecimalStatDescription(data, "FD Charges", spellStats.get('fdChargesUsed'));
    addDecimalStatDescription(data, "CI Charges", spellStats.get('ciChargesUsed'));
    addDecimalStatDescription(data, "ITC Charges", spellStats.get('itcChargesUsed'));
    addDecimalStatDescription(data, "DR Charges", spellStats.get('drChargesUsed'));
    addDecimalStatDescription(data, "AAura Charges", spellStats.get('aaChargesUsed'));
    addDecimalStatDescription(data, "ABallod Charges", spellStats.get('abChargesUsed'));
    addDecimalStatDescription(data, "Arcomancy Charges", spellStats.get('arcoChargesUsed'));
    addDecimalStatDescription(data, "FReave Charges", spellStats.get('fraChargesUsed'));
    addDecimalStatDescription(data, "Firebound Charges", spellStats.get('firebaChargesUsed'));
    addDecimalStatDescription(data, "Frostbound Charges", spellStats.get('frostbaChargesUsed'));
    addDecimalStatDescription(data, "FB Singe I", spellStats.get('fbsingerk1ChargesUsed'));
    addDecimalStatDescription(data, "FB Singe II", spellStats.get('fbsingerk2ChargesUsed'));
    addDecimalStatDescription(data, "FB Singe III", spellStats.get('fbsingerk3ChargesUsed'));    
    addDecimalStatDescription(data, "MR Charges", spellStats.get('mraChargesUsed'));
    addDecimalStatDescription(data, "MBRN Charges", spellStats.get('mbrnChargesUsed'));
    addDecimalStatDescription(data, "Fire Syllable I", spellStats.get('syllfirerk1ChargesUsed'));
    addDecimalStatDescription(data, "Fire Syllable II", spellStats.get('syllfirerk2ChargesUsed'));
    addDecimalStatDescription(data, "Fire Syllable III", spellStats.get('syllfirerk3ChargesUsed'));
    addDecimalStatDescription(data, "Magic Syllable I", spellStats.get('syllmagicrk1ChargesUsed'));
    addDecimalStatDescription(data, "Magic Syllable II", spellStats.get('syllmagicrk2ChargesUsed'));
    addDecimalStatDescription(data, "Magic Syllable IIII", spellStats.get('syllmagicrk3ChargesUsed'));
    addDecimalStatDescription(data, "Mastery Syllable I", spellStats.get('syllmasterrk1ChargesUsed'));
    addDecimalStatDescription(data, "Mastery Syllable II", spellStats.get('syllmasterrk2ChargesUsed'));
    addDecimalStatDescription(data, "Mastery Syllable III", spellStats.get('syllmasterrk3ChargesUsed'));
    addDecimalStatDescription(data, "Ice Syllable I", spellStats.get('syllicerk1ChargesUsed'));
    addDecimalStatDescription(data, "Ice Syllable II", spellStats.get('syllicerk2ChargesUsed'));
    addDecimalStatDescription(data, "Ice Syllable III", spellStats.get('syllicerk3ChargesUsed'));
    addDecimalStatDescription(data, "Vortex Effects", spellStats.get('vfxChargesUsed'));
    addDecimalStatDescription(data, "Chroma Haze", spellStats.get('chChargesUsed'));
    addDecimalStatDescription(data, "Gift of Chroma", spellStats.get('gchChargesUsed'));
    addDecimalStatDescription(data, "Mana Charge", spellStats.get('mcChargesUsed'));
    addDecimalStatDescription(data, "Enc Synergy", spellStats.get('esynChargesUsed'));
    addDecimalStatDescription(data, "Mag Synergy", spellStats.get('msyn1ChargesUsed'));
    addDecimalStatDescription(data, "Mag Synergy", spellStats.get('msyn2ChargesUsed'));
    addDecimalStatDescription(data, "Nec Synergy", spellStats.get('nsynChargesUsed'));
    addDecimalStatDescription(data, "Wiz Synergy", spellStats.get('wsyn1ChargesUsed'));
    addDecimalStatDescription(data, "Wiz Synergy", spellStats.get('wsyn2ChargesUsed'));
    addDecimalStatDescription(data, "FlamesPwr Charges", spellStats.get('fpwrChargesUsed'));
    addDecimalStatDescription(data, "FlamesWeak Effect", spellStats.get('fweakChargesUsed'));

    addPercentStatDescription(data, "Crit Dmg Mult", spellStats.get('critDmgMult'), true);
    addPercentStatDescription(data, "Lucky Crit Dmg Mult", spellStats.get('luckyCritDmgMult'), true);
    addPercentStatDescription(data, "Crit Rate", spellStats.get('critRate'), true);
    addPercentStatDescription(data, "Lucky Crit Rate", spellStats.get('luckyCritRate'), true);
    addPercentStatDescription(data, "Twincast Rate", spellStats.get('twincastRate'), true);
    
    if (!['WS', 'WE'].find(x => x === spell.id)) {    
      addNumberStatDescription(data, "Spell Damage", spellStats.get('spellDmg'));
      addPercentStatDescription(data, "Effectiveness", spellStats.get('effectiveness'));
      addPercentStatDescription(data, "Before Crit Focus", spellStats.get('beforeCritFocus'));
      addNumberStatDescription(data, "Before Crit Add", spellStats.get('beforeCritAdd'));
      addPercentStatDescription(data, "Before DoT Crit Focus", spellStats.get('beforeDoTCritFocus'));
      addPercentStatDescription(data, "After Crit Focus", spellStats.get('afterCritFocus'));
      addNumberStatDescription(data, "After Crit Add", spellStats.get('afterCritAdd'));
      addPercentStatDescription(data, "SPA 461 Focus", spellStats.get('spa461Focus'));
      addPercentStatDescription(data, "After SPA 461 Focus", spellStats.get('afterSPA461Focus'));
      addNumberStatDescription(data, "After SPA 461 Add", spellStats.get('afterSPA461Add'));

      addNumberStatDescription(data, "Orig Base Dmg", spell.baseDmg);
      addNumberStatDescription(data, "Calc Base Dmg", spellStats.get('avgBaseDmg'));
      addNumberStatDescription(data, "Calc Crit Dmg", spellStats.get('avgCritDmg'));
      addNumberStatDescription(data, "Calc Lucky Crit Dmg", spellStats.get('avgLuckyCritDmg'));
      addNumberStatDescription(data, "Avg AE Hit1", spellStats.get('aeHit1'));
      addNumberStatDescription(data, "Avg AE Hit2", spellStats.get('aeHit2'));
      addNumberStatDescription(data, "Avg AE Hit3", spellStats.get('aeHit3'));
      addNumberStatDescription(data, "Avg AE Hit4", spellStats.get('aeHit4'));
      addNumberStatDescription(data, "Avg AE Hit5", spellStats.get('aeHit5'));
      addNumberStatDescription(data, "Avg AE Hit6", spellStats.get('aeHit6'));
      addNumberStatDescription(data, "Avg AE Hit7", spellStats.get('aeHit7'));
      addNumberStatDescription(data, "Avg AE Hit8", spellStats.get('aeHit8'));
      addNumberStatDescription(data, "Avg AE Hit9", spellStats.get('aeHit9'));
      addNumberStatDescription(data, "Avg AE Hit10", spellStats.get('aeHit10'));
      addNumberStatDescription(data, "Avg AE Hit11", spellStats.get('aeHit11'));
      addNumberStatDescription(data, "Avg AE Hit12", spellStats.get('aeHit12'));
    }
    
    addNumberStatDescription(data, "Avg Dmg", spellStats.get('avgDmg'));
    addNumberStatDescription(data, "Avg TC Dmg", spellStats.get('tcAvgDmg'));
    addNumberStatDescription(data, "Sub Total", spellStats.get('avgDmg') + spellStats.get('tcAvgDmg'));
  }

  addNumberStatDescription(data, "Avg 1 Pet Dmg", spellStats.get('est1PetDmg'));
  addNumberStatDescription(data, "Aug/Eqp Procs", spellStats.get('eqpAddDmg'));
  addNumberStatDescription(data, "Arcane Fusion", spellStats.get('afuAddDmg'));
  addNumberStatDescription(data, "ABallad Proc", spellStats.get('abAddDmg'));
  addNumberStatDescription(data, "Cryo Proc", spellStats.get('cryoAddDmg'));
  addNumberStatDescription(data, "Pyro Proc", spellStats.get('pyroAddDmg'));
  addNumberStatDescription(data, "DR Proc", spellStats.get('drAddDmg'));
  addNumberStatDescription(data, "FReave Proc", spellStats.get('fraAddDmg'));
  addNumberStatDescription(data, "MR Proc", spellStats.get('mraAddDmg'));
  addNumberStatDescription(data, "RestlessFocus", spellStats.get('rfAddDmg'));
  addNumberStatDescription(data, "Steel Vengeance", spellStats.get('steelvengAddDmg'));
  addNumberStatDescription(data, "Repudiate Destruction", spellStats.get('repudiatedestAddDmg'));

  addNumberStatDescription(data, "Wiz Synergy Dmg", spellStats.get('wsyn1AddDmg'));
  addNumberStatDescription(data, "Wiz Synergy Dmg", spellStats.get('wsyn2AddDmg'));

  addNumberStatDescription(data, "Est Braid Proc", spellStats.get('fuseProcDmg'));
  addNumberStatDescription(data, "Total Dmg", spellStats.get('totalDmg'));

  let dps = Math.trunc((spellStats.get('totalDmg') || 0) / (spellStats.get('adjCastTime') + dom.getLockoutTime(spell)) * 1000);
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
  //let totalAvgPetDmg = getSpellCastInfo().get('totalAvgPetDmg') || 0;
  let totalDotDmg = getSpellCastInfo().get('totalDotDmg') || 0;
  let totalProcs = getSpellCastInfo().get('totalProcs') || 0;
  let avgDPS = (totalAvgDmg + totalDotDmg) / timerange;
 
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
  //updateStatSection('#petDamageStats', avgDPS, 'Pet Damage ', utils.numberWithCommas(Math.trunc(totalAvgPetDmg)), totalAvgPetDmg, 'totalAvgPetDmg');

  // Total DoT Damage
  updateStatSection('#dotDamageStats', avgDPS, 'DoT Damage ', utils.numberWithCommas(Math.trunc(totalDotDmg)), totalDotDmg, 'totalDotDmg');

  // Total Damage
  let finalTotal = Math.trunc(totalAvgDmg + totalDotDmg);
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