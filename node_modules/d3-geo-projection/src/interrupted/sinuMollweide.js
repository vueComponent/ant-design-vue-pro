import {sinuMollweideRaw} from "../sinuMollweide";
import interrupt from "./index";

var lobes = [[ // northern hemisphere
  [[-180,  35], [ -30,  90], [   0,  35]],
  [[   0,  35], [  30,  90], [ 180,  35]]
], [ // southern hemisphere
  [[-180, -10], [-102, -90], [ -65, -10]],
  [[ -65, -10], [   5, -90], [  77, -10]],
  [[  77, -10], [ 103, -90], [ 180, -10]]
]];

export default function() {
  return interrupt(sinuMollweideRaw, lobes)
      .rotate([-20, -55])
      .scale(164.263)
      .center([0, -5.4036]);
}
