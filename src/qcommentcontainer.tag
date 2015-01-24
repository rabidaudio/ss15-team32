<qcomment>
  <h2>Comments ({ comments.length })</h2>
  <newcomment/>
  <div class="qc-comments">
    <comment each={ comments } data={ this }/>
  </div>

  this.providers = opts.providers
  this.pageID    = opts.pageID
  this.firebase  = opts.firebase
  this.Auth      = opts.Auth

  this.dataset   = this.firebase.child('comments').child(this.pageID)
  this.comments  = []

  save(comment){
    if(!opts.Auth.currentUser()) throw "Must be logged in to comment"
    this.dataset.push({
      author: this.Auth.currentUser(),
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
    for(var i = this.comments.length;i-->0;){
      if(this.comments[i].id === comment.id){
        this.comments[i] = comment
        return this.update()
      }
    }
  }
  removeComment(snapshot){
    var comment = this.getComment(snapshot)
    for(var i = this.comments.length;i-->0;){
      if(this.comments[i].id === comment.id){
        this.comments.splice(i,1)
        return this.update()
      }
    }
  }

  var query = this.dataset.orderByChild('time').limitToFirst(opts.limit)
  query.on("child_added",   this.addComment)
  query.on("child_changed", this.updateComment)
  query.on("child_removed", this.removeComment)
  
</qcomment>