var FB = new Firebase('cjk-blog.firebaseio.com');

var pageID = pageID || encodeURIComponent(window.location.pathname);

riot.mount('qcomment', {
  body: "bullshit",
  author: {
    name: "debbie downer",
    email: "d@q.org"
  }
});