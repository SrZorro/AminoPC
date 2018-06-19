
function generate_endpoints() {
    const PREFIX = "http://service.narvii.com/api/v1";
    const SECURE_WEBSOCKET = "https://ws3.narvii.com/";
    const GET_BLOG_POST = PREFIX + "/{0}/s/blog/{1}";
    return {
        // // ===[ AUTH ENDPOINTS ]===
        LOGIN: PREFIX + "/g/s/auth/login",
        REGISTER: PREFIX + "/g/s/auth/register",
        REGISTER_CHECK: PREFIX + "/g/s/auth/register-check",

        // // ===[ USER ENDPOINTS ]===
        AFFILIATIONS: PREFIX + "/g/s/account/affiliations?type=active",
        HEADLINES: PREFIX + "/g/s/feed/headlines?start={0}&size={1}",
        DEVICE_INFO: PREFIX + "/g/s/device",

        // // ===[ COMMUNITY ENDPOINTS ]===
        LINK_IDENTIFY: PREFIX + "/g/s/community/link-identify?q={0}",
        JOIN_COMMUNITY: PREFIX + "/{0}/s/community/join",
        LEAVE_COMMUNITY: PREFIX + "/{0}/s/community/leave",
        COMMUNITY_INFO: PREFIX + "/g/s-x{0}/community/info",
        SUGGESTED_COMMUNITIES: PREFIX + "/g/s/community/suggested?language={0}",
        TRENDING_COMMUNITIES: PREFIX + "/g/s/community/trending?start={0}&size={1}&language={2}",
        COMMUNITY_FEED: PREFIX + "/{0}/s/feed/blog-all?start={1}&size={2}",
        COMMUNITY_ONLINE_MEMBERS: PREFIX + "/{0}/s/community/online-members-check",
        SUGGESTED_KEYWORDS: PREFIX + "/g/s/community/search/suggested-keywords?q={0}&start={1}&size={2}&language={3}",
        SEARCH_TAGS: PREFIX + "/g/s/community/search/tags?q={0}",
        SEARCH_COMMUNITIES: PREFIX + "/g/s/community/search?q={0}&start={1}&size={2}&language={3}&completeKeyword={4}",
        JOINED_COMMUNITIES: PREFIX + "/g/s/community/joined?start={0}&size={1}",
        SUPPORTED_LANGUAGES: PREFIX + "/g/s/community-collection/supported-languages?start={0}&size={1}",
        COMMUNITY_COLLECTION_SECTIONS: PREFIX + "/g/s/community-collection/view/explore/sections?language={0}&start={1}&size={2}",
        COMMUNITY_CHECK_IN: PREFIX + "/x{0}/s/check-in",

        // // ===[ NOTIFICATION ENDPOINTS ]===
        COMMUNITY_NOTIFICATIONS: PREFIX + "/{0}/s/notification?start={1}&size={2}&cv={3}",
        REMINDERS: PREFIX + "/g/s/reminder/check?ndcIds={0}&timezone={1}",

        // // ===[ BLOG ENDPOINTS ]===
        GET_BLOG_POST,
        POST_VOTE: GET_BLOG_POST + "/vote",
        POST_COMMENT: GET_BLOG_POST + "/comment",

        // ===[ CHAT ENDPOINTS ]===
        COMMUNITY_THREAD: PREFIX + "/x{0}/s/chat/thread/{1}",
        COMMUNITY_CHAT_THREAD: PREFIX + "/x{0}/s/chat/thread?type={1}&start={2}&size={3}",
        COMMUNITY_JOIN_CHAT_THREAD: PREFIX + "/x{0}/s/chat/thread/{1}/member/{2}",
        COMMUNITY_CHAT_SEND_MESSAGE: PREFIX + "/x{0}/s/chat/thread/{1}/message",
        COMMUNITY_CHAT_GET_MESSAGES: PREFIX + "/x{0}/s/chat/thread/{1}/message?start={2}&size={3}",
        COMMUNITY_CHAT_GET_MESSAGES_SINCE: PREFIX + "/x{0}/s/chat/thread/{1}/message?start={2}&size={3}&starttime={4}",

        // ===[ LIVE LAYERS ]===
        LIVE_LAYERS_PUBLIC_CHAT: PREFIX + "/x{0}/s/live-layer/public-chats?start=0&size=25"
    };
}
export default generate_endpoints();