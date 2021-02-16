require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const app = express();
const path = require('path');
const initializeDatabase = require('./db/initializeDatabase');
const passport = require('passport');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const hbs = require('hbs');
const port = process.env.PORT || '3000';
const StreamrClient = require('streamr-client');


(async () => {
    await initializeDatabase();

    const client = new StreamrClient({
        auth: {
            privateKey: 'f101dfa290781c4efdbee78ff4c67211e4f7f478b293e7e668ab3c7456b7b56e',
        },
    })

    client.getOrCreateStream({
        description: 'canary-example-data',
    }).then((stream) => {
        client.subscribe(
            {
                stream: stream.id,
                // Resend the last 10 messages on connect
                resend: {
                    last: 10,
                },
            },
            (message) => {
                // Do something with the messages as they are received
                console.log(JSON.stringify(message))
            },
        )
    }).catch((err) => {
        if (err) return err;
    })
})();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'views/partials'));
app.use(express.static(path.join(__dirname, 'public')));

// cookie configuration
app.use(
    cookieSession({
        maxAge: 24 * 60 * 60 * 1000, // One day in milliseconds
        keys: ['randomstringhere']
    })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(require('./calendlyOauth2Strategy'));
passport.serializeUser((user, next) => {
    next(null, user);
});
passport.deserializeUser((user, next) => {
    next(null, user);
});

// routes
app.use('/', require('./routes'));
app.use('/auth_code', require('./routes/oauth'));
app.use('/api', require('./routes/api'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(port, () => {
    console.log(`Server ready at http://localhost:${port}`);
});
