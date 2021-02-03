"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jsonGetter = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _augmentGeoJson = require("./scripts/augmentGeoJson");

var _fs = _interopRequireDefault(require("fs"));

var jsonGetter = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(path) {
    var rawData, jsonResult;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            rawData = _fs.default.readFileSync(path);
            jsonResult = JSON.parse(rawData);
            jsonResult = (0, _augmentGeoJson.augmentGeoJson)(jsonResult);
            return _context.abrupt("return", jsonResult);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function jsonGetter(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.jsonGetter = jsonGetter;