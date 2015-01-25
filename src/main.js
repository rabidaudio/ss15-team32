define('main', ['firebase'], function(Firebase, riot, Auth){
  return function(opts){
    opts.firebase = new Firebase(opts.firebase);

    //if no pageID was specified, use the url's path
    // The URL encoding and replacement is to meet Firebase's ID conventions
    opts.pageID = encodeURIComponent( opts.pageID || window.location.pathname ).replace('.','-');

    opts.limit = (opts.limit > 0 ? opts.limit : 100);

    //Enable/disable proviers from the options object
    for(var a in opts.authMethods){
      if((opts.authMethods.hasOwnProperty(a) && !opts.authMethods[a]) &&     //if the option is configured and disabled
            providers.hasOwnProperty(a) ){                                   // and it is a valid provider
        providers[a].available = false;
      }
    }

    opts.Auth = new Auth(opts.firebase, providers);
    riot.mount('qcomment', opts);

    console.log("meow")
  };
});