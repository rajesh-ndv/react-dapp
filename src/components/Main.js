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
                this.props.uploadBlog(description)
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
              { this.props.blogs.map((image, key) => {
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
                            this.props.likeBlog(event.target.name);
                          }}>
                          Like: {image.likesCount.toString()} 
                        </button>
                        <button
                          className="btn btn-link btn-sm float-right pt-0"
                          name={image.id}
                          onClick={async (event) => {
                          var result = await this.props.loadComments(image.id) ;
                          console.log(result);
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