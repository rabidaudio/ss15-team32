var FB = new Firebase('cjk-blog.firebaseio.com');

var pageID = pageID || window.location.pathname;

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
  c.save();
});

function Comment(message, user, pageID){
  this.date = new Date();
  this.message = message;
  this.pageID = pageID;
  this.user = user;
  if(!user){
    //throw some error
  }

  var spamFree = null; //null before test, true or false after test
}

Comment.prototype._checkSpam = function(callback){
  this.spamFree = true; //TODO
  callback(this.spamFree);
};

Comment.prototype.save = function(callback){
  this._checkSpam(function(spamFree){
    if(!this.spamFree) return callback("Can't save spammy comments");
    FB.child('comments').child(pageID).push(this, callback);
  });
};