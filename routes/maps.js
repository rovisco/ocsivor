var db = require('../config/mapschema');
var polyline = require('polyline');
 
exports.home = function(req, res) {
   res.render('maps/home', { user: req.user });
};

exports.upload = function(req, res, next) {
  	 
    console.log('Processing activity upload ' + JSON.stringify(req.body));

    //console.log('Processing activity upload 2 ' + JSON.parse(req.body));
    
    //var activity = JSON.parse(req.body);
    
    console.log("name="+ req.body.name+" Start time="+req.body.startTime);
    
    //res.send({ result: 'success', message : 'User registered with success'});
    //res.render('maps/home', { user: req.user });
    
    
    db.activityModel.findOne( { name: req.body.name }, function (err, existingUser) {
      if (err) { 
		res.send({ result: 'error', message : 'database error'}); 
		return;
		//return next( err ); 
	  }
      if (existingUser) {
		  res.send({ result: 'error', message : 'activity already exists'}); 
		  console.log("activity exits");
		  return;
      } else {
          
            // returns an array of lat, lon pairs 
          //polyline.decode('_p~iF~ps|U_ulLnnqC_mqNvxq`@');
 
          // returns a string-encoded polyline 
          //polyline.encode([[38.5, -120.2], [40.7, -120.95], [43.252, -126.453]]);  
	
		var activity = new db.activityModel({ name: req.body.name
                                        , startTime: req.body.startTime
                                        , stopTime : req.body.stopTime
                                        , distance : req.body.distance
                                        , duration : req.body.duration
                                        , path : req.body.path
                                        });

        activity.save( function (err) {
          if (err) {
			res.send({ result: 'error', message : 'database error saving activity'}); 
			//return next(err);
			return;
		}
		 
		  console.log('activity created'+activity.get('name'));
		  res.send({ result: 'success', message : 'activity registered with success'});
        })
      }
	  
    });
    

};
