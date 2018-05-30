//
// Alerts code
// Fetch alerts from pikod ha oref and show them in real time.
//
// @author: Ido Green | @greenido
// Date: July 2014
//

function unixTimeToReadable(unix_timestamp) {
  let date = new Date(unix_timestamp);
  
  let hours = date.getHours();
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  let seconds = date.getSeconds();
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  
  let year = date.getFullYear();
  let month = date.getMonth() +1;
  let day = date.getDate();
  // will display time in 10:30:23 format
  let formattedTime =  "(" + day + "/" + month + "/" + year + ") " + hours + ':' + minutes + ':' + seconds;
  return formattedTime;
}

//
//
//
function returnToNormal() {
  $('body').css('background-color', 'white');
  $('#alert-dialog').foundation('reveal', 'close');
}

//
//
//
function fetchPikodAlerts(){
  // Thanks to these 'apis':
  // http://www.oref.org.il/WarningMessages/Alert/alerts.json?v=1
  // http://tzeva-adom.com/alerts.php?fmt=html&limit=2 -- not working any more (5/2018)
  //
  // https://github.com/gadicc/redalert/tree/master/api
  
  //
  $.getJSON('proxy.php?url=http://www.oref.org.il/WarningMessages/Alert/alerts.json?v=1', function(data) {
  console.log("== response from oref api v1: " + JSON.stringify(data) );   //console.dir(data);
  let items = [];
  let first = true;
  let gotNewData = false;
  let lastAlertTime = localStorage.getItem("last_alert");
  
  //
  $.each(data, function(key, val) {  
    if (typeof lastAlertTime == 'undefined' || (key == "id" &&  val > lastAlertTime) ) {
      // we have a new alert!
      gotNewData = true;
      localStorage.setItem("last_alert", val);
    }
  
    if (key == "data") {
      val.forEach(element => {
        items.push('<li id="' + key + '">' + element + ' - ' + unixTimeToReadable(Date.now() ) + '</li>');  
      });    
    }
  });

  if (gotNewData) {
    $('body').css('background-color', 'red');
    $('#alerts-now').html( "<h3>" + items.join('') + "</h3>");
    $('#alert-dialog').foundation('reveal', 'open');
    setTimeout(returnToNormal, 3000);
    // Check if we can use the web API for notifications
    if ('Notification' in window) {
      let regex = /(<([^>]+)>)/ig
      let body = items.join(' \n ');
      let textResult = body.replace(regex, "");
      //console.log("text: "+ textResult);
      ga('send', 'event', 'Alerts', textResult, items.join(', '));
      let adomNotification = new Notification('צבע אדום', {
        body:  textResult,
        icon: "/img/alert.jpeg"
      });
      
      // Should we close it automatically? not clear from UX point of view.
      // adomNotification.onshow = function () { 
      //   setTimeout(adomNotification.close(), 5000); 
      // } 
    }

  }
  // Let's see if it's time to update the tab of the alerts
  if (gotNewData || $("#realtime-alerts").html().length < 10) {
    $('<ul/>', {
        'class': 'realtime-alerts-class',
        html: items.join('')
      }).prependTo('#realtime-alerts');
  }

  });

   
}

// Every 10sec
setInterval(fetchPikodAlerts, 10000);

// On load of our app - let's check for permissions on Web Notifications
$(function() {
   // At first, let's check if we have permission for notification
  if (window.Notification && Notification.permission !== "granted") {
    Notification.requestPermission(function (status) {
      if (Notification.permission !== status) {
          Notification.permission = status;
      }
    });
  } 
  else {
    $("#accept-notification").hide();
  } 

  // Ask for permission to push notifications
  $("#accept-notification").click(function() {
    // If the user agreed to get notified
    if (window.Notification && Notification.permission === "granted") {
      let n = new Notification("זוהי רק דוגמא להתראה");
      $("#accept-notification").hide();
    }
    // If the user hasn't told if he wants to be notified or not
    else if (window.Notification && Notification.permission !== "denied") {
      Notification.requestPermission(function (status) {
        if (Notification.permission !== status) {
          Notification.permission = status;
        }

        // If the user said okay
        if (status === "granted") {
          let n = new Notification( "זוהי רק דוגמא להתראה");
           $("#accept-notification").hide();
        }
        
      });
    }


  });

});
            

