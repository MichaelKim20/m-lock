"use strict";
var LockContainer = require('./bin/LockContainer');

var lockContainer = null;
exports.createContainer = function() {
    lockContainer = LockContainer.getInstance();
};

exports.distroyContainer = function() {
    if (lockContainer != null ) lockContainer.dispose();
};

exports.addLock = function(key) {
    if (lockContainer == null ) lockContainer = LockContainer.getInstance();
    lockContainer.addLock(key);
};

exports.removeLock = function(key) {
    if (lockContainer == null ) lockContainer = LockContainer.getInstance();
    lockContainer.removeLock(key);
};

exports.enter = function(key, callback, checktimeout) {
    if (lockContainer == null ) lockContainer = LockContainer.getInstance();
    lockContainer.enter(key, callback, checktimeout);
};

exports.leave = function(key) {
    if (lockContainer == null ) lockContainer = LockContainer.getInstance();
    lockContainer.leave(key);
};
