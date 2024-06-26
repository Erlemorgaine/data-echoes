import requests
from bs4 import BeautifulSoup
import json

# .title-cast-item .title-cast-item__actor

imdb_key = 'f9f5c053'
omdb_url = 'https://www.omdbapi.com/?t='

movie_titles = [
    "The King's Speech",
    "Black Swan",
    "The Fighter",
    "Inception",
    "The Kids Are All Right",
    "127 Hours",
    "The Social Network",
    "Toy Story 3",
    "True Grit",
    "Winter's Bone",
    "The Artist",
    "The Descendants",
    "Extremely Loud & Incredibly Close",
    "The Help",
    "Hugo",
    "Midnight in Paris",
    "Moneyball",
    "The Tree of Life",
    "War Horse",
    "Argo",
    "Amour",
    "Beasts of the Southern Wild",
    "Django Unchained",
    "Life of Pi",
    "Lincoln",
    "Les Misérables",
    "Silver Linings Playbook",
    "Zero Dark Thirty",
    "12 Years a Slave",
    "American Hustle",
    "Captain Phillips",
    "Dallas Buyers Club",
    "Gravity",
    "Her",
    "Nebraska",
    "Philomena",
    "The Wolf of Wall Street",
    "Birdman",
    "American Sniper",
    "Boyhood",
    "The Grand Budapest Hotel",
    "The Imitation Game",
    "Selma",
    "The Theory of Everything",
    "Whiplash",
    "Spotlight",
    "The Big Short",
    "Bridge of Spies",
    "Brooklyn",
    "Mad Max: Fury Road",
    "The Martian",
    "The Revenant",
    "Room",
    "Moonlight",
    "Arrival",
    "Fences",
    "Hacksaw Ridge",
    "Hell or High Water",
    "Hidden Figures",
    "La La Land",
    "Lion",
    "Manchester by the Sea",
    "The Shape of Water",
    "Call Me by Your Name",
    "Darkest Hour",
    "Dunkirk",
    "Get Out",
    "Lady Bird",
    "Phantom Thread",
    "The Post",
    "Three Billboards Outside Ebbing, Missouri",
    "Green Book",
    "Black Panther",
    "BlacKkKlansman",
    "Bohemian Rhapsody",
    "The Favourite",
    "Roma",
    "A Star Is Born",
    "Vice",
    "Parasite",
    "Ford v Ferrari",
    "The Irishman",
    "Jojo Rabbit",
    "Joker",
    "Little Women",
    "Marriage Story",
    "1917",
    "Once Upon a Time in Hollywood",
    "Nomadland",
    "The Father",
    "Judas and the Black Messiah",
    "Mank",
    "Minari",
    "Promising Young Woman",
    "Sound of Metal",
    "The Trial of the Chicago 7",
    "CODA",
    "Belfast",
    "Don't Look Up",
    "Drive My Car",
    "Dune",
    "King Richard",
    "Licorice Pizza",
    "Nightmare Alley",
    "The Power of the Dog",
    "West Side Story",
    "Everything Everywhere All at Once",
    "All Quiet on the Western Front",
    "Avatar: The Way of Water",
    "The Banshees of Inisherin",
    "Elvis",
    "The Fabelmans",
    "Tár",
    "Top Gun: Maverick",
    "Triangle of Sadness",
    "Women Talking",
    "American Fiction",
    "Anatomy of a Fall",
    "Barbie",
    "The Holdovers",
    "Killers of the Flower Moon",
    "Maestro",
    "Oppenheimer",
    "Past Lives",
    "Poor Things",
    "The Zone of Interest"
]

imdb_ids = [
    "tt1504320",
    "tt0947798",
    "tt0964517",
    "tt1375666",
    "tt0842926",
    "tt1542344",
    "tt1285016",
    "tt0435761",
    "tt1403865",
    "tt1399683",
    "tt1655442",
    "tt1033575",
    "tt0477302",
    "tt1454029",
    "tt0970179",
    "tt1605783",
    "tt1210166",
    "tt0478304",
    "tt1568911",
    "tt1024648",
    "tt1602620",
    "tt2125435",
    "tt1853728",
    "tt0454876",
    "tt0443272",
    "tt1707386",
    "tt1045658",
    "tt1790885",
    "tt2024544",
    "tt1800241",
    "tt1535109",
    "tt0790636",
    "tt1454468",
    "tt1798709",
    "tt1821549",
    "tt2431286",
    "tt0993846",
    "tt0061237",
    "tt2179136",
    "tt1065073",
    "tt2278388",
    "tt2084970",
    "tt1020072",
    "tt2980516",
    "tt2582802",
    "tt1895587",
    "tt1596363",
    "tt3682448",
    "tt2381111",
    "tt1392190",
    "tt3659388",
    "tt1663202",
    "tt3170832",
    "tt4975722",
    "tt2543164",
    "tt2671706",
    "tt2119532",
    "tt2582782",
    "tt4846340",
    "tt3783958",
    "tt3741834",
    "tt4034228",
    "tt5580390",
    "tt5726616",
    "tt4555426",
    "tt5013056",
    "tt5052448",
    "tt4925292",
    "tt5776858",
    "tt6294822",
    "tt5027774",
    "tt6966692",
    "tt1825683",
    "tt7349662",
    "tt1727824",
    "tt5083738",
    "tt6155172",
    "tt1517451",
    "tt6266538",
    "tt6751668",
    "tt1950186",
    "tt1302006",
    "tt2584384",
    "tt7286456",
    "tt3281548",
    "tt7653254",
    "tt8579674",
    "tt4010884",
    "tt9770150",
    "tt10272386",
    "tt9784798",
    "tt10618286",
    "tt10633456",
    "tt9620292",
    "tt5363618",
    "tt1070874",
    "tt10366460",
    "tt12789558",
    "tt11286314",
    "tt14039582",
    "tt1160419",
    "tt9620288",
    "tt11271038",
    "tt7740496",
    "tt10293406",
    "tt0055614",
    "tt6710474",
    "tt1016150",
    "tt1630029",
    "tt11813216",
    "tt3704428",
    "tt14208870",
    "tt14444726",
    "tt1745960",
    "tt7322224",
    "tt13669038",
    "tt23561236",
    "tt17009710",
    "tt1517268",
    "tt14849194",
    "tt5537002",
    "tt5535276",
    "tt15398776",
    "tt13238346",
    "tt14230458",
    "tt7160372",
]

# def get_movie_info(movie_title):
#     response = requests.get(f'{omdb_url}{movie_title}&apikey={imdb_key}')
#     if response.status_code == 200:
#         movie_info = response.json()
#         print(movie_info['imdbID'] + ',')
#     else:
#         print(f'Error fetching data for {movie_title}')



# for title in movie_titles:
#     get_movie_info(title)


movie_cast = []

for idx, movie_id in enumerate(imdb_ids):

    url = f'https://www.imdb.com/title/{movie_id}'
    print(url)
    response = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'})


    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        actors = soup.select('.sc-bfec09a1-1')[:5]
        actors_list = [{"actor": actor.get_text(strip=True)} for actor in actors]
        movie_cast.append({"movie": movie_titles[idx], "actors": actors_list})
    else:
        print(f'Error fetching data for {movie_titles[idx]}')


with open('best_picture_cast.json', 'w') as file:
    json.dump(movie_cast, file)

