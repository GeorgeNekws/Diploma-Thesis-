//import getChromosome from './chromosome';
var data_ready = 0;


$(function() {
  var container = $('#superman');
  var container2 = $('#statistics-paragraph');
  var selected_species = [];
  var selected_bind_types = [];
  var transcript_length;
  var transcr_start;
  var transcr_stop;

  console.log("Into JQUERY");
  //1. Submit post on submit
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

  //////////////////////////        GET CHECKBOX VALUES      //////////////////////////////////////////
  $("#input-button").click(function(){
    $('input[name="checkbox"]:checked').each(function() {   //for species checkboxes
      selected_species.push(this.value);
    });
    $('input[name="checkbox2"]:checked').each(function() {   //for bind type checkboxes
      selected_bind_types.push(this.value);
    });
  });

  // AJAX for posting
  function my_data_serialize(){
    console.log("create post is working!");
    console.log(typeof(selected_species));

    $.ajax({
      url: "http://127.0.0.1:8000/csv_app/my_data/",
      type: "POST",
      dataType: 'json',
      data: {
        the_species: selected_species ,
        the_bind_types: selected_bind_types,
        the_transcript: $('#post-text').val(), //data that i send to back-end , to 'create_post' view, see also the <form action ="create_post"
        the_score: $('#score-field').val(),
        the_site: $('#site-field').val(),
        the_num_of_conserved: $('#conserved-species-field').val(),
      },

      //handle a successful Response
      success: function(json){  //the data that are coming back are in the arg 'json'  -->[{}, [{},{},{}...], {},{},{}]
        //$('#post-text').val('');  //empty the form data , for a possible new search
        selected_species = [];    //empty the checkbox LIST for a new search
        selected_bind_types = [];
        console.log(json[0]);
        console.log("success");
        console.log('JSON LENGTH : ' + json.length);

        //Variables Declaration
        var sta;
        var sto;
        var megisto=0;
        var elaxisto = 100000;
        //Statistic variables declaration
        var res_mirnas_name_list = [];
        var res_chr_mirnas_list = [];
        var res_bind_types_list = [];
        var res_bind_site_list = [];
        var res_conserved_species_list = [];
        var res_avg_bind_len;
        var res_max_bind_len = 0;
        var res_min_bind_len = 1000;

        var dist;
        var all_distances = 0;
        var array;
        var dict = {};
        var dict_bind_site = {};
        var dict_bind_type = {};
        var new_species_list = [];
        var unique_bind_types_list = [];
        //End of Statistic variables declaration

        transcr_start = json[0].transcript_start;
        transcr_stop = json[0].transcript_stop;
        transcript_length = transcr_stop - transcr_start;
        console.log('Transcript length = ' + transcript_length);

        if (json.length > 2){
          console.log("BIGGER THAN 1");
        }
        else{
          console.log("SMALLER THAN 1");
        }

        for(i = 2; i < json.length; i++) {

          //1. find how many different microRNAs bind to the given transcript ,store the names to a list-array
          // and also the chromosome
          if( res_mirnas_name_list.indexOf(json[i].mirna_name) == -1 ){
            console.log("MMMMMMMMMMMMMMM");
            console.log(json[i].mirna_name);
            res_mirnas_name_list.push(json[i].mirna_name);
            res_chr_mirnas_list.push(json[i].chromosome);
          }

          //2. find which species exist in this Interaction
          // in res_conserved_species_list , exist all the enrolls of species with duplicates
          //i show to the user all the different species that participate to his search and their frequency.
          array = json[i].species.split(',');   //example : json[i].species =  panTro2,rheMac2,monDom5
          for(j=0; j<array.length; j++){
            res_conserved_species_list.push(array[j]);
          }

          //3. find how many results are bound in UTR3 and how many in CDS
          res_bind_site_list.push(json[i].bind_site);

          //4.find all the bind types of this interaction
          res_bind_types_list.push(json[i].bind_type);

          //5. find the min,max,avg bind length to the given transcript
          dist = json[i].relative_bind_stop - json[i].relative_bind_start;
          if(dist < res_min_bind_len){
            res_min_bind_len = dist;
          }
          if(dist > res_max_bind_len){
            res_max_bind_len = dist;
          }
          all_distances = all_distances + dist;

          //6. --TO DO-- number of total results (mirnas bound to the given transcript)

          if(parseInt(json[i].relative_bind_stop) > megisto){
            megisto = parseInt(json[i].relative_bind_stop);
          }
          if(parseInt(json[i].relative_bind_start) < elaxisto){
            elaxisto = parseInt(json[i].relative_bind_start);
          }
        }

//1.    ////////////////////// microRNAs NAMES   ///////////////////////////////////////
        console.log(res_mirnas_name_list.length + " diaforetika microRNAs kanoun bind");

/////////////////////////   SPECIES //////////////////////////////////////////////
//2. in new_species_list exist the species of the interaction only 1 time
        for(j=0; j<res_conserved_species_list.length; j++){
          if( new_species_list.indexOf(res_conserved_species_list[j]) == -1 ){
            new_species_list.push(res_conserved_species_list[j]);
          }
        }
        //2. find the frequency of the species for this transcript
        //final result will be smth like:
        // dict = {panTro2 : 10 , loxAfr3 : 23 , .....}
        for(j=0; j<new_species_list.length; j++){
          dict[new_species_list[j]] = 0;
          for(k=0; k<res_conserved_species_list.length; k++){
            if(res_conserved_species_list[k] == new_species_list[j]){
              dict[new_species_list[j]] = dict[new_species_list[j]] + 1;
            }
          }
        }

        console.log("Number of different species that are conserved for the given transcript "+ new_species_list.length);
        for(var index in dict) {
          console.log( index + " : " + dict[index] + "\n");
        }

/////////////////////////   BIND SITE //////////////////////////////////////////////
//3. find the frequency of UTR3 and CDS
        dict_bind_site["CDS"] = 0;
        dict_bind_site["UTR3"] = 0;
        for(j=0; j<res_bind_site_list.length; j++){
          if(res_bind_site_list[j] == "CDS"){
            dict_bind_site["CDS"] = dict_bind_site["CDS"] + 1;
          }
          else{
            dict_bind_site["UTR3"] = dict_bind_site["UTR3"] + 1;
          }
        }
        for(var index in dict_bind_site) {
          console.log( index + " : " + dict_bind_site[index] + "\n");
          console.log("Probability to bind to " + index + " is :" + (dict_bind_site[index])/(json.length-2) + "\n");
        }


//////////////////////////   BIND TYPE //////////////////////////////////////////////
//4. find the frequency of Bind Types
        //res_bind_types_list = [6mer, 6mer, 7mer, 8mer, 7mer]
        //unique_bind_types_list = [6mer,7mer,8mer]
        for(j=0; j<res_bind_types_list.length; j++){
          if( unique_bind_types_list.indexOf(res_bind_types_list[j]) == -1 ){
            unique_bind_types_list.push(res_bind_types_list[j]);
          }
        }
        for(j=0; j<unique_bind_types_list.length; j++){
          dict_bind_type[unique_bind_types_list[j]] = 0;
          for(k=0; k<res_bind_types_list.length; k++){
            if(res_bind_types_list[k] == unique_bind_types_list[j]){
              dict_bind_type[unique_bind_types_list[j]] = dict_bind_type[unique_bind_types_list[j]] + 1;
            }
          }
        }
        for(var index in dict_bind_type) {
          console.log( index + " : " + dict_bind_type[index] + "\n");
        }

 //5. MIN , MAX , AVG bind lengths
        console.log('min bind length : ' + res_min_bind_len);
        console.log('max bind length : ' + res_max_bind_len);
        res_avg_bind_len = all_distances / (json.length - 2);
        console.log('avg bind length : ' + res_avg_bind_len);

        // add arbitrary number = 600 to new_length , in order to show in thw screen the mirna name
        var new_length = megisto - elaxisto + 600 ;
        //console.log(megisto);
        //console.log(elaxisto);
        console.log('megisto = ' + megisto);
        console.log('elaxisto = ' + elaxisto);
        console.log('New length = '+new_length);


        // Get the modal
        var modal = document.getElementById('myModal');
        // Fill the modal-body with the statistics
        $('#modal-bd').append('- Number of microRNAs participating to the interaction : ' +'<b>'+ (json.length-2) +'</b>' + '<p></p>');
        $('#modal-bd').append('- Distinct number of microRNAs participating to the interaction : ' +'<b>'+ res_mirnas_name_list.length +'</b>' + '<p></p>');
        $('#modal-bd').append('- Minimum bind length : ' +'<b>'+ res_min_bind_len +'</b>' + '<p></p>');
        $('#modal-bd').append('- Maximum bind length : ' +'<b>'+ res_max_bind_len +'</b>' + '<p></p>');
        $('#modal-bd').append('- Average bind length : ' +'<b>'+ res_avg_bind_len +'</b>' + '<p></p>');
        for(var index in dict_bind_site) {
          //$('#modal-bd').append(index + " : " + dict_bind_site[index] + '<p></p>');
          $('#modal-bd').append("- Probability to bind to " + index + " is : " + '<b>'+(dict_bind_site[index])/(json.length-2) +'</b>' +
        '<b> (' +dict_bind_site[index] + '/' + (json.length-2) + ')</b> <p></p>');
        }
        $('#modal-bd').append("- Number of different species that are conserved for the given transcript "+'<b>'+ new_species_list.length +'</b>' + '<p></p>');
        var dict_length = Object.keys(dict).length;;
        var lo=0;
        console.log(dict_length);
        for(var index in dict) {
          lo = lo +1;
          if(lo==dict_length){
            $('#modal-bd').append(index + " : " + '<b>'+ dict[index] +' </b>' );
          }
          else{
            $('#modal-bd').append(index + " : " + '<b>'+ dict[index] +' </b>' +', ' );
          }

        }

        $('#statistics_button').on('click', function(){
          $("#myModal").css("display", "block");

          //modal.style.display = "block";
        });
        $('#close-bt2 , #modal-close-bt').on('click', function(){
            modal.style.display = "none";
        });
        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }








        //Draw all the mirnas



        $.each(json,function(index, item){  // [ {}, {}, {}, ...]
          $.each(item, function(key,value){
            container.append(key + ": " + value + '</br>'); //either this way i reference to   <div class="container">

          });
          container.append('<br/></br>'); // or this way ,via the var 'container' that i declare on top
        });




        //............. CHROMOSOME STUFF.................//
        //toDO : chromosome bands , chromosome bps
        container.append('CHROMOSOMES BOYYYYYYYYYYYYYYYYYYYYYYY');




        $.each(json[1],function(index, item){  // [ {}, {}, {}, ...]
          $.each(item, function(key,value){
            //console.log(item['bp_start']);
            container.append(key + ": " + value + '</br>'); //either this way i reference to   <div class="container">
          });
          container.append('<br/></br>'); // or this way ,via the var 'container' that i declare on top
        });


        data_ready = 1;
        //Draw the chromosome and the gene that the given transcript belongs to
        draw_the_chromosome(json[0], json[1]);
        draw_the_gene(json[0]);


        //Draw the given by user Transcript as a line
        //*********TODo transcript name also
        fill('blue');
        noStroke();
        textSize(9);
        text($('#post-text').val(),450,200);

        fill('black');
        text(json[0].transcript_start,5,210);
        text(json[0].transcript_stop,980,210);

        stroke('black');
        strokeWeight(1);
        line(20,220,1000,220);
        line(20,217,20,223);
        line(1000,217,1000,223);

        //Draw all the related microRNAs
        draw_the_miRNAs(json,new_length);

      },

      //handle a non-successful Response
      error : function(xhr,errmsg,err) {
        $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
        " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
        console.log("FAILURE");
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



function setup() {
  var canvas = createCanvas(1100,1000);
  canvas.position(230,600);
  console.log(windowWidth);
  background(220);
  //noLoop();
  clear();
  //var button = select("#my-button") ;
  //var button = createButton('click me');
  //button.parent(select('.col-md-3'));
  //button.mousePressed(getJson)
}


function draw_the_miRNAs(json,new_length){
  var begin;
  var end;
  for(i = 2; i < json.length; i++) {
      //console.log(json[i].score);
      //container.append();
      //sta = (1100/new_length)*parseInt(json[i].relative_bind_start);
      //sto = (1100/new_length)*parseInt(json[i].relative_bind_stop);
      // Υ = (Χ-Α)/(Β-Α) * (D-C) + C
      begin = ((parseInt(json[i].relative_bind_start)-0 ) / new_length)*(1000-10) +10 ;
      end = begin + (parseInt(json[i].relative_bind_stop)-parseInt(json[i].relative_bind_start));

      //console.log('relative start = ' + json[i].relative_bind_start);
      //console.log('relative stop = ' + json[i].relative_bind_stop);
      console.log('start = '+ begin);
      console.log('stop = '+ end);
      //line(Math.round(sta),(10+5*i), Math.round(sto),(10+5*i))

      stroke('red');
      strokeWeight(2);
      line(Math.round(begin),(245+13*i) , Math.round(begin)+5,(245+13*i) );

      fill('black');
      noStroke();
      textSize(8);
      text(json[i].mirna_name, Math.round(begin)+10, (245+13*i));
    }
}

function draw_the_gene(gene){
  //*******TODo :   with its transcripts(3) all of them

  //Draw the Whole gene as a line
  stroke('black');
  strokeWeight(1);
  line(100,110,700,110);

  //with arrows describing its strand
  //arrows to the left
  if(gene.gene_strand == '-'){
    for(i=0;i<=29;i++){
      line(100 + 20*i , 110, 100 + 20*i + 4 , 107 );
      line(100 + 20*i , 110, 100 + 20*i + 4 , 113 );
    }
  }
  //arrows to the right
  else{
    for(i=1;i<=3;i++){
      line(700*i,110, 700*i - 5 , 105 );
      line(700*i,110, 700*i - 5 , 115 );
    }
  }

  //gene name , geneId, gene start , gene stop
  fill('blue');
  noStroke();
  textSize(9);
  text(gene.gene_name + ' (' + gene.gene_identifier + ' )',750,113);
  fill('black');
  text(gene.gene_start , 90 , 125);
  text(gene.gene_stop , 680 , 125);
}



function draw_the_chromosome(gene , bands){
  console.log("into CALL_READY");
  var chr_bands = bands;
  var chromo_len;
  var gene_location ;

  chromo_len = chr_bands[chr_bands.length-1].bp_stop  //length of chromosome not in iscn as first , but in bp

  //Draw the chromosome bands
  for(var i=0; i<chr_bands.length; i++){
    b = new cytoBand(chr_bands[i], chromo_len);
    b.draw_band();
  }

  //Draw the chromosome name next to the chromosome
  fill('blue');
  textSize(9);
  text("chr: " + gene.gene_chromosome+ ' ('+chr_bands[0].arm+chr_bands[0].band+'-'+chr_bands[chr_bands.length-1].arm+chr_bands[chr_bands.length-1].band+')',1006,30);

  // Draw the Gene as a line over the chromosome
  //toDO : scale, bps , length of gene like http://genome-euro.ucsc.edu/cgi-bin/hgTracks?db=hg38&lastVirtModeType=default&lastVirtModeExtraState=&virtModeType=default&virtMode=0&nonVirtPosition=&position=chr8%3A80628451%2D80874781&hgsid=228224761_ab1Ij5AZhEccKIgWVGY6yM6zHdVH
  gene_location = Math.round((gene.gene_start - chr_bands[0].bp_start ) / (chr_bands[chr_bands.length-1].bp_stop - chr_bands[0].bp_start) * (1000-5) + 5) ;
  stroke("red");
  strokeWeight(2);
  line(gene_location,14,gene_location,40);

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
    this.band_start = Math.round((chr_bands.bp_start / this.chromo_len) * (1000-5) + 5); //this is where each band starts
    this.band_stop = Math.round((chr_bands.bp_stop / this.chromo_len) * (1000-5) + 5);   //this is where each band stops
    this.middle_of_band =(this.band_stop+this.band_start)/2;
    this.band_width = this.band_stop - this.band_start;
  }

  draw_band(){
    if(this.stain == 'gneg'){
      noStroke();
      fill(255);
      rect(this.band_start, 20, this.band_width, 14);
      this.color_band = 'black';
    }
    else if(this.stain == 'gpos'){
      if(this.density == 25){
        noStroke();
        fill('LightGray');
        rect(this.band_start, 20, this.band_width, 14);
      }
      else if(this.density == 50){
        noStroke();
        fill('DarkGray');
        rect(this.band_start, 20, this.band_width, 14);
      }
      else if(this.density == 75){
        noStroke();
        fill("DimGray");
        rect(this.band_start, 20, this.band_width, 14);
      }
      else if(this.density == 100){
        noStroke();
        fill(40);
        rect(this.band_start, 20, this.band_width, 14);

      }
    }
    else if(this.stain == 'acen'){
      if(this.arm == 'p'){
        noStroke();
        fill('#ff3333');
        //rect(this.band_start, 20, this.band_width, 14);
        triangle(this.band_start,19, this.band_start,19+15, this.band_stop,19+7);

        //chromosome contour 1 - before centromere
        stroke('black');
        line(this.band_start-1,19,5,19);
        line(5,19,5,19+15);
        line(5,19+15,this.band_start-1,19+15);
      }
      else{
        noStroke();
        fill('#ff3333');
        triangle(this.band_stop,19, this.band_stop,19+15, this.band_start,19+7);
        //chromosome contour , write down the coordinates to paint later after the end of loop
        stroke('black');
        line(this.band_stop,19,1000,19);
        line(1000,19,1000,19+15);
        line(1000,19+15,this.band_stop,19+15);
      }
    }
    else if(this.stain == 'gvar'){
      noStroke();
      fill('green');
      rect(this.band_start, 20, this.band_width, 14);
    }
    else if(this.stain == 'stalk'){
      noStroke();
      fill('orange');
      rect(this.band_start, 20, this.band_width, 14);
    }

    //arm and band text onto the bands
    if(this.band_width >= 29){
      textSize(8);
      noStroke();
      if(this.color_band == 'white'){
        fill(255);
      }
      else{
        fill(0);
      }
      text(this.arm+this.band, this.band_start+3, 30 );
    }
  }

  /*click_band(px, py){
    if(px<this.band_stop && px>this.band_start && py>20 && py<20+14){
      if(this.clicked == false){
        textSize(8);
        noStroke();
        fill(0);
        text(this.arm+this.band, this.middle_of_band-7, 13 );
        this.clicked = true;
      }
      else{
        noStroke();
        fill(255);
        rect(this.middle_of_band-7, 6 , 18, 13);
        this.clicked = false;
      }
    }
  }*/

}

/*function mousePressed() {
  for (let i = 0; i < bands.length; i++) {
    bands[i].click_band(mouseX, mouseY);
  }
}*/

function draw(){
}
