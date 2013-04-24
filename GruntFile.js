module.exports = function(grunt) {
	grunt.initConfig({

		meta: {
			common: {
				lib: [
					"src/main/webapp/js/underscore.js",
					"src/main/webapp/js/underscore.string.js",
				],
				source: [
					"src/main/javascript/common/namespace.js",
					"src/main/javascript/common/core/*.js",
				]
			},

			ui: {
				lib: [
					"src/main/webapp/js/jquery.js",
					"src/main/webapp/js/bootsrap.js"
				],
				source: [
					"src/main/javascript/ui/core/*.js",
					"src/main/javascript/ui/ui/*.js"
				]
			},

			worker: {
				lib: [
					
				],
				source: [
					"src/main/javascript/worker/native.js",
					"src/main/javascript/worker/util.js",
					"src/main/javascript/worker/compiler/*.js",
					"src/main/javascript/worker/runtime/*.js",
					"src/main/javascript/worker/types/*.js",
					"src/main/javascript/worker/worker/!(Worker).js"
				]
			}
		},

		jshint: {
			all: [
				"src/main/javascript/**/*.js",
				"src/test/javascript/**/*.js"
			]
		},

		copy: {
			main: {
				files: [{
					expand: true,
					cwd: "src/main/webapp",
					src: "**/*", 
					dest: "target/webapp/"
				}]
			}
		},

		concat: {
			main: {
				src: [
					"<%= meta.common.source %>",
					"<%= meta.ui.source %>"
				],
				dest: "target/webapp/js/jvm.js"
			},
			compilerWorker: {
				src: [
					"<%= meta.common.lib %>",
					"<%= meta.worker.lib %>",
					"<%= meta.common.source %>",
					"<%= meta.worker.source %>",
					"src/main/javascript/worker/worker/Worker.js"
				],
				dest: "target/webapp/js/jvm_compiler_worker.js"
			}
		},

		min: {
			dist: {
				src: [
					"target/webapp/js/jvm.js"
				],
				dest: "target/webapp/js/jvm.min.js"
			}
  		},

		jasmine : {
			test: {
				src : [
						"<%= meta.common.source %>",
						"<%= meta.worker.source %>",
						"<%= meta.ui.source %>"
				],
				options: {
					helpers: [
						"<%= meta.common.lib %>",
						"<%= meta.ui.lib %>",
						"<%= meta.worker.lib %>",
						"src/test/resources/lib/sinon-1.6.0.js"
					],
					errorReporting: true,
					specs : "src/test/javascript/**/*.spec.js"
				}
			},
			coverage: {
				src : [
						"<%= meta.common.source %>",
						"<%= meta.worker.source %>",
						"<%= meta.ui.source %>"
				],
				options: {
					helpers: [
						"<%= meta.common.lib %>",
						"<%= meta.ui.lib %>",
						"<%= meta.worker.lib %>",
						"src/test/resources/lib/sinon-1.6.0.js"
					],
					errorReporting: true,
					specs : "<%= jasmine.test.options.specs %>",
					template: require("grunt-template-jasmine-istanbul"),
					templateOptions: {
						coverage: 'target/tests/coverage.json',
						report: 'target/reports/coverage'
					}
				}
			}
		},

		watch: {
			files: [
				"src/main/javascript/**/*",
				"src/test/javascript/**/*"
			],
			tasks: ["jshint", "concat"]
		},

		connect: {
			server: {
				options: {
					port: 8060,
					base: "target/webapp"
				}
			}
		},

		clean: [
			"target"
		]
	});

	grunt.loadNpmTasks("grunt-contrib-jasmine");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-connect");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-clean");

	// default task
	grunt.registerTask("default", ["clean", "jshint", "copy", "concat"]);

	// starts a web server and watches files for changes
	grunt.registerTask("run", ["jshint", "copy", "concat", "connect", "watch"]);

	// runs unit tests
	grunt.registerTask("test", "jasmine:test");

	// runs unit tests and generates a code coverage report
	grunt.registerTask("coverage", "jasmine:coverage");
};