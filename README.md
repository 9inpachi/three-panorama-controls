# Three Panorama Controls

[![Version](https://img.shields.io/npm/v/three-panorama-controls.svg)](https://www.npmjs.com/package/three-panorama-controls)
[![Downloads](https://img.shields.io/npm/dt/three-panorama-controls.svg)](https://www.npmjs.com/package/three-panorama-controls)

Panorama controls for three.js.

Demo: <https://ps3fsk.csb.app>

<div align="center">
  <img alt="Three Panorama Controls" title="Three Panorama Controls Example" src="https://github.com/user-attachments/assets/b6b58bb5-0d10-4d08-9c91-f156d42078a5">
</div>

## Contents

- [Setup](#setup)
- [Usage](#usage)
  - [Vanilla](#vanilla)
  - [React Three Fiber](#react-three-fiber)
- [Configuration](#configuration)

## Setup

Install the package.

```sh
npm install three-panorama-controls
```

## Usage

The package can be used both in vanilla JavaScript and with React Three Fiber.

### Vanilla

[CodeSandbox](https://codesandbox.io/p/sandbox/4w8jwc)

```js
import * as THREE from "three";
import { PanoramaControls } from "three-panorama-controls";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Setup a mesh with the panorama image applied as a texture to a sphere.
const sphere = new THREE.SphereGeometry(10, 60, 20);
const texture = new THREE.TextureLoader().load("./path/to/panorama/image.png");
texture.colorSpace = THREE.SRGBColorSpace;
const material = new THREE.MeshBasicMaterial({
  side: THREE.BackSide,
  map: texture,
});
const mesh = new THREE.Mesh(sphere, material);
scene.add(mesh);

// Use panorama controls.
const panoramaControls = new PanoramaControls(camera, renderer.domElement);

function animate() {
  requestAnimationFrame(animate);
  panoramaControls.update();
  renderer.render(scene, camera);
}
animate();
```

### React Three Fiber

[CodeSandbox](https://codesandbox.io/p/sandbox/ps3fsk)

```jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BackSide, TextureLoader } from "three";
import { Canvas, useLoader } from "@react-three/fiber";
import { PanoramaControls } from "three-panorama-controls/react";

const Scene = () => {
  const imageMap = useLoader(TextureLoader, "sample-panorama.jpg");

  return (
    // Setup a mesh with the panorama image applied as a texture to a sphere.
    <mesh>
      <sphereGeometry args={[10, 60, 20]} />
      <meshBasicMaterial map={imageMap} side={BackSide} />
    </mesh>
  );
};

createRoot(document.getElementById("root")).render(
  <Canvas>
    <Scene />
    {/* Use panorama controls. */}
    <PanoramaControls makeDefault />
  </Canvas>
);
```

## Configuration

The controls can be configured by setting the following properties.

| Option              | Default | Description                                                             |
| ------------------- | ------- | ----------------------------------------------------------------------- |
| `enabled: boolean`  | true    | Enable or disable the controls.                                         |
| `zoomable: boolean` | true    | Whether the user can zoom or not.                                       |
| `minFov: number`    | 10      | The minimum field of view (FOV). Limits how much the user can zoom in.  |
| `maxFov: number`    | 90      | The maximum field of view (FOV). Limits how much the user can zoom out. |
| `zoomSpeed: number` | 0.05    | Sets the speed of zooming.                                              |
| `panSpeed: number`  | 0.1     | Sets the speed of panning (moving the view).                            |

Configuring in Vanilla.

```js
const panoramaControls = new PanoramaControls(camera, renderer.domElement);
panoramaControls.enabled = true;
panoramaControls.zoomable = true;
panoramaControls.minFov = 20;
panoramaControls.maxFov = 80;
panoramaControls.zoomSpeed = 0.025;
panoramaControls.panSpeed = 0.05;
```

Configuring in React Three Fiber.

```jsx
<PanoramaControls
  makeDefault
  enabled
  zoomable
  minFov={20}
  maxFov={80}
  zoomSpeed={0.025}
  panSpeed={0.05}
/>
```
