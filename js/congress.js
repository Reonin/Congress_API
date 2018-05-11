// fetch('https://api.propublica.org/congress/v1/?congress=115')
//   .then(function(response) {
//     return response.json();
//   })
//   .then(function(myJson) {
//     console.log(myJson);
//   });


//d4N939vQCEpESX9Hl6XyVBPoQ4Mge3icKys5WanZ



function fetchDataQ() {
  var searchQuery = document.getElementById("searchBar").value;

  if (searchQuery == null || searchQuery.length <= 0) {
    searchQuery = "";
  }

clearTheGrid();

  fetch('/data?param=' + searchQuery)
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      console.log(myJson);

      buildTheGrid(myJson);





    });
}

function buildTheGrid(myJson) {
  var dataTable = document.getElementById("dataTable");
  var newArr = myJson.results[0].bills;
  //debugger;

  for (var i = 0; i < newArr.length; i++) {
    var domAddition = document.createElement('div');
    var column1 = document.createElement('p');
    var column2 = document.createElement('p');
    var column3 = document.createElement('p');
    var column4 = document.createElement('p');
    var column5 = document.createElement('p');
    var column6 = document.createElement('p');
    var column7 = document.createElement('p');


    column1.innerHTML = newArr[i].short_title;
    column2.innerHTML = newArr[i].primary_subject;
    column3.innerHTML = newArr[i].summary;

    column4.innerHTML = newArr[i].sponsor_title + newArr[i].sponsor_name + ' of ' + newArr[i].sponsor_state + '(' + newArr[i].sponsor_party + ')';
    column5.innerHTML = newArr[i].govtrack_url;
    column6.innerHTML = 'Active? ' + newArr[i].active + ' Enacted? ' + newArr[i].enacted + ' Vetoed? ' + newArr[i].vetoed;


    var totalCosponser = newArr[i].cosponsors;
    var biPartisanAvg =  (newArr[i].cosponsors_by_party.D + newArr[i].cosponsors_by_party.R)/2 ; 
    column7.innerHTML = 'relevancy ' ;


    domAddition.append(column1);
    domAddition.append(column2);
    domAddition.append(column3);
    domAddition.append(column4);
    domAddition.append(column5);
    domAddition.append(column6);

    dataTable.appendChild(domAddition);
  }



}

function clearTheGrid() {
  document.getElementById("dataTable").innerHTML = "";

}
