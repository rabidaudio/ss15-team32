var QC = function(riot){
  if(!riot) throw "Riot.js is required";

  return function(opts){
    riot.mount('qcommentcontainer', {
      FB:       opts.firebase,
      pageID:   encodeURIComponent( opts.pageID || window.location.pathname ),
    });
  };
}(riot);