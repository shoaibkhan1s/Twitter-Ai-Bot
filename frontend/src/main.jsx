import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import AllTweets from './Pages/AllTweets.jsx'
import './index.css';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Layout from './Pages/Layout' 

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />} >
    <Route index element={<App />} />
    <Route path='allTweets' element={<AllTweets />} />
      </Route>
  )
)
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <RouterProvider router={router}/>
  </React.StrictMode>
);
