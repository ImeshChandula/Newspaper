import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../components/css/NewsModeration.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Globe, LandPlot, Zap } from 'lucide-react';

const RejectNewsModeration = () => {

  const navigate = useNavigate();

  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  // State for modal and toasts
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  // Image preview modal state
  const [showImageModal, setShowImageModal] = useState(false);
  //const [previewImage, setPreviewImage] = useState("");

  // Content preview modal state
  const [showContentModal, setShowContentModal] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const [breakingNewsToggleLoading, setBreakingNewsToggleLoading] = useState(null);
  const [foreignNewsToggleLoading, setForeignNewsToggleLoading] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    breakingNews: false,
    foreignNews: false,
    localNews: false,
    categories: []
  });

  // Available categories
  const availableCategories = ['Sports', 'Education', 'Politics', 'Local', 'Other', 'Article'];

  // Handle filter changes
  const handleFilterChange = (type, value) => {
    if (type === 'category') {
      setFilters(prev => {
        const updatedCategories = prev.categories.includes(value)
          ? prev.categories.filter(cat => cat !== value)
          : [...prev.categories, value];

        return { ...prev, categories: updatedCategories };
      });
    } else {
      setFilters(prev => ({ ...prev, [type]: value }));
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      breakingNews: false,
      foreignNews: false,
      localNews: false,
      categories: []
    });
  };

  const fetchNews = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const queryParams = new URLSearchParams();
      if (filters.breakingNews) queryParams.append('breakingNews', 'true');
      if (filters.foreignNews) queryParams.append('foreignNews', 'true');
      if (filters.localNews) queryParams.append('foreignNews', 'false');
      filters.categories.forEach(cat => queryParams.append('category', cat));

      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL_NEWS}/reject?${queryParams.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNews(res.data);
    } catch (error) {
      console.error('Error fetching Reject news:', error);
      showNotification("Failed to load rejected news articles", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    console.log("Rejected news loaded:", news);
  }, [news]);

  const updateStatus = async (id, status) => {
    try {
      setActionLoading(id);
      const token = localStorage.getItem("token");
      await axios.patch(`${process.env.REACT_APP_API_BASE_URL_NEWS}/updateStatus/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setNews(news.filter(article => article._id !== id));
      showNotification(`Article successfully ${status === 'accept' ? 'accepted' : status}ed`, "success");
    } catch (error) {
      console.error(`Failed to ${status} article:`, error);
      showNotification(`Failed to ${status} article`, "danger");
    } finally {
      setActionLoading(null);
    }
  };

  const toggleBreakingNews = async (id, currentStatus) => {
    setBreakingNewsToggleLoading(id);
    try {
      const token = localStorage.getItem('token');
      // eslint-disable-next-line no-unused-vars
      const response = await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL_NEWS}/toggleBreakingNews/${id}`,
        { breakingNews: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the news state with the updated article
      setNews((prev) =>
        prev.map((article) =>
          article._id === id ? { ...article, breakingNews: !currentStatus } : article
        )
      );

      showNotification(
        `Article ${!currentStatus ? 'marked as breaking news' : 'unmarked as breaking news'}`,
        'success'
      );
    } catch (error) {
      console.error('Failed to toggle breaking news status:', error);
      showNotification('Failed to update breaking news status', 'danger');
    } finally {
      setBreakingNewsToggleLoading(null);
    }
  };

  const toggleForeignNews = async (id, currentStatus) => {
    setForeignNewsToggleLoading(id);
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL_NEWS}/toggleForeignNews/${id}`,
        { foreignNews: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNews((prev) =>
        prev.map((article) =>
          article._id === id ? { ...article, foreignNews: !currentStatus } : article
        )
      );

      showNotification(
        `Article ${!currentStatus ? 'marked as foreign news' : 'unmarked as foreign news'}`,
        'success'
      );
    } catch (error) {
      console.error('Failed to toggle foreign news status:', error);
      showNotification('Failed to update foreign news status', 'danger');
    } finally {
      setForeignNewsToggleLoading(null);
    }
  };

  const handleEditNews = (articleId) => {
    localStorage.setItem("editNewsId", articleId);
    navigate('/editNews', { state: { articleId } });
  };

  // Show confirmation modal instead of browser alert
  const confirmDelete = (id) => {
    setArticleToDelete(id);
    setShowDeleteModal(true);
  };

  // Calculate time remaining for breaking news
  const getBreakingNewsTimeRemaining = (date) => {
    const articleDate = new Date(date);
    const expiryDate = new Date(articleDate.getTime() + 24 * 60 * 60 * 1000);
    const now = new Date();

    if (now > expiryDate) return 'Expired';

    const timeRemaining = expiryDate - now;
    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m remaining`;
  };

  const handleDeletePermanent = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this article? This action cannot be undone.")) {
      try {
        setDeleteLoading(articleToDelete);
        const token = localStorage.getItem("token");
        await axios.delete(`${process.env.REACT_APP_API_BASE_URL_NEWS}/deleteNewsArticleByID/${articleToDelete}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // Remove the deleted article from the state
        setNews(news.filter(article => article._id !== articleToDelete));
        showNotification("Article permanently deleted", "success");
        console.log("Article permanently deleted");
      } catch (error) {
        console.error("Failed to delete article permanently:", error);
        showNotification("Failed to delete article. Please try again.", "danger");
      } finally {
        setDeleteLoading(null);
        setShowDeleteModal(false);
        setArticleToDelete(null);
      }
    }
  };


  // Helper function to show toast notifications
  const showNotification = (message, variant) => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  };

  const [previewType, setPreviewType] = useState('image'); // 'image' or 'video'
  const [previewUrl, setPreviewUrl] = useState('');

  // Function to extract YouTube video ID from URL
  const getYouTubeId = (url) => {
    if (!url) return null;

    // Match patterns like youtube.com/watch?v=VIDEO_ID or youtu.be/VIDEO_ID
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Function to check if URL is a YouTube URL
  const isYouTubeUrl = (url) => {
    if (!url) return false;
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  // Function to get YouTube thumbnail URL from video ID
  const getYouTubeThumbnailUrl = (videoId) => {
    // Use the high quality thumbnail (hqdefault)
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

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

    // Check for YouTube
    if (isYouTubeUrl(url)) {
      return 'youtube';
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

    // More specific Facebook detection
    if (urlLower.includes('facebook.com') || urlLower.includes('fb.watch')) {
      if (url.includes('facebook.com/photo') || url.includes('fb.com/photo')) {
        return 'facebook-image';
      } else if (url.includes('facebook.com/watch') || url.includes('fb.watch')) {
        return 'facebook-video';
      } else {
        return 'facebook';
      }
    }

    // Other media types remain the same
    if (urlLower.includes('vimeo.com')) {
      return 'vimeo';
    }

    if (urlLower.includes('dailymotion.com') || urlLower.includes('dai.ly')) {
      return 'dailymotion';
    }

    if (urlLower.includes('instagram.com')) {
      return 'instagram';
    }

    if (urlLower.includes('twitter.com') || urlLower.includes('x.com')) {
      return 'twitter';
    }

    if (urlLower.includes('tiktok.com')) {
      return 'tiktok';
    }

    // Unknown media type
    return 'unknown';
  };

  // Function to get embedded content for Facebook
  const getFacebookEmbedHtml = (url) => {
    return `<iframe 
    src="https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(url)}&show_text=true" 
    width="100%" 
    height="300" 
    style="border:none;overflow:hidden" 
    scrolling="no" 
    frameborder="0" 
    allowfullscreen="true" 
    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share">
  </iframe>`;
  };

  // Function to get embedded content for Google Drive
  const getGoogleDriveEmbedUrl = (url) => {
    const fileId = getDriveFileId(url);
    if (fileId) {
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    return null;
  };

  const handleMediaClick = (mediaUrl) => {
    const mediaType = detectMediaType(mediaUrl);

    switch (mediaType) {
      case 'youtube':
        setPreviewType('video');
        const videoId = getYouTubeId(mediaUrl);
        if (videoId) {
          setPreviewUrl(`https://www.youtube.com/embed/${videoId}`);
          setShowImageModal(true);
        }
        break;

      case 'google-drive':
        setPreviewType('iframe');
        const fileId = getDriveFileId(mediaUrl);
        if (fileId) {
          // For Google Drive files, we need to use the preview URL
          setPreviewUrl(`https://drive.google.com/file/d/${fileId}/preview`);
          setShowImageModal(true);
        }
        break;

      case 'vimeo':
        setPreviewType('video');
        // Extract Vimeo ID
        const vimeoId = mediaUrl.match(/vimeo\.com\/(\d+)/);
        if (vimeoId && vimeoId[1]) {
          setPreviewUrl(`https://player.vimeo.com/video/${vimeoId[1]}`);
          setShowImageModal(true);
        }
        break;

      case 'dailymotion':
        setPreviewType('video');
        // Extract Dailymotion ID
        let dailymotionId = null;
        if (mediaUrl.includes('dailymotion.com/video/')) {
          dailymotionId = mediaUrl.split('/video/')[1].split('_')[0];
        } else if (mediaUrl.includes('dai.ly/')) {
          dailymotionId = mediaUrl.split('dai.ly/')[1];
        }

        if (dailymotionId) {
          setPreviewUrl(`https://www.dailymotion.com/embed/video/${dailymotionId}`);
          setShowImageModal(true);
        }
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

  const handleContentClick = (title, content) => {
    setPreviewTitle(title);
    setPreviewContent(content);
    setShowContentModal(true);
  };

  // Get a generic placeholder image for URLs that don't have a good thumbnail
  const getGenericThumbnail = (mediaType) => {
    // Return different placeholder icons based on the media type
    switch (mediaType) {
      case 'google-drive':
        return 'https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png';
      case 'vimeo':
        return 'https://i.vimeocdn.com/favicon/main-touch_180';
      case 'dailymotion':
        return 'https://static1.dmcdn.net/images/dailymotion-logo-ogtag.png.v2833aa4c8597b6734';
      case 'facebook':
        return 'https://static.xx.fbcdn.net/rsrc.php/yD/r/d4ZIVX-5C-b.ico';
      case 'instagram':
        return 'https://static.cdninstagram.com/rsrc.php/v3/yI/r/VsNE-OHk_8a.png';
      case 'twitter':
      case 'x':
        return 'https://abs.twimg.com/responsive-web/client-web/icon-ios.b1fc727a.png';
      case 'tiktok':
        return 'https://sf16-sg.tiktokcdn.com/obj/eden-sg/uvkuhvgvs9/static/tiktok_webapp_login/intro.png';
      case 'direct-video':
        return 'https://cdn-icons-png.flaticon.com/512/3607/3607404.png';
      default:
        return 'https://cdn-icons-png.flaticon.com/512/3137/3137065.png';
    }
  };

  // Function to extract the best thumbnail for a URL
  const getBestThumbnailUrl = (mediaUrl) => {
    const mediaType = detectMediaType(mediaUrl);

    switch (mediaType) {
      case 'youtube':
        const videoId = getYouTubeId(mediaUrl);
        if (videoId) {
          return getYouTubeThumbnailUrl(videoId);
        }
        break;

      case 'vimeo':
        // Vimeo doesn't have a simple thumbnail API like YouTube
        // We'll use a generic thumbnail for now
        return getGenericThumbnail('vimeo');

      case 'google-drive':
        // Google Drive uses an API that requires auth, so we'll use a generic icon
        return getGenericThumbnail('google-drive');

      case 'direct-video':
        // For direct videos, show a video icon
        return getGenericThumbnail('direct-video');

      case 'image':
        // For images, use the image itself
        return mediaUrl;

      default:
        // For unknown types, use a generic link icon
        return getGenericThumbnail(mediaType);
    }
  };

  // Get a human-readable label for the media type
  const getMediaTypeLabel = (mediaType) => {
    switch (mediaType) {
      case 'youtube': return 'YouTube Video';
      case 'google-drive': return 'Google Drive File';
      case 'google-drive-image': return 'Google Drive Image';
      case 'google-drive-video': return 'Google Drive Video';
      case 'vimeo': return 'Vimeo Video';
      case 'dailymotion': return 'Dailymotion Video';
      case 'facebook': return 'Facebook Content';
      case 'facebook-image': return 'Facebook Image';
      case 'facebook-video': return 'Facebook Video';
      case 'instagram': return 'Instagram Content';
      case 'twitter': return 'Twitter/X Post';
      case 'tiktok': return 'TikTok Video';
      case 'direct-video': return 'Video File';
      case 'image': return 'Image';
      default: return 'External Media';
    }
  };

  // Get the appropriate icon for the media type
  const getMediaTypeIcon = (mediaType) => {
    switch (mediaType) {
      case 'youtube': return 'bi-youtube';
      case 'google-drive':
      case 'google-drive-image':
      case 'google-drive-video':
        return 'bi-google';
      case 'vimeo': return 'bi-vimeo';
      case 'dailymotion': return 'bi-camera-video';
      case 'facebook':
      case 'facebook-image':
      case 'facebook-video':
        return 'bi-facebook';
      case 'instagram': return 'bi-instagram';
      case 'twitter': return 'bi-twitter';
      case 'tiktok': return 'bi-tiktok';
      case 'direct-video': return 'bi-file-earmark-play';
      case 'image': return 'bi-image';
      default: return 'bi-link-45deg';
    }
  };

  // Get the background color for the media type badge
  const getMediaBadgeColor = (mediaType) => {
    switch (mediaType) {
      case 'youtube': return 'rgba(255,0,0,0.8)';
      case 'google-drive':
      case 'google-drive-image':
      case 'google-drive-video':
        return 'rgba(0,112,237,0.8)';
      case 'vimeo': return 'rgba(26,183,234,0.8)';
      case 'dailymotion': return 'rgba(0,170,255,0.8)';
      case 'facebook':
      case 'facebook-image':
      case 'facebook-video':
        return 'rgba(24,119,242,0.8)';
      case 'instagram': return 'rgba(225,48,108,0.8)';
      case 'twitter': return 'rgba(29,161,242,0.8)';
      case 'tiktok': return 'rgba(0,0,0,0.8)';
      case 'direct-video': return 'rgba(92,45,145,0.8)';
      case 'image': return 'rgba(45,156,219,0.8)';
      default: return 'rgba(108,117,125,0.8)';
    }
  };

  // Render media with proper thumbnail for various types
  const renderMediaThumbnail = (mediaUrl) => {
    if (!mediaUrl) return null;

    const mediaType = detectMediaType(mediaUrl);
    const thumbnailUrl = getBestThumbnailUrl(mediaUrl);
    const mediaLabel = getMediaTypeLabel(mediaType);
    const mediaIcon = getMediaTypeIcon(mediaType);
    const badgeColor = getMediaBadgeColor(mediaType);

    // Handle specific media types directly
    switch (mediaType) {
      case 'facebook-image':
      case 'facebook-video':
        return (
          <div className="news-media-container position-relative">
            <div dangerouslySetInnerHTML={{
              __html: getFacebookEmbedHtml(mediaUrl)
            }} />
            <div
              className="position-absolute top-0 end-0 m-2"
              style={{ backgroundColor: badgeColor, borderRadius: '4px', padding: '2px 8px', color: 'white' }}
            >
              <i className={`${mediaIcon} me-1`}></i>
              {mediaLabel}
            </div>
          </div>
        );

      case 'google-drive-image':
        return (
          <div className="news-media-container position-relative">
            <img
              src={mediaUrl}
              alt="Google Drive"
              className="news-media"
              style={{
                cursor: 'pointer',
                objectFit: 'contain',
                height: '300px',
                width: '100%'
              }}
              onClick={() => handleMediaClick(mediaUrl)}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = getGenericThumbnail('google-drive');
              }}
            />
            <div
              className="position-absolute top-0 end-0 m-2"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '4px', padding: '2px 8px' }}
            >
              <i className="bi bi-zoom-in text-white"></i>
            </div>
            <div
              className="position-absolute bottom-0 start-50 translate-middle-x mb-2 px-3 py-1"
              style={{ backgroundColor: badgeColor, borderRadius: '4px', color: 'white' }}
            >
              <i className={`${mediaIcon} me-1`}></i>
              {mediaLabel}
            </div>
          </div>
        );

      case 'google-drive-video':
      case 'google-drive':
        const embedUrl = getGoogleDriveEmbedUrl(mediaUrl);
        if (embedUrl) {
          return (
            <div className="news-media-container position-relative">
              <div className="ratio ratio-16x9">
                <iframe
                  src={embedUrl}
                  title="Google Drive content"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div
                className="position-absolute bottom-0 start-50 translate-middle-x mb-2 px-3 py-1"
                style={{ backgroundColor: badgeColor, borderRadius: '4px', color: 'white' }}
              >
                <i className={`${mediaIcon} me-1`}></i>
                {mediaLabel}
              </div>
            </div>
          );
        }
      // If we can't embed, fall through to default

      default:
        // Default behavior for other media types (unchanged)
        return (
          <div className="news-media-container position-relative">
            <img
              src={thumbnailUrl}
              alt={`${mediaLabel} thumbnail`}
              className="news-media"
              style={{
                cursor: 'pointer',
                objectFit: 'cover',
                height: '200px',
                width: '100%',
                backgroundColor: mediaType !== 'image' ? '#f8f9fa' : 'transparent'
              }}
              onClick={() => handleMediaClick(mediaUrl)}
              onError={(e) => {
                // If image fails to load, use a generic icon
                e.target.onerror = null;
                e.target.src = getGenericThumbnail(mediaType);
              }}
            />
            <div
              className="position-absolute top-0 end-0 m-2"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '4px', padding: '2px 8px' }}
            >
              <i className="bi bi-zoom-in text-white"></i>
            </div>
            {mediaType !== 'image' && (
              <div
                className="position-absolute bottom-0 start-50 translate-middle-x mb-2 px-3 py-1"
                style={{ backgroundColor: badgeColor, borderRadius: '4px', color: 'white' }}
              >
                <i className={`${mediaIcon} me-1`}></i>
                {mediaLabel}
              </div>
            )}
          </div>
        );
    }
  };




  return (
    <div className="news-container">
      <h2 className="news-head text-black">Rejected News Moderation</h2>

      <div className="container my-4">
        <h5 className="mb-3">Filter News</h5>
        <div className="row g-3">

          <div className="col-12">
            <div className="d-flex gap-3 flex-wrap">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="breakingNewsToggle"
                  checked={filters.breakingNews}
                  onChange={() => handleFilterChange('breakingNews', !filters.breakingNews)}
                />
                <label className="form-check-label" htmlFor="breakingNewsToggle">
                  <Zap size={15} /> Breaking News
                </label>
              </div>

              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="foreignNewsToggle"
                  checked={filters.foreignNews}
                  onChange={() => handleFilterChange('foreignNews', !filters.foreignNews)}
                />
                <label className="form-check-label" htmlFor="foreignNewsToggle">
                  <Globe size={15} /> Foreign News
                </label>
              </div>

              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="localNewsToggle"
                  checked={filters.localNews}
                  onChange={() => handleFilterChange('localNews', !filters.localNews)}
                />
                <label className="form-check-label" htmlFor="localNewsToggle">
                  <LandPlot size={15} /> Local News
                </label>
              </div>
            </div>
          </div>



          <div className="col-12">
            <h6>Categories:</h6>
            <div className="d-flex gap-3 flex-wrap">
              {availableCategories.map(category => (
                <div className="form-check" key={category}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`category-${category.toLowerCase()}`}
                    checked={filters.categories.includes(category)}
                    onChange={() => handleFilterChange('category', category)}
                  />
                  <label className="form-check-label" htmlFor={`category-${category.toLowerCase()}`}>
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="col-12">
            <button
              className="btn btn-outline-secondary"
              onClick={resetFilters}
            >
              <i className="bi bi-x-circle me-1"></i> Reset Filters
            </button>
          </div>


        </div>
      </div>

      {/* Toast notifications */}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1060 }}>
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          bg={toastVariant}
        >
          <Toast.Header>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body className={toastVariant === "danger" ? "text-white" : ""}>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Delete confirmation modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to permanently delete this article? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeletePermanent}
            disabled={deleteLoading === articleToDelete}
          >
            {deleteLoading === articleToDelete ? 'Deleting...' : 'Delete Permanently'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Media Preview Modal */}
      <Modal show={showImageModal} onHide={() => setShowImageModal(false)} centered size="lg">
        <Modal.Header closeButton className='bg-white text-black'>
          <Modal.Title>{previewType === 'video' ? 'Video Preview' : 'Image Preview'}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center bg-white">
          {previewType === 'video' ? (
            <div className="ratio ratio-16x9">
              <iframe
                src={previewUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <img
              src={previewUrl}
              alt='Preview of the uploaded file'
              className="img-fluid"
              style={{ maxHeight: '70vh' }}
            />
          )}
        </Modal.Body>
      </Modal>

      {/* Content Preview Modal */}
      <Modal show={showContentModal} onHide={() => setShowContentModal(false)} centered size="lg">
        <Modal.Header closeButton className='bg-white text-black'>
          <Modal.Title>{previewTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-white text-black">
          <div className="content-preview">
            {previewContent.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </Modal.Body>
      </Modal>

      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-black" role="status">
            <span className="visually-hidden tect-black">Loading...</span>
          </div>
        </div>
      ) : news.length === 0 ? (
        <div className="alert alert-info mt-3" role="alert">
          No rejected articles to review.
        </div>
      ) : (
        <div className="news-card-container">
          {news.map((article) => (
            <div key={article._id} className={`news-card bg-white border ${article.breakingNews ? 'border-danger' : 'border-secondary'}`}>
              <div className="news-metadata bg-white border-bottom border-secondary d-flex justify-content-between align-items-center">
                <span className="news-category">{article.category}</span>
                <span className="news-date text-muted">
                  {new Date(article.date).toLocaleString()}
                </span>
              </div>

              {article.breakingNews && (
                <div className="breaking-news-badge bg-danger text-white px-2 py-1 d-flex justify-content-between align-items-center">
                  <span><i className="bi bi-lightning-fill me-1"></i> BREAKING NEWS</span>
                  <small>{getBreakingNewsTimeRemaining(article.date)}</small>
                </div>
              )}

              <h3 className="news-title text-black">{article.title}</h3>

              {/* Media content */}
              {article.media && renderMediaThumbnail(article.media)}

              <p className="news-content text-black">{article.content.slice(0, 120)}...</p>
              <div className="d-flex justify-content-end mb-2">
                <button
                  onClick={() => handleContentClick(article.title, article.content)}
                  className="btn btn-sm btn-outline-info"
                >
                  <i className="bi bi-eye"></i> View Full Content
                </button>
              </div>

              <p className="news-author text-muted">By: {article.author?.username} ({article.author?.email})</p>

              <div className="news-buttons">
                <button
                  onClick={() => handleEditNews(article._id)}
                  className="btn btn-outline-primary news-edit-button"
                >
                  <i className="bi bi-pencil-square"></i> Edit content
                </button>

                <button
                  onClick={() => toggleForeignNews(article._id, article.foreignNews)}
                  className={`btn ${article.foreignNews ? 'btn-info' : 'btn-outline-info'} news-foreign-button`}
                  disabled={foreignNewsToggleLoading === article._id}
                >
                  {foreignNewsToggleLoading === article._id ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Processing
                    </>
                  ) : (
                    <>
                      <i className={`bi ${article.foreignNews ? 'bi-globe' : 'bi-globe2'}`}></i>
                      {article.foreignNews ? 'Unmark Foreign' : 'Mark Foreign'}
                    </>
                  )}
                </button>

                <button
                  onClick={() => toggleBreakingNews(article._id, article.breakingNews)}
                  className={`btn ${article.breakingNews ? 'btn-warning' : 'btn-outline-warning'} news-breaking-button`}
                  disabled={breakingNewsToggleLoading === article._id}
                >
                  {breakingNewsToggleLoading === article._id ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Processing
                    </>
                  ) : (
                    <>
                      <i className={`bi ${article.breakingNews ? 'bi-lightning-fill' : 'bi-lightning'}`}></i>
                      {article.breakingNews ? 'Unmark Breaking' : 'Mark Breaking'}
                    </>
                  )}
                </button>

                <button
                  onClick={() => updateStatus(article._id, 'accept')}
                  className="btn btn-success news-accept-button"
                  disabled={actionLoading === article._id}
                >
                  {actionLoading === article._id ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Accepting...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle"></i> Accept
                    </>
                  )}
                </button>
                <button
                  onClick={() => confirmDelete(article._id)}
                  className="btn btn-danger news-reject-button"
                >
                  <i className="bi bi-trash"></i> Delete permanent
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RejectNewsModeration