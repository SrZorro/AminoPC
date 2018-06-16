import AminoClient from "../Amino";
import * as fs from "fs";
import { Component } from "inferno";
import { style } from "typestyle";

const classFileDrop = style({
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    pointerEvents: "none",
    width: "100%",
    height: "100%",
    position: "absolute",
    opacity: 0,
    transition: ".15s linear",
    color: "#91E225"
});

const classFileDropContainer = style({
    backgroundColor: "#171814",
    boxShadow: "0px 0px 8px 3px black",
    width: "80%",
    height: "50%",
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    margin: "auto auto auto auto",
    padding: 15,
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
});

const classKeypad = style({
    display: "flex",
    justifyContent: "flex-end",
    width: "100%"
})

const classBtn = style({
    cursor: "pointer",
    border: "none",
    color: "#91E225",
    backgroundColor: "transparent",
    fontSize: "1.5em",
    padding: 10,
    margin: 5,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    $nest: {
        "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.15)"
        }
    }
})

interface IFileDropProps {
    observeDrop: string,
    ndcId: number,
    threadId: string
}

interface IFile {
    lastModified: number,
    lastModifiedDate: Date,
    name: string,
    path: string,
    size: number,
    type: string
}
export default class FileDrop extends Component<any, any> {
    constructor(props: IFileDropProps, context) {
        super(props, context);
        this.state = { scene: "waiting_input", file: null };
    }

    private fileDrop(evt: any) {
        if (evt.type === "dragover")
            this.displayDropScreen(true);
        if (evt.type === "dragleave")
            this.displayDropScreen(false);

        if (evt.type === "drop") {
            const file: IFile = evt.dataTransfer.files[0];

            if (["image/jpeg", "image/png", "image/gif", "audio/mp3", "audio/aac"].includes(file.type)) {
                this.setState({ scene: "file_droped", file })
            } else {
                this.setState({ scene: "file_failed", file })
            }
        }
    }

    private displayDropScreen(show: boolean) {
        const fileDropElement = document.getElementsByClassName(classFileDrop)[0] as HTMLElement;
        const fileDropContainerElement = document.getElementsByClassName(classFileDropContainer)[0] as HTMLElement;
        if (show) {
            fileDropElement.style.opacity = "1";
        } else {
            fileDropElement.style.opacity = "0";
            fileDropContainerElement.style.pointerEvents = "none";
            this.setState({ scene: "waiting_input" })
        }
    }

    public componentDidMount() {
        document.getElementsByClassName(this.props.observeDrop)[0].addEventListener("dragover", this.fileDrop.bind(this));
        document.getElementsByClassName(this.props.observeDrop)[0].addEventListener("drop", this.fileDrop.bind(this));
        document.getElementsByClassName(this.props.observeDrop)[0].addEventListener("dragleave", this.fileDrop.bind(this));
    }
    public componentWillUnmount() {
        document.getElementsByClassName(this.props.observeDrop)[0].removeEventListener("dragover", this.fileDrop.bind(this));
        document.getElementsByClassName(this.props.observeDrop)[0].removeEventListener("drop", this.fileDrop.bind(this));
        document.getElementsByClassName(this.props.observeDrop)[0].removeEventListener("dragleave", this.fileDrop.bind(this));
    }

    private async sendMedia(cb: Function) {
        const file = this.state.file as IFile;
        const bitmap = fs.readFileSync(file.path);
        const b64 = new Buffer(bitmap).toString("base64");
        this.setState({ scene: "sending" })
        console.log("sending...");
        await AminoClient.sendMediaInThread(this.props.ndcId, this.props.threadId, b64, file.type);
        console.log("Done");
        cb();
    }

    public render() {
        const content: Element[] = [];
        const vTypes: string = "Valid types: audio/mp3, audio/aac, image/gif, image/png, image/jpg";
        const fileDropContainerElement = document.getElementsByClassName(classFileDropContainer)[0] as HTMLElement;
        let btnSend = false;
        let btnCancel = false;
        switch (this.state.scene) {
            case "waiting_input":
                content.push(<h1>Drag and drop files here to send it.</h1>);
                content.push(<br />)
                content.push(<h3>{vTypes}</h3>);
                break;
            case "file_droped": {
                fileDropContainerElement.style.pointerEvents = "all";
                const file = this.state.file as IFile;
                if (file.type.includes("audio")) {
                    content.push(<audio controls><source src={file.path} type={file.type} /></audio>);
                } else {
                    content.push(<img style={{ width: "100%" }} src={file.path} />);
                }
                btnSend = true;
                btnCancel = true;
            }
                break;
            case "file_failed":
                fileDropContainerElement.style.pointerEvents = "all";
                content.push(<h1>Sorry! I don't know that file type.</h1>)
                content.push(<br />)
                content.push(<h3>{vTypes}</h3>);
                btnCancel = true;
                break;
            case "sending": {
                fileDropContainerElement.style.pointerEvents = "none";
                const file = this.state.file as IFile;
                if (file.type.includes("audio")) {
                    content.push(<audio controls><source src={file.path} type={file.type} /></audio>);
                } else {
                    content.push(<img style={{ width: "100%" }} src={file.path} />);
                }
                content.push(<br />);
                content.push(<p>Sending media... Please wait.</p>)
            }
                break;
            default:
                this.displayDropScreen(false);
        }

        return (<div class={classFileDrop}>
            <div class={classFileDropContainer}>
                {content}
                {btnSend || btnCancel ? <div class={classKeypad}>
                    {btnCancel ? <button class={classBtn} onclick={this.displayDropScreen.bind(this, false)}>Cancel</button> : null}
                    {btnSend ? <button class={classBtn} onclick={this.sendMedia.bind(this, this.displayDropScreen.bind(this, false))}>Send</button> : null}
                </div> : null}
            </div>
        </div>);
    }
}