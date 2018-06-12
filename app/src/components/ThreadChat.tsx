import AminoClient from "../Amino";
import { AminoMessage } from "../Amino/AminoTypes";
import { Component } from "inferno";
import { style } from "typestyle";
import ChatBubble from "./ChatBubble";

const classMain = style({
    width: "100%",
    height: "100%",
    backgroundColor: "#272822"
})

const classHeader = style({
    width: "100%",
    height: 55,
    backgroundColor: "#171814"
})

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
            height: 6,
            border: "4px solid rgba(0,0,0,0)",
            backgroundClip: "padding-box",
            borderRadius: 7,
            backgroundColor: "#3C5730",
            "-webkitBoxShadow": "inset -1px -1px 0px rgba(0, 0, 0, 0.05), inset 1px 1px 0px rgba(0, 0, 0, 0.05)",
        },
        "&::-webkit-scrollbar-track": {
            border: "4px solid rgba(0,0,0,0)",
            "-webkitBoxShadow": "inset -1px -1px 0px rgba(0, 0, 0, 0.05), inset 1px 1px 0px rgba(0, 0, 0, 0.05)",
            backgroundClip: "padding-box",
            borderRadius: 7,
            backgroundColor: "#283621"
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
})

const classFooter = style({
    width: "100%",
    height: "45px",
    backgroundColor: "#171814"
})

const classArrow = style({
    height: "calc(55px / 2)",
    width: "calc(55px / 2)",
    paddingLeft: "calc(55px / 4)",
    paddingTop: "calc(55px / 4)",
    color: "white",
    cursor: "pointer"
})

export default class ThreadChat extends Component<any, any> {
    private updateInterval: number;
    constructor(props, context) {
        super(props, context);
        this.state = { thread: null, threadMessages: null };
    }

    public async componentWillMount() {
        await this.updateLoop();
    }

    public componentWillUnmount() {
        clearInterval(this.updateInterval);
    }

    private async updateLoop() {
        console.log("Upading thread...");
        const thread = await AminoClient.getThreadMessages(this.props.ndcId, this.props.threadId, 0, 100);

        console.log(thread);
        //@ts-ignore
        thread.reverse();
        this.setState({ threadMessages: thread });
        this.updateInterval = window.setTimeout(() => { this.updateLoop() }, 3000);
    }

    private sendMessage(evt: any) {
        if (evt.key === "Enter") {
            AminoClient.sendMessageInThread(this.props.ndcId, this.props.threadId, evt.srcElement.value);
            evt.srcElement.value = "";
        }
    }

    public render() {
        const chatBubbles: ChatBubble[] = [];
        //type: 101 | mediaType: 0   = User joined
        //type: 0   | mediaType: 100 = Picture
        //type: 3   | mediaType: 113 = Sticker
        if (this.state.threadMessages !== null)
            this.state.threadMessages.forEach((message: AminoMessage, index, messages) => {
                const prevMessage: AminoMessage | null = index <= 0 ? null : messages[index - 1];
                const nextMessage: AminoMessage | null = index >= messages.length - 1 ? null : messages[index + 1];

                if ((prevMessage !== null && prevMessage.author.uid !== message.author.uid) && (nextMessage === null || message.author.uid !== nextMessage.author.uid))
                    return chatBubbles.push(<ChatBubble left={true} who={message.author.nickname} profile={message.author.icon} msg={message.mediaType === 0 ? message.content : null} picture={message.mediaType === 100 ? message.mediaValue : null} />)
                if (prevMessage !== null && prevMessage.author.uid !== message.author.uid)
                    return chatBubbles.push(<ChatBubble left={true} who={message.author.nickname} msg={message.mediaType === 0 ? message.content : null} picture={message.mediaType === 100 ? message.mediaValue : null} />)
                if (nextMessage === null || message.author.uid !== nextMessage.author.uid)
                    return chatBubbles.push(<ChatBubble left={true} profile={message.author.icon} msg={message.mediaType === 0 ? message.content : null} picture={message.mediaType === 100 ? message.mediaValue : null} />)
                if (prevMessage !== null && prevMessage.author.uid === message.author.uid)
                    return chatBubbles.push(<ChatBubble left={true} msg={message.mediaType === 0 ? message.content : null} picture={message.mediaType === 100 ? message.mediaValue : null} />)
            });

        return (
            <div class={classMain}>
                <div class={classHeader}>
                    <img onclick={() => { this.props.changeScene("ThreadList", { threadId: "" }) }} class={classArrow} src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA0OTIgNDkyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0OTIgNDkyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjUxMnB4IiBoZWlnaHQ9IjUxMnB4Ij4KPGc+Cgk8Zz4KCQk8cGF0aCBkPSJNNDY0LjM0NCwyMDcuNDE4bDAuNzY4LDAuMTY4SDEzNS44ODhsMTAzLjQ5Ni0xMDMuNzI0YzUuMDY4LTUuMDY0LDcuODQ4LTExLjkyNCw3Ljg0OC0xOS4xMjQgICAgYzAtNy4yLTIuNzgtMTQuMDEyLTcuODQ4LTE5LjA4OEwyMjMuMjgsNDkuNTM4Yy01LjA2NC01LjA2NC0xMS44MTItNy44NjQtMTkuMDA4LTcuODY0Yy03LjIsMC0xMy45NTIsMi43OC0xOS4wMTYsNy44NDQgICAgTDcuODQ0LDIyNi45MTRDMi43NiwyMzEuOTk4LTAuMDIsMjM4Ljc3LDAsMjQ1Ljk3NGMtMC4wMiw3LjI0NCwyLjc2LDE0LjAyLDcuODQ0LDE5LjA5NmwxNzcuNDEyLDE3Ny40MTIgICAgYzUuMDY0LDUuMDYsMTEuODEyLDcuODQ0LDE5LjAxNiw3Ljg0NGM3LjE5NiwwLDEzLjk0NC0yLjc4OCwxOS4wMDgtNy44NDRsMTYuMTA0LTE2LjExMmM1LjA2OC01LjA1Niw3Ljg0OC0xMS44MDgsNy44NDgtMTkuMDA4ICAgIGMwLTcuMTk2LTIuNzgtMTMuNTkyLTcuODQ4LTE4LjY1MkwxMzQuNzIsMjg0LjQwNmgzMjkuOTkyYzE0LjgyOCwwLDI3LjI4OC0xMi43OCwyNy4yODgtMjcuNnYtMjIuNzg4ICAgIEM0OTIsMjE5LjE5OCw0NzkuMTcyLDIwNy40MTgsNDY0LjM0NCwyMDcuNDE4eiIgZmlsbD0iI0ZGRkZGRiIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=" />
                    <div></div>
                </div>
                <div class={classBody}>
                    {chatBubbles}
                    {/* <ChatBubble left={true} who="Alex Fp" msg="Cuando te dicen a ti sacar a la perra y vas sin ganas pero tu perra va con menos ganas" date="2018-06-10T17:01:15Z" />
                    <ChatBubble left={true} msg="Y va directa hacia casa, la suelto y seguro que va" date="2018-06-10T17:02:01Z" />
                    <ChatBubble left={true} who="Irene" msg="fox" date="2018-06-10T17:02:16Z" />
                    <ChatBubble left={true} msg="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vulputate eros quis nisl egestas sagittis a quis leo. Sed vulputate egestas aliquet. Class aptent" date="2018-06-10T17:02:46Z" />
                    <ChatBubble left={true} msg="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vulputate eros quis nisl egestas sagittis a quis leo. Sed vulputate egestas aliquet. Class aptent" date="2018-06-10T17:02:52Z" />
                    <ChatBubble left={false} msg="Okey" date="2018-06-10T17:03:12Z" /> */}
                </div>
                <div class={classFooter}>
                    <input type="text" onKeyDown={(evt) => { this.sendMessage(evt) }} />
                </div>
            </div>
        );
    }
}