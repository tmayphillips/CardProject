var express     = require('express');
var router      = express.Router();
var orm         = require('orm');
var totalRec = 0,
pageSize  = 6,
pageCount = 0;
var start       = 0;
var currentPage = 1;
var title  = 'NodeJs MySQL pagination example';
router.use(orm.express("mysql://root:@localhost:/onlinestore", {
  define: function (db, models, next) {
    models.cards = db.define("tbl_products", {
    multiverseid : Number
  });
  next();
  }
}));
router.get('/', function(req, res, next) {
  var result = req.models.cards.count({
  }, function(error, cardsCount){
      if(error) throw error;
       totalRec      = cardsCount;
        pageCount     =  Math.ceil(totalRec /  pageSize);

      if (typeof req.query.page !== 'undefined') {
            currentPage = req.query.page;
   }

     if(currentPage >1){

       start = (currentPage - 1) * pageSize;
    }

    var result = req.models.cards.find({},{limit: pageSize, offset: start}, function(error, cards){
        res.render('index', { data: products, pageSize: pageSize, pageCount: pageCount,currentPage: currentPage});
    });

  });
});
module.exports = router;
