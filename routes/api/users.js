const express = require('express');
const router = express.Router();
const gravatar = require('gravatar')
const { check, validationResult } = require('express-validator/check')
const bcrypt = require('bcryptjs')

const User = require('../../models/User')

router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include valid email').isEmail(),
    check('password')
        .isLength({min: 7})
        .withMessage('Password must be 7 or more characters')
        .isAlphanumeric()
        .withMessage('Password must be contain letters and numbers')
], async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    const { name, email, password } = req.body

    try {
        // check user exists
        let user = await User.findOne({ email })
        if (user) {
            res.status(400).json({ errors: [{mes: 'User already exists'}]})
        }

        // get gravatar
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })

        user = new User({
            name,
            email,
            avatar,
            password
        })

        // encrypt password

        const salt = await bcrypt.genSalt(10)

        user.password = await bcrypt.hash(password, salt)

        await user.save()

        // return jwt token

        res.send('User Registered')

    } catch(err){
        console.log(err.message)
        res.status(500).send('Server Error')
    }
})

module.exports = router;