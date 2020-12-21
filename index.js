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
const processes = [];
processes.push(new Process("A", 0, 3, 1));
processes.push(new Process("B", 2, 6, 2));
processes.push(new Process("C", 4, 4, 4));
processes.push(new Process("D", 6, 5, 5));
processes.push(new Process("E", 8, 2, 6));

let quantum = parseInt(1);
let time = 0;
const requestQueue = [];
let chillQueue = [];
const done = [];
let kme = "";

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
      console.log(kme);
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
  }
  fillTable();
}

const table = document.querySelector("#processes");
//gemizoume dunamika to table
function fillTable() {
  let AVGresponseTime = 0;
  let AVGturnAroundTime = 0;
  for (i of done) {
    let row = document.createElement("tr");
    for (j in i) {
      let td = document.createElement("td");
      // den vazw mesa to BurstTime(giati to midenizo otan einai done h diergasia) kai to Priority
      if (j != "BurstTime" && j != "priority") {
        console.log(j);
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
  const processes = document.querySelector("#selectProcesses");
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
  processes.appendChild(tr);
}
