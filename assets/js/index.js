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

document.getElementById('save').addEventListener('click', saveData, false);
document.getElementById('save').addEventListener('keydown', saveData, false);

module.exports = {
  getAuditData: getAuditData,
  saveData: saveData
};
