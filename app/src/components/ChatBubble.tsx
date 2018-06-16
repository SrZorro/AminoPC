import { AminoMessage } from "../Amino/AminoTypes";
import { Component } from "inferno";
import { style } from "typestyle";
import moment from "moment";

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
    paddingBottom: 4,
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
    paddingRight: 10,
    $nest: {
        p: {
            $nest: {
                "&:nth-last-of-type(2)": {
                    float: "left"
                }
            }
        }
    }
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
    boxShadow: "0px 2px 0px 0px #2C4F2B",
    float: "right",
    marginRight: "0 !important"
})
const classBubbleRightArrow = style({
    $nest: {
        "&::after": {
            content: "''",
            float: "right",
            transform: "translate(69px, 19px)",
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

const classParagraph = style({
})

const classPicture = style({
    width: "100%"
})

const classTime = style({
    color: "#717D85",
    marginLeft: 5,
    marginTop: 4,
    float: "right",
    fontSize: "0.8em"
})

interface IChatBubbleProps {
    aminoMessage: AminoMessage,
    left?: boolean,
    displayProfile?: boolean,
    displayName?: boolean
}

export default class ChatBubble extends Component<any, any> {
    constructor(props: IChatBubbleProps, context) {
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

        const ctx: HTMLElement[] = [];

        if (this.props.displayName)
            ctx.push(<p class={classUsername}>{this.props.aminoMessage.author.nickname}</p>)

        if (this.props.aminoMessage.content)
            this.props.aminoMessage.content.split("\n").map(line => line.length === 0 ? ctx.push(<br />) : ctx.push(<p class={classParagraph}>{line}</p>))

        if (this.props.aminoMessage.mediaValue) {
            switch (this.props.aminoMessage.mediaType) {
                case 113:
                case 100:
                    if (!this.props.aminoMessage.mediaValue.includes("ndcsticker://"))
                        ctx.push(<img class={classPicture} src={this.props.aminoMessage.mediaValue} />);
                    break;
                case 103:
                    //ToDo - Fix width
                    ctx.push(<iframe width="560" height="315" src={`https://www.youtube-nocookie.com/embed/${this.props.aminoMessage.mediaValue.replace("ytv://", "")}?rel=0&amp;showinfo=0`} frameborder="0" allow="encrypted-media" allowfullscreen={false}></iframe>);
                    break;
                case 110:
                    //ToDo - Add style from https://codepen.io/gregh/pen/NdVvbm
                    ctx.push(<audio controls><source src={this.props.aminoMessage.mediaValue} type="audio/aac" /></audio>);
                    break;
            }
        }

        ctx.push(<p style={this.props.aminoMessage.mediaValue ? { marginTop: 0 } : null} class={classTime}>{moment(this.props.aminoMessage.createdTime).format("LT")}</p>)
        return (
            <div class={classMain}>
                <div class={classLeft}>
                    {this.props.displayProfile && this.props.left ? <img class={classProfile} src={this.props.aminoMessage.author.icon} /> : null}
                </div>
                <div class={classRight}>
                    <div class={mountClassBuble.join(" ")}>
                        {ctx}
                    </div>
                </div>
            </div>
        );
    }
}