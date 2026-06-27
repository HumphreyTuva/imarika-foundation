import { Link, useNavigate } from "react-router-dom";
import { Newspaper, CalendarCheck, Home, LogOut, Users, Layers, TrendingUp, Briefcase } from "lucide-react";
import "../components/coastal-fire.css";

const ADMIN_HOME_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700;800&display=swap');

  .ah-root {
    min-height: 100vh;
    background: #f0f4f8;
    font-family: 'Outfit', sans-serif;
  }

  .ah-header {
    background: #043463;
    padding: clamp(2rem, 5vw, 3rem) clamp(1.25rem, 5vw, 4rem);
    position: relative;
    overflow: hidden;
  }
  .ah-header-ghost {
    position: absolute;
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(6rem, 18vw, 14rem);
    line-height: .85;
    color: rgba(238,76,5,.05);
    right: -1%;
    top: 50%;
    transform: translateY(-50%);
    user-select: none;
    pointer-events: none;
    letter-spacing: .02em;
  }
  .ah-header-slash {
    position: absolute;
    width: 3px;
    background: #ee4c05;
    border-radius: 2px;
    transform: rotate(12deg);
    transform-origin: top center;
  }
  .ah-header-inner {
    position: relative;
    z-index: 1;
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
  }
  .ah-header-left { display: flex; align-items: center; gap: 1.25rem; }
  .ah-logo {
    width: 48px;
    height: 48px;
    border-radius: 2px;
    object-fit: cover;
    border: 2px solid rgba(255,255,255,.15);
    flex-shrink: 0;
  }
  .ah-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: .4rem;
    font-size: .58rem;
    font-weight: 800;
    letter-spacing: .22em;
    text-transform: uppercase;
    color: #46c5e4;
    margin-bottom: .25rem;
  }
  .ah-eyebrow::before { content: ''; width: 1rem; height: 2px; background: #46c5e4; border-radius: 2px; }
  .ah-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(1.25rem, 3vw, 1.85rem);
    letter-spacing: .04em;
    color: #ffffff;
    line-height: 1;
  }
  .ah-title span { color: #ee4c05; }

  .ah-header-actions { display: flex; gap: .75rem; flex-wrap: wrap; }
  .ah-btn {
    display: inline-flex;
    align-items: center;
    gap: .5rem;
    font-family: 'Outfit', sans-serif;
    font-size: .65rem;
    font-weight: 800;
    letter-spacing: .1em;
    text-transform: uppercase;
    padding: .6rem 1.25rem;
    border-radius: 2px;
    border: 1.5px solid;
    cursor: pointer;
    text-decoration: none;
    transition: all .2s;
    white-space: nowrap;
  }
  .ah-btn-outline {
    color: rgba(255,255,255,.8);
    border-color: rgba(255,255,255,.25);
    background: none;
  }
  .ah-btn-outline:hover { border-color: #fff; color: #fff; background: rgba(255,255,255,.07); }
  .ah-btn-danger {
    color: #ee4c05;
    border-color: rgba(238,76,5,.35);
    background: none;
  }
  .ah-btn-danger:hover { background: #ee4c05; color: #fff; border-color: #ee4c05; }

  .ah-main {
    max-width: 1400px;
    margin: 0 auto;
    padding: clamp(2rem, 5vw, 3.5rem) clamp(1.25rem, 5vw, 4rem);
  }

  .ah-section-label {
    display: inline-flex;
    align-items: center;
    gap: .5rem;
    font-size: .6rem;
    font-weight: 800;
    letter-spacing: .22em;
    text-transform: uppercase;
    color: #ee4c05;
    margin-bottom: .75rem;
  }
  .ah-section-label::before { content: ''; width: 1.5rem; height: 2px; background: #ee4c05; border-radius: 2px; }

  .ah-section-heading {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(1.75rem, 4vw, 2.75rem);
    letter-spacing: .02em;
    color: #043463;
    line-height: .9;
    margin-bottom: clamp(1.5rem, 3vw, 2.5rem);
  }
  .ah-section-heading span { color: #ee4c05; }

  .ah-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.25px;
    background: rgba(4,52,99,.1);
  }
  @media (min-width: 640px)  { .ah-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (min-width: 1024px) { .ah-grid { grid-template-columns: repeat(3, 1fr); } }

  .ah-card {
    background: #ffffff;
    padding: clamp(1.75rem, 3vw, 2.5rem);
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    text-decoration: none;
    position: relative;
    overflow: hidden;
    transition: transform .3s, box-shadow .3s;
  }
  .ah-card::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 3px;
    background: var(--card-accent, #ee4c05);
    transition: width .3s;
  }
  .ah-card:hover { transform: translateY(-3px); box-shadow: 0 20px 40px rgba(4,52,99,.08); }
  .ah-card:hover::before { width: 5px; }

  .ah-card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
  }
  .ah-card-icon {
    width: 48px;
    height: 48px;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: transform .3s;
  }
  .ah-card:hover .ah-card-icon { transform: scale(1.08); }

  .ah-card-tag {
    font-size: .55rem;
    font-weight: 800;
    letter-spacing: .18em;
    text-transform: uppercase;
    color: var(--card-accent, #ee4c05);
    margin-bottom: .35rem;
  }
  .ah-card-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(1.25rem, 2.5vw, 1.625rem);
    letter-spacing: .04em;
    color: #043463;
    line-height: 1.05;
  }
  .ah-card-desc {
    font-size: .825rem;
    color: #4a5568;
    line-height: 1.8;
    flex: 1;
  }
  .ah-card-arrow {
    display: flex;
    align-items: center;
    gap: .4rem;
    font-size: .62rem;
    font-weight: 800;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: var(--card-accent, #ee4c05);
    margin-top: auto;
    transition: gap .2s;
  }
  .ah-card:hover .ah-card-arrow { gap: .65rem; }
  .ah-card-arrow::after { content: '→'; font-size: .8rem; }

  .ah-footer {
    background: #043463;
    padding: 1.75rem clamp(1.25rem, 5vw, 4rem);
    text-align: center;
    border-top: 1px solid rgba(255,255,255,.1);
    margin-top: clamp(3rem, 6vw, 5rem);
  }
  .ah-footer p {
    font-family: 'Outfit', sans-serif;
    font-size: .68rem;
    color: rgba(255,255,255,.5);
  }
`;

const CARDS = [
  {
    to: "/article-admin",
    tag: "Content",
    title: "Manage Articles",
    desc: "Create and edit blog content to keep your audience updated on Foundation news and stories.",
    icon: <Newspaper size={22} />,
    accent: "#0e7fbb",
    iconBg: "rgba(14,127,187,.1)",
  },
  {
    to: "/event-admin",
    tag: "Programmes",
    title: "Manage Events",
    desc: "Plan and schedule upcoming Imarika Foundation events and community activities.",
    icon: <CalendarCheck size={22} />,
    accent: "#ee4c05",
    iconBg: "rgba(238,76,5,.1)",
  },
  {
    to: "/leaders-admin",
    tag: "People",
    title: "Manage Leadership",
    desc: "Add, edit, and manage board members and staff profiles across the Foundation.",
    icon: <Users size={22} />,
    accent: "#22c55e",
    iconBg: "rgba(34,197,94,.1)",
  },
  {
    to: "/program-admin",
    tag: "Impact Pillars",
    title: "Manage Programmes",
    desc: "Create, edit, and update the Foundation's impact pillars and community initiatives.",
    icon: <Layers size={22} />,
    accent: "#8b5cf6",
    iconBg: "rgba(139,92,246,.1)",
  },
  {
    to: "/impact-admin",
    tag: "Reporting",
    title: "Manage Impact",
    desc: "Update the main stats, success stories, and annual reports for stakeholders.",
    icon: <TrendingUp size={22} />,
    accent: "#46c5e4",
    iconBg: "rgba(70,197,228,.1)",
  },
  {
    to: "/opportunities-admin",
    tag: "Procurement & Careers",
    title: "Manage Opportunities",
    desc: "Post and manage tenders, job vacancies, internships, volunteer roles, and expressions of interest.",
    icon: <Briefcase size={22} />,
    accent: "#ee4c05",
    iconBg: "rgba(238,76,5,.1)",
  },
];

export default function AdminHome() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/admin-login");
  };

  return (
    <>
      <style>{ADMIN_HOME_CSS}</style>
      <div className="ah-root">

        <header className="ah-header">
          <div className="ah-header-ghost" aria-hidden="true">ADMIN</div>
          <div className="ah-header-slash" style={{ height: "clamp(60px,10vh,100px)", right: "clamp(1.5rem,8vw,6rem)", top: "50%" }} aria-hidden="true" />
          <div className="ah-header-slash" style={{ height: "clamp(40px,6vh,65px)", right: "clamp(3rem,11vw,9.5rem)", top: "52%", opacity: .3 }} aria-hidden="true" />

          <div className="ah-header-inner">
            <div className="ah-header-left">
              <img src="/images/imarikalogo.jpeg" alt="Imarika Foundation" className="ah-logo" />
              <div>
                <div className="ah-eyebrow">Staff Portal</div>
                <div className="ah-title">Imarika <span>Dashboard.</span></div>
              </div>
            </div>
            <div className="ah-header-actions">
              <Link to="/" className="ah-btn ah-btn-outline">
                <Home size={13} aria-hidden="true" /> Home Page
              </Link>
              <button type="button" onClick={handleLogout} className="ah-btn ah-btn-danger">
                <LogOut size={13} aria-hidden="true" /> Sign Out
              </button>
            </div>
          </div>
        </header>

        <main className="ah-main">
          <div className="ah-section-label">Admin Modules</div>
          <h2 className="ah-section-heading">
            WHAT WOULD YOU<br />
            <span>LIKE TO MANAGE?</span>
          </h2>

          <div className="ah-grid" role="list">
            {CARDS.map((card) => (
              <Link
                key={card.to}
                to={card.to}
                className="ah-card"
                style={{ "--card-accent": card.accent }}
                role="listitem"
              >
                <div className="ah-card-top">
                  <div>
                    <div className="ah-card-tag">{card.tag}</div>
                    <div className="ah-card-title">{card.title}</div>
                  </div>
                  <div className="ah-card-icon" style={{ background: card.iconBg, color: card.accent }} aria-hidden="true">
                    {card.icon}
                  </div>
                </div>
                <p className="ah-card-desc">{card.desc}</p>
                <div className="ah-card-arrow">Open module</div>
              </Link>
            ))}
          </div>
        </main>

        <footer className="ah-footer">
          <p>© {new Date().getFullYear()} Imarika Foundation · Kenya · Staff Portal</p>
        </footer>

      </div>
    </>
  );
}