<newcomment>
  <div class="qc-comment qc-new">
    <fieldset>
      <textarea disabled={parent.Auth.loggedIn() ? undefined : true} rows={height} class={gc-new-body:1, form-control:b} name="body" onfocus={grow} onblur={shrink} onkeydown={update} placeholder={parent.Auth.loggedIn() ? 'Leave a comment' : 'Sign in to post a comment.'}></textarea>
      <div class="qc-user qc-logged-in" if={parent.Auth.loggedIn()}>
        <p>Logged in as {parent.Auth.currentUser().name} (via {capitalize(parent.Auth.currentUser().provider)}). <a href="#" role="button" onclick={logout}>
          Log out or switch accounts</a>
        </p>
      </div>
      <div class={qc-signin:1, input-group-btn:b} if={!parent.Auth.loggedIn() || b}>
        <button class={qc-logged-out:1, btn:b, btn-default:b, dropdown-toggle:b} data-toggle="dropdown" if={!parent.Auth.loggedIn() && b}>Sign in<span class="caret"></span></button>
        <span if={!b}>Sign in:</span>
        <ul class={qc-login-opts:1, dropdown-menu:b, dropdown-menu-right:b} role="menu">
          <li each={name, val in parent.Auth.providers} if={val.available}>
            <a href="#" role="button" onclick={parent.login} class="provider {name}">{parent.capitalize(name)}</a>
          </li>
        </ul>
      </div>
      <button disabled={this.body.value.length ? undefined : true} class={submit:1, btn:b, btn-primary:b} name="submit" onclick={send} if={parent.Auth.loggedIn()}>Submit</button>
    </fieldset>
    <hr/>
  </div>

  this.height = 1

  this.b = this.parent.opts.bootstrap

  send(e) {
    if(!this.spamFree()) throw "Can't save spammy comments"
    if(!this.body.value.length) return;

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