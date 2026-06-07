# C Icon Theme

A **product icon theme** for Visual Studio Code that relabels the symbol icons so
that C symbols are easy to tell apart in **Call Hierarchy**, **Find All
References**, **Symbol Search** (`Ctrl+T`), **Outline**, **Breadcrumbs** and the
suggestion widget.

Most symbol kinds share confusingly similar default glyphs. This theme gives each
kind a clear **lowercase initial** (vectorised from Segoe UI) or an **idiomatic
mark** (`#` for macros), so you can scan a reference list by
glyph alone. Where your color theme defines symbol colors
(`symbolIcon.*Foreground`), the glyphs are tinted automatically — functions
purple, structs orange, variables blue, and so on.

## Glyphs

| Symbol kind (codicon)   | C meaning                     | Glyph |
|-------------------------|-------------------------------|-------|
| `symbol-function`       | function                      | `f` |
| `symbol-variable`       | variable                      | `v` |
| `symbol-struct`         | `struct`                      | `s` |
| `symbol-field`          | struct field                  | `sf` |
| `symbol-enum`           | `enum`                        | `e` |
| `symbol-enum-member`    | enum constant                 | `ec` |
| `symbol-constant` / `symbol-string` | `#define` macro / `const` | `#` |
| `symbol-module`         | translation unit              | a package cube |

Any symbol kind not listed above keeps its default VS Code (Codicon) glyph.

### Note on macros

Some C language servers report `#define` macros as the *String* kind, so
`symbol-string` is mapped to `#` as well (this also affects string symbols in other
languages, since product icon themes are global).

## Install & activate

1. Install the extension.
2. Run **Preferences: Product Icon Theme** from the Command Palette (`Ctrl+Shift+P`)
   and pick **C Icon Theme** — or set it directly:

   ```jsonc
   "workbench.productIconTheme": "c-symbols"
   ```

## Notes

- Product icon themes are **global** in VS Code: they apply to every language, not
  only C. This theme is *designed around* C symbol kinds, which is where it helps
  the most.
- Icon **colors** come from your color theme (`symbolIcon.*Foreground`); this theme
  only changes the **shapes**. Want the gray kinds colored too? Override them in
  your settings, e.g. `"workbench.colorCustomizations": { "symbolIcon.constantForeground": "#4EC9B0" }`.
- The **Go to Symbol** quick pick (`Ctrl+T`) renders symbol icons without color on
  VS Code ≤ 1.123 ([vscode#299650](https://github.com/microsoft/vscode/issues/299650));
  this is fixed in VS Code 1.124. Other views (Outline, Call Hierarchy, …) are
  colored on all versions.

## Build from source

The font is generated from the SVGs in [`icons/`](icons/):

```bash
npm install
npm run build      # icons/*.svg -> theme/fonts/c-icons.woff + the theme JSON
```

- `build/gen-badges.mjs` vectorises the lowercase letter glyphs (`f`, `v`, `s`,
  `sf`, `e`, `ec`) from Segoe UI at a fixed x-height into `icons/*.svg`.
- `build/build-font.mjs` assigns each icon a Private-Use-Area codepoint and rebuilds
  [`theme/fonts/c-icons.woff`](theme/fonts/c-icons.woff) and
  [`theme/c-product-icon-theme.json`](theme/c-product-icon-theme.json),
  including the macro alias.

To preview the glyphs in a browser, serve the project root and open
[`preview/index.html`](preview/index.html).

## License

[MIT](LICENSE) © Halis Taha Sahin
