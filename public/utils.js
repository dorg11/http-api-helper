class Utils{
  constructor() {
    this.a = 'aa';
  }
  getParameterByName(name, url) {
      if (!url) {
          url = window.location.href;
      }
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
          results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
  }
  ParseInstance(url) {
        var anchor = document.createElement('a');
        anchor.href = url;
        var data = getParameterByName('instance', anchor.search).split('.');
        return JSON.parse(atob(data[1]));
  }
}
