import { useEffect, useEffectEvent, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react'
import { portfolioData } from './portfolio'

const HOME_PATH = '/'
const PROJECTS_PATH = '/projects'
const [headlineStat, ...supportingStats] = portfolioData.stats
const [featuredProject, ...moreProjects] = portfolioData.projects

function App() {
  const [pathname, setPathname] = useState(() => getCurrentPath())

  const updateParallax = useEffectEvent(() => {
    const viewportHeight = window.innerHeight || 1

    document.querySelectorAll<HTMLElement>('[data-parallax], [data-parallax-layer]').forEach((element) => {
      const speed = Number(element.dataset.parallaxSpeed ?? '0.14')
      const rotate = Number(element.dataset.parallaxRotate ?? '0')
      const scale = Number(element.dataset.parallaxScale ?? '0')
      const axis = element.dataset.parallaxAxis ?? 'y'
      const rect = element.getBoundingClientRect()
      const offsetFromCenter = viewportHeight / 2 - (rect.top + rect.height / 2)
      const progress = Math.max(-1.2, Math.min(1.2, offsetFromCenter / viewportHeight))

      const shiftY = axis.includes('y') ? progress * speed * 64 : 0
      const shiftX = axis.includes('x') ? progress * speed * 42 : 0
      const tilt = progress * rotate
      const zoom = 1 + Math.abs(progress) * scale

      element.style.setProperty('--parallax-shift', `${shiftY.toFixed(2)}px`)
      element.style.setProperty('--parallax-shift-x', `${shiftX.toFixed(2)}px`)
      element.style.setProperty('--parallax-rotate', `${tilt.toFixed(2)}deg`)
      element.style.setProperty('--parallax-scale', zoom.toFixed(3))
    })
  })

  useEffect(() => {
    const handlePopState = () => setPathname(getCurrentPath())

    window.addEventListener('popstate', handlePopState)

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const revealElements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))

    if (reduceMotion) {
      revealElements.forEach((element) => {
        element.classList.add('is-visible')
        element.style.setProperty('--parallax-shift', '0px')
      })
      return () => {
        window.removeEventListener('popstate', handlePopState)
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return
          }

          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      },
      {
        threshold: 0.18,
        rootMargin: '0px 0px -8% 0px',
      },
    )

    revealElements.forEach((element) => observer.observe(element))

    let frameId = 0

    const requestParallaxUpdate = () => {
      if (frameId !== 0) {
        return
      }

      frameId = window.requestAnimationFrame(() => {
        updateParallax()
        frameId = 0
      })
    }

    requestParallaxUpdate()
    window.addEventListener('scroll', requestParallaxUpdate, { passive: true })
    window.addEventListener('resize', requestParallaxUpdate)

    return () => {
      observer.disconnect()
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('scroll', requestParallaxUpdate)
      window.removeEventListener('resize', requestParallaxUpdate)

      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId)
      }
    }
  }, [pathname])

  const handleInternalNavigation = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.altKey ||
      event.shiftKey ||
      typeof window === 'undefined'
    ) {
      return
    }

    const url = new URL(href, window.location.origin)
    if (url.origin !== window.location.origin) {
      return
    }

    event.preventDefault()

    const nextPath = normalizePath(url.pathname)
    const nextLocation = `${nextPath}${url.search}${url.hash}`
    const currentPath = getCurrentPath()

    if (nextLocation !== `${currentPath}${window.location.search}${window.location.hash}`) {
      window.history.pushState({}, '', nextLocation)
    }

    setPathname(nextPath)

    if (nextPath !== currentPath || !url.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    }

    if (url.hash) {
      window.requestAnimationFrame(() => {
        document.querySelector(url.hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
  }

  return (
    <div className="page-shell">
      <main
        className="w-full flex min-h-screen flex-col gap-5 py-4"
        style={{ paddingInline: 'clamp(0.75rem, 8vw, 20rem)' }}
      >
        <header className="topbar animate-rise" data-reveal style={revealStyle()}>
          <div className="topbar__identity">
            <div className="monogram">MC</div>
            <div>
              <p className="topbar__name">Marc Lowel J. Castillo</p>
              <p className="topbar__meta">Web and Mobile Developer / Manila</p>
            </div>
          </div>

          <div className="topbar__actions">
            <nav className="topbar__nav">
              {pathname === PROJECTS_PATH ? (
                <>
                  <AppNavLink href={HOME_PATH} className="topbar__pill" onNavigate={handleInternalNavigation}>
                    Home
                  </AppNavLink>
                  <AppNavLink href={PROJECTS_PATH} className="topbar__pill" onNavigate={handleInternalNavigation}>
                    Projects
                  </AppNavLink>
                  <AppNavLink href="/#contact" className="topbar__pill" onNavigate={handleInternalNavigation}>
                    Contact
                  </AppNavLink>
                </>
              ) : (
                <>
                  <a href="#work" className="topbar__pill">
                    Works
                  </a>
                  <AppNavLink href={PROJECTS_PATH} className="topbar__pill" onNavigate={handleInternalNavigation}>
                    Projects
                  </AppNavLink>
                  <a href="#services" className="topbar__pill">
                    Service
                  </a>
                  <a href="#about" className="topbar__pill">
                    About
                  </a>
                  <a href="#contact" className="topbar__pill">
                    Contact
                  </a>
                </>
              )}
            </nav>
          </div>
        </header>

        {pathname === PROJECTS_PATH ? (
          <ProjectsPage onNavigate={handleInternalNavigation} />
        ) : (
          <>
        <section className="hero-grid">
          <article
            className="poster-panel poster-panel--light dot-field animate-rise"
            data-reveal
            data-parallax
            data-parallax-speed="0.16"
            data-parallax-scale="0.015"
            style={revealStyle('70ms')}
          >
            <div className="poster-panel__inner">
              <div className="section-kicker">
                <span>Available for work</span>
                <span>Front-end</span>
                <span>Mobile-first</span>
              </div>

              <p className="hero-code">MLJC / 2026 / PORTFOLIO</p>
              <h1
                className="hero-title parallax-layer"
                data-parallax-layer
                data-parallax-speed="0.42"
                data-parallax-scale="0.02"
              >
                BUILD
                <br />
                WEB + MOBILE
                <br />
                PRODUCTS
              </h1>

              <div className="hero-caption">
                <p className="hero-caption__small">Freelance developer</p>
                <p className="hero-caption__small">React / TypeScript / Responsive UI</p>
              </div>

              <div className="hero-lower">
                <div
                  className="hero-stamp parallax-layer"
                  data-parallax-layer
                  data-parallax-speed="0.34"
                  data-parallax-axis="xy"
                  data-parallax-rotate="-2.2"
                >
                  <span>{portfolioData.profile.yearsExperience}</span>
                  <span>Responsive builds / interface systems / production delivery</span>
                </div>

                <div className="hero-summary">
                  <p>
                    I build clean, readable, launch-ready interfaces for web and mobile products
                    with a focus on structure, usability, and front-end implementation.
                  </p>
                  <div className="hero-actions">
                    <a href={portfolioData.contacts[0].href} className="action-link action-link-inverse">
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
                </div>
              </div>
            </div>
          </article>

          <aside
            className="hero-side animate-rise"
            data-reveal
            data-parallax
            data-parallax-speed="0.22"
            data-parallax-scale="0.012"
            style={revealStyle('130ms')}
          >
            <article className="poster-panel poster-panel--dark">
              <div className="poster-panel__bar">
                <span>Profile sheet</span>
                <span>{portfolioData.profile.location}</span>
              </div>
              <div className="poster-panel__inner">
                <div className="profile-card">
                  <div
                    className="profile-card__art parallax-layer"
                    data-parallax-layer
                    data-parallax-speed="0.4"
                    data-parallax-axis="xy"
                    data-parallax-rotate="2.5"
                  >
                    <img
                      src="/marc.jpg"
                      alt="Portrait of Marc Lowel J. Castillo"
                      className="profile-card__photo"
                    />
                  </div>
                  <div className="profile-card__body">
                    <p className="profile-card__label">Current focus</p>
                    <h2 className="profile-card__title">{portfolioData.profile.role}</h2>
                    <p className="profile-card__text">
                      React builds, mobile-ready UI, and maintainable front-end implementation for
                      product teams and freelance clients.
                    </p>
                  </div>
                </div>

                <div className="meta-grid">
                  <MetaBlock label="Availability" value="Open" />
                  <MetaBlock label="Type" value="Freelance" />
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
                <p className="stat-split__number">{headlineStat.value}</p>
                <p className="stat-split__text">{headlineStat.hint}</p>
              </div>
            </article>
          </aside>
        </section>

        <section
          className="marquee-panel animate-rise"
          data-reveal
          data-parallax
          data-parallax-speed="0.1"
          style={revealStyle('180ms')}
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
        </section>

        <section id="work" className="editorial-grid">
          <article
            className="poster-panel poster-panel--dark animate-rise"
            data-reveal
            data-parallax
            data-parallax-speed="0.16"
            data-parallax-scale="0.01"
            style={revealStyle('240ms')}
          >
            <div className="poster-panel__bar">
              <span>Featured project</span>
              <span>Case study</span>
            </div>
            <div className="feature-grid">
              <div className="feature-copy">
                <p className="feature-copy__index">01</p>
                <h2 className="feature-copy__title">{featuredProject.name}</h2>
                <p className="feature-copy__text">{featuredProject.summary}</p>
                <div className="feature-tags">
                  {featuredProject.tags.map((tag) => (
                    <span key={tag} className="outline-chip">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="feature-impact">
                <div className="impact-card">
                  <p className="impact-card__label">Project impact</p>
                  <p className="impact-card__text">{featuredProject.impact}</p>
                </div>

                <div className="stacked-preview">
                  <div
                    className="stacked-preview__card stacked-preview__card--one parallax-layer"
                    data-parallax-layer
                    data-parallax-speed="0.28"
                    data-parallax-axis="xy"
                    data-parallax-rotate="-4"
                  />
                  <div
                    className="stacked-preview__card stacked-preview__card--two parallax-layer"
                    data-parallax-layer
                    data-parallax-speed="0.42"
                    data-parallax-axis="xy"
                    data-parallax-rotate="5"
                  />
                  <div
                    className="stacked-preview__card stacked-preview__card--three parallax-layer"
                    data-parallax-layer
                    data-parallax-speed="0.34"
                    data-parallax-axis="xy"
                    data-parallax-rotate="-3"
                  />
                </div>
              </div>
            </div>
          </article>

          <div className="editorial-rail">
            <article
              className="poster-panel poster-panel--light animate-rise"
              data-reveal
              data-parallax
              data-parallax-speed="0.24"
              style={revealStyle('300ms')}
            >
              <div className="poster-panel__bar poster-panel__bar--light">
                <span>Selected numbers</span>
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
            </article>

            <article
              className="poster-panel poster-panel--light animate-rise"
              data-reveal
              data-parallax
              data-parallax-speed="0.28"
              style={revealStyle('360ms')}
            >
              <div className="poster-panel__bar poster-panel__bar--light">
                <span>More work</span>
                <AppNavLink href={PROJECTS_PATH} className="panel-link" onNavigate={handleInternalNavigation}>
                  View all
                </AppNavLink>
              </div>
              <div className="work-list">
                {moreProjects.map((project, index) => (
                  <article key={project.name} className="work-list__item">
                    <p className="work-list__index">0{index + 2}</p>
                    <div>
                      <h3 className="work-list__title">{project.name}</h3>
                      <p className="work-list__text">{project.summary}</p>
                    </div>
                  </article>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section id="services" className="services-grid">
          <article
            className="poster-panel poster-panel--light dot-field animate-rise"
            data-reveal
            data-parallax
            data-parallax-speed="0.15"
            data-parallax-scale="0.01"
            style={revealStyle('420ms')}
          >
            <div className="poster-panel__bar poster-panel__bar--light">
              <span>Service index</span>
              <span>What I do</span>
            </div>
            <div className="service-stage">
              <div className="service-stage__intro">
                <p className="service-stage__eyebrow">Planning to production</p>
                <div className="service-stage__summary-block">
                  <h2 className="service-stage__title parallax-layer" data-parallax-layer data-parallax-speed="0.22">
                    Strategy, interface design, prototypes, and front-end delivery.
                  </h2>
                </div>
              </div>

              <div className="service-index__frame">
                <div className="service-index__grid">
                  {portfolioData.skills.map((skill, index) => (
                    <article key={skill.name} className="service-index__card">
                      <div className="service-index__top">
                        <p className="service-index__count">0{index + 1}</p>
                      </div>
                      <div className="service-index__body">
                        <h3 className="service-index__title">{skill.name}</h3>
                        <p className="service-index__text">{skill.summary}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </article>

          <article
            id="about"
            className="poster-panel poster-panel--dark animate-rise"
            data-reveal
            data-parallax
            data-parallax-speed="0.2"
            data-parallax-scale="0.012"
            style={revealStyle('480ms')}
          >
            <div className="poster-panel__bar">
              <span>About</span>
              <span>Developer summary</span>
            </div>
            <div className="about-sheet">
              <div className="about-sheet__masthead">
                <p className="about-sheet__eyebrow">Build first / refine hard / ship clean</p>
              </div>

              <div className="about-sheet__layout">
                <div className="about-sheet__main">
                  <h2
                    className="about-sheet__title parallax-layer"
                    data-parallax-layer
                    data-parallax-speed="0.22"
                    data-parallax-scale="0.01"
                  >
                    Responsive product screens built cleanly and shipped with care.
                  </h2>
                  <p className="about-sheet__lead">{portfolioData.profile.summary}</p>
                </div>

                <div className="about-sheet__rail">
                  <div
                    className="about-sheet__metrics parallax-layer"
                    data-parallax-layer
                    data-parallax-speed="0.16"
                    data-parallax-axis="xy"
                  >
                    <AboutMetric label="Availability" value={portfolioData.profile.availability} />
                    <AboutMetric label="Experience" value={portfolioData.profile.yearsExperience} />
                    <AboutMetric label="Location" value={portfolioData.profile.location} />
                  </div>
                </div>
              </div>
            </div>
          </article>
        </section>

        <section
          id="education"
          className="poster-panel poster-panel--light animate-rise"
          data-reveal
          data-parallax
          data-parallax-speed="0.13"
          style={revealStyle('510ms')}
        >
          <div className="poster-panel__bar poster-panel__bar--light">
            <span>Education</span>
            <span>Learning path</span>
          </div>

          <div className="education-panel">
            <div className="education-panel__hero">
              <p className="education-panel__eyebrow">Study / practice / front-end craft</p>
              <LayeredSectionTitle text="EDUCATION" />
              <p className="education-panel__summary">
                Academic training plus hands-on front-end practice focused on shipping responsive
                interfaces that stay clean in production.
              </p>
            </div>

            <div className="education-panel__list">
              {portfolioData.education.map((item) => (
                <article key={`${item.school}-${item.credential}`} className="education-card">
                  <div className="education-card__meta">
                    <p className="education-card__period">{item.period}</p>
                    <p className="education-card__school">{item.school}</p>
                  </div>
                  <div className="education-card__body">
                    <h3 className="education-card__credential">{item.credential}</h3>
                    <p className="education-card__location">{item.location}</p>
                    <p className="education-card__summary">{item.summary}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="lower-grid">
          <article
            className="poster-panel poster-panel--light animate-rise"
            data-reveal
            data-parallax
            data-parallax-speed="0.14"
            style={revealStyle('540ms')}
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
          </article>

          <article
            id="contact"
            className="poster-panel poster-panel--accent animate-rise"
            data-reveal
            data-parallax
            data-parallax-speed="0.18"
            data-parallax-scale="0.014"
            style={revealStyle('600ms')}
          >
            <div className="poster-panel__bar poster-panel__bar--light">
              <span>Contact</span>
              <span>Get in touch</span>
            </div>
            <div className="contact-panel">
              <h2
                className="contact-panel__title parallax-layer"
                data-parallax-layer
                data-parallax-speed="0.34"
              >
                READY TO BUILD TOGETHER?
              </h2>
              <p className="contact-panel__text">
                Available for freelance work involving React, front-end systems, responsive product
                UI, and mobile-focused implementation.
              </p>
              <div className="contact-panel__actions">
                <a href={portfolioData.contacts[0].href} className="action-link action-link-inverse">
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
          </article>
        </section>
          </>
        )}
      </main>
    </div>
  )
}

type MetaBlockProps = {
  label: string
  value: string
}

type NavigationHandler = (event: MouseEvent<HTMLAnchorElement>, href: string) => void

type AppNavLinkProps = {
  children: ReactNode
  className?: string
  href: string
  onNavigate: NavigationHandler
}

function revealStyle(delay = '0ms'): CSSProperties {
  return {
    '--reveal-delay': delay,
  } as CSSProperties
}

function AppNavLink({ children, className, href, onNavigate }: AppNavLinkProps) {
  return (
    <a href={href} className={className} onClick={(event) => onNavigate(event, href)}>
      {children}
    </a>
  )
}

function MetaBlock({ label, value }: MetaBlockProps) {
  return (
    <article className="meta-grid__item">
      <p className="meta-grid__label">{label}</p>
      <p className="meta-grid__value">{value}</p>
    </article>
  )
}

type FactChipProps = {
  label: string
  value: string
}

function AboutMetric({ label, value }: FactChipProps) {
  return (
    <article className="about-sheet__metric">
      <p className="about-sheet__metric-label">{label}</p>
      <p className="about-sheet__metric-value">{value}</p>
    </article>
  )
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
  )
}

function LayeredSectionTitle({ text }: { text: string }) {
  return (
    <div className="education-wordmark" aria-hidden="true">
      <span className="education-wordmark__depth">{text}</span>
      <span className="education-wordmark__fill">{text}</span>
    </div>
  )
}

function ProjectsPage({ onNavigate }: { onNavigate: NavigationHandler }) {
  return (
    <div className="projects-page">
      <section className="projects-overview">
        <article
          className="poster-panel poster-panel--dark animate-rise"
          data-reveal
          data-parallax
          data-parallax-speed="0.14"
          style={revealStyle('70ms')}
        >
          <div className="poster-panel__bar">
            <span>Projects</span>
            <span>Selected work</span>
          </div>
          <div className="projects-hero">
            <div className="projects-hero__copy">
              <p className="projects-hero__eyebrow">Archive</p>
              <h1
                className="projects-hero__title parallax-layer"
                data-parallax-layer
                data-parallax-speed="0.24"
              >
                Product, interface, and front-end work collected in one place.
              </h1>
              <p className="projects-hero__text">
                A compact project directory showing the kind of product UI, prototype work, and
                responsive implementation I take from brief to polished delivery.
              </p>
            </div>

            <div className="projects-hero__meta">
              <div className="projects-hero__stat">
                <p className="projects-hero__stat-label">Listed projects</p>
                <p className="projects-hero__stat-value">{portfolioData.projects.length}</p>
              </div>
              <div className="projects-hero__tags">
                <span className="outline-chip">Responsive UI</span>
                <span className="outline-chip">Product work</span>
                <span className="outline-chip">Front-end delivery</span>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section
        className="poster-panel poster-panel--light animate-rise"
        data-reveal
        data-parallax
        data-parallax-speed="0.12"
        style={revealStyle('140ms')}
      >
        <div className="poster-panel__bar poster-panel__bar--light">
          <span>Project directory</span>
          <AppNavLink href={HOME_PATH} className="panel-link" onNavigate={onNavigate}>
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
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

function normalizePath(path: string) {
  const trimmed = path.replace(/\/+$/, '')
  return trimmed === '' ? HOME_PATH : trimmed
}

function getCurrentPath() {
  if (typeof window === 'undefined') {
    return HOME_PATH
  }

  return normalizePath(window.location.pathname)
}

export default App
