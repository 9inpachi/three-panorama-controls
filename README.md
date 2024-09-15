# Three Panorama Controls

[![Version](https://img.shields.io/npm/v/three-panorama-controls.svg)](https://www.npmjs.com/package/three-panorama-controls)
[![Downloads](https://img.shields.io/npm/dt/three-panorama-controls.svg)](https://www.npmjs.com/package/three-panorama-controls)

Panorama controls for three.js.

## Setup

Install the package.

```sh
npm install three-panorama-controls
```

## Usage

The package can be used both in vanilla JavaScript and with React Three Fiber. See example at [./example/index.html](./example/index.html).

### Vanilla

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

const sphere = new THREE.SphereGeometry(10, 60, 20);
// Specify an existing panorama image.
const texture = new THREE.TextureLoader().load("./path/to/panorama/image.png");
texture.colorSpace = THREE.SRGBColorSpace;
const material = new THREE.MeshBasicMaterial({
  side: THREE.BackSide,
  map: texture,
});
const mesh = new THREE.Mesh(sphere, material);
scene.add(mesh);

const panoramaControls = new PanoramaControls(camera, renderer.domElement);

function animate() {
  requestAnimationFrame(animate);
  panoramaControls.update();
  renderer.render(scene, camera);
}
animate();
```

### React Three Fiber

```jsx
import { PanoramaControls } from "three-panorama-controls/react";
export const SampleComponent = () => <PanoramaControls makeDefault />;
```
