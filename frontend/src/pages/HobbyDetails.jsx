import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { hobbyApi } from '../services/api';

function HobbyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hobby, setHobby] = useState(null);

  useEffect(() => {
    hobbyApi.getById(id)
      .then(data => setHobby(data))
      .catch(err => console.error("Hobby not found"));
  }, [id]);

  if (!hobby) return <div>Loading...</div>;

  return (
    <div>
      <button onClick={() => navigate(-1)}>Back</button>

      <h1>{hobby.name}</h1>
      <p>Category ID: {hobby.category_id}</p>
      <p>Price: {hobby.min_price} - {hobby.max_price}</p>

      <div>
        <h3>Description</h3>
        <p>{hobby.description}</p>
      </div>

      <button onClick={() => alert("Interest registered")}>
        I'm interested
      </button>
    </div>
  );
}

export default HobbyDetails;