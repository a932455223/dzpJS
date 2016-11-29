//html livereload.
if(process.env.NODE_ENV==='development'){
	require('../index.html');
}
require('../css/style.css');
var dzp = require('./dzp');

new dzp('dzpWrap',{

});