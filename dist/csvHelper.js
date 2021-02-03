"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CsvHelper = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _fs = _interopRequireDefault(require("fs"));

var _neatCsv = _interopRequireDefault(require("neat-csv"));

var _lodash = require("lodash");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var CsvHelper = /*#__PURE__*/function () {
  function CsvHelper() {
    (0, _classCallCheck2.default)(this, CsvHelper);
  }

  (0, _createClass2.default)(CsvHelper, [{
    key: "getAllegationTypes",
    value: function () {
      var _getAllegationTypes = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(csvPath) {
        var csv, results, allegationTypes, _iterator, _step, result;

        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                csv = _fs.default.readFileSync(csvPath);
                _context.next = 3;
                return (0, _neatCsv.default)(csv);

              case 3:
                results = _context.sent;
                allegationTypes = [];
                _iterator = _createForOfIteratorHelper(results);

                try {
                  for (_iterator.s(); !(_step = _iterator.n()).done;) {
                    result = _step.value;
                    allegationTypes.push(result['Allegation type']);
                  }
                } catch (err) {
                  _iterator.e(err);
                } finally {
                  _iterator.f();
                }

                return _context.abrupt("return", allegationTypes);

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function getAllegationTypes(_x) {
        return _getAllegationTypes.apply(this, arguments);
      }

      return getAllegationTypes;
    }()
  }, {
    key: "getRankAbbrevs",
    value: function () {
      var _getRankAbbrevs = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(csvPath) {
        var csv, results, rankAbbrevs;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                csv = _fs.default.readFileSync(csvPath);
                _context2.next = 3;
                return (0, _neatCsv.default)(csv);

              case 3:
                results = _context2.sent;
                rankAbbrevs = (0, _lodash.reduce)(results, function (accumulator, value) {
                  return _objectSpread(_objectSpread({}, accumulator), {}, (0, _defineProperty2.default)({}, value.Abbreviation, value.Rank));
                }, {});
                return _context2.abrupt("return", rankAbbrevs);

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function getRankAbbrevs(_x2) {
        return _getRankAbbrevs.apply(this, arguments);
      }

      return getRankAbbrevs;
    }()
  }, {
    key: "getCommandAbbrevs",
    value: function () {
      var _getCommandAbbrevs = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(csvPath) {
        var csv, commandAbbrevs;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                csv = _fs.default.readFileSync(csvPath);
                _context3.next = 3;
                return (0, _neatCsv.default)(csv);

              case 3:
                commandAbbrevs = _context3.sent;
                return _context3.abrupt("return", commandAbbrevs);

              case 5:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function getCommandAbbrevs(_x3) {
        return _getCommandAbbrevs.apply(this, arguments);
      }

      return getCommandAbbrevs;
    }()
  }]);
  return CsvHelper;
}();

exports.CsvHelper = CsvHelper;