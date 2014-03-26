---
layout: default
title: "Zootiques"
category: "catalog"
pdf: TRI_FOLD_RESIN_2013.pdf
cover: TRI_FOLD_RESIN_2013-cover.jpg
---

<main role="main" class="wrapper narrow sidebar-right">
{% for post in site.categories.blog %}
  <article class="post">
    <h1>{{ post.title }}</h1>
    <div class="post-body">
      {{ post.content }}
    </div>
    <aside class="meta">
      <dl>
        <dt><time datetime="{{ post.date }}">{{ post.date | date: "%B %d" }}</time></dt>
        <dt>Tags</dt>
        {% for tag in post.tags %}
        <dd>{{ tag }}</dd>
        {% endfor %}
      </dl>
    </aside>
  </article>
{% endfor %}
</main>