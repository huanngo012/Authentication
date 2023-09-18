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
      console.log(rs.data.token);
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
      // Gọi refresh token để lấy access token mới
      const refreshResponse = await apiRefreshToken();

      if (refreshResponse?.success) {
        // Lưu access token mới và thông tin user vào Redux
        dispatch(
          login({
            isLoggedIn: true,
            token: refreshResponse.data.token, // Cập nhật token mới vào Redux
            current: refreshResponse.data,
          })
        );

        // Chờ cho đến khi Redux đã cập nhật token mới (sử dụng await)
        await new Promise((resolve) => setTimeout(resolve, 100)); // Chờ 100ms (hoặc thời gian phù hợp)

        // Gọi API Test sau khi refresh thành công
        const testResponse = await apiTest();

        if (testResponse?.success) {
          setMessage(testResponse.message);
          setIsRequesting(false);
        } else {
          // Xử lý lỗi khi gọi API Test sau khi refresh
          // ...
        }
      } else {
        // Xử lý lỗi khi refresh token không thành công
        dispatch(logout());
        setIsRequesting(false);
      }
    } catch (error) {
      // Xử lý lỗi xảy ra trong quá trình gọi API
      console.error(error);
      setIsRequesting(false);
    }
  };

  const handlerTest = async () => {
    if (!isRequesting) {
      setIsRequesting(true);
      const testResponse = await apiTest();

      if (testResponse?.success) {
        setMessage(testResponse.message);
        setIsRequesting(false);
      } else if (!testResponse?.success) {
        // Nếu nhận được mã lỗi 401 (Unauthorized), gọi handlerTestAfterRefresh
        handlerTestAfterRefresh();
      } else {
        // Xử lý lỗi khi gọi API Test
        // ...
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
