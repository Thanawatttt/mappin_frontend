import React, { useEffect, useState } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';
import axios from "axios";
import { API_BASE_URL } from "./config.js";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import PlaceIcon from '@mui/icons-material/Place';
import StarRateIcon from '@mui/icons-material/StarRate';

function App() {

  const [ShowLogin, setShowLogin] = useState(false);
  const [ShowRegister, setShowRegister] = useState(false);

  const REACT_APP_MAPBOX = "pk.eyJ1IjoidGhhbmF3YXR4ZDI1NTEiLCJhIjoiY21rNWpiOTFlMGpvczNlb3VkeGk0ajIwZCJ9.9PIkRJ6LlfP793XvR76i9Q";
  const [pins, setPins] = useState([]);
  const [CurrentPlaceId, setCurrentPlaceId]: any = useState(null);
  const [viewport, setViewport] = useState({
    latitude: 13,
    longitude: 101,
    zoom: 8
  });

  const [title, setTitle]: any = useState(null);
  const [newPlace, SetNewPlace]: any = useState(null);
  const [desc, SetDesc]: any = useState(null);
  const [rating, SetRating]: any = useState(0);

  const getPins = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/pins/all`);
      console.log(res.data);
      setPins(res.data.items);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getPins();
  }, []);
  const handleMarkerClick = (id: any, lat: any, long: any) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: +lat, longitude: +long })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const newPin = {
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.lng,
    }

    const token = localStorage.getItem("token");
    console.log(token);
    console.log(newPin);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/pins/`, {
        title,
        desc,
        rating: parseInt(rating),
        lat: newPlace.lat,
        long: newPlace.lng,
        createdBy: localStorage.getItem("email"),
      }, {
        headers: {
          'x-access-token': token,
        }
      })

      console.log(res);
      getPins();
      SetNewPlace(null);

    } catch (err: any) {
      console.error("Error creating pin:", err);
      console.error("Backend response:", err.response?.data);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    window.location.reload();
  }

  const handleAddClick = (e: any) => {
    const { lng, lat } = e.lngLat;
    SetNewPlace({
      lat,
      lng,
      createdAt: new Date().toISOString()
    })
  }

  return (
    <div className='App'>
      <ReactMapGL
        {...viewport}
        mapboxAccessToken={REACT_APP_MAPBOX}
        onMove={(evt) => setViewport(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        onDblClick={handleAddClick}
        style={{ width: '100vw', height: '100vh' }}
      >

        {pins.map((p: any) => (
          <React.Fragment key={p._id}>
            <Marker
              latitude={+p.lat}
              longitude={+p.long}
              offset={[-3.5 * viewport.zoom, -7 * viewport.zoom]}
            >
              <PlaceIcon style={{
                width: viewport.zoom * 7,
                color: p.createdBy === localStorage.getItem("email") ? "red" : "teal",
                fontSize: "50px"
              }}
                onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
              />
            </Marker>
            {p._id === CurrentPlaceId && (
              <Popup
                latitude={+p.lat}
                longitude={+p.long}
                closeButton={true}
                closeOnClick={false}
                anchor="left"
                onClose={() => setCurrentPlaceId(null)}
              >
                <div className='card'>
                  <label>Place</label>
                  <h4 className='place'>{p.title}</h4>
                  <label>Review</label>
                  <h4 className='desc'>{p.desc}</h4>
                  <label>Rating</label>
                  <div className='stars'>
                    {+ p.rating > 0 && <StarRateIcon />}
                    {+ p.rating > 1 && <StarRateIcon />}
                    {+ p.rating > 2 && <StarRateIcon />}
                    {+ p.rating > 3 && <StarRateIcon />}
                    {+ p.rating > 4 && <StarRateIcon />}

                  </div>
                  <label>Information</label>
                  <span className='username'>Created By <b>{p.createdBy}</b></span>
                  <span className='date'>{p.createdAt}</span>
                </div>
              </Popup>
            )}
          </React.Fragment>
        ))}

        {newPlace && (
          <Popup
            latitude={newPlace.lat}
            longitude={newPlace.lng}
            closeButton={true}
            closeOnClick={false}
            anchor="left"
            onClose={() => SetNewPlace(null)}
          >
            <div className='card'>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input placeholder="Enter a title" onChange={(e) => setTitle(e.target.value)} />
                <label>Review</label>
                <textarea placeholder="Say something about this place" onChange={(e) => SetDesc(e.target.value)} />
                <label>Rating</label>
                <select onChange={(e) => SetRating(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button type="submit">Add Pin</button>
              </form>
            </div>
          </Popup>
        )}


      </ReactMapGL>

      {localStorage.getItem("email") ? (
        <button className='button logout' onClick={handleLogout}>
          Logout
        </button>
      ) : (
        <div className='buttons'>
          <button className='button login' onClick={() => setShowLogin(true)}>
            Login
          </button>
          <button className='button register' onClick={() => setShowRegister(true)}>
            Register
          </button>
        </div>
      )}
      {ShowRegister && <Register setShowRegister={setShowRegister} />}
      {ShowLogin && <Login setShowLogin={setShowLogin} />}
    </div>
  )
}
export default App;