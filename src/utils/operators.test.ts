import { Axios } from 'axios-observable';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { TestScheduler } from 'rxjs/testing';

import { filterNotNullOrUndefined, fromAxios } from './operators';

const mockAxios = Axios.create({
  adapter: (config) =>
    new Promise((resolve) =>
      resolve({
        data: `${config.url} response`,
        status: StatusCodes.OK,
        statusText: 'OK',
        config,
        headers: {},
      }),
    ),
});

describe('fromAxios', () => {
  it('test axios mock', (done) => {
    fromAxios(mockAxios, { url: 'api' }).subscribe((response) => {
      expect(response.data).to.equal('api response');
      done();
    });
  });
});

const testScheduler = new TestScheduler((actual, expected) => {
  expect(actual).deep.equal(expected);
});

describe('filterNotNullOrOndefined', () => {
  it('should not emit if null or undefined', () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;
      const e1 = cold(' -a-b-c-d-|', {
        a: 1,
        b: null,
        c: 'string',
        d: undefined,
      });
      const expected = '-a---c---|';
      expectObservable(e1.pipe(filterNotNullOrUndefined())).toBe(expected, {
        a: 1,
        c: 'string',
      });
    });
  });
});
