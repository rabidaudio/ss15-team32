<comment>
  <div class="qc-comment" id="comment/{ data.id }">
    <div class="avatar">
      <a href="{ data.author.url }"><img src="{ data.author.avatar }"></a>
    </div>
    <div class="qc-header">
      <a href="{ data.author.url }" class="author">{ data.author.name }</a>
      <a href="#comment/{ data.id }" class="timestamp">{ new Date(data.time).toLocaleString() }</a>
    </div>
    <div class="qc-body">{ data.body }</div>
    <hr/>
  </div>

  this.data = opts.data
</comment>