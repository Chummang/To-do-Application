import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupThunk } from "../redux-toolkit/authSlice";
import { loginThunk } from "../redux-toolkit/authSlice";
import { useNavigate } from "react-router-dom";
import FacebookLogin from "react-facebook-login";
import { facebookLoginThunk } from "../redux-toolkit/authSlice";

export default function AuthForm(props) {
  const isAuthenticated = useSelector((store) => store.auth.isAuthenticated);

  const [credential, setCredential] = useState({
    username: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    isAuthenticated && navigate("/secret");
  }, [isAuthenticated, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredential((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };
  return (
    <div>
      <h1>{props.login}</h1>
      <input
        type="text"
        placeholder="username"
        name="username"
        onChange={handleChange}
      />
      <input
        type="password"
        placeholder="passowrd"
        name="password"
        onChange={handleChange}
      />
      <button
        onClick={() =>
          dispatch(
            props.login === "Signup"
              ? signupThunk(credential)
              : loginThunk(credential)
          ).then(() =>
            navigate(props.login === "Signup" ? "/login" : "/secret")
          )
        }
      >
        {props.login}
      </button>
      <FacebookLogin
        appId=""
        autoLoad={false}
        fields="name, email"
        callback={(userInfo) => {
          dispatch(facebookLoginThunk(userInfo));
        }}
      />
    </div>
  );
}
