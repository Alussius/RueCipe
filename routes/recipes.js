let express    = require("express");
let router     = express.Router();
let Recipe     = require("../models/recipe");
let middleware = require("../middleware");

// INDEX ROUTE - PRESENTS A LIST OF RECIPES AVAILABLE IN THE DB
router.get("/", (req, res) => {
    Recipe.find({}, (err, recipes) => {
        if(err){
            console.log(err.message);
        } else {
            res.render("recipes/index", {recipes: recipes});
        }
    });
});

// CREATE ROUTE - CREATE THE RECIPE DATA IN THE DB
router.post("/", middleware.isLoggedIn, (req, res) => {
    console.log("Test");
    let newRecipe = {
        name: req.body.name,
        image: req.body.image,
        description: req.body.description,
        ingredients: req.body.ingredients,
        direction: req.body.direction,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    };

    Recipe.create(newRecipe, (err, recipe) => {
		if(err){
			console.log(err);
		} else {
			//redirect back to campground page
	        res.redirect("/recipes");
		}
	});	
});

// NEW ROUTE - SHOW A FORM TO GATHER INFORMATION IN ORDER TO CREATE A NEW RECIPE
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("recipes/new");
});

// SHOW ROUTE - SHOW RECIPE INFORMATION
router.get("/:id", (req, res) => {
    Recipe.findById(req.params.id).populate("comments").exec((err, foundRecipe) => {
        if(err || !foundRecipe){
			if(err == null){
				req.flash("error", "Campground not found");
			} else {
				req.flash("error", err.message);
			}
            res.redirect("/");
        } else {
            res.render("recipes/show", {recipe: foundRecipe});
        }
    });
});

// EDIT ROUTE - EDIT RECIPE
router.get("/:id/edit", middleware.checkRecipeOwnership, (req, res) => {
    Recipe.findById(req.params.id, (err, foundRecipe) => {
        if(err || !foundRecipe){
            console.log(err.message);
			if(!foundCamp){
				req.flash("error", "Campground not found");
			} else {
				req.flash("error", err.message);
			}
        } else {
            res.render("recipes/edit", {recipe: foundRecipe});
        }
    });
});

// UPDATE ROUTE - UPDATE RECIPE IN THE DB
router.put("/:id", middleware.checkRecipeOwnership, (req, res) => {
    Recipe.findByIdAndUpdate(req.params.id, req.body.recipe, (err, updatedRecipe) => {
        if(err || !updatedRecipe){
			if(err == null){
				req.flash("error", "Campground not found");
			} else {
				req.flash("error", err.message);
			}
            res.redirect("back");
        } else {
            res.redirect("/recipes/" + req.params.id);
        }
    });
});

// DESTROY RECIPE
router.delete("/:id", middleware.checkRecipeOwnership, (req, res) => {
    Recipe.findByIdAndDelete(req.params.id, err => {
        if(err){
			req.flash("error", err.message);
        } else {
            res.redirect("/recipes");
        }
    });
});

module.exports = router;