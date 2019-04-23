import csv
import random
import numpy as np


UserCount = 2800
TorrentsList = []
TorrentFiles = ['anime.csv', 'games.csv', 'movies.csv', 'other.csv', 'tv_series.csv', 'apps.csv', 'music.csv']
UserBase = []
total_seeders = 0
total_leechers = 0

def torrentAggregator():

	torrent_sizes = []
	for file in TorrentFiles:
		with open(file, "r") as csvfile:

			counter = 0
			readCSV = csv.reader(csvfile, delimiter = ',')
			for row in readCSV:
				torrent = {}
				torrent['title'] = row[0][1:]
				torrent['seeders'] = int(row[2][1:])
				torrent['leechers'] = int(row[3][1:])


				total_seeders += torrent['seeders']
				total_leechers += torrent['leechers']

				words = row[1].split(' ')
				
				try:
					size = float(words[0][1:])
					xb = words[1]
				except:
					size = float(words[1])
					xb = words[2]

				if xb == 'GB':
					size *= 1000
				elif xb == 'KB':
					size *= 0.001
				torrent['file_size'] = size
				TorrentsList.append(torrent)
				torrent_sizes.append(torrent['file_size'])

	print(np.std(torrent_sizes))
	print(np.mean(torrent_sizes))

	
def distributeAmongUsers():

	for user in range(0, UserCount):
		count_files_user = random.randint(10, 51)
		user_downloads = set()

		while len(user_downloads) < count_files_user:
			user_downloads.add(random.randint(1, len(TorrentsList)))

		userDict = {
			'downloads': list(user_downloads),
			'amount': 0.0
		}

		UserBase.append(userDict)


def main():

	torrentAggregator()
	random.shuffle(TorrentsList)
	# print(len(TorrentsList))
	distributeAmongUsers()
	# for user in UserBase:
	# 	print(user)


main()







