# Croatian By Descent Community

An English-language editorial and community platform by Carl Tomich, built with Astro 7, TypeScript and Tailwind CSS 4. Static HTML output works on GitHub Pages with no paid service or server required.

**Repository:** https://github.com/theultimatemusicapp/croatian-by-descent-community

**Publication status:** Carl approved public publication and GitHub Pages deployment on 10 September 2026. The deployment status and live URL are available in the repository’s Actions and Pages settings.

## Start locally

Install Node.js 24 LTS, open a terminal in this folder, then run:

```sh
npm ci
npm run dev
```

Open the local address printed in the terminal. The default is `http://127.0.0.1:4321/croatian-by-descent-community/`.

```sh
npm run build     # Optimise small images, check types, build, validate every internal link
npm run preview   # Preview the built production site locally
npm run format    # Format source and Markdown consistently
```

Keep `package-lock.json` committed. GitHub Actions uses `npm ci` for repeatable installs. No API keys or private credentials are needed to build.

## Folder guide

```text
.github/workflows/deploy.yml   GitHub Pages build and deployment
astro.config.mjs              Site origin, base path and integrations
src/
  content.config.ts           Validated frontmatter schemas
  content/articles/           News, guides, interviews, property and diaspora Markdown
  content/cities/             Editable Markdown for all 13 city/region pages
  data/approved-videos.json   ONLY manually approved YouTube videos
  data/site.ts                Brand, navigation, topics, channels and places
  data/image-credits.json     Photographer, source, licence and download records
  components/                Cards, click-to-load video and newsletter
  layouts/Base.astro         Navigation, footer and SEO metadata
  pages/                     Article, hub, city, video, search and information routes
  styles/global.css          Tailwind import and shared editorial styles
public/images/               Local WebP images and generated small versions
scripts/prepare-images.mjs   Creates small responsive images
scripts/validate.mjs         Checks built pages and removes noindex sitemap entries
templates/                  Copyable examples (never published directly)
dist/                       Generated output; do not edit or commit
```

## Add an article in GitHub

1. Copy the appropriate file from `templates/` into `src/content/articles/` with a new filename ending in `.md`. In GitHub, use **Add file → Create new file**, enter that path, and paste the template. GitHub Desktop is another option for editing locally.
2. Replace the frontmatter (between the `---` lines). Choose a unique, lower-case, hyphenated `slug` and a factual title and description. The URL is `/articles/your-slug/`.
3. Write the body in ordinary Markdown. Use `##` for sections: the layout supplies the single H1. Do not copy the example body into a reported story.
4. Leave `draft: true` while working. Draft and future-dated articles do not get pages, listings or RSS entries.
5. After editorial review, set `draft: false`. Set `sample: false` only when the article is genuinely ready for indexing. Do not remove a sample label merely to gain search traffic.
6. Commit through GitHub or GitHub Desktop. After launch, a push to `main` runs the Pages workflow automatically. Check the Actions result before assuming publication succeeded.

Example frontmatter:

```yaml
---
title: 'An original, specific article title'
slug: 'your-unique-article-slug'
description: 'A concise original summary between 30 and 180 characters describing what the reader will learn.'
category: 'moving-to-croatia'
type: 'guide'
tags: ['Living in Croatia']
author: 'Actual author name'
publishedDate: '2026-09-10'
updatedDate: '2026-09-10'
featuredImage: '/images/coast.webp'
imageAlt: 'Zadar rooftops beside the Adriatic Sea'
featured: false
draft: true
sample: false
sensitive: false
relatedSlugs: ['moving-to-croatia', 'cost-of-living-in-croatia']
---
```

Supported categories: `croatia-news`, `moving-to-croatia`, `citizenship-by-descent`, `cities-and-regions`, `croatian-diaspora`, `interviews`, `property`, `videos`.

Supported types: `news`, `guide`, `city`, `interview`, `property`, `diaspora`, `video`.

Use the exact topic label from `src/data/site.ts` in `tags` to appear in a topic listing (for example `Business` or `Croatian Australians`). `featured: true` gives a story priority when publication dates tie. Latest homepage articles are selected automatically from the collection. Edit the permanent main feature in `src/pages/index.astro` when you want to change its story.

### Links within Markdown

From an article, `[Rental guide](../renting-in-croatia/)` links to another article and works with both the GitHub project path and a custom domain. For a hub, `[Moving hub](../../moving-to-croatia/)` works. An inline image can use `![Accurate alt text](../../images/your-photo.webp)`. The build checks internal links and missing images. In MDX, import `href` from `../../data/site` and use `href('moving-to-croatia/')` for base-aware links.

### News and sensitive subjects

News requires `source`, a direct `sourceUrl`, date, author, category and image. Every legal, immigration, visa, tax or property article must set `sensitive: true`, have `reviewedDate`, and include relevant `officialSources`. Citizenship and property articles enforce these fields even without the sensitive flag. The rendered page displays the review date and rules-can-change notice.

```yaml
source: 'Name of the actual primary source'
sourceUrl: 'https://authority.example/exact-source-page'
sensitive: true
reviewedDate: '2026-09-10'
officialSources:
  - label: 'Ministry of the Interior: Citizenship'
    url: 'https://mup.gov.hr/aliens-281621/citizenship/281629'
```

Replace example links. A generic authority homepage is only a starting point; finished reporting should link to the exact supporting page. Date and source every current price or statistic. Update `updatedDate` when changing an article. Add a dated correction note for material errors. The website cannot replace human fact-checking.

## Add an image

Use your own photograph with permission or a properly licensed image. Never take publisher photographs merely because they are visible online.

1. Save the source temporarily outside the repository. Check its creator, source page, licence and permission for adaptation.
2. Convert a permitted source to a reasonably sized WebP, for example:

```sh
node --input-type=module -e 'import sharp from "sharp"; await sharp("/absolute/path/to/source.jpg").resize({width:1440,withoutEnlargement:true}).webp({quality:82}).toFile("public/images/your-photo.webp")'
```

3. Add a record to `src/data/image-credits.json` with `id`, `title`, `creator`, `creatorUrl`, `sourceWebsite`, `sourceUrl`, `downloadUrl`, `license`, `licenseUrl`, `downloadDate`, `caption`, `changes` and `localFile` (for example `/images/your-photo.webp`). The credits page includes new records automatically. The initial images are CC BY-SA 4.0 and adaptations must retain that licence.
4. Use `/images/your-photo.webp` in frontmatter and supply accurate, useful alt text. `npm run build` creates the `-small.webp` version used by cards.

Photographs must not falsely identify a person, event or location. The initial general-guide images show Zadar, Dubrovnik and Rovinj, identified in captions and credits. No AI-generated factual imagery is included.

## Update a city or region

Edit its Markdown in `src/content/cities/`, update `updatedDate` and write the verified local guide under the frontmatter. The shared layout supplies space for costs, rentals, property, transport, nature, work, lifestyle, pros and cons, interviews, videos and a map placeholder.

The city pages start as labelled research frameworks with `sample: true` and `noindex`. Set `sample: false` only after the local reporting is complete. The common checklist prompts are in `src/pages/cities-and-regions/[city].astro`; adjust those as the city collection matures. Related articles and videos use the exact city/region name in `location`.

## Add an interview

Copy `templates/interview.md` to `src/content/articles/`. Keep it as a draft until the participant, written account, image rights and recording are approved.

Use `type: interview`, `category: interviews`, `personName`, `location`, `movedFrom`, dates, portrait/featured image and accurate alt text. Write the introduction, written summary and full article in Markdown. Add only real, accurately transcribed approved text to `quotes`. Include `relatedSlugs`. A finished interview requires a YouTube URL already in the approved list; the build rejects unapproved embeds. Use `tags` to connect it to diaspora topics if relevant.

There is no fabricated participant or testimonial in the starter. The interview sample uses a landscape, not a portrait presented as a real interviewee.

## Add an approved video

No videos are imported automatically. The introduction video is approved and included. Add further videos only after Carl’s approval.

1. Show Carl the proposed title, channel and YouTube URL and obtain approval.
2. Copy the object shape from `templates/approved-video.example.json` into `src/data/approved-videos.json`.
3. Replace every example value. Use an ordinary YouTube `watch?v=` or `youtu.be/` URL with the actual 11-character ID. Set `approved: true` only after approval. Choose `Carl Tomich`, `Globe Travel Adventures` or `Croatian By Descent Community` as `channel`.
4. Include an original description, real upload date, category, location and related article slugs. Separate objects with commas and keep the surrounding JSON array.
5. Build. Each record automatically gets a thumbnail, a `/videos/slug/` page, metadata and VideoObject structured data. It also appears in the library and the latest-video area.
6. To embed the same approved video in an article or interview, set the identical `youtubeUrl` in that article’s frontmatter.

The player loads only after a click. Actual playback and embedding availability must be checked for each newly approved video. No real player can be fully playback-tested until a video is approved. YouTube thumbnails load from YouTube only for approved records.

## Connect forms and newsletter later

Copy `.env.example` to `.env` for local settings. `.env` is ignored by Git. Set `PUBLIC_CONTACT_FORM_URL` and/or `PUBLIC_NEWSLETTER_FORM_URL` to the public HTTPS submission endpoint supplied by your chosen provider. Leave them blank to keep the honest disabled/coming-soon state.

These are static HTML POST forms. The provider handles spam protection, storage, confirmation, errors and replies. Configure its success/error pages and domain allowlist, then test a submission you control. No private email address or service secret belongs in this repository. Update the privacy notice with provider, retention and contact information before enabling collection. The site does not pretend a message has been sent when no service exists.

## Configure metadata and analytics

- `SITE_URL`: origin only, e.g. `https://theultimatemusicapp.github.io`.
- `SITE_BASE`: `/croatian-by-descent-community` for this GitHub project; `/` for a future custom domain.
- `PUBLIC_GOOGLE_SITE_VERIFICATION`: Search Console verification content value.
- `PUBLIC_ANALYTICS_SCRIPT_URL` and `PUBLIC_ANALYTICS_DOMAIN`: optional public Plausible-compatible script URL and domain. Leave both blank to disable. Document any chosen analytics service in the privacy page before launch.

Public configuration is embedded in static output. Never put API keys, passwords, tokens or private addresses here. Set production variables under **Repository → Settings → Secrets and variables → Actions → Variables**. No custom domain is bought or assumed.

## Deploy after Carl’s approval

1. Commit the finished, reviewed site to this new repository and push `main`.
2. If using free GitHub Pages, make the repository public only after Carl has approved. Private-repository Pages depends on the GitHub plan; do not start a paid plan.
3. Open **Repository → Settings → Pages → Build and deployment → Source → GitHub Actions**.
4. Open **Actions → Deploy Astro to GitHub Pages → Run workflow**, or let the push trigger it.
5. Wait for both build and deploy jobs to succeed. The expected URL is `https://theultimatemusicapp.github.io/croatian-by-descent-community/`; it is not live merely because it is written here.
6. Check the deployed site, links, sitemap and robots after deployment.

The workflow uses a short-lived GitHub-provided token with contents-read, Pages-write and ID-token permissions. It does not contain custom credentials. No deployment runs from untrusted pull requests.

## Connect a custom domain later

After obtaining a domain separately, open **Repository → Settings → Pages → Custom domain** and enter it. Configure DNS at your domain provider following GitHub’s instructions. Then set the repository Actions variables `SITE_URL=https://your-domain.example` and `SITE_BASE=/`, rebuild and verify canonicals, RSS, sitemap and image paths. Enable HTTPS when GitHub makes it available. Do not add the repository path to a custom-domain URL.

GitHub Pages `robots.txt` for this project lives under the project path. Crawlers consult `/robots.txt` at the host root, so the project file is not an origin-wide crawl policy. The page-level noindex tags and sitemap exclusions protect samples; submit the project sitemap in Search Console. On a custom domain this site’s robots file is at the origin root.

## Before a real editorial launch

- Review the original sample guides, verify claims and replace sample labels only when ready.
- Complete local reporting for the 13 city/region frameworks.
- Approve the first videos and verify their playback/embedding permissions.
- Interview actual participants and obtain portrait, recording and quotation permissions.
- Connect and test form/newsletter providers if wanted; finish the privacy notice first.
- Add Search Console verification and submit the sitemap after the public site is live.
- Configure optional analytics and disclose it appropriately.
- Recheck current official links and all time-sensitive information.

No current news events, personal interviews, precise prices, testimonials or popularity statistics have been fabricated. The visual/navigation reference was studied only for broad content categories; its branding, layout, wording, images, articles and code were not copied.
