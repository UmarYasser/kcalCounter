url = "https://kcalcounter.onrender.com/api/v1"
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
const tBodyBF = document.getElementById("food-listBF")
const tBodyLch = document.getElementById("food-listLch")
const tBodyDn = document.getElementById("food-listDn")
const tBodySck = document.getElementById("food-listSck")
const xMark ='<i class="fa-solid fa-square-xmark fa-xl"></i>'

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
        document.getElementById("loadercon").style.display = "none"
    

       tracker = result.data.tracker
       loading = document.getElementsByClassName("loading") 
       
       for(let i = 0;i < loading.length;i++){
            console.log(loading[i])
           loading[i].hidden = false
           
        }


       document.getElementById('gradCircle').style["stroke-dashoffset"] = 450 - (450*(tracker.eaten.calories / tracker.required.calories ))
       document.getElementById('carbs').textContent = `${tracker.eaten.carb} / ${tracker.required.carb}gm`
       document.getElementById('pros').textContent = `${tracker.eaten.protien} / ${tracker.required.protien}gm`
       document.getElementById('fats').textContent = `${tracker.eaten.fat} / ${tracker.required.fat}gm`
       document.getElementById('remaining1').textContent = `${tracker.diet.dailyIntake}`
       document.getElementById('eaten').textContent = `${tracker.eaten.calories}`
       document.getElementById('burned').textContent = `${tracker.exerBurned}`
       
        if( tracker.required.calories - tracker.eaten.calories  >=0)
            document.getElementsByClassName('remaining2')[0].innerHTML = `<b>${tracker.required.calories - tracker.eaten.calories} \n</b> Remaining`
        else
            document.getElementsByClassName('remaining2')[0].textContent = `<b>${tracker.eaten.calories - tracker.required.calories} \n</b>Over`

        document.getElementById("MCcontainer").style.display = 'flex'


        
        //-------- Breakfast ----------

        document.getElementById("BFfoodsBtn").hidden = false
        document.getElementById("BfRange").innerText = `${tracker.meals.Breakfast.minrange}-${tracker.meals.Breakfast.maxrange}kcal`

        // Totals Vars.
        let TgmsBF = TcalBF = TcarbBF = TproBF = TfatBF = 0
        tracker.meals.Breakfast.foods.forEach(li=>{
            document.getElementById("ifEmptyBF").hidden = true
            
            tBodyBF.innerHTML +=`
                <tr>
                    <td class="foodNameTb">${li.food.name}</td>
                    <td>${li.grams}</td>
                    <td>${li.food.calories * li.grams}</td>
                    <td>${Math.round(li.food.carb  * li.grams)}</td>
                    <td>${Math.round(li.food.protien * li.grams)}</td>
                    <td>${Math.round(li.food.fat * li.grams)}</td>
                </tr>
            `
            TgmsBF +=li.grams
            TcalBF +=li.grams * li.food.calories
            TcarbBF +=Math.round( li.grams * li.food.carb)
            TproBF +=Math.round( li.grams * li.food.protien)
            TfatBF +=Math.round( li.grams * li.food.fat)
            
        })

        document.getElementById("TgmsBF").innerText =TgmsBF
        document.getElementById("TcalBF").innerText =TcalBF 
        document.getElementById("TcarbBF").innerText =TcarbBF +'gm'
        document.getElementById("TproBF").innerText =TproBF +'gm'
        document.getElementById("TfatBF").innerText =TfatBF +'gm'
        
        document.getElementById("Breakfast").style.display = 'block'
        //BF-------------
        // ------- Lunch -------
        document.getElementById("LchRange").innerText = `${tracker.meals.Lunch.minrange}-${tracker.meals.Lunch.maxrange}kcal`
        // Totals Vars.
        let TgmsLch = TcalLch = TcarbLch = TproLch = TfatLch = 0
        tracker.meals.Lunch.foods.forEach(li=>{
            document.getElementById("ifEmptyLch").hidden = true
            
            tBodyLch.innerHTML +=`
                <tr>
                    <td class="foodNameTb">${li.food.name}</td>
                    <td>${li.grams}</td>
                    <td>${li.food.calories * li.grams}</td>
                    <td>${Math.round(li.food.carb  * li.grams)}</td>
                    <td>${Math.round(li.food.protien * li.grams)}</td>
                    <td>${Math.round(li.food.fat * li.grams)}</td>
                </tr>
            `
            TgmsLch +=li.grams
            TcalLch +=li.grams * li.food.calories
            TcarbLch +=Math.round( li.grams * li.food.carb)
            TproLch +=Math.round( li.grams * li.food.protien)
            TfatLch +=Math.round( li.grams * li.food.fat)
            
        })

        document.getElementById("TgmsLch").innerText =TgmsLch
        document.getElementById("TcalLch").innerText =TcalLch 
        document.getElementById("TcarbLch").innerText =TcarbLch +'gm'
        document.getElementById("TproLch").innerText =TproLch +'gm'
        document.getElementById("TfatLch").innerText =TfatLch +'gm'

        document.getElementById("Lunch").style.display = 'block'
        // Lch--------
        // ------- Dinner ------

        document.getElementById("DnRange").innerText = `${tracker.meals.Dinner.minrange}-${tracker.meals.Dinner.maxrange}kcal`
        // Totals Vars.
        let TgmsDn = TcalDn = TcarbDn = TproDn = TfatDn = 0

        tracker.meals.Dinner.foods.forEach(foodEle =>{
            document.getElementById("ifEmptyDn").hidden = true

            tBodyDn.innerHTML =`
                <tr>
                    <td class="foodNameTb">${foodEle.food.name}</td>
                    <td>${foodEle.grams}</td>
                    <td>${foodEle.food.calories * foodEle.grams}</td>
                    <td>${Math.round(foodEle.food.carb  * foodEle.grams)}</td>
                    <td>${Math.round(foodEle.food.protien * foodEle.grams)}</td>
                    <td>${Math.round(foodEle.food.fat * foodEle.grams)}</td>
                </tr>
            `
            TgmsDn += foodEle.grams
            TcalDn += foodEle.food.calories * foodEle.grams
            TcarbDn += Math.round( foodEle.food.carb * foodEle.grams)
            TproDn += Math.round( foodEle.food.protien * foodEle.grams)
            TfatDn += Math.round( foodEle.food.fat * foodEle.grams)
        })
        document.getElementById("TgmsDn").innerText = TgmsDn
        document.getElementById("TcalDn").innerText = TcalDn
        document.getElementById("TcarbDn").innerText = TcarbDn +'gm'
        document.getElementById("TproDn").innerText = TproDn +'gm'
        document.getElementById("TfatDn").innerText = TfatDn +'gm'
        
        document.getElementById("Dinner").style.display = 'block'
        //Dn----------
        // ---------- Snacks -----------
        document.getElementById("SckRange").innerText = `${tracker.meals.Snacks.minrange}-${tracker.meals.Snacks.maxrange}kcal`

        let TgmsSck = TcalSck = TcarbSck = TproSck = TfatSck = 0

        tracker.meals.Snacks.foods.forEach(foodEle =>{
            document.getElementById("ifEmptySck").hidden = true

            tBodySck.innerHTML =`
                <tr>
                    <td class="foodNameTb">${foodEle.food.name}</td>
                    <td>${foodEle.grams}</td>
                    <td>${foodEle.food.calories * foodEle.grams}</td>
                    <td>${Math.round(foodEle.food.carb  * foodEle.grams)}</td>
                    <td>${Math.round(foodEle.food.protien * foodEle.grams)}</td>
                    <td>${Math.round(foodEle.food.fat * foodEle.grams)}</td>
                </tr>
            `
            TgmsSck += foodEle.grams
            TcalSck += foodEle.food.calories * foodEle.grams
            TcarbSck += Math.round( foodEle.food.carb * foodEle.grams)
            TproSck += Math.round( foodEle.food.protien * foodEle.grams)
            TfatSck += Math.round( foodEle.food.fat * foodEle.grams)
        })
        document.getElementById("TgmsSck").innerText = TgmsSck
        document.getElementById("TcalSck").innerText = TcalSck
        document.getElementById("TcarbSck").innerText = TcarbSck +'gm'
        document.getElementById("TproSck").innerText = TproSck +'gm'
        document.getElementById("TfatSck").innerText = TfatSck +'gm'

        document.getElementById("Snacks").style.display = 'block'

        // Dinner.innerHTML=`
        //     <table border='1'> 
        //         <caption>~~Dinner~~</caption>
        //         <thead>
        //         <td colspan='4' align='center'>Calories</td>
        //     </thead>
        //     <tr>

        //         <td colspan='4' align='center'>Min ${Math.round(tracker.meals.Dinner.minrange)} / ${tracker.meals.Dinner.maxrange} Max</td>
        //     </tr>
        //     <tr> 
        //     <td>Calories</td>
        //         <td>Carbs</td>
        //         <td>Protien</td>
        //         <td>Fat</td>   
        //     </tr>
        //     <tr>
        //         <td align='center'>${Math.round(tracker.meals.Dinner.calories)} <br>kcal</td>
        //         <td align='center'>${Math.round(tracker.meals.Dinner.carb)} <br> gm</td>
        //         <td align='center'>${Math.round(tracker.meals.Dinner.protien)} <br> gm</td>
        //         <td align='center'>${Math.round(tracker.meals.Dinner.fat)} <br> gm</td>
        //     </tr>
        //     </table>
            
        // `
        // document.getElementById("DNfoodsBtn").hidden = false
        // if(tracker.meals.Dinner.foods.length!=0)
        //     document.getElementById('DNfoods').innerHTML=''
        
        // tracker.meals.Dinner.foods.forEach(li=>{
        //     let Li = document.createElement('li')
        //     Li = `${li.foodName}, ${li.grams}gm`
        //        document.getElementById("DNfoods").innerHTML += `
        //     <li>
        //         ${Li}
        //         <ul class = 'nutCard'>
        //             <li>Per ${li.grams}gm</li>
        //             <li>Calories: 100</li>
        //             <li>Carbs: 200gm</li>
        //             <li>Protien: 200gm</li>
        //             <li>Fat: 200gm</li>
        //         </ul>
        //     </li>
        //     `
        // })
        //---------------------
        // Snacks.innerHTML=`
        //     <table border='1'> 
        //         <caption>Snacks</caption>
        //         <thead>
        //         <td colspan='4' align='center'>Calories</td>
        //     </thead>
        //     <tr>

        //         <td colspan='4' align='center'>Min ${Math.round(tracker.meals.Snacks.minrange)} / ${tracker.meals.Snacks.maxrange} Max</td>
        //     </tr>
        //     <tr> 
        //     <td>Calories</td>
        //         <td>Carbs</td>
        //         <td>Protien</td>
        //         <td>Fat</td>   
        //     </tr>
        //     <tr>
        //         <td align='center'>${Math.round(tracker.meals.Snacks.calories)}<br> kcal</td>
        //         <td align='center'>${Math.round(tracker.meals.Snacks.carb)} <br>gm</td>
        //         <td align='center'>${Math.round(tracker.meals.Snacks.protien)} <br>gm</td>
        //         <td align='center'>${Math.round(tracker.meals.Snacks.fat)} <br>gm</td>
        //     </tr>
        //     </table>
        
        // `
        // document.getElementById("SCkfoodsBtn").hidden = false
        // if(tracker.meals.Snacks.foods.length!=0)
        //     document.getElementById('SCkfoods').innerHTML=''
        // tracker.meals.Snacks.foods.forEach(li=>{
        //     let Li = document.createElement('li')
        //     Li = `${li.foodName}, ${li.grams}gm`
        //        document.getElementById("SCkfoods").innerHTML += `
        //     <li>
        //         ${Li}
        //         <ul class = 'nutCard'>
        //             <li>Per ${li.grams}gm</li>
        //             <li>Calories: 100gm</li>
        //             <li>Carbs: 200gm</li>
        //             <li>Protien: 200gm</li>
        //             <li>Fat: 200gm</li>
        //         </ul>
        //     </li>
        //     `
        // })

        const bars = document.getElementsByClassName("pro")
        document.getElementById("Meals").style.display = 'flex'
        
    for ( let i =0;i <bars.length;i++){
        switch(i){
            case 0:
                bars[i].style.width = ((tracker.eaten.carb / tracker.required.carb) *100) + '%'
                break;
            case 1:
                bars[i].style.width = ((tracker.eaten.protien / tracker.required.protien) *100 ) + '%'
                break;
            case 2:
                bars[i].style.width = ((tracker.eaten.fat / tracker.required.fat) *100) +'%'
                break;
        }
}
    }
    catch(e){
        VDMessage.textContent = `${e.message} ${xMark}`
    }
        
    try{
        // // document.getElementById('Food Menu').hidden = false
        // const fooddbFetch = await fetch(`${url}/food/getAllFoods`)
        // const fdFetchResult = await fooddbFetch.json()
        // const fooddb = fdFetchResult.data

        // foodSelect.innerHTML=''
        // fooddb.food.forEach(food => {
        //     let foodOp = document.createElement("option")
        //     foodOp.value=food.name
        //     foodSelect.appendChild(foodOp)
        // });

        // // document.getElementById("Exercise Menu").hidden= false
        // const exerDBFetch = await fetch(`${url}/exercise/showAllExercises`)
        // const exerDbResult = await exerDBFetch.json()
        // const exerData = exerDbResult.data
        // exerciseSelect.innerHTML=''
        
        
        // exerData.forEach(exer =>{
        //     let exerOp = document.createElement("option") 
        //     exerOp.value=exer.name
        //     exerciseSelect.appendChild(exerOp)
        // })

        // if(tracker.exercise.length !=0)
        //     document.getElementById("trackedExercise").innerHTML = ''
        // tracker.exercise.forEach(exer=>{
        //     let Li = document.createElement('li')
        //     Li = `${exer.name,exer.duration}`
        //     document.getElementById("trackedExercise").innerHTML+=`
        //         <li>${exer.name}, ${exer.duration}mins
        //             <ul class="nutCard">
        //                 <li>${exer.name} for ${exer.duration}mins</li>
        //                 <li>Added Calories: ${exer.calories}kcal</li>
        //                 <li>Added Carbs: ${exer.carb}gm</li>
        //                 <li>Added Fat: ${exer.fat}gm</li>
        //             </ul>
        //         </li>
        //     `
        // })
        // document.getElementById("trackedExerciseBtn").hidden = false
    
    }catch(e){
        resMessage.textContent= `Error:${e.message} ${xMark}`
    }
    
})


let foodListBf = document.getElementById("food-listBF")
document.getElementById("BFfoodsBtn").addEventListener("click",(event)=>{
    event.preventDefault()
    document.getElementById("food-listBF").hidden = document.getElementById("food-listBF").hidden == true ? false : true
    document.getElementById("dotsBf").hidden = document.getElementById("dotsBf").hidden == true ? false : true
    document.getElementById("arrowUpBf").style.display = document.getElementById("arrowUpBf").style.display == 'none' ? 'block' : 'none'
    document.getElementById("arrowDownBf").style.display = document.getElementById("arrowDownBf").style.display == 'none' ? 'block' : 'none'
    
    console.log(foodListBf)
    console.log(foodListBf.rows.length)
    if(foodListBf.rows.length > 4){
        foodListBf.style.overflowY = 'scroll'
        foodListBf.style.maxHeight = '145px'
    }else{
        foodListBf.style.overflowY = 'hidden'
        foodListBf.style.maxHeight = 'none'

    }
    console.log(foodListBf.style.height)

})

document.getElementById("LchfoodsBtn").addEventListener("click",(event)=>{
    event.preventDefault()
    document.getElementById("food-listLch").hidden = document.getElementById("food-listLch").hidden == true ? false : true
    document.getElementById("dotsLch").hidden = document.getElementById("dotsLch").hidden == true ? false : true
    document.getElementById("arrowUpLch").style.display = document.getElementById("arrowUpLch").style.display == 'none' ? 'block' : 'none'
    document.getElementById("arrowDownLch").style.display = document.getElementById("arrowDownLch").style.display == 'none' ? 'block' : 'none'
    
})

document.getElementById("DnfoodsBtn").addEventListener("click",(event)=>{
    event.preventDefault()
    document.getElementById("food-listDn").hidden = document.getElementById("food-listDn").hidden == true ? false : true
    document.getElementById("dotsDn").hidden = document.getElementById("dotsDn").hidden == true ? false : true
    document.getElementById("arrowUpDn").style.display = document.getElementById("arrowUpDn").style.display == 'none' ? 'block' : 'none'
    document.getElementById("arrowDownDn").style.display = document.getElementById("arrowDownDn").style.display == 'none' ? 'block' : 'none'
    
})

document.getElementById("SckfoodsBtn").addEventListener("click",(event)=>{
    event.preventDefault()
    document.getElementById("food-listSck").hidden = document.getElementById("food-listSck").hidden == true ? false : true
    document.getElementById("dotsSck").hidden = document.getElementById("dotsSck").hidden == true ? false : true
    document.getElementById("arrowUpSck").style.display = document.getElementById("arrowUpSck").style.display == 'none' ? 'block' : 'none'
    document.getElementById("arrowDownSck").style.display = document.getElementById("arrowDownSck").style.display == 'none' ? 'block' : 'none'
    

})

//----------------

// document.getElementById("LChfoodsBtn").addEventListener("click",(event)=>{
//     event.preventDefault()
//     document.getElementById("LChfoods").hidden = document.getElementById("LChfoods").hidden == true ? false : true
// })

// document.getElementById("DNfoodsBtn").addEventListener("click",(event)=>{
//     event.preventDefault()
//     document.getElementById("DNfoods").hidden = document.getElementById("DNfoods").hidden == true ? false : true
// })

// document.getElementById("SCkfoodsBtn").addEventListener("click",(event)=>{
//     event.preventDefault()
//     document.getElementById("SCkfoods").hidden = document.getElementById("SCkfoods").hidden == true ? false : true
// })

// document.getElementById("trackedExerciseBtn").addEventListener("click",(event)=>{
//     event.preventDefault()
//     document.getElementById("trackedExercise").hidden = document.getElementById("trackedExercise").hidden == true ? false : true
// })

//Logging Out
document.getElementById("loggedOut").addEventListener("click", async(event)=>{
    event.preventDefault()
    try{
        const response = await fetch(`${url}/auth/logOut`, {
            method: "POST",
            headers: { "Content-Type": 'application/json'}
        })

        const result = await response.json()
        console.log(result)
        if(response.ok){
            console.log("Log Out Sccessful")
            setTimeout(()=>{
                window.location.href= "./logIn"
            }, 1000)
        }
    }catch(e){
        resMes.textContent = `Error Fetching: ${e.message} `
    }
})

document.getElementById("viewTracker").addEventListener('click', function(e){
    sessionStorage.setItem("storedDate",date.value)
})
