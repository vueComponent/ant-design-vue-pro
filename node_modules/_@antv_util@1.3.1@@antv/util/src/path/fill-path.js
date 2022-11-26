function decasteljau(points, t) {
  const left = [];
  const right = [];

  function recurse(points, t) {
    if (points.length === 1) {
      left.push(points[0]);
      right.push(points[0]);
    } else {
      const middlePoints = [];
      for (let i = 0; i < points.length - 1; i++) {
        if (i === 0) {
          left.push(points[0]);
        }
        if (i === points.length - 2) {
          right.push(points[i + 1]);
        }
        middlePoints[i] = [ (1 - t) * points[i][0] + t * points[i + 1][0], (1 - t) * points[i][1] + t * points[i + 1][1] ];
      }
      recurse(middlePoints, t);
    }
  }
  if (points.length) {
    recurse(points, t);
  }
  return { left, right: right.reverse() };
}

function splitCurve(start, end, count) {
  const points = [[ start[1], start[2] ]];
  count = count || 2;
  const segments = [];
  if (end[0] === 'A') {
    points.push(end[6]);
    points.push(end[7]);
  } else if (end[0] === 'C') {
    points.push([ end[1], end[2] ]);
    points.push([ end[3], end[4] ]);
    points.push([ end[5], end[6] ]);
  } else if (end[0] === 'S' || end[0] === 'Q') {
    points.push([ end[1], end[2] ]);
    points.push([ end[3], end[4] ]);
  } else {
    points.push([ end[1], end[2] ]);
  }

  let leftSegments = points;
  const t = 1 / count;

  for (let i = 0; i < count - 1; i++) {
    const rt = t / (1 - t * i);
    const split = decasteljau(leftSegments, rt);
    segments.push(split.left);
    leftSegments = split.right;
  }
  segments.push(leftSegments);
  const result = segments.map(segment => {
    let cmd = [];
    if (segment.length === 4) {
      cmd.push('C');
      cmd = cmd.concat(segment[2]);
    }
    if (segment.length >= 3) {
      if (segment.length === 3) {
        cmd.push('Q');
      }
      cmd = cmd.concat(segment[1]);
    }
    if (segment.length === 2) {
      cmd.push('L');
    }
    cmd = cmd.concat(segment[segment.length - 1]);
    return cmd;
  });
  return result;
}

function splitSegment(start, end, count) {
  if (count === 1) {
    return [ [].concat(start) ];
  }
  let segments = [];
  if (end[0] === 'L' || end[0] === 'C' || end[0] === 'Q') {
    segments = segments.concat(splitCurve(start, end, count));
  } else {
    const temp = [].concat(start);
    if (temp[0] === 'M') {
      temp[0] = 'L';
    }
    for (let i = 0; i <= count - 1; i++) {
      segments.push(temp);
    }
  }
  return segments;
}

module.exports = function fillPath(source, target) {
  if (source.length === 1) {
    return source;
  }
  const sourceLen = source.length - 1;
  const targetLen = target.length - 1;
  const ratio = sourceLen / targetLen;
  const segmentsToFill = [];
  if (source.length === 1 && source[0][0] === 'M') {
    for (let i = 0; i < targetLen - sourceLen; i++) {
      source.push(source[0]);
    }
    return source;
  }
  for (let i = 0; i < targetLen; i++) {
    const index = Math.floor(ratio * i);
    segmentsToFill[index] = (segmentsToFill[index] || 0) + 1;
  }
  const filled = segmentsToFill.reduce((filled, count, i) => {
    if (i === sourceLen) {
      return filled.concat(source[sourceLen]);
    }
    return filled.concat(splitSegment(source[i], source[i + 1], count));
  }, []);
  filled.unshift(source[0]);
  if (target[targetLen] === 'Z' || target[targetLen] === 'z') {
    filled.push('Z');
  }
  return filled;
};
