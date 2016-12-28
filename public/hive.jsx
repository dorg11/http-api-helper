import React from 'react';
import Textfield from './modules/input';

class Hive extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      array : ["a","b"]
    };
  }
  render() {
    return (
      <div>
        <select>{this.state.array}</select>
      </div>
    );
  }
}
Hive.propTypes = {

};
export default Hive;
