const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        categories: [
            {
                type: String
            }   
        ],
        user_id: {
            type: mongoose.Schema.Types.ObjectId
        },
        s3_key: {
            type: String,
            required: true
        },
        file_link: { 
            type: String,
            required: true,
            index: { unique: true }
        },
        is_private: {
            type: Boolean,
            default: false
        }
    },
    {
        // createdAt,updatedAt fields are automatically added into records
        timestamps: true
    }
);

module.exports = mongoose.model('Image', ImageSchema);