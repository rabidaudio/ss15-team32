<auth>
  <div class="qc-user qc-logged-in" if={ loggedIn }>
    <p>Logged in as { currentUser().name } (via { capitalize(currentUser().provider) })<a href="#" role="button" onclick={ logout }>
      Log out or switch accounts</a>
    </p>
  </div>
  <div class="qc-user qc-logged-out" if={ !loggedIn }>
    Sign in:
    <ul class="qc-login-opts">
      <li each={ name, val in providers } if={ val.available }>
        <a href="#" role="button" onclick={ parent.login } class="provider-{ name }">{ parent.capitalize(name) }</a>
      </li>
    </ul>
  </div>
  <newcomment/>

  capitalize(sentence){
    return sentence.split(" ").map(function(e){ var a = e.split(""); a.unshift(a.shift().toUpperCase()); return a.join(""); }).join(" ");
  }
  currentUser(){
    return this.parent.currentUser();
  }

  var firebase = this.parent.firebase;

  this.providers = this.opts.data;
  this.loggedIn = !!this.currentUser();

  login(e){
    firebase.authWithOAuthPopup(e.item.name, this.authHandler);
  }
  logout(){
    firebase.unauth();
    this.update({loggedIn: false});
  }
  authHandler(err, auth){
    if(err){
      console.error(err);
      //handle
      return;
    }
    console.log(this)
    firebase.child('users').child(auth.uid).set(auth);
    this.update({loggedIn: true});
  }
</auth>