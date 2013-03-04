jjvm [![Build Status](https://travis-ci.org/achingbrain/jjvm.png)](https://travis-ci.org/achingbrain/jjvm) [![Dependency Status](https://david-dm.org/achingbrain/jjvm.png)](https://david-dm.org/achingbrain/jjvm)
=====

A JavaScript implementation of the JVM.

Demo
-----

`git clone http://github.com/achingbrain/jjvm.git && cd jjvm && npm install && grunt run` too much like hard work?

[Help is at hand](http://achingbrain.github.com/jjvm).  Hope you're running a modern browser.

Getting started
-----

1. Install dependencies
	npm install grunt
	npm install grunt-jasmine-runner
	npm install grunt-contrib-copy

2. Run web server
	grunt run

3. Open http://localhost:8060

4. Drop a .class with a main method file onto the box marked "Drop a .class file here"

5. Set some breakpoints and hit run

Other tasks
----

Run test suite:

	grunt test

Run test suite with coverage (report appears in /target/reports/coverage/index.html):

	grunt coverage

What doesn't work
----

Rather a lot.

1. Threading, files, sockets, etc.
2. High value longs, doubles, etc.

Todo
----

Rather a lot

1. Simplify Frame.js as there's a lot of code purely to emit events for the UI to pick up
2. Test invoke_dynamic with some code that uses it (e.g. not Java)
3. Increase test coverage..