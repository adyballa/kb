# kb #
==

Javascript Framework für eigene Libs und wiederverwendbaren Code von Klingbim.



Regeln:
---------------------
* IDE-Verständlichkeit, Lesbarkeit und Klarheit vor schneller Entwicklung und Größe (funky Patterns).
* Code-reuse vor Freiheit:
    * Libs werden mit Dependency-Containern konfiguriert.
    * Eventsystem wird benutzt
* Code-qualität über Freiheit:
    * festgeschriebener Weg zur Objekterzeugung
    * Eingebautes Debugging
* Freiheit über Komfort.
    * Der Code benutzt keine besondere Syntax und hat wenig Abh.
    * Manches muss zusätzlich konfiguriert werden.
    * Konfigurationsdateien ermöglichen das zusammenstellen von verschiedenen Dateien und verschiedenen Objekten
* Entkopplung durch Dependcy-Injection und Events
* Code-qualität
    * JSLint möglich
    * Tests mit Jasmine möglich
    * Dokumentierung möglich
    * Building-tools: Minifizierung, Concatenierung, Code-säuberung 
* Namespaces schützen Globals
* Alle Objekte können wie folgt konfiguriert werden: Global, Klasse, Objekt


Regeln für Objekt-erzeugung:
---------------------
* Es gibt 2 Möglichkeiten Objekte zu erzeugen: Dependency-Injection und ueber eine Fabrik.
* priviligierte Methoden sind privat (Ermöglichen nur prototypen Zugriff) oder protected
* Prototypen sind public oder protected.
* Objekte mittels Dependcy-Injection erhalten alle protected und public Eigenschaften.
* Es werden public und protected vererbt. 
* Ueber eine Fabrik erhält man nur public Eigenschaften.
* Literals und Erzeugung durch Extension vermeiden
