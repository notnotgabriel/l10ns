var requirejs = require('requirejs'),
    findup    = require('findup-sync'),
    config    = require('../../../src/lib/config');

requirejs.config({

  baseUrl: __dirname,
  nodeRequire: require

});

var routes = function(server) {

  'use strict';
  var grunt = require('grunt');
  require(findup('Gruntfile.js'))(grunt, true);
  var opt = grunt.config.get('translate').dist.options;

  var tmpl = requirejs('../../public/templates/tmpl');

  function getRegions(id, loc) {

    var translations = config.getLatestTranslations(opt, 0, 20, loc);

    // Append ID
    if(id) {
      for(var key in translations) {
        if(translations[key].id === id) {
          translations[key].edit = tmpl.translation(translations[key]);
          break;
        }
      }
    }

    // Append to data
    var data = {
      collection : translations,
      json : JSON.stringify(translations)
    };

    var regions = tmpl.translationsPage({
      search       : tmpl.search(),
      menuItems    : tmpl.menuItems(),
      translations : tmpl.translations(data),
      localePick   : tmpl.localePick({
          selected : { 'key' : 'en', 'text' : 'English' },
          locales  : [{ 'key' : 'en', 'text' : 'English' }, { 'key' : 'dn', 'text' : 'Danish' }]
        })

    });

    return regions;
  }

  server.get('/', function(req, res) {
    var layout = tmpl.layout({
      body: getRegions(null, req.param('l'))
    });
    return res.send(layout);
  });

  server.get('/translation/:id', function(req, res) {
    var layout = tmpl.layout({
      body: getRegions(req.param('id'), req.param('l'))
    });

    return res.send(layout);
  });

};

module.exports = routes;