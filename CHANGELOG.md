# Changelog

## 3.0.1

* Update packages.

## 3.0.0

* **[BREAKING]** Update packages and minimum engine version to Node v12

## 2.0.0

* **[BREAKING]**:Coerce to known type ([#12](https://github.com/jeffijoe/yenv/issues/12)) (can be disabled)
* **[BREAKING]**: `~import` no longer throws on missing files; introduced `~require` which does.
* **[BREAKING]**: Typings now use a generic to describe the return object
* **[BREAKING]**: Introduced `strict` mode which is on by default
* Add CLI tool to print the environment variables.

---

## 1.0.0

* First major version, woo!
* **BREAKING:** `compose` is now `~compose`. Built-in "operators" will use the tilde (`~`) character from now on.
* **FEATURE:** Added `~import` operator, see the README section about importing. (#4)

---

## 0.2.0

* **[FEATURE]:** Added composition

---

## 0.1.0

* Initial release
