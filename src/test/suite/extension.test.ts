import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	console.log('--------------------------------');
    const extension = <vscode.Extension<any>>vscode.extensions.getExtension('redhat-developer.test-runner');
    console.log('ExtensionID::: ' + extension.id);
    console.log('ExtensionID2::: ' + extension.isActive);
    console.log('--------------------------------');

	test('Sample test', () => {
		assert.equal([1, 2, 3].indexOf(5), -1);
		assert.equal([1, 2, 3].indexOf(0), -1);
		assert.notEqual('a', 'a');
	});
});
