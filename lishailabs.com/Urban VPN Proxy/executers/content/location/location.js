(()=>{
    "use strict";
    var e = {
        71661: (e,o)=>{
            Object.defineProperty(o, "__esModule", {
                value: !0
            }),
            o.BrotherException = void 0;
            class t extends Error {
                constructor(e) {
                    super(e),
                    this.name = "BrotherException"
                }
            }
            o.BrotherException = t
        }
        ,
        44393: (e,o,t)=>{
            Object.defineProperty(o, "__esModule", {
                value: !0
            }),
            o.BrotherTypes = o.BrowserName = o.BrotherName = o.BrotherException = void 0;
            const s = t(71661);
            Object.defineProperty(o, "BrotherException", {
                enumerable: !0,
                get: function() {
                    return s.BrotherException
                }
            }),
            function(e) {
                e.Mario = "Mario",
                e.Luigi = "Luigi"
            }(o.BrotherName || (o.BrotherName = {})),
            function(e) {
                e.Firefox = "Firefox",
                e.Chrome = "Chrome",
                e.Chromium = "Chromium",
                e.Edge = "Edge"
            }(o.BrowserName || (o.BrowserName = {})),
            function(e) {
                e.appName = "Brother.AppName",
                e.brother = "Brother",
                e.dispatcher = "Brother.Dispatcher",
                e.di = "Brother.DI",
                e.env = "Brother.ENV",
                e.logger = "Brother.Logger",
                e.loggerHistory = "Brother.LoggerHistory",
                e.logging = "Brother.Logging",
                e.name = "Brother.Name",
                e.browser = "Brother.Browser"
            }(o.BrotherTypes || (o.BrotherTypes = {}))
        }
        ,
        91685: (e,o)=>{
            Object.defineProperty(o, "__esModule", {
                value: !0
            }),
            o.HideMyLocationMessageType = void 0,
            function(e) {
                e.getLocation = "HideLocation.GetLocation"
            }(o.HideMyLocationMessageType || (o.HideMyLocationMessageType = {}))
        }
        ,
        68919: (e,o,t)=>{
            Object.defineProperty(o, "__esModule", {
                value: !0
            }),
            o.ToadHideLocationService = void 0;
            const s = t(91685);
            class a {
                constructor(e) {
                    this.link = e,
                    this.locationExtended = !1,
                    this.watchIDs = new Map
                }
                extendLocation() {
                    this.locationExtended || (this.locationExtended = !0,
                    this.extendCurrentPosition(),
                    this.extendWatchPosition(),
                    this.extendClearWatch())
                }
                isLocationExtended() {
                    return this.locationExtended
                }
                extendCurrentPosition() {
                    const e = navigator.geolocation.getCurrentPosition;
                    navigator.geolocation.getCurrentPosition = (...o)=>{
                        this.sendMessageToMario().then(this.geolocationMiddleware({
                            geolocationMethod: e,
                            fakeWatchId: null
                        }, ...o))
                    }
                }
                extendWatchPosition() {
                    const e = navigator.geolocation.watchPosition;
                    navigator.geolocation.watchPosition = (...o)=>{
                        const t = a.getRandomInt(0, 1e5);
                        return this.sendMessageToMario().then(this.geolocationMiddleware({
                            geolocationMethod: e,
                            fakeWatchId: t
                        }, ...o)),
                        t
                    }
                }
                async sendMessageToMario() {
                    const e = {
                        type: s.HideMyLocationMessageType.getLocation
                    };
                    return await this.link.sendToMarioAsync(e)
                }
                extendClearWatch() {
                    const e = navigator.geolocation.clearWatch
                      , o = this;
                    navigator.geolocation.clearWatch = function(t) {
                        const s = o.watchIDs.get(t);
                        if (s)
                            return o.watchIDs.delete(t),
                            e.call(this, s)
                    }
                }
                geolocationMiddleware({geolocationMethod: e, fakeWatchId: o}, t, s, n) {
                    return r=>{
                        if (!r.enabled) {
                            const a = e.call(navigator.geolocation, t, s, n);
                            if (a && o)
                                return void this.watchIDs.set(o, a)
                        }
                        r.success ? t(a.mappedResponse(r)) : s?.(a.errorResponse())
                    }
                }
                static mappedResponse({coords: e}) {
                    return {
                        coords: {
                            accuracy: 20,
                            altitude: null,
                            altitudeAccuracy: null,
                            heading: null,
                            latitude: e?.latitude,
                            longitude: e?.longitude,
                            speed: null
                        },
                        timestamp: Date.now()
                    }
                }
                static errorResponse() {
                    return {
                        code: 1,
                        message: "User denied Geolocation"
                    }
                }
                static getRandomInt(e, o) {
                    const t = Math.ceil(e)
                      , s = Math.floor(o);
                    return Math.floor(Math.random() * (s - t + 1)) + t
                }
            }
            o.ToadHideLocationService = a
        }
        ,
        96191: (e,o)=>{
            Object.defineProperty(o, "__esModule", {
                value: !0
            }),
            o.ToadName = o.ToadMessages = void 0,
            function(e) {
                e.from = "Toad.FromToad",
                e.fromAsync = "Toad.FromToadAsync",
                e.to = "Toad.ToToad"
            }(o.ToadMessages || (o.ToadMessages = {})),
            o.ToadName = "Toad"
        }
        ,
        8573: (e,o,t)=>{
            Object.defineProperty(o, "__esModule", {
                value: !0
            }),
            o.isBoxFromToad = void 0;
            const s = t(96191);
            o.isBoxFromToad = e=>e?.sender === s.ToadName
        }
        ,
        37115: (e,o,t)=>{
            Object.defineProperty(o, "__esModule", {
                value: !0
            }),
            o.ToadDispatcher = void 0;
            const s = t(96191);
            o.ToadDispatcher = class {
                constructor(e) {
                    this.logger = e,
                    this.handlers = new Set,
                    this.eventsMap = new Map
                }
                on(e, o) {
                    if (this.handlers.has(o))
                        throw new Error(`This listener(callback)${o.name} is already registered`);
                    this.handlers.add(o);
                    const t = this.eventsMap.get(e) ?? [];
                    this.eventsMap.set(e, [...t, o])
                }
                async sendMessage(e) {
                    const {type: o} = e
                      , t = this.eventsMap.get(o);
                    if (null == t)
                        return void this.logger.info(`Dispatcher: Ignore event "${o}". No subscribers`);
                    this.logger.info(`Dispatcher: New box from "${s.ToadName}" says "${o}". Message: ${JSON.stringify(e, null, 2)}`);
                    const a = t.map((o=>o(e)));
                    (await Promise.allSettled(a)).forEach((e=>{
                        "rejected" === e.status && this.logger.error(`Dispatcher: a listener for a message "${o}" thrown en error`, e.reason)
                    }
                    ))
                }
            }
        }
        ,
        73126: (e,o,t)=>{
            Object.defineProperty(o, "__esModule", {
                value: !0
            }),
            o.useToadSafely = o.useToad = o.makeToad = void 0;
            const s = t(7482)
              , a = t(37115)
              , n = t(69510);
            let r;
            const i = [];
            class d {
                constructor(e, o, t, s, a) {
                    this._config = e,
                    this._link = o,
                    this._dispatcher = t,
                    this._logger = s,
                    this._extensionId = a
                }
                extensionId() {
                    return this._extensionId
                }
                options() {
                    return this._config
                }
                dispatcher() {
                    return this._dispatcher
                }
                link() {
                    return this._link
                }
            }
            o.makeToad = e=>{
                if (null != r)
                    throw new Error("Toad was already created");
                const o = document.currentScript?.id
                  , t = new s.ToadLogger(e)
                  , c = new a.ToadDispatcher(t)
                  , h = new n.ToadLink(e,c,o);
                return r = new d(e,h,c,t,o),
                i.forEach((e=>{
                    e(r)
                }
                )),
                r
            }
            ;
            o.useToad = ()=>{
                if (null == r)
                    throw new Error("Toad was not initially created");
                return r
            }
            ;
            o.useToadSafely = async()=>r || await new Promise((e=>{
                i.push(e)
            }
            ))
        }
        ,
        69510: (e,o,t)=>{
            Object.defineProperty(o, "__esModule", {
                value: !0
            }),
            o.ToadLink = void 0;
            const s = t(96191)
              , a = t(44393)
              , n = t(8573);
            o.ToadLink = class {
                constructor(e, o, t) {
                    this.config = e,
                    this.dispatcher = o,
                    this.extensionId = t,
                    this.requestIds = new Map,
                    window.addEventListener("message", this.onMessage.bind(this))
                }
                sendToLuigi(e) {
                    this.sendBox(a.BrotherName.Luigi, e)
                }
                sendToMario(e) {
                    this.sendBox(a.BrotherName.Mario, e)
                }
                async sendToLuigiAsync(e) {
                    return await this.sendAsyncBox(a.BrotherName.Luigi, e)
                }
                async sendToMarioAsync(e) {
                    return await this.sendAsyncBox(a.BrotherName.Mario, e)
                }
                sendBox(e, o) {
                    const t = {
                        sender: s.ToadName,
                        extensionId: this.extensionId,
                        message: {
                            toadName: this.toadName,
                            type: s.ToadMessages.from,
                            payload: {
                                to: e,
                                message: o
                            }
                        }
                    };
                    window.postMessage(t)
                }
                async sendAsyncBox(e, o) {
                    const t = {
                        requestId: this.generateRequestId(),
                        sender: s.ToadName,
                        extensionId: this.extensionId,
                        message: {
                            toadName: this.toadName,
                            type: s.ToadMessages.fromAsync,
                            payload: {
                                to: e,
                                message: o
                            }
                        }
                    };
                    return await new Promise((e=>{
                        this.requestIds.set(t.requestId, e),
                        window.postMessage(t)
                    }
                    ))
                }
                get toadName() {
                    return this.config.toadName
                }
                generateRequestId() {
                    return `${(1e4 * Math.random()).toFixed(1)}-${Date.now()}`
                }
                onMessage({data: e}) {
                    const o = e?.extensionId === this.extensionId
                      , t = [a.BrotherName.Mario, a.BrotherName.Luigi].includes(e?.sender)
                      , r = (0,
                    n.isBoxFromToad)(e)
                      , i = this.toadName === e?.message?.toadName;
                    !r && t && i && o && (this.requestIds.has(e?.requestId) ? this.handleOutComingMessage(e) : e?.message?.type === s.ToadMessages.to && this.handleInComingMessage(e))
                }
                handleOutComingMessage({message: e, requestId: o}) {
                    this.requestIds.get(o)(e.payload.response),
                    this.requestIds.delete(o)
                }
                handleInComingMessage({message: e}) {
                    this.dispatcher.sendMessage(e.payload.message)
                }
            }
        }
        ,
        7482: (e,o)=>{
            Object.defineProperty(o, "__esModule", {
                value: !0
            }),
            o.ToadLogger = void 0;
            o.ToadLogger = class {
                constructor(e) {
                    this.config = e
                }
                get logging() {
                    return Boolean(this.config.logging)
                }
                get prefix() {
                    return `[Toad-${this.config.toadName}]`
                }
                info(...e) {
                    this.logging
                }
                error(...e) {
                    this.logging
                }
            }
        }
    }
      , o = {};
    function t(s) {
        var a = o[s];
        if (void 0 !== a)
            return a.exports;
        var n = o[s] = {
            exports: {}
        };
        return e[s](n, n.exports, t),
        n.exports
    }
    (()=>{
        const e = t(73126)
          , o = t(68919);
        (()=>{
            const t = (0,
            e.makeToad)({
                env: "production",
                logging: !1,
                toadName: "Location"
            });
            new o.ToadHideLocationService(t.link()).extendLocation()
        }
        )()
    }
    )()
}
)();
