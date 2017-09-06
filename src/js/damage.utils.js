var dom = require('./dom.js');
var stats = require('./stats.js');
var utils = require('./utils.js');

var getMultiplier = function(castTime) {
  var multiplier = 0.25;

  if(castTime >= 2.5 && castTime <= 7) {
    multiplier = 0.167 * (castTime - 1);
  } else if(castTime > 7) {
    multiplier = 1 * castTime / 7;
  }

  return multiplier;
};

var self = module.exports = {
  applyDichoBug: function(state, id) {
    var keys = utils.getCounterKeys(id);
    // special case for Dicho to eat extra counter
    if (state.spell.id == 'DF') {
      if (state[keys.counter] >= 1) {
        state[keys.counter]--;
        stats.addSpellStatistics(state, keys.charges, 1);
      } else {
        stats.addSpellStatistics(state, keys.charges, state[keys.counter]);
        state[keys.counter] = 0;
      }
    }
  },
  applyPostSpellProcs: function(state, mod) {
    var update = mod ? mod : 1;

    switch(state.spell.id) {
      // Claw of the Flameweaver + Mage Chaotic Fire
      case 'CF':
        // Claw only
        if (MODE == 'wiz') {
          utils.initNumberProperties(state, ['clawCounter']);
          // Number of claws cast used when handling syllables
          state.clawCounter += update;
        } else if (MODE == 'mage') {
          self.initFlames(state, update);
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
        $(state.spells).each(function(j, t) {
          var theSpell = utils.getSpellData(t);
          var last = state.lastCastMap[theSpell.timer];
          var count = Math.floor(state.clawRefreshCount);
          if (last && last > 0 && (((REFRESH_CAST_COUNT - count + dom.getRefreshOffsetValue())) % REFRESH_CAST_COUNT == 0)) {
            state.lastCastMap[theSpell.timer] = 0;
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
        if (MODE == 'mage') {
          self.initFlames(state, update);
        }
        break;
    }
  },
  applyPreSpellProcs: function(state, twincastChance) {
    // Check for effects to cancel
    utils.checkSimpleTimer(state, state.workingTime, 'VFX');
    utils.checkSimpleTimer(state, state.workingTime, 'WSYN');
    utils.checkSimpleTimer(state, state.workingTime, 'FPWR');
    utils.checkTimerList(state, state.workingTime, 'clawTcProcRate', 'clawTcTimers');
    utils.checkTimerList(state, state.workingTime, 'flamesWeaknessCounter', 'flamesWeaknessTimers');

    // Update Storm of Many damage based on selected value
    // Start handling spell recast timer mods, etc here instead of in run or
    // using origRecastTimer or anything like that
    switch(state.spell.id) {
      case 'SM':
        state.spell.baseDmg = state.spell['baseDmg' + dom.getStormOfManyCountValue()];
        break;
    }
  },
  getFickleRate: function(rate) {
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
  },
  getProcRate: function(spell, proc) {
    // spell being cast vs spell id of what is being proc'd
    return (proc.base1) ? proc.base1 / 100 * self.getNormalizer(spell) : 1.0;
  },
  getSpellDamage: function(spell) {
    // dicho/fuse needs to use an alternative time since it's really 2 spell casts
    // that get applied differently depending on what we're looking for
    var recastTime = spell.recastTime2 ? spell.recastTime2 : spell.recastTime;

    var totalCastTime = spell.origCastTime +
      ((recastTime > spell.lockoutTime) ? recastTime : spell.lockoutTime);

    var multiplier = getMultiplier(totalCastTime);
    return Math.trunc(utils.asDecimal32Precision(dom.getSpellDamageValue() * multiplier));
  },
  getNormalizer: function(spell) {
    return getMultiplier(spell.origCastTime);
  },
  initFlames: function(state, update) {
    utils.initNumberProperties(state, ['flamesWeaknessCounter']);
    utils.initListProperties(state, ['flamesWeaknessTimers']);
    state.fpwrExpireTime = state.workingTime + FLAMES_POWER_TIMER;
    state.fpwrCounter = (dom.getFlamesOfPowerValue() == 4) ? 2.0 : 1.0;

    // Count the number of potential weaknesses applied sort of like Claw
    state.flamesWeaknessCounter += update;
    state.flamesWeaknessTimers.push(utils.createTimer(state.workingTime + FLAMES_WEAKNESS_TIMER, function(value) {
      return value - update;
    }));
  },
  passRequirements: function(reqs, state) {
    var spell = state.spell;

    if (reqs) {
      if (reqs.minManaCost && spell.manaCost < reqs.minManaCost) {
        return false;
      }
      else if (reqs.minLevel && spell.level < reqs.minlevel) {
        return false;
      }
      else if (reqs.maxLevel && spell.level > reqs.maxLevel) {
        return false;
      }
      else if (reqs.minCastTime && spell.origCastTime < reqs.minCastTime) {
        return false;
      }
      else if (reqs.spellCastOnly && (!(spell.skill == 24 && spell.level < 250) || spell.discRefresh)) {
        return false;
      }
      else if (reqs.spellCastOrEqpProc && (spell.skill != 52 && (!(spell.skill == 24 && spell.level < 250) || spell.discRefresh))) {
        return false
      }
      else if (reqs.resists && $.inArray(spell.resist, reqs.resists) < 0) {
        return false;
     }
    }
    return true;
  },
  processCounter: function(state, id, mod, value, calcOnly) {
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
};