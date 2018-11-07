const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = new mongoose.Schema({
  local: {
    email: String,
    password: String,
    username: String,
    nationality: String,
    elo: Number    
  },
});


userSchema.methods.encriptar = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};


userSchema.methods.validar = function (password) {
  return bcrypt.compareSync(password, this.local.password);
};


module.exports = mongoose.model('User', userSchema);
