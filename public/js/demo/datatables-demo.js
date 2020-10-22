// Call the dataTables jQuery plugin
$(document).ready(function () {
  
  // example.php will be used to send the data to the sever database
  $('#dataTable').Tabledit({
    url: 'dailyReport',
    editButton: false,
    deleteButton: true,
    hideIdentifier: true,

    columns: {
      identifier: [0, 'id'],
      editable: [[1, 'first'], [2, 'second'], [3, 'third'], [4, 'firth'], [5, 'fiveth']]
    },
    buttons: {
      edit: {
          action: '/',
          html:'edit'
      },
      delete: {
            action: '/',
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
        class: 'btn btn-sm btn-danger',
          html: 'Confirm'
      }
    }
  });

  $('#dataTable').DataTable();
});
