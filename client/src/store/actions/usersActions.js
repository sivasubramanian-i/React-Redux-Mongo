import * as actionTypes from "./actionTypes";
import jwt from "jsonwebtoken";
import { ENDPOINT_URL } from "./config";
const options = data => {
  return {
    headers: {
      "Content-Type": "application/json"
    },
    method: "post",
    body: JSON.stringify(data)
  };
};

export const checkUserUniqueness = ({ field, value }) => {
  return dispatch => {
    return fetch(
      ENDPOINT_URL + "api/customer/validate",
      options({ field, value })
    );
  };
};

export const userSignupRequest = userSignupDetails => {
  return dispatch => {
    return fetch(
      ENDPOINT_URL + "api/customer/signup",
      options(userSignupDetails)
    );
  };
};

export const userLoginRequest = userLoginDetails => {
  return dispatch => {
    return fetch(ENDPOINT_URL + "api/customer/login", options(userLoginDetails))
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          const token = res.token;
          delete res.token;
          localStorage.setItem("jwtToken", token);
          dispatch({
            type: actionTypes.LOGIN_SUCCESSFUL,
            authorizationToken: token,
            authenticatedUsername: jwt.decode(token).username
          });
        }
        return res;
      });
  };
};

export const userLogoutRequest = () => {
  return dispatch => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("MyArticles");
    dispatch({ type: actionTypes.LOGOUT_USER });
  };
};
