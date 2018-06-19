import { Component } from "inferno";
import { style } from "typestyle";
import ThreadElement from "./ThreadElement";
import AminoClient from "../Amino";

const main = style({
    width: "100%",
    height: "100%",
    overflowY: "auto",
    transition: "background-color 1s ease-out",
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
            "backgroundColor": "rgba(0,0,0,0)",
            "-webkitBoxShadow": "inset -1px -1px 0px rgba(0, 0, 0, 0.05), inset 1px 1px 0px rgba(0, 0, 0, 0.05)"
        },
        "&::-webkit-scrollbar-track": {
            "border": "4px solid rgba(0,0,0,0)",
            "-webkitBoxShadow": "inset -1px -1px 0px rgba(0, 0, 0, 0.05), inset 1px 1px 0px rgba(0, 0, 0, 0.05)",
            "backgroundClip": "padding-box",
            "borderRadius": 7,
            "backgroundColor": "rgba(0,0,0,0)"
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

const mainHover = style({
    $nest: {
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#3C5730"
        },
        "&::-webkit-scrollbar-track": {
            backgroundColor: "#283621"
        }
    }
});

export default class Threads extends Component<any, any> {
    private updateInterval: number;
    private shouldUpdate: boolean;
    constructor(props, context) {
        super(props, context);
        this.shouldUpdate = true;
        this.state = { isHovering: false, threadList: [], joinedThreadList: [] };
    }

    public async componentWillMount() {
        await this.updateLoop();
    }

    public componentWillUnmount() {
        clearInterval(this.updateInterval);
        this.shouldUpdate = false;
    }

    private async updateLoop() {
        let publicThreadList = await AminoClient.getPublicChats(this.props.ndcId, 0, 50);
        // Remove null threads
        publicThreadList = publicThreadList.filter((thread) => {
            return thread.status === 0;
        });
        // Sort by date
        publicThreadList.sort((a, b) => {
            const ta = new Date(a.lastMessageSummary.createdTime);
            const tb = new Date(b.lastMessageSummary.createdTime);
            if (ta < tb) return 1;
            if (ta > tb) return -1;
            return 0;
        });

        const joinedThreadList = await AminoClient.getJoinedChats(this.props.ndcId, 0, 15);
        // @ts-ignore
        this.setState({ threadList: publicThreadList, joinedThreadList });
        if (this.shouldUpdate)
            this.updateInterval = window.setTimeout(() => { this.updateLoop(); }, 3000);
    }

    private openThread(threadId) {
        this.props.changeScene("ThreadChat", { threadId });
    }

    public render() {
        // Scrollbar
        let classes = main;
        if (this.state.isHovering) classes += " " + mainHover;
        return (
            <div className={classes} onMouseEnter={() => { this.setState({ isHovering: true }); }} onMouseLeave={() => { this.setState({ isHovering: false }); }}>
                {this.state.joinedThreadList.map((thread) => {
                    return ([
                        <ThreadElement thread={thread} onClick={this.openThread.bind(this)} />
                    ]);
                })}
                {this.state.joinedThreadList.length > 0 ? <hr /> : null}
                {this.state.threadList.map((thread) => {
                    if (thread.membershipStatus < 1)
                        return ([
                            <ThreadElement thread={thread} onClick={this.openThread.bind(this)} />
                        ]);
                })}
            </div>
        );
    }
}