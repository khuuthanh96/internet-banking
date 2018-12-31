const mongoose = require("mongoose");

const hintSchema = mongoose.Schema({
    username: { type: String, required: true },
    accNumber: { type: String, required: true, trim: true }
});

const HintModel = mongoose.model('Hint', hintSchema);

class Hint extends HintModel {
    static createHintAccount(accNumber, username) {
        const hint = new Hint({username, accNumber});
        return hint.save()
            .catch(err => {
                console.log("Hint.createHintAccount: got error: ", err.message);
                return false;
            })
    }

    static getHintAccount(hintId) {
        return Hint.findById(hintId)
        .then(hint => {
            if (!hint) return false;
            return hint;
        })
        .catch(err => {
            console.log("Hint.getHintAccount: got error: ", err.message);
            return false;
        })
    }
}

module.exports = Hint;