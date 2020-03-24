let express    = require("express");
let router     = express.Router({mergeParams: true});
let Recipe     = require("../models/recipe");
let Comment    = require("../models/comment");
let middleware = require("../middleware");

// NEW COMMENT
router.get("/new", middleware.isLoggedIn, (req, res) => {
    Recipe.findById(req.params.id, (err, recipe) => {
        if(err){
            console.log(err.message);
        } else {
            res.render("comments/new", {recipe: recipe});
        }
    });
});

// CREATE COMMENT IN DB
router.post("/", middleware.isLoggedIn, (req, res) => {
    Recipe.findById(req.params.id, (err, recipe) => {
        if(err){
            console.log(err);
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if(err){
					req.flash("error", "Something went wrong");
					console.log(err);
                } else {
                    // Add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    
                    // Connect new comment to campground
                    comment.save();
                    recipe.comments.push(comment);
                    recipe.save();
                    console.log(comment);
                    req.flash("success", "Successfully created comment");
                    // Redirect to the campground show page
                    res.redirect("/recipes/" + req.params.id);
                }
            });
        }
    })
});

// EDIT COMMENT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if(err || !found){
            if(!comment){
                req.flash("error", "Comment was not found.");
            } else {
                req.flash("error", err.message);
            }
            res.redirect("/");
        } else {
            res.render("comments/edit", {recipe_id: req.params.id, comment: foundComment});
        }
    })
});

// UPDATE COMMENT IN THE DATABASE
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/recipes/" + req.params.id);
        }
    });
});

// DELETE COMMENT
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if(err){
            res.redirect("back");
        } else {
			req.flash("success", "Comment deleted");
            res.redirect("/recipes/" + req.params.id);
        }
    });
});

module.exports = router;