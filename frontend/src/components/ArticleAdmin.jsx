import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Globe, LayoutDashboard } from 'lucide-react';

const ArticleAdmin = () => {
  const [articles, setArticles] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const navigate = useNavigate();
  const apiUrl = 'https://imarikafoundation.org/api/api/api/articles/';

  const fetchArticles = useCallback(() => {
    axios
      .get(apiUrl)
      .then((res) => setArticles(res.data.results))
      .catch((err) => {
        console.error('Error:', err);
        showFeedback('error', 'Failed to fetch articles.');
      });
  }, [apiUrl]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: '', message: '' }), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (file) formData.append('file', file);

    setLoading(true);

    const request = editingId
      ? axios.put(`${apiUrl}${editingId}/`, formData)
      : axios.post(apiUrl, formData);

    request
      .then(() => {
        fetchArticles();
        resetForm();
        showFeedback('success', editingId ? 'Article updated!' : 'Article created!');
      })
      .catch((err) => {
        console.error('Error:', err);
        showFeedback('error', 'Failed to save article. Please try again.');
      })
      .finally(() => setLoading(false));
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setFile(null);
    setEditingId(null);
  };

  const handleEdit = (article) => {
    setTitle(article.title);
    setContent(article.content);
    setFile(null);
    setEditingId(article.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = () => {
    axios
      .delete(`${apiUrl}${deleteId}/`)
      .then(() => {
        fetchArticles();
        setShowConfirm(false);
        setDeleteId(null);
        showFeedback('success', 'Article deleted successfully!');
      })
      .catch((err) => {
        console.error('Error:', err);
        showFeedback('error', 'Failed to delete article.');
      });
  };

  return (
    <>
      {/* Feedback Toast */}
      {feedback.message && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg text-white text-sm bg-sky-500">
          {feedback.message}
        </div>
      )}

      <section className="px-4 py-10 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-6 mb-10">
            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2 px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-md"
            >
              <Globe className="w-5 h-5" />
              Website
            </button>
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md"
            >
              <LayoutDashboard className="w-5 h-5" />
              Admin Home
            </button>
          </div>

          {/* Article Form */}
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">📝 Article Management</h2>
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl shadow mb-10 space-y-4 border"
          >
            <h3 className="text-xl font-semibold text-blue-700">
              {editingId ? '✏️ Edit Article' : '➕ Add New Article'}
            </h3>

            <input
              type="text"
              placeholder="Article Title"
              className="w-full px-4 py-2 border rounded-lg"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              placeholder="Write article content here..."
            />

            <input
              type="file"
              className="mt-2"
              onChange={(e) => setFile(e.target.files[0])}
              accept=".pdf,.doc,.docx"
            />

            <div className="flex justify-end gap-4">
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </form>

          {/* Articles List */}
          <h3 className="text-2xl font-semibold text-blue-800 mb-4 text-center">
            📚 All Articles
          </h3>

          <div className="grid sm:grid-cols-2 gap-6">
            {articles.map((article) => (
              <div
                key={article.id}
                className="bg-white p-5 rounded-xl shadow border space-y-2"
              >
                <h4 className="text-lg font-bold text-blue-700 line-clamp-2">
                  {article.title}
                </h4>
                <p
                  className="text-sm text-gray-500 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
                <div className="flex justify-between items-center pt-2">
                  <div className="text-xs text-gray-500">
                    {article.file ? '📄 Has File' : '📝 Text Only'}
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEdit(article)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setShowConfirm(true);
                        setDeleteId(article.id);
                      }}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full space-y-4 text-center">
              <h4 className="text-lg font-semibold text-red-600">
                Confirm Deletion
              </h4>
              <p className="text-gray-600">
                Are you sure you want to delete this article?
              </p>
              <div className="flex justify-center gap-4 pt-2">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default ArticleAdmin;
