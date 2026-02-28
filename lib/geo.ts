import { QuadraticBezierCurve3, Vector3 } from "three";

export function latLonToVector3(lat: number, lon: number, radius: number): Vector3 {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;

  return new Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

export function createArcCurve(
  start: Vector3,
  end: Vector3,
  lift = 0.35
): QuadraticBezierCurve3 {
  const mid = start.clone().add(end).multiplyScalar(0.5);
  const control = mid.clone().normalize().multiplyScalar(mid.length() + lift);
  return new QuadraticBezierCurve3(start, control, end);
}
