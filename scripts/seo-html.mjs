/**
 * Build-time SEO HTML, generated from the same data files the site uses (src/data/*.js),
 * so search engines always read exactly what visitors see.
 *  - fallbackHtml(): the full readable page content placed inside #root of index.html
 *    (React replaces it on load; crawlers and no-JavaScript visitors read it directly)
 *  - channelPage():  a standalone, fast /halchal-tej/ page for searches about the channel
 *  - sitemapXml(), robotsTxt()
 */
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
const flat = (parts) => parts.map((p) => (typeof p === 'string' ? p : p.b)).join('')
const ytLink = (id) => `https://www.youtube.com/watch?v=${id}`

export function fallbackHtml(d, url) {
  const { SITE, SOCIALS, ABOUT, TOOLKIT, EDUCATION, ACHIEVEMENTS, JOURNEY, YOUTUBE, PROJECTS, VIDEOS, CHANNELS } = d
  const videoItem = (v) =>
    `<article><h3><a href="${ytLink(v.id)}">${esc(v.title)}</a></h3><p>${esc(v.description)} (${esc(CHANNELS[v.channel])})</p></article>`
  return `<div id="seo-fallback">
<header>
  <h1>Divya Shakti — Portfolio | HalChal Tej: MERN Developer &amp; Agentic AI Builder</h1>
  <p>Divya Shakti is a MERN full-stack developer, Agentic AI and n8n automation builder, and the creator of the YouTube channel HalChal Tej. First-year MCA (Computer Science) student at the University of Delhi, selected for TCS Ignite 2026 as a System Engineer.</p>
  <nav aria-label="Sections">
    <a href="#projects">Projects</a> · <a href="#youtube">HalChal Tej YouTube channel</a> · <a href="#about">About Divya Shakti</a> · <a href="#contact">Contact</a> · <a href="${url}/halchal-tej/">HalChal Tej channel page</a>
  </nav>
</header>
<main>
<section id="about">
  <h2>About Divya Shakti</h2>
  <p>${esc(ABOUT.lead)}</p>
  ${ABOUT.paragraphs.map((p) => `<p>${esc(flat(p))}</p>`).join('\n  ')}
</section>
<section id="projects">
  <h2>Projects by Divya Shakti</h2>
  ${PROJECTS.map(
    (p) =>
      `<article><h3>${esc(p.title)}</h3><p>${esc(p.label)} — ${esc(p.summary)}</p><ul>${p.highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>${(p.links || [])
        .map((l) => `<a href="${esc(l.href)}">${esc(l.label)}</a>`)
        .join(' ')}</article>`
  ).join('\n  ')}
</section>
<section id="youtube">
  <h2>HalChal Tej YouTube Channel</h2>
  <p>${esc(YOUTUBE.blurb)} ${YOUTUBE.stats.map((s) => `${s.value} ${s.label}`).join(', ')}.</p>
  <ul>${YOUTUBE.pillars.map((p) => `<li><strong>${esc(p.title)}</strong>: ${esc(p.text)}</li>`).join('')}</ul>
  <h3>Videos</h3>
  ${VIDEOS.map(videoItem).join('\n  ')}
  <h3>Collaborations and brand promotions</h3>
  <ul>${YOUTUBE.collab.map((c) => `<li><strong>${esc(c.title)}</strong>: ${esc(c.text)}</li>`).join('')}</ul>
  <p><a href="${SOCIALS.youtube}">Visit the HalChal Tej channel on YouTube</a></p>
</section>
<section>
  <h2>Skills and toolkit</h2>
  <ul>${TOOLKIT.map((g) => `<li><strong>${esc(g.group)}</strong>: ${esc(g.items.join(', '))}</li>`).join('')}</ul>
</section>
<section>
  <h2>Experience and education</h2>
  ${JOURNEY.map((j) => `<article><h3>${esc(j.title)} — ${esc(j.role)}</h3><p>${esc(j.period)}. ${esc(j.text)}</p></article>`).join('\n  ')}
</section>
<section>
  <h2>Education</h2>
  <ul>${EDUCATION.map((e) => `<li>${esc(e.degree)}, ${esc(e.school)} (${esc(e.period)}). ${esc(e.note)}</li>`).join('')}</ul>
</section>
<section>
  <h2>Achievements</h2>
  <ul>${ACHIEVEMENTS.map((a) => `<li><strong>${esc(a.title)}</strong> — ${esc(a.org)}</li>`).join('')}</ul>
</section>
<section id="contact">
  <h2>Contact Divya Shakti</h2>
  <p>Email: <a href="mailto:${SITE.email}">${SITE.email}</a></p>
  <p>
    <a href="${SOCIALS.github}" rel="me">GitHub</a> ·
    <a href="${SOCIALS.linkedin}" rel="me">LinkedIn</a> ·
    <a href="${SOCIALS.youtube}" rel="me">YouTube (HalChal Tej)</a> ·
    <a href="${SOCIALS.telegram}" rel="me">Telegram</a> ·
    <a href="${SOCIALS.instagram}" rel="me">Instagram</a>
  </p>
</section>
</main>
</div>`
}

export function channelPage(d, url) {
  const { SITE, SOCIALS, YOUTUBE, VIDEOS, CHANNELS } = d
  const title = 'HalChal Tej — YouTube Channel by Divya Shakti | n8n, Agentic AI & Automation Tutorials'
  const desc =
    'HalChal Tej is the YouTube channel of Divya Shakti: n8n automation, Agentic AI, AI voice agent and Generative AI tutorials, plus Manish Digital Academy collabs.'
  const page = `${url}/halchal-tej/`
  const own = VIDEOS.filter((v) => v.channel === 'halchal')
  const collab = VIDEOS.filter((v) => v.channel === 'manish')
  const card = (v) => `<article class="v">
      <a href="${ytLink(v.id)}" rel="noopener"><img src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg" alt="${esc(v.title)} — thumbnail" width="480" height="360" loading="lazy" decoding="async"></a>
      <div><p class="tag">${esc(v.tag)} · ${esc(CHANNELS[v.channel])}</p><h3><a href="${ytLink(v.id)}" rel="noopener">${esc(v.title)}</a></h3><p>${esc(v.description)}</p></div>
    </article>`
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${page}#webpage`,
        url: page,
        name: title,
        description: desc,
        isPartOf: { '@id': `${url}/#website` },
        about: { '@id': `${url}/#halchaltej` },
        primaryImageOfPage: { '@type': 'ImageObject', url: `${url}/og-image.jpg` },
        breadcrumb: { '@id': `${page}#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${page}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Divya Shakti Portfolio', item: `${url}/` },
          { '@type': 'ListItem', position: 2, name: 'HalChal Tej', item: page },
        ],
      },
      {
        '@type': 'Organization',
        '@id': `${url}/#halchaltej`,
        name: 'HalChal Tej',
        alternateName: ['HalChalTej', 'Halchal Tej YouTube'],
        url: SOCIALS.youtube,
        logo: `${url}/og-image.jpg`,
        founder: { '@id': `${url}/#person` },
        sameAs: [SOCIALS.youtube, SOCIALS.telegram, SOCIALS.instagram],
      },
      {
        '@type': 'ItemList',
        name: 'HalChal Tej videos',
        itemListElement: VIDEOS.map((v, i) => ({ '@type': 'ListItem', position: i + 1, url: ytLink(v.id), name: v.title })),
      },
    ],
  }
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#07060b">
<link rel="canonical" href="${page}">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Divya Shakti Portfolio">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${page}">
<meta property="og:image" content="${url}/og-image.jpg">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${url}/og-image.jpg">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<style>
*{box-sizing:border-box}body{margin:0;background:#07060b;color:#f5f5f7;font:16px/1.6 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
a{color:#d8b4fe;text-decoration:none}a:hover{text-decoration:underline}
.w{max-width:1040px;margin:0 auto;padding:0 20px}
header.top{border-bottom:1px solid #1e1b2b;padding:18px 0}header.top .w{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;align-items:center}
.logo{font-weight:800;font-size:1.5rem;color:#fff;letter-spacing:-.04em}
h1{font-size:clamp(2.2rem,7vw,4rem);line-height:1.02;letter-spacing:-.05em;margin:48px 0 16px}
h2{font-size:clamp(1.5rem,4vw,2.2rem);letter-spacing:-.04em;margin:56px 0 18px}
h3{font-size:1.1rem;margin:0 0 6px;line-height:1.3}
.lead{color:#a09cb0;font-size:1.15rem;max-width:62ch}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:14px;margin:28px 0}
.stats div{border:1px solid #1e1b2b;background:#0f0e16;border-radius:18px;padding:16px}.stats b{display:block;font-size:1.7rem}.stats span{color:#a09cb0;font-size:.8rem;text-transform:uppercase;letter-spacing:.1em}
.btns{display:flex;gap:12px;flex-wrap:wrap;margin:20px 0}.btn{display:inline-block;padding:14px 24px;border-radius:999px;font-weight:700;background:#fff;color:#0a0a0f}.btn.alt{background:#0f0e16;color:#fff;border:1px solid #2a2640}.btn.yt{background:#ff2e3b;color:#fff}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:18px}
.v{border:1px solid #1e1b2b;background:#0f0e16;border-radius:22px;overflow:hidden}.v img{width:100%;height:auto;aspect-ratio:16/9;object-fit:cover;display:block;background:#000}.v>div{padding:16px 18px 20px}.v p{margin:0;color:#a09cb0;font-size:.92rem}.v .tag{color:#a855f7;font-size:.7rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;margin-bottom:8px}
.pillars{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px}.pillars div{border:1px solid #1e1b2b;background:#0f0e16;border-radius:20px;padding:20px}.pillars p{margin:0;color:#a09cb0}
footer{border-top:1px solid #1e1b2b;margin-top:72px;padding:28px 0;color:#6f6a82;font-size:.9rem}
</style>
</head>
<body>
<header class="top"><div class="w"><a class="logo" href="${url}/">DS.</a><nav><a href="${url}/">Portfolio</a> · <a href="${url}/#projects">Projects</a> · <a href="${url}/#contact">Contact</a></nav></div></header>
<main class="w">
  <h1>HalChal Tej — YouTube channel by Divya Shakti</h1>
  <p class="lead">${esc(YOUTUBE.blurb)} HalChal Tej is created by <a href="${url}/">Divya Shakti</a>, a MERN developer and Agentic AI builder.</p>
  <div class="stats">${YOUTUBE.stats.map((s) => `<div><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join('')}</div>
  <div class="btns"><a class="btn yt" href="${SOCIALS.youtube}?sub_confirmation=1" rel="noopener">Subscribe on YouTube</a><a class="btn alt" href="${SOCIALS.telegram}" rel="noopener">Join on Telegram</a><a class="btn alt" href="${url}/#contact">Collaborate</a></div>

  <h2>What HalChal Tej covers</h2>
  <div class="pillars">${YOUTUBE.pillars.map((p) => `<div><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></div>`).join('')}</div>

  <h2>Popular tutorials on the HalChal Tej channel</h2>
  <div class="grid">${own.map(card).join('')}</div>

  <h2>Collaboration: Manish Digital Academy</h2>
  <p class="lead">Divya Shakti also creates videos for other channels. Many have crossed 20K+ views. Videos made with Manish Digital Academy (40K+ subscribers):</p>
  <div class="grid">${collab.map(card).join('')}</div>

  <h2>Brand promotions and collaborations</h2>
  <div class="pillars">${YOUTUBE.collab.map((c) => `<div><h3>${esc(c.title)}</h3><p>${esc(c.text)}</p></div>`).join('')}</div>
  <div class="btns"><a class="btn" href="${url}/#contact">Contact Divya Shakti</a><a class="btn alt" href="mailto:${SITE.email}">${esc(SITE.email)}</a></div>
</main>
<footer><div class="w">© ${new Date().getFullYear()} Divya Shakti · <a href="${url}/">Portfolio</a> · <a href="${SOCIALS.youtube}" rel="me noopener">YouTube</a> · <a href="${SOCIALS.github}" rel="me noopener">GitHub</a> · <a href="${SOCIALS.linkedin}" rel="me noopener">LinkedIn</a></div></footer>
</body>
</html>
`
}

export function sitemapXml(url) {
  const today = new Date().toISOString().slice(0, 10)
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${url}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <image:image><image:loc>${url}/og-image.jpg</image:loc><image:title>Divya Shakti Portfolio</image:title></image:image>
  </url>
  <url>
    <loc>${url}/halchal-tej/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
`
}

export const robotsTxt = (url) => `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${url}/sitemap.xml\n`
