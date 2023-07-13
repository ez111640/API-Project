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
    const thisSpot = await Spot.findAll({
        where: {
            ownerId: ownerId
        }
    })


    return res.json(thisSpot)
})


router.get('/:spotId/reviews', async (req, res) => {
    const thisId = parseInt(req.params.spotId)
    const allReviews = await Review.findAll({
        where: {
            spotId: thisId,
        },
        include: {
            model: ReviewImage,
            attributes: ['id', 'url']
        },
        include: {
            model: User,
            attributes: ['id', 'firstName', 'lastName']
        }


    })

    return res.json(allReviews);
})

router.get('/:spotId/bookings', requireAuth,async (req, res) => {
    const thisId = parseInt(req.params.spotId)

    const spot = await Spot.findByPk(req.params.spotId)

    if(!spot){
        res.status(404)
        return res.json({
            message: "Couldn't find spot"
        })
    }
    const ownerBookings = await Booking.findAll({
        where: {
            spotId: thisId,
        }
    })
    const nonOwnerBookings = await Booking.findAll({
        where: {
            spotId : thisId
        },
        include: {
            model: User,
            attributes: ['id', 'firstName','lastName']
        }
    })

    if(spot.ownerId === req.user.id) return res.json(ownerBookings)
    return res.json(nonOwnerBookings)
})

router.post('/:spotId/reviews', requireAuth, async (req, res, next) => {
    const { review, stars } = req.body;
    const ownerId = parseInt(req.user.id)
    const id = parseInt(req.params.spotId)

    const spot = await Spot.findAll({
        where: {
            id: id,
            ownerId: ownerId
        }
    })

    if (spot) {
        const newReview = await Review.build({
            "review": review,
            "stars": stars
        })
        await newReview.save();

        return res.json({
            "review": newReview.review,
            "stars": newReview.stars
        });
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

    if (spot) {
        const newBooking = await Booking.build({
            startDate: startDate,
            endDate: endDate
        })
        newBooking.spotId = req.params.spotId
        newBooking.ownerId = req.user.id
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
    if (thisSpot === null) {
        const err = new Error("Spot couldn't be found")
        res.status(404)
        err.errors = {
            message: "That spot couldn't be found"
        }
        return res.json(err.errors)
    }
    return res.json({
        message: "not authorized"
    })

})

router.get('/', async (req, res) => {



    const allSpots = await Spot.findAll({

    })




    return res.json({ Spots: allSpots })

})



router.post('/', validateSpot, async (req, res, next) => {
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

router.get('/:id', async (req, res, next) => {
    const sumRating = await Review.sum('stars')
    const numRatings = await Review.count()

    const avgRating = sumRating / numRatings;

    const thisSpot = await Spot.findByPk(req.params.id, {
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

    spot.previewImage = await SpotImage.findAll({
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

module.exports = router;
