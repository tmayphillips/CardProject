

var current_page = 1
var records_per_page = 6

const urlParams = new URLSearchParams(window.location.search)
console.log(urlParams.get("search"))

let link = "http://localhost:3000/view-card?search=squee"
let objJson=[]
fetch(link)
  .then(function(response) {
    return response.json()
  })
  .then(function(myJson) {
    objJson.push(myJson)
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

        listingTable.innerHTML += `<li><img src = '${objJson[0].cards[i].imageUrl}' alt='blank image' /></a><form action='/add-collection' method="POST">
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

window.onload = function() {
    setTimeout(function(){ changePage(1)}, 500)
};
