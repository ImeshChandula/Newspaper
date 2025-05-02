const Ads = require("../models/Ads");

//@desc     create new ad
const createAd = async (req, res) => {
    try {
        const { title, content, media, link } = req.body;

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
        });

        await ad.save();

        res.status(201).json({ msg: 'Ad created successfully', ad });
    } catch (error) {
        res.status(500).json({ status: "error", msg: error.message });
    }
};


module.exports = {
    createAd,
};