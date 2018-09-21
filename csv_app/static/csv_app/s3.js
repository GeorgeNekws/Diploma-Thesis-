var globalData;
var globalExtraData;
var forma ;
var forma2 ;
var transcript_length;
var x;
var gene_len = 1000;
var checkbox;

function setup() {
  // x,y
  var canvas = createCanvas(1100,1000);
  canvas.position(245,100);
  console.log(windowWidth);

  background(220);
  clear();
  //var button = select("#my-button") ;
  var button3 = select('#input-button');
  button3.mousePressed(gettheurl)


  checkbox = select('#checkbox-field');
  checkbox.mouseClicked(getalue);



  forma = select('#form');
  forma2 = select('#score-field')
  forma3 = select('#site-field')

  var button = createButton('click me');
  button.parent(select('.col-md-3'));
  button.mousePressed(getJson)
}


function getalue(){
  console.log("Pati8ike");
  console.log(checkbox.value());
}

function gettheurl(){
    console.log(getURL());
    console.log("URLLLLLLLLLLLLLLLLLLLLLLL");
}
function getJson(){
  loadJSON("http://127.0.0.1:8000/csv_app/my_data/?q_search="+forma.value()+"&q_score="+forma2.value()+"&q_site="+forma3.value(), gotData);
}

function gotData(data){
  globalData = data;
  console.log(globalData);
}


function draw(){
  //clear();
  stroke('black')
  strokeWeight(5);
  //line(x,200,x+gene_len*m,200);

  line(0,10,1100,10);

  var j = 100;
  //line(100,100,1000,100)
  if (globalData){
    console.log('ok');
    console.log(globalData[0].transcript_start);
    console.log(globalData[0].transcript_stop);
    transcript_length = globalData[0].transcript_stop - globalData[0].transcript_start;
    console.log(transcript_length);

    //sta = parseInt(globalData[0].transcript_start) + parseInt(globalData[1].relative_bind_start);
    //sto = parseInt(globalData[0].transcript_start) + parseInt(globalData[1].relative_bind_stop);
  //  sta = (1100/transcript_length)*parseInt(globalData[1].relative_bind_start);
  //  sto = (1100/transcript_length)*parseInt(globalData[1].relative_bind_stop);

    //line(Math.round(sta),60, Math.round(sto),60)

    //console.log(sta);
    //console.log(sto);


    for(var i =1;i<globalData.length;i++){
      //line(x1,y1, x2,y2)
      sta = (1100/transcript_length)*parseInt(globalData[i].relative_bind_start);
      sto = (1100/transcript_length)*parseInt(globalData[i].relative_bind_stop);
      //console.log(sta);
      //console.log(sto);
      if (globalData[i].bind_site == "UTR3"){
        stroke("red")
        line(Math.round(sta),(10+5*i), Math.round(sto),(10+5*i))
      }
      else {
        stroke("black")
        line(Math.round(sta),(10+5*i), Math.round(sto),(10+5*i))
      }
      //line(globalData[i].bind_start,100+10*i,globalData[i].bind_stop,100+10*i);
      //line(x+array[i]*m,195,x+array[i]*m,205)
      //console.log(globalData[i].mirna_name);
      //console.log(globalData[i].bind_start);
      /*console.log(globalData[i].bind_stop);
      console.log(100+i*j);*/
      //point(globalData[i].bind_start,100);
      //point(globalData[i].bind_stop,200);
    }
    globalData = 0;
  }
}
