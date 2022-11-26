/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const checkExistence = require("../util/check-existence")
const getAllowModules = require("../util/get-allow-modules")
const getImportExportTargets = require("../util/get-import-export-targets")
const getResolvePaths = require("../util/get-resolve-paths")
const getTryExtensions = require("../util/get-try-extensions")

module.exports = {
    meta: {
        docs: {
            description: "disallow `import` declarations of missing files",
            category: "Possible Errors",
            recommended: false,
            url:
                "https://github.com/mysticatea/eslint-plugin-node/blob/v8.0.1/docs/rules/no-missing-import.md",
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
            "Program:exit"(node) {
                checkExistence(context, getImportExportTargets(context, node))
            },
        }
    },
}
