import {guyouRaw} from "../guyou";
import quincuncial from "./index";

export default function() {
  return quincuncial(guyouRaw)
      .scale(111.48);
}
