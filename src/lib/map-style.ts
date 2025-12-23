import type { StyleSpecification } from "maplibre-gl";

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
      paint: { "background-color": "#f8f4f0" },
    },
    {
      id: "natural_earth",
      type: "raster",
      source: "ne2_shaded",
      maxzoom: 7,
      paint: {
        "raster-opacity": [
          "interpolate",
          ["exponential", 1.5],
          ["zoom"],
          0,
          0.6,
          6,
          0.1,
        ],
      },
    },
    {
      id: "landcover_wood",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "landcover",
      filter: ["==", ["get", "class"], "wood"],
      paint: {
        "fill-antialias": false,
        "fill-color": "hsla(98,61%,72%,0.7)",
        "fill-opacity": 0.4,
      },
    },
    {
      id: "landcover_grass",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "landcover",
      filter: ["==", ["get", "class"], "grass"],
      paint: {
        "fill-antialias": false,
        "fill-color": "rgba(176, 213, 154, 1)",
        "fill-opacity": 0.3,
      },
    },
    {
      id: "landcover_ice",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "landcover",
      filter: ["==", ["get", "class"], "ice"],
      paint: {
        "fill-antialias": false,
        "fill-color": "rgba(240, 255, 255, 1)",
        "fill-opacity": 0.8,
      },
    },
    {
      id: "landcover_wetland",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "landcover",
      minzoom: 12,
      filter: ["==", ["get", "class"], "wetland"],
      paint: {
        "fill-antialias": true,
        "fill-opacity": 0.8,
        "fill-pattern": "wetland_bg_11",
        "fill-translate-anchor": "map",
      },
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
        "line-color": "#a0c8f0",
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
        "line-color": "#a0c8f0",
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
    {
      id: "water",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "water",
      filter: ["!=", ["get", "brunnel"], "tunnel"],
      paint: { "fill-color": "hsl(216.9, 100%, 95.5%)" },
    },
    {
      id: "landcover_sand",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "landcover",
      filter: ["==", ["get", "class"], "sand"],
      paint: { "fill-color": "rgba(247, 239, 195, 1)" },
    },
  ],
};
