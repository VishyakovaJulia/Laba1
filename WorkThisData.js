function workWithXML(){

	var xml = new XMLHttpRequest();
	xml.open( 'GET', 'input.xml' , false );
	xml.send();
  	var pars = new DOMParser();
  	var info = pars.parseFromString( xml.responseText, 'text/xml' );
  	var infoList = info.getElementsByTagName( 'Parameter' );
	var row = '';
	for( var i = 0; i < infoList.length; i++ ){

		var value = infoList[i].getElementsByTagName( 'Value' )[0].textContent;
		var type = infoList[i].getElementsByTagName( 'Type' )[0].textContent;
		row += '<tr>';
		row += '<td>' + infoList[i].getElementsByTagName( 'Name' )[0].textContent; + '</td>';
		row += '<td>' + createValueField( type, value ) + '</td>';	
        row += '<td>' + infoList[i].getElementsByTagName( 'Description' )[0].textContent; + '</td>';		
		row += '<td><input  type=\'button\' value=\'Delete parametr\' width=\'40px\' onclick=\'deleteRow(this)\'></td>';
		row += '</tr>';
	}		
	document.getElementById( 'Info' ).innerHTML += row;
}

function createOutput()
{
	var info = document.getElementById( 'Info' );
	var rowsList = info.getElementsByTagName("tr");
	var output = '<?xml version=\"1.0\"?>\n';
	output += "<Parameters>\n";
	for( var i = 0; i < rowsList.length; i++ )
	{
		var fieldsList = rowsList[i].getElementsByTagName("td");
		output += "<Parameter>\n\r";
		output += "<Name>" + fieldsList[0].textContent + "</Name>\n";
		output += "<Type>" + getOutputType(fieldsList[1].childNodes[0].getAttribute("type")) + "</Type>\n";
		output += "<Description>" + fieldsList[2].textContent + "</Description>\n";
		output += "<Value>" + getOutputValue(fieldsList[1]) + "</Value>\n";
		output += "</Parameter>\n";
	}
	output += "</Parameters>";
	return output;
}

function createXML( name, type ) {
	
  var text = createOutput();
  var link = document.getElementById("download_link");
  var file = new Blob([text], {type: type});
  link.href = URL.createObjectURL(file);
  link.download = name;
  link.style.display = '';
}

function getOutputType( type ) {
	if (type=='text')
		return 'System.String';
	if (type=='checkbox')
		return 'System.Boolean';
	if (type=='number')
		return 'System.Int32';
	
		
	
}

function getOutputValue( field ){
	if( field.childNodes[0].getAttribute("type")=='text')
		return field.childNodes[0].value;
	if( field.childNodes[0].getAttribute("type")=='checkbox')
	{
		if ( field.childNodes[0].checked ) 
				return 'True';
			else 
				return 'False';
	}
	if( field.childNodes[0].getAttribute("type")=='number')
		return field.childNodes[0].value;

	
}


function createValueField( type, value ){
	if (type=='System.String')
		return '<input type=\'text\' maxlength="6" onchange="changeValueInField(this)" value=' + value + '>';
	if (type=='System.Boolean')
	{
		if ( value === 'False' )
				return '<input type=\'checkbox\' onchange="changeValueInField(this)" >';
			else
				return '<input type=\'checkbox\' onchange="changeValueInField(this)" checked>';
	}
	if (type=='System.Int32')
		return '<input type=\'number\' maxlength="6"  oninput="checkNumberInField(this);changeValueInField(this)" value=' + value + '>';
	
	
}

function valueFromNewField( type, field ){
	if (type=='System.String')
		return '<input type=\'text\'  onchange="changeValueInField(this)" value=' + field.value + '>';
	if (type=='System.Boolean')
	{
		if ( field.checked == false )
				return '<input type=\'checkbox\' onchange="changeValueInField(this)" >';
			else
				return '<input type=\'checkbox\' onchange="changeValueInField(this)" checked>';
	}
	if (type=='System.Int32')
		return '<input type=\'number\'  oninput="checkNumberInField(this);changeValueInField(this)" value=' + field.value + '>';
	
}

function changeFieldType( field ){
	var type = field.options[field.selectedIndex].value;
	var newValueField = document.getElementById('newValue');
 if (type == 'System.String')
 {
			newValueField.setAttribute('type', 'text');
			newValueField.removeAttribute('oninput');
 }
 if (type == 'System.Boolean')
 {
			newValueField.setAttribute('type', 'checkbox');
			newValueField.removeAttribute('oninput');
 }
 if (type == 'System.Int32')
 {
			newValueField.setAttribute('type', 'number');
			newValueField.setAttribute('oninput', 'checkNumberInField(this)');
 }
	
}

function addRow(){

	var selInd = document.getElementById('newType');
	var type = selInd.options[selInd.selectedIndex].value;
	var row = '';
	var field = document.getElementById('newValue');
   
	if (field.value.length === 0) 
{
	
	alert('Empty value "Enter value"!');
	field.style.borderColor = "white";
	return;
}

if (field.value.length <= 6)
{
	field.style.borderColor = "white";
	row += '<tr>';
	row += '<td>' + document.getElementById( 'newName' ).value + '</td>';
	row += '<td>' + valueFromNewField( type, field ) + '</td>';	
	row += '<td>' + document.getElementById( 'newDescription' ).value + '</td>';
	row += '<td><input  type=\'button\' value=\'Delete parametr\' width=\'40px\' onclick=\'deleteRow(this)\'></td>';
	row += '</tr>';
	document.getElementById( 'Info' ).innerHTML += row;
}
else {
	
	alert('Can not be more 6 sumbols!');
	 field.style.borderColor = "white";
}

        field.value='';
 
}


function deleteRow(d){

	var row = d.parentNode.parentNode;
	document.getElementById('Info').deleteRow(row.rowIndex);
	}


function changeValueInField( field ){
	var index1 = field.selectionStart;
	if ( field.getAttribute("type") === 'checkbox')
	{ 

        
		if( field.checked == true )
			field.setAttribute('checked', true);

		if( field.checked == false )
			field.removeAttribute('checked');
	}
	if ( field.getAttribute("type") === 'number')
	{

		if (field.value.length <= 6){
		field.setAttribute("value", field.value);

		}
	else {

	alert('Can not add value int more 6 sumbols!');
	 field.style.borderColor = "white";
	 field.value='';

	}

	
		field.selectionStart = index1-1;
           field.selectionEnd = index1-1;

	}
}

function checkNumberInField( field ){	
var index = field.selectionStart;
	var regular = new RegExp("(^([+-]?)([1-9]+?)[0-9]*$)|^0$");

    if (!regular.test(field.value) )
	{ 
		field.value = field.getAttribute('value');

	}
	
	field.selectionStart = index;
    field.selectionEnd = index;

}



