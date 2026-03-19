-- THE ABSOLUTE "FIX-ALL" SCRIPT (Run this and you ARE DONE!)
USE escort_db;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS cities;
DROP TABLE IF EXISTS states;

-- 1. Rebuild States Table
CREATE TABLE states (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  code CHAR(2) NOT NULL UNIQUE
);

-- 2. Rebuild Cities Table
CREATE TABLE cities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  state_id INT,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(150) NOT NULL UNIQUE,
  FOREIGN KEY (state_id) REFERENCES states(id) ON DELETE CASCADE
);

SET FOREIGN_KEY_CHECKS = 1;

-- 3. Insert All 63 States/Provinces
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

-- 4. Insert All 400+ Cities
INSERT INTO cities (state_id, name, slug) VALUES 
(1, 'Birmingham', 'birmingham-al'), (1, 'Montgomery', 'montgomery-al'), (1, 'Mobile', 'mobile-al'), (1, 'Huntsville', 'huntsville-al'), (1, 'Tuscaloosa', 'tuscaloosa-al'),
(2, 'Anchorage', 'anchorage-ak'), (2, 'Fairbanks', 'fairbanks-ak'), (2, 'Juneau', 'juneau-ak'), (2, 'Sitka', 'sitka-ak'), (2, 'Ketchikan', 'ketchikan-ak'),
(3, 'Phoenix', 'phoenix-az'), (3, 'Tucson', 'tucson-az'), (3, 'Mesa', 'mesa-az'), (3, 'Chandler', 'chandler-az'), (3, 'Scottsdale', 'scottsdale-az'), (3, 'Glendale', 'glendale-az'), (3, 'Gilbert', 'gilbert-az'), (3, 'Tempe', 'tempe-az'),
(4, 'Little Rock', 'little-rock-ar'), (4, 'Fort Smith', 'fort-smith-ar'), (4, 'Fayetteville', 'fayetteville-ar'), (4, 'Springdale', 'springdale-ar'), (4, 'Jonesboro', 'jonesboro-ar'),
(5, 'Los Angeles', 'los-angeles-ca'), (5, 'San Diego', 'san-diego-ca'), (5, 'San Jose', 'san-jose-ca'), (5, 'San Francisco', 'san-francisco-ca'), (5, 'Fresno', 'fresno-ca'), (5, 'Sacramento', 'sacramento-ca'), (5, 'Long Beach', 'long-beach-ca'), (5, 'Oakland', 'oakland-ca'), (5, 'Bakersfield', 'bakersfield-ca'), (5, 'Anaheim', 'anaheim-ca'), (5, 'Santa Ana', 'santa-ana-ca'), (5, 'Riverside', 'riverside-ca'), (5, 'Stockton', 'stockton-ca'), (5, 'Irvine', 'irvine-ca'),
(6, 'Denver', 'denver-co'), (6, 'Colorado Springs', 'colorado-springs-co'), (6, 'Aurora', 'aurora-co'), (6, 'Fort Collins', 'fort-collins-co'), (6, 'Lakewood', 'lakewood-co'),
(7, 'Bridgeport', 'bridgeport-ct'), (7, 'New Haven', 'new-haven-ct'), (7, 'Stamford', 'stamford-ct'), (7, 'Hartford', 'hartford-ct'), (7, 'Waterbury', 'waterbury-ct'),
(8, 'Wilmington', 'wilmington-de'), (8, 'Dover', 'dover-de'), (8, 'Newark', 'newark-de'), (8, 'Middletown', 'middletown-de'), (8, 'Smyrna', 'smyrna-de'),
(9, 'Miami', 'miami-fl'), (9, 'Tampa', 'tampa-fl'), (9, 'Orlando', 'orlando-fl'), (9, 'Jacksonville', 'jacksonville-fl'), (9, 'Fort Lauderdale', 'fort-lauderdale-fl'), (9, 'Tallahassee', 'tallahassee-fl'), (9, 'St. Petersburg', 'st-petersburg-fl'), (9, 'Hialeah', 'hialeah-fl'), (9, 'Port St. Lucie', 'port-st-lucie-fl'), (9, 'Cape Coral', 'cape-coral-fl'), (9, 'Pembroke Pines', 'pembroke-pines-fl'),
(10, 'Atlanta', 'atlanta-ga'), (10, 'Augusta', 'augusta-ga'), (10, 'Columbus', 'columbus-ga'), (10, 'Macon', 'macon-ga'), (10, 'Savannah', 'savannah-ga'),
(11, 'Honolulu', 'honolulu-hi'), (11, 'Hilo', 'hilo-hi'), (11, 'Kailua', 'kailua-hi'), (11, 'Kapolei', 'kapolei-hi'), (11, 'Kaneohe', 'kaneohe-hi'),
(12, 'Boise', 'boise-id'), (12, 'Meridian', 'meridian-id'), (12, 'Nampa', 'nampa-id'), (12, 'Idaho Falls', 'idaho-falls-id'), (12, 'Caldwell', 'caldwell-id'),
(13, 'Chicago', 'chicago-il'), (13, 'Aurora', 'aurora-il'), (13, 'Rockford', 'rockford-il'), (13, 'Joliet', 'joliet-il'), (13, 'Naperville', 'naperville-il'), (13, 'Springfield', 'springfield-il'),
(14, 'Indianapolis', 'indianapolis-in'), (14, 'Fort Wayne', 'fort-wayne-in'), (14, 'Evansville', 'evansville-in'), (14, 'South Bend', 'south-bend-in'), (14, 'Carmel', 'carmel-in'),
(15, 'Des Moines', 'des-moines-ia'), (15, 'Cedar Rapids', 'cedar-rapids-ia'), (15, 'Davenport', 'davenport-ia'), (15, 'Sioux City', 'sioux-city-ia'), (15, 'Iowa City', 'iowa-city-ia'),
(16, 'Wichita', 'wichita-ks'), (16, 'Overland Park', 'overland-park-ks'), (16, 'Kansas City', 'kansas-city-ks'), (16, 'Olathe', 'olathe-ks'), (16, 'Topeka', 'topeka-ks'),
(17, 'Louisville', 'louisville-ky'), (17, 'Lexington', 'lexington-ky'), (17, 'Bowling Green', 'bowling-green-ky'), (17, 'Owensboro', 'owensboro-ky'), (17, 'Covington', 'covington-ky'),
(18, 'New Orleans', 'new-orleans-la'), (18, 'Baton Rouge', 'baton-rouge-la'), (18, 'Shreveport', 'shreveport-la'), (18, 'Metairie', 'metairie-la'), (18, 'Lafayette', 'lafayette-la'),
(19, 'Portland', 'portland-me'), (19, 'Lewiston', 'lewiston-me'), (19, 'Bangor', 'bangor-me'), (19, 'South Portland', 'south-portland-me'), (19, 'Auburn', 'auburn-me'),
(20, 'Baltimore', 'baltimore-md'), (20, 'Columbia', 'columbia-md'), (20, 'Germantown', 'germantown-md'), (20, 'Silver Spring', 'silver-spring-md'), (20, 'Waldorf', 'waldorf-md'),
(21, 'Boston', 'boston-ma'), (21, 'Worcester', 'worcester-ma'), (21, 'Springfield', 'springfield-ma'), (21, 'Cambridge', 'cambridge-ma'), (21, 'Lowell', 'lowell-ma'),
(22, 'Detroit', 'detroit-mi'), (22, 'Grand Rapids', 'grand-rapids-mi'), (22, 'Warren', 'warren-mi'), (22, 'Sterling Heights', 'sterling-heights-mi'), (22, 'Ann Arbor', 'ann-arbor-mi'),
(23, 'Minneapolis', 'minneapolis-mn'), (23, 'Saint Paul', 'saint-paul-mn'), (23, 'Rochester', 'rochester-mn'), (23, 'Duluth', 'duluth-mn'), (23, 'Bloomington', 'bloomington-mn'),
(24, 'Jackson', 'jackson-ms'), (24, 'Gulfport', 'gulfport-ms'), (24, 'Southaven', 'southaven-ms'), (24, 'Biloxi', 'biloxi-ms'), (24, 'Hattiesburg', 'hattiesburg-ms'),
(25, 'Kansas City', 'kansas-city-mo'), (25, 'Saint Louis', 'saint-louis-mo'), (25, 'Springfield', 'springfield-mo'), (25, 'Independence', 'independence-mo'), (25, 'Columbia', 'columbia-mo'),
(26, 'Billings', 'billings-mt'), (26, 'Missoula', 'missoula-mt'), (26, 'Great Falls', 'great-falls-mt'), (26, 'Bozeman', 'bozeman-mt'), (26, 'Helena', 'helena-mt'),
(27, 'Omaha', 'omaha-ne'), (27, 'Lincoln', 'lincoln-ne'), (27, 'Bellevue', 'bellevue-ne'), (27, 'Grand Island', 'grand-island-ne'), (27, 'Kearney', 'kearney-ne'),
(28, 'Las Vegas', 'las-vegas-nv'), (28, 'Henderson', 'henderson-nv'), (28, 'Reno', 'reno-nv'), (28, 'North Las Vegas', 'north-las-vegas-nv'), (28, 'Sparks', 'sparks-nv'),
(29, 'Manchester', 'manchester-nh'), (29, 'Nashua', 'nashua-nh'), (29, 'Concord', 'concord-nh'), (29, 'Derry', 'derry-nh'), (29, 'Rochester', 'rochester-nh'),
(30, 'Newark', 'newark-nj'), (30, 'Jersey City', 'jersey-city-nj'), (30, 'Paterson', 'paterson-nj'), (30, 'Elizabeth', 'elizabeth-nj'), (30, 'Edison', 'edison-nj'),
(31, 'Albuquerque', 'albuquerque-nm'), (31, 'Las Cruces', 'las-cruces-nm'), (31, 'Rio Rancho', 'rio-rancho-nm'), (31, 'Santa Fe', 'santa-fe-nm'), (31, 'Roswell', 'roswell-nm'),
(32, 'New York City', 'new-york-city-ny'), (32, 'Buffalo', 'buffalo-ny'), (32, 'Rochester', 'rochester-ny'), (32, 'Yonkers', 'yonkers-ny'), (32, 'Syracuse', 'syracuse-ny'), (32, 'Albany', 'albany-ny'),
(33, 'Charlotte', 'charlotte-nc'), (33, 'Raleigh', 'raleigh-nc'), (33, 'Greensboro', 'greensboro-nc'), (33, 'Durham', 'durham-nc'), (33, 'Winston-Salem', 'winston-salem-nc'),
(34, 'Fargo', 'fargo-nd'), (34, 'Bismarck', 'bismarck-nd'), (34, 'Grand Forks', 'grand-forks-nd'), (34, 'Minot', 'minot-nd'), (34, 'West Fargo', 'west-fargo-nd'),
(35, 'Columbus', 'columbus-oh'), (35, 'Cleveland', 'cleveland-oh'), (35, 'Cincinnati', 'cincinnati-oh'), (35, 'Toledo', 'toledo-oh'), (35, 'Akron', 'akron-oh'), (35, 'Dayton', 'dayton-oh'),
(36, 'Oklahoma City', 'oklahoma-city-ok'), (36, 'Tulsa', 'tulsa-ok'), (36, 'Norman', 'norman-ok'), (36, 'Broken Arrow', 'broken-arrow-ok'), (36, 'Lawton', 'lawton-ok'),
(37, 'Portland', 'portland-or'), (37, 'Salem', 'salem-or'), (37, 'Eugene', 'eugene-or'), (37, 'Gresham', 'gresham-or'), (37, 'Hillsboro', 'hillsboro-or'),
(38, 'Philadelphia', 'philadelphia-pa'), (38, 'Pittsburgh', 'pittsburgh-pa'), (38, 'Allentown', 'allentown-pa'), (38, 'Erie', 'erie-pa'), (38, 'Reading', 'reading-pa'),
(39, 'Providence', 'providence-ri'), (39, 'Warwick', 'warwick-ri'), (39, 'Cranston', 'cranston-ri'), (39, 'Pawtucket', 'pawtucket-ri'), (39, 'East Providence', 'east-providence-ri'),
(40, 'Charleston', 'charleston-sc'), (40, 'Columbia', 'columbia-sc'), (40, 'North Charleston', 'north-charleston-sc'), (40, 'Mount Pleasant', 'mount-pleasant-sc'), (40, 'Rock Hill', 'rock-hill-sc'),
(41, 'Sioux Falls', 'sioux-falls-sd'), (41, 'Rapid City', 'rapid-city-sd'), (41, 'Aberdeen', 'aberdeen-sd'), (41, 'Brookings', 'brookings-sd'), (41, 'Watertown', 'watertown-sd'),
(42, 'Nashville', 'nashville-tn'), (42, 'Memphis', 'memphis-tn'), (42, 'Knoxville', 'knoxville-tn'), (42, 'Chattanooga', 'chatta-tn'), (42, 'Clarksville', 'clarksville-tn'),
(43, 'Houston', 'houston-tx'), (43, 'San Antonio', 'san-antonio-tx'), (43, 'Dallas', 'dallas-tx'), (43, 'Austin', 'austin-tx'), (43, 'Fort Worth', 'fort-worth-tx'), (43, 'El Paso', 'el-paso-tx'), (43, 'Arlington', 'arlington-tx'), (43, 'Corpus Christi', 'corpus-tx'), (43, 'Plano', 'plano-tx'), (43, 'Laredo', 'laredo-tx'), (43, 'Lubbock', 'lubbock-tx'), (43, 'Irving', 'irving-tx'), (43, 'Amarillo', 'amarillo-tx'),
(44, 'Salt Lake City', 'salt-lake-city-ut'), (44, 'West Valley City', 'west-valley-city-ut'), (44, 'Provo', 'provo-ut'), (44, 'West Jordan', 'west-jordan-ut'), (44, 'Orem', 'orem-ut'),
(45, 'Burlington', 'burlington-vt'), (45, 'South Burlington', 'south-burlington-vt'), (45, 'Rutland', 'rutland-vt'), (45, 'Barre', 'barre-vt'), (45, 'Montpelier', 'montpelier-vt'),
(46, 'Virginia Beach', 'virginia-beach-va'), (46, 'Norfolk', 'norfolk-va'), (46, 'Chesapeake', 'chesapeake-va'), (46, 'Richmond', 'richmond-va'), (46, 'Newport News', 'newport-news-va'),
(47, 'Seattle', 'seattle-wa'), (47, 'Spokane', 'spokane-wa'), (47, 'Tacoma', 'tacoma-wa'), (47, 'Vancouver', 'vancouver-wa'), (47, 'Bellevue', 'bellevue-wa'), (47, 'Kent', 'kent-wa'), (47, 'Everett', 'everett-wa'),
(48, 'Charleston', 'charleston-wv'), (48, 'Huntington', 'huntington-wv'), (48, 'Morgantown', 'morgantown-wv'), (48, 'Parkersburg', 'parkersburg-wv'), (48, 'Wheeling', 'wheeling-wv'),
(49, 'Milwaukee', 'milwaukee-wi'), (49, 'Madison', 'madison-wi'), (49, 'Green Bay', 'green-bay-wi'), (49, 'Kenosha', 'kenosha-wi'), (49, 'Racine', 'racine-wi'),
(50, 'Cheyenne', 'cheyenne-wy'), (50, 'Casper', 'casper-wy'), (50, 'Laramie', 'laramie-wy'), (50, 'Gillette', 'gillette-wy'), (50, 'Rock Springs', 'rock-springs-wy'),
(51, 'Toronto', 'toronto-on'), (51, 'Ottawa', 'ottawa-on'), (51, 'Mississauga', 'mississauga-on'), (51, 'Brampton', 'brampton-on'), (51, 'Hamilton', 'hamilton-on'), (51, 'London', 'london-on'), (51, 'Markham', 'markham-on'), (51, 'Vaughan', 'vaughan-on'),
(52, 'Montreal', 'montreal-qc'), (52, 'Quebec City', 'quebec-city-qc'), (52, 'Laval', 'laval-qc'), (52, 'Gatineau', 'gatineau-qc'), (52, 'Longueuil', 'longueuil-qc'),
(53, 'Vancouver', 'vancouver-bc'), (53, 'Surrey', 'surrey-bc'), (53, 'Burnaby', 'burnaby-bc'), (53, 'Victoria', 'victoria-bc'), (53, 'Kelowna', 'kelowna-bc'),
(54, 'Calgary', 'calgary-ab'), (54, 'Edmonton', 'edmonton-ab'), (54, 'Red Deer', 'red-deer-ab'), (54, 'Lethbridge', 'lethbridge-ab'),
(55, 'Winnipeg', 'winnipeg-mb'), (55, 'Brandon', 'brand-mb'),
(56, 'Saskatoon', 'saskatoon-sk'), (56, 'Regina', 'regina-sk'),
(57, 'Halifax', 'halifax-ns'), (57, 'Sydney', 'sydney-ns'),
(58, 'Moncton', 'moncton-nb'), (58, 'Saint John', 'saint-john-nb'), (58, 'Fredericton', 'fredericton-nb'),
(59, 'St. Johns', 'st-johns-nl'), (59, 'Mount Pearl', 'mount-pearl-nl'),
(60, 'Charlottetown', 'charlottetown-pe'), (60, 'Summerside', 'summerside-pe'),
(61, 'Yellowknife', 'yellowknife-nt'),
(62, 'Iqaluit', 'iqaluit-nu'),
(63, 'Whitehorse', 'whitehorse-yt');
