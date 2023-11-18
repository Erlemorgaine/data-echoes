from selenium import webdriver
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup
import json
import time

# Set up the Chrome WebDriver
driver = webdriver.Chrome()
# 1998 episodes
url = "https://www.imdb.com/title/tt0175058/episodes/?season=" 


# 2016 eisodes
# url = "https://www.imdb.com/title/tt4718304/episodes/?season="
# Also this one: https://powerpuffgirls.fandom.com/wiki/Category:Transcripts?from=Strong-Armed%2FTranscript

time.sleep(5)

seasons = {}
season_links = {}

for i in range(1, 7):
# for i in range(1, 4):
    
    seasons[i] = []
    season_links[i] = []

    # time.sleep(1)
    driver.get(f"{url}{i}")
    # time.sleep(1)


    page_source = driver.page_source
    soup = BeautifulSoup(page_source, 'html.parser')


    episode_containers = soup.find_all("div", {"class": "sc-9115db22-4"})

    for container in episode_containers:
        link_container = container.find("a", {"class": "ipc-title-link-wrapper"}, href=True)
        link = link_container['href']
        season_links[i].append(link)

        # title_container = container.find("div", {"class":"ipc-title__text"})
        # title = title_container.get_text()

        # descr_container = container.find("div", {"class":"ipc-html-content-inner-div"})
        # description = descr_container.get_text()

        # seasons[i].append({"title": title, "description": description})

    # print(f"Appended episodes\n")


# with open('./ppg-seasons-1998.json', 'w') as json_file:
#     json.dump(seasons, json_file, indent=4)

# with open('./ppg-seasons-2016.json', 'w') as json_file:
#     json.dump(seasons, json_file, indent=4)

with open('./ppg-imdb-link.json', 'w') as json_file:
    json.dump(season_links, json_file, indent=4)

