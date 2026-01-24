import { useNavigate } from "react-router-dom";

async function CheckLogin(host) {

     let result = await fetch(host + '/account/get-profile', {
          method: "GET",
          headers: {
               'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
     });

     if (result.status == 200) {
          result = await result.json();
          return result;
     } else {
          return false;
     }

}

export default CheckLogin;