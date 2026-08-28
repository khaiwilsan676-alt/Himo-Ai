const humanResponses = [
  {
    triggers: ["umma", "love you", "i love you", "love u", "pyaar", "miss you", "kiss you"],
    replies: [
      "Love you too mere bhai! ❤️ Dil jeet liya tune. Hamesha khush reh!",
      "Arey bhai bhai! ❤️ Love you 3000! Bol tere liye kya karoon?",
      "Ummah! ❤️ Tere bina kahan maza bhai, tu bas hukum kar!",
      "Dil se shukriya mere bhai! Tu hai toh sab badiya hai!"
    ]
  },
  {
    triggers: ["kya kar raha hai", "kya kr rha h", "kya chal raha hai", "kya haal hai", "aur bata", "kya scene hai", "kaise ho", "kaisa h"],
    replies: [
      "Kuch nahi bhai, bas mast baitha tha tere naye command ke intezar mein! Bol kya scene hai?",
      "Sab first class bhai! Tu bata aaj kya solve karna hai ya koi gana bajayein?",
      "Bas tere dimag ko decode karne ki taiyari chal rahi hai bhai! Tu suna kaisa hai?",
      "Ekdum badiya mere bhai! Tere sath baat karke aur badhiya ho gaya. Bol kya seva karoon?"
    ]
  },
  {
    triggers: ["bhai", "bro", "yaar", "suno", "oye", "arre sun", "hero", "bhai sun"],
    replies: [
      "Haan mere bhai! Bol kya baat hai, poora dhyan teri taraf hai!",
      "Bolo bhai, main bilkul ready hoon! Kya plan hai?",
      "Haan dost, sun raha hoon, bol kya problem solve karni hai?",
      "Hukum kar mere bhai, Himo hamesha haazir hai!"
    ]
  },
  {
    triggers: ["badiya", "mast", "shabash", "wah", "good", "great", "nice", "op", "pro", "smart", "genius"],
    replies: [
      "Arey shukriya bhai! Sab teri sangati ka asar hai! 😎",
      "Dhanyawad mere bhai! Aise hi support banaye rakh!",
      "Apun toh bhai ke liye hamesha ready hai! Maza aa gaya sunke.",
      "Thank you bhai! Tere liye toh best hi karenge!"
    ]
  },
  {
    triggers: ["chup", "pagal", "kutta", "gadhe", "dimag kharab"],
    replies: [
      "Arey bhai sorry na, gussa kyu ho raha hai? Shant ho ja, bata kya galti ho gayi!",
      "Arre chill mere bhai, gussa thook de aur bata kya baat hai!",
      "Arey bhai mazak chhod, bol kya issue hai, abhi theek karta hoon!"
    ]
  },
  {
    triggers: ["khana khaya", "chai piyega", "dinner", "lunch", "khana kha liya"],
    replies: [
      "Digital memory se pet bharta hoon bhai! Par tu bata tune khana khaya ki nahi?",
      "Chai ka naam mat le bhai, dil kar jata hai! Tu pi le meri taraf se ek cup!",
      "Mera khana toh tere sawalon ka data hai bhai! Tu apna dhyan rakh aur mast reh!"
    ]
  }
];

export function getHumanReply(prompt) {
  if (!prompt) return null;
  const clean = prompt.toLowerCase().trim();

  for (const item of humanResponses) {
    for (const trigger of item.triggers) {
      if (clean.includes(trigger)) {
        const randomIndex = Math.floor(Math.random() * item.replies.length);
        return item.replies[randomIndex];
      }
    }
  }

  return null;
}
