


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
        br: {
            year: [ 'ano', 'anos' ],
            month: [ 'mês', 'meses' ],
            week: [ 'semana', 'semanas' ],
            day: [ 'dia', 'dias' ],
            hour: [ 'hora', 'horas' ],
            minute: [ 'minuto', 'minutos' ],

            past: function (vagueTime, unit) {
                return vagueTime + ' ' + unit + ' atrás';
            },

            future: function (vagueTime, unit) {
                return 'em ' + vagueTime + ' ' + unit;
            },

            defaults: {
                past: 'agora mesmo',
                future: 'em breve'
            }
        }
,
        da: {
            year: [ 'år', 'år' ],
            month: [ 'måned', 'måneder' ],
            week: [ 'uge', 'uger' ],
            day: [ 'dag', 'dage' ],
            hour: [ 'time', 'timer' ],
            minute: [ 'minut', 'minutter' ],
        
            past: function (vagueTime, unit) {
                return vagueTime + ' ' + unit + ' siden';
            },
        
            future: function (vagueTime, unit) {
                return 'om ' + vagueTime + ' ' + unit;
            },
        
            defaults: {
                past: 'lige nu',
                future: 'snart'
            }
        },
        de: {
            year: [ 'Jahr', 'Jahren' ],
            month: [ 'Monat', 'Monaten' ],
            week: [ 'Woche', 'Wochen' ],
            day: [ 'Tag', 'Tagen' ],
            hour: [ 'Stunde', 'Stunden' ],
            minute: [ 'Minute', 'Minuten' ],
        
            past: function (vagueTime, unit) {
                return 'vor ' + vagueTime + ' ' + unit;
            },
        
            future: function (vagueTime, unit) {
                return 'in ' + vagueTime + ' ' + unit;
            },
        
            defaults: {
                past: 'jetzt gerade',
                future: 'bald'
            }
        },
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
        },
        fr: {
            year: [ 'an', 'ans' ],
            month: [ 'mois', 'mois' ],
            week: [ 'semaine', 'semaines' ],
            day: [ 'jour', 'jours' ],
            hour: [ 'heure', 'heures' ],
            minute: [ 'minute', 'minutes' ],
        
            past: function (vagueTime, unit) {
                return 'il y a ' + vagueTime + ' ' + unit;
            },
        
            future: function (vagueTime, unit) {
                return 'dans ' + vagueTime + ' ' + unit;
            },
        
            defaults: {
                past: 'tout de suite',
                future: 'bientôt'
            }
        },
		jp: {
			year: [ '年', '年' ],
				month: [ 'ヶ月', 'ヶ月' ],
				week: [ '週間', '週間' ],
				day: [ '日', '日' ],
				hour: [ '時間', '時間' ],
				minute: [ '分', '分' ],

				past: function (vagueTime, unit) {
				return vagueTime + ' ' + unit + '前';
			},

			future: function (vagueTime, unit) {
				return vagueTime + ' ' + unit + '後';
			},

			defaults: {
				past: '今',
					future: 'すぐに'
			}
		},
		ko: {
			year: [ '년', '년' ],
				month: [ '개월', '개월' ],
				week: [ '주', '주' ],
				day: [ '일', '일' ],
				hour: [ '시간', '시간' ],
				minute: [ '분', '분' ],

				past: function (vagueTime, unit) {
				return vagueTime + ' ' + unit + ' 전';
			},

			future: function (vagueTime, unit) {
				return vagueTime + ' ' + unit + ' 후';
			},

			defaults: {
				past: '지금',
					future: '곧'
			}
  		},
        nl: {
            year: [ 'jaar', 'jaar' ],
            month: [ 'maand', 'maanden' ],
            week: [ 'week', 'weken' ],
            day: [ 'dag', 'dagen' ],
            hour: [ 'uur', 'uur' ],
            minute: [ 'minuut', 'minuten' ],
        
            past: function (vagueTime, unit) {
                return vagueTime + ' ' + unit + ' geleden';
            },
        
            future: function (vagueTime, unit) {
                return 'over ' + vagueTime + ' ' + unit;
            },
        
            defaults: {
                past: 'juist nu',
                future: 'binnenkort'
            }
        },
		zh: {
			year: [ '年', '年' ],
				month: [ '个月', '个月' ],
				week: [ '周', '周' ],
				day: [ '天', '天' ],
				hour: [ '小时', '小时' ],
				minute: [ '分钟', '分钟' ],

				past: function (vagueTime, unit) {
				return vagueTime + ' ' + unit + ' 之前';
			},

			future: function (vagueTime, unit) {
				return 'in ' + vagueTime + ' ' + unit;
			},

			defaults: {
				past: '刚刚',
					future: '马上'
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




riot.tag('auth', '<div class="qc-user qc-logged-in" if="{ loggedIn }"> <p>Logged in. <a href="#" onclick="{ logout }">Log out</a></p> </div> <div if="{ loggedIn }"> <newcomment></newcomment> </div> <div class="qc-user qc-logged-out" if="{ !loggedIn }"> <p>Sign in to post a comment.</p> <ul class="qc-login-opts"> <li each="{ name, val in providers }" if="{ val.available }"> <a href="#" onclick="{ parent.login }" class="provider-{ name }">{ name }</a> </li> </ul> <hr></hr> </div>', function(opts) {
  this.providers = this.opts.data;
  this.loggedIn = !!this.parent.currentUser();

  var firebase = this.parent.firebase;

  this.login = function(e) {
    firebase.authWithOAuthPopup(e.item.name, this.authHandler);
  }.bind(this)
  this.logout = function() {
    firebase.unauth();
    this.loggedIn = false;
  }.bind(this)
  this.authHandler = function(err, auth) {
    if(err){
      console.error(err);
      return;
    }
    firebase.child('users').child(auth.uid).set(auth);
    this.loggedIn = true;
    this.update();
  }.bind(this)
})


riot.tag('comment', '<div class="qc-comment" id="comment/{ data.id }"> <div class="avatar"> <a href="{ data.author.url }"><img src="{ data.author.avatar }"></a> </div> <div class="qc-header"> <a href="{ data.author.url }" class="author">{ data.author.name }</a> <a href="#comment/{ data.id }" class="timestamp">{ new Date(data.time).toLocaleString() }</a> </div> <div class="qc-body">{ data.body }</div> <hr></hr> </div>', function(opts) {
  this.data = opts.data
})


riot.tag('newcomment', '<div class="qc-comment qc-new"> <form>      <textarea rows="{ height }" class="gc-new-body form-control" name="body" onfocus="{ grow }"></textarea>\n <button class="submit" name="submit" onclick="{ send }">Submit</button> </form> <hr></hr> </div>', function(opts) {
  this.height = 1

  this.send = function(e) {

    if(!this.spamFree()){
      throw "Can't save spammy comments"
    }else{
      this.parent.parent.save(this)
      this.body.value = ""
      this.shrink()
    }
  }.bind(this)
  
  this.spamFree = function() {
    return true //todo
  }.bind(this)

  this.grow = function(e) {
    this.height = 5
  }.bind(this)

  this.shrink = function(e) {
    this.height = 1
  }.bind(this)

})



riot.tag('qcommentcontainer', '<div class="qc-comments"> <auth data="{ opts.providers }"></auth> <comment each="{ comments }" data="{ this }"></comment> </div>', function(opts) {
  this.providers = opts.providers;
  this.pageID    = opts.pageID;
  this.firebase  = opts.firebase;
  this.dataset   = this.firebase.child('comments').child(this.pageID);
  this.comments  = [];

  

  this.currentUser = function() {
    var auth = this.firebase.getAuth();
    if(!auth) return null;
    var profile = auth[auth.provider].cachedUserProfile;
    var info = {};
    info.name = auth[auth.provider].displayName;
    info.uid = auth.uid;
    switch(auth.provider){
      case "facebook":
        info.avatar = profile.picture.data.url;
        info.url = profile.link;
        break;
      case "twitter":
        info.avatar = profile.profile_image_url;
        info.url = profile.url;
        break;
      case "github":
        info.avatar = profile.avatar_url;
        info.url = profile.html_url;
        break;
    }
    return info;
  }.bind(this)


  this.save = function(comment) {
    if(!this.currentUser()) throw "Must be logged in to comment";
    this.dataset.push({
      author: this.currentUser(),
      time: Date.now(),
      body: comment.body.value
    });
  }.bind(this)

  this.getComment = function(snapshot) {
    var comment = snapshot.val();
    comment.id = snapshot.key();
    return comment;
  }.bind(this)
  this.addComment = function(snapshot) {
    var comment = this.getComment(snapshot);
    this.comments.unshift(comment);
    return this.update();
  }.bind(this)
  this.updateComment = function(snapshot) {
    var comment = this.getComment(snapshot);
    for(var i = this.comments.length; i-->0;){
      if(this.comments[i].id === comment.id){
        this.comments[i] = comment;
        return this.update();
      }
    }
  }.bind(this)
  this.removeComment = function(snapshot) {
    var comment = this.getComment(snapshot);
    for(var i = this.comments.length; i-->0;){
      if(this.comments[i].id === comment.id){
        this.comments.splice(i, 1);
        return this.update();
      }
    }
  }.bind(this)

  var query = this.dataset.orderByChild('time').limitToFirst(opts.limit);
  query.on("child_added",   this.addComment);
  query.on("child_changed", this.updateComment);
  query.on("child_removed", this.removeComment);
  
})


var QC = function(riot){
  if(!riot) throw "Riot.js is required";

  var providers = {
    facebook: {
      type: "oauth",
      available: true
    },
    github: {
      type: "oauth",
      available: true
    },
    twitter: {
      type: "oauth",
      available: true,
    },
    google: {
      type: "oauth",
      available: true,
    },
    password: {
      available: false, //todo unimplemented
    },
    anonymous: {
      available: false, //todo unimplemented
    }
  };

  return function(opts){
    if(!opts.firebase) throw "Firebase is required";

    //if no pageID was specified, use the url's path
    opts.pageID = encodeURIComponent( opts.pageID || window.location.pathname );

    opts.limit = (opts.limit > 0 ? opts.limit : 100);

    //Enable/disable proviers from the options object
    for(var a in opts.authMethods){
      if(opts.authMethods.hasOwnProperty(a) && providers.hasOwnProperty(a)){
        providers[a].available = opts.authMethods[a];
      }
    }

    opts.providers = providers;
    riot.mount('qcommentcontainer', opts);
  };
}(riot);