const express = require('express');
const { Spot, Review, User, SpotImage, ReviewImage, Booking, Sequelize } = require('../../db/models')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { ValidationError } = require('sequelize');
const { requireAuth } = require('../../utils/auth.js');
const {  restoreUser } = require('../../utils/auth');

const router = express.Router();

router.get('/current', requireAuth, async (req, res) => {

    const userId = parseInt(req.user.id)
    const thisSpot = await Booking.findAll({
        where: {
            userId: userId
        },
        include: {
            model: Spot,
        }
    })

    return res.json(thisSpot)
})

router.put('/:bookingId', requireAuth, async(req, res) => {
    const thisBooking = await Booking.findByPk(req.params.bookingId, {
        where: {
            userId: req.user.id
        }
    })

    if(!thisBooking){
        res.status(404)
        const err = new Error("Booking not found")
        err.errors = {
            message: "That booking wasn't found"
        }
        return res.json(err.errors)
    }

    
    if(startDate) thisBooking.startDate = startDate
    if(endDate) thisBooking.endDate = endDate


    await thisBooking.save();

    res.json(thisBooking)
})

router.delete('/:bookingId', async(req, res) => {
    const thisBooking = await Booking.findByPk(req.params.bookingId)
    if(thisBooking) {
        await thisBooking.destroy
        return res.json({message: 'Successfully deleted'})
    }
    if(thisBooking === null) {
        const err = new Error("Booking wasn't found")
        res.status(404)
        err.errors = {
            message: "That booking couldn't be found"
        }
        return res.json(err.errors)
    }
})



module.exports = router;
