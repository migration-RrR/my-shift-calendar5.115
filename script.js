const brigadeCycles = {
  A:["day","night","rest","off"],
  B:["night","rest","off","day"],
  C:["rest","off","day","night"],
  D:["off","day","night","rest"]
};

let selectedBrigade="A";
const calendarEl=document.querySelector(".calendar");
const todayBtn=document.getElementById("today-btn");
const dateInput=document.getElementById("date-input");
const checkBtn=document.getElementById("check-date");

const monthNames=["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
const weekDays=["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];

document.querySelectorAll(".brigade-btn").forEach(btn=>{
  btn.addEventListener("click",()=>{
    selectedBrigade=btn.dataset.brigade;
    generateCalendar();
  });
});

function generateCalendar(){
  calendarEl.innerHTML="";
  const year=new Date().getFullYear();
  const cycle=brigadeCycles[selectedBrigade];
  const today=new Date();

  for(let month=0;month<12;month++){
    const monthDiv=document.createElement("div");
    monthDiv.classList.add("month");
    const monthHeader=document.createElement("h2");
    monthHeader.textContent=monthNames[month];
    monthDiv.appendChild(monthHeader);

    const weekHeader=document.createElement("div");
    weekHeader.classList.add("week-header");
    weekDays.forEach(d=>{
      const dayEl=document.createElement("div");
      dayEl.textContent=d;
      weekHeader.appendChild(dayEl);
    });
    monthDiv.appendChild(weekHeader);

    const daysContainer=document.createElement("div");
    daysContainer.classList.add("days-container");

    const daysInMonth=new Date(year,month+1,0).getDate();
    const firstDay=new Date(year,month,1).getDay();
    let offset=firstDay===0?6:firstDay-1;

    for(let i=0;i<offset;i++){
      const empty=document.createElement("div");
      empty.classList.add("day-cell","empty");
      daysContainer.appendChild(empty);
    }

    for(let day=1;day<=daysInMonth;day++){
      const date=new Date(year,month,day);
      const diffDays=Math.floor((date-new Date(year,0,1))/(1000*60*60*24));
      const shift=cycle[diffDays%4];

      const dayCell=document.createElement("div");
      dayCell.classList.add("day-cell",shift);
      dayCell.textContent=day;

      const popup=document.createElement("div");
      popup.classList.add("shift-popup");
      popup.textContent=formatShift(shift);
      dayCell.appendChild(popup);

      dayCell.addEventListener("click",()=>{
        document.querySelectorAll(".day-cell").forEach(c=>{
          c.classList.remove("selected","show-popup");
        });
        dayCell.classList.add("selected","show-popup");
        dayCell.scrollIntoView({behavior:"smooth",block:"center"});
      });

      if(date.toDateString()===today.toDateString()){
        dayCell.classList.add("today");
      }

      daysContainer.appendChild(dayCell);
    }
    monthDiv.appendChild(daysContainer);
    calendarEl.appendChild(monthDiv);
  }
}

todayBtn.addEventListener("click",()=>{
  const today=new Date();
  const target=document.querySelector(".day-cell.today");
  if(target){
    document.querySelectorAll(".day-cell").forEach(c=>{
      c.classList.remove("selected","show-popup");
    });
    target.classList.add("selected","show-popup");
    target.scrollIntoView({behavior:"smooth",block:"center"});
  }
});

checkBtn.addEventListener("click",()=>{
  if(!dateInput.value) return;
  const d=new Date(dateInput.value+"T00:00");
  const cycle=brigadeCycles[selectedBrigade];
  const diff=Math.floor((d-new Date(d.getFullYear(),0,1))/(1000*60*60*24));
  const shift=cycle[diff%4];

  const monthDivs=document.querySelectorAll(".month");
  const targetMonth=monthDivs[d.getMonth()];
  const dayCells=targetMonth.querySelectorAll(".day-cell:not(.empty)");
  dayCells.forEach(c=>c.classList.remove("selected","show-popup"));
  const targetDay=Array.from(dayCells).find(c=>parseInt(c.textContent)===d.getDate());
  if(targetDay){
    targetDay.classList.add("selected","show-popup");
    targetDay.scrollIntoView({behavior:"smooth",block:"center"});
  }
});

function formatShift(s){return s==="day"?"День":s==="night"?"Ночь":s==="rest"?"Отсыпной":"Выходной";}

generateCalendar();