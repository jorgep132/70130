const express = require('express');
const handlebars = require('express-handlebars');
const appRouter = require('./router/index.js');
const { connectDB } = require('./config/index.js');
const { Server } = require('socket.io');
const realTimeProducts = require('./router/api/realTimeProducts.router.js');
const { setupSocketEvents } = require('./socketEvents.js');
const MongoStore  = require('connect-mongo')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport');
const { intializePassport } = require('./config/passport.config.js');
const { initializePassportJWT } = require('./config/passport.jwt.js');

const app = express();
const PORT = process.env.PORT || 8080;
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// La palabra secreta del cookieParser debe estar en el .env
app.use(cookieParser('palabraclave'))

// Crear y loguear usuarios
app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://Jorge:Sevenfold132.@70125.gr6xs.mongodb.net/',
        ttl: 1000000000,
    }),
    secret: 'secretcoder',
    resave: true,
    saveUninitialized: true
}))

// JWT con cookie extractor
initializePassportJWT()

// Passport
intializePassport()
app.use(passport.initialize())
app.use(passport.session())

const hbs = handlebars.create({
    helpers: {
        multiply: (a, b) => a * b,
        eq: (a, b) => a === b
    }
});
app.engine('handlebars', hbs.engine);
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

// Routes
app.use(appRouter);

const httpServer = app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en puerto ${PORT}`);
});
const io = new Server(httpServer);

// Eventos de Socket.IO
setupSocketEvents(io);