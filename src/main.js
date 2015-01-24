var QC = function(riot){

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
    if(!opts.firebase) throw "Firebase is required";

    //if no pageID was specified, use the url's path
    opts.pageID = encodeURIComponent( opts.pageID || window.location.pathname.replace('.','-') );

    opts.limit = (opts.limit > 0 ? opts.limit : 100);

    //Enable/disable proviers from the options object
    for(var a in opts.authMethods){
      if(opts.authMethods.hasOwnProperty(a) && providers.hasOwnProperty(a)){
        providers[a].available = opts.authMethods[a];
      }
    }

    opts.providers = providers;
    riot.mount('qcommentcontainer', opts);
  };
}(window.riot);