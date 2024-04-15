import './App.css';
import { useEffect } from 'react'
import axios from 'axios';

function App() {
  useEffect(() => {
    axios({
      "method": "GET",
      "url": "/profile"
    }).then((res) => {
      console.log(res.data)
    }).catch((err) => {
      console.log(err)
    })
  })

  return (
    <div className="App">
      hi
    </div>
  );
}

export default App;
