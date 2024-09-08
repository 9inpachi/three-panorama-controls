# Three Panorama Controls

Panorama controls for three.js.

## Setup

Install the package.

```sh
npm install three-panorama-controls
```

## Usage

The package can be used both in vanilla JavaScript and with React Three Fiber.

### Vanilla

```ts
import { PanoramaControls } from "three-panorama-controls";

// ...

const controls = new PanoramaControls(camera, renderer.domElement);
```

### React Three Fiber

```jsx
import { PanoramaControls } from "three-panorama-controls/react";

export const SampleComponent = () => <PanoramaControls makeDefault />;
```
