const path = require('path');
const app = require('./app');
const connectDB = require('./config/db.config');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ 
        path: path.resolve(__dirname, '../.env') 
    });
}



const PORT = process.env.PORT || 3030;

const init = async () => {
    try {
        await connectDB();

        console.log("Database Connected Successfully..!");

        app.listen(PORT, () => {
            console.log(`Server Listening on Port ${PORT}`);
        });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

init();