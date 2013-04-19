jvm.js [![Build Status](https://travis-ci.org/achingbrain/jjvm.png)](https://travis-ci.org/achingbrain/jjvm) [![Dependency Status](https://david-dm.org/achingbrain/jjvm.png)](https://david-dm.org/achingbrain/jjvm)
=====

A JavaScript implementation of the JVM.

Demo
-----

[http://achingbrain.github.io/jvm.js](http://achingbrain.github.io/jvm.js).  Skip to step 4 below.  Hope you're running a modern browser.

Getting started
-----

1. Install dependencies

	npm install

2. Run web server

	grunt run

3. Open http://localhost:8060
4. Drop a .class file with a main method file onto the box marked "Drop a .class file here"
5. Set some breakpoints and hit run

Other tasks
----

Run test suite:

	grunt test

Run test suite with coverage (report appears in /target/reports/coverage/index.html):

	grunt coverage

Delete the "target" directory

	grunt clean

What doesn't work
----

Rather a lot.

1. Threading, files, sockets, etc.
2. High value longs, doubles, etc.

To do
----

Rather a lot

1. Test invoke_dynamic with some code that uses it (e.g. not Java)
2. Support ConstantValue field attribute
3. Implement step-into and step-out functionality
