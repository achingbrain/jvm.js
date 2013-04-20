jvm.js [![Build Status](https://travis-ci.org/achingbrain/jvm.js.png)](https://travis-ci.org/achingbrain/jvm.js) [![Dependency Status](https://david-dm.org/achingbrain/jvm.js.png)](https://david-dm.org/achingbrain/jvm.js)

=====

A Java Virtual Machine implementation written in JavaScript, including libraries for Java, Scala and Closure.

The main thread hosts the UI while all the bytecode parsing and program execution takes place in a web worker to keep things responsive.  When a non-present class definition is encoutered, the classloader will attempt to download the bytecode of the required class, otherwise the upfront load times would be outrageous.

The initial class loads you see on the demo page are setting up java.lang.System.out which will write to the log window in the bottom right.

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
