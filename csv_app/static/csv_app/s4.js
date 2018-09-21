//js file related to index2.html file
// douleuei kanonika apla 8elw na kanw kati allages
//oson afora sto pws fainontai ta mirnas stin o8oni , 8a ta deixnw ola to idio mege8os,ane3artita apo to mikos tous
// episis 8a kanw visualize kai to chromosome twra apo to json[1] opou uparxoun oi plirofories tou
//koita to s5.js

$(function() {

  var container = $('#superman');
  var container2 = $('#statistics-paragraph');
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");
  var selected_species = [];
  var selected_bind_types = [];
  var transcript_length;
  var transcr_start;
  var transcr_stop;

    //1. Submit post on submit
    $('#post-form').on('submit', function(event){
        event.preventDefault();
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

    //2. Exon Button , to make visible exon locations on transcript
    var clicked2 = 0;
    $('#exon_button').on('click', function(event){
      event.preventDefault();
      console.log("Exon Button Pressed!");
      if(clicked2 == 1) {
        clicked2 = 0;
        ctx.clearRect(10, 5, 1000, 8);
      }
      else{
        clicked2 = 1;
        my_exon_function();
      }
    });
    //3. UTR Button , to make visible exon locations on transcript
    // mporw na kanw mia veltistopoisi : otan o xristis zitaei 2h fora na dei ta utr regions , na mhn 3anakanw server request, alla na ta exw apothikeusi kapou topika kai apla na ta emfanizw
    var clicked = 0;
    $('#utr_button').on('click', function(event){
      event.preventDefault();
      console.log("UTR Button Pressed!");
      if(clicked == 1) {
        clicked = 0;
        ctx.clearRect(10, 10, 1000, 13);
      }
      else{           //1st time i request to see the UTR regions , i click the button (clicked==1) and i have a server request
        clicked = 1;
        my_utr_function();
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

      alert("Number of selected Species: "+selected_species.length+"\n"+"And, they are: "+selected_species);
      alert("Number of selected Bind Types: "+selected_bind_types.length+"\n"+"And, they are: "+selected_bind_types);
    });
    ///////////////////////////////////////////////////////////////////////////////////////////////////////

    function my_exon_function(){
      console.log("EXON FUNCTION IS CALLED !");

      $.ajax({
        url: "http://127.0.0.1:8000/csv_app/get_exons/",
        type: "POST",
        dataType: 'json',
        data: {
          the_transcript: $('#post-text').val(), //data that i send to back-end , to 'create_post' view, see also the <form action ="create_post"
        },
        //handle a successful Response
        success: function(json){  //the data that are coming back are in the arg 'json'

        var begin;
        var end;
        for(i = 0; i < json.length; i++) {
          console.log("begin = " + json[i].start);
          console.log("end = " + json[i].stop);
          begin = ((parseInt(json[i].start)-transcr_start ) / transcript_length)*(1000-10) +10 ;
          end = ((parseInt(json[i].stop)-transcr_start ) / transcript_length)*(1000-10) +10 ;
          console.log("begin = " + Math.floor(begin));
          console.log("end = " + Math.ceil(end));
          ctx.beginPath();
          ctx.moveTo(Math.floor(begin) , 8);
          ctx.lineTo(Math.ceil(end) , 8);
          ctx.strokeStyle="#000000";
          ctx.lineWidth=3;
          ctx.stroke();

        }

          $.each(json,function(index, item){  // [ {}, {}, {}, ...]
            $.each(item, function(key,value){
              container.append(key + ": " + value + '</br>'); //either this way i reference to   <div class="container">
            });
            container.append('<br/></br>'); // or this way ,via the var 'container' that i declare on top
          });
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

    function my_utr_function(){
      console.log("UTR FUNCTION IS CALLED !");

      $.ajax({
        url: "http://127.0.0.1:8000/csv_app/get_utrs/",
        type: "POST",
        dataType: 'json',
        data: {
          the_transcript: $('#post-text').val(), //data that i send to back-end , to 'create_post' view, see also the <form action ="create_post"
        },
        //handle a successful Response
        success: function(json){  //the data that are coming back are in the arg 'json'

          var begin;
          var end;
          for(i = 0; i < json.length; i++) {
            console.log("begin = " + json[i].start);
            console.log("end = " + json[i].stop);
            begin = ((parseInt(json[i].start)-transcr_start ) / transcript_length)*(1000-10) +10 ;
            end = ((parseInt(json[i].stop)-transcr_start ) / transcript_length)*(1000-10) +10 ;
            console.log("begin = " + Math.floor(begin));
            console.log("end = " + Math.ceil(end));
            ctx.beginPath();
            ctx.moveTo(Math.floor(begin) , 13);
            ctx.lineTo(Math.ceil(end) , 13);
            ctx.strokeStyle="blue";
            ctx.lineWidth=3;
            ctx.stroke();

          }

          $.each(json,function(index, item){  // [ {}, {}, {}, ...]
            $.each(item, function(key,value){
              container.append(key + ": " + value + '</br>'); //either this way i reference to   <div class="container">
            });
            container.append('<br/></br>'); // or this way ,via the var 'container' that i declare on top
          });
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



          //Event Listener for Statistics button
          /*var clicked = 0;
          $('#statistics_button').on('click', function(event){
            event.preventDefault();
            console.log("Statistics Button Pressed!");
            if(clicked == 1) {
              clicked = 0;
              container2.detach()
            }
            else{
              clicked = 1;
              container2.append('Min bind length : ' + res_min_bind_len + '<br></br>');
              container2.append('Max bind length : ' + res_max_bind_len + '<br></br>');
            }
          });*/

          // Draw the whole transcript as a line on the screen
          ctx.beginPath();
          ctx.moveTo(10 , 3);
          ctx.lineTo(1000 , 3);
          ctx.strokeStyle="yellow";
          ctx.lineWidth=3;
          ctx.stroke();

          // Draw the zoomed transcript area as a line on the screen
          ctx.beginPath();
          ctx.moveTo(10 , 40);
          ctx.lineTo(1100 , 40);
          ctx.strokeStyle="#000000";
          ctx.lineWidth=1;
          ctx.stroke();


          for(i = 2; i < json.length; i++) {
              //console.log(json[i].score);
              container.append();
              //sta = (1100/new_length)*parseInt(json[i].relative_bind_start);
              //sto = (1100/new_length)*parseInt(json[i].relative_bind_stop);

              // Υ = (Χ-Α)/(Β-Α) * (D-C) + C
              sta = ((parseInt(json[i].relative_bind_start)-0 ) / new_length)*(1000-10) +10 ;
              sto = sta + (parseInt(json[i].relative_bind_stop)-parseInt(json[i].relative_bind_start));

              //console.log('relative start = ' + json[i].relative_bind_start);
              //console.log('relative stop = ' + json[i].relative_bind_stop);
              console.log('start = '+ sta);
              console.log('stop = '+ sto);
              //line(Math.round(sta),(10+5*i), Math.round(sto),(10+5*i))


              ctx.moveTo(Math.round(sta),(45+13*i));
              ctx.lineTo(Math.round(sto),(45+13*i));
              ctx.strokeStyle="#FF0000";
              ctx.stroke();
              ctx.font = "11px Arial";
              ctx.fillText(json[i].mirna_name,Math.round(sto)+3,(45+13*i));

            }

          $.each(json,function(index, item){  // [ {}, {}, {}, ...]
            $.each(item, function(key,value){
              container.append(key + ": " + value + '</br>'); //either this way i reference to   <div class="container">

            });
            container.append('<br/></br>'); // or this way ,via the var 'container' that i declare on top
          });
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
