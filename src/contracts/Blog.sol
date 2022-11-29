pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;


contract Blog {
  string public name = "blog";

  uint public blogCount = 0;
  mapping(uint => BlogItem) public blogs;
  mapping(uint => address[]) public likedUsers;
  mapping(uint => Comment[]) public comments;

  struct BlogItem {
    uint id;
    string hash;
    string description;
    uint likesCount;
    address payable author;
    string fileType;
  }

  struct Comment {
    address author;
    string content;
  }

  event BlogUpdated(
    uint id,
    string hash,
    string description,
    uint likesCount,
    address payable author,
    Comment[] comments,
    string fileType
  );

  event BlogLiked(
    uint id,
    uint likesCount,
    address payable author
  );

  event BlogCommented(
    uint id,
    Comment[] comments
  );



  constructor() public {
    name = "Blog";
  }


  function uploadBlog(string memory _fileHash, string memory _description,string memory _fileType) public {
    require(bytes(_fileHash).length > 0);
    require(bytes(_description).length > 0);
    require(msg.sender!=address(0));
    require(bytes(_fileType).length > 0);
    blogCount ++;
    blogs[blogCount] = BlogItem(blogCount, _fileHash, _description, 0, msg.sender,_fileType);
    emit BlogUpdated(blogCount, _fileHash, _description, 0, msg.sender,comments[blogCount],_fileType);
  }

  function commentBlog(uint _id,string memory _comment) public {
    require(_id > 0 && _id <= blogCount);
    require(bytes(_comment).length > 0);
    //Comment[] storage _commentArray = comments[_id];
    // uint len = _commentArray.length;
    // _commentArray[len] = Comment(msg.sender,_comment);
    // comments[_id] = _commentArray;
    comments[_id].push(Comment(msg.sender,_comment));
    //comments[_id] = _commentArray;
    emit BlogCommented(_id, comments[_id]);
  }

  function check(uint _id,address senderAddress) internal view returns(bool){
    bool doesListContainElement = false;
    for (uint i=0; i < likedUsers[_id].length; i++) {
      if (senderAddress == likedUsers[_id][i]) {
          doesListContainElement = true;
          break;
      }
    } 
    return doesListContainElement;
  }

  function likeBlog(uint _id) public {
    require(_id > 0 && _id <= blogCount);
    require(!check(_id,msg.sender));
    BlogItem memory _blog = blogs[_id];
    _blog.likesCount = _blog.likesCount + 1;
    blogs[_id] = _blog;
    likedUsers[_id].push(msg.sender);
    emit BlogLiked(blogCount,_blog.likesCount,msg.sender);
  }

}