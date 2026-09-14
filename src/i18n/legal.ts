import type { Locale } from "./config";

// Replace every TODO before going live — § 5 DDG and Art. 13 GDPR require real operator details.
export const operator = {
  name: "TODO: Vor- und Nachname bzw. Firma",
  street: "TODO: Straße und Hausnummer",
  city: "TODO: PLZ und Ort",
  country: "TODO: Land",
  email: "TODO: kontakt@example.com",
};

export const legalUpdated = "2026-09-14";

const odr = "https://ec.europa.eu/consumers/odr";

export type LegalSection = { heading: string; body: string[]; link: { label: string; href: string } | null };
export type LegalDocument = { title: string; lead: string; sections: LegalSection[] };
export type LegalCopy = {
  back: string;
  imprintLink: string;
  privacyLink: string;
  operatorHeading: string;
  contactLabel: string;
  updatedLabel: string;
  imprint: LegalDocument;
  privacy: LegalDocument;
};

export const legalText: Record<Locale, LegalCopy> = {
  en: {
    back: "Back to the world",
    imprintLink: "Legal notice",
    privacyLink: "Privacy policy",
    operatorHeading: "Service provider",
    contactLabel: "Contact",
    updatedLabel: "Last updated",
    imprint: {
      title: "Legal notice",
      lead: "Information in accordance with § 5 DDG (German Digital Services Act).",
      sections: [
        { heading: "Liability for content", body: ["As a service provider we are responsible for our own content on these pages under general law. We are not obliged to monitor transmitted or stored third-party information, nor to investigate circumstances that indicate illegal activity."], link: null },
        { heading: "Liability for links", body: ["This site contains links to external websites whose content we cannot influence. We accept no liability for that third-party content; the respective provider or operator is always responsible for it. No unlawful content was apparent at the time the links were added."], link: null },
        { heading: "Copyright", body: ["Content created by the operator of this site is subject to German copyright law. Contributions by third parties are marked as such. Reproduction, editing, distribution and any kind of use beyond the limits of copyright require written consent."], link: null },
        { heading: "Online dispute resolution", body: ["The European Commission provides a platform for online dispute resolution. We are neither obliged nor willing to take part in dispute resolution proceedings before a consumer arbitration board."], link: { label: "European ODR platform", href: odr } },
        { heading: "Trademarks", body: ["WoW Soulmate is an independent fan project. World of Warcraft and Blizzard Entertainment are trademarks or registered trademarks of Blizzard Entertainment, Inc. This project is neither affiliated with nor endorsed by Blizzard Entertainment."], link: null },
      ],
    },
    privacy: {
      title: "Privacy policy",
      lead: "This policy explains which personal data we process when you use WoW Soulmate, why we process it and what rights you have.",
      sections: [
        { heading: "Controller", body: ["The controller for data processing on this website is the service provider named above. You can reach us at the email address listed there."], link: null },
        { heading: "Server log files", body: ["Our hosting provider automatically collects and stores information that your browser transmits: browser type and version, operating system, referrer URL, host name, time of the request and IP address. This data is not merged with other sources.", "Legal basis: Art. 6(1)(f) GDPR — our legitimate interest in a technically error-free presentation of the website."], link: null },
        { heading: "Signing in with Battle.net", body: ["Signing in is optional. If you use it, you are forwarded to the Blizzard Entertainment login. We receive a pseudonymous Battle.net identifier only. We do not receive your password, your BattleTag, your email address, or your character and group history.", "Legal basis: Art. 6(1)(b) GDPR — performance of a contract and pre-contractual measures."], link: null },
        { heading: "Profile data and matching", body: ["The interests, group role, experience, usual playtime, optional age range and optional description you enter are stored together with your Battle.net identifier. Shared terms in descriptions can add up to five percentage points to the matching score. The text is not displayed to other players. Matching is opt-in: you can switch your profile to private at any time so that it is excluded from matching.", "Legal basis: Art. 6(1)(a) and (b) GDPR."], link: null },
        { heading: "Goals and search preferences", body: ["Optional classes, factions, goals and search preferences are stored with your profile and are not shown to other players. Unmet must criteria exclude a match in either direction. Wishes affect ranking without excluding players. If search criteria are present, their fulfilment accounts for 20% of the score, giving both participants equal weight; the existing schedule, activity, role, experience and age score accounts for 80%. The description bonus is added afterwards. Role preferences distinguish similarity from complementarity; experience comparisons use the selected experience categories, not verified skill.", "Legal basis: Art. 6(1)(a) and (b) GDPR."], link: null },
        { heading: "Cookies", body: ["We only use a technically necessary, encrypted session cookie to keep you signed in. There are no tracking or advertising cookies and no analytics service is embedded.", "Legal basis: § 25(2) TDDDG and Art. 6(1)(f) GDPR."], link: null },
        { heading: "Storage period and deletion", body: ["Profile data is stored until you delete it. You can delete your profile at any time in your profile settings; deletion takes effect immediately and cannot be undone. Server log files are deleted after a short period unless they are needed as evidence."], link: null },
        { heading: "Your rights", body: ["You have the right to information, rectification, erasure, restriction of processing, data portability, and to object to processing. You may withdraw consent at any time with effect for the future. You also have the right to lodge a complaint with a data protection supervisory authority."], link: null },
        { heading: "Contact", body: ["For any request concerning your data, write to the email address in the legal notice. We will respond within one month."], link: null },
      ],
    },
  },
  de: {
    back: "Zurück zur Welt",
    imprintLink: "Impressum",
    privacyLink: "Datenschutz",
    operatorHeading: "Diensteanbieter",
    contactLabel: "Kontakt",
    updatedLabel: "Zuletzt aktualisiert",
    imprint: {
      title: "Impressum",
      lead: "Angaben gemäß § 5 DDG.",
      sections: [
        { heading: "Haftung für Inhalte", body: ["Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Wir sind nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen."], link: null },
        { heading: "Haftung für Links", body: ["Dieses Angebot enthält Links zu externen Websites, auf deren Inhalte wir keinen Einfluss haben. Für diese fremden Inhalte übernehmen wir keine Gewähr; verantwortlich ist stets der jeweilige Anbieter oder Betreiber. Zum Zeitpunkt der Verlinkung waren keine rechtswidrigen Inhalte erkennbar."], link: null },
        { heading: "Urheberrecht", body: ["Die vom Betreiber erstellten Inhalte dieser Seiten unterliegen dem deutschen Urheberrecht. Beiträge Dritter sind als solche gekennzeichnet. Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung."], link: null },
        { heading: "Online-Streitbeilegung", body: ["Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung bereit. Wir sind weder verpflichtet noch bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen."], link: { label: "Europäische OS-Plattform", href: odr } },
        { heading: "Markenrechte", body: ["WoW Soulmate ist ein unabhängiges Fanprojekt. World of Warcraft und Blizzard Entertainment sind Marken oder eingetragene Marken von Blizzard Entertainment, Inc. Dieses Projekt ist weder mit Blizzard Entertainment verbunden noch wird es von Blizzard unterstützt."], link: null },
      ],
    },
    privacy: {
      title: "Datenschutzerklärung",
      lead: "Diese Erklärung beschreibt, welche personenbezogenen Daten wir bei der Nutzung von WoW Soulmate verarbeiten, warum wir das tun und welche Rechte du hast.",
      sections: [
        { heading: "Verantwortlicher", body: ["Verantwortlich für die Datenverarbeitung auf dieser Website ist der oben genannte Diensteanbieter. Du erreichst uns unter der dort angegebenen E-Mail-Adresse."], link: null },
        { heading: "Server-Logfiles", body: ["Unser Hosting-Anbieter erhebt und speichert automatisch Informationen, die dein Browser übermittelt: Browsertyp und -version, Betriebssystem, Referrer-URL, Hostname, Uhrzeit der Anfrage und IP-Adresse. Diese Daten werden nicht mit anderen Quellen zusammengeführt.", "Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO — unser berechtigtes Interesse an einer technisch fehlerfreien Darstellung der Website."], link: null },
        { heading: "Anmeldung über Battle.net", body: ["Die Anmeldung ist freiwillig. Wenn du sie nutzt, wirst du zum Login von Blizzard Entertainment weitergeleitet. Wir erhalten ausschließlich eine pseudonyme Battle.net-Kennung. Wir erhalten weder dein Passwort noch deinen BattleTag, deine E-Mail-Adresse oder deine Charakter- und Gruppenhistorie.", "Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO — Vertragserfüllung und vorvertragliche Maßnahmen."], link: null },
        { heading: "Profildaten und Matching", body: ["Die von dir angegebenen Interessen, deine Rolle in der Gruppe, deine Erfahrung, deine übliche Spielzeit, die optionale Altersgruppe und der optionale Beschreibungstext werden gemeinsam mit deiner Battle.net-Kennung gespeichert. Gemeinsame Begriffe in den Beschreibungstexten können den Matching-Wert um bis zu fünf Prozentpunkte erhöhen. Der Text wird anderen Spielern nicht angezeigt. Matching ist freiwillig: Du kannst dein Profil jederzeit auf privat stellen, damit es vom Matching ausgenommen wird.", "Rechtsgrundlage: Art. 6 Abs. 1 lit. a und b DSGVO."], link: null },
        { heading: "Ziele und Suchkriterien", body: ["Optionale Klassen, Fraktionen, Ziele und Suchkriterien werden mit deinem Profil gespeichert und anderen Spielern nicht angezeigt. Unerfüllte Muss-Kriterien schließen ein Match in beiden Richtungen aus. Wünsche beeinflussen die Reihenfolge, ohne Spieler auszuschließen. Bei vorhandenen Suchkriterien zählt deren Erfüllung zu 20 % zum Wert, wobei beide Personen gleich gewichtet werden; die bisherige Bewertung aus Spielzeiten, Aktivitäten, Rolle, Erfahrung und Alter zählt zu 80 %. Der Beschreibungsbonus kommt anschließend hinzu. Rollenpräferenzen unterscheiden Ähnlichkeit und Ergänzung; Erfahrungsvergleiche nutzen die gewählten Erfahrungskategorien, nicht überprüfte Spielstärke.", "Rechtsgrundlage: Art. 6 Abs. 1 lit. a und b DSGVO."], link: null },
        { heading: "Cookies", body: ["Wir setzen ausschließlich ein technisch notwendiges, verschlüsseltes Sitzungscookie ein, um dich angemeldet zu halten. Es gibt keine Tracking- oder Werbe-Cookies und es ist kein Analysedienst eingebunden.", "Rechtsgrundlage: § 25 Abs. 2 TDDDG und Art. 6 Abs. 1 lit. f DSGVO."], link: null },
        { heading: "Speicherdauer und Löschung", body: ["Profildaten werden gespeichert, bis du sie löschst. Du kannst dein Profil jederzeit in den Profileinstellungen löschen; die Löschung wirkt sofort und ist nicht umkehrbar. Server-Logfiles werden nach kurzer Zeit gelöscht, sofern sie nicht als Beweismittel benötigt werden."], link: null },
        { heading: "Deine Rechte", body: ["Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch gegen die Verarbeitung. Eine erteilte Einwilligung kannst du jederzeit mit Wirkung für die Zukunft widerrufen. Außerdem steht dir ein Beschwerderecht bei einer Datenschutz-Aufsichtsbehörde zu."], link: null },
        { heading: "Kontakt", body: ["Für Anliegen rund um deine Daten schreib uns an die im Impressum genannte E-Mail-Adresse. Wir antworten innerhalb eines Monats."], link: null },
      ],
    },
  },
  fr: {
    back: "Retour au monde",
    imprintLink: "Mentions légales",
    privacyLink: "Confidentialité",
    operatorHeading: "Éditeur du service",
    contactLabel: "Contact",
    updatedLabel: "Dernière mise à jour",
    imprint: {
      title: "Mentions légales",
      lead: "Informations conformément au § 5 DDG (loi allemande sur les services numériques).",
      sections: [
        { heading: "Responsabilité du contenu", body: ["En tant qu’éditeur, nous sommes responsables de nos propres contenus sur ces pages selon le droit commun. Nous ne sommes pas tenus de surveiller les informations de tiers transmises ou stockées, ni de rechercher des circonstances révélant une activité illicite."], link: null },
        { heading: "Responsabilité des liens", body: ["Ce site contient des liens vers des sites externes dont nous ne maîtrisons pas le contenu. Nous déclinons toute responsabilité pour ces contenus tiers ; le fournisseur ou l’exploitant concerné en est toujours responsable. Aucun contenu illicite n’était visible au moment de la mise en lien."], link: null },
        { heading: "Droit d’auteur", body: ["Les contenus créés par l’éditeur de ce site sont soumis au droit d’auteur allemand. Les contributions de tiers sont signalées comme telles. La reproduction, la modification, la diffusion et toute forme d’exploitation en dehors des limites du droit d’auteur requièrent un accord écrit."], link: null },
        { heading: "Règlement en ligne des litiges", body: ["La Commission européenne met à disposition une plateforme de règlement en ligne des litiges. Nous ne sommes ni tenus ni disposés à participer à une procédure de règlement des litiges devant un organe de conciliation pour consommateurs."], link: { label: "Plateforme européenne RLL", href: odr } },
        { heading: "Marques", body: ["WoW Soulmate est un projet de fans indépendant. World of Warcraft et Blizzard Entertainment sont des marques ou des marques déposées de Blizzard Entertainment, Inc. Ce projet n’est ni affilié à Blizzard Entertainment ni approuvé par celui-ci."], link: null },
      ],
    },
    privacy: {
      title: "Politique de confidentialité",
      lead: "Cette politique explique quelles données personnelles nous traitons lorsque tu utilises WoW Soulmate, pourquoi nous le faisons et quels sont tes droits.",
      sections: [
        { heading: "Responsable du traitement", body: ["Le responsable du traitement des données sur ce site est l’éditeur mentionné ci-dessus. Tu peux nous joindre à l’adresse e-mail qui y figure."], link: null },
        { heading: "Fichiers journaux du serveur", body: ["Notre hébergeur collecte et conserve automatiquement les informations transmises par ton navigateur : type et version du navigateur, système d’exploitation, URL de référence, nom d’hôte, heure de la requête et adresse IP. Ces données ne sont pas croisées avec d’autres sources.", "Base légale : art. 6, § 1, point f) du RGPD — notre intérêt légitime à une présentation techniquement irréprochable du site."], link: null },
        { heading: "Connexion via Battle.net", body: ["La connexion est facultative. Si tu l’utilises, tu es redirigé vers l’identification de Blizzard Entertainment. Nous recevons uniquement un identifiant Battle.net pseudonyme. Nous ne recevons ni ton mot de passe, ni ton BattleTag, ni ton adresse e-mail, ni l’historique de tes personnages et de tes groupes.", "Base légale : art. 6, § 1, point b) du RGPD — exécution d’un contrat et mesures précontractuelles."], link: null },
        { heading: "Données de profil et matching", body: ["Les centres d’intérêt, le rôle, l’expérience, les horaires habituels, la tranche d’âge facultative et la description facultative que tu saisis sont enregistrés avec ton identifiant Battle.net. Les termes communs aux descriptions peuvent ajouter jusqu’à cinq points de pourcentage au score de compatibilité. Le texte n’est pas affiché aux autres joueurs. La recherche de partenaires est facultative : tu peux à tout moment rendre ton profil privé afin qu’il en soit exclu.", "Base légale : art. 6, § 1, points a) et b) du RGPD."], link: null },
        { heading: "Objectifs et critères de recherche", body: ["Les classes, factions, objectifs et critères facultatifs sont enregistrés avec ton profil et ne sont pas montrés aux autres joueurs. Un critère obligatoire non satisfait exclut une correspondance dans les deux sens. Les souhaits influencent le classement sans exclure de joueurs. Si des critères sont renseignés, leur satisfaction représente 20 % du score, avec un poids égal pour les deux personnes ; le score existant des horaires, activités, rôle, expérience et âge représente 80 %. Le bonus de description est ajouté ensuite. Les préférences de rôle distinguent similarité et complémentarité ; l’expérience est comparée selon les catégories choisies, pas selon un niveau de jeu vérifié.", "Base légale : art. 6, § 1, points a) et b) du RGPD."], link: null },
        { heading: "Cookies", body: ["Nous utilisons uniquement un cookie de session chiffré, techniquement nécessaire pour te garder connecté. Aucun cookie de suivi ou publicitaire n’est utilisé et aucun service d’analyse n’est intégré.", "Base légale : § 25, al. 2 TDDDG et art. 6, § 1, point f) du RGPD."], link: null },
        { heading: "Durée de conservation et suppression", body: ["Les données de profil sont conservées jusqu’à ce que tu les supprimes. Tu peux supprimer ton profil à tout moment dans ses paramètres ; la suppression est immédiate et irréversible. Les fichiers journaux sont supprimés après une courte période, sauf s’ils sont nécessaires comme preuve."], link: null },
        { heading: "Tes droits", body: ["Tu disposes d’un droit d’accès, de rectification, d’effacement, de limitation du traitement, de portabilité des données et d’opposition au traitement. Tu peux retirer ton consentement à tout moment avec effet pour l’avenir. Tu as également le droit d’introduire une réclamation auprès d’une autorité de contrôle."], link: null },
        { heading: "Contact", body: ["Pour toute demande concernant tes données, écris à l’adresse e-mail indiquée dans les mentions légales. Nous répondons dans un délai d’un mois."], link: null },
      ],
    },
  },
  es: {
    back: "Volver al mundo",
    imprintLink: "Aviso legal",
    privacyLink: "Privacidad",
    operatorHeading: "Prestador del servicio",
    contactLabel: "Contacto",
    updatedLabel: "Última actualización",
    imprint: {
      title: "Aviso legal",
      lead: "Información conforme al § 5 DDG (Ley alemana de servicios digitales).",
      sections: [
        { heading: "Responsabilidad por los contenidos", body: ["Como prestador del servicio somos responsables de nuestros propios contenidos en estas páginas conforme a la legislación general. No estamos obligados a supervisar la información de terceros transmitida o almacenada, ni a investigar circunstancias que indiquen una actividad ilícita."], link: null },
        { heading: "Responsabilidad por los enlaces", body: ["Este sitio contiene enlaces a páginas externas cuyo contenido no podemos controlar. No asumimos responsabilidad alguna por esos contenidos ajenos; el responsable es siempre el proveedor u operador correspondiente. En el momento de enlazar no se apreciaron contenidos ilícitos."], link: null },
        { heading: "Derechos de autor", body: ["Los contenidos creados por el operador de este sitio están sujetos a la legislación alemana sobre derechos de autor. Las aportaciones de terceros están señaladas como tales. La reproducción, edición, distribución y cualquier uso fuera de los límites del derecho de autor requieren consentimiento por escrito."], link: null },
        { heading: "Resolución de litigios en línea", body: ["La Comisión Europea pone a disposición una plataforma de resolución de litigios en línea. No estamos obligados ni dispuestos a participar en procedimientos de resolución de litigios ante una junta arbitral de consumo."], link: { label: "Plataforma europea RLL", href: odr } },
        { heading: "Marcas registradas", body: ["WoW Soulmate es un proyecto independiente de fans. World of Warcraft y Blizzard Entertainment son marcas o marcas registradas de Blizzard Entertainment, Inc. Este proyecto no está afiliado a Blizzard Entertainment ni cuenta con su respaldo."], link: null },
      ],
    },
    privacy: {
      title: "Política de privacidad",
      lead: "Esta política explica qué datos personales tratamos cuando usas WoW Soulmate, por qué lo hacemos y qué derechos tienes.",
      sections: [
        { heading: "Responsable del tratamiento", body: ["El responsable del tratamiento de datos en este sitio es el prestador del servicio indicado arriba. Puedes contactarnos en la dirección de correo que allí figura."], link: null },
        { heading: "Archivos de registro del servidor", body: ["Nuestro proveedor de alojamiento recoge y almacena automáticamente la información que transmite tu navegador: tipo y versión del navegador, sistema operativo, URL de referencia, nombre de host, hora de la solicitud y dirección IP. Estos datos no se combinan con otras fuentes.", "Base jurídica: art. 6.1.f del RGPD — nuestro interés legítimo en una presentación del sitio técnicamente correcta."], link: null },
        { heading: "Inicio de sesión con Battle.net", body: ["Iniciar sesión es opcional. Si lo haces, se te redirige al inicio de sesión de Blizzard Entertainment. Solo recibimos un identificador seudónimo de Battle.net. No recibimos tu contraseña, tu BattleTag, tu correo electrónico ni el historial de tus personajes y grupos.", "Base jurídica: art. 6.1.b del RGPD — ejecución de un contrato y medidas precontractuales."], link: null },
        { heading: "Datos de perfil y emparejamiento", body: ["Los intereses, el rol, la experiencia, los horarios habituales, la franja de edad opcional y la descripción opcional que indiques se guardan junto con tu identificador de Battle.net. Los términos comunes de las descripciones pueden añadir hasta cinco puntos porcentuales a la compatibilidad. El texto no se muestra a otros jugadores. El emparejamiento es voluntario: puedes poner tu perfil en privado en cualquier momento para quedar excluido.", "Base jurídica: art. 6.1.a y 6.1.b del RGPD."], link: null },
        { heading: "Objetivos y criterios de búsqueda", body: ["Las clases, facciones, objetivos y criterios opcionales se guardan con tu perfil y no se muestran a otros jugadores. Los criterios obligatorios incumplidos excluyen una coincidencia en ambas direcciones. Las preferencias influyen en el orden sin excluir jugadores. Cuando hay criterios, su cumplimiento supone el 20 % de la puntuación, con igual peso para ambas personas; la valoración existente de horarios, actividades, rol, experiencia y edad supone el 80 %. El bonus de descripción se añade después. Las preferencias de rol distinguen similitud y complementariedad; la experiencia se compara según las categorías elegidas, no según una habilidad verificada.", "Base jurídica: art. 6.1.a y 6.1.b del RGPD."], link: null },
        { heading: "Cookies", body: ["Solo utilizamos una cookie de sesión cifrada y técnicamente necesaria para mantener tu sesión iniciada. No hay cookies de seguimiento ni publicitarias y no se integra ningún servicio de analítica.", "Base jurídica: § 25.2 TDDDG y art. 6.1.f del RGPD."], link: null },
        { heading: "Plazo de conservación y supresión", body: ["Los datos de perfil se conservan hasta que los elimines. Puedes borrar tu perfil en cualquier momento desde sus ajustes; la supresión es inmediata e irreversible. Los archivos de registro se eliminan tras un breve periodo, salvo que se necesiten como prueba."], link: null },
        { heading: "Tus derechos", body: ["Tienes derecho de acceso, rectificación, supresión, limitación del tratamiento, portabilidad de los datos y oposición al tratamiento. Puedes retirar tu consentimiento en cualquier momento con efectos para el futuro. También tienes derecho a presentar una reclamación ante una autoridad de control."], link: null },
        { heading: "Contacto", body: ["Para cualquier consulta sobre tus datos, escribe a la dirección de correo indicada en el aviso legal. Respondemos en el plazo de un mes."], link: null },
      ],
    },
  },
  it: {
    back: "Torna al mondo",
    imprintLink: "Note legali",
    privacyLink: "Privacy",
    operatorHeading: "Fornitore del servizio",
    contactLabel: "Contatto",
    updatedLabel: "Ultimo aggiornamento",
    imprint: {
      title: "Note legali",
      lead: "Informazioni ai sensi del § 5 DDG (legge tedesca sui servizi digitali).",
      sections: [
        { heading: "Responsabilità per i contenuti", body: ["In qualità di fornitore del servizio siamo responsabili dei contenuti propri di queste pagine secondo le leggi generali. Non siamo tenuti a controllare le informazioni di terzi trasmesse o memorizzate, né a ricercare circostanze che indichino un’attività illecita."], link: null },
        { heading: "Responsabilità per i link", body: ["Questo sito contiene link a siti esterni sui cui contenuti non abbiamo alcuna influenza. Non rispondiamo di tali contenuti altrui; la responsabilità è sempre del rispettivo fornitore o gestore. Al momento dell’inserimento del link non erano riconoscibili contenuti illeciti."], link: null },
        { heading: "Diritto d’autore", body: ["I contenuti creati dal gestore di questo sito sono soggetti al diritto d’autore tedesco. I contributi di terzi sono contrassegnati come tali. Riproduzione, modifica, diffusione e qualsiasi utilizzo al di fuori dei limiti del diritto d’autore richiedono il consenso scritto."], link: null },
        { heading: "Risoluzione delle controversie online", body: ["La Commissione europea mette a disposizione una piattaforma per la risoluzione delle controversie online. Non siamo né obbligati né disposti a partecipare a procedure di conciliazione dinanzi a un organismo di risoluzione delle controversie dei consumatori."], link: { label: "Piattaforma europea ODR", href: odr } },
        { heading: "Marchi", body: ["WoW Soulmate è un progetto indipendente di fan. World of Warcraft e Blizzard Entertainment sono marchi o marchi registrati di Blizzard Entertainment, Inc. Questo progetto non è affiliato a Blizzard Entertainment né approvato da essa."], link: null },
      ],
    },
    privacy: {
      title: "Informativa sulla privacy",
      lead: "Questa informativa spiega quali dati personali trattiamo quando usi WoW Soulmate, perché lo facciamo e quali diritti hai.",
      sections: [
        { heading: "Titolare del trattamento", body: ["Il titolare del trattamento dei dati su questo sito è il fornitore del servizio indicato sopra. Puoi contattarci all’indirizzo e-mail lì riportato."], link: null },
        { heading: "File di log del server", body: ["Il nostro fornitore di hosting raccoglie e conserva automaticamente le informazioni trasmesse dal tuo browser: tipo e versione del browser, sistema operativo, URL di provenienza, nome host, ora della richiesta e indirizzo IP. Questi dati non vengono uniti ad altre fonti.", "Base giuridica: art. 6, par. 1, lett. f) GDPR — il nostro legittimo interesse a una presentazione tecnicamente corretta del sito."], link: null },
        { heading: "Accesso tramite Battle.net", body: ["L’accesso è facoltativo. Se lo utilizzi, vieni indirizzato al login di Blizzard Entertainment. Riceviamo esclusivamente un identificativo Battle.net pseudonimo. Non riceviamo la tua password, il tuo BattleTag, il tuo indirizzo e-mail né la cronologia dei tuoi personaggi e gruppi.", "Base giuridica: art. 6, par. 1, lett. b) GDPR — esecuzione di un contratto e misure precontrattuali."], link: null },
        { heading: "Dati del profilo e matching", body: ["Gli interessi, il ruolo, l’esperienza, gli orari abituali, la fascia d’età facoltativa e la descrizione facoltativa che inserisci vengono salvati insieme al tuo identificativo Battle.net. I termini in comune nelle descrizioni possono aggiungere fino a cinque punti percentuali al punteggio di affinità. Il testo non viene mostrato agli altri giocatori. Il matching è facoltativo: puoi rendere privato il tuo profilo in qualsiasi momento per escluderlo.", "Base giuridica: art. 6, par. 1, lett. a) e b) GDPR."], link: null },
        { heading: "Obiettivi e criteri di ricerca", body: ["Classi, fazioni, obiettivi e criteri facoltativi sono salvati con il profilo e non mostrati agli altri giocatori. I criteri obbligatori non soddisfatti escludono un abbinamento in entrambe le direzioni. Le preferenze influenzano l’ordine senza escludere giocatori. Se presenti, i criteri soddisfatti valgono il 20% del punteggio, con uguale peso per entrambe le persone; il punteggio esistente di orari, attività, ruolo, esperienza ed età vale l’80%. Il bonus della descrizione viene aggiunto dopo. Le preferenze di ruolo distinguono somiglianza e complementarità; l’esperienza è confrontata in base alle categorie scelte, non all’abilità verificata.", "Base giuridica: art. 6, par. 1, lett. a) e b) GDPR."], link: null },
        { heading: "Cookie", body: ["Utilizziamo esclusivamente un cookie di sessione cifrato e tecnicamente necessario per mantenerti connesso. Non ci sono cookie di tracciamento o pubblicitari e non è integrato alcun servizio di analisi.", "Base giuridica: § 25, comma 2 TDDDG e art. 6, par. 1, lett. f) GDPR."], link: null },
        { heading: "Periodo di conservazione e cancellazione", body: ["I dati del profilo restano memorizzati finché non li elimini. Puoi cancellare il profilo in qualsiasi momento dalle impostazioni; la cancellazione è immediata e irreversibile. I file di log vengono eliminati dopo poco tempo, salvo che servano come prova."], link: null },
        { heading: "I tuoi diritti", body: ["Hai diritto di accesso, rettifica, cancellazione, limitazione del trattamento, portabilità dei dati e opposizione al trattamento. Puoi revocare il consenso in qualsiasi momento con effetto per il futuro. Hai inoltre il diritto di proporre reclamo a un’autorità di controllo."], link: null },
        { heading: "Contatto", body: ["Per qualsiasi richiesta relativa ai tuoi dati, scrivi all’indirizzo e-mail indicato nelle note legali. Rispondiamo entro un mese."], link: null },
      ],
    },
  },
  pt: {
    back: "Voltar ao mundo",
    imprintLink: "Informação legal",
    privacyLink: "Privacidade",
    operatorHeading: "Prestador do serviço",
    contactLabel: "Contacto",
    updatedLabel: "Última atualização",
    imprint: {
      title: "Informação legal",
      lead: "Informações nos termos do § 5 DDG (lei alemã dos serviços digitais).",
      sections: [
        { heading: "Responsabilidade pelos conteúdos", body: ["Enquanto prestador do serviço, somos responsáveis pelos nossos próprios conteúdos nestas páginas nos termos da legislação geral. Não somos obrigados a monitorizar informações de terceiros transmitidas ou armazenadas, nem a investigar circunstâncias que indiquem uma atividade ilícita."], link: null },
        { heading: "Responsabilidade pelas ligações", body: ["Este site contém ligações para páginas externas cujo conteúdo não podemos influenciar. Não assumimos qualquer responsabilidade por esses conteúdos alheios; o responsável é sempre o respetivo fornecedor ou operador. No momento da ligação não eram visíveis conteúdos ilícitos."], link: null },
        { heading: "Direitos de autor", body: ["Os conteúdos criados pelo operador deste site estão sujeitos ao direito de autor alemão. Os contributos de terceiros estão assinalados como tal. A reprodução, edição, distribuição e qualquer utilização fora dos limites do direito de autor carecem de consentimento escrito."], link: null },
        { heading: "Resolução de litígios em linha", body: ["A Comissão Europeia disponibiliza uma plataforma de resolução de litígios em linha. Não estamos obrigados nem dispostos a participar em procedimentos de resolução de litígios perante uma entidade de arbitragem de consumo."], link: { label: "Plataforma europeia RLL", href: odr } },
        { heading: "Marcas registadas", body: ["O WoW Soulmate é um projeto independente de fãs. World of Warcraft e Blizzard Entertainment são marcas ou marcas registadas da Blizzard Entertainment, Inc. Este projeto não está afiliado à Blizzard Entertainment nem é aprovado por ela."], link: null },
      ],
    },
    privacy: {
      title: "Política de privacidade",
      lead: "Esta política explica que dados pessoais tratamos quando usas o WoW Soulmate, porque o fazemos e que direitos tens.",
      sections: [
        { heading: "Responsável pelo tratamento", body: ["O responsável pelo tratamento de dados neste site é o prestador do serviço indicado acima. Podes contactar-nos através do endereço de e-mail aí referido."], link: null },
        { heading: "Ficheiros de registo do servidor", body: ["O nosso fornecedor de alojamento recolhe e guarda automaticamente as informações que o teu navegador transmite: tipo e versão do navegador, sistema operativo, URL de origem, nome do anfitrião, hora do pedido e endereço IP. Estes dados não são cruzados com outras fontes.", "Fundamento jurídico: art. 6.º, n.º 1, al. f) do RGPD — o nosso interesse legítimo numa apresentação tecnicamente correta do site."], link: null },
        { heading: "Início de sessão com Battle.net", body: ["Iniciar sessão é opcional. Se o fizeres, és encaminhado para o login da Blizzard Entertainment. Recebemos apenas um identificador Battle.net pseudonimizado. Não recebemos a tua palavra-passe, o teu BattleTag, o teu e-mail nem o histórico das tuas personagens e grupos.", "Fundamento jurídico: art. 6.º, n.º 1, al. b) do RGPD — execução de um contrato e diligências pré-contratuais."], link: null },
        { heading: "Dados de perfil e matching", body: ["Os interesses, a função, a experiência, os horários habituais, a faixa etária opcional e a descrição opcional que indicares são guardados juntamente com o teu identificador Battle.net. Os termos comuns nas descrições podem acrescentar até cinco pontos percentuais à compatibilidade. O texto não é apresentado a outros jogadores. O matching é opcional: podes tornar o teu perfil privado a qualquer momento para o excluir.", "Fundamento jurídico: art. 6.º, n.º 1, als. a) e b) do RGPD."], link: null },
        { heading: "Objetivos e critérios de procura", body: ["As classes, fações, objetivos e critérios opcionais são guardados com o perfil e não são mostrados a outros jogadores. Os critérios obrigatórios não cumpridos excluem uma correspondência em ambas as direções. As preferências influenciam a ordem sem excluir jogadores. Quando existem critérios, o seu cumprimento vale 20% da pontuação, com peso igual para ambas as pessoas; a avaliação existente de horários, atividades, função, experiência e idade vale 80%. O bónus da descrição é acrescentado depois. As preferências de função distinguem semelhança e complementaridade; a experiência é comparada pelas categorias escolhidas, não por capacidade verificada.", "Fundamento jurídico: art. 6.º, n.º 1, als. a) e b) do RGPD."], link: null },
        { heading: "Cookies", body: ["Usamos apenas um cookie de sessão encriptado e tecnicamente necessário para te manter com sessão iniciada. Não existem cookies de rastreio ou publicidade nem está integrado qualquer serviço de analítica.", "Fundamento jurídico: § 25.º, n.º 2 TDDDG e art. 6.º, n.º 1, al. f) do RGPD."], link: null },
        { heading: "Prazo de conservação e eliminação", body: ["Os dados do perfil são conservados até que os elimines. Podes apagar o teu perfil a qualquer momento nas definições; a eliminação é imediata e irreversível. Os ficheiros de registo são eliminados após um curto período, salvo se forem necessários como prova."], link: null },
        { heading: "Os teus direitos", body: ["Tens direito de acesso, retificação, apagamento, limitação do tratamento, portabilidade dos dados e oposição ao tratamento. Podes retirar o consentimento a qualquer momento com efeitos para o futuro. Tens também o direito de apresentar reclamação junto de uma autoridade de controlo."], link: null },
        { heading: "Contacto", body: ["Para qualquer pedido relativo aos teus dados, escreve para o endereço de e-mail indicado na informação legal. Respondemos no prazo de um mês."], link: null },
      ],
    },
  },
  ru: {
    back: "Вернуться в мир",
    imprintLink: "Выходные данные",
    privacyLink: "Конфиденциальность",
    operatorHeading: "Поставщик услуги",
    contactLabel: "Контакт",
    updatedLabel: "Последнее обновление",
    imprint: {
      title: "Выходные данные",
      lead: "Сведения в соответствии с § 5 DDG (Закон Германии о цифровых услугах).",
      sections: [
        { heading: "Ответственность за содержание", body: ["Как поставщик услуги мы несём ответственность за собственные материалы на этих страницах согласно общему законодательству. Мы не обязаны отслеживать передаваемую или хранимую чужую информацию либо выявлять обстоятельства, указывающие на противоправную деятельность."], link: null },
        { heading: "Ответственность за ссылки", body: ["На сайте есть ссылки на внешние ресурсы, содержание которых мы не контролируем. Мы не отвечаем за такие материалы; ответственность всегда несёт соответствующий поставщик или владелец. На момент размещения ссылок противоправного содержания выявлено не было."], link: null },
        { heading: "Авторское право", body: ["Материалы, созданные оператором сайта, защищены авторским правом Германии. Материалы третьих лиц помечены отдельно. Воспроизведение, переработка, распространение и любое использование за пределами авторского права требуют письменного согласия."], link: null },
        { heading: "Онлайн-урегулирование споров", body: ["Европейская комиссия предоставляет платформу для онлайн-урегулирования споров. Мы не обязаны и не готовы участвовать в процедурах разрешения споров в органе по урегулированию потребительских споров."], link: { label: "Европейская платформа ODR", href: odr } },
        { heading: "Товарные знаки", body: ["WoW Soulmate — независимый фанатский проект. World of Warcraft и Blizzard Entertainment являются товарными знаками или зарегистрированными товарными знаками Blizzard Entertainment, Inc. Проект не связан с Blizzard Entertainment и не одобрен компанией."], link: null },
      ],
    },
    privacy: {
      title: "Политика конфиденциальности",
      lead: "Здесь описано, какие персональные данные мы обрабатываем при использовании WoW Soulmate, зачем мы это делаем и какие у тебя есть права.",
      sections: [
        { heading: "Оператор данных", body: ["Ответственным за обработку данных на этом сайте является указанный выше поставщик услуги. Связаться с нами можно по приведённому там адресу электронной почты."], link: null },
        { heading: "Журналы сервера", body: ["Наш хостинг-провайдер автоматически собирает и сохраняет данные, которые передаёт браузер: тип и версия браузера, операционная система, URL источника перехода, имя хоста, время запроса и IP-адрес. Эти данные не объединяются с другими источниками.", "Правовое основание: ст. 6(1)(f) GDPR — наш законный интерес в технически корректной работе сайта."], link: null },
        { heading: "Вход через Battle.net", body: ["Вход необязателен. Если ты им пользуешься, происходит переход на страницу входа Blizzard Entertainment. Мы получаем только псевдонимный идентификатор Battle.net. Мы не получаем ни пароль, ни BattleTag, ни адрес электронной почты, ни историю персонажей и групп.", "Правовое основание: ст. 6(1)(b) GDPR — исполнение договора и преддоговорные меры."], link: null },
        { heading: "Данные профиля и подбор", body: ["Указанные тобой интересы, роль, опыт, обычное время игры, необязательная возрастная группа и необязательное описание сохраняются вместе с идентификатором Battle.net. Общие слова в описаниях могут повысить совместимость максимум на пять процентных пунктов. Текст не показывается другим игрокам. Подбор добровольный: профиль можно в любой момент сделать приватным, чтобы исключить его из подбора.", "Правовое основание: ст. 6(1)(a) и (b) GDPR."], link: null },
        { heading: "Цели и критерии поиска", body: ["Необязательные классы, фракции, цели и критерии сохраняются с профилем и не показываются другим игрокам. Невыполненные обязательные критерии исключают пару в обоих направлениях. Пожелания влияют на порядок без исключения игроков. При наличии критериев их выполнение составляет 20% оценки с равным весом для обоих участников; прежняя оценка расписания, занятий, роли, опыта и возраста составляет 80%. Бонус описания добавляется после этого. Предпочтения роли различают сходство и дополнение; опыт сравнивается по выбранным категориям, а не по проверенному мастерству.", "Правовое основание: ст. 6(1)(a) и (b) GDPR."], link: null },
        { heading: "Файлы cookie", body: ["Мы используем только технически необходимый зашифрованный сеансовый cookie, чтобы сохранять твой вход. Отслеживающих и рекламных cookie нет, аналитические сервисы не подключены.", "Правовое основание: § 25(2) TDDDG и ст. 6(1)(f) GDPR."], link: null },
        { heading: "Срок хранения и удаление", body: ["Данные профиля хранятся, пока ты их не удалишь. Профиль можно удалить в любой момент в настройках; удаление вступает в силу сразу и необратимо. Журналы сервера удаляются через короткое время, если они не нужны в качестве доказательства."], link: null },
        { heading: "Твои права", body: ["У тебя есть право на доступ, исправление, удаление, ограничение обработки, переносимость данных и возражение против обработки. Согласие можно отозвать в любой момент с действием на будущее. Также ты вправе подать жалобу в надзорный орган по защите данных."], link: null },
        { heading: "Контакт", body: ["По любым вопросам о своих данных пиши на адрес электронной почты, указанный в выходных данных. Мы отвечаем в течение месяца."], link: null },
      ],
    },
  },
};
