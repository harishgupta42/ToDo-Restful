'use strict';
let UserRoute = require('./user');
let TaskRoute = require('./task');
let NoteRoute = require('./note')

let all = [].concat(UserRoute, TaskRoute, NoteRoute);
module.exports = all;