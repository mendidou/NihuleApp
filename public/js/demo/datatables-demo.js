// Call the dataTables jQuery plugin
$(document).ready(function() {
  // $('#dataTable').DataTable();

  
    // // example.php will be used to send the data to the sever database
    // $('#dataTable').Tabledit({
    // url: 'login',
    // editButton: false,
    // deleteButton: false,
    // hideIdentifier: false,
    // columns: {
    // identifier: [0, 'id'],
    // editable: [[0, 'first'],[1, 'second'],[2, 'third'],[3, 'firth'],[4, 'fiveth'] ]
    // }
    // });
    var editor = new $.fn.dataTable.Editor( {
      ajax:  'login',
      table: '#dataTable',
      fields: [
          { label: 'First name', name: 'first_name' },
          { label: 'Last name',  name: 'last_name'  },
          // etc
      ]
  } );

  $('#dataTable').DataTable( {
    ajax: 'login',
    dom: 'Bfrtip',
    columns: [
        { data: 'first_name' },
        { data: 'last_name' },
        // etc
    ],
    select: true,
    buttons: [
        { extend: 'create', editor: editor },
        { extend: 'edit',   editor: editor },
        { extend: 'remove', editor: editor }
    ]
} );
    
});
