// const { jsx } = require("react/jsx-runtime");
let id = (a)=> document.getElementById(a)

// ---------- localStorage ----------
let userdata = JSON.parse(localStorage.getItem("appointments")) || []


let prev = id("btn1"),
    next = id("btn2"),
    months = id("month"),
    thisyear = id('year'),
    today = id("today")
    thismonth = new Date().getMonth();
    thisday = new Date().getDate();

const monthnames = ["January","Febraury","March","April","May","June","July",
    "August","September","October","November","December"]
const  currentday = ["SUNDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"]
// ----------------get current date, month , year ----------
let year = 2026
let calender = id('calender')

function TodayDate(){
   let currentdate = new Date()
   let year = currentdate.getFullYear()
   let month = currentdate.getMonth()
    Calender(year,month)
}


function Calender(year,month){
    calender.innerHTML =""
    let firstday = new Date(year ,month,1).getDay(),
        totaldays = new Date(year ,month+1,0).getDate(),
        prevdays = new Date(year,month,0).getDate()
        months.innerText = monthnames[month] 
        today.innerText = thisday
        thisyear.innerText = year


        date = 1,
        nextdate = 1
    

    for(let i=0;i<5;i++){
        let row = document.createElement("tr")
        for (let j=0;j<7;j++){
            let cell = document.createElement("td")

            if(i === 0 && j<firstday ){
                cell.innerText = prevdays - firstday + j + 1
                cell.style = "color:grey"

                }else if(date <= totaldays){

                let currentDate = `${year}-${String(month+1).padStart(2,'0')}-${String(date).padStart(2,'0')}`

                let appointments = userdata.filter(item => item.date === currentDate)

                let dateText = document.createElement("div")
                dateText.innerText = date
                cell.appendChild(dateText)

                if(appointments.length > 0){

                    appointments.forEach(app => {
                    let badge = document.createElement("span")
                    badge.innerText = app.docname

                    badge.classList.add("doctor-badge") 

                    cell.appendChild(badge)
            })
            }

            date++

            }else{
                cell.innerText = nextdate ;
                nextdate++;
                cell.style = "color:grey"
            }

        row.appendChild(cell)
        }
        calender.appendChild(row)
    }

}

Calender(2026,thismonth)

// ------------- prev and next  months

prev.addEventListener("click",function(){
    thismonth--
    if (thismonth<0){
    thismonth = 11;
    year--
    }
    months.innerText = monthnames[thismonth] 
    thisyear.innerText = year

    Calender(year,thismonth)
})

next.addEventListener("click",function(){
    thismonth++
    if (thismonth>11){
    thismonth = 0
    year++
    }
    thisyear.innerText = year
    months.innerText = monthnames[thismonth] 

    Calender(year,thismonth)
})



// ------------------appointment form --------------------

let book = id('book'),
    form = id("appointment-form") ,
    cancel = id("cancel"),
    close = id("close"),
    overlay = id("overlay")

book.addEventListener("click",function(){
    form.reset()
    form.classList.add("form-show");
    overlay.classList.add("overlay-show")
})

cancel.addEventListener("click",function(){
    form.classList.remove("form-show");
    overlay.classList.remove("overlay-show")
})

close.addEventListener("click",function(){
    form.classList.remove("form-show");
    overlay.classList.remove("overlay-show")
})


// -------------details view-----------------
    let details = id("appointment-details"),
    calendershow = id("calender-show"),
    sidebar = id("sidebar"),
    navbtn = document.querySelectorAll(".nav-btn")
    
    navbtn.forEach(btn => {
    btn.addEventListener("click",function(){
    if(btn.id == "icon1"){
        details.classList.remove('details-show')
    calendershow.classList.remove('nodisplay')
    }else if(btn.id == "icon2"){
    details.classList.add('details-show')
    calendershow.classList.add('nodisplay')
    }
})
});

userdata = userdata.map(item => ({
    ...item,
    id: item.id || Date.now() + Math.random()
}))

let editIndex = -1

// ---------- elements ----------
const tableBody = id("tablebody")

// ---------- form submit ----------
form.addEventListener("submit", function(e){
    e.preventDefault()

    const username = id("name").value.trim()
    const docname = id("doc-name").value.trim()
    const hospital = id("hospital").value.trim()
    const speciality = id("speciality").value.trim()
    const reason = id("reason").value.trim()
    const date = id("date").value
    const time = id("time").value

// ----------- basic validation ------------

    if(username === ""){
        alert("Patient name is required")
        return
    }

    if(docname === ""){
        alert("Doctor name is required")
        return
    }

    if(hospital === ""){
        alert("Hospital is required")
        return
    }

    if(speciality === ""){
        alert("Speciality is required")
        return
    }

    if(reason === ""){
        alert("Reason is required")
        return
    }

    if(date === ""){
        alert("Please select a date")
        return
    }

    if(time === ""){
        alert("Please select a time")
        return
    }

    // ----------- data saving ------------

    const data = {
        id: Date.now(),
        username,
        docname,
        hospital,
        speciality,
        reason,
        date,
        time
    }

    if(editIndex === -1){
        userdata.push(data)
    } else {
        userdata[editIndex] = data
        editIndex = -1
    }

    localStorage.setItem("appointments", JSON.stringify(userdata))
    displaydata()
    Calender(year,thismonth)

    form.reset()
    form.classList.remove("form-show")
    overlay.classList.remove("overlay-show")
})

// ---------- display ----------
function displaydata(data = userdata){
    tableBody.innerHTML = ""

    if(data.length === 0){
        tableBody.innerHTML = `<tr><td colspan="8">No results found</td></tr>`
        return
    }

    data.forEach(item => {
        const row = document.createElement("tr")

        row.innerHTML = `
        <td>${item.username || ""}</td>
        <td>${item.docname || ""}</td>
        <td>${item.hospital || ""}</td>
        <td>${item.speciality || ""}</td>
        <td>${item.date || ""}</td>
        <td>${item.time || ""}</td>
        <td>${item.reason || ""}</td>
        <td>
            <button class="edit-btn" data-id="${item.id}"><img src="carbon_edit.png" /></button>
            <button class="delete-btn" data-id="${item.id}"><img src="material-symbols_delete-outline.png" /></button>
        </td>
        `

        tableBody.appendChild(row)
    })
}
// ----------delete data
function deletedata(idValue){
    userdata = userdata.filter(item => item && item.id !== idValue)
    localStorage.setItem("appointments", JSON.stringify(userdata))
    displaydata()
    Calender(year,thismonth)

}

// ---------- edit ----------
function editdata(idValue){
    const index = userdata.findIndex(item => item.id === idValue)

    if(index === -1) return   

    const item = userdata[index]

    if(!item) return   
    id("name").value = item.username
    id("doc-name").value = item.docname
    id("hospital").value = item.hospital
    id("speciality").value = item.speciality
    id("reason").value = item.reason
    id("date").value = item.date
    id("time").value = item.time

    editIndex = index

    form.classList.add("form-show")
    overlay.classList.add("overlay-show")
}

// ---------- event delegation ----------
tableBody.addEventListener("click", function(e){
const btn = e.target.closest("button")
    if(!btn) return

    const idValue = Number(btn.dataset.id)

    if(isNaN(idValue)) return

    if(btn.classList.contains("delete-btn")){
        deletedata(idValue)
    }

    if(btn.classList.contains("edit-btn")){
        editdata(idValue)
    }
})

// ---------- search and filter ----------
let filterbtn = id("filter-btn")

function filterData(){
    const patient = id("search-patient").value.toLowerCase().trim()
    const doctor = id("search-doctor").value.toLowerCase().trim()
    const fromDate = id("from-date").value
    const toDate = id("to-date").value

    const filtered = userdata.filter(item => {

        const matchPatient = !patient || (item.username && item.username.toLowerCase().includes(patient))

        const matchDoctor = !doctor || (item.docname && item.docname.toLowerCase().includes(doctor))

        let matchDate = true

        if(fromDate && toDate){
            matchDate = item.date >= fromDate && item.date <= toDate
        } else if(fromDate){
            matchDate = item.date >= fromDate
        } else if(toDate){
            matchDate = item.date <= toDate
        }

        return matchPatient && matchDoctor && matchDate
    })

    displaydata(filtered)
}

filterbtn.addEventListener("click", filterData)

displaydata()

// -----------add  date ------------ 

function isBookedDate(year, month, day){
    const formattedDate = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`

    return userdata.some(item => item.date === formattedDate)
}


// -----------responsive slidebar ----------

arrow = id("arrow")
nav1 = id("nav1")
nav2 = id("nav2")
arrow.addEventListener("click",function(){
    if(sidebar.classList.contains("expand")){
    arrow.style.transform = "rotate(180deg)"
    sidebar.classList.remove("expand")
    nav1.style = "display:none"
    nav2.style = "display:none"
    }else{
        sidebar.classList.add("expand")
        arrow.style.transform = "rotate(0deg)"
        nav1.style = "display:block"
    nav2.style = "display:block"
    }
    
})

 