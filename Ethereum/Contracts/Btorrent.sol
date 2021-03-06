pragma solidity ^0.4.17;

contract BTorrent{
    
    struct Torrent{

        string fileLink;
        string fileName;
        uint256 userRating;
        uint256 fileSize;          // In Kbs as of now
        uint256 costToDownload;    // to be deprecated
        uint256 seeders;
        uint256 leechers;
        address creator;
    }
    
    mapping(string => Torrent) torrentLinkToInfo;

    function createTorrent(string memory fileLink, string memory fileName, uint256 fileSize) public {
        
        Torrent memory newTorrent = Torrent({
            fileLink: fileLink,
            fileName: fileName,
            userRating: 0,
            fileSize: fileSize,
            seeders: 1,
            leechers: 0,
            costToDownload: fileSize/1000,
            creator: msg.sender
        });

        torrentLinkToInfo[fileLink] = newTorrent;
        return;
    }
    
    
    function getTorrentInfo(string memory fileLink) public view returns (string memory ,string memory ,uint256,uint256,uint256,address){
        
        Torrent memory newTorrent = torrentLinkToInfo[fileLink];
        return (newTorrent.fileLink, newTorrent.fileName, newTorrent.fileSize,
        newTorrent.costToDownload, newTorrent.userRating, newTorrent.creator);
    }

    function getPopularityScore(string memory fileLink) public view returns (uint256) {
        Torrent memory torrent = torrentLinkToInfo[fileLink];
        return (torrent.seeders + torrent.leechers)/2;
    }
}


contract UserBase{
    struct Torrent{

        string fileLink;
        string fileName;
        uint256 userRating;
        uint256 fileSize;          // In Kbs as of now
        uint256 costToDownload;
        uint256 seeders;
        uint256 leechers;
        address creator;
    }

    struct User{
        mapping(uint256 => Torrent) downloads;
        uint256 downloadSize;
        uint256 balance;
    }

    mapping(address => bool) isUser;
    mapping(address => User) addressToUser;

    function userExists(address UserID) public view returns (bool){
        return isUser[UserID];
    }
    
    function createUser() public{
        isUser[msg.sender] = true;
        addressToUser[msg.sender] = User({
            downloadSize:0,
            balance: 0
        });
        return;
    }

    function getBalance(address userId)public view returns (uint256){
        return addressToUser[userId].balance;
    }

    function startDownload(uint256 costToDownload, string memory fileLink, string memory fileName,
    uint256 fileSize,uint256 rating, address creator, address UserId) public payable {

        require(msg.value >= costToDownload);
        addToDownloads(fileLink, fileName, fileSize, costToDownload, rating, creator, UserId);
        return;
    }
    
    function addToDownloads(string memory fileLink, string memory fileName, uint256 fileSize,uint256 cost, uint256 rating,address creator, address UserId) public{
        
        Torrent memory torrent = Torrent({
            fileLink: fileLink,
            fileName: fileName,
            userRating: rating,
            fileSize: fileSize,
            seeders:1,
            leechers:0,
            costToDownload: cost,
            creator: creator
        });
        
        User storage currUser = addressToUser[UserId];
        currUser.downloads[currUser.downloadSize] = torrent;
        currUser.downloadSize = currUser.downloadSize+1;
        return;
    }


    function receiveReward(uint256 rewardAmount, address UserId) public payable{

        UserId.transfer(rewardAmount);
        addressToUser[UserId].balance = addressToUser[UserId].balance + rewardAmount;
        return;
    }

    function getDownloadSize(address UserId) public view returns (uint256){
        return addressToUser[UserId].downloadSize;
    }

    function getUserDownloadInfo(uint256 index, address UserId) public view returns (string memory, string memory, uint256, uint256, uint256, address){
        
        Torrent memory newTorrent = addressToUser[UserId].downloads[index];
        
        return (newTorrent.fileLink, newTorrent.fileName, newTorrent.fileSize,
        newTorrent.costToDownload, newTorrent.userRating, newTorrent.creator);
    }   
}





