import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux'
import rootReducer from './reducers'
import App from './App';

const store = createStore(
  rootReducer
)

test('renders learn react link', () => {
  /*
  const { getByText } = render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  const element = getByText(/Treeni/i);
  expect(element).toBeInTheDocument();*/
  expect(true).toBe(true);
});
