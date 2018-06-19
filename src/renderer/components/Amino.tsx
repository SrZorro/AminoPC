import AminoClient from "../Amino";
import { Component } from "inferno";
import Threads from "./Threads";
import ThreadChat from "./ThreadChat";
import Login from "./Login";

const style = {
    width: "100%",
    height: "100%",
    backgroundColor: "#171814"
};

export default class Amino extends Component<any, any> {
    constructor(props, context) {
        super(props, context);
        this.state = { ndcId: null, threadId: null, scene: "login" };
    }

    private async onLogged() {
        console.log("Logged, Requesting joined coms");
        const joinedComs = await AminoClient.getJoinedCommunities(0, 10);
        this.setState({
            scene: "ThreadList",
            ndcId: joinedComs.communityList[0].ndcId
        });
    }

    public changeScene(scene, args) {
        this.setState({ scene, ...args });
    }

    public render() {
        let display = <div style={{ color: "white", fontSize: "2em" }}>Loading...</div>;

        if (this.state.scene === "login") {
            display = <Login onLogged={this.onLogged.bind(this)} />
        }

        if (this.state.scene === "ThreadList" && this.state.ndcId !== null) {
            display = <Threads ndcId={this.state.ndcId} changeScene={this.changeScene.bind(this)} />
        }

        if (this.state.scene === "ThreadChat" && this.state.threadId !== null) {
            display = <ThreadChat ndcId={this.state.ndcId} threadId={this.state.threadId} changeScene={this.changeScene.bind(this)} />;
        }

        return (
            <div style={style}>
                {display}
            </div>
        );
    }
}