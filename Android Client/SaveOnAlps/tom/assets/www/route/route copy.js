
var pages = 3;
var currentPage = 1;

/*window.addEventListener('load', function(){
	window.scrollTo(0, 0);
	

});*/


setHeight();

var btnNext = document.getElementsByClassName('btn-next');
var btnPrev = document.getElementsByClassName('btn-prev');


var nextSlide = function(){

	if(currentPage < pages && scroll == false){

		currentPage += 1;
		setHeight();
		//window.scrollTo(0, 0);
		document.getElementById("page"+(currentPage-1)).style.left = "-100%";
		document.getElementById("page"+currentPage).style.left = "0";
	}
}

var prevSlide = function(){
	if(currentPage > 1 && scroll == false){
		currentPage -= 1;
		setHeight();
		//window.scrollTo(0, 0);
		document.getElementById("page"+(currentPage+1)).style.left = "100%";
		document.getElementById("page"+currentPage).style.left = "0";

	}
}


function setHeight(){

	var currentPageHeight = document.getElementById("page"+currentPage).offsetHeight;
	document.getElementById("wrapper").style.height = currentPageHeight+"px";

}

var btnRouteErstellen = document.getElementById('page1-btn-route-erstellen');	
var btnZurueck = document.getElementById('route-header-btn-back');

var zielgebietul = document.getElementById('zielgebiet-ul');
var zielgebietList = zielgebietul.children;

for(var i = 0; i < zielgebietList.length; i++)
{

	zielgebietList[i].addEventListener('touchend',nextSlide);
	


}


btnRouteErstellen.addEventListener('touchend',nextSlide);
btnZurueck.addEventListener('touchend',prevSlide);


var touchYpos = 0;
var touchDifference = 0;
var scroll = false;

window.addEventListener('touchstart',function(evt){

	scroll = false;
	touchDifference = 0;
	touchYpos = evt.touches[0].clientY;
	

	


});


window.addEventListener('touchmove',function(evt){

	
	
	touchDifference = touchYpos - evt.touches[0].clientY;
	console.log(touchDifference);
	console.log(evt.screenY);

		if(Math.abs(touchDifference) > 10){
		
		scroll = true;

	}
	


});

window.addEventListener('touchend',function(evt){

	console.log(scroll);
});