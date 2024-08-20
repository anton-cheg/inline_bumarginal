// const apiKey =
//   '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';

// import OpenAI from 'openai';

// const openai = new OpenAI({
//   apiKey: apiKey, // This is the default and can be omitted
// });

// import data from './without_one_word.json';
// import { filter, keys } from 'lodash';
// import { generateArrayQuizes } from './openai';

// const authorsThumbnails = {
//   'Ozumr': 'https://i.imgur.com/FwcseXe.png',
//   'Дужо': 'https://i.imgur.com/jZyK9gX.png',
//   'Kama': 'https://i.imgur.com/ExvCiK9.png',
//   'Rablez': 'https://i.imgur.com/IibgofL.png',
//   '🐭': 'https://i.imgur.com/W18GsIG.png',
//   'Gebeleizis': 'https://i.imgur.com/fs8USTE.png',
//   '🩵': 'https://i.imgur.com/ha6B9oo.png',
//   'Pale Pine': 'https://i.imgur.com/luPBbsR.png',
//   // 'Maksym': '',
//   // '슬라빅': '',
//   // 'Mikserious': '',
//   // 'Vincent': '',
//   'Yacubus': 'https://i.imgur.com/5esecDa.png',
//   'Arthur Freyr': 'https://i.imgur.com/OBKJEsj.png',
//   // 'Nikita': '',
//   'nick 🥟': 'https://i.imgur.com/18r5Tzf.png',
//   'Покришка': 'https://i.imgur.com/PjoRYH5.png',
// };

// const authors = {
//   'Ozumr': '5323244429',
//   'Дужо': '6373110331',
//   'Kama': '743676820',
//   // 'IDark🦴': '461815527',
//   'Rablez': '5299885702',
//   '🐭': '454478224',
//   'Gebeleizis': '401564378',
//   '🩵': '336811122',
//   // 'Maksym': '911064035',
//   // '슬라빅': '5405425441',
//   // 'Mikserious': '700379194',
//   // 'Vincent': '5438051347',
//   'Pale Pine': '366082670',
//   'Yacubus': '242387681',
//   'Arthur Freyr': '310656626',
//   // 'Nikita': '516592563',
//   'nick 🥟': '839169324',
//   /*    DuzhoTestBot: '6948812443',
//     gneg: '270633054', */
//   /*  'МЕФОМЕТР': '6066014818',
//     'Evisceration Global': '5263350978',
//     'деградант-бот': '6611756982',
//     'прослушка каракала': '7318739188', */
//   // 'Покришка': '5943796076',
//   // 'Markinim ^_^': '5047828033',
// };

// const messages: { text: string; from: string; from_id: string }[] = data as any;
// const filteredMessages: {
//   text: string;
//   from: string;
//   from_id: string;
//   id: string;
// }[] = filter(
//   messages,
//   (message) =>
//     !message.text.startsWith('/') &&
//     !message.text.toLowerCase().includes('покрышк') &&
//     keys(authorsThumbnails).includes(message.from)
// ).map((message, index) => ({ ...message, id: String(index + 1) }));

// const generate = async () => {
//   const randomIndex = Math.floor(
//     Math.random() * (filteredMessages.length - 100)
//   );
//   const randomMessages = filteredMessages.slice(randomIndex, randomIndex + 100);

//   const mapped = randomMessages.map((message) => ({
//     message: message.text,
//     from: message.from,
//   }));

//   const quiz = await generateArrayQuizes(mapped);
//   return quiz;
// };

// generate().then(console.log);
