const express = require('express');
const { Spot, Review, User, SpotImage, ReviewImage, Booking } = require('../../db/models')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { ValidationError } = require('sequelize');
const { requireAuth } = require('../../utils/auth.js');
const { restoreUser } = require('../../utils/auth');

const router = express.Router();

router.delete('/:imageId', requireAuth, async (req, res) => {
    const thisImage = await ReviewImage.findByPk(req.params.imageId)

    if (thisImage) {
        const thisReview = await Review.findByPk(thisImage.reviewId)
        if (thisReview.toJSON().userId !== req.user.id) {
            res.status(403)
            return res.json({
                message: "Forbidden"
            })
        }
    }

    if (thisImage) {
        await thisImage.destroy()
        return res.json({ message: 'Successfully deleted' })
    }
    const err = new Error("Image couldn't be found")
    res.status(404)
    err.errors = {
        message: "Review Image couldn't be found"
    }
    return res.json(err.errors)

})

router.get('/', async (req, res) => {
    const allReviewImages = await ReviewImage.findAll({})

    return res.json({ ReviewImages: allReviewImages })
})

module.exports = router;
