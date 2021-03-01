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
module.exports = StreamLogReporter;

var fs = require('fs');
var writeStream = fs.createWriteStream('/projects/test.log', {
    encoding: 'utf8',
    flags: 'w'
});

function StreamLogReporter(this: any, runner: any) {
    mocha.reporters.Base.call(this, runner);
    var passes = 0;
    var failures = 0;

    runner.on('pass', function(test: any) {
        passes++;
        console.log('SUCCESS: %s', test.fullTitle());
        writeStream.write('SUCCESS: ' + test.fullTitle() + '\n');
    });

    runner.on('fail', function(test: any, err: any) {
        failures++;
        console.log('FAILURE: %s -- error: %s', test.fullTitle(), err.message);
        writeStream.write('FAILURE: ' + test.fullTitle() + ' -- error: ' + err.message + '\n');
    });

    runner.on('end', function() {
        if (failures > 0) {
            console.log('FINISH: %d/%d', passes, passes + failures);
            writeStream.write(`TESTS FAILED: ${passes}/${passes + failures}\n`);
        } else {
            console.log('FINISH: %d/%d', passes, passes + failures);
            writeStream.write(`TESTS PASSED: ${passes}/${passes + failures}\n`);
        }
    });
}
