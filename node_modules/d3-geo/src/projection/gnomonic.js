import {atan, cos, sin} from "../math";
import {azimuthalInvert} from "./azimuthal";
import projection from "./index";

export function gnomonicRaw(x, y) {
  var cy = cos(y), k = cos(x) * cy;
  return [cy * sin(x) / k, sin(y) / k];
}

gnomonicRaw.invert = azimuthalInvert(atan);

export default function() {
  return projection(gnomonicRaw)
      .scale(144.049)
      .clipAngle(60);
}
