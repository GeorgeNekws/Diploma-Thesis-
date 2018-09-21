
$(function() {
  var container = $('.superman');
  var selected_species = [];
  var selected_bind_types = [];
  var transcript_length;
  var fora = 0;
  var $table , $n , $rowCount , $firstRow , $hasHead , $tr , $i, $ii, $j , $th , $pageCount;
  var global_mirna = '';
  var global_transcript = '';
  //var time = 0; //periptwsi pou o xristis dinei mirna kai meta allazei ta filtra

  /********************************************************/
  //While ajax is loading , show the 'loading avatar'
  $(document).ajaxStart(function(){
      $("#wait").css("display", "block");
  });
  $(document).ajaxComplete(function(){
      w3_close();
      $("#wait").css("display", "none");
  });
  /********************************************************/

  /************   GET CHECKBOX VALUES    **************/
  $("#input-button2").click(function(){
    $('input[name="checkbox"]:checked').each(function() {   //for species checkboxes
      selected_species.push(this.value);
    });
    $('input[name="checkbox2"]:checked').each(function() {   //for bind type checkboxes
      selected_bind_types.push(this.value);
    });
  });
  /********************************************************/


  /**********************************************************************************************************/
  //This is an EVENT
  //AYTO TO EVENT KAI TO INITIAL-FORM EVENT MPORW NA TA ENWSW KAI NA TA KANW ENA
  $('#post-form').on('submit', function(event){
      event.preventDefault();
      //if (document.getElementById("mySidebar").style.display != "none"){
        //document.getElementById("mySidebar").style.display = "none";
        //document.getElementById("myOverlay").style.display = "none";
      //}
      var search_filter_input = $('#post-text').val() ;

      console.log("form submitted2!");  // sanity check

      if($('#post-text').val() == ''){  // IF the "transcript id" form field is not completed , ...
        selected_species = [];    //empty the checkbox LIST for a new search
        selected_bind_types = [];
        alert("PLEASE INSERT A TRANSCRIPT ID");
      }
      else{
        //$(".my-hidden-btns").css("visibility", "visible");
        //$("#h2-result").css("visibility", "visible");
        if(fora!=0){
          $('.removeComponents').remove();  //remove mirnas , regions , chr , names etc to show the new ones
          //resetSketch();  //auti i entoli den xreiazetai dioti mesa sti function ask_for_transcript_data , exw thn function canvas_position pou dimiourgei ka8e fora neo canvas, episis gia mirna, gene exw noCanva
        }
        if(search_filter_input.includes('ENST')){
          ask_for_transcript_data(search_filter_input, 'transcript',0 ,global_mirna); //we call the function create_post() , which is declared below
        }
        else if( (search_filter_input.includes('hsa')) || (search_filter_input.includes('let')) || (search_filter_input.includes('mimat'))){
          //an o xristis eixe dwsei mirna prin kai auto einai idio me auto pou uprxei sto input box(post-text), tote mallon allazei filtra ,opote kalese ask_for_transcript_data
          //kai oxi adeia filtra. an ta filtra einai adeia kai exw to idio microRNA me prin , tote emfanizw pali tous pi8anous transcript me tous opoious allilepidra to microRNA (else )
          if(global_mirna==search_filter_input && ($('#score-field').val()!='' || $('#conserved-species-field').val()!='' || $('#site-field').val()!='' || selected_species.length !=0 || selected_bind_types.length!=0)){

            ask_for_transcript_data(global_transcript, 'transcript',1 ,global_mirna)
          }
          else{
            noCanvas();
            global_mirna = '';  //midenizw tin timi tou global_mirna efoson o xristis psaxnei gia diaforetiko mirna apo prin
            //time = 0;
            show_transcripts_for_mirnas(search_filter_input, 'mirna');
          }
        }
        else{ //GENE OCCASION
        //else if(search_filter_input.includes('ENSG')){
          global_mirna = '';
          noCanvas();
          show_candidate_transcripts(search_filter_input, 'gene');
        }

      }
  });
  /**********************************************************************************************************/

  function handleAjaxError(xhr, status, error) {
      //Handle failure here
      alert('No records found! Please try another input.');
  }

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
    fora = 1;
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
        document.getElementById("post-text").defaultValue = user_input ;  //Put the user input value to the filter search box
        show_candidate_transcripts(user_input,user_data_type);                  //call the function that makes the AJAX request
      }
      else if($('#post-transcript').val() != ''){
        user_input = $('#post-transcript').val();
        user_data_type = 'transcript';
        document.getElementById("post-text").defaultValue = user_input ;  //Put the user input value to the filter search box
        ask_for_transcript_data(user_input,user_data_type,0,'');                  //call the function that makes the AJAX request
      }
      else if($('#post-mirna').val() != ''){
        user_input = $('#post-mirna').val();
        user_data_type = 'mirna';
        document.getElementById("post-text").defaultValue = user_input ;  //Put the user input value to the filter search box
        show_transcripts_for_mirnas(user_input,user_data_type);
      }
      //document.getElementById("post-text").defaultValue = user_input ;  //Put the user input value to the filter search box
      //ask_for_transcript_data(user_input,user_data_type);                  //call the function that makes the AJAX request
    }
  });
  /**********************************************************************************************************/


  /**********************************************************************************************************/
  function ask_for_transcript_data(user_input,user_data_type,mir_bool,mirna){

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
        mir_bool : mir_bool,  //case 3 given mirna
        mirna : mirna,        //case 3 given mirna
      },

      //handle a successful Response
      success: function(json){  //the data that are coming back are in the arg 'json'  -->[{}, [{},{},{}...], {},{},{}]
        //$('#post-text').val('');  //empty the form data , for a possible new search

        //Handle server response here
       if (json == 'No records found'){
           handleAjaxError();
           return;
       }

        selected_bind_types = []; //clear the check list concerning the bind types

        console.log(json[0]);
        console.log("success in initial ask for data");
        console.log('JSON LENGTH : ' + json.length);
        console.log(json);

        //***********************/
        document.getElementById("filter_button").disabled = false; // enable filter button
        document.getElementById("stats_button").disabled = false;


        //document.getElementById("statistics-tab").setAttribute("href", "/csv_app/help"); //enable Statistic Tab Link
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

        var elax2 = json[0].el2;  //these 2 are for drawing all the utr,cds regions and not only the binding ones
        var new_len2 = json[0].nl2;

        var elaxisto3 = json[0].elaxisto3;
        var new_length3 = json[0].new_length3;
        //allazw se new_length2 : sto draw_the_miRNAs() kai sta: new Rect_region=()

        //Draw the chromosome and the gene that the given transcript belongs to
        canvas_position();

        //check for mirnas , transcript , if is returned null from the server

        draw_the_chromosome(json[0], json[1]);
        draw_the_gene(json[0]);

        draw_the_transcript(json[0], user_input);

        if(json[2]!=null){
          draw_the_transcipt_regions(json[2],elaxisto3,new_length3);
          draw_all_the_transcipt_regions(json[4], elax2, new_len2);
        }
        else{
          alert("Sorry , this transcript is not available.")
        }

        //Draw all the related microRNAs
        draw_the_miRNAs(json,new_length3,elaxisto3);
        console.log("finish");


        /**************  Statistic Button Event  ****************/
        $("#stats_button").click(function(){
          $('#modal1').empty();
          show_statistics(json.length-6 , json[5]);     //json.length - 6 is the length of mirnas returned (-6 because json contains other info in the first 5 indexes)
          $("#myModal").css("display", "block");
        });
        /********************************************************/

        //draw_the_transcipt_regions(json[2],elaxisto2,new_length2);
      },

      //in case AJAX is NOT successful
      error : handleAjaxError 
      // error : function(xhr,errmsg,err) {
      //   $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
      //   " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
      //   console.log("FAILURE");
      //   console.log(xhr.status + ": " + xhr.responseText);
      // }
    });
  };


  //se auth thn periptwsi ta filtra prepei na einai apenergopoiimena
  function show_candidate_transcripts(user_input,user_data_type){
    $.ajax({
      url: "http://127.0.0.1:8000/csv_app/data_search/",
      type: "POST",
      dataType: 'json',
      data: {
        user_data: user_input ,
        user_data_type: user_data_type,
      },
      success: function(json){
        console.log('Gene Input Given');

        //Handle server response here
       if (json == 'No records found'){
           handleAjaxError();
           return;
       }

        //***********************/
        document.getElementById("filter_button").disabled = true; // disable filter button
        document.getElementById("stats_button").disabled = true;
        //clear superman - div content
        $('.superman').empty();     //PROSOXI AYTO SVINEI OLA TA CLASSES KAI IDS POU EXW DWSEI STA ELEMENTS MOU , ISWS EINAI KALYTERA NA MHN TO XRISIMOPOISW KAI NA KANW LOAD MIA ALLI HTML SELIDA
        container.css("padding-left", "20px");
        container.append('<br/></br>');
        //container.append('<h4>Candidate Transcripts for '+user_input+' Gene</h4>');
        // if(user_data_type == 'mirna'){
        //   container.append('<h4>Mirna x interacts with the following trAnscripts <h4>');
        // }

        container.append('<h4>Choose a relative <b>transcript</b><h4>');
        container.append('<br/></br>');

        var container_id = document.getElementById('superman-id');

        $("#superman-id").css("width", "320");
        $("#superman-id").css("margin", "auto");

        var table = document.createElement('table');
        table.setAttribute("class", "myTable");
        table.setAttribute("width", "50%");
        table.setAttribute("border-collapse", "collapse");
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        var td2 = document.createElement('td');
        var txt1 = document.createTextNode("Transcript ID");
        var txt2 = document.createTextNode("Transcript Name");
        td.setAttribute("class", "myTd myTableHeader");
        td2.setAttribute("class", "myTd myTableHeader");
        tr.setAttribute("class", "myTr");


        td.appendChild(txt1);
        td2.appendChild(txt2);
        tr.appendChild(td);
        tr.appendChild(td2);
        table.appendChild(tr);

        $.each(json,function(index, item){  // [ {}, {}, {}, ...]
          tr = document.createElement('tr');
          td = document.createElement('td');
          td2 = document.createElement('td');
          txt1 = document.createTextNode(item.transcript_id);
    	    txt2 = document.createTextNode(item.transcript_name);
          td.setAttribute("class", "myTd myTranscID");
          td2.setAttribute("class", "myTd");
          tr.setAttribute("class", "myTr");
          tr.setAttribute("class", "myRows");

          td.appendChild(txt1);
          td2.appendChild(txt2);
          tr.appendChild(td);
          tr.appendChild(td2);
          table.appendChild(tr);
        });
        container_id.appendChild(table);
        //container.append(tb);
        /***********************/
        $(".myTranscID").css("cursor", "pointer");

        $('.myTranscID').click(function(e) {
          var txt_transcr = $(e.target).text();
          console.log(txt_transcr);
          console.log(txt_transcr.length);
          $('#post-text:text').val(txt_transcr);  //set transcript id to search box if first gene is selected
          $('.superman').empty();
          ask_for_transcript_data(txt_transcr, 'transcript',0,'');
        });
      },

      //in case AJAX is NOT successful
      error: handleAjaxError
      // error : function(xhr,errmsg,err) {
      //   $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
      //   " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
      //   console.log("FAILURE");
      //   console.log(xhr.status + ": " + xhr.responseText);
      // }
    });
  };



  function show_transcripts_for_mirnas(user_input,user_data_type){
    $.ajax({
      url: "http://127.0.0.1:8000/csv_app/data_search/",
      type: "POST",
      dataType: 'json',
      data: {
        user_data: user_input ,
        user_data_type: user_data_type,
//na ta kanw handle sto views.py
        the_score: $('#score-field').val(),
        the_site: $('#site-field').val(),
        the_num_of_conserved: $('#conserved-species-field').val(),
        the_species: selected_species ,
        the_bind_types: selected_bind_types,

      },
      success: function(json){

        //Handle server response here
       if (json == 'No records found'){
           handleAjaxError();
           return;
       }

        document.getElementById("stats_button").disabled = true;
        document.getElementById("filter_button").disabled = true; // disable filter button
        console.log('Mirna Input Given');
        console.log(json);

        var mirna_name_returned = json[0]['mirna_name'];  // IF the user has given a mirna ID (MIMAT) , i store in this var the mirna name returned from the server (if given name its the same)
        console.log(mirna_name_returned);
        global_mirna = mirna_name_returned; //user_input
        //time =1;
        //***********************/
        //clear superman - div content
        $('.superman').empty();     //PROSOXI AYTO SVINEI OLA TA CLASSES KAI IDS POU EXW DWSEI STA ELEMENTS MOU , ISWS EINAI KALYTERA NA MHN TO XRISIMOPOISW KAI NA KANW LOAD MIA ALLI HTML SELIDA
        container.css("padding-left", "20px");
        container.append('<br/></br>');
        container.append('<h4>microRNA <b>'+user_input+'</b> interacts with the following transcripts <h4>');
        container.append('<br/></br>');

        var container_id = document.getElementById('superman-id');
        var table = document.createElement('table');

        $("#superman-id").css("width", "600");
        $("#superman-id").css("margin", "auto");

        table.setAttribute("class", "myTable");
        table.setAttribute("id", "myTableID");
        table.setAttribute("width", "50%");
        table.setAttribute("border-collapse", "collapse");
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        var td2 = document.createElement('td');
        var td3 = document.createElement('td');
        var td4 = document.createElement('td');
        var txt1 = document.createTextNode("Transcript ID");
        var txt2 = document.createTextNode("Gene ID");
        var txt3 = document.createTextNode("Score");
        var txt4 = document.createTextNode("Chromosome");
        td.setAttribute("class", "myTd myTableHeader");
        // td.setAttribute("id", "myHd");
        td2.setAttribute("class", "myTd myTableHeader");
        td3.setAttribute("class", "myTd myTableHeader");
        // td3.setAttribute("id", "myHd3");
        td4.setAttribute("class", "myTd myTableHeader");
        // td4.setAttribute("id", "myHd4");
        tr.setAttribute("class", "myTr");


        td.appendChild(txt1);
        td2.appendChild(txt2);
        td3.appendChild(txt3);
        td4.appendChild(txt4);
        tr.appendChild(td);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        table.appendChild(tr);

        $.each(json,function(index, item){  // [ {}, {}, {}, ...]
          tr = document.createElement('tr');
          td = document.createElement('td');
          td2 = document.createElement('td');
          td3 = document.createElement('td');
          td4 = document.createElement('td');
          txt1 = document.createTextNode(item.transcript_id);
    	    txt2 = document.createTextNode(item.gene_id);
          txt3 = document.createTextNode(item.score.toPrecision(8));
          txt4 = document.createTextNode(item.chromosome);
          td.setAttribute("class", "myTd myTranscID");
          td2.setAttribute("class", "myTd");
          td3.setAttribute("class", "myTd");
          td4.setAttribute("class", "myTd");
          tr.setAttribute("class", "myTr");
          tr.setAttribute("class", "myRows");

          td.appendChild(txt1);
          td2.appendChild(txt2);
          td3.appendChild(txt3);
          td4.appendChild(txt4);
          tr.appendChild(td);
          tr.appendChild(td2);
          tr.appendChild(td3);
          tr.appendChild(td4);
          table.appendChild(tr);
        });
        container_id.appendChild(table);
        //container.append(tb);
        /***********************/

        //Create input text box for filter the results
        var x = document.createElement("INPUT");
        x.setAttribute("type", "text");
        x.setAttribute("id", "myInput");
        x.setAttribute("placeholder", "Search filter..");
        x.setAttribute("title", "Type in an ID or score");
        container_id.insertBefore(x ,table);
        //x.setAttribute('onkeyup','myFunction1();'); // for FF
        //x.onkeyup = myFunction()
        //button_element.onclick = function() {doSomething();}; // for IE

        // pagination_fun(0);
        //
        // $("#myInput").keyup(function() {
        //   if (!this.value) {
        //     console.log('calling pagination fun');
        //       pagination_fun(2);
        //   }
        // });

        // if($("#myInput").val() == ''){
        //   //call pagination function
        // }
        // else{
        //   //show all
        //   // call filter-search function
        // }

        //For filter search Purpose
        $("#myInput").on("keyup", function() {
          var value = $(this).val().toLowerCase();
          $(".myRows").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
          });
        });




        $(".myTranscID").css("cursor", "pointer");
        // $("#myHd").css("cursor", "pointer");
        // $("#myHd3").css("cursor", "pointer");
        // $("#myHd4").css("cursor", "pointer");

        $('.myTranscID').click(function(e) {
          var txt_transcr = $(e.target).text();
          console.log(typeof(txt_transcr));
          console.log(txt_transcr.length);
          global_transcript = txt_transcr;
          $('#post-text:text').val(mirna_name_returned);  //set transcript id to search box if first gene is selected
          $('.superman').empty();
          ask_for_transcript_data(txt_transcr, 'transcript',1,mirna_name_returned);



        });

        // $('#myHd').click(function(e) {
        //   console.log('1');
        //   sortTable(0);
        // });
        // $('#myHd3').click(function(e) {
        //   sortTable(3);
        //   console.log('2');
        // });
        // $('#myHd4').click(function(e) {
        //   sortTable(4);
        //   console.log('3');
        // });
      },

      //in case AJAX is NOT successful

      error: handleAjaxError
      // error : function(xhr,errmsg,err) {
      //   $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
      //   " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
      //   console.log("FAILURE");
      //   console.log(xhr.status + ": " + xhr.responseText);
      // }
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
