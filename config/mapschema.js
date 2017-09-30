var mongoose = require('mongoose');

//******* Database schema
var Schema = mongoose.Schema, 
	ObjectId = Schema.ObjectId;

// User schema
var activitySchema = new Schema({
    name: { type: String, required: true },
    startTime: { type: Date, required: true },    
    stopTime: { type: Date },
    path: { type: String},
    distance : { type: String},
    duration : { type: String},   
    events: [{ type : String, lat: String, long: String, time: Date }]
});


// Export user model
var activityModel = mongoose.model('Activity', activitySchema);
exports.activityModel = activityModel;
