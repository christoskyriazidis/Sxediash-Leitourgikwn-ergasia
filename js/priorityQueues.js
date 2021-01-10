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
// processes.push(new Process("A", 0, 3, 1));
// processes.push(new Process("B", 2, 6, 4));
// processes.push(new Process("C", 4, 4, 1));
// processes.push(new Process("D", 6, 5, 2));
// processes.push(new Process("E", 8, 2, 1));

let kme = "";
let queues = [[], [], [], [], [], [], []];

let requestQueue = [];
let chillQueue = [];
let done = [];
let kmeArray = [];
let time = 0;
let loopTime = 0;
function priorityQueue(processes, quantum) {
  let firstQuantum = quantum;
  let firstSize = processes.length;
  let finish = false;
  while (!finish) {
    if (processes.length > 0) {
      for (i = 0; i < processes.length; i++) {
        if (processes[i].arrivalTime <= time) {
          switch (processes[i].priority) {
            case 1:
              queues[0].push(processes[i]);
              break;
            case 2:
              queues[1].push(processes[i]);
              break;
            case 3:
              queues[2].push(processes[i]);
              break;
            case 4:
              queues[3].push(processes[i]);
              break;
            case 5:
              queues[4].push(processes[i]);
              break;
            case 6:
              queues[5].push(processes[i]);
              break;
            case 7:
              queues[6].push(processes[i]);
              break;
            default:
              break;
          }
          //afairo kai to proccess apo tn lista..
          processes.splice(i, 1);
          //an kanoume pop kati apo ton pinaka prepei na meiosoume kai to i...
          i--;
        }
      }
    }

    for (let i of chillQueue) {
      queues[i.priority - 1].push(i);
    }
    chillQueue = [];

    for (let i = 0; i < queues.length; i++) {
      if (queues[i].length != 0) {
        kme = queues[i].shift();
        kmeArray.push(kme);
        if (kme.timeStarted == null) {
          kme.timeStarted = time;
        }
        kme.BurstTime--;
        quantum--;
        time++;
        if (kme.BurstTime == 0) {
          //calculations response/turnAround
          kme.timeCompleted = time;
          kme.turnAroundTime = time - kme.arrivalTime;
          kme.responseTime = kme.timeStarted - kme.arrivalTime;
          done.push(kme);
          //ka8arizei tn "KME" apo tn diergasia
          kme = "";
          //to to BurstTime einai 0 ARA prepei na ksana ginei to quantum oso htan!!!
          quantum = firstQuantum;
        } else {
          //an dn exei teliosei h diergasia kai exei quant=0
          if (quantum == 0) {
            //mpainei se ena alo pinaka perimenontas na na parei ksana quant...proforika kalitera..
            chillQueue.push(kme);
            kme = "";
            //afu egine to quant=0 ksana vazw to arxiko
            quantum = firstQuantum;
          } else {
            //an burstTime>0 kai quanta>0 tote ksana PAEI stn 1 8esh tou pinaka requestQueue
            queues[i].unshift(kme);
            kme = "";
          }
        }
      }
    }

    loopTime++;
    if (done.length == firstSize) {
      break;
    }
    //kapoies fores kanei infinity loop... kai an kseperasi to 10.000 time stn ousia petaei error oti kati egine la8os...
    //kai den kolaei kai o browser opws otan ginete apiro loop..
    if (loopTime > 1000000) {
      alert("something went wrong time 1000000 (apeiro loop )");
      break;
    }
  }
}

//molis patisoume to ShowMeResults kalhte auto to function
function calculate_and_show() {
  cleanResults();
  create_Process_objects();
  //prwta round robin kai meta
  //dinamika mpainei to quantum
  let UIquantum = document.getElementById("quantum").value;
  //an einai "falsy" dhladh 0,null,-1.... tote ginete 1
  if (!UIquantum || UIquantum == 0) {
    UIquantum = 1;
  }
  priorityQueue(processes, UIquantum);
  fillTable();
  showSteps();
}

const processesHtml = document.querySelector("#selectProcesses");
document.querySelector("#add-process").addEventListener("click", add);

//otan patame to add kanei append ena row gia mia kainourgia diergasia
function add() {
  let tr = document.createElement("tr");
  let td1 = document.createElement("td");
  let td2 = document.createElement("td");
  let td3 = document.createElement("td");
  let td4 = document.createElement("td");
  td1.innerHTML = `<input type="text" />`;
  td2.innerHTML = `<input type="number" />`;
  td3.innerHTML = `<input type="number" />`;
  td4.innerHTML = `<input type="number" />`;
  tr.appendChild(td1);
  tr.appendChild(td2);
  tr.appendChild(td3);
  tr.appendChild(td4);
  processesHtml.appendChild(tr);
}

const stepsuL = document.querySelector("#steps");

function showSteps() {
  // stepsuL.innerHTML+=`<tr><th>${"ID"}</th><th>${"Time"}</th></tr>`
  let li = "<li>Steps:  ";
  for (i = 0; i < kmeArray.length; i++) {
    li += ` ${kmeArray[i].id} `;
  }
  li += `  </li>`;
  stepsuL.innerHTML = li;
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

const calcuLateBtn = document.querySelector("#calculate-process");
const remove_process_btn = document.querySelector("#remove-process");
calcuLateBtn.addEventListener("click", calculate_and_show);

remove_process_btn.addEventListener("click", removeLastProcess);

function removeLastProcess() {
  let rowCount = processesHtml.rows.length;
  processesHtml.deleteRow(rowCount - 1);
}

//to table pou 8a paroume tis values gia tis diergasies
function create_Process_objects() {
  for (i = 1; i < processesHtml.rows.length; i++) {
    // console.log(processesHtml.rows[i].cells[0]);
    //pernw ola ta values apo ta procceses
    let name = processesHtml.rows[i].cells[0].querySelector("input").value;
    let burstTime = processesHtml.rows[i].cells[1].querySelector("input").value;
    let arrivalTime = processesHtml.rows[i].cells[2].querySelector("input")
      .value;
    let priority = processesHtml.rows[i].cells[3].querySelector("input").value;
    // an einai falsy 0,null,'' ginete 1 :)
    if (!priority) {
      priority = 1;
    }
    if (name != "" && burstTime != "" && arrivalTime != "") {
      //me ta values ftiaxnw antikeimena Process kai ta vazw stn pinaka
      processes.push(
        new Process(
          name,
          parseInt(arrivalTime),
          parseInt(burstTime),
          parseInt(priority)
        )
      );
    }
  }
}
