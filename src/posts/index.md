---
title: "Articles"
description: "All of my articles in one place."
layout: base
templateEngineOverride: njk
eleventyExcludeFromCollections: true
views: false
---

<p>You can find all of my articles here. For archived articles, see <a href="/archive/">my archives</a>.</p>

{% set posts = collections.posts | reverse %}
{% include "posts.njk" %}
{% if collections.archivedPosts.length > 0 %}
    <p class="container mt-10 p-5 bg-gray-100">
    There are also {{ collections.archivedPosts.length }} archived articles. You can find them <a href="/archive/">in the archive</a>.</p>
{% endif %}