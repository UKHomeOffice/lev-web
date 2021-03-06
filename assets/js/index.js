'use strict';

require('./details.polyfill')();
var saveAs = require('file-saver').saveAs;

function getAuditData() {
  return Array.prototype.map.call(
    document.querySelectorAll('table.audit tr'),
    function parseRows(tr) {
      return Array.prototype.map.call(
        tr.children,
        function parseCells(l) {
          return l.textContent;
        }
      ).join(',');
    }
  ).join('\n');
}

function saveData(event) {
  if (event.type === 'click' ||
    (event.type === 'keydown' && (event.code === 'Enter' || event.key === 'Enter' || event.keyCode === 13))) {
    event.preventDefault();
    saveAs(
      new Blob([getAuditData()], { type: 'text/plain;charset=' + document.characterSet }),
      document.getElementById('save').download
    );
  }
}

var save = document.getElementById('save');
if (save) {
  save.addEventListener('click', saveData, false);
  save.addEventListener('keydown', saveData, false);
}

var fromDate = document.getElementById('from');
if (fromDate) {
  fromDate.focus();
}

var sysNum = document.getElementById('system-number');
if (sysNum) {
  if (document.querySelector('div.validation-summary')) {
    var fieldName =
      document.querySelector('div.validation-summary li > a').href.replace(/^.*#(.+)-group$/, '$1');
    document.querySelector('input[name="' + fieldName + '"]').focus();
  } else {
    sysNum.focus();
  }
}

module.exports = {
  getAuditData: getAuditData,
  saveData: saveData
};
