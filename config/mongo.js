const mongoose = require('mongoose');
mongoose.connect(
   //  "mongodb://localhost:27017/test",
    "mongodb+srv://admin:admin@chatcluster.1ayju.mongodb.net/Chat?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
        if (err) {
            console.log("Error occured while connecting", err);
        } else console.log("Connected to database");
    }
);
