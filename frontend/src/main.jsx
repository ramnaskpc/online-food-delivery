import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom"
import FoodContextProvider from './context/FoodContext.jsx'
import 'react-toastify/dist/ReactToastify.css';


createRoot(document.getElementById('root')).render(
     <BrowserRouter>
<FoodContextProvider>

  
    <App/>
   
</FoodContextProvider>
 </BrowserRouter>
)
