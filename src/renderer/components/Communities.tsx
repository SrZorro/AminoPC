import { Component } from "inferno";
import { style } from "typestyle";
import AminoClient from "aminoclient";
import AminoTypes from "aminoclient/dist/AminoTypes";

const main = style({
    width: "100%",
    height: "100%",
    overflowY: "auto"
});

const headerContainer = style({
    width: "100%",
    height: 150,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 15
});

const accountContainer = style({
    borderRadius: 5,
    width: "90%",
    height: "90%",
    backgroundColor: "rgba(0,0,0, 0.5)",
    display: "grid",
    gridTemplateColumns: "1fr 9fr 1fr",
    gridTemplateRows: "1fr 1fr .5fr",
    gridTemplateAreas:
        `"image nickname ."
         "image badge ."
         ". aminoplus coins"`
});

const accountIcon = style({
    gridArea: "image",
    height: "100%",
    padding: 10,
    boxSizing: "border-box",
    borderRadius: "100%"
});

const accountNickname = style({
    gridArea: "nickname",
    color: "white",
    alignSelf: "end"
});

const communitiesContainer = style({
    width: "100%",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, 150px)",
    gridTemplateRows: "repeat(auto-fit, 225px)",
    gridColumnGap: 24,
    gridRowGap: 27,
    justifyContent: "space-evenly",
    boxSizing: "border-box",
    padding: 24
});

const communityBlock = style({
    width: "150px",
    height: "225px",
    backgroundSize: "cover",
    backgroundPositionX: "center",
    cursor: "pointer",
    borderRadius: 7,
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gridTemplateRows: "1fr 2fr 1fr",
    gridTemplateAreas: `"badge . notifications" "title title title" "checkin checkin checkin"`
});

const badgeIcon = style({
    width: 70,
    height: 70,
    borderRadius: 15,
    backgroundSize: "cover",
    marginLeft: "-6px",
    marginTop: "-6px",
    backgroundPosition: "center center",
    gridArea: "badge",
    justifySelf: "start",
    alignSelf: "start"
});

const notifications = style({
    width: 36,
    height: 36,
    borderRadius: "100%",
    backgroundColor: "#DB143D",
    marginRight: "-6px",
    marginTop: "-6px",
    gridArea: "notifications",
    color: "white",
    textAlign: "center",
    verticalAlign: "middle",
    lineHeight: "36px",
    fontWeight: "bold",
    fontSize: "1.3em",
    justifySelf: "end",
    alignSelf: "start"
});

const communityTitle = style({
    fontSize: "1.2em",
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    textShadow: "-1px 0 rgba(0,0,0,0.5), 0 1px rgba(0,0,0,0.5), 1px 0 rgba(0,0,0,0.5), 0 -1px rgba(0,0,0,0.5)",
    gridArea: "title",
    justifySelf: "center",
    alignSelf: "center"
});

const checkIn = style({
    width: 180,
    height: 40,
    borderRadius: 5,
    backgroundColor: "#18D320",
    color: "white",
    textAlign: "center",
    verticalAlign: "middle",
    lineHeight: "40px",
    fontWeight: "bold",
    fontSize: "1.3em",
    gridArea: "checkin",
    justifySelf: "center",
    alignSelf: "center"
});

interface ICommunitiesProps {
    onEnter: (ndcId: number) => void;
    accountInfo: AminoTypes.IAminoAccount;
}

export default class Communities extends Component<any, any> {
    constructor(props: ICommunitiesProps, context) {
        super(props, context);
        this.state = { communityList: [] };
        AminoClient.getJoinedCommunities(0, 10).then((joinedComs) => {
            if (joinedComs.communityList.length === 1) return this.props.onEnter(joinedComs.communityList[0].ndcId);
            this.setState({ communityList: joinedComs.communityList });
        });
    }

    public render() {
        const accountInfo = this.props.accountInfo as AminoTypes.IAminoAccount;
        const communities: Element[] = [];
        if (this.state.communityList.length === 0)
            communities.push(<h1 style={{ color: "white" }}>Loading...</h1>);

        for (const community of this.state.communityList as AminoTypes.IAminoCommunity[]) {
            communities.push(<div class={communityBlock} style={{ backgroundImage: `url(${community.launchPage.mediaList[0][1]}` }} onclick={() => { this.props.onEnter(community.ndcId); }}>
                <div class={badgeIcon} style={{ backgroundImage: `url(${community.icon}` }} />{/*<div class={notifications}>5</div>*/}
                <div class={communityTitle}>{community.name}</div>
                {/* <div class={checkIn}>Check In</div> */}
            </div>);
        }

        return (
            <div class={main}>
                <div class={headerContainer}>
                    <div class={accountContainer}>
                        <img class={accountIcon} src={accountInfo.icon} />
                        <h1 class={accountNickname}>{accountInfo.nickname}</h1>
                    </div>
                </div>
                <div class={communitiesContainer}>
                    {communities}
                </div>
            </div>
        );
    }
}