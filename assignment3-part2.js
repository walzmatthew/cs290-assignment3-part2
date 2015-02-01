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
  
  //grab value from num_pages drop down <select>. Referenced below webpage for code: //http://stackoverflow.com/questions/1085801/get-selected-value-of-dropdownlist-using-javascript
  var numPageSelect = document.getElementById("num_pages");
  var numPages = numPageSelect.options[numPageSelect.selectedIndex].value;
  
  //create variables for checking if new link is already in favorites
  var inFavs = false;
  var string = "string"
  
  for (var i = 0; i < numPages; i++) {
    //check if new link is already in favorites
	inFavs = false;
    string = "http://www.google.com" + i + "/";
	console.log(string);
    for (var j = 0; j < localStorage.length; j++) {
	  console.log(localStorage.key(j));
	  if (string == localStorage.key(j)) {
	    inFavs = true;
	  }
	}
	if (inFavs == false) {
      //create new dt elements, text nodes with the text content for the dts, and hyperlinks
      var listItem = document.createElement("dt");
      var itemLink = document.createElement("a");
      itemLink.href = "http://www.google.com" + i;

      var itemText = document.createTextNode("item #" + i);

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