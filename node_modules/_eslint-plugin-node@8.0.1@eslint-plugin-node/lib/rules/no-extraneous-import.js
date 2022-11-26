/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const checkExtraneous = require("../util/check-extraneous")
const getAllowModules = require("../util/get-allow-modules")
const getConvertPath = require("../util/get-convert-path")
const getImportTargets = require("../util/get-import-export-targets")
const getResolvePaths = require("../util/get-resolve-paths")

module.exports = {
    meta: {
        docs: {
            description:
                "disallow `import` declarations of extraneous packages",
            category: "Possible Errors",
            recommended: false,
            url:
                "https://github.com/mysticatea/eslint-plugin-node/blob/v8.0.1/docs/rules/no-extraneous-import.md",
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
            "Program:exit"(node) {
                checkExtraneous(
                    context,
                    filePath,
                    getImportTargets(context, node, false)
                )
            },
        }
    },
}
