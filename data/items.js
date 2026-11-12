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
 *   bin       'blue' | 'green' | 'black' | 'dropoff'     (omit when the item has options)
 *   how       short preparation advice
 *   aliases   other words people type (used by search)
 *   options   for "it depends" items: [{ label, note, bin }]
 *   warning   hazard text shown above the answer (drop-off items)
 */
(function (root) {
  var CATEGORIES = [
    { id: 'food-packaging', name: 'Food Packaging' },
    { id: 'paper', name: 'Paper and Cardboard' },
    { id: 'food-scraps', name: 'Food Scraps' },
    { id: 'household', name: 'Household Items' },
    { id: 'hazardous', name: 'Hazardous' },
    { id: 'electronics', name: 'Electronics' },
  ];

  var ITEMS = [
    // ---- Food packaging ----
    { id: 'pop-can', name: 'Pop can (aluminum)', category: 'food-packaging', bin: 'blue', how: 'Empty it. A quick rinse is fine.', aliases: ['can', 'soda can', 'aluminum can', 'pop', 'drink can'] },
    { id: 'tin-can', name: 'Tin can', category: 'food-packaging', bin: 'blue', how: 'Empty and rinse it.', aliases: ['food can', 'soup can', 'steel can'] },
    { id: 'plastic-container', name: 'Plastic container (yogurt tub)', category: 'food-packaging', bin: 'blue', how: 'Empty and rinse it. Take the lid off.', aliases: ['plastic tub', 'yogurt tub', 'plastic container', 'takeout container'] },
    { id: 'milk-carton', name: 'Milk carton', category: 'food-packaging', bin: 'blue', how: 'Empty and rinse it, then flatten it.', aliases: ['carton', 'juice carton', 'juice box'] },
    { id: 'glass-jar', name: 'Rinsed glass jar', category: 'food-packaging', bin: 'blue', how: 'Rinse it and take the lid off.', aliases: ['jar', 'glass bottle', 'glass'] },
    { id: 'food-soiled-bag', name: 'Food-soiled Ziploc bag', category: 'food-packaging', bin: 'black', how: "Food-soiled plastic can't be recycled. Put it in the garbage. No need to rinse it.", aliases: ['ziploc', 'plastic bag', 'zip bag', 'sandwich bag'] },
    { id: 'aluminum-foil', name: 'Aluminum foil (clean)', category: 'food-packaging', bin: 'blue', how: 'Only clean foil. Scrape off food first.', aliases: ['foil', 'tin foil'] },
    { id: 'aerosol-can', name: 'Aerosol can (empty)', category: 'food-packaging', bin: 'blue', how: 'It must be completely empty.', aliases: ['spray can', 'aerosol'] },
    {
      id: 'cup', name: 'Cup', category: 'food-packaging', aliases: ['cold drink cup', 'beverage cup', 'coffee cup', 'paper cup', 'plastic cup', 'foam cup', 'styrofoam'],
      how: 'The bin depends on what the cup is made of.',
      options: [
        { label: 'Paper cup (coffee cup)', note: 'Empty it. Put the lid in with it.', bin: 'blue' },
        { label: 'Plastic cup', note: 'Empty and rinse it.', bin: 'blue' },
        { label: 'Foam cup (Styrofoam)', note: "Foam can't be recycled.", bin: 'black' },
      ],
    },
    // ---- Paper and cardboard ----
    {
      id: 'pizza-box', name: 'Pizza box', category: 'paper', aliases: ['pizza', 'greasy box'],
      how: 'It depends on the box.',
      options: [
        { label: 'Greasy or has food on it', note: 'Compost it. Grease spoils recycling.', bin: 'green' },
        { label: 'Clean and dry', note: 'Recycle it. Flatten it first.', bin: 'blue' },
      ],
    },
    { id: 'cardboard-box', name: 'Cardboard box', category: 'paper', bin: 'blue', how: 'Flatten it and remove any packing tape.', aliases: ['cardboard', 'box', 'shipping box'] },
    { id: 'bakery-box', name: 'Bakery box', category: 'paper', bin: 'blue', how: 'Flatten it. Remove food and any plastic window.', aliases: ['cake box', 'donut box'] },
    { id: 'egg-carton', name: 'Cardboard egg carton', category: 'paper', bin: 'blue', how: 'Flatten it.', aliases: ['egg box', 'cardboard'] },
    { id: 'newspaper', name: 'Newspaper', category: 'paper', bin: 'blue', how: 'Keep it dry and loose.', aliases: ['paper', 'magazine', 'flyer'] },
    { id: 'paper-towel', name: 'Paper towel (used)', category: 'paper', bin: 'green', how: 'Used paper towels go in the compost.', aliases: ['paper towels', 'napkin', 'tissue', 'kitchen paper'] },
    // ---- Food scraps ----
    { id: 'food-scraps', name: 'Food scraps', category: 'food-scraps', bin: 'green', how: 'Put food scraps in the compost bin. Drain liquids first.', aliases: ['leftovers', 'food waste', 'compost'] },
    { id: 'banana-peel', name: 'Banana peel', category: 'food-scraps', bin: 'green', how: 'Compost it.', aliases: ['peel', 'fruit peel'] },
    { id: 'apple-core', name: 'Apple core', category: 'food-scraps', bin: 'green', how: 'Compost it.', aliases: ['core', 'fruit'] },
    { id: 'coffee-grounds', name: 'Coffee grounds', category: 'food-scraps', bin: 'green', how: 'Compost them, with the paper filter.', aliases: ['coffee', 'tea bag'] },
    // ---- Household ----
    { id: 'broken-mug', name: 'Broken mug', category: 'household', bin: 'black', how: 'Wrap sharp pieces in paper before you put them in the garbage.', aliases: ['mug', 'broken glass', 'ceramic', 'plate'] },
    { id: 'diaper', name: 'Diaper', category: 'household', bin: 'black', how: 'Wrap it and put it in the garbage.', aliases: ['nappy'] },
    // ---- Hazardous ----
    { id: 'battery', name: 'Battery (household)', category: 'hazardous', bin: 'dropoff', how: 'Keep batteries separate and take them to a drop-off location.', aliases: ['batteries', 'aa battery', 'button battery'], warning: 'Batteries can start a fire in a cart or a truck. Do not put them in any cart.' },
    { id: 'car-battery', name: 'Car battery', category: 'hazardous', bin: 'dropoff', how: 'Take it to a hazardous waste drop-off or the place that sold it.', aliases: ['vehicle battery', 'auto battery'], warning: 'Car batteries contain acid and heavy metals. Do not put them in any cart.' },
    { id: 'paint-can', name: 'Paint can (leftover paint)', category: 'hazardous', bin: 'dropoff', how: 'Close the lid tightly and take it to a hazardous waste drop-off.', aliases: ['paint', 'leftover paint'], warning: 'Hazardous, not for any cart. Paint can catch fire or leak in the truck. Take it to a hazardous waste drop-off.' },
    { id: 'used-oil', name: 'Used oil', category: 'hazardous', bin: 'dropoff', how: 'Transport it in a sealed container and take it to a drop-off.', aliases: ['motor oil', 'engine oil', 'oil'], warning: 'Oil can leak and pollute. Do not pour it down a drain or put it in any cart.' },
    // ---- Electronics ----
    { id: 'old-phone', name: 'Old phone', category: 'electronics', bin: 'dropoff', how: 'Take it to an electronics drop-off. Delete your data first.', aliases: ['mobile', 'cell phone', 'smartphone', 'charger'] },
  ];

  var BINS = {
    blue: { label: 'BLUE BIN', name: 'Recycling' },
    green: { label: 'GREEN BIN', name: 'Compost' },
    black: { label: 'BLACK BIN', name: 'Garbage' },
    dropoff: { label: 'DROP-OFF ONLY', name: 'Special drop-off' },
  };

  var data = { CATEGORIES: CATEGORIES, ITEMS: ITEMS, BINS: BINS };
  root.WGW_DATA = data;
  if (typeof module !== 'undefined' && module.exports) module.exports = data;
})(typeof window !== 'undefined' ? window : globalThis);
