import { auth } from '@/auth';
import { ClientStand } from '@/components/stand-page';
import { db } from '@/lib/db';

export default async function StandPage() {
  const session = await auth();
  if (!session) return;

  const restaurantId = session.user.restaurant?.id;

  const rawPeriods = await db.inventoryPeriod.findMany({
    where: { restaurantId },
    orderBy: [{ year: 'desc' }, { month: 'desc' }],
    include: {
      lines: {
        include: {
          product: true,
          transactions: true,
        },
      },
    },
  });

  // Konvertáld minden Decimal-t number-re:
  const periods = rawPeriods.map(serializePeriod);

  return <ClientStand periods={periods} />;
}

function serializePeriod(period: any) {
  return {
    ...period,
    lines: period.lines.map((line: any) => ({
      ...line,
      openingQuantity: Number(line.openingQuantity),
      closingQuantity:
        line.closingQuantity !== null ? Number(line.closingQuantity) : null,
      sellingUnitPrice: line.sellingUnitPrice
        ? Number(line.sellingUnitPrice)
        : null,
      transactions: line.transactions.map((t: any) => ({
        ...t,
        quantity: Number(t.quantity),
      })),
    })),
  };
}
