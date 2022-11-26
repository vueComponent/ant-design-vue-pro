import {gringortenRaw} from "../gringorten";
import quincuncial from "./index";

export default function() {
  return quincuncial(gringortenRaw)
      .scale(176.423);
}
