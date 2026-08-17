import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Search from './pages/Search';
import UserProfile from './pages/UserProfile';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderDetails from './pages/OrderDetails';
import HelpFAQ from './pages/HelpFAQ';
import ReportListing from './pages/ReportListing';
import TermsPrivacy from './pages/TermsPrivacy';
import CreateListing from './pages/CreateListing';
import Messages from './pages/Messages';

const MainLayout = () => {
  return (
    <div className="layout-container">
      <nav style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
        <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', listStyle: 'none', padding: 0, margin: 0, justifyContent: 'center' }}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/signup">Sign Up</Link></li>
          <li><Link to="/search">Search</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/cart">Cart</Link></li>
          <li><Link to="/checkout">Checkout</Link></li>
          <li><Link to="/order-details">Order Details</Link></li>
          <li><Link to="/help">Help/FAQ</Link></li>
          <li><Link to="/report-listing">Report Listing</Link></li>
          <li><Link to="/terms">Terms</Link></li>
          <li><Link to="/create-listing">Create Listing</Link></li>
          <li><Link to="/messages">Messages</Link></li>
        </ul>
      </nav>
      <main style={{ padding: '2rem', flexGrow: 1, boxSizing: 'border-box' }}>
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes without MainLayout (Full Screen) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* All other routes with MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-details" element={<OrderDetails />} />
          <Route path="/help" element={<HelpFAQ />} />
          <Route path="/report-listing" element={<ReportListing />} />
          <Route path="/terms" element={<TermsPrivacy />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/messages" element={<Messages />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
