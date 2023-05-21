// Via: https://github.com/ryanccn/ryanccn.dev/blob/827b12321ea7d606593d2d2a3cfabe8e9a5bc7b3/src/_data/gitRev.js
// License: MIT
module.exports = async () => {
	const { execa } = await import('execa');
	return await execa('git', ['rev-parse', '--short', 'HEAD']).then(
		(a) => a.stdout,
	);
};