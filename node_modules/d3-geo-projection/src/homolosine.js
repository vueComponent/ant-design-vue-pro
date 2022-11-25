import {geoProjection as projection} from "d3-geo";
import {abs} from "./math";
import {mollweideRaw} from "./mollweide";
import {sinusoidalRaw} from "./sinusoidal";
import {sinuMollweidePhi, sinuMollweideY} from "./sinuMollweide";

export function homolosineRaw(lambda, phi) {
  return abs(phi) > sinuMollweidePhi
      ? (lambda = mollweideRaw(lambda, phi), lambda[1] -= phi > 0 ? sinuMollweideY : -sinuMollweideY, lambda)
      : sinusoidalRaw(lambda, phi);
}

homolosineRaw.invert = function(x, y) {
  return abs(y) > sinuMollweidePhi
      ? mollweideRaw.invert(x, y + (y > 0 ? sinuMollweideY : -sinuMollweideY))
      : sinusoidalRaw.invert(x, y);
};

export default function() {
  return projection(homolosineRaw)
      .scale(152.63);
}
