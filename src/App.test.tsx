import * as React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import App from './App';

describe('<App>', () => {
  it('renders initial app message link', () => {
    const { getByText } = render(<App />);
    const linkElement = getByText(/This will be the MeetMeThere app\./i);
    expect(document.body.contains(linkElement));
  });
});
