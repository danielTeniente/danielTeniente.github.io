---
title: Licencias de software libre
published: true
---

## ¿Qué es una licencia de software libre?
Las licencias se utilizan para regular el uso del código fuente. Existen licencias en las que se renuncia por completo a los derechos de autor, mientras existen otras que sólo buscan algo de reconocimiento.

En este post, voy a mostrarte las licencias más usadas que podras encontrar en varios repositorios de Github.

## Licencias demasiado permisivas 
Las licencias que voy a mostrate tienen un dato muy importante en común, permiten al usuario integrar el código fuente en toda clase de proyectos, casi sin restricción.

### MIT
La licencia del MIT es muy clásica. En pocas palabras, puedes hacer con el software lo que quieras. Puedes integrar código bajo MIT a un programa privativo o libre. Se debe incluir un mensaje de Copyright y de derechos en todas las copias. Básciamente para dar reconocimiento. Además, si modificas el código fuente lo suficiente, podrás usar otra licencia para el producto derivado. 

### BSD 3
Similar a la del MIT, te permite integrar el código a toda clase de proyectos. Te obliga a imprimir el mensaje de Copyright incluso en los binarios, es decir, en el ejecutable. Lo que la diferencia de la licencia MIT es que no se puede usar el nombre de los desarrolladores originales para publicitar productos derivados, sin su consentimiento explícito. 

### Apache 2.0
Puedes modificar y redistribuir el software, agregando una notificación de que se ha usado código con licencia Apache, incluso en el binario. Las contribuciones o productos derivados pueden licenciarse de otra forma. Debes incluir una copia de la licencia en las redistribuciones y las partes no modificadas del original deben mantener la misma licencia. 

En los archivos se debe incluir un archivo de notificación, similar al READEME, que lleve cuenta de las modificaciones que se han realizado sobre el programa y brinde reconocimiento a los que han aportado. La notificación también debe incluir otra información importante y debe imprimirse incluso en los binarios.

## Licencias Copyleft
Estas licencias mantienen los derechos de autor, sobre el software original, para forzar a los productos derivados a preservar la libertad de la licencia.

### Mozilla Public License - MPL v2
Los archivos licenciados bajo MPL deben permanecer bajo esa misma licencia. Si los modificas, debes compartir los cambios al momento de ofrecer el producto derivado, pues te exige entregar el código fuente junto al ejecutable. A pesar de lo anterior, se puede integrar software MPL con software privativo, siempre y cuando los archivos MPL sean compartidos y mantengan su licencia.

### GNU General Public License - GPL v3
Esta es la licencia de software libre más agresiva. Si software GPL se mezcla con otro, todo el proyecto debe ser GPL. Esto significa que no puedes usar software con esta licencia en un proyecto privativo, pues todo el proyecto debe volverse libre. Debido a esto, puede existir cierto conflicto al combinar la licencia MPL con la GPL, pero no hay conflicto al integrar las licencias anteriores.

## Integrar distintas licencias
Las tres primeras licencias permiten que el proyecto se licencie de forma distinta si haces un producto derivado. También, como se trata de software libre, combina perfectamente dentro de un proyecto GPL. Sin embargo, un proyecto GPL nunca podrá convertirse a una licencia MIT o BSD-3. Todo lo que se combina con GPL, debe volverse GPL.

Ahora, existe una forma un tanto complicada de combinarse con MPL. Puedes integrar un proyecto MPL sin cambios a un GPL y redistribuir el total bajo la licencia GPL, señalando aquellos archivos que se encuentren bajo MPL. Como si el proyecto MPL fuese un módulo complementario. Todos los cambios realizados sobre los archivos MPL se mantienen bajo MPL, y los cambios del resto del software con GPL, se mantienen con GPL.

Sería una historia diferente si queremos integrar software GPL a un proyecto más grande MPL, pues la licencia GPL obliga a cambiar todo el proyecto. En cuyo caso, valdría la pena considerar caminos separados para ambos proyectos, de tal forma que los archivos de licencias distintas convivan sin romper los derechos de la otra.

## ¿Qué licencia debo utilizar?
Si tu objetivo es que todo el mundo pueda hacer lo que quiera con tu código fuente, pues te sugeriría la licencia MIT, ya que es bien conocida y permisiva.

Si quieres ayudar al software libre y que se reproduzca por el mundo, una licencia GPL sería la mejor opción. La licencia MPL surgió para proyectos de Mozilla y no es lo bastante fuerte para luchar por el software libre.

En cualquier caso, espero que con esta pequeña guía puedas evitar la confusión, al ver tantas licencias en Github.




