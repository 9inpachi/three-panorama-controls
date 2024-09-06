import { EventDispatcher, MathUtils, PerspectiveCamera, Vector3 } from "three";

export type PanoramaEvents = {
  change: { type: "change" };
  start: { type: "start" };
  end: { type: "end" };
};

export class PanoramaControls extends EventDispatcher<PanoramaEvents> {
  private isEnabled = true;
  public zoomable = true;

  public minFov = 10;
  public maxFov = 90;
  private defaultFov = 50;

  public zoomSpeed = 0.05;
  public panSpeed = 0.1;

  private onPointerDownMouseX = 0;
  private onPointerDownMouseY = 0;
  private onPointerDownLng = 0;
  private onPointerDownLat = 0;

  public lat = 0;
  public lng = 0;

  private controlsPosition: Vector3;

  public set enabled(value: boolean) {
    // If the controls were previously disabled and are being enabled
    // now, then we set up the listeners again.
    if (!this.isEnabled && value) {
      this.setupListeners();
    } else if (!value) {
      // Disabling the controls by removing listeners.
      this.disposeListeners();
    }

    this.isEnabled = value;
  }

  public get enabled() {
    return this.isEnabled;
  }

  constructor(
    public camera: PerspectiveCamera,
    public domElement: HTMLElement
  ) {
    super();

    this.initializeZoom();
    this.controlsPosition = this.camera.position.clone();
    // Set the initial position of the camera.
    this.updateCameraLookAt();

    this.setupListeners();
  }

  public initializeZoom() {
    // Max zoom out on initial load.
    this.camera.fov = this.maxFov;
    this.camera.updateProjectionMatrix();
  }

  private setupListeners() {
    // To make touch work with pointer events.
    this.domElement.style.touchAction = "none";
    this.domElement.addEventListener("pointerdown", this.onPointerDown);
    this.domElement.addEventListener("wheel", this.onDocumentMouseWheel);
  }

  public disposeListeners() {
    this.domElement.removeEventListener("pointerdown", this.onPointerDown);
    this.domElement.removeEventListener("wheel", this.onDocumentMouseWheel);

    // Adding other events to the document as the mouse can flow outside
    // the element during interaction after the `pointerdown` event.
    document.removeEventListener("pointerup", this.onPointerUp);
    document.removeEventListener("pointermove", this.onPointerMove);
  }

  public dispose() {
    this.camera.fov = this.defaultFov;
    this.camera.updateProjectionMatrix();

    this.disposeListeners();
  }

  // Can be used to reconnect controls to a different DOM element.
  public reconnect(domElement: HTMLElement) {
    this.disposeListeners();

    this.domElement = domElement;
    // Set up listeners with the new DOM element.
    this.setupListeners();
  }

  public update() {
    // Dispatch the `change` event if the camera's position changes.
    if (!this.camera.position.equals(this.controlsPosition)) {
      this.controlsPosition = this.camera.position.clone();
      this.dispatchEvent({ type: "change" });
    }
  }

  // Mouse Events

  private onPointerDown = (event: PointerEvent) => {
    if (event.isPrimary === false) {
      return;
    }

    // This is to avoid selection of text/elements when moving mouse.
    event.preventDefault();

    this.onPointerDownMouseX = event.clientX;
    this.onPointerDownMouseY = event.clientY;

    this.onPointerDownLat = this.lat;
    this.onPointerDownLng = this.lng;

    this.dispatchEvent({ type: "start" });

    document.addEventListener("pointermove", this.onPointerMove);
    document.addEventListener("pointerup", this.onPointerUp);
  };

  private onPointerUp = (event: PointerEvent) => {
    if (event.isPrimary === false) {
      return;
    }

    document.removeEventListener("pointermove", this.onPointerMove);
    document.removeEventListener("pointerup", this.onPointerUp);

    this.dispatchEvent({ type: "end" });
  };

  private onPointerMove = (event: PointerEvent) => {
    if (event.isPrimary === false) {
      return;
    }

    this.lat =
      (event.clientY - this.onPointerDownMouseY) * this.panSpeed +
      this.onPointerDownLat;
    this.lng =
      (this.onPointerDownMouseX - event.clientX) * this.panSpeed +
      this.onPointerDownLng;

    this.updateCameraLookAt();
    this.dispatchEvent({ type: "change" });
  };

  private onDocumentMouseWheel = (event: WheelEvent) => {
    if (!this.zoomable) {
      return;
    }

    event.preventDefault();

    const fov = this.camera.fov + event.deltaY * this.zoomSpeed;
    const newFov = MathUtils.clamp(fov, this.minFov, this.maxFov);

    // No update.
    if (newFov === this.camera.fov) {
      return;
    }

    this.camera.fov = newFov;
    this.camera.updateProjectionMatrix();

    this.dispatchEvent({ type: "change" });
    // Dispatch the `end` event as well as there is no definite way to
    // check when a mouse wheel has ended. One could use a timeout but
    // this is how `OrbitControls` does it so should be fine.
    this.dispatchEvent({ type: "end" });
  };

  private updateCameraLookAt() {
    this.lat = Math.max(-85, Math.min(85, this.lat));
    const phi = MathUtils.degToRad(90 - this.lat);
    const theta = MathUtils.degToRad(this.lng);

    const x = 500 * Math.sin(phi) * Math.cos(theta);
    const y = 500 * Math.cos(phi);
    const z = 500 * Math.sin(phi) * Math.sin(theta);

    this.camera.lookAt(x, y, z);
  }
}
