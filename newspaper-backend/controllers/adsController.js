const Ads = require("../models/Ads");

//@desc     Create new ad
const createAd = async (req, res) => {
    try {
        const { title, content, media, link, endDate } = req.body;

        if( !title || !content || !media || !link ){
            return res.status(400).json({ msg: 'Fill required fields' })
        }

        const ad = new Ads({
            title,
            content,
            media,
            link,
            author: req.user.id,
            active: true,
            endDate: endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        });

        await ad.save();

        res.status(201).json({ msg: 'Ad created successfully', ad });
    } catch (error) {
        res.status(500).json({ status: "error", msg: error.message });
    }
};


//@desc     Get all ads
const getAllAds = async (req, res) => {
    try {
        const { active } = req.query;
        const query = {};
        if( active !== undefined ) {
            query.active = active === "true";
        }

        const ads = await Ads.find(query).sort({ createdAt: -1});

        res.status(200).json({msg: 'Fetching ads...', ads });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};


//@desc     Get all active ads for frontend display
const getAllActiveAds = async (req, res) => {
    try {
        // build query for active ads that haven't expired
        const query = {
            active: true,
            $or: [
                { endDate: {$exists: false}},
                { endDate: null },
                { endDate: {$gt: new Date()}},
            ]
        };

        const ads = await Ads.find(query).sort({ createdAt: -1 });

        res.status(200).json({msg: 'Active ads that have not expired:', ads});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
};


//@desc     Update an ad
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
            author: req.user.id,
            active: req.body.active !== undefined ? req.body.active : ad.active,
            endDate: req.body.endDate || ad.endDate,
        };

        // update in database
        const updatedAd = await Ads.findByIdAndUpdate(req.params.id, updateData, {new: true, runValidators: true});

        res.status(200).json({ msg: 'Ad updated Successfully', updatedAd });
    } catch {}
};

module.exports = {
    createAd,
    getAllAds,
    getAllActiveAds,
    updateAd,
};