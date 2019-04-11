
// let searchTextArea = document.getElementById("searchTextArea")
// let searchButton = document.getElementById("searchButton")
// let pageNoHiddenField = document.getElementById("pageNoHiddenField")
// let link = ''
// // let searchTerm = ''
// searchButton.addEventListener('click',() => {
//
//   link = `http://localhost:3000/view-card?search=${searchTerm}`
//   let pageNumber = pageNoHiddenField.value
//   searchTerm = searchTextArea.value
//   console.log(searchTerm)
//   window.location.href = `/view-card?search=${searchTerm}`
// })

var current_page = 1
var records_per_page = 10

let searchTextArea = document.getElementById("searchTextArea")
let searchButton = document.getElementById("searchButton")
let pageNoHiddenField = document.getElementById("pageNoHiddenField")
let searchTerm = ''
let objJson=[]

searchButton.addEventListener('click',() => {
  searchTerm = searchTextArea.value
  // link = `http://localhost:3000/view-card?search=${searchTerm}`

  console.log(searchTerm)
  // window.location.href = `/search-cards`
  // window.location.href = `/view-card?search=${searchTerm}`

console.log(searchTerm);
let link = "http://localhost:3000/view-card?search=" + searchTerm

fetch(link)
  .then(function(response) {
    return response.json()
  })
  .then(function(myJson) {
    console.log(myJson);
    objJson.push(myJson)
  })

  setTimeout(function(){changePage(1)}, 3000);
})


function prevPage()
{
    if (current_page > 1) {
        current_page--;
        changePage(current_page);
    }
}

function nextPage()
{
    if (current_page < numPages()) {
        current_page++;
        changePage(current_page);
    }
}

function changePage(page)
{
    var btn_next = document.getElementById("btn_next");
    var btn_prev = document.getElementById("btn_prev");
    var listing_table = document.getElementById("listingTable");
    var page_span = document.getElementById("page");

    // Validate page
    if (page < 1) page = 1;
    if (page > numPages()) page = numPages();

    for (var i = (page-1) * records_per_page; i < (page * records_per_page) && i < objJson[0].cards.length; i++) {

      listingTable = document.getElementById('listingTable')

        listingTable.innerHTML += `<li><img src = '${objJson[0].cards[i].imageUrl}' alt='${objJson[0].cards[i].name}' /></a><form action='/add-collection' method="POST">
            <button type="submit">Add to Collection</button>
        </form>
        <form action='/add-wishlist' method="POST">
            <button type="submit">Add to Wish List</button>
        </form></li>` + "<br>";
    }
    page_span.innerHTML = page;

    if (page) {
        btn_prev.style.visibility = "visible";
    }
}

function numPages()
{
    return Math.ceil(objJson[0].cards.length / records_per_page);
}
