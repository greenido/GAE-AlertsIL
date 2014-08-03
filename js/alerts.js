//
// Alerts code
// Fetch alerts from pikod ha oref and show them in real time.
//
// @author: Ido Green | @greenido
// Date: July 2014
//

function unixTimeToReadable(unix_timestamp) {
  var date = new Date(unix_timestamp * 1000);
  
  var hours = date.getHours();
  var minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  var seconds = date.getSeconds();
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  
  var year = date.getFullYear();
  var month = date.getMonth() +1;
  var day = date.getDate();
  // will display time in 10:30:23 format
  var formattedTime =  "(" + day + "/" + month + "/" + year + ") " + hours + ':' + minutes + ':' + seconds;
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
  // http://www.oref.org.il/WarningMessages/alerts.json
  // http://tzeva-adom.com/alerts.php?fmt=html&limit=2
  $.getJSON('proxy.php?url=http://tzeva-adom.com/alerts.php?limit=3', function(data) {
    //console.log("====================");  console.dir(data);
    
  var items = [];
  var first = true;
  var gotNewData = false;
  $.each(data, function(item, i) {
    if (first) {
      var lastAlertTime = localStorage.getItem("last_alert");
      if (i.time > lastAlertTime) {
        // we have a new alert!
        gotNewData = true;
      }
      localStorage.setItem("last_alert", i.time);
      first = false;
    }
    items.push('<li id="' + i.alert_id + '">' + i.area_name + ' - ' + unixTimeToReadable(i.time) + '</li>');
  });

  if (gotNewData) {
    $('body').css('background-color', 'red');
    $('#alerts-now').html( "<h3>" + items.join('') + "</h3>");
    $('#alert-dialog').foundation('reveal', 'open');
    setTimeout(returnToNormal, 3000);
    // Check if we can use the web API for notifications
    if ('Notification' in window) {
      var regex = /(<([^>]+)>)/ig
      var body = items.join(' \n ');
      var textResult = body.replace(regex, "");
      console.log("text: "+ textResult);
      var adomNotification = new Notification('צבע אדום', {
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

setInterval(fetchPikodAlerts, 2000);

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
      var n = new Notification("צבע אדים", "זוהי רק דוגמא להתראה");
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
          var n = new Notification("צבע אדים", "זוהי רק דוגמא להתראה");
           $("#accept-notification").hide();
        }
        
      });
    }


  });

});
            

