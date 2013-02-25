jjvm [![Build Status](https://travis-ci.org/achingbrain/jjvm.png)](https://travis-ci.org/achingbrain/jjvm) [![Dependency Status](https://david-dm.org/achingbrain/jjvm.png)](https://david-dm.org/achingbrain/jjvm)
=====

A JavaScript implementation of the JVM.

Getting started
-----

1. Install dependencies
	npm install grunt
	npm install grunt-jasmine-runner
	npm install grunt-contrib-copy

2. Run web server
	grunt run

3. Open http://localhost:8060

4. Decompile a Java .class file with a main method with `javap -c` and paste the contents into the browser

5. Hit compile, set some breakpoints and hit run

Other tasks
----

Run test suite:

	grunt test

Run test suite with coverage (report appears in /target/reports/coverage/index.html):

	grunt coverage
