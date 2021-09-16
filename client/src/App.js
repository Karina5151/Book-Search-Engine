import React from 'react';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

// Middleware to attach JWT token to each request through authorizing the header
const authLink = setContext((_, { headers }) => {
  // get auth token from local storage (if there is one)
  const token = localStorage.getItem('id_token')
// return the headers to the context for httpLink to read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// GraphQL API endpoint
const httpLink = createHttpLink({
  uri: '/graphql'
})

// set up client to run the authLink middleware before the GraphQL API request
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})

export default function App() {
  return (
    <ApolloProvider client={client}>
    <Router>
      <>
        <Navbar />
        <Switch>
          <Route exact path='/' component={SearchBooks} />
          <Route exact path='/saved' component={SavedBooks} />
          <Route render={() => <h1 className='display-2'>Wrong page, sorry!</h1>} />
        </Switch>
        </>
    </Router>
    </ApolloProvider>
  )
}
