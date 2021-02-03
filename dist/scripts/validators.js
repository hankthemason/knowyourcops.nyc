"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkSearchQuery = exports.checkOrderBy = exports.checkOrder = void 0;

var checkOrder = function checkOrder(order) {
  if (typeof order !== 'string') {
    return false;
  } else if (order.toLowerCase() !== 'asc' && order.toLowerCase() !== 'desc') {
    return false;
  }

  return true;
};

exports.checkOrder = checkOrder;

var checkOrderBy = function checkOrderBy(orderBy) {
  var regex = /^[A-Za-z_]+$/;

  if (typeof orderBy !== 'string') {
    return false;
  } else if (!orderBy.match(regex)) {
    return false;
  }

  return true;
};

exports.checkOrderBy = checkOrderBy;

var checkSearchQuery = function checkSearchQuery(searchQuery) {
  var regex = /^[A-Za-z0-9_\s]+$/;

  if (typeof searchQuery !== 'string') {
    return false;
  } else if (!searchQuery.match(regex)) {
    return false;
  }

  return true;
};

exports.checkSearchQuery = checkSearchQuery;