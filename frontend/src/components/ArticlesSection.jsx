import axios from 'axios';
import { useEffect, useState, useRef } from 'react';

const ArticlesSection = () => {
  const [articles, setArticles] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);

  useEffect(() => {
    axios.get('https://imarikafoundation.org/api/api/api/articles/')
      .then(res => {
        setArticles(res.data.results);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching articles:', err);
        setLoading(false);
      });
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(prevId => (prevId === id ? null : id));
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const current = articles.find(a => a.id === expandedId);

  if (loading) {
    return (
      <section ref={sectionRef} className="py-20 px-4 bg-gray-50 text-center">
        <div className="mx-auto w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin" />
      </section>
    );
  }

  if (articles.length === 0) {
    return (
      <section ref={sectionRef} className="py-20 px-4 bg-gray-50 text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Latest Articles</h2>
        <p className="text-gray-500">No articles available at the moment.</p>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="articles"
      className="pt-16 pb-16 px-4 sm:px-6 lg:px-8 bg-gray-50 scroll-mt-24"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-10 text-gray-800">
          📚 Latest Articles
        </h2>

        {expandedId && current ? (
          <div className="relative bg-white px-4 py-6 sm:p-8 md:p-14 rounded-3xl shadow-xl border-2 border-blue-100 max-w-4xl mx-auto overflow-hidden">

            {/* Top Decorative Line */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-blue-300 rounded-t-3xl" />

            <div className="mb-6 text-center mt-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-800 underline decoration-blue-400 decoration-2 underline-offset-4">
                {current.title}
              </h1>
              <p className="text-gray-500 text-sm mt-2 italic">Published by Imarika Foundation</p>
            </div>

            {current.file ? (
              <div className="text-center mt-8">
                <a
                  href={current.file}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full text-sm sm:text-base hover:bg-blue-700 transition"
                >
                  📄 Download Full Article
                </a>
              </div>
            ) : (
              <div className="prose prose-sm sm:prose-base md:prose-lg prose-blue max-w-none text-justify leading-relaxed">
                <div dangerouslySetInnerHTML={{ __html: current.content }} />
              </div>
            )}

            <div className="mt-8 sm:mt-12 text-center">
              <button
                onClick={() => toggleExpand(expandedId)}
                className="text-blue-600 hover:underline text-sm"
              >
                ← Back to all articles
              </button>
            </div>

            {/* Bottom Decorative Line */}
            <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-blue-300 to-blue-500 rounded-b-3xl" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="flex gap-4 sm:gap-6 min-w-fit">
              {articles.map(article => (
                <div
                  key={article.id}
                  className="bg-white min-w-[240px] sm:min-w-[260px] max-w-xs p-4 sm:p-6 rounded-2xl shadow hover:shadow-md transition-all border border-gray-200 flex-shrink-0"
                >
                  <h3 className="text-blue-700 font-semibold text-base sm:text-lg mb-2 sm:mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">By Imarika Foundation</p>
                  <button
                    onClick={() => toggleExpand(article.id)}
                    className="text-blue-600 text-xs sm:text-sm hover:underline font-medium"
                  >
                    {article.file ? "📥 Download" : "📖 Read More"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ArticlesSection;
