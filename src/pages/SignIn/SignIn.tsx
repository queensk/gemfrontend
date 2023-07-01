// import { Link, useLocation, Navigate } from "react-router-dom";
import { NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Logo from "../../Components/NavBar/LOGO.svg";
import "./SignIn.css";
import api from "../../api/api";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../UseContext/UseAuth/UseAuth";
import Spinner from "../../Components/Spinner/Spinner";
import jwtDecode from "jwt-decode";

type DecodedToken = {
  iat: number;
  userEmail: string;
  userID: string;
  userName: string;
  exp: number;
};

const schema = yup.object().shape({
  usernameOrEmail: yup
    .string()
    .required("User name or email is required")
    .matches(
      /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$|^[a-zA-Z0-9_]+$/,
      "Invalid username or email"
    ),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});
export default function SignInForm() {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: any) => {
    const signInData = {
      userName: data.usernameOrEmail,
      password: data.password,
    };

    api
      .post("/auth/login", signInData)
      .then((res) => {
        const token = res.data.token.split(" ")[1];
        localStorage.setItem("token", token);
        const decodedToken = jwtDecode<DecodedToken>(token);
        console.log(decodedToken);
        dispatch({
          type: "LOGIN",
          payload: {
            user: {
              iat: decodedToken.iat,
              userEmail: decodedToken.userEmail,
              userID: decodedToken.userID,
              userName: decodedToken.userName,
              exp: decodedToken.exp,
            },
            token: token,
          },
        });
        console.log(state.token);

        navigate("/", { replace: true });
      })
      .catch((err) => {
        console.log(err);
      });

    setIsLoading(true);
  };

  useEffect(() => {
    let timeoutId: any;
    if (isLoading) {
      timeoutId = setTimeout(() => {
        setIsLoading(false);
        return navigate("/");
      }, 5000);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [isLoading]);

  return (
    <div className="SignIn-container">
      {isLoading ? (
        <div className="loader-container">
          <Spinner />
        </div>
      ) : (
        <div className="sign-in-form">
          <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="usernameOrEmail">Username or Email</label>
            <input
              id="usernameOrEmail"
              {...register("usernameOrEmail")}
              className="input"
            />
            {errors.usernameOrEmail && (
              <span className="input-error">
                {errors.usernameOrEmail.message}
              </span>
            )}
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className="input"
            />
            {errors.password && (
              <span className="input-error">{errors.password.message}</span>
            )}
            <button type="submit" className="button">
              Sign In
            </button>
          </form>
          <div className="right-SingUp-logo">
            <img src={Logo} alt="" />
            <p>
              Don't have an account?
              <NavLink to="/signup">Sign Up</NavLink>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
