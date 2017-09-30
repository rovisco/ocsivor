
var map;
var poly;

var anActivity;

class Activity {
    
  constructor(startTime, nrPoints, status, minFrequency ) {
    this._startTime = startTime;
    this._status = status;
    this._distance = 0;
    this._path = "";  
    this._lastUpdateTime = 0;
    this._minFrequency = minFrequency;
    this._watchPositionID = 0;  
    this._points = new Array();  
  }
    //getters
    getStartTime() {return this._startTime;}
    getDistance() {return this._distance;}
    getNrPoints() {return this._routePoints.length();}
    getStatus() {return this._status;}
    getPath() {return this._path;}
    getWatchPositionID(){return this._watchPositionID;}
    getLastUpdateTime(){return this._lastUpdateTime;}
    getMinFrequency(){return this._minFrequency;}
    getPoints(){return this._points;}
    getStartTimeFormatted() {return (moment(this._startTime).format('HH:mm:ss')); }
    getDuration(){ return(timeDiff(this._startTime,this._lastUpdateTime));}
    
    //setters
    setStatus(status){this._status = status;}
    setPath(path){this._path = path;} 
    setLastUpdateTime(updateTime){this._lastUpdateTime = updateTime;}
    setWatchPositionID(watchPositionID){this._watchPositionID = watchPositionID;}
      
    getAvgSpeed(){
        var speed = 0;
        var duration = timeDiffSeconds(this._startTime,this._lastUpdateTime);
        var distance = 0;
        
        if(this._points.length >0 && duration > 0){
            var lastPoint = this._points[this._points.length - 1];
            distance = lastPoint.distance;
            speed = distance/duration; // meters per second
            speed = Math.round(speed *3.6 *100)/100; //km per hour , rounded to 2 decimal
        }
        //console.log("Avr Speed="+ speed);
        return(speed);     
    }
    
    canAddPoint(location){
        
        var now = new Date();
        if( this._lastUpdateTime && now.getTime() - this._lastUpdateTime.getTime() < this._minFrequency){
            //console.log("Ignoring position update"+now.toString()+" Lat:"+location.coords.latitude +" Long :"+location.coords.longitude );
            return false;
        }else if(this._status != "active"){
            console.log("Ignoring position update : Not active");
            return false;
        }else{
            return true;
        }    
    }
    
    addPoint(location,distance,eventType){
        console.dir(location);
        if (this.canAddPoint(location)==true){
            var now = new Date(); 
            var duration = timeDiff(this._startTime, now);
            this._lastUpdateTime = now;
            this._distance=distance;
            
            var lastPoint = null;
            var deltaTime = 0;
            var deltaDistance = 0;
            var speed = 0;
            var speedRead = 0;
            var altitude = 0;
            var accuracy = 0;
            var altitudeAccuracy =0;
            
            if(location.coords.altitude) altitude = Math.round(location.coords.altitude);
            if(location.coords.speed) speedRead = Math.round(location.coords.speed *3.6 *100)/100;
            if(location.coords.accuracy) accuracy = Math.round(location.coords.accuracy);
            if(location.coords.altitudeAccuracy) altitudeAccuracy = Math.round(location.coords.altitudeAccuracy);
            
            if(this._points.length >0){
                lastPoint = this._points[this._points.length - 1];
                deltaTime = timeDiffSeconds(lastPoint.time,now) ;
                deltaDistance = distance - lastPoint.distance;
                
                if(deltaTime>0){
                    speed = deltaDistance/deltaTime; // meters per second
                    speed = Math.round(speed *3.6 *100)/100; //km per hour , rounded to 2 decimal                   
                }
            }
            
              
            var point ={
                timeString : moment().format('HH:mm:ss'),
                time : now,
                duration : duration,
                distance : distance,
                deltaTime : deltaTime,
                deltaDistance : deltaDistance,
                speed : speed,
                speedRead : speedRead,
                altitude : altitude,
                accuracy : accuracy,
                altitudeAccuracy : altitudeAccuracy,
                eventType : eventType,
                latitude: location.coords.latitude,
                longitude: location.coords.longitude 
            }
            this._points.push(point);    
        }
        
        this.getAvgSpeed();
        
        return true;
    }    
    
}//Activity Class


function uploadActivity(activity){
    
    var now = new Date();
    
    var data0 = {name: "activityName"+now.getTime(), 
                 startTime : activity.getStartTime(),
                 stopTime : activity.getLastUpdateTime(),
                 distance : activity.getDistance(),
                 duration : activity.getDuration(),
                 path : activity.getPath()
                 };
    
    var jsonData = JSON.stringify(data0); 
    
    console.log("data JSON="+jsonData);
    
    $.ajax({
        type: "POST",
        url: "/maps/upload",
        data: jsonData,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(res){
            console.log("res=",JSON.stringify(res));
            var contents = new EJS({url: '../templates/message.ejs'}).render(res);
            $('#modalMessageBody').html(contents);
        }
    });
}

function timeDiff(start,end){
    var ms = moment(end).diff(moment(start));
    var d = moment.duration(ms);  
    var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
    return(s);    
}

function timeDiffSeconds(start,end){
    var ms = moment(end).diff(moment(start));
    var d = moment.duration(ms).asSeconds();  
    return(d);    
}

$(document).ready(function(){ 
	$("#StartActivityButton").show();
    $("#ResumeActivityButton").hide();
	$("#PauseActivityButton").hide();
    $("#StopActivityButton").hide();
    
});

function changeActivityStatus(action){

    switch(action)
    {
        case "start": 
            $("#StartActivityButton").hide();
            $("#PauseActivityButton").show();
            $("#StopActivityButton").show();    
            
            console.log("activity started");
            anActivity = new Activity(new Date(),0,"active",10000);
            
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(startActivity,handle_errors);
            } else {
                var contents = new EJS({url: '../templates/error.ejs'}).render({error : "Geolocation is not supported." });
                $('#routeList-table').html(contents);
            }  
            
            console.dir(anActivity);
            break;

        case "resume":
            $("#StartActivityButton").hide();
            $("#ResumeActivityButton").hide();
            $("#PauseActivityButton").show();
            $("#StopActivityButton").show();
            //if (anActivity) anActivity.setStatus("active");
            console.log("activity resumed");
            console.dir(anActivity);
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(pauseActivity,handle_errors);
            } else {
                var contents = new EJS({url: '../templates/error.ejs'}).render({error : "Geolocation is not supported." });
                $('#routeList-table').html(contents);
            }  
        break;
            
        case "pause":     
            $("#StartActivityButton").hide();
            $("#ResumeActivityButton").show();
            $("#PauseActivityButton").hide();
            $("#StopActivityButton").show();
            //if (anActivity) anActivity.setStatus("paused");
            console.log("activity paused");
            console.dir(anActivity);
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(pauseActivity,handle_errors);
            } else {
                var contents = new EJS({url: '../templates/error.ejs'}).render({error : "Geolocation is not supported." });
                $('#routeList-table').html(contents);
            }  
        break;

        case "stop": 
            
            var contents = new EJS({url: '../templates/maps/confirmStopModal.ejs'}).render();
            $('#modal-template').html(contents);
            $('#confirmStopModal').modal();
        break;            

        default: 
        break;
    }    
    
}

function stopActivity(){
    $('#confirmStopModal').modal('hide');
    $("#StartActivityButton").show();
    $("#ResumeActivityButton").hide();
    $("#PauseActivityButton").hide();
    $("#StopActivityButton").hide();
    if (anActivity){
        anActivity.setStatus("finished");    
        navigator.geolocation.clearWatch(anActivity.getWatchPositionID());
        console.log("activity finished");
        uploadActivity(anActivity);
        //clear polyline -to do
    }     
}


function startActivity(location){  
    
    console.log("Start Activity: lat="+location.coords.latitude +" long="+ location.coords.longitude);
    
    var path = poly.getPath();
    path.push(new google.maps.LatLng(location.coords.latitude, location.coords.longitude));
    
    anActivity.addPoint(location,0,"start"); 

    var marker = new google.maps.Marker({
        position: {lat: location.coords.latitude, lng: location.coords.longitude},
        map: map,
        icon : {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 4,
            fillColor: 'green',
            strokeColor: 'green',
            fillOpacity: 0.8,
            strokeWeight: 2 
          },
        title: anActivity.getDuration()
    });

    marker.setMap(map);            

    var activityStartTime="Started at "+anActivity.getStartTimeFormatted();
    var contents = new EJS({url: '../templates/maps/routeList.ejs'}).render({ points : anActivity.getPoints(), startTime : activityStartTime , speed : " " });
    $('#routeList-table').html(contents); 

    map.setCenter({lat: location.coords.latitude, lng: location.coords.longitude}); 
    
    //Watch from location updates
    var watchOptions = { timeout : 60*60*1000, maxAge: 0, enableHighAccuracy: true }           
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(handleGetCurrentPosition,handle_errors);
        var watchPositionID=navigator.geolocation.watchPosition(handleGetCurrentPosition,handle_errors,watchOptions);
        anActivity.setWatchPositionID(watchPositionID);
    } else {
        var contents = new EJS({url: '../templates/error.ejs'}).render({error : "Geolocation is not supported by this browser." });
        $('#routeList-table').html(contents);
    }  
    
}


function pauseActivity(location){  
    
    var markerColor ="black";
    console.log("Pause/Resume Activity");
    
    if(anActivity.getStatus()=="paused"){
        console.log("Pause Activity: lat="+location.coords.latitude +" long="+ location.coords.longitude);
        markerColor ="yellow";
        anActivity.setStatus("active");
        
    }else if (anActivity.getStatus()=="active") {
        console.log("Pause Activity: lat="+location.coords.latitude +" long="+ location.coords.longitude);
        markerColor ="orange";
        anActivity.setStatus("paused");
    }
    
    
    var path = poly.getPath();
    path.push(new google.maps.LatLng(location.coords.latitude, location.coords.longitude));

    var meters =Math.round(google.maps.geometry.spherical.computeLength(path));          
    var encodedPath = google.maps.geometry.encoding.encodePath(path);
    
    anActivity.setPath(encodedPath);
    anActivity.addPoint(location,meters,anActivity.getStatus()); 
    
    var speed = "Average Speed is "+anActivity.getAvgSpeed()+ " Km/h";

    var marker = new google.maps.Marker({
        position: {lat: location.coords.latitude, lng: location.coords.longitude},
        map: map,
        icon : {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 4,
            fillColor: markerColor,
            strokeColor: markerColor,
            fillOpacity: 0.8,
            strokeWeight: 2 
          },
        title: anActivity.getDuration()
    });

    marker.setMap(map);            

    var activityStartTime="Started at "+anActivity.getStartTimeFormatted();
    var contents = new EJS({url: '../templates/maps/routeList.ejs'}).render({ points : anActivity.getPoints(), startTime : activityStartTime , speed : speed });
    $('#routeList-table').html(contents); 

    map.setCenter({lat: location.coords.latitude, lng: location.coords.longitude}); 
    
}

//
function handleGetCurrentPosition(location){

    //console.log("LOCATION UPDATE");
    
    var activityStartTime = "Not Started ";
    if(anActivity){
  
        var pointAdded = false;
        pointAdded = anActivity.canAddPoint(location);
        
        if (pointAdded==true){
            
            var path = poly.getPath();

            path.push(new google.maps.LatLng(location.coords.latitude, location.coords.longitude));
            
            var meters =Math.round(google.maps.geometry.spherical.computeLength(path));          
            
            var encodedPath = google.maps.geometry.encoding.encodePath(path);
            console.log(" encoded path="+encodedPath);
            
            //var decodedPath = google.maps.geometry.encoding.decodePath(encodedPath);
            //console.dir(decodedPath);
    
            anActivity.setPath(encodedPath);
            anActivity.addPoint(location,meters,"update"); 
            
            var speed = "Average Speed is "+anActivity.getAvgSpeed()+ " Km/h";
            console.log(anActivity);
            
            var marker = new google.maps.Marker({
                position: {lat: location.coords.latitude, lng: location.coords.longitude},
                map: map,
                icon : {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 4,
                    fillColor: 'blue',
                    strokeColor: 'blue',
                    fillOpacity: 0.8,
                    strokeWeight: 2 
                  },
                title: anActivity.getDuration()
            });

            marker.setMap(map);            
            
            var activityStartTime="Started at "+anActivity.getStartTimeFormatted();
            var contents = new EJS({url: '../templates/maps/routeList.ejs'}).render({ points : anActivity.getPoints(), startTime : activityStartTime , speed : speed });
            $('#routeList-table').html(contents); 
            
            map.setCenter({lat: location.coords.latitude, lng: location.coords.longitude});         
        }
    }   
}


function centerMap(location){    
    map.setCenter({lat: location.coords.latitude, lng: location.coords.longitude});
}

function initMap() {
    //if(navigator.geolocation) navigator.geolocation.getCurrentPosition(handleGetCurrentPosition, handle_errors);
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15
    });
       
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(centerMap,handle_errors);
    } else {
        var contents = new EJS({url: '../templates/error.ejs'}).render({error : "Geolocation is not supported by this browser." });
        $('#routeList-table').html(contents);
    }  
      
    poly = new google.maps.Polyline({
        strokeColor: '#000000',
        strokeOpacity: 1.0,
        strokeWeight: 3
    });  
      
    poly.setMap(map);
    
    var trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);

}



 function handle_errors(error){
    var errorMsg ="geoloc error"; 
    switch(error.code)
    {
        case error.PERMISSION_DENIED: errorMsg = "user did not share geolocation data";
        break;
        case error.POSITION_UNAVAILABLE: errorMsg = "could not detect current position";
        break;
        case error.TIMEOUT: errorMsg = "retrieving position timed out";
        break;
        default: errorMsg = "unknown error";
        break;
    }
    var contents = new EJS({url: '../templates/error.ejs'}).render({error : errorMsg });
    $('#routeList-table').html(contents); 
     
}