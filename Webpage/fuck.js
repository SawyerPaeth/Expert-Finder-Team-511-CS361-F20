async function myFunction(time) {
  setTimeout(function(){},time);
  return {timeset:time};
}
var context = [];
for(i=4; i > 0; i--){
	myFunction(i*1000).then(
	  function(value) {console.log(value);},
	  function(error) {console.log(error);}
	);
}
