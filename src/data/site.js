/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONTENT — edit text, links and numbers here.
 *  Everything on the page reads from /src/data/*.js
 * ─────────────────────────────────────────────────────────────
 */

export const SITE = {
  name: 'Divya Shakti',
  short: 'DS',
  handle: 'dscoder1',
  // Public contact address shown on the site. Form delivery is configured in .env (see src/lib/sendForm.js).
  email: 'halchaltej.business@gmail.com',
  location: 'India',
  role: 'Full Stack MERN Developer',
  tagline:
    'I build full-stack products and Agentic AI systems — and teach automation on YouTube as HalChal Tej.',
}

export const SOCIALS = {
  github: 'https://github.com/dscoder1',
  linkedin: 'https://www.linkedin.com/in/divyashakti510/',
  youtube: 'https://www.youtube.com/@halchaltej',
  telegram: 'https://t.me/HalChalTej',
  instagram: 'https://www.instagram.com/halchaltej/',
  mail: 'mailto:halchaltej.business@gmail.com',
}

export const NAV = [
  { id: 'home', label: 'Home' },
  { id: 'projects', label: 'Projects' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
]

export const HERO = {
  ghost: ['FULL STACK', 'AI BUILDER'],
  pills: ['MERN Developer', 'Agentic AI Builder', 'n8n Automation', 'Tech YouTuber'],
}

// value + suffix animate on scroll
export const STATS = [
  { value: 60, suffix: '+', label: 'Videos published' },
  { value: 1.2, suffix: 'K+', label: 'YouTube subscribers', decimals: 1 },
  { value: 20, suffix: '+', label: 'Agentic AI workflows' },
  { value: 5, suffix: '+', label: 'AI agents sold' },
]

export const ABOUT = {
  eyebrow: 'About me',
  lead: 'I build systems that think, automate and ship.',
  paragraphs: [
    [
      'First-year ',
      { b: 'MCA student at the University of Delhi' },
      ' (AIR 89, CUET-PG 2026) with a BCA at 8.61 CGPA. I work across ',
      { b: 'MERN full-stack development, Agentic AI and n8n automation' },
      '.',
    ],
    [
      { b: '20+ Agentic AI workflows' },
      ' built, ',
      { b: '5+ AI agents' },
      ' sold, 3 internships (one with a Government of Bihar organisation) and selected for ',
      { b: 'TCS Ignite 2026' },
      ' as a System Engineer. I also run ',
      { b: 'HalChal Tej' },
      ' on YouTube.',
    ],
  ],
  badges: ['MCA · University of Delhi', 'TCS Ignite 2026', 'AIR 89 · CUET-PG'],
  tiles: [
    { value: 3, suffix: '', label: 'Internships' },
    { value: 50, suffix: '+', label: 'Hackathons' },
    { value: 25, suffix: '+', label: 'Teams led' },
    { value: 8.61, suffix: '', label: 'BCA CGPA', decimals: 2 },
  ],
  focus: [
    { icon: 'Layers', title: 'Full-stack products', text: 'MERN apps with authentication, real-time features and clean, responsive UI.' },
    { icon: 'Bot', title: 'Agentic AI & automation', text: 'AI agents and n8n workflows that do real work — 20+ built, 5+ sold.' },
    { icon: 'Clapperboard', title: 'Teaching & content', text: '60+ videos on Generative AI, Agentic AI and n8n, plus videos for other channels.' },
  ],
}

export const TOOLKIT = [
  { group: 'Frontend', items: ['React.js', 'HTML5', 'CSS3', 'Bootstrap', 'Responsive Design'] },
  { group: 'Backend', items: ['Node.js', 'Express.js', 'RESTful APIs'] },
  { group: 'Databases', items: ['MongoDB (Mongoose)', 'MySQL', 'Redis'] },
  { group: 'AI & Automation', items: ['Generative AI', 'AI Agents', 'n8n', 'LangChain', 'LangGraph', 'Prompt Engineering'] },
  { group: 'Languages', items: ['Python', 'JavaScript', 'TypeScript', 'C++', 'C', 'Java'] },
  { group: 'Tools', items: ['Git', 'GitHub', 'Docker', 'VS Code'] },
  { group: 'Core', items: ['Data Structures & Algorithms', 'OOP', 'Full-Stack Development', 'UI/UX', 'API Integration'] },
  { group: 'Soft skills', items: ['Leadership', 'Problem-Solving', 'Team Collaboration', 'Communication', 'Project Management'] },
]

// Quick-scan chips for the "Technical Arsenal" block
export const ARSENAL = [
  'React.js', 'Node.js', 'Express.js', 'MongoDB', 'Three.js', 'JavaScript', 'Python',
  'n8n', 'Agentic AI', 'Generative AI', 'LangChain', 'LangGraph', 'Prompt Engineering',
  'REST APIs', 'Docker', 'Redis', 'MySQL', 'Git & GitHub',
]

export const EDUCATION = [
  {
    school: 'University of Delhi — New Delhi, India',
    degree: 'Master of Computer Applications (MCA), Computer Science',
    period: 'Aug 2026 – Aug 2028 (Expected)',
    note: 'Admitted with AIR 89 in CUET-PG 2026',
  },
  {
    school: 'L. N. Mishra Institute of Economic Development & Social Change, Patna',
    degree: "Bachelor's in Computer Application",
    period: 'Aug 2023 – Aug 2026',
    note: 'CGPA 8.61 · 2nd-highest BCA scorer',
  },
  {
    school: 'High School Masadh',
    degree: 'Intermediate (Grade 12)',
    period: 'Apr 2021 – Apr 2023',
    note: '86%',
  },
]

export const ACHIEVEMENTS = [
  { title: 'AIR 89 — CUET-PG 2026', org: 'Admission to MCA (Computer Science), University of Delhi', badge: 'AIR 89' },
  { title: 'TCS Ignite 2026', org: 'Offer letter & joining letter received — System Engineer', badge: 'Offer' },
  { title: 'Winner — IIT-BHU Civic Tech Hackathon', org: 'NagarikSeva · Swachh Bharat Smart City Management System', badge: 'Winner' },
  { title: 'Social Web Designing Competition', org: 'Amity University Patna · SocioUse', badge: '2nd' },
  { title: 'HackIT 2025', org: 'Amity University · Student Alumni Mentorship Platform', badge: '3rd' },
  { title: 'ChemRush', org: 'IIT Patna · Innovative instrument-based project', badge: '3rd' },
  { title: '2nd-Highest BCA Scorer', org: 'L. N. Mishra Institute, Patna · 8.61 CGPA', badge: '8.61' },
  { title: '3 Web Development Internships', org: 'Including a Government of Bihar internship', badge: '3×' },
  { title: '50+ Hackathons & Tech Events', org: 'Led teams in 25+ · IITs, NITs, IIT-BHU, Amity and more', badge: '50+' },
]

export const JOURNEY = [
  {
    period: 'Aug 2026 – Aug 2028 (Expected)',
    title: 'University of Delhi',
    role: 'MCA, Computer Science',
    text: 'Started my MCA at the University of Delhi after securing AIR 89 in CUET-PG 2026.',
    type: 'edu',
    now: true,
  },
  {
    period: 'Dec 2025 – Feb 2026',
    title: 'SBPDCL, Patna, Bihar',
    role: 'Full-Stack & AI Automation Intern',
    text: 'Developed a full-stack Agentic AI complaint management system integrating AI agents, task automation, workflow management and backend APIs to modernize manual complaint registration, processing and resolution.',
    type: 'work',
  },
  {
    period: 'Nov 2025 – Present',
    title: 'HalChal Tej & Manish Digital Academy',
    role: 'Technical Content Creator & Strategist · YouTube',
    text: 'Created technical content on Generative AI, Agentic AI, n8n and workflow automation — 60+ videos, 20+ Agentic AI workflows built, and 5+ AI agents developed and sold for real-world use cases.',
    type: 'work',
    now: true,
  },
  {
    period: 'Jun 2025 – Jul 2025',
    title: 'Evego Event Pvt. Ltd.',
    role: 'Full-Stack Web Development Intern',
    text: 'Developed a MERN-based Event Management web application using RESTful APIs and AI for end-to-end functionality.',
    type: 'work',
  },
  {
    period: 'May 2025 – Jul 2025',
    title: 'Daayitva Cure Pvt. Ltd.',
    role: 'Web Development Intern',
    text: 'Developed a full-stack Trip Management System using MERN, integrating Gen AI for the best trip planning and personalized travel assistance.',
    type: 'work',
  },
  {
    period: 'Aug 2023 – Aug 2026',
    title: 'L. N. Mishra Institute, Patna',
    role: "Bachelor's in Computer Application",
    text: 'Graduated with an 8.61 CGPA as the 2nd-highest BCA scorer at the institute.',
    type: 'edu',
  },
  {
    period: 'Apr 2021 – Apr 2023',
    title: 'High School Masadh',
    role: 'Intermediate (Grade 12)',
    text: 'Completed Intermediate with 86%.',
    type: 'edu',
  },
]

export const YOUTUBE = {
  channel: 'HalChal Tej',
  handle: '@halchaltej',
  blurb:
    'A tech channel on Generative AI, Agentic AI, n8n and workflow automation — practical builds you can follow along and ship.',
  stats: [
    { value: '1.2K+', label: 'Subscribers' },
    { value: '60+', label: 'Videos' },
    { value: '20+', label: 'Agentic AI workflows' },
    { value: '5+', label: 'AI agents sold' },
  ],
  pillars: [
    { title: 'Generative AI', text: 'Prompt engineering and AI-powered applications, explained by building them.' },
    { title: 'Agentic AI', text: 'AI agents and multi-step workflows that plan, call tools and finish real tasks.' },
    { title: 'n8n Automation', text: 'Workflow automation with n8n — from first workflow to client-ready systems.' },
  ],
  collab: [
    {
      title: 'Videos for other channels',
      text: 'I create technical videos for other channels too — many of them have crossed 20K+ views.',
    },
    {
      title: 'Brand promotions & sponsorships',
      text: 'Product promotion, sponsored content and brand collaborations on the HalChal Tej channel.',
    },
    {
      title: 'Manish Digital Academy',
      text: 'Ongoing collaboration with Manish Digital Academy (40K+ subscribers) — joint n8n and automation videos.',
    },
  ],
}
