import { Component } from "inferno";
import { style } from "typestyle";

const classParagraph = style({

});

// [B] Bold
// [C] Center
// [I] Cursive | Italics
// [U] Underline
// [S] Strikeout

const classParagraphBold = style({
    fontWeight: "bold"
});
const classParagraphCenter = style({
    textAlign: "center"
});
const classParagraphCursive = style({
    fontStyle: "italic"
});
const classParagraphUnderline = style({
    borderBottom: "1px solid black"
});
const classParagraphStrikeout = style({
    textDecoration: "line-through"
});

export default class ParagraphBubble extends Component<any, any> {
    public render() {
        const modifiers: string[] = [];
        const match = /^\[([BCIUS]*)]/i.exec(this.props.children);
        if (match !== null) {
            if (match[0].toUpperCase().includes("B"))
                modifiers.push(classParagraphBold);
            if (match[0].toUpperCase().includes("C"))
                modifiers.push(classParagraphCenter);
            if (match[0].toUpperCase().includes("I"))
                modifiers.push(classParagraphCursive);
            if (match[0].toUpperCase().includes("U"))
                modifiers.push(classParagraphUnderline);
            if (match[0].toUpperCase().includes("S"))
                modifiers.push(classParagraphStrikeout);
        }
        this.props.children = this.props.children.replace(/^\[([BCIUS]+)] */i, "");
        return <p class={[classParagraph, ...modifiers].join(" ")}>{this.props.children}</p>;
    }
}