"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var fs = require('fs');

var neatCsv = require('neat-csv');

var createWriter = require('csv-writer').createObjectCsvWriter;

var writer = createWriter({
  path: '../../ccrb_data/command_abrevs_cleaned.csv',
  header: [{
    id: 'Abbreviation',
    title: 'Abbreviation'
  }, {
    id: 'Command Name',
    title: 'Command Name'
  }]
});
var commandCsv = '../../ccrb_data/command_abrevs_corrected.csv';

function clean(array) {
  var _iterator = _createForOfIteratorHelper(array),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var item = _step.value;
      var match = item.Abbreviation.match(/^(\d+)\s(?:(?:PCT)|(?:DET))$/);

      if (match) {
        var n = match[1];
        var a = item.Abbreviation;
        var c = item['Command Name'];
        var commandNameNumber = c.match(/^(\d+)\s/)[1];

        if (n != commandNameNumber) {
          item['Command Name'] = "".concat(n, " Precinct");
        }
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  writer.writeRecords(array).then(function () {
    console.log('...done');
  });
  return array;
}

function getCommandAbbrevs(_x) {
  return _getCommandAbbrevs.apply(this, arguments);
}

function _getCommandAbbrevs() {
  _getCommandAbbrevs = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(csvPath) {
    var csv, commandAbbrevs;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            csv = fs.readFileSync(csvPath);
            _context.next = 3;
            return neatCsv(csv);

          case 3:
            commandAbbrevs = _context.sent;
            clean(commandAbbrevs);
            return _context.abrupt("return", commandAbbrevs);

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _getCommandAbbrevs.apply(this, arguments);
}

getCommandAbbrevs(commandCsv);