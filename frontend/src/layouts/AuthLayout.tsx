import { Outlet } from "react-router-dom"

import FooterComponent from "../components/FooterComponent"
import HeaderComponent from "../components/HeaderComponent"


const AuthLayout: React.FC = () => {
  return (
    <div>
      <HeaderComponent/>
      <main>
          <Outlet /> 
      </main>
      <FooterComponent />
    </div>
  )
}

export default AuthLayout