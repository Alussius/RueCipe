let express        = require("express"),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    flash          = require("connect-flash"),
    methodOverride = require("method-override"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    app            = express(),
    seedDB         = require("./seeds");

let Recipe           = require("./models/recipe"),
    Comment          = require("./models/comment"),
    User             = require("./models/user");

// ROUTE VARIABLES
let commentRoutes = require("./routes/comments"),
    recipeRoutes  = require("./routes/recipes"),
    indexRoutes   = require("./routes/index");

// DB CONFIG
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
mongoose.connect(DATABASEURL).then(() => {
    console.log("Connected to AtlasDB!");
}).catch(err => {
    console.log('ERROR:', err.message);
});
/*mongoose.connect('mongodb+srv://dbRue:dbPW32@cluster0-tfzsv.mongodb.net/test?retryWrites=true&w=majority').then(() => {
    console.log("Connected to AtlasDB!");
}).catch(err => {
    console.log('ERROR:', err.message);
});*/

// seedDB();

app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "The creator of this app is Rue.",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
    next();
});

app.use("/", indexRoutes);
app.use("/recipes", recipeRoutes);
app.use("/recipes/:id/comments", commentRoutes);

// CATCH ROUTE - Just in case
app.get("*", (req, res) => {
    res.send("Error!!");
});

app.listen(process.env.PORT, process.env.IP, () => {
    console.log("Server is listening");
});