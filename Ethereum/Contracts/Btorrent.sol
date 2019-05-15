pragma solidity ^0.4.17;

contract BTorrent{
    
    struct Torrent{

        string fileLink;
        string fileName;
        uint16 userRating;
        uint16 fileSize;          // In Kbs as of now
        uint16 costToDownload;    // in milliEther
        address creator;
    }
    
    mapping(string => Torrent) torrentLinkToInfo;

    function createTorrent(string fileLink, string fileName, uint16 fileSize) public {
        
        Torrent memory newTorrent = Torrent({
            fileLink: fileLink,
            fileName: fileName,
            userRating: 0,
            fileSize: fileSize,
            costToDownload: fileSize/1000,
            creator: msg.sender
        });

        torrentLinkToInfo[fileLink] = newTorrent;
        return;
    }
    
    
    function getTorrentInfo(string fileLink) public view  returns (string,string,uint16,uint16,uint16,address){
        
        Torrent memory newTorrent = torrentLinkToInfo[fileLink];
        return (newTorrent.fileLink, newTorrent.fileName, newTorrent.fileSize,
        newTorrent.costToDownload, newTorrent.userRating, newTorrent.creator);
    }
    
    
}


contract UserBase{
    
    struct Torrent{

        string fileLink;
        string fileName;
        uint16 userRating;
        uint16 fileSize;          // In Kbs as of now
        uint16 costToDownload;    
        address creator;
    }
    
    struct User{
        mapping(uint16 => Torrent) downloads;
        uint16 downloadSize;
    }

    mapping(address => bool) isUser;
    mapping(address => User) addressToUser;

    
    function userExists(address UserID)public view returns (bool){
        return isUser[UserID];
    }
    
    function createUser() public{
        isUser[msg.sender]= true;
        addressToUser[msg.sender] = User({
            downloadSize:0
        });
        return;
    }
    

    function startDownload(uint16 costToDownload, string fileLink, string fileName, 
    uint16 fileSize,uint16 rating, address creator, address UserId) public payable {

        require(msg.value >= costToDownload);
        addToDownloads(fileLink, fileName, fileSize, costToDownload, rating, creator, UserId);
        return;
    }
    
    function addToDownloads(string fileLink, string fileName, uint16 fileSize,uint16 cost, uint16 rating,address creator, address UserId) public{
        
        Torrent memory torrent = Torrent({
            fileLink: fileLink,
            fileName: fileName,
            userRating: rating,
            fileSize: fileSize,
            costToDownload: cost,
            creator: creator
        });
        
        User storage currUser = addressToUser[UserId];
        currUser.downloads[currUser.downloadSize]=torrent;
        currUser.downloadSize = currUser.downloadSize+1;

        return;
    }


    function receiveReward(uint16 uploadedData, address UserId) public {
        UserId.transfer(uploadedData /1000);
        return;
    }

    function getDownloadSize(address UserId)public view returns (uint16){
        return addressToUser[UserId].downloadSize;
    }

    function getUserDownloadInfo(uint16 index, address UserId)public view returns (string,string,uint16,uint16,uint16,address){
        
        Torrent memory newTorrent = addressToUser[UserId].downloads[index];
        
        return (newTorrent.fileLink, newTorrent.fileName, newTorrent.fileSize,
        newTorrent.costToDownload, newTorrent.userRating, newTorrent.creator);
    }

    
}