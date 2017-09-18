import {globals as G} from './settings.js';
import * as dom from './dom.js';
import * as stats from './stats.js';
import * as utils from './utils.js';

// Wiz Settings
export const ARCANE_FURY_FOCUS = 0.15;
export const ARCANE_FUSION_CHANCE = 0.04;
export const CLAW_PROC_MAGIC_CHANCE = 0.05;
export const CLAW_PROC_ICE_CHANCE = 0.05;
export const CLAW_PROC_FIRE_CHANCE = 0.35;
export const CLAW_PROC_SPECIFIC_DMG = 3469;
export const CLAW_PROC_ANY_CHANCE = 0.12;
export const CLAW_PROC_ANY_DMG = 4232;
export const CLAW_REFRESH_CHANCE = 0.06;
export const CLAW_TWINCAST_CHANCE = 0.10;
export const FURY_RO_DMG = 2500;
export const FURY_ECI_DMG = 2500;
export const FURY_DRUZ_DMG = 2500;
export const FURY_KERA_DMG = 1550;
export const FUSE_PROC_CHANCE = 0.35;
export const FUSE_PROC_INDIVIDUAL_SPELL_CHANCE = 0.32;
export const IMPROVED_FAMILIAR_CRIT = 0.27;
export const KERA_FAMILIAR_FOCUS = 0.50;
export const AVG_VORTEX_FOCUS = 0.75;
export const VORTEX_EFFECT_TIMER = 21000;
export const WILDMAGIC_CHAOS_CHANCE = 0.35;
export const WILDMAGIC_RIMEBLAST_CHANCE = 0.35;
export const WILDMAGIC_PURE_CHANCE = 0.30;
export const WIZ_INNATE_CRIT_RATE = 2;
export const WIZ_INNATE_CRIT_DMG = 100;

// Mage Settings
export const MAGE_INNATE_CRIT_RATE = 0;
export const MAGE_INNATE_CRIT_DMG = 100;
export const FLAMES_POWER_TIMER = 30000;
export const FLAMES_POWER_FOCUS = 1.05;
export const FLAMES_POWER_RATE = 0.25;
export const FLAMES_WEAKNESS_TIMER = 15000;
export const FLAMES_WEAKNESS_FOCUS = -0.25;
export const FLAMES_WEAKNESS_RATE = 0.01;
export const FIREBOUND_ORB_COUNT = 10;

// ADPS Settings
export const AUG_AURA_PERCENT = 0.04;
export const AM_COUNTERS = 4;
export const AM_TIMER = 6500; // basically every tick
export const ARIA_MAETANRUS_PERCENT = 0.45;
export const ENC_SYNERGY_PERCENT = 0.40;
export const SYNERGY_TIMER = 12000;
export const ENC_HAZY_CRIT_RATE = 1.00;
export const ENC_HAZY_FOCUS = 0.40;
export const ENC_HAZY_TIMER = 12000;
export const MAG_SYNERGY_PERCENT = 0.50;
export const NEC_SYNERGY_PERCENT = 0.15;
export const NILSARA_ARIA_DMG = 1638;
export const FW_COUNTERS = 6;
export const FW_TIMER = 18000;
export const MR_COUNTERS = 6;
export const MR_TIMER = 18000;
export const LINGERING_CRY_FOCUS = 0.08;
export const BLIZARD_BREATH_FOCUS = 0.055;
export const MALO_FOCUS = 0.055;
export const SEEDLINGS_FOCUS = 0.065;
export const TC_AURA_PERCENT = 0.11;

// Calculated Settings
export const FUSE_PROC_SPELL_CHANCE = FUSE_PROC_CHANCE * FUSE_PROC_INDIVIDUAL_SPELL_CHANCE;
export const REFRESH_CAST_COUNT = Math.ceil(1 / CLAW_REFRESH_CHANCE);

// Activated Abilities section enabled via checkbox
export const ACTIVATED_ABILITIES = [
  { id: 'ESYN', enabled: dom.isUsingEncSynergy, rate: dom.getEncSynergyRate, timer: SYNERGY_TIMER, count: 1 },
  { id: 'EHAZY', enabled: dom.isUsingEncHazy, rate: dom.getEncHazyRate, timer: ENC_HAZY_TIMER, count: 1 },
  { id: 'MSYN', enabled: dom.isUsingMagSynergy, rate: dom.getMagSynergyRate, timer: SYNERGY_TIMER, count: 1 },
  { id: 'NSYN', enabled: dom.isUsingNecSynergy, rate: dom.getNecSynergyRate, timer: SYNERGY_TIMER, count: 1 },
  { id: 'WSYN', enabled: dom.isUsingWizSynergy, rate: dom.getWizSynergyRate, timer: SYNERGY_TIMER, count: 1 },
  { id: 'AM', enabled: dom.isUsingAM, rate: () => AM_TIMER, timer: AM_TIMER * 10, count: AM_COUNTERS },
  { id: 'MR', enabled: dom.isUsingMR, rate: () => MR_TIMER, timer: MR_TIMER * 10, count: MR_COUNTERS },
  { id: 'FW', enabled: dom.isUsingFW, rate: () => FW_TIMER, timer: FW_TIMER * 10, count: FW_COUNTERS }
];

// Spell/Abilities that exist on both spell timeline and adps (they can overlap)
export const PREEMPT_SPELL_CASTS = [ 'TC', 'MBRN' ];

function getMultiplier(castTime) {
  var multiplier = 0.25;

  if(castTime >= 2500 && castTime <= 7000) {
    multiplier = .000167 * (castTime - 1000);
  } else if(castTime > 7000) {
    multiplier = 1 * castTime / 7000;
  }

  return multiplier;
}

function initFlames(state, update) {
  utils.initNumberProperties(state, ['flamesWeaknessCounter']);
  utils.initListProperties(state, ['flamesWeaknessTimers']);
  state.fpwrExpireTime = state.workingTime + FLAMES_POWER_TIMER;
  state.fpwrCounter = (dom.getFlamesOfPowerValue() === 4) ? 2.0 : 1.0;

  // Count the number of potential weaknesses applied sort of like Claw
  state.flamesWeaknessCounter += update;
  state.flamesWeaknessTimers.push(utils.createTimer(state.workingTime + FLAMES_WEAKNESS_TIMER, (value) => {value - update}));
}

export function applyDichoBug(state, id) {
  var keys = utils.getCounterKeys(id);
  // special case for Dicho to eat extra counter
  if (state.spell.id === 'DF') {
    if (state[keys.counter] >= 1) {
      state[keys.counter]--;
      stats.addSpellStatistics(state, keys.charges, 1);
    } else {
      stats.addSpellStatistics(state, keys.charges, state[keys.counter]);
      state[keys.counter] = 0;
    }
  }
}

export function applyPostSpellProcs(state, timeline, mod) {
  var update = mod ? mod : 1;

  switch(state.spell.id) {
    case 'BJ':
      state.fbOrbCounter = state.inTwincast ? state.fbOrbCounter : state.fbOrbCounter - 1;
      break;    
    // Claw of the Flameweaver + Mage Chaotic Fire
    case 'CF':
      // Claw only
      if (G.MODE === 'wiz') {
        utils.initNumberProperties(state, ['clawCounter']);
        // Number of claws cast used when handling syllables
        state.clawCounter += update;
      } else if (G.MODE === 'mage') {
        initFlames(state, update);
      }

      var tcLength = utils.readAdpsOption('TC', 'offset');
      utils.initNumberProperties(state, ['clawRefreshCount', 'clawTcProcRate']);
      utils.initListProperties(state, ['clawTcTimers']);

      // Update claw proc chance
      state.clawTcProcRate += CLAW_TWINCAST_CHANCE * update;
      state.clawTcTimers.push(utils.createTimer(state.workingTime + tcLength, function(value) {
        return value - CLAW_TWINCAST_CHANCE * update;
      }));

      // only count main spells for normalization
      state.clawRefreshCount += update;

      // skip ahead since we just cast a spell
      // if Claw is cast then reduce timers by 6% including gcd
      state.spells.forEach((t) => {
        var theSpell = utils.getSpellData(t);
        var last = state.lastCastMap[theSpell.timer];
        var count = Math.floor(state.clawRefreshCount);
        if (last && last > 0 && (((REFRESH_CAST_COUNT - count + dom.getRefreshOffsetValue())) % REFRESH_CAST_COUNT === 0)) {
          delete state.lastCastMap[theSpell.timer];
        }
      });
      break;
    case 'SV':
      state.vfxCounter = dom.getShockingVortexEffectValue();
      state.vfxExpireTime = state.workingTime + VORTEX_EFFECT_TIMER;
      state.wsynCounter = dom.getEvokersSynergyValue();
      state.wsynExpireTime = state.workingTime + SYNERGY_TIMER + 3000;
      break;
    case 'FC':
      // FC is used my mages and wizards
      if (G.MODE === 'mage') {
        initFlames(state, update);
      }
      break;
    case 'RS':
      if (dom.getConjurersSynergyValue() > 0) {
        let keys = utils.getCounterKeys('MSYN');
        state[keys.expireTime] = state.workingTime + SYNERGY_TIMER + 3000;
        state[keys.counter] = dom.getConjurersSynergyValue();
      }

      let keys = utils.getCounterKeys('RS');
      utils.initNumberProperties(state, [keys.counter]);
      utils.initListProperties(state, [keys.timers]);
      state[keys.counter]++;
      stats.updateSpellStatistics(state, keys.counter, state[keys.counter]);
      state[keys.timers].push(
        utils.createTimer(state.workingTime + dom.getRemorselessServantTTLValue(), (value) => { return value - 1; })
      );
      
      // save simple for expected DPS at this time
      stats.updateSpellStatistics(state, 'rsDPS', dom.getRemorselessServantDPSValue() * state[keys.counter]);
      
      if (!state.dotGenerator) {
        state.dotGenerator = genDamageOverTime(state);
      }
      break;
    case 'FA':
      state[utils.getCounterKeys('FA').expireTime] = state.workingTime + dom.getAllianceFulminationValue();
      break;
    case 'SFB':
      state.fbOrbCounter = FIREBOUND_ORB_COUNT;
      break;
    case 'TC':
      state.tcExpireTime = timeline.getTimelineItemTime('TC').end;
      state.tcCounter = 1;
      break;
  }
}

export function applyPreSpellProcs(state, timeline) {
  // Check for effects to cancel
  ['VFX', 'WSYN', 'FPWR'].forEach(id => utils.checkSimpleTimer(state, id)); // simple timers
  utils.checkTimerList(state, 'clawTcProcRate', 'clawTcTimers');
  utils.checkTimerList(state, 'flamesWeaknessCounter', 'flamesWeaknessTimers');

  // Update Storm of Many damage based on selected value
  // Start handling spell recast timer mods, etc here instead of in run or
  // using origRecastTimer or anything like that
  switch(state.spell.id) {
    case 'SM':
      state.spell.baseDmg = state.spell['baseDmg' + dom.getStormOfManyCountValue()];
      break;
  }
}

export function* genDamageOverTime(state) {
  let dps = dom.getRemorselessServantDPSValue();
  let keys = utils.getCounterKeys('RS');
  let current = state.workingTime;
  
  while (dps > 0) {
    let result = (state[keys.counter] || 0) * dps * ((state.workingTime - current) / 1000);
    current = state.workingTime;
    yield result;
  }

  return 0;
}

export function checkAbilityReqs(state, a) {
  let ability = utils.readActiveAbility(a);
  return !ability || !ability.requirements || passReqs(ability.requirements, state);
}

export function getBaseCritDmg() {
  // Wiz Pet is Crit DMG Focus Spell (SPA 170)
  // Definitely stacks with FD and works with DF and AA Nukes
  return dom.getPetCritFocusValue() + dom.getDestructiveFuryValue() + dom.getCritDmgValue();
}

export function getBaseCritRate() {
  return dom.getDoNValue() + dom.getFuryOfMagicValue() + dom.getCritRateValue();
}

export function getCompoundSpellList(id) {
  return utils.useCache('compound-spell-list-' + id, function() {
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
}

export function getFickleRate(rate) {
  var additionalChance = 0;

  switch(dom.getFlamesOfPowerValue()) {
    case 4: case 3:
      additionalChance = 0.34;
      break;
    case 2:
      additionalChance = 0.30;
      break;
    case 1:
      additionalChance = 0.27;
      break;
  }

  return rate + (additionalChance * (1 - rate) * rate);
}

export function getProcRate(spell, proc) {
  // spell being cast vs spell id of what is being proc'd
  return (proc.base1) ? proc.base1 / 100 * getNormalizer(spell) : 1.0;
}

export function getSpellDamage(spell) {
  // dicho/fuse needs to use an alternative time since it's really 2 spell casts
  // that get applied differently depending on what we're looking for
  var recastTime = spell.recastTime2 ? spell.recastTime2 : spell.recastTime;

  var totalCastTime = spell.origCastTime +
    ((recastTime > spell.lockoutTime) ? recastTime : spell.lockoutTime);

  var multiplier = getMultiplier(totalCastTime);
  return Math.trunc(utils.asDecimal32Precision(dom.getSpellDamageValue() * multiplier));
}

export function getNormalizer(spell) {
  return getMultiplier(spell.origCastTime);
}

export function trunc(value) {
  return Math.trunc(utils.asDecimal32Precision(value));
}

export function isCastSpell(spell) {
  return (spell.skill === 24 || spell.skill === 14) && spell.level <= 250;
}

export function isEqpProc(spell) {
  return spell.skill === 52;
}

export function isSpellProc(spell) {
  // The skill 5 with no max value is only thing I can find on eqresource to avoid alliance fulminations
  // without adding a special case
  return spell.level > 250 && !spell.discRefresh && (spell.skill === 24 || (spell.skill === 5 && !spell.max) || spell.skill === 98);
}

export function isSpellOrEqpProc(spell) {
  return isSpellProc(spell) || isEqpProc(spell);
}

export function canTwincast(spell) {
  // final case covers Dark Shield of Scholar
  return spell.canTwincast !== false && !spell.beneficial && spell.manaCost >= 10 && (isCastSpell(spell) || (isEqpProc(spell) && spell.discRefresh > 0));
}

export function canTwinproc(spell) {
  return (isSpellProc(spell) && spell.isFocusable) || (isEqpProc(spell) && !spell.discRefresh && spell.isFocusable);
}

export function canProcSpells(spell) {
  return spell.isFocusable && spell.baseDmg > 0 && !spell.discRefresh;
}

export function isCastDetSpellOrAbility(spell) {
  return isCastDetSpell(spell) || spell.discRefresh > 0;
}

export function isCastDetSpell(spell) {
  return spell.baseDmg > 0 && [5, 14, 24].find(x => x === spell.skill) &&
    spell.max !== 0 && !(spell.skill === 24 && spell.level > 250);
}

export function passReqs(reqs, state) {
  var spell = state.spell;

  if (reqs) {
    if (reqs.minManaCost && spell.manaCost < reqs.minManaCost) {
      return false;
    } else if (reqs.minLevel && spell.level < reqs.minlevel) {
      return false;
    } else if (reqs.maxLevel && spell.level > reqs.maxLevel) {
      return false;
    } else if (reqs.minCastTime && spell.origCastTime < reqs.minCastTime) {
      return false;
    } else if (reqs.minDamage && spell.baseDmg < reqs.minDamage) {
      return false;
    } else if (reqs.castSpellOnly && !isCastSpell(spell)) {
      return false;
    } else if (reqs.canProcSpells && !canProcSpells(spell)) {
      return false
    } else if (reqs.canTwincast && !canTwincast(spell)) {
      return false
    } else if (reqs.focusable && !spell.isFocusable) {
      return false;
    } else if (reqs.spellOrEqpProc && !isSpellOrEqpProc(spell)) {
      return false;
    } else if (reqs.exTargets && reqs.exTargets.find(x => x === spell.target)) {
      return false;
    } else if (reqs.resists && !reqs.resists.find(x => x === spell.resist)) {
      return false;
    }
  }

  return true;
}

export function processCounter(state, id, mod, value, calcOnly) {
  var keys = utils.getCounterKeys(id);
  var partUsed = 1;
  var counterUsed = 0;
  var current = state[keys.counter];

  if (current >= mod) {
    current -= mod;
    counterUsed = mod;
    // use full amount if it's available
  } else {
    partUsed = current;
    counterUsed = current;
    current = 0;
  }

  // calcuation but not updating of statistics
  if (!calcOnly) {
    state[keys.counter] = current;
    stats.addSpellStatistics(state, keys.charges, counterUsed);
  }

  return partUsed * value;
}

let VALID_TEST_DATA = [{"title":"Is Equip Proc","General-19":["ASVI","BFVI","BOIX","DS","FCVII","FCX","FOMIX","FOMVII","FOMXIII","FOMXV","FSVI","FSVII","HOM3","OS","SOFV","SOFXIII","SOFXIV","VOSIV","WOC4"],"Mage-0":[],"Wizard-0":[]},{"title":"Is Spell Proc","General-7":["AB","DRS6","FW","MR","MRR","MRRR","MRRRR"],"Mage-0":[],"Wizard-2":["AFU1","AFU2"]},{"title":"Is Focusable","General-24":["ASVI","BFVI","BOIX","DRS6","DS","FCVII","FCX","FOMIX","FOMVII","FOMXIII","FOMXV","FSVI","FSVII","FW","HOM3","MR","MRR","MRRR","MRRRR","SOFV","SOFXIII","SOFXIV","VOSIV","WOC4"],"Mage-21":["BJ","BS","CF","CR","FA","FC","FE1","FE2","FE3","FE4","FE5","FE6","FE7","FE8","FE9","RC","RS","SB","SFB","SM","SS"],"Wizard-19":["CF","CI","CS","CS2","DF","EF","ER","ES","FA","FC","FU","HC","MB","PE","PF","RC2","SV","WE","WF"]},{"title":"Is Focusable Spell Or Eqp Proc","General-24":["ASVI","BFVI","BOIX","DRS6","DS","FCVII","FCX","FOMIX","FOMVII","FOMXIII","FOMXV","FSVI","FSVII","FW","HOM3","MR","MRR","MRRR","MRRRR","SOFV","SOFXIII","SOFXIV","VOSIV","WOC4"],"Mage-0":[],"Wizard-0":[]},{"title":"Can Proc Spells Effects","General-23":["ASVI","BFVI","BOIX","DRS6","FCVII","FCX","FOMIX","FOMVII","FOMXIII","FOMXV","FSVI","FSVII","FW","HOM3","MR","MRR","MRRR","MRRRR","SOFV","SOFXIII","SOFXIV","VOSIV","WOC4"],"Mage-9":["BS","CF","CR","FC","RC","RS","SB","SM","SS"],"Wizard-16":["CF","CI","CS","CS2","DF","EF","ER","ES","FC","FU","HC","MB","PE","PF","RC2","SV"]},{"title":"Can Twincast","General-1":["DS"],"Mage-9":["BJ","BS","CF","CR","FC","RC","SB","SM","SS"],"Wizard-14":["CF","CI","CS","EF","ER","ES","FC","FU","HC","MB","PE","SV","WE","WF"]},{"title":"Can Twinproc","General-23":["ASVI","BFVI","BOIX","DRS6","FCVII","FCX","FOMIX","FOMVII","FOMXIII","FOMXV","FSVI","FSVII","FW","HOM3","MR","MRR","MRRR","MRRRR","SOFV","SOFXIII","SOFXIV","VOSIV","WOC4"],"Mage-0":[],"Wizard-0":[]},{"title":"Is Cast Detrimental","General-0":[],"Mage-11":["BJ","BS","CF","CR","FAF","FC","RC","RS","SB","SM","SS"],"Wizard-17":["CF","CI","CS","CS2","DF","EF","ER","ES","FAF","FC","FU","HC","MB","PE","PF","RC2","SV"]},{"title":"Is Cast Detrimental OR Used Ability","General-1":["DS"],"Mage-26":["BJ","BS","CF","CR","FAF","FC","FE1","FE10","FE11","FE12","FE13","FE14","FE15","FE2","FE3","FE4","FE5","FE6","FE7","FE8","FE9","RC","RS","SB","SM","SS"],"Wizard-56":["CF","CI","CS","CS2","DF","EF","ER","ES","FAF","FC","FF1","FF2","FF3","FF4","FF5","FF6","FI1","FI2","FI3","FI4","FI5","FI6","FU","FW1","FW10","FW11","FW12","FW13","FW14","FW15","FW16","FW17","FW18","FW19","FW2","FW20","FW21","FW22","FW23","FW24","FW25","FW26","FW3","FW4","FW5","FW6","FW7","FW8","FW9","HC","MB","MBRN","PE","PF","RC2","SV"]}];

export function displaySpellInfo(target) {
  $(target).css('height', '600px');
  $(target).css('overflow-y', 'auto');

  let test = $(target).find('.test-data');  
  let current = $(target).find('.current-data');  
  let list = [];
  
  list.push(getSpellSection('Is Equip Proc', isEqpProc)); 
  list.push(getSpellSection('Is Spell Proc', isSpellProc)); 
  list.push(getSpellSection('Is Focusable', (spell) => spell.isFocusable)); 
  list.push(getSpellSection('Is Focusable Spell Or Eqp Proc', (spell) => spell.isFocusable && isSpellOrEqpProc(spell))); 
  list.push(getSpellSection('Can Proc Spells Effects', canProcSpells)); 
  list.push(getSpellSection('Can Twincast', canTwincast)); 
  list.push(getSpellSection('Can Twinproc', canTwinproc)); 
  list.push(getSpellSection('Is Cast Detrimental', isCastDetSpell)); 
  list.push(getSpellSection('Is Cast Detrimental OR Used Ability', isCastDetSpellOrAbility));
  
  let foundError = false;
  let section;
  VALID_TEST_DATA.forEach((item, i) => {
    if (!foundError) {
      Object.keys(item).forEach(key => {
        if (key === 'title') {
          foundError = foundError ? foundError : item[key] !== list[i][key];
        } else {
          foundError = foundError ? foundError : item[key].length !== (list[i][key] ? list[i][key].length : -1);
          item[key].forEach(id => {
            foundError = foundError ? foundError : (list[i][key].find(x => id === x) === undefined);
          });
        }
      })
    } 
    
    if (section === undefined && foundError) {
      section = i + 1;
    }
  });
 
  if (foundError) {
    let txt = $('#myModal .modal-title').text(); 
    $('#myModal .modal-title').text(txt + ' (Error Section #' + section + ')'); 
  }
  
  //$(current).append('<pre>' + JSON.stringify(list)+ '</pre>');
  $(current).append('<pre>' + JSON.stringify(list, null, 2)+ '</pre>');
  $(test).append('<pre>' + JSON.stringify(VALID_TEST_DATA, null, 2)+ '</pre>');
}

function getSpellSection(title, f) {
  let result = { title: title };

  utils.getAllSpellData().forEach(data => {
    let filtered = Object.keys(data.spells).map(key => key).sort().filter(i => f(data.spells[i]));
    result[data.name + '-' + filtered.length] = filtered;
  });    

  return result;
}

function __getSpellSection2(title, f) {
  let html = '';

  html += '<h4>' + title + '</h4>';    
  utils.getAllSpellData().forEach(data => {
    let list = [];
    Object.keys(data.spells).forEach(key => {
      list.push({ key: key, name: data.spells[key]['name']});
    });
    
    list.sort((a, b) => a.name > b.name);
    
    let filtered = list.filter(item => f(data.spells[item.key]));
    if (filtered.length > 0) {
      html += '<table class="table table-striped table-condensed">';
      html += '<caption>' + data.name + ' Spells (' + filtered.length + ')</caption>';
      filtered.forEach(item => {
        html += '<tr>';
        ['name', 'id', 'resist', 'skill', 'level'].forEach(attr => html += '<td>' + attr + ': ' + data.spells[item.key][attr] + '</td>');
        html += '</tr>';
      });
      html += '</table>';
    }
  });
  
  return html;
}