const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema(
    {
        price: {
            type: String,
            required: true
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId
        },
        image_id: {
            type: mongoose.Schema.Types.ObjectId
        }
    },
    {
        // createdAt,updatedAt fields are automatically added into records
        timestamps: true
    }
);

module.exports = mongoose.model('Transaction', TransactionSchema);