'use strict';
import * as vscode from 'vscode';
import { Node } from './Models/Node';

const open = require('opn');
const Telegraph = require('telegra.ph');

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.telepost', async () => {
        
        let authorName = await getAuthorNameFromSettings();
        if(authorName===undefined){
            authorName = await askAuthorName();
            updateAuthorNameSettings(authorName);
        }

        openTelegraph();
    });

    context.subscriptions.push(disposable);
}

function openTelegraph() {
    const client = new Telegraph();

    let editor = vscode.window.activeTextEditor as vscode.TextEditor;
    var textOfFile = editor.document.getText();

    let shortName = "VsCode";
    let name = "Extension";
    let url = "https://github.com/Milording/vscode-telegraph";
    client.createAccount(shortName, name, url).then(async (account: any) => {
        client.token = account.access_token;
        let content = [new Node("p", [textOfFile])];
        let authorUrl = "http://google.com";
        let returnContent = false;

        const pageTitle = await askPageTitle();
        let authorName = await getAuthorNameFromSettings();

        return client.createPage(pageTitle, content, authorName, authorUrl, returnContent);
    }).then(async (page: any) => {
        open(page.url);
    });
}

async function askPageTitle() {
    let title: string | undefined;

    let titleInputBoxOptions: vscode.InputBoxOptions = {
        prompt: 'Please input the title.',
        placeHolder: 'Title',
        value: 'Untitled',
        valueSelection: undefined
    };
    title = await vscode.window.showInputBox(titleInputBoxOptions);

    return title;
}

async function askAuthorName() {
    let authorName: string | undefined;

    let authorNameInputBoxOptions: vscode.InputBoxOptions = {
        prompt: 'Please input an author name.',
        placeHolder: 'Author name',
        value: 'Anonymous',
        valueSelection: undefined
    };

    authorName = getAuthorNameFromSettings();
    if (getAuthorNameFromSettings() === undefined) {
        authorName = await vscode.window.showInputBox(authorNameInputBoxOptions);
        updateAuthorNameSettings(authorName);
    }

    return authorName;
}

function getAuthorNameFromSettings() {
    let configurations = vscode.workspace.getConfiguration('telepost');
    const authorNameSettingsKey = 'authorName';
    let authorName: string | undefined;

    if (configurations.has(authorNameSettingsKey)) {
        authorName = configurations.get('authorName');
    }
    return authorName;
}

function updateAuthorNameSettings(authorName: string | undefined) {
    let configurations = vscode.workspace.getConfiguration('telepost');
    const authorNameSettingsKey = 'authorName';

    configurations.update(authorNameSettingsKey, authorName);
}

export function deactivate() {
}
