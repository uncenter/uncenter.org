import { DateTime } from 'luxon';
import stringify from '../json-pretty-stringify.js';
import { toAbsoluteUrl } from '../url.js';

const toShortDate = (dateObject) => {
	// 10/14/1983
	return DateTime.fromISO(dateObject, { zone: 'utc' }).toFormat('MM/dd/yyyy');
};

const toMedDate = (dateObject) => {
	// Oct 14, 1983
	return DateTime.fromISO(dateObject, { zone: 'utc' }).toFormat('MMM dd, yyyy');
};

const toFullDate = (dateObject) => {
	// October 14, 1983
	return DateTime.fromISO(dateObject, { zone: 'utc' }).toFormat(
		'MMMM dd, yyyy',
	);
};

const toShortDateTime = (dateObject) => {
	// 10/14/1983, 10:30 PM
	return DateTime.fromISO(dateObject, { zone: 'utc' }).toFormat(
		'MM/dd/yyyy, hh:mm a',
	);
};

const toMedDateTime = (dateObject) => {
	// Oct 14, 1983, 10:30 PM
	return DateTime.fromISO(dateObject, { zone: 'utc' }).toFormat(
		'MMM dd, yyyy, hh:mm a',
	);
};

const toFullDateTime = (dateObject) => {
	// October 14, 1983, 10:30 PM
	return DateTime.fromISO(dateObject, { zone: 'utc' }).toFormat(
		'MMMM dd, yyyy, hh:mm a',
	);
};

export const filters = (eleventyConfig) => {
	eleventyConfig.addFilter('toShortDate', toShortDate);
	eleventyConfig.addFilter('toMedDate', toMedDate);
	eleventyConfig.addFilter('toFullDate', toFullDate);
	eleventyConfig.addFilter('toShortDateTime', toShortDateTime);
	eleventyConfig.addFilter('toMedDateTime', toMedDateTime);
	eleventyConfig.addFilter('toFullDateTime', toFullDateTime);
	eleventyConfig.addFilter('capitalize', (string) => {
		return string.charAt(0).toUpperCase() + string.slice(1);
	});
	eleventyConfig.addFilter('stringify', (value) => {
		return stringify(value, '\t');
	});
	eleventyConfig.addFilter('toAbsoluteUrl', toAbsoluteUrl);
};
