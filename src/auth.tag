<auth>
  <div class="qc-user qc-logged-in" if={ loggedIn }>
    <p>Logged in. <a href="#" onclick={ logout }>Log out</a></p>
  </div>
  <div if={ loggedIn }>
    <newcomment></newcomment>
  </div>
  <div class="qc-user qc-logged-out" if={ !loggedIn }>
    <p>Sign in to post a comment.</p>
    <ul class="qc-login-opts">
      <li each={ name, val in providers } if={ val.available }>
        <provider data={ name }></provider>
      </li>
    </ul>
  </div>

  this.providers = this.opts.data;
  this.loggedIn = !!this.parent.currentUser();

  var firebase = this.parent.firebase;

  login(provider){
    firebase.authWithOAuthPopup(provider, this.authHandler);
  }
  logout(){
    firebase.unauth();
    this.loggedIn = false;
  }
  authHandler(err, auth){
    if(err){
      console.error(err);
      //handle
      return;
    }
    firebase.child('users').child(auth.uid).set(auth);
    this.loggedIn = true;
    this.update();
  }
</auth>