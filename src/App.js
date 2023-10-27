import { BrowserRouter } from "react-router-dom";
import { QueryParamsCalendarController } from "./QueryParamsCalendarController";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <QueryParamsCalendarController />
    </BrowserRouter>
  );
}

export default App;
