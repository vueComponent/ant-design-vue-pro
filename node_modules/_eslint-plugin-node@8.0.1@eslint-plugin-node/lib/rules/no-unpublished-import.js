/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const checkPublish = require("../util/check-publish")
const getAllowModules = require("../util/get-allow-modules")
const getConvertPath = require("../util/get-convert-path")
const getImportExportTargets = require("../util/get-import-export-targets")
const getResolvePaths = require("../util/get-resolve-paths")
const getTryExtensions = require("../util/get-try-extensions")

module.exports = {
    meta: {
        docs: {
            description: "disallow `import` declarations of private things",
            category: "Possible Errors",
            recommended: false,
            url:
                "https://github.com/mysticatea/eslint-plugin-node/blob/v8.0.1/docs/rules/no-unpublished-import.md",
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
                    tryExtensions: getTryExtensions.schema,
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
                checkPublish(
                    context,
                    filePath,
                    getImportExportTargets(context, node)
                )
            },
        }
    },
}
