import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import BoothLogin from './pages/booth_login';
import EnterOTP from './pages/enter_otp';
import POLogin from './pages/po_login';
import GenerateToken from './pages/generate_token';
import EligibleElections from './pages/eligible_elections';
import BallotPage from './pages/ballot_page';
import AdminLogin from './pages/admin_login';
import ElectoralUpload from './pages/electoral_upload';
import React from 'react';

function App() {

  const exitFullScreen = () => {
    // Do nothing if toggling to fullscreen
    if (document.fullscreenElement) {
      return;
    }else{
      document.documentElement.requestFullscreen();
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (event) => {
      const allowedKeys = /^[0-9a-zA-Z]+$/;
      // console.log(event)
      if (event.type === 'keydown' && !allowedKeys.test(event.key)) {
        alert('Only letters and numbers are allowed.');
        exitFullScreen();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') {
        alert('Changing tabs or windows is not allowed.');
        exitFullScreen();
      }
    };

    // const handleBlur = () => {
    //   alert('Changing tabs or windows is not allowed.');
    //   exitFullScreen();
    // };

    const handleContextMenu = (event) => {
      event.preventDefault();
      // alert('Right-clicking is not allowed.');
      // exitFullScreen();
    };

    // document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', exitFullScreen);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    // window.addEventListener('blur', handleBlur);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      // document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', exitFullScreen);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);
  

	return (
		<div className='App'>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/booth_login' element={<BoothLogin />} />
        <Route path='/enter_otp' element={<EnterOTP />} />
        <Route path='/po_login' element={<POLogin />} />
        <Route path='/generate_token' element={<GenerateToken />} />
        <Route path='/eligible_elections' element={<EligibleElections />} />
        <Route path='/ballot_page' element={<BallotPage />} />
        <Route path='/admin_login' element={<AdminLogin />} />
        <Route path='/electoral_upload' element={<ElectoralUpload />} />
			</Routes>
		</div>
	);
}

export default App;
