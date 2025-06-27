import AppRouter from './routes/AppRouter';
import Header from './components/Header';
import './styles/App.css';

function App() {
  return (
      <div className="app-layout">
          <Header />
          <main className="main-content">
              <AppRouter />
          </main>
      </div>

  );
}

export default App;
