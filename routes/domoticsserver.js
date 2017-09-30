var request = require('superagent');
var fs = require('fs');

exports.home = function(req, res) {
    var arduinoIPAddress = "0.0.0.0";
    fs.readFile('config/config.json', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        
        var arduinoQuery = "http://"+JSON.parse(data).arduinoIP+"/readSwitch11";
        console.log("get plug status="+arduinoQuery);
        
        request
            .get(arduinoQuery)
            .accept('json')
            .end(function(result1){
                if (result1.error) {
                    console.log('oh no ' + result1.error.message);
                } else {
                    console.log('got ' + result1.status + ' response');
                    console.log(result1.body);
                    res.render('domotics/home', { user: req.user , powerPlug: result1.body });
                }
            });
        });
};

exports.turn = function(req, res) {
    var arduinoIPAddress = "0.0.0.0";
    fs.readFile('config/config.json', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        configData = JSON.parse(data);
        arduinoIPAddress=configData.arduinoIP;
        console.log(" ipaddress="+configData.arduinoIP);
        var plugName = req.params.plug;
        var status= req.params.status;
        console.log("Domotics: Turn "+plugName+" "+status);

        if(!plugName || !status) return next("missing data");
        var arduinoQuery = "http://"+arduinoIPAddress;

        if(plugName == "plug1" && status== "on")  arduinoQuery = arduinoQuery +"/setSwitch11On";
        else if (plugName == "plug1" && status== "off")  arduinoQuery = arduinoQuery +"/setSwitch11Off";
        console.log("ArduinoQuery="+ arduinoQuery);

        request
            .get(arduinoQuery)
            .accept('json')
            .end(function(result1){
                if (result1.error) {
                    console.log('oh no ' + result1.error.message);
                } else {
                    console.log('got ' + result1.status + ' response');
                    console.log(result1.body);
                    res.render('domotics/home', { user: req.user , powerPlug: result1.body });
                }
            });
        });
    
    
};