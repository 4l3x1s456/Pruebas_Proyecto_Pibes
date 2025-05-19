Instalacion del XAMPP 
* solo instalenlo

Uso del php de xampp
* se debe utilizar el php de xampp para iniciar el server para la conexion,
van a las variables de entorno, y en las variables del sistema, en path, colocan una nueva
que teniendo en cuenta que instalaron en la direccion por default seria "C:\xampp\php", sino les
tocaria colocar la variante de donde se instalo

Generacion del server de php
* Una vez hecho eso, abran un powershell y naveguen hasta donde este el proyecto,
peguen esto: "php -S localhost:8000", y verifiquen si funciona, abriendo el html y navegando
hacia "http://localhost:8000/index.html", que es donde se generaria el servidor

Base de datos
* La base de datos se llama ecommerce-shop, les tocaria crear una en el mysql phpmyadmin, tambien que tengan un usuario
root, con la clave vacia, eso lo pueden cambiar en la parte de database.php si es que tienen otro usuario mas comodo, 
tambien estara en la parte de la raiz, el archivo de la tabla de los productos para que la importen

