/**
 * npm run test:mail
 * Checks your SMTP credentials from .env and sends one test email. Run this before deploying.
 */
import fs from 'node:fs'
import path from 'node:path'

const file = path.resolve(process.cwd(), '.env')
if (fs.existsSync(file)) {
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    if (line.trim().startsWith('#')) continue
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*?)\s*$/)
    if (!m) continue
    let v = m[2]
    if (/^(['"]).*\1$/.test(v)) v = v.slice(1, -1)
    if (!(m[1] in process.env)) process.env[m[1]] = v
  }
} else {
  console.log('No .env file found in this folder — using environment variables only.')
}

const { readConfig, missing, transport, explain, compose } = await import('../api/_mail.js')
const cfg = readConfig()

console.log('\nMail settings being used')
console.log('  SMTP_HOST  :', cfg.host || 'MISSING')
console.log('  SMTP_PORT  :', cfg.port)
console.log('  SMTP_SECURE:', cfg.secure)
console.log('  SMTP_USER  :', cfg.user || 'MISSING')
console.log('  SMTP_PASS  :', cfg.pass ? `set (${cfg.pass.length} characters; a Gmail App Password is 16)` : 'MISSING')
console.log('  MAIL_TO    :', cfg.to || 'MISSING', '\n')

const miss = missing(cfg)
if (miss.length) {
  console.error(`Stop: these values are empty: ${miss.join(', ')}.\nFill them in .env and run this again.`)
  process.exit(1)
}

const t = transport(cfg)
try {
  await t.verify()
  console.log('Step 1 of 2: login accepted by the mail server.')
} catch (e) {
  const x = explain(e)
  console.error(`Step 1 of 2 FAILED (${x.code}).\n${x.hint}\n\nServer said: ${e.message}`)
  process.exit(1)
}

const mail = compose({
  kind: 'Test email from portfolio setup',
  fields: [['Name', 'Setup test'], ['Email', cfg.user], ['Message', 'If you can read this, your portfolio forms will reach this inbox.']],
  page: 'npm run test:mail',
})
try {
  await t.sendMail({ from: `"Portfolio Website" <${cfg.from}>`, to: cfg.to, subject: mail.subject, text: mail.text, html: mail.html })
  console.log(`Step 2 of 2: test email sent to ${cfg.to}. Check the inbox (and Spam once).`)
} catch (e) {
  const x = explain(e)
  console.error(`Step 2 of 2 FAILED (${x.code}).\n${x.hint}\n\nServer said: ${e.message}`)
  process.exit(1)
}
