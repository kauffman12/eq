// Import CSS
import './css/generated/bootstrap.css';
import './css/generated/vis-timeline-graph2d.css';
import 'bootstrap-multiselect/dist/css/bootstrap-multiselect.css';
import './css/main.css';
import testData from './data/spell-validation.txt';

// Library References
import {globals as G} from './js/settings.js';
import * as abilities from './js/abilities.js';
import * as dom from './js/dom.js';
import * as dmgU from './js/damage.utils.js';
import * as utils from './js/utils.js';
import * as timeline from './js/timeline.js';

function buildSpellList() {
  // cleanup old version
  $('#spellButtons div.spell').remove();

  // Creates the pell selection buttons
  let spellData = [];
  utils.readSpellList().forEach(item => { spellData.push({ value: item.id, desc: item.name }); });

  let spellButtonTemplate = Handlebars.compile($("#spell-selection-button-template").html());
  utils.appendHtml($('#spellButtons'), spellButtonTemplate({ data: spellData }), 8);

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
}

// Set app version
$('span.version').text(G.VERSION);

// on click for changing between wiz mode and mage mode
let switchModeButton = $('div.mode-chooser button.switch-button');
$('div.mode-chooser li > a').click(e => {
  let selected = $(e.currentTarget);
  let mode = selected.attr('data-value');
  switchModeButton.find('span.desc').text(utils.CLASS_TO_NAME[mode]);
  utils.switchMode(mode);
});

// on click for changing spell rank
let switchRankButton = $('div.rank-chooser button.switch-button');
$('div.rank-chooser li > a').click(e => {
  let selected = $(e.currentTarget);
  let rank = selected.attr('data-value');
  switchRankButton.data('value', rank);
  switchRankButton.find('span.desc').text(selected.text());
 
  // save previous values
  let prevValues = [];
  $('#spellButtons div.spell button').each((i, b) => prevValues.push($(b).data('value')));

  // set rank and rebuild spell dropdowns
  utils.setRank(rank);
  buildSpellList();

  // reset values
  $('#spellButtons div.spell button').each((i, b) => {
    if (prevValues[i] != 'NONE') {
      $(b).next().find('a[data-value="' + prevValues[i] + '"]').trigger('click');
    }
  });

  timeline.callUpdateSpellChart();
});

// try to find mode set in url then in cookie then default to wiz
let mode = utils.getUrlParameter('class') || document.cookie.split('=')[1];
mode = (!mode || !G.CLASSES[mode]) ? 'wiz' : mode;

$('.' + G.CLASSES[mode].css).removeClass(G.CLASSES[mode].css);
document.title = G.CLASSES[mode].title;
$('#innatCritRate').val(dmgU[G.CLASSES[mode].critRate]);
$('#innatCritDmg').val(dmgU[G.CLASSES[mode].critDmg]);
switchModeButton.find('span.desc').text(utils.CLASS_TO_NAME[mode]);
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

// build spell list
buildSpellList();

// Listen for changes to dropdown options that require updating the spell chart
// If certain items are updated then the crit rates are reloaded as well
$('li.dropdown').each((i1, dropdown) => {
  let itemDesc = $(dropdown).find('a.dropdown-toggle');
  $(dropdown).find('ul.dropdown-menu li a').each((i2, item) => {
      $(item).click(e => {
          let selected = $(e.currentTarget);
          itemDesc.find('span.desc').text(selected.text());
          itemDesc.data('value', selected.data('value'));
          
          if ($(dropdown).hasClass('aa-furymagic') ||
            $(dropdown).hasClass('aa-destfury') ||
            $(dropdown).hasClass('spell-pet-focus') ||
            $(dropdown).hasClass('aa-don')) {
          }
          
          timeline.callUpdateSpellChart(true);
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
  timeline.callUpdateSpellChart(true);
});

// Sets listener on each collapsable dropdown menu to handle collapse/expand events
$('.custom-collapse').each((i, p) => {
  $(p).click(() => { utils.collapseMenu(p) });
});

$('#myModal').on('shown.bs.modal', () => {
  $.get(testData, (data) => dmgU.displaySpellInfo($('#myModal .modal-body'), data.split(/\r?\n/)));
})

$('#pageLink').on('click', () => {
  let inputs = '';
  $('input:visible').not(':input[type=checkbox]').each((i, el) => {
    let id = $(el).attr('id');
    // dont save the custom adps settings
    if (id !== undefined && !$(el).hasClass('custom-values')) {
      inputs += id + '+' + $(el).val() + ',';
    }
  });

  let checkboxes = '';
  $('input[type=checkbox]').each((i, el) => {
    let id = $(el).attr('id') || $(el).val();
    checkboxes += id + '+' + $(el).is(':checked') + ',';
  });

  let buttons = '';
  $('button:visible').each((i, el) => {
    let id = $(el).attr('id');
    if (id !== undefined) {
      buttons += id + '+' + $(el).data('value') + ',';
    }
  });

  let options = '';
  $('a.dropdown-toggle').each((i, el) => {
    let id = $(el).attr('id');
    if (id !== undefined) {
      options += id + '+' + $(el).data('value') + ',';
    }
  });

  let appUrl = utils.getAppURL() + '&settings=' + inputs + checkboxes + buttons + options;

  let notify = $.notify({ 
    message: '<strong>creating link</strong>', 
    icon: 'glyphicon glyphicon-copy', 
    target: '_blank'
   },
   {
     type: 'info',
     delay: 0,
     offset: { x: 450, y: 10 },
     placement: { align: 'left' }
   });

   $.ajax({
     type: 'post',
     url: 'https://www.googleapis.com/urlshortener/v1/url?key=' + 'AIzaSyAO8t0SjxrPe7DYmKKDJS3FkoziaZ7F1Fg',
     data: JSON.stringify({'longUrl': appUrl}),
     contentType: "application/json; charset=utf-8",
     traditional: true,
     async: true,
     success: (data) => { 
       notify.update('message', '<strong>' + data.id + '</strong>');
       let icon = $('div.alert span.glyphicon-copy');
       icon.css('cursor', 'pointer');
       icon.click(e => { utils.copyToClipboard(data.id); });
     }
   });

});

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

// Check for application settings
let settings = utils.getUrlParameter('settings');
if (settings) {
  settings.split(',').forEach(s => {
    let values = s.split('+');
    if (values.length > 0 && values[0]) {
      let $el = $('#' + values[0]);
      if ($el.length > 0) {
        if ($el.is('a')) {
          $el.next().find('a[data-value="' + values[1] + '"]').trigger('click');
        } else if ($el.attr('type') === 'checkbox') {
         if (values[1] === 'true') {
           $el.trigger('click');
         } 
        } else if($el.attr('type') === 'button') {
          $el.next().find('a[data-value="' + values[1] + '"]').trigger('click');
        } else {
          $el.val(values[1]);
        }
      } else {
        let $checkbox = $('input[type=checkbox][value=' + values[0] + ']');
        if ($checkbox.length > 0) {
           if (values[1] === 'true') {
             $checkbox.trigger('click');
           }
        }
      }
    }
  });
}

timeline.updateSpellChart();