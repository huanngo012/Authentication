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

  const handlerTestAfterRefresh = async () => {
    try {
      const refreshResponse = await apiRefreshToken();

      if (refreshResponse?.success) {
        dispatch(
          login({
            isLoggedIn: true,
            token: refreshResponse.data.token,
            current: refreshResponse.data,
          })
        );
        await new Promise((resolve) => setTimeout(resolve, 100));

        const testResponse = await apiTest();

        if (testResponse?.success) {
          setMessage(testResponse.message);
          setIsRequesting(false);
        } else {
          // Xử lý lỗi khi gọi API Test sau khi refresh
          // ...
        }
      } else {
        dispatch(logout());
        setIsRequesting(false);
      }
    } catch (error) {
      console.error(error);
      dispatch(logout());
      setIsRequesting(false);
    }
  };

  const handlerTest = async () => {
    if (!isRequesting) {
      setMessage("");
      setIsRequesting(true);
      const testResponse = await apiTest();

      if (testResponse?.success) {
        setMessage(testResponse.message);
        setIsRequesting(false);
      } else if (!testResponse?.success) {
        handlerTestAfterRefresh();
      } else {
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
