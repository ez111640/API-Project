const express = require('express');
const { Spot, Review, User, SpotImage, ReviewImage } = require('../../db/models')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { ValidationError } = require('sequelize');
const { requireAuth } = require('../../utils/auth.js');
const { restoreUser } = require('../../utils/auth');
const { max } = require('lodash');

const router = express.Router();

const validateReviews = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage("Review text is required"),
    check('stars')
        .exists({ checkFalsy: true })
        .isInt({ min: 1, max: 5 })
        .withMessage("Stars must be an integer from 1 to 5"),
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
            attributes: ['id', 'firstName', 'lastName'],
        }, {
            model: Spot,
            attributes: [
                'id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'
            ],
            include: [{
                model: SpotImage,
                attributes: ['id', 'url', 'preview'],
                as: 'previewImage'
            }]
        }, {
            model: ReviewImage,
            attributes: ['id', 'url']
        }]
    })

    if (!allReviews.length) {
        req.status(404)
        return res.json({
            message: "No reviews found"
        })
    }
    if (allReviews.length) {
        const reviewArr = allReviews.map(review => {
            const thisReview = review.toJSON();
            if (thisReview.Spot) {
                let foundPreview = false

                for (let image of thisReview.Spot.previewImage) {
                    if (image.preview = true) {
                        thisReview.Spot.previewImage = image.url
                        foundPreview = true
                    }
                }
                if (!foundPreview) {
                    thisReview.Spot.previewImage = "No preview available";
                }

                if(!thisReview.ReviewImages.length) {
                    thisReview.ReviewImages = "There are no images associated with this review"
                }
            }
            return thisReview;
        })
        return res.json({ Reviews: reviewArr })
    }
})

router.post('/:reviewId/images', requireAuth, async (req, res) => {
    const { url } = req.body
    const userId = parseInt(req.user.id)
    const id = parseInt(req.params.reviewId)
    const maxImages = 10;


    const review = await Review.findByPk(id);


    if (review === null) {
        res.status(404)
        res.json({
            message: "Review couldn't be found"
        })
    }

    if (review.userId !== userId) {
        res.status(403)
        res.json({
            message: "Forbidden"
        })
    }

    const reviewImageCount = await ReviewImage.count({
        where: {
            reviewId: review.id
        }
    })

    if (reviewImageCount >= maxImages) {
        res.status(403)
        const err = new Error("You have exceeded the maximum number of images")
        err.errors = {
            message: "Maximum number of images for this resource was reached"
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
        message: "Review couldn't be found"
    }
    return res.json(err.errors)

})

router.put('/:reviewId', requireAuth, validateReviews, async (req, res) => {
    const thisReview = await Review.findByPk(req.params.reviewId, {})


    if (thisReview && thisReview.toJSON().userId !== req.user.id) {
        res.status(403)
        return res.json({
            message: "Forbidden"
        })
    }
    if (!thisReview) {
        res.status(404)
        const err = new Error("Review not found")
        err.errors = {
            message: "Review couldn't be found"
        }
        return res.json(err.errors);
    }

    const { review, stars } = req.body

    if (!review && !stars) {
        res.status(400)
        res.json({
            message: "You have to edit the review or the number of stars"
        })
    }

    if (review) thisReview.review = review
    if (stars) thisReview.stars = stars

    await thisReview.save()
    await thisReview.validate()
    return res.json(thisReview)



})

router.delete('/:reviewId', requireAuth, async (req, res) => {
    const thisReview = await Review.findByPk(req.params.reviewId)
    if (thisReview && thisReview.userId !== req.user.id) {
        res.status(403)
        return res.json({ message: "Forbidden" })
    }

    if (thisReview) {
        await thisReview.destroy()
        return res.json({ message: 'Successfully deleted' })
    }
    if (thisReview === null) {
        const err = new Error("Review couldn't be found")
        res.status(404)
        err.errors = {
            message: "Review couldn't be found"
        }
        return res.json(err.errors)
    }
})

router.get('/', async (req, res) => {
    const allReviews = await Review.findAll({})

    return res.json({ Reviews: allReviews })
})




module.exports = router;
