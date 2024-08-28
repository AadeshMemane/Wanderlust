const express = require('express')
const router = express.Router({ mergeParams: true })
const multer = require('multer')
const wrapAsync = require('../utils/wrapAsync.js')
const {
  validateListing,
  isLoggedIn,
  saveRedirectUrl,
  isOwner,
} = require('../middleware.js')

const listingController = require('../controllers/listings.js')

const { storage } = require('../cloudConfig.js')
const upload = multer({ storage })

//Index Route //Post Route
router
  .route('/')
  .get(wrapAsync(listingController.index))
  .post(
    upload.single('listing[image]'),
    isLoggedIn,
    validateListing,
    wrapAsync(listingController.createListing)
  )

// home
router.route('/home').get(wrapAsync(listingController.home))

//Create Route
router.route('/new').get(isLoggedIn, wrapAsync(listingController.renderNewForm))

//Show Route //update Route //DELETE ROUTE
router
  .route('/:id')
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    saveRedirectUrl,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing))

//Render Edit Form Route
router.get(
  '/:id/edit',
  isLoggedIn,
  saveRedirectUrl,
  isOwner,
  wrapAsync(listingController.renderEditListing)
)

// Filters Route
router.route('/category/:id').get(listingController.filtersRoute)

// Search Route
router.route('/search/query').post(listingController.searchRoute)

//Privacy Routes
router.route('/others/privacy').get(listingController.privacyRoute)

//Terms Routes
router.route('/others/terms').get(listingController.termsRoute)

module.exports = router
