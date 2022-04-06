// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CryptoPainter is ERC721 {
  address public admin;
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  mapping(string => uint8) hashes;
  mapping (uint256 => string) private _tokenURIs;

  constructor() ERC721("Crypto-Painter", "CPA") {
    admin = msg.sender;
  }

  function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
    require(_exists(tokenId), "ERC721Metadata: URI set of nonexistent token");
    _tokenURIs[tokenId] = _tokenURI;
  }

  function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
    string memory _tokenURI = _tokenURIs[tokenId];    
    return _tokenURI;
  }

  modifier onlyAdmin() {
    require(
      msg.sender == admin,
      "This function is restricted to the admin"
    );
    _;
  }

  function mint(address recipient, string memory hash, string memory metadata) public onlyAdmin returns (uint256) {
    require(hashes[hash] != 1);
    hashes[hash] = 1;
    _tokenIds.increment();
    uint256 newItemId = _tokenIds.current();
    _mint(recipient, newItemId);
    _setTokenURI(newItemId, metadata);
    return newItemId;
  }
}
