// Screen: films, television, their makers and their characters.

export default [
  {
    id: 'films',
    q: 'Name a film',
    tiers: [
      'Titanic, The Godfather|Godfather, Star Wars, Jaws, Avatar, The Lion King|Lion King, Forrest Gump, Jurassic Park, Home Alone, Casablanca',
      'The Wizard of Oz|Wizard of Oz, Gone with the Wind, E.T.|ET|E.T. the Extra-Terrestrial, Back to the Future, The Matrix, Pulp Fiction, The Shawshank Redemption|Shawshank, Gladiator, Rocky, Grease, Frozen, Toy Story, Inception, The Dark Knight, Top Gun, Pretty Woman, Ghostbusters, Psycho, Barbie, Oppenheimer',
      "Citizen Kane, Schindler's List|Schindlers List, Raiders of the Lost Ark|Indiana Jones, Goodfellas, Fight Club, Alien, The Terminator|Terminator, Die Hard, The Sound of Music, Mary Poppins, Some Like It Hot, Taxi Driver, Apocalypse Now, The Exorcist, The Silence of the Lambs, Saving Private Ryan, Braveheart, Dirty Dancing, Ghost, Notting Hill, Love Actually, Mean Girls, The Truman Show, Parasite, La La Land, Dune, Interstellar, Avengers Endgame|Endgame, The Notebook",
      "Lawrence of Arabia, Ben-Hur|Ben Hur, Vertigo, Rear Window, North by Northwest, Singin' in the Rain|Singing in the Rain, Sunset Boulevard, Chinatown, One Flew Over the Cuckoo's Nest|Cuckoos Nest, Annie Hall, Raging Bull, Blade Runner, The Shining, Amadeus, Rain Man, The Usual Suspects, Se7en|Seven, Fargo, Trainspotting, Amélie|Amelie, Memento, No Country for Old Men, There Will Be Blood, The Social Network, Whiplash, Moonlight, Get Out, Everything Everywhere All at Once, Casino Royale, Goldfinger",
      "Metropolis, Nosferatu, The Seventh Seal, Bicycle Thieves, Rashomon, Seven Samurai, Tokyo Story, La Dolce Vita, The 400 Blows|400 Blows, Breathless, Battleship Potemkin, Persona, Stalker, Solaris, Do the Right Thing, Badlands, Days of Heaven, Brief Encounter, The Third Man, Kind Hearts and Coronets, The Red Shoes, A Matter of Life and Death, Withnail and I, Local Hero, Kes, Fitzcarraldo, Wings of Desire, In the Mood for Love, Mulholland Drive, Pan's Labyrinth|Pans Labyrinth, Cinema Paradiso, Ikiru",
    ],
  },
  {
    id: 'film-directors',
    q: 'Name a film director',
    people: true,
    tiers: [
      'Spielberg|Steven Spielberg, Hitchcock|Alfred Hitchcock, Scorsese|Martin Scorsese, Tarantino|Quentin Tarantino, Nolan|Christopher Nolan, Kubrick|Stanley Kubrick',
      'Francis Ford Coppola|Coppola, George Lucas|Lucas, James Cameron|Cameron, Ridley Scott, Tim Burton|Burton, Peter Jackson, Wes Anderson, Kurosawa|Akira Kurosawa, Chaplin|Charlie Chaplin, Woody Allen, Spike Lee, Greta Gerwig|Gerwig, Denis Villeneuve|Villeneuve, David Fincher|Fincher, Guillermo del Toro|Del Toro',
      'Orson Welles|Welles, Billy Wilder|Wilder, John Ford, Fellini|Federico Fellini, Bergman|Ingmar Bergman, David Lynch|Lynch, Coen brothers|Coens|Joel Coen|Ethan Coen, Spike Jonze, Sofia Coppola, Paul Thomas Anderson, Bong Joon-ho|Bong Joon Ho, Miyazaki|Hayao Miyazaki, Ang Lee, Danny Boyle, Guy Ritchie, Sam Mendes, Jordan Peele|Peele, Kathryn Bigelow|Bigelow, Ron Howard, Clint Eastwood|Eastwood, Mel Brooks, John Carpenter|Carpenter, Wes Craven|Craven, Zack Snyder, Taika Waititi|Waititi, Barry Jenkins, Damien Chazelle|Chazelle, Alfonso Cuarón|Cuaron, Iñárritu|Inarritu|Alejandro Gonzalez Inarritu',
      'Godard|Jean-Luc Godard, Truffaut|Francois Truffaut, Antonioni, Visconti, Rossellini, De Sica|Vittorio De Sica, Pasolini, Sergio Leone|Leone, Bertolucci, Buñuel|Bunuel|Luis Bunuel, Almodóvar|Almodovar|Pedro Almodovar, Polanski, Herzog|Werner Herzog, Fassbinder, Wenders|Wim Wenders, Fritz Lang|Lang, Murnau, Eisenstein, Tarkovsky, Ozu|Yasujiro Ozu, Mizoguchi, Wong Kar-wai, Zhang Yimou, Satyajit Ray, Kieślowski|Kieslowski, Haneke|Michael Haneke, Lars von Trier|Von Trier, Mike Leigh, Ken Loach|Loach, David Lean|Lean, Michael Powell|Powell, Pressburger|Emeric Pressburger, Carol Reed, Terrence Malick|Malick, Robert Altman|Altman, Cronenberg|David Cronenberg',
      'DW Griffith|D.W. Griffith|Griffith, Buster Keaton|Keaton, Von Stroheim|Erich von Stroheim, Lubitsch|Ernst Lubitsch, Frank Capra|Capra, Howard Hawks|Hawks, Preston Sturges|Sturges, Douglas Sirk|Sirk, Nicholas Ray, Elia Kazan|Kazan, Agnès Varda|Agnes Varda|Varda, Chantal Akerman|Akerman, Jacques Tati|Tati, Robert Bresson|Bresson, Jean Renoir, Carl Dreyer|Dreyer, Abbas Kiarostami|Kiarostami, Hou Hsiao-hsien, Edward Yang, Apichatpong Weerasethakul|Apichatpong, Béla Tarr|Bela Tarr, Claire Denis, Jane Campion|Campion, Lynne Ramsay, Kelly Reichardt|Reichardt',
    ],
  },
  {
    id: 'actors',
    q: 'Name a male film actor',
    people: true,
    tiers: [
      'Tom Hanks|Hanks, Brad Pitt|Pitt, Leonardo DiCaprio|DiCaprio|Leo, Tom Cruise|Cruise, Johnny Depp|Depp, Will Smith, Robert De Niro|De Niro, Morgan Freeman|Freeman',
      'Al Pacino|Pacino, Denzel Washington|Denzel, Marlon Brando|Brando, Jack Nicholson|Nicholson, Harrison Ford, Arnold Schwarzenegger|Schwarzenegger|Arnie, Keanu Reeves|Keanu, George Clooney|Clooney, Matt Damon|Damon, Robert Downey Jr|Downey, Dwayne Johnson|The Rock, Sylvester Stallone|Stallone, Clint Eastwood|Eastwood, Samuel L Jackson|Samuel L. Jackson, Ryan Gosling|Gosling, Cillian Murphy',
      "Humphrey Bogart|Bogart, James Dean, Cary Grant, Paul Newman, Robert Redford|Redford, Dustin Hoffman, Anthony Hopkins|Hopkins, Daniel Day-Lewis|Day-Lewis, Christian Bale|Bale, Hugh Grant, Jim Carrey|Carrey, Robin Williams, Bruce Willis|Willis, Mel Gibson, Russell Crowe, Joaquin Phoenix|Phoenix, Matthew McConaughey|McConaughey, Timothée Chalamet|Timothee Chalamet|Chalamet, Chris Hemsworth|Hemsworth, Ryan Reynolds, Hugh Jackman|Jackman, Sean Connery|Connery, Michael Caine, Daniel Craig, Eddie Murphy, Jackie Chan, Bruce Lee, Adam Sandler|Sandler, Ben Stiller, Steve Carell, Idris Elba, Benedict Cumberbatch|Cumberbatch, Tom Hardy, Gary Oldman|Oldman, Kevin Costner, Pedro Pascal",
      "John Wayne, James Stewart|Jimmy Stewart, Gregory Peck, Henry Fonda, Gene Kelly, Fred Astaire, Charlton Heston|Heston, Sidney Poitier|Poitier, Steve McQueen, Peter O'Toole, Richard Burton, Laurence Olivier|Olivier, Alec Guinness|Guinness, Gene Hackman|Hackman, Robert Duvall|Duvall, Jeff Bridges, Kevin Spacey, Philip Seymour Hoffman, Ralph Fiennes|Fiennes, Colin Firth, Ewan McGregor, Javier Bardem|Bardem, Antonio Banderas|Banderas, Gérard Depardieu|Gerard Depardieu|Depardieu, Toshiro Mifune|Mifune, Mads Mikkelsen|Mikkelsen, Forest Whitaker, Mahershala Ali, Viggo Mortensen, Willem Dafoe|Dafoe",
      'Charlie Chaplin, Buster Keaton, Rudolph Valentino|Valentino, Clark Gable|Gable, Spencer Tracy, Errol Flynn, Orson Welles, Burt Lancaster, Kirk Douglas, Montgomery Clift, Lee Marvin, Yul Brynner, Marcello Mastroianni|Mastroianni, Alain Delon|Delon, Jean-Paul Belmondo|Belmondo, Max von Sydow, Klaus Kinski|Kinski, Bela Lugosi|Lugosi, Boris Karloff|Karloff, Vincent Price, Peter Lorre, Christopher Lee, Peter Cushing, Dirk Bogarde, Shah Rukh Khan|SRK, Amitabh Bachchan',
    ],
  },
  {
    id: 'actresses',
    q: 'Name a film actress',
    people: true,
    tiers: [
      'Marilyn Monroe|Monroe, Meryl Streep|Streep, Julia Roberts, Audrey Hepburn, Angelina Jolie|Jolie, Jennifer Lawrence, Nicole Kidman|Kidman, Scarlett Johansson|Johansson',
      'Sandra Bullock|Bullock, Emma Stone, Natalie Portman|Portman, Kate Winslet|Winslet, Cate Blanchett|Blanchett, Margot Robbie, Anne Hathaway|Hathaway, Jennifer Aniston|Aniston, Keira Knightley|Knightley, Emma Watson, Halle Berry, Zendaya, Judi Dench|Dench, Helen Mirren|Mirren, Elizabeth Taylor, Grace Kelly',
      'Katharine Hepburn, Bette Davis, Ingrid Bergman, Vivien Leigh, Judy Garland, Julie Andrews, Sophia Loren|Loren, Brigitte Bardot|Bardot, Jane Fonda, Diane Keaton, Sigourney Weaver, Jodie Foster, Michelle Pfeiffer|Pfeiffer, Gwyneth Paltrow|Paltrow, Charlize Theron|Theron, Reese Witherspoon|Witherspoon, Viola Davis, Frances McDormand|McDormand, Emma Thompson, Glenn Close, Kristen Stewart, Florence Pugh, Saoirse Ronan|Ronan, Jamie Lee Curtis, Michelle Yeoh|Yeoh, Penélope Cruz|Penelope Cruz, Salma Hayek|Hayek, Whoopi Goldberg, Drew Barrymore, Cameron Diaz',
      "Greta Garbo|Garbo, Marlene Dietrich|Dietrich, Joan Crawford, Lauren Bacall|Bacall, Rita Hayworth|Hayworth, Ava Gardner, Doris Day, Kim Novak, Natalie Wood, Shirley MacLaine, Faye Dunaway, Julie Christie, Maggie Smith, Vanessa Redgrave, Isabelle Huppert|Huppert, Catherine Deneuve|Deneuve, Juliette Binoche|Binoche, Marion Cotillard|Cotillard, Tilda Swinton|Swinton, Julianne Moore, Olivia Colman|Colman, Rachel Weisz, Anya Taylor-Joy, Lupita Nyong'o, Gong Li, Aishwarya Rai, Priyanka Chopra",
      'Mary Pickford, Lillian Gish, Louise Brooks, Clara Bow, Gloria Swanson, Jean Harlow, Mae West, Barbara Stanwyck|Stanwyck, Olivia de Havilland, Joan Fontaine, Myrna Loy, Carole Lombard, Claudette Colbert, Ginger Rogers, Anna Magnani, Giulietta Masina, Liv Ullmann, Jeanne Moreau, Anna Karina, Simone Signoret, Hanna Schygulla, Gena Rowlands, Setsuko Hara, Monica Vitti',
    ],
  },
  {
    id: 'tv-shows',
    q: 'Name a television series',
    tiers: [
      'Friends, The Simpsons, Game of Thrones, Breaking Bad, Stranger Things, The Office, Doctor Who, Seinfeld',
      "The Sopranos, Grey's Anatomy|Greys Anatomy, Lost, The Crown, Sherlock, Mad Men, The Walking Dead, Squid Game, Succession, Peaky Blinders, Downton Abbey, Coronation Street, EastEnders, Frasier, Cheers, Family Guy, South Park, Glee, Sex and the City, How I Met Your Mother, The Big Bang Theory",
      'The Wire, Fawlty Towers, Only Fools and Horses, Blackadder, The X-Files, Twin Peaks, The West Wing, ER, 24, Dexter, Homeland, Mr Bean, Top Gear, Black Mirror, The Mandalorian, The Bear, Ted Lasso, Fleabag, The Last of Us, Wednesday, Bridgerton, Better Call Saul, Buffy the Vampire Slayer|Buffy, Gilmore Girls, Scrubs, Brooklyn Nine-Nine|Brooklyn 99, Parks and Recreation|Parks and Rec, Arrested Development, The Good Place, Euphoria, Ozark, Line of Duty, The Boys, Severance',
      'M*A*S*H|MASH, I Love Lucy, The Twilight Zone, Columbo, Dallas, Dynasty, Neighbours, Home and Away, Baywatch, Knight Rider, The A-Team, Miami Vice, Cagney and Lacey, Magnum PI|Magnum, Hill Street Blues, The Golden Girls, Happy Days, Taxi, Boardwalk Empire, Deadwood, Six Feet Under, Oz, Battlestar Galactica, Firefly, Veep, Curb Your Enthusiasm, Atlanta, The Thick of It, Spaced, The IT Crowd, Father Ted, Gavin and Stacey, Derry Girls, Shameless, Skins, Luther, Happy Valley',
      "The Prisoner, Steptoe and Son, Dad's Army|Dads Army, Porridge, Yes Minister, Monty Python's Flying Circus|Monty Python, The Good Life, Rising Damp, Red Dwarf, Northern Exposure, St Elsewhere|St. Elsewhere, Quantum Leap, Moonlighting, Thirtysomething, My So-Called Life, Freaks and Geeks, Party Down, Treme, The Leftovers, Halt and Catch Fire, Rectify, Borgen, The Killing|Forbrydelsen, The Bridge|Bron, Spiral|Engrenages, Gomorrah, Detectorists, Peep Show, I'm Alan Partridge|Im Alan Partridge, The League of Gentlemen",
    ],
  },
  {
    id: 'cartoon-characters',
    q: 'Name a cartoon character',
    tiers: [
      'Mickey Mouse|Mickey, Bugs Bunny, Homer Simpson, SpongeBob SquarePants|SpongeBob, Scooby-Doo|Scooby Doo|Scooby, Tom|Tom Cat, Jerry|Jerry Mouse, Donald Duck, Bart Simpson, Fred Flintstone',
      'Daffy Duck|Daffy, Porky Pig|Porky, Tweety|Tweety Pie|Tweety Bird, Sylvester, Road Runner|Roadrunner, Wile E. Coyote|Wile E Coyote, Goofy, Pluto, Minnie Mouse|Minnie, Popeye, Garfield, Snoopy, Charlie Brown, Pink Panther, Winnie the Pooh|Pooh, Peter Griffin, Shaggy, Yogi Bear|Yogi, Patrick Star, Elmer Fudd, Peppa Pig|Peppa, Barney Rubble, Woody Woodpecker, Felix the Cat|Felix, Betty Boop, Lisa Simpson, Marge Simpson',
      'Stewie Griffin|Stewie, Eric Cartman|Cartman, Kenny McCormick, Rick Sanchez, Morty Smith|Morty, Bluey, Dora the Explorer|Dora, Speedy Gonzales, Foghorn Leghorn, Pepé Le Pew|Pepe Le Pew, Marvin the Martian, Taz|Tasmanian Devil, Yosemite Sam, Huckleberry Hound, Top Cat, Boo-Boo|Boo Boo, Wilma Flintstone, Dino, George Jetson, Velma, Daphne, Scrappy-Doo|Scrappy Doo, Squidward, Mr. Krabs|Mr Krabs, Sandy Cheeks, Plankton, Inspector Gadget, Danger Mouse, Count Duckula, He-Man, Skeletor, She-Ra, Optimus Prime',
      'Dick Dastardly, Muttley, Penelope Pitstop, Hong Kong Phooey, Captain Caveman, Snagglepuss, Quick Draw McGraw, Augie Doggie, Secret Squirrel, Atom Ant, Deputy Dawg, Mighty Mouse, Bullwinkle, Rocky the Flying Squirrel|Rocky, Dudley Do-Right, Mr. Magoo|Mr Magoo, Droopy, Gumby, Johnny Bravo, Courage the Cowardly Dog, Samurai Jack, Hey Arnold|Arnold, Daria, Beavis, Butt-Head|Butthead, Hank Hill, Bob Belcher, Bender, Philip J. Fry|Fry, Leela|Turanga Leela, Zoidberg, Roger Rabbit, Jessica Rabbit',
      "Gertie the Dinosaur|Gertie, Oswald the Lucky Rabbit|Oswald, Koko the Clown, Krazy Kat, Space Ghost, Jonny Quest, Wally Gator, Touché Turtle|Touche Turtle, Lippy the Lion, Peter Potamus, Magilla Gorilla, Ricochet Rabbit, Chilly Willy, Andy Panda, Tom Slick, George of the Jungle, Super Chicken, Underdog, Roobarb, Bagpuss, Captain Pugwash, Noggin the Nog, SuperTed, Henry's Cat|Henrys Cat",
    ],
  },
  {
    id: 'villains',
    q: 'Name a fictional villain',
    tiers: [
      'Darth Vader|Vader, The Joker|Joker, Voldemort|Lord Voldemort, Dracula|Count Dracula, Hannibal Lecter|Hannibal, Thanos, Scar, Cruella de Vil|Cruella',
      'Lex Luthor|Luthor, Sauron, Freddy Krueger|Freddy, Jason Voorhees, Michael Myers, Norman Bates, Captain Hook, Ursula, Maleficent, Jafar, Wicked Witch of the West|Wicked Witch, Moriarty|Professor Moriarty, Blofeld|Ernst Stavro Blofeld, Magneto, Green Goblin, Loki, Bane, Pennywise, Palpatine|Emperor Palpatine|Darth Sidious, Hans Gruber, The Terminator|Terminator, Agent Smith, Shere Khan, Gaston',
      "Nurse Ratched|Ratched, HAL 9000|HAL, Annie Wilkes, Anton Chigurh|Chigurh, Dr. Evil|Dr Evil, Dr. No|Dr No, Goldfinger, Oddjob, Khan, The Penguin|Penguin, The Riddler|Riddler, Catwoman, Two-Face, Harley Quinn, Poison Ivy, Doctor Octopus|Doc Ock, Venom, Doctor Doom|Dr Doom, Ultron, Red Skull, Kingpin, General Zod|Zod, Bellatrix Lestrange|Bellatrix, Dolores Umbridge|Umbridge, Saruman, Sheriff of Nottingham, Mrs Danvers, Patrick Bateman, Jack Torrance, Chucky, Leatherface, Ghostface, Pinhead, Hades, Mother Gothel, Queen of Hearts, The Evil Queen|Evil Queen, Judge Frollo|Frollo, Bowser, Ganondorf|Ganon, Dr. Robotnik|Robotnik|Dr Eggman|Eggman",
      'Iago, Fagin, Bill Sikes, Uriah Heep, Count Olaf, Professor Ratigan|Ratigan, Long John Silver, Mr Hyde|Hyde, Big Brother, Cersei Lannister|Cersei, Joffrey, Ramsay Bolton, The Night King|Night King, Davros, The Master, Daleks, Cybermen, Skeletor, Megatron, Shredder, Mumm-Ra, Cobra Commander, Gargamel, Dick Dastardly, Syndrome, Lotso, Hopper, Randall, Prince John, Madame Medusa, Rasputin, Lord Farquaad|Farquaad, Lord Business, Miss Trunchbull|Trunchbull, The Grand High Witch|Grand High Witch, Child Catcher',
      'Keyser Söze|Keyser Soze, Harry Lime, Hans Landa|Landa, Amon Göth|Amon Goth, Frank Booth, Alex DeLarge, Max Cady, Gordon Gekko|Gekko, Bill the Butcher, Roy Batty, Mr. Blonde|Mr Blonde, Captain Vidal, Colonel Kurtz|Kurtz, Calvin Candie, Mr. Potter|Mr Potter|Henry F Potter, Baron Harkonnen|Harkonnen, Prince Humperdinck|Humperdinck, Vizzini, Gozer, Zorg, Clarence Boddicker',
    ],
  },
  {
    id: 'detectives',
    q: 'Name a fictional detective',
    tiers: [
      'Sherlock Holmes|Holmes|Sherlock, Hercule Poirot|Poirot, Miss Marple|Marple|Jane Marple, Columbo|Lieutenant Columbo, Inspector Clouseau|Clouseau',
      'Nancy Drew, The Hardy Boys|Hardy Boys, Philip Marlowe|Marlowe, Sam Spade, Inspector Morse|Morse|Endeavour Morse, Dirty Harry|Harry Callahan, Jessica Fletcher, Dick Tracy, Inspector Gadget, Batman, Father Brown, Jack Reacher|Reacher, Inspector Rebus|Rebus|John Rebus, Inspector Lewis|Lewis, Kojak, Magnum|Thomas Magnum, John Luther|Luther, Veronica Mars, Ace Ventura',
      'Lord Peter Wimsey|Wimsey, Maigret|Inspector Maigret, Nero Wolfe, Ellery Queen, Perry Mason, Kinsey Millhone, VI Warshawski|V.I. Warshawski|Warshawski, Kurt Wallander|Wallander, Harry Bosch|Bosch, Alex Cross, Lincoln Rhyme, Mma Ramotswe|Precious Ramotswe, Adam Dalgliesh|Dalgliesh, Jack Frost|Inspector Frost, Jane Tennison|Tennison, Vera Stanhope|Vera, Cormoran Strike|Strike, Rust Cohle, Marty Hart, Jimmy McNulty|McNulty, Lennie Briscoe|Briscoe, Olivia Benson, Adrian Monk|Monk, Shawn Spencer, Temperance Brennan|Bones, Patrick Jane, Richard Castle|Castle, Jake Peralta|Peralta, Jackson Brodie, Jimmy Perez, Tom Barnaby|Barnaby, Hamish Macbeth, Inspector Lynley|Lynley, Dalziel, Pascoe, Brother Cadfael|Cadfael',
      'C. Auguste Dupin|Auguste Dupin|Dupin, Sergeant Cuff, Inspector Bucket, Tommy and Tuppence|Tuppence, Albert Campion|Campion, Roderick Alleyn|Alleyn, Lew Archer, Mike Hammer, The Continental Op, Nick Charles|Nick and Nora Charles, Philo Vance, Charlie Chan, Mr. Moto|Mr Moto, Judge Dee, Easy Rawlins, Spenser, Travis McGee, Lucas Davenport, Montalbano|Inspector Montalbano, Brunetti|Commissario Brunetti, Martin Beck, Erlendur, Harry Hole, Lisbeth Salander|Salander, Mikael Blomkvist|Blomkvist, Arkady Renko|Renko, Bernie Gunther, Sarah Lund, Saga Norén|Saga Noren, Phryne Fisher|Miss Fisher',
      'Cordelia Gray, Inspector Ghote, Gideon Fell|Dr Gideon Fell, Sir Henry Merrivale, Martin Hewitt, Dr. Thorndyke|Thorndyke, Max Carrados, The Old Man in the Corner, Hildegarde Withers, Inspector Japp|Japp, Inspector Lestrade|Lestrade, Inspector Appleby, Nigel Strangeways, Inspector Wexford|Wexford, Alan Banks|Inspector Banks, Charlie Resnick|Resnick, Dave Robicheaux|Robicheaux, Elvis Cole, Matthew Scudder|Scudder, Kay Scarpetta|Scarpetta, Stephanie Plum',
    ],
  },
  {
    id: 'animated-films',
    q: 'Name an animated feature film',
    tiers: [
      'Toy Story, The Lion King|Lion King, Frozen, Shrek, Finding Nemo, Snow White and the Seven Dwarfs|Snow White, Aladdin, Beauty and the Beast, Cinderella',
      "Up, Cars, Monsters Inc|Monsters Inc., The Incredibles|Incredibles, Coco, Inside Out, Moana, Tangled, Zootopia|Zootropolis, WALL-E|Wall-E, Ratatouille, Despicable Me, Minions, Kung Fu Panda, Ice Age, Madagascar, The Little Mermaid, Bambi, Dumbo, Pinocchio, The Jungle Book, Spirited Away, Encanto, Peter Pan",
      "My Neighbor Totoro|My Neighbour Totoro|Totoro, Princess Mononoke, Howl's Moving Castle|Howls Moving Castle, Kiki's Delivery Service|Kikis Delivery Service, Ponyo, The Iron Giant, Fantasia, Sleeping Beauty, Lady and the Tramp, 101 Dalmatians|One Hundred and One Dalmatians, The Aristocats, Robin Hood, Mulan, Pocahontas, Hercules, Tarzan, Lilo and Stitch|Lilo & Stitch, The Emperor's New Groove|Emperors New Groove, Brave, Big Hero 6, Wreck-It Ralph, Soul, Luca, Turning Red, How to Train Your Dragon, Spider-Man Into the Spider-Verse|Into the Spider-Verse, The Lego Movie, Chicken Run, Wallace and Gromit The Curse of the Were-Rabbit|Curse of the Were-Rabbit, Coraline, Happy Feet, A Bug's Life|Bugs Life, The Princess and the Frog, The Polar Express, Antz, The Prince of Egypt, Anastasia, Akira",
      'The Hunchback of Notre Dame, Oliver and Company, The Fox and the Hound, The Rescuers, The Great Mouse Detective, The Black Cauldron, The Sword in the Stone, Atlantis The Lost Empire|Atlantis, Treasure Planet, Brother Bear, Meet the Robinsons, Raya and the Last Dragon, Onward, The Good Dinosaur, Flushed Away, Corpse Bride, The Nightmare Before Christmas, Fantastic Mr Fox, Isle of Dogs, Kubo and the Two Strings, ParaNorman, Paprika, Grave of the Fireflies, Castle in the Sky|Laputa, Nausicaä of the Valley of the Wind|Nausicaa, Porco Rosso, The Wind Rises, Your Name, Persepolis, The Triplets of Belleville, Song of the Sea, Wolfwalkers, Klaus, Watership Down, The Land Before Time, An American Tail, The Last Unicorn, Yellow Submarine',
      'The Adventures of Prince Achmed|Prince Achmed, Fritz the Cat, The Plague Dogs, The Thief and the Cobbler, Fantastic Planet|La Planete sauvage, Belladonna of Sadness, Ghost in the Shell, Perfect Blue, Millennium Actress, Tokyo Godfathers, Wolf Children, A Silent Voice, Mary and Max, Waltz with Bashir, Ernest and Celestine, The Illusionist, Mind Game, Tekkonkinkreet, Mirai, Flow, The Boy and the Heron, Anomalisa, My Life as a Zucchini, I Lost My Body, The Red Turtle, Loving Vincent',
    ],
  },
  {
    id: 'horror-films',
    q: 'Name a horror film',
    tiers: [
      'The Exorcist, Halloween, Psycho, The Shining, Scream, A Nightmare on Elm Street|Nightmare on Elm Street, Friday the 13th, It',
      "The Texas Chain Saw Massacre|Texas Chainsaw Massacre, Saw, The Conjuring, Get Out, Paranormal Activity, The Ring|Ringu, The Blair Witch Project|Blair Witch, Hereditary, The Omen, Night of the Living Dead, Carrie, Poltergeist, Rosemary's Baby|Rosemarys Baby, The Thing, Child's Play|Childs Play, Annabelle, Insidious, Us, A Quiet Place, Final Destination",
      "Midsommar, The Babadook, It Follows, The Witch, Hellraiser, The Evil Dead|Evil Dead, An American Werewolf in London, The Fly, Jacob's Ladder|Jacobs Ladder, The Sixth Sense, The Others, 28 Days Later, Dawn of the Dead, Candyman, The Descent, Let the Right One In, The Wicker Man, Don't Look Now|Dont Look Now, The Amityville Horror, Pet Sematary, Misery, Cujo, The Cabin in the Woods, Train to Busan, Smile, Barbarian, Nope, Talk to Me, Sinister, The Purge, Hostel, The Hills Have Eyes, Suspiria, The Birds, M3GAN|Megan, Terrifier, Pearl",
      "Audition, Ju-On|The Grudge, Dark Water, The Orphanage, REC, Martyrs, High Tension, Funny Games, The Devil's Backbone|Devils Backbone, The Changeling, The Innocents, The Haunting, Black Christmas, Phantasm, The Hitcher, Re-Animator, Videodrome, Scanners, The Brood, Braindead|Dead Alive, The Mist, The Lighthouse, The Fog, In the Mouth of Madness, Session 9, Ginger Snaps, Event Horizon, Ready or Not, Host, Relic, Saint Maud, His House, Raw",
      'The Cabinet of Dr. Caligari|Cabinet of Dr Caligari|Caligari, Vampyr, Freaks, Island of Lost Souls, Cat People, I Walked with a Zombie, Eyes Without a Face, Les Diaboliques|Diabolique, Peeping Tom, Kwaidan, Onibaba, Kuroneko, Carnival of Souls, The Tenant, Deep Red|Profondo Rosso, The Beyond, Tenebrae, Hausu|House, Lake Mungo, Kill List, A Field in England, The Wailing, Pulse|Kairo, Cure, Noroi',
    ],
  },
  {
    id: 'scifi-films',
    q: 'Name a science fiction film',
    tiers: [
      'Star Wars, The Matrix, Avatar, Alien, E.T.|ET|E.T. the Extra-Terrestrial, Back to the Future, Jurassic Park, The Terminator|Terminator',
      '2001 A Space Odyssey|2001, Blade Runner, Inception, Interstellar, Dune, Close Encounters of the Third Kind|Close Encounters, Independence Day, Men in Black, Gravity, The Martian, Planet of the Apes, Star Trek, Total Recall, RoboCop, Predator, Arrival, Ex Machina, Minority Report, Tron, The Fifth Element, Aliens, Terminator 2|T2|Judgment Day',
      "A Clockwork Orange, Metropolis, Gattaca, District 9, Edge of Tomorrow, Looper, Her, Moon, Children of Men, Contact, Starship Troopers, The Day the Earth Stood Still, War of the Worlds, Invasion of the Body Snatchers, Armageddon, Deep Impact, Mad Max|Mad Max Fury Road|Fury Road, Snowpiercer, Elysium, Oblivion, Annihilation, Sunshine, Serenity, Galaxy Quest, Cocoon, Tenet, Ready Player One, I Robot, Pacific Rim, Godzilla, Cloverfield, Super 8, Logan's Run|Logans Run, Soylent Green, Westworld, The Abyss, Dredd|Judge Dredd, Escape from New York, They Live, Brazil",
      'Forbidden Planet, The Andromeda Strain, Silent Running, THX 1138, Alphaville, La Jetée|La Jetee, Fahrenheit 451, Things to Come, Barbarella, Dark Star, Outland, Enemy Mine, The Black Hole, Flash Gordon, Primer, Coherence, Under the Skin, Ad Astra, High Life, Prometheus, Valerian, Chronicle, Source Code, Zardoz, Rollerball, Altered States, eXistenZ|Existenz, Dark City, Pitch Black, Strange Days, 12 Monkeys|Twelve Monkeys, Stalker, Solaris',
      'A Trip to the Moon|Le Voyage dans la Lune, Aelita, Woman in the Moon|Frau im Mond, Destination Moon, When Worlds Collide, The Thing from Another World, It Came from Outer Space, Them, This Island Earth, The Incredible Shrinking Man, Plan 9 from Outer Space|Plan 9, Village of the Damned, Quatermass and the Pit, The Day the Earth Caught Fire, Seconds, Fantastic Voyage, Colossus The Forbin Project, The Man Who Fell to Earth, Liquid Sky, Repo Man, Tetsuo, Sleeper, Idiocracy, Sorry to Bother You, Possessor',
    ],
  },
  {
    id: 'video-games',
    q: 'Name a video game',
    tiers: [
      'Minecraft, Tetris, Fortnite, Super Mario Bros|Super Mario, Pac-Man|Pacman, Grand Theft Auto|GTA, Call of Duty, Pokémon|Pokemon, The Sims',
      "Space Invaders, Pong, Doom, The Legend of Zelda|Zelda, Sonic the Hedgehog|Sonic, Street Fighter, Mortal Kombat, FIFA|EA Sports FC, Halo, World of Warcraft|WoW, Animal Crossing, Mario Kart, Candy Crush|Candy Crush Saga, Angry Birds, Roblox, Among Us, Overwatch, League of Legends, Red Dead Redemption, The Last of Us, Elden Ring, Donkey Kong",
      "Final Fantasy, Skyrim, Fallout, Half-Life, Portal, BioShock, Assassin's Creed|Assassins Creed, Uncharted, God of War, Resident Evil, Metal Gear Solid|Metal Gear, Tomb Raider, Crash Bandicoot, Spyro, Super Smash Bros|Smash Bros, Counter-Strike, StarCraft, Diablo, Civilization, SimCity, Age of Empires, Guitar Hero, Rocket League, Apex Legends, Valorant, Dota 2|Dota, Destiny, Gears of War, Mass Effect, The Witcher, Cyberpunk 2077|Cyberpunk, Stardew Valley, Hollow Knight, Celeste, Undertale, Hades, Baldur's Gate|Baldurs Gate, Dark Souls, Splatoon, Kirby, Metroid, Asteroids, Frogger, Galaga",
      'Myst, Lemmings, Worms, Prince of Persia, The Secret of Monkey Island|Monkey Island, Grim Fandango, Deus Ex, System Shock, Thief, Quake, Unreal Tournament, Wolfenstein, Duke Nukem, Command and Conquer, Warcraft, Theme Hospital, RollerCoaster Tycoon, Banjo-Kazooie, GoldenEye 007|GoldenEye, Chrono Trigger, EarthBound, Castlevania, Mega Man, Contra, Shadow of the Colossus, Okami, Journey, Braid, Limbo, Disco Elysium, Outer Wilds, Return of the Obra Dinn, Papers Please, Factorio, Terraria, Kingdom Hearts',
      'Spacewar, Tennis for Two, Colossal Cave Adventure, Zork, Rogue, Elite, Manic Miner, Jet Set Willy, Chuckie Egg, Knight Lore, Pitfall, Missile Command, Defender, Robotron 2084|Robotron, Tempest, Dig Dug, Q*bert|Qbert, Joust, Paperboy, Marble Madness, Gauntlet, Bubble Bobble, R-Type, OutRun|Out Run, Ultima, Wizardry, Dwarf Fortress, NetHack',
    ],
  },
  {
    id: 'game-characters',
    q: 'Name a video game character',
    tiers: [
      'Mario, Luigi, Sonic, Pac-Man|Pacman, Link, Princess Peach|Peach, Pikachu, Lara Croft',
      'Bowser, Donkey Kong, Yoshi, Princess Zelda|Zelda, Master Chief, Kirby, Tails, Knuckles, Steve, Kratos, Samus Aran|Samus, Toad, Wario, Waluigi, Crash Bandicoot|Crash, Spyro, Solid Snake|Snake, Cloud Strife|Cloud, Ganondorf|Ganon, Dr. Robotnik|Robotnik|Dr Eggman|Eggman, Mega Man, Ryu, Chun-Li, Sub-Zero, Scorpion, Creeper, Geralt|Geralt of Rivia',
      'Nathan Drake, Ellie, Joel, Arthur Morgan, John Marston, Ezio|Ezio Auditore, Altaïr|Altair, Gordon Freeman, GLaDOS, Sephiroth, Aerith, Tifa, Commander Shepard, Leon Kennedy, Jill Valentine, Chris Redfield, Marcus Fenix, Rayman, Sackboy, Ratchet, Clank, Jak, Daxter, Sly Cooper, Banjo, Kazooie, Diddy Kong, King Dedede, Meta Knight, Fox McCloud, Ness, Captain Falcon, Isabelle, Tom Nook, Pyramid Head, Big Boss, Dante, Bayonetta, Aloy, Trevor Philips, CJ|Carl Johnson, Niko Bellic, Tommy Vercetti, Cortana, Agent 47',
      'Earthworm Jim, Gex, Croc, Dizzy, Miner Willy, Guybrush Threepwood|Guybrush, LeChuck, Manny Calavera, Duke Nukem, BJ Blazkowicz|B.J. Blazkowicz, Doomguy|Doom Slayer, Alucard, Simon Belmont, Professor Layton, Phoenix Wright, Ryu Hayabusa, Kazuya, Heihachi, Akuma, Ken Masters, Guile, Blanka, Zangief, M. Bison|M Bison, Liu Kang, Raiden, Johnny Cage, Sonya Blade, Shao Kahn, Terry Bogard, Cammy, Vault Boy, Handsome Jack, Andrew Ryan, Sam Fisher, Max Payne, Alan Wake',
      'Madeline, The Knight, Sans, Papyrus, Frisk, Zagreus, Shovel Knight, Ori, Isaac, Meat Boy, Hat Kid, Hornet, Cuphead, Mugman, Razputin|Raz, Chell, Wheatley, Alyx Vance|Alyx, Adam Jensen, JC Denton, Corvo Attano|Corvo, Garrett, Clementine, Max Caulfield, Chloe Price, Senua',
    ],
  },
  {
    id: 'fictional-animals',
    q: 'Name a famous animal from a book, film or cartoon',
    tiers: [
      'Winnie the Pooh|Pooh, Simba, Bambi, Dumbo, Paddington|Paddington Bear, Lassie, Peter Rabbit, Snoopy, Nemo',
      'Black Beauty, Babe, Toto, Hedwig, Aslan, Shere Khan, Baloo, Bagheera, Kaa, Tigger, Eeyore, Piglet, Kanga, Roo, Sebastian, Flounder, Pumbaa, Timon, Rafiki, Mufasa, Nala, Stuart Little, Charlotte, Wilbur, Mr Toad|Toad of Toad Hall|Toad, Ratty, Mole, Clifford|Clifford the Big Red Dog, Mr Fox|Fantastic Mr Fox, Puss in Boots, Donkey, Odie, Hello Kitty, Shaun the Sheep, Gromit, Dory',
      'Fiver, Hazel, Bigwig, General Woundwort|Woundwort, Napoleon, Snowball, Boxer, Old Major, Moby Dick|Moby-Dick, White Fang, Buck, Old Yeller, Rin Tin Tin, Flipper, Skippy, Free Willy|Willy, Shadowfax, Bullseye, Hamm, Slinky Dog|Slinky, Marlin, Crush, Remy, Dug, Maximus, Pascal, Abu, Meeko, Mushu, Sven, Heihei, Toothless, Basil, Brer Rabbit, Jemima Puddle-Duck, Mrs. Tiggy-Winkle|Mrs Tiggy-Winkle, Squirrel Nutkin, Benjamin Bunny, Jeremy Fisher, The Cat in the Hat|Cat in the Hat, Horton, The Very Hungry Caterpillar|Hungry Caterpillar, The Gruffalo|Gruffalo, Spot, Kipper, Elmer, Mog, Rupert Bear|Rupert, Sooty',
      'Crookshanks, Fawkes, Buckbeak, Fang, Fluffy, Nagini, Scabbers, Mrs Norris, Errol, Aragog, Norbert, Rikki-Tikki-Tavi, Akela, Jonathan Livingston Seagull, Ferdinand, Curious George, Babar, Snowy|Milou, Dogmatix|Idefix, Gnasher, Brian Griffin, Krypto, Gentle Ben, Mister Ed|Mr Ed, Trigger, Rocinante, Clover, Benjamin the donkey, Moses the raven, Cheshire Cat, March Hare, White Rabbit, Mock Turtle, Dormouse',
      'Argos, Flush, Jip, Nana, Montmorency, Bill the Lizard, Dinah, Dab-Dab, Gub-Gub, Polynesia, Chee-Chee, Pushmi-Pullyu, Tock, Hobbes, Despereaux, Ralph S. Mouse|Ralph S Mouse, Mrs Frisby, Bagpuss, Orlando the Marmalade Cat|Orlando, Mr. Nilsson|Mr Nilsson, Pilot, Black Bess, Grip the raven|Grip',
    ],
  },
  {
    id: 'comedians',
    q: 'Name a comedian',
    people: true,
    tiers: [
      'Charlie Chaplin|Chaplin, Robin Williams, Jerry Seinfeld|Seinfeld, Eddie Murphy, Jim Carrey, Rowan Atkinson|Atkinson, Kevin Hart, Dave Chappelle|Chappelle',
      'Ricky Gervais|Gervais, Richard Pryor|Pryor, George Carlin|Carlin, Steve Martin, Chris Rock, Ellen DeGeneres|Ellen, Billy Connolly, Peter Kay, Michael McIntyre, John Cleese|Cleese, Lenny Henry, Joan Rivers, Bill Murray, Will Ferrell|Ferrell, Adam Sandler, Amy Schumer|Schumer, Sarah Silverman, Tina Fey, Amy Poehler, Lucille Ball, Bob Hope, Groucho Marx|Groucho',
      "Lenny Bruce, Bill Hicks, Bill Burr, Ali Wong, John Mulaney|Mulaney, Tim Minchin, Eddie Izzard|Izzard, Billy Crystal, Jerry Lewis, Mel Brooks, Steve Coogan|Coogan, Jimmy Carr, Frankie Boyle, Jack Whitehall, Romesh Ranganathan, Sarah Millican, Victoria Wood, Dawn French, Jennifer Saunders, Eric Morecambe|Morecambe, Ernie Wise, Tommy Cooper, Ronnie Barker, Ronnie Corbett, Spike Milligan, Peter Sellers, Kenneth Williams, Les Dawson, Ken Dodd, Stewart Lee, Lee Mack, Bill Bailey, Dylan Moran, Sacha Baron Cohen, Conan O'Brien, David Letterman|Letterman, Jay Leno|Leno, Jimmy Fallon, Stephen Colbert|Colbert, Jon Stewart, Trevor Noah, John Oliver, Larry David",
      'Buster Keaton, Harold Lloyd, Stan Laurel, Oliver Hardy, Bud Abbott, Lou Costello, WC Fields|W.C. Fields, Phyllis Diller, Rodney Dangerfield, Don Rickles, Bob Newhart, Andy Kaufman, Mitch Hedberg, Steven Wright, Norm Macdonald, Gilda Radner, John Belushi, Dan Aykroyd, Chevy Chase, Chris Farley, Wanda Sykes, Margaret Cho, Tig Notaro, Patton Oswalt, Bo Burnham, Nate Bargatze, Tiffany Haddish, Jo Brand, Harry Hill, Vic Reeves, Bob Mortimer, Paul Whitehouse, Harry Enfield, Rik Mayall, Ben Elton, Stephen Fry, Greg Davies, Michael Palin, Eric Idle',
      'Max Wall, Max Miller, Arthur Askey, Tony Hancock, Eric Sykes, Marty Feldman, Peter Cook, Dudley Moore, Larry Grayson, Benny Hill, Dave Allen, Chic Murray, Jasper Carrott, Victor Borge, Jack Benny, George Burns, Milton Berle, Sid Caesar, Ernie Kovacs, Moms Mabley, Redd Foxx, Dick Gregory, Jackie Mason, Henny Youngman, Mort Sahl',
    ],
  },
];
