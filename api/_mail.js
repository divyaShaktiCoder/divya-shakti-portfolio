/**
 * Shared mail helpers. The leading underscore keeps Vercel from exposing this file as an endpoint.
 * Used by api/contact.js (the live function) and scripts/test-mail.mjs (the local credential test).
 */
import nodemailer from 'nodemailer'

export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
export const oneLine = (s) => String(s).replace(/[\r\n]+/g, ' ').trim()
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Reads SMTP settings from environment variables and cleans common copy-paste mistakes. */
export function readConfig(env = process.env) {
  const port = Number(String(env.SMTP_PORT || '465').trim()) || 465
  const secureRaw = String(env.SMTP_SECURE ?? '').trim().toLowerCase()
  const user = String(env.SMTP_USER || '').trim()
  return {
    host: String(env.SMTP_HOST || '').trim(),
    port,
    secure: secureRaw ? secureRaw === 'true' : port === 465,
    user,
    // Google shows App Passwords as "abcd efgh ijkl mnop" — the spaces are not part of the password
    pass: String(env.SMTP_PASS || '').replace(/\s+/g, ''),
    to: String(env.MAIL_TO || user).trim(),
    from: String(env.MAIL_FROM || user).trim(),
  }
}

export function missing(cfg) {
  const m = []
  if (!cfg.host) m.push('SMTP_HOST')
  if (!cfg.user) m.push('SMTP_USER')
  if (!cfg.pass) m.push('SMTP_PASS')
  return m
}

export function transport(cfg) {
  return nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: { user: cfg.user, pass: cfg.pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  })
}

/** Turns a raw SMTP error into a stable code plus a plain-language fix. */
export function explain(err) {
  const code = err?.code
  const resp = err?.responseCode
  const msg = String(err?.message || '')
  if (code === 'EAUTH' || resp === 535 || /invalid login|username and password not accepted|authentication/i.test(msg))
    return { code: 'AUTH_FAILED', hint: 'The mail server rejected the login. For Gmail: turn on 2-Step Verification, create an App Password (Google Account > Security > App passwords) and paste its 16 characters as SMTP_PASS. Your normal Gmail password does not work.' }
  if (resp === 534 || /web login required|application-specific/i.test(msg))
    return { code: 'AUTH_FAILED', hint: 'Google requires an App Password for this account. Create one and use it as SMTP_PASS.' }
  if (/wrong version number|ssl routines|tls/i.test(msg))
    return { code: 'TLS_MISMATCH', hint: 'Port and SMTP_SECURE do not match. Port 465 needs SMTP_SECURE=true; port 587 needs SMTP_SECURE=false.' }
  if (['ETIMEDOUT', 'ECONNECTION', 'ESOCKET', 'EDNS', 'ECONNREFUSED', 'ENOTFOUND'].includes(code))
    return { code: 'CONNECT_FAILED', hint: 'Could not reach the SMTP server. Check SMTP_HOST (smtp.gmail.com), SMTP_PORT and SMTP_SECURE.' }
  if (code === 'EENVELOPE')
    return { code: 'BAD_ADDRESS', hint: 'MAIL_TO or MAIL_FROM is not a valid email address.' }
  return { code: 'SEND_FAILED', hint: msg.slice(0, 200) || 'Unknown SMTP error.' }
}

/** Validates the submitted form and builds the structured email (plain text + HTML). */
export function compose({ kind, fields, page }) {
  const cleanKind = oneLine(kind || '').slice(0, 80)
  const list = (Array.isArray(fields) ? fields.slice(0, 20) : [])
    .filter((p) => Array.isArray(p) && p.length === 2)
    .map(([k, v]) => [oneLine(k).slice(0, 80), String(v ?? '').trim().slice(0, 4000)])
    .filter(([k, v]) => k && v)
  const name = (list.find(([k]) => k === 'Name') || [])[1]
  const email = (list.find(([k]) => k === 'Email') || [])[1]
  if (!cleanKind || !name || !email || !EMAIL_RE.test(email)) return { error: 'Please provide a valid name and email.' }

  const stamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }) + ' IST'
  const rows = [['Form', cleanKind], ...list, ['Submitted', stamp], ['Sent from', oneLine(page || 'portfolio')]]
  const subject = `Portfolio · ${cleanKind} — ${oneLine(name).slice(0, 60)}`
  const text = `${cleanKind.toUpperCase()}\n${'─'.repeat(cleanKind.length)}\n` + rows.map(([k, v]) => `${k}: ${v}`).join('\n')
  const html = `<!doctype html><html><body style="margin:0;background:#f4f2fa;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#1a1625">
  <table role="presentation" width="100%" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e6e0f5">
    <tr><td style="background:#6d28d9;padding:20px 24px">
      <div style="color:#e9d5ff;font-size:12px;letter-spacing:.12em;text-transform:uppercase">Portfolio website</div>
      <div style="color:#ffffff;font-size:20px;font-weight:700;margin-top:4px">${esc(cleanKind)}</div>
    </td></tr>
    <tr><td style="padding:8px 24px 20px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:12px 0;border-bottom:1px solid #eee9f8;width:32%;vertical-align:top;font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:#6b6480">${esc(k)}</td><td style="padding:12px 0;border-bottom:1px solid #eee9f8;font-size:15px;line-height:1.5">${esc(v).replace(/\n/g, '<br>')}</td></tr>`
          )
          .join('')}
      </table>
      <p style="margin:18px 0 0;font-size:12px;color:#8b84a0">Reply to this email to answer ${esc(oneLine(name))} directly.</p>
    </td></tr>
  </table></body></html>`
  return { subject, text, html, name, email }
}
