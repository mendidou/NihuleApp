// Call the dataTables jQuery plugin
$(document).ready(function() {
  $('#dataTable').DataTable();

  
    // example.php will be used to send the data to the sever database
    $('#dataTable').Tabledit({
    url: 'login',
    editButton: true,
    deleteButton: true,
    hideIdentifier: false,
    columns: {
    identifier: [0, 'id'],
    editable: []
    }
    });
    
});
