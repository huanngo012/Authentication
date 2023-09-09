import axios from "../axios";
export const apiRegister = (data) =>
  axios({
    url: "/auth/register",
    method: "post",
    data,
  });

export const apiLogin = (data) =>
  axios({
    url: "/auth/login",
    method: "post",
    data,
  });
export const apiRefreshToken = () =>
  axios({
    url: "/auth/refresh-token",
    method: "post",
  });
export const apiTest = () =>
  axios({
    url: "/test",
    method: "post",
  });
