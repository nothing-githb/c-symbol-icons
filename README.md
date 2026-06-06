# C/C++ Symbol Icons

A **product icon theme** for Visual Studio Code that redraws the symbol icons with
distinct, idiomatic shapes so that C and C++ symbols are much easier to tell apart
in **Call Hierarchy**, **Find All References**, **Symbol Search** (`Ctrl+T`),
**Outline**, **Breadcrumbs** and the suggestion widget.

Functions, macros, structs, templates and namespaces all share confusingly similar
default glyphs. This theme gives each kind a shape borrowed from how it actually
looks in C/C++ source — `#` for macros, `<>` for templates, `::` for namespaces,
`( )` for functions — so you can scan a reference list by shape alone.

## Glyphs

| Symbol kind (codicon)   | C/C++ meaning                  | Glyph |
|-------------------------|--------------------------------|-------|
| `symbol-function`       | free function                  | `( )` parentheses |
| `symbol-method`         | member function                | `( • )` parentheses with a bound dot |
| `symbol-variable`       | variable                       | a value tag |
| `symbol-constant`       | `#define` macro / `const`      | `#` |
| `symbol-struct`         | `struct`                       | a framed record with fields |
| `symbol-class`          | `class`                        | `C` |
| `symbol-field`          | struct/class member            | a solid block |
| `symbol-property`       | property                       | a key |
| `symbol-enum`           | `enum`                         | a bulleted list |
| `symbol-enum-member`    | enumerator                     | a single list row |
| `symbol-namespace`      | `namespace`                    | `::` |
| `symbol-interface`      | abstract type / typedef        | a UML lollipop |
| `symbol-type-parameter` | template parameter             | `< >` |
| `symbol-operator`       | operator overload              | `+` |
| `symbol-module`         | module / translation unit      | a package cube |

Any symbol kind not listed above keeps its default VS Code (Codicon) glyph.

## Install & activate

1. Install the extension.
2. Run **Preferences: Product Icon Theme** from the Command Palette (`Ctrl+Shift+P`)
   and pick **C/C++ Symbol Icons** — or set it directly:

   ```jsonc
   "workbench.productIconTheme": "c-cpp-symbols"
   ```

## Notes

- Product icon themes are **global** in VS Code: they apply to every language, not
  only C/C++. This theme is *designed around* C/C++ symbol kinds, which is where it
  helps the most, but the new glyphs show everywhere symbols appear.
- Icon **colors** come from your color theme (`symbolIcon.*Foreground`); this theme
  only changes the **shapes**.

## Build from source

The font is generated from the SVGs in [`icons/`](icons/):

```bash
npm install
npm run build      # icons/*.svg -> theme/fonts/c-cpp-icons.woff + the theme JSON
```

`build/build-font.mjs` assigns each icon a Private-Use-Area codepoint and rebuilds
both [`theme/fonts/c-cpp-icons.woff`](theme/fonts/c-cpp-icons.woff) and
[`theme/c-cpp-product-icon-theme.json`](theme/c-cpp-product-icon-theme.json).

To preview the glyphs in a browser, serve the project root and open
[`preview/index.html`](preview/index.html).

## License

[MIT](LICENSE) © Halis Taha Sahin
