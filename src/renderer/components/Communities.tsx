import { Component } from "inferno";
import { style } from "typestyle";
import AminoClient from "aminoclient";

const main = style({
    width: "100%",
    height: "100%"
});

const communitiesContainer = style({
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around"

})
const communityBlock = style({
    width: "200px",
    height: "0",
    paddingBottom: "450px",
    backgroundColor: "purple"
})

interface ICommunitiesProps {
    onEnter: () => void;
}

export default class Communities extends Component<any, any> {
    constructor(props: ICommunitiesProps, context) {
        super(props, context);
        this.state = { communityList: [] };
        AminoClient.getJoinedCommunities(0, 10).then(joinedComs => {
            console.log(joinedComs);
            console.log(this.setState);
            this.setState({ communityList: joinedComs.communityList });
        })
    }

    public render() {
        const communities: Element[] = [];
        if (this.state.communityList.length === 0)
            communities.push(<h1 style={{ color: "white" }}>Loading...</h1>);

        for (const community of this.state.communityList) {
            communities.push(<div class={communityBlock}></div>)
        }

        return (
            <div class={main}>
                <div class={communitiesContainer}>
                    {communities}
                </div>
            </div>
        );
    }
}