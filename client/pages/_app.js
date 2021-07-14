// Global CSS cannot be used in files other than your 'Custom <App>' component due to its side-effects and ordering problems. Thus, reason for this file (_app.js).

// Importing a CSS file from node_modules
import 'bootstrap/dist/css/bootstrap.css';

export default ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};
