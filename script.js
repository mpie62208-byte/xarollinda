const namoroInicio = new Date("2025-09-01");
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let selectedDate = null;
let selectedImage = null;

function updateTimer(){
  const now=new Date();
  const diff=now-namoroInicio;
  const days=Math.floor(diff/(1000*60*60*24));
  const months=Math.floor(days/30);

  document.getElementById("timer").innerHTML=
  `Estamos juntos há ${months} meses 💖 (${days} dias)`;
}

function getPosts(){
  return JSON.parse(localStorage.getItem("posts")||"[]");
}

function savePosts(posts){
  localStorage.setItem("posts",JSON.stringify(posts));
}

function populateSelectors(){
  const monthSelect=document.getElementById("month");
  const yearSelect=document.getElementById("year");

  const months=["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

  months.forEach((m,i)=>{
    monthSelect.innerHTML+=`<option value="${i}">${m}</option>`;
  });

  for(let y=2020;y<=2035;y++){
    yearSelect.innerHTML+=`<option value="${y}">${y}</option>`;
  }

  monthSelect.value=currentMonth;
  yearSelect.value=currentYear;

  monthSelect.onchange=()=>{
    currentMonth=parseInt(monthSelect.value);
    generateCalendar();
  };

  yearSelect.onchange=()=>{
    currentYear=parseInt(yearSelect.value);
    generateCalendar();
  };
}

function generateCalendar(){
  const calendar=document.getElementById("calendar");
  calendar.innerHTML="";
  const daysInMonth=new Date(currentYear,currentMonth+1,0).getDate();
  const posts=getPosts();

  for(let d=1;d<=daysInMonth;d++){
    const date=`${currentYear}-${String(currentMonth+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    const hasPost=posts.some(p=>p.date===date);

    const day=document.createElement("div");
    day.classList.add("day");
    if(hasPost) day.classList.add("has-post");

    day.innerText=d;

    day.onclick=()=>{
      selectedDate=date;
      document.querySelectorAll(".day").forEach(el=>el.classList.remove("selected"));
      day.classList.add("selected");
      renderPosts(date);
    };

    calendar.appendChild(day);
  }
}

function renderPosts(date){
  const container=document.getElementById("posts");
  const title=document.getElementById("selected-date-title");
  container.innerHTML="";

  if(!date){
    title.innerText="";
    return;
  }

  title.innerText="Memórias de " + date;

  const posts=getPosts().filter(p=>p.date===date);

  if(posts.length===0){
    container.innerHTML="<div style='padding:20px;text-align:center;color:#888;'>Nenhuma memória nesse dia 💭</div>";
    return;
  }

  posts.forEach(p=>{
    container.innerHTML+=`
      <div class="post">
        <div class="post-image-wrapper">
          <img src="${p.image}">
        </div>
        <div class="post-info">
          ${p.caption}
        </div>
      </div>
    `;
  });
}

function openPostModal(){
  if(!selectedDate){
    alert("Escolhe um dia primeiro 💕");
    return;
  }

  document.getElementById("modal").classList.add("active");
  document.getElementById("post-date").value=selectedDate;
}

function closeModal(){
  document.getElementById("modal").classList.remove("active");
  selectedImage=null;
  document.getElementById("preview").style.display="none";
}

function previewImage(e){
  const reader=new FileReader();
  reader.onload=function(event){
    selectedImage=event.target.result;
    const img=document.getElementById("preview");
    img.src=selectedImage;
    img.style.display="block";
  }
  reader.readAsDataURL(e.target.files[0]);
}

function publish(){
  if(!selectedImage || !selectedDate){
    alert("Escolhe imagem e dia 💕");
    return;
  }

  const caption=document.getElementById("caption").value;
  const posts=getPosts();

  posts.unshift({
    image:selectedImage,
    caption:caption,
    date:selectedDate
  });

  savePosts(posts);
  closeModal();
  generateCalendar();
  renderPosts(selectedDate);
}
function sendToDiscord(){
  const message = document.getElementById("discordMessage").value;

  if(!message){
    alert("Escreve uma mensagem 😅");
    return;
  }

  const webhookURL = "https://discord.com/api/webhooks/1475689358139854890/UIIQVsjn3EZxt9xu5v0Tpw-JKhXsb5cM_UauJaW8diAkX43ELeYgM7-pAbjR2k3Ic_e5";

  fetch(webhookURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      content: message
    })
  })
  .then(() => {
    alert("Mensagem enviada para o amor da sua vida <3 ");
    document.getElementById("discordMessage").value = "";
  })
  .catch(() => {
    alert("Erro ao enviar 😢");
  });
}

updateTimer();
populateSelectors();
generateCalendar();