const { ObjectId } = require("mongodb");
const constants = require('./constants');
const mongoClient = require("mongodb").MongoClient;
const connect = mongoClient.connect(constants.IP_MONGO, {useNewUrlParser: true,  useUnifiedTopology: true});


module.exports.getDB = function getDB(table, where = {}) {
    return new Promise(function(resolve, reject) {
        connect.then(function(db){
            database = db.db('FormsDrMobile')
            database.collection(table).find(where).toArray(function(err, docs) {
                if (err) {
                    return reject(err)
                }
                return resolve(docs)
            })
        })
    })
}

module.exports.getDBLimited = function getDBLimited(table, where = {}, limit) {
    return new Promise(function(resolve, reject) {
        connect.then(function(db){
            database = db.db('FormsDrMobile')
            database.collection(table).find(where).limit(limit).toArray(function(err, docs) {
                if (err) {
                    return reject(err)
                }
                return resolve(docs)
            })
        })
    })
}

module.exports.getDBLeads = function getDBLeads(table, where = {}, skip = 0, limit = 0) {
    return new Promise(function(resolve, reject) {
        connect.then(function(db){
            database = db.db('FormsDrMobile')
            database.collection(table).find(where).skip(skip * limit).limit(limit).sort({ sortDate: -1 }).toArray(function(err, docs) {
                if (err) {
                    return reject(err)
                }
                return resolve(docs)
            })
        })
    })
}

module.exports.getLead = function getLead(table, where = {}, limit) {
    return new Promise(function(resolve, reject) {
        connect.then(function(db){
            database = db.db('FormsDrMobile')
            database.collection(table).find(where).sort({ sortDate: 1 }).limit(limit).toArray(function(err, docs) {
                if (err) {
                    return reject(err)
                }
                return resolve(docs)
            })
        })
    })
}

module.exports.getDbSorted = function getDbSorted(table, where = {}, sort) {
    return new Promise(function(resolve, reject) {
        connect.then(function(db){
            database = db.db('FormsDrMobile')
            database.collection(table).find(where).sort(sort).toArray(function(err, docs) {
                if (err) {
                    return reject(err)
                }
                return resolve(docs)
            })
        })
    })
}


module.exports.getDBbyID = function getDBbyID(table, id) {
    return new Promise(function(resolve, reject) {
        connect.then(function(db){
            database = db.db('FormsDrMobile')
            database.collection(table).find({ _id: ObjectId(id) }).toArray(function(err, docs) {
                if (err) {
                    return reject(err)
                }
                return resolve(docs)
            })
        })
    })
}

module.exports.insertDB = function insertDB(where, what){
    connect.then(function(db){
        db = db.db('FormsDrMobile')
        db.collection(where).insertOne(what)
    })
}

module.exports.insertDBReturnId = function insertDBReturnId(where, what){
    return new Promise((resolve, reject) => {
        connect.then(function(db){
            db = db.db('FormsDrMobile')
            db.collection(where).insertOne(what, () => {
                resolve(what._id);
            })
        })
    })
}

module.exports.removeDB = function removeDB(table, where) {
    connect.then(function(db){
        if (where.length !== 0) {
            database = db.db('FormsDrMobile')
            database.collection(table).deleteMany(where);
        }
    })
}

module.exports.updateDB = function updateDB(where, what, content){
    return new Promise((resolve, reject) => {
        connect.then(function(db){
            db = db.db('commentsdb')
            db.collection(where).updateOne(what, {$set: content})
            resolve();  
        })
    })
}