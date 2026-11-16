/*
 * Made-up data for the demo screens (map, building guide, languages).
 * EVERYTHING HERE IS PLACEHOLDER: real sites, addresses and buildings would come from the City.
 */
(function (root) {
  // Map pop-up. x / y are the pin's top-left corner on the 310 x 260 Figma map.
  var FILTERS = [
    { type: 'hazard', label: 'Hazard' },
    { type: 'electronic', label: 'Electronic' },
    { type: 'depot', label: 'Bottle Depot' },
    { type: 'landfill', label: 'Landfill' },
  ];

  var SITES = [
    { id: 'hhw-1', type: 'hazard', x: 65.5, y: 45.5, name: 'Household hazardous waste drop-off', accepts: 'Paint, batteries, motor oil, propane tanks, cleaners', hours: 'Mon–Sun, 8 am – 4 pm', fees: 'Free for households', distance: '2.4 km · Fire Station (example)' },
    { id: 'hhw-2', type: 'hazard', x: 109, y: 209, name: 'Household hazardous waste drop-off', accepts: 'Paint, batteries, motor oil, cleaners', hours: 'Mon–Sat, 9 am – 5 pm', fees: 'Free for households', distance: '5.1 km · Fire Station (example)' },
    { id: 'elec-1', type: 'electronic', x: 139, y: 89, name: 'Electronics drop-off', accepts: 'Phones, computers, TVs, small appliances', hours: 'Mon–Fri, 9 am – 6 pm', fees: 'Free', distance: '3.0 km (example)' },
    { id: 'elec-2', type: 'electronic', x: 259, y: 199, name: 'Electronics drop-off', accepts: 'Phones, computers, cables, batteries', hours: 'Sat–Sun, 10 am – 4 pm', fees: 'Free', distance: '6.2 km (example)' },
    { id: 'depot-1', type: 'depot', x: 249, y: 59, name: 'Bottle depot', accepts: 'Cans, glass and plastic drink bottles, cartons (deposit refund)', hours: 'Mon–Sun, 9 am – 6 pm', fees: 'You get the deposit back', distance: '4.2 km (example)' },
    { id: 'depot-2', type: 'depot', x: 179, y: 169, name: 'Bottle depot', accepts: 'Cans, glass and plastic drink bottles', hours: 'Mon–Sat, 9 am – 5 pm', fees: 'You get the deposit back', distance: '3.7 km (example)' },
    { id: 'landfill-1', type: 'landfill', x: 39, y: 149, name: 'Landfill', accepts: 'Large items, construction waste, yard waste', hours: 'Mon–Sun, 7:30 am – 5 pm', fees: 'Fee by weight', distance: '9.8 km (example)' },
  ];

  // Building guide. Only the first address has details; the others show "details unavailable".
  var ADDRESSES = [
    {
      id: '123-example-st-nw', label: '123 Example St NW, Calgary', short: '123 Example St NW', known: true,
      kind: 'Apartment building, shared bins',
      where: 'Communal bins in the parkade, level P1. Compost bin: yes.',
      items: [
        { id: 'diaper', note: 'Double-bag it and tie it closed.', building: 'Use the communal garbage bin in the parkade.' },
        { id: 'food-scraps', note: 'Compost bin, if your building has one.', building: 'Compost bin: yes, next to the garbage room. If there is none, ask your property manager.' },
        { id: 'glass-jar', note: 'Empty and clean it. Labels can stay on.', building: 'Use the blue recycling bin in the parkade.' },
      ],
    },
    { id: '123-example-st-sw', label: '123 Example St SW, Calgary', short: '123 Example St SW', known: false },
    { id: '123-example-ave-nw', label: '123 Example Ave NW, Calgary', short: '123 Example Ave NW', known: false },
  ];

  var LANGUAGES = [
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ' },
    { code: 'zh', name: '简体中文' },
    { code: 'ko', name: '한국어' },
  ];

  var demo = { FILTERS: FILTERS, SITES: SITES, ADDRESSES: ADDRESSES, LANGUAGES: LANGUAGES };
  root.WGW_DEMO = demo;
  if (typeof module !== 'undefined' && module.exports) module.exports = demo;
})(typeof window !== 'undefined' ? window : globalThis);
