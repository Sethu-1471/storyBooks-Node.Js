const express = require("express")
const path = require("path")
const mongoose = require('mongoose')
const dotenv = require("dotenv")
const morgan = require("morgan")
const exphbs = require("express-handlebars")
const passport = require('passport')
const session = require('express-session')
const mongoStore = require('connect-mongo')(session)
const connectDB = require("./config/db")
const methodOverride = require('method-override')

dotenv.config({ path: './config/config.env' })
connectDB()

const app = express()

// Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  })
)

// Passport
require('./config/passport')(passport)

//LOGGING

if (process.env.NODE_ENV === "development"){
    app.use(morgan('dev'))
}

// Handlebars Helpers
const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
} = require('./helpers/hbs')

// HANDLEBARS
app.engine('.hbs', exphbs({ helpers: {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
}, defaultLayout:'main' ,extname: '.hbs'}));
app.set('view engine', '.hbs');

// Sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
   saveUninitialized: false,
    store: new mongoStore({ mongooseConnection: mongoose.connection })
  }))

// Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

// Set global var
app.use(function (req, res, next) {
  res.locals.user = req.user || null
  next()
})

// Static
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT || 6000

app.listen(PORT, console.log("Running on port", PORT, "mode", process.env.NODE_ENV))