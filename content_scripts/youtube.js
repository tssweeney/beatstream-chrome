chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log($('.watch-title'));
  var data = {
    term: ($('.watch-title')[0].innerText).replace("-", " ")
  }
  console.log(data);
  sendResponse(data);
});