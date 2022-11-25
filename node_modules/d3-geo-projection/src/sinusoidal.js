import {geoProjection as projection} from "d3-geo";
import {cos} from "./math";

export function sinusoidalRaw(lambda, phi) {
  return [lambda * cos(phi), phi];
}

sinusoidalRaw.invert = function(x, y) {
  return [x / cos(y), y];
};

export default function() {
  return projection(sinusoidalRaw)
      .scale(152.63);
}
