/**
 * PROJECTS
 * groups:  'wins' | 'fullstack' | 'ai' | 'automation'   (a project can be in several)
 * images:  file names (without .webp) inside /src/assets/projects — first one is the card cover.
 *          Projects without images get a generated cover using `icon` + `hue`.
 * links:   { label, href, kind: 'live' | 'github' }
 */
export const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'wins', label: 'Hackathon Wins' },
  { id: 'fullstack', label: 'Full Stack' },
  { id: 'ai', label: 'AI & Agents' },
  { id: 'automation', label: 'n8n Automation' },
]

export const PROJECTS = [
  {
    id: 'nagarikseva',
    title: 'NagarikSeva — Your Voice, Your City',
    subtitle: 'Swachh Bharat · Smart City Management System',
    label: 'Winner · IIT-BHU Hackathon 2024',
    win: true,
    groups: ['wins', 'fullstack'],
    summary:
      'A smart city platform where citizens report urban issues like waste, water quality and infrastructure problems — with location-based complaints, real-time SMS notifications and AQI updates.',
    highlights: [
      'Location-based citizen complaints with real-time SMS notifications',
      'Live Air Quality Index (AQI) updates',
      'Secure authentication, complaint categorization, and fraud detection with account suspension logic',
      'Analytics on issue trends so authorities can prioritize responses and manage the city more efficiently',
    ],
    tags: ['React.js', 'Node.js', 'MongoDB', 'Task Automation'],
    images: ['NagarikSeva1'],
    links: [{ label: 'Live demo', href: 'https://nagarik-seva-frontend.vercel.app/', kind: 'live' }],
  },
  {
    id: 'sociouse',
    title: 'SocioUse — Real-Time Social Media Platform',
    subtitle: 'MERN Stack · Socket.IO',
    label: '2nd Place · Amity University Patna',
    win: true,
    groups: ['wins', 'fullstack'],
    summary:
      'A full-featured real-time social media web app: posts, video sharing, follows, comments, live chat and calling, dynamic profiles and social sharing — all updating live through sockets.',
    highlights: [
      'Post, like, comment and upload videos',
      'Real-time chat and calling',
      'Follow system and dynamic profile updates',
      'Social sharing to Facebook, WhatsApp, LinkedIn and Instagram',
      'Seamless live updates across every feature using sockets and efficient state management',
    ],
    tags: ['MERN', 'Socket.IO', 'Real-time Chat'],
    images: ['SocioUse1', 'SocioUse2', 'SocioUse3', 'SocioUse4'],
    links: [{ label: 'GitHub', href: 'https://github.com/dscoder1/SocialMediaWebsite', kind: 'github' }],
    note: 'Social Web Designing Competition, Amity University Patna',
  },
  {
    id: 'mentorship',
    title: 'Student Alumni Mentorship Platform',
    subtitle: 'MERN Stack · Career guidance',
    label: '3rd Place · HackIT 2025',
    win: true,
    groups: ['wins', 'fullstack'],
    summary:
      'A MERN mentorship platform where students access curated job-search playlists based on their interests and connect with alumni through secure one-on-one video calls.',
    highlights: [
      'Curated job-search playlists based on student interests',
      'Secure one-on-one video calls between students and alumni using unique session links',
      'Admin panel for managing student and alumni profiles and monitoring platform activity',
      'Designed to enhance career guidance and streamline student–alumni interaction',
    ],
    tags: ['MERN', 'Video Calls', 'Admin Panel'],
    images: ['Mentorship1', 'Mentorship2', 'Mentorship3', 'Mentorship4'],
    links: [{ label: 'GitHub', href: 'https://github.com/dscoder1/StudentAlumniMentorship', kind: 'github' }],
    note: 'HackIT 2025, Amity University',
  },
  {
    id: 'agroworld',
    title: 'AgroWorld — Farmers’ Marketplace',
    subtitle: 'MERN Stack · Agri-commerce',
    label: 'MERN · Full Stack',
    groups: ['fullstack'],
    summary:
      'A MERN web platform where farmers sell and buy seeds, crops, vegetables, fertilizers and pesticides, with separate roles for farmers, delivery personnel and admins.',
    highlights: [
      'Role-based secure login with dynamic dashboards for farmers, delivery personnel and admins',
      'Order placement, tracking and allocation with real-time location and product management',
      'Admin panel to manage users, products, services and delivery operations',
    ],
    tags: ['MERN', 'Role-based Auth', 'Order Tracking'],
    images: ['AgroWorld1', 'AgroWorld2', 'AgroWorld3', 'AgroWorld4', 'AgroWorld5'],
    links: [{ label: 'GitHub', href: 'https://github.com/dscoder1/Agroworld', kind: 'github' }],
  },
  {
    id: 'flood-alert',
    title: 'Flood Alert & Emergency Reporting',
    subtitle: 'Real-time alerts for flood situations',
    label: 'Web App · Emergency Tech',
    groups: ['fullstack'],
    summary:
      'A flood alert and emergency reporting website that lets people send real-time alerts to security authorities, with location tracking, audio/video recording and a nearby safe-places locator.',
    highlights: [
      'Real-time alerts to security authorities during critical flood situations',
      'Location tracking, video/audio recording and detailed user reporting for accurate emergency response',
      'Nearby places locator to help people find safe zones and shelters quickly',
      'Contact form for direct communication with emergency management organizations',
    ],
    tags: ['Real-time Alerts', 'Geolocation', 'Safe-zone Finder'],
    images: ['Flood1', 'Flood2', 'Flood3', 'Flood4'],
    links: [{ label: 'Live demo', href: 'https://dscoder1.github.io/Flood-Alert/', kind: 'live' }],
  },
  {
    id: 'web-playground',
    title: 'Web App Playground',
    subtitle: 'HTML · CSS · JavaScript · React.js · APIs',
    label: 'Collection · Frontend',
    groups: ['fullstack'],
    summary:
      'A set of web apps — code editor, voice assistant, cricket info portal, news website, weather app and movie browser — with live data fetching and responsive UIs.',
    highlights: [
      'Code editor, voice assistant, cricket info portal, news website, weather app and movie browser',
      'Real-time data fetching from APIs and voice-recognition features',
      'Clean, responsive UI/UX that works across devices',
    ],
    tags: ['HTML', 'CSS', 'JavaScript', 'React.js', 'APIs'],
    images: ['Project1', 'Project2', 'Project3', 'Project4'],
    links: [{ label: 'Live demo', href: 'https://dscoder1.github.io/My-All-Project/', kind: 'live' }],
  },

  /* ── AI, agents & automation ───────────────────────────── */
  {
    id: 'nexora',
    title: 'NEXORA — Build AI. Automate Work.',
    subtitle: 'Powered by HalChal Tej',
    label: 'AI Agency · Brand Site',
    groups: ['ai', 'fullstack'],
    icon: 'Sparkles',
    hue: 268,
    summary:
      'A premium site for an AI agent and automation business powered by HalChal Tej — services, proof, videos, social links and the founder story in one animated experience.',
    highlights: [
      'Positioned as an AI agent & automation business — not just a personal portfolio',
      'Sections for services, collaboration, brand partnerships, AI agents & automation, technology content, portfolio and contact',
      'Contact form with inquiry types for brand collaboration, sponsored content, AI agents/automation, YouTube collabs and more',
      'No login or signup for visitors — one clear way to get in touch',
    ],
    tags: ['React', 'Three.js', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    id: 'cityfix',
    title: 'CityFix AI — Civic Issue Reporting',
    subtitle: 'MERN · Local AI with Ollama',
    label: 'AI Agent · Civic Tech',
    groups: ['ai', 'fullstack'],
    icon: 'MapPinned',
    hue: 210,
    summary:
      'A full-stack civic issue reporting and resolution tracker: citizens report problems with a photo, an AI pipeline classifies and drafts the report, and unresolved issues escalate automatically.',
    highlights: [
      'AI pipeline on local Ollama — moondream for image classification, gemma2:2b for drafting, clarification and escalation notes',
      'Citizen and admin roles with JWT authentication',
      'Scheduled escalation job for unresolved issues',
      'Map-based view of reported issues',
    ],
    tags: ['MERN', 'Ollama', 'node-cron', 'Leaflet'],
  },
{
    id: 'resume-screening',
    title: 'AI Resume Screening System',
    subtitle: 'n8n · Built for clients',
    label: 'n8n Automation · Client Build',
    groups: ['automation', 'ai'],
    icon: 'Workflow',
    hue: 262,
    summary:
      'An automated screening pipeline: a web form takes the job description and resumes, an n8n webhook scores candidates with OpenAI, and the right emails and interview invites go out automatically.',
    highlights: [
      'Web form → n8n webhook → OpenAI scoring of each candidate',
      'Selection and rejection emails routed automatically',
      'Interview scheduling through Cal.com',
      'Every result logged to Google Sheets',
    ],
    tags: ['n8n', 'OpenAI', 'Cal.com', 'Google Sheets'],
  },
  {
    id: 'lead-gen',
    title: 'Outbound Lead Generation Pipeline',
    subtitle: 'n8n · Two-workflow cold outreach system',
    label: 'n8n Automation · Outreach',
    groups: ['automation', 'ai'],
    icon: 'Send',
    hue: 305,
    summary:
      'A two-workflow cold-outreach system in n8n that finds leads, filters them for relevance, personalizes the email and sends it — end to end.',
    highlights: [
      'Apify for LinkedIn scraping',
      'OpenAI for relevance filtering and email personalization',
      'Anymailfinder and Perplexity AI for contact and company research',
      'Google Sheets and Instantly.ai to track and send outreach',
    ],
    tags: ['n8n', 'OpenAI', 'Apify', 'Instantly.ai'],
  }
]
