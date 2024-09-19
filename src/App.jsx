
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signin from "./Signin.jsx";
import AdminPage from "./AdminPage.jsx";
import UserPage from "./UserPage.jsx";

function App() {

  return (
    <Router>
        <Routes>
            <Route path="/Signin" element={<Signin />} />
            <Route path='/' element={<UserPage />} />
            <Route path='/Admin' element={<AdminPage />} />
        </Routes>
    </Router>
  )
}

export default App
