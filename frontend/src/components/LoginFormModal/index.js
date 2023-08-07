import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async res => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const handleDemoUser = () => {
    setCredential("Demo-lition")
    setPassword ("password")
    return dispatch(sessionActions.login({credential, password}))
    .then(closeModal)
    .catch(async res => {
    const data = await res.json();
      if(data && data.errors) {
        setErrors(data.errors)
      }
    })
    }


  return (
    <div className="login-modal">
      <div className = "login-header">
      <h2>Log In</h2>
      </div>
      <form className = "login-form" onSubmit={handleSubmit}>
        <label>
          Username or Email
        </label>
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        <label>
          Password
        </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        {errors.credential && (
          <p className = "errors">{errors.credential}</p>
        )}
        {errors.message && <p className = "errors">{errors.message}</p>}
         <button className = "modal-submit" type="submit" disabled={password.length <6 ||credential.length <4}>Log In</button>
        <button className = 'demo-user' onClick={() => handleDemoUser()}>Log in as Demo User</button>
      </form>
    </div>
  );
}

export default LoginFormModal;
