## Console Command List

_All commands need to be typed inside server console with confirmation of button "Enter"_

- Register new account  
  `/register login edition password`  
  **login** -> allows only alphanumeric values (spaces are forbidden)  
  **edition** -> choose editions by typing number of edition you want (1 - Prepare To Escape, 2 - Left Behind, 3 - Edge Of Darkness, by default its set to standard account) (Not Required)  
  **password** -> password allows all characters except spaces (Not Required)  
  _to login you dont need password which means it can be empty_

- Adding item to profile  
  `/addItem MySession TemplateId Amount`  
  **MySession** -> Session id of the profile (if you dont know where to find it open Profiles folder in server and name of the folder is session id)  
  **TemplateId** -> Its a template id of item you want to spawn (you can check id's here: https://eft.justemutarkov.eu/)  
  **Amount** -> Amount of items to spawn inside inventory

- Set Debug Session id
  _this option is used to test requests using web browser without setting the session id_  
  `/devSession switch SessionId`  
  **switch** -> value true or false to enable or disable this option  
  **SessionId** -> Value need to be a existing session id of the profile

- Soft Restart the server  
  _softly restarts the server variables_  
  `/restart`
