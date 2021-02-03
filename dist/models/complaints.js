"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Complaints = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _validators = require("../scripts/validators");

var Complaints = /*#__PURE__*/function () {
  function Complaints(db) {
    (0, _classCallCheck2.default)(this, Complaints);
    this.db = db;
    this.defaults = {
      order: 'DESC',
      orderBy: 'num_allegations',
      column: 'allegations'
    };
  }

  (0, _createClass2.default)(Complaints, [{
    key: "init",
    value: function () {
      var _init = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.db.run("CREATE TABLE IF NOT EXISTS complaints (\n\t\t\tid INTEGER PRIMARY KEY,\n\t\t\tdate_received DATE,\n\t\t\tdate_closed DATE,\n\t\t\tprecinct INTEGER,\n\t\t\tcontact_reason TEXT,\n\t\t\toutcome_description TEXT,\n\t\t\tFOREIGN KEY(precinct) REFERENCES precincts(id)\n\t\t\t);");

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
      var _create = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(complaint) {
        var month_received, month_closed;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                month_received = complaint.month_received;
                month_received = month_received.length < 2 ? month_received.padStart(2, '0') : month_received;
                month_closed = complaint.month_closed;
                month_closed = month_closed.length < 2 ? month_closed.padStart(2, '0') : month_closed;
                _context2.next = 7;
                return this.db.run("\n\t\t\t\tINSERT INTO \n\t\t\t\t\tcomplaints(\n\t\t\t\t\t\tid, \n\t\t\t\t\t\tdate_received, \n\t\t\t\t\t\tdate_closed, \n\t\t\t\t\t\tprecinct, \n\t\t\t\t\t\tcontact_reason, \n\t\t\t\t\t\toutcome_description)\n\t\t\t\tVALUES(\n\t\t\t\t\t'".concat(complaint.complaint_id, "', \n\t\t\t\t\t'").concat(complaint.year_received, "-").concat(month_received, "-01', \n\t\t\t\t\t'").concat(complaint.year_closed, "-").concat(month_closed, "-01',\n\t\t\t\t\t'").concat(complaint.precinct, "', \n\t\t\t\t\t'").concat(complaint.contact_reason, "', \n\t\t\t\t\t'").concat(complaint.outcome_description, "')"));

              case 7:
                _context2.next = 16;
                break;

              case 9:
                _context2.prev = 9;
                _context2.t0 = _context2["catch"](0);

                if (!(_context2.t0 && !_context2.t0.message.match(/SQLITE_CONSTRAINT:.*/))) {
                  _context2.next = 16;
                  break;
                }

                console.log(_context2.t0.message);
                console.log('error in populating complaints');
                console.log(complaint);
                throw _context2.t0.message;

              case 16:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 9]]);
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
                if (!(0, _validators.checkOrder)(order)) {
                  order = this.defaults.order;
                }

                if (!(0, _validators.checkOrderBy)(orderBy)) {
                  orderBy = this.defaults.orderBy;
                }

                offset = pageSize * (page - 1);
                _context3.prev = 3;
                _context3.next = 6;
                return this.db.all("\n\t\t\t\tSELECT\n\t\t\t\t\tcomplaints.*,\n\t\t\t\t\tCOUNT(*) AS num_allegations,\n\t\t\t\t\tJSON_GROUP_ARRAY(JSON_OBJECT('allegation_id',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ta.id,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'complaint_id',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ta.complaint_id,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'cop_full_name',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcops.first_name || ' ' || cops.last_name,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'cop_id',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcops.id,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'badge_number',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcops.shield_no,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'cop_rank_abbrev',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcops.rank_abbrev,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'cop_rank_full',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcops.rank_full,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'cop_ethnicity',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcops.ethnicity,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'cop_gender',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcops.gender,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'cop_command_unit', \n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcops.command_unit,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'command_unit_id',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcommand_units.id,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'fado_type',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ta.fado_type,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'description',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ta.description,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'board_disposition',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ta.board_disposition)) as allegations\n\t\t\t\tFROM \n\t\t\t\t\tcomplaints\n\t\t\t\tJOIN\n\t\t\t\t\tallegations a\n\t\t\t\tON\n\t\t\t\t\ta.complaint_id = complaints.id\n\t\t\t\tJOIN\n\t\t\t\t\tcops \n\t\t\t\tON\n\t\t\t\t\tcops.id = a.cop\n\t\t\t\tJOIN\n\t\t\t\t\tcommand_units\n\t\t\t\tON\n\t\t\t\t\tcops.command_unit = command_units.unit_id\n\t\t\t\tGROUP BY\n\t\t\t\t\tcomplaints.id\n\t\t\t\tORDER BY\n\t\t\t\t\t".concat(orderBy, " ").concat(order, "\n\t\t\t\tLIMIT \n\t\t\t\t\t(?)\n\t\t\t\tOFFSET\n\t\t\t\t\t(?)\n\t\t\t"), pageSize, offset);

              case 6:
                result = _context3.sent;
                result.map(function (e) {
                  e.allegations = JSON.parse(e.allegations);
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
    key: "readComplaint",
    value: function () {
      var _readComplaint = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4(id) {
        var result;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                _context4.next = 3;
                return this.db.all("\n\t\t\t\tSELECT\n\t\t\t\t\tcomplaints.*,\n\t\t\t\t\tCOUNT(*) AS num_allegations,\n\t\t\t\t\tJSON_GROUP_ARRAY(JSON_OBJECT('allegation_id',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ta.id,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'complaint_id',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ta.complaint_id,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'cop_full_name',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcops.first_name || ' ' || cops.last_name,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'cop_id',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcops.id,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'badge_number',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcops.shield_no,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'cop_rank_abbrev',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcops.rank_abbrev,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'cop_rank_full',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcops.rank_full,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'cop_ethnicity',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcops.ethnicity,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'cop_gender',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcops.gender,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'cop_command_unit', \n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcops.command_unit,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'command_unit_id',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcommand_units.id,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'fado_type',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ta.fado_type,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'description',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ta.description,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'board_disposition',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ta.board_disposition)) as allegations\n\t\t\t\tFROM \n\t\t\t\t\tcomplaints\n\t\t\t\tJOIN\n\t\t\t\t\tallegations a\n\t\t\t\tON\n\t\t\t\t\ta.complaint_id = complaints.id\n\t\t\t\tJOIN\n\t\t\t\t\tcops \n\t\t\t\tON\n\t\t\t\t\tcops.id = a.cop\n\t\t\t\tJOIN\n\t\t\t\t\tcommand_units\n\t\t\t\tON\n\t\t\t\t\tcops.command_unit = command_units.unit_id\n\t\t\t\tWHERE\n\t\t\t\t\tcomplaints.id = (?)\n\t\t\t\tGROUP BY\n\t\t\t\t\tcomplaints.id\n\t\t\t", id);

              case 3:
                result = _context4.sent;
                //the allegations propery is not correctly formatted as a JSON object
                result.map(function (e) {
                  e.allegations = JSON.parse(e.allegations);
                  e.date_received = new Date(e.date_received + ' 12:00:00 GMT-0400');
                  e.date_closed = new Date(e.date_closed + ' 12:00:00 GMT-0400');
                });
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

      function readComplaint(_x6) {
        return _readComplaint.apply(this, arguments);
      }

      return readComplaint;
    }()
  }, {
    key: "getCommandUnits",
    value: function () {
      var _getCommandUnits = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5(id) {
        var result;
        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                _context5.next = 3;
                return this.db.all("\n\t\t\t\tSELECT\n\t\t\t\t\tcommand_units.id as id,\n\t\t\t\t\tcommand_units.unit_id as unit_id,\n\t\t\t\t\tcommand_units.command_unit_full as command_unit_full\n\t\t\t\tFROM\n\t\t\t\t\tcomplaints\n\t\t\t\tJOIN\n\t\t\t\t\tcommand_units\n\t\t\t\tON\n\t\t\t\t\tcomplaints.precinct = command_units.precinct\n\t\t\t\tWHERE\n\t\t\t\t\tcomplaints.id = (?)\n\t\t\t", id);

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

      function getCommandUnits(_x7) {
        return _getCommandUnits.apply(this, arguments);
      }

      return getCommandUnits;
    }()
  }, {
    key: "total",
    value: function () {
      var _total = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee6() {
        var result;
        return _regenerator.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                _context6.next = 3;
                return this.db.all("\n\t\t\t\tSELECT\n\t\t\t\t\tCOUNT(*) AS rows\n\t\t\t\tFROM\n\t\t\t\t\tcomplaints \n\t\t\t\t");

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

      function total() {
        return _total.apply(this, arguments);
      }

      return total;
    }()
  }]);
  return Complaints;
}();

exports.Complaints = Complaints;