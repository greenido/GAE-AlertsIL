//
// Main code of our app.
// 1. Simple fetching of RSS and twitter feeds and putting them in panels.
// 2. Fetch alerts from pikod ha oref and show them in real time.
//
// @author: Ido Green | @greenido
// Date: July 2014
//

$(document).foundation();

//
// little clock
//
function updateClock() {
  // Gets the current time
  let now = new Date();

  // Get the hours, minutes and seconds from the current time
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();

  // Format hours, minutes and seconds
  if (hours < 10) {
      hours = "0" + hours;
  }
  if (minutes < 10) {
      minutes = "0" + minutes;
  }
  if (seconds < 10) {
      seconds = "0" + seconds;
  }

  // Gets the element we want to inject the clock into
  let elem = document.getElementById('clock');

  // Sets the elements inner HTML value to our clock data
  elem.innerHTML = hours + ':' + minutes + ':' + seconds;

}
setInterval('updateClock()', 500);

//
//
//
timeAgo = function(dateString) {
    if (!dateString) {
      return "";
    }
    try {
      dateString = dateString.replace(",", "");  
      dateString = dateString.trim();
    }
    catch(e) {
      console.log("WARN: didn't find a date in string: "+dateString);
    }
    
    
    let rightNow = new Date(),
      then = new Date(dateString),
      diff = rightNow - then,
      second = 1000,
      minute = second * 60,
      hour = minute * 60,
      day = hour * 24,
      week = day * 7;

    // return blank string if unknown
    if (isNaN(diff) || diff < 0) {
      return "";
    }

    // within 2 seconds
    if (diff < second * 2) {
      return "ממש עכשיו";
    }

    if (diff < minute) {
      return "לפני כ" + Math.floor(diff / second) + " שניות";
    }

    if (diff < minute * 2) {
      return "לפני כדקה";
    }

    if (diff < hour) {
      return "לפני כ" + Math.floor(diff / minute) + " דקות";
    }

    if (diff < hour * 2) {
      return "לפני כשעה";
    }

    if (diff < day) {
      return  "לפני כ" + Math.floor(diff / hour) + " שעות";
    }

    if (diff > day && diff < day * 2) {
      return "אתמול";
    }

    if (diff < day * 365) {
      return "לפני כ" + Math.floor(diff / day) + "  ימים";
    }
    else {
      return "למעלה משנה";
    }
  };


//
// Helper function for padding of the news/alerts
//
let STR_PAD_LEFT = 1;
let STR_PAD_RIGHT = 2;
let STR_PAD_BOTH = 3;

function pad(str, len, pad, dir) {

    if (typeof(len) == "undefined") { let len = 0; }
    if (typeof(pad) == "undefined") { let pad = ' '; }
    if (typeof(dir) == "undefined") { let dir = STR_PAD_RIGHT; }

    if (len + 1 >= str.length) {

        switch (dir){

            case STR_PAD_LEFT:
                str = Array(len + 1 - str.length).join(pad) + str;
            break;

            case STR_PAD_BOTH:
                let right = Math.ceil((padlen = len - str.length) / 2);
                let left = padlen - right;
                str = Array(left+1).join(pad) + str + Array(right+1).join(pad);
            break;

            default:
                str = str + Array(len + 1 - str.length).join(pad);
            break;

        } // switch
    }
    return str;

}
//
// Fetching feeds by using YQL (used to be pipes.yahoo.com baby!)
//
function fetchFeed(curFeed, curSource) {
  $.ajax({
  url : 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20feed%20where%20url%3D%22' + 
        encodeURIComponent(curFeed) + '%22&format=json&diagnostics=false&callback=',
  dataType : 'json',
  success  : function (data) {
    // check if we got something to work on.
    if (data && data.query.results && data.query.results.item) {
      //console.log("===== " + curFeed + " ====");
      let curIndex = 1;
      let mainList = '';
      $.each(data.query.results.item, function (i, entry) {
        if (i>9) return;

        let when = timeAgo(entry.publishedDate);
        if (when === "NaN" || when === undefined || when === null || when === "") {
          when = timeAgo(entry.pubDate);
          if (when === "NaN" || when === undefined || when === null || when === "") {
            when = "";
          }
        }
        when += " (" + curSource + ")";
        //console.log("-*-" + entry.image + "-*-");
        let leadImg = ""
        // For MAKO - channel 2
        if (entry && entry.image) {
          leadImg = "<img class='newsLeadImg' src='" + entry.image + "' alt='lead image'/>";
        }
        // For channel 10
        if (entry.enclosure && entry.enclosure.url) {
          leadImg = "<img class='newsLeadImg' src='" + entry.enclosure.url + "' alt='lead image'/>";
        }
        // For Yahoo
        if (entry.content && entry.content.url) {
          leadImg = "<img class='newsLeadImg' src='" + entry.content.url + "' alt='lead image'/>";
        }
        let buttonHTML = '<span class="tinytitle">' + leadImg + entry.title + '</span>' +
          '<span class="smallfont"> - ' + when + '</span>';
        let newsItemStyle = "large-4 medium-4 small-8 columns";
        let buttonStyle = "button round";
        if (condLayout && condLayout === "true") {
          newsItemStyle += " ourbut ";
          if (curSource.indexOf("Walla") > -1) {
            newsItemStyle += " walla-color ";
          } 
          else if (curSource.indexOf("Yahoo") > -1) {
            newsItemStyle += " y-color ";
          } 
          else if (curSource.indexOf("Ynet") > -1) {
            newsItemStyle += " ynet-color ";
          }
          else if (curSource.indexOf("2") > -1) {
           newsItemStyle += " ch2-color "; 
          } 
          buttonStyle = "";
        }  
        let divDirection = '<div class="';
        if (curSource.indexOf("Yahoo") > -1 ) {
          divDirection = '<div dir="ltr" class="';
        }
        mainList +=  divDirection + newsItemStyle + '"><a href="' + 
                      entry.link + '" target="_blank" class="'+ buttonStyle + '">' + 
                      buttonHTML + '</a></div>';
        curIndex++;
      });

      console.log("curS: " + curSource);
      $("#spinner").hide();
      if (curSource.indexOf("Walla") > -1) {
        $('#mainlist').html("");
      }
      $('#mainlist').append(mainList);
      
      if (curSource.indexOf("10") > 1) {
        $('#c10').html(mainList);
      }
      if (curSource.indexOf("Ynet") > -1) {
        $('#c-ynet').html(mainList);
      }
      if (curSource.indexOf("2") > -1) {
        $('#c-mako').html(mainList);
      }  
      if (curSource.indexOf("Yahoo") > -1) {
        $('#yahoo').html(mainList);
      }  
    }
  }
});
}

//
//
//
function fetchAllFeeds() {
  $('#mainlist').html("<div id='spinner'><img src='img/ajax-loader.gif' /></div>");
  $("#spinner").show();

  let C10TV = "http://rss.nana10.co.il/?s=126";
  fetchFeed(C10TV, "ערוץ 10");

  let YNET = 'http://www.ynet.co.il/Integration/StoryRss1854.xml';
  fetchFeed(YNET, "Ynet");

  let MAKO = 'http://rcs.mako.co.il/rss/news-israel.xml';
  fetchFeed(MAKO, "ערןץ 2");

  let yahoo = "http://news.yahoo.com/rss/";
  fetchFeed(yahoo, "Yahoo");  

  let GLZ = "http://glz.co.il/1421-he/Galatz.aspx?id=12703";
  fetchFeed(GLZ, "Glz");

  let WALLA = "http://rss.walla.co.il/?w=/1/22/0/@rss";
  fetchFeed(WALLA, "Walla");

}


  // First fetch of all the feeds to the page
  fetchAllFeeds();
  // fetch new data every 60sec - or any other interval that the user will choose later
  let fetchLoopInterval = setInterval(fetchAllFeeds, 60000);

//
// Start the party
//
$(function() {
  
  //
  // Updating the settings
  //
  $("#save-seconds").click(function() {
    // save the new update interval
    clearInterval(fetchLoopInterval);
    let seconds = 1000 * $("#update-seconds").val();
    localStorage.setItem("alerts-il-seconds", seconds); 
    fetchLoopInterval = setInterval(fetchAllFeeds, seconds);

    // condLayout is global!
    condLayoutUI = $("#whichLayout").is(':checked');
    localStorage.setItem("alerts-il-cond-layout", condLayoutUI); 
    console.log("Change the updater to: " + seconds + " sec and condLayout: "+ condLayoutUI);
    if (condLayout != condLayoutUI) {      
      // There is a layout change - let's reload.
      location.reload();
    }
    else {
      // no need for refresh as we just returning with no layout changes
      $("#tab-1").click();  
    }
  });

  let seconds = window.localStorage["alerts-il-seconds"];
  if (!seconds) {
    seconds = "60000";
    console.log("don't have default settings so set update interval to 60sec");
  }
  else {
    console.log("Got settings to update interval: " + seconds + " sec");
  }
  $("#update-seconds").val(seconds / 1000);

  $("#cancel-but").click(function() {
    $("#tab-1").click();
  });

  condLayout = window.localStorage["alerts-il-cond-layout"];
  if (!condLayout || condLayout == "undefined") {
    condLayout = true;
    $("#whichLayout").attr('checked', true);
    localStorage.setItem("alerts-il-cond-layout", true); 
    console.log ("setting initial layout as crowded");
  }

  if (condLayout && condLayout === "true") {
    $("#whichLayout").attr('checked', true);
    console.log ("setting crowded layout");
  }
  else {
    $("#whichLayout").attr('checked', false); 
    condLayout = false;
    console.log ("setting wide layout");
  }
});