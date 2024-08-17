const express = require('express')
const router = express.Router({ mergeParams: true })
const wrapAsync = require('../utils/wrapAsync.js')

const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
  saveRedirectUrl,
} = require('../middleware.js')

const reviewController = require('../controllers/reviews.js')

//Reviews

//POST REVIEW ROUTE
router.post(
  '/',
  isLoggedIn,
  saveRedirectUrl,
  validateReview,
  wrapAsync(reviewController.postReview)
)

//DELETE REVIEW ROUTE

router.delete(
  '/:reviewId',
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview)
)

module.exports = router
