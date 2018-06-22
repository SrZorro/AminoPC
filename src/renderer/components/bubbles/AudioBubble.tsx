import { Component } from "inferno";
import { style } from "typestyle";

const classMain = style({
    height: 50
});

interface IAudioBubble {
    src: string;
}

export default class ChatBubble extends Component<any, any> {
    constructor(props: IAudioBubble, context) {
        super(props, context);
    }

    public render() {
        return (
            <div class={classMain}>

            </div >
        );
    }
}