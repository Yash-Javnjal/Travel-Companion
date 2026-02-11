import { useState } from 'react';
import { AuthProvider } from './AuthContext';
import Login from './Login';
import Register from './Register';

function App() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuth = () => {
    setIsLogin((prev) => !prev);
  };

  return (
    <AuthProvider>
      <div className="auth-page">
        <div className={`auth-container ${isLogin ? 'show-login' : 'show-register'}`}>
          {isLogin ? (
            <Login onToggle={toggleAuth} />
          ) : (
            <Register onToggle={toggleAuth} />
          )}
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;