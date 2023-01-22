import "./App.css";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import Todos from "./Pages/Todos";
import RequireAuth from "./Components/RequireAuth";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/secret"
          element={
            <RequireAuth>
              <Todos />
            </RequireAuth>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
