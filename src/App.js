// App.js

import React, { Component } from 'react';
import './App.css';
// Reactstrap
import { Button, Collapse, Navbar, NavbarToggler, NavbarBrand, Nav } from 'reactstrap';
// Axios
import axios from 'axios';
import Footer from './components/Footer.js';

const urlMapsAPI = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDAFTlneUB6Cx76TafeVJdk3DFwKGD1KRU&callback=initMap';


class App extends Component {
    
    // Constructor function for state management
    constructor(props) {  
    super(props); 
      this.toggleNavbar = this.toggleNavbar.bind(this);    
this.state = {
     collapsed: true,
      places: [],
      markers: [],
      query: '',
      infoWindow: [] 
     };
}
    
    // Lifecycle event
    componentDidMount() {
        /* Calls grabPlaces, which handles the async request parameters and is passed to axios which fetches the FourSquare data.*/
        this.grabPlaces()
        // Error handling: For when the Google Maps API key authenication fails.
    window.gm_authFailure = () => { 
      alert(
        "Google Maps error! Check out the JS Console for additional details!");
    }
    }
    
    
    /* renderMap function: Loads script with the scriptLoad function as well as it calls initMap. */
    renderMap = () => {
        scriptLoad(urlMapsAPI)
        window.initMap = this.initMap
    }
    
    
    // toggleNavbar function: Handles the toggling (opening/closing) of the navbar.
    toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

    
    /* handleBtnClick: Handles ListView click event (Navbar) on buttons to open infowindow and animate. */
    handleBtnClick = placeName => {
        // eslint-disable-next-line
        this.state.markers.map(marker => {
            // If marker's title equal to button's name
            if (marker.title === placeName) {
              // Then handle and trigger a click event on markers and animate them.    
                window.google.maps.event.trigger(marker, 'click')
                marker.setAnimation(window.google.maps.Animation.DROP)
            }
        })
    }
    
    
/* updateQuery: Handles search field's onChange event handler for query */
updateQuery = (event) => {
    this.setState({ query: event.target.value})
}

    
    grabPlaces = () => {
        // FourSquare Request URL
        const API_request = "https://api.foursquare.com/v2/venues/explore?"
        
        // Parameters
        const params = {
            
         client_id: "JPSSWLW2L5QTLMX0S4ZI3RWWUQ2CK4DP3SVYRXIPEY5SHHCZ",
         client_secret: "0MJQX5EYDLMND3HCEXBCDAJ52ROIOV1RVEDDAR2SGS4YQTMI",    
         query: "museum",
         near: "Christchurch",
         limit: 10,    
         v: "20182507"    
        }
        
        
        // Asychronous request using Axios.
        axios.get(API_request + new URLSearchParams(params))
            .then(response => {
              console.log('FourSquare API Data', response.data.response.groups[0].items)
            this.setState({
              // Sets state of the places state with FourSqaure data.    
              places: response.data.response.groups[0].items 
              // Calls renderMap.    
            }, this.renderMap())
        })
            .catch(err => {
            console.log(`Error loading Data!: ${err}`)
            alert(`Error fetching FourSquare Data! Error: ${err}`)
        })
        
    }
    
    
    /* initMap function: Initializes the Map including markers, infowindows, and other particular details. */
    initMap = () => {
        const { places, markers } = this.state;
        // eslint-disable-next-line 
        let map = new window.google.maps.Map(document.getElementById('map'), {
          // Sets Map's center.    
          center: {lat: -43.532054, lng: 172.636225},
          // Sets Map's zoom level.    
          zoom: 10,   
          draggable: true   
        })
        
        
        // Infowindow initialization
        let infowindow = new window.google.maps.InfoWindow({maxWidth: 200})
        this.setState({
            infoWindow: infowindow
        })
        console.log('Infowindows', infowindow)
        // eslint-disable-next-line
                  places.map(place => {
             // Initializes Infowindow's content.          
             let contentString = `<div style="background-color: #99e6e6;"><h3 className="venueName">${place.venue.name}</h3>
<hr> <img src="https://maps.googleapis.com/maps/api/streetview?size=145x145&location=${place.venue.location.lat} ${place.venue.location.lng}
&fov=90&heading=335&pitch=10
&key=AIzaSyAYxP1S161tECIbnGVpp8z6YYb8oeXC15A" alt="${place.venue.name}" style="border: 6px solid black; border-radius: 12px;"> <br><br> <p style="font-weight: bolder;">Address: ${place.venue.location.formattedAddress}</p> <p style="font-weight: bolder;">More Info: <a href="https://www.google.com/search?safe=active&ei=ySDNW4TuKsizggeag46wBw&q=${place.venue.name}" target="_blank" title="Google search for ${place.venue.name}!"><i class="fab fa-google fa-2x"></i></a></p></div>`
             
            // Marker's initialization 
            let marker = new window.google.maps.Marker({
    position: {lat: place.venue.location.lat, lng: place.venue.location.lng},
    map: map,
    id: place.venue.id,           
    animation: window.google.maps.Animation.DROP,            
    title: place.venue.name            
  })
  
            
// Marker's click event.            
marker.addListener('click', function() {

        // Change the content
        infowindow.setContent(contentString)

        // Open An InfoWindow
        infowindow.open(map, marker)
      })    // Populates the marker's state with the markers.
            markers.push(marker);
        }) 
        this.setState({markers: [...markers]})
        console.log('Markers', this.state.markers)
      }   
    
    
  render() {
      const { places, query, markers, infoWindow } = this.state;
      
      /* Series of if and else conditional statements, which handles the
         query of the search field that filters the markers on the map by making the markers visible and invisible.
         Reference: https://www.youtube.com/watch?v=9t1xxypdkrE&feature=youtu.be
      */
      
      if (query) {
          // eslint-disable-next-line
          places.map((place, id) => {
              if (place.venue.name.toLowerCase().includes(query.toLowerCase())) {
                  markers[id].setVisible(true)
                  if (markers[id].getAnimation() !== null) {
                      markers[id].setAnimation(null);
                  }
                  else {
                      markers[id].setAnimation(window.google.maps.Animation.BOUNCE)
                  }
                  
              }
              else {
                  if (infoWindow.marker === markers[id]) {
                      infoWindow.close()
                  }
                  
                  markers[id].setVisible(false)
              }
          })
      }
      else {
          // eslint-disable-next-line
          places.map((place, id) => {
              if (markers.length && markers[id]) {
                  markers[id].setVisible(true)
              }
          })
      }
      
      
    return (  
        
        
        /* ListView Button filter
        
           References: https://www.youtube.com/watch?v=LvQe7xrUh7I&index=6&list=PLKC17wty6rS1XVZbRlWjYU0WVsIoJyO3s&t=0s
           
           https://www.youtube.com/watch?v=NVAVLCJwAAo&feature=youtu.be
           Located down below !!!
        */
        
        
      <div className="App">
        <main> 
        <Navbar color="dark" light>
        <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />    
        <NavbarBrand href="/" className="mr-auto"><header className="App-header"><h1 tabIndex="0">My Neighborhood Map</h1></header></NavbarBrand>
          <Collapse isOpen={!this.state.collapsed} navbar>
            <Nav navbar>
              <h2 className="museumsHead">Museums to Explore in Christchurch, New Zealand</h2>
              <h3 className="locationsHead">Locations:</h3> 
           <ul className="list-View" markers={markers} places={places}>
            {places.filter((place) => { return place.venue.name.toLowerCase().includes(query.toLowerCase())}).map((place) => 
            <li id={place.venue.name} className="list-Item" key={place.venue.id} onClick={() => this.handleBtnClick(place.venue.name)} tabIndex="0"><Button color="primary" className="btnStyle">{place.venue.name}</Button></li>
            )}           
          </ul>    
            </Nav>
          </Collapse>
        </Navbar>
        <section>
           <input
            className='search-places' id="searchInput"
            type='text'
            placeholder='Search for locations' value={query} onChange={this.updateQuery} aria-labelledby="Search filter"/>
         <div className="map-Container" role="application" aria-labelledby="Interactive Map" tabIndex="0">
                <div id="map" places={places} markers={markers}></div> 
          </div> 
        </section>
        </main>
      <Footer/>
      </div>
    );
  }
}

/* 

scriptLoad function: Loads the Google Maps API script asychronously 

References: https://www.klaasnotfound.com/2016/11/06/making-google-maps-work-with-react/
    https://www.youtube.com/channel/UCcWSbBe_s-T_gZRnqFbtyIA
*/
const scriptLoad = (url) => {
        let index = window.document.getElementsByTagName('script')[0]
        let script = window.document.createElement('script')
        script.src = url
        script.async = true
        script.defer = true
        index.parentNode.insertBefore(script, index)
        
    }


export default App;
