import React, { useState, useEffect } from "react";
import { Button, Col, Container, Form, Row, Alert } from "react-bootstrap";
import Select from "react-select";
import Taxi from "../../models/Taxi";
import { supabase } from "../../utils/supabase";
import Passenger from "../../models/Passenger";

const ReservationPage = () => {
  const [locations, setLocations] = useState([]);
  const [taxies, setTaxies] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [formData, setFormData] = useState({
    fromLocation: null,
    toLocation: null,
    selectedVehicle: null,
    selectedPassenger: null,
    date: new Date().toISOString()
  });
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Dummy locations
    const dummyLocations = [
      { value: "1", label: "Colombo" },
      { value: "2", label: "Kandy" },
      { value: "3", label: "Galle" },
      { value: "4", label: "Jaffna" },
      { value: "5", label: "Trincomalee" },
    ];
    setLocations(dummyLocations);

    async function getTaxies() {
      const { data: taxies } = await supabase.from('taxies').select()
      if (taxies.length > 0) {
        setTaxies(Taxi.fromTaxies(taxies))
      }
    }
    async function getPassengers() {
      const { data: passengers } = await supabase.from('passengers').select()
      console.log(passengers);
      if (passengers.length > 0) {
        setPassengers(Passenger.fromPassengers(passengers))
      }
    }
    getPassengers()
    getTaxies()
  }, []);

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePassengerChange = (event) => {
    setFormData({
      ...formData,
      selectedPassenger: event.target.value
    })
  }

  const handleVehicleChange = (event) => {
    setFormData({
      ...formData,
      selectedVehicle: event.target.value
    })
  }

  const handleDateChange = (event) => {
    setFormData({
      ...formData,
      date: event.target.value
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Perform reservation submission logic here (using dummy data)
    try {
      const { error } = await supabase
      .from('reservations')
      .insert([
        { 
          from: formData.fromLocation.label,
          to: formData.toLocation.label,
          date: new Date(formData.date).toISOString(),
          passenger_id: formData.selectedPassenger,
          taxi_id: formData.selectedVehicle,
        },
      ])
      .select()

      setSuccess(true);
      // Clear the form after successful submission
      setFormData({
        fromLocation: null,
        toLocation: null,
        selectedVehicle: null,
        name: "",
        mobile: "",
        email: "",
      });
    } catch (error) {
      console.error("Error submitting reservation:", error);
      setError(true);
    }
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h1>Reservation Page</h1>
        </Col>
      </Row>
      <Row className="mb-4">
        {success && (
          <Alert
            variant="success"
            onClose={() => setSuccess(false)}
            dismissible
          >
            Reservation successfully submitted
          </Alert>
        )}
        {error && (
          <Alert variant="danger" onClose={() => setError(false)} dismissible>
            Error submitting reservation. Please try again.
          </Alert>
        )}
      </Row>
      <Row className="mb-4">
        <Form onSubmit={handleSubmit}>
          <Row className="mb-4">
            <Col md={6}>
              <Form.Group controlId="fromLocation">
                <Form.Label>From </Form.Label>
                <Select
                  options={locations}
                  value={formData.fromLocation}
                  onChange={(selectedOption) =>
                    handleChange("fromLocation", selectedOption)
                  }
                  isSearchable
                  placeholder="Select From Location"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="toLocation">
                <Form.Label>To </Form.Label>
                <Select
                  options={locations}
                  value={formData.toLocation}
                  onChange={(selectedOption) =>
                    handleChange("toLocation", selectedOption)
                  }
                  isSearchable
                  placeholder="Select To Location"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-4">
            <Col md={6}>
              <Form.Group controlId="selectedVehicle">
                <Form.Label>Select Driver</Form.Label>
                <Form.Control as="select" name="selectedVehicle" value={formData.selectedVehicle} onChange={handleVehicleChange}>
                  <option >Select Driver...</option>
                  {taxies.map(taxi => {
                    return taxi.availability && <option key={taxi.id} value={taxi.id}>{taxi.driverName}</option>
                  })}
                  
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="selectedPassenger">
                <Form.Label>Select Passenger</Form.Label>
                <Form.Control as="select" name="selectedPassenger" value={formData.selectedPassenger} onChange={handlePassengerChange}>
                  <option >Select Passenger...</option>
                  {passengers.map(passenger => {
                    return <option key={passenger.id} value={passenger.id}>{passenger.fullName}</option>
                  })}
                  
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-4">
            <Form.Group as={Col} md={6} controlId="date">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" name="date" value={formData.date} onChange={handleDateChange} />
            </Form.Group>
          </Row>

          <Button variant="primary" type="submit" block>
            Confirm Reservation
          </Button>
        </Form>
      </Row>
    </Container>
  );
};

export default ReservationPage;
