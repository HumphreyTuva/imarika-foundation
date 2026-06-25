import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";
import Lightbox from "yet-another-react-lightbox";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Navbar from "../components/Navbar";
import { FaArrowLeft, FaWhatsapp, FaCopy, FaCheck } from "react-icons/fa";
import "../components/coastal-fire.css";

const GL_CSS = `
  .gl-root { background: #ffffff; min-height: 100vh; color: #043463; scroll-behavior: smooth; }
  .gl-hero { padding: clamp(8rem, 15vh, 10rem) var(--cp) 6rem; position: relative; overflow: hidden; background: #043463; }
  .gl-ghost { position: absolute; font-family: 'Bebas Neue', sans-serif; font-size: clamp(8rem, 20vw, 22rem); color: rgba(238, 76, 5, 0.05); right: -2%; bottom: -5%; user-select: none; pointer-events: none; z-index: 0; }
  .gl-slash { position: absolute; width: 4px; background: #ee4c05; border-radius: 2px; transform: rotate(12deg); z-index: 1; }
  .gl-container { padding: 0 var(--cp) 8rem; max-width: var(--cw); margin: 0 auto; position: relative; z-index: 2; margin-top: -3rem; }
  .gl-masonry { columns: 1; column-gap: 1.5rem; }
  @media(min-width: 640px) { .gl-masonry { columns: 2; } }
  @media(min-width: 1024px) { .gl-masonry { columns: 3; } }

  .gl-item { break-inside: avoid; margin-bottom: 1.5rem; position: relative; border-radius: 2px; overflow: hidden; background: #f0f4f8; border: 1px solid rgba(4,52,99,0.1); cursor: pointer; transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); opacity: 0; transform: translateY(30px); }
  .gl-item.in { opacity: 1; transform: none; }
  .gl-item:hover { transform: translateY(-8px) scale(1.01); border-color: #ee4c05; box-shadow: 0 20px 40px rgba(4,52,99,0.1); z-index: 10; }
  .gl-item img { width: 100%; display: block; transition: transform 0.6s ease; filter: grayscale(10%); }
  .gl-item:hover img { transform: scale(1.05); filter: grayscale(0%); }
  .gl-item-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(4,52,99,0.8) 0%, transparent 40%); opacity: 0; transition: opacity 0.3s; display: flex; align-items: flex-end; padding: 1.5rem; }
  .gl-item:hover .gl-item-overlay { opacity: 1; }

  .gl-share-bar { display: flex; gap: 0.75rem; margin-top: 2.5rem; align-items: center; flex-wrap: wrap; }
  .gl-share-btn { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #ffffff; border: 1px solid rgba(4,52,99,0.2); color: #043463; transition: all 0.3s; cursor: pointer; }
  .gl-share-btn:hover { background: #ee4c05; border-color: #ee4c05; color: #ffffff; transform: translateY(-3px); }
  .gl-share-btn.copied { background: #22c55e; border-color: #22c55e; color: #ffffff; }
  .gl-back-link { display: inline-flex; align-items: center; gap: 0.75rem; color: rgba(255,255,255,0.7); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.2em; font-weight: 700; transition: color 0.3s; margin-bottom: 2.5rem; text-decoration:none; }
  .gl-back-link:hover { color: #ee4c05; }
`;

const GalleryItem = ({ img, index, title, onOpen }) => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        el.classList.add("in");
        obs.disconnect();
      }
    }, { threshold: 0.05 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div 
      ref={ref}
      className="gl-item" 
      style={{ transitionDelay: `${(index % 5) * 80}ms` }}
      onClick={() => onOpen(index)}
    >
      <img src={img.image} alt={`${title} capture ${index + 1}`} loading="lazy" />
      <div className="gl-item-overlay">
        <span className="ld-card-view" style={{ fontSize: '0.6rem', color: '#ffffff', fontWeight: '800', letterSpacing: '.12em', textTransform: 'uppercase' }}>
          Open Frame {index + 1}
        </span>
      </div>
    </div>
  );
};

const GalleryPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    axios.get("https://imarikafoundation.org/api/api/events/past/")
      .then((res) => {
        const foundEvent = res.data.find((ev) => String(ev.id) === String(id));
        setEvent(foundEvent || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [id]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWA = () => {
    const url = `https://wa.me/?text=${encodeURIComponent("Check out this gallery: " + window.location.href)}`;
    window.open(url, '_blank');
  };

  if (loading) return <div className="gl-root flex items-center justify-center"><div className="cf-skel" style={{ width: 120, height: 4, background: '#e2e8f0' }} /></div>;
  if (!event) return <div className="gl-root flex flex-col items-center justify-center p-20"><h1 className="cf-h1" style={{ color: '#043463' }}>404</h1><Link to="/" className="cf-btn cf-btn-orange">Back</Link></div>;

  return (
    <div className="gl-root">
      <style>{GL_CSS}</style>
      <Helmet><title>{event.title} | Archive</title></Helmet>
      <Navbar />

      <section className="gl-hero">
        <div className="gl-ghost">ARCHIVE</div>
        <div className="gl-slash" style={{ height: "140px", left: "var(--cp)", top: "15%" }} />
        <div style={{ maxWidth: "var(--cw)", margin: "0 auto", position: "relative", zIndex: 2 }}>
          <Link to="/news" className="gl-back-link"><FaArrowLeft /> Exit Gallery</Link>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: '2rem' }}>
            <div style={{ flex: '1 1 600px' }}>
              <span className="cf-label" style={{ color: "#46c5e4" }}>EVENT LOG • {new Date(event.event_date).getFullYear()}</span>
              <h1 className="cf-h1" style={{ color: "#ffffff", marginTop: "0.75rem" }}>
                <span style={{ color: '#ee4c05' }}>{event.title.split(' ')[0]}</span> {event.title.split(' ').slice(1).join(' ')}
              </h1>
              <p style={{ color: "#46c5e4", lineHeight: 1.9, maxWidth: 600, fontSize: "1.05rem", marginTop: '2rem' }}>{event.description}</p>
            </div>
            <div className="gl-share-bar">
              <button onClick={shareWA} className="gl-share-btn" aria-label="Share on WhatsApp"><FaWhatsapp /></button>
              <button onClick={copyToClipboard} className={`gl-share-btn ${copied ? 'copied' : ''}`} aria-label="Copy link">
                {copied ? <FaCheck /> : <FaCopy />}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="gl-container">
        <div className="gl-masonry">
          {event.images?.map((img, i) => (
            <GalleryItem 
              key={i} 
              img={img} 
              index={i} 
              title={event.title} 
              onOpen={(idx) => { setPhotoIndex(idx); setOpen(true); }} 
            />
          ))}
        </div>
      </section>

      {open && (
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          index={photoIndex}
          plugins={[Slideshow, Thumbnails, Zoom]}
          slides={event.images.map((img) => ({ src: img.image }))}
          slideshow={{ autoplay: true, delay: 4000 }}
        />
      )}
    </div>
  );
};

export default GalleryPage;