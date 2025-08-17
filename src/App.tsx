import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import NavigationBar from './components/NavigationBar';
import routes from './routes/routes';
import { useAuthStore } from './stores/auth.store';
import RequireAuth from './middleware/PrivateRoute';

function App() {
  const { accessToken } = useAuthStore();

  return (
    <Router>
      {/* Sidebar */}
      {accessToken && (
        <NavigationBar className="fixed w-[256px] h-screen border border-t-0 border-b-0 border-r bg-white" />
      )}

      {/* Main content */}
      <div className={accessToken ? 'ml-[256px] p-5' : 'p-5'}>
        <Routes>
          {routes.map((route, index) => {
            // Nếu route yêu cầu đăng nhập
            if (route.private) {
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={<RequireAuth>{route.component}</RequireAuth>}
                />
              );
            }
            // Nếu route public
            return (
              <Route key={index} path={route.path} element={route.component} />
            );
          })}
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
