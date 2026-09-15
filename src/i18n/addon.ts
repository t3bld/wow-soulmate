import type { Locale } from "./config";

type AddonCopy = {
  navigation: string; title: string; status: string; idea: string; feedback: string;
  message: string; submit: string; pending: string; sent: string;
  invalid: string; failed: string; limited: string; unavailable: string; privacy: string;
};

export const addonText: Record<Locale, AddonCopy> = {
  de: {
    navigation: "Download Addon", title: "WoW Soulmate Addon", status: "In Planung. Noch kein Download verfügbar.",
    idea: "Die Idee: Deine Soulmates auch in Azeroth wiederfinden und gemeinsame Abenteuer leichter verabreden. Ein Ingame-Addon könnte passende Mitspieler direkt im Spiel zusammenbringen. Welche Funktionen fehlen dir dafür?",
    feedback: "Deine Ideen & dein Feedback", message: "Nachricht", submit: "Feedback senden", pending: "Wird gesendet …",
    sent: "Danke! Dein Feedback wurde übermittelt.", invalid: "Bitte gib eine Nachricht mit 10 bis 4.000 Zeichen ein.",
    failed: "Dein Feedback konnte nicht gesendet werden. Bitte versuche es später erneut.", limited: "Bitte warte fünf Minuten, bevor du weiteres Feedback sendest.",
    unavailable: "Der Formularversand ist noch nicht eingerichtet. Du erreichst uns direkt per E-Mail:",
    privacy: "Deine Nachricht wird per E-Mail an David Theobald übermittelt, um dein Feedback zu bearbeiten. Eine E-Mail-Adresse aus deinem Konto wird nicht mitgesendet.",
  },
  en: {
    navigation: "Download addon", title: "WoW Soulmate Addon", status: "Planned. No download available yet.",
    idea: "The idea: find your Soulmates in Azeroth and arrange adventures together more easily. An in-game addon could bring compatible players together right inside the game. Which features would you like?",
    feedback: "Your ideas & feedback", message: "Message", submit: "Send feedback", pending: "Sending …",
    sent: "Thank you! Your feedback has been submitted.", invalid: "Enter a message of 10 to 4,000 characters.",
    failed: "Your feedback could not be sent. Please try again later.", limited: "Please wait five minutes before sending more feedback.",
    unavailable: "Form delivery is not configured yet. You can email us directly:",
    privacy: "Your message is emailed to David Theobald to review your feedback. No email address from your account is included.",
  },
  fr: {
    navigation: "Télécharger l’addon", title: "Addon WoW Soulmate", status: "En projet. Aucun téléchargement disponible pour le moment.",
    idea: "L’idée : retrouver tes Soulmates en Azeroth et organiser plus facilement vos aventures. Un addon pourrait réunir des joueurs compatibles directement en jeu. Quelles fonctionnalités aimerais-tu ?",
    feedback: "Tes idées et tes retours", message: "Message", submit: "Envoyer", pending: "Envoi en cours …",
    sent: "Merci ! Ton message a été transmis.", invalid: "Saisis un message de 10 à 4 000 caractères.",
    failed: "Impossible d’envoyer ton message. Réessaie plus tard.", limited: "Attends cinq minutes avant d’envoyer un autre message.",
    unavailable: "L’envoi du formulaire n’est pas encore configuré. Contacte-nous directement par e-mail :",
    privacy: "Ton message est transmis par e-mail à David Theobald pour étudier ton retour. Aucune adresse e-mail de ton compte n’est jointe.",
  },
  es: {
    navigation: "Descargar addon", title: "Addon de WoW Soulmate", status: "En proyecto. La descarga aún no está disponible.",
    idea: "La idea: encontrar a tus Soulmates en Azeroth y organizar aventuras juntos con más facilidad. Un addon podría reunir a jugadores compatibles dentro del juego. ¿Qué funciones te gustaría tener?",
    feedback: "Tus ideas y comentarios", message: "Mensaje", submit: "Enviar comentarios", pending: "Enviando …",
    sent: "¡Gracias! Se ha enviado tu mensaje.", invalid: "Introduce un mensaje de entre 10 y 4.000 caracteres.",
    failed: "No se pudo enviar tu mensaje. Inténtalo más tarde.", limited: "Espera cinco minutos antes de enviar más comentarios.",
    unavailable: "El envío del formulario aún no está configurado. Puedes escribirnos directamente:",
    privacy: "Tu mensaje se envía por correo a David Theobald para revisar tus comentarios. No se incluye ninguna dirección de correo de tu cuenta.",
  },
  it: {
    navigation: "Scarica addon", title: "Addon WoW Soulmate", status: "In progetto. Il download non è ancora disponibile.",
    idea: "L’idea: ritrovare i tuoi Soulmates ad Azeroth e organizzare più facilmente avventure insieme. Un addon potrebbe unire giocatori compatibili direttamente nel gioco. Quali funzioni vorresti?",
    feedback: "Le tue idee e opinioni", message: "Messaggio", submit: "Invia feedback", pending: "Invio in corso …",
    sent: "Grazie! Il tuo messaggio è stato inviato.", invalid: "Inserisci un messaggio da 10 a 4.000 caratteri.",
    failed: "Impossibile inviare il messaggio. Riprova più tardi.", limited: "Attendi cinque minuti prima di inviare altri commenti.",
    unavailable: "L’invio del modulo non è ancora configurato. Puoi scriverci direttamente:",
    privacy: "Il messaggio viene inviato via e-mail a David Theobald per esaminare il feedback. Non viene incluso alcun indirizzo e-mail del tuo account.",
  },
  pt: {
    navigation: "Descarregar addon", title: "Addon WoW Soulmate", status: "Em planeamento. Ainda sem download disponível.",
    idea: "A ideia: encontrar os teus Soulmates em Azeroth e combinar aventuras com mais facilidade. Um addon poderia juntar jogadores compatíveis dentro do jogo. Que funcionalidades gostarias de ter?",
    feedback: "As tuas ideias e opiniões", message: "Mensagem", submit: "Enviar feedback", pending: "A enviar …",
    sent: "Obrigado! A tua mensagem foi enviada.", invalid: "Introduz uma mensagem entre 10 e 4.000 caracteres.",
    failed: "Não foi possível enviar a mensagem. Tenta mais tarde.", limited: "Espera cinco minutos antes de enviar mais comentários.",
    unavailable: "O envio do formulário ainda não está configurado. Podes escrever-nos diretamente:",
    privacy: "A tua mensagem é enviada por e-mail a David Theobald para analisar o feedback. Não é incluído nenhum endereço de e-mail da tua conta.",
  },
  "pt-BR": {
    navigation: "Baixar addon", title: "Addon WoW Soulmate", status: "Em planejamento. Ainda não há download disponível.",
    idea: "A ideia: encontrar seus Soulmates em Azeroth e combinar aventuras com mais facilidade. Um addon poderia reunir jogadores compatíveis dentro do jogo. Que recursos você gostaria de ter?",
    feedback: "Suas ideias e seu feedback", message: "Mensagem", submit: "Enviar feedback", pending: "Enviando...",
    sent: "Obrigado! Seu feedback foi enviado.", invalid: "Informe uma mensagem de 10 a 4.000 caracteres.",
    failed: "Não foi possível enviar seu feedback. Tente novamente mais tarde.", limited: "Aguarde cinco minutos antes de enviar mais feedback.",
    unavailable: "O envio do formulário ainda não está configurado. Você pode falar com a gente por e-mail:",
    privacy: "Sua mensagem é enviada por e-mail para David Theobald analisar seu feedback. Nenhum endereço de e-mail da sua conta é incluído.",
  },
  pl: {
    navigation: "Pobierz dodatek", title: "Dodatek WoW Soulmate", status: "W planach. Pobieranie nie jest jeszcze dostępne.",
    idea: "Pomysł: spotykaj swoich Soulmates w Azeroth i łatwiej umawiajcie się na przygody. Dodatek mógłby łączyć pasujących graczy bezpośrednio w grze. Jakich funkcji potrzebujesz?",
    feedback: "Twoje pomysły i opinie", message: "Wiadomość", submit: "Wyślij opinię", pending: "Wysyłanie...",
    sent: "Dziękujemy! Twoja opinia została wysłana.", invalid: "Podaj wiadomość o długości od 10 do 4000 znaków.",
    failed: "Nie udało się wysłać opinii. Spróbuj ponownie później.", limited: "Poczekaj pięć minut przed wysłaniem kolejnej opinii.",
    unavailable: "Wysyłanie formularza nie jest jeszcze skonfigurowane. Możesz napisać do nas bezpośrednio:",
    privacy: "Twoja wiadomość jest przesyłana e-mailem do Davida Theobalda w celu rozpatrzenia opinii. Adres e-mail z twojego konta nie jest dołączany.",
  },
  ru: {
    navigation: "Скачать аддон", title: "Аддон WoW Soulmate", status: "В планах. Скачать пока нельзя.",
    idea: "Идея: находить своих Soulmates в Азероте и проще договариваться о совместных приключениях. Аддон мог бы объединять подходящих игроков прямо в игре. Какие функции тебе нужны?",
    feedback: "Твои идеи и отзывы", message: "Сообщение", submit: "Отправить отзыв", pending: "Отправка …",
    sent: "Спасибо! Твой отзыв отправлен.", invalid: "Введи сообщение длиной от 10 до 4000 символов.",
    failed: "Не удалось отправить отзыв. Попробуй позже.", limited: "Подожди пять минут перед отправкой следующего отзыва.",
    unavailable: "Отправка формы ещё не настроена. Можно написать нам напрямую:",
    privacy: "Твоё сообщение отправляется по электронной почте David Theobald для рассмотрения отзыва. Адрес почты из твоего аккаунта не добавляется.",
  },
};