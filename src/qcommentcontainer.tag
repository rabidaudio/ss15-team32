<qcommentcontainer>
  <div class="qc-comments">
    <newcomment></newcomment>
    <comment each={ comments } data={ this }></comment>
  </div>

  this.providers = opts.providers
  this.pageID    = opts.pageID
  this.FB        = opts.FB
  this.comments  = []

  this.user = {name: "bob", email: "abc@123.xyz"} //todo

  this.dataset   = this.FB.child('comments').child(this.pageID)  

  updateComments(snapshot){
    var comment = snapshot.val()
    comment.id = snapshot.key()
    this.comments.push(comment)
    this.update()
  }

  save(comment){
    this.dataset.push({
      author: this.user,
      time: (new Date()).toISOString(),
      body: comment.body.value
    })
  }

  this.dataset.on("child_added", this.updateComments)
  
</qcommentcontainer>