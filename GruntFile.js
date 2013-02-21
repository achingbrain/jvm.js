module.exports = function(grunt) {
	grunt.initConfig({

		meta: {
			src: {
				lib: [
					"src/main/webapp/js/jquery.js",
					"src/main/webapp/js/underscore.js",
					"src/main/webapp/js/underscore.string.js",
					"src/main/webapp/js/bootsrap.js"
				],
				core: [
					"src/main/javascript/core/String+Additions.js",
					"src/main/javascript/core/Function+Additions.js",
					"src/main/javascript/core/Iterator.js",
					"src/main/javascript/core/NotificationCentre.js",
					"src/main/javascript/core/Watchable.js",
					"src/main/javascript/core/ObjectReference.js",
					"src/main/javascript/core/ByteCode.js",
					"src/main/javascript/core/ByteCodeParser.js",
					"src/main/javascript/core/ConstructorDefinition.js",
					"src/main/javascript/core/ConstructorDefinitionParser.js",
					"src/main/javascript/core/FieldDefinition.js",
					"src/main/javascript/core/FieldDefinitionParser.js",
					"src/main/javascript/core/MethodDefinition.js",
					"src/main/javascript/core/MethodDefinitionParser.js",
					"src/main/javascript/core/ExceptionTable.js",
					"src/main/javascript/core/ExceptionTableParser.js",
					"src/main/javascript/core/ClassDefinition.js",
					"src/main/javascript/core/ClassDefinitionParser.js",
					"src/main/javascript/core/Compiler.js",
					"src/main/javascript/core/ThreadPool.js",
					"src/main/javascript/core/Thread.js",
					"src/main/javascript/core/Frame.js",
					"src/main/javascript/core/Stack.js",
					"src/main/javascript/core/LocalVariables.js",
					"src/main/javascript/core/SystemClassLoader.js",
					"src/main/javascript/core/ClassLoader.js",
					"src/main/javascript/core/Goto.js"
				],
				ui: [
					"src/main/javascript/ui/Console.js",
					"src/main/javascript/ui/FrameWatcher.js",
					"src/main/javascript/ui/ClassOutliner.js",
					"src/main/javascript/ui/ThreadWatcher.js",
					"src/main/javascript/ui/JJVM.js"
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
					"<%= meta.src.core %>",
					"<%= meta.src.ui %>"
				],
				dest: "target/webapp/js/jjvm.js"
			}
		},

		min: {
			dist: {
				src: [
					"target/webapp/js/jjvm.js"
				],
				dest: "target/webapp/js/jjvm.min.js"
			}
  		},

		jasmine : {
			test: {
				src : [
						"<%= meta.src.lib %>",
						"<%= meta.src.core %>",
						"<%= meta.src.ui %>"
				],
				options: {
					errorReporting: true,
					specs : "src/test/javascript/**/*.spec.js"
				}
			},
			coverage: {
				src : [
						"<%= meta.src.lib %>",
						"<%= meta.src.core %>",
						"<%= meta.src.ui %>"
				],
				options: {
					errorReporting: true,
					specs : "<%= jasmine.test.options.specs %>",
					excludes: [
						"<%= meta.src.lib %>"
					],
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
				"src/main/**/*"
			],
			tasks: ["jshint", "copy", "concat"]
		},

		connect: {
			server: {
				options: {
					port: 8060,
					base: "target/webapp"
				}
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-jasmine");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-connect");
	grunt.loadNpmTasks("grunt-contrib-watch");

	// default task
	grunt.registerTask("default", ["jshint", "copy", "concat"]);

	// starts a web server and watches files for changes
	grunt.registerTask("run", ["jshint", "copy", "concat", "connect", "watch"]);

	// runs unit tests
	grunt.registerTask("test", "jasmine:test");

	// runs unit tests and generates a code coverage report
	grunt.registerTask("coverage", "jasmine:coverage");
};