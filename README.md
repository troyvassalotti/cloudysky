# `<cloudy-sky>`

Beautify your content by transporting it into nature.

## Installation

### Via npm

`npm install @troyv/cloudysky`

### Via ESM

```html
<script type="module">
  import CloudySky from "https://esm.sh/@troyv/cloudysky";
</script>
```

## Usage

You either need a bundling solution that will handle the bare module imports from `lit` or you need to use import maps in the browser.

```html
<!-- for browsers that don't natively support import maps -->
<script async src="https://esm.sh/es-module-shims"></script>
<script type="importmap">
  {
    "imports": {
      "lit": "https://esm.sh/lit",
      "lit/": "https://esm.sh/lit/"
    }
  }
</script>
<script type="module" src="cloudy-sky.js"></script>
```

Use the default slot to wrap any content in a scenic view. Apply the boolean `[hillside]` attribute to be placed in a field. Clouds will appear based on an intersection observer so animations aren't running when they don't need to. A button in the top right of the component will turn off/on the clouds.

Check out the source file for JSDoc-style comments on custom CSS custom properties.
