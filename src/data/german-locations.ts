// German states, cities, districts and neighborhoods data
export const germanStates = [
  "Baden-Württemberg", "Bayern", "Berlin", "Brandenburg", "Bremen", "Hamburg", 
  "Hessen", "Mecklenburg-Vorpommern", "Niedersachsen", "Nordrhein-Westfalen", 
  "Rheinland-Pfalz", "Saarland", "Sachsen", "Sachsen-Anhalt", "Schleswig-Holstein", "Thüringen"
];

export const germanCities: { [state: string]: string[] } = {
  "Baden-Württemberg": [
    "Stuttgart", "Mannheim", "Karlsruhe", "Freiburg im Breisgau", "Heidelberg", "Ulm", "Heilbronn", 
    "Pforzheim", "Reutlingen", "Esslingen am Neckar", "Ludwigsburg", "Tübingen", "Villingen-Schwenningen", 
    "Konstanz", "Sindelfingen", "Aalen", "Göppingen", "Schwäbisch Gmünd", "Ravensburg", "Friedrichshafen"
  ],
  "Bayern": [
    "München", "Nürnberg", "Augsburg", "Würzburg", "Regensburg", "Ingolstadt", "Fürth", "Erlangen", 
    "Bayreuth", "Bamberg", "Aschaffenburg", "Landshut", "Kempten", "Rosenheim", "Neu-Ulm", "Schweinfurt", 
    "Passau", "Freising", "Straubing", "Dachau", "Coburg", "Hof", "Ansbach", "Schwabach"
  ],
  "Berlin": ["Berlin"],
  "Brandenburg": [
    "Potsdam", "Cottbus", "Brandenburg an der Havel", "Frankfurt (Oder)", "Oranienburg", "Falkensee", 
    "Königs Wusterhausen", "Eberswalde", "Eisenhüttenstadt", "Luckenwalde", "Guben", "Rathenow", 
    "Fürstenwalde", "Strausberg", "Neuruppin", "Schwedt"
  ],
  "Bremen": ["Bremen", "Bremerhaven"],
  "Hamburg": ["Hamburg"],
  "Hessen": [
    "Frankfurt am Main", "Wiesbaden", "Kassel", "Darmstadt", "Offenbach am Main", "Hanau", "Gießen", 
    "Marburg", "Fulda", "Rüsselsheim", "Wetzlar", "Bad Homburg", "Oberursel", "Rodgau", "Dreieich", 
    "Bensheim", "Mainz", "Viernheim", "Lampertheim", "Langen"
  ],
  "Mecklenburg-Vorpommern": [
    "Rostock", "Schwerin", "Neubrandenburg", "Stralsund", "Greifswald", "Wismar", "Güstrow", 
    "Waren", "Parchim", "Ribnitz-Damgarten", "Bergen auf Rügen", "Anklam", "Wolgast", "Pasewalk"
  ],
  "Niedersachsen": [
    "Hannover", "Braunschweig", "Oldenburg", "Osnabrück", "Wolfsburg", "Göttingen", "Salzgitter", 
    "Hildesheim", "Delmenhorst", "Wilhelmshaven", "Lüneburg", "Celle", "Garbsen", "Hameln", 
    "Lingen", "Langenhagen", "Nordhorn", "Wolfenbüttel", "Goslar", "Peine", "Emden", "Cuxhaven"
  ],
  "Nordrhein-Westfalen": [
    "Köln", "Düsseldorf", "Dortmund", "Essen", "Duisburg", "Bochum", "Wuppertal", "Bielefeld", 
    "Bonn", "Münster", "Mönchengladbach", "Gelsenkirchen", "Aachen", "Krefeld", "Oberhausen", 
    "Hagen", "Hamm", "Mülheim an der Ruhr", "Leverkusen", "Solingen", "Herne", "Neuss", "Paderborn", 
    "Recklinghausen", "Bottrop", "Remscheid", "Moers", "Siegen", "Bergisch Gladbach", "Erlangen", 
    "Troisdorf", "Viersen", "Lüdenscheid", "Castrop-Rauxel", "Iserlohn", "Gütersloh", "Marl", 
    "Lünen", "Ratingen", "Velbert", "Minden", "Nettetal", "Rheine", "Witten", "Langenfeld"
  ],
  "Rheinland-Pfalz": [
    "Mainz", "Ludwigshafen", "Koblenz", "Trier", "Kaiserslautern", "Worms", "Neuwied", "Neustadt", 
    "Speyer", "Frankenthal", "Bad Kreuznach", "Idar-Oberstein", "Zweibrücken", "Pirmasens", 
    "Bad Neuenahr-Ahrweiler", "Andernach", "Ingelheim"
  ],
  "Saarland": [
    "Saarbrücken", "Neunkirchen", "Homburg", "Völklingen", "St. Ingbert", "Merzig", "St. Wendel", 
    "Blieskastel", "Saarlouis", "Dillingen"
  ],
  "Sachsen": [
    "Leipzig", "Dresden", "Chemnitz", "Zwickau", "Plauen", "Görlitz", "Freiberg", "Bautzen", 
    "Freital", "Pirna", "Radebeul", "Riesa", "Delitzsch", "Meißen", "Limbach-Oberfrohna", 
    "Glauchau", "Weißwasser", "Coswig", "Döbeln", "Hoyerswerda"
  ],
  "Sachsen-Anhalt": [
    "Halle", "Magdeburg", "Dessau-Roßlau", "Wittenberg", "Stendal", "Weißenfels", "Merseburg", 
    "Bernburg", "Naumburg", "Zeitz", "Halberstadt", "Quedlinburg", "Sangerhausen", "Aschersleben", 
    "Köthen", "Wernigerode"
  ],
  "Schleswig-Holstein": [
    "Kiel", "Lübeck", "Flensburg", "Neumünster", "Norderstedt", "Elmshorn", "Pinneberg", "Wedel", 
    "Ahrensburg", "Geesthacht", "Henstedt-Ulzburg", "Reinbek", "Bad Oldesloe", "Schleswig", 
    "Rendsburg", "Husum", "Itzehoe", "Heide", "Kaltenkirchen", "Bad Segeberg"
  ],
  "Thüringen": [
    "Erfurt", "Jena", "Gera", "Weimar", "Gotha", "Nordhausen", "Eisenach", "Suhl", "Altenburg", 
    "Mühlhausen", "Saalfeld", "Arnstadt", "Rudolstadt", "Ilmenau", "Apolda", "Sonneberg", 
    "Bad Langensalza", "Greiz", "Meiningen", "Sömmerda"
  ]
};

export const germanDistricts: { [city: string]: string[] } = {
  "Berlin": [
    "Mitte", "Friedrichshain-Kreuzberg", "Pankow", "Charlottenburg-Wilmersdorf", "Spandau", 
    "Steglitz-Zehlendorf", "Tempelhof-Schöneberg", "Neukölln", "Treptow-Köpenick", "Marzahn-Hellersdorf", 
    "Lichtenberg", "Reinickendorf"
  ],
  "Hamburg": [
    "Altona", "Bergedorf", "Eimsbüttel", "Harburg", "Hamburg-Mitte", "Hamburg-Nord", "Wandsbek"
  ],
  "München": [
    "Altstadt-Lehel", "Ludwigsvorstadt-Isarvorstadt", "Maxvorstadt", "Schwabing-West", "Au-Haidhausen", 
    "Sendling", "Sendling-Westpark", "Schwanthalerhöhe", "Neuhausen-Nymphenburg", "Moosach", 
    "Milbertshofen-Am Hart", "Schwabing-Freimann", "Bogenhausen", "Berg am Laim", "Trudering-Riem", 
    "Ramersdorf-Perlach", "Obergiesing-Fasangarten", "Untergiesing-Harlaching", "Thalkirchen-Obersendling-Forstenried-Fürstenried-Solln", 
    "Hadern", "Pasing-Obermenzing", "Aubing-Lochhausen-Langwied", "Allach-Untermenzing", "Feldmoching-Hasenbergl", "Laim"
  ],
  "Köln": [
    "Innenstadt", "Rodenkirchen", "Lindenthal", "Ehrenfeld", "Nippes", "Chorweiler", "Porz", "Kalk", "Mülheim"
  ],
  "Frankfurt am Main": [
    "Altstadt", "Innenstadt", "Bahnhofsviertel", "Westend-Süd", "Westend-Nord", "Nordend-West", 
    "Nordend-Ost", "Ostend", "Bornheim", "Gutleutviertel", "Gallus", "Bockenheim", "Sachsenhausen-Nord", 
    "Sachsenhausen-Süd", "Oberrad", "Niederrad", "Schwanheim", "Griesheim", "Rödelheim", "Hausen", 
    "Praunheim", "Heddernheim", "Niederursel", "Ginnheim", "Dornbusch", "Eschersheim", "Eckenheim", 
    "Preungesheim", "Bonames", "Berkersheim", "Frankfurter Berg", "Nieder-Erlenbach", "Kalbach-Riedberg", 
    "Harheim", "Nieder-Eschbach", "Bergen-Enkheim", "Seckbach", "Riederwald", "Fechenheim", "Höchst", 
    "Nied", "Sindlingen", "Zeilsheim", "Unterliederbach", "Sossenheim"
  ],
  "Stuttgart": [
    "Stuttgart-Mitte", "Stuttgart-Nord", "Stuttgart-Ost", "Stuttgart-Süd", "Stuttgart-West", 
    "Bad Cannstatt", "Birkach", "Botnang", "Degerloch", "Feuerbach", "Hedelfingen", "Möhringen", 
    "Mühlhausen", "Münster", "Obertürkheim", "Plieningen", "Sillenbuch", "Stammheim", "Untertürkheim", 
    "Vaihingen", "Wangen", "Weilimdorf", "Zuffenhausen"
  ],
  "Düsseldorf": [
    "Stadtmitte", "Carlstadt", "Derendorf", "Golzheim", "Pempelfort", "Stockum", "Lohausen", 
    "Kaiserswerth", "Wittlaer", "Angermund", "Kalkum", "Hubbelrath", "Grafenberg", "Ludenberg", 
    "Gerresheim", "Unterbach", "Vennhausen", "Düsseltal", "Flingern-Nord", "Flingern-Süd", 
    "Oberbilk", "Unterbilk", "Volmerswerth", "Bilk", "Hamm", "Flehe", "Himmelgeist", "Itter", 
    "Holthausen", "Reisholz", "Benrath", "Urdenbach", "Hassels", "Garath", "Hellerhof", "Eller", 
    "Lierenfeld", "Unterrath", "Rath", "Mörsenbroich", "Lichtenbroich"
  ],
  "Dortmund": [
    "Innenstadt-West", "Innenstadt-Nord", "Innenstadt-Ost", "Eving", "Scharnhorst", "Brackel", 
    "Aplerbeck", "Hörde", "Hombruch", "Lütgendortmund", "Huckarde", "Mengede"
  ],
  "Essen": [
    "Stadtmitte", "Frohnhausen", "Altendorf", "Haarzopf", "Margarethenhöhe", "Fischlaken", 
    "Rüttenscheid", "Bergerhausen", "Rellinghausen", "Stadtwald", "Bredeney", "Schuir", "Kettwig", 
    "Werden", "Heidhausen", "Kupferdreh", "Byfang", "Steele", "Kray", "Leithe", "Freisenbruch", 
    "Horst", "Katernberg", "Stoppenberg", "Schönebeck", "Bedingrade", "Frintrop", "Dellwig", 
    "Gerschede", "Borbeck-Mitte", "Bochold", "Bergeborbeck", "Vogelheim", "Altenessen-Nord", 
    "Altenessen-Süd", "Nordviertel", "Westviertel", "Ostviertel", "Südostviertel", "Südviertel", 
    "Holsterhausen", "Rüttenscheid", "Huttrop"
  ]
};

export const germanNeighborhoods: { [district: string]: string[] } = {
  // Berlin neighborhoods
  "Mitte": [
    "Alexanderplatz", "Friedrichstadt", "Spandauer Vorstadt", "Stralauer Vorstadt", "Königsstadt", 
    "Luisenstadt", "Tiergarten", "Moabit", "Wedding", "Gesundbrunnen"
  ],
  "Charlottenburg-Wilmersdorf": [
    "Charlottenburg", "Wilmersdorf", "Schmargendorf", "Grunewald", "Westend", "Charlottenburg-Nord", 
    "Halensee", "Lietzow"
  ],
  "Pankow": [
    "Prenzlauer Berg", "Weißensee", "Pankow", "Blankenburg", "Heinersdorf", "Karow", "Malchow", 
    "Stadtrandsiedlung", "Wilhelmsruh", "Rosenthal", "Blankenfelde", "Französisch Buchholz", 
    "Niederschönhausen", "Buch"
  ],
  
  // Hamburg neighborhoods
  "Hamburg-Mitte": [
    "Altstadt", "Neustadt", "St. Pauli", "St. Georg", "Klostertor", "Borgfelde", "Hamm", 
    "Horn", "Billstedt", "Billbrook", "Rothenburgsort", "Veddel", "Wilhelmsburg", "Kleiner Grasbrook", 
    "Steinwerder", "Waltershof", "Finkenwerder"
  ],
  "Altona": [
    "Altona-Altstadt", "Altona-Nord", "Ottensen", "Bahrenfeld", "Groß Flottbek", "Othmarschen", 
    "Lurup", "Osdorf", "Nienstedten", "Blankenese", "Iserbrook", "Sülldorf", "Rissen"
  ],
  
  // Munich neighborhoods
  "Altstadt-Lehel": [
    "Altstadt", "Lehel", "Graggenau", "Angerviertel", "Hackenviertel", "Kreuzviertel", 
    "Gärtnerplatzviertel", "Glockenbachviertel"
  ],
  "Maxvorstadt": [
    "Maxvorstadt", "Josephsplatz", "Karolinenviertel", "Königsplatz", "Pinakotheken", 
    "Universitätsviertel", "Marsfeld"
  ],
  "Schwabing-West": [
    "Schwabing", "Neuhausen", "Neuhausen-Nymphenburg", "Maxvorstadt-West"
  ],
  
  // Cologne neighborhoods
  "Innenstadt": [
    "Altstadt-Nord", "Altstadt-Süd", "Neustadt-Nord", "Neustadt-Süd", "Deutz", "Severinsviertel", 
    "Heumarkt", "Martinsviertel", "Kunibertviertel"
  ],
  "Lindenthal": [
    "Lindenthal", "Braunsfeld", "Müngersdorf", "Junkersdorf", "Weiden", "Lövenich", "Widdersdorf", 
    "Bachemer Straße", "Klettenberg", "Sülz", "Zollstock"
  ],
  
  // Frankfurt neighborhoods
  "Frankfurt-Innenstadt": [
    "Altstadt", "Bahnhofsviertel", "Gallus", "Gutleutviertel"
  ],
  "Nordend-West": [
    "Nordend", "Dornbusch", "Eschersheim", "Ginnheim"
  ],
  "Sachsenhausen-Nord": [
    "Alt-Sachsenhausen", "Sachsenhausen", "Deutschherrnviertel"
  ]
};

// Function to get cities by state
export const getCitiesByState = (state: string): string[] => {
  return germanCities[state] || [];
};

// Function to get districts by city
export const getDistrictsByCity = (city: string): string[] => {
  return germanDistricts[city] || [];
};

// Function to get neighborhoods by district
export const getNeighborhoodsByDistrict = (district: string): string[] => {
  return germanNeighborhoods[district] || [];
};