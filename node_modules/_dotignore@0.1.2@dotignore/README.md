# dotignore

## `ignored $IGNOREFILE`

Check the ignorefile against the current directory.
Print out if a file should be ignored by prefixing with a `-`.
If the file should not be ignored prefix it with a `+`.

## API

### exports.createMatcher(str)

Return a `Matcher` that fully matches the `str` argument.

`str` should conform to the `.gitignore` specification.

### Matcher.shouldIgnore(name)

Test that all the rules provided to create the matcher match the name given.
`/` is expected as the path delimiter.
Returns `true` if the name should be ignored.

## LICENSE

MIT

