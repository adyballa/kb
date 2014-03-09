# kb #
==

Javascript Framework für eigene Libs und wiederverwendbaren Code von Klingbim.



Regeln:
---------------------
* IDE-Verständlichkeit, Lesbarkeit und Klarheit vor schneller Entwicklung, Performanz und Größe (funky Patterns).
    * "initiale" Performanz hat keine grosse Bedeutung. Ergibt sich eine bessere Lesbarkeit und versteht die IDE es besser, wird der Weg vorgezogen.
    Man muss allerdings "initial" verstehen: Einmalig, vor dem Bereitsellen der Lib.
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
* Es gibt 2 Möglichkeiten Objekte zu erzeugen: Save und vollstaendig.
    * save/exporting:
    Mit einem new <NS>(param1, param2, .., paramN,config-obj) wird ein Objekt exportiert.
    Alle Eigenschaften, die mit einem _ beginnen werden aussortiert.
    Protected und private Kapselung wird beachtet und ein "sicheres" Objekt wird erzeugt
    * vollstaendig:
    Mit GD.Fabric("NS1", "NS2", config).create(param1, param2,..., paramN) wird alles, ein 
    vollstaendiges Objekt zurueckgegeben. Der Programmierer ist für die Einhaltung der
    Kapselung zustaendig.
    * vererbung:
    Vererbung funktioniert 2-stufig. Grundsaetzlich ist nur einfache Vererbung über die NS-deklaration moeglich.
    Zusaetzliche Eltern können zwar über Vererbung oder Mixin mitgegeben werden, sind im aber nur
    Erweiterungen der Funktionalitaeten. 
        * 1. Stufe: NS-Vererbung:
        Die Vererbung wird bei der NS-Deklaration angegeben. Zu dem Zeitpunkt wird der Prototype 
        und die Vererbungskette erzeugt.
        * 2. Stufe: Objekterzeugung:
        Wenn schliesslich das Objekt erzeugt wird, werden alle Eltern in das Objekt kopiert.
        Dabei wird vorhandenes nicht ueberschrieben und es wird kein Fehler geworfen.  
* Private und Protected:
Entweder man vergibt einen "_"-Prefix oder man arbeitet mit Closures im "constructor".
Man beachte, die Zugriffsprobleme fuer alle Methoden ausserhalb und den Zugriff ueber priviliged Methoden.
    * Es gibt keine Unterscheidung zwischen Protected und Private:
    Private Eigenschaften müssen auch ins Objekt kopiert werden, um einen Zugriff der Vorfahren zu 
    ermoeglichen. Objekte als Eigenschaften in Prototypen sind leider statisch.
    * Mit parent
    kann auf die Eltern zugegriffen werden. Hier kann auch auf das Original einer ueberschriebenen Eigenschaft
    zugegriffen werden.
    
* Objekte mittels Dependcy-Injection erhalten alle protected und public Eigenschaften.
