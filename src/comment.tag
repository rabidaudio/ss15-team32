<comment>
  <div class="qc-comment" id="comment/{ data.id }">
    <div class="avatar">
      <a href="{ data.author.url }"><img src="{ data.author.avatar }"></a>
    </div>
    <div class="qc-header">
      <a href="{ data.author.url }" class="author text-muted">{ data.author.name }</a> | 
      <a href="#comment/{ data.id }" class="timestamp text-muted" title="{ new Date(data.time).toLocaleString() }">{ vagueTime }</a>
    </div>
    <div class="qc-body">{ data.body }</div>
    <hr/>
  </div>

  this.data = opts.data
  this.vagueTime = vagueTime.get({to: this.data.time}) //todo enable language support
</comment>