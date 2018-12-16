const mongoose = require("mongoose");
const {hash, compare} = require("bcrypt");

const userSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true, trim: true},
    password: {type: String, required: true, trim:true},
    name: { type: String, required: true, trim: true, minlength: 6, maxlength: 40 },
    phone: { type: String,required: true, trim: true, minlength: 9, maxlength: 12 },
    roles: {
        type: String,
        enum: ['super', 'admin', 'user'],
        default: 'user'
    }
});

const UserModel = mongoose.model('User', userSchema);

class User extends UserModel {
    static async signUp(username, password, name, phone) {
        const encrypted = await hash(password, 8);
        const user = new User({ username, password: encrypted, name, phone});
        
        await user.save()
        .catch(error => {
            console.log(error)
        });
        const u = user.toObject();
        delete u.password;
        return u;
    }

    static async comparePassword(idUser, password, cb) {
        User.findById(idUser)
        .then(user => {
            compare(password, user.password, (err, same)=> {
                if(err) return cb(err);
                return cb(null, same);
            });
        })
        .catch(err => {
            cb(err, false);
        });
    }
};

module.exports = User;