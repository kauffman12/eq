// Import CSS
import './css/generated/bootstrap.css';
import './css/generated/vis-timeline-graph2d.css';
import 'bootstrap-multiselect/dist/css/bootstrap-multiselect.css';
import './css/main.css';
import testData from './data/spell-validation.json';

// Library References
import {globals as G} from './js/settings.js';
import * as abilities from './js/abilities.js';
import * as dom from './js/dom.js';
import * as dmgU from './js/damage.utils.js';
import * as utils from './js/utils.js';
import * as timeline from './js/timeline.js';

// Set app version
$('span.version').text(G.VERSION);

// on click for changing between wiz mode and mage mode
let switchButton = $('button.switch-button');
switchButton.click(utils.switchMode);

// try to find mode set in url then in cookie then default to wiz
let mode = utils.getUrlParameter('class') || document.cookie.split('=')[1];
mode = (!mode || !G.CLASSES[mode]) ? 'wiz' : mode;

$('.' + G.CLASSES[mode].css).removeClass(G.CLASSES[mode].css);
document.title = G.CLASSES[mode].title;
$('#innatCritRate').val(dmgU[G.CLASSES[mode].critRate]);
$('#innatCritDmg').val(dmgU[G.CLASSES[mode].critDmg]);
switchButton.text('Switch to ' + G.CLASSES[mode].switchTo + ' Spells');
document.cookie = 'mode=' + mode + '; expires=Fri, 31 Dec 9999 23:59:59 GMT';
G.MODE = mode;
            
// Creates the dropdown menu sections DPS AAs, Focus AAs, and Equipment
let settingsTemplate = Handlebars.compile($("#settings-dropdown-item-template").html());
$('#basicDmgFocusSection').after(settingsTemplate({context: utils.readDmgFocusContext()}));
$('#spellFocusAASection').after(settingsTemplate({context: utils.readSpellFocusContext()}));
$('#mainDPSAASection').after(settingsTemplate({context: utils.readMainContext()}));

// Create Abilities In Use section
let rateTemplate = Handlebars.compile($('#additional-modifiers-synergy-template').html());
let sectionTemplate = Handlebars.compile($("#abilities-input-template").html());

let abilitiesSection = $('#abilitiesSection');
let aurasSection = $('#aurasSection');
let debuffsSection = $('#debuffsSection');
let synergySection = $('#synergySection');
let aList = [];
let dList = [];
let sList = [];
let gList = [];
let aInputRatesList = [];

abilities.getAbilityList(true).forEach(ability => {
  let item = {id: ability.id, aClass: utils.toUpper(ability.class || ''), name: ability.name};

  if (ability.debuff) {
    dList.push(item);
  } else if (ability.repeatEvery > -1) {
    sList.push(item);
  } else if (ability.refreshTime > 0 && !ability.manuallyActivated) {
    gList.push(item);
  } else {
    aList.push(item);
  }

  if (ability.repeatEvery > -1) {
    aInputRatesList.push(ability);
  }
});

abilitiesSection.append(sectionTemplate({ data: aList }));
abilitiesSection.find('input').click((e) => { timeline.callUpdateSpellChart() });
aurasSection.append(sectionTemplate({ data: gList }));
aurasSection.find('input').click((e) => { timeline.callUpdateSpellChart() });
debuffsSection.append(sectionTemplate({ data: dList }));
debuffsSection.find('input').click((e) => { timeline.callUpdateSpellChart() });
synergySection.append(sectionTemplate({ data: sList }));
synergySection.find('input').click((e) => { timeline.callUpdateSpellChart() });

aInputRatesList.forEach(ability => {
  $('#' + ability.id).after(rateTemplate({
    inputId: ability.id + 'Rate',
    tooltip: ability.tooltip,
    defaultTime: ability.repeatEvery / 1000
  }));

  $('#' + ability.id + 'Rate').change(() => { timeline.callUpdateSpellChart() });  
});

let adpsOptions = [];
let classMap = new Map();
abilities.getAbilityList(false).forEach(ability => {
  let aClass = (G.MODE !== ability.class) ? utils.CLASS_TO_NAME[ability.class] || '' : '';
  if (!classMap.has(aClass)) {
    let list = [];
    classMap.set(aClass, list);
    adpsOptions.push({group: aClass, adps: list});
  }

  classMap.get(aClass).push({id: ability.id, name: ability.name});
});

let adpsButtonTemplate = Handlebars.compile($('#spell-adps-dropdown-template').html());
$('#spellButtons').append(adpsButtonTemplate({ title: 'Add ADPS', data: adpsOptions }));
$('#adps-dropdown').multiselect({
  buttonText: () => 'Select ADPS',
  buttonClass: 'btn btn-primary btn-xs',
  onChange: (opt, checked, sel) => {
    if (checked) {
      timeline.createAdpsItem($(opt).val());
    } else {
      timeline.removeAdpsItem($(opt).val());
    }
  },
  onDropdownHide: () => timeline.resume(),
  onDropdownShow: () => timeline.quiet()
});

// Creates the 6 Spell selection buttons
let spellData = [];
utils.readSpellList().forEach(item => { spellData.push({ value: item.id, desc: item.name }); });

let spellButtonTemplate = Handlebars.compile($("#spell-selection-button-template").html());
utils.appendHtml($('#spellButtons'), spellButtonTemplate({ data: spellData }), 6);
      
// Listen for spell selection changes to update button text and color and update spell chart
$('#spellButtons div.spell').each((b1, group) => {
  let button = $(group).find('button');
  $(group).find('li > a').click(e => {
    let selected = $(e.currentTarget);
    button.data('value', selected.data('value'));
    
    if (selected.data('value') === 'NONE') {
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
$('li.dropdown').each((i1, dropdown) => {
  let itemDesc = $(dropdown).find('a.dropdown-toggle');
  $(dropdown).find('ul.dropdown-menu li a').each((i2, item) => {
      $(item).click(e => {
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
$('.menu-button').click(item => {
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
$('#configurationSection input').change(() => { timeline.callUpdateSpellChart() });

// Listen to configuration changes that need to update the spell chart and update crit rates
$('#spellTimeRange, #customSettingsSection input').change(() => {
  setTimeout(timeline.loadRates, 5);
  timeline.callUpdateSpellChart();
});

// Sets listener on each collapsable dropdown menu to handle collapse/expand events
$('.custom-collapse').each((i, p) => {
  $(p).click(() => { utils.collapseMenu(p) });
});

$('#myModal').on('shown.bs.modal', () => {
  $.get(testData, (data) => dmgU.displaySpellInfo($('#myModal .modal-body'), data));
})

// Set default collapse state
utils.collapseMenu($('#synergySection .custom-collapse'));
utils.collapseMenu($('#debuffsSection .custom-collapse'));
utils.collapseMenu($('#aurasSection .custom-collapse'));
utils.collapseMenu($('#abilitiesSection .custom-collapse'));
utils.collapseMenu($('#basicDmgFocusSection'));
utils.collapseMenu($('#spellFocusAASection'));
utils.collapseMenu($('#mainDPSAASection'));
utils.collapseMenu($('#customSettingsSection .custom-collapse'));
utils.collapseMenu($('#testSection .custom-collapse'));

// Init timeline stuff and load the chart
timeline.init();
timeline.loadRates();
timeline.updateSpellChart();