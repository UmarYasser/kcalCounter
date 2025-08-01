const url = "https://97p7tnf4-3000.uks1.devtunnels.ms"
const foodSelect= document.getElementById("foodSelect")
const foodSearch = document.getElementById("foodSearch")
const liveSearchFood = document.getElementById("liveSearchFood")
const exerciseSearch = document.getElementById("exerciseSearch")
const liveSearchExercise = document.getElementById("liveSearchExercise")
const fEContainer = document.getElementById("Container")
const xMark ='<i class="fa-solid fa-circle-xmark"></i>'
const checkMark = `<i class="fa-solid fa-circle-check"></i>`
const glass = `<i class="fa-solid fa-glass-water water" ></i>`
const glassEmpty = `<i class="fa-solid fa-glass-water-droplet" ></i>`
const waterTracker = document.getElementById("waterTracker")
const glassesContainer = document.getElementById("glassesContainer")
const emptyOne = document.getElementById("emptyOne")

let resMessage = document.getElementById("responseMessage")

let nutCard = document.getElementById("nutCard")
let foodNameNutCard = document.getElementById("foodName")
let foodCalories = document.getElementById("foodCalories")
let foodCarbs = document.getElementById("foodCarbs")
let foodProtien = document.getElementById("foodProtein")
let foodFat = document.getElementById("foodFat")
let foodGrams = document.getElementById("foodGrams") // in the NutCard
let gramsInput = document.getElementById("grams")  // The input Field
let properties = document.getElementById("properties")
let positives = document.getElementById("positives")
let negatives = document.getElementById("negatives")

let exeName = document.getElementById("exerciseName")
let exeDuration = document.getElementById("exeDuration") // in the exeCard
let durationInput = document.getElementById("duration")// The input Field
let burnedCals = document.getElementById("burnedCals")


let waterValue = document.getElementById("waterValue")
let targetValue = document.getElementById("targetValue")
//From the back-end ⭐
// waterValue.innerText = 1.5
// targetValue.innerText = 3
let waterIntake

let drunkTarget = false
//These vars. are made global so they can be called in another scope (another eventListeners)
let findResultGlo
let foodSelectedGlo
let foodResultGlo

let exerciseResultGlo
let exeFindResultGlo
let exerciseSelectedGlo
let trackerResultGlo
let date = `${sessionStorage.getItem("storedDate")}T00:00:00.000+00:00`
let contentLoaded = true
//Water
const updateWater = async function(){
    try{

        const trackerFetch = await fetch(`${url}/api/v1/tracker/display/${date}`,{
            method:"GET",
        headers:{
            'Content-Type':'application/json'
        }
    })
    const trackerResult = await trackerFetch.json()
    trackerResultGlo = trackerResult
    waterIntake = trackerResult.data.tracker.required.water
    targetValue.innerText = waterIntake
    }catch(e){
        console.error(`Error in updateWater: ${e.message}`)
    }

}
updateWater()
//Just when the page loads, not called every time the fn is called
// A breif delay until the trackerFetch is done.
document.getElementById("emptyOne").style.display = 'none'
setTimeout(() =>{
    if(trackerResultGlo)
        waterValue.innerText = trackerResultGlo.data.tracker.eaten.water
    
    for(let i =0; i <parseInt(waterValue.innerText)*2;i++){
        glassesContainer.innerHTML += glass
        emptyOne.before(glass)
    }
    const glasses = Array.from(glassesContainer.children)
    let lastGlass = glassesContainer.children[glassesContainer.children.length-1]
    lastGlass.after(emptyOne)
    // glassesContainer.removeChild(document.querySelector("#emptyOne"))
    document.getElementById("waterLoader").style.display = 'none'
    document.getElementById("glassesContainer").style.display = 'flex'
    emptyOne.style.display = 'block'
    
    if(parseFloat(waterValue.innerText) >=parseFloat( targetValue.innerText) && !drunkTarget){
        document.getElementById("waterTarget").innerHTML+= `<i class="fa-solid fa-circle-check" style="color:green"></i>`
        drunkTarget = true
    }else if(parseFloat(waterValue.innerText) <parseFloat( targetValue.innerText)){
        document.getElementById("waterTarget").innerHTML = `Target: <span id="targetValue">${waterIntake}</span>L`
        drunkTarget = false
    }


},2000)


//NutCard
const nutCardInfo = async function(foodName,selectedFoodP){
    try{
        const findFetch = await fetch(`${url}/api/v1/food/findFood`,{
            method:'POST',
            body:JSON.stringify({foodName:foodName}),
            headers:{
                'Content-Type':'application/json'
            }
        })
        var findResult = await findFetch.json()
        findResultGlo = findResult

    }catch(e){
        
    }
    
    
    if(findResult.found && selectedFoodP){
        foodNameNutCard.textContent = selectedFoodP.name 
        let gramsValue = gramsInput.value ? gramsInput.value : 1
        foodGrams.textContent = `Per ${gramsValue}gm`
    
        foodCalories.textContent = `${(selectedFoodP.calories * parseInt(gramsValue)).toFixed(0)}gm`
        foodCarbs.textContent = `${(selectedFoodP.carb * parseInt(gramsValue)).toFixed(0)}gm`
        foodProtien.textContent = `${(selectedFoodP.protien * parseInt(gramsValue)).toFixed(0)}gm`
        foodFat.textContent = `${(selectedFoodP.fat * parseInt(gramsValue)).toFixed(0)}gm`

        if(selectedFoodP.calorieDense)
            negatives.innerHTML += `<p>${xMark} Calorie Dense</p>`
        if(selectedFoodP.processed)
            negatives.innerHTML += `<p>${xMark} Processed</p>`
        if(selectedFoodP.highSugar)
            negatives.innerHTML += `<p>${xMark} High Sugar</p>`
        if(selectedFoodP.highProtien)
            positives.innerHTML += `<p>${checkMark} High Protien</p>`
        
        

    }else{
        foodNameNutCard.textContent = "Searching..."
        foodGrams.innerHTML = 
        `<div class="loaderCard" >
            <div class="firPulse"></div>
            <div class="secPulse"></div>
        </div>`
        foodCalories.textContent = '...kcal'
        foodCarbs.textContent = '...gm'
        foodProtien.textContent = '...gm'
        foodFat.textContent ='...gm'
        positives.innerHTML = ''
        negatives.innerHTML = ''
    }
    // 
}

//ExeCard
const exeCardInfo = async function(exeNameP,selectedExeP){
    try{
        
        const exeFetch = await fetch(`${url}/api/v1/exercise/findExercise`,{
            method:'POST',
            body:JSON.stringify({searchTerm:exeNameP}),
            headers:{
                'Content-Type':'application/json'
            }
        })
        
        const exeResult = await exeFetch.json()
        exeFindResultGlo = exeResult
        
        if(exeResult.found){
           
            exeName.textContent = selectedExeP.name
            let durationValue = durationInput.value ? durationInput.value : 1
            durationValue = parseInt(durationValue)
            
            let burned = (durationValue/60) * exeResult.cals
            burned = parseInt(burned)
            exeDuration.textContent = `for ${durationValue}mins`
            burnedCals.textContent = `${burned}kcal`
        }else{
            exeName.textContent = `Searching...`
            exeDuration.innerHTML = `
            <div class="loaderCard" >
                <div class="firPulse"></div>
                <div class="secPulse"></div>
             </div>`
            burnedCals.textContent = `...kcal`

        }

    } catch(e){
        console.log(`Error in exeCardInfo: ${e.message}`)
    }
}


//Eat API
document.getElementById("EatAPI").addEventListener("submit", async function(event){
    event.preventDefault()
    
    if(!findResultGlo){
        resMessage.textContent = `Please Select a food from our database ${xMark}`
        return 
    }
    try{
        const formEntires = new FormData(this)
        const eatData = Object.fromEntries(formEntires.entries())
        eatData.date = `${sessionStorage.getItem('storedDate')}T00:00:00.000+00:00`
        
        const response = await fetch(`${url}/api/v1/tracker/eat`,{
            method:"POST",
            body:JSON.stringify(eatData),
            headers:{
                'Content-Type':'application/json'
            }
        })
        
        let result = await response.json()
        if(response.ok){
            resMessage.innerHTML=`Food Eaten ${checkMark}`
            // sessionStorage.setItem('storedDate',date.value)
            
            setTimeout(()=>{location.reload()},700)
        }else{
            console.log(result)
            resMessage.innerHTML = `${result.message} ${xMark}`
        } 
        
    } catch(e){
        resMessage.textContent = `${e.message} ${xMark}`
        console.error(`Error in Eat API: ${e.stackTrace}`)
    }
})

//Exercise API
document.getElementById("ExersiceAPI").addEventListener("submit",async function(event){
    event.preventDefault()
    try{
        const exerForm = new FormData(this)
        const exerBody = Object.fromEntries(exerForm.entries())

        console.log(sessionStorage.getItem('storedDate'))
        exerBody.date = `${sessionStorage.getItem("storedDate")}T00:00:00.000+00:00`
        
        exerBody.duration /=60
        const exerFetch = await fetch(`${url}/api/v1/tracker/exercise`,{
            method:'POST',
            body: JSON.stringify(exerBody),
            headers:{
                'Content-Type':'application/json'
            }
        })
        console.log(exerFetch)
        exerResult = await exerFetch.json()
        console.log(exerResult)
        if(exerFetch.ok){
            resMessage.innerHTML = `Exercise Tracked ${checkMark}` 
            setTimeout(()=>{location.reload()},700)
        }else{
            resMessage.innerHTML = `Error:${exerFetch.statusText}`   
        }
        
    } catch(e){
        resMessage.innerHTML = `Error:${e.message} ${xMark}`   
    }
})

//Live Search - Food / Nutrition Card
foodSearch.addEventListener("input", async function(event){
    //LiveSearch

    if(foodSearch.value ===''){
        liveSearchFood.classList.add("hide")
        foodNameNutCard.textContent = "Search Food"
        foodGrams.textContent = ''
        
    }else{
        liveSearchFood.classList.remove("hide")
        
        liveSearchFood.innerHTML = `
        <div class="loaderLiveSearch" >
        <div class="firPulseLS" style="backgorund-color:black"></div>
        <div class="secPulseLS" style="backgorund-color:black"></div>
        </div>`
    }
        
    try{
        const searchFetch = await fetch(`${url}/api/v1/food/liveSearch`,{
            method:'POST',
            body:JSON.stringify({searchTerm:this.value}),
            headers:{
                'Content-Type':'application/json'
            }
        })
        const searchResult = await searchFetch.json()
        var foodResult = searchResult.data.foodObject
        foodResultGlo = foodResult
        
        if(foodResult){

            var indexOfSelected = foodResult.findIndex(food => {
                return food.name.toLowerCase() == foodSearch.value.toLowerCase()
            })
            let foodSelected  = foodResult[indexOfSelected] //= foodResult[The on selected from the liveSearch Menu]
            foodSelectedGlo = foodSelected
        }
        //Returns the whole food object
        
        if(foodResult || foodResult.length >0 ){
            liveSearchFood.innerHTML = foodResult.map(food =>{
                return `<div class="foodSearch Item">${food.name}</div>`
            } ).join('')
        }
        if(foodResult.length == 0){
            liveSearchFood.innerHTML = `<div style="padding:5px;text-align:center;">No Foods Found</div>`
            
        }
    }catch(e){
        console.log(`Error in live search: ${e.message}`)
    }
    //------------
    //Nutrition Card
    nutCardInfo(foodSearch.value,foodSelectedGlo)

})

//Clicking on the liveSearch - Food 
document.addEventListener('click',async function(event){
    if(event.target.classList.contains('foodSearch')){
        foodSearch.value = event.target.textContent
        liveSearchFood.classList.add("hide")
        document.getElementById("grams").focus()

        let indexOfSelected = foodResultGlo.findIndex((food,i) => {
           
            return food.name.toLowerCase() == foodSearch.value.toLowerCase()
        })
        let foodSelected  = foodResultGlo[indexOfSelected] //= foodResult[The on selected from the liveSearch Menu]
        foodSelectedGlo = foodSelected
        // Here foodSelectedGlo is updated so the gramsInput eventListener can use it
        nutCardInfo(foodSearch.value,foodSelected)  
        // console.log(liveSearchFood.)
    }
})

//Updating Grams
gramsInput.addEventListener('input',async function(e){
    //This will update the nutrition card when the grams input changes
    if(findResultGlo.found && foodSelectedGlo){
        foodNameNutCard.textContent = foodSelectedGlo.name 
        let gramsValue = gramsInput.value ? gramsInput.value : 1
        foodGrams.textContent = `Per ${gramsValue}gm`
    
        foodCalories.textContent = `${(foodSelectedGlo.calories * parseInt(gramsValue)).toFixed(0)}kcal`
        foodCarbs.textContent = `${(foodSelectedGlo.carb * parseInt(gramsValue)).toFixed(0)}gm`
        foodProtien.textContent = `${(foodSelectedGlo.protien * parseInt(gramsValue)).toFixed(0)}gm`
        foodFat.textContent = `${(foodSelectedGlo.fat * parseInt(gramsValue)).toFixed(0)}gm`
   }else{
        foodNameNutCard.textContent = "Searching..."
        foodGrams.innerHTML = 
        `<div class="loaderCard" >
            <div class="firPulse"></div>
            <div class="secPulse"></div>
        </div>`
        foodCalories.textContent = '...kcal'
        foodCarbs.textContent = '...gm'
        foodProtien.textContent = '...gm'
        foodFat.textContent ='...gm'
   }
})

//Live Search - Exercise
exerciseSearch.addEventListener("keyup", async function(event){
    if(exerciseSearch.value ==='')
        liveSearchExercise.classList.add("hide")
    else
        liveSearchExercise.classList.remove("hide")
    
    
    liveSearchExercise.innerHTML = `
        <div class="loaderLiveSearch" >
            <div class="firPulseLS" ></div>
            <div class="secPulseLS" ></div>
        </div>`;

    try{
        
        const searchFetch = await fetch(`${url}/api/v1/exercise/liveSearch`,{
            method:'POST',
            body:JSON.stringify({searchTerm /*1*/:this.value}),
            headers:{
            'Content-Type':'application/json'
            }
        })
        const searchResult = await searchFetch.json()
        let exerciseResult = searchResult.data.exerciseNames
        exerciseResultGlo = exerciseResult


        if(exerciseResult.length > 0){
            liveSearchExercise.innerHTML = exerciseResult.map( exer =>{
                return `<div class="exerSearch Item">${exer.name}</div>`
            }).join('')
        }

        if(exerciseResult.length ==0)
            liveSearchExercise.innerHTML = `<div style="padding:5px;text-align:center;">No Exercise Found</div>`


        let indexOfSelected = exerciseResult.findIndex(exe => {
            return exe.name.toLowerCase() == exerciseSearch.value.toLowerCase()
        })

        let exerciseSelected  = exerciseResult[indexOfSelected] //= foodResult[The on selected from the liveSearch Menu]
        
        exerciseSelectedGlo = exerciseSelected
        console.log('---------------')
        exeCardInfo(exerciseSearch.value,exerciseResultGlo)
        
    }catch(e){
        console.log(e.message)
    }
})

//Clicking on the liveSearch - Exercise 
document.addEventListener("click",function(e){
    // e.preventDefault() This will prevent all the clickable elements
    if(e.target.classList.contains("exerSearch")){
        exerciseSearch.value = e.target.textContent
        liveSearchExercise.classList.add('hide')
        document.getElementById('duration').focus()      
        console.log("exerciseResultGlo:",exerciseResultGlo)

        let indexOfSelected = exerciseResultGlo.findIndex(exe => {
            return exe.name.toLowerCase() == exerciseSearch.value.toLowerCase()
        })

        let exerciseSelected  = exerciseResultGlo[indexOfSelected] //= foodResult[The on selected from the liveSearch Menu]
        exerciseSelectedGlo = exerciseSelected
        
        exeCardInfo(exerciseSearch.value,exerciseSelected)
    }
})

//Updating Duration
durationInput.addEventListener("input",function(e){
    if(exeFindResultGlo.found){
         
        exeName.textContent = exerciseSelectedGlo.name
        let durationValue = durationInput.value ? durationInput.value : 1
        durationValue = parseInt(durationValue)


        let burned = (durationValue/60) * exeFindResultGlo.cals
        burned = parseInt(burned)
        exeDuration.textContent = `for: ${durationValue}mins`
        burnedCals.textContent = `${burned}kcal`
        }else{
            exeName.textContent = `Searching...`
            exeDuration.innerHTML = `
            <div class="loaderCard">
                <div class="firPulse"></div>
                <div class="secPulse"></div>
            </div>`
            burnedCals.textContent = `...kcal`
        }
})

// waterValue.innerHTML = 4

 
//Updating Water
glassesContainer.addEventListener("click",async function(e){
    //Declared using 'var' so it can accessed in the beginning of file
    
    updateWater()
    var glasses = Array.from(this.children)
    // Drinking Water - Adding a glass and appending emptyOne
    if(e.target.classList.contains("fa-glass-water-droplet")){
        glassesContainer.innerHTML += glass        
        let lastGlass = this.children[this.children.length-1]
        lastGlass.after(emptyOne)
        glassesContainer.removeChild(document.querySelector("#emptyOne"))
        //For some reason it creates a new glass and appends it.
        //So the old is removed to acheive the desired behavior.
    }else if(e.target.classList.contains("fa-glass-water")){
        //Removing Water - Based on the glass clicked

        const indexOfClicked = glasses.indexOf(e.target)
        console.log(indexOfClicked)
        if(indexOfClicked ==1 ){
            glassesContainer.removeChild(document.querySelector(".fa-glass-water"))
        }


        
        for(let i = indexOfClicked;i <glasses.length - 2;i++){
            glassesContainer.removeChild(document.querySelector(".fa-glass-water"))
            console.log("i:",i,"glasses.length - 2",glasses.length)
        }

    }
    // Each glass is worth half a liter, excluding the emptyOne
    //Make it recount again (After Degugging)
    glasses = Array.from(this.children)
    
    waterValue.innerText = (glasses.length -1) * .5
    if(parseFloat(waterValue.innerText) >=parseFloat( targetValue.innerText) && !drunkTarget){
        document.getElementById("waterTarget").innerHTML+= `<i class="fa-solid fa-circle-check" style="color:green"></i>`
        drunkTarget = true
    }else if(parseFloat(waterValue.innerText) <parseFloat( targetValue.innerText)){
        document.getElementById("waterTarget").innerHTML = `Target: <span id="targetValue">${waterIntake}</span>L`
        drunkTarget = false
    }
})


window.addEventListener("beforeunload", async(e)=>{
    // requires loading the tracker object
    // trackerResultGlo.data.tracker.eaten.water = parseInt(waterValue.innerText)
    // Here wa are updating the copy from the fetch result, not the acutal one in the DB.
    const Fetch = await fetch(`${url}/api/v1/tracker/updateWater`,{
        method:"PATCH",
        body:JSON.stringify({
            date: date,
            water:parseFloat(waterValue.innerText)
        }),
        headers:{
            'Content-Type':'application/json'
        }
    })
    const result = await Fetch.json()
})
//Left in the activity Page: Due 4:00pm
// Water Tracker: Link it to the trackerModel, fix calculations

//Logging Out
document.getElementById("loggedOut").addEventListener("click", async(event)=>{
    event.preventDefault()
    try{
        const response = await fetch(`${url}/api/v1/auth/logOut`, {
            method: "POST",
            headers: { "Content-Type": 'application/json'}
        })

        const result = await response.json()
        console.log(result)
        if(response.ok){
            console.log("Log Out Sccessful")
            setTimeout(()=>{
                window.location.href= "./logIn"
            }, 500)
        }
    }catch(e){
        resMessage.textContent = `Error Fetching: ${e.message} `
    }
})

//... يا مراري