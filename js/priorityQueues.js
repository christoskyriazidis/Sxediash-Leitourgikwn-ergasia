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
processes.push(new Process("A", 0, 1, 2));
processes.push(new Process("B", 2, 3, 1));
processes.push(new Process("C", 4, 2, 2));
processes.push(new Process("D", 6, 1, 3));
processes.push(new Process("E", 1, 4, 3));
processes.push(new Process("F", 2, 5, 4));
processes.push(new Process("G", 3, 2, 5));
processes.push(new Process("H", 1, 6, 2));
processes.push(new Process("I", 5, 1, 1));
processes.push(new Process("J", 2, 3, 1));

let kme = "";
let queues = [[], [], [], [], [], [], []];

//array
let requestQueue = [];
let chillQueue = [];
let done = [];
let kmeArray = [];
let time = 0;
function roundRobin(queue, quantum) {
  let finish = false;
  //KRATAW tis arxikes times quantum/diergasiwn
  let firstQuantum = quantum;
  let firstSize = queue.length;
  // if (queue.length <= 2) return;
  while (!finish) {
    //koitame an uparxoun diergasies oi opoies dn exoun ftasei.
    if (queue.length > 0) {
      for (i = 0; i < queue.length; i++) {
        if (queue[i].arrivalTime <= time) {
          //an exei arrivalTime <= time tote mpainei ston pinaka requestQueue
          requestQueue.push(queue[i]);
          //afu mpike sto requestQueue tn dioxnoume kai apo to queue
          queue.splice(i, 1);
        }
      }
    }
    //profirika kalitera..
    for (let i of chillQueue) {
      requestQueue.push(i);
    }
    chillQueue = [];

    if (requestQueue.length != 0) {
      //vazoume stn "KME" tin 1 diergasia apo to requestQueue gia ektelesh
      kme = requestQueue.shift();
      //se ena voi8iko array vazw tis diergasies pou ektelestikan stn KME gia na tis emfanisw sto UI...
      kmeArray.push(kme);
      //an dn exei oristei timeStarted stn diergasia vazei to current Time
      if (kme.timeStarted == null) {
        kme.timeStarted = time;
      }
      //afairo apo to burstTime,Quantum kai pros8eto sto time
      kme.BurstTime--;
      quantum--;
      time++;
      //an h diergasia pou vriskete stin KME exei burstTime 0 tote teliose kai tn vazoume sto done
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
          requestQueue.unshift(kme);
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
    if (time > 10000) {
      alert("something went wrong time 10000 (apeiro loop )");
      break;
    }
  }
}

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
        }
      }
    }

    if (queues[0].length > 0) {
      
    } else if (queues[1].length > 0) {

    } else if (queues[2].length > 0) {

    } else if (queues[3].length > 0) {

    } else if (queues[4].length > 0) {

    } else if (queues[5].length > 0) {

    } else if (queues[6].length > 0) {

    }

    time++;

    if (time == 300) {
      return;
    }
  }
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
