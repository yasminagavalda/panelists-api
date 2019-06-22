const alasql = require('alasql');

alasql('CREATE TABLE panelists (gender number, area number, profile number)');

console.log('Loading data from XLSX in memory...');

alasql.promise('SELECT * FROM XLSX("data/panelist_data.xlsx")').then(data => {
  data.forEach(panelist => {
    alasql(
      `INSERT INTO panelists VALUES (${panelist.gender}, ${panelist.area}, ${panelist.profile})`
    );
  });
  console.log('Data loaded!');
});
