'use strict';
import * as vscode from 'vscode';
import { Node } from './Models/Node';
import * as configuration from './settings/settingsManager';
import * as talker from './talker';
import * as configConstants from './settings/settingsContants';

const open = require('opn');
const Telegraph = require('telegra.ph');

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push( vscode.commands.registerCommand('extension.telepost', async () => { await launchTelepost(); }));
    context.subscriptions.push(
        vscode.commands.registerCommand(
            'extension.telepost.setAuthor', 
            async () => {
                let authorName = await talker.askAuthorName();
                configuration.updateStringSetting(configConstants.authorNameSettingsKey, authorName);
            }));
    context.subscriptions.push(
        vscode.commands.registerCommand(
            'extension.telepost.setAuthorUrl',
             async () => {
                let authorName = await talker.askAuthorUrl();
                configuration.updateStringSetting(configConstants.authorUrlSettingsKey, authorName);
             }));
}

async function launchTelepost() {
    let authorName = await configuration.getStringSetting(configConstants.authorNameSettingsKey);
    if(authorName===undefined) {
        await askAndUpdateAuthorName();
    }

    openTelegraph();
}

async function askAndUpdateAuthorName() {
    let authorName = await talker.askAuthorName();
    configuration.updateStringSetting(configConstants.authorNameSettingsKey, authorName)
}

function openTelegraph() {
    const client = new Telegraph();

    let editor = vscode.window.activeTextEditor as vscode.TextEditor;
    var textOfFile = editor.document.getText();

    let shortName = "VS";
    let name = "Extension";
    let url = "https://github.com/Milording/vscode-telegraph";
    client.createAccount(shortName, name, url).then(async (account: any) => {
        client.token = account.access_token;
        let content = [new Node("p", [textOfFile])];
        let authorUrl = configuration.getStringSetting(configConstants.authorUrlSettingsKey);
        let returnContent = false;

        const pageTitle = await talker.askPageTitle();
        let authorName = await configuration.getStringSetting(configConstants.authorNameSettingsKey);

        return client.createPage(pageTitle, content, authorName, authorUrl, returnContent);
    }).then(async (page: any) => {
        open(page.url);
    });
}

export function deactivate() {
}
