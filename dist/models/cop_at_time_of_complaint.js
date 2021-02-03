"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CopAtTimeOfComplaint = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var CopAtTimeOfComplaint = /*#__PURE__*/function () {
  function CopAtTimeOfComplaint(db) {
    (0, _classCallCheck2.default)(this, CopAtTimeOfComplaint);
    this.db = db;
  }

  (0, _createClass2.default)(CopAtTimeOfComplaint, [{
    key: "init",
    value: function () {
      var _init = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.db.run("CREATE TABLE IF NOT EXISTS cop_at_time_of_complaint (\n\t\t\t\tid INTEGER PRIMARY KEY AUTOINCREMENT,\n\t\t\t\tcop_id INTEGER NOT NULL,\n\t\t\t\tcomplaint_id INTEGER NOT NULL,\n\t\t\t\trank TEXT,\n\t\t\t\trank_full TEXT,\n\t\t\t\tassignment TEXT,\n\t\t\t\tage INTEGER,\n\t\t\t\tFOREIGN KEY(cop_id) REFERENCES cops(id),\n\t\t\t\tFOREIGN KEY(complaint_id) REFERENCES complaints(id)\n\t\t\t\t);");

              case 2:
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
    key: "create",
    value: function () {
      var _create = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(cop_at_time_of_complaint) {
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return this.db.run("\n\t\t\t\tINSERT INTO \n\t\t\t\t\tcop_at_time_of_complaint(\n\t\t\t\t\t\tid, \n\t\t\t\t\t\tcop_id, \n\t\t\t\t\t\tcomplaint_id,\n\t\t\t\t\t\trank,\n\t\t\t\t\t\trank_full, \n\t\t\t\t\t\tassignment, \n\t\t\t\t\t\tage)\n\t\t\t\tVALUES(\n\t\t\t\t\tNULL, \n\t\t\t\t\t'".concat(cop_at_time_of_complaint.unique_mos_id, "', \n\t\t\t\t\t'").concat(cop_at_time_of_complaint.complaint_id, "',\n\t\t\t\t\t'").concat(cop_at_time_of_complaint.rank_abbrev_incident, "',\n\t\t\t\t\t'").concat(cop_at_time_of_complaint.rank_incident, "',\n\t\t\t\t\t'").concat(cop_at_time_of_complaint.command_at_incident, "', \n\t\t\t\t\t'").concat(cop_at_time_of_complaint.mos_age_incident, "')"));

              case 3:
                _context2.next = 12;
                break;

              case 5:
                _context2.prev = 5;
                _context2.t0 = _context2["catch"](0);

                if (!(_context2.t0 && !_context2.t0.message.match(/SQLITE_CONSTRAINT:.*/))) {
                  _context2.next = 12;
                  break;
                }

                console.log(_context2.t0.message);
                console.log('error in populating cop_at_time_of_complaint');
                console.log(cop_at_time_of_complaint);
                throw _context2.t0.message;

              case 12:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 5]]);
      }));

      function create(_x) {
        return _create.apply(this, arguments);
      }

      return create;
    }()
  }, {
    key: "augment",
    value: function () {
      var _augment = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(commandAbbrevs) {
        var _this = this;

        var results, _iterator, _step, _loop;

        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return this.db.run("\n\t\t\tALTER TABLE\n\t\t\t\tcop_at_time_of_complaint\n\t\t\tADD COLUMN\n\t\t\t\tcommand_unit_full TEXT");

              case 3:
                _context3.next = 5;
                return this.db.all("\n\t\t\tSELECT\n\t\t\t\t*\n\t\t\tFROM \n\t\t\t\tcop_at_time_of_complaint");

              case 5:
                results = _context3.sent;
                _iterator = _createForOfIteratorHelper(results);

                try {
                  _loop = function _loop() {
                    var result = _step.value;
                    var cmdUnitFull = commandAbbrevs.find(function (e) {
                      return e.Abbreviation === result.assignment;
                    });

                    if (cmdUnitFull != undefined) {
                      _this.updateCommandUnitFullColumn(result.id, cmdUnitFull['Command Name']);
                    } else {
                      _this.updateCommandUnitFullColumn(result.id, result.unit_id);
                    }
                  };

                  for (_iterator.s(); !(_step = _iterator.n()).done;) {
                    _loop();
                  }
                } catch (err) {
                  _iterator.e(err);
                } finally {
                  _iterator.f();
                }

                _context3.next = 13;
                break;

              case 10:
                _context3.prev = 10;
                _context3.t0 = _context3["catch"](0);
                console.error(_context3.t0);

              case 13:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 10]]);
      }));

      function augment(_x2) {
        return _augment.apply(this, arguments);
      }

      return augment;
    }()
  }, {
    key: "updateCommandUnitFullColumn",
    value: function () {
      var _updateCommandUnitFullColumn = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4(id, cmdUnitFull) {
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                try {
                  this.db.run("\n\t\t\t\tUPDATE \n\t\t\t\t\tcop_at_time_of_complaint\n\t\t\t\tSET \n\t\t\t\t\tcommand_unit_full = '".concat(cmdUnitFull, "'\n\t\t\t\tWHERE\n\t\t\t\t\tid = ").concat(id));
                } catch (error) {
                  console.error(error);
                }

              case 1:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function updateCommandUnitFullColumn(_x3, _x4) {
        return _updateCommandUnitFullColumn.apply(this, arguments);
      }

      return updateCommandUnitFullColumn;
    }()
  }, {
    key: "read",
    value: function () {
      var _read = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5() {
        var result;
        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                _context5.next = 3;
                return this.db.all("\n\t\t\t\tSELECT\n\t\t\t\t\t*\n\t\t\t\tFROM\n\t\t\t\t\tcop_at_time_of_complaint\n\t\t\t\tLIMIT\n\t\t\t\t\t100\n\t\t\t");

              case 3:
                result = _context5.sent;
                return _context5.abrupt("return", result);

              case 7:
                _context5.prev = 7;
                _context5.t0 = _context5["catch"](0);
                console.error(_context5.t0);

              case 10:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[0, 7]]);
      }));

      function read() {
        return _read.apply(this, arguments);
      }

      return read;
    }()
  }]);
  return CopAtTimeOfComplaint;
}();

exports.CopAtTimeOfComplaint = CopAtTimeOfComplaint;