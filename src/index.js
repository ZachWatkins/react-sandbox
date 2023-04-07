import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

var mountNode = document.getElementById("app");
ReactDOM.createRoot(mountNode).render(<App name="World" />);
