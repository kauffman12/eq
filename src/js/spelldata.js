var general = require('./spells/spelldata.general.js');

module.exports = {
  get: function(id) {
    var result = general[id];
    
    if (!result) {
      if (MODE == 'wiz') {
        result = require('./spells/spelldata.wiz.js')[id];
      } else if (MODE == 'mage') {
        result = require('./spells/spelldata.mage.js')[id];        
      }
    }
    
    return result;
  }
}