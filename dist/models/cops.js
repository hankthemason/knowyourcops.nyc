"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Cops = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _neatCsv = _interopRequireDefault(require("neat-csv"));

var _fs = _interopRequireDefault(require("fs"));

var _lodash = require("lodash");

var _immutabilityHelper = _interopRequireDefault(require("immutability-helper"));

var _validators = require("../scripts/validators");

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var Cops = /*#__PURE__*/function () {
  function Cops(db) {
    (0, _classCallCheck2.default)(this, Cops);
    this.db = db;
    this.defaults = {
      order: 'DESC',
      orderBy: 'num_allegations',
      column: 'allegations'
    };
  }

  (0, _createClass2.default)(Cops, [{
    key: "init",
    value: function () {
      var _init = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.db.run("CREATE TABLE IF NOT EXISTS cops (\n\t\t\t\tid INTEGER PRIMARY KEY,\n\t\t\t\tfirst_name TEXT NOT NULL,\n\t\t\t\tlast_name TEXT NOT NULL,\n\t\t\t\tcommand_unit TEXT NOT NULL,\n\t\t\t\tprecinct INTEGER,\n\t\t\t\tshield_no INTEGER NOT NULL,\n\t\t\t\trank_abbrev TEXT NOT NULL,\n\t\t\t\trank_full TEXT NOT NULL,\n\t\t\t\tethnicity TEXT,\n\t\t\t\tgender TEXT,\n\t\t\t\tFOREIGN KEY(command_unit) REFERENCES command_units(unit_id),\n\t\t\t\tFOREIGN KEY(precinct) REFERENCES precincts(id)\n\t\t\t\t);");

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
      var _create = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(cop) {
        var command, match, precinct_id;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                command = cop.command_now;
                match = command.match(/(.*) (?:PCT)?(?:DET)?$/);
                precinct_id = match && match[1] ? parseInt(match[1]) || null : null; //populate 'cops' table

                _context2.prev = 3;
                _context2.next = 6;
                return this.db.run("\n\t\t\t\tINSERT INTO \n\t\t\t\t\tcops(\n\t\t\t\t\t\tid, \n\t\t\t\t\t\tfirst_name, \n\t\t\t\t\t\tlast_name, \n\t\t\t\t\t\tcommand_unit,\n\t\t\t\t\t\tprecinct, \n\t\t\t\t\t\tshield_no,\n\t\t\t\t\t\trank_abbrev,\n\t\t\t\t\t\trank_full,\n\t\t\t\t\t\tethnicity, \n\t\t\t\t\t\tgender )\n\t\t\t\tVALUES(\n\t\t\t\t\t'".concat(cop.unique_mos_id, "', \n\t\t\t\t\t'").concat(cop.first_name, "', \n\t\t\t\t\t'").concat(cop.last_name, "', \n\t\t\t\t\t'").concat(cop.command_now, "',\n\t\t\t\t\t'").concat(precinct_id, "',\n\t\t\t\t\t'").concat(cop.shield_no, "', \n\t\t\t\t\t'").concat(cop.rank_abbrev_now, "',\n\t\t\t\t\t'").concat(cop.rank_now, "',\n\t\t\t\t\t'").concat(cop.mos_ethnicity, "',\n\t\t\t\t\t'").concat(cop.mos_gender, "')"));

              case 6:
                _context2.next = 14;
                break;

              case 8:
                _context2.prev = 8;
                _context2.t0 = _context2["catch"](3);

                if (!(_context2.t0 && !_context2.t0.message.match(/SQLITE_CONSTRAINT:.*/))) {
                  _context2.next = 14;
                  break;
                }

                console.log(_context2.t0.message);
                console.log('error in populating cops');
                throw _context2.t0.message;

              case 14:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[3, 8]]);
      }));

      function create(_x) {
        return _create.apply(this, arguments);
      }

      return create;
    }()
  }, {
    key: "read",
    value: function () {
      var _read = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(orderBy, order, page, pageSize) {
        var offset, result;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if ((0, _validators.checkOrder)(order) === false) {
                  order = this.defaults.order;
                }

                if ((0, _validators.checkOrderBy)(orderBy) === false) {
                  orderBy = this.defaults.orderBy;
                }

                offset = pageSize * (page - 1);
                _context3.prev = 3;
                _context3.next = 6;
                return this.db.all("\n\t\t\tSELECT\n\t\t\t\t*,\n\t\t\t\tJSON_GROUP_ARRAY(JSON_OBJECT(\n\t\t\t\t\t'American Indian',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(american_indian * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Asian',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(asian * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Black',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(black * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Hispanic',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(hispanic * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'White',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(white * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Other Ethnicity',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(other_ethnicity * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Ethnicity Unknown',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(ethnicity_unknown * 1.0 / num_allegations * 100.0, 2) END\n\t\t\t\t)) AS race_percentages,\n\t\t\t\tJSON_GROUP_ARRAY(JSON_OBJECT(\n\t\t\t\t\t'Female',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(female * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Male',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(male * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Female (trans)',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(trans_female * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Male (trans)',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(trans_male * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Gender-nonconforming',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(gender_non_conforming * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Unknown/refused',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(gender_unknown * 1.0 / num_allegations * 100.0, 2) END\n\t\t\t\t)) AS gender_percentages\n\t\t\tFROM (\n\t\t\tSELECT \n\t\t\t\tcops.*,\n\t\t\t\tcmd_units.id AS command_unit_id,\n\t\t\t\tCASE \n\t\t\t\t\tWHEN COUNT(allegations.id) > 9\n\t\t\t\t\tTHEN (\n\t\t\t\t\tROUND(COUNT(CASE WHEN allegations.board_disposition LIKE 'Substantiated%' THEN 1 END)*1.0 / COUNT(allegations.id) * 100.0, 2))\n\t\t\t\tEND substantiated_percentage, \n\t\t\t\tCOUNT(*) AS num_allegations,\n\t\t\t\tCOUNT(CASE WHEN allegations.board_disposition LIKE 'Substantiated%' THEN 1 END) AS num_substantiated,\n\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%american indian%' THEN allegations.id END) AS american_indian,\n\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%asian%' THEN allegations.id END) AS asian,\n\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%black%' THEN allegations.id END) AS black,\n\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%hispanic%' THEN allegations.id END) AS hispanic,\n\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%white%' THEN allegations.id END) AS white,\n\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE 'Other Race' THEN allegations.id END) AS other_ethnicity,\n\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '' THEN allegations.id END) AS ethnicity_unknown,\n\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE 'male%' THEN allegations.id END) AS male,\n\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%female%' THEN allegations.id END) AS female,\n\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%Gender non-conforming%' THEN allegations.id END) AS gender_non_conforming,\n\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%Transman%' THEN allegations.id END) AS trans_male,\n\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%Transwoman%' THEN allegations.id END) AS trans_female,\n\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '' THEN allegations.id END) AS gender_unknown,\n\t\t\t\tCOUNT(DISTINCT complaints.id) AS num_complaints\n\t\t\tFROM \n\t\t\t\tcops \n\t\t\tJOIN \n\t\t\t\tallegations \n\t\t\tON \n\t\t\t\tcops.id = allegations.cop\n\t\t\t\tJOIN\n\t\t\t\t\tcomplaints\n\t\t\t\tON \n\t\t\t\t\tcomplaints.id = allegations.complaint_id \n\t\t\t\tJOIN\n\t\t\t\t\tcommand_units cmd_units\n\t\t\t\tON\n\t\t\t\t\tcops.command_unit = cmd_units.unit_id\n\t\t\tGROUP BY\n\t\t\t\tcops.id\n\t\t\t)\n\t\t\tGROUP BY\n\t\t\t\tid\n\t\t\tORDER BY\n\t\t\t\t".concat(orderBy, " ").concat(order, "\n\t\t\tLIMIT \n\t\t\t\t(?)\n\t\t\tOFFSET\n\t\t\t\t(?)\n\t\t"), pageSize, offset);

              case 6:
                result = _context3.sent;
                result.map(function (e) {
                  e.race_percentages = JSON.parse(e.race_percentages)[0];
                  e.gender_percentages = JSON.parse(e.gender_percentages)[0];
                });
                return _context3.abrupt("return", result);

              case 11:
                _context3.prev = 11;
                _context3.t0 = _context3["catch"](3);
                console.error(_context3.t0);

              case 14:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[3, 11]]);
      }));

      function read(_x2, _x3, _x4, _x5) {
        return _read.apply(this, arguments);
      }

      return read;
    }()
  }, {
    key: "readCop",
    value: function () {
      var _readCop = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4(id) {
        var result;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                _context4.next = 3;
                return this.db.get("\n\t\t\t\tSELECT\n\t\t\t\t\t*,\n\t\t\t\t\tROUND(num_substantiated * 1.0/num_allegations * 100.0, 2) AS substantiated_percentage,\n\t\t\t\tJSON_OBJECT(\n\t\t\t\t\t'American Indian',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(american_indian * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Asian',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(asian * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Black',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(black * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Hispanic',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(hispanic * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'White',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(white * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Other Ethnicity',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(other_ethnicity * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Ethnicity Unknown',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(ethnicity_unknown * 1.0 / num_allegations * 100.0, 2) END\n\t\t\t\t) AS race_percentages,\n\t\t\t\tJSON_OBJECT(\n\t\t\t\t\t'Female',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(female * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Male',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(male * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Female (trans)',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(trans_female * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Male (trans)',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(trans_male * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Gender-nonconforming',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(gender_non_conforming * 1.0 / num_allegations * 100.0, 2) END,\n\t\t\t\t\t'Unknown/refused',\n\t\t\t\t\tCASE WHEN num_allegations > 4 THEN\n\t\t\t\t\tROUND(gender_unknown * 1.0 / num_allegations * 100.0, 2) END\n\t\t\t\t) AS gender_percentages\n\t\t\t\tFROM(\n\t\t\t\t\tSELECT \n\t\t\t\t\t\tcops.*,\n\t\t\t\t\t\t(SELECT \n\t\t\t\t\t\t\tCOUNT(*) \n\t\t\t\t\t\tFROM \n\t\t\t\t\t\t\tallegations \n\t\t\t\t\t\tWHERE \n\t\t\t\t\t\t\tcops.id = allegations.cop) AS num_allegations,\n\t\t\t\t\t\t(SELECT\n\t\t\t\t\t\t\tCOUNT(DISTINCT complaints.id)\n\t\t\t\t\t\tFROM\n\t\t\t\t\t\t\tallegations\n\t\t\t\t\t\tINNER JOIN\n\t\t\t\t\t\t\tcomplaints\n\t\t\t\t\t\tON \n\t\t\t\t\t\t\tallegations.complaint_id = complaints.id\n\t\t\t\t\t\tWHERE \n\t\t\t\t\t\t\tcops.id = allegations.cop AND allegations.complaint_id = complaints.id) AS num_complaints,\n\t\t\t\t\t\t(SELECT\n\t\t\t\t\t\t\tCOUNT(\n\t\t\t\t\t\t\t\tCASE WHEN \n\t\t\t\t\t\t\t\t\tallegations.board_disposition LIKE 'Substantiated%' \n\t\t\t\t\t\t\t\tAND \n\t\t\t\t\t\t\t\t\tallegations.cop = cops.id THEN 1 END)\n\t\t\t\t\t\tFROM\n\t\t\t\t\t\t\tallegations) AS num_substantiated,\n\t\t\t\t\t\t(SELECT \n\t\t\t\t\t\t\tcommand_units.id \n\t\t\t\t\t\tFROM \n\t\t\t\t\t\t\tcommand_units \n\t\t\t\t\t\tWHERE \n\t\t\t\t\t\t\tcops.command_unit = command_units.unit_id) AS command_unit_id,\n\t\t\t\t\t\t(SELECT\n\t\t\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%indian%' THEN allegations.id END)\n\t\t\t\t\t\tFROM\n\t\t\t\t\t\t\tallegations\n\t\t\t\t\t\tWHERE\n\t\t\t\t\t\t\tallegations.cop = cops.id) AS american_indian,\n\t\t\t\t\t\t(SELECT\n\t\t\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%asian%' THEN allegations.id END)\n\t\t\t\t\t\tFROM\n\t\t\t\t\t\t\tallegations\n\t\t\t\t\t\tWHERE\n\t\t\t\t\t\t\tallegations.cop = cops.id) AS asian,\n\t\t\t\t\t\t(SELECT\n\t\t\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%black%' THEN allegations.id END)\n\t\t\t\t\t\tFROM\n\t\t\t\t\t\t\tallegations\n\t\t\t\t\t\tWHERE\n\t\t\t\t\t\t\tallegations.cop = cops.id) AS black,\n\t\t\t\t\t\t(SELECT\n\t\t\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%hispanic%' THEN allegations.id END)\n\t\t\t\t\t\tFROM\n\t\t\t\t\t\t\tallegations\n\t\t\t\t\t\tWHERE\n\t\t\t\t\t\t\tallegations.cop = cops.id) AS hispanic,\n\t\t\t\t\t\t(SELECT\n\t\t\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%white%' THEN allegations.id END)\n\t\t\t\t\t\tFROM\n\t\t\t\t\t\t\tallegations\n\t\t\t\t\t\tWHERE\n\t\t\t\t\t\t\tallegations.cop = cops.id) AS white,\n\t\t\t\t\t\t(SELECT\n\t\t\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%Other Race%' THEN allegations.id END)\n\t\t\t\t\t\tFROM\n\t\t\t\t\t\t\tallegations\n\t\t\t\t\t\tWHERE\n\t\t\t\t\t\t\tallegations.cop = cops.id) AS other_ethnicity,\n\t\t\t\t\t\t(SELECT\n\t\t\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '' THEN allegations.id END)\n\t\t\t\t\t\tFROM\n\t\t\t\t\t\t\tallegations\n\t\t\t\t\t\tWHERE\n\t\t\t\t\t\t\tallegations.cop = cops.id) AS ethnicity_unknown,\n\t\t\t\t\t\t(SELECT\n\t\t\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE 'male%' THEN allegations.id END)\n\t\t\t\t\t\tFROM\n\t\t\t\t\t\t\tallegations\n\t\t\t\t\t\tWHERE\n\t\t\t\t\t\t\tallegations.cop = cops.id) AS male,\n\t\t\t\t\t\t(SELECT\n\t\t\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%female%' THEN allegations.id END)\n\t\t\t\t\t\tFROM\n\t\t\t\t\t\t\tallegations\n\t\t\t\t\t\tWHERE\n\t\t\t\t\t\t\tallegations.cop = cops.id) AS female,\n\t\t\t\t\t\t(SELECT\n\t\t\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%Gender non-conforming%' THEN allegations.id END)\n\t\t\t\t\t\tFROM\n\t\t\t\t\t\t\tallegations\n\t\t\t\t\t\tWHERE\n\t\t\t\t\t\t\tallegations.cop = cops.id) AS gender_non_conforming,\n\t\t\t\t\t\t(SELECT\n\t\t\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%Transman%' THEN allegations.id END)\n\t\t\t\t\t\tFROM\n\t\t\t\t\t\t\tallegations\n\t\t\t\t\t\tWHERE\n\t\t\t\t\t\t\tallegations.cop = cops.id) AS trans_male,\n\t\t\t\t\t\t(SELECT\n\t\t\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%Transwoman%' THEN allegations.id END)\n\t\t\t\t\t\tFROM\n\t\t\t\t\t\t\tallegations\n\t\t\t\t\t\tWHERE\n\t\t\t\t\t\t\tallegations.cop = cops.id) AS trans_female,\n\t\t\t\t\t\t(SELECT\n\t\t\t\t\t\t\tCOUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '' THEN allegations.id END)\n\t\t\t\t\t\tFROM\n\t\t\t\t\t\t\tallegations\n\t\t\t\t\t\tWHERE\n\t\t\t\t\t\t\tallegations.cop = cops.id) AS gender_unknown\n\t\t\t\t\tFROM\n\t\t\t\t\t\tcops\n\t\t\t\t\tWHERE \n\t\t\t\t\t\tcops.id = (?)\n\t\t\t\t\t)\n\t\t\t\t", id);

              case 3:
                result = _context4.sent;

                if (result !== undefined) {
                  result.race_percentages = JSON.parse(result.race_percentages);
                  result.gender_percentages = JSON.parse(result.gender_percentages);
                }

                return _context4.abrupt("return", result);

              case 8:
                _context4.prev = 8;
                _context4.t0 = _context4["catch"](0);
                console.error(_context4.t0);

              case 11:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[0, 8]]);
      }));

      function readCop(_x6) {
        return _readCop.apply(this, arguments);
      }

      return readCop;
    }() //this is to get the total # of rows in order to 
    //populate the pagination component

  }, {
    key: "total",
    value: function () {
      var _total = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5() {
        var result;
        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                _context5.next = 3;
                return this.db.all("\n\t\t\t\tSELECT\n\t\t\t\t\tCOUNT(*) AS rows\n\t\t\t\tFROM\n\t\t\t\t\tcops \n\t\t\t\t");

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

      function total() {
        return _total.apply(this, arguments);
      }

      return total;
    }()
  }, {
    key: "getComplaintsPerDate",
    value: function () {
      var _getComplaintsPerDate = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee6(id) {
        var result;
        return _regenerator.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                _context6.next = 3;
                return this.db.all("\n\t\t\t\tSELECT\n\t\t\t\t\t*,\n\t\t\t\t\tDATE(date_received) as date_received,\n\t\t\t\t\tCOUNT(*) as count\n\t\t\t\tFROM\n\t\t\t\t\t(SELECT\n\t\t\t\t\t\tcom.*\n\t\t\t\t\tFROM\n\t\t\t\t\t\tcops c\n\t\t\t\t\tINNER JOIN\n\t\t\t\t\t\tallegations a\n\t\t\t\t\tON\n\t\t\t\t\t\tc.id = a.cop\n\t\t\t\t\t\tINNER JOIN\n\t\t\t\t\t\t\tcomplaints com\n\t\t\t\t\t\tON \n\t\t\t\t\t\t\tcom.id = a.complaint_id\n\t\t\t\t\tWHERE\n\t\t\t\t\t\tc.id = (?)\n\t\t\t\t\tGROUP BY\n\t\t\t\t\t\tcom.id)\n\t\t\t\tGROUP BY\n\t\t\t\t\tdate_received\n\t\t\t", id);

              case 3:
                result = _context6.sent;
                return _context6.abrupt("return", result);

              case 7:
                _context6.prev = 7;
                _context6.t0 = _context6["catch"](0);
                console.error(_context6.t0);

              case 10:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this, [[0, 7]]);
      }));

      function getComplaintsPerDate(_x7) {
        return _getComplaintsPerDate.apply(this, arguments);
      }

      return getComplaintsPerDate;
    }() //updated to include join with cop_at_time_of_complaint

  }, {
    key: "getComplaints",
    value: function () {
      var _getComplaints = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee7(id) {
        var result;
        return _regenerator.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;
                _context7.next = 3;
                return this.db.all("\n\t\t\t\tSELECT\n\t\t\t\t\tid,\n\t\t\t\t\tdate_received,\n\t\t\t\t\tdate_closed,\n\t\t\t\t\tprecinct,\n\t\t\t\t\tcontact_reason,\n\t\t\t\t\toutcome_description,\n\t\t\t\t\tcop_rank,\n\t\t\t\t\tcop_rank_full,\n\t\t\t\t\tcop_command_unit,\n\t\t\t\t\tcop_command_unit_full,\n\t\t\t\t\tcommand_unit_id,\n\t\t\t\t\tCOUNT(CASE WHEN a_complaint_id = id THEN 1 END) AS num_allegations_on_complaint,\n\t\t\t\t\tJSON_GROUP_ARRAY(JSON_OBJECT('allegation_id',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ta_id,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'complainant_ethnicity',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ta_complainant_ethnicity,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'complainant_gender',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ta_complainant_gender,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'complainant_age_incident',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ta_complainant_age_incident,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'complaint_id',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ta_complaint_id,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'cop_command_unit', \n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ta_cop_command_unit,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'precinct',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ta_precinct,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'fado_type',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ta_fado_type,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'description',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ta_description,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'board_disposition',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ta_board_disposition)) as allegations\n\t\t\t\tFROM(\n\t\t\t\tSELECT\n\t\t\t\t\ta.id AS a_id,\n\t\t\t\t\ta.cop AS a_cop,\n\t\t\t\t\ta.cop_command_unit AS a_cop_command_unit,\n\t\t\t\t\ta.precinct AS a_precinct,\n\t\t\t\t\ta.complaint_id AS a_complaint_id,\n\t\t\t\t\ta.complainant_ethnicity AS a_complainant_ethnicity,\n\t\t\t\t\ta.complainant_gender AS a_complainant_gender,\n\t\t\t\t\ta.complainant_age_incident AS a_complainant_age_incident,\n\t\t\t\t\ta.fado_type AS a_fado_type,\n\t\t\t\t\ta.description AS a_description,\n\t\t\t\t\ta.board_disposition AS a_board_disposition,\n\t\t\t\t\tcomplaints.id as id,\n\t\t\t\t\tcomplaints.date_received,\n\t\t\t\t\tcomplaints.date_closed,\n\t\t\t\t\tcomplaints.precinct,\n\t\t\t\t\tcomplaints.contact_reason,\n\t\t\t\t\tcomplaints.outcome_description,\n\t\t\t\t\tcop.rank AS cop_rank,\n\t\t\t\t\tcop.rank_full AS cop_rank_full,\n\t\t\t\t\tcop.assignment AS cop_command_unit,\n\t\t\t\t\tcop.command_unit_full AS cop_command_unit_full,\n\t\t\t\t\tcommand_units.id AS command_unit_id\n\t\t\t\tFROM\n\t\t\t\t\tcops \n\t\t\t\tJOIN \n\t\t\t\t\tallegations a\n\t\t\t\tON \n\t\t\t\t\ta.cop = cops.id \n\t\t\t\tJOIN \n\t\t\t\t\tcomplaints \n\t\t\t\tON \n\t\t\t\t\tcomplaints.id = a.complaint_id \n\t\t\t\tJOIN \n\t\t\t\t\tcop_at_time_of_complaint cop \n\t\t\t\tON \n\t\t\t\t\tcop.cop_id = cops.id AND cop.complaint_id = complaints.id\n\t\t\t\tJOIN\n\t\t\t\t\tcommand_units\n\t\t\t\tON\n\t\t\t\t\tcop.assignment = command_units.unit_id\n\t\t\t\tWHERE \n\t\t\t\t\tcops.id = (?)\n\t\t\t\tGROUP BY\n\t\t\t\t\ta.id)\n\t\t\t\tGROUP BY\n\t\t\t\t\tid\n\t\t\t", id);

              case 3:
                result = _context7.sent;
                //the allegations propery is not correctly formatted as a JSON object
                result.map(function (e) {
                  e.allegations = JSON.parse(e.allegations);
                  e.date_received = new Date(e.date_received + ' 12:00:00 GMT-0400');
                  e.date_closed = new Date(e.date_closed + ' 12:00:00 GMT-0400');
                });
                return _context7.abrupt("return", result);

              case 8:
                _context7.prev = 8;
                _context7.t0 = _context7["catch"](0);
                console.error(_context7.t0);

              case 11:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this, [[0, 8]]);
      }));

      function getComplaints(_x8) {
        return _getComplaints.apply(this, arguments);
      }

      return getComplaints;
    }()
  }, {
    key: "getYearlyStats",
    value: function () {
      var _getYearlyStats = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee8(column, id) {
        var result;
        return _regenerator.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                if ((0, _validators.checkOrderBy)(column) === false) {
                  column = this.defaults.column;
                }

                _context8.prev = 1;
                _context8.next = 4;
                return this.db.all("\n\t\t\t\tSELECT\n\t\t\t\t\tCAST(year AS INTEGER) AS year,\n\t\t\t\t\tCOUNT(*) AS count\n\t\t\t\tFROM\n\t\t\t\t\t(\n\t\t\t\tSELECT\n\t\t\t\t\tcops.*,\n\t\t\t\t\tstrftime('%Y', complaints.date_received) AS year\n\t\t\t\tFROM\n\t\t\t\t\tcops\n\t\t\t\tINNER JOIN\n\t\t\t\t\tallegations\n\t\t\t\tON \n\t\t\t\t\tallegations.cop = cops.id\n\t\t\t\tINNER JOIN\n\t\t\t\t\tcomplaints\n\t\t\t\tON\n\t\t\t\t\tcomplaints.id = allegations.complaint_id\n\t\t\t\tWHERE \n\t\t\t\t\tcops.id = (?)\n\t\t\t\tGROUP BY\n\t\t\t\t\t\"".concat(column, "\".id\n\t\t\t\t)\n\t\t\t\tGROUP BY\n\t\t\t\t\tyear\n\t\t\t"), id);

              case 4:
                result = _context8.sent;
                return _context8.abrupt("return", result);

              case 8:
                _context8.prev = 8;
                _context8.t0 = _context8["catch"](1);
                console.error(_context8.t0);

              case 11:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this, [[1, 8]]);
      }));

      function getYearlyStats(_x9, _x10) {
        return _getYearlyStats.apply(this, arguments);
      }

      return getYearlyStats;
    }() //returns the total count of *complaints* a cop has in each precinct, 
    //using the complaints.precinct row 

  }, {
    key: "getLocationStats",
    value: function () {
      var _getLocationStats = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee9(column, id) {
        var result;
        return _regenerator.default.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                if ((0, _validators.checkOrderBy)(column) === false) {
                  column = this.defaults.column;
                }

                _context9.prev = 1;
                _context9.next = 4;
                return this.db.all("\n\t\t\t\tSELECT\n\t\t\t\t\tprecinct,\n\t\t\t\t\tCOUNT(*) as count\n\t\t\t\tFROM\n\t\t\t\t\t(SELECT \n\t\t\t\t\t\tcomplaints.precinct\n\t\t\t\t\tFROM\n\t\t\t\t\t\tcops c\n\t\t\t\t\tINNER JOIN\n\t\t\t\t\t\tallegations\n\t\t\t\t\tON\n\t\t\t\t\t\tc.id = allegations.cop\n\t\t\t\t\t\tINNER JOIN\n\t\t\t\t\t\t\tcomplaints\n\t\t\t\t\t\tON \n\t\t\t\t\t\t\tcomplaints.id = allegations.complaint_id\n\t\t\t\t\tWHERE\n\t\t\t\t\t\tc.id = (?)\n\t\t\t\t\tGROUP BY\n\t\t\t\t\t\t".concat(column, ".id)\n\t\t\t\tGROUP BY\n\t\t\t\t\tprecinct\n\t\t\t\t"), id);

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

      function getLocationStats(_x11, _x12) {
        return _getLocationStats.apply(this, arguments);
      }

      return getLocationStats;
    }()
  }, {
    key: "getSubstantiatedPercentage",
    value: function () {
      var _getSubstantiatedPercentage = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee10(id) {
        var result;
        return _regenerator.default.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.prev = 0;
                _context10.next = 3;
                return this.db.all("\n\t\t\t\tSELECT\n\t\t\t\t\tcops.*,\n\t\t\t\t\tCASE \n\t\t\t\t\t\tWHEN COUNT(*) > 9\n\t\t\t\t\t\tTHEN (\n\t\t\t\t\t\tCOUNT(CASE WHEN allegations.board_disposition LIKE 'Substantiated%' THEN 1 END)*1.0 / COUNT(*) * 100.0)\n\t\t\t\t\t\tEND substantiated_percentage,\n\t\t\t\t\tCOUNT(*) AS num_allegations\n\t\t\t\tFROM \n\t\t\t\t\tcops\n\t\t\t\tINNER JOIN\n\t\t\t\t\tallegations\n\t\t\t\tON\n\t\t\t\t\tcops.id = allegations.cop\n\t\t\t\tWHERE\n\t\t\t\t\tcops.id = (?)\n\t\t\t\tGROUP BY \n\t\t\t\t\tcops.id\n\t\t\t\tORDER BY\n\t\t\t\t\tsubstantiated_percentage DESC\n\t\t\t\t", id);

              case 3:
                result = _context10.sent;
                console.log(result === null);
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

      function getSubstantiatedPercentage(_x13) {
        return _getSubstantiatedPercentage.apply(this, arguments);
      }

      return getSubstantiatedPercentage;
    }() // async readCop(id) {
    // 	try {
    // 		const result = await this.db.all(`
    // 			SELECT
    // 				*,
    // 			CASE WHEN num_complaints > 4 THEN
    // 			ROUND(american_indian * 1.0 / num_complaints * 100.0, 2) END percentage_american_indian_complainants,
    // 			CASE WHEN num_complaints > 4 THEN
    // 			ROUND(asian * 1.0 / num_complaints * 100.0, 2) END percentage_asian_complainants,
    // 			CASE WHEN num_complaints > 4 THEN
    // 			ROUND(black * 1.0 / num_complaints * 100.0, 2) END percentage_black_complainants,
    // 			CASE WHEN num_complaints > 4 THEN
    // 			ROUND(hispanic * 1.0 / num_complaints * 100.0, 2) END percentage_hispanic_complainants,
    // 			CASE WHEN num_complaints > 4 THEN
    // 			ROUND(white * 1.0 / num_complaints * 100.0, 2) END percentage_white_complainants,
    // 			CASE WHEN num_complaints > 4 THEN
    // 			ROUND(other_ethnicity * 1.0 / num_complaints * 100.0, 2) END percentage_other_ethnicity_complainants,
    // 			CASE WHEN num_complaints > 4 THEN
    // 			ROUND(ethnicity_unknown * 1.0 / num_complaints * 100.0, 2) END percentage_ethnicity_unknown_complainants,
    // 			CASE WHEN num_complaints > 4 THEN
    // 			ROUND(male * 1.0 / num_complaints * 100.0, 2) END percentage_male_complainants,
    // 			CASE WHEN num_complaints > 4 THEN
    // 			ROUND(female * 1.0 / num_complaints * 100.0, 2) END percentage_female_complainants,
    // 			CASE WHEN num_complaints > 4 THEN
    // 			ROUND(gender_unknown * 1.0 / num_complaints * 100.0, 2) END percentage_gender_unknown_complainants
    // 			FROM (
    // 			SELECT 
    // 				cops.*,
    // 				cmd_units.id as command_unit_id,
    // 				CASE 
    // 					WHEN COUNT(allegations.id) > 9
    // 					THEN (
    // 					ROUND(COUNT(CASE WHEN allegations.board_disposition LIKE 'Substantiated%' THEN 1 END)*1.0 / COUNT(allegations.id) * 100.0, 2))
    // 				END substantiated_percentage, 
    // 				COUNT(*) AS num_allegations,
    // 				COUNT(CASE WHEN allegations.board_disposition LIKE 'Substantiated%' THEN 1 END) AS num_substantiated,
    // 				COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%indian%' THEN complaint_id END) AS american_indian,
    // 				COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%asian%' THEN complaint_id END) AS asian,
    // 				COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%black%' THEN complaint_id END) AS black,
    // 				COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%hispanic%' THEN complaint_id END) AS hispanic,
    // 				COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '%white%' THEN complaint_id END) AS white,
    // 				COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE 'Other Race' THEN complaint_id END) AS other_ethnicity,
    // 				COUNT(DISTINCT CASE WHEN allegations.complainant_ethnicity LIKE '' THEN complaint_id END) AS ethnicity_unknown,
    // 				COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE 'male%' THEN complaint_id END) AS male,
    // 				COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%female%' THEN complaint_id END) AS female,
    // 				COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%Gender non-conforming%' THEN complaint_id END) AS gender_non_conforming,
    // 				COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%Transman%' THEN complaint_id END) AS trans_male,
    // 				COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '%Transwoman%' THEN complaint_id END) AS trans_female,
    // 				COUNT(DISTINCT CASE WHEN allegations.complainant_gender LIKE '' THEN complaint_id END) AS gender_unknown,
    // 				COUNT(DISTINCT complaints.id) AS num_complaints
    // 			FROM 
    // 				cops 
    // 			JOIN 
    // 				allegations 
    // 			ON 
    // 				cops.id = allegations.cop
    // 				JOIN
    // 					complaints
    // 				ON 
    // 					complaints.id = allegations.complaint_id 
    // 				JOIN
    // 					command_units cmd_units
    // 				ON
    // 					cops.command_unit = cmd_units.unit_id
    // 			WHERE
    // 				cops.id = (?)
    // 			)
    // 		`, id)
    // 		return result
    // 	} catch(error) {
    // 		console.error(error);
    // 	}
    // }

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
                  _context11.next = 3;
                  break;
                }

                console.log('error');
                return _context11.abrupt("return", 'error');

              case 3:
                if (!searchQuery.includes(' ')) {
                  _context11.next = 10;
                  break;
                }

                searchQuery = searchQuery.split(' ');
                _context11.next = 7;
                return this.searchFullName(searchQuery);

              case 7:
                results = _context11.sent;
                _context11.next = 19;
                break;

              case 10:
                if (isNaN(parseInt(searchQuery))) {
                  _context11.next = 16;
                  break;
                }

                _context11.next = 13;
                return this.searchBadgeNumber(parseInt(searchQuery));

              case 13:
                results = _context11.sent;
                _context11.next = 19;
                break;

              case 16:
                _context11.next = 18;
                return this.searchSingleName(searchQuery);

              case 18:
                results = _context11.sent;

              case 19:
                return _context11.abrupt("return", results);

              case 20:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function search(_x14) {
        return _search.apply(this, arguments);
      }

      return search;
    }()
  }, {
    key: "searchSingleName",
    value: function () {
      var _searchSingleName = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee12(searchQuery) {
        var results;
        return _regenerator.default.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.prev = 0;
                results = {
                  type: 'cop',
                  identifier: ['last_name', 'shield_no'],
                  display: ['first_name', 'last_name']
                };
                _context12.next = 4;
                return this.db.all("\n\t\t\t\t\tSELECT \n\t\t\t\t\t\t*\n\t\t\t\t\tFROM \n\t\t\t\t\t\tcops\n\t\t\t\t\tWHERE\n\t\t\t\t\t\tlast_name LIKE '%".concat(searchQuery, "%'\n\t\t\t\t\tOR\n\t\t\t\t\t\tfirst_name LIKE '%").concat(searchQuery, "%'\n\t\t\t"));

              case 4:
                results.results = _context12.sent;
                return _context12.abrupt("return", results);

              case 8:
                _context12.prev = 8;
                _context12.t0 = _context12["catch"](0);
                console.error(_context12.t0);

              case 11:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this, [[0, 8]]);
      }));

      function searchSingleName(_x15) {
        return _searchSingleName.apply(this, arguments);
      }

      return searchSingleName;
    }()
  }, {
    key: "searchBadgeNumber",
    value: function () {
      var _searchBadgeNumber = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee13(searchQuery) {
        var results;
        return _regenerator.default.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                _context13.prev = 0;
                results = {
                  type: 'cop',
                  identifier: ['last_name', 'shield_no'],
                  display: ['first_name', 'last_name']
                };
                _context13.next = 4;
                return this.db.all("\n\t\t\t\t\tSELECT \n\t\t\t\t\t\t*\n\t\t\t\t\tFROM \n\t\t\t\t\t\tcops\n\t\t\t\t\tWHERE\n\t\t\t\t\t\tshield_no == (?)\n\t\t\t", searchQuery);

              case 4:
                results.results = _context13.sent;
                return _context13.abrupt("return", results);

              case 8:
                _context13.prev = 8;
                _context13.t0 = _context13["catch"](0);
                console.error(_context13.t0);

              case 11:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this, [[0, 8]]);
      }));

      function searchBadgeNumber(_x16) {
        return _searchBadgeNumber.apply(this, arguments);
      }

      return searchBadgeNumber;
    }()
  }, {
    key: "searchFullName",
    value: function () {
      var _searchFullName = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee14(searchQuery) {
        var results;
        return _regenerator.default.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                _context14.prev = 0;
                results = {
                  type: 'cop',
                  identifier: ['name'],
                  display: ['first_name', 'last_name']
                };
                _context14.next = 4;
                return this.db.all("\n\t\t\t\t\tSELECT \n\t\t\t\t\t\t*\n\t\t\t\t\tFROM \n\t\t\t\t\t\tcops\n\t\t\t\t\tWHERE (\n\t\t\t\t\t\tlast_name LIKE '%".concat(searchQuery[1], "%'\n\t\t\t\t\t\t\tOR\n\t\t\t\t\t\tlast_name LIKE '%").concat(searchQuery[0], "%'\n\t\t\t\t\t)\n\t\t\t\t\tAND (\n\t\t\t\t\t\tfirst_name LIKE '%").concat(searchQuery[0], "%'\n\t\t\t\t\tOR\n\t\t\t\t\t\tfirst_name LIKE '%").concat(searchQuery[1], "%'\n\t\t\t\t\t)\n\t\t\t"));

              case 4:
                results.results = _context14.sent;
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

      function searchFullName(_x17) {
        return _searchFullName.apply(this, arguments);
      }

      return searchFullName;
    }()
  }, {
    key: "augment",
    value: function () {
      var _augment = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee15(csvPath, rankAbbrevs) {
        var _this = this;

        var csv, commandCsv, results, _iterator, _step, _loop;

        return _regenerator.default.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                _context15.next = 2;
                return this.addCommandUnitFullColumn();

              case 2:
                csv = _fs.default.readFileSync(csvPath);
                _context15.next = 5;
                return (0, _neatCsv.default)(csv);

              case 5:
                commandCsv = _context15.sent;
                _context15.next = 8;
                return this.getCopsToUpdate();

              case 8:
                results = _context15.sent;
                _iterator = _createForOfIteratorHelper(results);

                try {
                  _loop = function _loop() {
                    var result = _step.value;
                    var cmdUnitFull = commandCsv.find(function (e) {
                      return e.Abbreviation === result.command_unit;
                    });

                    if (cmdUnitFull != undefined) {
                      _this.updateCommandUnitFullColumn(result.id, cmdUnitFull['Command Name']);
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

              case 11:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));

      function augment(_x18, _x19) {
        return _augment.apply(this, arguments);
      }

      return augment;
    }()
  }, {
    key: "getCopsToUpdate",
    value: function () {
      var _getCopsToUpdate = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee16() {
        var results;
        return _regenerator.default.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                _context16.next = 2;
                return this.db.all("\n\t\t\tSELECT *\n\t\t\tFROM cops");

              case 2:
                results = _context16.sent;
                return _context16.abrupt("return", results);

              case 4:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee16, this);
      }));

      function getCopsToUpdate() {
        return _getCopsToUpdate.apply(this, arguments);
      }

      return getCopsToUpdate;
    }()
  }, {
    key: "addCommandUnitFullColumn",
    value: function () {
      var _addCommandUnitFullColumn = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee17() {
        return _regenerator.default.wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                this.db.run("\n\t\t\tALTER TABLE\n\t\t\t\tcops\n\t\t\tADD COLUMN \n\t\t\t\tcommand_unit_full TEXT");

              case 1:
              case "end":
                return _context17.stop();
            }
          }
        }, _callee17, this);
      }));

      function addCommandUnitFullColumn() {
        return _addCommandUnitFullColumn.apply(this, arguments);
      }

      return addCommandUnitFullColumn;
    }()
  }, {
    key: "updateCommandUnitFullColumn",
    value: function () {
      var _updateCommandUnitFullColumn = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee18(id, cmdUnitFull) {
        return _regenerator.default.wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                this.db.run("\n\t\t\tUPDATE \n\t\t\t\tcops \n\t\t\tSET\n\t\t\t\tcommand_unit_full = '".concat(cmdUnitFull, "'\n\t\t\tWHERE\n\t\t\t\tid = ").concat(id));

              case 1:
              case "end":
                return _context18.stop();
            }
          }
        }, _callee18, this);
      }));

      function updateCommandUnitFullColumn(_x20, _x21) {
        return _updateCommandUnitFullColumn.apply(this, arguments);
      }

      return updateCommandUnitFullColumn;
    }()
  }]);
  return Cops;
}();

exports.Cops = Cops;