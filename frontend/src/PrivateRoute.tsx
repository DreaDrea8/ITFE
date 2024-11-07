import { FC, ReactNode, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContext } from './AppContext';

interface PrivateRouteProps {
  children: ReactNode[];
}

const PrivateRoute: FC<PrivateRouteProps> = ({ children }) => {
  if (!children.length){
    return <Navigate to="/auth/signin" />;
  }

  const appContext = useContext(AppContext);
  if (!appContext && children[1]) {
    return <>{children[1]}</>
  }
  if (!appContext) {
    return <Navigate to="/auth/signin" />;
  }

  const isValidToken = appContext.verifyToken()
  return <>{ isValidToken ? children[0] : children[1]}</>;
};

export default PrivateRoute;