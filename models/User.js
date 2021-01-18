const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Schema = mongoose.Schema;
const SALT_WORK_FACTOR = 10;

//http://devsmash.com/blog/password-authentication-with-mongoose-and-bcrypt
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        index: { 
            unique: true 
        }
    },
    password: {
        type: String,
        required: true
    }
});

UserSchema.pre('save', function (next) {
    let user = this;
    
    if (user.isModified('password')) {
        bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
            if (err) return next(err);

            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) return next(err);

                user.password = hash;
                next();
            })
        })
    }
});

UserSchema.methods.verifyPassword = async function(potentialPassword) {
    return await bcrypt.compare(potentialPassword, this.password)
};

UserSchema.methods.generateAuthToken = async function() {
    user = this;
    const token = jwt.sign({_id: user._id, username: user.username}, process.env.JWT_KEY, { expiresIn : "2h" });

    return token;
}

module.exports = mongoose.model('User', UserSchema);