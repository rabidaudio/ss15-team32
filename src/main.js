var QC = function(riot, Firebase){
  if(!riot) throw "Riot.js is required";
  if(!Firebase) throw "Firebase is required";

  return function(opts){
    riot.mount('qcommentcontainer', {
      FB:       new Firebase(opts.firebase),
      pageID:   opts.pageID || encodeURIComponent(window.location.pathname),
      providers: [
        {
          name: "facebook",
          login: function(){
            console.log("yay!");
          }
        },
      ]
    });
  };
}(riot, Firebase);