<newcomment>
  <div class="qc-comment qc-new">
    <fieldset disabled={ parent.loggedIn ? undefined : true }>
      <textarea rows="{ height }" class="gc-new-body form-control" name="body" onfocus={ grow } placeholder="{ parent.loggedIn ? 'Leave a comment' : 'Sign in to post a comment.' }"></textarea>
      <button class="submit btn" name="submit" onclick={ send }>Submit</button>
    </fieldset>
    <hr/>
  </div>

  this.height = 1

  send(e) {
    if(!this.spamFree()) throw "Can't save spammy comments"

    this.parent.parent.save(this)
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

</newcomment>
