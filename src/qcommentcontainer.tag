<qcommentcontainer>
  <div class="qc-comments">
    <auth></auth>
    <newcomment></newcomment>
    <comment each={ comments } data={ this }></comment>
  </div>

  this.providers = opts.providers
  this.pageID    = opts.pageID
  this.FB        = opts.FB
  this.dataset   = this.FB.child('comments').child(this.pageID)
  this.comments  = []

  

  currentUser(){
    var auth = this.FB.getAuth();
    if(!auth) return null;
    var info = {};
    switch(auth.provider){
      case "github":
      break;
    }
    info.auth = auth;
    return info;
  }


  save(comment){
    if(!this.currentUser()) throw "Must be logged in to comment";
    this.dataset.push({
      author: this.currentUser(),
      time: Date.now(),
      body: comment.body.value
    })
  }

  getComment(snapshot){
    var comment = snapshot.val()
    comment.id = snapshot.key()
    return comment
  }
  addComment(snapshot){
    var comment = this.getComment(snapshot)
    this.comments.unshift(comment)
    return this.update()
  }
  updateComment(snapshot){
    var comment = this.getComment(snapshot)
    for(var i = this.comments.length; i-->0;){
      if(this.comments[i].id === comment.id){
        this.comments[i] = comment;
        return this.update()
      }
    }
  }
  removeComment(snapshot){
    var comment = this.getComment(snapshot)
    for(var i = this.comments.length; i-->0;){
      if(this.comments[i].id === comment.id){
        this.comments.splice(i, 1);
        return this.update()
      }
    }
  }

  var query = this.dataset.orderByChild('time').limitToFirst(opts.limit>0 ? opts.limit : 100)
  query.on("child_added", this.addComment)
  query.on("child_changed", this.updateComment)
  query.on("child_removed", this.removeComment)
  
</qcommentcontainer>