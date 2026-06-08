import { createRootRoute } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import Navbar from '../components/Navbar/Navbar'

export const rootRoute = createRootRoute({
    component: () =>
        <>
        <Navbar/>
        <Outlet/>
        </> 
})
