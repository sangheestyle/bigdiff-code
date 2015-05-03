// Create collection for MUSE project
// You can use this script at the first setup for mongo
// $ mongo test init.js
conn = new Mongo();
db = conn.getDB('muse');
db.createCollection('repo');
db.repo.ensureIndex({'id': 1}, {unique: true, dropDups: true})
