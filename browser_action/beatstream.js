var BeatStream = function(options){
  var url = "https://beta.beatstream.co/api/";

  // res = {
  //   success: Boolean,
  //   term: String
  // }
  var _getSearchQueryFromHost = function(callback){
    console.log("Getting Host Search Term...");
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {}, function(res) {
        callback(res);
      });
    });
  };

  var _setupUI = function(){
console.log("Setting Up UI...");
    var ui = {
      main: options.uiDIV,
      search: $(options.uiDIV.find("#searchBox")[0]),
      trackSelection: $(options.uiDIV.find("#trackSelection")[0]),
      messageBox: $(options.uiDIV.find("#messageBox")[0]),
      postBtn: $(options.uiDIV.find("#postBtn")[0]),
      errorBox: $(options.uiDIV.find("#errorBox")[0]),
      tracks: []
    }

    ui.trackSelection.hide();
    ui.messageBox.hide();
    ui.postBtn.hide();

    var _postError = function(error){
      ui.errorBox.text(error);
    };

    ui.postBtn.click(function(){
console.log("Initiating Post...");
      var t = {};
      var bsid = parseInt(ui.trackSelection.val()[0]);
      ui.errorBox.val('');
      for (var i = 0; i < ui.tracks.length; i++) {
        if (parseInt(ui.tracks[i].bsid) === bsid) {
          t = ui.tracks[i];
        }
      }
      if (t) {
        _createPost({
          message: ui.messageBox.val(),
          track: t
        },function(res){
          if (res && res.success) {
            window.close();
          } else {
            _postError("Internal Error.");
          }
        });
      } else {
        _postError("Hmmm, we'll work on that.");
      }
    });

    _refreshTracks = function(){
      var option = '';
      for (i = 0; i < ui.tracks.length; i++){
          ui.tracks[i].bsid = i;
         option += '<option value="'+i+'"><div><img src="'+ui.tracks[i].icon100+'">' + ui.tracks[i].name + '</div></option>';
      }
      ui.trackSelection.html("");
      ui.trackSelection.append(option);
      ui.trackSelection.show();
      ui.messageBox.hide();
      ui.postBtn.hide();
      ui.errorBox.text('');
      ui.searchBox.val('');
    };

    ui.trackSelection.change(function(){
      ui.messageBox.show();
      ui.postBtn.show();
    });

    ui.search.keypress(function(){
      _getTracks($(this).val(), function(res){
        if (res && res.success) {
          ui.tracks = res.res;
          _refreshTracks();
        }
      });
    });

    //fill in search term
    _getSearchQueryFromHost(function(res){
      if (res && res.success) {
        ui.search.val(res.term);
        _getTracks(res.term, function(res1){
          if (res1 && res1.success) {
            ui.tracks = res1.res;
            _refreshTracks();
          }
        });
      }
    });
  };

  var _createPost = function(post, callback){
console.log("Posting to BeatStream...");
    $.ajax({
      type: "POST",
      url: url + "posts",
      data: post,
      crossDomain: true,
      success: function(res){
        callback({success: true, res:res});
      },
      error: function(xhr, text, err){
        callback({success: false, errors: text});
      },
      dataType: "JSON"
    });
  }

  var _getTracks = function(searchTerm, callback){
console.log("Getting Tracks...")
    $.ajax({
      type: "GET",
      url: url + "tracks?query=" + searchTerm + " ",
      crossDomain: true,
      success: function(res){
        callback({success: true, res: res});
      },
      error: function(xhr, text, err){
        callback({success: false, errors: text});
      },
      dataType: "json"
    });
  };

  // var _checkAuth = function(w, callback) {
  //   if (w.document.URL.indexOf("feed") !== -1) {
  //     w.close();
  //     callback({success:true});
  //   } else {
  //     setTimeout(_checkAuth(w, callback), 1000);
  //   }
  // }

  var _authenticate = function(callback){
    // var w = window.open("http://beta.beatstream.co/", "SignIn", "width=780,height=410");
    // w.focus();
    // setTimeout(_checkAuth(w, callback), 1000);
    $.ajax({
      type: "GET",
      url: url + "posts",
      crossDomain: true,
      success: function(res){
        if (res && res[0] && res[0].id) {
          callback({success: true});
        } else {
          callback({success: false});
        }
      },
      error: function(xhr, text, err){
        callback({success: false, errors: text});
      },
      dataType: "json"
    });
  };

  (function main(){
    _authenticate(function(res){
      if (res && res.success) {
        _setupUI();
      } else {
        options.uiDIV.html("You must be logged in to post. Please log in here: <a href='http://beta.beatstream.co/' target='_blank' >beatstream.co</a>");
      }
    });
  })(this);
};

$(function(){
  BS = new BeatStream({
    uiDIV: $("#beatStream")
  });
});