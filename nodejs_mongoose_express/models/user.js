var mongoose = require('mongoose')
var Schema = mongoose.Schema

//Schema is the abstraction provided by mongoose used to create valid document models for mongodb
var userSchema = new Schema({
  /**
   ** Strong typification is required. We should specify the data type
   ** See https://mongoosejs.com/docs/schematypes.html for more information
   **/
  name: { type: String },
  email: { type: String }
})

//We exports the model to set public
module.exports = mongoose.model('User', userSchema)
