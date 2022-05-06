import isDate from 'date-fns/isDate';
import parseISO from 'date-fns/parseISO';

export const toOrderedList = <T>(ids: number[], map: Record<number, T>): T[] =>
  ids.map((id) => map[id]);

const typedIsDate = (value: unknown): value is Date => isDate(value);

export const toDate = (dateLike: Date | null | string): Date => {
  if (typedIsDate(dateLike)) {
    return dateLike;
  }
  if (dateLike === null) {
    return new Date(0);
  }
  return parseISO(dateLike);
};
