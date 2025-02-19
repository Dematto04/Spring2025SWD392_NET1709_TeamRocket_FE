import { useRefreshTokenMutation } from "@/redux/api/authApi";
import { isUserAuth, logout } from "@/redux/features/authSlice";
import { jwtDecode } from "jwt-decode";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useNavigationType } from "react-router-dom";
//not check those paths
const NOT_CHECK_PATH = [
  "/login",
  "/register",
  "/register-housekeeper",
  "/confirm-email",
];
function RefreshToken() {
  const isAuth = useSelector(isUserAuth);
  const location = useLocation();
  const pathName = location.pathname;
  const dispatch = useDispatch();
  const [refreshTokenMutation] = useRefreshTokenMutation();
  const nav = useNavigate()
  useEffect(() => {
    if (NOT_CHECK_PATH.includes(pathName)) {
      return;
    }
    let interval = setInterval(async () => {
      const now = Math.floor(Date.now() / 1000);
      const accessToken = localStorage.getItem("accessToken") || null;
      const refreshToken = localStorage.getItem("refreshToken") || null;
      if (!accessToken || !refreshToken) {
        return;
      }
      const decodeAccessToken = jwtDecode(accessToken);
      const exp = decodeAccessToken.exp;
      console.log({ exp, now });

      if ((now <= exp && now >= exp - 60) || now >= exp) {
        const result = await refreshTokenMutation({
          token: accessToken,
          refreshToken,
        });
        if (result.error) {
          dispatch(logout());
          nav('/login')
          console.log(result.error);
          return;
        }
        console.log({ result });
        localStorage.setItem("accessToken", result.data.data.token);
        localStorage.setItem("refreshToken", result.data.data.refreshToken);
      }
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [pathName]);
  if (!isAuth) {
    return;
  }
  return null;
}

export default RefreshToken;
