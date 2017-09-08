import * as dom from './dom.js';
import * as utils from './utils.js';

const STATISTICS = { spells: {}, totals: {} };
const STAT_CHANGE_TEMPLATE = Handlebars.compile($('#stat-change-template').html());
const STAT_SUB_TEMPLATE = Handlebars.compile($('#stat-sub-template').html());

// When aggregating stats from twincasts of the same spell or procs this
// list just makes it easier to initialize these properties without having
// classes of some kind which is work for the future
const STAT_LIST = [
  "adChargesUsed", "abAddDmg", "fwAddDmg", "mrAddDmg", "afuAddDmg", "avgDmg", "tcAvgDmg",
  "chChargesUsed", "drAddDmg", "drChargesUsed", "ehazyChargesUsed", "esynChargesUsed",
  "eqpAddDmg", "fdChargesUsed", "fpwrChargesUsed", "fpwrWeaknessRate",
  "fwChargesUsed", "itcChargesUsed", "msynChargesUsed", "mrChargesUsed",
  "mcChargesUsed", "nsynChargesUsed", "rsCount", "rsDPS", "fuseProcDmg",
  "vfxChargesUsed", "wsynChargesUsed", "wsynAddDmg", "clawChargesUsed"
];

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

function getAggregateStatistics(origStats) {
  let spellStats = $.extend({}, origStats);
  utils.initNumberProperties(spellStats, STAT_LIST);
  let compundSpellMap = utils.buildCompoundSpellMap(spellStats.chartIndex);

  $(compundSpellMap[spellStats.id]).each(function(i, value) {
    let st = getSpellStatisticsForIndex(value);

    $(STAT_LIST).each(function(i, item) {
      if (spellStats.id == 'FU' && (item == 'avgDmg' || item == 'tcAvgDmg')) {
        return; // Fusion already accounts for these in parent so don't count twice
      }

      spellStats[item] += st[item] ? st[item] : 0;
    });
  });

  return spellStats;
}

function updateStatSection(sectionId, avgDPS, label, text, value, key) {
  let prev = STATISTICS.totals[key];
  let change = (prev && avgDPS > 0) ? utils.getPercentText(prev, value) : "";
  let className = utils.getPercentClass(prev, value);
  change = (className == "") ? "" : change;
  $(sectionId).html('');
  $(sectionId).append(STAT_CHANGE_TEMPLATE({ className: className, label: label, value: text, change: change}));
}

export function addSpellStatistics(state, name, value) {
  if (state && state.hasStatistics && state.chartIndex >= 0) {
    let index = state.childId ? state.chartIndex + state.childId : state.chartIndex;
    if (!STATISTICS.spells[index]) {
      STATISTICS.spells[index] = {};
    }

    let current = STATISTICS.spells[index][name];
    STATISTICS.spells[index][name] = current ? current + value : value;
  }
}

export function getSpellStatisticsForIndex(index, key) {
  let stats = STATISTICS.spells[index];
  if (stats) {
    return key ? stats[key] : stats;
  } else {
    return {};
  }
}

export function getStatisticsSummary(spellStats) {
  let data = [];
  let spell = utils.getSpellData(spellStats.id);

  addNumberStatDescription(data, "Chart ID", spellStats.chartIndex, true);
  addDecimalStatDescription(data, "Cast Time(s)", spell.castTime, true);
  addDecimalStatDescription(data, "Cast Interval(s)", spellStats.castInterval);
  addDecimalStatDescription(data, "Recast Delay(s)", spellStats.castInterval - spell.castTime);
  addNumberStatDescription(data, "Pet Count", spellStats.rsCount);
  addNumberStatDescription(data, "Pet DPS", spellStats.rsDPS);

    // Only print spellStats for spells that do damage
  if (spell.type != "beneficial") {
    if (spellStats.id == "WF" || spellStats.id == "WE" || spellStats.id == "FU") {
      spellStats = getAggregateStatistics(spellStats);
    }

    addDecimalStatDescription(data, "AD Charges", spellStats.adChargesUsed);
    addDecimalStatDescription(data, "FD Charges", spellStats.fdChargesUsed);
    addDecimalStatDescription(data, "ITC Charges", spellStats.itcChargesUsed);
    addDecimalStatDescription(data, "DR Charges", spellStats.drChargesUsed);
    addDecimalStatDescription(data, "FWeave Charges", spellStats.fwChargesUsed);
    addDecimalStatDescription(data, "MR Charges", spellStats.mrChargesUsed);
    addDecimalStatDescription(data, "Claw Syllable", spellStats.clawChargesUsed);
    addDecimalStatDescription(data, "Vortex Effects", spellStats.vfxChargesUsed);
    addDecimalStatDescription(data, "Chroma Haze", spellStats.chChargesUsed);
    addDecimalStatDescription(data, "Hazy Thoughts", spellStats.ehazyChargesUsed);
    addDecimalStatDescription(data, "Mana Charge", spellStats.mcChargesUsed);
    addDecimalStatDescription(data, "Enc Synergy", spellStats.esynChargesUsed);
    addDecimalStatDescription(data, "Mag Synergy", spellStats.msynChargesUsed);
    addDecimalStatDescription(data, "Nec Synergy", spellStats.nsynChargesUsed);
    addDecimalStatDescription(data, "Wiz Synergy", spellStats.wsynChargesUsed);
    addDecimalStatDescription(data, "FlamesPwr Charges", spellStats.fpwrChargesUsed);
    addPercentStatDescription(data, "FlamesWeak Chance", spellStats.fpwrWeaknessRate);

    addPercentStatDescription(data, "Crit Dmg Mult", spellStats.critDmgMult, true);
    addPercentStatDescription(data, "Crit Rate", spellStats.critRate, true);
    addPercentStatDescription(data, "Twincast Rate", spellStats.twincastChance, true);
    addNumberStatDescription(data, "Spell Damage", spellStats.spellDmg);
    addPercentStatDescription(data, "Effectiveness", spellStats.effectiveness);
    addPercentStatDescription(data, "Before Crit Focus", spellStats.beforeCritMult);

    let beforeCritAdd = (spellStats.beforeCritAdd - spellStats.spellDmg) > 0 ? spellStats.beforeCritAdd - spellStats.spellDmg : 0;
    addNumberStatDescription(data, "Before Crit Add", beforeCritAdd);
    addPercentStatDescription(data, "After Crit Focus", spellStats.afterCritMult);
    addNumberStatDescription(data, "After Crit Add", spellStats.afterCritAdd);
    addPercentStatDescription(data, "Post Calc Focus", spellStats.postCalcMult);

    addNumberStatDescription(data, "Orig Base Dmg", spell.baseDmg);
    addNumberStatDescription(data, "Calc Base Dmg", spellStats.avgBaseDmg);
    addNumberStatDescription(data, "Calc Crit Dmg", spellStats.avgCritDmg);
    addNumberStatDescription(data, "Avg AE Hit1", spellStats.aeHit1);
    addNumberStatDescription(data, "Avg AE Hit2", spellStats.aeHit2);
    addNumberStatDescription(data, "Avg AE Hit3", spellStats.aeHit3);
    addNumberStatDescription(data, "Avg AE Hit4", spellStats.aeHit4);
    addNumberStatDescription(data, "Avg Dmg", spellStats.avgDmg);
    addNumberStatDescription(data, "Avg TC Dmg", spellStats.tcAvgDmg);
    addNumberStatDescription(data, "Sub Total", spellStats.avgDmg + spellStats.tcAvgDmg);
  }

  addNumberStatDescription(data, "Aug/Eqp Procs", spellStats.eqpAddDmg);
  addNumberStatDescription(data, "Arcane Fusion", spellStats.afuAddDmg);
  addNumberStatDescription(data, "FWeave Proc", spellStats.fwAddDmg);
  addNumberStatDescription(data, "DR Proc", spellStats.drAddDmg);
  addNumberStatDescription(data, "MR Proc", spellStats.mrAddDmg);
  addNumberStatDescription(data, "Hedgewizards", spellStats.abAddDmg);

  addNumberStatDescription(data, "Wiz Synergy Dmg", spellStats.wsynAddDmg);

  addNumberStatDescription(data, "Est Fuse Proc", spellStats.fuseProcDmg);
  addNumberStatDescription(data, "Total Dmg", spellStats.totalDmg);

  let dps = Math.trunc((spellStats.totalDmg || 0) / (spell.castTime + dom.getGCDValue()));
  data.push({ title: "DPS", value: utils.numberWithCommas(dps) + "/s"});

  return data;
}

export function printStats(output, totalAvgDmg, totalAvgPetDmg, timeRange, totalCritRate, maxHit, detSpellCount, spellCountMap) {
  // DPS
  let avgDPS = (totalAvgDmg + totalAvgPetDmg) / (timeRange / 1000);
  updateStatSection('#dpsStats', avgDPS, 'DPS ', utils.numberWithCommas(avgDPS.toFixed(2)), avgDPS, 'avgDPS');

  // Max Hit
  updateStatSection('#maxHitStats', avgDPS, 'Max Cast', utils.numberWithCommas(Math.trunc(maxHit)), maxHit, 'maxHit');

  // Avg Hit
  let avgHit = (detSpellCount > 0) ? totalAvgDmg / detSpellCount : 0;
  updateStatSection('#averageHitStats', avgDPS, 'Average Cast', utils.numberWithCommas(Math.trunc(avgHit)), avgHit, 'avgHit');

  // Total Damage from Spell Casts
  updateStatSection('#castDamageStats', avgDPS, 'Cast Damage ', utils.numberWithCommas(Math.trunc(totalAvgDmg)), totalAvgDmg, 'totalAvgCastDmg');

  // Total Pet Damage
  updateStatSection('#petDamageStats', avgDPS, 'Pet Damage ', utils.numberWithCommas(Math.trunc(totalAvgPetDmg)), totalAvgPetDmg, 'totalAvgPetDmg');

  // Total Damage
  let finalTotal = Math.trunc(totalAvgDmg + totalAvgPetDmg);
  updateStatSection('#totalDamageStats', avgDPS, 'Total Damage ', utils.numberWithCommas(finalTotal), finalTotal, 'totalAvgDmg');

  // Avg Crit Rate
  let avgCritRate = detSpellCount ? Math.round(totalCritRate / detSpellCount * 100) : 0;
  updateStatSection('#critRateStats', avgDPS, 'Crit Rate ', avgCritRate.toFixed(1) + '%', avgCritRate, 'avgCritRate');

  // Spell Count
  updateStatSection('#spellCountStats', avgDPS, 'Spells Cast ', utils.numberWithCommas(detSpellCount), detSpellCount, 'spellCount');

  // spell count details
  let sortedCounts = [];
  $.each(spellCountMap, function(key, value) {
    sortedCounts.push({key: key, value: value});
  });

  sortedCounts.sort(function(a, b) { return b.value - a.value; });
  $(sortedCounts).each(function(i, item) {
    output.append(STAT_SUB_TEMPLATE({ label: utils.getSpellData(item.key).name, value: item.value}));
  });

  if (avgDPS > 0) {
    $('.stats').addClass('stats-available');
  } else {
    $('.stats').removeClass('stats-available');
  }

  STATISTICS.totals.totalAvgDmg = finalTotal;
  STATISTICS.totals.totalAvgCastDmg = totalAvgDmg;
  STATISTICS.totals.totalAvgPetDmg = totalAvgPetDmg;
  STATISTICS.totals.avgDPS = avgDPS;
  STATISTICS.totals.avgHit = avgHit;
  STATISTICS.totals.maxHit = maxHit;
  STATISTICS.totals.avgCritRate = avgCritRate;
  STATISTICS.totals.spellCount = detSpellCount;
}

export function resetSpellStats() {
  STATISTICS.spells = {};
}

export function updateSpellStatistics(state, name, value) {
  if (state && state.hasStatistics && state.chartIndex >= 0) {
    let index = state.childId ? state.chartIndex + state.childId : state.chartIndex;
    if (!STATISTICS.spells[index]) {
      STATISTICS.spells[index] = { id: state.childId ? state.childId : state.id };
    }

    if (STATISTICS.spells[index][name] == undefined) {
      STATISTICS.spells[index][name] = value;
    }
  }
}