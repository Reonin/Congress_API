retrievePrevSearches(); //pull previous searches from localStorage
addToPreviousSearch(); //when called without a paramter this displays the buttons for previous search

/** function called to get data from my own server that calls the congress API**/
function fetchDataQ() {
  var searchQuery = document.getElementById("searchBar").value;
  clearTheGrid();

  document.getElementsByClassName('loader')[0].style.display = 'inherit';

  addToPreviousSearch(searchQuery)
  if (searchQuery == null || searchQuery.length <= 0) {
    searchQuery = "";
  }

  fetch('/data?param=' + searchQuery)
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      document.getElementsByClassName('loader')[0].style.display = "none"; //turn off loading image
      buildTheGrid(myJson);
    });
}

/** Called by the previous search buttons passing their value as parameters in the search bar*/
function wipeSearchAndSearch(data) {
  document.getElementById('searchBar').value = data;
  fetchDataQ();
}

/**Function which adds previous search results to local storage as well as an invisible label for testing.
Checks if the previous searches are not greater than 5 if so add another value to the list in local storage
and if over capacity remove the first value from the list to keep it trimmed. finally generate the dynamic
buttons that allow you to retrieve previus search queries
 **/
function addToPreviousSearch(value) {
  var stringLength = document.getElementById("outputsearch").value.split(";").length;

  if (stringLength >= 6) {

    document.getElementById("outputsearch").value = document.getElementById("outputsearch").value.split(";").slice(1, 6).join(";");
    document.getElementById("outputsearch").value += value + ';';
    localStorage.setItem("searchItems", document.getElementById("outputsearch").value);
  } else {
    document.getElementById("outputsearch").value += value + ';';
    localStorage.setItem("searchItems", document.getElementById("outputsearch").value);
  }

  var buttonArray = document.getElementById("outputsearch").value.split(";");

  for (var i = 0; i < document.getElementById("outputsearch").value.split(";").length; i++) {
    if (buttonArray[i].length >= 1) {


      var prevSearchButton = document.createElement("INPUT");
      prevSearchButton.setAttribute("type", "button");
      prevSearchButton.setAttribute("value", buttonArray[i]);
      prevSearchButton.onclick = function() {
        wipeSearchAndSearch(this.value);
      }

      document.getElementById("buttonPlacement").appendChild(prevSearchButton);
    }
  }


}

/** pull previous searches from localStorage **/
function retrievePrevSearches() {
  document.getElementById("outputsearch").value = localStorage.searchItems;
}

/** Dynamically builds an html grid based on the data coming in from the search results
the function also builds out a relevancy field using the 3 crtieria mentionedi n the assignedment.
It grabs the total number of cosponsers adds the average of the cosponsors based on two policial
parties, Democrat and Republican  as well as well as a point system based on whether it's Active
whether it has been encated  and whether it's been passed between senate and house respectively
 **/
function buildTheGrid(myJson) {
  var dataTable = document.getElementById("dataTable");
  var billsArrayData = myJson.results[0].bills;

  for (var i = 0; i < billsArrayData.length; i++) {
    var domAddition = document.createElement('tr');
    var column1 = document.createElement('td');
    var column2 = document.createElement('td');
    var column3 = document.createElement('td');
    var column4 = document.createElement('td');
    var column5 = document.createElement('td');
    var column6 = document.createElement('td');
    var column7 = document.createElement('td');
    var createAHRef = document.createElement('a');

    column1.innerHTML = billsArrayData[i].short_title;
    column2.innerHTML = billsArrayData[i].primary_subject;
    column3.innerHTML = billsArrayData[i].summary;

    column4.innerHTML = billsArrayData[i].sponsor_title + ' ' + billsArrayData[i].sponsor_name + ' of ' + billsArrayData[i].sponsor_state + '(' + billsArrayData[i].sponsor_party + ')';

    createAHRef.setAttribute('href', billsArrayData[i].govtrack_url);
    createAHRef.setAttribute('target', '_blank');
    var AHrefText = document.createTextNode(billsArrayData[i].govtrack_url);

    createAHRef.appendChild(AHrefText);
    column5.appendChild(createAHRef);
    column6.innerHTML = billsArrayData[i].active + ' / ' + billsArrayData[i].enacted + ' / ' + billsArrayData[i].vetoed;


    var totalCosponsor = billsArrayData[i].cosponsors;
    var biPartisanAvg = 0;

    if (billsArrayData[i].cosponsors_by_party.D !== undefined) {
      biPartisanAvg += billsArrayData[i].cosponsors_by_party.D;
    }
    if (billsArrayData[i].cosponsors_by_party.R !== undefined) {
      biPartisanAvg += billsArrayData[i].cosponsors_by_party.R;
    }

    biPartisanAvg = biPartisanAvg / 2;



    var billAction = 0;
    //debugger;
    if (billsArrayData[i].enacted) {
      billAction += 8;
    }

    if (billsArrayData[i].house_passage == true) {
      billAction += 5;
    }

    if (billsArrayData[i].senate_passage == true) {
      billAction += 5;
    }


    if (billsArrayData[i].active) {
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



  applySorting();


}


/** A quick and dirty sollution for sorting the grid based on the relevancy data and more. A more elegant solution could be provided with more time **/
function applySorting() {
  const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;

  const comparer = (idx, asc) => (a, b) => ((v1, v2) =>
    v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
  )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

  // do the work...
  document.querySelectorAll('th').forEach(th => th.addEventListener('click', (() => {
    const table = th.closest('table');
    Array.from(table.querySelectorAll('tr:nth-child(n+2)'))
      .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
      .forEach(tr => table.appendChild(tr));
  })));


  document.getElementById('relevancy').click();
  document.getElementById('relevancy').click();
}

/**Clear out the grid data and the buttons for new dom writing**/
function clearTheGrid() {
  document.getElementById("dataTable").innerHTML = "";
  document.getElementById("buttonPlacement").innerHTML = "";


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
  column7.setAttribute('id', 'relevancy');

  domAddition.append(column1);
  domAddition.append(column2);
  domAddition.append(column3);
  domAddition.append(column4);
  domAddition.append(column5);
  domAddition.append(column6);
  domAddition.append(column7);

  dataTable.appendChild(domAddition);
}
