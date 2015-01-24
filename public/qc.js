var FB = new Firebase('cjk-blog.firebaseio.com');

var pageID = pageID || encodeURIComponent(window.location.pathname);

//ref.child("users").child(authData.uid).set(authData);

// var auth = function(provider){
//   switch(provider){
//     case "anonymous":
//       FB.authAnonymously(function(err, a){});
//       break;

//     case "password":
//       //popup username+password
//       //FB.authWithPassword
//       break;

//     case "facebook":
//     case "google":
//     case "twitter":
//     case "github":
//       FB.authWithOAuthPopup(provider, function(err, a){});
//       break;
//     default:
//       throw "Invalid auth type";
//   }
// }

$('.gc-new-body').focus(function(){
  $(this).attr('rows', 5).off('focus');
});
$('.qc-new .submit').click(function(){
  var c = new Comment($('.gc-new-body').val(), {cats: "meow"}, pageID);
  c.save(function(err){
    if(err) throw err;
  });
});

function Comment(message, user){
  this.date = (new Date()).toISOString();
  this.message = message;
  this.user = user;
  if(!user){
    //throw some error
  }
}

var providers = {
  facebook: {}, //etc
}

Comment.prototype._checkSpam = function(callback){
  spamFree = true; //TODO
  callback(spamFree);
};
Comment.prototype.save = function(callback){
  callback = callback || new Function();
  var comment = this;
  this._checkSpam(function(spamFree){
    if(!spamFree) return callback("Can't save spammy comments");
    FB.child('comments').child(pageID).push(comment, callback);
  });
};

riot.tag('qcomment', '<div class="qc-body">{ body }</div><div class="qc-author"><a href="mailto:{ author.email }">{ author.name }</a></div><hr/>', function(data){
  this.body   = data.body;
  this.author = data.author;
});
riot.mount('qcomment', {
  body: "bullshit",
  author: {
    name: "debbie downer",
    email: "d@q.org"
  }
});