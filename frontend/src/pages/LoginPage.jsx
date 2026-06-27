import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, User, Lock, LoaderCircle, Globe } from "lucide-react";
import api from "../api";
import "../components/coastal-fire.css";

/* ── Page-scoped styles — design only, zero logic ── */
const LOGIN_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700;800&display=swap');

  .lp-root {
    min-height: 100vh;
    display: flex;
    font-family: 'Outfit', sans-serif;
    background: #f0f4f8;
    overflow: hidden;
  }

  /* ── Left panel — brand identity ── */
  .lp-left {
    display: none;
    flex-direction: column;
    justify-content: space-between;
    background: #043463;
    padding: clamp(2.5rem, 5vw, 4rem);
    position: relative;
    overflow: hidden;
  }
  @media (min-width: 900px) { .lp-left { display: flex; flex: 1; } }

  /* Ghost text */
  .lp-ghost {
    position: absolute;
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(8rem, 16vw, 14rem);
    line-height: .85;
    color: rgba(238,76,5,.06);
    bottom: -1rem;
    left: -1rem;
    user-select: none;
    pointer-events: none;
    letter-spacing: .02em;
  }

  /* Accent slash */
  .lp-slash {
    position: absolute;
    width: 3px;
    background: #ee4c05;
    border-radius: 2px;
    transform: rotate(12deg);
    transform-origin: top center;
    right: clamp(2rem, 5vw, 4rem);
    height: clamp(80px, 14vh, 140px);
    top: clamp(3rem, 8vh, 7rem);
  }
  .lp-slash-2 {
    height: clamp(50px, 9vh, 90px);
    right: clamp(3.5rem, 7vw, 6rem);
    top: clamp(3.5rem, 9vh, 8rem);
    opacity: .3;
  }

  .lp-left-top { position: relative; z-index: 1; }

  .lp-logo-wrap {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: clamp(3rem, 8vh, 6rem);
  }
  .lp-logo {
    width: 52px;
    height: 52px;
    border-radius: 2px;
    object-fit: cover;
    border: 2px solid rgba(255,255,255,.15);
  }
  .lp-logo-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.1rem;
    letter-spacing: .12em;
    color: rgba(255,255,255,.85);
    line-height: 1.1;
  }
  .lp-logo-name span { display: block; font-family: 'Outfit', sans-serif; font-size: .62rem; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; color: #46c5e4; margin-top: .15rem; }

  .lp-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: .5rem;
    font-size: .65rem;
    font-weight: 800;
    letter-spacing: .22em;
    text-transform: uppercase;
    color: #ee4c05;
    margin-bottom: .875rem;
  }
  .lp-eyebrow::before { content: ''; width: 1.5rem; height: 2px; background: #ee4c05; border-radius: 2px; }

  .lp-headline {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2.75rem, 5vw, 4.25rem);
    line-height: .88;
    letter-spacing: .02em;
    color: #ffffff;
    margin-bottom: 1.25rem;
  }
  .lp-headline span { color: #ee4c05; }

  .lp-subline {
    color: #46c5e4;
    font-size: clamp(.8rem, 1.4vw, .9rem);
    line-height: 1.85;
    max-width: 340px;
  }

  /* Stats row at bottom of left panel */
  .lp-stats {
    position: relative;
    z-index: 1;
    display: flex;
    gap: 2rem;
    border-top: 1px solid rgba(255,255,255,.1);
    padding-top: 1.75rem;
    margin-top: 2rem;
  }
  .lp-stat-n {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.75rem;
    line-height: 1;
    color: #ee4c05;
    letter-spacing: .02em;
  }
  .lp-stat-l {
    font-size: .58rem;
    font-weight: 700;
    letter-spacing: .18em;
    text-transform: uppercase;
    color: rgba(255,255,255,.4);
    margin-top: .25rem;
  }

  /* ── Right panel — form ── */
  .lp-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: clamp(2rem, 5vw, 4rem) clamp(1.25rem, 5vw, 3.5rem);
    min-height: 100vh;
  }

  .lp-card {
    width: 100%;
    max-width: 420px;
  }

  /* Mobile-only logo */
  .lp-mobile-logo {
    display: flex;
    align-items: center;
    gap: .875rem;
    margin-bottom: 2rem;
  }
  @media (min-width: 900px) { .lp-mobile-logo { display: none; } }
  .lp-mobile-logo img { width: 42px; height: 42px; border-radius: 2px; object-fit: cover; }
  .lp-mobile-logo-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1rem;
    letter-spacing: .1em;
    color: #043463;
  }
  .lp-mobile-logo-name span { display: block; font-family: 'Outfit', sans-serif; font-size: .58rem; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: #0e7fbb; }

  .lp-form-label {
    display: block;
    font-size: .62rem;
    font-weight: 800;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: #043463;
    opacity: .65;
    margin-bottom: .5rem;
  }

  .lp-input-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }
  .lp-input-icon {
    position: absolute;
    left: .9rem;
    color: #0e7fbb;
    display: flex;
    align-items: center;
    pointer-events: none;
  }
  .lp-input {
    width: 100%;
    background: #ffffff;
    border: 1px solid rgba(4,52,99,.2);
    color: #043463;
    font-family: 'Outfit', sans-serif;
    font-size: .9rem;
    padding: .825rem 1rem .825rem 2.75rem;
    border-radius: 2px;
    outline: none;
    transition: border-color .2s, box-shadow .2s;
  }
  .lp-input::placeholder { color: #a0aec0; }
  .lp-input:focus { border-color: #ee4c05; box-shadow: 0 0 0 3px rgba(238,76,5,.1); }

  .lp-eye-btn {
    position: absolute;
    right: .875rem;
    background: none;
    border: none;
    color: #a0aec0;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: .25rem;
    transition: color .2s;
  }
  .lp-eye-btn:hover { color: #043463; }

  .lp-error {
    display: flex;
    align-items: flex-start;
    gap: .5rem;
    background: rgba(239,68,68,.08);
    border: 1px solid rgba(239,68,68,.25);
    color: #b91c1c;
    font-size: .8rem;
    line-height: 1.6;
    padding: .75rem 1rem;
    border-radius: 2px;
    margin-bottom: 1.25rem;
  }
  .lp-error::before { content: '!'; font-weight: 900; flex-shrink: 0; }

  .lp-submit {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: .625rem;
    font-family: 'Outfit', sans-serif;
    font-size: .72rem;
    font-weight: 800;
    letter-spacing: .12em;
    text-transform: uppercase;
    padding: .95rem;
    background: #ee4c05;
    color: #ffffff;
    border: none;
    border-radius: 2px;
    cursor: pointer;
    clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
    transition: background .25s, transform .2s, box-shadow .25s;
    margin-top: .5rem;
  }
  .lp-submit:hover:not(:disabled) { background: #c2510c; transform: translateY(-1px); box-shadow: 0 10px 28px rgba(238,76,5,.35); }
  .lp-submit:disabled { opacity: .55; cursor: not-allowed; }

  .lp-divider {
    height: 1px;
    background: rgba(4,52,99,.1);
    margin: 1.75rem 0;
  }

  .lp-website-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: .5rem;
    width: 100%;
    font-family: 'Outfit', sans-serif;
    font-size: .68rem;
    font-weight: 700;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: #043463;
    border: 1.5px solid rgba(4,52,99,.2);
    padding: .75rem;
    border-radius: 2px;
    text-decoration: none;
    transition: border-color .2s, color .2s, background .2s;
  }
  .lp-website-link:hover { border-color: #0e7fbb; color: #0e7fbb; background: rgba(14,127,187,.04); }

  .lp-footer-note {
    margin-top: 2rem;
    text-align: center;
    font-size: .68rem;
    color: rgba(4,52,99,.35);
    letter-spacing: .04em;
  }
`;

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/api/token/", { username, password });
      const { access, refresh } = response.data;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      api.defaults.headers.common["Authorization"] = `Bearer ${access}`;

      const isSuperRes = await api.get("/api/is-superuser/");
      const isSuperuser = isSuperRes.data.is_superuser;

      if (isSuperuser) {
        navigate("/admin");
      } else {
        setError("Access denied: Not an admin user.");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid username or password");
      } else {
        setError("Server error. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{LOGIN_CSS}</style>
      <div className="lp-root">

        {/* ── Left brand panel ── */}
        <div className="lp-left">
          <div className="lp-slash" aria-hidden="true" />
          <div className="lp-slash lp-slash-2" aria-hidden="true" />
          <div className="lp-ghost" aria-hidden="true">IMARIKA</div>

          <div className="lp-left-top">
            <div className="lp-logo-wrap">
              <img src="/images/imarikalogo.jpeg" alt="Imarika Foundation" className="lp-logo" />
              <div className="lp-logo-name">
                Imarika Foundation
                <span>Staff Portal</span>
              </div>
            </div>

            <div className="lp-eyebrow">Admin Access</div>
            <h1 className="lp-headline">
              SIGN IN TO<br />
              <span>YOUR DASHBOARD.</span>
            </h1>
            <p className="lp-subline">
              Manage opportunities, tenders, programmes, and community impact data — all in one place.
            </p>
          </div>

          <div className="lp-stats">
            <div>
              <div className="lp-stat-n">160+</div>
              <div className="lp-stat-l">Students Sponsored</div>
            </div>
            <div>
              <div className="lp-stat-n">500+</div>
              <div className="lp-stat-l">Eye Surgeries</div>
            </div>
            <div>
              <div className="lp-stat-n">13K+</div>
              <div className="lp-stat-l">Trees Planted</div>
            </div>
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div className="lp-right">
          <div className="lp-card">

            {/* Mobile-only logo */}
            <div className="lp-mobile-logo">
              <img src="/images/imarikalogo.jpeg" alt="Imarika Foundation" />
              <div className="lp-mobile-logo-name">
                Imarika Foundation
                <span>Staff Portal</span>
              </div>
            </div>

            {/* Heading */}
            <div style={{ marginBottom: "1.75rem" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", fontSize: ".6rem", fontWeight: 800, letterSpacing: ".22em", textTransform: "uppercase", color: "#ee4c05", marginBottom: ".625rem" }}>
                <span style={{ width: "1.25rem", height: "2px", background: "#ee4c05", borderRadius: "2px", display: "inline-block" }} />
                Staff Only
              </span>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(1.75rem,4vw,2.25rem)", letterSpacing: ".04em", color: "#043463", lineHeight: .95 }}>
                WELCOME BACK.
              </h2>
              <p style={{ color: "#4a5568", fontSize: ".8rem", lineHeight: 1.75, marginTop: ".5rem" }}>
                Sign in with your Imarika staff credentials to continue.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="lp-error" role="alert">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}>
              {/* Username */}
              <div>
                <label className="lp-form-label" htmlFor="lp-username">Username</label>
                <div className="lp-input-wrap">
                  <span className="lp-input-icon"><User size={15} aria-hidden="true" /></span>
                  <input
                    id="lp-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoComplete="username"
                    className="lp-input"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="lp-form-label" htmlFor="lp-password">Password</label>
                <div className="lp-input-wrap">
                  <span className="lp-input-icon"><Lock size={15} aria-hidden="true" /></span>
                  <input
                    id="lp-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="lp-input"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="lp-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading} className="lp-submit">
                {loading ? (
                  <>
                    <LoaderCircle size={15} className="animate-spin" aria-hidden="true" />
                    Verifying…
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="lp-divider" />

            {/* Go to website */}
            <Link to="/" className="lp-website-link">
              <Globe size={13} aria-hidden="true" />
              Go to Website
            </Link>

            <p className="lp-footer-note">
              © {new Date().getFullYear()} Imarika Foundation · Kenya
            </p>
          </div>
        </div>

      </div>
    </>
  );
}