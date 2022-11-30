import React, { Component } from "react";

class ListItem extends Component{

    render() {

        return(
            this.props.comments.map((comment,key)=>{
                return(
                  <div>
                    <ul id = "commentsList" className="list-group list-group-flush">
                    <li className="list-group-item">
                       Author Address:  
                      <p class="text-left">
                        {comment.author}
                      </p>
                      Comment: 
                      <p>{comment.content}</p>
                    </li>
                    </ul>
                  </div>
                )
            })
        );
    }

}

export default ListItem;