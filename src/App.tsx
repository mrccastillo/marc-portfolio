import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { portfolioData } from "./portfolio";

const HOME_PATH = "/";
const PROJECTS_PATH = "/projects";
const HOME_HREF = "./";
const PROJECTS_HREF = "./#/projects";
const [headlineStat, ...supportingStats] = portfolioData.stats;
const [featuredProject, ...moreProjects] = portfolioData.projects;
const homeMoreProjects = moreProjects.slice(0, 1);

function App() {
  const [pathname, setPathname] = useState(() => getCurrentPath());
  const [pendingAnchor, setPendingAnchor] = useState<string | null>(() =>
    getCurrentAnchor(),
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const previousPathname = useRef(pathname);
  const lastHandledAnchor = useRef<string | null>(null);
  const primaryNavItems = getPrimaryNavItems(pathname);

  useEffect(() => {
    const syncLocation = () => {
      setPathname(getCurrentPath());
      setPendingAnchor(getCurrentAnchor());
    };

    syncLocation();
    window.addEventListener("popstate", syncLocation);
    window.addEventListener("hashchange", syncLocation);

    return () => {
      window.removeEventListener("popstate", syncLocation);
      window.removeEventListener("hashchange", syncLocation);
    };
  }, []);

  useEffect(() => {
    if (
      pathname === previousPathname.current ||
      typeof window === "undefined"
    ) {
      return;
    }

    previousPathname.current = pathname;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!pendingAnchor || pathname !== HOME_PATH) {
      lastHandledAnchor.current = null;
      return;
    }

    const anchorKey = `${pathname}#${pendingAnchor}`;
    if (lastHandledAnchor.current === anchorKey) {
      return;
    }

    lastHandledAnchor.current = anchorKey;

    window.requestAnimationFrame(() => {
      document
        .getElementById(pendingAnchor)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [pathname, pendingAnchor]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const { body } = document;
    const previousOverflow = body.style.overflow;

    if (isMobileMenuOpen) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = previousOverflow;
    }

    return () => {
      body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen || typeof window === "undefined") {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="page-shell">
      <main className="page-main w-full flex min-h-screen flex-col gap-5 py-4">
        <MotionBlock
          as="header"
          className="topbar animate-rise"
          eager
          delay={0.04}
          parallax={false}
        >
          <div className="topbar__identity">
            <div className="monogram">
              <img
                src="/logo-white.png"
                alt="Marc Lowel J. Castillo logo"
                className="monogram__image"
              />
            </div>
            <div>
              <p className="topbar__name">Marc Lowel J. Castillo</p>
              <p className="topbar__meta">Web and Mobile Developer / Manila</p>
            </div>
          </div>

          <div className="topbar__actions">
            <nav className="topbar__nav">
              {primaryNavItems.map((item) => (
                <AppNavLink
                  key={item.href}
                  href={item.href}
                  className="topbar__pill"
                >
                  {item.label}
                </AppNavLink>
              ))}
            </nav>
            <button
              type="button"
              className="topbar__menu-button"
              aria-label={
                isMobileMenuOpen ? "Close navigation" : "Open navigation"
              }
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-drawer"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </MotionBlock>

        <AnimatePresence>
          {isMobileMenuOpen ? (
            <div className="mobile-nav" aria-hidden={!isMobileMenuOpen}>
              <motion.button
                type="button"
                className="mobile-nav__backdrop"
                aria-label="Close navigation"
                onClick={() => setIsMobileMenuOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.24, ease: "easeOut" }}
              />
              <motion.aside
                id="mobile-nav-drawer"
                className="mobile-nav__panel"
                initial={{ x: "100%", opacity: 0.9 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0.92 }}
                transition={{ duration: 0.34, ease: [0.22, 0.9, 0.2, 1] }}
              >
                <div className="mobile-nav__header">
                  <p className="mobile-nav__eyebrow">Navigation</p>
                  <button
                    type="button"
                    className="mobile-nav__close"
                    aria-label="Close navigation"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span />
                    <span />
                  </button>
                </div>
                <nav className="mobile-nav__links">
                  {primaryNavItems.map((item) => (
                    <AppNavLink
                      key={item.href}
                      href={item.href}
                      className="mobile-nav__link"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </AppNavLink>
                  ))}
                </nav>
              </motion.aside>
            </div>
          ) : null}
        </AnimatePresence>

        {pathname === PROJECTS_PATH ? (
          <ProjectsPage />
        ) : (
          <>
            <section className="hero-grid">
              <MotionBlock
                as="article"
                className="poster-panel poster-panel--light dot-field animate-rise"
                eager
                delay={0.04}
                parallax={false}
                yDistance={18}
                scaleAmount={0.015}
              >
                <div className="poster-panel__inner">
                  <div className="section-kicker">
                    <span>Available for work</span>
                    <span>Front-end</span>
                    <span>Mobile-first</span>
                  </div>

                  <p className="hero-code">MLJC / 2026 / PORTFOLIO</p>
                  <MotionLayer
                    as="h1"
                    className="hero-title parallax-layer"
                    parallax={false}
                    yDistance={36}
                    scaleAmount={0.02}
                  >
                    BUILD
                    <br />
                    WEB + MOBILE
                    <br />
                    PRODUCTS
                  </MotionLayer>

                  <div className="hero-caption">
                    <p className="hero-caption__small">Freelance developer</p>
                    <p className="hero-caption__small">
                      React / TypeScript / Responsive UI
                    </p>
                  </div>

                  <div className="hero-lower">
                    <MotionLayer
                      as="div"
                      className="hero-stamp parallax-layer"
                      parallax={false}
                      yDistance={22}
                      xDistance={8}
                      rotateDistance={-0.8}
                    >
                      <span>{portfolioData.profile.yearsExperience}</span>
                      <span>
                        Responsive builds / interface systems / production
                        delivery
                      </span>
                    </MotionLayer>

                    <div className="hero-summary">
                      <p>
                        I build clean, readable, launch-ready interfaces for web
                        and mobile products with a focus on structure,
                        usability, and front-end implementation.
                      </p>
                      <div className="hero-actions">
                        <a
                          href={portfolioData.contacts[0].href}
                          className="action-link action-link-inverse"
                        >
                          Email
                          <ArrowUpRightIcon />
                        </a>
                        <a
                          href={portfolioData.contacts[1].href}
                          target="_blank"
                          rel="noreferrer"
                          className="action-link"
                        >
                          LinkedIn
                          <ArrowUpRightIcon />
                        </a>
                      </div>
                      <div className="hero-notes">
                        <article className="hero-note">
                          <p className="hero-note__label">Front-end</p>
                          <p className="hero-note__value">
                            React JS / TypeScript
                          </p>
                        </article>
                        <article className="hero-note">
                          <p className="hero-note__label">Mobile</p>
                          <p className="hero-note__value">
                            React Native / Flutter
                          </p>
                        </article>
                        <article className="hero-note">
                          <p className="hero-note__label">Workflow</p>
                          <p className="hero-note__value">
                            Responsive UI / Clean structure
                          </p>
                        </article>
                      </div>
                    </div>
                  </div>
                </div>
              </MotionBlock>

              <MotionBlock
                as="aside"
                className="hero-side animate-rise"
                eager
                delay={0.08}
                parallax={false}
                yDistance={24}
                scaleAmount={0.012}
              >
                <article className="poster-panel poster-panel--dark poster-panel--borderless">
                  <div className="poster-panel__bar">
                    <span>Profile sheet</span>
                    <span>{portfolioData.profile.location}</span>
                  </div>
                  <div className="poster-panel__inner">
                    <div className="profile-card">
                      <MotionLayer
                        as="div"
                        className="profile-card__art parallax-layer"
                        parallax={false}
                        yDistance={26}
                        xDistance={10}
                        rotateDistance={1.1}
                      >
                        <ProfileSpotlightImage />
                      </MotionLayer>
                      <div className="profile-card__body">
                        <p className="profile-card__label">Current focus</p>
                        <h2 className="profile-card__title">
                          {portfolioData.profile.role}
                        </h2>
                        <p className="profile-card__text">
                          React builds, mobile-ready UI, and maintainable
                          front-end implementation for product teams and
                          freelance clients.
                        </p>
                        <div className="profile-card__actions">
                          <a
                            href="/CASTILLO - CV.pdf"
                            download
                            className="action-link"
                          >
                            Download CV
                            <ArrowUpRightIcon />
                          </a>
                          <a
                            href={portfolioData.contacts[2].href}
                            target="_blank"
                            rel="noreferrer"
                            className="action-link action-link-outline-light"
                          >
                            {portfolioData.contacts[2].label}
                            <ArrowUpRightIcon />
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="meta-grid">
                      <MetaBlock label="Availability" value="Open" />
                      <MetaBlock label="Work" value="Part time / Internship" />
                      <MetaBlock label="Primary" value="Web + Mobile" />
                      <MetaBlock label="Base" value="Manila" />
                    </div>
                  </div>
                </article>

                <article className="poster-panel poster-panel--accent">
                  <div className="poster-panel__bar">
                    <span>Snapshot</span>
                    <span>{headlineStat.label}</span>
                  </div>
                  <div className="stat-split">
                    <AnimatedStatValue
                      className="stat-split__number"
                      value={headlineStat.value}
                    />
                    <p className="stat-split__text">{headlineStat.hint}</p>
                  </div>
                </article>
              </MotionBlock>
            </section>

            <MotionBlock
              as="section"
              className="marquee-panel animate-rise"
              eager
              delay={0.04}
              parallax={false}
              yDistance={10}
            >
              <div className="marquee-panel__inner">
                <div className="ticker-track">
                  <span>Responsive Builds</span>
                  <span>Web Applications</span>
                  <span>Mobile Interfaces</span>
                  <span>React + TypeScript</span>
                  <span>Freelance Developer</span>
                  <span>Responsive Builds</span>
                  <span>Web Applications</span>
                  <span>Mobile Interfaces</span>
                </div>
              </div>
            </MotionBlock>

            <section id="work" className="editorial-grid">
              <MotionBlock
                as="article"
                className="poster-panel poster-panel--dark poster-panel--borderless animate-rise"
                delay={0.04}
                parallax={false}
                yDistance={18}
                scaleAmount={0.01}
              >
                <div className="poster-panel__bar">
                  <span>Featured project</span>
                  <span>Case study</span>
                </div>
                <div className="feature-grid">
                  <div className="feature-copy">
                    <p className="feature-copy__index">01</p>
                    <h2 className="feature-copy__title">
                      {featuredProject.name}
                    </h2>
                    <p className="feature-copy__text">
                      {featuredProject.summary}
                    </p>
                    <div className="feature-tags">
                      {featuredProject.tags.map((tag) => (
                        <span key={tag} className="outline-chip">
                          {tag}
                        </span>
                      ))}
                    </div>
                    {featuredProject.href ? (
                      <div className="feature-actions">
                        <a
                          href={featuredProject.href}
                          target="_blank"
                          rel="noreferrer"
                          className="action-link action-link-outline-light feature-visit-link"
                        >
                          {featuredProject.linkLabel ?? "Visit site"}
                          <ArrowUpRightIcon />
                        </a>
                      </div>
                    ) : null}
                  </div>

                  <div className="feature-impact">
                    <div className="impact-card">
                      <p className="impact-card__label">Project impact</p>
                      <p className="impact-card__text">
                        {featuredProject.impact}
                      </p>
                    </div>

                    <div className="stacked-preview">
                      <MotionLayer
                        as="div"
                        className="stacked-preview__card stacked-preview__card--solo parallax-layer"
                        parallax={false}
                        yDistance={0}
                        xDistance={0}
                        rotateDistance={0}
                      >
                        <img
                          src="/lk.png"
                          alt="Laundry King MNL website preview"
                          className="stacked-preview__image"
                        />
                      </MotionLayer>
                    </div>
                  </div>
                </div>
              </MotionBlock>

              <div className="editorial-rail">
                <MotionBlock
                  as="article"
                  className="poster-panel poster-panel--light animate-rise"
                  delay={0.06}
                  parallax={false}
                  yDistance={24}
                >
                  <div className="poster-panel__bar poster-panel__bar--light">
                    <span>Current focus</span>
                  </div>
                  <div className="rail-list">
                    {supportingStats.map((stat) => (
                      <div key={stat.label} className="rail-stat">
                        <p className="rail-stat__label">{stat.label}</p>
                        <div className="rail-stat__row">
                          <p className="rail-stat__value">{stat.value}</p>
                          <p className="rail-stat__hint">{stat.hint}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </MotionBlock>

                <MotionBlock
                  as="article"
                  className="poster-panel poster-panel--light animate-rise"
                  delay={0.1}
                  parallax={false}
                  yDistance={28}
                >
                  <div className="poster-panel__bar poster-panel__bar--light">
                    <span>More work</span>
                    <AppNavLink href={PROJECTS_HREF} className="panel-link">
                      View all
                    </AppNavLink>
                  </div>
                  <div className="work-list">
                    {homeMoreProjects.map((project, index) => (
                      <article key={project.name} className="work-list__item">
                        <p className="work-list__index">0{index + 2}</p>
                        <div className="work-list__meta">
                          <h3 className="work-list__title">{project.name}</h3>
                          <p className="work-list__text">{project.summary}</p>
                          {project.href ? (
                            <a
                              href={project.href}
                              target="_blank"
                              rel="noreferrer"
                              className="panel-link"
                            >
                              {project.linkLabel ?? "Visit site"}
                            </a>
                          ) : null}
                        </div>
                      </article>
                    ))}
                  </div>
                </MotionBlock>
              </div>
            </section>

            <section id="services" className="services-grid">
              <MotionBlock
                as="article"
                className="poster-panel poster-panel--light dot-field animate-rise"
                delay={0.04}
                yDistance={16}
                scaleAmount={0.01}
              >
                <div className="poster-panel__bar poster-panel__bar--light">
                  <span>Service index</span>
                  <span>What I do</span>
                </div>
                <div className="service-stage">
                  <div className="service-stage__intro">
                    <p className="service-stage__eyebrow">
                      Planning to production
                    </p>
                    <div className="service-stage__summary-block">
                      <MotionLayer
                        as="h2"
                        className="service-stage__title parallax-layer"
                        yDistance={16}
                      >
                        Strategy, interface design, prototypes, and front-end
                        delivery.
                      </MotionLayer>
                    </div>
                  </div>

                  <div className="service-index__frame">
                    <div className="service-index__grid">
                      {portfolioData.skills.map((skill, index) => (
                        <article
                          key={skill.name}
                          className="service-index__card"
                        >
                          <div className="service-index__top">
                            <p className="service-index__count">0{index + 1}</p>
                          </div>
                          <div className="service-index__body">
                            <h3 className="service-index__title">
                              {skill.name}
                            </h3>
                            <p className="service-index__text">
                              {skill.summary}
                            </p>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                </div>
              </MotionBlock>

              <MotionBlock
                as="article"
                id="about"
                className="poster-panel poster-panel--dark poster-panel--borderless animate-rise"
                delay={0.08}
                yDistance={20}
                scaleAmount={0.012}
              >
                <div className="poster-panel__bar">
                  <span>About</span>
                  <span>Developer summary</span>
                </div>
                <div className="about-sheet">
                  <div className="about-sheet__masthead">
                    <p className="about-sheet__eyebrow">
                      Build first / refine hard / ship clean
                    </p>
                  </div>

                  <div className="about-sheet__layout">
                    <div className="about-sheet__main">
                      <MotionLayer
                        as="h2"
                        className="about-sheet__title parallax-layer"
                        yDistance={20}
                        scaleAmount={0.01}
                      >
                        Turning code into revenue, users, and wins.
                      </MotionLayer>
                      <p className="about-sheet__lead">
                        Driven by current products generating consistent
                        revenue, engaging a growing user base, and delivering
                        competitive wins through rapid execution.
                      </p>
                    </div>
                  </div>

                  <MotionLayer
                    as="div"
                    className="about-sheet__stats parallax-layer"
                    yDistance={16}
                    xDistance={10}
                  >
                    {portfolioData.aboutHighlights.map((item) => (
                      <AboutStat
                        key={item.label}
                        label={item.label}
                        value={item.value}
                      />
                    ))}
                  </MotionLayer>
                </div>
              </MotionBlock>
            </section>

            <MotionBlock
              as="section"
              id="education"
              className="poster-panel poster-panel--light animate-rise"
              delay={0.04}
              yDistance={14}
            >
              <div className="poster-panel__bar poster-panel__bar--light">
                <span>Education</span>
                <span>Learning path</span>
              </div>

              <div className="education-panel">
                <div className="education-panel__hero">
                  <p className="education-panel__eyebrow">
                    Study / practice / front-end craft
                  </p>
                  <LayeredSectionTitle text="EDUCATION" />
                  <p className="education-panel__summary">
                    Academic training plus hands-on front-end practice focused
                    on shipping responsive interfaces that stay clean in
                    production.
                  </p>
                </div>

                <div className="education-panel__list">
                  {portfolioData.education.map((item) => (
                    <article
                      key={`${item.school}-${item.credential}`}
                      className="education-card"
                    >
                      <div className="education-card__meta">
                        <p className="education-card__period">{item.period}</p>
                        <p className="education-card__school">{item.school}</p>
                      </div>
                      <div className="education-card__body">
                        <h3 className="education-card__credential">
                          {item.credential}
                        </h3>
                        <p className="education-card__location">
                          {item.location}
                        </p>
                        <p className="education-card__summary">
                          {item.summary}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </MotionBlock>

            <section className="lower-grid">
              <MotionBlock
                as="article"
                className="poster-panel poster-panel--light animate-rise"
                delay={0.04}
                yDistance={14}
              >
                <div className="poster-panel__bar poster-panel__bar--light">
                  <span>Toolbox</span>
                  <span>Tech stack</span>
                </div>
                <div className="stack-grid">
                  {portfolioData.techStack.map((item) => (
                    <article key={item.name} className="stack-grid__item">
                      <p className="stack-grid__name">{item.name}</p>
                      <p className="stack-grid__kind">{item.kind}</p>
                    </article>
                  ))}
                </div>
              </MotionBlock>

              <MotionBlock
                as="article"
                id="contact"
                className="poster-panel poster-panel--accent animate-rise"
                delay={0.08}
                yDistance={18}
                scaleAmount={0.014}
              >
                <div className="poster-panel__bar poster-panel__bar--light">
                  <span>Contact</span>
                  <span>Get in touch</span>
                </div>
                <div className="contact-panel">
                  <MotionLayer
                    as="h2"
                    className="contact-panel__title parallax-layer"
                    yDistance={26}
                  >
                    READY TO BUILD TOGETHER?
                  </MotionLayer>
                  <p className="contact-panel__text">
                    Available for freelance work involving React, front-end
                    systems, responsive product UI, and mobile-focused
                    implementation.
                  </p>
                  <div className="contact-panel__actions">
                    <a
                      href={portfolioData.contacts[0].href}
                      target="_blank"
                      rel="noreferrer"
                      className="action-link action-link-inverse"
                    >
                      {portfolioData.contacts[0].label}
                      <ArrowUpRightIcon />
                    </a>
                    <a
                      href={portfolioData.contacts[1].href}
                      target="_blank"
                      rel="noreferrer"
                      className="action-link"
                    >
                      {portfolioData.contacts[1].label}
                      <ArrowUpRightIcon />
                    </a>
                  </div>
                </div>
              </MotionBlock>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

type MetaBlockProps = {
  label: string;
  value: string;
};

type AppNavLinkProps = {
  children: ReactNode;
  className?: string;
  href: string;
  onClick?: () => void;
};

type NavItem = {
  href: string;
  label: string;
};

type MotionTag = "div" | "section" | "article" | "aside" | "header";
type MotionTextTag = "div" | "h1" | "h2";

type MotionBlockProps = {
  as?: MotionTag;
  children: ReactNode;
  className?: string;
  delay?: number;
  eager?: boolean;
  id?: string;
  parallax?: boolean;
  scaleAmount?: number;
  style?: CSSProperties;
  viewportAmount?: number;
  xDistance?: number;
  yDistance?: number;
};

type MotionLayerProps = {
  as?: MotionTextTag;
  children?: ReactNode;
  className?: string;
  parallax?: boolean;
  rotateDistance?: number;
  scaleAmount?: number;
  style?: CSSProperties;
  xDistance?: number;
  yDistance?: number;
};

const motionBlocks = {
  article: motion.article,
  aside: motion.aside,
  div: motion.div,
  header: motion.header,
  section: motion.section,
};

const motionText = {
  div: motion.div,
  h1: motion.h1,
  h2: motion.h2,
};

function AppNavLink({ children, className, href, onClick }: AppNavLinkProps) {
  return (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  );
}

function MotionBlock({
  as = "div",
  children,
  className,
  delay = 0,
  eager = false,
  id,
  parallax = true,
  scaleAmount = 0,
  style,
  viewportAmount = 0.5,
  xDistance = 0,
  yDistance = 18,
}: MotionBlockProps) {
  const Component = motionBlocks[as] as ElementType;
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const blockX = shouldReduceMotion || !parallax ? 0 : xDistance;
  const blockY = shouldReduceMotion || !parallax ? 0 : yDistance;
  const blockScale = shouldReduceMotion || !parallax ? 0 : scaleAmount;

  const x = useTransform(scrollYProgress, [0, 1], [blockX, -blockX]);
  const y = useTransform(scrollYProgress, [0, 1], [blockY, -blockY]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1 + blockScale, 1, 1 + blockScale * 0.35],
  );
  const revealTarget = shouldReduceMotion
    ? undefined
    : { opacity: 1, y: 0, scale: 1 };

  return (
    <Component
      ref={ref}
      id={id}
      className={className}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 28, scale: 0.985 }}
      animate={eager ? revealTarget : undefined}
      whileInView={eager ? undefined : revealTarget}
      viewport={eager ? undefined : { once: true, amount: viewportAmount }}
      transition={{
        duration: 0.9,
        delay,
        ease: [0.18, 0.88, 0.24, 1],
      }}
      style={{ ...style, x, y, scale }}
    >
      {children}
    </Component>
  );
}

function MotionLayer({
  as = "div",
  children,
  className,
  parallax = true,
  rotateDistance = 0,
  scaleAmount = 0,
  style,
  xDistance = 0,
  yDistance = 18,
}: MotionLayerProps) {
  const Component = motionText[as] as ElementType;
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const layerX = shouldReduceMotion || !parallax ? 0 : xDistance;
  const layerY = shouldReduceMotion || !parallax ? 0 : yDistance;
  const layerRotate = shouldReduceMotion || !parallax ? 0 : rotateDistance;
  const layerScale = shouldReduceMotion || !parallax ? 0 : scaleAmount;

  const x = useTransform(scrollYProgress, [0, 1], [layerX, -layerX]);
  const y = useTransform(scrollYProgress, [0, 1], [layerY, -layerY]);
  const rotate = useTransform(
    scrollYProgress,
    [0, 1],
    [layerRotate, -layerRotate],
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1 + layerScale, 1, 1 + layerScale * 0.25],
  );

  return (
    <Component
      ref={ref}
      className={className}
      style={{ ...style, x, y, rotate, scale }}
    >
      {children}
    </Component>
  );
}

function MetaBlock({ label, value }: MetaBlockProps) {
  return (
    <article className="meta-grid__item">
      <p className="meta-grid__label">{label}</p>
      <p className="meta-grid__value">{value}</p>
    </article>
  );
}

function ProfileSpotlightImage() {
  const handlePointerMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    event.currentTarget.style.setProperty("--spotlight-x", `${x}px`);
    event.currentTarget.style.setProperty("--spotlight-y", `${y}px`);
    event.currentTarget.style.setProperty("--spotlight-opacity", "1");
  };

  const handlePointerLeave = (event: ReactMouseEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty("--spotlight-opacity", "0");
  };

  return (
    <a
      href="https://www.facebook.com/marclowel.castillo/"
      target="_blank"
      rel="noreferrer"
      className="profile-card__spotlight-link"
    >
      <div
        className="profile-card__spotlight"
        onMouseMove={handlePointerMove}
        onMouseEnter={handlePointerMove}
        onMouseLeave={handlePointerLeave}
      >
        <img
        src="/marc-2.jpg"
          alt="Portrait of Marc Lowel J. Castillo"
          className="profile-card__photo profile-card__photo--base"
        />
        <img
        src="/marc-2.jpg"
          alt=""
          aria-hidden="true"
          className="profile-card__photo profile-card__photo--color"
        />
      </div>
    </a>
  );
}

type AboutStatProps = {
  label: string;
  value: string;
};

function AboutStat({ label, value }: AboutStatProps) {
  const icon = getAboutStatIcon(label);

  return (
    <article className="about-sheet__stat">
      <div className="about-sheet__stat-top">
        <span className="about-sheet__stat-icon" aria-hidden="true">
          {icon}
        </span>
        <AnimatedStatValue className="about-sheet__stat-value" value={value} />
      </div>
      <p className="about-sheet__stat-label">{label}</p>
    </article>
  );
}

type AnimatedStatValueProps = {
  className?: string;
  value: string;
};

function AnimatedStatValue({ className, value }: AnimatedStatValueProps) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLParagraphElement | null>(null);
  const [displayValue, setDisplayValue] = useState(() => {
    const parsed = parseAnimatedStatValue(value);
    return formatAnimatedStatValue(
      parsed,
      shouldReduceMotion ? parsed.number : 0,
    );
  });

  useEffect(() => {
    const parsed = parseAnimatedStatValue(value);

    if (shouldReduceMotion) {
      setDisplayValue(formatAnimatedStatValue(parsed, parsed.number));
      return;
    }

    const target = ref.current;
    if (!target || typeof window === "undefined") {
      setDisplayValue(formatAnimatedStatValue(parsed, parsed.number));
      return;
    }

    let frameId = 0;
    let timeoutId = 0;
    let hasAnimated = false;

    const runAnimation = () => {
      if (hasAnimated) {
        return;
      }

      hasAnimated = true;
      const startTime = performance.now();
      const duration = 1100;

      const tick = (currentTime: number) => {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.round(parsed.number * eased);

        setDisplayValue(formatAnimatedStatValue(parsed, currentValue));

        if (progress < 1) {
          frameId = window.requestAnimationFrame(tick);
        }
      };

      frameId = window.requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting) {
          return;
        }

        observer.disconnect();
        timeoutId = window.setTimeout(runAnimation, 80);
      },
      { threshold: 0.45 },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(timeoutId);
    };
  }, [shouldReduceMotion, value]);

  return (
    <p ref={ref} className={className}>
      {displayValue}
    </p>
  );
}

type ParsedAnimatedStatValue = {
  minimumDigits: number;
  number: number;
  prefix: string;
  suffix: string;
};

function parseAnimatedStatValue(value: string): ParsedAnimatedStatValue {
  const match = value.match(/^([^0-9]*)(\d+)(.*)$/);

  if (!match) {
    return {
      minimumDigits: 0,
      number: 0,
      prefix: "",
      suffix: value,
    };
  }

  const [, prefix, digits, suffix] = match;

  return {
    minimumDigits:
      digits.length > 1 && digits.startsWith("0") ? digits.length : 0,
    number: Number(digits),
    prefix,
    suffix,
  };
}

function formatAnimatedStatValue(
  parsed: ParsedAnimatedStatValue,
  currentValue: number,
) {
  const digits =
    parsed.minimumDigits > 0
      ? String(currentValue).padStart(parsed.minimumDigits, "0")
      : String(currentValue);

  return `${parsed.prefix}${digits}${parsed.suffix}`;
}

function getAboutStatIcon(label: string) {
  if (label === "Revenue generated") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="about-sheet__stat-icon-svg"
      >
        <path
          d="M4 16L9 11L13 15L20 8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15 8H20V13"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (label === "Active users served") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="about-sheet__stat-icon-svg"
      >
        <path
          d="M9 11a3 3 0 1 0 0-6a3 3 0 0 0 0 6Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.5 18.5A5.5 5.5 0 0 1 9 13h1"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17 11a3 3 0 1 0 0-6a3 3 0 0 0 0 6Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.5 18.5A5.5 5.5 0 0 1 19 13h1.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" className="about-sheet__stat-icon-svg">
      <path
        d="M12 4v4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M6 7h12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M8 20h8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M8 9v3a4 4 0 1 0 8 0V9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-4 w-4 shrink-0"
    >
      <path
        d="M7 17L17 7M9 7H17V15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LayeredSectionTitle({ text }: { text: string }) {
  return (
    <div className="education-wordmark" aria-hidden="true">
      <span className="education-wordmark__depth">{text}</span>
      <span className="education-wordmark__fill">{text}</span>
    </div>
  );
}

function ProjectsPage() {
  return (
    <div className="projects-page">
      <section className="projects-overview">
        <MotionBlock
          as="article"
          className="poster-panel poster-panel--dark animate-rise"
          eager
          delay={0.04}
          yDistance={14}
        >
          <div className="poster-panel__bar">
            <span>Projects</span>
            <span>Selected work</span>
          </div>
          <div className="projects-hero">
            <div className="projects-hero__copy">
              <p className="projects-hero__eyebrow">Archive</p>
              <MotionLayer
                as="h1"
                className="projects-hero__title parallax-layer"
                yDistance={18}
              >
                Product, interface, and front-end work collected in one place.
              </MotionLayer>
              <p className="projects-hero__text">
                A compact project directory showing the kind of product UI,
                prototype work, and responsive implementation I take from brief
                to polished delivery.
              </p>
            </div>

            <div className="projects-hero__meta">
              <div className="projects-hero__stat">
                <p className="projects-hero__stat-label">Listed projects</p>
                <p className="projects-hero__stat-value">
                  {portfolioData.projects.length}
                </p>
              </div>
              <div className="projects-hero__archive-card">
                <p className="projects-hero__archive-label">Archive includes</p>
                <div className="projects-hero__archive-list">
                  {portfolioData.projects.map((project, index) => (
                    <div
                      key={project.name}
                      className="projects-hero__archive-item"
                    >
                      <span>0{index + 1}</span>
                      <span>{project.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="projects-hero__tags">
                <span className="outline-chip">Responsive UI</span>
                <span className="outline-chip">Product work</span>
                <span className="outline-chip">Front-end delivery</span>
              </div>
            </div>
          </div>
        </MotionBlock>
      </section>

      <MotionBlock
        as="section"
        className="poster-panel poster-panel--light animate-rise"
        delay={0.08}
        viewportAmount={0.15}
        yDistance={12}
      >
        <div className="poster-panel__bar poster-panel__bar--light">
          <span>Project directory</span>
          <AppNavLink href={HOME_HREF} className="panel-link">
            Back home
          </AppNavLink>
        </div>

        <div className="project-directory">
          {portfolioData.projects.map((project, index) => (
            <article key={project.name} className="project-sheet">
              <div className="project-sheet__index">0{index + 1}</div>
              <div className="project-sheet__content">
                <div className="project-sheet__header">
                  <h2 className="project-sheet__title">{project.name}</h2>
                  <div className="project-sheet__tags">
                    {project.tags.map((tag) => (
                      <span key={tag} className="project-sheet__tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="project-sheet__summary">{project.summary}</p>
              </div>
              <div className="project-sheet__impact">
                <p className="project-sheet__impact-label">Impact</p>
                <p className="project-sheet__impact-text">{project.impact}</p>
                {project.href ? (
                  <div className="project-sheet__actions">
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noreferrer"
                      className="panel-link"
                    >
                      {project.linkLabel ?? "Visit site"}
                    </a>
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </MotionBlock>
    </div>
  );
}

function normalizePath(path: string) {
  const trimmed = path.replace(/\/+$/, "");
  return trimmed === "" ? HOME_PATH : trimmed;
}

function getCurrentPath() {
  if (typeof window === "undefined") {
    return HOME_PATH;
  }

  return (
    getRouteFromHash(window.location.hash) ??
    getRouteFromPathname(window.location.pathname)
  );
}

function getCurrentAnchor() {
  if (typeof window === "undefined") {
    return null;
  }

  return getAnchorFromHash(window.location.hash);
}

function getSectionHref(sectionId: string) {
  return `${HOME_HREF}#${sectionId}`;
}

function getPrimaryNavItems(pathname: string): NavItem[] {
  if (pathname === PROJECTS_PATH) {
    return [
      { href: HOME_HREF, label: "About" },
      { href: PROJECTS_HREF, label: "Projects" },
      { href: getSectionHref("contact"), label: "Contact" },
    ];
  }

  return [
    { href: HOME_HREF, label: "About" },
    { href: getSectionHref("work"), label: "Works" },
    { href: PROJECTS_HREF, label: "Projects" },
    { href: getSectionHref("services"), label: "Service" },
    { href: getSectionHref("contact"), label: "Contact" },
  ];
}

function getRouteFromHash(hash: string) {
  if (!hash.startsWith("#/")) {
    return null;
  }

  return normalizePath(hash.slice(1));
}

function getAnchorFromHash(hash: string) {
  if (!hash.startsWith("#") || hash.startsWith("#/")) {
    return null;
  }

  const anchor = hash.slice(1);
  return anchor === "" ? null : decodeURIComponent(anchor);
}

function getRouteFromPathname(pathname: string) {
  const normalized = normalizePath(pathname);
  return normalized.endsWith(PROJECTS_PATH) ? PROJECTS_PATH : HOME_PATH;
}

export default App;
