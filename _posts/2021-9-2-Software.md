---
title: ¿Qué es el software?
published: true
---

## Presentación

Acabo de terminar mi noveno semestre de ingeniería en sistemas, y tras este largo recorrido, creo que podré explicar qué es el software y sus componentes de una forma que todos mis lectores puedan entenderlo. Esto con el objetivo de exponer una diferenciación clara entre software libre y privativo. Si esta diferencia logra entenderse, habré cumplido mi objetivo y podré explotar estos conceptos en el futuro.

## Software

La definición es sencilla, el software es lo que permite que una computadora haga lo que tiene que hacer sin intervención humana. En el pasado, realizar cálculos con las primeras computadoras requería del ingeniero conectar y desconectar una cantidad monstruosa de cables para que la computadora hiciera algo diferente. Hoy sólo basta con presionar un botón para que haga maravillas y eso es gracias al software.

Sin el software, todos los circuitos de tu portatil o celular no servirían de mucho. Puedes pensar en ellos como un conjunto de engranajes, si sabes cómo mover determinadas palancas, moverás los engranajes correctos y la máquina hará lo que quieres que haga. Sin embargo, hay tantos y tantos circuitos en un celular, que muy seguramente terminarás arruinándolo antes de conseguir un avance. Esas piezas no se mueven solas, así que hay que encontrar una forma de mover los engranajes sin que sea tan complicado. 

Aquí ingresa un grupo de personas muy inteligentes que se unieron para hacernos la vida más fácil a los demás. Estas personas construyeron lo que se conoce como el Sistema Operativo. Es el componente de software fundamental. El Sistema Operativo es un conjunto de instrucciones que permiten hacer cosas básicas sobre el conjunto de circuitos que tenemos a nuestra disposición. Entre estas instrucciones se encuentran el manejo del disco duro. ¿Te imaginas teniendo que escribir alrededor de veinte líneas de código para almacenar una fotografía que acabas de tomar con tu celular? Claro que no. Estas instrucciones pregrabadas en el dispositivo, permiten que cuando se detecta el archivo de una imagen, esta información se escriba automáticamente en el disco duro.

En conclusión, esas pequeñas piezas que conforman tu computadora no hacen magia. Necesitan que alguien les diga qué hacer. Y el Sistema Operativo es el conjunto de instrucciones que se ocupa de las necesidades más básicas de los usuarios, para que ellos no tengan que controlar los circuitos manualmente. 

Pero aquí vale la pena hacer una pregunta: ¿cómo hacen los programadores para escribir estas instrucciones y que la computadora lo entienda? Esto es importante, porque la computadora no habla con nosotros. Decirle al mouse "Computadora mata a Flanders" no servirá de nada. Entonces, tenemos que idearnos una forma de plasmar nuestras ideas sobre estos circuitos.

Aquí podremos hablar del lenguaje binario.

## Lenguaje binario

Empecemos por lo más sencillo. Debes imaginar una bombilla de luz. Ésta puede estar encendida o apagada y esto se produce gracias al paso de la electricidad. Si no hay electricidad la bombilla se apaga, cuando hay paso de corriente, la bombilla se enciende y el cuarto se ilumina. La simpleza de esta operación inspiró la construcción de circuitos que funcionasen de forma binaria. ¿Hay electricidad o no? Con esta simple pregunta se puede representar mucha información del mundo real. 

No voy a explicar operaciones binarias, pues no es necesario, lo que importa es entender que el lenguaje binario nace de esta idea tan sencilla. Una computadora no es más que la unión de miles de circuitos que se hacen la misma pregunta, ¿hay paso de corriente?, y de acuerdo a qué circuito tiene electricidad o no, se produce un cálculo u otro.

Por eso las computadoras hablan lenguaje binario. Simplemente se trata de mover un montón de interruptores para que haya paso de corriente. Encender y apagar miles de bombillas en cuestión de milisegundos. Cuando la bombilla está apagada, esto representa un 0, cuando está encendida, se convierte en un 1. Una sola bombilla se conoce como un bit, la unidad de información más pequeña que exisite. Un bit sólo puede representar dos valores.

Cuando juntamos 8 bits, hablamos de un byte. Un byte puede lucir de la siguiente forma: 10100110. ¿Qué significan esos números? Pues, si representan un entero, la cifra sería 166. Si representan una palabra, no tengo idea. Y tampoco importa, los humanos no nacimos para entender lenguaje binario; si queremos comunicarnos con las máquinas tenemos que usar los lenguajes de programación.

## Lenguaje de programación

Un lenguaje de programación es un conjunto de instrucciones estándar que siempre se convierten en el mismo código binario. Al igual que un 3 siempre será 0b00000011, las instrucciones de un lenguaje de programación siempre tendrán la misma representación binaria, esto permite dominar la complejidad de estos circuitos para que las computadoras hagan lo que queramos.

Como ejemplo, utilizaré el lenguaje de programación python:

```python
    print('Hello, world')

```

Si sabes inglés, entender la instrucción de arriba no debe costarte nada. Le estoy diciendo a la computadora que imprima "Hello, world" traducido como "hola, mundo". La palabra `print` es una instrucción que forma parte del lenguaje de programación, esto significa que siempre tiene la misma representación binaria. Esto también evita que yo pueda usar la palabra print para otra cosa que no sea para imprimir en pantalla. Por otro lado, lo que se encuentra entre comillas tiene una representación diferente dependiendo de las circunstancias. Existen algunas formas de codificar texto como UTF8 o ASCII. Esto significa que "Hello, world" no siempre tendrá la misma representación binaria, pero todas las letras tienen su codificación de acuerdo al estándar. Quería aclarar esto, para entender la diferencia entre las instrucciones y la información que se puede manejar en una computadora.

La magia de los lenguajes de programación es que sus instrucciones, al tener siempre la misma representación binaria, se pueden transformar a binario automáticamente. Por lo tanto, yo no tengo que quemarme el cerebro tratando de averiguar cómo escribir print en binario. Dependiendo del lenguaje de programación, hay un programa, en ocasiones un compilador en otras un intérprete, que toma las instrucciones y las convierte a binario en segundos sin que yo tenga que saber nada al respecto.

Entonces, los lenguajes de programación están pensados para ser entendidos por las personas, se utilizan como una forma de dar instrucciones a las máquinas sin necesidad de conocer cómo funcionan los circuitos de la computadora. Así que voy a recalcar, las máquinas entienden binario, las personas entienden los lenguajes de programación, y existe un intermediario que puede convertir el lenguaje de programación en binario automáticamente.

Ahora estamos listos para hablar de software libre.

## Software Libre

Cuando hablamos de empresas de software, una de las más famosas es Microsoft. Su sistema operativo Windows es el más popular, viene instalado por defecto en casi todas las computadoras que salen al mercado. Voy a explicarte cómo funciona su negocio cuando comercializan software.

Microsoft te ofrece el uso sus aplicaciones, ya sea Windows o su paquete Office, mediante la compra de una licencia. Cuando compras la licencia de software de Microsoft, la ingresas en la aplicación que has instalado en tu computadora y ahora podrás usar el programa sin las restricciones de la versión gratuita.

Un ejemplo de estas restricciones puede ser que Word no te deje guardar un documento en formato PDF. Estas funcionalidades sólo las puedes desbloquear pagando. Ahora, existen muchos puestos por ahí que te ofrecen Word a un precio reducido, esto se debe a que utlizan los famosos "cracks" para saltarse la licencia y que puedas usar todas las funcionalidades del programa. Menciono esto porque, independientemente de si pagas la licencia o no, en ambos casos estamos hablando de software privativo que no respeta las libertades del usuario.

Microsoft se lucra ofreciéndote funcionalidades y esperando que pagues una licencia para poder utilizarlas. Sin embargo, estas funcionalidades son sólo la parte visible o más obvia del software. Y dado que nunca nos hemos sentado a hablar de esto seriamente, parece un trato justo; pero no lo es, pues estás cediendo tus libertades al aceptar estos términos.

Planeo hablar de las libertades que debería garantizar el software más a fondo en otro artículo, pero por ahora voy a hablar de la más fácil de entender: el acceso al código fuente.

Como te expliqué párrafos atrás, el software es lo que hace que una computadora funcione, que haga cosas; sin software, los circuitos son muy complicados. La forma en que el software funciona es a través de lenguaje binario, pues es el único que la computadora entiende, todos los programas que se ejecutan en tu celular, PC o consola de videojueos están escritos en binario. Si tú quieres saber cómo funciona un programa, revisar sus archivos será un esfuerzo fútil pues muy pocos humanos, o ninguno, entiende binario. Cuando instalas y abres una aplicación, lo que haces es acceder al código de unos y ceros que la computadora entiende para hacer que todo funcione como debe.

Si quieres saber qué hace exactemente un programa, necesitas acceso al código fuente, es decir, a los archivos escritos en un lenguaje de programación. Los lenguajes de programación pueden ser entendidos por humanos, así que tener acceso al código fuente es la única forma de entender qué hace tu computadora cuando abre una aplicación.

Microsoft te vende sólo los archivos binarios que la computadora necesita y mantiene en secreto el código fuente. Así que es imposible saber qué hacen sus programas exactamente y también abre la posibilidad de que hagan toda clase de cosas maliciosas sin que nos demos cuenta. 

No voy a ponerme paranoico, porque quiero creer que en sus programas sólo hay buenas intenciones, pero no metería mis manos al fuego por el software privativo jamás. Y mientras las empresas no liberen el código fuente de sus aplicaciones, sólo puedo verlas con un halo de desconfianza.

Así que la primera característica del software libre es tener acceso al código fuente, pero, por qué es tan importante. Es decir, si no sabes de informática, por qué te importaría. 

Prometo contestar a esa pregunta en el futuro, primero tenía que construir una base sobre la cual desarrollar mis argumentos. Espero que este artículo sea esa base. En este momento, creo que, incluso, me extendí más de lo que debería, pero espero que no te hayas aburrido y que puedas mantener el hilo de mis próximas explicaciones a partir de este primer acercamiento. Gracias por haber leído mi explicación y nos veremos pronto.

