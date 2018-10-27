'use strict';

const path = require('path');
const fs = require('fs');

exports.privateKey = fs.readFileSync(
	path.join(__dirname, './ssl/privkey1.pem')
).toString();
exports.certificate = fs.readFileSync(
	path.join(__dirname, './ssl/fullchain1.pem')
).toString();
