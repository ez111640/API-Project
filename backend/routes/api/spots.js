const express = require('express');
const { Spot, Review, User } = require('../../db/models')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { ValidationError } = require('sequelize');

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




router.get('/', async (req, res) => {

    const allSpots = await Spot.findAll(
    )

    return res.json(allSpots)

})



router.post('/', validateSpot, async (req, res, next) => {
    const { ownerId, address, city, state, country, lat, lng, name, description, price } = req.body

    const newSpot = await Spot.create({
        ownerId, address, city, state, country, lat, lng, name, description, price
    })

    return res.json({
        newSpot
    })
})

router.delete('/:id', async (req, res) => {
        const thisSpot = await Spot.findByPk(req.params.id)
        if (thisSpot) {
            await thisSpot.destroy();
            return res.json({ message: 'Successfully deleted' })
        }
        if (thisSpot === null) {
            const err = new Error("Spot couldn't be found")
            err.status = 404
            err.errors = {
                message: "That spot couldn't be found"
            }
            return res.json(err.errors)
        }

})

router.get('/:id', async (req, res, next) => {
    const sumRating = await Review.sum('stars')
    const numRatings = await Review.count()

    const avgRating = sumRating / numRatings;

    const thisSpot = await Spot.findByPk(req.params.id, {
        include: {
            model: User,
            attributes: ['id', 'firstName', 'lastName']
        }
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

    spot.numReviews = numRatings
    spot.avgRating = avgRating


    return res.json({
        spot
    })



})

module.exports = router;
