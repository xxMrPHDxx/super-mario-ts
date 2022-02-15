from urllib.request import urlopen
from multiprocessing import Pool
from bs4 import BeautifulSoup
from functools import partial
from math import ceil, sqrt
from hashlib import md5
from numpy import tile
import pygame
import os
import re

def get_sheet(url):
	soup = BeautifulSoup(urlopen(url).read(), 'html.parser')
	info = soup.select_one('div#game-info-wrapper')
	name = info.select_one('tr.rowheader th div').text.lower()
	name = re.sub(r'_{2,}', '-', re.sub(r'[^a-z0-9_]', '', name.replace(' ', '_')))
	download_url = info.select_one('tr.rowfooter a')['href']
	content = urlopen(f'https://www.spriters-resource.com{download_url}').read()

	save_path = f'./raw/sprites/{name}.png'
	with open(save_path, 'wb') as f:
		f.write(content)
		print(f'Downloaded "{save_path}"')

def get_sheets(url):
	soup = BeautifulSoup(urlopen(url).read(), 'html.parser')
	return [
		f"https://www.spriters-resource.com{link['href']}"
		for link in soup.select('a[href]')
		if re.match(r'^\/nes\/supermariobros\/sheet\/.+$', link['href'])
	]

def create_tilesheet(path, size=16):
	image = pygame.image.load(path)
	w, h = image.get_size()
	surfaces = {}
	for y in range(0, h, size):
		for x in range(0, w, size):
			surface = pygame.Surface((size, size))
			surface.blit(image, dest=(0, 0), area=(x, y, size, size))
			_hash = md5(surface.get_buffer()).hexdigest()
			if _hash in surfaces: continue
			surfaces[_hash] = surface

	N = len(surfaces)
	rows = cols = ceil(sqrt(N))
	for i in range(int(sqrt(N)), ceil(sqrt(sqrt(N))), -1):
		if N % i != 0: continue
		rows, cols = i, N // i
		break

	tilesheet = pygame.Surface((cols*size, rows*size))
	for i, surface in enumerate(surfaces.values()):
		row, col = i//cols, i%cols
		tilesheet.blit(surface, dest=(col*size, row*size))
	return tilesheet

if __name__ == '__main__':
	'''
	pool = Pool(4)
	urls = get_sheets('https://www.spriters-resource.com/nes/supermariobros/')
	if not os.path.exists('./raw/sprites/'):
		os.makedirs('./raw/sprites')
	pool.map(get_sheet, urls)
	'''

	sheets_folder = './public/sheets'
	if not os.path.exists(sheets_folder): os.makedirs(sheets_folder)
	surface = create_tilesheet('./raw/sprites/world_11.png')
	pygame.image.save(surface, f'{sheets_folder}/1-1.png')

	'''
	pygame.init()
	window = pygame.display.set_mode(surface.get_size())
	window.blit(surface, dest=(0, 0))
	pygame.display.update()
	while True:
		for event in pygame.event.get():
			if event.type == pygame.QUIT:
				exit(0)
	'''