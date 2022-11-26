#!/bin/bash
set -e

if [[ -z $1 ]]; then
  echo "Enter new version: "
  read -r VERSION
else
  VERSION=$1
fi

read -p "Releasing $VERSION - are you sure? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "Releasing $VERSION ..."

  if [[ -z $SKIP_TESTS ]]; then
    yarn lint
    yarn test:unit
  fi

  # build
  VERSION=$VERSION yarn bundle

  # publish
  git tag v"$VERSION"
  git push origin refs/tags/v"$VERSION"
  git push

  if [[ -z $RELEASE_TAG ]]; then
    npm publish
  else
    npm publish --tag "$RELEASE_TAG"
  fi

  # publish site
  echo "Notice: publishing site on your own. 🙂"
fi
