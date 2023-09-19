import React, { useCallback, useEffect, useState } from "react";
import Button from "../components/Button";
import InputField from "../components/InputField";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { apiLogin, apiRegister } from "../apis/users";
import { useDispatch } from "react-redux";
import { login } from "../store/user/userSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isRequesting, setIsRequesting] = useState(false);
  const [payload, setPayload] = useState({
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
  });
  const resetPayload = () => {
    setPayload({
      email: "",
      fullName: "",
      password: "",
      confirmPassword: "",
    });
  };
  const [isRegister, setIsRegister] = useState(false);
  const handlerSubmit = useCallback(async () => {
    if (isRequesting) {
      return;
    }
    const { fullName, confirmPassword, ...data } = payload;
    setIsRequesting(true);
    if (isRegister) {
      if (payload.password !== payload.confirmPassword) {
        Swal.fire("Mật khẩu không trùng khớp", "Vui lòng nhập lại", "error");
        setIsRequesting(false);
      } else {
        const rs = await apiRegister(payload);
        if (rs.success) {
          Swal.fire("Chúc mừng", rs.message, "success");
          setIsRegister(false);
          resetPayload();
          setIsRequesting(false);
        } else {
          Swal.fire("Thất bại", rs.message, "error");
          setIsRequesting(false);
        }
      }
    } else {
      const rs = await apiLogin(data);
      if (rs?.success) {
        console.log(rs);
        dispatch(
          login({
            isLoggedIn: true,
            token: rs.data.token,
            current: rs.data,
          })
        );
        setIsRequesting(false);
        navigate("/");
      } else {
        Swal.fire("Thất bại", rs.message, " error");
        setIsRequesting(false);
      }
    }
  }, [payload, isRegister]);

  return (
    <div className="w-screen h-screen">
      <img
        src="https://img.freepik.com/premium-photo/pink-shopping-cart-with-pink-background-woman-pink-shirt-with-blue-shopping-cart_260559-491.jpg?w=1380"
        alt=""
        className="w-full h-full object-cover"
      />
      <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center ">
        <div className="p-8 bg-white rounded-md sm:w-[450px] w-[320px] flex flex-col items-center">
          <h1 className="text-[28px] font-semibold text-main mb-8">
            {isRegister ? "Đăng ký" : "Đăng nhập"}
          </h1>
          {isRegister && (
            <InputField
              value={payload.fullName}
              setValue={setPayload}
              name="Họ tên"
              nameKey="fullName"
            />
          )}
          <InputField
            value={payload.email}
            setValue={setPayload}
            name="Email"
            nameKey="email"
          />
          <InputField
            value={payload.password}
            setValue={setPayload}
            name="Mật khẩu"
            nameKey="password"
            type="password"
          />
          {isRegister && (
            <InputField
              value={payload.confirmPassword}
              setValue={setPayload}
              name="Nhập lại mật khẩu"
              nameKey="confirmPassword"
              type="password"
            />
          )}
          <Button fw handleOnClick={handlerSubmit} disable={isRequesting}>
            {isRegister ? "Đăng ký" : "Đăng nhập"}
          </Button>
          <div className="flex justify-between items-center w-full my-2 text-sm">
            {!isRegister ? (
              <>
                <span
                  className="text-blue-500 hover:underline cursor-pointer"
                  onClick={() => {
                    setIsRegister(true);
                    resetPayload();
                  }}
                >
                  Đăng ký{" "}
                </span>
                <span className="text-blue-500 hover:underline cursor-pointer">
                  Quên mật khẩu?
                </span>
              </>
            ) : (
              <>
                <span
                  className="text-blue-500 hover:underline cursor-pointer text-center w-full"
                  onClick={() => {
                    setIsRegister(false);
                    resetPayload();
                  }}
                >
                  Đăng nhập
                </span>
              </>
            )}
          </div>
          <Link
            className="text-blue-500 hover:underline cursor-pointer text-center w-full text-sm"
            to="/"
          >
            Trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
