import { render } from "inferno";
import Amino from "./components/Amino";

const container = document.getElementById("app");

document.addEventListener("dragover", (event) => event.preventDefault());
document.addEventListener("drop", (event) => event.preventDefault());

render(<Amino />, container);