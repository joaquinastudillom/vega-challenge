import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import { Home } from '@/pages/home';
import { Login } from '@/pages/login';

import './App.css';
import { isAuthenticated } from './services';

function App() {
    const isUserLoggedIn = isAuthenticated();

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={isUserLoggedIn ? <Home /> : <Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
