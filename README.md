Quick Comments
==============

> A drop-in comments framework that won't slow you down.

Use
---

First, drop this where you want your comments to go:

```html
<qcomment></qcomment>
```

Add this to your scripts (after Firebase):

```html
<script src="http://ss15-team32.divshot.io/lib/quick-comments.min.js"></script>
```

Then instantiate this object:

```javascript
new QC({
  firebase: new Firebase('https://<YOUR-FIREBASE-SITE>.firebaseio.com'),
  pageID: '/unique/page/name/or/permalink', //defaults to current URL path

  //other options (below are defaults)
  bootstrap: false,     //enable bootstrap-friendly styles
  limit: 100,           //number of comments to display
  meow: false,          //???
  authMethods: {        //disable specific login methods by setting them to false
    facebook: true,
    twitter: true,
    github: true,
    google: true,
    //unimplemented:
    password: false,
    anonymous: false,
    custom: false
  }
});

```

Authentication
--------------

User login is handled by Firebase. You'll have to enable each third-party provider you want to allow logins from. See [their docs](https://www.firebase.com/docs/web/guide/user-auth.html).

Dependencies
------------

The smaller dependencies such as [riot.js](https://github.com/muut/riotjs/) are baked into the script. [Firebase](https://www.firebase.com/) is not included in the default package because of it's large size. If you aren't using Firebase already, `quick-comments.complete.js` and `quick-comments.complete.min.js` bundle it in for you.

If you want no dependancies included at all, the packages `quick-comments.tiny.js` and `quick-comments.tiny.min.js` are available as well.

Browser support
---------------

If you want support for IE8, you will need both `es5-shim` and `html5shiv`, and you will need to declare
the custom tags this uses.

```html
<!--[if lt IE 9]>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/es5-shim/4.0.5/es5-sham.min.js"></script>
  <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>

  <script>html5.addElements('qcomment comment newcomment')</script>
<![endif]-->
```


About
=====

Benefits
--------

- bootstrap-friendly
- small (hopefully) and fast (hopefully)
- ~~no~~ **reduced** third-party tracking of users
- control over the data
- ~~unopinionated?~~
  - it's a bit opinionated right now, but it should be less so soon

Future Enhancements
-------------------

- *replies!*
- notifications system
- custom tempating
- more auth sources
- other backends?
- Enter to send comment
  - emulate facebook messenger enter functionality
- allow edits
- spam filtering

Licence
=======

[MIT](LICENSE)

Special Features
----------------

![Cat mode](public/images/special-features.png)


TODO
====

- add bower package
- build example site/landing page
  - what's the value
- optimize for size
- screenshots screenshots screenshots
  - maybe gif comparison
- modules??
- remove this block
- MaxCDN