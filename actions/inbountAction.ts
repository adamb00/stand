'use server';
import { InboundSchema } from '@/schemas/inboundSchema';
import { z } from 'zod';
import { db } from '@/lib/db';
import { Unit, Prisma, TransactionType } from '@prisma/client'; //← itt importáljuk a Prisma-t
import { auth } from '@/auth';
import { getBudapestNow } from '@/utils/format-time';

export const inboundAction = async (values: z.infer<typeof InboundSchema>) => {
  // const current_time = getBudapestNow();
  const current_time = new Date('2025-06-18 16:12:14');

  try {
    // 1) Validáljuk a beérkező adatokat a Zod sémával
    const validatedFields = await InboundSchema.safeParseAsync(values);
    if (!validatedFields.success) {
      return { error: 'Hibás adatok. Kérjük próbáld meg újból!' };
    }
    const { products } = validatedFields.data;

    // 2) Ellenőrizzük a session-t és a restaurantId-t
    const session = await auth();
    const restaurantId = session?.user.restaurant?.id;
    if (!restaurantId) {
      return { error: 'Nincs bejelentkezve!' };
    }

    //    (ha a bevételezés dátuma hónapja eltérhet a jelenlegi dátumtól, akkor invoiceDate alapján is kiszámolhatod year/month-ot)
    const invoiceDt = new Date();
    const invoiceYear = invoiceDt.getFullYear();
    const invoiceMonth = invoiceDt.getMonth() + 1; // 1–12
    let inventoryPeriod = await db.inventoryPeriod.findFirst({
      where: {
        restaurantId,
        year: 2025,
        month: 6,
      },
    });
    if (!inventoryPeriod) {
      inventoryPeriod = await db.inventoryPeriod.create({
        data: {
          restaurantId,
          year: 2025,
          month: 6,
          createdAt: current_time,
        },
      });
    }

    // 3) Végigiterálunk a bejövő termékeken
    for (const item of products) {
      // 3.1) Megpróbáljuk lekérdezni, létezik-e már ez a termék név alapján
      let prod = await db.product.findFirst({
        where: { name: item.name },
      });

      if (prod) {
        // Ha létezik, frissítjük csak az egység‐mezőt és updatedAt-et
        prod = await db.product.update({
          where: { id: prod.id },
          data: {
            unit: item.unit as Unit,
            updatedAt: current_time,
          },
        });
      } else {
        // Ha nem létezik, létrehozzuk
        prod = await db.product.create({
          data: {
            name: item.name,
            unit: item.unit as Unit,
            createdAt: current_time,
            updatedAt: current_time,
          },
        });
      }

      // 3.2) Új nettó és bruttó árat számolunk
      const newNet = new Prisma.Decimal(item.netUnitPrice as number);
      const newGross = newNet.mul(new Prisma.Decimal(1.27));

      // 3.3) Lekérdezzük a legutolsó PriceHistory bejegyzést erre a termékre
      const latestPH = await db.priceHistory.findFirst({
        where: { productId: prod.id },
        orderBy: { validFrom: 'desc' },
      });

      // 3.4) Ha nincs korábbi bejegyzés → létrehozunk egy új PriceHistory-t
      if (!latestPH) {
        await db.priceHistory.create({
          data: {
            productId: prod.id,
            netUnitPrice: newNet,
            unitPrice: newGross,
            hasPriceDifference: false,
            validFrom: current_time, // vagy használhatod item.invoiceDate-et is
          },
        });
      } else {
        // 3.5) Ha van korábbi bejegyzés, csak akkor készítünk újat, ha eltér az ár
        const sameNet = latestPH.netUnitPrice.equals(newNet);
        const sameGross = latestPH.unitPrice.equals(newGross);

        if (!sameNet || !sameGross) {
          const createdPH = await db.priceHistory.update({
            where: { id: latestPH.id },
            data: {
              productId: prod.id,
              netUnitPrice: newNet,
              unitPrice: newGross,
              hasPriceDifference: !sameNet || !sameGross,
              priceDifference: newNet.sub(latestPH.netUnitPrice),
              validFrom: current_time,
              createdAt: latestPH.createdAt,
            },
          });
          console.log('PriceHistory frissítve új bejegyzéssel:', createdPH);
        } else {
          console.log('PriceHistory nem változott, nem hozunk létre újat.');
        }
      }

      let invLine = await db.inventoryLine.findFirst({
        where: {
          periodId: inventoryPeriod.id,
          productId: prod.id,
        },
      });

      if (!invLine) {
        // Ha még nincs sor, akkor „nyitó” mennyiségnek beállítjuk az előző periódus záróját, ha van.
        // Egyszerűsítve: ha nincs előző periódus, nyitó = 0.
        const prevPeriod = await db.inventoryPeriod.findFirst({
          where: {
            restaurantId,
            year: invoiceYear,
            month: invoiceMonth - 1 >= 1 ? invoiceMonth - 1 : undefined,
          },
        });
        let openingQty = new Prisma.Decimal(0);
        if (prevPeriod) {
          // Megkeressük a termék záró mennyiségét az előző hónapból
          const prevLine = await db.inventoryLine.findFirst({
            where: {
              periodId: prevPeriod.id,
              productId: prod.id,
            },
          });
          if (prevLine && prevLine.closingQuantity) {
            openingQty = prevLine.closingQuantity;
          }
        }

        invLine = await db.inventoryLine.create({
          data: {
            periodId: inventoryPeriod.id,
            productId: prod.id,
            openingQuantity: openingQty,
            closingQuantity: null,
            sellingUnitPrice: null,
            createdAt: current_time,
          },
        });
      }

      // 4.4) Létrehozunk egy új InventoryTransaction-t az INBOUND számára
      //      – a mennyiség és a várt vs. számlán lévő nettó ár mezőkkel
      await db.inventoryTransaction.create({
        data: {
          lineId: invLine.id,
          restaurantId: restaurantId,
          type: TransactionType.INBOUND,
          quantity: new Prisma.Decimal(item.quantity as number),
          date: invoiceDt,
          userId: session.user.id,
          reason: 'Bevétel',
          createdAt: current_time,
        },
      });
    }

    return { success: 'Sikeres mentés!', products };
  } catch (error) {
    console.error('inboundAction hiba:', error);
    return { error: 'Valami hiba történt! Kérjük próbáld meg újra!' };
  }
};
