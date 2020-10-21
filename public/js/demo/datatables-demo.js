// Call the dataTables jQuery plugin
$(document).ready(function () {
  $('#dataTable').DataTable();


  // example.php will be used to send the data to the sever database
  $('#dataTable').Tabledit({
    url: 'login',
    editButton: true,
    deleteButton: true,
    hideIdentifier: false,

    columns: {
      identifier: [0, 'id'],
      editable: [[0, 'first'], [1, 'second'], [2, 'third'], [3, 'firth'], [4, 'fiveth']]
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
            action: 'restore'
      },
      confirm: {
        class: 'btn btn-sm btn-danger',
          html: 'Confirm'
      }
    }

  });

  


});
