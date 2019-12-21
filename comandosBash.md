<!-- https://stackedit.io/ editado en -->
# Comandos consola (Linux) PARA NOOBS!!

Hola, esta es una recopilación pequeña de comandos para noobs como yo, por eso de tallo aquí esto para luego venir a por ellos, espero que sirva así sea para al hacer esto recordarlos mas y que sirva al que se los encuentre buscando en mi repo! **otro noob?**.


# Comandos mas usados - instalación ~~de~~ ~~clientes~~

 - Buscando coincidencias entre logs.

> `cat /var/log/messages | grep -i [pptp]`
	El comando **cat**  lee datos de archivos y muestra sus contenidos,
	**/var/log/messages**  la ruta(path), [pptp] búsqueda relacionada a esta palabra, no escribir [ ], **grep**  busca en uno o más ficheros una cadena determinada de texto. Si encuentra la cadena nos indica donde está. Utilizando el parámetro ‘-i’ ignoramos la diferencia entre mayúsculas y minúsculas para esa búsqueda.
