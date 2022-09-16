import { useStytch, useStytchUser } from "@stytch/react";
import { Link } from "react-router-dom";
import React from "react";

export const LinkOAuth = () => {
  const stytch = useStytch();
  const { user } = useStytchUser();

  const oauthOpts = {
    login_redirect_url: `${window.location.origin}/authenticate?type=oauth`,
    signup_redirect_url: `${window.location.origin}/authenticate?type=oauth`,
  };

  const googleUrl = stytch.oauth.google.getUrl(oauthOpts);
  const facebookUrl = stytch.oauth.facebook.getUrl(oauthOpts);
  const githubUrl = stytch.oauth.github.getUrl(oauthOpts);

  const googleProvider = user.providers.find(
    (provider) => provider.provider_type === "Google"
  );
  const fbProvider = user.providers.find(
    (provider) => provider.provider_type === "Facebook"
  );
  const githubProvider = user.providers.find(
    (provider) => provider.provider_type === "Github"
  );

  const renderProvider = (title, provider, url) => {
    if (provider) {
      return (
        <>
          You've previously linked {title}. Your {title} ID is{" "}
          <code>{provider.provider_subject}</code>.{" "}
          <a href={url}>Log in again?</a>
        </>
      );
    }
    return (
      <a href={url}>
        <button>Link your {title} account.</button>
      </a>
    );
  };

  return (
    <div className="container">
      <div className="column">
        <h1>OAuth</h1>
        OAuth is a popular authentication framework that delegates
        authentication to an external identity provider (often shortened to IdP)
        like Google, Facebook, or, Github. A user relies on their membership
        from that provider to sign in instead of creating another password, and
        developers can enrich their users' experiences with the information
        shared by the providers. Stytch's OAuth product simplifies the process
        by abstracting the implementation details of OAuth for developers.
        Here's a little demo showing how Stytch can be used to attach OAuth
        providers to existing users. See more in our{" "}
        <a href={"https://stytch.com/docs/api/oauth-overview"}>docs.</a>
        <br />
        <br />
        {renderProvider("Google", googleProvider, googleUrl)}
        <br />
        {renderProvider("Facebook", fbProvider, facebookUrl)}
        <br />
        {renderProvider("Github", githubProvider, githubUrl)}
        <br />
        <br />
        <Link to={"/home"}>{"<-Back"}</Link>
      </div>
    </div>
  );
};
