import Localbase from 'localbase';

const db = new Localbase('LMSDatabase');
// db.config.debug = false; // Disable debug logs

// Initialize stores
db.collection('courses');
db.collection('units');
db.collection('chapters');
db.collection('progress');
db.collection('users');

export default db;