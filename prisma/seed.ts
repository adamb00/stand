// prisma/seed.ts
const { Role, Unit } = require('@prisma/client');
const { PrismaClient, Prisma } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const saltRounds = 10;

  // 1. Create Restaurants
  const restaurants = await Promise.all([
    prisma.restaurant.create({
      data: { name: 'Bandula Kisvendéglő', location: 'Hódmezővásárhely' },
    }),
    prisma.restaurant.create({
      data: { name: 'Bagolyvár Music Pub', location: 'Hódmezővásárhely' },
    }),
    prisma.restaurant.create({
      data: { name: 'Kökénydombi Csárda', location: 'Hódmezővásárhely' },
    }),
    prisma.restaurant.create({
      data: { name: 'Fekete Sas Kávéház', location: 'Hódmezővásárhely' },
    }),
    prisma.restaurant.create({
      data: { name: 'Fekete Sas Söröző', location: 'Hódmezővásárhely' },
    }),
  ]);

  // 2. Create Users (one per restaurant) with hashed passwords
  const users = await Promise.all(
    restaurants.map(async (resto, i) => {
      const hashedPassword = await bcrypt.hash('Test1234', saltRounds);
      return prisma.user.create({
        data: {
          name: `User${i + 1}`,
          email: `user${i + 1}@example.com`,
          password: hashedPassword,
          role: Role.USER,
          restaurantId: resto.id,
        },
      });
    })
  );

  // // 3. Create Products
  // const products = await Promise.all([
  //   prisma.product.create({ data: { name: 'Acqua Panna', unit: Unit.ÜVEG } }),
  //   prisma.product.create({ data: { name: 'Bükki 1.5', unit: Unit.ÜVEG } }),
  //   prisma.product.create({
  //     data: { name: 'Natur Aqua 0.33', unit: Unit.ÜVEG },
  //   }),
  //   prisma.product.create({
  //     data: { name: 'Natur Aqua 0.75', unit: Unit.ÜVEG },
  //   }),
  // ]);

  // // 4. Seed PriceHistory for May 2024
  // const validFrom = new Date('2024-05-01T00:00:00.000Z');
  // for (const prod of products) {
  //   let netPrice;
  //   switch (prod.name) {
  //     case 'Acqua Panna':
  //       netPrice = new Prisma.Decimal(1016);
  //       break;
  //     case 'Bükki 1.5':
  //       netPrice = new Prisma.Decimal(622);
  //       break;
  //     case 'Natur Aqua 0.33':
  //       netPrice = new Prisma.Decimal(354);
  //       break;
  //     case 'Natur Aqua 0.75':
  //       netPrice = new Prisma.Decimal(700);
  //       break;
  //     default:
  //       netPrice = new Prisma.Decimal(800);
  //   }
  //   const grossPrice = netPrice.mul(new Prisma.Decimal(1.27));
  //   await prisma.priceHistory.create({
  //     data: {
  //       productId: prod.id,
  //       netUnitPrice: netPrice,
  //       unitPrice: grossPrice,
  //       // invoiceNetUnitPrice and invoiceUnitPrice remain null (no deviation)
  //       validFrom,
  //     },
  //   });
  // }

  // // 5. Create InventoryPeriod for each restaurant for May 2024
  // const periods = await Promise.all(
  //   restaurants.map((resto) =>
  //     prisma.inventoryPeriod.create({
  //       data: {
  //         restaurantId: resto.id,
  //         year: 2024,
  //         month: 5,
  //       },
  //     })
  //   )
  // );

  // // 6. Seed InventoryLines with sellingUnitPrice and InventoryTransactions
  // for (const period of periods) {
  //   const user = users.find((u) => u.restaurantId === period.restaurantId);
  //   for (const prod of products) {
  //     // 6.1 InventoryLine (openingQuantity = 0, closingQuantity left null)
  //     const sellingPrice = (() => {
  //       switch (prod.name) {
  //         case 'Acqua Panna':
  //           return new Prisma.Decimal(1290);
  //         case 'Bükki 1.5':
  //           return new Prisma.Decimal(790);
  //         case 'Natur Aqua 0.33':
  //           return new Prisma.Decimal(450);
  //         case 'Natur Aqua 0.75':
  //           return new Prisma.Decimal(890);
  //         default:
  //           return new Prisma.Decimal(1000);
  //       }
  //     })();
  //     const line = await prisma.inventoryLine.create({
  //       data: {
  //         periodId: period.id,
  //         productId: prod.id,
  //         openingQuantity: new Prisma.Decimal(0),
  //         sellingUnitPrice: sellingPrice,
  //       },
  //     });

  //     // 6.2 InventoryTransaction - INBOUND with expectedNetUnitPrice and actualNetUnitPrice
  //     const latestPrice = await prisma.priceHistory.findFirst({
  //       where: { productId: prod.id, validFrom: { lte: validFrom } },
  //       orderBy: { validFrom: 'desc' },
  //     });
  //     const expectedNet = latestPrice?.netUnitPrice ?? new Prisma.Decimal(0);
  //     // Simulate invoice net price deviation by 10%
  //     const actualNet = expectedNet.mul(new Prisma.Decimal(1.1));

  //     await prisma.inventoryTransaction.create({
  //       data: {
  //         lineId: line.id,
  //         restaurantId: period.restaurantId,
  //         userId: user.id,
  //         type: 'INBOUND',
  //         quantity: new Prisma.Decimal(300),
  //         reason: 'Monthly delivery',
  //         expectedNetUnitPrice: expectedNet,
  //         actualNetUnitPrice: actualNet,
  //       },
  //     });

  //     // 6.3 InventoryTransaction - OUTBOUND
  //     await prisma.inventoryTransaction.create({
  //       data: {
  //         lineId: line.id,
  //         restaurantId: period.restaurantId,
  //         userId: user.id,
  //         type: 'OUTBOUND',
  //         quantity: new Prisma.Decimal(100),
  //         reason: 'Sales',
  //       },
  //     });
  //   }
  // }

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
