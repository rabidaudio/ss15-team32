<newcomment>
  <div class="qc-comment qc-new">
    <fieldset class="input-group">
      <textarea disabled={parent.Auth.loggedIn() ? undefined : true} rows={height} class="gc-new-body form-control" name="body" onfocus={grow} onblur={shrink} onkeydown={update} placeholder={parent.Auth.loggedIn() ? 'Leave a comment' : 'Sign in to post a comment.'}></textarea>
      <div class="qc-user qc-logged-in" if={parent.Auth.loggedIn()}>
        <p>Logged in as {parent.Auth.currentUser().name} (via {capitalize(parent.Auth.currentUser().provider)}). <a href="#" role="button" onclick={logout}>
          Log out or switch accounts</a>
        </p>
      </div>
      <div class="input-group-btn qc-signin">
        <button class="qc-logged-out btn btn-default dropdown-toggle" data-toggle="dropdown" if={!parent.Auth.loggedIn()}>Sign in<span class="caret"></span></button>
        <ul class="qc-login-opts dropdown-menu dropdown-menu-right" role="menu">
          <li each={name, val in parent.Auth.providers} if={val.available}>
            <a href="#" role="button" onclick={parent.login} class="provider-{name}">{parent.capitalize(name)}</a>
          </li>
        </ul>
        <button disabled={this.body.value.length ? undefined : true} class="submit btn btn-primary" name="submit" onclick={send} if={parent.Auth.loggedIn()}>Submit</button>
      </div>
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
    if(this.body.value.length < 1) this.height = 1
  }

  login(e){
    this.parent.Auth.login(e.item.name)
  }

  logout(e){
    this.parent.Auth.logout()
  }

  change(type, auth){
    this.update() 
  }
  this.parent.Auth.on("login logout", this.change) //this drives me crazy

  capitalize(s){
    return s.split(" ").map(function(e){var a = e.split(""); a.unshift(a.shift().toUpperCase()); return a.join("")}).join(" ")
  }

</newcomment>