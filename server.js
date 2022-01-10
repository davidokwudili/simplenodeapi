require("module-alias/register");
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });


const db = require('@models');
const app = require('@root/app');


// console.log(app.get('env'));
// console.log(process.env);
// console.log('------------------------------------');


db.sequelize.sync().then((req) => {
    const port = process.env.PORT || 4000;
    const server = app.listen(port, () => {
        console.log(`Listening from port ${port}...`);
    });
});


process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});