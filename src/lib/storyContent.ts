export interface CrosswordItem {
  id: number;
  clue: string;
  answer: string;
  direction: "across" | "down";
  row: number;
  col: number;
  hint: string;
  specialReaction?: string;
}

export const storyContent = {
  opening: {
    poemLines: [
      "Some people arrive like a passing breeze,",
      "some like a sudden storm,",
      "but a few quietly become the reason",
      "ordinary days feel warm."
    ],
    reflection: "And somehow… you walked into my wonderfully boring life.",
    thankYou: "Thank you for finding your way into it, for turning ordinary moments into memories, and for making this life a little less boring.",
    cta: "LET US JUMP IN →"
  },
  aurora: {
    chapter: "CHAPTER ONE",
    title: "When did it begin?",
    question: "Tell me, bubuu…\nwhen was the first time I ever talked to you?",
    placeholder: "DD / MM / YYYY",
    correctAnswer: "24/06/2025",
    hintOptions: [
      "14 June 2025",
      "21 June 2025",
      "24 June 2025",
      "29 June 2025"
    ],
    successMessage: [
      "Funny thing is…",
      "that wasn't the first time I saw you.",
      "But somehow, that charming face,",
      "and that ridiculously good laugh,",
      "were already becoming difficult to forget."
    ]
  },
  sakura: {
    chapter: "CHAPTER TWO",
    title: "Find The Difference",
    instruction: "Look closely at the Japanese Sakura garden. Can you spot what is different between both panels?",
    hintText: "Notice the glowing stone lanterns hanging near the Sakura branches...",
    emotionalMessage: [
      "You know what's funny?",
      "You made me wait for you… without even knowing you were making me wait.",
      "And sometimes, when it felt like you couldn't choose me, even when all I wanted was to be the one you chose, it hurt a little more than I ever said.",
      "But here we are… still writing our little story."
    ]
  },
  waterfall: {
    chapter: "CHAPTER THREE",
    title: "How Well Do You Know Me?",
    subtitle: "Complete the crossword puzzle to uncover our memories",
    crossword: [
      {
        id: 1,
        clue: "My favourite song",
        answer: "LONG WAY TO GO",
        direction: "across",
        row: 0,
        col: 0,
        hint: "A song whose name sounds like something worth continuing…"
      },
      {
        id: 2,
        clue: "My favourite movie",
        answer: "OLDBOY",
        direction: "down",
        row: 0,
        col: 1, // 'O' in LONG
        hint: "A dark Korean masterpiece cinema."
      },
      {
        id: 3,
        clue: "My favourite genre",
        answer: "HORROR",
        direction: "across",
        row: 4,
        col: 1, // 'O' in OLDBOY
        hint: "The kind of stories that make you check the room twice."
      },
      {
        id: 4,
        clue: "My favourite food item",
        answer: "CAKE",
        direction: "down",
        row: 2,
        col: 7, // near G in LONG WAY
        hint: "My greatest sweet weakness.",
        specialReaction: "Hehe… yes. I really do like cakes more! 🍰"
      },
      {
        id: 5,
        clue: "My 2nd most favourite footballer",
        answer: "IMMOBILE",
        direction: "across",
        row: 6,
        col: 0,
        hint: "Italian striker with a legendary eye for goal.",
        specialReaction: "BOOM! You didn't expect to know this one! ⚽"
      },
      {
        id: 6,
        clue: "My loving person",
        answer: "SHARMILA",
        direction: "down",
        row: 1,
        col: 10,
        hint: "The most special person in the world to me."
      }
    ] as CrosswordItem[],
    completionMessage: [
      "I know that I'm a hard nut to crack…",
      "but if you somehow manage to crack me open,",
      "you'll find I'm actually all soft inside."
    ]
  },
  nyc: {
    chapter: "CHAPTER FOUR",
    title: "The Things I Don't Always Say",
    words: [
      "memories",
      "football",
      "midnight calls",
      "laughter",
      "hand cricket",
      "songs",
      "you",
      "us",
      "silly fights",
      "random rants",
      "stargazing",
      "inside jokes"
    ],
    thoughtOne: "You changed my life in ways I never really knew how to explain.",
    thoughtTwo: "Whenever I remember you, I smile. Whenever I think about you, somehow my day becomes a little happier.",
    vulnerableMessage: [
      "And it's not like I say these things once and leave them behind. I want to remind you. Again and again. Because you matter to me.",
      "But sometimes… I wonder if some of the little things I care about ever matter to you as much as they matter to me.",
      "Even something as silly as our hand-cricket matches.",
      "Sometimes I just assume you're not interested, and instead of asking… I quietly stop talking about it.",
      "Maybe that's one of the things I need to learn too. 💙"
    ]
  },
  mountain: {
    chapter: "CHAPTER FIVE",
    title: "A Little Game Just For You",
    subtitle: "Inspired by the co-op adventures you love",
    openingQuote: "A little game… because I know how much you love these.",
    midQuote1: "I remember everything you told me since the beginning…",
    midQuote2: "No need to check the messages.",
    midQuote3: "Hehe… jk 😋",
    successQuote: "You made it across together!"
  },
  math: {
    chapter: "CHAPTER SIX",
    title: "One Last Little Challenge",
    equationDisplay: "∫₁¹² x dx",
    equationExplanation: "Evaluate the definite integral of x with limits from 1 to 12",
    acceptedAnswers: ["71.5", "143/2", "71.50"],
    loveExplosionMain: "I LOVE YOU SO MUCH",
    loveExplosionSub: "More than this little website could ever explain."
  },
  time: {
    chapter: "THE SECRET HOUR",
    title: "Give me the time.",
    correctTime: "2:00 AM",
    acceptedVariants: ["2:00 AM", "02:00 AM", "2:00AM", "02:00AM", "2 AM", "2AM", "02:00"],
    hints: [
      "Hint 1: Think about a time when the entire world was quiet…",
      "Hint 2: A quiet hour when true feelings were finally spoken out loud…",
      "Hint 3: The hour that became unforgettable because you expressed what was deeply in your heart."
    ]
  },
  final: {
    chapter: "THE SACRED SHORE",
    environmentTitle: "Phi Phi Haven — After The Rain",
    sandHint: "Something precious is waiting for you in the sand…",
    letter: {
      salutation: "My Bubuuuuu, 💙",
      paragraphs: [
        "Ever since I got to know you, somehow we became so close that even I didn't realize when it happened. Somewhere between all our conversations, silly moments, little fights, laughter, and everything in between, I slowly started realizing that you had become someone very special to my heart.",
        "And honestly, there were always thoughts somewhere in the back of my mind. I used to wonder what made the difference between me and everyone else. Why me? What was it about us?",
        "And then, one day, you opened up to me. Something changed after that.",
        "Since then, we've had our highs and our lows. We've had moments where everything felt beautiful, and moments where one of us felt hurt, misunderstood, or simply needed the other a little more.",
        "I know there is no such thing as a life where everything is happy all the time. There will be difficult days. There will be moments when either you or I feel like giving up on a conversation, taking some space, or simply not knowing what to say.",
        "But from the very first day I truly got to know you, one thing never changed. I wanted to take care of you. I wanted to see you happy. I wanted to give you the little things you wished for, make you smile, and be someone you could feel safe with.",
        "And yes… there were days when I made you cry. There were moments when my words, my silence, or the way I handled things hurt you. I'm sorry for those moments. I wish I could go back and change some of them, but I know that damage doesn't simply disappear because we regret it. All I can do is learn from it, become better, and keep trying to show you how much you mean to me.",
        "The truth is, I'm not always very good at expressing what's happening inside my head. I don't always show what I'm feeling on the outside. Sometimes things become heavy. Sometimes the thoughts pile up until I don't know what to do with them.",
        "And there have been nights when I've sat alone with everything in my head, wishing I had someone beside me to simply listen. Not necessarily to fix anything. Just… to listen. There were moments when I wished you could have stayed a little longer when I was feeling heavy. And there were moments when I felt like you weren't interested, and my own mind would immediately tell me: 'Don't say anything. Don't bother her. Keep it to yourself.' So I did. Maybe that's one of the cruelest things my mind has taught me — to keep things inside until they become heavier than they needed to be.",
        "And there have been some recent moments when I made you cry because I didn't express what I was actually feeling. For that too, I'm sorry. Sometimes I don't even know how to explain what is happening inside me.",
        "But even through all of that, there is something I have always wanted you to know. I am only a message away. Always. No matter how far away you feel. No matter how bad the day is. No matter how many highs, lows, arguments, or misunderstandings we go through. You will always have a place in my heart. And if you ever need somewhere to feel safe, somewhere to breathe, somewhere to simply be yourself… I want that place to be with me. I want to be your haven.",
        "My love for you is something I can never completely put into words. It feels ineffable. And somehow, after everything we've been through, it still feels amaranthine.",
        "Maybe I don't always say everything perfectly. Maybe sometimes I hide too much. Maybe sometimes I overthink things that don't need to be overthought. But underneath all of that is someone who loves you more than he knows how to explain. Someone who remembers the little things. Someone who notices the tiny moments. Someone who smiles because of you. Someone who still wants to make you happy. Someone who will always be just one message away.",
        "So… Thank you. For coming into my life. For making my boring days less boring. For the laughter. For the memories. For the chaos. For the beautiful moments. Even for the difficult ones, because they taught me how much I actually care.",
        "And most importantly… Thank you for being you.",
        "I love you so, so much, Bubuuuuu. 💙"
      ],
      closing: "Forever your idiot,",
      signature: "Pavan",
      footnote: "...to be continued."
    }
  }
};
