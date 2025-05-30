import {HashRouter, Routes, Route, Navigate} from 'react-router-dom';
import Pricing from './pages/Pricing';
import Product from './pages/Product';
import Homepage from './pages/Homepage';
import PageNotFound from './pages/PageNotFound';
import Login from './pages/Login';
import AppLayout from './pages/AppLayout';
import CityList from './components/CityList';
import CountryList from './components/CountryList';
import City from './components/City';
import Form from './components/Form'
import { CitiesProvider } from './contexts/CitiesContext.jsx';
import { AuthProvider } from './contexts/FakeAuthContext.jsx';
import ProtectedRoute from './pages/ProtectedRoute.jsx';

export default function App() {

  return (
    <AuthProvider>
    <CitiesProvider>
    <HashRouter>
      <Routes>
        <Route path='/' element={<Homepage />}></Route>
        <Route path='/pricing' element={<Pricing />}></Route>
        <Route path='/product' element={<Product />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/app' element={<ProtectedRoute><AppLayout/></ProtectedRoute>}>
          <Route index element={<Navigate replace to='cities'/>} />
          <Route path='cities' element={<CityList/>}/>
          <Route path='cities/:id' element={<City />} />
          <Route path='countries' element={<CountryList/>} />
          <Route path='form' element={<Form />}/>
        </Route>
        <Route path='*' element={<PageNotFound />}></Route>
      </Routes>
    </HashRouter>
    </CitiesProvider>
    </AuthProvider>
  )
}

