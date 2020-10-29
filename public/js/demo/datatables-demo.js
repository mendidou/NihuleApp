// Call the dataTables jQuery plugin
var table
$(document).ready(function () {

  // example.php will be used to send the data to the sever database
  $('#dataTable').Tabledit({
    url: 'updateDailyReport',
    editButton: false,
    deleteButton: true,
    hideIdentifier: true,
    restoreButton: false,


    columns: {
      identifier: [0, 'id'],
      editable: [
        [1, 'date'], [2, 'credit'], [3, 'debit'], [4, 'apt'],
        [5, 'name'], [6, 'receipt'], [7, 'forsomeone'], [8, 'details'],
        [9, 'paymenttype', '{"transfer":"transfer","cash": "cash" ,"check":"check"}'], [10, 'provider'], [11, 'differentsprovider'],
        [12, 'detailsdiferentProviders'], [13, 'remarks']
      ]
    },
    buttons: {
      edit: {
        action: 'edit',
        html: 'edit'
      },
      delete: {
        class:"btn btn-outline-danger",
        action: 'delete',
        html: 'delete'
      },
      save: {
        class: 'btn btn-sm btn-success',
        html: 'Save'
      },
      restore: {
        class: 'btn btn-sm btn-warning',
        html: 'Restore',
        action: '/'
      },
      confirm: {
        class: 'btn btn-sm btn-danger comfirme',
        html: 'Confirm'
      }
    },

    onAjax: function (action, serialize) {
      var result = urlEncodedStringToObject(serialize)
      if (result["date"]) {
        return validatedate(result["date"])
      }
      else if (result["credit"] || result["debit"] || result["apt"] || result["receipt"]) {
        var resultsArr = ["credit", "debit", "apt", "receipt"]
        var isnumber =false;
        var result = resultsArr.forEach(name => {
          if (result[name]) {
            if (!isNaN(result[name])) { 
              isnumber=true
            }
            else {
              alert("this is not a good format please write a number")
            }
          } 
        })
        return isnumber
      } else {
        return true
      } 
    }


  });

  table = $('#dataTable').DataTable();
});


function validatedate(inputText) {

  var dateformat = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
  // Match the date format through regular expression
  if (inputText.match(dateformat)) {

    //Test which seperator is used '/' or '-'
    var opera1 = inputText.split('/');
    var opera2 = inputText.split('-');
    lopera1 = opera1.length;
    lopera2 = opera2.length;
    // Extract the string into month, date and year
    if (lopera1 > 1) {
      var pdate = inputText.split('/');
    }
    else if (lopera2 > 1) {
      var pdate = inputText.split('-');
    }
    var dd = parseInt(pdate[0]);
    var mm = parseInt(pdate[1]);
    var yy = parseInt(pdate[2]);
    // Create list of days of a month [assume there is no leap year by default]
    var ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (mm == 1 || mm > 2) {
      if (dd > ListofDays[mm - 1]) {
        alert('Invalid date format!');
        return false;
      }
    }
    if (mm == 2) {
      var lyear = false;
      if ((!(yy % 4) && yy % 100) || !(yy % 400)) {
        lyear = true;
      }
      if ((lyear == false) && (dd >= 29)) {
        alert('Invalid date format!');
        return false;
      }
      if ((lyear == true) && (dd > 29)) {
        alert('Invalid date format!');
        return false;
      }
    }
  } 
  else {
    alert("Invalid date format!");
    return false;
  }
}

function urlEncodedStringToObject(string) {

  var result = {}
  var queriesObject = string.split('&')
  queriesObject.forEach(function (query) {
    query = query.split('=');
    result[query[0]] = decodeURIComponent(query[1] || '');

  });
  return result
}

  $('.openmodal').click(function (e) {
    e.preventDefault();
    var tr = $(this).closest('tr')
  
       modal = $('#showdetailsmodal');
       $('.id').val(tr.data('id'));
       $('.date').val(tr.data('date'));
       $('.credit').val(tr.data('credit'));
       $('.debit').val(tr.data('debit'));
       $('.apt').val(tr.data('apt'));
       $('.name').val(tr.data('name'));
       $('.receipt').val(tr.data('receipt'));
       $('.forsomeone').val(tr.data('forsomeone'));
       $('.details').val(tr.data('details'));
       $('.paymenttype').html(tr.data('paymenttype'))
       $('.provider').val(tr.data('provider'));
       $('.detailsdiferentproviders').val(tr.data('detailsdiferentproviders'));
       $('.differentsprovider').val(tr.data('differentsprovider'));
       $('.remarks').val(tr.data('remarks'));
       
       
       
  
    });

    function val(){
      var date = document.getElementById("date").value;
      var debit =document.getElementById("debit").value;
      var credit = document.getElementById("credit").value;
      var apt = document.getElementById("apt").value;
      var receipt =document.getElementById("receipt").value;
      var isDateValid = true
      var isNumberValide = true
    //if date is not empty

      if (date){
        isDateValid = validatedate(date.trim())
      }
      else {
        alert("date can't be empty")
      return false
      }
      if (isDateValid === false){
        return isDateValid
      }
      // if date is empty fill the date by an empty string
     

      if (debit){
        console.log(isNan(debit))
        if(!isNaN(debit)){
          alert( debit +"is not a valide format please whrite a number")
          return false
        }
      }
      if (credit){
        if(isNaN(credit)){
          alert( debit +"is not a valide format please whrite a number")
          return isNumberValide = false
        }
      }


      if (apt){
        if(isNaN(apt)){
          alert( debit +"is not a valide format please whrite a number")
          return isNumberValide = false
        }
      }
      if (receipt){
        if(isNaN(receipt)){
          alert( debit +"is not a valide format please whrite a number")
          return isNumberValide = false
        }

      }
   
    }

