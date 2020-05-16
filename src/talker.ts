import * as vscode from 'vscode';
import * as configuration from "./settings/settingsManager";
import * as configConstants from "./settings/settingsContants";

export async function askAuthorName() {
    let authorName = configuration.getStringSetting(configConstants.authorNameSettingsKey);
    
    let authorNameInputBoxOptions: vscode.InputBoxOptions = {
        prompt: 'Input an author name.',
        placeHolder: 'Author name',
        value: authorName === null ? "Anonymous" : authorName,
        valueSelection: undefined
    };

    authorName = await askUser(authorNameInputBoxOptions);
    configuration.updateStringSetting(configConstants.authorNameSettingsKey, authorName);
    
    return authorName;
}

export async function askAuthorUrl() : Promise<string> {
    let authorNameInputBoxOptions: vscode.InputBoxOptions = {
        prompt: 'Input an author URL.',
        placeHolder: 'Author URL',
        value: 'http://',
        valueSelection: undefined
    };

    let authorUrl = await askUser(authorNameInputBoxOptions);
    configuration.updateStringSetting(configConstants.authorUrlSettingsKey, authorUrl);

    return authorUrl;
}

async function askUser(inputBoxOptions: vscode.InputBoxOptions) : Promise<string> {
    let answer = await vscode.window.showInputBox(inputBoxOptions);
        if(answer === undefined)
            answer = "";
        
    return answer;
}

export async function askPageTitle() {
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