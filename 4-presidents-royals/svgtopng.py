from cairosvg import svg2png


images = [
    "blacks",
    "citadel",
    "faith-of-the-seven",
    "greens",
    "house-arryn",
    "house-baratheon",
    "house-blackfyre",
    "house-blackwood",
    "house-bolton",
    "house-bracken",
    "house-florent",
    "house-frey",
    "house-greyjoy",
    "house-hightower",
    "house-lannister",
    "house-manderly",
    "house-martell",
    "house-mormont",
    "house-redwyne",
    "house-royce",
    "house-stark",
    "house-targaryen",
    "house-tarly",
    "house-tully",
    "house-tyrell",
    "house-velaryon",
    "house-waynwood",
    "kingsguard",
    "nights-watch"
]

for image in images:
    svg2png(url='../data-echoes/public/images/' + image + '.svg', write_to='../data-echoes/public/images/' + image + '.png')
