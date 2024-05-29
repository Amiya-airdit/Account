namespace Pratham;
 
//[Departments] table:-
 
entity Departments {
key name : String;
// groupadminList : array of String;
// isMdpeQU : Boolean;
// isSteelQU : Boolean;
// isQUAssigned : Boolean;
postalcode : String;
applicationType : String;
// mapType : String;
createdDateTime : String;
isDeleted : Boolean default false;
description : String;
isActive : Boolean default true;
createdBy : String; //This field we added extra to match like MockUp.
}