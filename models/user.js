const mongoose              = require("mongoose"),
	  passportLocalMongoose = require("passport-local-mongoose");

let UserSchema = mongoose.Schema({
	username: String,
	password: String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);