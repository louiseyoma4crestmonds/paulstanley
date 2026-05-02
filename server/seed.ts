import { db } from "./db";
import { causes, events, products, promoCodes } from "@shared/schema";

async function seed() {
  console.log("Seeding database...");

  const causesData = [
    {
      title: "Education for All",
      description: "Help provide quality education and learning resources to underprivileged children in communities around the world.",
      goal: "50000",
      raised: "32500",
      image: "/attached_assets/generated_images/Education_charity_cause_7be64c6a.png",
    },
    {
      title: "Environmental Action",
      description: "Support our initiatives to plant trees, clean communities, and create a sustainable future for the next generation.",
      goal: "75000",
      raised: "48200",
      image: "/attached_assets/generated_images/Environmental_cause_bca34897.png",
    },
    {
      title: "Healthcare Access",
      description: "Ensure everyone has access to quality healthcare services regardless of their economic background.",
      goal: "100000",
      raised: "67800",
      image: "/attached_assets/generated_images/Healthcare_charity_cause_45f99c5d.png",
    },
  ];

  const eventsData = [
    {
      title: "Live Concert Experience",
      date: new Date("2025-12-15T20:00:00"),
      location: "Madison Square Garden, New York",
      image: "/attached_assets/generated_images/Concert_venue_event_0f0136d1.png",
    },
    {
      title: "Annual Charity Gala",
      date: new Date("2025-11-20T19:00:00"),
      location: "Beverly Hills Hotel, Los Angeles",
      image: "/attached_assets/generated_images/Charity_gala_event_f8642558.png",
    },
  ];

  const productsData = [
    {
      name: "Signature T-Shirt",
      description: "Premium quality cotton t-shirt with exclusive design",
      price: "45",
      image: "/attached_assets/generated_images/Celebrity_merchandise_tshirt_f2cb91ad.png",
      stock: 15,
    },
    {
      name: "Branded Cap",
      description: "Stylish cap with embroidered logo",
      price: "35",
      image: "/attached_assets/generated_images/Celebrity_branded_cap_a0236519.png",
      stock: 20,
    },
    {
      name: "Premium Hoodie",
      description: "Comfortable hoodie with artistic graphic design",
      price: "75",
      image: "/attached_assets/generated_images/Celebrity_hoodie_merchandise_584ce705.png",
      stock: 10,
    },
  ];

  const promoCodesData = [
    {
      code: "WELCOME2025",
      type: "welcome",
    },
    {
      code: "FANCLUB100",
      type: "fanclub",
    },
  ];

  for (const cause of causesData) {
    await db.insert(causes).values(cause).onConflictDoNothing();
  }
  console.log(`Seeded ${causesData.length} causes`);

  for (const event of eventsData) {
    await db.insert(events).values(event).onConflictDoNothing();
  }
  console.log(`Seeded ${eventsData.length} events`);

  for (const product of productsData) {
    await db.insert(products).values(product).onConflictDoNothing();
  }
  console.log(`Seeded ${productsData.length} products`);

  for (const promoCode of promoCodesData) {
    await db.insert(promoCodes).values(promoCode).onConflictDoNothing();
  }
  console.log(`Seeded ${promoCodesData.length} promo codes`);

  console.log("Seeding complete!");
}

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
