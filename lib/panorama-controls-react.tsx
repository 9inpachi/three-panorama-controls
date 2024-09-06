import { useFrame, useThree } from "@react-three/fiber";
import { forwardRef, useEffect, useMemo } from "react";
import { PerspectiveCamera } from "three";
import { PanoramaControls as PanoramaControlsImpl } from "./panorama-controls";

export type PanoramaControlsProps = {
  makeDefault?: boolean;
  enabled?: boolean;
  zoomable?: boolean;
};

export const PanoramaControls = forwardRef<
  PanoramaControlsImpl,
  PanoramaControlsProps
>(({ makeDefault, enabled = true, zoomable = true }, ref) => {
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

  useEffect(() => void (controls.enabled = enabled), [controls, enabled]);
  useEffect(() => void (controls.zoomable = zoomable), [controls, zoomable]);

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
