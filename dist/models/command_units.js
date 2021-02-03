"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CommandUnits = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _validators = require("../scripts/validators");

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var CommandUnits = /*#__PURE__*/function () {
  function CommandUnits(db) {
    (0, _classCallCheck2.default)(this, CommandUnits);
    this.db = db;
    this.defaults = {
      order: 'DESC',
      orderBy: 'num_allegations',
      column: 'allegations'
    };
  }

  (0, _createClass2.default)(CommandUnits, [{
    key: "init",
    value: function () {
      var _init = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.db.run("CREATE TABLE IF NOT EXISTS command_units (\n\t\t\t\tid INTEGER PRIMARY KEY AUTOINCREMENT,\n\t\t\t\tunit_id TEXT NOT NULL UNIQUE,\n\t\t\t\tprecinct INTEGER,\n\t\t\t\tFOREIGN KEY(unit_id) REFERENCES cops(command_at_incident),\n\t\t\t\tFOREIGN KEY(precinct) REFERENCES precincts(id)\n\t\t\t\t);");

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
    key: "createFromRecord",
    value: function () {
      var _createFromRecord = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(record) {
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.create(record.command_at_incident);

              case 2:
                _context2.next = 4;
                return this.create(record.command_now);

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function createFromRecord(_x) {
        return _createFromRecord.apply(this, arguments);
      }

      return createFromRecord;
    }()
  }, {
    key: "create",
    value: function () {
      var _create = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(command_unit) {
        var match, precinct_id;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                //step 1: look at command_at_incident and parse an int (precinct) from it (if it exists)
                match = command_unit.match(/(.*) (?:PCT)?(?:DET)?$/);
                precinct_id = match && match[1] ? parseInt(match[1]) || null : null; //step 2: check precinct table to see if a corresponding row exists yet; 
                //if not, we need to make that row in the precincts table
                //populate 'command_units' table

                _context3.prev = 2;
                _context3.next = 5;
                return this.db.run("\n\t\t\t\tINSERT INTO \n\t\t\t\t\tcommand_units(\n\t\t\t\t\t\tid, \n\t\t\t\t\t\tunit_id, \n\t\t\t\t\t\tprecinct) \n\t\t\t\tVALUES(\n\t\t\t\t\tNULL, \n\t\t\t\t\t'".concat(command_unit, "', \n\t\t\t\t\t'").concat(precinct_id, "')"));

              case 5:
                _context3.next = 14;
                break;

              case 7:
                _context3.prev = 7;
                _context3.t0 = _context3["catch"](2);

                if (!(_context3.t0 && !_context3.t0.message.match(/SQLITE_CONSTRAINT:.*/))) {
                  _context3.next = 14;
                  break;
                }

                console.log(_context3.t0.message);
                console.log('error in populating command_units');
                console.log(command_unit);
                throw _context3.t0.message;

              case 14:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[2, 7]]);
      }));

      function create(_x2) {
        return _create.apply(this, arguments);
      }

      return create;
    }()
  }, {
    key: "total",
    value: function () {
      var _total = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4() {
        var result;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                _context4.next = 3;
                return this.db.all("\n\t\t\t\tSELECT\n\t\t\t\t\tCOUNT(*) AS rows\n\t\t\t\tFROM\n\t\t\t\t\tcommand_units\n\t\t\t\tWHERE\n\t\t\t\t\tcommand_units.unit_id IN (\n\t\t\t\t\t\tSELECT\n\t\t\t\t\t\t\ta.cop_command_unit\n\t\t\t\t\t\tFROM\n\t\t\t\t\t\t\tallegations a\n\t\t\t\t\t)\n\t\t\t\t");

              case 3:
                result = _context4.sent;
                return _context4.abrupt("return", result);

              case 7:
                _context4.prev = 7;
                _context4.t0 = _context4["catch"](0);
                console.error(_context4.t0);

              case 10:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[0, 7]]);
      }));

      function total() {
        return _total.apply(this, arguments);
      }

      return total;
    }()
  }, {
    key: "read",
    value: function () {
      var _read = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5(orderBy, order, page, pageSize) {
        var offset, result;
        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if ((0, _validators.checkOrder)(order) === false) {
                  order = this.defaults.order;
                }

                if ((0, _validators.checkOrderBy)(orderBy) === false) {
                  orderBy = this.defaults.orderBy;
                }

                _context5.prev = 2;
                offset = pageSize * (page - 1);
                _context5.next = 6;
                return this.db.all("\n\t\t\t\tSELECT\n\t\t\t\t*,\n\t\t\t\tJSON_GROUP_ARRAY(JSON_OBJECT(\n\t\t\t\t\t'American Indian',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(american_indian * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Asian',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(asian * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Black',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(black * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Hispanic',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(hispanic * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'White',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(white * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Other Ethnicity',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(other_ethnicity * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Ethnicity Unknown',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(ethnicity_unknown * 1.0 / num_allegations * 100.0, 2) END\n\t\t\t\t)) AS race_percentages,\n\t\t\t\tJSON_GROUP_ARRAY(JSON_OBJECT(\n\t\t\t\t\t'Female',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(female * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Male',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(male * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Female (trans)',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(trans_female * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Male (trans)',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(trans_male * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Gender-nonconforming',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(gender_non_conforming * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Unknown/refused',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(gender_unknown * 1.0 / num_allegations * 100.0, 2) END\n\t\t\t\t)) AS gender_percentages\n\t\t\t\tFROM (\n\t\t\t\tSELECT\n\t\t\t\t\tcommand_units.*,\n\t\t\t\t\tCASE \n\t\t\t\t\t\tWHEN COUNT(allegations.id) > 9\n\t\t\t\t\t\tTHEN (\n\t\t\t\t\t\tROUND(COUNT(CASE WHEN allegations.board_disposition LIKE 'Substantiated%' THEN 1 END)*1.0 / COUNT(allegations.id) * 100.0, 2))\n\t\t\t\t\tEND substantiated_percentage,\n\t\t\t\t\tCOUNT(allegations.id) AS num_allegations,\n\t\t\t\t\tCOUNT(CASE WHEN allegations.board_disposition LIKE 'Substantiated%' THEN 1 END) AS num_substantiated,\n\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%american indian%' THEN allegations.id END) AS american_indian,\n\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%asian%' THEN allegations.id END) AS asian,\n\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%black%' THEN allegations.id END) AS black,\n\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%hispanic%' THEN allegations.id END) AS hispanic,\n\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%white%' THEN allegations.id END) AS white,\n\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE 'Other Race' THEN allegations.id END) AS other_ethnicity,\n\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '' THEN allegations.id END) AS ethnicity_unknown,\n\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE 'male%' THEN allegations.id END) AS male,\n\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%female%' THEN allegations.id END) AS female,\n\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%Gender non-conforming%' THEN allegations.id END) AS gender_non_conforming,\n\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%Transman%' THEN allegations.id END) AS trans_male,\n\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%Transwoman%' THEN allegations.id END) AS trans_female,\n\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '' THEN allegations.id END) AS gender_unknown,\n\t\t\t\t\tCOUNT(DISTINCT complaints.id) AS num_complaints\n\t\t\t\tFROM \n\t\t\t\t\tcommand_units\n\t\t\t\tINNER JOIN \n\t\t\t\t\tallegations\n\t\t\t\tON \n\t\t\t\t\tcommand_units.unit_id = allegations.cop_command_unit\n\t\t\t\t\tINNER JOIN\n\t\t\t\t\t\tcomplaints\n\t\t\t\t\tON\n\t\t\t\t\t\tcomplaints.id = allegations.complaint_id\n\t\t\t\tGROUP BY \n\t\t\t\t\tcommand_units.unit_id\n\t\t\t\t)\n\t\t\t\tGROUP BY\n\t\t\t\t\tid\n\t\t\t\tORDER BY\n\t\t\t\t\t".concat(orderBy, " ").concat(order, "\n\t\t\t\tLIMIT\n\t\t\t\t\t(?)\n\t\t\t\tOFFSET\n\t\t\t\t\t(?)\n\t\t\t"), pageSize, offset);

              case 6:
                result = _context5.sent;
                result.map(function (e) {
                  e.race_percentages = JSON.parse(e.race_percentages)[0];
                  e.gender_percentages = JSON.parse(e.gender_percentages)[0];
                });
                return _context5.abrupt("return", result);

              case 11:
                _context5.prev = 11;
                _context5.t0 = _context5["catch"](2);
                console.error(_context5.t0);

              case 14:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[2, 11]]);
      }));

      function read(_x3, _x4, _x5, _x6) {
        return _read.apply(this, arguments);
      }

      return read;
    }()
  }, {
    key: "readAll",
    value: function () {
      var _readAll = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee6() {
        var result;
        return _regenerator.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                _context6.next = 3;
                return this.db.all("\n\t\t\t\tSELECT\n\t\t\t\t*,\n\t\t\t\tJSON_GROUP_ARRAY(JSON_OBJECT(\n\t\t\t\t\t'American Indian',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(american_indian * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Asian',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(asian * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Black',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(black * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Hispanic',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(hispanic * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'White',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(white * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Other Ethnicity',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(other_ethnicity * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Ethnicity Unknown',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(ethnicity_unknown * 1.0 / num_allegations * 100.0, 2) END\n\t\t\t\t)) AS race_percentages,\n\t\t\t\tJSON_GROUP_ARRAY(JSON_OBJECT(\n\t\t\t\t\t'Female',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(female * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Male',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(male * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Female (trans)',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(trans_female * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Male (trans)',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(trans_male * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Gender-nonconforming',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(gender_non_conforming * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Unknown/refused',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(gender_unknown * 1.0 / num_allegations * 100.0, 2) END\n\t\t\t\t)) AS gender_percentages\n\t\t\t\tFROM (\n\t\t\t\tSELECT\n\t\t\t\t\tcommand_units.*,\n\t\t\t\t\tCASE \n\t\t\t\t\t\tWHEN COUNT(allegations.id) > 9\n\t\t\t\t\t\tTHEN (\n\t\t\t\t\t\tROUND(COUNT(CASE WHEN allegations.board_disposition LIKE 'Substantiated%' THEN 1 END)*1.0 / COUNT(allegations.id) * 100.0, 2))\n\t\t\t\t\tEND substantiated_percentage,\n\t\t\t\t\tCOUNT(allegations.id) AS num_allegations,\n\t\t\t\t\tCOUNT(CASE WHEN allegations.board_disposition LIKE 'Substantiated%' THEN 1 END) AS num_substantiated,\n\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%american indian%' THEN allegations.id END) AS american_indian,\n\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%asian%' THEN allegations.id END) AS asian,\n\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%black%' THEN allegations.id END) AS black,\n\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%hispanic%' THEN allegations.id END) AS hispanic,\n\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%white%' THEN allegations.id END) AS white,\n\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE 'Other Race' THEN allegations.id END) AS other_ethnicity,\n\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '' THEN allegations.id END) AS ethnicity_unknown,\n\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE 'male%' THEN allegations.id END) AS male,\n\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%female%' THEN allegations.id END) AS female,\n\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%Gender non-conforming%' THEN allegations.id END) AS gender_non_conforming,\n\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%Transman%' THEN allegations.id END) AS trans_male,\n\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%Transwoman%' THEN allegations.id END) AS trans_female,\n\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '' THEN allegations.id END) AS gender_unknown,\n\t\t\t\t\tCOUNT(DISTINCT complaints.id) AS num_complaints\n\t\t\t\tFROM \n\t\t\t\t\tcommand_units\n\t\t\t\tINNER JOIN \n\t\t\t\t\tallegations\n\t\t\t\tON \n\t\t\t\t\tcommand_units.unit_id = allegations.cop_command_unit\n\t\t\t\t\tINNER JOIN\n\t\t\t\t\t\tcomplaints\n\t\t\t\t\tON\n\t\t\t\t\t\tcomplaints.id = allegations.complaint_id\n\t\t\t\tGROUP BY \n\t\t\t\t\tcommand_units.unit_id\n\t\t\t\t)\n\t\t\t");

              case 3:
                result = _context6.sent;
                result.map(function (e) {
                  e.race_percentages = JSON.parse(e.race_percentages)[0];
                  e.gender_percentages = JSON.parse(e.gender_percentages)[0];
                });
                return _context6.abrupt("return", result);

              case 8:
                _context6.prev = 8;
                _context6.t0 = _context6["catch"](0);
                console.error(_context6.t0);

              case 11:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this, [[0, 8]]);
      }));

      function readAll() {
        return _readAll.apply(this, arguments);
      }

      return readAll;
    }() //method to get command units with no associated complaints
    //these are units that have a cop in the db who *most recently* worked at one of these command units
    //they are entered into the db because a row in the orig csv includes them in the 'command now' category

  }, {
    key: "getEmptyCommandUnit",
    value: function () {
      var _getEmptyCommandUnit = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee7(id) {
        var result;
        return _regenerator.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;
                _context7.next = 3;
                return this.db.all("\n\t\t\t\tSELECT\n\t\t\t\t\t*\n\t\t\t\tFROM\n\t\t\t\t\tcommand_units\n\t\t\t\tWHERE\n\t\t\t\t\tcommand_units.id = (?)\n\t\t\t\t", id);

              case 3:
                result = _context7.sent;
                return _context7.abrupt("return", result);

              case 7:
                _context7.prev = 7;
                _context7.t0 = _context7["catch"](0);
                console.error(_context7.t0);

              case 10:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this, [[0, 7]]);
      }));

      function getEmptyCommandUnit(_x7) {
        return _getEmptyCommandUnit.apply(this, arguments);
      }

      return getEmptyCommandUnit;
    }()
  }, {
    key: "readCommandUnit",
    value: function () {
      var _readCommandUnit = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee8(id) {
        var result, emptyUnit;
        return _regenerator.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.prev = 0;
                _context8.next = 3;
                return this.db.get("\n\t\t\t\tSELECT\n\t\t\t\t\t*,\n\t\t\t\t\tROUND(num_substantiated * 1.0/num_allegations * 100.0, 2) AS substantiated_percentage,\n\t\t\t\tJSON_OBJECT(\n\t\t\t\t\t'American Indian',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(american_indian * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Asian',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(asian * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Black',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(black * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Hispanic',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(hispanic * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'White',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(white * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Other Ethnicity',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(other_ethnicity * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Ethnicity Unknown',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(ethnicity_unknown * 1.0 / num_allegations * 100.0, 2) END\n\t\t\t\t) AS race_percentages,\n\t\t\t\tJSON_OBJECT(\n\t\t\t\t\t'Female',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(female * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Male',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(male * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Female (trans)',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(trans_female * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Male (trans)',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(trans_male * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Gender-nonconforming',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(gender_non_conforming * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Unknown/refused',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(gender_unknown * 1.0 / num_allegations * 100.0, 2) END\n\t\t\t\t) AS gender_percentages\n\t\t\t\tFROM(\n\t\t\t\t\tSELECT \n\t\t\t\t\t\tcommand_units.*,\n\t\t\t\t\t\t(SELECT \n\t\t\t\t\t\t\tCOUNT(*) \n\t\t\t\t\t\tFROM \n\t\t\t\t\t\t\tallegations \n\t\t\t\t\t\tWHERE \n\t\t\t\t\t\t\tcommand_units.unit_id = allegations.cop_command_unit) AS num_allegations,\n\t\t\t\t\t\t(SELECT\n\t\t\t\t\t\t\tCOUNT(DISTINCT complaints.id)\n\t\t\t\t\t\tFROM\n\t\t\t\t\t\t\tallegations\n\t\t\t\t\t\tINNER JOIN\n\t\t\t\t\t\t\tcomplaints\n\t\t\t\t\t\tON \n\t\t\t\t\t\t\tallegations.complaint_id = complaints.id\n\t\t\t\t\t\tWHERE \n\t\t\t\t\t\t\tcommand_units.unit_id = allegations.cop_command_unit AND allegations.complaint_id = complaints.id) AS num_complaints,\n\t\t\t\t\t\t(SELECT\n\t\t\t\t\t\t\tCOUNT(\n\t\t\t\t\t\t\t\tCASE WHEN \n\t\t\t\t\t\t\t\t\tallegations.board_disposition LIKE 'Substantiated%' \n\t\t\t\t\t\t\t\tAND \n\t\t\t\t\t\t\t\t\tallegations.cop_command_unit = command_units.unit_id THEN 1 END)\n\t\t\t\t\t\tFROM\n\t\t\t\t\t\t\tallegations) AS num_substantiated,\n\t\t\t\t\t\t(SELECT\n\t\t\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%indian%' THEN allegations.id END)\n\t\t\t\t\t\tFROM\n\t\t\t\t\t\t\tallegations\n\t\t\t\t\t\tWHERE\n\t\t\t\t\t\t\tcommand_units.unit_id = allegations.cop_command_unit) AS american_indian,\n\t\t\t\t\t\t(SELECT\n\t\t\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%asian%' THEN allegations.id END)\n\t\t\t\t\t\tFROM\n\t\t\t\t\t\t\tallegations\n\t\t\t\t\t\tWHERE\n\t\t\t\t\t\t\tcommand_units.unit_id = allegations.cop_command_unit) AS asian,\n\t\t\t\t\t\t(SELECT\n\t\t\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%black%' THEN allegations.id END)\n\t\t\t\t\t\tFROM\n\t\t\t\t\t\t\tallegations\n\t\t\t\t\t\tWHERE\n\t\t\t\t\t\t\tcommand_units.unit_id = allegations.cop_command_unit) AS black,\n\t\t\t\t\t\t(SELECT\n\t\t\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%hispanic%' THEN allegations.id END)\n\t\t\t\t\t\tFROM\n\t\t\t\t\t\t\tallegations\n\t\t\t\t\t\tWHERE\n\t\t\t\t\t\t\tcommand_units.unit_id = allegations.cop_command_unit) AS hispanic,\n\t\t\t\t\t\t(SELECT\n\t\t\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%white%' THEN allegations.id END)\n\t\t\t\t\t\tFROM\n\t\t\t\t\t\t\tallegations\n\t\t\t\t\t\tWHERE\n\t\t\t\t\t\t\tcommand_units.unit_id = allegations.cop_command_unit) AS white,\n\t\t\t\t\t\t(SELECT\n\t\t\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%Other Race%' THEN allegations.id END)\n\t\t\t\t\t\tFROM\n\t\t\t\t\t\t\tallegations\n\t\t\t\t\t\tWHERE\n\t\t\t\t\t\t\tcommand_units.unit_id = allegations.cop_command_unit) AS other_ethnicity,\n\t\t\t\t\t\t(SELECT\n\t\t\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '' THEN allegations.id END)\n\t\t\t\t\t\tFROM\n\t\t\t\t\t\t\tallegations\n\t\t\t\t\t\tWHERE\n\t\t\t\t\t\t\tcommand_units.unit_id = allegations.cop_command_unit) AS ethnicity_unknown,\n\t\t\t\t\t\t(SELECT\n\t\t\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE 'male%' THEN allegations.id END)\n\t\t\t\t\t\tFROM\n\t\t\t\t\t\t\tallegations\n\t\t\t\t\t\tWHERE\n\t\t\t\t\t\t\tcommand_units.unit_id = allegations.cop_command_unit) AS male,\n\t\t\t\t\t\t(SELECT\n\t\t\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%female%' THEN allegations.id END)\n\t\t\t\t\t\tFROM\n\t\t\t\t\t\t\tallegations\n\t\t\t\t\t\tWHERE\n\t\t\t\t\t\t\tcommand_units.unit_id = allegations.cop_command_unit) AS female,\n\t\t\t\t\t\t(SELECT\n\t\t\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%Gender non-conforming%' THEN allegations.id END)\n\t\t\t\t\t\tFROM\n\t\t\t\t\t\t\tallegations\n\t\t\t\t\t\tWHERE\n\t\t\t\t\t\t\tcommand_units.unit_id = allegations.cop_command_unit) AS gender_non_conforming,\n\t\t\t\t\t\t(SELECT\n\t\t\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%Transman%' THEN allegations.id END)\n\t\t\t\t\t\tFROM\n\t\t\t\t\t\t\tallegations\n\t\t\t\t\t\tWHERE\n\t\t\t\t\t\t\tcommand_units.unit_id = allegations.cop_command_unit) AS trans_male,\n\t\t\t\t\t\t(SELECT\n\t\t\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%Transwoman%' THEN allegations.id END)\n\t\t\t\t\t\tFROM\n\t\t\t\t\t\t\tallegations\n\t\t\t\t\t\tWHERE\n\t\t\t\t\t\t\tcommand_units.unit_id = allegations.cop_command_unit) AS trans_female,\n\t\t\t\t\t\t(SELECT\n\t\t\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '' THEN allegations.id END)\n\t\t\t\t\t\tFROM\n\t\t\t\t\t\t\tallegations\n\t\t\t\t\t\tWHERE\n\t\t\t\t\t\t\tcommand_units.unit_id = allegations.cop_command_unit) AS gender_unknown\n\t\t\t\t\tFROM\n\t\t\t\t\t\tcommand_units\n\t\t\t\t\tWHERE \n\t\t\t\t\t\tcommand_units.id = (?)\n\t\t\t\t\t)\n\t\t\t\t", id);

              case 3:
                result = _context8.sent;

                if (!result) {
                  _context8.next = 10;
                  break;
                }

                if (!(result.id && result.num_allegations === 0)) {
                  _context8.next = 10;
                  break;
                }

                _context8.next = 8;
                return this.getEmptyCommandUnit(id);

              case 8:
                emptyUnit = _context8.sent;
                return _context8.abrupt("return", emptyUnit);

              case 10:
                if (result !== undefined) {
                  result.race_percentages = JSON.parse(result.race_percentages);
                  result.gender_percentages = JSON.parse(result.gender_percentages);
                }

                return _context8.abrupt("return", result);

              case 14:
                _context8.prev = 14;
                _context8.t0 = _context8["catch"](0);
                console.error(_context8.t0);

              case 17:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this, [[0, 14]]);
      }));

      function readCommandUnit(_x8) {
        return _readCommandUnit.apply(this, arguments);
      }

      return readCommandUnit;
    }()
  }, {
    key: "getYearlyStats",
    value: function () {
      var _getYearlyStats = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee9(column, id) {
        var result;
        return _regenerator.default.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                if ((0, _validators.checkOrderBy)(column) === false) {
                  column = this.defaults.orderBy;
                }

                _context9.prev = 1;
                _context9.next = 4;
                return this.db.all("\n\t\t\t\tSELECT\n\t\t\t\t\tCAST(year AS INTEGER) AS year,\n\t\t\t\t\tCOUNT(*) AS count\n\t\t\t\tFROM\n\t\t\t\t\t(\n\t\t\t\tSELECT\n\t\t\t\t\tcommand_units.*,\n\t\t\t\t\tstrftime('%Y', complaints.date_received) AS year\n\t\t\t\tFROM\n\t\t\t\t\tcommand_units\n\t\t\t\tINNER JOIN\n\t\t\t\t\tallegations\n\t\t\t\tON \n\t\t\t\t\tcommand_units.unit_id = allegations.cop_command_unit\n\t\t\t\t\tINNER JOIN\n\t\t\t\t\t\tcomplaints\n\t\t\t\t\tON\n\t\t\t\t\t\tcomplaints.id = allegations.complaint_id\n\t\t\t\tWHERE \n\t\t\t\t\tcommand_units.id = (?)\n\t\t\t\tGROUP BY\n\t\t\t\t\t\"".concat(column, "\".id\n\t\t\t\t)\n\t\t\t\tGROUP BY\n\t\t\t\t\tyear\n\t\t\t"), id);

              case 4:
                result = _context9.sent;
                return _context9.abrupt("return", result);

              case 8:
                _context9.prev = 8;
                _context9.t0 = _context9["catch"](1);
                console.error(_context9.t0);

              case 11:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this, [[1, 8]]);
      }));

      function getYearlyStats(_x9, _x10) {
        return _getYearlyStats.apply(this, arguments);
      }

      return getYearlyStats;
    }()
  }, {
    key: "getComplaints",
    value: function () {
      var _getComplaints = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee10(id) {
        var result;
        return _regenerator.default.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.prev = 0;
                _context10.next = 3;
                return this.db.all("\n\t\t\t\tSELECT\n\t\t\t\t\tid,\n\t\t\t\t\tdate_received,\n\t\t\t\t\tdate_closed,\n\t\t\t\t\tprecinct,\n\t\t\t\t\tcontact_reason,\n\t\t\t\t\toutcome_description,\n\t\t\t\t\tCOUNT(CASE WHEN a_complaint_id = id THEN 1 END) AS num_allegations_on_complaint,\n\t\t\t\t\tJSON_GROUP_ARRAY(JSON_OBJECT('allegation_id',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ta_id,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'complaint_id',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ta_complaint_id,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'cop_command_unit', \n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ta_cop_command_unit,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'cop_id',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ta_cop,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'cop_name',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcop_name,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'precinct',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ta_precinct,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'fado_type',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ta_fado_type,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'description',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ta_description,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'complainant_ethnicity',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ta_complainant_ethnicity,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'complainant_gender',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ta_complainant_gender,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'complainant_age_incident',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ta_complainant_age_incident,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'board_disposition',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ta_board_disposition)) as allegations\n\t\t\t\tFROM(\n\t\t\t\tSELECT \n\t\t\t\t\tcomplaints.id AS id,\n\t\t\t\t\tcomplaints.date_received AS date_received,\n\t\t\t\t\tcomplaints.date_closed AS date_closed,\n\t\t\t\t\tcomplaints.precinct AS precinct,\n\t\t\t\t\tcomplaints.contact_reason AS contact_reason,\n\t\t\t\t\tcomplaints.outcome_description AS outcome_description,\n\t\t\t\t\ta.id AS a_id,\n\t\t\t\t\ta.complaint_id AS a_complaint_id,\n\t\t\t\t\ta.cop_command_unit AS a_cop_command_unit,\n\t\t\t\t\ta.cop AS a_cop,\n\t\t\t\t\tc.first_name || ' ' || c.last_name AS cop_name,\n\t\t\t\t\ta.precinct AS a_precinct,\n\t\t\t\t\ta.fado_type AS a_fado_type,\n\t\t\t\t\ta.description AS a_description,\n\t\t\t\t\ta.complainant_ethnicity AS a_complainant_ethnicity,\n\t\t\t\t\ta.complainant_gender AS a_complainant_gender,\n\t\t\t\t\ta.complainant_age_incident AS a_complainant_age_incident,\n\t\t\t\t\ta.board_disposition AS a_board_disposition\n\t\t\t\tFROM\n\t\t\t\t\tcommand_units\n\t\t\t\tJOIN\n\t\t\t\t\tallegations a\n\t\t\t\tON\n\t\t\t\t\ta.cop_command_unit = command_units.unit_id\n\t\t\t\tJOIN\n\t\t\t\t\tcops c\n\t\t\t\tON\n\t\t\t\t\ta.cop = c.id\n\t\t\t\tJOIN\n\t\t\t\t\tcomplaints\n\t\t\t\tON\n\t\t\t\t\tcomplaints.id = a.complaint_id\n\t\t\t\tWHERE\n\t\t\t\t\tcommand_units.id = (?)\n\t\t\t\t)\n\t\t\t\tGROUP BY\n\t\t\t\t\tid\t\n\t\t\t", id);

              case 3:
                result = _context10.sent;
                //the allegations propery is not correctly formatted as a JSON object
                result.map(function (e) {
                  e.allegations = JSON.parse(e.allegations);
                  e.date_received = new Date(e.date_received + ' 12:00:00 GMT-0400');
                  e.date_closed = new Date(e.date_closed + ' 12:00:00 GMT-0400');
                });
                return _context10.abrupt("return", result);

              case 8:
                _context10.prev = 8;
                _context10.t0 = _context10["catch"](0);
                console.error(_context10.t0);

              case 11:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this, [[0, 8]]);
      }));

      function getComplaints(_x11) {
        return _getComplaints.apply(this, arguments);
      }

      return getComplaints;
    }()
  }, {
    key: "search",
    value: function () {
      var _search = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee11(searchQuery) {
        var results;
        return _regenerator.default.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                if ((0, _validators.checkSearchQuery)(searchQuery)) {
                  _context11.next = 2;
                  break;
                }

                return _context11.abrupt("return", 'error');

              case 2:
                _context11.prev = 2;
                results = {
                  type: 'command_unit',
                  identifier: ['command_unit_full', 'unit_id']
                };
                _context11.next = 6;
                return this.db.all("\n\t\t\t\t\tSELECT \n\t\t\t\t\t\t*\n\t\t\t\t\tFROM \n\t\t\t\t\t\tcommand_units\n\t\t\t\t\tWHERE\n\t\t\t\t\t\tcommand_unit_full LIKE '%".concat(searchQuery, "%'\n\t\t\t\t\tOR\n\t\t\t\t\t\tunit_id LIKE '%").concat(searchQuery, "%'\n\t\t\t\t\tOR\n\t\t\t\t\t\tprecinct LIKE '%").concat(searchQuery, "%'\n\t\t\t"));

              case 6:
                results.results = _context11.sent;
                return _context11.abrupt("return", results);

              case 10:
                _context11.prev = 10;
                _context11.t0 = _context11["catch"](2);
                console.error(_context11.t0);

              case 13:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this, [[2, 10]]);
      }));

      function search(_x12) {
        return _search.apply(this, arguments);
      }

      return search;
    }() //get all cops who have an allegation against them while working at command_unit.id = id

  }, {
    key: "getCops",
    value: function () {
      var _getCops = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee12(id) {
        var results;
        return _regenerator.default.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.prev = 0;
                _context12.next = 3;
                return this.db.all("\n\t\t\t\tSELECT\n\t\t\t\t\tfirst_name,\n\t\t\t\t\tlast_name,\n\t\t\t\t\tcop_id AS id,\n\t\t\t\t\tethnicity,\n\t\t\t\t\tgender,\n\t\t\t\t\tCOUNT(*) AS num_allegations,\n\t\t\t\t\tCOUNT(DISTINCT complaint_id) AS num_complaints\n\t\t\t\tFROM\n\t\t\t\t\t(\n\t\t\t\tSELECT\n\t\t\t\t\tcommand_units.*,\n\t\t\t\t\tcop.*,\n\t\t\t\t\tcops.first_name,\n\t\t\t\t\tcops.last_name,\n\t\t\t\t\tcops.ethnicity,\n\t\t\t\t\tcops.gender\n\t\t\t\tFROM \n\t\t\t\t\tcommand_units\n\t\t\t\tJOIN\n\t\t\t\t\tcop_at_time_of_complaint cop\n\t\t\t\tON\n\t\t\t\t\tcop.assignment = command_units.unit_id\n\t\t\t\tJOIN\n\t\t\t\t\tcops\n\t\t\t\tON\n\t\t\t\t\tcop.cop_id = cops.id\n\t\t\t\tWHERE\n\t\t\t\t\tcommand_units.id = (?))\n\t\t\t\tGROUP BY\n\t\t\t\t\tcop_id\n\t\t\t\tORDER BY\n\t\t\t\t\tnum_allegations DESC\n\t\t\t\t", id);

              case 3:
                results = _context12.sent;
                return _context12.abrupt("return", results);

              case 7:
                _context12.prev = 7;
                _context12.t0 = _context12["catch"](0);
                console.error(_context12.t0);

              case 10:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this, [[0, 7]]);
      }));

      function getCops(_x13) {
        return _getCops.apply(this, arguments);
      }

      return getCops;
    }() //cops who have command_unit.unit_id = id listed as "rank now"

  }, {
    key: "getCopsForCommandUnitWithoutComplaints",
    value: function () {
      var _getCopsForCommandUnitWithoutComplaints = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee13(id) {
        var results;
        return _regenerator.default.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                _context13.prev = 0;
                _context13.next = 3;
                return this.db.all("\n\t\t\t\tSELECT\n\t\t\t\t\tfirst_name,\n\t\t\t\t\tlast_name,\n\t\t\t\t\tshield_no,\n\t\t\t\t\tcop_id AS id,\n\t\t\t\t\tethnicity, \n\t\t\t\t\tgender\n\t\t\t\tFROM\n\t\t\t\t\t(\n\t\t\t\tSELECT\n\t\t\t\t\tcommand_units.*,\n\t\t\t\t\tc.id AS cop_id,\n\t\t\t\t\tc.first_name,\n\t\t\t\t\tc.last_name,\n\t\t\t\t\tc.shield_no,\n\t\t\t\t\tc.ethnicity,\n\t\t\t\t\tc.gender\n\t\t\t\tFROM \n\t\t\t\t\tcommand_units\n\t\t\t\tJOIN\n\t\t\t\t\tcops c\n\t\t\t\tON\n\t\t\t\t\tc.command_unit = command_units.unit_id\n\t\t\t\tWHERE\n\t\t\t\t\tcommand_units.id = (?))\n\t\t\t\tGROUP BY\n\t\t\t\t\tcop_id\n\t\t\t\t", id);

              case 3:
                results = _context13.sent;
                return _context13.abrupt("return", results);

              case 7:
                _context13.prev = 7;
                _context13.t0 = _context13["catch"](0);
                console.error(_context13.t0);

              case 10:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this, [[0, 7]]);
      }));

      function getCopsForCommandUnitWithoutComplaints(_x14) {
        return _getCopsForCommandUnitWithoutComplaints.apply(this, arguments);
      }

      return getCopsForCommandUnitWithoutComplaints;
    }() //return a list of ONLY command units that have an associated precinct
    //for use with the precincts maps

  }, {
    key: "commandUnitsWithPrecincts",
    value: function () {
      var _commandUnitsWithPrecincts = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee14() {
        var results;
        return _regenerator.default.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                _context14.prev = 0;
                _context14.next = 3;
                return this.db.all("\n\t\t\t\tSELECT\n\t\t\t\t*,\n\t\t\t\tJSON_GROUP_ARRAY(JSON_OBJECT(\n\t\t\t\t\t'American Indian',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(american_indian * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Asian',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(asian * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Black',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(black * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Hispanic',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(hispanic * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'White',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(white * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Other Ethnicity',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(other_ethnicity * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Ethnicity Unknown',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(ethnicity_unknown * 1.0 / num_allegations * 100.0, 2) END\n\t\t\t\t)) AS race_percentages,\n\t\t\t\tJSON_GROUP_ARRAY(JSON_OBJECT(\n\t\t\t\t\t'Female',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(female * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Male',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(male * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Female (trans)',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(trans_female * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Male (trans)',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(trans_male * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Gender-nonconforming',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(gender_non_conforming * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Unknown/refused',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(gender_unknown * 1.0 / num_allegations * 100.0, 2) END\n\t\t\t\t)) AS gender_percentages\n\t\t\t\tFROM (\n\t\t\t\tSELECT\n\t\t\t\t\tcommand_units.*,\n\t\t\t\t\tCASE \n\t\t\t\t\t\tWHEN COUNT(allegations.id) > 9\n\t\t\t\t\t\tTHEN (\n\t\t\t\t\t\tROUND(COUNT(CASE WHEN allegations.board_disposition LIKE 'Substantiated%' THEN 1 END)*1.0 / COUNT(allegations.id) * 100.0, 2))\n\t\t\t\t\tEND substantiated_percentage,\n\t\t\t\t\tCOUNT(allegations.id) AS num_allegations,\n\t\t\t\t\tCOUNT(CASE WHEN allegations.board_disposition LIKE 'Substantiated%' THEN 1 END) AS num_substantiated,\n\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%american indian%' THEN allegations.id END) AS american_indian,\n\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%asian%' THEN allegations.id END) AS asian,\n\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%black%' THEN allegations.id END) AS black,\n\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%hispanic%' THEN allegations.id END) AS hispanic,\n\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%white%' THEN allegations.id END) AS white,\n\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE 'Other Race' THEN allegations.id END) AS other_ethnicity,\n\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '' THEN allegations.id END) AS ethnicity_unknown,\n\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE 'male%' THEN allegations.id END) AS male,\n\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%female%' THEN allegations.id END) AS female,\n\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%Gender non-conforming%' THEN allegations.id END) AS gender_non_conforming,\n\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%Transman%' THEN allegations.id END) AS trans_male,\n\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%Transwoman%' THEN allegations.id END) AS trans_female,\n\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '' THEN allegations.id END) AS gender_unknown,\n\t\t\t\t\tCOUNT(DISTINCT complaints.id) AS num_complaints\n\t\t\t\tFROM \n\t\t\t\t\tcommand_units\n\t\t\t\tINNER JOIN \n\t\t\t\t\tallegations\n\t\t\t\tON \n\t\t\t\t\tcommand_units.unit_id = allegations.cop_command_unit\n\t\t\t\t\tINNER JOIN\n\t\t\t\t\t\tcomplaints\n\t\t\t\t\tON\n\t\t\t\t\t\tcomplaints.id = allegations.complaint_id\n\t\t\t\tWHERE\n\t\t\t\t\ttypeof(command_units.precinct) = \"integer\"\n\t\t\t\tGROUP BY \n\t\t\t\t\tcommand_units.unit_id\n\t\t\t\t)\n\t\t\t\tGROUP BY \n\t\t\t\t\tid\n\t\t\t");

              case 3:
                results = _context14.sent;
                results.map(function (e) {
                  e.race_percentages = JSON.parse(e.race_percentages)[0];
                  e.gender_percentages = JSON.parse(e.gender_percentages)[0];
                });
                return _context14.abrupt("return", results);

              case 8:
                _context14.prev = 8;
                _context14.t0 = _context14["catch"](0);
                console.error(_context14.t0);

              case 11:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14, this, [[0, 8]]);
      }));

      function commandUnitsWithPrecincts() {
        return _commandUnitsWithPrecincts.apply(this, arguments);
      }

      return commandUnitsWithPrecincts;
    }()
  }, {
    key: "augment",
    value: function () {
      var _augment = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee15(commandAbbrevs) {
        var _this = this;

        var results, _iterator, _step, _loop;

        return _regenerator.default.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                _context15.prev = 0;
                _context15.next = 3;
                return this.db.run("\n\t\t\tALTER TABLE\n\t\t\t\tcommand_units\n\t\t\tADD COLUMN\n\t\t\t\tcommand_unit_full TEXT");

              case 3:
                _context15.next = 5;
                return this.db.all("\n\t\t\tSELECT\n\t\t\t\t*\n\t\t\tFROM \n\t\t\t\tcommand_units");

              case 5:
                results = _context15.sent;
                _iterator = _createForOfIteratorHelper(results);

                try {
                  _loop = function _loop() {
                    var result = _step.value;
                    var cmdUnitFull = commandAbbrevs.find(function (e) {
                      return e.Abbreviation === result.unit_id;
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

                _context15.next = 13;
                break;

              case 10:
                _context15.prev = 10;
                _context15.t0 = _context15["catch"](0);
                console.error(_context15.t0);

              case 13:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this, [[0, 10]]);
      }));

      function augment(_x15) {
        return _augment.apply(this, arguments);
      }

      return augment;
    }()
  }, {
    key: "updateCommandUnitFullColumn",
    value: function () {
      var _updateCommandUnitFullColumn = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee16(id, cmdUnitFull) {
        return _regenerator.default.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                try {
                  this.db.run("\n\t\t\t\tUPDATE \n\t\t\t\t\tcommand_units\n\t\t\t\tSET \n\t\t\t\t\tcommand_unit_full = '".concat(cmdUnitFull, "'\n\t\t\t\tWHERE\n\t\t\t\t\tid = ").concat(id));
                } catch (error) {
                  console.error(error);
                }

              case 1:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee16, this);
      }));

      function updateCommandUnitFullColumn(_x16, _x17) {
        return _updateCommandUnitFullColumn.apply(this, arguments);
      }

      return updateCommandUnitFullColumn;
    }()
  }]);
  return CommandUnits;
}();

exports.CommandUnits = CommandUnits;