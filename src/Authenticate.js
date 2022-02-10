import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Authenticate = ({ setAuthenticated }) => {
  const { search } = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
  }, []);

  return <React.Fragment />;
};

export default Authenticate;
