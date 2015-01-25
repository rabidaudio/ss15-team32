TODO
====

- add bower package
- build example site/landing page
  - what's the value
- fix multi-line design
- fix unstyled code
- write docs
- optimize for size
- screenshots screenshots screenshots
  - maybe gif comparison
- add license file

future
------

- notifications system 
- custom tempating
- more auth sources
- other backends?
- *replies!*
- emulate facebook messenger enter functionality
- allow edits
- spam filtering

Benefits
--------

- bootstrap friendly
- small (hopefully) and fast (hopefully)
- ~no~ reduced third-party tracking of users
- control over the data
- unopinionated? it's a bit opinionated right now

- http://microjs.com/
- https://github.com/muut/riotjs/


Configuration
=============

defaults

```javascript
new QC({
  firebase: new Firebase('https://<YOUR-FIREBASE-SITE>.firebaseio.com'),
  pageID: '/a/page/id/or/permalink', //defaults to current URL path

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