pragma solidity ^0.5.7;

contract BTorrent{
    
    struct Torrent{

        string fileLink;
        string fileName;
        uint16 userRating;
        uint16 fileSize;          // In Kbs as of now
        uint16 costToDownload;    // to be deprecated
        uint16 seeders;
        uint16 leechers;
        address creator;
    }
    
    mapping(string => Torrent) torrentLinkToInfo;

    function createTorrent(string memory fileLink, string memory fileName, uint16 fileSize) public {
        
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
    
    
    function getTorrentInfo(string memory fileLink) public view returns (string memory ,string memory ,uint16,uint16,uint16,address){
        
        Torrent memory newTorrent = torrentLinkToInfo[fileLink];
        return (newTorrent.fileLink, newTorrent.fileName, newTorrent.fileSize,
        newTorrent.costToDownload, newTorrent.userRating, newTorrent.creator);
    }

    function getPopularityScore(string memory fileLink) public view returns (uint16) {
        Torrent memory torrent = torrentLinkToInfo[fileLink];
        return (torrent.seeders + torrent.leechers)  / 2;
    }
}


contract UserBase{
    struct Torrent{

        string fileLink;
        string fileName;
        uint16 userRating;
        uint16 fileSize;          // In Kbs as of now
        uint16 costToDownload;
        uint16 seeders;
        uint16 leechers;
        address creator;
    }

    struct User{
        mapping(uint16 => Torrent) downloads;
        uint16 downloadSize;
        uint16 balance;
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
    
    function getCostToDownload() public view returns (uint16) {
        // For implementation refer: https://github.com/abdk-consulting/abdk-libraries-solidity
        // return N0 * e ^ (- lambda * x)

    }

    function getPayout() public view returns (uint16) {
        // return R * costToDownload()

    }

    function startDownload(uint16 costToDownload, string memory fileLink, string memory fileName,
    uint16 fileSize,uint16 rating, address creator, address UserId) public payable {

        require(msg.value >= costToDownload,  "Insufficient Funds Transferred");
        addToDownloads(fileLink, fileName, fileSize, costToDownload, rating, creator, UserId);
        return;
    }
    
    function addToDownloads(string memory fileLink, string memory fileName, uint16 fileSize,uint16 cost, uint16 rating,address creator, address UserId) public{
        
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


    function receiveReward(uint16 uploadedData, address payable UserId) public {
        UserId.transfer(uploadedData / 1000);
        return;
    }

    function getDownloadSize(address UserId) public view returns (uint16){
        return addressToUser[UserId].downloadSize;
    }

    function getUserDownloadInfo(uint16 index, address UserId) public view returns (string memory, string memory, uint16, uint16, uint16, address){
        
        Torrent memory newTorrent = addressToUser[UserId].downloads[index];
        
        return (newTorrent.fileLink, newTorrent.fileName, newTorrent.fileSize,
        newTorrent.costToDownload, newTorrent.userRating, newTorrent.creator);
    }   
}
