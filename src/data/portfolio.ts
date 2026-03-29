export type Profile = {
  name: string
  role: string
  intro: string
  summary: string
  location: string
  availability: string
  yearsExperience: string
}

export type Stat = {
  label: string
  value: string
  hint: string
}

export type Skill = {
  name: string
  summary: string
}

export type TechStackItem = {
  name: string
  kind: string
}

export type Project = {
  name: string
  summary: string
  impact: string
  tags: string[]
}

export type ContactLink = {
  label: string
  value: string
  href: string
}

export type PortfolioData = {
  profile: Profile
  stats: Stat[]
  skills: Skill[]
  techStack: TechStackItem[]
  projects: Project[]
  contacts: ContactLink[]
}

export const portfolioData: PortfolioData = {
  profile: {
    name: 'Mira Sol',
    role: 'Product Designer & Front-End Builder',
    intro: 'Designing calm interfaces with sharp product thinking.',
    summary:
      'I create portfolio-worthy digital products that balance visual identity, interaction clarity, and implementation detail. My work is strongest where product strategy, UI systems, and front-end craft overlap.',
    location: 'Based in Manila, available globally',
    availability: 'Open for full-time and select freelance work',
    yearsExperience: '6+ years shaping design systems and launch-ready web experiences',
  },
  stats: [
    {
      label: 'Total projects',
      value: '27',
      hint: 'Shipped across product, brand, and portfolio work.',
    },
    {
      label: 'Launch partners',
      value: '14',
      hint: 'Startups and in-house teams supported from concept to release.',
    },
    {
      label: 'Design systems',
      value: '05',
      hint: 'Reusable UI foundations built for scale and handoff speed.',
    },
  ],
  skills: [
    {
      name: 'Product direction',
      summary: 'Shape scope, narrative, and decision-making around the user journey.',
    },
    {
      name: 'Interface design',
      summary: 'Create polished visual systems that stay readable under real content.',
    },
    {
      name: 'Rapid prototyping',
      summary: 'Translate ideas into testable flows with a strong interaction layer.',
    },
    {
      name: 'Front-end delivery',
      summary: 'Build responsive React interfaces without losing visual intent.',
    },
  ],
  techStack: [
    { name: 'Figma', kind: 'Design' },
    { name: 'React', kind: 'UI' },
    { name: 'TypeScript', kind: 'Language' },
    { name: 'Tailwind', kind: 'Styling' },
    { name: 'Framer', kind: 'Prototype' },
    { name: 'Storybook', kind: 'System' },
    { name: 'Notion', kind: 'Ops' },
    { name: 'GitHub', kind: 'Delivery' },
  ],
  projects: [
    {
      name: 'Northstar Finance',
      summary: 'Editorial dashboard redesign for a budgeting platform serving first-time investors.',
      impact: 'Improved onboarding completion by clarifying account setup milestones.',
      tags: ['UX audit', 'Dashboard UI', 'Design system'],
    },
    {
      name: 'Atelier Studio',
      summary: 'High-touch portfolio and booking experience for a boutique creative practice.',
      impact: 'Turned a static brochure site into a conversion-focused service funnel.',
      tags: ['Brand web', 'Art direction', 'Responsive build'],
    },
    {
      name: 'Orbit Notes',
      summary: 'Concept-to-prototype productivity app built around focus rituals and lightweight planning.',
      impact: 'Validated the core workflow before engineering investment in v1.',
      tags: ['Product concept', 'Prototype', 'User flows'],
    },
  ],
  contacts: [
    {
      label: 'Email',
      value: 'hello@mirasol.design',
      href: 'mailto:hello@mirasol.design',
    },
    {
      label: 'LinkedIn',
      value: 'linkedin.com/in/mirasol',
      href: 'https://www.linkedin.com/',
    },
    {
      label: 'Behance',
      value: 'behance.net/mirasol',
      href: 'https://www.behance.net/',
    },
  ],
}
