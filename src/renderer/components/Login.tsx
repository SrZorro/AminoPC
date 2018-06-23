import { Component } from "inferno";
import { style } from "typestyle";
import AminoClient from "aminoclient";
const version = eval(`require("./package.json").version`);

const main = style({
    padding: "15%",
    boxSizing: "border-box",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    backgroundColor: "#171814",
    $nest: {
        "> *": {
            marginTop: 10,
            marginBottom: 20
        }
    }
});

const classLogo = style({
    width: "100%"
});

const classHeader = style({
    color: "white"
});

const classInputContainer = style({
    $debugName: "classInputContainer",
    position: "relative",
    width: "100%",
    $nest: {
        "input:focus": {
            $nest: {
                "~ span": {
                    top: 0,
                    left: 10,
                    fontSize: ".9em",
                    opacity: 1,
                    color: "#91E12C"
                }
            }
        },
        "input:not(:focus):valid": {
            $nest: {
                "~ span": {
                    top: 0,
                    left: 10,
                    fontSize: ".9em",
                    opacity: 1,
                    color: "#CFCFCE"
                }
            }
        }
    }
});
const classInput = style({
    backgroundColor: "transparent",
    width: "100%",
    border: "none",
    outline: "none",
    height: 30,
    borderBottom: "1px solid white",
    color: "white",
    fontSize: "1.2em",
    paddingBottom: 10,
    $nest: {
        "&:focus": {
            borderColor: "#5DC452"
            // borderWidth: "medium medium 2px"
        }
    }
});
const classInputFloatingLabel = style({
    position: "absolute",
    pointerEvents: "none",
    top: 18,
    left: 10,
    fontSize: "1.2em",
    transition: "0.2s ease all",
    color: "white"
});


const classButton = style({
    border: "none",
    outline: "none",
    boxSizing: "border-box",
    padding: 15,
    width: "100%",
    borderRadius: 5,
    fontSize: "1.8em",
    backgroundColor: "#5DC452",
    color: "white",
    transition: "0.2s ease all",
    cursor: "pointer",
    $nest: {
        "&:hover": {
            boxShadow: "0px 0px 6px 1px rgba(255, 255, 255, 0.3)",
            backgroundColor: "hsla(114, 49%, 66%, 1)"
        }
    }
});

const classDeviceIDContainer = style({
    width: "100%",
    display: "grid",
    gridTemplateColumns: "calc(100% - 40px) 40px"
});
const classDeviceIDHelp = style({
    backgroundColor: "#5DC452",
    outline: "none",
    border: "none",
    borderRadius: "50%",
    color: "white",
    marginTop: "auto",
    height: 40,
    cursor: "pointer",
    transition: "0.2s ease all",
    fontSize: "1em",
    $nest: {
        "&:hover": {
            fontSize: "1.5em",
            boxShadow: "0px 0px 6px 1px rgba(255, 255, 255, 0.3)",
            transform: "rotateZ(360deg)"
        }
    }
});
const classErrorMessage = style({
    color: "#ff4747",
    fontWeight: "bold",
    fontSize: "1.3em"
});

export default class Amino extends Component<any, any> {
    private defaultPassword: string;
    private defaultEmail: string;
    private defaultDeviceID: string;
    constructor(props, context) {
        super(props, context);
        this.state = { scene: "login", errMsg: "", saveCredentials: localStorage.getItem("deviceID") ? true : false };
        console.log(localStorage.getItem("password") || "");
        this.defaultPassword = localStorage.getItem("password") || "";
        this.defaultEmail = localStorage.getItem("email") || "";
        this.defaultDeviceID = localStorage.getItem("deviceID") || "";
    }

    public changeScene(scene, args) {
        this.setState({ scene, ...args });
    }

    private async tryLogin() {
        const email: string = (document.getElementsByClassName(classInput)[0] as HTMLInputElement).value;
        const password: string = (document.getElementsByClassName(classInput)[1] as HTMLInputElement).value;
        const deviceID: string = (document.getElementsByClassName(classInput)[2] as HTMLInputElement).value;

        try {
            const response = await AminoClient.login(email, password, deviceID);
            if (this.state.saveCredentials) {
                console.log("Saving...");
                localStorage.setItem("password", password);
                localStorage.setItem("email", email);
                localStorage.setItem("deviceID", deviceID);
            } else {
                localStorage.removeItem("password");
                localStorage.removeItem("email");
                localStorage.removeItem("deviceID");
            }
            this.props.onLogged();
        } catch (e) {
            this.setState({ scene: "error", errMsg: e.name === 218 ? "Wrong DeviceID, click the ? to know how to get a valid DeviceID" : e.message });
        }
    }

    public render() {
        const logo = <img class={classLogo} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA1UAAADwCAYAAADoxk4GAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMjHxIGmVAAAw0UlEQVR4Xu2d0XXcOrJFJ+n5dwYO4YagEPw3vw7BITiE985pV/tSEFtqNgACBe691lkz15KAU0USQJFs9H8AAABgPv77v//e9V36If3fk/olvUm3vwcAALgM98lP+iZ58rzrPklu/82/w2QJALAY97FdclG0LZRq5CLLhVn0AgAAsBCe4EI/pb2J8Bn9lv6RolUAAMiGx3DJN8w8pu+N9a3kG3PRKwAAQGI8oUk9Jk8mSwCAZGjcPqOYKsV8AQAAefEkJvlVjL1JrpWYLAEAJsfjtNR7PvhK38IOAABADjR5+TW9vUmth3zXM3oGAICZ8Pi8Ga9Hy6+ghzMAAIBJ8WQVk9beZNZb4QIAAGZA4/KZN9ieFTfiAABgXjxJSaMKqrvCDQAAjETj8YwF1V0UVgAAMB+enKTRBdVd4QoAAEagcXjmguouCisAAJgLTUyzFFR3hTMAADgTjb/+nqi9cXlGUVgBAMAcaEKacQJlogQAOBmPu5txOIt+hn0AAIAxaDKaeQJ9C5sAANAZjbmWb2jtjcezi+3WAQBgDJqEMkyg4RYAAHqi8TbD56g+U0QCAABwIpqAMrw3/yvsAgBAJzTWWntjcCb9iHAAAADOQZNPpgmU1zoAADqicfZHMe5mVUQEAABwApp4Mk2gbFoBANAJj6+b8Ta7+CwuAACcgyadjBMoT6sAADqg8TX7Z6lKRWQAAAAd0YST8TUPnlYBAHQgxte9cTerIjIAAIBOeLIpJp9M4mkVAEBDNK5mnhMeie+tAgCAvmiyeSsmn0z6HWEAAEADNK5m2AX2FUWEAAAAjfEkU0w6GRXRAABALRpTV9n1r1RECAAA0BhNMt+KSSejeK0DAKARO2PsKuJ1cQAA6IMmmV/FpJNVEREAALyKx9JibF1JbK0OAADt0QSz0uTJZAkAUInG0pWLqh8RJgAAQDs8wRQTTnZFZAAA8AoeR4txdSVRVAEAQFs0uaw4cX6P8AAA4AU0jq5cVLFbLAAAtEWTy4pb5vJlwAAAFXgM3YypyynCBAAAaIMml9W+Lf+uiBAAAI7iMbQYU1cSO8UCAEA7NLGsPGn+ijABAOAgGkNXnh/4TBUAALTDE0sx0aymiBQAAI7g8bMYT1cSRRUAALRBk8rKE+ZdTJwAAC+yM6auIjYzAgCANnhSKSaZVRURAwDAETR+rvKl8KUiQgAAgEo0qay6QUWpfyJkAAA4gMbPt2I8XUURIQAAQAWeUIoJZmWxvToAwAt47NyMpcsowgMAAKhDk8rqG1SUisgBAOBZPHYWY+kKeovwAAAAXkcTypJ3Hr8Q26sDALyAxs+fxXiaXREZAABABZpQrrJBRanIAAAAPIvHzmIszSxeBwcAgDbEpLI32awutlcHADiIxs6V5g02LgIAgHo0oax0x/EVRSYAAOBZNHZ+K8bSrIqIAAAAKtCEcrUNKkpxlxIA4CAaO63sT6v4wl8AAKhHE4q1N9FcTZERAAB4Fo+dxViaSXyWCgAA2qAJ5aobVJT6FikBAIADaPzM+rZDRAAAAFCJJpWrblBRiu3VAQBeQONnxrmE174BAKANmlSsvcnmqorMAADAETx+FuPpzPoZtgEAAOrRxPJWTDRXF9urAwC8iMbQDIWVv7Q4HAMAAFTiSWUzyaB/FRkCAICjeAwtxtSZREEFAABt0cSyyveLtBbv2QMAVKBx1JrtM1beTCMcAgAANEKTy6/NZIPeK7IEAACv4HFUmmVXQHZ3BQCA9miCsfYmHvRHTMAAAA3weCqNemrF634AANAPTTJsUPG52F4dAKARGlOtfzZjbG/5TYzoHQAAoAOeaDYTD3qsyBgAALTA46rkL5zv9eSKJ1MAAHAOmnDYoOI5sb06AEAnNMZafnpV+/ne2wYUFgAAwGlo4mGDiucVWQMAgF54rA35pp+fZLlQ2pNfXffvUEQBAMA4YiLaKx7QvtheHQAAAAAA/kVFAhtUHJPf+4/sAQAAAADApXFxsCkW0POKDAIAAAAAwKVRccAGFa+J7dUBAAAAAOBWVLFBxeuKLAIAAAAAwCVxUVAUCeiY2F4dAAAAAODKqCg485vsV1VkEwAAAAAALoWLgaI4QK+J7dUBAAAAAK6IigGKqjZie3UAAAAAgCuiQoANKtopsgoAAAAAAJfARUBRFKA6sb06AAAAAMCVUBHABhXtFdkFAAAAAICl8eK/KAZQG71FigEAAAAAYGW0+Keo6qfIMgAAAAAALIsW/j+LQgC107dIMwAAAAAArIgW/Tyl6qvfkWoAAAAAAFgRLfrZoKK/ItsAAAAAALAUXuxL/qLavUIAtdOPSDkAAAAAAKyEFvu8+neeIusAAAAAALAMWuizQcV5+ifSDgAAAAAAK6BFPk+pzpVfs4zsAwAAAABAerTAZ4OK8xXZBwAAAACA1HhxL7FBxfn6FYcAAAAAAAAyo8U9r/6NUxwFAAAAAABIixb2P4qFPjpPb3EYAAAAAAAgI1rU85RqvOJoAAAAAABAOrSg/14s8NH5+haHA6AKnUtbfXtC7/4GPlLkaJs7P+Hf05v0Ib8AMIbtdShtr2Fv0LV3DVv+Gdcx3NieA9L2HPJ4v3f+3LX93XftwILowLJBxXixYQUcQufMXR6oPXD/kvbOrVfk9ryguNzAf4854u/xvX1u05Pw5XILcAb3a0u6F0x712GtfB1fcoxcnfsxlXrMrXu6zwl/iy5IShzAvYOMzlccFYCP+PwIeSLvPciX8o2XJQuBiOk+ee7F3lvL5hbgDOLaGXkNW1zHSbkfszh+Z8+tj8T5lBEdrJGDEHqvH3FYAG7onLirxxOTGt0G+6zYuzSiOH1Gt7vfAPAYXyNxrcz6pk3qMXJ1fGwkf/RlxjlgTz7PeTI6M3Fw9g4eGqc4OtAC57NUBsKrB9C9c2QmeaC/vbIwO/YYXrNMovYZ7sG5OFOrsRfjV5qN8DVzIbUnX8cpxsjV8TGIY5FlDvhMPMWaDR0MNqiYT9/j8MAXKFfbQdLyU1fr2Ql3us+2hJfZnko9o2mLK3uSfJz3fGfQZYsrxy2NPHapnzbYu1RbhAwfI6P/7G/VpLkBtRrOubTqW1k+r25PsGAwOggrVOur6XccHgiUk7s8IXmC71V0DLuj6D6j/z1fmXRbOERYQ5EPa6WJ9DLFleOUZrq5YC/hbn7sVWpdjJ5eFLgvabV1yjRj5OoozyueP5/J811ED6fixG8OBJpLcZSuh2MP3QuoUQPiKXd+3Ie04qA/bBHqfqP/PV8rKPXTk69wbJIXnnuxj5Q9hct5sUep5/nfPQ9uX1p9Mez4ImJoifMqzTiGnCXOrbNRwlvfxTpbPmn8+qIX31aGz588q59xmJZHsd7lYznbQrjb4sHtStmvwWd02h1Z9WWt+opHqRQL/KM4pohtL+YZNH3e5e+sayB6bIfblFa+IbInz32RAajBeZRWL8aPiOLqDJzkTdIzKiJ5j/9dWmVAjqjWwnGFXARnGfz+CftNUHvWle6i+ZqM6NvjtqWrfj50qdeIFE+Gm2NNx4OWyJu157mXouc63I50hZtMj8TitwLnTrrKDbVXxGuBPVFy/WRnL/EZFFHs459LKxRW007cR1Acd2UqovZU/Tqg/1662l3Yu7rc4Xeb0tXvTFafmzPgGDYxza5wPRfyNeJaiN5fw38vXekm0yNN/xR0NpwviQ3XnhdPRXugpGZdhEQEn+Pfk7IvtNIOsPYtzfg6X61eLnT1txYLh0bntNuRMjzVOEtdnwaegfxnOp7heh7sqfB4ll6aq/w30pWfTj0SOwA/gfJkXf2G2iuieG+Jk7lJbiYd+pyRfj9rnFtFNHNjnyFPkKsXDocKK/3+PS97bV1VkZ3X8N9LTKYflbqwkvdMx3S6L2qXp5FF6SvzMzeZHmuJN1V6ofxkfttqFi3xhsNwIpF7CZ5dEcHz6G+yv2M77YYV8nYf2K74Oltk4XP8exKL/31Flo7hvyvaQe+VsrCy500MGTTdV1/YU+HxbIWTz/HvFX+H9kVhVaCcWHx2qp28PonswmGcvE0yM+mlu4L6u6zxbhXRjMdeJL/Wd/VC4cvH5/55/N7e36M/imx9jX9X4nW/5zTdU5SvkGdrL5aZFe7HYy+FtxF6ZlzkGj4mCqtAubCYU/sosgyHcOKKRGZRRHAc/W32uxpDB1X1b3kiZDB7r4cLV/2MD84+r8jaY/w70hWfiNYo1WJMfjO+zhPux2MvhbdR2v08kP6da/h1Xb6wUg5mOb9XFgX8UZS0jE8YfoX9l9DfZ78Yv7z71xr3J1FIfa3I2B/83xKfnzqmT89v/yx+Z+9v0eeKLM6PvFJUVWAvhbeRCld/8H9LFFR1imxeD8de5AL1E1uvP4sTtUlcJkUEr6M2sr+uFpH0w31IFFLH9Lcg8P9KLBxe0+7ngPxvEudjnSKbcyOfFFUV2EvhbaT+3vHW/+cabqfI6nVQzLwuer5252MoUJKynpwRweu4jaLNbOqyYYXavZ8XTHqvy4tB55ENKer07tUD/Xf2a3YWTbvZzRb5pKiqwF4Kb6N198Tc0k5/b+JdAcVKQTVOFFaf4eRskpVJbxFCFWpnhcE9oqnD7Uj+zA+TXRs5j+Syjbbn6N7P0Wv6dkvsxNhj4TmDwv147KXwNlpelDEutleTNdHsKE4KqvGisHqEE7NJVCZFBPWorewX6csfItTf3sXTFDSzvAjLOlbNrhgN5kT+KKoqsJfCG1pXcdTXRPFRUM0jCqs9IjF7CZtZVRtUlKi97JPObcH5LP7dEN/pgBCaept1+aOoqsBeCm9oXR1aC2TCcW3iRHOIwmqLk7FJTiY1f2VFbWYsLreKSB7j35H4nBRCqFSMEvMhbxRVFdhL4Q2treW2v1ZMnMPzKt13H3ZDycj6KDUiaIfbLPrIpt0TW/9+V/aiESHUT02f/rdE3iiqKrCXwhtaX3H08+NYitjQfOJ7rJQEK+MTiy5Vsdpd4cKNaP7Gw/vHCKFnFaPHXMgXRVUF9lJ4Q+triacHisPizZociqN2UZyAIiFZFBG0R21n/3JW79znOHgqhRA6qim3WJcviqoK7KXwhq6hOAPyohj43HcuxZG7IAo+48L7d9jvgtpn8kEIXVkxGs6DPFFUVWAvhTd0DaV+WiX/Ga/7q8u7SMcRvBAOepOETOr+3qb64FEzQuiqmu7deHmiqKrAXgpv6DqKsyAX9l3EgfLoEt+X9g4F7dfE9pIxuyKCfqiPrLlBCKEWitFwDuSHoqoCeym8oeso3QYC8mzxvZm5FUfzIijgjE9jTnnfX/0wASGErqwYDedAfiiqKrCXwhu6luJMyIH8cmM7v1xjxBFdHAe6CTyTIoL+qC/ukiCErqqpNqyQH4qqCuyl8IaupTgT5sdeC+8or67xGqACzbqbSkTQH/dV9I0QQldSjIbjkReKqgrspfCGrqUpd/XcQ165ob2W4sguigMsAs6iU98LVn9MQgihKytGw/HIC0VVBfZSeEPXU5wN8yKPGa9z9LnW3g1QwbFBxZOoT77rCSF0VU3z6oa8UFRVYC+FN3Q9xdkwJ/YnsfPymvoWh3k9FFzGR6u/wv6pqF8mIoTQZRVD4XDkhaKqAnspvKHraerPt8jfP4VftI7W3LTCQW2CzKQhVa76ZSJCCF1ZMRqORT4oqiqwl8IbuqDidJgOeeP8XF/f43Cvg4J6K4LMoojgfNR31pwhhFCtpnhtwz4KXxkU7sdjL4U3dE3FGTEX8sVTqmsojvgCOJgiuCwa+sha/TMZIYSuqileGZIPiqoK7KXwhq6p6T7bIk+cm9dRui+ifoiCyTgpWRHBGNy/xIcnEUJX1JDPs5bIB0VVBfZSeEPX1I84JaZBnnhKdS3FkU+OAsm4QcXvsD8U+eCiRwhdVTESjkMeKKoqsJfCG7qmplhT3ZEfzsvrKf9OgAoi64k7xaNC+eDCRwhdVTESjkMeKKoqsJfCG7qu4qwYj7xkfYMKva6pCvuXUBBZn7REBOORF14BRAhdUTEKjkMeKKoqsJfCG7qu4qwYj7xcaV3lWH+E/H2x1v2/M75JVqM4AxJi80UwWfQzQpgC+cn6pckIIVSj4a9r2EPhKYPC/XjspfCGrqtZdvS8wjnp3aNvsX7F/fckrzVXLzanWt8fQuatvaBmV0QwB/ZT+ENoBv2UPAjfz9E4Y98N0pYXpb4jttcG+ldH8ukJ8wp3WofvACgPFFUV2Evh7QryeOfz5h5/ZOPyY+MU3xckH6vm3HPCbQ6pwX8veT7a62MFRaTJkPGsjxUjgvHYi8SCFM0iX9O38/Io97+TOJ//lfN5W3y9gv9OWjmfw3cMkweKqgrspfC2qnwdRtTH8N+FVh8bZ7ieVz0fb0+mWuL2pBVv3uX7MmCZznrizrRBBYtPNIs8sMbZWY/bkq72LvdWPfK54p3F4duqywNFVQX2UnhbTU0Xs25LWvUpAUVVezWdS0rctrTaWnSKr+s4hEyzQcULuH+JbdTRTGp+B8y4TemK5/rLd7S/Qu0u9/nLCG0Y8kBRVYG9FN5WUe/FbMbz7ktFeMOQh5Vu5nU9B7eon9Xm6ogsATYr+WDvBTKzhlWv6ttachBFqRVnaD/cR9Hnyur+JFx9LJXPCGsY8kBRVYG9FN5WkJ8kRYT9cB9SxrXUQ0VoQ1D/K52LpxVUd9zfpv/smuKttKeQ2ayJH7Izjfq1lho40RKKM7Q/6usKNxROG8TVV9Yx+IMipGHIA0VVBfZSeMuuUxdj6s9aZn0QYQ1B/a8yz5xeUN1Rv6s8scrzCqDMZn0fOCI4B/cnrbzDCsqr0z/IqT79muGelxV0+l0x9bnKq4AR0RjUP0VVBfZSeMusIZ8JUr8r5TCiOh/1vcp6KyIag/pfZa6OiCbGJgvTWXTaYKm+LD43Na888Pr4eDF1O1537v8tecG66tPFkQuHFTevOOVVoT2i7z1PmRTRjEH9U1RVYC+Ft6wadh0b9b3KU5aI6Fzcb+EjqyKicdiDtMJcPcX3pn2KTGYtFiKCvrgfiVf95pIny7/fD/Qs8furFcfDXisw7nvjZRVFdOfjvgsvGRXRjEH9U1RVYC+Ft6yKiMYhD9wkeRH3W/jIqOG7J96RlxXyOf8XActkxoKh+0LS7UsrDIgryHdYXAzdjkstamOVO4jW8Ds38rDS9q3DPwwrD9nzGZGMQf1TVFVgL4W3jJrijrZ8rJDLiOZc1O8KN0AjmjmQnxVeA4xoJsTmCrNZ1G3ho7at5bY5TigXtF4cxZFpi9pdoRAY+pTqjj1sPGVXRDUOeyg8ZVNEMgb1T1FVgb0U3rJpqg+0y0/24iAiORf1m/0NoeleVZOn7Ne2FdFMiMxlXVhGBG1xu1L2Czmzbu/AW72JfvY8ZNI0g7a8rPC+9vCnVHfkJfNT8ohiDOqfoqoCeym8ZVNEMgf2U/jLpojkPNxn4SGbprjhuYd8ZS/yT9+U6ylkLOtJ2/wulNq0Vt7JbGadVkiVqE9es2qEvKzwdDeiGY+9FN4yKaIYg/qnqKrAXgpvmfQ7wpgK+eImyQHcZ+Ehm6bdUEHesud2ms+pvUPGsi6CIoI2uD2Jp1Pnyk81bhtNjMT9h5+MmmpgkZ/MubRme2Uocz4jijGof4qqCuyl8JZJU97Fli+u5wOoT16Z7Ij8pc5vhDEXMpa1kIgI6nA70kofsJ9dPt98IccRGI+9hLeMiijmQZ4y35yYbjEmT1lfqYwIxqD+KaoqsJfCWyZFFHNhX4XPTIoozkN9Zn6yN81r5I+Qx8znoxWRTIINFQaz6C1CqELtWDydOkfDXu97ho3PbIoI5kGeMr9CG1HMgzxlvZsYEYxB/VNUVWAvhbcsmuppc4n8ZS0UIoLz2PGQSRHF3Mhn5s9BRxSTIENZFz8RwWv47yWeTvXXdE+lHrHxnEmzfm4g42L2pghhKuQr6/kZEYxB/VNUVWAvhbcsmvMD7IH9FX6zKCI4B/dX9J9JUxf2W+Q18+eg57nWZSbrCVt1survLZ5O9ZXvfNxynQV5zVhkT/lBTfmy9vzOrim/UFC+suYzIhiD+qeoqsBeCm9ZFBHMif0VfrMoIjgH91f0n0lTF/Zb5DVznudZA8lM1rvJL+2mor+z2Nmvr5zfyHgu5DtjUTXlzkLyZe35nV1TvgMvX1nzGRGMQf1TVFVgL4W3LIoI5sT+Cr9ZFBGcg/pL+8aDFFHkQH6zPmiY520dmbnMh5/9NxJPp/opxSt+nyH/GYuqcD8fO14zaObtb/f8zq5wPwb1T1FVgb0U3lIo7E/Nnu8ECvfnoP7SfkQjQkiDPKd94BAhjEVGsl7Uhx/16W9W+N6cmRWZzo3ioKhqyI7XDAr38yFvGT/cHu7HoP4pqiqwl8JbBs353TUF8pnxJm+4Pwf1l/XGf5ON1M5EnjNe63dFFAORieV3k/LvSpm348yi6bcNfQbFQVHVEHkjnw2RN/J5EPVPUVWBvRTeMihLUcX1/AU7/WfRtG88PEKeM+c7ohiEDRSGsujpdyf1uxav+50j5zkynxfFwCTXEHkjnw2RN/J5EPVPUVWBvRTeMijFUwL55Hr+BPdV9J1JEUUuduLIorFFrAxkTd6XT0T0OxabUZyvOAJ5UQzpJrmwPiXyx6KhIfJGPg+i/imqKrCXwlsGpXhKIJ9cz5/gvoq+MymiyIV8ZzwnreFF1ZIbVPjnUuYvMcusKbeiPoJioKhqiPyxaGiIvJHPg6h/iqoK7KXwlkEUVf0U7vvjvoq+syjN91OVyHvWjwWNe+VXnWc9UT9dtOvnWeNaSXE0ciL/FFUNkT8WDQ2RN/J5EPVPUVWBvRTeMoiiqp/CfX/UV8Zr10rxmb495J2cH0WdL7VBhf9d4nW/OZR6wwr5p6hqiPyxaGiIvJHPg6h/iqoK7KXwlkEUVf0U7vujvrIu8NN86W+JvGe83q0xb0qpYyvj5g27GyH43yRe95tHqTeskHeKqobIH4uGhsgb+TyI+qeoqsBeCm8ZRFHVT+G+P+or61fhpDj/9pD3jNf7TRHCuajjrAn78ARE/2axu998iiOUD3mnqGqI/LFoaIi8kc+DqH+KqgrspfCWQRRV/RTu+6O+MubHigjyYe9FLGkUIZyLOs76nU0RwR/031lfYbyC0m5YIe8UVQ2RPxYNDZE38nkQ9U9RVYG9FN4yiKKqn8J9f9QXRdUAduJJobB/Huo0a7L+7qSi/2/xZb7zK45YLuSboqoh8seioSHyRj4Pov4pqiqwl8JbBlFU9VO474/6oqgawE48KRT2z0Odpt6gwv8r8bpfDqXcsEK+KaoaIn8sGhoib+TzIOqfoqoCeym8ZRBFVT+F+/6or5RFVdhPi2JIuc4O++ehTrMWJPZu7f0MzamUG1bIM0VVQ+SPRUND5I18HkT9U1RVYC+FtwyiqOqncN8f9ZVyE7KwnxbFQDH7Feow48Bo+ekan5/KqTj78iDPFFUNkT8WDQ2RN/J5EPVPUVWBvRTeMoiiqp/CfX92+k6hsJ8WxUBR9RXqMGWSJLZLz6t0G1bIc7rrJKxPifyxaGiIvJHPg6h/iqoK7KXwlkEUVf0U7vuz03cKhf20KIaU9ULY7486S3tyovSKszAH8ktR1RD5Y9HQEHkjnwdR/xRVFdhL4S2DKKr6Kdz3Z6fvFAr7aVEMFFWfoc6yfoEayq9UG1bIL0VVQ+SPRUND5I18HkT9U1RVYC+FtwyiqOqncN+fnb5TKOynRTFQVH2GOuMVOjRKqTaskFeKqobIH4uGhsgb+TyI+qeoqsBeCm8ZRFHVT+G+Pzt9p1DYT4tioKh6hDpKe2KiZRRn4/zIK0VVQ+SPRUND5I18HkT9U1RVYC+FtwyiqOqncN+fnb5TKOynRTFQVD1CHb2VHaMU8knt47fCzodpNqyQ13SDSVifEvlj0dAQeSOfB1H/FFUV2EvhLYMoqvop3Pdnp+8UCvtpUQwZz8v+eVcnaU/KC8sncxzBpY5hRDQ38pluMAnrUyJ/LBoaIm/k8yDqn6KqAnspvGUQRVU/hfv+qK+fRd8pFPbTohgynpenFFUZJ5Oryp97iyP3Hv17yoGlUIoNK+SToqoh8seioSHyRj4Pov4pqiqwl8JbBlFU9VO474/6YnE/AMXAly7voU7YoGJ+PSym7vjnm9/PqhQbVsgjRVVD5I9FQ0PkjXweRP1TVFVgL4W3DKKo6qdw3x/1lbKokiKCnOzEk0Jhvw/qIG1iLiIXGZ7s44g9xr8Tv7/XTiZFRPMijxRVDZE/Fg0NkTfyeRD1T1FVgb0U3jKIoqqfwn1/1BdF1QB24kmhsN8HdbDCBgeryscmjtRzxN/stZVJ029YIY8UVQ2RPxYNDZE38nkQ9U9RVYG9FN4yiKKqn8J9f9QXRdUAduJJobDfHjWeNimLywNEHKVj+O827WRWRDQn8pduEA/rUyJ/LBoaIm/k8yDqn6KqAnspvGUQRVU/hfv+qK+M+bEignzYexFLGkUI7VHjaZOyqL783NQzqI2sA8xWU29YIX/pchzWp0T+WDQ0RN7I50HUP0VVBfZSeMsgiqp+Cvf9UV8Zr10rxfm3h7xnvN6t3xFCe9T4CrvFraDb56bisFSjtrKe7KUiovmQN4qqhsgfi4aGyBv5PIj6p6iqwF4KbxlEUdVP4b4/6oui6mTkPeP1bv2IENqihrMmZDUd/tzUM6hNNqzoiLxRVDVE/lg0NETeyOdB1D9FVQX2UnjLIIqqfgr3/VFfWYuqPgv8E5D3jNe71a2oYoOKsfJTwjga7VHb3zd9ZdWvCGc65I2iqiHyx6KhIfJGPg+i/imqKrCXwlsGUVT1U7jvj/sq+s6i6TfleoS8Zy1k3yKEdqhRa4UnGRnlvMeR6If72PSZWRHRXMgXRVVD5I9FQ0PkjXweRP1TVFVgL4W3DKKo6qdw3x/3VfSdRhFCOuT9rYwlidpf82o07QmYXF1e9XuE+so4EJeacsMK+aKoaoj8sWhoiLyRz4Oof4qqCuyl8JZBFFX9FO77476KvjMposiFfGddX3Ypqtig4lw12dXvKO5z4yGzIqJ5kCeKqobIH4uGhsgb+TyI+qeoqsBeCm8ZRFHVT+H+HHb6z6KIIBc7cWRRRNAIN1h0gPpq6KCt/l3Q7fnKpIhmHuSJoqoh8seioSHyRj4Pov4pqiqwl8JbBlFU9VO4P4ed/rMoxTm4RZ4z5zuiaIQaXGEDgwzyIBhZH4c8ZP0w4VbTbVghTxRVDZE/Fg0NkTfyeRD1T1FVgb0U3jKIoqqfwv05qL+sb2Cl2wFQnjNe63dFFI1Qg2xQ0VenbETxLPay8ZZZEdEcyA9FVUPkj0VDQ+SNfB5E/VNUVWAvhbcMoqjqp3B/DuovY46sfl9G2wl5TvtwJkJogxrMOOhlki/qyPY8yFPWXVq2mmrDCvlJN4CH9SmRPxYNDZE38nkQ9U9RVYG9FN4yiKKqn8L9Oai/zG/lRBQ5kN+M56PVdgt7NbjC4npGTfV0qsTeNl4zKyIaj7xQVDVE/lg0NETeyOdB1D9FVQX2UnjLIIqqfgr35+D+iv4zKdXnqnb8Z1G776hSY5kTMbNcqEaW50Ue2bCiIfJCUdUQ+WPR0BB5I58HUf8UVRXYS+Etgyiq+incn4P7K/rPpDRfAiyvmfPc7np3Y0XjqE5TP50qkdcVjv80G1bIC0VVQ+SPRUND5I18HkT9U1RVYC+FtwyiqOqncH8O7q/oP5sikrmRT3/f6p7/DIooGqDGVnhSMYs8wEVmc2C/G/+ZFRGNRT4oqhoifywaGiJv5PMg6p+iqgJ7KbxlEEVVP4X781CfmTdiiyjmRj7JsRsqGkavKdXTqRJ5Z8OKRsgHRVVD5I9FQ0PkjXweRP1TVFVgL4W3DKKo6qdwfx7qM2Oe7pr+FUB5zHiN/1WEUY8ay/y4bhb5OxAiozmx/008mRURjUMeKKoaIn8sGhoib+TzIOqfoqoCeym8ZRBFVT+F+/NQn9m/hzUimRP5y1xLtPk+MDWUcaCbTSkG3mdQLGxY0QB5oKhqiPyxaGiIvJHPg6h/iqoK7KXwlkEUVf0U7s/DfRYesmmqr47ZIm/Zc/s9QqlDDWVPxEi5AIlMroHj2cSXVcM3rJAHiqqGyB+LhobIG/k8iPrPWFRNUxTIi7XncWZRVPVTuD8P91l4yKiIZi7kK+P4uFVEUokaYoOK15Riq/SjOKZNjJkVEY1B/VNUNUT+WDQ0RN4y5nPoAtf9F34yiKKqThRV/TQkt+o380YKVrvvUmqEPK2Q14imAjdSNIq+VurNKJ5B8a3wGbuhj8nVP0VVQ+SPoqoh8pYxn21ez3gR9Z+xqGrzOYFK5CPrnEJR1U9D5mj1u8KGXBHNHMhP9s+qtXm7SQ2xQcUxpd+M4hkc4ybmzIqIzkd9U1Q1RP4oqhoibxnzObRAUP8Zi6rfYX8I6j/ruXYXRVU/Dbme1a+15yeTZvpOzhXyWV/gqxEr++O6M+UCNLK3PoqVDSsqUN8UVQ2RP4qqhshb1oVuRHAu7rfwkUkRxbm4Xyn7PEJR1VcRwXmoz1UeJgx9cm/kwfLDhj1/mRQRVeBGikbRvpZ/3W8Px7zJQVYNu5ujvimqGiJ/FFUNkTcWYU/g/qTsrwtFNOfhPgsPWUVR1VcRQX/cl5Q1T48U0Y1B/a9SoEZEFaiRFarL3rrE6357OO5NHjIrIjoX9UtR1RD5o6hqiLxlXVyc9iFt9WWt8MT+tC8NVV/WCp9ZuYuiqq9OuZ7Vj7Xim1nDbvq7342PzKofH9XIKsnoqUu97rdH5GAvN5k06sOwFFUNkT+KqobIW9ZFmBVR9EN9ZN8euFRE1g/3Ia22cKWo6q+Iog9qf7VrudTphZX72/SfXRFVBWok+04dvRWZujbOQ5GXrIqIzkN9UlQ1RP4oqhoib5kXYd0+4K62rRXf4uj2KrTatlZ6OrUVRVV/dbme1e6q1/IjReR9UT+rvPJ3V0RWgRpZ8TFoCw17lDorygcbVryA+qSoaoj8UVQ1RN4yL8KsiKQNbk9abbFQqulTe7Vn+SnAyusJiqpzFJG0Qe2t/nTqkbq9YeV2pdWKVF7966jLfn7qM5yTTY6y6vQNK9QnRVVD5I+iqiHyln0RZkU0r+M2pNULg62qCyu1caWcUVSdp4jmddyGtMKN4Bo1fTjgtqRVbzhFlBWokVUf09doyOduMqDcWHs5y6aI6BzUH0VVQ+SPoqoh8rbCIszyfBZRPY//RvJr8FcpprbysY9MPI//RrpaziiqztXh69m/H7p6MVXK+fDNj8jUMfx30upP7yPaF3EDRYOoNqkXQDla4cI6tXBWfxRVDZE/iqqGyNsqi7C7bq+9WI+In3uRcaXPWXym2wLWekT8/Mo5y1JUrXaz/NPr+f6z+L0r3hg5KhdYztWtyPpE/vlqc8Mj1X+WT404YXuNX1FNH5GujPO0yVtmRUT9UV8UVQ2RP4qqhsjb6nOBz5e7WHQ9J3L2UVmKqitdz3s/R+io4uqpQI3wePSP+PzUQSJne7nMpIimP+or3eAf1qdE/jJOpuF+PuSNG2wIfS2KKoTWU/1DFTewafDKeukd/KvjnG1ymFWnbVihviiqGiJ/FFUNkTcWYQh9LYoqhNbT97h0XkeNrPC5mFrVJ/KiKHfWCq+ERER9UT8UVQ2RP4qqhthb4RUh9FFZiiquZ4SeV1w5L+IGigavqMgGvIpyuEJhfsqGFeqHoqoh8kdR1RB7K7wihD6KogqhtVS/BlQjV77g2JCiEc7jJq+ZFRH1Q31QVDVE/iiqGmJvhVeE0EdRVCG0luKqqUCNXHU7VG/MEVmAFiifbFjxBOqDoqoh8kdR1Zgdvwih90pRVJkd7wih92qyjfpVLzZ2+OuAc7rJcVZ137BCfVBUNUT+KKoaI39sm43Q58pUVHE9I/S54mqpQI1ccYMKL8AiA9AS51Viw4ovUPsUVQ2RP4qqxshfxpwidKYyFVVczwg91ltcKq+jRqyr3b04ZSOCK+McFznPqK7nidqnqGqI/FFUNUb+vhd+EULvlamo4npG6LHiSqnAjRSNri4KqhNQnlc5ryKi9qhtiqqGyB9FVWPsr/CLEHqvTEUV1zNC+2rzdUpq6EqPgyNqOAPlmw0rPkFtU1Q1RP4oqhpjf4VfhNB7UVQhlFttdgB3I5tGV1dEDWfhnBfHIKO6bVihtimqGiJ/FFUdkEc+3I7QY6Upqoz8esfjvTgQuqri6qhEDV3l/dqIGM7EeZfYsOIBapeiqiHyR1HVAXm84kZGCD2rbEUV1zNC/6p+C/U7amz1OxZtHunByyj/bFjxALVLUdUQ+aOo6oA9Fp4RQv8qW1HF9YzQH7WrEdzQpuEVRUE1AT4Gm2OSVV3OJbVJUdUQ+aOo6oA9Fp4RQv+KogqhnIqrogFq7K1ofCVRUE2EjgUbVuygNimqGiJ/FFWdkM+V5wuEapSqqDLyzPWMrq52byCpMWuvkxVEQTUZPh6b45NVPyOcZqhNiqqGyB9FVSfss/CNEPqjjEUV1zO6snyjP66GBrixTeMriYJqQnxM4tjsHbNMiojaoPYoqhoifxRVHZHXFa5hhForXVFl5JvrGV1R7esENbjiBhUUVBOjY8OGFQVqj6KqIfJHUdUReb3KbrEIHVHWoorrGV1RcQU0wg0WHawgCqrJ8fHZHK+s+h3hNEHtUVQ1RP4oqjpir4V3hFDeoorrGV1NcfY3RI2u9h0FFFRJ0HHKuOgtFdHUo7YoqhoifxRVnZFfvuMGofdKWVQZeed6bi/PQ7xaOZ/irG+MGl7pYFNQJcLHanPssuotwqlGbVFUNUT+KKo6Y7+Ff4SursxFFddzW33f5JXCah51+a7R1S4gCqqExHHbO56ZFNHUoXYoqhoifxRVJyDP34oYELqy0hZVxv6LeNBxfViP+r/j3/d+H52nPgWVceNFZ1lFQZUUHbcVPhwb0dShdiiqGiJ/FFUnYM8SiwWE/ih7UcX1XKeH23P73yVyO059r011sMLBpaBKjI/d5lhmVZNXANUORVVD5I+i6iTsu4gDfS7fTCJnn+u2OC3+LYNSF1VGMXBuvqbb636fod+xKKzOVxyBTriDosOsioggKzqGGRe/WzXZBVDtZMtD090PWyN/6V5jCespkf+3Mh70Qe9uAur/s431vm6Fif7X2vv5zEpfVBnFwfX8vPy1RJG5r/HvSr5psNcWaqtzHry4k02nWRXRQGZ8HIvjmlERzeuojWxFwI+wPiXyly2fv8J6SuTfWvE7D1tp97Wg+Pe937+iPixOi59nUDjPjeOQuJ6/1u2p81H8NxKFa189fBWzOeoo+4cRIxJYAR3P7IN3RPI6bqNoc3Z9+arDSOQvWz6b7SQ5CsVg8WrLRz18eqGfkbM/2l2c6t+yzQ3hPD+OReLc3NeHGwCvoDbYGKSPvGdEZPkE1FnmAxlRwCr4mBbHOJsiktdxG0Wbsyucz4n9FX5nVzjPjeMo4rqynrpT6t+Rrrp4/XRxqp9l2lDrZ9heBsXE9fxevk6bvuKp9q58/beW8xiZPRF1mrWoighgNXRsM3+2KqKoQ+1kuSs79eep7shnplerwnV+HEsR2xV1aOGl379izr58dco/3/z+7ArXa+G4ijivqm5PP9yuxOuAdfIaMjJ6Muo4Y1EV7mFFfHyllHdrIoRq1FaW6zLFh7Hl09rzP5v6fXfGIBRTlty31ssTu/9u087KOpQj/W6GeWHMHfKTcGybWK+m0xbr7kfK/nGIs9XkVcwqbGBjKIPCOayMj3Nx3DOo2SsfasuafQGRavEgr7NPUMsuxhxXxLcX92pqMrG7DWnVnL10rvtvNm3MqiV2/fsMxbjyubmnIU8+3KfEZ62+ls9F5ykyNxgZyVANvzQIQ158vDfHP4PCeRvcXtH+bAqnObDfwv9sCqdr4vikle+83ib2CLcJas9aaVfA6sWP/tYL3L22Z9Byn6V6hGJd/Xq2hhRTJfYgZfpM4Zk6dyOKZ7ChjcEZdd52iDAVPu5ShjtiXV7bUruzXpvhMBf2Lc14PoXDtXGc0mqfF6guFD7D7UrZF1TNcuQ2pBkLzcutUxyvtOLnf+ZbqAt7Cm97nq8kjycvbWF/GjYXRvcCGKUmr1FAbnwOSJ6QZ1wMW11f91D71iyLiPQLB/uXZrnbfckxzjFLs17Pz+p27KwziL6y5cx+uxSc0e5enyO0/Ct/n6H4M56bpXw9d7s50hJ7lFxUZM/5UZ065lZzNyuNXHB40TblXQIYj88LyYOJz9GRA8rttQDrLKI/XxtnF1geyJa7Jh2P5HNpRD59dzecXBPHL2W86zrs2LlfaaZi4pFOWfzc+5BGzAenzwEzE7ngej4Ze5dGrtl7y9c1NQEAAMBXeLKMSXNvQp1Ftye01gyEF+dstjvVLH4ujo9/nAd758csuhVS1irc45HOvknYQ38LKQsAAAAOEBOon8L4KcfeRHu2pn8ScfcnjczZcgtUqCfOiVmuZ3u4zCL9HmfEPNuNl0dyMZji9UsAAIA0eGKV/GrmmQsyF1G3Dz9b2QjfZ7zO6va5iwxPE+fKmdcz5+iGex4kH4MZXhX0eeCbMRRRAAAAZ+FJN+QJ2AuCmoWZ/9Zt/J3QrdW4xxUx1uRs+VzBudzPozinaq9n/73F+XmQe74id/djYbV4suU27u25kLvI8fnPf/4fy5Q6UoH0jSYAAAAASUVORK5CYII=" />;
        const display: HTMLElement[] = [];
        switch (this.state.scene) {
            case "login":
                return (
                    <div class={main}>
                        {logo}
                        <div class={classInputContainer}>
                            <br />
                            <input class={classInput} type="email" required defaultValue={this.defaultEmail} />
                            <span class={classInputFloatingLabel}>Email address</span>
                        </div>
                        <div class={classInputContainer}>
                            <br />
                            <input class={classInput} type="password" required defaultValue={this.defaultPassword} />
                            <span class={classInputFloatingLabel}>Password</span>
                        </div>
                        <div class={classDeviceIDContainer}>
                            <div class={classInputContainer}>
                                <br />
                                <input class={classInput} type="password" required defaultValue={this.defaultDeviceID} />
                                <span class={classInputFloatingLabel}>Device ID</span>
                            </div>
                            <button title="Click me for help to get your own DeviceID" class={classDeviceIDHelp}>?</button>
                        </div>
                        <button class={classButton} onclick={this.tryLogin.bind(this)}>Login</button>
                        <label style={{ color: "#CFCFCE" }}><input defaultChecked={this.state.saveCredentials} onchange={(evt) => this.setState({ saveCredentials: evt.target.checked })} type="checkbox" /> Remember credentials?</label>
                        <p style={{ color: "#CFCFCE", fontSize: "0.9em" }}>Unofficial Amino PC version {version}</p>
                    </div>
                );
            case "waiting":
                // ToDo - https://codepen.io/dicson/pen/vOxZjM with Amino logo?
                return (
                    <div class={main}>
                        {logo}
                        {<div>
                            <svg x="0px" y="0px"
                                width="40px" height="40px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" space="preserve">
                                <path fill="#FF6700" d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z">
                                    <animateTransform attributeType="xml"
                                        attributeName="transform"
                                        type="rotate"
                                        from="0 25 25"
                                        to="360 25 25"
                                        dur="0.6s"
                                        repeatCount="indefinite" />
                                </path>
                            </svg>
                        </div>}
                    </div>
                );
            case "error":
                return (
                    <div class={main}>
                        {logo}
                        {<p class={classErrorMessage}>{this.state.errMsg}</p>}
                        <button class={classButton} onclick={() => { this.setState({ scene: "login" }); }}>Okey</button>
                    </div>
                );
            default:
                return (
                    <div class={main}>
                        {logo}
                        <h1 class={classHeader}>Something went terribly wrong</h1>
                    </div>
                );
        }
    }
}