var QC = function(riot){
  if(!riot) throw "Riot.js is required";

  var providers = {
    facebook: {
      type: "oauth",
      available: true
    },
    github: {
      type: "oauth",
      available: true
    },
    twitter: {
      type: "oauth",
      available: true,
    },
    google: {
      type: "oauth",
      available: true,
    },
    password: {
      available: false, //todo unimplemented
    },
    anonymous: {
      available: false, //todo unimplemented
    }
  };

  return function(opts){
    opts.pageID = encodeURIComponent( opts.pageID || window.location.pathname );
    if(!opts.firebase) throw "Firebase is required";
    for(var a in opts.authMethods){
      if(opts.authMethods.hasOwnProperty(a) && providers.hasOwnProperty(a)){
        providers[a].available = opts.authMethods[a];
      }
    }
    opts.providers = providers;
    riot.mount('qcommentcontainer', opts);
  };
}(riot);