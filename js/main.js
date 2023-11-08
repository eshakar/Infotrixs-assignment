//Animate Counting Numbers
function start_number_counters($whichones)
{
  $($whichones).each(function()
  {
    $(this).prop('Counter',0).animate(
    {Counter: $(this).text()},
    {duration:5000, easing:'swing', step:function(now){$(this).text(Math.ceil(now));} });
  });
}

function updateStats()
{
  let xmlhttp = new XMLHttpRequest();
  let key = '';
  let ts = Math.round((new Date()).getTime() / 1000);
  xmlhttp.onreadystatechange = function()
  {
    if (this.readyState == 4 && this.status == 200){ document.getElementById('stat-requests').innerHTML = (this.responseText); }
  };
  xmlhttp.open("GET", "https://zenquotes.io/api/stats/" + key, true);
  xmlhttp.send();
}


//Is HTML Element in Viewport?
var isInViewport = function(elem)
{
  if(elem)
  {
    var distance = elem.getBoundingClientRect();
    return(
      distance.top >= 0 &&
      distance.left >= 0 &&
      distance.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      distance.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
};


//Trigger the number counting animation when in view
var findMe = document.querySelector('#quote-figures');
var a = 0;
window.addEventListener('scroll', function(event)
{
  if(isInViewport(findMe) && (a==0))
  {
    start_number_counters(".counter-count");
    a = 1;
    setTimeout(function(){setInterval(updateStats,10000);},10000);
  }
}, false);




//Load max batch of quotes into local storage and refresh with javascript after 2 hours
function storeLocalQuotes()
{
  let xmlhttp = new XMLHttpRequest();
  let ts = Math.round((new Date()).getTime() / 1000);
  let zenQuotesArray = null;
  xmlhttp.onreadystatechange = function()
  {
    if (this.readyState == 4 && this.status == 200){ ts = ts + (7200); zenQuotesArray = '{"timestamp":'+ts+',"quotes":'+this.responseText+'}'; }
    else{ts = ts + (30); zenQuotesArray = '{"timestamp":'+ts+',"quotes":[{"q":"API Service Unavailable","a":"ZenQuotes.io"}]}';}
    localStorage.setItem('zenQuotesData',zenQuotesArray);
  };
  xmlhttp.open("GET", "https://zenquotes.io/api/quotes", true);
  xmlhttp.send();
}


//Retrieve a random quote at set interval from local storage and refresh array after 24 hours
function fetchLocalQuotes(whereto)
{
  //Define HTML element and default text
  let element = document.getElementById(whereto);
  if(element)
  {
  element.innerHTML = 'Loading quote....'; let timeout = 0;
  //Check for data and set appropriate First load timeout
  if(!localStorage.getItem('zenQuotesData')){storeLocalQuotes();timeout = 1000;}else{timeout = 0;}
  //Use timeout to allow API first load
  setTimeout(function()
  {
    //Fetch data and check if expired
    let zenQuotesArray = JSON.parse(localStorage.getItem('zenQuotesData'));
    let refresh = (zenQuotesArray)? Math.round(zenQuotesArray['timestamp'] - (new Date().getTime() / 1000)) : 0;
    if(!zenQuotesArray || refresh < 10){storeLocalQuotes();}
    //Get random quotes
    let rand0 = (zenQuotesArray)? zenQuotesArray['quotes'][Math.floor(Math.random() * zenQuotesArray['quotes'].length)] : '';
    let rand1 = (zenQuotesArray)? zenQuotesArray['quotes'][Math.floor(Math.random() * zenQuotesArray['quotes'].length)] : '';
    let rand2 = (zenQuotesArray)? zenQuotesArray['quotes'][Math.floor(Math.random() * zenQuotesArray['quotes'].length)] : '';
    let rand3 = (zenQuotesArray)? zenQuotesArray['quotes'][Math.floor(Math.random() * zenQuotesArray['quotes'].length)] : '';
    //Print UI elements
    document.getElementById('carousel-quote-1').innerHTML = '<h1>&ldquo;'+rand0['q']+'&rdquo;</h1><p>'+rand0['a']+'</p>';
//    document.getElementById('carousel-quote-2').innerHTML = '<h1>&ldquo;'+rand1['q']+'&rdquo;</h1><p>'+rand1['a']+'</p>';
//    document.getElementById('carousel-quote-3').innerHTML = '<h1>&ldquo;'+rand2['q']+'&rdquo;</h1><p>'+rand2['a']+'</p>';
    element.innerHTML = rand3['h'];
    console.log('The Zen Quotes API will refresh in '+refresh+' seconds.');
  },timeout);
  }
}
//Run Immediately on Page Load and Set Interval for 10 seconds
fetchLocalQuotes("storage");setInterval(function(){fetchLocalQuotes("storage")},15000);


$(document).ready(function(){
  $(".page-scroll").on('click', function(event) {
    if (this.hash !== "") {
      event.preventDefault();
      var hash = this.hash;
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 800, function(){
        window.location.hash = hash;
      });
    }
  });
});
