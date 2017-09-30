var mongoose = require('mongoose'),
	bcrypt = require('bcrypt-nodejs'),
	SALT_WORK_FACTOR = 10;
exports.mongoose = mongoose;

var db_name = "/nodejs";


// mongodb://userNOA:VtlhEVTmBaWh0k3F@mongodb/nodejs

// Database connect
var uristring = 'mongodb://localhost/test';

//openshift env vars when available:
if(process.env.OPENSHIFT_MONGODB_DB_URL){
  uristring = process.env.OPENSHIFT_MONGODB_DB_URL + db_name;
}

// Database connect
//var uristring =  process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/test';

var mongoOptions = { db: { safe: true }};

mongoose.connect(uristring, mongoOptions, function (err, res) {
  if (err) { 
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log ('Successfully connected to: ' + uristring);
  }
});

//******* Database schema TODO add more validation
var Schema = mongoose.Schema, 
	ObjectId = Schema.ObjectId;

// User schema
var userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true},
  admin: { type: Boolean, required: true },
  accessToken: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }    
});


// Bcrypt middleware
userSchema.pre('save', function(next) {

	var user = this;
	
	if(!user.isModified('password')) return next();
	
	//user.password = bcrypt.hashSync(user.password);
	
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if(err) return next(err);

		bcrypt.hash(user.password, salt, null, function(err, hash) {
			if(err) return next(err);
			user.password = hash;
			next();
		});
	
	});
	
});

// Password verification
userSchema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if(err) return cb(err);
		cb(null, isMatch);
	});
};


// Remember Me implementation helper method
userSchema.methods.generateRandomToken = function () {
  var user = this,
      chars = "_!abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
      token = new Date().getTime() + '_';
  for ( var x = 0; x < 16; x++ ) {
    var i = Math.floor( Math.random() * 62 );
    token += chars.charAt( i );
  }
  return token;
};

// Export user model
var userModel = mongoose.model('User', userSchema);
exports.userModel = userModel;
