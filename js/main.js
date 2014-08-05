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
    
    
    var rightNow = new Date(),
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
function fetchFeed(curFeed, curSource) {
  $.ajax({
  url : document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent(curFeed),
  dataType : 'json',
  success  : function (data) {
    // check if we got something to work on.
    if (data && data.responseData.feed && data.responseData.feed.entries) {
      
      //console.log("===== " + curFeed + " ====");
      var curIndex = 1;
      var mainList = '';
      $.each(data.responseData.feed.entries, function (i, entry) {
        var when = timeAgo(entry.publishedDate);
        if (when === "NaN" || when === undefined || when === null || when === "") {
          when = timeAgo(entry.pubDate);
          if (when === "NaN" || when === undefined || when === null || when === "") {
            when = "";
          }
        }
        when += " (" + curSource + ")";
        // console.log("-----------" + when + "-------------");
        // console.log("title      : " + entry.title);
        var buttonHTML = '<div class="row">' + 
          '<div class="large-8 columns">' + entry.title + '</div>' +
          '<div class="small-8 small-centered columns round secondary"><span class="smallfont">' + when +
          '</span></div></div>';
          
        // if ((curIndex % 2) === 0) {
        //   mainList += '<div class="row">'; 
        // }
        
        mainList +=  '<div class="large-10 columns"><a href="' + 
                      entry.link + '" target="_blank" class="medium round button">' + 
                      buttonHTML + '</a></div>';
        // if (curIndex %2 === 0) {
        //   mainList += "</div>";  
        // }

        curIndex++;
      });

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
    }
  }
});
}

//
//
//
function fetchAllFeeds() {
  $('#mainlist').html("<div id='spinner'><img src='img/ajax-loader.gif' /></div>");
  $('#mainlist10').html("<p><img src='img/ajax-loader.gif' /></p>");
  var WALLA = "http://rss.walla.co.il/?w=/1/22/0/@rss";
  fetchFeed(WALLA, "Walla");
  
  var GLZ = "http://glz.co.il/1421-he/Galatz.aspx?id=12703";
  fetchFeed(GLZ, "Glz");
  
  var C10TV = "http://rss.nana10.co.il/?s=126";
  fetchFeed(C10TV, "ערוץ 10");

  var YNET = 'http://www.ynet.co.il/Integration/StoryRss1854.xml';
  fetchFeed(YNET, "Ynet");

  var MAKO = 'http://rcs.mako.co.il/rss/news-israel.xml';
  fetchFeed(MAKO, "ערןץ 2");
}

// First fetch of all the feeds to the page
fetchAllFeeds();
// fetch new data every 60sec
setInterval(fetchAllFeeds, 60000);

//
// little clock
//
function updateClock() {
  // Gets the current time
  var now = new Date();

  // Get the hours, minutes and seconds from the current time
  var hours = now.getHours();
  var minutes = now.getMinutes();
  var seconds = now.getSeconds();

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
  var elem = document.getElementById('clock');

  // Sets the elements inner HTML value to our clock data
  elem.innerHTML = hours + ':' + minutes + ':' + seconds;

}
setInterval('updateClock()', 500);