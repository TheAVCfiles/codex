import { Link, Route, Routes } from 'react-router-dom';
import { BackOfHouse } from './pages/BackOfHouse';
import { SuiteView } from './pages/SuiteView';
import { ReservationDesk } from './pages/ReservationDesk';
import { AccessStatus } from './pages/AccessStatus';
export default function App(){return <><nav><Link to='/'>Back-of-House</Link> | <Link to='/reservation-desk'>Reservation Desk</Link> | <Link to='/suite/4B'>In-Suite View</Link></nav><Routes><Route path='/' element={<BackOfHouse/>}/><Route path='/suite/:id' element={<SuiteView/>}/><Route path='/reservation-desk' element={<ReservationDesk/>}/><Route path='/access-status' element={<AccessStatus/>}/></Routes></>;}
