
var formatDate = function() {
  return function(date, format) {
     if( date == undefined){
       return;
     }
     if( format == undefined){
       format='yyyy.MM.dd';
     }
     /*if( date.length < 7){
       date+= '01';
     }*/

     //var bDate = new Date(date.replace(pattern,'$1-$2-$3'));
     //var aDate = $filter('date')(bDate,format);
     if( date.length < 7){
      var pattern = /(\d{4})(\d{2})/;
      var aDate = date.replace(pattern,'$1-$2');
     }else{
      var pattern = /(\d{4})(\d{2})(\d{2})/;
      var aDate = date.replace(pattern,'$1-$2-$3');
     }
     return aDate;
   };
}

module.exports.formatDate = formatDate;

