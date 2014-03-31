chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  var artist = $('.trackData .artistSummary')[0].text;
  var song = $('.trackData .songTitle')[0].text;

  var term;
  if (artist || song) {
    term = artist + " " + song;
  }
  var data = {
    term: term,
    success: (term ? true : false)
  }
  console.log(data);
  sendResponse(data);
});