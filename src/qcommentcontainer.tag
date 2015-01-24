<qcomment>
  <h2>Comments ({ comments.length })</h2>
  <div class="qc-comments">
    <auth data={ opts.providers }/>
    <comment each={ comments } data={ this }/>
  </div>

  this.providers = opts.providers;
  this.pageID    = opts.pageID;
  this.firebase  = opts.firebase;
  this.dataset   = this.firebase.child('comments').child(this.pageID);
  this.comments  = [];

  

  currentUser(){
    var auth = this.firebase.getAuth();
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
    }
    return info;
  }


  save(comment){
    if(!this.currentUser()) throw "Must be logged in to comment";
    this.dataset.push({
      author: this.currentUser(),
      time: Date.now(),
      body: comment.body.value
    });
  }

  getComment(snapshot){
    var comment = snapshot.val();
    comment.id = snapshot.key();
    return comment;
  }
  addComment(snapshot){
    var comment = this.getComment(snapshot);
    this.comments.unshift(comment);
    return this.update();
  }
  updateComment(snapshot){
    var comment = this.getComment(snapshot);
    for(var i = this.comments.length; i-->0;){
      if(this.comments[i].id === comment.id){
        this.comments[i] = comment;
        return this.update();
      }
    }
  }
  removeComment(snapshot){
    var comment = this.getComment(snapshot);
    for(var i = this.comments.length; i-->0;){
      if(this.comments[i].id === comment.id){
        this.comments.splice(i, 1);
        return this.update();
      }
    }
  }

  var query = this.dataset.orderByChild('time').limitToFirst(opts.limit);
  query.on("child_added",   this.addComment);
  query.on("child_changed", this.updateComment);
  query.on("child_removed", this.removeComment);
  
</qcomment>