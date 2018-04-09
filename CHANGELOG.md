# Changelog

## 1.1.1

* Remove unused dependencies

## 1.1.0

* Split `sync` and `async` measurements internally. This greatly improves measurements for the former, where Promise scheduling would skew the results slightly.
* Refactor internals that there is no need to subtract noops anymore
* Automatically calculate the optimal sample size
* Add FAQ section to Readme

## 1.0.2

* Fix exception in browsers due to incorrect `supportsColor` check in
  `@marvinh/minichalk`

## 1.0.1

* Refactor internals to be even smaller
* remove double scheduling with `setTimeout`
* remove noop dead code, is jitted away by `v8` immediately anyway

## 1.0.0

* Complete rewrite
* JIT is now properly warmed up before any measurment is done
* Supports both node and browser environments

## 0.0.2

* Simplify user-facing api

## 0.0.1

* initial pre-release
