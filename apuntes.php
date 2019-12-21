<?php
	$variable = mysql_result(mysql_query($sql,$link),0,'campoBd');

	$sql = "SELECT LAST_INSERT_ID()";
	$id  = mysql_result(mysql_query($sql,$link),0,0);

	$var = mysql_insert_id($link);


	$varDelete = "DELETE
				FROM


							) AS x
					)";

	header('Access-Control-Allow-Origin: *'); //ACCESO DESDE MULTIPLES ORIGENES

	error_reporting(E_ALL);  //ACTIVA REPORTES DE ERRORES
	error_reporting(-1);  //ACTIVA REPORTES DE ERRORES
	ini_set('display_errors', '1');  //ACTIVA REPORTES DE ERRORES

	error_reporting(0);  //DESACTIVA REPORTES DE ERRORES

	//====================// ACTIVA REPORTES DE ERRORES //====================//
	ini_set('error_reporting', E_ALL);
    ini_set('display_errors', 1);

	//===============// RESTAR CARACTER DE STRING A LA DERECHA //===============//
	$var = substr($var, 0, -1);



	//=====================// FECHA FORMATO MYSQL //=====================//
    $fecha_actual = date('Y-m-d');

?>