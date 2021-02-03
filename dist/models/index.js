"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Models = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _sqlite = require("sqlite");

var _sqlite2 = _interopRequireDefault(require("sqlite3"));

var _fs = _interopRequireDefault(require("fs"));

var _neatCsv = _interopRequireDefault(require("neat-csv"));

var _precincts = require("./precincts");

var _cops = require("./cops");

var _complaints = require("./complaints");

var _command_units = require("./command_units");

var _allegations = require("./allegations");

var _cop_at_time_of_complaint = require("./cop_at_time_of_complaint");

var _lodash = require("lodash");

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var Models = /*#__PURE__*/function () {
  function Models(dbPath) {
    (0, _classCallCheck2.default)(this, Models);
    this.dbPath = dbPath;
  }

  (0, _createClass2.default)(Models, [{
    key: "init",
    value: function () {
      var _init = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
        var db;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _sqlite.open)({
                  filename: this.dbPath,
                  driver: _sqlite2.default.Database
                });

              case 2:
                db = _context.sent;
                this.precincts = new _precincts.Precincts(db);
                this.cops = new _cops.Cops(db);
                this.complaints = new _complaints.Complaints(db);
                this.commandUnits = new _command_units.CommandUnits(db);
                this.allegations = new _allegations.Allegations(db);
                this.copAtTimeOfComplaint = new _cop_at_time_of_complaint.CopAtTimeOfComplaint(db);
                _context.next = 11;
                return this.precincts.init();

              case 11:
                _context.next = 13;
                return this.cops.init();

              case 13:
                _context.next = 15;
                return this.complaints.init();

              case 15:
                _context.next = 17;
                return this.commandUnits.init();

              case 17:
                _context.next = 19;
                return this.allegations.init();

              case 19:
                _context.next = 21;
                return this.copAtTimeOfComplaint.init();

              case 21:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function init() {
        return _init.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: "isDbPopulated",
    value: function () {
      var _isDbPopulated = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.t0 = _lodash.keys;
                _context2.next = 3;
                return this.precincts.read();

              case 3:
                _context2.t1 = _context2.sent;
                _context2.t2 = (0, _context2.t0)(_context2.t1).length;

                if (!(_context2.t2 > 0)) {
                  _context2.next = 9;
                  break;
                }

                _context2.t3 = true;
                _context2.next = 10;
                break;

              case 9:
                _context2.t3 = false;

              case 10:
                return _context2.abrupt("return", _context2.t3);

              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function isDbPopulated() {
        return _isDbPopulated.apply(this, arguments);
      }

      return isDbPopulated;
    }()
  }, {
    key: "populate",
    value: function () {
      var _populate = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(csvPath, commandAbbrevCsvPath, rankAbbrevs, commandAbbrevs) {
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.isDbPopulated();

              case 2:
                if (!_context3.sent) {
                  _context3.next = 4;
                  break;
                }

                return _context3.abrupt("return");

              case 4:
                console.log('db being populated...');
                _context3.next = 7;
                return this.populateFromCsv(csvPath);

              case 7:
                _context3.next = 9;
                return this.cops.augment(commandAbbrevCsvPath, rankAbbrevs);

              case 9:
                _context3.next = 11;
                return this.commandUnits.augment(commandAbbrevs);

              case 11:
                _context3.next = 13;
                return this.copAtTimeOfComplaint.augment(commandAbbrevs);

              case 13:
                console.log('db finished populating');

              case 14:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function populate(_x, _x2, _x3, _x4) {
        return _populate.apply(this, arguments);
      }

      return populate;
    }()
  }, {
    key: "populateFromCsv",
    value: function () {
      var _populateFromCsv = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4(csvPath) {
        var csv, results, _iterator, _step, result;

        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                csv = _fs.default.readFileSync(csvPath);
                _context4.next = 3;
                return (0, _neatCsv.default)(csv);

              case 3:
                results = _context4.sent;
                //maybe rename as 'record'
                _iterator = _createForOfIteratorHelper(results);
                _context4.prev = 5;

                _iterator.s();

              case 7:
                if ((_step = _iterator.n()).done) {
                  _context4.next = 23;
                  break;
                }

                result = _step.value;
                _context4.next = 11;
                return this.precincts.create(result);

              case 11:
                _context4.next = 13;
                return this.cops.create(result);

              case 13:
                _context4.next = 15;
                return this.complaints.create(result);

              case 15:
                _context4.next = 17;
                return this.commandUnits.createFromRecord(result);

              case 17:
                _context4.next = 19;
                return this.allegations.create(result);

              case 19:
                _context4.next = 21;
                return this.copAtTimeOfComplaint.create(result);

              case 21:
                _context4.next = 7;
                break;

              case 23:
                _context4.next = 28;
                break;

              case 25:
                _context4.prev = 25;
                _context4.t0 = _context4["catch"](5);

                _iterator.e(_context4.t0);

              case 28:
                _context4.prev = 28;

                _iterator.f();

                return _context4.finish(28);

              case 31:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[5, 25, 28, 31]]);
      }));

      function populateFromCsv(_x5) {
        return _populateFromCsv.apply(this, arguments);
      }

      return populateFromCsv;
    }()
  }, {
    key: "getAllegationTypes",
    value: function () {
      var _getAllegationTypes = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5(csvPath) {
        var csv, results, allegationTypes, _iterator2, _step2, result;

        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                csv = _fs.default.readFileSync(csvPath);
                _context5.next = 3;
                return (0, _neatCsv.default)(csv);

              case 3:
                results = _context5.sent;
                allegationTypes = [];
                _iterator2 = _createForOfIteratorHelper(results);

                try {
                  for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                    result = _step2.value;
                    allegationTypes.push(result['Allegation type']);
                  }
                } catch (err) {
                  _iterator2.e(err);
                } finally {
                  _iterator2.f();
                }

                return _context5.abrupt("return", allegationTypes);

              case 8:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function getAllegationTypes(_x6) {
        return _getAllegationTypes.apply(this, arguments);
      }

      return getAllegationTypes;
    }()
  }]);
  return Models;
}();

exports.Models = Models;