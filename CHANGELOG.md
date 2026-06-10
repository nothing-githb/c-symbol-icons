# Change Log

## 0.0.10

- Maintenance release. No icon or theme changes since 0.0.9; the build script now
  resolves the Segoe UI font via `%SystemRoot%` instead of a hard-coded path.

## 0.0.9

- Removed the remaining non-C glyphs (they fall back to the default Codicons):
  namespace and interface.

## 0.0.8

- Renamed the package, theme id, and font/theme files to drop the old prefix:
  `c-symbol-icons`, theme id `c-symbols`, `c-icons.woff`,
  `c-product-icon-theme.json`.

## 0.0.7

- Renamed to **"C Icon Theme"** and narrowed the scope to C.
- Removed the non-C glyphs (they fall back to the default Codicons):
  method, class/typedef, template (type parameter), operator overload, property.
- Fixed the `symbol-function` label (now just "function").

## 0.0.6

- Initial release.
- Product icon theme that relabels symbol icons for C:
  - **Lowercase letter glyphs** (vectorised from Segoe UI at a fixed x-height for
    natural proportions): `f` function, `v` variable, `s` struct, `sf` field,
    `e` enum, `ec` enum constant.
  - **Idiomatic marks:** `#` macro/constant, `::` namespace, lollipop interface,
    cube module.
- `#define` macros (reported as the String kind) are mapped to `#` via
  `symbol-string`.
- Glyphs are single-color and tinted by the active color theme's
  `symbolIcon.*Foreground`.
