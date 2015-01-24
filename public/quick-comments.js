/* 2015-01-24 */riot.tag('newcomment', '<div class="qc-user qc-logged-out"> <p>Sign in to post a comment.</p> <ul class="qc-login-opts"> <li each="{ opts.providers }"> <a href="#" class="provicer-{ name }" onclick="{ login }">{ name }</a> </li> </ul> </div> <form onsubmit="{ comment }">    <textarea rows="1" class="gc-new-body form-control disabled"></textarea>\n <button class="submit">Submit</button> </form> <hr></hr>', function(opts) {
  this.comment = function(form) {

    if(!this.spamFree){
      throw "Can't save spammy comments"
    }else{
      FB.child('comments').child(pageID).push(comment, callback);
    }
  }.bind(this)
  
  this.spamFree = function() {
    return true //todo
  }.bind(this)

})



riot.tag('comment', '<div class="qc-body">{ body }</div> <div class="qc-author"> <a href="mailto:{ author.email }">{ author.name }</a> </div> <hr></hr>', function(opts) {
  this.body   = opts.body;
  this.author = opts.author;

})


riot.tag('newcomment', '<div class="qc-user qc-logged-out"> <p>Sign in to post a comment.</p> <ul class="qc-login-opts"> <li each="{ parent.providers }"> <a href="#" class="provicer-{ name }" onclick="{ login }">{ name }</a> </li> </ul> </div> <form>    <textarea rows="{ height }" class="gc-new-body form-control" name="body" onfocus="{ grow }"></textarea>\n <button class="submit" name="submit" onclick="{ send }">Submit</button> </form> <hr></hr>', function(opts) {
  this.height = 1

  this.send = function(e) {

    if(!this.spamFree){
      throw "Can't save spammy comments"
    }else{
      console.log({
        user: parent.user,
        body: this.body.value,
        time: (new Date()).toISOString()
      })
    }
  }.bind(this)
  
  this.spamFree = function() {
    return true //todo
  }.bind(this)

  this.grow = function(e) {
    this.height = 5
  }.bind(this)

})



riot.tag('commentnew', '<div class="qc-user qc-logged-out"> <p>Sign in to post a comment.</p> <ul class="qc-login-opts"> <li each="{ opts.providers }"> <a href="#" class="provicer-{ name }" onclick="{ login }">{ name }</a> </li> </ul> </div> <form onsubmit="{ comment }">    <textarea rows="1" class="gc-new-body form-control disabled"></textarea>\n <button class="submit">Submit</button> </form> <hr></hr>', function(opts) {
  this.comment = function(form) {

    if(!this.spamFree){
      throw "Can't save spammy comments"
    }else{
      FB.child('comments').child(pageID).push(comment, callback);
    }
  }.bind(this)
  
  this.spamFree = function() {
    return true //todo
  }.bind(this)

})



riot.tag('comment', '<div class="qc-body">{ body }</div> <div class="qc-author"> <a href="mailto:{ author.email }">{ author.name }</a> </div> <hr></hr>', function(opts) {
  this.body   = opts.body;
  this.author = opts.author;

})


riot.tag('qcommentcontainer', '<newcomment></newcomment> <comment each="{ this.comments }"></comment>', function(opts) {
  this.providers = opts.providers
  this.pageID    = opts.pageID
  this.FB        = opts.FB

  this.user = opts.user //todo

  this.dataset   = FB.child('comments').child(pageID)

  this.dataset.on("value", function(snapshot){
    this.comments = snapshot.val();
  });
  
})


var FB = new Firebase('cjk-blog.firebaseio.com');

var pageID = pageID || encodeURIComponent(window.location.pathname);

riot.mount('qcommentcontainer', {
  providers: [
    {
      name: "facebook",
      login: function(){
        console.log("yay!");
      }
    },
  ],
  pageID: pageID,
  comments: [
    {
      body: "bullshit",
      author: {
        name: "debbie downer",
        email: "d@q.org"
      }
    },
    {
      body: "cool, yo",
      author: {
        name: "somebody",
        email: "d@q.org"
      }
    },
  ]
});