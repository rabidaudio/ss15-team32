<qcommentcontainer class="qc-comments">
  <newcomment></newcomment>
  <comment each={ this.comments }></comment>

  this.providers = opts.providers
  this.pageID    = opts.pageID
  this.FB        = opts.FB

  this.user = opts.user //todo

  this.dataset   = FB.child('comments').child(pageID)

  this.dataset.on("value", function(snapshot){
    this.comments = snapshot.val();
  });
  
</qcommentcontainer>