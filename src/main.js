// Import CSS
import './css/generated/bootstrap.css';
import './css/generated/vis-timeline-graph2d.css';
import './css/main.css';

// Library References
import {globals as G} from './js/settings.js';
import * as dom from './js/dom.js';
import * as dmgU from './js/damage.utils.js';
import * as utils from './js/utils.js';
import * as timeline from './js/timeline.js';

// Set app version
$('span.version').text(G.VERSION);    

// on click for changing between wiz mode and mage mode
let switchButton = $('button.switch-button');
switchButton.click(utils.switchMode);

// Handle current mode and save cookies
let urlParam = utils.getUrlParameter('class');
if (urlParam == 'mage' || (!urlParam && document.cookie == 'mode=mage')) {
  $('.wiz-only').hide();      
  G.MODE = 'mage';
  $('#innatCritRate').val(dmgU.MAGE_INNATE_CRIT_RATE);
  $('#innatCritDmg').val(dmgU.MAGE_INNATE_CRIT_DMG);
  switchButton.text('Switch to Wizard Spells');
  document.title = G.MAGE_TITLE;
  document.cookie = "mode=mage; expires=Fri, 31 Dec 9999 23:59:59 GMT";
} else {
  G.MODE = 'wiz';
  $('.mage-only').hide();
  document.title = G.WIZ_TITLE;
  $('#innatCritRate').val(dmgU.WIZ_INNATE_CRIT_RATE);
  $('#innatCritDmg').val(dmgU.WIZ_INNATE_CRIT_DMG);
  switchButton.text('Switch to Magician Spells');
  document.cookie = "mode=wiz; expires=Fri, 31 Dec 9999 23:59:59 GMT";
}
            
// Creates the dropdown menu sections DPS AAs, Focus AAs, and Equipment
let settingsTemplate = Handlebars.compile($("#settings-dropdown-item-template").html());
$('#basicDmgFocusSection').after(settingsTemplate({context: utils.readDmgFocusContext()}));
$('#spellFocusAASection').after(settingsTemplate({context: utils.readSpellFocusContext()}));
$('#mainDPSAASection').after(settingsTemplate({context: utils.readMainContext()}));

// Create Abilities In Use section
let rateTemplate = Handlebars.compile($('#additional-modifiers-synergy-template').html());
let sectionTemplate = Handlebars.compile($("#additional-modifiers-button-template").html());
$(utils.readAdditionalModifiers()).each(function(i, item) {
  let section = item.section;
  let sectionRef = $('#' + item.id);      
  let data = [];
  
  $(section.displayList).each(function(i, id) {
    let item = section.options[id];
    let isChecked = item.enabled ? 'checked' : '';
    if (!item.mode || (item.mode && item.mode == G.MODE)) {
      data.push({ id: id, isChecked: isChecked, title: item.title });
    }
  });
  
  sectionRef.append(sectionTemplate({ data: data }));
  sectionRef.find('input').click(function(e) {
      timeline.callUpdateSpellChart();
  });
  
  $(section.displayList).each(function(i, id) {
    let item = section.options[id];
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
let adpsOptions = [];
$(utils.readAdpsConfig('displayList')).each(function(index, item) {   
  let adpsItem = utils.readAdpsOption(item);
  if (!adpsItem.class || (adpsItem.class && adpsItem.class == G.MODE)) {
    adpsOptions.push(adpsItem);
  }      
});
let adpsButtonTemplate = Handlebars.compile($("#spell-adps-button-template").html());
$('#spellButtons').append(adpsButtonTemplate({ class: 'adps', title: 'Add ADPS', disabled: "", data: adpsOptions }));
$('#spellButtons').append(adpsButtonTemplate({ class: 'remove-adps', title: 'Remove ADPS', disabled: "disabled", data: adpsOptions }));

// Listen for Add ADPS click events to add item to timeline
$('#spellButtons div.adps li > a').click(function() {
  if ($(this).hasClass('disabled')) return;
  let id = $(this).data('value');
  timeline.createAdpsItem(utils.readAdpsOption(id));
  $(this).parent().addClass('disabled');
  $('#spellButtons div.remove-adps li > a[data-value="' + id + '"]').parent().removeClass('disabled');      
});

// Listen for Remove ADPS click events to remove item from timeline
$('#spellButtons div.remove-adps li > a').click(function() {
  if ($(this).hasClass('disabled')) return;
  let id = $(this).data('value');
  timeline.removeAdpsItemById(id);
  $(this).parent().addClass('disabled');
  $('#spellButtons div.adps li > a[data-value="' + id + '"]').parent().removeClass('disabled');
});

// Creates the 6 Spell selection buttons
let spellData = [];
$(utils.readSpellList()).each(function(index, item) {
  spellData.push({ value: item.id, desc: item.name });  
});
let spellButtonTemplate = Handlebars.compile($("#spell-selection-button-template").html());
utils.appendHtml($('#spellButtons'), spellButtonTemplate({ data: spellData }), 6);
      
// Listen for spell selection changes to update button text and color and update spell chart
$('#spellButtons div.spell').each(function(b1, group) {
  let button = $(group).find('button');
  $(group).find('li > a').click(function(e) {
    let selected = $(e.currentTarget);
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
  let itemDesc = $(dropdown).find('a.dropdown-toggle');
  $(dropdown).find('ul.dropdown-menu li a').each(function(i2, item) {
      $(item).click(function(e) {
          let selected = $(e.currentTarget);
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
  let menu = $('.nav-side-menu');
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