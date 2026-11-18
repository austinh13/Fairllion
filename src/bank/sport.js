// Sport: games, players, terms and places.

export default [
  {
    id: 'sports',
    q: 'Name a sport',
    tiers: [
      'Football|Soccer|Association football, Basketball, Tennis, Golf, Baseball, Cricket, Rugby|Rugby union|Rugby league, Swimming, Boxing, Ice hockey|Hockey',
      'Volleyball, Badminton, Table tennis|Ping pong, Cycling, Athletics|Track and field, Skiing, Snowboarding, Surfing, Wrestling, Gymnastics, American football|Gridiron, Darts, Snooker, Bowling|Ten-pin bowling|Tenpin bowling, Skateboarding, Rowing, Horse racing',
      'Squash, Netball, Handball, Lacrosse, Field hockey, Fencing, Archery, Judo, Karate, Taekwondo, Water polo, Sailing, Canoeing|Kayaking, Triathlon, Curling, Polo, Pool|Billiards, Rock climbing|Climbing, Motor racing|Formula One|F1, Mixed martial arts|MMA, Softball, Diving, Weightlifting, Equestrian|Show jumping|Dressage',
      'Bobsleigh|Bobsled, Luge, Skeleton, Biathlon, Rounders, Hurling, Gaelic football, Australian rules football|Aussie rules|AFL, Korfball, Sumo, Kickboxing, Pickleball, Racquetball, Bandy, Croquet, Lawn bowls|Bowls, Shinty, Water skiing, Kitesurfing, Windsurfing, Paddleboarding|Stand-up paddleboarding|SUP, Orienteering, Parkour, Ultimate frisbee|Ultimate, Dodgeball, Motocross, Speedway, Figure skating, Speed skating',
      'Sepak takraw, Kabaddi, Jai alai|Basque pelota|Pelota, Hornussen, Underwater hockey|Octopush, Kho kho, Buzkashi, Fives|Eton fives|Rugby fives, Real tennis|Court tennis, Rackets|Racquets, Pato, Bossaball, Footvolley, Camogie, Calcio storico, Chess boxing, Pesapallo|Pesäpallo, Floorball, Sambo, Glima, Kendo, Tchoukball, Teqball, Quadball|Quidditch, Fistball, Roller derby, Skibob',
    ],
  },
  {
    id: 'footballers',
    q: 'Name a footballer, past or present',
    people: true,
    tiers: [
      'Messi|Lionel Messi, Ronaldo|Cristiano Ronaldo|CR7, Pelé|Pele, Maradona|Diego Maradona, Beckham|David Beckham, Mbappé|Mbappe|Kylian Mbappe, Haaland|Erling Haaland, Neymar',
      'Zidane|Zinedine Zidane, Cruyff|Johan Cruyff|Cruijff, Ronaldinho, Rooney|Wayne Rooney, Salah|Mohamed Salah, Kane|Harry Kane, Henry|Thierry Henry, Beckenbauer|Franz Beckenbauer, Lewandowski, Ibrahimović|Ibrahimovic|Zlatan, Modrić|Modric|Luka Modric, Gerrard|Steven Gerrard, Lampard|Frank Lampard, Bellingham|Jude Bellingham',
      'Eusébio|Eusebio, Puskás|Puskas|Ferenc Puskas, Bobby Charlton|Charlton, George Best|Best, Bobby Moore|Moore, Platini, Baggio, Maldini, Buffon, Kaká|Kaka, Ronaldo Nazário|Ronaldo Nazario|R9, Xavi, Iniesta, Pirlo, Totti, Shearer, Drogba, Van Basten|Marco van Basten, Müller|Muller|Gerd Muller|Thomas Muller, Neuer, De Bruyne|Kevin De Bruyne, Van Dijk|Virgil van Dijk, Vinícius Júnior|Vinicius Junior|Vinicius|Vini Jr, Kanté|Kante, Pogba, Benzema, Suárez|Suarez|Luis Suarez, Sergio Ramos|Ramos, Casillas, Lineker|Gary Lineker, Roy Keane|Keane, Cantona',
      "Di Stéfano|Di Stefano|Alfredo Di Stefano, Yashin|Lev Yashin, Stanley Matthews|Matthews, Garrincha, Zico, Sócrates|Socrates, Romário|Romario, Rivaldo, Cafu, Roberto Carlos, Gullit|Ruud Gullit, Rijkaard, Bergkamp, Figo, Hagi, Stoichkov, Schmeichel, George Weah|Weah, Eto'o|Samuel Eto'o, Seedorf, Nedvěd|Nedved, Raúl|Raul, Shevchenko, Michael Owen|Owen, Scholes, Giggs, Dalglish, Ian Rush|Rush, Keegan, Gascoigne|Gazza, Klose, Son Heung-min|Son, Mané|Mane|Sadio Mane, Griezmann, Rashford, Saka, Foden, Pedri, Lamine Yamal|Yamal",
      'Meazza, Sindelar, Kocsis, Just Fontaine|Fontaine, Gento, Kopa, Masopust, Rummenigge, Rensenbrink, Facchetti, Gigi Riva|Riva, Gianni Rivera|Rivera, Paolo Rossi|Rossi, Zoff, Sammer, Blokhin, Papin, Laudrup, Nilton Santos, Didi, Vavá|Vava, Tostão|Tostao, Rivelino, Jairzinho, Higuita, Valderrama, Roger Milla|Milla, Okocha, Abedi Pele, Trautmann, Tom Finney|Finney, Jimmy Greaves|Greaves, Gordon Banks|Banks, Geoff Hurst|Hurst',
    ],
  },
  {
    id: 'f1-drivers',
    q: 'Name a Formula One driver, past or present',
    people: true,
    tiers: [
      'Hamilton|Lewis Hamilton, Schumacher|Michael Schumacher, Senna|Ayrton Senna, Verstappen|Max Verstappen, Alonso|Fernando Alonso, Vettel|Sebastian Vettel',
      'Prost|Alain Prost, Lauda|Niki Lauda, Button|Jenson Button, Räikkönen|Raikkonen|Kimi Raikkonen, Leclerc|Charles Leclerc, Norris|Lando Norris, Mansell|Nigel Mansell, Hunt|James Hunt, Russell|George Russell, Ricciardo|Daniel Ricciardo, Fangio|Juan Manuel Fangio',
      'Stewart|Jackie Stewart, Damon Hill, Graham Hill, Piquet|Nelson Piquet, Häkkinen|Hakkinen|Mika Hakkinen, Rosberg|Nico Rosberg|Keke Rosberg, Clark|Jim Clark, Moss|Stirling Moss, Villeneuve|Gilles Villeneuve|Jacques Villeneuve, Coulthard|David Coulthard, Barrichello, Webber|Mark Webber, Bottas|Valtteri Bottas, Pérez|Perez|Sergio Perez, Sainz|Carlos Sainz, Piastri|Oscar Piastri, Massa|Felipe Massa, Brabham|Jack Brabham',
      "Andretti|Mario Andretti, Fittipaldi|Emerson Fittipaldi, Ascari|Alberto Ascari, Hulme|Denny Hulme, Surtees|John Surtees, Rindt|Jochen Rindt, Scheckter|Jody Scheckter, Jones|Alan Jones, Berger|Gerhard Berger, Alesi|Jean Alesi, Irvine|Eddie Irvine, Montoya|Juan Pablo Montoya, Ralf Schumacher, Mick Schumacher, Hülkenberg|Hulkenberg|Nico Hulkenberg, Grosjean|Romain Grosjean, Kubica|Robert Kubica, Gasly|Pierre Gasly, Ocon|Esteban Ocon, Albon|Alex Albon, Stroll|Lance Stroll, Magnussen|Kevin Magnussen, Tsunoda|Yuki Tsunoda, Lawson|Liam Lawson, Antonelli|Kimi Antonelli, Bearman|Oliver Bearman, Zhou|Zhou Guanyu, Kvyat, Vandoorne, Hartley, Ericsson",
      "Farina|Nino Farina, Hawthorn|Mike Hawthorn, Collins|Peter Collins, Gurney|Dan Gurney, Ickx|Jacky Ickx, Peterson|Ronnie Peterson, Cevert|François Cevert|Francois Cevert, Regazzoni|Clay Regazzoni, Depailler, Laffite, Reutemann, Watson|John Watson, Patrese|Riccardo Patrese, De Angelis, Arnoux, Tambay, Pironi, Jarier, Brundle|Martin Brundle, Herbert|Johnny Herbert, Frentzen, Trulli, Fisichella, Heidfeld, Sato|Takuma Sato, Kobayashi, Maldonado, Di Resta, Sutil, Wehrlein, Ratzenberger, Bandini, Von Trips, Siffert, Bellof",
    ],
  },
  {
    id: 'tennis-players',
    q: 'Name a tennis player, past or present',
    people: true,
    tiers: [
      'Federer|Roger Federer, Nadal|Rafael Nadal|Rafa Nadal, Djokovic|Novak Djokovic, Serena Williams|Serena, Venus Williams|Venus, Murray|Andy Murray, Sampras|Pete Sampras, Agassi|Andre Agassi',
      'McEnroe|John McEnroe, Borg|Bjorn Borg|Björn Borg, Navratilova|Martina Navratilova, Graf|Steffi Graf, Alcaraz|Carlos Alcaraz, Sinner|Jannik Sinner, Sharapova|Maria Sharapova, Evert|Chris Evert, Becker|Boris Becker, Connors|Jimmy Connors, Billie Jean King|King, Osaka|Naomi Osaka',
      'Laver|Rod Laver, Ashe|Arthur Ashe, Lendl|Ivan Lendl, Edberg|Stefan Edberg, Wilander, Henman|Tim Henman, Hingis|Martina Hingis, Seles|Monica Seles, Henin|Justine Henin, Clijsters, Wozniacki, Swiatek|Iga Swiatek, Sabalenka|Aryna Sabalenka, Gauff|Coco Gauff, Raducanu|Emma Raducanu, Medvedev|Daniil Medvedev, Zverev, Wawrinka, Del Potro, Roddick|Andy Roddick, Hewitt|Lleyton Hewitt, Kyrgios|Nick Kyrgios, Barty|Ash Barty',
      "Goolagong|Evonne Goolagong, Court|Margaret Court, Rosewall, Emerson|Roy Emerson, Newcombe, Nastase, Vilas, Courier|Jim Courier, Chang|Michael Chang, Kafelnikov, Rafter|Pat Rafter, Ivanisevic, Safin, Ferrero, Davenport, Capriati, Mauresmo, Kuznetsova, Azarenka, Kvitova, Halep, Kerber, Muguruza, Stosur, Li Na, Rybakina, Pegula, Tsitsipas, Ruud|Casper Ruud, Rune, Fritz|Taylor Fritz, Draper|Jack Draper, Thiem, Cilic, Ferrer|David Ferrer, Tsonga, Monfils, Nishikori",
      'Perry|Fred Perry, Tilden|Bill Tilden, Budge|Don Budge, Lacoste|Rene Lacoste, Suzanne Lenglen|Lenglen, Helen Wills Moody|Wills Moody, Maureen Connolly|Connolly, Althea Gibson|Gibson, Pancho Gonzales|Gonzales, Hoad|Lew Hoad, Santana|Manuel Santana, Kodes, Okker, Tanner, Noah|Yannick Noah, Mecir, Muster, Kuerten|Guga, Krajicek, Stich, Novotna, Sanchez Vicario|Arantxa Sanchez Vicario, Sabatini, Shriver, Mandlikova, Wade|Virginia Wade, Jones|Ann Jones, Mortimer|Angela Mortimer',
    ],
  },
  {
    id: 'boxers',
    q: 'Name a boxer, past or present',
    people: true,
    tiers: [
      'Ali|Muhammad Ali|Cassius Clay, Tyson|Mike Tyson, Mayweather|Floyd Mayweather, Foreman|George Foreman, Frazier|Joe Frazier, Pacquiao|Manny Pacquiao',
      'Holyfield|Evander Holyfield, Lennox Lewis|Lewis, Joshua|Anthony Joshua, Fury|Tyson Fury, Sugar Ray Leonard|Leonard, Sugar Ray Robinson|Robinson, Marciano|Rocky Marciano, Joe Louis|Louis, Dempsey|Jack Dempsey, De La Hoya|Oscar De La Hoya, Canelo|Canelo Alvarez|Alvarez, Usyk|Oleksandr Usyk',
      'Hagler|Marvin Hagler, Hearns|Thomas Hearns, Durán|Duran|Roberto Duran, Klitschko|Wladimir Klitschko|Vitali Klitschko, Bruno|Frank Bruno, Eubank|Chris Eubank, Benn|Nigel Benn, Calzaghe|Joe Calzaghe, Hamed|Naseem Hamed|Prince Naseem, Khan|Amir Khan, Froch|Carl Froch, Hatton|Ricky Hatton, Wilder|Deontay Wilder, Liston|Sonny Liston, Jack Johnson|Johnson, Chavez|Julio Cesar Chavez, Golovkin|GGG, Crawford|Terence Crawford, Inoue|Naoya Inoue',
      'Norton|Ken Norton, Spinks|Leon Spinks|Michael Spinks, Patterson|Floyd Patterson, Larry Holmes|Holmes, Douglas|Buster Douglas, Bowe|Riddick Bowe, Hopkins|Bernard Hopkins, Roy Jones|Roy Jones Jr, Trinidad|Felix Trinidad, Mosley|Shane Mosley, Cotto|Miguel Cotto, Marquez|Juan Manuel Marquez, Morales|Erik Morales, Barrera, Lomachenko, Haye|David Haye, Cooper|Henry Cooper, Watson|Michael Watson, Collins|Steve Collins, Whyte|Dillian Whyte, Ruiz|Andy Ruiz, Ward|Andre Ward, Pryor|Aaron Pryor, Arguello|Alexis Arguello, Gatti|Arturo Gatti',
      'Tunney|Gene Tunney, Schmeling|Max Schmeling, Carnera|Primo Carnera, Braddock|James Braddock, Charles|Ezzard Charles, Walcott|Jersey Joe Walcott, Moore|Archie Moore, LaMotta|Jake LaMotta, Graziano|Rocky Graziano, Zale|Tony Zale, Armstrong|Henry Armstrong, Pep|Willie Pep, Saddler|Sandy Saddler, Monzon|Carlos Monzon, Ike Ibeabuchi|Ibeabuchi, Tommy Morrison|Morrison, Pinklon Thomas, Tim Witherspoon|Witherspoon, Ken Buchanan|Buchanan, Jim Watt|Watt, Barry McGuigan|McGuigan, Mendoza|Daniel Mendoza, Jim Corbett|Gentleman Jim, Sullivan|John L Sullivan, Jeffries|James Jeffries',
    ],
  },
  {
    id: 'athletes',
    q: 'Name a track and field athlete, past or present',
    people: true,
    tiers: [
      'Bolt|Usain Bolt, Carl Lewis|Lewis, Jesse Owens|Owens, Farah|Mo Farah, Ennis|Jessica Ennis|Jessica Ennis-Hill, Radcliffe|Paula Radcliffe',
      'Michael Johnson, Flo-Jo|Florence Griffith Joyner|Griffith Joyner, Coe|Sebastian Coe, Ovett|Steve Ovett, Kipchoge|Eliud Kipchoge, Bannister|Roger Bannister, Holmes|Kelly Holmes, Christie|Linford Christie, Jackson|Colin Jackson, Edwards|Jonathan Edwards, Bubka|Sergey Bubka, Duplantis|Mondo Duplantis, Thompson|Daley Thompson',
      'Gebrselassie|Haile Gebrselassie, Bekele|Kenenisa Bekele, El Guerrouj|Hicham El Guerrouj, Joyner-Kersee|Jackie Joyner-Kersee, Fraser-Pryce|Shelly-Ann Fraser-Pryce, Thompson-Herah|Elaine Thompson-Herah, Felix|Allyson Felix, Blake|Yohan Blake, Gatlin|Justin Gatlin, Powell|Asafa Powell, Van Niekerk|Wayde van Niekerk, Rudisha|David Rudisha, Warholm|Karsten Warholm, McLaughlin|Sydney McLaughlin, Johnson-Thompson|Katarina Johnson-Thompson, Rutherford|Greg Rutherford, Whitbread|Fatima Whitbread, Sanderson|Tessa Sanderson, Gunnell|Sally Gunnell, Black|Roger Black, Ohuruogu|Christine Ohuruogu, Asher-Smith|Dina Asher-Smith, Hodgkinson|Keely Hodgkinson',
      'Zátopek|Zatopek|Emil Zatopek, Nurmi|Paavo Nurmi, Viren|Lasse Viren, Abebe Bikila|Bikila, Beamon|Bob Beamon, Fosbury|Dick Fosbury, Moses|Edwin Moses, Cram|Steve Cram, Budd|Zola Budd, Decker|Mary Decker, Devers|Gail Devers, Pérec|Perec|Marie-Jose Perec, Freeman|Cathy Freeman, Bailey|Donovan Bailey, Greene|Maurice Greene, Ben Johnson, Ottey|Merlene Ottey, Dibaba|Tirunesh Dibaba, Defar, Cheruiyot, Kiprotich, Kipyegon|Faith Kipyegon, Hassan|Sifan Hassan, Ingebrigtsen|Jakob Ingebrigtsen, Kerr|Josh Kerr, Lyles|Noah Lyles',
      "Didrikson|Babe Didrikson, Blankers-Koen|Fanny Blankers-Koen, Rudolph|Wilma Rudolph, Oerter|Al Oerter, Thorpe|Jim Thorpe, Snell|Peter Snell, Elliott|Herb Elliott, Ryun|Jim Ryun, Hemery|David Hemery, Wells|Allan Wells, Peters|Mary Peters, Rand|Mary Rand, Packer|Ann Packer, Akii-Bua|John Akii-Bua, Juantorena|Alberto Juantorena, Yifter|Miruts Yifter, Kristiansen|Ingrid Kristiansen, Waitz|Grete Waitz, Koch|Marita Koch, Kratochvílová|Kratochvilova, Sotomayor|Javier Sotomayor, Zelezny|Jan Zelezny, Kostadinova|Stefka Kostadinova, Chistyakova, Isinbayeva|Yelena Isinbayeva, Lavillenie|Renaud Lavillenie",
    ],
  },
  {
    id: 'basketball-players',
    q: 'Name a basketball player, past or present',
    people: true,
    tiers: [
      'Michael Jordan|Jordan, LeBron James|LeBron|James, Kobe Bryant|Kobe|Bryant, Shaquille O’Neal|Shaq|O’Neal|ONeal, Stephen Curry|Steph Curry|Curry, Magic Johnson|Magic',
      'Larry Bird|Bird, Kareem Abdul-Jabbar|Abdul-Jabbar|Kareem, Wilt Chamberlain|Chamberlain, Bill Russell|Russell, Kevin Durant|Durant, Tim Duncan|Duncan, Dirk Nowitzki|Nowitzki, Giannis Antetokounmpo|Giannis|Antetokounmpo, Allen Iverson|Iverson, Dennis Rodman|Rodman, Scottie Pippen|Pippen, Kevin Garnett|Garnett',
      'Hakeem Olajuwon|Olajuwon, Charles Barkley|Barkley, Karl Malone|Malone, John Stockton|Stockton, Patrick Ewing|Ewing, Dwyane Wade|Wade, Chris Paul|Paul, Kawhi Leonard|Kawhi|Leonard, Nikola Jokić|Jokic|Jokić, Luka Dončić|Doncic|Luka, Victor Wembanyama|Wembanyama|Wemby, James Harden|Harden, Russell Westbrook|Westbrook, Yao Ming|Yao, Steve Nash|Nash, Jason Kidd|Kidd, Paul Pierce|Pierce, Ray Allen, Vince Carter|Carter, Tracy McGrady|McGrady, Klay Thompson|Klay, Jayson Tatum|Tatum, Joel Embiid|Embiid, Damian Lillard|Lillard, Anthony Davis',
      'Julius Erving|Dr J|Erving, Jerry West|West, Oscar Robertson|Robertson, Elgin Baylor|Baylor, Moses Malone, Isiah Thomas, Clyde Drexler|Drexler, David Robinson, Reggie Miller, Gary Payton|Payton, Alonzo Mourning|Mourning, Dikembe Mutombo|Mutombo, Pau Gasol|Gasol, Manu Ginóbili|Manu Ginobili|Ginobili, Tony Parker, Carmelo Anthony|Carmelo, Chris Bosh|Bosh, Dwight Howard, Kyrie Irving|Kyrie, Paul George, Jimmy Butler, Devin Booker|Booker, Ja Morant|Morant|Ja, Zion Williamson|Zion, Trae Young, Shai Gilgeous-Alexander|SGA|Gilgeous-Alexander, Anthony Edwards, Caitlin Clark|Clark',
      'George Mikan|Mikan, Bob Cousy|Cousy, Bob Pettit|Pettit, John Havlicek|Havlicek, Pete Maravich|Pistol Pete|Maravich, Walt Frazier|Frazier, Willis Reed, Dave Cowens|Cowens, Bill Walton|Walton, Earl Monroe, Rick Barry, Elvin Hayes, George Gervin|Gervin|Iceman, Dominique Wilkins|Wilkins, Kevin McHale|McHale, Robert Parish|Parish, James Worthy|Worthy, Bernard King, Adrian Dantley, Chris Mullin|Mullin, Arvydas Sabonis|Sabonis, Dražen Petrović|Drazen Petrovic|Petrovic, Toni Kukoč|Kukoc, Sheryl Swoopes|Swoopes, Lisa Leslie|Leslie, Diana Taurasi|Taurasi, Sue Bird, Candace Parker',
    ],
  },
  {
    id: 'stadiums',
    q: 'Name a sports stadium, arena or ground',
    strip: ['stadium', 'arena'],
    tiers: [
      'Wembley, Old Trafford, Madison Square Garden|MSG, Yankee Stadium, Camp Nou|Nou Camp, Maracanã|Maracana, Santiago Bernabéu|Bernabeu|Santiago Bernabeu',
      "Anfield, Wrigley Field, Fenway Park, Lord's|Lords, Twickenham, Wimbledon|All England Club, Emirates Stadium, Allianz Arena, San Siro|Giuseppe Meazza, Stade de France, Melbourne Cricket Ground|MCG, Dodger Stadium, Lambeau Field, Rose Bowl, Croke Park, Murrayfield, Principality Stadium|Millennium Stadium",
      "Stamford Bridge, Etihad Stadium, Tottenham Hotspur Stadium, Goodison Park, Villa Park, St James' Park|St James Park, Hampden Park|Hampden, Celtic Park|Parkhead, Ibrox, Signal Iduna Park|Westfalenstadion, Olympiastadion, Johan Cruyff Arena|Amsterdam Arena, Estadio Azteca|Azteca, La Bombonera|Bombonera, Estadio Monumental|Monumental, Eden Gardens, Sydney Cricket Ground|SCG, The Oval|Kia Oval, Headingley, Edgbaston, SoFi Stadium, AT&T Stadium|Cowboys Stadium, Arrowhead Stadium, Soldier Field, MetLife Stadium, Superdome|Caesars Superdome, Crypto.com Arena|Staples Center, TD Garden|Boston Garden, United Center, Roland Garros|Stade Roland Garros, Arthur Ashe Stadium, Rod Laver Arena",
      "Hillsborough, Elland Road, Highbury, White Hart Lane, Maine Road, Molineux, Stade Vélodrome|Velodrome, Parc des Princes, Mestalla, Metropolitano|Wanda Metropolitano, Estádio da Luz|Estadio da Luz|Da Luz, Estádio do Dragão|Estadio do Dragao|Dragao, Philips Stadion, De Kuip, Stadio Olimpico, Aviva Stadium|Lansdowne Road, Ellis Park, Eden Park, Newlands, Camden Yards|Oriole Park, Busch Stadium, Candlestick Park, Shea Stadium, Ebbets Field, Polo Grounds, Astrodome, Michigan Stadium|Big House, Cameron Indoor Stadium, Rucker Park, Bird's Nest|Birds Nest|Beijing National Stadium, Luzhniki, Narendra Modi Stadium|Motera, Wankhede, The Gabba|Gabba, Adelaide Oval, WACA, Trent Bridge",
      "Bramall Lane, Deepdale, Turf Moor, Ewood Park, Portman Road, Fratton Park, The Den, Craven Cottage, Loftus Road, Selhurst Park, Vicarage Road, Carrow Road, The Hawthorns, Estadio Centenario|Centenario, Mineirão|Mineirao, Morumbi, Pacaembu, San Mamés|San Mames, Anoeta, Riazor, Sánchez Pizjuán|Sanchez Pizjuan, La Rosaleda, Geoffroy-Guichard, Stade Louis II|Louis II, Stadio Diego Armando Maradona|San Paolo, Marassi|Luigi Ferraris, Artemio Franchi, Ernst Happel|Prater, Parken, Ullevaal, Şükrü Saracoğlu|Sukru Saracoglu, Poljud, Puskás Aréna|Puskas Arena|Nepstadion, Rungrado|May Day Stadium, Azadi Stadium",
    ],
  },
];
