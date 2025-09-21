import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useEffect, useReducer } from "react";

export default function Dashboard() {
  const router = useRuter();

  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      router.push("/login");
    }
  });

  useEffect(() => {}, [isTokenThere]);
  return <div>Dashboard</div>;
}
