/// <reference types="react" />
import { CallbackOptions, LoginOrSignupView, StyleConfig, StytchClient } from "@stytch/stytch-js";
import React from "react";
import { ReactNode } from "react";
interface StytchProps {
    publicToken?: string;
    loginOrSignupView?: LoginOrSignupView;
    style?: StyleConfig;
    callbacks?: CallbackOptions;
}
/**
 * Stytch JS React Component
 *
 * [Documentation](https://stytch.com/docs/javascript-sdk)
 */
declare const Stytch: ({ publicToken, style, callbacks, loginOrSignupView }: StytchProps) => JSX.Element;
type User = {
    user_id: string;
};
type Session = {
    session_id: string;
    expires_at: string;
};
declare const useStytchUser: () => User | null;
declare const useStytchSession: () => Session | null;
declare const useStytch: () => StytchClient | null;
declare const withStytch: <T extends object>(Component: React.ComponentType<T & {
    stytch: StytchClient | null;
}>) => React.ComponentType<T>;
declare const withStytchUser: <T extends object>(Component: React.ComponentType<T & {
    stytchUser: User | null;
}>) => React.ComponentType<T>;
declare const withStytchSession: <T extends object>(Component: React.ComponentType<T & {
    stytchSession: Session | null;
}>) => React.ComponentType<T>;
type StytchProviderProps = {
    publicToken: string;
    children?: ReactNode;
};
declare const StytchProvider: ({ publicToken, children }: StytchProviderProps) => JSX.Element;
export { SDKProductTypes, OneTapPositions, OAuthProvidersTypes, StytchClient } from '@stytch/stytch-js';
export { Stytch, StytchProps, StytchProvider, useStytch, useStytchSession, useStytchUser, withStytch, withStytchSession, withStytchUser };
