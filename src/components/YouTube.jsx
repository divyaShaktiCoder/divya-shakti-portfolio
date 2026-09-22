import { useState } from 'react'
import { ArrowUpRight, Play, Handshake, Megaphone, Clapperboard, Code2 } from 'lucide-react'
import { SOCIALS, YOUTUBE } from '../data/site.js'
import { CHANNELS, VIDEOS } from '../data/videos.js'
import { avatar } from '../data/images.js'
import { openContact } from '../hooks/useLenis.js'
import { TelegramIcon, YoutubeIcon } from './Icons.jsx'
import Reveal from './Reveal.jsx'
import Carousel from './Carousel.jsx'
import SplitText from './SplitText.jsx'

const COLLAB_ICONS = [Clapperboard, Megaphone, Handshake]

function VideoCard({ v, delay }) {
  const [play, setPlay] = useState(false)
  return (
    <Reveal as="article" delay={delay} className="video-card" data-tilt>
      <div className="video-thumb">
        {play ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0`}
            title={v.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <button onClick={() => setPlay(true)} aria-label={`Play video: ${v.title}`}>
            <img
              src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
              alt={`${v.title} — thumbnail`}
              width="480"
              height="360"
              loading="lazy"
              decoding="async"
            />
            <span className="play-badge">
              <Play size={22} fill="currentColor" aria-hidden="true" />
            </span>
          </button>
        )}
      </div>
      <div className="video-body">
        <p className="video-tag">
          <span>{v.tag}</span>
          <span className="video-ch">{CHANNELS[v.channel]}</span>
        </p>
        <h4>{v.title}</h4>
        <p className="video-desc">{v.description}</p>
        <a className="video-link" href={`https://youtu.be/${v.id}`} target="_blank" rel="noopener noreferrer">
          Watch on YouTube <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </div>
    </Reveal>
  )
}

export default function YouTube() {
  const own = VIDEOS.filter((v) => v.channel === 'halchal')
  const manish = VIDEOS.filter((v) => v.channel === 'manish')

  return (
    <section id="youtube" className="section" data-nav="youtube" aria-labelledby="yt-title">
      <div className="container">
        <Reveal className="section-head">
          <div>
            <span className="pill-label">
              <Code2 size={14} aria-hidden="true" /> Publishing
            </span>
            <SplitText as="h2" id="yt-title" className="h2" text={`The *${YOUTUBE.channel.split(' ')[0]}* ${YOUTUBE.channel.split(' ')[1]} Channel`} />
          </div>
          <a className="btn btn-ghost btn-sm" href={SOCIALS.youtube} target="_blank" rel="noopener noreferrer">
            Visit Channel <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </Reveal>

        <div className="yt-top">
          <Reveal className="yt-card">
            <div className="yt-id">
              <img src={avatar} alt="Divya Shakti — HalChal Tej" width="64" height="64" loading="lazy" />
              <div>
                <h3>{YOUTUBE.channel}</h3>
                <p>{YOUTUBE.handle} · YouTube</p>
              </div>
            </div>
            <p className="yt-blurb">{YOUTUBE.blurb}</p>
            <a className="video-link yt-more" href="/halchal-tej/">
              Read more about the channel <ArrowUpRight size={15} aria-hidden="true" />
            </a>
            <dl className="yt-stats">
              {YOUTUBE.stats.map((s) => (
                <div key={s.label}>
                  <dt>{s.value}</dt>
                  <dd>{s.label}</dd>
                </div>
              ))}
            </dl>
            <div className="yt-actions">
              <a className="btn btn-yt" href={`${SOCIALS.youtube}?sub_confirmation=1`} target="_blank" rel="noopener noreferrer">
                <YoutubeIcon width={20} height={20} /> Subscribe
              </a>
              <a className="btn btn-ghost" href={SOCIALS.telegram} target="_blank" rel="noopener noreferrer">
                <TelegramIcon width={18} height={18} /> Join on Telegram
              </a>
            </div>
          </Reveal>

          <div className="yt-pillars">
            {YOUTUBE.pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 90} className="pillar">
                <span className="pillar-n">0{i + 1}</span>
                <div>
                  <h4>{p.title}</h4>
                  <p>{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {own.length > 0 && (
          <>
            <SplitText as="h3" className="sub-h" text="Must-watch tutorials on the channel" />
            <Carousel className="video-grid" label="video">
              {own.map((v, i) => (
                <VideoCard key={v.id} v={v} delay={(i % 3) * 90} />
              ))}
            </Carousel>
          </>
        )}

        <SplitText as="h3" className="sub-h" text="Collaborations & brand promotions" />
        <Reveal as="p" className="lead-muted collab-lead">
          I make videos for other channels too and collaborate with creators and brands — many of these videos have crossed 20K+ views.
        </Reveal>

        {manish.length > 0 && (
          <div className="collab-videos">
            <Reveal as="h4" className="mini-h">
              With Manish Digital Academy
            </Reveal>
            <Carousel className="video-grid" label="collaboration video">
              {manish.map((v, i) => (
                <VideoCard key={v.id} v={v} delay={(i % 3) * 90} />
              ))}
            </Carousel>
          </div>
        )}

        <Carousel className="collab-grid" label="collaboration type">
          {YOUTUBE.collab.map((c, i) => {
            const Icon = COLLAB_ICONS[i]
            return (
              <Reveal key={c.title} delay={i * 90} className="collab-card" data-tilt>
                <span className="collab-icon">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <h4>{c.title}</h4>
                <p>{c.text}</p>
              </Reveal>
            )
          })}
        </Carousel>
        <Reveal className="collab-cta">
          <button className="btn btn-primary" onClick={() => openContact('collab')}>
            Collaborate with me <ArrowUpRight size={18} aria-hidden="true" />
          </button>
        </Reveal>
      </div>
    </section>
  )
}
