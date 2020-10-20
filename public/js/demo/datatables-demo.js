// Call the dataTables jQuery plugin
$(document).ready(function() {
  var dataTable = $('#dataTable').DataTable();

   /* Apply the jEditable handlers to the table */
   dataTable.$('td').editable( '#', {
    "callback": function( sValue, y ) {
        var dataPos = dataTable.fnGetPosition( this );
        dataTable.fnUpdate( sValue, dataPos[0], dataPos[1] );
    },
    "submitdata": function ( value, settings ) {
        return {
            "row_id": this.parentNode.getAttribute('id'),
            "column": dataTable.fnGetPosition( this )[2]
        };
    },
    "height": "14px",
    "width": "100%"
} );
});