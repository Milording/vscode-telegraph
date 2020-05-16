'use strict';
import * as vscode from 'vscode';

export function getStringSetting(settingName: string) : string {
    let configurations = vscode.workspace.getConfiguration('telepost');
    let setting: string | undefined;

    if (configurations.has(settingName)) 
        setting = configurations.get(settingName);
    
    if(setting === null || setting === undefined) 
        return "";
    
    return setting;
}

export function updateStringSetting(name: string, value: string) {
    let configurations = vscode.workspace.getConfiguration('telepost');

    configurations.update(name, value, true);
}