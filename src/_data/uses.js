// @ts-check
// Credit to https://github.com/ryanccn/ryanccn.dev/blob/5b94e8fc428779880e6a727b85e64496dafdcee1/src/_data/uses.js#L352 for the structure.

import { z } from 'zod';

const tags = z.union([
	z.literal('open-source'),
	z.literal('freemium'),
	z.literal('paid'),
]);

const schema = z.record(
	z.record(
		z.array(
			z
				.object({
					name: z.string().min(1),
					description: z.string().min(1),
					url: z.string().url(),
					tags: z.array(tags).default([]).optional(),
					since: z
						.string()
						.regex(/\d\d\d\d-\d\d-\d\d/)
						.optional(),

					accessories: z
						.array(
							z
								.object({
									name: z.string().min(1),
									url: z.string().url(),
								})
								.strict(),
						)
						.optional(),
				})
				.strict(),
		),
	),
);

/** @type {z.infer<typeof schema>} */
const data = {
	Apps: {
		'General': [
			{
				name: '1Password',
				url: 'https://1password.com/',
				description: 'for password management',
				tags: ['paid'],
			},
			{
				name: 'Arc',
				url: 'https://arc.net/',
				description: 'for browsing the web',
			},
			{
				name: 'Cleanshot X',
				url: 'https://cleanshot.com/',
				description: 'for screenshots',
				tags: ['paid'],
			},
			{
				name: 'Discord',
				url: 'https://discord.com/',
				description: 'for messaging',
				accessories: [
					{
						name: 'Vencord',
						url: 'https://vencord.dev/',
					},
				],
			},
			{
				name: 'Spotify',
				url: 'https://spotify.com/',
				description: 'for music',
				tags: ['paid'],
			},
		],
		'Development': [
			{
				name: 'VS Code',
				url: 'https://code.visualstudio.com/',
				description: 'as my primary IDE',
				tags: ['open-source'],
			},
			{
				name: 'Neovim',
				url: 'https://neovim.io/',
				description:
					'as a secondary IDE for a snappy editor in the terminal',
				tags: ['open-source'],
			},
			{
				name: 'Ghostty',
				url: 'https://mitchellh.com/ghostty',
				description:
					'for the fastest, most feature-rich, and actively developed terminal',
				tags: ['open-source'],
			},
			{
				name: 'Toolcat',
				url: 'https://toolcat.app/',
				description:
					'for all the utilities I could ever want - generators, converters, formatters, you name it',
				tags: ['paid'],
			},
		],
		'Utilities': [
			{
				name: 'Hyperduck',
				url: 'https://sindresorhus.com/hyperduck',
				description: 'for sending URLs from my phone to computer',
			},
			{
				name: 'KnockKnock',
				url: 'https://objective-see.org/products/knockknock.html',
				description: 'for system scanning',
			},
			{
				name: 'Maccy',
				url: 'https://maccy.app/',
				description: 'for quick clipboard history access',
			},
			{
				name: 'Oversight',
				url: 'https://objective-see.org/products/oversight.html',
				description: 'for camera and microphone monitoring',
			},
			{
				name: 'PurePaste',
				url: 'https://sindresorhus.com/pure-paste',
				description: 'for automatic clipboard cleaning',
			},
			{
				name: 'Raycast',
				url: 'https://raycast.com/',
				description: 'for an improved Spotlight search',
			},
			{
				name: 'Rectangle',
				url: 'https://rectangleapp.com/x',
				description: 'for window snapping',
			},
			{
				name: 'System Color Picker',
				url: 'https://sindresorhus.com/system-color-picker',
				description: 'for a supercharged color picker',
			},
			{
				name: 'Dato',
				url: 'https://sindresorhus.com/dato',
				description: 'to quickly view + manage calendar events',
				tags: ['freemium'],
			},
			{
				name: 'MediaMate',
				url: 'https://wouter01.github.io/MediaMate/',
				description:
					'for modern, iOS-like volume and brightness controls',
				tags: ['paid'],
			},
		],
		'Browser Extensions': [
			{
				name: '1Password',
				url: 'https://1password.com/downloads/browser-extension/',
				description: 'for passwords',
				tags: ['paid'],
			},
			{
				name: 'Bypass Paywalls Clean',
				url: 'https://gitlab.com/magnolia1234/bypass-paywalls-chrome-clean',
				description: 'for bypassing annoying news paywalls',
				tags: ['open-source'],
			},
			{
				name: 'Refined GitHub',
				url: 'https://github.com/refined-github/refined-github',
				description: 'for GitHub enhancements',
				tags: ['open-source'],
			},
			{
				name: 'Stylus',
				url: 'https://github.com/openstyles/stylus',
				description: 'for theming websites with Catppuccin',
				tags: ['open-source'],
			},
			{
				name: 'uBlock Origin',
				url: 'https://github.com/gorhill/uBlock/',
				description: 'for advertisement and tracker blocking',
				tags: ['open-source'],
			},
		],
	},
	Services: {
		General: [],
		Development: [
			{
				name: 'Cloudflare Pages',
				url: 'https://pages.cloudflare.com/',
				description: 'for hosting static sites',
			},

			{
				name: 'Cloudflare',
				url: 'https://cloudflare.com/',
				description: 'for DNS',
			},

			{
				name: 'GitHub',
				url: 'https://github.com/',
				description: 'for project source code hosting',
			},

			{
				name: 'Railway',
				url: 'https://railway.app/',
				description: 'for some hosting (my analytics, for instance)',
			},

			{
				name: 'Umami',
				url: 'https://umami.is/',
				description: 'for simple, privacy-respecting analytics',
				tags: ['open-source'],
			},

			{
				name: 'Vercel',
				url: 'https://vercel.com/',
				description: 'for some web-app hosting',
			},
		],
	},
	Hardware: {
		General: [
			{
				name: 'DT 770 Pro',
				url: 'https://north-america.beyerdynamic.com/dt-770-pro.html',
				description: 'headphones',
			},
			{
				name: 'Glorious Model O (white)',
				url: 'https://www.gloriousgaming.com/products/glorious-model-o-white',
				description: 'mouse',
			},
			{
				name: 'MacBook Pro 13" (2020 M1)',
				url: 'https://www.apple.com/macbook-pro-13/',
				description: 'as my daily driver',
			},
			{
				name: 'Custom-built Bakeneko 65%',
				url: 'https://cannonkeys.com/products/bakeneko65/',
				description:
					'keyboard, with Akko Pink switches and white/lavender keycaps',
			},
		],
	},
};

export default schema.parse(data);