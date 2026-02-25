// prisma/seed.ts
import { prisma } from "../src/config/db";

/**
 * MVP seed:
 * - Plans: FREE / PRO / ENTERPRISE
 * - Features per plan
 * - Limits per plan (API_CALLS)
 *
 * Idempotent:
 * - Uses upsert for plans
 * - Uses createMany + skipDuplicates for features/limits
 */
async function main() {
  // 1) Define your product catalog here
  const catalog = [
    {
      code: "FREE",
      name: "Free",
      features: ["BASIC_DASHBOARD"],
      limits: [{ metricKey: "API_CALLS", limitValue: 1000 }],
    },
    {
      code: "PRO",
      name: "Pro",
      features: ["BASIC_DASHBOARD", "API_ACCESS", "EXPORT_PDF"],
      limits: [{ metricKey: "API_CALLS", limitValue: 20000 }],
    },
    {
      code: "ENTERPRISE",
      name: "Enterprise",
      features: ["BASIC_DASHBOARD", "API_ACCESS", "EXPORT_PDF"], // add more later
      limits: [{ metricKey: "API_CALLS", limitValue: -1 }], // -1 = unlimited
    },
  ] as const;

  // 2) Upsert plans
  const plans = await Promise.all(
    catalog.map((p) =>
      prisma.plan.upsert({
        where: { code: p.code },
        update: { name: p.name },
        create: { code: p.code, name: p.name },
      })
    )
  );

  // 3) Seed features + limits for each plan (idempotent via skipDuplicates)
  for (const plan of plans) {
    const spec = catalog.find((c) => c.code === plan.code);
    if (!spec) continue;

    // Features
    await prisma.planFeature.createMany({
      data: spec.features.map((featureKey) => ({
        planId: plan.id,
        featureKey,
      })),
      skipDuplicates: true, // relies on @@unique([planId, featureKey])
    });

    // Limits
    await prisma.planLimit.createMany({
      data: spec.limits.map((l) => ({
        planId: plan.id,
        metricKey: l.metricKey,
        limitValue: l.limitValue,
      })),
      skipDuplicates: true, // relies on @@unique([planId, metricKey])
    });
  }

  // 4) Print seeded data (useful for sanity check)
  const seeded = await prisma.plan.findMany({
    include: {
      features: true,
      limits: true,
    },
    orderBy: { code: "asc" },
  });

  console.log("✅ Seed completed. Plans:");
  for (const p of seeded) {
    console.log(`- ${p.code} (${p.name})`);
    console.log(`  Features: ${p.features.map((f) => f.featureKey).join(", ") || "-"}`);
    console.log(
      `  Limits: ${
        p.limits.map((l) => `${l.metricKey}=${l.limitValue === -1 ? "UNLIMITED" : l.limitValue}`).join(", ") ||
        "-"
      }`
    );
  }
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });