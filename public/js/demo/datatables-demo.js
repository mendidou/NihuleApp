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
      console.log(serialize)
    }
  
    
  });

  table = $('#dataTable').DataTable();
});
