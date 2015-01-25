define('Auth', function(){

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
          info.url = "http://twitter.com/"+profile.screen_name;
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
  return Auth;
});