/**
 * Countries featured in the "Países visitados" interactive map.
 * `isoCode` is the ISO 3166-1 numeric code (as a string) used by the
 * world-atlas topojson (public/maps/countries-110m.json) as each
 * feature's `id` — this is how map regions are matched to database
 * entries.
 */
export const FEATURED_COUNTRIES = [
  {
    slug: "espana",
    name: "España",
    isoCode: "724",
    description:
      "El punto de partida: luz mediterránea, arquitectura y costa atlántica.",
    visitedYear: 2019,
  },
  {
    slug: "islandia",
    name: "Islandia",
    isoCode: "352",
    description: "Paisajes volcánicos, auroras y una luz que no se repite.",
    visitedYear: 2021,
  },
  {
    slug: "noruega",
    name: "Noruega",
    isoCode: "578",
    description: "Fiordos, nieve y silencio en el círculo polar ártico.",
    visitedYear: 2022,
  },
  {
    slug: "francia",
    name: "Francia",
    isoCode: "250",
    description: "Calles de París y viñedos de la Provenza al amanecer.",
    visitedYear: 2018,
  },
  {
    slug: "italia",
    name: "Italia",
    isoCode: "380",
    description: "Arquitectura renacentista y la costa amalfitana.",
    visitedYear: 2020,
  },
  {
    slug: "portugal",
    name: "Portugal",
    isoCode: "620",
    description: "Azulejos, océano y la luz dorada de Lisboa.",
    visitedYear: 2019,
  },
  {
    slug: "marruecos",
    name: "Marruecos",
    isoCode: "504",
    description: "Zocos, desierto y color en cada esquina de Marrakech.",
    visitedYear: 2022,
  },
  {
    slug: "japon",
    name: "Japón",
    isoCode: "392",
    description: "Templos, neón y la quietud del Monte Fuji.",
    visitedYear: 2023,
  },
  {
    slug: "peru",
    name: "Perú",
    isoCode: "604",
    description: "Altura andina, Machu Picchu y mercados vivos.",
    visitedYear: 2021,
  },
  {
    slug: "mexico",
    name: "México",
    isoCode: "484",
    description: "Color, tradición y costa del Pacífico.",
    visitedYear: 2023,
  },
  {
    slug: "estados-unidos",
    name: "Estados Unidos",
    isoCode: "840",
    description: "Desiertos del oeste y la vertical de Nueva York.",
    visitedYear: 2024,
  },
  {
    slug: "grecia",
    name: "Grecia",
    isoCode: "300",
    description: "Islas blancas y azules en el mar Egeo.",
    visitedYear: 2024,
  },
] as const;

export type FeaturedCountry = (typeof FEATURED_COUNTRIES)[number];
