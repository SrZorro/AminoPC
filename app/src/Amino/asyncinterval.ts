//@ts-ignore
function AsyncInterval(work, interval, timeout) {

    if (!(this instanceof AsyncInterval)) {
        //@ts-ignore
        return new AsyncInterval(work, interval, timeout);
    }

    if (typeof work !== 'function') {
        throw new Error('asyncInterval requires a function');
    }

    if (typeof interval !== 'number') {
        throw new Error('asyncInterval requires a number for interval');
    }

    if (timeout !== null && timeout !== undefined) {
        if (typeof timeout !== 'number') {
            throw new Error('asyncInterval requires a number for timeout');
        }
    }

    var _self = this;

    _self.work = work;
    _self.interval = interval;
    _self.timeout = timeout;
    _self.timeouttimer = null;
    _self.timeoutfn = null;

    _self.run = function() {

        _self.clear();
        _self.timer = setTimeout(_self.work, _self.interval, _self.done);
        if (_self.timeout !== null && _self.timeout !== undefined) {
            _self.timeouttimer = setTimeout(_self.timedOut, _self.timeout);
        }
    };

    _self.done = function() {

        _self.run();
    };

    _self.clear = function() {

        clearTimeout(_self.timer);
        _self.timer = null;
        clearTimeout(_self.timeouttimer);
        _self.timeouttimer = null;
    };

    _self.timedOut = function() {

        _self.clear();
        if (_self.timeoutfn !== null && _self.timeoutfn !== undefined) {
            if (typeof(_self.timeoutfn) === 'function') {
                _self.timeoutfn();
            }
        }

        _self.run();
    };

//@ts-ignore
    
    _self.onTimeout = function(callback) {

        _self.timeoutfn = callback;
    };

    _self.run();
    return _self;
}
//@ts-ignore

export default function(work, interval, timeout) {

//@ts-ignore
var asyncInterval = new AsyncInterval(work, interval, timeout);
    return asyncInterval;
};