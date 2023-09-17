import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { apiRefreshToken, apiTest } from "../apis/users";
import Swal from "sweetalert2";
import { login, logout } from "../store/user/userSlice";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoggedIn } = useSelector((state) => state.user);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);

  const refreshToken = async () => {
    const rs = await apiRefreshToken();
    if (rs?.success) {
      console.log(rs);
      dispatch(
        login({
          isLoggedIn: true,
          token: rs.data.token,
          current: rs.data,
        })
      );
    } else {
      dispatch(logout());
    }
  };

  const handlerTest = async () => {
    if (!isRequesting) {
      setIsRequesting(true);
      const rs = await apiTest();
      if (rs?.success) {
        setMessage(rs.message);
        setIsRequesting(false);
      } else {
        refreshToken();
        setIsRequesting(false);
      }
    }
  };
  const handlerLogout = async () => {
    dispatch(logout());
    navigate("/login");
  };

  useEffect(() => {
    const setTimeoutId = setTimeout(() => {
      if (isLoggedIn) {
        refreshToken();
      }
    }, 1500);
    return () => {
      clearTimeout(setTimeoutId);
    };
  }, [isLoggedIn]);

  useEffect(() => {
    const setTimeoutId = setTimeout(() => {
      const data = JSON.parse(localStorage?.getItem("persist:user"));
      const user = JSON.parse(data?.current);
      setEmail(user?.email);
    }, 100);
    return () => {
      clearTimeout(setTimeoutId);
    };
  }, [message, email]);
  return (
    <div>
      {isLoggedIn ? (
        <div className="flex justify-center">
          <div>
            <div>Home</div>
            <div>{email}</div>
            <button
              className="px-4 py-2 rounded-md text-white bg-main font-semibold my-2 "
              onClick={handlerTest}
            >
              Gọi API Test
            </button>
            <div>{message}</div>
            <button
              className="px-4 py-2 rounded-md text-white bg-main font-semibold my-2 "
              onClick={handlerLogout}
              disabled={isRequesting}
            >
              Đăng xuất
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <Link
            to="/login"
            className="px-4 py-2 rounded-md text-white bg-main font-semibold my-2 "
          >
            Đăng nhập
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
