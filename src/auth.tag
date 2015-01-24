<auth>
  <div class="qc-user qc-logged-in" if={ loggedIn }>
    <p>Logged in. <a href="#" onclick={ logout }>Log out</a></p>
<!--       <div class="headshot">
      <img src="http://www.gravatar.com/avatar/e3f99640d60577f72086b54087423593.png?s=200">
    </div> -->
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
    if(err) console.error(err);
    this.loggedIn = !!auth;
    this.update();
  }
</auth>