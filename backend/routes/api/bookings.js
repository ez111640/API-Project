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
            include: [{
                model: SpotImage,
                attributes: ['url'],
                as: 'previewImage',
                where: {
                    preview: true
                }
            }]
        }]
    })

    return res.json(bookingsArr)
})

router.put('/:bookingId', requireAuth, async (req, res) => {
    const thisBooking = await Booking.findByPk(req.params.bookingId, {
        where: {
            userId: req.user.id
        }
     })

     const currentDate = new Date();
     const end = thisBooking.toJSON().endDate.toDateString()

     const today = currentDate.toDateString()

     console.log(today < end)



    if(today <  end){
        res.status(400)
        res.json({
            message: "You can't edit a past booking"
        })
    }
    const {startDate, endDate } = req.body;


    if (!thisBooking) {
        res.status(404)
        const err = new Error("Booking not found")
        err.errors = {
            message: "That booking wasn't found"
        }
        return res.json(err.errors)
    }




    if (startDate) thisBooking.startDate = startDate
    if (endDate) thisBooking.endDate = endDate


    await thisBooking.save();

    res.json(thisBooking)
})

router.delete('/:bookingId', requireAuth, async (req, res) => {
    const thisBooking = await Booking.findByPk(req.params.bookingId)

    const currentDate = new Date();
    if(currentDate > thisBooking.endDate){
        res.status(400)
        res.json({
            message: "You can't delete a past booking"
        })
    }

    if (thisBooking === null) {
        const err = new Error("Booking wasn't found")
        res.status(404)
        err.errors = {
            message: "That booking couldn't be found"
        }
        return res.json(err.errors)
    }
    if (thisBooking.userId !== req.user.id) {
        res.status(500)
        res.json({
            message: "unauthorized"
        })
    }
    if (thisBooking) {
        await thisBooking.destroy()
        return res.json({ message: 'Successfully deleted' })
    }
})



module.exports = router;
