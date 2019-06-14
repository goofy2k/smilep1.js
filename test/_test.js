/* This Source Code Form is subject to the terms of the Mozilla Public
	License, v. 2.0. If a copy of the MPL was not distributed with this
	file, You can obtain one at http://mozilla.org/MPL/2.0/.

	Copyright 2016 - 2019, Robin de Gruijter <gruijter@hotmail.com> */

// INSTRUCTIONS FOR TESTING FROM DESKTOP:
// install node (https://nodejs.org)
// install this package: > npm i smilep1
// run the test: > npm test id=yourSmileID

'use strict';

const os = require('os');
const SmileSession = require('../smilep1.js');
const { version } = require('../package.json');
// const util = require('util');

let log = [];
let errorCount = 0;
let t0 = Date.now();
const smile = new SmileSession();

// function to setup the router session
async function setupSession(opts) {
	try {
		log.push('========== STARTING TEST ==========');
		log.push(`Node version: ${process.version}`);
		log.push(`Youless package version: ${version}`);
		log.push(`OS: ${os.platform()} ${os.release()}`);
		Object.keys(opts).forEach((opt) => {
			smile[opt] = opts[opt];
		});
		t0 = Date.now();
		errorCount = 0;
		log.push('t = 0');
	}	catch (error) {
		log.push(error);
		log.push(smile);
	}
}

// function logError(error) {
// 	log.push(error);
// 	const lastResponse = { lastResponse: smile.lastResponse };
// 	log.push(lastResponse);
// 	errorCount += 1;
// 	return {};
// }

async function doTest() {
	try {

		// for other methods you first need to be logged in.
		log.push('trying to login...');
		const status = await smile.login();
		log.push(status);
		log.push(`t = ${(Date.now() - t0) / 1000}`);

		// get meter readings
		log.push('trying to get meter readings');
		const readings = await smile.getMeterReadings()
			.catch((error) => {
				log.push(error.message);
				errorCount += 1;
			});
		log.push(readings);
		log.push(`t = ${(Date.now() - t0) / 1000}`);

		// finish test
		smile.lastResponse = '';
		log.push(smile);
		// log.push(`t = ${(Date.now() - t0) / 1000}`);
		if (errorCount) {
			log.push(`test finished with ${errorCount} errors`);
		} else {
			log.push('test finished without errors :)');
		}

	}	catch (error) {
		log.push(error);
		log.push(smile);
	}
}

exports.test = async (opts) => {
	log = [];	// empty the log
	try {
		await setupSession(opts);
		await doTest();
		return Promise.resolve(log);
	}	catch (error) {
		return Promise.resolve(log);
	}
};
