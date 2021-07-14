// Global CSS cannot be used in files other than your 'Custom <App>' component due to its side-effects and ordering problems.
// Importing a CSS file from node_modules
import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/buildClient';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  );
};

// The first argument to custom App component 'getInitialProps' is 'appContext' but the 'req' object is nested inside of it on the 'ctx' property. appContext === { AppTree, Component, router, ctx: { req, res } }
// NB: When we tied 'getInitialProps' to App component, the getInitialProps' tied to an individual page do not get automatically invoked anymore. We need to do it manually here
AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/current-user');

  // Manually call the 'getInitialProps' method of the page component we are currently trying to render if defined
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  return { pageProps, ...data };
};

export default AppComponent;
