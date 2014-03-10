chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  var data = {
    term: $('.trackData .artistSummary')[0].text + " " +$('.trackData .songTitle')[0].text
  }
  // console.log(data);
  sendResponse(data);
});