"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Search = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var Search = /*#__PURE__*/function () {
  function Search(models) {
    (0, _classCallCheck2.default)(this, Search);
    this.models = models;
  }

  (0, _createClass2.default)(Search, [{
    key: "searchModel",
    value: function () {
      var _searchModel = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(model, searchQuery) {
        var results;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return this.models[model].search(searchQuery);

              case 3:
                results = _context.sent;
                return _context.abrupt("return", results);

              case 7:
                _context.prev = 7;
                _context.t0 = _context["catch"](0);
                console.error(_context.t0);

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 7]]);
      }));

      function searchModel(_x, _x2) {
        return _searchModel.apply(this, arguments);
      }

      return searchModel;
    }()
  }, {
    key: "searchAll",
    value: function () {
      var _searchAll = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(searchQuery) {
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return this.models.cops.search(searchQuery);

              case 3:
                _context2.t0 = _context2.sent;
                return _context2.abrupt("return", {
                  cops: _context2.t0
                });

              case 7:
                _context2.prev = 7;
                _context2.t1 = _context2["catch"](0);
                console.error(_context2.t1);

              case 10:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 7]]);
      }));

      function searchAll(_x3) {
        return _searchAll.apply(this, arguments);
      }

      return searchAll;
    }()
  }]);
  return Search;
}();

exports.Search = Search;