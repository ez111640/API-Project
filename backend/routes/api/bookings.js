const express = require('express');
const { Spot, Review, User, SpotImage, ReviewImage, Booking, Sequelize } = require('../../db/models')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { ValidationError } = require('sequelize');
const { requireAuth } = require('../../utils/auth.js');
const { restoreUser } = require('../../utils/auth');

const router = express.Router();

router.get('/current', requireAuth, async (req, res) => {

    const userId = parseInt(req.user.id)
    const bookingsArr = await Booking.findAll({
        where: { userId: userId },
        include: [{
            model: Spot,
            attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
            include: [{
                model: SpotImage,
                attributes: ['id','url','preview'],
                as: 'previewImage'
            }]
        }]
    })

    const bookArr = bookingsArr.map(booking => {
        const thisBook = booking.toJSON()


        if (thisBook.Spot) {
            let foundPreview = false

            for (let image of thisBook.Spot.previewImage) {
                if (image.preview = true) {
                    thisBook.Spot.previewImage = image.url
                    foundPreview = true
                }
            }
            if (!foundPreview) {
                thisBook.Spot.previewImage = "No preview available";
            }
        }

        return thisBook
    })

    return res.json({ Bookings: bookArr })

})

router.put('/:bookingId', requireAuth, async (req, res) => {
    const thisBooking = await Booking.findByPk(req.params.bookingId)



    if (!thisBooking) {
        res.status(404)
        const err = new Error("Booking not found")
        err.errors = {
            message: "Booking couldn't be found"
        }
        return res.json(err.errors)
    }

    if (thisBooking.userId !== req.user.id) {
        res.status(403)
        return res.json({
            message: "Forbidden"
        })
    }



    const currentDate = new Date();

    const end = new Date(thisBooking.toJSON().endDate.toDateString())

    const today = new Date(currentDate.toDateString())


    if (today > end) {
        res.status(400)
        return res.json({
            message: "Past bookings can't be modified"
        })
    }
    const { startDate, endDate } = req.body;

    if(!startDate || !endDate){
        res.status(400);
        return res.json({
            message: "You must enter a start date or end date"
        })
    }


    const startDay = new Date(startDate).getTime();
    const endDay = new Date(endDate).getTime();

    if (endDay < startDay) {
        res.status(400)
        return res.json({
            "message": "endDate cannot be on or before startDate"
        })
    }

    const bookings = await Booking.findAll({
        where: {
            spotId: thisBooking.toJSON().spotId
        }
    })

    const bookingArr = bookings.map(booking => {
        const thisBooking = booking.toJSON()
        if (thisBooking.startDate < endDate && thisBooking.startDate > endDate) {
            res.status(403)
            res.json({
                message: "Start date conflicts with an existing booking"
            })
        }
        if (thisBooking.endDate < startDate && thisBooking.endDate > endDate) {
            res.status(403)
            res.json({
                message: "End date conflicts with an existing booking"
            })
        }
        return thisBooking
    })


    if (startDate) thisBooking.startDate = startDate
    if (endDate) thisBooking.endDate = endDate


    await thisBooking.save();

    res.json(thisBooking)
})

router.delete('/:bookingId', requireAuth, async (req, res) => {
    const thisBooking = await Booking.findByPk(req.params.bookingId)
    if (thisBooking === null) {
        const err = new Error("Booking wasn't found")
        res.status(404)
        err.errors = {
            message: "Booking couldn't be found"
        }
        return res.json(err.errors)
    }
    const thisSpot = await Spot.findByPk(thisBooking.spotId)

    if (thisBooking.userId !== req.user.id && thisSpot.ownerId !== req.user.id) {
        res.status(403)
        return res.json({
            message: "Forbidden"
        })
    }

    const currentDate = new Date();
    if (currentDate > thisBooking.startDate) {
        res.status(400)
        res.json({
            message: "Bookings that have been started can't be deleted"
        })
    }


    if (thisBooking.userId !== req.user.id) {
        res.status(500)
        res.json({
            message: "Forbidden"
        })
    }
    if (thisBooking) {
        await thisBooking.destroy()
        return res.json({ message: 'Successfully deleted' })
    }
})



module.exports = router;
