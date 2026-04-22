/**
 * Recipe Data
 * All recipes organized by category
 */

const RECIPES = [
    // SALADS
    {
        id: 'chawli-rajma-chickpea-salad',
        name: 'Chawli Rajma and Chickpea Salad',
        category: 'salad',
        ingredients: [
            'Mixed boiled beans (rajma, chawli and chickpeas)',
            'Sliced spring onion',
            'Tomato cubes',
            'Finely chopped green chillies',
            'Finely chopped coriander',
            '2 tbsp lemon juice',
            '2 tsp chaat masala',
            '1/4 tsp black salt',
            'Freshly ground black peppercorns to taste'
        ],
        instructions: [
            'Combine all the ingredients in a deep bowl and mix well.',
            'Refrigerate for 1 hour and serve chilled garnished with coriander.'
        ]
    },
    {
        id: 'corn-bean-salad',
        name: 'Corn and Bean Salad',
        category: 'salad',
        ingredients: [
            'Corn',
            'Beans',
            'Onion, tomatoes',
            'Green chilli',
            'Carrot, capsicum',
            'Coriander leaves, mint leaves',
            '1 tsp olive oil',
            'Lemon juice',
            'Salt and black pepper as per taste'
        ],
        instructions: [
            'Wash and boil corns and beans till tender in a pressure cooker with 200ml water and salt.',
            'Chop onion, tomatoes, green chilli, capsicum, carrot.',
            'Mix all vegetables with corn and beans and mix well.',
            'Add black pepper, lemon juice as per taste, and add olive oil for better taste.',
            'Garnish with coriander leaves and mint.',
            'Serve chilled.'
        ]
    },
    {
        id: 'chickpea-salad',
        name: 'Chickpea Salad',
        category: 'salad',
        ingredients: [
            'Chickpeas, rinsed and cooked',
            'Cucumber, chopped',
            'Bell pepper, chopped',
            'Red onion, thinly sliced',
            'Salt to taste',
            'Freshly ground black pepper',
            'Olive oil',
            'Vinegar',
            'Lemon juice'
        ],
        instructions: [
            'In a large bowl toss together chickpeas, cucumber, bell pepper, red onion.',
            'Add salt and pepper.',
            'Add olive oil, vinegar, lemon juice, and red pepper flakes.',
            'Mix well all the ingredients.',
            'Serve it.'
        ]
    },
    {
        id: 'greek-salad',
        name: 'Greek Salad',
        category: 'salad',
        ingredients: [
            'Lettuce, torn into pieces',
            'Chopped feta cheese',
            'Green cucumber cubes',
            'Roughly chopped onions',
            'Cherry tomato halves',
            'Sliced black olives',
            'Virgin olive oil',
            'Dried oregano',
            'Lemon juice',
            'Salt and freshly ground black pepper to taste'
        ],
        instructions: [
            'Combine all the ingredients for the salad into a deep bowl.',
            'Add the dressing and toss well.'
        ]
    },
    {
        id: 'german-cucumber-salad',
        name: 'German Cucumber Salad',
        category: 'salad',
        ingredients: [
            'English cucumbers',
            'Kosher salt',
            'Red onion sliced',
            'Garlic clove, minced',
            'Sour cream',
            'Apple cider vinegar',
            'Fresh dill',
            'Black pepper'
        ],
        instructions: [
            'Thinly slice the cucumbers and lay on the prepared baking sheet. Sprinkle with salt.',
            'Let it rest for 30 minutes at room temperature to allow the cucumbers to release their water.',
            'Pat cucumbers dry and add to a large mixing bowl with the red onion and garlic.',
            'Whisk together the sour cream, vinegar, dill and pepper in a small bowl.',
            'Pour the dressing mixture over the cucumbers and toss to coat.',
            'Serve cold or at room temperature.'
        ]
    },
    {
        id: 'mexican-salad',
        name: 'Mexican Salad',
        category: 'salad',
        ingredients: [
            '1 cup soaked and boiled rajma',
            '1/4 cup chopped spring onion greens',
            '1/2 cup low-fat paneer cubes',
            '1/4 cup chopped coriander',
            '3/4 cup blanched tomatoes',
            '1 tsp oil',
            '1/4 cup finely chopped onions',
            '3/4 cup capsicum cubes',
            '2 tsp dry red chilli flakes',
            'Salt to taste'
        ],
        instructions: [
            'Heat oil in a non-stick pan, add onions and sauté for 30 seconds.',
            'Add tomatoes, capsicum, chilli flakes and salt, mix well and cook for 2 minutes.',
            'Combine rajma, spring onions, paneer and coriander in a deep bowl.',
            'Add the salsa and toss well.',
            'Serve immediately.'
        ]
    },

    // SOUPS
    {
        id: 'lauki-soup',
        name: 'Lauki Soup',
        category: 'soup',
        ingredients: [
            '350 gms bottle gourd',
            '1/4 to 1/3 cup roughly chopped onions',
            '1 tsp chopped garlic',
            '2 cups water',
            '1/2 to 1 tsp dry mixed herbs',
            '1/4 to 1/2 tsp freshly crushed black pepper',
            'Olive oil'
        ],
        instructions: [
            'Peel, chop and set aside bottle gourd in enough water. Note: Check the taste from both ends - it should not be bitter.',
            'Heat olive oil in a pressure cooker. Add onions and garlic.',
            'Sauté on medium heat until onions soften.',
            'Add chopped bottle gourd and sauté for 1 to 2 minutes.',
            'Add 2 cups of water to the vegetables.',
            'Pressure cook for 2 whistles or 9 to 10 minutes.',
            'Transfer to a blender and puree to a fine consistency.',
            'Flavor with dry mixed herbs and crushed black pepper.'
        ]
    },
    {
        id: 'tomato-carrot-soup',
        name: 'Tomato Carrot Soup',
        category: 'soup',
        ingredients: [
            'Steamed tomatoes',
            'Steamed carrots',
            'Steamed onions',
            '1/2 tsp cumin powder',
            'Coriander or parsley leaves for garnish',
            'Olive oil',
            'Water as needed'
        ],
        instructions: [
            'Heat olive oil in a pan.',
            'Add cumin powder and stir for a few seconds on low heat.',
            'Add the steamed tomato, carrot and onion puree to the pan.',
            'Stir to combine and simmer for 2 to 3 minutes.',
            'If the soup is thick, add some water. If thin, cook for a few more minutes.',
            'Garnish with coriander or parsley leaves.'
        ]
    },
    {
        id: 'pumpkin-soup',
        name: 'Pumpkin Soup',
        category: 'soup',
        ingredients: [
            'Steamed pumpkin puree',
            '1/4 tsp dried oregano',
            '1/2 tsp dried thyme',
            'Crushed black pepper powder',
            'Pinch of grated nutmeg (optional)',
            'Salt to taste',
            'Olive oil'
        ],
        instructions: [
            'Heat olive oil in a pan.',
            'Add steamed pumpkin puree.',
            'Add dried oregano, thyme, crushed black pepper and nutmeg.',
            'Season with salt to taste.'
        ]
    },
    {
        id: 'lemon-coriander-soup',
        name: 'Lemon Coriander Soup',
        category: 'soup',
        ingredients: [
            '1 tsp finely chopped ginger',
            '1 tsp finely chopped garlic',
            'Chopped green chilies',
            '1/4 cup chopped spring onion whites',
            'Mixed vegetables (cabbage, spinach, corn, baby corn, broccoli, carrots, bok choy, green peas, cauliflower, mushrooms)',
            'Freshly crushed black pepper',
            'Fresh coriander leaves',
            'Lemon juice',
            'Chopped spring onion greens',
            'Olive oil'
        ],
        instructions: [
            'Heat olive oil in a heavy-bottomed pot on low to medium-low heat.',
            'Add ginger, garlic and green chilies. Sauté until raw aroma goes away.',
            'Add spring onion whites and sauté for a minute.',
            'Add mixed vegetables and sauté for a minute.',
            'Add crushed black pepper and gently boil on medium flame.',
            'Once vegetables are cooked, add coriander leaves.',
            'Add lemon juice and turn off the heat.',
            'Top with spring onion greens and serve.'
        ]
    },
    {
        id: 'mulligatawany-soup',
        name: 'Mulligatawany Soup',
        category: 'soup',
        ingredients: [
            'Onion, garlic, celery',
            'Carrots, cauliflower, tomato',
            'Masoor dal',
            'Salt, black pepper, turmeric, garam masala',
            'Water',
            'Coconut milk',
            'Coriander for garnish',
            'Oil'
        ],
        instructions: [
            'Heat oil in a pan. Add onion, garlic and celery. Saute for a minute.',
            'Add carrots, cauliflower, tomato and masoor dal.',
            'Add salt, black pepper, turmeric and garam masala.',
            'Add water and pressure cook for 6 minutes.',
            'Blend the soup.',
            'Stir in a spoon of coconut milk.',
            'Garnish with coriander and serve hot.'
        ]
    },
    {
        id: 'drumstick-soup',
        name: 'Drumstick Soup',
        category: 'soup',
        ingredients: [
            'Drumsticks',
            '2 cups water',
            'Tomato',
            'Cumin seeds',
            'Drumstick leaves',
            'Boiled moong dal (optional)',
            'Salt and black pepper to taste',
            'Olive oil'
        ],
        instructions: [
            'Wash, trim and chop drumsticks into finger-long pieces.',
            'Boil in 2 cups water until soft.',
            'Squeeze out the pulp and blend until smooth. Discard woody parts.',
            'Chop tomato into small pieces.',
            'Heat olive oil and add cumin seeds. When they splutter, add drumstick leaves and tomato.',
            'Add boiled moong dal (optional) and boil.',
            'Add drumstick pulp and mix well.',
            'Season with salt and black pepper.'
        ]
    },
    {
        id: 'french-onion-soup',
        name: 'French Onion Soup',
        category: 'soup',
        ingredients: [
            'Chopped onions',
            'Garlic',
            'Apple cider vinegar',
            'Water',
            'Salt and pepper to taste',
            'Olive oil'
        ],
        instructions: [
            'Heat olive oil in a heavy bottomed pan.',
            'Add chopped onions and garlic.',
            'Cook on slow flame for about 20 minutes until caramelized.',
            'Cook for 10 minutes, then add apple cider vinegar.',
            'Once onions are nicely caramelized, add water and bring to a boil.',
            'Season with salt and pepper and serve.'
        ]
    },

    // RAITAS
    {
        id: 'cucumber-walnut-raita',
        name: 'Cucumber-Walnut Raita',
        category: 'raita',
        ingredients: [
            '1 tbsp extra-virgin olive oil',
            '1 tsp cumin seeds',
            '1 minced garlic clove',
            '1/2 cup quartered, seeded, and sliced cucumber',
            '1/4 cup plus 2 tbsp finely chopped walnuts',
            '1 tbsp fresh lemon juice',
            '1 cup plain Greek yogurt',
            '1/2 tsp kosher salt',
            '1/4 tsp freshly ground black pepper'
        ],
        instructions: [
            'Heat oil in a small skillet over medium heat; add cumin and garlic.',
            'Cook, stirring, for 1 minute until toasted and fragrant; set aside to cool.',
            'Stir together cucumber, 1/4 cup walnuts, lemon juice, yogurt, salt, and pepper.',
            'Stir in cumin oil and top with additional 2 tbsp walnuts.'
        ]
    },
    {
        id: 'beetroot-raita',
        name: 'Beetroot Raita',
        category: 'raita',
        ingredients: [
            '100g beetroot',
            '100g yogurt',
            'Masala and salt to taste',
            'Cumin powder'
        ],
        instructions: [
            'Take yogurt in a bowl. Mix well till yogurt is smooth.',
            'Add roasted cumin powder, red chili powder and salt.',
            'Add masala in it.',
            'Add grated beetroot and mix well.',
            'The color of the yogurt will get pink because of the juice from beetroot.',
            'Chill the raita in the fridge.'
        ]
    },
    {
        id: 'cucumber-raita',
        name: 'Cucumber Raita',
        category: 'raita',
        ingredients: [
            'Half cucumber (50g)',
            'Groundnuts (10g)',
            'Curd (25g)',
            'Salt to taste'
        ],
        instructions: [
            'Grate cucumber.',
            'Take cucumber in one bowl and add groundnuts and curd in it.',
            'Add salt to taste.'
        ]
    },
    {
        id: 'apple-pomegranate-raita',
        name: 'Apple and Pomegranate Raita',
        category: 'raita',
        ingredients: [
            '1/4 cup fresh low fat curds, whisked',
            '1/8 tsp roasted cumin seeds powder',
            'Salt to taste',
            '1/4 cup chopped apples',
            '1/4 cup pomegranate'
        ],
        instructions: [
            'Combine the curds, cumin seeds powder and salt in a bowl and mix well.',
            'Refrigerate to chill.',
            'Add apples, pomegranate and cucumber and toss well.',
            'Serve chilled.'
        ]
    },
    {
        id: 'pumpkin-raita',
        name: 'Pumpkin Raita',
        category: 'raita',
        ingredients: [
            'Roughly chopped red pumpkin',
            'Curd (dahi)',
            'Salt to taste',
            '1 tbsp oil',
            '1 tsp mustard seeds',
            '4 curry leaves',
            '1 slit green chilli',
            '1/4 tsp asafoetida'
        ],
        instructions: [
            'Pressure cook the red pumpkin for 5 whistles.',
            'Allow steam to escape before opening the lid.',
            'Mash the pumpkin using a masher.',
            'Combine curd, mashed pumpkin, and salt in a deep bowl and mix well.',
            'Heat oil in a small non-stick pan, add mustard seeds, curry leaves, green chilli and asafoetida.',
            'Cook on medium flame for 1 minute.',
            'Pour the tempering over the raita and mix well.',
            'Refrigerate and serve chilled.'
        ]
    }
];

// Helper function to get all unique categories
function getCategories() {
    const categories = [...new Set(RECIPES.map(recipe => recipe.category))];
    return categories;
}

// Helper function to get recipes by category
function getRecipesByCategory(category) {
    if (category === 'all') {
        return RECIPES;
    }
    return RECIPES.filter(recipe => recipe.category === category);
}

// Helper function to get recipe by ID
function getRecipeById(id) {
    return RECIPES.find(recipe => recipe.id === id);
}
