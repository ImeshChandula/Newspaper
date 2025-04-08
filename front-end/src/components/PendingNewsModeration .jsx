import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PendingNewsModeration  = () => {

  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchPendingNews = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/news/pending`);
      setNews(res.data);
    } catch (error) {
      console.error('Error fetching pending news:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingNews();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      setActionLoading(id);
      await axios.patch(`http://localhost:5000/api/news/updateStatus/${id}`, { status });
      // Remove updated article from the list
      setNews(news.filter(article => article._id !== id));
    } catch (error) {
      console.error(`Failed to ${status} article:`, error);
    } finally {
      setActionLoading(null);
    }
  };


  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Pending News Moderation</h2>
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : news.length === 0 ? (
        <p className="text-center text-green-600">No pending articles to review.</p>
      ) : (
        <div className="grid gap-6">
          {news.map((article) => (
            <div key={article._id} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm bg-yellow-100 text-yellow-700 px-3 py-1 rounded">{article.category}</span>
                <span className="text-xs text-gray-500">
                  {new Date(article.date).toLocaleString()}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{article.title}</h3>
              {article.media && (
                <img src={article.media} alt="media" className="w-full max-h-60 object-cover rounded-lg mb-3" />
              )}
              <p className="text-gray-700">{article.content.slice(0, 150)}...</p>
              <p className="mt-3 text-sm text-gray-500">By: {article.author?.username} ({article.author?.email})</p>

              <div className="flex gap-4 mt-5">
                <button
                  onClick={() => updateStatus(article._id, 'accept')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  disabled={actionLoading === article._id}
                >
                  {actionLoading === article._id ? 'Accepting...' : 'Accept'}
                </button>
                <button
                  onClick={() => updateStatus(article._id, 'reject')}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                  disabled={actionLoading === article._id}
                >
                  {actionLoading === article._id ? 'Rejecting...' : 'Reject'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PendingNewsModeration 