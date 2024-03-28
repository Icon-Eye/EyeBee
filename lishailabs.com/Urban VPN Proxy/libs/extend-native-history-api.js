(()=>{
    "use strict";
    var e = {
        55258: (e,t)=>{
            Object.defineProperty(t, "__esModule", {
                value: !0
            }),
            t.queue = t.delay = t.parseUrl = t.debounce = t.DEFAULT_DEBOUNCE_TIME = t.pipe = t.uuid = t.isIframe = void 0,
            t.isIframe = function() {
                try {
                    return window.self !== window.top
                } catch {
                    return !0
                }
            }
            ,
            t.uuid = function() {
                return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (function(e) {
                    const t = 16 * Math.random() | 0;
                    return ("x" === e ? t : 3 & t | 8).toString(16)
                }
                ))
            }
            ;
            t.pipe = (...e)=>t=>e.reduce(((e,t)=>t(e)), t),
            t.DEFAULT_DEBOUNCE_TIME = 150;
            t.debounce = (e,o=t.DEFAULT_DEBOUNCE_TIME)=>{
                let s = 0;
                return (...t)=>{
                    clearTimeout(s),
                    s = setTimeout((()=>e(...t)), o)
                }
            }
            ;
            t.parseUrl = e=>{
                try {
                    return new URL(e)
                } catch {
                    return e
                }
            }
            ;
            t.delay = async e=>{
                await new Promise((t=>setTimeout(t, e, !0)))
            }
            ;
            t.queue = (e=1)=>{
                const t = []
                  , o = [];
                return async function s(E) {
                    if (t.length < e) {
                        if (t.push(E),
                        await E(),
                        t.shift(),
                        o.length) {
                            const e = o.shift();
                            s(e.callback).then((t=>e.resolve(t)))
                        }
                    } else
                        await new Promise((e=>{
                            o.push({
                                resolve: e,
                                callback: E
                            })
                        }
                        ))
                }
            }
        }
        ,
        35263: (e,t)=>{
            Object.defineProperty(t, "__esModule", {
                value: !0
            }),
            t.MessageScriptType = t.MessageContentType = void 0,
            function(e) {
                e.ECOMMERCE_INIT = "ECOMMERCE_INIT",
                e.ECOMMERCE_RE_INIT = "ECOMMERCE_RE_INIT",
                e.ECOMMERCE_TRACK = "ECOMMERCE_TRACK",
                e.ECOMMERCE_RUNTIME_STORAGE_SAVE = "ECOMMERCE_RUNTIME_STORAGE_SAVE",
                e.ECOMMERCE_RUNTIME_STORAGE_REMOVE = "ECOMMERCE_RUNTIME_STORAGE_REMOVE",
                e.ERROR_TRACE = "ERROR_TRACE",
                e.ECOMMERCE_INIT_SHOPIFY = "ECOMMERCE_INIT_SHOPIFY"
            }(t.MessageContentType || (t.MessageContentType = {})),
            function(e) {
                e.INIT_HTTP_CONFIG = "INIT_HTTP_CONFIG",
                e.SAVE_HTTP_DATA = "SAVE_HTTP_DATA",
                e.CUSTOM_ON_URL_CHANGED = "CUSTOM_ON_URL_CHANGED",
                e.SHOPIFY_DETECTED = "SHOPIFY_DETECTED"
            }(t.MessageScriptType || (t.MessageScriptType = {}))
        }
    }
      , t = {};
    function o(s) {
        var E = t[s];
        if (void 0 !== E)
            return E.exports;
        var r = t[s] = {
            exports: {}
        };
        return e[s](r, r.exports, o),
        r.exports
    }
    (()=>{
        const e = o(35263)
          , t = o(55258);
        (()=>{
            const t = history.pushState
              , o = history.replaceState
              , s = history.back
              , E = history.forward;
            function r() {
                window.postMessage({
                    _custom_type_: e.MessageScriptType.CUSTOM_ON_URL_CHANGED
                })
            }
            history.pushState = function(...e) {
                t.apply(history, e),
                r()
            }
            ,
            history.replaceState = function(...e) {
                o.apply(history, e),
                r()
            }
            ,
            history.back = function(...e) {
                s.apply(history, e),
                r()
            }
            ,
            history.forward = function(...e) {
                E.apply(history, e),
                r()
            }
            ,
            window.addEventListener("hashchange", r)
        }
        )(),
        (()=>{
            const o = (0,
            t.debounce)((function(t) {
                const o = {
                    _custom_type_: e.MessageScriptType.SHOPIFY_DETECTED,
                    payload: {
                        $shopify: JSON.parse(JSON.stringify(t))
                    }
                };
                window.postMessage(o)
            }
            ), 4e3);
            try {
                if (globalThis.Shopify)
                    return void o(globalThis.Shopify);
                Object.defineProperty(globalThis, "Shopify", {
                    set(e) {
                        this.__Shopify = e,
                        o(e)
                    },
                    get() {
                        return this.__Shopify
                    }
                })
            } catch (e) {
                o(globalThis.Shopify)
            }
        }
        )()
    }
    )()
}
)();
