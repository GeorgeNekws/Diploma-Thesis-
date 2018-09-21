$(function() {

  var container = $('div.container');

    // Submit post on submit
    $('#post-form').on('submit', function(event){
        event.preventDefault();
        console.log("form submitted!")  // sanity check
        create_post(); //we call the function create_post() , which is declared below
    });

    // AJAX for posting
    function create_post(){
      console.log("create post is working!")
      $.ajax({
        url: "http://127.0.0.1:8000/csv_app/create_post/",
        type: "POST",
        data: {
          the_post: $('#post-text').val() //data that i send to back-end , to 'create_post' view, see also the <form action ="create_post"
        },

        //handle a successful Response
        success: function(json){  //the data that are coming back are in the arg 'json'
          $('#post-text').val('');  //empty the form data , for a possible new search
          console.log(json);
          console.log("success");
          $.each(json,function(index, item){  // [ {}, {}, {}, ...]
            $.each(item, function(key,value){
              $(".container").append(key + ": " + value + '</br>'); //either this way i reference to   <div class="container">

            });
            container.append('<br/></br>'); // or this way ,via the var 'container' that i declare on top
          });
        },

        //handle a non-successful Response
        error : function(xhr,errmsg,err) {
          $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
          " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
          console.log(xhr.status + ": " + xhr.responseText);
        }
      });
    };


    // This function gets cookie with a given name
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    var csrftoken = getCookie('csrftoken');

    /*
    The functions below will create a header with csrftoken
    */

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    function sameOrigin(url) {
        // test that a given url is a same-origin URL
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                // Send the token to same-origin, relative URLs only.
                // Send the token only if the method warrants CSRF protection
                // Using the CSRFToken value acquired earlier
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

});


// MAYBE i need pure javascript to send the form data to the back-end and then get the reply to p5js
var globalData;
var forma ;
var m;
var x;
var gene_len = 1000;

function setup() {
  // x,y
  canvas = createCanvas(1100,600);
  canvas.position(245,100);
  console.log(windowWidth);
  background(220);
  //var button = select("#my-button") ;
  var button = createButton('click me');
  forma = select('#form');
  button.parent(select('.container'));
  button.mousePressed(getJson)
  //button.mousePressed(getJson);
}

function getJson(){
  loadJSON("http://127.0.0.1:8000/csv_app/my_data/?q_search="+forma.value(), gotData);
}

function gotData(data){
  globalData = data;
  console.log(globalData);

}

function draw(){
  //clear();
  m = 800-200;
  m = m/gene_len;
  x = width - gene_len*m;
  x = x/2;
  //m = 0.6
  //x =300
  strokeWeight(5);
  line(x,200,x+gene_len*m,200);
  line(20,40,1080,40);

  var j = 100;
  //line(100,100,1000,100)
  if (globalData){
    console.log('ok');
    for(var i =0;i<globalData.length;i++){
      //line(x1,y1, x2,y2)
      line(globalData[i].bind_start,100+10*i,globalData[i].bind_stop,100+10*i);
      //line(x+array[i]*m,195,x+array[i]*m,205)
      /*console.log(globalData[i].mirna_name);
      console.log(globalData[i].bind_start);
      console.log(globalData[i].bind_stop);
      console.log(100+i*j);*/
      //point(globalData[i].bind_start,100);
      //point(globalData[i].bind_stop,200);
    }
    globalData = 0;
  }
}
