if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const errorHandler = require('./middlewares/error.middleware');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.model');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const MongoStore = require('connect-mongo').default;
const { createWebCryptoAdapter } = require( 'connect-mongo');

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.use(express.static(path.join(__dirname, '../public')));

app.use(express.urlencoded({extended : true}));
app.use(express.json());

app.use(methodOverride('_method'));


const store = MongoStore.create({
    mongoUrl: process.env.ATLAS_URL,
    touchAfter: 24 * 60 * 60,
    cryptoAdapter: createWebCryptoAdapter({
        secret: process.env.SESSION_SECRET,
    })
});

store.on('error', (err) => {
    console.error('SESSION STORE ERROR:', err);
});


const sessionOption = {
    store,
    secret : process.env.SESSION_SECRET,
    resave : false,
    saveUninitialized : false,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
        secure: process.env.NODE_ENV === 'production',
    }
};


app.use(cookieParser());
app.use(session(sessionOption));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) =>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
});



app.use('/roamioGo', require('./routes/authentication.route'))
app.use('/listings', require('./routes/listings.route'));



const geocodingClient = mbxGeocoding({
    accessToken: process.env.MAPBOX_TOKEN
});



app.get("/reverseGeocode", async (req, res) => {
    try {
        const lng = Number(req.query.lng);
        const lat = Number(req.query.lat);

        if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
            return res.status(400).json({
                error: "Invalid or missing longitude/latitude"
            });
        }

        const response = await geocodingClient
            .reverseGeocode({
                query: [lng, lat],
                limit: 1
            })
            .send();

        const feature = response.body.features?.[0];

        if (!feature) {
            return res.status(404).json({ error: "No location found" });
        }

        res.json({
            placeName: feature.place_name,
            center: feature.center
        });

    } catch (err) {
        console.error(err);
        console.error("Reverse geocode error:", err.message);
        res.status(500).json({ error: "Reverse geocoding failed" });
    }
});





// Page Not Found 
app.use((req, res) =>{
    return res.status(404).render('error.ejs', {
        status : 404,
        message : 'Page Not Found',
    });
});


app.use(errorHandler);

module.exports = app;