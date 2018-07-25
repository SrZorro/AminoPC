// Copy and paste to create new components
import { Component } from "inferno";
import { style } from "typestyle";

const classMain = style({
    width: "100%",
    height: "100%",
    backgroundColor: "#272822"
});

export default class Template extends Component<any, any> {
    constructor(props, context) {
        super(props, context);
        this.state = { state: 5 };
    }

    public render() {
        return (
            <div class={classMain}>
            </div>
        );
    }
}