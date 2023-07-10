class Page {
	data() {
		return {
			permalink: '/sitemap.xml',
			eleventyExcludeFromCollections: true,
		};
	}

	render(data) {
		return `
<?xml version="1.0" encoding="utf-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${data.collections.all
			.map((page) =>
				`
    <url>
        <loc>${data.meta.url}${page.url}</loc>
        <lastmod>${page.date.toISOString()}</lastmod>
    </url>`.replace(/^\n/g, ''),
			)
			.join('\n')}
</urlset>
`.trimStart();
	}
}

module.exports = Page;
