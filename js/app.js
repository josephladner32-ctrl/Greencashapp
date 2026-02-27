let balance = Number(localStorage.getItem("balance")) || 500;
let historyData = JSON.parse(localStorage.getItem("history")) || [];
let contacts = ["Alice","Bob","Charlie","David","Eve","Frank"];
let cards = [
  {name:"Balance", type:"balance"},
  {name:"Visa •••• 1234", type:"card"},
  {name:"Mastercard •••• 5678", type:"card"}
];
let selectedCard = "balance";
let payAmount=0;

setTimeout(()=>{
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  if(localStorage.getItem("loggedIn")){
    showScreen('homeScreen');
  } else {
    showScreen('loginScreen');
  }
},1500);

function login(){
  localStorage.setItem("loggedIn", true);
  showScreen('homeScreen');
  updateUI();
}

function showScreen(screen){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(screen).classList.add('active');
  if(screen==='homeScreen') updateUI();
  if(screen==='activityScreen') renderHistory();
}

function updateUI(){
  document.getElementById('balance').innerText="$"+balance.toFixed(2);
  renderRecentContacts();
  renderRecentPayments();
}

function addMoney(){
  document.getElementById('addAmountInput').value="";
  showScreen('addMoneyScreen');
}
function confirmAddMoney(){
  let amt = Number(document.getElementById('addAmountInput').value);
  if(!amt) return alert("Enter amount");
  balance += amt;
  historyData.unshift({name:"Deposit",amount:"+$"+amt});
  saveData();
  showScreen('homeScreen');
}

function renderRecentContacts(){
  const row = document.getElementById('recentContactsRow');
  row.innerHTML="";
  contacts.forEach(c=>{
    const div = document.createElement('div');
    div.className='contact';
    div.innerHTML=c[0]+"<span>"+c+"</span>";
    div.onclick=()=>{promptRecipient(c);}
    row.appendChild(div);
  });
}
function promptRecipient(name){
  document.getElementById('confirmRecipient').innerText="Recipient: "+name;
}

function renderRecentPayments(){
  const row = document.getElementById('recentPaymentsRow');
  row.innerHTML="";
  historyData.slice(0,5).forEach(tx=>{
    const div=document.createElement('div');
    div.className='payment-item';
    div.innerHTML=tx.name+'<span class="amount '+(tx.amount.includes('+')?'positive':'negative')+'">'+tx.amount+'</span>';
    div.onclick=()=>{alert("Transaction Details:\n"+tx.name+" → "+tx.amount);}
    row.appendChild(div);
  });
}

function requestMoney(){
  let amt = Number(prompt("Enter amount to request:"));
  let recipient = prompt("Recipient name:") || "Request";
  if(!amt) return alert("Enter amount");
  historyData.unshift({name:recipient,amount:"+$"+amt});
  saveData();
}

function goPayFlow(){
  let amt = Number(prompt("Enter amount to pay:"));
  let recipient = prompt("Recipient name:") || "—";
  if(!amt || amt>balance) return alert("Invalid or insufficient balance");
  payAmount = amt;
  document.getElementById('confirmAmount').innerText="$"+amt.toFixed(2);
  document.getElementById('confirmRecipient').innerText="Recipient: "+recipient;
  renderCardList();
  showScreen('payScreen');
}

function renderCardList(){
  const list = document.getElementById('cardList');
  list.innerHTML="";
  cards.forEach(card=>{
    const div=document.createElement('div');
    div.className='card-item'+(card.type===selectedCard?' selected':'');
    div.innerText=card.name;
    div.onclick=()=>{
      selectedCard=card.type;
      renderCardList();
    }
    list.appendChild(div);
  });
}

function finalPay(){
  let recipient = document.getElementById('confirmRecipient').innerText.replace("Recipient: ","");
  if(selectedCard==='balance') balance-=payAmount;
  historyData.unshift({name:recipient,amount:"-$"+payAmount});
  saveData();
  alert("Payment sent to "+recipient+" via "+selectedCard);
  showScreen('homeScreen');
}

function renderHistory(){
  const h = document.getElementById('history');
  h.innerHTML="";
  historyData.forEach(tx=>{
    const div=document.createElement('div');
    div.className='history-item';
    div.innerHTML=tx.name+'<span class="amount '+(tx.amount.includes('+')?'positive':'negative')+'">'+tx.amount+'</span>';
    div.onclick=()=>{alert("Transaction Details:\n"+tx.name+" → "+tx.amount);}
    h.appendChild(div);
  });
}

function saveData(){
  localStorage.setItem("balance",balance);
  localStorage.setItem("history",JSON.stringify(historyData));
  updateUI();
}

if(localStorage.getItem("loggedIn")) showScreen('homeScreen');
updateUI();
