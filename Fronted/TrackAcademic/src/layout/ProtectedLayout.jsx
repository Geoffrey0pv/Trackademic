import { Navigate, Outlet } from "react-router-dom";

const ProtectedLayout = ()=>{
    const user = localStorage.getItem('user');
    if(user){
        return <Outlet />
    }else{
        return <Navigate to="/login" replace/>
    }
}
export default ProtectedLayout;