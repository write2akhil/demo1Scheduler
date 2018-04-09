var express  = require('express');
var path = require('path');
express = require('express');
var schedule = require('node-schedule');
const cron = require('cron');
var app = express();
app.listen(process.env.PORT || 8050, function () {
    console.log('philipslightning app is listening on port 8050!');
  });

 var NodeAE = require('./sdk/iot-application-services-sdk-nodejs-master');
 var nodeAE = new NodeAE();
 nodeAE.setBaseURI('appiot-mds');
 //const cron = require('cron');

 var thingIdsDemo1 = ["C3549205A6224B28B2F9C74ABBB74F1F","6CD8528F892641C7997C8BB8A2A5722D","F0FBD353DA874A04920B53390EF5E885"];
 var thingIdsDemo2 = ["FC8F333992A34B25BA9D8119D72EE155","52390BFFB7FE4F8C9C6B926AA5402FE8","4B5060B173CD40A1A000D6B21BA63BB7"];

 var startTime = new Date(Date.now());
 var endTime = new Date(startTime.getTime() + 100000000000000);
 
 var j = schedule.scheduleJob({ start: startTime, end: endTime, rule: '*/1000 * * * * *' }, function(){
    var sThingId = "C3549205A6224B28B2F9C74ABBB74F1F";
    var d = new Date();
    var hour_date = d.toISOString();
           var fromDate = new Date(hour_date);
           fromDate.setHours(fromDate.getHours() +1);
           console.log("Running For DeviceId: " +"C3549205A6224B28B2F9C74ABBB74F1F" + " For Duration between: "+hour_date+ "TO: "+ fromDate.toISOString()  );
   var url = ('/Things(%27'+sThingId+'%27)/hcl.mlai.rhlighttest1:pldemoscreenfields/RHHueLight?timerange='+hour_date+'-'+fromDate.toISOString()+'&$orderby=_time&$filter=brightness gt 0');
   //var url = ('/Things(%27'+sThingId+'%27)/hcl.mlai.rhlighttest1:pldemoscreenfields/RHHueLight?timerange=2018-04-09T11:25:00.295Z-2018-04-09T12:25:00.295Z&$orderby=_time&$filter=brightness gt 0');

            var loadingThingsRHHueLight = nodeAE.get(url);
            loadingThingsRHHueLight.then(
                function success (oResponse) {
                 var data = JSON.parse(oResponse.body);
                 console.log(data);
                 if(data.value.length>0){
                 var positive=0;
                for(var i=0;i<data.value.length;i++)
                {
                    if(i<data.value.length-1)
                    {
                        var fromDate = new Date(data.value[i+1]._time);
                        var toDate = new Date(data.value[i]._time);
                        var diff =  fromDate-toDate ;
                        var seconds = Math.floor(diff / (1000));
                        diff -= seconds * (1000);
                        positive +=seconds;
                    }
                }
   
                var result = 0;
                if(positive>0)
                {
                    result=  (positive/ 3600) * 100;
                }
   
                for(var i=0;i<data.value.length;i++)
                {
                    if(data.value[i].connected==true && data.value[i].brightness>0)
                    {
                    var powerConsumptionCurrent=data.value[i].brightness;
                    var power24Hours=powerConsumptionCurrent*1440;
                    var powerTotalWeek=power24Hours*7;
                    var powerConsumptionCurrentCycle=powerTotalWeek*4;
   
                        var oDataPayload ={
                        "value": [
                        {
                            "_time": data.value[i]._time,
                            "Utilisation": result,
                            "PowerConsumptionInCurrentCycle": powerConsumptionCurrentCycle,
                            "PowerTotal24hours": power24Hours,
                            "TimeOn": Math.floor(result / 60),
                            "CurrentPowerConsumption": powerConsumptionCurrent,
                            "PowerTotalWeek": powerTotalWeek
                        }
                        ]
                        }
   
                        UpdateConsumptionDemo1(sThingId,oDataPayload);
                    }
   
                }
               }
                },
                function error (err) {
                   console.log(err)
                }
            )
      }); 

     

 function UpdateConsumptionDemo1(thingId,oDataPayload){

   var loadingUpdateThings = nodeAE.put('/Things(%27'+thingId+'%27)/hcl.mlai.rhlighttest1:pldemoscreenfields/PLCalculated', oDataPayload)
   loadingUpdateThings.then(
         function success (oResponse) {
          console.log("Data Updated-Demo-1.");
         },
         function error (err) {
          console.log(err);
         }
   )
 }
 function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}
 var cronJobForDemo1Device2 = cron.job("*/60 * * * * *", function () {
   // thingIdsDemo1.forEach(function(thingId){
 var d = new Date();
 var hour_date = d.toISOString();
        var fromDate = new Date(hour_date);
        var sThingId = "6CD8528F892641C7997C8BB8A2A5722D";
        fromDate.setHours(fromDate.getHours() +1);
        console.log("Running For DeviceId: " +"6CD8528F892641C7997C8BB8A2A5722D" + " For Duration between: "+hour_date+ "TO: "+ fromDate.toISOString()  );
var url = ('/Things(%27'+sThingId+'%27)/hcl.mlai.rhlighttest1:pldemoscreenfields/RHHueLight?timerange='+hour_date+'-'+fromDate.toISOString()+'&$orderby=_time&$filter=brightness gt 0');

         var loadingThingsRHHueLight = nodeAE.get(url);
         loadingThingsRHHueLight.then(
             
             function success (oResponse) {
               
              var data = JSON.parse(oResponse.body);
              console.log(data.value.length+"----"+" ----   "+"6CD8528F892641C7997C8BB8A2A5722D");
              if(data.value.length>0){
              var positive=0;
             for(var i=0;i<data.value.length;i++)
             {
                 if(i<data.value.length-1)
                 {
                     var fromDate = new Date(data.value[i+1]._time);
                     var toDate = new Date(data.value[i]._time);
                     var diff =  fromDate-toDate ;
                     var seconds = Math.floor(diff / (1000));
                     diff -= seconds * (1000);
                     positive +=seconds;
                 }
             }

             var result = 0;
             if(positive>0)
             {
                 result=  (positive/ 3600) * 100;
             }

             for(var i=0;i<data.value.length;i++)
             {
                 if(data.value[i].connected==true && data.value[i].brightness>0)
                 {
                 var powerConsumptionCurrent=data.value[i].brightness;
                 var power24Hours=powerConsumptionCurrent*1440;
                 var powerTotalWeek=power24Hours*7;
                 var powerConsumptionCurrentCycle=powerTotalWeek*4;

                     var oDataPayload ={
                     "value": [
                     {
                         "_time": data.value[i]._time,
                         "Utilisation": result,
                         "PowerConsumptionInCurrentCycle": powerConsumptionCurrentCycle,
                         "PowerTotal24hours": power24Hours,
                         "TimeOn": Math.floor(result / 60),
                         "CurrentPowerConsumption": powerConsumptionCurrent,
                         "PowerTotalWeek": powerTotalWeek
                     }
                     ]
                     }

                     UpdateConsumptionDemo1(sThingId,oDataPayload);
                 }

             }
            }
             },
             function error (err) {
                console.log(err)
             }
         )


      // })
      });
      
      var cronJobForDemo1Device3 = cron.job("*/60 * * * * *", function () {
        // thingIdsDemo1.forEach(function(thingId){
      var d = new Date();
      var hour_date = d.toISOString();
             var fromDate = new Date(hour_date);
             fromDate.setHours(fromDate.getHours() +1);
             var sThingId = "F0FBD353DA874A04920B53390EF5E885";
             console.log("Running For DeviceId: " +"F0FBD353DA874A04920B53390EF5E885" + " For Duration between: "+hour_date+ "TO: "+ fromDate.toISOString()  );
     var url = ('/Things(%27'+sThingId+'%27)/hcl.mlai.rhlighttest1:pldemoscreenfields/RHHueLight?timerange='+hour_date+'-'+fromDate.toISOString()+'&$orderby=_time&$filter=brightness gt 0');
              var loadingThingsRHHueLight = nodeAE.get(url);
              loadingThingsRHHueLight.then(
                  function success (oResponse) {
                   var data = JSON.parse(oResponse.body);
                   console.log(data.value.length+"----"+" ----   "+"F0FBD353DA874A04920B53390EF5E885");
                   if(data.value.length>0){
                   var positive=0;
                  for(var i=0;i<data.value.length;i++)
                  {
                      if(i<data.value.length-1)
                      {
                          var fromDate = new Date(data.value[i+1]._time);
                          var toDate = new Date(data.value[i]._time);
                          var diff =  fromDate-toDate ;
                          var seconds = Math.floor(diff / (1000));
                          diff -= seconds * (1000);
                          positive +=seconds;
                      }
                  }
     
                  var result = 0;
                  if(positive>0)
                  {
                      result=  (positive/ 3600) * 100;
                  }
     
                  for(var i=0;i<data.value.length;i++)
                  {
                      if(data.value[i].connected==true && data.value[i].brightness>0)
                      {
                      var powerConsumptionCurrent=data.value[i].brightness;
                      var power24Hours=powerConsumptionCurrent*1440;
                      var powerTotalWeek=power24Hours*7;
                      var powerConsumptionCurrentCycle=powerTotalWeek*4;
     
                          var oDataPayload ={
                          "value": [
                          {
                              "_time": data.value[i]._time,
                              "Utilisation": result,
                              "PowerConsumptionInCurrentCycle": powerConsumptionCurrentCycle,
                              "PowerTotal24hours": power24Hours,
                              "TimeOn": Math.floor(result / 60),
                              "CurrentPowerConsumption": powerConsumptionCurrent,
                              "PowerTotalWeek": powerTotalWeek
                          }
                          ]
                          }
     
                          UpdateConsumptionDemo1(sThingId,oDataPayload);
                      }
     
                  }
                 }
                  },
                  function error (err) {
                     console.log(err)
                  }
              )
     
     
           // })
           });

  var cronJobForDemo2 = cron.job("*/60 * * * * *", function () {
    thingIdsDemo2.forEach(function(thingId){
        var d = new Date();
        var hour_date = d.toISOString() ;
        var fromDate = new Date(hour_date);
        fromDate.setHours(fromDate.getHours() + 1);
        //console.log("Running For DeviceId: " +thingId + " For Duration between: "+ hour_date  + "TO: "+fromDate.toISOString() );
        var loadingThingsRHHueLight = nodeAE.get('/Things(%27'+thingId+'%27)/hcl.mlai.highclaritylightning:highclaritylight/hclight?timerange='+fromDate.toISOString()+'-'+hour_date+'&$orderby=_time&$filter=brightness gt 0');
        loadingThingsRHHueLight.then(
            function success (oResponse) {
             var data = JSON.parse(oResponse.body);

             if(data.value.length>0){
             var positive=0;
             var red=0;
             var green=0;
             var blue=0;

           for(var i=0;i<data.value.length;i++)
            {
                if(i<data.value.length-1)
                {
                    var fromDate = new Date(data.value[i+1]._time);
                    var toDate = new Date(data.value[i]._time);
                    var diff =  fromDate-toDate ;
                    var seconds = Math.floor(diff / (1000));
                    diff -= seconds * (1000);
                    positive +=seconds;

                    if(data.value[i].brightness>0)
                    {
                        var colorName= FindTheColor(data.value[i].color_x,data.value[i].color_y,data.value[i].brightness);
                        if (colorName=="Red")
                        {
                            red+=1
                        }
                        else if (colorName=="Green")
                        {
                            green+=1
                        }
                        else
                        {
                            blue+=1
                        }
                    }

                }
            }

            var result = 0;
            if(positive>0)
            {
                result=  (positive/ 3600) * 100;
            }
            var redColorUtilisation= (red/(red+green+blue)) * 100;
            var greenColorUtilisation= (green/(red+green+blue)) * 100;
            var blueColorUtilisation = (blue/(red+green+blue)) * 100;
            var minRedActive =(redColorUtilisation / 100) * 3600;
            var minGreenActive =(greenColorUtilisation / 100) * 3600;
            var minBlueActive =(blueColorUtilisation / 100) * 3600;
            for(var i=0;i<data.value.length;i++)
            {
                if(data.value[i].connected==true && data.value[i].brightness>0)
                {
                var powerConsumptionCurrent=data.value[i].brightness;
                var power24Hours=powerConsumptionCurrent*1440;
                var powerTotalWeek=power24Hours*7;
                var powerConsumptionCurrentCycle=powerTotalWeek*4;

                    var oDataPayload ={
                    "value": [
                    {
                        "_time": data.value[i]._time,
                        "Utilisation": result,
                        "PowerConsumptionInCurrentCycle": powerConsumptionCurrentCycle,
                        "PowerTotal24hours": power24Hours,
                        "TimeOn": Math.floor(result / 60),
                        "CurrentPowerConsumption": powerConsumptionCurrent,
                        "PowerTotalWeek": powerTotalWeek,
                        "UtilisationRedClr":redColorUtilisation,
                        "UtilisationGreenClr":greenColorUtilisation,
                        "UtilisationBlueClr":blueColorUtilisation,
                        "MinutesRedActive": Math.floor(minRedActive/60),
                        "MinutesGreenActive": Math.floor(minGreenActive/60),
                        "MinutesBlueActive": Math.floor(minBlueActive/60)
                    }
                    ]
                    }

                    UpdateConsumption(thingId,oDataPayload);
                }

            }
          }
            },
            function error (err) {
                console.log(err)
            }
        )


      });
});

function UpdateConsumptionDemo2(thingId,oDataPayload){

    
  var loadingUpdateThings = nodeAE.put('/Things(%27'+thingId+'%27)/hcl.mlai.highclaritylightning:highclaritylight/PLCalculated', oDataPayload)
  loadingUpdateThings.then(
    function success (oResponse) {
      console.log("Data Updated-Demo-2");
    },
    function error (err) {
     console.log(err);
    }
  )};

  function FindTheColor(xInString,yInString,brightness)
{

    var x = parseFloat(xInString);
    var y = parseFloat(yInString);

    z = 1.0 - x - y;
    Y = brightness / 255.0;
    X = (Y / y) * x;
    Z = (Y / y) * z;
    r = X * 1.612 - Y * 0.203 - Z * 0.302;
    g = -X * 0.509 + Y * 1.412 + Z * 0.066;
    b = X * 0.026 - Y * 0.072 + Z * 0.962;
    r = r <= 0.0031308 ? 12.92 * r : (1.0 + 0.055) * Math.pow(r, (1.0 / 2.4)) - 0.055;
    g = g <= 0.0031308 ? 12.92 * g : (1.0 + 0.055) * Math.pow(g, (1.0 / 2.4)) - 0.055;
    b = b <= 0.0031308 ? 12.92 * b : (1.0 + 0.055) * Math.pow(b, (1.0 / 2.4)) - 0.055;
    maxValue = Math.max(r, g, b);
    r /= maxValue;
    g /= maxValue;
    b /= maxValue;
    r = r * 255;
    if (r < 0) {
                    r = 255
    };
    g = g * 255;
    if (g < 0) {
                    g = 255
    };
    b = b * 255;
    if (b < 0) {
                    b = 255
    };


    if(r>g && r>b)
    {
        return "Red";
    }
    else if(g>r && g>b)
    {
        return "Green";
    }
    else
    {
        return "Blue";
    }

}

var cronJobForDemo1Device1Zero = cron.job("*/60 * * * * *", function () {
    var sThingId = "6CD8528F892641C7997C8BB8A2A5722D";
    var sCurrentTimeStampInMS = (new Date()).getTime();
    var sTimeFromMS = sCurrentTimeStampInMS - (2 * 60000);//"2018-04-01T00:00:30.000Z";
    var sTimeToMS = sCurrentTimeStampInMS - (1 * 60000); //"2018-04-01T07:00:00.000Z";
    var sTimeFrom = (new Date(sTimeFromMS)).toISOString();
    var sTimeTo = (new Date(sTimeToMS)).toISOString();
    var sURL = "/Things('" + sThingId + "')/hcl.mlai.rhlighttest1:pldemoscreenfields/RHHueLight?timerange=" + sTimeFrom + "-" + sTimeTo + "&$orderby=_time";
   // console.log("Device 1 - URL to fetch TimeSeries data = " + sURL);
    var loadingThings = nodeAE.get(sURL);
    loadingThings.then(
        function success(oResponse) {
            var oParsedBodyResponse = JSON.parse(oResponse.body);
            //console.log(oParsedBodyResponse);
            var oDate = new Date();
          //  console.info('Device 1 - cron job completed at time = ' + oDate + " & Total records found are = " + oParsedBodyResponse.value.length);

            // Condition: If no records: inject a dummy one
            if (oParsedBodyResponse.value.length === 0) {
                var toBeInsertedTimeFrom = (new Date(sTimeFromMS + 5000)).toISOString();
                var toBeInsertedTimeTo = (new Date(sTimeToMS - 5000)).toISOString();
                //console.log("Device 1 - PI is off; Scheduler go and insert the data !")
                var oDefaultPayload = {
                    "value": [
                        {
                            "_time": toBeInsertedTimeFrom,
                            "connected": false,
                            "rhtest1lighttemp": 0,
                            "brightness": 0,
                            "status": false
                        },
                        {
                            "_time": toBeInsertedTimeTo,
                            "connected": false,
                            "rhtest1lighttemp": 0,
                            "brightness": 0,
                            "status": false
                        }
                    ]

                };

                var sURLForCreate = "/Things('" + sThingId + "')/hcl.mlai.rhlighttest1:pldemoscreenfields/RHHueLight";
                var insertMissingTimeStamp = nodeAE.put(sURLForCreate, oDefaultPayload);
                insertMissingTimeStamp.then(
                    function success(oResponse) {
                        //console.log("Device 1 -Default record inserted; Booyah !!!!s");
                    },
                    function error(err) {
                      //  console.log("Device 1 -Error In Default record insertion;  super crap!!!");

                    }
                );
            } else {
              //  console.log("Device 1 -Scheduler you rest, let PI take care of data ;) !")
            }

        },
        function error(oError) {
            //throw oError;
            console.log("Device 1 -Error in Outer method.")
            console.log(oError);
        }
    );
});

//=============== cronJobForDemo1Device2 =========================
var cronJobForDemo1Device2Zero = cron.job("*/60 * * * * *", function () {
    var sThingId = "C3549205A6224B28B2F9C74ABBB74F1F";
    var sCurrentTimeStampInMS = (new Date()).getTime();
    var sTimeFromMS = sCurrentTimeStampInMS - (2 * 60000);//"2018-04-01T00:00:30.000Z";
    var sTimeToMS = sCurrentTimeStampInMS - (1 * 60000); //"2018-04-01T07:00:00.000Z";
    var sTimeFrom = (new Date(sTimeFromMS)).toISOString();
    var sTimeTo = (new Date(sTimeToMS)).toISOString();
    var sURL = "/Things('" + sThingId + "')/hcl.mlai.rhlighttest1:pldemoscreenfields/RHHueLight?timerange=" + sTimeFrom + "-" + sTimeTo + "&$orderby=_time";
    //console.log("Device 2 -URL to fetch TimeSeries data = " + sURL);
    var loadingThings = nodeAE.get(sURL);
    loadingThings.then(
        function success(oResponse) {
            var oParsedBodyResponse = JSON.parse(oResponse.body);
            //console.log(oParsedBodyResponse);
            var oDate = new Date();
            //console.info('Device 2 -cron job completed at time = ' + oDate + " & Total records found are = " + oParsedBodyResponse.value.length);

            // Condition: If no records: inject a dummy one
            if (oParsedBodyResponse.value.length === 0) {
                var toBeInsertedTimeFrom = (new Date(sTimeFromMS + 5000)).toISOString();
                var toBeInsertedTimeTo = (new Date(sTimeToMS - 5000)).toISOString();
                //console.log("Device 2 -PI is off; Scheduler go and insert the data !")
                var oDefaultPayload = {
                    "value": [
                        {
                            "_time": toBeInsertedTimeFrom,
                            "connected": false,
                            "rhtest1lighttemp": 0,
                            "brightness": 0,
                            "status": false
                        },
                        {
                            "_time": toBeInsertedTimeTo,
                            "connected": false,
                            "rhtest1lighttemp": 0,
                            "brightness": 0,
                            "status": false
                        }
                    ]

                };

                var sURLForCreate = "/Things('" + sThingId + "')/hcl.mlai.rhlighttest1:pldemoscreenfields/RHHueLight";
                var insertMissingTimeStamp = nodeAE.put(sURLForCreate, oDefaultPayload);
                insertMissingTimeStamp.then(
                    function success(oResponse) {
                        //console.log("Device 2 -Default record inserted; Booyah !!!!s");
                    },
                    function error(err) {
                       // console.log("Device 2 -Error In Default record insertion;  super crap!!!");

                    }
                );
            } else {
               // console.log("Device 2 -Scheduler you rest, let PI take care of data ;) !")
            }

        },
        function error(oError) {
            //throw oError;
            console.log("Device 2 -Error in Outer method.")
            console.log(oError);
        }
    );
});

var cronJobForDemo1Device3Zero = cron.job("*/60 * * * * *", function () {
    var sThingId = "F0FBD353DA874A04920B53390EF5E885";
    var sCurrentTimeStampInMS = (new Date()).getTime();
    var sTimeFromMS = sCurrentTimeStampInMS - (2 * 60000);//"2018-04-01T00:00:30.000Z";
    var sTimeToMS = sCurrentTimeStampInMS - (1 * 60000); //"2018-04-01T07:00:00.000Z";
    var sTimeFrom = (new Date(sTimeFromMS)).toISOString();
    var sTimeTo = (new Date(sTimeToMS)).toISOString();
    var sURL = "/Things('" + sThingId + "')/hcl.mlai.rhlighttest1:pldemoscreenfields/RHHueLight?timerange=" + sTimeFrom + "-" + sTimeTo + "&$orderby=_time";
   // console.log("Device 3 -URL to fetch TimeSeries data = " + sURL);
    var loadingThings = nodeAE.get(sURL);
    loadingThings.then(
        function success(oResponse) {
            var oParsedBodyResponse = JSON.parse(oResponse.body);
            //console.log(oParsedBodyResponse);
            var oDate = new Date();
           // console.info('Device 3 -cron job completed at time = ' + oDate + " & Total records found are = " + oParsedBodyResponse.value.length);

            // Condition: If no records: inject a dummy one
            if (oParsedBodyResponse.value.length === 0) {
                var toBeInsertedTimeFrom = (new Date(sTimeFromMS + 5000)).toISOString();
                var toBeInsertedTimeTo = (new Date(sTimeToMS - 5000)).toISOString();
              //  console.log("Device 3 -PI is off; Scheduler  go and insert the data !")
                var oDefaultPayload = {
                    "value": [
                        {
                            "_time": toBeInsertedTimeFrom,
                            "connected": false,
                            "rhtest1lighttemp": 0,
                            "brightness": 0,
                            "status": false
                        },
                        {
                            "_time": toBeInsertedTimeTo,
                            "connected": false,
                            "rhtest1lighttemp": 0,
                            "brightness": 0,
                            "status": false
                        }
                    ]

                };

                var sURLForCreate = "/Things('" + sThingId + "')/hcl.mlai.rhlighttest1:pldemoscreenfields/RHHueLight";
                var insertMissingTimeStamp = nodeAE.put(sURLForCreate, oDefaultPayload);
                insertMissingTimeStamp.then(
                    function success(oResponse) {
                      //  console.log("Device 3 -Default record inserted; Booyah !!!!s");
                    },
                    function error(err) {
                      //  console.log("Device 3 -Error In Default record insertion;  super crap!!!");

                    }
                );
            } else {
               // console.log("Device 3 -Scheduler you rest, let PI take care of data ;) !")
            }

        },
        function error(oError) {
            //throw oError;
            console.log("Device 3 -Error in Outer method.")
            console.log(oError);
        }
    );
});

cronJobForDemo1Device1Zero.start();
cronJobForDemo1Device2Zero.start();
cronJobForDemo1Device3Zero.start();

// cronJobForDemo1Device1.start();
//  cronJobForDemo1Device2.start();
// cronJobForDemo1Device3.start();

//cronJobForDemo2.start();