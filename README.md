This is the official chrome extension for BeatStream
 - Immediate need is to get auth working
 - Additional Service Funcationality should follow the model found in beatstream/content_scripts/pandora.js
 + This means adding a content script object to the manifest file and creating a chrome.runtime.onMessage.addListener that takes a function that passes backa  data object
 + data = {
 +  success: Boolean,
 +  term: String  
 + }
