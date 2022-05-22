import './App.css';
import LoginComponent from './login/login.component';
import SignupComponent from './sign-up/signup.component';
import PartiesListComponent from './home/parties-list.component';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <PartiesListComponent />
        <LoginComponent />
        <SignupComponent />
      </header>
    </div>
  );
}

export default App;
