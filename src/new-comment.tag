<newcomment>
  <div class="qc-comment qc-new">
    <div class="qc-user qc-logged-out" if={ !parent.user }>
      <p>Sign in to post a comment.</p>
      <ul class="qc-login-opts">
        <li each={ parent.providers }>
          <a href="#" class="provicer-{ name }" onclick={ login }>{ name }</a>
        </li>
      </ul>
    </div>
    <div class="qc-user qc-logged-in" if={ parent.user }>
      { parent.user.name }
<!--       <div class="headshot">
        <img src="http://www.gravatar.com/avatar/e3f99640d60577f72086b54087423593.png?s=200">
      </div> -->
    </div>
    <form>
      <textarea rows="{ height }" class="gc-new-body form-control" name="body" onfocus={ grow }></textarea>
      <button class="submit" name="submit" onclick={ send }>Submit</button>
    </form>
    <hr/>
  </div>

  this.height = 1

  send(e) {

    if(!this.spamFree){
      throw "Can't save spammy comments"
    }else{
      this.parent.save(this)
      body.value = ""
      this.shrink()
    }
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

</newcomment>
