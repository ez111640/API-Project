const express = require('express');
const { Spot, Review, User, SpotImage, ReviewImage, Booking } = require('../../db/models')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { ValidationError } = require('sequelize');
const { requireAuth } = require('../../utils/auth.js');
const {  restoreUser } = require('../../utils/auth');

const router = express.Router();

router.delete('/:imageId', async(req, res) => {
    const thisImage = await ReviewImage.findByPk(req.params.imageId)
    if(thisImage) {
        await thisImage.destroy()
        return res.json({ message: 'Successfully deleted'})
    }
    if (thisImage === null) {
        const err = new Error("Image couldn't be found")
        res.status(404)
        err.errors = {
            message: "That image couldn't be found"
        }
        return res.json(err.errors)
    }

    
})

module.exports = router;
