var FB = new Firebase('cjk-blog.firebaseio.com');

var auth = function(provider){
  switch(provider){
    case "anonymous":
      FB.authAnonymously(function(err, a){});
      break;

    case "password":
      //popup username+password
      //FB.authWithPassword
      break;

    case "facebook":
    case "google":
    case "twitter":
    case "github":
      FB.authWithOAuthPopup(provider, function(err, a){});
      break;
    default:
      throw "Invalid auth type";
  }
}

$('.gc-new-body').focus(function(){
  $(this).attr('rows', 5).off('focus');
});