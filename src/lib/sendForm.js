/**
 * Form delivery — no backend server.
 *
 * Main route (recommended): VITE_FORM_PROVIDER=smtp
 *   The browser posts to /api/contact (api/contact.js, a Vercel serverless function),
 *   which sends the email through your SMTP mailbox. Credentials stay on the server.
 *   If that route is unavailable (not deployed, not configured, mail server down) the form
 *   automatically falls back to FormSubmit so the message is not lost.
 *   Turn the fallback off with VITE_FORM_FALLBACK=off.
 *
 * Other routes: Web3Forms key, EmailJS keys, or FormSubmit with no key (see README).
 */
const env = import.meta.env
export const FORM_EMAIL = env.VITE_FORM_EMAIL || 'halchaltej.business@gmail.com'
const MODE = env.VITE_FORM_PROVIDER
const FALLBACK_OFF = String(env.VITE_FORM_FALLBACK || '').toLowerCase() === 'off'
const W3_KEY = env.VITE_WEB3FORMS_KEY
const EJS = {
  service: env.VITE_EMAILJS_SERVICE_ID,
  template: env.VITE_EMAILJS_TEMPLATE_ID,
  key: env.VITE_EMAILJS_PUBLIC_KEY,
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

export function provider() {
  if (MODE === 'smtp') return 'smtp'
  if (W3_KEY) return 'web3forms'
  if (EJS.service && EJS.template && EJS.key) return 'emailjs'
  return 'formsubmit'
}

const post = (url, body) =>
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  })

async function readJson(res) {
  try {
    return await res.clone().json()
  } catch {
    return { text: await res.text().catch(() => '') }
  }
}

function context(kind, fields) {
  const get = (k) => (fields.find(([l]) => l === k) || [])[1] || ''
  const stamp =
    new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }) + ' IST'
  const name = get('Name')
  return {
    kind,
    fields,
    name,
    email: get('Email'),
    stamp,
    rest: fields.filter(([l]) => l !== 'Name' && l !== 'Email'),
    meta: [['Submitted', stamp], ['Sent from', window.location.host]],
    subject: `Portfolio · ${kind} — ${name}`,
  }
}

/* ── routes ─────────────────────────────────────────────── */

async function viaSmtp(c) {
  let res
  try {
    res = await post('/api/contact', { kind: c.kind, fields: c.fields, page: window.location.host })
  } catch {
    const e = new Error('Could not reach the mail service. Please check your connection and try again.')
    e.retryable = true
    throw e
  }
  const data = await readJson(res)
  if (res.ok && data.success !== false) return
  // 404/405 = the /api route does not exist here (for example `vite preview` or a static host)
  const e = new Error(
    res.status === 404 || res.status === 405
      ? 'The mail service is not available on this address yet.'
      : [data.message || 'Could not send the form.', data.hint].filter(Boolean).join(' ')
  )
  e.retryable = res.status >= 500 || res.status === 404 || res.status === 405
  throw e
}

async function viaFormSubmit(c, fallback = false) {
  const body = { _subject: c.subject, _template: 'table', _captcha: 'false', 'Form type': c.kind, name: c.name, email: c.email }
  c.rest.concat(c.meta).forEach(([k, v]) => (body[k] = v))
  if (fallback) body['Delivery'] = 'Sent through the FormSubmit backup route (SMTP was unavailable)'
  const res = await post(`https://formsubmit.co/ajax/${FORM_EMAIL}`, body)
  const data = await readJson(res)
  if (!res.ok || data.success === false || data.success === 'false') throw new Error(data.message || data.text || 'Could not send the form.')
}

async function viaWeb3Forms(c) {
  const body = { access_key: W3_KEY, subject: c.subject, from_name: 'Portfolio Website', 'Form type': c.kind, name: c.name, email: c.email }
  c.rest.concat(c.meta).forEach(([k, v]) => (body[k] = v))
  const res = await post('https://api.web3forms.com/submit', body)
  const data = await readJson(res)
  if (!res.ok || data.success === false) throw new Error(data.message || 'Could not send the form.')
}

async function viaEmailJs(c) {
  const rows = [['Form type', c.kind], ['Name', c.name], ['Email', c.email], ...c.rest, ...c.meta]
  const res = await post('https://api.emailjs.com/api/v1.0/email/send', {
    service_id: EJS.service,
    template_id: EJS.template,
    user_id: EJS.key,
    template_params: {
      subject: c.subject,
      form_type: c.kind,
      name: c.name,
      email: c.email,
      reply_to: c.email,
      to_email: FORM_EMAIL,
      submitted_at: c.stamp,
      details: rows.map(([k, v]) => `${k}: ${v}`).join('\n'),
      details_html:
        '<table cellpadding="8" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">' +
        rows
          .map(
            ([k, v]) =>
              `<tr><td style="border:1px solid #e5e7eb;background:#f8fafc;font-weight:600">${esc(k)}</td><td style="border:1px solid #e5e7eb">${esc(v).replace(/\n/g, '<br>')}</td></tr>`
          )
          .join('') +
        '</table>',
    },
  })
  const data = await readJson(res)
  if (!res.ok) throw new Error(data.text || 'Could not send the form.')
}

/**
 * @param kind     label shown in the email, e.g. "Online session request"
 * @param fields   ordered array of [label, value] — must include ['Name', …] and ['Email', …]
 */
export async function sendForm(kind, fields) {
  const c = context(kind, fields)
  switch (provider()) {
    case 'smtp':
      try {
        return await viaSmtp(c)
      } catch (err) {
        if (!err.retryable || FALLBACK_OFF) throw err
        console.warn('[form] SMTP route failed, using FormSubmit backup:', err.message)
        try {
          return await viaFormSubmit(c, true)
        } catch {
          throw err // show the original problem
        }
      }
    case 'web3forms':
      return viaWeb3Forms(c)
    case 'emailjs':
      return viaEmailJs(c)
    default:
      return viaFormSubmit(c)
  }
}
