'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

var PUBLIC_URL = 'https://js.stytch.com/stytch.js';
function getJSUrl() {
    try {
        if (process.env.STYTCH_JS_SDK_URL) {
            return process.env.STYTCH_JS_SDK_URL;
        }
        if (process.env.REACT_APP_STYTCH_JS_SDK_URL) {
            return process.env.REACT_APP_STYTCH_JS_SDK_URL;
        }
        if (process.env.NEXT_PUBLIC_STYTCH_JS_SDK_URL) {
            return process.env.NEXT_PUBLIC_STYTCH_JS_SDK_URL;
        }
        if (process.env.STORYBOOK_STYTCH_JS_SDK_URL) {
            return process.env.STORYBOOK_STYTCH_JS_SDK_URL;
        }
        return PUBLIC_URL;
    }
    catch (err) {
        return PUBLIC_URL;
    }
}
var STYTCH_JS_URL = getJSUrl();

var findOrCreateScript = function () {
    var scripts = document.querySelectorAll("script[src=\"" + STYTCH_JS_URL + "\"]");
    if (scripts[0]) {
        return scripts[0];
    }
    var script = document.createElement('script');
    script.src = STYTCH_JS_URL;
    document.head.appendChild(script);
    return script;
};
var loadScript = function () {
    var isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
    if (!isBrowser) {
        return Promise.resolve(null);
    }
    return new Promise(function (resolve, reject) {
        if (window.Stytch) {
            console.warn('Stytch.js has already been loaded');
            resolve(window.Stytch);
        }
        var script = findOrCreateScript();
        script.addEventListener('load', function () {
            if (window.Stytch) {
                resolve(window.Stytch);
            }
            else {
                reject(new Error('Stytch.js could not be loaded'));
            }
        });
        script.addEventListener('error', function () {
            reject(new Error('Stytch.js could not be loaded'));
        });
    });
};
// Execute our own script injection after a tick to give users time to do their
// own script injection.
var stytchPromise = Promise.resolve().then(function () { return loadScript(); });
var loadCalled = false;
// We will log a warning if it doesn't look like the host code has checked or invoked the promise
stytchPromise.catch(function (err) {
    if (!loadCalled) {
        console.warn(err);
    }
});
var loadStytch = function () {
    loadCalled = true;
    return stytchPromise;
};

// Callback types
var EventType;
(function (EventType) {
    EventType["CallbackEvent"] = "CALLBACK_EVENT";
    EventType["ErrorEvent"] = "ERROR_EVENT";
    EventType["SuccessEvent"] = "SUCCESS_EVENT";
})(EventType || (EventType = {}));
var CallbackEventType;
(function (CallbackEventType) {
    CallbackEventType["UserEventType"] = "USER_EVENT_TYPE";
})(CallbackEventType || (CallbackEventType = {}));
exports.SDKProductTypes = void 0;
(function (SDKProductTypes) {
    SDKProductTypes["emailMagicLinks"] = "emailMagicLinks";
    SDKProductTypes["oauth"] = "oauth";
})(exports.SDKProductTypes || (exports.SDKProductTypes = {}));
exports.OAuthProvidersTypes = void 0;
(function (OAuthProvidersTypes) {
    OAuthProvidersTypes["Google"] = "google";
    OAuthProvidersTypes["Microsoft"] = "microsoft";
    OAuthProvidersTypes["Apple"] = "apple";
    OAuthProvidersTypes["Github"] = "github";
    OAuthProvidersTypes["Facebook"] = "facebook";
})(exports.OAuthProvidersTypes || (exports.OAuthProvidersTypes = {}));
exports.OneTapPositions = void 0;
(function (OneTapPositions) {
    OneTapPositions["embedded"] = "embedded";
    OneTapPositions["floating"] = "floating";
})(exports.OneTapPositions || (exports.OneTapPositions = {}));

var initStytch = function (publicToken) {
    if (!window.Stytch) {
        throw new Error('Stytch has not been loaded.');
    }
    return window.Stytch(publicToken);
};

function invariant(cond, message) {
    if (!cond)
        throw new Error(message);
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var noProviderError = function (hookOrHOC) { return "".concat(hookOrHOC, " can only be used inside <StytchProvider>."); };
var lazyError = function (hookOrHOC) {
    return "".concat(hookOrHOC, " can only be used if Stytch is preloaded. Add <script src=\"https://js.stytch.com/stytch.js\" /> in your document header to load the script synchronously, or use ").concat(hookOrHOC, "Lazy if you want to lazy load Stytch. If you are using SSR, you will need to use ").concat(hookOrHOC, "Lazy.");
};

var StytchMountedContext = React.createContext({
    isLazy: false,
    isMounted: false,
});
var StytchUserContext = React.createContext(null);
var StytchSessionContext = React.createContext(null);
var StytchContext = React.createContext(null);
var useIsMounted__INTERNAL = function () { return React.useContext(StytchMountedContext).isMounted; };
var useIsLazy__INTERNAL = function () { return React.useContext(StytchMountedContext).isLazy; };
var useStytchRaw__INTERNAL = function () { return React.useContext(StytchContext); };
var useStytchUser = function () {
    invariant(useIsMounted__INTERNAL(), noProviderError('useStytchUser'));
    return React.useContext(StytchUserContext);
};
var useStytchSession = function () {
    invariant(useIsMounted__INTERNAL(), noProviderError('useStytchSession'));
    return React.useContext(StytchSessionContext);
};
var useStytch = function () {
    invariant(useIsMounted__INTERNAL(), noProviderError('useStytch'));
    invariant(!useIsLazy__INTERNAL(), lazyError('useStytch'));
    return React.useContext(StytchContext);
};
var useStytchLazy = function () {
    invariant(useIsMounted__INTERNAL(), noProviderError('useStytchLazy'));
    return React.useContext(StytchContext);
};
var withStytch = function (Component) {
    var WithStytch = function (props) {
        invariant(useIsMounted__INTERNAL(), noProviderError('withStytch'));
        invariant(!useIsLazy__INTERNAL(), lazyError('withStytch'));
        return React__default["default"].createElement(Component, __assign({}, props, { stytch: useStytch() }));
    };
    WithStytch.displayName = "withStytch(".concat(Component.displayName || Component.name || 'Component', ")");
    return WithStytch;
};
var withStytchLazy = function (Component) {
    var WithStytchLazy = function (props) {
        invariant(useIsMounted__INTERNAL(), noProviderError('withStytchLazy'));
        return React__default["default"].createElement(Component, __assign({}, props, { stytch: useStytchLazy() }));
    };
    WithStytchLazy.displayName = "withStytchLazy(".concat(Component.displayName || Component.name || 'Component', ")");
    return WithStytchLazy;
};
var withStytchUser = function (Component) {
    var WithStytchUser = function (props) {
        invariant(useIsMounted__INTERNAL(), noProviderError('withStytchUser'));
        return React__default["default"].createElement(Component, __assign({}, props, { stytchUser: useStytchUser() }));
    };
    WithStytchUser.displayName = "withStytchUser(".concat(Component.displayName || Component.name || 'Component', ")");
    return WithStytchUser;
};
var withStytchSession = function (Component) {
    var WithStytchSession = function (props) {
        invariant(useIsMounted__INTERNAL(), noProviderError('withStytchSession'));
        return React__default["default"].createElement(Component, __assign({}, props, { stytchSession: useStytchSession() }));
    };
    WithStytchSession.displayName = "withStytchSession(".concat(Component.displayName || Component.name || 'Component', ")");
    return WithStytchSession;
};
var StytchProvider = function (_a) {
    var stytch = _a.stytch, children = _a.children;
    invariant(!useIsMounted__INTERNAL(), 'You cannot render a <StytchProvider> inside another <StytchProvider>.');
    var mountedContext = React.useState({
        isLazy: !stytch,
        isMounted: true,
    })[0];
    var _b = React.useState(stytch ? stytch.user.getSync() : null), user = _b[0], setUser = _b[1];
    var _c = React.useState(stytch ? stytch.session.getSync() : null), session = _c[0], setSession = _c[1];
    React.useEffect(function () {
        if (stytch) {
            if (mountedContext.isLazy) {
                setUser(stytch.user.getSync());
                setSession(stytch.session.getSync());
            }
            var unsubscribeUser_1 = stytch.user.onChange((user) => {
                console.log('setting user in react context', user);
                setUser(user);
            });
            var unsubscribeSession_1 = stytch.session.onChange((sess) => {
                console.log('setting sess in react context', sess);
                setSession(sess);
            });
            return function () {
                unsubscribeUser_1();
                unsubscribeSession_1();
            };
        }
    }, [mountedContext, stytch]);
    return (React__default["default"].createElement(StytchMountedContext.Provider, { value: mountedContext },
        React__default["default"].createElement(StytchContext.Provider, { value: stytch },
            React__default["default"].createElement(StytchUserContext.Provider, { value: session && user },
                React__default["default"].createElement(StytchSessionContext.Provider, { value: user && session }, children)))));
};

/**
 * Returns a unique element ID.
 * Client-side only - will return null for server-side
 * resolves: https://stytch.slack.com/archives/C015UDB4X33/p1641450131000800
 * based on: https://github.com/vercel/next.js/issues/7322#issuecomment-968858477
 */
var useUniqueElementId = function () {
    var _a = React.useState(null), elementId = _a[0], setElementId = _a[1];
    React.useEffect(function () {
        var randId = Math.floor(Math.random() * 1e6);
        setElementId("stytch-magic-link-".concat(randId));
    }, []);
    return elementId;
};
/**
 * Stytch JS React Component
 *
 * [Documentation](https://stytch.com/docs/javascript-sdk)
 */
var Stytch = function (_a) {
    var publicToken = _a.publicToken, style = _a.style, callbacks = _a.callbacks, loginOrSignupView = _a.loginOrSignupView;
    var stytchClientFromContext = useStytchRaw__INTERNAL();
    var stytchMounted = useIsMounted__INTERNAL();
    var _b = React.useState(function () {
        // If StytchProvider has been mounted, use context value
        if (stytchMounted) {
            return stytchClientFromContext;
        }
        // If StytchProvider isn't used, publicToken must be provided
        invariant(publicToken, 'The Stytch component must either be inside a <StytchProvider> or provided the publicToken prop.');
        // If Stytch has already been loaded, use global value
        if (typeof window !== undefined && window.Stytch) {
            return window.Stytch(publicToken);
        }
        // Otherwise, we will load Stytch
        return null;
    }), stytchClient = _b[0], setStytchClient = _b[1];
    var elementId = useUniqueElementId();
    React.useEffect(function () {
        if (!stytchClient) {
            if (!stytchMounted) {
                loadStytch().then(function (globalStytch) { return globalStytch && setStytchClient(globalStytch(publicToken)); });
            }
            else if (stytchClientFromContext) {
                setStytchClient(stytchClientFromContext);
            }
        }
    }, [stytchClient, stytchClientFromContext, stytchMounted, publicToken]);
    React.useEffect(function () {
        if (!stytchClient || !elementId) {
            return;
        }
        stytchClient.mount({
            callbacks: callbacks,
            elementId: "#".concat(elementId),
            loginOrSignupView: loginOrSignupView,
            style: style,
        });
    }, [elementId, stytchClient]);
    return elementId ? React__default["default"].createElement("div", { id: elementId }) : null;
};

exports.Stytch = Stytch;
exports.StytchProvider = StytchProvider;
exports.initStytch = initStytch;
exports.useStytch = useStytch;
exports.useStytchLazy = useStytchLazy;
exports.useStytchSession = useStytchSession;
exports.useStytchUser = useStytchUser;
exports.withStytch = withStytch;
exports.withStytchLazy = withStytchLazy;
exports.withStytchSession = withStytchSession;
exports.withStytchUser = withStytchUser;
//# sourceMappingURL=index.js.map
