import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Home() {
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios
      .get("http://localhost:8080")
      .then((res) => {
        if (res.data.Status === "Success") {
          setAuth(true);
          setName(res.data.name);
        } else {
          setAuth(false);
          setMessage(res.data.Error);
        }
      })
      .catch((err) => console.error("Error in API call:", err));
  }, []);

  const handleDelete = () => {
    axios
      .get("http://localhost:8080/logout")
      .then((res) => {
        location.reload(true);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container mt-5">
      {auth ? (
        <div className="card shadow p-4">
          <h3 className="mb-4">
            Welcome, <span className="text-primary">{name}</span>!
          </h3>
          <button className="btn btn-danger" onClick={handleDelete}>
            Logout
          </button>
        </div>
      ) : (
        <div className="text-center">
          <h3 className="text-danger">{message}</h3>
          <h4 className="mt-3">Please Login</h4>
          <Link to="/login" className="btn btn-primary mt-3">
            Login
          </Link>
        </div>
      )}
    </div>
  );
}

export default Home;
