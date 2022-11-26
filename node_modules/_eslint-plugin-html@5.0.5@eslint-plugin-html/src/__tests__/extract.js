/*eslint-env es6*/
/*eslint no-sparse-arrays: 0*/

"use strict"
const extract = require("../extract")

function dedent(str) {
  if (str[0] === "\n") str = str.slice(1)

  const indent = str.match(/([\t ]*)\S/)
  if (indent) {
    str = str.replace(new RegExp(`^${indent[1]}`, "mg"), "")

    if (indent[1].endsWith("  ")) {
      // Remove the last line indentation (under-indented by 2 spaces)
      str = str.replace(new RegExp(`${indent[1].slice(0, -2)}$`), "")
    }
  }

  return str
}

function test(params) {
  const infos = extract(
    dedent(params.input),
    params.indent,
    params.xmlMode,
    params.isJavaScriptMIMEType
  )
  expect(infos.code.map(code => code.toString())).toMatchSnapshot()
  expect(infos.badIndentationLines).toEqual(params.badIndentationLines || [])
}

it("extract simple javascript", () => {
  test({
    input: `
      some html
      <script>var foo = 1;</script>
      other
    `,
  })
})

it("extract indented javascript", () => {
  test({
    input: `
      some html
      <script>
        var foo = 1;
      </script>
      other
    `,
  })
})

it("extract javascript with first line next to the script tag", () => {
  test({
    input: `
      some html
      <script>var foo = 1;
        var baz = 1;
      </script>
      other
    `,
  })
})

it("extract javascript with last line next to the script tag", () => {
  test({
    input: `
      some html
      <script>
        var foo = 1;
        var baz = 1;</script>
      other
    `,
  })
})

it("extract multiple script tags", () => {
  test({
    input: `
      some html
      <script>
        var foo = 1;
      </script>
      other
      <script>
        var bar = 1;
      </script>
    `,
  })
})

it("trim last line spaces", () => {
  test({
    input: `
      some html
        <script>
          var foo = 1;
        </script>
      other
    `,
  })
})

it("trim last line spaces ignoring CDATA", () => {
  test({
    input: `
      some html
        <script><![CDATA[
          var foo = 1;
        ]]></script>
      other
    `,
    xmlMode: true,
  })
})

it("extract script containing 'lower than' characters correctly (#1)", () => {
  test({
    input: `
      <script>
        if (a < b) { doit(); }
      </script>
    `,
  })
})

it("extract empty script tag (#7)", () => {
  test({
    input: `
      <script></script>
    `,
  })
})

const prefixes = ["text/", "text/x-", "application/", "application/x-"]

const types = ["javascript", "babel"]

for (const prefix of prefixes) {
  for (const type of types) {
    const tag = `${prefix}${type}`

    it(`extracts a script tag with type=${tag}`, () => {
      test({
        input: `
          some html
          <script type="${tag}">var foo = 1;</script>
          other
        `,
      })
    })
  }
}

it("collects bad indentations", () => {
  test({
    input: `
      <script>
        a;
      a;
       a;
      </script>
    `,
    badIndentationLines: [3, 4],
  })
})

describe("indent option", () => {
  it("absolute indent with spaces", () => {
    test({
      input: `
        <head>
          <script>
            a;
          a;
        a;
          </script>
        </head>
      `,
      indent: {
        spaces: "  ",
      },
      badIndentationLines: [3, 5],
    })
  })

  it("relative indent with spaces", () => {
    test({
      input: `
        <head>
          <script>
            a;
          a;
        a;
          </script>
        </head>
      `,
      indent: {
        spaces: "  ",
        relative: true,
      },
      badIndentationLines: [4, 5],
    })
  })

  it("absolute indent with tabs", () => {
    test({
      input: `
        <head>
        \t<script>
        \t\ta;
        \ta;
        a;
        \t</script>
        </head>
      `,
      indent: {
        spaces: "\t",
      },
      badIndentationLines: [3, 5],
    })
  })

  it("relative indent with tabs", () => {
    test({
      input: `
        <head>
        \t<script>
        \t\ta;
        \ta;
        a;
        \t</script>
        </head>
      `,
      indent: {
        spaces: "\t",
        relative: true,
      },
      badIndentationLines: [4, 5],
    })
  })
})

it("works with crlf new lines", () => {
  test({
    input:
      "<p>\r\n</p>\r\n<script>\r\n  foo;\r\nbar;\r\n    baz;\r\n</script>\r\n",
    badIndentationLines: [5],
  })
})

it("works with CDATA", () => {
  test({
    input: `
    <script>
      a;
      <![CDATA[
      b;
      ]]>
      c;
    </script>`,
    xmlMode: true,
  })
})

it("handles the isJavaScriptMIMEType option", () => {
  test({
    input: `
    <script>
      a
    </script>

    <script type="foo/bar">
      b
    </script>

    <script type="foo/baz">
      c
    </script>
    `,
    isJavaScriptMIMEType(type) {
      return type === "foo/bar"
    },
  })
})

it("keeps empty lines after the last html tags", () => {
  test({
    input: `
    <script>
      a
    </script>


    `,
  })
})

it("handles empty input", () => {
  test({
    input: "",
  })
})

it("handles self closing script tags in xhtml mode", () => {
  test({
    input: "a <script /> b",
    xmlMode: true,
  })
})

it("skips script with src attributes", () => {
  test({
    input: '<script src="foo"></script>',
  })
})
