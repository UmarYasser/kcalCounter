url = "https://expert-tribble-jv7qv746jvw2v7v-3000.app.github.dev/api/v1"
const date= document.getElementById("dateInput")
const viewAction = document.getElementById("viewTracker")
const VDMessage= document.getElementById('viewDateMessage')
let trackerData =document.getElementById('trackerData')
const exerciseSelect = document.getElementById("exerciseSelect")
const foodSelect= document.getElementById("foodSelect")
const ReqEaten = document.getElementById("ReqEaten")
const Breakfast = document.getElementById("Breakfast")
const Lunch = document.getElementById("Lunch")
const Dinner = document.getElementById("Dinner")
const Snacks = document.getElementById("Snacks")

let tracker;
let resMessage = document.getElementById("responseMessage")

const today = new Date()
const year = today.getFullYear()

let month = String(today.getMonth() +1)
if(month.length==1) {month = '0' +month}

let day = String(today.getDate())
if(day.length == 1) {day = '0' + day}
let storedDate
const forDate = `${year}-${month}-${day}`

//Page Loads
document.addEventListener('DOMContentLoaded',async()=>{
    if(sessionStorage.getItem('storedDate') == "undefined"){
        sessionStorage.setItem('storedDate',forDate)
    }    
    date.value= sessionStorage.getItem('storedDate')  
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
       
       tracker = result.data.tracker
        
        ReqEaten.innerHTML = `
            
            <table border='1'>
              <caption>Eaten / Required</caption
            <thead>
                <td>Calories</td>
                <td>Carbs</td>
                <td>Protien</td>
                <td>Fat</td>
            </thead>
            <tr>

                <td align='center'> ${Math.round(tracker.eaten.calories)} / ${tracker.required.calories}  <br>kcal</td>
                <td align='center'> ${Math.round(tracker.eaten.carb)} / ${tracker.required.carb}  <br> gm</td>
                <td align='center'> ${Math.round(tracker.eaten.protien)} / ${tracker.required.protien}  <br> gm</td>
                <td align='center'> ${Math.round(tracker.eaten.fat)} / ${tracker.required.fat}  <br> gm</td>
            </tr>
            <tr> 
                <td colspan='4' align='center'>Remaining</td>
            </tr>
            <tr>
                <td align='center'>${Math.round(tracker.required.calories)- tracker.eaten.calories} <br>kcal</td>
                <td align='center'>${Math.round(tracker.required.carb)- tracker.eaten.carb} <br> gm</td>
                <td align='center'>${Math.round(tracker.required.protien) -tracker.eaten.protien} <br> gm</td>
                <td align='center'>${Math.round(tracker.required.fat)- tracker.eaten.fat} <br> gm</td>
            </tr>

            </table>
        `

        Breakfast.innerHTML =`
            <table border='1'> 
                <caption>~~Breakfast~~</caption>
                <thead>
                <td colspan='4' align='center'>Calories</td>
            </thead>
            <tr>

                <td colspan='4' align='center'>Min ${Math.round(tracker.meals.Breakfast.minrange)} / ${tracker.meals.Breakfast.maxrange} Max</td>
            </tr>
            <tr> 
            <td>Calories</td>
                <td>Carbs</td>
                <td>Protien</td>
                <td>Fat</td>   
            </tr>
            <tr>
                <td align='center'>${Math.round(tracker.meals.Breakfast.calories)} <br>kcal</td>
                <td align='center'>${Math.round(tracker.meals.Breakfast.carb)} <br> gm</td>
                <td align='center'>${Math.round(tracker.meals.Breakfast.protien)} <br> gm</td>
                <td align='center'>${Math.round(tracker.meals.Breakfast.fat)} <br> gm</td>
            </tr>
            </table>
           
        `

        document.getElementById("BFfoodsBtn").hidden = false

        if(tracker.meals.Breakfast.foods.length != 0){
            document.getElementById('BFfoods').innerHTML=''
        }

        tracker.meals.Breakfast.foods.forEach(li=>{
            let Li = document.createElement('li')
            Li = `${li.foodName}, ${li.grams}gm`
            
        document.getElementById("BFfoods").innerHTML += `
            <li>
                ${Li}
                <ul class = 'nutCard'>
                    <li>Per ${li.grams}gm</li>
                    <li>Calories: 100kcal</li>
                    <li>Carbs: 200gm</li>
                    <li>Protien: 200gm</li>
                    <li>Fat: 200gm</li>
                </ul>
            </li>
            `
        })
        
        //-------------
        Lunch.innerHTML=`
            <table border='1'> 
                <caption>~~Lunch~~</caption>
                <thead>
                <td colspan='4' align='center'>Calories</td>
            </thead>
            <tr>
                <td colspan='4' align='center'>Min ${Math.round(tracker.meals.Lunch.minrange)} / ${tracker.meals.Lunch.maxrange} Max</td>
            </tr>
            <tr> 
            <td>Calories</td>
                <td>Carbs</td>
                <td>Protien</td>
                <td>Fat</td>   
            </tr>
            <tr>
                <td align='center'>${Math.round(tracker.meals.Lunch.calories)} <br>kcal</td>
                <td align='center'>${Math.round(tracker.meals.Lunch.carb)} <br> gm</td>
                <td align='center'>${Math.round(tracker.meals.Lunch.protien)} <br> gm</td>
                <td align='center'>${Math.round(tracker.meals.Lunch.fat)} <br> gm</td>
            </tr>
            </table>
        
        `
        document.getElementById("LChfoodsBtn").hidden = false
        if(tracker.meals.Lunch.foods.length !=0){
            document.getElementById('LChfoods').innerHTML=''
        }
        tracker.meals.Lunch.foods.forEach(li=>{
            let Li = document.createElement('li')
            Li = `${li.foodName}, ${li.grams}gm`
             document.getElementById("LChfoods").innerHTML += `
            <li>
                ${Li}
                <ul class = 'nutCard'>
                    <li>Per ${li.grams}gm</li>
                    <li>Calories: 100kcal</li>
                    <li>Carbs: 200gm</li>
                    <li>Protien: 200gm</li>
                    <li>Fat: 200gm</li>
                </ul>
            </li>
            `
        })

        //--------
        Dinner.innerHTML=`
            <table border='1'> 
                <caption>~~Dinner~~</caption>
                <thead>
                <td colspan='4' align='center'>Calories</td>
            </thead>
            <tr>

                <td colspan='4' align='center'>Min ${Math.round(tracker.meals.Dinner.minrange)} / ${tracker.meals.Dinner.maxrange} Max</td>
            </tr>
            <tr> 
            <td>Calories</td>
                <td>Carbs</td>
                <td>Protien</td>
                <td>Fat</td>   
            </tr>
            <tr>
                <td align='center'>${Math.round(tracker.meals.Dinner.calories)} <br>kcal</td>
                <td align='center'>${Math.round(tracker.meals.Dinner.carb)} <br> gm</td>
                <td align='center'>${Math.round(tracker.meals.Dinner.protien)} <br> gm</td>
                <td align='center'>${Math.round(tracker.meals.Dinner.fat)} <br> gm</td>
            </tr>
            </table>
            
        `
        document.getElementById("DNfoodsBtn").hidden = false
        if(tracker.meals.Dinner.foods.length!=0)
            document.getElementById('DNfoods').innerHTML=''
        
        tracker.meals.Dinner.foods.forEach(li=>{
            let Li = document.createElement('li')
            Li = `${li.foodName}, ${li.grams}gm`
               document.getElementById("DNfoods").innerHTML += `
            <li>
                ${Li}
                <ul class = 'nutCard'>
                    <li>Per ${li.grams}gm</li>
                    <li>Calories: 100</li>
                    <li>Carbs: 200gm</li>
                    <li>Protien: 200gm</li>
                    <li>Fat: 200gm</li>
                </ul>
            </li>
            `
        })
        //---------------------
        Snacks.innerHTML=`
            <table border='1'> 
                <caption>Snacks</caption>
                <thead>
                <td colspan='4' align='center'>Calories</td>
            </thead>
            <tr>

                <td colspan='4' align='center'>Min ${Math.round(tracker.meals.Snacks.minrange)} / ${tracker.meals.Snacks.maxrange} Max</td>
            </tr>
            <tr> 
            <td>Calories</td>
                <td>Carbs</td>
                <td>Protien</td>
                <td>Fat</td>   
            </tr>
            <tr>
                <td align='center'>${Math.round(tracker.meals.Snacks.calories)}<br> kcal</td>
                <td align='center'>${Math.round(tracker.meals.Snacks.carb)} <br>gm</td>
                <td align='center'>${Math.round(tracker.meals.Snacks.protien)} <br>gm</td>
                <td align='center'>${Math.round(tracker.meals.Snacks.fat)} <br>gm</td>
            </tr>
            </table>
        
        `
        document.getElementById("SCkfoodsBtn").hidden = false
        if(tracker.meals.Snacks.foods.length!=0)
            document.getElementById('SCkfoods').innerHTML=''
        tracker.meals.Snacks.foods.forEach(li=>{
            let Li = document.createElement('li')
            Li = `${li.foodName}, ${li.grams}gm`
               document.getElementById("SCkfoods").innerHTML += `
            <li>
                ${Li}
                <ul class = 'nutCard'>
                    <li>Per ${li.grams}gm</li>
                    <li>Calories: 100gm</li>
                    <li>Carbs: 200gm</li>
                    <li>Protien: 200gm</li>
                    <li>Fat: 200gm</li>
                </ul>
            </li>
            `
        })
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

        if(tracker.exercise.length !=0)
            document.getElementById("trackedExercise").innerHTML = ''
        tracker.exercise.forEach(exer=>{
            let Li = document.createElement('li')
            Li = `${exer.name,exer.duration}`
            document.getElementById("trackedExercise").innerHTML+=`
                <li>${exer.name}, ${exer.duration}mins
                    <ul class="nutCard">
                        <li>${exer.name} for ${exer.duration}mins</li>
                        <li>Added Calories: ${exer.calories}kcal</li>
                        <li>Added Carbs: ${exer.carb}gm</li>
                        <li>Added Fat: ${exer.fat}gm</li>
                    </ul>
                </li>
            `
        })
        document.getElementById("trackedExerciseBtn").hidden = false
    
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
        sessionStorage.setItem('storedDate', date.value)
        const response = await fetch(`${url}/tracker/eat`,{
            method:"POST",
            body:JSON.stringify(eatData),
            headers:{
                'Content-Type':'application/json'
            }
        })

        if(response.ok){
            resMessage.textContent='Food Eaten ✔'
            sessionStorage.setItem('storedDate',date.value)
            
            const item = document.createElement('li')
            item.textContent = `${eatData.foodName}, ${eatData.grams}gm`
            switch(eatData.meal){
                case 'Breakfast':
                    document.getElementById("BFfoods").appendChild(item)
                break;
                case 'Lunch':
                    document.getElementById("LChfoods").appendChild(item)
                break;
                case 'Dinner':
                    document.getElementById("DNfoods").appendChild(item)
                break;
                case 'Snacks':
                    document.getElementById("SCkfoods").appendChild(item)
                break;
            }

            setTimeout(()=>{location.reload()},2000)
        }else{
            const result = await response.json()
            resMessage.textContent = `Error:${result.message} ✗`
        } 
        
    } catch(e){
    }

})

//Exercise API
document.getElementById("ExersiceAPI").addEventListener("submit",async function(event){
    event.preventDefault()
    try{
    const exerForm = new FormData(this)
    const exerBody = Object.fromEntries(exerForm.entries())
    exerBody.date = `${date.value}T00:00:00.000+00:00`
    sessionStorage.setItem('storedDate',date.value)
    exerBody.duration /=60
    const exerFetch = await fetch(`${url}/tracker/exercise`,{
        method:'POST',
        body: JSON.stringify(exerBody),
        headers:{
            'Content-Type':'application/json'
        }
    }) 
    if(exerFetch.ok){
        resMessage.textContent = `Exercise Tracked ✔` 
        sessionStorage.setItem("storedDate",date.value)
        setTimeout(()=>{location.reload()},1500)
    }
    
    } catch(e){
        resMessage.textContent = `Error:${e.message} ✗`   
    }
})

//View Tracked Foods
document.getElementById("BFfoodsBtn").addEventListener("click",(event)=>{
    event.preventDefault()
    document.getElementById("BFfoods").hidden = document.getElementById("BFfoods").hidden == true ? false : true

})

document.getElementById("LChfoodsBtn").addEventListener("click",(event)=>{
    event.preventDefault()
    document.getElementById("LChfoods").hidden = document.getElementById("LChfoods").hidden == true ? false : true
})

document.getElementById("DNfoodsBtn").addEventListener("click",(event)=>{
    event.preventDefault()
    document.getElementById("DNfoods").hidden = document.getElementById("DNfoods").hidden == true ? false : true
})

document.getElementById("SCkfoodsBtn").addEventListener("click",(event)=>{
    event.preventDefault()
    document.getElementById("SCkfoods").hidden = document.getElementById("SCkfoods").hidden == true ? false : true
})

document.getElementById("trackedExerciseBtn").addEventListener("click",(event)=>{
    event.preventDefault()
    document.getElementById("trackedExercise").hidden = document.getElementById("trackedExercise").hidden == true ? false : true
})