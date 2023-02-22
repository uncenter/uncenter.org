---
title: "Changelog"
---

<dl>
{%- for group in collections.recentChangesByDate -%}
  <dt class="font-semibold text-center">{{ group[0] | shortenedISODate }}</dt>
  <dd>
    <ul>
      {%- for commit in group[1] %}
      <li data-date-rel="{{ commit.committerDateRel }}" data-date="{{ commit.committerDate }}" data-commit="{{ commit.hash }}" data-category="{{ commit.subject | getCommitCategory }}"><span class="inline-card" data-category="{{ commit.subject | getCommitCategory }}">{{ commit.subject | getCommitCategory }}</span> - {% if commit.subject -%}<a aria-label="View commit on Github" class="no-style" href="https://github.com/{{ meta.github.username }}/{{ meta.github.repo }}/commit/{{ commit.hash }}">{{ commit.subject | getCommitMessage }}</a>{%- else -%}[no commit message found]{%- endif -%}
        </li>
      {%- endfor -%}
    </ul>
  </dd>
{%- endfor -%}
</dl>