<?php
//
// basic proxy
// @author: Ido Green | @greenido
//

//
// Fetch a url and echo it back to stdout
// 
function getUrl($url) {
  //error_log("Fetch:" . $url);
  
  // PROD
  $handle = fopen($url, "rb");
  $ret = stream_get_contents($handle);
  fclose($handle);

  //error_log("ret:\n $ret \n");
  // TESTING: '{"id":"1527628240688","title":"התרעות פיקוד העורף ","data":["מרכז הנגב, עוטף עזה 234"]}';  
  //$ret = '{"id":"' . time() . '","title":"התרעות פיקוד העורף ","data":["מרכז הנגב, עוטף עזה 234"]}';  
  
  echo $ret;
}

//
// Start the party
//
if (isset($_GET['url']) ) {
  getUrl($_GET['url']);
} 
else {
  error_log("Err: yo! you are missing the url to fetch for you.");
  echo "You must send a 'url' so the proxy will work on something...";
}
