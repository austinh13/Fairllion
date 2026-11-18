// Answer cards: places.
// Each card has five tiers, from what everybody says to what hardly anyone
// would. Answers are comma-separated; "A|B" gives alternative spellings.

export default [
  {
    id: 'us-states',
    q: 'Name a US state',
    tiers: [
      'California, Texas, New York, Florida',
      'Hawaii, Alaska, Washington, Nevada, Colorado, Arizona, Georgia, Ohio, Illinois, Michigan, New Jersey, Virginia',
      'Oregon, Utah, Pennsylvania, Massachusetts, Tennessee, Louisiana, Kentucky, North Carolina, Montana, Minnesota, Wisconsin, Maine, Kansas, Oklahoma',
      'Indiana, Missouri, Alabama, Mississippi, Maryland, Connecticut, South Carolina, New Mexico, Iowa, Idaho, Vermont, Arkansas',
      'Wyoming, Nebraska, North Dakota, South Dakota, West Virginia, New Hampshire, Rhode Island, Delaware',
    ],
  },
  {
    id: 'africa',
    q: 'Name a country in Africa',
    tiers: [
      'Egypt, South Africa, Nigeria, Kenya, Morocco',
      'Ethiopia, Ghana, Algeria, Tanzania, Uganda, Madagascar, Libya, Zimbabwe, Sudan, Somalia, Tunisia',
      "Senegal, Rwanda, Cameroon, Angola, Mali, Zambia, Mozambique, Congo|Republic of the Congo|Congo-Brazzaville, Democratic Republic of the Congo|DR Congo|DRC|Congo-Kinshasa, Ivory Coast|Côte d'Ivoire, Botswana, Namibia, Niger, Chad",
      'Liberia, Sierra Leone, Malawi, South Sudan, Gabon, Togo, Benin, Burkina Faso, Mauritius, Seychelles, Gambia, Guinea, Eritrea, Mauritania, Burundi',
      'Lesotho, Eswatini|Swaziland, Djibouti, Comoros, Cape Verde|Cabo Verde, Guinea-Bissau, Equatorial Guinea, Central African Republic|CAR, São Tomé and Príncipe|Sao Tome',
    ],
  },
  {
    id: 'europe',
    q: 'Name a country in Europe',
    tiers: [
      'France, Germany, Italy, Spain, United Kingdom|UK|Great Britain|Britain',
      'Portugal, Greece, Ireland, Netherlands|Holland, Sweden, Switzerland, Poland, Belgium, Norway, Austria, Russia, Denmark',
      'Finland, Ukraine, Iceland, Croatia, Hungary, Czech Republic|Czechia, Turkey|Türkiye, Romania, Bulgaria, Serbia, Luxembourg, Monaco, Vatican City|Vatican|Holy See',
      'Slovakia, Slovenia, Estonia, Latvia, Lithuania, Malta, Cyprus, Albania, Belarus, Bosnia and Herzegovina|Bosnia, Liechtenstein',
      'Montenegro, North Macedonia|Macedonia, Moldova, Kosovo, Andorra, San Marino, Georgia, Armenia, Azerbaijan, Kazakhstan',
    ],
  },
  {
    id: 'asia',
    q: 'Name a country in Asia',
    tiers: [
      'China, Japan, India, South Korea|Korea|Republic of Korea, Thailand',
      'Vietnam, Indonesia, Philippines, Singapore, Pakistan, North Korea',
      'Russia, Malaysia, Iran, Iraq, Saudi Arabia, Israel, Afghanistan, Turkey|Türkiye, Nepal, Mongolia',
      'Sri Lanka, Bangladesh, Cambodia, Taiwan, United Arab Emirates|UAE|Emirates, Syria, Qatar, Kazakhstan, Myanmar|Burma, Laos, Jordan, Lebanon, Kuwait',
      'Yemen, Oman, Bhutan, Maldives, Uzbekistan, Bahrain, Georgia, Armenia, Azerbaijan, Palestine, Cyprus, Brunei, Kyrgyzstan, Tajikistan, Turkmenistan, Timor-Leste|East Timor',
    ],
  },
  {
    id: 'americas',
    q: 'Name a country in the Americas',
    tiers: [
      'United States|USA|US|United States of America|America, Canada, Mexico, Brazil',
      'Argentina, Colombia, Peru, Chile, Cuba, Jamaica, Venezuela',
      'Costa Rica, Panama, Ecuador, Bolivia, Uruguay, Paraguay, Haiti, Dominican Republic, Bahamas, Guatemala',
      'Honduras, Nicaragua, El Salvador, Belize, Barbados, Trinidad and Tobago|Trinidad, Guyana, Suriname',
      'Grenada, Saint Lucia|St Lucia, Dominica, Antigua and Barbuda|Antigua, Saint Kitts and Nevis|St Kitts and Nevis|St Kitts|Saint Kitts, Saint Vincent and the Grenadines|St Vincent and the Grenadines|St Vincent|Saint Vincent',
    ],
  },
  {
    id: 'rivers',
    q: 'Name a river',
    strip: ['river'],
    tiers: [
      'Nile, Amazon, Mississippi, Thames',
      'Danube, Ganges|Ganga, Seine, Rhine, Yangtze|Yangtse|Chang Jiang, Colorado, Hudson, Missouri, Congo, Mekong, Jordan, Volga',
      'Euphrates, Tigris, Yellow River|Huang He, Indus, Niger, Zambezi, Rio Grande, Ohio, Columbia, Yukon, Potomac, Tiber, Loire, Rhône|Rhone, Elbe, Po, Severn, Murray, Orinoco, Brahmaputra, Dnieper|Dnipro, Don, St. Lawrence|Saint Lawrence, Mackenzie',
      'Tagus|Tejo|Tajo, Ebro, Douro|Duero, Oder, Vistula, Garonne, Shannon, Clyde, Tyne, Mersey, Trent, Avon, Liffey, Spree, Arno, Ural, Ob, Lena, Yenisei|Yenisey, Amur, Irrawaddy|Ayeyarwady, Limpopo, Orange, Darling, Paraná|Parana, Tennessee, Arkansas, Snake, Platte, Red River, Delaware, Susquehanna, Fraser, Senegal',
      'Salween, Chao Phraya, Irtysh, Kolyma, Pechora, Kama, Neva, Vltava|Moldau, Drava, Sava, Tisza, Moselle|Mosel, Meuse|Maas, Scheldt, Weser, Neckar, Aare, Adige, Guadalquivir, Dordogne, Marne, Saône|Saone, Wye, Tay, Spey, Tweed, Ouse, Tees, Boyne, Okavango, Kasai, Ubangi, Godavari, Krishna, Kaveri|Cauvery, Narmada, Yamuna|Jumna, Sutlej, Helmand, Amu Darya|Oxus, Syr Darya, Tarim, Pearl River|Zhujiang, Sepik, Waikato, Murrumbidgee, Magdalena, Madeira, Xingu, Tocantins, Essequibo, Saskatchewan, Athabasca, Ottawa, Brazos, Pecos, Gila, Sacramento, Willamette, Cumberland, Wabash, Allegheny, Monongahela, Connecticut, Savannah, Chattahoochee, Suwannee, Rubicon, Dniester',
    ],
  },
  {
    id: 'deserts',
    q: 'Name a desert',
    strip: ['desert'],
    tiers: [
      'Sahara, Gobi, Mojave|Mohave',
      'Kalahari, Arabian, Atacama, Sonoran|Sonora, Namib',
      'Antarctica|Antarctic, Thar|Great Indian, Great Victoria, Negev, Patagonian|Patagonia, Chihuahuan|Chihuahua, Sinai, Arctic, Syrian, Painted Desert, Great Basin, Simpson, Nubian, Libyan',
      "Taklamakan|Taklimakan, Karakum|Kara Kum, Kyzylkum|Kyzyl Kum, Great Sandy, Gibson, Tanami, Rub' al Khali|Empty Quarter, Judean|Judaean, Danakil, Black Rock, Colorado Desert, Sechura, Karoo, Tabernas, Nefud|An Nafud|Nafud, Dasht-e Kavir|Kavir, Dasht-e Lut|Lut",
      'Ordos, Tengger, Badain Jaran, Kumtag, Cholistan, Kharan, Thal, Ténéré|Tenere, Bayuda, Chalbi, Strzelecki, Sturt Stony|Sturt, Little Sandy, Tirari, Pedirka, Monte, Guajira|La Guajira, Carcross, Aralkum, Betpak-Dala, Ryn, Dahna|Ad-Dahna, Accona',
    ],
  },
  {
    id: 'seas',
    q: 'Name a sea',
    strip: ['sea', 'of', 'the'],
    tiers: [
      'Mediterranean, Red Sea, Dead Sea, Caribbean, Black Sea',
      'North Sea, Baltic, Caspian, Arabian, South China Sea, Aegean, Adriatic, Bering, Irish Sea',
      'Sea of Japan|East Sea, Coral Sea, Tasman, Yellow Sea, East China Sea, Norwegian, Ionian, Tyrrhenian, Sea of Galilee, Aral, Sargasso, Barents, Andaman, Philippine, Sea of Marmara, Celtic, Labrador, Sea of Okhotsk',
      'Ligurian, Balearic, Sea of Azov, Kara, Laptev, East Siberian, Chukchi, Beaufort, Greenland, Weddell, Ross, Timor, Arafura, Java, Banda, Celebes|Sulawesi, Sulu, Sea of Crete|Cretan, Salton Sea, White Sea, Wadden, Alboran, Scotia, Bismarck, Solomon, Sea of Cortez|Cortes',
      "Amundsen, Bellingshausen, Davis, Lincoln, Wandel, Pechora, Lazarev, Riiser-Larsen, Cosmonauts, Cooperation, Mawson, D'Urville|Dumont d'Urville, Somov, Flores, Molucca|Maluku, Ceram|Seram, Halmahera, Savu|Sawu, Bali, Bohol, Sibuyan, Visayan, Camotes, Samar, Koro, Thracian, Myrtoan, Libyan, Levantine, Sea of the Hebrides, Irminger, Seto Inland Sea, Bohai, Natuna, Archipelago Sea, Bothnian",
    ],
  },
  {
    id: 'currencies',
    q: 'Name a currency, past or present',
    tiers: [
      'Dollar|US dollar|American dollar|USD, Euro|EUR, Pound|Pound sterling|British pound|Sterling|GBP, Yen|Japanese yen|JPY',
      'Peso|Mexican peso, Rupee|Indian rupee, Franc|Swiss franc, Yuan|Renminbi|RMB|Chinese yuan, Ruble|Rouble|Russian ruble, Bitcoin, Won|Korean won, Krona|Swedish krona, Dinar, Rand|South African rand, Real|Brazilian real, Lira|Turkish lira, Shekel|New shekel|Israeli shekel, Baht|Thai baht, Krone|Danish krone|Norwegian krone, Dirham',
      'Riyal|Saudi riyal, Rial|Iranian rial, Zloty|Złoty, Forint, Ringgit, Rupiah, Dong|Vietnamese dong, Shilling, Koruna|Czech koruna, Drachma, Deutschmark|Deutsche Mark|Mark, Peseta, Guilder|Gulden',
      'Leu, Lev, Hryvnia, Naira, Taka, Kwacha, Cedi, Birr, Tenge, Manat, Escudo, Florin, Ducat, Guinea, Crown, Dram, Lari, Kyat, Kip, Riel, Colón|Colon, Quetzal, Bolívar|Bolivar, Sol|Nuevo sol, Boliviano, Markka, Schilling, Punt|Irish pound, Kuna, Doubloon, Farthing, Denarius, Thaler',
      "Som, Somoni, Afghani, Tugrik|Tögrög|Togrog, Pataca, Lempira, Córdoba|Cordoba, Balboa, Guaraní|Guarani, Gourde, Denar, Lek, Dalasi, Leone, Loti, Lilangeni, Pula, Metical, Kwanza, Ariary, Ouguiya, Nakfa, Pa'anga, Tala, Vatu, Kina, Ngultrum, Rufiyaa, Lats, Litas, Kroon, Tolar, Sestertius|Sesterce, Groat, Kreuzer, Livre",
    ],
  },
  {
    id: 'languages',
    q: 'Name a language',
    strip: ['language'],
    tiers: [
      'English, Spanish, French, Chinese|Mandarin|Mandarin Chinese|Putonghua, German',
      'Italian, Japanese, Russian, Portuguese, Arabic, Hindi, Korean, Latin, Greek, Dutch',
      'Polish, Swedish, Turkish, Hebrew, Irish|Gaelic|Irish Gaelic|Gaeilge, Welsh, Vietnamese, Thai, Norwegian, Danish, Finnish, Swahili|Kiswahili, Ukrainian, Bengali|Bangla, Urdu, Persian|Farsi, Cantonese, Punjabi|Panjabi, Tagalog|Filipino, Indonesian|Bahasa Indonesia, Czech, Hungarian|Magyar, Romanian, Sign language|American Sign Language|ASL|British Sign Language|BSL, Esperanto',
      'Tamil, Telugu, Marathi, Gujarati, Malay|Bahasa Melayu|Malaysian, Nepali, Sinhala|Sinhalese, Burmese, Khmer|Cambodian, Lao|Laotian, Mongolian, Tibetan, Kazakh, Uzbek, Pashto|Pushto, Kurdish, Armenian, Georgian, Azerbaijani|Azeri, Bulgarian, Serbian, Croatian, Bosnian, Slovak, Slovenian|Slovene, Lithuanian, Latvian, Estonian, Icelandic, Albanian, Macedonian, Belarusian, Catalan, Basque|Euskara, Galician, Scottish Gaelic|Scots Gaelic, Breton, Maltese, Luxembourgish, Afrikaans, Zulu|isiZulu, Xhosa|isiXhosa, Yoruba, Igbo, Hausa, Amharic, Somali, Yiddish, Sanskrit, Hawaiian, Maori|Te Reo|Te Reo Maori, Navajo, Cherokee, Quechua, Klingon',
      "Kannada, Malayalam, Odia|Oriya, Assamese, Sindhi, Kashmiri, Dzongkha, Uyghur|Uighur, Kyrgyz, Tajik, Turkmen, Tatar, Chechen, Ossetian, Aramaic, Coptic, Akkadian, Sumerian, Old Norse|Norse, Old English|Anglo-Saxon, Gothic, Faroese, Frisian|West Frisian, Scots, Cornish, Manx, Occitan, Corsican, Sardinian, Romansh, Ladino, Sorbian, Sami|Saami, Tigrinya, Oromo, Wolof, Fula|Fulani|Fulfulde, Bambara, Twi|Akan, Ewe, Shona, Ndebele, Tswana|Setswana, Sotho|Sesotho, Swazi|Swati|siSwati, Venda, Tsonga, Chichewa|Nyanja, Kinyarwanda, Kirundi, Luganda, Lingala, Kikuyu|Gikuyu, Malagasy, Javanese, Sundanese, Balinese, Cebuano|Bisaya, Ilocano, Hmong, Hakka, Hokkien|Min Nan|Taiwanese, Ainu, Tok Pisin, Fijian, Samoan, Tongan, Tahitian, Guarani, Aymara, Nahuatl, Mayan|Maya, Mapuche|Mapudungun, Inuktitut, Greenlandic|Kalaallisut, Cree, Ojibwe|Ojibwa, Lakota, Hopi, Mohawk, Haitian Creole|Creole|Kreyol, Papiamento, Interlingua, Volapük, Toki Pona, Lojban, Dothraki, Na'vi, Etruscan, Hittite, Phoenician, Pali, Avestan",
    ],
  },
];
