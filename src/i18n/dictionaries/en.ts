export const en = {
  meta: {
    title: "WoW Soulmate — Find the people you click with",
    description:
      "WoW Soulmate analyzes your journey — who you play with, when you play, your roles and progression — and reveals the players you naturally click with.",
  },
  nav: {
    reveal: "The reveal",
    how: "How it works",
    vision: "Vision",
    faq: "FAQ",
    cta: "Get early access",
  },
  hero: {
    badge: "Preparing for WoW: Forever — November 4",
    titleLine1: "Who is your",
    titleHighlight: "WoW Soulmate",
    titleLine2: "?",
    lead: "Every WoW player has met someone they just *click* with — the perfect healer, the tank who always knows what to do, or that random player they somehow keep encountering.",
    leadStrong: "WoW Soulmate finds these people.",
    body: "It analyzes your WoW journey — who you play with, when you play, what you play, your roles, progression and shared activities — and identifies the players you naturally fit with.",
    ctaPrimary: "Get early access",
    ctaSecondary: "How it works",
    trust: "No spam. One mail when we launch. Unsubscribe anytime.",
  },
  countdown: {
    locale: "en",
    announcement: "Launches {date}!",
    label: "WoW: Forever launches in",
    days: "days",
    hours: "hrs",
    minutes: "min",
    seconds: "sec",
    live: "It's live. Let's go.",
  },
  card: {
    eyebrow: "Soulmate Match",
    name: "Mira",
    realm: "Blackrock · Resto Druid",
    score: "94",
    scoreLabel: "% Soulmate Match",
    stats: [
      { value: "17", label: "shared dungeons" },
      { value: "6", label: "raid nights" },
      { value: "91%", label: "schedule overlap" },
    ],
    verdict: "You two just click.",
    footer: "wowsoulmate.gg",
  },
  reveal: {
    eyebrow: "The killer feature",
    title: "You may already know your Soulmate.",
    body: "WoW Soulmate reveals the random players you've repeatedly played with but never added as friends. The pug healer from three keys last week. The tank who carried your alt. The name you keep seeing without ever noticing.",
    points: [
      {
        title: "Hidden repeat encounters",
        body: "We surface the people you keep matching with by pure chance — across dungeons, raids, battlegrounds and delves.",
      },
      {
        title: "Compatibility, not just counters",
        body: "Playtime windows, role fit, pace, progression and activity taste combine into one honest match score.",
      },
      {
        title: "One click to reach out",
        body: "Copy a ready-made whisper, add them, and turn a coincidence into a duo.",
      },
    ],
  },
  how: {
    eyebrow: "How it works",
    title: "Three steps to your Soulmate.",
    steps: [
      {
        step: "01",
        title: "Connect your character",
        body: "Secure Battle.net login. Read-only. We never ask for your password and never touch your account.",
      },
      {
        step: "02",
        title: "We read your journey",
        body: "Group history, playtimes, roles, progression and shared activities become your personal play profile.",
      },
      {
        step: "03",
        title: "Meet your Soulmate",
        body: "Get your ranked matches — plus Friends, Rivals and the connections you never knew you had.",
      },
    ],
  },
  share: {
    eyebrow: "Built to be shared",
    title: "Every match becomes a Soulmate Card.",
    body: "A single image with your match, your stats and your verdict. Drop it in guild chat, on Discord, on X — and watch your friends ask the only question that matters.",
    quote: "I found my WoW Soulmate. 💜",
    quoteSub: "94% Match",
    quoteCta: "Who's yours?",
  },
  vision: {
    eyebrow: "The vision",
    title: "A social identity layer for WoW.",
    body: "Soulmate is the start. From there, WoW Soulmate grows into the place where your relationships in Azeroth live.",
    items: [
      { name: "Soulmates", body: "The players you fit with best.", live: true },
      { name: "Friends", body: "Your real circle, ranked by shared time.", live: false },
      { name: "Rivals", body: "The names you meet on the other side.", live: false },
      { name: "Connections", body: "Your full network across servers.", live: false },
      { name: "Your Story", body: "The people behind your milestones.", live: false },
      { name: "Guild DNA", body: "What your guild is actually made of.", live: false },
    ],
    liveLabel: "At launch",
    soonLabel: "Coming next",
    closing: "WoW isn't just about the world. It's about the people you experience it with.",
  },
  waitlist: {
    eyebrow: "Early access",
    title: "Be there when Soulmate goes live.",
    body: "We're building for the WoW: Forever launch on November 4. Leave your email and you'll be among the first to find your Soulmate.",
    placeholder: "your@email.com",
    button: "Get early access",
    buttonLoading: "Sending…",
    success: "You're on the list. 💜",
    successBody: "We'll mail you the moment Soulmate opens up.",
    error: "Please enter a valid email address.",
    trust: "No spam. One mail when we launch. Unsubscribe anytime.",
    demoNote: "Demo mode — emails are not stored yet.",
    roleQuestion: "What do you main?",
    roles: ["Tank", "Healer", "DPS", "It depends"],
  },
  faq: {
    eyebrow: "FAQ",
    title: "The honest answers.",
    items: [
      {
        q: "Is this an addon or a website?",
        a: "A website. You log in with Battle.net, we read your public character and group data — nothing gets installed in your game.",
      },
      {
        q: "Is my account safe?",
        a: "Yes. Login runs through the official Battle.net OAuth flow with read-only access. We never see your password and can't act in your name.",
      },
      {
        q: "Will other players see my data?",
        a: "Only what you choose to share. Your matches are private by default — a Soulmate Card is only created when you make one.",
      },
      {
        q: "What does it cost?",
        a: "Finding your Soulmate will be free. Deeper history, Guild DNA and extras are planned as an optional upgrade later.",
      },
      {
        q: "When does it launch?",
        a: "We're aiming for the WoW: Forever launch window on November 4. Early access mails go out first.",
      },
      {
        q: "This is not a dating app, right?",
        a: "Correct. Soulmate is about play compatibility — the people you raid, push and queue with best.",
      },
    ],
  },
  footer: {
    tagline: "Find the people you click with.",
    rights: "Not affiliated with or endorsed by Blizzard Entertainment.",
    imprint: "Imprint",
    privacy: "Privacy",
  },
} as const;

type DeepWiden<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends readonly (infer U)[]
        ? readonly DeepWiden<U>[]
        : { -readonly [K in keyof T]: DeepWiden<T[K]> };

export type Dictionary = DeepWiden<typeof en>;
