var express  = require('express');
var path = require('path');
express = require('express');
const cron = require('node-cron');
var NodeAE = require('./sdk/iot-application-services-sdk-nodejs-master');
var nodeAE = new NodeAE();
nodeAE.setBaseURI('appiot-mds');
var app = express();
//const cron = require('cron');
app.listen(process.env.PORT || 8050, function () {
    console.log('philipslightning app is listening on port 8050!');
  });
var thingIdsDemo1 = ["C3549205A6224B28B2F9C74ABBB74F1F","6CD8528F892641C7997C8BB8A2A5722D","F0FBD353DA874A04920B53390EF5E885"];

var getCurrentDateTime = (new Date()).getTime();
var fromDateRange = new Date(getCurrentDateTime);
console.log("from date before any change:"+ fromDateRange);
//var fromDateRange = new Date("2018-04-10T09:45:00.000Z");
var rangeAddition = fromDateRange.getMinutes();
fromDateRange.setMinutes(fromDateRange.getMinutes()-rangeAddition,0,0);
var toDateRange = new Date(fromDateRange);
toDateRange.setMinutes(fromDateRange.getMinutes()+58,59,1000);
console.log(" From Date:  "+ fromDateRange.toISOString()+ "To Date: "+ toDateRange.toISOString());

var cronJobForDemo1CalculatedValues = cron.schedule("0 5 * * * *", function () {
 //   var cronJobForDemo1CalculatedValues = cron.job("* 40 * * * *", function () {    
    thingIdsDemo1.forEach(function(thingId){
        console.log("Runnig for deviceId: "+thingId + " From Date:  "+ fromDateRange.toISOString()+ "To Date: "+ toDateRange.toISOString());
     //   GetMeasuredData(thingId, fromDateRange,toDateRange);
    });
},false);

cronJobForDemo1CalculatedValues.start();

function GetMeasuredData(thingId,fromDateRange,toDateRange){
    var url = CreateMeasuredURLForDemo1(thingId,fromDateRange,toDateRange);
    var loadingThingsRHHueLight = nodeAE.get(url);
    loadingThingsRHHueLight.then(
            function success (oResponse) {
                var data = JSON.parse(oResponse.body);
                if (data.value.length > 0) {
                    var positive = 0;
                    var secondsON = 0;
                    var secondsOFF = 0;
                    var secondsTOTAL = 0;
                    var utilisation = 0;
                    var oDataPayload = {
                        "value": []
                    };
                    for (var i = 1; i < data.value.length; i++) {
                        var oCurrentTimeStamp = data.value[i];
                        var oPreviousTimeStamp = data.value[i - 1];
                        var sCurrentTimeStamp = new Date(oCurrentTimeStamp._time);
                        var sPreviousTimeStamp = new Date(oPreviousTimeStamp._time);
                        var timeDifference = sCurrentTimeStamp - sPreviousTimeStamp;
                        secondsTOTAL = secondsTOTAL + timeDifference;
                        if (oCurrentTimeStamp.status === true) {
                            secondsON = secondsON + timeDifference;
                        } else {
                            secondsOFF = secondsOFF + timeDifference;
                        }
                    }
                    if (secondsON > 0) {
                        utilisation = (secondsON / 3600) * 100;
                    }
    
                    for (var i = 0; i < data.value.length; i++) {
                        if (data.value[i].connected == true && data.value[i].brightness > 0) {
                            var oDataTemplate = {
                                "_time": data.value[i]._time,
                                "Utilisation": utilisation,
                                "PowerConsumptionInCurrentCycle": 0,
                                "PowerTotal24hours": 0,
                                "TimeOn": secondsON,
                                "CurrentPowerConsumption": 0,
                                "PowerTotalWeek": 0
                            };
                        } else {
                            var oDataTemplate = {
                                "_time": data.value[i]._time,
                                "Utilisation": 0,
                                "PowerConsumptionInCurrentCycle": 0,
                                "PowerTotal24hours": 0,
                                "TimeOn": secondsON,
                                "CurrentPowerConsumption": 0,
                                "PowerTotalWeek": 0
                            };
                        }
                        oDataPayload.value.push(oDataTemplate);
                    }
                    UpdateConsumptionDemo1(thingId, oDataPayload);
                }
            },
            function error (err) {
                console.log("Error getting Measured Data: "+err);
            }
    )
};

function UpdateConsumptionDemo1(thingId,oDataPayload){
    var loadingUpdateThings = nodeAE.put(CreateCalculatedURLForDemo1(thingId), oDataPayload)
    loadingUpdateThings.then(
            function success (oResponse) {
            console.log("Data Updated-Demo-1.");
            },
            function error (err) {
                console.log("Error updating Calculated Data: "+err);
            }
)};
function CreateCalculatedURLForDemo1(thingId){
    var urlforCalculatedValue = ('/Things(%27'+thingId+'%27)/hcl.mlai.rhlighttest1:pldemoscreenfields/PLCalculated');
    return urlforCalculatedValue;
};
function CreateMeasuredURLForDemo1(thingId,fromDateRange,toDateRange){
    var urlforMeasuredValue = ('/Things(%27'+thingId+'%27)/hcl.mlai.rhlighttest1:pldemoscreenfields/RHHueLight?timerange='+fromDateRange.toISOString()+'-'+toDateRange.toISOString()+'&$orderby=_time');
    return urlforMeasuredValue;
};
