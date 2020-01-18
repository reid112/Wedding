const LocalStrategy = require('passport-local').Strategy

function initialize(passport, getUserByUsername, getUserById) {
  const authenticateUser = async (username, password, done) => {
    try {
      const user = await getUserByUsername(username)
      if (user == null) {
        return done(null, false, { message: 'Invalid credentials' })
      }

      if (password === user.password) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Invalid credentials' })
      }
    } catch (e) {
      return done(e)
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.user_id))
  passport.deserializeUser((userId, done) => {
    return done(null, getUserById(userId))
  })
}

module.exports = initialize
