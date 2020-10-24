// Call the dataTables jQuery plugin
var table
$(document).ready(function () {
  
  // example.php will be used to send the data to the sever database
  $('#dataTable').Tabledit({
    url: 'dailyReport',
    editButton: false,
    deleteButton: true,
    hideIdentifier: true,
    restoreButton:false,
  

    columns: {
      identifier: [0, 'id'],
      editable: [
        [1, 'date'], [2, 'credit'], [3, 'debit'], [4, 'apt'],
       [5, 'name'],[6, 'receipt'],[7, 'forsomeone'],[8, 'details'],
       [9, 'paymenttype'],[10, 'provider'],[11, 'differentsprovider'],
       [12, 'detailsdiferentProviders'], [13, 'remarks']
      ]
    },
    buttons: {
      edit: {
          action: 'edit',
          html:'edit'
      },
      delete: {
            action: 'delete',
            html:'delete'
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

    onAjax:function(action,serialize){
      console.log(action)
      console.log(serialize);
      return true
    }
  
    
  });

  table = $('#dataTable').DataTable();
});


function validatedate(inputText)
  {
  var dateformat = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
  // Match the date format through regular expression
  if(inputText.value.match(dateformat))
  {
  document.form1.text1.focus();
  //Test which seperator is used '/' or '-'
  var opera1 = inputText.value.split('/');
  var opera2 = inputText.value.split('-');
  lopera1 = opera1.length;
  lopera2 = opera2.length;
  // Extract the string into month, date and year
  if (lopera1>1)
  {
  var pdate = inputText.value.split('/');
  }
  else if (lopera2>1)
  {
  var pdate = inputText.value.split('-');
  }
  var dd = parseInt(pdate[0]);
  var mm  = parseInt(pdate[1]);
  var yy = parseInt(pdate[2]);
  // Create list of days of a month [assume there is no leap year by default]
  var ListofDays = [31,28,31,30,31,30,31,31,30,31,30,31];
  if (mm==1 || mm>2)
  {
  if (dd>ListofDays[mm-1])
  {
  alert('Invalid date format!');
  return false;
  }
  }
  if (mm==2)
  {
  var lyear = false;
  if ( (!(yy % 4) && yy % 100) || !(yy % 400)) 
  {
  lyear = true;
  }
  if ((lyear==false) && (dd>=29))
  {
  alert('Invalid date format!');
  return false;
  }
  if ((lyear==true) && (dd>29))
  {
  alert('Invalid date format!');
  return false;
  }
  }
  }
  else
  {
  alert("Invalid date format!");
  document.form1.text1.focus();
  return false;
  }
  }
