// Via: https://github.com/npm/normalize-package-data/blob/main/lib/fixer.js
// License: BSD-2-Clause
// ---
// This package contains code originally written by Isaac Z. Schlueter.
// Used with permission.

// Copyright (c) Meryn Stol ("Author")
// All rights reserved.

// The BSD License

// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

// 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

// 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
// ---

function personToObject(person) {
	if (typeof person !== 'string') return person;

	var matchedName = person.match(/^([^(<]+)/);
	var matchedUrl = person.match(/\(([^()]+)\)/);
	var matchedEmail = person.match(/<([^<>]+)>/);
	var obj = {};
	if (matchedName && matchedName[0].trim()) obj.name = matchedName[0].trim();
	if (matchedEmail) obj.email = matchedEmail[1];
	if (matchedUrl) obj.url = matchedUrl[1];

	return obj;
}

const modifications = {
	author: ($) => personToObject($.author),
};

const packageJson = require('../../../package.json');

for (const [field, fn] of Object.entries(modifications)) {
	packageJson[field] = fn(packageJson);
}

module.exports = packageJson;
