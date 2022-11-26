module.exports = function changeSelector(selector, util) {
    // element-ui这几个样式太宽泛，需减小范围
    switch (selector) {
        case '.el-button:active':
        case '.el-button:focus,.el-button:hover':
            return util.changeEach(selector, '.el-button--default:not(.is-plain):not(.el-button--primary)')
        case '.el-button.is-active,.el-button.is-plain:active':
            return util.changeEach(selector, ':not(.el-button--primary)')
        case '.el-button.is-plain:active':
        case '.el-button.is-plain:focus,.el-button.is-plain:hover':
            return util.changeEach(selector, '.el-button--default')
        case '.el-pagination button:hover':
            return selector + ':not(:disabled)'
        case '.el-pagination.is-background .el-pager li:not(.disabled):hover':
            return selector + ':not(.active)'
        case '.el-tag':
            return selector + ':not(.el-tag--dark)'
        default:
            return selector
    }
}
