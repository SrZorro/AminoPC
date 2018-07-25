import AminoClient from "aminoclient";
import { Component } from "inferno";
import { style } from "typestyle";

const classTextInput = style({
    width: "100%",
    height: "45px",
    backgroundColor: "#171814",
    display: "flex"
});
const classIcon = style({
    color: "#808080",
    width: 45,
    height: 45,
    padding: 8,
    boxSizing: "border-box"
});
const classLeft = style({
    width: 45,
    height: 45
});
const classMiddle = style({
    width: "calc(100% - 45px - 45px)",
    display: "flex",
    alignItems: "center",
    height: 45
});
const classInput = style({
    width: "100%",
    height: "70%",
    backgroundColor: "transparent",
    color: "white",
    border: 0,
    outline: "none",
    fontSize: "0.9em"
});
const classRight = style({
    width: 45,
    height: 45
});

export default class TextInput extends Component<any, any> {
    constructor(props, context) {
        super(props, context);
        this.state = { state: 5 };
    }

    private sendMessage(evt: any) {
        if (evt.ctrlKey && evt.key === "Enter") {
            AminoClient.sendMessageInThread(this.props.ndcId, this.props.threadId, evt.srcElement.value);
            evt.srcElement.value = "";
        }
    }

    public render() {
        return (
            <div class={classTextInput}>
                <div class={classLeft}><svg class={classIcon} viewBox="0 0 512 512"><path fill="currentColor" d="M67.508 468.467c-58.005-58.013-58.016-151.92 0-209.943l225.011-225.04c44.643-44.645 117.279-44.645 161.92 0 44.743 44.749 44.753 117.186 0 161.944l-189.465 189.49c-31.41 31.413-82.518 31.412-113.926.001-31.479-31.482-31.49-82.453 0-113.944L311.51 110.491c4.687-4.687 12.286-4.687 16.972 0l16.967 16.971c4.685 4.686 4.685 12.283 0 16.969L184.983 304.917c-12.724 12.724-12.73 33.328 0 46.058 12.696 12.697 33.356 12.699 46.054-.001l189.465-189.489c25.987-25.989 25.994-68.06.001-94.056-25.931-25.934-68.119-25.932-94.049 0l-225.01 225.039c-39.249 39.252-39.258 102.795-.001 142.057 39.285 39.29 102.885 39.287 142.162-.028A739446.174 739446.174 0 0 1 439.497 238.49c4.686-4.687 12.282-4.684 16.969.004l16.967 16.971c4.685 4.686 4.689 12.279.004 16.965a755654.128 755654.128 0 0 0-195.881 195.996c-58.034 58.092-152.004 58.093-210.048.041z"></path></svg></div>
                <div class={classMiddle}><textarea type="text" placeholder="Write a message..." class={classInput} onKeyDown={(evt) => { this.sendMessage(evt); }}></textarea></div>
                <div class={classRight}><svg class={classIcon} viewBox="0 0 512 512"><path style={{ transform: "translate(calc(45px), 0)" }} fill="currentColor" d="M176 352c53.02 0 96-42.98 96-96V96c0-53.02-42.98-96-96-96S80 42.98 80 96v160c0 53.02 42.98 96 96 96zm160-160h-16c-8.84 0-16 7.16-16 16v48c0 74.8-64.49 134.82-140.79 127.38C96.71 376.89 48 317.11 48 250.3V208c0-8.84-7.16-16-16-16H16c-8.84 0-16 7.16-16 16v40.16c0 89.64 63.97 169.55 152 181.69V464H96c-8.84 0-16 7.16-16 16v16c0 8.84 7.16 16 16 16h160c8.84 0 16-7.16 16-16v-16c0-8.84-7.16-16-16-16h-56v-33.77C285.71 418.47 352 344.9 352 256v-48c0-8.84-7.16-16-16-16z"></path></svg></div>
            </div>
        );
    }
}