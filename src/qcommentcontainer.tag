<qcommentcontainer>
  <div class="qc-comments">
    <newcomment></newcomment>
    <comment each={ comments } data={ this }></comment>
  </div>

  this.providers = opts.providers
  this.pageID    = opts.pageID
  this.FB        = opts.FB
  this.dataset   = this.FB.child('comments').child(this.pageID)
  this.comments  = []

  this.user = {name: "bob", email: "abc@123.xyz"} //todo


  save(comment){
    this.dataset.push({
      author: this.user,
      time: (new Date()).toISOString(),
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

  this.dataset.on("child_added", this.addComment)
  this.dataset.on("child_changed", this.updateComment)
  this.dataset.on("child_removed", this.removeComment)
  
</qcommentcontainer>