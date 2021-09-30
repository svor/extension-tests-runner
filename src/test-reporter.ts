/*********************************************************************
 * Copyright (c) 2021 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import * as mocha from 'mocha';
import * as fs from 'fs';

export class StreamLogReporter extends mocha.reporters.Base {
    private passes = 0;
    private writeStream?: fs.WriteStream;

    constructor(runner: mocha.Runner, options: mocha.MochaOptions) {
        super(runner);

        runner.on('start', () => {
            this.writeStream = fs.createWriteStream(options.reporterOptions.outFile, {
                encoding: 'utf8',
                flags: 'w'
            });
        });

        runner.on('pass', (test: any) => {
            this.passes++;
            console.log('SUCCESS: %s', test.fullTitle());
            this.writeStream!.write('SUCCESS: ' + test.fullTitle() + '\n');
        });

        runner.on('fail', (test: any, err: any) => {
            console.log('FAILURE: %s -- error: %s', test.fullTitle(), err.message);
            this.writeStream!.write('FAILURE: ' + test.fullTitle() + ' -- error: ' + err.message + '\n');
        });

        runner.on('end', () => {
            if (this.failures.length > 0) {
                console.log('FINISH: %d/%d', this.passes, this.passes + this.failures.length);
                this.writeStream!.write(`TESTS FAILED: ${this.passes}/${this.passes + this.failures.length}\n`);
            } else {
                console.log('FINISH: %d/%d', this.passes, this.passes + this.failures.length);
                this.writeStream!.write(`TESTS PASSED: ${this.passes}/${this.passes + this.failures.length}\n`);
            }
            this.writeStream!.close();
        });
    }
}
