'use strict';
import * as vscode from 'vscode';

const open = require('opn');
const Telegraph = require('telegra.ph');

export function activate(context: vscode.ExtensionContext) {

    console.log('Congratulations, your extension "telegraph-poster" is now active!');
    
    const client = new Telegraph();

    let shortName = "Васек";
    let name = "Василий";
    let url = "http://google.com";
    client.createAccount(shortName, name, url).then((account:any)=> {
        client.token = account.access_token;
        let title = "Название";
        let content = [new Node("p", ["Hello"])];
        let authorName = "Создатель";
        let authorUrl = "http://google.com";
        let returnContent = false;

        return client.createPage(title, content, authorName, authorUrl, returnContent);
    }).then((page:any) => open(page["url"]));

    let disposable = vscode.commands.registerCommand('extension.sayHello', () => {
        vscode.window.showInformationMessage('Hello World!');
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
}

class Node {
    tag:string;
    children:string[];

    constructor(tag: string, children: string[]) {
        this.tag = tag;
        this.children = children; 
    }
}