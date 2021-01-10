class Process {
  constructor(
    id,
    arrivalTime,
    BurstTime,
    priority,
    timeStarted = null,
    timeCompleted = null,
    responseTime = null,
    turnAroundTime = null
  ) {
    this.id = id;
    this.arrivalTime = arrivalTime;
    this.BurstTime = BurstTime;
    this.priority = priority;
    this.timeStarted = timeStarted;
    this.timeCompleted = timeCompleted;
    this.responseTime = responseTime;
    this.turnAroundTime = turnAroundTime;
  }
}
let processes = [];
let time = 0;
let loopTime = 0;
let requestQueue = [];
let chillQueue = [];
let done = [];
let kme = "";
let kmeArray = [];
const calcuLateBtn = document.querySelector("#calculate-process");
const remove_process_btn = document.querySelector("#remove-process");
const divisions = document.querySelector("#divisions");
calcuLateBtn.addEventListener("click", calculate_and_show);

remove_process_btn.addEventListener("click", removeLastProcess);

// processes = [
//   new Process("A", 0, 3, 1),
//   new Process("B", 1, 5, 1),
//   new Process("C", 3, 2, 1),
//   new Process("D", 9, 5, 1),
//   new Process("E", 12, 5, 1),
// ];
function removeLastProcess() {
  let rowCount = processesHtml.rows.length;
  processesHtml.deleteRow(rowCount - 1);
}
function calculate_and_show() {
  cleanResults();
  create_Process_objects();
  //prwta round robin kai meta
  //dinamika mpainei to quantum
  HRRN(processes);
  fillTable();
  showSteps();
}

//Ka8e fora p pataei showMeResults "ka8arizei" olous tous pinakes gia na ksana kanei calculate to RoundRobin
function cleanResults() {
  stepsuL.innerHTML = "";
  table.innerHTML = ` <tr>
    <th>Process</th>
    <th>arrivalTime</th>
    <th>TimeStarted</th>
    <th>TimeCompleted</th>
    <th>ResponseTime</th>
    <th>TaTime</th>
  </tr>`;
  AVGtimes.innerHTML = "";
  done = [];
  time = 0;
  kmeArray = [];
  processes = [];
}

function HRRN(queue) {
  let finish = false;
  //KRATAW tis arxikes times quantum/diergasiwn
  let firstSize = queue.length;
  if (queue.length <= 2) return;
  while (!finish) {
    //koitame an uparxoun diergasies oi opoies dn exoun ftasei.
    if (queue.length > 0) {
      for (i = 0; i < queue.length; i++) {
        if (queue[i].arrivalTime <= time) {
          //an exei arrivalTime <= time tote mpainei ston pinaka requestQueue
          requestQueue.push(queue[i]);
          //afu mpike sto requestQueue tn dioxnoume kai apo to queue
          queue.splice(i, 1);
          //an kanoume pop kati apo ton pinaka prepei na meiosoume kai to i...
          i--;
        }
      }
    }

    if (requestQueue.length != 0) {
      //highestResponseRatio evala poli mikro noumero gia sigouria...
      let hrr = -100;
      //se poia 8esi tou pinaka einai to max oste na paei sthn KME.
      let maxPr = -1;
      //an exoun erthei perissotera apo 1 stoixeia TOTE MONO thaA GINOUN oi diaireseis
      if (requestQueue.length > 1) {
        //loop se oles tis diergasies pou exoun ftasei.
        for (let i = 0; i < requestQueue.length; i++) {
          //upologizo to Ratio
          let currentRR =
            (time - requestQueue[i].arrivalTime + requestQueue[i].BurstTime) /
            requestQueue[i].BurstTime;
          //kanw print to Ratio
          divisions.innerHTML += `<li>Time:${time}  ${requestQueue[i].id} rratio${currentRR}</li>`;
          //koitaei an to ratio tis diergasies einai maligero apo to "highest ratio"
          if (currentRR > hrr) {
            hrr = currentRR;
            maxPr = i;
          }
        }
        //vazoume stn "KME" tin 1 diergasia apo to requestQueue gia ektelesh
        kme = requestQueue.splice(maxPr, 1);
        //se ena voi8iko array vazw tis diergasies pou ektelestikan stn KME gia na tis emfanisw sto UI...
        kmeArray.push(kme[0]);
        if (kme[0].timeStarted == null) {
          kme[0].timeStarted = time;
        }
        //prostheto sto TIME olo to burstTime tis diergasies afu einai xwris proekxorisi algorithmos..
        time += parseInt(kme[0].BurstTime);
        kme[0].BurstTime = 0;
        if (kme[0].BurstTime == 0) {
          //calculations response/turnAround
          kme[0].timeCompleted = time;
          kme[0].turnAroundTime = time - kme[0].arrivalTime;
          kme[0].responseTime = kme[0].timeStarted - kme[0].arrivalTime;
          done.push(kme[0]);
          //ka8arizei tn "KME" apo tn diergasia
          kme = "";
        }
      }
      //edw tha paei an uparxei MONO 1 diergasia stn lista kai dn xroiazete na ginoun oi diaireseis..
      else {
        //vazoume stn "KME" tin 1 diergasia apo to requestQueue gia ektelesh
        kme = requestQueue.shift();
        //se ena voi8iko array vazw tis diergasies pou ektelestikan stn KME gia na tis emfanisw sto UI...
        kmeArray.push(kme);
        console.log(kme);
        if (kme.timeStarted == null) {
          kme.timeStarted = time;
        }
        time += parseInt(kme.BurstTime);
        kme.BurstTime = 0;
        if (kme.BurstTime == 0) {
          //calculations response/turnAround
          kme.timeCompleted = time;
          kme.turnAroundTime = time - kme.arrivalTime;
          kme.responseTime = kme.timeStarted - kme.arrivalTime;
          done.push(kme);
          //ka8arizei tn "KME" apo tn diergasia
          kme = "";
        }
      }
    }

    //edw telionei o algori8mos. Otan teliosoun kai oles oi diergasies...
    if (done.length == firstSize) {
      break;
    }
    //kapoies fores kanei infinity loop... kai an kseperasi to 10.000 time stn ousia petaei error oti kati egine la8os...
    //kai den kolaei kai o browser opws otan ginete apiro loop..
    loopTime++;
    if (loopTime > 10000) {
      alert("something went wrong time 10000 (apeiro loop )");
      break;
    }
  }
}

const table = document.querySelector("#processes");
const AVGtimes = document.querySelector("#AVGtimes");
//gemizoume dunamika to table me ta apotelesmata apo to roundRobin
function fillTable() {
  let AVGresponseTime = 0;
  let AVGturnAroundTime = 0;
  for (i of done) {
    let row = document.createElement("tr");
    for (j in i) {
      let td = document.createElement("td");
      // den vazw mesa to BurstTime(giati to midenizo otan einai done h diergasia) kai to Priority
      if (j != "BurstTime" && j != "priority") {
        // kanw print ola ta pedia tou antikeimenou me
        td.innerHTML = i[j];
        row.appendChild(td);
      }
      if (j == "responseTime") {
        AVGresponseTime += i[j];
      }
      if (j == "turnAroundTime") {
        AVGturnAroundTime += i[j];
      }
      // td.innerHTML=
      // console.log(i[j]);
    }

    table.appendChild(row);
  }
  //kai sto telos kanoume print ta AVG waiting/response Times (diairoume me to length tn diergasiwn...)
  AVGtimes.innerHTML += `<li>AVG turnAroundTime  ${
    AVGturnAroundTime / done.length
  } </li>`;
  AVGtimes.innerHTML += `<li>AVG responseTime  ${
    AVGresponseTime / done.length
  }</li>`;
}

document.querySelector("#add-process").addEventListener("click", add);

//otan patame to add kanei append ena row gia mia kainourgia diergasia
function add() {
  let tr = document.createElement("tr");
  let td1 = document.createElement("td");
  let td2 = document.createElement("td");
  let td3 = document.createElement("td");
  td1.innerHTML = `<input type="text" />`;
  td2.innerHTML = `<input type="number" />`;
  td3.innerHTML = `<input type="number" />`;
  tr.appendChild(td1);
  tr.appendChild(td2);
  tr.appendChild(td3);
  processesHtml.appendChild(tr);
}
//to table pou 8a paroume tis values gia tis diergasies
const processesHtml = document.querySelector("#selectProcesses");
function create_Process_objects() {
  for (i = 1; i < processesHtml.rows.length; i++) {
    // console.log(processesHtml.rows[i].cells[0]);
    //pernw ola ta values apo ta procceses
    let name = processesHtml.rows[i].cells[0].querySelector("input").value;
    let burstTime = processesHtml.rows[i].cells[1].querySelector("input").value;
    let arrivalTime = processesHtml.rows[i].cells[2].querySelector("input")
      .value;
    if (name != "" && burstTime != "" && arrivalTime != "") {
      //me ta values ftiaxnw antikeimena Process kai ta vazw stn pinaka
      processes.push(
        //panta vazoume priority 1...
        new Process(name, parseInt(arrivalTime), parseInt(burstTime), 1)
      );
    }
  }
}

const stepsuL = document.querySelector("#steps");
//kanei print se mia "lista" tn seira pou ektelestikan oi diergasies
function showSteps() {
  // stepsuL.innerHTML+=`<tr><th>${"ID"}</th><th>${"Time"}</th></tr>`
  let li = "<li>Steps:  ";
  for (i = 0; i < kmeArray.length; i++) {
    //diplh for gia "kalo" print tis KME
    for (j = 0; j < kmeArray[i].timeCompleted - kmeArray[i].timeStarted; j++) {
      li += ` ${kmeArray[i].id} `;
    }
  }
  li += `  </li>`;
  stepsuL.innerHTML = li;
}
