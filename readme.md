Prophet
====

Angular based UI for email delivery system


## Setup ENV

* install `node.js` and `npm` form <http://nodejs.org/>
* install [yeoman](http://yeoman.io/) `$ npm install -g yo`
* install [grunt](http://gruntjs.com/) `$ npm install -g grunt-cli`
* install [bower](http://bower.io) `$ npm install -g bower` (must have the git envi)
* install [karma](http://bower.io) `$ npm install -g karma grunt-karma` 
* install [ng-constant](https://github.com/werk85/grunt-ng-constant) `$ npm install grunt-ng-constant --save-dev` 


## Base Libs & Styles

* [angular.js](https://github.com/angular/angular.js)
* [bootstrap](https://github.com/twbs/bootstrap)


All above use bower for install by `$ bower install`

* [angular-ui/bootstrap](https://github.com/angular-ui/bootstrap)
* [angular-ui/ng-grid](https://github.com/angular-ui/ng-grid)


## How To

after all envi installed, you can use CLI for task

1. `$ npm install` and `$ bower install` for base libs (must first).
2. `$ grunt build` for package all statics to the dist for web.
3. `$ grunt server` for local host at 127.0.0.1:9000
