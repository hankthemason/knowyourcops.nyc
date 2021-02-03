"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.augmentGeoJson = void 0;

var augmentGeoJson = function augmentGeoJson(jsonObject) {
  jsonObject.features.forEach(function (e) {
    e.properties.precinctFull = e.properties.precinct.toString().padStart(3, '0');
    e.properties.precinctString = e.properties.precinct.toString().padStart(3, '0') + " PCT";
  });
  return jsonObject;
};

exports.augmentGeoJson = augmentGeoJson;