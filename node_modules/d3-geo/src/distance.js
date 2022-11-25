import length from "./length";

var coordinates = [null, null],
    object = {type: "LineString", coordinates: coordinates};

export default function(a, b) {
  coordinates[0] = a;
  coordinates[1] = b;
  return length(object);
}
