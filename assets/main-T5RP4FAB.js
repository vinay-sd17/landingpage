var Cw = Object.defineProperty, Dw = Object.defineProperties;
var Iw = Object.getOwnPropertyDescriptors;
var Jo = Object.getOwnPropertySymbols;
var lp = Object.prototype.hasOwnProperty, cp = Object.prototype.propertyIsEnumerable;
var ap = (t, e, n) => e in t ? Cw(t, e, {enumerable: !0, configurable: !0, writable: !0, value: n}) : t[e] = n,
    k = (t, e) => {
        for (var n in e ||= {}) lp.call(e, n) && ap(t, n, e[n]);
        if (Jo) for (var n of Jo(e)) cp.call(e, n) && ap(t, n, e[n]);
        return t
    }, Se = (t, e) => Dw(t, Iw(e));
var up = (t, e) => {
    var n = {};
    for (var i in t) lp.call(t, i) && e.indexOf(i) < 0 && (n[i] = t[i]);
    if (t != null && Jo) for (var i of Jo(t)) e.indexOf(i) < 0 && cp.call(t, i) && (n[i] = t[i]);
    return n
};
var dp = null;
var Nl = 1, fp = Symbol("SIGNAL");

function me(t) {
    let e = dp;
    return dp = t, e
}

var pp = {
    version: 0,
    lastCleanEpoch: 0,
    dirty: !1,
    producerNode: void 0,
    producerLastReadVersion: void 0,
    producerIndexOfThis: void 0,
    nextProducerIndex: 0,
    liveConsumerNode: void 0,
    liveConsumerIndexOfThis: void 0,
    consumerAllowSignalWrites: !1,
    consumerIsAlwaysLive: !1,
    producerMustRecompute: () => !1,
    producerRecomputeValue: () => {
    },
    consumerMarkedDirty: () => {
    },
    consumerOnSignalRead: () => {
    }
};

function Mw(t) {
    if (!(kl(t) && !t.dirty) && !(!t.dirty && t.lastCleanEpoch === Nl)) {
        if (!t.producerMustRecompute(t) && !Ol(t)) {
            t.dirty = !1, t.lastCleanEpoch = Nl;
            return
        }
        t.producerRecomputeValue(t), t.dirty = !1, t.lastCleanEpoch = Nl
    }
}

function hp(t) {
    return t && (t.nextProducerIndex = 0), me(t)
}

function mp(t, e) {
    if (me(e), !(!t || t.producerNode === void 0 || t.producerIndexOfThis === void 0 || t.producerLastReadVersion === void 0)) {
        if (kl(t)) for (let n = t.nextProducerIndex; n < t.producerNode.length; n++) Pl(t.producerNode[n], t.producerIndexOfThis[n]);
        for (; t.producerNode.length > t.nextProducerIndex;) t.producerNode.pop(), t.producerLastReadVersion.pop(), t.producerIndexOfThis.pop()
    }
}

function Ol(t) {
    es(t);
    for (let e = 0; e < t.producerNode.length; e++) {
        let n = t.producerNode[e], i = t.producerLastReadVersion[e];
        if (i !== n.version || (Mw(n), i !== n.version)) return !0
    }
    return !1
}

function gp(t) {
    if (es(t), kl(t)) for (let e = 0; e < t.producerNode.length; e++) Pl(t.producerNode[e], t.producerIndexOfThis[e]);
    t.producerNode.length = t.producerLastReadVersion.length = t.producerIndexOfThis.length = 0, t.liveConsumerNode && (t.liveConsumerNode.length = t.liveConsumerIndexOfThis.length = 0)
}

function Pl(t, e) {
    if (_w(t), es(t), t.liveConsumerNode.length === 1) for (let i = 0; i < t.producerNode.length; i++) Pl(t.producerNode[i], t.producerIndexOfThis[i]);
    let n = t.liveConsumerNode.length - 1;
    if (t.liveConsumerNode[e] = t.liveConsumerNode[n], t.liveConsumerIndexOfThis[e] = t.liveConsumerIndexOfThis[n], t.liveConsumerNode.length--, t.liveConsumerIndexOfThis.length--, e < t.liveConsumerNode.length) {
        let i = t.liveConsumerIndexOfThis[e], r = t.liveConsumerNode[e];
        es(r), r.producerIndexOfThis[i] = e
    }
}

function kl(t) {
    return t.consumerIsAlwaysLive || (t?.liveConsumerNode?.length ?? 0) > 0
}

function es(t) {
    t.producerNode ??= [], t.producerIndexOfThis ??= [], t.producerLastReadVersion ??= []
}

function _w(t) {
    t.liveConsumerNode ??= [], t.liveConsumerIndexOfThis ??= []
}

function Tw() {
    throw new Error
}

var xw = Tw;

function vp(t) {
    xw = t
}

function J(t) {
    return typeof t == "function"
}

function Oi(t) {
    let n = t(i => {
        Error.call(i), i.stack = new Error().stack
    });
    return n.prototype = Object.create(Error.prototype), n.prototype.constructor = n, n
}

var ts = Oi(t => function (n) {
    t(this), this.message = n ? `${n.length} errors occurred during unsubscription:
${n.map((i, r) => `${r + 1}) ${i.toString()}`).join(`
  `)}` : "", this.name = "UnsubscriptionError", this.errors = n
});

function jr(t, e) {
    if (t) {
        let n = t.indexOf(e);
        0 <= n && t.splice(n, 1)
    }
}

var Re = class t {
    constructor(e) {
        this.initialTeardown = e, this.closed = !1, this._parentage = null, this._finalizers = null
    }

    unsubscribe() {
        let e;
        if (!this.closed) {
            this.closed = !0;
            let {_parentage: n} = this;
            if (n) if (this._parentage = null, Array.isArray(n)) for (let o of n) o.remove(this); else n.remove(this);
            let {initialTeardown: i} = this;
            if (J(i)) try {
                i()
            } catch (o) {
                e = o instanceof ts ? o.errors : [o]
            }
            let {_finalizers: r} = this;
            if (r) {
                this._finalizers = null;
                for (let o of r) try {
                    yp(o)
                } catch (s) {
                    e = e ?? [], s instanceof ts ? e = [...e, ...s.errors] : e.push(s)
                }
            }
            if (e) throw new ts(e)
        }
    }

    add(e) {
        var n;
        if (e && e !== this) if (this.closed) yp(e); else {
            if (e instanceof t) {
                if (e.closed || e._hasParent(this)) return;
                e._addParent(this)
            }
            (this._finalizers = (n = this._finalizers) !== null && n !== void 0 ? n : []).push(e)
        }
    }

    _hasParent(e) {
        let {_parentage: n} = this;
        return n === e || Array.isArray(n) && n.includes(e)
    }

    _addParent(e) {
        let {_parentage: n} = this;
        this._parentage = Array.isArray(n) ? (n.push(e), n) : n ? [n, e] : e
    }

    _removeParent(e) {
        let {_parentage: n} = this;
        n === e ? this._parentage = null : Array.isArray(n) && jr(n, e)
    }

    remove(e) {
        let {_finalizers: n} = this;
        n && jr(n, e), e instanceof t && e._removeParent(this)
    }
};
Re.EMPTY = (() => {
    let t = new Re;
    return t.closed = !0, t
})();
var Fl = Re.EMPTY;

function ns(t) {
    return t instanceof Re || t && "closed" in t && J(t.remove) && J(t.add) && J(t.unsubscribe)
}

function yp(t) {
    J(t) ? t() : t.unsubscribe()
}

var Nt = {
    onUnhandledError: null,
    onStoppedNotification: null,
    Promise: void 0,
    useDeprecatedSynchronousErrorHandling: !1,
    useDeprecatedNextContext: !1
};
var Pi = {
    setTimeout(t, e, ...n) {
        let {delegate: i} = Pi;
        return i?.setTimeout ? i.setTimeout(t, e, ...n) : setTimeout(t, e, ...n)
    }, clearTimeout(t) {
        let {delegate: e} = Pi;
        return (e?.clearTimeout || clearTimeout)(t)
    }, delegate: void 0
};

function is(t) {
    Pi.setTimeout(() => {
        let {onUnhandledError: e} = Nt;
        if (e) e(t); else throw t
    })
}

function $r() {
}

var wp = Rl("C", void 0, void 0);

function bp(t) {
    return Rl("E", void 0, t)
}

function Ep(t) {
    return Rl("N", t, void 0)
}

function Rl(t, e, n) {
    return {kind: t, value: e, error: n}
}

var Zn = null;

function ki(t) {
    if (Nt.useDeprecatedSynchronousErrorHandling) {
        let e = !Zn;
        if (e && (Zn = {errorThrown: !1, error: null}), t(), e) {
            let {errorThrown: n, error: i} = Zn;
            if (Zn = null, n) throw i
        }
    } else t()
}

function Sp(t) {
    Nt.useDeprecatedSynchronousErrorHandling && Zn && (Zn.errorThrown = !0, Zn.error = t)
}

var Jn = class extends Re {
    constructor(e) {
        super(), this.isStopped = !1, e ? (this.destination = e, ns(e) && e.add(this)) : this.destination = Ow
    }

    static create(e, n, i) {
        return new Fi(e, n, i)
    }

    next(e) {
        this.isStopped ? Vl(Ep(e), this) : this._next(e)
    }

    error(e) {
        this.isStopped ? Vl(bp(e), this) : (this.isStopped = !0, this._error(e))
    }

    complete() {
        this.isStopped ? Vl(wp, this) : (this.isStopped = !0, this._complete())
    }

    unsubscribe() {
        this.closed || (this.isStopped = !0, super.unsubscribe(), this.destination = null)
    }

    _next(e) {
        this.destination.next(e)
    }

    _error(e) {
        try {
            this.destination.error(e)
        } finally {
            this.unsubscribe()
        }
    }

    _complete() {
        try {
            this.destination.complete()
        } finally {
            this.unsubscribe()
        }
    }
}, Aw = Function.prototype.bind;

function Ll(t, e) {
    return Aw.call(t, e)
}

var jl = class {
    constructor(e) {
        this.partialObserver = e
    }

    next(e) {
        let {partialObserver: n} = this;
        if (n.next) try {
            n.next(e)
        } catch (i) {
            rs(i)
        }
    }

    error(e) {
        let {partialObserver: n} = this;
        if (n.error) try {
            n.error(e)
        } catch (i) {
            rs(i)
        } else rs(e)
    }

    complete() {
        let {partialObserver: e} = this;
        if (e.complete) try {
            e.complete()
        } catch (n) {
            rs(n)
        }
    }
}, Fi = class extends Jn {
    constructor(e, n, i) {
        super();
        let r;
        if (J(e) || !e) r = {next: e ?? void 0, error: n ?? void 0, complete: i ?? void 0}; else {
            let o;
            this && Nt.useDeprecatedNextContext ? (o = Object.create(e), o.unsubscribe = () => this.unsubscribe(), r = {
                next: e.next && Ll(e.next, o),
                error: e.error && Ll(e.error, o),
                complete: e.complete && Ll(e.complete, o)
            }) : r = e
        }
        this.destination = new jl(r)
    }
};

function rs(t) {
    Nt.useDeprecatedSynchronousErrorHandling ? Sp(t) : is(t)
}

function Nw(t) {
    throw t
}

function Vl(t, e) {
    let {onStoppedNotification: n} = Nt;
    n && Pi.setTimeout(() => n(t, e))
}

var Ow = {closed: !0, next: $r, error: Nw, complete: $r};
var Ri = typeof Symbol == "function" && Symbol.observable || "@@observable";

function pt(t) {
    return t
}

function $l(...t) {
    return Bl(t)
}

function Bl(t) {
    return t.length === 0 ? pt : t.length === 1 ? t[0] : function (n) {
        return t.reduce((i, r) => r(i), n)
    }
}

var ge = (() => {
    class t {
        constructor(n) {
            n && (this._subscribe = n)
        }

        lift(n) {
            let i = new t;
            return i.source = this, i.operator = n, i
        }

        subscribe(n, i, r) {
            let o = kw(n) ? n : new Fi(n, i, r);
            return ki(() => {
                let {operator: s, source: a} = this;
                o.add(s ? s.call(o, a) : a ? this._subscribe(o) : this._trySubscribe(o))
            }), o
        }

        _trySubscribe(n) {
            try {
                return this._subscribe(n)
            } catch (i) {
                n.error(i)
            }
        }

        forEach(n, i) {
            return i = Cp(i), new i((r, o) => {
                let s = new Fi({
                    next: a => {
                        try {
                            n(a)
                        } catch (l) {
                            o(l), s.unsubscribe()
                        }
                    }, error: o, complete: r
                });
                this.subscribe(s)
            })
        }

        _subscribe(n) {
            var i;
            return (i = this.source) === null || i === void 0 ? void 0 : i.subscribe(n)
        }

        [Ri]() {
            return this
        }

        pipe(...n) {
            return Bl(n)(this)
        }

        toPromise(n) {
            return n = Cp(n), new n((i, r) => {
                let o;
                this.subscribe(s => o = s, s => r(s), () => i(o))
            })
        }
    }

    return t.create = e => new t(e), t
})();

function Cp(t) {
    var e;
    return (e = t ?? Nt.Promise) !== null && e !== void 0 ? e : Promise
}

function Pw(t) {
    return t && J(t.next) && J(t.error) && J(t.complete)
}

function kw(t) {
    return t && t instanceof Jn || Pw(t) && ns(t)
}

function Hl(t) {
    return J(t?.lift)
}

function fe(t) {
    return e => {
        if (Hl(e)) return e.lift(function (n) {
            try {
                return t(n, this)
            } catch (i) {
                this.error(i)
            }
        });
        throw new TypeError("Unable to lift unknown Observable type")
    }
}

function ue(t, e, n, i, r) {
    return new Ul(t, e, n, i, r)
}

var Ul = class extends Jn {
    constructor(e, n, i, r, o, s) {
        super(e), this.onFinalize = o, this.shouldUnsubscribe = s, this._next = n ? function (a) {
            try {
                n(a)
            } catch (l) {
                e.error(l)
            }
        } : super._next, this._error = r ? function (a) {
            try {
                r(a)
            } catch (l) {
                e.error(l)
            } finally {
                this.unsubscribe()
            }
        } : super._error, this._complete = i ? function () {
            try {
                i()
            } catch (a) {
                e.error(a)
            } finally {
                this.unsubscribe()
            }
        } : super._complete
    }

    unsubscribe() {
        var e;
        if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
            let {closed: n} = this;
            super.unsubscribe(), !n && ((e = this.onFinalize) === null || e === void 0 || e.call(this))
        }
    }
};

function Li() {
    return fe((t, e) => {
        let n = null;
        t._refCount++;
        let i = ue(e, void 0, void 0, void 0, () => {
            if (!t || t._refCount <= 0 || 0 < --t._refCount) {
                n = null;
                return
            }
            let r = t._connection, o = n;
            n = null, r && (!o || r === o) && r.unsubscribe(), e.unsubscribe()
        });
        t.subscribe(i), i.closed || (n = t.connect())
    })
}

var Vi = class extends ge {
    constructor(e, n) {
        super(), this.source = e, this.subjectFactory = n, this._subject = null, this._refCount = 0, this._connection = null, Hl(e) && (this.lift = e.lift)
    }

    _subscribe(e) {
        return this.getSubject().subscribe(e)
    }

    getSubject() {
        let e = this._subject;
        return (!e || e.isStopped) && (this._subject = this.subjectFactory()), this._subject
    }

    _teardown() {
        this._refCount = 0;
        let {_connection: e} = this;
        this._subject = this._connection = null, e?.unsubscribe()
    }

    connect() {
        let e = this._connection;
        if (!e) {
            e = this._connection = new Re;
            let n = this.getSubject();
            e.add(this.source.subscribe(ue(n, void 0, () => {
                this._teardown(), n.complete()
            }, i => {
                this._teardown(), n.error(i)
            }, () => this._teardown()))), e.closed && (this._connection = null, e = Re.EMPTY)
        }
        return e
    }

    refCount() {
        return Li()(this)
    }
};
var Dp = Oi(t => function () {
    t(this), this.name = "ObjectUnsubscribedError", this.message = "object unsubscribed"
});
var Qe = (() => {
    class t extends ge {
        constructor() {
            super(), this.closed = !1, this.currentObservers = null, this.observers = [], this.isStopped = !1, this.hasError = !1, this.thrownError = null
        }

        lift(n) {
            let i = new os(this, this);
            return i.operator = n, i
        }

        _throwIfClosed() {
            if (this.closed) throw new Dp
        }

        next(n) {
            ki(() => {
                if (this._throwIfClosed(), !this.isStopped) {
                    this.currentObservers || (this.currentObservers = Array.from(this.observers));
                    for (let i of this.currentObservers) i.next(n)
                }
            })
        }

        error(n) {
            ki(() => {
                if (this._throwIfClosed(), !this.isStopped) {
                    this.hasError = this.isStopped = !0, this.thrownError = n;
                    let {observers: i} = this;
                    for (; i.length;) i.shift().error(n)
                }
            })
        }

        complete() {
            ki(() => {
                if (this._throwIfClosed(), !this.isStopped) {
                    this.isStopped = !0;
                    let {observers: n} = this;
                    for (; n.length;) n.shift().complete()
                }
            })
        }

        unsubscribe() {
            this.isStopped = this.closed = !0, this.observers = this.currentObservers = null
        }

        get observed() {
            var n;
            return ((n = this.observers) === null || n === void 0 ? void 0 : n.length) > 0
        }

        _trySubscribe(n) {
            return this._throwIfClosed(), super._trySubscribe(n)
        }

        _subscribe(n) {
            return this._throwIfClosed(), this._checkFinalizedStatuses(n), this._innerSubscribe(n)
        }

        _innerSubscribe(n) {
            let {hasError: i, isStopped: r, observers: o} = this;
            return i || r ? Fl : (this.currentObservers = null, o.push(n), new Re(() => {
                this.currentObservers = null, jr(o, n)
            }))
        }

        _checkFinalizedStatuses(n) {
            let {hasError: i, thrownError: r, isStopped: o} = this;
            i ? n.error(r) : o && n.complete()
        }

        asObservable() {
            let n = new ge;
            return n.source = this, n
        }
    }

    return t.create = (e, n) => new os(e, n), t
})(), os = class extends Qe {
    constructor(e, n) {
        super(), this.destination = e, this.source = n
    }

    next(e) {
        var n, i;
        (i = (n = this.destination) === null || n === void 0 ? void 0 : n.next) === null || i === void 0 || i.call(n, e)
    }

    error(e) {
        var n, i;
        (i = (n = this.destination) === null || n === void 0 ? void 0 : n.error) === null || i === void 0 || i.call(n, e)
    }

    complete() {
        var e, n;
        (n = (e = this.destination) === null || e === void 0 ? void 0 : e.complete) === null || n === void 0 || n.call(e)
    }

    _subscribe(e) {
        var n, i;
        return (i = (n = this.source) === null || n === void 0 ? void 0 : n.subscribe(e)) !== null && i !== void 0 ? i : Fl
    }
};
var Ue = class extends Qe {
    constructor(e) {
        super(), this._value = e
    }

    get value() {
        return this.getValue()
    }

    _subscribe(e) {
        let n = super._subscribe(e);
        return !n.closed && e.next(this._value), n
    }

    getValue() {
        let {hasError: e, thrownError: n, _value: i} = this;
        if (e) throw n;
        return this._throwIfClosed(), i
    }

    next(e) {
        super.next(this._value = e)
    }
};
var ht = new ge(t => t.complete());

function Ip(t) {
    return t && J(t.schedule)
}

function Mp(t) {
    return t[t.length - 1]
}

function ss(t) {
    return J(Mp(t)) ? t.pop() : void 0
}

function _n(t) {
    return Ip(Mp(t)) ? t.pop() : void 0
}

function Tp(t, e, n, i) {
    function r(o) {
        return o instanceof n ? o : new n(function (s) {
            s(o)
        })
    }

    return new (n || (n = Promise))(function (o, s) {
        function a(f) {
            try {
                c(i.next(f))
            } catch (p) {
                s(p)
            }
        }

        function l(f) {
            try {
                c(i.throw(f))
            } catch (p) {
                s(p)
            }
        }

        function c(f) {
            f.done ? o(f.value) : r(f.value).then(a, l)
        }

        c((i = i.apply(t, e || [])).next())
    })
}

function _p(t) {
    var e = typeof Symbol == "function" && Symbol.iterator, n = e && t[e], i = 0;
    if (n) return n.call(t);
    if (t && typeof t.length == "number") return {
        next: function () {
            return t && i >= t.length && (t = void 0), {value: t && t[i++], done: !t}
        }
    };
    throw new TypeError(e ? "Object is not iterable." : "Symbol.iterator is not defined.")
}

function ei(t) {
    return this instanceof ei ? (this.v = t, this) : new ei(t)
}

function xp(t, e, n) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var i = n.apply(t, e || []), r, o = [];
    return r = {}, s("next"), s("throw"), s("return"), r[Symbol.asyncIterator] = function () {
        return this
    }, r;

    function s(m) {
        i[m] && (r[m] = function (g) {
            return new Promise(function (b, E) {
                o.push([m, g, b, E]) > 1 || a(m, g)
            })
        })
    }

    function a(m, g) {
        try {
            l(i[m](g))
        } catch (b) {
            p(o[0][3], b)
        }
    }

    function l(m) {
        m.value instanceof ei ? Promise.resolve(m.value.v).then(c, f) : p(o[0][2], m)
    }

    function c(m) {
        a("next", m)
    }

    function f(m) {
        a("throw", m)
    }

    function p(m, g) {
        m(g), o.shift(), o.length && a(o[0][0], o[0][1])
    }
}

function Ap(t) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var e = t[Symbol.asyncIterator], n;
    return e ? e.call(t) : (t = typeof _p == "function" ? _p(t) : t[Symbol.iterator](), n = {}, i("next"), i("throw"), i("return"), n[Symbol.asyncIterator] = function () {
        return this
    }, n);

    function i(o) {
        n[o] = t[o] && function (s) {
            return new Promise(function (a, l) {
                s = t[o](s), r(a, l, s.done, s.value)
            })
        }
    }

    function r(o, s, a, l) {
        Promise.resolve(l).then(function (c) {
            o({value: c, done: a})
        }, s)
    }
}

var as = t => t && typeof t.length == "number" && typeof t != "function";

function ls(t) {
    return J(t?.then)
}

function cs(t) {
    return J(t[Ri])
}

function us(t) {
    return Symbol.asyncIterator && J(t?.[Symbol.asyncIterator])
}

function ds(t) {
    return new TypeError(`You provided ${t !== null && typeof t == "object" ? "an invalid object" : `'${t}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`)
}

function Fw() {
    return typeof Symbol != "function" || !Symbol.iterator ? "@@iterator" : Symbol.iterator
}

var fs = Fw();

function ps(t) {
    return J(t?.[fs])
}

function hs(t) {
    return xp(this, arguments, function* () {
        let n = t.getReader();
        try {
            for (; ;) {
                let {value: i, done: r} = yield ei(n.read());
                if (r) return yield ei(void 0);
                yield yield ei(i)
            }
        } finally {
            n.releaseLock()
        }
    })
}

function ms(t) {
    return J(t?.getReader)
}

function Oe(t) {
    if (t instanceof ge) return t;
    if (t != null) {
        if (cs(t)) return Rw(t);
        if (as(t)) return Lw(t);
        if (ls(t)) return Vw(t);
        if (us(t)) return Np(t);
        if (ps(t)) return jw(t);
        if (ms(t)) return $w(t)
    }
    throw ds(t)
}

function Rw(t) {
    return new ge(e => {
        let n = t[Ri]();
        if (J(n.subscribe)) return n.subscribe(e);
        throw new TypeError("Provided object does not correctly implement Symbol.observable")
    })
}

function Lw(t) {
    return new ge(e => {
        for (let n = 0; n < t.length && !e.closed; n++) e.next(t[n]);
        e.complete()
    })
}

function Vw(t) {
    return new ge(e => {
        t.then(n => {
            e.closed || (e.next(n), e.complete())
        }, n => e.error(n)).then(null, is)
    })
}

function jw(t) {
    return new ge(e => {
        for (let n of t) if (e.next(n), e.closed) return;
        e.complete()
    })
}

function Np(t) {
    return new ge(e => {
        Bw(t, e).catch(n => e.error(n))
    })
}

function $w(t) {
    return Np(hs(t))
}

function Bw(t, e) {
    var n, i, r, o;
    return Tp(this, void 0, void 0, function* () {
        try {
            for (n = Ap(t); i = yield n.next(), !i.done;) {
                let s = i.value;
                if (e.next(s), e.closed) return
            }
        } catch (s) {
            r = {error: s}
        } finally {
            try {
                i && !i.done && (o = n.return) && (yield o.call(n))
            } finally {
                if (r) throw r.error
            }
        }
        e.complete()
    })
}

function lt(t, e, n, i = 0, r = !1) {
    let o = e.schedule(function () {
        n(), r ? t.add(this.schedule(null, i)) : this.unsubscribe()
    }, i);
    if (t.add(o), !r) return o
}

function gs(t, e = 0) {
    return fe((n, i) => {
        n.subscribe(ue(i, r => lt(i, t, () => i.next(r), e), () => lt(i, t, () => i.complete(), e), r => lt(i, t, () => i.error(r), e)))
    })
}

function vs(t, e = 0) {
    return fe((n, i) => {
        i.add(t.schedule(() => n.subscribe(i), e))
    })
}

function Op(t, e) {
    return Oe(t).pipe(vs(e), gs(e))
}

function Pp(t, e) {
    return Oe(t).pipe(vs(e), gs(e))
}

function kp(t, e) {
    return new ge(n => {
        let i = 0;
        return e.schedule(function () {
            i === t.length ? n.complete() : (n.next(t[i++]), n.closed || this.schedule())
        })
    })
}

function Fp(t, e) {
    return new ge(n => {
        let i;
        return lt(n, e, () => {
            i = t[fs](), lt(n, e, () => {
                let r, o;
                try {
                    ({value: r, done: o} = i.next())
                } catch (s) {
                    n.error(s);
                    return
                }
                o ? n.complete() : n.next(r)
            }, 0, !0)
        }), () => J(i?.return) && i.return()
    })
}

function ys(t, e) {
    if (!t) throw new Error("Iterable cannot be null");
    return new ge(n => {
        lt(n, e, () => {
            let i = t[Symbol.asyncIterator]();
            lt(n, e, () => {
                i.next().then(r => {
                    r.done ? n.complete() : n.next(r.value)
                })
            }, 0, !0)
        })
    })
}

function Rp(t, e) {
    return ys(hs(t), e)
}

function Lp(t, e) {
    if (t != null) {
        if (cs(t)) return Op(t, e);
        if (as(t)) return kp(t, e);
        if (ls(t)) return Pp(t, e);
        if (us(t)) return ys(t, e);
        if (ps(t)) return Fp(t, e);
        if (ms(t)) return Rp(t, e)
    }
    throw ds(t)
}

function Te(t, e) {
    return e ? Lp(t, e) : Oe(t)
}

function q(...t) {
    let e = _n(t);
    return Te(t, e)
}

function ji(t, e) {
    let n = J(t) ? t : () => t, i = r => r.error(n());
    return new ge(e ? r => e.schedule(i, 0, r) : i)
}

function zl(t) {
    return !!t && (t instanceof ge || J(t.lift) && J(t.subscribe))
}

var rn = Oi(t => function () {
    t(this), this.name = "EmptyError", this.message = "no elements in sequence"
});

function ie(t, e) {
    return fe((n, i) => {
        let r = 0;
        n.subscribe(ue(i, o => {
            i.next(t.call(e, o, r++))
        }))
    })
}

var {isArray: Hw} = Array;

function Uw(t, e) {
    return Hw(e) ? t(...e) : t(e)
}

function ws(t) {
    return ie(e => Uw(t, e))
}

var {isArray: zw} = Array, {getPrototypeOf: Gw, prototype: qw, keys: Ww} = Object;

function bs(t) {
    if (t.length === 1) {
        let e = t[0];
        if (zw(e)) return {args: e, keys: null};
        if (Yw(e)) {
            let n = Ww(e);
            return {args: n.map(i => e[i]), keys: n}
        }
    }
    return {args: t, keys: null}
}

function Yw(t) {
    return t && typeof t == "object" && Gw(t) === qw
}

function Es(t, e) {
    return t.reduce((n, i, r) => (n[i] = e[r], n), {})
}

function Br(...t) {
    let e = _n(t), n = ss(t), {args: i, keys: r} = bs(t);
    if (i.length === 0) return Te([], e);
    let o = new ge(Qw(i, e, r ? s => Es(r, s) : pt));
    return n ? o.pipe(ws(n)) : o
}

function Qw(t, e, n = pt) {
    return i => {
        Vp(e, () => {
            let {length: r} = t, o = new Array(r), s = r, a = r;
            for (let l = 0; l < r; l++) Vp(e, () => {
                let c = Te(t[l], e), f = !1;
                c.subscribe(ue(i, p => {
                    o[l] = p, f || (f = !0, a--), a || i.next(n(o.slice()))
                }, () => {
                    --s || i.complete()
                }))
            }, i)
        }, i)
    }
}

function Vp(t, e, n) {
    t ? lt(n, t, e) : e()
}

function jp(t, e, n, i, r, o, s, a) {
    let l = [], c = 0, f = 0, p = !1, m = () => {
        p && !l.length && !c && e.complete()
    }, g = E => c < i ? b(E) : l.push(E), b = E => {
        o && e.next(E), c++;
        let M = !1;
        Oe(n(E, f++)).subscribe(ue(e, w => {
            r?.(w), o ? g(w) : e.next(w)
        }, () => {
            M = !0
        }, void 0, () => {
            if (M) try {
                for (c--; l.length && c < i;) {
                    let w = l.shift();
                    s ? lt(e, s, () => b(w)) : b(w)
                }
                m()
            } catch (w) {
                e.error(w)
            }
        }))
    };
    return t.subscribe(ue(e, g, () => {
        p = !0, m()
    })), () => {
        a?.()
    }
}

function Pe(t, e, n = 1 / 0) {
    return J(e) ? Pe((i, r) => ie((o, s) => e(i, o, r, s))(Oe(t(i, r))), n) : (typeof e == "number" && (n = e), fe((i, r) => jp(i, r, t, n)))
}

function Tn(t = 1 / 0) {
    return Pe(pt, t)
}

function $p() {
    return Tn(1)
}

function $i(...t) {
    return $p()(Te(t, _n(t)))
}

function Ss(t) {
    return new ge(e => {
        Oe(t()).subscribe(e)
    })
}

function Gl(...t) {
    let e = ss(t), {args: n, keys: i} = bs(t), r = new ge(o => {
        let {length: s} = n;
        if (!s) {
            o.complete();
            return
        }
        let a = new Array(s), l = s, c = s;
        for (let f = 0; f < s; f++) {
            let p = !1;
            Oe(n[f]).subscribe(ue(o, m => {
                p || (p = !0, c--), a[f] = m
            }, () => l--, void 0, () => {
                (!l || !p) && (c || o.next(i ? Es(i, a) : a), o.complete())
            }))
        }
    });
    return e ? r.pipe(ws(e)) : r
}

function Dt(t, e) {
    return fe((n, i) => {
        let r = 0;
        n.subscribe(ue(i, o => t.call(e, o, r++) && i.next(o)))
    })
}

function xn(t) {
    return fe((e, n) => {
        let i = null, r = !1, o;
        i = e.subscribe(ue(n, void 0, void 0, s => {
            o = Oe(t(s, xn(t)(e))), i ? (i.unsubscribe(), i = null, o.subscribe(n)) : r = !0
        })), r && (i.unsubscribe(), i = null, o.subscribe(n))
    })
}

function Bp(t, e, n, i, r) {
    return (o, s) => {
        let a = n, l = e, c = 0;
        o.subscribe(ue(s, f => {
            let p = c++;
            l = a ? t(l, f, p) : (a = !0, f), i && s.next(l)
        }, r && (() => {
            a && s.next(l), s.complete()
        })))
    }
}

function ti(t, e) {
    return J(e) ? Pe(t, e, 1) : Pe(t, 1)
}

function An(t) {
    return fe((e, n) => {
        let i = !1;
        e.subscribe(ue(n, r => {
            i = !0, n.next(r)
        }, () => {
            i || n.next(t), n.complete()
        }))
    })
}

function on(t) {
    return t <= 0 ? () => ht : fe((e, n) => {
        let i = 0;
        e.subscribe(ue(n, r => {
            ++i <= t && (n.next(r), t <= i && n.complete())
        }))
    })
}

function ql(t) {
    return ie(() => t)
}

function Cs(t = Xw) {
    return fe((e, n) => {
        let i = !1;
        e.subscribe(ue(n, r => {
            i = !0, n.next(r)
        }, () => i ? n.complete() : n.error(t())))
    })
}

function Xw() {
    return new rn
}

function Hr(t) {
    return fe((e, n) => {
        try {
            e.subscribe(n)
        } finally {
            n.add(t)
        }
    })
}

function Ut(t, e) {
    let n = arguments.length >= 2;
    return i => i.pipe(t ? Dt((r, o) => t(r, o, i)) : pt, on(1), n ? An(e) : Cs(() => new rn))
}

function Bi(t) {
    return t <= 0 ? () => ht : fe((e, n) => {
        let i = [];
        e.subscribe(ue(n, r => {
            i.push(r), t < i.length && i.shift()
        }, () => {
            for (let r of i) n.next(r);
            n.complete()
        }, void 0, () => {
            i = null
        }))
    })
}

function Wl(t, e) {
    let n = arguments.length >= 2;
    return i => i.pipe(t ? Dt((r, o) => t(r, o, i)) : pt, Bi(1), n ? An(e) : Cs(() => new rn))
}

function Yl(t, e) {
    return fe(Bp(t, e, arguments.length >= 2, !0))
}

function Ql(...t) {
    let e = _n(t);
    return fe((n, i) => {
        (e ? $i(t, n, e) : $i(t, n)).subscribe(i)
    })
}

function nt(t, e) {
    return fe((n, i) => {
        let r = null, o = 0, s = !1, a = () => s && !r && i.complete();
        n.subscribe(ue(i, l => {
            r?.unsubscribe();
            let c = 0, f = o++;
            Oe(t(l, f)).subscribe(r = ue(i, p => i.next(e ? e(l, p, f, c++) : p), () => {
                r = null, a()
            }))
        }, () => {
            s = !0, a()
        }))
    })
}

function Xl(t) {
    return fe((e, n) => {
        Oe(t).subscribe(ue(n, () => n.complete(), $r)), !n.closed && e.subscribe(n)
    })
}

function ze(t, e, n) {
    let i = J(t) || e || n ? {next: t, error: e, complete: n} : t;
    return i ? fe((r, o) => {
        var s;
        (s = i.subscribe) === null || s === void 0 || s.call(i);
        let a = !0;
        r.subscribe(ue(o, l => {
            var c;
            (c = i.next) === null || c === void 0 || c.call(i, l), o.next(l)
        }, () => {
            var l;
            a = !1, (l = i.complete) === null || l === void 0 || l.call(i), o.complete()
        }, l => {
            var c;
            a = !1, (c = i.error) === null || c === void 0 || c.call(i, l), o.error(l)
        }, () => {
            var l, c;
            a && ((l = i.unsubscribe) === null || l === void 0 || l.call(i)), (c = i.finalize) === null || c === void 0 || c.call(i)
        }))
    }) : pt
}

var Ah = "https://g.co/ng/security#xss", _ = class extends Error {
    constructor(e, n) {
        super(pu(e, n)), this.code = e
    }
};

function pu(t, e) {
    return `${`NG0${Math.abs(t)}`}${e ? ": " + e : ""}`
}

function Jr(t) {
    return {toString: t}.toString()
}

var Ds = "__parameters__";

function Kw(t) {
    return function (...n) {
        if (t) {
            let i = t(...n);
            for (let r in i) this[r] = i[r]
        }
    }
}

function Nh(t, e, n) {
    return Jr(() => {
        let i = Kw(e);

        function r(...o) {
            if (this instanceof r) return i.apply(this, o), this;
            let s = new r(...o);
            return a.annotation = s, a;

            function a(l, c, f) {
                let p = l.hasOwnProperty(Ds) ? l[Ds] : Object.defineProperty(l, Ds, {value: []})[Ds];
                for (; p.length <= f;) p.push(null);
                return (p[f] = p[f] || []).push(s), l
            }
        }

        return n && (r.prototype = Object.create(n.prototype)), r.prototype.ngMetadataName = t, r.annotationCls = r, r
    })
}

var sn = globalThis;

function De(t) {
    for (let e in t) if (t[e] === De) return e;
    throw Error("Could not find renamed property on target object.")
}

function Zw(t, e) {
    for (let n in e) e.hasOwnProperty(n) && !t.hasOwnProperty(n) && (t[n] = e[n])
}

function rt(t) {
    if (typeof t == "string") return t;
    if (Array.isArray(t)) return "[" + t.map(rt).join(", ") + "]";
    if (t == null) return "" + t;
    if (t.overriddenName) return `${t.overriddenName}`;
    if (t.name) return `${t.name}`;
    let e = t.toString();
    if (e == null) return "" + e;
    let n = e.indexOf(`
`);
    return n === -1 ? e : e.substring(0, n)
}

function fc(t, e) {
    return t == null || t === "" ? e === null ? "" : e : e == null || e === "" ? t : t + " " + e
}

var Jw = De({__forward_ref__: De});

function pi(t) {
    return t.__forward_ref__ = pi, t.toString = function () {
        return rt(this())
    }, t
}

function it(t) {
    return Oh(t) ? t() : t
}

function Oh(t) {
    return typeof t == "function" && t.hasOwnProperty(Jw) && t.__forward_ref__ === pi
}

function B(t) {
    return {token: t.token, providedIn: t.providedIn || null, factory: t.factory, value: void 0}
}

function cn(t) {
    return {providers: t.providers || [], imports: t.imports || []}
}

function ta(t) {
    return Hp(t, kh) || Hp(t, Fh)
}

function Ph(t) {
    return ta(t) !== null
}

function Hp(t, e) {
    return t.hasOwnProperty(e) ? t[e] : null
}

function eb(t) {
    let e = t && (t[kh] || t[Fh]);
    return e || null
}

function Up(t) {
    return t && (t.hasOwnProperty(zp) || t.hasOwnProperty(tb)) ? t[zp] : null
}

var kh = De({\u0275prov: De}), zp = De({\u0275inj: De}), Fh = De({ngInjectableDef: De}), tb = De({ngInjectorDef: De}),
    Z = class {
        constructor(e, n) {
            this._desc = e, this.ngMetadataName = "InjectionToken", this.\u0275prov = void 0, typeof n == "number" ? this.__NG_ELEMENT_ID__ = n : n !== void 0 && (this.\u0275prov = B({
                token: this,
                providedIn: n.providedIn || "root",
                factory: n.factory
            }))
        }

        get multi() {
            return this
        }

        toString() {
            return `InjectionToken ${this._desc}`
        }
    };

function Rh(t) {
    return t && !!t.\u0275providers
}

var nb = De({\u0275cmp: De}), ib = De({\u0275dir: De}), rb = De({\u0275pipe: De}), ob = De({\u0275mod: De}),
    Rs = De({\u0275fac: De}), Ur = De({__NG_ELEMENT_ID__: De}), Gp = De({__NG_ENV_ID__: De});

function eo(t) {
    return typeof t == "string" ? t : t == null ? "" : String(t)
}

function sb(t) {
    return typeof t == "function" ? t.name || t.toString() : typeof t == "object" && t != null && typeof t.type == "function" ? t.type.name || t.type.toString() : eo(t)
}

function ab(t, e) {
    let n = e ? `. Dependency path: ${e.join(" > ")} > ${t}` : "";
    throw new _(-200, t)
}

function hu(t, e) {
    throw new _(-201, !1)
}

var oe = function (t) {
    return t[t.Default = 0] = "Default", t[t.Host = 1] = "Host", t[t.Self = 2] = "Self", t[t.SkipSelf = 4] = "SkipSelf", t[t.Optional = 8] = "Optional", t
}(oe || {}), pc;

function Lh() {
    return pc
}

function It(t) {
    let e = pc;
    return pc = t, e
}

function Vh(t, e, n) {
    let i = ta(t);
    if (i && i.providedIn == "root") return i.value === void 0 ? i.value = i.factory() : i.value;
    if (n & oe.Optional) return null;
    if (e !== void 0) return e;
    hu(t, "Injector")
}

var lb = {}, zr = lb, hc = "__NG_DI_FLAG__", Ls = "ngTempTokenPath", cb = "ngTokenPath", ub = /\n/gm, db = "\u0275",
    qp = "__source", qi;

function fb() {
    return qi
}

function Nn(t) {
    let e = qi;
    return qi = t, e
}

function pb(t, e = oe.Default) {
    if (qi === void 0) throw new _(-203, !1);
    return qi === null ? Vh(t, void 0, e) : qi.get(t, e & oe.Optional ? null : void 0, e)
}

function X(t, e = oe.Default) {
    return (Lh() || pb)(it(t), e)
}

function N(t, e = oe.Default) {
    return X(t, na(e))
}

function na(t) {
    return typeof t > "u" || typeof t == "number" ? t : 0 | (t.optional && 8) | (t.host && 1) | (t.self && 2) | (t.skipSelf && 4)
}

function mc(t) {
    let e = [];
    for (let n = 0; n < t.length; n++) {
        let i = it(t[n]);
        if (Array.isArray(i)) {
            if (i.length === 0) throw new _(900, !1);
            let r, o = oe.Default;
            for (let s = 0; s < i.length; s++) {
                let a = i[s], l = hb(a);
                typeof l == "number" ? l === -1 ? r = a.token : o |= l : r = a
            }
            e.push(X(r, o))
        } else e.push(X(i))
    }
    return e
}

function jh(t, e) {
    return t[hc] = e, t.prototype[hc] = e, t
}

function hb(t) {
    return t[hc]
}

function mb(t, e, n, i) {
    let r = t[Ls];
    throw e[qp] && r.unshift(e[qp]), t.message = gb(`
` + t.message, r, n, i), t[cb] = r, t[Ls] = null, t
}

function gb(t, e, n, i = null) {
    t = t && t.charAt(0) === `
` && t.charAt(1) == db ? t.slice(2) : t;
    let r = rt(e);
    if (Array.isArray(e)) r = e.map(rt).join(" -> "); else if (typeof e == "object") {
        let o = [];
        for (let s in e) if (e.hasOwnProperty(s)) {
            let a = e[s];
            o.push(s + ":" + (typeof a == "string" ? JSON.stringify(a) : rt(a)))
        }
        r = `{${o.join(", ")}}`
    }
    return `${n}${i ? "(" + i + ")" : ""}[${r}]: ${t.replace(ub, `
  `)}`
}

var to = jh(Nh("Optional"), 8);
var ia = jh(Nh("SkipSelf"), 4);

function Yi(t, e) {
    let n = t.hasOwnProperty(Rs);
    return n ? t[Rs] : null
}

function vb(t, e, n) {
    if (t.length !== e.length) return !1;
    for (let i = 0; i < t.length; i++) {
        let r = t[i], o = e[i];
        if (n && (r = n(r), o = n(o)), o !== r) return !1
    }
    return !0
}

function yb(t) {
    return t.flat(Number.POSITIVE_INFINITY)
}

function mu(t, e) {
    t.forEach(n => Array.isArray(n) ? mu(n, e) : e(n))
}

function $h(t, e, n) {
    e >= t.length ? t.push(n) : t.splice(e, 0, n)
}

function Vs(t, e) {
    return e >= t.length - 1 ? t.pop() : t.splice(e, 1)[0]
}

function wb(t, e, n, i) {
    let r = t.length;
    if (r == e) t.push(n, i); else if (r === 1) t.push(i, t[0]), t[0] = n; else {
        for (r--, t.push(t[r - 1], t[r]); r > e;) {
            let o = r - 2;
            t[r] = t[o], r--
        }
        t[e] = n, t[e + 1] = i
    }
}

function gu(t, e, n) {
    let i = no(t, e);
    return i >= 0 ? t[i | 1] = n : (i = ~i, wb(t, i, e, n)), i
}

function Kl(t, e) {
    let n = no(t, e);
    if (n >= 0) return t[n | 1]
}

function no(t, e) {
    return bb(t, e, 1)
}

function bb(t, e, n) {
    let i = 0, r = t.length >> n;
    for (; r !== i;) {
        let o = i + (r - i >> 1), s = t[o << n];
        if (e === s) return o << n;
        s > e ? r = o : i = o + 1
    }
    return ~(r << n)
}

var Qi = {}, ct = [], Xi = new Z(""), Bh = new Z("", -1), Hh = new Z(""), js = class {
    get(e, n = zr) {
        if (n === zr) {
            let i = new Error(`NullInjectorError: No provider for ${rt(e)}!`);
            throw i.name = "NullInjectorError", i
        }
        return n
    }
}, Uh = function (t) {
    return t[t.OnPush = 0] = "OnPush", t[t.Default = 1] = "Default", t
}(Uh || {}), qt = function (t) {
    return t[t.Emulated = 0] = "Emulated", t[t.None = 2] = "None", t[t.ShadowDom = 3] = "ShadowDom", t
}(qt || {}), Ge = function (t) {
    return t[t.None = 0] = "None", t[t.SignalBased = 1] = "SignalBased", t[t.HasDecoratorInputTransform = 2] = "HasDecoratorInputTransform", t
}(Ge || {});

function Eb(t, e, n) {
    let i = t.length;
    for (; ;) {
        let r = t.indexOf(e, n);
        if (r === -1) return r;
        if (r === 0 || t.charCodeAt(r - 1) <= 32) {
            let o = e.length;
            if (r + o === i || t.charCodeAt(r + o) <= 32) return r
        }
        n = r + 1
    }
}

function gc(t, e, n) {
    let i = 0;
    for (; i < n.length;) {
        let r = n[i];
        if (typeof r == "number") {
            if (r !== 0) break;
            i++;
            let o = n[i++], s = n[i++], a = n[i++];
            t.setAttribute(e, s, a, o)
        } else {
            let o = r, s = n[++i];
            Sb(o) ? t.setProperty(e, o, s) : t.setAttribute(e, o, s), i++
        }
    }
    return i
}

function zh(t) {
    return t === 3 || t === 4 || t === 6
}

function Sb(t) {
    return t.charCodeAt(0) === 64
}

function Gr(t, e) {
    if (!(e === null || e.length === 0)) if (t === null || t.length === 0) t = e.slice(); else {
        let n = -1;
        for (let i = 0; i < e.length; i++) {
            let r = e[i];
            typeof r == "number" ? n = r : n === 0 || (n === -1 || n === 2 ? Wp(t, n, r, null, e[++i]) : Wp(t, n, r, null, null))
        }
    }
    return t
}

function Wp(t, e, n, i, r) {
    let o = 0, s = t.length;
    if (e === -1) s = -1; else for (; o < t.length;) {
        let a = t[o++];
        if (typeof a == "number") {
            if (a === e) {
                s = -1;
                break
            } else if (a > e) {
                s = o - 1;
                break
            }
        }
    }
    for (; o < t.length;) {
        let a = t[o];
        if (typeof a == "number") break;
        if (a === n) {
            if (i === null) {
                r !== null && (t[o + 1] = r);
                return
            } else if (i === t[o + 1]) {
                t[o + 2] = r;
                return
            }
        }
        o++, i !== null && o++, r !== null && o++
    }
    s !== -1 && (t.splice(s, 0, e), o = s + 1), t.splice(o++, 0, n), i !== null && t.splice(o++, 0, i), r !== null && t.splice(o++, 0, r)
}

var Gh = "ng-template";

function Cb(t, e, n, i) {
    let r = 0;
    if (i) {
        for (; r < e.length && typeof e[r] == "string"; r += 2) if (e[r] === "class" && Eb(e[r + 1].toLowerCase(), n, 0) !== -1) return !0
    } else if (vu(t)) return !1;
    if (r = e.indexOf(1, r), r > -1) {
        let o;
        for (; ++r < e.length && typeof (o = e[r]) == "string";) if (o.toLowerCase() === n) return !0
    }
    return !1
}

function vu(t) {
    return t.type === 4 && t.value !== Gh
}

function Db(t, e, n) {
    let i = t.type === 4 && !n ? Gh : t.value;
    return e === i
}

function Ib(t, e, n) {
    let i = 4, r = t.attrs, o = r !== null ? Tb(r) : 0, s = !1;
    for (let a = 0; a < e.length; a++) {
        let l = e[a];
        if (typeof l == "number") {
            if (!s && !Ot(i) && !Ot(l)) return !1;
            if (s && Ot(l)) continue;
            s = !1, i = l | i & 1;
            continue
        }
        if (!s) if (i & 4) {
            if (i = 2 | i & 1, l !== "" && !Db(t, l, n) || l === "" && e.length === 1) {
                if (Ot(i)) return !1;
                s = !0
            }
        } else if (i & 8) {
            if (r === null || !Cb(t, r, l, n)) {
                if (Ot(i)) return !1;
                s = !0
            }
        } else {
            let c = e[++a], f = Mb(l, r, vu(t), n);
            if (f === -1) {
                if (Ot(i)) return !1;
                s = !0;
                continue
            }
            if (c !== "") {
                let p;
                if (f > o ? p = "" : p = r[f + 1].toLowerCase(), i & 2 && c !== p) {
                    if (Ot(i)) return !1;
                    s = !0
                }
            }
        }
    }
    return Ot(i) || s
}

function Ot(t) {
    return (t & 1) === 0
}

function Mb(t, e, n, i) {
    if (e === null) return -1;
    let r = 0;
    if (i || !n) {
        let o = !1;
        for (; r < e.length;) {
            let s = e[r];
            if (s === t) return r;
            if (s === 3 || s === 6) o = !0; else if (s === 1 || s === 2) {
                let a = e[++r];
                for (; typeof a == "string";) a = e[++r];
                continue
            } else {
                if (s === 4) break;
                if (s === 0) {
                    r += 4;
                    continue
                }
            }
            r += o ? 1 : 2
        }
        return -1
    } else return xb(e, t)
}

function _b(t, e, n = !1) {
    for (let i = 0; i < e.length; i++) if (Ib(t, e[i], n)) return !0;
    return !1
}

function Tb(t) {
    for (let e = 0; e < t.length; e++) {
        let n = t[e];
        if (zh(n)) return e
    }
    return t.length
}

function xb(t, e) {
    let n = t.indexOf(4);
    if (n > -1) for (n++; n < t.length;) {
        let i = t[n];
        if (typeof i == "number") return -1;
        if (i === e) return n;
        n++
    }
    return -1
}

function Yp(t, e) {
    return t ? ":not(" + e.trim() + ")" : e
}

function Ab(t) {
    let e = t[0], n = 1, i = 2, r = "", o = !1;
    for (; n < t.length;) {
        let s = t[n];
        if (typeof s == "string") if (i & 2) {
            let a = t[++n];
            r += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]"
        } else i & 8 ? r += "." + s : i & 4 && (r += " " + s); else r !== "" && !Ot(s) && (e += Yp(o, r), r = ""), i = s, o = o || !Ot(i);
        n++
    }
    return r !== "" && (e += Yp(o, r)), e
}

function Nb(t) {
    return t.map(Ab).join(",")
}

function Ob(t) {
    let e = [], n = [], i = 1, r = 2;
    for (; i < t.length;) {
        let o = t[i];
        if (typeof o == "string") r === 2 ? o !== "" && e.push(o, t[++i]) : r === 8 && n.push(o); else {
            if (!Ot(r)) break;
            r = o
        }
        i++
    }
    return {attrs: e, classes: n}
}

function T(t) {
    return Jr(() => {
        let e = Xh(t), n = Se(k({}, e), {
            decls: t.decls,
            vars: t.vars,
            template: t.template,
            consts: t.consts || null,
            ngContentSelectors: t.ngContentSelectors,
            onPush: t.changeDetection === Uh.OnPush,
            directiveDefs: null,
            pipeDefs: null,
            dependencies: e.standalone && t.dependencies || null,
            getStandaloneInjector: null,
            signals: t.signals ?? !1,
            data: t.data || {},
            encapsulation: t.encapsulation || qt.Emulated,
            styles: t.styles || ct,
            _: null,
            schemas: t.schemas || null,
            tView: null,
            id: ""
        });
        Kh(n);
        let i = t.dependencies;
        return n.directiveDefs = Xp(i, !1), n.pipeDefs = Xp(i, !0), n.id = Fb(n), n
    })
}

function Pb(t) {
    return Pn(t) || qh(t)
}

function kb(t) {
    return t !== null
}

function un(t) {
    return Jr(() => ({
        type: t.type,
        bootstrap: t.bootstrap || ct,
        declarations: t.declarations || ct,
        imports: t.imports || ct,
        exports: t.exports || ct,
        transitiveCompileScopes: null,
        schemas: t.schemas || null,
        id: t.id || null
    }))
}

function Qp(t, e) {
    if (t == null) return Qi;
    let n = {};
    for (let i in t) if (t.hasOwnProperty(i)) {
        let r = t[i], o, s, a = Ge.None;
        Array.isArray(r) ? (a = r[0], o = r[1], s = r[2] ?? o) : (o = r, s = r), e ? (n[o] = a !== Ge.None ? [i, a] : i, e[o] = s) : n[o] = i
    }
    return n
}

function Ve(t) {
    return Jr(() => {
        let e = Xh(t);
        return Kh(e), e
    })
}

function Pn(t) {
    return t[nb] || null
}

function qh(t) {
    return t[ib] || null
}

function Wh(t) {
    return t[rb] || null
}

function Yh(t) {
    let e = Pn(t) || qh(t) || Wh(t);
    return e !== null ? e.standalone : !1
}

function Qh(t, e) {
    let n = t[ob] || null;
    if (!n && e === !0) throw new Error(`Type ${rt(t)} does not have '\u0275mod' property.`);
    return n
}

function Xh(t) {
    let e = {};
    return {
        type: t.type,
        providersResolver: null,
        factory: null,
        hostBindings: t.hostBindings || null,
        hostVars: t.hostVars || 0,
        hostAttrs: t.hostAttrs || null,
        contentQueries: t.contentQueries || null,
        declaredInputs: e,
        inputTransforms: null,
        inputConfig: t.inputs || Qi,
        exportAs: t.exportAs || null,
        standalone: t.standalone === !0,
        signals: t.signals === !0,
        selectors: t.selectors || ct,
        viewQuery: t.viewQuery || null,
        features: t.features || null,
        setInput: null,
        findHostDirectiveDefs: null,
        hostDirectives: null,
        inputs: Qp(t.inputs, e),
        outputs: Qp(t.outputs),
        debugInfo: null
    }
}

function Kh(t) {
    t.features?.forEach(e => e(t))
}

function Xp(t, e) {
    if (!t) return null;
    let n = e ? Wh : Pb;
    return () => (typeof t == "function" ? t() : t).map(i => n(i)).filter(kb)
}

function Fb(t) {
    let e = 0,
        n = [t.selectors, t.ngContentSelectors, t.hostVars, t.hostAttrs, t.consts, t.vars, t.decls, t.encapsulation, t.standalone, t.signals, t.exportAs, JSON.stringify(t.inputs), JSON.stringify(t.outputs), Object.getOwnPropertyNames(t.type.prototype), !!t.contentQueries, !!t.viewQuery].join("|");
    for (let r of n) e = Math.imul(31, e) + r.charCodeAt(0) << 0;
    return e += 2147483648, "c" + e
}

function ra(t) {
    return {\u0275providers: t}
}

function Rb(...t) {
    return {\u0275providers: Zh(!0, t), \u0275fromNgModule: !0}
}

function Zh(t, ...e) {
    let n = [], i = new Set, r, o = s => {
        n.push(s)
    };
    return mu(e, s => {
        let a = s;
        vc(a, o, [], i) && (r ||= [], r.push(a))
    }), r !== void 0 && Jh(r, o), n
}

function Jh(t, e) {
    for (let n = 0; n < t.length; n++) {
        let {ngModule: i, providers: r} = t[n];
        yu(r, o => {
            e(o, i)
        })
    }
}

function vc(t, e, n, i) {
    if (t = it(t), !t) return !1;
    let r = null, o = Up(t), s = !o && Pn(t);
    if (!o && !s) {
        let l = t.ngModule;
        if (o = Up(l), o) r = l; else return !1
    } else {
        if (s && !s.standalone) return !1;
        r = t
    }
    let a = i.has(r);
    if (s) {
        if (a) return !1;
        if (i.add(r), s.dependencies) {
            let l = typeof s.dependencies == "function" ? s.dependencies() : s.dependencies;
            for (let c of l) vc(c, e, n, i)
        }
    } else if (o) {
        if (o.imports != null && !a) {
            i.add(r);
            let c;
            try {
                mu(o.imports, f => {
                    vc(f, e, n, i) && (c ||= [], c.push(f))
                })
            } finally {
            }
            c !== void 0 && Jh(c, e)
        }
        if (!a) {
            let c = Yi(r) || (() => new r);
            e({provide: r, useFactory: c, deps: ct}, r), e({provide: Hh, useValue: r, multi: !0}, r), e({
                provide: Xi,
                useValue: () => X(r),
                multi: !0
            }, r)
        }
        let l = o.providers;
        if (l != null && !a) {
            let c = t;
            yu(l, f => {
                e(f, c)
            })
        }
    } else return !1;
    return r !== t && t.providers !== void 0
}

function yu(t, e) {
    for (let n of t) Rh(n) && (n = n.\u0275providers), Array.isArray(n) ? yu(n, e) : e(n)
}

var Lb = De({provide: String, useValue: De});

function em(t) {
    return t !== null && typeof t == "object" && Lb in t
}

function Vb(t) {
    return !!(t && t.useExisting)
}

function jb(t) {
    return !!(t && t.useFactory)
}

function Ki(t) {
    return typeof t == "function"
}

function $b(t) {
    return !!t.useClass
}

var oa = new Z(""), As = {}, Bb = {}, Zl;

function wu() {
    return Zl === void 0 && (Zl = new js), Zl
}

var gt = class {
}, qr = class extends gt {
    get destroyed() {
        return this._destroyed
    }

    constructor(e, n, i, r) {
        super(), this.parent = n, this.source = i, this.scopes = r, this.records = new Map, this._ngOnDestroyHooks = new Set, this._onDestroyHooks = [], this._destroyed = !1, wc(e, s => this.processProvider(s)), this.records.set(Bh, Hi(void 0, this)), r.has("environment") && this.records.set(gt, Hi(void 0, this));
        let o = this.records.get(oa);
        o != null && typeof o.value == "string" && this.scopes.add(o.value), this.injectorDefTypes = new Set(this.get(Hh, ct, oe.Self))
    }

    destroy() {
        this.assertNotDestroyed(), this._destroyed = !0;
        let e = me(null);
        try {
            for (let i of this._ngOnDestroyHooks) i.ngOnDestroy();
            let n = this._onDestroyHooks;
            this._onDestroyHooks = [];
            for (let i of n) i()
        } finally {
            this.records.clear(), this._ngOnDestroyHooks.clear(), this.injectorDefTypes.clear(), me(e)
        }
    }

    onDestroy(e) {
        return this.assertNotDestroyed(), this._onDestroyHooks.push(e), () => this.removeOnDestroy(e)
    }

    runInContext(e) {
        this.assertNotDestroyed();
        let n = Nn(this), i = It(void 0), r;
        try {
            return e()
        } finally {
            Nn(n), It(i)
        }
    }

    get(e, n = zr, i = oe.Default) {
        if (this.assertNotDestroyed(), e.hasOwnProperty(Gp)) return e[Gp](this);
        i = na(i);
        let r, o = Nn(this), s = It(void 0);
        try {
            if (!(i & oe.SkipSelf)) {
                let l = this.records.get(e);
                if (l === void 0) {
                    let c = qb(e) && ta(e);
                    c && this.injectableDefInScope(c) ? l = Hi(yc(e), As) : l = null, this.records.set(e, l)
                }
                if (l != null) return this.hydrate(e, l)
            }
            let a = i & oe.Self ? wu() : this.parent;
            return n = i & oe.Optional && n === zr ? null : n, a.get(e, n)
        } catch (a) {
            if (a.name === "NullInjectorError") {
                if ((a[Ls] = a[Ls] || []).unshift(rt(e)), o) throw a;
                return mb(a, e, "R3InjectorError", this.source)
            } else throw a
        } finally {
            It(s), Nn(o)
        }
    }

    resolveInjectorInitializers() {
        let e = me(null), n = Nn(this), i = It(void 0), r;
        try {
            let o = this.get(Xi, ct, oe.Self);
            for (let s of o) s()
        } finally {
            Nn(n), It(i), me(e)
        }
    }

    toString() {
        let e = [], n = this.records;
        for (let i of n.keys()) e.push(rt(i));
        return `R3Injector[${e.join(", ")}]`
    }

    assertNotDestroyed() {
        if (this._destroyed) throw new _(205, !1)
    }

    processProvider(e) {
        e = it(e);
        let n = Ki(e) ? e : it(e && e.provide), i = Ub(e);
        if (!Ki(e) && e.multi === !0) {
            let r = this.records.get(n);
            r || (r = Hi(void 0, As, !0), r.factory = () => mc(r.multi), this.records.set(n, r)), n = e, r.multi.push(e)
        }
        this.records.set(n, i)
    }

    hydrate(e, n) {
        let i = me(null);
        try {
            return n.value === As && (n.value = Bb, n.value = n.factory()), typeof n.value == "object" && n.value && Gb(n.value) && this._ngOnDestroyHooks.add(n.value), n.value
        } finally {
            me(i)
        }
    }

    injectableDefInScope(e) {
        if (!e.providedIn) return !1;
        let n = it(e.providedIn);
        return typeof n == "string" ? n === "any" || this.scopes.has(n) : this.injectorDefTypes.has(n)
    }

    removeOnDestroy(e) {
        let n = this._onDestroyHooks.indexOf(e);
        n !== -1 && this._onDestroyHooks.splice(n, 1)
    }
};

function yc(t) {
    let e = ta(t), n = e !== null ? e.factory : Yi(t);
    if (n !== null) return n;
    if (t instanceof Z) throw new _(204, !1);
    if (t instanceof Function) return Hb(t);
    throw new _(204, !1)
}

function Hb(t) {
    if (t.length > 0) throw new _(204, !1);
    let n = eb(t);
    return n !== null ? () => n.factory(t) : () => new t
}

function Ub(t) {
    if (em(t)) return Hi(void 0, t.useValue);
    {
        let e = tm(t);
        return Hi(e, As)
    }
}

function tm(t, e, n) {
    let i;
    if (Ki(t)) {
        let r = it(t);
        return Yi(r) || yc(r)
    } else if (em(t)) i = () => it(t.useValue); else if (jb(t)) i = () => t.useFactory(...mc(t.deps || [])); else if (Vb(t)) i = () => X(it(t.useExisting)); else {
        let r = it(t && (t.useClass || t.provide));
        if (zb(t)) i = () => new r(...mc(t.deps)); else return Yi(r) || yc(r)
    }
    return i
}

function Hi(t, e, n = !1) {
    return {factory: t, value: e, multi: n ? [] : void 0}
}

function zb(t) {
    return !!t.deps
}

function Gb(t) {
    return t !== null && typeof t == "object" && typeof t.ngOnDestroy == "function"
}

function qb(t) {
    return typeof t == "function" || typeof t == "object" && t instanceof Z
}

function wc(t, e) {
    for (let n of t) Array.isArray(n) ? wc(n, e) : n && Rh(n) ? wc(n.\u0275providers, e) : e(n)
}

function dn(t, e) {
    t instanceof qr && t.assertNotDestroyed();
    let n, i = Nn(t), r = It(void 0);
    try {
        return e()
    } finally {
        Nn(i), It(r)
    }
}

function nm() {
    return Lh() !== void 0 || fb() != null
}

function Wb(t) {
    if (!nm()) throw new _(-203, !1)
}

function Yb(t) {
    return typeof t == "function"
}

var fn = 0, re = 1, K = 2, qe = 3, kt = 4, Lt = 5, $s = 6, Wr = 7, Ft = 8, Zi = 9, Rt = 10, Le = 11, Yr = 12, Kp = 13,
    rr = 14, Wt = 15, io = 16, Ui = 17, an = 18, sa = 19, im = 20, On = 21, Jl = 22, ri = 23, ln = 25, rm = 1;
var oi = 7, Bs = 8, Ji = 9, mt = 10, bu = function (t) {
    return t[t.None = 0] = "None", t[t.HasTransplantedViews = 2] = "HasTransplantedViews", t
}(bu || {});

function ni(t) {
    return Array.isArray(t) && typeof t[rm] == "object"
}

function pn(t) {
    return Array.isArray(t) && t[rm] === !0
}

function Eu(t) {
    return (t.flags & 4) !== 0
}

function aa(t) {
    return t.componentOffset > -1
}

function la(t) {
    return (t.flags & 1) === 1
}

function kn(t) {
    return !!t.template
}

function Qb(t) {
    return (t[K] & 512) !== 0
}

var bc = class {
    constructor(e, n, i) {
        this.previousValue = e, this.currentValue = n, this.firstChange = i
    }

    isFirstChange() {
        return this.firstChange
    }
};

function om(t, e, n, i) {
    e !== null ? e.applyValueToInputSignal(e, i) : t[n] = i
}

function hn() {
    return sm
}

function sm(t) {
    return t.type.prototype.ngOnChanges && (t.setInput = Kb), Xb
}

hn.ngInherit = !0;

function Xb() {
    let t = lm(this), e = t?.current;
    if (e) {
        let n = t.previous;
        if (n === Qi) t.previous = e; else for (let i in e) n[i] = e[i];
        t.current = null, this.ngOnChanges(e)
    }
}

function Kb(t, e, n, i, r) {
    let o = this.declaredInputs[i], s = lm(t) || Zb(t, {previous: Qi, current: null}),
        a = s.current || (s.current = {}), l = s.previous, c = l[o];
    a[o] = new bc(c && c.currentValue, n, l === Qi), om(t, e, r, n)
}

var am = "__ngSimpleChanges__";

function lm(t) {
    return t[am] || null
}

function Zb(t, e) {
    return t[am] = e
}

var Zp = null;
var zt = function (t, e, n) {
    Zp?.(t, e, n)
}, cm = "svg", Jb = "math", eE = !1;

function tE() {
    return eE
}

function Yt(t) {
    for (; Array.isArray(t);) t = t[fn];
    return t
}

function um(t, e) {
    return Yt(e[t])
}

function Mt(t, e) {
    return Yt(e[t.index])
}

function dm(t, e) {
    return t.data[e]
}

function Ln(t, e) {
    let n = e[t];
    return ni(n) ? n : n[fn]
}

function nE(t) {
    return (t[K] & 4) === 4
}

function Su(t) {
    return (t[K] & 128) === 128
}

function iE(t) {
    return pn(t[qe])
}

function er(t, e) {
    return e == null ? null : t[e]
}

function fm(t) {
    t[Ui] = 0
}

function rE(t) {
    t[K] & 1024 || (t[K] |= 1024, Su(t) && Qr(t))
}

function oE(t, e) {
    for (; t > 0;) e = e[rr], t--;
    return e
}

function Cu(t) {
    return !!(t[K] & 9216 || t[ri]?.dirty)
}

function Ec(t) {
    t[Rt].changeDetectionScheduler?.notify(1), Cu(t) ? Qr(t) : t[K] & 64 && (tE() ? (t[K] |= 1024, Qr(t)) : t[Rt].changeDetectionScheduler?.notify())
}

function Qr(t) {
    t[Rt].changeDetectionScheduler?.notify();
    let e = Xr(t);
    for (; e !== null && !(e[K] & 8192 || (e[K] |= 8192, !Su(e)));) e = Xr(e)
}

function pm(t, e) {
    if ((t[K] & 256) === 256) throw new _(911, !1);
    t[On] === null && (t[On] = []), t[On].push(e)
}

function sE(t, e) {
    if (t[On] === null) return;
    let n = t[On].indexOf(e);
    n !== -1 && t[On].splice(n, 1)
}

function Xr(t) {
    let e = t[qe];
    return pn(e) ? e[qe] : e
}

var ne = {lFrame: Sm(null), bindingsEnabled: !0, skipHydrationRootTNode: null};

function aE() {
    return ne.lFrame.elementDepthCount
}

function lE() {
    ne.lFrame.elementDepthCount++
}

function cE() {
    ne.lFrame.elementDepthCount--
}

function hm() {
    return ne.bindingsEnabled
}

function uE() {
    return ne.skipHydrationRootTNode !== null
}

function dE(t) {
    return ne.skipHydrationRootTNode === t
}

function fE() {
    ne.skipHydrationRootTNode = null
}

function ve() {
    return ne.lFrame.lView
}

function Xe() {
    return ne.lFrame.tView
}

function mn(t) {
    return ne.lFrame.contextLView = t, t[Ft]
}

function gn(t) {
    return ne.lFrame.contextLView = null, t
}

function ot() {
    let t = mm();
    for (; t !== null && t.type === 64;) t = t.parent;
    return t
}

function mm() {
    return ne.lFrame.currentTNode
}

function pE() {
    let t = ne.lFrame, e = t.currentTNode;
    return t.isParent ? e : e.parent
}

function hi(t, e) {
    let n = ne.lFrame;
    n.currentTNode = t, n.isParent = e
}

function Du() {
    return ne.lFrame.isParent
}

function gm() {
    ne.lFrame.isParent = !1
}

function vm() {
    let t = ne.lFrame, e = t.bindingRootIndex;
    return e === -1 && (e = t.bindingRootIndex = t.tView.bindingStartIndex), e
}

function hE(t) {
    return ne.lFrame.bindingIndex = t
}

function Iu() {
    return ne.lFrame.bindingIndex++
}

function ym(t) {
    let e = ne.lFrame, n = e.bindingIndex;
    return e.bindingIndex = e.bindingIndex + t, n
}

function mE() {
    return ne.lFrame.inI18n
}

function gE(t, e) {
    let n = ne.lFrame;
    n.bindingIndex = n.bindingRootIndex = t, Sc(e)
}

function vE() {
    return ne.lFrame.currentDirectiveIndex
}

function Sc(t) {
    ne.lFrame.currentDirectiveIndex = t
}

function yE(t) {
    let e = ne.lFrame.currentDirectiveIndex;
    return e === -1 ? null : t[e]
}

function wm() {
    return ne.lFrame.currentQueryIndex
}

function Mu(t) {
    ne.lFrame.currentQueryIndex = t
}

function wE(t) {
    let e = t[re];
    return e.type === 2 ? e.declTNode : e.type === 1 ? t[Lt] : null
}

function bm(t, e, n) {
    if (n & oe.SkipSelf) {
        let r = e, o = t;
        for (; r = r.parent, r === null && !(n & oe.Host);) if (r = wE(o), r === null || (o = o[rr], r.type & 10)) break;
        if (r === null) return !1;
        e = r, t = o
    }
    let i = ne.lFrame = Em();
    return i.currentTNode = e, i.lView = t, !0
}

function _u(t) {
    let e = Em(), n = t[re];
    ne.lFrame = e, e.currentTNode = n.firstChild, e.lView = t, e.tView = n, e.contextLView = t, e.bindingIndex = n.bindingStartIndex, e.inI18n = !1
}

function Em() {
    let t = ne.lFrame, e = t === null ? null : t.child;
    return e === null ? Sm(t) : e
}

function Sm(t) {
    let e = {
        currentTNode: null,
        isParent: !0,
        lView: null,
        tView: null,
        selectedIndex: -1,
        contextLView: null,
        elementDepthCount: 0,
        currentNamespace: null,
        currentDirectiveIndex: -1,
        bindingRootIndex: -1,
        bindingIndex: -1,
        currentQueryIndex: 0,
        parent: t,
        child: null,
        inI18n: !1
    };
    return t !== null && (t.child = e), e
}

function Cm() {
    let t = ne.lFrame;
    return ne.lFrame = t.parent, t.currentTNode = null, t.lView = null, t
}

var Dm = Cm;

function Tu() {
    let t = Cm();
    t.isParent = !0, t.tView = null, t.selectedIndex = -1, t.contextLView = null, t.elementDepthCount = 0, t.currentDirectiveIndex = -1, t.currentNamespace = null, t.bindingRootIndex = -1, t.bindingIndex = -1, t.currentQueryIndex = 0
}

function bE(t) {
    return (ne.lFrame.contextLView = oE(t, ne.lFrame.contextLView))[Ft]
}

function mi() {
    return ne.lFrame.selectedIndex
}

function si(t) {
    ne.lFrame.selectedIndex = t
}

function Im() {
    let t = ne.lFrame;
    return dm(t.tView, t.selectedIndex)
}

function Ke() {
    ne.lFrame.currentNamespace = cm
}

function Ze() {
    EE()
}

function EE() {
    ne.lFrame.currentNamespace = null
}

function SE() {
    return ne.lFrame.currentNamespace
}

var Mm = !0;

function ca() {
    return Mm
}

function ua(t) {
    Mm = t
}

function CE(t, e, n) {
    let {ngOnChanges: i, ngOnInit: r, ngDoCheck: o} = e.type.prototype;
    if (i) {
        let s = sm(e);
        (n.preOrderHooks ??= []).push(t, s), (n.preOrderCheckHooks ??= []).push(t, s)
    }
    r && (n.preOrderHooks ??= []).push(0 - t, r), o && ((n.preOrderHooks ??= []).push(t, o), (n.preOrderCheckHooks ??= []).push(t, o))
}

function da(t, e) {
    for (let n = e.directiveStart, i = e.directiveEnd; n < i; n++) {
        let o = t.data[n].type.prototype, {
            ngAfterContentInit: s,
            ngAfterContentChecked: a,
            ngAfterViewInit: l,
            ngAfterViewChecked: c,
            ngOnDestroy: f
        } = o;
        s && (t.contentHooks ??= []).push(-n, s), a && ((t.contentHooks ??= []).push(n, a), (t.contentCheckHooks ??= []).push(n, a)), l && (t.viewHooks ??= []).push(-n, l), c && ((t.viewHooks ??= []).push(n, c), (t.viewCheckHooks ??= []).push(n, c)), f != null && (t.destroyHooks ??= []).push(n, f)
    }
}

function Ns(t, e, n) {
    _m(t, e, 3, n)
}

function Os(t, e, n, i) {
    (t[K] & 3) === n && _m(t, e, n, i)
}

function ec(t, e) {
    let n = t[K];
    (n & 3) === e && (n &= 16383, n += 1, t[K] = n)
}

function _m(t, e, n, i) {
    let r = i !== void 0 ? t[Ui] & 65535 : 0, o = i ?? -1, s = e.length - 1, a = 0;
    for (let l = r; l < s; l++) if (typeof e[l + 1] == "number") {
        if (a = e[l], i != null && a >= i) break
    } else e[l] < 0 && (t[Ui] += 65536), (a < o || o == -1) && (DE(t, n, e, l), t[Ui] = (t[Ui] & 4294901760) + l + 2), l++
}

function Jp(t, e) {
    zt(4, t, e);
    let n = me(null);
    try {
        e.call(t)
    } finally {
        me(n), zt(5, t, e)
    }
}

function DE(t, e, n, i) {
    let r = n[i] < 0, o = n[i + 1], s = r ? -n[i] : n[i], a = t[s];
    r ? t[K] >> 14 < t[Ui] >> 16 && (t[K] & 3) === e && (t[K] += 16384, Jp(a, o)) : Jp(a, o)
}

var Wi = -1, ai = class {
    constructor(e, n, i) {
        this.factory = e, this.resolving = !1, this.canSeeViewProviders = n, this.injectImpl = i
    }
};

function IE(t) {
    return t instanceof ai
}

function ME(t) {
    return (t.flags & 8) !== 0
}

function _E(t) {
    return (t.flags & 16) !== 0
}

function Tm(t) {
    return t !== Wi
}

function Hs(t) {
    return t & 32767
}

function TE(t) {
    return t >> 16
}

function Us(t, e) {
    let n = TE(t), i = e;
    for (; n > 0;) i = i[rr], n--;
    return i
}

var Cc = !0;

function eh(t) {
    let e = Cc;
    return Cc = t, e
}

var xE = 256, xm = xE - 1, Am = 5, AE = 0, Gt = {};

function NE(t, e, n) {
    let i;
    typeof n == "string" ? i = n.charCodeAt(0) || 0 : n.hasOwnProperty(Ur) && (i = n[Ur]), i == null && (i = n[Ur] = AE++);
    let r = i & xm, o = 1 << r;
    e.data[t + (r >> Am)] |= o
}

function zs(t, e) {
    let n = Nm(t, e);
    if (n !== -1) return n;
    let i = e[re];
    i.firstCreatePass && (t.injectorIndex = e.length, tc(i.data, t), tc(e, null), tc(i.blueprint, null));
    let r = xu(t, e), o = t.injectorIndex;
    if (Tm(r)) {
        let s = Hs(r), a = Us(r, e), l = a[re].data;
        for (let c = 0; c < 8; c++) e[o + c] = a[s + c] | l[s + c]
    }
    return e[o + 8] = r, o
}

function tc(t, e) {
    t.push(0, 0, 0, 0, 0, 0, 0, 0, e)
}

function Nm(t, e) {
    return t.injectorIndex === -1 || t.parent && t.parent.injectorIndex === t.injectorIndex || e[t.injectorIndex + 8] === null ? -1 : t.injectorIndex
}

function xu(t, e) {
    if (t.parent && t.parent.injectorIndex !== -1) return t.parent.injectorIndex;
    let n = 0, i = null, r = e;
    for (; r !== null;) {
        if (i = Rm(r), i === null) return Wi;
        if (n++, r = r[rr], i.injectorIndex !== -1) return i.injectorIndex | n << 16
    }
    return Wi
}

function Dc(t, e, n) {
    NE(t, e, n)
}

function OE(t, e) {
    if (e === "class") return t.classes;
    if (e === "style") return t.styles;
    let n = t.attrs;
    if (n) {
        let i = n.length, r = 0;
        for (; r < i;) {
            let o = n[r];
            if (zh(o)) break;
            if (o === 0) r = r + 2; else if (typeof o == "number") for (r++; r < i && typeof n[r] == "string";) r++; else {
                if (o === e) return n[r + 1];
                r = r + 2
            }
        }
    }
    return null
}

function Om(t, e, n) {
    if (n & oe.Optional || t !== void 0) return t;
    hu(e, "NodeInjector")
}

function Pm(t, e, n, i) {
    if (n & oe.Optional && i === void 0 && (i = null), !(n & (oe.Self | oe.Host))) {
        let r = t[Zi], o = It(void 0);
        try {
            return r ? r.get(e, i, n & oe.Optional) : Vh(e, i, n & oe.Optional)
        } finally {
            It(o)
        }
    }
    return Om(i, e, n)
}

function km(t, e, n, i = oe.Default, r) {
    if (t !== null) {
        if (e[K] & 2048 && !(i & oe.Self)) {
            let s = RE(t, e, n, i, Gt);
            if (s !== Gt) return s
        }
        let o = Fm(t, e, n, i, Gt);
        if (o !== Gt) return o
    }
    return Pm(e, n, i, r)
}

function Fm(t, e, n, i, r) {
    let o = kE(n);
    if (typeof o == "function") {
        if (!bm(e, t, i)) return i & oe.Host ? Om(r, n, i) : Pm(e, n, i, r);
        try {
            let s;
            if (s = o(i), s == null && !(i & oe.Optional)) hu(n); else return s
        } finally {
            Dm()
        }
    } else if (typeof o == "number") {
        let s = null, a = Nm(t, e), l = Wi, c = i & oe.Host ? e[Wt][Lt] : null;
        for ((a === -1 || i & oe.SkipSelf) && (l = a === -1 ? xu(t, e) : e[a + 8], l === Wi || !nh(i, !1) ? a = -1 : (s = e[re], a = Hs(l), e = Us(l, e))); a !== -1;) {
            let f = e[re];
            if (th(o, a, f.data)) {
                let p = PE(a, e, n, s, i, c);
                if (p !== Gt) return p
            }
            l = e[a + 8], l !== Wi && nh(i, e[re].data[a + 8] === c) && th(o, a, e) ? (s = f, a = Hs(l), e = Us(l, e)) : a = -1
        }
    }
    return r
}

function PE(t, e, n, i, r, o) {
    let s = e[re], a = s.data[t + 8], l = i == null ? aa(a) && Cc : i != s && (a.type & 3) !== 0,
        c = r & oe.Host && o === a, f = Ps(a, s, n, l, c);
    return f !== null ? li(e, s, f, a) : Gt
}

function Ps(t, e, n, i, r) {
    let o = t.providerIndexes, s = e.data, a = o & 1048575, l = t.directiveStart, c = t.directiveEnd, f = o >> 20,
        p = i ? a : a + f, m = r ? a + f : c;
    for (let g = p; g < m; g++) {
        let b = s[g];
        if (g < l && n === b || g >= l && b.type === n) return g
    }
    if (r) {
        let g = s[l];
        if (g && kn(g) && g.type === n) return l
    }
    return null
}

function li(t, e, n, i) {
    let r = t[n], o = e.data;
    if (IE(r)) {
        let s = r;
        s.resolving && ab(sb(o[n]));
        let a = eh(s.canSeeViewProviders);
        s.resolving = !0;
        let l, c = s.injectImpl ? It(s.injectImpl) : null, f = bm(t, i, oe.Default);
        try {
            r = t[n] = s.factory(void 0, o, t, i), e.firstCreatePass && n >= i.directiveStart && CE(n, o[n], e)
        } finally {
            c !== null && It(c), eh(a), s.resolving = !1, Dm()
        }
    }
    return r
}

function kE(t) {
    if (typeof t == "string") return t.charCodeAt(0) || 0;
    let e = t.hasOwnProperty(Ur) ? t[Ur] : void 0;
    return typeof e == "number" ? e >= 0 ? e & xm : FE : e
}

function th(t, e, n) {
    let i = 1 << t;
    return !!(n[e + (t >> Am)] & i)
}

function nh(t, e) {
    return !(t & oe.Self) && !(t & oe.Host && e)
}

var ii = class {
    constructor(e, n) {
        this._tNode = e, this._lView = n
    }

    get(e, n, i) {
        return km(this._tNode, this._lView, e, na(i), n)
    }
};

function FE() {
    return new ii(ot(), ve())
}

function or(t) {
    return Jr(() => {
        let e = t.prototype.constructor, n = e[Rs] || Ic(e), i = Object.prototype,
            r = Object.getPrototypeOf(t.prototype).constructor;
        for (; r && r !== i;) {
            let o = r[Rs] || Ic(r);
            if (o && o !== n) return o;
            r = Object.getPrototypeOf(r)
        }
        return o => new o
    })
}

function Ic(t) {
    return Oh(t) ? () => {
        let e = Ic(it(t));
        return e && e()
    } : Yi(t)
}

function RE(t, e, n, i, r) {
    let o = t, s = e;
    for (; o !== null && s !== null && s[K] & 2048 && !(s[K] & 512);) {
        let a = Fm(o, s, n, i | oe.Self, Gt);
        if (a !== Gt) return a;
        let l = o.parent;
        if (!l) {
            let c = s[im];
            if (c) {
                let f = c.get(n, Gt, i);
                if (f !== Gt) return f
            }
            l = Rm(s), s = s[rr]
        }
        o = l
    }
    return r
}

function Rm(t) {
    let e = t[re], n = e.type;
    return n === 2 ? e.declTNode : n === 1 ? t[Lt] : null
}

function Au(t) {
    return OE(ot(), t)
}

function ih(t, e = null, n = null, i) {
    let r = Lm(t, e, n, i);
    return r.resolveInjectorInitializers(), r
}

function Lm(t, e = null, n = null, i, r = new Set) {
    let o = [n || ct, Rb(t)];
    return i = i || (typeof t == "object" ? void 0 : rt(t)), new qr(o, e || wu(), i || null, r)
}

var vn = (() => {
    let e = class e {
        static create(i, r) {
            if (Array.isArray(i)) return ih({name: ""}, r, i, "");
            {
                let o = i.name ?? "";
                return ih({name: o}, i.parent, i.providers, o)
            }
        }
    };
    e.THROW_IF_NOT_FOUND = zr, e.NULL = new js, e.\u0275prov = B({
        token: e,
        providedIn: "any",
        factory: () => X(Bh)
    }), e.__NG_ELEMENT_ID__ = -1;
    let t = e;
    return t
})();
var LE = "ngOriginalError";

function nc(t) {
    return t[LE]
}

var Qt = class {
    constructor() {
        this._console = console
    }

    handleError(e) {
        let n = this._findOriginalError(e);
        this._console.error("ERROR", e), n && this._console.error("ORIGINAL ERROR", n)
    }

    _findOriginalError(e) {
        let n = e && nc(e);
        for (; n && nc(n);) n = nc(n);
        return n || null
    }
}, Vm = new Z("", {providedIn: "root", factory: () => N(Qt).handleError.bind(void 0)}), Nu = (() => {
    let e = class e {
    };
    e.__NG_ELEMENT_ID__ = VE, e.__NG_ENV_ID__ = i => i;
    let t = e;
    return t
})(), Mc = class extends Nu {
    constructor(e) {
        super(), this._lView = e
    }

    onDestroy(e) {
        return pm(this._lView, e), () => sE(this._lView, e)
    }
};

function VE() {
    return new Mc(ve())
}

function jE() {
    return sr(ot(), ve())
}

function sr(t, e) {
    return new ut(Mt(t, e))
}

var ut = (() => {
    let e = class e {
        constructor(i) {
            this.nativeElement = i
        }
    };
    e.__NG_ELEMENT_ID__ = jE;
    let t = e;
    return t
})();

function $E(t) {
    return t instanceof ut ? t.nativeElement : t
}

var _c = class extends Qe {
    constructor(e = !1) {
        super(), this.destroyRef = void 0, this.__isAsync = e, nm() && (this.destroyRef = N(Nu, {optional: !0}) ?? void 0)
    }

    emit(e) {
        let n = me(null);
        try {
            super.next(e)
        } finally {
            me(n)
        }
    }

    subscribe(e, n, i) {
        let r = e, o = n || (() => null), s = i;
        if (e && typeof e == "object") {
            let l = e;
            r = l.next?.bind(l), o = l.error?.bind(l), s = l.complete?.bind(l)
        }
        this.__isAsync && (o = ic(o), r && (r = ic(r)), s && (s = ic(s)));
        let a = super.subscribe({next: r, error: o, complete: s});
        return e instanceof Re && e.add(a), a
    }
};

function ic(t) {
    return e => {
        setTimeout(t, void 0, e)
    }
}

var ke = _c;

function BE() {
    return this._results[Symbol.iterator]()
}

var Tc = class t {
    get changes() {
        return this._changes ??= new ke
    }

    constructor(e = !1) {
        this._emitDistinctChangesOnly = e, this.dirty = !0, this._onDirty = void 0, this._results = [], this._changesDetected = !1, this._changes = void 0, this.length = 0, this.first = void 0, this.last = void 0;
        let n = t.prototype;
        n[Symbol.iterator] || (n[Symbol.iterator] = BE)
    }

    get(e) {
        return this._results[e]
    }

    map(e) {
        return this._results.map(e)
    }

    filter(e) {
        return this._results.filter(e)
    }

    find(e) {
        return this._results.find(e)
    }

    reduce(e, n) {
        return this._results.reduce(e, n)
    }

    forEach(e) {
        this._results.forEach(e)
    }

    some(e) {
        return this._results.some(e)
    }

    toArray() {
        return this._results.slice()
    }

    toString() {
        return this._results.toString()
    }

    reset(e, n) {
        this.dirty = !1;
        let i = yb(e);
        (this._changesDetected = !vb(this._results, i, n)) && (this._results = i, this.length = i.length, this.last = i[this.length - 1], this.first = i[0])
    }

    notifyOnChanges() {
        this._changes !== void 0 && (this._changesDetected || !this._emitDistinctChangesOnly) && this._changes.emit(this)
    }

    onDirty(e) {
        this._onDirty = e
    }

    setDirty() {
        this.dirty = !0, this._onDirty?.()
    }

    destroy() {
        this._changes !== void 0 && (this._changes.complete(), this._changes.unsubscribe())
    }
};

function jm(t) {
    return (t.flags & 128) === 128
}

var $m = new Map, HE = 0;

function UE() {
    return HE++
}

function zE(t) {
    $m.set(t[sa], t)
}

function GE(t) {
    $m.delete(t[sa])
}

var rh = "__ngContext__";

function Fn(t, e) {
    ni(e) ? (t[rh] = e[sa], zE(e)) : t[rh] = e
}

function Bm(t) {
    return Um(t[Yr])
}

function Hm(t) {
    return Um(t[kt])
}

function Um(t) {
    for (; t !== null && !pn(t);) t = t[kt];
    return t
}

var xc;

function zm(t) {
    xc = t
}

function Gm() {
    if (xc !== void 0) return xc;
    if (typeof document < "u") return document;
    throw new _(210, !1)
}

var Ou = new Z("", {providedIn: "root", factory: () => qE}), qE = "ng", Pu = new Z(""),
    Vn = new Z("", {providedIn: "platform", factory: () => "unknown"});
var ku = new Z(""), Fu = new Z("", {
    providedIn: "root",
    factory: () => Gm().body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") || null
});
var WE = "h", YE = "b";
var QE = () => null;

function Ru(t, e, n = !1) {
    return QE(t, e, n)
}

var qm = !1, XE = new Z("", {providedIn: "root", factory: () => qm});
var Is;

function Wm() {
    if (Is === void 0 && (Is = null, sn.trustedTypes)) try {
        Is = sn.trustedTypes.createPolicy("angular", {
            createHTML: t => t,
            createScript: t => t,
            createScriptURL: t => t
        })
    } catch {
    }
    return Is
}

function fa(t) {
    return Wm()?.createHTML(t) || t
}

function KE(t) {
    return Wm()?.createScriptURL(t) || t
}

var Ms;

function Ym() {
    if (Ms === void 0 && (Ms = null, sn.trustedTypes)) try {
        Ms = sn.trustedTypes.createPolicy("angular#unsafe-bypass", {
            createHTML: t => t,
            createScript: t => t,
            createScriptURL: t => t
        })
    } catch {
    }
    return Ms
}

function oh(t) {
    return Ym()?.createHTML(t) || t
}

function sh(t) {
    return Ym()?.createScriptURL(t) || t
}

var Gs = class {
    constructor(e) {
        this.changingThisBreaksApplicationSecurity = e
    }

    toString() {
        return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${Ah})`
    }
};

function gi(t) {
    return t instanceof Gs ? t.changingThisBreaksApplicationSecurity : t
}

function pa(t, e) {
    let n = ZE(t);
    if (n != null && n !== e) {
        if (n === "ResourceURL" && e === "URL") return !0;
        throw new Error(`Required a safe ${e}, got a ${n} (see ${Ah})`)
    }
    return n === e
}

function ZE(t) {
    return t instanceof Gs && t.getTypeName() || null
}

function JE(t) {
    let e = new Nc(t);
    return e1() ? new Ac(e) : e
}

var Ac = class {
    constructor(e) {
        this.inertDocumentHelper = e
    }

    getInertBodyElement(e) {
        e = "<body><remove></remove>" + e;
        try {
            let n = new window.DOMParser().parseFromString(fa(e), "text/html").body;
            return n === null ? this.inertDocumentHelper.getInertBodyElement(e) : (n.removeChild(n.firstChild), n)
        } catch {
            return null
        }
    }
}, Nc = class {
    constructor(e) {
        this.defaultDoc = e, this.inertDocument = this.defaultDoc.implementation.createHTMLDocument("sanitization-inert")
    }

    getInertBodyElement(e) {
        let n = this.inertDocument.createElement("template");
        return n.innerHTML = fa(e), n
    }
};

function e1() {
    try {
        return !!new window.DOMParser().parseFromString(fa(""), "text/html")
    } catch {
        return !1
    }
}

var t1 = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;

function Lu(t) {
    return t = String(t), t.match(t1) ? t : "unsafe:" + t
}

function yn(t) {
    let e = {};
    for (let n of t.split(",")) e[n] = !0;
    return e
}

function ro(...t) {
    let e = {};
    for (let n of t) for (let i in n) n.hasOwnProperty(i) && (e[i] = !0);
    return e
}

var Qm = yn("area,br,col,hr,img,wbr"), Xm = yn("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"), Km = yn("rp,rt"),
    n1 = ro(Km, Xm),
    i1 = ro(Xm, yn("address,article,aside,blockquote,caption,center,del,details,dialog,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,main,map,menu,nav,ol,pre,section,summary,table,ul")),
    r1 = ro(Km, yn("a,abbr,acronym,audio,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,picture,q,ruby,rp,rt,s,samp,small,source,span,strike,strong,sub,sup,time,track,tt,u,var,video")),
    ah = ro(Qm, i1, r1, n1), Zm = yn("background,cite,href,itemtype,longdesc,poster,src,xlink:href"),
    o1 = yn("abbr,accesskey,align,alt,autoplay,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,controls,coords,datetime,default,dir,download,face,headers,height,hidden,hreflang,hspace,ismap,itemscope,itemprop,kind,label,lang,language,loop,media,muted,nohref,nowrap,open,preload,rel,rev,role,rows,rowspan,rules,scope,scrolling,shape,size,sizes,span,srclang,srcset,start,summary,tabindex,target,title,translate,type,usemap,valign,value,vspace,width"),
    s1 = yn("aria-activedescendant,aria-atomic,aria-autocomplete,aria-busy,aria-checked,aria-colcount,aria-colindex,aria-colspan,aria-controls,aria-current,aria-describedby,aria-details,aria-disabled,aria-dropeffect,aria-errormessage,aria-expanded,aria-flowto,aria-grabbed,aria-haspopup,aria-hidden,aria-invalid,aria-keyshortcuts,aria-label,aria-labelledby,aria-level,aria-live,aria-modal,aria-multiline,aria-multiselectable,aria-orientation,aria-owns,aria-placeholder,aria-posinset,aria-pressed,aria-readonly,aria-relevant,aria-required,aria-roledescription,aria-rowcount,aria-rowindex,aria-rowspan,aria-selected,aria-setsize,aria-sort,aria-valuemax,aria-valuemin,aria-valuenow,aria-valuetext"),
    a1 = ro(Zm, o1, s1), l1 = yn("script,style,template"), Oc = class {
        constructor() {
            this.sanitizedSomething = !1, this.buf = []
        }

        sanitizeChildren(e) {
            let n = e.firstChild, i = !0, r = [];
            for (; n;) {
                if (n.nodeType === Node.ELEMENT_NODE ? i = this.startElement(n) : n.nodeType === Node.TEXT_NODE ? this.chars(n.nodeValue) : this.sanitizedSomething = !0, i && n.firstChild) {
                    r.push(n), n = d1(n);
                    continue
                }
                for (; n;) {
                    n.nodeType === Node.ELEMENT_NODE && this.endElement(n);
                    let o = u1(n);
                    if (o) {
                        n = o;
                        break
                    }
                    n = r.pop()
                }
            }
            return this.buf.join("")
        }

        startElement(e) {
            let n = lh(e).toLowerCase();
            if (!ah.hasOwnProperty(n)) return this.sanitizedSomething = !0, !l1.hasOwnProperty(n);
            this.buf.push("<"), this.buf.push(n);
            let i = e.attributes;
            for (let r = 0; r < i.length; r++) {
                let o = i.item(r), s = o.name, a = s.toLowerCase();
                if (!a1.hasOwnProperty(a)) {
                    this.sanitizedSomething = !0;
                    continue
                }
                let l = o.value;
                Zm[a] && (l = Lu(l)), this.buf.push(" ", s, '="', ch(l), '"')
            }
            return this.buf.push(">"), !0
        }

        endElement(e) {
            let n = lh(e).toLowerCase();
            ah.hasOwnProperty(n) && !Qm.hasOwnProperty(n) && (this.buf.push("</"), this.buf.push(n), this.buf.push(">"))
        }

        chars(e) {
            this.buf.push(ch(e))
        }
    };

function c1(t, e) {
    return (t.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_CONTAINED_BY) !== Node.DOCUMENT_POSITION_CONTAINED_BY
}

function u1(t) {
    let e = t.nextSibling;
    if (e && t !== e.previousSibling) throw Jm(e);
    return e
}

function d1(t) {
    let e = t.firstChild;
    if (e && c1(t, e)) throw Jm(e);
    return e
}

function lh(t) {
    let e = t.nodeName;
    return typeof e == "string" ? e : "FORM"
}

function Jm(t) {
    return new Error(`Failed to sanitize html because the element is clobbered: ${t.outerHTML}`)
}

var f1 = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g, p1 = /([^\#-~ |!])/g;

function ch(t) {
    return t.replace(/&/g, "&amp;").replace(f1, function (e) {
        let n = e.charCodeAt(0), i = e.charCodeAt(1);
        return "&#" + ((n - 55296) * 1024 + (i - 56320) + 65536) + ";"
    }).replace(p1, function (e) {
        return "&#" + e.charCodeAt(0) + ";"
    }).replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

var _s;

function eg(t, e) {
    let n = null;
    try {
        _s = _s || JE(t);
        let i = e ? String(e) : "";
        n = _s.getInertBodyElement(i);
        let r = 5, o = i;
        do {
            if (r === 0) throw new Error("Failed to sanitize html because the input is unstable");
            r--, i = o, o = n.innerHTML, n = _s.getInertBodyElement(i)
        } while (i !== o);
        let a = new Oc().sanitizeChildren(uh(n) || n);
        return fa(a)
    } finally {
        if (n) {
            let i = uh(n) || n;
            for (; i.firstChild;) i.removeChild(i.firstChild)
        }
    }
}

function uh(t) {
    return "content" in t && h1(t) ? t.content : null
}

function h1(t) {
    return t.nodeType === Node.ELEMENT_NODE && t.nodeName === "TEMPLATE"
}

var oo = function (t) {
    return t[t.NONE = 0] = "NONE", t[t.HTML = 1] = "HTML", t[t.STYLE = 2] = "STYLE", t[t.SCRIPT = 3] = "SCRIPT", t[t.URL = 4] = "URL", t[t.RESOURCE_URL = 5] = "RESOURCE_URL", t
}(oo || {});

function tg(t) {
    let e = Vu();
    return e ? oh(e.sanitize(oo.HTML, t) || "") : pa(t, "HTML") ? oh(gi(t)) : eg(Gm(), eo(t))
}

function pe(t) {
    let e = Vu();
    return e ? e.sanitize(oo.URL, t) || "" : pa(t, "URL") ? gi(t) : Lu(eo(t))
}

function m1(t) {
    let e = Vu();
    if (e) return sh(e.sanitize(oo.RESOURCE_URL, t) || "");
    if (pa(t, "ResourceURL")) return sh(gi(t));
    throw new _(904, !1)
}

function ng(t) {
    return KE(t[0])
}

function g1(t, e) {
    return e === "src" && (t === "embed" || t === "frame" || t === "iframe" || t === "media" || t === "script") || e === "href" && (t === "base" || t === "link") ? m1 : pe
}

function ig(t, e, n) {
    return g1(e, n)(t)
}

function Vu() {
    let t = ve();
    return t && t[Rt].sanitizer
}

var v1 = /^>|^->|<!--|-->|--!>|<!-$/g, y1 = /(<|>)/g, w1 = "\u200B$1\u200B";

function b1(t) {
    return t.replace(v1, e => e.replace(y1, w1))
}

function ar(t) {
    return t.ownerDocument.defaultView
}

function rg(t) {
    return t instanceof Function ? t() : t
}

function E1(t) {
    return (t ?? N(vn)).get(Vn) === "browser"
}

var Xt = function (t) {
    return t[t.Important = 1] = "Important", t[t.DashCase = 2] = "DashCase", t
}(Xt || {}), S1;

function ju(t, e) {
    return S1(t, e)
}

function zi(t, e, n, i, r) {
    if (i != null) {
        let o, s = !1;
        pn(i) ? o = i : ni(i) && (s = !0, i = i[fn]);
        let a = Yt(i);
        t === 0 && n !== null ? r == null ? cg(e, n, a) : qs(e, n, a, r || null, !0) : t === 1 && n !== null ? qs(e, n, a, r || null, !0) : t === 2 ? $1(e, a, s) : t === 3 && e.destroyNode(a), o != null && H1(e, t, o, n, r)
    }
}

function C1(t, e) {
    return t.createText(e)
}

function D1(t, e, n) {
    t.setValue(e, n)
}

function I1(t, e) {
    return t.createComment(b1(e))
}

function og(t, e, n) {
    return t.createElement(e, n)
}

function M1(t, e) {
    sg(t, e), e[fn] = null, e[Lt] = null
}

function _1(t, e, n, i, r, o) {
    i[fn] = r, i[Lt] = e, ma(t, i, n, 1, r, o)
}

function sg(t, e) {
    e[Rt].changeDetectionScheduler?.notify(1), ma(t, e, e[Le], 2, null, null)
}

function T1(t) {
    let e = t[Yr];
    if (!e) return rc(t[re], t);
    for (; e;) {
        let n = null;
        if (ni(e)) n = e[Yr]; else {
            let i = e[mt];
            i && (n = i)
        }
        if (!n) {
            for (; e && !e[kt] && e !== t;) ni(e) && rc(e[re], e), e = e[qe];
            e === null && (e = t), ni(e) && rc(e[re], e), n = e && e[kt]
        }
        e = n
    }
}

function x1(t, e, n, i) {
    let r = mt + i, o = n.length;
    i > 0 && (n[r - 1][kt] = e), i < o - mt ? (e[kt] = n[r], $h(n, mt + i, e)) : (n.push(e), e[kt] = null), e[qe] = n;
    let s = e[io];
    s !== null && n !== s && A1(s, e);
    let a = e[an];
    a !== null && a.insertView(t), Ec(e), e[K] |= 128
}

function A1(t, e) {
    let n = t[Ji], r = e[qe][qe][Wt];
    e[Wt] !== r && (t[K] |= bu.HasTransplantedViews), n === null ? t[Ji] = [e] : n.push(e)
}

function ag(t, e) {
    let n = t[Ji], i = n.indexOf(e);
    n.splice(i, 1)
}

function Pc(t, e) {
    if (t.length <= mt) return;
    let n = mt + e, i = t[n];
    if (i) {
        let r = i[io];
        r !== null && r !== t && ag(r, i), e > 0 && (t[n - 1][kt] = i[kt]);
        let o = Vs(t, mt + e);
        M1(i[re], i);
        let s = o[an];
        s !== null && s.detachView(o[re]), i[qe] = null, i[kt] = null, i[K] &= -129
    }
    return i
}

function lg(t, e) {
    if (!(e[K] & 256)) {
        let n = e[Le];
        n.destroyNode && ma(t, e, n, 3, null, null), T1(e)
    }
}

function rc(t, e) {
    if (e[K] & 256) return;
    let n = me(null);
    try {
        e[K] &= -129, e[K] |= 256, e[ri] && gp(e[ri]), O1(t, e), N1(t, e), e[re].type === 1 && e[Le].destroy();
        let i = e[io];
        if (i !== null && pn(e[qe])) {
            i !== e[qe] && ag(i, e);
            let r = e[an];
            r !== null && r.detachView(t)
        }
        GE(e)
    } finally {
        me(n)
    }
}

function N1(t, e) {
    let n = t.cleanup, i = e[Wr];
    if (n !== null) for (let o = 0; o < n.length - 1; o += 2) if (typeof n[o] == "string") {
        let s = n[o + 3];
        s >= 0 ? i[s]() : i[-s].unsubscribe(), o += 2
    } else {
        let s = i[n[o + 1]];
        n[o].call(s)
    }
    i !== null && (e[Wr] = null);
    let r = e[On];
    if (r !== null) {
        e[On] = null;
        for (let o = 0; o < r.length; o++) {
            let s = r[o];
            s()
        }
    }
}

function O1(t, e) {
    let n;
    if (t != null && (n = t.destroyHooks) != null) for (let i = 0; i < n.length; i += 2) {
        let r = e[n[i]];
        if (!(r instanceof ai)) {
            let o = n[i + 1];
            if (Array.isArray(o)) for (let s = 0; s < o.length; s += 2) {
                let a = r[o[s]], l = o[s + 1];
                zt(4, a, l);
                try {
                    l.call(a)
                } finally {
                    zt(5, a, l)
                }
            } else {
                zt(4, r, o);
                try {
                    o.call(r)
                } finally {
                    zt(5, r, o)
                }
            }
        }
    }
}

function P1(t, e, n) {
    return k1(t, e.parent, n)
}

function k1(t, e, n) {
    let i = e;
    for (; i !== null && i.type & 40;) e = i, i = e.parent;
    if (i === null) return n[fn];
    {
        let {componentOffset: r} = i;
        if (r > -1) {
            let {encapsulation: o} = t.data[i.directiveStart + r];
            if (o === qt.None || o === qt.Emulated) return null
        }
        return Mt(i, n)
    }
}

function qs(t, e, n, i, r) {
    t.insertBefore(e, n, i, r)
}

function cg(t, e, n) {
    t.appendChild(e, n)
}

function dh(t, e, n, i, r) {
    i !== null ? qs(t, e, n, i, r) : cg(t, e, n)
}

function F1(t, e, n, i) {
    t.removeChild(e, n, i)
}

function $u(t, e) {
    return t.parentNode(e)
}

function R1(t, e) {
    return t.nextSibling(e)
}

function L1(t, e, n) {
    return j1(t, e, n)
}

function V1(t, e, n) {
    return t.type & 40 ? Mt(t, n) : null
}

var j1 = V1, fh;

function ha(t, e, n, i) {
    let r = P1(t, i, e), o = e[Le], s = i.parent || e[Lt], a = L1(s, i, e);
    if (r != null) if (Array.isArray(n)) for (let l = 0; l < n.length; l++) dh(o, r, n[l], a, !1); else dh(o, r, n, a, !1);
    fh !== void 0 && fh(o, i, e, n, r)
}

function ks(t, e) {
    if (e !== null) {
        let n = e.type;
        if (n & 3) return Mt(e, t);
        if (n & 4) return kc(-1, t[e.index]);
        if (n & 8) {
            let i = e.child;
            if (i !== null) return ks(t, i);
            {
                let r = t[e.index];
                return pn(r) ? kc(-1, r) : Yt(r)
            }
        } else {
            if (n & 32) return ju(e, t)() || Yt(t[e.index]);
            {
                let i = ug(t, e);
                if (i !== null) {
                    if (Array.isArray(i)) return i[0];
                    let r = Xr(t[Wt]);
                    return ks(r, i)
                } else return ks(t, e.next)
            }
        }
    }
    return null
}

function ug(t, e) {
    if (e !== null) {
        let i = t[Wt][Lt], r = e.projection;
        return i.projection[r]
    }
    return null
}

function kc(t, e) {
    let n = mt + t + 1;
    if (n < e.length) {
        let i = e[n], r = i[re].firstChild;
        if (r !== null) return ks(i, r)
    }
    return e[oi]
}

function $1(t, e, n) {
    let i = $u(t, e);
    i && F1(t, i, e, n)
}

function Bu(t, e, n, i, r, o, s) {
    for (; n != null;) {
        let a = i[n.index], l = n.type;
        if (s && e === 0 && (a && Fn(Yt(a), i), n.flags |= 2), (n.flags & 32) !== 32) if (l & 8) Bu(t, e, n.child, i, r, o, !1), zi(e, t, r, a, o); else if (l & 32) {
            let c = ju(n, i), f;
            for (; f = c();) zi(e, t, r, f, o);
            zi(e, t, r, a, o)
        } else l & 16 ? B1(t, e, i, n, r, o) : zi(e, t, r, a, o);
        n = s ? n.projectionNext : n.next
    }
}

function ma(t, e, n, i, r, o) {
    Bu(n, i, t.firstChild, e, r, o, !1)
}

function B1(t, e, n, i, r, o) {
    let s = n[Wt], l = s[Lt].projection[i.projection];
    if (Array.isArray(l)) for (let c = 0; c < l.length; c++) {
        let f = l[c];
        zi(e, t, r, f, o)
    } else {
        let c = l, f = s[qe];
        jm(i) && (c.flags |= 128), Bu(t, e, c, f, r, o, !0)
    }
}

function H1(t, e, n, i, r) {
    let o = n[oi], s = Yt(n);
    o !== s && zi(e, t, i, o, r);
    for (let a = mt; a < n.length; a++) {
        let l = n[a];
        ma(l[re], l, t, e, i, o)
    }
}

function U1(t, e, n, i, r) {
    if (e) r ? t.addClass(n, i) : t.removeClass(n, i); else {
        let o = i.indexOf("-") === -1 ? void 0 : Xt.DashCase;
        r == null ? t.removeStyle(n, i, o) : (typeof r == "string" && r.endsWith("!important") && (r = r.slice(0, -10), o |= Xt.Important), t.setStyle(n, i, r, o))
    }
}

function z1(t, e, n) {
    t.setAttribute(e, "style", n)
}

function dg(t, e, n) {
    n === "" ? t.removeAttribute(e, "class") : t.setAttribute(e, "class", n)
}

function fg(t, e, n) {
    let {mergedAttrs: i, classes: r, styles: o} = n;
    i !== null && gc(t, e, i), r !== null && dg(t, e, r), o !== null && z1(t, e, o)
}

var Kt = {};

function y(t = 1) {
    pg(Xe(), ve(), mi() + t, !1)
}

function pg(t, e, n, i) {
    if (!i) if ((e[K] & 3) === 3) {
        let o = t.preOrderCheckHooks;
        o !== null && Ns(e, o, n)
    } else {
        let o = t.preOrderHooks;
        o !== null && Os(e, o, 0, n)
    }
    si(n)
}

function P(t, e = oe.Default) {
    let n = ve();
    if (n === null) return X(t, e);
    let i = ot();
    return km(i, n, it(t), e)
}

function hg() {
    let t = "invalid";
    throw new Error(t)
}

function mg(t, e, n, i, r, o) {
    let s = me(null);
    try {
        let a = null;
        r & Ge.SignalBased && (a = e[i][fp]), a !== null && a.transformFn !== void 0 && (o = a.transformFn(o)), r & Ge.HasDecoratorInputTransform && (o = t.inputTransforms[i].call(e, o)), t.setInput !== null ? t.setInput(e, a, o, n, i) : om(e, a, i, o)
    } finally {
        me(s)
    }
}

function G1(t, e) {
    let n = t.hostBindingOpCodes;
    if (n !== null) try {
        for (let i = 0; i < n.length; i++) {
            let r = n[i];
            if (r < 0) si(~r); else {
                let o = r, s = n[++i], a = n[++i];
                gE(s, o);
                let l = e[o];
                a(2, l)
            }
        }
    } finally {
        si(-1)
    }
}

function ga(t, e, n, i, r, o, s, a, l, c, f) {
    let p = e.blueprint.slice();
    return p[fn] = r, p[K] = i | 4 | 128 | 8 | 64, (c !== null || t && t[K] & 2048) && (p[K] |= 2048), fm(p), p[qe] = p[rr] = t, p[Ft] = n, p[Rt] = s || t && t[Rt], p[Le] = a || t && t[Le], p[Zi] = l || t && t[Zi] || null, p[Lt] = o, p[sa] = UE(), p[$s] = f, p[im] = c, p[Wt] = e.type == 2 ? t[Wt] : p, p
}

function so(t, e, n, i, r) {
    let o = t.data[e];
    if (o === null) o = q1(t, e, n, i, r), mE() && (o.flags |= 32); else if (o.type & 64) {
        o.type = n, o.value = i, o.attrs = r;
        let s = pE();
        o.injectorIndex = s === null ? -1 : s.injectorIndex
    }
    return hi(o, !0), o
}

function q1(t, e, n, i, r) {
    let o = mm(), s = Du(), a = s ? o : o && o.parent, l = t.data[e] = Z1(t, a, n, e, i, r);
    return t.firstChild === null && (t.firstChild = l), o !== null && (s ? o.child == null && l.parent !== null && (o.child = l) : o.next === null && (o.next = l, l.prev = o)), l
}

function gg(t, e, n, i) {
    if (n === 0) return -1;
    let r = e.length;
    for (let o = 0; o < n; o++) e.push(i), t.blueprint.push(i), t.data.push(null);
    return r
}

function vg(t, e, n, i, r) {
    let o = mi(), s = i & 2;
    try {
        si(-1), s && e.length > ln && pg(t, e, ln, !1), zt(s ? 2 : 0, r), n(i, r)
    } finally {
        si(o), zt(s ? 3 : 1, r)
    }
}

function Hu(t, e, n) {
    if (Eu(e)) {
        let i = me(null);
        try {
            let r = e.directiveStart, o = e.directiveEnd;
            for (let s = r; s < o; s++) {
                let a = t.data[s];
                if (a.contentQueries) {
                    let l = n[s];
                    a.contentQueries(1, l, s)
                }
            }
        } finally {
            me(i)
        }
    }
}

function Uu(t, e, n) {
    hm() && (oS(t, e, n, Mt(n, e)), (n.flags & 64) === 64 && bg(t, e, n))
}

function zu(t, e, n = Mt) {
    let i = e.localNames;
    if (i !== null) {
        let r = e.index + 1;
        for (let o = 0; o < i.length; o += 2) {
            let s = i[o + 1], a = s === -1 ? n(e, t) : t[s];
            t[r++] = a
        }
    }
}

function yg(t) {
    let e = t.tView;
    return e === null || e.incompleteFirstPass ? t.tView = Gu(1, null, t.template, t.decls, t.vars, t.directiveDefs, t.pipeDefs, t.viewQuery, t.schemas, t.consts, t.id) : e
}

function Gu(t, e, n, i, r, o, s, a, l, c, f) {
    let p = ln + i, m = p + r, g = W1(p, m), b = typeof c == "function" ? c() : c;
    return g[re] = {
        type: t,
        blueprint: g,
        template: n,
        queries: null,
        viewQuery: a,
        declTNode: e,
        data: g.slice().fill(null, p),
        bindingStartIndex: p,
        expandoStartIndex: m,
        hostBindingOpCodes: null,
        firstCreatePass: !0,
        firstUpdatePass: !0,
        staticViewQueries: !1,
        staticContentQueries: !1,
        preOrderHooks: null,
        preOrderCheckHooks: null,
        contentHooks: null,
        contentCheckHooks: null,
        viewHooks: null,
        viewCheckHooks: null,
        destroyHooks: null,
        cleanup: null,
        contentQueries: null,
        components: null,
        directiveRegistry: typeof o == "function" ? o() : o,
        pipeRegistry: typeof s == "function" ? s() : s,
        firstChild: null,
        schemas: l,
        consts: b,
        incompleteFirstPass: !1,
        ssrId: f
    }
}

function W1(t, e) {
    let n = [];
    for (let i = 0; i < e; i++) n.push(i < t ? null : Kt);
    return n
}

function Y1(t, e, n, i) {
    let o = i.get(XE, qm) || n === qt.ShadowDom, s = t.selectRootElement(e, o);
    return Q1(s), s
}

function Q1(t) {
    X1(t)
}

var X1 = () => null;

function K1(t, e, n, i) {
    let r = Cg(e);
    r.push(n), t.firstCreatePass && Dg(t).push(i, r.length - 1)
}

function Z1(t, e, n, i, r, o) {
    let s = e ? e.injectorIndex : -1, a = 0;
    return uE() && (a |= 128), {
        type: n,
        index: i,
        insertBeforeIndex: null,
        injectorIndex: s,
        directiveStart: -1,
        directiveEnd: -1,
        directiveStylingLast: -1,
        componentOffset: -1,
        propertyBindings: null,
        flags: a,
        providerIndexes: 0,
        value: r,
        attrs: o,
        mergedAttrs: null,
        localNames: null,
        initialInputs: void 0,
        inputs: null,
        outputs: null,
        tView: null,
        next: null,
        prev: null,
        projectionNext: null,
        child: null,
        parent: e,
        projection: null,
        styles: null,
        stylesWithoutHost: null,
        residualStyles: void 0,
        classes: null,
        classesWithoutHost: null,
        residualClasses: void 0,
        classBindings: 0,
        styleBindings: 0
    }
}

function ph(t, e, n, i, r) {
    for (let o in e) {
        if (!e.hasOwnProperty(o)) continue;
        let s = e[o];
        if (s === void 0) continue;
        i ??= {};
        let a, l = Ge.None;
        Array.isArray(s) ? (a = s[0], l = s[1]) : a = s;
        let c = o;
        if (r !== null) {
            if (!r.hasOwnProperty(o)) continue;
            c = r[o]
        }
        t === 0 ? hh(i, n, c, a, l) : hh(i, n, c, a)
    }
    return i
}

function hh(t, e, n, i, r) {
    let o;
    t.hasOwnProperty(n) ? (o = t[n]).push(e, i) : o = t[n] = [e, i], r !== void 0 && o.push(r)
}

function J1(t, e, n) {
    let i = e.directiveStart, r = e.directiveEnd, o = t.data, s = e.attrs, a = [], l = null, c = null;
    for (let f = i; f < r; f++) {
        let p = o[f], m = n ? n.get(p) : null, g = m ? m.inputs : null, b = m ? m.outputs : null;
        l = ph(0, p.inputs, f, l, g), c = ph(1, p.outputs, f, c, b);
        let E = l !== null && s !== null && !vu(e) ? gS(l, f, s) : null;
        a.push(E)
    }
    l !== null && (l.hasOwnProperty("class") && (e.flags |= 8), l.hasOwnProperty("style") && (e.flags |= 16)), e.initialInputs = a, e.inputs = l, e.outputs = c
}

function eS(t) {
    return t === "class" ? "className" : t === "for" ? "htmlFor" : t === "formaction" ? "formAction" : t === "innerHtml" ? "innerHTML" : t === "readonly" ? "readOnly" : t === "tabindex" ? "tabIndex" : t
}

function tS(t, e, n, i, r, o, s, a) {
    let l = Mt(e, n), c = e.inputs, f;
    !a && c != null && (f = c[i]) ? (Wu(t, n, f, i, r), aa(e) && nS(n, e.index)) : e.type & 3 ? (i = eS(i), r = s != null ? s(r, e.value || "", i) : r, o.setProperty(l, i, r)) : e.type & 12
}

function nS(t, e) {
    let n = Ln(e, t);
    n[K] & 16 || (n[K] |= 64)
}

function qu(t, e, n, i) {
    if (hm()) {
        let r = i === null ? null : {"": -1}, o = aS(t, n), s, a;
        o === null ? s = a = null : [s, a] = o, s !== null && wg(t, e, n, s, r, a), r && lS(n, i, r)
    }
    n.mergedAttrs = Gr(n.mergedAttrs, n.attrs)
}

function wg(t, e, n, i, r, o) {
    for (let c = 0; c < i.length; c++) Dc(zs(n, e), t, i[c].type);
    uS(n, t.data.length, i.length);
    for (let c = 0; c < i.length; c++) {
        let f = i[c];
        f.providersResolver && f.providersResolver(f)
    }
    let s = !1, a = !1, l = gg(t, e, i.length, null);
    for (let c = 0; c < i.length; c++) {
        let f = i[c];
        n.mergedAttrs = Gr(n.mergedAttrs, f.hostAttrs), dS(t, n, e, l, f), cS(l, f, r), f.contentQueries !== null && (n.flags |= 4), (f.hostBindings !== null || f.hostAttrs !== null || f.hostVars !== 0) && (n.flags |= 64);
        let p = f.type.prototype;
        !s && (p.ngOnChanges || p.ngOnInit || p.ngDoCheck) && ((t.preOrderHooks ??= []).push(n.index), s = !0), !a && (p.ngOnChanges || p.ngDoCheck) && ((t.preOrderCheckHooks ??= []).push(n.index), a = !0), l++
    }
    J1(t, n, o)
}

function iS(t, e, n, i, r) {
    let o = r.hostBindings;
    if (o) {
        let s = t.hostBindingOpCodes;
        s === null && (s = t.hostBindingOpCodes = []);
        let a = ~e.index;
        rS(s) != a && s.push(a), s.push(n, i, o)
    }
}

function rS(t) {
    let e = t.length;
    for (; e > 0;) {
        let n = t[--e];
        if (typeof n == "number" && n < 0) return n
    }
    return 0
}

function oS(t, e, n, i) {
    let r = n.directiveStart, o = n.directiveEnd;
    aa(n) && fS(e, n, t.data[r + n.componentOffset]), t.firstCreatePass || zs(n, e), Fn(i, e);
    let s = n.initialInputs;
    for (let a = r; a < o; a++) {
        let l = t.data[a], c = li(e, t, a, n);
        if (Fn(c, e), s !== null && mS(e, a - r, c, l, n, s), kn(l)) {
            let f = Ln(n.index, e);
            f[Ft] = li(e, t, a, n)
        }
    }
}

function bg(t, e, n) {
    let i = n.directiveStart, r = n.directiveEnd, o = n.index, s = vE();
    try {
        si(o);
        for (let a = i; a < r; a++) {
            let l = t.data[a], c = e[a];
            Sc(a), (l.hostBindings !== null || l.hostVars !== 0 || l.hostAttrs !== null) && sS(l, c)
        }
    } finally {
        si(-1), Sc(s)
    }
}

function sS(t, e) {
    t.hostBindings !== null && t.hostBindings(1, e)
}

function aS(t, e) {
    let n = t.directiveRegistry, i = null, r = null;
    if (n) for (let o = 0; o < n.length; o++) {
        let s = n[o];
        if (_b(e, s.selectors, !1)) if (i || (i = []), kn(s)) if (s.findHostDirectiveDefs !== null) {
            let a = [];
            r = r || new Map, s.findHostDirectiveDefs(s, a, r), i.unshift(...a, s);
            let l = a.length;
            Fc(t, e, l)
        } else i.unshift(s), Fc(t, e, 0); else r = r || new Map, s.findHostDirectiveDefs?.(s, i, r), i.push(s)
    }
    return i === null ? null : [i, r]
}

function Fc(t, e, n) {
    e.componentOffset = n, (t.components ??= []).push(e.index)
}

function lS(t, e, n) {
    if (e) {
        let i = t.localNames = [];
        for (let r = 0; r < e.length; r += 2) {
            let o = n[e[r + 1]];
            if (o == null) throw new _(-301, !1);
            i.push(e[r], o)
        }
    }
}

function cS(t, e, n) {
    if (n) {
        if (e.exportAs) for (let i = 0; i < e.exportAs.length; i++) n[e.exportAs[i]] = t;
        kn(e) && (n[""] = t)
    }
}

function uS(t, e, n) {
    t.flags |= 1, t.directiveStart = e, t.directiveEnd = e + n, t.providerIndexes = e
}

function dS(t, e, n, i, r) {
    t.data[i] = r;
    let o = r.factory || (r.factory = Yi(r.type, !0)), s = new ai(o, kn(r), P);
    t.blueprint[i] = s, n[i] = s, iS(t, e, i, gg(t, n, r.hostVars, Kt), r)
}

function fS(t, e, n) {
    let i = Mt(e, t), r = yg(n), o = t[Rt].rendererFactory, s = 16;
    n.signals ? s = 4096 : n.onPush && (s = 64);
    let a = va(t, ga(t, r, null, s, i, e, null, o.createRenderer(i, n), null, null, null));
    t[e.index] = a
}

function pS(t, e, n, i, r, o) {
    let s = Mt(t, e);
    hS(e[Le], s, o, t.value, n, i, r)
}

function hS(t, e, n, i, r, o, s) {
    if (o == null) t.removeAttribute(e, r, n); else {
        let a = s == null ? eo(o) : s(o, i || "", r);
        t.setAttribute(e, r, a, n)
    }
}

function mS(t, e, n, i, r, o) {
    let s = o[e];
    if (s !== null) for (let a = 0; a < s.length;) {
        let l = s[a++], c = s[a++], f = s[a++], p = s[a++];
        mg(i, n, l, c, f, p)
    }
}

function gS(t, e, n) {
    let i = null, r = 0;
    for (; r < n.length;) {
        let o = n[r];
        if (o === 0) {
            r += 4;
            continue
        } else if (o === 5) {
            r += 2;
            continue
        }
        if (typeof o == "number") break;
        if (t.hasOwnProperty(o)) {
            i === null && (i = []);
            let s = t[o];
            for (let a = 0; a < s.length; a += 3) if (s[a] === e) {
                i.push(o, s[a + 1], s[a + 2], n[r + 1]);
                break
            }
        }
        r += 2
    }
    return i
}

function Eg(t, e, n, i) {
    return [t, !0, 0, e, null, i, null, n, null, null]
}

function Sg(t, e) {
    let n = t.contentQueries;
    if (n !== null) {
        let i = me(null);
        try {
            for (let r = 0; r < n.length; r += 2) {
                let o = n[r], s = n[r + 1];
                if (s !== -1) {
                    let a = t.data[s];
                    Mu(o), a.contentQueries(2, e[s], s)
                }
            }
        } finally {
            me(i)
        }
    }
}

function va(t, e) {
    return t[Yr] ? t[Kp][kt] = e : t[Yr] = e, t[Kp] = e, e
}

function Rc(t, e, n) {
    Mu(0);
    let i = me(null);
    try {
        e(t, n)
    } finally {
        me(i)
    }
}

function Cg(t) {
    return t[Wr] || (t[Wr] = [])
}

function Dg(t) {
    return t.cleanup || (t.cleanup = [])
}

function Ig(t, e) {
    let n = t[Zi], i = n ? n.get(Qt, null) : null;
    i && i.handleError(e)
}

function Wu(t, e, n, i, r) {
    for (let o = 0; o < n.length;) {
        let s = n[o++], a = n[o++], l = n[o++], c = e[s], f = t.data[s];
        mg(f, c, i, a, l, r)
    }
}

function vS(t, e, n) {
    let i = um(e, t);
    D1(t[Le], i, n)
}

function yS(t, e) {
    let n = Ln(e, t), i = n[re];
    wS(i, n);
    let r = n[fn];
    r !== null && n[$s] === null && (n[$s] = Ru(r, n[Zi])), Yu(i, n, n[Ft])
}

function wS(t, e) {
    for (let n = e.length; n < t.blueprint.length; n++) e.push(t.blueprint[n])
}

function Yu(t, e, n) {
    _u(e);
    try {
        let i = t.viewQuery;
        i !== null && Rc(1, i, n);
        let r = t.template;
        r !== null && vg(t, e, r, 1, n), t.firstCreatePass && (t.firstCreatePass = !1), e[an]?.finishViewCreation(t), t.staticContentQueries && Sg(t, e), t.staticViewQueries && Rc(2, t.viewQuery, n);
        let o = t.components;
        o !== null && bS(e, o)
    } catch (i) {
        throw t.firstCreatePass && (t.incompleteFirstPass = !0, t.firstCreatePass = !1), i
    } finally {
        e[K] &= -5, Tu()
    }
}

function bS(t, e) {
    for (let n = 0; n < e.length; n++) yS(t, e[n])
}

function ES(t, e, n, i) {
    let r = me(null);
    try {
        let o = e.tView, a = t[K] & 4096 ? 4096 : 16,
            l = ga(t, o, n, a, null, e, null, null, i?.injector ?? null, i?.embeddedViewInjector ?? null, i?.dehydratedView ?? null),
            c = t[e.index];
        l[io] = c;
        let f = t[an];
        return f !== null && (l[an] = f.createEmbeddedView(o)), Yu(o, l, n), l
    } finally {
        me(r)
    }
}

function mh(t, e) {
    return !e || e.firstChild === null || jm(t)
}

function SS(t, e, n, i = !0) {
    let r = e[re];
    if (x1(r, e, t, n), i) {
        let s = kc(n, t), a = e[Le], l = $u(a, t[oi]);
        l !== null && _1(r, t[Lt], a, e, l, s)
    }
    let o = e[$s];
    o !== null && o.firstChild !== null && (o.firstChild = null)
}

function Ws(t, e, n, i, r = !1) {
    for (; n !== null;) {
        let o = e[n.index];
        o !== null && i.push(Yt(o)), pn(o) && CS(o, i);
        let s = n.type;
        if (s & 8) Ws(t, e, n.child, i); else if (s & 32) {
            let a = ju(n, e), l;
            for (; l = a();) i.push(l)
        } else if (s & 16) {
            let a = ug(e, n);
            if (Array.isArray(a)) i.push(...a); else {
                let l = Xr(e[Wt]);
                Ws(l[re], l, a, i, !0)
            }
        }
        n = r ? n.projectionNext : n.next
    }
    return i
}

function CS(t, e) {
    for (let n = mt; n < t.length; n++) {
        let i = t[n], r = i[re].firstChild;
        r !== null && Ws(i[re], i, r, e)
    }
    t[oi] !== t[fn] && e.push(t[oi])
}

var Mg = [];

function DS(t) {
    return t[ri] ?? IS(t)
}

function IS(t) {
    let e = Mg.pop() ?? Object.create(_S);
    return e.lView = t, e
}

function MS(t) {
    t.lView[ri] !== t && (t.lView = null, Mg.push(t))
}

var _S = Se(k({}, pp), {
    consumerIsAlwaysLive: !0, consumerMarkedDirty: t => {
        Qr(t.lView)
    }, consumerOnSignalRead() {
        this.lView[ri] = this
    }
}), _g = 100;

function Tg(t, e = !0, n = 0) {
    let i = t[Rt], r = i.rendererFactory, o = !1;
    o || r.begin?.();
    try {
        TS(t, n)
    } catch (s) {
        throw e && Ig(t, s), s
    } finally {
        o || (r.end?.(), i.inlineEffectRunner?.flush())
    }
}

function TS(t, e) {
    Lc(t, e);
    let n = 0;
    for (; Cu(t);) {
        if (n === _g) throw new _(103, !1);
        n++, Lc(t, 1)
    }
}

function xS(t, e, n, i) {
    let r = e[K];
    if ((r & 256) === 256) return;
    let o = !1;
    !o && e[Rt].inlineEffectRunner?.flush(), _u(e);
    let s = null, a = null;
    !o && AS(t) && (a = DS(e), s = hp(a));
    try {
        fm(e), hE(t.bindingStartIndex), n !== null && vg(t, e, n, 2, i);
        let l = (r & 3) === 3;
        if (!o) if (l) {
            let p = t.preOrderCheckHooks;
            p !== null && Ns(e, p, null)
        } else {
            let p = t.preOrderHooks;
            p !== null && Os(e, p, 0, null), ec(e, 0)
        }
        if (NS(e), xg(e, 0), t.contentQueries !== null && Sg(t, e), !o) if (l) {
            let p = t.contentCheckHooks;
            p !== null && Ns(e, p)
        } else {
            let p = t.contentHooks;
            p !== null && Os(e, p, 1), ec(e, 1)
        }
        G1(t, e);
        let c = t.components;
        c !== null && Ng(e, c, 0);
        let f = t.viewQuery;
        if (f !== null && Rc(2, f, i), !o) if (l) {
            let p = t.viewCheckHooks;
            p !== null && Ns(e, p)
        } else {
            let p = t.viewHooks;
            p !== null && Os(e, p, 2), ec(e, 2)
        }
        if (t.firstUpdatePass === !0 && (t.firstUpdatePass = !1), e[Jl]) {
            for (let p of e[Jl]) p();
            e[Jl] = null
        }
        o || (e[K] &= -73)
    } catch (l) {
        throw Qr(e), l
    } finally {
        a !== null && (mp(a, s), MS(a)), Tu()
    }
}

function AS(t) {
    return t.type !== 2
}

function xg(t, e) {
    for (let n = Bm(t); n !== null; n = Hm(n)) for (let i = mt; i < n.length; i++) {
        let r = n[i];
        Ag(r, e)
    }
}

function NS(t) {
    for (let e = Bm(t); e !== null; e = Hm(e)) {
        if (!(e[K] & bu.HasTransplantedViews)) continue;
        let n = e[Ji];
        for (let i = 0; i < n.length; i++) {
            let r = n[i], o = r[qe];
            rE(r)
        }
    }
}

function OS(t, e, n) {
    let i = Ln(e, t);
    Ag(i, n)
}

function Ag(t, e) {
    Su(t) && Lc(t, e)
}

function Lc(t, e) {
    let i = t[re], r = t[K], o = t[ri], s = !!(e === 0 && r & 16);
    if (s ||= !!(r & 64 && e === 0), s ||= !!(r & 1024), s ||= !!(o?.dirty && Ol(o)), o && (o.dirty = !1), t[K] &= -9217, s) xS(i, t, i.template, t[Ft]); else if (r & 8192) {
        xg(t, 1);
        let a = i.components;
        a !== null && Ng(t, a, 1)
    }
}

function Ng(t, e, n) {
    for (let i = 0; i < e.length; i++) OS(t, e[i], n)
}

function Qu(t) {
    for (t[Rt].changeDetectionScheduler?.notify(); t;) {
        t[K] |= 64;
        let e = Xr(t);
        if (Qb(t) && !e) return t;
        t = e
    }
    return null
}

var ci = class {
    get rootNodes() {
        let e = this._lView, n = e[re];
        return Ws(n, e, n.firstChild, [])
    }

    constructor(e, n, i = !0) {
        this._lView = e, this._cdRefInjectingView = n, this.notifyErrorHandler = i, this._appRef = null, this._attachedToViewContainer = !1
    }

    get context() {
        return this._lView[Ft]
    }

    set context(e) {
        this._lView[Ft] = e
    }

    get destroyed() {
        return (this._lView[K] & 256) === 256
    }

    destroy() {
        if (this._appRef) this._appRef.detachView(this); else if (this._attachedToViewContainer) {
            let e = this._lView[qe];
            if (pn(e)) {
                let n = e[Bs], i = n ? n.indexOf(this) : -1;
                i > -1 && (Pc(e, i), Vs(n, i))
            }
            this._attachedToViewContainer = !1
        }
        lg(this._lView[re], this._lView)
    }

    onDestroy(e) {
        pm(this._lView, e)
    }

    markForCheck() {
        Qu(this._cdRefInjectingView || this._lView)
    }

    detach() {
        this._lView[K] &= -129
    }

    reattach() {
        Ec(this._lView), this._lView[K] |= 128
    }

    detectChanges() {
        this._lView[K] |= 1024, Tg(this._lView, this.notifyErrorHandler)
    }

    checkNoChanges() {
    }

    attachToViewContainerRef() {
        if (this._appRef) throw new _(902, !1);
        this._attachedToViewContainer = !0
    }

    detachFromAppRef() {
        this._appRef = null, sg(this._lView[re], this._lView)
    }

    attachToAppRef(e) {
        if (this._attachedToViewContainer) throw new _(902, !1);
        this._appRef = e, Ec(this._lView)
    }
}, ui = (() => {
    let e = class e {
    };
    e.__NG_ELEMENT_ID__ = FS;
    let t = e;
    return t
})(), PS = ui, kS = class extends PS {
    constructor(e, n, i) {
        super(), this._declarationLView = e, this._declarationTContainer = n, this.elementRef = i
    }

    get ssrId() {
        return this._declarationTContainer.tView?.ssrId || null
    }

    createEmbeddedView(e, n) {
        return this.createEmbeddedViewImpl(e, n)
    }

    createEmbeddedViewImpl(e, n, i) {
        let r = ES(this._declarationLView, this._declarationTContainer, e, {
            embeddedViewInjector: n,
            dehydratedView: i
        });
        return new ci(r)
    }
};

function FS() {
    return Xu(ot(), ve())
}

function Xu(t, e) {
    return t.type & 4 ? new kS(e, t, sr(t, e)) : null
}

var f2 = new RegExp(`^(\\d+)*(${YE}|${WE})*(.*)`);
var RS = () => null;

function gh(t, e) {
    return RS(t, e)
}

var tr = class {
}, Vc = class {
}, Ys = class {
};

function LS(t) {
    let e = Error(`No component factory found for ${rt(t)}.`);
    return e[VS] = t, e
}

var VS = "ngComponent";
var jc = class {
    resolveComponentFactory(e) {
        throw LS(e)
    }
}, ya = (() => {
    let e = class e {
    };
    e.NULL = new jc;
    let t = e;
    return t
})(), di = class {
}, Zt = (() => {
    let e = class e {
        constructor() {
            this.destroyNode = null
        }
    };
    e.__NG_ELEMENT_ID__ = () => jS();
    let t = e;
    return t
})();

function jS() {
    let t = ve(), e = ot(), n = Ln(e.index, t);
    return (ni(n) ? n : t)[Le]
}

var $S = (() => {
    let e = class e {
    };
    e.\u0275prov = B({token: e, providedIn: "root", factory: () => null});
    let t = e;
    return t
})(), oc = {};
var vh = new Set;

function ao(t) {
    vh.has(t) || (vh.add(t), performance?.mark?.("mark_feature_usage", {detail: {feature: t}}))
}

function yh(...t) {
}

function BS() {
    let t = typeof sn.requestAnimationFrame == "function", e = sn[t ? "requestAnimationFrame" : "setTimeout"],
        n = sn[t ? "cancelAnimationFrame" : "clearTimeout"];
    if (typeof Zone < "u" && e && n) {
        let i = e[Zone.__symbol__("OriginalDelegate")];
        i && (e = i);
        let r = n[Zone.__symbol__("OriginalDelegate")];
        r && (n = r)
    }
    return {nativeRequestAnimationFrame: e, nativeCancelAnimationFrame: n}
}

var Ie = class t {
    constructor({
                    enableLongStackTrace: e = !1,
                    shouldCoalesceEventChangeDetection: n = !1,
                    shouldCoalesceRunChangeDetection: i = !1
                }) {
        if (this.hasPendingMacrotasks = !1, this.hasPendingMicrotasks = !1, this.isStable = !0, this.onUnstable = new ke(!1), this.onMicrotaskEmpty = new ke(!1), this.onStable = new ke(!1), this.onError = new ke(!1), typeof Zone > "u") throw new _(908, !1);
        Zone.assertZonePatched();
        let r = this;
        r._nesting = 0, r._outer = r._inner = Zone.current, Zone.TaskTrackingZoneSpec && (r._inner = r._inner.fork(new Zone.TaskTrackingZoneSpec)), e && Zone.longStackTraceZoneSpec && (r._inner = r._inner.fork(Zone.longStackTraceZoneSpec)), r.shouldCoalesceEventChangeDetection = !i && n, r.shouldCoalesceRunChangeDetection = i, r.lastRequestAnimationFrameId = -1, r.nativeRequestAnimationFrame = BS().nativeRequestAnimationFrame, zS(r)
    }

    static isInAngularZone() {
        return typeof Zone < "u" && Zone.current.get("isAngularZone") === !0
    }

    static assertInAngularZone() {
        if (!t.isInAngularZone()) throw new _(909, !1)
    }

    static assertNotInAngularZone() {
        if (t.isInAngularZone()) throw new _(909, !1)
    }

    run(e, n, i) {
        return this._inner.run(e, n, i)
    }

    runTask(e, n, i, r) {
        let o = this._inner, s = o.scheduleEventTask("NgZoneEvent: " + r, e, HS, yh, yh);
        try {
            return o.runTask(s, n, i)
        } finally {
            o.cancelTask(s)
        }
    }

    runGuarded(e, n, i) {
        return this._inner.runGuarded(e, n, i)
    }

    runOutsideAngular(e) {
        return this._outer.run(e)
    }
}, HS = {};

function Ku(t) {
    if (t._nesting == 0 && !t.hasPendingMicrotasks && !t.isStable) try {
        t._nesting++, t.onMicrotaskEmpty.emit(null)
    } finally {
        if (t._nesting--, !t.hasPendingMicrotasks) try {
            t.runOutsideAngular(() => t.onStable.emit(null))
        } finally {
            t.isStable = !0
        }
    }
}

function US(t) {
    t.isCheckStableRunning || t.lastRequestAnimationFrameId !== -1 || (t.lastRequestAnimationFrameId = t.nativeRequestAnimationFrame.call(sn, () => {
        t.fakeTopEventTask || (t.fakeTopEventTask = Zone.root.scheduleEventTask("fakeTopEventTask", () => {
            t.lastRequestAnimationFrameId = -1, $c(t), t.isCheckStableRunning = !0, Ku(t), t.isCheckStableRunning = !1
        }, void 0, () => {
        }, () => {
        })), t.fakeTopEventTask.invoke()
    }), $c(t))
}

function zS(t) {
    let e = () => {
        US(t)
    };
    t._inner = t._inner.fork({
        name: "angular", properties: {isAngularZone: !0}, onInvokeTask: (n, i, r, o, s, a) => {
            if (GS(a)) return n.invokeTask(r, o, s, a);
            try {
                return wh(t), n.invokeTask(r, o, s, a)
            } finally {
                (t.shouldCoalesceEventChangeDetection && o.type === "eventTask" || t.shouldCoalesceRunChangeDetection) && e(), bh(t)
            }
        }, onInvoke: (n, i, r, o, s, a, l) => {
            try {
                return wh(t), n.invoke(r, o, s, a, l)
            } finally {
                t.shouldCoalesceRunChangeDetection && e(), bh(t)
            }
        }, onHasTask: (n, i, r, o) => {
            n.hasTask(r, o), i === r && (o.change == "microTask" ? (t._hasPendingMicrotasks = o.microTask, $c(t), Ku(t)) : o.change == "macroTask" && (t.hasPendingMacrotasks = o.macroTask))
        }, onHandleError: (n, i, r, o) => (n.handleError(r, o), t.runOutsideAngular(() => t.onError.emit(o)), !1)
    })
}

function $c(t) {
    t._hasPendingMicrotasks || (t.shouldCoalesceEventChangeDetection || t.shouldCoalesceRunChangeDetection) && t.lastRequestAnimationFrameId !== -1 ? t.hasPendingMicrotasks = !0 : t.hasPendingMicrotasks = !1
}

function wh(t) {
    t._nesting++, t.isStable && (t.isStable = !1, t.onUnstable.emit(null))
}

function bh(t) {
    t._nesting--, Ku(t)
}

function GS(t) {
    return !Array.isArray(t) || t.length !== 1 ? !1 : t[0].data?.__ignore_ng_zone__ === !0
}

var Gi = function (t) {
    return t[t.EarlyRead = 0] = "EarlyRead", t[t.Write = 1] = "Write", t[t.MixedReadWrite = 2] = "MixedReadWrite", t[t.Read = 3] = "Read", t
}(Gi || {}), qS = {
    destroy() {
    }
};

function Zu(t, e) {
    !e && Wb(Zu);
    let n = e?.injector ?? N(vn);
    if (!E1(n)) return qS;
    ao("NgAfterNextRender");
    let i = n.get(Ju), r = i.handler ??= new Hc, o = e?.phase ?? Gi.MixedReadWrite, s = () => {
        r.unregister(l), a()
    }, a = n.get(Nu).onDestroy(s), l = dn(n, () => new Bc(o, () => {
        s(), t()
    }));
    return r.register(l), {destroy: s}
}

var Bc = class {
    constructor(e, n) {
        this.phase = e, this.callbackFn = n, this.zone = N(Ie), this.errorHandler = N(Qt, {optional: !0}), N(tr, {optional: !0})?.notify(1)
    }

    invoke() {
        try {
            this.zone.runOutsideAngular(this.callbackFn)
        } catch (e) {
            this.errorHandler?.handleError(e)
        }
    }
}, Hc = class {
    constructor() {
        this.executingCallbacks = !1, this.buckets = {
            [Gi.EarlyRead]: new Set,
            [Gi.Write]: new Set,
            [Gi.MixedReadWrite]: new Set,
            [Gi.Read]: new Set
        }, this.deferredCallbacks = new Set
    }

    register(e) {
        (this.executingCallbacks ? this.deferredCallbacks : this.buckets[e.phase]).add(e)
    }

    unregister(e) {
        this.buckets[e.phase].delete(e), this.deferredCallbacks.delete(e)
    }

    execute() {
        this.executingCallbacks = !0;
        for (let e of Object.values(this.buckets)) for (let n of e) n.invoke();
        this.executingCallbacks = !1;
        for (let e of this.deferredCallbacks) this.buckets[e.phase].add(e);
        this.deferredCallbacks.clear()
    }

    destroy() {
        for (let e of Object.values(this.buckets)) e.clear();
        this.deferredCallbacks.clear()
    }
}, Ju = (() => {
    let e = class e {
        constructor() {
            this.handler = null, this.internalCallbacks = []
        }

        execute() {
            this.executeInternalCallbacks(), this.handler?.execute()
        }

        executeInternalCallbacks() {
            let i = [...this.internalCallbacks];
            this.internalCallbacks.length = 0;
            for (let r of i) r()
        }

        ngOnDestroy() {
            this.handler?.destroy(), this.handler = null, this.internalCallbacks.length = 0
        }
    };
    e.\u0275prov = B({token: e, providedIn: "root", factory: () => new e});
    let t = e;
    return t
})();

function Qs(t, e, n) {
    let i = n ? t.styles : null, r = n ? t.classes : null, o = 0;
    if (e !== null) for (let s = 0; s < e.length; s++) {
        let a = e[s];
        if (typeof a == "number") o = a; else if (o == 1) r = fc(r, a); else if (o == 2) {
            let l = a, c = e[++s];
            i = fc(i, l + ": " + c + ";")
        }
    }
    n ? t.styles = i : t.stylesWithoutHost = i, n ? t.classes = r : t.classesWithoutHost = r
}

var Xs = class extends ya {
    constructor(e) {
        super(), this.ngModule = e
    }

    resolveComponentFactory(e) {
        let n = Pn(e);
        return new nr(n, this.ngModule)
    }
};

function Eh(t) {
    let e = [];
    for (let n in t) {
        if (!t.hasOwnProperty(n)) continue;
        let i = t[n];
        i !== void 0 && e.push({propName: Array.isArray(i) ? i[0] : i, templateName: n})
    }
    return e
}

function WS(t) {
    let e = t.toLowerCase();
    return e === "svg" ? cm : e === "math" ? Jb : null
}

var Uc = class {
    constructor(e, n) {
        this.injector = e, this.parentInjector = n
    }

    get(e, n, i) {
        i = na(i);
        let r = this.injector.get(e, oc, i);
        return r !== oc || n === oc ? r : this.parentInjector.get(e, n, i)
    }
}, nr = class extends Ys {
    get inputs() {
        let e = this.componentDef, n = e.inputTransforms, i = Eh(e.inputs);
        if (n !== null) for (let r of i) n.hasOwnProperty(r.propName) && (r.transform = n[r.propName]);
        return i
    }

    get outputs() {
        return Eh(this.componentDef.outputs)
    }

    constructor(e, n) {
        super(), this.componentDef = e, this.ngModule = n, this.componentType = e.type, this.selector = Nb(e.selectors), this.ngContentSelectors = e.ngContentSelectors ? e.ngContentSelectors : [], this.isBoundToModule = !!n
    }

    create(e, n, i, r) {
        let o = me(null);
        try {
            r = r || this.ngModule;
            let s = r instanceof gt ? r : r?.injector;
            s && this.componentDef.getStandaloneInjector !== null && (s = this.componentDef.getStandaloneInjector(s) || s);
            let a = s ? new Uc(e, s) : e, l = a.get(di, null);
            if (l === null) throw new _(407, !1);
            let c = a.get($S, null), f = a.get(Ju, null), p = a.get(tr, null), m = {
                    rendererFactory: l,
                    sanitizer: c,
                    inlineEffectRunner: null,
                    afterRenderEventManager: f,
                    changeDetectionScheduler: p
                }, g = l.createRenderer(null, this.componentDef), b = this.componentDef.selectors[0][0] || "div",
                E = i ? Y1(g, i, this.componentDef.encapsulation, a) : og(g, b, WS(b)), M = 512;
            this.componentDef.signals ? M |= 4096 : this.componentDef.onPush || (M |= 16);
            let w = null;
            E !== null && (w = Ru(E, a, !0));
            let S = Gu(0, null, null, 1, 0, null, null, null, null, null, null),
                C = ga(null, S, null, M, null, null, m, g, a, null, w);
            _u(C);
            let I, O;
            try {
                let U = this.componentDef, de, L = null;
                U.findHostDirectiveDefs ? (de = [], L = new Map, U.findHostDirectiveDefs(U, de, L), de.push(U)) : de = [U];
                let Ce = YS(C, E), A = QS(Ce, E, U, de, C, m, g);
                O = dm(S, ln), E && ZS(g, U, E, i), n !== void 0 && JS(O, this.ngContentSelectors, n), I = KS(A, U, de, L, C, [eC]), Yu(S, C, null)
            } finally {
                Tu()
            }
            return new zc(this.componentType, I, sr(O, C), C, O)
        } finally {
            me(o)
        }
    }
}, zc = class extends Vc {
    constructor(e, n, i, r, o) {
        super(), this.location = i, this._rootLView = r, this._tNode = o, this.previousInputValues = null, this.instance = n, this.hostView = this.changeDetectorRef = new ci(r, void 0, !1), this.componentType = e
    }

    setInput(e, n) {
        let i = this._tNode.inputs, r;
        if (i !== null && (r = i[e])) {
            if (this.previousInputValues ??= new Map, this.previousInputValues.has(e) && Object.is(this.previousInputValues.get(e), n)) return;
            let o = this._rootLView;
            Wu(o[re], o, r, e, n), this.previousInputValues.set(e, n);
            let s = Ln(this._tNode.index, o);
            Qu(s)
        }
    }

    get injector() {
        return new ii(this._tNode, this._rootLView)
    }

    destroy() {
        this.hostView.destroy()
    }

    onDestroy(e) {
        this.hostView.onDestroy(e)
    }
};

function YS(t, e) {
    let n = t[re], i = ln;
    return t[i] = e, so(n, i, 2, "#host", null)
}

function QS(t, e, n, i, r, o, s) {
    let a = r[re];
    XS(i, t, e, s);
    let l = null;
    e !== null && (l = Ru(e, r[Zi]));
    let c = o.rendererFactory.createRenderer(e, n), f = 16;
    n.signals ? f = 4096 : n.onPush && (f = 64);
    let p = ga(r, yg(n), null, f, r[t.index], t, o, c, null, null, l);
    return a.firstCreatePass && Fc(a, t, i.length - 1), va(r, p), r[t.index] = p
}

function XS(t, e, n, i) {
    for (let r of t) e.mergedAttrs = Gr(e.mergedAttrs, r.hostAttrs);
    e.mergedAttrs !== null && (Qs(e, e.mergedAttrs, !0), n !== null && fg(i, n, e))
}

function KS(t, e, n, i, r, o) {
    let s = ot(), a = r[re], l = Mt(s, r);
    wg(a, r, s, n, null, i);
    for (let f = 0; f < n.length; f++) {
        let p = s.directiveStart + f, m = li(r, a, p, s);
        Fn(m, r)
    }
    bg(a, r, s), l && Fn(l, r);
    let c = li(r, a, s.directiveStart + s.componentOffset, s);
    if (t[Ft] = r[Ft] = c, o !== null) for (let f of o) f(c, e);
    return Hu(a, s, r), c
}

function ZS(t, e, n, i) {
    if (i) gc(t, n, ["ng-version", "17.3.3"]); else {
        let {attrs: r, classes: o} = Ob(e.selectors[0]);
        r && gc(t, n, r), o && o.length > 0 && dg(t, n, o.join(" "))
    }
}

function JS(t, e, n) {
    let i = t.projection = [];
    for (let r = 0; r < e.length; r++) {
        let o = n[r];
        i.push(o != null ? Array.from(o) : null)
    }
}

function eC() {
    let t = ot();
    da(ve()[re], t)
}

var jn = (() => {
    let e = class e {
    };
    e.__NG_ELEMENT_ID__ = tC;
    let t = e;
    return t
})();

function tC() {
    let t = ot();
    return Pg(t, ve())
}

var nC = jn, Og = class extends nC {
    constructor(e, n, i) {
        super(), this._lContainer = e, this._hostTNode = n, this._hostLView = i
    }

    get element() {
        return sr(this._hostTNode, this._hostLView)
    }

    get injector() {
        return new ii(this._hostTNode, this._hostLView)
    }

    get parentInjector() {
        let e = xu(this._hostTNode, this._hostLView);
        if (Tm(e)) {
            let n = Us(e, this._hostLView), i = Hs(e), r = n[re].data[i + 8];
            return new ii(r, n)
        } else return new ii(null, this._hostLView)
    }

    clear() {
        for (; this.length > 0;) this.remove(this.length - 1)
    }

    get(e) {
        let n = Sh(this._lContainer);
        return n !== null && n[e] || null
    }

    get length() {
        return this._lContainer.length - mt
    }

    createEmbeddedView(e, n, i) {
        let r, o;
        typeof i == "number" ? r = i : i != null && (r = i.index, o = i.injector);
        let s = gh(this._lContainer, e.ssrId), a = e.createEmbeddedViewImpl(n || {}, o, s);
        return this.insertImpl(a, r, mh(this._hostTNode, s)), a
    }

    createComponent(e, n, i, r, o) {
        let s = e && !Yb(e), a;
        if (s) a = n; else {
            let b = n || {};
            a = b.index, i = b.injector, r = b.projectableNodes, o = b.environmentInjector || b.ngModuleRef
        }
        let l = s ? e : new nr(Pn(e)), c = i || this.parentInjector;
        if (!o && l.ngModule == null) {
            let E = (s ? c : this.parentInjector).get(gt, null);
            E && (o = E)
        }
        let f = Pn(l.componentType ?? {}), p = gh(this._lContainer, f?.id ?? null), m = p?.firstChild ?? null,
            g = l.create(c, r, m, o);
        return this.insertImpl(g.hostView, a, mh(this._hostTNode, p)), g
    }

    insert(e, n) {
        return this.insertImpl(e, n, !0)
    }

    insertImpl(e, n, i) {
        let r = e._lView;
        if (iE(r)) {
            let a = this.indexOf(e);
            if (a !== -1) this.detach(a); else {
                let l = r[qe], c = new Og(l, l[Lt], l[qe]);
                c.detach(c.indexOf(e))
            }
        }
        let o = this._adjustIndex(n), s = this._lContainer;
        return SS(s, r, o, i), e.attachToViewContainerRef(), $h(sc(s), o, e), e
    }

    move(e, n) {
        return this.insert(e, n)
    }

    indexOf(e) {
        let n = Sh(this._lContainer);
        return n !== null ? n.indexOf(e) : -1
    }

    remove(e) {
        let n = this._adjustIndex(e, -1), i = Pc(this._lContainer, n);
        i && (Vs(sc(this._lContainer), n), lg(i[re], i))
    }

    detach(e) {
        let n = this._adjustIndex(e, -1), i = Pc(this._lContainer, n);
        return i && Vs(sc(this._lContainer), n) != null ? new ci(i) : null
    }

    _adjustIndex(e, n = 0) {
        return e ?? this.length + n
    }
};

function Sh(t) {
    return t[Bs]
}

function sc(t) {
    return t[Bs] || (t[Bs] = [])
}

function Pg(t, e) {
    let n, i = e[t.index];
    return pn(i) ? n = i : (n = Eg(i, e, null, t), e[t.index] = n, va(e, n)), rC(n, e, t, i), new Og(n, t, e)
}

function iC(t, e) {
    let n = t[Le], i = n.createComment(""), r = Mt(e, t), o = $u(n, r);
    return qs(n, o, i, R1(n, r), !1), i
}

var rC = aC, oC = () => !1;

function sC(t, e, n) {
    return oC(t, e, n)
}

function aC(t, e, n, i) {
    if (t[oi]) return;
    let r;
    n.type & 8 ? r = Yt(i) : r = iC(e, n), t[oi] = r
}

var Gc = class t {
    constructor(e) {
        this.queryList = e, this.matches = null
    }

    clone() {
        return new t(this.queryList)
    }

    setDirty() {
        this.queryList.setDirty()
    }
}, qc = class t {
    constructor(e = []) {
        this.queries = e
    }

    createEmbeddedView(e) {
        let n = e.queries;
        if (n !== null) {
            let i = e.contentQueries !== null ? e.contentQueries[0] : n.length, r = [];
            for (let o = 0; o < i; o++) {
                let s = n.getByIndex(o), a = this.queries[s.indexInDeclarationView];
                r.push(a.clone())
            }
            return new t(r)
        }
        return null
    }

    insertView(e) {
        this.dirtyQueriesWithMatches(e)
    }

    detachView(e) {
        this.dirtyQueriesWithMatches(e)
    }

    finishViewCreation(e) {
        this.dirtyQueriesWithMatches(e)
    }

    dirtyQueriesWithMatches(e) {
        for (let n = 0; n < this.queries.length; n++) ed(e, n).matches !== null && this.queries[n].setDirty()
    }
}, Wc = class {
    constructor(e, n, i = null) {
        this.flags = n, this.read = i, typeof e == "string" ? this.predicate = mC(e) : this.predicate = e
    }
}, Yc = class t {
    constructor(e = []) {
        this.queries = e
    }

    elementStart(e, n) {
        for (let i = 0; i < this.queries.length; i++) this.queries[i].elementStart(e, n)
    }

    elementEnd(e) {
        for (let n = 0; n < this.queries.length; n++) this.queries[n].elementEnd(e)
    }

    embeddedTView(e) {
        let n = null;
        for (let i = 0; i < this.length; i++) {
            let r = n !== null ? n.length : 0, o = this.getByIndex(i).embeddedTView(e, r);
            o && (o.indexInDeclarationView = i, n !== null ? n.push(o) : n = [o])
        }
        return n !== null ? new t(n) : null
    }

    template(e, n) {
        for (let i = 0; i < this.queries.length; i++) this.queries[i].template(e, n)
    }

    getByIndex(e) {
        return this.queries[e]
    }

    get length() {
        return this.queries.length
    }

    track(e) {
        this.queries.push(e)
    }
}, Qc = class t {
    constructor(e, n = -1) {
        this.metadata = e, this.matches = null, this.indexInDeclarationView = -1, this.crossesNgTemplate = !1, this._appliesToNextNode = !0, this._declarationNodeIndex = n
    }

    elementStart(e, n) {
        this.isApplyingToNode(n) && this.matchTNode(e, n)
    }

    elementEnd(e) {
        this._declarationNodeIndex === e.index && (this._appliesToNextNode = !1)
    }

    template(e, n) {
        this.elementStart(e, n)
    }

    embeddedTView(e, n) {
        return this.isApplyingToNode(e) ? (this.crossesNgTemplate = !0, this.addMatch(-e.index, n), new t(this.metadata)) : null
    }

    isApplyingToNode(e) {
        if (this._appliesToNextNode && (this.metadata.flags & 1) !== 1) {
            let n = this._declarationNodeIndex, i = e.parent;
            for (; i !== null && i.type & 8 && i.index !== n;) i = i.parent;
            return n === (i !== null ? i.index : -1)
        }
        return this._appliesToNextNode
    }

    matchTNode(e, n) {
        let i = this.metadata.predicate;
        if (Array.isArray(i)) for (let r = 0; r < i.length; r++) {
            let o = i[r];
            this.matchTNodeWithReadOption(e, n, lC(n, o)), this.matchTNodeWithReadOption(e, n, Ps(n, e, o, !1, !1))
        } else i === ui ? n.type & 4 && this.matchTNodeWithReadOption(e, n, -1) : this.matchTNodeWithReadOption(e, n, Ps(n, e, i, !1, !1))
    }

    matchTNodeWithReadOption(e, n, i) {
        if (i !== null) {
            let r = this.metadata.read;
            if (r !== null) if (r === ut || r === jn || r === ui && n.type & 4) this.addMatch(n.index, -2); else {
                let o = Ps(n, e, r, !1, !1);
                o !== null && this.addMatch(n.index, o)
            } else this.addMatch(n.index, i)
        }
    }

    addMatch(e, n) {
        this.matches === null ? this.matches = [e, n] : this.matches.push(e, n)
    }
};

function lC(t, e) {
    let n = t.localNames;
    if (n !== null) {
        for (let i = 0; i < n.length; i += 2) if (n[i] === e) return n[i + 1]
    }
    return null
}

function cC(t, e) {
    return t.type & 11 ? sr(t, e) : t.type & 4 ? Xu(t, e) : null
}

function uC(t, e, n, i) {
    return n === -1 ? cC(e, t) : n === -2 ? dC(t, e, i) : li(t, t[re], n, e)
}

function dC(t, e, n) {
    if (n === ut) return sr(e, t);
    if (n === ui) return Xu(e, t);
    if (n === jn) return Pg(e, t)
}

function kg(t, e, n, i) {
    let r = e[an].queries[i];
    if (r.matches === null) {
        let o = t.data, s = n.matches, a = [];
        for (let l = 0; s !== null && l < s.length; l += 2) {
            let c = s[l];
            if (c < 0) a.push(null); else {
                let f = o[c];
                a.push(uC(e, f, s[l + 1], n.metadata.read))
            }
        }
        r.matches = a
    }
    return r.matches
}

function Xc(t, e, n, i) {
    let r = t.queries.getByIndex(n), o = r.matches;
    if (o !== null) {
        let s = kg(t, e, r, n);
        for (let a = 0; a < o.length; a += 2) {
            let l = o[a];
            if (l > 0) i.push(s[a / 2]); else {
                let c = o[a + 1], f = e[-l];
                for (let p = mt; p < f.length; p++) {
                    let m = f[p];
                    m[io] === m[qe] && Xc(m[re], m, c, i)
                }
                if (f[Ji] !== null) {
                    let p = f[Ji];
                    for (let m = 0; m < p.length; m++) {
                        let g = p[m];
                        Xc(g[re], g, c, i)
                    }
                }
            }
        }
    }
    return i
}

function fC(t, e) {
    return t[an].queries[e].queryList
}

function pC(t, e, n) {
    let i = new Tc((n & 4) === 4);
    return K1(t, e, i, i.destroy), (e[an] ??= new qc).queries.push(new Gc(i)) - 1
}

function hC(t, e, n, i) {
    let r = Xe();
    if (r.firstCreatePass) {
        let o = ot();
        gC(r, new Wc(e, n, i), o.index), vC(r, t), (n & 2) === 2 && (r.staticContentQueries = !0)
    }
    return pC(r, ve(), n)
}

function mC(t) {
    return t.split(",").map(e => e.trim())
}

function gC(t, e, n) {
    t.queries === null && (t.queries = new Yc), t.queries.track(new Qc(e, n))
}

function vC(t, e) {
    let n = t.contentQueries || (t.contentQueries = []), i = n.length ? n[n.length - 1] : -1;
    e !== i && n.push(t.queries.length - 1, e)
}

function ed(t, e) {
    return t.queries.getByIndex(e)
}

function yC(t, e) {
    let n = t[re], i = ed(n, e);
    return i.crossesNgTemplate ? Xc(n, t, e, []) : kg(n, t, i, e)
}

function wC(t) {
    return Object.getPrototypeOf(t.prototype).constructor
}

function wn(t) {
    let e = wC(t.type), n = !0, i = [t];
    for (; e;) {
        let r;
        if (kn(t)) r = e.\u0275cmp || e.\u0275dir; else {
            if (e.\u0275cmp) throw new _(903, !1);
            r = e.\u0275dir
        }
        if (r) {
            if (n) {
                i.push(r);
                let s = t;
                s.inputs = Ts(t.inputs), s.inputTransforms = Ts(t.inputTransforms), s.declaredInputs = Ts(t.declaredInputs), s.outputs = Ts(t.outputs);
                let a = r.hostBindings;
                a && DC(t, a);
                let l = r.viewQuery, c = r.contentQueries;
                if (l && SC(t, l), c && CC(t, c), bC(t, r), Zw(t.outputs, r.outputs), kn(r) && r.data.animation) {
                    let f = t.data;
                    f.animation = (f.animation || []).concat(r.data.animation)
                }
            }
            let o = r.features;
            if (o) for (let s = 0; s < o.length; s++) {
                let a = o[s];
                a && a.ngInherit && a(t), a === wn && (n = !1)
            }
        }
        e = Object.getPrototypeOf(e)
    }
    EC(i)
}

function bC(t, e) {
    for (let n in e.inputs) {
        if (!e.inputs.hasOwnProperty(n) || t.inputs.hasOwnProperty(n)) continue;
        let i = e.inputs[n];
        if (i !== void 0 && (t.inputs[n] = i, t.declaredInputs[n] = e.declaredInputs[n], e.inputTransforms !== null)) {
            let r = Array.isArray(i) ? i[0] : i;
            if (!e.inputTransforms.hasOwnProperty(r)) continue;
            t.inputTransforms ??= {}, t.inputTransforms[r] = e.inputTransforms[r]
        }
    }
}

function EC(t) {
    let e = 0, n = null;
    for (let i = t.length - 1; i >= 0; i--) {
        let r = t[i];
        r.hostVars = e += r.hostVars, r.hostAttrs = Gr(r.hostAttrs, n = Gr(n, r.hostAttrs))
    }
}

function Ts(t) {
    return t === Qi ? {} : t === ct ? [] : t
}

function SC(t, e) {
    let n = t.viewQuery;
    n ? t.viewQuery = (i, r) => {
        e(i, r), n(i, r)
    } : t.viewQuery = e
}

function CC(t, e) {
    let n = t.contentQueries;
    n ? t.contentQueries = (i, r, o) => {
        e(i, r, o), n(i, r, o)
    } : t.contentQueries = e
}

function DC(t, e) {
    let n = t.hostBindings;
    n ? t.hostBindings = (i, r) => {
        e(i, r), n(i, r)
    } : t.hostBindings = e
}

function td(t) {
    let e = t.inputConfig, n = {};
    for (let i in e) if (e.hasOwnProperty(i)) {
        let r = e[i];
        Array.isArray(r) && r[3] && (n[i] = r[3])
    }
    t.inputTransforms = n
}

var Rn = class {
}, Kr = class {
};
var Kc = class extends Rn {
    constructor(e, n, i) {
        super(), this._parent = n, this._bootstrapComponents = [], this.destroyCbs = [], this.componentFactoryResolver = new Xs(this);
        let r = Qh(e);
        this._bootstrapComponents = rg(r.bootstrap), this._r3Injector = Lm(e, n, [{
            provide: Rn,
            useValue: this
        }, {
            provide: ya,
            useValue: this.componentFactoryResolver
        }, ...i], rt(e), new Set(["environment"])), this._r3Injector.resolveInjectorInitializers(), this.instance = this._r3Injector.get(e)
    }

    get injector() {
        return this._r3Injector
    }

    destroy() {
        let e = this._r3Injector;
        !e.destroyed && e.destroy(), this.destroyCbs.forEach(n => n()), this.destroyCbs = null
    }

    onDestroy(e) {
        this.destroyCbs.push(e)
    }
}, Zc = class extends Kr {
    constructor(e) {
        super(), this.moduleType = e
    }

    create(e) {
        return new Kc(this.moduleType, e, [])
    }
};
var Ks = class extends Rn {
    constructor(e) {
        super(), this.componentFactoryResolver = new Xs(this), this.instance = null;
        let n = new qr([...e.providers, {provide: Rn, useValue: this}, {
            provide: ya,
            useValue: this.componentFactoryResolver
        }], e.parent || wu(), e.debugName, new Set(["environment"]));
        this.injector = n, e.runEnvironmentInitializers && n.resolveInjectorInitializers()
    }

    destroy() {
        this.injector.destroy()
    }

    onDestroy(e) {
        this.injector.onDestroy(e)
    }
};

function wa(t, e, n = null) {
    return new Ks({providers: t, parent: e, debugName: n, runEnvironmentInitializers: !0}).injector
}

var ba = (() => {
    let e = class e {
        constructor() {
            this.taskId = 0, this.pendingTasks = new Set, this.hasPendingTasks = new Ue(!1)
        }

        get _hasPendingTasks() {
            return this.hasPendingTasks.value
        }

        add() {
            this._hasPendingTasks || this.hasPendingTasks.next(!0);
            let i = this.taskId++;
            return this.pendingTasks.add(i), i
        }

        remove(i) {
            this.pendingTasks.delete(i), this.pendingTasks.size === 0 && this._hasPendingTasks && this.hasPendingTasks.next(!1)
        }

        ngOnDestroy() {
            this.pendingTasks.clear(), this._hasPendingTasks && this.hasPendingTasks.next(!1)
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275prov = B({token: e, factory: e.\u0275fac, providedIn: "root"});
    let t = e;
    return t
})();

function Fg(t) {
    return nd(t) ? Array.isArray(t) || !(t instanceof Map) && Symbol.iterator in t : !1
}

function IC(t, e) {
    if (Array.isArray(t)) for (let n = 0; n < t.length; n++) e(t[n]); else {
        let n = t[Symbol.iterator](), i;
        for (; !(i = n.next()).done;) e(i.value)
    }
}

function nd(t) {
    return t !== null && (typeof t == "function" || typeof t == "object")
}

function Rg(t, e, n) {
    return t[e] = n
}

function MC(t, e) {
    return t[e]
}

function lr(t, e, n) {
    let i = t[e];
    return Object.is(i, n) ? !1 : (t[e] = n, !0)
}

function _C(t) {
    return (t.flags & 32) === 32
}

function TC(t, e, n, i, r, o, s, a, l) {
    let c = e.consts, f = so(e, t, 4, s || null, er(c, a));
    qu(e, n, f, er(c, l)), da(e, f);
    let p = f.tView = Gu(2, f, i, r, o, e.directiveRegistry, e.pipeRegistry, null, e.schemas, c, null);
    return e.queries !== null && (e.queries.template(e, f), p.queries = e.queries.embeddedTView(f)), f
}

function Y(t, e, n, i, r, o, s, a) {
    let l = ve(), c = Xe(), f = t + ln, p = c.firstCreatePass ? TC(f, c, l, e, n, i, r, o, s) : c.data[f];
    hi(p, !1);
    let m = xC(c, l, p, t);
    ca() && ha(c, l, m, p), Fn(m, l);
    let g = Eg(m, l, m, p);
    return l[f] = g, va(l, g), sC(g, p, l), la(p) && Uu(c, l, p), s != null && zu(l, p, a), Y
}

var xC = AC;

function AC(t, e, n, i) {
    return ua(!0), e[Le].createComment("")
}

function Vt(t, e, n, i) {
    let r = ve(), o = Iu();
    if (lr(r, o, e)) {
        let s = Xe(), a = Im();
        pS(a, r, t, e, n, i)
    }
    return Vt
}

function NC(t, e, n, i) {
    return lr(t, Iu(), n) ? e + eo(n) + i : Kt
}

function xs(t, e) {
    return t << 17 | e << 2
}

function fi(t) {
    return t >> 17 & 32767
}

function OC(t) {
    return (t & 2) == 2
}

function PC(t, e) {
    return t & 131071 | e << 17
}

function Jc(t) {
    return t | 2
}

function ir(t) {
    return (t & 131068) >> 2
}

function ac(t, e) {
    return t & -131069 | e << 2
}

function kC(t) {
    return (t & 1) === 1
}

function eu(t) {
    return t | 1
}

function FC(t, e, n, i, r, o) {
    let s = o ? e.classBindings : e.styleBindings, a = fi(s), l = ir(s);
    t[i] = n;
    let c = !1, f;
    if (Array.isArray(n)) {
        let p = n;
        f = p[1], (f === null || no(p, f) > 0) && (c = !0)
    } else f = n;
    if (r) if (l !== 0) {
        let m = fi(t[a + 1]);
        t[i + 1] = xs(m, a), m !== 0 && (t[m + 1] = ac(t[m + 1], i)), t[a + 1] = PC(t[a + 1], i)
    } else t[i + 1] = xs(a, 0), a !== 0 && (t[a + 1] = ac(t[a + 1], i)), a = i; else t[i + 1] = xs(l, 0), a === 0 ? a = i : t[l + 1] = ac(t[l + 1], i), l = i;
    c && (t[i + 1] = Jc(t[i + 1])), Ch(t, f, i, !0), Ch(t, f, i, !1), RC(e, f, t, i, o), s = xs(a, l), o ? e.classBindings = s : e.styleBindings = s
}

function RC(t, e, n, i, r) {
    let o = r ? t.residualClasses : t.residualStyles;
    o != null && typeof e == "string" && no(o, e) >= 0 && (n[i + 1] = eu(n[i + 1]))
}

function Ch(t, e, n, i) {
    let r = t[n + 1], o = e === null, s = i ? fi(r) : ir(r), a = !1;
    for (; s !== 0 && (a === !1 || o);) {
        let l = t[s], c = t[s + 1];
        LC(l, e) && (a = !0, t[s + 1] = i ? eu(c) : Jc(c)), s = i ? fi(c) : ir(c)
    }
    a && (t[n + 1] = i ? Jc(r) : eu(r))
}

function LC(t, e) {
    return t === null || e == null || (Array.isArray(t) ? t[1] : t) === e ? !0 : Array.isArray(t) && typeof e == "string" ? no(t, e) >= 0 : !1
}

var Pt = {textEnd: 0, key: 0, keyEnd: 0, value: 0, valueEnd: 0};

function VC(t) {
    return t.substring(Pt.key, Pt.keyEnd)
}

function jC(t) {
    return $C(t), Lg(t, Vg(t, 0, Pt.textEnd))
}

function Lg(t, e) {
    let n = Pt.textEnd;
    return n === e ? -1 : (e = Pt.keyEnd = BC(t, Pt.key = e, n), Vg(t, e, n))
}

function $C(t) {
    Pt.key = 0, Pt.keyEnd = 0, Pt.value = 0, Pt.valueEnd = 0, Pt.textEnd = t.length
}

function Vg(t, e, n) {
    for (; e < n && t.charCodeAt(e) <= 32;) e++;
    return e
}

function BC(t, e, n) {
    for (; e < n && t.charCodeAt(e) > 32;) e++;
    return e
}

function D(t, e, n) {
    let i = ve(), r = Iu();
    if (lr(i, r, e)) {
        let o = Xe(), s = Im();
        tS(o, s, i, t, e, i[Le], n, !1)
    }
    return D
}

function tu(t, e, n, i, r) {
    let o = e.inputs, s = r ? "class" : "style";
    Wu(t, n, o[s], s, i)
}

function ee(t, e) {
    return UC(t, e, null, !0), ee
}

function lo(t) {
    zC(XC, HC, t, !0)
}

function HC(t, e) {
    for (let n = jC(e); n >= 0; n = Lg(e, n)) gu(t, VC(e), !0)
}

function UC(t, e, n, i) {
    let r = ve(), o = Xe(), s = ym(2);
    if (o.firstUpdatePass && $g(o, t, s, i), e !== Kt && lr(r, s, e)) {
        let a = o.data[mi()];
        Bg(o, a, r, r[Le], t, r[s + 1] = ZC(e, n), i, s)
    }
}

function zC(t, e, n, i) {
    let r = Xe(), o = ym(2);
    r.firstUpdatePass && $g(r, null, o, i);
    let s = ve();
    if (n !== Kt && lr(s, o, n)) {
        let a = r.data[mi()];
        if (Hg(a, i) && !jg(r, o)) {
            let l = i ? a.classesWithoutHost : a.stylesWithoutHost;
            l !== null && (n = fc(l, n || "")), tu(r, a, s, n, i)
        } else KC(r, a, s, s[Le], s[o + 1], s[o + 1] = QC(t, e, n), i, o)
    }
}

function jg(t, e) {
    return e >= t.expandoStartIndex
}

function $g(t, e, n, i) {
    let r = t.data;
    if (r[n + 1] === null) {
        let o = r[mi()], s = jg(t, n);
        Hg(o, i) && e === null && !s && (e = !1), e = GC(r, o, e, i), FC(r, o, e, n, s, i)
    }
}

function GC(t, e, n, i) {
    let r = yE(t), o = i ? e.residualClasses : e.residualStyles;
    if (r === null) (i ? e.classBindings : e.styleBindings) === 0 && (n = lc(null, t, e, n, i), n = Zr(n, e.attrs, i), o = null); else {
        let s = e.directiveStylingLast;
        if (s === -1 || t[s] !== r) if (n = lc(r, t, e, n, i), o === null) {
            let l = qC(t, e, i);
            l !== void 0 && Array.isArray(l) && (l = lc(null, t, e, l[1], i), l = Zr(l, e.attrs, i), WC(t, e, i, l))
        } else o = YC(t, e, i)
    }
    return o !== void 0 && (i ? e.residualClasses = o : e.residualStyles = o), n
}

function qC(t, e, n) {
    let i = n ? e.classBindings : e.styleBindings;
    if (ir(i) !== 0) return t[fi(i)]
}

function WC(t, e, n, i) {
    let r = n ? e.classBindings : e.styleBindings;
    t[fi(r)] = i
}

function YC(t, e, n) {
    let i, r = e.directiveEnd;
    for (let o = 1 + e.directiveStylingLast; o < r; o++) {
        let s = t[o].hostAttrs;
        i = Zr(i, s, n)
    }
    return Zr(i, e.attrs, n)
}

function lc(t, e, n, i, r) {
    let o = null, s = n.directiveEnd, a = n.directiveStylingLast;
    for (a === -1 ? a = n.directiveStart : a++; a < s && (o = e[a], i = Zr(i, o.hostAttrs, r), o !== t);) a++;
    return t !== null && (n.directiveStylingLast = a), i
}

function Zr(t, e, n) {
    let i = n ? 1 : 2, r = -1;
    if (e !== null) for (let o = 0; o < e.length; o++) {
        let s = e[o];
        typeof s == "number" ? r = s : r === i && (Array.isArray(t) || (t = t === void 0 ? [] : ["", t]), gu(t, s, n ? !0 : e[++o]))
    }
    return t === void 0 ? null : t
}

function QC(t, e, n) {
    if (n == null || n === "") return ct;
    let i = [], r = gi(n);
    if (Array.isArray(r)) for (let o = 0; o < r.length; o++) t(i, r[o], !0); else if (typeof r == "object") for (let o in r) r.hasOwnProperty(o) && t(i, o, r[o]); else typeof r == "string" && e(i, r);
    return i
}

function XC(t, e, n) {
    let i = String(e);
    i !== "" && !i.includes(" ") && gu(t, i, n)
}

function KC(t, e, n, i, r, o, s, a) {
    r === Kt && (r = ct);
    let l = 0, c = 0, f = 0 < r.length ? r[0] : null, p = 0 < o.length ? o[0] : null;
    for (; f !== null || p !== null;) {
        let m = l < r.length ? r[l + 1] : void 0, g = c < o.length ? o[c + 1] : void 0, b = null, E;
        f === p ? (l += 2, c += 2, m !== g && (b = p, E = g)) : p === null || f !== null && f < p ? (l += 2, b = f) : (c += 2, b = p, E = g), b !== null && Bg(t, e, n, i, b, E, s, a), f = l < r.length ? r[l] : null, p = c < o.length ? o[c] : null
    }
}

function Bg(t, e, n, i, r, o, s, a) {
    if (!(e.type & 3)) return;
    let l = t.data, c = l[a + 1], f = kC(c) ? Dh(l, e, n, r, ir(c), s) : void 0;
    if (!Zs(f)) {
        Zs(o) || OC(c) && (o = Dh(l, null, n, r, a, s));
        let p = um(mi(), n);
        U1(i, s, p, r, o)
    }
}

function Dh(t, e, n, i, r, o) {
    let s = e === null, a;
    for (; r > 0;) {
        let l = t[r], c = Array.isArray(l), f = c ? l[1] : l, p = f === null, m = n[r + 1];
        m === Kt && (m = p ? ct : void 0);
        let g = p ? Kl(m, i) : f === i ? m : void 0;
        if (c && !Zs(g) && (g = Kl(l, i)), Zs(g) && (a = g, s)) return a;
        let b = t[r + 1];
        r = s ? fi(b) : ir(b)
    }
    if (e !== null) {
        let l = o ? e.residualClasses : e.residualStyles;
        l != null && (a = Kl(l, i))
    }
    return a
}

function Zs(t) {
    return t !== void 0
}

function ZC(t, e) {
    return t == null || t === "" || (typeof e == "string" ? t = t + e : typeof t == "object" && (t = rt(gi(t)))), t
}

function Hg(t, e) {
    return (t.flags & (e ? 8 : 16)) !== 0
}

function JC(t, e, n, i, r, o) {
    let s = e.consts, a = er(s, r), l = so(e, t, 2, i, a);
    return qu(e, n, l, er(s, o)), l.attrs !== null && Qs(l, l.attrs, !1), l.mergedAttrs !== null && Qs(l, l.mergedAttrs, !0), e.queries !== null && e.queries.elementStart(e, l), l
}

function u(t, e, n, i) {
    let r = ve(), o = Xe(), s = ln + t, a = r[Le], l = o.firstCreatePass ? JC(s, o, r, e, n, i) : o.data[s],
        c = eD(o, r, l, a, e, t);
    r[s] = c;
    let f = la(l);
    return hi(l, !0), fg(a, c, l), !_C(l) && ca() && ha(o, r, c, l), aE() === 0 && Fn(c, r), lE(), f && (Uu(o, r, l), Hu(o, l, r)), i !== null && zu(r, l), u
}

function d() {
    let t = ot();
    Du() ? gm() : (t = t.parent, hi(t, !1));
    let e = t;
    dE(e) && fE(), cE();
    let n = Xe();
    return n.firstCreatePass && (da(n, t), Eu(t) && n.queries.elementEnd(t)), e.classesWithoutHost != null && ME(e) && tu(n, e, ve(), e.classesWithoutHost, !0), e.stylesWithoutHost != null && _E(e) && tu(n, e, ve(), e.stylesWithoutHost, !1), d
}

function v(t, e, n, i) {
    return u(t, e, n, i), d(), v
}

var eD = (t, e, n, i, r, o) => (ua(!0), og(i, r, SE()));

function tD(t, e, n, i, r) {
    let o = e.consts, s = er(o, i), a = so(e, t, 8, "ng-container", s);
    s !== null && Qs(a, s, !0);
    let l = er(o, r);
    return qu(e, n, a, l), e.queries !== null && e.queries.elementStart(e, a), a
}

function $n(t, e, n) {
    let i = ve(), r = Xe(), o = t + ln, s = r.firstCreatePass ? tD(o, r, i, e, n) : r.data[o];
    hi(s, !0);
    let a = nD(r, i, s, t);
    return i[o] = a, ca() && ha(r, i, a, s), Fn(a, i), la(s) && (Uu(r, i, s), Hu(r, s, i)), n != null && zu(i, s), $n
}

function Bn() {
    let t = ot(), e = Xe();
    return Du() ? gm() : (t = t.parent, hi(t, !1)), e.firstCreatePass && (da(e, t), Eu(t) && e.queries.elementEnd(t)), Bn
}

var nD = (t, e, n, i) => (ua(!0), I1(e[Le], ""));

function cr() {
    return ve()
}

var Js = "en-US";
var iD = Js;

function rD(t) {
    typeof t == "string" && (iD = t.toLowerCase().replace(/_/g, "-"))
}

function j(t, e, n, i) {
    let r = ve(), o = Xe(), s = ot();
    return sD(o, r, r[Le], s, t, e, i), j
}

function oD(t, e, n, i) {
    let r = t.cleanup;
    if (r != null) for (let o = 0; o < r.length - 1; o += 2) {
        let s = r[o];
        if (s === n && r[o + 1] === i) {
            let a = e[Wr], l = r[o + 2];
            return a.length > l ? a[l] : null
        }
        typeof s == "string" && (o += 2)
    }
    return null
}

function sD(t, e, n, i, r, o, s) {
    let a = la(i), c = t.firstCreatePass && Dg(t), f = e[Ft], p = Cg(e), m = !0;
    if (i.type & 3 || s) {
        let E = Mt(i, e), M = s ? s(E) : E, w = p.length, S = s ? I => s(Yt(I[i.index])) : i.index, C = null;
        if (!s && a && (C = oD(t, e, r, i.index)), C !== null) {
            let I = C.__ngLastListenerFn__ || C;
            I.__ngNextListenerFn__ = o, C.__ngLastListenerFn__ = o, m = !1
        } else {
            o = Mh(i, e, f, o, !1);
            let I = n.listen(M, r, o);
            p.push(o, I), c && c.push(r, S, w, w + 1)
        }
    } else o = Mh(i, e, f, o, !1);
    let g = i.outputs, b;
    if (m && g !== null && (b = g[r])) {
        let E = b.length;
        if (E) for (let M = 0; M < E; M += 2) {
            let w = b[M], S = b[M + 1], O = e[w][S].subscribe(o), U = p.length;
            p.push(o, O), c && c.push(r, i.index, U, -(U + 1))
        }
    }
}

function Ih(t, e, n, i) {
    let r = me(null);
    try {
        return zt(6, e, n), n(i) !== !1
    } catch (o) {
        return Ig(t, o), !1
    } finally {
        zt(7, e, n), me(r)
    }
}

function Mh(t, e, n, i, r) {
    return function o(s) {
        if (s === Function) return i;
        let a = t.componentOffset > -1 ? Ln(t.index, e) : e;
        Qu(a);
        let l = Ih(e, n, i, s), c = o.__ngNextListenerFn__;
        for (; c;) l = Ih(e, n, c, s) && l, c = c.__ngNextListenerFn__;
        return r && l === !1 && s.preventDefault(), l
    }
}

function Je(t = 1) {
    return bE(t)
}

function Ug(t, e, n, i) {
    hC(t, e, n, i)
}

function zg(t) {
    let e = ve(), n = Xe(), i = wm();
    Mu(i + 1);
    let r = ed(n, i);
    if (t.dirty && nE(e) === ((r.metadata.flags & 2) === 2)) {
        if (r.matches === null) t.reset([]); else {
            let o = yC(e, i);
            t.reset(o, $E), t.notifyOnChanges()
        }
        return !0
    }
    return !1
}

function Gg() {
    return fC(ve(), wm())
}

function h(t, e = "") {
    let n = ve(), i = Xe(), r = t + ln, o = i.firstCreatePass ? so(i, r, 1, e, null) : i.data[r], s = aD(i, n, o, e, t);
    n[r] = s, ca() && ha(i, n, s, o), hi(o, !1)
}

var aD = (t, e, n, i, r) => (ua(!0), C1(e[Le], i));

function $(t) {
    return ye("", t, ""), $
}

function ye(t, e, n) {
    let i = ve(), r = NC(i, t, e, n);
    return r !== Kt && vS(i, mi(), r), ye
}

function lD(t, e, n) {
    let i = Xe();
    if (i.firstCreatePass) {
        let r = kn(t);
        nu(n, i.data, i.blueprint, r, !0), nu(e, i.data, i.blueprint, r, !1)
    }
}

function nu(t, e, n, i, r) {
    if (t = it(t), Array.isArray(t)) for (let o = 0; o < t.length; o++) nu(t[o], e, n, i, r); else {
        let o = Xe(), s = ve(), a = ot(), l = Ki(t) ? t : it(t.provide), c = tm(t), f = a.providerIndexes & 1048575,
            p = a.directiveStart, m = a.providerIndexes >> 20;
        if (Ki(t) || !t.multi) {
            let g = new ai(c, r, P), b = uc(l, e, r ? f : f + m, p);
            b === -1 ? (Dc(zs(a, s), o, l), cc(o, t, e.length), e.push(l), a.directiveStart++, a.directiveEnd++, r && (a.providerIndexes += 1048576), n.push(g), s.push(g)) : (n[b] = g, s[b] = g)
        } else {
            let g = uc(l, e, f + m, p), b = uc(l, e, f, f + m), E = g >= 0 && n[g], M = b >= 0 && n[b];
            if (r && !M || !r && !E) {
                Dc(zs(a, s), o, l);
                let w = dD(r ? uD : cD, n.length, r, i, c);
                !r && M && (n[b].providerFactory = w), cc(o, t, e.length, 0), e.push(l), a.directiveStart++, a.directiveEnd++, r && (a.providerIndexes += 1048576), n.push(w), s.push(w)
            } else {
                let w = qg(n[r ? b : g], c, !r && i);
                cc(o, t, g > -1 ? g : b, w)
            }
            !r && i && M && n[b].componentProviders++
        }
    }
}

function cc(t, e, n, i) {
    let r = Ki(e), o = $b(e);
    if (r || o) {
        let l = (o ? it(e.useClass) : e).prototype.ngOnDestroy;
        if (l) {
            let c = t.destroyHooks || (t.destroyHooks = []);
            if (!r && e.multi) {
                let f = c.indexOf(n);
                f === -1 ? c.push(n, [i, l]) : c[f + 1].push(i, l)
            } else c.push(n, l)
        }
    }
}

function qg(t, e, n) {
    return n && t.componentProviders++, t.multi.push(e) - 1
}

function uc(t, e, n, i) {
    for (let r = n; r < i; r++) if (e[r] === t) return r;
    return -1
}

function cD(t, e, n, i) {
    return iu(this.multi, [])
}

function uD(t, e, n, i) {
    let r = this.multi, o;
    if (this.providerFactory) {
        let s = this.providerFactory.componentProviders, a = li(n, n[re], this.providerFactory.index, i);
        o = a.slice(0, s), iu(r, o);
        for (let l = s; l < a.length; l++) o.push(a[l])
    } else o = [], iu(r, o);
    return o
}

function iu(t, e) {
    for (let n = 0; n < t.length; n++) {
        let i = t[n];
        e.push(i())
    }
    return e
}

function dD(t, e, n, i, r) {
    let o = new ai(t, n, P);
    return o.multi = [], o.index = e, o.componentProviders = 0, qg(o, r, i && !n), o
}

function co(t, e = []) {
    return n => {
        n.providersResolver = (i, r) => lD(i, r ? r(t) : t, e)
    }
}

var fD = (() => {
    let e = class e {
        constructor(i) {
            this._injector = i, this.cachedInjectors = new Map
        }

        getOrCreateStandaloneInjector(i) {
            if (!i.standalone) return null;
            if (!this.cachedInjectors.has(i)) {
                let r = Zh(!1, i.type), o = r.length > 0 ? wa([r], this._injector, `Standalone[${i.type.name}]`) : null;
                this.cachedInjectors.set(i, o)
            }
            return this.cachedInjectors.get(i)
        }

        ngOnDestroy() {
            try {
                for (let i of this.cachedInjectors.values()) i !== null && i.destroy()
            } finally {
                this.cachedInjectors.clear()
            }
        }
    };
    e.\u0275prov = B({token: e, providedIn: "environment", factory: () => new e(X(gt))});
    let t = e;
    return t
})();

function x(t) {
    ao("NgStandalone"), t.getStandaloneInjector = e => e.get(fD).getOrCreateStandaloneInjector(t)
}

function se(t, e, n) {
    let i = vm() + t, r = ve();
    return r[i] === Kt ? Rg(r, i, n ? e.call(n) : e()) : MC(r, i)
}

function bn(t, e, n, i) {
    return hD(ve(), vm(), t, e, n, i)
}

function pD(t, e) {
    let n = t[e];
    return n === Kt ? void 0 : n
}

function hD(t, e, n, i, r, o) {
    let s = e + n;
    return lr(t, s, r) ? Rg(t, s + 1, o ? i.call(o, r) : i(r)) : pD(t, s + 1)
}

var Ea = (() => {
    let e = class e {
        log(i) {
            console.log(i)
        }

        warn(i) {
            console.warn(i)
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275prov = B({token: e, factory: e.\u0275fac, providedIn: "platform"});
    let t = e;
    return t
})();
var Wg = new Z("");

function vi(t) {
    return !!t && typeof t.then == "function"
}

function Yg(t) {
    return !!t && typeof t.subscribe == "function"
}

var Sa = new Z(""), Qg = (() => {
    let e = class e {
        constructor() {
            this.initialized = !1, this.done = !1, this.donePromise = new Promise((i, r) => {
                this.resolve = i, this.reject = r
            }), this.appInits = N(Sa, {optional: !0}) ?? []
        }

        runInitializers() {
            if (this.initialized) return;
            let i = [];
            for (let o of this.appInits) {
                let s = o();
                if (vi(s)) i.push(s); else if (Yg(s)) {
                    let a = new Promise((l, c) => {
                        s.subscribe({complete: l, error: c})
                    });
                    i.push(a)
                }
            }
            let r = () => {
                this.done = !0, this.resolve()
            };
            Promise.all(i).then(() => {
                r()
            }).catch(o => {
                this.reject(o)
            }), i.length === 0 && r(), this.initialized = !0
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275prov = B({token: e, factory: e.\u0275fac, providedIn: "root"});
    let t = e;
    return t
})(), Ca = new Z("");

function mD() {
    vp(() => {
        throw new _(600, !1)
    })
}

function gD(t) {
    return t.isBoundToModule
}

function vD(t, e, n) {
    try {
        let i = n();
        return vi(i) ? i.catch(r => {
            throw e.runOutsideAngular(() => t.handleError(r)), r
        }) : i
    } catch (i) {
        throw e.runOutsideAngular(() => t.handleError(i)), i
    }
}

var uo = (() => {
    let e = class e {
        constructor() {
            this._bootstrapListeners = [], this._runningTick = !1, this._destroyed = !1, this._destroyListeners = [], this._views = [], this.internalErrorHandler = N(Vm), this.afterRenderEffectManager = N(Ju), this.externalTestViews = new Set, this.beforeRender = new Qe, this.afterTick = new Qe, this.componentTypes = [], this.components = [], this.isStable = N(ba).hasPendingTasks.pipe(ie(i => !i)), this._injector = N(gt)
        }

        get destroyed() {
            return this._destroyed
        }

        get injector() {
            return this._injector
        }

        bootstrap(i, r) {
            let o = i instanceof Ys;
            if (!this._injector.get(Qg).done) {
                let g = !o && Yh(i), b = !1;
                throw new _(405, b)
            }
            let a;
            o ? a = i : a = this._injector.get(ya).resolveComponentFactory(i), this.componentTypes.push(a.componentType);
            let l = gD(a) ? void 0 : this._injector.get(Rn), c = r || a.selector, f = a.create(vn.NULL, [], c, l),
                p = f.location.nativeElement, m = f.injector.get(Wg, null);
            return m?.registerApplication(p), f.onDestroy(() => {
                this.detachView(f.hostView), dc(this.components, f), m?.unregisterApplication(p)
            }), this._loadComponent(f), f
        }

        tick() {
            this._tick(!0)
        }

        _tick(i) {
            if (this._runningTick) throw new _(101, !1);
            let r = me(null);
            try {
                this._runningTick = !0, this.detectChangesInAttachedViews(i)
            } catch (o) {
                this.internalErrorHandler(o)
            } finally {
                this.afterTick.next(), this._runningTick = !1, me(r)
            }
        }

        detectChangesInAttachedViews(i) {
            let r = 0, o = this.afterRenderEffectManager;
            for (; ;) {
                if (r === _g) throw new _(103, !1);
                if (i) {
                    let s = r === 0;
                    this.beforeRender.next(s);
                    for (let {_lView: a, notifyErrorHandler: l} of this._views) yD(a, s, l)
                }
                if (r++, o.executeInternalCallbacks(), ![...this.externalTestViews.keys(), ...this._views].some(({_lView: s}) => ru(s)) && (o.execute(), ![...this.externalTestViews.keys(), ...this._views].some(({_lView: s}) => ru(s)))) break
            }
        }

        attachView(i) {
            let r = i;
            this._views.push(r), r.attachToAppRef(this)
        }

        detachView(i) {
            let r = i;
            dc(this._views, r), r.detachFromAppRef()
        }

        _loadComponent(i) {
            this.attachView(i.hostView), this.tick(), this.components.push(i);
            let r = this._injector.get(Ca, []);
            [...this._bootstrapListeners, ...r].forEach(o => o(i))
        }

        ngOnDestroy() {
            if (!this._destroyed) try {
                this._destroyListeners.forEach(i => i()), this._views.slice().forEach(i => i.destroy())
            } finally {
                this._destroyed = !0, this._views = [], this._bootstrapListeners = [], this._destroyListeners = []
            }
        }

        onDestroy(i) {
            return this._destroyListeners.push(i), () => dc(this._destroyListeners, i)
        }

        destroy() {
            if (this._destroyed) throw new _(406, !1);
            let i = this._injector;
            i.destroy && !i.destroyed && i.destroy()
        }

        get viewCount() {
            return this._views.length
        }

        warnIfDestroyed() {
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275prov = B({token: e, factory: e.\u0275fac, providedIn: "root"});
    let t = e;
    return t
})();

function dc(t, e) {
    let n = t.indexOf(e);
    n > -1 && t.splice(n, 1)
}

function yD(t, e, n) {
    !e && !ru(t) || wD(t, n, e)
}

function ru(t) {
    return Cu(t)
}

function wD(t, e, n) {
    let i;
    n ? (i = 0, t[K] |= 1024) : t[K] & 64 ? i = 0 : i = 1, Tg(t, e, i)
}

var ou = class {
    constructor(e, n) {
        this.ngModuleFactory = e, this.componentFactories = n
    }
}, Da = (() => {
    let e = class e {
        compileModuleSync(i) {
            return new Zc(i)
        }

        compileModuleAsync(i) {
            return Promise.resolve(this.compileModuleSync(i))
        }

        compileModuleAndAllComponentsSync(i) {
            let r = this.compileModuleSync(i), o = Qh(i), s = rg(o.declarations).reduce((a, l) => {
                let c = Pn(l);
                return c && a.push(new nr(c)), a
            }, []);
            return new ou(r, s)
        }

        compileModuleAndAllComponentsAsync(i) {
            return Promise.resolve(this.compileModuleAndAllComponentsSync(i))
        }

        clearCache() {
        }

        clearCacheFor(i) {
        }

        getModuleId(i) {
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275prov = B({token: e, factory: e.\u0275fac, providedIn: "root"});
    let t = e;
    return t
})();
var bD = (() => {
    let e = class e {
        constructor() {
            this.zone = N(Ie), this.applicationRef = N(uo)
        }

        initialize() {
            this._onMicrotaskEmptySubscription || (this._onMicrotaskEmptySubscription = this.zone.onMicrotaskEmpty.subscribe({
                next: () => {
                    this.zone.run(() => {
                        this.applicationRef.tick()
                    })
                }
            }))
        }

        ngOnDestroy() {
            this._onMicrotaskEmptySubscription?.unsubscribe()
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275prov = B({token: e, factory: e.\u0275fac, providedIn: "root"});
    let t = e;
    return t
})();

function ED(t) {
    return [{provide: Ie, useFactory: t}, {
        provide: Xi, multi: !0, useFactory: () => {
            let e = N(bD, {optional: !0});
            return () => e.initialize()
        }
    }, {
        provide: Xi, multi: !0, useFactory: () => {
            let e = N(ID);
            return () => {
                e.initialize()
            }
        }
    }, {provide: Vm, useFactory: SD}]
}

function SD() {
    let t = N(Ie), e = N(Qt);
    return n => t.runOutsideAngular(() => e.handleError(n))
}

function CD(t) {
    let e = ED(() => new Ie(DD(t)));
    return ra([[], e])
}

function DD(t) {
    return {
        enableLongStackTrace: !1,
        shouldCoalesceEventChangeDetection: t?.eventCoalescing ?? !1,
        shouldCoalesceRunChangeDetection: t?.runCoalescing ?? !1
    }
}

var ID = (() => {
    let e = class e {
        constructor() {
            this.subscription = new Re, this.initialized = !1, this.zone = N(Ie), this.pendingTasks = N(ba)
        }

        initialize() {
            if (this.initialized) return;
            this.initialized = !0;
            let i = null;
            !this.zone.isStable && !this.zone.hasPendingMacrotasks && !this.zone.hasPendingMicrotasks && (i = this.pendingTasks.add()), this.zone.runOutsideAngular(() => {
                this.subscription.add(this.zone.onStable.subscribe(() => {
                    Ie.assertNotInAngularZone(), queueMicrotask(() => {
                        i !== null && !this.zone.hasPendingMacrotasks && !this.zone.hasPendingMicrotasks && (this.pendingTasks.remove(i), i = null)
                    })
                }))
            }), this.subscription.add(this.zone.onUnstable.subscribe(() => {
                Ie.assertInAngularZone(), i ??= this.pendingTasks.add()
            }))
        }

        ngOnDestroy() {
            this.subscription.unsubscribe()
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275prov = B({token: e, factory: e.\u0275fac, providedIn: "root"});
    let t = e;
    return t
})();

function MD() {
    return typeof $localize < "u" && $localize.locale || Js
}

var id = new Z("", {providedIn: "root", factory: () => N(id, oe.Optional | oe.SkipSelf) || MD()});
var Xg = new Z("");
var Fs = null;

function _D(t = [], e) {
    return vn.create({
        name: e,
        providers: [{provide: oa, useValue: "platform"}, {provide: Xg, useValue: new Set([() => Fs = null])}, ...t]
    })
}

function TD(t = []) {
    if (Fs) return Fs;
    let e = _D(t);
    return Fs = e, mD(), xD(e), e
}

function xD(t) {
    t.get(Pu, null)?.forEach(n => n())
}

var yi = (() => {
    let e = class e {
    };
    e.__NG_ELEMENT_ID__ = AD;
    let t = e;
    return t
})();

function AD(t) {
    return ND(ot(), ve(), (t & 16) === 16)
}

function ND(t, e, n) {
    if (aa(t) && !n) {
        let i = Ln(t.index, e);
        return new ci(i, i)
    } else if (t.type & 47) {
        let i = e[Wt];
        return new ci(i, e)
    }
    return null
}

var su = class {
    constructor() {
    }

    supports(e) {
        return Fg(e)
    }

    create(e) {
        return new au(e)
    }
}, OD = (t, e) => e, au = class {
    constructor(e) {
        this.length = 0, this._linkedRecords = null, this._unlinkedRecords = null, this._previousItHead = null, this._itHead = null, this._itTail = null, this._additionsHead = null, this._additionsTail = null, this._movesHead = null, this._movesTail = null, this._removalsHead = null, this._removalsTail = null, this._identityChangesHead = null, this._identityChangesTail = null, this._trackByFn = e || OD
    }

    forEachItem(e) {
        let n;
        for (n = this._itHead; n !== null; n = n._next) e(n)
    }

    forEachOperation(e) {
        let n = this._itHead, i = this._removalsHead, r = 0, o = null;
        for (; n || i;) {
            let s = !i || n && n.currentIndex < _h(i, r, o) ? n : i, a = _h(s, r, o), l = s.currentIndex;
            if (s === i) r--, i = i._nextRemoved; else if (n = n._next, s.previousIndex == null) r++; else {
                o || (o = []);
                let c = a - r, f = l - r;
                if (c != f) {
                    for (let m = 0; m < c; m++) {
                        let g = m < o.length ? o[m] : o[m] = 0, b = g + m;
                        f <= b && b < c && (o[m] = g + 1)
                    }
                    let p = s.previousIndex;
                    o[p] = f - c
                }
            }
            a !== l && e(s, a, l)
        }
    }

    forEachPreviousItem(e) {
        let n;
        for (n = this._previousItHead; n !== null; n = n._nextPrevious) e(n)
    }

    forEachAddedItem(e) {
        let n;
        for (n = this._additionsHead; n !== null; n = n._nextAdded) e(n)
    }

    forEachMovedItem(e) {
        let n;
        for (n = this._movesHead; n !== null; n = n._nextMoved) e(n)
    }

    forEachRemovedItem(e) {
        let n;
        for (n = this._removalsHead; n !== null; n = n._nextRemoved) e(n)
    }

    forEachIdentityChange(e) {
        let n;
        for (n = this._identityChangesHead; n !== null; n = n._nextIdentityChange) e(n)
    }

    diff(e) {
        if (e == null && (e = []), !Fg(e)) throw new _(900, !1);
        return this.check(e) ? this : null
    }

    onDestroy() {
    }

    check(e) {
        this._reset();
        let n = this._itHead, i = !1, r, o, s;
        if (Array.isArray(e)) {
            this.length = e.length;
            for (let a = 0; a < this.length; a++) o = e[a], s = this._trackByFn(a, o), n === null || !Object.is(n.trackById, s) ? (n = this._mismatch(n, o, s, a), i = !0) : (i && (n = this._verifyReinsertion(n, o, s, a)), Object.is(n.item, o) || this._addIdentityChange(n, o)), n = n._next
        } else r = 0, IC(e, a => {
            s = this._trackByFn(r, a), n === null || !Object.is(n.trackById, s) ? (n = this._mismatch(n, a, s, r), i = !0) : (i && (n = this._verifyReinsertion(n, a, s, r)), Object.is(n.item, a) || this._addIdentityChange(n, a)), n = n._next, r++
        }), this.length = r;
        return this._truncate(n), this.collection = e, this.isDirty
    }

    get isDirty() {
        return this._additionsHead !== null || this._movesHead !== null || this._removalsHead !== null || this._identityChangesHead !== null
    }

    _reset() {
        if (this.isDirty) {
            let e;
            for (e = this._previousItHead = this._itHead; e !== null; e = e._next) e._nextPrevious = e._next;
            for (e = this._additionsHead; e !== null; e = e._nextAdded) e.previousIndex = e.currentIndex;
            for (this._additionsHead = this._additionsTail = null, e = this._movesHead; e !== null; e = e._nextMoved) e.previousIndex = e.currentIndex;
            this._movesHead = this._movesTail = null, this._removalsHead = this._removalsTail = null, this._identityChangesHead = this._identityChangesTail = null
        }
    }

    _mismatch(e, n, i, r) {
        let o;
        return e === null ? o = this._itTail : (o = e._prev, this._remove(e)), e = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(i, null), e !== null ? (Object.is(e.item, n) || this._addIdentityChange(e, n), this._reinsertAfter(e, o, r)) : (e = this._linkedRecords === null ? null : this._linkedRecords.get(i, r), e !== null ? (Object.is(e.item, n) || this._addIdentityChange(e, n), this._moveAfter(e, o, r)) : e = this._addAfter(new lu(n, i), o, r)), e
    }

    _verifyReinsertion(e, n, i, r) {
        let o = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(i, null);
        return o !== null ? e = this._reinsertAfter(o, e._prev, r) : e.currentIndex != r && (e.currentIndex = r, this._addToMoves(e, r)), e
    }

    _truncate(e) {
        for (; e !== null;) {
            let n = e._next;
            this._addToRemovals(this._unlink(e)), e = n
        }
        this._unlinkedRecords !== null && this._unlinkedRecords.clear(), this._additionsTail !== null && (this._additionsTail._nextAdded = null), this._movesTail !== null && (this._movesTail._nextMoved = null), this._itTail !== null && (this._itTail._next = null), this._removalsTail !== null && (this._removalsTail._nextRemoved = null), this._identityChangesTail !== null && (this._identityChangesTail._nextIdentityChange = null)
    }

    _reinsertAfter(e, n, i) {
        this._unlinkedRecords !== null && this._unlinkedRecords.remove(e);
        let r = e._prevRemoved, o = e._nextRemoved;
        return r === null ? this._removalsHead = o : r._nextRemoved = o, o === null ? this._removalsTail = r : o._prevRemoved = r, this._insertAfter(e, n, i), this._addToMoves(e, i), e
    }

    _moveAfter(e, n, i) {
        return this._unlink(e), this._insertAfter(e, n, i), this._addToMoves(e, i), e
    }

    _addAfter(e, n, i) {
        return this._insertAfter(e, n, i), this._additionsTail === null ? this._additionsTail = this._additionsHead = e : this._additionsTail = this._additionsTail._nextAdded = e, e
    }

    _insertAfter(e, n, i) {
        let r = n === null ? this._itHead : n._next;
        return e._next = r, e._prev = n, r === null ? this._itTail = e : r._prev = e, n === null ? this._itHead = e : n._next = e, this._linkedRecords === null && (this._linkedRecords = new ea), this._linkedRecords.put(e), e.currentIndex = i, e
    }

    _remove(e) {
        return this._addToRemovals(this._unlink(e))
    }

    _unlink(e) {
        this._linkedRecords !== null && this._linkedRecords.remove(e);
        let n = e._prev, i = e._next;
        return n === null ? this._itHead = i : n._next = i, i === null ? this._itTail = n : i._prev = n, e
    }

    _addToMoves(e, n) {
        return e.previousIndex === n || (this._movesTail === null ? this._movesTail = this._movesHead = e : this._movesTail = this._movesTail._nextMoved = e), e
    }

    _addToRemovals(e) {
        return this._unlinkedRecords === null && (this._unlinkedRecords = new ea), this._unlinkedRecords.put(e), e.currentIndex = null, e._nextRemoved = null, this._removalsTail === null ? (this._removalsTail = this._removalsHead = e, e._prevRemoved = null) : (e._prevRemoved = this._removalsTail, this._removalsTail = this._removalsTail._nextRemoved = e), e
    }

    _addIdentityChange(e, n) {
        return e.item = n, this._identityChangesTail === null ? this._identityChangesTail = this._identityChangesHead = e : this._identityChangesTail = this._identityChangesTail._nextIdentityChange = e, e
    }
}, lu = class {
    constructor(e, n) {
        this.item = e, this.trackById = n, this.currentIndex = null, this.previousIndex = null, this._nextPrevious = null, this._prev = null, this._next = null, this._prevDup = null, this._nextDup = null, this._prevRemoved = null, this._nextRemoved = null, this._nextAdded = null, this._nextMoved = null, this._nextIdentityChange = null
    }
}, cu = class {
    constructor() {
        this._head = null, this._tail = null
    }

    add(e) {
        this._head === null ? (this._head = this._tail = e, e._nextDup = null, e._prevDup = null) : (this._tail._nextDup = e, e._prevDup = this._tail, e._nextDup = null, this._tail = e)
    }

    get(e, n) {
        let i;
        for (i = this._head; i !== null; i = i._nextDup) if ((n === null || n <= i.currentIndex) && Object.is(i.trackById, e)) return i;
        return null
    }

    remove(e) {
        let n = e._prevDup, i = e._nextDup;
        return n === null ? this._head = i : n._nextDup = i, i === null ? this._tail = n : i._prevDup = n, this._head === null
    }
}, ea = class {
    constructor() {
        this.map = new Map
    }

    put(e) {
        let n = e.trackById, i = this.map.get(n);
        i || (i = new cu, this.map.set(n, i)), i.add(e)
    }

    get(e, n) {
        let i = e, r = this.map.get(i);
        return r ? r.get(e, n) : null
    }

    remove(e) {
        let n = e.trackById;
        return this.map.get(n).remove(e) && this.map.delete(n), e
    }

    get isEmpty() {
        return this.map.size === 0
    }

    clear() {
        this.map.clear()
    }
};

function _h(t, e, n) {
    let i = t.previousIndex;
    if (i === null) return i;
    let r = 0;
    return n && i < n.length && (r = n[i]), i + e + r
}

var uu = class {
    constructor() {
    }

    supports(e) {
        return e instanceof Map || nd(e)
    }

    create() {
        return new du
    }
}, du = class {
    constructor() {
        this._records = new Map, this._mapHead = null, this._appendAfter = null, this._previousMapHead = null, this._changesHead = null, this._changesTail = null, this._additionsHead = null, this._additionsTail = null, this._removalsHead = null, this._removalsTail = null
    }

    get isDirty() {
        return this._additionsHead !== null || this._changesHead !== null || this._removalsHead !== null
    }

    forEachItem(e) {
        let n;
        for (n = this._mapHead; n !== null; n = n._next) e(n)
    }

    forEachPreviousItem(e) {
        let n;
        for (n = this._previousMapHead; n !== null; n = n._nextPrevious) e(n)
    }

    forEachChangedItem(e) {
        let n;
        for (n = this._changesHead; n !== null; n = n._nextChanged) e(n)
    }

    forEachAddedItem(e) {
        let n;
        for (n = this._additionsHead; n !== null; n = n._nextAdded) e(n)
    }

    forEachRemovedItem(e) {
        let n;
        for (n = this._removalsHead; n !== null; n = n._nextRemoved) e(n)
    }

    diff(e) {
        if (!e) e = new Map; else if (!(e instanceof Map || nd(e))) throw new _(900, !1);
        return this.check(e) ? this : null
    }

    onDestroy() {
    }

    check(e) {
        this._reset();
        let n = this._mapHead;
        if (this._appendAfter = null, this._forEach(e, (i, r) => {
            if (n && n.key === r) this._maybeAddToChanges(n, i), this._appendAfter = n, n = n._next; else {
                let o = this._getOrCreateRecordForKey(r, i);
                n = this._insertBeforeOrAppend(n, o)
            }
        }), n) {
            n._prev && (n._prev._next = null), this._removalsHead = n;
            for (let i = n; i !== null; i = i._nextRemoved) i === this._mapHead && (this._mapHead = null), this._records.delete(i.key), i._nextRemoved = i._next, i.previousValue = i.currentValue, i.currentValue = null, i._prev = null, i._next = null
        }
        return this._changesTail && (this._changesTail._nextChanged = null), this._additionsTail && (this._additionsTail._nextAdded = null), this.isDirty
    }

    _insertBeforeOrAppend(e, n) {
        if (e) {
            let i = e._prev;
            return n._next = e, n._prev = i, e._prev = n, i && (i._next = n), e === this._mapHead && (this._mapHead = n), this._appendAfter = e, e
        }
        return this._appendAfter ? (this._appendAfter._next = n, n._prev = this._appendAfter) : this._mapHead = n, this._appendAfter = n, null
    }

    _getOrCreateRecordForKey(e, n) {
        if (this._records.has(e)) {
            let r = this._records.get(e);
            this._maybeAddToChanges(r, n);
            let o = r._prev, s = r._next;
            return o && (o._next = s), s && (s._prev = o), r._next = null, r._prev = null, r
        }
        let i = new fu(e);
        return this._records.set(e, i), i.currentValue = n, this._addToAdditions(i), i
    }

    _reset() {
        if (this.isDirty) {
            let e;
            for (this._previousMapHead = this._mapHead, e = this._previousMapHead; e !== null; e = e._next) e._nextPrevious = e._next;
            for (e = this._changesHead; e !== null; e = e._nextChanged) e.previousValue = e.currentValue;
            for (e = this._additionsHead; e != null; e = e._nextAdded) e.previousValue = e.currentValue;
            this._changesHead = this._changesTail = null, this._additionsHead = this._additionsTail = null, this._removalsHead = null
        }
    }

    _maybeAddToChanges(e, n) {
        Object.is(n, e.currentValue) || (e.previousValue = e.currentValue, e.currentValue = n, this._addToChanges(e))
    }

    _addToAdditions(e) {
        this._additionsHead === null ? this._additionsHead = this._additionsTail = e : (this._additionsTail._nextAdded = e, this._additionsTail = e)
    }

    _addToChanges(e) {
        this._changesHead === null ? this._changesHead = this._changesTail = e : (this._changesTail._nextChanged = e, this._changesTail = e)
    }

    _forEach(e, n) {
        e instanceof Map ? e.forEach(n) : Object.keys(e).forEach(i => n(e[i], i))
    }
}, fu = class {
    constructor(e) {
        this.key = e, this.previousValue = null, this.currentValue = null, this._nextPrevious = null, this._next = null, this._prev = null, this._nextAdded = null, this._nextRemoved = null, this._nextChanged = null
    }
};

function Th() {
    return new rd([new su])
}

var rd = (() => {
    let e = class e {
        constructor(i) {
            this.factories = i
        }

        static create(i, r) {
            if (r != null) {
                let o = r.factories.slice();
                i = i.concat(o)
            }
            return new e(i)
        }

        static extend(i) {
            return {provide: e, useFactory: r => e.create(i, r || Th()), deps: [[e, new ia, new to]]}
        }

        find(i) {
            let r = this.factories.find(o => o.supports(i));
            if (r != null) return r;
            throw new _(901, !1)
        }
    };
    e.\u0275prov = B({token: e, providedIn: "root", factory: Th});
    let t = e;
    return t
})();

function xh() {
    return new od([new uu])
}

var od = (() => {
    let e = class e {
        constructor(i) {
            this.factories = i
        }

        static create(i, r) {
            if (r) {
                let o = r.factories.slice();
                i = i.concat(o)
            }
            return new e(i)
        }

        static extend(i) {
            return {provide: e, useFactory: r => e.create(i, r || xh()), deps: [[e, new ia, new to]]}
        }

        find(i) {
            let r = this.factories.find(o => o.supports(i));
            if (r) return r;
            throw new _(901, !1)
        }
    };
    e.\u0275prov = B({token: e, providedIn: "root", factory: xh});
    let t = e;
    return t
})();

function Kg(t) {
    try {
        let {rootComponent: e, appProviders: n, platformProviders: i} = t, r = TD(i), o = [CD(), ...n || []],
            a = new Ks({providers: o, parent: r, debugName: "", runEnvironmentInitializers: !1}).injector,
            l = a.get(Ie);
        return l.run(() => {
            a.resolveInjectorInitializers();
            let c = a.get(Qt, null), f;
            l.runOutsideAngular(() => {
                f = l.onError.subscribe({
                    next: g => {
                        c.handleError(g)
                    }
                })
            });
            let p = () => a.destroy(), m = r.get(Xg);
            return m.add(p), a.onDestroy(() => {
                f.unsubscribe(), m.delete(p)
            }), vD(c, l, () => {
                let g = a.get(Qg);
                return g.runInitializers(), g.donePromise.then(() => {
                    let b = a.get(id, Js);
                    rD(b || Js);
                    let E = a.get(uo);
                    return e !== void 0 && E.bootstrap(e), E
                })
            })
        })
    } catch (e) {
        return Promise.reject(e)
    }
}

function ur(t) {
    return typeof t == "boolean" ? t : t != null && t !== "false"
}

function Zg(t) {
    let e = Pn(t);
    if (!e) return null;
    let n = new nr(e);
    return {
        get selector() {
            return n.selector
        }, get type() {
            return n.componentType
        }, get inputs() {
            return n.inputs
        }, get outputs() {
            return n.outputs
        }, get ngContentSelectors() {
            return n.ngContentSelectors
        }, get isStandalone() {
            return e.standalone
        }, get isSignal() {
            return e.signals
        }
    }
}

var rv = null;

function Sn() {
    return rv
}

function ov(t) {
    rv ??= t
}

var Ia = class {
};
var et = new Z(""), fd = (() => {
    let e = class e {
        historyGo(i) {
            throw new Error("")
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275prov = B({token: e, factory: () => N(PD), providedIn: "platform"});
    let t = e;
    return t
})(), sv = new Z(""), PD = (() => {
    let e = class e extends fd {
        constructor() {
            super(), this._doc = N(et), this._location = window.location, this._history = window.history
        }

        getBaseHrefFromDOM() {
            return Sn().getBaseHref(this._doc)
        }

        onPopState(i) {
            let r = Sn().getGlobalEventTarget(this._doc, "window");
            return r.addEventListener("popstate", i, !1), () => r.removeEventListener("popstate", i)
        }

        onHashChange(i) {
            let r = Sn().getGlobalEventTarget(this._doc, "window");
            return r.addEventListener("hashchange", i, !1), () => r.removeEventListener("hashchange", i)
        }

        get href() {
            return this._location.href
        }

        get protocol() {
            return this._location.protocol
        }

        get hostname() {
            return this._location.hostname
        }

        get port() {
            return this._location.port
        }

        get pathname() {
            return this._location.pathname
        }

        get search() {
            return this._location.search
        }

        get hash() {
            return this._location.hash
        }

        set pathname(i) {
            this._location.pathname = i
        }

        pushState(i, r, o) {
            this._history.pushState(i, r, o)
        }

        replaceState(i, r, o) {
            this._history.replaceState(i, r, o)
        }

        forward() {
            this._history.forward()
        }

        back() {
            this._history.back()
        }

        historyGo(i = 0) {
            this._history.go(i)
        }

        getState() {
            return this._history.state
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275prov = B({token: e, factory: () => new e, providedIn: "platform"});
    let t = e;
    return t
})();

function pd(t, e) {
    if (t.length == 0) return e;
    if (e.length == 0) return t;
    let n = 0;
    return t.endsWith("/") && n++, e.startsWith("/") && n++, n == 2 ? t + e.substring(1) : n == 1 ? t + e : t + "/" + e
}

function Jg(t) {
    let e = t.match(/#|\?|$/), n = e && e.index || t.length, i = n - (t[n - 1] === "/" ? 1 : 0);
    return t.slice(0, i) + t.slice(n)
}

function En(t) {
    return t && t[0] !== "?" ? "?" + t : t
}

var Cn = (() => {
    let e = class e {
        historyGo(i) {
            throw new Error("")
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275prov = B({token: e, factory: () => N(hd), providedIn: "root"});
    let t = e;
    return t
})(), av = new Z(""), hd = (() => {
    let e = class e extends Cn {
        constructor(i, r) {
            super(), this._platformLocation = i, this._removeListenerFns = [], this._baseHref = r ?? this._platformLocation.getBaseHrefFromDOM() ?? N(et).location?.origin ?? ""
        }

        ngOnDestroy() {
            for (; this._removeListenerFns.length;) this._removeListenerFns.pop()()
        }

        onPopState(i) {
            this._removeListenerFns.push(this._platformLocation.onPopState(i), this._platformLocation.onHashChange(i))
        }

        getBaseHref() {
            return this._baseHref
        }

        prepareExternalUrl(i) {
            return pd(this._baseHref, i)
        }

        path(i = !1) {
            let r = this._platformLocation.pathname + En(this._platformLocation.search),
                o = this._platformLocation.hash;
            return o && i ? `${r}${o}` : r
        }

        pushState(i, r, o, s) {
            let a = this.prepareExternalUrl(o + En(s));
            this._platformLocation.pushState(i, r, a)
        }

        replaceState(i, r, o, s) {
            let a = this.prepareExternalUrl(o + En(s));
            this._platformLocation.replaceState(i, r, a)
        }

        forward() {
            this._platformLocation.forward()
        }

        back() {
            this._platformLocation.back()
        }

        getState() {
            return this._platformLocation.getState()
        }

        historyGo(i = 0) {
            this._platformLocation.historyGo?.(i)
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)(X(fd), X(av, 8))
    }, e.\u0275prov = B({token: e, factory: e.\u0275fac, providedIn: "root"});
    let t = e;
    return t
})(), lv = (() => {
    let e = class e extends Cn {
        constructor(i, r) {
            super(), this._platformLocation = i, this._baseHref = "", this._removeListenerFns = [], r != null && (this._baseHref = r)
        }

        ngOnDestroy() {
            for (; this._removeListenerFns.length;) this._removeListenerFns.pop()()
        }

        onPopState(i) {
            this._removeListenerFns.push(this._platformLocation.onPopState(i), this._platformLocation.onHashChange(i))
        }

        getBaseHref() {
            return this._baseHref
        }

        path(i = !1) {
            let r = this._platformLocation.hash ?? "#";
            return r.length > 0 ? r.substring(1) : r
        }

        prepareExternalUrl(i) {
            let r = pd(this._baseHref, i);
            return r.length > 0 ? "#" + r : r
        }

        pushState(i, r, o, s) {
            let a = this.prepareExternalUrl(o + En(s));
            a.length == 0 && (a = this._platformLocation.pathname), this._platformLocation.pushState(i, r, a)
        }

        replaceState(i, r, o, s) {
            let a = this.prepareExternalUrl(o + En(s));
            a.length == 0 && (a = this._platformLocation.pathname), this._platformLocation.replaceState(i, r, a)
        }

        forward() {
            this._platformLocation.forward()
        }

        back() {
            this._platformLocation.back()
        }

        getState() {
            return this._platformLocation.getState()
        }

        historyGo(i = 0) {
            this._platformLocation.historyGo?.(i)
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)(X(fd), X(av, 8))
    }, e.\u0275prov = B({token: e, factory: e.\u0275fac});
    let t = e;
    return t
})(), dr = (() => {
    let e = class e {
        constructor(i) {
            this._subject = new ke, this._urlChangeListeners = [], this._urlChangeSubscription = null, this._locationStrategy = i;
            let r = this._locationStrategy.getBaseHref();
            this._basePath = RD(Jg(ev(r))), this._locationStrategy.onPopState(o => {
                this._subject.emit({url: this.path(!0), pop: !0, state: o.state, type: o.type})
            })
        }

        ngOnDestroy() {
            this._urlChangeSubscription?.unsubscribe(), this._urlChangeListeners = []
        }

        path(i = !1) {
            return this.normalize(this._locationStrategy.path(i))
        }

        getState() {
            return this._locationStrategy.getState()
        }

        isCurrentPathEqualTo(i, r = "") {
            return this.path() == this.normalize(i + En(r))
        }

        normalize(i) {
            return e.stripTrailingSlash(FD(this._basePath, ev(i)))
        }

        prepareExternalUrl(i) {
            return i && i[0] !== "/" && (i = "/" + i), this._locationStrategy.prepareExternalUrl(i)
        }

        go(i, r = "", o = null) {
            this._locationStrategy.pushState(o, "", i, r), this._notifyUrlChangeListeners(this.prepareExternalUrl(i + En(r)), o)
        }

        replaceState(i, r = "", o = null) {
            this._locationStrategy.replaceState(o, "", i, r), this._notifyUrlChangeListeners(this.prepareExternalUrl(i + En(r)), o)
        }

        forward() {
            this._locationStrategy.forward()
        }

        back() {
            this._locationStrategy.back()
        }

        historyGo(i = 0) {
            this._locationStrategy.historyGo?.(i)
        }

        onUrlChange(i) {
            return this._urlChangeListeners.push(i), this._urlChangeSubscription ??= this.subscribe(r => {
                this._notifyUrlChangeListeners(r.url, r.state)
            }), () => {
                let r = this._urlChangeListeners.indexOf(i);
                this._urlChangeListeners.splice(r, 1), this._urlChangeListeners.length === 0 && (this._urlChangeSubscription?.unsubscribe(), this._urlChangeSubscription = null)
            }
        }

        _notifyUrlChangeListeners(i = "", r) {
            this._urlChangeListeners.forEach(o => o(i, r))
        }

        subscribe(i, r, o) {
            return this._subject.subscribe({next: i, error: r, complete: o})
        }
    };
    e.normalizeQueryParams = En, e.joinWithSlash = pd, e.stripTrailingSlash = Jg, e.\u0275fac = function (r) {
        return new (r || e)(X(Cn))
    }, e.\u0275prov = B({token: e, factory: () => kD(), providedIn: "root"});
    let t = e;
    return t
})();

function kD() {
    return new dr(X(Cn))
}

function FD(t, e) {
    if (!t || !e.startsWith(t)) return e;
    let n = e.substring(t.length);
    return n === "" || ["/", ";", "?", "#"].includes(n[0]) ? n : e
}

function ev(t) {
    return t.replace(/\/index.html$/, "")
}

function RD(t) {
    if (new RegExp("^(https?:)?//").test(t)) {
        let [, n] = t.split(/\/\/[^\/]+/);
        return n
    }
    return t
}

function cv(t, e) {
    e = encodeURIComponent(e);
    for (let n of t.split(";")) {
        let i = n.indexOf("="), [r, o] = i == -1 ? [n, ""] : [n.slice(0, i), n.slice(i + 1)];
        if (r.trim() === e) return decodeURIComponent(o)
    }
    return null
}

var sd = /\s+/, tv = [], uv = (() => {
    let e = class e {
        constructor(i, r) {
            this._ngEl = i, this._renderer = r, this.initialClasses = tv, this.stateMap = new Map
        }

        set klass(i) {
            this.initialClasses = i != null ? i.trim().split(sd) : tv
        }

        set ngClass(i) {
            this.rawClass = typeof i == "string" ? i.trim().split(sd) : i
        }

        ngDoCheck() {
            for (let r of this.initialClasses) this._updateState(r, !0);
            let i = this.rawClass;
            if (Array.isArray(i) || i instanceof Set) for (let r of i) this._updateState(r, !0); else if (i != null) for (let r of Object.keys(i)) this._updateState(r, !!i[r]);
            this._applyStateDiff()
        }

        _updateState(i, r) {
            let o = this.stateMap.get(i);
            o !== void 0 ? (o.enabled !== r && (o.changed = !0, o.enabled = r), o.touched = !0) : this.stateMap.set(i, {
                enabled: r,
                changed: !0,
                touched: !0
            })
        }

        _applyStateDiff() {
            for (let i of this.stateMap) {
                let r = i[0], o = i[1];
                o.changed ? (this._toggleClass(r, o.enabled), o.changed = !1) : o.touched || (o.enabled && this._toggleClass(r, !1), this.stateMap.delete(r)), o.touched = !1
            }
        }

        _toggleClass(i, r) {
            i = i.trim(), i.length > 0 && i.split(sd).forEach(o => {
                r ? this._renderer.addClass(this._ngEl.nativeElement, o) : this._renderer.removeClass(this._ngEl.nativeElement, o)
            })
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)(P(ut), P(Zt))
    }, e.\u0275dir = Ve({
        type: e,
        selectors: [["", "ngClass", ""]],
        inputs: {klass: [Ge.None, "class", "klass"], ngClass: "ngClass"},
        standalone: !0
    });
    let t = e;
    return t
})();
var ad = class {
    constructor(e, n, i, r) {
        this.$implicit = e, this.ngForOf = n, this.index = i, this.count = r
    }

    get first() {
        return this.index === 0
    }

    get last() {
        return this.index === this.count - 1
    }

    get even() {
        return this.index % 2 === 0
    }

    get odd() {
        return !this.even
    }
}, we = (() => {
    let e = class e {
        set ngForOf(i) {
            this._ngForOf = i, this._ngForOfDirty = !0
        }

        set ngForTrackBy(i) {
            this._trackByFn = i
        }

        get ngForTrackBy() {
            return this._trackByFn
        }

        constructor(i, r, o) {
            this._viewContainer = i, this._template = r, this._differs = o, this._ngForOf = null, this._ngForOfDirty = !0, this._differ = null
        }

        set ngForTemplate(i) {
            i && (this._template = i)
        }

        ngDoCheck() {
            if (this._ngForOfDirty) {
                this._ngForOfDirty = !1;
                let i = this._ngForOf;
                if (!this._differ && i) if (0) try {
                } catch {
                } else this._differ = this._differs.find(i).create(this.ngForTrackBy)
            }
            if (this._differ) {
                let i = this._differ.diff(this._ngForOf);
                i && this._applyChanges(i)
            }
        }

        _applyChanges(i) {
            let r = this._viewContainer;
            i.forEachOperation((o, s, a) => {
                if (o.previousIndex == null) r.createEmbeddedView(this._template, new ad(o.item, this._ngForOf, -1, -1), a === null ? void 0 : a); else if (a == null) r.remove(s === null ? void 0 : s); else if (s !== null) {
                    let l = r.get(s);
                    r.move(l, a), nv(l, o)
                }
            });
            for (let o = 0, s = r.length; o < s; o++) {
                let l = r.get(o).context;
                l.index = o, l.count = s, l.ngForOf = this._ngForOf
            }
            i.forEachIdentityChange(o => {
                let s = r.get(o.currentIndex);
                nv(s, o)
            })
        }

        static ngTemplateContextGuard(i, r) {
            return !0
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)(P(jn), P(ui), P(rd))
    }, e.\u0275dir = Ve({
        type: e,
        selectors: [["", "ngFor", "", "ngForOf", ""]],
        inputs: {ngForOf: "ngForOf", ngForTrackBy: "ngForTrackBy", ngForTemplate: "ngForTemplate"},
        standalone: !0
    });
    let t = e;
    return t
})();

function nv(t, e) {
    t.context.$implicit = e.item
}

var _t = (() => {
    let e = class e {
        constructor(i, r) {
            this._viewContainer = i, this._context = new ld, this._thenTemplateRef = null, this._elseTemplateRef = null, this._thenViewRef = null, this._elseViewRef = null, this._thenTemplateRef = r
        }

        set ngIf(i) {
            this._context.$implicit = this._context.ngIf = i, this._updateView()
        }

        set ngIfThen(i) {
            iv("ngIfThen", i), this._thenTemplateRef = i, this._thenViewRef = null, this._updateView()
        }

        set ngIfElse(i) {
            iv("ngIfElse", i), this._elseTemplateRef = i, this._elseViewRef = null, this._updateView()
        }

        _updateView() {
            this._context.$implicit ? this._thenViewRef || (this._viewContainer.clear(), this._elseViewRef = null, this._thenTemplateRef && (this._thenViewRef = this._viewContainer.createEmbeddedView(this._thenTemplateRef, this._context))) : this._elseViewRef || (this._viewContainer.clear(), this._thenViewRef = null, this._elseTemplateRef && (this._elseViewRef = this._viewContainer.createEmbeddedView(this._elseTemplateRef, this._context)))
        }

        static ngTemplateContextGuard(i, r) {
            return !0
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)(P(jn), P(ui))
    }, e.\u0275dir = Ve({
        type: e,
        selectors: [["", "ngIf", ""]],
        inputs: {ngIf: "ngIf", ngIfThen: "ngIfThen", ngIfElse: "ngIfElse"},
        standalone: !0
    });
    let t = e;
    return t
})(), ld = class {
    constructor() {
        this.$implicit = null, this.ngIf = null
    }
};

function iv(t, e) {
    if (!!!(!e || e.createEmbeddedView)) throw new Error(`${t} must be a TemplateRef, but received '${rt(e)}'.`)
}

var _a = (() => {
    let e = class e {
        constructor(i, r, o) {
            this._ngEl = i, this._differs = r, this._renderer = o, this._ngStyle = null, this._differ = null
        }

        set ngStyle(i) {
            this._ngStyle = i, !this._differ && i && (this._differ = this._differs.find(i).create())
        }

        ngDoCheck() {
            if (this._differ) {
                let i = this._differ.diff(this._ngStyle);
                i && this._applyChanges(i)
            }
        }

        _setStyle(i, r) {
            let [o, s] = i.split("."), a = o.indexOf("-") === -1 ? void 0 : Xt.DashCase;
            r != null ? this._renderer.setStyle(this._ngEl.nativeElement, o, s ? `${r}${s}` : r, a) : this._renderer.removeStyle(this._ngEl.nativeElement, o, a)
        }

        _applyChanges(i) {
            i.forEachRemovedItem(r => this._setStyle(r.key, null)), i.forEachAddedItem(r => this._setStyle(r.key, r.currentValue)), i.forEachChangedItem(r => this._setStyle(r.key, r.currentValue))
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)(P(ut), P(od), P(Zt))
    }, e.\u0275dir = Ve({type: e, selectors: [["", "ngStyle", ""]], inputs: {ngStyle: "ngStyle"}, standalone: !0});
    let t = e;
    return t
})();
var H = (() => {
    let e = class e {
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275mod = un({type: e}), e.\u0275inj = cn({});
    let t = e;
    return t
})(), md = "browser", LD = "server";

function VD(t) {
    return t === md
}

function gd(t) {
    return t === LD
}

var vd = (() => {
    let e = class e {
    };
    e.\u0275prov = B({token: e, providedIn: "root", factory: () => VD(N(Vn)) ? new cd(N(et), window) : new ud});
    let t = e;
    return t
})(), cd = class {
    constructor(e, n) {
        this.document = e, this.window = n, this.offset = () => [0, 0]
    }

    setOffset(e) {
        Array.isArray(e) ? this.offset = () => e : this.offset = e
    }

    getScrollPosition() {
        return [this.window.scrollX, this.window.scrollY]
    }

    scrollToPosition(e) {
        this.window.scrollTo(e[0], e[1])
    }

    scrollToAnchor(e) {
        let n = jD(this.document, e);
        n && (this.scrollToElement(n), n.focus())
    }

    setHistoryScrollRestoration(e) {
        this.window.history.scrollRestoration = e
    }

    scrollToElement(e) {
        let n = e.getBoundingClientRect(), i = n.left + this.window.pageXOffset, r = n.top + this.window.pageYOffset,
            o = this.offset();
        this.window.scrollTo(i - o[0], r - o[1])
    }
};

function jD(t, e) {
    let n = t.getElementById(e) || t.getElementsByName(e)[0];
    if (n) return n;
    if (typeof t.createTreeWalker == "function" && t.body && typeof t.body.attachShadow == "function") {
        let i = t.createTreeWalker(t.body, NodeFilter.SHOW_ELEMENT), r = i.currentNode;
        for (; r;) {
            let o = r.shadowRoot;
            if (o) {
                let s = o.getElementById(e) || o.querySelector(`[name="${e}"]`);
                if (s) return s
            }
            r = i.nextNode()
        }
    }
    return null
}

var ud = class {
    setOffset(e) {
    }

    getScrollPosition() {
        return [0, 0]
    }

    scrollToPosition(e) {
    }

    scrollToAnchor(e) {
    }

    setHistoryScrollRestoration(e) {
    }
}, Ma = class {
};
var bd = class extends Ia {
    constructor() {
        super(...arguments), this.supportsDOMEvents = !0
    }
}, Ed = class t extends bd {
    static makeCurrent() {
        ov(new t)
    }

    onAndCancel(e, n, i) {
        return e.addEventListener(n, i), () => {
            e.removeEventListener(n, i)
        }
    }

    dispatchEvent(e, n) {
        e.dispatchEvent(n)
    }

    remove(e) {
        e.parentNode && e.parentNode.removeChild(e)
    }

    createElement(e, n) {
        return n = n || this.getDefaultDocument(), n.createElement(e)
    }

    createHtmlDocument() {
        return document.implementation.createHTMLDocument("fakeTitle")
    }

    getDefaultDocument() {
        return document
    }

    isElementNode(e) {
        return e.nodeType === Node.ELEMENT_NODE
    }

    isShadowRoot(e) {
        return e instanceof DocumentFragment
    }

    getGlobalEventTarget(e, n) {
        return n === "window" ? window : n === "document" ? e : n === "body" ? e.body : null
    }

    getBaseHref(e) {
        let n = $D();
        return n == null ? null : BD(n)
    }

    resetBaseElement() {
        fo = null
    }

    getUserAgent() {
        return window.navigator.userAgent
    }

    getCookie(e) {
        return cv(document.cookie, e)
    }
}, fo = null;

function $D() {
    return fo = fo || document.querySelector("base"), fo ? fo.getAttribute("href") : null
}

function BD(t) {
    return new URL(t, document.baseURI).pathname
}

var HD = (() => {
        let e = class e {
            build() {
                return new XMLHttpRequest
            }
        };
        e.\u0275fac = function (r) {
            return new (r || e)
        }, e.\u0275prov = B({token: e, factory: e.\u0275fac});
        let t = e;
        return t
    })(), Sd = new Z(""), pv = (() => {
        let e = class e {
            constructor(i, r) {
                this._zone = r, this._eventNameToPlugin = new Map, i.forEach(o => {
                    o.manager = this
                }), this._plugins = i.slice().reverse()
            }

            addEventListener(i, r, o) {
                return this._findPluginFor(r).addEventListener(i, r, o)
            }

            getZone() {
                return this._zone
            }

            _findPluginFor(i) {
                let r = this._eventNameToPlugin.get(i);
                if (r) return r;
                if (r = this._plugins.find(s => s.supports(i)), !r) throw new _(5101, !1);
                return this._eventNameToPlugin.set(i, r), r
            }
        };
        e.\u0275fac = function (r) {
            return new (r || e)(X(Sd), X(Ie))
        }, e.\u0275prov = B({token: e, factory: e.\u0275fac});
        let t = e;
        return t
    })(), Ta = class {
        constructor(e) {
            this._doc = e
        }
    }, yd = "ng-app-id", hv = (() => {
        let e = class e {
            constructor(i, r, o, s = {}) {
                this.doc = i, this.appId = r, this.nonce = o, this.platformId = s, this.styleRef = new Map, this.hostNodes = new Set, this.styleNodesInDOM = this.collectServerRenderedStyles(), this.platformIsServer = gd(s), this.resetHostNodes()
            }

            addStyles(i) {
                for (let r of i) this.changeUsageCount(r, 1) === 1 && this.onStyleAdded(r)
            }

            removeStyles(i) {
                for (let r of i) this.changeUsageCount(r, -1) <= 0 && this.onStyleRemoved(r)
            }

            ngOnDestroy() {
                let i = this.styleNodesInDOM;
                i && (i.forEach(r => r.remove()), i.clear());
                for (let r of this.getAllStyles()) this.onStyleRemoved(r);
                this.resetHostNodes()
            }

            addHost(i) {
                this.hostNodes.add(i);
                for (let r of this.getAllStyles()) this.addStyleToHost(i, r)
            }

            removeHost(i) {
                this.hostNodes.delete(i)
            }

            getAllStyles() {
                return this.styleRef.keys()
            }

            onStyleAdded(i) {
                for (let r of this.hostNodes) this.addStyleToHost(r, i)
            }

            onStyleRemoved(i) {
                let r = this.styleRef;
                r.get(i)?.elements?.forEach(o => o.remove()), r.delete(i)
            }

            collectServerRenderedStyles() {
                let i = this.doc.head?.querySelectorAll(`style[${yd}="${this.appId}"]`);
                if (i?.length) {
                    let r = new Map;
                    return i.forEach(o => {
                        o.textContent != null && r.set(o.textContent, o)
                    }), r
                }
                return null
            }

            changeUsageCount(i, r) {
                let o = this.styleRef;
                if (o.has(i)) {
                    let s = o.get(i);
                    return s.usage += r, s.usage
                }
                return o.set(i, {usage: r, elements: []}), r
            }

            getStyleElement(i, r) {
                let o = this.styleNodesInDOM, s = o?.get(r);
                if (s?.parentNode === i) return o.delete(r), s.removeAttribute(yd), s;
                {
                    let a = this.doc.createElement("style");
                    return this.nonce && a.setAttribute("nonce", this.nonce), a.textContent = r, this.platformIsServer && a.setAttribute(yd, this.appId), i.appendChild(a), a
                }
            }

            addStyleToHost(i, r) {
                let o = this.getStyleElement(i, r), s = this.styleRef, a = s.get(r)?.elements;
                a ? a.push(o) : s.set(r, {elements: [o], usage: 1})
            }

            resetHostNodes() {
                let i = this.hostNodes;
                i.clear(), i.add(this.doc.head)
            }
        };
        e.\u0275fac = function (r) {
            return new (r || e)(X(et), X(Ou), X(Fu, 8), X(Vn))
        }, e.\u0275prov = B({token: e, factory: e.\u0275fac});
        let t = e;
        return t
    })(), wd = {
        svg: "http://www.w3.org/2000/svg",
        xhtml: "http://www.w3.org/1999/xhtml",
        xlink: "http://www.w3.org/1999/xlink",
        xml: "http://www.w3.org/XML/1998/namespace",
        xmlns: "http://www.w3.org/2000/xmlns/",
        math: "http://www.w3.org/1998/MathML/"
    }, Dd = /%COMP%/g, mv = "%COMP%", UD = `_nghost-${mv}`, zD = `_ngcontent-${mv}`, GD = !0,
    qD = new Z("", {providedIn: "root", factory: () => GD});

function WD(t) {
    return zD.replace(Dd, t)
}

function YD(t) {
    return UD.replace(Dd, t)
}

function gv(t, e) {
    return e.map(n => n.replace(Dd, t))
}

var xa = (() => {
    let e = class e {
        constructor(i, r, o, s, a, l, c, f = null) {
            this.eventManager = i, this.sharedStylesHost = r, this.appId = o, this.removeStylesOnCompDestroy = s, this.doc = a, this.platformId = l, this.ngZone = c, this.nonce = f, this.rendererByCompId = new Map, this.platformIsServer = gd(l), this.defaultRenderer = new po(i, a, c, this.platformIsServer)
        }

        createRenderer(i, r) {
            if (!i || !r) return this.defaultRenderer;
            this.platformIsServer && r.encapsulation === qt.ShadowDom && (r = Se(k({}, r), {encapsulation: qt.Emulated}));
            let o = this.getOrCreateRenderer(i, r);
            return o instanceof Aa ? o.applyToHost(i) : o instanceof ho && o.applyStyles(), o
        }

        getOrCreateRenderer(i, r) {
            let o = this.rendererByCompId, s = o.get(r.id);
            if (!s) {
                let a = this.doc, l = this.ngZone, c = this.eventManager, f = this.sharedStylesHost,
                    p = this.removeStylesOnCompDestroy, m = this.platformIsServer;
                switch (r.encapsulation) {
                    case qt.Emulated:
                        s = new Aa(c, f, r, this.appId, p, a, l, m);
                        break;
                    case qt.ShadowDom:
                        return new Cd(c, f, i, r, a, l, this.nonce, m);
                    default:
                        s = new ho(c, f, r, p, a, l, m);
                        break
                }
                o.set(r.id, s)
            }
            return s
        }

        ngOnDestroy() {
            this.rendererByCompId.clear()
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)(X(pv), X(hv), X(Ou), X(qD), X(et), X(Vn), X(Ie), X(Fu))
    }, e.\u0275prov = B({token: e, factory: e.\u0275fac});
    let t = e;
    return t
})(), po = class {
    constructor(e, n, i, r) {
        this.eventManager = e, this.doc = n, this.ngZone = i, this.platformIsServer = r, this.data = Object.create(null), this.throwOnSyntheticProps = !0, this.destroyNode = null
    }

    destroy() {
    }

    createElement(e, n) {
        return n ? this.doc.createElementNS(wd[n] || n, e) : this.doc.createElement(e)
    }

    createComment(e) {
        return this.doc.createComment(e)
    }

    createText(e) {
        return this.doc.createTextNode(e)
    }

    appendChild(e, n) {
        (dv(e) ? e.content : e).appendChild(n)
    }

    insertBefore(e, n, i) {
        e && (dv(e) ? e.content : e).insertBefore(n, i)
    }

    removeChild(e, n) {
        e && e.removeChild(n)
    }

    selectRootElement(e, n) {
        let i = typeof e == "string" ? this.doc.querySelector(e) : e;
        if (!i) throw new _(-5104, !1);
        return n || (i.textContent = ""), i
    }

    parentNode(e) {
        return e.parentNode
    }

    nextSibling(e) {
        return e.nextSibling
    }

    setAttribute(e, n, i, r) {
        if (r) {
            n = r + ":" + n;
            let o = wd[r];
            o ? e.setAttributeNS(o, n, i) : e.setAttribute(n, i)
        } else e.setAttribute(n, i)
    }

    removeAttribute(e, n, i) {
        if (i) {
            let r = wd[i];
            r ? e.removeAttributeNS(r, n) : e.removeAttribute(`${i}:${n}`)
        } else e.removeAttribute(n)
    }

    addClass(e, n) {
        e.classList.add(n)
    }

    removeClass(e, n) {
        e.classList.remove(n)
    }

    setStyle(e, n, i, r) {
        r & (Xt.DashCase | Xt.Important) ? e.style.setProperty(n, i, r & Xt.Important ? "important" : "") : e.style[n] = i
    }

    removeStyle(e, n, i) {
        i & Xt.DashCase ? e.style.removeProperty(n) : e.style[n] = ""
    }

    setProperty(e, n, i) {
        e != null && (e[n] = i)
    }

    setValue(e, n) {
        e.nodeValue = n
    }

    listen(e, n, i) {
        if (typeof e == "string" && (e = Sn().getGlobalEventTarget(this.doc, e), !e)) throw new Error(`Unsupported event target ${e} for event ${n}`);
        return this.eventManager.addEventListener(e, n, this.decoratePreventDefault(i))
    }

    decoratePreventDefault(e) {
        return n => {
            if (n === "__ngUnwrap__") return e;
            (this.platformIsServer ? this.ngZone.runGuarded(() => e(n)) : e(n)) === !1 && n.preventDefault()
        }
    }
};

function dv(t) {
    return t.tagName === "TEMPLATE" && t.content !== void 0
}

var Cd = class extends po {
    constructor(e, n, i, r, o, s, a, l) {
        super(e, o, s, l), this.sharedStylesHost = n, this.hostEl = i, this.shadowRoot = i.attachShadow({mode: "open"}), this.sharedStylesHost.addHost(this.shadowRoot);
        let c = gv(r.id, r.styles);
        for (let f of c) {
            let p = document.createElement("style");
            a && p.setAttribute("nonce", a), p.textContent = f, this.shadowRoot.appendChild(p)
        }
    }

    nodeOrShadowRoot(e) {
        return e === this.hostEl ? this.shadowRoot : e
    }

    appendChild(e, n) {
        return super.appendChild(this.nodeOrShadowRoot(e), n)
    }

    insertBefore(e, n, i) {
        return super.insertBefore(this.nodeOrShadowRoot(e), n, i)
    }

    removeChild(e, n) {
        return super.removeChild(this.nodeOrShadowRoot(e), n)
    }

    parentNode(e) {
        return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(e)))
    }

    destroy() {
        this.sharedStylesHost.removeHost(this.shadowRoot)
    }
}, ho = class extends po {
    constructor(e, n, i, r, o, s, a, l) {
        super(e, o, s, a), this.sharedStylesHost = n, this.removeStylesOnCompDestroy = r, this.styles = l ? gv(l, i.styles) : i.styles
    }

    applyStyles() {
        this.sharedStylesHost.addStyles(this.styles)
    }

    destroy() {
        this.removeStylesOnCompDestroy && this.sharedStylesHost.removeStyles(this.styles)
    }
}, Aa = class extends ho {
    constructor(e, n, i, r, o, s, a, l) {
        let c = r + "-" + i.id;
        super(e, n, i, o, s, a, l, c), this.contentAttr = WD(c), this.hostAttr = YD(c)
    }

    applyToHost(e) {
        this.applyStyles(), this.setAttribute(e, this.hostAttr, "")
    }

    createElement(e, n) {
        let i = super.createElement(e, n);
        return super.setAttribute(i, this.contentAttr, ""), i
    }
}, QD = (() => {
    let e = class e extends Ta {
        constructor(i) {
            super(i)
        }

        supports(i) {
            return !0
        }

        addEventListener(i, r, o) {
            return i.addEventListener(r, o, !1), () => this.removeEventListener(i, r, o)
        }

        removeEventListener(i, r, o) {
            return i.removeEventListener(r, o)
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)(X(et))
    }, e.\u0275prov = B({token: e, factory: e.\u0275fac});
    let t = e;
    return t
})(), fv = ["alt", "control", "meta", "shift"], XD = {
    "\b": "Backspace",
    "	": "Tab",
    "\x7F": "Delete",
    "\x1B": "Escape",
    Del: "Delete",
    Esc: "Escape",
    Left: "ArrowLeft",
    Right: "ArrowRight",
    Up: "ArrowUp",
    Down: "ArrowDown",
    Menu: "ContextMenu",
    Scroll: "ScrollLock",
    Win: "OS"
}, KD = {alt: t => t.altKey, control: t => t.ctrlKey, meta: t => t.metaKey, shift: t => t.shiftKey}, ZD = (() => {
    let e = class e extends Ta {
        constructor(i) {
            super(i)
        }

        supports(i) {
            return e.parseEventName(i) != null
        }

        addEventListener(i, r, o) {
            let s = e.parseEventName(r), a = e.eventCallback(s.fullKey, o, this.manager.getZone());
            return this.manager.getZone().runOutsideAngular(() => Sn().onAndCancel(i, s.domEventName, a))
        }

        static parseEventName(i) {
            let r = i.toLowerCase().split("."), o = r.shift();
            if (r.length === 0 || !(o === "keydown" || o === "keyup")) return null;
            let s = e._normalizeKey(r.pop()), a = "", l = r.indexOf("code");
            if (l > -1 && (r.splice(l, 1), a = "code."), fv.forEach(f => {
                let p = r.indexOf(f);
                p > -1 && (r.splice(p, 1), a += f + ".")
            }), a += s, r.length != 0 || s.length === 0) return null;
            let c = {};
            return c.domEventName = o, c.fullKey = a, c
        }

        static matchEventFullKeyCode(i, r) {
            let o = XD[i.key] || i.key, s = "";
            return r.indexOf("code.") > -1 && (o = i.code, s = "code."), o == null || !o ? !1 : (o = o.toLowerCase(), o === " " ? o = "space" : o === "." && (o = "dot"), fv.forEach(a => {
                if (a !== o) {
                    let l = KD[a];
                    l(i) && (s += a + ".")
                }
            }), s += o, s === r)
        }

        static eventCallback(i, r, o) {
            return s => {
                e.matchEventFullKeyCode(s, i) && o.runGuarded(() => r(s))
            }
        }

        static _normalizeKey(i) {
            return i === "esc" ? "escape" : i
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)(X(et))
    }, e.\u0275prov = B({token: e, factory: e.\u0275fac});
    let t = e;
    return t
})();

function vv(t, e) {
    return Kg(k({rootComponent: t}, JD(e)))
}

function JD(t) {
    return {appProviders: [...rI, ...t?.providers ?? []], platformProviders: iI}
}

function eI() {
    Ed.makeCurrent()
}

function tI() {
    return new Qt
}

function nI() {
    return zm(document), document
}

var iI = [{provide: Vn, useValue: md}, {provide: Pu, useValue: eI, multi: !0}, {provide: et, useFactory: nI, deps: []}];
var rI = [{provide: oa, useValue: "root"}, {provide: Qt, useFactory: tI, deps: []}, {
    provide: Sd,
    useClass: QD,
    multi: !0,
    deps: [et, Ie, Vn]
}, {provide: Sd, useClass: ZD, multi: !0, deps: [et]}, xa, hv, pv, {provide: di, useExisting: xa}, {
    provide: Ma,
    useClass: HD,
    deps: []
}, []];
var yv = (() => {
    let e = class e {
        constructor(i) {
            this._doc = i
        }

        getTitle() {
            return this._doc.title
        }

        setTitle(i) {
            this._doc.title = i || ""
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)(X(et))
    }, e.\u0275prov = B({token: e, factory: e.\u0275fac, providedIn: "root"});
    let t = e;
    return t
})();
var te = "primary", Ao = Symbol("RouteTitle"), xd = class {
    constructor(e) {
        this.params = e || {}
    }

    has(e) {
        return Object.prototype.hasOwnProperty.call(this.params, e)
    }

    get(e) {
        if (this.has(e)) {
            let n = this.params[e];
            return Array.isArray(n) ? n[0] : n
        }
        return null
    }

    getAll(e) {
        if (this.has(e)) {
            let n = this.params[e];
            return Array.isArray(n) ? n : [n]
        }
        return []
    }

    get keys() {
        return Object.keys(this.params)
    }
};

function gr(t) {
    return new xd(t)
}

function sI(t, e, n) {
    let i = n.path.split("/");
    if (i.length > t.length || n.pathMatch === "full" && (e.hasChildren() || i.length < t.length)) return null;
    let r = {};
    for (let o = 0; o < i.length; o++) {
        let s = i[o], a = t[o];
        if (s.startsWith(":")) r[s.substring(1)] = a; else if (s !== a.path) return null
    }
    return {consumed: t.slice(0, i.length), posParams: r}
}

function aI(t, e) {
    if (t.length !== e.length) return !1;
    for (let n = 0; n < t.length; ++n) if (!Jt(t[n], e[n])) return !1;
    return !0
}

function Jt(t, e) {
    let n = t ? Ad(t) : void 0, i = e ? Ad(e) : void 0;
    if (!n || !i || n.length != i.length) return !1;
    let r;
    for (let o = 0; o < n.length; o++) if (r = n[o], !_v(t[r], e[r])) return !1;
    return !0
}

function Ad(t) {
    return [...Object.keys(t), ...Object.getOwnPropertySymbols(t)]
}

function _v(t, e) {
    if (Array.isArray(t) && Array.isArray(e)) {
        if (t.length !== e.length) return !1;
        let n = [...t].sort(), i = [...e].sort();
        return n.every((r, o) => i[o] === r)
    } else return t === e
}

function Tv(t) {
    return t.length > 0 ? t[t.length - 1] : null
}

function Gn(t) {
    return zl(t) ? t : vi(t) ? Te(Promise.resolve(t)) : q(t)
}

var lI = {exact: Av, subset: Nv}, xv = {exact: cI, subset: uI, ignored: () => !0};

function wv(t, e, n) {
    return lI[n.paths](t.root, e.root, n.matrixParams) && xv[n.queryParams](t.queryParams, e.queryParams) && !(n.fragment === "exact" && t.fragment !== e.fragment)
}

function cI(t, e) {
    return Jt(t, e)
}

function Av(t, e, n) {
    if (!bi(t.segments, e.segments) || !Pa(t.segments, e.segments, n) || t.numberOfChildren !== e.numberOfChildren) return !1;
    for (let i in e.children) if (!t.children[i] || !Av(t.children[i], e.children[i], n)) return !1;
    return !0
}

function uI(t, e) {
    return Object.keys(e).length <= Object.keys(t).length && Object.keys(e).every(n => _v(t[n], e[n]))
}

function Nv(t, e, n) {
    return Ov(t, e, e.segments, n)
}

function Ov(t, e, n, i) {
    if (t.segments.length > n.length) {
        let r = t.segments.slice(0, n.length);
        return !(!bi(r, n) || e.hasChildren() || !Pa(r, n, i))
    } else if (t.segments.length === n.length) {
        if (!bi(t.segments, n) || !Pa(t.segments, n, i)) return !1;
        for (let r in e.children) if (!t.children[r] || !Nv(t.children[r], e.children[r], i)) return !1;
        return !0
    } else {
        let r = n.slice(0, t.segments.length), o = n.slice(t.segments.length);
        return !bi(t.segments, r) || !Pa(t.segments, r, i) || !t.children[te] ? !1 : Ov(t.children[te], e, o, i)
    }
}

function Pa(t, e, n) {
    return e.every((i, r) => xv[n](t[r].parameters, i.parameters))
}

var Hn = class {
    constructor(e = new be([], {}), n = {}, i = null) {
        this.root = e, this.queryParams = n, this.fragment = i
    }

    get queryParamMap() {
        return this._queryParamMap ??= gr(this.queryParams), this._queryParamMap
    }

    toString() {
        return pI.serialize(this)
    }
}, be = class {
    constructor(e, n) {
        this.segments = e, this.children = n, this.parent = null, Object.values(n).forEach(i => i.parent = this)
    }

    hasChildren() {
        return this.numberOfChildren > 0
    }

    get numberOfChildren() {
        return Object.keys(this.children).length
    }

    toString() {
        return ka(this)
    }
}, wi = class {
    constructor(e, n) {
        this.path = e, this.parameters = n
    }

    get parameterMap() {
        return this._parameterMap ??= gr(this.parameters), this._parameterMap
    }

    toString() {
        return kv(this)
    }
};

function dI(t, e) {
    return bi(t, e) && t.every((n, i) => Jt(n.parameters, e[i].parameters))
}

function bi(t, e) {
    return t.length !== e.length ? !1 : t.every((n, i) => n.path === e[i].path)
}

function fI(t, e) {
    let n = [];
    return Object.entries(t.children).forEach(([i, r]) => {
        i === te && (n = n.concat(e(r, i)))
    }), Object.entries(t.children).forEach(([i, r]) => {
        i !== te && (n = n.concat(e(r, i)))
    }), n
}

var br = (() => {
    let e = class e {
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275prov = B({token: e, factory: () => new Eo, providedIn: "root"});
    let t = e;
    return t
})(), Eo = class {
    parse(e) {
        let n = new Od(e);
        return new Hn(n.parseRootSegment(), n.parseQueryParams(), n.parseFragment())
    }

    serialize(e) {
        let n = `/${mo(e.root, !0)}`, i = gI(e.queryParams),
            r = typeof e.fragment == "string" ? `#${hI(e.fragment)}` : "";
        return `${n}${i}${r}`
    }
}, pI = new Eo;

function ka(t) {
    return t.segments.map(e => kv(e)).join("/")
}

function mo(t, e) {
    if (!t.hasChildren()) return ka(t);
    if (e) {
        let n = t.children[te] ? mo(t.children[te], !1) : "", i = [];
        return Object.entries(t.children).forEach(([r, o]) => {
            r !== te && i.push(`${r}:${mo(o, !1)}`)
        }), i.length > 0 ? `${n}(${i.join("//")})` : n
    } else {
        let n = fI(t, (i, r) => r === te ? [mo(t.children[te], !1)] : [`${r}:${mo(i, !1)}`]);
        return Object.keys(t.children).length === 1 && t.children[te] != null ? `${ka(t)}/${n[0]}` : `${ka(t)}/(${n.join("//")})`
    }
}

function Pv(t) {
    return encodeURIComponent(t).replace(/%40/g, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",")
}

function Na(t) {
    return Pv(t).replace(/%3B/gi, ";")
}

function hI(t) {
    return encodeURI(t)
}

function Nd(t) {
    return Pv(t).replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/%26/gi, "&")
}

function Fa(t) {
    return decodeURIComponent(t)
}

function bv(t) {
    return Fa(t.replace(/\+/g, "%20"))
}

function kv(t) {
    return `${Nd(t.path)}${mI(t.parameters)}`
}

function mI(t) {
    return Object.entries(t).map(([e, n]) => `;${Nd(e)}=${Nd(n)}`).join("")
}

function gI(t) {
    let e = Object.entries(t).map(([n, i]) => Array.isArray(i) ? i.map(r => `${Na(n)}=${Na(r)}`).join("&") : `${Na(n)}=${Na(i)}`).filter(n => n);
    return e.length ? `?${e.join("&")}` : ""
}

var vI = /^[^\/()?;#]+/;

function Id(t) {
    let e = t.match(vI);
    return e ? e[0] : ""
}

var yI = /^[^\/()?;=#]+/;

function wI(t) {
    let e = t.match(yI);
    return e ? e[0] : ""
}

var bI = /^[^=?&#]+/;

function EI(t) {
    let e = t.match(bI);
    return e ? e[0] : ""
}

var SI = /^[^&#]+/;

function CI(t) {
    let e = t.match(SI);
    return e ? e[0] : ""
}

var Od = class {
    constructor(e) {
        this.url = e, this.remaining = e
    }

    parseRootSegment() {
        return this.consumeOptional("/"), this.remaining === "" || this.peekStartsWith("?") || this.peekStartsWith("#") ? new be([], {}) : new be([], this.parseChildren())
    }

    parseQueryParams() {
        let e = {};
        if (this.consumeOptional("?")) do this.parseQueryParam(e); while (this.consumeOptional("&"));
        return e
    }

    parseFragment() {
        return this.consumeOptional("#") ? decodeURIComponent(this.remaining) : null
    }

    parseChildren() {
        if (this.remaining === "") return {};
        this.consumeOptional("/");
        let e = [];
        for (this.peekStartsWith("(") || e.push(this.parseSegment()); this.peekStartsWith("/") && !this.peekStartsWith("//") && !this.peekStartsWith("/(");) this.capture("/"), e.push(this.parseSegment());
        let n = {};
        this.peekStartsWith("/(") && (this.capture("/"), n = this.parseParens(!0));
        let i = {};
        return this.peekStartsWith("(") && (i = this.parseParens(!1)), (e.length > 0 || Object.keys(n).length > 0) && (i[te] = new be(e, n)), i
    }

    parseSegment() {
        let e = Id(this.remaining);
        if (e === "" && this.peekStartsWith(";")) throw new _(4009, !1);
        return this.capture(e), new wi(Fa(e), this.parseMatrixParams())
    }

    parseMatrixParams() {
        let e = {};
        for (; this.consumeOptional(";");) this.parseParam(e);
        return e
    }

    parseParam(e) {
        let n = wI(this.remaining);
        if (!n) return;
        this.capture(n);
        let i = "";
        if (this.consumeOptional("=")) {
            let r = Id(this.remaining);
            r && (i = r, this.capture(i))
        }
        e[Fa(n)] = Fa(i)
    }

    parseQueryParam(e) {
        let n = EI(this.remaining);
        if (!n) return;
        this.capture(n);
        let i = "";
        if (this.consumeOptional("=")) {
            let s = CI(this.remaining);
            s && (i = s, this.capture(i))
        }
        let r = bv(n), o = bv(i);
        if (e.hasOwnProperty(r)) {
            let s = e[r];
            Array.isArray(s) || (s = [s], e[r] = s), s.push(o)
        } else e[r] = o
    }

    parseParens(e) {
        let n = {};
        for (this.capture("("); !this.consumeOptional(")") && this.remaining.length > 0;) {
            let i = Id(this.remaining), r = this.remaining[i.length];
            if (r !== "/" && r !== ")" && r !== ";") throw new _(4010, !1);
            let o;
            i.indexOf(":") > -1 ? (o = i.slice(0, i.indexOf(":")), this.capture(o), this.capture(":")) : e && (o = te);
            let s = this.parseChildren();
            n[o] = Object.keys(s).length === 1 ? s[te] : new be([], s), this.consumeOptional("//")
        }
        return n
    }

    peekStartsWith(e) {
        return this.remaining.startsWith(e)
    }

    consumeOptional(e) {
        return this.peekStartsWith(e) ? (this.remaining = this.remaining.substring(e.length), !0) : !1
    }

    capture(e) {
        if (!this.consumeOptional(e)) throw new _(4011, !1)
    }
};

function Fv(t) {
    return t.segments.length > 0 ? new be([], {[te]: t}) : t
}

function Rv(t) {
    let e = {};
    for (let [i, r] of Object.entries(t.children)) {
        let o = Rv(r);
        if (i === te && o.segments.length === 0 && o.hasChildren()) for (let [s, a] of Object.entries(o.children)) e[s] = a; else (o.segments.length > 0 || o.hasChildren()) && (e[i] = o)
    }
    let n = new be(t.segments, e);
    return DI(n)
}

function DI(t) {
    if (t.numberOfChildren === 1 && t.children[te]) {
        let e = t.children[te];
        return new be(t.segments.concat(e.segments), e.children)
    }
    return t
}

function vr(t) {
    return t instanceof Hn
}

function II(t, e, n = null, i = null) {
    let r = Lv(t);
    return Vv(r, e, n, i)
}

function Lv(t) {
    let e;

    function n(o) {
        let s = {};
        for (let l of o.children) {
            let c = n(l);
            s[l.outlet] = c
        }
        let a = new be(o.url, s);
        return o === t && (e = a), a
    }

    let i = n(t.root), r = Fv(i);
    return e ?? r
}

function Vv(t, e, n, i) {
    let r = t;
    for (; r.parent;) r = r.parent;
    if (e.length === 0) return Md(r, r, r, n, i);
    let o = MI(e);
    if (o.toRoot()) return Md(r, r, new be([], {}), n, i);
    let s = _I(o, r, t),
        a = s.processChildren ? yo(s.segmentGroup, s.index, o.commands) : $v(s.segmentGroup, s.index, o.commands);
    return Md(r, s.segmentGroup, a, n, i)
}

function Ra(t) {
    return typeof t == "object" && t != null && !t.outlets && !t.segmentPath
}

function So(t) {
    return typeof t == "object" && t != null && t.outlets
}

function Md(t, e, n, i, r) {
    let o = {};
    i && Object.entries(i).forEach(([l, c]) => {
        o[l] = Array.isArray(c) ? c.map(f => `${f}`) : `${c}`
    });
    let s;
    t === e ? s = n : s = jv(t, e, n);
    let a = Fv(Rv(s));
    return new Hn(a, o, r)
}

function jv(t, e, n) {
    let i = {};
    return Object.entries(t.children).forEach(([r, o]) => {
        o === e ? i[r] = n : i[r] = jv(o, e, n)
    }), new be(t.segments, i)
}

var La = class {
    constructor(e, n, i) {
        if (this.isAbsolute = e, this.numberOfDoubleDots = n, this.commands = i, e && i.length > 0 && Ra(i[0])) throw new _(4003, !1);
        let r = i.find(So);
        if (r && r !== Tv(i)) throw new _(4004, !1)
    }

    toRoot() {
        return this.isAbsolute && this.commands.length === 1 && this.commands[0] == "/"
    }
};

function MI(t) {
    if (typeof t[0] == "string" && t.length === 1 && t[0] === "/") return new La(!0, 0, t);
    let e = 0, n = !1, i = t.reduce((r, o, s) => {
        if (typeof o == "object" && o != null) {
            if (o.outlets) {
                let a = {};
                return Object.entries(o.outlets).forEach(([l, c]) => {
                    a[l] = typeof c == "string" ? c.split("/") : c
                }), [...r, {outlets: a}]
            }
            if (o.segmentPath) return [...r, o.segmentPath]
        }
        return typeof o != "string" ? [...r, o] : s === 0 ? (o.split("/").forEach((a, l) => {
            l == 0 && a === "." || (l == 0 && a === "" ? n = !0 : a === ".." ? e++ : a != "" && r.push(a))
        }), r) : [...r, o]
    }, []);
    return new La(n, e, i)
}

var hr = class {
    constructor(e, n, i) {
        this.segmentGroup = e, this.processChildren = n, this.index = i
    }
};

function _I(t, e, n) {
    if (t.isAbsolute) return new hr(e, !0, 0);
    if (!n) return new hr(e, !1, NaN);
    if (n.parent === null) return new hr(n, !0, 0);
    let i = Ra(t.commands[0]) ? 0 : 1, r = n.segments.length - 1 + i;
    return TI(n, r, t.numberOfDoubleDots)
}

function TI(t, e, n) {
    let i = t, r = e, o = n;
    for (; o > r;) {
        if (o -= r, i = i.parent, !i) throw new _(4005, !1);
        r = i.segments.length
    }
    return new hr(i, !1, r - o)
}

function xI(t) {
    return So(t[0]) ? t[0].outlets : {[te]: t}
}

function $v(t, e, n) {
    if (t ??= new be([], {}), t.segments.length === 0 && t.hasChildren()) return yo(t, e, n);
    let i = AI(t, e, n), r = n.slice(i.commandIndex);
    if (i.match && i.pathIndex < t.segments.length) {
        let o = new be(t.segments.slice(0, i.pathIndex), {});
        return o.children[te] = new be(t.segments.slice(i.pathIndex), t.children), yo(o, 0, r)
    } else return i.match && r.length === 0 ? new be(t.segments, {}) : i.match && !t.hasChildren() ? Pd(t, e, n) : i.match ? yo(t, 0, r) : Pd(t, e, n)
}

function yo(t, e, n) {
    if (n.length === 0) return new be(t.segments, {});
    {
        let i = xI(n), r = {};
        if (Object.keys(i).some(o => o !== te) && t.children[te] && t.numberOfChildren === 1 && t.children[te].segments.length === 0) {
            let o = yo(t.children[te], e, n);
            return new be(t.segments, o.children)
        }
        return Object.entries(i).forEach(([o, s]) => {
            typeof s == "string" && (s = [s]), s !== null && (r[o] = $v(t.children[o], e, s))
        }), Object.entries(t.children).forEach(([o, s]) => {
            i[o] === void 0 && (r[o] = s)
        }), new be(t.segments, r)
    }
}

function AI(t, e, n) {
    let i = 0, r = e, o = {match: !1, pathIndex: 0, commandIndex: 0};
    for (; r < t.segments.length;) {
        if (i >= n.length) return o;
        let s = t.segments[r], a = n[i];
        if (So(a)) break;
        let l = `${a}`, c = i < n.length - 1 ? n[i + 1] : null;
        if (r > 0 && l === void 0) break;
        if (l && c && typeof c == "object" && c.outlets === void 0) {
            if (!Sv(l, c, s)) return o;
            i += 2
        } else {
            if (!Sv(l, {}, s)) return o;
            i++
        }
        r++
    }
    return {match: !0, pathIndex: r, commandIndex: i}
}

function Pd(t, e, n) {
    let i = t.segments.slice(0, e), r = 0;
    for (; r < n.length;) {
        let o = n[r];
        if (So(o)) {
            let l = NI(o.outlets);
            return new be(i, l)
        }
        if (r === 0 && Ra(n[0])) {
            let l = t.segments[e];
            i.push(new wi(l.path, Ev(n[0]))), r++;
            continue
        }
        let s = So(o) ? o.outlets[te] : `${o}`, a = r < n.length - 1 ? n[r + 1] : null;
        s && a && Ra(a) ? (i.push(new wi(s, Ev(a))), r += 2) : (i.push(new wi(s, {})), r++)
    }
    return new be(i, {})
}

function NI(t) {
    let e = {};
    return Object.entries(t).forEach(([n, i]) => {
        typeof i == "string" && (i = [i]), i !== null && (e[n] = Pd(new be([], {}), 0, i))
    }), e
}

function Ev(t) {
    let e = {};
    return Object.entries(t).forEach(([n, i]) => e[n] = `${i}`), e
}

function Sv(t, e, n) {
    return t == n.path && Jt(e, n.parameters)
}

var wo = "imperative", $e = function (t) {
    return t[t.NavigationStart = 0] = "NavigationStart", t[t.NavigationEnd = 1] = "NavigationEnd", t[t.NavigationCancel = 2] = "NavigationCancel", t[t.NavigationError = 3] = "NavigationError", t[t.RoutesRecognized = 4] = "RoutesRecognized", t[t.ResolveStart = 5] = "ResolveStart", t[t.ResolveEnd = 6] = "ResolveEnd", t[t.GuardsCheckStart = 7] = "GuardsCheckStart", t[t.GuardsCheckEnd = 8] = "GuardsCheckEnd", t[t.RouteConfigLoadStart = 9] = "RouteConfigLoadStart", t[t.RouteConfigLoadEnd = 10] = "RouteConfigLoadEnd", t[t.ChildActivationStart = 11] = "ChildActivationStart", t[t.ChildActivationEnd = 12] = "ChildActivationEnd", t[t.ActivationStart = 13] = "ActivationStart", t[t.ActivationEnd = 14] = "ActivationEnd", t[t.Scroll = 15] = "Scroll", t[t.NavigationSkipped = 16] = "NavigationSkipped", t
}($e || {}), Tt = class {
    constructor(e, n) {
        this.id = e, this.url = n
    }
}, yr = class extends Tt {
    constructor(e, n, i = "imperative", r = null) {
        super(e, n), this.type = $e.NavigationStart, this.navigationTrigger = i, this.restoredState = r
    }

    toString() {
        return `NavigationStart(id: ${this.id}, url: '${this.url}')`
    }
}, st = class extends Tt {
    constructor(e, n, i) {
        super(e, n), this.urlAfterRedirects = i, this.type = $e.NavigationEnd
    }

    toString() {
        return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`
    }
}, yt = function (t) {
    return t[t.Redirect = 0] = "Redirect", t[t.SupersededByNewNavigation = 1] = "SupersededByNewNavigation", t[t.NoDataFromResolver = 2] = "NoDataFromResolver", t[t.GuardRejected = 3] = "GuardRejected", t
}(yt || {}), Va = function (t) {
    return t[t.IgnoredSameUrlNavigation = 0] = "IgnoredSameUrlNavigation", t[t.IgnoredByUrlHandlingStrategy = 1] = "IgnoredByUrlHandlingStrategy", t
}(Va || {}), Un = class extends Tt {
    constructor(e, n, i, r) {
        super(e, n), this.reason = i, this.code = r, this.type = $e.NavigationCancel
    }

    toString() {
        return `NavigationCancel(id: ${this.id}, url: '${this.url}')`
    }
}, zn = class extends Tt {
    constructor(e, n, i, r) {
        super(e, n), this.reason = i, this.code = r, this.type = $e.NavigationSkipped
    }
}, Co = class extends Tt {
    constructor(e, n, i, r) {
        super(e, n), this.error = i, this.target = r, this.type = $e.NavigationError
    }

    toString() {
        return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`
    }
}, ja = class extends Tt {
    constructor(e, n, i, r) {
        super(e, n), this.urlAfterRedirects = i, this.state = r, this.type = $e.RoutesRecognized
    }

    toString() {
        return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
    }
}, kd = class extends Tt {
    constructor(e, n, i, r) {
        super(e, n), this.urlAfterRedirects = i, this.state = r, this.type = $e.GuardsCheckStart
    }

    toString() {
        return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
    }
}, Fd = class extends Tt {
    constructor(e, n, i, r, o) {
        super(e, n), this.urlAfterRedirects = i, this.state = r, this.shouldActivate = o, this.type = $e.GuardsCheckEnd
    }

    toString() {
        return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`
    }
}, Rd = class extends Tt {
    constructor(e, n, i, r) {
        super(e, n), this.urlAfterRedirects = i, this.state = r, this.type = $e.ResolveStart
    }

    toString() {
        return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
    }
}, Ld = class extends Tt {
    constructor(e, n, i, r) {
        super(e, n), this.urlAfterRedirects = i, this.state = r, this.type = $e.ResolveEnd
    }

    toString() {
        return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
    }
}, Vd = class {
    constructor(e) {
        this.route = e, this.type = $e.RouteConfigLoadStart
    }

    toString() {
        return `RouteConfigLoadStart(path: ${this.route.path})`
    }
}, jd = class {
    constructor(e) {
        this.route = e, this.type = $e.RouteConfigLoadEnd
    }

    toString() {
        return `RouteConfigLoadEnd(path: ${this.route.path})`
    }
}, $d = class {
    constructor(e) {
        this.snapshot = e, this.type = $e.ChildActivationStart
    }

    toString() {
        return `ChildActivationStart(path: '${this.snapshot.routeConfig && this.snapshot.routeConfig.path || ""}')`
    }
}, Bd = class {
    constructor(e) {
        this.snapshot = e, this.type = $e.ChildActivationEnd
    }

    toString() {
        return `ChildActivationEnd(path: '${this.snapshot.routeConfig && this.snapshot.routeConfig.path || ""}')`
    }
}, Hd = class {
    constructor(e) {
        this.snapshot = e, this.type = $e.ActivationStart
    }

    toString() {
        return `ActivationStart(path: '${this.snapshot.routeConfig && this.snapshot.routeConfig.path || ""}')`
    }
}, Ud = class {
    constructor(e) {
        this.snapshot = e, this.type = $e.ActivationEnd
    }

    toString() {
        return `ActivationEnd(path: '${this.snapshot.routeConfig && this.snapshot.routeConfig.path || ""}')`
    }
}, $a = class {
    constructor(e, n, i) {
        this.routerEvent = e, this.position = n, this.anchor = i, this.type = $e.Scroll
    }

    toString() {
        let e = this.position ? `${this.position[0]}, ${this.position[1]}` : null;
        return `Scroll(anchor: '${this.anchor}', position: '${e}')`
    }
}, Do = class {
}, Io = class {
    constructor(e) {
        this.url = e
    }
};
var zd = class {
    constructor() {
        this.outlet = null, this.route = null, this.injector = null, this.children = new No, this.attachRef = null
    }
}, No = (() => {
    let e = class e {
        constructor() {
            this.contexts = new Map
        }

        onChildOutletCreated(i, r) {
            let o = this.getOrCreateContext(i);
            o.outlet = r, this.contexts.set(i, o)
        }

        onChildOutletDestroyed(i) {
            let r = this.getContext(i);
            r && (r.outlet = null, r.attachRef = null)
        }

        onOutletDeactivated() {
            let i = this.contexts;
            return this.contexts = new Map, i
        }

        onOutletReAttached(i) {
            this.contexts = i
        }

        getOrCreateContext(i) {
            let r = this.getContext(i);
            return r || (r = new zd, this.contexts.set(i, r)), r
        }

        getContext(i) {
            return this.contexts.get(i) || null
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275prov = B({token: e, factory: e.\u0275fac, providedIn: "root"});
    let t = e;
    return t
})(), Ba = class {
    constructor(e) {
        this._root = e
    }

    get root() {
        return this._root.value
    }

    parent(e) {
        let n = this.pathFromRoot(e);
        return n.length > 1 ? n[n.length - 2] : null
    }

    children(e) {
        let n = Gd(e, this._root);
        return n ? n.children.map(i => i.value) : []
    }

    firstChild(e) {
        let n = Gd(e, this._root);
        return n && n.children.length > 0 ? n.children[0].value : null
    }

    siblings(e) {
        let n = qd(e, this._root);
        return n.length < 2 ? [] : n[n.length - 2].children.map(r => r.value).filter(r => r !== e)
    }

    pathFromRoot(e) {
        return qd(e, this._root).map(n => n.value)
    }
};

function Gd(t, e) {
    if (t === e.value) return e;
    for (let n of e.children) {
        let i = Gd(t, n);
        if (i) return i
    }
    return null
}

function qd(t, e) {
    if (t === e.value) return [e];
    for (let n of e.children) {
        let i = qd(t, n);
        if (i.length) return i.unshift(e), i
    }
    return []
}

var vt = class {
    constructor(e, n) {
        this.value = e, this.children = n
    }

    toString() {
        return `TreeNode(${this.value})`
    }
};

function pr(t) {
    let e = {};
    return t && t.children.forEach(n => e[n.value.outlet] = n), e
}

var Ha = class extends Ba {
    constructor(e, n) {
        super(e), this.snapshot = n, nf(this, e)
    }

    toString() {
        return this.snapshot.toString()
    }
};

function Bv(t) {
    let e = OI(t), n = new Ue([new wi("", {})]), i = new Ue({}), r = new Ue({}), o = new Ue({}), s = new Ue(""),
        a = new xt(n, i, o, s, r, te, t, e.root);
    return a.snapshot = e.root, new Ha(new vt(a, []), e)
}

function OI(t) {
    let e = {}, n = {}, i = {}, r = "", o = new Mo([], e, i, r, n, te, t, null, {});
    return new Ua("", new vt(o, []))
}

var xt = class {
    constructor(e, n, i, r, o, s, a, l) {
        this.urlSubject = e, this.paramsSubject = n, this.queryParamsSubject = i, this.fragmentSubject = r, this.dataSubject = o, this.outlet = s, this.component = a, this._futureSnapshot = l, this.title = this.dataSubject?.pipe(ie(c => c[Ao])) ?? q(void 0), this.url = e, this.params = n, this.queryParams = i, this.fragment = r, this.data = o
    }

    get routeConfig() {
        return this._futureSnapshot.routeConfig
    }

    get root() {
        return this._routerState.root
    }

    get parent() {
        return this._routerState.parent(this)
    }

    get firstChild() {
        return this._routerState.firstChild(this)
    }

    get children() {
        return this._routerState.children(this)
    }

    get pathFromRoot() {
        return this._routerState.pathFromRoot(this)
    }

    get paramMap() {
        return this._paramMap ??= this.params.pipe(ie(e => gr(e))), this._paramMap
    }

    get queryParamMap() {
        return this._queryParamMap ??= this.queryParams.pipe(ie(e => gr(e))), this._queryParamMap
    }

    toString() {
        return this.snapshot ? this.snapshot.toString() : `Future(${this._futureSnapshot})`
    }
};

function tf(t, e, n = "emptyOnly") {
    let i, {routeConfig: r} = t;
    return e !== null && (n === "always" || r?.path === "" || !e.component && !e.routeConfig?.loadComponent) ? i = {
        params: k(k({}, e.params), t.params),
        data: k(k({}, e.data), t.data),
        resolve: k(k(k(k({}, t.data), e.data), r?.data), t._resolvedData)
    } : i = {
        params: k({}, t.params),
        data: k({}, t.data),
        resolve: k(k({}, t.data), t._resolvedData ?? {})
    }, r && Uv(r) && (i.resolve[Ao] = r.title), i
}

var Mo = class {
    get title() {
        return this.data?.[Ao]
    }

    constructor(e, n, i, r, o, s, a, l, c) {
        this.url = e, this.params = n, this.queryParams = i, this.fragment = r, this.data = o, this.outlet = s, this.component = a, this.routeConfig = l, this._resolve = c
    }

    get root() {
        return this._routerState.root
    }

    get parent() {
        return this._routerState.parent(this)
    }

    get firstChild() {
        return this._routerState.firstChild(this)
    }

    get children() {
        return this._routerState.children(this)
    }

    get pathFromRoot() {
        return this._routerState.pathFromRoot(this)
    }

    get paramMap() {
        return this._paramMap ??= gr(this.params), this._paramMap
    }

    get queryParamMap() {
        return this._queryParamMap ??= gr(this.queryParams), this._queryParamMap
    }

    toString() {
        let e = this.url.map(i => i.toString()).join("/"), n = this.routeConfig ? this.routeConfig.path : "";
        return `Route(url:'${e}', path:'${n}')`
    }
}, Ua = class extends Ba {
    constructor(e, n) {
        super(n), this.url = e, nf(this, n)
    }

    toString() {
        return Hv(this._root)
    }
};

function nf(t, e) {
    e.value._routerState = t, e.children.forEach(n => nf(t, n))
}

function Hv(t) {
    let e = t.children.length > 0 ? ` { ${t.children.map(Hv).join(", ")} } ` : "";
    return `${t.value}${e}`
}

function _d(t) {
    if (t.snapshot) {
        let e = t.snapshot, n = t._futureSnapshot;
        t.snapshot = n, Jt(e.queryParams, n.queryParams) || t.queryParamsSubject.next(n.queryParams), e.fragment !== n.fragment && t.fragmentSubject.next(n.fragment), Jt(e.params, n.params) || t.paramsSubject.next(n.params), aI(e.url, n.url) || t.urlSubject.next(n.url), Jt(e.data, n.data) || t.dataSubject.next(n.data)
    } else t.snapshot = t._futureSnapshot, t.dataSubject.next(t._futureSnapshot.data)
}

function Wd(t, e) {
    let n = Jt(t.params, e.params) && dI(t.url, e.url), i = !t.parent != !e.parent;
    return n && !i && (!t.parent || Wd(t.parent, e.parent))
}

function Uv(t) {
    return typeof t.title == "string" || t.title === null
}

var rf = (() => {
    let e = class e {
        constructor() {
            this.activated = null, this._activatedRoute = null, this.name = te, this.activateEvents = new ke, this.deactivateEvents = new ke, this.attachEvents = new ke, this.detachEvents = new ke, this.parentContexts = N(No), this.location = N(jn), this.changeDetector = N(yi), this.environmentInjector = N(gt), this.inputBinder = N(Wa, {optional: !0}), this.supportsBindingToComponentInputs = !0
        }

        get activatedComponentRef() {
            return this.activated
        }

        ngOnChanges(i) {
            if (i.name) {
                let {firstChange: r, previousValue: o} = i.name;
                if (r) return;
                this.isTrackedInParentContexts(o) && (this.deactivate(), this.parentContexts.onChildOutletDestroyed(o)), this.initializeOutletWithName()
            }
        }

        ngOnDestroy() {
            this.isTrackedInParentContexts(this.name) && this.parentContexts.onChildOutletDestroyed(this.name), this.inputBinder?.unsubscribeFromRouteData(this)
        }

        isTrackedInParentContexts(i) {
            return this.parentContexts.getContext(i)?.outlet === this
        }

        ngOnInit() {
            this.initializeOutletWithName()
        }

        initializeOutletWithName() {
            if (this.parentContexts.onChildOutletCreated(this.name, this), this.activated) return;
            let i = this.parentContexts.getContext(this.name);
            i?.route && (i.attachRef ? this.attach(i.attachRef, i.route) : this.activateWith(i.route, i.injector))
        }

        get isActivated() {
            return !!this.activated
        }

        get component() {
            if (!this.activated) throw new _(4012, !1);
            return this.activated.instance
        }

        get activatedRoute() {
            if (!this.activated) throw new _(4012, !1);
            return this._activatedRoute
        }

        get activatedRouteData() {
            return this._activatedRoute ? this._activatedRoute.snapshot.data : {}
        }

        detach() {
            if (!this.activated) throw new _(4012, !1);
            this.location.detach();
            let i = this.activated;
            return this.activated = null, this._activatedRoute = null, this.detachEvents.emit(i.instance), i
        }

        attach(i, r) {
            this.activated = i, this._activatedRoute = r, this.location.insert(i.hostView), this.inputBinder?.bindActivatedRouteToOutletComponent(this), this.attachEvents.emit(i.instance)
        }

        deactivate() {
            if (this.activated) {
                let i = this.component;
                this.activated.destroy(), this.activated = null, this._activatedRoute = null, this.deactivateEvents.emit(i)
            }
        }

        activateWith(i, r) {
            if (this.isActivated) throw new _(4013, !1);
            this._activatedRoute = i;
            let o = this.location, a = i.snapshot.component,
                l = this.parentContexts.getOrCreateContext(this.name).children, c = new Yd(i, l, o.injector);
            this.activated = o.createComponent(a, {
                index: o.length,
                injector: c,
                environmentInjector: r ?? this.environmentInjector
            }), this.changeDetector.markForCheck(), this.inputBinder?.bindActivatedRouteToOutletComponent(this), this.activateEvents.emit(this.activated.instance)
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275dir = Ve({
        type: e,
        selectors: [["router-outlet"]],
        inputs: {name: "name"},
        outputs: {
            activateEvents: "activate",
            deactivateEvents: "deactivate",
            attachEvents: "attach",
            detachEvents: "detach"
        },
        exportAs: ["outlet"],
        standalone: !0,
        features: [hn]
    });
    let t = e;
    return t
})(), Yd = class {
    constructor(e, n, i) {
        this.route = e, this.childContexts = n, this.parent = i, this.__ngOutletInjector = !0
    }

    get(e, n) {
        return e === xt ? this.route : e === No ? this.childContexts : this.parent.get(e, n)
    }
}, Wa = new Z(""), Cv = (() => {
    let e = class e {
        constructor() {
            this.outletDataSubscriptions = new Map
        }

        bindActivatedRouteToOutletComponent(i) {
            this.unsubscribeFromRouteData(i), this.subscribeToRouteData(i)
        }

        unsubscribeFromRouteData(i) {
            this.outletDataSubscriptions.get(i)?.unsubscribe(), this.outletDataSubscriptions.delete(i)
        }

        subscribeToRouteData(i) {
            let {activatedRoute: r} = i,
                o = Br([r.queryParams, r.params, r.data]).pipe(nt(([s, a, l], c) => (l = k(k(k({}, s), a), l), c === 0 ? q(l) : Promise.resolve(l)))).subscribe(s => {
                    if (!i.isActivated || !i.activatedComponentRef || i.activatedRoute !== r || r.component === null) {
                        this.unsubscribeFromRouteData(i);
                        return
                    }
                    let a = Zg(r.component);
                    if (!a) {
                        this.unsubscribeFromRouteData(i);
                        return
                    }
                    for (let {templateName: l} of a.inputs) i.activatedComponentRef.setInput(l, s[l])
                });
            this.outletDataSubscriptions.set(i, o)
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275prov = B({token: e, factory: e.\u0275fac});
    let t = e;
    return t
})();

function PI(t, e, n) {
    let i = _o(t, e._root, n ? n._root : void 0);
    return new Ha(i, e)
}

function _o(t, e, n) {
    if (n && t.shouldReuseRoute(e.value, n.value.snapshot)) {
        let i = n.value;
        i._futureSnapshot = e.value;
        let r = kI(t, e, n);
        return new vt(i, r)
    } else {
        if (t.shouldAttach(e.value)) {
            let o = t.retrieve(e.value);
            if (o !== null) {
                let s = o.route;
                return s.value._futureSnapshot = e.value, s.children = e.children.map(a => _o(t, a)), s
            }
        }
        let i = FI(e.value), r = e.children.map(o => _o(t, o));
        return new vt(i, r)
    }
}

function kI(t, e, n) {
    return e.children.map(i => {
        for (let r of n.children) if (t.shouldReuseRoute(i.value, r.value.snapshot)) return _o(t, i, r);
        return _o(t, i)
    })
}

function FI(t) {
    return new xt(new Ue(t.url), new Ue(t.params), new Ue(t.queryParams), new Ue(t.fragment), new Ue(t.data), t.outlet, t.component, t)
}

var zv = "ngNavigationCancelingError";

function Gv(t, e) {
    let {redirectTo: n, navigationBehaviorOptions: i} = vr(e) ? {redirectTo: e, navigationBehaviorOptions: void 0} : e,
        r = qv(!1, yt.Redirect);
    return r.url = n, r.navigationBehaviorOptions = i, r
}

function qv(t, e) {
    let n = new Error(`NavigationCancelingError: ${t || ""}`);
    return n[zv] = !0, n.cancellationCode = e, n
}

function RI(t) {
    return Wv(t) && vr(t.url)
}

function Wv(t) {
    return !!t && t[zv]
}

var LI = (() => {
    let e = class e {
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275cmp = T({
        type: e,
        selectors: [["ng-component"]],
        standalone: !0,
        features: [x],
        decls: 1,
        vars: 0,
        template: function (r, o) {
            r & 1 && v(0, "router-outlet")
        },
        dependencies: [rf],
        encapsulation: 2
    });
    let t = e;
    return t
})();

function VI(t, e) {
    return t.providers && !t._injector && (t._injector = wa(t.providers, e, `Route: ${t.path}`)), t._injector ?? e
}

function of(t) {
    let e = t.children && t.children.map(of), n = e ? Se(k({}, t), {children: e}) : k({}, t);
    return !n.component && !n.loadComponent && (e || n.loadChildren) && n.outlet && n.outlet !== te && (n.component = LI), n
}

function en(t) {
    return t.outlet || te
}

function jI(t, e) {
    let n = t.filter(i => en(i) === e);
    return n.push(...t.filter(i => en(i) !== e)), n
}

function Oo(t) {
    if (!t) return null;
    if (t.routeConfig?._injector) return t.routeConfig._injector;
    for (let e = t.parent; e; e = e.parent) {
        let n = e.routeConfig;
        if (n?._loadedInjector) return n._loadedInjector;
        if (n?._injector) return n._injector
    }
    return null
}

var $I = (t, e, n, i) => ie(r => (new Qd(e, r.targetRouterState, r.currentRouterState, n, i).activate(t), r)),
    Qd = class {
        constructor(e, n, i, r, o) {
            this.routeReuseStrategy = e, this.futureState = n, this.currState = i, this.forwardEvent = r, this.inputBindingEnabled = o
        }

        activate(e) {
            let n = this.futureState._root, i = this.currState ? this.currState._root : null;
            this.deactivateChildRoutes(n, i, e), _d(this.futureState.root), this.activateChildRoutes(n, i, e)
        }

        deactivateChildRoutes(e, n, i) {
            let r = pr(n);
            e.children.forEach(o => {
                let s = o.value.outlet;
                this.deactivateRoutes(o, r[s], i), delete r[s]
            }), Object.values(r).forEach(o => {
                this.deactivateRouteAndItsChildren(o, i)
            })
        }

        deactivateRoutes(e, n, i) {
            let r = e.value, o = n ? n.value : null;
            if (r === o) if (r.component) {
                let s = i.getContext(r.outlet);
                s && this.deactivateChildRoutes(e, n, s.children)
            } else this.deactivateChildRoutes(e, n, i); else o && this.deactivateRouteAndItsChildren(n, i)
        }

        deactivateRouteAndItsChildren(e, n) {
            e.value.component && this.routeReuseStrategy.shouldDetach(e.value.snapshot) ? this.detachAndStoreRouteSubtree(e, n) : this.deactivateRouteAndOutlet(e, n)
        }

        detachAndStoreRouteSubtree(e, n) {
            let i = n.getContext(e.value.outlet), r = i && e.value.component ? i.children : n, o = pr(e);
            for (let s of Object.values(o)) this.deactivateRouteAndItsChildren(s, r);
            if (i && i.outlet) {
                let s = i.outlet.detach(), a = i.children.onOutletDeactivated();
                this.routeReuseStrategy.store(e.value.snapshot, {componentRef: s, route: e, contexts: a})
            }
        }

        deactivateRouteAndOutlet(e, n) {
            let i = n.getContext(e.value.outlet), r = i && e.value.component ? i.children : n, o = pr(e);
            for (let s of Object.values(o)) this.deactivateRouteAndItsChildren(s, r);
            i && (i.outlet && (i.outlet.deactivate(), i.children.onOutletDeactivated()), i.attachRef = null, i.route = null)
        }

        activateChildRoutes(e, n, i) {
            let r = pr(n);
            e.children.forEach(o => {
                this.activateRoutes(o, r[o.value.outlet], i), this.forwardEvent(new Ud(o.value.snapshot))
            }), e.children.length && this.forwardEvent(new Bd(e.value.snapshot))
        }

        activateRoutes(e, n, i) {
            let r = e.value, o = n ? n.value : null;
            if (_d(r), r === o) if (r.component) {
                let s = i.getOrCreateContext(r.outlet);
                this.activateChildRoutes(e, n, s.children)
            } else this.activateChildRoutes(e, n, i); else if (r.component) {
                let s = i.getOrCreateContext(r.outlet);
                if (this.routeReuseStrategy.shouldAttach(r.snapshot)) {
                    let a = this.routeReuseStrategy.retrieve(r.snapshot);
                    this.routeReuseStrategy.store(r.snapshot, null), s.children.onOutletReAttached(a.contexts), s.attachRef = a.componentRef, s.route = a.route.value, s.outlet && s.outlet.attach(a.componentRef, a.route.value), _d(a.route.value), this.activateChildRoutes(e, null, s.children)
                } else {
                    let a = Oo(r.snapshot);
                    s.attachRef = null, s.route = r, s.injector = a, s.outlet && s.outlet.activateWith(r, s.injector), this.activateChildRoutes(e, null, s.children)
                }
            } else this.activateChildRoutes(e, null, i)
        }
    }, za = class {
        constructor(e) {
            this.path = e, this.route = this.path[this.path.length - 1]
        }
    }, mr = class {
        constructor(e, n) {
            this.component = e, this.route = n
        }
    };

function BI(t, e, n) {
    let i = t._root, r = e ? e._root : null;
    return go(i, r, n, [i.value])
}

function HI(t) {
    let e = t.routeConfig ? t.routeConfig.canActivateChild : null;
    return !e || e.length === 0 ? null : {node: t, guards: e}
}

function Er(t, e) {
    let n = Symbol(), i = e.get(t, n);
    return i === n ? typeof t == "function" && !Ph(t) ? t : e.get(t) : i
}

function go(t, e, n, i, r = {canDeactivateChecks: [], canActivateChecks: []}) {
    let o = pr(e);
    return t.children.forEach(s => {
        UI(s, o[s.value.outlet], n, i.concat([s.value]), r), delete o[s.value.outlet]
    }), Object.entries(o).forEach(([s, a]) => bo(a, n.getContext(s), r)), r
}

function UI(t, e, n, i, r = {canDeactivateChecks: [], canActivateChecks: []}) {
    let o = t.value, s = e ? e.value : null, a = n ? n.getContext(t.value.outlet) : null;
    if (s && o.routeConfig === s.routeConfig) {
        let l = zI(s, o, o.routeConfig.runGuardsAndResolvers);
        l ? r.canActivateChecks.push(new za(i)) : (o.data = s.data, o._resolvedData = s._resolvedData), o.component ? go(t, e, a ? a.children : null, i, r) : go(t, e, n, i, r), l && a && a.outlet && a.outlet.isActivated && r.canDeactivateChecks.push(new mr(a.outlet.component, s))
    } else s && bo(e, a, r), r.canActivateChecks.push(new za(i)), o.component ? go(t, null, a ? a.children : null, i, r) : go(t, null, n, i, r);
    return r
}

function zI(t, e, n) {
    if (typeof n == "function") return n(t, e);
    switch (n) {
        case"pathParamsChange":
            return !bi(t.url, e.url);
        case"pathParamsOrQueryParamsChange":
            return !bi(t.url, e.url) || !Jt(t.queryParams, e.queryParams);
        case"always":
            return !0;
        case"paramsOrQueryParamsChange":
            return !Wd(t, e) || !Jt(t.queryParams, e.queryParams);
        case"paramsChange":
        default:
            return !Wd(t, e)
    }
}

function bo(t, e, n) {
    let i = pr(t), r = t.value;
    Object.entries(i).forEach(([o, s]) => {
        r.component ? e ? bo(s, e.children.getContext(o), n) : bo(s, null, n) : bo(s, e, n)
    }), r.component ? e && e.outlet && e.outlet.isActivated ? n.canDeactivateChecks.push(new mr(e.outlet.component, r)) : n.canDeactivateChecks.push(new mr(null, r)) : n.canDeactivateChecks.push(new mr(null, r))
}

function Po(t) {
    return typeof t == "function"
}

function GI(t) {
    return typeof t == "boolean"
}

function qI(t) {
    return t && Po(t.canLoad)
}

function WI(t) {
    return t && Po(t.canActivate)
}

function YI(t) {
    return t && Po(t.canActivateChild)
}

function QI(t) {
    return t && Po(t.canDeactivate)
}

function XI(t) {
    return t && Po(t.canMatch)
}

function Yv(t) {
    return t instanceof rn || t?.name === "EmptyError"
}

var Oa = Symbol("INITIAL_VALUE");

function wr() {
    return nt(t => Br(t.map(e => e.pipe(on(1), Ql(Oa)))).pipe(ie(e => {
        for (let n of e) if (n !== !0) {
            if (n === Oa) return Oa;
            if (n === !1 || n instanceof Hn) return n
        }
        return !0
    }), Dt(e => e !== Oa), on(1)))
}

function KI(t, e) {
    return Pe(n => {
        let {targetSnapshot: i, currentSnapshot: r, guards: {canActivateChecks: o, canDeactivateChecks: s}} = n;
        return s.length === 0 && o.length === 0 ? q(Se(k({}, n), {guardsResult: !0})) : ZI(s, i, r, t).pipe(Pe(a => a && GI(a) ? JI(i, o, t, e) : q(a)), ie(a => Se(k({}, n), {guardsResult: a})))
    })
}

function ZI(t, e, n, i) {
    return Te(t).pipe(Pe(r => rM(r.component, r.route, n, e, i)), Ut(r => r !== !0, !0))
}

function JI(t, e, n, i) {
    return Te(e).pipe(ti(r => $i(tM(r.route.parent, i), eM(r.route, i), iM(t, r.path, n), nM(t, r.route, n))), Ut(r => r !== !0, !0))
}

function eM(t, e) {
    return t !== null && e && e(new Hd(t)), q(!0)
}

function tM(t, e) {
    return t !== null && e && e(new $d(t)), q(!0)
}

function nM(t, e, n) {
    let i = e.routeConfig ? e.routeConfig.canActivate : null;
    if (!i || i.length === 0) return q(!0);
    let r = i.map(o => Ss(() => {
        let s = Oo(e) ?? n, a = Er(o, s), l = WI(a) ? a.canActivate(e, t) : dn(s, () => a(e, t));
        return Gn(l).pipe(Ut())
    }));
    return q(r).pipe(wr())
}

function iM(t, e, n) {
    let i = e[e.length - 1],
        o = e.slice(0, e.length - 1).reverse().map(s => HI(s)).filter(s => s !== null).map(s => Ss(() => {
            let a = s.guards.map(l => {
                let c = Oo(s.node) ?? n, f = Er(l, c), p = YI(f) ? f.canActivateChild(i, t) : dn(c, () => f(i, t));
                return Gn(p).pipe(Ut())
            });
            return q(a).pipe(wr())
        }));
    return q(o).pipe(wr())
}

function rM(t, e, n, i, r) {
    let o = e && e.routeConfig ? e.routeConfig.canDeactivate : null;
    if (!o || o.length === 0) return q(!0);
    let s = o.map(a => {
        let l = Oo(e) ?? r, c = Er(a, l), f = QI(c) ? c.canDeactivate(t, e, n, i) : dn(l, () => c(t, e, n, i));
        return Gn(f).pipe(Ut())
    });
    return q(s).pipe(wr())
}

function oM(t, e, n, i) {
    let r = e.canLoad;
    if (r === void 0 || r.length === 0) return q(!0);
    let o = r.map(s => {
        let a = Er(s, t), l = qI(a) ? a.canLoad(e, n) : dn(t, () => a(e, n));
        return Gn(l)
    });
    return q(o).pipe(wr(), Qv(i))
}

function Qv(t) {
    return $l(ze(e => {
        if (vr(e)) throw Gv(t, e)
    }), ie(e => e === !0))
}

function sM(t, e, n, i) {
    let r = e.canMatch;
    if (!r || r.length === 0) return q(!0);
    let o = r.map(s => {
        let a = Er(s, t), l = XI(a) ? a.canMatch(e, n) : dn(t, () => a(e, n));
        return Gn(l)
    });
    return q(o).pipe(wr(), Qv(i))
}

var To = class {
    constructor(e) {
        this.segmentGroup = e || null
    }
}, Ga = class extends Error {
    constructor(e) {
        super(), this.urlTree = e
    }
};

function fr(t) {
    return ji(new To(t))
}

function aM(t) {
    return ji(new _(4e3, !1))
}

function lM(t) {
    return ji(qv(!1, yt.GuardRejected))
}

var Xd = class {
    constructor(e, n) {
        this.urlSerializer = e, this.urlTree = n
    }

    lineralizeSegments(e, n) {
        let i = [], r = n.root;
        for (; ;) {
            if (i = i.concat(r.segments), r.numberOfChildren === 0) return q(i);
            if (r.numberOfChildren > 1 || !r.children[te]) return aM(e.redirectTo);
            r = r.children[te]
        }
    }

    applyRedirectCommands(e, n, i) {
        let r = this.applyRedirectCreateUrlTree(n, this.urlSerializer.parse(n), e, i);
        if (n.startsWith("/")) throw new Ga(r);
        return r
    }

    applyRedirectCreateUrlTree(e, n, i, r) {
        let o = this.createSegmentGroup(e, n.root, i, r);
        return new Hn(o, this.createQueryParams(n.queryParams, this.urlTree.queryParams), n.fragment)
    }

    createQueryParams(e, n) {
        let i = {};
        return Object.entries(e).forEach(([r, o]) => {
            if (typeof o == "string" && o.startsWith(":")) {
                let a = o.substring(1);
                i[r] = n[a]
            } else i[r] = o
        }), i
    }

    createSegmentGroup(e, n, i, r) {
        let o = this.createSegments(e, n.segments, i, r), s = {};
        return Object.entries(n.children).forEach(([a, l]) => {
            s[a] = this.createSegmentGroup(e, l, i, r)
        }), new be(o, s)
    }

    createSegments(e, n, i, r) {
        return n.map(o => o.path.startsWith(":") ? this.findPosParam(e, o, r) : this.findOrReturn(o, i))
    }

    findPosParam(e, n, i) {
        let r = i[n.path.substring(1)];
        if (!r) throw new _(4001, !1);
        return r
    }

    findOrReturn(e, n) {
        let i = 0;
        for (let r of n) {
            if (r.path === e.path) return n.splice(i), r;
            i++
        }
        return e
    }
}, Kd = {matched: !1, consumedSegments: [], remainingSegments: [], parameters: {}, positionalParamSegments: {}};

function cM(t, e, n, i, r) {
    let o = sf(t, e, n);
    return o.matched ? (i = VI(e, i), sM(i, e, n, r).pipe(ie(s => s === !0 ? o : k({}, Kd)))) : q(o)
}

function sf(t, e, n) {
    if (e.path === "**") return uM(n);
    if (e.path === "") return e.pathMatch === "full" && (t.hasChildren() || n.length > 0) ? k({}, Kd) : {
        matched: !0,
        consumedSegments: [],
        remainingSegments: n,
        parameters: {},
        positionalParamSegments: {}
    };
    let r = (e.matcher || sI)(n, t, e);
    if (!r) return k({}, Kd);
    let o = {};
    Object.entries(r.posParams ?? {}).forEach(([a, l]) => {
        o[a] = l.path
    });
    let s = r.consumed.length > 0 ? k(k({}, o), r.consumed[r.consumed.length - 1].parameters) : o;
    return {
        matched: !0,
        consumedSegments: r.consumed,
        remainingSegments: n.slice(r.consumed.length),
        parameters: s,
        positionalParamSegments: r.posParams ?? {}
    }
}

function uM(t) {
    return {
        matched: !0,
        parameters: t.length > 0 ? Tv(t).parameters : {},
        consumedSegments: t,
        remainingSegments: [],
        positionalParamSegments: {}
    }
}

function Dv(t, e, n, i) {
    return n.length > 0 && pM(t, n, i) ? {
        segmentGroup: new be(e, fM(i, new be(n, t.children))),
        slicedSegments: []
    } : n.length === 0 && hM(t, n, i) ? {
        segmentGroup: new be(t.segments, dM(t, n, i, t.children)),
        slicedSegments: n
    } : {segmentGroup: new be(t.segments, t.children), slicedSegments: n}
}

function dM(t, e, n, i) {
    let r = {};
    for (let o of n) if (Ya(t, e, o) && !i[en(o)]) {
        let s = new be([], {});
        r[en(o)] = s
    }
    return k(k({}, i), r)
}

function fM(t, e) {
    let n = {};
    n[te] = e;
    for (let i of t) if (i.path === "" && en(i) !== te) {
        let r = new be([], {});
        n[en(i)] = r
    }
    return n
}

function pM(t, e, n) {
    return n.some(i => Ya(t, e, i) && en(i) !== te)
}

function hM(t, e, n) {
    return n.some(i => Ya(t, e, i))
}

function Ya(t, e, n) {
    return (t.hasChildren() || e.length > 0) && n.pathMatch === "full" ? !1 : n.path === ""
}

function mM(t, e, n, i) {
    return en(t) !== i && (i === te || !Ya(e, n, t)) ? !1 : sf(e, t, n).matched
}

function gM(t, e, n) {
    return e.length === 0 && !t.children[n]
}

var Zd = class {
};

function vM(t, e, n, i, r, o, s = "emptyOnly") {
    return new Jd(t, e, n, i, r, s, o).recognize()
}

var yM = 31, Jd = class {
    constructor(e, n, i, r, o, s, a) {
        this.injector = e, this.configLoader = n, this.rootComponentType = i, this.config = r, this.urlTree = o, this.paramsInheritanceStrategy = s, this.urlSerializer = a, this.applyRedirects = new Xd(this.urlSerializer, this.urlTree), this.absoluteRedirectCount = 0, this.allowRedirects = !0
    }

    noMatchError(e) {
        return new _(4002, `'${e.segmentGroup}'`)
    }

    recognize() {
        let e = Dv(this.urlTree.root, [], [], this.config).segmentGroup;
        return this.match(e).pipe(ie(n => {
            let i = new Mo([], Object.freeze({}), Object.freeze(k({}, this.urlTree.queryParams)), this.urlTree.fragment, {}, te, this.rootComponentType, null, {}),
                r = new vt(i, n), o = new Ua("", r), s = II(i, [], this.urlTree.queryParams, this.urlTree.fragment);
            return s.queryParams = this.urlTree.queryParams, o.url = this.urlSerializer.serialize(s), this.inheritParamsAndData(o._root, null), {
                state: o,
                tree: s
            }
        }))
    }

    match(e) {
        return this.processSegmentGroup(this.injector, this.config, e, te).pipe(xn(i => {
            if (i instanceof Ga) return this.urlTree = i.urlTree, this.match(i.urlTree.root);
            throw i instanceof To ? this.noMatchError(i) : i
        }))
    }

    inheritParamsAndData(e, n) {
        let i = e.value, r = tf(i, n, this.paramsInheritanceStrategy);
        i.params = Object.freeze(r.params), i.data = Object.freeze(r.data), e.children.forEach(o => this.inheritParamsAndData(o, i))
    }

    processSegmentGroup(e, n, i, r) {
        return i.segments.length === 0 && i.hasChildren() ? this.processChildren(e, n, i) : this.processSegment(e, n, i, i.segments, r, !0).pipe(ie(o => o instanceof vt ? [o] : []))
    }

    processChildren(e, n, i) {
        let r = [];
        for (let o of Object.keys(i.children)) o === "primary" ? r.unshift(o) : r.push(o);
        return Te(r).pipe(ti(o => {
            let s = i.children[o], a = jI(n, o);
            return this.processSegmentGroup(e, a, s, o)
        }), Yl((o, s) => (o.push(...s), o)), An(null), Wl(), Pe(o => {
            if (o === null) return fr(i);
            let s = Xv(o);
            return wM(s), q(s)
        }))
    }

    processSegment(e, n, i, r, o, s) {
        return Te(n).pipe(ti(a => this.processSegmentAgainstRoute(a._injector ?? e, n, a, i, r, o, s).pipe(xn(l => {
            if (l instanceof To) return q(null);
            throw l
        }))), Ut(a => !!a), xn(a => {
            if (Yv(a)) return gM(i, r, o) ? q(new Zd) : fr(i);
            throw a
        }))
    }

    processSegmentAgainstRoute(e, n, i, r, o, s, a) {
        return mM(i, r, o, s) ? i.redirectTo === void 0 ? this.matchSegmentAgainstRoute(e, r, i, o, s) : this.allowRedirects && a ? this.expandSegmentAgainstRouteUsingRedirect(e, r, n, i, o, s) : fr(r) : fr(r)
    }

    expandSegmentAgainstRouteUsingRedirect(e, n, i, r, o, s) {
        let {matched: a, consumedSegments: l, positionalParamSegments: c, remainingSegments: f} = sf(n, r, o);
        if (!a) return fr(n);
        r.redirectTo.startsWith("/") && (this.absoluteRedirectCount++, this.absoluteRedirectCount > yM && (this.allowRedirects = !1));
        let p = this.applyRedirects.applyRedirectCommands(l, r.redirectTo, c);
        return this.applyRedirects.lineralizeSegments(r, p).pipe(Pe(m => this.processSegment(e, i, n, m.concat(f), s, !1)))
    }

    matchSegmentAgainstRoute(e, n, i, r, o) {
        let s = cM(n, i, r, e, this.urlSerializer);
        return i.path === "**" && (n.children = {}), s.pipe(nt(a => a.matched ? (e = i._injector ?? e, this.getChildConfig(e, i, r).pipe(nt(({routes: l}) => {
            let c = i._loadedInjector ?? e, {consumedSegments: f, remainingSegments: p, parameters: m} = a,
                g = new Mo(f, m, Object.freeze(k({}, this.urlTree.queryParams)), this.urlTree.fragment, EM(i), en(i), i.component ?? i._loadedComponent ?? null, i, SM(i)), {
                    segmentGroup: b,
                    slicedSegments: E
                } = Dv(n, f, p, l);
            if (E.length === 0 && b.hasChildren()) return this.processChildren(c, l, b).pipe(ie(w => w === null ? null : new vt(g, w)));
            if (l.length === 0 && E.length === 0) return q(new vt(g, []));
            let M = en(i) === o;
            return this.processSegment(c, l, b, E, M ? te : o, !0).pipe(ie(w => new vt(g, w instanceof vt ? [w] : [])))
        }))) : fr(n)))
    }

    getChildConfig(e, n, i) {
        return n.children ? q({
            routes: n.children,
            injector: e
        }) : n.loadChildren ? n._loadedRoutes !== void 0 ? q({
            routes: n._loadedRoutes,
            injector: n._loadedInjector
        }) : oM(e, n, i, this.urlSerializer).pipe(Pe(r => r ? this.configLoader.loadChildren(e, n).pipe(ze(o => {
            n._loadedRoutes = o.routes, n._loadedInjector = o.injector
        })) : lM(n))) : q({routes: [], injector: e})
    }
};

function wM(t) {
    t.sort((e, n) => e.value.outlet === te ? -1 : n.value.outlet === te ? 1 : e.value.outlet.localeCompare(n.value.outlet))
}

function bM(t) {
    let e = t.value.routeConfig;
    return e && e.path === ""
}

function Xv(t) {
    let e = [], n = new Set;
    for (let i of t) {
        if (!bM(i)) {
            e.push(i);
            continue
        }
        let r = e.find(o => i.value.routeConfig === o.value.routeConfig);
        r !== void 0 ? (r.children.push(...i.children), n.add(r)) : e.push(i)
    }
    for (let i of n) {
        let r = Xv(i.children);
        e.push(new vt(i.value, r))
    }
    return e.filter(i => !n.has(i))
}

function EM(t) {
    return t.data || {}
}

function SM(t) {
    return t.resolve || {}
}

function CM(t, e, n, i, r, o) {
    return Pe(s => vM(t, e, n, i, s.extractedUrl, r, o).pipe(ie(({
                                                                     state: a,
                                                                     tree: l
                                                                 }) => Se(k({}, s), {
        targetSnapshot: a,
        urlAfterRedirects: l
    }))))
}

function DM(t, e) {
    return Pe(n => {
        let {targetSnapshot: i, guards: {canActivateChecks: r}} = n;
        if (!r.length) return q(n);
        let o = new Set(r.map(l => l.route)), s = new Set;
        for (let l of o) if (!s.has(l)) for (let c of Kv(l)) s.add(c);
        let a = 0;
        return Te(s).pipe(ti(l => o.has(l) ? IM(l, i, t, e) : (l.data = tf(l, l.parent, t).resolve, q(void 0))), ze(() => a++), Bi(1), Pe(l => a === s.size ? q(n) : ht))
    })
}

function Kv(t) {
    let e = t.children.map(n => Kv(n)).flat();
    return [t, ...e]
}

function IM(t, e, n, i) {
    let r = t.routeConfig, o = t._resolve;
    return r?.title !== void 0 && !Uv(r) && (o[Ao] = r.title), MM(o, t, e, i).pipe(ie(s => (t._resolvedData = s, t.data = tf(t, t.parent, n).resolve, null)))
}

function MM(t, e, n, i) {
    let r = Ad(t);
    if (r.length === 0) return q({});
    let o = {};
    return Te(r).pipe(Pe(s => _M(t[s], e, n, i).pipe(Ut(), ze(a => {
        o[s] = a
    }))), Bi(1), ql(o), xn(s => Yv(s) ? ht : ji(s)))
}

function _M(t, e, n, i) {
    let r = Oo(e) ?? i, o = Er(t, r), s = o.resolve ? o.resolve(e, n) : dn(r, () => o(e, n));
    return Gn(s)
}

function Td(t) {
    return nt(e => {
        let n = t(e);
        return n ? Te(n).pipe(ie(() => e)) : q(e)
    })
}

var Zv = (() => {
    let e = class e {
        buildTitle(i) {
            let r, o = i.root;
            for (; o !== void 0;) r = this.getResolvedTitleForRoute(o) ?? r, o = o.children.find(s => s.outlet === te);
            return r
        }

        getResolvedTitleForRoute(i) {
            return i.data[Ao]
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275prov = B({token: e, factory: () => N(TM), providedIn: "root"});
    let t = e;
    return t
})(), TM = (() => {
    let e = class e extends Zv {
        constructor(i) {
            super(), this.title = i
        }

        updateTitle(i) {
            let r = this.buildTitle(i);
            r !== void 0 && this.title.setTitle(r)
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)(X(yv))
    }, e.\u0275prov = B({token: e, factory: e.\u0275fac, providedIn: "root"});
    let t = e;
    return t
})(), ko = new Z("", {providedIn: "root", factory: () => ({})}), xo = new Z(""), af = (() => {
    let e = class e {
        constructor() {
            this.componentLoaders = new WeakMap, this.childrenLoaders = new WeakMap, this.compiler = N(Da)
        }

        loadComponent(i) {
            if (this.componentLoaders.get(i)) return this.componentLoaders.get(i);
            if (i._loadedComponent) return q(i._loadedComponent);
            this.onLoadStartListener && this.onLoadStartListener(i);
            let r = Gn(i.loadComponent()).pipe(ie(Jv), ze(s => {
                this.onLoadEndListener && this.onLoadEndListener(i), i._loadedComponent = s
            }), Hr(() => {
                this.componentLoaders.delete(i)
            })), o = new Vi(r, () => new Qe).pipe(Li());
            return this.componentLoaders.set(i, o), o
        }

        loadChildren(i, r) {
            if (this.childrenLoaders.get(r)) return this.childrenLoaders.get(r);
            if (r._loadedRoutes) return q({routes: r._loadedRoutes, injector: r._loadedInjector});
            this.onLoadStartListener && this.onLoadStartListener(r);
            let s = xM(r, this.compiler, i, this.onLoadEndListener).pipe(Hr(() => {
                this.childrenLoaders.delete(r)
            })), a = new Vi(s, () => new Qe).pipe(Li());
            return this.childrenLoaders.set(r, a), a
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275prov = B({token: e, factory: e.\u0275fac, providedIn: "root"});
    let t = e;
    return t
})();

function xM(t, e, n, i) {
    return Gn(t.loadChildren()).pipe(ie(Jv), Pe(r => r instanceof Kr || Array.isArray(r) ? q(r) : Te(e.compileModuleAsync(r))), ie(r => {
        i && i(t);
        let o, s, a = !1;
        return Array.isArray(r) ? (s = r, a = !0) : (o = r.create(n).injector, s = o.get(xo, [], {
            optional: !0,
            self: !0
        }).flat()), {routes: s.map(of), injector: o}
    }))
}

function AM(t) {
    return t && typeof t == "object" && "default" in t
}

function Jv(t) {
    return AM(t) ? t.default : t
}

var lf = (() => {
    let e = class e {
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275prov = B({token: e, factory: () => N(NM), providedIn: "root"});
    let t = e;
    return t
})(), NM = (() => {
    let e = class e {
        shouldProcessUrl(i) {
            return !0
        }

        extract(i) {
            return i
        }

        merge(i, r) {
            return i
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275prov = B({token: e, factory: e.\u0275fac, providedIn: "root"});
    let t = e;
    return t
})(), e0 = new Z(""), t0 = new Z("");

function OM(t, e, n) {
    let i = t.get(t0), r = t.get(et);
    return t.get(Ie).runOutsideAngular(() => {
        if (!r.startViewTransition || i.skipNextTransition) return i.skipNextTransition = !1, Promise.resolve();
        let o, s = new Promise(c => {
            o = c
        }), a = r.startViewTransition(() => (o(), PM(t))), {onViewTransitionCreated: l} = i;
        return l && dn(t, () => l({transition: a, from: e, to: n})), s
    })
}

function PM(t) {
    return new Promise(e => {
        Zu(e, {injector: t})
    })
}

var Qa = (() => {
    let e = class e {
        get hasRequestedNavigation() {
            return this.navigationId !== 0
        }

        constructor() {
            this.currentNavigation = null, this.currentTransition = null, this.lastSuccessfulNavigation = null, this.events = new Qe, this.transitionAbortSubject = new Qe, this.configLoader = N(af), this.environmentInjector = N(gt), this.urlSerializer = N(br), this.rootContexts = N(No), this.location = N(dr), this.inputBindingEnabled = N(Wa, {optional: !0}) !== null, this.titleStrategy = N(Zv), this.options = N(ko, {optional: !0}) || {}, this.paramsInheritanceStrategy = this.options.paramsInheritanceStrategy || "emptyOnly", this.urlHandlingStrategy = N(lf), this.createViewTransition = N(e0, {optional: !0}), this.navigationId = 0, this.afterPreactivation = () => q(void 0), this.rootComponentType = null;
            let i = o => this.events.next(new Vd(o)), r = o => this.events.next(new jd(o));
            this.configLoader.onLoadEndListener = r, this.configLoader.onLoadStartListener = i
        }

        complete() {
            this.transitions?.complete()
        }

        handleNavigationRequest(i) {
            let r = ++this.navigationId;
            this.transitions?.next(Se(k(k({}, this.transitions.value), i), {id: r}))
        }

        setupNavigations(i, r, o) {
            return this.transitions = new Ue({
                id: 0,
                currentUrlTree: r,
                currentRawUrl: r,
                extractedUrl: this.urlHandlingStrategy.extract(r),
                urlAfterRedirects: this.urlHandlingStrategy.extract(r),
                rawUrl: r,
                extras: {},
                resolve: null,
                reject: null,
                promise: Promise.resolve(!0),
                source: wo,
                restoredState: null,
                currentSnapshot: o.snapshot,
                targetSnapshot: null,
                currentRouterState: o,
                targetRouterState: null,
                guards: {canActivateChecks: [], canDeactivateChecks: []},
                guardsResult: null
            }), this.transitions.pipe(Dt(s => s.id !== 0), ie(s => Se(k({}, s), {extractedUrl: this.urlHandlingStrategy.extract(s.rawUrl)})), nt(s => {
                let a = !1, l = !1;
                return q(s).pipe(nt(c => {
                    if (this.navigationId > s.id) return this.cancelNavigationTransition(s, "", yt.SupersededByNewNavigation), ht;
                    this.currentTransition = s, this.currentNavigation = {
                        id: c.id,
                        initialUrl: c.rawUrl,
                        extractedUrl: c.extractedUrl,
                        trigger: c.source,
                        extras: c.extras,
                        previousNavigation: this.lastSuccessfulNavigation ? Se(k({}, this.lastSuccessfulNavigation), {previousNavigation: null}) : null
                    };
                    let f = !i.navigated || this.isUpdatingInternalState() || this.isUpdatedBrowserUrl(),
                        p = c.extras.onSameUrlNavigation ?? i.onSameUrlNavigation;
                    if (!f && p !== "reload") {
                        let m = "";
                        return this.events.next(new zn(c.id, this.urlSerializer.serialize(c.rawUrl), m, Va.IgnoredSameUrlNavigation)), c.resolve(null), ht
                    }
                    if (this.urlHandlingStrategy.shouldProcessUrl(c.rawUrl)) return q(c).pipe(nt(m => {
                        let g = this.transitions?.getValue();
                        return this.events.next(new yr(m.id, this.urlSerializer.serialize(m.extractedUrl), m.source, m.restoredState)), g !== this.transitions?.getValue() ? ht : Promise.resolve(m)
                    }), CM(this.environmentInjector, this.configLoader, this.rootComponentType, i.config, this.urlSerializer, this.paramsInheritanceStrategy), ze(m => {
                        s.targetSnapshot = m.targetSnapshot, s.urlAfterRedirects = m.urlAfterRedirects, this.currentNavigation = Se(k({}, this.currentNavigation), {finalUrl: m.urlAfterRedirects});
                        let g = new ja(m.id, this.urlSerializer.serialize(m.extractedUrl), this.urlSerializer.serialize(m.urlAfterRedirects), m.targetSnapshot);
                        this.events.next(g)
                    }));
                    if (f && this.urlHandlingStrategy.shouldProcessUrl(c.currentRawUrl)) {
                        let {id: m, extractedUrl: g, source: b, restoredState: E, extras: M} = c,
                            w = new yr(m, this.urlSerializer.serialize(g), b, E);
                        this.events.next(w);
                        let S = Bv(this.rootComponentType).snapshot;
                        return this.currentTransition = s = Se(k({}, c), {
                            targetSnapshot: S,
                            urlAfterRedirects: g,
                            extras: Se(k({}, M), {skipLocationChange: !1, replaceUrl: !1})
                        }), this.currentNavigation.finalUrl = g, q(s)
                    } else {
                        let m = "";
                        return this.events.next(new zn(c.id, this.urlSerializer.serialize(c.extractedUrl), m, Va.IgnoredByUrlHandlingStrategy)), c.resolve(null), ht
                    }
                }), ze(c => {
                    let f = new kd(c.id, this.urlSerializer.serialize(c.extractedUrl), this.urlSerializer.serialize(c.urlAfterRedirects), c.targetSnapshot);
                    this.events.next(f)
                }), ie(c => (this.currentTransition = s = Se(k({}, c), {guards: BI(c.targetSnapshot, c.currentSnapshot, this.rootContexts)}), s)), KI(this.environmentInjector, c => this.events.next(c)), ze(c => {
                    if (s.guardsResult = c.guardsResult, vr(c.guardsResult)) throw Gv(this.urlSerializer, c.guardsResult);
                    let f = new Fd(c.id, this.urlSerializer.serialize(c.extractedUrl), this.urlSerializer.serialize(c.urlAfterRedirects), c.targetSnapshot, !!c.guardsResult);
                    this.events.next(f)
                }), Dt(c => c.guardsResult ? !0 : (this.cancelNavigationTransition(c, "", yt.GuardRejected), !1)), Td(c => {
                    if (c.guards.canActivateChecks.length) return q(c).pipe(ze(f => {
                        let p = new Rd(f.id, this.urlSerializer.serialize(f.extractedUrl), this.urlSerializer.serialize(f.urlAfterRedirects), f.targetSnapshot);
                        this.events.next(p)
                    }), nt(f => {
                        let p = !1;
                        return q(f).pipe(DM(this.paramsInheritanceStrategy, this.environmentInjector), ze({
                            next: () => p = !0,
                            complete: () => {
                                p || this.cancelNavigationTransition(f, "", yt.NoDataFromResolver)
                            }
                        }))
                    }), ze(f => {
                        let p = new Ld(f.id, this.urlSerializer.serialize(f.extractedUrl), this.urlSerializer.serialize(f.urlAfterRedirects), f.targetSnapshot);
                        this.events.next(p)
                    }))
                }), Td(c => {
                    let f = p => {
                        let m = [];
                        p.routeConfig?.loadComponent && !p.routeConfig._loadedComponent && m.push(this.configLoader.loadComponent(p.routeConfig).pipe(ze(g => {
                            p.component = g
                        }), ie(() => {
                        })));
                        for (let g of p.children) m.push(...f(g));
                        return m
                    };
                    return Br(f(c.targetSnapshot.root)).pipe(An(null), on(1))
                }), Td(() => this.afterPreactivation()), nt(() => {
                    let {currentSnapshot: c, targetSnapshot: f} = s,
                        p = this.createViewTransition?.(this.environmentInjector, c.root, f.root);
                    return p ? Te(p).pipe(ie(() => s)) : q(s)
                }), ie(c => {
                    let f = PI(i.routeReuseStrategy, c.targetSnapshot, c.currentRouterState);
                    return this.currentTransition = s = Se(k({}, c), {targetRouterState: f}), this.currentNavigation.targetRouterState = f, s
                }), ze(() => {
                    this.events.next(new Do)
                }), $I(this.rootContexts, i.routeReuseStrategy, c => this.events.next(c), this.inputBindingEnabled), on(1), ze({
                    next: c => {
                        a = !0, this.lastSuccessfulNavigation = this.currentNavigation, this.events.next(new st(c.id, this.urlSerializer.serialize(c.extractedUrl), this.urlSerializer.serialize(c.urlAfterRedirects))), this.titleStrategy?.updateTitle(c.targetRouterState.snapshot), c.resolve(!0)
                    }, complete: () => {
                        a = !0
                    }
                }), Xl(this.transitionAbortSubject.pipe(ze(c => {
                    throw c
                }))), Hr(() => {
                    !a && !l && this.cancelNavigationTransition(s, "", yt.SupersededByNewNavigation), this.currentTransition?.id === s.id && (this.currentNavigation = null, this.currentTransition = null)
                }), xn(c => {
                    if (l = !0, Wv(c)) this.events.next(new Un(s.id, this.urlSerializer.serialize(s.extractedUrl), c.message, c.cancellationCode)), RI(c) ? this.events.next(new Io(c.url)) : s.resolve(!1); else {
                        this.events.next(new Co(s.id, this.urlSerializer.serialize(s.extractedUrl), c, s.targetSnapshot ?? void 0));
                        try {
                            s.resolve(i.errorHandler(c))
                        } catch (f) {
                            this.options.resolveNavigationPromiseOnError ? s.resolve(!1) : s.reject(f)
                        }
                    }
                    return ht
                }))
            }))
        }

        cancelNavigationTransition(i, r, o) {
            let s = new Un(i.id, this.urlSerializer.serialize(i.extractedUrl), r, o);
            this.events.next(s), i.resolve(!1)
        }

        isUpdatingInternalState() {
            return this.currentTransition?.extractedUrl.toString() !== this.currentTransition?.currentUrlTree.toString()
        }

        isUpdatedBrowserUrl() {
            return this.urlHandlingStrategy.extract(this.urlSerializer.parse(this.location.path(!0))).toString() !== this.currentTransition?.extractedUrl.toString() && !this.currentTransition?.extras.skipLocationChange
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275prov = B({token: e, factory: e.\u0275fac, providedIn: "root"});
    let t = e;
    return t
})();

function kM(t) {
    return t !== wo
}

var FM = (() => {
    let e = class e {
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275prov = B({token: e, factory: () => N(RM), providedIn: "root"});
    let t = e;
    return t
})(), ef = class {
    shouldDetach(e) {
        return !1
    }

    store(e, n) {
    }

    shouldAttach(e) {
        return !1
    }

    retrieve(e) {
        return null
    }

    shouldReuseRoute(e, n) {
        return e.routeConfig === n.routeConfig
    }
}, RM = (() => {
    let e = class e extends ef {
    };
    e.\u0275fac = (() => {
        let i;
        return function (o) {
            return (i || (i = or(e)))(o || e)
        }
    })(), e.\u0275prov = B({token: e, factory: e.\u0275fac, providedIn: "root"});
    let t = e;
    return t
})(), n0 = (() => {
    let e = class e {
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275prov = B({token: e, factory: () => N(LM), providedIn: "root"});
    let t = e;
    return t
})(), LM = (() => {
    let e = class e extends n0 {
        constructor() {
            super(...arguments), this.location = N(dr), this.urlSerializer = N(br), this.options = N(ko, {optional: !0}) || {}, this.canceledNavigationResolution = this.options.canceledNavigationResolution || "replace", this.urlHandlingStrategy = N(lf), this.urlUpdateStrategy = this.options.urlUpdateStrategy || "deferred", this.currentUrlTree = new Hn, this.rawUrlTree = this.currentUrlTree, this.currentPageId = 0, this.lastSuccessfulId = -1, this.routerState = Bv(null), this.stateMemento = this.createStateMemento()
        }

        getCurrentUrlTree() {
            return this.currentUrlTree
        }

        getRawUrlTree() {
            return this.rawUrlTree
        }

        restoredState() {
            return this.location.getState()
        }

        get browserPageId() {
            return this.canceledNavigationResolution !== "computed" ? this.currentPageId : this.restoredState()?.\u0275routerPageId ?? this.currentPageId
        }

        getRouterState() {
            return this.routerState
        }

        createStateMemento() {
            return {rawUrlTree: this.rawUrlTree, currentUrlTree: this.currentUrlTree, routerState: this.routerState}
        }

        registerNonRouterCurrentEntryChangeListener(i) {
            return this.location.subscribe(r => {
                r.type === "popstate" && i(r.url, r.state)
            })
        }

        handleRouterEvent(i, r) {
            if (i instanceof yr) this.stateMemento = this.createStateMemento(); else if (i instanceof zn) this.rawUrlTree = r.initialUrl; else if (i instanceof ja) {
                if (this.urlUpdateStrategy === "eager" && !r.extras.skipLocationChange) {
                    let o = this.urlHandlingStrategy.merge(r.finalUrl, r.initialUrl);
                    this.setBrowserUrl(o, r)
                }
            } else i instanceof Do ? (this.currentUrlTree = r.finalUrl, this.rawUrlTree = this.urlHandlingStrategy.merge(r.finalUrl, r.initialUrl), this.routerState = r.targetRouterState, this.urlUpdateStrategy === "deferred" && (r.extras.skipLocationChange || this.setBrowserUrl(this.rawUrlTree, r))) : i instanceof Un && (i.code === yt.GuardRejected || i.code === yt.NoDataFromResolver) ? this.restoreHistory(r) : i instanceof Co ? this.restoreHistory(r, !0) : i instanceof st && (this.lastSuccessfulId = i.id, this.currentPageId = this.browserPageId)
        }

        setBrowserUrl(i, r) {
            let o = this.urlSerializer.serialize(i);
            if (this.location.isCurrentPathEqualTo(o) || r.extras.replaceUrl) {
                let s = this.browserPageId, a = k(k({}, r.extras.state), this.generateNgRouterState(r.id, s));
                this.location.replaceState(o, "", a)
            } else {
                let s = k(k({}, r.extras.state), this.generateNgRouterState(r.id, this.browserPageId + 1));
                this.location.go(o, "", s)
            }
        }

        restoreHistory(i, r = !1) {
            if (this.canceledNavigationResolution === "computed") {
                let o = this.browserPageId, s = this.currentPageId - o;
                s !== 0 ? this.location.historyGo(s) : this.currentUrlTree === i.finalUrl && s === 0 && (this.resetState(i), this.resetUrlToCurrentUrlTree())
            } else this.canceledNavigationResolution === "replace" && (r && this.resetState(i), this.resetUrlToCurrentUrlTree())
        }

        resetState(i) {
            this.routerState = this.stateMemento.routerState, this.currentUrlTree = this.stateMemento.currentUrlTree, this.rawUrlTree = this.urlHandlingStrategy.merge(this.currentUrlTree, i.finalUrl ?? this.rawUrlTree)
        }

        resetUrlToCurrentUrlTree() {
            this.location.replaceState(this.urlSerializer.serialize(this.rawUrlTree), "", this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId))
        }

        generateNgRouterState(i, r) {
            return this.canceledNavigationResolution === "computed" ? {
                navigationId: i,
                \u0275routerPageId: r
            } : {navigationId: i}
        }
    };
    e.\u0275fac = (() => {
        let i;
        return function (o) {
            return (i || (i = or(e)))(o || e)
        }
    })(), e.\u0275prov = B({token: e, factory: e.\u0275fac, providedIn: "root"});
    let t = e;
    return t
})(), vo = function (t) {
    return t[t.COMPLETE = 0] = "COMPLETE", t[t.FAILED = 1] = "FAILED", t[t.REDIRECTING = 2] = "REDIRECTING", t
}(vo || {});

function i0(t, e) {
    t.events.pipe(Dt(n => n instanceof st || n instanceof Un || n instanceof Co || n instanceof zn), ie(n => n instanceof st || n instanceof zn ? vo.COMPLETE : (n instanceof Un ? n.code === yt.Redirect || n.code === yt.SupersededByNewNavigation : !1) ? vo.REDIRECTING : vo.FAILED), Dt(n => n !== vo.REDIRECTING), on(1)).subscribe(() => {
        e()
    })
}

function VM(t) {
    throw t
}

var jM = {paths: "exact", fragment: "ignored", matrixParams: "ignored", queryParams: "exact"},
    $M = {paths: "subset", fragment: "ignored", matrixParams: "ignored", queryParams: "subset"}, Me = (() => {
        let e = class e {
            get currentUrlTree() {
                return this.stateManager.getCurrentUrlTree()
            }

            get rawUrlTree() {
                return this.stateManager.getRawUrlTree()
            }

            get events() {
                return this._events
            }

            get routerState() {
                return this.stateManager.getRouterState()
            }

            constructor() {
                this.disposed = !1, this.isNgZoneEnabled = !1, this.console = N(Ea), this.stateManager = N(n0), this.options = N(ko, {optional: !0}) || {}, this.pendingTasks = N(ba), this.urlUpdateStrategy = this.options.urlUpdateStrategy || "deferred", this.navigationTransitions = N(Qa), this.urlSerializer = N(br), this.location = N(dr), this.urlHandlingStrategy = N(lf), this._events = new Qe, this.errorHandler = this.options.errorHandler || VM, this.navigated = !1, this.routeReuseStrategy = N(FM), this.onSameUrlNavigation = this.options.onSameUrlNavigation || "ignore", this.config = N(xo, {optional: !0})?.flat() ?? [], this.componentInputBindingEnabled = !!N(Wa, {optional: !0}), this.eventsSubscription = new Re, this.isNgZoneEnabled = N(Ie) instanceof Ie && Ie.isInAngularZone(), this.resetConfig(this.config), this.navigationTransitions.setupNavigations(this, this.currentUrlTree, this.routerState).subscribe({
                    error: i => {
                        this.console.warn(i)
                    }
                }), this.subscribeToNavigationEvents()
            }

            subscribeToNavigationEvents() {
                let i = this.navigationTransitions.events.subscribe(r => {
                    try {
                        let o = this.navigationTransitions.currentTransition,
                            s = this.navigationTransitions.currentNavigation;
                        if (o !== null && s !== null) {
                            if (this.stateManager.handleRouterEvent(r, s), r instanceof Un && r.code !== yt.Redirect && r.code !== yt.SupersededByNewNavigation) this.navigated = !0; else if (r instanceof st) this.navigated = !0; else if (r instanceof Io) {
                                let a = this.urlHandlingStrategy.merge(r.url, o.currentRawUrl), l = {
                                    info: o.extras.info,
                                    skipLocationChange: o.extras.skipLocationChange,
                                    replaceUrl: this.urlUpdateStrategy === "eager" || kM(o.source)
                                };
                                this.scheduleNavigation(a, wo, null, l, {
                                    resolve: o.resolve,
                                    reject: o.reject,
                                    promise: o.promise
                                })
                            }
                        }
                        HM(r) && this._events.next(r)
                    } catch (o) {
                        this.navigationTransitions.transitionAbortSubject.next(o)
                    }
                });
                this.eventsSubscription.add(i)
            }

            resetRootComponentType(i) {
                this.routerState.root.component = i, this.navigationTransitions.rootComponentType = i
            }

            initialNavigation() {
                this.setUpLocationChangeListener(), this.navigationTransitions.hasRequestedNavigation || this.navigateToSyncWithBrowser(this.location.path(!0), wo, this.stateManager.restoredState())
            }

            setUpLocationChangeListener() {
                this.nonRouterCurrentEntryChangeSubscription ??= this.stateManager.registerNonRouterCurrentEntryChangeListener((i, r) => {
                    setTimeout(() => {
                        this.navigateToSyncWithBrowser(i, "popstate", r)
                    }, 0)
                })
            }

            navigateToSyncWithBrowser(i, r, o) {
                let s = {replaceUrl: !0}, a = o?.navigationId ? o : null;
                if (o) {
                    let c = k({}, o);
                    delete c.navigationId, delete c.\u0275routerPageId, Object.keys(c).length !== 0 && (s.state = c)
                }
                let l = this.parseUrl(i);
                this.scheduleNavigation(l, r, a, s)
            }

            get url() {
                return this.serializeUrl(this.currentUrlTree)
            }

            getCurrentNavigation() {
                return this.navigationTransitions.currentNavigation
            }

            get lastSuccessfulNavigation() {
                return this.navigationTransitions.lastSuccessfulNavigation
            }

            resetConfig(i) {
                this.config = i.map(of), this.navigated = !1
            }

            ngOnDestroy() {
                this.dispose()
            }

            dispose() {
                this.navigationTransitions.complete(), this.nonRouterCurrentEntryChangeSubscription && (this.nonRouterCurrentEntryChangeSubscription.unsubscribe(), this.nonRouterCurrentEntryChangeSubscription = void 0), this.disposed = !0, this.eventsSubscription.unsubscribe()
            }

            createUrlTree(i, r = {}) {
                let {relativeTo: o, queryParams: s, fragment: a, queryParamsHandling: l, preserveFragment: c} = r,
                    f = c ? this.currentUrlTree.fragment : a, p = null;
                switch (l) {
                    case"merge":
                        p = k(k({}, this.currentUrlTree.queryParams), s);
                        break;
                    case"preserve":
                        p = this.currentUrlTree.queryParams;
                        break;
                    default:
                        p = s || null
                }
                p !== null && (p = this.removeEmptyProps(p));
                let m;
                try {
                    let g = o ? o.snapshot : this.routerState.snapshot.root;
                    m = Lv(g)
                } catch {
                    (typeof i[0] != "string" || !i[0].startsWith("/")) && (i = []), m = this.currentUrlTree.root
                }
                return Vv(m, i, p, f ?? null)
            }

            navigateByUrl(i, r = {skipLocationChange: !1}) {
                let o = vr(i) ? i : this.parseUrl(i), s = this.urlHandlingStrategy.merge(o, this.rawUrlTree);
                return this.scheduleNavigation(s, wo, null, r)
            }

            navigate(i, r = {skipLocationChange: !1}) {
                return BM(i), this.navigateByUrl(this.createUrlTree(i, r), r)
            }

            serializeUrl(i) {
                return this.urlSerializer.serialize(i)
            }

            parseUrl(i) {
                try {
                    return this.urlSerializer.parse(i)
                } catch {
                    return this.urlSerializer.parse("/")
                }
            }

            isActive(i, r) {
                let o;
                if (r === !0 ? o = k({}, jM) : r === !1 ? o = k({}, $M) : o = r, vr(i)) return wv(this.currentUrlTree, i, o);
                let s = this.parseUrl(i);
                return wv(this.currentUrlTree, s, o)
            }

            removeEmptyProps(i) {
                return Object.entries(i).reduce((r, [o, s]) => (s != null && (r[o] = s), r), {})
            }

            scheduleNavigation(i, r, o, s, a) {
                if (this.disposed) return Promise.resolve(!1);
                let l, c, f;
                a ? (l = a.resolve, c = a.reject, f = a.promise) : f = new Promise((m, g) => {
                    l = m, c = g
                });
                let p = this.pendingTasks.add();
                return i0(this, () => {
                    queueMicrotask(() => this.pendingTasks.remove(p))
                }), this.navigationTransitions.handleNavigationRequest({
                    source: r,
                    restoredState: o,
                    currentUrlTree: this.currentUrlTree,
                    currentRawUrl: this.currentUrlTree,
                    rawUrl: i,
                    extras: s,
                    resolve: l,
                    reject: c,
                    promise: f,
                    currentSnapshot: this.routerState.snapshot,
                    currentRouterState: this.routerState
                }), f.catch(m => Promise.reject(m))
            }
        };
        e.\u0275fac = function (r) {
            return new (r || e)
        }, e.\u0275prov = B({token: e, factory: e.\u0275fac, providedIn: "root"});
        let t = e;
        return t
    })();

function BM(t) {
    for (let e = 0; e < t.length; e++) if (t[e] == null) throw new _(4008, !1)
}

function HM(t) {
    return !(t instanceof Do) && !(t instanceof Io)
}

var he = (() => {
    let e = class e {
        constructor(i, r, o, s, a, l) {
            this.router = i, this.route = r, this.tabIndexAttribute = o, this.renderer = s, this.el = a, this.locationStrategy = l, this.href = null, this.commands = null, this.onChanges = new Qe, this.preserveFragment = !1, this.skipLocationChange = !1, this.replaceUrl = !1;
            let c = a.nativeElement.tagName?.toLowerCase();
            this.isAnchorElement = c === "a" || c === "area", this.isAnchorElement ? this.subscription = i.events.subscribe(f => {
                f instanceof st && this.updateHref()
            }) : this.setTabIndexIfNotOnNativeEl("0")
        }

        setTabIndexIfNotOnNativeEl(i) {
            this.tabIndexAttribute != null || this.isAnchorElement || this.applyAttributeValue("tabindex", i)
        }

        ngOnChanges(i) {
            this.isAnchorElement && this.updateHref(), this.onChanges.next(this)
        }

        set routerLink(i) {
            i != null ? (this.commands = Array.isArray(i) ? i : [i], this.setTabIndexIfNotOnNativeEl("0")) : (this.commands = null, this.setTabIndexIfNotOnNativeEl(null))
        }

        onClick(i, r, o, s, a) {
            let l = this.urlTree;
            if (l === null || this.isAnchorElement && (i !== 0 || r || o || s || a || typeof this.target == "string" && this.target != "_self")) return !0;
            let c = {
                skipLocationChange: this.skipLocationChange,
                replaceUrl: this.replaceUrl,
                state: this.state,
                info: this.info
            };
            return this.router.navigateByUrl(l, c), !this.isAnchorElement
        }

        ngOnDestroy() {
            this.subscription?.unsubscribe()
        }

        updateHref() {
            let i = this.urlTree;
            this.href = i !== null && this.locationStrategy ? this.locationStrategy?.prepareExternalUrl(this.router.serializeUrl(i)) : null;
            let r = this.href === null ? null : ig(this.href, this.el.nativeElement.tagName.toLowerCase(), "href");
            this.applyAttributeValue("href", r)
        }

        applyAttributeValue(i, r) {
            let o = this.renderer, s = this.el.nativeElement;
            r !== null ? o.setAttribute(s, i, r) : o.removeAttribute(s, i)
        }

        get urlTree() {
            return this.commands === null ? null : this.router.createUrlTree(this.commands, {
                relativeTo: this.relativeTo !== void 0 ? this.relativeTo : this.route,
                queryParams: this.queryParams,
                fragment: this.fragment,
                queryParamsHandling: this.queryParamsHandling,
                preserveFragment: this.preserveFragment
            })
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)(P(Me), P(xt), Au("tabindex"), P(Zt), P(ut), P(Cn))
    }, e.\u0275dir = Ve({
        type: e,
        selectors: [["", "routerLink", ""]],
        hostVars: 1,
        hostBindings: function (r, o) {
            r & 1 && j("click", function (a) {
                return o.onClick(a.button, a.ctrlKey, a.shiftKey, a.altKey, a.metaKey)
            }), r & 2 && Vt("target", o.target)
        },
        inputs: {
            target: "target",
            queryParams: "queryParams",
            fragment: "fragment",
            queryParamsHandling: "queryParamsHandling",
            state: "state",
            info: "info",
            relativeTo: "relativeTo",
            preserveFragment: [Ge.HasDecoratorInputTransform, "preserveFragment", "preserveFragment", ur],
            skipLocationChange: [Ge.HasDecoratorInputTransform, "skipLocationChange", "skipLocationChange", ur],
            replaceUrl: [Ge.HasDecoratorInputTransform, "replaceUrl", "replaceUrl", ur],
            routerLink: "routerLink"
        },
        standalone: !0,
        features: [td, hn]
    });
    let t = e;
    return t
})(), qn = (() => {
    let e = class e {
        get isActive() {
            return this._isActive
        }

        constructor(i, r, o, s, a) {
            this.router = i, this.element = r, this.renderer = o, this.cdr = s, this.link = a, this.classes = [], this._isActive = !1, this.routerLinkActiveOptions = {exact: !1}, this.isActiveChange = new ke, this.routerEventsSubscription = i.events.subscribe(l => {
                l instanceof st && this.update()
            })
        }

        ngAfterContentInit() {
            q(this.links.changes, q(null)).pipe(Tn()).subscribe(i => {
                this.update(), this.subscribeToEachLinkOnChanges()
            })
        }

        subscribeToEachLinkOnChanges() {
            this.linkInputChangesSubscription?.unsubscribe();
            let i = [...this.links.toArray(), this.link].filter(r => !!r).map(r => r.onChanges);
            this.linkInputChangesSubscription = Te(i).pipe(Tn()).subscribe(r => {
                this._isActive !== this.isLinkActive(this.router)(r) && this.update()
            })
        }

        set routerLinkActive(i) {
            let r = Array.isArray(i) ? i : i.split(" ");
            this.classes = r.filter(o => !!o)
        }

        ngOnChanges(i) {
            this.update()
        }

        ngOnDestroy() {
            this.routerEventsSubscription.unsubscribe(), this.linkInputChangesSubscription?.unsubscribe()
        }

        update() {
            !this.links || !this.router.navigated || queueMicrotask(() => {
                let i = this.hasActiveLinks();
                this.classes.forEach(r => {
                    i ? this.renderer.addClass(this.element.nativeElement, r) : this.renderer.removeClass(this.element.nativeElement, r)
                }), i && this.ariaCurrentWhenActive !== void 0 ? this.renderer.setAttribute(this.element.nativeElement, "aria-current", this.ariaCurrentWhenActive.toString()) : this.renderer.removeAttribute(this.element.nativeElement, "aria-current"), this._isActive !== i && (this._isActive = i, this.cdr.markForCheck(), this.isActiveChange.emit(i))
            })
        }

        isLinkActive(i) {
            let r = UM(this.routerLinkActiveOptions) ? this.routerLinkActiveOptions : this.routerLinkActiveOptions.exact || !1;
            return o => {
                let s = o.urlTree;
                return s ? i.isActive(s, r) : !1
            }
        }

        hasActiveLinks() {
            let i = this.isLinkActive(this.router);
            return this.link && i(this.link) || this.links.some(i)
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)(P(Me), P(ut), P(Zt), P(yi), P(he, 8))
    }, e.\u0275dir = Ve({
        type: e,
        selectors: [["", "routerLinkActive", ""]],
        contentQueries: function (r, o, s) {
            if (r & 1 && Ug(s, he, 5), r & 2) {
                let a;
                zg(a = Gg()) && (o.links = a)
            }
        },
        inputs: {
            routerLinkActiveOptions: "routerLinkActiveOptions",
            ariaCurrentWhenActive: "ariaCurrentWhenActive",
            routerLinkActive: "routerLinkActive"
        },
        outputs: {isActiveChange: "isActiveChange"},
        exportAs: ["routerLinkActive"],
        standalone: !0,
        features: [hn]
    });
    let t = e;
    return t
})();

function UM(t) {
    return !!t.paths
}

var qa = class {
};
var zM = (() => {
    let e = class e {
        constructor(i, r, o, s, a) {
            this.router = i, this.injector = o, this.preloadingStrategy = s, this.loader = a
        }

        setUpPreloading() {
            this.subscription = this.router.events.pipe(Dt(i => i instanceof st), ti(() => this.preload())).subscribe(() => {
            })
        }

        preload() {
            return this.processRoutes(this.injector, this.router.config)
        }

        ngOnDestroy() {
            this.subscription && this.subscription.unsubscribe()
        }

        processRoutes(i, r) {
            let o = [];
            for (let s of r) {
                s.providers && !s._injector && (s._injector = wa(s.providers, i, `Route: ${s.path}`));
                let a = s._injector ?? i, l = s._loadedInjector ?? a;
                (s.loadChildren && !s._loadedRoutes && s.canLoad === void 0 || s.loadComponent && !s._loadedComponent) && o.push(this.preloadConfig(a, s)), (s.children || s._loadedRoutes) && o.push(this.processRoutes(l, s.children ?? s._loadedRoutes))
            }
            return Te(o).pipe(Tn())
        }

        preloadConfig(i, r) {
            return this.preloadingStrategy.preload(r, () => {
                let o;
                r.loadChildren && r.canLoad === void 0 ? o = this.loader.loadChildren(i, r) : o = q(null);
                let s = o.pipe(Pe(a => a === null ? q(void 0) : (r._loadedRoutes = a.routes, r._loadedInjector = a.injector, this.processRoutes(a.injector ?? i, a.routes))));
                if (r.loadComponent && !r._loadedComponent) {
                    let a = this.loader.loadComponent(r);
                    return Te([s, a]).pipe(Tn())
                } else return s
            })
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)(X(Me), X(Da), X(gt), X(qa), X(af))
    }, e.\u0275prov = B({token: e, factory: e.\u0275fac, providedIn: "root"});
    let t = e;
    return t
})(), cf = new Z(""), r0 = (() => {
    let e = class e {
        constructor(i, r, o, s, a = {}) {
            this.urlSerializer = i, this.transitions = r, this.viewportScroller = o, this.zone = s, this.options = a, this.lastId = 0, this.lastSource = "imperative", this.restoredId = 0, this.store = {}, a.scrollPositionRestoration ||= "disabled", a.anchorScrolling ||= "disabled"
        }

        init() {
            this.options.scrollPositionRestoration !== "disabled" && this.viewportScroller.setHistoryScrollRestoration("manual"), this.routerEventsSubscription = this.createScrollEvents(), this.scrollEventsSubscription = this.consumeScrollEvents()
        }

        createScrollEvents() {
            return this.transitions.events.subscribe(i => {
                i instanceof yr ? (this.store[this.lastId] = this.viewportScroller.getScrollPosition(), this.lastSource = i.navigationTrigger, this.restoredId = i.restoredState ? i.restoredState.navigationId : 0) : i instanceof st ? (this.lastId = i.id, this.scheduleScrollEvent(i, this.urlSerializer.parse(i.urlAfterRedirects).fragment)) : i instanceof zn && i.code === Va.IgnoredSameUrlNavigation && (this.lastSource = void 0, this.restoredId = 0, this.scheduleScrollEvent(i, this.urlSerializer.parse(i.url).fragment))
            })
        }

        consumeScrollEvents() {
            return this.transitions.events.subscribe(i => {
                i instanceof $a && (i.position ? this.options.scrollPositionRestoration === "top" ? this.viewportScroller.scrollToPosition([0, 0]) : this.options.scrollPositionRestoration === "enabled" && this.viewportScroller.scrollToPosition(i.position) : i.anchor && this.options.anchorScrolling === "enabled" ? this.viewportScroller.scrollToAnchor(i.anchor) : this.options.scrollPositionRestoration !== "disabled" && this.viewportScroller.scrollToPosition([0, 0]))
            })
        }

        scheduleScrollEvent(i, r) {
            this.zone.runOutsideAngular(() => {
                setTimeout(() => {
                    this.zone.run(() => {
                        this.transitions.events.next(new $a(i, this.lastSource === "popstate" ? this.store[this.restoredId] : null, r))
                    })
                }, 0)
            })
        }

        ngOnDestroy() {
            this.routerEventsSubscription?.unsubscribe(), this.scrollEventsSubscription?.unsubscribe()
        }
    };
    e.\u0275fac = function (r) {
        hg()
    }, e.\u0275prov = B({token: e, factory: e.\u0275fac});
    let t = e;
    return t
})();

function o0(t, ...e) {
    return ra([{provide: xo, multi: !0, useValue: t}, [], {provide: xt, useFactory: s0, deps: [Me]}, {
        provide: Ca,
        multi: !0,
        useFactory: l0
    }, e.map(n => n.\u0275providers)])
}

function s0(t) {
    return t.routerState.root
}

function Sr(t, e) {
    return {\u0275kind: t, \u0275providers: e}
}

function a0(t = {}) {
    return Sr(4, [{
        provide: cf, useFactory: () => {
            let n = N(vd), i = N(Ie), r = N(Qa), o = N(br);
            return new r0(o, r, n, i, t)
        }
    }])
}

function l0() {
    let t = N(vn);
    return e => {
        let n = t.get(uo);
        if (e !== n.components[0]) return;
        let i = t.get(Me), r = t.get(c0);
        t.get(uf) === 1 && i.initialNavigation(), t.get(u0, null, oe.Optional)?.setUpPreloading(), t.get(cf, null, oe.Optional)?.init(), i.resetRootComponentType(n.componentTypes[0]), r.closed || (r.next(), r.complete(), r.unsubscribe())
    }
}

var c0 = new Z("", {factory: () => new Qe}), uf = new Z("", {providedIn: "root", factory: () => 1});

function GM() {
    return Sr(2, [{provide: uf, useValue: 0}, {
        provide: Sa, multi: !0, deps: [vn], useFactory: e => {
            let n = e.get(sv, Promise.resolve());
            return () => n.then(() => new Promise(i => {
                let r = e.get(Me), o = e.get(c0);
                i0(r, () => {
                    i(!0)
                }), e.get(Qa).afterPreactivation = () => (i(!0), o.closed ? q(void 0) : o), r.initialNavigation()
            }))
        }
    }])
}

function qM() {
    return Sr(3, [{
        provide: Sa, multi: !0, useFactory: () => {
            let e = N(Me);
            return () => {
                e.setUpLocationChangeListener()
            }
        }
    }, {provide: uf, useValue: 2}])
}

var u0 = new Z("");

function WM(t) {
    return Sr(0, [{provide: u0, useExisting: zM}, {provide: qa, useExisting: t}])
}

function YM() {
    return Sr(8, [Cv, {provide: Wa, useExisting: Cv}])
}

function QM(t) {
    let e = [{provide: e0, useValue: OM}, {
        provide: t0,
        useValue: k({skipNextTransition: !!t?.skipInitialTransition}, t)
    }];
    return Sr(9, e)
}

var Iv = new Z("ROUTER_FORROOT_GUARD"),
    XM = [dr, {provide: br, useClass: Eo}, Me, No, {provide: xt, useFactory: s0, deps: [Me]}, af, []], Ee = (() => {
        let e = class e {
            constructor(i) {
            }

            static forRoot(i, r) {
                return {
                    ngModule: e,
                    providers: [XM, [], {provide: xo, multi: !0, useValue: i}, {
                        provide: Iv,
                        useFactory: e_,
                        deps: [[Me, new to, new ia]]
                    }, {
                        provide: ko,
                        useValue: r || {}
                    }, r?.useHash ? ZM() : JM(), KM(), r?.preloadingStrategy ? WM(r.preloadingStrategy).\u0275providers : [], r?.initialNavigation ? t_(r) : [], r?.bindToComponentInputs ? YM().\u0275providers : [], r?.enableViewTransitions ? QM().\u0275providers : [], n_()]
                }
            }

            static forChild(i) {
                return {ngModule: e, providers: [{provide: xo, multi: !0, useValue: i}]}
            }
        };
        e.\u0275fac = function (r) {
            return new (r || e)(X(Iv, 8))
        }, e.\u0275mod = un({type: e}), e.\u0275inj = cn({});
        let t = e;
        return t
    })();

function KM() {
    return {
        provide: cf, useFactory: () => {
            let t = N(vd), e = N(Ie), n = N(ko), i = N(Qa), r = N(br);
            return n.scrollOffset && t.setOffset(n.scrollOffset), new r0(r, i, t, e, n)
        }
    }
}

function ZM() {
    return {provide: Cn, useClass: lv}
}

function JM() {
    return {provide: Cn, useClass: hd}
}

function e_(t) {
    return "guarded"
}

function t_(t) {
    return [t.initialNavigation === "disabled" ? qM().\u0275providers : [], t.initialNavigation === "enabledBlocking" ? GM().\u0275providers : []]
}

var Mv = new Z("");

function n_() {
    return [{provide: Mv, useFactory: l0}, {provide: Ca, multi: !0, useExisting: Mv}]
}

var ae = function (t) {
    return t[t.State = 0] = "State", t[t.Transition = 1] = "Transition", t[t.Sequence = 2] = "Sequence", t[t.Group = 3] = "Group", t[t.Animate = 4] = "Animate", t[t.Keyframes = 5] = "Keyframes", t[t.Style = 6] = "Style", t[t.Trigger = 7] = "Trigger", t[t.Reference = 8] = "Reference", t[t.AnimateChild = 9] = "AnimateChild", t[t.AnimateRef = 10] = "AnimateRef", t[t.Query = 11] = "Query", t[t.Stagger = 12] = "Stagger", t
}(ae || {}), tn = "*";

function d0(t, e = null) {
    return {type: ae.Sequence, steps: t, options: e}
}

function df(t) {
    return {type: ae.Style, styles: t, offset: null}
}

var Wn = class {
    constructor(e = 0, n = 0) {
        this._onDoneFns = [], this._onStartFns = [], this._onDestroyFns = [], this._originalOnDoneFns = [], this._originalOnStartFns = [], this._started = !1, this._destroyed = !1, this._finished = !1, this._position = 0, this.parentPlayer = null, this.totalTime = e + n
    }

    _onFinish() {
        this._finished || (this._finished = !0, this._onDoneFns.forEach(e => e()), this._onDoneFns = [])
    }

    onStart(e) {
        this._originalOnStartFns.push(e), this._onStartFns.push(e)
    }

    onDone(e) {
        this._originalOnDoneFns.push(e), this._onDoneFns.push(e)
    }

    onDestroy(e) {
        this._onDestroyFns.push(e)
    }

    hasStarted() {
        return this._started
    }

    init() {
    }

    play() {
        this.hasStarted() || (this._onStart(), this.triggerMicrotask()), this._started = !0
    }

    triggerMicrotask() {
        queueMicrotask(() => this._onFinish())
    }

    _onStart() {
        this._onStartFns.forEach(e => e()), this._onStartFns = []
    }

    pause() {
    }

    restart() {
    }

    finish() {
        this._onFinish()
    }

    destroy() {
        this._destroyed || (this._destroyed = !0, this.hasStarted() || this._onStart(), this.finish(), this._onDestroyFns.forEach(e => e()), this._onDestroyFns = [])
    }

    reset() {
        this._started = !1, this._finished = !1, this._onStartFns = this._originalOnStartFns, this._onDoneFns = this._originalOnDoneFns
    }

    setPosition(e) {
        this._position = this.totalTime ? e * this.totalTime : 1
    }

    getPosition() {
        return this.totalTime ? this._position / this.totalTime : 1
    }

    triggerCallback(e) {
        let n = e == "start" ? this._onStartFns : this._onDoneFns;
        n.forEach(i => i()), n.length = 0
    }
}, Fo = class {
    constructor(e) {
        this._onDoneFns = [], this._onStartFns = [], this._finished = !1, this._started = !1, this._destroyed = !1, this._onDestroyFns = [], this.parentPlayer = null, this.totalTime = 0, this.players = e;
        let n = 0, i = 0, r = 0, o = this.players.length;
        o == 0 ? queueMicrotask(() => this._onFinish()) : this.players.forEach(s => {
            s.onDone(() => {
                ++n == o && this._onFinish()
            }), s.onDestroy(() => {
                ++i == o && this._onDestroy()
            }), s.onStart(() => {
                ++r == o && this._onStart()
            })
        }), this.totalTime = this.players.reduce((s, a) => Math.max(s, a.totalTime), 0)
    }

    _onFinish() {
        this._finished || (this._finished = !0, this._onDoneFns.forEach(e => e()), this._onDoneFns = [])
    }

    init() {
        this.players.forEach(e => e.init())
    }

    onStart(e) {
        this._onStartFns.push(e)
    }

    _onStart() {
        this.hasStarted() || (this._started = !0, this._onStartFns.forEach(e => e()), this._onStartFns = [])
    }

    onDone(e) {
        this._onDoneFns.push(e)
    }

    onDestroy(e) {
        this._onDestroyFns.push(e)
    }

    hasStarted() {
        return this._started
    }

    play() {
        this.parentPlayer || this.init(), this._onStart(), this.players.forEach(e => e.play())
    }

    pause() {
        this.players.forEach(e => e.pause())
    }

    restart() {
        this.players.forEach(e => e.restart())
    }

    finish() {
        this._onFinish(), this.players.forEach(e => e.finish())
    }

    destroy() {
        this._onDestroy()
    }

    _onDestroy() {
        this._destroyed || (this._destroyed = !0, this._onFinish(), this.players.forEach(e => e.destroy()), this._onDestroyFns.forEach(e => e()), this._onDestroyFns = [])
    }

    reset() {
        this.players.forEach(e => e.reset()), this._destroyed = !1, this._finished = !1, this._started = !1
    }

    setPosition(e) {
        let n = e * this.totalTime;
        this.players.forEach(i => {
            let r = i.totalTime ? Math.min(1, n / i.totalTime) : 1;
            i.setPosition(r)
        })
    }

    getPosition() {
        let e = this.players.reduce((n, i) => n === null || i.totalTime > n.totalTime ? i : n, null);
        return e != null ? e.getPosition() : 0
    }

    beforeDestroy() {
        this.players.forEach(e => {
            e.beforeDestroy && e.beforeDestroy()
        })
    }

    triggerCallback(e) {
        let n = e == "start" ? this._onStartFns : this._onDoneFns;
        n.forEach(i => i()), n.length = 0
    }
}, Xa = "!";

function f0(t) {
    return new _(3e3, !1)
}

function i_() {
    return new _(3100, !1)
}

function r_() {
    return new _(3101, !1)
}

function o_(t) {
    return new _(3001, !1)
}

function s_(t) {
    return new _(3003, !1)
}

function a_(t) {
    return new _(3004, !1)
}

function l_(t, e) {
    return new _(3005, !1)
}

function c_() {
    return new _(3006, !1)
}

function u_() {
    return new _(3007, !1)
}

function d_(t, e) {
    return new _(3008, !1)
}

function f_(t) {
    return new _(3002, !1)
}

function p_(t, e, n, i, r) {
    return new _(3010, !1)
}

function h_() {
    return new _(3011, !1)
}

function m_() {
    return new _(3012, !1)
}

function g_() {
    return new _(3200, !1)
}

function v_() {
    return new _(3202, !1)
}

function y_() {
    return new _(3013, !1)
}

function w_(t) {
    return new _(3014, !1)
}

function b_(t) {
    return new _(3015, !1)
}

function E_(t) {
    return new _(3016, !1)
}

function S_(t, e) {
    return new _(3404, !1)
}

function C_(t) {
    return new _(3502, !1)
}

function D_(t) {
    return new _(3503, !1)
}

function I_() {
    return new _(3300, !1)
}

function M_(t) {
    return new _(3504, !1)
}

function __(t) {
    return new _(3301, !1)
}

function T_(t, e) {
    return new _(3302, !1)
}

function x_(t) {
    return new _(3303, !1)
}

function A_(t, e) {
    return new _(3400, !1)
}

function N_(t) {
    return new _(3401, !1)
}

function O_(t) {
    return new _(3402, !1)
}

function P_(t, e) {
    return new _(3505, !1)
}

function Yn(t) {
    switch (t.length) {
        case 0:
            return new Wn;
        case 1:
            return t[0];
        default:
            return new Fo(t)
    }
}

function M0(t, e, n = new Map, i = new Map) {
    let r = [], o = [], s = -1, a = null;
    if (e.forEach(l => {
        let c = l.get("offset"), f = c == s, p = f && a || new Map;
        l.forEach((m, g) => {
            let b = g, E = m;
            if (g !== "offset") switch (b = t.normalizePropertyName(b, r), E) {
                case Xa:
                    E = n.get(g);
                    break;
                case tn:
                    E = i.get(g);
                    break;
                default:
                    E = t.normalizeStyleValue(g, b, E, r);
                    break
            }
            p.set(b, E)
        }), f || o.push(p), a = p, s = c
    }), r.length) throw C_(r);
    return o
}

function kf(t, e, n, i) {
    switch (e) {
        case"start":
            t.onStart(() => i(n && ff(n, "start", t)));
            break;
        case"done":
            t.onDone(() => i(n && ff(n, "done", t)));
            break;
        case"destroy":
            t.onDestroy(() => i(n && ff(n, "destroy", t)));
            break
    }
}

function ff(t, e, n) {
    let i = n.totalTime, r = !!n.disabled,
        o = Ff(t.element, t.triggerName, t.fromState, t.toState, e || t.phaseName, i ?? t.totalTime, r), s = t._data;
    return s != null && (o._data = s), o
}

function Ff(t, e, n, i, r = "", o = 0, s) {
    return {element: t, triggerName: e, fromState: n, toState: i, phaseName: r, totalTime: o, disabled: !!s}
}

function bt(t, e, n) {
    let i = t.get(e);
    return i || t.set(e, i = n), i
}

function p0(t) {
    let e = t.indexOf(":"), n = t.substring(1, e), i = t.slice(e + 1);
    return [n, i]
}

var k_ = typeof document > "u" ? null : document.documentElement;

function Rf(t) {
    let e = t.parentNode || t.host || null;
    return e === k_ ? null : e
}

function F_(t) {
    return t.substring(1, 6) == "ebkit"
}

var Ei = null, h0 = !1;

function R_(t) {
    Ei || (Ei = L_() || {}, h0 = Ei.style ? "WebkitAppearance" in Ei.style : !1);
    let e = !0;
    return Ei.style && !F_(t) && (e = t in Ei.style, !e && h0 && (e = "Webkit" + t.charAt(0).toUpperCase() + t.slice(1) in Ei.style)), e
}

function L_() {
    return typeof document < "u" ? document.body : null
}

function _0(t, e) {
    for (; e;) {
        if (e === t) return !0;
        e = Rf(e)
    }
    return !1
}

function T0(t, e, n) {
    if (n) return Array.from(t.querySelectorAll(e));
    let i = t.querySelector(e);
    return i ? [i] : []
}

var Lf = (() => {
    let e = class e {
        validateStyleProperty(i) {
            return R_(i)
        }

        matchesElement(i, r) {
            return !1
        }

        containsElement(i, r) {
            return _0(i, r)
        }

        getParentElement(i) {
            return Rf(i)
        }

        query(i, r, o) {
            return T0(i, r, o)
        }

        computeStyle(i, r, o) {
            return o || ""
        }

        animate(i, r, o, s, a, l = [], c) {
            return new Wn(o, s)
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275prov = B({token: e, factory: e.\u0275fac});
    let t = e;
    return t
})(), Bf = class Bf {
};
Bf.NOOP = new Lf;
var Di = Bf, Ii = class {
};
var V_ = 1e3, x0 = "{{", j_ = "}}", A0 = "ng-enter", yf = "ng-leave", Ka = "ng-trigger", nl = ".ng-trigger",
    m0 = "ng-animating", wf = ".ng-animating";

function Dn(t) {
    if (typeof t == "number") return t;
    let e = t.match(/^(-?[\.\d]+)(m?s)/);
    return !e || e.length < 2 ? 0 : bf(parseFloat(e[1]), e[2])
}

function bf(t, e) {
    switch (e) {
        case"s":
            return t * V_;
        default:
            return t
    }
}

function il(t, e, n) {
    return t.hasOwnProperty("duration") ? t : $_(t, e, n)
}

function $_(t, e, n) {
    let i = /^(-?[\.\d]+)(m?s)(?:\s+(-?[\.\d]+)(m?s))?(?:\s+([-a-z]+(?:\(.+?\))?))?$/i, r, o = 0, s = "";
    if (typeof t == "string") {
        let a = t.match(i);
        if (a === null) return e.push(f0(t)), {duration: 0, delay: 0, easing: ""};
        r = bf(parseFloat(a[1]), a[2]);
        let l = a[3];
        l != null && (o = bf(parseFloat(l), a[4]));
        let c = a[5];
        c && (s = c)
    } else r = t;
    if (!n) {
        let a = !1, l = e.length;
        r < 0 && (e.push(i_()), a = !0), o < 0 && (e.push(r_()), a = !0), a && e.splice(l, 0, f0(t))
    }
    return {duration: r, delay: o, easing: s}
}

function B_(t) {
    return t.length ? t[0] instanceof Map ? t : t.map(e => new Map(Object.entries(e))) : []
}

function nn(t, e, n) {
    e.forEach((i, r) => {
        let o = Vf(r);
        n && !n.has(r) && n.set(r, t.style[o]), t.style[o] = i
    })
}

function Ci(t, e) {
    e.forEach((n, i) => {
        let r = Vf(i);
        t.style[r] = ""
    })
}

function Ro(t) {
    return Array.isArray(t) ? t.length == 1 ? t[0] : d0(t) : t
}

function H_(t, e, n) {
    let i = e.params || {}, r = N0(t);
    r.length && r.forEach(o => {
        i.hasOwnProperty(o) || n.push(o_(o))
    })
}

var Ef = new RegExp(`${x0}\\s*(.+?)\\s*${j_}`, "g");

function N0(t) {
    let e = [];
    if (typeof t == "string") {
        let n;
        for (; n = Ef.exec(t);) e.push(n[1]);
        Ef.lastIndex = 0
    }
    return e
}

function Vo(t, e, n) {
    let i = `${t}`, r = i.replace(Ef, (o, s) => {
        let a = e[s];
        return a == null && (n.push(s_(s)), a = ""), a.toString()
    });
    return r == i ? t : r
}

var U_ = /-+([a-z0-9])/g;

function Vf(t) {
    return t.replace(U_, (...e) => e[1].toUpperCase())
}

function z_(t, e) {
    return t === 0 || e === 0
}

function G_(t, e, n) {
    if (n.size && e.length) {
        let i = e[0], r = [];
        if (n.forEach((o, s) => {
            i.has(s) || r.push(s), i.set(s, o)
        }), r.length) for (let o = 1; o < e.length; o++) {
            let s = e[o];
            r.forEach(a => s.set(a, jf(t, a)))
        }
    }
    return e
}

function wt(t, e, n) {
    switch (e.type) {
        case ae.Trigger:
            return t.visitTrigger(e, n);
        case ae.State:
            return t.visitState(e, n);
        case ae.Transition:
            return t.visitTransition(e, n);
        case ae.Sequence:
            return t.visitSequence(e, n);
        case ae.Group:
            return t.visitGroup(e, n);
        case ae.Animate:
            return t.visitAnimate(e, n);
        case ae.Keyframes:
            return t.visitKeyframes(e, n);
        case ae.Style:
            return t.visitStyle(e, n);
        case ae.Reference:
            return t.visitReference(e, n);
        case ae.AnimateChild:
            return t.visitAnimateChild(e, n);
        case ae.AnimateRef:
            return t.visitAnimateRef(e, n);
        case ae.Query:
            return t.visitQuery(e, n);
        case ae.Stagger:
            return t.visitStagger(e, n);
        default:
            throw a_(e.type)
    }
}

function jf(t, e) {
    return window.getComputedStyle(t)[e]
}

var q_ = new Set(["width", "height", "minWidth", "minHeight", "maxWidth", "maxHeight", "left", "top", "bottom", "right", "fontSize", "outlineWidth", "outlineOffset", "paddingTop", "paddingLeft", "paddingBottom", "paddingRight", "marginTop", "marginLeft", "marginBottom", "marginRight", "borderRadius", "borderWidth", "borderTopWidth", "borderLeftWidth", "borderRightWidth", "borderBottomWidth", "textIndent", "perspective"]),
    rl = class extends Ii {
        normalizePropertyName(e, n) {
            return Vf(e)
        }

        normalizeStyleValue(e, n, i, r) {
            let o = "", s = i.toString().trim();
            if (q_.has(n) && i !== 0 && i !== "0") if (typeof i == "number") o = "px"; else {
                let a = i.match(/^[+-]?[\d\.]+([a-z]*)$/);
                a && a[1].length == 0 && r.push(l_(e, i))
            }
            return s + o
        }
    };
var ol = "*";

function W_(t, e) {
    let n = [];
    return typeof t == "string" ? t.split(/\s*,\s*/).forEach(i => Y_(i, n, e)) : n.push(t), n
}

function Y_(t, e, n) {
    if (t[0] == ":") {
        let l = Q_(t, n);
        if (typeof l == "function") {
            e.push(l);
            return
        }
        t = l
    }
    let i = t.match(/^(\*|[-\w]+)\s*(<?[=-]>)\s*(\*|[-\w]+)$/);
    if (i == null || i.length < 4) return n.push(b_(t)), e;
    let r = i[1], o = i[2], s = i[3];
    e.push(g0(r, s));
    let a = r == ol && s == ol;
    o[0] == "<" && !a && e.push(g0(s, r))
}

function Q_(t, e) {
    switch (t) {
        case":enter":
            return "void => *";
        case":leave":
            return "* => void";
        case":increment":
            return (n, i) => parseFloat(i) > parseFloat(n);
        case":decrement":
            return (n, i) => parseFloat(i) < parseFloat(n);
        default:
            return e.push(E_(t)), "* => *"
    }
}

var Za = new Set(["true", "1"]), Ja = new Set(["false", "0"]);

function g0(t, e) {
    let n = Za.has(t) || Ja.has(t), i = Za.has(e) || Ja.has(e);
    return (r, o) => {
        let s = t == ol || t == r, a = e == ol || e == o;
        return !s && n && typeof r == "boolean" && (s = r ? Za.has(t) : Ja.has(t)), !a && i && typeof o == "boolean" && (a = o ? Za.has(e) : Ja.has(e)), s && a
    }
}

var O0 = ":self", X_ = new RegExp(`s*${O0}s*,?`, "g");

function P0(t, e, n, i) {
    return new Sf(t).build(e, n, i)
}

var v0 = "", Sf = class {
    constructor(e) {
        this._driver = e
    }

    build(e, n, i) {
        let r = new Cf(n);
        return this._resetContextStyleTimingState(r), wt(this, Ro(e), r)
    }

    _resetContextStyleTimingState(e) {
        e.currentQuerySelector = v0, e.collectedStyles = new Map, e.collectedStyles.set(v0, new Map), e.currentTime = 0
    }

    visitTrigger(e, n) {
        let i = n.queryCount = 0, r = n.depCount = 0, o = [], s = [];
        return e.name.charAt(0) == "@" && n.errors.push(c_()), e.definitions.forEach(a => {
            if (this._resetContextStyleTimingState(n), a.type == ae.State) {
                let l = a, c = l.name;
                c.toString().split(/\s*,\s*/).forEach(f => {
                    l.name = f, o.push(this.visitState(l, n))
                }), l.name = c
            } else if (a.type == ae.Transition) {
                let l = this.visitTransition(a, n);
                i += l.queryCount, r += l.depCount, s.push(l)
            } else n.errors.push(u_())
        }), {type: ae.Trigger, name: e.name, states: o, transitions: s, queryCount: i, depCount: r, options: null}
    }

    visitState(e, n) {
        let i = this.visitStyle(e.styles, n), r = e.options && e.options.params || null;
        if (i.containsDynamicStyles) {
            let o = new Set, s = r || {};
            i.styles.forEach(a => {
                a instanceof Map && a.forEach(l => {
                    N0(l).forEach(c => {
                        s.hasOwnProperty(c) || o.add(c)
                    })
                })
            }), o.size && n.errors.push(d_(e.name, [...o.values()]))
        }
        return {type: ae.State, name: e.name, style: i, options: r ? {params: r} : null}
    }

    visitTransition(e, n) {
        n.queryCount = 0, n.depCount = 0;
        let i = wt(this, Ro(e.animation), n), r = W_(e.expr, n.errors);
        return {
            type: ae.Transition,
            matchers: r,
            animation: i,
            queryCount: n.queryCount,
            depCount: n.depCount,
            options: Si(e.options)
        }
    }

    visitSequence(e, n) {
        return {type: ae.Sequence, steps: e.steps.map(i => wt(this, i, n)), options: Si(e.options)}
    }

    visitGroup(e, n) {
        let i = n.currentTime, r = 0, o = e.steps.map(s => {
            n.currentTime = i;
            let a = wt(this, s, n);
            return r = Math.max(r, n.currentTime), a
        });
        return n.currentTime = r, {type: ae.Group, steps: o, options: Si(e.options)}
    }

    visitAnimate(e, n) {
        let i = eT(e.timings, n.errors);
        n.currentAnimateTimings = i;
        let r, o = e.styles ? e.styles : df({});
        if (o.type == ae.Keyframes) r = this.visitKeyframes(o, n); else {
            let s = e.styles, a = !1;
            if (!s) {
                a = !0;
                let c = {};
                i.easing && (c.easing = i.easing), s = df(c)
            }
            n.currentTime += i.duration + i.delay;
            let l = this.visitStyle(s, n);
            l.isEmptyStep = a, r = l
        }
        return n.currentAnimateTimings = null, {type: ae.Animate, timings: i, style: r, options: null}
    }

    visitStyle(e, n) {
        let i = this._makeStyleAst(e, n);
        return this._validateStyleAst(i, n), i
    }

    _makeStyleAst(e, n) {
        let i = [], r = Array.isArray(e.styles) ? e.styles : [e.styles];
        for (let a of r) typeof a == "string" ? a === tn ? i.push(a) : n.errors.push(f_(a)) : i.push(new Map(Object.entries(a)));
        let o = !1, s = null;
        return i.forEach(a => {
            if (a instanceof Map && (a.has("easing") && (s = a.get("easing"), a.delete("easing")), !o)) {
                for (let l of a.values()) if (l.toString().indexOf(x0) >= 0) {
                    o = !0;
                    break
                }
            }
        }), {type: ae.Style, styles: i, easing: s, offset: e.offset, containsDynamicStyles: o, options: null}
    }

    _validateStyleAst(e, n) {
        let i = n.currentAnimateTimings, r = n.currentTime, o = n.currentTime;
        i && o > 0 && (o -= i.duration + i.delay), e.styles.forEach(s => {
            typeof s != "string" && s.forEach((a, l) => {
                let c = n.collectedStyles.get(n.currentQuerySelector), f = c.get(l), p = !0;
                f && (o != r && o >= f.startTime && r <= f.endTime && (n.errors.push(p_(l, f.startTime, f.endTime, o, r)), p = !1), o = f.startTime), p && c.set(l, {
                    startTime: o,
                    endTime: r
                }), n.options && H_(a, n.options, n.errors)
            })
        })
    }

    visitKeyframes(e, n) {
        let i = {type: ae.Keyframes, styles: [], options: null};
        if (!n.currentAnimateTimings) return n.errors.push(h_()), i;
        let r = 1, o = 0, s = [], a = !1, l = !1, c = 0, f = e.steps.map(w => {
            let S = this._makeStyleAst(w, n), C = S.offset != null ? S.offset : J_(S.styles), I = 0;
            return C != null && (o++, I = S.offset = C), l = l || I < 0 || I > 1, a = a || I < c, c = I, s.push(I), S
        });
        l && n.errors.push(m_()), a && n.errors.push(g_());
        let p = e.steps.length, m = 0;
        o > 0 && o < p ? n.errors.push(v_()) : o == 0 && (m = r / (p - 1));
        let g = p - 1, b = n.currentTime, E = n.currentAnimateTimings, M = E.duration;
        return f.forEach((w, S) => {
            let C = m > 0 ? S == g ? 1 : m * S : s[S], I = C * M;
            n.currentTime = b + E.delay + I, E.duration = I, this._validateStyleAst(w, n), w.offset = C, i.styles.push(w)
        }), i
    }

    visitReference(e, n) {
        return {type: ae.Reference, animation: wt(this, Ro(e.animation), n), options: Si(e.options)}
    }

    visitAnimateChild(e, n) {
        return n.depCount++, {type: ae.AnimateChild, options: Si(e.options)}
    }

    visitAnimateRef(e, n) {
        return {type: ae.AnimateRef, animation: this.visitReference(e.animation, n), options: Si(e.options)}
    }

    visitQuery(e, n) {
        let i = n.currentQuerySelector, r = e.options || {};
        n.queryCount++, n.currentQuery = e;
        let [o, s] = K_(e.selector);
        n.currentQuerySelector = i.length ? i + " " + o : o, bt(n.collectedStyles, n.currentQuerySelector, new Map);
        let a = wt(this, Ro(e.animation), n);
        return n.currentQuery = null, n.currentQuerySelector = i, {
            type: ae.Query,
            selector: o,
            limit: r.limit || 0,
            optional: !!r.optional,
            includeSelf: s,
            animation: a,
            originalSelector: e.selector,
            options: Si(e.options)
        }
    }

    visitStagger(e, n) {
        n.currentQuery || n.errors.push(y_());
        let i = e.timings === "full" ? {duration: 0, delay: 0, easing: "full"} : il(e.timings, n.errors, !0);
        return {type: ae.Stagger, animation: wt(this, Ro(e.animation), n), timings: i, options: null}
    }
};

function K_(t) {
    let e = !!t.split(/\s*,\s*/).find(n => n == O0);
    return e && (t = t.replace(X_, "")), t = t.replace(/@\*/g, nl).replace(/@\w+/g, n => nl + "-" + n.slice(1)).replace(/:animating/g, wf), [t, e]
}

function Z_(t) {
    return t ? k({}, t) : null
}

var Cf = class {
    constructor(e) {
        this.errors = e, this.queryCount = 0, this.depCount = 0, this.currentTransition = null, this.currentQuery = null, this.currentQuerySelector = null, this.currentAnimateTimings = null, this.currentTime = 0, this.collectedStyles = new Map, this.options = null, this.unsupportedCSSPropertiesFound = new Set
    }
};

function J_(t) {
    if (typeof t == "string") return null;
    let e = null;
    if (Array.isArray(t)) t.forEach(n => {
        if (n instanceof Map && n.has("offset")) {
            let i = n;
            e = parseFloat(i.get("offset")), i.delete("offset")
        }
    }); else if (t instanceof Map && t.has("offset")) {
        let n = t;
        e = parseFloat(n.get("offset")), n.delete("offset")
    }
    return e
}

function eT(t, e) {
    if (t.hasOwnProperty("duration")) return t;
    if (typeof t == "number") {
        let o = il(t, e).duration;
        return pf(o, 0, "")
    }
    let n = t;
    if (n.split(/\s+/).some(o => o.charAt(0) == "{" && o.charAt(1) == "{")) {
        let o = pf(0, 0, "");
        return o.dynamic = !0, o.strValue = n, o
    }
    let r = il(n, e);
    return pf(r.duration, r.delay, r.easing)
}

function Si(t) {
    return t ? (t = k({}, t), t.params && (t.params = Z_(t.params))) : t = {}, t
}

function pf(t, e, n) {
    return {duration: t, delay: e, easing: n}
}

function $f(t, e, n, i, r, o, s = null, a = !1) {
    return {
        type: 1,
        element: t,
        keyframes: e,
        preStyleProps: n,
        postStyleProps: i,
        duration: r,
        delay: o,
        totalTime: r + o,
        easing: s,
        subTimeline: a
    }
}

var jo = class {
    constructor() {
        this._map = new Map
    }

    get(e) {
        return this._map.get(e) || []
    }

    append(e, n) {
        let i = this._map.get(e);
        i || this._map.set(e, i = []), i.push(...n)
    }

    has(e) {
        return this._map.has(e)
    }

    clear() {
        this._map.clear()
    }
}, tT = 1, nT = ":enter", iT = new RegExp(nT, "g"), rT = ":leave", oT = new RegExp(rT, "g");

function k0(t, e, n, i, r, o = new Map, s = new Map, a, l, c = []) {
    return new Df().buildKeyframes(t, e, n, i, r, o, s, a, l, c)
}

var Df = class {
    buildKeyframes(e, n, i, r, o, s, a, l, c, f = []) {
        c = c || new jo;
        let p = new If(e, n, c, r, o, f, []);
        p.options = l;
        let m = l.delay ? Dn(l.delay) : 0;
        p.currentTimeline.delayNextStep(m), p.currentTimeline.setStyles([s], null, p.errors, l), wt(this, i, p);
        let g = p.timelines.filter(b => b.containsAnimation());
        if (g.length && a.size) {
            let b;
            for (let E = g.length - 1; E >= 0; E--) {
                let M = g[E];
                if (M.element === n) {
                    b = M;
                    break
                }
            }
            b && !b.allowOnlyTimelineStyles() && b.setStyles([a], null, p.errors, l)
        }
        return g.length ? g.map(b => b.buildKeyframes()) : [$f(n, [], [], [], 0, m, "", !1)]
    }

    visitTrigger(e, n) {
    }

    visitState(e, n) {
    }

    visitTransition(e, n) {
    }

    visitAnimateChild(e, n) {
        let i = n.subInstructions.get(n.element);
        if (i) {
            let r = n.createSubContext(e.options), o = n.currentTimeline.currentTime,
                s = this._visitSubInstructions(i, r, r.options);
            o != s && n.transformIntoNewTimeline(s)
        }
        n.previousNode = e
    }

    visitAnimateRef(e, n) {
        let i = n.createSubContext(e.options);
        i.transformIntoNewTimeline(), this._applyAnimationRefDelays([e.options, e.animation.options], n, i), this.visitReference(e.animation, i), n.transformIntoNewTimeline(i.currentTimeline.currentTime), n.previousNode = e
    }

    _applyAnimationRefDelays(e, n, i) {
        for (let r of e) {
            let o = r?.delay;
            if (o) {
                let s = typeof o == "number" ? o : Dn(Vo(o, r?.params ?? {}, n.errors));
                i.delayNextStep(s)
            }
        }
    }

    _visitSubInstructions(e, n, i) {
        let o = n.currentTimeline.currentTime, s = i.duration != null ? Dn(i.duration) : null,
            a = i.delay != null ? Dn(i.delay) : null;
        return s !== 0 && e.forEach(l => {
            let c = n.appendInstructionToTimeline(l, s, a);
            o = Math.max(o, c.duration + c.delay)
        }), o
    }

    visitReference(e, n) {
        n.updateOptions(e.options, !0), wt(this, e.animation, n), n.previousNode = e
    }

    visitSequence(e, n) {
        let i = n.subContextCount, r = n, o = e.options;
        if (o && (o.params || o.delay) && (r = n.createSubContext(o), r.transformIntoNewTimeline(), o.delay != null)) {
            r.previousNode.type == ae.Style && (r.currentTimeline.snapshotCurrentStyles(), r.previousNode = sl);
            let s = Dn(o.delay);
            r.delayNextStep(s)
        }
        e.steps.length && (e.steps.forEach(s => wt(this, s, r)), r.currentTimeline.applyStylesToKeyframe(), r.subContextCount > i && r.transformIntoNewTimeline()), n.previousNode = e
    }

    visitGroup(e, n) {
        let i = [], r = n.currentTimeline.currentTime, o = e.options && e.options.delay ? Dn(e.options.delay) : 0;
        e.steps.forEach(s => {
            let a = n.createSubContext(e.options);
            o && a.delayNextStep(o), wt(this, s, a), r = Math.max(r, a.currentTimeline.currentTime), i.push(a.currentTimeline)
        }), i.forEach(s => n.currentTimeline.mergeTimelineCollectedStyles(s)), n.transformIntoNewTimeline(r), n.previousNode = e
    }

    _visitTiming(e, n) {
        if (e.dynamic) {
            let i = e.strValue, r = n.params ? Vo(i, n.params, n.errors) : i;
            return il(r, n.errors)
        } else return {duration: e.duration, delay: e.delay, easing: e.easing}
    }

    visitAnimate(e, n) {
        let i = n.currentAnimateTimings = this._visitTiming(e.timings, n), r = n.currentTimeline;
        i.delay && (n.incrementTime(i.delay), r.snapshotCurrentStyles());
        let o = e.style;
        o.type == ae.Keyframes ? this.visitKeyframes(o, n) : (n.incrementTime(i.duration), this.visitStyle(o, n), r.applyStylesToKeyframe()), n.currentAnimateTimings = null, n.previousNode = e
    }

    visitStyle(e, n) {
        let i = n.currentTimeline, r = n.currentAnimateTimings;
        !r && i.hasCurrentStyleProperties() && i.forwardFrame();
        let o = r && r.easing || e.easing;
        e.isEmptyStep ? i.applyEmptyStep(o) : i.setStyles(e.styles, o, n.errors, n.options), n.previousNode = e
    }

    visitKeyframes(e, n) {
        let i = n.currentAnimateTimings, r = n.currentTimeline.duration, o = i.duration,
            a = n.createSubContext().currentTimeline;
        a.easing = i.easing, e.styles.forEach(l => {
            let c = l.offset || 0;
            a.forwardTime(c * o), a.setStyles(l.styles, l.easing, n.errors, n.options), a.applyStylesToKeyframe()
        }), n.currentTimeline.mergeTimelineCollectedStyles(a), n.transformIntoNewTimeline(r + o), n.previousNode = e
    }

    visitQuery(e, n) {
        let i = n.currentTimeline.currentTime, r = e.options || {}, o = r.delay ? Dn(r.delay) : 0;
        o && (n.previousNode.type === ae.Style || i == 0 && n.currentTimeline.hasCurrentStyleProperties()) && (n.currentTimeline.snapshotCurrentStyles(), n.previousNode = sl);
        let s = i, a = n.invokeQuery(e.selector, e.originalSelector, e.limit, e.includeSelf, !!r.optional, n.errors);
        n.currentQueryTotal = a.length;
        let l = null;
        a.forEach((c, f) => {
            n.currentQueryIndex = f;
            let p = n.createSubContext(e.options, c);
            o && p.delayNextStep(o), c === n.element && (l = p.currentTimeline), wt(this, e.animation, p), p.currentTimeline.applyStylesToKeyframe();
            let m = p.currentTimeline.currentTime;
            s = Math.max(s, m)
        }), n.currentQueryIndex = 0, n.currentQueryTotal = 0, n.transformIntoNewTimeline(s), l && (n.currentTimeline.mergeTimelineCollectedStyles(l), n.currentTimeline.snapshotCurrentStyles()), n.previousNode = e
    }

    visitStagger(e, n) {
        let i = n.parentContext, r = n.currentTimeline, o = e.timings, s = Math.abs(o.duration),
            a = s * (n.currentQueryTotal - 1), l = s * n.currentQueryIndex;
        switch (o.duration < 0 ? "reverse" : o.easing) {
            case"reverse":
                l = a - l;
                break;
            case"full":
                l = i.currentStaggerTime;
                break
        }
        let f = n.currentTimeline;
        l && f.delayNextStep(l);
        let p = f.currentTime;
        wt(this, e.animation, n), n.previousNode = e, i.currentStaggerTime = r.currentTime - p + (r.startTime - i.currentTimeline.startTime)
    }
}, sl = {}, If = class t {
    constructor(e, n, i, r, o, s, a, l) {
        this._driver = e, this.element = n, this.subInstructions = i, this._enterClassName = r, this._leaveClassName = o, this.errors = s, this.timelines = a, this.parentContext = null, this.currentAnimateTimings = null, this.previousNode = sl, this.subContextCount = 0, this.options = {}, this.currentQueryIndex = 0, this.currentQueryTotal = 0, this.currentStaggerTime = 0, this.currentTimeline = l || new al(this._driver, n, 0), a.push(this.currentTimeline)
    }

    get params() {
        return this.options.params
    }

    updateOptions(e, n) {
        if (!e) return;
        let i = e, r = this.options;
        i.duration != null && (r.duration = Dn(i.duration)), i.delay != null && (r.delay = Dn(i.delay));
        let o = i.params;
        if (o) {
            let s = r.params;
            s || (s = this.options.params = {}), Object.keys(o).forEach(a => {
                (!n || !s.hasOwnProperty(a)) && (s[a] = Vo(o[a], s, this.errors))
            })
        }
    }

    _copyOptions() {
        let e = {};
        if (this.options) {
            let n = this.options.params;
            if (n) {
                let i = e.params = {};
                Object.keys(n).forEach(r => {
                    i[r] = n[r]
                })
            }
        }
        return e
    }

    createSubContext(e = null, n, i) {
        let r = n || this.element,
            o = new t(this._driver, r, this.subInstructions, this._enterClassName, this._leaveClassName, this.errors, this.timelines, this.currentTimeline.fork(r, i || 0));
        return o.previousNode = this.previousNode, o.currentAnimateTimings = this.currentAnimateTimings, o.options = this._copyOptions(), o.updateOptions(e), o.currentQueryIndex = this.currentQueryIndex, o.currentQueryTotal = this.currentQueryTotal, o.parentContext = this, this.subContextCount++, o
    }

    transformIntoNewTimeline(e) {
        return this.previousNode = sl, this.currentTimeline = this.currentTimeline.fork(this.element, e), this.timelines.push(this.currentTimeline), this.currentTimeline
    }

    appendInstructionToTimeline(e, n, i) {
        let r = {duration: n ?? e.duration, delay: this.currentTimeline.currentTime + (i ?? 0) + e.delay, easing: ""},
            o = new Mf(this._driver, e.element, e.keyframes, e.preStyleProps, e.postStyleProps, r, e.stretchStartingKeyframe);
        return this.timelines.push(o), r
    }

    incrementTime(e) {
        this.currentTimeline.forwardTime(this.currentTimeline.duration + e)
    }

    delayNextStep(e) {
        e > 0 && this.currentTimeline.delayNextStep(e)
    }

    invokeQuery(e, n, i, r, o, s) {
        let a = [];
        if (r && a.push(this.element), e.length > 0) {
            e = e.replace(iT, "." + this._enterClassName), e = e.replace(oT, "." + this._leaveClassName);
            let l = i != 1, c = this._driver.query(this.element, e, l);
            i !== 0 && (c = i < 0 ? c.slice(c.length + i, c.length) : c.slice(0, i)), a.push(...c)
        }
        return !o && a.length == 0 && s.push(w_(n)), a
    }
}, al = class t {
    constructor(e, n, i, r) {
        this._driver = e, this.element = n, this.startTime = i, this._elementTimelineStylesLookup = r, this.duration = 0, this.easing = null, this._previousKeyframe = new Map, this._currentKeyframe = new Map, this._keyframes = new Map, this._styleSummary = new Map, this._localTimelineStyles = new Map, this._pendingStyles = new Map, this._backFill = new Map, this._currentEmptyStepKeyframe = null, this._elementTimelineStylesLookup || (this._elementTimelineStylesLookup = new Map), this._globalTimelineStyles = this._elementTimelineStylesLookup.get(n), this._globalTimelineStyles || (this._globalTimelineStyles = this._localTimelineStyles, this._elementTimelineStylesLookup.set(n, this._localTimelineStyles)), this._loadKeyframe()
    }

    containsAnimation() {
        switch (this._keyframes.size) {
            case 0:
                return !1;
            case 1:
                return this.hasCurrentStyleProperties();
            default:
                return !0
        }
    }

    hasCurrentStyleProperties() {
        return this._currentKeyframe.size > 0
    }

    get currentTime() {
        return this.startTime + this.duration
    }

    delayNextStep(e) {
        let n = this._keyframes.size === 1 && this._pendingStyles.size;
        this.duration || n ? (this.forwardTime(this.currentTime + e), n && this.snapshotCurrentStyles()) : this.startTime += e
    }

    fork(e, n) {
        return this.applyStylesToKeyframe(), new t(this._driver, e, n || this.currentTime, this._elementTimelineStylesLookup)
    }

    _loadKeyframe() {
        this._currentKeyframe && (this._previousKeyframe = this._currentKeyframe), this._currentKeyframe = this._keyframes.get(this.duration), this._currentKeyframe || (this._currentKeyframe = new Map, this._keyframes.set(this.duration, this._currentKeyframe))
    }

    forwardFrame() {
        this.duration += tT, this._loadKeyframe()
    }

    forwardTime(e) {
        this.applyStylesToKeyframe(), this.duration = e, this._loadKeyframe()
    }

    _updateStyle(e, n) {
        this._localTimelineStyles.set(e, n), this._globalTimelineStyles.set(e, n), this._styleSummary.set(e, {
            time: this.currentTime,
            value: n
        })
    }

    allowOnlyTimelineStyles() {
        return this._currentEmptyStepKeyframe !== this._currentKeyframe
    }

    applyEmptyStep(e) {
        e && this._previousKeyframe.set("easing", e);
        for (let [n, i] of this._globalTimelineStyles) this._backFill.set(n, i || tn), this._currentKeyframe.set(n, tn);
        this._currentEmptyStepKeyframe = this._currentKeyframe
    }

    setStyles(e, n, i, r) {
        n && this._previousKeyframe.set("easing", n);
        let o = r && r.params || {}, s = sT(e, this._globalTimelineStyles);
        for (let [a, l] of s) {
            let c = Vo(l, o, i);
            this._pendingStyles.set(a, c), this._localTimelineStyles.has(a) || this._backFill.set(a, this._globalTimelineStyles.get(a) ?? tn), this._updateStyle(a, c)
        }
    }

    applyStylesToKeyframe() {
        this._pendingStyles.size != 0 && (this._pendingStyles.forEach((e, n) => {
            this._currentKeyframe.set(n, e)
        }), this._pendingStyles.clear(), this._localTimelineStyles.forEach((e, n) => {
            this._currentKeyframe.has(n) || this._currentKeyframe.set(n, e)
        }))
    }

    snapshotCurrentStyles() {
        for (let [e, n] of this._localTimelineStyles) this._pendingStyles.set(e, n), this._updateStyle(e, n)
    }

    getFinalKeyframe() {
        return this._keyframes.get(this.duration)
    }

    get properties() {
        let e = [];
        for (let n in this._currentKeyframe) e.push(n);
        return e
    }

    mergeTimelineCollectedStyles(e) {
        e._styleSummary.forEach((n, i) => {
            let r = this._styleSummary.get(i);
            (!r || n.time > r.time) && this._updateStyle(i, n.value)
        })
    }

    buildKeyframes() {
        this.applyStylesToKeyframe();
        let e = new Set, n = new Set, i = this._keyframes.size === 1 && this.duration === 0, r = [];
        this._keyframes.forEach((a, l) => {
            let c = new Map([...this._backFill, ...a]);
            c.forEach((f, p) => {
                f === Xa ? e.add(p) : f === tn && n.add(p)
            }), i || c.set("offset", l / this.duration), r.push(c)
        });
        let o = [...e.values()], s = [...n.values()];
        if (i) {
            let a = r[0], l = new Map(a);
            a.set("offset", 0), l.set("offset", 1), r = [a, l]
        }
        return $f(this.element, r, o, s, this.duration, this.startTime, this.easing, !1)
    }
}, Mf = class extends al {
    constructor(e, n, i, r, o, s, a = !1) {
        super(e, n, s.delay), this.keyframes = i, this.preStyleProps = r, this.postStyleProps = o, this._stretchStartingKeyframe = a, this.timings = {
            duration: s.duration,
            delay: s.delay,
            easing: s.easing
        }
    }

    containsAnimation() {
        return this.keyframes.length > 1
    }

    buildKeyframes() {
        let e = this.keyframes, {delay: n, duration: i, easing: r} = this.timings;
        if (this._stretchStartingKeyframe && n) {
            let o = [], s = i + n, a = n / s, l = new Map(e[0]);
            l.set("offset", 0), o.push(l);
            let c = new Map(e[0]);
            c.set("offset", y0(a)), o.push(c);
            let f = e.length - 1;
            for (let p = 1; p <= f; p++) {
                let m = new Map(e[p]), g = m.get("offset"), b = n + g * i;
                m.set("offset", y0(b / s)), o.push(m)
            }
            i = s, n = 0, r = "", e = o
        }
        return $f(this.element, e, this.preStyleProps, this.postStyleProps, i, n, r, !0)
    }
};

function y0(t, e = 3) {
    let n = Math.pow(10, e - 1);
    return Math.round(t * n) / n
}

function sT(t, e) {
    let n = new Map, i;
    return t.forEach(r => {
        if (r === "*") {
            i ??= e.keys();
            for (let o of i) n.set(o, tn)
        } else for (let [o, s] of r) n.set(o, s)
    }), n
}

function w0(t, e, n, i, r, o, s, a, l, c, f, p, m) {
    return {
        type: 0,
        element: t,
        triggerName: e,
        isRemovalTransition: r,
        fromState: n,
        fromStyles: o,
        toState: i,
        toStyles: s,
        timelines: a,
        queriedElements: l,
        preStyleProps: c,
        postStyleProps: f,
        totalTime: p,
        errors: m
    }
}

var hf = {}, ll = class {
    constructor(e, n, i) {
        this._triggerName = e, this.ast = n, this._stateStyles = i
    }

    match(e, n, i, r) {
        return aT(this.ast.matchers, e, n, i, r)
    }

    buildStyles(e, n, i) {
        let r = this._stateStyles.get("*");
        return e !== void 0 && (r = this._stateStyles.get(e?.toString()) || r), r ? r.buildStyles(n, i) : new Map
    }

    build(e, n, i, r, o, s, a, l, c, f) {
        let p = [], m = this.ast.options && this.ast.options.params || hf, g = a && a.params || hf,
            b = this.buildStyles(i, g, p), E = l && l.params || hf, M = this.buildStyles(r, E, p), w = new Set,
            S = new Map, C = new Map, I = r === "void", O = {params: F0(E, m), delay: this.ast.options?.delay},
            U = f ? [] : k0(e, n, this.ast.animation, o, s, b, M, O, c, p), de = 0;
        return U.forEach(L => {
            de = Math.max(L.duration + L.delay, de)
        }), p.length ? w0(n, this._triggerName, i, r, I, b, M, [], [], S, C, de, p) : (U.forEach(L => {
            let Ce = L.element, A = bt(S, Ce, new Set);
            L.preStyleProps.forEach(V => A.add(V));
            let W = bt(C, Ce, new Set);
            L.postStyleProps.forEach(V => W.add(V)), Ce !== n && w.add(Ce)
        }), w0(n, this._triggerName, i, r, I, b, M, U, [...w.values()], S, C, de))
    }
};

function aT(t, e, n, i, r) {
    return t.some(o => o(e, n, i, r))
}

function F0(t, e) {
    let n = k({}, e);
    return Object.entries(t).forEach(([i, r]) => {
        r != null && (n[i] = r)
    }), n
}

var _f = class {
    constructor(e, n, i) {
        this.styles = e, this.defaultParams = n, this.normalizer = i
    }

    buildStyles(e, n) {
        let i = new Map, r = F0(e, this.defaultParams);
        return this.styles.styles.forEach(o => {
            typeof o != "string" && o.forEach((s, a) => {
                s && (s = Vo(s, r, n));
                let l = this.normalizer.normalizePropertyName(a, n);
                s = this.normalizer.normalizeStyleValue(a, l, s, n), i.set(a, s)
            })
        }), i
    }
};

function lT(t, e, n) {
    return new Tf(t, e, n)
}

var Tf = class {
    constructor(e, n, i) {
        this.name = e, this.ast = n, this._normalizer = i, this.transitionFactories = [], this.states = new Map, n.states.forEach(r => {
            let o = r.options && r.options.params || {};
            this.states.set(r.name, new _f(r.style, o, i))
        }), b0(this.states, "true", "1"), b0(this.states, "false", "0"), n.transitions.forEach(r => {
            this.transitionFactories.push(new ll(e, r, this.states))
        }), this.fallbackTransition = cT(e, this.states, this._normalizer)
    }

    get containsQueries() {
        return this.ast.queryCount > 0
    }

    matchTransition(e, n, i, r) {
        return this.transitionFactories.find(s => s.match(e, n, i, r)) || null
    }

    matchStyles(e, n, i) {
        return this.fallbackTransition.buildStyles(e, n, i)
    }
};

function cT(t, e, n) {
    let i = [(s, a) => !0], r = {type: ae.Sequence, steps: [], options: null},
        o = {type: ae.Transition, animation: r, matchers: i, options: null, queryCount: 0, depCount: 0};
    return new ll(t, o, e)
}

function b0(t, e, n) {
    t.has(e) ? t.has(n) || t.set(n, t.get(e)) : t.has(n) && t.set(e, t.get(n))
}

var uT = new jo, xf = class {
        constructor(e, n, i) {
            this.bodyNode = e, this._driver = n, this._normalizer = i, this._animations = new Map, this._playersById = new Map, this.players = []
        }

        register(e, n) {
            let i = [], r = [], o = P0(this._driver, n, i, r);
            if (i.length) throw D_(i);
            r.length && void 0, this._animations.set(e, o)
        }

        _buildPlayer(e, n, i) {
            let r = e.element, o = M0(this._normalizer, e.keyframes, n, i);
            return this._driver.animate(r, o, e.duration, e.delay, e.easing, [], !0)
        }

        create(e, n, i = {}) {
            let r = [], o = this._animations.get(e), s, a = new Map;
            if (o ? (s = k0(this._driver, n, o, A0, yf, new Map, new Map, i, uT, r), s.forEach(f => {
                let p = bt(a, f.element, new Map);
                f.postStyleProps.forEach(m => p.set(m, null))
            })) : (r.push(I_()), s = []), r.length) throw M_(r);
            a.forEach((f, p) => {
                f.forEach((m, g) => {
                    f.set(g, this._driver.computeStyle(p, g, tn))
                })
            });
            let l = s.map(f => {
                let p = a.get(f.element);
                return this._buildPlayer(f, new Map, p)
            }), c = Yn(l);
            return this._playersById.set(e, c), c.onDestroy(() => this.destroy(e)), this.players.push(c), c
        }

        destroy(e) {
            let n = this._getPlayer(e);
            n.destroy(), this._playersById.delete(e);
            let i = this.players.indexOf(n);
            i >= 0 && this.players.splice(i, 1)
        }

        _getPlayer(e) {
            let n = this._playersById.get(e);
            if (!n) throw __(e);
            return n
        }

        listen(e, n, i, r) {
            let o = Ff(n, "", "", "");
            return kf(this._getPlayer(e), i, o, r), () => {
            }
        }

        command(e, n, i, r) {
            if (i == "register") {
                this.register(e, r[0]);
                return
            }
            if (i == "create") {
                let s = r[0] || {};
                this.create(e, n, s);
                return
            }
            let o = this._getPlayer(e);
            switch (i) {
                case"play":
                    o.play();
                    break;
                case"pause":
                    o.pause();
                    break;
                case"reset":
                    o.reset();
                    break;
                case"restart":
                    o.restart();
                    break;
                case"finish":
                    o.finish();
                    break;
                case"init":
                    o.init();
                    break;
                case"setPosition":
                    o.setPosition(parseFloat(r[0]));
                    break;
                case"destroy":
                    this.destroy(e);
                    break
            }
        }
    }, E0 = "ng-animate-queued", dT = ".ng-animate-queued", mf = "ng-animate-disabled", fT = ".ng-animate-disabled",
    pT = "ng-star-inserted", hT = ".ng-star-inserted", mT = [],
    R0 = {namespaceId: "", setForRemoval: !1, setForMove: !1, hasAnimation: !1, removedBeforeQueried: !1},
    gT = {namespaceId: "", setForMove: !1, setForRemoval: !1, hasAnimation: !1, removedBeforeQueried: !0},
    jt = "__ng_removed", $o = class {
        get params() {
            return this.options.params
        }

        constructor(e, n = "") {
            this.namespaceId = n;
            let i = e && e.hasOwnProperty("value"), r = i ? e.value : e;
            if (this.value = yT(r), i) {
                let o = e, {value: s} = o, a = up(o, ["value"]);
                this.options = a
            } else this.options = {};
            this.options.params || (this.options.params = {})
        }

        absorbOptions(e) {
            let n = e.params;
            if (n) {
                let i = this.options.params;
                Object.keys(n).forEach(r => {
                    i[r] == null && (i[r] = n[r])
                })
            }
        }
    }, Lo = "void", gf = new $o(Lo), Af = class {
        constructor(e, n, i) {
            this.id = e, this.hostElement = n, this._engine = i, this.players = [], this._triggers = new Map, this._queue = [], this._elementListeners = new Map, this._hostClassName = "ng-tns-" + e, At(n, this._hostClassName)
        }

        listen(e, n, i, r) {
            if (!this._triggers.has(n)) throw T_(i, n);
            if (i == null || i.length == 0) throw x_(n);
            if (!wT(i)) throw A_(i, n);
            let o = bt(this._elementListeners, e, []), s = {name: n, phase: i, callback: r};
            o.push(s);
            let a = bt(this._engine.statesByElement, e, new Map);
            return a.has(n) || (At(e, Ka), At(e, Ka + "-" + n), a.set(n, gf)), () => {
                this._engine.afterFlush(() => {
                    let l = o.indexOf(s);
                    l >= 0 && o.splice(l, 1), this._triggers.has(n) || a.delete(n)
                })
            }
        }

        register(e, n) {
            return this._triggers.has(e) ? !1 : (this._triggers.set(e, n), !0)
        }

        _getTrigger(e) {
            let n = this._triggers.get(e);
            if (!n) throw N_(e);
            return n
        }

        trigger(e, n, i, r = !0) {
            let o = this._getTrigger(n), s = new Bo(this.id, n, e), a = this._engine.statesByElement.get(e);
            a || (At(e, Ka), At(e, Ka + "-" + n), this._engine.statesByElement.set(e, a = new Map));
            let l = a.get(n), c = new $o(i, this.id);
            if (!(i && i.hasOwnProperty("value")) && l && c.absorbOptions(l.options), a.set(n, c), l || (l = gf), !(c.value === Lo) && l.value === c.value) {
                if (!ST(l.params, c.params)) {
                    let E = [], M = o.matchStyles(l.value, l.params, E), w = o.matchStyles(c.value, c.params, E);
                    E.length ? this._engine.reportError(E) : this._engine.afterFlush(() => {
                        Ci(e, M), nn(e, w)
                    })
                }
                return
            }
            let m = bt(this._engine.playersByElement, e, []);
            m.forEach(E => {
                E.namespaceId == this.id && E.triggerName == n && E.queued && E.destroy()
            });
            let g = o.matchTransition(l.value, c.value, e, c.params), b = !1;
            if (!g) {
                if (!r) return;
                g = o.fallbackTransition, b = !0
            }
            return this._engine.totalQueuedPlayers++, this._queue.push({
                element: e,
                triggerName: n,
                transition: g,
                fromState: l,
                toState: c,
                player: s,
                isFallbackTransition: b
            }), b || (At(e, E0), s.onStart(() => {
                Cr(e, E0)
            })), s.onDone(() => {
                let E = this.players.indexOf(s);
                E >= 0 && this.players.splice(E, 1);
                let M = this._engine.playersByElement.get(e);
                if (M) {
                    let w = M.indexOf(s);
                    w >= 0 && M.splice(w, 1)
                }
            }), this.players.push(s), m.push(s), s
        }

        deregister(e) {
            this._triggers.delete(e), this._engine.statesByElement.forEach(n => n.delete(e)), this._elementListeners.forEach((n, i) => {
                this._elementListeners.set(i, n.filter(r => r.name != e))
            })
        }

        clearElementCache(e) {
            this._engine.statesByElement.delete(e), this._elementListeners.delete(e);
            let n = this._engine.playersByElement.get(e);
            n && (n.forEach(i => i.destroy()), this._engine.playersByElement.delete(e))
        }

        _signalRemovalForInnerTriggers(e, n) {
            let i = this._engine.driver.query(e, nl, !0);
            i.forEach(r => {
                if (r[jt]) return;
                let o = this._engine.fetchNamespacesByElement(r);
                o.size ? o.forEach(s => s.triggerLeaveAnimation(r, n, !1, !0)) : this.clearElementCache(r)
            }), this._engine.afterFlushAnimationsDone(() => i.forEach(r => this.clearElementCache(r)))
        }

        triggerLeaveAnimation(e, n, i, r) {
            let o = this._engine.statesByElement.get(e), s = new Map;
            if (o) {
                let a = [];
                if (o.forEach((l, c) => {
                    if (s.set(c, l.value), this._triggers.has(c)) {
                        let f = this.trigger(e, c, Lo, r);
                        f && a.push(f)
                    }
                }), a.length) return this._engine.markElementAsRemoved(this.id, e, !0, n, s), i && Yn(a).onDone(() => this._engine.processLeaveNode(e)), !0
            }
            return !1
        }

        prepareLeaveAnimationListeners(e) {
            let n = this._elementListeners.get(e), i = this._engine.statesByElement.get(e);
            if (n && i) {
                let r = new Set;
                n.forEach(o => {
                    let s = o.name;
                    if (r.has(s)) return;
                    r.add(s);
                    let l = this._triggers.get(s).fallbackTransition, c = i.get(s) || gf, f = new $o(Lo),
                        p = new Bo(this.id, s, e);
                    this._engine.totalQueuedPlayers++, this._queue.push({
                        element: e,
                        triggerName: s,
                        transition: l,
                        fromState: c,
                        toState: f,
                        player: p,
                        isFallbackTransition: !0
                    })
                })
            }
        }

        removeNode(e, n) {
            let i = this._engine;
            if (e.childElementCount && this._signalRemovalForInnerTriggers(e, n), this.triggerLeaveAnimation(e, n, !0)) return;
            let r = !1;
            if (i.totalAnimations) {
                let o = i.players.length ? i.playersByQueriedElement.get(e) : [];
                if (o && o.length) r = !0; else {
                    let s = e;
                    for (; s = s.parentNode;) if (i.statesByElement.get(s)) {
                        r = !0;
                        break
                    }
                }
            }
            if (this.prepareLeaveAnimationListeners(e), r) i.markElementAsRemoved(this.id, e, !1, n); else {
                let o = e[jt];
                (!o || o === R0) && (i.afterFlush(() => this.clearElementCache(e)), i.destroyInnerAnimations(e), i._onRemovalComplete(e, n))
            }
        }

        insertNode(e, n) {
            At(e, this._hostClassName)
        }

        drainQueuedTransitions(e) {
            let n = [];
            return this._queue.forEach(i => {
                let r = i.player;
                if (r.destroyed) return;
                let o = i.element, s = this._elementListeners.get(o);
                s && s.forEach(a => {
                    if (a.name == i.triggerName) {
                        let l = Ff(o, i.triggerName, i.fromState.value, i.toState.value);
                        l._data = e, kf(i.player, a.phase, l, a.callback)
                    }
                }), r.markedForDestroy ? this._engine.afterFlush(() => {
                    r.destroy()
                }) : n.push(i)
            }), this._queue = [], n.sort((i, r) => {
                let o = i.transition.ast.depCount, s = r.transition.ast.depCount;
                return o == 0 || s == 0 ? o - s : this._engine.driver.containsElement(i.element, r.element) ? 1 : -1
            })
        }

        destroy(e) {
            this.players.forEach(n => n.destroy()), this._signalRemovalForInnerTriggers(this.hostElement, e)
        }
    }, Nf = class {
        _onRemovalComplete(e, n) {
            this.onRemovalComplete(e, n)
        }

        constructor(e, n, i, r) {
            this.bodyNode = e, this.driver = n, this._normalizer = i, this.scheduler = r, this.players = [], this.newHostElements = new Map, this.playersByElement = new Map, this.playersByQueriedElement = new Map, this.statesByElement = new Map, this.disabledNodes = new Set, this.totalAnimations = 0, this.totalQueuedPlayers = 0, this._namespaceLookup = {}, this._namespaceList = [], this._flushFns = [], this._whenQuietFns = [], this.namespacesByHostElement = new Map, this.collectedEnterElements = [], this.collectedLeaveElements = [], this.onRemovalComplete = (o, s) => {
            }
        }

        get queuedPlayers() {
            let e = [];
            return this._namespaceList.forEach(n => {
                n.players.forEach(i => {
                    i.queued && e.push(i)
                })
            }), e
        }

        createNamespace(e, n) {
            let i = new Af(e, n, this);
            return this.bodyNode && this.driver.containsElement(this.bodyNode, n) ? this._balanceNamespaceList(i, n) : (this.newHostElements.set(n, i), this.collectEnterElement(n)), this._namespaceLookup[e] = i
        }

        _balanceNamespaceList(e, n) {
            let i = this._namespaceList, r = this.namespacesByHostElement;
            if (i.length - 1 >= 0) {
                let s = !1, a = this.driver.getParentElement(n);
                for (; a;) {
                    let l = r.get(a);
                    if (l) {
                        let c = i.indexOf(l);
                        i.splice(c + 1, 0, e), s = !0;
                        break
                    }
                    a = this.driver.getParentElement(a)
                }
                s || i.unshift(e)
            } else i.push(e);
            return r.set(n, e), e
        }

        register(e, n) {
            let i = this._namespaceLookup[e];
            return i || (i = this.createNamespace(e, n)), i
        }

        registerTrigger(e, n, i) {
            let r = this._namespaceLookup[e];
            r && r.register(n, i) && this.totalAnimations++
        }

        destroy(e, n) {
            e && (this.afterFlush(() => {
            }), this.afterFlushAnimationsDone(() => {
                let i = this._fetchNamespace(e);
                this.namespacesByHostElement.delete(i.hostElement);
                let r = this._namespaceList.indexOf(i);
                r >= 0 && this._namespaceList.splice(r, 1), i.destroy(n), delete this._namespaceLookup[e]
            }))
        }

        _fetchNamespace(e) {
            return this._namespaceLookup[e]
        }

        fetchNamespacesByElement(e) {
            let n = new Set, i = this.statesByElement.get(e);
            if (i) {
                for (let r of i.values()) if (r.namespaceId) {
                    let o = this._fetchNamespace(r.namespaceId);
                    o && n.add(o)
                }
            }
            return n
        }

        trigger(e, n, i, r) {
            if (el(n)) {
                let o = this._fetchNamespace(e);
                if (o) return o.trigger(n, i, r), !0
            }
            return !1
        }

        insertNode(e, n, i, r) {
            if (!el(n)) return;
            let o = n[jt];
            if (o && o.setForRemoval) {
                o.setForRemoval = !1, o.setForMove = !0;
                let s = this.collectedLeaveElements.indexOf(n);
                s >= 0 && this.collectedLeaveElements.splice(s, 1)
            }
            if (e) {
                let s = this._fetchNamespace(e);
                s && s.insertNode(n, i)
            }
            r && this.collectEnterElement(n)
        }

        collectEnterElement(e) {
            this.collectedEnterElements.push(e)
        }

        markElementAsDisabled(e, n) {
            n ? this.disabledNodes.has(e) || (this.disabledNodes.add(e), At(e, mf)) : this.disabledNodes.has(e) && (this.disabledNodes.delete(e), Cr(e, mf))
        }

        removeNode(e, n, i) {
            if (el(n)) {
                this.scheduler?.notify();
                let r = e ? this._fetchNamespace(e) : null;
                r ? r.removeNode(n, i) : this.markElementAsRemoved(e, n, !1, i);
                let o = this.namespacesByHostElement.get(n);
                o && o.id !== e && o.removeNode(n, i)
            } else this._onRemovalComplete(n, i)
        }

        markElementAsRemoved(e, n, i, r, o) {
            this.collectedLeaveElements.push(n), n[jt] = {
                namespaceId: e,
                setForRemoval: r,
                hasAnimation: i,
                removedBeforeQueried: !1,
                previousTriggersValues: o
            }
        }

        listen(e, n, i, r, o) {
            return el(n) ? this._fetchNamespace(e).listen(n, i, r, o) : () => {
            }
        }

        _buildInstruction(e, n, i, r, o) {
            return e.transition.build(this.driver, e.element, e.fromState.value, e.toState.value, i, r, e.fromState.options, e.toState.options, n, o)
        }

        destroyInnerAnimations(e) {
            let n = this.driver.query(e, nl, !0);
            n.forEach(i => this.destroyActiveAnimationsForElement(i)), this.playersByQueriedElement.size != 0 && (n = this.driver.query(e, wf, !0), n.forEach(i => this.finishActiveQueriedAnimationOnElement(i)))
        }

        destroyActiveAnimationsForElement(e) {
            let n = this.playersByElement.get(e);
            n && n.forEach(i => {
                i.queued ? i.markedForDestroy = !0 : i.destroy()
            })
        }

        finishActiveQueriedAnimationOnElement(e) {
            let n = this.playersByQueriedElement.get(e);
            n && n.forEach(i => i.finish())
        }

        whenRenderingDone() {
            return new Promise(e => {
                if (this.players.length) return Yn(this.players).onDone(() => e());
                e()
            })
        }

        processLeaveNode(e) {
            let n = e[jt];
            if (n && n.setForRemoval) {
                if (e[jt] = R0, n.namespaceId) {
                    this.destroyInnerAnimations(e);
                    let i = this._fetchNamespace(n.namespaceId);
                    i && i.clearElementCache(e)
                }
                this._onRemovalComplete(e, n.setForRemoval)
            }
            e.classList?.contains(mf) && this.markElementAsDisabled(e, !1), this.driver.query(e, fT, !0).forEach(i => {
                this.markElementAsDisabled(i, !1)
            })
        }

        flush(e = -1) {
            let n = [];
            if (this.newHostElements.size && (this.newHostElements.forEach((i, r) => this._balanceNamespaceList(i, r)), this.newHostElements.clear()), this.totalAnimations && this.collectedEnterElements.length) for (let i = 0; i < this.collectedEnterElements.length; i++) {
                let r = this.collectedEnterElements[i];
                At(r, pT)
            }
            if (this._namespaceList.length && (this.totalQueuedPlayers || this.collectedLeaveElements.length)) {
                let i = [];
                try {
                    n = this._flushAnimations(i, e)
                } finally {
                    for (let r = 0; r < i.length; r++) i[r]()
                }
            } else for (let i = 0; i < this.collectedLeaveElements.length; i++) {
                let r = this.collectedLeaveElements[i];
                this.processLeaveNode(r)
            }
            if (this.totalQueuedPlayers = 0, this.collectedEnterElements.length = 0, this.collectedLeaveElements.length = 0, this._flushFns.forEach(i => i()), this._flushFns = [], this._whenQuietFns.length) {
                let i = this._whenQuietFns;
                this._whenQuietFns = [], n.length ? Yn(n).onDone(() => {
                    i.forEach(r => r())
                }) : i.forEach(r => r())
            }
        }

        reportError(e) {
            throw O_(e)
        }

        _flushAnimations(e, n) {
            let i = new jo, r = [], o = new Map, s = [], a = new Map, l = new Map, c = new Map, f = new Set;
            this.disabledNodes.forEach(F => {
                f.add(F);
                let z = this.driver.query(F, dT, !0);
                for (let G = 0; G < z.length; G++) f.add(z[G])
            });
            let p = this.bodyNode, m = Array.from(this.statesByElement.keys()), g = D0(m, this.collectedEnterElements),
                b = new Map, E = 0;
            g.forEach((F, z) => {
                let G = A0 + E++;
                b.set(z, G), F.forEach(ce => At(ce, G))
            });
            let M = [], w = new Set, S = new Set;
            for (let F = 0; F < this.collectedLeaveElements.length; F++) {
                let z = this.collectedLeaveElements[F], G = z[jt];
                G && G.setForRemoval && (M.push(z), w.add(z), G.hasAnimation ? this.driver.query(z, hT, !0).forEach(ce => w.add(ce)) : S.add(z))
            }
            let C = new Map, I = D0(m, Array.from(w));
            I.forEach((F, z) => {
                let G = yf + E++;
                C.set(z, G), F.forEach(ce => At(ce, G))
            }), e.push(() => {
                g.forEach((F, z) => {
                    let G = b.get(z);
                    F.forEach(ce => Cr(ce, G))
                }), I.forEach((F, z) => {
                    let G = C.get(z);
                    F.forEach(ce => Cr(ce, G))
                }), M.forEach(F => {
                    this.processLeaveNode(F)
                })
            });
            let O = [], U = [];
            for (let F = this._namespaceList.length - 1; F >= 0; F--) this._namespaceList[F].drainQueuedTransitions(n).forEach(G => {
                let ce = G.player, Ne = G.element;
                if (O.push(ce), this.collectedEnterElements.length) {
                    let Ye = Ne[jt];
                    if (Ye && Ye.setForMove) {
                        if (Ye.previousTriggersValues && Ye.previousTriggersValues.has(G.triggerName)) {
                            let Kn = Ye.previousTriggersValues.get(G.triggerName), Ct = this.statesByElement.get(G.element);
                            if (Ct && Ct.has(G.triggerName)) {
                                let Zo = Ct.get(G.triggerName);
                                Zo.value = Kn, Ct.set(G.triggerName, Zo)
                            }
                        }
                        ce.destroy();
                        return
                    }
                }
                let St = !p || !this.driver.containsElement(p, Ne), tt = C.get(Ne), Mn = b.get(Ne),
                    xe = this._buildInstruction(G, i, Mn, tt, St);
                if (xe.errors && xe.errors.length) {
                    U.push(xe);
                    return
                }
                if (St) {
                    ce.onStart(() => Ci(Ne, xe.fromStyles)), ce.onDestroy(() => nn(Ne, xe.toStyles)), r.push(ce);
                    return
                }
                if (G.isFallbackTransition) {
                    ce.onStart(() => Ci(Ne, xe.fromStyles)), ce.onDestroy(() => nn(Ne, xe.toStyles)), r.push(ce);
                    return
                }
                let sp = [];
                xe.timelines.forEach(Ye => {
                    Ye.stretchStartingKeyframe = !0, this.disabledNodes.has(Ye.element) || sp.push(Ye)
                }), xe.timelines = sp, i.append(Ne, xe.timelines);
                let Sw = {instruction: xe, player: ce, element: Ne};
                s.push(Sw), xe.queriedElements.forEach(Ye => bt(a, Ye, []).push(ce)), xe.preStyleProps.forEach((Ye, Kn) => {
                    if (Ye.size) {
                        let Ct = l.get(Kn);
                        Ct || l.set(Kn, Ct = new Set), Ye.forEach((Zo, Al) => Ct.add(Al))
                    }
                }), xe.postStyleProps.forEach((Ye, Kn) => {
                    let Ct = c.get(Kn);
                    Ct || c.set(Kn, Ct = new Set), Ye.forEach((Zo, Al) => Ct.add(Al))
                })
            });
            if (U.length) {
                let F = [];
                U.forEach(z => {
                    F.push(P_(z.triggerName, z.errors))
                }), O.forEach(z => z.destroy()), this.reportError(F)
            }
            let de = new Map, L = new Map;
            s.forEach(F => {
                let z = F.element;
                i.has(z) && (L.set(z, z), this._beforeAnimationBuild(F.player.namespaceId, F.instruction, de))
            }), r.forEach(F => {
                let z = F.element;
                this._getPreviousPlayers(z, !1, F.namespaceId, F.triggerName, null).forEach(ce => {
                    bt(de, z, []).push(ce), ce.destroy()
                })
            });
            let Ce = M.filter(F => I0(F, l, c)), A = new Map;
            C0(A, this.driver, S, c, tn).forEach(F => {
                I0(F, l, c) && Ce.push(F)
            });
            let V = new Map;
            g.forEach((F, z) => {
                C0(V, this.driver, new Set(F), l, Xa)
            }), Ce.forEach(F => {
                let z = A.get(F), G = V.get(F);
                A.set(F, new Map([...z?.entries() ?? [], ...G?.entries() ?? []]))
            });
            let R = [], le = [], _e = {};
            s.forEach(F => {
                let {element: z, player: G, instruction: ce} = F;
                if (i.has(z)) {
                    if (f.has(z)) {
                        G.onDestroy(() => nn(z, ce.toStyles)), G.disabled = !0, G.overrideTotalTime(ce.totalTime), r.push(G);
                        return
                    }
                    let Ne = _e;
                    if (L.size > 1) {
                        let tt = z, Mn = [];
                        for (; tt = tt.parentNode;) {
                            let xe = L.get(tt);
                            if (xe) {
                                Ne = xe;
                                break
                            }
                            Mn.push(tt)
                        }
                        Mn.forEach(xe => L.set(xe, Ne))
                    }
                    let St = this._buildAnimation(G.namespaceId, ce, de, o, V, A);
                    if (G.setRealPlayer(St), Ne === _e) R.push(G); else {
                        let tt = this.playersByElement.get(Ne);
                        tt && tt.length && (G.parentPlayer = Yn(tt)), r.push(G)
                    }
                } else Ci(z, ce.fromStyles), G.onDestroy(() => nn(z, ce.toStyles)), le.push(G), f.has(z) && r.push(G)
            }), le.forEach(F => {
                let z = o.get(F.element);
                if (z && z.length) {
                    let G = Yn(z);
                    F.setRealPlayer(G)
                }
            }), r.forEach(F => {
                F.parentPlayer ? F.syncPlayerEvents(F.parentPlayer) : F.destroy()
            });
            for (let F = 0; F < M.length; F++) {
                let z = M[F], G = z[jt];
                if (Cr(z, yf), G && G.hasAnimation) continue;
                let ce = [];
                if (a.size) {
                    let St = a.get(z);
                    St && St.length && ce.push(...St);
                    let tt = this.driver.query(z, wf, !0);
                    for (let Mn = 0; Mn < tt.length; Mn++) {
                        let xe = a.get(tt[Mn]);
                        xe && xe.length && ce.push(...xe)
                    }
                }
                let Ne = ce.filter(St => !St.destroyed);
                Ne.length ? bT(this, z, Ne) : this.processLeaveNode(z)
            }
            return M.length = 0, R.forEach(F => {
                this.players.push(F), F.onDone(() => {
                    F.destroy();
                    let z = this.players.indexOf(F);
                    this.players.splice(z, 1)
                }), F.play()
            }), R
        }

        afterFlush(e) {
            this._flushFns.push(e)
        }

        afterFlushAnimationsDone(e) {
            this._whenQuietFns.push(e)
        }

        _getPreviousPlayers(e, n, i, r, o) {
            let s = [];
            if (n) {
                let a = this.playersByQueriedElement.get(e);
                a && (s = a)
            } else {
                let a = this.playersByElement.get(e);
                if (a) {
                    let l = !o || o == Lo;
                    a.forEach(c => {
                        c.queued || !l && c.triggerName != r || s.push(c)
                    })
                }
            }
            return (i || r) && (s = s.filter(a => !(i && i != a.namespaceId || r && r != a.triggerName))), s
        }

        _beforeAnimationBuild(e, n, i) {
            let r = n.triggerName, o = n.element, s = n.isRemovalTransition ? void 0 : e,
                a = n.isRemovalTransition ? void 0 : r;
            for (let l of n.timelines) {
                let c = l.element, f = c !== o, p = bt(i, c, []);
                this._getPreviousPlayers(c, f, s, a, n.toState).forEach(g => {
                    let b = g.getRealPlayer();
                    b.beforeDestroy && b.beforeDestroy(), g.destroy(), p.push(g)
                })
            }
            Ci(o, n.fromStyles)
        }

        _buildAnimation(e, n, i, r, o, s) {
            let a = n.triggerName, l = n.element, c = [], f = new Set, p = new Set, m = n.timelines.map(b => {
                let E = b.element;
                f.add(E);
                let M = E[jt];
                if (M && M.removedBeforeQueried) return new Wn(b.duration, b.delay);
                let w = E !== l, S = ET((i.get(E) || mT).map(de => de.getRealPlayer())).filter(de => {
                    let L = de;
                    return L.element ? L.element === E : !1
                }), C = o.get(E), I = s.get(E), O = M0(this._normalizer, b.keyframes, C, I), U = this._buildPlayer(b, O, S);
                if (b.subTimeline && r && p.add(E), w) {
                    let de = new Bo(e, a, E);
                    de.setRealPlayer(U), c.push(de)
                }
                return U
            });
            c.forEach(b => {
                bt(this.playersByQueriedElement, b.element, []).push(b), b.onDone(() => vT(this.playersByQueriedElement, b.element, b))
            }), f.forEach(b => At(b, m0));
            let g = Yn(m);
            return g.onDestroy(() => {
                f.forEach(b => Cr(b, m0)), nn(l, n.toStyles)
            }), p.forEach(b => {
                bt(r, b, []).push(g)
            }), g
        }

        _buildPlayer(e, n, i) {
            return n.length > 0 ? this.driver.animate(e.element, n, e.duration, e.delay, e.easing, i) : new Wn(e.duration, e.delay)
        }
    }, Bo = class {
        constructor(e, n, i) {
            this.namespaceId = e, this.triggerName = n, this.element = i, this._player = new Wn, this._containsRealPlayer = !1, this._queuedCallbacks = new Map, this.destroyed = !1, this.parentPlayer = null, this.markedForDestroy = !1, this.disabled = !1, this.queued = !0, this.totalTime = 0
        }

        setRealPlayer(e) {
            this._containsRealPlayer || (this._player = e, this._queuedCallbacks.forEach((n, i) => {
                n.forEach(r => kf(e, i, void 0, r))
            }), this._queuedCallbacks.clear(), this._containsRealPlayer = !0, this.overrideTotalTime(e.totalTime), this.queued = !1)
        }

        getRealPlayer() {
            return this._player
        }

        overrideTotalTime(e) {
            this.totalTime = e
        }

        syncPlayerEvents(e) {
            let n = this._player;
            n.triggerCallback && e.onStart(() => n.triggerCallback("start")), e.onDone(() => this.finish()), e.onDestroy(() => this.destroy())
        }

        _queueEvent(e, n) {
            bt(this._queuedCallbacks, e, []).push(n)
        }

        onDone(e) {
            this.queued && this._queueEvent("done", e), this._player.onDone(e)
        }

        onStart(e) {
            this.queued && this._queueEvent("start", e), this._player.onStart(e)
        }

        onDestroy(e) {
            this.queued && this._queueEvent("destroy", e), this._player.onDestroy(e)
        }

        init() {
            this._player.init()
        }

        hasStarted() {
            return this.queued ? !1 : this._player.hasStarted()
        }

        play() {
            !this.queued && this._player.play()
        }

        pause() {
            !this.queued && this._player.pause()
        }

        restart() {
            !this.queued && this._player.restart()
        }

        finish() {
            this._player.finish()
        }

        destroy() {
            this.destroyed = !0, this._player.destroy()
        }

        reset() {
            !this.queued && this._player.reset()
        }

        setPosition(e) {
            this.queued || this._player.setPosition(e)
        }

        getPosition() {
            return this.queued ? 0 : this._player.getPosition()
        }

        triggerCallback(e) {
            let n = this._player;
            n.triggerCallback && n.triggerCallback(e)
        }
    };

function vT(t, e, n) {
    let i = t.get(e);
    if (i) {
        if (i.length) {
            let r = i.indexOf(n);
            i.splice(r, 1)
        }
        i.length == 0 && t.delete(e)
    }
    return i
}

function yT(t) {
    return t ?? null
}

function el(t) {
    return t && t.nodeType === 1
}

function wT(t) {
    return t == "start" || t == "done"
}

function S0(t, e) {
    let n = t.style.display;
    return t.style.display = e ?? "none", n
}

function C0(t, e, n, i, r) {
    let o = [];
    n.forEach(l => o.push(S0(l)));
    let s = [];
    i.forEach((l, c) => {
        let f = new Map;
        l.forEach(p => {
            let m = e.computeStyle(c, p, r);
            f.set(p, m), (!m || m.length == 0) && (c[jt] = gT, s.push(c))
        }), t.set(c, f)
    });
    let a = 0;
    return n.forEach(l => S0(l, o[a++])), s
}

function D0(t, e) {
    let n = new Map;
    if (t.forEach(a => n.set(a, [])), e.length == 0) return n;
    let i = 1, r = new Set(e), o = new Map;

    function s(a) {
        if (!a) return i;
        let l = o.get(a);
        if (l) return l;
        let c = a.parentNode;
        return n.has(c) ? l = c : r.has(c) ? l = i : l = s(c), o.set(a, l), l
    }

    return e.forEach(a => {
        let l = s(a);
        l !== i && n.get(l).push(a)
    }), n
}

function At(t, e) {
    t.classList?.add(e)
}

function Cr(t, e) {
    t.classList?.remove(e)
}

function bT(t, e, n) {
    Yn(n).onDone(() => t.processLeaveNode(e))
}

function ET(t) {
    let e = [];
    return L0(t, e), e
}

function L0(t, e) {
    for (let n = 0; n < t.length; n++) {
        let i = t[n];
        i instanceof Fo ? L0(i.players, e) : e.push(i)
    }
}

function ST(t, e) {
    let n = Object.keys(t), i = Object.keys(e);
    if (n.length != i.length) return !1;
    for (let r = 0; r < n.length; r++) {
        let o = n[r];
        if (!e.hasOwnProperty(o) || t[o] !== e[o]) return !1
    }
    return !0
}

function I0(t, e, n) {
    let i = n.get(t);
    if (!i) return !1;
    let r = e.get(t);
    return r ? i.forEach(o => r.add(o)) : e.set(t, i), n.delete(t), !0
}

var Ir = class {
    constructor(e, n, i, r) {
        this._driver = n, this._normalizer = i, this._triggerCache = {}, this.onRemovalComplete = (o, s) => {
        }, this._transitionEngine = new Nf(e.body, n, i, r), this._timelineEngine = new xf(e.body, n, i), this._transitionEngine.onRemovalComplete = (o, s) => this.onRemovalComplete(o, s)
    }

    registerTrigger(e, n, i, r, o) {
        let s = e + "-" + r, a = this._triggerCache[s];
        if (!a) {
            let l = [], c = [], f = P0(this._driver, o, l, c);
            if (l.length) throw S_(r, l);
            c.length && void 0, a = lT(r, f, this._normalizer), this._triggerCache[s] = a
        }
        this._transitionEngine.registerTrigger(n, r, a)
    }

    register(e, n) {
        this._transitionEngine.register(e, n)
    }

    destroy(e, n) {
        this._transitionEngine.destroy(e, n)
    }

    onInsert(e, n, i, r) {
        this._transitionEngine.insertNode(e, n, i, r)
    }

    onRemove(e, n, i) {
        this._transitionEngine.removeNode(e, n, i)
    }

    disableAnimations(e, n) {
        this._transitionEngine.markElementAsDisabled(e, n)
    }

    process(e, n, i, r) {
        if (i.charAt(0) == "@") {
            let [o, s] = p0(i), a = r;
            this._timelineEngine.command(o, n, s, a)
        } else this._transitionEngine.trigger(e, n, i, r)
    }

    listen(e, n, i, r, o) {
        if (i.charAt(0) == "@") {
            let [s, a] = p0(i);
            return this._timelineEngine.listen(s, n, a, o)
        }
        return this._transitionEngine.listen(e, n, i, r, o)
    }

    flush(e = -1) {
        this._transitionEngine.flush(e)
    }

    get players() {
        return [...this._transitionEngine.players, ...this._timelineEngine.players]
    }

    whenRenderingDone() {
        return this._transitionEngine.whenRenderingDone()
    }

    afterFlushAnimationsDone(e) {
        this._transitionEngine.afterFlushAnimationsDone(e)
    }
};

function CT(t, e) {
    let n = null, i = null;
    return Array.isArray(e) && e.length ? (n = vf(e[0]), e.length > 1 && (i = vf(e[e.length - 1]))) : e instanceof Map && (n = vf(e)), n || i ? new Of(t, n, i) : null
}

var Dr = class Dr {
    constructor(e, n, i) {
        this._element = e, this._startStyles = n, this._endStyles = i, this._state = 0;
        let r = Dr.initialStylesByElement.get(e);
        r || Dr.initialStylesByElement.set(e, r = new Map), this._initialStyles = r
    }

    start() {
        this._state < 1 && (this._startStyles && nn(this._element, this._startStyles, this._initialStyles), this._state = 1)
    }

    finish() {
        this.start(), this._state < 2 && (nn(this._element, this._initialStyles), this._endStyles && (nn(this._element, this._endStyles), this._endStyles = null), this._state = 1)
    }

    destroy() {
        this.finish(), this._state < 3 && (Dr.initialStylesByElement.delete(this._element), this._startStyles && (Ci(this._element, this._startStyles), this._endStyles = null), this._endStyles && (Ci(this._element, this._endStyles), this._endStyles = null), nn(this._element, this._initialStyles), this._state = 3)
    }
};
Dr.initialStylesByElement = new WeakMap;
var Of = Dr;

function vf(t) {
    let e = null;
    return t.forEach((n, i) => {
        DT(i) && (e = e || new Map, e.set(i, n))
    }), e
}

function DT(t) {
    return t === "display" || t === "position"
}

var cl = class {
    constructor(e, n, i, r) {
        this.element = e, this.keyframes = n, this.options = i, this._specialStyles = r, this._onDoneFns = [], this._onStartFns = [], this._onDestroyFns = [], this._initialized = !1, this._finished = !1, this._started = !1, this._destroyed = !1, this._originalOnDoneFns = [], this._originalOnStartFns = [], this.time = 0, this.parentPlayer = null, this.currentSnapshot = new Map, this._duration = i.duration, this._delay = i.delay || 0, this.time = this._duration + this._delay
    }

    _onFinish() {
        this._finished || (this._finished = !0, this._onDoneFns.forEach(e => e()), this._onDoneFns = [])
    }

    init() {
        this._buildPlayer(), this._preparePlayerBeforeStart()
    }

    _buildPlayer() {
        if (this._initialized) return;
        this._initialized = !0;
        let e = this.keyframes;
        this.domPlayer = this._triggerWebAnimation(this.element, e, this.options), this._finalKeyframe = e.length ? e[e.length - 1] : new Map;
        let n = () => this._onFinish();
        this.domPlayer.addEventListener("finish", n), this.onDestroy(() => {
            this.domPlayer.removeEventListener("finish", n)
        })
    }

    _preparePlayerBeforeStart() {
        this._delay ? this._resetDomPlayerState() : this.domPlayer.pause()
    }

    _convertKeyframesToObject(e) {
        let n = [];
        return e.forEach(i => {
            n.push(Object.fromEntries(i))
        }), n
    }

    _triggerWebAnimation(e, n, i) {
        return e.animate(this._convertKeyframesToObject(n), i)
    }

    onStart(e) {
        this._originalOnStartFns.push(e), this._onStartFns.push(e)
    }

    onDone(e) {
        this._originalOnDoneFns.push(e), this._onDoneFns.push(e)
    }

    onDestroy(e) {
        this._onDestroyFns.push(e)
    }

    play() {
        this._buildPlayer(), this.hasStarted() || (this._onStartFns.forEach(e => e()), this._onStartFns = [], this._started = !0, this._specialStyles && this._specialStyles.start()), this.domPlayer.play()
    }

    pause() {
        this.init(), this.domPlayer.pause()
    }

    finish() {
        this.init(), this._specialStyles && this._specialStyles.finish(), this._onFinish(), this.domPlayer.finish()
    }

    reset() {
        this._resetDomPlayerState(), this._destroyed = !1, this._finished = !1, this._started = !1, this._onStartFns = this._originalOnStartFns, this._onDoneFns = this._originalOnDoneFns
    }

    _resetDomPlayerState() {
        this.domPlayer && this.domPlayer.cancel()
    }

    restart() {
        this.reset(), this.play()
    }

    hasStarted() {
        return this._started
    }

    destroy() {
        this._destroyed || (this._destroyed = !0, this._resetDomPlayerState(), this._onFinish(), this._specialStyles && this._specialStyles.destroy(), this._onDestroyFns.forEach(e => e()), this._onDestroyFns = [])
    }

    setPosition(e) {
        this.domPlayer === void 0 && this.init(), this.domPlayer.currentTime = e * this.time
    }

    getPosition() {
        return +(this.domPlayer.currentTime ?? 0) / this.time
    }

    get totalTime() {
        return this._delay + this._duration
    }

    beforeDestroy() {
        let e = new Map;
        this.hasStarted() && this._finalKeyframe.forEach((i, r) => {
            r !== "offset" && e.set(r, this._finished ? i : jf(this.element, r))
        }), this.currentSnapshot = e
    }

    triggerCallback(e) {
        let n = e === "start" ? this._onStartFns : this._onDoneFns;
        n.forEach(i => i()), n.length = 0
    }
}, ul = class {
    validateStyleProperty(e) {
        return !0
    }

    validateAnimatableStyleProperty(e) {
        return !0
    }

    matchesElement(e, n) {
        return !1
    }

    containsElement(e, n) {
        return _0(e, n)
    }

    getParentElement(e) {
        return Rf(e)
    }

    query(e, n, i) {
        return T0(e, n, i)
    }

    computeStyle(e, n, i) {
        return jf(e, n)
    }

    animate(e, n, i, r, o, s = []) {
        let a = r == 0 ? "both" : "forwards", l = {duration: i, delay: r, fill: a};
        o && (l.easing = o);
        let c = new Map, f = s.filter(g => g instanceof cl);
        z_(i, r) && f.forEach(g => {
            g.currentSnapshot.forEach((b, E) => c.set(E, b))
        });
        let p = B_(n).map(g => new Map(g));
        p = G_(e, p, c);
        let m = CT(e, p);
        return new cl(e, p, l, m)
    }
};
var tl = "@", V0 = "@.disabled", dl = class {
    constructor(e, n, i, r) {
        this.namespaceId = e, this.delegate = n, this.engine = i, this._onDestroy = r, this.\u0275type = 0
    }

    get data() {
        return this.delegate.data
    }

    destroyNode(e) {
        this.delegate.destroyNode?.(e)
    }

    destroy() {
        this.engine.destroy(this.namespaceId, this.delegate), this.engine.afterFlushAnimationsDone(() => {
            queueMicrotask(() => {
                this.delegate.destroy()
            })
        }), this._onDestroy?.()
    }

    createElement(e, n) {
        return this.delegate.createElement(e, n)
    }

    createComment(e) {
        return this.delegate.createComment(e)
    }

    createText(e) {
        return this.delegate.createText(e)
    }

    appendChild(e, n) {
        this.delegate.appendChild(e, n), this.engine.onInsert(this.namespaceId, n, e, !1)
    }

    insertBefore(e, n, i, r = !0) {
        this.delegate.insertBefore(e, n, i), this.engine.onInsert(this.namespaceId, n, e, r)
    }

    removeChild(e, n, i) {
        this.engine.onRemove(this.namespaceId, n, this.delegate)
    }

    selectRootElement(e, n) {
        return this.delegate.selectRootElement(e, n)
    }

    parentNode(e) {
        return this.delegate.parentNode(e)
    }

    nextSibling(e) {
        return this.delegate.nextSibling(e)
    }

    setAttribute(e, n, i, r) {
        this.delegate.setAttribute(e, n, i, r)
    }

    removeAttribute(e, n, i) {
        this.delegate.removeAttribute(e, n, i)
    }

    addClass(e, n) {
        this.delegate.addClass(e, n)
    }

    removeClass(e, n) {
        this.delegate.removeClass(e, n)
    }

    setStyle(e, n, i, r) {
        this.delegate.setStyle(e, n, i, r)
    }

    removeStyle(e, n, i) {
        this.delegate.removeStyle(e, n, i)
    }

    setProperty(e, n, i) {
        n.charAt(0) == tl && n == V0 ? this.disableAnimations(e, !!i) : this.delegate.setProperty(e, n, i)
    }

    setValue(e, n) {
        this.delegate.setValue(e, n)
    }

    listen(e, n, i) {
        return this.delegate.listen(e, n, i)
    }

    disableAnimations(e, n) {
        this.engine.disableAnimations(e, n)
    }
}, Pf = class extends dl {
    constructor(e, n, i, r, o) {
        super(n, i, r, o), this.factory = e, this.namespaceId = n
    }

    setProperty(e, n, i) {
        n.charAt(0) == tl ? n.charAt(1) == "." && n == V0 ? (i = i === void 0 ? !0 : !!i, this.disableAnimations(e, i)) : this.engine.process(this.namespaceId, e, n.slice(1), i) : this.delegate.setProperty(e, n, i)
    }

    listen(e, n, i) {
        if (n.charAt(0) == tl) {
            let r = IT(e), o = n.slice(1), s = "";
            return o.charAt(0) != tl && ([o, s] = MT(o)), this.engine.listen(this.namespaceId, r, o, s, a => {
                let l = a._data || -1;
                this.factory.scheduleListenerCallback(l, i, a)
            })
        }
        return this.delegate.listen(e, n, i)
    }
};

function IT(t) {
    switch (t) {
        case"body":
            return document.body;
        case"document":
            return document;
        case"window":
            return window;
        default:
            return t
    }
}

function MT(t) {
    let e = t.indexOf("."), n = t.substring(0, e), i = t.slice(e + 1);
    return [n, i]
}

var fl = class {
    constructor(e, n, i) {
        this.delegate = e, this.engine = n, this._zone = i, this._currentId = 0, this._microtaskId = 1, this._animationCallbacksBuffer = [], this._rendererCache = new Map, this._cdRecurDepth = 0, n.onRemovalComplete = (r, o) => {
            let s = o?.parentNode(r);
            s && o.removeChild(s, r)
        }
    }

    createRenderer(e, n) {
        let i = "", r = this.delegate.createRenderer(e, n);
        if (!e || !n?.data?.animation) {
            let c = this._rendererCache, f = c.get(r);
            if (!f) {
                let p = () => c.delete(r);
                f = new dl(i, r, this.engine, p), c.set(r, f)
            }
            return f
        }
        let o = n.id, s = n.id + "-" + this._currentId;
        this._currentId++, this.engine.register(s, e);
        let a = c => {
            Array.isArray(c) ? c.forEach(a) : this.engine.registerTrigger(o, s, e, c.name, c)
        };
        return n.data.animation.forEach(a), new Pf(this, s, r, this.engine)
    }

    begin() {
        this._cdRecurDepth++, this.delegate.begin && this.delegate.begin()
    }

    _scheduleCountTask() {
        queueMicrotask(() => {
            this._microtaskId++
        })
    }

    scheduleListenerCallback(e, n, i) {
        if (e >= 0 && e < this._microtaskId) {
            this._zone.run(() => n(i));
            return
        }
        let r = this._animationCallbacksBuffer;
        r.length == 0 && queueMicrotask(() => {
            this._zone.run(() => {
                r.forEach(o => {
                    let [s, a] = o;
                    s(a)
                }), this._animationCallbacksBuffer = []
            })
        }), r.push([n, i])
    }

    end() {
        this._cdRecurDepth--, this._cdRecurDepth == 0 && this._zone.runOutsideAngular(() => {
            this._scheduleCountTask(), this.engine.flush(this._microtaskId)
        }), this.delegate.end && this.delegate.end()
    }

    whenRenderingDone() {
        return this.engine.whenRenderingDone()
    }
};
var TT = (() => {
    let e = class e extends Ir {
        constructor(i, r, o) {
            super(i, r, o, N(tr, {optional: !0}))
        }

        ngOnDestroy() {
            this.flush()
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)(X(et), X(Di), X(Ii))
    }, e.\u0275prov = B({token: e, factory: e.\u0275fac});
    let t = e;
    return t
})();

function xT() {
    return new rl
}

function AT(t, e, n) {
    return new fl(t, e, n)
}

var j0 = [{provide: Ii, useFactory: xT}, {provide: Ir, useClass: TT}, {
        provide: di,
        useFactory: AT,
        deps: [xa, Ir, Ie]
    }], NT = [{provide: Di, useFactory: () => new ul}, {provide: ku, useValue: "BrowserAnimations"}, ...j0],
    VL = [{provide: Di, useClass: Lf}, {provide: ku, useValue: "NoopAnimations"}, ...j0];

function $0() {
    return ao("NgEagerAnimations"), [...NT]
}

var OT = [{
    id: 1,
    title: "The Power of Blockchain don't Miss Out on Our ICO",
    img: "/assets/img/blog/blog_masonry01.jpg",
    date: "2024/03/15",
    desc: "Our ICO is not just about financial gains; it's about being part of a movement that is shaping the future. By investing in our ICO, you become an integral part of a community that believes in the power",
    author: "/assets/img/blog/blog_author01.png",
    author_name: "Tom Cruise",
    comment: 7,
    view: 1752,
    blog_masonry: !0
}, {
    id: 2,
    title: "Invest in the Next Big Thing discover Our ICO Opportunity",
    img: "/assets/img/blog/blog_masonry02.jpg",
    date: "2024/03/15",
    desc: "Our ICO is not just about financial gains; it's about being part of a movement that is shaping the future. By investing in our ICO, you become an integral part of a community that believes in the power",
    author: "/assets/img/blog/blog_author01.png",
    author_name: "Max Power",
    comment: 9,
    view: 1752,
    blog_masonry: !0
}, {
    id: 3,
    title: "Maximizing Potential discover the Benefits of Our ICO Investment",
    img: "/assets/img/blog/blog_standard01.jpg",
    date: "2024/04/18",
    desc: "Our ICO presents a unique opportunity for you to be part of the digital revolution and tap into the immense potential of blockchain technology.",
    author: "/assets/img/blog/blog_author03.png",
    author_name: "Liam James",
    comment: 7,
    view: 9752,
    blog_standard: !0
}, {
    id: 4,
    title: "Tokenize Your Future explore Our ICO for Game-Changing Investments",
    img: "/assets/img/blog/blog_standard02.jpg",
    date: "2024/05/10",
    desc: "Our ICO presents a unique opportunity for you to be part of the digital revolution and tap into the immense potential of blockchain technology.",
    author: "/assets/img/blog/blog_author04.png",
    author_name: "Tom Cruise",
    comment: 7,
    view: 1200,
    blog_standard: !0
}], pl = OT;
var Ae = (() => {
    let e = class e {
        constructor(i) {
            this.router = i, this.videoUrl = "https://www.youtube.com/embed/EW4ZYb3mCZk", this.isVideoOpen = !1, this.openMobileMenus = !1, this.openOffcanvas = !1, this.iframeElement = null, this.router.events.subscribe(r => {
                r instanceof st && (this.openMobileMenus = !1)
            })
        }

        handleOpenMobileMenu() {
            this.openMobileMenus = !this.openMobileMenus
        }

        playVideo(i) {
            let r = document.querySelector("#video-overlay");
            this.videoUrl = `https://www.youtube.com/embed/${i}`, this.iframeElement || (this.iframeElement = document.createElement("iframe"), this.iframeElement.setAttribute("src", this.videoUrl), this.iframeElement.style.width = "60%", this.iframeElement.style.height = "80%"), this.isVideoOpen = !0, r?.classList.add("open"), r?.appendChild(this.iframeElement)
        }

        closeVideo() {
            let i = document.querySelector("#video-overlay.open");
            this.iframeElement && (this.iframeElement.remove(), this.iframeElement = null), this.isVideoOpen = !1, i?.classList.remove("open")
        }

        get blogs() {
            return q(pl)
        }

        getBlogById(i) {
            return this.blogs.pipe(ie(r => r.find(s => Number(s.id) === Number(i))))
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)(X(Me))
    }, e.\u0275prov = B({token: e, factory: e.\u0275fac, providedIn: "root"});
    let t = e;
    return t
})();
var Mi = () => ["active"], B0 = t => ({display: t}), H0 = () => ({exact: !0});

function PT(t, e) {
    if (t & 1) {
        let n = cr();
        $n(0), u(1, "li")(2, "a", 31), j("click", function () {
            mn(n);
            let r = Je();
            return gn(r.navigateWithOffset("/home", "feature"))
        }), h(3, "Feature"), d()(), u(4, "li")(5, "a", 31), j("click", function () {
            mn(n);
            let r = Je();
            return gn(r.navigateWithOffset("/home", "roadMap"))
        }), h(6, "RoadMap"), d()(), Bn()
    }
}

function kT(t, e) {
    if (t & 1) {
        let n = cr();
        $n(0), u(1, "li")(2, "a", 31), j("click", function () {
            mn(n);
            let r = Je();
            return gn(r.navigateWithOffset("/home/home-two", "blockchain"))
        }), h(3, " Why Blockchain "), d()(), u(4, "li")(5, "a", 31), j("click", function () {
            mn(n);
            let r = Je();
            return gn(r.navigateWithOffset("/home/home-two", "feature"))
        }), h(6, "Feature"), d()(), Bn()
    }
}

var Mr = (() => {
    let e = class e {
        constructor(i, r) {
            this.utilsService = i, this.router = r, this.menuTwo = !1, this.openSubMenu = "", this.handleSubMenu = o => {
                this.openSubMenu === o ? this.openSubMenu = "" : this.openSubMenu = o
            }
        }

        scrollToFragment(i) {
            setTimeout(() => {
                let r = document.getElementById(i);
                if (r) {
                    let o = r.offsetTop - 60;
                    console.log("element offset", r, o), window.scrollTo({top: o, behavior: "smooth"})
                }
            }, 100)
        }

        navigateWithOffset(i, r) {
            this.router.navigate([i], {fragment: r}), this.scrollToFragment(r), this.utilsService.openMobileMenus = !this.utilsService.openMobileMenus
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)(P(Ae), P(Me))
    }, e.\u0275cmp = T({
        type: e,
        selectors: [["app-mobile-offcanvas"]],
        inputs: {menuTwo: "menuTwo"},
        standalone: !0,
        features: [x],
        decls: 57,
        vars: 30,
        consts: [[1, "mobile-menu"], [1, "menu-box"], [1, "close-btn", 3, "click"], [1, "fas", "fa-times"], [1, "nav-logo"], ["routerLink", "/home"], ["src", "./assets/logo.png", "alt", "Logo", 2, "height", "35px"], [1, "menu-outer"], [1, "navigation"], [1, "menu-item-has-children", 3, "routerLinkActive"], ["routerLink", "/home", 1, "section-link"], [1, "sub-menu", 3, "ngStyle"], [3, "routerLinkActive", "routerLinkActiveOptions"], [3, "routerLinkActive"], ["routerLink", "/home/home-two"], [1, "dropdown-btn", 3, "click"], [1, "fas", "fa-angle-down"], [4, "ngIf"], ["routerLink", "/blog"], ["routerLink", "/blog-details/3"], ["routerLink", "/contact"], [1, "social-links"], [1, "clearfix", "list-wrap"], ["href", "#"], [1, "fab", "fa-facebook-f"], ["xmlns", "http://www.w3.org/2000/svg", "width", "16", "height", "16", "viewBox", "0 0 16 16", "fill", "none"], ["d", "M10.0596 7.34522L15.8879 0.570312H14.5068L9.44607 6.45287L5.40411 0.570312H0.742188L6.85442 9.46578L0.742188 16.5703H2.12338L7.4676 10.3581L11.7362 16.5703H16.3981L10.0593 7.34522H10.0596ZM8.16787 9.54415L7.54857 8.65836L2.62104 1.61005H4.74248L8.71905 7.29827L9.33834 8.18405L14.5074 15.5779H12.386L8.16787 9.54449V9.54415Z", "fill", "currentColor"], [1, "fab", "fa-instagram"], [1, "fab", "fa-linkedin-in"], [1, "fab", "fa-youtube"], [1, "menu-backdrop", 3, "click"], [1, "section-link", "pointer", 3, "click"]],
        template: function (r, o) {
            r & 1 && (u(0, "div", 0)(1, "nav", 1)(2, "div", 2), j("click", function () {
                return o.utilsService.openMobileMenus = !o.utilsService.openMobileMenus
            }), v(3, "i", 3), d(), u(4, "div", 4)(5, "a", 5), v(6, "img", 6), d()(), u(7, "div", 7)(8, "ul", 8)(9, "li", 9)(10, "a", 10), h(11, "Home"), d(), u(12, "ul", 11)(13, "li", 12)(14, "a", 5), h(15, "ICO Investment"), d()(), u(16, "li", 13)(17, "a", 14), h(18, "Blockchain"), d()()(), u(19, "div", 15), j("click", function () {
                return o.handleSubMenu("home")
            }), v(20, "span", 16), d()(), Y(21, PT, 7, 0, "ng-container", 17)(22, kT, 7, 0, "ng-container", 17), u(23, "li", 9)(24, "a", 18), h(25, "blog"), d(), u(26, "ul", 11)(27, "li", 12)(28, "a", 18), h(29, "Our Blog"), d()(), u(30, "li", 13)(31, "a", 19), h(32, "Blog Details"), d()()(), u(33, "div", 15), j("click", function () {
                return o.handleSubMenu("blog")
            }), v(34, "span", 16), d()(), u(35, "li", 13)(36, "a", 20), h(37, "Contact"), d()()()(), u(38, "div", 21)(39, "ul", 22)(40, "li")(41, "a", 23), v(42, "i", 24), d()(), u(43, "li")(44, "a", 23), Ke(), u(45, "svg", 25), v(46, "path", 26), d()()(), Ze(), u(47, "li")(48, "a", 23), v(49, "i", 27), d()(), u(50, "li")(51, "a", 23), v(52, "i", 28), d()(), u(53, "li")(54, "a", 23), v(55, "i", 29), d()()()()()(), u(56, "div", 30), j("click", function () {
                return o.utilsService.openMobileMenus = !o.utilsService.openMobileMenus
            }), d()), r & 2 && (y(9), D("routerLinkActive", se(17, Mi)), y(3), D("ngStyle", bn(18, B0, o.openSubMenu === "home" ? "block" : "none")), y(), D("routerLinkActive", se(20, Mi))("routerLinkActiveOptions", se(21, H0)), y(3), D("routerLinkActive", se(22, Mi)), y(3), ee("open", o.openSubMenu === "home"), y(2), D("ngIf", !o.menuTwo), y(), D("ngIf", o.menuTwo), y(), D("routerLinkActive", se(23, Mi)), y(3), D("ngStyle", bn(24, B0, o.openSubMenu === "blog" ? "block" : "none")), y(), D("routerLinkActive", se(26, Mi))("routerLinkActiveOptions", se(27, H0)), y(3), D("routerLinkActive", se(28, Mi)), y(3), ee("open", o.openSubMenu === "blog"), y(2), D("routerLinkActive", se(29, Mi)))
        },
        dependencies: [H, _t, _a, Ee, he, qn]
    });
    let t = e;
    return t
})();
var _i = () => ["active"], FT = () => ({exact: !0}), U0 = (() => {
    let e = class e {
        constructor(i, r) {
            this.utilsService = i, this.router = r, this.sticky = !1
        }

        scrollToFragment(i) {
            setTimeout(() => {
                let r = document.getElementById(i);
                if (r) {
                    let o = r.offsetTop - 60;
                    console.log("element offset", r, o), window.scrollTo({top: o, behavior: "smooth"})
                }
            }, 100)
        }

        navigateWithOffset(i) {
            this.router.navigate(["/home"], {fragment: i}), this.scrollToFragment(i)
        }

        isFeatureRouteActive() {
            return this.router.url === "/home#feature"
        }

        isRoadMapRouteActive() {
            return this.router.url === "/home#roadMap"
        }

        onscroll() {
            window.scrollY > 100 ? this.sticky = !0 : this.sticky = !1
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)(P(Ae), P(Me))
    }, e.\u0275cmp = T({
        type: e,
        selectors: [["app-header-one"]],
        hostBindings: function (r, o) {
            r & 1 && j("scroll", function (a) {
                return o.onscroll(a)
            }, !1, ar)
        },
        standalone: !0,
        features: [x],
        decls: 65,
        vars: 22,
        consts: [["id", "header", 1, "header-layout1"], ["id", "sticky-header", 1, "menu-area", "transparent-header"], [1, "container", "custom-container"], [1, "row"], [1, "col-12"], [1, "menu-wrap"], [1, "menu-nav"], [1, "logo"], ["routerLink", "/home"], ["src", "./assets/logo.png", "alt", "Logo", 2, "height", "35px"], [1, "navbar-wrap", "main-menu", "d-none", "d-lg-flex"], [1, "navigation"], [1, "menu-item-has-children", 3, "routerLinkActive"], ["routerLink", "/home", 1, "section-link"], [1, "sub-menu"], [3, "routerLinkActive"], ["routerLink", "/home/home-two"], [1, "section-link", "pointer", 3, "click"], ["routerLink", "/blog"], [3, "routerLinkActive", "routerLinkActiveOptions"], ["routerLink", "/blog-details/3"], ["routerLink", "/contact"], [1, "header-action"], [1, "list-wrap"], [1, "dropdown-link"], ["href", "#", "role", "button", "id", "dropdownMenuLink1", "data-bs-toggle", "dropdown", "aria-expanded", "false", 1, "dropdown-toggle"], ["aria-labelledby", "dropdownMenuLink1", 1, "dropdown-menu"], ["href", "#"], [1, "header-login"], ["routerLink", "/contact", 1, "btn2"], [1, "mobile-nav-toggler", 3, "click"], [1, "fas", "fa-bars"]],
        template: function (r, o) {
            r & 1 && (u(0, "header", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div", 4)(5, "div", 5)(6, "nav", 6)(7, "div", 7)(8, "a", 8), v(9, "img", 9), d()(), u(10, "div", 10)(11, "ul", 11)(12, "li", 12)(13, "a", 13), h(14, "Home"), d(), u(15, "ul", 14)(16, "li", 15)(17, "a", 8), h(18, "ICO Investment"), d()(), u(19, "li", 15)(20, "a", 16), h(21, "Blockchain"), d()()()(), u(22, "li")(23, "a", 17), j("click", function () {
                return o.navigateWithOffset("feature")
            }), h(24, "Feature"), d()(), u(25, "li")(26, "a", 17), j("click", function () {
                return o.navigateWithOffset("roadMap")
            }), h(27, "RoadMap"), d()(), u(28, "li", 12)(29, "a", 18), h(30, "Blog"), d(), u(31, "ul", 14)(32, "li", 19)(33, "a", 18), h(34, "Our Blog"), d()(), u(35, "li", 15)(36, "a", 20), h(37, "Blog Details"), d()()()(), u(38, "li", 15)(39, "a", 21), h(40, "Contact"), d()()()(), u(41, "div", 22)(42, "ul", 23)(43, "li")(44, "div", 24)(45, "a", 25), h(46, "ENG"), d(), u(47, "ul", 26)(48, "li")(49, "a", 27), h(50, "GER"), d(), u(51, "a", 27), h(52, "FREN"), d(), u(53, "a", 27), h(54, "ARAB"), d(), u(55, "a", 27), h(56, "LAT"), d(), u(57, "a", 27), h(58, "SPA"), d()()()()(), u(59, "li", 28)(60, "a", 29), h(61, "LOGIN"), d()()()(), u(62, "div", 30), j("click", function () {
                return o.utilsService.openMobileMenus = !o.utilsService.openMobileMenus
            }), v(63, "i", 31), d()()()()()()(), v(64, "app-mobile-offcanvas"), d()), r & 2 && (y(), ee("sticky-menu", o.sticky), y(11), D("routerLinkActive", se(14, _i)), y(4), D("routerLinkActive", se(15, _i)), y(3), D("routerLinkActive", se(16, _i)), y(3), ee("active", o.isFeatureRouteActive()), y(3), ee("active", o.isRoadMapRouteActive()), y(3), D("routerLinkActive", se(17, _i)), y(4), D("routerLinkActive", se(18, _i))("routerLinkActiveOptions", se(19, FT)), y(3), D("routerLinkActive", se(20, _i)), y(3), D("routerLinkActive", se(21, _i)))
        },
        dependencies: [H, Ee, he, qn, Mr]
    });
    let t = e;
    return t
})();
var z0 = (() => {
    let e = class e {
        constructor() {
            this.timerdate = 0, this.now = 0, setInterval(() => {
                this.now = Math.trunc(new Date().getTime() / 1e3)
            }, 1e3)
        }

        ngOnInit() {
            this.date && (this.timerdate = Math.trunc(new Date(this.date).getTime() / 1e3), this.now = Math.trunc(new Date().getTime() / 1e3))
        }

        get seconds() {
            return Math.max((this.timerdate - this.now) % 60, 0)
        }

        get minutes() {
            return Math.max(Math.trunc((this.timerdate - this.now) / 60) % 60, 0)
        }

        get hours() {
            return Math.max(Math.trunc((this.timerdate - this.now) / 60 / 60) % 24, 0)
        }

        get days() {
            return Math.max(Math.trunc((this.timerdate - this.now) / 60 / 60 / 24), 0)
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275cmp = T({
        type: e,
        selectors: [["app-countdown-timer"]],
        inputs: {date: "date"},
        standalone: !0,
        features: [x],
        decls: 17,
        vars: 4,
        consts: [[1, "coming-time"], [1, "time-count", "day"], [1, "time-count", "hour"], [1, "time-count", "min"], [1, "time-count", "sec"]],
        template: function (r, o) {
            r & 1 && (u(0, "div", 0)(1, "div", 1)(2, "span"), h(3), d(), h(4, "Days"), d(), u(5, "div", 2)(6, "span"), h(7), d(), h(8, "Hours"), d(), u(9, "div", 3)(10, "span"), h(11), d(), h(12, "Minute"), d(), u(13, "div", 4)(14, "span"), h(15), d(), h(16, "Second"), d()()), r & 2 && (y(3), $(o.days), y(4), $(o.hours), y(4), $(o.minutes), y(4), $(o.seconds))
        }
    });
    let t = e;
    return t
})();
var G0 = (() => {
    let e = class e {
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275cmp = T({
        type: e,
        selectors: [["app-hero-one"]],
        standalone: !0,
        features: [x],
        decls: 51,
        vars: 1,
        consts: [[1, "hero-wrapper", "hero-1"], [1, "hero-bg-gradient"], [1, "ripple-shape"], [1, "ripple-1"], [1, "ripple-2"], [1, "ripple-3"], [1, "ripple-4"], [1, "ripple-5"], [1, "container"], [1, "hero-style1"], [1, "row", "flex-row-reverse"], [1, "col-lg-3"], [1, "hero-thumb", "alltuchtopdown"], ["src", "./assets/hero-1-1.jpg", "alt", "img"], [1, "col-lg-9"], [1, "hero-title"], [1, "btn-wrap"], ["routerLink", "/contact", 1, "btn", "btn2"], ["routerLink", "/blog", 1, "btn", "btn-two"], [1, "hero-countdown-wrap"], [1, "hero-countdown-wrap-title"], [1, "skill-feature_list"], [1, "skill-feature"], [1, "progress"], [1, "progress-bar", 2, "width", "80%"], [1, "progress-value-max"], [1, "skill-feature_list", "style2"], [1, "banner-countdown-wrap"], [3, "date"]],
        template: function (r, o) {
            r & 1 && (u(0, "div", 0), v(1, "div", 1), u(2, "div", 2), v(3, "span", 3)(4, "span", 4)(5, "span", 5)(6, "span", 6)(7, "span", 7), d(), u(8, "div", 8)(9, "div", 9)(10, "div", 10)(11, "div", 11)(12, "div", 12), v(13, "img", 13), d()(), u(14, "div", 14)(15, "h1", 15), h(16, "Putting Your Money in Product Backed Projects"), d(), u(17, "div", 16)(18, "a", 17), h(19, " Purchase a Token "), d(), u(20, "a", 18), h(21, " Read Documents "), d()()()()(), u(22, "div", 19)(23, "h2", 20), h(24, "ICO will start in.."), d(), u(25, "ul", 21)(26, "li")(27, "span"), h(28, "Value"), d(), h(29, " of technology invested"), d(), u(30, "li")(31, "span"), h(32, "Private"), d(), h(33, " sale"), d(), u(34, "li")(35, "h4"), h(36, "ICO"), d()()(), u(37, "div", 22)(38, "div", 23), v(39, "div", 24), d(), u(40, "div", 25), h(41, "100 Min $"), d()(), u(42, "ul", 26)(43, "li"), h(44, "7.75 Min"), d(), u(45, "li"), h(46, "1.5 Min"), d(), u(47, "li"), h(48, "140,000 $ chosen"), d()(), u(49, "div", 27), v(50, "app-countdown-timer", 28), d()()()()), r & 2 && (y(50), D("date", "2024/8/29"))
        },
        dependencies: [z0, Ee, he]
    });
    let t = e;
    return t
})();

function q0(t) {
    return t !== null && typeof t == "object" && "constructor" in t && t.constructor === Object
}

function Hf(t, e) {
    t === void 0 && (t = {}), e === void 0 && (e = {}), Object.keys(e).forEach(n => {
        typeof t[n] > "u" ? t[n] = e[n] : q0(e[n]) && q0(t[n]) && Object.keys(e[n]).length > 0 && Hf(t[n], e[n])
    })
}

var W0 = {
    body: {}, addEventListener() {
    }, removeEventListener() {
    }, activeElement: {
        blur() {
        }, nodeName: ""
    }, querySelector() {
        return null
    }, querySelectorAll() {
        return []
    }, getElementById() {
        return null
    }, createEvent() {
        return {
            initEvent() {
            }
        }
    }, createElement() {
        return {
            children: [], childNodes: [], style: {}, setAttribute() {
            }, getElementsByTagName() {
                return []
            }
        }
    }, createElementNS() {
        return {}
    }, importNode() {
        return null
    }, location: {hash: "", host: "", hostname: "", href: "", origin: "", pathname: "", protocol: "", search: ""}
};

function at() {
    let t = typeof document < "u" ? document : {};
    return Hf(t, W0), t
}

var RT = {
    document: W0,
    navigator: {userAgent: ""},
    location: {hash: "", host: "", hostname: "", href: "", origin: "", pathname: "", protocol: "", search: ""},
    history: {
        replaceState() {
        }, pushState() {
        }, go() {
        }, back() {
        }
    },
    CustomEvent: function () {
        return this
    },
    addEventListener() {
    },
    removeEventListener() {
    },
    getComputedStyle() {
        return {
            getPropertyValue() {
                return ""
            }
        }
    },
    Image() {
    },
    Date() {
    },
    screen: {},
    setTimeout() {
    },
    clearTimeout() {
    },
    matchMedia() {
        return {}
    },
    requestAnimationFrame(t) {
        return typeof setTimeout > "u" ? (t(), null) : setTimeout(t, 0)
    },
    cancelAnimationFrame(t) {
        typeof setTimeout > "u" || clearTimeout(t)
    }
};

function Fe() {
    let t = typeof window < "u" ? window : {};
    return Hf(t, RT), t
}

function Y0(t) {
    return t === void 0 && (t = ""), t.trim().split(" ").filter(e => !!e.trim())
}

function Q0(t) {
    let e = t;
    Object.keys(e).forEach(n => {
        try {
            e[n] = null
        } catch {
        }
        try {
            delete e[n]
        } catch {
        }
    })
}

function Ti(t, e) {
    return e === void 0 && (e = 0), setTimeout(t, e)
}

function xi() {
    return Date.now()
}

function LT(t) {
    let e = Fe(), n;
    return e.getComputedStyle && (n = e.getComputedStyle(t, null)), !n && t.currentStyle && (n = t.currentStyle), n || (n = t.style), n
}

function Uf(t, e) {
    e === void 0 && (e = "x");
    let n = Fe(), i, r, o, s = LT(t);
    return n.WebKitCSSMatrix ? (r = s.transform || s.webkitTransform, r.split(",").length > 6 && (r = r.split(", ").map(a => a.replace(",", ".")).join(", ")), o = new n.WebKitCSSMatrix(r === "none" ? "" : r)) : (o = s.MozTransform || s.OTransform || s.MsTransform || s.msTransform || s.transform || s.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,"), i = o.toString().split(",")), e === "x" && (n.WebKitCSSMatrix ? r = o.m41 : i.length === 16 ? r = parseFloat(i[12]) : r = parseFloat(i[4])), e === "y" && (n.WebKitCSSMatrix ? r = o.m42 : i.length === 16 ? r = parseFloat(i[13]) : r = parseFloat(i[5])), r || 0
}

function Ho(t) {
    return typeof t == "object" && t !== null && t.constructor && Object.prototype.toString.call(t).slice(8, -1) === "Object"
}

function VT(t) {
    return typeof window < "u" && typeof window.HTMLElement < "u" ? t instanceof HTMLElement : t && (t.nodeType === 1 || t.nodeType === 11)
}

function dt() {
    let t = Object(arguments.length <= 0 ? void 0 : arguments[0]), e = ["__proto__", "constructor", "prototype"];
    for (let n = 1; n < arguments.length; n += 1) {
        let i = n < 0 || arguments.length <= n ? void 0 : arguments[n];
        if (i != null && !VT(i)) {
            let r = Object.keys(Object(i)).filter(o => e.indexOf(o) < 0);
            for (let o = 0, s = r.length; o < s; o += 1) {
                let a = r[o], l = Object.getOwnPropertyDescriptor(i, a);
                l !== void 0 && l.enumerable && (Ho(t[a]) && Ho(i[a]) ? i[a].__swiper__ ? t[a] = i[a] : dt(t[a], i[a]) : !Ho(t[a]) && Ho(i[a]) ? (t[a] = {}, i[a].__swiper__ ? t[a] = i[a] : dt(t[a], i[a])) : t[a] = i[a])
            }
        }
    }
    return t
}

function _r(t, e, n) {
    t.style.setProperty(e, n)
}

function zf(t) {
    let {swiper: e, targetPosition: n, side: i} = t, r = Fe(), o = -e.translate, s = null, a, l = e.params.speed;
    e.wrapperEl.style.scrollSnapType = "none", r.cancelAnimationFrame(e.cssModeFrameID);
    let c = n > o ? "next" : "prev", f = (m, g) => c === "next" && m >= g || c === "prev" && m <= g, p = () => {
        a = new Date().getTime(), s === null && (s = a);
        let m = Math.max(Math.min((a - s) / l, 1), 0), g = .5 - Math.cos(m * Math.PI) / 2, b = o + g * (n - o);
        if (f(b, n) && (b = n), e.wrapperEl.scrollTo({[i]: b}), f(b, n)) {
            e.wrapperEl.style.overflow = "hidden", e.wrapperEl.style.scrollSnapType = "", setTimeout(() => {
                e.wrapperEl.style.overflow = "", e.wrapperEl.scrollTo({[i]: b})
            }), r.cancelAnimationFrame(e.cssModeFrameID);
            return
        }
        e.cssModeFrameID = r.requestAnimationFrame(p)
    };
    p()
}

function We(t, e) {
    return e === void 0 && (e = ""), [...t.children].filter(n => n.matches(e))
}

function Uo(t) {
    try {
        console.warn(t);
        return
    } catch {
    }
}

function Bt(t, e) {
    e === void 0 && (e = []);
    let n = document.createElement(t);
    return n.classList.add(...Array.isArray(e) ? e : Y0(e)), n
}

function X0(t, e) {
    let n = [];
    for (; t.previousElementSibling;) {
        let i = t.previousElementSibling;
        e ? i.matches(e) && n.push(i) : n.push(i), t = i
    }
    return n
}

function K0(t, e) {
    let n = [];
    for (; t.nextElementSibling;) {
        let i = t.nextElementSibling;
        e ? i.matches(e) && n.push(i) : n.push(i), t = i
    }
    return n
}

function In(t, e) {
    return Fe().getComputedStyle(t, null).getPropertyValue(e)
}

function Ai(t) {
    let e = t, n;
    if (e) {
        for (n = 0; (e = e.previousSibling) !== null;) e.nodeType === 1 && (n += 1);
        return n
    }
}

function Tr(t, e) {
    let n = [], i = t.parentElement;
    for (; i;) e ? i.matches(e) && n.push(i) : n.push(i), i = i.parentElement;
    return n
}

function zo(t, e, n) {
    let i = Fe();
    return n ? t[e === "width" ? "offsetWidth" : "offsetHeight"] + parseFloat(i.getComputedStyle(t, null).getPropertyValue(e === "width" ? "margin-right" : "margin-top")) + parseFloat(i.getComputedStyle(t, null).getPropertyValue(e === "width" ? "margin-left" : "margin-bottom")) : t.offsetWidth
}

function Et(t) {
    return (Array.isArray(t) ? t : [t]).filter(e => !!e)
}

var Gf;

function jT() {
    let t = Fe(), e = at();
    return {
        smoothScroll: e.documentElement && e.documentElement.style && "scrollBehavior" in e.documentElement.style,
        touch: !!("ontouchstart" in t || t.DocumentTouch && e instanceof t.DocumentTouch)
    }
}

function ny() {
    return Gf || (Gf = jT()), Gf
}

var qf;

function $T(t) {
    let {userAgent: e} = t === void 0 ? {} : t, n = ny(), i = Fe(), r = i.navigator.platform,
        o = e || i.navigator.userAgent, s = {ios: !1, android: !1}, a = i.screen.width, l = i.screen.height,
        c = o.match(/(Android);?[\s\/]+([\d.]+)?/), f = o.match(/(iPad).*OS\s([\d_]+)/),
        p = o.match(/(iPod)(.*OS\s([\d_]+))?/), m = !f && o.match(/(iPhone\sOS|iOS)\s([\d_]+)/), g = r === "Win32",
        b = r === "MacIntel",
        E = ["1024x1366", "1366x1024", "834x1194", "1194x834", "834x1112", "1112x834", "768x1024", "1024x768", "820x1180", "1180x820", "810x1080", "1080x810"];
    return !f && b && n.touch && E.indexOf(`${a}x${l}`) >= 0 && (f = o.match(/(Version)\/([\d.]+)/), f || (f = [0, 1, "13_0_0"]), b = !1), c && !g && (s.os = "android", s.android = !0), (f || m || p) && (s.os = "ios", s.ios = !0), s
}

function iy(t) {
    return t === void 0 && (t = {}), qf || (qf = $T(t)), qf
}

var Wf;

function BT() {
    let t = Fe(), e = iy(), n = !1;

    function i() {
        let a = t.navigator.userAgent.toLowerCase();
        return a.indexOf("safari") >= 0 && a.indexOf("chrome") < 0 && a.indexOf("android") < 0
    }

    if (i()) {
        let a = String(t.navigator.userAgent);
        if (a.includes("Version/")) {
            let [l, c] = a.split("Version/")[1].split(" ")[0].split(".").map(f => Number(f));
            n = l < 16 || l === 16 && c < 2
        }
    }
    let r = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(t.navigator.userAgent), o = i(), s = o || r && e.ios;
    return {isSafari: n || o, needPerspectiveFix: n, need3dFix: s, isWebView: r}
}

function HT() {
    return Wf || (Wf = BT()), Wf
}

function UT(t) {
    let {swiper: e, on: n, emit: i} = t, r = Fe(), o = null, s = null, a = () => {
        !e || e.destroyed || !e.initialized || (i("beforeResize"), i("resize"))
    }, l = () => {
        !e || e.destroyed || !e.initialized || (o = new ResizeObserver(p => {
            s = r.requestAnimationFrame(() => {
                let {width: m, height: g} = e, b = m, E = g;
                p.forEach(M => {
                    let {contentBoxSize: w, contentRect: S, target: C} = M;
                    C && C !== e.el || (b = S ? S.width : (w[0] || w).inlineSize, E = S ? S.height : (w[0] || w).blockSize)
                }), (b !== m || E !== g) && a()
            })
        }), o.observe(e.el))
    }, c = () => {
        s && r.cancelAnimationFrame(s), o && o.unobserve && e.el && (o.unobserve(e.el), o = null)
    }, f = () => {
        !e || e.destroyed || !e.initialized || i("orientationchange")
    };
    n("init", () => {
        if (e.params.resizeObserver && typeof r.ResizeObserver < "u") {
            l();
            return
        }
        r.addEventListener("resize", a), r.addEventListener("orientationchange", f)
    }), n("destroy", () => {
        c(), r.removeEventListener("resize", a), r.removeEventListener("orientationchange", f)
    })
}

function zT(t) {
    let {swiper: e, extendParams: n, on: i, emit: r} = t, o = [], s = Fe(), a = function (f, p) {
        p === void 0 && (p = {});
        let m = s.MutationObserver || s.WebkitMutationObserver, g = new m(b => {
            if (e.__preventObserver__) return;
            if (b.length === 1) {
                r("observerUpdate", b[0]);
                return
            }
            let E = function () {
                r("observerUpdate", b[0])
            };
            s.requestAnimationFrame ? s.requestAnimationFrame(E) : s.setTimeout(E, 0)
        });
        g.observe(f, {
            attributes: typeof p.attributes > "u" ? !0 : p.attributes,
            childList: typeof p.childList > "u" ? !0 : p.childList,
            characterData: typeof p.characterData > "u" ? !0 : p.characterData
        }), o.push(g)
    }, l = () => {
        if (e.params.observer) {
            if (e.params.observeParents) {
                let f = Tr(e.hostEl);
                for (let p = 0; p < f.length; p += 1) a(f[p])
            }
            a(e.hostEl, {childList: e.params.observeSlideChildren}), a(e.wrapperEl, {attributes: !1})
        }
    }, c = () => {
        o.forEach(f => {
            f.disconnect()
        }), o.splice(0, o.length)
    };
    n({observer: !1, observeParents: !1, observeSlideChildren: !1}), i("init", l), i("destroy", c)
}

var GT = {
    on(t, e, n) {
        let i = this;
        if (!i.eventsListeners || i.destroyed || typeof e != "function") return i;
        let r = n ? "unshift" : "push";
        return t.split(" ").forEach(o => {
            i.eventsListeners[o] || (i.eventsListeners[o] = []), i.eventsListeners[o][r](e)
        }), i
    }, once(t, e, n) {
        let i = this;
        if (!i.eventsListeners || i.destroyed || typeof e != "function") return i;

        function r() {
            i.off(t, r), r.__emitterProxy && delete r.__emitterProxy;
            for (var o = arguments.length, s = new Array(o), a = 0; a < o; a++) s[a] = arguments[a];
            e.apply(i, s)
        }

        return r.__emitterProxy = e, i.on(t, r, n)
    }, onAny(t, e) {
        let n = this;
        if (!n.eventsListeners || n.destroyed || typeof t != "function") return n;
        let i = e ? "unshift" : "push";
        return n.eventsAnyListeners.indexOf(t) < 0 && n.eventsAnyListeners[i](t), n
    }, offAny(t) {
        let e = this;
        if (!e.eventsListeners || e.destroyed || !e.eventsAnyListeners) return e;
        let n = e.eventsAnyListeners.indexOf(t);
        return n >= 0 && e.eventsAnyListeners.splice(n, 1), e
    }, off(t, e) {
        let n = this;
        return !n.eventsListeners || n.destroyed || !n.eventsListeners || t.split(" ").forEach(i => {
            typeof e > "u" ? n.eventsListeners[i] = [] : n.eventsListeners[i] && n.eventsListeners[i].forEach((r, o) => {
                (r === e || r.__emitterProxy && r.__emitterProxy === e) && n.eventsListeners[i].splice(o, 1)
            })
        }), n
    }, emit() {
        let t = this;
        if (!t.eventsListeners || t.destroyed || !t.eventsListeners) return t;
        let e, n, i;
        for (var r = arguments.length, o = new Array(r), s = 0; s < r; s++) o[s] = arguments[s];
        return typeof o[0] == "string" || Array.isArray(o[0]) ? (e = o[0], n = o.slice(1, o.length), i = t) : (e = o[0].events, n = o[0].data, i = o[0].context || t), n.unshift(i), (Array.isArray(e) ? e : e.split(" ")).forEach(l => {
            t.eventsAnyListeners && t.eventsAnyListeners.length && t.eventsAnyListeners.forEach(c => {
                c.apply(i, [l, ...n])
            }), t.eventsListeners && t.eventsListeners[l] && t.eventsListeners[l].forEach(c => {
                c.apply(i, n)
            })
        }), t
    }
};

function qT() {
    let t = this, e, n, i = t.el;
    typeof t.params.width < "u" && t.params.width !== null ? e = t.params.width : e = i.clientWidth, typeof t.params.height < "u" && t.params.height !== null ? n = t.params.height : n = i.clientHeight, !(e === 0 && t.isHorizontal() || n === 0 && t.isVertical()) && (e = e - parseInt(In(i, "padding-left") || 0, 10) - parseInt(In(i, "padding-right") || 0, 10), n = n - parseInt(In(i, "padding-top") || 0, 10) - parseInt(In(i, "padding-bottom") || 0, 10), Number.isNaN(e) && (e = 0), Number.isNaN(n) && (n = 0), Object.assign(t, {
        width: e,
        height: n,
        size: t.isHorizontal() ? e : n
    }))
}

function WT() {
    let t = this;

    function e(A, W) {
        return parseFloat(A.getPropertyValue(t.getDirectionLabel(W)) || 0)
    }

    let n = t.params, {wrapperEl: i, slidesEl: r, size: o, rtlTranslate: s, wrongRTL: a} = t,
        l = t.virtual && n.virtual.enabled, c = l ? t.virtual.slides.length : t.slides.length,
        f = We(r, `.${t.params.slideClass}, swiper-slide`), p = l ? t.virtual.slides.length : f.length, m = [], g = [],
        b = [], E = n.slidesOffsetBefore;
    typeof E == "function" && (E = n.slidesOffsetBefore.call(t));
    let M = n.slidesOffsetAfter;
    typeof M == "function" && (M = n.slidesOffsetAfter.call(t));
    let w = t.snapGrid.length, S = t.slidesGrid.length, C = n.spaceBetween, I = -E, O = 0, U = 0;
    if (typeof o > "u") return;
    typeof C == "string" && C.indexOf("%") >= 0 ? C = parseFloat(C.replace("%", "")) / 100 * o : typeof C == "string" && (C = parseFloat(C)), t.virtualSize = -C, f.forEach(A => {
        s ? A.style.marginLeft = "" : A.style.marginRight = "", A.style.marginBottom = "", A.style.marginTop = ""
    }), n.centeredSlides && n.cssMode && (_r(i, "--swiper-centered-offset-before", ""), _r(i, "--swiper-centered-offset-after", ""));
    let de = n.grid && n.grid.rows > 1 && t.grid;
    de ? t.grid.initSlides(f) : t.grid && t.grid.unsetSlides();
    let L,
        Ce = n.slidesPerView === "auto" && n.breakpoints && Object.keys(n.breakpoints).filter(A => typeof n.breakpoints[A].slidesPerView < "u").length > 0;
    for (let A = 0; A < p; A += 1) {
        L = 0;
        let W;
        if (f[A] && (W = f[A]), de && t.grid.updateSlide(A, W, f), !(f[A] && In(W, "display") === "none")) {
            if (n.slidesPerView === "auto") {
                Ce && (f[A].style[t.getDirectionLabel("width")] = "");
                let V = getComputedStyle(W), R = W.style.transform, le = W.style.webkitTransform;
                if (R && (W.style.transform = "none"), le && (W.style.webkitTransform = "none"), n.roundLengths) L = t.isHorizontal() ? zo(W, "width", !0) : zo(W, "height", !0); else {
                    let _e = e(V, "width"), F = e(V, "padding-left"), z = e(V, "padding-right"),
                        G = e(V, "margin-left"), ce = e(V, "margin-right"), Ne = V.getPropertyValue("box-sizing");
                    if (Ne && Ne === "border-box") L = _e + G + ce; else {
                        let {clientWidth: St, offsetWidth: tt} = W;
                        L = _e + F + z + G + ce + (tt - St)
                    }
                }
                R && (W.style.transform = R), le && (W.style.webkitTransform = le), n.roundLengths && (L = Math.floor(L))
            } else L = (o - (n.slidesPerView - 1) * C) / n.slidesPerView, n.roundLengths && (L = Math.floor(L)), f[A] && (f[A].style[t.getDirectionLabel("width")] = `${L}px`);
            f[A] && (f[A].swiperSlideSize = L), b.push(L), n.centeredSlides ? (I = I + L / 2 + O / 2 + C, O === 0 && A !== 0 && (I = I - o / 2 - C), A === 0 && (I = I - o / 2 - C), Math.abs(I) < 1 / 1e3 && (I = 0), n.roundLengths && (I = Math.floor(I)), U % n.slidesPerGroup === 0 && m.push(I), g.push(I)) : (n.roundLengths && (I = Math.floor(I)), (U - Math.min(t.params.slidesPerGroupSkip, U)) % t.params.slidesPerGroup === 0 && m.push(I), g.push(I), I = I + L + C), t.virtualSize += L + C, O = L, U += 1
        }
    }
    if (t.virtualSize = Math.max(t.virtualSize, o) + M, s && a && (n.effect === "slide" || n.effect === "coverflow") && (i.style.width = `${t.virtualSize + C}px`), n.setWrapperSize && (i.style[t.getDirectionLabel("width")] = `${t.virtualSize + C}px`), de && t.grid.updateWrapperSize(L, m), !n.centeredSlides) {
        let A = [];
        for (let W = 0; W < m.length; W += 1) {
            let V = m[W];
            n.roundLengths && (V = Math.floor(V)), m[W] <= t.virtualSize - o && A.push(V)
        }
        m = A, Math.floor(t.virtualSize - o) - Math.floor(m[m.length - 1]) > 1 && m.push(t.virtualSize - o)
    }
    if (l && n.loop) {
        let A = b[0] + C;
        if (n.slidesPerGroup > 1) {
            let W = Math.ceil((t.virtual.slidesBefore + t.virtual.slidesAfter) / n.slidesPerGroup),
                V = A * n.slidesPerGroup;
            for (let R = 0; R < W; R += 1) m.push(m[m.length - 1] + V)
        }
        for (let W = 0; W < t.virtual.slidesBefore + t.virtual.slidesAfter; W += 1) n.slidesPerGroup === 1 && m.push(m[m.length - 1] + A), g.push(g[g.length - 1] + A), t.virtualSize += A
    }
    if (m.length === 0 && (m = [0]), C !== 0) {
        let A = t.isHorizontal() && s ? "marginLeft" : t.getDirectionLabel("marginRight");
        f.filter((W, V) => !n.cssMode || n.loop ? !0 : V !== f.length - 1).forEach(W => {
            W.style[A] = `${C}px`
        })
    }
    if (n.centeredSlides && n.centeredSlidesBounds) {
        let A = 0;
        b.forEach(V => {
            A += V + (C || 0)
        }), A -= C;
        let W = A - o;
        m = m.map(V => V <= 0 ? -E : V > W ? W + M : V)
    }
    if (n.centerInsufficientSlides) {
        let A = 0;
        if (b.forEach(W => {
            A += W + (C || 0)
        }), A -= C, A < o) {
            let W = (o - A) / 2;
            m.forEach((V, R) => {
                m[R] = V - W
            }), g.forEach((V, R) => {
                g[R] = V + W
            })
        }
    }
    if (Object.assign(t, {
        slides: f,
        snapGrid: m,
        slidesGrid: g,
        slidesSizesGrid: b
    }), n.centeredSlides && n.cssMode && !n.centeredSlidesBounds) {
        _r(i, "--swiper-centered-offset-before", `${-m[0]}px`), _r(i, "--swiper-centered-offset-after", `${t.size / 2 - b[b.length - 1] / 2}px`);
        let A = -t.snapGrid[0], W = -t.slidesGrid[0];
        t.snapGrid = t.snapGrid.map(V => V + A), t.slidesGrid = t.slidesGrid.map(V => V + W)
    }
    if (p !== c && t.emit("slidesLengthChange"), m.length !== w && (t.params.watchOverflow && t.checkOverflow(), t.emit("snapGridLengthChange")), g.length !== S && t.emit("slidesGridLengthChange"), n.watchSlidesProgress && t.updateSlidesOffset(), t.emit("slidesUpdated"), !l && !n.cssMode && (n.effect === "slide" || n.effect === "fade")) {
        let A = `${n.containerModifierClass}backface-hidden`, W = t.el.classList.contains(A);
        p <= n.maxBackfaceHiddenSlides ? W || t.el.classList.add(A) : W && t.el.classList.remove(A)
    }
}

function YT(t) {
    let e = this, n = [], i = e.virtual && e.params.virtual.enabled, r = 0, o;
    typeof t == "number" ? e.setTransition(t) : t === !0 && e.setTransition(e.params.speed);
    let s = a => i ? e.slides[e.getSlideIndexByData(a)] : e.slides[a];
    if (e.params.slidesPerView !== "auto" && e.params.slidesPerView > 1) if (e.params.centeredSlides) (e.visibleSlides || []).forEach(a => {
        n.push(a)
    }); else for (o = 0; o < Math.ceil(e.params.slidesPerView); o += 1) {
        let a = e.activeIndex + o;
        if (a > e.slides.length && !i) break;
        n.push(s(a))
    } else n.push(s(e.activeIndex));
    for (o = 0; o < n.length; o += 1) if (typeof n[o] < "u") {
        let a = n[o].offsetHeight;
        r = a > r ? a : r
    }
    (r || r === 0) && (e.wrapperEl.style.height = `${r}px`)
}

function QT() {
    let t = this, e = t.slides, n = t.isElement ? t.isHorizontal() ? t.wrapperEl.offsetLeft : t.wrapperEl.offsetTop : 0;
    for (let i = 0; i < e.length; i += 1) e[i].swiperSlideOffset = (t.isHorizontal() ? e[i].offsetLeft : e[i].offsetTop) - n - t.cssOverflowAdjustment()
}

function XT(t) {
    t === void 0 && (t = this && this.translate || 0);
    let e = this, n = e.params, {slides: i, rtlTranslate: r, snapGrid: o} = e;
    if (i.length === 0) return;
    typeof i[0].swiperSlideOffset > "u" && e.updateSlidesOffset();
    let s = -t;
    r && (s = t), i.forEach(l => {
        l.classList.remove(n.slideVisibleClass, n.slideFullyVisibleClass)
    }), e.visibleSlidesIndexes = [], e.visibleSlides = [];
    let a = n.spaceBetween;
    typeof a == "string" && a.indexOf("%") >= 0 ? a = parseFloat(a.replace("%", "")) / 100 * e.size : typeof a == "string" && (a = parseFloat(a));
    for (let l = 0; l < i.length; l += 1) {
        let c = i[l], f = c.swiperSlideOffset;
        n.cssMode && n.centeredSlides && (f -= i[0].swiperSlideOffset);
        let p = (s + (n.centeredSlides ? e.minTranslate() : 0) - f) / (c.swiperSlideSize + a),
            m = (s - o[0] + (n.centeredSlides ? e.minTranslate() : 0) - f) / (c.swiperSlideSize + a), g = -(s - f),
            b = g + e.slidesSizesGrid[l], E = g >= 0 && g <= e.size - e.slidesSizesGrid[l];
        (g >= 0 && g < e.size - 1 || b > 1 && b <= e.size || g <= 0 && b >= e.size) && (e.visibleSlides.push(c), e.visibleSlidesIndexes.push(l), i[l].classList.add(n.slideVisibleClass)), E && i[l].classList.add(n.slideFullyVisibleClass), c.progress = r ? -p : p, c.originalProgress = r ? -m : m
    }
}

function KT(t) {
    let e = this;
    if (typeof t > "u") {
        let f = e.rtlTranslate ? -1 : 1;
        t = e && e.translate && e.translate * f || 0
    }
    let n = e.params, i = e.maxTranslate() - e.minTranslate(), {
        progress: r,
        isBeginning: o,
        isEnd: s,
        progressLoop: a
    } = e, l = o, c = s;
    if (i === 0) r = 0, o = !0, s = !0; else {
        r = (t - e.minTranslate()) / i;
        let f = Math.abs(t - e.minTranslate()) < 1, p = Math.abs(t - e.maxTranslate()) < 1;
        o = f || r <= 0, s = p || r >= 1, f && (r = 0), p && (r = 1)
    }
    if (n.loop) {
        let f = e.getSlideIndexByData(0), p = e.getSlideIndexByData(e.slides.length - 1), m = e.slidesGrid[f],
            g = e.slidesGrid[p], b = e.slidesGrid[e.slidesGrid.length - 1], E = Math.abs(t);
        E >= m ? a = (E - m) / b : a = (E + b - g) / b, a > 1 && (a -= 1)
    }
    Object.assign(e, {
        progress: r,
        progressLoop: a,
        isBeginning: o,
        isEnd: s
    }), (n.watchSlidesProgress || n.centeredSlides && n.autoHeight) && e.updateSlidesProgress(t), o && !l && e.emit("reachBeginning toEdge"), s && !c && e.emit("reachEnd toEdge"), (l && !o || c && !s) && e.emit("fromEdge"), e.emit("progress", r)
}

var Yf = (t, e, n) => {
    e && !t.classList.contains(n) ? t.classList.add(n) : !e && t.classList.contains(n) && t.classList.remove(n)
};

function ZT() {
    let t = this, {slides: e, params: n, slidesEl: i, activeIndex: r} = t, o = t.virtual && n.virtual.enabled,
        s = t.grid && n.grid && n.grid.rows > 1, a = p => We(i, `.${n.slideClass}${p}, swiper-slide${p}`)[0], l, c, f;
    if (o) if (n.loop) {
        let p = r - t.virtual.slidesBefore;
        p < 0 && (p = t.virtual.slides.length + p), p >= t.virtual.slides.length && (p -= t.virtual.slides.length), l = a(`[data-swiper-slide-index="${p}"]`)
    } else l = a(`[data-swiper-slide-index="${r}"]`); else s ? (l = e.filter(p => p.column === r)[0], f = e.filter(p => p.column === r + 1)[0], c = e.filter(p => p.column === r - 1)[0]) : l = e[r];
    l && (s || (f = K0(l, `.${n.slideClass}, swiper-slide`)[0], n.loop && !f && (f = e[0]), c = X0(l, `.${n.slideClass}, swiper-slide`)[0], n.loop && !c === 0 && (c = e[e.length - 1]))), e.forEach(p => {
        Yf(p, p === l, n.slideActiveClass), Yf(p, p === f, n.slideNextClass), Yf(p, p === c, n.slidePrevClass)
    }), t.emitSlidesClasses()
}

var hl = (t, e) => {
    if (!t || t.destroyed || !t.params) return;
    let n = () => t.isElement ? "swiper-slide" : `.${t.params.slideClass}`, i = e.closest(n());
    if (i) {
        let r = i.querySelector(`.${t.params.lazyPreloaderClass}`);
        !r && t.isElement && (i.shadowRoot ? r = i.shadowRoot.querySelector(`.${t.params.lazyPreloaderClass}`) : requestAnimationFrame(() => {
            i.shadowRoot && (r = i.shadowRoot.querySelector(`.${t.params.lazyPreloaderClass}`), r && r.remove())
        })), r && r.remove()
    }
}, Qf = (t, e) => {
    if (!t.slides[e]) return;
    let n = t.slides[e].querySelector('[loading="lazy"]');
    n && n.removeAttribute("loading")
}, Zf = t => {
    if (!t || t.destroyed || !t.params) return;
    let e = t.params.lazyPreloadPrevNext, n = t.slides.length;
    if (!n || !e || e < 0) return;
    e = Math.min(e, n);
    let i = t.params.slidesPerView === "auto" ? t.slidesPerViewDynamic() : Math.ceil(t.params.slidesPerView),
        r = t.activeIndex;
    if (t.params.grid && t.params.grid.rows > 1) {
        let s = r, a = [s - e];
        a.push(...Array.from({length: e}).map((l, c) => s + i + c)), t.slides.forEach((l, c) => {
            a.includes(l.column) && Qf(t, c)
        });
        return
    }
    let o = r + i - 1;
    if (t.params.rewind || t.params.loop) for (let s = r - e; s <= o + e; s += 1) {
        let a = (s % n + n) % n;
        (a < r || a > o) && Qf(t, a)
    } else for (let s = Math.max(r - e, 0); s <= Math.min(o + e, n - 1); s += 1) s !== r && (s > o || s < r) && Qf(t, s)
};

function JT(t) {
    let {slidesGrid: e, params: n} = t, i = t.rtlTranslate ? t.translate : -t.translate, r;
    for (let o = 0; o < e.length; o += 1) typeof e[o + 1] < "u" ? i >= e[o] && i < e[o + 1] - (e[o + 1] - e[o]) / 2 ? r = o : i >= e[o] && i < e[o + 1] && (r = o + 1) : i >= e[o] && (r = o);
    return n.normalizeSlideIndex && (r < 0 || typeof r > "u") && (r = 0), r
}

function ex(t) {
    let e = this, n = e.rtlTranslate ? e.translate : -e.translate, {
        snapGrid: i,
        params: r,
        activeIndex: o,
        realIndex: s,
        snapIndex: a
    } = e, l = t, c, f = g => {
        let b = g - e.virtual.slidesBefore;
        return b < 0 && (b = e.virtual.slides.length + b), b >= e.virtual.slides.length && (b -= e.virtual.slides.length), b
    };
    if (typeof l > "u" && (l = JT(e)), i.indexOf(n) >= 0) c = i.indexOf(n); else {
        let g = Math.min(r.slidesPerGroupSkip, l);
        c = g + Math.floor((l - g) / r.slidesPerGroup)
    }
    if (c >= i.length && (c = i.length - 1), l === o && !e.params.loop) {
        c !== a && (e.snapIndex = c, e.emit("snapIndexChange"));
        return
    }
    if (l === o && e.params.loop && e.virtual && e.params.virtual.enabled) {
        e.realIndex = f(l);
        return
    }
    let p = e.grid && r.grid && r.grid.rows > 1, m;
    if (e.virtual && r.virtual.enabled && r.loop) m = f(l); else if (p) {
        let g = e.slides.filter(E => E.column === l)[0], b = parseInt(g.getAttribute("data-swiper-slide-index"), 10);
        Number.isNaN(b) && (b = Math.max(e.slides.indexOf(g), 0)), m = Math.floor(b / r.grid.rows)
    } else if (e.slides[l]) {
        let g = e.slides[l].getAttribute("data-swiper-slide-index");
        g ? m = parseInt(g, 10) : m = l
    } else m = l;
    Object.assign(e, {
        previousSnapIndex: a,
        snapIndex: c,
        previousRealIndex: s,
        realIndex: m,
        previousIndex: o,
        activeIndex: l
    }), e.initialized && Zf(e), e.emit("activeIndexChange"), e.emit("snapIndexChange"), (e.initialized || e.params.runCallbacksOnInit) && (s !== m && e.emit("realIndexChange"), e.emit("slideChange"))
}

function tx(t, e) {
    let n = this, i = n.params, r = t.closest(`.${i.slideClass}, swiper-slide`);
    !r && n.isElement && e && e.length > 1 && e.includes(t) && [...e.slice(e.indexOf(t) + 1, e.length)].forEach(a => {
        !r && a.matches && a.matches(`.${i.slideClass}, swiper-slide`) && (r = a)
    });
    let o = !1, s;
    if (r) {
        for (let a = 0; a < n.slides.length; a += 1) if (n.slides[a] === r) {
            o = !0, s = a;
            break
        }
    }
    if (r && o) n.clickedSlide = r, n.virtual && n.params.virtual.enabled ? n.clickedIndex = parseInt(r.getAttribute("data-swiper-slide-index"), 10) : n.clickedIndex = s; else {
        n.clickedSlide = void 0, n.clickedIndex = void 0;
        return
    }
    i.slideToClickedSlide && n.clickedIndex !== void 0 && n.clickedIndex !== n.activeIndex && n.slideToClickedSlide()
}

var nx = {
    updateSize: qT,
    updateSlides: WT,
    updateAutoHeight: YT,
    updateSlidesOffset: QT,
    updateSlidesProgress: XT,
    updateProgress: KT,
    updateSlidesClasses: ZT,
    updateActiveIndex: ex,
    updateClickedSlide: tx
};

function ix(t) {
    t === void 0 && (t = this.isHorizontal() ? "x" : "y");
    let e = this, {params: n, rtlTranslate: i, translate: r, wrapperEl: o} = e;
    if (n.virtualTranslate) return i ? -r : r;
    if (n.cssMode) return r;
    let s = Uf(o, t);
    return s += e.cssOverflowAdjustment(), i && (s = -s), s || 0
}

function rx(t, e) {
    let n = this, {rtlTranslate: i, params: r, wrapperEl: o, progress: s} = n, a = 0, l = 0, c = 0;
    n.isHorizontal() ? a = i ? -t : t : l = t, r.roundLengths && (a = Math.floor(a), l = Math.floor(l)), n.previousTranslate = n.translate, n.translate = n.isHorizontal() ? a : l, r.cssMode ? o[n.isHorizontal() ? "scrollLeft" : "scrollTop"] = n.isHorizontal() ? -a : -l : r.virtualTranslate || (n.isHorizontal() ? a -= n.cssOverflowAdjustment() : l -= n.cssOverflowAdjustment(), o.style.transform = `translate3d(${a}px, ${l}px, ${c}px)`);
    let f, p = n.maxTranslate() - n.minTranslate();
    p === 0 ? f = 0 : f = (t - n.minTranslate()) / p, f !== s && n.updateProgress(t), n.emit("setTranslate", n.translate, e)
}

function ox() {
    return -this.snapGrid[0]
}

function sx() {
    return -this.snapGrid[this.snapGrid.length - 1]
}

function ax(t, e, n, i, r) {
    t === void 0 && (t = 0), e === void 0 && (e = this.params.speed), n === void 0 && (n = !0), i === void 0 && (i = !0);
    let o = this, {params: s, wrapperEl: a} = o;
    if (o.animating && s.preventInteractionOnTransition) return !1;
    let l = o.minTranslate(), c = o.maxTranslate(), f;
    if (i && t > l ? f = l : i && t < c ? f = c : f = t, o.updateProgress(f), s.cssMode) {
        let p = o.isHorizontal();
        if (e === 0) a[p ? "scrollLeft" : "scrollTop"] = -f; else {
            if (!o.support.smoothScroll) return zf({swiper: o, targetPosition: -f, side: p ? "left" : "top"}), !0;
            a.scrollTo({[p ? "left" : "top"]: -f, behavior: "smooth"})
        }
        return !0
    }
    return e === 0 ? (o.setTransition(0), o.setTranslate(f), n && (o.emit("beforeTransitionStart", e, r), o.emit("transitionEnd"))) : (o.setTransition(e), o.setTranslate(f), n && (o.emit("beforeTransitionStart", e, r), o.emit("transitionStart")), o.animating || (o.animating = !0, o.onTranslateToWrapperTransitionEnd || (o.onTranslateToWrapperTransitionEnd = function (m) {
        !o || o.destroyed || m.target === this && (o.wrapperEl.removeEventListener("transitionend", o.onTranslateToWrapperTransitionEnd), o.onTranslateToWrapperTransitionEnd = null, delete o.onTranslateToWrapperTransitionEnd, o.animating = !1, n && o.emit("transitionEnd"))
    }), o.wrapperEl.addEventListener("transitionend", o.onTranslateToWrapperTransitionEnd))), !0
}

var lx = {getTranslate: ix, setTranslate: rx, minTranslate: ox, maxTranslate: sx, translateTo: ax};

function cx(t, e) {
    let n = this;
    n.params.cssMode || (n.wrapperEl.style.transitionDuration = `${t}ms`, n.wrapperEl.style.transitionDelay = t === 0 ? "0ms" : ""), n.emit("setTransition", t, e)
}

function ry(t) {
    let {swiper: e, runCallbacks: n, direction: i, step: r} = t, {activeIndex: o, previousIndex: s} = e, a = i;
    if (a || (o > s ? a = "next" : o < s ? a = "prev" : a = "reset"), e.emit(`transition${r}`), n && o !== s) {
        if (a === "reset") {
            e.emit(`slideResetTransition${r}`);
            return
        }
        e.emit(`slideChangeTransition${r}`), a === "next" ? e.emit(`slideNextTransition${r}`) : e.emit(`slidePrevTransition${r}`)
    }
}

function ux(t, e) {
    t === void 0 && (t = !0);
    let n = this, {params: i} = n;
    i.cssMode || (i.autoHeight && n.updateAutoHeight(), ry({swiper: n, runCallbacks: t, direction: e, step: "Start"}))
}

function dx(t, e) {
    t === void 0 && (t = !0);
    let n = this, {params: i} = n;
    n.animating = !1, !i.cssMode && (n.setTransition(0), ry({swiper: n, runCallbacks: t, direction: e, step: "End"}))
}

var fx = {setTransition: cx, transitionStart: ux, transitionEnd: dx};

function px(t, e, n, i, r) {
    t === void 0 && (t = 0), n === void 0 && (n = !0), typeof t == "string" && (t = parseInt(t, 10));
    let o = this, s = t;
    s < 0 && (s = 0);
    let {
        params: a,
        snapGrid: l,
        slidesGrid: c,
        previousIndex: f,
        activeIndex: p,
        rtlTranslate: m,
        wrapperEl: g,
        enabled: b
    } = o;
    if (!b && !i && !r || o.destroyed || o.animating && a.preventInteractionOnTransition) return !1;
    typeof e > "u" && (e = o.params.speed);
    let E = Math.min(o.params.slidesPerGroupSkip, s), M = E + Math.floor((s - E) / o.params.slidesPerGroup);
    M >= l.length && (M = l.length - 1);
    let w = -l[M];
    if (a.normalizeSlideIndex) for (let C = 0; C < c.length; C += 1) {
        let I = -Math.floor(w * 100), O = Math.floor(c[C] * 100), U = Math.floor(c[C + 1] * 100);
        typeof c[C + 1] < "u" ? I >= O && I < U - (U - O) / 2 ? s = C : I >= O && I < U && (s = C + 1) : I >= O && (s = C)
    }
    if (o.initialized && s !== p && (!o.allowSlideNext && (m ? w > o.translate && w > o.minTranslate() : w < o.translate && w < o.minTranslate()) || !o.allowSlidePrev && w > o.translate && w > o.maxTranslate() && (p || 0) !== s)) return !1;
    s !== (f || 0) && n && o.emit("beforeSlideChangeStart"), o.updateProgress(w);
    let S;
    if (s > p ? S = "next" : s < p ? S = "prev" : S = "reset", m && -w === o.translate || !m && w === o.translate) return o.updateActiveIndex(s), a.autoHeight && o.updateAutoHeight(), o.updateSlidesClasses(), a.effect !== "slide" && o.setTranslate(w), S !== "reset" && (o.transitionStart(n, S), o.transitionEnd(n, S)), !1;
    if (a.cssMode) {
        let C = o.isHorizontal(), I = m ? w : -w;
        if (e === 0) {
            let O = o.virtual && o.params.virtual.enabled;
            O && (o.wrapperEl.style.scrollSnapType = "none", o._immediateVirtual = !0), O && !o._cssModeVirtualInitialSet && o.params.initialSlide > 0 ? (o._cssModeVirtualInitialSet = !0, requestAnimationFrame(() => {
                g[C ? "scrollLeft" : "scrollTop"] = I
            })) : g[C ? "scrollLeft" : "scrollTop"] = I, O && requestAnimationFrame(() => {
                o.wrapperEl.style.scrollSnapType = "", o._immediateVirtual = !1
            })
        } else {
            if (!o.support.smoothScroll) return zf({swiper: o, targetPosition: I, side: C ? "left" : "top"}), !0;
            g.scrollTo({[C ? "left" : "top"]: I, behavior: "smooth"})
        }
        return !0
    }
    return o.setTransition(e), o.setTranslate(w), o.updateActiveIndex(s), o.updateSlidesClasses(), o.emit("beforeTransitionStart", e, i), o.transitionStart(n, S), e === 0 ? o.transitionEnd(n, S) : o.animating || (o.animating = !0, o.onSlideToWrapperTransitionEnd || (o.onSlideToWrapperTransitionEnd = function (I) {
        !o || o.destroyed || I.target === this && (o.wrapperEl.removeEventListener("transitionend", o.onSlideToWrapperTransitionEnd), o.onSlideToWrapperTransitionEnd = null, delete o.onSlideToWrapperTransitionEnd, o.transitionEnd(n, S))
    }), o.wrapperEl.addEventListener("transitionend", o.onSlideToWrapperTransitionEnd)), !0
}

function hx(t, e, n, i) {
    t === void 0 && (t = 0), n === void 0 && (n = !0), typeof t == "string" && (t = parseInt(t, 10));
    let r = this;
    if (r.destroyed) return;
    typeof e > "u" && (e = r.params.speed);
    let o = r.grid && r.params.grid && r.params.grid.rows > 1, s = t;
    if (r.params.loop) if (r.virtual && r.params.virtual.enabled) s = s + r.virtual.slidesBefore; else {
        let a;
        if (o) {
            let m = s * r.params.grid.rows;
            a = r.slides.filter(g => g.getAttribute("data-swiper-slide-index") * 1 === m)[0].column
        } else a = r.getSlideIndexByData(s);
        let l = o ? Math.ceil(r.slides.length / r.params.grid.rows) : r.slides.length, {centeredSlides: c} = r.params,
            f = r.params.slidesPerView;
        f === "auto" ? f = r.slidesPerViewDynamic() : (f = Math.ceil(parseFloat(r.params.slidesPerView, 10)), c && f % 2 === 0 && (f = f + 1));
        let p = l - a < f;
        if (c && (p = p || a < Math.ceil(f / 2)), i && c && r.params.slidesPerView !== "auto" && !o && (p = !1), p) {
            let m = c ? a < r.activeIndex ? "prev" : "next" : a - r.activeIndex - 1 < r.params.slidesPerView ? "next" : "prev";
            r.loopFix({
                direction: m,
                slideTo: !0,
                activeSlideIndex: m === "next" ? a + 1 : a - l + 1,
                slideRealIndex: m === "next" ? r.realIndex : void 0
            })
        }
        if (o) {
            let m = s * r.params.grid.rows;
            s = r.slides.filter(g => g.getAttribute("data-swiper-slide-index") * 1 === m)[0].column
        } else s = r.getSlideIndexByData(s)
    }
    return requestAnimationFrame(() => {
        r.slideTo(s, e, n, i)
    }), r
}

function mx(t, e, n) {
    e === void 0 && (e = !0);
    let i = this, {enabled: r, params: o, animating: s} = i;
    if (!r || i.destroyed) return i;
    typeof t > "u" && (t = i.params.speed);
    let a = o.slidesPerGroup;
    o.slidesPerView === "auto" && o.slidesPerGroup === 1 && o.slidesPerGroupAuto && (a = Math.max(i.slidesPerViewDynamic("current", !0), 1));
    let l = i.activeIndex < o.slidesPerGroupSkip ? 1 : a, c = i.virtual && o.virtual.enabled;
    if (o.loop) {
        if (s && !c && o.loopPreventsSliding) return !1;
        if (i.loopFix({direction: "next"}), i._clientLeft = i.wrapperEl.clientLeft, i.activeIndex === i.slides.length - 1 && o.cssMode) return requestAnimationFrame(() => {
            i.slideTo(i.activeIndex + l, t, e, n)
        }), !0
    }
    return o.rewind && i.isEnd ? i.slideTo(0, t, e, n) : i.slideTo(i.activeIndex + l, t, e, n)
}

function gx(t, e, n) {
    e === void 0 && (e = !0);
    let i = this, {params: r, snapGrid: o, slidesGrid: s, rtlTranslate: a, enabled: l, animating: c} = i;
    if (!l || i.destroyed) return i;
    typeof t > "u" && (t = i.params.speed);
    let f = i.virtual && r.virtual.enabled;
    if (r.loop) {
        if (c && !f && r.loopPreventsSliding) return !1;
        i.loopFix({direction: "prev"}), i._clientLeft = i.wrapperEl.clientLeft
    }
    let p = a ? i.translate : -i.translate;

    function m(w) {
        return w < 0 ? -Math.floor(Math.abs(w)) : Math.floor(w)
    }

    let g = m(p), b = o.map(w => m(w)), E = o[b.indexOf(g) - 1];
    if (typeof E > "u" && r.cssMode) {
        let w;
        o.forEach((S, C) => {
            g >= S && (w = C)
        }), typeof w < "u" && (E = o[w > 0 ? w - 1 : w])
    }
    let M = 0;
    if (typeof E < "u" && (M = s.indexOf(E), M < 0 && (M = i.activeIndex - 1), r.slidesPerView === "auto" && r.slidesPerGroup === 1 && r.slidesPerGroupAuto && (M = M - i.slidesPerViewDynamic("previous", !0) + 1, M = Math.max(M, 0))), r.rewind && i.isBeginning) {
        let w = i.params.virtual && i.params.virtual.enabled && i.virtual ? i.virtual.slides.length - 1 : i.slides.length - 1;
        return i.slideTo(w, t, e, n)
    } else if (r.loop && i.activeIndex === 0 && r.cssMode) return requestAnimationFrame(() => {
        i.slideTo(M, t, e, n)
    }), !0;
    return i.slideTo(M, t, e, n)
}

function vx(t, e, n) {
    e === void 0 && (e = !0);
    let i = this;
    if (!i.destroyed) return typeof t > "u" && (t = i.params.speed), i.slideTo(i.activeIndex, t, e, n)
}

function yx(t, e, n, i) {
    e === void 0 && (e = !0), i === void 0 && (i = .5);
    let r = this;
    if (r.destroyed) return;
    typeof t > "u" && (t = r.params.speed);
    let o = r.activeIndex, s = Math.min(r.params.slidesPerGroupSkip, o),
        a = s + Math.floor((o - s) / r.params.slidesPerGroup), l = r.rtlTranslate ? r.translate : -r.translate;
    if (l >= r.snapGrid[a]) {
        let c = r.snapGrid[a], f = r.snapGrid[a + 1];
        l - c > (f - c) * i && (o += r.params.slidesPerGroup)
    } else {
        let c = r.snapGrid[a - 1], f = r.snapGrid[a];
        l - c <= (f - c) * i && (o -= r.params.slidesPerGroup)
    }
    return o = Math.max(o, 0), o = Math.min(o, r.slidesGrid.length - 1), r.slideTo(o, t, e, n)
}

function wx() {
    let t = this;
    if (t.destroyed) return;
    let {params: e, slidesEl: n} = t, i = e.slidesPerView === "auto" ? t.slidesPerViewDynamic() : e.slidesPerView,
        r = t.clickedIndex, o, s = t.isElement ? "swiper-slide" : `.${e.slideClass}`;
    if (e.loop) {
        if (t.animating) return;
        o = parseInt(t.clickedSlide.getAttribute("data-swiper-slide-index"), 10), e.centeredSlides ? r < t.loopedSlides - i / 2 || r > t.slides.length - t.loopedSlides + i / 2 ? (t.loopFix(), r = t.getSlideIndex(We(n, `${s}[data-swiper-slide-index="${o}"]`)[0]), Ti(() => {
            t.slideTo(r)
        })) : t.slideTo(r) : r > t.slides.length - i ? (t.loopFix(), r = t.getSlideIndex(We(n, `${s}[data-swiper-slide-index="${o}"]`)[0]), Ti(() => {
            t.slideTo(r)
        })) : t.slideTo(r)
    } else t.slideTo(r)
}

var bx = {
    slideTo: px,
    slideToLoop: hx,
    slideNext: mx,
    slidePrev: gx,
    slideReset: vx,
    slideToClosest: yx,
    slideToClickedSlide: wx
};

function Ex(t) {
    let e = this, {params: n, slidesEl: i} = e;
    if (!n.loop || e.virtual && e.params.virtual.enabled) return;
    let r = () => {
            We(i, `.${n.slideClass}, swiper-slide`).forEach((p, m) => {
                p.setAttribute("data-swiper-slide-index", m)
            })
        }, o = e.grid && n.grid && n.grid.rows > 1, s = n.slidesPerGroup * (o ? n.grid.rows : 1),
        a = e.slides.length % s !== 0, l = o && e.slides.length % n.grid.rows !== 0, c = f => {
            for (let p = 0; p < f; p += 1) {
                let m = e.isElement ? Bt("swiper-slide", [n.slideBlankClass]) : Bt("div", [n.slideClass, n.slideBlankClass]);
                e.slidesEl.append(m)
            }
        };
    if (a) {
        if (n.loopAddBlankSlides) {
            let f = s - e.slides.length % s;
            c(f), e.recalcSlides(), e.updateSlides()
        } else Uo("Swiper Loop Warning: The number of slides is not even to slidesPerGroup, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");
        r()
    } else if (l) {
        if (n.loopAddBlankSlides) {
            let f = n.grid.rows - e.slides.length % n.grid.rows;
            c(f), e.recalcSlides(), e.updateSlides()
        } else Uo("Swiper Loop Warning: The number of slides is not even to grid.rows, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");
        r()
    } else r();
    e.loopFix({slideRealIndex: t, direction: n.centeredSlides ? void 0 : "next"})
}

function Sx(t) {
    let {
        slideRealIndex: e,
        slideTo: n = !0,
        direction: i,
        setTranslate: r,
        activeSlideIndex: o,
        byController: s,
        byMousewheel: a
    } = t === void 0 ? {} : t, l = this;
    if (!l.params.loop) return;
    l.emit("beforeLoopFix");
    let {slides: c, allowSlidePrev: f, allowSlideNext: p, slidesEl: m, params: g} = l, {centeredSlides: b} = g;
    if (l.allowSlidePrev = !0, l.allowSlideNext = !0, l.virtual && g.virtual.enabled) {
        n && (!g.centeredSlides && l.snapIndex === 0 ? l.slideTo(l.virtual.slides.length, 0, !1, !0) : g.centeredSlides && l.snapIndex < g.slidesPerView ? l.slideTo(l.virtual.slides.length + l.snapIndex, 0, !1, !0) : l.snapIndex === l.snapGrid.length - 1 && l.slideTo(l.virtual.slidesBefore, 0, !1, !0)), l.allowSlidePrev = f, l.allowSlideNext = p, l.emit("loopFix");
        return
    }
    let E = g.slidesPerView;
    E === "auto" ? E = l.slidesPerViewDynamic() : (E = Math.ceil(parseFloat(g.slidesPerView, 10)), b && E % 2 === 0 && (E = E + 1));
    let M = g.slidesPerGroupAuto ? E : g.slidesPerGroup, w = M;
    w % M !== 0 && (w += M - w % M), w += g.loopAdditionalSlides, l.loopedSlides = w;
    let S = l.grid && g.grid && g.grid.rows > 1;
    c.length < E + w ? Uo("Swiper Loop Warning: The number of slides is not enough for loop mode, it will be disabled and not function properly. You need to add more slides (or make duplicates) or lower the values of slidesPerView and slidesPerGroup parameters") : S && g.grid.fill === "row" && Uo("Swiper Loop Warning: Loop mode is not compatible with grid.fill = `row`");
    let C = [], I = [], O = l.activeIndex;
    typeof o > "u" ? o = l.getSlideIndex(c.filter(R => R.classList.contains(g.slideActiveClass))[0]) : O = o;
    let U = i === "next" || !i, de = i === "prev" || !i, L = 0, Ce = 0,
        A = S ? Math.ceil(c.length / g.grid.rows) : c.length,
        V = (S ? c[o].column : o) + (b && typeof r > "u" ? -E / 2 + .5 : 0);
    if (V < w) {
        L = Math.max(w - V, M);
        for (let R = 0; R < w - V; R += 1) {
            let le = R - Math.floor(R / A) * A;
            if (S) {
                let _e = A - le - 1;
                for (let F = c.length - 1; F >= 0; F -= 1) c[F].column === _e && C.push(F)
            } else C.push(A - le - 1)
        }
    } else if (V + E > A - w) {
        Ce = Math.max(V - (A - w * 2), M);
        for (let R = 0; R < Ce; R += 1) {
            let le = R - Math.floor(R / A) * A;
            S ? c.forEach((_e, F) => {
                _e.column === le && I.push(F)
            }) : I.push(le)
        }
    }
    if (l.__preventObserver__ = !0, requestAnimationFrame(() => {
        l.__preventObserver__ = !1
    }), de && C.forEach(R => {
        c[R].swiperLoopMoveDOM = !0, m.prepend(c[R]), c[R].swiperLoopMoveDOM = !1
    }), U && I.forEach(R => {
        c[R].swiperLoopMoveDOM = !0, m.append(c[R]), c[R].swiperLoopMoveDOM = !1
    }), l.recalcSlides(), g.slidesPerView === "auto" ? l.updateSlides() : S && (C.length > 0 && de || I.length > 0 && U) && l.slides.forEach((R, le) => {
        l.grid.updateSlide(le, R, l.slides)
    }), g.watchSlidesProgress && l.updateSlidesOffset(), n) {
        if (C.length > 0 && de) {
            if (typeof e > "u") {
                let R = l.slidesGrid[O], _e = l.slidesGrid[O + L] - R;
                a ? l.setTranslate(l.translate - _e) : (l.slideTo(O + Math.ceil(L), 0, !1, !0), r && (l.touchEventsData.startTranslate = l.touchEventsData.startTranslate - _e, l.touchEventsData.currentTranslate = l.touchEventsData.currentTranslate - _e))
            } else if (r) {
                let R = S ? C.length / g.grid.rows : C.length;
                l.slideTo(l.activeIndex + R, 0, !1, !0), l.touchEventsData.currentTranslate = l.translate
            }
        } else if (I.length > 0 && U) if (typeof e > "u") {
            let R = l.slidesGrid[O], _e = l.slidesGrid[O - Ce] - R;
            a ? l.setTranslate(l.translate - _e) : (l.slideTo(O - Ce, 0, !1, !0), r && (l.touchEventsData.startTranslate = l.touchEventsData.startTranslate - _e, l.touchEventsData.currentTranslate = l.touchEventsData.currentTranslate - _e))
        } else {
            let R = S ? I.length / g.grid.rows : I.length;
            l.slideTo(l.activeIndex - R, 0, !1, !0)
        }
    }
    if (l.allowSlidePrev = f, l.allowSlideNext = p, l.controller && l.controller.control && !s) {
        let R = {slideRealIndex: e, direction: i, setTranslate: r, activeSlideIndex: o, byController: !0};
        Array.isArray(l.controller.control) ? l.controller.control.forEach(le => {
            !le.destroyed && le.params.loop && le.loopFix(Se(k({}, R), {slideTo: le.params.slidesPerView === g.slidesPerView ? n : !1}))
        }) : l.controller.control instanceof l.constructor && l.controller.control.params.loop && l.controller.control.loopFix(Se(k({}, R), {slideTo: l.controller.control.params.slidesPerView === g.slidesPerView ? n : !1}))
    }
    l.emit("loopFix")
}

function Cx() {
    let t = this, {params: e, slidesEl: n} = t;
    if (!e.loop || t.virtual && t.params.virtual.enabled) return;
    t.recalcSlides();
    let i = [];
    t.slides.forEach(r => {
        let o = typeof r.swiperSlideIndex > "u" ? r.getAttribute("data-swiper-slide-index") * 1 : r.swiperSlideIndex;
        i[o] = r
    }), t.slides.forEach(r => {
        r.removeAttribute("data-swiper-slide-index")
    }), i.forEach(r => {
        n.append(r)
    }), t.recalcSlides(), t.slideTo(t.realIndex, 0)
}

var Dx = {loopCreate: Ex, loopFix: Sx, loopDestroy: Cx};

function Ix(t) {
    let e = this;
    if (!e.params.simulateTouch || e.params.watchOverflow && e.isLocked || e.params.cssMode) return;
    let n = e.params.touchEventsTarget === "container" ? e.el : e.wrapperEl;
    e.isElement && (e.__preventObserver__ = !0), n.style.cursor = "move", n.style.cursor = t ? "grabbing" : "grab", e.isElement && requestAnimationFrame(() => {
        e.__preventObserver__ = !1
    })
}

function Mx() {
    let t = this;
    t.params.watchOverflow && t.isLocked || t.params.cssMode || (t.isElement && (t.__preventObserver__ = !0), t[t.params.touchEventsTarget === "container" ? "el" : "wrapperEl"].style.cursor = "", t.isElement && requestAnimationFrame(() => {
        t.__preventObserver__ = !1
    }))
}

var _x = {setGrabCursor: Ix, unsetGrabCursor: Mx};

function Tx(t, e) {
    e === void 0 && (e = this);

    function n(i) {
        if (!i || i === at() || i === Fe()) return null;
        i.assignedSlot && (i = i.assignedSlot);
        let r = i.closest(t);
        return !r && !i.getRootNode ? null : r || n(i.getRootNode().host)
    }

    return n(e)
}

function Z0(t, e, n) {
    let i = Fe(), {params: r} = t, o = r.edgeSwipeDetection, s = r.edgeSwipeThreshold;
    return o && (n <= s || n >= i.innerWidth - s) ? o === "prevent" ? (e.preventDefault(), !0) : !1 : !0
}

function xx(t) {
    let e = this, n = at(), i = t;
    i.originalEvent && (i = i.originalEvent);
    let r = e.touchEventsData;
    if (i.type === "pointerdown") {
        if (r.pointerId !== null && r.pointerId !== i.pointerId) return;
        r.pointerId = i.pointerId
    } else i.type === "touchstart" && i.targetTouches.length === 1 && (r.touchId = i.targetTouches[0].identifier);
    if (i.type === "touchstart") {
        Z0(e, i, i.targetTouches[0].pageX);
        return
    }
    let {params: o, touches: s, enabled: a} = e;
    if (!a || !o.simulateTouch && i.pointerType === "mouse" || e.animating && o.preventInteractionOnTransition) return;
    !e.animating && o.cssMode && o.loop && e.loopFix();
    let l = i.target;
    if (o.touchEventsTarget === "wrapper" && !e.wrapperEl.contains(l) || "which" in i && i.which === 3 || "button" in i && i.button > 0 || r.isTouched && r.isMoved) return;
    let c = !!o.noSwipingClass && o.noSwipingClass !== "", f = i.composedPath ? i.composedPath() : i.path;
    c && i.target && i.target.shadowRoot && f && (l = f[0]);
    let p = o.noSwipingSelector ? o.noSwipingSelector : `.${o.noSwipingClass}`, m = !!(i.target && i.target.shadowRoot);
    if (o.noSwiping && (m ? Tx(p, l) : l.closest(p))) {
        e.allowClick = !0;
        return
    }
    if (o.swipeHandler && !l.closest(o.swipeHandler)) return;
    s.currentX = i.pageX, s.currentY = i.pageY;
    let g = s.currentX, b = s.currentY;
    if (!Z0(e, i, g)) return;
    Object.assign(r, {
        isTouched: !0,
        isMoved: !1,
        allowTouchCallbacks: !0,
        isScrolling: void 0,
        startMoving: void 0
    }), s.startX = g, s.startY = b, r.touchStartTime = xi(), e.allowClick = !0, e.updateSize(), e.swipeDirection = void 0, o.threshold > 0 && (r.allowThresholdMove = !1);
    let E = !0;
    l.matches(r.focusableElements) && (E = !1, l.nodeName === "SELECT" && (r.isTouched = !1)), n.activeElement && n.activeElement.matches(r.focusableElements) && n.activeElement !== l && n.activeElement.blur();
    let M = E && e.allowTouchMove && o.touchStartPreventDefault;
    (o.touchStartForcePreventDefault || M) && !l.isContentEditable && i.preventDefault(), o.freeMode && o.freeMode.enabled && e.freeMode && e.animating && !o.cssMode && e.freeMode.onTouchStart(), e.emit("touchStart", i)
}

function Ax(t) {
    let e = at(), n = this, i = n.touchEventsData, {params: r, touches: o, rtlTranslate: s, enabled: a} = n;
    if (!a || !r.simulateTouch && t.pointerType === "mouse") return;
    let l = t;
    if (l.originalEvent && (l = l.originalEvent), l.type === "pointermove" && (i.touchId !== null || l.pointerId !== i.pointerId)) return;
    let c;
    if (l.type === "touchmove") {
        if (c = [...l.changedTouches].filter(U => U.identifier === i.touchId)[0], !c || c.identifier !== i.touchId) return
    } else c = l;
    if (!i.isTouched) {
        i.startMoving && i.isScrolling && n.emit("touchMoveOpposite", l);
        return
    }
    let f = c.pageX, p = c.pageY;
    if (l.preventedByNestedSwiper) {
        o.startX = f, o.startY = p;
        return
    }
    if (!n.allowTouchMove) {
        l.target.matches(i.focusableElements) || (n.allowClick = !1), i.isTouched && (Object.assign(o, {
            startX: f,
            startY: p,
            currentX: f,
            currentY: p
        }), i.touchStartTime = xi());
        return
    }
    if (r.touchReleaseOnEdges && !r.loop) {
        if (n.isVertical()) {
            if (p < o.startY && n.translate <= n.maxTranslate() || p > o.startY && n.translate >= n.minTranslate()) {
                i.isTouched = !1, i.isMoved = !1;
                return
            }
        } else if (f < o.startX && n.translate <= n.maxTranslate() || f > o.startX && n.translate >= n.minTranslate()) return
    }
    if (e.activeElement && l.target === e.activeElement && l.target.matches(i.focusableElements)) {
        i.isMoved = !0, n.allowClick = !1;
        return
    }
    i.allowTouchCallbacks && n.emit("touchMove", l), o.previousX = o.currentX, o.previousY = o.currentY, o.currentX = f, o.currentY = p;
    let m = o.currentX - o.startX, g = o.currentY - o.startY;
    if (n.params.threshold && Math.sqrt(m ** 2 + g ** 2) < n.params.threshold) return;
    if (typeof i.isScrolling > "u") {
        let U;
        n.isHorizontal() && o.currentY === o.startY || n.isVertical() && o.currentX === o.startX ? i.isScrolling = !1 : m * m + g * g >= 25 && (U = Math.atan2(Math.abs(g), Math.abs(m)) * 180 / Math.PI, i.isScrolling = n.isHorizontal() ? U > r.touchAngle : 90 - U > r.touchAngle)
    }
    if (i.isScrolling && n.emit("touchMoveOpposite", l), typeof i.startMoving > "u" && (o.currentX !== o.startX || o.currentY !== o.startY) && (i.startMoving = !0), i.isScrolling) {
        i.isTouched = !1;
        return
    }
    if (!i.startMoving) return;
    n.allowClick = !1, !r.cssMode && l.cancelable && l.preventDefault(), r.touchMoveStopPropagation && !r.nested && l.stopPropagation();
    let b = n.isHorizontal() ? m : g, E = n.isHorizontal() ? o.currentX - o.previousX : o.currentY - o.previousY;
    r.oneWayMovement && (b = Math.abs(b) * (s ? 1 : -1), E = Math.abs(E) * (s ? 1 : -1)), o.diff = b, b *= r.touchRatio, s && (b = -b, E = -E);
    let M = n.touchesDirection;
    n.swipeDirection = b > 0 ? "prev" : "next", n.touchesDirection = E > 0 ? "prev" : "next";
    let w = n.params.loop && !r.cssMode,
        S = n.touchesDirection === "next" && n.allowSlideNext || n.touchesDirection === "prev" && n.allowSlidePrev;
    if (!i.isMoved) {
        if (w && S && n.loopFix({direction: n.swipeDirection}), i.startTranslate = n.getTranslate(), n.setTransition(0), n.animating) {
            let U = new window.CustomEvent("transitionend", {bubbles: !0, cancelable: !0});
            n.wrapperEl.dispatchEvent(U)
        }
        i.allowMomentumBounce = !1, r.grabCursor && (n.allowSlideNext === !0 || n.allowSlidePrev === !0) && n.setGrabCursor(!0), n.emit("sliderFirstMove", l)
    }
    let C;
    if (new Date().getTime(), i.isMoved && i.allowThresholdMove && M !== n.touchesDirection && w && S && Math.abs(b) >= 1) {
        Object.assign(o, {
            startX: f,
            startY: p,
            currentX: f,
            currentY: p,
            startTranslate: i.currentTranslate
        }), i.loopSwapReset = !0, i.startTranslate = i.currentTranslate;
        return
    }
    n.emit("sliderMove", l), i.isMoved = !0, i.currentTranslate = b + i.startTranslate;
    let I = !0, O = r.resistanceRatio;
    if (r.touchReleaseOnEdges && (O = 0), b > 0 ? (w && S && !C && i.allowThresholdMove && i.currentTranslate > (r.centeredSlides ? n.minTranslate() - n.slidesSizesGrid[n.activeIndex + 1] : n.minTranslate()) && n.loopFix({
        direction: "prev",
        setTranslate: !0,
        activeSlideIndex: 0
    }), i.currentTranslate > n.minTranslate() && (I = !1, r.resistance && (i.currentTranslate = n.minTranslate() - 1 + (-n.minTranslate() + i.startTranslate + b) ** O))) : b < 0 && (w && S && !C && i.allowThresholdMove && i.currentTranslate < (r.centeredSlides ? n.maxTranslate() + n.slidesSizesGrid[n.slidesSizesGrid.length - 1] : n.maxTranslate()) && n.loopFix({
        direction: "next",
        setTranslate: !0,
        activeSlideIndex: n.slides.length - (r.slidesPerView === "auto" ? n.slidesPerViewDynamic() : Math.ceil(parseFloat(r.slidesPerView, 10)))
    }), i.currentTranslate < n.maxTranslate() && (I = !1, r.resistance && (i.currentTranslate = n.maxTranslate() + 1 - (n.maxTranslate() - i.startTranslate - b) ** O))), I && (l.preventedByNestedSwiper = !0), !n.allowSlideNext && n.swipeDirection === "next" && i.currentTranslate < i.startTranslate && (i.currentTranslate = i.startTranslate), !n.allowSlidePrev && n.swipeDirection === "prev" && i.currentTranslate > i.startTranslate && (i.currentTranslate = i.startTranslate), !n.allowSlidePrev && !n.allowSlideNext && (i.currentTranslate = i.startTranslate), r.threshold > 0) if (Math.abs(b) > r.threshold || i.allowThresholdMove) {
        if (!i.allowThresholdMove) {
            i.allowThresholdMove = !0, o.startX = o.currentX, o.startY = o.currentY, i.currentTranslate = i.startTranslate, o.diff = n.isHorizontal() ? o.currentX - o.startX : o.currentY - o.startY;
            return
        }
    } else {
        i.currentTranslate = i.startTranslate;
        return
    }
    !r.followFinger || r.cssMode || ((r.freeMode && r.freeMode.enabled && n.freeMode || r.watchSlidesProgress) && (n.updateActiveIndex(), n.updateSlidesClasses()), r.freeMode && r.freeMode.enabled && n.freeMode && n.freeMode.onTouchMove(), n.updateProgress(i.currentTranslate), n.setTranslate(i.currentTranslate))
}

function Nx(t) {
    let e = this, n = e.touchEventsData, i = t;
    i.originalEvent && (i = i.originalEvent);
    let r;
    if (i.type === "touchend" || i.type === "touchcancel") {
        if (r = [...i.changedTouches].filter(O => O.identifier === n.touchId)[0], !r || r.identifier !== n.touchId) return
    } else {
        if (n.touchId !== null || i.pointerId !== n.pointerId) return;
        r = i
    }
    if (["pointercancel", "pointerout", "pointerleave", "contextmenu"].includes(i.type) && !(["pointercancel", "contextmenu"].includes(i.type) && (e.browser.isSafari || e.browser.isWebView))) return;
    n.pointerId = null, n.touchId = null;
    let {params: s, touches: a, rtlTranslate: l, slidesGrid: c, enabled: f} = e;
    if (!f || !s.simulateTouch && i.pointerType === "mouse") return;
    if (n.allowTouchCallbacks && e.emit("touchEnd", i), n.allowTouchCallbacks = !1, !n.isTouched) {
        n.isMoved && s.grabCursor && e.setGrabCursor(!1), n.isMoved = !1, n.startMoving = !1;
        return
    }
    s.grabCursor && n.isMoved && n.isTouched && (e.allowSlideNext === !0 || e.allowSlidePrev === !0) && e.setGrabCursor(!1);
    let p = xi(), m = p - n.touchStartTime;
    if (e.allowClick) {
        let O = i.path || i.composedPath && i.composedPath();
        e.updateClickedSlide(O && O[0] || i.target, O), e.emit("tap click", i), m < 300 && p - n.lastClickTime < 300 && e.emit("doubleTap doubleClick", i)
    }
    if (n.lastClickTime = xi(), Ti(() => {
        e.destroyed || (e.allowClick = !0)
    }), !n.isTouched || !n.isMoved || !e.swipeDirection || a.diff === 0 && !n.loopSwapReset || n.currentTranslate === n.startTranslate && !n.loopSwapReset) {
        n.isTouched = !1, n.isMoved = !1, n.startMoving = !1;
        return
    }
    n.isTouched = !1, n.isMoved = !1, n.startMoving = !1;
    let g;
    if (s.followFinger ? g = l ? e.translate : -e.translate : g = -n.currentTranslate, s.cssMode) return;
    if (s.freeMode && s.freeMode.enabled) {
        e.freeMode.onTouchEnd({currentPos: g});
        return
    }
    let b = g >= -e.maxTranslate() && !e.params.loop, E = 0, M = e.slidesSizesGrid[0];
    for (let O = 0; O < c.length; O += O < s.slidesPerGroupSkip ? 1 : s.slidesPerGroup) {
        let U = O < s.slidesPerGroupSkip - 1 ? 1 : s.slidesPerGroup;
        typeof c[O + U] < "u" ? (b || g >= c[O] && g < c[O + U]) && (E = O, M = c[O + U] - c[O]) : (b || g >= c[O]) && (E = O, M = c[c.length - 1] - c[c.length - 2])
    }
    let w = null, S = null;
    s.rewind && (e.isBeginning ? S = s.virtual && s.virtual.enabled && e.virtual ? e.virtual.slides.length - 1 : e.slides.length - 1 : e.isEnd && (w = 0));
    let C = (g - c[E]) / M, I = E < s.slidesPerGroupSkip - 1 ? 1 : s.slidesPerGroup;
    if (m > s.longSwipesMs) {
        if (!s.longSwipes) {
            e.slideTo(e.activeIndex);
            return
        }
        e.swipeDirection === "next" && (C >= s.longSwipesRatio ? e.slideTo(s.rewind && e.isEnd ? w : E + I) : e.slideTo(E)), e.swipeDirection === "prev" && (C > 1 - s.longSwipesRatio ? e.slideTo(E + I) : S !== null && C < 0 && Math.abs(C) > s.longSwipesRatio ? e.slideTo(S) : e.slideTo(E))
    } else {
        if (!s.shortSwipes) {
            e.slideTo(e.activeIndex);
            return
        }
        e.navigation && (i.target === e.navigation.nextEl || i.target === e.navigation.prevEl) ? i.target === e.navigation.nextEl ? e.slideTo(E + I) : e.slideTo(E) : (e.swipeDirection === "next" && e.slideTo(w !== null ? w : E + I), e.swipeDirection === "prev" && e.slideTo(S !== null ? S : E))
    }
}

function J0() {
    let t = this, {params: e, el: n} = t;
    if (n && n.offsetWidth === 0) return;
    e.breakpoints && t.setBreakpoint();
    let {allowSlideNext: i, allowSlidePrev: r, snapGrid: o} = t, s = t.virtual && t.params.virtual.enabled;
    t.allowSlideNext = !0, t.allowSlidePrev = !0, t.updateSize(), t.updateSlides(), t.updateSlidesClasses();
    let a = s && e.loop;
    (e.slidesPerView === "auto" || e.slidesPerView > 1) && t.isEnd && !t.isBeginning && !t.params.centeredSlides && !a ? t.slideTo(t.slides.length - 1, 0, !1, !0) : t.params.loop && !s ? t.slideToLoop(t.realIndex, 0, !1, !0) : t.slideTo(t.activeIndex, 0, !1, !0), t.autoplay && t.autoplay.running && t.autoplay.paused && (clearTimeout(t.autoplay.resizeTimeout), t.autoplay.resizeTimeout = setTimeout(() => {
        t.autoplay && t.autoplay.running && t.autoplay.paused && t.autoplay.resume()
    }, 500)), t.allowSlidePrev = r, t.allowSlideNext = i, t.params.watchOverflow && o !== t.snapGrid && t.checkOverflow()
}

function Ox(t) {
    let e = this;
    e.enabled && (e.allowClick || (e.params.preventClicks && t.preventDefault(), e.params.preventClicksPropagation && e.animating && (t.stopPropagation(), t.stopImmediatePropagation())))
}

function Px() {
    let t = this, {wrapperEl: e, rtlTranslate: n, enabled: i} = t;
    if (!i) return;
    t.previousTranslate = t.translate, t.isHorizontal() ? t.translate = -e.scrollLeft : t.translate = -e.scrollTop, t.translate === 0 && (t.translate = 0), t.updateActiveIndex(), t.updateSlidesClasses();
    let r, o = t.maxTranslate() - t.minTranslate();
    o === 0 ? r = 0 : r = (t.translate - t.minTranslate()) / o, r !== t.progress && t.updateProgress(n ? -t.translate : t.translate), t.emit("setTranslate", t.translate, !1)
}

function kx(t) {
    let e = this;
    hl(e, t.target), !(e.params.cssMode || e.params.slidesPerView !== "auto" && !e.params.autoHeight) && e.update()
}

function Fx() {
    let t = this;
    t.documentTouchHandlerProceeded || (t.documentTouchHandlerProceeded = !0, t.params.touchReleaseOnEdges && (t.el.style.touchAction = "auto"))
}

var oy = (t, e) => {
    let n = at(), {params: i, el: r, wrapperEl: o, device: s} = t, a = !!i.nested,
        l = e === "on" ? "addEventListener" : "removeEventListener", c = e;
    n[l]("touchstart", t.onDocumentTouchStart, {
        passive: !1,
        capture: a
    }), r[l]("touchstart", t.onTouchStart, {passive: !1}), r[l]("pointerdown", t.onTouchStart, {passive: !1}), n[l]("touchmove", t.onTouchMove, {
        passive: !1,
        capture: a
    }), n[l]("pointermove", t.onTouchMove, {
        passive: !1,
        capture: a
    }), n[l]("touchend", t.onTouchEnd, {passive: !0}), n[l]("pointerup", t.onTouchEnd, {passive: !0}), n[l]("pointercancel", t.onTouchEnd, {passive: !0}), n[l]("touchcancel", t.onTouchEnd, {passive: !0}), n[l]("pointerout", t.onTouchEnd, {passive: !0}), n[l]("pointerleave", t.onTouchEnd, {passive: !0}), n[l]("contextmenu", t.onTouchEnd, {passive: !0}), (i.preventClicks || i.preventClicksPropagation) && r[l]("click", t.onClick, !0), i.cssMode && o[l]("scroll", t.onScroll), i.updateOnWindowResize ? t[c](s.ios || s.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", J0, !0) : t[c]("observerUpdate", J0, !0), r[l]("load", t.onLoad, {capture: !0})
};

function Rx() {
    let t = this, {params: e} = t;
    t.onTouchStart = xx.bind(t), t.onTouchMove = Ax.bind(t), t.onTouchEnd = Nx.bind(t), t.onDocumentTouchStart = Fx.bind(t), e.cssMode && (t.onScroll = Px.bind(t)), t.onClick = Ox.bind(t), t.onLoad = kx.bind(t), oy(t, "on")
}

function Lx() {
    oy(this, "off")
}

var Vx = {attachEvents: Rx, detachEvents: Lx}, ey = (t, e) => t.grid && e.grid && e.grid.rows > 1;

function jx() {
    let t = this, {realIndex: e, initialized: n, params: i, el: r} = t, o = i.breakpoints;
    if (!o || o && Object.keys(o).length === 0) return;
    let s = t.getBreakpoint(o, t.params.breakpointsBase, t.el);
    if (!s || t.currentBreakpoint === s) return;
    let l = (s in o ? o[s] : void 0) || t.originalParams, c = ey(t, i), f = ey(t, l), p = t.params.grabCursor,
        m = l.grabCursor, g = i.enabled;
    c && !f ? (r.classList.remove(`${i.containerModifierClass}grid`, `${i.containerModifierClass}grid-column`), t.emitContainerClasses()) : !c && f && (r.classList.add(`${i.containerModifierClass}grid`), (l.grid.fill && l.grid.fill === "column" || !l.grid.fill && i.grid.fill === "column") && r.classList.add(`${i.containerModifierClass}grid-column`), t.emitContainerClasses()), p && !m ? t.unsetGrabCursor() : !p && m && t.setGrabCursor(), ["navigation", "pagination", "scrollbar"].forEach(C => {
        if (typeof l[C] > "u") return;
        let I = i[C] && i[C].enabled, O = l[C] && l[C].enabled;
        I && !O && t[C].disable(), !I && O && t[C].enable()
    });
    let b = l.direction && l.direction !== i.direction, E = i.loop && (l.slidesPerView !== i.slidesPerView || b),
        M = i.loop;
    b && n && t.changeDirection(), dt(t.params, l);
    let w = t.params.enabled, S = t.params.loop;
    Object.assign(t, {
        allowTouchMove: t.params.allowTouchMove,
        allowSlideNext: t.params.allowSlideNext,
        allowSlidePrev: t.params.allowSlidePrev
    }), g && !w ? t.disable() : !g && w && t.enable(), t.currentBreakpoint = s, t.emit("_beforeBreakpoint", l), n && (E ? (t.loopDestroy(), t.loopCreate(e), t.updateSlides()) : !M && S ? (t.loopCreate(e), t.updateSlides()) : M && !S && t.loopDestroy()), t.emit("breakpoint", l)
}

function $x(t, e, n) {
    if (e === void 0 && (e = "window"), !t || e === "container" && !n) return;
    let i = !1, r = Fe(), o = e === "window" ? r.innerHeight : n.clientHeight, s = Object.keys(t).map(a => {
        if (typeof a == "string" && a.indexOf("@") === 0) {
            let l = parseFloat(a.substr(1));
            return {value: o * l, point: a}
        }
        return {value: a, point: a}
    });
    s.sort((a, l) => parseInt(a.value, 10) - parseInt(l.value, 10));
    for (let a = 0; a < s.length; a += 1) {
        let {point: l, value: c} = s[a];
        e === "window" ? r.matchMedia(`(min-width: ${c}px)`).matches && (i = l) : c <= n.clientWidth && (i = l)
    }
    return i || "max"
}

var Bx = {setBreakpoint: jx, getBreakpoint: $x};

function Hx(t, e) {
    let n = [];
    return t.forEach(i => {
        typeof i == "object" ? Object.keys(i).forEach(r => {
            i[r] && n.push(e + r)
        }) : typeof i == "string" && n.push(e + i)
    }), n
}

function Ux() {
    let t = this, {classNames: e, params: n, rtl: i, el: r, device: o} = t,
        s = Hx(["initialized", n.direction, {"free-mode": t.params.freeMode && n.freeMode.enabled}, {autoheight: n.autoHeight}, {rtl: i}, {grid: n.grid && n.grid.rows > 1}, {"grid-column": n.grid && n.grid.rows > 1 && n.grid.fill === "column"}, {android: o.android}, {ios: o.ios}, {"css-mode": n.cssMode}, {centered: n.cssMode && n.centeredSlides}, {"watch-progress": n.watchSlidesProgress}], n.containerModifierClass);
    e.push(...s), r.classList.add(...e), t.emitContainerClasses()
}

function zx() {
    let t = this, {el: e, classNames: n} = t;
    e.classList.remove(...n), t.emitContainerClasses()
}

var Gx = {addClasses: Ux, removeClasses: zx};

function qx() {
    let t = this, {isLocked: e, params: n} = t, {slidesOffsetBefore: i} = n;
    if (i) {
        let r = t.slides.length - 1, o = t.slidesGrid[r] + t.slidesSizesGrid[r] + i * 2;
        t.isLocked = t.size > o
    } else t.isLocked = t.snapGrid.length === 1;
    n.allowSlideNext === !0 && (t.allowSlideNext = !t.isLocked), n.allowSlidePrev === !0 && (t.allowSlidePrev = !t.isLocked), e && e !== t.isLocked && (t.isEnd = !1), e !== t.isLocked && t.emit(t.isLocked ? "lock" : "unlock")
}

var Wx = {checkOverflow: qx}, ty = {
    init: !0,
    direction: "horizontal",
    oneWayMovement: !1,
    swiperElementNodeName: "SWIPER-CONTAINER",
    touchEventsTarget: "wrapper",
    initialSlide: 0,
    speed: 300,
    cssMode: !1,
    updateOnWindowResize: !0,
    resizeObserver: !0,
    nested: !1,
    createElements: !1,
    eventsPrefix: "swiper",
    enabled: !0,
    focusableElements: "input, select, option, textarea, button, video, label",
    width: null,
    height: null,
    preventInteractionOnTransition: !1,
    userAgent: null,
    url: null,
    edgeSwipeDetection: !1,
    edgeSwipeThreshold: 20,
    autoHeight: !1,
    setWrapperSize: !1,
    virtualTranslate: !1,
    effect: "slide",
    breakpoints: void 0,
    breakpointsBase: "window",
    spaceBetween: 0,
    slidesPerView: 1,
    slidesPerGroup: 1,
    slidesPerGroupSkip: 0,
    slidesPerGroupAuto: !1,
    centeredSlides: !1,
    centeredSlidesBounds: !1,
    slidesOffsetBefore: 0,
    slidesOffsetAfter: 0,
    normalizeSlideIndex: !0,
    centerInsufficientSlides: !1,
    watchOverflow: !0,
    roundLengths: !1,
    touchRatio: 1,
    touchAngle: 45,
    simulateTouch: !0,
    shortSwipes: !0,
    longSwipes: !0,
    longSwipesRatio: .5,
    longSwipesMs: 300,
    followFinger: !0,
    allowTouchMove: !0,
    threshold: 5,
    touchMoveStopPropagation: !1,
    touchStartPreventDefault: !0,
    touchStartForcePreventDefault: !1,
    touchReleaseOnEdges: !1,
    uniqueNavElements: !0,
    resistance: !0,
    resistanceRatio: .85,
    watchSlidesProgress: !1,
    grabCursor: !1,
    preventClicks: !0,
    preventClicksPropagation: !0,
    slideToClickedSlide: !1,
    loop: !1,
    loopAddBlankSlides: !0,
    loopAdditionalSlides: 0,
    loopPreventsSliding: !0,
    rewind: !1,
    allowSlidePrev: !0,
    allowSlideNext: !0,
    swipeHandler: null,
    noSwiping: !0,
    noSwipingClass: "swiper-no-swiping",
    noSwipingSelector: null,
    passiveListeners: !0,
    maxBackfaceHiddenSlides: 10,
    containerModifierClass: "swiper-",
    slideClass: "swiper-slide",
    slideBlankClass: "swiper-slide-blank",
    slideActiveClass: "swiper-slide-active",
    slideVisibleClass: "swiper-slide-visible",
    slideFullyVisibleClass: "swiper-slide-fully-visible",
    slideNextClass: "swiper-slide-next",
    slidePrevClass: "swiper-slide-prev",
    wrapperClass: "swiper-wrapper",
    lazyPreloaderClass: "swiper-lazy-preloader",
    lazyPreloadPrevNext: 0,
    runCallbacksOnInit: !0,
    _emitClasses: !1
};

function Yx(t, e) {
    return function (i) {
        i === void 0 && (i = {});
        let r = Object.keys(i)[0], o = i[r];
        if (typeof o != "object" || o === null) {
            dt(e, i);
            return
        }
        if (t[r] === !0 && (t[r] = {enabled: !0}), r === "navigation" && t[r] && t[r].enabled && !t[r].prevEl && !t[r].nextEl && (t[r].auto = !0), ["pagination", "scrollbar"].indexOf(r) >= 0 && t[r] && t[r].enabled && !t[r].el && (t[r].auto = !0), !(r in t && "enabled" in o)) {
            dt(e, i);
            return
        }
        typeof t[r] == "object" && !("enabled" in t[r]) && (t[r].enabled = !0), t[r] || (t[r] = {enabled: !1}), dt(e, i)
    }
}

var Xf = {
    eventsEmitter: GT,
    update: nx,
    translate: lx,
    transition: fx,
    slide: bx,
    loop: Dx,
    grabCursor: _x,
    events: Vx,
    breakpoints: Bx,
    checkOverflow: Wx,
    classes: Gx
}, Kf = {}, He = class t {
    constructor() {
        let e, n;
        for (var i = arguments.length, r = new Array(i), o = 0; o < i; o++) r[o] = arguments[o];
        r.length === 1 && r[0].constructor && Object.prototype.toString.call(r[0]).slice(8, -1) === "Object" ? n = r[0] : [e, n] = r, n || (n = {}), n = dt({}, n), e && !n.el && (n.el = e);
        let s = at();
        if (n.el && typeof n.el == "string" && s.querySelectorAll(n.el).length > 1) {
            let f = [];
            return s.querySelectorAll(n.el).forEach(p => {
                let m = dt({}, n, {el: p});
                f.push(new t(m))
            }), f
        }
        let a = this;
        a.__swiper__ = !0, a.support = ny(), a.device = iy({userAgent: n.userAgent}), a.browser = HT(), a.eventsListeners = {}, a.eventsAnyListeners = [], a.modules = [...a.__modules__], n.modules && Array.isArray(n.modules) && a.modules.push(...n.modules);
        let l = {};
        a.modules.forEach(f => {
            f({
                params: n,
                swiper: a,
                extendParams: Yx(n, l),
                on: a.on.bind(a),
                once: a.once.bind(a),
                off: a.off.bind(a),
                emit: a.emit.bind(a)
            })
        });
        let c = dt({}, ty, l);
        return a.params = dt({}, c, Kf, n), a.originalParams = dt({}, a.params), a.passedParams = dt({}, n), a.params && a.params.on && Object.keys(a.params.on).forEach(f => {
            a.on(f, a.params.on[f])
        }), a.params && a.params.onAny && a.onAny(a.params.onAny), Object.assign(a, {
            enabled: a.params.enabled,
            el: e,
            classNames: [],
            slides: [],
            slidesGrid: [],
            snapGrid: [],
            slidesSizesGrid: [],
            isHorizontal() {
                return a.params.direction === "horizontal"
            },
            isVertical() {
                return a.params.direction === "vertical"
            },
            activeIndex: 0,
            realIndex: 0,
            isBeginning: !0,
            isEnd: !1,
            translate: 0,
            previousTranslate: 0,
            progress: 0,
            velocity: 0,
            animating: !1,
            cssOverflowAdjustment() {
                return Math.trunc(this.translate / 2 ** 23) * 2 ** 23
            },
            allowSlideNext: a.params.allowSlideNext,
            allowSlidePrev: a.params.allowSlidePrev,
            touchEventsData: {
                isTouched: void 0,
                isMoved: void 0,
                allowTouchCallbacks: void 0,
                touchStartTime: void 0,
                isScrolling: void 0,
                currentTranslate: void 0,
                startTranslate: void 0,
                allowThresholdMove: void 0,
                focusableElements: a.params.focusableElements,
                lastClickTime: 0,
                clickTimeout: void 0,
                velocities: [],
                allowMomentumBounce: void 0,
                startMoving: void 0,
                pointerId: null,
                touchId: null
            },
            allowClick: !0,
            allowTouchMove: a.params.allowTouchMove,
            touches: {startX: 0, startY: 0, currentX: 0, currentY: 0, diff: 0},
            imagesToLoad: [],
            imagesLoaded: 0
        }), a.emit("_swiper"), a.params.init && a.init(), a
    }

    getDirectionLabel(e) {
        return this.isHorizontal() ? e : {
            width: "height",
            "margin-top": "margin-left",
            "margin-bottom ": "margin-right",
            "margin-left": "margin-top",
            "margin-right": "margin-bottom",
            "padding-left": "padding-top",
            "padding-right": "padding-bottom",
            marginRight: "marginBottom"
        }[e]
    }

    getSlideIndex(e) {
        let {slidesEl: n, params: i} = this, r = We(n, `.${i.slideClass}, swiper-slide`), o = Ai(r[0]);
        return Ai(e) - o
    }

    getSlideIndexByData(e) {
        return this.getSlideIndex(this.slides.filter(n => n.getAttribute("data-swiper-slide-index") * 1 === e)[0])
    }

    recalcSlides() {
        let e = this, {slidesEl: n, params: i} = e;
        e.slides = We(n, `.${i.slideClass}, swiper-slide`)
    }

    enable() {
        let e = this;
        e.enabled || (e.enabled = !0, e.params.grabCursor && e.setGrabCursor(), e.emit("enable"))
    }

    disable() {
        let e = this;
        e.enabled && (e.enabled = !1, e.params.grabCursor && e.unsetGrabCursor(), e.emit("disable"))
    }

    setProgress(e, n) {
        let i = this;
        e = Math.min(Math.max(e, 0), 1);
        let r = i.minTranslate(), s = (i.maxTranslate() - r) * e + r;
        i.translateTo(s, typeof n > "u" ? 0 : n), i.updateActiveIndex(), i.updateSlidesClasses()
    }

    emitContainerClasses() {
        let e = this;
        if (!e.params._emitClasses || !e.el) return;
        let n = e.el.className.split(" ").filter(i => i.indexOf("swiper") === 0 || i.indexOf(e.params.containerModifierClass) === 0);
        e.emit("_containerClasses", n.join(" "))
    }

    getSlideClasses(e) {
        let n = this;
        return n.destroyed ? "" : e.className.split(" ").filter(i => i.indexOf("swiper-slide") === 0 || i.indexOf(n.params.slideClass) === 0).join(" ")
    }

    emitSlidesClasses() {
        let e = this;
        if (!e.params._emitClasses || !e.el) return;
        let n = [];
        e.slides.forEach(i => {
            let r = e.getSlideClasses(i);
            n.push({slideEl: i, classNames: r}), e.emit("_slideClass", i, r)
        }), e.emit("_slideClasses", n)
    }

    slidesPerViewDynamic(e, n) {
        e === void 0 && (e = "current"), n === void 0 && (n = !1);
        let i = this, {params: r, slides: o, slidesGrid: s, slidesSizesGrid: a, size: l, activeIndex: c} = i, f = 1;
        if (typeof r.slidesPerView == "number") return r.slidesPerView;
        if (r.centeredSlides) {
            let p = o[c] ? Math.ceil(o[c].swiperSlideSize) : 0, m;
            for (let g = c + 1; g < o.length; g += 1) o[g] && !m && (p += Math.ceil(o[g].swiperSlideSize), f += 1, p > l && (m = !0));
            for (let g = c - 1; g >= 0; g -= 1) o[g] && !m && (p += o[g].swiperSlideSize, f += 1, p > l && (m = !0))
        } else if (e === "current") for (let p = c + 1; p < o.length; p += 1) (n ? s[p] + a[p] - s[c] < l : s[p] - s[c] < l) && (f += 1); else for (let p = c - 1; p >= 0; p -= 1) s[c] - s[p] < l && (f += 1);
        return f
    }

    update() {
        let e = this;
        if (!e || e.destroyed) return;
        let {snapGrid: n, params: i} = e;
        i.breakpoints && e.setBreakpoint(), [...e.el.querySelectorAll('[loading="lazy"]')].forEach(s => {
            s.complete && hl(e, s)
        }), e.updateSize(), e.updateSlides(), e.updateProgress(), e.updateSlidesClasses();

        function r() {
            let s = e.rtlTranslate ? e.translate * -1 : e.translate,
                a = Math.min(Math.max(s, e.maxTranslate()), e.minTranslate());
            e.setTranslate(a), e.updateActiveIndex(), e.updateSlidesClasses()
        }

        let o;
        if (i.freeMode && i.freeMode.enabled && !i.cssMode) r(), i.autoHeight && e.updateAutoHeight(); else {
            if ((i.slidesPerView === "auto" || i.slidesPerView > 1) && e.isEnd && !i.centeredSlides) {
                let s = e.virtual && i.virtual.enabled ? e.virtual.slides : e.slides;
                o = e.slideTo(s.length - 1, 0, !1, !0)
            } else o = e.slideTo(e.activeIndex, 0, !1, !0);
            o || r()
        }
        i.watchOverflow && n !== e.snapGrid && e.checkOverflow(), e.emit("update")
    }

    changeDirection(e, n) {
        n === void 0 && (n = !0);
        let i = this, r = i.params.direction;
        return e || (e = r === "horizontal" ? "vertical" : "horizontal"), e === r || e !== "horizontal" && e !== "vertical" || (i.el.classList.remove(`${i.params.containerModifierClass}${r}`), i.el.classList.add(`${i.params.containerModifierClass}${e}`), i.emitContainerClasses(), i.params.direction = e, i.slides.forEach(o => {
            e === "vertical" ? o.style.width = "" : o.style.height = ""
        }), i.emit("changeDirection"), n && i.update()), i
    }

    changeLanguageDirection(e) {
        let n = this;
        n.rtl && e === "rtl" || !n.rtl && e === "ltr" || (n.rtl = e === "rtl", n.rtlTranslate = n.params.direction === "horizontal" && n.rtl, n.rtl ? (n.el.classList.add(`${n.params.containerModifierClass}rtl`), n.el.dir = "rtl") : (n.el.classList.remove(`${n.params.containerModifierClass}rtl`), n.el.dir = "ltr"), n.update())
    }

    mount(e) {
        let n = this;
        if (n.mounted) return !0;
        let i = e || n.params.el;
        if (typeof i == "string" && (i = document.querySelector(i)), !i) return !1;
        i.swiper = n, i.parentNode && i.parentNode.host && i.parentNode.host.nodeName === n.params.swiperElementNodeName.toUpperCase() && (n.isElement = !0);
        let r = () => `.${(n.params.wrapperClass || "").trim().split(" ").join(".")}`,
            s = i && i.shadowRoot && i.shadowRoot.querySelector ? i.shadowRoot.querySelector(r()) : We(i, r())[0];
        return !s && n.params.createElements && (s = Bt("div", n.params.wrapperClass), i.append(s), We(i, `.${n.params.slideClass}`).forEach(a => {
            s.append(a)
        })), Object.assign(n, {
            el: i,
            wrapperEl: s,
            slidesEl: n.isElement && !i.parentNode.host.slideSlots ? i.parentNode.host : s,
            hostEl: n.isElement ? i.parentNode.host : i,
            mounted: !0,
            rtl: i.dir.toLowerCase() === "rtl" || In(i, "direction") === "rtl",
            rtlTranslate: n.params.direction === "horizontal" && (i.dir.toLowerCase() === "rtl" || In(i, "direction") === "rtl"),
            wrongRTL: In(s, "display") === "-webkit-box"
        }), !0
    }

    init(e) {
        let n = this;
        if (n.initialized || n.mount(e) === !1) return n;
        n.emit("beforeInit"), n.params.breakpoints && n.setBreakpoint(), n.addClasses(), n.updateSize(), n.updateSlides(), n.params.watchOverflow && n.checkOverflow(), n.params.grabCursor && n.enabled && n.setGrabCursor(), n.params.loop && n.virtual && n.params.virtual.enabled ? n.slideTo(n.params.initialSlide + n.virtual.slidesBefore, 0, n.params.runCallbacksOnInit, !1, !0) : n.slideTo(n.params.initialSlide, 0, n.params.runCallbacksOnInit, !1, !0), n.params.loop && n.loopCreate(), n.attachEvents();
        let r = [...n.el.querySelectorAll('[loading="lazy"]')];
        return n.isElement && r.push(...n.hostEl.querySelectorAll('[loading="lazy"]')), r.forEach(o => {
            o.complete ? hl(n, o) : o.addEventListener("load", s => {
                hl(n, s.target)
            })
        }), Zf(n), n.initialized = !0, Zf(n), n.emit("init"), n.emit("afterInit"), n
    }

    destroy(e, n) {
        e === void 0 && (e = !0), n === void 0 && (n = !0);
        let i = this, {params: r, el: o, wrapperEl: s, slides: a} = i;
        return typeof i.params > "u" || i.destroyed || (i.emit("beforeDestroy"), i.initialized = !1, i.detachEvents(), r.loop && i.loopDestroy(), n && (i.removeClasses(), o.removeAttribute("style"), s.removeAttribute("style"), a && a.length && a.forEach(l => {
            l.classList.remove(r.slideVisibleClass, r.slideFullyVisibleClass, r.slideActiveClass, r.slideNextClass, r.slidePrevClass), l.removeAttribute("style"), l.removeAttribute("data-swiper-slide-index")
        })), i.emit("destroy"), Object.keys(i.eventsListeners).forEach(l => {
            i.off(l)
        }), e !== !1 && (i.el.swiper = null, Q0(i)), i.destroyed = !0), null
    }

    static extendDefaults(e) {
        dt(Kf, e)
    }

    static get extendedDefaults() {
        return Kf
    }

    static get defaults() {
        return ty
    }

    static installModule(e) {
        t.prototype.__modules__ || (t.prototype.__modules__ = []);
        let n = t.prototype.__modules__;
        typeof e == "function" && n.indexOf(e) < 0 && n.push(e)
    }

    static use(e) {
        return Array.isArray(e) ? (e.forEach(n => t.installModule(n)), t) : (t.installModule(e), t)
    }
};
Object.keys(Xf).forEach(t => {
    Object.keys(Xf[t]).forEach(e => {
        He.prototype[e] = Xf[t][e]
    })
});
He.use([UT, zT]);

function Qx(t, e) {
    if (t & 1 && (u(0, "div", 10)(1, "div", 11), v(2, "img", 12), d()()), t & 2) {
        let n = e.$implicit;
        y(2), D("src", n, pe)
    }
}

var sy = (() => {
    let e = class e {
        constructor() {
            this.brands = ["./assets/brand_img01.png", "./assets/brand_img02.png", "./assets/brand_img03.png", "./assets/brand_img04.png", "./assets/brand_img05.png", "./assets/brand_img06.png", "./assets/brand_img07.png", "./assets/brand_img04.png"]
        }

        ngOnInit() {
            new He(".brand-active2", {
                slidesPerView: 5,
                spaceBetween: 0,
                loop: !1,
                breakpoints: {
                    1200: {slidesPerView: 5},
                    992: {slidesPerView: 4},
                    768: {slidesPerView: 3},
                    576: {slidesPerView: 2},
                    0: {slidesPerView: 2}
                }
            })
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275cmp = T({
        type: e,
        selectors: [["app-brand-one"]],
        standalone: !0,
        features: [x],
        decls: 11,
        vars: 1,
        consts: [[1, "brand-area2"], [1, "container"], [1, "row", "g-0"], [1, "col-lg-12"], [1, "brand-title", "text-center"], [1, "title"], [1, "brand-item-wrap", "style2"], [1, "row", "g-0", "brand-active2", "swiper"], [1, "swiper-wrapper", "p-0"], ["class", "col-12 swiper-slide", 4, "ngFor", "ngForOf"], [1, "col-12", "swiper-slide"], [1, "brand-item"], ["alt", "brand-logo", 3, "src"]],
        template: function (r, o) {
            r & 1 && (u(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div", 4)(5, "h6", 5), h(6, "Our top Partner"), d()()()(), u(7, "div", 6)(8, "div", 7)(9, "div", 8), Y(10, Qx, 3, 1, "div", 9), d()()()()()), r & 2 && (y(10), D("ngForOf", o.brands))
        },
        dependencies: [H, we]
    });
    let t = e;
    return t
})();
var Xx = t => ({width: t});

function Kx(t, e) {
    if (t & 1 && (u(0, "li")(1, "h6", 23), h(2), d(), u(3, "p", 24), h(4), d(), u(5, "div", 25)(6, "div", 26), v(7, "div", 27), d(), u(8, "div", 28)(9, "span"), h(10), d(), u(11, "span"), h(12), d()()()()), t & 2) {
        let n = e.$implicit;
        y(2), $(n.title), y(2), $(n.subtitle), y(3), D("ngStyle", bn(5, Xx, n.width + "%")), y(3), $(n.value.min), y(2), $(n.value.max)
    }
}

function Zx(t, e) {
    if (t & 1 && (u(0, "p", 34), h(1), d()), t & 2) {
        let n = Je().$implicit;
        y(), $(n.text2)
    }
}

function Jx(t, e) {
    if (t & 1 && (u(0, "div", 29)(1, "div", 30), v(2, "img", 31), d(), u(3, "div", 32)(4, "h4", 33), h(5), d(), u(6, "p", 34), h(7), d(), Y(8, Zx, 2, 1, "p", 35), d()()), t & 2) {
        let n = e.$implicit;
        y(2), D("src", n.icon, pe), y(3), $(n.title), y(2), $(n.text), y(), D("ngIf", n.text2)
    }
}

var ay = (() => {
    let e = class e {
        constructor() {
            this.progress_items = [{
                title: "Expected FOX price",
                subtitle: "0.36 $",
                width: 70,
                value: {min: "100 $", max: "100,000 $"}
            }, {
                title: "Expected FOX price",
                subtitle: "0.36 $",
                width: 80,
                value: {min: "100 $", max: "100,000 $"}
            }, {
                title: "Calculation time",
                subtitle: "Q3 2020",
                width: 40,
                value: {min: "100 $", max: "100,000 $"}
            }], this.feature_data = [{
                icon: "./assets/feature-icon1-1.svg",
                title: "The expected value of your investment",
                text: "180,000 $",
                text2: "ROI = 360 %"
            }, {
                icon: "./assets/feature-icon1-2.svg",
                title: "Expected monthly dividend",
                text: "3600 FOX = 1296 $"
            }, {
                icon: "./assets/feature-icon1-3.svg",
                title: "Masternode bonus",
                text: "180,000 $",
                text2: "ROI = 360 %"
            }]
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275cmp = T({
        type: e,
        selectors: [["app-why-choose-one"]],
        standalone: !0,
        features: [x],
        decls: 34,
        vars: 2,
        consts: [["id", "feature", 1, "wcu-area-1", "pt-130", "pb-140", "position-relative"], [1, "bg-gradient-1"], ["src", "./assets/bg-gradient1-1.jpg", "alt", "img"], [1, "container"], [1, "mb-25"], [1, "row", "gy-5"], [1, "col-lg-7"], [1, "section-title", "mb-0"], [1, "title", "style2"], [1, "sec-text"], [1, "col-lg-5"], [1, "wcu-thumb", "text-center", "alltuchtopdown"], ["src", "./assets/why_1-1.png", "alt", "img"], [1, "row", "gy-5", "justify-content-between"], [1, "wcu-amount-quantity"], [1, "amount"], [1, "title"], [1, "price"], [1, "quantity"], [1, "wcu-price-progress-wrap"], [4, "ngFor", "ngForOf"], [1, "col-lg-6"], ["class", "feature-card", 4, "ngFor", "ngForOf"], [1, "progress-wrap-title"], [1, "progress-wrap-text"], [1, "skill-feature"], [1, "progress"], [1, "progress-bar", 3, "ngStyle"], [1, "progress-value"], [1, "feature-card"], [1, "feature-card-icon"], ["alt", "img", 3, "src"], [1, "feature-card-details"], [1, "feature-card-title"], [1, "feature-card-text"], ["class", "feature-card-text", 4, "ngIf"]],
        template: function (r, o) {
            r & 1 && (u(0, "div", 0)(1, "div", 1), v(2, "img", 2), d(), u(3, "div", 3)(4, "div", 4)(5, "div", 5)(6, "div", 6)(7, "div", 7)(8, "h2", 8), h(9, "Why You Choose IKO is worth buying today?"), d(), u(10, "p", 9), h(11, "Use the window for the planned investment and calculate the estimated "), v(12, "br"), h(13, " Iko price and your monthly dividends at a fixed time "), d()()(), u(14, "div", 10)(15, "div", 11), v(16, "img", 12), d()()()(), u(17, "div", 13)(18, "div", 10)(19, "div", 14)(20, "div", 15)(21, "h5", 16), h(22, "Amount invested"), d(), u(23, "p", 17), h(24, "50,000 $"), d()(), u(25, "div", 18)(26, "h5", 16), h(27, "Quantity Iko"), d(), u(28, "p", 17), h(29, "500,000 Iko"), d()()(), u(30, "ul", 19), Y(31, Kx, 13, 7, "li", 20), d()(), u(32, "div", 21), Y(33, Jx, 9, 4, "div", 22), d()()()()), r & 2 && (y(31), D("ngForOf", o.progress_items), y(2), D("ngForOf", o.feature_data))
        },
        dependencies: [H, we, _t, _a]
    });
    let t = e;
    return t
})();
var ly = (() => {
    let e = class e {
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275cmp = T({
        type: e,
        selectors: [["app-intro-area-one"]],
        standalone: !0,
        features: [x],
        decls: 38,
        vars: 0,
        consts: [[1, "pt-130", "overflow-hidden", "bg-black2"], [1, "container"], [1, "row"], [1, "col-xl-6"], [1, "section-title", "mb-45"], [1, "title", "style2"], [1, "sec-text"], [1, "row", "justify-content-between"], [1, "col-xl-4"], [1, "intro-wrap", "mt-xl-4"], [1, "intro-wrap-title"], [1, "intro-wrap-text"], [1, "intro-wrap"], [1, "intro-thumb1", "alltuchtopdown"], ["src", "./assets/intro_1-1.png", "alt", "img"], [1, "intro-wrap", "mt-50"], [1, "intro-wrap-text", "mt-40"]],
        template: function (r, o) {
            r & 1 && (u(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div", 4)(5, "h2", 5), h(6, "Introducing Iko Crypto"), d(), u(7, "p", 6), h(8, "True wealth in the world of virtual currencies"), d()()()(), u(9, "div", 7)(10, "div", 8)(11, "div", 9)(12, "h6", 10), h(13, "Who We Are"), d(), u(14, "p", 11), h(15, "Iko is a 100% pre-scratched cryotome There are 1 Million Minutes, and 60% of them can be yours (60% - ICO) Utility & security token (applies to all transactions and gives a monthly dividend)"), d()(), u(16, "div", 12)(17, "h6", 10), h(18, "Wealth?"), d(), u(19, "p", 11), h(20, "Users with Iko have lower system fees Price growth is gathered by demand for Unifox technologies. You own a stake in an international corporation. You are part of the community"), d()(), u(21, "div", 12)(22, "h6", 10), h(23, "True Riches?"), d(), u(24, "p", 11), h(25, "The underlying growth attracts investors The whole community is interested in growing the Iko prize. The company is planning to continue to expand the project, and it will cost the top up"), d()()(), u(26, "div", 3)(27, "div", 13), v(28, "img", 14), d(), u(29, "div", 15)(30, "h6", 10), h(31, "Our Mission & Vission"), d(), u(32, "p", 11), h(33, "Iko is a 100% pre-scratched cryptome There are 1 Million Minutes, and 60% of them can be yours (60% - ICO) Utility & security token (applies to all transactions and gives a monthly dividend)"), d(), u(34, "p", 16), h(35, "Iko is a 100% pre-scratched cryptome There are 1 Million Minutes, and 60% of them can be yours (60% - ICO) Utility & security token (applies to all transactions and gives a monthly dividend)"), d(), u(36, "p", 16), h(37, "Iko is a 100% pre-scratched cryptome There are 1 Million Minutes, and 60% of them can be yours (60% - ICO)"), d()()()()()())
        }
    });
    let t = e;
    return t
})();

function eA(t, e) {
    if (t & 1 && (u(0, "div", 19)(1, "div", 20)(2, "span", 21), h(3), d(), u(4, "div", 22)(5, "h4", 23), v(6, "span", 24), h(7), d(), u(8, "p"), h(9), d()()()()), t & 2) {
        let n = e.$implicit;
        y(3), $(n.subtitle), y(4), $(n.title), y(2), $(n.desc)
    }
}

var cy = (() => {
    let e = class e {
        constructor() {
            this.roadmap_items = [{
                subtitle: "End of Q4 2023",
                title: "Research",
                desc: "SubQuery Builders/Grants Program SQT Network contract internal MVP Coordinator and client SDK implementations"
            }, {
                subtitle: "End of Q4 2023",
                title: "App Beta Test",
                desc: "SubQuery Builders/Grants Program SQT Network contract internal MVP Coordinator and client SDK implementations"
            }, {
                subtitle: "End of Q4 2023",
                title: "Token Test",
                desc: "SubQuery Builders/Grants Program SQT Network contract internal MVP Coordinator and client SDK implementations"
            }, {
                subtitle: "End of Q4 2023",
                title: "Alpha Test",
                desc: "SubQuery Builders/Grants Program SQT Network contract internal MVP Coordinator and client SDK implementations"
            }, {
                subtitle: "End of Q4 2023",
                title: "Concept",
                desc: "SubQuery Builders/Grants Program SQT Network contract internal MVP Coordinator and client SDK implementations"
            }]
        }

        ngOnInit() {
            this.swiperInstance = new He(".roadMap-active2", {
                slidesPerView: 4,
                spaceBetween: 0,
                loop: !0,
                breakpoints: {
                    1400: {slidesPerView: 4},
                    1200: {slidesPerView: 3},
                    992: {slidesPerView: 3},
                    768: {slidesPerView: 2},
                    576: {slidesPerView: 1},
                    0: {slidesPerView: 1}
                }
            })
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275cmp = T({
        type: e,
        selectors: [["app-roadmap-one"]],
        standalone: !0,
        features: [x],
        decls: 20,
        vars: 1,
        consts: [["id", "roadMap", 1, "pt-130", "pb-140", "overflow-hidden", "bg-black2", "position-relative", "z-index-common"], [1, "bg-gradient-2"], ["src", "./assets/bg-gradient1-1.jpg", "alt", "img"], [1, "container"], [1, "row", "justify-content-between"], [1, "col-lg-6", "col-sm-8"], [1, "section-title", "mb-50"], [1, "title", "style2"], [1, "col-sm-auto"], [1, "icon-box"], [1, "slider-arrow", "prev-btn", "default", 3, "click"], [1, "fas", "fa-arrow-left"], [1, "slider-arrow", "next-btn", "default", 3, "click"], [1, "fas", "fa-arrow-right"], [1, "container-fluid", "p-0"], [1, "slider-area", "position-relative"], [1, "row", "roadMap-active2", "roadmap-slider1", "swiper"], [1, "swiper-wrapper", "p-0"], ["class", "col-lg-4 swiper-slide", 4, "ngFor", "ngForOf"], [1, "col-lg-4", "swiper-slide"], [1, "roadmap-item"], [1, "roadmap-title"], [1, "roadmap-content"], [1, "title"], [1, "dot"]],
        template: function (r, o) {
            r & 1 && (u(0, "div", 0)(1, "div", 1), v(2, "img", 2), d(), u(3, "div", 3)(4, "div", 4)(5, "div", 5)(6, "div", 6)(7, "h2", 7), h(8, "Our Roadmap"), d()()(), u(9, "div", 8)(10, "div", 9)(11, "button", 10), j("click", function () {
                return o.swiperInstance == null ? null : o.swiperInstance.slidePrev()
            }), v(12, "i", 11), d(), u(13, "button", 12), j("click", function () {
                return o.swiperInstance == null ? null : o.swiperInstance.slideNext()
            }), v(14, "i", 13), d()()()()(), u(15, "div", 14)(16, "div", 15)(17, "div", 16)(18, "div", 17), Y(19, eA, 10, 3, "div", 18), d()()()()()), r & 2 && (y(19), D("ngForOf", o.roadmap_items))
        },
        dependencies: [H, we]
    });
    let t = e;
    return t
})();

function tA(t, e) {
    if (t & 1 && (u(0, "div", 8)(1, "div", 9)(2, "div", 10), v(3, "img", 11), d(), u(4, "a", 12), h(5), d()()()), t & 2) {
        let n = e.$implicit;
        y(3), D("src", n.icon, pe), y(2), $(n.title)
    }
}

var uy = (() => {
    let e = class e {
        constructor() {
            this.invest_data = [{
                icon: "./assets/invest-icon-1.png",
                title: "Enclose BTC"
            }, {
                icon: "./assets/invest-icon-2.png",
                title: "Enclose ETH"
            }, {
                icon: "./assets/invest-icon-3.png",
                title: "Bank Transfer"
            }, {icon: "./assets/invest-icon-4.png", title: "Enclose UXC"}]
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275cmp = T({
        type: e,
        selectors: [["app-invest-area"]],
        standalone: !0,
        features: [x],
        decls: 9,
        vars: 1,
        consts: [[1, "pt-130", "overflow-hidden"], [1, "container"], [1, "row", "justify-content-center"], [1, "col-xl-6", "col-lg-7"], [1, "section-title", "text-center", "mb-50"], [1, "title", "style2"], [1, "row", "gy-30"], ["class", "col-lg-3 col-md-6", 4, "ngFor", "ngForOf"], [1, "col-lg-3", "col-md-6"], [1, "invest-card"], [1, "invest-card-icon"], ["alt", "icon", 3, "src"], ["href", "#", 1, "btn", "btn3"]],
        template: function (r, o) {
            r & 1 && (u(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div", 4)(5, "h2", 5), h(6, "Invest in Our ecosystem shares today"), d()()()(), u(7, "div", 6), Y(8, tA, 6, 2, "div", 7), d()()()), r & 2 && (y(8), D("ngForOf", o.invest_data))
        },
        dependencies: [H, we]
    });
    let t = e;
    return t
})();

function nA(t, e) {
    if (t & 1 && (u(0, "a", 27), v(1, "i"), d()), t & 2) {
        let n = e.$implicit;
        D("href", n.link, pe), y(), lo(n.icon)
    }
}

function iA(t, e) {
    if (t & 1 && (u(0, "div", 18)(1, "div", 19)(2, "div", 20), v(3, "img", 21), d(), u(4, "div", 22)(5, "h3", 23), h(6), d(), u(7, "p", 24), h(8), d(), u(9, "div", 25), Y(10, nA, 2, 3, "a", 26), d()()()()), t & 2) {
        let n = e.$implicit;
        y(3), D("src", n.img, pe), y(3), $(n.name), y(2), $(n.designation), y(2), D("ngForOf", n.social)
    }
}

function rA(t, e) {
    if (t & 1 && (u(0, "a", 27), v(1, "i"), d()), t & 2) {
        let n = e.$implicit;
        D("href", n.link, pe), y(), lo(n.icon)
    }
}

function oA(t, e) {
    if (t & 1 && (u(0, "li", 28)(1, "div", 29)(2, "div", 30), v(3, "img", 31), u(4, "div", 25), Y(5, rA, 2, 3, "a", 26), d()(), u(6, "div", 32)(7, "h3", 33)(8, "a", 34), h(9), d()()()()()), t & 2) {
        let n = e.$implicit;
        y(3), D("src", n.img, pe), y(2), D("ngForOf", n.social), y(4), $(n.name)
    }
}

var dy = (() => {
    let e = class e {
        constructor() {
            this.activeCat = "advisory", this.founders = [{
                img: "./assets/founder-1-1.png",
                name: "Eleanor Pena",
                designation: "Founder & CEO",
                social: [{link: "https://www.linkedin.com/", icon: "fab fa-linkedin"}, {
                    link: "https://youtube.com/",
                    icon: "fab fa-youtube"
                }, {link: "https://facebook.com/", icon: "fab fa-facebook"}]
            }, {
                img: "./assets/founder-1-2.png",
                name: "Eleanor Pena",
                designation: "Founder & CEO",
                social: [{link: "https://www.linkedin.com/", icon: "fab fa-linkedin"}, {
                    link: "https://youtube.com/",
                    icon: "fab fa-youtube"
                }, {link: "https://facebook.com/", icon: "fab fa-facebook"}]
            }], this.team_data = [{
                id: 1,
                img: "./assets/team-1-1.png",
                name: "Jacob Jones",
                social: [{link: "https://www.linkedin.com/", icon: "fab fa-linkedin"}],
                category: "advisory"
            }, {
                id: 2,
                img: "./assets/team-1-2.png",
                name: "Albert Flores",
                social: [{link: "https://www.linkedin.com/", icon: "fab fa-linkedin"}],
                category: "advisory"
            }, {
                id: 3,
                img: "./assets/team-1-3.png",
                name: "Devon Lane",
                social: [{link: "https://www.linkedin.com/", icon: "fab fa-linkedin"}],
                category: "advisory"
            }, {
                id: 4,
                img: "./assets/team-1-4.png",
                name: "Jacob Jones",
                social: [{link: "https://www.linkedin.com/", icon: "fab fa-linkedin"}],
                category: "advisory"
            }, {
                id: 5,
                img: "./assets/team-1-5.png",
                name: "Bradley Hunter",
                social: [{link: "https://www.linkedin.com/", icon: "fab fa-linkedin"}],
                category: "advisory"
            }, {
                id: 6,
                img: "./assets/team-1-6.png",
                name: "Eleanor Pena",
                social: [{link: "https://www.linkedin.com/", icon: "fab fa-linkedin"}],
                category: "advisory"
            }, {
                id: 7,
                img: "./assets/team-1-7.png",
                name: "Christopher Nolan",
                social: [{link: "https://www.linkedin.com/", icon: "fab fa-linkedin"}],
                category: "advisory"
            }, {
                id: 8,
                img: "./assets/team-1-8.png",
                name: "Devon Lane",
                social: [{link: "https://www.linkedin.com/", icon: "fab fa-linkedin"}],
                category: "advisory"
            }, {
                id: 9,
                img: "./assets/team-1-9.png",
                name: "Floyd Miles",
                social: [{link: "https://www.linkedin.com/", icon: "fab fa-linkedin"}],
                category: "advisory"
            }, {
                id: 10,
                img: "./assets/team-1-10.png",
                name: "Gerald Rivera",
                social: [{link: "https://www.linkedin.com/", icon: "fab fa-linkedin"}],
                category: "advisory"
            }, {
                id: 11,
                img: "./assets/team-1-4.png",
                name: "Eleanor Pena",
                social: [{link: "https://www.linkedin.com/", icon: "fab fa-linkedin"}],
                category: "management"
            }, {
                id: 12,
                img: "./assets/team-1-3.png",
                name: "Gerald Rivera",
                social: [{link: "https://www.linkedin.com/", icon: "fab fa-linkedin"}],
                category: "management"
            }, {
                id: 13,
                img: "./assets/team-1-5.png",
                name: "Harriett Bridges",
                social: [{link: "https://www.linkedin.com/", icon: "fab fa-linkedin"}],
                category: "management"
            }, {
                id: 14,
                img: "./assets/team-1-9.png",
                name: "Irma Dorsey",
                social: [{link: "https://www.linkedin.com/", icon: "fab fa-linkedin"}],
                category: "management"
            }, {
                id: 15,
                img: "./assets/team-1-7.png",
                name: "Irma Dorsey",
                social: [{link: "https://www.linkedin.com/", icon: "fab fa-linkedin"}],
                category: "management"
            }, {
                id: 16,
                img: "./assets/team-1-10.png",
                name: "Jacob Jones",
                social: [{link: "https://www.linkedin.com/", icon: "fab fa-linkedin"}],
                category: "marketing"
            }, {
                id: 17,
                img: "./assets/team-1-6.png",
                name: "Kevin Vasquez",
                social: [{link: "https://www.linkedin.com/", icon: "fab fa-linkedin"}],
                category: "marketing"
            }, {
                id: 18,
                img: "./assets/team-1-5.png",
                name: "Leonard Watson",
                social: [{link: "https://www.linkedin.com/", icon: "fab fa-linkedin"}],
                category: "marketing"
            }, {
                id: 19,
                img: "./assets/team-1-7.png",
                name: "Natalie Myers",
                social: [{link: "https://www.linkedin.com/", icon: "fab fa-linkedin"}],
                category: "marketing"
            }, {
                id: 20,
                img: "./assets/team-1-1.png",
                name: "Matthew Cooper",
                social: [{link: "https://www.linkedin.com/", icon: "fab fa-linkedin"}],
                category: "marketing"
            }]
        }

        handleCategory(i) {
            this.activeCat = i
        }

        get filterItems() {
            return this.activeCat === "advisory" ? this.team_data.filter(i => i.category === "advisory") : this.activeCat === "management" ? this.team_data.filter(i => i.category === "management") : this.activeCat === "marketing" ? this.team_data.filter(i => i.category === "marketing") : this.team_data
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275cmp = T({
        type: e,
        selectors: [["app-team-area"]],
        standalone: !0,
        features: [x],
        decls: 25,
        vars: 8,
        consts: [[1, "pt-130", "pb-140", "overflow-hidden", "position-relative", "z-index-common"], [1, "bg-gradient-3"], ["src", "./assets/bg-gradient1-1.jpg", "alt", "img"], [1, "pb-110"], [1, "container"], [1, "section-title", "text-center", "mb-50"], [1, "title", "style2"], [1, "row", "gy-4", "justify-content-center"], ["class", "col-lg-6", 4, "ngFor", "ngForOf"], [1, "row"], [1, "col-12"], [1, "text-center"], [1, "team-tab-btn", "filter-menu-active"], ["type", "button", 3, "click"], [1, "filter-active-cat1"], [1, "team-tab-content", "filter-item", "cat1"], [1, "team-tab-list"], ["class", "team-tab-item", 4, "ngFor", "ngForOf"], [1, "col-lg-6"], [1, "founder-card"], [1, "founder-card-img"], ["alt", "img", 3, "src"], [1, "founder-card-details"], [1, "founder-card-title"], [1, "founder-card-desig"], [1, "social-btn"], ["target", "_blank", 3, "href", 4, "ngFor", "ngForOf"], ["target", "_blank", 3, "href"], [1, "team-tab-item"], [1, "team-card"], [1, "team-card_img"], ["alt", "Team Image", 3, "src"], [1, "team-card_content"], [1, "team-card_title"], ["href", "#"]],
        template: function (r, o) {
            r & 1 && (u(0, "div", 0)(1, "div", 1), v(2, "img", 2), d(), u(3, "div", 3)(4, "div", 4)(5, "div", 5)(6, "h2", 6), h(7, "Active founders"), d()(), u(8, "div", 7), Y(9, iA, 11, 4, "div", 8), d()()(), u(10, "div", 4)(11, "div", 9)(12, "div", 10)(13, "div", 11)(14, "div", 12)(15, "button", 13), j("click", function () {
                return o.handleCategory("advisory")
            }), h(16, "Advisory Team"), d(), u(17, "button", 13), j("click", function () {
                return o.handleCategory("management")
            }), h(18, "Management Team"), d(), u(19, "button", 13), j("click", function () {
                return o.handleCategory("marketing")
            }), h(20, "Marketing Team"), d()()(), u(21, "div", 14)(22, "div", 15)(23, "ul", 16), Y(24, oA, 10, 3, "li", 17), d()()()()()()()), r & 2 && (y(9), D("ngForOf", o.founders), y(6), ee("active", o.activeCat === "advisory"), y(2), ee("active", o.activeCat === "management"), y(2), ee("active", o.activeCat === "marketing"), y(5), D("ngForOf", o.filterItems))
        },
        dependencies: [H, we]
    });
    let t = e;
    return t
})();

function ml(t, e, n, i) {
    return t.params.createElements && Object.keys(i).forEach(r => {
        if (!n[r] && n.auto === !0) {
            let o = We(t.el, `.${i[r]}`)[0];
            o || (o = Bt("div", i[r]), o.className = i[r], t.el.append(o)), n[r] = o, e[r] = o
        }
    }), n
}

function Qn(t) {
    return t === void 0 && (t = ""), `.${t.trim().replace(/([\.:!+\/])/g, "\\$1").replace(/ /g, ".")}`
}

function Go(t) {
    let {swiper: e, extendParams: n, on: i, emit: r} = t, o = "swiper-pagination";
    n({
        pagination: {
            el: null,
            bulletElement: "span",
            clickable: !1,
            hideOnClick: !1,
            renderBullet: null,
            renderProgressbar: null,
            renderFraction: null,
            renderCustom: null,
            progressbarOpposite: !1,
            type: "bullets",
            dynamicBullets: !1,
            dynamicMainBullets: 1,
            formatFractionCurrent: w => w,
            formatFractionTotal: w => w,
            bulletClass: `${o}-bullet`,
            bulletActiveClass: `${o}-bullet-active`,
            modifierClass: `${o}-`,
            currentClass: `${o}-current`,
            totalClass: `${o}-total`,
            hiddenClass: `${o}-hidden`,
            progressbarFillClass: `${o}-progressbar-fill`,
            progressbarOppositeClass: `${o}-progressbar-opposite`,
            clickableClass: `${o}-clickable`,
            lockClass: `${o}-lock`,
            horizontalClass: `${o}-horizontal`,
            verticalClass: `${o}-vertical`,
            paginationDisabledClass: `${o}-disabled`
        }
    }), e.pagination = {el: null, bullets: []};
    let s, a = 0;

    function l() {
        return !e.params.pagination.el || !e.pagination.el || Array.isArray(e.pagination.el) && e.pagination.el.length === 0
    }

    function c(w, S) {
        let {bulletActiveClass: C} = e.params.pagination;
        w && (w = w[`${S === "prev" ? "previous" : "next"}ElementSibling`], w && (w.classList.add(`${C}-${S}`), w = w[`${S === "prev" ? "previous" : "next"}ElementSibling`], w && w.classList.add(`${C}-${S}-${S}`)))
    }

    function f(w) {
        let S = w.target.closest(Qn(e.params.pagination.bulletClass));
        if (!S) return;
        w.preventDefault();
        let C = Ai(S) * e.params.slidesPerGroup;
        if (e.params.loop) {
            if (e.realIndex === C) return;
            e.slideToLoop(C)
        } else e.slideTo(C)
    }

    function p() {
        let w = e.rtl, S = e.params.pagination;
        if (l()) return;
        let C = e.pagination.el;
        C = Et(C);
        let I, O, U = e.virtual && e.params.virtual.enabled ? e.virtual.slides.length : e.slides.length,
            de = e.params.loop ? Math.ceil(U / e.params.slidesPerGroup) : e.snapGrid.length;
        if (e.params.loop ? (O = e.previousRealIndex || 0, I = e.params.slidesPerGroup > 1 ? Math.floor(e.realIndex / e.params.slidesPerGroup) : e.realIndex) : typeof e.snapIndex < "u" ? (I = e.snapIndex, O = e.previousSnapIndex) : (O = e.previousIndex || 0, I = e.activeIndex || 0), S.type === "bullets" && e.pagination.bullets && e.pagination.bullets.length > 0) {
            let L = e.pagination.bullets, Ce, A, W;
            if (S.dynamicBullets && (s = zo(L[0], e.isHorizontal() ? "width" : "height", !0), C.forEach(V => {
                V.style[e.isHorizontal() ? "width" : "height"] = `${s * (S.dynamicMainBullets + 4)}px`
            }), S.dynamicMainBullets > 1 && O !== void 0 && (a += I - (O || 0), a > S.dynamicMainBullets - 1 ? a = S.dynamicMainBullets - 1 : a < 0 && (a = 0)), Ce = Math.max(I - a, 0), A = Ce + (Math.min(L.length, S.dynamicMainBullets) - 1), W = (A + Ce) / 2), L.forEach(V => {
                let R = [...["", "-next", "-next-next", "-prev", "-prev-prev", "-main"].map(le => `${S.bulletActiveClass}${le}`)].map(le => typeof le == "string" && le.includes(" ") ? le.split(" ") : le).flat();
                V.classList.remove(...R)
            }), C.length > 1) L.forEach(V => {
                let R = Ai(V);
                R === I ? V.classList.add(...S.bulletActiveClass.split(" ")) : e.isElement && V.setAttribute("part", "bullet"), S.dynamicBullets && (R >= Ce && R <= A && V.classList.add(...`${S.bulletActiveClass}-main`.split(" ")), R === Ce && c(V, "prev"), R === A && c(V, "next"))
            }); else {
                let V = L[I];
                if (V && V.classList.add(...S.bulletActiveClass.split(" ")), e.isElement && L.forEach((R, le) => {
                    R.setAttribute("part", le === I ? "bullet-active" : "bullet")
                }), S.dynamicBullets) {
                    let R = L[Ce], le = L[A];
                    for (let _e = Ce; _e <= A; _e += 1) L[_e] && L[_e].classList.add(...`${S.bulletActiveClass}-main`.split(" "));
                    c(R, "prev"), c(le, "next")
                }
            }
            if (S.dynamicBullets) {
                let V = Math.min(L.length, S.dynamicMainBullets + 4), R = (s * V - s) / 2 - W * s,
                    le = w ? "right" : "left";
                L.forEach(_e => {
                    _e.style[e.isHorizontal() ? le : "top"] = `${R}px`
                })
            }
        }
        C.forEach((L, Ce) => {
            if (S.type === "fraction" && (L.querySelectorAll(Qn(S.currentClass)).forEach(A => {
                A.textContent = S.formatFractionCurrent(I + 1)
            }), L.querySelectorAll(Qn(S.totalClass)).forEach(A => {
                A.textContent = S.formatFractionTotal(de)
            })), S.type === "progressbar") {
                let A;
                S.progressbarOpposite ? A = e.isHorizontal() ? "vertical" : "horizontal" : A = e.isHorizontal() ? "horizontal" : "vertical";
                let W = (I + 1) / de, V = 1, R = 1;
                A === "horizontal" ? V = W : R = W, L.querySelectorAll(Qn(S.progressbarFillClass)).forEach(le => {
                    le.style.transform = `translate3d(0,0,0) scaleX(${V}) scaleY(${R})`, le.style.transitionDuration = `${e.params.speed}ms`
                })
            }
            S.type === "custom" && S.renderCustom ? (L.innerHTML = S.renderCustom(e, I + 1, de), Ce === 0 && r("paginationRender", L)) : (Ce === 0 && r("paginationRender", L), r("paginationUpdate", L)), e.params.watchOverflow && e.enabled && L.classList[e.isLocked ? "add" : "remove"](S.lockClass)
        })
    }

    function m() {
        let w = e.params.pagination;
        if (l()) return;
        let S = e.virtual && e.params.virtual.enabled ? e.virtual.slides.length : e.grid && e.params.grid.rows > 1 ? e.slides.length / Math.ceil(e.params.grid.rows) : e.slides.length,
            C = e.pagination.el;
        C = Et(C);
        let I = "";
        if (w.type === "bullets") {
            let O = e.params.loop ? Math.ceil(S / e.params.slidesPerGroup) : e.snapGrid.length;
            e.params.freeMode && e.params.freeMode.enabled && O > S && (O = S);
            for (let U = 0; U < O; U += 1) w.renderBullet ? I += w.renderBullet.call(e, U, w.bulletClass) : I += `<${w.bulletElement} ${e.isElement ? 'part="bullet"' : ""} class="${w.bulletClass}"></${w.bulletElement}>`
        }
        w.type === "fraction" && (w.renderFraction ? I = w.renderFraction.call(e, w.currentClass, w.totalClass) : I = `<span class="${w.currentClass}"></span> / <span class="${w.totalClass}"></span>`), w.type === "progressbar" && (w.renderProgressbar ? I = w.renderProgressbar.call(e, w.progressbarFillClass) : I = `<span class="${w.progressbarFillClass}"></span>`), e.pagination.bullets = [], C.forEach(O => {
            w.type !== "custom" && (O.innerHTML = I || ""), w.type === "bullets" && e.pagination.bullets.push(...O.querySelectorAll(Qn(w.bulletClass)))
        }), w.type !== "custom" && r("paginationRender", C[0])
    }

    function g() {
        e.params.pagination = ml(e, e.originalParams.pagination, e.params.pagination, {el: "swiper-pagination"});
        let w = e.params.pagination;
        if (!w.el) return;
        let S;
        typeof w.el == "string" && e.isElement && (S = e.el.querySelector(w.el)), !S && typeof w.el == "string" && (S = [...document.querySelectorAll(w.el)]), S || (S = w.el), !(!S || S.length === 0) && (e.params.uniqueNavElements && typeof w.el == "string" && Array.isArray(S) && S.length > 1 && (S = [...e.el.querySelectorAll(w.el)], S.length > 1 && (S = S.filter(C => Tr(C, ".swiper")[0] === e.el)[0])), Array.isArray(S) && S.length === 1 && (S = S[0]), Object.assign(e.pagination, {el: S}), S = Et(S), S.forEach(C => {
            w.type === "bullets" && w.clickable && C.classList.add(...(w.clickableClass || "").split(" ")), C.classList.add(w.modifierClass + w.type), C.classList.add(e.isHorizontal() ? w.horizontalClass : w.verticalClass), w.type === "bullets" && w.dynamicBullets && (C.classList.add(`${w.modifierClass}${w.type}-dynamic`), a = 0, w.dynamicMainBullets < 1 && (w.dynamicMainBullets = 1)), w.type === "progressbar" && w.progressbarOpposite && C.classList.add(w.progressbarOppositeClass), w.clickable && C.addEventListener("click", f), e.enabled || C.classList.add(w.lockClass)
        }))
    }

    function b() {
        let w = e.params.pagination;
        if (l()) return;
        let S = e.pagination.el;
        S && (S = Et(S), S.forEach(C => {
            C.classList.remove(w.hiddenClass), C.classList.remove(w.modifierClass + w.type), C.classList.remove(e.isHorizontal() ? w.horizontalClass : w.verticalClass), w.clickable && (C.classList.remove(...(w.clickableClass || "").split(" ")), C.removeEventListener("click", f))
        })), e.pagination.bullets && e.pagination.bullets.forEach(C => C.classList.remove(...w.bulletActiveClass.split(" ")))
    }

    i("changeDirection", () => {
        if (!e.pagination || !e.pagination.el) return;
        let w = e.params.pagination, {el: S} = e.pagination;
        S = Et(S), S.forEach(C => {
            C.classList.remove(w.horizontalClass, w.verticalClass), C.classList.add(e.isHorizontal() ? w.horizontalClass : w.verticalClass)
        })
    }), i("init", () => {
        e.params.pagination.enabled === !1 ? M() : (g(), m(), p())
    }), i("activeIndexChange", () => {
        typeof e.snapIndex > "u" && p()
    }), i("snapIndexChange", () => {
        p()
    }), i("snapGridLengthChange", () => {
        m(), p()
    }), i("destroy", () => {
        b()
    }), i("enable disable", () => {
        let {el: w} = e.pagination;
        w && (w = Et(w), w.forEach(S => S.classList[e.enabled ? "remove" : "add"](e.params.pagination.lockClass)))
    }), i("lock unlock", () => {
        p()
    }), i("click", (w, S) => {
        let C = S.target, I = Et(e.pagination.el);
        if (e.params.pagination.el && e.params.pagination.hideOnClick && I && I.length > 0 && !C.classList.contains(e.params.pagination.bulletClass)) {
            if (e.navigation && (e.navigation.nextEl && C === e.navigation.nextEl || e.navigation.prevEl && C === e.navigation.prevEl)) return;
            let O = I[0].classList.contains(e.params.pagination.hiddenClass);
            r(O === !0 ? "paginationShow" : "paginationHide"), I.forEach(U => U.classList.toggle(e.params.pagination.hiddenClass))
        }
    });
    let E = () => {
        e.el.classList.remove(e.params.pagination.paginationDisabledClass);
        let {el: w} = e.pagination;
        w && (w = Et(w), w.forEach(S => S.classList.remove(e.params.pagination.paginationDisabledClass))), g(), m(), p()
    }, M = () => {
        e.el.classList.add(e.params.pagination.paginationDisabledClass);
        let {el: w} = e.pagination;
        w && (w = Et(w), w.forEach(S => S.classList.add(e.params.pagination.paginationDisabledClass))), b()
    };
    Object.assign(e.pagination, {enable: E, disable: M, render: m, update: p, init: g, destroy: b})
}

function sA(t, e) {
    if (t & 1 && (u(0, "div", 9)(1, "div", 10)(2, "div", 11), v(3, "img", 12), d(), u(4, "p", 13), h(5), d(), u(6, "a", 14), h(7, "EXPLORE"), d()()()), t & 2) {
        let n = e.$implicit;
        y(3), D("src", n.img, pe), y(2), $(n.text)
    }
}

var hy = (() => {
    let e = class e {
        constructor() {
            this.partner_data = [{
                img: "./assets/client-1-4.svg",
                text: "Stable crypto currency and an important part of the UniFox ecosystem"
            }, {
                img: "./assets/client-1-2.svg",
                text: "Online exchanger, specializing in the exchange of private individuals"
            }, {
                img: "./assets/client-1-5.svg",
                text: "A company that provides all IT services within the ecosystem of UniFox"
            }, {
                img: "./assets/client-1-4.svg",
                text: "Stable crypto currency and an important part of the UniFox ecosystem"
            }, {
                img: "./assets/client-1-2.svg",
                text: "Online exchanger, specializing in the exchange of private individuals"
            }, {
                img: "./assets/client-1-5.svg",
                text: "A company that provides all IT services within the ecosystem of UniFox"
            }]
        }

        ngOnInit() {
            new He(".partner-slider1", {
                slidesPerView: 3,
                spaceBetween: 30,
                loop: !1,
                pagination: {clickable: !0, el: ".ns-swiper-dot-1"},
                modules: [Go],
                breakpoints: {
                    1200: {slidesPerView: 3},
                    992: {slidesPerView: 3},
                    768: {slidesPerView: 2},
                    576: {slidesPerView: 1},
                    0: {slidesPerView: 1}
                }
            })
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275cmp = T({
        type: e,
        selectors: [["app-partners"]],
        standalone: !0,
        features: [x],
        decls: 10,
        vars: 1,
        consts: [[1, "pt-130", "bg-black2"], [1, "container"], [1, "section-title", "text-center", "mb-50"], [1, "title", "style2"], [1, "slider-area"], [1, "row", "partner-slider1", "swiper"], [1, "swiper-wrapper", "p-0"], ["class", "col-lg-4 swiper-slide", 4, "ngFor", "ngForOf"], [1, "ns-swiper-dot-1"], [1, "col-lg-4", "swiper-slide"], [1, "partner-card"], [1, "partner-card-img"], ["alt", "img", 3, "src"], [1, "partner-card-text"], ["routerLink", "/blog", 1, "btn", "btn3"]],
        template: function (r, o) {
            r & 1 && (u(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h2", 3), h(4, "Our partners"), d()(), u(5, "div", 4)(6, "div", 5)(7, "div", 6), Y(8, sA, 8, 2, "div", 7), d(), v(9, "div", 8), d()()()()), r & 2 && (y(8), D("ngForOf", o.partner_data))
        },
        dependencies: [H, we]
    });
    let t = e;
    return t
})();

function aA(t, e) {
    if (t & 1 && (u(0, "div", 14)(1, "div", 15)(2, "div", 16)(3, "a", 17), v(4, "img", 18), d()(), u(5, "div", 19)(6, "h4", 20)(7, "a", 21), h(8), d()(), u(9, "div", 22)(10, "a", 17), Ke(), u(11, "svg", 23), v(12, "path", 24)(13, "path", 25), d(), h(14), d(), Ze(), u(15, "a", 26), v(16, "i", 27), h(17), d()(), u(18, "a", 28), h(19, " JOIN US "), d()()()()), t & 2) {
        let n = e.$implicit;
        y(4), D("src", n.img, pe), y(4), $(n.title), y(6), ye(" ", n.location, " "), y(3), ye(" ", n.date, " ")
    }
}

function lA(t, e) {
    if (t & 1 && (u(0, "div", 29)(1, "div", 30)(2, "div", 31), v(3, "img", 32), u(4, "h3", 33), h(5), d(), u(6, "p", 34), h(7), d()(), u(8, "a", 35), h(9, "READ MORE"), d()()()), t & 2) {
        let n = e.$implicit;
        y(3), D("src", n.img, pe), y(2), $(n.title), y(2), $(n.desc)
    }
}

var my = (() => {
    let e = class e {
        constructor() {
            this.event_data = [{
                img: "./assets/1-1.png",
                title: "BlockVienna",
                location: "Venna",
                date: "August 17, 2024"
            }, {
                img: "./assets/1-2.png",
                title: "Summit Summits",
                location: "USA",
                date: "June 12, 2024"
            }, {
                img: "./assets/1-3.png",
                title: "Blockchain Summit",
                location: "America",
                date: "July 07, 2024"
            }, {
                img: "./assets/1-4.png",
                title: "Economy ICO 2024",
                location: "Costa Rica",
                date: "September 09, 2024"
            }, {
                img: "./assets/1-5.png",
                title: "Blockchain summit",
                location: "Brazil",
                date: "April 15, 2024"
            }, {
                img: "./assets/1-6.png",
                title: "Blockchain & bitcoin",
                location: "Argentina",
                date: "August 16, 2024"
            }, {
                img: "./assets/1-7.png",
                title: "Money conference",
                location: "France",
                date: "May 13, 2024"
            }, {
                img: "./assets/1-8.png",
                title: "Crypto Economy",
                location: "Saudi Arabia",
                date: "April 20, 2024"
            }], this.press_data = [{
                img: "./assets/press-1-1.svg",
                title: "huffpost.com",
                desc: "UniFox seeks to incorporate cryptocurrencies into everyday life through the introduction of their autonomous design."
            }, {
                img: "./assets/press-1-2.svg",
                title: "msnbc.com",
                desc: 'In excellence from Tether or love another "stable" crippling. Unicash can easily be converted to local currency by special bankers '
            }, {
                img: "./assets/press-1-1.svg",
                title: "huffpost.com",
                desc: "UniFox seeks to incorporate cryptocurrencies into everyday life through the introduction of their autonomous design."
            }, {
                img: "./assets/press-1-2.svg",
                title: "msnbc.com",
                desc: 'In excellence from Tether or love another "stable" crippling. Unicash can easily be converted to local currency by special bankers '
            }]
        }

        ngOnInit() {
            new He(".cta-slider1", {
                slidesPerView: 2,
                spaceBetween: 30,
                loop: !1,
                pagination: {clickable: !0, el: ".ns-swiper-dot-2"},
                modules: [Go],
                breakpoints: {
                    992: {slidesPerView: 2},
                    768: {slidesPerView: 2},
                    576: {slidesPerView: 1},
                    0: {slidesPerView: 1}
                }
            })
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275cmp = T({
        type: e,
        selectors: [["app-events"]],
        standalone: !0,
        features: [x],
        decls: 19,
        vars: 2,
        consts: [[1, "pt-130", "pb-140", "bg-black2", "overflow-hidden", "position-relative", "z-index-common"], [1, "bg-gradient-4"], ["src", "./assets/bg-gradient1-2.jpg", "alt", "img"], [1, "event-area"], [1, "container"], [1, "section-title", "text-center", "mb-50"], [1, "title", "style2"], [1, "row", "gy-60", "gx-30", "justify-content-center"], ["class", "col-lg-3 col-md-6", 4, "ngFor", "ngForOf"], [1, "press-cta-area", "pt-130"], [1, "cta-slider1", "row", "swiper"], [1, "swiper-wrapper", "p-0"], ["class", "col-lg-6 swiper-slide", 4, "ngFor", "ngForOf"], [1, "ns-swiper-dot-2"], [1, "col-lg-3", "col-md-6"], [1, "event-card"], [1, "event-card-img"], ["href", "#"], ["alt", "blog image", 3, "src"], [1, "event-card-content"], [1, "event-card-title"], ["routerLink", "/contact"], [1, "event-meta"], ["width", "16", "height", "16", "viewBox", "0 0 16 16", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M7.99895 8.95321C9.1477 8.95321 10.0789 8.02197 10.0789 6.87321C10.0789 5.72446 9.1477 4.79321 7.99895 4.79321C6.85019 4.79321 5.91895 5.72446 5.91895 6.87321C5.91895 8.02197 6.85019 8.95321 7.99895 8.95321Z", "stroke", "var(--tg-primary-color)", "stroke-width", "1.5"], ["d", "M2.41281 5.65992C3.72615 -0.113413 12.2795 -0.106746 13.5861 5.66659C14.3528 9.05325 12.2461 11.9199 10.3995 13.6933C9.05948 14.9866 6.93948 14.9866 5.59281 13.6933C3.75281 11.9199 1.64615 9.04659 2.41281 5.65992Z", "stroke", "var(--tg-primary-color)", "stroke-width", "1.5"], ["href", "javascript:void(0)"], [1, "far", "fa-clock"], ["href", "javascript:void(0)", 1, "btn", "btn3"], [1, "col-lg-6", "swiper-slide"], [1, "cta-wrap1"], [1, "cta-wrap-details"], ["alt", "img", 3, "src"], [1, "cta-wrap-title"], [1, "cta-wrap-text"], ["routerLink", "/blog", 1, "btn", "btn4"]],
        template: function (r, o) {
            r & 1 && (u(0, "div", 0)(1, "div", 1), v(2, "img", 2), d(), u(3, "div", 3)(4, "div", 4)(5, "div", 5)(6, "h2", 6), h(7, "Join Events for meet us"), d()(), u(8, "div", 7), Y(9, aA, 20, 4, "div", 8), d()()(), u(10, "div", 9)(11, "div", 4)(12, "div", 5)(13, "h2", 6), h(14, "Press us"), d()(), u(15, "div", 10)(16, "div", 11), Y(17, lA, 10, 3, "div", 12), d(), v(18, "div", 13), d()()()()), r & 2 && (y(9), D("ngForOf", o.event_data), y(8), D("ngForOf", o.press_data))
        },
        dependencies: [H, we, Ee, he]
    });
    let t = e;
    return t
})();

function cA(t, e) {
    if (t & 1 && (u(0, "div", 12)(1, "div", 13)(2, "button", 14)(3, "span", 15), h(4), d(), h(5), d()(), u(6, "div", 16)(7, "div", 17)(8, "p", 18), h(9), d()()()()), t & 2) {
        let n = e.$implicit;
        ee("active", n.active), y(), Vt("id", "collapse-item-" + n.id), y(), ee("collapsed", !n.active), Vt("data-bs-target", "#collapse-" + n.id)("aria-expanded", n.active ? "true" : "false")("aria-controls", "collapse-" + n.id), y(2), $(n.id), y(), ye(" ", n.question, ""), y(), ee("show", n.active), Vt("id", "collapse-" + n.id)("aria-labelledby", "collapse-item-" + n.id), y(3), $(n.answer)
    }
}

var gy = (() => {
    let e = class e {
        constructor() {
            this.faq_data = [{
                id: 1,
                active: !0,
                question: "How to buy FOX tokens?",
                answer: "It's very simple! Register here. In your personal account, create a wallet where you can store your FOX tokens. Then just send any amount to the displayed address in your office."
            }, {
                id: 2,
                question: "What is the value of FOX tokens?",
                answer: "It's very simple! Register here. In your personal account, create a wallet where you can store your FOX tokens. Then just send any amount to the displayed address in your office."
            }, {
                id: 3,
                question: "What is the value of FOX tokens?",
                answer: "It's very simple! Register here. In your personal account, create a wallet where you can store your FOX tokens. Then just send any amount to the displayed address in your office."
            }, {
                id: 4,
                question: "How are coins distribut ed?",
                answer: "It's very simple! Register here. In your personal account, create a wallet where you can store your FOX tokens. Then just send any amount to the displayed address in your office."
            }, {
                id: 5,
                question: "How to buy FOX tokens?",
                answer: "It's very simple! Register here. In your personal account, create a wallet where you can store your FOX tokens. Then just send any amount to the displayed address in your office."
            }, {
                id: 6,
                question: "What is the value of FOX tokens?",
                answer: "It's very simple! Register here. In your personal account, create a wallet where you can store your FOX tokens. Then just send any amount to the displayed address in your office."
            }, {
                id: 7,
                question: "What is the value of FOX tokens?",
                answer: "It's very simple! Register here. In your personal account, create a wallet where you can store your FOX tokens. Then just send any amount to the displayed address in your office."
            }]
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275cmp = T({
        type: e,
        selectors: [["app-faq-one"]],
        standalone: !0,
        features: [x],
        decls: 14,
        vars: 1,
        consts: [[1, "pt-140", "pb-140", "overflow-hidden"], [1, "container"], [1, "row", "gy-40", "justify-content-between"], [1, "col-xl-4", "text-xl-start"], [1, "section-title", "mb-50"], [1, "title", "style2"], [1, "sec-text"], [1, "faq-thumb", "mt-60"], ["src", "./assets/faq_1-1.png", "alt", "img"], [1, "col-xxl-6", "col-xl-8"], ["id", "faqAccordion", 1, "accordion-area", "accordion"], ["class", "accordion-card", 3, "active", 4, "ngFor", "ngForOf"], [1, "accordion-card"], [1, "accordion-header"], ["type", "button", "data-bs-toggle", "collapse", 1, "accordion-button"], [1, "number"], ["data-bs-parent", "#faqAccordion", 1, "accordion-collapse", "collapse"], [1, "accordion-body"], [1, "faq-text"]],
        template: function (r, o) {
            r & 1 && (u(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div", 4)(5, "h2", 5), h(6, "Frequently Asked Questions"), d(), u(7, "p", 6), h(8, "DO have any kind Of questions? We're here to help."), d()(), u(9, "div", 7), v(10, "img", 8), d()(), u(11, "div", 9)(12, "div", 10), Y(13, cA, 10, 15, "div", 11), d()()()()()), r & 2 && (y(13), D("ngForOf", o.faq_data))
        },
        dependencies: [H, we]
    });
    let t = e;
    return t
})();
var vy = (() => {
    let e = class e {
        constructor() {
            this.date = new Date().getFullYear()
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275cmp = T({
        type: e,
        selectors: [["app-footer-one"]],
        standalone: !0,
        features: [x],
        decls: 54,
        vars: 1,
        consts: [[1, "footer-wrapper", "footer-layout1", "position-relative"], [1, "bg-gradient-1"], ["src", "./assets/bg-gradient1-1.jpg", "alt", "img"], [1, "container"], [1, "footer-menu-area"], [1, "row", "gy-4", "justify-content-between", "align-items-center"], [1, "col-xl-5", "col-lg-4"], [1, "social-btn", "justify-content-center", "justify-content-lg-start"], ["href", "https://www.facebook.com/", "target", "_blank"], [1, "fab", "fa-facebook-f"], ["href", "https://twitter.com/", "target", "_blank"], ["xmlns", "http://www.w3.org/2000/svg", "width", "16", "height", "16", "viewBox", "0 0 16 16", "fill", "none"], ["d", "M10.0596 7.34522L15.8879 0.570312H14.5068L9.44607 6.45287L5.40411 0.570312H0.742188L6.85442 9.46578L0.742188 16.5703H2.12338L7.4676 10.3581L11.7362 16.5703H16.3981L10.0593 7.34522H10.0596ZM8.16787 9.54415L7.54857 8.65836L2.62104 1.61005H4.74248L8.71905 7.29827L9.33834 8.18405L14.5074 15.5779H12.386L8.16787 9.54449V9.54415Z", "fill", "currentColor"], ["href", "https://instagram.com/", "target", "_blank"], [1, "fab", "fa-instagram"], ["href", "https://linkedin.com/", "target", "_blank"], [1, "fab", "fa-linkedin"], [1, "col-xl-7", "col-lg-8", "text-lg-end", "text-center"], [1, "footer-menu-list"], ["routerLink", "/home"], [1, "copyright-wrap", "text-center", "text-lg-start"], [1, "row", "gy-3", "justify-content-between", "align-items-center"], [1, "col-lg-6", "align-self-center"], [1, "copyright-text"], [1, "col-lg-6", "text-lg-end"], [1, "footer-links"], ["routerLink", "/blog"], ["routerLink", "/contact"]],
        template: function (r, o) {
            r & 1 && (u(0, "footer", 0)(1, "div", 1), v(2, "img", 2), d(), u(3, "div", 3)(4, "div", 4)(5, "div", 5)(6, "div", 6)(7, "div", 7)(8, "a", 8), v(9, "i", 9), d(), u(10, "a", 10), Ke(), u(11, "svg", 11), v(12, "path", 12), d()(), Ze(), u(13, "a", 13), v(14, "i", 14), d(), u(15, "a", 15), v(16, "i", 16), d()()(), u(17, "div", 17)(18, "ul", 18)(19, "li")(20, "a", 19), h(21, " HOME "), d()(), u(22, "li")(23, "a", 19), h(24, " OUR PROJECTS "), d()(), u(25, "li")(26, "a", 19), h(27, " OUR TEAM "), d()(), u(28, "li")(29, "a", 19), h(30, " NEWS FAQ "), d()(), u(31, "li")(32, "a", 19), h(33, " DOCUMENTS "), d()()()()()()(), u(34, "div", 20)(35, "div", 3)(36, "div", 21)(37, "div", 22)(38, "p", 23), h(39), u(40, "a", 19), h(41, "IKO."), d(), h(42, " All rights reserved."), d()(), u(43, "div", 24)(44, "ul", 25)(45, "li")(46, "a", 26), h(47, " Job & Career "), d()(), u(48, "li")(49, "a", 27), h(50, " Terms and Condition "), d()(), u(51, "li")(52, "a", 27), h(53, " Help Center "), d()()()()()()()()), r & 2 && (y(39), ye("Copyright \xA9 ", o.date, " "))
        },
        dependencies: [H]
    });
    let t = e;
    return t
})();
var yy = (() => {
    let e = class e {
        constructor(i) {
            this.utilsService = i
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)(P(Ae))
    }, e.\u0275cmp = T({
        type: e,
        selectors: [["app-home-main"]],
        standalone: !0,
        features: [x],
        decls: 13,
        vars: 2,
        consts: [[1, "home-purple-gradient"]],
        template: function (r, o) {
            r & 1 && (u(0, "div", 0), v(1, "app-header-one")(2, "app-hero-one")(3, "app-brand-one")(4, "app-why-choose-one")(5, "app-intro-area-one")(6, "app-roadmap-one")(7, "app-invest-area")(8, "app-team-area")(9, "app-partners")(10, "app-events")(11, "app-faq-one")(12, "app-footer-one"), d()), r & 2 && ee("mobile-menu-visible", o.utilsService.openMobileMenus)
        },
        dependencies: [U0, G0, sy, ay, ly, cy, uy, dy, hy, my, gy, vy]
    });
    let t = e;
    return t
})();
var Ni = () => ["active"], wy = () => ({exact: !0}), by = (() => {
    let e = class e {
        constructor(i, r) {
            this.utilsService = i, this.router = r, this.sticky = !1
        }

        scrollToFragment(i) {
            setTimeout(() => {
                let r = document.getElementById(i);
                if (r) {
                    let o = r.offsetTop - 60;
                    console.log("element offset", r, o), window.scrollTo({top: o, behavior: "smooth"})
                }
            }, 100)
        }

        navigateWithOffset(i) {
            this.router.navigate(["/home/home-two"], {fragment: i}), this.scrollToFragment(i)
        }

        isFeatureRouteActive() {
            return this.router.url === "/home/home-two#feature"
        }

        isBlockchainRouteActive() {
            return this.router.url === "/home/home-two#blockchain"
        }

        onscroll() {
            window.scrollY > 100 ? this.sticky = !0 : this.sticky = !1
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)(P(Ae), P(Me))
    }, e.\u0275cmp = T({
        type: e,
        selectors: [["app-header-two"]],
        hostBindings: function (r, o) {
            r & 1 && j("scroll", function (a) {
                return o.onscroll(a)
            }, !1, ar)
        },
        standalone: !0,
        features: [x],
        decls: 49,
        vars: 25,
        consts: [["id", "header", 1, "header-layout1"], ["id", "sticky-header", 1, "menu-area", "transparent-header"], [1, "container", "custom-container"], [1, "row"], [1, "col-12"], [1, "menu-wrap"], [1, "menu-nav"], [1, "logo"], ["routerLink", "/home"], ["src", "./assets/logo.png", "alt", "Logo", 2, "height", "35px"], [1, "navbar-wrap", "main-menu", "d-none", "d-lg-flex"], [1, "navigation"], [1, "menu-item-has-children", 3, "routerLinkActive"], ["routerLink", "/home", 1, "section-link"], [1, "sub-menu"], [3, "routerLinkActive", "routerLinkActiveOptions"], [3, "routerLinkActive"], ["routerLink", "/home/home-two"], [1, "section-link", "pointer", 3, "click"], ["routerLink", "/blog"], ["routerLink", "/blog-details/3"], ["routerLink", "/contact"], [1, "header-action"], [1, "list-wrap"], [1, "header-login"], ["routerLink", "/contact", 1, "btn2"], [1, "mobile-nav-toggler", 3, "click"], [1, "fas", "fa-bars"], [3, "menuTwo"]],
        template: function (r, o) {
            r & 1 && (u(0, "header", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div", 4)(5, "div", 5)(6, "nav", 6)(7, "div", 7)(8, "a", 8), v(9, "img", 9), d()(), u(10, "div", 10)(11, "ul", 11)(12, "li", 12)(13, "a", 13), h(14, "Home"), d(), u(15, "ul", 14)(16, "li", 15)(17, "a", 8), h(18, "ICO Investment"), d()(), u(19, "li", 16)(20, "a", 17), h(21, "Blockchain"), d()()()(), u(22, "li")(23, "a", 18), j("click", function () {
                return o.navigateWithOffset("blockchain")
            }), h(24, " Why Blockchain "), d()(), u(25, "li")(26, "a", 18), j("click", function () {
                return o.navigateWithOffset("feature")
            }), h(27, "Feature"), d()(), u(28, "li", 12)(29, "a", 19), h(30, "blog"), d(), u(31, "ul", 14)(32, "li", 15)(33, "a", 19), h(34, "Our Blog"), d()(), u(35, "li", 16)(36, "a", 20), h(37, "Blog Details"), d()()()(), u(38, "li", 16)(39, "a", 21), h(40, "Contact"), d()()()(), u(41, "div", 22)(42, "ul", 23)(43, "li", 24)(44, "a", 25), h(45, "LOGIN"), d()()()(), u(46, "div", 26), j("click", function () {
                return o.utilsService.openMobileMenus = !o.utilsService.openMobileMenus
            }), v(47, "i", 27), d()()()()()()(), v(48, "app-mobile-offcanvas", 28), d()), r & 2 && (y(), ee("sticky-menu", o.sticky), y(11), D("routerLinkActive", se(16, Ni)), y(4), D("routerLinkActive", se(17, Ni))("routerLinkActiveOptions", se(18, wy)), y(3), D("routerLinkActive", se(19, Ni)), y(3), ee("active", o.isBlockchainRouteActive()), y(3), ee("active", o.isFeatureRouteActive()), y(3), D("routerLinkActive", se(20, Ni)), y(4), D("routerLinkActive", se(21, Ni))("routerLinkActiveOptions", se(22, wy)), y(3), D("routerLinkActive", se(23, Ni)), y(3), D("routerLinkActive", se(24, Ni)), y(10), D("menuTwo", !0))
        },
        dependencies: [H, Ee, he, qn, Mr]
    });
    let t = e;
    return t
})();
var Ey = (() => {
    let e = class e {
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275cmp = T({
        type: e,
        selectors: [["app-hero-two"]],
        standalone: !0,
        features: [x],
        decls: 30,
        vars: 0,
        consts: [[1, "hero-wrapper", "hero-2"], [1, "hero-bg-gradient1"], [1, "hero-bg-gradient2"], [1, "hero-gradient-ball", "alltuchtopdown"], [1, "ripple-shape"], [1, "ripple-1"], [1, "ripple-2"], [1, "ripple-3"], [1, "ripple-4"], [1, "ripple-5"], [1, "container"], [1, "hero-style2"], [1, "row"], [1, "col-lg-12"], [1, "hero-subtitle"], [1, "hero-title"], ["src", "/assets/img/update/hero/bitcoin.svg", "alt", "img", 1, "bitcoin"], [1, "btn-wrap"], [1, "hero-title2"], [1, "hero-content"], [1, "hero-text"], ["routerLink", "/contact", 1, "btn", "btn3"]],
        template: function (r, o) {
            r & 1 && (u(0, "div", 0), v(1, "div", 1)(2, "div", 2)(3, "div", 3), u(4, "div", 4), v(5, "span", 5)(6, "span", 6)(7, "span", 7)(8, "span", 8)(9, "span", 9), d(), u(10, "div", 10)(11, "div", 11)(12, "div", 12)(13, "div", 13)(14, "h6", 14), h(15, "GET NEW SOLUTION"), d(), u(16, "h1", 15), h(17, "Blockcha"), u(18, "span"), h(19, " i"), v(20, "img", 16), d(), h(21, "n "), d(), u(22, "div", 17)(23, "h3", 18), h(24, "Technology for business"), d(), u(25, "div", 19)(26, "p", 20), h(27, "We\u2019ve worked with over 400 companies to build blockchain solutions for their business, and we are still growing."), d(), u(28, "a", 21), h(29, " Get Started Today "), d()()()()()()()())
        }
    });
    let t = e;
    return t
})();

function uA(t, e) {
    if (t & 1 && (u(0, "div", 10)(1, "div", 11), v(2, "img", 12), d()()), t & 2) {
        let n = e.$implicit;
        y(2), D("src", n, pe)
    }
}

var Sy = (() => {
    let e = class e {
        constructor() {
            this.brands = ["./assets/client-2-1.svg", "./assets/client-2-2.svg", "./assets/client-2-3.svg", "./assets/client-2-4.svg", "./assets/client-2-5.svg", "./assets/client-2-1.svg", "./assets/client-2-2.svg", "./assets/client-2-3.svg"]
        }

        ngOnInit() {
            new He(".brand-active2", {
                slidesPerView: 5,
                spaceBetween: 0,
                loop: !1,
                breakpoints: {
                    1200: {slidesPerView: 5},
                    992: {slidesPerView: 4},
                    768: {slidesPerView: 3},
                    576: {slidesPerView: 2},
                    0: {slidesPerView: 2}
                }
            })
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275cmp = T({
        type: e,
        selectors: [["app-brand-two"]],
        standalone: !0,
        features: [x],
        decls: 11,
        vars: 1,
        consts: [[1, "brand-area3"], [1, "container"], [1, "row", "g-0"], [1, "col-lg-12"], [1, "brand-title2", "text-center"], [1, "title"], [1, "brand-item-wrap3"], [1, "row", "g-0", "brand-active2", "swiper"], [1, "swiper-wrapper", "p-0"], ["class", "col-12 swiper-slide", 4, "ngFor", "ngForOf"], [1, "col-12", "swiper-slide"], [1, "brand-item"], ["alt", "brand-logo", 3, "src"]],
        template: function (r, o) {
            r & 1 && (u(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div", 4)(5, "h6", 5), h(6, "Backed by leading Blockchain investors and founders"), d()()()(), u(7, "div", 6)(8, "div", 7)(9, "div", 8), Y(10, uA, 3, 1, "div", 9), d()()()()()), r & 2 && (y(10), D("ngForOf", o.brands))
        },
        dependencies: [H, we]
    });
    let t = e;
    return t
})();
var Cy = (() => {
    let e = class e {
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275cmp = T({
        type: e,
        selectors: [["app-feature-one"]],
        standalone: !0,
        features: [x],
        decls: 55,
        vars: 0,
        consts: [["id", "blockchain", 1, "feature-area-2", "pt-110", "pb-140", "position-relative", "overflow-hidden", 2, "background-image", "url(./assets/feature-area-bg.png)", "background-size", "cover", "background-position", "center"], [1, "feature-area-shape"], ["src", "/assets/img/update/feature/feature-shape-2-1.png", "alt", "img", 1, "feature-shape2-1", "alltuchtopdown"], ["src", "/assets/img/update/feature/feature-shape-2-2.png", "alt", "img", 1, "feature-shape2-2", "alltuchtopdown"], ["src", "/assets/img/update/feature/feature-shape-2-3.png", "alt", "img", 1, "feature-shape2-3", "leftToRight"], [1, "container"], [1, "row", "justify-content-center"], [1, "col-xl-5", "col-lg-8"], [1, "section-title", "text-center", "mb-50"], [1, "sub-title"], [1, "title", "style2"], [1, "sec-text"], [1, "feature-grid-wrap"], [1, "feature-card-grid"], [1, "feature-card-details"], [1, "feature-card-title"], [1, "feature-card-text"], [1, "checklist"], [1, "fas", "fa-circle"], [1, "feature-card-img"], ["src", "/assets/img/update/feature/feature-card-thumb-1.png", "alt", "img", 1, "alltuchtopdown"], ["src", "/assets/img/update/feature/feature-card-thumb-2.png", "alt", "img"], ["src", "/assets/img/update/feature/feature-card-thumb-3.png", "alt", "img"]],
        template: function (r, o) {
            r & 1 && (u(0, "div", 0)(1, "div", 1), v(2, "img", 2)(3, "img", 3)(4, "img", 4), d(), u(5, "div", 5)(6, "div", 6)(7, "div", 7)(8, "div", 8)(9, "span", 9), h(10, "ABOUT BLOCKCHAIN"), d(), u(11, "h2", 10), h(12, "Why blockchain?"), d(), u(13, "p", 11), h(14, "We\u2019ve worked with over 400 companies to build blockchain solutions for their business, and we are still growing. "), d()()()(), u(15, "div", 12)(16, "div", 13)(17, "div", 14)(18, "h3", 15), h(19, "Flexibility"), d(), u(20, "p", 16), h(21, "We\u2019ve worked with over 400 companies to build blockchain solutions for their business."), d(), u(22, "div", 17)(23, "ul")(24, "li"), v(25, "i", 18), h(26, " Blockchain solutions for their business."), d(), u(27, "li"), v(28, "i", 18), h(29, " Blockchain solutions for their business."), d(), u(30, "li"), v(31, "i", 18), h(32, " Blockchain solutions for their business."), d()()()(), u(33, "div", 19), v(34, "img", 20), d()(), u(35, "div", 13)(36, "div", 14)(37, "h3", 15), h(38, "Transference"), d(), u(39, "p", 16), h(40, "We\u2019ve worked with over 400 companies to build blockchain solutions for their business."), d(), u(41, "p", 16), h(42, "We\u2019ve worked with over 400 companies to build"), d()(), u(43, "div", 19), v(44, "img", 21), d()(), u(45, "div", 13)(46, "div", 14)(47, "h3", 15), h(48, "Secure & Safe"), d(), u(49, "p", 16), h(50, "We\u2019ve worked with over 400 companies to build blockchain solutions for their business."), d(), u(51, "p", 16), h(52, "We\u2019ve worked with over 400 companies to build"), d()(), u(53, "div", 19), v(54, "img", 22), d()()()()())
        }
    });
    let t = e;
    return t
})();
var Dy = (() => {
    let e = class e {
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275cmp = T({
        type: e,
        selectors: [["app-feature-two"]],
        standalone: !0,
        features: [x],
        decls: 34,
        vars: 0,
        consts: [["id", "feature", 1, "pt-140", "pb-140", "overflow-hidden", "position-relative", "z-index-common"], [1, "bg-gradient-5"], [1, "feature-shape-3-1", "alltuchtopdown"], [1, "feature-shape-3-2", "alltuchtopdown"], [1, "container"], [1, "row"], [1, "col-xl-6", "text-center"], [1, "feature-thumb-wrap"], ["src", "./assets/intro_1-1.png", "alt", "img", 1, "feature-thumb-3-1", "alltuchtopdown"], ["src", "/assets/img/update/feature/feature-thumb-3-1.png", "alt", "img", 1, "feature-thumb-3-2"], [1, "feature-thumb-circle", "spin"], [1, "col-xl-5"], [1, "section-title", "mb-75"], [1, "sub-title", "text-white"], [1, "title", "style2"], [1, "mt-25"], ["href", "#", 1, "text-decoration-underline", "text-white"], [1, "counter-grid-wrap"], [1, "counter-wrap"], [1, "counter-card"], [1, "counter-card_number"], [1, "counter-card_text"]],
        template: function (r, o) {
            r & 1 && (u(0, "div", 0), v(1, "div", 1)(2, "div", 2)(3, "div", 3), u(4, "div", 4)(5, "div", 5)(6, "div", 6)(7, "div", 7), v(8, "img", 8)(9, "img", 9)(10, "div", 10), d()(), u(11, "div", 11)(12, "div", 12)(13, "span", 13), h(14, "FEATURES"), d(), u(15, "h2", 14), h(16, "Blockchain spreads trust everywhere"), d(), u(17, "p", 15), h(18, "Our team has created blockchain solutions for over 400 companies, and we are still growing. From less paperwork and fewer disputes, to happier customers and entirely new business methods, "), u(19, "a", 16), h(20, "a shared record of truth is invaluable."), d()()(), u(21, "div", 17)(22, "div", 18)(23, "div", 19)(24, "h3", 20), h(25, " 63M "), d(), u(26, "p", 21), h(27, "Blockchain users"), d()()(), u(28, "div", 18)(29, "div", 19)(30, "h3", 20), h(31, " 24% "), d(), u(32, "p", 21), h(33, "Companies use blockchain"), d()()()()()()()())
        }
    });
    let t = e;
    return t
})();
var Iy = (() => {
    let e = class e {
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275cmp = T({
        type: e,
        selectors: [["app-feature-three"]],
        standalone: !0,
        features: [x],
        decls: 46,
        vars: 0,
        consts: [[1, "pt-140", "pb-140", "overflow-hidden", "position-relative", "z-index-common"], [1, "feature-shape-4-1", "spin"], [1, "feature-shape-4-2", "alltuchtopdown"], [1, "feature-shape-4-3", "alltuchtopdown"], [1, "feature-shape-4-4"], [1, "container"], [1, "row", "justify-content-between", "align-items-center"], [1, "col-xl-5"], [1, "section-title", "mb-50"], [1, "sub-title"], [1, "title", "style2"], [1, "mt-25"], [1, "col-xl-6"], [1, "feature-category-list", "mb-xl-0", "mb-60"], ["routerLink", "/blog-details/3"], [1, "feature-wrap-4"], [1, "row", "align-items-center"], [1, "col-lg-6"], [1, "feature-wrap4-thumb", "text-center", "alltuchtopdown"], ["src", "./assets/why_1-1.png", "alt", "img"], [1, "section-title", "mb-0"], [1, "sub-title", "text-title"], [1, "title", "style2", "text-title"], [1, "text-title", "mt-20", "mb-55"], ["href", "#", 1, "text-title", "text-decoration-underline"], ["routerLink", "/contact", 1, "btn", "btn", "btn3"]],
        template: function (r, o) {
            r & 1 && (u(0, "div", 0), v(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div", 4), u(5, "div", 5)(6, "div", 6)(7, "div", 7)(8, "div", 8)(9, "span", 9), h(10, "POSSIBILITIES"), d(), u(11, "h2", 10), h(12, "What does it mean for your business?"), d(), u(13, "p", 11), h(14, "We\u2019ve worked with over 400 companies to build blockchain solutions for their business, and we are still growing. "), d()()(), u(15, "div", 12)(16, "ul", 13)(17, "li")(18, "a", 14), h(19, "Smart contracts"), d()(), u(20, "li")(21, "a", 14), h(22, "Paying employees"), d()(), u(23, "li")(24, "a", 14), h(25, "Cloud storage"), d()(), u(26, "li")(27, "a", 14), h(28, "Electronic voting"), d()()()()(), u(29, "div", 15)(30, "div", 16)(31, "div", 17)(32, "div", 18), v(33, "img", 19), d()(), u(34, "div", 17)(35, "div", 20)(36, "span", 21), h(37, "FEATURES"), d(), u(38, "h2", 22), h(39, "What does it mean for your business?"), d(), u(40, "p", 23), h(41, "Our team has created blockchain solutions for over 400 companies, and we are still growing. From less paperwork and fewer disputes, to happier customers and entirely new business methods, "), u(42, "a", 24), h(43, "a shared record of truth is invaluable."), d()(), u(44, "a", 25), h(45, " Get started "), d()()()()()()())
        },
        dependencies: [Ee, he]
    });
    let t = e;
    return t
})();

function dA(t, e) {
    if (t & 1 && (u(0, "div", 21)(1, "div", 22)(2, "div", 23)(3, "div", 24), v(4, "img", 25), d(), u(5, "div", 26)(6, "h4", 27), h(7), d(), u(8, "span", 28), h(9), d()(), u(10, "div", 29), v(11, "i", 30)(12, "i", 30)(13, "i", 30)(14, "i", 30)(15, "i", 30), d()(), u(16, "p", 31), h(17), d()()()), t & 2) {
        let n = e.$implicit;
        y(4), D("src", n.image, pe), y(3), $(n.name), y(2), $(n.designation), y(8), $(n.text)
    }
}

var My = (() => {
    let e = class e {
        constructor() {
            this.testimonial_data = [{
                name: "Romero Eli",
                designation: "Developer",
                rating: 5,
                text: "I've tested numerous technologies, but this one is leaps and bounds ahead of the competition. It's phenomenal.",
                image: "/assets/img/update/testimonial/testi_thumb1_1.png"
            }, {
                name: "Gierre Goles",
                designation: "Product Designers",
                rating: 5,
                text: "I can't express how impressed I am with this technology. It outshines anything I've ever used before & up to the mark.",
                image: "/assets/img/update/testimonial/testi_thumb1_2.png"
            }, {
                name: "Benjamin Smith",
                designation: "Marketer",
                rating: 5,
                text: "I've tested numerous technologies, but this one is leaps and bounds ahead of the competition. It's phenomenal.",
                image: "/assets/img/update/testimonial/testi_thumb1_1.png"
            }, {
                name: "Vincent Smith",
                designation: "Designer",
                rating: 5,
                text: "I can't express how impressed I am with this technology. It outshines anything I've ever used before & up to the mark.",
                image: "/assets/img/update/testimonial/testi_thumb1_2.png"
            }]
        }

        ngOnInit() {
            this.swiperInstance = new He(".testimonial-slider1", {
                slidesPerView: 2,
                spaceBetween: 150,
                loop: !1,
                breakpoints: {
                    1400: {slidesPerView: 2},
                    1200: {slidesPerView: 2},
                    992: {slidesPerView: 2},
                    768: {slidesPerView: 1},
                    576: {slidesPerView: 1},
                    0: {slidesPerView: 1}
                }
            })
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275cmp = T({
        type: e,
        selectors: [["app-testimonial"]],
        standalone: !0,
        features: [x],
        decls: 23,
        vars: 1,
        consts: [[1, "pb-140", "overflow-hidden"], [1, "container"], [1, "row", "justify-content-center"], [1, "col-lg-8"], [1, "section-title", "text-center", "mb-50"], [1, "sub-title"], [1, "title", "style2"], [1, "testimonial-wrap-3"], [1, "testimonial-wrap-circle1", "alltuchtopdown"], [1, "testimonial-wrap-circle2", "leftToRight"], [1, "testimonial-wrap-circle3", "leftToRight"], [1, "testimonial-wrap-bg", "alltuchtopdown"], ["src", "./assets/testimonial-4-bg.png", "alt", "img"], [1, "slider-area", "testimonial-slider-wrap"], [1, "testimonial-slider1", "swiper"], [1, "swiper-wrapper", "p-0"], ["class", "slider-item swiper-slide", 4, "ngFor", "ngForOf"], [1, "slider-arrow", "prev-btn", 3, "click"], [1, "fas", "fa-arrow-left"], [1, "slider-arrow", "next-btn", 3, "click"], [1, "fas", "fa-arrow-right"], [1, "slider-item", "swiper-slide"], [1, "testi-box"], [1, "testi-box-profile"], [1, "testi-box-profile-thumb"], ["alt", "img", 3, "src"], [1, "testi-box-profile-details"], [1, "testi-box_name"], [1, "testi-box_desig"], [1, "testi-box-profile-ratting"], [1, "fas", "fa-star"], [1, "testi-box_text"]],
        template: function (r, o) {
            r & 1 && (u(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div", 4)(5, "span", 5), h(6, "TESTIMONIAL"), d(), u(7, "h2", 6), h(8, "Over 400 companies have already tried blockchain"), d()()()(), u(9, "div", 7), v(10, "div", 8)(11, "div", 9)(12, "div", 10), u(13, "div", 11), v(14, "img", 12), d(), u(15, "div", 13)(16, "div", 14)(17, "div", 15), Y(18, dA, 18, 4, "div", 16), d()(), u(19, "button", 17), j("click", function () {
                return o.swiperInstance == null ? null : o.swiperInstance.slidePrev()
            }), v(20, "i", 18), d(), u(21, "button", 19), j("click", function () {
                return o.swiperInstance == null ? null : o.swiperInstance.slideNext()
            }), v(22, "i", 20), d()()()()()), r & 2 && (y(18), D("ngForOf", o.testimonial_data))
        },
        dependencies: [H, we]
    });
    let t = e;
    return t
})();
var _y = (() => {
    let e = class e {
        constructor(i) {
            this.utilsService = i
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)(P(Ae))
    }, e.\u0275cmp = T({
        type: e,
        selectors: [["app-video-popup"]],
        standalone: !0,
        features: [x],
        decls: 3,
        vars: 0,
        consts: [["id", "video-overlay", 1, "video-overlay", 3, "click"], [1, "video-overlay-close"]],
        template: function (r, o) {
            r & 1 && (u(0, "div", 0), j("click", function () {
                return o.utilsService.closeVideo()
            }), u(1, "a", 1), h(2, "\xD7"), d()())
        },
        dependencies: [H]
    });
    let t = e;
    return t
})();
var Ty = (() => {
    let e = class e {
        constructor(i) {
            this.utilsService = i
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)(P(Ae))
    }, e.\u0275cmp = T({
        type: e,
        selectors: [["app-cta-one"]],
        standalone: !0,
        features: [x],
        decls: 26,
        vars: 0,
        consts: [[1, "pt-140", "pb-140", "position-relative", "z-index-common"], [1, "bg-gradient-5"], [1, "cta-2-shape1", "alltuchtopdown"], ["src", "./assets/cta-2-shape1.png", "alt", "img"], [1, "cta-2-shape2", "alltuchtopdown"], [1, "cta-2-shape3", "leftToRight"], [1, "container"], [1, "cta-wrap2", "pt-140", "pb-140", 2, "background-image", "url(./assets/cta-2-bg.png)", "background-size", "cover"], [1, "row", "gy-40", "align-items-center"], [1, "col-xl-6", "col-lg-8"], [1, "section-title", "mb-50"], [1, "sub-title", "text-white"], [1, "title", "style2"], [1, "sec-text", "text-white"], ["routerLink", "/contact", 1, "btn", "btn3"], [1, "col-xl-6", "col-lg-4"], [1, "text-lg-center"], ["href", "javascript:void(0)", 1, "play-btn", "popup-video", 3, "click"], ["width", "22", "height", "23", "viewBox", "0 0 22 23", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M1.66602 11.6553V7.50193C1.66602 2.34526 5.31768 0.233597 9.78602 2.81193L13.391 4.8886L16.996 6.96526C21.4643 9.5436 21.4643 13.7669 16.996 16.3453L13.391 18.4219L9.78602 20.4986C5.31768 23.0769 1.66602 20.9653 1.66602 15.8086V11.6553Z", "stroke", "white", "stroke-width", "2", "stroke-miterlimit", "10", "stroke-linecap", "round", "stroke-linejoin", "round"]],
        template: function (r, o) {
            r & 1 && (u(0, "div", 0), v(1, "div", 1), u(2, "div", 2), v(3, "img", 3), d(), v(4, "div", 4)(5, "div", 5), u(6, "div", 6)(7, "div", 7)(8, "div", 8)(9, "div", 9)(10, "div", 10)(11, "span", 11), h(12, "TECHNOLOGY"), d(), u(13, "h2", 12), h(14, "How does blockchain work for business?"), d(), u(15, "p", 13), h(16, "We\u2019ve worked with over 400 companies to build blockchain solutions for their business, and we are still growing."), d()(), u(17, "a", 14), h(18, " Get started "), d()(), u(19, "div", 15)(20, "div", 16)(21, "a", 17), j("click", function () {
                return o.utilsService.playVideo("go7QYaQR494")
            }), u(22, "i"), Ke(), u(23, "svg", 18), v(24, "path", 19), d()()()()()()()()(), Ze(), v(25, "app-video-popup"))
        },
        dependencies: [H, _y, Ee, he]
    });
    let t = e;
    return t
})();

function fA(t, e) {
    if (t & 1 && (u(0, "div", 12)(1, "div", 13)(2, "button", 14), h(3), d()(), u(4, "div", 15)(5, "div", 16)(6, "p", 17), h(7), d()()()()), t & 2) {
        let n = e.$implicit;
        y(2), ee("collapsed", !n.active), Vt("data-bs-target", "#collapse-" + n.id)("aria-expanded", n.active ? "true" : "false")("aria-controls", "collapse-" + n.id), y(), ye(" ", n.question, " "), y(), ee("show", n.active), Vt("id", "collapse-" + n.id)("aria-labelledby", "collapse-item-" + n.id), y(3), $(n.answer)
    }
}

var xy = (() => {
    let e = class e {
        constructor() {
            this.faq_data = [{
                id: 1,
                active: !0,
                question: "What is blockchain technology?",
                answer: "It's very simple! Register here. In your personal account, create a wallet where you can store your FOX tokens. Then just send any amount to the displayed address in your office."
            }, {
                id: 2,
                question: "What is Bitcoin?",
                answer: "It's very simple! Register here. In your personal account, create a wallet where you can store your FOX tokens. Then just send any amount to the displayed address in your office."
            }, {
                id: 3,
                question: "Who created Bitcoin?",
                answer: "It's very simple! Register here. In your personal account, create a wallet where you can store your FOX tokens. Then just send any amount to the displayed address in your office."
            }, {
                id: 4,
                question: "What is cryptocurrency?",
                answer: "It's very simple! Register here. In your personal account, create a wallet where you can store your FOX tokens. Then just send any amount to the displayed address in your office."
            }, {
                id: 5,
                question: "How does cryptocurrency  work?",
                answer: "It's very simple! Register here. In your personal account, create a wallet where you can store your FOX tokens. Then just send any amount to the displayed address in your office."
            }]
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275cmp = T({
        type: e,
        selectors: [["app-faq-two"]],
        standalone: !0,
        features: [x],
        decls: 16,
        vars: 1,
        consts: [[1, "pt-140", "pb-140", "overflow-hidden", "position-relative", "z-index-common"], [1, "faq-2-shape-1"], [1, "container"], [1, "row", "justify-content-center"], [1, "col-xl-6", "text-center"], [1, "section-title", "mb-50"], [1, "sub-title"], [1, "title", "style2"], [1, "sec-text"], [1, "col-lg-10"], ["id", "faqAccordion", 1, "accordion-area", "accordion"], ["class", "accordion-card style2", 4, "ngFor", "ngForOf"], [1, "accordion-card", "style2"], ["id", "collapse-item-1", 1, "accordion-header"], ["type", "button", "data-bs-toggle", "collapse", 1, "accordion-button"], ["data-bs-parent", "#faqAccordion", 1, "accordion-collapse", "collapse"], [1, "accordion-body"], [1, "faq-text"]],
        template: function (r, o) {
            r & 1 && (u(0, "div", 0), v(1, "div", 1), u(2, "div", 2)(3, "div", 3)(4, "div", 4)(5, "div", 5)(6, "span", 6), h(7, "FAQ"), d(), u(8, "h2", 7), h(9, "Popular questions about blockchain"), d(), u(10, "p", 8), h(11, "We\u2019ve worked with over 400 companies to build blockchain solutions for their business, and we are still growing."), d()()()(), u(12, "div", 3)(13, "div", 9)(14, "div", 10), Y(15, fA, 8, 11, "div", 11), d()()()()()), r & 2 && (y(15), D("ngForOf", o.faq_data))
        },
        dependencies: [H, we]
    });
    let t = e;
    return t
})();
var Ay = (() => {
    let e = class e {
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275cmp = T({
        type: e,
        selectors: [["app-cta-two"]],
        standalone: !0,
        features: [x],
        decls: 13,
        vars: 0,
        consts: [[1, "pb-120", "position-relative", "z-index-common"], [1, "container"], [1, "cta-wrap3"], [1, "cta-wrap-details"], [1, "section-title", "mb-20"], [1, "title", "style2", "text-title"], [1, "sec-text", "text-title"], ["routerLink", "/contact", 1, "btn", "btn3"], [1, "cta-3-thumb", "movingX"], ["src", "./assets/cta_3-1.png", "alt", "img"]],
        template: function (r, o) {
            r & 1 && (u(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div", 4)(5, "h2", 5), h(6, "Be part of the future"), d(), u(7, "p", 6), h(8, "We\u2019ve worked with over 400 companies to build blockchain solutions for their business."), d()(), u(9, "a", 7), h(10, " Get started "), d()(), u(11, "div", 8), v(12, "img", 9), d()()()())
        },
        dependencies: [Ee, he]
    });
    let t = e;
    return t
})();
var Ny = (() => {
    let e = class e {
        constructor() {
            this.date = new Date().getFullYear()
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275cmp = T({
        type: e,
        selectors: [["app-footer-two"]],
        standalone: !0,
        features: [x],
        decls: 50,
        vars: 1,
        consts: [[1, "footer-wrapper", "footer-layout2", "pb-50"], [1, "container"], [1, "row", "justify-content-between"], [1, "col-xl-auto", "col-lg-6", "order-xl-1"], [1, "widget", "footer-widget"], [1, "widget-about"], [1, "footer-logo"], ["routerLink", "/home"], ["src", "./assets/logo.png", "alt", "iko", 2, "height", "35px"], [1, "about-text"], [1, "social-btn", "style2"], ["href", "https://facebook.com/", "target", "_blank"], [1, "fab", "fa-facebook-f"], ["href", "https://www.twitter.com/", "target", "_blank"], ["xmlns", "http://www.w3.org/2000/svg", "width", "16", "height", "16", "viewBox", "0 0 16 16", "fill", "none"], ["d", "M10.0596 7.34522L15.8879 0.570312H14.5068L9.44607 6.45287L5.40411 0.570312H0.742188L6.85442 9.46578L0.742188 16.5703H2.12338L7.4676 10.3581L11.7362 16.5703H16.3981L10.0593 7.34522H10.0596ZM8.16787 9.54415L7.54857 8.65836L2.62104 1.61005H4.74248L8.71905 7.29827L9.33834 8.18405L14.5074 15.5779H12.386L8.16787 9.54449V9.54415Z", "fill", "currentColor"], ["href", "https://www.instagram.com/", "target", "_blank"], [1, "fab", "fa-instagram"], ["href", "https://www.linkedin.com/", "target", "_blank"], [1, "fab", "fa-linkedin"], [1, "col-xl-auto", "col-lg-6", "order-xl-3"], [1, "footer-widget", "widget-newsletter"], [1, "fw-title"], [1, "newsletter-text"], [1, "newsletter-form"], [1, "form-group"], ["type", "email", "placeholder", "Your Email Address", "required", "", 1, "form-control"], ["type", "submit", 1, "btn", "btn5"], [1, "col-xl-auto", "col-lg-6", "order-xl-2"], [1, "footer-widget", "widget-contact"], [1, "contact-info-text"], [1, "contact-info-link"], ["href", "tel:8002758777"], ["href", "mailto:iko@company.com"], [1, "copyright-text"], ["href", "#"]],
        template: function (r, o) {
            r & 1 && (u(0, "footer", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div", 4)(5, "div", 5)(6, "div", 6)(7, "a", 7), v(8, "img", 8), d()(), u(9, "p", 9), h(10, "Iko is a cutting-edge blockchain technology company at the forefront of innovation in the decentralized ledger space. Established in 2024"), d(), u(11, "div", 10)(12, "a", 11), v(13, "i", 12), d(), u(14, "a", 13), Ke(), u(15, "svg", 14), v(16, "path", 15), d()(), Ze(), u(17, "a", 16), v(18, "i", 17), d(), u(19, "a", 18), v(20, "i", 19), d()()()()(), u(21, "div", 20)(22, "div", 21)(23, "h3", 22), h(24, "SIGN UP FOR EMAIL UPDATES"), d(), u(25, "p", 23), h(26, "Sign up with your email address to receive news and updates"), d(), u(27, "form", 24)(28, "div", 25), v(29, "input", 26), d(), u(30, "button", 27), h(31, "Subscribe"), d()()()(), u(32, "div", 28)(33, "div", 29)(34, "h3", 22), h(35, "CONTACT US"), d(), u(36, "p", 30), h(37, "202 Helga Springs Rd, Crawford, TN 38554"), d(), u(38, "div", 31), h(39, "Call Us: "), u(40, "a", 32), h(41, "800.275.8777"), d()(), u(42, "div", 31)(43, "a", 33), h(44, "iko@company.com"), d()(), u(45, "p", 34), h(46), u(47, "a", 35), h(48, "IKO."), d(), h(49, " All rights reserved."), d()()()()()()), r & 2 && (y(46), ye("Copyright \xA9 ", o.date, " "))
        }
    });
    let t = e;
    return t
})();
var Oy = (() => {
    let e = class e {
        constructor(i) {
            this.utilsService = i
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)(P(Ae))
    }, e.\u0275cmp = T({
        type: e,
        selectors: [["app-home-two"]],
        standalone: !0,
        features: [x],
        decls: 12,
        vars: 2,
        consts: [[1, "home-purple-gradient"]],
        template: function (r, o) {
            r & 1 && (u(0, "div", 0), v(1, "app-header-two")(2, "app-hero-two")(3, "app-brand-two")(4, "app-feature-one")(5, "app-feature-two")(6, "app-feature-three")(7, "app-testimonial")(8, "app-cta-one")(9, "app-faq-two")(10, "app-cta-two")(11, "app-footer-two"), d()), r & 2 && ee("mobile-menu-visible", o.utilsService.openMobileMenus)
        },
        dependencies: [H, by, Ey, Sy, Cy, Dy, Iy, My, Ty, xy, Ay, Ny]
    });
    let t = e;
    return t
})();
var $y = (() => {
    let e = class e {
        constructor(i, r) {
            this._renderer = i, this._elementRef = r, this.onChange = o => {
            }, this.onTouched = () => {
            }
        }

        setProperty(i, r) {
            this._renderer.setProperty(this._elementRef.nativeElement, i, r)
        }

        registerOnTouched(i) {
            this.onTouched = i
        }

        registerOnChange(i) {
            this.onChange = i
        }

        setDisabledState(i) {
            this.setProperty("disabled", i)
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)(P(Zt), P(ut))
    }, e.\u0275dir = Ve({type: e});
    let t = e;
    return t
})(), By = (() => {
    let e = class e extends $y {
    };
    e.\u0275fac = (() => {
        let i;
        return function (o) {
            return (i || (i = or(e)))(o || e)
        }
    })(), e.\u0275dir = Ve({type: e, features: [wn]});
    let t = e;
    return t
})(), np = new Z("");
var pA = {provide: np, useExisting: pi(() => Pr), multi: !0};

function hA() {
    let t = Sn() ? Sn().getUserAgent() : "";
    return /android (\d+)/.test(t.toLowerCase())
}

var mA = new Z(""), Pr = (() => {
    let e = class e extends $y {
        constructor(i, r, o) {
            super(i, r), this._compositionMode = o, this._composing = !1, this._compositionMode == null && (this._compositionMode = !hA())
        }

        writeValue(i) {
            let r = i ?? "";
            this.setProperty("value", r)
        }

        _handleInput(i) {
            (!this._compositionMode || this._compositionMode && !this._composing) && this.onChange(i)
        }

        _compositionStart() {
            this._composing = !0
        }

        _compositionEnd(i) {
            this._composing = !1, this._compositionMode && this.onChange(i)
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)(P(Zt), P(ut), P(mA, 8))
    }, e.\u0275dir = Ve({
        type: e,
        selectors: [["input", "formControlName", "", 3, "type", "checkbox"], ["textarea", "formControlName", ""], ["input", "formControl", "", 3, "type", "checkbox"], ["textarea", "formControl", ""], ["input", "ngModel", "", 3, "type", "checkbox"], ["textarea", "ngModel", ""], ["", "ngDefaultControl", ""]],
        hostBindings: function (r, o) {
            r & 1 && j("input", function (a) {
                return o._handleInput(a.target.value)
            })("blur", function () {
                return o.onTouched()
            })("compositionstart", function () {
                return o._compositionStart()
            })("compositionend", function (a) {
                return o._compositionEnd(a.target.value)
            })
        },
        features: [co([pA]), wn]
    });
    let t = e;
    return t
})();

function Xn(t) {
    return t == null || (typeof t == "string" || Array.isArray(t)) && t.length === 0
}

function Hy(t) {
    return t != null && typeof t.length == "number"
}

var Uy = new Z(""), zy = new Z(""),
    gA = /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    ft = class {
        static min(e) {
            return vA(e)
        }

        static max(e) {
            return yA(e)
        }

        static required(e) {
            return wA(e)
        }

        static requiredTrue(e) {
            return bA(e)
        }

        static email(e) {
            return EA(e)
        }

        static minLength(e) {
            return SA(e)
        }

        static maxLength(e) {
            return CA(e)
        }

        static pattern(e) {
            return DA(e)
        }

        static nullValidator(e) {
            return Gy(e)
        }

        static compose(e) {
            return Ky(e)
        }

        static composeAsync(e) {
            return Jy(e)
        }
    };

function vA(t) {
    return e => {
        if (Xn(e.value) || Xn(t)) return null;
        let n = parseFloat(e.value);
        return !isNaN(n) && n < t ? {min: {min: t, actual: e.value}} : null
    }
}

function yA(t) {
    return e => {
        if (Xn(e.value) || Xn(t)) return null;
        let n = parseFloat(e.value);
        return !isNaN(n) && n > t ? {max: {max: t, actual: e.value}} : null
    }
}

function wA(t) {
    return Xn(t.value) ? {required: !0} : null
}

function bA(t) {
    return t.value === !0 ? null : {required: !0}
}

function EA(t) {
    return Xn(t.value) || gA.test(t.value) ? null : {email: !0}
}

function SA(t) {
    return e => Xn(e.value) || !Hy(e.value) ? null : e.value.length < t ? {
        minlength: {
            requiredLength: t,
            actualLength: e.value.length
        }
    } : null
}

function CA(t) {
    return e => Hy(e.value) && e.value.length > t ? {
        maxlength: {
            requiredLength: t,
            actualLength: e.value.length
        }
    } : null
}

function DA(t) {
    if (!t) return Gy;
    let e, n;
    return typeof t == "string" ? (n = "", t.charAt(0) !== "^" && (n += "^"), n += t, t.charAt(t.length - 1) !== "$" && (n += "$"), e = new RegExp(n)) : (n = t.toString(), e = t), i => {
        if (Xn(i.value)) return null;
        let r = i.value;
        return e.test(r) ? null : {pattern: {requiredPattern: n, actualValue: r}}
    }
}

function Gy(t) {
    return null
}

function qy(t) {
    return t != null
}

function Wy(t) {
    return vi(t) ? Te(t) : t
}

function Yy(t) {
    let e = {};
    return t.forEach(n => {
        e = n != null ? k(k({}, e), n) : e
    }), Object.keys(e).length === 0 ? null : e
}

function Qy(t, e) {
    return e.map(n => n(t))
}

function IA(t) {
    return !t.validate
}

function Xy(t) {
    return t.map(e => IA(e) ? e : n => e.validate(n))
}

function Ky(t) {
    if (!t) return null;
    let e = t.filter(qy);
    return e.length == 0 ? null : function (n) {
        return Yy(Qy(n, e))
    }
}

function Zy(t) {
    return t != null ? Ky(Xy(t)) : null
}

function Jy(t) {
    if (!t) return null;
    let e = t.filter(qy);
    return e.length == 0 ? null : function (n) {
        let i = Qy(n, e).map(Wy);
        return Gl(i).pipe(ie(Yy))
    }
}

function ew(t) {
    return t != null ? Jy(Xy(t)) : null
}

function Py(t, e) {
    return t === null ? [e] : Array.isArray(t) ? [...t, e] : [t, e]
}

function tw(t) {
    return t._rawValidators
}

function nw(t) {
    return t._rawAsyncValidators
}

function tp(t) {
    return t ? Array.isArray(t) ? t : [t] : []
}

function yl(t, e) {
    return Array.isArray(t) ? t.includes(e) : t === e
}

function ky(t, e) {
    let n = tp(e);
    return tp(t).forEach(r => {
        yl(n, r) || n.push(r)
    }), n
}

function Fy(t, e) {
    return tp(e).filter(n => !yl(t, n))
}

var wl = class {
    constructor() {
        this._rawValidators = [], this._rawAsyncValidators = [], this._onDestroyCallbacks = []
    }

    get value() {
        return this.control ? this.control.value : null
    }

    get valid() {
        return this.control ? this.control.valid : null
    }

    get invalid() {
        return this.control ? this.control.invalid : null
    }

    get pending() {
        return this.control ? this.control.pending : null
    }

    get disabled() {
        return this.control ? this.control.disabled : null
    }

    get enabled() {
        return this.control ? this.control.enabled : null
    }

    get errors() {
        return this.control ? this.control.errors : null
    }

    get pristine() {
        return this.control ? this.control.pristine : null
    }

    get dirty() {
        return this.control ? this.control.dirty : null
    }

    get touched() {
        return this.control ? this.control.touched : null
    }

    get status() {
        return this.control ? this.control.status : null
    }

    get untouched() {
        return this.control ? this.control.untouched : null
    }

    get statusChanges() {
        return this.control ? this.control.statusChanges : null
    }

    get valueChanges() {
        return this.control ? this.control.valueChanges : null
    }

    get path() {
        return null
    }

    _setValidators(e) {
        this._rawValidators = e || [], this._composedValidatorFn = Zy(this._rawValidators)
    }

    _setAsyncValidators(e) {
        this._rawAsyncValidators = e || [], this._composedAsyncValidatorFn = ew(this._rawAsyncValidators)
    }

    get validator() {
        return this._composedValidatorFn || null
    }

    get asyncValidator() {
        return this._composedAsyncValidatorFn || null
    }

    _registerOnDestroy(e) {
        this._onDestroyCallbacks.push(e)
    }

    _invokeOnDestroyCallbacks() {
        this._onDestroyCallbacks.forEach(e => e()), this._onDestroyCallbacks = []
    }

    reset(e = void 0) {
        this.control && this.control.reset(e)
    }

    hasError(e, n) {
        return this.control ? this.control.hasError(e, n) : !1
    }

    getError(e, n) {
        return this.control ? this.control.getError(e, n) : null
    }
}, Nr = class extends wl {
    get formDirective() {
        return null
    }

    get path() {
        return null
    }
}, Qo = class extends wl {
    constructor() {
        super(...arguments), this._parent = null, this.name = null, this.valueAccessor = null
    }
}, bl = class {
    constructor(e) {
        this._cd = e
    }

    get isTouched() {
        return !!this._cd?.control?.touched
    }

    get isUntouched() {
        return !!this._cd?.control?.untouched
    }

    get isPristine() {
        return !!this._cd?.control?.pristine
    }

    get isDirty() {
        return !!this._cd?.control?.dirty
    }

    get isValid() {
        return !!this._cd?.control?.valid
    }

    get isInvalid() {
        return !!this._cd?.control?.invalid
    }

    get isPending() {
        return !!this._cd?.control?.pending
    }

    get isSubmitted() {
        return !!this._cd?.submitted
    }
}, MA = {
    "[class.ng-untouched]": "isUntouched",
    "[class.ng-touched]": "isTouched",
    "[class.ng-pristine]": "isPristine",
    "[class.ng-dirty]": "isDirty",
    "[class.ng-valid]": "isValid",
    "[class.ng-invalid]": "isInvalid",
    "[class.ng-pending]": "isPending"
}, b$ = Se(k({}, MA), {"[class.ng-submitted]": "isSubmitted"}), Dl = (() => {
    let e = class e extends bl {
        constructor(i) {
            super(i)
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)(P(Qo, 2))
    }, e.\u0275dir = Ve({
        type: e,
        selectors: [["", "formControlName", ""], ["", "ngModel", ""], ["", "formControl", ""]],
        hostVars: 14,
        hostBindings: function (r, o) {
            r & 2 && ee("ng-untouched", o.isUntouched)("ng-touched", o.isTouched)("ng-pristine", o.isPristine)("ng-dirty", o.isDirty)("ng-valid", o.isValid)("ng-invalid", o.isInvalid)("ng-pending", o.isPending)
        },
        features: [wn]
    });
    let t = e;
    return t
})(), Il = (() => {
    let e = class e extends bl {
        constructor(i) {
            super(i)
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)(P(Nr, 10))
    }, e.\u0275dir = Ve({
        type: e,
        selectors: [["", "formGroupName", ""], ["", "formArrayName", ""], ["", "ngModelGroup", ""], ["", "formGroup", ""], ["form", 3, "ngNoForm", ""], ["", "ngForm", ""]],
        hostVars: 16,
        hostBindings: function (r, o) {
            r & 2 && ee("ng-untouched", o.isUntouched)("ng-touched", o.isTouched)("ng-pristine", o.isPristine)("ng-dirty", o.isDirty)("ng-valid", o.isValid)("ng-invalid", o.isInvalid)("ng-pending", o.isPending)("ng-submitted", o.isSubmitted)
        },
        features: [wn]
    });
    let t = e;
    return t
})();
var Wo = "VALID", vl = "INVALID", Ar = "PENDING", Yo = "DISABLED";

function iw(t) {
    return (Ml(t) ? t.validators : t) || null
}

function _A(t) {
    return Array.isArray(t) ? Zy(t) : t || null
}

function rw(t, e) {
    return (Ml(e) ? e.asyncValidators : t) || null
}

function TA(t) {
    return Array.isArray(t) ? ew(t) : t || null
}

function Ml(t) {
    return t != null && !Array.isArray(t) && typeof t == "object"
}

function xA(t, e, n) {
    let i = t.controls;
    if (!(e ? Object.keys(i) : i).length) throw new _(1e3, "");
    if (!i[n]) throw new _(1001, "")
}

function AA(t, e, n) {
    t._forEachChild((i, r) => {
        if (n[r] === void 0) throw new _(1002, "")
    })
}

var El = class {
    constructor(e, n) {
        this._pendingDirty = !1, this._hasOwnPendingAsyncValidator = !1, this._pendingTouched = !1, this._onCollectionChange = () => {
        }, this._parent = null, this.pristine = !0, this.touched = !1, this._onDisabledChange = [], this._assignValidators(e), this._assignAsyncValidators(n)
    }

    get validator() {
        return this._composedValidatorFn
    }

    set validator(e) {
        this._rawValidators = this._composedValidatorFn = e
    }

    get asyncValidator() {
        return this._composedAsyncValidatorFn
    }

    set asyncValidator(e) {
        this._rawAsyncValidators = this._composedAsyncValidatorFn = e
    }

    get parent() {
        return this._parent
    }

    get valid() {
        return this.status === Wo
    }

    get invalid() {
        return this.status === vl
    }

    get pending() {
        return this.status == Ar
    }

    get disabled() {
        return this.status === Yo
    }

    get enabled() {
        return this.status !== Yo
    }

    get dirty() {
        return !this.pristine
    }

    get untouched() {
        return !this.touched
    }

    get updateOn() {
        return this._updateOn ? this._updateOn : this.parent ? this.parent.updateOn : "change"
    }

    setValidators(e) {
        this._assignValidators(e)
    }

    setAsyncValidators(e) {
        this._assignAsyncValidators(e)
    }

    addValidators(e) {
        this.setValidators(ky(e, this._rawValidators))
    }

    addAsyncValidators(e) {
        this.setAsyncValidators(ky(e, this._rawAsyncValidators))
    }

    removeValidators(e) {
        this.setValidators(Fy(e, this._rawValidators))
    }

    removeAsyncValidators(e) {
        this.setAsyncValidators(Fy(e, this._rawAsyncValidators))
    }

    hasValidator(e) {
        return yl(this._rawValidators, e)
    }

    hasAsyncValidator(e) {
        return yl(this._rawAsyncValidators, e)
    }

    clearValidators() {
        this.validator = null
    }

    clearAsyncValidators() {
        this.asyncValidator = null
    }

    markAsTouched(e = {}) {
        this.touched = !0, this._parent && !e.onlySelf && this._parent.markAsTouched(e)
    }

    markAllAsTouched() {
        this.markAsTouched({onlySelf: !0}), this._forEachChild(e => e.markAllAsTouched())
    }

    markAsUntouched(e = {}) {
        this.touched = !1, this._pendingTouched = !1, this._forEachChild(n => {
            n.markAsUntouched({onlySelf: !0})
        }), this._parent && !e.onlySelf && this._parent._updateTouched(e)
    }

    markAsDirty(e = {}) {
        this.pristine = !1, this._parent && !e.onlySelf && this._parent.markAsDirty(e)
    }

    markAsPristine(e = {}) {
        this.pristine = !0, this._pendingDirty = !1, this._forEachChild(n => {
            n.markAsPristine({onlySelf: !0})
        }), this._parent && !e.onlySelf && this._parent._updatePristine(e)
    }

    markAsPending(e = {}) {
        this.status = Ar, e.emitEvent !== !1 && this.statusChanges.emit(this.status), this._parent && !e.onlySelf && this._parent.markAsPending(e)
    }

    disable(e = {}) {
        let n = this._parentMarkedDirty(e.onlySelf);
        this.status = Yo, this.errors = null, this._forEachChild(i => {
            i.disable(Se(k({}, e), {onlySelf: !0}))
        }), this._updateValue(), e.emitEvent !== !1 && (this.valueChanges.emit(this.value), this.statusChanges.emit(this.status)), this._updateAncestors(Se(k({}, e), {skipPristineCheck: n})), this._onDisabledChange.forEach(i => i(!0))
    }

    enable(e = {}) {
        let n = this._parentMarkedDirty(e.onlySelf);
        this.status = Wo, this._forEachChild(i => {
            i.enable(Se(k({}, e), {onlySelf: !0}))
        }), this.updateValueAndValidity({
            onlySelf: !0,
            emitEvent: e.emitEvent
        }), this._updateAncestors(Se(k({}, e), {skipPristineCheck: n})), this._onDisabledChange.forEach(i => i(!1))
    }

    _updateAncestors(e) {
        this._parent && !e.onlySelf && (this._parent.updateValueAndValidity(e), e.skipPristineCheck || this._parent._updatePristine(), this._parent._updateTouched())
    }

    setParent(e) {
        this._parent = e
    }

    getRawValue() {
        return this.value
    }

    updateValueAndValidity(e = {}) {
        this._setInitialStatus(), this._updateValue(), this.enabled && (this._cancelExistingSubscription(), this.errors = this._runValidator(), this.status = this._calculateStatus(), (this.status === Wo || this.status === Ar) && this._runAsyncValidator(e.emitEvent)), e.emitEvent !== !1 && (this.valueChanges.emit(this.value), this.statusChanges.emit(this.status)), this._parent && !e.onlySelf && this._parent.updateValueAndValidity(e)
    }

    _updateTreeValidity(e = {emitEvent: !0}) {
        this._forEachChild(n => n._updateTreeValidity(e)), this.updateValueAndValidity({
            onlySelf: !0,
            emitEvent: e.emitEvent
        })
    }

    _setInitialStatus() {
        this.status = this._allControlsDisabled() ? Yo : Wo
    }

    _runValidator() {
        return this.validator ? this.validator(this) : null
    }

    _runAsyncValidator(e) {
        if (this.asyncValidator) {
            this.status = Ar, this._hasOwnPendingAsyncValidator = !0;
            let n = Wy(this.asyncValidator(this));
            this._asyncValidationSubscription = n.subscribe(i => {
                this._hasOwnPendingAsyncValidator = !1, this.setErrors(i, {emitEvent: e})
            })
        }
    }

    _cancelExistingSubscription() {
        this._asyncValidationSubscription && (this._asyncValidationSubscription.unsubscribe(), this._hasOwnPendingAsyncValidator = !1)
    }

    setErrors(e, n = {}) {
        this.errors = e, this._updateControlsErrors(n.emitEvent !== !1)
    }

    get(e) {
        let n = e;
        return n == null || (Array.isArray(n) || (n = n.split(".")), n.length === 0) ? null : n.reduce((i, r) => i && i._find(r), this)
    }

    getError(e, n) {
        let i = n ? this.get(n) : this;
        return i && i.errors ? i.errors[e] : null
    }

    hasError(e, n) {
        return !!this.getError(e, n)
    }

    get root() {
        let e = this;
        for (; e._parent;) e = e._parent;
        return e
    }

    _updateControlsErrors(e) {
        this.status = this._calculateStatus(), e && this.statusChanges.emit(this.status), this._parent && this._parent._updateControlsErrors(e)
    }

    _initObservables() {
        this.valueChanges = new ke, this.statusChanges = new ke
    }

    _calculateStatus() {
        return this._allControlsDisabled() ? Yo : this.errors ? vl : this._hasOwnPendingAsyncValidator || this._anyControlsHaveStatus(Ar) ? Ar : this._anyControlsHaveStatus(vl) ? vl : Wo
    }

    _anyControlsHaveStatus(e) {
        return this._anyControls(n => n.status === e)
    }

    _anyControlsDirty() {
        return this._anyControls(e => e.dirty)
    }

    _anyControlsTouched() {
        return this._anyControls(e => e.touched)
    }

    _updatePristine(e = {}) {
        this.pristine = !this._anyControlsDirty(), this._parent && !e.onlySelf && this._parent._updatePristine(e)
    }

    _updateTouched(e = {}) {
        this.touched = this._anyControlsTouched(), this._parent && !e.onlySelf && this._parent._updateTouched(e)
    }

    _registerOnCollectionChange(e) {
        this._onCollectionChange = e
    }

    _setUpdateStrategy(e) {
        Ml(e) && e.updateOn != null && (this._updateOn = e.updateOn)
    }

    _parentMarkedDirty(e) {
        let n = this._parent && this._parent.dirty;
        return !e && !!n && !this._parent._anyControlsDirty()
    }

    _find(e) {
        return null
    }

    _assignValidators(e) {
        this._rawValidators = Array.isArray(e) ? e.slice() : e, this._composedValidatorFn = _A(this._rawValidators)
    }

    _assignAsyncValidators(e) {
        this._rawAsyncValidators = Array.isArray(e) ? e.slice() : e, this._composedAsyncValidatorFn = TA(this._rawAsyncValidators)
    }
}, Or = class extends El {
    constructor(e, n, i) {
        super(iw(n), rw(i, n)), this.controls = e, this._initObservables(), this._setUpdateStrategy(n), this._setUpControls(), this.updateValueAndValidity({
            onlySelf: !0,
            emitEvent: !!this.asyncValidator
        })
    }

    registerControl(e, n) {
        return this.controls[e] ? this.controls[e] : (this.controls[e] = n, n.setParent(this), n._registerOnCollectionChange(this._onCollectionChange), n)
    }

    addControl(e, n, i = {}) {
        this.registerControl(e, n), this.updateValueAndValidity({emitEvent: i.emitEvent}), this._onCollectionChange()
    }

    removeControl(e, n = {}) {
        this.controls[e] && this.controls[e]._registerOnCollectionChange(() => {
        }), delete this.controls[e], this.updateValueAndValidity({emitEvent: n.emitEvent}), this._onCollectionChange()
    }

    setControl(e, n, i = {}) {
        this.controls[e] && this.controls[e]._registerOnCollectionChange(() => {
        }), delete this.controls[e], n && this.registerControl(e, n), this.updateValueAndValidity({emitEvent: i.emitEvent}), this._onCollectionChange()
    }

    contains(e) {
        return this.controls.hasOwnProperty(e) && this.controls[e].enabled
    }

    setValue(e, n = {}) {
        AA(this, !0, e), Object.keys(e).forEach(i => {
            xA(this, !0, i), this.controls[i].setValue(e[i], {onlySelf: !0, emitEvent: n.emitEvent})
        }), this.updateValueAndValidity(n)
    }

    patchValue(e, n = {}) {
        e != null && (Object.keys(e).forEach(i => {
            let r = this.controls[i];
            r && r.patchValue(e[i], {onlySelf: !0, emitEvent: n.emitEvent})
        }), this.updateValueAndValidity(n))
    }

    reset(e = {}, n = {}) {
        this._forEachChild((i, r) => {
            i.reset(e ? e[r] : null, {onlySelf: !0, emitEvent: n.emitEvent})
        }), this._updatePristine(n), this._updateTouched(n), this.updateValueAndValidity(n)
    }

    getRawValue() {
        return this._reduceChildren({}, (e, n, i) => (e[i] = n.getRawValue(), e))
    }

    _syncPendingControls() {
        let e = this._reduceChildren(!1, (n, i) => i._syncPendingControls() ? !0 : n);
        return e && this.updateValueAndValidity({onlySelf: !0}), e
    }

    _forEachChild(e) {
        Object.keys(this.controls).forEach(n => {
            let i = this.controls[n];
            i && e(i, n)
        })
    }

    _setUpControls() {
        this._forEachChild(e => {
            e.setParent(this), e._registerOnCollectionChange(this._onCollectionChange)
        })
    }

    _updateValue() {
        this.value = this._reduceValue()
    }

    _anyControls(e) {
        for (let [n, i] of Object.entries(this.controls)) if (this.contains(n) && e(i)) return !0;
        return !1
    }

    _reduceValue() {
        let e = {};
        return this._reduceChildren(e, (n, i, r) => ((i.enabled || this.disabled) && (n[r] = i.value), n))
    }

    _reduceChildren(e, n) {
        let i = e;
        return this._forEachChild((r, o) => {
            i = n(i, r, o)
        }), i
    }

    _allControlsDisabled() {
        for (let e of Object.keys(this.controls)) if (this.controls[e].enabled) return !1;
        return Object.keys(this.controls).length > 0 || this.disabled
    }

    _find(e) {
        return this.controls.hasOwnProperty(e) ? this.controls[e] : null
    }
};
var ow = new Z("CallSetDisabledState", {providedIn: "root", factory: () => ip}), ip = "always";

function NA(t, e) {
    return [...e.path, t]
}

function Ry(t, e, n = ip) {
    rp(t, e), e.valueAccessor.writeValue(t.value), (t.disabled || n === "always") && e.valueAccessor.setDisabledState?.(t.disabled), PA(t, e), FA(t, e), kA(t, e), OA(t, e)
}

function Ly(t, e, n = !0) {
    let i = () => {
    };
    e.valueAccessor && (e.valueAccessor.registerOnChange(i), e.valueAccessor.registerOnTouched(i)), Cl(t, e), t && (e._invokeOnDestroyCallbacks(), t._registerOnCollectionChange(() => {
    }))
}

function Sl(t, e) {
    t.forEach(n => {
        n.registerOnValidatorChange && n.registerOnValidatorChange(e)
    })
}

function OA(t, e) {
    if (e.valueAccessor.setDisabledState) {
        let n = i => {
            e.valueAccessor.setDisabledState(i)
        };
        t.registerOnDisabledChange(n), e._registerOnDestroy(() => {
            t._unregisterOnDisabledChange(n)
        })
    }
}

function rp(t, e) {
    let n = tw(t);
    e.validator !== null ? t.setValidators(Py(n, e.validator)) : typeof n == "function" && t.setValidators([n]);
    let i = nw(t);
    e.asyncValidator !== null ? t.setAsyncValidators(Py(i, e.asyncValidator)) : typeof i == "function" && t.setAsyncValidators([i]);
    let r = () => t.updateValueAndValidity();
    Sl(e._rawValidators, r), Sl(e._rawAsyncValidators, r)
}

function Cl(t, e) {
    let n = !1;
    if (t !== null) {
        if (e.validator !== null) {
            let r = tw(t);
            if (Array.isArray(r) && r.length > 0) {
                let o = r.filter(s => s !== e.validator);
                o.length !== r.length && (n = !0, t.setValidators(o))
            }
        }
        if (e.asyncValidator !== null) {
            let r = nw(t);
            if (Array.isArray(r) && r.length > 0) {
                let o = r.filter(s => s !== e.asyncValidator);
                o.length !== r.length && (n = !0, t.setAsyncValidators(o))
            }
        }
    }
    let i = () => {
    };
    return Sl(e._rawValidators, i), Sl(e._rawAsyncValidators, i), n
}

function PA(t, e) {
    e.valueAccessor.registerOnChange(n => {
        t._pendingValue = n, t._pendingChange = !0, t._pendingDirty = !0, t.updateOn === "change" && sw(t, e)
    })
}

function kA(t, e) {
    e.valueAccessor.registerOnTouched(() => {
        t._pendingTouched = !0, t.updateOn === "blur" && t._pendingChange && sw(t, e), t.updateOn !== "submit" && t.markAsTouched()
    })
}

function sw(t, e) {
    t._pendingDirty && t.markAsDirty(), t.setValue(t._pendingValue, {emitModelToViewChange: !1}), e.viewToModelUpdate(t._pendingValue), t._pendingChange = !1
}

function FA(t, e) {
    let n = (i, r) => {
        e.valueAccessor.writeValue(i), r && e.viewToModelUpdate(i)
    };
    t.registerOnChange(n), e._registerOnDestroy(() => {
        t._unregisterOnChange(n)
    })
}

function RA(t, e) {
    t == null, rp(t, e)
}

function LA(t, e) {
    return Cl(t, e)
}

function VA(t, e) {
    if (!t.hasOwnProperty("model")) return !1;
    let n = t.model;
    return n.isFirstChange() ? !0 : !Object.is(e, n.currentValue)
}

function jA(t) {
    return Object.getPrototypeOf(t.constructor) === By
}

function $A(t, e) {
    t._syncPendingControls(), e.forEach(n => {
        let i = n.control;
        i.updateOn === "submit" && i._pendingChange && (n.viewToModelUpdate(i._pendingValue), i._pendingChange = !1)
    })
}

function BA(t, e) {
    if (!e) return null;
    Array.isArray(e);
    let n, i, r;
    return e.forEach(o => {
        o.constructor === Pr ? n = o : jA(o) ? i = o : r = o
    }), r || i || n || null
}

function HA(t, e) {
    let n = t.indexOf(e);
    n > -1 && t.splice(n, 1)
}

function Vy(t, e) {
    let n = t.indexOf(e);
    n > -1 && t.splice(n, 1)
}

function jy(t) {
    return typeof t == "object" && t !== null && Object.keys(t).length === 2 && "value" in t && "disabled" in t
}

var Ht = class extends El {
    constructor(e = null, n, i) {
        super(iw(n), rw(i, n)), this.defaultValue = null, this._onChange = [], this._pendingChange = !1, this._applyFormState(e), this._setUpdateStrategy(n), this._initObservables(), this.updateValueAndValidity({
            onlySelf: !0,
            emitEvent: !!this.asyncValidator
        }), Ml(n) && (n.nonNullable || n.initialValueIsDefault) && (jy(e) ? this.defaultValue = e.value : this.defaultValue = e)
    }

    setValue(e, n = {}) {
        this.value = this._pendingValue = e, this._onChange.length && n.emitModelToViewChange !== !1 && this._onChange.forEach(i => i(this.value, n.emitViewToModelChange !== !1)), this.updateValueAndValidity(n)
    }

    patchValue(e, n = {}) {
        this.setValue(e, n)
    }

    reset(e = this.defaultValue, n = {}) {
        this._applyFormState(e), this.markAsPristine(n), this.markAsUntouched(n), this.setValue(this.value, n), this._pendingChange = !1
    }

    _updateValue() {
    }

    _anyControls(e) {
        return !1
    }

    _allControlsDisabled() {
        return this.disabled
    }

    registerOnChange(e) {
        this._onChange.push(e)
    }

    _unregisterOnChange(e) {
        Vy(this._onChange, e)
    }

    registerOnDisabledChange(e) {
        this._onDisabledChange.push(e)
    }

    _unregisterOnDisabledChange(e) {
        Vy(this._onDisabledChange, e)
    }

    _forEachChild(e) {
    }

    _syncPendingControls() {
        return this.updateOn === "submit" && (this._pendingDirty && this.markAsDirty(), this._pendingTouched && this.markAsTouched(), this._pendingChange) ? (this.setValue(this._pendingValue, {
            onlySelf: !0,
            emitModelToViewChange: !1
        }), !0) : !1
    }

    _applyFormState(e) {
        jy(e) ? (this.value = this._pendingValue = e.value, e.disabled ? this.disable({
            onlySelf: !0,
            emitEvent: !1
        }) : this.enable({onlySelf: !0, emitEvent: !1})) : this.value = this._pendingValue = e
    }
};
var UA = t => t instanceof Ht;
var _l = (() => {
    let e = class e {
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275dir = Ve({
        type: e,
        selectors: [["form", 3, "ngNoForm", "", 3, "ngNativeValidate", ""]],
        hostAttrs: ["novalidate", ""]
    });
    let t = e;
    return t
})(), zA = {provide: np, useExisting: pi(() => op), multi: !0}, op = (() => {
    let e = class e extends By {
        writeValue(i) {
            let r = i ?? "";
            this.setProperty("value", r)
        }

        registerOnChange(i) {
            this.onChange = r => {
                i(r == "" ? null : parseFloat(r))
            }
        }
    };
    e.\u0275fac = (() => {
        let i;
        return function (o) {
            return (i || (i = or(e)))(o || e)
        }
    })(), e.\u0275dir = Ve({
        type: e,
        selectors: [["input", "type", "number", "formControlName", ""], ["input", "type", "number", "formControl", ""], ["input", "type", "number", "ngModel", ""]],
        hostBindings: function (r, o) {
            r & 1 && j("input", function (a) {
                return o.onChange(a.target.value)
            })("blur", function () {
                return o.onTouched()
            })
        },
        features: [co([zA]), wn]
    });
    let t = e;
    return t
})();
var aw = new Z("");
var GA = {provide: Nr, useExisting: pi(() => Xo)}, Xo = (() => {
    let e = class e extends Nr {
        constructor(i, r, o) {
            super(), this.callSetDisabledState = o, this.submitted = !1, this._onCollectionChange = () => this._updateDomValue(), this.directives = [], this.form = null, this.ngSubmit = new ke, this._setValidators(i), this._setAsyncValidators(r)
        }

        ngOnChanges(i) {
            this._checkFormPresent(), i.hasOwnProperty("form") && (this._updateValidators(), this._updateDomValue(), this._updateRegistrations(), this._oldForm = this.form)
        }

        ngOnDestroy() {
            this.form && (Cl(this.form, this), this.form._onCollectionChange === this._onCollectionChange && this.form._registerOnCollectionChange(() => {
            }))
        }

        get formDirective() {
            return this
        }

        get control() {
            return this.form
        }

        get path() {
            return []
        }

        addControl(i) {
            let r = this.form.get(i.path);
            return Ry(r, i, this.callSetDisabledState), r.updateValueAndValidity({emitEvent: !1}), this.directives.push(i), r
        }

        getControl(i) {
            return this.form.get(i.path)
        }

        removeControl(i) {
            Ly(i.control || null, i, !1), HA(this.directives, i)
        }

        addFormGroup(i) {
            this._setUpFormContainer(i)
        }

        removeFormGroup(i) {
            this._cleanUpFormContainer(i)
        }

        getFormGroup(i) {
            return this.form.get(i.path)
        }

        addFormArray(i) {
            this._setUpFormContainer(i)
        }

        removeFormArray(i) {
            this._cleanUpFormContainer(i)
        }

        getFormArray(i) {
            return this.form.get(i.path)
        }

        updateModel(i, r) {
            this.form.get(i.path).setValue(r)
        }

        onSubmit(i) {
            return this.submitted = !0, $A(this.form, this.directives), this.ngSubmit.emit(i), i?.target?.method === "dialog"
        }

        onReset() {
            this.resetForm()
        }

        resetForm(i = void 0) {
            this.form.reset(i), this.submitted = !1
        }

        _updateDomValue() {
            this.directives.forEach(i => {
                let r = i.control, o = this.form.get(i.path);
                r !== o && (Ly(r || null, i), UA(o) && (Ry(o, i, this.callSetDisabledState), i.control = o))
            }), this.form._updateTreeValidity({emitEvent: !1})
        }

        _setUpFormContainer(i) {
            let r = this.form.get(i.path);
            RA(r, i), r.updateValueAndValidity({emitEvent: !1})
        }

        _cleanUpFormContainer(i) {
            if (this.form) {
                let r = this.form.get(i.path);
                r && LA(r, i) && r.updateValueAndValidity({emitEvent: !1})
            }
        }

        _updateRegistrations() {
            this.form._registerOnCollectionChange(this._onCollectionChange), this._oldForm && this._oldForm._registerOnCollectionChange(() => {
            })
        }

        _updateValidators() {
            rp(this.form, this), this._oldForm && Cl(this._oldForm, this)
        }

        _checkFormPresent() {
            this.form
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)(P(Uy, 10), P(zy, 10), P(ow, 8))
    }, e.\u0275dir = Ve({
        type: e,
        selectors: [["", "formGroup", ""]],
        hostBindings: function (r, o) {
            r & 1 && j("submit", function (a) {
                return o.onSubmit(a)
            })("reset", function () {
                return o.onReset()
            })
        },
        inputs: {form: [Ge.None, "formGroup", "form"]},
        outputs: {ngSubmit: "ngSubmit"},
        exportAs: ["ngForm"],
        features: [co([GA]), wn, hn]
    });
    let t = e;
    return t
})();
var qA = {provide: Qo, useExisting: pi(() => Ko)}, Ko = (() => {
    let e = class e extends Qo {
        set isDisabled(i) {
        }

        constructor(i, r, o, s, a) {
            super(), this._ngModelWarningConfig = a, this._added = !1, this.name = null, this.update = new ke, this._ngModelWarningSent = !1, this._parent = i, this._setValidators(r), this._setAsyncValidators(o), this.valueAccessor = BA(this, s)
        }

        ngOnChanges(i) {
            this._added || this._setUpControl(), VA(i, this.viewModel) && (this.viewModel = this.model, this.formDirective.updateModel(this, this.model))
        }

        ngOnDestroy() {
            this.formDirective && this.formDirective.removeControl(this)
        }

        viewToModelUpdate(i) {
            this.viewModel = i, this.update.emit(i)
        }

        get path() {
            return NA(this.name == null ? this.name : this.name.toString(), this._parent)
        }

        get formDirective() {
            return this._parent ? this._parent.formDirective : null
        }

        _checkParentType() {
        }

        _setUpControl() {
            this._checkParentType(), this.control = this.formDirective.addControl(this), this._added = !0
        }
    };
    e._ngModelWarningSentOnce = !1, e.\u0275fac = function (r) {
        return new (r || e)(P(Nr, 13), P(Uy, 10), P(zy, 10), P(np, 10), P(aw, 8))
    }, e.\u0275dir = Ve({
        type: e,
        selectors: [["", "formControlName", ""]],
        inputs: {
            name: [Ge.None, "formControlName", "name"],
            isDisabled: [Ge.None, "disabled", "isDisabled"],
            model: [Ge.None, "ngModel", "model"]
        },
        outputs: {update: "ngModelChange"},
        features: [co([qA]), wn, hn]
    });
    let t = e;
    return t
})();
var WA = (() => {
    let e = class e {
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275mod = un({type: e}), e.\u0275inj = cn({});
    let t = e;
    return t
})();
var Tl = (() => {
    let e = class e {
        static withConfig(i) {
            return {
                ngModule: e,
                providers: [{provide: aw, useValue: i.warnOnNgModelWithFormControl ?? "always"}, {
                    provide: ow,
                    useValue: i.callSetDisabledState ?? ip
                }]
            }
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275mod = un({type: e}), e.\u0275inj = cn({imports: [WA]});
    let t = e;
    return t
})();
var kr = () => ["active"], cw = () => ({exact: !0}), Fr = (() => {
    let e = class e {
        constructor(i, r) {
            this.utilsService = i, this.router = r, this.sticky = !1
        }

        scrollToFragment(i) {
            setTimeout(() => {
                let r = document.getElementById(i);
                if (r) {
                    let o = r.offsetTop - 60;
                    console.log("element offset", r, o), window.scrollTo({top: o, behavior: "smooth"})
                }
            }, 100)
        }

        navigateWithOffset(i) {
            this.router.navigate(["/home"], {fragment: i}), this.scrollToFragment(i)
        }

        isFeatureRouteActive() {
            return this.router.url === "/home#feature"
        }

        isRoadMapRouteActive() {
            return this.router.url === "/home#roadMap"
        }

        onscroll() {
            window.scrollY > 100 ? this.sticky = !0 : this.sticky = !1
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)(P(Ae), P(Me))
    }, e.\u0275cmp = T({
        type: e,
        selectors: [["app-header-three"]],
        hostBindings: function (r, o) {
            r & 1 && j("scroll", function (a) {
                return o.onscroll(a)
            }, !1, ar)
        },
        standalone: !0,
        features: [x],
        decls: 93,
        vars: 26,
        consts: [["id", "header"], ["id", "sticky-header", 1, "menu-area", "transparent-header"], [1, "container", "custom-container"], [1, "row"], [1, "col-12"], [1, "menu-wrap"], [1, "menu-nav"], [1, "logo"], ["routerLink", "/home"], ["src", "./assets/logo.png", "alt", "Logo", 2, "height", "35px"], [1, "navbar-wrap", "main-menu", "d-none", "d-lg-flex"], [1, "navigation"], [1, "menu-item-has-children"], [1, "sub-menu"], [3, "routerLinkActive", "routerLinkActiveOptions"], [3, "routerLinkActive"], ["routerLink", "/home/home-two"], [1, "section-link", "pointer", 3, "click"], [1, "menu-item-has-children", 3, "routerLinkActive"], ["routerLink", "/blog"], ["routerLink", "/blog-details/3"], ["routerLink", "/contact"], [1, "header-action"], [1, "list-wrap"], [1, "header-login"], [1, "fas", "fa-user"], [1, "offcanvas-menu"], [1, "menu-tigger", "pointer", 3, "click"], [1, "fas", "fa-bars"], [1, "mobile-nav-toggler", 3, "click"], [1, "extra-info"], [1, "close-icon", "menu-close"], [3, "click"], [1, "far", "fa-window-close"], [1, "logo-side", "mb-30"], [1, "side-info", "mb-30"], [1, "contact-list", "mb-30"], [1, "social-icon-right", "mt-30"], ["href", "#"], [1, "fab", "fa-facebook-f"], ["xmlns", "http://www.w3.org/2000/svg", "width", "16", "height", "16", "viewBox", "0 0 16 16", "fill", "none"], ["d", "M10.0596 7.34522L15.8879 0.570312H14.5068L9.44607 6.45287L5.40411 0.570312H0.742188L6.85442 9.46578L0.742188 16.5703H2.12338L7.4676 10.3581L11.7362 16.5703H16.3981L10.0593 7.34522H10.0596ZM8.16787 9.54415L7.54857 8.65836L2.62104 1.61005H4.74248L8.71905 7.29827L9.33834 8.18405L14.5074 15.5779H12.386L8.16787 9.54449V9.54415Z", "fill", "currentColor"], [1, "fab", "fa-google-plus-g"], [1, "fab", "fa-instagram"], [1, "offcanvas-overly", 3, "click"]],
        template: function (r, o) {
            r & 1 && (u(0, "header", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div", 4)(5, "div", 5)(6, "nav", 6)(7, "div", 7)(8, "a", 8), v(9, "img", 9), d()(), u(10, "div", 10)(11, "ul", 11)(12, "li", 12)(13, "a", 8), h(14, "Home"), d(), u(15, "ul", 13)(16, "li", 14)(17, "a", 8), h(18, "ICO Investment"), d()(), u(19, "li", 15)(20, "a", 16), h(21, "Blockchain"), d()()()(), u(22, "li")(23, "a", 17), j("click", function () {
                return o.navigateWithOffset("feature")
            }), h(24, " Feature "), d()(), u(25, "li")(26, "a", 17), j("click", function () {
                return o.navigateWithOffset("roadMap")
            }), h(27, " RoadMap "), d()(), u(28, "li", 18)(29, "a", 19), h(30, "blog"), d(), u(31, "ul", 13)(32, "li", 14)(33, "a", 19), h(34, "Our Blog"), d()(), u(35, "li", 15)(36, "a", 20), h(37, "Blog Details"), d()()()(), u(38, "li", 15)(39, "a", 21), h(40, "Contact"), d()()()(), u(41, "div", 22)(42, "ul", 23)(43, "li", 24)(44, "a", 21), h(45, "Login"), v(46, "i", 25), d()(), u(47, "li", 26)(48, "a", 27), j("click", function () {
                return o.utilsService.openOffcanvas = !o.utilsService.openOffcanvas
            }), v(49, "i", 28), d()()()(), u(50, "div", 29), j("click", function () {
                return o.utilsService.openMobileMenus = !o.utilsService.openMobileMenus
            }), v(51, "i", 28), d()()()()()()(), u(52, "div", 30)(53, "div", 31)(54, "button", 32), j("click", function () {
                return o.utilsService.openOffcanvas = !o.utilsService.openOffcanvas
            }), v(55, "i", 33), d()(), u(56, "div", 34)(57, "a", 8), v(58, "img", 9), d()(), u(59, "div", 35)(60, "div", 36)(61, "h4"), h(62, "Office Address"), d(), u(63, "p"), h(64, "123/A, Miranda City Likaoli "), v(65, "br"), h(66, " Prikano, Dope"), d()(), u(67, "div", 36)(68, "h4"), h(69, "Phone Number"), d(), u(70, "p"), h(71, "+0989 7876 9865 9"), d(), u(72, "p"), h(73, "+(090) 8765 86543 85"), d()(), u(74, "div", 36)(75, "h4"), h(76, "Email Address"), d(), u(77, "p"), h(78, "info@example.com"), d(), u(79, "p"), h(80, "example.mail@hum.com"), d()()(), u(81, "div", 37)(82, "a", 38), v(83, "i", 39), d(), u(84, "a", 38), Ke(), u(85, "svg", 40), v(86, "path", 41), d()(), Ze(), u(87, "a", 38), v(88, "i", 42), d(), u(89, "a", 38), v(90, "i", 43), d()()(), u(91, "div", 44), j("click", function () {
                return o.utilsService.openOffcanvas = !o.utilsService.openOffcanvas
            }), d(), v(92, "app-mobile-offcanvas"), d()), r & 2 && (y(), ee("sticky-menu", o.sticky), y(15), D("routerLinkActive", se(18, kr))("routerLinkActiveOptions", se(19, cw)), y(3), D("routerLinkActive", se(20, kr)), y(3), ee("active", o.isFeatureRouteActive()), y(3), ee("active", o.isRoadMapRouteActive()), y(3), D("routerLinkActive", se(21, kr)), y(4), D("routerLinkActive", se(22, kr))("routerLinkActiveOptions", se(23, cw)), y(3), D("routerLinkActive", se(24, kr)), y(3), D("routerLinkActive", se(25, kr)), y(14), ee("active", o.utilsService.openOffcanvas), y(39), ee("active", o.utilsService.openOffcanvas))
        },
        dependencies: [H, Ee, he, qn, Mr]
    });
    let t = e;
    return t
})();
var Rr = (() => {
    let e = class e {
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275cmp = T({
        type: e,
        selectors: [["app-breadcrumb"]],
        inputs: {title: "title", subTitle: "subTitle"},
        standalone: !0,
        features: [x],
        decls: 17,
        vars: 2,
        consts: [[1, "breadcrumb-area", "breadcrumb-bg", 2, "background-image", "url(/assets/img/bg/breadcrumb_bg.png)"], [1, "container"], [1, "row"], [1, "col-lg-12"], [1, "breadcrumb-content"], [1, "title"], ["aria-label", "breadcrumb"], [1, "breadcrumb"], [1, "breadcrumb-item"], ["routerLink", "/home"], ["aria-current", "page", 1, "breadcrumb-item", "active"], [1, "breadcrumb-shape-wrap"], ["src", "/assets/img/images/breadcrumb_shape01.png", "alt", "", 1, "alltuchtopdown"], ["src", "/assets/img/images/breadcrumb_shape02.png", "alt", "", 1, "rotateme"]],
        template: function (r, o) {
            r & 1 && (u(0, "section", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div", 4)(5, "h2", 5), h(6), d(), u(7, "nav", 6)(8, "ol", 7)(9, "li", 8)(10, "a", 9), h(11, "Home"), d()(), u(12, "li", 10), h(13), d()()()()()()(), u(14, "div", 11), v(15, "img", 12)(16, "img", 13), d()()), r & 2 && (y(6), $(o.title), y(7), $(o.subTitle))
        },
        dependencies: [H, Ee, he]
    });
    let t = e;
    return t
})();

function YA(t, e) {
    t & 1 && (u(0, "span", 27), h(1, " Name is required "), d())
}

function QA(t, e) {
    t & 1 && (u(0, "span", 27), h(1, " Email is required and must be a valid email address "), d())
}

function XA(t, e) {
    t & 1 && (u(0, "span", 27), h(1, "Message is required "), d())
}

var Lr = (() => {
    let e = class e {
        constructor() {
            this.formSubmitted = !1
        }

        ngOnInit() {
            this.documentForm = new Or({
                name: new Ht(null, ft.required),
                email: new Ht(null, [ft.required, ft.email]),
                message: new Ht(null, ft.required)
            })
        }

        onSubmit() {
            this.formSubmitted = !0, this.documentForm.valid && (console.log("contact-form-value", this.documentForm.value), alert("Message sent successfully"), this.documentForm.reset(), this.formSubmitted = !1), console.log("contact-form", this.documentForm)
        }

        get name() {
            return this.documentForm.get("name")
        }

        get email() {
            return this.documentForm.get("email")
        }

        get message() {
            return this.documentForm.get("message")
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275cmp = T({
        type: e,
        selectors: [["app-document-area"]],
        standalone: !0,
        features: [x],
        decls: 58,
        vars: 4,
        consts: [[1, "document-area"], [1, "container"], [1, "document-inner-wrap"], [1, "row"], [1, "col-lg-12"], [1, "section-title", "text-center", "mb-60"], [1, "title"], [1, "col-lg-8"], [1, "document-form-wrap"], [3, "ngSubmit", "formGroup"], [1, "col-md-6"], [1, "form-grp"], ["type", "text", "placeholder", "Your Name", "formControlName", "name"], ["class", "text-danger", 4, "ngIf"], ["type", "email", "placeholder", "Your Email", "formControlName", "email"], ["name", "message", "placeholder", "Enter you message.....", "formControlName", "message"], [1, "text-center"], ["type", "submit", 1, "btn"], [1, "col-lg-4"], [1, "document-wrap"], [1, "list-wrap"], ["href", "javascript:void(0)"], [1, "icon"], [1, "fas", "fa-file-pdf"], ["href", "javascript:void(0)", 1, "btn"], [1, "document-shape"], ["src", "/assets/img/images/document_shape.png", "alt", "", 1, "alltuchtopdown"], [1, "text-danger"]],
        template: function (r, o) {
            r & 1 && (u(0, "section", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div", 4)(5, "div", 5)(6, "h2", 6), h(7, "Have Any Questions?"), d()()()(), u(8, "div", 3)(9, "div", 7)(10, "div", 8)(11, "h4", 6), h(12, "Get In Touch Now"), d(), u(13, "form", 9), j("ngSubmit", function () {
                return o.onSubmit()
            }), u(14, "div", 3)(15, "div", 10)(16, "div", 11), v(17, "input", 12), Y(18, YA, 2, 0, "span", 13), d()(), u(19, "div", 10)(20, "div", 11), v(21, "input", 14), Y(22, QA, 2, 0, "span", 13), d()()(), u(23, "div", 11), v(24, "textarea", 15), Y(25, XA, 2, 0, "span", 13), d(), u(26, "div", 16)(27, "button", 17), h(28, "Send Message"), d()()()()(), u(29, "div", 18)(30, "div", 19)(31, "h4", 6), h(32, "Read Documents"), d(), u(33, "ul", 20)(34, "li")(35, "a", 21)(36, "span", 22), v(37, "i", 23), d(), h(38, " Whitepaper "), d()(), u(39, "li")(40, "a", 21)(41, "span", 22), v(42, "i", 23), d(), h(43, " Token Sale Terms "), d()(), u(44, "li")(45, "a", 21)(46, "span", 22), v(47, "i", 23), d(), h(48, " Presentation "), d()(), u(49, "li")(50, "a", 21)(51, "span", 22), v(52, "i", 23), d(), h(53, " Lightpaper "), d()()(), u(54, "a", 24), h(55, "Download All"), d()()()()()(), u(56, "div", 25), v(57, "img", 26), d()()), r & 2 && (y(13), D("formGroup", o.documentForm), y(5), D("ngIf", (o.name == null ? null : o.name.hasError("required")) && ((o.name == null ? null : o.name.touched) || o.formSubmitted)), y(4), D("ngIf", (o.email == null ? null : o.email.hasError("required")) && (o.email == null ? null : o.email.touched) || (o.email == null ? null : o.email.hasError("email")) && (o.email == null ? null : o.email.dirty) || o.formSubmitted && !(o.email != null && o.email.value)), y(3), D("ngIf", (o.message == null ? null : o.message.hasError("required")) && ((o.message == null ? null : o.message.touched) || o.formSubmitted)))
        },
        dependencies: [H, _t, Tl, _l, Pr, Dl, Il, Xo, Ko]
    });
    let t = e;
    return t
})();
var Vr = (() => {
    let e = class e {
        constructor() {
            this.date = new Date().getFullYear()
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275cmp = T({
        type: e,
        selectors: [["app-footer-three"]],
        standalone: !0,
        features: [x],
        decls: 88,
        vars: 1,
        consts: [[1, "footer-area", "footer-bg", 2, "background-image", "url(/assets/img/bg/footer_bg.png)"], [1, "container"], [1, "footer-top"], [1, "row"], [1, "col-xl-3", "col-lg-3", "col-md-4", "col-sm-6"], [1, "footer-widget"], [1, "fw-title"], [1, "footer-link"], [1, "list-wrap"], ["routerLink", "/contact"], [1, "col-xl-3", "col-lg-2", "col-md-4", "col-sm-6"], [1, "col-xl-3", "col-lg-3", "col-md-4", "col-sm-4"], ["routerLink", "/blog"], [1, "col-xl-3", "col-lg-4", "col-sm-8"], [1, "footer-newsletter"], ["action", "#"], ["type", "text", "placeholder", "Info@gmail.com"], ["type", "submit"], [1, "fas", "fa-paper-plane"], [1, "footer-bottom"], [1, "col-lg-12"], [1, "copyright-text"], [1, "footer-shape-wrap"], ["src", "/assets/img/images/footer_shape01.png", "alt", "", 1, "alltuchtopdown"], ["src", "/assets/img/images/footer_shape02.png", "alt", "", 1, "leftToRight"]],
        template: function (r, o) {
            r & 1 && (u(0, "footer")(1, "div", 0)(2, "div", 1)(3, "div", 2)(4, "div", 3)(5, "div", 4)(6, "div", 5)(7, "h4", 6), h(8, "Usefull Links"), d(), u(9, "div", 7)(10, "ul", 8)(11, "li")(12, "a", 9), h(13, "Contact us"), d()(), u(14, "li")(15, "a", 9), h(16, "How it Works"), d()(), u(17, "li")(18, "a", 9), h(19, "Create"), d()(), u(20, "li")(21, "a", 9), h(22, "Explore"), d()(), u(23, "li")(24, "a", 9), h(25, "Terms & Services"), d()()()()()(), u(26, "div", 10)(27, "div", 5)(28, "h4", 6), h(29, "SOLUTIONS"), d(), u(30, "div", 7)(31, "ul", 8)(32, "li")(33, "a", 9), h(34, "Token Suite"), d()(), u(35, "li")(36, "a", 9), h(37, "Ecosystem"), d()(), u(38, "li")(39, "a", 9), h(40, "Investment"), d()(), u(41, "li")(42, "a", 9), h(43, "Portal"), d()(), u(44, "li")(45, "a", 9), h(46, "Tokenization"), d()()()()()(), u(47, "div", 11)(48, "div", 5)(49, "h4", 6), h(50, "Usefull Links"), d(), u(51, "div", 7)(52, "ul", 8)(53, "li")(54, "a", 9), h(55, "Help Center"), d()(), u(56, "li")(57, "a", 9), h(58, "Partners"), d()(), u(59, "li")(60, "a", 9), h(61, "Suggestions"), d()(), u(62, "li")(63, "a", 12), h(64, "Blog"), d()(), u(65, "li")(66, "a", 9), h(67, "Newsletters"), d()()()()()(), u(68, "div", 13)(69, "div", 5)(70, "h4", 6), h(71, "Subscribe Newsletter"), d(), u(72, "div", 14)(73, "p"), h(74, "Exerci tation ullamcorper suscipit lobortis nisl aliquip ex ea commodo"), d(), u(75, "form", 15), v(76, "input", 16), u(77, "button", 17), v(78, "i", 18), d()()()()()()(), u(79, "div", 19)(80, "div", 3)(81, "div", 20)(82, "div", 21)(83, "p"), h(84), d()()()()()(), u(85, "div", 22), v(86, "img", 23)(87, "img", 24), d()()()), r & 2 && (y(84), ye("Copyright \xA9 ", o.date, " IKO. All rights reserved."))
        },
        dependencies: [H, Ee, he]
    });
    let t = e;
    return t
})();

function KA(t, e) {
    if (t & 1 && (u(0, "div", 26)(1, "div", 27)(2, "div", 28), v(3, "i"), d(), u(4, "div", 29)(5, "h6", 10), h(6), d(), v(7, "p", 30), d()()()), t & 2) {
        let n = e.$implicit;
        y(3), lo(n.icon), y(3), $(n.title), y(), D("innerHTML", n.description, tg)
    }
}

function ZA(t, e) {
    t & 1 && (u(0, "span", 31), h(1, " Name is required "), d())
}

function JA(t, e) {
    t & 1 && (u(0, "span", 31), h(1, " Email is required and must be a valid email address "), d())
}

function eN(t, e) {
    t & 1 && (u(0, "span", 31), h(1, "Phone is required "), d())
}

function tN(t, e) {
    t & 1 && (u(0, "span", 31), h(1, " Company is required "), d())
}

function nN(t, e) {
    t & 1 && (u(0, "span", 31), h(1, "Message is required "), d())
}

var uw = (() => {
    let e = class e {
        constructor(i) {
            this.utilsService = i, this.formSubmitted = !1, this.info_data = [{
                icon: "fas fa-map-marker-alt",
                title: "Location",
                description: "1901 Thornridge Cir. <br> Shiloh, Hawaii"
            }, {
                icon: "fas fa-phone-alt",
                title: "Contact",
                description: '<a href="tel:0123456789">+88(0) 555-0108</a> <br> <a href="tel:0123456789">+88(0) 555-01117</a>'
            }, {
                icon: "fas fa-envelope",
                title: "Email",
                description: '<a href="mailto:iko.@example.com">sara.cruz&#64;example.com</a> <br> <a href="mailto:iko.@example.com">iko.&#64;example.com</a>'
            }, {
                icon: "fas fa-business-time",
                title: "Visit Between",
                description: "Mon - Sat : 8.00-5.00 <br> Sunday : Closed"
            }]
        }

        ngOnInit() {
            this.contactForm = new Or({
                name: new Ht(null, ft.required),
                email: new Ht(null, [ft.required, ft.email]),
                phone: new Ht(null, ft.required),
                company: new Ht(null, ft.required),
                message: new Ht(null, ft.required)
            })
        }

        onSubmit() {
            this.formSubmitted = !0, this.contactForm.valid && (console.log("contact-form-value", this.contactForm.value), alert("Message sent successfully"), this.contactForm.reset(), this.formSubmitted = !1), console.log("contact-form", this.contactForm)
        }

        get name() {
            return this.contactForm.get("name")
        }

        get email() {
            return this.contactForm.get("email")
        }

        get phone() {
            return this.contactForm.get("phone")
        }

        get company() {
            return this.contactForm.get("company")
        }

        get message() {
            return this.contactForm.get("message")
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)(P(Ae))
    }, e.\u0275cmp = T({
        type: e,
        selectors: [["app-contact"]],
        standalone: !0,
        features: [x],
        decls: 44,
        vars: 9,
        consts: [["title", "Contact Us", "subTitle", "Contact Us"], [1, "contact-area", "pt-140", "pb-140"], [1, "container"], [1, "contact-info-wrap"], [1, "row", "justify-content-center"], ["class", "col-xl-3 col-lg-4 col-md-6", 4, "ngFor", "ngForOf"], [1, "contact-form-wrap"], [1, "row", "g-0"], [1, "col-57", "order-0", "order-lg-2"], [1, "contact-form"], [1, "title"], ["id", "contact-form", 3, "ngSubmit", "formGroup"], [1, "row"], [1, "col-md-6"], [1, "form-grp"], ["type", "text", "name", "name", "placeholder", "Enter you name", "formControlName", "name"], ["class", "text-danger", 4, "ngIf"], ["type", "email", "name", "email", "placeholder", "Enter you email", "formControlName", "email"], ["type", "number", "name", "number", "placeholder", "Mobile no", "formControlName", "phone"], ["type", "text", "name", "company", "placeholder", "Company", "formControlName", "company"], ["name", "message", "placeholder", "Enter you message.....", "formControlName", "message"], ["type", "submit", 1, "btn"], [1, "ajax-response", "mb-0"], [1, "col-43"], [1, "contact-map"], ["src", ng`https://geo-devrel-javascript-samples.web.app/samples/style-array/app/dist/`, "allowfullscreen", "", "loading", "lazy"], [1, "col-xl-3", "col-lg-4", "col-md-6"], [1, "contact-info-item"], [1, "icon"], [1, "content"], [3, "innerHTML"], [1, "text-danger"]],
        template: function (r, o) {
            r & 1 && (u(0, "div"), v(1, "app-header-three"), u(2, "main"), v(3, "app-breadcrumb", 0), u(4, "section", 1)(5, "div", 2)(6, "div", 3)(7, "div", 4), Y(8, KA, 8, 4, "div", 5), d()(), u(9, "div", 6)(10, "div", 7)(11, "div", 8)(12, "div", 9)(13, "h4", 10), h(14, "Send a message"), d(), u(15, "form", 11), j("ngSubmit", function () {
                return o.onSubmit()
            }), u(16, "div", 12)(17, "div", 13)(18, "div", 14), v(19, "input", 15), Y(20, ZA, 2, 0, "span", 16), d()(), u(21, "div", 13)(22, "div", 14), v(23, "input", 17), Y(24, JA, 2, 0, "span", 16), d()(), u(25, "div", 13)(26, "div", 14), v(27, "input", 18), Y(28, eN, 2, 0, "span", 16), d()(), u(29, "div", 13)(30, "div", 14), v(31, "input", 19), Y(32, tN, 2, 0, "span", 16), d()()(), u(33, "div", 14), v(34, "textarea", 20), Y(35, nN, 2, 0, "span", 16), d(), u(36, "button", 21), h(37, "Send Message"), d()(), v(38, "p", 22), d()(), u(39, "div", 23)(40, "div", 24), v(41, "iframe", 25), d()()()()()(), v(42, "app-document-area"), d(), v(43, "app-footer-three"), d()), r & 2 && (ee("mobile-menu-visible", o.utilsService.openMobileMenus), y(8), D("ngForOf", o.info_data), y(7), D("formGroup", o.contactForm), y(5), D("ngIf", (o.name == null ? null : o.name.hasError("required")) && ((o.name == null ? null : o.name.touched) || o.formSubmitted)), y(4), D("ngIf", (o.email == null ? null : o.email.hasError("required")) && (o.email == null ? null : o.email.touched) || (o.email == null ? null : o.email.hasError("email")) && (o.email == null ? null : o.email.dirty) || o.formSubmitted && !(o.email != null && o.email.value)), y(4), D("ngIf", (o.phone == null ? null : o.phone.hasError("required")) && ((o.phone == null ? null : o.phone.touched) || o.formSubmitted)), y(4), D("ngIf", (o.company == null ? null : o.company.hasError("required")) && ((o.company == null ? null : o.company.touched) || o.formSubmitted)), y(3), D("ngIf", (o.message == null ? null : o.message.hasError("required")) && ((o.message == null ? null : o.message.touched) || o.formSubmitted)))
        },
        dependencies: [H, we, _t, Tl, _l, Pr, op, Dl, Il, Xo, Ko, Fr, Rr, Lr, Vr]
    });
    let t = e;
    return t
})();
var dw = (() => {
    let e = class e {
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275cmp = T({
        type: e,
        selectors: [["app-blog-masonry"]],
        inputs: {blog: "blog"},
        standalone: !0,
        features: [x],
        decls: 31,
        vars: 13,
        consts: [[1, "blog-masonry-post"], [1, "blog-masonry-thumb"], [3, "routerLink"], ["alt", "", 3, "src"], [1, "blog-masonry-content"], [1, "blog-meta"], [1, "list-wrap"], [1, "far", "fa-clock"], [1, "far", "fa-comment"], [1, "far", "fa-eye"], [1, "title"], [1, "content-bottom"], [1, "blog-author"], [1, "read-more-btn"], [1, "fas", "fa-arrow-right"]],
        template: function (r, o) {
            r & 1 && (u(0, "div", 0)(1, "div", 1)(2, "a", 2), v(3, "img", 3), d()(), u(4, "div", 4)(5, "div", 5)(6, "ul", 6)(7, "li"), v(8, "i", 7), h(9), d(), u(10, "li")(11, "a", 2), v(12, "i", 8), h(13), d()(), u(14, "li"), v(15, "i", 9), h(16), d()()(), u(17, "h2", 10)(18, "a", 2), h(19), d()(), u(20, "p"), h(21), d(), u(22, "div", 11)(23, "div", 12)(24, "a", 2), v(25, "img", 3), h(26), d()(), u(27, "div", 13)(28, "a", 2), h(29, "Read More"), v(30, "i", 14), d()()()()()), r & 2 && (y(2), D("routerLink", "/blog-details/" + o.blog.id), y(), D("src", o.blog.img, pe), y(6), $(o.blog.date), y(2), D("routerLink", "/blog-details/" + o.blog.id), y(2), ye(" ", o.blog.comment > 9 ? o.blog.comment : "0" + o.blog.comment, " "), y(3), ye("", o.blog.view, "Viewers"), y(2), D("routerLink", "/blog-details/" + o.blog.id), y(), $(o.blog.title), y(2), ye("", o.blog.desc, ".."), y(3), D("routerLink", "/blog-details/" + o.blog.id), y(), D("src", o.blog.author, pe), y(), ye(" ", o.blog.author_name, " "), y(2), D("routerLink", "/blog-details/" + o.blog.id))
        },
        dependencies: [Ee, he]
    });
    let t = e;
    return t
})();
var fw = (() => {
    let e = class e {
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275cmp = T({
        type: e,
        selectors: [["app-blog-standard"]],
        inputs: {blog: "blog"},
        standalone: !0,
        features: [x],
        decls: 30,
        vars: 13,
        consts: [[1, "blog-standard-post"], [1, "blog-standard-thumb"], [3, "routerLink"], ["alt", "", 3, "src"], [1, "blog-standard-content"], [1, "blog-meta"], [1, "list-wrap"], [1, "blog-author"], [1, "far", "fa-clock"], [1, "far", "fa-comment"], [1, "far", "fa-eye"], [1, "title"], [1, "read-more-btn"], [1, "fas", "fa-arrow-right"]],
        template: function (r, o) {
            r & 1 && (u(0, "div", 0)(1, "div", 1)(2, "a", 2), v(3, "img", 3), d()(), u(4, "div", 4)(5, "div", 5)(6, "ul", 6)(7, "li", 7)(8, "a", 2), v(9, "img", 3), h(10), d()(), u(11, "li"), v(12, "i", 8), h(13), d(), u(14, "li")(15, "a", 2), v(16, "i", 9), h(17), d()(), u(18, "li"), v(19, "i", 10), h(20), d()()(), u(21, "h2", 11)(22, "a", 2), h(23), d()(), u(24, "p"), h(25), d(), u(26, "div", 12)(27, "a", 2), h(28, "Read More"), v(29, "i", 13), d()()()()), r & 2 && (y(2), D("routerLink", "/blog-details/" + o.blog.id), y(), D("src", o.blog.img, pe), y(5), D("routerLink", "/blog-details/" + o.blog.id), y(), D("src", o.blog.author, pe), y(), ye(" ", o.blog.author_name, " "), y(3), $(o.blog.date), y(2), D("routerLink", "/blog-details/" + o.blog.id), y(2), ye(" ", o.blog.comment > 9 ? o.blog.comment : "0" + o.blog.comment, " "), y(3), ye("", o.blog.view, "Viewers"), y(2), D("routerLink", "/blog-details/" + o.blog.id), y(), $(o.blog.title), y(2), $(o.blog.desc), y(2), D("routerLink", "/blog-details/" + o.blog.id))
        },
        dependencies: [Ee, he]
    });
    let t = e;
    return t
})();

function iN(t, e) {
    if (t & 1 && (u(0, "div", 21)(1, "div", 22)(2, "a", 23), v(3, "img", 24), d()(), u(4, "div", 25)(5, "span", 26), h(6), d(), u(7, "h6", 27)(8, "a", 23), h(9), d()()()()), t & 2) {
        let n = e.$implicit;
        y(2), D("routerLink", "/blog-details/" + n.id), y(), D("src", n.img, pe), y(3), $(n.date), y(2), D("routerLink", "/blog-details/" + n.id), y(), ye("", n.title.slice(0, 40), "..")
    }
}

var xl = (() => {
    let e = class e {
        constructor() {
            this.recent_posts = [...pl].slice(-3)
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275cmp = T({
        type: e,
        selectors: [["app-blog-sidebar"]],
        standalone: !0,
        features: [x],
        decls: 99,
        vars: 1,
        consts: [[1, "blog-sidebar"], [1, "blog-widget"], [1, "widget-title"], [1, "sidebar-search"], ["action", "#"], ["type", "text", "placeholder", "Search your keyword"], ["type", "submit"], [1, "fas", "fa-search"], [1, "sidebar-cat-list"], [1, "list-wrap"], ["href", "#"], [1, "rc-post-wrap"], ["class", "rc-post-item", 4, "ngFor", "ngForOf"], [1, "sidebar-follow-wrap"], [1, "fab", "fa-facebook-f"], ["xmlns", "http://www.w3.org/2000/svg", "width", "16", "height", "16", "viewBox", "0 0 16 16", "fill", "none"], ["d", "M10.0596 7.34522L15.8879 0.570312H14.5068L9.44607 6.45287L5.40411 0.570312H0.742188L6.85442 9.46578L0.742188 16.5703H2.12338L7.4676 10.3581L11.7362 16.5703H16.3981L10.0593 7.34522H10.0596ZM8.16787 9.54415L7.54857 8.65836L2.62104 1.61005H4.74248L8.71905 7.29827L9.33834 8.18405L14.5074 15.5779H12.386L8.16787 9.54449V9.54415Z", "fill", "currentColor"], [1, "fab", "fa-linkedin-in"], [1, "fab", "fa-instagram"], ["routerLink", "/contact", 1, "btn"], [1, "sidebar-tag-list"], [1, "rc-post-item"], [1, "thumb"], [3, "routerLink"], ["alt", "", 2, "width", "80px", "height", "80px", "object-fit", "cover", 3, "src"], [1, "content"], [1, "date"], [1, "title"]],
        template: function (r, o) {
            r & 1 && (u(0, "aside", 0)(1, "div", 1)(2, "h4", 2), h(3, "Search"), d(), u(4, "div", 3)(5, "form", 4), v(6, "input", 5), u(7, "button", 6), v(8, "i", 7), d()()()(), u(9, "div", 1)(10, "h4", 2), h(11, "Categories"), d(), u(12, "div", 8)(13, "ul", 9)(14, "li")(15, "a", 10), h(16, "Blockchain "), u(17, "span"), h(18, "05"), d()()(), u(19, "li")(20, "a", 10), h(21, "Web Development "), u(22, "span"), h(23, "03"), d()()(), u(24, "li")(25, "a", 10), h(26, "Cryptocurrency "), u(27, "span"), h(28, "06"), d()()(), u(29, "li")(30, "a", 10), h(31, "Branding Design "), u(32, "span"), h(33, "05"), d()()(), u(34, "li")(35, "a", 10), h(36, "Uncategorized "), u(37, "span"), h(38, "02"), d()()()()()(), u(39, "div", 1)(40, "h4", 2), h(41, "Recent Posts"), d(), u(42, "div", 11), Y(43, iN, 10, 5, "div", 12), d()(), u(44, "div", 1)(45, "h4", 2), h(46, "Follow Us"), d(), u(47, "div", 13)(48, "ul", 9)(49, "li")(50, "a", 10), v(51, "i", 14), d()(), u(52, "li")(53, "a", 10), Ke(), u(54, "svg", 15), v(55, "path", 16), d()()(), Ze(), u(56, "li")(57, "a", 10), v(58, "i", 17), d()(), u(59, "li")(60, "a", 10), v(61, "i", 18), d()()(), u(62, "a", 19), h(63, "Get In Touch"), d()()(), u(64, "div", 1)(65, "h4", 2), h(66, "Tags"), d(), u(67, "div", 20)(68, "ul", 9)(69, "li")(70, "a", 10), h(71, "ICO"), d()(), u(72, "li")(73, "a", 10), h(74, "blockchain"), d()(), u(75, "li")(76, "a", 10), h(77, "investments"), d()(), u(78, "li")(79, "a", 10), h(80, "currency"), d()(), u(81, "li")(82, "a", 10), h(83, "crypto trading"), d()(), u(84, "li")(85, "a", 10), h(86, "crypto"), d()(), u(87, "li")(88, "a", 10), h(89, "ico blockchain"), d()(), u(90, "li")(91, "a", 10), h(92, "advisor"), d()(), u(93, "li")(94, "a", 10), h(95, "web"), d()(), u(96, "li")(97, "a", 10), h(98, "ICO Tokens"), d()()()()()()), r & 2 && (y(43), D("ngForOf", o.recent_posts))
        },
        dependencies: [H, we, Ee, he]
    });
    let t = e;
    return t
})();
var pw = t => ({disabled: t}), rN = t => ({active: t});

function oN(t, e) {
    if (t & 1) {
        let n = cr();
        u(0, "li", 2)(1, "a", 3), j("click", function () {
            let r = mn(n).$implicit, o = Je(2);
            return gn(o.pageSet(r))
        }), h(2), d()()
    }
    if (t & 2) {
        let n = e.$implicit, i = Je(2);
        D("ngClass", bn(2, rN, i.paginate.currentPage == n)), y(2), $(n)
    }
}

function sN(t, e) {
    if (t & 1) {
        let n = cr();
        u(0, "ul", 1)(1, "li", 2)(2, "a", 3), j("click", function () {
            mn(n);
            let r = Je();
            return gn(r.pageSet(r.paginate.currentPage - 1))
        }), v(3, "i", 4), d()(), Y(4, oN, 3, 4, "li", 5), u(5, "li", 2)(6, "a", 3), j("click", function () {
            mn(n);
            let r = Je();
            return gn(r.pageSet(r.paginate.currentPage + 1))
        }), v(7, "i", 6), d()()()
    }
    if (t & 2) {
        let n = Je();
        y(), D("ngClass", bn(3, pw, n.paginate.currentPage === 1)), y(3), D("ngForOf", n.paginate.pages), y(), D("ngClass", bn(5, pw, n.paginate.currentPage == n.paginate.totalPages))
    }
}

var hw = (() => {
    let e = class e {
        constructor() {
            this.data = [], this.paginate = {}, this.setPage = new ke
        }

        ngOnInit() {
        }

        pageSet(i) {
            this.setPage.emit(i)
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275cmp = T({
        type: e,
        selectors: [["app-pagination"]],
        inputs: {data: "data", paginate: "paginate"},
        outputs: {setPage: "setPage"},
        standalone: !0,
        features: [x],
        decls: 1,
        vars: 1,
        consts: [["class", "list-wrap", 4, "ngIf"], [1, "list-wrap"], [3, "ngClass"], [1, "pointer", 3, "click"], [1, "fas", "fa-arrow-left"], [3, "ngClass", 4, "ngFor", "ngForOf"], [1, "fas", "fa-arrow-right"]],
        template: function (r, o) {
            r & 1 && Y(0, sN, 8, 7, "ul", 0), r & 2 && D("ngIf", o.paginate.pages && o.paginate.pages.length)
        },
        dependencies: [H, uv, we, _t]
    });
    let t = e;
    return t
})();
var mw = (() => {
    let e = class e {
        constructor() {
        }

        getPager(i, r = 1, o = 9) {
            let s = Math.ceil(i / o), a = 3;
            r < 1 ? r = 1 : r > s && (r = s);
            let l, c;
            s <= 5 ? (l = 1, c = s) : r < a - 1 ? (l = 1, c = l + a - 1) : (l = r - 1, c = r + 1);
            let f = (r - 1) * o, p = Math.min(f + o - 1, i - 1),
                m = Array.from(Array(c + 1 - l).keys()).map(g => l + g);
            return {
                totalItems: i,
                currentPage: r,
                pageSize: o,
                totalPages: s,
                startPage: l,
                endPage: c,
                startIndex: f,
                endIndex: p,
                pages: m
            }
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275prov = B({token: e, factory: e.\u0275fac, providedIn: "root"});
    let t = e;
    return t
})();

function lN(t, e) {
    if (t & 1 && ($n(0), v(1, "app-blog-masonry", 11), Bn()), t & 2) {
        let n = Je().$implicit;
        y(), D("blog", n)
    }
}

function cN(t, e) {
    if (t & 1 && ($n(0), v(1, "app-blog-standard", 11), Bn()), t & 2) {
        let n = Je().$implicit;
        y(), D("blog", n)
    }
}

function uN(t, e) {
    if (t & 1 && ($n(0), Y(1, lN, 2, 1, "ng-container", 10)(2, cN, 2, 1, "ng-container", 10), Bn()), t & 2) {
        let n = e.$implicit;
        y(), D("ngIf", n.blog_masonry), y(), D("ngIf", n.blog_standard)
    }
}

var gw = (() => {
    let e = class e {
        constructor(i, r, o, s) {
            this.paginationService = i, this.utilsService = r, this.route = o, this.router = s, this.blogs = [], this.pageSize = 3, this.paginate = {}, this.pageNo = 1
        }

        ngOnInit() {
            this.route.queryParams.subscribe(i => {
                this.pageNo = i.page ? i.page : this.pageNo, this.utilsService.blogs.subscribe(r => {
                    this.blogs = r, this.paginate = this.paginationService.getPager(this.blogs.length, +this.pageNo, this.pageSize), this.blogs = this.blogs.slice(this.paginate.startIndex, this.paginate.endIndex + 1)
                })
            })
        }

        setPage(i) {
            this.router.navigate([], {
                relativeTo: this.route,
                queryParams: {page: i},
                queryParamsHandling: "merge",
                skipLocationChange: !1
            }).finally(() => {
                window.scrollTo(0, 0)
            })
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)(P(mw), P(Ae), P(xt), P(Me))
    }, e.\u0275cmp = T({
        type: e,
        selectors: [["app-blog"]],
        standalone: !0,
        features: [x],
        decls: 16,
        vars: 5,
        consts: [["title", "Our Blog", "subTitle", "Our Blog"], [1, "blog-area", "pt-140", "pb-140"], [1, "container"], [1, "row"], [1, "col-lg-8"], [1, "blog-post-wrap"], [4, "ngFor", "ngForOf"], [1, "pagination-wrap"], [3, "setPage", "data", "paginate"], [1, "col-lg-4"], [4, "ngIf"], [3, "blog"]],
        template: function (r, o) {
            r & 1 && (u(0, "div"), v(1, "app-header-three"), u(2, "main"), v(3, "app-breadcrumb", 0), u(4, "section", 1)(5, "div", 2)(6, "div", 3)(7, "div", 4)(8, "div", 5), Y(9, uN, 3, 2, "ng-container", 6), d(), u(10, "nav", 7)(11, "app-pagination", 8), j("setPage", function (a) {
                return o.setPage(a)
            }), d()()(), u(12, "div", 9), v(13, "app-blog-sidebar"), d()()()(), v(14, "app-document-area"), d(), v(15, "app-footer-three"), d()), r & 2 && (ee("mobile-menu-visible", o.utilsService.openMobileMenus), y(9), D("ngForOf", o.blogs), y(2), D("data", o.blogs)("paginate", o.paginate))
        },
        dependencies: [H, we, _t, Fr, Rr, Lr, Vr, dw, fw, xl, hw]
    });
    let t = e;
    return t
})();
var vw = (() => {
    let e = class e {
        constructor(i, r, o) {
            this.route = i, this.utilsService = r, this.router = o, this.related_blogs = []
        }

        ngOnInit() {
            this.route.paramMap.pipe(nt(i => {
                let r = i.get("id");
                return r ? this.utilsService.getBlogById(r) : q(null)
            })).subscribe(i => {
                i ? this.blog = i : this.router.navigate(["/404"])
            })
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)(P(xt), P(Ae), P(Me))
    }, e.\u0275cmp = T({
        type: e,
        selectors: [["app-blog-details"]],
        standalone: !0,
        features: [x],
        decls: 164,
        vars: 9,
        consts: [["title", "Blog Details", "subTitle", "Blog Details"], [1, "blog-details-area", "pt-140", "pb-140"], [1, "container"], [1, "row"], [1, "col-lg-8"], [1, "blog-details-wrap"], [1, "blog-details-thumb"], ["alt", "", 1, "w-100", 3, "src"], [1, "blog-details-content"], [1, "blog-meta"], [1, "list-wrap"], [1, "blog-author"], ["routerLink", "/blog"], ["alt", "", 3, "src"], [1, "far", "fa-clock"], [1, "far", "fa-comment"], [1, "far", "fa-eye"], [1, "title"], [1, "blog-details-inner-img"], [1, "col-md-6"], ["src", "/assets/img/blog/blog_details02.jpg", "alt", ""], ["src", "/assets/img/blog/blog_details03.jpg", "alt", ""], [1, "blog-details-bottom"], [1, "row", "align-items-center"], [1, "col-md-7"], [1, "post-tags"], ["href", "#"], [1, "col-md-5"], [1, "blog-post-share"], [1, "fab", "fa-facebook-f"], [1, "fab", "fa-linkedin-in"], ["xmlns", "http://www.w3.org/2000/svg", "width", "16", "height", "16", "viewBox", "0 0 16 16", "fill", "none"], ["d", "M10.0596 7.34522L15.8879 0.570312H14.5068L9.44607 6.45287L5.40411 0.570312H0.742188L6.85442 9.46578L0.742188 16.5703H2.12338L7.4676 10.3581L11.7362 16.5703H16.3981L10.0593 7.34522H10.0596ZM8.16787 9.54415L7.54857 8.65836L2.62104 1.61005H4.74248L8.71905 7.29827L9.33834 8.18405L14.5074 15.5779H12.386L8.16787 9.54449V9.54415Z", "fill", "currentColor"], [1, "fab", "fa-instagram"], [1, "blog-avatar-wrap", "mb-65"], [1, "blog-avatar-img"], ["src", "/assets/img/blog/avatar.png", "alt", "img"], [1, "blog-avatar-info"], [1, "name"], [1, "comments-wrap"], [1, "comments-wrap-title"], [1, "latest-comments"], [1, "comments-box"], [1, "comments-avatar"], ["src", "/assets/img/blog/comment01.png", "alt", "img"], [1, "comments-text"], [1, "avatar-name"], ["href", "#", 1, "reply-btn"], [1, "date"], [1, "children", "list-wrap"], ["src", "/assets/img/blog/comment02.png", "alt", "img"], [1, "comment-respond"], [1, "comment-reply-title"], ["action", "#", 1, "comment-form"], [1, "comment-notes"], [1, "form-grp"], ["for", "name"], ["type", "text", "id", "name"], ["for", "email"], ["type", "email", "id", "email"], ["for", "website"], ["type", "url", "id", "website"], ["for", "message"], ["name", "comment", "id", "message", "placeholder", "Simultaneously we had a problem"], [1, "form-grp", "checkbox-grp"], ["type", "checkbox", "id", "checkbox", 1, "form-check-input"], ["for", "checkbox"], ["type", "submit", 1, "btn"], [1, "col-lg-4"]],
        template: function (r, o) {
            r & 1 && (u(0, "div"), v(1, "app-header-three"), u(2, "main"), v(3, "app-breadcrumb", 0), u(4, "section", 1)(5, "div", 2)(6, "div", 3)(7, "div", 4)(8, "div", 5)(9, "div", 6), v(10, "img", 7), d(), u(11, "div", 8)(12, "div", 9)(13, "ul", 10)(14, "li", 11)(15, "a", 12), v(16, "img", 13), h(17), d()(), u(18, "li"), v(19, "i", 14), h(20), d(), u(21, "li")(22, "a", 12), v(23, "i", 15), h(24), d()(), u(25, "li"), v(26, "i", 16), h(27), d()()(), u(28, "h2", 17), h(29), d(), u(30, "p"), h(31, 'In the world of cryptocurrency, ICOs (Initial Coin Offerings) have emerged as a powerful fundraising tool for innovative projects and blockchain-based startups. "ICO Success Stories: Realizing the Potential of Token Sales" delves into the remarkable achievements and breakthroughs witnessed in the realm of ICOs'), d(), u(32, "p"), h(33, "This blog explores how these token sales have transformed the way companies raise capital, democratizing investment opportunities and enabling individuals from all around the world to participate. We dive into inspiring success stories of projects that started with an ICO and went on to disrupt industries, revolutionize technology, and create immense value for their investors. Discover how ICOs have unleashed."), d(), u(34, "p"), h(35, "We delve into real-life examples of projects that have soared to new heights after launching their ICOs. From decentralized finance (DeFi) platforms that have transformed the traditional banking system to blockchain-based solutions addressing real-world challenges, these success stories demonstrate the power."), d(), u(36, "p"), h(37, "the potential of blockchain technology, fostering innovation and driving economic growth. Join us on this journey as we explore the fascinating world of ICO success stories and the incredible potential they hold."), d(), u(38, "blockquote")(39, "p"), h(40, "There are no secrets to success. It is the result of preparation, hard work, and learning from failure."), d(), u(41, "cite"), h(42, "- Chris Prouty"), d()(), u(43, "div", 18)(44, "div", 3)(45, "div", 19), v(46, "img", 20), d(), u(47, "div", 19), v(48, "img", 21), d()()(), u(49, "p"), h(50, "Join us as we delve into the journeys of these trailblazing projects, from the initial idea to the successful ICO and beyond. Gain insights into the strategies they employed, the challenges they overcame, and the lessons they learned along the way. ICO success stories are not just about financial gains but also about the transformative impact these projects have had on various sectors. If you're curious about the potential of ICOs. "), d(), u(51, "p"), h(52, "We explore a diverse range of projects that have thrived after launching their ICOs, disrupting traditional industries and paving the way for revolutionary solutions. From decentralized applications (DApps) that have reshaped digital ecosystems to blockchain platforms revolutionizing supply chain management, these success stories demonstrate the power of ICOs to propel ideas into reality."), d(), u(53, "p"), h(54, "Through in-depth case studies and interviews with project leaders, we offer insights into the challenges they faced, the strategies they employed, and the lessons they learned along the way. Whether you're an investor seeking inspiration or an entrepreneur entrepreneur considering an ICO, these stories."), d(), u(55, "div", 22)(56, "div", 23)(57, "div", 24)(58, "div", 25)(59, "ul", 10)(60, "li")(61, "a", 26), h(62, "ICO"), d()(), u(63, "li")(64, "a", 26), h(65, "blockchain"), d()(), u(66, "li")(67, "a", 26), h(68, "currency"), d()()()()(), u(69, "div", 27)(70, "div", 28)(71, "ul", 10)(72, "li")(73, "a", 26), v(74, "i", 29), d()(), u(75, "li")(76, "a", 26), v(77, "i", 30), d()(), u(78, "li")(79, "a", 26), Ke(), u(80, "svg", 31), v(81, "path", 32), d()()(), Ze(), u(82, "li")(83, "a", 26), v(84, "i", 33), d()()()()()()()()(), u(85, "div", 34)(86, "div", 35)(87, "a", 26), v(88, "img", 36), d()(), u(89, "div", 37)(90, "h4", 38)(91, "a", 26), h(92, "About Anik Singal"), d()(), u(93, "p"), h(94, "The Founder and Creative Director of IKO, a digital creative studio in USA, has over 15 years of experience as an award-winning Creative Director/Art for clients."), d()()(), u(95, "div", 39)(96, "h3", 40), h(97, "Comments 02"), d(), u(98, "div", 41)(99, "ul", 10)(100, "li")(101, "div", 42)(102, "div", 43), v(103, "img", 44), d(), u(104, "div", 45)(105, "div", 46)(106, "h6", 38), h(107, "Reed Floren "), u(108, "a", 47),h(109, "Reply"),d()(),u(110, "span", 48),h(111, "August 13, 2024"),d()(),u(112, "p"),h(113, "The platform itself was incredibly user-friendly, making it easy for me to participate in the ICO. The intuitive interface guided me through the token purchase process seamlessly."),d()()(),u(114, "ul", 49)(115, "li")(116, "div", 42)(117, "div", 43),v(118, "img", 50),d(),u(119, "div", 45)(120, "div", 46)(121, "h6", 38),h(122, "Tony Dargis "),u(123, "a", 47),h(124, "Reply"),d()(),u(125, "span", 48),h(126, "August 15, 2024"),d()(),u(127, "p"),h(128, "What stood out to me the most was the exceptional customer support. The team behind the platform was responsive and helpful, promptly addressing my inquiries and providing."),d()()()()()()()()(),u(129, "div", 51)(130, "h3", 52),h(131, "Leave a Reply"),d(),u(132, "form", 53)(133, "p", 54),h(134, "Your email address will not be published. Required fields are marked *"),d(),u(135, "div", 3)(136, "div", 19)(137, "div", 55)(138, "label", 56),h(139, "Name"),d(),v(140, "input", 57),d()(),u(141, "div", 19)(142, "div", 55)(143, "label", 58),h(144, "Email"),d(),v(145, "input", 59),d()()(),u(146, "div", 55)(147, "label", 60),h(148, "Website"),d(),v(149, "input", 61),d(),u(150, "div", 55)(151, "label", 62),h(152, "Message"),d(),v(153, "textarea", 63),d(),u(154, "div", 64),v(155, "input", 65),u(156, "label", 66),h(157, "Save my name, email, and website in this browser for the next time I comment. "),d()(),u(158, "button", 67),h(159, "Submit Now"),d()()()(),u(160, "div", 68),v(161, "app-blog-sidebar"),d()()()(),v(162, "app-document-area"),d(),v(163, "app-footer-three"),d()), r & 2 && (ee("mobile-menu-visible", o.utilsService.openMobileMenus), y(10), D("src", o.blog == null ? null : o.blog.img, pe), y(6), D("src", o.blog == null ? null : o.blog.author, pe), y(), ye(" ", o.blog == null ? null : o.blog.author_name, " "), y(3), $(o.blog == null ? null : o.blog.date), y(4), ye(" ", o.blog == null ? null : o.blog.comment, " "), y(3), ye("", o.blog == null ? null : o.blog.view, "Viewers"), y(2), $(o.blog == null ? null : o.blog.title))
        },
        dependencies: [H, Ee, he, Fr, Rr, Lr, xl, Vr]
    });
    let t = e;
    return t
})();
var yw = [{path: "", redirectTo: "home", pathMatch: "full"}, {
    path: "home",
    children: [{path: "", component: yy, title: "Home Main - IKO"}, {
        path: "home-two",
        component: Oy,
        title: "Home two - IKO"
    }]
}, {path: "blog", component: gw, title: "Blog - IKO"}, {
    path: "blog-details/:id",
    component: vw,
    title: "Blog Details - IKO"
}, {path: "contact", component: uw, title: "Contact - IKO"}];
var dN = {scrollPositionRestoration: "top", anchorScrolling: "enabled"}, fN = a0(dN),
    ww = {providers: [o0(yw, fN), $0()]};
var bw = (() => {
    let e = class e {
        ngOnInit() {
            let i = document.querySelector(".scroll-to-target");
            i && (document.addEventListener("scroll", () => {
                window.scrollY > 200 ? i.classList.add("open") : i.classList.remove("open")
            }), i.addEventListener("click", () => {
                window.scrollTo({top: 0, behavior: "smooth"})
            }))
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)
    }, e.\u0275cmp = T({
        type: e,
        selectors: [["app-back-to-top"]],
        standalone: !0,
        features: [x],
        decls: 2,
        vars: 0,
        consts: [["data-target", "html", 1, "scroll-top", "scroll-to-target"], [1, "fas", "fa-angle-up"]],
        template: function (r, o) {
            r & 1 && (u(0, "button", 0), v(1, "i", 1), d())
        }
    });
    let t = e;
    return t
})();
var Ew = (() => {
    let e = class e {
        constructor(i) {
            this.router = i, this.title = "IKO - ICO & Crypto Landing Page Angular Template"
        }

        ngOnInit() {
            this.router.events.subscribe(i => {
                i instanceof st && window.scrollTo(0, 0)
            })
        }
    };
    e.\u0275fac = function (r) {
        return new (r || e)(P(Me))
    }, e.\u0275cmp = T({
        type: e,
        selectors: [["app-root"]],
        standalone: !0,
        features: [x],
        decls: 2,
        vars: 0,
        template: function (r, o) {
            r & 1 && v(0, "router-outlet")(1, "app-back-to-top")
        },
        dependencies: [H, rf, bw],
        encapsulation: 2
    });
    let t = e;
    return t
})();
vv(Ew, ww).catch(t => console.error(t));
