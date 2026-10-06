import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';

import Header from './components/Header.jsx';
import Home from './components/Home.jsx';
import Detail from './components/Detail.jsx';
import MemberExclusive from './components/MemberExclusive.jsx';

import { useFetchOmdbCategories } from './hooks/useFetchOmdbCategories.js';
import Search from './components/Search.jsx';
import { auth } from './services/firebase';
import {
  setSignOutState,
  setUserLoginDetails,
} from './features/user/UserSlice.jsx';

import { useDispatch } from 'react-redux';
import { lazy, Suspense, useEffect } from 'react';

// Lazy load the test component so it is split into a separate bundle
const TestPage = lazy(() => import('./pages/Test'));

// Helper to check environment (Works for Vite or CRA)
const isDev = process.env.NODE_ENV === 'development' || import.meta.env?.DEV;

function App() {
  // Executes the hook automatically on app load
  useFetchOmdbCategories();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Create Auth Listener
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // If user is signed in, set setUserLoginDetails
        dispatch(
          setUserLoginDetails({
            name: user.displayName,
            email: user.email,
            photo: user.photoURL,
          }),
        );
      } else {
        // If user not signed in, set setSignOutState
        dispatch(setSignOutState());

        // If needed, unauthenticated users can be redirected to login page
        // naviage("/");
      }
    });

    // Keeps only one listener at any time.
    // Avoids memory leak
    return () => unsubscribeAuth();
  }, [dispatch, navigate]);

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/search" element={<Search />} />
        <Route path="/memberExclusive" element={<MemberExclusive />} />

        {/* 404 Catch-All: Redirects ANY unknown or invalid URL to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />

        {/* DEV-ONLY ROUTE */}
        {isDev && (
          <Route
            path="/test"
            element={
              <Suspense fallback={<div>Loading Sandbox...</div>}>
                <TestPage />
              </Suspense>
            }
          />
        )}
      </Routes>
    </div>
  );
}

export default App;
