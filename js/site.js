var current_page = 1
var records_per_page = 10
let searchTextArea = document.getElementById("searchTextArea")
let searchButton = document.getElementById("searchButton")
let searchTerm = ''
let objJson=[]

searchButton.addEventListener('click',() => {
  searchTerm = searchTextArea.value
  objJson=[]
  let link = "http://localhost:3000/view-card?search=" + searchTerm

  fetch(link)
    .then(function(response) {
      return response.json()
    })
    .then(function(myJson) {
      console.log(myJson);
      objJson.push(myJson)
    })
    // window.location.href('http://localhost:3000/search-cards')
  setTimeout(function(){changePage(1)}, 5000);
})

function prevPage() {
  if (current_page > 1) {
      current_page--;
      changePage(current_page);
  }
}

function nextPage() {
  if (current_page < numPages()) {
      current_page++;
      changePage(current_page);
  }
}

function changePage(page) {
  var btn_next = document.getElementById("btn_next");
  var btn_prev = document.getElementById("btn_prev");
  var listing_table = document.getElementById("listingTable");
  var page_span = document.getElementById("page");

  if (page < 1) page = 1;
  if (page > numPages()) page = numPages();
  listingTable.innerHTML = ''
  for (var i = (page-1) * records_per_page; i < (page * records_per_page) && i < objJson[0].cards.length; i++) {

  listingTable = document.getElementById('listingTable')
  listingTable.innerHTML += `
    <li class='card-display'><img class='card-size' src = '${objJson[0].cards[i].imageUrl}' onerror="this.onerror=null;this.src='null-img.png'" /></a>
    <form action='/add-collection' method="POST">
    <input type="hidden" name="multiverseid" value='${objJson[0].cards[i].multiverseid}' />
    <input type='hidden' name='userId' value='${objJson[0].userId}' />
     <button type="submit">Add to Collection</button>
   </form>
   <form action='/add-wishlist' method="POST">
   <input type="hidden" name="multiverseid" value='${objJson[0].cards[i].multiverseid}' />
    <input type='hidden' name='userId' value='${objJson[0].userId}' />
     <button type="submit">Add to Wish List</button>
   </form></li><br>`
  }
  page_span.innerHTML = page;

  if (page) {
      btn_prev.style.visibility = "visible";
  }
}

function numPages() {
    return Math.ceil(objJson[0].cards.length / records_per_page);
}
