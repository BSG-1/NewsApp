var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var HeadlineSchema = new Schema({
  // `title` is required and of type String
  title: {
    type: String,
    required: true
    // required: true
  },
  // `link` is required and of type String
  url: {
    type: String,
    required: true
  },
  blurb: {
    type: String,
    required: true
  },
  notes: [{
      type: Schema.Types.ObjectId,
      ref: "Note"
    }]
});

// This creates our model from the above schema, using mongoose's model method
var Headline = mongoose.model("Headline", HeadlineSchema);

// Export the Headline model
module.exports = Headline;