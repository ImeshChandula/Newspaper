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

module.exports = {
    createAd,
    getAllAds,
};