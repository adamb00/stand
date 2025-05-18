// utils/getBudapestNow.ts

/**
 * Visszaad egy JavaScript Date objektumot, ami pontosan a
 * Budapest (Europe/Budapest) helyi időpont pillanatát reprezentálja.
 */
export function getBudapestNow(): Date {
  // 1) Formázó, ami a 'Europe/Budapest' időzónában adja vissza a részeket
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Budapest',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  });

  // 2) Kinyerjük a formázott részeket
  const parts = formatter.formatToParts(new Date());
  // Például: [ { type: "year", value: "2025" }, { type: "literal", value: "-" }, { type: "month", value: "05" }, ... ]

  // 3) Segédfüggvény a megfelelő rész kiszedésére
  const getPart = (type: any) => {
    const p = parts.find((p) => p.type === type);
    return p ? Number(p.value) : NaN;
  };

  const year = getPart('year'); // pl. 2025
  const month = getPart('month'); // 1–12
  const day = getPart('day'); // 1–31
  const hour = getPart('hour'); // 0–23
  const minute = getPart('minute'); // 0–59
  const second = getPart('second'); // 0–59

  // 4) A „Budapest helyi” év/hónap/nap/óra/perc/másodperc értékeket
  //    UTC-ben ugyanennek a pillanatnak a milliszekundumát kapjuk meg a Date.UTC-vel.
  return new Date(Date.UTC(year, month - 1, day, hour, minute, second));
}
