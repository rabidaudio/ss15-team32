<comment>
  <div class="qc-comment" id="comment/{id}">
    <div class="avatar">
      <a href="{author.url}"><img src="{author.avatar}"></a>
    </div>
    <div class="qc-header">
      <a href="{author.url}" class="author text-muted">{author.name}</a> | 
      <a href="#comment/{id}" class="timestamp text-muted" title="{new Date(opts.data.time).toLocaleString()}">{vagueTime}</a>
      <a href="#" role="button" class="edit text-muted" if={false}>Edit</a>
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
  this.vagueTime = vagueTime.get({to: opts.data.time}) //todo enable language support

</comment>