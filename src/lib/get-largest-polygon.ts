const ringArea = (ring: number[][]): number => {
  let area = 0;
  const n = ring.length;
  for (let i = 0; i < n; i++) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[(i + 1) % n];
    area += x1 * y2 - x2 * y1;
  }
  return Math.abs(area) / 2;
};

export const getLargestPolygon = (
  feature: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>
): GeoJSON.Feature<GeoJSON.Polygon> => {
  if (feature.geometry.type === "Polygon") {
    return feature as GeoJSON.Feature<GeoJSON.Polygon>;
  } else {
    let largestArea = -Infinity;
    let largestPolygon: GeoJSON.Polygon | null = null;
    for (const polygon of feature.geometry.coordinates) {
      const area = ringArea(polygon[0]);
      if (area > largestArea) {
        largestArea = area;
        largestPolygon = {
          type: "Polygon",
          coordinates: polygon,
        };
      }
    }
    return {
      type: "Feature",
      properties: feature.properties,
      geometry: largestPolygon!,
    };
  }
};
