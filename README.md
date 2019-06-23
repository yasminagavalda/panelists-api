# panelists-api

This repository contains local web API that provide the available sample of panelists for a given profile and quotas.

If you download this folder, do first npm install.

To run this code do npm start.

There is one endpoint:

http://localhost:3000/feasibility/{profile_code}
?gender[male]={male_quota}&gender[female]={female_quota}&area[noreste]={noreste_quota}&area[levante]={levante_quota}&area[sur]={sur_quota}&area[centro]={centro_quota}

To this endpoint you have to add query params to filter the results:

'gender[male]': to filter by male gender quota
'gender[female]': to filter by female gender quota
'area[noreste]': to filter by noreste area quota
'area[levante]': to filter by levante area quota
'area[sur]': to filter by sur area quota
'area[centro]': to filter by centro area quota

Examples of use:
http://localhost:3000/feasibility/2?gender[male]=40&gender[female]=60&area[noreste]=50&area[levante]=25&area[sur]=25
http://localhost:3000/feasibility/1?gender[female]=100&area[noreste]=25&area[levante]=25&area[sur]=25&area[centro]=25
