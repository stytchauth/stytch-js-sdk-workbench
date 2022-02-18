import React, {useState, useRef} from "react";
import {useStytch} from "./stytch-react";

const buttonText = {
  starting: 'Send',
  in_progress: 'Sending...',
  done: 'Sent!'
}

const Login = () => {
  const emailRef = useRef();
  const [state, setState] = useState('starting');
  const [error, setError] = useState(null);
  const stytch = useStytch();

  const onSubmit = async (e) => {
    e.preventDefault();

    const prom = stytch.magicLinks.email.loginOrCreate(emailRef.current.value, {
      login_magic_link_url:
        `${window.location.origin}/authenticate?type=eml`,
      signup_magic_link_url:
        `${window.location.origin}/authenticate?type=eml`,
    });
    try {
      setState('in_progress')
      await prom;
      setState('done');
    } catch (e) {
      setError(e)
    }
  };

  return (
    <div className="container">
      <div className="column">
        <h1>Welcome!</h1>
        Thank you for taking the time to participate in the beta program.
        This app will show you some of the features of the Stytch platform, and how they might be incorperated into a
        login flow.
        All of the source code for this app is available <a href={"https://glitch.com/edit/#!/stytch-sdk-beta"}>here</a>.
        <br/>
        Let's start by logging in.
        <form onSubmit={onSubmit}>
          <div className="inputContainer" style={{'max-width': '50%'}}>
            <label htmlFor="email">What is your email?</label>
            <input disabled={state !== 'starting'} ref={emailRef} name="email" type="email"
                   placeholder={"grace.hopper@stytch.com"}/>
          </div>
          <button disabled={state !== 'starting'} type="submit">{buttonText[state]}</button>
        </form>
        {error && <><br/>
          <pre>{String(error)}</pre>
        </>}
      </div>
    </div>
  );
};

export default Login;
