var Benchmark = require('benchmark');

var suite = new Benchmark.Suite;

var obj = {};

var _obj = {};
var proxy = new Proxy(_obj, {
  set: (obj, prop, value) => { _obj[prop] = value; }
});

var defineProp = {};
Object.defineProperty(defineProp, 'prop', {
  configurable: false,
  set: v => defineProp._v = v
});

suite.
  add('vanilla', function() {
    obj.prop = 5;
  }).
  add('proxy', function() {
    proxy.prop = 5;
  }).
  add('defineProperty', function() {
    defineProp.prop = 5;
  }).
  on('cycle', function(event) {
    console.log(String(event.target));
  }).
  on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  }).
  run();
