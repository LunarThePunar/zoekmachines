import "./article.css"
import React, {Component} from "react";
import logo from './resources/reuters.png';

const axios = require('axios');

export default class Article extends Component {

    constructor(props) {
        super(props);

        console.log(this.props.match.params.id)

        this.state = {
            id: this.props.match.params.id ? this.props.match.params.id : 1, 
            body: "\n"
        };
    
        this.body = this.body.bind(this);
        this.content = this.content.bind(this);
      }

    async componentDidMount() {
        axios.get('/api/article/' + this.state.id)
        .then((response) => {
          this.setState({
            title: response.data['title'],
            body: response.data['body'],
            date: response.data['date'],
            topics: response.data['topics'],
            places: response.data['places'],
            read_time: response.data['read_time']
          })
        })
        .catch(function (error) {
          console.log("ERROR: Could not perform search query");
          console.log(error);
        });
      }

    body () {
      let newText = this.state.body.split("\n").map((item, i) => {
        return (
          <React.Fragment key={`${item}-${i}`}>
            {item}
            <br />
          </React.Fragment>
        );
      });

      return newText;
    }

    content() {
      return(
        <div className="mainContainer">
          <div className="headerContainer">
            <div className="topbar">
              <div className="topbarLeft">
                <a href="/" className="topbarText">Discover Thomson Reuters</a>
              </div>
            </div>
            <div className="headerContent">
              <div className="header">
              <a href="/"><img src={logo} alt="Logo" /></a>
              </div>
            </div>
          </div>
          <div className="titleContainer">
            <div className="foreground">
              <div className="twoColumn">
                <div className="columLeft">
                  <div className="articleHeader">
                    <div className="articleHeaderChannel">
                        <span>{this.state.topics}</span>
                    </div>
                    <div className="articleHeaderDate">{this.state.date}</div>
                    <h1 className="headerHeadline">{this.state.title}</h1>
                  </div>
                </div>
                <div className="columnRight"></div>
              </div>
            </div>
          </div>
          <div className="lowerContainer">
            <div className="twoColumn">
              <div className="columnLeft">
                <div className="articleHeader">
                  <div className="linebarFirst">
                    <div className="linebarBorderwrap">
                      <div className="lineBarLast">
                        <p className="readingTime">{this.state.read_time} min read</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="columnRight"></div>
            </div>
          </div>
          <div className="standardArticle">
            <div className="articleContainer">
              <div className="articleBody">
                <this.body />
              </div>
            </div>
          </div>
        </div>
      );
    }

    
    render () {
        return (
            <div>
              <this.content />
            </div>
        );
    }
}


