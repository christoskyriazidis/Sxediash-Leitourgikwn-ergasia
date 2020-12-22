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
let requestQueue = [];
let chillQueue = [];
let done = [];
let kme = "";
let kmeArray = [];
const calcuLateBtn = document.querySelector("#calculate-process");
calcuLateBtn.addEventListener("click", calculate_and_show);

function calculate_and_show() {
  cleanResults();
  create_Process_objects();
  //prwta round robin kai meta
  //dinamika mpainei to quantum
  roundRobin(processes, parseInt(document.getElementById("quantum").value));
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
  done = [];
  time = 0;
  kmeArray = [];
  processes = [];
}

function roundRobin(queue, quantum) {
  let finish = false;
  let quant2 = quantum;
  while (!finish) {
    let timeTick = true;
    //an h readyList einai 0 paei na pei pws ektelestikan oles oi diergasies
    if (queue.length > 0) {
      for (i = 0; i < queue.length; i++) {
        if (queue[i].arrivalTime <= time) {
          // console.log(time);
          //mpainei stin readyList
          requestQueue.push(queue[i]);
          //feugei apo tin oyra ton diergasiwn pou kataf8anoyn sto systhma.
          queue.splice(i, 1);
        }
      }
    }
    for (let i of chillQueue) {
      requestQueue.push(i);
    }
    chillQueue = [];
    if (requestQueue.length != 0) {
      kme = requestQueue.shift();
      kmeArray.push(kme);
      if (kme.timeStarted == null) {
        kme.timeStarted = time;
      }
      kme.BurstTime--;
      quantum--;
      if (kme.BurstTime == 0) {
        timeTick = false;
        time++;
        kme.timeCompleted = time;
        kme.turnAroundTime = time - kme.arrivalTime;
        kme.responseTime = kme.timeStarted - kme.arrivalTime;
        done.push(kme);
        kme = "";
        //to to BT einai 0 prepei na ksana ginei to quant oso htan!!!
        quantum = quant2;
      } else {
        if (quantum == 0) {
          chillQueue.push(kme);
          kme = "";
          quantum = quant2;
        } else {
          requestQueue.unshift(kme);
          kme = "";
        }
      }
    }

    if (done.length == 5) {
      break;
    }
    if (timeTick) {
      time++;
    }
    if (time > 10000) {
      alert("something went wrong time 10000 (apeiro loop )");
      break;
    }
  }
}

const table = document.querySelector("#processes");
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
        // console.log(j);
        td.innerHTML = i[j];
        row.appendChild(td);
      }
      // td.innerHTML=
      // console.log(i[j]);
    }
    table.appendChild(row);
  }
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
    //me ta values ftiaxnw antikeimena Process kai ta vazw stn pinaka
    processes.push(
      new Process(name, parseInt(arrivalTime), parseInt(burstTime), 1)
    );
  }
}

const stepsuL = document.querySelector("#steps");
//kanei print se mia "lista" tn seira pou ektelestikan oi diergasies
function showSteps() {
  // stepsuL.innerHTML+=`<tr><th>${"ID"}</th><th>${"Time"}</th></tr>`
  let li = "<li>Steps:  ";
  for (i = 0; i < kmeArray.length; i++) {
    li += ` ${kmeArray[i].id} `;
  }
  li += `  </li>`;
  stepsuL.innerHTML = li;
}
