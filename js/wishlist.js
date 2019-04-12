var current_page = 1
var records_per_page = 10
let searchTerm = ''
let objJson=[]

function loadWishlist() {
  // objJson=[]
  let link = "http://localhost:3000/view-wishlist"

  fetch(link)
    .then(function(response) {
      return response.json()
    })
    .then(function(myJson) {
      objJson.push(myJson)
    })
  setTimeout(function(){changePage(1)}, 3000);
}
loadWishlist()
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
  var btn_next = document.getElementById("btn_next")
  var btn_prev = document.getElementById("btn_prev")
  var page_span = document.getElementById("page");

  if (page < 1) page = 1;
  if (page > numPages()) page = numPages()
  wishlistTable.innerHTML = ''
  for (var i = (page-1) * records_per_page; i < (page * records_per_page) && i < objJson[0].cards.length; i++) {
    wishlistTable = document.getElementById('wishlistTable')
    wishlistTable.innerHTML += `
      <li><img src = '${objJson[0].cards[i][0].imageUrl}' alt='${objJson[0].cards[i][0].name}' /></a>
      </li><br>`
    }

  if (page) {
      btn_prev.style.visibility = "visible"
  }
}

function numPages() {
    return Math.ceil(objJson[0].cards.length / records_per_page)
}
