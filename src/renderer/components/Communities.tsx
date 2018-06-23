import { Component } from "inferno";
import { style } from "typestyle";
import AminoClient from "aminoclient";

const main = style({
});

export default class Communities extends Component<any, any> {
    constructor(props, context) {
        super(props, context);
    }

    public render() {
        return (
            <div class={main}>
                WIP
            </div>
        );
    }
}