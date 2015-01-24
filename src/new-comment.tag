<newcomment>
  <div class="qc-comment qc-new">
    <fieldset disabled={ parent.Auth.loggedIn() ? undefined : true }>
      <textarea rows="{ height }" class="gc-new-body form-control" name="body" onfocus={ grow } placeholder="{ parent.Auth.loggedIn() ? 'Leave a comment' : 'Sign in to post a comment.' }"></textarea>
      <div class="qc-user qc-logged-in" if={ parent.Auth.loggedIn() }>
        <p>Logged in as { parent.Auth.currentUser().name } (via { capitalize(parent.Auth.currentUser().provider) }). <a href="#" role="button" onclick={ logout }>
          Log out or switch accounts</a>
        </p>
      </div>
      <div class="qc-user qc-logged-out" if={ !parent.Auth.loggedIn() }>
        Sign in:
        <ul class="qc-login-opts">
          <li each={ name, val in parent.Auth.providers } if={ val.available }>
            <a href="#" role="button" onclick={ parent.login } class="provider-{ name }">{ parent.capitalize(name) }</a>
          </li>
        </ul>
      </div>
      <button class="submit btn" name="submit" onclick={ send }>Submit</button>
    </fieldset>
    <hr/>
  </div>

  this.height = 1

  send(e) {
    if(!this.spamFree()) throw "Can't save spammy comments"

    this.parent.save(this)
    this.body.value = ""
    this.shrink()
  }
  
  spamFree() {
    return true //todo
  }

  grow(e){
    this.height = 5
  }

  shrink(e){
    this.height = 1
  }
  
  login(e){
    this.parent.Auth.login(e.item.name)
  }

  logout(e){
    this.parent.Auth.logout()
  }

  var self = this
  this.parent.Auth.on('login logout', function(auth){
    self.update()
  })

  capitalize(s){
    return s.split(" ").map(function(e){ var a = e.split(""); a.unshift(a.shift().toUpperCase()); return a.join("") }).join(" ")
  }

</newcomment>
