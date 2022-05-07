/* eslint-disable @typescript-eslint/no-explicit-any */

import { expect } from 'chai';
import { beforeEach } from 'mocha';
import { Epic, StateObservable } from 'redux-observable';
import { TestScheduler } from 'rxjs/testing';

import {
  authIsDialogRegisterChangeRequest,
  authLoginDialogVisibleChangeRequest,
  authOpenLoginProposal,
  authSwitchToLoginProposal,
  authSwitchToRegisterProposal,
} from './actions';
import {
  openLoginEpic,
  switchToLoginEpic,
  switchToRegisterEpic,
} from './epics';

const testScheduler = new TestScheduler((actual, expected) => {
  expect(actual).deep.equal(expected);
});

beforeEach(() => {
  testScheduler.frame = 0;
});

describe('auth epics', () => {
  describe('open login epic', () => {
    it('is not a mobile device', () => {
      testScheduler.run((helpers) => {
        const { hot, expectObservable } = helpers;
        const action$ = hot('--a', { a: authOpenLoginProposal() });
        const state$ = hot('-a', {
          a: { browser: { lessThan: { medium: false } } },
        });
        const dependencies = { history: [] };

        const output$ = (openLoginEpic as Epic)(
          action$,
          state$ as unknown as StateObservable<any>,
          dependencies,
        );

        const expected = '--a';

        expectObservable(output$).toBe(expected, {
          a: authLoginDialogVisibleChangeRequest(true),
        });
      });
    });

    it('is a mobile device', () => {
      testScheduler.run((helpers) => {
        const { hot, expectObservable } = helpers;
        const action$ = hot('--a', { a: authOpenLoginProposal() });
        const state$ = hot('-a', {
          a: { browser: { lessThan: { medium: true } } },
        });
        const dependencies = { history: [] };

        const output$ = (openLoginEpic as Epic)(
          action$,
          state$ as unknown as StateObservable<any>,
          dependencies,
        );

        const expected = '---';

        expectObservable(output$).toBe(expected);
      });
    });
  });

  describe('switch to login epic', () => {
    it('auth dialog is open', () => {
      testScheduler.run((helpers) => {
        const { hot, expectObservable } = helpers;
        const action$ = hot('--a', { a: authSwitchToLoginProposal() });
        const state$ = hot('-a', {
          a: { auth: { isAuthDialogOpen: true } },
        });
        const dependencies = { history: [] };

        const output$ = (switchToLoginEpic as Epic)(
          action$,
          state$ as unknown as StateObservable<any>,
          dependencies,
        );

        const expected = '--a';

        expectObservable(output$).toBe(expected, {
          a: authIsDialogRegisterChangeRequest(false),
        });
      });
    });

    it('auth dialog is not open', () => {
      testScheduler.run((helpers) => {
        const { hot, expectObservable } = helpers;
        const action$ = hot('--a', { a: authSwitchToLoginProposal() });
        const state$ = hot('-a', {
          a: { auth: { isAuthDialogOpen: false } },
        });
        const dependencies = { history: [] };

        const output$ = (switchToLoginEpic as Epic)(
          action$,
          state$ as unknown as StateObservable<any>,
          dependencies,
        );

        const expected = '---';

        expectObservable(output$).toBe(expected);
      });
    });
  });

  describe('switch to register epic', () => {
    it('auth dialog is open', () => {
      testScheduler.run((helpers) => {
        const { hot, expectObservable } = helpers;
        const action$ = hot('--a', { a: authSwitchToRegisterProposal() });
        const state$ = hot('-a', {
          a: { auth: { isAuthDialogOpen: true } },
        });
        const dependencies = { history: [] };

        const output$ = (switchToRegisterEpic as Epic)(
          action$,
          state$ as unknown as StateObservable<any>,
          dependencies,
        );

        const expected = '--a';

        expectObservable(output$).toBe(expected, {
          a: authIsDialogRegisterChangeRequest(true),
        });
      });
    });
    it('auth dialog is not open', () => {
      testScheduler.run((helpers) => {
        const { hot, expectObservable } = helpers;
        const action$ = hot('--a', { a: authSwitchToRegisterProposal() });
        const state$ = hot('-a', {
          a: { auth: { isAuthDialogOpen: false } },
        });
        const dependencies = { history: [] };

        const output$ = (switchToRegisterEpic as Epic)(
          action$,
          state$ as unknown as StateObservable<any>,
          dependencies,
        );

        const expected = '---';

        expectObservable(output$).toBe(expected);
      });
    });
  });
});
