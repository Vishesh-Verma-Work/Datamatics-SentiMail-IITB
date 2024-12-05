import React from "react";
import ReactDOM from "react-dom/client";

import Header from "./src/components/Header";
import Error from "./src/components/Error";
import Footer from "./src/components/Footer";
import Home from "./src/components/Home";
import ShowEmails from "./src/components/ShowEmails";
import PushMail from "./src/components/PushMail";
import ProcessMail from "./src/components/ProcessMail";
import ProcessedHeader from "./src/components/ProcessedHeader";
import OpenMail from "./src/components/OpenMail";
import  VisualData from "./src/components/VisualData";

// import { createBrowserRouter, RouterProvider, Outlet, Link } from "react-router-dom";

import { createBrowserRouter, RouterProvider } from "react-router";
import { Outlet } from "react-router-dom";


const Main = ()=>{
    return(
        <>
        <Header/>
        <Outlet/>
        <Footer/>
        </>
    )
};

const appRouter = createBrowserRouter([
    {
      path : "/",
      element : <Main/>,
      errorElement : <Error/>,
      children : [
          {
            path : "/",
            element : <Home/>,
            errorElement : <Error/>
          },
          {
            path : "/show",
            element : <ShowEmails/>,
            errorElement : <Error/>
          },
          {
            path : "/pushMail",
            element : <PushMail/>,
            errorElement : <Error/>
          },
          {
            path : "/processMails",
            element : <ProcessMail/>,
            errorElement : <Error/>
          },
          {
            path : "/dashboard",
            element : <ProcessedHeader/>,
            errorElement : <Error/>
          },
          {
            path : "/dashboard/:id",
            element : <OpenMail/>,
            errorElement : <Error/>
          },
          {
            path : "/visual",
            element : <VisualData/>,
            errorElement : <Error/>
          },
          {
            path : "/mc",
            element : <Home/>,
            errorElement : <Error/>
          }
      ]
    }
  ]);


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={appRouter} future={{
  v7_startTransition: true,
  v7_relativeSplatPath: true,
  v7_fetcherPersist: true,
  v7_normalizeFormMethod: true,
  v7_partialHydration: true,
  v7_skipActionErrorRevalidation: true,
}} />);