// Answer cards: writers, thinkers, explorers, gods, stage and screen, games.
// Cards marked `people` accept a full name for a surname.

/** Tarot pips: "Two of Cups|2 of Cups" and so on, with the suits' other names. */
const SUITS = [['Cups'], ['Swords'], ['Wands', 'Rods', 'Staves'], ['Pentacles', 'Coins', 'Disks']];
const RANKS = [['Two', '2'], ['Three', '3'], ['Four', '4'], ['Five', '5'], ['Six', '6'], ['Seven', '7'], ['Eight', '8'], ['Nine', '9'], ['Ten', '10']];
const card = (rank, suit) => rank.flatMap((r) => suit.map((s) => `${r} of ${s}`)).join('|');
const pips = (skip) =>
  SUITS.flatMap((suit) => RANKS.filter((rank) => !skip.includes(`${rank[0]} of ${suit[0]}`)).map((rank) => card(rank, suit))).join(', ');
const court = SUITS.flatMap((suit) => ['Page', 'Knight', 'Queen', 'King'].map((r) => card([r], suit))).join(', ');
const PIPS_IN_TIER_3 = ['Three of Swords', 'Ten of Swords'];

export default [
  {
    id: 'novelists',
    q: 'Name a novelist',
    people: true,
    tiers: [
      'Dickens, Austen, Tolstoy, Hemingway, Orwell, Rowling|JK Rowling',
      'King|Stephen King, Twain|Mark Twain, Dostoevsky|Dostoyevsky, Tolkien, Christie|Agatha Christie, Fitzgerald|F Scott Fitzgerald, Steinbeck, Brontë|Bronte, Woolf, Joyce, Hugo|Victor Hugo, Kafka, Salinger, Lee|Harper Lee',
      'Dumas, Faulkner, Melville, Hardy, Eliot|George Eliot, Wilde|Oscar Wilde, Shelley|Mary Shelley, Stoker|Bram Stoker, Stevenson|Robert Louis Stevenson, Conrad, Huxley, Vonnegut, Kerouac, Nabokov, García Márquez|Garcia Marquez|Marquez, Atwood, Morrison|Toni Morrison, Rushdie, Murakami, Verne, Cervantes, Lewis|CS Lewis, Dahl, Asimov, Bradbury, Grisham, Brown|Dan Brown, Le Guin, Pratchett, Golding, Swift, Defoe, Flaubert, Proust, Zola, Balzac, Achebe, Ishiguro, McCarthy|Cormac McCarthy, Heller, Wells|HG Wells, Conan Doyle|Arthur Conan Doyle|Doyle, Fleming|Ian Fleming, Alcott, Hawthorne, Updike, Roth, Pynchon, Baldwin, Ellison, Walker|Alice Walker, Wharton, James|Henry James, Lawrence|DH Lawrence, Forster|EM Forster, Waugh, Greene|Graham Greene, McEwan, Tartt, Franzen, Steel|Danielle Steel, Patterson|James Patterson',
      'Eco, Calvino, Allende, Coelho, Saramago, Pamuk, Mahfouz, Kundera, Hesse, Mann|Thomas Mann, Grass, Remarque, Süskind|Suskind, Goethe, Stendhal, Maupassant, Sand|George Sand, Colette, Duras, Sagan, Houellebecq, Camus, Gide, Turgenev, Gogol, Bulgakov, Pasternak, Solzhenitsyn, Gorky, Kawabata, Mishima, Tagore, Narayan, Roy|Arundhati Roy, Seth|Vikram Seth, Naipaul, Adichie, Gordimer, Coetzee, Lessing, Okri, Rhys, Hurston, Wright|Richard Wright, O\'Connor|Flannery O\'Connor, McCullers, Capote, Irving|John Irving, Oates, DeLillo, Auster, Chabon, Eugenides, Wallace|David Foster Wallace, Smith|Zadie Smith, Mantel, Byatt, Murdoch|Iris Murdoch, Spark, Barnes|Julian Barnes, Amis, Winterson, Waters|Sarah Waters, Atkinson, Rooney|Sally Rooney, Tóibín|Toibin, Banville, Beckett, Trollope, Thackeray, Gaskell, Collins|Wilkie Collins, Richardson, Fielding, Sterne, Scott|Walter Scott, Kipling, Haggard, Buchan, Chesterton, Wodehouse, Sayers, Le Carré|Le Carre, Highsmith, Chandler, Hammett, Leonard|Elmore Leonard, Rankin, Pullman, Gaiman, Adams|Douglas Adams, Herbert|Frank Herbert, Heinlein, Clarke|Arthur C Clarke, Dick|Philip K Dick, Gibson|William Gibson, Butler|Octavia Butler, Hornby, Sebold, Picoult',
      'Murasaki|Murasaki Shikibu, Rabelais, Laclos, La Fayette|Lafayette, Fontane, Musil, Sebald, Böll|Boll, Hamsun, Undset, Lagerlöf|Lagerlof, Laxness, Andrić|Andric, Hrabal, Čapek|Capek, Hašek|Hasek, Kertész|Kertesz, Krasznahorkai, Márai|Marai, Tokarczuk, Prus, Sienkiewicz, Gombrowicz, Lem, Kadare, Kazantzakis, Pérez Galdós|Galdos, Unamuno, Cela, Marías|Javier Marias, Ruiz Zafón|Zafon, Machado de Assis, Amado, Lispector, Vargas Llosa, Cortázar|Cortazar, Bolaño|Bolano, Rulfo, Fuentes, Puig, Sábato|Sabato, Onetti, Asturias, Carpentier, Munif, Shafak, Kemal|Yasar Kemal, Hedayat, Agnon, Oz|Amos Oz, Grossman, Singer|Isaac Bashevis Singer, Bellow, Malamud, Doctorow, Dos Passos, Dreiser, Cather, Wolfe, West|Nathanael West, Larsen|Nella Larsen, Jackson|Shirley Jackson, Tyler|Anne Tyler, Robinson|Marilynne Robinson, Proulx, Ward|Jesmyn Ward, Whitehead|Colson Whitehead, Lahiri, Ng|Celeste Ng, Yanagihara, Ferrante, Knausgård|Knausgaard, Moravia, Pavese, Levi|Primo Levi, Bassani, Lampedusa, Manzoni, Verga, Svevo, Morante, Ginzburg, Tabucchi, Lermontov, Goncharov, Sholokhov, Tanizaki, Sōseki|Soseki, Ōe|Oe, Yoshimoto, Mo Yan, Cao Xueqin, Mistry, Desai, Ngũgĩ|Ngugi, Kincaid, Danticat, Toomer, Smollett, Burney, Perec, Modiano, Céline|Celine',
    ],
  },
  {
    id: 'poets',
    q: 'Name a poet',
    people: true,
    tiers: [
      'Shakespeare, Frost|Robert Frost, Poe|Edgar Allan Poe, Dickinson, Keats',
      'Wordsworth, Byron|Lord Byron, Shelley|Percy Bysshe Shelley, Whitman, Angelou, Plath, Tennyson, Blake, Yeats|WB Yeats, Eliot|TS Eliot, Homer, Dante|Dante Alighieri, Chaucer, Milton',
      'Coleridge, Browning, Burns|Robbie Burns, Kipling, Hughes|Langston Hughes|Ted Hughes, Cummings|EE Cummings, Ginsberg, Neruda, Rumi, Virgil|Vergil, Ovid, Sappho, Owen|Wilfred Owen, Sassoon, Brooke|Rupert Brooke, Hopkins|Gerard Manley Hopkins, Donne, Marvell, Spenser, Pope|Alexander Pope, Dryden, Auden, Larkin, Heaney, Thomas|Dylan Thomas, Stevens|Wallace Stevens, Pound|Ezra Pound, Williams|William Carlos Williams, Bishop|Elizabeth Bishop, Lowell, Rossetti, Housman, Longfellow, Silverstein|Shel Silverstein, Oliver|Mary Oliver, Bukowski, Rilke, Baudelaire, Rimbaud, Verlaine, Pushkin, Lorca|Garcia Lorca, Bashō|Basho, Li Bai|Li Po, Du Fu|Tu Fu, Gibran|Khalil Gibran, Hafez|Hafiz, Khayyam|Omar Khayyam, Kaur|Rupi Kaur, Gorman|Amanda Gorman, Brooks|Gwendolyn Brooks, Carroll|Lewis Carroll, Lear|Edward Lear, Nash|Ogden Nash, Betjeman, Duffy|Carol Ann Duffy, Walcott, Brodsky, Goethe, Tagore, Hardy',
      'Herbert|George Herbert, Vaughan, Herrick, Jonson|Ben Jonson, Sidney|Philip Sidney, Wyatt, Marlowe, Langland, Clare|John Clare, Cowper, Gray|Thomas Gray, Southey, Arnold|Matthew Arnold, Swinburne, Henley, De la Mare, Masefield, Graves, Rosenberg, MacNeice, Spender, Hill|Geoffrey Hill, Gunn|Thom Gunn, Sexton, Berryman, Moore|Marianne Moore, Crane|Hart Crane, Sandburg, Millay|Edna St Vincent Millay, Teasdale, Jeffers, Merwin, Ashbery, O\'Hara, Wilbur, Snyder, Ferlinghetti, Levertov, Rich|Adrienne Rich, Lorde|Audre Lorde, Giovanni|Nikki Giovanni, Clifton, Dove|Rita Dove, Collins|Billy Collins, Glück|Gluck, Pinsky, Strand, Simic, Olds, Harjo, Trethewey, Vuong|Ocean Vuong, Limón|Ada Limon, Armitage, Motion, Muldoon, Kavanagh, Boland, MacDiarmid, Morgan|Edwin Morgan, Zephaniah, Agard, Horace, Catullus, Hesiod, Pindar, Petrarch, Leopardi, Villon, Ronsard, La Fontaine, Mallarmé|Mallarme, Valéry|Valery, Apollinaire, Heine, Schiller, Hölderlin|Holderlin, Celan, Brecht, Akhmatova, Tsvetaeva, Mandelstam, Mayakovsky, Szymborska, Miłosz|Milosz, Cavafy, Pessoa, Paz|Octavio Paz, Mistral|Gabriela Mistral, Darío|Dario, Ferdowsi|Firdausi, Saadi, Ghalib, Iqbal, Kabir, Issa',
      'Crashaw, Traherne, Surrey, Skelton, Gower, Smart|Christopher Smart, Crabbe, Hood|Thomas Hood, Clough, Meredith, Patmore, Thompson|Francis Thompson, Dowson, Empson, Day-Lewis, Ammons, Merrill, Corso, Kooser, Hass, Hirshfield, Hayes|Terrance Hayes, Mahon, Nichols|Grace Nichols, Kay|Jackie Kay, Tempest|Kae Tempest, MacCaig, Juvenal, Martial, Theocritus, Callimachus, Ariosto, Tasso, Montale, Ungaretti, Quasimodo, Pasolini, Du Bellay, Lamartine, Musset, Vigny, Nerval, Éluard|Eluard, Aragon, Prévert|Prevert, Senghor, Césaire|Cesaire, Novalis, Eichendorff, Trakl, Enzensberger, Tyutchev, Fet, Blok, Yesenin, Yevtushenko, Mickiewicz, Holub, Seifert, Petőfi|Petofi, Ady, Radnóti|Radnoti, Seferis, Elytis, Ritsos, Camões|Camoes, Machado|Antonio Machado, Jiménez|Jimenez, Alberti, Vallejo, Storni, Parra, Huidobro, Benedetti, Cardenal, Martí|Marti, Guillén|Guillen, Sor Juana|Juana Ines de la Cruz, Drummond|Carlos Drummond de Andrade, Bandeira, Meireles, Darwish|Mahmoud Darwish, Adonis, Qabbani|Nizar Qabbani, Mutanabbi|Al-Mutanabbi, Abu Nuwas, Attar, Nizami, Jami, Mirabai, Tulsidas, Faiz, Kalidasa, Valmiki, Bharati|Subramania Bharati, Nazrul|Kazi Nazrul Islam, Wang Wei, Bai Juyi|Po Chu-i, Li Qingzhao, Su Shi|Su Dongpo, Qu Yuan, Tao Yuanming, Buson, Shiki, Ono no Komachi, Rizal',
    ],
  },
  {
    id: 'scientists',
    q: 'Name a famous scientist',
    people: true,
    tiers: [
      'Einstein, Newton, Darwin, Curie|Marie Curie, Galileo|Galilei',
      'Hawking, Tesla, Edison, Copernicus, Pasteur, Mendel, Faraday, Kepler, Bohr, Feynman, Archimedes, Franklin, Sagan, Turing, Oppenheimer, Fleming, Lovelace|Ada Lovelace, Goodall|Jane Goodall, Bell|Alexander Graham Bell',
      'Maxwell, Planck, Heisenberg, Schrödinger|Schrodinger, Dirac, Fermi, Rutherford, Thomson, Mendeleev|Mendeleyev, Lavoisier, Dalton, Boyle, Hooke, Halley, Herschel, Hubble, Linnaeus, Lamarck, Watson, Crick, Babbage, Euler, Gauss, Euclid, Ptolemy, Hippocrates, Galen, Vesalius, Harvey, Jenner, Lister, Koch, Salk, Nightingale, Carson|Rachel Carson, Dawkins, Volta, Ampère|Ampere, Ohm, Watt, Kelvin|Lord Kelvin, Joule, Celsius, Fahrenheit, Nobel, Avogadro, Hertz, Doppler, Pavlov, Freud, Jung, Brahe|Tycho Brahe|Tycho, Huygens, Leeuwenhoek|Van Leeuwenhoek, Tyson|Neil deGrasse Tyson, Nye|Bill Nye, Hopper|Grace Hopper, Berners-Lee, Ramanujan',
      'Lyell, Hutton, Wegener, Humboldt, Wallace|Alfred Russel Wallace, Banting, Hodgkin, Meitner, Noether, Raman, Bose, Yukawa, Al-Khwarizmi|Khwarizmi, Ibn al-Haytham|Alhazen, Al-Biruni|Biruni, Cavendish, Priestley, Davy, Bunsen, Kekulé|Kekule, Pauling, Bragg, Chadwick, Geiger, Born, Pauli, Gell-Mann, Higgs, Weinberg, Salam, Penrose, Thorne, Fossey, Wilson|EO Wilson, Gould, Margulis, McClintock, Sanger, Wilkins, Doudna, Charpentier, Venter, Von Neumann|Neumann, Shannon, Johnson|Katherine Johnson, Skinner, Piaget, Mead|Margaret Mead, Leakey, Fibonacci, Fermat, Descartes, Pascal, Leibniz, Laplace, Lagrange, Fourier, Riemann, Hilbert, Cantor, Gödel|Godel, Poincaré|Poincare, Galois, Nash|John Nash, Mandelbrot, Tu Youyou',
      'Cockcroft, Walton, Hahn|Otto Hahn, Strassmann, Szilard, Teller, Bethe, Chandrasekhar, Eddington, Lemaître|Lemaitre, Friedmann, Zwicky, Rubin|Vera Rubin, Leavitt|Henrietta Leavitt, Cannon|Annie Jump Cannon, Payne-Gaposchkin|Cecilia Payne, Bell Burnell|Jocelyn Bell Burnell, Hoyle, Gamow, Penzias, Hale, Tombaugh, Messier, Cassini, Rømer|Romer, Fraunhofer, Kirchhoff, Stefan, Boltzmann, Gibbs, Clausius, Carnot, Helmholtz, Mach, Lorentz, Minkowski, Zeeman, Röntgen|Roentgen|Rontgen, Becquerel, Millikan, Compton, De Broglie|Broglie, Landau, Kapitsa, Sakharov, Lomonosov, Lobachevsky, Kolmogorov, Chebyshev, Markov, Kovalevskaya, Germain|Sophie Germain, Somerville|Mary Somerville, Anning|Mary Anning, Agnesi, Lonsdale, Elion, Yalow, Levi-Montalcini, Cori, Hamilton|Margaret Hamilton, Lamarr|Hedy Lamarr, Golgi, Cajal|Ramon y Cajal, Virchow, Semmelweis, Ehrlich, Behring, Ross|Ronald Ross, Reed|Walter Reed, Sabin, Florey, Chain|Ernst Chain, Waksman, Krebs, Malpighi, Spallanzani, Swammerdam, Buffon, Cuvier, Agassiz, Owen|Richard Owen, Haeckel, Galton, Fisher|Ronald Fisher, Haldane, Dobzhansky, Mayr, Lorenz|Konrad Lorenz, Tinbergen, Frisch|Von Frisch, Audubon, Lovelock, Morgan|Thomas Hunt Morgan, Avery, Monod, Brenner, Khorana, Mullis, Blackburn, Yamanaka, Montagnier, Barré-Sinoussi|Barre-Sinoussi, Bhabha, Sarabhai, Kalam, Saha',
    ],
  },
  {
    id: 'explorers',
    q: 'Name a famous explorer or adventurer',
    people: true,
    tiers: [
      'Columbus|Christopher Columbus, Magellan, Polo|Marco Polo, Cook|Captain Cook|James Cook, Armstrong|Neil Armstrong',
      'Vasco da Gama|Da Gama, Lewis|Meriwether Lewis, Clark|William Clark, Hillary|Edmund Hillary, Tenzing|Tenzing Norgay, Amundsen, Shackleton, Scott|Robert Falcon Scott, Drake|Francis Drake, Vespucci|Amerigo Vespucci, Earhart|Amelia Earhart, Livingstone, Cortés|Cortes, Raleigh|Walter Raleigh, Leif Erikson|Leif Ericson|Leif Eriksson, Erik the Red',
      'Pizarro, Balboa, Ponce de León|Ponce de Leon, De Soto|Hernando de Soto, Cabot|John Cabot, Cartier|Jacques Cartier, Champlain, Hudson|Henry Hudson, Cabral, Dias|Bartolomeu Dias|Diaz, Tasman, Ibn Battuta|Battuta, Zheng He, Peary, Henson|Matthew Henson, Nansen, Franklin|John Franklin, Burton|Richard Burton, Speke, Stanley|Henry Morton Stanley, Mungo Park|Park, Bering, Vancouver, Flinders, Burke|Robert O\'Hara Burke, Wills, Lindbergh, Gagarin, Aldrin|Buzz Aldrin, Cousteau, Heyerdahl, Fiennes|Ranulph Fiennes, Bird|Isabella Bird, Bly|Nellie Bly, Mallory, Messner, Sacagawea, Boone|Daniel Boone, Frémont|Fremont, Pike|Zebulon Pike, La Salle, Coronado, Henry the Navigator|Prince Henry, Bligh, Mawson, Byrd|Richard Byrd, Tereshkova, Glenn|John Glenn, Ride|Sally Ride, Piccard, Ballard|Robert Ballard, Lawrence|TE Lawrence|Lawrence of Arabia, Frobisher, Baffin, Barents',
      'Marquette, Jolliet|Joliet, Cabeza de Vaca, Orellana, Xuanzang, Zhang Qian, Bougainville, La Pérouse|La Perouse, Dampier, Ross|James Clark Ross, Parry, Fuchs, Oates, Shepard|Alan Shepard, Fossett, Walsh|Don Walsh, Cameron|James Cameron, Stark|Freya Stark, Bell|Gertrude Bell, Thesiger, Doughty, Burckhardt, Caillié|Caillie, Barth|Heinrich Barth, Kingsley|Mary Kingsley, Baker|Samuel Baker, Przhevalsky|Przewalski, Hedin|Sven Hedin, Younghusband, David-Néel|David-Neel, Harrer, Nordenskiöld|Nordenskiold, Nobile, Andrée|Andree, Rasmussen, Wilkins, Ellsworth, Kane|Elisha Kane, Davis|John Davis, Dezhnev, Bellingshausen, Shirase, Uemura, Bonington, Kukuczka, Hargreaves|Alison Hargreaves, Ibn Fadlan, Pytheas, Hanno, Al-Idrisi|Idrisi, Mendes Pinto|Fernao Mendes Pinto',
      'Chirikov, Krusenstern, Lazarev, Kotzebue, Wrangel, Willoughby, Chancellor, Bartlett, Freuchen|Peter Freuchen, Stefansson, Rae|John Rae, Back|George Back, McClure, Sverdrup, Mikkelsen, Borchgrevink, Bruce|William Speirs Bruce, Charcot, Drygalski, Filchner, Gerlache, Larsen|Carl Anton Larsen, Mackenzie|Alexander Mackenzie, Thompson|David Thompson, Fraser|Simon Fraser, Hearne|Samuel Hearne, La Vérendrye|La Verendrye, Brûlé|Brule, Nicolet, Hennepin, Escalante, Kino, Anza|Juan Bautista de Anza, Smith|Jedediah Smith, Bridger|Jim Bridger, Carson|Kit Carson, Colter|John Colter, Powell|John Wesley Powell, Leichhardt, Sturt, Eyre|Edward John Eyre, Stuart|John McDouall Stuart, Forrest, Giles|Ernest Giles, Kennedy|Edmund Kennedy, Mitchell|Thomas Mitchell, Hume|Hamilton Hume, Hovell, Oxley, Bass|George Bass, Dumont d\'Urville|D\'Urville',
    ],
  },
  {
    id: 'golfers',
    q: 'Name a professional golfer',
    people: true,
    tiers: [
      'Woods|Tiger Woods|Tiger, Nicklaus|Jack Nicklaus, Palmer|Arnold Palmer, McIlroy|Rory McIlroy|Rory',
      'Mickelson|Phil Mickelson|Lefty, Player|Gary Player, Ballesteros|Seve, Hogan|Ben Hogan, Scheffler|Scottie Scheffler, Spieth, Sörenstam|Sorenstam|Annika, Jones|Bobby Jones, Watson|Tom Watson, Faldo, Norman|Greg Norman, Snead, Els|Ernie Els, Koepka, Johnson|Dustin Johnson',
      'Trevino, Hagen, Nelson|Byron Nelson, Sarazen, Morris|Old Tom Morris|Young Tom Morris, Vardon, Stewart|Payne Stewart, Couples, Singh|Vijay Singh, Rahm, Morikawa, Schauffele, Thomas|Justin Thomas, DeChambeau, Matsuyama, Scott|Adam Scott, Day|Jason Day, Rose|Justin Rose, García|Garcia|Sergio Garcia, Harrington, Montgomerie|Monty, Woosnam, Lyle, Langer, Olazábal|Olazabal, Lopez|Nancy Lopez, Zaharias|Babe Zaharias|Didrikson, Ochoa, Ko|Lydia Ko, Korda|Nelly Korda, Wie|Michelle Wie, Webb|Karrie Webb, Davies|Laura Davies, Daly|John Daly, Fowler|Rickie Fowler, Westwood, Lowry|Shane Lowry, Fleetwood, Hovland, Åberg|Aberg, Smith|Cameron Smith, Stenson, Kaymer, Furyk',
      'Floyd|Raymond Floyd, Kite|Tom Kite, Strange|Curtis Strange, Irwin|Hale Irwin, Miller|Johnny Miller, Jacklin, Cotton|Henry Cotton, Thomson|Peter Thomson, Locke|Bobby Locke, Love|Davis Love, Molinari, Willett, Donald|Luke Donald, Casey|Paul Casey, Reed|Patrick Reed, Simpson|Webb Simpson, Woodland, Goosen, Oosthuizen, Schwartzel, Immelman, Cabrera, Weir|Mike Weir, Crenshaw, Stadler, Zoeller, Mize, O\'Meara, Lehman, Duval, Rodríguez|Rodriguez|Chi Chi Rodriguez, Venturi, Casper, Wright|Mickey Wright, Whitworth, Berg|Patty Berg, Pak|Se Ri Pak, Park|Inbee Park, Inkster, Carner, Bradley|Pat Bradley, Tseng|Yani Tseng, Lewis|Stacy Lewis, Creamer, Henderson|Brooke Henderson, Ouimet, Braid, Taylor|JH Taylor, Ray|Ted Ray, Armour, Wethered, Aoki, Ozaki, Choi|KJ Choi, Yang|YE Yang, Clark|Wyndham Clark',
      'Boros, Bolt|Tommy Bolt, Middlecoff, Mangrum, Demaret, Robertson|Allan Robertson, Travis|Walter Travis, Hutchison, Collett|Glenna Collett-Vare|Vare, Suggs, Rawls, King|Betsy King, Daniel|Beth Daniel, Alcott|Amy Alcott, Okamoto, Shin|Jiyai Shin, Maruyama, Ishikawa, Atwal, Burns|Sam Burns, Cantlay, Finau, Homa, Zalatoris, Theegala',
    ],
  },
  {
    id: 'roman-emperors',
    q: 'Name a Roman emperor',
    tiers: [
      'Augustus|Octavian, Nero, Caligula, Marcus Aurelius|Aurelius, Constantine|Constantine the Great|Constantine I',
      'Hadrian, Tiberius, Claudius, Commodus, Trajan, Vespasian, Diocletian, Titus',
      'Domitian, Septimius Severus|Severus, Caracalla, Galba, Otho, Vitellius, Nerva, Antoninus Pius|Antoninus, Lucius Verus|Verus, Elagabalus|Heliogabalus, Aurelian, Julian|Julian the Apostate, Theodosius|Theodosius I|Theodosius the Great, Justinian|Justinian I, Romulus Augustulus|Romulus Augustus, Maximian, Valerian, Pertinax, Didius Julianus, Geta, Macrinus',
      'Severus Alexander|Alexander Severus, Maximinus Thrax|Maximinus, Gordian|Gordian I|Gordian II|Gordian III, Philip the Arab|Philip, Decius, Trebonianus Gallus|Gallus, Gallienus, Claudius Gothicus|Claudius II, Quintillus, Tacitus, Florianus, Probus, Carus, Carinus, Numerian, Galerius, Constantius Chlorus|Constantius I, Licinius, Maxentius, Constantine II, Constans, Constantius II, Jovian, Valentinian|Valentinian I, Valens, Gratian, Valentinian II, Arcadius, Honorius, Theodosius II, Valentinian III, Majorian, Anthemius, Julius Nepos|Nepos, Pupienus, Balbinus, Aemilian|Aemilianus',
      'Petronius Maximus, Avitus, Libius Severus, Olybrius, Glycerius, Hostilian, Volusianus|Volusian, Severus II, Maximinus Daia|Maximinus II|Daia, Magnentius, Vetranio, Procopius, Magnus Maximus, Eugenius, Constantine III, Joannes, Marcian, Leo I, Zeno, Anastasius|Anastasius I, Justin I, Heraclius, Basil II|Basil the Bulgar Slayer, Constantine XI|Constantine Palaiologos, Alexios Komnenos|Alexios I, Leo III, Irene|Irene of Athens, Nikephoros Phokas, John Tzimiskes, Manuel Komnenos, Postumus, Tetricus, Carausius, Allectus',
    ],
  },
  {
    id: 'egyptian-gods',
    q: 'Name a god or goddess of ancient Egypt',
    tiers: [
      'Ra|Re, Osiris, Anubis, Isis, Horus',
      'Set|Seth, Thoth, Bastet|Bast, Sobek, Hathor, Ptah, Amun|Amon|Amun-Ra|Amun-Re, Sekhmet, Nut, Geb, Aten|Aton',
      'Nephthys, Khnum, Maat|Ma\'at, Shu, Tefnut, Atum, Bes, Taweret, Khonsu, Montu, Min, Hapi, Apophis|Apep, Wadjet, Nekhbet, Neith, Serqet|Selket|Serket, Mut, Imhotep, Ammit|Ammut, Khepri, Sopdet|Sothis, Heka, Seshat, Apis, Bennu|Benu',
      'Anuket, Satet|Satis, Meretseger|Mertseger, Renenutet, Wepwawet, Aker, Babi, Hu, Sia, Nun|Nu, Naunet, Heh|Huh, Hauhet, Kek|Kuk, Kauket, Amaunet, Iusaaset, Mehet-Weret, Qetesh|Qadesh, Reshep|Resheph, Anat, Astarte, Sokar|Seker, Tatenen, Banebdjedet, Heryshaf|Harsaphes, Khentiamentiu|Khenti-Amentiu, Mafdet, Pakhet, Menhit, Shezmu, Nehebkau',
      'Wosret, Raet|Raet-Tawy, Hemsut, Andjety, Mandulis, Dedun, Ha, Ash, Sepa, Wadj-wer, Ihy, Unut, Werethekau, Kebechet|Qebehet, Imsety, Duamutef, Qebehsenuef, Mnevis, Buchis, Hedetet, Mehen, Nehmetawy',
    ],
  },
  {
    id: 'roman-gods',
    q: 'Name a god or goddess of ancient Rome',
    tiers: [
      'Jupiter|Jove, Mars, Venus, Neptune, Mercury',
      'Juno, Minerva, Pluto, Apollo, Diana, Cupid|Amor, Bacchus|Liber, Vulcan, Saturn, Janus, Vesta, Ceres',
      'Aurora, Fortuna, Faunus, Flora, Proserpina|Proserpine, Sol|Sol Invictus, Luna, Terminus, Pomona, Bellona, Victoria, Somnus, Dis Pater|Dis, Orcus, Quirinus, Lares|Lar, Penates, Mithras, Cybele|Magna Mater, Silvanus|Sylvanus, Tellus|Terra, Nox, Mors, Discordia, Fama, Juventas, Libertas, Concordia, Pax, Spes, Fides, Salus, Trivia',
      'Genius, Virtus, Honos, Pales, Vertumnus, Portunus, Caelus, Ops, Invidia, Bona Dea, Fauna, Feronia, Carmenta, Egeria, Lucina, Libera, Laverna, Robigus, Consus, Volturnus, Tiberinus, Furrina, Angerona, Acca Larentia|Larentia, Mefitis|Mephitis, Summanus, Veiovis|Vediovis, Sancus|Semo Sancus, Fontus, Picus, Mater Matuta|Matuta, Anna Perenna, Juturna',
      'Nortia, Cardea, Forculus, Limentinus, Mena, Rumina, Cunina, Vaticanus, Mania, Pilumnus, Intercidona, Deverra, Abeona, Adeona, Domiduca, Nundina, Edusa|Educa, Potina, Inuus, Sterquilinus|Stercutus, Cloacina, Febris, Verminus, Lua, Nerio, Hora, Empanda, Mellona, Patelana, Volumna',
    ],
  },
  {
    id: 'bible-books',
    q: 'Name a book of the Bible',
    tiers: [
      'Genesis, Exodus, Revelation|Revelations|Apocalypse, Matthew, Psalms|Psalm',
      'Mark, Luke, John, Acts|Acts of the Apostles, Leviticus, Numbers, Deuteronomy, Job, Proverbs, Isaiah, Daniel, Jonah, Romans, Corinthians|1 Corinthians|2 Corinthians|First Corinthians|Second Corinthians, Ruth, Esther, Song of Songs|Song of Solomon|Canticles',
      'Joshua, Judges, Samuel|1 Samuel|2 Samuel|First Samuel|Second Samuel, Kings|1 Kings|2 Kings|First Kings|Second Kings, Chronicles|1 Chronicles|2 Chronicles|First Chronicles|Second Chronicles, Ezra, Nehemiah, Ecclesiastes|Qoheleth, Jeremiah, Lamentations, Ezekiel, Hosea, Joel, Amos, Micah, Galatians, Ephesians, Philippians, Colossians, Thessalonians|1 Thessalonians|2 Thessalonians|First Thessalonians|Second Thessalonians, Timothy|1 Timothy|2 Timothy|First Timothy|Second Timothy, Hebrews, James, Peter|1 Peter|2 Peter|First Peter|Second Peter, Jude',
      'Obadiah, Nahum, Habakkuk, Zephaniah, Haggai, Zechariah, Malachi, Titus, Philemon, Epistles of John|1 John|2 John|3 John|First John|Second John|Third John',
      'Tobit, Judith, Wisdom|Wisdom of Solomon, Sirach|Ecclesiasticus|Ben Sira, Baruch, Maccabees|1 Maccabees|2 Maccabees|3 Maccabees|4 Maccabees, Esdras|1 Esdras|2 Esdras, Prayer of Manasseh|Manasseh, Susanna, Bel and the Dragon, Letter of Jeremiah|Epistle of Jeremy, Psalm 151, Jubilees, Enoch|1 Enoch',
    ],
  },
  {
    id: 'tarot',
    q: 'Name a tarot card',
    tiers: [
      'Death, The Fool, The Lovers, The Tower',
      'The Devil, The Magician, The Hanged Man, The Moon, The Sun, The Star, Wheel of Fortune, The World, The Empress, The Emperor, Judgement|Judgment',
      [
        'The High Priestess|The Papess, The Hierophant|The Pope, The Chariot, Strength, The Hermit, Justice, Temperance',
        ...SUITS.map((suit) => card(['Ace'], suit)),
        card(['Three', '3'], SUITS[1]),
        card(['Ten', '10'], SUITS[1]),
      ].join(', '),
      court,
      pips(PIPS_IN_TIER_3),
    ],
  },
  {
    id: 'operas',
    q: 'Name an opera or operetta',
    tiers: [
      'Carmen, The Magic Flute|Die Zauberflöte|Zauberflote, La Traviata|Traviata, Madama Butterfly|Madame Butterfly, The Marriage of Figaro|Le nozze di Figaro|Nozze di Figaro',
      'La Bohème|La Boheme|Boheme, Aida, Tosca, Don Giovanni, The Barber of Seville|Il barbiere di Siviglia, Rigoletto, Turandot, The Ring Cycle|Ring Cycle|Der Ring des Nibelungen|The Ring, Porgy and Bess, Otello, Fidelio, Nabucco, Pagliacci, Cavalleria rusticana, Lohengrin',
      'Tristan und Isolde|Tristan and Isolde, Die Walküre|Die Walkure|The Valkyrie, Das Rheingold|Rheingold, Siegfried, Götterdämmerung|Gotterdammerung|Twilight of the Gods, Parsifal, Tannhäuser|Tannhauser, The Flying Dutchman|Der fliegende Holländer, Die Meistersinger|Die Meistersinger von Nürnberg, Così fan tutte|Cosi fan tutte, Il trovatore|Trovatore, Falstaff, Don Carlos|Don Carlo, Un ballo in maschera|A Masked Ball, La forza del destino|The Force of Destiny, Lucia di Lammermoor, L\'elisir d\'amore|The Elixir of Love, Norma, William Tell|Guillaume Tell, La Cenerentola|Cenerentola, L\'Orfeo|Orfeo, Dido and Aeneas, Peter Grimes, Salome, Elektra, Der Rosenkavalier|Rosenkavalier, Eugene Onegin, The Queen of Spades|Pique Dame, Boris Godunov, Rusalka, Samson and Delilah|Samson et Dalila, Faust, The Tales of Hoffmann|Les contes d\'Hoffmann, Lakmé|Lakme, The Pearl Fishers|Les pêcheurs de perles, Hansel and Gretel|Hänsel und Gretel, Gianni Schicchi, Manon Lescaut, Die Fledermaus|Fledermaus, The Merry Widow|Die lustige Witwe, The Mikado|Mikado, The Pirates of Penzance|Pirates of Penzance, HMS Pinafore|Pinafore, Nixon in China, Einstein on the Beach, The Threepenny Opera|Threepenny Opera|Die Dreigroschenoper, Candide, Orpheus in the Underworld|Orphée aux enfers',
      'Don Pasquale, La sonnambula|Sonnambula, Orfeo ed Euridice, Macbeth, Simon Boccanegra, Ernani, Attila, I puritani|Puritani, Idomeneo, La clemenza di Tito, The Abduction from the Seraglio|Die Entführung aus dem Serail, Giulio Cesare, Rinaldo, Xerxes|Serse, Alcina, The Beggar\'s Opera, The Bartered Bride, Jenůfa|Jenufa, The Cunning Little Vixen, Katya Kabanova|Káťa Kabanová, Bluebeard\'s Castle|Duke Bluebeard\'s Castle, The Love for Three Oranges, Lady Macbeth of Mtsensk, Wozzeck, Lulu, Pelléas et Mélisande|Pelleas et Melisande, Dialogues of the Carmelites|Dialogues des Carmélites, Ariadne auf Naxos, Arabella, Les Troyens|The Trojans, The Damnation of Faust|La damnation de Faust, Mefistofele, Andrea Chénier|Andrea Chenier, La Gioconda, Manon, Werther, Thaïs|Thais, The Golden Cockerel|Le Coq d\'Or, Prince Igor, Mazeppa, Iolanta, Akhnaten, Satyagraha, Doctor Atomic, The Rake\'s Progress, Billy Budd, The Turn of the Screw, La fanciulla del West|The Girl of the Golden West, Il tabarro, Suor Angelica, The Gondoliers, Iolanthe, The Yeomen of the Guard, Patience, Ruddigore, Trial by Jury',
      'Ruslan and Lyudmila, A Life for the Tsar, Khovanshchina, Sadko, The Snow Maiden, The Fiery Angel, War and Peace, The Nose, The Death of Klinghoffer, Moses und Aron, Erwartung, Rise and Fall of the City of Mahagonny|Mahagonny, Treemonisha, Vanessa, Susannah, The Medium, Amahl and the Night Visitors, Benvenuto Cellini, Béatrice et Bénédict|Beatrice et Benedict, Adriana Lecouvreur, Fedora, L\'amico Fritz, Mignon, Les Huguenots, Robert le diable, Le prophète|Le prophete, La Juive, Hippolyte et Aricie, Platée|Platee, Atys, Armide, Alceste, Iphigénie en Tauride|Iphigenie en Tauride, The Coronation of Poppea|L\'incoronazione di Poppea|Poppea, Il ritorno d\'Ulisse in patria, Semele, Hamlet',
    ],
  },
  {
    id: 'musicals',
    q: 'Name a stage musical',
    tiers: [
      'Hamilton, Les Misérables|Les Miserables|Les Mis, The Phantom of the Opera|Phantom of the Opera|Phantom, The Lion King|Lion King, Cats, Wicked, Grease',
      'Mamma Mia!|Mamma Mia, Chicago, The Sound of Music|Sound of Music, West Side Story, Cabaret, Hairspray, Rent, Mary Poppins, Annie, Oliver!|Oliver, Fiddler on the Roof, My Fair Lady, The Book of Mormon|Book of Mormon, Dear Evan Hansen, Matilda, Jesus Christ Superstar, Evita, Moulin Rouge!|Moulin Rouge, Hadestown, Six',
      'Joseph and the Amazing Technicolor Dreamcoat|Joseph, Miss Saigon, Into the Woods, Sweeney Todd, Guys and Dolls, Oklahoma!|Oklahoma, The King and I|King and I, South Pacific, Carousel, The Wizard of Oz|Wizard of Oz, Little Shop of Horrors, The Rocky Horror Show|Rocky Horror Show|Rocky Horror, Starlight Express, Blood Brothers, Billy Elliot, Kinky Boots, Aladdin, Beauty and the Beast, Legally Blonde, Mean Girls, Waitress, Come From Away, In the Heights, Avenue Q, Spamalot, The Producers, A Chorus Line|Chorus Line, Anything Goes, Kiss Me Kate, Hello Dolly!|Hello Dolly, Show Boat, Annie Get Your Gun, Singin\' in the Rain|Singing in the Rain, 42nd Street, Funny Girl, Gypsy, Company, Follies, Pippin, Godspell, Hair, Jersey Boys, Dreamgirls, The Color Purple|Color Purple, Spring Awakening, Next to Normal, Heathers, Beetlejuice, Shrek the Musical|Shrek, Charlie and the Chocolate Factory, Chitty Chitty Bang Bang, The Wiz|Wiz, Sunset Boulevard, We Will Rock You, Tina|Tina the Musical, Back to the Future, Frozen, Everybody\'s Talking About Jamie|Jamie, Mrs Doubtfire, MJ|MJ the Musical, Jagged Little Pill',
      'Brigadoon, Camelot, Kismet, The Music Man|Music Man, Bye Bye Birdie, Man of La Mancha, Mame, Sweet Charity, 1776, A Little Night Music, Sunday in the Park with George, Assassins, Merrily We Roll Along, Pacific Overtures, A Funny Thing Happened on the Way to the Forum|Forum, The Fantasticks|Fantasticks, Damn Yankees, The Pajama Game|Pajama Game, How to Succeed in Business Without Really Trying|How to Succeed, On the Town, Wonderful Town, Bells Are Ringing, Pal Joey, Kiss of the Spider Woman, Ragtime, Parade, The Light in the Piazza, Grey Gardens, Titanic, Seussical, Urinetown, Thoroughly Modern Millie, The Drowsy Chaperone, Once on This Island, Falsettos, The Secret Garden, Big River, City of Angels, Grand Hotel, Nine, La Cage aux Folles, Barnum, Chess, Me and My Girl, Half a Sixpence, Aspects of Love, Whistle Down the Wind, Love Never Dies, The Woman in White, Bat Out of Hell, Fun Home, Once, Be More Chill, Elf, Hedwig and the Angry Inch|Hedwig, Natasha Pierre and the Great Comet of 1812|The Great Comet, The Band\'s Visit, Kimberly Akimbo, Suffs, Shucked, A Strange Loop, Tick Tick Boom, Bright Star, Made in Dagenham',
      'Paint Your Wagon, Promises Promises, Passion, Anyone Can Whistle, Fiorello!|Fiorello, Li\'l Abner, Lady in the Dark, Babes in Arms, Of Thee I Sing, Caroline or Change, Salad Days, The Boy Friend, Oh What a Lovely War|Oh What a Lovely War!, Tell Me on a Sunday, Cinderella, State Fair, Allegro, Flower Drum Song, Pipe Dream, No Strings, Shuffle Along, Girl Crazy, Strike Up the Band, Lady Be Good, No No Nanette, Floyd Collins, Dogfight, The Will Rogers Follies, Lionel Bart\'s Blitz|Blitz!, Stop the World I Want to Get Off, Zorba',
    ],
  },
  {
    id: 'disney-films',
    q: 'Name a Disney or Pixar animated film',
    tiers: [
      'The Lion King|Lion King, Frozen, Toy Story, Aladdin, The Little Mermaid|Little Mermaid, Beauty and the Beast',
      'Snow White and the Seven Dwarfs|Snow White, Cinderella, Finding Nemo, Moana, Encanto, Tangled, Mulan, Pinocchio, Bambi, Dumbo, Peter Pan, Sleeping Beauty, The Jungle Book|Jungle Book, Monsters Inc|Monsters Incorporated, Up, Coco, Cars, The Incredibles|Incredibles, Inside Out, Zootopia|Zootropolis, Pocahontas, 101 Dalmatians|One Hundred and One Dalmatians, Lady and the Tramp, WALL-E|Wall E, Ratatouille',
      'Hercules, Tarzan, The Hunchback of Notre Dame|Hunchback of Notre Dame, Lilo & Stitch|Lilo and Stitch, The Princess and the Frog|Princess and the Frog, Wreck-It Ralph, Big Hero 6, Frozen II|Frozen 2, Fantasia, Alice in Wonderland, The Aristocats|Aristocats, Robin Hood, The Fox and the Hound|Fox and the Hound, Brave, A Bug\'s Life|Bugs Life, Toy Story 2, Toy Story 3, Toy Story 4, Finding Dory, Monsters University, Cars 2, Cars 3, Incredibles 2, Soul, Luca, Turning Red, Elemental, Raya and the Last Dragon|Raya, Wish, Bolt, The Emperor\'s New Groove|Emperor\'s New Groove, Inside Out 2, Moana 2, Onward, Lightyear, The Good Dinosaur|Good Dinosaur, Ralph Breaks the Internet, Zootopia 2, Elio',
      'Meet the Robinsons, Chicken Little, Atlantis|Atlantis The Lost Empire, Treasure Planet, Brother Bear, Home on the Range, The Rescuers|Rescuers, The Rescuers Down Under|Rescuers Down Under, The Great Mouse Detective|Great Mouse Detective, Oliver & Company|Oliver and Company, The Black Cauldron|Black Cauldron, The Sword in the Stone|Sword in the Stone, The Many Adventures of Winnie the Pooh|Winnie the Pooh, Fantasia 2000, Dinosaur, Strange World',
      'Saludos Amigos, The Three Caballeros|Three Caballeros, Make Mine Music, Fun and Fancy Free, Melody Time, The Adventures of Ichabod and Mr Toad|Ichabod and Mr Toad, The Reluctant Dragon, Victory Through Air Power',
    ],
  },
  {
    id: 'superheroes',
    q: 'Name a superhero',
    tiers: [
      'Superman, Batman, Spider-Man|Spiderman, Wonder Woman, Iron Man',
      'Captain America, Hulk|The Hulk|The Incredible Hulk, Thor, Black Panther, Wolverine, Black Widow, Aquaman, The Flash|Flash, Green Lantern, Captain Marvel, Deadpool, Doctor Strange|Dr Strange, Hawkeye, Ant-Man|Antman, Robin, Supergirl, Catwoman',
      'Batgirl, Cyborg, Martian Manhunter, Green Arrow, Shazam, Storm, Cyclops, Jean Grey|Phoenix, Rogue, Gambit, Beast, Nightcrawler, Iceman, Professor X|Professor Xavier|Charles Xavier, Daredevil, The Punisher|Punisher, Luke Cage|Power Man, Jessica Jones, Iron Fist, Moon Knight, Ms Marvel|Kamala Khan, She-Hulk, Silver Surfer, Vision, Scarlet Witch|Wanda Maximoff, Quicksilver, Falcon, Winter Soldier|Bucky|Bucky Barnes, War Machine, Star-Lord|Starlord, Gamora, Groot, Rocket|Rocket Raccoon, Drax, Mister Fantastic|Mr Fantastic|Reed Richards, Invisible Woman|Sue Storm, Human Torch, The Thing|Thing, Nightwing, Raven, Starfire, Beast Boy, Hawkgirl, Hawkman, Zatanna, Blue Beetle, Black Canary, Batwoman, Spider-Woman, Spider-Gwen|Ghost-Spider, Miles Morales, Ghost Rider, Blade, The Wasp|Wasp, Shang-Chi, Hellboy, Spawn, Invincible, Mr Incredible|Mister Incredible, Elastigirl, Captain Planet, Kick-Ass, Hit-Girl',
      'Swamp Thing, Booster Gold, The Atom|Atom, Plastic Man, Static|Static Shock, Huntress, Venom, Captain Britain, Black Bolt, Nova, Adam Warlock, Mantis, The Tick|Tick, Rorschach, Doctor Manhattan|Dr Manhattan, Nite Owl, Silk Spectre, Frozone, The Phantom|Phantom, Darkwing Duck, Underdog, Colossus, Kitty Pryde|Shadowcat, Psylocke, Jubilee, Cable, Emma Frost, Havok, Banshee, Domino, X-23|Laura Kinney, Squirrel Girl, Firestorm, Captain Atom, Doctor Fate, Mister Miracle, Big Barda, Vixen, Steel, Black Lightning, Red Tornado, Namor|Sub-Mariner, Kid Flash, Wonder Girl, Superboy, Red Hood, Cassandra Cain|Orphan, Moon Girl, America Chavez|Miss America, Echo, Sentry, Cloak, Dagger, Magik',
      'Elongated Man, Metamorpho, Animal Man, The Question|Question, Blue Devil, Starman, Stargirl, Doctor Mid-Nite, Hourman, The Spectre|Spectre, Wildcat, Arsenal|Speedy, Aqualad, Red Robin, Spoiler, Blue Marvel, Darkhawk, Sleepwalker, Quasar, Speedball, Wolfsbane, Cannonball, Sunspot, Mirage, Polaris, Dazzler, Wonder Man, Captain Universe, Mighty Mouse',
    ],
  },
  {
    id: 'fairy-tales',
    q: 'Name a fairy tale or folk tale',
    tiers: [
      'Cinderella, Snow White, Little Red Riding Hood|Red Riding Hood, Sleeping Beauty|Briar Rose|Little Briar Rose, Hansel and Gretel, Goldilocks|Goldilocks and the Three Bears',
      'Rapunzel, Jack and the Beanstalk, The Three Little Pigs|Three Little Pigs, Beauty and the Beast, Rumpelstiltskin, The Little Mermaid|Little Mermaid, The Ugly Duckling|Ugly Duckling, The Frog Prince|Frog Prince, Puss in Boots, The Princess and the Pea|Princess and the Pea, Thumbelina, The Gingerbread Man|Gingerbread Man, The Emperor\'s New Clothes|Emperor\'s New Clothes',
      'The Elves and the Shoemaker|Elves and the Shoemaker, The Snow Queen|Snow Queen, The Little Match Girl|Little Match Girl, Tom Thumb, Bluebeard, The Pied Piper of Hamelin|Pied Piper, The Golden Goose|Golden Goose, The Twelve Dancing Princesses|Twelve Dancing Princesses, The Brave Little Tailor|Valiant Little Tailor, The Three Billy Goats Gruff|Billy Goats Gruff, Aladdin, Ali Baba|Ali Baba and the Forty Thieves, Sinbad|Sinbad the Sailor, Dick Whittington, Jack the Giant Killer, The Steadfast Tin Soldier|Tin Soldier, The Red Shoes|Red Shoes, The Nightingale|Nightingale, The Wild Swans|Wild Swans, The Musicians of Bremen|Town Musicians of Bremen|Bremen Town Musicians, The Fisherman and His Wife, Snow White and Rose Red|Snow-White and Rose-Red, The Little Red Hen|Little Red Hen, Henny Penny|Chicken Little|Chicken Licken, The Wolf and the Seven Young Goats|Seven Little Goats, Baba Yaga, The Firebird|Firebird, Momotaro|Peach Boy, Anansi|Anansi the Spider, Brer Rabbit',
      'Mother Holle|Mother Hulda, The Goose Girl|Goose Girl, King Thrushbeard, The Juniper Tree, Fitcher\'s Bird, The Robber Bridegroom, The Water of Life, The Golden Bird, The Six Swans, East of the Sun and West of the Moon, The Princess on the Glass Hill, Vasilisa the Beautiful, The Frog Princess, The Snow Maiden|Snegurochka, The Tale of the Fisherman and the Fish, Kolobok, The Enormous Turnip|The Giant Turnip, The Tale of Tsar Saltan|Tsar Saltan, Urashima Taro, The Tale of the Bamboo Cutter|Princess Kaguya|Kaguya-hime, Issun-boshi, The Crane Wife, Kintaro, Ye Xian, The Magic Paintbrush, Tam and Cam, Tar-Baby|Tar Baby, Molly Whuppie, Tam Lin, Tattercoats, Cap o\' Rushes, Donkeyskin, Allerleirauh|All-Kinds-of-Fur, The Girl Without Hands, Diamonds and Toads|The Fairies, Riquet with the Tuft|Ricky of the Tuft, Hop-o\'-My-Thumb|Little Thumb, The Blue Light, The Tinderbox|Tinder Box, The Fir Tree, The Shadow, The Swineherd, The Flying Trunk, Little Claus and Big Claus',
      'The Devil with the Three Golden Hairs, The Three Feathers, Jorinde and Joringel, Hans My Hedgehog, The Twelve Brothers, Brother and Sister, The Three Spinners, Clever Gretel, The Golden Key, Old Sultan, The Star Money, Sweet Porridge, The Marsh King\'s Daughter, The Ice Maiden, The Storks, Tom Tit Tot, Mr Fox, Johnny-Cake, Catskin, The Story of the Youth Who Went Forth to Learn What Fear Was, The Boots of Buffalo Leather, The Glass Coffin, Iron John|Iron Hans, The Seven Ravens, Hans in Luck',
    ],
  },
  {
    id: 'board-games',
    q: 'Name a board game',
    tiers: [
      'Chess, Monopoly, Scrabble, Checkers|Draughts, Cluedo|Clue, Snakes and Ladders|Chutes and Ladders',
      'Risk, Backgammon, Trivial Pursuit, Battleship|Battleships, Connect Four|Connect 4, Operation, Guess Who, Pictionary, Mouse Trap|Mousetrap, The Game of Life|Game of Life|Life, Catan|Settlers of Catan, Ludo|Parcheesi|Pachisi, Sorry!|Sorry, Go|Weiqi|Baduk, Candy Land|Candyland, Stratego, Othello|Reversi, Hungry Hungry Hippos|Hungry Hippos, Mahjong|Mah-jong|Mahjongg',
      'Ticket to Ride, Carcassonne, Pandemic, Mastermind, Chinese Checkers|Chinese chequers|Sternhalma, Mancala, Diplomacy, Axis & Allies|Axis and Allies, Cranium, Balderdash, Rummikub, Upwords, Azul, Splendor, Agricola, Puerto Rico, Power Grid, Terraforming Mars, Wingspan, Gloomhaven, Twilight Imperium, Arkham Horror, Betrayal at House on the Hill, Small World, King of Tokyo, Dixit, Mysterium, Scotland Yard, HeroQuest|Hero Quest, Shogi, Xiangqi|Chinese chess, Nine Men\'s Morris|Mill|Merels, Blokus, Labyrinth, Carrom, Trouble|Frustration, Kerplunk|KerPlunk, Payday, Codenames, Cascadia, Everdell, Root, Scythe, Brass',
      'Hex, Janggi, Makruk, Fox and Geese, Hnefatafl|Tafl, Senet, Royal Game of Ur|Game of Ur, Mehen, Patolli, Alquerque, Fanorona, Halma, Pente, Gomoku, Abalone, Quoridor, Qwirkle, Crokinole, Spirit Island, Twilight Struggle, El Grande, Tigris and Euphrates|Tigris & Euphrates, Acquire, Escape from Colditz, Kingdomino, Patchwork, Mall Madness, Careers, Masterpiece, Dream Phone, Stock Ticker, Hotel|Hotel Tycoon, Downfall, Formula D, Heroscape, Talisman, Dungeon!|Dungeon, Space Hulk, Blood Bowl, Warhammer, Hive',
      'Oware|Ayo, Bao, Kalah, Surakarta, Konane, Tablut, Lasca, Kingmaker, Hare and Tortoise, Cosmic Encounter, Civilization, Railway Rivals, Sagrada, Tzolkin|Tzolk\'in, Through the Ages, Le Havre, Concordia, Tikal',
    ],
  },
  {
    id: 'chess-terms',
    q: 'Name a chess piece, opening or term',
    tiers: [
      'Checkmate|Mate, Check, King, Queen, Pawn, Knight',
      'Bishop, Rook|Castle, Castling, Stalemate, En passant, Promotion|Queening, Gambit, Opening, Endgame, Grandmaster|GM, Fork, Pin, Resign|Resignation, Draw, Queen\'s Gambit, Sicilian|Sicilian Defence|Sicilian Defense',
      'Skewer, Discovered attack, Discovered check, Double check, Fianchetto, Zugzwang, Ruy Lopez|Spanish Opening|Spanish Game, French Defence|French Defense|French, Caro-Kann, King\'s Indian|King\'s Indian Defence|King\'s Indian Defense, English Opening|English, Italian Game|Giuoco Piano, Scholar\'s Mate, Fool\'s Mate, Back rank mate|Back-rank mate, Smothered mate, Sacrifice|Sac, Blunder, Tempo, Elo|Elo rating, International Master|IM, Blitz, Bullet, Rapid, Zwischenzug|Intermezzo, Perpetual check|Perpetual, Threefold repetition, Fifty-move rule|50-move rule, Underpromotion, Passed pawn, Doubled pawns, Isolated pawn|Isolani, Exchange, Kingside, Queenside, Opposition, Outpost, Open file, Battery, Rank, File, Diagonal, Algebraic notation|Notation, Simul|Simultaneous exhibition, Touch-move|Touch move|J\'adoube, Chess clock, Hanging piece|En prise, King\'s Gambit, London System|London, Dragon|Sicilian Dragon, Najdorf, Fried Liver Attack|Fried Liver, Chess960|Fischer Random, FIDE, Patzer',
      'Desperado, Windmill, Deflection, Decoy, Overloading, Interference, X-ray, Prophylaxis, Benoni, Benko Gambit|Benko, Dutch Defence|Dutch, Grünfeld|Grunfeld, Nimzo-Indian, Queen\'s Indian, Catalan, Slav|Slav Defence, Semi-Slav, Colle, Trompowsky, Réti|Reti, Bird\'s Opening, Alekhine\'s Defence|Alekhine, Pirc, Modern Defence, Scandinavian|Centre Counter|Center Counter, Philidor Defence|Philidor, Petrov|Petroff|Russian Game, Scotch Game|Scotch, Vienna Game|Vienna, Evans Gambit, Danish Gambit, Budapest Gambit, Albin Countergambit, Latvian Gambit, Two Knights Defence|Two Knights, Four Knights, Berlin Defence|Berlin, Marshall Attack, Stonewall, Lucena position|Lucena, Triangulation, Fortress, Bishop pair, Minority attack, Pawn storm, Pawn chain, Backward pawn, Luft, Bughouse, Blindfold chess|Blindfold, Correspondence chess, Helpmate, Selfmate, Novelty|Theoretical novelty, Engine, Tablebase, Woman Grandmaster|WGM, FIDE Master, Norm, Armageddon, Swiss system|Swiss, Arbiter, Kibitzer|Kibitz, Woodpusher, Swindle, Adjournment',
      'Hippopotamus, Grob, Sokolsky|Polish Opening|Orangutan, Larsen\'s Opening|Nimzo-Larsen, Owen\'s Defence, Englund Gambit, Elephant Gambit, Ponziani, Vancura position, Saavedra position, Philidor position, Rule of the square, Corresponding squares, Hanging pawns, Pawn island, Trébuchet|Trebuchet, Opposite-coloured bishops|Opposite-colored bishops, Retrograde analysis, Candidate Master, Opening book, Round robin, Flag fall|Flag, Bongcloud, Hedgehog, Accelerated Dragon, Scheveningen, Sveshnikov, Taimanov, Alapin, Smith-Morra Gambit|Morra Gambit',
    ],
  },
  {
    id: 'literary-devices',
    q: 'Name a literary device or figure of speech',
    tiers: [
      'Metaphor, Simile, Alliteration, Rhyme, Irony',
      'Personification|Prosopopoeia, Onomatopoeia, Hyperbole, Foreshadowing, Oxymoron, Imagery, Symbolism, Flashback|Analepsis, Satire, Allusion, Assonance, Pun|Paronomasia, Rhetorical question, Repetition, Cliffhanger, Sarcasm',
      'Anaphora, Euphemism, Juxtaposition, Paradox, Analogy, Allegory, Understatement, Litotes, Metonymy, Synecdoche, Apostrophe, Consonance, Enjambment, Caesura, Chiasmus, Antithesis, Anticlimax|Bathos, Pathos, Motif, Dramatic irony, Red herring, Deus ex machina, Chekhov\'s gun, In medias res, Unreliable narrator, Stream of consciousness, Frame story|Frame narrative, Epiphany, Catharsis, Hubris, Hamartia|Tragic flaw, Malapropism, Spoonerism, Parody, Pastiche, Anachronism, Archetype, Epithet, Foil, Soliloquy, Monologue, Aside, Pathetic fallacy, Anthropomorphism, Tautology, Plot twist|Twist, MacGuffin, Breaking the fourth wall|Fourth wall, Exposition, Denouement|Dénouement, Sibilance, Refrain, Internal rhyme, Slant rhyme|Half rhyme|Near rhyme, Flash-forward|Prolepsis',
      'Zeugma, Polysyndeton, Asyndeton, Epistrophe|Epiphora, Anadiplosis, Pleonasm, Circumlocution|Periphrasis, Aposiopesis, Hendiadys, Transferred epithet|Hypallage, Antanaclasis, Syllepsis, Anastrophe, Hyperbaton, Antimetabole, Epizeuxis, Isocolon, Tricolon|Rule of three, Meiosis, Ekphrasis, Mise en abyme, Kenning, Objective correlative, Verisimilitude, Metafiction, Free indirect discourse|Free indirect speech, Interior monologue, Synaesthesia|Synesthesia, Cacophony, Euphony, Eye rhyme, Volta, Apophasis|Paralipsis, Hypophora, Ethos, Logos, Climax, Situational irony, Verbal irony, Rising action, Falling action',
      'Anthimeria, Catachresis, Merism, Antonomasia, Metalepsis, Tmesis, Polyptoton, Diacope, Symploce, Epanalepsis, Anacoluthon, Bdelygmia, Procatalepsis, Paraprosdokian, Adynaton, Auxesis',
    ],
  },
  {
    id: 'consoles',
    q: 'Name a video game console',
    tiers: [
      'PlayStation|PS1|PS One, Xbox, Nintendo Switch|Switch, Wii|Nintendo Wii, Game Boy|Gameboy',
      'PlayStation 2|PS2, PlayStation 3|PS3, PlayStation 4|PS4, PlayStation 5|PS5, Xbox 360, Xbox One, Nintendo 64|N64, Super Nintendo|SNES|Super NES|Super Famicom, NES|Nintendo Entertainment System|Famicom, Nintendo DS|DS, Atari 2600|Atari, Sega Genesis|Mega Drive|Genesis, GameCube|Nintendo GameCube, Nintendo Switch 2|Switch 2',
      'Xbox Series X|Series X|Xbox Series S|Series S, Wii U, Nintendo 3DS|3DS, Game Boy Advance|GBA, Game Boy Color|GBC, PSP|PlayStation Portable, PS Vita|PlayStation Vita|Vita, Sega Saturn|Saturn, Dreamcast|Sega Dreamcast, Master System|Sega Master System, Game Gear|Sega Game Gear, Steam Deck, Virtual Boy, Atari Jaguar|Jaguar, Atari Lynx|Lynx, Neo Geo, TurboGrafx-16|TurboGrafx|PC Engine, Intellivision, ColecoVision, Magnavox Odyssey|Odyssey, 3DO, Game & Watch|Game and Watch, Ouya, Sega CD|Mega-CD, Sega 32X|32X, Meta Quest|Oculus Quest, Atari 7800, Atari 5200, Vectrex, Nintendo 2DS|2DS',
      'CD-i|Philips CD-i, Amiga CD32|CD32, Neo Geo Pocket, WonderSwan, N-Gage|Nokia N-Gage, Gizmondo, Game.com|Tiger Game.com, Pippin|Apple Pippin, Sega Nomad|Nomad, Channel F|Fairchild Channel F, Astrocade|Bally Astrocade, Odyssey 2|Videopac, Atari XEGS|XEGS, PC-FX, Pokémon Mini|Pokemon Mini, Game Boy Micro, Nintendo DSi|DSi, New Nintendo 3DS, Evercade, Analogue Pocket, Playdate, Stadia|Google Stadia, ROG Ally|Asus ROG Ally, Legion Go|Lenovo Legion Go, PlayStation Portal, Famicom Disk System, 64DD|Nintendo 64DD',
      'FM Towns Marty, Sega Pico|Pico, Arcadia 2001|Emerson Arcadia, GX4000|Amstrad GX4000, C64GS|Commodore 64 Games System, Playdia, Casio Loopy|Loopy, Super Cassette Vision, Cassette Vision, Game Boy Light, PocketStation, Satellaview, Zeebo, HyperScan, GP32, GP2X, SG-1000, Sega Mark III|Mark III, Telstar|Coleco Telstar, Studio II|RCA Studio II, Adventure Vision, Microvision',
    ],
  },
  {
    id: 'dickens',
    q: 'Name a book by Charles Dickens',
    tiers: [
      'A Christmas Carol|Christmas Carol, Oliver Twist|Oliver, Great Expectations',
      'David Copperfield, A Tale of Two Cities|Tale of Two Cities, Bleak House, Hard Times',
      'Nicholas Nickleby, Little Dorrit, The Pickwick Papers|Pickwick Papers|Pickwick, Our Mutual Friend, The Old Curiosity Shop|Old Curiosity Shop',
      'Dombey and Son, Martin Chuzzlewit, The Mystery of Edwin Drood|Edwin Drood, Barnaby Rudge',
      'The Chimes|Chimes, The Cricket on the Hearth|Cricket on the Hearth, The Battle of Life|Battle of Life, The Haunted Man|Haunted Man, Sketches by Boz, Pictures from Italy, American Notes, A Child\'s History of England, The Uncommercial Traveller, The Signal-Man|The Signalman, Mugby Junction, The Life of Our Lord, Master Humphrey\'s Clock, The Mudfog Papers, No Thoroughfare, Hunted Down, George Silverman\'s Explanation, Holiday Romance, The Frozen Deep',
    ],
  },
];
