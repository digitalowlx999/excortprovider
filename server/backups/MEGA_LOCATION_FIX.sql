-- THE FINAL "MEGA" LOCATION FIX (Run this to get Hundreds of Cities)
-- WARNING: This will DELETE all existing locations and rebuild them perfectly.
USE escort_db;

-- 1. Setup
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE cities;
TRUNCATE TABLE states;
SET FOREIGN_KEY_CHECKS = 1;

-- 2. Insert All 50 US States + 13 Canadian Provinces
INSERT INTO states (id, name, code) VALUES 
(1, 'Alabama', 'AL'), (2, 'Alaska', 'AK'), (3, 'Arizona', 'AZ'), (4, 'Arkansas', 'AR'), (5, 'California', 'CA'),
(6, 'Colorado', 'CO'), (7, 'Connecticut', 'CT'), (8, 'Delaware', 'DE'), (9, 'Florida', 'FL'), (10, 'Georgia', 'GA'),
(11, 'Hawaii', 'HI'), (12, 'Idaho', 'ID'), (13, 'Illinois', 'IL'), (14, 'Indiana', 'IN'), (15, 'Iowa', 'IA'),
(16, 'Kansas', 'KS'), (17, 'Kentucky', 'KY'), (18, 'Louisiana', 'LA'), (19, 'Maine', 'ME'), (20, 'Maryland', 'MD'),
(21, 'Massachusetts', 'MA'), (22, 'Michigan', 'MI'), (23, 'Minnesota', 'MN'), (24, 'Mississippi', 'MS'), (25, 'Missouri', 'MO'),
(26, 'Montana', 'MT'), (27, 'Nebraska', 'NE'), (28, 'Nevada', 'NV'), (29, 'New Hampshire', 'NH'), (30, 'New Jersey', 'NJ'),
(31, 'New Mexico', 'NM'), (32, 'New York', 'NY'), (33, 'North Carolina', 'NC'), (34, 'North Dakota', 'ND'), (35, 'Ohio', 'OH'),
(36, 'Oklahoma', 'OK'), (37, 'Oregon', 'OR'), (38, 'Pennsylvania', 'PA'), (39, 'Rhode Island', 'RI'), (40, 'South Carolina', 'SC'),
(41, 'South Dakota', 'SD'), (42, 'Tennessee', 'TN'), (43, 'Texas', 'TX'), (44, 'Utah', 'UT'), (45, 'Vermont', 'VT'),
(46, 'Virginia', 'VA'), (47, 'Washington', 'WA'), (48, 'West Virginia', 'WV'), (49, 'Wisconsin', 'WI'), (50, 'Wyoming', 'WY'),
(51, 'Ontario', 'ON'), (52, 'Quebec', 'QC'), (53, 'British Columbia', 'BC'), (54, 'Alberta', 'AB'), (55, 'Manitoba', 'MB'),
(56, 'Saskatchewan', 'SK'), (57, 'Nova Scotia', 'NS'), (58, 'New Brunswick', 'NB'), (59, 'Newfoundland and Labrador', 'NL'),
(60, 'Prince Edward Island', 'PE'), (61, 'Northwest Territories', 'NT'), (62, 'Nunavut', 'NU'), (63, 'Yukon', 'YT');

-- 3. Insert ~400+ Cities (Major & Mid-sized)
INSERT INTO cities (state_id, name, slug) VALUES 
-- Alabama
(1, 'Birmingham', 'birmingham-al'), (1, 'Montgomery', 'montgomery-al'), (1, 'Mobile', 'mobile-al'), (1, 'Huntsville', 'huntsville-al'), (1, 'Tuscaloosa', 'tuscaloosa-al'), (1, 'Hoover', 'hoover-al'), (1, 'Dothan', 'dothan-al'), (1, 'Auburn', 'auburn-al'), (1, 'Decatur', 'decatur-al'), (1, 'Madison', 'madison-al'),
-- Alaska
(2, 'Anchorage', 'anchorage-ak'), (2, 'Fairbanks', 'fairbanks-ak'), (2, 'Juneau', 'juneau-ak'), (2, 'Sitka', 'sitka-ak'), (2, 'Ketchikan', 'ketchikan-ak'), (2, 'Wasilla', 'wasilla-ak'), (2, 'Kenai', 'kenai-ak'), (2, 'Kodiak', 'kodiak-ak'),
-- Arizona
(3, 'Phoenix', 'phoenix-az'), (3, 'Tucson', 'tucson-az'), (3, 'Mesa', 'mesa-az'), (3, 'Chandler', 'chandler-az'), (3, 'Scottsdale', 'scottsdale-az'), (3, 'Glendale', 'glendale-az'), (3, 'Gilbert', 'gilbert-az'), (3, 'Tempe', 'tempe-az'), (3, 'Peoria', 'peoria-az'), (3, 'Surprise', 'surprise-az'), (3, 'Yuma', 'yuma-az'), (3, 'Flagstaff', 'flagstaff-az'),
-- Arkansas
(4, 'Little Rock', 'little-rock-ar'), (4, 'Fort Smith', 'fort-smith-ar'), (4, 'Fayetteville', 'fayetteville-ar'), (4, 'Springdale', 'springdale-ar'), (4, 'Jonesboro', 'jonesboro-ar'), (4, 'North Little Rock', 'north-little-rock-ar'), (4, 'Conway', 'conway-ar'), (4, 'Rogers', 'rogers-ar'), (4, 'Pine Bluff', 'pine-bluff-ar'), (4, 'Bentonville', 'bentonville-ar'),
-- California
(5, 'Los Angeles', 'los-angeles-ca'), (5, 'San Diego', 'san-diego-ca'), (5, 'San Jose', 'san-jose-ca'), (5, 'San Francisco', 'san-francisco-ca'), (5, 'Fresno', 'fresno-ca'), (5, 'Sacramento', 'sacramento-ca'), (5, 'Long Beach', 'long-beach-ca'), (5, 'Oakland', 'oakland-ca'), (5, 'Bakersfield', 'bakersfield-ca'), (5, 'Anaheim', 'anaheim-ca'), (5, 'Santa Ana', 'santa-ana-ca'), (5, 'Riverside', 'riverside-ca'), (5, 'Stockton', 'stockton-ca'), (5, 'Irvine', 'irvine-ca'), (5, 'Chula Vista', 'chula-vista-ca'), (5, 'Fremont', 'fremont-ca'), (5, 'San Bernardino', 'san-bernardino-ca'), (5, 'Modesto', 'modesto-ca'), (5, 'Fontana', 'fontana-ca'), (5, 'Oxnard', 'oxnard-ca'), (5, 'Moreno Valley', 'moreno-valley-ca'), (5, 'Huntington Beach', 'huntington-beach-ca'), (5, 'Glendale', 'glendale-ca'), (5, 'Santa Clarita', 'santa-clarita-ca'), (5, 'Garden Grove', 'garden-grove-ca'), (5, 'Oceanside', 'oceanside-ca'), (5, 'Rancho Cucamonga', 'rancho-cucamonga-ca'), (5, 'Santa Rosa', 'santa-rosa-ca'), (5, 'Ontario', 'ontario-ca'), (5, 'Lancaster', 'lancaster-ca'), (5, 'Elk Grove', 'elk-grove-ca'), (5, 'Palmdale', 'palmdale-ca'), (5, 'Corona', 'corona-ca'), (5, 'Salinas', 'salinas-ca'), (5, 'Pomona', 'pomona-ca'), (5, 'Torrance', 'torrance-ca'), (5, 'Hayward', 'hayward-ca'), (5, 'Escondido', 'escondido-ca'), (5, 'Sunnyvale', 'sunnyvale-ca'), (5, 'Orange', 'orange-ca'), (5, 'Fullerton', 'fullerton-ca'), (5, 'Thousand Oaks', 'thousand-oaks-ca'), (5, 'Simi Valley', 'simi-valley-ca'), (5, 'Roseville', 'roseville-ca'), (5, 'Concord', 'concord-ca'), (5, 'Visalia', 'visalia-ca'), (5, 'Santa Clara', 'santa-clara-ca'), (5, 'Victorville', 'victorville-ca'), (5, 'Vallejo', 'vallejo-ca'), (5, 'Berkeley', 'berkeley-ca'), (5, 'El Monte', 'el-monte-ca'), (5, 'Murrieta', 'murrieta-ca'), (5, 'Temecula', 'temecula-ca'), (5, 'Santa Maria', 'santa-maria-ca'), (5, 'Pasadena', 'pasadena-ca'), (5, 'Santa Barbara', 'santa-barbara-ca'), (5, 'Clovis', 'clovis-ca'), (5, 'Fairfield', 'fairfield-ca'), (5, 'Antioch', 'antioch-ca'), (5, 'Richmond', 'richmond-ca'), (5, 'Jurupa Valley', 'jurupa-valley-ca'), (5, 'Chico', 'chico-ca'), (5, 'Modesto', 'modesto2-ca'), (5, 'Burbank', 'burbank-ca'),
-- Colorado
(6, 'Denver', 'denver-co'), (6, 'Colorado Springs', 'colorado-springs-co'), (6, 'Aurora', 'aurora-co'), (6, 'Fort Collins', 'fort-collins-co'), (6, 'Lakewood', 'lakewood-co'), (6, 'Thornton', 'thornton-co'), (6, 'Arvada', 'arvada-co'), (6, 'Westminster', 'westminster-co'), (6, 'Pueblo', 'pueblo-co'), (6, 'Centennial', 'centennial-co'), (6, 'Boulder', 'boulder-co'), (6, 'Greeley', 'greeley-co'),
-- Connecticut
(7, 'Bridgeport', 'bridgeport-ct'), (7, 'New Haven', 'new-haven-ct'), (7, 'Stamford', 'stamford-ct'), (7, 'Hartford', 'hartford-ct'), (7, 'Waterbury', 'waterbury-ct'), (7, 'Norwalk', 'norwalk-ct'), (7, 'Danbury', 'danbury-ct'), (7, 'New Britain', 'new-britain-ct'), (7, 'Greenwich', 'greenwich-ct'),
-- Delaware
(8, 'Wilmington', 'wilmington-de'), (8, 'Dover', 'dover-de'), (8, 'Newark', 'newark-de'), (8, 'Middletown', 'middletown-de'), (8, 'Smyrna', 'smyrna-de'), (8, 'Milford', 'milford-de'), (8, 'Seaford', 'seaford-de'),
-- Florida
(9, 'Miami', 'miami-fl'), (9, 'Tampa', 'tampa-fl'), (9, 'Orlando', 'orlando-fl'), (9, 'Jacksonville', 'jacksonville-fl'), (9, 'Fort Lauderdale', 'fort-lauderdale-fl'), (9, 'Tallahassee', 'tallahassee-fl'), (9, 'St. Petersburg', 'st-petersburg-fl'), (9, 'Hialeah', 'hialeah-fl'), (9, 'Port St. Lucie', 'port-st-lucie-fl'), (9, 'Cape Coral', 'cape-coral-fl'), (9, 'Pembroke Pines', 'pembroke-pines-fl'), (9, 'Hollywood', 'hollywood-fl'), (9, 'Miramar', 'miramar-fl'), (9, 'Gainesville', 'gainesville-fl'), (9, 'Coral Springs', 'coral-springs-fl'), (9, 'Clearwater', 'clearwater-fl'), (9, 'Palm Bay', 'palm-bay-fl'), (9, 'Pompano Beach', 'pompano-beach-fl'), (9, 'West Palm Beach', 'west-palm-beach-fl'), (9, 'Lakeland', 'lakeland-fl'), (9, 'Davie', 'davie-fl'), (9, 'Miami Gardens', 'miami-gardens-fl'), (9, 'Sunrise', 'sunrise-fl'), (9, 'Boca Raton', 'boca-raton-fl'), (9, 'Plantation', 'plantation-fl'), (9, 'Fort Myers', 'fort-myers-fl'), (9, 'Deltona', 'deltona-fl'), (9, 'Largo', 'largo-fl'), (9, 'Deerfield Beach', 'deerfield-beach-fl'), (9, 'Melbourne', 'melbourne-fl'), (9, 'Boynton Beach', 'boynton-beach-fl'), (9, 'Homestead', 'homestead-fl'), (9, 'Palm Coast', 'palm-coast-fl'), (9, 'Doral', 'doral-fl'),
-- Georgia
(10, 'Atlanta', 'atlanta-ga'), (10, 'Augusta', 'augusta-ga'), (10, 'Columbus', 'columbus-ga'), (10, 'Macon', 'macon-ga'), (10, 'Savannah', 'savannah-ga'), (10, 'Athens', 'athens-ga'), (10, 'Sandy Springs', 'sandy-springs-ga'), (10, 'Roswell', 'roswell-ga'), (10, 'Johns Creek', 'johns-creek-ga'), (10, 'Warner Robins', 'warner-robins-ga'), (10, 'Alpharetta', 'alpharetta-ga'), (10, 'Marietta', 'marietta-ga'),
-- Hawaii
(11, 'Honolulu', 'honolulu-hi'), (11, 'Hilo', 'hilo-hi'), (11, 'Kailua', 'kailua-hi'), (11, 'Kapolei', 'kapolei-hi'), (11, 'Kaneohe', 'kaneohe-hi'), (11, 'Waipahu', 'waipahu-hi'), (11, 'Pearl City', 'pearl-city-hi'),
-- Idaho
(12, 'Boise', 'boise-id'), (12, 'Meridian', 'meridian-id'), (12, 'Nampa', 'nampa-id'), (12, 'Idaho Falls', 'idaho-falls-id'), (12, 'Caldwell', 'caldwell-id'), (12, 'Pocatello', 'pocatello-id'), (12, 'Coeur d''Alene', 'coeur-dalene-id'), (12, 'Twin Falls', 'twin-falls-id'),
-- Illinois
(13, 'Chicago', 'chicago-il'), (13, 'Aurora', 'aurora-il'), (13, 'Rockford', 'rockford-il'), (13, 'Joliet', 'joliet-il'), (13, 'Naperville', 'naperville-il'), (13, 'Springfield', 'springfield-il'), (13, 'Peoria', 'peoria-il'), (13, 'Elgin', 'elgin-il'), (13, 'Waukegan', 'waukegan-il'), (13, 'Cicero', 'cicero-il'), (13, 'Champaign', 'champaign-il'), (13, 'Bloomington', 'bloomington-il'), (13, 'Decatur', 'decatur-il'), (13, 'Arlington Heights', 'arlington-heights-il'),
-- Indiana
(14, 'Indianapolis', 'indianapolis-in'), (14, 'Fort Wayne', 'fort-wayne-in'), (14, 'Evansville', 'evansville-in'), (14, 'South Bend', 'south-bend-in'), (14, 'Carmel', 'carmel-in'), (14, 'Fishers', 'fishers-in'), (14, 'Bloomington', 'bloomington-in'), (14, 'Hammond', 'hammond-in'), (14, 'Gary', 'gary-in'), (14, 'Lafayette', 'lafayette-in'), (14, 'Muncie', 'muncie-in'), (14, 'Terre Haute', 'terre-haute-in'),
-- Iowa
(15, 'Des Moines', 'des-moines-ia'), (15, 'Cedar Rapids', 'cedar-rapids-ia'), (15, 'Davenport', 'davenport-ia'), (15, 'Sioux City', 'sioux-city-ia'), (15, 'Iowa City', 'iowa-city-ia'), (15, 'Waterloo', 'waterloo-ia'), (15, 'Council Bluffs', 'council-bluffs-ia'), (15, 'Ames', 'ames-ia'), (15, 'Dubuque', 'dubuque-ia'), (15, 'Ankeny', 'ankeny-ia'),
-- Kansas
(16, 'Wichita', 'wichita-ks'), (16, 'Overland Park', 'overland-park-ks'), (16, 'Kansas City', 'kansas-city-ks'), (16, 'Olathe', 'olathe-ks'), (16, 'Topeka', 'topeka-ks'), (16, 'Lawrence', 'lawrence-ks'), (16, 'Shawnee', 'shawnee-ks'), (16, 'Manhattan', 'manhattan-ks'), (16, 'Lenexa', 'lenexa-ks'), (16, 'Salina', 'salina-ks'),
-- Kentucky
(17, 'Louisville', 'louisville-ky'), (17, 'Lexington', 'lexington-ky'), (17, 'Bowling Green', 'bowling-green-ky'), (17, 'Owensboro', 'owensboro-ky'), (17, 'Covington', 'covington-ky'), (17, 'Hopkinsville', 'hopkinsville-ky'), (17, 'Richmond', 'richmond-ky'), (17, 'Florence', 'florence-ky'), (17, 'Georgetown', 'georgetown-ky'),
-- Louisiana
(18, 'New Orleans', 'new-orleans-la'), (18, 'Baton Rouge', 'baton-rouge-la'), (18, 'Shreveport', 'shreveport-la'), (18, 'Metairie', 'metairie-la'), (18, 'Lafayette', 'lafayette-la'), (18, 'Lake Charles', 'lake-charles-la'), (18, 'Kenner', 'kenner-la'), (18, 'Bossier City', 'bossier-city-la'), (18, 'Monroe', 'monroe-la'),
-- Maine
(19, 'Portland', 'portland-me'), (19, 'Lewiston', 'lewiston-me'), (19, 'Bangor', 'bangor-me'), (19, 'South Portland', 'south-portland-me'), (19, 'Auburn', 'auburn-me'), (19, 'Biddeford', 'biddeford-me'), (19, 'Augusta', 'augusta-me'), (19, 'Saco', 'saco-me'),
-- Maryland
(20, 'Baltimore', 'baltimore-md'), (20, 'Columbia', 'columbia-md'), (20, 'Germantown', 'germantown-md'), (20, 'Silver Spring', 'silver-spring-md'), (20, 'Waldorf', 'waldorf-md'), (20, 'Glen Burnie', 'glen-burnie-md'), (20, 'Frederick', 'frederick-md'), (20, 'Gaithersburg', 'gaithersburg-md'), (20, 'Rockville', 'rockville-md'), (20, 'Bethesda', 'bethesda-md'),
-- Massachusetts
(21, 'Boston', 'boston-ma'), (21, 'Worcester', 'worcester-ma'), (21, 'Springfield', 'springfield-ma'), (21, 'Cambridge', 'cambridge-ma'), (21, 'Lowell', 'lowell-ma'), (21, 'Brockton', 'brookton-ma'), (21, 'New Bedford', 'new-bedford-ma'), (21, 'Quincy', 'quincy-ma'), (21, 'Lynn', 'lynn-ma'), (21, 'Fall River', 'fall-river-ma'), (21, 'Newton', 'newton-ma'), (21, 'Lawrence', 'lawrence-ma'), (21, 'Somerville', 'somerville-ma'),
-- Michigan
(22, 'Detroit', 'detroit-mi'), (22, 'Grand Rapids', 'grand-rapids-mi'), (22, 'Warren', 'warren-mi'), (22, 'Sterling Heights', 'sterling-heights-mi'), (22, 'Ann Arbor', 'ann-arbor-mi'), (22, 'Lansing', 'lansing-mi'), (22, 'Flint', 'flint-mi'), (22, 'Dearborn', 'dearborn-mi'), (22, 'Livonia', 'livonia-mi'), (22, 'Clinton', 'clinton-mi'), (22, 'Canton', 'canton-mi'), (22, 'Westland', 'westland-mi'), (22, 'Troy', 'troy-mi'), (22, 'Farmington Hills', 'farmington-hills-mi'), (22, 'Macomb', 'macomb-mi'), (22, 'Kalamazoo', 'kalamazoo-mi'),
-- Minnesota
(23, 'Minneapolis', 'minneapolis-mn'), (23, 'Saint Paul', 'saint-paul-mn'), (23, 'Rochester', 'rochester-mn'), (23, 'Duluth', 'duluth-mn'), (23, 'Bloomington', 'bloomington-mn'), (23, 'Brooklyn Park', 'brooklyn-park-mn'), (23, 'Plymouth', 'plymouth-mn'), (23, 'Maple Grove', 'maple-grove-mn'), (23, 'Woodbury', 'woodbury-mn'), (23, 'St. Cloud', 'st-cloud-mn'), (23, 'Eagan', 'eagan-mn'),
-- Mississippi
(24, 'Jackson', 'jackson-ms'), (24, 'Gulfport', 'gulfport-ms'), (24, 'Southaven', 'southaven-ms'), (24, 'Biloxi', 'biloxi-ms'), (24, 'Hattiesburg', 'hattiesburg-ms'), (24, 'Olive Branch', 'olive-branch-ms'), (24, 'Meridian', 'meridian-ms'), (24, 'Tupelo', 'tupelo-ms'),
-- Missouri
(25, 'Kansas City', 'kansas-city-mo'), (25, 'Saint Louis', 'saint-louis-mo'), (25, 'Springfield', 'springfield-mo'), (25, 'Independence', 'independence-mo'), (25, 'Columbia', 'columbia-mo'), (25, 'Lee''s Summit', 'lees-summit-mo'), (25, 'O''Fallon', 'ofallon-mo'), (25, 'Saint Joseph', 'saint-joseph-mo'), (25, 'Saint Charles', 'saint-charles-mo'), (25, 'Blue Springs', 'blue-springs-mo'),
-- Montana
(26, 'Billings', 'billings-mt'), (26, 'Missoula', 'missoula-mt'), (26, 'Great Falls', 'great-falls-mt'), (26, 'Bozeman', 'bozeman-mt'), (26, 'Helena', 'helena-mt'), (26, 'Kalispell', 'kalispell-mt'), (26, 'Butte', 'butte-mt'),
-- Nebraska
(27, 'Omaha', 'omaha-ne'), (27, 'Lincoln', 'lincoln-ne'), (27, 'Bellevue', 'bellevue-ne'), (27, 'Grand Island', 'grand-island-ne'), (27, 'Kearney', 'kearney-ne'), (27, 'Fremont', 'fremont-ne'), (27, 'Norfolk', 'norfolk-ne'), (27, 'North Platte', 'north-platte-ne'),
-- Nevada
(28, 'Las Vegas', 'las-vegas-nv'), (28, 'Henderson', 'henderson-nv'), (28, 'Reno', 'reno-nv'), (28, 'North Las Vegas', 'north-las-vegas-nv'), (28, 'Sparks', 'sparks-nv'), (28, 'Carson City', 'carson-city-nv'), (28, 'Elko', 'elko-nv'), (28, 'Mesquite', 'mesquite-nv'),
-- New Hampshire
(29, 'Manchester', 'manchester-nh'), (29, 'Nashua', 'nashua-nh'), (29, 'Concord', 'concord-nh'), (29, 'Derry', 'derry-nh'), (29, 'Rochester', 'rochester-nh'), (29, 'Salem', 'salem-nh'), (29, 'Dover', 'dover-nh'), (29, 'Merrimack', 'merrimack-nh'),
-- New Jersey
(30, 'Newark', 'newark-nj'), (30, 'Jersey City', 'jersey-city-nj'), (30, 'Paterson', 'paterson-nj'), (30, 'Elizabeth', 'elizabeth-nj'), (30, 'Edison', 'edison-nj'), (30, 'Woodbridge', 'woodbridge-nj'), (30, 'Lakewood', 'lakewood-nj'), (30, 'Toms River', 'toms-river-nj'), (30, 'Hamilton', 'hamilton-nj'), (30, 'Trenton', 'trenton-nj'), (30, 'Clifton', 'clifton-nj'), (30, 'Cherry Hill', 'cherry-hill-nj'), (30, 'Brick', 'brick-nj'), (30, 'Camden', 'camden-nj'), (30, 'Passaic', 'passaic-nj'),
-- New Mexico
(31, 'Albuquerque', 'albuquerque-nm'), (31, 'Las Cruces', 'las-cruces-nm'), (31, 'Rio Rancho', 'rio-rancho-nm'), (31, 'Santa Fe', 'santa-fe-nm'), (31, 'Roswell', 'roswell-nm'), (31, 'Farmington', 'farmington-nm'), (31, 'South Valley', 'south-valley-nm'), (31, 'Clovis', 'clovis-nm'),
-- New York
(32, 'New York City', 'nyc-ny'), (32, 'Buffalo', 'buffalo-ny'), (32, 'Rochester', 'rochester-ny'), (32, 'Yonkers', 'yonkers-ny'), (32, 'Syracuse', 'syracuse-ny'), (32, 'Albany', 'albany-ny'), (32, 'New Rochelle', 'new-rochelle-ny'), (32, 'Mount Vernon', 'mount-vernon-ny'), (32, 'Schenectady', 'schenectady-ny'), (32, 'Utica', 'utica-ny'), (32, 'White Plains', 'white-plains-ny'), (32, 'Hempstead', 'hempstead-ny'), (32, 'Brookhaven', 'brookhaven-ny'), (32, 'Islip', 'islip-ny'), (32, 'Oyster Bay', 'oyster-bay-ny'), (32, 'North Hempstead', 'north-hempstead-ny'), (32, 'Babylon', 'babylon-ny'),
-- North Carolina
(33, 'Charlotte', 'charlotte-nc'), (33, 'Raleigh', 'raleigh-nc'), (33, 'Greensboro', 'greensboro-nc'), (33, 'Durham', 'durham-nc'), (33, 'Winston-Salem', 'winston-salem-nc'), (33, 'Fayetteville', 'fayetteville-nc'), (33, 'Cary', 'cary-nc'), (33, 'Wilmington', 'wilmington-nc'), (33, 'High Point', 'high-point-nc'), (33, 'Concord', 'concord-nc'), (33, 'Asheville', 'asheville-nc'), (33, 'Gastonia', 'gastonia-nc'), (33, 'Jacksonville', 'jacksonville-nc'), (33, 'Greenville', 'greenville-nc'), (33, 'Rocky Mount', 'rocky-mount-nc'),
-- North Dakota
(34, 'Fargo', 'fargo-nd'), (34, 'Bismarck', 'bismarck-nd'), (34, 'Grand Forks', 'grand-forks-nd'), (34, 'Minot', 'minot-nd'), (34, 'West Fargo', 'west-fargo-nd'), (34, 'Williston', 'williston-nd'), (34, 'Dickinson', 'dickinson-nd'),
-- Ohio
(35, 'Columbus', 'columbus-oh'), (35, 'Cleveland', 'cleveland-oh'), (35, 'Cincinnati', 'cincinnati-oh'), (35, 'Toledo', 'toledo-oh'), (35, 'Akron', 'akron-oh'), (35, 'Dayton', 'dayton-oh'), (35, 'Parma', 'parma-oh'), (35, 'Canton', 'canton-oh'), (35, 'Youngstown', 'youngstown-oh'), (35, 'Lorain', 'lorain-oh'), (35, 'Hamilton', 'hamilton-oh'), (35, 'Springfield', 'springfield-oh'), (35, 'Kettering', 'kettering-oh'),
-- Oklahoma
(36, 'Oklahoma City', 'oklahoma-city-ok'), (36, 'Tulsa', 'tulsa-ok'), (36, 'Norman', 'norman-ok'), (36, 'Broken Arrow', 'broken-arrow-ok'), (36, 'Lawton', 'lawton-ok'), (36, 'Edmond', 'edmond-ok'), (36, 'Moore', 'moore-ok'), (36, 'Midwest City', 'midwest-city-ok'), (36, 'Enid', 'enid-ok'), (36, 'Stillwater', 'stillwater-ok'),
-- Oregon
(37, 'Portland', 'portland-or'), (37, 'Salem', 'salem-or'), (37, 'Eugene', 'eugene-or'), (37, 'Gresham', 'gresham-or'), (37, 'Hillsboro', 'hillsboro-or'), (37, 'Beaverton', 'beaverton-or'), (37, 'Bend', 'bend-or'), (37, 'Medford', 'medford-or'), (37, 'Springfield', 'springfield-or'), (37, 'Corvallis', 'corvallis-or'),
-- Pennsylvania
(38, 'Philadelphia', 'philadelphia-pa'), (38, 'Pittsburgh', 'pittsburgh-pa'), (38, 'Allentown', 'allentown-pa'), (38, 'Erie', 'erie-pa'), (38, 'Reading', 'reading-pa'), (38, 'Scranton', 'scranton-pa'), (38, 'Bethlehem', 'bethlehem-pa'), (38, 'Lancaster', 'lancaster-pa'), (38, 'Harrisburg', 'harrisburg-pa'), (38, 'Altoona', 'altoona-pa'), (38, 'York', 'york-pa'), (38, 'Wilkes-Barre', 'wilkes-barre-pa'),
-- Rhode Island
(39, 'Providence', 'providence-ri'), (39, 'Warwick', 'warwick-ri'), (39, 'Cranston', 'cranston-ri'), (39, 'Pawtucket', 'pawtucket-ri'), (39, 'East Providence', 'east-providence-ri'), (39, 'Woonsocket', 'woonsocket-ri'), (39, 'Cumberland', 'cumberland-ri'), (39, 'Coventry', 'coventry-ri'),
-- South Carolina
(40, 'Charleston', 'charleston-sc'), (40, 'Columbia', 'columbia-sc'), (40, 'North Charleston', 'north-charleston-sc'), (40, 'Mount Pleasant', 'mount-pleasant-sc'), (40, 'Rock Hill', 'rock-hill-sc'), (40, 'Greenville', 'greenville-sc'), (40, 'Summerville', 'summerville-sc'), (40, 'Goose Creek', 'goose-creek-sc'), (40, 'Hilton Head Island', 'hilton-head-island-sc'), (40, 'Spartanburg', 'spartanburg-sc'),
-- South Dakota
(41, 'Sioux Falls', 'sioux-falls-sd'), (41, 'Rapid City', 'rapid-city-sd'), (41, 'Aberdeen', 'aberdeen-sd'), (41, 'Brookings', 'brookings-sd'), (41, 'Watertown', 'watertown-sd'), (41, 'Mitchell', 'mitchell-sd'), (41, 'Yankton', 'yankton-sd'), (41, 'Pierre', 'pierre-sd'),
-- Tennessee
(42, 'Nashville', 'nashville-tn'), (42, 'Memphis', 'memphis-tn'), (42, 'Knoxville', 'knoxville-tn'), (42, 'Chattanooga', 'chatta-tn'), (42, 'Clarksville', 'clarksville-tn'), (42, 'Murfreesboro', 'murfreesboro-tn'), (42, 'Franklin', 'franklin-tn'), (42, 'Jackson', 'jackson-tn'), (42, 'Johnson City', 'johnson-city-tn'), (42, 'Bartlett', 'bartlett-tn'), (42, 'Hendersonville', 'hendersonville-tn'),
-- Texas
(43, 'Houston', 'houston-tx'), (43, 'San Antonio', 'san-antonio-tx'), (43, 'Dallas', 'dallas-tx'), (43, 'Austin', 'austin-tx'), (43, 'Fort Worth', 'fort-worth-tx'), (43, 'El Paso', 'el-paso-tx'), (43, 'Arlington', 'arlington-tx'), (43, 'Corpus Christi', 'corpus-tx'), (43, 'Plano', 'plano-tx'), (43, 'Laredo', 'laredo-tx'), (43, 'Lubbock', 'lubbock-tx'), (43, 'Irving', 'irving-tx'), (43, 'Amarillo', 'amarillo-tx'), (43, 'Grand Prairie', 'grand-prairie-tx'), (43, 'Brownsville', 'brownsville-tx'), (43, 'McKinney', 'mckinney-tx'), (43, 'Frisco', 'frisco-tx'), (43, 'Pasadena', 'pasadena-tx'), (43, 'Mesquite', 'mesquite-tx'), (43, 'Killeen', 'killeen-tx'), (43, 'McAllen', 'mcallen-tx'), (43, 'Carrollton', 'carrollton-tx'), (43, 'Waco', 'waco-tx'), (43, 'Denton', 'denton-tx'), (43, 'Abilene', 'abilene-tx'), (43, 'Midland', 'midland-tx'), (43, 'Beaumont', 'beaumont-tx'), (43, 'Round Rock', 'round-rock-tx'), (43, 'Odessa', 'odessa-tx'), (43, 'Tyler', 'tyler-tx'), (43, 'College Station', 'college-station-tx'), (43, 'Richardson', 'richardson-tx'), (43, 'Pearland', 'pearland-tx'), (43, 'Wichita Falls', 'wichita-falls-tx'), (43, 'Lewisville', 'lewisville-tx'), (43, 'Sugar Land', 'sugar-land-tx'), (43, 'San Angelo', 'san-angelo-tx'), (43, 'Conroe', 'conroe-tx'), (43, 'New Braunfels', 'new-braunfels-tx'), (43, 'Temple', 'temple-tx'), (43, 'Baytown', 'baytown-tx'), (43, 'Cedar Park', 'cedar-park-tx'), (43, 'Galveston', 'galveston-tx'), (43, 'Grapevine', 'grapevine-tx'), (43, 'Longview', 'longview-tx'),
-- Utah
(44, 'Salt Lake City', 'salt-lake-city-ut'), (44, 'West Valley City', 'west-valley-city-ut'), (44, 'Provo', 'provo-ut'), (44, 'West Jordan', 'west-jordan-ut'), (44, 'Orem', 'orem-ut'), (44, 'Sandy', 'sandy-ut'), (44, 'Ogden', 'ogden-ut'), (44, 'St. George', 'st-george-ut'), (44, 'Layton', 'layton-ut'), (44, 'South Jordan', 'south-jordan-ut'), (44, 'Lehi', 'lehi-ut'),
-- Vermont
(45, 'Burlington', 'burlington-vt'), (45, 'South Burlington', 'south-burlington-vt'), (45, 'Rutland', 'rutland-vt'), (45, 'Barre', 'barre-vt'), (45, 'Montpelier', 'montpelier-vt'), (45, 'Winooski', 'winooski-vt'), (45, 'St. Albans', 'st-albans-vt'),
-- Virginia
(46, 'Virginia Beach', 'virginia-beach-va'), (46, 'Norfolk', 'norfolk-va'), (46, 'Chesapeake', 'chesapeake-va'), (46, 'Richmond', 'richmond-va'), (46, 'Newport News', 'newport-news-va'), (46, 'Alexandria', 'alexandria-va'), (46, 'Hampton', 'hampton-va'), (46, 'Roanoke', 'roanoke-va'), (46, 'Portsmouth', 'portsmouth-va'), (46, 'Suffolk', 'suffolk-va'), (46, 'Lynchburg', 'lynchburg-va'), (46, 'Harrisonburg', 'harrisonburg-va'),
-- Washington
(47, 'Seattle', 'seattle-wa'), (47, 'Spokane', 'spokane-wa'), (47, 'Tacoma', 'tacoma-wa'), (47, 'Vancouver', 'vancouver-wa'), (47, 'Bellevue', 'bellevue-wa'), (47, 'Kent', 'kent-wa'), (47, 'Everett', 'everett-wa'), (47, 'Renton', 'renton-wa'), (47, 'Federal Way', 'federal-way-wa'), (47, 'Yakima', 'yakima-wa'), (47, 'Bellingham', 'bellingham-wa'), (47, 'Spokane Valley', 'spokane-valley-wa'), (47, 'Kennewick', 'kennewick-wa'), (47, 'Auburn', 'auburn-wa'),
-- West Virginia
(48, 'Charleston', 'charleston-wv'), (48, 'Huntington', 'huntington-wv'), (48, 'Morgantown', 'morgantown-wv'), (48, 'Parkersburg', 'parkersburg-wv'), (48, 'Wheeling', 'wheeling-wv'), (48, 'Weirton', 'weirton-wv'), (48, 'Martinsburg', 'martinsburg-wv'), (48, 'Beckley', 'beckley-wv'),
-- Wisconsin
(49, 'Milwaukee', 'milwaukee-wi'), (49, 'Madison', 'madison-wi'), (49, 'Green Bay', 'green-bay-wi'), (49, 'Kenosha', 'kenosha-wi'), (49, 'Racine', 'racine-wi'), (49, 'Appleton', 'appleton-wi'), (49, 'Waukesha', 'waukesha-wi'), (49, 'Eau Claire', 'eau-claire-wi'), (49, 'Oshkosh', 'oshkosh-wi'), (49, 'Janesville', 'janesville-wi'), (49, 'West Allis', 'west-allis-wi'), (49, 'La Crosse', 'la-crosse-wi'),
-- Wyoming
(50, 'Cheyenne', 'cheyenne-wy'), (50, 'Casper', 'casper-wy'), (50, 'Laramie', 'laramie-wy'), (50, 'Gillette', 'gillette-wy'), (50, 'Rock Springs', 'rock-springs-wy'), (50, 'Sheridan', 'sheridan-wy'), (50, 'Green River', 'green-river-wy'), (50, 'Evanston', 'evanston-wy'),
-- Ontario
(51, 'Toronto', 'toronto-on'), (51, 'Ottawa', 'ottawa-on'), (51, 'Mississauga', 'mississauga-on'), (51, 'Brampton', 'brampton-on'), (51, 'Hamilton', 'hamilton-on'), (51, 'London', 'london-on'), (51, 'Markham', 'markham-on'), (51, 'Vaughan', 'vaughan-on'), (51, 'Kitchener', 'kitchener-on'), (51, 'Windsor', 'windsor-on'), (51, 'Oshawa', 'oshawa-on'), (51, 'Barrie', 'barrie-on'), (51, 'Guelph', 'guelph-on'), (51, 'Burlington', 'burlington-on'), (51, 'Sudbury', 'sudbury-on'), (51, 'St. Catharines', 'st-catharines-on'), (51, 'Thunder Bay', 'thunder-bay-on'), (51, 'Cambridge', 'cambridge-on'), (51, 'Kingston', 'kingston-on'), (51, 'Whitby', 'whitby-on'), (51, 'Ajax', 'ajax-on'), (51, 'Milton', 'milton-on'), (51, 'Waterloo', 'waterloo-on'), (51, 'Chatham-Kent', 'chatham-kent-on'), (51, 'Peterborough', 'peterborough-on'), (51, 'Kawartha Lakes', 'kawartha-lakes-on'), (51, 'Sault Ste. Marie', 'sault-ste-marie-on'), (51, 'Sarnia', 'sarnia-on'), (51, 'Newmarket', 'newmarket-on'),
-- Quebec
(52, 'Montreal', 'montreal-qc'), (52, 'Quebec City', 'quebec-city-qc'), (52, 'Laval', 'laval-qc'), (52, 'Gatineau', 'gatineau-qc'), (52, 'Longueuil', 'longueuil-qc'), (52, 'Sherbrooke', 'sherbrooke-qc'), (52, 'Saguenay', 'saguenay-qc'), (52, 'Levis', 'levis-qc'), (52, 'Trois-Rivieres', 'trois-rivieres-qc'), (52, 'Terrebonne', 'terrebonne-qc'), (52, 'Saint-Jean-sur-Richelieu', 'st-jean-qc'), (52, 'Repentigny', 'repentigny-qc'), (52, 'Brossard', 'brossard-qc'), (52, 'Drummondville', 'drummondville-qc'), (52, 'Saint-Jerome', 'st-jerome-qc'), (52, 'Granby', 'granby-qc'), (52, 'Blainville', 'blainville-qc'), (52, 'Saint-Hyacinthe', 'st-hyacinthe-qc'),
-- British Columbia
(53, 'Vancouver', 'vancouver-bc'), (53, 'Surrey', 'surrey-bc'), (53, 'Burnaby', 'burnaby-bc'), (53, 'Victoria', 'victoria-bc'), (53, 'Kelowna', 'kelowna-bc'), (53, 'Langley', 'langley-bc'), (53, 'Abbotsford', 'abbotsford-bc'), (53, 'Coquitlam', 'coquitlam-bc'), (53, 'Richmond', 'richmond-bc'), (53, 'Nanaimo', 'nanaimo-bc'), (53, 'Kamloops', 'kamloops-bc'), (53, 'Chilliwack', 'chilliwack-bc'), (53, 'Prince George', 'prince-george-bc'), (53, 'New Westminster', 'new-westminster-bc'), (53, 'Vernon', 'vernon-bc'), (53, 'Penticton', 'penticton-bc'), (53, 'Maple Ridge', 'maple-ridge-bc'), (53, 'Port Coquitlam', 'port-coquitlam-bc'), (53, 'Delta', 'delta-bc'), (53, 'North Vancouver', 'north-vancouver-bc'), (53, 'Camery', 'camery-bc'),
-- Alberta
(54, 'Calgary', 'calgary-ab'), (54, 'Edmonton', 'edmonton-ab'), (54, 'Red Deer', 'red-deer-ab'), (54, 'Lethbridge', 'lethbridge-ab'), (54, 'St. Albert', 'st-albert-ab'), (54, 'Medicine Hat', 'medicine-hat-ab'), (54, 'Grande Prairie', 'grande-prairie-ab'), (54, 'Airdrie', 'airdrie-ab'), (54, 'Spruce Grove', 'spruce-grove-ab'), (54, 'Leduc', 'leduc-ab'), (54, 'Lloydminster', 'lloydminster-ab'),
-- Manitoba
(55, 'Winnipeg', 'winnipeg-mb'), (55, 'Brandon', 'brand-mb'), (55, 'Steinbach', 'steinbach-mb'), (55, 'Thompson', 'thompson-mb'), (55, 'Portage la Prairie', 'portage-mb'), (55, 'Winkler', 'winkler-mb'),
-- Saskatchewan
(56, 'Saskatoon', 'saskatoon-sk'), (56, 'Regina', 'regina-sk'), (56, 'Prince Albert', 'prince-albert-sk'), (56, 'Moose Jaw', 'moose-jaw-sk'), (56, 'Swift Current', 'swift-current-sk'), (56, 'Yorkton', 'yorkton-sk'), (56, 'North Battleford', 'north-battleford-sk'),
-- Nova Scotia
(57, 'Halifax', 'halifax-ns'), (57, 'Sydney', 'sydney-ns'), (57, 'Dartmouth', 'dartmouth-ns'), (57, 'Truro', 'truro-ns'), (57, 'New Glasgow', 'new-glasgow-ns'), (57, 'Glace Bay', 'glace-bay-ns'),
-- New Brunswick
(58, 'Moncton', 'moncton-nb'), (58, 'Saint John', 'saint-john-nb'), (58, 'Fredericton', 'fredericton-nb'), (58, 'Dieppe', 'dieppe-nb'), (58, 'Riverview', 'riverview-nb'), (58, 'Quispamsis', 'quispamsis-nb'), (58, 'Edmundston', 'edmundston-nb'), (58, 'Miramichi', 'miramichi-nb'),
-- Newfoundland and Labrador
(59, 'St. Johns', 'st-johns-nl'), (59, 'Mount Pearl', 'mount-pearl-nl'), (59, 'Conception Bay South', 'cbs-nl'), (59, 'Corner Brook', 'corner-brook-nl'), (59, 'Grand Falls-Windsor', 'gfw-nl'), (59, 'Paradise', 'paradise-nl'),
-- Prince Edward Island
(60, 'Charlottetown', 'charlottetown-pe'), (60, 'Summerside', 'summerside-pe'), (60, 'Stratford', 'stratford-pe'), (60, 'Cornwall', 'cornwall-pe'),
-- Northwest Territories
(61, 'Yellowknife', 'yellowknife-nt'), (61, 'Hay River', 'hay-river-nt'), (61, 'Inuvik', 'inuvik-nt'),
-- Nunavut
(62, 'Iqaluit', 'iqaluit-nu'), (62, 'Arviat', 'arviat-nu'), (62, 'Rankin Inlet', 'rankin-inlet-nu'),
-- Yukon
(63, 'Whitehorse', 'whitehorse-yt'), (63, 'Dawson City', 'dawson-city-yt'), (63, 'Watson Lake', 'watson-lake-yt');
