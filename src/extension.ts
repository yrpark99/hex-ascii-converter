// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('extension "hex-ascii-converter" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable1 = vscode.commands.registerCommand('extension.convertAsciiToHex', () => {
		// The code you place here will be executed every time your command is executed

		// Get the active text editor
		let editor = vscode.window.activeTextEditor;

		if (editor) {
			let document = editor.document;
			let selection = editor.selection;

			// Get the word within the selection
			let ascii = document.getText(selection);
			let hex = asciiToHex(ascii);
			editor.edit(editBuilder => {
				editBuilder.replace(selection, hex);
			});
		}
	});

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable2 = vscode.commands.registerCommand('extension.convertHexToAscii', () => {
		// The code you place here will be executed every time your command is executed

		// Get the active text editor
		let editor = vscode.window.activeTextEditor;

		if (editor) {
			let document = editor.document;
			let selection = editor.selection;

			// Get the word within the selection
			let hex = document.getText(selection);
			if (hex.length > 0) {
				let ascii = hexToAscii(hex);
				if (ascii.length == 0) {
					vscode.window.showErrorMessage('Hex string format is wrong.');
				}
				else {
					editor.edit(editBuilder => {
						editBuilder.replace(selection, ascii);
					});
				}
			}
		}
	});

	context.subscriptions.push(disposable1);
	context.subscriptions.push(disposable2);
}

// this method is called when your extension is deactivated
export function deactivate() {}

// Convert input ascii string to hex string
function asciiToHex(ascii: string): string {
	console.log('input ascii:', ascii);

	var hex = '';
	for (var i = 0; i < ascii.length; i++) {
		var tmp = "00" + ascii.charCodeAt(i).toString(16);
		hex += tmp.substr(tmp.length - 2).toUpperCase();
	}

	console.log('return hex:', hex);
	return hex;
}

// Check input string is correct hex string or not
function isCorrectHexStr(str: string): boolean {
	if (/^(\-|\+)?([0-9A-Fa-f]+|Infinity)$/.test(str)) {
		return true;
	}
	return false;
}

// Convert input hex string to ascii string
function hexToAscii(hex: string): string {
	console.log('input hex:', hex);

	var ascii = '';
	if (isCorrectHexStr(hex) == false) {
		return '';
	}
	for (var i = 0; i < hex.length; i += 2) {
		var subStr = hex.substr(i, 2).trim();
		if (subStr.length != 2) {
			return '';
		}
		var parsed = Number.parseInt(subStr, 16);
		if (Number.isNaN(parsed)) {
			return '';
		}
		ascii += String.fromCharCode(parsed);
	}

	console.log('return ascii:', ascii);
    return ascii;
}
