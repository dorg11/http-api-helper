import React from 'react';
import Switch from 'react-bootstrap-switch';


class Hive extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            requestType: "GET",
            relativeUrl: "/contacts",
            inputCheck: {},
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
            <div className="container-fluid">
              <form className="form-horizontal" onSubmit={this.sendRequest}>
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
                  <SubmitButton />
              </form>
              {Object.keys(this.state.result).length ? <ShowResult result={this.state.result}/> : null }
            </div>
        );
    }
}
function SubmitButton(props) {
  return (
    <FormElement>
      <input className="form-control" type="submit" value="Send"/>
    </FormElement>
  )
}
function ShowResult(props) {
  var signString = JSON.stringify(props.result.signString, null, 2);
  var options = JSON.stringify(props.result.options, null, 2);
  var response = JSON.stringify(props.result.response, null, 2);
  return (
    <div className="col-xs-offset-2 col-xs-10">
      <div><label>Sign string</label><pre>{signString}</pre></div>
      <div><label>Request</label><pre>{options}</pre></div>
      <div><label>Response</label><pre>{response}</pre></div>
    </div>
  )
}
function FormElement(props) {
  return (
    <div className="form-group">
        <label className="col-xs-2 control-label">{props.label}</label>
        <div className="col-xs-10">
          {props.children}
        </div>
    </div>
  )
}
function RelativeUrl(props) {
    if (props.customUrl) {
        return (
          <Textinput statekey="relativeUrl" onUpdate={props.onUpdate}>Url</Textinput>
        )
    } else {
        return (
          <UrlOptions onUpdate={props.onUpdate} value={props.value} type={props.requestType}/>
        )
    }
}
function CheckCustom(props) {
    return (
      <FormElement label="Url Is Custom?">
        <Switch defaultValue={false} onChange={(elem, val) => props.onUpdate("customUrl", val)}/>
      </FormElement>
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
        }
    }
    render() {
        if (this.props.show) {
            return (
              <FormElement label={this.props.children}>
                <textarea className="form-control" onBlur={event => this.updateParentState(event.target.value)}></textarea>
              </FormElement>
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
        this.blurFunc = this.blurFunc.bind(this);
        this.updateState = this.updateState.bind(this);
        this.parseQuery = this.parseQuery.bind(this);
    }
    componentWillMount() {
      this.props.onUpdate("queryString" , this.state.paramString);
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
      <FormElement label={props.children}>
        <input className="form-control" value={props.value} type="text" onBlur={props.blurFunc} onChange={event => props.onUpdate(props.statekey, event.target.value)}/>
      </FormElement>
    )
}
Hive.propTypes = {};
export default Hive;

function Select(props) {
    const selectItems = props.items.map((value, index) => <option key={index}>{value}</option>);
    return (
        <select className="form-control" onChange={data => props.onUpdate(props.statekey, data.target.value)}>{selectItems}</select>
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
      <FormElement label="Url">
        <Select statekey="relativeUrl" items={typeObject[props.type]} value={props.value} onUpdate={props.onUpdate}/>
      </FormElement>
    );

}
function RequestTypes(props) {
    const types = ['GET', 'POST', 'PUT'];
    return (
      <FormElement label="Request Type">
        <Select statekey="requestType" onUpdate={props.onUpdate} value={props.value} items={types}></Select>
      </FormElement>
    );
}
