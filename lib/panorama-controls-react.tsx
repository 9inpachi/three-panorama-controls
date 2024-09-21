import { useFrame, useThree } from "@react-three/fiber";
import { forwardRef, useEffect, useMemo } from "react";
import { PerspectiveCamera } from "three";
import { PanoramaControls as PanoramaControlsImpl } from "./panorama-controls";

export type PanoramaControlsProps = {
  makeDefault?: boolean;
  enabled?: boolean;
  zoomable?: boolean;
  minFov?: number;
  maxFov?: number;
  zoomSpeed?: number;
  panSpeed?: number;
};

export const PanoramaControls = forwardRef<
  PanoramaControlsImpl,
  PanoramaControlsProps
>(({ makeDefault, ...options }, ref) => {
  const { camera, gl, events, set, get } = useThree();
  const domElement = events.connected ?? gl.domElement;

  // Recreate only when camera changes because recreating on a
  // changed `domElement` removes the existing listeners added
  // through a ref.
  const controls = useMemo(
    () => new PanoramaControlsImpl(camera as PerspectiveCamera, domElement),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [camera]
  );

  const {
    enabled = true,
    zoomable = true,
    minFov = 10,
    maxFov = 90,
    zoomSpeed = 0.05,
    panSpeed = 0.1,
  } = options;

  // React to updates to the configuration options.
  useEffect(() => void (controls.enabled = enabled), [controls, enabled]);
  useEffect(() => void (controls.zoomable = zoomable), [controls, zoomable]);
  useEffect(() => void (controls.minFov = minFov), [controls, minFov]);
  useEffect(() => void (controls.maxFov = maxFov), [controls, maxFov]);
  useEffect(() => void (controls.zoomSpeed = zoomSpeed), [controls, zoomSpeed]);
  useEffect(() => void (controls.panSpeed = panSpeed), [controls, panSpeed]);

  useEffect(() => {
    // This needs to be in a `useEffect` because the
    // `PanoramaControlsImpl` object is created before the controls are
    // disposed in the `useEffect` destructor function which leads to
    // the zoom being reset to default by the `dispose` function as all
    // `PanoramaControlsImpl` instances use the same `camera` instance
    // from react-three-fiber.
    controls.initializeZoom();
    return () => controls.dispose();
  }, [controls]);
  // Reconnect controls when the domElement changes.
  useEffect(() => controls.reconnect(domElement), [controls, domElement]);
  useEffect(() => {
    if (makeDefault) {
      const oldControls = get().controls;
      set({ controls });

      return () => set({ controls: oldControls });
    }
  }, [controls, get, makeDefault, set]);

  // Call the controls animation loop.
  useFrame(() => controls.enabled && controls.update());

  return <primitive ref={ref} object={controls} />;
});
