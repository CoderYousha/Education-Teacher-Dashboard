import React from "react";

async function Fetch (link, method, data=null){
     let result = await fetch(link, {
          method: method,
          headers: {
               'Authorization': `Bearer ${localStorage.getItem('token')}`,
               'Accept': 'application/json',
          },
          body: data
     });

     const status = result.status;
     result = await result.json();

     return {
          status: status,
          data: result
     };
}

export default Fetch;