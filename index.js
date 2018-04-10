// var express  = require('express');
// var path = require('path');
// express = require('express');
// var schedule = require('node-schedule');
// const cron = require('cron');
// var app = express();
// app.listen(process.env.PORT || 8050, function () {
//     console.log('philipslightning app is listening on port 8050!');
//   });

//  var NodeAE = require('./sdk/iot-application-services-sdk-nodejs-master');
//  var nodeAE = new NodeAE();
//  nodeAE.setBaseURI('appiot-mds');
//  //const cron = require('cron');

//  var thingIdsDemo1 = ["C3549205A6224B28B2F9C74ABBB74F1F","6CD8528F892641C7997C8BB8A2A5722D","F0FBD353DA874A04920B53390EF5E885"];
//  var thingIdsDemo2 = ["FC8F333992A34B25BA9D8119D72EE155","52390BFFB7FE4F8C9C6B926AA5402FE8","4B5060B173CD40A1A000D6B21BA63BB7"];

//  var startTime = new Date(Date.now());
//  var endTime = new Date(startTime.getTime() + 100000000000000);
 
//  var j = schedule.scheduleJob({ start: startTime, end: endTime, rule: '*/1000 * * * * *' }, function(){
//     var sThingId = "C3549205A6224B28B2F9C74ABBB74F1F";
//     var d = new Date();
//     var hour_date = d.toISOString();
//            var fromDate = new Date(hour_date);
//            fromDate.setHours(fromDate.getHours() +1);
//            console.log("Running For DeviceId: " +"C3549205A6224B28B2F9C74ABBB74F1F" + " For Duration between: "+hour_date+ "TO: "+ fromDate.toISOString()  );
//    var url = ('/Things(%27'+sThingId+'%27)/hcl.mlai.rhlighttest1:pldemoscreenfields/RHHueLight?timerange='+hour_date+'-'+fromDate.toISOString()+'&$orderby=_time&$filter=brightness gt 0');
//    //var url = ('/Things(%27'+sThingId+'%27)/hcl.mlai.rhlighttest1:pldemoscreenfields/RHHueLight?timerange=2018-04-09T11:25:00.295Z-2018-04-09T12:25:00.295Z&$orderby=_time&$filter=brightness gt 0');

//             var loadingThingsRHHueLight = nodeAE.get(url);
//             loadingThingsRHHueLight.then(
//                 function success (oResponse) {
//                  var data = JSON.parse(oResponse.body);
//                  console.log(data);
//                  if(data.value.length>0){
//                  var positive=0;
//                 for(var i=0;i<data.value.length;i++)
//                 {
//                     if(i<data.value.length-1)
//                     {
//                         var fromDate = new Date(data.value[i+1]._time);
//                         var toDate = new Date(data.value[i]._time);
//                         var diff =  fromDate-toDate ;
//                         var seconds = Math.floor(diff / (1000));
//                         diff -= seconds * (1000);
//                         positive +=seconds;
//                     }
//                 }
   
//                 var result = 0;
//                 if(positive>0)
//                 {
//                     result=  (positive/ 3600) * 100;
//                 }
   
//                 for(var i=0;i<data.value.length;i++)
//                 {
//                     if(data.value[i].connected==true && data.value[i].brightness>0)
//                     {
//                     var powerConsumptionCurrent=data.value[i].brightness;
//                     var power24Hours=powerConsumptionCurrent*1440;
//                     var powerTotalWeek=power24Hours*7;
//                     var powerConsumptionCurrentCycle=powerTotalWeek*4;
   
//                         var oDataPayload ={
//                         "value": [
//                         {
//                             "_time": data.value[i]._time,
//                             "Utilisation": result,
//                             "PowerConsumptionInCurrentCycle": powerConsumptionCurrentCycle,
//                             "PowerTotal24hours": power24Hours,
//                             "TimeOn": Math.floor(result / 60),
//                             "CurrentPowerConsumption": powerConsumptionCurrent,
//                             "PowerTotalWeek": powerTotalWeek
//                         }
//                         ]
//                         }
   
//                         UpdateConsumptionDemo1(sThingId,oDataPayload);
//                     }
   
//                 }
//                }
//                 },
//                 function error (err) {
//                    console.log(err)
//                 }
//             )
//       }); 

     

//  function UpdateConsumptionDemo1(thingId,oDataPayload){

//    var loadingUpdateThings = nodeAE.put('/Things(%27'+thingId+'%27)/hcl.mlai.rhlighttest1:pldemoscreenfields/PLCalculated', oDataPayload)
//    loadingUpdateThings.then(
//          function success (oResponse) {
//           console.log("Data Updated-Demo-1.");
//          },
//          function error (err) {
//           console.log(err);
//          }
//    )
//  }

// //cronJobForDemo1Device1Zero.start();
// // cronJobForDemo1Device2Zero.start();
// // cronJobForDemo1Device3Zero.start();

// // cronJobForDemo1Device1.start();
// //  cronJobForDemo1Device2.start();
// // cronJobForDemo1Device3.start();

// //cronJobForDemo2.start();