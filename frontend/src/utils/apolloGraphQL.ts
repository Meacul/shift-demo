import Constants from 'expo-constants';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const apiUrl = Constants.expoConfig?.extra?.apiUrl;
console.log('API URL:', apiUrl);

export const client = new ApolloClient({
    link: new HttpLink({ uri: 'http://localhost:10000/graphql' }),
    cache: new InMemoryCache(),
});
