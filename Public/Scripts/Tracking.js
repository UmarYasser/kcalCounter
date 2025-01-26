url = "https://expert-tribble-jv7qv746jvw2v7v-3000.app.github.dev/api/v1"
const date= document.getElementById("dateInput")
const viewAction = document.getElementById("viewTracker")
const VDMessage= document.getElementById('viewDateMessage')
let trackerData =document.getElementById('trackerData')
const foodSelect= document.getElementById("foodSelect")
const exerciseSelect = document.getElementById("exerciseSelect")
let resMessage = document.getElementById("responseMessage")

const today = new Date()
const year = today.getFullYear()

let month = String(today.getMonth() +1)
if(month.length==1) {month = '0' +month}

let day = today.getDate()
if(day.length == 1) {day = '0' + day}
let storedDate
const forDate = `${year}-${month}-${day}`

//Page Loads
document.addEventListener('DOMContentLoaded',async()=>{
    if(!date.value)
        date.value = forDate
    else
        date.value= sessionStorage.getItem('storedDate')
    //date.value = forDate
    viewAction.click()
})

//Date View
viewAction.addEventListener("click", async() =>{  
    let selectedDate  = date.value

    if(!selectedDate){
        alert("Choose a Date to Dislpay")
        return;
    }
    try{
        const response = await fetch(`${url}/tracker/display/${selectedDate}T00:00:00.000+00:00`,{
            method:'GET'
        })
        if(!response.ok){
            VDMessage.textContent= `Error Fetching... ${response.statusText}`
        }
        const result = await response.json()
       
       const tracker = result.data.tracker
        
        trackerData.innerHTML = `
            <h5>Required
            <table border='1'>
            <tr>
                <td>Calories</td>
                <td>Carbs</td>
                <td>Protien</td>
                <td>Fat</td>
            </tr>
            <tr>
                <td>${Math.round(tracker.required.calories)}</td>
                <td>${Math.round(tracker.required.carb)}</td>
                <td>${Math.round(tracker.required.protien)}</td>
                <td>${Math.round(tracker.required.fat)}</td>
            </tr>
            </h5>

            </table > 
            <h5>Eaten
            <table border='1'>
            <tr>
                <td>Calories</td>
                <td>Carbs</td>
                <td>Protien</td>
                <td>Fat</td>
            </tr>
            <tr>
                <td>${tracker.eaten.calories}</td>
                <td>${tracker.eaten.carb}</td>
                <td>${tracker.eaten.protien}</td>
                <td>${tracker.eaten.fat}</td>
            </tr>
            </h5>

            </table> 
        `
    }
    catch(e){
        VDMessage.textContent = `${e.message} ✗`
    }
        
        try{
        document.getElementById('Food Menu').hidden = false
        const fooddbFetch = await fetch(`${url}/food/getAllFoods`)
        const fdFetchResult = await fooddbFetch.json()
        const fooddb = fdFetchResult.data

        foodSelect.innerHTML=''
        fooddb.food.forEach(food => {
            let foodOp = document.createElement("option")
            foodOp.value=food.name
            foodSelect.appendChild(foodOp)
        });

        document.getElementById("Exercise Menu").hidden= false
        const exerDBFetch = await fetch(`${url}/exercise/showAllExercises`)
        const exerDbResult = await exerDBFetch.json()
        const exerData = exerDbResult.data
        exerciseSelect.innerHTML=''
        
        
        exerData.forEach(exer =>{
            let exerOp = document.createElement("option") 
            exerOp.value=exer.name
            exerciseSelect.appendChild(exerOp)
        })

    
    }catch(e){
        resMessage.textContent= `Error:${e.message} ✗`
    }
    
})

//Eat API
document.getElementById("EatAPI").addEventListener("submit", async function(event){
    event.preventDefault()
    try{
    const formEntires = new FormData(this)
    const eatData = Object.fromEntries(formEntires.entries())
    
    eatData.date = `${date.value}T00:00:00.000+00:00`
    const response = await fetch(`${url}/tracker/eat`,{
        method:"POST",
        body:JSON.stringify(eatData),
        headers:{
            'Content-Type':'application/json'
        }
    })

    if(response.ok){
        resMessage.textContent='Food Eaten ✔\n3...2...1'
    }

    } catch(e){
        resMessage.textContent = `Error:${e.message} ✗`
    }
    sessionStorage.setItem('storedDate',date.value)
    console.log("sessionStorage.getItem('storedDate')",sessionStorage.getItem('storedDate'))
    setTimeout(()=>{location.reload()},2000)

})

//Exercise API
document.getElementById("ExersiceAPI").addEventListener("submit",async function(event){
    event.preventDefault()
    try{
    const exerForm = new FormData(this)
    const exerBody = Object.fromEntries(exerForm.entries())
    exerBody.date = `${date.value}T00:00:00.000+00:00`
    exerBody.duration /=60
    const exerFetch = await fetch(`${url}/tracker/exercise`,{
        method:'POST',
        body: JSON.stringify(exerBody),
        headers:{
            'Content-Type':'application/json'
        }
    }) 
    if(exerFetch.ok){
        resMessage.textContent = `Exercise Tracker ✔` 
        sessionStorage.setItem("storedDate",date.value)
        setTimeout(()=>{location.reload()},1500)
    }
    
    } catch(e){
        resMessage.textContent = `Error:${e.message} ✗`   
    }

})