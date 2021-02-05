"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _csvHelper = require("./csvHelper");

var _models = require("./models");

var _search = require("./search");

var _jsonGetter = require("./jsonGetter");

var _fileWriter = require("./fileWriter");

var _augmentGeoJson = require("./scripts/augmentGeoJson");

var csv = 'ccrb_data/data.csv';
var DB_PATH = './db/ccrb.db';
var commandCsv = 'ccrb_data/command_abrevs_cleaned.csv';
var allegationTypesCsv = 'ccrb_data/FADO-Table 1.csv';
var rankAbbrevsCsv = 'ccrb_data/Rank Abbrevs-Table 1.csv';
var nypdGeo = 'map_data/nypd_geo.geojson';
var mapPath = './files/nypd_geo.geojson';
var port = process.env.PORT || 3001;
var ip_address = process.env.HOST || '127.0.0.1';
console.log(port);
console.log(ip_address);
var db;
var models = new _models.Models(DB_PATH);
(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee22() {
  var app, helper, commandAbbrevs, rankAbbrevs, allegationTypes, search;
  return _regenerator.default.wrap(function _callee22$(_context22) {
    while (1) {
      switch (_context22.prev = _context22.next) {
        case 0:
          app = (0, _express.default)();
          _context22.next = 3;
          return models.init();

        case 3:
          helper = new _csvHelper.CsvHelper();
          _context22.next = 6;
          return helper.getCommandAbbrevs(commandCsv);

        case 6:
          commandAbbrevs = _context22.sent;
          _context22.next = 9;
          return helper.getRankAbbrevs(rankAbbrevsCsv);

        case 9:
          rankAbbrevs = _context22.sent;
          _context22.next = 12;
          return models.populate(csv, commandCsv, rankAbbrevs, commandAbbrevs);

        case 12:
          _context22.next = 14;
          return helper.getAllegationTypes(allegationTypesCsv);

        case 14:
          allegationTypes = _context22.sent;
          search = new _search.Search(models);
          app.get('/', /*#__PURE__*/function () {
            var _ref2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(req, res) {
              return _regenerator.default.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      res.send('hello');

                    case 1:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _callee);
            }));

            return function (_x, _x2) {
              return _ref2.apply(this, arguments);
            };
          }()); //END POINTS

          app.get('/search', /*#__PURE__*/function () {
            var _ref3 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(req, res) {
              var model, searchQuery;
              return _regenerator.default.wrap(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      model = req.query.model;
                      searchQuery = req.query.searchquery;

                      if (!(searchQuery != null)) {
                        _context2.next = 8;
                        break;
                      }

                      _context2.t0 = res;
                      _context2.next = 6;
                      return search.searchModel(model, searchQuery);

                    case 6:
                      _context2.t1 = _context2.sent;

                      _context2.t0.json.call(_context2.t0, _context2.t1);

                    case 8:
                    case "end":
                      return _context2.stop();
                  }
                }
              }, _callee2);
            }));

            return function (_x3, _x4) {
              return _ref3.apply(this, arguments);
            };
          }());
          app.get('/total_rows', /*#__PURE__*/function () {
            var _ref4 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(req, res) {
              var table, regex;
              return _regenerator.default.wrap(function _callee3$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      table = req.query.table;
                      regex = /^[A-Za-z_]+$/;

                      if (!table.match(regex)) {
                        res.send('error');
                      }

                      _context3.t0 = res;
                      _context3.next = 6;
                      return models[table].total();

                    case 6:
                      _context3.t1 = _context3.sent;

                      _context3.t0.json.call(_context3.t0, _context3.t1);

                    case 8:
                    case "end":
                      return _context3.stop();
                  }
                }
              }, _callee3);
            }));

            return function (_x5, _x6) {
              return _ref4.apply(this, arguments);
            };
          }());
          app.get('/cops', /*#__PURE__*/function () {
            var _ref5 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4(req, res) {
              return _regenerator.default.wrap(function _callee4$(_context4) {
                while (1) {
                  switch (_context4.prev = _context4.next) {
                    case 0:
                      _context4.t0 = res;
                      _context4.next = 3;
                      return models.cops.read(req.query.orderBy, req.query.order, req.query.page, req.query.pageSize);

                    case 3:
                      _context4.t1 = _context4.sent;

                      _context4.t0.json.call(_context4.t0, _context4.t1);

                    case 5:
                    case "end":
                      return _context4.stop();
                  }
                }
              }, _callee4);
            }));

            return function (_x7, _x8) {
              return _ref5.apply(this, arguments);
            };
          }());
          app.get('/cop', /*#__PURE__*/function () {
            var _ref6 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5(req, res) {
              return _regenerator.default.wrap(function _callee5$(_context5) {
                while (1) {
                  switch (_context5.prev = _context5.next) {
                    case 0:
                      _context5.t0 = res;
                      _context5.next = 3;
                      return models.cops.readCop(req.query.id);

                    case 3:
                      _context5.t1 = _context5.sent;

                      _context5.t0.json.call(_context5.t0, _context5.t1);

                    case 5:
                    case "end":
                      return _context5.stop();
                  }
                }
              }, _callee5);
            }));

            return function (_x9, _x10) {
              return _ref6.apply(this, arguments);
            };
          }());
          app.get('/cop/yearly_stats', /*#__PURE__*/function () {
            var _ref7 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee6(req, res) {
              return _regenerator.default.wrap(function _callee6$(_context6) {
                while (1) {
                  switch (_context6.prev = _context6.next) {
                    case 0:
                      _context6.t0 = res;
                      _context6.next = 3;
                      return models.cops.getYearlyStats(req.query.column, req.query.id);

                    case 3:
                      _context6.t1 = _context6.sent;

                      _context6.t0.json.call(_context6.t0, _context6.t1);

                    case 5:
                    case "end":
                      return _context6.stop();
                  }
                }
              }, _callee6);
            }));

            return function (_x11, _x12) {
              return _ref7.apply(this, arguments);
            };
          }());
          app.get('/cop/location_stats', /*#__PURE__*/function () {
            var _ref8 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee7(req, res) {
              return _regenerator.default.wrap(function _callee7$(_context7) {
                while (1) {
                  switch (_context7.prev = _context7.next) {
                    case 0:
                      _context7.t0 = res;
                      _context7.next = 3;
                      return models.cops.getLocationStats(req.query.column, req.query.id);

                    case 3:
                      _context7.t1 = _context7.sent;

                      _context7.t0.json.call(_context7.t0, _context7.t1);

                    case 5:
                    case "end":
                      return _context7.stop();
                  }
                }
              }, _callee7);
            }));

            return function (_x13, _x14) {
              return _ref8.apply(this, arguments);
            };
          }());
          app.get('/cop/getSubstantiated', /*#__PURE__*/function () {
            var _ref9 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee8(req, res) {
              return _regenerator.default.wrap(function _callee8$(_context8) {
                while (1) {
                  switch (_context8.prev = _context8.next) {
                    case 0:
                      _context8.t0 = res;
                      _context8.next = 3;
                      return models.cops.getSubstantiatedPercentage(req.query.id);

                    case 3:
                      _context8.t1 = _context8.sent;

                      _context8.t0.json.call(_context8.t0, _context8.t1);

                    case 5:
                    case "end":
                      return _context8.stop();
                  }
                }
              }, _callee8);
            }));

            return function (_x15, _x16) {
              return _ref9.apply(this, arguments);
            };
          }()); //this returns all complaints with their associated allegations
          //nested inside of JSON objects

          app.get('/cop_complaints/allegations', /*#__PURE__*/function () {
            var _ref10 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee9(req, res) {
              return _regenerator.default.wrap(function _callee9$(_context9) {
                while (1) {
                  switch (_context9.prev = _context9.next) {
                    case 0:
                      _context9.t0 = res;
                      _context9.next = 3;
                      return models.cops.getComplaints(req.query.id);

                    case 3:
                      _context9.t1 = _context9.sent;

                      _context9.t0.json.call(_context9.t0, _context9.t1);

                    case 5:
                    case "end":
                      return _context9.stop();
                  }
                }
              }, _callee9);
            }));

            return function (_x17, _x18) {
              return _ref10.apply(this, arguments);
            };
          }());
          app.get('/command_units', /*#__PURE__*/function () {
            var _ref11 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee10(req, res) {
              return _regenerator.default.wrap(function _callee10$(_context10) {
                while (1) {
                  switch (_context10.prev = _context10.next) {
                    case 0:
                      _context10.t0 = res;
                      _context10.next = 3;
                      return models.commandUnits.read(req.query.orderBy, req.query.order, req.query.page, req.query.pageSize);

                    case 3:
                      _context10.t1 = _context10.sent;

                      _context10.t0.json.call(_context10.t0, _context10.t1);

                    case 5:
                    case "end":
                      return _context10.stop();
                  }
                }
              }, _callee10);
            }));

            return function (_x19, _x20) {
              return _ref11.apply(this, arguments);
            };
          }());
          app.get('/command_unit', /*#__PURE__*/function () {
            var _ref12 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee11(req, res) {
              return _regenerator.default.wrap(function _callee11$(_context11) {
                while (1) {
                  switch (_context11.prev = _context11.next) {
                    case 0:
                      _context11.t0 = res;
                      _context11.next = 3;
                      return models.commandUnits.readCommandUnit(req.query.id);

                    case 3:
                      _context11.t1 = _context11.sent;

                      _context11.t0.json.call(_context11.t0, _context11.t1);

                    case 5:
                    case "end":
                      return _context11.stop();
                  }
                }
              }, _callee11);
            }));

            return function (_x21, _x22) {
              return _ref12.apply(this, arguments);
            };
          }()); //used by map component

          app.get('/command_units_with_precincts', /*#__PURE__*/function () {
            var _ref13 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee12(req, res) {
              return _regenerator.default.wrap(function _callee12$(_context12) {
                while (1) {
                  switch (_context12.prev = _context12.next) {
                    case 0:
                      _context12.t0 = res;
                      _context12.next = 3;
                      return models.commandUnits.commandUnitsWithPrecincts();

                    case 3:
                      _context12.t1 = _context12.sent;

                      _context12.t0.json.call(_context12.t0, _context12.t1);

                    case 5:
                    case "end":
                      return _context12.stop();
                  }
                }
              }, _callee12);
            }));

            return function (_x23, _x24) {
              return _ref13.apply(this, arguments);
            };
          }());
          app.get('/command_unit/yearly_stats', /*#__PURE__*/function () {
            var _ref14 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee13(req, res) {
              return _regenerator.default.wrap(function _callee13$(_context13) {
                while (1) {
                  switch (_context13.prev = _context13.next) {
                    case 0:
                      _context13.t0 = res;
                      _context13.next = 3;
                      return models.commandUnits.getYearlyStats(req.query.column, req.query.id);

                    case 3:
                      _context13.t1 = _context13.sent;

                      _context13.t0.json.call(_context13.t0, _context13.t1);

                    case 5:
                    case "end":
                      return _context13.stop();
                  }
                }
              }, _callee13);
            }));

            return function (_x25, _x26) {
              return _ref14.apply(this, arguments);
            };
          }());
          app.get('/command_unit_complaints/allegations', /*#__PURE__*/function () {
            var _ref15 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee14(req, res) {
              return _regenerator.default.wrap(function _callee14$(_context14) {
                while (1) {
                  switch (_context14.prev = _context14.next) {
                    case 0:
                      _context14.t0 = res;
                      _context14.next = 3;
                      return models.commandUnits.getComplaints(req.query.id);

                    case 3:
                      _context14.t1 = _context14.sent;

                      _context14.t0.json.call(_context14.t0, _context14.t1);

                    case 5:
                    case "end":
                      return _context14.stop();
                  }
                }
              }, _callee14);
            }));

            return function (_x27, _x28) {
              return _ref15.apply(this, arguments);
            };
          }());
          app.get('/command_unit/cops', /*#__PURE__*/function () {
            var _ref16 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee15(req, res) {
              return _regenerator.default.wrap(function _callee15$(_context15) {
                while (1) {
                  switch (_context15.prev = _context15.next) {
                    case 0:
                      _context15.t0 = res;
                      _context15.next = 3;
                      return models.commandUnits.getCops(req.query.id);

                    case 3:
                      _context15.t1 = _context15.sent;

                      _context15.t0.json.call(_context15.t0, _context15.t1);

                    case 5:
                    case "end":
                      return _context15.stop();
                  }
                }
              }, _callee15);
            }));

            return function (_x29, _x30) {
              return _ref16.apply(this, arguments);
            };
          }()); //this is to get all the cops associated with a command unit that has now complaints directly associated with it

          app.get('/command_unit/complaints=0', /*#__PURE__*/function () {
            var _ref17 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee16(req, res) {
              return _regenerator.default.wrap(function _callee16$(_context16) {
                while (1) {
                  switch (_context16.prev = _context16.next) {
                    case 0:
                      _context16.t0 = res;
                      _context16.next = 3;
                      return models.commandUnits.getCopsForCommandUnitWithoutComplaints(req.query.id);

                    case 3:
                      _context16.t1 = _context16.sent;

                      _context16.t0.json.call(_context16.t0, _context16.t1);

                    case 5:
                    case "end":
                      return _context16.stop();
                  }
                }
              }, _callee16);
            }));

            return function (_x31, _x32) {
              return _ref17.apply(this, arguments);
            };
          }());
          app.get('/command_unit/complaints=0/cops', /*#__PURE__*/function () {
            var _ref18 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee17(req, res) {
              return _regenerator.default.wrap(function _callee17$(_context17) {
                while (1) {
                  switch (_context17.prev = _context17.next) {
                    case 0:
                      _context17.t0 = res;
                      _context17.next = 3;
                      return models.commandUnits.getCopsForCommandUnitWithoutComplaints(req.query.id);

                    case 3:
                      _context17.t1 = _context17.sent;

                      _context17.t0.json.call(_context17.t0, _context17.t1);

                    case 5:
                    case "end":
                      return _context17.stop();
                  }
                }
              }, _callee17);
            }));

            return function (_x33, _x34) {
              return _ref18.apply(this, arguments);
            };
          }());
          app.get('/complaints', /*#__PURE__*/function () {
            var _ref19 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee18(req, res) {
              return _regenerator.default.wrap(function _callee18$(_context18) {
                while (1) {
                  switch (_context18.prev = _context18.next) {
                    case 0:
                      _context18.t0 = res;
                      _context18.next = 3;
                      return models.complaints.read(req.query.orderBy, req.query.order, req.query.page, req.query.pageSize);

                    case 3:
                      _context18.t1 = _context18.sent;

                      _context18.t0.json.call(_context18.t0, _context18.t1);

                    case 5:
                    case "end":
                      return _context18.stop();
                  }
                }
              }, _callee18);
            }));

            return function (_x35, _x36) {
              return _ref19.apply(this, arguments);
            };
          }());
          app.get('/complaint', /*#__PURE__*/function () {
            var _ref20 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee19(req, res) {
              return _regenerator.default.wrap(function _callee19$(_context19) {
                while (1) {
                  switch (_context19.prev = _context19.next) {
                    case 0:
                      _context19.t0 = res;
                      _context19.next = 3;
                      return models.complaints.readComplaint(req.query.id);

                    case 3:
                      _context19.t1 = _context19.sent;

                      _context19.t0.json.call(_context19.t0, _context19.t1);

                    case 5:
                    case "end":
                      return _context19.stop();
                  }
                }
              }, _callee19);
            }));

            return function (_x37, _x38) {
              return _ref20.apply(this, arguments);
            };
          }());
          app.get('/complaint/command_units', /*#__PURE__*/function () {
            var _ref21 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee20(req, res) {
              return _regenerator.default.wrap(function _callee20$(_context20) {
                while (1) {
                  switch (_context20.prev = _context20.next) {
                    case 0:
                      _context20.t0 = res;
                      _context20.next = 3;
                      return models.complaints.getCommandUnits(req.query.id);

                    case 3:
                      _context20.t1 = _context20.sent;

                      _context20.t0.json.call(_context20.t0, _context20.t1);

                    case 5:
                    case "end":
                      return _context20.stop();
                  }
                }
              }, _callee20);
            }));

            return function (_x39, _x40) {
              return _ref21.apply(this, arguments);
            };
          }());
          app.get('/map', /*#__PURE__*/function () {
            var _ref22 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee21(req, res) {
              return _regenerator.default.wrap(function _callee21$(_context21) {
                while (1) {
                  switch (_context21.prev = _context21.next) {
                    case 0:
                      _context21.t0 = res;
                      _context21.next = 3;
                      return (0, _jsonGetter.jsonGetter)(nypdGeo);

                    case 3:
                      _context21.t1 = _context21.sent;

                      _context21.t0.json.call(_context21.t0, _context21.t1);

                    case 5:
                    case "end":
                      return _context21.stop();
                  }
                }
              }, _callee21);
            }));

            return function (_x41, _x42) {
              return _ref22.apply(this, arguments);
            };
          }());
          app.listen(port, ip_address, function () {
            console.log("Example app listening at http://".concat(ip_address, ":").concat(port));
          });

        case 38:
        case "end":
          return _context22.stop();
      }
    }
  }, _callee22);
}))();