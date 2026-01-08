import type { StyleSpecification } from "maplibre-gl";

const waterColor = "hsl(216, 100%, 90%)";
const landmassColor = "rgb(255, 255, 255)";

// based on the style "Libeerty" by OpenFreeMap (https://openfreemap.org)
// licensed under CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/)
export const style: StyleSpecification = {
  version: 8,
  projection: { type: "globe" },
  sources: {
    ne2_shaded: {
      maxzoom: 6,
      tileSize: 256,
      tiles: [
        "https://tiles.openfreemap.org/natural_earth/ne2sr/{z}/{x}/{y}.png",
      ],
      type: "raster",
    },
    openmaptiles: {
      type: "vector",
      url: "https://tiles.openfreemap.org/planet",
    },
  },
  layers: [
    {
      id: "background",
      type: "background",
      paint: { "background-color": landmassColor },
    },
    {
      id: "water",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "water",
      filter: ["!=", ["get", "brunnel"], "tunnel"],
      paint: { "fill-color": waterColor },
    },
    {
      id: "waterway_river",
      type: "line",
      source: "openmaptiles",
      "source-layer": "waterway",
      filter: [
        "all",
        ["==", ["get", "class"], "river"],
        ["!=", ["get", "brunnel"], "tunnel"],
      ],
      layout: { "line-cap": "round" },
      paint: {
        "line-color": waterColor,
        "line-width": [
          "interpolate",
          ["exponential", 1.2],
          ["zoom"],
          11,
          0.5,
          20,
          6,
        ],
      },
    },
    {
      id: "waterway_other",
      type: "line",
      source: "openmaptiles",
      "source-layer": "waterway",
      filter: [
        "all",
        ["!=", ["get", "class"], "river"],
        ["!=", ["get", "brunnel"], "tunnel"],
      ],
      layout: { "line-cap": "round" },
      paint: {
        "line-color": waterColor,
        "line-width": [
          "interpolate",
          ["exponential", 1.3],
          ["zoom"],
          13,
          0.5,
          20,
          6,
        ],
      },
    },
  ],
};
