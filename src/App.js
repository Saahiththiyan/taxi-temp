import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import RegisterVehicles from "./pages/RegisterVehicles";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import Taxies from "./pages/Taxies";
import Reservations from "./pages/Reservations";
import ReservationPage from "./pages/Operator";
import Login from "./pages/Login";
import "./App.css";
import ReservationDetail from "./pages/ReservationDetail";
import SignUp from "./pages/SignUp";
import { Button } from "react-bootstrap";
import { supabase } from "./utils/supabase";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function App() {
  const location = useLocation();
  let navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: currentUser, error } = await supabase.auth.getUser();
        console.log(currentUser);
        if (currentUser.user === null) {
          navigate('/login')
          
        }
        if (error) {
          throw error;
        }
        setUser(currentUser);
      } catch (error) {
        console.error('Error fetching user:', error.message);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!user) {
      // navigate('/login')
    }
  }, [user])

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
    } else {
      console.log('Logged out successfully');
      window.location.reload(); 
      // You can redirect or update your UI after logout if needed
    }
  }

  return (
    <div>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">City Taxi System</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto" variant="underline">
              {user?.user && (
                <>
                <Nav.Link
                  href="/register-vehicles"
                  active={location.pathname === "/register-vehicles"}
                >
                  Register Vehicle
                </Nav.Link>
                <Nav.Link href="/taxies" active={location.pathname === "/taxies"}>
                  Taxies
                </Nav.Link>
                <Nav.Link
                  href="/reservations"
                  active={location.pathname === "/reservations"}
                >
                  Reservations
                </Nav.Link>
                <Nav.Link
                  href="/reserve-taxi"
                  active={location.pathname === "/reserve-taxi"}
                >
                  Reserve Taxi
                </Nav.Link>
                
                </>
              )}
              {!user?.user && (
                <Nav.Link href="/login" active={location.pathname === "/login"}>
                  Login
                </Nav.Link>
              )}
              {user?.user && (
                <Button onClick={() => handleLogout()} variant="outline-success">Logout</Button>
              )}
              {user?.user && (
                <Navbar.Collapse className="justify-content-end">
                  <Navbar.Text>
                    Signed in as: <a href="#login">{user?.user.email}</a>
                  </Navbar.Text>
                </Navbar.Collapse>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="mt-5">
        <Routes>
          <Route path="/register-vehicles" element={<RegisterVehicles/>} />
          <Route path="/taxies" element={<Taxies />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/reservation-detail/:id" element={<ReservationDetail />} />
          <Route path="/reserve-taxi" element={<ReservationPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
