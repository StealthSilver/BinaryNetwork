import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "../config/redux/store";
import { getAllPosts } from "../config/redux/action/postAction/index";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const authState = useSelector((state: RootState) => state.auth);
  const [isTokenThere, setIsTokenThere] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      setIsTokenThere(true);
    }
  }, [navigate]);

  useEffect(() => {
    if (isTokenThere) {
      dispatch(getAllPosts());
    }
  }, [isTokenThere, dispatch]);

  if (!authState.user) {
    return <div>Loading user...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container">
        <div className="home-container"></div>

        <div className="feed-container"></div>

        <div className="extra-container"></div>
      </div>
    </div>
  );
}
