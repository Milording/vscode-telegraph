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

    let shortName = "Aldous";
    let name = "Huxley";
    let url = "http://google.com";
    client.createAccount(shortName, name, url).then(async(account: any) => {
        client.token = account.access_token;
        let title = "Point Counter Point";
        let content = [new Node("p", [textOfFile])];
        let authorUrl = "http://google.com";
        let returnContent = false;

        let usernameInputBoxOptions: vscode.InputBoxOptions = {
            prompt: 'Please input an author name.',
            placeHolder: 'Author name',
            value: 'Anonymous',
            valueSelection: undefined
        };

        let configurations = vscode.workspace.getConfiguration('telepost');
        let authorName : string | undefined;
        
        if(!configurations.has('authorName') 
        || configurations.get('authorName')===null) {
            authorName = await vscode.window.showInputBox(usernameInputBoxOptions);
            configurations.update('authorName', authorName);
        } else {
            authorName = configurations.get('authorName');
        }

        return client.createPage(title, content, authorName, authorUrl, returnContent);
    }).then(async (page: any) => {
        open(page.url);
    });
}

export function deactivate() {
}

class Node {
    tag: string;
    children: string[];

    constructor(tag: string, children: string[]) {
        this.tag = tag;
        this.children = children;
    }
}