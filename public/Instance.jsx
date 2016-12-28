import React from 'react';
import Textfield from './modules/input';
import './utils'
var Utils = {
    getParameterByName(name, url) {
        if (!url) {
            url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results)
            return null;
        if (!results[2])
            return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    },
    ParseInstance(url) {
        var anchor = document.createElement('a');
        anchor.href = url;
        var data = this.getParameterByName('instance', anchor.search).split('.');
        return JSON.parse(atob(data[1]));
    }
}

class Body extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Url: '',
            secretKey: '',
            vpi: '',
            res: '',
            instance: {},
            newUrl: ''
        }
    }
    onUpdate(key, val) {
        this.setState({[key]: val});
        if (key == 'Url') {
            try {
                this.setState({instance: Utils.ParseInstance(val)})
            } catch (err) {
                console.log('not a valid URL');
            }
        }
    }
    changeInstance() {
        var temp = this.state.instance;
        temp.vendorProductId = this.state.vpi;
        this.setState({instance: temp});
        this.sendRequest();

    }
    sendRequest() {
        var self = this;
        var newInstance = 'instance=';
        var instanceData = btoa(JSON.stringify(this.state.instance));
        var temp = this.state.Url;
        var getUrl = '/sign?data=' + instanceData + '&signature=' + this.state.secretKey;
        var myInit = {
            method: 'GET',
            mode: 'cors',
            cache: 'default'
        };
        fetch(getUrl).then(function(response) {
            response.text().then(function(res) {
              newInstance += res + '.' + instanceData + '&';
              temp = temp.replace(/instance=.*&/, newInstance);
              self.setState({newUrl: temp});
            })
        })
    }
    render() {
        return (
            <div>
                <h1>Instance helper</h1>
                <p>response : {this.state.res}</p>
                <Textfield mykey="Url" onUpdate={this.onUpdate.bind(this)}>Url</Textfield>
                <Textfield mykey="secretKey" onUpdate={this.onUpdate.bind(this)}>Secret Key</Textfield>
                <Textfield mykey="vpi" onUpdate={this.onUpdate.bind(this)}>vendor product id</Textfield>
                <input type="button" onClick={this.changeInstance.bind(this)}/>
                <pre>{JSON.stringify(this.state.instance, null, 2)}</pre>
                <textarea value={this.state.newUrl}></textarea>
            </div>
        );
    }
}
Body.propTypes = {};
export default Body;
