/**
 * Vercel serverless function: POST /api/contact
 * Sends every portfolio form as a structured email over SMTP.
 *
 * Environment variables (server-side only — never prefix with VITE_):
 *   SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, MAIL_TO, MAIL_FROM
 *   DIAGNOSE_KEY (optional) — lets you open /api/contact?diagnose=<key> to test the mail setup on the live site
 */
import { readConfig, missing, transport, explain, compose } from './_mail.js'

// Best-effort spam brake: 6 requests / 10 minutes / IP per warm instance
const hits = new Map()
function limited(ip) {
  const now = Date.now()
  const list = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000)
  list.push(now)
  hits.set(ip, list)
  return list.length > 6
}

const isProd = () => process.env.VERCEL_ENV === 'production'

export default async function handler(req, res) {
  const cfg = readConfig()

  /* ── GET ?diagnose=<DIAGNOSE_KEY> : checks the mail setup without sending anything ── */
  if (req.method === 'GET') {
    const key = process.env.DIAGNOSE_KEY
    const asked = new URL(req.url || '/', 'http://localhost').searchParams.get('diagnose')
    if (!key || asked !== key) return res.status(404).json({ success: false, message: 'Not found.' })
    const miss = missing(cfg)
    let verify = 'skipped (fix the missing values first)'
    let hint
    if (!miss.length) {
      try {
        await transport(cfg).verify()
        verify = 'OK — the server accepted the login'
      } catch (e) {
        const x = explain(e)
        verify = `FAILED (${x.code})`
        hint = x.hint
      }
    }
    return res.status(200).json({
      missing: miss,
      settings: {
        SMTP_HOST: cfg.host || 'MISSING',
        SMTP_PORT: cfg.port,
        SMTP_SECURE: cfg.secure,
        SMTP_USER: cfg.user || 'MISSING',
        SMTP_PASS: cfg.pass ? `set (${cfg.pass.length} characters)` : 'MISSING',
        MAIL_TO: cfg.to || 'MISSING',
      },
      verify,
      hint,
      runtime: { node: process.version, vercelEnv: process.env.VERCEL_ENV || null },
    })
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ success: false, code: 'METHOD', message: 'Method not allowed.' })
  }

  const miss = missing(cfg)
  if (miss.length) {
    console.error('[contact] mail not configured, missing:', miss.join(', '))
    return res.status(500).json({
      success: false,
      code: 'NOT_CONFIGURED',
      message: 'Mail server is not configured yet.',
      hint: isProd() ? undefined : `Missing: ${miss.join(', ')}. Add them to .env (local) or Vercel environment variables (live), then restart or redeploy.`,
    })
  }

  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim()
  if (limited(ip)) return res.status(429).json({ success: false, code: 'RATE_LIMIT', message: 'Too many requests. Please try again in a few minutes.' })

  let body = req.body
  if (typeof body === 'string') {
    try { body = JSON.parse(body) } catch { body = {} }
  }
  const mail = compose({ kind: body?.kind, fields: body?.fields, page: body?.page })
  if (mail.error) return res.status(400).json({ success: false, code: 'INVALID', message: mail.error })

  try {
    await transport(cfg).sendMail({
      from: `"Portfolio Website" <${cfg.from}>`,
      to: cfg.to,
      replyTo: `"${mail.name.replace(/["\r\n]/g, '')}" <${mail.email}>`,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    })
    return res.status(200).json({ success: true, message: 'Sent.' })
  } catch (err) {
    const x = explain(err)
    console.error(`[contact] SMTP send failed (${x.code}):`, err?.message || err, '\n  fix:', x.hint)
    return res.status(502).json({
      success: false,
      code: x.code,
      message: 'Could not send the email right now. Please try again shortly.',
      hint: isProd() ? undefined : x.hint,
    })
  }
}
