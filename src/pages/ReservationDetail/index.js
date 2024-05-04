import { useEffect, useState } from "react";
import { Card, Col, Container, Alert, Row, Stack , Form, Button} from "react-bootstrap";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { supabase } from "../../utils/supabase";
import Reservation from "../../models/Reservation";
import { distancesMatrix } from "../../Data/DistanceMatrix";

const ReservationDetail = () => {
  const location = useLocation();
  const {id} = useParams();
  const [availability, setAvailability] = useState(true)
  const [availabilitySuccess, setAvailabilitySuccess] = useState(false)
  const [reviewSuccess, setReviewSuccess] = useState(false)
  const [reservation, setReservation] = useState(null);
  const [review, setReview] = useState(null);


  useEffect(() => {
    async function getReservations() {
      try {
        const { data: reservation } = await supabase
          .from("reservations")
          .select("*, passengers(*), taxies(*)")
          .eq('id', id)
          if (reservation) {
            setReservation(Reservation.fromReservations(reservation));
          }
      } catch (e) {
        console.log(e);
      }
    }

    getReservations();
  }, []);

  const updateAvailability = async () => {
    setAvailabilitySuccess(false)
    const { data, error } = await supabase
    .from('taxies')
    .update({ 'availability':  availability})
    .eq('id', reservation?.[0].taxi.id).select();
    setAvailabilitySuccess(true)
  }
  const addReview = async () => {
    setReviewSuccess(false)
    const { data, error } = await supabase
    .from('reviews')
    .insert([
      { review: review, passenger_id: reservation?.[0].passenger.id, taxi_id: reservation?.[0].taxi.id },
    ])
    .select()
    setReviewSuccess(true)
  }

  function getDistance(city1, city2) {
    // Check if the cities are valid
      if (!(city1 in distancesMatrix) || !(city2 in distancesMatrix)) {
          return 0;
      }
      
      // Check if the distance is available in the matrix
      if (!(city2 in distancesMatrix[city1])) {
          return 0;
      }
      
      // Return the distance
      return distancesMatrix[city1][city2];
  }

  return (
    <>
      <Container fluid>
        {availabilitySuccess && (
          <Alert
            variant="success"
            onClose={() => setAvailabilitySuccess(false)}
            dismissible
          >
            Availability successfully updated
          </Alert>
        )}
        {reviewSuccess && (
          <Alert
            variant="success"
            onClose={() => setReviewSuccess(false)}
            dismissible
          >
            Review successfully submitted
          </Alert>
        )}
        <h1>Reservation Detail</h1>

        {reservation?.[0] && (
          <Row className="row-cols-1 row-cols-md-2 g-4">
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title>Passenger Detail</Card.Title>
                  <Card.Text className="fw-medium text-muted">
                    Passenger Name: <span className="fw-normal">{reservation[0]?.passenger.firstName} {reservation[0].passenger.lastName}</span>
                    {console.log(reservation)}
                  </Card.Text>
                  <Card.Text className="fw-medium text-muted">
                    Passenger Mobile:{" "}
                    <span className="fw-normal">{reservation[0].passenger.mobile}</span>
                  </Card.Text>
                  <Card.Text className="fw-medium text-muted">
                    Passenger Email:{" "}
                    <span className="fw-normal">{reservation[0].passenger.email}</span>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title>Trip Detail</Card.Title>
                  <Card.Text className="fw-medium text-muted">
                    To: <span className="fw-normal">{reservation[0]?.toLocation}</span>
                  </Card.Text>
                  <Card.Text className="fw-medium text-muted">
                    From: <span className="fw-normal">{reservation[0]?.fromLocation}</span>
                  </Card.Text>
                  <Stack direction="horizontal">
                    <Col>
                      <Card.Text className="fw-medium text-muted">
                        Date: <span className="fw-normal">{reservation[0]?.date}</span>
                      </Card.Text>
                    </Col>
                    <Col>
                      <Card.Text className="fw-medium text-muted">
                        Cost: <span className="fw-normal">{getDistance(reservation[0]?.toLocation, reservation[0]?.fromLocation) * 100} Rupees</span>
                      </Card.Text>
                    </Col>
                  </Stack>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title>Texi Detail</Card.Title>
                  <Stack direction="horizontal">
                    <Col>
                      <Card.Text className="fw-medium text-muted">
                        Driver Name: <span className="fw-normal">{reservation[0]?.taxi.driverName}</span>
                      </Card.Text>
                    </Col>
                    <Col>
                      <Card.Text className="fw-medium text-muted">
                        Driver Contact No:{" "}
                        <span className="fw-normal">{reservation[0]?.taxi.contact}</span>
                      </Card.Text>
                    </Col>
                  </Stack>
                  <Stack direction="horizontal">
                    <Col>
                      <Card.Text className="fw-medium text-muted">
                        Vehicle Registration No:{" "}
                        <span className="fw-normal">{reservation[0]?.taxi.vehicleNo}</span>
                      </Card.Text>
                    </Col>
                    <Col>
                      <Card.Text className="fw-medium text-muted">
                        Vehicle Model: <span className="fw-normal">{reservation[0]?.taxi.make} {reservation[0]?.taxi.model}</span>
                      </Card.Text>
                    </Col>
                  </Stack>
                  <Card.Text className="fw-medium text-muted">
                    Vehicle Color: <span className="fw-normal">{reservation[0]?.taxi.color}</span>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title>Availability</Card.Title>
                  <Form.Group as={Col} controlId="availabilityStatus">
                  <Form.Label>Availability Status</Form.Label>
                  <Form.Control
                    as="select"
                    name="availabilityStatus"
                    value={availability}
                    onChange={(event) => setAvailability(event.target.value)}
                  >
                    <option value="">Select...</option>
                    <option value="true">Available</option>
                    <option value="false">Busy</option>
                  </Form.Control>
                  <Button onClick={() => updateAvailability()}>Update Availability</Button>
                </Form.Group>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title>Write Review</Card.Title>
                  <Form.Group as={Col} controlId="availabilityStatus">
                  <Form.Label>Availability Status</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="review"
                    value={review}
                    onChange={(event) => setReview(event.target.value)}
                  >
                  </Form.Control>
                  <Button onClick={() => addReview()}>Submit Review</Button>
                </Form.Group>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
};

export default ReservationDetail;
