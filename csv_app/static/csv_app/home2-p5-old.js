

$(function() {
  var container = $('.superman');
  var selected_species = [];
  var selected_bind_types = [];
  var transcript_length;

  /********************************************************/
  //While ajax is loading , show the 'loading avatar'
  $(document).ajaxStart(function(){
      $("#wait").css("display", "block");
  });
  $(document).ajaxComplete(function(){
      $("#wait").css("display", "none");
  });
  /********************************************************/

  /**********************************************************************************************************/
  //This is an EVENT
  $('#post-form').on('submit', function(event){
      event.preventDefault();
      //if (document.getElementById("mySidebar").style.display != "none"){
        //document.getElementById("mySidebar").style.display = "none";
        //document.getElementById("myOverlay").style.display = "none";
      //}

      console.log("form submitted!");  // sanity check

      if($('#post-text').val() == ''){  // IF the "transcript id" form field is not completed , ...
        selected_species = [];    //empty the checkbox LIST for a new search
        selected_bind_types = [];
        alert("PLEASE INSERT A TRANSCRIPT ID");
      }
      else{
        $(".my-hidden-btns").css("visibility", "visible");
        $("#h2-result").css("visibility", "visible");
        my_data_serialize(); //we call the function create_post() , which is declared below
      }
  });
  /**********************************************************************************************************/

  /**********************************************************************************************************/
  function my_data_serialize(){
    console.log("create post is working!");
    console.log(typeof(selected_species));

    $.ajax({
      url: "http://127.0.0.1:8000/csv_app/my_data/",
      type: "POST",
      dataType: 'json',
      data: {
        the_transcript: $('#post-text').val(), //data that i send to back-end , to 'create_post' view, see also the <form action ="create_post"
        the_score: $('#score-field').val(),
        the_site: $('#site-field').val(),
        the_num_of_conserved: $('#conserved-species-field').val(),
        the_species: selected_species ,
        the_bind_types: selected_bind_types,
      },

      //handle a successful Response
      success: function(json){  //the data that are coming back are in the arg 'json'  -->[{}, [{},{},{}...], {},{},{}]
        //$('#post-text').val('');  //empty the form data , for a possible new search
        selected_species = [];    //empty the checkbox LIST for a new search
        selected_bind_types = [];
        console.log(json[0]);
        console.log("success");
        console.log('JSON LENGTH : ' + json.length);

      }
    });
  };
  /**********************************************************************************************************/

  /**********************************************************************************************************/
  //This is an EVENT
  $('#initial-form').on('submit', function(event){
      event.preventDefault();
      console.log("Initial form submitted!");  // sanity check

      var user_input;
      var user_data_type;

      if( ($('#post-gene').val() == '') && ($('#post-transcript').val() == '') && ($('#post-mirna').val() == '') ){
        alert("Please fill a field!");
      }
      else{
        if($('#post-gene').val() != ''){
          user_input = $('#post-gene').val();
          user_data_type = 'gene';
        }
        else if($('#post-transcript').val() != ''){
          user_input = $('#post-transcript').val();
          user_data_type = 'transcript';
        }
        else if($('#post-mirna').val() != ''){
          user_input = $('#post-mirna').val();
          user_data_type = 'mirna';
        }
        document.getElementById("post-text").defaultValue = user_input ;  //Put the user input value to the filter search box
        initial_ask_for_data(user_input,user_data_type);                  //call the function that makes the AJAX request
      }
  });
  /**********************************************************************************************************/


  /**********************************************************************************************************/
  function initial_ask_for_data(user_input,user_data_type){

    $.ajax({
      url: "http://127.0.0.1:8000/csv_app/data_search/",
      type: "POST",
      dataType: 'json',
      data: {
        user_data: user_input ,
        user_data_type: user_data_type,

        the_score: $('#score-field').val(),
        the_site: $('#site-field').val(),
        the_num_of_conserved: $('#conserved-species-field').val(),
        the_species: selected_species ,
        the_bind_types: selected_bind_types,
      },

      //handle a successful Response
      success: function(json){  //the data that are coming back are in the arg 'json'  -->[{}, [{},{},{}...], {},{},{}]
        //$('#post-text').val('');  //empty the form data , for a possible new search

        console.log(json[0]);
        console.log("success in initial ask for data");
        console.log('JSON LENGTH : ' + json.length);

        //***********************/
        //clear superman - div content
        $('.superman').empty();     //PROSOXI AYTO SVINEI OLA TA CLASSES KAI IDS POU EXW DWSEI STA ELEMENTS MOU , ISWS EINAI KALYTERA NA MHN TO XRISIMOPOISW KAI NA KANW LOAD MIA ALLI HTML SELIDA

        /*container.append('<br/></br>');
        $.each(json,function(index, item){  // [ {}, {}, {}, ...]
          $.each(item, function(key,value){
            container.append(key + ": " + value + '</br>'); //either this way i reference to   <div class="container">
          });
          container.append('<br/></br>'); // or this way ,via the var 'container' that i declare on top
        });*/
        /***********************/


        var megisto=0;
        var elaxisto = 900000000; //mikroteri ari8mitika 8esi pou 3ekinaei ena mirna panw sto chr mallon

        for(i = 3; i < json.length; i++) {
          if(parseInt(json[i].bind_stop) > megisto){
            megisto = parseInt(json[i].bind_stop);
          }
          if(parseInt(json[i].bind_start) < elaxisto){
            elaxisto = parseInt(json[i].bind_start);
          }
        }
        var new_length = megisto - elaxisto  ; //AYTO 3ANAKOITA3ETW !!!!!!!!
        console.log('mirna elaxisto '+elaxisto);
        console.log('mirna megisto ' +megisto);
        //krataw kai kanw visualize to meros tou transcript apo to opoio arxizoun kai ginontai binds mexri ekei pou teleinoun
        //den deixnw olo to euros tou transcript apo tin arxi mexri to telos tou
        // kai oi sintetagmenes pou exw valei stin arxi,telos tou den exoun noima ekei , mporw na to kanw scrollable

        var megisto2=0;
        var elaxisto2 = 900000000; //mikroteri ari8mitika 8esi pou 3ekinaei ena mirna panw sto chr mallon
        var boo = json[2];

        if(boo[0].strand == 1){
          console.log('STRAIGHT STRAND');
          for(i = 0; i < boo.length; i++) {
            if(boo[i].five_utr_start < elaxisto2 && boo[i].five_utr_start !=0){
              elaxisto2 = boo[i].five_utr_start;
            }
            if(boo[i].three_utr_stop > megisto2 ){
              megisto2 = boo[i].three_utr_stop;
            }
          }
        }
        else if (boo[0].strand == -1) {
          console.log('INVERSE STRAND');
          for(i = 0; i < boo.length; i++) {
            if(boo[i].three_utr_start < elaxisto2 && boo[i].three_utr_start !=0){
              elaxisto2 = boo[i].three_utr_start;
            }
            if(boo[i].five_utr_stop > megisto2){
              megisto2 = boo[i].five_utr_stop;
            }
          }
        }
        var new_length2 = megisto2 - elaxisto2  ; //AYTO 3ANAKOITA3ETW !!!!!!!!

        console.log('5utr elaxisto2 '+ elaxisto2);
        console.log('3utr megisto2 ' + megisto2);
        console.log('new_length ' +new_length);
        console.log('new_length2 '+ new_length2);

        //allazw se new_length2 : sto draw_the_miRNAs() kai sta: new Rect_region=()

        //Draw the chromosome and the gene that the given transcript belongs to
        canvas_position();
        draw_the_chromosome(json[0], json[1]);
        draw_the_gene(json[0]);

        //Draw the given by user Transcript as a line
        //*********TODo transcript name also , not only transcript ID

        //fill('blue');
        noStroke();
        textSize(9);
        //text(user_input,530,200);
        var name_transcr= createP(user_input);
        name_transcr.style('text-align','center');
        name_transcr.style('padding','35px');
        name_transcr.style('font-size','13px');

        fill('black');
        text(json[0].transcript_start,25,265);
        text(json[0].transcript_stop,1170,265);


        stroke('black');
        strokeWeight(1);
        line(30,240,1210,240);
        line(30,237,30,243);
        line(1210,237,1210,243);

        //Draw all the related microRNAs
        draw_the_miRNAs(json,new_length2,elaxisto2);
        console.log("finish");

        //Draw the 3'utr , 5'utr , cds , exon regions as rectangulars on the transcript.
        var three_utrs = []; //put objects created in list
        var five_utrs = []; //put objects created in list
        var cds = []; //put objects created in list
        var region_info = json[2]; //u can use this variable instead of region_info

        for (var i=0; i<region_info.length;i++){
          if(region_info[i].three_utr_start != 0){
            //call class
            r = new Rect_region(region_info[i].three_utr_start, region_info[i].three_utr_stop, 'red', elaxisto2, new_length2);
            three_utrs.push(r);
            r.draw_region();
          }
          if(region_info[i].five_utr_start != 0){
            //call class
            r = new Rect_region(region_info[i].five_utr_start, region_info[i].five_utr_stop, 'green', elaxisto2, new_length2);
            five_utrs.push(r);
            r.draw_region();
          }
          if(region_info[i].genomic_coding_start != 0){
            //call class
            r = new Rect_region(region_info[i].genomic_coding_start, region_info[i].genomic_coding_stop, 'blue', elaxisto2, new_length2);
            cds.push(r);
            r.draw_region();
          }
          //draw exon regions , transparently as divs onmouse give color hover
        }
        console.log('done Region');
      },

      //in case AJAX is NOT successful
      error : function(xhr,errmsg,err) {
        $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
        " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
        console.log("FAILURE");
        console.log(xhr.status + ": " + xhr.responseText);
      }
    });
  };


  /*--------------------------------------------------------------------------------------------*/

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




/************************************** P5.JS *****************************************************/
var mirnas = []; //put objects created in list

var canvas_x = 50;
var canvas_y = 250;
var canvas_width = 1280;
var canvas_height = 1500;

function setup() {
  //var canvas = createCanvas(1100,1000);
  //canvas.position(230,600);
  console.log(windowWidth);
  //background('yellow');
  //noLoop();
  //clear();
  //var button = select("#my-button") ;
  //var button = createButton('click me');
  //button.parent(select('.col-md-3'));
  //button.mousePressed(getJson)
}

function canvas_position(){
  var canvas = createCanvas(canvas_width, canvas_height);  //(1280,1500)
  canvas.position(canvas_x, canvas_y); //upper left point of canvas to position (x,y)=(50,350)
  console.log(windowWidth);
  background('yellow');
  //noLoop();
  clear();
}

//auti edw i sinartisi isws xreiazetai to loop (mn valeis ISWS noLoop sto setup , 8a to dokoimasw)
function mousePressed(){
  for(var i=0; i<mirnas.length; i++){
    mirnas[i].clicked(mouseX,mouseY);
  }
}


function draw_the_miRNAs(json,new_length,alpha){
  //isws prepei na dilwnw thn metavliti m , ws 'let m=..' h 'var m=..'
  for(i = 3; i < json.length; i++){ //variable : i , starts counting from 3 , because json[0]=general info, json[1]=chr info, region_info= regions info(utr,cds,exons...)
    m = new Mirna(json[i], new_length, i , alpha);
    mirnas.push(m);
    klop = m.draw_mirna();
    console.log('RESIZE  '+klop);

  }
}

function draw_the_gene(gene){
  //*******TODo :   with its transcripts(3) all of them

  //Draw the Whole gene as a line
  stroke('black');
  strokeWeight(1);
  line(40,140,1200,140);

  //with arrows describing its strand
  //arrows to the left
  if(gene.gene_strand == '-'){
    for(i=0;i<=57;i++){
      line(40 + 20*i , 140, 40 + 20*i + 4 , 137 );
      line(40 + 20*i , 140, 40 + 20*i + 4 , 143 );
    }
  }
  //arrows to the right
  else{
    for(i=1;i<=58;i++){
      line(40 + 20*i , 140, 40 + 20*i - 4 , 137 );
      line(40 + 20*i , 140, 40 + 20*i - 4 , 143 );
    }
  }

  //gene start , gene stop
  //fill('blue');
  noStroke();
  textSize(9);
  //text(gene.gene_name + ' (' + gene.gene_identifier + ' )',500,90);
  fill('black');
  text(gene.gene_start , 35 , 160);
  text(gene.gene_stop , 1160 , 160);

  //gene name, geneId,
  var name_gene = createP(gene.gene_name + ' (' + gene.gene_identifier + ' )');
  name_gene.style('text-align','center');
  name_gene.style('padding','35px');
  name_gene.style('font-size','13px');
}



function draw_the_chromosome(gene , bands){
  var chr_bands = bands;
  var chromo_len;
  var gene_location ;

  chromo_len = chr_bands[chr_bands.length-1].bp_stop  //length of chromosome not in iscn as first , but in bp

  //Draw the chromosome bands
  for(var i=0; i<chr_bands.length; i++){
    b = new cytoBand(chr_bands[i], chromo_len);
    b.draw_band();
  }

  //Draw the Chromosome-Name next to the chromosome
  var name_chr = createP("chr: " + gene.gene_chromosome+ ' ('+chr_bands[0].arm+chr_bands[0].band+'-'+chr_bands[chr_bands.length-1].arm+chr_bands[chr_bands.length-1].band+')');
  name_chr.style('text-align','center');
  name_chr.style('padding','35px');
  name_chr.style('font-size','13px');

  //name_chr.position()
  //fill('blue');
  //textSize(9);
  //text("chr: " + gene.gene_chromosome+ ' ('+chr_bands[0].arm+chr_bands[0].band+'-'+chr_bands[chr_bands.length-1].arm+chr_bands[chr_bands.length-1].band+')',600,20);

  // Draw the Gene as a line over the chromosome
  //toDO : scale, bps , length of gene like http://genome-euro.ucsc.edu/cgi-bin/hgTracks?db=hg38&lastVirtModeType=default&lastVirtModeExtraState=&virtModeType=default&virtMode=0&nonVirtPosition=&position=chr8%3A80628451%2D80874781&hgsid=228224761_ab1Ij5AZhEccKIgWVGY6yM6zHdVH
  gene_location = Math.round((gene.gene_start - chr_bands[0].bp_start ) / (chr_bands[chr_bands.length-1].bp_stop - chr_bands[0].bp_start) * (1200-40) + 40) ;
  stroke("red");
  strokeWeight(2);
  line(gene_location,34,gene_location,60);

  console.log("GENE INFO NOW");
  console.log(gene.gene_start);

  console.log(chr_bands[(chr_bands.length)-1].bp_stop);
  console.log(chr_bands[0].bp_start);
  console.log(gene_location);
}


class cytoBand{
  //constructor(stain, density, arm, band_start, band_stop){
  constructor(chr_bands , chromo_len){
    this.chromo_len = chromo_len  ;

    this.color_band = 'white';
    this.band = chr_bands.band;
    this.stain = chr_bands.stain;
    this.density = chr_bands.density;
    this.arm = chr_bands.arm;
    this.band_start = Math.round((chr_bands.bp_start / this.chromo_len) * (1200-40) + 40); //this is where each band starts
    this.band_stop = Math.round((chr_bands.bp_stop / this.chromo_len) * (1200-40) + 40);   //this is where each band stops
    this.middle_of_band =(this.band_stop+this.band_start)/2;
    this.band_width = this.band_stop - this.band_start;
  }

  //TOdO ***** delete_band(){}  for new search or delete the whole canvas and paint again from start??
  draw_band(){
    var chr_y = 40; //draw the chr in heigt 'chr_y' relative to canvas

    if(this.stain == 'gneg'){
      noStroke();
      fill(255);
      rect(this.band_start, chr_y, this.band_width, 14);
      this.color_band = 'black';
    }
    else if(this.stain == 'gpos'){
      if(this.density == 25){
        noStroke();
        fill('LightGray');
        rect(this.band_start, chr_y, this.band_width, 14);
      }
      else if(this.density == 50){
        noStroke();
        fill('DarkGray');
        rect(this.band_start, chr_y, this.band_width, 14);
      }
      else if(this.density == 75){
        noStroke();
        fill("DimGray");
        rect(this.band_start, chr_y, this.band_width, 14);
      }
      else if(this.density == 100){
        noStroke();
        fill(40);
        rect(this.band_start, chr_y, this.band_width, 14);

      }
    }
    else if(this.stain == 'acen'){
      if(this.arm == 'p'){
        noStroke();
        fill('#ff3333');
        //rect(this.band_start, 20, this.band_width, 14);
        triangle(this.band_start,(chr_y-1), this.band_start,(chr_y-1)+15, this.band_stop,(chr_y-1)+7);

        //chromosome contour 1 - before centromere
        stroke('black');
        line(this.band_start-1,(chr_y-1),40,(chr_y-1));
        line(40,(chr_y-1),40,(chr_y-1)+15);
        line(40,(chr_y-1)+15,this.band_start-1,(chr_y-1)+15);
      }
      else{
        noStroke();
        fill('#ff3333');
        triangle(this.band_stop,(chr_y-1), this.band_stop,(chr_y-1)+15, this.band_start,(chr_y-1)+7);
        //chromosome contour , write down the coordinates to paint later after the end of loop
        stroke('black');
        line(this.band_stop,(chr_y-1),1200,(chr_y-1));
        line(1200,(chr_y-1),1200,(chr_y-1)+15);
        line(1200,(chr_y-1)+15,this.band_stop,(chr_y-1)+15);
      }
    }
    else if(this.stain == 'gvar'){
      noStroke();
      fill('green');
      rect(this.band_start, chr_y, this.band_width, 14);
    }
    else if(this.stain == 'stalk'){
      noStroke();
      fill('orange');
      rect(this.band_start, chr_y, this.band_width, 14);
    }

    //arm and band text onto the bands
    if(this.band_width >= 32){
      textSize(8);
      noStroke();
      if(this.color_band == 'white'){
        fill(255);
      }
      else{
        fill(0);
      }
      text(this.arm+this.band, this.band_start+3, chr_y+10 );
    }
  }
}


class Mirna{
  constructor(mirna_info, new_length, y, alpha){
    // this.bind_type , num_species_conserved, score, chr
    this.begin = mirna_info.bind_start;
    this.end = mirna_info.bind_stop;
    this.new_length = new_length;
    this.mirna_name = mirna_info.mirna_name;
    this.alpha = alpha;
    //pop-up info
    this.mirna_sequence = mirna_info.mirna_conn__mirna_sequence;
    this.mirna_id = mirna_info.mirna_conn__mirna_id;
    this.bind_site = mirna_info.bind_site;

    this.y = 280+13*i; //upsos pou arxizoun kai emfanizontai ta miRNAS
    this.pressed = 0;
    this.span_info = this.mirna_name+'\n'+this.mirna_id+'\n'+this.bind_site;
    this.span_tooltip = createSpan(this.span_info); //this.span_toool...
  }
  draw_mirna(){
    console.log((parseInt(this.begin)) + '  -   '+ this.alpha);
    this.begin = ((parseInt(this.begin)-this.alpha ) / this.new_length)*(1200-40) +40 ;
    //this.end = this.begin + (parseInt(this.end)-parseInt(this.begin));
    console.log('start = '+ this.begin);
    //console.log('stop = '+ this.end);
    //line(Math.round(sta),(10+5*i), Math.round(sto),(10+5*i))

    stroke('red');
    strokeWeight(2);
    //line(Math.round(this.begin),(this.y) , Math.round(this.begin)+5,(this.y) );
    //rect(Math.round(this.begin),(this.y)-8 ,8,8);
    this.rect_div = createDiv('');
    //this.rect_div.addClass('tooltip');
    this.rect_div.style('width','8px');
    this.rect_div.style('height','8px');
    this.rect_div.style('background-color', 'red');
    this.rect_div.position(Math.round(this.begin)+canvas_x,(this.y)-8+canvas_y);

    //var koko = this.mirna_name;
    //this.rect_div.mouseOver(function()  {toolTip(koko)});

    this.rect_div.id('tooltip');
    this.span_tooltip.id('tooltiptext');
    (this.span_tooltip).parent(this.rect_div);


    //Display mirna names (maybe i can have a checkbox to hide them)
    fill('black');
    noStroke();
    textSize(8);
    text(this.mirna_name, Math.round(this.begin)+10, (this.y));

    return this.y;
  }



  //event handler edw mesa
  clicked(mx,my){

    //if( (my == this.y) && (mx <= (this.begin+5)) && (mx >= this.begin) ){
    if( (my <= this.y) && (my >= (this.y)-8) && (mx <= (this.begin+8)) && (mx >= this.begin) ){
      if(this.pressed==0){
        this.pressed = 1;
        console.log(this.begin);
        console.log(this.mirna_sequence);
        console.log(this.mirna_id);
      }
      else{
        this.pressed = 0;
        console.log(this.end);
      }
    }
  }

}

class Rect_region{//na vgalw chromosomata Patch
  constructor(start, stop, color,elaxisto, new_length){
    //declare alpha with the correct value
    //declare new_length with the correct value
    this.new_length = new_length;
    this.elaxisto = elaxisto;

    this.start = start;
    this.stop = stop;
    this.l;

    this.start = ( (this.start -this.elaxisto ) / (this.new_length) ) * (1200-40) +40 ;
    this.stop = ( (this.stop-this.elaxisto ) / (this.new_length) ) * (1200-40) +40 ;

    //vgalta apo ton constructor auta
    if(this.stop-this.start<1){
      this.l = '1px';
    }
    else{
      this.l = (this.stop-this.start).toString()+'px';
    }
    //console.log(this.l);
    console.log(this.start);

    this.color = color;
  }
  draw_region(){
    this.rect_div = createDiv('');
    this.rect_div.style('width',this.l);
    this.rect_div.style('height','7px');
    //console.log(this.start);
    //console.log(this.transcr_start);
    if(this.color == 'red'){
      //this.rect_div.addClass('tooltip');
      this.rect_div.style('background-color', 'red');
    }
    else if (this.color == 'green') {
      this.rect_div.style('background-color', 'green');
    }
    else{ //color: blue
      this.rect_div.style('background-color', 'blue');
    }
    this.rect_div.position(this.start+canvas_x, canvas_y+240-3);
    //this.rect_div.position(Math.round(this.begin)+canvas_x,(this.y)-8+canvas_y);
    //+canvas_x,(this.y)-8+canvas_y)
  }
}

/*function toolTip( param ) {
  console.log(param);
  var div_tooltip = createDiv('');
  div_tooltip.addClass('tooltip');
}*/


function draw(){
}
