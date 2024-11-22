import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleSubmit = (e) => {
    console.log(values);
    e.preventDefault();
    axios
      .post("http://localhost:8080/login", values)

      .then((res) => {
        console.log(res.data);
        if (res.data.Status === "Success") {
          alert("Successfully Logged In");
          navigate("/");
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.error("Error in API call:", err));
  };
  return (
    <div className="container mt-5">
      <div className="card mx-auto shadow" style={{ maxWidth: "400px" }}>
        <div className="card-body">
          <h3 className="text-center mb-4">Login</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter your email"
                onChange={(e) =>
                  setValues({ ...values, email: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter your password"
                onChange={(e) =>
                  setValues({ ...values, password: e.target.value })
                }
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>
          <p className="text-center mt-3">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="btn btn-outline-secondary btn-sm"
              style={{ textDecoration: "none" }}
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
