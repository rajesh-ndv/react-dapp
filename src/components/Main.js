import React, { Component } from 'react';
import Identicon from 'identicon.js';
import FileViewer from 'react-file-viewer';


class Main extends Component {

  render() {
    return (
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '1500px' }}>
            <div className="content mr-auto ml-auto">
              <p>&nbsp;</p>
              <h2>Share An Article</h2>
              <form onSubmit={(event) => {
                event.preventDefault()
                const description = this.imageDescription.value
                this.props.uploadImage(description)
              }} >
                <input type='file' accept=".jpg, .jpeg, .png, .bmp, .gif, .pdf, .xlsx" onChange={this.props.captureFile} />
                  <div className="form-group mr-sm-2">
                    <br></br>
                      <textarea
                        rows="10" cols="80"
                        id="imageDescription"
                        type="text"
                        ref={(input) => { this.imageDescription = input }}
                        className="form-control"
                        placeholder="Write something here.."
                        required />
                  </div>
                <button type="submit" class="btn btn-primary btn-block btn-lg">Post!</button>
              </form>
              <p>&nbsp;</p>
              { this.props.images.map((image, key) => {
                return(
                  <div className="card mb-4" key={key} >
                    <div className="card-header">
                      <img
                        className='mr-2'
                        width='30'
                        height='30'
                        src={`data:image/png;base64,${new Identicon(image.author, 30).toString()}`}
                      />
                      <small className="text-muted">{image.author}</small>
                    </div>
                    <ul id="imageList" className="list-group list-group-flush">
                      <li className="list-group-item">
                        <p class="text-center">
                        <FileViewer
                            fileType={image.fileType}
                            filePath={`https://blchain-rjv.infura-ipfs.io/ipfs/${image.hash}`}
                          />
                        </p>
                        <p>{image.description}</p>
                      </li>
                      <li key={key} className="list-group-item py-2">
                        <button className="btn btn-link btn-sm float-left pt-0"
                          name={image.id}
                          onClick={(event) => {
                            this.props.tipImageOwner(event.target.name);
                          }}>
                          Like: {image.likesCount.toString()} 
                        </button>
                        <button
                          className="btn btn-link btn-sm float-right pt-0"
                          name={image.id}
                          onClick={(event) => {
                          console.log(image);  
                          // if(image.comments==null){
                          //   image.comments = [];
                          // }
                           image.comments.map((comment,key)=>{
                            return(
                              <div>
                                <ul id = "commentsList" className="list-group list-group-flush">
                                <li className="list-group-item">
                                  <p class="text-center">
                                    {comment.author}
                                  </p>
                                  <p>{comment.content}</p>
                                </li>
                                </ul>
                              </div>
                            )
                           })
                          }}
                        >
                          Comments
                        </button>
                        <div className="form-group mr-sm-2">
                        <br></br>
                          <input
                            id="commentPost"
                            type="text"
                            onChange={(input) => { this.commentPost = input.target.value }}
                            className="form-control"
                            placeholder="Enter a comment.."
                            />
                          </div>
                        <button type="submit" class="btn btn-primary btn-block btn-sm"
                          name={image.id}
                          onClick={(event) => {
                            console.log(event.target.name);
                            this.props.commentBlog(event.target.name,this.commentPost);
                          }}
                        >
                          comment!
                        </button>
                      </li>
                    </ul>
                  </div>
                )
              })}
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default Main;