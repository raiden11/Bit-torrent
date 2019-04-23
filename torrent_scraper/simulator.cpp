

const UsersCount = 2800;
// list of structures


struct TorrentFile{

	string title;
	int seeders;
	int leechers;
	double file_size;
	double seeder_popularity;
	double leecher_popularity;
	double combined_popularity;
};

struct User{
	vector<int> downloads;
	vector<int> uploads;
	double balance;
};

vector<User> UserBase;
vector<TorrentFile> TorrentsList; 


void parseTorrentFile(){

	fstream fin;   
	vector<string>row;
    fin.open("anime.csv", ios::in); 
    while (fin >> temp) { 
  
        row.clear();  
        getline(fin, line); 
        stringstream s(line); 
        while (getline(s, word, ', ')) {
            row.push_back(word); 
        }
    }
    print(row);
}

void torrentAggregator(){


    # saari files se ek bana lenge
    # har torrent ka ek identifier
    # fields seeder_popularity = no of seeders/total no of seeders
    #           leecher_popularity
    #           combined_popularity
}


void distribute_torrent(){


    # iterate through every user:
    #    select a r = random number from 10-50
    #    select r files randomly for now
}

void deductDownloadCost(){

}




int main(){


}

