const express = require('express');

const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth.js');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { ValidationError } = require('sequelize');

const router = express.Router();

const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];
router.get('/', async (req, res) => {
    const allUsers = await User.findAll(

    )

    return res.json(allUsers)
})

router.post('/', validateSignup, async (req, res, next) => {
    const { email, password, username, firstName, lastName } = req.body;
    const hashedPassword = bcrypt.hashSync(password);

    const emailFound = await User.findAll({
        where: {
            email: email
        }
    });

    console.log(emailFound)

    if (emailFound.length !== 0) {
        const err = new Error('User with that email already exists')
        err.status = 500
        err.errors = {
            message: 'User already exists'
        }
        return next(err)
    }

    const usernameFound = await User.findAll({
        where: {
            username: username
        }
    });

    if (usernameFound.length !== 0) {
        const err = new Error('User with that username already exists')
        err.status = 500
        err.errors = {
            message: 'User already exists'
        }
        return next(err)
    }



    const user = await User.create({
        email, username, hashedPassword, firstName, lastName
    });


    const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
    };

    await setTokenCookie(res, safeUser);

    return res.json({
        user: safeUser
    })
})


module.exports = router;
