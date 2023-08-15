const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { getUserByEmail, getUserByID, decrypt } = require('../helpers/Commons');

passport.use('login', new LocalStrategy({ usernameField: 'email' }, 
    async (email, password, done) => {
        const user = await getUserByEmail(email)
        
        if (!user) {
            return done(404, false);
        }

        const decryptedPassword = decrypt(user.password)
        if (decryptedPassword !== password) {
            return done(401, false);
        }

        done(null, user);
    }
))

passport.use('register', new LocalStrategy({ usernameField: 'email' }, 
    async (email, _, done) => {
        const user = await getUserByEmail(email)

        if (user) {
            return done(400, false);
        }

        done(null, user);
    }
))

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await getUserByID(id)

        done(null, user);
    } catch (err) {
        done(err, null);
    }
})

module.exports = passport;