import { Component } from "inferno";
import moment from "moment";
import { style } from "typestyle";

const classMain = style({
    color: "white",
    height: 60,
    display: "flex",
    flexDirection: "row",
    paddingTop: 8,
    paddingLeft: 10,
    paddingBottom: 8,
    boxSizing: "border-box",
    cursor: "pointer",
    $nest: {
        "&:hover": { backgroundColor: "#272822" }
    }
})
const classImage = style({
    height: 46,
    width: 46,
    borderRadius: "50%"
})
const classRight = style({
    width: `calc(100% - 46px - 1em)`,
    paddingLeft: "1em",
    overflowX: "hidden"
})
const classThreadName = style({
    fontSize: "1em"
})

const classInline = style({
    display: "inline"
})

const classTime = style({
    color: "#D0D0D0",
    float: "right",
    paddingRight: 5,
    fontSize: ".9em"
})

const classPreview = style({
    fontSize: ".9em",
    whiteSpace: "nowrap"
})

export default class ThreadElement extends Component<any, any> {
    constructor(props, context) {
        super(props, context);
    }

    public render() {
        return (
            <div class={classMain} onclick={() => {this.props.onClick(this.props.thread.threadId)}}>
                <img class={classImage} src={this.props.thread.icon} />
                <div class={classRight}>
                    <div style={{ height: "50%" }}>
                        <h1 class={[classThreadName, classInline].join(' ')}>{this.props.thread.title}</h1>
                        <p class={[classTime, classInline].join(' ')}>{moment(this.props.thread.lastMessageSummary.createdTime).format("hh:mm A")}</p>
                    </div>
                    <div style={{ height: "50%" }}>
                        <p class={[classPreview, classInline].join(' ')}>{this.props.thread.lastMessageSummary.content}</p>
                    </div>
                </div>
            </div>
        );
    }
}