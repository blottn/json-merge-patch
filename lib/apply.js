'use strict';

var serialize = require('./utils').serialize;

const nullable = (obj) => {
  if (obj === null)
    return true;
  if (typeof obj !== 'object')
    return false;
  return Object.values(obj).map(x => nullable(x)).reduce((acc, x) => acc && x);
}

const nulless = (object) => {
  if (Array.isArray(object))
    return object; // TODO this should probably remove null indices
  if (object === null || typeof object !== 'object' || Object.keys(object).length == 0)
    return object;

  // Now have an object with some keys
  let entries = Object.entries(object)
    .map(([k, v]) => [k, nulless(v)])
    .filter(([_, value]) => value !== null);

  // We previously had entries but now we dont, therefore this whole branch is nullable.
  if (entries.length == 0)
    return null;
  return entries.reduce((acc, [k,v]) => ({...acc, [k]: v}), {});
}



function apply(target, patch) {
// function apply(target, patch) {
  patch = serialize(patch);
  target = serialize(target);
  if (patch === null || target === null || patch === undefined || target === undefined || typeof patch !== 'object' || typeof target !== 'object') {
    return nulless(patch);
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
      var applied = apply(target[key], patch[key]);
      if (applied !== null)
        target[key] = applied;
    }
  }
  return target;
};
module.exports = apply;

console.log(apply({a: 'asdf'}, {a: ["b"]}));

