import AminoClient from "aminoclient";
import { IAminoMessage } from "aminoclient/dist/AminoTypes";
import { Component } from "inferno";
import { style } from "typestyle";
import ChatBubble from "./ChatBubble";
import FileDrop from "./FileDrop";
import TextInput from "./TextInput";

const classMain = style({
    width: "100%",
    height: "100%",
    backgroundColor: "#272822"
});

const classHeader = style({
    width: "100%",
    height: 55,
    backgroundColor: "#171814"
});

const classBody = style({
    width: "100%",
    height: "calc(100% - 55px - 45px)",
    backgroundColor: "#272822",
    overflowY: "scroll",
    $nest: {
        "&::-webkit-scrollbar": {
            width: 14,
            height: 18
        },
        "&::-webkit-scrollbar-thumb": {
            "height": 6,
            "border": "4px solid rgba(0,0,0,0)",
            "backgroundClip": "padding-box",
            "borderRadius": 7,
            "backgroundColor": "#3C5730",
            "-webkitBoxShadow": "inset -1px -1px 0px rgba(0, 0, 0, 0.05), inset 1px 1px 0px rgba(0, 0, 0, 0.05)"
        },
        "&::-webkit-scrollbar-track": {
            "border": "4px solid rgba(0,0,0,0)",
            "-webkitBoxShadow": "inset -1px -1px 0px rgba(0, 0, 0, 0.05), inset 1px 1px 0px rgba(0, 0, 0, 0.05)",
            "backgroundClip": "padding-box",
            "borderRadius": 7,
            "backgroundColor": "#283621"
        },
        "&::-webkit-scrollbar-button": {
            width: 0,
            height: 0,
            display: "none"
        },
        "&::-webkit-scrollbar-corner": {
            backgroundColor: "transparent"
        }
    }
});

const classArrow = style({
    height: "calc(55px / 2)",
    width: "calc(55px / 2)",
    paddingLeft: "calc(55px / 4)",
    paddingTop: "calc(55px / 4)",
    color: "white",
    cursor: "pointer"
});

const classScrollBtn = style({
    position: "absolute",
    cursor: "pointer",
    width: 40,
    height: 40,
    right: 0,
    transform: "translate(-24px, calc(-40px - 20px))",
    backgroundColor: "#434D57",
    borderRadius: "50%",
    transition: ".2s linear opacity"
});

const classScrollBtnIcon = style({
    color: "white"
});

export default class ThreadChat extends Component<any, any> {
    private updateInterval: number;
    private shouldUpdate: boolean;
    private autoScroll: boolean;
    private dummyBottomDiv: HTMLElement | null;
    constructor(props, context) {
        super(props, context);
        this.state = { thread: null, threadMessages: null };
        this.shouldUpdate = true;
        this.autoScroll = true;
        this.dummyBottomDiv = null;
    }

    public async componentWillMount() {
        await this.updateLoop();
    }

    public componentDidUpdate() {
        if (this.autoScroll) {
            // Defer scroll til DOMRender happens
            setTimeout(() => requestAnimationFrame(() => this.scrollToBottom(true)), 0);
            this.autoScroll = false;
        }
    }

    private scrollToBottom(instant: boolean) {
        if (this.dummyBottomDiv !== null)
            this.dummyBottomDiv.scrollIntoView({ behavior: instant ? "instant" : "smooth" });
    }

    public componentWillUnmount() {
        clearInterval(this.updateInterval);
        this.shouldUpdate = false;
    }

    private async updateLoop() {
        const messageList = await AminoClient.getThreadMessages(this.props.ndcId, this.props.threadId, 0, 100);

        // @ts-ignore
        messageList.reverse();
        this.setState({ threadMessages: messageList });
        if (this.shouldUpdate)
            this.updateInterval = window.setTimeout(() => { this.updateLoop(); }, 3000);
    }

    public render() {
        const chatBubbles: ChatBubble[] = [];
        // type: 101 | mediaType: 0   = User joined
        // type: 0   | mediaType: 100 = Picture
        // type: 3   | mediaType: 113 = Sticker
        if (this.state.threadMessages !== null)
            this.state.threadMessages.forEach((message: IAminoMessage, index, messages) => {
                const prevMessage: IAminoMessage | null = index <= 0 ? null : messages[index - 1];
                const nextMessage: IAminoMessage | null = index >= messages.length - 1 ? null : messages[index + 1];

                if ((prevMessage !== null && prevMessage.author.uid !== message.author.uid) && (nextMessage === null || message.author.uid !== nextMessage.author.uid))
                    return chatBubbles.push(<ChatBubble aminoMessage={message} left={AminoClient.uid !== message.author.uid} displayName displayProfile />);
                if (prevMessage !== null && prevMessage.author.uid !== message.author.uid)
                    return chatBubbles.push(<ChatBubble aminoMessage={message} left={AminoClient.uid !== message.author.uid} displayName />);
                if (nextMessage === null || message.author.uid !== nextMessage.author.uid)
                    return chatBubbles.push(<ChatBubble aminoMessage={message} left={AminoClient.uid !== message.author.uid} displayProfile />);
                if (prevMessage !== null && prevMessage.author.uid === message.author.uid)
                    return chatBubbles.push(<ChatBubble aminoMessage={message} left={AminoClient.uid !== message.author.uid} />);
            });
        else
            chatBubbles.push(<h1 style={{ color: "white" }}>Loading messages...</h1>);

        return (
            <div class={classMain}>
                {<FileDrop observeDrop={classBody} ndcId={this.props.ndcId} threadId={this.props.threadId} />}
                <div class={classHeader}>
                    <img onclick={() => { this.props.changeScene("ThreadList", { threadId: "" }); }} class={classArrow} src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA0OTIgNDkyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0OTIgNDkyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjUxMnB4IiBoZWlnaHQ9IjUxMnB4Ij4KPGc+Cgk8Zz4KCQk8cGF0aCBkPSJNNDY0LjM0NCwyMDcuNDE4bDAuNzY4LDAuMTY4SDEzNS44ODhsMTAzLjQ5Ni0xMDMuNzI0YzUuMDY4LTUuMDY0LDcuODQ4LTExLjkyNCw3Ljg0OC0xOS4xMjQgICAgYzAtNy4yLTIuNzgtMTQuMDEyLTcuODQ4LTE5LjA4OEwyMjMuMjgsNDkuNTM4Yy01LjA2NC01LjA2NC0xMS44MTItNy44NjQtMTkuMDA4LTcuODY0Yy03LjIsMC0xMy45NTIsMi43OC0xOS4wMTYsNy44NDQgICAgTDcuODQ0LDIyNi45MTRDMi43NiwyMzEuOTk4LTAuMDIsMjM4Ljc3LDAsMjQ1Ljk3NGMtMC4wMiw3LjI0NCwyLjc2LDE0LjAyLDcuODQ0LDE5LjA5NmwxNzcuNDEyLDE3Ny40MTIgICAgYzUuMDY0LDUuMDYsMTEuODEyLDcuODQ0LDE5LjAxNiw3Ljg0NGM3LjE5NiwwLDEzLjk0NC0yLjc4OCwxOS4wMDgtNy44NDRsMTYuMTA0LTE2LjExMmM1LjA2OC01LjA1Niw3Ljg0OC0xMS44MDgsNy44NDgtMTkuMDA4ICAgIGMwLTcuMTk2LTIuNzgtMTMuNTkyLTcuODQ4LTE4LjY1MkwxMzQuNzIsMjg0LjQwNmgzMjkuOTkyYzE0LjgyOCwwLDI3LjI4OC0xMi43OCwyNy4yODgtMjcuNnYtMjIuNzg4ICAgIEM0OTIsMjE5LjE5OCw0NzkuMTcyLDIwNy40MTgsNDY0LjM0NCwyMDcuNDE4eiIgZmlsbD0iI0ZGRkZGRiIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=" />
                    <div></div>
                </div>
                <div class={classBody}>
                    {chatBubbles}
                    <div style={{ height: 10 }} ref={(el) => { this.dummyBottomDiv = el; }}></div>
                </div>
                {<div style={this.props.showScrollBtn ? { opacity: 1 } : { opacity: 0 }} class={classScrollBtn} onclick={() => this.scrollToBottom(false)}><svg class={classScrollBtnIcon} viewBox="0 0 512 512"><path style={{ transform: "translate(90px, 125px)" }} fill="currentColor" d="M314.5,90.5c0,6-2,13-7,18l-133,133c-5,5-10,7-17,7s-12-2-17-7l-133-133c-10-10-10-25,0-35 s24-10,34,0l116,116l116-116c10-10,24-10,34,0C312.5,78.5,314.5,84.5,314.5,90.5z"></path></svg></div>}
                <TextInput />
            </div>
        );
    }
}