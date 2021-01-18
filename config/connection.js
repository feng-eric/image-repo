const mongoose = require('mongoose');


module.exports = {
    // connect function to create a mongoDB connection
    'connectDB': function() {
        mongoose.connect(
            process.env.MONGO_DB_URL,
            { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true },
            (err) => {
                if (err) {
                    console.error("Error connecting to MongoDB: " + error.message);
                } else {
                    console.info("Successfully connected to MongoDB!");
                }
            }
        )
    }
}

