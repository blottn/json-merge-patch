'use strict';

var serialize = require('./utils').serialize;

// module.exports = function apply(target, patch) {
function apply(target, patch) {
  patch = serialize(patch);
  target = serialize(target);
  console.log(target, patch)
  if (patch === null || target === null || patch === undefined || target === undefined || typeof patch !== 'object' || typeof target !== 'object') {
    console.log(typeof patch, typeof target);
    console.log('ret patch', patch);
    return patch;
  }
  var keys = Object.keys(patch);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      return target;
    }
    if (patch[key] === null) {
      if (target.hasOwnProperty(key)) {
        delete target[key];
      }
    } else {
      target[key] = apply(target[key], patch[key]);
    }
  }
  return target;
};


console.log(apply({}, {a: {bb: {ccc: null}}}));

