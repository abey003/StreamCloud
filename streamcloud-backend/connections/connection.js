const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://userone:Abc123@cluster0.7r3a9jx.mongodb.net/StreamCloudDB?retryWrites=true&w=majority&appName=Cluster0').then((res) => {
    console.log("DB is connected");
}).catch((error) => {
    console.log("Error in connecting DB")
})