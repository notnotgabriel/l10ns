
var dateTemplates = require('../templates/build/templates');

var setDateBlock =
  'var string = \'\';\n' +
  'var date;\n' +
  'if(typeof it.variable1 === \'string\') {\n' +
  '  date = new Date(it.variable1);\n' +
  '}\n' +
  'else {\n' +
  '  date = it.variable1;\n' +
  '}\n' +
  'var month = date.getMonth();\n' +
  'var date_ = date.getDate();\n';

describe('DateFormat', function() {
  describe('Era', function() {
    it('should be able to compile an abbreviated era', function(done) {
      var localizations = getLocalizations('{variable1, date, G}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'if(date.getFullYear() >= 0) {\n' +
          '  string += \'AD\';\n' +
          '}\n' +
          'else {\n' +
          '  string += \'BC\';\n' +
          '}\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a full era', function(done) {
      var localizations = getLocalizations('{variable1, date, GGGG}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'if(date.getFullYear() >= 0) {\n' +
          '  string += \'Anno Domini\';\n' +
          '}\n' +
          'else {\n' +
          '  string += \'Before Christ\';\n' +
          '}\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a narrow era', function(done) {
      var localizations = getLocalizations('{variable1, date, GGGGG}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'if(date.getFullYear() >= 0) {\n' +
          '  string += \'A\';\n' +
          '}\n' +
          'else {\n' +
          '  string += \'B\';\n' +
          '}\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });
  });

  describe('Year', function() {
    it('should be able to compile a calendar year of length 1', function(done) {
      var localizations = getLocalizations('{variable1, date, y}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var year = date.getFullYear() + \'\';\n' +
          'if(year.length >= 1) {\n' +
          '  string += year;\n' +
          '}\n' +
          'else {\n' +
          '  var difference = 1 - year.length;\n' +
          '  for(var i = 0; i < difference; i++) {\n' +
          '    string += \'0\';\n' +
          '  }\n' +
          '  string += year;\n' +
          '}\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a calendar year of length 2', function(done) {
      var localizations = getLocalizations('{variable1, date, yy}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var year = date.getFullYear() + \'\';\n' +
          'if(year.length < 2) {\n' +
          '  string += \'0\' + year;\n' +
          '}\n' +
          'else {\n' +
          '  string += year.substring(year.length - 2, year.length);\n' +
          '}\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a calendar year of length bigger than 2', function(done) {
      var localizations = getLocalizations('{variable1, date, yyyy}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var year = date.getFullYear() + \'\';\n' +
          'if(year.length >= 4) {\n' +
          '  string += year;\n' +
          '}\n' +
          'else {\n' +
          '  var difference = 4 - year.length;\n' +
          '  for(var i = 0; i < difference; i++) {\n' +
          '    string += \'0\';\n' +
          '  }\n' +
          '  string += year;\n' +
          '}\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a calendar year of length 1', function(done) {
      var localizations = getLocalizations('{variable1, date, Y}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          dateTemplates['DateWeekBasedYear']() + '\n' +
          dateTemplates['FormatYear']({ length: 1 }) + '\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a calendar year of length 2', function(done) {
      var localizations = getLocalizations('{variable1, date, YY}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          dateTemplates['DateWeekBasedYear']() + '\n' +
          dateTemplates['FormatYear']({ length: 2 }) + '\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a calendar year of length bigger than 2', function(done) {
      var localizations = getLocalizations('{variable1, date, YYY}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          dateTemplates['DateWeekBasedYear']() + '\n' +
          dateTemplates['FormatYear']({ length: 3 }) + '\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('week based year block should set week based year correctly', function() {
      var function_ = 'function test_weekBasedYearBlock(it) {\n' +
        'var string = \'\';\n' +
        dateTemplates['SetDateBlock']({
          variableName: 'date'
        }) + '\n' +
        dateTemplates['DateWeekBasedYear']() + '\n' +
        dateTemplates['FormatYear']({ length: 3 }) + '\n' +
        'return string; }';
        eval(function_);
      expect(test_weekBasedYearBlock({ date: new Date('2005-1-1') })).to.equal('2004');
      expect(test_weekBasedYearBlock({ date: new Date('2005-1-2') })).to.equal('2004');
      expect(test_weekBasedYearBlock({ date: new Date('2005-1-3') })).to.equal('2005');
      expect(test_weekBasedYearBlock({ date: new Date('2005-12-31') })).to.equal('2005');
      expect(test_weekBasedYearBlock({ date: new Date('2006-1-1') })).to.equal('2005');
      expect(test_weekBasedYearBlock({ date: new Date('2006-1-2') })).to.equal('2006');
      expect(test_weekBasedYearBlock({ date: new Date('2007-1-1') })).to.equal('2007');
      expect(test_weekBasedYearBlock({ date: new Date('2007-12-30') })).to.equal('2007');
      expect(test_weekBasedYearBlock({ date: new Date('2007-12-31') })).to.equal('2008');
      expect(test_weekBasedYearBlock({ date: new Date('2008-01-01') })).to.equal('2008');
      expect(test_weekBasedYearBlock({ date: new Date('2008-12-28') })).to.equal('2008');
      expect(test_weekBasedYearBlock({ date: new Date('2008-12-29') })).to.equal('2009');
      expect(test_weekBasedYearBlock({ date: new Date('2008-12-30') })).to.equal('2009');
      expect(test_weekBasedYearBlock({ date: new Date('2008-12-31') })).to.equal('2009');
      expect(test_weekBasedYearBlock({ date: new Date('2009-01-01') })).to.equal('2009');
      expect(test_weekBasedYearBlock({ date: new Date('2010-01-01') })).to.equal('2009');
      expect(test_weekBasedYearBlock({ date: new Date('2010-01-02') })).to.equal('2009');
      expect(test_weekBasedYearBlock({ date: new Date('2010-01-03') })).to.equal('2009');
      expect(test_weekBasedYearBlock({ date: new Date('2010-01-04') })).to.equal('2010');
    });

    it('format year block of length 1 should format without padding', function() {
      var function_ = 'function test_formatYearBlock() {\n' +
        'var string = \'\';\n' +
        'var year = \'208\';\n' +
        dateTemplates['FormatYear']({ length: 1 }) + '\n' +
        'return string; }';
        eval(function_);
      expect(test_formatYearBlock()).to.equal('208');
    });

    it('format year block should pad with zero whenever minimum length is not met', function() {
      var function_ = 'function test_formatYearBlock() {\n' +
        'var string = \'\';\n' +
        'var year = \'8\';\n' +
        dateTemplates['FormatYear']({ length: 2 }) + '\n' +
        'return string; }';
        eval(function_);
      expect(test_formatYearBlock()).to.equal('08');
    });

    it('format year block of length 2 should add padding with zero', function() {
      var function_ = 'function test_formatYearBlock() {\n' +
        'var string = \'\';\n' +
        'var year = \'8\';\n' +
        dateTemplates['FormatYear']({ length: 2 }) + '\n' +
        'return string; }';
        eval(function_);
      expect(test_formatYearBlock()).to.equal('08');
    });

    it('format year block of length 2 should truncate year string', function() {
      var function_ = 'function test_formatYearBlock() {\n' +
        'var string = \'\';\n' +
        'var year = \'2008\';\n' +
        dateTemplates['FormatYear']({ length: 2 }) + '\n' +
        'return string; }';
        eval(function_);
      expect(test_formatYearBlock()).to.equal('08');
    });
  });

  describe('Quarter', function() {
    it('should be able to compile a formated numeric quarter', function(done) {
      var localizations = getLocalizations('{variable1, date, Q}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var quarter = Math.floor(date.getMonth() / 3);\n' +
          'var quarterStrings = [\n' +
          '  \'1\',\n' +
          '  \'2\',\n' +
          '  \'3\',\n' +
          '  \'4\'\n' +
          '];\n' +
          'string += quarterStrings[quarter];\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a formated numeric with padding quarter', function(done) {
      var localizations = getLocalizations('{variable1, date, QQ}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var quarter = Math.floor(date.getMonth() / 3);\n' +
          'var quarterStrings = [\n' +
          '  \'01\',\n' +
          '  \'02\',\n' +
          '  \'03\',\n' +
          '  \'04\'\n' +
          '];\n' +
          'string += quarterStrings[quarter];\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a formated abbreviated quarter', function(done) {
      var localizations = getLocalizations('{variable1, date, QQQ}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var quarter = Math.floor(date.getMonth() / 3);\n' +
          'var quarterStrings = [\n' +
          '  \'Q1\',\n' +
          '  \'Q2\',\n' +
          '  \'Q3\',\n' +
          '  \'Q4\'\n' +
          '];\n' +
          'string += quarterStrings[quarter];\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a formated wide quarter', function(done) {
      var localizations = getLocalizations('{variable1, date, QQQQ}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var quarter = Math.floor(date.getMonth() / 3);\n' +
          'var quarterStrings = [\n' +
          '  \'1st quarter\',\n' +
          '  \'2nd quarter\',\n' +
          '  \'3rd quarter\',\n' +
          '  \'4th quarter\'\n' +
          '];\n' +
          'string += quarterStrings[quarter];\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });


    it('should be able to compile a stand-alone numeric quarter', function(done) {
      var localizations = getLocalizations('{variable1, date, q}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var quarter = Math.floor(date.getMonth() / 3);\n' +
          'var quarterStrings = [\n' +
          '  \'1\',\n' +
          '  \'2\',\n' +
          '  \'3\',\n' +
          '  \'4\'\n' +
          '];\n' +
          'string += quarterStrings[quarter];\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a stand-alone numeric with padding quarter', function(done) {
      var localizations = getLocalizations('{variable1, date, qq}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var quarter = Math.floor(date.getMonth() / 3);\n' +
          'var quarterStrings = [\n' +
          '  \'01\',\n' +
          '  \'02\',\n' +
          '  \'03\',\n' +
          '  \'04\'\n' +
          '];\n' +
          'string += quarterStrings[quarter];\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a stand-alone abbreviated quarter', function(done) {
      var localizations = getLocalizations('{variable1, date, qqq}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var quarter = Math.floor(date.getMonth() / 3);\n' +
          'var quarterStrings = [\n' +
          '  \'Q1\',\n' +
          '  \'Q2\',\n' +
          '  \'Q3\',\n' +
          '  \'Q4\'\n' +
          '];\n' +
          'string += quarterStrings[quarter];\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a stand-alone wider quarter', function(done) {
      var localizations = getLocalizations('{variable1, date, qqqq}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var quarter = Math.floor(date.getMonth() / 3);\n' +
          'var quarterStrings = [\n' +
          '  \'Q1\',\n' +
          '  \'Q2\',\n' +
          '  \'Q3\',\n' +
          '  \'Q4\'\n' +
          '];\n' +
          'string += quarterStrings[quarter];\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });
  });

  describe('Months', function() {
    it('should be able to compile a formated numeric month', function(done) {
      var localizations = getLocalizations('{variable1, date, M}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var monthStrings = [\n' +
          '  \'1\',\n' +
          '  \'2\',\n' +
          '  \'3\',\n' +
          '  \'4\',\n' +
          '  \'5\',\n' +
          '  \'6\',\n' +
          '  \'7\',\n' +
          '  \'8\',\n' +
          '  \'9\',\n' +
          '  \'10\',\n' +
          '  \'11\',\n' +
          '  \'12\'\n' +
          '];\n' +
          'string += monthStrings[month];\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a formated numeric with padding month', function(done) {
      var localizations = getLocalizations('{variable1, date, MM}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var monthStrings = [\n' +
          '  \'01\',\n' +
          '  \'02\',\n' +
          '  \'03\',\n' +
          '  \'04\',\n' +
          '  \'05\',\n' +
          '  \'06\',\n' +
          '  \'07\',\n' +
          '  \'08\',\n' +
          '  \'09\',\n' +
          '  \'10\',\n' +
          '  \'11\',\n' +
          '  \'12\'\n' +
          '];\n' +
          'string += monthStrings[month];\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a formated abbreviated month', function(done) {
      var localizations = getLocalizations('{variable1, date, MMM}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var monthStrings = [\n' +
          '  \'Jan\',\n' +
          '  \'Feb\',\n' +
          '  \'Mar\',\n' +
          '  \'Apr\',\n' +
          '  \'May\',\n' +
          '  \'Jun\',\n' +
          '  \'Jul\',\n' +
          '  \'Aug\',\n' +
          '  \'Sep\',\n' +
          '  \'Oct\',\n' +
          '  \'Nov\',\n' +
          '  \'Dec\'\n' +
          '];\n' +
          'string += monthStrings[month];\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a formated wide month', function(done) {
      var localizations = getLocalizations('{variable1, date, MMMM}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var monthStrings = [\n' +
          '  \'January\',\n' +
          '  \'February\',\n' +
          '  \'March\',\n' +
          '  \'April\',\n' +
          '  \'May\',\n' +
          '  \'June\',\n' +
          '  \'July\',\n' +
          '  \'August\',\n' +
          '  \'September\',\n' +
          '  \'October\',\n' +
          '  \'November\',\n' +
          '  \'December\'\n' +
          '];\n' +
          'string += monthStrings[month];\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a formated narrow month', function(done) {
      var localizations = getLocalizations('{variable1, date, MMMMM}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var monthStrings = [\n' +
          '  \'1\',\n' +
          '  \'2\',\n' +
          '  \'3\',\n' +
          '  \'4\',\n' +
          '  \'5\',\n' +
          '  \'6\',\n' +
          '  \'7\',\n' +
          '  \'8\',\n' +
          '  \'9\',\n' +
          '  \'10\',\n' +
          '  \'11\',\n' +
          '  \'12\'\n' +
          '];\n' +
          'string += monthStrings[month];\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a stand-alone numeric month', function(done) {
      var localizations = getLocalizations('{variable1, date, L}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var monthStrings = [\n' +
          '  \'1\',\n' +
          '  \'2\',\n' +
          '  \'3\',\n' +
          '  \'4\',\n' +
          '  \'5\',\n' +
          '  \'6\',\n' +
          '  \'7\',\n' +
          '  \'8\',\n' +
          '  \'9\',\n' +
          '  \'10\',\n' +
          '  \'11\',\n' +
          '  \'12\'\n' +
          '];\n' +
          'string += monthStrings[month];\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a stand-alone numeric with padding month', function(done) {
      var localizations = getLocalizations('{variable1, date, LL}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var monthStrings = [\n' +
          '  \'01\',\n' +
          '  \'02\',\n' +
          '  \'03\',\n' +
          '  \'04\',\n' +
          '  \'05\',\n' +
          '  \'06\',\n' +
          '  \'07\',\n' +
          '  \'08\',\n' +
          '  \'09\',\n' +
          '  \'10\',\n' +
          '  \'11\',\n' +
          '  \'12\'\n' +
          '];\n' +
          'string += monthStrings[month];\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a stand-alone abbreviated month', function(done) {
      var localizations = getLocalizations('{variable1, date, LLL}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var monthStrings = [\n' +
          '  \'M01\',\n' +
          '  \'M02\',\n' +
          '  \'M03\',\n' +
          '  \'M04\',\n' +
          '  \'M05\',\n' +
          '  \'M06\',\n' +
          '  \'M07\',\n' +
          '  \'M08\',\n' +
          '  \'M09\',\n' +
          '  \'M10\',\n' +
          '  \'M11\',\n' +
          '  \'M12\'\n' +
          '];\n' +
          'string += monthStrings[month];\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a stand-alone wide month', function(done) {
      var localizations = getLocalizations('{variable1, date, LLLL}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var monthStrings = [\n' +
          '  \'M01\',\n' +
          '  \'M02\',\n' +
          '  \'M03\',\n' +
          '  \'M04\',\n' +
          '  \'M05\',\n' +
          '  \'M06\',\n' +
          '  \'M07\',\n' +
          '  \'M08\',\n' +
          '  \'M09\',\n' +
          '  \'M10\',\n' +
          '  \'M11\',\n' +
          '  \'M12\'\n' +
          '];\n' +
          'string += monthStrings[month];\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a stand-alone narrow month', function(done) {
      var localizations = getLocalizations('{variable1, date, LLLLL}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var monthStrings = [\n' +
          '  \'J\',\n' +
          '  \'F\',\n' +
          '  \'M\',\n' +
          '  \'A\',\n' +
          '  \'M\',\n' +
          '  \'J\',\n' +
          '  \'J\',\n' +
          '  \'A\',\n' +
          '  \'S\',\n' +
          '  \'O\',\n' +
          '  \'N\',\n' +
          '  \'D\'\n' +
          '];\n' +
          'string += monthStrings[month];\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

  });
});