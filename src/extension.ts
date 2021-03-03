import * as vscode from 'vscode';
import * as path from 'path';
import * as Mocha from 'mocha';
import * as glob from 'glob';
const testReporter = require('./test-reporter');

export function activate(context: vscode.ExtensionContext) {
	const disposable1 = vscode.commands.registerCommand('extension.runTests1', () => {
        // run tests from /projects
		runTests('/projects');
	});

    const disposable2 = vscode.commands.registerCommand('extension.runTests2', () => {
        // run tests from /tmp/vscode-unpacked
        runTests('/tmp/vscode-unpacked');
	});

	runTests('/projects');

	context.subscriptions.push(disposable1, disposable2);
}

export function runTests(cwd: string) {
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
    
    glob('*/!(node_modules)/**/*.test.js', { cwd: cwd }, (err, files) => {
        if (err) {
            return e(err);
        }
        
        console.log("Found: ");
        console.log(files);
        
        // Add files to the test suite
        files.forEach(f => {
            const p = path.resolve(cwd, f); 
            console.log('Path is --- > ' + p);
            mocha.addFile(p)
        });

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
