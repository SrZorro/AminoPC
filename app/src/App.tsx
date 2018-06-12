import { render, version, Component } from "inferno";
import Amino from "./components/Amino";

const container = document.getElementById("app");

render(<Amino />, container);