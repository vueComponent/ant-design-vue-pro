var BatchProcessor = require('./src/batch-processor.js');

function test(expected, actual) {
    if (expected !== actual) {
        throw new Error("Expected: " + expected + ", Actual: " + actual);
    }
}

describe("BatchProcessor", function () {
    describe("Basic usage", function () {
        it("should be able to add functions and process them sync", function () {
            var bp = BatchProcessor({
                auto: false,
                async: false
            });

            var result = "";

            function f(v) {
                result += v;
            }

            bp.add(0, f.bind(null, "0"));
            bp.add(0, f.bind(null, "0"));
            bp.add(1, f.bind(null, "1"));
            bp.add(1, f.bind(null, "1"));
            bp.add(2, f.bind(null, "2"));

            bp.force();

            test("00112", result);
        });

        it("should be able to add functions and process them async", function (done) {
            var bp = BatchProcessor({
                auto: false,
                async: true
            });

            var result = "";

            function f(v) {
                result += v;
            }

            bp.add(0, f.bind(null, "0"));
            bp.add(0, f.bind(null, "0"));
            bp.add(1, f.bind(null, "1"));
            bp.add(1, f.bind(null, "1"));
            bp.add(2, f.bind(null, "2"));

            bp.force();

            test("", result);

            setTimeout(function () {
                test("00112", result);
                done();
            }, 10);
        });

        it("should be able to add functions and process them auto async", function (done) {
            var bp = BatchProcessor({
                auto: true,
                async: true
            });

            var result = "";

            function f(v) {
                result += v;
            }

            bp.add(0, f.bind(null, "0"));
            bp.add(0, f.bind(null, "0"));
            bp.add(1, f.bind(null, "1"));
            bp.add(1, f.bind(null, "1"));
            bp.add(2, f.bind(null, "2"));

            test("", result);

            setTimeout(function () {
                test("00112", result);
                done();
            }, 10);
        });

        it("should report a warning when auto sync, and default to auto async", function (done) {
            var warn = "";

            var bp = BatchProcessor({
                auto: true,
                async: false,
                reporter: {
                    warn: function () {
                        warn = "called";
                    }
                }
            });

            test("called", warn);

            var result = "";

            function f(v) {
                result += v;
            }

            bp.add(0, f.bind(null, "0"));
            bp.add(0, f.bind(null, "0"));
            bp.add(1, f.bind(null, "1"));
            bp.add(1, f.bind(null, "1"));
            bp.add(2, f.bind(null, "2"));

            test("", result);

            setTimeout(function () {
                test("00112", result);
                done();
            }, 10);
        });
    });

    describe("Advanced usage", function () {
        it("When processing, incoming functions should be processed directly after that the current batch is finished", function () {
            var bp = BatchProcessor({
                auto: false,
                async: false
            });

            var result = "";

            function f(v) {
                result += v;
            }

            bp.add(0, f.bind(null, "0"));
            bp.add(0, f.bind(null, "0"));
            bp.add(1, f.bind(null, "1"));
            bp.add(1, function () {
                f("1");
                bp.add(-1, f.bind(null, "a"));
                bp.add(0, f.bind(null, "b"));
                bp.add(1, f.bind(null, "c"));
                bp.add(2, f.bind(null, "d"));
                bp.add(3, f.bind(null, "e"));
                bp.force();
            });
            bp.add(2, f.bind(null, "2"));
            bp.force();

            test("00112abcde", result);
        });
    });
});
