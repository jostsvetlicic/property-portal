/**
 * Database seed.
 *
 * Creates a realistic Slovenian + Croatian marketplace mix (apartments, houses,
 * land, commercial, office, garage, weekend houses — for sale and for rent),
 * 4 agents, one admin user (from env), and the Settings row (seeded from the
 * config file). Run with `npm run seed`.
 *
 * Images use Unsplash CDN URLs so the demo looks fully live out of the box.
 * Swap them for the agency's real photography per clone.
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { agencyConfig } from "../config/agency.config";

const prisma = new PrismaClient();

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1920&q=80`;

/** Exterior hero shots — one distinct image per listing (cycled by index). */
const HERO_EXTERIORS = [
  "1560448204-e02f11c3d0e2", // modern apartment block
  "1512917774080-9991f1c4c750", // sleek facade
  "1568605114967-8130f3a36994", // suburban house
  "1580041065738-e72023775cdc", // villa & garden
  "1449844908441-8829872d2607", // family house
  "1570129477492-45c003edd2be", // house with lawn
  "1523217582562-09d0def993a6", // stone Mediterranean house
  "1580587771525-78b9dba3b914", // architectural villa & pool
  "1600585154340-be6161a56a0c", // dark modern building
  "1512915922686-57c11dde9b6b", // modern block
  "1613490493576-7fde63acd811", // coastal villa
  "1600596542815-ffad4c1539a9", // hillside white villa
  "1486406146926-c627a92ad1ab", // office building
  "1497366216548-37526070297c", // office interior
  "1553062407-98eeb64c6a62", // garage / warehouse
  "1524758631624-e2822e304c36", // commercial interior
  "1502005097973-6a7082348e28", // warm kitchen (weekend house)
  "1449158743715-0a90ebb6d2d8", // cabin / weekend house
];

const INTERIORS = [
  "1600607687939-ce8a6c25118c",
  "1502672260266-1c1ef2d93688",
  "1560448204-e02f11c3d0e2",
  "1502005097973-6a7082348e28",
  "1564078516393-cf04bd966897",
  "1600566752355-35792bedcfea",
  "1554995207-c18c203602cb",
  "1615529162924-f8605388461d",
  "1600585152220-90363fe7e115",
  "1616137466211-f939a420be84",
];
const EXTRAS = [
  "1544984243-ec57ea16fe25",
  "1571003123894-1f0594d2b5d9",
  "1507525428034-b723cf961d3e",
  "1540541338287-41700207dee6",
  "1519046904884-53103b34b206",
  "1505881502353-a1986add3762",
];

/** Builds a 4-image gallery for a listing: hero + interiors/extras. */
function galleryFor(i: number): string[] {
  const hero = HERO_EXTERIORS[i % HERO_EXTERIORS.length];
  const interior = (n: number) => INTERIORS[(i * 3 + n) % INTERIORS.length];
  const extra = (n: number) => EXTRAS[(i * 2 + n) % EXTRAS.length];
  return [img(hero), img(interior(0)), img(interior(2)), img(extra(1))];
}

type Seed = {
  title: string;
  price: number;
  listingType: "sale" | "rent";
  location: string;
  lat: number;
  lng: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  landSize?: number;
  yearBuilt?: number;
  floor?: number;
  totalFloors?: number;
  condition?: string;
  energyRating?: string;
  parking?: boolean;
  elevator?: boolean;
  balcony?: boolean;
  description: string;
  narrative?: string;
  features: string[];
  featured?: boolean;
  status?: string;
  videoUrl?: string;
};

const DEMO_TOURS = [
  "https://www.youtube.com/watch?v=6stlCkUDG_s",
  "https://www.youtube.com/watch?v=LXb3EKWsInQ",
  "https://www.youtube.com/watch?v=Scxs7L0vhZ4",
];

const properties: Seed[] = [
  // ── Ljubljana ──────────────────────────────────────────────────────────
  {
    title: "Two-room apartment near Tivoli Park",
    price: 265_000,
    listingType: "sale",
    location: "Ljubljana, Slovenia",
    lat: 46.0549,
    lng: 14.4939,
    type: "Apartment",
    bedrooms: 1,
    bathrooms: 1,
    area: 58,
    yearBuilt: 1985,
    floor: 3,
    totalFloors: 5,
    condition: "Renovated",
    energyRating: "C",
    parking: true,
    elevator: true,
    balcony: true,
    description:
      "Bright, fully renovated two-room apartment a short walk from Tivoli Park and the city centre. New kitchen and bathroom, balcony facing the courtyard, cellar storage and a reserved parking space. Ready to move in.",
    features: ["Renovated 2021", "Cellar storage", "Reserved parking", "Balcony", "Elevator"],
    featured: true,
  },
  {
    title: "Modern 3-bedroom flat in BTC district",
    price: 1_200,
    listingType: "rent",
    location: "Ljubljana, Slovenia",
    lat: 46.0664,
    lng: 14.5432,
    type: "Apartment",
    bedrooms: 3,
    bathrooms: 2,
    area: 92,
    yearBuilt: 2018,
    floor: 6,
    totalFloors: 8,
    condition: "New build",
    energyRating: "B",
    parking: true,
    elevator: true,
    balcony: true,
    description:
      "Unfurnished three-bedroom apartment in a 2018 building close to BTC City and good transport links. Underfloor heating, large balcony, garage space included. Available immediately, minimum one-year lease.",
    features: ["Underfloor heating", "Garage space", "Balcony", "Elevator", "Pet friendly"],
  },
  {
    title: "Studio apartment in the city centre",
    price: 620,
    listingType: "rent",
    location: "Ljubljana, Slovenia",
    lat: 46.0511,
    lng: 14.5051,
    type: "Apartment",
    bedrooms: 0,
    bathrooms: 1,
    area: 32,
    yearBuilt: 1970,
    floor: 2,
    totalFloors: 4,
    condition: "Good",
    energyRating: "D",
    balcony: false,
    description:
      "Furnished studio in the heart of Ljubljana, steps from Prešeren Square. Ideal for a student or single professional. Utilities to be agreed separately. Available from next month.",
    features: ["Furnished", "City-centre location", "Near university"],
  },
  {
    title: "Family house with garden in Šiška",
    price: 545_000,
    listingType: "sale",
    location: "Ljubljana, Slovenia",
    lat: 46.0872,
    lng: 14.4869,
    type: "House",
    bedrooms: 4,
    bathrooms: 2,
    area: 180,
    landSize: 520,
    yearBuilt: 2005,
    condition: "Good",
    energyRating: "C",
    parking: true,
    balcony: true,
    description:
      "Detached family house on a quiet street in Šiška with a 520 m² garden, double garage and a partially finished basement. Four bedrooms, two bathrooms and a large terrace facing south. Close to schools and public transport.",
    features: ["520 m² garden", "Double garage", "Basement", "South terrace", "Near schools"],
    featured: true,
  },

  // ── Maribor ────────────────────────────────────────────────────────────
  {
    title: "Renovated apartment near Lent",
    price: 158_000,
    listingType: "sale",
    location: "Maribor, Slovenia",
    lat: 46.5576,
    lng: 15.6455,
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 1,
    area: 64,
    yearBuilt: 1962,
    floor: 1,
    totalFloors: 4,
    condition: "Renovated",
    energyRating: "D",
    balcony: true,
    description:
      "Two-bedroom apartment in the old town of Maribor, close to the Lent riverside and the market. Fully renovated in 2020 with new wiring and windows. Small balcony and a cellar. Good value in a central location.",
    features: ["Renovated 2020", "New windows", "Cellar", "Balcony", "Central"],
  },
  {
    title: "House with orchard in Maribor hills",
    price: 320_000,
    listingType: "sale",
    location: "Maribor, Slovenia",
    lat: 46.5300,
    lng: 15.6800,
    type: "House",
    bedrooms: 5,
    bathrooms: 2,
    area: 210,
    landSize: 1400,
    yearBuilt: 1998,
    condition: "Good",
    energyRating: "D",
    parking: true,
    description:
      "Spacious five-bedroom house set in the vineyards above Maribor with a 1,400 m² plot, orchard and a large workshop. Panoramic views over the Drava valley. Ideal for a family or as a weekend retreat.",
    features: ["1,400 m² plot", "Orchard", "Workshop", "Valley views", "Two garages"],
  },
  {
    title: "One-bedroom flat for rent, Tabor",
    price: 480,
    listingType: "rent",
    location: "Maribor, Slovenia",
    lat: 46.5489,
    lng: 15.6560,
    type: "Apartment",
    bedrooms: 1,
    bathrooms: 1,
    area: 46,
    yearBuilt: 1978,
    floor: 4,
    totalFloors: 6,
    condition: "Good",
    energyRating: "D",
    elevator: true,
    balcony: true,
    description:
      "Furnished one-bedroom apartment in the Tabor district, close to the university and city hospital. Elevator, balcony and a low monthly rent. Available immediately.",
    features: ["Furnished", "Near university", "Elevator", "Balcony"],
  },

  // ── Other Slovenia ─────────────────────────────────────────────────────
  {
    title: "Building land with permit near Kranj",
    price: 129_000,
    listingType: "sale",
    location: "Kranj, Slovenia",
    lat: 46.2389,
    lng: 14.3556,
    type: "Land",
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
    landSize: 780,
    condition: "New build",
    description:
      "Flat 780 m² building plot in a developed residential area near Kranj, with a valid building permit for a single-family house and all utilities at the boundary. Excellent connection to the Ljubljana motorway.",
    features: ["Building permit included", "Utilities at boundary", "Flat plot", "Near motorway"],
  },
  {
    title: "Weekend house by Lake Bled",
    price: 295_000,
    listingType: "sale",
    location: "Bled, Slovenia",
    lat: 46.3683,
    lng: 14.1146,
    type: "Weekend House",
    bedrooms: 3,
    bathrooms: 1,
    area: 95,
    landSize: 610,
    yearBuilt: 1990,
    condition: "Good",
    energyRating: "E",
    parking: true,
    balcony: true,
    description:
      "Charming wooden weekend house a few minutes from Lake Bled, surrounded by forest with a 610 m² garden and a covered terrace. Perfect for a holiday home or short-term rental. Sold partly furnished.",
    narrative:
      "Mornings here smell of pine and woodsmoke, with the lake a short walk down the hill and the Alps on the skyline.",
    features: ["Forest setting", "610 m² garden", "Covered terrace", "Partly furnished", "Rental potential"],
    featured: true,
  },
  {
    title: "Office space in business centre, Celje",
    price: 1_450,
    listingType: "rent",
    location: "Celje, Slovenia",
    lat: 46.2309,
    lng: 15.2604,
    type: "Office",
    bedrooms: 0,
    bathrooms: 1,
    area: 120,
    yearBuilt: 2012,
    floor: 2,
    totalFloors: 5,
    condition: "Good",
    energyRating: "B",
    parking: true,
    elevator: true,
    description:
      "120 m² open-plan office on the second floor of a modern business centre in Celje. Air conditioning, fibre internet, meeting room and five parking spaces. Available for immediate lease.",
    features: ["Open plan", "Air conditioning", "Fibre internet", "5 parking spaces", "Meeting room"],
  },
  {
    title: "Retail unit on main street, Novo Mesto",
    price: 189_000,
    listingType: "sale",
    location: "Novo Mesto, Slovenia",
    lat: 45.8010,
    lng: 15.1710,
    type: "Commercial",
    bedrooms: 0,
    bathrooms: 1,
    area: 85,
    yearBuilt: 1980,
    condition: "Renovated",
    energyRating: "C",
    description:
      "Ground-floor retail unit with a large shop window on the main pedestrian street of Novo Mesto. Currently let to a stable tenant, offering an immediate rental yield. Renovated storefront and services.",
    features: ["Prime footfall", "Let to tenant", "Large shop window", "Renovated"],
  },
  {
    title: "Garage box in Koper centre",
    price: 24_000,
    listingType: "sale",
    location: "Koper, Slovenia",
    lat: 45.5481,
    lng: 13.7302,
    type: "Garage",
    bedrooms: 0,
    bathrooms: 0,
    area: 16,
    yearBuilt: 2008,
    condition: "Good",
    description:
      "Secure, enclosed garage box in an underground garage in central Koper. Electric door, easy access, ideal for a car or additional storage. Low maintenance costs.",
    features: ["Underground", "Electric door", "Secure", "Central"],
  },

  // ── Slovenian coast ────────────────────────────────────────────────────
  {
    title: "Sea-view apartment in Portorož",
    price: 415_000,
    listingType: "sale",
    location: "Portorož, Slovenia",
    lat: 45.5145,
    lng: 13.5905,
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 88,
    yearBuilt: 2016,
    floor: 4,
    totalFloors: 6,
    condition: "New build",
    energyRating: "B",
    parking: true,
    elevator: true,
    balcony: true,
    description:
      "Modern two-bedroom apartment with a large sea-view terrace on the Portorož riviera, a short walk from the beach and marina. Garage space and storage included. Excellent holiday-let potential.",
    narrative:
      "The terrace catches the last of the sun over the bay, and the marina lights come on just as the evening cools.",
    features: ["Sea-view terrace", "Garage", "Near beach", "Rental potential", "Elevator"],
    featured: true,
  },
  {
    title: "Stone house in Piran old town",
    price: 480_000,
    listingType: "sale",
    location: "Piran, Slovenia",
    lat: 45.5285,
    lng: 13.5683,
    type: "House",
    bedrooms: 3,
    bathrooms: 2,
    area: 130,
    yearBuilt: 1920,
    condition: "Renovated",
    energyRating: "D",
    balcony: true,
    description:
      "Characterful stone townhouse in the heart of Piran, sensitively renovated over four floors with a small roof terrace overlooking the rooftops and sea. Steps from Tartini Square. Rare to the market.",
    features: ["Old-town location", "Roof terrace", "Sea glimpses", "Renovated stonework"],
  },
  {
    title: "Apartment for rent in Izola",
    price: 850,
    listingType: "rent",
    location: "Izola, Slovenia",
    lat: 45.5386,
    lng: 13.6608,
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 1,
    area: 62,
    yearBuilt: 2004,
    floor: 2,
    totalFloors: 3,
    condition: "Good",
    energyRating: "C",
    balcony: true,
    parking: true,
    description:
      "Furnished two-bedroom apartment near the marina in Izola, with a balcony and a parking space. Walking distance to the old town and beaches. Available for a long-term lease.",
    features: ["Furnished", "Near marina", "Balcony", "Parking", "Long-term let"],
  },

  // ── Croatia ────────────────────────────────────────────────────────────
  {
    title: "Two-bedroom apartment in Split centre",
    price: 340_000,
    listingType: "sale",
    location: "Split, Croatia",
    lat: 43.5081,
    lng: 16.4402,
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 1,
    area: 72,
    yearBuilt: 2009,
    floor: 3,
    totalFloors: 5,
    condition: "Good",
    energyRating: "C",
    elevator: true,
    balcony: true,
    description:
      "Well-kept two-bedroom apartment within walking distance of Diocletian's Palace and the Riva. Balcony with partial sea views, elevator and a storage room. Strong short-term rental history.",
    features: ["Near old town", "Partial sea view", "Elevator", "Storage room", "Rental history"],
    featured: true,
  },
  {
    title: "Family villa with pool near Rovinj",
    price: 590_000,
    listingType: "sale",
    location: "Rovinj, Croatia",
    lat: 45.0811,
    lng: 13.6387,
    type: "Villa",
    bedrooms: 4,
    bathrooms: 3,
    area: 240,
    landSize: 800,
    yearBuilt: 2015,
    condition: "New build",
    energyRating: "B",
    parking: true,
    balcony: true,
    description:
      "Contemporary four-bedroom villa a few kilometres from Rovinj, with a heated pool, landscaped 800 m² garden and covered parking. High-quality finishes throughout. Ideal as a permanent home or premium holiday rental.",
    narrative:
      "Istrian stone, olive trees and a pool that stays warm into October — a house built for long Adriatic summers.",
    features: ["Heated pool", "800 m² garden", "Covered parking", "High-end finishes", "Rental potential"],
    featured: true,
  },
  {
    title: "Apartment for rent in Opatija",
    price: 900,
    listingType: "rent",
    location: "Opatija, Croatia",
    lat: 45.3378,
    lng: 14.3053,
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 1,
    area: 70,
    yearBuilt: 1975,
    floor: 2,
    totalFloors: 3,
    condition: "Renovated",
    energyRating: "C",
    balcony: true,
    description:
      "Renovated two-bedroom apartment on the Opatija Lungomare with sea views from the balcony. Furnished to a high standard, available for a long-term lease. Utilities excluded.",
    features: ["Sea-view balcony", "On the Lungomare", "Furnished", "Renovated"],
  },
  {
    title: "Land plot with sea view, Zadar area",
    price: 145_000,
    listingType: "sale",
    location: "Zadar, Croatia",
    lat: 44.1194,
    lng: 15.2314,
    type: "Land",
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
    landSize: 1050,
    condition: "New build",
    description:
      "1,050 m² building plot in a quiet village near Zadar with open sea and island views. Zoned for residential construction, electricity and water nearby. A rare opportunity to build close to the coast.",
    features: ["Sea & island views", "Residential zoning", "Utilities nearby", "1,050 m² plot"],
  },
  {
    title: "Office suite in Zagreb business tower",
    price: 1_900,
    listingType: "rent",
    location: "Zagreb, Croatia",
    lat: 45.8003,
    lng: 15.9698,
    type: "Office",
    bedrooms: 0,
    bathrooms: 2,
    area: 160,
    yearBuilt: 2019,
    floor: 9,
    totalFloors: 15,
    condition: "New build",
    energyRating: "A",
    parking: true,
    elevator: true,
    description:
      "Premium 160 m² office suite on the ninth floor of a modern business tower in Zagreb, with panoramic city views, air conditioning, raised floors and six garage spaces. Turn-key and available now.",
    features: ["Panoramic views", "Raised floors", "Air conditioning", "6 garage spaces", "24/7 access"],
  },
  {
    title: "Stone weekend house in Istrian village",
    price: 210_000,
    listingType: "sale",
    location: "Pula, Croatia",
    lat: 44.8666,
    lng: 13.8496,
    type: "Weekend House",
    bedrooms: 2,
    bathrooms: 1,
    area: 85,
    landSize: 430,
    yearBuilt: 1930,
    condition: "Renovated",
    energyRating: "E",
    balcony: true,
    description:
      "Renovated stone house in a peaceful Istrian village near Pula, with a courtyard, summer kitchen and a small garden. Traditional character combined with modern comforts. A great lock-up-and-leave holiday home.",
    features: ["Istrian stone", "Courtyard", "Summer kitchen", "Village setting"],
  },
  {
    title: "Beachfront penthouse in Dubrovnik",
    price: 1_250_000,
    listingType: "sale",
    location: "Dubrovnik, Croatia",
    lat: 42.6407,
    lng: 18.1077,
    type: "Apartment",
    bedrooms: 3,
    bathrooms: 3,
    area: 165,
    yearBuilt: 2017,
    floor: 5,
    totalFloors: 5,
    condition: "New build",
    energyRating: "A",
    parking: true,
    elevator: true,
    balcony: true,
    description:
      "Top-floor penthouse a short distance from Dubrovnik's Old Town, with a wrap-around terrace, private plunge pool and uninterrupted views of the Adriatic. Two garage spaces and concierge service. A trophy coastal residence.",
    narrative:
      "From the terrace the walls of the Old Town glow gold at sunset while ferries trace the horizon toward Lokrum.",
    features: ["Wrap-around terrace", "Private plunge pool", "Sea views", "2 garage spaces", "Concierge"],
    featured: true,
    videoUrl: "https://www.youtube.com/watch?v=6stlCkUDG_s",
  },
  {
    title: "Commercial hall on Rijeka ring road",
    price: 460_000,
    listingType: "sale",
    location: "Rijeka, Croatia",
    lat: 45.3271,
    lng: 14.4422,
    type: "Commercial",
    bedrooms: 0,
    bathrooms: 2,
    area: 640,
    landSize: 1200,
    yearBuilt: 2006,
    condition: "Good",
    energyRating: "C",
    parking: true,
    description:
      "640 m² commercial and warehouse hall with offices, high ceilings and a loading dock on Rijeka's ring road, with excellent motorway access and ample parking on a 1,200 m² plot. Suitable for logistics, retail or production.",
    features: ["Loading dock", "High ceilings", "Motorway access", "Office area", "Large parking"],
  },
];

const agents = [
  {
    name: "Maja Horvat",
    role: "Director",
    email: "maja@propertyportal.si",
    phone: "+386 40 620 441",
    photoUrl: img("1573496359142-b8d87734a5a2"),
    bio: "Maja leads Property Portal with fifteen years in the Slovenian residential market. She oversees the Ljubljana and central Slovenia listings and advises buyers and sellers day to day.",
  },
  {
    name: "Luka Novak",
    role: "Agent — Coast & Istria",
    email: "luka@propertyportal.si",
    phone: "+386 40 620 442",
    photoUrl: img("1519085360753-af0119f7cbe7"),
    bio: "Based in Koper, Luka covers the Slovenian coast and Croatian Istria, from apartments in Portorož to stone houses in Rovinj.",
  },
  {
    name: "Ana Kovačević",
    role: "Agent — Croatia",
    email: "ana@propertyportal.si",
    phone: "+385 91 620 443",
    photoUrl: img("1580489944761-15a19d654956"),
    bio: "Ana handles the Croatian market from Zagreb to Dalmatia, with particular expertise in coastal apartments and investment property.",
  },
  {
    name: "Tomaž Zupan",
    role: "Agent — Commercial & Land",
    email: "tomaz@propertyportal.si",
    phone: "+386 40 620 444",
    photoUrl: img("1560250097-0b93528c311a"),
    bio: "Tomaž specialises in commercial units, offices and building land across Slovenia and Croatia, advising both owner-occupiers and investors.",
  },
];

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  console.log("🌱 Seeding database…");

  // Clean slate (order matters for FKs).
  await prisma.inquiry.deleteMany();
  await prisma.image.deleteMany();
  await prisma.property.deleteMany();
  await prisma.agent.deleteMany();
  await prisma.user.deleteMany();
  await prisma.settings.deleteMany();

  // Agents.
  const createdAgents = [];
  for (const a of agents) {
    createdAgents.push(await prisma.agent.create({ data: a }));
  }
  console.log(`  ✓ ${createdAgents.length} agents`);

  // Properties with images, round-robin assigned to agents.
  const createdProperties = [];
  let i = 0;
  for (const p of properties) {
    const agent = createdAgents[i % createdAgents.length];
    const gallery = galleryFor(i);
    // Deterministic but varied demo view counts (featured skew higher) so the
    // dashboard "Most viewed" panel is populated out of the box.
    const views = (p.featured ? 480 : 60) + ((i * 137) % 420);
    createdProperties.push(
      await prisma.property.create({
        data: {
          slug: slugify(p.title),
          reference: `PP-${100001 + i}`,
          title: p.title,
          price: p.price,
          currency: "EUR",
          listingType: p.listingType,
          location: p.location,
          lat: p.lat,
          lng: p.lng,
          type: p.type,
          status: p.status ?? "available",
          bedrooms: p.bedrooms,
          bathrooms: p.bathrooms,
          area: p.area,
          landSize: p.landSize ?? null,
          yearBuilt: p.yearBuilt ?? null,
          floor: p.floor ?? null,
          totalFloors: p.totalFloors ?? null,
          condition: p.condition ?? null,
          energyRating: p.energyRating ?? null,
          parking: p.parking ?? false,
          elevator: p.elevator ?? false,
          balcony: p.balcony ?? false,
          description: p.description,
          narrative: p.narrative ?? null,
          videoUrl:
            p.videoUrl ??
            (i % 5 === 0 ? DEMO_TOURS[(i / 5) % DEMO_TOURS.length] : null),
          features: JSON.stringify(p.features),
          featured: p.featured ?? false,
          views,
          agentId: agent.id,
          images: {
            create: gallery.map((url, order) => ({
              url,
              alt: `${p.title} — image ${order + 1}`,
              order,
            })),
          },
        },
      }),
    );
    i++;
  }
  console.log(`  ✓ ${properties.length} properties`);

  // Sample inquiries (leads) so the dashboard + inquiries screens are populated
  // on a fresh clone — a spread of sources, statuses and recency.
  const daysAgo = (d: number) => new Date(Date.now() - d * 24 * 60 * 60 * 1000);
  const sampleInquiries = [
    { name: "Nina Jerman", email: "nina.jerman@gmail.com", phone: "+386 41 223 118", message: "We're first-time buyers interested in the apartment near Tivoli. Could we arrange a viewing this week?", source: "property", status: "new", propertyIdx: 0, daysAgo: 1 },
    { name: "Marko Petrič", email: "marko.petric@outlook.com", phone: "+386 31 556 902", message: "Is the 3-bedroom flat in BTC still available to rent from the 1st? Are pets allowed?", source: "property", status: "contacted", propertyIdx: 1, daysAgo: 2 },
    { name: "Sara Lah", email: "sara.lah@proton.me", phone: null, message: "Looking for a family house in Ljubljana up to €550k with a garden — please let me know what you have.", source: "contact", status: "new", propertyIdx: null, daysAgo: 3 },
    { name: "Ivan Babić", email: "ivan.babic@gmail.com", phone: "+385 91 447 3321", message: "Interested in the villa near Rovinj as a holiday home. What are the annual running costs?", source: "property", status: "contacted", propertyIdx: 18, daysAgo: 4 },
    { name: "Petra Kos", email: "petra.kos@gmail.com", phone: "+386 40 118 774", message: "Thank you for the viewing of the Portorož apartment — we'd like to make an offer. How do we proceed?", source: "property", status: "closed", propertyIdx: 14, daysAgo: 8 },
    { name: "Andreas Vogel", email: "a.vogel@vogel-holdings.de", phone: "+49 151 2233 4455", message: "Considering the Zagreb office suite for our regional team. Can we schedule a call about lease terms?", source: "property", status: "new", propertyIdx: 21, daysAgo: 5 },
    { name: "Klara Novak", email: "klara.novak@icloud.com", phone: "+386 51 903 221", message: "General enquiry — do you help with selling? I have an apartment in Maribor to put on the market.", source: "contact", status: "closed", propertyIdx: null, daysAgo: 12 },
  ];
  for (const q of sampleInquiries) {
    const property =
      q.propertyIdx === null ? null : createdProperties[q.propertyIdx];
    await prisma.inquiry.create({
      data: {
        name: q.name,
        email: q.email,
        phone: q.phone,
        message: q.message,
        source: q.source,
        status: q.status,
        read: q.status !== "new",
        propertyId: property?.id ?? null,
        agentId: property?.agentId ?? null,
        createdAt: daysAgo(q.daysAgo),
      },
    });
  }
  console.log(`  ✓ ${sampleInquiries.length} inquiries`);

  // Admin user.
  const email = process.env.ADMIN_EMAIL ?? "admin@propertyportal.si";
  const password = process.env.ADMIN_PASSWORD ?? "changeme123";
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { email, passwordHash, name: "Administrator" },
  });
  console.log(`  ✓ admin user (${email})`);

  // Settings row seeded from the config file.
  await prisma.settings.create({
    data: {
      id: 1,
      mode: agencyConfig.mode,
      name: agencyConfig.name,
      logoText: agencyConfig.logoText,
      tagline: agencyConfig.tagline,
      accentColor: agencyConfig.theme.colors.accent,
      baseColor: agencyConfig.theme.colors.base,
      creamColor: agencyConfig.theme.colors.cream,
      email: agencyConfig.contact.email,
      phone: agencyConfig.contact.phone,
      address: agencyConfig.contact.address,
    },
  });
  console.log("  ✓ settings row");

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
