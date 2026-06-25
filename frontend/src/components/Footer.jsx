import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, 
  FaFacebookF, FaTwitter, FaYoutube, FaLock 
} from "react-icons/fa";

const FOOTER_CSS = `
  .cf-footer { background: #050505; padding: 5rem var(--cp) 2rem; border-top: 1px solid rgba(255,255,255,.05); color: #fff; }
  .cf-footer-grid { maxWidth: var(--cw); margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 4rem; }
  .cf-footer-brand h4 { font-family: 'Bebas Neue', sans-serif; font-size: 1.8rem; letter-spacing: .05em; }
  .cf-footer-label { color: var(--cf-orange); font-size: .65rem; font-weight: 800; text-transform: uppercase; letter-spacing: .15em; margin-bottom: 1.5rem; display: block; }
  .cf-footer-links { list-style: none; padding: 0; margin: 0; }
  .cf-footer-links li { margin-bottom: .75rem; }
  .cf-footer-links a { color: rgba(255,255,255,.4); text-decoration: none; font-size: .85rem; transition: color .2s; }
  .cf-footer-links a:hover { color: #fff; }
  .cf-footer-contact { font-size: .85rem; color: rgba(255,255,255,.5); }
  .cf-footer-contact p { display: flex; align-items: center; gap: .75rem; margin-bottom: 1rem; }
  .cf-footer-social { display: flex; gap: 1rem; margin-top: 1.5rem; }
  .cf-footer-social a { width: 32px; height: 32px; border-radius: 2px; background: rgba(255,255,255,.05); display: flex; align-items: center; justify-content: center; color: #fff; transition: all .2s; font-size: .9rem; }
  .cf-footer-social a:hover { background: var(--cf-orange); color: #080808; }
  .cf-footer-bottom { margin-top: 5rem; pt-2; border-top: 1px solid rgba(255,255,255,.03); padding-top: 2rem; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 2rem; }
  .cf-footer-copy { font-size: .7rem; color: rgba(255,255,255,.2); text-transform: uppercase; letter-spacing: .1em; }
  .cf-footer-admin { font-size: .65rem; color: rgba(255,255,255,.15); text-decoration: none; display: flex; align-items: center; gap: .4rem; text-transform: uppercase; font-weight: 700; transition: color .2s; }
  .cf-footer-admin:hover { color: rgba(255,255,255,.5); }
`;

export default function Footer() {
  return (
    <footer className="cf-footer">
      <style>{FOOTER_CSS}</style>
      <div className="cf-footer-grid">
        {/* Brand Section */}
        <div className="cf-footer-brand">
          <h4>IMARIKA <span style={{color:'var(--cf-orange)'}}>FOUNDATION</span></h4>
          <p style={{ color: "rgba(255,255,255,.4)", fontSize: ".85rem", marginTop: "1rem", lineHeight: "1.6" }}>
            Empowering Communities, Transforming Lives. Partnering for a brighter, resilient future in Kenya.
          </p>
          <div className="cf-footer-social">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaYoutube /></a>
          </div>
        </div>

        {/* Quick Links per Blueprint */}
        <div>
          <span className="cf-footer-label">Quick Links</span>
          <ul className="cf-footer-links">
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/programs">Our Programs</Link></li>
            <li><Link to="/impact">Impact</Link></li>
            <li><Link to="/leadership">Leadership</Link></li>
            <li><Link to="/articles">Articles</Link></li>
            <li><Link to="/tenders">Tenders</Link></li>
          </ul>
        </div>

        {/* Contact Info per Blueprint */}
        <div>
          <span className="cf-footer-label">Contact Us</span>
          <div className="cf-footer-contact">
            <p><FaMapMarkerAlt style={{color:'var(--cf-orange)'}} /> Kilifi, Kenya</p>
            <p><FaPhoneAlt style={{color:'var(--cf-orange)'}} /> +254 790 289 989</p>
            <p><FaEnvelope style={{color:'var(--cf-orange)'}} /> info@imarikafoundation.org</p>
          </div>
        </div>
      </div>

      <div className="cf-footer-bottom" style={{ maxWidth: 'var(--cw)', margin: '5rem auto 0' }}>
        <p className="cf-footer-copy">
          © 2026 Imarika Foundation. All Rights Reserved.
        </p>
        
        {/* Discrete Staff Login */}
        <Link to="/admin-login" className="cf-footer-admin">
          <FaLock size={10} /> Staff Login
        </Link>
      </div>
    </footer>
  );
}