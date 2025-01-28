import { toAbsoluteUrl } from '../../config/url.js';
import site from '../../site.config.js';

class Page {
	data() {
		return {
			permalink: '/feed.json',
		};
	}

	async render(data) {
		return JSON.stringify(
			{
				version: 'https://jsonfeed.org/version/1.1',
				title: data.site.domain,
				description: data.site.feed.description,
				language: data.site.lang,
				authors: [
					{
						name: data.site.author.name,
						avatar: toAbsoluteUrl('1024w.png'),
					},
				],
				home_page_url: data.site.url,
				feed_url: toAbsoluteUrl('feed.json'),
				items: await Promise.all(
					[...data.collections.posts].reverse().map(async (post) => ({
						id: post.filePathStem,
						url: toAbsoluteUrl(post.url),
						title: post.data.title,
						content_html: await this.renderTransforms(
							post.content,
							post.data.page,
							site.url,
						),
						summary: post.data.description,
						date_published: post.data.date,
						tags: post.data.tags,
					})),
				),
			},
			undefined,
			2,
		);
	}
}

export default Page;
