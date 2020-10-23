const { compare } = require("bcryptjs");

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
        [1, 'one'], [2, 'two'], [3, 'three'], [4, 'four'],
       [5, 'five'],[6, 'six'],[7, 'seven'],[8, 'height'],
       [9, 'nine'],[10, 'ten'],[11, 'eleven'],[12, 'twelve'],
       [13, 'thirteen']
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
    onSuccess: function(data, textStatus, jqXHR) {
      console.log('onSuccess(data, textStatus, jqXHR)');
      console.log(data);
      console.log(textStatus);
      console.log(jqXHR);
      if(data.action =="delete"){
      //  $('#'+data.id).remove().class("table-danger")
      console.log(data.action)
      }
      
  },
  
  });

  table = $('#dataTable').DataTable();
});
