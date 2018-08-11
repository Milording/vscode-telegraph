export class Node {
    tag: string;
    children: string[];

    constructor(tag: string, children: string[]) {
        this.tag = tag;
        this.children = children;
    }
}