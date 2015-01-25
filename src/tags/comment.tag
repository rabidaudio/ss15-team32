<comment>
  <div class="qc-comment" id="comment/{id.substr(-7)}">
    <div class="avatar">
      <a href="{author.url}"><img src="{author.avatar}"></a>
    </div>
    <div class="qc-header">
      <a href="{author.url}" class={author:1, text-muted:b}>{author.name}</a> | 
      <a href="#comment/{id}" class={timestamp:1, text-muted:b} title="{new Date(opts.data.time).toLocaleString()}">{vagueTime}</a>
      <a href="#" role="button" class={edit:1, text-muted:b} if={false}>Edit</a>
    </div>
    <div class="qc-body">
      <p each={p in paragraphs}>{p}</p>
    </div>
    <hr/>
  </div>

  this.id = opts.data.id
  this.author = opts.data.author
  if(this.parent.parent.opts.meow) opts.data.body = opts.data.body.replace(/[A-Za-z]+/g,'meow'); //so sneaky so cute
  this.paragraphs = opts.data.body.split(/\n+/)
  var vagueTime = window.vagueTime || false
  this.vagueTime = (!!vagueTime ? vagueTime.get({to: opts.data.time}) : new Date(opts.data.time).toLocaleString()) //todo enable language support
  this.b = this.parent.parent.opts.bootstrap

</comment>