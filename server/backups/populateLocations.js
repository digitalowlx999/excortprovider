import pool from './db.js';

const states = [
  { name: 'Alabama', code: 'AL' },
  { name: 'Alaska', code: 'AK' },
  { name: 'Arizona', code: 'AZ' },
  { name: 'Arkansas', code: 'AR' },
  { name: 'California', code: 'CA' },
  { name: 'Colorado', code: 'CO' },
  { name: 'Connecticut', code: 'CT' },
  { name: 'Delaware', code: 'DE' },
  { name: 'Florida', code: 'FL' },
  { name: 'Georgia', code: 'GA' },
  { name: 'Hawaii', code: 'HI' },
  { name: 'Idaho', code: 'ID' },
  { name: 'Illinois', code: 'IL' },
  { name: 'Indiana', code: 'IN' },
  { name: 'Iowa', code: 'IA' },
  { name: 'Kansas', code: 'KS' },
  { name: 'Kentucky', code: 'KY' },
  { name: 'Louisiana', code: 'LA' },
  { name: 'Maine', code: 'ME' },
  { name: 'Maryland', code: 'MD' },
  { name: 'Massachusetts', code: 'MA' },
  { name: 'Michigan', code: 'MI' },
  { name: 'Minnesota', code: 'MN' },
  { name: 'Mississippi', code: 'MS' },
  { name: 'Missouri', code: 'MO' },
  { name: 'Montana', code: 'MT' },
  { name: 'Nebraska', code: 'NE' },
  { name: 'Nevada', code: 'NV' },
  { name: 'New Hampshire', code: 'NH' },
  { name: 'New Jersey', code: 'NJ' },
  { name: 'New Mexico', code: 'NM' },
  { name: 'New York', code: 'NY' },
  { name: 'North Carolina', code: 'NC' },
  { name: 'North Dakota', code: 'ND' },
  { name: 'Ohio', code: 'OH' },
  { name: 'Oklahoma', code: 'OK' },
  { name: 'Oregon', code: 'OR' },
  { name: 'Pennsylvania', code: 'PA' },
  { name: 'Rhode Island', code: 'RI' },
  { name: 'South Carolina', code: 'SC' },
  { name: 'South Dakota', code: 'SD' },
  { name: 'Tennessee', code: 'TN' },
  { name: 'Texas', code: 'TX' },
  { name: 'Utah', code: 'UT' },
  { name: 'Vermont', code: 'VT' },
  { name: 'Virginia', code: 'VA' },
  { name: 'Washington', code: 'WA' },
  { name: 'West Virginia', code: 'WV' },
  { name: 'Wisconsin', code: 'WI' },
  { name: 'Wyoming', code: 'WY' }
];

const cities = {
  'AL': ['Birmingham', 'Montgomery', 'Mobile', 'Huntsville', 'Tuscaloosa'],
  'AK': ['Anchorage', 'Fairbanks', 'Juneau', 'Sitka', 'Ketchikan'],
  'AZ': ['Phoenix', 'Tucson', 'Mesa', 'Chandler', 'Scottsdale', 'Glendale', 'Gilbert', 'Tempe'],
  'AR': ['Little Rock', 'Fort Smith', 'Fayetteville', 'Springdale', 'Jonesboro'],
  'CA': ['Los Angeles', 'San Diego', 'San Jose', 'San Francisco', 'Fresno', 'Sacramento', 'Long Beach', 'Oakland', 'Bakersfield', 'Anaheim', 'Santa Ana', 'Riverside', 'Stockton', 'Irvine'],
  'CO': ['Denver', 'Colorado Springs', 'Aurora', 'Fort Collins', 'Lakewood'],
  'CT': ['Bridgeport', 'New Haven', 'Stamford', 'Hartford', 'Waterbury'],
  'DE': ['Wilmington', 'Dover', 'Newark', 'Middletown', 'Smyrna'],
  'FL': ['Miami', 'Tampa', 'Orlando', 'Jacksonville', 'Fort Lauderdale', 'Tallahassee', 'St. Petersburg', 'Hialeah', 'Port St. Lucie', 'Cape Coral', 'Pembroke Pines'],
  'GA': ['Atlanta', 'Augusta', 'Columbus', 'Macon', 'Savannah'],
  'HI': ['Honolulu', 'Hilo', 'Kailua', 'Kapolei', 'Kaneohe'],
  'ID': ['Boise', 'Meridian', 'Nampa', 'Idaho Falls', 'Caldwell'],
  'IL': ['Chicago', 'Aurora', 'Rockford', 'Joliet', 'Naperville', 'Springfield'],
  'IN': ['Indianapolis', 'Fort Wayne', 'Evansville', 'South Bend', 'Carmel'],
  'IA': ['Des Moines', 'Cedar Rapids', 'Davenport', 'Sioux City', 'Iowa City'],
  'KS': ['Wichita', 'Overland Park', 'Kansas City', 'Olathe', 'Topeka'],
  'KY': ['Louisville', 'Lexington', 'Bowling Green', 'Owensboro', 'Covington'],
  'LA': ['New Orleans', 'Baton Rouge', 'Shreveport', 'Metairie', 'Lafayette'],
  'ME': ['Portland', 'Lewiston', 'Bangor', 'South Portland', 'Auburn'],
  'MD': ['Baltimore', 'Columbia', 'Germantown', 'Silver Spring', 'Waldorf'],
  'MA': ['Boston', 'Worcester', 'Springfield', 'Cambridge', 'Lowell'],
  'MI': ['Detroit', 'Grand Rapids', 'Warren', 'Sterling Heights', 'Ann Arbor'],
  'MN': ['Minneapolis', 'Saint Paul', 'Rochester', 'Duluth', 'Bloomington'],
  'MS': ['Jackson', 'Gulfport', 'Southaven', 'Biloxi', 'Hattiesburg'],
  'MO': ['Kansas City', 'Saint Louis', 'Springfield', 'Independence', 'Columbia'],
  'MT': ['Billings', 'Missoula', 'Great Falls', 'Bozeman', 'Helena'],
  'NE': ['Omaha', 'Lincoln', 'Bellevue', 'Grand Island', 'Kearney'],
  'NV': ['Las Vegas', 'Henderson', 'Reno', 'North Las Vegas', 'Sparks'],
  'NH': ['Manchester', 'Nashua', 'Concord', 'Derry', 'Rochester'],
  'NJ': ['Newark', 'Jersey City', 'Paterson', 'Elizabeth', 'Edison'],
  'NM': ['Albuquerque', 'Las Cruces', 'Rio Rancho', 'Santa Fe', 'Roswell'],
  'NY': ['New York', 'Buffalo', 'Rochester', 'Yonkers', 'Syracuse', 'Albany'],
  'NC': ['Charlotte', 'Raleigh', 'Greensboro', 'Durham', 'Winston-Salem'],
  'ND': ['Fargo', 'Bismarck', 'Grand Forks', 'Minot', 'West Fargo'],
  'OH': ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron', 'Dayton'],
  'OK': ['Oklahoma City', 'Tulsa', 'Norman', 'Broken Arrow', 'Lawton'],
  'OR': ['Portland', 'Salem', 'Eugene', 'Gresham', 'Hillsboro'],
  'PA': ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie', 'Reading'],
  'RI': ['Providence', 'Warwick', 'Cranston', 'Pawtucket', 'East Providence'],
  'SC': ['Charleston', 'Columbia', 'North Charleston', 'Mount Pleasant', 'Rock Hill'],
  'SD': ['Sioux Falls', 'Rapid City', 'Aberdeen', 'Brookings', 'Watertown'],
  'TN': ['Nashville', 'Memphis', 'Knoxville', 'Chattanooga', 'Clarksville'],
  'TX': ['Houston', 'San Antonio', 'Dallas', 'Austin', 'Fort Worth', 'El Paso', 'Arlington', 'Corpus Christi', 'Plano', 'Laredo', 'Lubbock', 'Irving', 'Amarillo'],
  'UT': ['Salt Lake City', 'West Valley City', 'Provo', 'West Jordan', 'Orem'],
  'VT': ['Burlington', 'South Burlington', 'Rutland', 'Barre', 'Montpelier'],
  'VA': ['Virginia Beach', 'Norfolk', 'Chesapeake', 'Richmond', 'Newport News'],
  'WA': ['Seattle', 'Spokane', 'Tacoma', 'Vancouver', 'Bellevue', 'Kent', 'Everett'],
  'WV': ['Charleston', 'Huntington', 'Morgantown', 'Parkersburg', 'Wheeling'],
  'WI': ['Milwaukee', 'Madison', 'Green Bay', 'Kenosha', 'Racine'],
  'WY': ['Cheyenne', 'Casper', 'Laramie', 'Gillette', 'Rock Springs']
};

async function populate() {
  try {
    console.log('Starting population...');
    for (const state of states) {
      const [stateResult] = await pool.execute(
        'INSERT INTO states (name, code) VALUES (?, ?)',
        [state.name, state.code]
      );
      const stateId = stateResult.insertId;

      const stateCities = cities[state.code] || [];
      for (const cityName of stateCities) {
        const slug = `${cityName.toLowerCase().replace(/ /g, '-')}-${state.code.toLowerCase()}`;
        await pool.execute(
          'INSERT INTO cities (state_id, name, slug) VALUES (?, ?, ?)',
          [stateId, cityName, slug]
        );
      }
      console.log(`Populated ${state.name} with ${stateCities.length} cities.`);
    }
    console.log('Population complete!');
    process.exit(0);
  } catch (err) {
    console.error('Population failed:', err);
    process.exit(1);
  }
}

populate();
