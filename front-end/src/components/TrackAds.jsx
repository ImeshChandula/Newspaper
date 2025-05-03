import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TrackAds = () => {
    const [ads, setAds] = useState([]);
    const [error, setError] = useState('');
    const [activeOnly, setActiveOnly] = useState(false);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const fetchAds = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:5000/api/ads/getAllAds${activeOnly ? '?active=true' : ''}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setAds(response.data.ads);
            setError('');
        } catch (err) {
            setError('❌ Error fetching ads: ' + (err.response?.data?.msg || err.message));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAds();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeOnly]);

    const handleUpdate = (adId) => {
        navigate(`/update-ad/${adId}`);
    };

    const handleDelete = async (adId) => {
        if (window.confirm("Are you sure you want to delete this ad?")) {
            try {
                await axios.delete(`http://localhost:5000/api/ads/deleteAd/${adId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setAds(prev => prev.filter(ad => ad._id !== adId)); // remove from UI
            } catch (err) {
                setError('❌ Failed to delete ad: ' + (err.response?.data?.msg || err.message));
            }
        }
    };

    return (
        <div className="container">
            <h2 className="text-center text-primary mb-4">📢 Track Submitted Ads</h2>

            {error && <div className="alert alert-danger text-center">{error}</div>}

            <div className="d-flex justify-content-center align-items-center mb-4">
                <label className="form-check-label me-2 fw-semibold text-white">Show only active ads:</label>
                <div className="form-check form-switch">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={activeOnly}
                        onChange={(e) => setActiveOnly(e.target.checked)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center text-light">Loading ads...</div>
            ) : (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
                    {ads.length === 0 ? (
                        <p className="text-center text-muted">No ads found.</p>
                    ) : (
                        ads.map((ad) => (
                            <div key={ad._id} className="col">
                                <div className="card h-100 shadow bg-dark text-light border border-secondary rounded-4">
                                    {ad.media && (
                                        <img
                                            src={ad.media}
                                            className="card-img-top rounded-top"
                                            alt="Ad"
                                            style={{ height: '200px', objectFit: 'cover' }}
                                        />
                                    )}
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title text-info fw-bold">{ad.title}</h5>

                                        <p className="card-text text-white" style={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}>
                                            {ad.content}
                                        </p>

                                        <div className="mb-2 small">
                                            <span className="fw-semibold">🔗 Link:</span>{' '}
                                            <a
                                                href={ad.link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-warning text-break"
                                                style={{
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                }}
                                            >
                                                {ad.link}
                                            </a>
                                        </div>

                                        <div className="mb-2 small">
                                            <span className="fw-semibold">📅 Start:</span>{' '}
                                            {new Date(ad.startDate).toLocaleDateString()}
                                        </div>

                                        <div className="mb-2 small">
                                            <span className="fw-semibold">⏳ End:</span>{' '}
                                            {ad.endDate ? new Date(ad.endDate).toLocaleDateString() : 'N/A'}
                                        </div>

                                        <div className="mb-2 small">
                                            <span className="fw-semibold"> By: </span>{' '}
                                            {ad.author.username}
                                        </div>

                                        <div className="mb-3">
                                            <span className="fw-semibold">🟢 Status:</span>{' '}
                                            {ad.active ? (
                                                <span className="badge bg-success">Active</span>
                                            ) : (
                                                <span className="badge bg-danger">Inactive</span>
                                            )}
                                        </div>

                                        <div className="mt-auto">
                                            <hr />
                                            <div className="d-flex justify-content-between mb-3">
                                                <span className="badge bg-info text-dark">📊 {ad.impressions} Impressions</span>
                                                <span className="badge bg-warning text-dark">👁️ {ad.clicks} Clicks</span>
                                            </div>
                                            <div className="d-grid gap-2">
                                                <button
                                                    className="btn btn-outline-primary"
                                                    onClick={() => handleUpdate(ad._id)}
                                                >
                                                    ✏️ Update
                                                </button>
                                                <button
                                                    className="btn btn-outline-danger"
                                                    onClick={() => handleDelete(ad._id)}
                                                >
                                                    🗑️ Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default TrackAds;
