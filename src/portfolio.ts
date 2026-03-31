export type Profile = {
  name: string;
  role: string;
  intro: string;
  summary: string;
  location: string;
  availability: string;
  yearsExperience: string;
};

export type Stat = {
  label: string;
  value: string;
  hint: string;
};

export type Skill = {
  name: string;
  summary: string;
};

export type TechStackItem = {
  name: string;
  kind: string;
};

export type AboutHighlight = {
  label: string;
  value: string;
};

export type EducationItem = {
  school: string;
  credential: string;
  location: string;
  period: string;
  summary: string;
};

export type Project = {
  name: string;
  summary: string;
  impact: string;
  href?: string;
  linkLabel?: string;
  tags: string[];
};

export type ContactLink = {
  label: string;
  value: string;
  href: string;
};

export type PortfolioData = {
  profile: Profile;
  stats: Stat[];
  skills: Skill[];
  techStack: TechStackItem[];
  aboutHighlights: AboutHighlight[];
  education: EducationItem[];
  projects: Project[];
  contacts: ContactLink[];
};

export const portfolioData: PortfolioData = {
  profile: {
    name: "Marc Lowel J. Castillo",
    role: "Web and Mobile Developer",
    intro: "Building reliable web and mobile experiences with clean code.",
    summary:
      "I build responsive web and mobile applications with a focus on performance, usability, and maintainable front-end architecture.",
    location: "Based in Manila, available globally",
    availability: "Open for full-time and select freelance work",
    yearsExperience: "2 years of freelancing in web and mobile development",
  },
  stats: [
    {
      label: "Total projects",
      value: "04",
      hint: "Selected live projects across service, studio, transit, and portfolio work.",
    },
    {
      label: "Primary focus",
      value: "WEB",
      hint: "Responsive front-end builds for landing pages, portfolios, and product sites.",
    },
    {
      label: "Mobile focus",
      value: "APP",
      hint: "Mobile-first thinking for transit, booking, and user-facing app experiences.",
    },
  ],
  skills: [
    {
      name: "Product direction",
      summary: "Shape scope, narrative, and product priorities.",
    },
    {
      name: "Interface design",
      summary: "Create polished UI that stays readable under real content.",
    },
    {
      name: "Rapid prototyping",
      summary: "Turn ideas into testable flows with clear interaction.",
    },
    {
      name: "Front-end delivery",
      summary: "Build responsive React UI without losing design intent.",
    },
  ],
  techStack: [
    { name: "React JS", kind: "Frontend" },
    { name: "React Native", kind: "Mobile" },
    { name: "Flutter", kind: "Cross-platform" },
    { name: "TypeScript", kind: "Language" },
    { name: "Node JS", kind: "Runtime" },
    { name: "Express JS", kind: "Backend" },
    { name: "MongoDB", kind: "Database" },
    { name: "GitHub", kind: "Version Control" },
  ],
  aboutHighlights: [
    {
      label: "Revenue generated",
      value: "\u20B1600k+",
    },
    {
      label: "Active users served",
      value: "600+",
    },
    {
      label: "Hackathon wins",
      value: "2",
    },
  ],
  education: [
    {
      school: "Polytechnic University of the Philippines",
      credential: "Bachelor of Science in Computer Science",
      location: "Sta. Mesa, Manila, Philippines",
      period: "2024 - Present",
      summary:
        "Current degree track focused on computer science fundamentals and applied software development.",
    },
    {
      school: "Polytechnic University of the Philippines - SHS",
      credential: "Information and Communications Technology Strand",
      location: "Sta. Mesa, Manila, Philippines",
      period: "2022 - 2024",
      summary:
        "Completed senior high school with focused ICT coursework and strong academic standing.",
    },
  ],
  projects: [
    {
      name: "Laundry King MNL",
      summary:
        "Laundry service website with a conversion-focused hero, service navigation, and a direct pickup booking call to action.",
      impact:
        "Gave Laundry King MNL a clear online storefront that guides visitors toward booking and trust-building service details.",
      href: "https://laundrykingmnl.com/",
      tags: ["Service website", "Responsive UI", "Booking flow"],
    },
    {
      name: "Moss Manila",
      summary:
        "Interior and event design studio site with polished editorial sections, portfolio storytelling, and contact-driven calls to action.",
      impact:
        "Helped present the studio with a cleaner premium web presence that supports inquiries and showcases visual work effectively.",
      href: "https://mossmanila.net/",
      tags: ["Studio website", "Content layout", "Responsive build"],
    },
    {
      name: "Sakai",
      summary:
        "Voice-first jeepney and transit planner landing page for Metro Manila with app-focused product messaging and launch-ready presentation.",
      impact:
        "Turned the app idea into a focused product landing page that explains the value fast and supports user download intent.",
      href: "https://heysakai.vercel.app/",
      tags: ["Service website", "UI implementation", "Mobile-first"],
    },
    {
      name: "Matricare",
      summary:
        "Pregnancy support app for women to track their due date, monitor progress, and manage maternity-related appointments in one place.",
      impact:
        "Designed to help expecting mothers stay on top of due-date tracking, appointment booking, and essential pregnancy care workflows.",
      href: "https://github.com/snplmntn/matricare-web",
      linkLabel: "Visit GitHub",
      tags: ["Health app", "Appointment booking", "Pregnancy tracking"],
    },
  ],
  contacts: [
    {
      label: "Email",
      value: "marccastilo621@gmail.com",
      href: "https://mail.google.com/mail/?view=cm&fs=1&to=marccastilo621@gmail.com",
    },
    {
      label: "LinkedIn",
      value: "linkedin.com/in/mrccastillo",
      href: "https://www.linkedin.com/in/mrccastillo/",
    },
    {
      label: "GitHub",
      value: "github.com/mrccastillo",
      href: "https://github.com/mrccastillo",
    },
  ],
};
