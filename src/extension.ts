'use strict';
import * as vscode from 'vscode';

const open = require('opn');
const Telegraph = require('telegra.ph');

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.telepost', () => {
        openTelegraph();
    });

    context.subscriptions.push(disposable);
}

function openTelegraph() {
    const client = new Telegraph();

    let editor = vscode.window.activeTextEditor as vscode.TextEditor;
    var textOfFile = editor.document.getText();
    
    let shortName = "Васек";
    let name = "Василий";
    let url = "http://google.com";
    client.createAccount(shortName, name, url).then((account:any)=> {
        client.token = account.access_token;
        let title = "Название";
        let content = [new Node("p", [textOfFile])];
        let authorName = "Создатель";
        let authorUrl = "http://google.com";
        let returnContent = false;

        return client.createPage(title, content, authorName, authorUrl, returnContent);
    }).then(async (page:any) => {  
        open(page.url);
    });
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