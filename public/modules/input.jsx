import React from 'react';

class Textfield extends React.Component {
    render() {
        return (
          <div>
            <label>{this.props.children}: </label>
            <input type="text" onChange={this.update.bind(this)} ref="input" />
          </div>
        );
    }
    update() {
      this.props.onUpdate(this.props.mykey, this.refs.input.value);
    }

}
Textfield.propTypes = {};
export default Textfield;
