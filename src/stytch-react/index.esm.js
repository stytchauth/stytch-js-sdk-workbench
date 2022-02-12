import React, { createContext, useContext, useState, useEffect } from 'react';

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
var SDKProductTypes;
(function (SDKProductTypes) {
    SDKProductTypes["emailMagicLinks"] = "emailMagicLinks";
    SDKProductTypes["oauth"] = "oauth";
})(SDKProductTypes || (SDKProductTypes = {}));
var OAuthProvidersTypes;
(function (OAuthProvidersTypes) {
    OAuthProvidersTypes["Google"] = "google";
    OAuthProvidersTypes["Microsoft"] = "microsoft";
    OAuthProvidersTypes["Apple"] = "apple";
    OAuthProvidersTypes["Github"] = "github";
    OAuthProvidersTypes["Facebook"] = "facebook";
})(OAuthProvidersTypes || (OAuthProvidersTypes = {}));
var OneTapPositions;
(function (OneTapPositions) {
    OneTapPositions["embedded"] = "embedded";
    OneTapPositions["floating"] = "floating";
})(OneTapPositions || (OneTapPositions = {}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

var StytchMountedContext = createContext(false);
var StytchUserContext = createContext(null);
var StytchSessionContext = createContext(null);
var StytchContext = createContext(null);
var useStytchMounted__INTERNAL = function () { return useContext(StytchMountedContext); };
var useStytchRaw__INTERNAL = function () { return useContext(StytchContext); };
var useStytchUser = function () {
    invariant(useStytchMounted__INTERNAL(), 'useStytchUser/withStytchUser can only be used inside <StytchProvider>.');
    return useContext(StytchUserContext);
};
var useStytchSession = function () {
    invariant(useStytchMounted__INTERNAL(), 'useStytchSession/withStytchSession can only be used inside <StytchProvider>.');
    return useContext(StytchSessionContext);
};
var useStytch = function () {
    invariant(useStytchMounted__INTERNAL(), 'useStytch/withStytch can only be used inside <StytchProvider>.');
    return useContext(StytchContext);
};
var withStytch = function (Component) {
    var WithStytch = function (props) {
        return React.createElement(Component, __assign({}, props, { stytch: useStytch() }));
    };
    WithStytch.displayName = "withStytch(".concat(Component.displayName || Component.name || 'Component', ")");
    return WithStytch;
};
var withStytchUser = function (Component) {
    var WithStytchUser = function (props) {
        return React.createElement(Component, __assign({}, props, { stytchUser: useStytchUser() }));
    };
    WithStytchUser.displayName = "withStytchUser(".concat(Component.displayName || Component.name || 'Component', ")");
    return WithStytchUser;
};
var withStytchSession = function (Component) {
    var WithStytchSession = function (props) {
        return React.createElement(Component, __assign({}, props, { stytchSession: useStytchSession() }));
    };
    WithStytchSession.displayName = "withStytchSession(".concat(Component.displayName || Component.name || 'Component', ")");
    return WithStytchSession;
};
var LOCAL_STORAGE_KEY_PREFIX = 'stytch_state_';
var getLocalStorageKey = function (type, publicToken) {
    return "".concat(LOCAL_STORAGE_KEY_PREFIX).concat(publicToken, "_").concat(type);
};
var getLocalStorageSession = function (publicToken) {
    if (typeof localStorage === 'undefined')
        return null;
    var sessionString = localStorage.getItem(getLocalStorageKey('session', publicToken));
    var session = JSON.parse(sessionString);
    if (session && Date.parse(session.expires_at) > Date.now()) {
        return session;
    }
    return null;
};
var getLocalStorageUser = function (publicToken) {
    if (typeof localStorage === 'undefined')
        return null;
    if (getLocalStorageSession(publicToken)) {
        var userString = localStorage.getItem(getLocalStorageKey('user', publicToken));
        return userString ? JSON.parse(userString) : null;
    }
    return null;
};
var StytchProvider = function (_a) {
    var publicToken = _a.publicToken, children = _a.children;
    invariant(!useStytchMounted__INTERNAL(), 'You cannot render a <StytchProvider> inside another <StytchProvider>.');
    invariant(publicToken, 'publicToken not provided to <StytchProvider>.');
    var _b = useState(typeof window !== 'undefined' && window.Stytch ? window.Stytch(publicToken) : null), stytchClient = _b[0], setStytchClient = _b[1];
    var _c = useState(stytchClient ? stytchClient.user.getSync() : getLocalStorageUser(publicToken)), user = _c[0], setUser = _c[1];
    var _d = useState(stytchClient ? stytchClient.session.getSync() : getLocalStorageSession(publicToken)), session = _d[0], setSession = _d[1];
    useEffect(function () {
        if (!stytchClient) {
            loadStytch().then(function (globalStytch) { return globalStytch && setStytchClient(globalStytch(publicToken)); });
        }
    }, [stytchClient, publicToken]);
    useEffect(function () {
        if (stytchClient) {
            stytchClient.user.onChange(setUser);
            stytchClient.session.onChange(setSession);
        }
    }, [stytchClient]);
    return (React.createElement(StytchMountedContext.Provider, { value: true },
        React.createElement(StytchContext.Provider, { value: stytchClient },
            React.createElement(StytchUserContext.Provider, { value: user },
                React.createElement(StytchSessionContext.Provider, { value: session }, children)))));
};

/**
 * Returns a unique element ID.
 * Client-side only - will return null for server-side
 * resolves: https://stytch.slack.com/archives/C015UDB4X33/p1641450131000800
 * based on: https://github.com/vercel/next.js/issues/7322#issuecomment-968858477
 */
var useUniqueElementId = function () {
    var _a = useState(null), elementId = _a[0], setElementId = _a[1];
    useEffect(function () {
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
    var stytchMounted = useStytchMounted__INTERNAL();
    var _b = useState(function () {
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
    useEffect(function () {
        if (!stytchClient) {
            if (!stytchMounted) {
                loadStytch().then(function (globalStytch) { return globalStytch && setStytchClient(globalStytch(publicToken)); });
            }
            else if (stytchClientFromContext) {
                setStytchClient(stytchClientFromContext);
            }
        }
    }, [stytchClient, stytchClientFromContext, stytchMounted, publicToken]);
    useEffect(function () {
        if (!stytchClient || !elementId) {
            return;
        }
        stytchClient.mount({
            callbacks: callbacks,
            elementId: "#".concat(elementId),
            loginOrSignupView: loginOrSignupView,
            style: style,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [elementId, stytchClient]);
    return elementId ? React.createElement("div", { id: elementId }) : null;
};

export { OAuthProvidersTypes, OneTapPositions, SDKProductTypes, Stytch, StytchProvider, useStytch, useStytchSession, useStytchUser, withStytch, withStytchSession, withStytchUser };
//# sourceMappingURL=index.esm.js.map
