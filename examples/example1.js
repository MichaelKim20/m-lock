
var lock = require('../');

lock.addLock('data');

setInterval(() => {
    lock.enter('data', (success) => {
        if (success) {
            console.info('O  ' + new Date());
            setTimeout(() => {
                console.info('X  ' + new Date());
                lock.leave('data');
            }, 1000);
        }
    }, () => {
        console.log('check_timeout');
        return false;
    })
}, 2000);
