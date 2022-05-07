import { expect } from 'chai';

import { toDate, toOrderedList } from './transformators';

describe('toDate', () => {
  it('parse ISO date string', () => {
    const dateString = '2021-05-02T11:30:00.000Z';
    const date = toDate(dateString);
    expect(date).to.be.instanceOf(Date);
    expect(date.toISOString()).to.equal(dateString);
  });

  it('return date if supplied', () => {
    const date = new Date('2021-05-02T11:30:00.000Z');
    const parsedDate = toDate(date);
    expect(parsedDate).to.equal(date);
  });

  it('return start of unix epoch if null is supplied', () => {
    const dateValue = null;
    const parsedDate = toDate(dateValue);
    expect(parsedDate).to.be.instanceOf(Date);
    expect(parsedDate.toISOString()).to.equal('1970-01-01T00:00:00.000Z');
  });
});

describe('toOrderedList', () => {
  const map = { 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five' };
  it('should only return items in id list', () => {
    const ids = [1, 3, 5];
    const orderedList = toOrderedList(ids, map);
    expect(orderedList).to.deep.equal(['one', 'three', 'five']);
  });
  it('should return items in correct order', () => {
    const ids = [4, 2, 1, 5];
    const orderedList = toOrderedList(ids, map);
    expect(orderedList).to.deep.equal(['four', 'two', 'one', 'five']);
  });
});
