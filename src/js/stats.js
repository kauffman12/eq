import * as dmgU from './damage.utils.js';
import * as dom from './dom.js';
import * as utils from './utils.js';

const STATISTICS = { spells: new Map(), aggr: new Map(), _ids: new Map(), _totals: new Map() };
const STAT_CHANGE_TEMPLATE = Handlebars.compile($('#stat-change-template').html());
const STAT_SUB_TEMPLATE = Handlebars.compile($('#stat-sub-template').html());

function addNumberStatDescription(data, title, value, force) {
  if (value || force) {
    data.push({ title: title, value: utils.numberWithCommas(value) });
  }
}

function addDecimalStatDescription(data, title, value, force) {
  if (value || force) {
    data.push({ title: title, value: value.toFixed(2) });
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
  addDecimalStatDescription(data, "Cast Time(s)", spell.castTime, true);
  addDecimalStatDescription(data, "Cast Interval(s)", spellStats.get('castInterval'));
  addDecimalStatDescription(data, "Recast Delay(s)", spellStats.get('castInterval') - spell.castTime);
  addNumberStatDescription(data, "Pet Count", spellStats.get('rsCount'));
  addNumberStatDescription(data, "Pet DPS", spellStats.get('rsDPS'));

    // Only print spellStats for spells that do damage and not WE/WF
  if (spellStats.get('avgBaseDmg') > 0) {
    addDecimalStatDescription(data, "AD Charges", spellStats.get('adChargesUsed'));
    addDecimalStatDescription(data, "FD Charges", spellStats.get('fdChargesUsed'));
    addDecimalStatDescription(data, "ITC Charges", spellStats.get('itcChargesUsed'));
    addDecimalStatDescription(data, "DR Charges", spellStats.get('drChargesUsed'));
    addDecimalStatDescription(data, "FWeave Charges", spellStats.get('fwChargesUsed'));
    addDecimalStatDescription(data, "MR Charges", spellStats.get('mrChargesUsed'));
    addDecimalStatDescription(data, "MBRN Charges", spellStats.get('mbrnChargesUsed'));
    addDecimalStatDescription(data, "Claw Syllable", spellStats.get('clawChargesUsed'));
    addDecimalStatDescription(data, "Vortex Effects", spellStats.get('vfxChargesUsed'));
    addDecimalStatDescription(data, "Chroma Haze", spellStats.get('chChargesUsed'));
    addDecimalStatDescription(data, "Hazy Thoughts", spellStats.get('ehazyChargesUsed'));
    addDecimalStatDescription(data, "Mana Charge", spellStats.get('mcChargesUsed'));
    addDecimalStatDescription(data, "Enc Synergy", spellStats.get('esynChargesUsed'));
    addDecimalStatDescription(data, "Mag Synergy", spellStats.get('msynChargesUsed'));
    addDecimalStatDescription(data, "Nec Synergy", spellStats.get('nsynChargesUsed'));
    addDecimalStatDescription(data, "Wiz Synergy", spellStats.get('wsynChargesUsed'));
    addDecimalStatDescription(data, "FlamesPwr Charges", spellStats.get('fpwrChargesUsed'));
    addPercentStatDescription(data, "FlamesWeak Chance", spellStats.get('fpwrWeaknessRate'));

    addPercentStatDescription(data, "Crit Dmg Mult", spellStats.get('critDmgMult'), true);
    addPercentStatDescription(data, "Crit Rate", spellStats.get('critRate'), true);

    if (!['WF', 'WE'].find(x => x === spell.id)) {    
      addPercentStatDescription(data, "Twincast Rate", spellStats.get('twincastChance'), true);
      addNumberStatDescription(data, "Spell Damage", spellStats.get('spellDmg'));
      addPercentStatDescription(data, "Effectiveness", spellStats.get('effectiveness'));
      addPercentStatDescription(data, "Before Crit Focus", spellStats.get('beforeCritMult'));

      let beforeCritAdd = (spellStats.get('beforeCritAdd') - spellStats.get('spellDmg')) > 0 ? (spellStats.get('beforeCritAdd') - spellStats.get('spellDmg')) : 0;
      addNumberStatDescription(data, "Before Crit Add", beforeCritAdd);
      addPercentStatDescription(data, "After Crit Focus", spellStats.get('afterCritMult'));
      addNumberStatDescription(data, "After Crit Add", spellStats.get('afterCritAdd'));
      addPercentStatDescription(data, "Post Calc Focus", spellStats.get('postCalcMult'));

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
  addNumberStatDescription(data, "FWeave Proc", spellStats.get('fwAddDmg'));
  addNumberStatDescription(data, "DR Proc", spellStats.get('drAddDmg'));
  addNumberStatDescription(data, "MR Proc", spellStats.get('mrAddDmg'));
  addNumberStatDescription(data, "Hedgewizards", spellStats.get('abAddDmg'));

  addNumberStatDescription(data, "Wiz Synergy Dmg", spellStats.get('wsynAddDmg'));

  addNumberStatDescription(data, "Est Fuse Proc", spellStats.get('fuseProcDmg'));
  addNumberStatDescription(data, "Total Dmg", spellStats.get('totalDmg'));

  let dps = Math.trunc((spellStats.get('totalDmg') || 0) / (spell.castTime + dom.getGCDValue()));
  data.push({ title: "DPS", value: utils.numberWithCommas(dps) + "/s"});

  return data;
}

export function printStats(output, state, totalAvgDmg, totalAvgPetDmg, timeRange, maxHit) {
  let aggrSpellCount = getSpellCastInfo().get('spellCount') || 0;
  let aggrCritRate = getSpellCastInfo().get('critRate') || 0;
  let totalCastCount = getSpellCastInfo().get('totalCastCount') || 0;
  let totalDetCastCount = getSpellCastInfo().get('detCastCount') || 0;
  let avgDPS = (totalAvgDmg + totalAvgPetDmg) / (timeRange / 1000);

  // Spell Count
  updateStatSection('#spellCountStats', avgDPS, 'Spells + TC/Proc', totalCastCount, totalCastCount, 'totalCastCount');

  // DPS
  updateStatSection('#dpsStats', avgDPS, 'DPS ', utils.numberWithCommas(avgDPS.toFixed(2)), avgDPS, 'avgDPS');

  // Max Hit
  updateStatSection('#maxHitStats', avgDPS, 'Max Cast', utils.numberWithCommas(Math.trunc(maxHit)), maxHit, 'maxHit');

  // Avg Hit
  let avgHit = (totalDetCastCount > 0) ? totalAvgDmg / totalDetCastCount : 0;
  updateStatSection('#averageHitStats', avgDPS, 'Average Cast', utils.numberWithCommas(Math.trunc(avgHit)), avgHit, 'avgHit');

  // Total Damage from Spell Casts
  updateStatSection('#castDamageStats', avgDPS, 'Cast Damage ', utils.numberWithCommas(Math.trunc(totalAvgDmg)), totalAvgDmg, 'totalAvgCastDmg');

  // Total Pet Damage
  updateStatSection('#petDamageStats', avgDPS, 'Pet Damage ', utils.numberWithCommas(Math.trunc(totalAvgPetDmg)), totalAvgPetDmg, 'totalAvgPetDmg');

  // Total Damage
  let finalTotal = Math.trunc(totalAvgDmg + totalAvgPetDmg);
  updateStatSection('#totalDamageStats', avgDPS, 'Total Damage ', utils.numberWithCommas(finalTotal), finalTotal, 'totalAvgDmg');

  // Avg Crit Rate
  let avgCritRate = aggrSpellCount ? aggrCritRate / aggrSpellCount * 100 : 0;
  updateStatSection('#critRateStats', avgDPS, 'Crit Rate ', avgCritRate.toFixed(2) + '%', avgCritRate, 'avgCritRate');

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

export function addAggregateStatistics(state, name, value) {
  let count = STATISTICS.aggr.get(name);
  STATISTICS.aggr.set(name, count ? count + value : value);
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

export function getSpellStatistics(index) {
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