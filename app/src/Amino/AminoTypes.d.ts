

export interface JoinedCommunitiesInfo {
    communityList: AminoCommunity[],
    userInfoInCommunities: { [key: string]: UserProfile }
}

export interface UserProfile {
    status: number,
    itemsCount: number,
    consecutiveCheckInDays?: string,
    uid: string,
    modifiedTime: any,
    joinedCount: any,
    longitude: number,
    race?: string,
    address: string,
    membersCount: number,
    nickname: string,
    mediaList: any,
    icon: string,
    mood?: string,
    level: number,
    gender?: string,
    settings: any,
    pushEnabled: Boolean,
    membershipStatus: number,
    content?: string,
    reputation: number,
    role: number,
    latitude: number,
    extensions: any,
    blogsCount: number
}

export interface AminoCommunity {
    status: number,
    launchPage: object,
    endpoint: string,
    name: string,
    modifiedTime: string,
    communityHeat: number,
    tagline: string,
    templateId: number,
    agent: object,
    joinType: number,
    link: string,
    listedStatus: number,
    themePack: object,
    ndcId: number,
    createdTime: string,
    probationStatus: number,
    membersCount: number,
    primaryLanguage: string,
    promotionalMediaList: any[],
    icon: string
}

export interface AminoThread {
    uid: string,
    membersQuota: number,
    membersSummary: MiniUserProfile[],
    threadId: string,
    keywords: string,
    membersCount: number,
    title: string,
    membershipStatus: number,
    content: string,
    latitude?: number,
    alertOption: number,
    lastReadTime?: Date,
    type: number,
    status: number,
    modifiedTime?: Date,
    lastMessageSummary?: any,
    condition: number,
    icon: string,
    latestActivityTime?: Date,
    longitude?: number,
    extensions?: any,
    createdTime?: Date
}

export interface MiniUserProfile {
    status: number,
    uid: string,
    level: number,
    onlineStatus: number,
    reputation: number,
    role: number,
    nickname: string,
    icon: string
}

export interface PublicChats {
    threadList: AminoThread[],
    recommendedThreadList: AminoThread[]
}

export interface AminoMessage {
    author: MiniUserProfile,
    threadId: string,
    mediaType: number,
    content: string,
    mediaValue?: string,
    clientRefId: string,
    messageId: string,
    createdTime: Date,
    type: number
}