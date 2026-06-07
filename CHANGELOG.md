# Change Log

## 0.0.6

- Initial release.
- Product icon theme **"C/C++ Icon Theme"** that relabels symbol icons for C/C++:
  - **Lowercase letter glyphs** (vectorised from Segoe UI at a fixed x-height for
    natural proportions): `f` function, `m` method, `t` class/typedef, `v` variable,
    `s` struct, `sf` field, `e` enum, `ec` enum constant, `p` property.
  - **Idiomatic marks:** `#` macro/constant, `::` namespace, `<>` template,
    `+` operator, lollipop interface, cube module.
- `#define` macros (reported as the String kind) are mapped to `#` via
  `symbol-string`.
- Glyphs are single-color and tinted by the active color theme's
  `symbolIcon.*Foreground`.
