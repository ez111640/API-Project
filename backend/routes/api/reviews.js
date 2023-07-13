const express = require('express');
const { Spot, Review, User, SpotImage, ReviewImage } = require('../../db/models')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { ValidationError } = require('sequelize');
const { requireAuth } = require('../../utils/auth.js');
const { restoreUser } = require('../../utils/auth');
const { max } = require('lodash');

const router = express.Router();

const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review is required'),
    check('stars')
        .exists({ checkFalsy: true })
        .withMessage('Stars are required'),
    handleValidationErrors
]

router.get('/current', requireAuth, async (req, res) => {
    const id = parseInt(req.user.id)
    const allReviews = await Review.findAll({
        where: {
            userId: id
        },
        include: [{
            model: User,
            attributes: ['id','firstName','lastName'],
        },{
            model: Spot,
        },{
            model: ReviewImage,
        }]
    })

    return res.json(allReviews)
})

router.post('/:reviewId/images', requireAuth, async (req, res) => {
    const { url } = req.body
    const userId = parseInt(req.user.id)
    const id = parseInt(req.params.reviewId)
    const maxImages = 10;

    const review = await Review.findAll({
        where: {
            id: id,
            userId: userId
        }
    })
    const reviewImageCount = await ReviewImage.count()

    if (reviewImageCount.length >= maxImages) {
        res.status(403)
        const err = new Error("You have exceeded the maximum number of images")
        err.errors = {
            message: "There are already 10 images. You cannot add any more."
        }
        return res.json(err.errors);
    }


    if (review) {
        const newImage = await ReviewImage.build({
            url: url,
            reviewId: id
        })

        await newImage.validate();
        await newImage.save();

        return res.json({
            "id": newImage.id,
            "url": newImage.url
        }
        )
    }
    const err = new Error("Review couldn't be found")
    res.status(404)
    err.errors = {
        message: "That Review couldn't be found"
    }
    return res.json(err.errors)

})

router.put('/:reviewId', requireAuth, async (req, res) => {
    const thisReview = await Review.findByPk(req.params.reviewId, {
        where: {
            userId: req.user.id
        }
    })
    if (!thisReview) {
        res.status(404)
        const err = new Error("Spot not found")
        err.errors = {
            message: "That spot wasn't found"
        }
        return res.json(err.errors);
    }

    const { review, stars } = req.body

    if (review) thisReview.review = review
    if (stars) thisReview.stars = stars

    await thisReview.save()

    await thisReview.validate()
        return res.json(thisReview)



})

router.delete('/:reviewId', requireAuth, async (req, res) => {
    const thisReview = await Review.findByPk(req.params.reviewId)
    if (thisReview) {
        await thisReview.destroy()
        return res.json({ message: 'Successfully deleted' })
    }
    if (thisReview === null) {
        const err = new Error("Review couldn't be found")
        res.status(404)
        err.errors = {
            message: "That Review couldn't be found"
        }
        return res.json(err.errors)
    }
})





module.exports = router;
