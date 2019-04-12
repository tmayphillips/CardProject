var current_page = 1
var records_per_page = 10
let searchTerm = ''
let objJson=[]

function loadCollection() {
  // objJson=[]
  let link = "http://localhost:3000/view-collection"

  fetch(link)
    .then(function(response) {
      return response.json()
    })
    .then(function(myJson) {
      objJson.push(myJson)
    })
  setTimeout(function(){changePage(1)}, 3000);
}
loadCollection()
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
  collectionTable.innerHTML = ''
  for (var i = (page-1) * records_per_page; i < (page * records_per_page) && i < objJson[0].cards.length; i++) {
    collectionTable = document.getElementById('collectionTable')
    collectionTable.innerHTML += `
      <li><img src = '${objJson[0].cards[i][0].imageUrl}' onerror="this.onerror=null;this.src='https://i.imgur.com/9nWVEqy.jpg'" /></a>
      </li><br>`
    }


  if (page) {
      btn_prev.style.visibility = "visible"
  }
}

function numPages() {
    return Math.ceil(objJson[0].cards.length / records_per_page)
}
