var QC = function(riot){

  var providers = {
    facebook: {available: true},
    github: {available: true},
    twitter: {available: true},
    google: {available: true},
    password: {
      type: "authWithPassword",
      available: false, //todo unimplemented
    },
    anonymous: {
      type: "authAnonymously",
      available: false, //todo unimplemented
    },
    custom: {
      type: 'authWithCustomToken',
      available: false, //todo unimplemented
    }
  };

  /* Authentication wrapper (with Events!) */
  function Auth(FB, providers){
    riot.observable(this);
    this.providers = providers;

    this.currentUser = function(){
      var auth = FB.getAuth();
      if(!auth) return null;
      var profile = auth[auth.provider].cachedUserProfile;
      var info = {};
      info.name = auth[auth.provider].displayName;
      info.uid = auth.uid;
      info.provider = auth.provider;
      switch(auth.provider){
        case "facebook":
          info.avatar = profile.picture.data.url;
          info.url = profile.link;
          break;
        case "twitter":
          info.avatar = profile.profile_image_url;
          info.url = profile.url;
          break;
        case "github":
          info.avatar = profile.avatar_url;
          info.url = profile.html_url;
          break;
        case "google":
          info.avatar = profile.picture;
          info.url = profile.link;
          break;
      }
      return info;
    };

    this.loggedIn = function(){
      return !!FB.getAuth();
    };

    var self = this;
    FB.onAuth(function(auth){
        if(!auth) return self.trigger('logout');
        FB.child('users').child(auth.uid).set(auth);
        return self.trigger('login', auth);
    });

    this.login = function(method){
      if(this.currentUser()) throw "Already logged in";
      var p = this.providers[method];
      if(!p || p.available===false) throw "Provider unavailable";
      FB[p.type || "authWithOAuthPopup"](method, function(err, auth){
        if(err) throw err;
      });
    };

    this.logout = function(){
      FB.unauth();
    };
  }

  return function(opts){
    if(!opts.firebase) throw "Firebase is required";

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
  };
}(riot);