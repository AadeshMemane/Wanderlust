const User = require('../models/user.js')

//Render Signup Route
module.exports.renderSignUp = async (req, res) => {
  res.render('./user/signup.ejs')
}

//SignUp Route
module.exports.signUp = async (req, res) => {
  try {
    let { firstName, lastName, username, email, password, confirmPass } =
      req.body
    const newUser = new User({ firstName, lastName, email, username })
    if (password == confirmPass) {
      const registeredUser = await User.register(newUser, password)
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err)
        }
        req.flash('success', 'New User Registered!')
        res.redirect('/listings')
      })
    } else {
      req.flash('error', 'Password must be same.')
      res.redirect('/signup')
    }
  } catch (e) {
    req.flash('error', e.message)
    res.redirect('/signup')
  }
}

//Render SignIn Page Route
module.exports.renderSignIn = async (req, res) => {
  res.render('./user/signin.ejs')
}

//SignIn Route
module.exports.signIn = async (req, res) => {
  req.flash('success', 'Welcome to WanderLust, You are logged in!')
  const redirectUrl = res.locals.redirectUrl || `/listings`
  res.redirect(redirectUrl)
}
//LogOut
module.exports.logOut = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err)
    }
    req.flash('success', 'You logged out Successfully')
    res.redirect('/listings')
  })
}
