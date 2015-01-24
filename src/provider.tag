<provider>
  <a href="#" onclick={ login } class="provider-{ opts.data }">{ opts.data }</a>

  login(){
    this.parent.parent.login(this.opts.data) //ewwww....
  }
</provider>