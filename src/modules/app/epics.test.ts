import { expect } from 'chai';
import type { Epic, StateObservable } from 'redux-observable';
import { TestScheduler } from 'rxjs/testing';

import {
  authAuthorizeUserProposal,
  authGetCsrfTokenRequest,
} from '../auth/actions';

import { appInit, appInitSuccess } from './actions';
import { appInitEpic } from './epics';

const testScheduler = new TestScheduler((actual, expected) => {
  expect(actual).deep.equal(expected);
});

describe('app epics', () => {
  it('appInitEpic', () => {
    testScheduler.run((helpers) => {
      const { hot, expectObservable } = helpers;
      const action$ = hot('--a', { a: appInit() });
      const expected = '--(abc)';
      const output$ = (appInitEpic as Epic)(
        action$,
        {} as StateObservable<unknown>,
        null,
      );

      expectObservable(output$).toBe(expected, {
        a: authGetCsrfTokenRequest(),
        b: authAuthorizeUserProposal(),
        c: appInitSuccess(),
      });
    });
  });
});
