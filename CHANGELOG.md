# Change Log

## 0.0.5

- Initial release.
- Product icon theme **"C/C++ Icon Theme"** that relabels symbol icons for C/C++:
  - **Letter glyphs** (vectorised from Segoe UI): `f` function, `M` method,
    `t` class/typedef, `V` variable, `S` struct, `Sf` field, `E` enum,
    `Ec` enum constant, `P` property.
  - **Idiomatic marks:** `#` macro/constant, `::` namespace, `<>` template,
    `+` operator, lollipop interface, cube module.
- `#define` macros (reported as the String kind) are mapped to `#` via
  `symbol-string`.
- Glyphs are single-color and tinted by the active color theme's
  `symbolIcon.*Foreground`.
