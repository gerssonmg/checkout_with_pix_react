import './App.css';

import PublicRoutes from './routes_public';
import Typography from '@mui/material/Typography';

function App() {
  return (
    <div class="App">
      <header class="App-header">
        <PublicRoutes />
        <Copyright sx={{ mt: 5 }} />
      </header>
    </div>
  );
}

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default App;
