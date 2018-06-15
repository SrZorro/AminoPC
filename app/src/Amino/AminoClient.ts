// import fetch from "node-fetch";
import Endpoints from "./Endpoints";
import { v4 as UUID } from "uuid";
import * as AminoTypes from "./AminoTypes";

type headers = { [key: string]: string };

declare global {
    interface String {
        format(...replacer: string[]): string;
    }
}
String.prototype.format = function () {
    var a = this;
    for (var k in arguments) {
        a = a.replace(new RegExp("\\{" + k + "\\}", 'g'), arguments[k]);
    }
    return a
}

class AminoClient {
    private sid: string;
    private email: string;
    private password: string;
    private deviceId: string;
    public isLogged: boolean;
    public onLogged: Function[];
    public uid: string;
    constructor(email: string, password: string, deviceId: string) {
        this.email = email;
        this.password = password;
        this.deviceId = deviceId;
        this.isLogged = false;
        this.onLogged = [];
    }

    public async login() {
        const body = {
            email: this.email,
            secret: `0 ${this.password}`,
            deviceID: this.deviceId,
            clientType: 100,
            action: "normal",
            timestamp: Math.round((new Date).getTime() / 1000)
        }

        const result = await this.post(Endpoints.LOGIN, body, {
            "NDCDEVICEID": this.deviceId,
            "NDC-MSG-SIG": this.getMessageSignature()
        });

        const statusCode = result["api:statuscode"];

        if (statusCode == 214)
            throw Error("Invalid Password");

        if (statusCode == 200)
            throw Error("Incorrect Login");

        this.sid = result.sid;
        this.uid = result.account.uid;

        this.isLogged = true;
        this.onLogged.map((onLogged) => {
            onLogged();
        })
        return;
    }

    public async getCommunityCollectionSections(language_code: string, start: number, size: number): Promise<any> {
        return await this.get(Endpoints.COMMUNITY_COLLECTION_SECTIONS.format(language_code, start.toString(), size.toString()));
    }

    public async getJoinedCommunities(start: number, size: number): Promise<AminoTypes.JoinedCommunitiesInfo> {
        return await this.get(Endpoints.JOINED_COMMUNITIES.format(start.toString(), size.toString()));
    }

    public async getPublicChats(ndcId: number, start: number, size: number): Promise<AminoTypes.AminoThread[]> {
        const response = await this.get(Endpoints.LIVE_LAYERS_PUBLIC_CHAT.format(ndcId.toString(), start.toString(), size.toString()));
        return response.threadList;
    }

    public async getJoinedChats(ndcId: number, start: number, size: number): Promise<AminoTypes.AminoThread[]> {
        return await this.get(Endpoints.COMMUNITY_CHAT_THREAD.format(ndcId.toString(), "joined-me", start.toString(), size.toString()));
    }

    public async getThreadMessages(ndcId: number, threadId: string, start: number, size: number, startTime?: string): Promise<AminoTypes.AminoMessage[]> {
        let url = "";
        if (startTime === undefined) {
            url = Endpoints.COMMUNITY_CHAT_GET_MESSAGES.format(ndcId.toString(), threadId, start.toString(), size.toString());
        } else {
            url = Endpoints.COMMUNITY_CHAT_GET_MESSAGES_SINCE.format(ndcId.toString(), threadId, start.toString(), size.toString(), startTime);
        }
        const result = await this.get(url);
        return result.messageList;
    }

    public async sendMessageInThread(ndcId: number, threadId: string, content: string): Promise<AminoTypes.AminoMessage> {
        const msg = await this.post(Endpoints.COMMUNITY_CHAT_SEND_MESSAGE.format(ndcId.toString(), threadId), {
            attachedObject: null,
            content: content,
            type: 0,
            clientRefId: Math.round((new Date).getTime() / 1000),
            timestamp: Math.round((new Date).getTime() / 1000)
        }, {
                "NDCDEVICEID": this.deviceId,
                "NDCAUTH": `sid=${this.sid}`,
                "NDC-MSG-SIG": this.getMessageSignature()
            })
        return msg;
    }

    public async sendMediaInThread(ndcId: number, threadId: string, mediaB64: string, mediaType: "jpg" | "gif" | "audio"): Promise<AminoTypes.AminoMessage> {
        const body = {
            type: mediaType === "audio" ? 2 : 0,
            clientRefId: Math.round((new Date).getTime() / 1000),
            mediaType: mediaType === "audio" ? 110 : 100,
            content: null,
            mediaUploadValue: mediaB64,
            attachedObject: null,
            timestamp: Math.round((new Date).getTime() / 1000)
        };
        if (mediaType === "jpg" || mediaType === "gif") {
            //@ts-ignore
            body.mediaUhqEnabled = false; //High quality maybe? 
            //@ts-ignore
            body.mediaUploadValueContentType = `image/${mediaType}`;
        }

        const msg = await this.post(Endpoints.COMMUNITY_CHAT_SEND_MESSAGE.format(ndcId.toString(), threadId), body, {
            "NDCDEVICEID": this.deviceId,
            "NDCAUTH": `sid=${this.sid}`
        })
        return msg;
    }

    private async get(url: string) {
        const headers: headers = {
            "NDCDEVICEID": this.deviceId,
            "NDCAUTH": `sid=${this.sid}`,
            "NDC-MSG-SIG": this.getMessageSignature(),
            "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 7.1.2; MotoG3-TE Build/NJH47F; com.narvii.amino.master/1.8.15305)",
            "Upgrade": "websocket",
            "Connection": "Upgrade",
            "Sec-WebSocket-Key": "86iFBnuI8GWLlgWmSToY6g==",
            "Sec-WebSocket-Version": "13",
            "Accept-Encoding": "gzip"
        }
        const response = await fetch(url, { method: "GET", headers });
        return await response.json();
    }

    private async post(url: string, body: object, headers?: headers) {
        const default_headers: headers = {
            "NDCDEVICEID": this.deviceId,
            "NDCAUTH": `sid=${this.sid}`
        }
        const response = await fetch(url, { method: "POST", headers: headers ? headers : default_headers, body: JSON.stringify(body) });
        const json = await response.json();
        return { ...json, response };
    }

    private getMessageSignature() {
        return UUID().replace("-", "").toUpperCase().substring(0, 27);
    }
}

export default AminoClient;