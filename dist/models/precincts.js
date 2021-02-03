"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Precincts = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var Precincts = /*#__PURE__*/function () {
  function Precincts(db) {
    (0, _classCallCheck2.default)(this, Precincts);
    this.db = db;
  }

  (0, _createClass2.default)(Precincts, [{
    key: "init",
    value: function () {
      var _init = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.db.run("CREATE TABLE IF NOT EXISTS precincts (\n\t\t\t\tid INTEGER PRIMARY KEY\n\t\t\t\t);");

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
      var _create = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(precinct) {
        var command, match, precinct_id;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;

                if (!(precinct.precinct !== '')) {
                  _context2.next = 4;
                  break;
                }

                _context2.next = 4;
                return this.db.run("INSERT INTO precincts(id) VALUES('".concat(precinct.precinct, "')"));

              case 4:
                //step 1: look at command_at_incident and parse an int (precinct) from it (if it exists)
                command = precinct.command_at_incident;
                match = command.match(/(.*) (?:PCT)?(?:DET)?$/);
                precinct_id = match && match[1] ? parseInt(match[1]) || null : null; //step 2: check precinct table to see if a corresponding row exists yet; 
                //if not, we need to make that row in the precincts table

                if (!precinct_id) {
                  _context2.next = 10;
                  break;
                }

                _context2.next = 10;
                return this.db.run("\n\t\t\t\tINSERT OR IGNORE INTO\n\t\t\t\t\tprecincts(id)\n\t\t\t\tVALUES\n\t\t\t\t\t(".concat(precinct_id, ")\n\t\t\t"));

              case 10:
                _context2.next = 19;
                break;

              case 12:
                _context2.prev = 12;
                _context2.t0 = _context2["catch"](0);

                if (!(_context2.t0 && !_context2.t0.message.match(/SQLITE_CONSTRAINT:.*/))) {
                  _context2.next = 19;
                  break;
                }

                console.log(_context2.t0.message);
                console.log('error in populating precincts');
                console.log(precinct);
                throw _context2.t0.message;

              case 19:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 12]]);
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
                return this.db.all("\n\t\t\t\tSELECT \n\t\t\t\t\t*\n\t\t\t\tFROM\n\t\t\t\t\tprecincts");

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
  }]);
  return Precincts;
}();

exports.Precincts = Precincts;