/* global process:false */

"use strict";

var _ = require("lodash");

module.exports = function(grunt) {
    require("load-grunt-tasks")(grunt);

    var config = {
        pkg: grunt.file.readJSON("package.json"),
        banner: "/*!\n" +
                " * element-resize-detector <%= pkg.version %>\n" +
                " * Copyright (c) 2016 Lucas Wiener\n" +
                " * <%= pkg.homepage %>\n" +
                " * Licensed under <%= pkg.license %>\n" +
                " */\n",
        jshint: {
            src: {
                src: ["src/**/*.js", "*.js"]
            },
            test: {
                src: "test/**/*.js"
            },
            options: {
                jshintrc: true
            }
        },
        browserify: {
            dev: {
                src: ["src/element-resize-detector.js"],
                dest: "build/element-resize-detector.js",
                options: {
                    browserifyOptions: {
                        standalone: "elementResizeDetectorMaker",
                        debug: true
                    }
                }
            },
            dist: {
                src: ["src/element-resize-detector.js"],
                dest: "dist/element-resize-detector.js",
                options: {
                    browserifyOptions: {
                        standalone: "elementResizeDetectorMaker"
                    }
                }
            }
        },
        usebanner: {
            dist: {
                options: {
                    position: "top",
                    banner: "<%= banner %>"
                },
                files: {
                    src: "dist/**/*"
                }
            }
        },
        uglify: {
            dist: {
                files: {
                    "dist/element-resize-detector.min.js": "dist/element-resize-detector.js"
                }
            }
        },
        karma: {
            local: {
                configFile: "karma.conf.js",
                options: {
                    browsers: [
                        "Chrome",
                        "Safari",
                        "Firefox",
                        //"IE8 - Win7",
                        //"IE10 - Win7",
                        //"IE11 - Win8.1"
                    ],
                    singleRun: true
                }
            }
        }
    };

    grunt.initConfig(config);

    grunt.registerTask("build:dev", ["browserify:dev"]);
    grunt.registerTask("build:dist", ["browserify:dist"]);

    grunt.registerTask("build", ["build:dev"]);
    grunt.registerTask("dist", ["build:dist", "uglify:dist", "usebanner:dist"]);

    grunt.registerTask("test:style", ["jshint"]);
    grunt.registerTask("test", ["test:style", "build:dev", "karma:local"]);

    grunt.registerTask("ci", ["test:style"]);

    grunt.registerTask("default", ["test"]);
};
