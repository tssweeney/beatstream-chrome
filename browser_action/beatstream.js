function BeatStream(input){
  var self = this;
  var settings = {
    input: null
  };

  var authenticate = function(){
    // need to do
  };

  // @param search term
  // @return itunes id | 0 if error
  var getItunesId = function(term) {
    var itunes_id = 0;
    $.ajax({
      type: "GET",
      url: "https://itunes.apple.com/search",
      data: {term: term},
      success: function(res){
        itunes_id = res.results[0].trackId;
      },
      error: function(xhr, text, err){
        console.log(xhr);
        console.log(text);
        console.log(err);
      },
      dataType: "JSON",
      async: false
    });
    return itunes_id;
  };

  // @param itunes id
  // @return track id | {id:0}
  var trackFromItunesId = function(id){
    var track = {id:0};
    $.ajax({
      type: "POST",
      url: "http://beatstream-rails.herokuapp.com/api/match",
      data: {id:id},
      success: function(res){
        track = res;
      },
      error: function(xhr, text, err){
        console.log(xhr);
        console.log(text);
        console.log(err);
      },
      dataType: "JSON",
      async: false
    });
    return track;
  };

  // @param {
  //  message, {id, provider}
  // }
  // @return true | false success
  var createPost = function(post){
    var success = false;
    post.message += "\n#BeatStreamforPandora";
    console.log(post);
    $.ajax({
      type: "POST",
      url: "http://beatstream-rails.herokuapp.com/api/posts",
      data: post,
      success: function(res){
        success = true;
      },
      error: function(xhr, text, err){
        console.log(xhr);
        console.log(text);
        console.log(err);
      },
      dataType: "JSON",
      async: false
    });
    return success;
  };

  var getMessage = function(){
    return settings.input.val();
  };

  authenticate();
  input.keyup(function(e) {
    if(e.which == 13) {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {}, function(res) {
          console.log(res);

          var track = trackFromItunesId(getItunesId(res.term));

          var post = {
            message: getMessage(),
            track: {
              id: track.id,
              provider: track.provider
            }
          };

          if (createPost(post)) {
            console.log('success');
          } else {
            console.log('failure');
          }

          window.close();
        });
      });
    }
  });
  settings.input = input;
};

waitUntilExists("beatMessage", function(e){
  BS = new BeatStream($("#beatMessage"));
})