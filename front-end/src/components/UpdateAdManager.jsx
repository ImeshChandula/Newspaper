import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const UpdateAdManager = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [form, setForm] = useState({
        title: '',
        content: '',
        media: '',
        link: '',
        endDate: '',
    });

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [mediaError, setMediaError] = useState('');

    // Check if URL contains blocked social media and file hosting links
  const validateUrl = (url) => {
    if (!url) return true;
    
    const blockedDomains = [
      // Social media platforms
      'facebook.com', 'fb.com', 'fb.me', 'facebook.me',
      'instagram.com', 'instagr.am', 'instagram',
      'tiktok.com', 'tiktok', 'vm.tiktok.com',
      
      // File hosting services
      'mega.nz', 'mega.io', 'mega.co.nz',
      'mediafire.com', 'mfi.re'
    ];
    
    const lowercaseUrl = url.toLowerCase();
    return !blockedDomains.some(domain => lowercaseUrl.includes(domain));
  };

  // Validate URLs whenever they change
  useEffect(() => {
    if (form.media && !validateUrl(form.media)) {
      setMediaError('Facebook, Instagram, TikTok, Mega, and Mediafire links are not allowed');
    } else {
      setMediaError('');
    }
  }, [form.media]);

    useEffect(() => {
        const fetchAd = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL_ADS}/getSingleAd/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const ad = response.data.ad;
                setForm({
                    title: ad.title || '',
                    content: ad.content || '',
                    media: ad.media || '',
                    link: ad.link || '',
                    endDate: ad.endDate ? ad.endDate.substring(0, 10) : '',
                });
            } catch (err) {
                setError('❌ Failed to load ad details');
            }
        };
        fetchAd();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));

        // Clear specific error when user starts modifying the field
    if (name === 'media') {
        setMediaError('');
      }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate both URLs before submission
        const isMediaValid = validateUrl(form.media);

        if (!isMediaValid) {
            setMediaError('Facebook, Instagram, TikTok, Mega, and Mediafire links are not allowed');
            return; // Prevent form submission
        }
        
        setMessage('');
        setError('');
        try {
            const response = await axios.patch(
                `${process.env.REACT_APP_API_BASE_URL_ADS}/updateAd/${id}`,
                form,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            setMessage("✅ " + response.data.msg);
            setTimeout(() => navigate('/dashboard/super-admin'), 1500);
        } catch (err) {
            setError(err.response?.data?.msg || "❌ Failed to update ad");
        } 
    };

    const handleCancel = () => navigate(-1);



    return (
        <div className="container pt-5 mt-5">
            <div className="bg-white text-black p-5 rounded shadow-lg">
                <h2 className="text-center text-black mb-4 fw-bold">✏️ Update Advertisement</h2>

                {message && <div className="alert alert-success text-center">{message}</div>}
                {error && <div className="alert alert-danger text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="row g-4">

                    <div className="col-md-6">
                        <label className="form-label">Title</label>
                        <input
                            type="text"
                            name="title"
                            className="form-control border border-black"
                            value={form.title}
                            onChange={handleChange}
                            required
                            placeholder="Enter ad title"
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">End Date</label>
                        <input
                            type="date"
                            name="endDate"
                            className="form-control border border-black"
                            value={form.endDate}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-12">
                        <label className="form-label">Content</label>
                        <textarea
                            name="content"
                            className="form-control border border-black"
                            rows="4"
                            value={form.content}
                            onChange={handleChange}
                            required
                            placeholder="Enter ad content or description"
                        ></textarea>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Media URL</label>
                        <input
                            type="text"
                            name="media"
                            className={`form-control border border-black ${mediaError ? 'is-invalid' : ''}`}
                            value={form.media}
                            onChange={handleChange}
                            required
                            placeholder="Ex: Google Drive link / Image link"
                        />
                        {mediaError && (
                            <div className="invalid-feedback">
                                {mediaError}
                            </div>
                        )}
                        <small className="form-text text-muted">
                            Note: Facebook, Instagram, TikTok, Mega, and Mediafire links are not allowed
                        </small>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Ad Link</label>
                        <input
                            type="text"
                            name="link"
                            className="form-control border border-black"
                            value={form.link}
                            onChange={handleChange}
                            required
                            placeholder="https://your-link.com"
                        />
                    </div>

                    <div className="col-12 text-center">
                        <button type="submit" className="btn btn-warning mt-3 me-3">💾 Update Ad</button>
                        <button type="button" className="btn btn-outline-danger mt-3" onClick={handleCancel}>↩️ Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateAdManager;
