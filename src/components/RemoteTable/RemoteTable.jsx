import React from "react";
import ReactDOM from 'react-dom'
import MaterialTable from 'material-table'
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons

export default function RemoteTable(props) {
  const proxyurl = "https://cors-anywhere.herokuapp.com/";
  const { title, columns, urlfetch, ...rest} = props;
  return (
    <MaterialTable
      title={title}
      columns={JSON.parse(columns)}
      data={(query) =>
        new Promise((resolve, reject) => {                                    
          let url = urlfetch
          let headers = {
              "Accept": "application/json",
              "Content-Type": "application/json",
              "Authorization": 'Bearer '+'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjFiNjM2MWE2MDkzYjRiNzMwZWYxMTY1YzIxODA1ZmYxYWFjNWZhN2JlMjRlMzliZGQ2Yjk2NTA1OTcxZDZjMDgxNjE3Y2Y2YzBlYjUwMWRhIn0.eyJhdWQiOiIxIiwianRpIjoiMWI2MzYxYTYwOTNiNGI3MzBlZjExNjVjMjE4MDVmZjFhYWM1ZmE3YmUyNGUzOWJkZDZiOTY1MDU5NzFkNmMwODE2MTdjZjZjMGViNTAxZGEiLCJpYXQiOjE1NjgwNTAwMDEsIm5iZiI6MTU2ODA1MDAwMSwiZXhwIjoxNTk5NjcyNDAxLCJzdWIiOiIiLCJzY29wZXMiOltdfQ.I-zsnSQ7kvBgwYos9vcvsjsZoRubdhtyxLlSGXhIfO5FVD0qBf2OuxpTrTFaCzZuSt0xaZjBNbRxKC8YfZou4wY0HTFsquz7nfRTBSnyG1O1oI1RkJq3H9MHNdZSASyxd90SzD-hUN_erkQGV2Zx3QJcwBWbBrVrtuxP-VpeeHh2g3X9PnG5GnR5i7mkhFbPSVI6gYQvgbRvXcEMCGHt2ifKYC3cAr43cHUrNDQphYEesD9AxRgdruikVBQ3ZKFSi1Ax80Kr-iPrgaOIQMc17mQZK18x3jfsNNpFgQMWzcaUvJdF60G-DemLQHmnj3CEjSQt42vtwupHMsABGji_HFC0u26F1yuh2FcX1iVQ59UJ2bajYiWuudJt8PawVv0E2OZlb2AWJHa2Hpmt6ZX_TBYMRbuIWdRAU0UOUC5vbsf6tl4dwjAwig36LllWDNGaGZozK4DCyepOHpml35vBn1C9ju5KBKmZygGcULgPN7ehuxMCos8vRleHGx2qaXAZUiwPT55DLI_XjTqQe1R-qxDxqAWws6at0CnM4hiMj5VEl9ptvhzYpVJbd9ytlMV4rVS3woFdAz4APFopHx-nGtno5bbJCheL0NwkLD9JldR--MuZscx2NRhvdiqAkinryqQo3eaBqblTLT9J8z_U4kwwph-X5r_4dNngy1SlUYQ',
          }

          url += '&per_page=' + query.pageSize
          url += '&order=' + 'asc'
          url += '&column=' + 'id'
          url += '&page=' + (query.page + 1)
          fetch(url, {            
            headers: headers,
          })
            .then(response => response.json())
            .then(result => {
              resolve({
                pageSize: result.per_page,
                data: result.data,
                page: result.current_page - 1,
                totalCount: result.total,
              })
            })
        })
      }        
      options={{
        pageSize: 20,              
        debounceInterval: 500,            
      }}
    />
  );
}

