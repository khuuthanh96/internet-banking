const mongoose = require("mongoose");
const { hash, compare } = require("bcrypt");

const userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true, minlength: 6, maxlength: 40 },
    phone: { type: String, required: true, trim: true, minlength: 9, maxlength: 12 },
    roles: {
        type: String,
        enum: ['super', 'admin', 'user'],
        default: 'user'
    },
    email: { type: String, required: true, trim: true }
});

const UserModel = mongoose.model('User', userSchema);

class User extends UserModel {
    static async signUp(username, password, name, phone, email) {
        const encrypted = await hash(password, 8);
        const user = new User({ username, password: encrypted, name, phone, email });

        return user.save()
            .then(_ => {
                const u = user.toObject();
                delete u.password;
                return u;
            })
    }

    static async comparePassword(idUser, password, cb) {
        User.findById(idUser)
            .then(user => {
                compare(password, user.password, (err, same) => {
                    if (err) return cb(err);
                    return cb(null, same);
                });
            })
            .catch(err => {
                cb(err, false);
            });
    }

    static getUser(idUser) {
        return User.findById(idUser)
            .then(user => {
                if (!user) return false
                
                let u = user.toObject()
                delete u.password;
                return u;
            })
            .catch(err => {
                console.log(`/user/:id -> User.findById: ${err}`);
                return false;
            })
    }

    static getAllUser() {
        return User.find({ roles: "user" })
            .then(users => {
                let usersFilter = [];
                users.forEach(u => {
                    const user = u.toObject();
                    delete user.password;
                    usersFilter.push(user);
                });
                return usersFilter;
            })
            .catch(err => {
                console.log(`/user/:id -> User.findById: ${err}`);
                return false;
            })
    }
};

module.exports = User;