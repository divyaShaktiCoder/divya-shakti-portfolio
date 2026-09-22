const ROW_A = ['n8n', 'Agentic AI', 'MERN Stack', 'React', 'Generative AI', 'Node.js', 'LangChain', 'Three.js', 'AI Agents', 'MongoDB']
const ROW_B = ['Workflow Automation', 'LangGraph', 'Prompt Engineering', 'REST APIs', 'Socket.IO', 'TypeScript', 'Python', 'Express.js', 'Voice Agents', 'Docker']

function Row({ items, reverse }) {
  const list = [...items, ...items]
  return (
    <div className={`marquee-row ${reverse ? 'is-reverse' : ''}`}>
      <div className="marquee-track">
        {list.map((t, i) => (
          <span key={i} className={i % 2 ? 'is-solid' : ''}>
            {t}
            <i aria-hidden="true">✦</i>
          </span>
        ))}
      </div>
    </div>
  )
}

/** Decorative infinite ticker of the stack. Hidden from assistive tech. */
export default function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <Row items={ROW_A} />
      <Row items={ROW_B} reverse />
    </div>
  )
}
