import React, { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Navigation from './components/Navigation/Navigation.jsx';
import Logo from './components/Logo/Logo.jsx';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.jsx';
import Rank from './components/Rank/Rank.jsx'
import FaceRecognition from './components/FaceRecognition/FaceRecognition.jsx';
import "./App.css";
import ParticlesBg from 'particles-bg'
import Signin from './components/Signin/Signin.jsx'
import Register from './components/Register/Register.jsx'


const initialState = {
  input: "",
  box: [],
  route: 'signin',
  isSignedIn: false,
  user: {
    id:'',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

function App() {
  const [input, setInput] = useState(initialState.input);
  const [box, setBox] = useState(initialState.box);
  const [route, setRoute] = useState(initialState.route);
  const [isSignedIn,setIsSignedIn] = useState(initialState.isSignedIn);
  const [user, setUser] = useState(initialState.user);

  const loadUser = data =>{
    setUser({
      id:data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    })
  }

  const calculateFaceLocation = (data) =>{
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    const clarifaiFace = data.map(region =>{
      const boundingBox = region.region_info.bounding_box;
      return ({
        leftCol: boundingBox.left_col * width,
        topRow: boundingBox.top_row * height,
        rightCol: width - (boundingBox.right_col * width),
        bottomRow: height - (boundingBox.bottom_row * height)
      })
    });
    return clarifaiFace;
  }

  const displayFaceBox = (box) =>{
    setBox(box);
  }

  const onInputChange = (event) =>{
    setInput(event.target.value);
    setBox(initialState.box);
  }

  const onButtonSubmit = () =>{
    fetch('http://localhost:3000/imageurl',{
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: input
      })
    })
    .then(response => response.json())
    .then(result => {
      
      const regions = result.outputs[0].data.regions;

      // Passing regions to create multiple squares
      displayFaceBox(calculateFaceLocation(regions))

      regions.forEach(region => {
        // Accessing and rounding the bounding box values
        const boundingBox = region.region_info.bounding_box;
        const topRow = boundingBox.top_row.toFixed(3);
        const leftCol = boundingBox.left_col.toFixed(3);
        const bottomRow = boundingBox.bottom_row.toFixed(3);
        const rightCol = boundingBox.right_col.toFixed(3);

        region.data.concepts.forEach(concept => {

          // Accessing and rounding the concept value
          const name = concept.name;
          const value = concept.value.toFixed(4);
          
                  
          });
      });
      if(result){
        fetch('http://localhost:3000/image',{
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: user.id
          })
        }).then(response => response.json())
          .then(count => {
            setUser(prevUser => ({...prevUser, entries: count}))
          }).catch(console.log);
      }
    })
    .catch(error => console.log('error', error));
  }

  const onRouteChange = (route) =>{
    if(route === 'signin'){
      setInput(initialState.input);
      setBox(initialState.box);
      setRoute(initialState.route);
      setIsSignedIn(initialState.isSignedIn);
      setUser(initialState.user);
    } else if(route === 'home'){
      setIsSignedIn(true);
    }
    setRoute(route);
  }

  return (
    <>
      <ParticlesBg type="cobweb" bg={true} />
      <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange}/>
      {
        route === "home" ?
          <div>
            <Logo />
            <Rank name={user.name} entries={user.entries}/>
            <ImageLinkForm onInputChange={onInputChange} on onButtonSubmit={onButtonSubmit}/>
            <FaceRecognition boxes={box} imageUrl={input}/>
          </div>
        :(
          route === 'signin' ?
            <Signin onRouteChange={onRouteChange} loadUser={loadUser}/>
          :
            <Register onRouteChange={onRouteChange} loadUser={loadUser} />
        )
        
        
        
      }
    </>
  )
}

export default App
