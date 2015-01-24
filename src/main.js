var FB = new Firebase('cjk-blog.firebaseio.com');

var pageID = pageID || encodeURIComponent(window.location.pathname);

riot.mount('qcommentcontainer', {
  providers: [
    {
      name: "facebook",
      login: function(){
        console.log("yay!");
      }
    },
  ],
  pageID: pageID,
  comments: [
    {
      body: "bullshit",
      author: {
        name: "debbie downer",
        email: "d@q.org"
      }
    },
    {
      body: "cool, yo",
      author: {
        name: "somebody",
        email: "d@q.org"
      }
    },
  ]
});