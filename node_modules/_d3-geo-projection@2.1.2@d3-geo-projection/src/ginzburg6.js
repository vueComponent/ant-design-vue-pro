import {geoProjection as projection} from "d3-geo";
import ginzburgPolyconicRaw from "./ginzburgPolyconic";
import {pi} from "./math";

export var ginzburg6Raw = ginzburgPolyconicRaw(5 / 6 * pi, -0.62636, -0.0344, 0, 1.3493, -0.05524, 0, 0.045);

export default function() {
  return projection(ginzburg6Raw)
      .scale(130.945);
}
