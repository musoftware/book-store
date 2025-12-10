import { Route, Routes } from 'react-router';
import Home from './Home';
import Favorite from './Favorite';
import Details from './Details';
import Navbarr from './Navbar';

function App() {
  return (
    <>
      <Navbarr />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/favorite/' element={<Favorite/>} />
            <Route path='/details/:book' element={<Details/>} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
