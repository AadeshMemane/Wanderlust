const express = require('express')
const router = express.Router({ mergeParams: true })
const wrapAsync = require('../utils/wrapAsync')
const { saveRedirectUrl } = require('../middleware.js')
const passport = require('passport')
const usersController = require('../controllers/users.js')

//SignUp Route
router
  .route('/signup')
  .get(usersController.renderSignUp)
  .post(wrapAsync(usersController.signUp))

//SignIn Route
router
  .route('/signin')
  .get(usersController.renderSignIn)
  .post(
    saveRedirectUrl,
    passport.authenticate('local', {
      failureRedirect: '/signin',
      failureFlash: true,
    }),
    wrapAsync(usersController.signIn)
  )

// LogOut Route
router.route('/logout').get(usersController.logOut)

module.exports = router
