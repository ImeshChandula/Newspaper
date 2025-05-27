/* eslint-disable no-useless-escape */
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';

const TrackSubmittedAds = () => {

    const [ads, setAds] = useState([]);
    const [error, setError] = useState('');
    const [activeOnly, setActiveOnly] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState({});
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const dropdownRefs = useRef({});

    const fetchAds = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${process.env.REACT_APP_API_BASE_URL_ADS}/getAllAds${activeOnly ? '?active=true' : ''}`,
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

    useEffect(() => {
        // Close dropdown when clicking outside
        const handleClickOutside = (event) => {
            for (const adId in dropdownRefs.current) {
                if (dropdownRefs.current[adId] &&
                    !dropdownRefs.current[adId].contains(event.target) &&
                    dropdownOpen[adId]) {

                    setDropdownOpen(prev => ({
                        ...prev,
                        [adId]: false
                    }));
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownOpen]);

    const handleUpdate = (adId) => {
        navigate(`/update-ad/${adId}`);
    };

    const handleDelete = async (adId) => {
        if (window.confirm("Are you sure you want to delete this ad?")) {
            try {
                await axios.delete(`${process.env.REACT_APP_API_BASE_URL_ADS}/deleteAd/${adId}`, {
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

    const toggleDropdown = (adId) => {
        setDropdownOpen(prev => ({
            ...prev,
            [adId]: !prev[adId]
        }));
    };

    const updateAdStatus = async (adId, isActive) => {
        try {
            await axios.patch(
                `${process.env.REACT_APP_API_BASE_URL_ADS}/updateAd/${adId}`,
                { active: isActive },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Update the status in UI
            setAds(prev => prev.map(ad =>
                ad._id === adId ? { ...ad, active: isActive } : ad
            ));

            // Close the dropdown
            setDropdownOpen(prev => ({
                ...prev,
                [adId]: false
            }));

        } catch (err) {
            setError('❌ Failed to update status: ' + (err.response?.data?.msg || err.message));
        }
    };

    const [previewType, setPreviewType] = useState('image'); // 'image' or 'video'
    const [previewUrl, setPreviewUrl] = useState('');
    const [showImageModal, setShowImageModal] = useState(false);

    // Extract Google Drive file ID from URL
    const getDriveFileId = (url) => {
        if (!url) return null;

        // Handle different Google Drive URL formats
        // Format 1: https://drive.google.com/file/d/{fileId}/view
        // Format 2: https://drive.google.com/open?id={fileId}
        // Format 3: https://docs.google.com/document/d/{fileId}/edit

        let fileId = null;

        if (url.includes('drive.google.com/file/d/')) {
            const match = url.match(/\/file\/d\/([^/]+)/);
            if (match && match[1]) fileId = match[1];
        } else if (url.includes('drive.google.com/open?id=')) {
            const urlObj = new URL(url);
            fileId = urlObj.searchParams.get('id');
        } else if (url.includes('docs.google.com')) {
            const match = url.match(/\/d\/([^/]+)/);
            if (match && match[1]) fileId = match[1];
        }

        return fileId;
    };

    // Check if URL is a Google Drive URL
    const isDriveUrl = (url) => {
        if (!url) return false;
        return url.includes('drive.google.com') || url.includes('docs.google.com');
    };

    // Function to detect media type from URL
    // Function to detect media type from URL
    const detectMediaType = (url) => {
        if (!url) return 'unknown';

        // Normalize to lowercase for easier matching
        const urlLower = url.toLowerCase();

        // Check for direct image URLs
        if (urlLower.match(/\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/)) {
            return 'image';
        }

        // Check for direct video URLs
        if (urlLower.match(/\.(mp4|webm|ogg|mov|avi)(\?.*)?$/)) {
            return 'direct-video';
        }

        // More specific Google Drive detection
        if (isDriveUrl(url)) {
            // Try to determine if it's a Drive image or video
            if (urlLower.match(/\.(jpeg|jpg|gif|png|webp|svg)/) ||
                url.includes('drive.google.com/uc?') ||
                url.includes('docs.google.com/uc?')) {
                return 'google-drive-image';
            } else if (urlLower.match(/\.(mp4|webm|ogg|mov|avi)/)) {
                return 'google-drive-video';
            } else {
                return 'google-drive';
            }
        }

        // Unknown media type
        return 'unknown';
    };

    // Function to get embedded content for Google Drive
    const getGoogleDriveEmbedUrl = (url) => {
        const fileId = getDriveFileId(url);
        if (fileId) {
            return `https://drive.google.com/file/d/${fileId}/preview`;
        }
        return null;
    };

    // Function to get direct image URL for Google Drive images
    const getGoogleDriveImageUrl = (url) => {
        const fileId = getDriveFileId(url);
        if (fileId) {
            return `https://lh3.googleusercontent.com/d/${fileId}`;
        }
        return url; // Return original URL if cannot be formatted
    };

    const handleMediaClick = (mediaUrl) => {
        const mediaType = detectMediaType(mediaUrl);

        switch (mediaType) {
            case 'google-drive':
            case 'google-drive-video':
                setPreviewType('iframe');
                const embedUrl = getGoogleDriveEmbedUrl(mediaUrl);
                if (embedUrl) {
                    setPreviewUrl(embedUrl);
                    setShowImageModal(true);
                }
                break;

            case 'google-drive-image':
                setPreviewType('image');
                // Get the formatted direct image URL
                const imageUrl = getGoogleDriveImageUrl(mediaUrl);
                setPreviewUrl(imageUrl);
                setShowImageModal(true);
                break;

            case 'direct-video':
                setPreviewType('direct-video');
                setPreviewUrl(mediaUrl);
                setShowImageModal(true);
                break;

            case 'image':
            default:
                // Regular image or unknown type - just show the URL
                setPreviewType('image');
                setPreviewUrl(mediaUrl);
                setShowImageModal(true);
                break;
        }
    };

    // Render media with proper thumbnail for various types
    const renderMediaThumbnail = (mediaUrl) => {
        if (!mediaUrl) return null;

        const mediaType = detectMediaType(mediaUrl);

        // Handle specific media types directly
        switch (mediaType) {
            case 'google-drive-image': {
                // Get the formatted direct image URL for Google Drive images
                const formattedUrl = getGoogleDriveImageUrl(mediaUrl);

                return (
                    <div className="news-media-container">
                        <img
                            src={formattedUrl}
                            alt="Google Drive"
                            className="news-media rounded-top"
                            style={{
                                cursor: 'pointer',
                                objectFit: 'contain',
                                height: '200px',
                                width: '100%',
                                backgroundColor: '#f8f9fa'
                            }}
                            onClick={() => handleMediaClick(mediaUrl)}
                            onError={(e) => {
                                console.error("Failed to load Google Drive image");
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/400x200?text=Image+Not+Available";
                            }}
                            crossOrigin="anonymous"
                        />
                    </div>
                );
            }

            case 'google-drive-video':
            case 'google-drive': {
                // Get the embed URL for Google Drive files
                const embedUrl = getGoogleDriveEmbedUrl(mediaUrl);
                if (embedUrl) {
                    return (
                        <div className="news-media-container">
                            <div
                                className="ratio ratio-16x9 rounded-top"
                                style={{
                                    cursor: 'pointer',
                                    objectFit: 'contain',
                                    height: '200px',
                                    width: '100%',
                                    backgroundColor: '#f8f9fa'
                                }}>
                                <iframe
                                    src={embedUrl}
                                    title="Google Drive content"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    );
                }
                // If we can't embed, show placeholder
                return (
                    <div className="news-media-container">
                        <div
                            className="d-flex align-items-center justify-content-center rounded-top"
                            style={{
                                cursor: 'pointer',
                                objectFit: 'contain',
                                height: '200px',
                                width: '100%',
                                backgroundColor: '#f8f9fa'
                            }}
                            onClick={() => handleMediaClick(mediaUrl)}
                        >
                            <div className="text-center">
                                <i className="bi bi-file-earmark-text fs-1"></i>
                                <p>Google Drive File</p>
                            </div>
                        </div>
                    </div>
                );
            }

            case 'direct-video': {
                // For direct videos, show a placeholder with video icon
                return (
                    <div className="news-media-container">
                        <div
                            className="d-flex align-items-center justify-content-center rounded-top"
                            style={{
                                cursor: 'pointer',
                                objectFit: 'contain',
                                height: '200px',
                                width: '100%',
                                backgroundColor: '#f8f9fa'
                            }}
                            onClick={() => handleMediaClick(mediaUrl)}
                        >
                            <div className="text-center">
                                <i className="bi bi-film fs-1"></i>
                                <p>Video</p>
                            </div>
                        </div>
                    </div>
                );
            }

            case 'image':
            default: {
                // For regular images or unknown types
                return (
                    <div className="news-media-container">
                        <img
                            src={mediaUrl}
                            alt="Media"
                            className="news-media rounded-top"
                            style={{
                                cursor: 'pointer',
                                objectFit: 'contain',
                                height: '200px',
                                width: '100%',
                                backgroundColor: '#f8f9fa'
                            }}
                            onClick={() => handleMediaClick(mediaUrl)}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/400x200?text=Image+Not+Available";
                            }}
                        />
                    </div>
                );
            }
        }
    };



    return (
        <div className="container">
            <h2 className="text-center text-black mb-4 fw-bold">📢 Track Submitted Ads</h2>

            {error && <div className="alert alert-danger text-center">{error}</div>}

            <div className="d-flex justify-content-center align-items-center mb-4">
                <label className="form-check-label me-2 fw-semibold text-black">Show only active ads:</label>
                <div className="form-check form-switch">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={activeOnly}
                        onChange={(e) => setActiveOnly(e.target.checked)}
                    />
                </div>
            </div>

            {/* Media Preview Modal */}
            <Modal show={showImageModal} onHide={() => setShowImageModal(false)} centered size="lg">
                <Modal.Header closeButton className='bg-white text-black'>
                    <Modal.Title>
                        {previewType === 'iframe' ? 'Document Preview' :
                            previewType === 'direct-video' ? 'Video Preview' :
                                'Image Preview'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center bg-white p-0">
                    {previewType === 'iframe' ? (
                        <div className="ratio ratio-16x9">
                            <iframe
                                src={previewUrl}
                                title="Document Preview"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    ) : previewType === 'direct-video' ? (
                        <div className="ratio ratio-16x9">
                            <video controls>
                                <source src={previewUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    ) : (
                        <img
                            src={previewUrl}
                            alt='Preview of the uploaded file'
                            className="img-fluid"
                            style={{ maxHeight: '70vh' }}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/800x600?text=Image+Not+Available";
                            }}
                        />
                    )}
                </Modal.Body>
            </Modal>

            {loading ? (
                <div className="text-center text-black">Loading ads...</div>
            ) : (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
                    {ads.length === 0 ? (
                        <p className="text-center text-muted">No ads found.</p>
                    ) : (
                        ads.map((ad) => (
                            <div key={ad._id} className="col">
                                <div className="card h-100 shadow bg-white text-muted border border-secondary rounded-4">

                                    {/* Media content */}
                                    {ad.media && renderMediaThumbnail(ad.media)}

                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title text-black fw-bold">{ad.title}</h5>

                                        <p className="card-text text-black" style={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}>
                                            {ad.content}
                                        </p>

                                        <div className="mb-2 small text-black">
                                            <span className="fw-semibold">🔗 Link:</span>{' '}
                                            <a
                                                href={ad.link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-primary text-break"
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

                                        <div className="mb-2 small text-black">
                                            <span className="fw-semibold">📅 Start:</span>{' '}
                                            {new Date(ad.startDate).toLocaleDateString()}
                                        </div>

                                        <div className="mb-2 small text-black">
                                            <span className="fw-semibold">⏳ End:</span>{' '}
                                            {ad.endDate ? new Date(ad.endDate).toLocaleDateString() : 'N/A'}
                                        </div>

                                        <div className="mb-2 small text-black">
                                            <span className="fw-semibold">✍️ By:</span>{' '}
                                            {ad.author?.username || "Unknown"}
                                        </div>

                                        <div className="mb-3 position-relative">
                                            <span className="fw-semibold text-black">🟢 Status:</span>{' '}
                                            <div className="dropdown d-inline-block" ref={el => dropdownRefs.current[ad._id] = el}>
                                                <button
                                                    className={`btn btn-sm ${ad.active ? 'btn-success' : 'btn-danger'} dropdown-toggle`}
                                                    type="button"
                                                    onClick={() => toggleDropdown(ad._id)}
                                                    aria-expanded={dropdownOpen[ad._id] || false}
                                                >
                                                    {ad.active ? 'Active' : 'Inactive'}
                                                </button>
                                                <ul
                                                    className={`dropdown-menu ${dropdownOpen[ad._id] ? 'show' : ''}`}
                                                    style={{ minWidth: '100%' }}
                                                >
                                                    <li>
                                                        <button
                                                            className="dropdown-item text-success"
                                                            onClick={() => updateAdStatus(ad._id, true)}
                                                        >
                                                            Active
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button
                                                            className="dropdown-item text-danger"
                                                            onClick={() => updateAdStatus(ad._id, false)}
                                                        >
                                                            Inactive
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
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
    )
}

export default TrackSubmittedAds;