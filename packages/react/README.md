# @stencil/react-output-target

Automate the creation of React component wrappers for your Stencil web components.

This package includes an output target for code generation that allows developers to generate a React component wrapper for each Stencil component and a minimal runtime package built around [@lit/react](https://www.npmjs.com/package/@lit/react) that is required to use the generated React components in your React library or application.

## Features

- ♻️ Automate the generation of React component wrappers for Stencil components
- 🌐 Generate React functional component wrappers with JSX bindings for custom events and properties
- ⌨️ Typings and auto-completion for React components in your IDE
- 🚀 Support for Server Side Rendering (SSR) when used with frameworks like [Next.js](https://nextjs.org/)

## Setup

### Your Stencil Component Library

Install the `@stencil/react-output-target` package in your Stencil project as a development dependency:

```bash
npm install @stencil/react-output-target --save-dev
```

Configure the output target in your `stencil.config.ts` file:

```ts
import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';

export const config: Config = {
  outputTargets: [
    reactOutputTarget({
      // Relative path to where the React components will be generated
      outDir: '../path-to-react-library-or-app/src/',
    }),
    // dist-custom-elements output target is required for the React output target
    { type: 'dist-custom-elements' },
  ],
};
```

Build your Stencil project to generate the React component wrappers:

```bash
npm run build
```

The component wrappers will be generated in the specified output directory.

### Your React Application or Library

Install the `@stencil/react-output-target` runtime package in your React project:

```bash
npm install @stencil/react-output-target
```

> **Note:** The `@stencil/react-output-target` runtime package is required to use the generated React component wrappers. This package must be a dependency in your React project.

Verify or update your `tsconfig.json` file to include the following settings:

```json
{
  "compilerOptions": {
    "module": "esnext",
    "moduleResolution": "bundler"
  }
}
```

> `moduleResolution": "bundler"` is required to resolve the secondary entry points in the `@stencil/react-output-target` runtime package. You can learn more about this setting in the [TypeScript documentation](https://www.typescriptlang.org/docs/handbook/modules/theory.html#module-resolution).

Verify or install Typescript v5.0 or later in your project:

```bash
npm install typescript@5 --save-dev
```

That's it! You can now import and use your Stencil components as React components in your React application or library.

## Advanced Usage

### Runtime Tag Name Transformation for Microfrontends

The React output target supports **runtime tag name transformation** for microfrontend environments where multiple teams need to use different versions of the same components without conflicts.

#### **Setup**

Configure your Stencil build normally (no special configuration needed):

```ts
import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';

export const config: Config = {
  outputTargets: [
    reactOutputTarget({
      outDir: '../my-react-library/src/components',
    }),
    { type: 'dist-custom-elements' },
  ],
};
```

#### **Usage in MFE Applications**

Each microfrontend can configure tag name transformation at runtime:

```tsx
// In your MFE application entry point
import { setTagNameTransformer } from '@my-design-system/react';

// Team Alpha: Add team prefix
setTagNameTransformer((tagName) => `alpha-${tagName}`);

// Team Beta: Add team prefix  
setTagNameTransformer((tagName) => `beta-${tagName}`);

// Version-specific transformation
setTagNameTransformer((tagName) => `${tagName}-v2`);

// Environment-specific transformation
setTagNameTransformer((tagName) => `${tagName}-${process.env.NODE_ENV}`);
```

#### **Component Usage (Same API for All Teams)**

```tsx
import { MyButton, MyTabs, MyTab } from '@my-design-system/react';

function App() {
  return (
    <div>
      <MyButton>Click me</MyButton>
      <MyTabs>
        <MyTab>Tab 1</MyTab>
        <MyTab>Tab 2</MyTab>
      </MyTabs>
    </div>
  );
}

// Renders different DOM based on transformer:
// Team Alpha: <alpha-my-button>, <alpha-my-tabs>, <alpha-my-tab>
// Team Beta:  <beta-my-button>, <beta-my-tabs>, <beta-my-tab>
// Version 2:  <my-button-v2>, <my-tabs-v2>, <my-tab-v2>
```

#### **Advanced Transformation Logic**

```tsx
import { setTagNameTransformer, clearTagNameTransformer } from '@my-design-system/react';

// Conditional transformation
setTagNameTransformer((tagName) => {
  if (tagName.startsWith('my-')) {
    return `admiral-${tagName.substring(3)}-v2`;
  }
  return tagName;
});

// Clear transformation (useful for testing)
clearTagNameTransformer();

// Complex team-based logic
const teamConfig = {
  alpha: (tagName: string) => `alpha-${tagName}`,
  beta: (tagName: string) => `beta-${tagName}`,
  gamma: (tagName: string) => `${tagName}-v2`,
};

setTagNameTransformer(teamConfig[process.env.TEAM_NAME] || ((name) => name));
```

#### **Benefits**

✅ **Single Build Pipeline**: Design system team maintains one build
✅ **Runtime Flexibility**: Teams can change transformations without rebuilds  
✅ **Simple Distribution**: One NPM package for all teams
✅ **Zero Configuration**: No build-time setup required
✅ **Dynamic Control**: Can change transformations based on environment/conditions

#### **Migration Strategy**

```tsx
// Gradual migration approach
if (process.env.ENABLE_NEW_COMPONENTS === 'true') {
  setTagNameTransformer((tagName) => `${tagName}-v2`);
}
// Otherwise uses original tag names
```

> **Note:** Tag name transformation only affects the DOM tag names used by custom elements. React component names and import paths remain unchanged, ensuring a consistent developer experience across all teams.

## Output Target Options

| Property                | Description                                                                                                                                                                                                                                                                    |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `outDir` (required)     | The directory where the React components will be generated.                                                                                                                                                                                                                    |
| `esModules`             | If `true`, the output target will generate a separate ES module for each React component wrapper. Defaults to `false`.                                                                                                                                                         |
| `stencilPackageName`    | The name of the package that exports the Stencil components. Defaults to the package.json detected by the Stencil compiler.                                                                                                                                                    |
| `excludeComponents`     | An array of component tag names to exclude from the React output target. Useful if you want to prevent certain web components from being in the React library.                                                                                                                 |
| `customElementsDir`     | The directory where the custom elements are saved. This value is automatically detected from the Stencil configuration file for the `dist-custom-elements` output target. If you are working in an environment that uses absolute paths, consider setting this value manually. |
| `hydrateModule`         | For server side rendering support, provide the package for importing the [Stencil Hydrate module](https://stenciljs.com/docs/hydrate-app#hydrate-app), e.g. `my-package/hydrate`. This will generate two files: a `component.server.ts` which defines all component wrappers and a `components.ts` that re-exports these components for importing in your application. |
| `excludeServerSideRenderingFor` | A list of components that won't be considered for Server Side Rendering (SSR) |
