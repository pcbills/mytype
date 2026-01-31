const DEFAULT_CATEGORIES = [
  { id: 'pokemon', name: 'Pok\u00e9mon', icon: '\u26a1' },
  { id: 'animals', name: 'Animals', icon: '\ud83d\udc3e' },
  { id: 'videogames', name: 'Video Games', icon: '\ud83c\udfae' },
  { id: 'science', name: 'Science', icon: '\ud83d\udd2c' },
];

const DEFAULT_ENTRIES = [
  // ===== Pok\u00e9mon =====
  {
    id: 'pokemon-pikachu',
    category: 'pokemon',
    title: 'Pikachu',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
    text: 'Pikachu is one of the most famous Pok\u00e9mon in the world. This small, yellow, mouse-like creature is known for its ability to generate powerful electric shocks from the red pouches on its cheeks. Pikachu is the partner Pok\u00e9mon of Ash Ketchum in the animated series. It evolves from Pichu when it has high friendship and can evolve into Raichu using a Thunder Stone. Pikachu is an Electric-type Pok\u00e9mon that is loved by fans of all ages.'
  },
  {
    id: 'pokemon-charizard',
    category: 'pokemon',
    title: 'Charizard',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png',
    text: 'Charizard is a powerful Fire and Flying-type Pok\u00e9mon that evolves from Charmeleon. It is the final evolution of Charmander, one of the original starter Pok\u00e9mon from the Kanto region. Charizard can breathe intense flames that can melt almost anything. Its fire burns hotter when it has experienced tough battles. Charizard is one of the most popular Pok\u00e9mon and has appeared in many games, movies, and TV episodes.'
  },
  {
    id: 'pokemon-eevee',
    category: 'pokemon',
    title: 'Eevee',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png',
    text: 'Eevee is a unique Normal-type Pok\u00e9mon known for its unstable genetic code. This special trait allows Eevee to evolve into many different Pok\u00e9mon depending on the conditions. Eevee can become Vaporeon, Jolteon, Flareon, Espeon, Umbreon, Leafeon, Glaceon, or Sylveon. Because of its many evolutions, Eevee is one of the most versatile Pok\u00e9mon in the series. Its fluffy brown fur and big eyes make it one of the cutest Pok\u00e9mon around.'
  },
  {
    id: 'pokemon-mewtwo',
    category: 'pokemon',
    title: 'Mewtwo',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png',
    text: 'Mewtwo is a legendary Psychic-type Pok\u00e9mon that was created through genetic engineering. Scientists used the DNA of the mythical Pok\u00e9mon Mew to create Mewtwo in a laboratory. Mewtwo is incredibly powerful and is known for its strong psychic abilities. It can communicate using telepathy and can control the minds of other beings. Mewtwo has appeared as the main character in several Pok\u00e9mon movies and is one of the strongest Pok\u00e9mon in battles.'
  },
  {
    id: 'pokemon-snorlax',
    category: 'pokemon',
    title: 'Snorlax',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png',
    text: 'Snorlax is a massive Normal-type Pok\u00e9mon that is famous for sleeping and eating. This gentle giant weighs over 1,000 pounds and spends most of its time napping in inconvenient places like roads and bridges. Snorlax needs to eat around 900 pounds of food every day before it falls back asleep. Despite being lazy, Snorlax is actually very strong in battles. In the games, players often need a special Pok\u00e9 Flute to wake up a sleeping Snorlax that blocks their path.'
  },

  // ===== Animals =====
  {
    id: 'animals-red-panda',
    category: 'animals',
    title: 'Red Panda',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Red_Panda_%2824986761703%29.jpg/640px-Red_Panda_%2824986761703%29.jpg',
    text: 'The red panda is a small mammal that lives in the forests of the eastern Himalayas and southwestern China. Despite its name, the red panda is not closely related to the giant panda. It has soft reddish-brown fur, a long bushy tail with rings, and a round face with white markings. Red pandas spend most of their time in trees and are excellent climbers. They mainly eat bamboo but also enjoy fruits, berries, and insects.'
  },
  {
    id: 'animals-octopus',
    category: 'animals',
    title: 'Octopus',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Octopus2.jpg/640px-Octopus2.jpg',
    text: 'The octopus is one of the most intelligent creatures living in the ocean. It has eight flexible arms covered with suction cups that it uses to grab food and explore its surroundings. An octopus has three hearts and blue blood, which makes it very different from most animals. It can change its color and texture in less than a second to hide from predators or sneak up on prey. Some octopuses have been observed using tools, like carrying coconut shells to use as shelters.'
  },
  {
    id: 'animals-cheetah',
    category: 'animals',
    title: 'Cheetah',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Cheetah_Kruger.jpg/640px-Cheetah_Kruger.jpg',
    text: 'The cheetah is the fastest land animal on Earth, capable of reaching speeds up to 70 miles per hour. These amazing cats live mainly in Africa and are built for speed with their long legs, slim bodies, and large nasal passages for extra oxygen. A cheetah can accelerate from zero to 60 miles per hour in just three seconds, which is faster than most sports cars. Unlike other big cats, cheetahs cannot roar, but they can purr just like house cats. Cheetahs have distinctive black tear marks that run from their eyes to their mouths.'
  },
  {
    id: 'animals-emperor-penguin',
    category: 'animals',
    title: 'Emperor Penguin',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Emperor_Penguin_Manchot_empereur.jpg/640px-Emperor_Penguin_Manchot_empereur.jpg',
    text: 'The emperor penguin is the tallest and heaviest of all penguin species, standing nearly four feet tall. These incredible birds live in Antarctica, one of the coldest places on Earth, where temperatures can drop below minus 80 degrees Fahrenheit. Emperor penguins are famous for their breeding cycle, where the male keeps the egg warm on his feet for over two months during the harsh Antarctic winter. They are excellent swimmers and can dive deeper than 1,800 feet to catch fish and squid. Emperor penguins huddle together in large groups to stay warm during blizzards.'
  },
  {
    id: 'animals-dolphin',
    category: 'animals',
    title: 'Dolphin',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Tursiops_truncatus_01.jpg/640px-Tursiops_truncatus_01.jpg',
    text: 'Dolphins are highly intelligent marine mammals that live in oceans and rivers around the world. They are known for their playful behavior, often riding waves and leaping out of the water. Dolphins use a special ability called echolocation to find food and navigate through dark or murky water by sending out clicking sounds and listening for the echoes. They live in social groups called pods and communicate with each other using whistles and clicks. Dolphins are also known for being friendly toward humans and have been observed helping swimmers in trouble.'
  },

  // ===== Video Games =====
  {
    id: 'videogames-minecraft',
    category: 'videogames',
    title: 'Minecraft',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/b/b6/Minecraft_2024_cover_art.png',
    text: 'Minecraft is one of the best-selling video games of all time, with over 300 million copies sold worldwide. In this sandbox game, players explore a blocky, procedurally generated 3D world where they can mine resources, craft tools, and build structures. The game has two main modes: Survival mode, where players must gather resources and fight monsters, and Creative mode, where players have unlimited resources to build anything they imagine. Minecraft was created by Markus Persson and was first released in 2011. The game has become a global phenomenon used not only for entertainment but also for education.'
  },
  {
    id: 'videogames-super-mario',
    category: 'videogames',
    title: 'Super Mario',
    imageUrl: 'https://mario.wiki.gallery/images/thumb/3/3e/MPSS_Mario.png/200px-MPSS_Mario.png',
    text: 'Super Mario is one of the most iconic video game characters ever created by Nintendo. Mario is a friendly Italian plumber who goes on adventures to rescue Princess Peach from the villain Bowser. The first Super Mario Bros. game was released in 1985 and helped save the video game industry from a major crash. Mario is known for his red hat, blue overalls, and his ability to jump on enemies and power up with mushrooms and fire flowers. The Super Mario series has sold hundreds of millions of copies and continues to be popular with gamers of all ages.'
  },
  {
    id: 'videogames-zelda',
    category: 'videogames',
    title: 'The Legend of Zelda',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c6/The_Legend_of_Zelda_Breath_of_the_Wild.jpg',
    text: 'The Legend of Zelda is a beloved action-adventure video game series created by Nintendo. Players control a hero named Link who must rescue Princess Zelda and save the land of Hyrule from the evil Ganondorf. The series is known for its challenging puzzles, exciting combat, and vast worlds to explore. The first game was released in 1986 and introduced many features that are now standard in adventure games. Breath of the Wild and Tears of the Kingdom are among the highest-rated video games ever made, praised for their open-world exploration.'
  },
  {
    id: 'videogames-roblox',
    category: 'videogames',
    title: 'Roblox',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Roblox_player_icon_black.svg/640px-Roblox_player_icon_black.svg.png',
    text: 'Roblox is a massive online platform where millions of people create and play games made by other users. It was released in 2006 and has grown to have over 200 million monthly active users. What makes Roblox special is that anyone can learn to build their own games using the Roblox Studio tool and a programming language called Luau. Players can explore millions of different games, from obstacle courses and role-playing adventures to simulators and racing games. Roblox has its own virtual currency called Robux, which players can use to buy accessories for their avatars.'
  },
  {
    id: 'videogames-fortnite',
    category: 'videogames',
    title: 'Fortnite',
    imageUrl: 'https://cdn2.unrealengine.com/Fortnite%2Fblog%2Fpatch-v-1-6---fortnite-battle-royale%2FFortnite_BR_Key-Art_w-Logo_ENG-1920x1080-3e2ce1453476b725fa59e7aeb6ecb90e4b75a0df.jpg',
    text: 'Fortnite is a popular battle royale game developed by Epic Games that took the gaming world by storm when it was released in 2017. In the main Battle Royale mode, 100 players drop onto an island and compete to be the last player standing. Players must find weapons, build structures for defense, and survive as the play area shrinks over time. Fortnite is known for its colorful art style, fun dance emotes, and frequent collaborations with movies, music artists, and other games. The game is free to play and is available on almost every gaming platform.'
  },

  // ===== Science =====
  {
    id: 'science-solar-system',
    category: 'science',
    title: 'The Solar System',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Solar_sys8.jpg/640px-Solar_sys8.jpg',
    text: 'Our solar system is made up of the Sun and everything that orbits around it, including eight planets, dwarf planets, moons, asteroids, and comets. The four inner planets, Mercury, Venus, Earth, and Mars, are rocky worlds, while the four outer planets, Jupiter, Saturn, Uranus, and Neptune, are much larger and made mostly of gas and ice. The Sun contains more than 99 percent of all the mass in the solar system and provides the light and heat that makes life possible on Earth. Our solar system formed about 4.6 billion years ago from a giant cloud of gas and dust.'
  },
  {
    id: 'science-volcanoes',
    category: 'science',
    title: 'Volcanoes',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Raden_Saleh_-_Merapi_volcano%2C_eruption_at_night%2C_1865.jpg',
    text: 'A volcano is an opening in the Earth\'s surface where hot molten rock called magma escapes from deep underground. When magma reaches the surface, it is called lava, and it can flow down the sides of the volcano destroying everything in its path. There are about 1,500 active volcanoes on Earth, and they are often found along the edges of tectonic plates. The largest volcano in our solar system is Olympus Mons on Mars, which is nearly three times taller than Mount Everest. Volcanic eruptions can be dangerous, but they also create new land and produce fertile soil for farming.'
  },
  {
    id: 'science-dinosaurs',
    category: 'science',
    title: 'Dinosaurs',
    imageUrl: 'https://www.archaeology.wiki/wp-content/uploads/2025/05/T_Rex.jpg',
    text: 'Dinosaurs were a group of reptiles that ruled the Earth for over 160 million years before going extinct about 66 million years ago. They came in all shapes and sizes, from the massive Argentinosaurus, which was over 100 feet long, to the tiny Microraptor, which was about the size of a crow. Scientists believe that a giant asteroid hit the Earth and caused dramatic climate changes that the dinosaurs could not survive. However, not all dinosaurs disappeared. Modern birds are actually living dinosaurs, descended from small feathered dinosaurs that survived the extinction event.'
  },
  {
    id: 'science-water-cycle',
    category: 'science',
    title: 'The Water Cycle',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Watercyclesummary.jpg',
    text: 'The water cycle is the continuous journey that water takes as it moves between the Earth\'s surface and the atmosphere. It begins when the Sun heats up water in oceans, lakes, and rivers, causing it to evaporate and rise into the air as water vapor. As the water vapor rises higher, it cools down and condenses into tiny droplets that form clouds. When the droplets in clouds become heavy enough, they fall back to Earth as precipitation, which can be rain, snow, sleet, or hail. The water then flows into rivers and streams, soaks into the ground, or collects in lakes and oceans, and the cycle begins again.'
  },
  {
    id: 'science-electricity',
    category: 'science',
    title: 'Electricity',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Electricity_grid_schema-_lang-en.jpg',
    text: 'Electricity is a form of energy that powers almost everything in our modern world, from lights and computers to refrigerators and video games. It is created by the movement of tiny particles called electrons, which flow through materials like metal wires in a path called a circuit. Electricity can be generated in many ways, including using wind turbines, solar panels, hydroelectric dams, and power plants that burn fossil fuels. Lightning is a powerful natural form of electricity that occurs during thunderstorms when electrical charges build up in clouds. Scientists like Benjamin Franklin and Thomas Edison made important discoveries that helped us understand and use electricity.'
  },
];
