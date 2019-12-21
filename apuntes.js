//--------------------------------------------- API HTML5 ------------------------------------------------//
//********************************************************************************************************//

	// FULLSCREEN --->
	// Debe ejecutarse cuando el usuario ejecuta una accion
	function launchFullScreen(element) {
		if(element.requestFullScreen) {
			element.requestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
		}
		else if(element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		}
		else if(element.webkitRequestFullScreen) {
			element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
		}
	}

	// ONLINE --->
	window.addEventListener('load', function() {
		var status = document.getElementById("status");

		function updateOnlineStatus(event) {
			var condition = navigator.onLine ? "online" : "offline";

			status.className = condition;
			status.innerHTML = condition.toUpperCase();

			log.insertAdjacentHTML("beforeend", "Event: " + event.type + "; Status: " + condition);
		}

		window.addEventListener('online',  updateOnlineStatus);
		window.addEventListener('offline', updateOnlineStatus);
	});

	//API NAVIGATOR
	navigator.appCodeName
	navigator.appName
	navigator.appVersion
	navigator.cookieEnabled
	navigator.language
	navigator.onLine
	navigator.platform
	navigator.userAgent
	navigator.systemLanguage

	// Ajax --->
	var xhr=new XMLHttpRequest();
	xhr.open('POST', 'http://prueba_json.aws.af.cm/index.php?fdwapi=1', true);

	xhr.onreadystatechange=function(){
	  if(xhr.readyState==4){

		// Parsear Response en XML --->
		var xmlDoc=new DOMParser().parseFromString(xhr.responseText,'text/xml');
		for(val in xhr.responseText){
			console.log(val);
		}

		// Parsear Response en Json --->
		var response=JSON.parse(xhr.responseText);
		for(val in response){
			console.log(response[val]);
		}
	  }
	  else return;
	}
	xhr.send(null);


//-------------------------------------------- API PHONEGAP ----------------------------------------------//
//********************************************************************************************************//

	navigator.app.backHistory();	//Devolver pagina de navegacion web
	navigator.app.exitApp();		//Salir de la app


//-------------------------------------------- API LIBJS ------------------------------------------------//
//*******************************************************************************************************//

	// JSON LUNGO --->
	$$(document).ready(function(event) {

		function ingresar_movil(){
			var success = false;
			var url = "http://localhost/lungo/example/servidor.php";

			var data = {
				usua_sinc : 'usuario',
				callback  : '?'
			};

			Lungo.Service.json(url, data, function(response) {

				success = true;
				if(response===false){
					Lungo.Notification.error('usuario y/o contraseña incorrectos', '', 'multiply', 3);
				}
				else{
					Lungo.Notification.hide();
					$$.each(response,function(i){
						if(response[i].servidor!=undefined){
							console.log("server undefined")
						}
						if(response[i].servidor==undefined){
							console.log('server Ok')
						}
					});
				}

			});

			// Establecer tiempo de espera para comprobar si hay errores
			setTimeout(function() {
			if (!success) { Lungo.Notification.error('Error al iniciar sesion', 'Verifique e intente nuevamente!', 'warning', 3); }
			},10000);
		}
	});

	// GETJSON JQUERY --->
	$.getJSON('http://localhost/lungo/example/servidor.php', {datos:'Darian Brown',accion:40}, function(response) {
		$.each(data, function(key, val) {
				alert(val['first_name']);
		});
		alert(response);
	});


	// AJAX QUO --->
	 function miFuncionAjax(){
		$$.ajax({
			type     : 'GET', // defaults to 'GET'
			url      : 'http://192.168.8.106/lungo/example/seridor.php',
			data     : { datos: '@soyjavi', cuenta: 'twitter' },
			dataType : 'json', //'json', 'xml', 'html', or 'text'
			async    : true,
			timeout  : 500,
			success  : function(response, xhr) { xhr.status!=200? msjErrorAjax() : alert(response); },
			error    : function(xhr, type) { msjErrorAjax(); }
		});
	}

	function msjErrorAjax(){
		Lungo.Notification.error('Error', 'No se puede estableser una conexion! <br/>Si el problema persiste comuniquese con el administrador del sistema', 'warning', 5);
	}


	// REEMPLAZAR CARACTERES NO PERMITIDOS EN CADENAS
	variable = variable.replace(/[\#\<\>\'\"]/g, '');


//===========================// TEXTO CAMPO SELECT //===========================//
//******************************************************************************//
	document.getElementById('idSelect').options[document.getElementById('idSelect').selectedIndex].text;


//==============================// OBJETO JSON //==============================//
//*****************************************************************************//
	var arrayCamposCcos = []; //DECLARO arrayCamposCcos
	function guardarDocumentoCosto(){
		var contCcos  = arrayCamposCcos.length;
		var objCostos = {};

		for(var idCcos=1; idCcos<= contCcos; idCcos++){
			objCostos[idCcos] = {
				valor  : "0",
				ccos   : "0",
				cuenta :
				{
					var1 : "0",
					var2 : "0",
				}
			};
		}

		objCostos = JSON.stringify(objCostos);
		console.log(objCostos);
	}


//======================// FUNCION PARA VALIDAR DECIMALES //======================//
//********************************************************************************//
	onkeyup="validarNumberReal(event,this)"
	function validarNumberReal(event,input){

		numero = input.value;
		tecla  = (input) ? event.keyCode : event.which;

		patron = /[^\d.]/g;
		if(patron.test(numero)){
			numero      = numero.replace(patron,'');
			input.value = numero;
		}

		if(numero=='')return;
		else if(isNaN(numero)){
			var acumValor   = '';
			var arrayNumero = numero.split('.');
			var contNumero  = arrayNumero.length;

			for(i=0; i<contNumero; i++){
				if(i==0){ acumValor+= arrayNumero[i]+'.'; continue; }
				acumValor+= ''+arrayNumero[i];
			}
			input.value = acumValor;
		}
	}

//=======================// FUNCION PARA VALIDAR ENTEROS //=======================//
//********************************************************************************//
	onkeyup="validarNumber(event,this)"
	function validarNumber(event,input){

		numero = input.value;
		tecla  = (input) ? event.keyCode : event.which;

		patron = /[^\d]/g;
		if(patron.test(numero)){
			numero      = numero.replace(patron,'');
			input.value = numero;
		}
	}

//==========================// EXPREIONES REGULARES //==========================//
//*******************************************************************************//
	patronNumber = /[^\d]/g //DIFERENTE A UN DIGITO
	patronString = /[^a-zA-Z\d\s]/g         //DIFERENTE A [a-z] Y [A-Z] Y DIGITO Y TEXTO

	/s => espacio en blanco

	// KEYCODE
	8  = Backspace
	9  = Tab
	13 = Enter
	46 = Suprimir
	37 = Row left
	38 = Row Top
	39 = Row Right
	40 = Row Botton
	18 = ALT
	16 = SHIFT
	17 = CTRL
	32 = Task Bar

//================================// JSON EN AJAX //================================//
//**********************************************************************************//
	ajaxinsertUpdateTercero();
	function ajaxinsertUpdateTercero(){
		var xhr  = new XMLHttpRequest()
		,   data = {
				apiVersion: "2",
				nit_empresa: "123456",
				username: "usuario.administracion",
				password: "123456789",
				tercero: {
					codigo_tipo_identificacion: "1",
					codigo_ciudad_identificacion: "7",
					numero_identificacion: "7300000",
					dv: "6",
					nombre: "JHON ERICK SAS",
					nombre_comercial: "JHON ERICK SAS",
					direccion: "calle 81",
					telefono1: "telefono 1",
					telefono2: "telefono 2",
					celular1: "celular 1",
					celular2: "celular 2",
					codigo_ciudad: "6",
					codigo_regimen: "3",
					cliente: "si",
					proveedor: "si",
					exento_iva: "no",
					nombre1: "JHON",
					nombre2: "",
					apellido1: "MARROQUIN",
					apellido2: ""
				}
			}

		var jsonString = JSON.stringify(data);

		xhr.open('POST','http://logicalsoft-erp.com/LOGICALERP/web_service/register.php', true);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded", true);
		xhr.onreadystatechange=function(){
			if(xhr.readyState==4){

				var response = xhr.responseText;
				if(response != ''){
					var objResponse = JSON.parse(response);
					if (objResponse['estado']=='true') { alert('Web service se ejecuto sactisfactoriamente'); }     //SE EJECUTO CORRECTAMENTE
					else{ alert('Error.\n'+objResponse['msj']); }               //MENSAJE ERROR EN PROCESOS DE SINCRONIZACION
				}
				else{ alert('Problema en la conexion'); }
			}
			else return;
		}
		xhr.send("dataJsonTerceros="+jsonString);
	}

//===================================// QUERY SELECTOR //==================================//
//*****************************************************************************************//
	var tagCode = document.querySelectorAll('pre code');

	[].forEach.call(tagCode,function(tag,indice,documento){
		hljs.highlightBlock(tag);
		console.log(tag);
	});

//================================// FUNCIONES OBSOLETAS //================================//
//*****************************************************************************************//
	// VALIDACION INPUT NUMBER
	document.getElementById("newCodigoItemPuc").onkeypress = function(event){ return changeCodigoInputItemPuc(event); };
	function changeCodigoInputItemPuc(e,input){
		tecla = (document.all) ? e.keyCode : e.which;

		if (tecla == 8 || tecla == 0 || tecla==37 || tecla==39) return true;        //TECLA " <- RETROCESO", "TAB"
		else if (tecla==13){ ComprobarNewCodigoItemGrilla(); BloqBtn(Ext.getCmp('btnComprobarNewCodigoItemPuc')); return; }

		patron    = /[\d]/;
		codeTecla = String.fromCharCode(tecla);

		document.getElementById('cuerpoInsertUpdateItemPuc').innerHTML = '';
		Ext.getCmp('btnGuardarItemPuc').disable();
		return patron.test(codeTecla);
	}

	// VALIDACION INPUT NUMBER REAL POSITIVO
	document.getElementById("idprueba").addEventListener('keyup',function(event,element,options){
		var valor = this.value;
		if(valor >= 0){ return; }
		else {
			var newStr = valor.substring(0, valor.length-1);
			this.value = newStr;
		}
	});


	//VALIDACION INPUT NUMBER
	document.getElementById("text").onkeypress = function(event){ return changeCodigoInputItemPuc(event,this); };
	function changeCodigoInputItemPuc(e,input){
		tecla = (document.all) ? e.keyCode : e.which;

		if (tecla == 8 || tecla == 0 || tecla==37 || tecla==39) return true;        //TECLA " <- RETROCESO", "TAB"
		else if (tecla==13){ return; }

		patron      = /[\d]/;
		patronPunto = /[.]/g;
		codeTecla   = String.fromCharCode(tecla);

		if(patron.test(codeTecla)){ return true; }
		else{
			if(patronPunto.test(codeTecla)){
				if(!isNaN(input.value+codeTecla)){ return true; }
			}
			return false;
		}
	}

	//VALIDAR NUMEROS REALES OBSOLETA
	document.getElementById("idInput").onkeypress = function(event){ return ValidarNumeroReal(event,this); };
	function ValidarNumeroReal(e,input) {
		tecla = input? e.keyCode : e.which;
		if (tecla == 8 || tecla == 0 || tecla==13 || tecla==37 || tecla==39) return true;        //TECLA " <- RETROCESO", "TAB", "ENTER"

		patron      = /[\d]/;
		patronPunto = /[.]/g;
		codeTecla   = String.fromCharCode(tecla);

		if(patron.test(codeTecla) || patronPunto.test(codeTecla) && !isNaN(input.value+codeTecla)){ return true; }  // TECLA == . Y VALUE == NUMBER
		return false;
	}

	// ARRAY UNICO EN JAVASCRIPT

	Array.prototype.unique=function(a){
		return function(){return this.filter(a)}}(function(a,b,c){return c.indexOf(a,b+1)<0
	});

		//USO
		var myArr = [ 1, 2, 3, 'foo', 'bar', 'Hello World', 2, 3, 'bar', 1, 4, 5];
		console.log( myArr.unique() ); // ["foo", "Hello World", 2, 3, "bar", 1, 4, 5]