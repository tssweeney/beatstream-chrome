chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  var term = $(".playbackTitle__link").text();
  var data = {
    term: term,
    success: (term ? true : false)
  }
  console.log(data);
  sendResponse(data);
});