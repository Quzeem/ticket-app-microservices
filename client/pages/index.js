// import axios from 'axios';
import buildClient from '../api/buildClient';

// currentUser is gotten from the data(an object) returned from its getInitialProps method
const Index = ({ currentUser }) => {
  return <h1>{currentUser ? 'You are signed in' : 'You are NOT signed in'}</h1>;
};

// // A) Setting things up explicitly
// // getInitialProps method is always executed during the server-side rendering process. It's useful for fetching some data specifically for doing some initial rendering of our app
// Index.getInitialProps = async ({ req }) => {
//   if (typeof window === undefined) {
//     // getInitialProps is executing on the server(most of the time)
//     // requests should be made with a specific base url
//     const { data } = await axios.get(
//       'http://ingress-nginx.ingress-nginx.svc.cluster.local/api/users/current-user',
//       {
//         headers: req.headers, // contains the host, cookie, and so on...
//       }
//     );

//     return data;
//   } else {
//     // getInitialProps is executing in the browser(only when we navigate from one page to another while in the app)
//     // requests can be made with a base url of ''. The browser will automatically use the current domain as the base url
//     const { data } = await axios.get('/api/users/current-user');

//     return data;
//   }
// };

// B) Using buildClient(reusable across all pages)
// The first argument to page component 'getInitialProps' is 'context' === { req, res }
Index.getInitialProps = async (context) => {
  const client = buildClient(context);
  const { data } = await client.get('/api/users/current-user');

  return data;
};

export default Index;
