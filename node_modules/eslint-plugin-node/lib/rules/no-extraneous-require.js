/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const checkExtraneous = require("../util/check-extraneous")
const getAllowModules = require("../util/get-allow-modules")
const getConvertPath = require("../util/get-convert-path")
const getRequireTargets = require("../util/get-require-targets")
const getResolvePaths = require("../util/get-resolve-paths")

module.exports = {
    meta: {
        docs: {
            description:
                "disallow `require()` expressions of extraneous packages",
            category: "Possible Errors",
            recommended: true,
            url:
                "https://github.com/mysticatea/eslint-plugin-node/blob/v8.0.1/docs/rules/no-extraneous-require.md",
        },
        type: "problem",
        fixable: null,
        schema: [
            {
                type: "object",
                properties: {
                    allowModules: getAllowModules.schema,
                    convertPath: getConvertPath.schema,
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
                checkExtraneous(
                    context,
                    filePath,
                    getRequireTargets(context, false)
                )
            },
        }
    },
}
