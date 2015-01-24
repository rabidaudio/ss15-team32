/* 2015-01-24 */riot.tag('auth', '<div class="qc-user qc-logged-in" if="{ loggedIn }"> <p>Logged in. <a href="#" onclick="{ logout }">Log out</a></p> </div> <div if="{ loggedIn }"> <newcomment></newcomment> </div> <div class="qc-user qc-logged-out" if="{ !loggedIn }"> <p>Sign in to post a comment.</p> <ul class="qc-login-opts"> <li each="{ name, val in providers }" if="{ val.available }"> <provider data="{ name }"></provider> </li> </ul> </div>', function(opts) {
  this.providers = this.opts.data;
  this.loggedIn = !!this.parent.currentUser();

  var firebase = this.parent.firebase;

  this.login = function(provider) {
    firebase.authWithOAuthPopup(provider, this.authHandler);
  }.bind(this)
  this.logout = function() {
    firebase.unauth();
    this.loggedIn = false;
  }.bind(this)
  this.authHandler = function(err, auth) {
    if(err){
      console.error(err);
      return;
    }
    firebase.child('users').child(auth.uid).set(auth);
    this.loggedIn = true;
    this.update();
  }.bind(this)
})


riot.tag('comment', '<div class="qc-comment" name="{ opts.data.id }"> <div class="qc-body">{ opts.data.body }</div> <div class="qc-author"> <div class="avatar"> </div> <a href="{ opts.data.author.url }">{ opts.data.author.name }</a> </div> <hr></hr> </div>', function(opts) {
})


riot.tag('newcomment', '<div class="qc-comment qc-new"> <form>      <textarea rows="{ height }" class="gc-new-body form-control" name="body" onfocus="{ grow }"></textarea>\n <button class="submit" name="submit" onclick="{ send }">Submit</button> </form> <hr></hr> </div>', function(opts) {
  this.height = 1

  this.send = function(e) {

    if(!this.spamFree){
      throw "Can't save spammy comments"
    }else{
      this.parent.save(this)
      this.body.value = ""
      this.shrink()
    }
  }.bind(this)
  
  this.spamFree = function() {
    return true //todo
  }.bind(this)

  this.grow = function(e) {
    this.height = 5
  }.bind(this)

  this.shrink = function(e) {
    this.height = 1
  }.bind(this)

})



riot.tag('provider', '<a href="#" onclick="{ login }" class="provider-{ opts.data }">{ opts.data }</a>', function(opts) {
  this.login = function() {
    this.parent.parent.login(this.opts.data) //ewwww....
  }.bind(this)
})


riot.tag('qcommentcontainer', '<div class="qc-comments"> <auth data="{ opts.providers }"></auth> <comment each="{ comments }" data="{ this }"></comment> </div>', function(opts) {
  this.providers = opts.providers
  this.pageID    = opts.pageID
  this.firebase  = opts.firebase
  this.dataset   = this.firebase.child('comments').child(this.pageID)
  this.comments  = []

  

  this.currentUser = function() {
    var auth = this.firebase.getAuth();
    if(!auth) return null;
    var profile = auth[auth.provider].cachedUserProfile;
    var info = {};
    info.name = auth[auth.provider].displayName;
    info.uid = auth.uid;
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
    }
    return info;
  }.bind(this)


  this.save = function(comment) {
    if(!this.currentUser()) throw "Must be logged in to comment";
    this.dataset.push({
      author: this.currentUser(),
      time: Date.now(),
      body: comment.body.value
    })
  }.bind(this)

  this.getComment = function(snapshot) {
    var comment = snapshot.val()
    comment.id = snapshot.key()
    return comment
  }.bind(this)
  this.addComment = function(snapshot) {
    var comment = this.getComment(snapshot)
    this.comments.unshift(comment)
    return this.update()
  }.bind(this)
  this.updateComment = function(snapshot) {
    var comment = this.getComment(snapshot)
    for(var i = this.comments.length; i-->0;){
      if(this.comments[i].id === comment.id){
        this.comments[i] = comment;
        return this.update()
      }
    }
  }.bind(this)
  this.removeComment = function(snapshot) {
    var comment = this.getComment(snapshot)
    for(var i = this.comments.length; i-->0;){
      if(this.comments[i].id === comment.id){
        this.comments.splice(i, 1);
        return this.update()
      }
    }
  }.bind(this)

  var query = this.dataset.orderByChild('time').limitToFirst(opts.limit>0 ? opts.limit : 100)
  query.on("child_added", this.addComment)
  query.on("child_changed", this.updateComment)
  query.on("child_removed", this.removeComment)
  
})


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