"use strict";

class LockWatch {
    constructor(localKeys, key) {
        this.localKeys = localKeys;
        this.key_lock = '$' + key;
        this.key_enter = '$' + key + '_enter';
        this.key_watch = '$' + key + '_watch';
        this.localKeys[this.key_watch] = 0;
        this.started = false;
        this.start();
    }

    start() {
        this.started = true;
        this.localKeys[this.key_watch]++;
        this.localKeys[this.key_watch] = (this.localKeys[this.key_watch] % 10);
        var tick = this.localKeys[this.key_watch];

        var oldDateTime, newDateTime, newtick, oldtick;
        oldDateTime = new Date();
        var watcher = this;
        var go_watch = function () {

            newDateTime = new Date();
            newtick = Math.trunc((newDateTime.getTime() + tick * 100) / 1000);
            oldtick = Math.trunc((oldDateTime.getTime() + tick * 100) / 1000);
            oldDateTime = newDateTime;

            if (newtick != oldtick) {
                var LNTime = new Date();
                var LElapse = (LNTime.getTime() - watcher.localKeys[watcher.key_enter]) / 1000;

                if (LElapse > 5) {
                    watcher.localKeys[watcher.key_lock] = 0;
                    watcher.localKeys[watcher.key_enter] = LNTime.getTime();
                }
                if (this.started) setTimeout(go_watch, 100);
            } else {
                if (this.started) setTimeout(go_watch, 100);
            }
        };
        go_watch();
    };

    stop() {
        this.started = false;
    };

}

module.exports = LockWatch;
