import site from '../site.config.js';

export function toAbsoluteUrl(path, base) {
	if (!base) base = new URL(site.url);
	return new URL(path, base).href;
}
