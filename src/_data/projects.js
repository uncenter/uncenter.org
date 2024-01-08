const YAML = require('yaml');
const EleventyFetch = require('@11ty/eleventy-fetch');

const projects = {
	maintained: [
		{
			name: 'uncenter.dev',
			link: 'https://github.com/uncenter/uncenter.dev',
			featured: true,
		},
		{
			name: 'octotree',
			link: 'https://github.com/uncenter/octotree',
			featured: true,
		},
		{
			name: 'npm-on-github',
			link: 'https://github.com/uncenter/npm-on-github',
			featured: true,
		},
		{
			name: 'eleventy-plugin-icons',
			link: 'https://github.com/uncenter/eleventy-plugin-icons',
			featured: true,
		},
		{
			name: 'create-eleventy-app',
			link: 'https://github.com/uncenter/create-eleventy-app',
		},
		{
			name: 'fn',
			link: 'https://github.com/uncenter/fn',
		},
		{
			name: 'tnl',
			link: 'https://github.com/uncenter/tnl',
		},
		{
			name: 'eleventy-plugin-validate',
			link: 'https://github.com/uncenter/eleventy-plugin-validate',
		},
		{
			name: 'gitsnippity',
			link: 'https://github.com/uncenter/gitsnippity',
		},
		{ name: 'xdirs', link: 'https://github.com/uncenter/xdirs' },
		{
			name: 'detect-formatting',
			link: 'https://github.com/uncenter/detect-formatting',
		},
		{
			name: 'detect-imports',
			link: 'https://github.com/uncenter/detect-imports',
		},
		{
			name: 'gh-stats',
			link: 'https://github.com/uncenter/gh-stats',
		},
		{
			name: 'dotfiles',
			link: 'https://github.com/uncenter/dotfiles',
		},
		{
			name: 'templates',
			link: 'https://github.com/uncenter/templates',
		},
		{
			name: 'discord-forum-bot',
			link: 'https://github.com/uncenter/discord-forum-bot',
		},
		{
			name: 'loogu',
			link: 'https://github.com/uncenter/loogu',
		},
		{
			name: 'mailtolink',
			link: 'https://github.com/uncenter/mailtolink',
		},
		{
			name: '@uncenter/quickbench',
			link: 'https://github.com/uncenter/quickbench',
		},
		{
			name: 'canvas-grade-calculator',
			link: 'https://github.com/uncenter/canvas-grade-calculator',
		},
		{
			name: 'markdown-it-kbd-better',
			link: 'https://github.com/uncenter/markdown-it-kbd-better',
		},
		{
			name: '@uncenter/eleventy-plugin-toc',
			link: 'https://github.com/uncenter/eleventy-plugin-toc',
		},
		{
			name: 'wifi-password',
			link: 'https://github.com/uncenter/wifi-password',
		},
	],
	archived: [
		{
			name: 'learn-eleventy',
			link: 'https://github.com/uncenter/learn-eleventy',
		},
		{
			name: 'phonetic-alphabet',
			link: 'https://github.com/uncenter/phonetic-alphabet',
		},
		{
			name: 'chemic',
			description:
				'A Python library, GUI, and CLI for chemical formulas and equations.',
			link: 'https://github.com/uncenter/chemic',
		},
	],
};

async function fetchRepository(username, repository, fetchOptions) {
	const response = await EleventyFetch(
		`https://api.github.com/repos/${username}/${repository}`,
		{
			duration: '12h',
			type: 'json',
			fetchOptions,
		},
	);
	return {
		description: response?.description || '',
		homepage: response?.homepage || false,
		language: response.language,
	};
}

async function getLanguageColors(languages) {
	const response = await EleventyFetch(
		'https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml',
		{
			duration: '90d',
			type: 'text',
		},
	);
	const data = YAML.parse(response);
	return Object.fromEntries(
		[...languages].map((language) => [language, data[language]?.color]),
	);
}

module.exports = async function () {
	const headers = {};
	if (process.env.GITHUB_TOKEN) {
		headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
	} else {
		console.warn('GITHUB_TOKEN environment variable is not set');
	}

	const languages = new Set();
	for (const category in projects) {
		for (const project of projects[category]) {
			let [username, repository] = new URL(project.link).pathname
				.slice(1)
				.split('/');

			const data = await fetchRepository(username, repository, {
				headers,
			});
			project.description = project.description || data.description;
			project.language = data.language;
			languages.add(data.language);
			if (data.homepage) project.live = data.homepage;
		}
	}
	const languagesWithColors = await getLanguageColors(languages);
	for (const category in projects) {
		for (const project of projects[category]) {
			project.color = languagesWithColors[project.language];
		}
	}
	return projects;
};
