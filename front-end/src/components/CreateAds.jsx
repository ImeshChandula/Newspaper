import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateAds = () => {
  const [form, setForm] = useState({
    title: '',
    content: '',
    media: '',
    link: '',
    phoneNumber: '',
    endDate: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const [mediaError, setMediaError] = useState('');

  // Check if URL contains blocked social media and file hosting links
  const validateUrl = (url) => {
    if (!url) return true;

    const blockedDomains = [
      // Social media platforms
      'facebook.com', 'fb.com', 'fb.me', 'facebook.me',
      'instagram.com', 'instagr.am', 'instagram',
      'tiktok.com', 'tiktok', 'vm.tiktok.com',
      'vimeo.com', 'dailymotion.com', 'dai.ly',

      // File hosting services
      'mega.nz', 'mega.io', 'mega.co.nz',
      'mediafire.com', 'mfi.re',

      // Cloud storage domains
      'dropbox.com', 'dropboxusercontent.com', 'we.tl', 'wetransfer.com',
      '1fichier.com', 'anonfiles.com', 'zippyshare.com', 'uploadfiles.io',
      'file.io', 'pixeldrain.com', 'filedropper.com', 'sendspace.com',
      'files.fm', 'box.com', 'icloud.com', 'icloud-drive.com', 'pcloud.com',
      'mediafireusercontent.com', 'openload.co', 'oload.tv', 'streamango.com', 'rapidgator.net',
      'nitroflare.com', 'turbobit.net', 'katfile.com', 'uploadhaven.com',
      'filefactory.com', 'letitbit.net', '4shared.com', 'depositfiles.com',
      'sendit.cloud', 'solidfiles.com', 'ge.tt', 'yandex.disk', 'disk.yandex.com',
      'mail.ru', 'cloud.mail.ru', 'terabox.com', 'teraboxapp.com', 'mirrobox.com',

      // Other
      'twitter.com', 'x.com', 't.co', 'threads.net',
      'snapchat.com', 'snap.com', 'pinterest.com', 'linkedin.com',
      'reddit.com', 'redd.it', 'tumblr.com', 'discord.com', 'discord.gg',
      'wechat.com', 'line.me', 'quora.com',
      'twitch.tv', 'liveleak.com', 'metacafe.com', 'bit.tube', 'peer.tube',
      'rumble.com', 'odysee.com', 'bitchute.com', 'dtube.video', 'bandcamp.com',

      // Optional
      'bit.ly', 'goo.gl', 'tinyurl.com', 'is.gd', 'shorte.st',
      'adf.ly', 't.ly', 'cutt.ly', 'rebrand.ly',

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

  // handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    // Clear specific error when user starts modifying the field
    if (name === 'media') {
      setMediaError('');
    }
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate media URLs before submission
    const isMediaValid = validateUrl(form.media);
    if (!isMediaValid) {
      setMediaError('Facebook, Instagram, TikTok, Mega, and Mediafire links are not allowed');
      return; // Prevent form submission
    }

    setMessage('');
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL_ADS}/createAd`,
        form,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }
        }
      );

      setMessage("✅ " + response.data.msg);
      setForm({
        title: '',
        content: '',
        media: '',
        link: '',
        phoneNumber: '',
        endDate: '',
      });
    } catch (err) {
      setError(err.response?.data?.msg || "❌ Failed to create ad");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="bg-white p-4 rounded shadow text-black">
        <h2 className="text-center text-black mb-4 fw-bold">📢 Create New Ad</h2>

        {message && <div className="alert alert-success text-center">{message}</div>}
        {error && <div className="alert alert-danger text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="row g-4">

          {/* 
          <div className="col-md-6">
            <label className="form-label">📝 Title</label>
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
          */}

          <div className="col-md-6">
            <label className="form-label">📅 End Date</label>
            <input
              type="date"
              name="endDate"
              className="form-control border border-black"
              value={form.endDate}
              onChange={handleChange}
            />
          </div>

          {/* 
          <div className="col-12">
            <label className="form-label">🖊️ Content</label>
            <textarea
              name="content"
              className="form-control border border-black"
              rows="4"
              value={form.content}
              onChange={handleChange}
              required
              placeholder="Enter ad description..."
            ></textarea>
          </div>
          */}

          <div className="col-md-6">
            <label className="form-label">🖼️ Media URL</label>
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
            <label className="form-label">📞 Contact Number</label>
            <input
              type="tel"
              name="phoneNumber"
              className="form-control border border-black"
              value={form.phoneNumber}
              onChange={handleChange}
              placeholder="Ex: +14155552671"
              pattern="^\+?[1-9]\d{6,14}$"
              title="Enter a valid international phone number (e.g., +14155552671)"
            />
          </div>

          {/* 
          <div className="col-md-6">
            <label className="form-label">🔗 Ad Link</label>
            <input
              type="text"
              name="link"
              className="form-control border border-black"
              value={form.link}
              onChange={handleChange}
              required
              placeholder="https://your-ad-link.com"
            />
          </div>
          */}

          <div className="col-12 text-center">
            <button
              type="submit"
              className="btn btn-primary mt-3 px-5 py-2 fs-5"
              disabled={loading || mediaError}
            >
              {loading ? "🚀 Submitting..." : "🚀 Submit Ad"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateAds;
