import urllib.request
from bs4 import BeautifulSoup

req = urllib.request.Request('https://s.cafef.vn/Search/BCPT.ashx?sym=FPT', headers={'User-Agent': 'Mozilla/5.0'})
try:
    res = urllib.request.urlopen(req)
    print("Found BCPT")
except:
    pass
