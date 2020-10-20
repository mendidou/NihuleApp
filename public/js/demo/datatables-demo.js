// Call the dataTables jQuery plugin
$(document).ready(function() {
  $('#dataTable').DataTable();

  
    // example.php will be used to send the data to the sever database
    $('#dataTable').Tabledit({
    url: 'users',
    editButton: true,
    deleteButton: true,
    hideIdentifier: true,
    columns: {
    identifier: [0, 'id'],
    editable: [[2, 'first'], [3, 'last'],[3, 'nickname']]
    }
    });
    
});
