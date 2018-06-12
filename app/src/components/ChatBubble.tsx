import AminoClient from "../Amino";
import { Component } from "inferno";
import { style } from "typestyle";

const classMain = style({
    width: "100%",
    color: "white",
    minHeight: 35,
    display: "flex",
    overflow: "auto"
})

const classLeft = style({
    width: 56,
    minHeight: 35,
    display: "flex",
    paddingBottom: 6,
    justifyContent: "space-around"
})
const classRight = style({
    width: "calc(100% - 56px)",
    marginRight: 10,
    float: "right",
    paddingBottom: 4
})

const classProfile = style({
    width: 33,
    height: 33,
    borderRadius: "50%",
    alignSelf: "flex-end"
})

const classBubble = style({
    borderRadius: 5,
    marginRight: 15,
    padding: "5px 5px 7px 10px",
    minHeight: 33 - 5 - 10,
    display: "table-cell",
    verticalAlign: "middle",
    paddingRight: 10
    // $nest: {
    //     "&::after": {
    //         content: "' '",
    //         position: "absolute",
    //     }
    // }
})

const classBubbleLeft = style({
    backgroundColor: "#171814",
    marginRight: 15,
    boxShadow: "0px 2px 0px 0px #343937"
})
const classBubbleLeftArrow = style({
    $nest: {
        "&::after": {
            content: "''",
            float: "left",
            transform: "translate(-17px, 7px)",
            boxShadow: "0px 2px 0px 0px #343937",
            width: 0,
            height: 0,
            borderBottom: "10px solid #171814",
            borderLeft: "10px solid transparent"
        }
    }
})

const classBubbleRight = style({
    backgroundColor: "#3B3C38",
    boxShadow: "0px 2px 0px 0px #2C4F2B"
})
const classBubbleRightArrow = style({
    $nest: {
        "&::before": {
            content: "''",
            float: "right",
            transform: "translate(12px, calc(100% + 9px))",
            boxShadow: "0px 2px 0px 0px #2C4F2B",
            width: 0,
            height: 0,
            borderBottom: "10px solid #3B3C38",
            borderRight: "10px solid transparent"
        }
    }
})

const classUsername = style({
    color: "#CE6718",
    fontWeight: "bold"
})

export default class ChatBubble extends Component<any, any> {
    constructor(props, context) {
        super(props, context);
        this.state = { thread: null };
    }

    public render() {
        const mountClassBuble: string[] = [];
        mountClassBuble.push(classBubble);

        mountClassBuble.push(this.props.left ? classBubbleLeft : classBubbleRight);

        if (this.props.left && this.props.profile !== undefined)
            mountClassBuble.push(classBubbleLeftArrow);

        if (!this.props.left)
            mountClassBuble.push(classBubbleRightArrow);

        return (
            <div class={classMain}>
                <div class={classLeft}>
                    {this.props.profile ? <img class={classProfile} src={this.props.profile} /> : null}
                </div>
                <div class={classRight}>
                    <div class={mountClassBuble.join(" ")}>
                        {this.props.who ? <p class={classUsername}>{this.props.who}</p> : null}
                        {this.props.msg !== null ? <p>{this.props.msg}</p> : null}
                        {this.props.picture !== null ? <img src={this.props.picture} /> : null}
                    </div>
                </div>
            </div>
        );
    }
}