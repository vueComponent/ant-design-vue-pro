# d3-geo

Map projections are sometimes implemented as point transformations. For instance, spherical Mercator:

```js
function mercator(x, y) {
  return [x, Math.log(Math.tan(Math.PI / 4 + y / 2))];
}
```

This is a reasonable *mathematical* approach if your geometry consists of continuous, infinite point sets. Yet computers do not have infinite memory, so we must instead work with discrete geometry such as polygons and polylines!

Discrete geometry makes the challenge of projecting from the sphere to the plane much harder. The edges of a spherical polygon are [geodesics](https://en.wikipedia.org/wiki/Geodesic) (segments of great circles), not straight lines. Projected to the plane, geodesics are curves in all map projections except [gnomonic](#geoGnomonic), and thus accurate projection requires interpolation along each arc. D3 uses [adaptive sampling](https://bl.ocks.org/mbostock/3795544) inspired by a popular [line simplification method](https://bost.ocks.org/mike/simplify/) to balance accuracy and performance.

The projection of polygons and polylines must also deal with the topological differences between the sphere and the plane. Some projections require cutting geometry that [crosses the antimeridian](https://bl.ocks.org/mbostock/3788999), while others require [clipping geometry to a great circle](https://bl.ocks.org/mbostock/3021474).

Spherical polygons also require a [winding order convention](https://bl.ocks.org/mbostock/a7bdfeb041e850799a8d3dce4d8c50c8) to determine which side of the polygon is the inside: the exterior ring for polygons smaller than a hemisphere must be clockwise, while the exterior ring for polygons [larger than a hemisphere](https://bl.ocks.org/mbostock/6713736) must be anticlockwise. Interior rings representing holes must use the opposite winding order of their exterior ring. This winding order convention is also used by [TopoJSON](https://github.com/topojson) and [ESRI shapefiles](https://github.com/mbostock/shapefile); however, it is the **opposite** convention of GeoJSON’s [RFC 7946](https://tools.ietf.org/html/rfc7946#section-3.1.6). (Also note that standard GeoJSON WGS84 uses planar equirectangular coordinates, not spherical coordinates, and thus may require [stitching](https://github.com/d3/d3-geo-projection/blob/master/README.md#geostitch) to remove antimeridian cuts.)

D3’s approach affords great expressiveness: you can choose the right projection, and the right aspect, for your data. D3 supports a wide variety of common and [unusual map projections](https://github.com/d3/d3-geo-projection). For more, see Part 2 of [The Toolmaker’s Guide](https://vimeo.com/106198518#t=20m0s).

D3 uses [GeoJSON](http://geojson.org/geojson-spec.html) to represent geographic features in JavaScript. (See also [TopoJSON](https://github.com/mbostock/topojson), an extension of GeoJSON that is significantly more compact and encodes topology.) To convert shapefiles to GeoJSON, use [shp2geo](https://github.com/mbostock/shapefile/blob/master/README.md#shp2geo), part of the [shapefile package](https://github.com/mbostock/shapefile). See [Command-Line Cartography](https://medium.com/@mbostock/command-line-cartography-part-1-897aa8f8ca2c) for an introduction to d3-geo and related tools.

## Installing

If you use NPM, `npm install d3-geo`. Otherwise, download the [latest release](https://github.com/d3/d3-geo/releases/latest). You can also load directly from [d3js.org](https://d3js.org), either as a [standalone library](https://d3js.org/d3-geo.v1.min.js) or as part of [D3 4.0](https://github.com/d3/d3). AMD, CommonJS, and vanilla environments are supported. In vanilla, a `d3` global is exported:

```html
<script src="https://d3js.org/d3-array.v1.min.js"></script>
<script src="https://d3js.org/d3-geo.v1.min.js"></script>
<script>

var projection = d3.geoAlbers(),
    path = d3.geoPath(projection);

</script>
```

[Try d3-geo in your browser.](https://tonicdev.com/npm/d3-geo)

## API Reference

* [Paths](#paths)
* [Projections](#projections) ([Azimuthal](#azimuthal-projections), [Composite](#composite-projections), [Conic](#conic-projections), [Cylindrical](#cylindrical-projections))
* [Raw Projections](#raw-projections)
* [Spherical Math](#spherical-math)
* [Spherical Shapes](#spherical-shapes)
* [Streams](#streams)
* [Transforms](#transforms)

### Paths

The geographic path generator, [d3.geoPath](#geoPath), is similar to the shape generators in [d3-shape](https://github.com/d3/d3-shape): given a GeoJSON geometry or feature object, it generates an SVG path data string or [renders the path to a Canvas](https://bl.ocks.org/mbostock/3783604). Canvas is recommended for dynamic or interactive projections to improve performance. Paths can be used with [projections](#projections) or [transforms](#transforms), or they can be used to render planar geometry directly to Canvas or SVG.

<a href="#geoPath" name="geoPath">#</a> d3.<b>geoPath</b>([<i>projection</i>[, <i>context</i>]]) [<>](https://github.com/d3/d3-geo/blob/master/src/path/index.js "Source")

Creates a new geographic path generator with the default settings. If *projection* is specified, sets the [current projection](#path_projection). If *context* is specified, sets the [current context](#path_context).

<a href="#_path" name="_path">#</a> <i>path</i>(<i>object</i>[, <i>arguments…</i>]) [<>](https://github.com/d3/d3-geo/blob/master/src/path/index.js#L15 "Source")

Renders the given *object*, which may be any GeoJSON feature or geometry object:

* Point - a single position.
* MultiPoint - an array of positions.
* LineString - an array of positions forming a continuous line.
* MultiLineString - an array of arrays of positions forming several lines.
* Polygon - an array of arrays of positions forming a polygon (possibly with holes).
* MultiPolygon - a multidimensional array of positions forming multiple polygons.
* GeometryCollection - an array of geometry objects.
* Feature - a feature containing one of the above geometry objects.
* FeatureCollection - an array of feature objects.

The type *Sphere* is also supported, which is useful for rendering the outline of the globe; a sphere has no coordinates. Any additional *arguments* are passed along to the [pointRadius](#path_pointRadius) accessor.

To display multiple features, combine them into a feature collection:

```js
svg.append("path")
    .datum({type: "FeatureCollection", features: features})
    .attr("d", d3.geoPath());
```

Or use multiple path elements:

```js
svg.selectAll("path")
  .data(features)
  .enter().append("path")
    .attr("d", d3.geoPath());
```

Separate path elements are typically slower than a single path element. However, distinct path elements are useful for styling and interaction (e.g., click or mouseover). Canvas rendering (see [*path*.context](#path_context)) is typically faster than SVG, but requires more effort to implement styling and interaction.

<a href="#path_area" name="path_area">#</a> <i>path</i>.<b>area</b>(<i>object</i>) [<>](https://github.com/d3/d3-geo/blob/master/src/path/area.js "Source")

Returns the projected planar area (typically in square pixels) for the specified GeoJSON *object*. Point, MultiPoint, LineString and MultiLineString geometries have zero area. For Polygon and MultiPolygon geometries, this method first computes the area of the exterior ring, and then subtracts the area of any interior holes. This method observes any clipping performed by the [projection](#path_projection); see [*projection*.clipAngle](#projection_clipAngle) and [*projection*.clipExtent](#projection_clipExtent). This is the planar equivalent of [d3.geoArea](#geoArea).

<a href="#path_bounds" name="path_bounds">#</a> <i>path</i>.<b>bounds</b>(<i>object</i>) [<>](https://github.com/d3/d3-geo/blob/master/src/path/bounds.js "Source")

Returns the projected planar bounding box (typically in pixels) for the specified GeoJSON *object*. The bounding box is represented by a two-dimensional array: \[\[*x₀*, *y₀*\], \[*x₁*, *y₁*\]\], where *x₀* is the minimum *x*-coordinate, *y₀* is the minimum *y*-coordinate, *x₁* is maximum *x*-coordinate, and *y₁* is the maximum *y*-coordinate. This is handy for, say, zooming in to a particular feature. (Note that in projected planar coordinates, the minimum latitude is typically the maximum *y*-value, and the maximum latitude is typically the minimum *y*-value.) This method observes any clipping performed by the [projection](#path_projection); see [*projection*.clipAngle](#projection_clipAngle) and [*projection*.clipExtent](#projection_clipExtent). This is the planar equivalent of [d3.geoBounds](#geoBounds).

<a href="#path_centroid" name="path_centroid">#</a> <i>path</i>.<b>centroid</b>(<i>object</i>) [<>](https://github.com/d3/d3-geo/blob/master/src/path/centroid.js "Source")

Returns the projected planar centroid (typically in pixels) for the specified GeoJSON *object*. This is handy for, say, labeling state or county boundaries, or displaying a symbol map. For example, a [noncontiguous cartogram](https://bl.ocks.org/mbostock/4055908) might scale each state around its centroid. This method observes any clipping performed by the [projection](#path_projection); see [*projection*.clipAngle](#projection_clipAngle) and [*projection*.clipExtent](#projection_clipExtent). This is the planar equivalent of [d3.geoCentroid](#geoCentroid).

<a href="#path_measure" name="path_measure">#</a> <i>path</i>.<b>measure</b>(<i>object</i>) [<>](https://github.com/d3/d3-geo/blob/master/src/path/measure.js "Source")

Returns the projected planar length (typically in pixels) for the specified GeoJSON *object*. Point and MultiPoint geometries have zero length. For Polygon and MultiPolygon geometries, this method computes the summed length of all rings. This method observes any clipping performed by the [projection](#path_projection); see [*projection*.clipAngle](#projection_clipAngle) and [*projection*.clipExtent](#projection_clipExtent). This is the planar equivalent of [d3.geoLength](#geoLength).

<a href="#path_projection" name="path_projection">#</a> <i>path</i>.<b>projection</b>([<i>projection</i>]) [<>](https://github.com/d3/d3-geo/blob/master/src/path/index.js#L48 "Source")

If a *projection* is specified, sets the current projection to the specified projection. If *projection* is not specified, returns the current projection, which defaults to null. The null projection represents the identity transformation: the input geometry is not projected and is instead rendered directly in raw coordinates. This can be useful for fast rendering of [pre-projected geometry](https://bl.ocks.org/mbostock/5557726), or for fast rendering of the equirectangular projection.

The given *projection* is typically one of D3’s built-in [geographic projections](#projections); however, any object that exposes a [*projection*.stream](#projection_stream) function can be used, enabling the use of [custom projections](https://bl.ocks.org/mbostock/5663666). See D3’s [transforms](#transforms) for more examples of arbitrary geometric transformations.

<a href="#path_context" name="path_context">#</a> <i>path</i>.<b>context</b>([<i>context</i>]) [<>](https://github.com/d3/d3-geo/blob/master/src/path/index.js#L52 "Source")

If *context* is specified, sets the current render context and returns the path generator. If the *context* is null, then the [path generator](#_path) will return an SVG path string; if the context is non-null, the path generator will instead call methods on the specified context to render geometry. The context must implement the following subset of the [CanvasRenderingContext2D API](https://www.w3.org/TR/2dcontext/#canvasrenderingcontext2d):

* *context*.beginPath()
* *context*.moveTo(*x*, *y*)
* *context*.lineTo(*x*, *y*)
* *context*.arc(*x*, *y*, *radius*, *startAngle*, *endAngle*)
* *context*.closePath()

If a *context* is not specified, returns the current render context which defaults to null.

<a href="#path_pointRadius" name="path_pointRadius">#</a> <i>path</i>.<b>pointRadius</b>([<i>radius</i>]) [<>](https://github.com/d3/d3-geo/blob/master/src/path/index.js#L59 "Source")

If *radius* is specified, sets the radius used to display Point and MultiPoint geometries to the specified number. If *radius* is not specified, returns the current radius accessor, which defaults to 4.5. While the radius is commonly specified as a number constant, it may also be specified as a function which is computed per feature, being passed the any arguments passed to the [path generator](#_path). For example, if your GeoJSON data has additional properties, you might access those properties inside the radius function to vary the point size; alternatively, you could [d3.symbol](https://github.com/d3/d3-shape#symbols) and a [projection](#geoProjection) for greater flexibility.

### Projections

Projections transform spherical polygonal geometry to planar polygonal geometry. D3 provides implementations of several classes of standard projections:

* [Azimuthal](#azimuthal-projections)
* [Composite](#composite-projections)
* [Conic](#conic-projections)
* [Cylindrical](#cylindrical-projections)

For many more projections, see [d3-geo-projection](https://github.com/d3/d3-geo-projection). You can implement [custom projections](#raw-projections) using [d3.geoProjection](#geoProjection) or [d3.geoProjectionMutator](#geoProjectionMutator).

<a href="#_projection" name="_projection">#</a> <i>projection</i>(<i>point</i>) [<>](https://github.com/d3/d3-geo/blob/master/src/projection/index.js#L34 "Source")

Returns a new array \[*x*, *y*\] (typically in pixels) representing the projected point of the given *point*. The point must be specified as a two-element array \[*longitude*, *latitude*\] in degrees. May return null if the specified *point* has no defined projected position, such as when the point is outside the clipping bounds of the projection.

<a href="#projection_invert" name="projection_invert">#</a> <i>projection</i>.<b>invert</b>(<i>point</i>) [<>](https://github.com/d3/d3-geo/blob/master/src/projection/index.js#L39 "Source")

Returns a new array \[*longitude*, *latitude*\] in degrees representing the unprojected point of the given projected *point*. The point must be specified as a two-element array \[*x*, *y*\] (typically in pixels). May return null if the specified *point* has no defined projected position, such as when the point is outside the clipping bounds of the projection.

This method is only defined on invertible projections.

<a href="#projection_stream" name="projection_stream">#</a> <i>projection</i>.<b>stream</b>(<i>stream</i>) [<>](https://github.com/d3/d3-geo/blob/master/src/projection/index.js#L48 "Source")

Returns a [projection stream](#streams) for the specified output *stream*. Any input geometry is projected before being streamed to the output stream. A typical projection involves several geometry transformations: the input geometry is first converted to radians, rotated on three axes, clipped to the small circle or cut along the antimeridian, and lastly projected to the plane with adaptive resampling, scale and translation.

<a href="#projection_clipAngle" name="projection_clipAngle">#</a> <i>projection</i>.<b>clipAngle</b>([<i>angle</i>]) [<>](https://github.com/d3/d3-geo/blob/master/src/projection/index.js#L52 "Source")

If *angle* is specified, sets the projection’s clipping circle radius to the specified angle in degrees and returns the projection. If *angle* is null, switches to [antimeridian cutting](https://bl.ocks.org/mbostock/3788999) rather than small-circle clipping. If *angle* is not specified, returns the current clip angle which defaults to null. Small-circle clipping is independent of viewport clipping via [*projection*.clipExtent](#projection_clipExtent).

<a href="#projection_clipExtent" name="projection_clipExtent">#</a> <i>projection</i>.<b>clipExtent</b>([<i>extent</i>]) [<>](https://github.com/d3/d3-geo/blob/master/src/projection/index.js#L56 "Source")

If *extent* is specified, sets the projection’s viewport clip extent to the specified bounds in pixels and returns the projection. The *extent* bounds are specified as an array \[\[<i>x₀</i>, <i>y₀</i>\], \[<i>x₁</i>, <i>y₁</i>\]\], where <i>x₀</i> is the left-side of the viewport, <i>y₀</i> is the top, <i>x₁</i> is the right and <i>y₁</i> is the bottom. If *extent* is null, no viewport clipping is performed. If *extent* is not specified, returns the current viewport clip extent which defaults to null. Viewport clipping is independent of small-circle clipping via [*projection*.clipAngle](#projection_clipAngle).

<a href="#projection_scale" name="projection_scale">#</a> <i>projection</i>.<b>scale</b>([<i>scale</i>]) [<>](https://github.com/d3/d3-geo/blob/master/src/projection/index.js#L60 "Source")

If *scale* is specified, sets the projection’s scale factor to the specified value and returns the projection. If *scale* is not specified, returns the current scale factor; the default scale is projection-specific. The scale factor corresponds linearly to the distance between projected points; however, absolute scale factors are not equivalent across projections.

<a href="#projection_translate" name="projection_translate">#</a> <i>projection</i>.<b>translate</b>([<i>translate</i>]) [<>](https://github.com/d3/d3-geo/blob/master/src/projection/index.js#L64v "Source")

If *translate* is specified, sets the projection’s translation offset to the specified two-element array [<i>t<sub>x</sub></i>, <i>t<sub>y</sub></i>] and returns the projection. If *translate* is not specified, returns the current translation offset which defaults to [480, 250]. The translation offset determines the pixel coordinates of the projection’s [center](#projection_center). The default translation offset places ⟨0°,0°⟩ at the center of a 960×500 area.

<a href="#projection_center" name="projection_center">#</a> <i>projection</i>.<b>center</b>([<i>center</i>]) [<>](https://github.com/d3/d3-geo/blob/master/src/projection/index.js#L68 "Source")

If *center* is specified, sets the projection’s center to the specified *center*, a two-element array of longitude and latitude in degrees and returns the projection. If *center* is not specified, returns the current center, which defaults to ⟨0°,0°⟩.

<a href="#projection_rotate" name="projection_rotate">#</a> <i>projection</i>.<b>rotate</b>([<i>angles</i>]) [<>](https://github.com/d3/d3-geo/blob/master/src/projection/index.js#L72 "Source")

If *rotation* is specified, sets the projection’s [three-axis rotation](https://bl.ocks.org/mbostock/4282586) to the specified *angles*, which must be a two- or three-element array of numbers [*lambda*, *phi*, *gamma*] specifying the rotation angles in degrees about [each spherical axis](https://bl.ocks.org/mbostock/4282586). (These correspond to [yaw, pitch and roll](http://en.wikipedia.org/wiki/Aircraft_principal_axes).) If the rotation angle *gamma* is omitted, it defaults to 0. See also [d3.geoRotation](#geoRotation). If *rotation* is not specified, returns the current rotation which defaults [0, 0, 0].

<a href="#projection_precision" name="projection_precision">#</a> <i>projection</i>.<b>precision</b>([<i>precision</i>]) [<>](https://github.com/d3/d3-geo/blob/master/src/projection/index.js#L76 "Source")

If *precision* is specified, sets the threshold for the projection’s [adaptive resampling](https://bl.ocks.org/mbostock/3795544) to the specified value in pixels and returns the projection. This value corresponds to the [Douglas–Peucker](http://en.wikipedia.org/wiki/Ramer–Douglas–Peucker_algorithm) distance. If *precision* is not specified, returns the projection’s current resampling precision which defaults to √0.5 ≅ 0.70710…

<a href="#projection_fitExtent" name="projection_fitExtent">#</a> <i>projection</i>.<b>fitExtent</b>(<i>extent</i>, <i>object</i>) [<>](https://github.com/d3/d3-geo/blob/master/src/projection/index.js#L80 "Source")

Sets the projection’s [scale](#projection_scale) and [translate](#projection_translate) to fit the specified GeoJSON *object* in the center of the given *extent*. The extent is specified as an array \[\[x₀, y₀\], \[x₁, y₁\]\], where x₀ is the left side of the bounding box, y₀ is the top, x₁ is the right and y₁ is the bottom. Returns the projection.

For example, to scale and translate the [New Jersey State Plane projection](https://bl.ocks.org/mbostock/5126418) to fit a GeoJSON object *nj* in the center of a 960×500 bounding box with 20 pixels of padding on each side:

```js
var projection = d3.geoTransverseMercator()
    .rotate([74 + 30 / 60, -38 - 50 / 60])
    .fitExtent([[20, 20], [940, 480]], nj);
```

Any [clip extent](#projection_clipExtent) is ignored when determining the new scale and translate. The [precision](#projection_precision) used to compute the bounding box of the given *object* is computed at an effective scale of 150.

<a href="#projection_fitSize" name="projection_fitSize">#</a> <i>projection</i>.<b>fitSize</b>(<i>size</i>, <i>object</i>) [<>](https://github.com/d3/d3-geo/blob/master/src/projection/index.js#L82 "Source")

A convenience method for [*projection*.fitExtent](#projection_fitExtent) where the top-left corner of the extent is [0, 0]. The following two statements are equivalent:

```js
projection.fitExtent([[0, 0], [width, height]], object);
projection.fitSize([width, height], object);
```

#### Azimuthal Projections

Azimuthal projections project the sphere directly onto a plane.

<a href="#geoAzimuthalEqualArea" name="geoAzimuthalEqualArea">#</a> d3.<b>geoAzimuthalEqualArea</b>() [<>](https://github.com/d3/d3-geo/blob/master/src/projection/azimuthalEqualArea.js "Source")
<br><a href="#geoAzimuthalEqualAreaRaw" name="geoAzimuthalEqualAreaRaw">#</a> d3.<b>geoAzimuthalEqualAreaRaw</b>

[<img src="https://raw.githubusercontent.com/d3/d3-geo/master/img/azimuthalEqualArea.png" width="480" height="250">](https://bl.ocks.org/mbostock/3757101)

The azimuthal equal-area projection.

<a href="#geoAzimuthalEquidistant" name="geoAzimuthalEquidistant">#</a> d3.<b>geoAzimuthalEquidistant</b>() [<>](https://github.com/d3/d3-geo/blob/master/src/projection/azimuthalEquidistant.js "Source")
<br><a href="#geoAzimuthalEquidistantRaw" name="geoAzimuthalEquidistantRaw">#</a> d3.<b>geoAzimuthalEquidistantRaw</b>

[<img src="https://raw.githubusercontent.com/d3/d3-geo/master/img/azimuthalEquidistant.png" width="480" height="250">](https://bl.ocks.org/mbostock/3757110)

The azimuthal equidistant projection.

<a href="#geoGnomonic" name="geoGnomonic">#</a> d3.<b>geoGnomonic</b>() [<>](https://github.com/d3/d3-geo/blob/master/src/projection/gnomonic.js "Source")
<br><a href="#geoGnomonicRaw" name="geoGnomonicRaw">#</a> d3.<b>geoGnomonicRaw</b>

[<img src="https://raw.githubusercontent.com/d3/d3-geo/master/img/gnomonic.png" width="480" height="250">](https://bl.ocks.org/mbostock/3757349)

The gnomonic projection.

<a href="#geoOrthographic" name="geoOrthographic">#</a> d3.<b>geoOrthographic</b>() [<>](https://github.com/d3/d3-geo/blob/master/src/projection/orthographic.js "Source")
<br><a href="#geoOrthographicRaw" name="geoOrthographicRaw">#</a> d3.<b>geoOrthographicRaw</b>

[<img src="https://raw.githubusercontent.com/d3/d3-geo/master/img/orthographic.png" width="480" height="250">](https://bl.ocks.org/mbostock/3757125)

The orthographic projection.

<a href="#geoStereographic" name="geoStereographic">#</a> d3.<b>geoStereographic</b>() [<>](https://github.com/d3/d3-geo/blob/master/src/projection/stereographic.js "Source")
<br><a href="#geoStereographicRaw" name="geoStereographicRaw">#</a> d3.<b>geoStereographicRaw</b>

[<img src="https://raw.githubusercontent.com/d3/d3-geo/master/img/stereographic.png" width="480" height="250">](https://bl.ocks.org/mbostock/3757137)

The stereographic projection.

#### Composite Projections

Composite consist of several projections that are composed into a single display. The constituent projections have fixed clip, center and rotation, and thus composite projections do not support [*projection*.center](#projection_center), [*projection*.rotate](#projection_rotate), [*projection*.clipAngle](#projection_clipAngle), or [*projection*.clipExtent](#projection_clipExtent).

<a href="#geoAlbersUsa" name="geoAlbersUsa">#</a> d3.<b>geoAlbersUsa</b>() [<>](https://github.com/d3/d3-geo/blob/master/src/projection/albersUsa.js "Source")

[<img src="https://raw.githubusercontent.com/d3/d3-geo/master/img/albersUsa.png" width="480" height="250">](https://bl.ocks.org/mbostock/4090848)

This is a U.S.-centric composite projection of three [d3.geoConicEqualArea](#geoConicEqualArea) projections: [d3.geoAlbers](#geoAlbers) is used for the lower forty-eight states, and separate conic equal-area projections are used for Alaska and Hawaii. Note that the scale for Alaska is diminished: it is projected at 0.35× its true relative area. This diagram by Philippe Rivière illustrates how this projection uses two rectangular insets for Alaska and Hawaii:

[<img src="https://raw.githubusercontent.com/d3/d3-geo/master/img/albersUsa-parameters.png" width="480" height="250">](https://bl.ocks.org/Fil/7723167596af40d9159be34ffbf8d36b)

See [d3-composite-projections](http://geoexamples.com/d3-composite-projections/) for more examples.

#### Conic Projections

Conic projections project the sphere onto a cone, and then unroll the cone onto the plane. Conic projections have [two standard parallels](#conic_parallels).

<a href="#conic_parallels" name="conic_parallels">#</a> <i>conic</i>.<b>parallels</b>([<i>parallels</i>]) [<>](https://github.com/d3/d3-geo/blob/master/src/projection/conic.js#L10 "Source")

The [two standard parallels](https://en.wikipedia.org/wiki/Map_projection#Conic) that define the map layout in conic projections.

<a href="#geoAlbers" name="geoAlbers">#</a> d3.<b>geoAlbers</b>() [<>](https://github.com/d3/d3-geo/blob/master/src/projection/albers.js "Source")

[<img src="https://raw.githubusercontent.com/d3/d3-geo/master/img/albers.png" width="480" height="250">](https://bl.ocks.org/mbostock/3734308)

The Albers’ equal area-conic projection. This is a U.S.-centric configuration of [d3.geoConicEqualArea](#geoConicEqualArea).

<a href="#geoConicConformal" name="geoConicConformal">#</a> d3.<b>geoConicConformal</b>() [<>](https://github.com/d3/d3-geo/blob/master/src/projection/conicConformal.js "Source")
<br><a href="#geoConicConformalRaw" name="geoConicConformalRaw">#</a> d3.<b>geoConicConformalRaw</b>(<i>phi0</i>, <i>phi1</i>) [<>](https://github.com/d3/d3-geo/blob/master/src/projection/conicConformal.js "Source")

[<img src="https://raw.githubusercontent.com/d3/d3-geo/master/img/conicConformal.png" width="480" height="250">](https://bl.ocks.org/mbostock/3734321)

The conic conformal projection. The parallels default to [30°, 30°] resulting in flat top. See also [*conic*.parallels](#conic_parallels).

<a href="#geoConicEqualArea" name="geoConicEqualArea">#</a> d3.<b>geoConicEqualArea</b>() [<>](https://github.com/d3/d3-geo/blob/master/src/projection/conicEqualArea.js "Source")
<br><a href="#geoConicEqualAreaRaw" name="geoConicEqualAreaRaw">#</a> d3.<b>geoConicEqualAreaRaw</b>(<i>phi0</i>, <i>phi1</i>) [<>](https://github.com/d3/d3-geo/blob/master/src/projection/conicEqualArea.js "Source")

[<img src="https://raw.githubusercontent.com/d3/d3-geo/master/img/conicEqualArea.png" width="480" height="250">](https://bl.ocks.org/mbostock/3734308)

The Albers’ equal-area conic projection. See also [*conic*.parallels](#conic_parallels).

<a href="#geoConicEquidistant" name="geoConicEquidistant">#</a> d3.<b>geoConicEquidistant</b>() [<>](https://github.com/d3/d3-geo/blob/master/src/projection/conicEquidistant.js "Source")
<br><a href="#geoConicEquidistantRaw" name="geoConicEquidistantRaw">#</a> d3.<b>geoConicEquidistantRaw</b>(<i>phi0</i>, <i>phi1</i>) [<>](https://github.com/d3/d3-geo/blob/master/src/projection/conicEquidistant.js "Source")

[<img src="https://raw.githubusercontent.com/d3/d3-geo/master/img/conicEquidistant.png" width="480" height="250">](https://bl.ocks.org/mbostock/3734317)

The conic equidistant projection. See also [*conic*.parallels](#conic_parallels).

#### Cylindrical Projections

Cylindrical projections project the sphere onto a containing cylinder, and then unroll the cylinder onto the plane.

<a href="#geoEquirectangular" name="geoEquirectangular">#</a> d3.<b>geoEquirectangular</b>() [<>](https://github.com/d3/d3-geo/blob/master/src/projection/equirectangular.js "Source")
<br><a href="#geoEquirectangularRaw" name="geoEquirectangularRaw">#</a> d3.<b>geoEquirectangularRaw</b>

[<img src="https://raw.githubusercontent.com/d3/d3-geo/master/img/equirectangular.png" width="480" height="250">](https://bl.ocks.org/mbostock/3757119)

The equirectangular (plate carrée) projection.

<a href="#geoMercator" name="geoMercator">#</a> d3.<b>geoMercator</b>() [<>](https://github.com/d3/d3-geo/blob/master/src/projection/mercator.js "Source")
<br><a href="#geoMercatorRaw" name="geoMercatorRaw">#</a> d3.<b>geoMercatorRaw</b>

[<img src="https://raw.githubusercontent.com/d3/d3-geo/master/img/mercator.png" width="480" height="250">](https://bl.ocks.org/mbostock/3757132)

The spherical Mercator projection. Defines a default [*projection*.clipExtent](#projection_clipExtent) such that the world is projected to a square, clipped to approximately ±85° latitude.

<a href="#geoTransverseMercator" name="geoTransverseMercator">#</a> d3.<b>geoTransverseMercator</b>() [<>](https://github.com/d3/d3-geo/blob/master/src/projection/transverseMercator.js "Source")
<br><a href="#geoTransverseMercatorRaw" name="geoTransverseMercatorRaw">#</a> d3.<b>geoTransverseMercatorRaw</b>

[<img src="https://raw.githubusercontent.com/d3/d3-geo/master/img/transverseMercator.png" width="480" height="250">](https://bl.ocks.org/mbostock/4695821)

The transverse spherical Mercator projection. Defines a default [*projection*.clipExtent](#projection_clipExtent) such that the world is projected to a square, clipped to approximately ±85° latitude.

### Raw Projections

Raw projections are point transformation functions that are used to implement custom projections; they typically passed to [d3.geoProjection](#geoProjection) or [d3.geoProjectionMutator](#geoProjectionMutator). They are exposed here to facilitate the derivation of related projections. Raw projections take spherical coordinates \[*lambda*, *phi*\] in radians (not degrees!) and return a point \[*x*, *y*\], typically in the unit square centered around the origin.

<a href="#_project" name="_project">#</a> <i>project</i>(<i>lambda</i>, <i>phi</i>)

Projects the specified point [<i>lambda</i>, <i>phi</i>] in radians, returning a new point \[*x*, *y*\] in unitless coordinates.

<a href="#project_invert" name="project_invert">#</a> <i>project</i>.<b>invert</b>(<i>x</i>, <i>y</i>)

The inverse of [*project*](#_project).

<a href="#geoProjection" name="geoProjection">#</a> d3.<b>geoProjection</b>(<i>project</i>) [<>](https://github.com/d3/d3-geo/blob/master/src/projection/index.js#L18 "Source")

Constructs a new projection from the specified [raw projection](#_project), *project*. The *project* function takes the *longitude* and *latitude* of a given point in [radians](http://mathworld.wolfram.com/Radian.html), often referred to as *lambda* (λ) and *phi* (φ), and returns a two-element array \[*x*, *y*\] representing its unit projection. The *project* function does not need to scale or translate the point, as these are applied automatically by [*projection*.scale](#projection_scale), [*projection*.translate](#projection_translate), and [*projection*.center](#projection_center). Likewise, the *project* function does not need to perform any spherical rotation, as [*projection*.rotate](#projection_rotate) is applied prior to projection.

For example, a spherical Mercator projection can be implemented as:

```js
var mercator = d3.geoProjection(function(x, y) {
  return [x, Math.log(Math.tan(Math.PI / 4 + y / 2))];
});
```

If the *project* function exposes an *invert* method, the returned projection will also expose [*projection*.invert](#projection_invert).

<a href="#geoProjectionMutator" name="geoProjectionMutator">#</a> d3.<b>geoProjectionMutator</b>(<i>factory</i>) [<>](https://github.com/d3/d3-geo/blob/master/src/projection/index.js#L22 "Source")

Constructs a new projection from the specified [raw projection](#_project) *factory* and returns a *mutate* function to call whenever the raw projection changes. The *factory* must return a raw projection. The returned *mutate* function returns the wrapped projection. For example, a conic projection typically has two configurable parallels. A suitable *factory* function, such as [d3.geoConicEqualAreaRaw](#geoConicEqualAreaRaw), would have the form:

```js
// y0 and y1 represent two parallels
function conicFactory(phi0, phi1) {
  return function conicRaw(lambda, phi) {
    return […, …];
  };
}
```

Using d3.geoProjectionMutator, you can implement a standard projection that allows the parallels to be changed, reassigning the raw projection used internally by [d3.geoProjection](#geoProjection):

```js
function conicCustom() {
  var phi0 = 29.5,
      phi1 = 45.5,
      mutate = d3.geoProjectionMutator(conicFactory),
      projection = mutate(phi0, phi1);

  projection.parallels = function(_) {
    return arguments.length ? mutate(phi0 = +_[0], phi1 = +_[1]) : [phi0, phi1];
  };

  return projection;
}
```

When creating a mutable projection, the *mutate* function is typically not exposed.

### Spherical Math

<a name="geoArea" href="#geoArea">#</a> d3.<b>geoArea</b>(<i>object</i>) [<>](https://github.com/d3/d3-geo/blob/master/src/area.js "Source")

Returns the spherical area of the specified GeoJSON *object* in [steradians](http://mathworld.wolfram.com/Steradian.html). This is the spherical equivalent of [*path*.area](#path_area).

<a name="geoBounds" href="#geoBounds">#</a> d3.<b>geoBounds</b>(<i>object</i>) [<>](https://github.com/d3/d3-geo/blob/master/src/bounds.js "Source")

Returns the [spherical bounding box](https://www.jasondavies.com/maps/bounds/) for the specified GeoJSON *object*. The bounding box is represented by a two-dimensional array: \[\[*left*, *bottom*], \[*right*, *top*\]\], where *left* is the minimum longitude, *bottom* is the minimum latitude, *right* is maximum longitude, and *top* is the maximum latitude. All coordinates are given in degrees. (Note that in projected planar coordinates, the minimum latitude is typically the maximum *y*-value, and the maximum latitude is typically the minimum *y*-value.) This is the spherical equivalent of [*path*.bounds](#path_bounds).

<a name="geoCentroid" href="#geoCentroid">#</a> d3.<b>geoCentroid</b>(<i>object</i>) [<>](https://github.com/d3/d3-geo/blob/master/src/centroid.js "Source")

Returns the spherical centroid of the specified GeoJSON *object*. This is the spherical equivalent of [*path*.centroid](#path_centroid).

<a name="geoDistance" href="#geoDistance">#</a> d3.<b>geoDistance</b>(<i>a</i>, <i>b</i>) [<>](https://github.com/d3/d3-geo/blob/master/src/distance.js "Source")

Returns the great-arc distance in [radians](http://mathworld.wolfram.com/Radian.html) between the two points *a* and *b*. Each point must be specified as a two-element array \[*longitude*, *latitude*\] in degrees. This is the spherical equivalent of [*path*.measure](#path_measure) given a LineString of two points.

<a name="geoLength" href="#geoLength">#</a> d3.<b>geoLength</b>(<i>object</i>) [<>](https://github.com/d3/d3-geo/blob/master/src/length.js "Source")

Returns the great-arc length of the specified GeoJSON *object* in [radians](http://mathworld.wolfram.com/Radian.html). For polygons, returns the perimeter of the exterior ring plus that of any interior rings. This is the spherical equivalent of [*path*.measure](#path_measure).

<a name="geoInterpolate" href="#geoInterpolate">#</a> d3.<b>geoInterpolate</b>(<i>a</i>, <i>b</i>) [<>](https://github.com/d3/d3-geo/blob/master/src/interpolate.js "Source")

Returns an interpolator function given two points *a* and *b*. Each point must be specified as a two-element array \[*longitude*, *latitude*\] in degrees. The returned interpolator function takes a single argument *t*, where *t* is a number ranging from 0 to 1; a value of 0 returns the point *a*, while a value of 1 returns the point *b*. Intermediate values interpolate from *a* to *b* along the great arc that passes through both *a* and *b*. If *a* and *b* are antipodes, an arbitrary great arc is chosen.

<a name="geoContains" href="#geoContains">#</a> d3.<b>geoContains</b>(<i>object</i>, <i>point</i>) [<>](https://github.com/d3/d3-geo/blob/master/src/contains.js "Source")

Returns true if and only if the specified GeoJSON *object* contains the specified *point*, or false if the *object* does not contain the *point*. The point must be specified as a two-element array \[*longitude*, *latitude*\] in degrees. For Point and MultiPoint geometries, an exact test is used; for a Sphere, true is always returned; for other geometries, an epsilon threshold is applied.

<a name="geoRotation" href="#geoRotation">#</a> d3.<b>geoRotation</b>(<i>angles</i>) [<>](https://github.com/d3/d3-geo/blob/master/src/rotation.js "Source")

Returns a [rotation function](#_rotation) for the given *angles*, which must be a two- or three-element array of numbers [*lambda*, *phi*, *gamma*] specifying the rotation angles in degrees about [each spherical axis](https://bl.ocks.org/mbostock/4282586). (These correspond to [yaw, pitch and roll](http://en.wikipedia.org/wiki/Aircraft_principal_axes).) If the rotation angle *gamma* is omitted, it defaults to 0. See also [*projection*.rotate](#projection_rotate).

<a name="_rotation" href="#_rotation">#</a> <i>rotation</i>(<i>point</i>) [<>](https://github.com/d3/d3-geo/blob/master/src/rotation.js#L35 "Source")

Returns a new array \[*longitude*, *latitude*\] in degrees representing the rotated point of the given *point*. The point must be specified as a two-element array \[*longitude*, *latitude*\] in degrees.

<a name="rotation_invert" href="#rotation_invert">#</a> <i>rotation</i>.<b>invert</b>(<i>point</i>) [<>](https://github.com/d3/d3-geo/blob/master/src/rotation.js#L47 "Source")

Returns a new array \[*longitude*, *latitude*\] in degrees representing the point of the given rotated *point*; the inverse of [*rotation*](#_rotation). The point must be specified as a two-element array \[*longitude*, *latitude*\] in degrees.

### Spherical Shapes

To generate a [great arc](https://en.wikipedia.org/wiki/Great-circle_distance) (a segment of a great circle), simply pass a GeoJSON LineString geometry object to a [d3.geoPath](#geoPath). D3’s projections use great-arc interpolation for intermediate points, so there’s no need for a great arc shape generator.

<a name="geoCircle" href="#geoCircle">#</a> d3.<b>geoCircle</b>() [<>](https://github.com/d3/d3-geo/blob/master/src/circle.js "Source")

Returns a new circle generator.

<a name="_circle" href="#_circle">#</a> <i>circle</i>(<i>arguments…</i>) [<>](https://github.com/d3/d3-geo/blob/master/src/circle.js#L47 "Source")

Returns a new GeoJSON geometry object of type “Polygon” approximating a circle on the surface of a sphere, with the current [center](#circle_center), [radius](#circle_radius) and [precision](#circle_precision). Any *arguments* are passed to the accessors.

<a name="circle_center" href="#circle_center">#</a> <i>circle</i>.<b>center</b>([<i>center</i>]) [<>](https://github.com/d3/d3-geo/blob/master/src/circle.js#L59 "Source")

If *center* is specified, sets the circle center to the specified point \[*longitude*, *latitude*\] in degrees, and returns this circle generator. The center may also be specified as a function; this function will be invoked whenever a circle is [generated](#_circle), being passed any arguments passed to the circle generator. If *center* is not specified, returns the current center accessor, which defaults to:

```js
function center() {
  return [0, 0];
}
```

<a name="circle_radius" href="#circle_radius">#</a> <i>circle</i>.<b>radius</b>([<i>radius</i>]) [<>](https://github.com/d3/d3-geo/blob/master/src/circle.js#L63 "Source")

If *radius* is specified, sets the circle radius to the specified angle in degrees, and returns this circle generator. The radius may also be specified as a function; this function will be invoked whenever a circle is [generated](#_circle), being passed any arguments passed to the circle generator. If *radius* is not specified, returns the current radius accessor, which defaults to:

```js
function radius() {
  return 90;
}
```

<a name="circle_precision" href="#circle_precision">#</a> <i>circle</i>.<b>precision</b>([<i>angle</i>]) [<>](https://github.com/d3/d3-geo/blob/master/src/circle.js#L67 "Source")

If *precision* is specified, sets the circle precision to the specified angle in degrees, and returns this circle generator. The precision may also be specified as a function; this function will be invoked whenever a circle is [generated](#_circle), being passed any arguments passed to the circle generator. If *precision* is not specified, returns the current precision accessor, which defaults to:

```js
function precision() {
  return 6;
}
```

Small circles do not follow great arcs and thus the generated polygon is only an approximation. Specifying a smaller precision angle improves the accuracy of the approximate polygon, but also increase the cost to generate and render it.

<a name="geoGraticule" href="#geoGraticule">#</a> d3.<b>geoGraticule</b>() [<>](https://github.com/d3/d3-geo/blob/master/src/graticule.js "Source")

Constructs a geometry generator for creating graticules: a uniform grid of [meridians](https://en.wikipedia.org/wiki/Meridian_\(geography\)) and [parallels](https://en.wikipedia.org/wiki/Circle_of_latitude) for showing projection distortion. The default graticule has meridians and parallels every 10° between ±80° latitude; for the polar regions, there are meridians every 90°.

<img src="https://raw.githubusercontent.com/d3/d3-geo/master/img/graticule.png" width="480" height="360">

<a name="_graticule" href="#_graticule">#</a> <i>graticule</i>() [<>](https://github.com/d3/d3-geo/blob/master/src/graticule.js#L21 "Source")

Returns a GeoJSON MultiLineString geometry object representing all meridians and parallels for this graticule.

<a name="graticule_lines" href="#graticule_lines">#</a> <i>graticule</i>.<b>lines</b>() [<>](https://github.com/d3/d3-geo/blob/master/src/graticule.js#L32 "Source")

Returns an array of GeoJSON LineString geometry objects, one for each meridian or parallel for this graticule.

<a name="graticule_outline" href="#graticule_outline">#</a> <i>graticule</i>.<b>outline</b>() [<>](https://github.com/d3/d3-geo/blob/master/src/graticule.js#L36 "Source")

Returns a GeoJSON Polygon geometry object representing the outline of this graticule, i.e. along the meridians and parallels defining its extent.

<a name="graticule_extent" href="#graticule_extent">#</a> <i>graticule</i>.<b>extent</b>([<i>extent</i>]) [<>](https://github.com/d3/d3-geo/blob/master/src/graticule.js#L48 "Source")

If *extent* is specified, sets the major and minor extents of this graticule. If *extent* is not specified, returns the current minor extent, which defaults to ⟨⟨-180°, -80° - ε⟩, ⟨180°, 80° + ε⟩⟩.

<a name="graticule_extentMajor" href="#graticule_extentMajor">#</a> <i>graticule</i>.<b>extentMajor</b>([<i>extent</i>]) [<>](https://github.com/d3/d3-geo/blob/master/src/graticule.js#L53 "Source")

If *extent* is specified, sets the major extent of this graticule. If *extent* is not specified, returns the current major extent, which defaults to ⟨⟨-180°, -90° + ε⟩, ⟨180°, 90° - ε⟩⟩.

<a name="graticule_extentMinor" href="#graticule_extentMinor">#</a> <i>graticule</i>.<b>extentMinor</b>([<i>extent</i>]) [<>](https://github.com/d3/d3-geo/blob/master/src/graticule.js#L62 "Source")

If *extent* is specified, sets the minor extent of this graticule. If *extent* is not specified, returns the current minor extent, which defaults to ⟨⟨-180°, -80° - ε⟩, ⟨180°, 80° + ε⟩⟩.

<a name="graticule_step" href="#graticule_step">#</a> <i>graticule</i>.<b>step</b>([<i>step</i>]) [<>](https://github.com/d3/d3-geo/blob/master/src/graticule.js#L71 "Source")

If *step* is specified, sets the major and minor step for this graticule. If *step* is not specified, returns the current minor step, which defaults to ⟨10°, 10°⟩.

<a name="graticule_stepMajor" href="#graticule_stepMajor">#</a> <i>graticule</i>.<b>stepMajor</b>([<i>step</i>]) [<>](https://github.com/d3/d3-geo/blob/master/src/graticule.js#L76 "Source")

If *step* is specified, sets the major step for this graticule. If *step* is not specified, returns the current major step, which defaults to ⟨90°, 360°⟩.

<a name="graticule_stepMinor" href="#graticule_stepMinor">#</a> <i>graticule</i>.<b>stepMinor</b>([<i>step</i>]) [<>](https://github.com/d3/d3-geo/blob/master/src/graticule.js#L82 "Source")

If *step* is specified, sets the minor step for this graticule. If *step* is not specified, returns the current minor step, which defaults to ⟨10°, 10°⟩.

<a name="graticule_precision" href="#graticule_precision">#</a> <i>graticule</i>.<b>precision</b>([<i>angle</i>]) [<>](https://github.com/d3/d3-geo/blob/master/src/graticule.js#L88 "Source")

If *precision* is specified, sets the precision for this graticule, in degrees. If *precision* is not specified, returns the current precision, which defaults to 2.5°.

<a name="geoGraticule10" href="#geoGraticule10">#</a> d3.<b>geoGraticule10</b>() [<>](https://github.com/d3/d3-geo/blob/master/src/graticule.js#L103 "Source")

A convenience method for directly generating the default 10° global graticule as a GeoJSON MultiLineString geometry object. Equivalent to:

```js
function geoGraticule10() {
  return d3.geoGraticule()();
}
```

### Streams

D3 transforms geometry using a sequence of function calls, rather than materializing intermediate representations, to minimize overhead. Streams must implement several methods to receive input geometry. Streams are inherently stateful; the meaning of a [point](#point) depends on whether the point is inside of a [line](#lineStart), and likewise a line is distinguished from a ring by a [polygon](#polygonStart). Despite the name “stream”, these method calls are currently synchronous.

<a href="#geoStream" name="geoStream">#</a> d3.<b>geoStream</b>(<i>object</i>, <i>stream</i>) [<>](https://github.com/d3/d3-geo/blob/master/src/stream.js "Source")

Streams the specified [GeoJSON](http://geojson.org) *object* to the specified [projection *stream*](#projection-streams). While both features and geometry objects are supported as input, the stream interface only describes the geometry, and thus additional feature properties are not visible to streams.

<a name="stream_point" href="#stream_point">#</a> <i>stream</i>.<b>point</b>(<i>x</i>, <i>y</i>[, <i>z</i>])

Indicates a point with the specified coordinates *x* and *y* (and optionally *z*). The coordinate system is unspecified and implementation-dependent; for example, [projection streams](https://github.com/d3/d3-geo-projection) require spherical coordinates in degrees as input. Outside the context of a polygon or line, a point indicates a point geometry object ([Point](http://www.geojson.org/geojson-spec.html#point) or [MultiPoint](http://www.geojson.org/geojson-spec.html#multipoint)). Within a line or polygon ring, the point indicates a control point.

<a name="stream_lineStart" href="#stream_lineStart">#</a> <i>stream</i>.<b>lineStart</b>()

Indicates the start of a line or ring. Within a polygon, indicates the start of a ring. The first ring of a polygon is the exterior ring, and is typically clockwise. Any subsequent rings indicate holes in the polygon, and are typically counterclockwise.

<a name="stream_lineEnd" href="#stream_lineEnd">#</a> <i>stream</i>.<b>lineEnd</b>()

Indicates the end of a line or ring. Within a polygon, indicates the end of a ring. Unlike GeoJSON, the redundant closing coordinate of a ring is *not* indicated via [point](#point), and instead is implied via lineEnd within a polygon. Thus, the given polygon input:

```json
{
  "type": "Polygon",
  "coordinates": [
    [[0, 0], [0, 1], [1, 1], [1, 0], [0, 0]]
  ]
}
```

Will produce the following series of method calls on the stream:

```js
stream.polygonStart();
stream.lineStart();
stream.point(0, 0);
stream.point(0, 1);
stream.point(1, 1);
stream.point(1, 0);
stream.lineEnd();
stream.polygonEnd();
```

<a name="stream_polygonStart" href="#stream_polygonStart">#</a> <i>stream</i>.<b>polygonStart</b>()

Indicates the start of a polygon. The first line of a polygon indicates the exterior ring, and any subsequent lines indicate interior holes.

<a name="stream_polygonEnd" href="#stream_polygonEnd">#</a> <i>stream</i>.<b>polygonEnd</b>()

Indicates the end of a polygon.

<a name="stream_sphere" href="#stream_sphere">#</a> <i>stream</i>.<b>sphere</b>()

Indicates the sphere (the globe; the unit sphere centered at ⟨0,0,0⟩).

### Transforms

Transforms are a generalization of projections. Transform implement [*projection*.stream](#projection_stream) and can be passed to [*path*.projection](#path_projection). However, they only implement a subset of the other projection methods, and represent arbitrary geometric transformations rather than projections from spherical to planar coordinates.

<a href="#geoTransform" name="geoTransform">#</a> d3.<b>geoTransform</b>(<i>methods</i>) [<>](https://github.com/d3/d3-geo/blob/master/src/transform.js#L7 "Source")

Defines an arbitrary transform using the methods defined on the specified *methods* object. Any undefined methods will use pass-through methods that propagate inputs to the output stream. For example, to reflect the *y*-dimension (see also [*identity*.reflectY](#identity_reflectY)):

```js
var reflectY = d3.geoTransform({
  point: function(x, y) {
    this.stream.point(x, -y);
  }
});
```

Or to define an affine matrix transformation:

```js
function matrix(a, b, c, d, tx, ty) {
  return d3.geoTransform({
    point: function(x, y) {
      this.stream.point(a * x + b * y + tx, c * x + d * y + ty);
    }
  });
}
```

<a href="#geoIdentity" name="geoIdentity">#</a> d3.<b>geoIdentity</b>() [<>](https://github.com/d3/d3-geo/blob/master/src/projection/identity.js "Source")

The identity transform can be used to scale, translate and clip planar geometry. It implements [*projection*.scale](#projection_scale), [*projection*.translate](#projection_translate), [*projection*.fitExtent](#projection_fitExtent), [*projection*.fitSize](#projection_fitSize) and [*projection*.clipExtent](#projection_clipExtent).

<a href="#identity_reflectX" name="identity_reflectX">#</a> <i>identity</i>.<b>reflectX</b>([<i>reflect</i>])

If *reflect* is specified, sets whether or not the *x*-dimension is reflected (negated) in the output. If *reflect* is not specified, returns true if *x*-reflection is enabled, which defaults to false.

<a href="#identity_reflectY" name="identity_reflectY">#</a> <i>identity</i>.<b>reflectY</b>([<i>reflect</i>])

If *reflect* is specified, sets whether or not the *y*-dimension is reflected (negated) in the output. If *reflect* is not specified, returns true if *y*-reflection is enabled, which defaults to false. This is especially useful for transforming from standard [spatial reference systems](https://en.wikipedia.org/wiki/Spatial_reference_system), which treat positive *y* as pointing up, to display coordinate systems such as Canvas and SVG, which treat positive *y* as pointing down.
