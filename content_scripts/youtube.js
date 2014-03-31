chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // THIS FILE NEEDS UPDATING
  
  console.log($('.watch-title'));
  var data = {
    term: ($('.watch-title')[0].innerText).replace("-", " ")
  }
  console.log(data);
  sendResponse(data);
});