"use strict";
var LockWatch = require('./LockWatch');

class LockContainer {
    constructor() {
        this.items = new Array(0);
        this.localKeys = new Array(0);
    }

    dispose() {
        for (var key in this.items) {
            if (this.items[key] != null) {
                this.items[key].stop();
            }
        }
        this.items = new Array(0);

        this.client.end(true);
    }

    static getInstance() {
        if (LockContainer.instance == null) {
            LockContainer.instance = new LockContainer();
        }
        return LockContainer.instance;
    }

    addLock(key) {
        var key_lock = '$' + key;
        var key_loop = '$' + key + '_lock_loop';
        var key_enter = '$' + key + '_enter';

        if (this.items[key] == null) {
            this.items[key] = new LockWatch(this.localKeys, key);
        }

        if (this.localKeys[key_loop] == null) {
            this.localKeys[key_loop] = 0;
        }

        if (this.localKeys[key_lock] == null) {
            this.localKeys[key_lock] = 0;
        }

        if (this.localKeys[key_enter] == null) {
            this.localKeys[key_enter] = (new Date()).getTime();
        }
    };

    removeLock(key) {
        if (this.items[key] != null) {
            this.items[key].stop();
            delete this.items[key];
        }

        var key_lock = '$' + key;
        var key_loop = '$' + key + '_lock_loop';
        var key_enter = '$' + key + '_enter';

        delete this.localKeys[key_loop];
        delete this.localKeys[key_lock];
        delete this.localKeys[key_enter];
    };

    enter(key, callback) {
        var key_lock = '$' + key;
        var key_loop = '$' + key + '_lock_loop';
        var key_enter = '$' + key + '_enter';

        this.localKeys[key_loop]++;
        this.localKeys[key_loop] = (this.localKeys[key_loop] % 10);
        var tick = this.localKeys[key_loop];

        var oldDateTime, newDateTime, newtick, oldtick;
        oldDateTime = new Date();
        var container = this;
        var go_enter = function () {
            newDateTime = new Date();
            newtick = Math.trunc((newDateTime.getTime() + tick * 10) / 100);
            oldtick = Math.trunc((oldDateTime.getTime() + tick * 10) / 100);
            oldDateTime = newDateTime;

            if (newtick != oldtick) {
                container.localKeys[key_lock]++;
                if (container.localKeys[key_lock] == 1) {
                    container.localKeys[key_enter] = (new Date()).getTime();
                    callback(true);
                    return;
                }
                container.localKeys[key_lock]--;
                setTimeout(go_enter, 10);
            } else {
                setTimeout(go_enter, 10);
            }
        };
        go_enter();
    }
    leave(key) {
        var key_lock = '$' + key;
        this.localKeys[key_lock]--;
    }

}
LockContainer.instance = null;

module.exports = LockContainer;
