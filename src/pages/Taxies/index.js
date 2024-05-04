import React from "react";
import { supabase } from "../../utils/supabase";
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import Taxi from "../../models/Taxi";

const Taxies = () => {
  const [taxies, setTaxies] = useState([]);
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    async function getTaxies() {
      const { data: taxies } = await supabase.from("taxies").select();
      if (taxies.length > 0) {
        setTaxies(Taxi.fromTaxies(taxies));
      }
    }

    getTaxies();
  }, []);
  useEffect(() => {
    async function getReviews() {
      const { data: reviews } = await supabase.from("reviews").select("*, passengers(*), taxies(*)");
      if (reviews.length > 0) {
        setReviews(reviews);
      }
    }

    getReviews();
  }, []);
  return (
    <>
      <h1>Taxies</h1>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Make</th>
            <th>Model</th>
            <th>Year</th>
            <th>Color</th>
            <th>Vehicle number</th>
            <th>Driver Name</th>
            <th>Contact</th>
            <th>Licence No</th>
            <th>Availability</th>
          </tr>
        </thead>
        <tbody>
          {taxies.map((taxi) => {
            return (
              <tr key={taxi.id}>
                <td>{taxi.id}</td>
                <td>{taxi.make}</td>
                <td>{taxi.model}</td>
                <td>{taxi.year}</td>
                <td>{taxi.color}</td>
                <td>{taxi.vehicleNo}</td>
                <td>{taxi.driverName}</td>
                <td>{taxi.contact}</td>
                <td>{taxi.licNumber}</td>
                <td>{taxi.availability ? "Available" : "Busy"}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <br />
      <h1>Reviews</h1>
      {reviews.map(review => {
        return (
          <div style={{marginBottom: '8px'}}>
            <div>"{review.review}" by {review.passengers.email} for {review.taxies.driver_name}</div>
          </div>
        )
      })}
    </>
  );
};

export default Taxies;
// name,
//     vehicleNo,
//     driverName,
//     make,
//     model,
//     year,
//     color,
//     contact,
//     licNumber,
//     expDate,
//     availability,
