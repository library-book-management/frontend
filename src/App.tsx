import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import NavigationBar from './components/NavigationBar';
import routes from './routes/routes';

function App() {
  return (
    <Router>
      {/* Sidebar */}
      <NavigationBar className="fixed w-[256px] h-screen border border-t-0 border-b-0 border-r bg-white" />

      {/* Main content */}
      <div className="ml-[256px] p-5">
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.component} />
          ))}
        </Routes>
      </div>

      {/* Toast container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </Router>
  );
}

export default App;
