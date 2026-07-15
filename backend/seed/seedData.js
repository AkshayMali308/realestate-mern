export const users = [
  { name: "Rohan Mehta", email: "rohan.owner@example.com", password: "password123", phone: "9820011223", role: "owner" },
  { name: "Priya Shah Realty", email: "priya.agent@example.com", password: "password123", phone: "9820033445", role: "agent", company: "Shah Realty Partners" },
  { name: "Ankit Builders Group", email: "ankit.builder@example.com", password: "password123", phone: "9820055667", role: "agent", company: "Ankit Builders Group" },
  { name: "Demo Buyer", email: "buyer@example.com", password: "password123", phone: "9998887771", role: "buyer" },
];

const localities = {
  Mumbai: ["Andheri West", "Powai", "Bandra East", "Malad West", "Chembur", "Thane West"],
  Pune: ["Baner", "Kharadi", "Hinjewadi", "Wakad", "Viman Nagar"],
  Bengaluru: ["Whitefield", "Koramangala", "HSR Layout", "Electronic City", "Marathahalli"],
  Delhi: ["Dwarka", "Rohini", "Vasant Kunj", "Saket"],
  Hyderabad: ["Gachibowli", "Kondapur", "Madhapur", "Kukatpally"],
};

const propertyTypes = ["apartment", "villa", "independent-house", "plot", "office", "shop"];
const amenitiesPool = [
  "Power Backup", "Lift", "Gated Security", "Swimming Pool", "Gymnasium", "Clubhouse",
  "Children's Play Area", "Reserved Parking", "Rain Water Harvesting", "Vaastu Compliant",
  "24x7 Water Supply", "Intercom", "Park", "Jogging Track",
];

const images = [
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200",
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200",
  "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=1200",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200",
  "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1200",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1200",
];

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const sample = (arr, n) => [...arr].sort(() => 0.5 - Math.random()).slice(0, n);

const titleFor = (bhk, type, locality) => {
  if (type === "plot") return `Residential Plot in ${locality}`;
  if (type === "office") return `Commercial Office Space in ${locality}`;
  if (type === "shop") return `Retail Shop in ${locality}`;
  const label = type === "villa" ? "Villa" : type === "independent-house" ? "Independent House" : "Flat";
  return `${bhk} BHK ${label} for Sale in ${locality}`;
};

export const generateProperties = (ownerIds) => {
  const properties = [];
  Object.entries(localities).forEach(([city, localityList]) => {
    localityList.forEach((locality) => {
      const count = randInt(2, 4);
      for (let i = 0; i < count; i++) {
        const type = rand(propertyTypes);
        const listingType = Math.random() > 0.6 ? "rent" : "sale";
        const bhk = type === "plot" ? 0 : randInt(1, 4);
        const area = type === "plot" ? randInt(800, 3000) : randInt(450, 2400);
        const basePrice =
          type === "plot"
            ? area * randInt(3500, 9000)
            : listingType === "rent"
            ? randInt(12, 95) * 1000
            : area * randInt(6500, 18000);

        properties.push({
          title: titleFor(bhk, type, locality),
          description: `A well-maintained ${type.replace("-", " ")} located in the heart of ${locality}, ${city}. Close to schools, hospitals, and major transit routes. Ideal for families and working professionals looking for a comfortable and connected home.`,
          listingType,
          propertyType: type,
          price: basePrice,
          priceUnit: listingType === "rent" ? "per-month" : "total",
          area,
          bedrooms: bhk,
          bathrooms: bhk > 0 ? Math.max(1, bhk - 1) : 0,
          furnishing: rand(["unfurnished", "semi-furnished", "furnished"]),
          floor: bhk > 0 ? `${randInt(1, 20)} of ${randInt(20, 35)}` : "",
          ageOfProperty: rand(["Under Construction", "0-1 Years", "1-5 Years", "5-10 Years", "10+ Years"]),
          facing: rand(["North", "South", "East", "West", "North-East"]),
          amenities: sample(amenitiesPool, randInt(4, 8)),
          images: sample(images, 4),
          address: { locality, city, state: rand(["Maharashtra", "Karnataka", "Telangana", "Delhi"]), pincode: `${randInt(400001, 500099)}` },
          location: { lat: 19 + Math.random() * 4, lng: 72 + Math.random() * 5 },
          owner: rand(ownerIds),
          ownerType: rand(["owner", "agent", "builder"]),
          isVerified: Math.random() > 0.4,
          isFeatured: Math.random() > 0.8,
          views: randInt(10, 900),
        });
      }
    });
  });
  return properties;
};
