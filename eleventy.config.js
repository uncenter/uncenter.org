import { collections, filters, shortcodes } from './config/11ty/index.js';

import pluginExternalLinks from '@aloskutov/eleventy-plugin-external-links';
import pluginRSS from '@11ty/eleventy-plugin-rss';
import pluginTOC from '@uncenter/eleventy-plugin-toc';
import pluginAutoCacheBuster from 'eleventy-auto-cache-buster';
import pluginIcons from 'eleventy-plugin-icons';
import pluginValidate from 'eleventy-plugin-validate';

import { eleventyImageTransformPlugin as pluginImageTransform } from '@11ty/eleventy-img';
import { VentoPlugin as pluginVento } from 'eleventy-plugin-vento';

import markdownLibrary from './config/markdown/core.js';
import {
	processCss,
	processSass,
	processTailwindCss,
} from './config/transforms/css.js';
import { minifyHtml } from './config/transforms/html.js';

import { z } from 'zod';

import 'dotenv/config';
const isDevelopment = process.env.NODE_ENV !== 'production';

import eleventy from '11ty.ts';
import colors from 'picocolors';
import site from './site.config.js';

export default eleventy(function (eleventyConfig) {
	eleventyConfig.addGlobalData('site', site);
	eleventyConfig.addPlugin(shortcodes);
	eleventyConfig.addPlugin(collections);
	eleventyConfig.addPlugin(filters);

	/* Plugins */
	eleventyConfig.addPlugin(pluginTOC, {
		ul: true,
		wrapper: function (toc) {
			return toc;
		},
	});
	eleventyConfig.addPlugin(pluginExternalLinks, {
		url: site.author.url,
		rel: ['noreferrer'],
		overwrite: false,
		enableTarget: false,
	});
	eleventyConfig.addPlugin(pluginRSS);
	eleventyConfig.addPlugin(pluginAutoCacheBuster);
	eleventyConfig.addPlugin(pluginIcons, {
		mode: 'inline',
		sources: [
			{ name: 'si', path: 'node_modules/simple-icons/icons' },
			{ name: 'lucide', path: 'node_modules/lucide-static/icons' },
		],
		icon: {
			errorNotFound: false,
			class: function (name, source) {
				return `icon icon-${name} icon-${source}`;
			},
		},
	});
	eleventyConfig.addPlugin(pluginValidate, {
		validator: 'zod',
		schemas: [
			{
				collections: ['posts'],
				schema: z
					.object({
						tags: z.array(z.string()),
						title: z.string(),
						description: z.string(),
						date: z.date(),
						edited: z.date().optional(),
						comments: z.boolean(),
					})
					.strict(),
			},
		],
	});
	eleventyConfig.addPlugin(pluginVento);
	eleventyConfig.addPlugin(pluginImageTransform, {
		widths: [640, 750, 828, 1080, 1200, 1920, 2048, 3840, 'auto'],
		formats: ['avif', 'webp', 'png'],
		outputDir: 'dist/assets/images/',
		urlPath: '/assets/images/',
		htmlOptions: {
			imgAttributes: {
				loading: 'lazy',
				decoding: 'async',
			},
			pictureAttributes: {},
		},
	});

	/* Passthrough Copy */
	eleventyConfig.addPassthroughCopy({ 'public/': '.' });

	/* Other Config */
	eleventyConfig.addTransform('html', function (content) {
		if (this.page.outputPath && this.page.outputPath.endsWith('.html')) {
			return minifyHtml(content);
		}
		return content;
	});

	eleventyConfig.setLibrary('md', markdownLibrary);
	eleventyConfig.setQuietMode(isDevelopment);
	eleventyConfig.setServerOptions({
		port: process.env.PORT || 8080,
		portReassignmentRetryCount: 0,
	});

	eleventyConfig.addTemplateFormats('scss');
	eleventyConfig.addExtension('scss', {
		outputFileExtension: 'css',
		compile: async function (inputContent) {
			return async () => {
				return processCss(
					await processTailwindCss(await processSass(inputContent)),
				);
			};
		},
	});

	// Give me the localhost URL after every rebuild so I don't have to scroll up to find it.
	let notFirstRun = false;
	eleventyConfig.on('eleventy.after', async ({ runMode }) => {
		if (runMode === 'serve') {
			if (notFirstRun)
				console.log(colors.blue('\n[11ty] Server at http://localhost:8080/\n'));
			notFirstRun = true;
		}
	});

	return {
		dir: {
			input: 'src',
			output: 'dist',
			includes: 'components',
			layouts: 'layouts',
			data: '_data',
		},
		templateFormats: ['md', 'vto', '11ty.js'],
		markdownTemplateEngine: 'vto',
	};
});
