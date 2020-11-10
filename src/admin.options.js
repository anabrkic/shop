const { default: AdminBro } = require('admin-bro');
const AdminBroMongoose = require('admin-bro-mongoose');

const mongoose = require('mongoose');
AdminBro.registerAdapter(AdminBroMongoose);


/** @tipe {import('admin-bro').AdminBroOptions} */
const options = {
    databases: [mongoose],
    branding: {
        logo: 'https://icon-library.com/images/accessories-icon-png/accessories-icon-png-19.jpg',
        companyName: 'Admin panel - Online store',
    }
};
/*dodati za korisnike i narudžbe i status narudžbe*/
/*korisniku omogućiti tijek narudžbe */ 
/*pristup profil podacima */
module.exports = options;