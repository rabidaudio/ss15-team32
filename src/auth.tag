<auth>
  <ul class="qc-login-opts">
    <li each={ name, val in providers } if={ val.available }>
      <provider data={ name }></provider>
    </li>
  </ul>
  this.providers = {
    facebook: {
      type: "oauth",
      available: true
    },
    github: {
      type: "oauth",
      available: true
    },
    twitter: {
      type: "oauth",
      available: false,
    }
  }

  login(provider){
    this.parent.FB.authWithOAuthPopup(provider, this.authHandler);
  }
  authHandler(err, auth){
    if(err) throw err;
  }
</auth>