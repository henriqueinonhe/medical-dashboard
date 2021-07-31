import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";

const body = document.querySelector("body")!;
const rootNode = document.createElement("div")!;
body.appendChild(rootNode);

ReactDOM.render(<App />, rootNode);