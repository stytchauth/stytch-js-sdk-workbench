import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Authenticate = ({ setAuthenticated }) => {
  const { search } = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    console.log(search)
  }, [search]);

  return <React.Fragment />;
};

export default Authenticate;
