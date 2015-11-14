


/**
 * This module formats precise time differences as a vague/fuzzy
 * time, e.g. '3 weeks ago', 'just now' or 'in 2 hours'.
 */

 /*globals define, module */

(function (globals) {
    'use strict';

    var times = {
        year: 31557600000, // 1000 ms * 60 s * 60 m * 24 h * 365.25 d
        month: 2629800000, // 31557600000 ms / 12 m
        week: 604800000, // 1000 ms * 60 s * 60 m * 24 h * 7 d
        day: 86400000, // 1000 ms * 60 s * 60 m * 24 h
        hour: 3600000, // 1000 ms * 60 s * 60 m
        minute: 60000 // 1000 ms * 60 s
    },

    languages = {
        en: {
            year: [ 'year', 'years' ],
            month: [ 'month', 'months' ],
            week: [ 'week', 'weeks' ],
            day: [ 'day', 'days' ],
            hour: [ 'hour', 'hours' ],
            minute: [ 'minute', 'minutes' ],
        
            past: function (vagueTime, unit) {
                return vagueTime + ' ' + unit + ' ago';
            },
        
            future: function (vagueTime, unit) {
                return 'in ' + vagueTime + ' ' + unit;
            },
        
            defaults: {
                past: 'just now',
                future: 'soon'
            }
        }
    },

    defaultLanguage = 'en',

    functions = {
        get: getVagueTime
    };

    exportFunctions();

    /**
     * Public function `get`.
     *
     * Returns a vague time, such as '3 weeks ago', 'just now' or 'in 2 hours'.
     *
     * @option [from] {Date}    The origin time. Defaults to `Date.now()`.
     * @option [to] {Date}      The target time. Defaults to `Date.now()`.
     * @option [units] {string} If `from` or `to` are timestamps rather than date
     *                          instances, this indicates the units that they are
     *                          measured in. Can be either `ms` for milliseconds
     *                          or `s` for seconds. Defaults to `ms`.
     * @option [lang] {string}  The output language. Default is specified as a
     *                          build option.
     */
    function getVagueTime (options) {
        var units = normaliseUnits(options.units),
            now = Date.now(),
            from = normaliseTime(options.from, units, now),
            to = normaliseTime(options.to, units, now),
            difference = from - to,
            type;

        if (difference >= 0) {
            type = 'past';
        } else {
            type = 'future';
            difference = -difference;
        }

        return estimate(difference, type, options.lang);
    }

    function normaliseUnits (units) {
        if (typeof units === 'undefined') {
            return 'ms';
        }

        if (units === 's' || units === 'ms') {
            return units;
        }

        throw new Error('Invalid units');
    }

    function normaliseTime(time, units, defaultTime) {
        if (typeof time === 'undefined') {
            return defaultTime;
        }

        if (typeof time === 'string') {
            time = parseInt(time, 10);
        }

        if (isNotDate(time) && isNotTimestamp(time)) {
            throw new Error('Invalid time');
        }

        if (typeof time === 'number' && units === 's') {
            time *= 1000;
        }

        return time;
    }

    function isNotDate (date) {
        return Object.prototype.toString.call(date) !== '[object Date]' || isNaN(date.getTime());
    }

    function isNotTimestamp (timestamp) {
        return typeof timestamp !== 'number' || isNaN(timestamp);
    }

    function estimate (difference, type, language) {
        var time, vagueTime, lang = languages[language] || languages[defaultLanguage];

        for (time in times) {
            if (times.hasOwnProperty(time) && difference >= times[time]) {
                vagueTime = Math.floor(difference / times[time]);
                return lang[type](vagueTime, lang[time][(vagueTime > 1)+0]);
            }
        }

        return lang.defaults[type];
    }

    function exportFunctions () {
        if (typeof define === 'function' && define.amd) {
            define(function () {
                return functions;
            });
        } else if (typeof module !== 'undefined' && module !== null) {
            module.exports = functions;
        } else {
            globals.vagueTime = functions;
        }
    }
}(this));




riot.tag2('comment', '<div class="qc-comment" id="comment/{id.substr(-7)}"> <div class="avatar"> <a href="{author.url}"><img riot-src="{author.avatar}"></a> </div> <div class="qc-header"> <a href="{author.url}" class="{author:1, text-muted:b}">{author.name}</a> | <a href="#comment/{id}" class="{timestamp:1, text-muted:b}" title="{new Date(opts.data.time).toLocaleString()}">{vagueTime}</a> <a href="#" role="button" class="{edit:1, text-muted:b}" if="{false}">Edit</a> </div> <div class="qc-body"> <p each="{p in paragraphs}">{p}</p> </div> <hr> </div>', '', '', function(opts) {

  this.id = opts.data.id
  this.author = opts.data.author
  if(this.parent.parent.opts.meow) opts.data.body = opts.data.body.replace(/[A-Za-z]+/g,'meow');
  this.paragraphs = opts.data.body.split(/\n+/)
  var vagueTime = window.vagueTime || false
  this.vagueTime = (!!vagueTime ? vagueTime.get({to: opts.data.time}) : new Date(opts.data.time).toLocaleString())
  this.b = this.parent.parent.opts.bootstrap

}, '{ }');


riot.tag2('newcomment', '<div class="qc-comment qc-new"> <fieldset> <textarea __disabled="{parent.Auth.loggedIn() ? undefined : true}" rows="{height}" class="{gc-new-body:1, form-control:b}" name="body" onfocus="{grow}" onblur="{shrink}" onkeydown="{update}" placeholder="{parent.Auth.loggedIn() ? \'Leave a comment\' : \'Sign in to post a comment.\'}"></textarea> <div class="qc-user qc-logged-in" if="{parent.Auth.loggedIn()}"> <p>Logged in as {parent.Auth.currentUser().name} (via {capitalize(parent.Auth.currentUser().provider)}). <a href="#" role="button" onclick="{logout}"> Log out or switch accounts</a> </p> </div> <div class="{qc-signin:1, input-group-btn:b}" if="{!parent.Auth.loggedIn() || b}"> <button class="{qc-logged-out:1, btn:b, btn-default:b, dropdown-toggle:b}" data-toggle="dropdown" if="{!parent.Auth.loggedIn() && b}">Sign in<span class="caret"></span></button> <span if="{!b}">Sign in:</span> <ul class="{qc-login-opts:1, dropdown-menu:b, dropdown-menu-right:b}" role="menu"> <li each="{name, val in parent.Auth.providers}" if="{val.available}"> <a href="#" role="button" onclick="{parent.login}" class="provider {name}">{parent.capitalize(name)}</a> </li> </ul> </div> <button __disabled="{this.body.value.length ? undefined : true}" class="{submit:1, btn:b, btn-primary:b}" name="submit" onclick="{send}" if="{parent.Auth.loggedIn()}">Submit</button> </fieldset> <hr> </div>', '', '', function(opts) {

  this.height = 1

  this.b = this.parent.opts.bootstrap

  this.send = function(e) {
    if(!this.spamFree()) throw "Can't save spammy comments"
    if(!this.body.value.length) return;

    this.parent.save(this)
    this.body.value = ""
    this.shrink()
  }.bind(this)

  this.spamFree = function() {
    return true
  }.bind(this)

  this.grow = function(e){
    this.height = 5
  }.bind(this)

  this.shrink = function(e){
    if(this.body.value.length < 1) this.height = 1
  }.bind(this)

  this.login = function(e){
    this.parent.Auth.login(e.item.name)
  }.bind(this)

  this.logout = function(e){
    this.parent.Auth.logout()
  }.bind(this)

  this.change = function(type, auth){
    this.update()
  }.bind(this)
  this.parent.Auth.on("login logout", this.change)

  this.capitalize = function(s){
    return s.split(" ").map(function(e){var a = e.split(""); a.unshift(a.shift().toUpperCase()); return a.join("")}).join(" ")
  }.bind(this)

}, '{ }');


riot.tag2('qcomment', '<h2 id="comments">Comments ({comments.length})</h2> <newcomment></newcomment> <div class="qc-comments"><comment each="{comments}" data="{this}"></comment></div>', '', '', function(opts) {

  this.providers = opts.providers
  this.pageID    = opts.pageID
  this.firebase  = opts.firebase
  this.Auth      = opts.Auth

  this.dataset   = this.firebase.child('comments').child(this.pageID)
  this.comments  = []

  this.save = function(comment){
    if(!opts.Auth.currentUser()) throw "Must be logged in to comment"
    this.dataset.push({
      author: this.Auth.currentUser(),
      time: Date.now(),
      body: comment.body.value
    })
  }.bind(this)

  this.getComment = function(snapshot){
    var comment = snapshot.val()
    comment.id = snapshot.key()
    return comment
  }.bind(this)
  this.addComment = function(snapshot){
    var comment = this.getComment(snapshot)
    this.comments.unshift(comment)
    return this.update()
  }.bind(this)
  this.updateComment = function(snapshot){
    var comment = this.getComment(snapshot)
    for(var i = this.comments.length;i-->0;){
      if(this.comments[i].id === comment.id){
        this.comments[i] = comment
        return this.update()
      }
    }
  }.bind(this)
  this.removeComment = function(snapshot){
    var comment = this.getComment(snapshot)
    for(var i = this.comments.length;i-->0;){
      if(this.comments[i].id === comment.id){
        this.comments.splice(i,1)
        return this.update()
      }
    }
  }.bind(this)

  var query = this.dataset.orderByChild('time').limitToFirst(opts.limit)
  query.on("child_added",   this.addComment)
  query.on("child_changed", this.updateComment)
  query.on("child_removed", this.removeComment)

  this.core.innerText = ".qc-header {"+
    "overflow: hidden;"+
  "}"+
  ".qc-body {"+
    "overflow: hidden;"+
  "}"+
  ".qc-new textarea {"+
    "width: 100%;"+
  "}"+
  ".avatar img {"+
    "max-width: 5em;"+
  "}";

}, '{ }');



var QC = function(riot){

  var providers = {
    facebook: {available: true},
    github: {available: true},
    twitter: {available: true},
    google: {available: true},
    password: {
      type: "authWithPassword",
      available: false, //todo unimplemented
    },
    anonymous: {
      type: "authAnonymously",
      available: false, //todo unimplemented
    },
    custom: {
      type: 'authWithCustomToken',
      available: false, //todo unimplemented
    }
  };

  /* Authentication wrapper (with Events!) */
  function Auth(FB, providers){
    riot.observable(this);
    this.providers = providers;

    this.currentUser = function(){
      var auth = FB.getAuth();
      if(!auth) return null;
      var profile = auth[auth.provider].cachedUserProfile;
      var info = {};
      info.name = auth[auth.provider].displayName;
      info.uid = auth.uid;
      info.provider = auth.provider;
      switch(auth.provider){
        case "facebook":
          info.avatar = profile.picture.data.url;
          info.url = profile.link;
          break;
        case "twitter":
          info.avatar = profile.profile_image_url;
          info.url = "http://twitter.com/"+profile.screen_name;
          break;
        case "github":
          info.avatar = profile.avatar_url;
          info.url = profile.html_url;
          break;
        case "google":
          info.avatar = profile.picture;
          info.url = profile.link;
          break;
      }
      return info;
    };

    this.loggedIn = function(){
      return !!FB.getAuth();
    };

    var self = this;
    FB.onAuth(function(auth){
        if(!auth) return self.trigger('logout');
        FB.child('users').child(auth.uid).set(auth);
        return self.trigger('login', auth);
    });

    this.login = function(method){
      if(this.currentUser()) throw "Already logged in";
      var p = this.providers[method];
      if(!p || p.available===false) throw "Provider unavailable";
      FB[p.type || "authWithOAuthPopup"](method, function(err, auth){
        if(err) throw err;
      });
    };

    this.logout = function(){
      FB.unauth();
    };
  }

  return function(opts){
    if(!opts.firebase) throw "Firebase is required";

    //if no pageID was specified, use the url's path
    // The URL encoding and replacement is to meet Firebase's ID conventions
    opts.pageID = encodeURIComponent( opts.pageID || window.location.pathname ).replace('.','-');

    opts.limit = (opts.limit > 0 ? opts.limit : 100);

    //Enable/disable proviers from the options object
    for(var a in opts.authMethods){
      if((opts.authMethods.hasOwnProperty(a) && !opts.authMethods[a]) &&     //if the option is configured and disabled
            providers.hasOwnProperty(a) ){                                   // and it is a valid provider
        providers[a].available = false;
      }
    }

    opts.Auth = new Auth(opts.firebase, providers);
    riot.mount('qcomment', opts);
  };
}(riot);