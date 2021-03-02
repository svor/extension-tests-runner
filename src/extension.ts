import * as vscode from 'vscode';
import * as path from 'path';
import * as Mocha from 'mocha';
import * as glob from 'glob';
const testReporter = require('./test-reporter');

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('extension.runTests', () => {
		runTests();
	});

	runTests();

	context.subscriptions.push(disposable);
}

export function runTests() {
    const mocha = new Mocha({
        ui: 'tdd',
        timeout: 60000,
        reporter: testReporter
    });
    mocha.useColors(true);

    mocha.suite.on('require', function (global, file) {
        delete require.cache[file];
    });

    const e = (c: any) => console.log(c);

    console.log('--------------------------------');
    const extension = <vscode.Extension<any>>vscode.extensions.getExtension('redhat-developer.test-runner');
    console.log('ExtensionID::: ' + extension.id);
    console.log('ExtensionID2::: ' + extension.isActive);
    console.log('--------------------------------');
    

    glob('*/!(node_modules)/**/*.test.js', { cwd: '/projects' }, (err, files) => {
        if (err) {
            return e(err);
        }

        console.log("Found: ");
        console.log(files);

        // Add files to the test suite
        files.forEach(f => mocha.addFile(path.resolve('/projects', f)));

        try {
            // Run the mocha test
            mocha.run((failures: any) => {
                vscode.window.showInformationMessage('Tests completed! See results in test.log file');
                const resultFile = path.resolve('/projects', 'test.log');
                vscode.commands.executeCommand('file-search.openFile', resultFile)
                if (failures > 0) {
                    e(new Error(`${failures} tests failed.`));
                }
            });
        } catch (err) {
            e(err);
        }
    });
}
