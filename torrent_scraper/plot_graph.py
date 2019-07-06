import csv
import random
import numpy as np
import pickle
import matplotlib.pyplot as plt


UserCount = 2800
TorrentsList = []
TorrentFiles = [
    'anime.csv', 'games.csv', 'movies.csv', 'other.csv', 'tv_series.csv',
    'apps.csv', 'music.csv'
]
UserBase = []
total_seeders = 0
total_leechers = 0
popularity_score_1 = []
popularity_score_2 = []
popularity_score_3 = []
e = 2.718281828
ln2 = 0.69314718
money_in_contract = 0


def torrentAggregator():

    global popularity_score_1, popularity_score_2, popularity_score_3, total_seeders, total_leechers

    torrent_sizes = []
    for file in TorrentFiles:
        with open(file, "r", encoding="utf8") as csvfile:

            readCSV = csv.reader(csvfile, delimiter=',')
            for row in readCSV:

                torrent = {}
                torrent['title'] = row[0][1:]
                torrent['seeders'] = int(row[2][1:])
                torrent['leechers'] = int(row[3][1:])

                torrent['popularity_score_1'] = 0.7 * torrent[
                    'seeders'] + 0.3 * torrent['leechers']
                torrent['popularity_score_2'] = 0.3 * torrent[
                    'seeders'] + 0.7 * torrent['leechers']
                torrent['popularity_score_3'] = 0.5 * torrent[
                    'seeders'] + 0.5 * torrent['leechers']

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
                popularity_score_1.append(torrent['popularity_score_1'])
                popularity_score_2.append(torrent['popularity_score_2'])
                popularity_score_3.append(torrent['popularity_score_3'])

                total_seeders += torrent['seeders']
                total_leechers += torrent['leechers']

    popularity_score_1 = popularity_score_1 / np.sum(popularity_score_1)
    popularity_score_2 = popularity_score_2 / np.sum(popularity_score_2)
    popularity_score_3 = popularity_score_3 / np.sum(popularity_score_3)

    print('File Statistics')
    print('Total Files used in simulation: ', len(TorrentsList))
    print("Standard Deviation of file sizes(MB): ", np.std(torrent_sizes))
    print("Mean of File Sizes(MB): ", np.mean(torrent_sizes))
    print()


def distributeAmongUsers():

    for user in range(0, UserCount):

        count_files_user = random.randint(51, 100)
        user_downloads = np.random.choice(range(0, len(popularity_score_1)),
                                          count_files_user,
                                          p=popularity_score_1,
                                          replace=False)
        user_uploads = np.random.choice(range(0, len(popularity_score_2)),
                                        count_files_user,
                                        p=popularity_score_2,
                                        replace=False)

        userDict = {
            'downloads': user_downloads,
            'required': user_uploads,
            'amount': 0.0
        }

        UserBase.append(userDict)

    f = open("userbase.pickle", "wb")
    pickle.dump(UserBase, f)
    f.close()


def calculate_price(N_knot, lambdaa, pop_score, file_size, factor=1.0):

    global e, ln2
    return N_knot * pow(e, -lambdaa * pop_score) * file_size * factor


# K is the popularity score at which payout becomes n0/2
# P is the payout per MB when popularity score is 100
def calculate_function_parameters(K, P):

    lambdaa = ln2 / K
    exponent = pow(e, -lambdaa)
    # 5.49 * pow(10, -7) is price of 1 paisa in ETH
    N_knot = P * 5.49 * pow(10, -7) / exponent
    return (N_knot, lambdaa)


def preprocess(N_knot, lambdaa):

    global money_in_contract
    global UserBase

    f = open("userbase.pickle", "rb")
    UserBase = pickle.load(f)
    f.close()

    downloaded_file_to_users = [[] for i in range(len(TorrentsList))]
    required_file_to_users = [[] for i in range(len(TorrentsList))]

    for i in range(0, UserCount):

        for file_index in UserBase[i]['downloads']:
            downloaded_file_to_users[file_index].append(i)
            # not deducting money here

        for file_index in UserBase[i]['required']:
            required_file_to_users[file_index].append(i)

    return downloaded_file_to_users, required_file_to_users


def distributeCurrency(N_knot, lambdaa, downloaded_file_to_users,
                       required_file_to_users, R):

    global money_in_contract
    count = 0
    add_sum = 0

    required_sum = 0

    for file_index in range(len(TorrentsList)):

        required_sum += len(required_file_to_users[file_index])

        if len(downloaded_file_to_users[file_index]) > 0:
            seeders = np.random.choice(downloaded_file_to_users[file_index],
                                       len(required_file_to_users[file_index]))

            for user_index in seeders:
                price = calculate_price(N_knot, lambdaa,
                                        popularity_score_3[file_index],
                                        TorrentsList[file_index]['file_size'])

                UserBase[user_index]['amount'] += price
                money_in_contract -= price

            for user_index in required_file_to_users[file_index]:
                price = calculate_price(N_knot, lambdaa,
                                        popularity_score_3[file_index],
                                        TorrentsList[file_index]['file_size'],
                                        1.0 / R)

                UserBase[user_index]['amount'] -= price
                money_in_contract += price

        elif len(required_file_to_users[file_index]) > 0:
            add_sum += len(required_file_to_users[file_index])
            count += 1


def main():

    torrentAggregator()
    random.shuffle(TorrentsList)

    # distributeAmongUsers()

    N_knot, lambdaa = calculate_function_parameters(2000, 1)
    print("N_Knot value: ", N_knot)
    print("Lambda value: ", lambdaa)
    print()
    downloaded_file_to_users, required_file_to_users = preprocess(
        N_knot, lambdaa)

    R = 0.9
    graph_values_x = []
    graph_values_y = []
    for i in range(0, 10):
        distributeCurrency(N_knot, lambdaa, downloaded_file_to_users,
                      required_file_to_users, R)

        total = 0
        count = 0
        for user in range(len(UserBase)):
            total += UserBase[user]['amount']
            if UserBase[user]['amount'] < 0:
                count += 1

        FinalAmountUsers = []

        for user in UserBase:
            FinalAmountUsers.append(user['amount'])

        FinalAmountUsers.sort()
        size = len(FinalAmountUsers)
        size //= 2

        graph_values_x.append(R)
        graph_values_y.append(np.std(FinalAmountUsers))
        R += 0.01 

    print(graph_values_x)
    print(graph_values_y)
    plt.plot(graph_values_x, graph_values_y)
    plt.show()

main()