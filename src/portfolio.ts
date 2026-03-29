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

export type AboutHighlight = {
  label: string
  value: string
}

export type EducationItem = {
  school: string
  credential: string
  location: string
  period: string
  summary: string
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
  aboutHighlights: AboutHighlight[]
  education: EducationItem[]
  projects: Project[]
  contacts: ContactLink[]
}

export const portfolioData: PortfolioData = {
  profile: {
    name: 'Marc Lowel J. Castillo',
    role: 'Web and Mobile Developer',
    intro: 'Building reliable web and mobile experiences with clean code.',
    summary:
      'I build responsive web and mobile applications with a focus on performance, usability, and maintainable front-end architecture.',
    location: 'Based in Manila, available globally',
    availability: 'Open for full-time and select freelance work',
    yearsExperience: '2 years of freelancing in web and mobile development',
  },
  stats: [
    {
      label: 'Total projects',
      value: '27',
      hint: 'Shipped across product, brand, and portfolio work.',
    },
    {
      label: 'Primary focus',
      value: 'WEB',
      hint: 'React JS, TypeScript, and responsive front-end implementation.',
    },
    {
      label: 'Mobile focus',
      value: 'APP',
      hint: 'React Native and Flutter builds for mobile-first products.',
    },
  ],
  skills: [
    {
      name: 'Product direction',
      summary: 'Shape scope, narrative, and product priorities.',
    },
    {
      name: 'Interface design',
      summary: 'Create polished UI that stays readable under real content.',
    },
    {
      name: 'Rapid prototyping',
      summary: 'Turn ideas into testable flows with clear interaction.',
    },
    {
      name: 'Front-end delivery',
      summary: 'Build responsive React UI without losing design intent.',
    },
  ],
  techStack: [
    { name: 'React JS', kind: 'Frontend' },
    { name: 'React Native', kind: 'Mobile' },
    { name: 'Flutter', kind: 'Cross-platform' },
    { name: 'TypeScript', kind: 'Language' },
    { name: 'Node JS', kind: 'Runtime' },
    { name: 'Express JS', kind: 'Backend' },
    { name: 'MongoDB', kind: 'Database' },
    { name: 'GitHub', kind: 'Version Control' },
  ],
  aboutHighlights: [
    {
      label: 'Stack',
      value: 'React JS, React Native, Flutter, Node JS',
    },
    {
      label: 'Build style',
      value: 'Responsive UI, clean structure, and maintainable front-end code',
    },
    {
      label: 'Current goal',
      value: 'Looking for freelance work, internships, and junior dev opportunities',
    },
  ],
  education: [
    {
      school: 'Polytechnic University of the Philippines',
      credential: 'Bachelor of Science in Computer Science',
      location: 'Sta. Mesa, Manila, Philippines',
      period: '2024 - Present',
      summary: 'Current degree track focused on computer science fundamentals and applied software development.',
    },
    {
      school: 'Polytechnic University of the Philippines - SHS',
      credential: 'Information and Communications Technology Strand',
      location: 'Sta. Mesa, Manila, Philippines',
      period: '2022 - 2024',
      summary: 'Completed senior high school with focused ICT coursework and strong academic standing.',
    },
  ],
  projects: [
    {
      name: 'Northstar Finance',
      summary: 'Dashboard redesign for a budgeting platform for first-time investors.',
      impact: 'Clarified setup milestones and improved onboarding completion.',
      tags: ['UX audit', 'Dashboard UI', 'Design system'],
    },
    {
      name: 'Atelier Studio',
      summary: 'Portfolio and booking flow for a boutique creative practice.',
      impact: 'Turned a brochure site into a conversion-focused service funnel.',
      tags: ['Brand web', 'Art direction', 'Responsive build'],
    },
    {
      name: 'Orbit Notes',
      summary: 'Productivity concept built around focus rituals and lightweight planning.',
      impact: 'Validated the core workflow before engineering committed to v1.',
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
      label: 'GitHub',
      value: 'github.com/mrccastillo',
      href: 'https://github.com/mrccastillo',
    },
  ],
}
