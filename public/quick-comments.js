/* 2015-01-24 */riot.tag('auth', '<ul class="qc-login-opts"> <li each="{ name, val in providers }" if="{ val.available }"> <provider data="{ name }"></provider> </li> </ul>', function(opts) {
  this.providers = {
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
      available: false,
    }
  }

  this.login = function(provider) {
    this.parent.FB.authWithOAuthPopup(provider, this.authHandler);
  }.bind(this)
  this.authHandler = function(err, auth) {
    if(err) throw err;
  }.bind(this)
})


riot.tag('comment', '<div class="qc-comment" name="{ opts.data.id }"> <div class="qc-body">{ opts.data.body }</div> <div class="qc-author"> <a href="mailto:{ opts.data.author.email }">{ opts.data.author.name }</a> </div> <hr></hr> </div>', function(opts) {
})


riot.tag('newcomment', '<div class="qc-comment qc-new"> <div class="qc-user qc-logged-out" if="{ !parent.user }"> <p>Sign in to post a comment.</p> <ul class="qc-login-opts"> <li each="{ parent.providers }"> <a href="#" class="provicer-{ name }" onclick="{ login }">{ name }</a> </li> </ul> </div> <div class="qc-user qc-logged-in" if="{ parent.user }"> { parent.user.name } </div> <form>      <textarea rows="{ height }" class="gc-new-body form-control" name="body" onfocus="{ grow }"></textarea>\n <button class="submit" name="submit" onclick="{ send }">Submit</button> </form> <hr></hr> </div>', function(opts) {
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


riot.tag('qcommentcontainer', '<div class="qc-comments"> <auth></auth> <newcomment></newcomment> <comment each="{ comments }" data="{ this }"></comment> </div>', function(opts) {
  this.providers = opts.providers
  this.pageID    = opts.pageID
  this.FB        = opts.FB
  this.dataset   = this.FB.child('comments').child(this.pageID)
  this.comments  = []

  

  this.currentUser = function() {
    var auth = this.FB.getAuth();
    if(!auth) return null;
    var info = {};
    switch(auth.provider){
      case "github":
      break;
    }
    info.auth = auth;
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

  return function(opts){
    riot.mount('qcommentcontainer', {
      FB:       opts.firebase,
      pageID:   encodeURIComponent( opts.pageID || window.location.pathname ),
    });
  };
}(riot);