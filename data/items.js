/*
 * Item data for the prototype.
 *
 * The answers come from the City of Calgary "What Goes Where" guide (calgary.ca), checked in November 2026,
 * shortened to fit the app. Each item links to its City page in "source". We only include the items the
 * walkthroughs need plus common ones, not the whole guide.
 *
 * Pictures: Fluent Emoji 3D by Microsoft (MIT licence), files in assets/img/.
 *
 * Item fields:
 *   id        unique, lowercase, dashes
 *   name      shown to the user
 *   category  one of CATEGORIES[].id
 *   sub       one of that category's subs[].id (only when the category has subs)
 *   bin       'blue' | 'green' | 'black' | 'dropoff'     (omit when the item has options)
 *   how       short preparation advice
 *   aliases   other words people type (used by search)
 *   options   for "it depends" items: [{ label, note, bin }]
 *   warning   hazard text shown above the answer (hazardous items)
 *   alsoDepot true when the item can also go to a bottle depot (shows a second answer)
 *   img       picture file in assets/img/
 *   source    the City of Calgary page the answer comes from
 */
(function (root) {
  var CITY = 'https://www.calgary.ca/waste/what-goes-where/';

  // Categories with "subs" open the sub-category grid (Figma "03"); a category without "subs" lists its items directly (Figma "04").
  // Every item in a category with subs needs a "sub" that matches one of them.
  var CATEGORIES = [
    { id: 'food-packaging', name: 'Food Packaging', img: 'takeout-box.png', subs: [
      { id: 'plastic', name: 'Plastic', img: 'shopping-bags.png' }, { id: 'metal', name: 'Metal', img: 'canned-food.png' },
      { id: 'glass', name: 'Glass', img: 'jar.png' }, { id: 'cartons-cups', name: 'Cartons and cups', img: 'beverage-box.png' }] },
    { id: 'paper', name: 'Paper and Cardboard', img: 'package.png', subs: [
      { id: 'cardboard', name: 'Cardboard', img: 'package.png' }, { id: 'paper', name: 'Paper', img: 'newspaper.png' }] },
    { id: 'food-scraps', name: 'Food Scraps', img: 'red-apple.png', subs: [
      { id: 'fruit-veg', name: 'Fruit and vegetables', img: 'carrot.png' }, { id: 'other-food', name: 'Other food', img: 'bread.png' }] },
    { id: 'household', name: 'Household Items', img: 'couch-and-lamp.png', subs: [
      { id: 'kitchen', name: 'Kitchen', img: 'fork-and-knife-with-plate.png' }, { id: 'bathroom', name: 'Bathroom', img: 'bathtub.png' },
      { id: 'clothing', name: 'Clothing and textiles', img: 't-shirt.png' }] },
    { id: 'hazardous', name: 'Hazardous', img: 'warning.png', subs: [
      { id: 'batteries', name: 'Batteries', img: 'battery.png' }, { id: 'paint-oil', name: 'Paint and oil', img: 'paintbrush.png' }] },
    { id: 'electronics', name: 'Electronics', img: 'laptop.png', subs: [
      { id: 'phones-computers', name: 'Phones and computers', img: 'mobile-phone.png' }, { id: 'small-appliances', name: 'Small appliances', img: 'electric-plug.png' }] },
  ];

  var ITEMS = [
    // ---- Food packaging ----
    { id: 'pop-can', name: 'Pop can (aluminum)', category: 'food-packaging', sub: 'metal', bin: 'blue', how: 'Empty it. Caps and lids can stay on.', aliases: ['can', 'soda can', 'aluminum can', 'pop', 'drink can', 'beer can'], alsoDepot: true, img: 'canned-food.png', source: CITY + 'drink-containers.html' },
    { id: 'tin-can', name: 'Tin can', category: 'food-packaging', sub: 'metal', bin: 'blue', how: 'Empty and rinse it. The paper label can stay on. Put the metal lid inside the can and squeeze the top closed.', aliases: ['food can', 'soup can', 'steel can', 'tuna can'], img: 'canned-food.png', source: CITY + 'metal-food-and-beverage-cans.html' },
    { id: 'plastic-container', name: 'Plastic container (takeout, tub)', category: 'food-packaging', sub: 'plastic', bin: 'blue', how: 'Scrape the food scraps into the green bin, then rinse it.', aliases: ['plastic tub', 'yogurt tub', 'plastic container', 'takeout container', 'salad container'], img: 'takeout-box.png', source: CITY + 'plastic-takeout-food-containers.html' },
    { id: 'milk-carton', name: 'Milk carton', category: 'food-packaging', sub: 'cartons-cups', bin: 'blue', how: 'Empty and rinse it. The cap can stay on.', aliases: ['carton', 'milk jug', 'juice carton'], alsoDepot: true, img: 'glass-of-milk.png', source: CITY + 'drink-containers.html' },
    { id: 'juice-box', name: 'Juice box', category: 'food-packaging', sub: 'cartons-cups', bin: 'blue', how: 'Empty it. The straw goes in the blue bin separately.', aliases: ['juice pouch', 'tetra pak', 'drink box'], alsoDepot: true, img: 'beverage-box.png', source: CITY + 'drink-containers.html' },
    { id: 'glass-jar', name: 'Rinsed glass jar', category: 'food-packaging', sub: 'glass', bin: 'blue', how: 'Empty and clean it. Labels can stay on. Broken jars can go in loose.', aliases: ['jar', 'glass bottle', 'glass', 'pickle jar', 'sauce jar'], img: 'jar.png', source: CITY + 'glass-jars.html' },
    { id: 'food-soiled-bag', name: 'Plastic bag (Ziploc, bread bag)', category: 'food-packaging', sub: 'plastic', bin: 'blue', how: 'Empty it: turn it inside out to shake out crumbs, and put food scraps in the green bin. Bags go in loose.', aliases: ['ziploc', 'plastic bag', 'zip bag', 'sandwich bag', 'bread bag', 'grocery bag', 'freezer bag', 'food-soiled bag'], img: 'shopping-bags.png', source: CITY + 'plastic-bags.html' },
    { id: 'aluminum-foil', name: 'Aluminum foil and trays', category: 'food-packaging', sub: 'metal', bin: 'blue', how: 'Clean and dry only: crumple foil into a ball. Foil covered in grease that won\'t come off goes in the black bin.', aliases: ['foil', 'tin foil', 'foil tray', 'pie plate'], img: 'shallow-pan-of-food.png', source: CITY + 'metal-aluminum-foil-plates-and-containers.html' },
    { id: 'aerosol-can', name: 'Aerosol can (food, hairspray)', category: 'food-packaging', sub: 'metal', bin: 'blue', how: 'Use it up until nothing sprays out. Don\'t puncture it. The cap can stay on.', aliases: ['spray can', 'aerosol', 'hairspray', 'cooking spray', 'whipped cream', 'deodorant'], img: 'lotion-bottle.png', source: CITY + 'aerosol-food-body.html' },
    {
      id: 'cup', name: 'Cup', category: 'food-packaging', sub: 'cartons-cups', aliases: ['cold drink cup', 'beverage cup', 'coffee cup', 'paper cup', 'plastic cup', 'foam cup', 'styrofoam', 'compostable cup'],
      how: 'It depends on what the cup is made of:', img: 'cup-with-straw.png', source: CITY + 'paper-cups.html',
      options: [
        { label: 'Paper cup (coffee cup)', note: 'Empty it and wipe it. Lid and straw go in the blue bin separately.', bin: 'blue' },
        { label: 'Plastic cup', note: 'Empty it. The lid can stay on.', bin: 'blue' },
        { label: 'Foam cup (Styrofoam)', note: 'Empty and rinse it. Foam is accepted in the blue bin.', bin: 'blue' },
        { label: 'Paper, labelled "compostable"', note: 'Compostable paper goes in the compost.', bin: 'green' },
        { label: 'Plastic, labelled "compostable"', note: 'It doesn\'t break down fast enough to compost. Garbage.', bin: 'black' },
      ],
    },
    // ---- Paper and cardboard ----
    {
      id: 'pizza-box', name: 'Pizza box', category: 'paper', sub: 'cardboard', aliases: ['pizza', 'greasy box', 'pizza liner'],
      how: 'It depends on the box. Which one is yours?', img: 'pizza.png', source: CITY + 'cardboard-pizza-boxes.html',
      options: [
        { label: 'Greasy or has food on it', note: 'A lot of grease, cheese or sauce: compost it, with the liner.', bin: 'green' },
        { label: 'Clean or a little grease', note: 'Some grease is OK. Recycle it.', bin: 'blue' },
      ],
    },
    { id: 'cardboard-box', name: 'Cardboard box', category: 'paper', sub: 'cardboard', bin: 'blue', how: 'Flatten it and remove as much tape as you can (tape goes in the garbage). It must fit inside the cart with the lid closed.', aliases: ['cardboard', 'box', 'shipping box', 'moving box', 'shoebox'], img: 'package.png', source: CITY + 'cardboard-boxes.html' },
    {
      id: 'bakery-box', name: 'Bakery box', category: 'paper', sub: 'cardboard', aliases: ['cake box', 'donut box', 'doughnut box', 'cupcake box'],
      how: 'It depends on how dirty it is:', img: 'cupcake.png', source: CITY + 'bakery-boxes.html',
      options: [
        { label: 'Clean and empty', note: 'Recycle it. Crumbs go in the compost.', bin: 'blue' },
        { label: 'Icing or food stuck on it', note: 'Compost it.', bin: 'green' },
      ],
    },
    { id: 'egg-carton', name: 'Egg carton', category: 'paper', sub: 'cardboard', bin: 'blue', how: 'Paper, plastic and foam egg cartons all go in the blue bin. Empty it and remove any paper inserts.', aliases: ['egg box', 'foam egg carton'], img: 'nest-with-eggs.png', source: CITY + 'egg-cartons.html' },
    { id: 'newspaper', name: 'Newspaper and flyers', category: 'paper', sub: 'paper', bin: 'blue', how: 'Remove any plastic wrapping. Staples are OK.', aliases: ['paper', 'magazine', 'flyer', 'newspaper', 'junk mail'], img: 'newspaper.png', source: CITY + 'mail-stationery-office-paper.html' },
    { id: 'envelope', name: 'Envelope and mail', category: 'paper', sub: 'paper', bin: 'blue', how: 'Remove the plastic window and recycle it separately.', aliases: ['envelope', 'mail', 'letter', 'office paper', 'greeting card'], img: 'envelope.png', source: CITY + 'mail-stationery-office-paper.html' },
    { id: 'paper-towel', name: 'Paper towel (used)', category: 'paper', sub: 'paper', bin: 'green', how: 'Used for food or to dry your hands: compost it. With cleaning products on it: garbage.', aliases: ['paper towels', 'napkin', 'serviette', 'kitchen paper'], img: 'roll-of-paper.png', source: CITY + 'paper-napkins-and-paper-towels.html' },
    // ---- Food scraps ----
    { id: 'food-scraps', name: 'Food scraps', category: 'food-scraps', sub: 'other-food', bin: 'green', how: 'All food goes in the compost: leftovers, dairy, spoiled food. Take it out of its packaging first.', aliases: ['leftovers', 'food waste', 'compost', 'plate scrapings'], img: 'pot-of-food.png', source: CITY + 'food.html' },
    { id: 'meat-bones', name: 'Meat and bones', category: 'food-scraps', sub: 'other-food', bin: 'green', how: 'Compost it. Wrap it in paper towel or newspaper to stop smells.', aliases: ['bones', 'meat', 'chicken bones', 'fish'], img: 'meat-on-bone.png', source: CITY + 'food.html' },
    { id: 'bread', name: 'Bread and pasta', category: 'food-scraps', sub: 'other-food', bin: 'green', how: 'Compost it, even if it\'s mouldy.', aliases: ['bread', 'pasta', 'rice', 'cereal'], img: 'bread.png', source: CITY + 'food.html' },
    { id: 'eggshells', name: 'Eggshells', category: 'food-scraps', sub: 'other-food', bin: 'green', how: 'Compost them.', aliases: ['egg shell', 'eggs'], img: 'egg.png', source: CITY + 'food.html' },
    { id: 'coffee-grounds', name: 'Coffee grounds and tea bags', category: 'food-scraps', sub: 'other-food', bin: 'green', how: 'Compost them with the paper filter. Remove staples from tea bags. Nylon tea bags go in the garbage.', aliases: ['coffee', 'tea bag', 'coffee filter', 'tea'], img: 'teacup-without-handle.png', source: CITY + 'tea-bags-coffee-filters.html' },
    { id: 'banana-peel', name: 'Banana peel', category: 'food-scraps', sub: 'fruit-veg', bin: 'green', how: 'Compost it. Remove any produce sticker.', aliases: ['peel', 'fruit peel'], img: 'banana.png', source: CITY + 'fruits-and-vegetables.html' },
    { id: 'apple-core', name: 'Apple core', category: 'food-scraps', sub: 'fruit-veg', bin: 'green', how: 'Compost it. Remove any produce sticker.', aliases: ['core', 'fruit'], img: 'red-apple.png', source: CITY + 'fruits-and-vegetables.html' },
    { id: 'vegetable-peels', name: 'Vegetable peels', category: 'food-scraps', sub: 'fruit-veg', bin: 'green', how: 'Raw, cooked or mouldy: compost them. Remove plastic wrap and stickers.', aliases: ['vegetables', 'peelings', 'corn cob', 'salad'], img: 'carrot.png', source: CITY + 'fruits-and-vegetables.html' },
    // ---- Household ----
    { id: 'broken-mug', name: 'Broken mug or plate', category: 'household', sub: 'kitchen', bin: 'black', how: 'Wrap the pieces in two layers of paper, tie them in a bag, write "sharps" on it, and put it in the garbage. Still usable? Donate it.', aliases: ['mug', 'broken glass', 'ceramic', 'plate', 'dishes', 'porcelain'], img: 'hot-beverage.png', source: CITY + 'glass-porcelain-ceramic-decor-houseware.html' },
    { id: 'drinking-glass', name: 'Broken drinking glass', category: 'household', sub: 'kitchen', bin: 'black', how: 'Drinking glass is not recyclable like jars. Wrap the pieces in two layers of paper, tie them in a bag, write "sharps" on it, and put it in the garbage.', aliases: ['drinking glass', 'wine glass', 'tumbler'], img: 'tumbler-glass.png', source: CITY + 'glass-porcelain-ceramic-decor-houseware.html' },
    { id: 'diaper', name: 'Diaper', category: 'household', sub: 'bathroom', bin: 'black', how: 'Double-bag it and tie it closed. Never flush it, and never compost it, even if it says biodegradable.', aliases: ['nappy', 'diapers'], img: 'baby.png', source: CITY + 'diapers.html' },
    { id: 'toothbrush', name: 'Toothbrush', category: 'household', sub: 'bathroom', bin: 'black', how: 'Plastic, bamboo or charcoal: garbage. Electric toothbrushes go to an electronics drop-off.', aliases: ['toothbrush head', 'bamboo toothbrush'], img: 'toothbrush.png', source: CITY + 'toothbrush.html' },
    { id: 'old-clothes', name: 'Old clothes', category: 'household', sub: 'clothing', bin: 'dropoff', how: 'Still wearable? Donate them. Worn out or ripped? Bag them (clean) and take them to a City Eco Centre for free textile recycling.', aliases: ['clothes', 'clothing', 'shirt', 'jeans', 'textiles'], img: 't-shirt.png', source: CITY + 'clothing-and-shoes.html' },
    { id: 'shoes', name: 'Shoes', category: 'household', sub: 'clothing', bin: 'dropoff', how: 'Still wearable? Donate them. Worn out? Take them to a City Eco Centre for free textile recycling.', aliases: ['shoe', 'sneakers', 'boots', 'runners'], img: 'running-shoe.png', source: CITY + 'clothing-and-shoes.html' },
    { id: 'old-towel', name: 'Old towel or bedding', category: 'household', sub: 'clothing', bin: 'dropoff', how: 'Donate them if they are usable. Otherwise, bag them (clean) and take them to a City Eco Centre for free textile recycling.', aliases: ['towel', 'bedding', 'sheets', 'blanket', 'pillow'], img: 'bed.png', source: CITY + 'clothing-and-shoes.html' },
    // ---- Hazardous ----
    { id: 'battery', name: 'Battery (household)', category: 'hazardous', sub: 'batteries', bin: 'dropoff', how: 'Tape over the ends or keep each one in a bag. Take them to a free battery drop-off (stores like London Drugs, Staples or Calgary Co-op) or a fire hall hazardous waste drop-off.', aliases: ['batteries', 'aa battery', 'button battery', 'rechargeable battery'], warning: 'Batteries get crushed in the truck and start fires. Never put them in any cart.', img: 'battery.png', source: CITY + 'batteries-household.html' },
    { id: 'car-battery', name: 'Car battery', category: 'hazardous', sub: 'batteries', bin: 'dropoff', how: 'Take it to a fire hall hazardous waste drop-off or a City Eco Centre. It\'s free.', aliases: ['vehicle battery', 'auto battery', 'lead-acid battery'], warning: 'Never put a car battery in any cart. It is a major safety hazard for drivers and staff.', img: 'automobile.png', source: CITY + 'batteries-automotive.html' },
    { id: 'paint-can', name: 'Paint can (leftover paint)', category: 'hazardous', sub: 'paint-oil', bin: 'dropoff', how: 'Keep it in the original can (or a strong, labelled container) and close it tightly. Take it to a fire hall hazardous waste drop-off or a City Eco Centre: free, up to 20 litres per visit.', aliases: ['paint', 'leftover paint', 'spray paint', 'paint thinner'], warning: 'Never pour paint down a sink, toilet or drain, and never put it in any cart.', img: 'paintbrush.png', source: CITY + 'chemicals-paint-and-paint-cans.html' },
    { id: 'used-oil', name: 'Used motor oil', category: 'hazardous', sub: 'paint-oil', bin: 'dropoff', how: 'Keep it in a strong, sealed, labelled container. Take it (and the oil filter) to a fire hall hazardous waste drop-off or a City Eco Centre: free, up to 20 litres per visit.', aliases: ['motor oil', 'engine oil', 'oil', 'oil filter'], warning: 'Never pour oil down a drain, and never put it in any cart.', img: 'oil-drum.png', source: CITY + 'motor-oil.html' },
    // ---- Electronics ----
    { id: 'old-phone', name: 'Old phone', category: 'electronics', sub: 'phones-computers', bin: 'dropoff', how: 'Still works? Give it away, sell it or donate it. Broken? Delete your data and take it to a free electronics drop-off or a City Eco Centre. Never in the blue bin.', aliases: ['mobile', 'cell phone', 'smartphone', 'charger'], img: 'mobile-phone.png', source: CITY + 'cell-phones.html' },
    { id: 'laptop', name: 'Old laptop or computer', category: 'electronics', sub: 'phones-computers', bin: 'dropoff', how: 'Still works? Donate it. Broken? Delete your data and take it to a free electronics drop-off or a City Eco Centre. Cables and chargers go too.', aliases: ['computer', 'laptop', 'desktop', 'keyboard', 'mouse', 'monitor', 'cable'], img: 'laptop.png', source: CITY + 'computers-and-computer-accessories.html' },
    { id: 'toaster', name: 'Toaster or kettle', category: 'electronics', sub: 'small-appliances', bin: 'dropoff', how: 'Still works? Donate it. Broken? Remove the crumbs and take it to a free electronics drop-off or a City Eco Centre.', aliases: ['toaster', 'kettle', 'toaster oven', 'electric kettle', 'microwave', 'blender', 'coffee maker'], img: 'teapot.png', source: CITY + 'small-kitchen-appliances.html' },
    { id: 'hair-dryer', name: 'Hair dryer or electric razor', category: 'electronics', sub: 'small-appliances', bin: 'dropoff', how: 'Still works? Donate it. Broken? Take it to a free electronics drop-off or a City Eco Centre.', aliases: ['hairdryer', 'blow dryer', 'straightener', 'curling iron', 'shaver', 'electric toothbrush'], img: 'razor.png', source: CITY + 'small-bathroom-appliances.html' },
  ];

  var BINS = {
    blue: { label: 'BLUE BIN', name: 'Recycling' },
    green: { label: 'GREEN BIN', name: 'Compost' },
    black: { label: 'BLACK BIN', name: 'Garbage' },
    dropoff: { label: 'DROP-OFF ONLY', name: 'Special drop-off' },
  };

  // Crash course text for each bin, from the City's "Preparing your recyclables / food and yard waste / garbage" pages.
  var BIN_INFO = {
    blue: {
      img: 'recycling-symbol.png',
      goes: 'Paper, cardboard, cans, foil, glass jars and bottles, plastic containers and bags, cartons, foam.',
      never: 'Electronics, batteries, "compostable" plastic, or anything with food or liquid still in it.',
      tip: 'Empty, clean, loose: scrape food into the compost, rinse containers, and put everything in loose, not in a bag.',
    },
    green: {
      img: 'seedling.png',
      goes: 'All food (meat, bones and dairy too), food-soiled paper, coffee grounds, tea bags, yard waste.',
      never: 'Packaging, plastic (even if it says "compostable" or "biodegradable"), diapers.',
      tip: 'Line your kitchen pail with a paper bag or a certified compostable bag, and empty it every 2–3 days.',
    },
    black: {
      img: 'wastebasket.png',
      goes: 'What can\'t be recycled or composted: diapers, broken dishes and drinking glasses, toothbrushes, "compostable" plastic.',
      never: 'Batteries, paint, oil, electronics, and anything that goes in the blue or green bin.',
      tip: 'Bag your garbage. Wrap broken glass in two layers of paper, tie the bag and write "sharps" on it.',
    },
    dropoff: {
      img: 'warning.png',
      goes: 'Batteries, paint and motor oil (fire hall drop-offs), electronics (electronics drop-offs), clothes and textiles (City Eco Centres).',
      never: 'Never put these in any cart: batteries and chemicals can start fires or leak in the truck.',
      tip: 'Drop-offs are free. Keep chemicals in their original container, up to 20 litres per visit.',
    },
  };

  var data = { CATEGORIES: CATEGORIES, ITEMS: ITEMS, BINS: BINS, BIN_INFO: BIN_INFO };
  root.WGW_DATA = data;
  if (typeof module !== 'undefined' && module.exports) module.exports = data;
})(typeof window !== 'undefined' ? window : globalThis);
