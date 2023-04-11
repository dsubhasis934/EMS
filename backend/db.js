const mongoose = require('mongoose');
const user = require('./modules/Userschema');
const connectdb = async () => {
    mongoose.set('strictQuery', false);
    const dburl = 'mongodb+srv://dsubhasis934:Dsubho2020@cluster0.vyye0go.mongodb.net/foody?retryWrites=true&w=majority';
    mongoose.connect(dburl, { useNewUrlParser: true }, async (err, result) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log("succesfully connected");
            //const fetch_data = await mongoose.connection.db.collection("admins"); when we try to return promise,thsi code will not be worked.
            //for work with promises we always created schema first then import adn use it.
            user.find({}).then(response => { console.log("show all users") }).catch(cat => { console.log(cat) })
        }
    })
}
module.exports = connectdb;
