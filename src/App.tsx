import { Flowbite } from "flowbite-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Landing from "./layouts/Landing";

function App() {
  return (
    <Flowbite>
      <Landing />
      <ToastContainer />
    </Flowbite>
  );
}

export default App;
