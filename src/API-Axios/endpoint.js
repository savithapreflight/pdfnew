 /* eslint-disable */

 const identityApi = '/Identity.API';
 const cstarApi = '/CSTAR.API';
 const loadsheet = '/lOADSHEET.API';
 
 export const apiKeys = {
   loginkey: identityApi + '/Authentication/Login',
   signupkey: identityApi + '/Authentication/register',
   personalDetailsKey: cstarApi + '/CrewPersonals/',
   rosterAppDetails: cstarApi + '/RosterAppDetails',
   loadsheet:'http://20.204.102.191/lnt.API/TrimSheet',
   pdfupload:'http://20.204.102.191/lOADSHEET.API/TrimSheet'
 
 };