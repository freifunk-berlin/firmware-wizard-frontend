#!/bin/bash

if [ "${TRAVIS_PULL_REQUEST}" != "false" ]; then
  echo "This is a pull request. Don't push or deploy."
  exit 0
fi

if [ "${TRAVIS_BRANCH}" != "master" ]; then
  echo "not on master branch"
  exit 0
fi

openssl aes-256-cbc -K $encrypted_cd6bced8534a_key -iv $encrypted_cd6bced8534a_iv -in id_rsa_travis.enc -out id_rsa_travis -d
chmod 0600 id_rsa_travis
eval $(ssh-agent)
ssh-add id_rsa_travis

ssh-keyscan github.com >> ~/.ssh/known_hosts
git clone --depth 1 git@github.com:freifunk-berlin/firmware-wizard-frontend.git -b gh-pages gh-pages

rsync -a --delete --exclude .git dist/ gh-pages/

touch gh-pages/.nojekyll

(cd gh-pages/ && \
  git config user.name "Travis CI" && \
  git config user.email "travis@mailinator.com" && \
  git config --global push.default simple && \
  git add -A . && \
  git commit -m "Deploy from travis build"; \
  ( [[ -z "$TRAVIS_TAG" ]] || git tag "build-${TRAVIS_TAG}" ) && \
  git push && \
  git push --tags)
