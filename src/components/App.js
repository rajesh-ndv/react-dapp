import React, { Component } from 'react';
import Web3 from 'web3';
import Identicon from 'identicon.js';
import './App.css';
import Blog from '../abis/Blog.json';
import Navbar from './Navbar'
import Main from './Main';




const projectId = '2I7iPZBooHRYb5aagTsrfHeP1ZU';
const projectSecret = 'b48544aafc6446c3c4030a01b38c2de6';
const auth =
    'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');



const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' ,headers:{
  authorization: auth
}}) 



class App extends Component {

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('No metamask browser')
    }
  }

  async loadData(){
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({account: accounts[0]});
    const networkId = await web3.eth.net.getId();
    console.log(networkId)
    if(networkId) {
      const blog = await web3.eth.Contract(Blog.abi,Blog.networks[networkId].address);
      console.log(blog);
      this.setState({ blog })
      const blogCount = await blog.methods.blogCount().call()
      this.setState({ blogCount })
      // Load images
      for (var i = 1; i <= blogCount; i++) {
        const currentBlog = await blog.methods.blogs(i).call()
        this.setState({
          blogs: [...this.state.blogs, currentBlog]
        })
      }
      this.setState({
        blogs: this.state.blogs.sort((a,b) => b.likesCount - a.likesCount )
      })
      console.log(this.state.blogs);
      this.setState({ loading: false})
    } else {
      window.alert('blog contract not deployed to detected network.')
    }
  }

  captureFile = event => {

    event.preventDefault()
    const file = event.target.files[0];
    const fileType = file.name.split('.').pop();
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)

    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      this.setState({ type: fileType});
      console.log('buffer', this.state.buffer);
      console.log('file type', this.state.type);
    }
  }

  uploadBlog = description => {
    console.log("Submitting file to ipfs...")

    //adding file to the IPFS
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('Ipfs result', result)
      if(error) {
        console.error(error)
        return
      }

      this.setState({ loading: true })
      this.state.blog.methods.uploadBlog(result[0].hash, description,this.state.type).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }

  addComment = (id,content) => {
    console.log("Adding comment...")
    this.setState({ loading: true })
    this.state.blog.methods.commentBlog(id, content).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  loadComments= async (id) => {
    console.log("Retrieving comments ");
    var comments = await this.state.blog.methods.retrieveComments(id).call();
    console.log(comments);
    return comments;
  }

  likeBlog(id) {
    this.setState({ loading: true })
    this.state.blog.methods.likeBlog(id).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      blog: null,
      blogs: [],
      loading: true
    }

    this.uploadImage = this.uploadBlog.bind(this);
    this.likeBlog = this.likeBlog.bind(this);
    this.captureFile = this.captureFile.bind(this);
    this.addComment = this.addComment.bind(this);
    this.loadComments = this.loadComments.bind(this);

  }

  render() {
    return (
       <div>
        <Navbar account={this.state.account} />
        { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main
              blogs={this.state.blogs}
              captureFile={this.captureFile}
              uploadBlog={this.uploadBlog}
              likeBlog={this.likeBlog}
              commentBlog={this.addComment}
              loadComments={this.loadComments}
            />
        }
      </div>
    );
  }
}

export default App;