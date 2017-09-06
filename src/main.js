// Version
VERSION = 'Version 0.80';

// Wiz Settings
ARCANE_FURY_FOCUS = 0.15;
ARCANE_FUSION_CHANCE = 0.04;
CLAW_PROC_MAGIC_CHANCE = CLAW_PROC_ICE_CHANCE = 0.05;
CLAW_PROC_FIRE_CHANCE = 0.35;
CLAW_PROC_SPECIFIC_DMG = 3469;
CLAW_PROC_ANY_CHANCE = 0.12;
CLAW_PROC_ANY_DMG = 4232;
CLAW_REFRESH_CHANCE = 0.06;
CLAW_TWINCAST_CHANCE = 0.10;
FURY_RO_DMG = FURY_ECI_DMG = FURY_DRUZ_DMG = 2500;
FURY_KERA_DMG = 1550;
FUSE_PROC_CHANCE = 0.35;
FUSE_PROC_INDIVIDUAL_SPELL_CHANCE = 0.32;
FUSE_PROC_SPELL_CHANCE = FUSE_PROC_CHANCE * FUSE_PROC_INDIVIDUAL_SPELL_CHANCE;
IMPROVED_FAMILIAR_CRIT = 0.27;
KERA_FAMILIAR_FOCUS = 0.50;
AVG_VORTEX_FOCUS = 0.75;
VORTEX_EFFECT_TIMER = 21000;
WILDMAGIC_CHAOS_CHANCE = 0.35;
WILDMAGIC_RIMEBLAST_CHANCE = 0.35;
WILDMAGIC_PURE_CHANCE = 0.30;
WIZ_INNATE_CRIT_RATE = 2;
WIZ_INNATE_CRIT_DMG = 100;
WIZ_TITLE = "EQ Wizard DPS Tool"

// Mage Settings
MAGE_INNATE_CRIT_RATE = 0;
MAGE_INNATE_CRIT_DMG = 100;
MAGE_TITLE = "EQ Mage DPS Tool"
FLAMES_POWER_TIMER = 30000;
FLAMES_POWER_FOCUS = 1.05;
FLAMES_POWER_RATE = 0.25;
FLAMES_WEAKNESS_TIMER = 15000;
FLAMES_WEAKNESS_FOCUS = -0.25;
FLAMES_WEAKNESS_RATE = 0.01;
FIREBOUND_ORB_COUNT = 10;

// ADPS Settings
AUG_AURA_PERCENT = 0.04;
ARIA_MAETANRUS_PERCENT = 0.45;
ENC_SYNERGY_PERCENT = 0.40;
SYNERGY_TIMER = 12000;
ENC_HAZY_CRIT_RATE = 1.00;
ENC_HAZY_FOCUS = 0.40;
ENC_HAZY_TIMER = 12000;
MAG_SYNERGY_PERCENT = 0.50;
NEC_SYNERGY_PERCENT = 0.15;
NILSARA_ARIA_DMG = 1638;
FW_COUNTERS = 6;
FW_TIMER = 18000;
MR_COUNTERS = 6;
MR_TIMER = 18000;
LINGERING_CRY_FOCUS = 0.08;
BLIZARD_BREATH_FOCUS = 0.055;
MALO_FOCUS = 0.055;
SEEDLINGS_FOCUS = 0.065;
TC_AURA_PERCENT = 0.11;

// Other Settings
FIZZLE_RATE = 0.005;
REFRESH_CAST_COUNT = Math.ceil(1 / CLAW_REFRESH_CHANCE);

// Import CSS
require('./css/generated/bootstrap.css');
require('./css/generated/vis-timeline-graph2d.css');
require('./css/main.css');

// Library References
var dom = require('./js/dom.js');
var utils = require('./js/utils.js');
var timeline = require('./js/timeline.js');

// Set app version
$('span.version').text(VERSION);    

// on click for changing between wiz mode and mage mode
var switchButton = $('button.switch-button');
switchButton.click(utils.switchMode);

// Handle current mode and save cookies
var urlParam = utils.getUrlParameter('class');
if (urlParam == 'mage' || (!urlParam && document.cookie == 'mode=mage')) {
  $('.wiz-only').hide();      
  MODE = 'mage';
  $('#innatCritRate').val(MAGE_INNATE_CRIT_RATE);
  $('#innatCritDmg').val(MAGE_INNATE_CRIT_DMG);
  switchButton.text('Switch to Wizard Spells');
  document.title = MAGE_TITLE;
  document.cookie = "mode=mage; expires=Fri, 31 Dec 9999 23:59:59 GMT";
} else {
  MODE = 'wiz';
  $('.mage-only').hide();
  document.title = WIZ_TITLE;
  $('#innatCritRate').val(WIZ_INNATE_CRIT_RATE);
  $('#innatCritDmg').val(WIZ_INNATE_CRIT_DMG);
  switchButton.text('Switch to Magician Spells');
  document.cookie = "mode=wiz; expires=Fri, 31 Dec 9999 23:59:59 GMT";
}
            
// Creates the dropdown menu sections DPS AAs, Focus AAs, and Equipment
var settingsTemplate = Handlebars.compile($("#settings-dropdown-item-template").html());
$('#basicDmgFocusSection').after(settingsTemplate(utils.readDmgFocusContext()));
$('#spellFocusAASection').after(settingsTemplate(utils.readSpellFocusContext()));
$('#mainDPSAASection').after(settingsTemplate(utils.readMainContext()));

// Create Abilities In Use section
var rateTemplate = Handlebars.compile($('#additional-modifiers-synergy-template').html());
var sectionTemplate = Handlebars.compile($("#additional-modifiers-button-template").html());
$(utils.readAdditionalModifiers()).each(function(i, item) {
  var section = item.section;
  var sectionRef = $('#' + item.id);      
  var data = [];
  
  $(section.displayList).each(function(i, id) {
    var item = section.options[id];
    var isChecked = item.enabled ? 'checked' : '';
    if (!item.mode || (item.mode && item.mode == MODE)) {
      data.push({ id: id, isChecked: isChecked, title: item.title });
    }
  });
  
  sectionRef.append(sectionTemplate({ data: data }));
  sectionRef.find('input').click(function(e) {
      timeline.callUpdateSpellChart();
  });
  
  $(section.displayList).each(function(i, id) {
    var item = section.options[id];
    if (item.hasInput) {
      $('#' + id).after(rateTemplate({
        inputId: id + 'Rate',
        tooltip: item.tooltip,
        defaultTime: item.defaultTime
      }));
      
      $('#' + id + 'Rate').change(function() {
        timeline.callUpdateSpellChart();
      });
    }
  });
});

// Creates Add/Remove ADPS Buttons
var adpsOptions = [];
$(utils.readAdpsConfig('displayList')).each(function(index, item) {   
  var adpsItem = utils.readAdpsOption(item);
  if (!adpsItem.class || (adpsItem.class && adpsItem.class == MODE)) {
    adpsOptions.push(adpsItem);
  }      
});
var adpsButtonTemplate = Handlebars.compile($("#spell-adps-button-template").html());
$('#spellButtons').append(adpsButtonTemplate({ class: 'adps', title: 'Add ADPS', disabled: "", data: adpsOptions }));
$('#spellButtons').append(adpsButtonTemplate({ class: 'remove-adps', title: 'Remove ADPS', disabled: "disabled", data: adpsOptions }));

// Listen for Add ADPS click events to add item to timeline
$('#spellButtons div.adps li > a').click(function() {
  if ($(this).hasClass('disabled')) return;
  var id = $(this).data('value');
  timeline.createAdpsItem(utils.readAdpsOption(id));
  $(this).parent().addClass('disabled');
  $('#spellButtons div.remove-adps li > a[data-value="' + id + '"]').parent().removeClass('disabled');      
});

// Listen for Remove ADPS click events to remove item from timeline
$('#spellButtons div.remove-adps li > a').click(function() {
  if ($(this).hasClass('disabled')) return;
  var id = $(this).data('value');
  timeline.removeAdpsItemById(id);
  $(this).parent().addClass('disabled');
  $('#spellButtons div.adps li > a[data-value="' + id + '"]').parent().removeClass('disabled');
});

// Creates the 6 Spell selection buttons
var spellData = [];
$(utils.readSpellList()).each(function(index, item) {
  spellData.push({ value: item.id, desc: item.name });  
});
var spellButtonTemplate = Handlebars.compile($("#spell-selection-button-template").html());
utils.appendHtml($('#spellButtons'), spellButtonTemplate({ data: spellData }), 6);
      
// Listen for spell selection changes to update button text and color and update spell chart
$('#spellButtons div.spell').each(function(b1, group) {
  var button = $(group).find('button');
  $(group).find('li > a').click(function(e) {
    var selected = $(e.currentTarget);
    button.data('value', selected.data('value'));
    
    if (selected.data('value') == 'NONE') {
      button.find('span.desc').text("Choose Spell");
      button.removeClass('btn-default');
      button.addClass('btn-warning');
    } else {
      button.find('span.desc').text(selected.text());
      button.removeClass('btn-warning');
      button.addClass('btn-default');
    }
    
    timeline.callUpdateSpellChart();
  });
});

// Listen for changes to dropdown options that require updating the spell chart
// If certain items are updated then the crit rates are reloaded as well
$('li.dropdown').each(function(i1, dropdown) {
  var itemDesc = $(dropdown).find('a.dropdown-toggle');
  $(dropdown).find('ul.dropdown-menu li a').each(function(i2, item) {
      $(item).click(function(e) {
          var selected = $(e.currentTarget);
          itemDesc.find('span.desc').text(selected.text());
          itemDesc.data('value', selected.data('value'));
          
          if ($(dropdown).hasClass('aa-fury-of-magic') ||
            $(dropdown).hasClass('aa-destructive-fury') ||
            $(dropdown).hasClass('spell-pet-focus') ||
            $(dropdown).hasClass('aa-don')) {
            setTimeout(timeline.loadRates, 5);
          }
          
          timeline.callUpdateSpellChart();
      });
  });
});

// Listener for menu button click to hide/show the dropdown menus
$('.menu-button').click(function(item) {
  var menu = $('.nav-side-menu');
  if (menu.is(':hidden')) {
    menu.show();
    $('div.container').removeClass('full');
    $('div.container').addClass('shared');
  } else {
    menu.hide();
    $('div.container').removeClass('shared');
    $('div.container').addClass('full');
  }
});    

// Listen to configuration changes that need to update the spell chart
$('#configurationSection input').change(function() {
  timeline.callUpdateSpellChart();
});

// Listen to configuration changes that need to update the spell chart and update crit rates
$('#spellTimeRange, #customSettingsSection input').change(function() {
  setTimeout(timeline.loadRates, 5);
  timeline.callUpdateSpellChart();
});

// Sets listener on each collapsable dropdown menu to handle collapse/expand events
$('.custom-collapse').each(function(i, p) {
  $(p).click(function() {
    utils.collapseMenu(p);
  });
});

// Set default collapse state
utils.collapseMenu($('#additionalModifiersDebuffsSection .custom-collapse'));
utils.collapseMenu($('#additionalModifiersSection .custom-collapse'));
utils.collapseMenu($('#basicDmgFocusSection'));
utils.collapseMenu($('#spellFocusAASection'));
utils.collapseMenu($('#mainDPSAASection'));
utils.collapseMenu($('#customSettingsSection .custom-collapse'));

// Init timeline stuff and load the chart
timeline.init();
timeline.loadRates();
timeline.updateSpellChart();