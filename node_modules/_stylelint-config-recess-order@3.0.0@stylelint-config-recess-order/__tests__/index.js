import test from 'ava'
import stylelint from 'stylelint'

import { correctOrder, incorrectOrder } from './_fixtures'
import config from '..'

const runStylelint = async (code) => {
    let data = await stylelint.lint({
        code,
        config,
    })

    return data.results[0]
}

test('with incorrect property order', async (t) => {
    await runStylelint(incorrectOrder).then((output) => {
        t.truthy(output.errored, 'indicates linting errors')
        t.is(
            output.warnings[0].text.trim(),
            'Expected "box-sizing" to come before "background-color" (order/properties-order)',
            'indicates a properties-order error',
        )
    })
})

test('with correct property order', async (t) => {
    await runStylelint(correctOrder).then((output) => {
        t.falsy(output.errored, 'indicates no errors')
        t.is(output.warnings.length, 0)
    })
})
