import { sessionPrivacyText } from "./security";
import { conversionText, metaPrivacyText, redditCapiPrivacyText } from "./marketing";
import type { Locale } from "./config";
import { profileText } from "./profile";

export const operator = {
  name: "David Theobald",
  address: {
    en: "Address available on request.",
    de: "Anschrift auf Anfrage.",
    fr: "Adresse sur demande.",
    es: "Dirección disponible previa solicitud.",
    it: "Indirizzo disponibile su richiesta.",
    pt: "Morada disponível mediante pedido.",
    "pt-BR": "Endereço disponível mediante solicitação.",
    pl: "Adres dostępny na żądanie.",
    ru: "Адрес предоставляется по запросу.",
  },
  email: "hello@wowsoulmate.com",
};

export const legalUpdated = "2026-09-15";

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
  "pt-BR": {
    back: "Voltar ao mundo", imprintLink: "Informações legais", privacyLink: "Política de privacidade", operatorHeading: "Responsável pelo serviço", contactLabel: "Contato", updatedLabel: "Última atualização",
    imprint: {
      title: "Informações legais", lead: "Informações de acordo com o § 5 da DDG, lei alemã de serviços digitais.",
      sections: [
        { heading: "Responsabilidade pelo conteúdo", body: ["Como prestador de serviços, somos responsáveis pelo conteúdo próprio destas páginas de acordo com a legislação geral. Não somos obrigados a monitorar informações de terceiros transmitidas ou armazenadas, nem a investigar circunstâncias que indiquem atividades ilegais."], link: null },
        { heading: "Responsabilidade por links", body: ["Este site contém links para sites externos cujo conteúdo não controlamos. Não assumimos responsabilidade pelo conteúdo de terceiros; a responsabilidade é do respectivo provedor ou operador. Não identificamos conteúdo ilegal quando os links foram incluídos."], link: null },
        { heading: "Direitos autorais", body: ["O conteúdo criado pelo responsável por este site está sujeito à legislação alemã de direitos autorais. As contribuições de terceiros são identificadas. A reprodução, edição, distribuição e qualquer uso além dos limites legais exigem autorização por escrito."], link: null },
        { heading: "Resolução de conflitos on-line", body: ["A Comissão Europeia disponibiliza uma plataforma para resolução de conflitos on-line. Não somos obrigados nem estamos dispostos a participar de procedimentos de resolução de conflitos perante uma entidade de arbitragem de consumidores."], link: { label: "Plataforma europeia de resolução de conflitos", href: odr } },
        { heading: "Marcas", body: ["WoW Soulmate é um projeto independente de fãs. World of Warcraft e Blizzard Entertainment são marcas ou marcas registradas da Blizzard Entertainment, Inc. Este projeto não é afiliado nem endossado pela Blizzard Entertainment."], link: null },
      ],
    },
    privacy: {
      title: "Política de privacidade", lead: "Esta política explica quais dados pessoais tratamos quando você usa o WoW Soulmate, por quais motivos e quais são seus direitos.",
      sections: [
        { heading: "Responsável pelo tratamento", body: ["O responsável pelo tratamento de dados neste site é o prestador de serviços identificado acima. Você pode entrar em contato pelo e-mail informado."], link: null },
        { heading: "Registros do servidor", body: ["Nosso provedor de hospedagem coleta e armazena automaticamente informações transmitidas pelo navegador: tipo e versão do navegador, sistema operacional, URL de origem, nome do host, horário da solicitação e endereço IP. Esses dados não são combinados com outras fontes.", "Base legal: art. 6(1)(f) do GDPR, Regulamento Geral de Proteção de Dados da União Europeia; nosso interesse legítimo em oferecer um site tecnicamente funcional."], link: null },
        { heading: "Login com Battle.net", body: [profileText["pt-BR"].privacy, "Base legal: art. 6(1)(b) do GDPR; execução de contrato e medidas pré-contratuais."], link: null },
        { heading: "Dados de perfil e busca de companheiros", body: ["Seus interesses, funções no grupo, experiência, horários habituais, faixa etária e descrição opcional são armazenados com seu identificador Battle.net. Termos em comum nas descrições podem acrescentar até cinco pontos percentuais à compatibilidade. O texto não é exibido a outros jogadores. A participação na busca é opcional: você pode tornar seu perfil privado a qualquer momento para excluí-lo dos resultados.", "Base legal: art. 6(1)(a) e (b) do GDPR."], link: null },
        { heading: "Objetivos e preferências de busca", body: ["Classes, facções, objetivos e preferências de busca opcionais são armazenados com o perfil e não são exibidos a outros jogadores. Critérios obrigatórios não atendidos impedem a conexão em qualquer direção. Preferências influenciam a classificação sem excluir jogadores. Quando há critérios de busca, seu atendimento representa 20% da pontuação, com o mesmo peso para os dois participantes; horários, atividades, funções, experiência e idade representam 80%. O bônus da descrição é adicionado depois. As preferências de função distinguem semelhança de complementaridade; a experiência é comparada pelas categorias escolhidas, não por habilidade verificada.", "Base legal: art. 6(1)(a) e (b) do GDPR."], link: null },
        { heading: "Cookies e pixel do Reddit", body: [
          "Usamos cookies tecnicamente necessários para o login. Sua escolha de marketing fica no armazenamento local do navegador por até 180 dias; a recusa também é registrada em um cookie próprio. Essas configurações não exigem consentimento de marketing. Base legal do armazenamento necessário: § 25(2) da TDDDG e art. 6(1)(f) do GDPR.",
          "Somente após sua autorização carregamos o pixel do Reddit (Reddit, Inc.) para enviar eventos PageVisit e medir visitas atribuídas aos nossos anúncios. O Reddit recebe dados técnicos como IP, informações do navegador, URLs visitadas e identificadores de publicidade ou cookies. Pode usar cookies para relacionar visitas a anúncios e contas Reddit e tratar dados nos Estados Unidos. Nossa integração não envia explicitamente e-mails, telefones, identificadores Battle.net, dados de perfil ou feedback como chaves de correspondência ou parâmetros de eventos.",
          "O rastreamento opcional se baseia no consentimento conforme § 25(1) da TDDDG e art. 6(1)(a) do GDPR. A recusa não limita o serviço. Você pode revogar o consentimento em Configurações de cookies no rodapé. A revogação interrompe o rastreamento futuro e recarrega a página, mas não desfaz dados já enviados. Removemos os cookies Reddit acessíveis no nosso domínio; não podemos excluir cookies dos domínios Reddit.",
          "O prazo de 180 dias se refere à sua escolha local, não à retenção de eventos pelo Reddit. A política de privacidade do Reddit informa sobre tratamento, armazenamento, transferências internacionais e direitos. Esta integração não envia solicitações publicitárias antes do consentimento ou após a recusa.",
        ], link: { label: "Política de privacidade do Reddit", href: "https://www.reddit.com/policies/privacy-policy" } },
        { heading: "Prazo de armazenamento e exclusão", body: ["Os dados do perfil são armazenados até você excluí-los. Você pode excluir seu perfil a qualquer momento nas configurações; a exclusão é imediata e irreversível. Os registros do servidor são excluídos após um curto período, salvo quando necessários como prova."], link: null },
        { heading: "Seus direitos", body: ["Você tem direito a acesso, correção, exclusão, restrição do tratamento, portabilidade dos dados e oposição ao tratamento. Pode revogar seu consentimento a qualquer momento, com efeito futuro. Também pode apresentar uma reclamação a uma autoridade de proteção de dados."], link: null },
        { heading: "Formulário de feedback do addon", body: [
          "O formulário é opcional e exige login. Tratamos o e-mail e a mensagem informados para analisar ideias, melhorar o conceito do addon e responder a você. Os dois campos são obrigatórios para enviar; seu e-mail é usado como endereço de resposta. O feedback não é publicado nem usado para busca de companheiros ou marketing.",
          "As mensagens são enviadas ao responsável identificado acima pelo Resend (Plus Five Five, Inc., EUA). O Resend e o provedor de e-mail do responsável tratam o conteúdo, os endereços de e-mail e os metadados de entrega. Também enviamos ao Resend um identificador pseudônimo derivado da sua conta e de um intervalo de cinco minutos para evitar envios duplicados. Seu identificador Battle.net não consta no e-mail. O adendo de tratamento de dados do Resend descreve o tratamento nos EUA e as cláusulas contratuais padrão da UE para as transferências aplicáveis.",
          "O aplicativo não salva feedback no banco de perfis. Cópias e registros de entrega podem permanecer no Resend e na caixa de e-mail do responsável. A retenção depende do tempo necessário para tratar a solicitação e seu acompanhamento, das obrigações legais e das condições dos provedores. Excluir seu perfil não exclui automaticamente essas cópias. Para solicitar a exclusão, entre em contato pelo e-mail acima.",
          "Para limitar abusos, o banco armazena um identificador pseudônimo da conta derivado de uma chave secreta e o próximo horário de envio permitido, mas não armazena conteúdo do feedback nem e-mail nessa tabela. É permitida uma tentativa de envio a cada cinco minutos. Registros de limite expirados são removidos pela limpeza diária agendada; permanecem até a limpeza ser concluída.",
          "Base legal: art. 6(1)(f) do GDPR; nossos interesses legítimos são responder ao feedback voluntário, melhorar o serviço e evitar envios duplicados. Você pode se opor ao tratamento por motivos relacionados à sua situação particular.",
        ], link: { label: "Resend: adendo de tratamento de dados", href: "https://resend.com/legal/dpa" } },
        { heading: "Contato", body: ["Para qualquer solicitação sobre seus dados, escreva para o e-mail das informações legais. Responderemos em até um mês."], link: null },
      ],
    },
  },
  pl: {
    back: "Wróć do świata", imprintLink: "Informacje prawne", privacyLink: "Polityka prywatności", operatorHeading: "Usługodawca", contactLabel: "Kontakt", updatedLabel: "Ostatnia aktualizacja",
    imprint: {
      title: "Informacje prawne", lead: "Informacje zgodnie z § 5 DDG, niemieckiej ustawy o usługach cyfrowych.",
      sections: [
        { heading: "Odpowiedzialność za treści", body: ["Jako usługodawca odpowiadamy za własne treści na tych stronach na zasadach ogólnych. Nie mamy obowiązku monitorowania przekazywanych lub przechowywanych informacji osób trzecich ani badania okoliczności wskazujących na bezprawne działania."], link: null },
        { heading: "Odpowiedzialność za odnośniki", body: ["Serwis zawiera odnośniki do zewnętrznych stron, na których treść nie mamy wpływu. Nie odpowiadamy za treści osób trzecich; odpowiada za nie właściwy dostawca lub operator. W chwili dodania odnośników nie stwierdzono treści niezgodnych z prawem."], link: null },
        { heading: "Prawa autorskie", body: ["Treści stworzone przez operatora strony podlegają niemieckiemu prawu autorskiemu. Wkład osób trzecich jest odpowiednio oznaczony. Powielanie, opracowywanie, rozpowszechnianie i inne wykorzystanie wykraczające poza granice prawa autorskiego wymagają pisemnej zgody."], link: null },
        { heading: "Rozstrzyganie sporów przez internet", body: ["Komisja Europejska udostępnia platformę internetowego rozstrzygania sporów. Nie jesteśmy zobowiązani ani gotowi do udziału w postępowaniach przed konsumencką komisją arbitrażową."], link: { label: "Europejska platforma ODR", href: odr } },
        { heading: "Znaki towarowe", body: ["WoW Soulmate jest niezależnym projektem fanowskim. World of Warcraft i Blizzard Entertainment są znakami towarowymi lub zarejestrowanymi znakami Blizzard Entertainment, Inc. Projekt nie jest powiązany z Blizzard Entertainment ani przez tę firmę wspierany."], link: null },
      ],
    },
    privacy: {
      title: "Polityka prywatności", lead: "Ta polityka wyjaśnia, jakie dane osobowe przetwarzamy podczas korzystania z WoW Soulmate, dlaczego to robimy i jakie masz prawa.",
      sections: [
        { heading: "Administrator danych", body: ["Administratorem danych przetwarzanych w tym serwisie jest wskazany wyżej usługodawca. Możesz się z nami skontaktować pod podanym adresem e-mail."], link: null },
        { heading: "Logi serwera", body: ["Nasz dostawca hostingu automatycznie zbiera i zapisuje informacje przesyłane przez przeglądarkę: typ i wersję przeglądarki, system operacyjny, adres strony odsyłającej, nazwę hosta, czas żądania i adres IP. Dane te nie są łączone z innymi źródłami.", "Podstawa prawna: art. 6 ust. 1 lit. f RODO; nasz prawnie uzasadniony interes polegający na zapewnieniu poprawnego działania strony."], link: null },
        { heading: "Logowanie przez Battle.net", body: [profileText.pl.privacy, "Podstawa prawna: art. 6 ust. 1 lit. b RODO; wykonanie umowy i działania przed jej zawarciem."], link: null },
        { heading: "Dane profilu i dobieranie graczy", body: ["Zainteresowania, role w grupie, doświadczenie, zwykłe godziny gry, grupa wiekowa i opcjonalny opis są zapisywane z identyfikatorem Battle.net. Wspólne słowa w opisach mogą dodać do wyniku dopasowania maksymalnie pięć punktów procentowych. Opis nie jest pokazywany innym graczom. Udział w dobieraniu jest dobrowolny: możesz w każdej chwili ustawić profil jako prywatny, aby wyłączyć go z wyników.", "Podstawa prawna: art. 6 ust. 1 lit. a i b RODO."], link: null },
        { heading: "Cele i preferencje wyszukiwania", body: ["Opcjonalne klasy, frakcje, cele i preferencje są przechowywane z profilem i nie są pokazywane innym graczom. Niespełnione wymagane kryteria wykluczają dopasowanie w obu kierunkach. Preferencje wpływają na kolejność bez wykluczania graczy. Jeśli podano kryteria, ich spełnienie stanowi 20% wyniku z równą wagą obu uczestników; godziny gry, aktywności, role, doświadczenie i wiek stanowią 80%. Premia za opis jest dodawana później. Preferencje ról rozróżniają podobieństwo i uzupełnianie się; porównanie doświadczenia opiera się na wybranych kategoriach, nie na zweryfikowanych umiejętnościach.", "Podstawa prawna: art. 6 ust. 1 lit. a i b RODO."], link: null },
        { heading: "Pliki cookie i piksel Reddit", body: [
          "Używamy technicznie niezbędnych plików cookie do logowania. Wybór dotyczący marketingu jest przechowywany lokalnie w przeglądarce do 180 dni; odmowa także we własnym pliku cookie. Te ustawienia nie wymagają zgody marketingowej. Podstawa niezbędnego przechowywania: § 25 ust. 2 TDDDG i art. 6 ust. 1 lit. f RODO.",
          "Dopiero po zgodzie na śledzenie marketingowe ładujemy piksel Reddit (Reddit, Inc.), aby wysyłać zdarzenia PageVisit i mierzyć wizyty z naszych reklam. Reddit otrzymuje dane techniczne, takie jak IP, informacje o przeglądarce, odwiedzane adresy URL oraz identyfikatory reklamowe lub cookie. Może używać cookie do powiązania wizyt z reklamami i kontami Reddit oraz przetwarzać dane w USA. Nasza integracja nie przesyła jawnie adresów e-mail, telefonów, identyfikatorów Battle.net, danych profilu ani opinii jako kluczy dopasowania lub parametrów zdarzeń.",
          "Opcjonalne śledzenie opiera się na zgodzie zgodnie z § 25 ust. 1 TDDDG i art. 6 ust. 1 lit. a RODO. Odmowa nie ogranicza usługi. Zgodę możesz wycofać w Ustawieniach plików cookie w stopce. Wycofanie zatrzymuje przyszłe śledzenie i przeładowuje stronę, ale nie cofa już przesłanych danych. Usuwamy dostępne cookie Reddit z naszej domeny; nie możemy usunąć cookie z domen Reddit.",
          "Okres 180 dni dotyczy twojego lokalnego wyboru, nie przechowywania zdarzeń przez Reddit. Szczegóły przetwarzania, przechowywania, transferów międzynarodowych i praw opisuje polityka Reddit. Ta integracja nie wysyła żądań reklamowych przed zgodą ani po odmowie.",
        ], link: { label: "Polityka prywatności Reddit", href: "https://www.reddit.com/policies/privacy-policy" } },
        { heading: "Okres przechowywania i usuwanie", body: ["Dane profilu są przechowywane do jego usunięcia. Możesz usunąć profil w ustawieniach w każdej chwili; usunięcie jest natychmiastowe i nieodwracalne. Logi serwera są usuwane po krótkim czasie, chyba że są potrzebne jako dowód."], link: null },
        { heading: "Twoje prawa", body: ["Masz prawo dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia oraz wniesienia sprzeciwu. Zgodę możesz wycofać w dowolnym momencie ze skutkiem na przyszłość. Masz również prawo złożyć skargę do organu nadzorczego ochrony danych."], link: null },
        { heading: "Formularz opinii o dodatku", body: [
          "Korzystanie z formularza jest dobrowolne i wymaga logowania. Przetwarzamy podany e-mail i wiadomość, aby rozpatrzyć pomysły, ulepszyć koncepcję dodatku i odpowiedzieć. Oba pola są wymagane do wysłania; e-mail służy jako adres odpowiedzi. Opinie nie są publikowane ani używane do dobierania graczy lub marketingu.",
          "Wiadomości są przesyłane wskazanemu wyżej operatorowi przez Resend (Plus Five Five, Inc., USA). Resend i dostawca poczty operatora przetwarzają treść, adresy e-mail i metadane dostarczenia. Wysyłamy też Resend pseudonimowy identyfikator wyprowadzony z konta i pięciominutowego przedziału, aby zapobiegać duplikatom. Identyfikator Battle.net nie jest zawarty w e-mailu. Umowa powierzenia Resend opisuje przetwarzanie w USA oraz standardowe klauzule umowne UE dla odpowiednich transferów.",
          "Aplikacja nie zapisuje opinii w bazie profili. Kopie i zapisy dostarczenia mogą pozostać w Resend i skrzynce operatora. Okres przechowywania zależy od czasu potrzebnego na obsługę zgłoszenia, obowiązków prawnych i zasad dostawców. Usunięcie profilu nie usuwa automatycznie tych kopii. W sprawie usunięcia napisz do operatora na podany adres.",
          "Aby ograniczyć nadużycia, baza przechowuje pseudonimowy identyfikator konta wyprowadzony z tajnego klucza i czas kolejnej dozwolonej wysyłki, bez treści opinii i adresu e-mail. Dozwolona jest jedna próba wysyłki co pięć minut. Wygasłe rekordy limitów usuwa codzienne zadanie porządkowe; pozostają do czasu jego pomyślnego wykonania.",
          "Podstawa prawna: art. 6 ust. 1 lit. f RODO; nasze uzasadnione interesy to odpowiadanie na dobrowolne opinie, ulepszanie usługi i zapobieganie duplikatom. Możesz wnieść sprzeciw z przyczyn związanych ze swoją szczególną sytuacją.",
        ], link: { label: "Resend: umowa powierzenia przetwarzania danych", href: "https://resend.com/legal/dpa" } },
        { heading: "Kontakt", body: ["W sprawach dotyczących danych napisz na adres e-mail w informacjach prawnych. Odpowiemy w ciągu miesiąca."], link: null },
      ],
    },
  },
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
        { heading: "Signing in with Battle.net", body: [profileText.en.privacy, "Legal basis: Art. 6(1)(b) GDPR — performance of a contract and pre-contractual measures."], link: null },
        { heading: "Profile data and matching", body: ["The interests, group role, experience, usual playtime, optional age range and optional description you enter are stored together with your Battle.net identifier. Shared terms in descriptions can add up to five percentage points to the matching score. The text is not displayed to other players. Matching is opt-in: you can switch your profile to private at any time so that it is excluded from matching.", "Legal basis: Art. 6(1)(a) and (b) GDPR."], link: null },
        { heading: "Goals and search preferences", body: ["Optional classes, factions, goals and search preferences are stored with your profile and are not shown to other players. Unmet must criteria exclude a match in either direction. Wishes affect ranking without excluding players. If search criteria are present, their fulfilment accounts for 20% of the score, giving both participants equal weight; the existing schedule, activity, role, experience and age score accounts for 80%. The description bonus is added afterwards. Role preferences distinguish similarity from complementarity; experience comparisons use the selected experience categories, not verified skill.", "Legal basis: Art. 6(1)(a) and (b) GDPR."], link: null },
        { heading: "Cookies and Reddit Pixel", body: [
          "We use technically necessary cookies for sign-in. Your marketing choice is stored in local storage for up to 180 days; a refusal is also stored in a first-party cookie. These settings do not require marketing consent. Legal basis for necessary storage: § 25(2) TDDDG and Art. 6(1)(f) GDPR.",
          "Only after you accept marketing tracking do we load the Reddit Pixel (Reddit, Inc.) to send PageVisit events and measure visits attributable to our Reddit ads. Reddit receives technical data such as IP address, browser information, visited URLs and advertising or cookie identifiers. Reddit may use cookies to associate visits with ads and Reddit accounts and may process data in the USA. Our integration does not explicitly send email addresses, phone numbers, Battle.net identifiers, profile data or feedback as match keys or event parameters.",
          "Optional tracking is based on your consent under § 25(1) TDDDG and Art. 6(1)(a) GDPR. Rejecting it does not restrict the service. You can withdraw consent at any time using Cookie settings in the footer. Withdrawal stops future tracking and reloads the page; it cannot undo data already transmitted. Accessible first-party Reddit cookies are removed; we cannot delete cookies on Reddit’s domains.",
          "The 180-day period applies to your local consent choice, not to Reddit’s retention of event data. Details of Reddit’s processing, storage, international transfers and privacy rights are described in Reddit’s privacy policy. No advertising requests are sent by this integration before consent or after rejection.",
        ], link: { label: "Reddit privacy policy", href: "https://www.reddit.com/policies/privacy-policy" } },
        { heading: "Storage period and deletion", body: ["Profile data is stored until you delete it. You can delete your profile at any time in your profile settings; deletion takes effect immediately and cannot be undone. Server log files are deleted after a short period unless they are needed as evidence."], link: null },
        { heading: "Your rights", body: ["You have the right to information, rectification, erasure, restriction of processing, data portability, and to object to processing. You may withdraw consent at any time with effect for the future. You also have the right to lodge a complaint with a data protection supervisory authority."], link: null },
        { heading: "Addon feedback form", body: [
          "Using the feedback form is voluntary and requires sign-in. We process the email address and message you enter to review your ideas, improve the addon concept and reply to you. Both fields are required to submit the form; your email address is used as the reply address. Feedback is not published, used for matching or used for marketing.",
          "Messages are sent to the operator named above through Resend (Plus Five Five, Inc., USA). Resend and the operator’s email provider process message content, email addresses and delivery metadata. We also send Resend a pseudonymous identifier derived from your account identifier and a five-minute time window to prevent duplicate sends. Your Battle.net identifier is not included in the email. Resend describes US processing and EU Standard Contractual Clauses for applicable transfers in its linked Data Processing Addendum.",
          "The application does not save feedback in the profile database. Copies and delivery records can remain with Resend and in the operator’s mailbox. Retention depends on the time needed to handle the request and any follow-up, applicable retention obligations and provider retention arrangements. Deleting your profile does not automatically delete these copies. For a deletion request, contact the operator using the email address above.",
          "To limit abuse, our database stores a secret-key-derived pseudonymous account identifier and the next allowed sending time, but no feedback content or email address. One sending attempt is allowed every five minutes. Expired limit records are removed by the scheduled daily cleanup; they remain until cleanup succeeds.",
          "Legal basis: Art. 6(1)(f) GDPR; our legitimate interests are responding to voluntarily submitted feedback, improving the service and preventing duplicate sends. You may object to processing on grounds relating to your particular situation.",
        ], link: { label: "Resend: Data Processing Addendum", href: "https://resend.com/legal/dpa" } },
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
        { heading: "Anmeldung über Battle.net", body: [profileText.de.privacy, "Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO — Vertragserfüllung und vorvertragliche Maßnahmen."], link: null },
        { heading: "Profildaten und Matching", body: ["Die von dir angegebenen Interessen, deine Rolle in der Gruppe, deine Erfahrung, deine übliche Spielzeit, die optionale Altersgruppe und der optionale Beschreibungstext werden gemeinsam mit deiner Battle.net-Kennung gespeichert. Gemeinsame Begriffe in den Beschreibungstexten können den Matching-Wert um bis zu fünf Prozentpunkte erhöhen. Der Text wird anderen Spielern nicht angezeigt. Matching ist freiwillig: Du kannst dein Profil jederzeit auf privat stellen, damit es vom Matching ausgenommen wird.", "Rechtsgrundlage: Art. 6 Abs. 1 lit. a und b DSGVO."], link: null },
        { heading: "Ziele und Suchkriterien", body: ["Optionale Klassen, Fraktionen, Ziele und Suchkriterien werden mit deinem Profil gespeichert und anderen Spielern nicht angezeigt. Unerfüllte Muss-Kriterien schließen ein Match in beiden Richtungen aus. Wünsche beeinflussen die Reihenfolge, ohne Spieler auszuschließen. Bei vorhandenen Suchkriterien zählt deren Erfüllung zu 20 % zum Wert, wobei beide Personen gleich gewichtet werden; die bisherige Bewertung aus Spielzeiten, Aktivitäten, Rolle, Erfahrung und Alter zählt zu 80 %. Der Beschreibungsbonus kommt anschließend hinzu. Rollenpräferenzen unterscheiden Ähnlichkeit und Ergänzung; Erfahrungsvergleiche nutzen die gewählten Erfahrungskategorien, nicht überprüfte Spielstärke.", "Rechtsgrundlage: Art. 6 Abs. 1 lit. a und b DSGVO."], link: null },
        { heading: "Cookies und Reddit-Pixel", body: [
          "Wir verwenden technisch notwendige Cookies für die Anmeldung. Deine Marketing-Auswahl wird für bis zu 180 Tage im lokalen Browserspeicher gespeichert; eine Ablehnung zusätzlich in einem eigenen Cookie. Für diese Einstellungen ist keine Marketing-Einwilligung erforderlich. Rechtsgrundlage der notwendigen Speicherung: § 25 Abs. 2 TDDDG und Art. 6 Abs. 1 lit. f DSGVO.",
          "Erst nach deiner Zustimmung zum Marketing-Tracking laden wir den Reddit-Pixel (Reddit, Inc.), um PageVisit-Ereignisse zu senden und Besuche über unsere Reddit-Anzeigen zu messen. Reddit erhält technische Daten wie IP-Adresse, Browserinformationen, besuchte URLs sowie Werbe- oder Cookie-Kennungen. Reddit kann Cookies zur Zuordnung von Besuchen zu Anzeigen und Reddit-Konten verwenden und Daten in den USA verarbeiten. Unsere Integration übergibt E-Mail-Adressen, Telefonnummern, Battle.net-Kennungen, Profildaten oder Feedback nicht ausdrücklich als Match Keys oder Ereignisparameter.",
          "Rechtsgrundlage des optionalen Trackings ist deine Einwilligung nach § 25 Abs. 1 TDDDG und Art. 6 Abs. 1 lit. a DSGVO. Eine Ablehnung schränkt die Nutzung nicht ein. Du kannst die Einwilligung jederzeit über Cookie-Einstellungen im Footer widerrufen. Der Widerruf stoppt zukünftiges Tracking und lädt die Seite neu; bereits übermittelte Daten werden dadurch nicht zurückgerufen. Zugängliche Reddit-Cookies auf unserer Domain werden entfernt; Cookies auf Reddit-Domains können wir nicht löschen.",
          "Die Frist von 180 Tagen betrifft deine lokale Einwilligungsauswahl, nicht die Aufbewahrung von Ereignisdaten bei Reddit. Einzelheiten zu Verarbeitung, Speicherung, Drittlandübermittlungen und Datenschutzrechten findest du in Reddits Datenschutzerklärung. Vor der Zustimmung und nach einer Ablehnung sendet diese Integration keine Werbe-Anfragen.",
        ], link: { label: "Reddit-Datenschutzerklärung", href: "https://www.reddit.com/policies/privacy-policy" } },
        { heading: "Speicherdauer und Löschung", body: ["Profildaten werden gespeichert, bis du sie löschst. Du kannst dein Profil jederzeit in den Profileinstellungen löschen; die Löschung wirkt sofort und ist nicht umkehrbar. Server-Logfiles werden nach kurzer Zeit gelöscht, sofern sie nicht als Beweismittel benötigt werden."], link: null },
        { heading: "Deine Rechte", body: ["Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch gegen die Verarbeitung. Eine erteilte Einwilligung kannst du jederzeit mit Wirkung für die Zukunft widerrufen. Außerdem steht dir ein Beschwerderecht bei einer Datenschutz-Aufsichtsbehörde zu."], link: null },
        { heading: "Feedbackformular zum Addon", body: [
          "Die Nutzung des Feedbackformulars ist freiwillig und setzt eine Anmeldung voraus. Wir verarbeiten deine eingegebene E-Mail-Adresse und Nachricht, um deine Ideen auszuwerten, das Addon-Konzept weiterzuentwickeln und dir zu antworten. Beide Felder sind für das Absenden erforderlich; deine E-Mail-Adresse dient als Antwortadresse. Feedback wird nicht veröffentlicht, nicht für das Matching und nicht für Werbung verwendet.",
          "Der Versand an den oben genannten Betreiber erfolgt über Resend (Plus Five Five, Inc., USA). Resend und der E-Mail-Anbieter des Betreibers verarbeiten Nachrichteninhalt, E-Mail-Adressen und Zustellungsdaten. Zusätzlich übermitteln wir Resend eine aus deiner Kontokennung und einem Fünf-Minuten-Zeitfenster abgeleitete pseudonyme Kennung, um doppelten Versand zu verhindern. Deine Battle.net-Kennung steht nicht in der E-Mail. Resend beschreibt die Verarbeitung in den USA und EU-Standardvertragsklauseln für entsprechende Übermittlungen in der verlinkten Vereinbarung zur Auftragsverarbeitung.",
          "Die Anwendung speichert Feedback nicht in der Profildatenbank. Kopien und Versandprotokolle können bei Resend und im Postfach des Betreibers verbleiben. Die Speicherdauer richtet sich nach der erforderlichen Bearbeitung einschließlich Rückfragen, einschlägigen Aufbewahrungspflichten und den Speicherregelungen der Anbieter. Das Löschen deines Profils löscht diese Kopien nicht automatisch. Für eine Löschanfrage wende dich an die oben genannte E-Mail-Adresse des Betreibers.",
          "Zur Begrenzung von Missbrauch speichert unsere Datenbank eine mit einem geheimen Schlüssel abgeleitete pseudonyme Kontokennung und den nächsten erlaubten Versandzeitpunkt, aber keine Feedbackinhalte oder E-Mail-Adresse. Pro Konto ist alle fünf Minuten ein Versandversuch erlaubt. Abgelaufene Sperreinträge werden durch die geplante tägliche Bereinigung entfernt; bis zu deren erfolgreicher Ausführung bleiben sie gespeichert.",
          "Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO; unsere berechtigten Interessen sind die Beantwortung freiwillig eingesandten Feedbacks, die Verbesserung des Angebots und die Vermeidung doppelten Versands. Du kannst der Verarbeitung aus Gründen widersprechen, die sich aus deiner besonderen Situation ergeben.",
        ], link: { label: "Resend: Vereinbarung zur Auftragsverarbeitung", href: "https://resend.com/legal/dpa" } },
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
        { heading: "Connexion via Battle.net", body: [profileText.fr.privacy, "Base légale : art. 6, § 1, point b) du RGPD — exécution d’un contrat et mesures précontractuelles."], link: null },
        { heading: "Données de profil et matching", body: ["Les centres d’intérêt, le rôle, l’expérience, les horaires habituels, la tranche d’âge facultative et la description facultative que tu saisis sont enregistrés avec ton identifiant Battle.net. Les termes communs aux descriptions peuvent ajouter jusqu’à cinq points de pourcentage au score de compatibilité. Le texte n’est pas affiché aux autres joueurs. La recherche de partenaires est facultative : tu peux à tout moment rendre ton profil privé afin qu’il en soit exclu.", "Base légale : art. 6, § 1, points a) et b) du RGPD."], link: null },
        { heading: "Objectifs et critères de recherche", body: ["Les classes, factions, objectifs et critères facultatifs sont enregistrés avec ton profil et ne sont pas montrés aux autres joueurs. Un critère obligatoire non satisfait exclut une correspondance dans les deux sens. Les souhaits influencent le classement sans exclure de joueurs. Si des critères sont renseignés, leur satisfaction représente 20 % du score, avec un poids égal pour les deux personnes ; le score existant des horaires, activités, rôle, expérience et âge représente 80 %. Le bonus de description est ajouté ensuite. Les préférences de rôle distinguent similarité et complémentarité ; l’expérience est comparée selon les catégories choisies, pas selon un niveau de jeu vérifié.", "Base légale : art. 6, § 1, points a) et b) du RGPD."], link: null },
        { heading: "Cookies et pixel Reddit", body: [
          "Nous utilisons des cookies nécessaires à la connexion. Ton choix marketing est conservé dans le stockage local du navigateur pendant 180 jours au maximum ; un refus est aussi conservé dans un cookie de notre site. Ces réglages ne nécessitent pas de consentement marketing. Base du stockage nécessaire : § 25, al. 2 TDDDG et art. 6, par. 1, point f du RGPD.",
          "Nous chargeons le pixel Reddit (Reddit, Inc.) uniquement après ton accord pour envoyer des événements PageVisit et mesurer les visites liées à nos publicités Reddit. Reddit reçoit des données techniques : adresse IP, navigateur, URL consultées et identifiants publicitaires ou de cookies. Reddit peut relier les visites aux annonces et aux comptes Reddit et traiter des données aux États-Unis. Notre intégration ne transmet pas explicitement d’e-mail, de téléphone, d’identifiant Battle.net, de données de profil ou de feedback comme clés de correspondance ou paramètres d’événement.",
          "Le suivi facultatif repose sur ton consentement selon le § 25, al. 1 TDDDG et l’art. 6, par. 1, point a du RGPD. Le refus ne limite pas le service. Tu peux retirer ton accord via Paramètres des cookies dans le pied de page. Le retrait arrête le suivi futur et recharge la page, sans annuler les transmissions passées. Les cookies Reddit accessibles sur notre domaine sont supprimés ; nous ne pouvons pas supprimer ceux des domaines Reddit.",
          "Les 180 jours concernent ton choix local, pas la conservation des événements par Reddit. Sa politique de confidentialité décrit le traitement, la conservation, les transferts internationaux et tes droits. Cette intégration n’envoie aucune requête publicitaire avant accord ou après refus.",
        ], link: { label: "Politique de confidentialité de Reddit", href: "https://www.reddit.com/policies/privacy-policy" } },
        { heading: "Durée de conservation et suppression", body: ["Les données de profil sont conservées jusqu’à ce que tu les supprimes. Tu peux supprimer ton profil à tout moment dans ses paramètres ; la suppression est immédiate et irréversible. Les fichiers journaux sont supprimés après une courte période, sauf s’ils sont nécessaires comme preuve."], link: null },
        { heading: "Tes droits", body: ["Tu disposes d’un droit d’accès, de rectification, d’effacement, de limitation du traitement, de portabilité des données et d’opposition au traitement. Tu peux retirer ton consentement à tout moment avec effet pour l’avenir. Tu as également le droit d’introduire une réclamation auprès d’une autorité de contrôle."], link: null },
        { heading: "Formulaire de retour sur l’addon", body: [
          "L’utilisation du formulaire est facultative et nécessite une connexion. Nous traitons l’adresse e-mail et le message saisis pour examiner tes idées, améliorer le concept de l’addon et te répondre. Les deux champs sont requis pour l’envoi ; ton adresse sert d’adresse de réponse. Les retours ne sont ni publiés ni utilisés pour le matching ou la publicité.",
          "L’envoi au responsable indiqué ci-dessus passe par Resend (Plus Five Five, Inc., États-Unis). Resend et le fournisseur de messagerie du responsable traitent le contenu, les adresses e-mail et les données de livraison. Nous transmettons aussi à Resend un identifiant pseudonyme dérivé de ton identifiant de compte et d’une fenêtre de cinq minutes pour éviter les doubles envois. Ton identifiant Battle.net ne figure pas dans l’e-mail. L’accord de traitement des données de Resend, accessible ci-dessous, décrit le traitement aux États-Unis et les clauses contractuelles types de l’UE pour les transferts concernés.",
          "L’application ne stocke pas ces retours dans la base de profils. Des copies et journaux d’envoi peuvent subsister chez Resend et dans la boîte du responsable. La conservation dépend du temps nécessaire au traitement et aux échanges ultérieurs, des obligations de conservation applicables et des règles des fournisseurs. Supprimer ton profil ne supprime pas automatiquement ces copies. Pour demander leur suppression, contacte le responsable à l’adresse ci-dessus.",
          "Pour limiter les abus, notre base conserve un identifiant de compte pseudonyme dérivé avec une clé secrète et l’heure du prochain envoi autorisé, mais ni le contenu du retour ni l’adresse e-mail. Une tentative est autorisée toutes les cinq minutes. Les entrées expirées sont supprimées par le nettoyage quotidien programmé ; elles restent conservées jusqu’à sa réussite.",
          "Base juridique : art. 6, par. 1, point f du RGPD ; nos intérêts légitimes sont de répondre aux retours volontaires, d’améliorer le service et d’éviter les doubles envois. Tu peux t’opposer au traitement pour des raisons tenant à ta situation particulière.",
        ], link: { label: "Resend : accord de traitement des données", href: "https://resend.com/legal/dpa" } },
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
        { heading: "Inicio de sesión con Battle.net", body: [profileText.es.privacy, "Base jurídica: art. 6.1.b del RGPD — ejecución de un contrato y medidas precontractuales."], link: null },
        { heading: "Datos de perfil y emparejamiento", body: ["Los intereses, el rol, la experiencia, los horarios habituales, la franja de edad opcional y la descripción opcional que indiques se guardan junto con tu identificador de Battle.net. Los términos comunes de las descripciones pueden añadir hasta cinco puntos porcentuales a la compatibilidad. El texto no se muestra a otros jugadores. El emparejamiento es voluntario: puedes poner tu perfil en privado en cualquier momento para quedar excluido.", "Base jurídica: art. 6.1.a y 6.1.b del RGPD."], link: null },
        { heading: "Objetivos y criterios de búsqueda", body: ["Las clases, facciones, objetivos y criterios opcionales se guardan con tu perfil y no se muestran a otros jugadores. Los criterios obligatorios incumplidos excluyen una coincidencia en ambas direcciones. Las preferencias influyen en el orden sin excluir jugadores. Cuando hay criterios, su cumplimiento supone el 20 % de la puntuación, con igual peso para ambas personas; la valoración existente de horarios, actividades, rol, experiencia y edad supone el 80 %. El bonus de descripción se añade después. Las preferencias de rol distinguen similitud y complementariedad; la experiencia se compara según las categorías elegidas, no según una habilidad verificada.", "Base jurídica: art. 6.1.a y 6.1.b del RGPD."], link: null },
        { heading: "Cookies y píxel de Reddit", body: [
          "Usamos cookies necesarias para iniciar sesión. Tu elección de marketing se guarda en el almacenamiento local durante un máximo de 180 días; el rechazo también se guarda en una cookie propia. Estos ajustes no requieren consentimiento de marketing. Base del almacenamiento necesario: § 25.2 TDDDG y art. 6.1.f del RGPD.",
          "Solo tras tu consentimiento cargamos el píxel de Reddit (Reddit, Inc.) para enviar eventos PageVisit y medir visitas desde nuestros anuncios. Reddit recibe datos técnicos como IP, navegador, URL visitadas e identificadores publicitarios o de cookies. Puede asociar visitas con anuncios y cuentas Reddit y tratar datos en Estados Unidos. Nuestra integración no envía expresamente correos, teléfonos, identificadores Battle.net, datos de perfil ni comentarios como claves de coincidencia o parámetros de eventos.",
          "El seguimiento opcional se basa en tu consentimiento según § 25.1 TDDDG y art. 6.1.a del RGPD. Rechazarlo no limita el servicio. Puedes retirarlo en Ajustes de cookies, en el pie de página. La retirada detiene el seguimiento futuro y recarga la página, pero no revierte datos ya enviados. Se eliminan las cookies Reddit accesibles en nuestro dominio; no podemos borrar las de dominios Reddit.",
          "Los 180 días se refieren a tu elección local, no a la conservación de eventos por Reddit. Su política de privacidad explica el tratamiento, la conservación, las transferencias internacionales y tus derechos. Esta integración no envía solicitudes publicitarias antes del consentimiento ni después del rechazo.",
        ], link: { label: "Política de privacidad de Reddit", href: "https://www.reddit.com/policies/privacy-policy" } },
        { heading: "Plazo de conservación y supresión", body: ["Los datos de perfil se conservan hasta que los elimines. Puedes borrar tu perfil en cualquier momento desde sus ajustes; la supresión es inmediata e irreversible. Los archivos de registro se eliminan tras un breve periodo, salvo que se necesiten como prueba."], link: null },
        { heading: "Tus derechos", body: ["Tienes derecho de acceso, rectificación, supresión, limitación del tratamiento, portabilidad de los datos y oposición al tratamiento. Puedes retirar tu consentimiento en cualquier momento con efectos para el futuro. También tienes derecho a presentar una reclamación ante una autoridad de control."], link: null },
        { heading: "Formulario de comentarios sobre el addon", body: [
          "El formulario es voluntario y requiere iniciar sesión. Tratamos el correo electrónico y el mensaje que introduces para revisar tus ideas, mejorar el concepto del addon y responderte. Ambos campos son obligatorios para enviar el formulario; tu correo se utiliza como dirección de respuesta. Los comentarios no se publican ni se utilizan para el matching o la publicidad.",
          "El envío al responsable indicado arriba se realiza mediante Resend (Plus Five Five, Inc., Estados Unidos). Resend y el proveedor de correo del responsable tratan el contenido, las direcciones y los datos de entrega. También enviamos a Resend un identificador seudónimo derivado de tu identificador de cuenta y de un intervalo de cinco minutos para evitar envíos duplicados. Tu identificador de Battle.net no aparece en el correo. El acuerdo de tratamiento de Resend enlazado abajo describe el tratamiento en Estados Unidos y las cláusulas contractuales tipo de la UE para las transferencias correspondientes.",
          "La aplicación no guarda los comentarios en la base de perfiles. Pueden permanecer copias y registros de envío en Resend y en el buzón del responsable. La conservación depende del tiempo necesario para atender la solicitud y su seguimiento, de las obligaciones de conservación aplicables y de las condiciones de los proveedores. Eliminar tu perfil no elimina automáticamente estas copias. Para solicitar su eliminación, contacta con el responsable en el correo indicado arriba.",
          "Para limitar abusos, nuestra base guarda un identificador de cuenta seudónimo derivado con una clave secreta y la hora del próximo envío permitido, pero no el contenido ni el correo electrónico. Se permite un intento cada cinco minutos. Los registros caducados se eliminan mediante la limpieza diaria programada; permanecen hasta que se complete correctamente.",
          "Base jurídica: art. 6.1.f del RGPD; nuestros intereses legítimos son responder a los comentarios voluntarios, mejorar el servicio y evitar envíos duplicados. Puedes oponerte al tratamiento por motivos relacionados con tu situación particular.",
        ], link: { label: "Resend: acuerdo de tratamiento de datos", href: "https://resend.com/legal/dpa" } },
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
        { heading: "Accesso tramite Battle.net", body: [profileText.it.privacy, "Base giuridica: art. 6, par. 1, lett. b) GDPR — esecuzione di un contratto e misure precontrattuali."], link: null },
        { heading: "Dati del profilo e matching", body: ["Gli interessi, il ruolo, l’esperienza, gli orari abituali, la fascia d’età facoltativa e la descrizione facoltativa che inserisci vengono salvati insieme al tuo identificativo Battle.net. I termini in comune nelle descrizioni possono aggiungere fino a cinque punti percentuali al punteggio di affinità. Il testo non viene mostrato agli altri giocatori. Il matching è facoltativo: puoi rendere privato il tuo profilo in qualsiasi momento per escluderlo.", "Base giuridica: art. 6, par. 1, lett. a) e b) GDPR."], link: null },
        { heading: "Obiettivi e criteri di ricerca", body: ["Classi, fazioni, obiettivi e criteri facoltativi sono salvati con il profilo e non mostrati agli altri giocatori. I criteri obbligatori non soddisfatti escludono un abbinamento in entrambe le direzioni. Le preferenze influenzano l’ordine senza escludere giocatori. Se presenti, i criteri soddisfatti valgono il 20% del punteggio, con uguale peso per entrambe le persone; il punteggio esistente di orari, attività, ruolo, esperienza ed età vale l’80%. Il bonus della descrizione viene aggiunto dopo. Le preferenze di ruolo distinguono somiglianza e complementarità; l’esperienza è confrontata in base alle categorie scelte, non all’abilità verificata.", "Base giuridica: art. 6, par. 1, lett. a) e b) GDPR."], link: null },
        { heading: "Cookie e pixel Reddit", body: [
          "Usiamo cookie necessari per l’accesso. La scelta marketing è salvata nello spazio locale del browser per un massimo di 180 giorni; il rifiuto anche in un cookie del sito. Queste impostazioni non richiedono consenso marketing. Base della memorizzazione necessaria: § 25, comma 2 TDDDG e art. 6, par. 1, lett. f GDPR.",
          "Solo dopo il consenso carichiamo il pixel Reddit (Reddit, Inc.) per inviare eventi PageVisit e misurare le visite dai nostri annunci. Reddit riceve dati tecnici come IP, browser, URL visitati e identificativi pubblicitari o di cookie. Può collegare visite ad annunci e account Reddit e trattare dati negli Stati Uniti. L’integrazione non trasmette esplicitamente e-mail, telefoni, identificativi Battle.net, dati del profilo o feedback come chiavi di corrispondenza o parametri degli eventi.",
          "Il tracciamento facoltativo si basa sul consenso ai sensi del § 25, comma 1 TDDDG e dell’art. 6, par. 1, lett. a GDPR. Il rifiuto non limita il servizio. Puoi revocare il consenso da Impostazioni cookie nel footer. La revoca interrompe il tracciamento futuro e ricarica la pagina, senza annullare dati già trasmessi. Rimuoviamo i cookie Reddit accessibili sul nostro dominio, non quelli sui domini Reddit.",
          "I 180 giorni riguardano la scelta locale, non la conservazione degli eventi presso Reddit. La sua informativa descrive trattamento, conservazione, trasferimenti internazionali e diritti. Questa integrazione non invia richieste pubblicitarie prima del consenso o dopo il rifiuto.",
        ], link: { label: "Informativa privacy di Reddit", href: "https://www.reddit.com/policies/privacy-policy" } },
        { heading: "Periodo di conservazione e cancellazione", body: ["I dati del profilo restano memorizzati finché non li elimini. Puoi cancellare il profilo in qualsiasi momento dalle impostazioni; la cancellazione è immediata e irreversibile. I file di log vengono eliminati dopo poco tempo, salvo che servano come prova."], link: null },
        { heading: "I tuoi diritti", body: ["Hai diritto di accesso, rettifica, cancellazione, limitazione del trattamento, portabilità dei dati e opposizione al trattamento. Puoi revocare il consenso in qualsiasi momento con effetto per il futuro. Hai inoltre il diritto di proporre reclamo a un’autorità di controllo."], link: null },
        { heading: "Modulo di feedback sull’addon", body: [
          "L’uso del modulo è facoltativo e richiede l’accesso. Trattiamo l’indirizzo e-mail e il messaggio inseriti per esaminare le tue idee, migliorare il progetto dell’addon e risponderti. Entrambi i campi sono necessari per l’invio; la tua e-mail è utilizzata come indirizzo di risposta. Il feedback non viene pubblicato né usato per il matching o la pubblicità.",
          "L’invio al titolare indicato sopra avviene tramite Resend (Plus Five Five, Inc., Stati Uniti). Resend e il fornitore e-mail del titolare trattano contenuti, indirizzi e dati di consegna. Trasmettiamo inoltre a Resend un identificativo pseudonimo derivato dall’identificativo del tuo account e da un intervallo di cinque minuti per evitare invii duplicati. L’identificativo Battle.net non compare nell’e-mail. L’accordo sul trattamento di Resend, collegato qui sotto, descrive il trattamento negli Stati Uniti e le clausole contrattuali tipo dell’UE per i trasferimenti pertinenti.",
          "L’applicazione non salva il feedback nel database dei profili. Copie e registri di invio possono restare presso Resend e nella casella del titolare. La conservazione dipende dal tempo necessario per gestire la richiesta e i successivi scambi, dagli obblighi di conservazione applicabili e dalle condizioni dei fornitori. Eliminare il profilo non elimina automaticamente queste copie. Per richiederne la cancellazione, contatta il titolare all’indirizzo sopra indicato.",
          "Per limitare gli abusi, il database conserva un identificativo pseudonimo dell’account derivato con una chiave segreta e l’orario del prossimo invio consentito, ma non il contenuto o l’e-mail. È consentito un tentativo ogni cinque minuti. I record scaduti vengono eliminati dalla pulizia giornaliera programmata; restano conservati finché questa non riesce.",
          "Base giuridica: art. 6, par. 1, lett. f GDPR; i nostri interessi legittimi sono rispondere al feedback volontario, migliorare il servizio ed evitare invii duplicati. Puoi opporti al trattamento per motivi connessi alla tua situazione particolare.",
        ], link: { label: "Resend: accordo sul trattamento dei dati", href: "https://resend.com/legal/dpa" } },
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
        { heading: "Início de sessão com Battle.net", body: [profileText.pt.privacy, "Fundamento jurídico: art. 6.º, n.º 1, al. b) do RGPD — execução de um contrato e diligências pré-contratuais."], link: null },
        { heading: "Dados de perfil e matching", body: ["Os interesses, a função, a experiência, os horários habituais, a faixa etária opcional e a descrição opcional que indicares são guardados juntamente com o teu identificador Battle.net. Os termos comuns nas descrições podem acrescentar até cinco pontos percentuais à compatibilidade. O texto não é apresentado a outros jogadores. O matching é opcional: podes tornar o teu perfil privado a qualquer momento para o excluir.", "Fundamento jurídico: art. 6.º, n.º 1, als. a) e b) do RGPD."], link: null },
        { heading: "Objetivos e critérios de procura", body: ["As classes, fações, objetivos e critérios opcionais são guardados com o perfil e não são mostrados a outros jogadores. Os critérios obrigatórios não cumpridos excluem uma correspondência em ambas as direções. As preferências influenciam a ordem sem excluir jogadores. Quando existem critérios, o seu cumprimento vale 20% da pontuação, com peso igual para ambas as pessoas; a avaliação existente de horários, atividades, função, experiência e idade vale 80%. O bónus da descrição é acrescentado depois. As preferências de função distinguem semelhança e complementaridade; a experiência é comparada pelas categorias escolhidas, não por capacidade verificada.", "Fundamento jurídico: art. 6.º, n.º 1, als. a) e b) do RGPD."], link: null },
        { heading: "Cookies e pixel Reddit", body: [
          "Usamos cookies necessários para iniciar sessão. A escolha de marketing fica no armazenamento local por até 180 dias; a recusa também fica num cookie próprio. Estas definições não exigem consentimento de marketing. Base do armazenamento necessário: § 25.º, n.º 2 TDDDG e art. 6.º, n.º 1, al. f do RGPD.",
          "Só após autorização carregamos o pixel Reddit (Reddit, Inc.) para enviar eventos PageVisit e medir visitas dos nossos anúncios. A Reddit recebe dados técnicos como IP, navegador, URLs visitados e identificadores publicitários ou de cookies. Pode associar visitas a anúncios e contas Reddit e tratar dados nos Estados Unidos. A integração não envia expressamente e-mails, telefones, identificadores Battle.net, dados do perfil ou feedback como chaves de correspondência ou parâmetros de eventos.",
          "O rastreamento opcional baseia-se no consentimento nos termos do § 25.º, n.º 1 TDDDG e art. 6.º, n.º 1, al. a do RGPD. Recusar não limita o serviço. Podes retirar o consentimento em Definições de cookies no rodapé. A retirada interrompe o rastreamento futuro e recarrega a página, sem anular dados já enviados. Removemos cookies Reddit acessíveis no nosso domínio, mas não os dos domínios Reddit.",
          "Os 180 dias dizem respeito à escolha local, não à conservação de eventos pela Reddit. A política de privacidade da Reddit descreve tratamento, conservação, transferências internacionais e direitos. Esta integração não envia pedidos publicitários antes da autorização nem após a recusa.",
        ], link: { label: "Política de privacidade da Reddit", href: "https://www.reddit.com/policies/privacy-policy" } },
        { heading: "Prazo de conservação e eliminação", body: ["Os dados do perfil são conservados até que os elimines. Podes apagar o teu perfil a qualquer momento nas definições; a eliminação é imediata e irreversível. Os ficheiros de registo são eliminados após um curto período, salvo se forem necessários como prova."], link: null },
        { heading: "Os teus direitos", body: ["Tens direito de acesso, retificação, apagamento, limitação do tratamento, portabilidade dos dados e oposição ao tratamento. Podes retirar o consentimento a qualquer momento com efeitos para o futuro. Tens também o direito de apresentar reclamação junto de uma autoridade de controlo."], link: null },
        { heading: "Formulário de feedback sobre o addon", body: [
          "A utilização do formulário é voluntária e exige sessão iniciada. Tratamos o e-mail e a mensagem que introduzes para analisar as tuas ideias, melhorar o conceito do addon e responder-te. Os dois campos são necessários para enviar; o teu e-mail é utilizado como endereço de resposta. O feedback não é publicado nem utilizado para o matching ou publicidade.",
          "O envio ao responsável indicado acima é feito através da Resend (Plus Five Five, Inc., Estados Unidos). A Resend e o fornecedor de e-mail do responsável tratam o conteúdo, os endereços e os dados de entrega. Também enviamos à Resend um identificador pseudónimo derivado do identificador da tua conta e de um intervalo de cinco minutos para evitar envios duplicados. O teu identificador Battle.net não consta do e-mail. O acordo de tratamento da Resend, ligado abaixo, descreve o tratamento nos Estados Unidos e as cláusulas contratuais-tipo da UE para as transferências relevantes.",
          "A aplicação não guarda o feedback na base de perfis. Podem permanecer cópias e registos de envio na Resend e na caixa de correio do responsável. A conservação depende do tempo necessário para tratar o pedido e as respostas posteriores, das obrigações de conservação aplicáveis e das condições dos fornecedores. Apagar o perfil não elimina automaticamente estas cópias. Para pedir a eliminação, contacta o responsável no e-mail indicado acima.",
          "Para limitar abusos, a base guarda um identificador pseudónimo da conta derivado com uma chave secreta e a hora do próximo envio permitido, mas não o conteúdo nem o e-mail. É permitida uma tentativa a cada cinco minutos. Os registos expirados são removidos pela limpeza diária programada; permanecem até que esta seja concluída com sucesso.",
          "Base jurídica: art. 6.º, n.º 1, alínea f do RGPD; os nossos interesses legítimos são responder ao feedback voluntário, melhorar o serviço e evitar envios duplicados. Podes opor-te ao tratamento por motivos relacionados com a tua situação particular.",
        ], link: { label: "Resend: acordo de tratamento de dados", href: "https://resend.com/legal/dpa" } },
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
        { heading: "Вход через Battle.net", body: [profileText.ru.privacy, "Правовое основание: ст. 6(1)(b) GDPR — исполнение договора и преддоговорные меры."], link: null },
        { heading: "Данные профиля и подбор", body: ["Указанные тобой интересы, роль, опыт, обычное время игры, необязательная возрастная группа и необязательное описание сохраняются вместе с идентификатором Battle.net. Общие слова в описаниях могут повысить совместимость максимум на пять процентных пунктов. Текст не показывается другим игрокам. Подбор добровольный: профиль можно в любой момент сделать приватным, чтобы исключить его из подбора.", "Правовое основание: ст. 6(1)(a) и (b) GDPR."], link: null },
        { heading: "Цели и критерии поиска", body: ["Необязательные классы, фракции, цели и критерии сохраняются с профилем и не показываются другим игрокам. Невыполненные обязательные критерии исключают пару в обоих направлениях. Пожелания влияют на порядок без исключения игроков. При наличии критериев их выполнение составляет 20% оценки с равным весом для обоих участников; прежняя оценка расписания, занятий, роли, опыта и возраста составляет 80%. Бонус описания добавляется после этого. Предпочтения роли различают сходство и дополнение; опыт сравнивается по выбранным категориям, а не по проверенному мастерству.", "Правовое основание: ст. 6(1)(a) и (b) GDPR."], link: null },
        { heading: "Cookie и пиксель Reddit", body: [
          "Мы используем необходимые cookie для входа. Выбор маркетинга хранится локально в браузере до 180 дней; отказ также сохраняется в cookie нашего сайта. Эти настройки не требуют маркетингового согласия. Основание необходимого хранения: § 25(2) TDDDG и ст. 6(1)(f) GDPR.",
          "Только после согласия мы загружаем пиксель Reddit (Reddit, Inc.) для отправки событий PageVisit и измерения посещений из нашей рекламы. Reddit получает технические данные: IP, сведения о браузере, посещённые URL и рекламные или cookie-идентификаторы. Reddit может связывать посещения с рекламой и аккаунтами и обрабатывать данные в США. Интеграция не передаёт явно адреса почты, телефоны, идентификаторы Battle.net, данные профиля или отзывы как ключи сопоставления или параметры событий.",
          "Необязательное отслеживание основано на согласии по § 25(1) TDDDG и ст. 6(1)(a) GDPR. Отказ не ограничивает сервис. Согласие можно отозвать через Настройки cookie внизу страницы. Отзыв останавливает дальнейшее отслеживание и перезагружает страницу, но не отменяет уже переданные данные. Доступные cookie Reddit на нашем домене удаляются; cookie на доменах Reddit мы удалить не можем.",
          "Срок 180 дней относится к локальному выбору, а не к хранению событий Reddit. Обработка, хранение, международная передача и права описаны в политике Reddit. Эта интеграция не отправляет рекламные запросы до согласия или после отказа.",
        ], link: { label: "Политика конфиденциальности Reddit", href: "https://www.reddit.com/policies/privacy-policy" } },
        { heading: "Срок хранения и удаление", body: ["Данные профиля хранятся, пока ты их не удалишь. Профиль можно удалить в любой момент в настройках; удаление вступает в силу сразу и необратимо. Журналы сервера удаляются через короткое время, если они не нужны в качестве доказательства."], link: null },
        { heading: "Твои права", body: ["У тебя есть право на доступ, исправление, удаление, ограничение обработки, переносимость данных и возражение против обработки. Согласие можно отозвать в любой момент с действием на будущее. Также ты вправе подать жалобу в надзорный орган по защите данных."], link: null },
        { heading: "Форма отзывов об аддоне", body: [
          "Использование формы добровольно и требует входа в аккаунт. Мы обрабатываем указанный адрес почты и сообщение, чтобы рассмотреть идеи, улучшить концепцию аддона и ответить тебе. Оба поля обязательны для отправки; указанный адрес используется для ответа. Отзывы не публикуются и не используются для подбора игроков или рекламы.",
          "Сообщения направляются указанному выше оператору через Resend (Plus Five Five, Inc., США). Resend и почтовый провайдер оператора обрабатывают содержание, адреса почты и данные доставки. Также мы передаём Resend псевдонимный идентификатор, полученный из идентификатора аккаунта и пятиминутного интервала, для предотвращения повторных отправок. Идентификатор Battle.net не включается в письмо. Соглашение Resend об обработке данных по ссылке ниже описывает обработку в США и стандартные договорные положения ЕС для соответствующих передач.",
          "Приложение не сохраняет отзывы в базе профилей. Копии и журналы доставки могут оставаться у Resend и в почтовом ящике оператора. Срок хранения зависит от времени, необходимого для рассмотрения обращения и последующей переписки, применимых обязательств по хранению и условий провайдеров. Удаление профиля не удаляет эти копии автоматически. Для запроса удаления напиши оператору по указанному выше адресу.",
          "Для ограничения злоупотреблений база хранит псевдонимный идентификатор аккаунта, полученный с помощью секретного ключа, и время следующей разрешённой отправки, но не текст отзыва или адрес почты. Разрешена одна попытка каждые пять минут. Истёкшие записи удаляются ежедневной плановой очисткой и остаются до её успешного выполнения.",
          "Правовое основание: ст. 6(1)(f) GDPR; наши законные интересы — отвечать на добровольные отзывы, улучшать сервис и предотвращать повторные отправки. Ты можешь возразить против обработки по причинам, связанным с твоей конкретной ситуацией.",
        ], link: { label: "Resend: соглашение об обработке данных", href: "https://resend.com/legal/dpa" } },
        { heading: "Контакт", body: ["По любым вопросам о своих данных пиши на адрес электронной почты, указанный в выходных данных. Мы отвечаем в течение месяца."], link: null },
      ],
    },
  },
};

for (const locale of Object.keys(legalText) as Locale[]) {
  legalText[locale].privacy.sections[2].body.push(sessionPrivacyText[locale]);
  legalText[locale].privacy.sections[5].body.push(conversionText[locale].privacy);
  legalText[locale].privacy.sections[5].body.push(redditCapiPrivacyText[locale]);
  legalText[locale].privacy.sections.splice(-1, 0, {
    heading: metaPrivacyText[locale].title,
    body: [metaPrivacyText[locale].body],
    link: { label: metaPrivacyText[locale].title, href: "https://www.facebook.com/privacy/policy/" },
  });
}
