<newcomment>
  <div class="qc-comment qc-new">
    <form>
      <textarea rows="{ height }" class="gc-new-body form-control" name="body" onfocus={ grow }></textarea>
      <button class="submit" name="submit" onclick={ send }>Submit</button>
    </form>
    <hr/>
  </div>

  this.height = 1

  send(e) {

    if(!this.spamFree()){
      throw "Can't save spammy comments"
    }else{
      this.parent.parent.save(this)
      this.body.value = ""
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
