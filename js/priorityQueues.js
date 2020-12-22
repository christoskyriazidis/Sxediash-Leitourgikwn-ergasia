








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