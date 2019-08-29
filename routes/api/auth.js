const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const config = require('config')
const { check, validationResult } = require('express-validator/check')

const User = require('../../models/User')

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch(err){
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

router.post('/', [
    check('email', 'Please include valid email').isEmail(),
    check('password')
        .exists()
        .withMessage('Password Required')
], async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    const { email, password } = req.body

    try {
        // check user exists
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ errors: [{mes: 'Invalid Credentials'}]})
        }

        // return jwt token

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.status(400).json({ errors: [{mes: 'Invalid Credentials'}]})
        }

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, config.get('jwtSecret'),
        {expiresIn: 360000},
        (err, token) => {
            if(err) throw err
            res.json({ token })
        })

    } catch(err){
        console.log(err.message)
        res.status(500).send('Server Error')
    }
})

module.exports = router