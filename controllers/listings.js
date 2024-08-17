const Listing = require('../models/listing.js')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapToken = process.env.MAP_TOKEN
const geoCodingClient = mbxGeocoding({ accessToken: mapToken })

//Index Route
module.exports.index = async (req, res, next) => {
  const allListings = await Listing.find({})
  res.render('./listings/index.ejs', { allListings })
}

//Home Page
module.exports.home = async (req, res, next) => {
  res.render('./listings/home.ejs')
}

//Create Listing Route
module.exports.renderNewForm = async (req, res, next) => {
  await res.render('./listings/new.ejs')
}

//Show Listing Route
module.exports.showListing = async (req, res, next) => {
  let { id } = req.params
  const listing = await Listing.findById(id)
    .populate({
      path: 'reviews',
      populate: { path: 'author' },
    })
    .populate('owner')
  if (!listing) {
    req.flash('error', 'Listing you looking for does not exist!')
    res.redirect('/listings')
  }
  res.render('./listings/show.ejs', { listing })
}

//Create Listing POST Route
module.exports.createListing = async (req, res, next) => {
  let response = await geoCodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send()
  const url = req.file.path
  const filename = req.file.filename
  const newListing = new Listing(req.body.listing)
  newListing.image = { url, filename }
  newListing.owner = req.user._id
  newListing.geometry = response.body.features[0].geometry
  await newListing.save()
  req.flash('success', 'New Listing Added Successfully!')
  res.redirect('/listings')
}

//Edit Listing Render Route
module.exports.renderEditListing = async (req, res, next) => {
  let { id } = req.params
  const listing = await Listing.findById(id)
  if (!listing) {
    req.flash('error', 'Listing you looking for does not exist!')
    res.redirect('/listings')
  }
  let originalUrl = listing.image.url
  originalUrl = originalUrl.replace('upload', 'upload/w_250,h_250,c_fill')
  res.render('./listings/edit.ejs', { listing, originalUrl })
}

//Update Listing PUT Route
module.exports.updateListing = async (req, res, next) => {
  let { id } = req.params
  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing })
  let response = await geoCodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 2,
    })
    .send()
  if (typeof req.file !== 'undefined') {
    const url = req.file.path
    const filename = req.file.filename
    listing.image = { url, filename }
  }
  listing.geometry = response.body.features[0].geometry
  await listing.save()

  req.flash('success', 'Listing Updated Successfully!')
  res.redirect(`/listings/${id}`)
}

//Delete Listing Route
module.exports.deleteListing = async (req, res, next) => {
  let { id } = req.params
  await Listing.findByIdAndDelete(id)
  req.flash('success', 'Listing Deleted Successfully!')
  res.redirect('/listings')
}

//filters Display Route
module.exports.filtersRoute = async (req, res) => {
  let { id } = req.params
  if (id === 'trending') {
    const allListings = await Listing.find()
    res.render('listings/index.ejs', { allListings })
  } else {
    const allListings = await Listing.find({ category: id })
    res.render('listings/index.ejs', { allListings })
  }
}

//Search Button Query Route
module.exports.searchRoute = async (req, res) => {
  let { query } = req.body
  const allListings = await Listing.find({
    $or: [
      { title: query },
      { location: query },
      { country: query },
      { category: query },
    ],
  })
  console.log(allListings)
  if (allListings.length == 0) {
    req.flash(
      'error',
      'We are sorry, but we couldnt find any listings that match your search criteria'
    )
    res.redirect('/listings')
  }
  res.render('listings/index.ejs', { allListings })
}

//Privacy Page Render Route
module.exports.privacyRoute = async (req, res) => {
  res.render('other/privacy')
}
//Terms Page Render Route
module.exports.termsRoute = async (req, res) => {
  res.render('other/terms')
}
