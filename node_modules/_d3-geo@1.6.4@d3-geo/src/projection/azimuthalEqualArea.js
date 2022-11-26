import {asin, sqrt} from "../math";
import {azimuthalRaw, azimuthalInvert} from "./azimuthal";
import projection from "./index";

export var azimuthalEqualAreaRaw = azimuthalRaw(function(cxcy) {
  return sqrt(2 / (1 + cxcy));
});

azimuthalEqualAreaRaw.invert = azimuthalInvert(function(z) {
  return 2 * asin(z / 2);
});

export default function() {
  return projection(azimuthalEqualAreaRaw)
      .scale(124.75)
      .clipAngle(180 - 1e-3);
}
