/* 2015-01-24 */riot.tag('qcommentnew', '<div class="qc-user qc-logged-out"> <p>Sign in to post a comment.</p> <ul class="qc-login-opts"> <li each="{ providers }"> <a href="#" class="provicer-{ name }" onclick="{ login }">{ name }</a> </li> </ul> </div> <form onsubmit="{ comment }">      <textarea rows="1" class="gc-new-body form-control disabled"></textarea>\n <button class="submit">Submit</button> </form> <hr></hr>', function(opts) {
})



riot.tag('qcomment', '<div class="qc-body">{ body }</div> <div class="qc-author"> <a href="mailto:bob@example.com">Some dude</a> </div> <hr></hr>', function(opts) {
})


var FB = new Firebase('cjk-blog.firebaseio.com');

var pageID = pageID || encodeURIComponent(window.location.pathname);

riot.mount('qcomment', {
  body: "bullshit",
  author: {
    name: "debbie downer",
    email: "d@q.org"
  }
});