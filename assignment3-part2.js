window.onload = function() {
  //build favorites list from local storage
  var favsList = document.getElementById("favorites_list");
  
  for (var i = 0; i < localStorage.length; i++) {
    //create new dt element, text nodes with the text content for the dt, and hyperlink
    var listItem = document.createElement("dt");
    var itemLink = document.createElement("a");
	//use code from this site for accessing unknown key values:
	//http://stackoverflow.com/questions/26475040/how-do-i-get-the-key-value-when-retrieving-local-storage
    itemLink.href = localStorage.key(i);
    var itemText = document.createTextNode(localStorage.getItem(localStorage.key(i)));

    //create a button to append to the dt which calls removeFromFavs() when clicked
    var removeFromFavsButt = document.createElement('input');
    removeFromFavsButt.setAttribute('type', 'button');
    removeFromFavsButt.setAttribute('value', 'Remove Gist from Favorites');
  
    //append the text node to the hyperlink, then append the hyperlink and button to the dt, then append the dt to the dl
    itemLink.appendChild(itemText);
    listItem.appendChild(itemLink);
    removeFromFavsButt.onclick = function() {removeFromFavs(this.parentElement)};
    listItem.appendChild(removeFromFavsButt);
    favsList.appendChild(listItem);
  }
}

function searchGitHub() {
  //get reference for the search results dl
  var resultsList = document.getElementById("results_list");
  
  //clear the existing search results
  clearResults(resultsList);
  
  //grab value from num_pages drop down <select> to run a loop of GET requests. Referenced below webpage for code: //http://stackoverflow.com/questions/1085801/get-selected-value-of-dropdownlist-using-javascript
  var numPageSelect = document.getElementById("num_pages");
  var numPages = numPageSelect.options[numPageSelect.selectedIndex].value;
  var url = 'https://api.github.com/gists/public';
  
  for (var i = 1; i <= numPages; i++) { //Make a GET request for each page of results selected by user
    //baseline url at beginning of each loop without page number
    var url = 'https://api.github.com/gists/public?page=';
    //append url with appropriate page number. NOTE: i starts at 1 so simply add i
	url += i;
  
    //Send a GET request to GitHub
    var GitHubRequest = new XMLHttpRequest();
    GitHubRequest.open('GET', url, true);
    GitHubRequest.send();
    GitHubRequest.onreadystatechange = alertContents;
  }
}  
  
function clearResults(results) {
  var length = results.childNodes.length;
  for (var j = 0; j < length; j++) {
    results.removeChild(results.childNodes[0]);
  }
}

function addToFavs(item) {
  //get reference for the results dl and the favorites dl
  var resultsList = document.getElementById("results_list");
  var favsList = document.getElementById("favorites_list");
  
  //save the passed dt to local storage
  localStorage.setItem(item.childNodes[0].href, item.childNodes[0].innerHTML);
  
  //create new dt element, text nodes with the text content for the dt, and hyperlink
  var listItem = document.createElement("dt");
  var itemLink = document.createElement("a");
  itemLink.href = item.childNodes[0].href;
  var itemText = document.createTextNode(item.childNodes[0].innerHTML);

  //create a button to append to the dt which calls removeFromFavs() when clicked
  var removeFromFavsButt = document.createElement('input');
  removeFromFavsButt.setAttribute('type', 'button');
  removeFromFavsButt.setAttribute('value', 'Remove Gist from Favorites');
  
  //append the text node to the hyperlink, then append the hyperlink and button to the dt, then append the dt to the dl
  itemLink.appendChild(itemText);
  listItem.appendChild(itemLink);
  removeFromFavsButt.onclick = function() {removeFromFavs(this.parentElement)};
  listItem.appendChild(removeFromFavsButt);
  favsList.appendChild(listItem); 
  
  //remove node from results list
  resultsList.removeChild(item);/*resultsList.childNodes[i]*/
}

function removeFromFavs(item) {
  var favsList = document.getElementById("favorites_list");
  
  //clear item out of local storage
  localStorage.removeItem(item.childNodes[0].href);
  
  //remove item from favorties list
  favsList.removeChild(item);
}

function alertContents() {
  if (this.readyState === 4) {
    if (this.status === 200) { //returned ok
	  var content = new Array(90);
	  var response = JSON.parse(this.responseText);
	  for (var i = 0; i < 30; i++) {
	    var index1 = 3;
	    index1 *= i;
		index2 = index1;
		index2 += 1;
		index3 = index1;
		index3 += 2;
	    content[index1] = response[i].url;
		if (!response[i].description) {
		  content[index2] = 'Description was null';
		}
		else {
	      content[index2] = response[i].description;
		}
	    var fileList = response[i].files;
	    for (index in fileList) {
		  if (!fileList[index]['language']) {
		    content[index3] = 'Language was null';
	      }
		  else {
		    content[index3] = fileList[index]['language'];
		  }
		}
	  }
      createResultList(content);
    }
    else {
      alert("There was a problem with the request.");
    }
  }
}  

function createResultList(array) { //create dt's using the parsed content from GitHub and add to the Search Results dl
  //get reference for the search results dl
  var resultsList = document.getElementById("results_list");
  
  //create variable for checking if new link is already in favorites
  var inFavs = false;
  var k = 1;
  
  //create variable to check if filters are needed and if so, create an array of language filters
  var languagesSelected = document.getElementsByTagName("input");
  var filters = new Array();
  var filterByLanguage = true;
  if ((languagesSelected[0].checked == false) && (languagesSelected[1].checked == false) && (languagesSelected[2].checked == false) && (languagesSelected[3].checked == false)) { //No filters selected
    filterByLanguage = false;
  }
  else { //language filters selected
	if (languagesSelected[0].checked == true) {
	  filters.push('Python');
	}
    if (languagesSelected[1].checked == true) {
	  filters.push('JSON');
	}
	if (languagesSelected[2].checked == true) {
	  filters.push('JavaScript');
	}
	if (languagesSelected[3].checked == true) {
	  filters.push('SQL');
	}
  }	
	
  for (var i = 0; i < 90; i+=3) { 
    //check if new link is already in favorites
	inFavs = false;
	k = 1;
	k += i;
    for (var j = 0; j <= localStorage.length; j++) {
	  if (array[i] == localStorage.key(j)) {
	    inFavs = true;
	  }
	}
	if (inFavs == false) { //if not already in favorites create new dt elements, text nodes with the descriptions for the dts, and hyperlinks
	
	  //check if language meets the appropriate filters
	  if (filterByLanguage == true) { //at least one checkbox was checked
	    var languageIndex = 2;
		languageIndex += i;
	    for (var l = 0; l < filters.length; l++) { //loop through elements in filters array
		  if (array[languageIndex] == filters[l]) { //language matches filter so create new item for Results list
		    var listItem = document.createElement("dt");
            var itemLink = document.createElement("a");
            itemLink.href = array[i];
            var itemText = document.createTextNode(array[k]);

            //create a button to append to the dt which calls addToFavs when clicked. Help for how to wrap the button command to pass arguments from:
            // http://stackoverflow.com/questions/14034737/creating-a-button-dynamically-with-arguments-for-onclick
            var addToFavsButt = document.createElement('input');
            addToFavsButt.setAttribute('type', 'button');
            addToFavsButt.setAttribute('value', 'Add Gist to Favorites');
  
            //append the text node to the hyperlink, then append the hyperlink and button to the dt, then append the dt to the dl
            itemLink.appendChild(itemText);
            listItem.appendChild(itemLink);
            addToFavsButt.onclick = function() {addToFavs(this.parentElement)};
            listItem.appendChild(addToFavsButt);
            resultsList.appendChild(listItem);
	      }
		}
      }
	  else { //no checkboxes checked so no need to check filter. Just create new item for Results list. Code identical to above code for scenario when filters are passed.
        var listItem = document.createElement("dt");
        var itemLink = document.createElement("a");
        itemLink.href = array[i];
        var itemText = document.createTextNode(array[k]);

        //create a button to append to the dt which calls addToFavs when clicked. Help for how to wrap the button command to pass arguments from:
        // http://stackoverflow.com/questions/14034737/creating-a-button-dynamically-with-arguments-for-onclick
        var addToFavsButt = document.createElement('input');
        addToFavsButt.setAttribute('type', 'button');
        addToFavsButt.setAttribute('value', 'Add Gist to Favorites');
  
        //append the text node to the hyperlink, then append the hyperlink and button to the dt, then append the dt to the dl
        itemLink.appendChild(itemText);
        listItem.appendChild(itemLink);
        addToFavsButt.onclick = function() {addToFavs(this.parentElement)};
        listItem.appendChild(addToFavsButt);
        resultsList.appendChild(listItem);
	  }
    }
  }
}