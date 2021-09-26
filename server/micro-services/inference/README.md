# Auth micro-service 

> All apis include `/auth`. 


## APIs

* /refresh-token 

body: 
    * refresh-token
      type: string 
      headers: {
        Authorization: "Bearer <TOKEN>"
      }  
