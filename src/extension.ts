import * as vscode from 'vscode';
import * as path from 'path';
import * as url from 'url';
import * as Mocha from 'mocha';
import * as glob from 'glob';
import { StreamLogReporter } from './test-reporter';

export function activate(context: vscode.ExtensionContext) {
    const disposable1 = vscode.commands.registerCommand('extension.runTests1', () => {
        // run tests from /projects
        vscode.window.showOpenDialog({ canSelectMany: false, canSelectFiles: false, canSelectFolders: true }).then(uris => {
            if (uris) {
                runTests(uris[0].fsPath);
            }
        });
    });

    const disposable2 = vscode.commands.registerCommand('extension.runTests2', () => {
        // run tests from /tmp/vscode-unpacked
        runTests(__dirname);
    });

    context.subscriptions.push(disposable1, disposable2);
}

export function runTests(cwd: string) {
    const outFile= path.resolve(cwd, 'test.log');
    const mocha = new Mocha({
        ui: 'tdd',
        timeout: 60000,
        reporter: StreamLogReporter,
        reporterOptions: { outFile: outFile}
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
            mocha.addFile(p);
        });

        try {
            // Run the mocha test
            mocha.run((failures: any) => {
                vscode.window.showInformationMessage('Tests completed! See results in test.log file');
                vscode.commands.executeCommand('vscode.open', vscode.Uri.file(outFile));
                if (failures > 0) {
                    e(new Error(`${failures} tests failed.`));
                }
            });
        } catch (err) {
            e(err);
        }
    });
}
