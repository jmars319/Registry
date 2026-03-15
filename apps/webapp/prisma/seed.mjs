import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL must be set before running the seed script.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: databaseUrl
  })
});
const defaultOrganizationName = "Registry Operations";
const defaultOrganizationSlug = "registry-ops";

function dateOnly(value) {
  return new Date(`${value}T00:00:00.000Z`);
}

async function main() {
  const organization = await prisma.organization.upsert({
    where: {
      slug: defaultOrganizationSlug
    },
    update: {
      name: defaultOrganizationName,
      status: "ACTIVE"
    },
    create: {
      name: defaultOrganizationName,
      slug: defaultOrganizationSlug,
      status: "ACTIVE"
    }
  });

  const sampleCustomer = await prisma.customer.upsert({
    where: {
      id: `seed-customer-${organization.id}`
    },
    update: {
      name: "Harbor Logistics",
      companyName: "Harbor Logistics LLC",
      email: "ops@harbor-logistics.test",
      phone: "555-0100",
      billingStreet1: "101 Port Avenue",
      billingCity: "Savannah",
      billingState: "GA",
      billingPostalCode: "31401",
      billingCountry: "US",
      notes: "Seed customer for local development.",
      status: "ACTIVE"
    },
    create: {
      id: `seed-customer-${organization.id}`,
      organizationId: organization.id,
      name: "Harbor Logistics",
      companyName: "Harbor Logistics LLC",
      email: "ops@harbor-logistics.test",
      phone: "555-0100",
      billingStreet1: "101 Port Avenue",
      billingCity: "Savannah",
      billingState: "GA",
      billingPostalCode: "31401",
      billingCountry: "US",
      notes: "Seed customer for local development.",
      status: "ACTIVE"
    }
  });

  const activeAsset = await prisma.asset.upsert({
    where: {
      organizationId_assetCode: {
        organizationId: organization.id,
        assetCode: "CTR-1001"
      }
    },
    update: {
      name: "Container 1001",
      category: "UNIT",
      status: "ASSIGNED",
      currentLocation: "Yard A",
      notes: "Seed asset with an active assignment."
    },
    create: {
      organizationId: organization.id,
      assetCode: "CTR-1001",
      name: "Container 1001",
      category: "UNIT",
      status: "ASSIGNED",
      currentLocation: "Yard A",
      notes: "Seed asset with an active assignment."
    }
  });

  await prisma.asset.upsert({
    where: {
      organizationId_assetCode: {
        organizationId: organization.id,
        assetCode: "TRL-2001"
      }
    },
    update: {
      name: "Trailer 2001",
      category: "VEHICLE",
      status: "AVAILABLE",
      currentLocation: "Lot 3",
      notes: "Seed asset kept available for assignment testing."
    },
    create: {
      organizationId: organization.id,
      assetCode: "TRL-2001",
      name: "Trailer 2001",
      category: "VEHICLE",
      status: "AVAILABLE",
      currentLocation: "Lot 3",
      notes: "Seed asset kept available for assignment testing."
    }
  });

  await prisma.assignment.upsert({
    where: {
      id: `seed-assignment-${organization.id}`
    },
    update: {
      organizationId: organization.id,
      customerId: sampleCustomer.id,
      assetId: activeAsset.id,
      startDate: dateOnly("2026-03-01"),
      endDate: null,
      billingCadence: "MONTHLY",
      rateInCents: 185000,
      status: "ACTIVE",
      notes: "Seed active assignment for the default organization."
    },
    create: {
      id: `seed-assignment-${organization.id}`,
      organizationId: organization.id,
      customerId: sampleCustomer.id,
      assetId: activeAsset.id,
      startDate: dateOnly("2026-03-01"),
      endDate: null,
      billingCadence: "MONTHLY",
      rateInCents: 185000,
      status: "ACTIVE",
      notes: "Seed active assignment for the default organization."
    }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
