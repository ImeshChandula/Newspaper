const Ads = require("../models/Ads");

//@desc     Create new ad
const createAd = async (req, res) => {
    try {
        const { title, content, media, link, endDate, phoneNumber } = req.body;

        if(!media){
            return res.status(400).json({ msg: 'Media is required' })
        }

        const ad = new Ads({
            title,
            content,
            media,
            link,
            phoneNumber,
            author: req.user.id,
            active: true,
            endDate: endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        });

        await ad.save();

        res.status(201).json({ status: "success", msg: 'Ad created successfully', ad });
    } catch (error) {
        res.status(500).json({ status: "error", msg: error.message });
    }
};


//@desc     Get all ads
const getAllAds = async (req, res) => {
    try {
        // Manually update all expired ads
        await Ads.updateExpiredAds();

        const { active } = req.query;
        const query = {};
        if( active !== undefined ) {
            query.active = active === "true";
        }

        const ads = await Ads.find(query).populate('author', 'username name email').sort({ createdAt: -1 });

        res.status(200).json({ status: "success", msg: 'Fetching ads...', ads });
    } catch (error) {
        res.status(500).json({ status: "fail", msg: error.message });
    }
};


//@desc     Get all active ads for frontend display
const getAllActiveAds = async (req, res) => {
    try {
        // Manually update all expired ads
        await Ads.updateExpiredAds();

        // build query for active ads that haven't expired
        const query = {
            active: true,
            $or: [
                { endDate: {$exists: false}}, // No endDate exists
                { endDate: null }, // endDate is null
                { endDate: {$gt: new Date()}}, // endDate is in the future
            ]
        };

        const ads = await Ads.find(query).sort({ createdAt: -1 });

        res.status(200).json({ status: "success", msg: 'Active ads that have not expired:', ads});
    } catch (error) {
        res.status(500).json({ status: "fail", msg: error.message });
    }
};


//@desc     Get single ad by adID
const getSingleAd = async (req, res) => {
    try {
        const ad = await Ads.findById(req.params.id);

        if (!ad) {
            return res.status(404).json({ msg: 'Ad not found' });
        }

        res.status(200).json({ status: "success", ad })
    } catch (error) {
        res.status(500).json({ status: "fail", msg: error.message });
    }
};


//@desc     Update an ad by AdID
const updateAd = async (req, res) => {
    try {
        // find ad if it exists
        const ad = Ads.findById(req.params.id);

        if (!ad) {
            return res.status(404).json({ msg: 'Ad not found' });
        }

        // update ad data
        const updateData = {
            title: req.body.title || ad.title,
            content: req.body.content || ad.content,
            media: req.body.media || ad.media,
            link: req.body.link || ad.link,
            phoneNumber: req.body.phoneNumber || ad.phoneNumber,
            author: req.user.id,
            active: req.body.active !== undefined ? req.body.active : ad.active,
            endDate: req.body.endDate || ad.endDate,
        };

        // update in database
        const updatedAd = await Ads.findByIdAndUpdate(req.params.id, updateData, {new: true, runValidators: true});

        res.status(200).json({ status: "success", msg: 'Ad updated Successfully', updatedAd });
    } catch (error) {
        res.status(500).json({ status: "fail", msg: error.message });
    }
};

//@desc     Delete an ad by AdID
const deleteAd = async (req, res) => {
    try {
        const ad = await Ads.findByIdAndDelete(req.params.id);
        
        if (!ad) {
            return res.status(404).json({ msg: 'Ad not found' });
        }

        res.status(200).json({ status: "success", message: 'Ad deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: "fail",msg: error.message });
    }
};

//@desc     Track ad impression
const trackAdImpression = async (req, res) => {
    try {
        const ad = await Ads.findById(req.params.id);

        if (!ad) {
            return res.status(404).json({ status: "fail", msg: "Ad not found"});
        }

        // Increment impressions
        ad.impressions += 1;
        await ad.save();

        res.status(200).json({ status: "success", data: {impressions: ad.impressions}});
    } catch (error) {
        res.status(500).json({ status: "fail", msg: error.message });
    }
};

//@desc     Track ad click
const trackAdClick = async (req, res) => {
    try {
        const ad = await Ads.findById(req.params.id);
        
        if (!ad) {
          return res.status(404).json({ status: "fail", message: "Ad not found" });
        }
        
        // Increment clicks
        ad.clicks += 1;
        await ad.save();
        
        res.status(200).json({ status: "success", data: {clicks: ad.clicks}});
      } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
      }
};

module.exports = {
    createAd,
    getAllAds,
    getAllActiveAds,
    getSingleAd,
    updateAd,
    deleteAd,
    trackAdImpression,
    trackAdClick,
};