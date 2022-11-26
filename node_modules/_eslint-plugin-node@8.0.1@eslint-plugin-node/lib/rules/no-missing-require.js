/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const checkExistence = require("../util/check-existence")
const getAllowModules = require("../util/get-allow-modules")
const getRequireTargets = require("../util/get-require-targets")
const getResolvePaths = require("../util/get-resolve-paths")
const getTryExtensions = require("../util/get-try-extensions")

module.exports = {
    meta: {
        docs: {
            description: "disallow `require()` expressions of missing files",
            category: "Possible Errors",
            recommended: true,
            url:
                "https://github.com/mysticatea/eslint-plugin-node/blob/v8.0.1/docs/rules/no-missing-require.md",
        },
        type: "problem",
        fixable: null,
        schema: [
            {
                type: "object",
                properties: {
                    allowModules: getAllowModules.schema,
                    tryExtensions: getTryExtensions.schema,
                    resolvePaths: getResolvePaths.schema,
                },
                additionalProperties: false,
            },
        ],
    },
    create(context) {
        const filePath = context.getFilename()
        if (filePath === "<input>") {
            return {}
        }

        return {
            "Program:exit"() {
                checkExistence(context, getRequireTargets(context))
            },
        }
    },
}
