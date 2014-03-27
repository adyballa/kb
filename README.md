# kb #
==

Javascript Framework für eigene Libs und wiederverwendbaren Code von Generation Digitale.
Das Framework laeuft in verschiedenen Modi:
* Development
* Produktion
* Test (nicht unterstuetzt)
In der Entwicklungsphase (Development) steht ein logging zu Verfuegung und die Module werden Dateiweise
synchron geladen. Dafür muss ein Nodeserver gestartet werden. Live wird eine minifizierte Datei benutzt.

** Regeln: **
---------------------
* IDE-Verständlichkeit, Lesbarkeit und Klarheit vor schneller Entwicklung, Performanz und Größe (funky Patterns).
    * "initiale" Performanz hat keine grosse Bedeutung. Ergibt sich eine bessere Lesbarkeit und versteht die IDE es besser, wird der Weg vorgezogen.
* Code-reuse vor Freiheit:
    * Libs werden mit Dependency-Containern konfiguriert.
    * Eventsystem wird benutzt
    * Synchrones, dynamisches Scriptloading waehrend der Entwicklung 
* Code-qualität über Freiheit:
    * festgeschriebener Weg zur Objekterzeugung
    * Eingebautes Debugging
* Freiheit über Komfort.
    * Der Code benutzt keine besondere Syntax und hat wenig Abhängigkeiten.
        * Es soll moeglich sein fremden Code ohne Aenderung zu uebernehmen.
        * Es soll moeglich sein Code in eine fremde Umgebung moeglichst einfach einzubinden.  
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


** Regeln für Objekt-erzeugung: **
---------------------
* Es gibt 2 Möglichkeiten Objekte zu erzeugen: Save und vollstaendig.
    * save/exporting:
    Mit einem new <NS>(param1, param2, .., paramN,config-obj) wird ein Objekt exportiert.
        * Vererbung/Prototypen:
        Es werden keine Prototypen benutzt. Elternmethoden und -eigenschaften werden in
        das Objekt kopiert und zusaetzlich als "parent" zugaenglich gemacht. Die Kopie ist shallow.
        Wird ein Objekt mit dynamischen Prototypen gebaut, ist die Verwendung von save nicht moeglich.
        * privat:
        Alle Eigenschaften, die mit einem _ beginnen werden aussortiert.
        Es empfiehlt sich ein _-Objekt fuer private Eigenschaften anzulegen. So wird im Objekt und
        bei den Vorgaengern garantiert, dass das gleiche Objekt benutzt wird.
    * vollstaendig:
    Mit GD.Fabric("NS1", "NS2", config).create(param1, param2,..., paramN) wird alles, ein 
    vollstaendiges Objekt zurueckgegeben. Der Programmierer ist für die Einhaltung der
    Kapselung zustaendig.
    * vererbung:
    Vererbung funktioniert 2-stufig. Grundsaetzlich ist nur einfache Vererbung über die NS-deklaration moeglich.
    Zusaetzliche Eltern können zwar über Vererbung oder Mixin mitgegeben werden, sind aber nur
    Erweiterungen der Funktionalitaeten. 
        * 1. Stufe: NS-Vererbung:
        Die Vererbung wird bei der NS-Deklaration angegeben. Zu dem Zeitpunkt wird der Prototype 
        und die Vererbungskette erzeugt.
        * 2. Stufe: Objekterzeugung:
        Wenn schliesslich das Objekt erzeugt wird, werden alle Eltern in das Objekt shallow kopiert.
        Dabei wird vorhandenes nicht ueberschrieben und es wird kein Fehler geworfen.  
        * Mit parent
        kann auf die Eltern zugegriffen werden. Hier kann auch auf das Original einer ueberschriebenen Eigenschaft
        zugegriffen werden.

    
** Objekt-konfiguration und Namensraeume: **
---------------------
* Namensraeume sind Funktionen mit gewissen Eigenschaften. Sie werden beim Laden 
der Datei aus der Konfiguration erzeugt und mitgegeben.
* Gleichzeitig wird aus ihr ein Depenency-Container erzeugt.
