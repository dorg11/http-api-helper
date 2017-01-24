import React from 'react';

class Hive extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            requestType: "GET",
            relativeUrl: "/contacts",
            errorMessages: [],
            result: {}
        }
        this.updateState = this.updateState.bind(this);
        this.sendRequest = this.sendRequest.bind(this);
    }
    updateState(key, data) {
        this.setState({[key]: data});
    }
    sendRequest(event) {
        event.preventDefault();
        if (this.state.requestType == 'GET') this.state.rawBody = '';
        console.log(this.state);
        fetch('/hivePost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        }).then(response => {
            return response.text().then(text => this.setState({result: JSON.parse(text)}))
        });
    }
    render() {
        return (
            <div>
                <form onSubmit={this.sendRequest}>
                    <RequestTypes onUpdate={this.updateState} value={this.state.requestType}/>
                    <CheckCustom onUpdate={this.updateState}/>
                    <RelativeUrl onUpdate={this.updateState} customUrl={this.state.customUrl} value={this.state.relativeUrl} requestType={this.state.requestType}/>
                    <QueryParams onUpdate={this.updateState} version={this.state.requestType == 'POST' && this.state.relativeUrl == '/contacts'
                        ? "2.0.0"
                        : "1.0.0"}/>
                    <JsonTextarea onUpdate={this.updateState} show={this.state.requestType != 'GET'}>Raw Body</JsonTextarea>
                    <Textinput onUpdate={this.updateState} statekey="appId">App Id</Textinput>
                    <Textinput onUpdate={this.updateState} statekey="secretKey">Secret Key</Textinput>
                    <Textinput onUpdate={this.updateState} statekey="instanceId">Instance Id</Textinput>
                    <input type="submit" value="Send"/>
                </form>
                <showResult result={this.state.result} />

            </div>
        );
    }
}
function showResult(props) {
  var signString = JSON.stringify(props.result.signString, null, 2);
  var options = JSON.stringify(props.result.options, null, 2);
  var response = JSON.stringify(props.result.response, null, 2);
  return (
    <div>
      <div><pre>{signString}</pre></div>
      <div><pre>{options}</pre></div>
      <div><pre>{response}</pre></div>
    </div>
  )
}
function RelativeUrl(props) {
    if (props.customUrl) {
        return (
            <Textinput statekey="relativeUrl" onUpdate={props.onUpdate}>Url</Textinput>
        )
    } else {
        return (<UrlOptions onUpdate={props.onUpdate} value={props.value} type={props.requestType}/>)
    }
}
function CheckCustom(props) {
    return (
        <label>Enter custom url:
            <input type="checkbox" onChange={event => {
                if (event.target.checked == false)
                    props.onUpdate("relativeUrl", "/contacts");
                props.onUpdate("customUrl", event.target.checked);
            }}/>
        </label>
    )
}
class JsonTextarea extends React.Component {
    constructor(props) {
        super(props);
        this.updateParentState = this.updateParentState.bind(this);
    }
    updateParentState(string) {
        try {
            var parsed = JSON.parse(string);
            this.props.onUpdate("rawBody", parsed);
        } catch (err) {
            console.log(err);
        }
    }
    render() {
        if (this.props.show) {
            return (
                <label>
                    {this.props.children}:
                    <textarea onBlur={event => this.updateParentState(event.target.value)}></textarea>
                </label>
            )
        } else {
            return null
        }
    }
}

class QueryParams extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            paramString: "?version=" + this.props.version
        }
        this.props.onUpdate("queryString" , this.state.paramString);
        this.blurFunc = this.blurFunc.bind(this);
        this.updateState = this.updateState.bind(this);
        this.parseQuery = this.parseQuery.bind(this);
        this.blurFunc();
    }
    blurFunc() {
        try {
            var parsed = this.parseQuery();
            this.props.onUpdate("queryParams", parsed);
            this.props.onUpdate("queryString", this.state.paramString);
        } catch (err) {
            console.log(err);
        }
    }
    updateState(key, value) {
        this.setState({paramString: value});
    }
    parseQuery() {
        return this.state.paramString.replace(/(^\?)/, '').split("&").map(function(n) {
            return n = n.split("="),
            this[n[0]] = n[1],
            this
        }.bind({}))[0];
    }
    render() {
        return (
            <Textinput value={this.state.paramString} blurFunc={this.blurFunc} statekey="paramString" onUpdate={this.updateState}>Query Params</Textinput>
        );
    }
}

function Textinput(props) {
    return (
        <label>
            {props.children}:
            <input value={props.value} type="text" onBlur={props.blurFunc} onChange={event => props.onUpdate(props.statekey, event.target.value)}/>
        </label>
    )
}
Hive.propTypes = {};
export default Hive;

function Select(props) {
    const selectItems = props.items.map((value, index) => <option key={index}>{value}</option>);
    return (
        <select onChange={data => props.onUpdate(props.statekey, data.target.value)}>{selectItems}</select>
    );
}
function UrlOptions(props) {
    const typeObject = {
        "GET": [
            '/contacts',
            '/contacts/search',
            '/contacts/mailingList',
            '/premium/oneTimePurchases',
            '/activities',
            '/activities/types',
            '/labels',
            '/sites/site',
            '/sites/site/contributors',
            '/sites/site/pages',
            '/sites/site/settings',
            '/service/actions/email/providers',
            '/billing/products',
            '/billing/active',
            '/redirects'
        ],
        "POST": [
            '/contacts',
            '/activities',
            '/labels',
            '/notifications',
            '/services/actions/email',
            '/services/actions/email/single',
            '/services/actions/done',
            '/bulk/contacts',
            '/batch'
        ],
        "PUT": ['Only custom Urls']
    };
    return (
        <label>
            Url:
            <Select statekey="relativeUrl" items={typeObject[props.type]} value={props.value} onUpdate={props.onUpdate}/>
        </label>
    );

}
function RequestTypes(props) {
    const types = ['GET', 'POST', 'PUT'];
    return (
        <label>
            Request Type:
            <Select statekey="requestType" onUpdate={props.onUpdate} value={props.value} items={types}></Select>
        </label>
    );
}
