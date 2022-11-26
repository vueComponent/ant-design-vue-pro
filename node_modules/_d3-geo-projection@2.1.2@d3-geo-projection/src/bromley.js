import {geoProjection as projection} from "d3-geo";
import {pi} from "./math";
import {mollweideBromleyRaw} from "./mollweide";

export var bromleyRaw = mollweideBromleyRaw(1, 4 / pi, pi);

export default function() {
  return projection(bromleyRaw)
      .scale(152.63);
}
