/*
 * Item data for the prototype.
 *
 * PLACEHOLDER DATA: the answers follow the team's Figma screens and are NOT checked against the
 * City of Calgary's official What Goes Where guide. Check every item before the final demo.
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
 *   warning   hazard text shown above the answer (drop-off items)
 *   alsoDepot true when the item can also go to a bottle depot (shows a second answer)
 */
(function (root) {
  // Categories with "subs" open the sub-category grid (Figma "03"); a category without "subs" lists its items directly (Figma "04").
  // Every item in a category with subs needs a "sub" that matches one of them.
  var CATEGORIES = [
    { id: 'food-packaging', name: 'Food Packaging', subs: [
      { id: 'plastic', name: 'Plastic' }, { id: 'metal', name: 'Metal' },
      { id: 'glass', name: 'Glass' }, { id: 'cartons-cups', name: 'Cartons and cups' }] },
    { id: 'paper', name: 'Paper and Cardboard', subs: [
      { id: 'cardboard', name: 'Cardboard' }, { id: 'paper', name: 'Paper' }] },
    { id: 'food-scraps', name: 'Food Scraps', subs: [
      { id: 'fruit-veg', name: 'Fruit and vegetables' }, { id: 'other-food', name: 'Other food' }] },
    { id: 'household', name: 'Household Items', subs: [
      { id: 'kitchen', name: 'Kitchen' }, { id: 'bathroom', name: 'Bathroom' },
      { id: 'clothing', name: 'Clothing and textiles' }] },
    { id: 'hazardous', name: 'Hazardous', subs: [
      { id: 'batteries', name: 'Batteries' }, { id: 'paint-oil', name: 'Paint and oil' }] },
    { id: 'electronics', name: 'Electronics', subs: [
      { id: 'phones-computers', name: 'Phones and computers' }, { id: 'small-appliances', name: 'Small appliances' }] },
  ];

  var ITEMS = [
    // ---- Food packaging ----
    { id: 'pop-can', name: 'Pop can (aluminum)', category: 'food-packaging', sub: 'metal', bin: 'blue', how: 'Empty it. A quick rinse is fine.', aliases: ['can', 'soda can', 'aluminum can', 'pop', 'drink can'], alsoDepot: true },
    { id: 'tin-can', name: 'Tin can', category: 'food-packaging', sub: 'metal', bin: 'blue', how: 'Empty and rinse it.', aliases: ['food can', 'soup can', 'steel can'] },
    { id: 'plastic-container', name: 'Plastic container (yogurt tub)', category: 'food-packaging', sub: 'plastic', bin: 'blue', how: 'Empty and rinse it. Take the lid off.', aliases: ['plastic tub', 'yogurt tub', 'plastic container', 'takeout container'] },
    { id: 'milk-carton', name: 'Milk carton', category: 'food-packaging', sub: 'cartons-cups', bin: 'blue', how: 'Empty and rinse it, then flatten it.', aliases: ['carton', 'juice carton', 'juice box'] },
    { id: 'glass-jar', name: 'Rinsed glass jar', category: 'food-packaging', sub: 'glass', bin: 'blue', how: 'Rinse it and take the lid off.', aliases: ['jar', 'glass bottle', 'glass'] },
    { id: 'food-soiled-bag', name: 'Food-soiled Ziploc bag', category: 'food-packaging', sub: 'plastic', bin: 'black', how: "Food-soiled plastic can't be recycled. Put it in the garbage. No need to rinse it.", aliases: ['ziploc', 'plastic bag', 'zip bag', 'sandwich bag'] },
    { id: 'aluminum-foil', name: 'Aluminum foil (clean)', category: 'food-packaging', sub: 'metal', bin: 'blue', how: 'Only clean foil. Scrape off food first.', aliases: ['foil', 'tin foil'] },
    { id: 'aerosol-can', name: 'Aerosol can (empty)', category: 'food-packaging', sub: 'metal', bin: 'blue', how: 'It must be completely empty.', aliases: ['spray can', 'aerosol'] },
    {
      id: 'cup', name: 'Cup', category: 'food-packaging', sub: 'cartons-cups', aliases: ['cold drink cup', 'beverage cup', 'coffee cup', 'paper cup', 'plastic cup', 'foam cup', 'styrofoam'],
      how: 'It depends on what the cup is made of:',
      options: [
        { label: 'Paper cup (coffee cup)', note: 'Empty it. Lid goes in the garbage.', bin: 'blue' },
        { label: 'Plastic cup', note: 'Empty and rinse it.', bin: 'blue' },
        { label: 'Foam cup (Styrofoam)', note: "Foam can't be recycled.", bin: 'black' },
      ],
    },
    // ---- Paper and cardboard ----
    {
      id: 'pizza-box', name: 'Pizza box', category: 'paper', sub: 'cardboard', aliases: ['pizza', 'greasy box'],
      how: 'It depends on the box. Which one is yours?',
      options: [
        { label: 'Greasy or has food on it', note: 'Compost it. Grease spoils recycling.', bin: 'green' },
        { label: 'Clean and dry', note: 'Recycle it. Flatten it first.', bin: 'blue' },
      ],
    },
    { id: 'cardboard-box', name: 'Cardboard box', category: 'paper', sub: 'cardboard', bin: 'blue', how: 'Flatten it and remove any packing tape.', aliases: ['cardboard', 'box', 'shipping box'] },
    { id: 'bakery-box', name: 'Bakery box', category: 'paper', sub: 'cardboard', bin: 'blue', how: 'Flatten it. Remove food and any plastic window.', aliases: ['cake box', 'donut box'] },
    { id: 'egg-carton', name: 'Cardboard egg carton', category: 'paper', sub: 'cardboard', bin: 'blue', how: 'Flatten it.', aliases: ['egg box', 'cardboard'] },
    { id: 'newspaper', name: 'Newspaper', category: 'paper', sub: 'paper', bin: 'blue', how: 'Keep it dry and loose.', aliases: ['paper', 'magazine', 'flyer'] },
    { id: 'paper-towel', name: 'Paper towel (used)', category: 'paper', sub: 'paper', bin: 'green', how: 'Used paper towels go in the compost.', aliases: ['paper towels', 'napkin', 'tissue', 'kitchen paper'] },
    // ---- Food scraps ----
    { id: 'food-scraps', name: 'Food scraps', category: 'food-scraps', sub: 'other-food', bin: 'green', how: 'Put food scraps in the compost bin. Drain liquids first.', aliases: ['leftovers', 'food waste', 'compost'] },
    { id: 'banana-peel', name: 'Banana peel', category: 'food-scraps', sub: 'fruit-veg', bin: 'green', how: 'Compost it.', aliases: ['peel', 'fruit peel'] },
    { id: 'apple-core', name: 'Apple core', category: 'food-scraps', sub: 'fruit-veg', bin: 'green', how: 'Compost it.', aliases: ['core', 'fruit'] },
    { id: 'coffee-grounds', name: 'Coffee grounds', category: 'food-scraps', sub: 'other-food', bin: 'green', how: 'Compost them, with the paper filter.', aliases: ['coffee', 'tea bag'] },
    // ---- Household ----
    { id: 'broken-mug', name: 'Broken mug', category: 'household', sub: 'kitchen', bin: 'black', how: 'Wrap sharp pieces in paper before you put them in the garbage.', aliases: ['mug', 'broken glass', 'ceramic', 'plate'] },
    { id: 'drinking-glass', name: 'Broken drinking glass', category: 'household', sub: 'kitchen', bin: 'black', how: 'Drinking glasses are not recycled like jars. Wrap the pieces in paper and put them in the garbage.', aliases: ['drinking glass', 'wine glass', 'tumbler'] },
    { id: 'diaper', name: 'Diaper', category: 'household', sub: 'bathroom', bin: 'black', how: 'Wrap it and put it in the garbage.', aliases: ['nappy'] },
    { id: 'toothbrush', name: 'Toothbrush', category: 'household', sub: 'bathroom', bin: 'black', how: 'Put it in the garbage.', aliases: ['electric toothbrush head', 'toothbrush head'] },
    { id: 'old-clothes', name: 'Old clothes', category: 'household', sub: 'clothing', bin: 'black', how: 'If they can still be worn, donate them. If they are worn out, put them in the garbage.', aliases: ['clothes', 'clothing', 'shirt', 'jeans', 'textiles'] },
    { id: 'old-towel', name: 'Old towel or bedding', category: 'household', sub: 'clothing', bin: 'black', how: 'Animal shelters often take old towels and blankets. Otherwise, put them in the garbage.', aliases: ['towel', 'bedding', 'sheets', 'blanket', 'pillow'] },
    // ---- Hazardous ----
    { id: 'battery', name: 'Battery (household)', category: 'hazardous', sub: 'batteries', bin: 'dropoff', how: 'Keep batteries separate and take them to a drop-off location.', aliases: ['batteries', 'aa battery', 'button battery'], warning: 'Batteries can start a fire in a cart or a truck. Do not put them in any cart.' },
    { id: 'car-battery', name: 'Car battery', category: 'hazardous', sub: 'batteries', bin: 'dropoff', how: 'Take it to a hazardous waste drop-off or the place that sold it.', aliases: ['vehicle battery', 'auto battery'], warning: 'Car batteries contain acid and heavy metals. Do not put them in any cart.' },
    { id: 'paint-can', name: 'Paint can (leftover paint)', category: 'hazardous', sub: 'paint-oil', bin: 'dropoff', how: 'Close the lid tightly and take it to a hazardous waste drop-off.', aliases: ['paint', 'leftover paint'], warning: 'Paint can catch fire or leak in the truck. Take it to a hazardous waste drop-off.' },
    { id: 'used-oil', name: 'Used oil', category: 'hazardous', sub: 'paint-oil', bin: 'dropoff', how: 'Transport it in a sealed container and take it to a drop-off.', aliases: ['motor oil', 'engine oil', 'oil'], warning: 'Oil can leak and pollute. Do not pour it down a drain or put it in any cart.' },
    // ---- Electronics ----
    { id: 'old-phone', name: 'Old phone', category: 'electronics', sub: 'phones-computers', bin: 'dropoff', how: 'Take it to an electronics drop-off. Delete your data first.', aliases: ['mobile', 'cell phone', 'smartphone', 'charger'] },
    { id: 'laptop', name: 'Old laptop or computer', category: 'electronics', sub: 'phones-computers', bin: 'dropoff', how: 'Take it to an electronics drop-off. Back up and delete your data first.', aliases: ['computer', 'laptop', 'desktop', 'tablet', 'keyboard', 'mouse'] },
    { id: 'toaster', name: 'Toaster or kettle', category: 'electronics', sub: 'small-appliances', bin: 'dropoff', how: 'Small appliances go to an electronics drop-off, even if they are broken.', aliases: ['toaster', 'kettle', 'toaster oven', 'electric kettle'] },
    { id: 'hair-dryer', name: 'Hair dryer or straightener', category: 'electronics', sub: 'small-appliances', bin: 'dropoff', how: 'Take it to an electronics drop-off.', aliases: ['hairdryer', 'blow dryer', 'straightener', 'curling iron'] },
  ];

  var BINS = {
    blue: { label: 'BLUE BIN', name: 'Recycling' },
    green: { label: 'GREEN BIN', name: 'Compost' },
    black: { label: 'BLACK BIN', name: 'Garbage' },
    dropoff: { label: 'DROP-OFF ONLY', name: 'Special drop-off' },
  };

  // Crash course text for each bin (PLACEHOLDER: check against the City guide).
  var BIN_INFO = {
    blue: {
      goes: 'Paper, cardboard, cans, plastic containers, cartons, glass jars and bottles.',
      never: 'Plastic bags, food-soiled items, foam, anything with food still in it.',
      tip: 'Empty and rinse containers. Put items in loose, not in a bag. Flatten boxes.',
    },
    green: {
      goes: 'Food scraps, food-soiled paper (napkins, greasy pizza boxes), coffee grounds, yard waste.',
      never: 'Plastic of any kind, glass, metal, liquids.',
      tip: 'Line the kitchen pail with newspaper or a paper bag to keep it clean.',
    },
    black: {
      goes: 'Things that cannot be recycled or composted: food-soiled plastic, foam, diapers, broken dishes.',
      never: 'Batteries, paint, oil, electronics, or anything that goes in the blue or green bin.',
      tip: 'Bag your garbage and wrap sharp pieces in paper.',
    },
    dropoff: {
      goes: 'Batteries, paint, motor oil, propane tanks, electronics.',
      never: 'Never put these in any cart: they can start fires or leak in the truck.',
      tip: 'Keep them in their original container and take them to a drop-off.',
    },
  };

  var data = { CATEGORIES: CATEGORIES, ITEMS: ITEMS, BINS: BINS, BIN_INFO: BIN_INFO };
  root.WGW_DATA = data;
  if (typeof module !== 'undefined' && module.exports) module.exports = data;
})(typeof window !== 'undefined' ? window : globalThis);
