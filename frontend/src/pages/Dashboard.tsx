import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "../config/redux/store";
import { getAllPosts } from "../config/redux/action/postAction/index";

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const authState = useSelector((state: RootState) => state.auth);
  const [isTokenThere, setIsTokenThere] = useState(false);

  // Check if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      setIsTokenThere(true);
    }
  }, [navigate]);

  // Fetch posts if token is there
  useEffect(() => {
    if (isTokenThere) {
      dispatch(getAllPosts());
    }
  }, [isTokenThere, dispatch]);

  if (!authState.user) {
    return <div>Loading user...</div>;
  }

  return (
    <div>
      <h1>Hey {authState.user.name} 👋</h1>
      <p>Welcome back!</p>
    </div>
  );
}
