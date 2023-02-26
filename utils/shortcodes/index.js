const fs = require("fs");
const path = require("path");
const { htmlToText } = require("html-to-text");
const meta = require("../../src/_data/meta.json");
const EleventyFetch = require("@11ty/eleventy-fetch")
const md5 = require('md5')
const { DateTime } = require("luxon")
const { markdownLibrary } = require("../plugins/markdown")

const createCallout = (content, title, type) => {
    const titleText = markdownLibrary.renderInline(`${title}`);
    const contentHtml = markdownLibrary.render(content);

    if (
        [
            "info",
            "warning",
            "tip",
            "note",
        ].includes(type) === false
    ) {
        type = "note";
    }
    return (
        `<div class="container note note--${type}">\n` +
        `<div class="note__title">\n` +
        `${titleText}\n` +
        `</div>\n` +
        `<div class="note__content">\n` +
        `${contentHtml}\n` +
        `</div>\n` +
        `</div>`
    );
};

const insertIcon = function icon(name) {
    if (!this.ctx.page.icons) {
        this.ctx.page.icons = [];
    }
    if (!this.ctx.page.icons.includes(name)) {
        this.ctx.page.icons.push(name);
    }
    return `<svg class="icon icon-${name}"><use href="#icon-${name}"></use></svg>`;
};

const insertIconSheet = function iconsheet() {
    const sourceDir = path.join(__dirname, "../../src/assets/icons");
    const icons = fs.readdirSync(sourceDir);
    let pageIcons = this.ctx.page.icons || [];
    pageIcons = pageIcons.filter((icon) => icon !== undefined);

    let sprite = '<svg class="hidden-svg-sprite-sheet" aria-hidden="true" style="position: absolute; width: 0; height: 0; overflow: hidden;" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n<defs>\n';
    let symbols = "";

    icons.forEach((icon) => {
        const iconPath = path.join(sourceDir, icon);
        const iconName = path.parse(icon).name;
        const content = fs.readFileSync(iconPath, "utf8");
        const viewBox = content.match(/viewBox="(.+?)"/)[1];
        let classname = content.match(/class="(.+?)"/);
        if (classname) {
            classname = classname[1];
        } else {
            classname = "";
        }
        const symbol = content
            .replace(
                /<svg([^>]+)>/,
                `<symbol id="icon-${iconName}" viewBox="${viewBox}"${classname ? "" : ' fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"'}>`
            )
            .replace("</svg>", "</symbol>")
            .replace(/<!--(.*?)-->/g, "");
            
        if (pageIcons.includes(iconName)) {
            symbols += symbol + "\n";
        }
    });
    if (symbols !== "") {
        sprite += symbols + "</defs>\n</svg>\n";
        return sprite;
    }
    return "";
};

const getExcerpt = (page) => {
    if (!page.hasOwnProperty("content")) {
        return null;
    }

    let content = page.content.trim();

    // Remove the first HTML heading if it exists
    content = content.replace(/^(\s*\n*)?<h\d[^>]*>.*?<\/h\d>(\s*\n*)?/i, "");

    // Truncate content before the next heading (if any)
    const nextHeadingIndex = content.search(/<h\d[^>]*>/i);
    if (nextHeadingIndex !== -1) {
        content = content.substring(0, nextHeadingIndex);
    }

    // Convert content to plain text
    const plainText = htmlToText(content, {
        wordwrap: false,
        ignoreHref: true,
        ignoreImage: true,
        uppercaseHeadings: false,
    });

    // Split plain text into phrases and concatenate until length cutoff 
    // Adapted https://github.com/mpcsh/eleventy-plugin-description]

    const phrases = plainText.split(/(\p{Terminal_Punctuation}\p{White_Space})/gu);
    let excerpt = "";
    while (phrases.length > 0 && excerpt.length < 200) {
        excerpt += phrases.shift();
    }

    // Append ending characters and return excerpt
    excerpt += "...";
    return excerpt;
}

const insertYear = () => {
    return new Date().getFullYear();
};

const insertDate = () => {
    return new Date().toISOString();
};

const insertGiscusScript = () => {
    const repo = "R_kgDOHSjhjQ";
    const category = "DIC_kwDOHSjhjc4CTQUr";
    const reactions = "1";
    return `
    <script>
    let giscusTheme = "light";
    let giscusAttributes = {
        "src": "https://giscus.app/client.js",
        "data-repo": "${meta.github.username}/${meta.github.repo}",
        "data-repo-id": "${repo}",
        "data-category-id": "${category}",
        "data-mapping": "title",
        "data-reactions-enabled": "${reactions}",
        "data-emit-metadata": "0",
        "data-input-position": "top",
        "data-theme": giscusTheme,
        "data-lang": "en",
        "crossorigin": "anonymous",
        "async": ""
    };
    let giscusScript = document.createElement("script");
    Object.entries(giscusAttributes).forEach(([key, value]) => giscusScript.setAttribute(key, value));
    window.onload = (event) => {
        document.querySelector('#giscus').appendChild(giscusScript);
    };
    </script>`;
};

// https://www.brycewray.com/posts/2022/08/static-embeds-eleventy/
const createStaticToot = async (instance, id) => {
    let stringToRet = ``
    let tootLink, handleInst, mediaMD5, urlToGet, mediaStuff, videoStuff, gifvStuff, cardStuff, pollStuff = ''
    let imageCount, votesCount = 0

    urlToGet = `https://` + instance + `/api/v1/statuses/` + id

    async function GetToot(tootURL) {
        const response = await EleventyFetch(tootURL, {
            duration: "2w",
            type: "json"
        });
        return response
    }

    let Json = await GetToot(urlToGet);

    if (Json.account) {
        tootLink = `https://` + instance + `@` + Json.account.acct + `/status/` + id
        handleInst = `@` + Json.account.acct + `@` + instance
    }

    if (Json.media_attachments.length !== 0) {
        mediaMD5 = md5(Json.media_attachments[0].url)
        Json.media_attachments.forEach((type) => {
            if (Json.media_attachments[0].type == "image") {
                imageCount = ++imageCount;
            }
        })
        Json.media_attachments.forEach((type, meta) => {
            if (Json.media_attachments[0].type == "image") {
                mediaStuff = ``;
                mediaStuff = mediaStuff + `<div class="toot-img-grid-${imageCount}"><style>.img-${mediaMD5} {aspect-ratio: ${Json.media_attachments[0].meta.original.width} / ${Json.media_attachments[0].meta.original.height}}</style>`;
                mediaStuff = mediaStuff + `<img src="${Json.media_attachments[0].url}" alt="Image ${Json.media_attachments[0].id} from toot ${id} on ${instance}" class="toot-media-img img-${mediaMD5}`;
                if (Json.sensitive) {
                    mediaStuff = mediaStuff + ` toot-sens-blur`;
                }
                mediaStuff = mediaStuff + `" loading="lazy"`;
                if (Json.sensitive) {
                    mediaStuff = mediaStuff + ` onclick="this.classList.toggle('toot-sens-blur-no')"`;
                }
                mediaStuff = mediaStuff + `/>`;
                if (Json.sensitive) {
                    mediaStuff = mediaStuff + `<div class="blur-text">Sensitive content<br />(flagged&nbsp;at&nbsp;origin)</div>`;
                }
                mediaStuff = mediaStuff + `</div>`;
            }
            if (Json.media_attachments[0].type == "video") {
                videoStuff = ``;
                videoStuff = videoStuff + `<style>.img-${mediaMD5} {aspect-ratio: ${Json.media_attachments[0].meta.original.width} / ${Json.media_attachments[0].meta.original.height}}</style>`;
                videoStuff = videoStuff + `<div class="ctr toot-video-wrapper"><video muted playsinline controls class="ctr toot-media-img img-${mediaMD5}`;
                if (Json.sensitive) {
                    videoStuff = videoStuff + ` toot-sens-blur`;
                }
                videoStuff = videoStuff + `"`;
                if (Json.sensitive) {
                    videoStuff = videoStuff + ` onclick="this.classList.toggle('toot-sens-blur-no')"`;
                }
                videoStuff = videoStuff + `><source src="${Json.media_attachments[0].url}"><p class="legal ctr">(Your browser doesn&rsquo;t support the <code>video</code> tag.)</p></video>`;
                if (Json.sensitive) {
                    videoStuff = videoStuff + `<div class="blur-text">Sensitive content<br />(flagged&nbsp;at&nbsp;origin)</div>`;
                }
                videoStuff = videoStuff + `</div>`
            }
            if (Json.media_attachments[0].type == "gifv") {
                gifvStuff = ``;
                gifvStuff = gifvStuff + `<style>.img-${mediaMD5} {aspect-ratio: ${Json.media_attachments[0].meta.original.width} / ${Json.media_attachments[0].meta.original.height}}</style>`;
                gifvStuff = gifvStuff + `<div class="ctr toot-video-wrapper"><video loop autoplay muted playsinline controls controlslist="nofullscreen" class="ctr toot-media-img img-${mediaMD5}`;
                if (Json.sensitive) {
                    gifvStuff = gifvStuff + `toot-sens-blur`;
                }
                gifvStuff = gifvStuff + `"`;
                if (Json.sensitive) {
                    gifvStuff = gifvStuff + ` onclick="this.classList.toggle('toot-sens-blur-no')"`;
                }
                gifvStuff = gifvStuff + `><source src="${Json.media_attachments[0].url}"><p class="legal ctr">(Your browser doesn&rsquo;t support the <code>video</code> tag.)</p></video>`;
                if (Json.sensitive) {
                    gifvStuff = gifvStuff + `<div class="blur-text">Sensitive content<br />(flagged&nbsp;at&nbsp;origin)</div>`;
                }
                gifvStuff = gifvStuff + `</div>`
            }
        })
    }

    if(Json.card !== null) {
        cardStuff = ``;
        cardStuff = cardStuff + `<a href="${Json.card.url}" rel="noopener"><div class="toot-card"><div class="toot-card-image"><img src="${Json.card.image}" alt="Card image from ${instance} toot ${id}" loading="lazy" class="toot-card-image-image" /></div><div class="toot-card-content"><p class="card-title">${Json.card.title}</p><p class="card-description">${Json.card.description}</p></div></div></a>`;
    }

    if (Json.poll !== null) {
        votesCount = Json.poll.votes_count;
        let pollIterator = 0;
        pollStuff = ``;
        pollStuff = pollStuff + `<div class="toot-poll-wrapper">`;
        Json.poll.options.forEach(( options ) => {
            pollStuff = pollStuff + `<div class="toot-poll-count"><strong>${((Json.poll.options[pollIterator].votes_count)/(votesCount)).toLocaleString("en", {style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1})}</strong></div><div class="toot-poll-meter"><meter id="vote-count" max="${votesCount}" value=${Json.poll.options[pollIterator].votes_count}></meter></div><div class="toot-poll-title">${Json.poll.options[pollIterator].title}</div>`;
            pollIterator = ++pollIterator;
        })
        pollStuff = pollStuff + `</div><p class="legal toot-poll-total">${votesCount} people</p>`;
    }

    if (Json.content) {
        stringToRet = `<blockquote class="toot-blockquote base-link" cite="${tootLink}" data-pagefind-ignore>
            <div class="toot-header">
                <a class="toot-profile base-link" href="https://${instance}/@${Json.account.acct}" rel="noopener"><img src="${Json.account.avatar}" alt="Mastodon avatar for ${handleInst}" loading="lazy" /></a>
                <div class="toot-author">
                    <a class="toot-author-name base-link" href="https://${instance}/@${Json.account.acct}" rel="noopener">${Json.account.display_name}</a>
                    <a class="toot-author-handle base-link" href="https://${instance}/@${Json.account.acct}" rel="noopener">${handleInst}</a>
                </div>
            </div>
            <p class="toot-body">${Json.content}</p>`
            if (mediaStuff) {
                stringToRet += `<div>${mediaStuff}</div>`
            }
            if (videoStuff) {
                stringToRet += `<div>${videoStuff}</div>`
            }
            if (gifvStuff) {
                stringToRet += `<div>${gifvStuff}</div>`
            }
            if (cardStuff) {
                stringToRet += `<div>${cardStuff}</div>`
            }
            if (pollStuff) {
                stringToRet += `<div>${pollStuff}</div>`
            }

            let timeToFormat = Json.created_at
            let formattedTime = DateTime.fromISO(timeToFormat, { zone: "utc" }).toFormat("h:mm a • MMMM d, yyyy")

            stringToRet += `<div class="toot-footer">
                <a href="https://${instance}/@${Json.account.acct}/${Json.id}" class="toot-date base-link" rel="noopener">${formattedTime}</a>&nbsp;<span class="legal">(UTC)</span>
            </div>
        </blockquote>`
    }

    return stringToRet;
};

module.exports =  {
    createCallout,
    insertIcon,
    insertIconSheet,
    getExcerpt,
    insertYear,
    insertDate,
    insertGiscusScript,
    createStaticToot
};