const express = require('express');
const { Spot, Review, User, SpotImage, ReviewImage, Booking } = require('../../db/models')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { ValidationError } = require('sequelize');
const { requireAuth } = require('../../utils/auth.js');
const { restoreUser } = require('../../utils/auth');

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

// router.post('/:spotId:reviews', async(req, res) => {

// })

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
        if (thisSpot.previewImage) {
            thisSpot.previewImage = thisSpot.previewImage[0].url
        }
        const revCount = Review.count();
        const revSum = Review.sum('stars');
        thisSpot.avgRating = revCount / revSum
        return thisSpot
    })


    res.json(retArr)
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
            message: "That spot wasn't found"
        })
    }

    return res.json(allReviews);
})

router.get('/:spotId/bookings', requireAuth, async (req, res) => {
    const thisId = parseInt(req.params.spotId)

    const spot = await Spot.findByPk(thisId)

    if (!spot) {
        res.status(404)
        return res.json({
            message: "Couldn't find spot"
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

    if (spot.ownerId !== req.user.id) return res.json(nonOwnerBookings)
    return res.json(ownerBookings)
})

router.post('/:spotId/reviews', requireAuth, async (req, res, next) => {
    const { review, stars } = req.body;
    const ownerId = parseInt(req.user.id)
    const id = parseInt(req.params.spotId)

    const spot = await Spot.findByPk(id);

    if (!spot) {
        res.status(404)
        return res.json({
            message: "Spot not found"
        })
    }

    const allReviews = await Review.findAll({
        where: {
            spotId: id,
            userId: req.user.id
        }
    })
    if (allReviews.length) {
        res.status(403)
        return res.json({
            message: "You've already left a review"
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

        return res.json(newReview);
    }
})


router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    const { url, preview } = req.body;
    const ownerId = parseInt(req.user.id)
    const id = parseInt(req.params.spotId)

    const spot = await Spot.findAll({
        where: {
            id: id,
            ownerId: ownerId
        }
    })

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
        const err = new Error("Spot couldn't be found")
        res.status(404)
        err.errors = {
            message: "Spot couldn't be found"
        }
        return res.json(err.errors)
    }

    if (spot.ownerId === ownerId) {
        const err = new Error("You can't book your own spot")
        res.status(500)
        err.errors = {
            message: 'Not authorized: cannot book your own spot'
        }
    }

    const bookings = await Booking.findAll({
        where: {
            spotId: spot.id
        }
    })


    const bookingArr = bookings.map(booking => {
        const thisBooking = booking.toJSON()
        if(thisBooking.startDate < endDate &&  thisBooking.startDate > endDate){
            res.status(403)
            res.json({
                message: "Booking conflict"
            })
        }
        if(thisBooking.endDate < startDate && thisBooking.endDate > endDate){
            res.status(403)
            res.json({
                message: "Booking conflict"
            })
        }
        return thisBooking
    })


    if (spot) {
        const newBooking = await Booking.build({
            startDate: startDate,
            endDate: endDate
        })
        newBooking.spotId = req.params.spotId
        newBooking.userId = req.user.id
        const newBookingStart = newBooking.startDate;

        const checkForDups = await Booking.findOne({
            where: {
                spotId: newBooking.spotId
            }
        })
        if (checkForDups) {
            const dupCheck = checkForDups.startDate

            if (dupCheck === newBookingStart) {
                const err = new Error("Duplicate Booking")
                res.status(403)
                err.errors = {
                    message: "This spot is already reserved for that date"
                }
            }
        }

        await newBooking.validate();
        await newBooking.save();

        return res.json({ newBooking });
    }


})



router.delete('/:spotId', requireAuth, async (req, res) => {
    const thisSpot = await Spot.findByPk(req.params.spotId)



    if (thisSpot && thisSpot.ownerId === req.user.id) {
        await thisSpot.destroy();
        return res.json({ message: 'Successfully deleted' })
    }
    if (!thisSpot) {
        res.status(404)
        res.json({ message: "Spot not found" })
    }
    return res.json({
        message: "not authorized"
    })

})




router.post('/', requireAuth, validateSpot, async (req, res, next) => {
    const { ownerId, address, city, state, country, lat, lng, name, description, price } = req.body


    const newSpot = await Spot.create({
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
        ownerId
    })

    return res.json({
        newSpot
    })
})

router.get('/:spotId', async (req, res, next) => {
    const sumRating = await Review.sum('stars')
    const numRatings = await Review.count()

    const avgRating = sumRating / numRatings;

    const thisSpot = await Spot.findByPk(req.params.spotId, {
        include: {
            model: User,
            attributes: ['id', 'firstName', 'lastName'],
        },
    })



    if (thisSpot === null) {
        const err = new Error("There was no spot with that Id")
        err.status = 404
        err.errors = {
            message: 'Spot id not found'
        }
        return next(err)
    }

    const spot = thisSpot.toJSON()

    spot.SpotImages = await SpotImage.findAll({
        attributes: ['id', 'url', 'preview']
    })

    spot.numReviews = numRatings
    spot.avgRating = avgRating


    return res.json({
        spot
    })
})

router.put('/:spotId', requireAuth, async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId, {
        where: {
            ownerId: req.user.id
        }
    })

    if (!spot) {
        res.status(404)
        const err = new Error("Spot not found")
        err.errors = {
            message: "That spot wasn't found"
        }
        return res.json(err.errors);
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

router.get('/', async (req, res) => {



    const allSpots = await Spot.findAll({
        include: [{
            model: SpotImage,
            as: 'previewImage',
            where: {
                preview: true
            }
        },
    {
        model: Review,
        attributes: ['stars'],
        as: 'avgRating'

    }]
    })

    const spotsArr = allSpots.map(spot => {
        const thisSpot = spot.toJSON();
        if (thisSpot.previewImage) {
            thisSpot.previewImage = thisSpot.previewImage[0].url
        }
        let sum = 0;
        let count = 0;
       for(let review of thisSpot.avgRating){
        count ++
        sum += review.stars
       }
       thisSpot.avgRating = sum / count;
        return thisSpot
    })


    return res.json({ Spots: spotsArr })

})
module.exports = router;
