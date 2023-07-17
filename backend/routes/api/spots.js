const express = require('express');
const { Spot, Review, User, SpotImage, ReviewImage, Booking } = require('../../db/models')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { ValidationError } = require('sequelize');
const { requireAuth } = require('../../utils/auth.js');
const { restoreUser } = require('../../utils/auth');
const { Op } = require('sequelize');

const router = express.Router();

const validateSpot = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage('Country is required'),
    check('lat')
        .exists({ checkFalsy: true })
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({ checkFalsy: true })
        .withMessage('Longitude is not valid'),
    check('name')
        .exists({ checkFalsy: true })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy: true })
        .withMessage('Price is required'),
    handleValidationErrors
]

const validateQueries = [
    check('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be greater than or equal to 1'),
    check('size')
        .optional()
        .isInt({ min: 1 })
        .withMessage("Size must be greater than or equal to 1"),
    check('maxLat')
        .optional()
        .isDecimal()
        .withMessage("Maximum latitude is invalid"),
    check('minLat')
        .optional()
        .isDecimal()
        .withMessage("Minimum latitude is invalid"),
    check('maxLng')
        .optional()
        .isDecimal()
        .withMessage("Maximum longitude is invalid"),
    check('minLng')
        .optional()
        .isDecimal()
        .withMessage("Minimum longitude is invalid"),
    check('minPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Minimum price must be greater than or equal to 0"),
    check('maxPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Maximum price must be greater than or equal to 0"),
    handleValidationErrors
]

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

    const ownerId = parseInt(req.user.id)

    const spots = await Spot.findAll({
        where: { ownerId: ownerId },
        include: [{
            model: SpotImage,
            attributes: ['url'],
            as: 'previewImage',

        }]
    })

    //stay away from forEach

    const retArr = spots.map(spot => {
        const thisSpot = spot.toJSON()
        // if (thisSpot.previewImage) {
        //     thisSpot.previewImage = thisSpot.previewImage[0].url
        // }
        const revCount = Review.count();
        const revSum = Review.sum('stars');
        thisSpot.avgRating = revCount / revSum
        return thisSpot
    })


    res.json({ Spots: retArr })
})


router.get('/:spotId/reviews', async (req, res) => {
    const thisId = parseInt(req.params.spotId)
    const allReviews = await Review.findAll({
        where: {
            spotId: thisId,
        },
        include: [
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            },
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            }]


    })
    if (!allReviews.length) {
        res.status(404)
        res.json({
            message: "Spot couldn't be found"
        })
    }

    return res.json({ Reviews: allReviews });
})

router.get('/:spotId/bookings', requireAuth, async (req, res) => {
    const thisId = parseInt(req.params.spotId)


    const spot = await Spot.findByPk(thisId)

    if (!spot) {
        res.status(404)
        return res.json({
            message: "Spot couldn't be found"
        })
    }

    const nonOwnerBookings = await Booking.findAll({
        where: {
            spotId: thisId,
        },
        attributes: ['spotId', 'startDate', 'endDate'],
    })
    const ownerBookings = await Booking.findAll({
        where: {
            spotId: thisId
        },
        include: {
            model: User,
            attributes: ['id', 'firstName', 'lastName']
        }
    })

    if (spot.ownerId !== req.user.id) return res.json({ Bookings: nonOwnerBookings })
    return res.json({ Bookings: ownerBookings })
})

router.post('/:spotId/reviews', requireAuth, validateReviews, async (req, res, next) => {
    const { review, stars } = req.body;
    const ownerId = parseInt(req.user.id)
    const id = parseInt(req.params.spotId)

    const spot = await Spot.findByPk(id);

    if (!spot) {
        res.status(404)
        return res.json({
            message: "Spot couldn't be found"
        })
    }

    const allReviews = await Review.findAll({
        where: {
            spotId: id,
            userId: req.user.id
        }
    })
    if (allReviews.length) {
        res.status(500)
        return res.json({
            message: "User already has a review for this spot"
        })
    }
    if (spot) {
        const newReview = await Review.build({
            "review": review,
            "stars": stars,
            "spotId": req.params.spotId,
            "userId": req.user.id
        })
        await newReview.save();

        res.status(201)
        return res.json(newReview);
    }
})


router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    const { url, preview } = req.body;


    const id = parseInt(req.params.spotId)

    const spot = await Spot.findByPk(id)
    if (!spot) {
        res.status(404)
        return res.json({
            "message": "Spot couldn't be found"
        })
    }
    const ownerId = parseInt(req.user.id)
    if (spot.ownerId !== ownerId) {
        res.status(403)
        return res.json({
            message: "Forbidden"
        })
    }

    if (spot) {
        const newImage = await SpotImage.build({
            url: url,
            preview: preview,
            spotId: id
        })

        await newImage.validate();
        await newImage.save();

        return res.json({
            "id": newImage.id,
            "url": newImage.url,
            "preview": newImage.preview
        });
    }
})



router.post('/:spotId/bookings', requireAuth, async (req, res, next) => {
    const { startDate, endDate } = req.body;
    const ownerId = parseInt(req.user.id)
    const id = parseInt(req.params.spotId)


    const spot = await Spot.findByPk(id)


    if (spot === null) {
        res.status(404)
        return res.json({
            message: "Spot couldn't be found"
        })
    }

    if (spot.toJSON().ownerId === ownerId) {
        res.status(403)
        return res.json({
            message: "Forbidden"
        })
    }


    const bookings = await Booking.findAll({
        where: {
            spotId: spot.id
        }
    })

    const bookingArr = bookings.map(booking => {
        const thisBooking = booking.toJSON()

        const bookedStart = new Date(thisBooking.startDate.toDateString())
        const start = new Date(startDate).getTime();
        const bookedEnd = new Date(thisBooking.endDate.toDateString())
        const end = new Date(endDate).getTime();

        console.log(bookedStart)
        console.log(start)
        console.log(bookedEnd)
        console.log(end)

        if (start >= bookedStart && start <= bookedEnd) {
            res.status(403)
            return res.json({
                message: "Sorry, this spot is already booked for the specified dates"

            })
        }
        if (end >= bookedStart && end <= bookedEnd) {
            res.status(403)
            return res.json({
                message: "Sorry, this spot is already booked for the specified dates"
            })
        }
        return thisBooking
    })


    if (spot) {
        const newBooking = await Booking.build({
            startDate: startDate,
            endDate: endDate
        })
        newBooking.spotId = parseInt(req.params.spotId)
        newBooking.userId = req.user.id


        await newBooking.validate();
        await newBooking.save();

        return res.json({ newBooking });
    }


})



router.delete('/:spotId', requireAuth, async (req, res) => {
    const thisSpot = await Spot.findByPk(req.params.spotId)

    if (!thisSpot) {
        res.status(404)
        res.json({ message: "Spot not found" })
    }

    if (thisSpot.ownerId !== req.user.id) {
        res.status(403)
        return res.json({ message: "Forbidden" });
    }


    if (thisSpot && thisSpot.ownerId === req.user.id) {
        await thisSpot.destroy();
        return res.json({ message: 'Successfully deleted' })
    }


})






router.get('/:spotId', async (req, res, next) => {
    const sumRating = await Review.sum('stars',
        {
            where: {
                spotId: req.params.spotId
            }
        })
    const numRatings = await Review.count({
        where: {
            spotId: req.params.spotId
        }
    })

    const avgRating = sumRating / numRatings;

    const thisSpot = await Spot.findByPk(req.params.spotId, {
        include: [{
            model: User,
            attributes: ['id', 'firstName', 'lastName']
        },
        {
            model: SpotImage,
            attributes: ['id', 'url', 'preview'],
            as: 'previewImage'
        }]
    })


    if (thisSpot === null) {
        const err = new Error("There was no spot with that Id")
        err.status = 404
        err.errors = {
            message: "Spot couldn't be found"
        }
        return next(err)
    }

    const spot = thisSpot.toJSON()


    spot.numReviews = numRatings
    spot.avgStarRating = avgRating


    res.json({
        spot
    })
})

router.put('/:spotId', requireAuth, validateSpot, async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId)

    if (!spot) {
        res.status(404)
        const err = new Error("Spot not found")
        err.errors = {
            message: "That spot wasn't found"
        }
        return res.json(err.errors);
    }

    if (spot.ownerId !== req.user.id) {
        res.status(403)
        return res.json({
            message: "Forbidden"
        })
    }


    const { ownerId, address, city, state, country, name, description, price, lat, lng } = req.body
    if (address) spot.address = address
    if (ownerId) spot.ownerId = ownerId
    if (city) spot.city = city
    if (state) spot.state = state
    if (country) spot.country = country
    if (name) spot.name = name
    if (description) spot.description = description
    if (price) spot.price = price
    if (lat) spot.lat = lat
    if (lng) spot.lng = lng

    await spot.save();

    res.json(spot)
})

router.post('/', requireAuth, validateSpot, async (req, res, next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body


    const newSpot = await Spot.create({
        address,
        city,
        state,
        country,
        lat: Number(lat),
        lng: Number(lng),
        name,
        description,
        price: Number(price),
        ownerId: req.user.id
    })
    res.status(201)
    return res.json({
        newSpot
    })
})

router.get('/', validateQueries, async (req, res) => {

    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

    page = parseInt(page);
    size = parseInt(size);

    if (Number.isNaN(page)) page = 1;
    if (Number.page < 1 || Number.page > 10) page = 1

    if (Number.isNaN(size)) size = 20;
    if (Number.size < 1 || Number.page > 20) size = 20;

    const where = {}

    if (minLat) {
        where.lat = { [Op.gte]: minLat }
    }
    if (maxLat) {
        where.lat = { [Op.lte]: maxLat }
    }
    if (minLng) {
        where.lng = { [Op.gte]: minLng }
    }
    if (maxLng) {
        where.lng = { [Op.lte]: maxLng }
    }
    if (minPrice) {
        where.price = { [Op.gte]: minPrice }
    }

    if (maxPrice) {
        where.price = { [Op.gte]: maxPrice }

    }

    const allSpots = await Spot.findAll({
        include: [{
            model: SpotImage,
            as: 'previewImage',
            where: { preview: true }
        },
        {
            model: Review,
            attributes: ['stars'],
            as: 'avgRating'
        }],
        limit: size,
        offset: size * (page - 1)
    })


    const spotsArr = allSpots.map(spot => {
        const thisSpot = spot.toJSON();

        if (thisSpot.previewImage) {
            thisSpot.previewImage = thisSpot.previewImage[0].url
        } else {
            thisSpot.previewImage = null;
        }
        let sum = 0;
        let count = 0;
        for (let review of thisSpot.avgRating) {
            count++
            sum += review.stars
        }
        thisSpot.avgRating = sum / count;
        return thisSpot
    })


    return res.json({ Spots: spotsArr, page, size })

})
module.exports = router;
