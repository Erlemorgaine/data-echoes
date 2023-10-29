from selenium import webdriver
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup
import json
import time

# Set up the Chrome WebDriver
driver = webdriver.Chrome()
url = "https://powerpuffgirls.fandom.com/wiki/Category:Transcripts?from=Strong-Armed%2FTranscript"
# Also this one: https://powerpuffgirls.fandom.com/wiki/Category:Transcripts?from=Strong-Armed%2FTranscript
driver.get(url)

time.sleep(5)

# Find all links with the specified class
links = driver.find_elements(By.CLASS_NAME, "category-page__member-link")
print(f"Found {len(links)} links\n")

all_transcripts = []
link_urls = [link.get_attribute('href') for link in links]
episode_titles = [link.text.replace('/Transcript', '') for link in links]

for i, transcript_url in enumerate(link_urls):
    
    transcript = {"episode": episode_titles[i], "lines": []}

    print(transcript_url)

    # time.sleep(1)
    driver.get(transcript_url)
    # time.sleep(1)


    page_source = driver.page_source
    soup = BeautifulSoup(page_source, 'html.parser')


    # Find all paragraphs within the .mw-content-text class
    content_container = soup.find("div", {"id":"mw-content-text"})
    paragraphs = content_container.find_all('p')

    # Extract text from each paragraph
    for paragraph in paragraphs:
        text = paragraph.get_text()
        transcript['lines'].append(text)

    all_transcripts.append(transcript)

    print(f"Appended transcripts\n")

    # For url 1
    # with open('./ppg-episode-transcripts-1.json', 'w') as json_file:
    #     json.dump(all_transcripts, json_file, indent=4)

    # For url 2
    with open('./ppg-episode-transcripts-2.json', 'w') as json_file:
        json.dump(all_transcripts, json_file, indent=4)




