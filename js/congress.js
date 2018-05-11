retrievePrevSearches();


function fetchDataQ() {
  var searchQuery = document.getElementById("searchBar").value;
  addToPreviousSearch(searchQuery)
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

function addToPreviousSearch(value) {
  var stringLength = document.getElementById("outputsearch").value.split(";").length;
  console.log(stringLength);
  //debugger;
  if (stringLength >= 6) {
    //  document.getElementById("outputsearch").value.split(";").shift();
    document.getElementById("outputsearch").value = document.getElementById("outputsearch").value.split(";").slice(1, 6).join(";");
    document.getElementById("outputsearch").value += value + ';';
    localStorage.setItem("searchItems", document.getElementById("outputsearch").value);
  } else {
    document.getElementById("outputsearch").value += value + ';';
    localStorage.setItem("searchItems", document.getElementById("outputsearch").value);
  }


}

function retrievePrevSearches() {


  document.getElementById("outputsearch").value = localStorage.searchItems;


}


function buildTheGrid(myJson) {
  var dataTable = document.getElementById("dataTable");
  var newArr = myJson.results[0].bills;
  //debugger;

  for (var i = 0; i < newArr.length; i++) {
    var domAddition = document.createElement('tr');
    var column1 = document.createElement('td');
    var column2 = document.createElement('td');
    var column3 = document.createElement('td');
    var column4 = document.createElement('td');
    var column5 = document.createElement('td');
    var column6 = document.createElement('td');
    var column7 = document.createElement('td');
    var createAHRef = document.createElement('a');

    column1.innerHTML = newArr[i].short_title;
    column2.innerHTML = newArr[i].primary_subject;
    column3.innerHTML = newArr[i].summary;

    column4.innerHTML = newArr[i].sponsor_title +' '+ newArr[i].sponsor_name + ' of ' + newArr[i].sponsor_state + '(' + newArr[i].sponsor_party + ')';

    createAHRef.setAttribute('href', newArr[i].govtrack_url);
    var AHrefText = document.createTextNode(newArr[i].govtrack_url);

    createAHRef.appendChild(AHrefText);
      column5.appendChild(createAHRef);
    column6.innerHTML =  newArr[i].active + ' / ' + newArr[i].enacted + ' / ' + newArr[i].vetoed;


    var totalCosponsor = newArr[i].cosponsors;
    var biPartisanAvg = 0;

    if (newArr[i].cosponsors_by_party.D !== undefined) {
      biPartisanAvg += newArr[i].cosponsors_by_party.D;
    }
    if (newArr[i].cosponsors_by_party.R !== undefined) {
      biPartisanAvg += newArr[i].cosponsors_by_party.R;
    }

    biPartisanAvg = biPartisanAvg / 2;



    var billAction = 0;
    //debugger;
    if (newArr[i].enacted) {
      billAction += 8;
    }

    if (newArr[i].house_passage == true) {
      billAction += 5;
    }

    if (newArr[i].senate_passage == true) {
      billAction += 5;
    }


    if (newArr[i].active) {
      billAction += 2;
    }

    if (totalCosponsor == null) {
      totalCosponsor = 0;
    }

    if (biPartisanAvg == null) {
      biPartisanAvg = 0;
    }

    var relevancy = totalCosponsor + biPartisanAvg + (billAction * 5);

    column7.innerHTML = relevancy;


    domAddition.append(column1);
    domAddition.append(column2);
    domAddition.append(column3);
    domAddition.append(column4);
    domAddition.append(column5);
    domAddition.append(column6);
    domAddition.append(column7);

    dataTable.appendChild(domAddition);
  }



}

function clearTheGrid() {
  document.getElementById("dataTable").innerHTML = "";
  var domAddition = document.createElement('tr');
  var column1 = document.createElement('th');
  var column2 = document.createElement('th');
  var column3 = document.createElement('th');
  var column4 = document.createElement('th');
  var column5 = document.createElement('th');
  var column6 = document.createElement('th');
  var column7 = document.createElement('th');


  column1.innerHTML = 'Title';
  column2.innerHTML = 'Primary Subject';
  column3.innerHTML = 'Summary';
  column4.innerHTML = 'Sponsor';
  column5.innerHTML = 'Full Text';
  column6.innerHTML = 'Active/Enacted/Vetoed';
  column7.innerHTML = 'Relevancy';


  domAddition.append(column1);
  domAddition.append(column2);
  domAddition.append(column3);
  domAddition.append(column4);
  domAddition.append(column5);
  domAddition.append(column6);
  domAddition.append(column7);

  dataTable.appendChild(domAddition);
}
