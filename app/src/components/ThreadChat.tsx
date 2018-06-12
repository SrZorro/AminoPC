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
    backgroundColor: "#171814",
    display: "flex"
})
const classFooterIcon = style({
    color: "#808080",
    width: 45,
    height: 45,
    padding: 8,
    boxSizing: "border-box"
})
const classFooterLeft = style({
    width: 45,
    height: 45
})
const classFooterMiddle = style({
    width: "calc(100% - 45px - 45px)",
    display: "flex",
    alignItems: "center",
    height: 45
})
const classFooterInput = style({
    width: "100%",
    height: "70%",
    backgroundColor: "transparent",
    color: "white",
    border: 0,
    outline: "none",
    fontSize: "0.9em"
})
const classFooterRight = style({
    width: 45,
    height: 45
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
    private autoScroll: boolean;
    private dummyBottomDiv: HTMLElement | null;
    constructor(props, context) {
        super(props, context);
        this.state = { thread: null, threadMessages: null };
        this.autoScroll = true;
        this.dummyBottomDiv = null;
    }

    public async componentWillMount() {
        await this.updateLoop();
    }

    public componentDidUpdate() {
        if (this.autoScroll) {
            this.scrollToBottom();
        }
    }

    private scrollToBottom() {
        if (this.dummyBottomDiv !== null)
            this.dummyBottomDiv.scrollIntoView({ behavior: "smooth" })
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
        if (evt.ctrlKey && evt.key === "Enter") {
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
                    return chatBubbles.push(<ChatBubble aminoMessage={message} left displayName displayProfile />)
                if (prevMessage !== null && prevMessage.author.uid !== message.author.uid)
                    return chatBubbles.push(<ChatBubble aminoMessage={message} left displayName />)
                if (nextMessage === null || message.author.uid !== nextMessage.author.uid)
                    return chatBubbles.push(<ChatBubble aminoMessage={message} left displayProfile />)
                if (prevMessage !== null && prevMessage.author.uid === message.author.uid)
                    return chatBubbles.push(<ChatBubble aminoMessage={message} left />)
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
                    <div ref={(el) => { this.dummyBottomDiv = el; }}>
                    </div>
                </div>
                <div class={classFooter}>
                    <div class={classFooterLeft}><svg class={classFooterIcon} viewBox="0 0 512 512"><path fill="currentColor" d="M67.508 468.467c-58.005-58.013-58.016-151.92 0-209.943l225.011-225.04c44.643-44.645 117.279-44.645 161.92 0 44.743 44.749 44.753 117.186 0 161.944l-189.465 189.49c-31.41 31.413-82.518 31.412-113.926.001-31.479-31.482-31.49-82.453 0-113.944L311.51 110.491c4.687-4.687 12.286-4.687 16.972 0l16.967 16.971c4.685 4.686 4.685 12.283 0 16.969L184.983 304.917c-12.724 12.724-12.73 33.328 0 46.058 12.696 12.697 33.356 12.699 46.054-.001l189.465-189.489c25.987-25.989 25.994-68.06.001-94.056-25.931-25.934-68.119-25.932-94.049 0l-225.01 225.039c-39.249 39.252-39.258 102.795-.001 142.057 39.285 39.29 102.885 39.287 142.162-.028A739446.174 739446.174 0 0 1 439.497 238.49c4.686-4.687 12.282-4.684 16.969.004l16.967 16.971c4.685 4.686 4.689 12.279.004 16.965a755654.128 755654.128 0 0 0-195.881 195.996c-58.034 58.092-152.004 58.093-210.048.041z"></path></svg></div>
                    <div class={classFooterMiddle}><textarea type="text" placeholder="Write a message..." class={classFooterInput} onKeyDown={(evt) => { this.sendMessage(evt) }}></textarea></div>
                    <div class={classFooterRight}><svg class={classFooterIcon} viewBox="0 0 512 512"><path style={{ transform: "translate(calc(45px), 0)" }} fill="currentColor" d="M176 352c53.02 0 96-42.98 96-96V96c0-53.02-42.98-96-96-96S80 42.98 80 96v160c0 53.02 42.98 96 96 96zm160-160h-16c-8.84 0-16 7.16-16 16v48c0 74.8-64.49 134.82-140.79 127.38C96.71 376.89 48 317.11 48 250.3V208c0-8.84-7.16-16-16-16H16c-8.84 0-16 7.16-16 16v40.16c0 89.64 63.97 169.55 152 181.69V464H96c-8.84 0-16 7.16-16 16v16c0 8.84 7.16 16 16 16h160c8.84 0 16-7.16 16-16v-16c0-8.84-7.16-16-16-16h-56v-33.77C285.71 418.47 352 344.9 352 256v-48c0-8.84-7.16-16-16-16z"></path></svg></div>
                </div>
            </div>
        );
    }
}