let Recipe  = require("../models/recipe"),
    Comment = require("../models/comment");

let middlewareObj = {};

middlewareObj.checkRecipeOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Recipe.findById(req.params.id, (err, foundRecipe) => {
            if(err || !foundRecipe){
                if(err == null){
                    console.log("Recipe not found.");
                } else {
                    console.log("You do not have permission to do that.");
                    res.redirect("back");
                }
            } else {
                if(foundRecipe.author.id.equals(req.user._id)){
                    return next();
                }
                console.log("You do not have permission to do that.");
                res.redirect("/login");
            }
        });
    } else {
        console.log("You need to be logged in to that!");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err){
                console.log(err);
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }
            }
        });
    } else {
        console.log("You need to be logged in to do that");
        res.redirect("/login");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

module.exports = middlewareObj;