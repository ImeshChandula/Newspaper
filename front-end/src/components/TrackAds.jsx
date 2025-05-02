import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TrackAds = () => {
    const [ads, setAds] = useState([]);
    const [error, setError] = useState('');
    const [activeOnly, setActiveOnly] = useState(false);
    const token = localStorage.getItem("token");

    const fetchAds = async () => {
        try {
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
        }
    };

    useEffect(() => {
        fetchAds();
    }, [activeOnly]);

    return (
        <div className="container py-5">
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

            <div className="row g-4">
                {ads.length === 0 ? (
                    <p className="text-center text-muted">No ads found.</p>
                ) : (
                    ads.map((ad, index) => (
                        <div className="col-sm-12 col-md-6 col-lg-4" key={index}>
                            <div className="card h-100 shadow-sm border border-secondary bg-dark">
                                {ad.media && (
                                    <img
                                        src={ad.media}
                                        className="card-img-top object-fit-cover"
                                        alt="Ad"
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                )}
                                <div className="card-body d-flex flex-column border-top border-secondary">
                                    <h5 className="card-title text-primary fw-bold">{ad.title}</h5>
                                    <p
                                        className="card-text mb-2 text-white"
                                        style={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}
                                    >
                                        {ad.content}
                                    </p>

                                    <div className="mb-2">
                                        <span className="fw-bold text-white">🔗 Link:</span>{' '}
                                        <a href={ad.link} target="_blank" rel="noreferrer" style={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}>{ad.link}</a>
                                    </div>

                                    <div className="mb-2 text-white">
                                        <span className="fw-bold">📅 Start:</span> {new Date(ad.startDate).toLocaleDateString()}
                                    </div>
                                    <div className="mb-2  text-white">
                                        <span className="fw-bold">⏳ End:</span>{' '}
                                        {ad.endDate ? new Date(ad.endDate).toLocaleDateString() : 'N/A'}
                                    </div>
                                    <div className="mb-3 text-white">
                                        <span className="fw-bold text-white">🟢 Status:</span>{' '}
                                        {ad.active ? (
                                            <span className="badge bg-success">Active</span>
                                        ) : (
                                            <span className="badge bg-danger">Inactive</span>
                                        )}
                                    </div>

                                    <div className="mt-auto border-top border-secondary">
                                        <hr />
                                        <div className="d-flex justify-content-between">
                                            <span className="badge bg-info text-dark">📊 {ad.impressions} Impressions</span>
                                            <span className="badge bg-warning text-dark">👁️ {ad.clicks} Clicks</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TrackAds;
