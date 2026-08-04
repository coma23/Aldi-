"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";

export interface MapCountry {
  slug: string;
  name: string;
  isoCode: string;
  photoCount: number;
}

export function WorldMap({ countries }: { countries: MapCountry[] }) {
  const router = useRouter();
  const [hovered, setHovered] = useState<MapCountry | null>(null);

  const byIso = useMemo(() => {
    return new Map(countries.map((c) => [c.isoCode, c]));
  }, [countries]);

  return (
    <div className="relative w-full">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 130, center: [10, 15] }}
        className="w-full"
        style={{ width: "100%", height: "auto" }}
      >
        <Geographies geography="/maps/countries-110m.json">
          {({ geographies }) =>
            geographies.map((geo) => {
              const match = byIso.get(String(geo.id));
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => match && setHovered(match)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => {
                    if (match) router.push(`/portfolio?pais=${match.slug}`);
                  }}
                  style={{
                    default: {
                      fill: match ? "#c9a15a" : "#232320",
                      stroke: "#0c0c0b",
                      strokeWidth: 0.5,
                      outline: "none",
                      cursor: match ? "pointer" : "default",
                      transition: "fill 0.2s ease",
                    },
                    hover: {
                      fill: match ? "#e4bd75" : "#2c2c28",
                      stroke: "#0c0c0b",
                      strokeWidth: 0.5,
                      outline: "none",
                      cursor: match ? "pointer" : "default",
                    },
                    pressed: {
                      fill: "#e4bd75",
                      stroke: "#0c0c0b",
                      strokeWidth: 0.5,
                      outline: "none",
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      <div className="pointer-events-none absolute left-4 top-4 min-h-[3.5rem]">
        {hovered && (
          <div className="bg-surface/90 px-4 py-2 backdrop-blur">
            <p className="font-display text-lg">{hovered.name}</p>
            <p className="text-xs uppercase tracking-wide text-paper/50">
              {hovered.photoCount} fotografías
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
