import './App.css';

import PublicRoutes from './routes_public';
import Typography from '@mui/material/Typography';
import CheckoutProvider from './context-global/checkout.provider';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <CheckoutProvider>
          <PublicRoutes />
          <Copyright sx={{ mt: 5 }} />
        </CheckoutProvider>
      </header>
    </div>
  );
}

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      {new Date().getFullYear()}
      {'. versão 2.0.22'}
    </Typography>
  );
}

export default App;
