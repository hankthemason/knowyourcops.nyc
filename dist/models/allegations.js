"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Allegations = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var Allegations = /*#__PURE__*/function () {
  function Allegations(db) {
    (0, _classCallCheck2.default)(this, Allegations);
    this.db = db;
  }

  (0, _createClass2.default)(Allegations, [{
    key: "init",
    value: function () {
      var _init = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.db.run("CREATE TABLE IF NOT EXISTS allegations (\n\t\t\tid INTEGER PRIMARY KEY AUTOINCREMENT,\n\t\t\tcop INTEGER,\n\t\t\tcop_command_unit TEXT,\n\t\t\tprecinct INTEGER,\n\t\t\tcomplaint_id INTEGER,\n\t\t\tcomplainant_ethnicity TEXT,\n\t\t\tcomplainant_gender TEXT,\n\t\t\tcomplainant_age_incident INTEGER,\n\t\t\tfado_type TEXT,\n\t\t\tdescription TEXT,\n\t\t\tboard_disposition TEXT,\n\t\t\tFOREIGN KEY(cop) REFERENCES cops(id),\n\t\t\tFOREIGN KEY(cop_command_unit) REFERENCES command_units(unit_id),\n\t\t\tFOREIGN KEY(precinct) REFERENCES precincts(id),\n\t\t\tFOREIGN KEY(complaint_id) REFERENCES complaints(id)\n\t\t\t);");

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
      var _create = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(allegation) {
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return this.db.run("\n\t\t\t\tINSERT INTO \n\t\t\t\t\tallegations(\n\t\t\t\t\t\tid, \n\t\t\t\t\t\tcop, \n\t\t\t\t\t\tcop_command_unit, \n\t\t\t\t\t\tprecinct, \n\t\t\t\t\t\tcomplaint_id,\n\t\t\t\t\t\tcomplainant_ethnicity,\n\t\t\t\t\t\tcomplainant_gender, \n\t\t\t\t\t\tcomplainant_age_incident,\n\t\t\t\t\t\tfado_type, \n\t\t\t\t\t\tdescription,\n\t\t\t\t\t\tboard_disposition)\n\t\t\t\tVALUES(\n\t\t\t\t\tNULL, \n\t\t\t\t\t'".concat(allegation.unique_mos_id, "', \n\t\t\t\t\t'").concat(allegation.command_at_incident, "',\n\t\t\t\t\t'").concat(allegation.precinct, "', \n\t\t\t\t\t'").concat(allegation.complaint_id, "',\n\t\t\t\t\t'").concat(allegation.complainant_ethnicity, "', \n\t\t\t\t\t'").concat(allegation.complainant_gender, "',\n\t\t\t\t\t'").concat(allegation.complainant_age_incident, "', \n\t\t\t\t\t'").concat(allegation.fado_type, "', \n\t\t\t\t\t'").concat(allegation.allegation, "',\n\t\t\t\t\t'").concat(allegation.board_disposition, "')"));

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
                console.log('error in populating allegations');
                console.log(allegation);
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
    key: "read",
    value: function () {
      var _read = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3() {
        var result;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return this.db.all("\n\t\t\t\tSELECT \n\t\t\t\t\tallegations.*, \n\t\t\t\t\tcomplaints.complainant_ethnicity\n\t\t\t\tFROM \n\t\t\t\t\tallegations\n\t\t\t\tINNER JOIN\n\t\t\t\t\tcomplaints\n\t\t\t\tON\n\t\t\t\t\tallegations.complaint_id = complaints.id\n\t\t\t\t");

              case 3:
                result = _context3.sent;
                return _context3.abrupt("return", result);

              case 7:
                _context3.prev = 7;
                _context3.t0 = _context3["catch"](0);
                console.error(_context3.t0);

              case 10:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 7]]);
      }));

      function read() {
        return _read.apply(this, arguments);
      }

      return read;
    }()
  }, {
    key: "getSubstantiated",
    value: function () {
      var _getSubstantiated = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4(id) {
        var result;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                console.log('id: ' + id);
                _context4.next = 4;
                return this.db.all("\n\t\t\t\tSELECT \n\t\t\t\t\tCOUNT(*) AS count\n\t\t\t\tFROM \n\t\t\t\t\tallegations\n\t\t\t\tWHERE \n\t\t\t\t\tcop = '".concat(id, "'\n\t\t\t\tAND \n\t\t\t\t\tboard_disposition LIKE 'Substantiated%'\n\t\t\t\t"));

              case 4:
                result = _context4.sent;
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

      function getSubstantiated(_x2) {
        return _getSubstantiated.apply(this, arguments);
      }

      return getSubstantiated;
    }()
  }]);
  return Allegations;
}();

exports.Allegations = Allegations;