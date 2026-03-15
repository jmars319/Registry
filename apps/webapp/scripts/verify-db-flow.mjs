import path from "node:path";
import { loadEnvFile } from "node:process";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

loadEnvFile(path.resolve("../../.env"));

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL must be configured before running the DB smoke flow.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: databaseUrl
  })
});

const defaultOrganizationSlug = "registry-ops";
const suffix = `${Date.now()}`;
const startDate = new Date("2026-03-14T00:00:00.000Z");

let customerId;
let assetId;

try {
  const organization = await prisma.organization.findUnique({
    where: {
      slug: defaultOrganizationSlug
    }
  });

  if (!organization) {
    throw new Error("Default organization is missing. Run the seed command before verifying the DB flow.");
  }

  const customer = await prisma.customer.create({
    data: {
      organizationId: organization.id,
      name: `Verify Customer ${suffix}`,
      email: `verify-${suffix}@registry.test`,
      status: "ACTIVE"
    }
  });

  customerId = customer.id;

  const asset = await prisma.asset.create({
    data: {
      organizationId: organization.id,
      assetCode: `VERIFY-${suffix}`,
      name: `Verification Asset ${suffix}`,
      category: "UNIT",
      status: "AVAILABLE"
    }
  });

  assetId = asset.id;

  await prisma.assignment.create({
    data: {
      organizationId: organization.id,
      customerId: customer.id,
      assetId: asset.id,
      startDate,
      billingCadence: "MONTHLY",
      rateInCents: 250000,
      status: "ACTIVE"
    }
  });

  const activeAssignments = await prisma.assignment.findMany({
    where: {
      organizationId: organization.id,
      assetId: asset.id,
      status: "ACTIVE"
    }
  });

  if (activeAssignments.length !== 1) {
    throw new Error("Expected exactly one active assignment after the first create.");
  }

  let duplicateBlocked = false;

  try {
    await prisma.assignment.create({
      data: {
        organizationId: organization.id,
        customerId: customer.id,
        assetId: asset.id,
        startDate,
        billingCadence: "MONTHLY",
        rateInCents: 275000,
        status: "ACTIVE"
      }
    });
  } catch {
    duplicateBlocked = true;
  }

  if (!duplicateBlocked) {
    throw new Error("The database allowed a second active assignment on the same asset.");
  }

  console.log("Registry DB smoke flow passed.");
} finally {
  if (assetId) {
    await prisma.assignment.deleteMany({
      where: {
        assetId
      }
    });
  }

  if (assetId) {
    await prisma.asset.delete({
      where: {
        id: assetId
      }
    });
  }

  if (customerId) {
    await prisma.customer.delete({
      where: {
        id: customerId
      }
    });
  }

  await prisma.$disconnect();
}
