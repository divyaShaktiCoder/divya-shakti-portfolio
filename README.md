# Divya Shakti - Portfolio

React 18 + Vite + Three.js. Frontend plus one small serverless function (`api/contact.js`) that sends form emails over SMTP. Built for Vercel.

## 1. Run locally

    npm install
    npm run dev

## 2. Set up email and test it (do this first)

Open `.env` and fill in `SMTP_PASS`. It must be a Gmail App Password, not your normal password.

1. Sign in to halchaltej.business@gmail.com and open Google Account, Security.
2. Turn on 2-Step Verification if it is off.
3. Search for "App passwords", create one named "Portfolio", and copy the 16 characters.
4. Paste them as `SMTP_PASS=` in `.env` (spaces are fine).

Then run the credential test:

    npm run test:mail

It checks the login and sends one test email to `MAIL_TO`. If it prints "test email sent", the forms will work. If it fails, it prints the exact reason and the fix. Restart `npm run dev` after any change to `.env`.

How forms are delivered: the browser posts to `/api/contact`, which sends a structured email (form type, name, email, every answer, date and time in IST) to `MAIL_TO`, with the visitor set as Reply-To. If `/api/contact` is unreachable or the mail server fails, the form automatically falls back to FormSubmit so a message is not lost (turn this off with `VITE_FORM_FALLBACK=off`).

## 3. Deploy on Vercel

1. Create a GitHub repository and push this folder:

       git init
       git add .
       git commit -m "Portfolio"
       git branch -M main
       git remote add origin https://github.com/YOUR-USERNAME/portfolio.git
       git push -u origin main

   `.env` is ignored by git on purpose. Your password never goes to GitHub.
2. Go to vercel.com, sign in with GitHub, choose Add New, Project, and import the repository.
3. Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.
4. Open Environment Variables and add these (Production, Preview and Development):

   | Name | Value |
   | --- | --- |
   | `VITE_FORM_PROVIDER` | `smtp` |
   | `SMTP_HOST` | `smtp.gmail.com` |
   | `SMTP_PORT` | `465` |
   | `SMTP_SECURE` | `true` |
   | `SMTP_USER` | `halchaltej.business@gmail.com` |
   | `SMTP_PASS` | your App Password |
   | `MAIL_TO` | `halchaltej.business@gmail.com` |
   | `MAIL_FROM` | `halchaltej.business@gmail.com` |
   | `DIAGNOSE_KEY` | any random text, only while testing |

5. Click Deploy. Vercel builds the site and turns the `api` folder into a live function.
6. After any later change to environment variables, redeploy (Deployments, the latest one, Redeploy). Changes only apply to new deployments.

### Check the live mail setup

Open this address in a browser (replace the domain and key):

    https://YOUR-SITE.vercel.app/api/contact?diagnose=YOUR_DIAGNOSE_KEY

It shows which values are set and whether the mail server accepted the login, with the fix if not. It never shows your password. Then submit one real form on the site and confirm the email arrives (check Spam once). When everything works, delete `DIAGNOSE_KEY` and redeploy.

### If forms still do not arrive

| Symptom | Cause and fix |
| --- | --- |
| Form says "mail service is not available" | You are on `npm run preview` or a static host. Use `npm run dev` locally, or the Vercel deployment |
| "Mail server is not configured yet" | A `SMTP_` value is empty or missing on Vercel. Add it and redeploy |
| Login rejected (AUTH_FAILED) | `SMTP_PASS` is not an App Password, or 2-Step Verification is off |
| Changed `.env` but nothing changed | Restart `npm run dev` (local) or redeploy (Vercel) |
| Email sent but not in inbox | Check Spam, and confirm `MAIL_TO` is spelled correctly |

## 4. SEO

Built in: title and description written for the searches "Divya Shakti portfolio" and "HalChal Tej", canonical link, Open Graph and Twitter cards, structured data (Person, Organization for HalChal Tej, WebSite, ProfilePage), full readable page content in the HTML for crawlers, a dedicated `/halchal-tej/` channel page, `sitemap.xml`, `robots.txt`, semantic headings, fast loading. Sitemap and canonical URLs use your Vercel domain automatically.

No one can guarantee a Google position. Ranking depends on Google indexing the site, on links from other sites, and on competition (the name "Divya Shakti" is also an older Hindi film). The steps below are what make the difference, in order of impact:

1. Google Search Console: add the site (URL prefix), verify it (add the content value as `VITE_GOOGLE_VERIFICATION`, redeploy, then click Verify), open Sitemaps and submit `sitemap.xml`, then use URL Inspection, paste the home page and `/halchal-tej/`, and click Request indexing.
2. Bing Webmaster Tools: import from Search Console, or add the site and submit the sitemap.
3. Backlinks (the biggest factor): put your portfolio link in
   - your YouTube channel About page (Links) and in the description of every video
   - your GitHub profile Website field and the profile README in the `dscoder1/dscoder1` repository
   - your LinkedIn profile Website and Featured section
   - your Instagram bio and Telegram channel description
   - the Manish Digital Academy channel or video descriptions where you are credited
4. Use the same names everywhere: "Divya Shakti" and "HalChal Tej".
5. A custom domain with your name (for example divyashakti.dev) ranks better than a `vercel.app` address. After buying it, add it in Vercel, Settings, Domains, set `VITE_SITE_URL` to it, and redeploy. Then add the new address in Search Console.
6. Give it time. New sites usually get indexed within days and settle in position over several weeks.

## 5. Where to edit content

| File | What it controls |
| --- | --- |
| `src/data/site.js` | Name, email, links, stats, About, toolkit, achievements, education, build log, YouTube text |
| `src/data/projects.js` | Project cards and detail windows |
| `src/data/videos.js` | YouTube videos (id, title, description, channel) |
| `src/assets/projects/` | Project screenshots (WebP) |
| `src/assets/profile.webp`, `avatar.webp` | Hero and About cutout, round avatar |
| `index.html` | Title, description, keywords, structured data, preloader |
| `scripts/seo-html.mjs` | Crawler-readable page content, `/halchal-tej/` page, sitemap |

The crawler content and the `/halchal-tej/` page are generated from the same data files, so editing them updates SEO automatically at the next build.

## 6. Things to verify

- SocioUse is shown as "2nd Place, Social Web Designing Competition, Amity University Patna". One resume version says "Winner". Confirm which is correct.
- Video ids: the Doctor Appointment video uses `0OjE57lX9mo`. The "Only 20 n8n Nodes" (`z1pudrWnufE`) and "n8n Automation A-Z" (`QowxF3_wZwM`) cards use the links you sent. Each card shows the real YouTube thumbnail, so a wrong id is obvious. Fix by replacing the id in `src/data/videos.js`.
