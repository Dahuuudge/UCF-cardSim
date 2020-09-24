window.onload =  (function (doc) {
    "use strict";
    
    // The initalCardPos array vector infuences (forgottne how exactaly) the diplacment the cards make when distributing them selves over the screen. The Compatancy cards have a further value 'vCardA' that modifys their vertical posiotn
    
    const cardTemplates = doc.getElementById("cardTemplates"),
          pageArea = doc.getElementsByTagName("body")[0],
          sortResultTable = doc.getElementById("sortResults"),
          deckPlace = doc.getElementById("origin"),
          initalCardPos = [91,139];//139 was the origanal positon
    
          
        //initalCardPos =  [doc.getElementById("UCF").style.right, doc.getElementById("UCF").style.top];
    
    let xmlhttp = new XMLHttpRequest(),
        ucfData,
        system = {
        
            wireframe: {},

            model: {},
            
            FrameworkItem: class {
                
                    constructor(data){
                        this.name = data.name;
                        this.title = data.title;
                        this.description = data.description;
                        this.colour = data.colour;
                        this.pos = {
                            x: initalCardPos[0],
                            y: initalCardPos[1],
                            homePos: [],
                            move() {
                                let fwContainer = system.utils.getNamedObj(data.name);
                                fwContainer.card.style.right = this.x + "px";
                                fwContainer.card.style.top = this.y + "px";
                            },
                            get cords() {
                                return [this.x, this.y];
                            },
                            set cords(value) {
                                this.x = initalCardPos[0] + value[0],
                                this.y = initalCardPos[1] + value[1],
                                this.move();
                            }
                        }
                    }
                    
                    deSelect(c){
                        
                        this.cords(this.homePos);
                    }
                
                    buildPgEle() {
                        
                        const su = system.utils,
                              namePath = su.namePath(this.name), //returns str array of name split 
                              typeNo = namePath.length,
                              cardName = namePath[typeNo - 1], //last arry 
                              createNode = su.createNode,
                              wfData = su.getNamedObj(this.name, system.wireframe);
                        
                        let  lastLevel = false;
                        
                        // This class crates an Data object to pass to the makeCard function
                        // the propertys of the object contain strings from the json file
                        // corisponding to text 'fields' on the UCF cards
                        class cardFieldData {
                            constructor(cObj){
                                this.title = cObj.title;
                                this.description = cObj.description;
                                this.cardNoOf = cObj.noOfSibs;
                                this.cardIndex = cardName.split("-").pop();
                            }
                        }

                        function makeCard (cardType, id, obj = {}) {
                            
                            // 'ele' becomes a clone of the template specified by the 'cardType'
                            let ele = cardTemplates.querySelector(cardType).cloneNode(true);
                            ele.id = id;
                            
                            // loop over the props of the obj (instance of the 'cardFieldData' class) that
                            // contains the txt strs to populate the cards fields – the first call of this 
                            // 'makeCard' function concerns the '#Box' tile card this has no text fields,
                            // so this empty card template clone is returned and rest of function is skipped.
                            
                            if(cardType === "#box") return ele;

                            for (let [key, value] of Object.entries(obj)){

                                let cardText = ele.querySelector("."+ key);

                                if(cardText){
                                    try{
                                        cardText.innerHTML = value;
                                    } catch(err) {
                                        console.log(err);
                                    }
                                } else {console.log("non text pg ele: " + key);}
                            }
                            
                            
                        
                            // I could move this into the switch stament? (case 4 else)
                            // if the sort card has two values (eg. 'Relatively Simple', 'Easy' ) turn on the congunction ('or'): 'Relatively Simple or Easy'
                            if (cardType === "#sortCard" && obj.val_2 !== "" ){
                                ele.querySelector(".conjunc").style.display = "block";
                            } else if (cardType === "#sortCard" && obj.val_2 === "" ) {
                                ele.querySelector(".val_2").style.display = "none";
                            }
                            return ele;
                        }
                        
                        function chooseSortButton(idFrag){
                            let ele = system.model.UCF.pgEle.querySelector("." + idFrag);
                            return ele;
                        }
                        
                        function processTopCard(tc){
                            const boxObj = su.getNamedObj("UCF"),
                                  cardSpaceH = su.cardDims.cardWidth + su.cardDims.cardGap,
                                  cardSpaceV = su.cardDims.cardHeight + su.cardDims.cardGap,
                                  vCardA = 40; //vertical Card Placment Ajustment, bummping the Comp Cards up the page
                            
                            // spacing out the compatancy cards - 
                            // 1st hroisontal spacing the Factor groups 2nd vertical spacing the dimiention cards
                            boxObj.dealDeck = function () {
                                
                                const compCards = boxObj.children.UCF_CompCards,
                                      factorGroups = compCards.children;
                                
                                let i = 1;
                                
                                Object.entries(factorGroups).forEach( s => {             
                                     let ii = 1;
                                    s[1].pos.homePos = [ cardSpaceH * 4 - (cardSpaceH * i) + (cardSpaceH / 2), 0 - vCardA ];
                                    s[1].pos.cords = s[1].pos.homePos;

                                    Object.entries(s[1].children).forEach( c => {
                                        
                                        c[1].pos.homePos = [cardSpaceH * 4 - (cardSpaceH * i) + (cardSpaceH / 2), (cardSpaceV * ii) - vCardA];
                                        c[1].pos.cords = c[1].pos.homePos;
                                        ii++;
                                    });
                                    i++;
                                });
                            }
                            
                            //*************************************
                            //--- Called on fist click on card ----
                            //*************************************
                            boxObj.beginIt = function () {
                                
                                this.classList.add("initalSize");
                                
                                system.model.UCF.children.UCF_SortCards.pgEle.classList.remove("startHidden");
                                boxObj.children.UCF_CompCards.pgEle.classList.remove("startHidden");
                               
                                this.removeEventListener("click", boxObj.beginIt);
                                doc.getElementById("intro").style.opacity = "0";
                            }
                            
                            tc.style.zIndex = "10";
                            tc.addEventListener("click", boxObj.beginIt, false);
                            
                            boxObj.sortBehaviour = (e) => {
                                const sortType = e.target.parentElement.dataset.sorttype,
                                      sortSetsGroup = system.model.UCF.children.UCF_SortCards.children,
                                      sortLevelCards = sortSetsGroup[`UCF_SortCards_${sortType}`],
                                      noOfCards = Object.keys(sortLevelCards.children).length,
                                      sCardVertD = 360; //sortCardVertDisplacment
                                
                                let i = 1;
   
                                // placing the Sort Cards
                                Object.entries(sortSetsGroup).forEach( s =>{
                                    
                                    if (s[1] === sortLevelCards) {
                                        Object.entries(sortLevelCards.children).forEach( c =>{
                                            c[1].pos.cords = [ -cardSpaceH * (noOfCards/2) + (cardSpaceH*i) - (cardSpaceH/2), -sCardVertD ];
                                    
                                            i++;
                                        })
                                    } else {
                                        s[1].pgEle.style.opacity = 0;
                                    }
                                } );
                                su.chooseSort(sortType);
                                boxObj.dealDeck();
                                boxObj.card.classList.add("nextStep");
                                
                            }
                            
                            boxObj.sortTypeDisplay = (e) => {
                                const sortTypeBtn = e.target.parentElement,
                                      sortType = sortTypeBtn.dataset.sorttype,
                                      displayText = boxObj.sortChoser.querySelector(".sortTypeHead");
                                
                                if(e.type === "mouseover"){
                                    displayText.innerHTML = sortType.replace("Sort", " Sort");
                                    displayText.classList.add("active");
                                    sortTypeBtn.getElementsByTagName("circle")[0].classList.add("over");
                                } else {
                                   displayText.innerHTML = "Choose Sort Type";
                                    displayText.classList.remove("active");
                                    sortTypeBtn.getElementsByClassName("over")[0].classList.remove("over");
                                }
                            }
                            
                            const sortTypeEles = boxObj.sortChoser.querySelectorAll(".sortType");
                            sortTypeEles.forEach( e => {
                                e.addEventListener("click", boxObj.sortBehaviour, false);
                                e.addEventListener("mouseover", boxObj.sortTypeDisplay, false);
                                e.addEventListener("mouseleave", boxObj.sortTypeDisplay, false);
                                
                                }
                            )
                        }
                        
                        // if the data being processed is the root card/title card data
                        if(typeNo > 1) {
                            this.parent = su.getNamedObj(su.getParentName(this.name));
                            this.noOfSibs = Object.keys(system.utils.getNamedObj(this.parent.name, system.wireframe).children).length;
                        }
                        
                        // turns the cursor back to default on dragend.
                        pageArea.addEventListener("dragend", () => {pageArea.style.cursor = "default";});
                        
                        switch(typeNo) {
                            case 1:
                                //  1st level
                                // UCF : Group = Card Deck – Element = Box / Top Card
                                this.pgEle = createNode("article", "UCF_deck", "");
                                this.cardFieldData = new cardFieldData(this);   // creates data obj    
                                this.card = makeCard("#box", this.name, this.cardFieldData);
                                this.sortChoser = makeCard("#sortChooseTemplate", "sortChoose");
                                
                                processTopCard(this.card);
                                
                                this.pgEle.appendChild(this.card);
                                this.pgEle.appendChild(this.sortChoser);
                                break;
                                
                            case 2:
                                //  2nd level
                                // COMPATANCY CARDS : Group = Compatancy Cards – Element = NA
                                // SORT CARDS :  Group = Sort Cards – Element = NA
                                
                                this.pgEle = createNode("div", this.name , "");
                                this.pgEle.classList.add("startHidden");
                                break;
                                
                            case 3:
                                //  3rd level
                                // COMPATANCY CARDS : Group = Factor Type – Element = Factor Card
                                // else
                                // SORT CARDS :  Group = Sort Type – Element = NA
                                if(cardName.indexOf("Factor") === 0){
                                    
                                    this.cardFieldData = new cardFieldData(this);
                                    this.cardFieldData.cardRef = this.cardFieldData.cardIndex;
                                    this.pgEle = createNode("div", cardName , "FactorGroup");
                                    this.card = makeCard("#factorCard", this.name, this.cardFieldData);
                                    this.card.querySelector(".factorColfill").style.backgroundColor = this.colour;
                                    this.pgEle.appendChild(this.card);
                                   
                                }else{
                                    this.pgEle = createNode("div", cardName, "sortType"); 
                                    system.model.UCF.children.UCF_SortCards.pgEle.appendChild(this.pgEle);
                                }
                                break;
                                
                            case 4:
                                // 4th Level
                                // COMPATANCY CARDS : Group = NA – Element = Dimention Card
                                // else
                                // SORT CARDS :  Group = NA – Element = Sort Card
                                
                                 if(cardName.indexOf("Dimension") === 0){
                                     this.cardFieldData = new cardFieldData(this);
                                     this.cardFieldData.cardRef = this.parent.cardFieldData.cardRef + "." + this.cardFieldData.cardIndex;
                                     this.card = makeCard("#dimentionCard", this.name, this.cardFieldData);
                                     this.card.querySelector(".factorColfill").style.backgroundColor = this.parent.colour;                                    
                                     this.card.addEventListener("dragstart", system.utils.dragstart_handler);
                                     //this.pgEle = this.card;
                                     
                                 } else {
                                     
                                     class sortCardFieldData extends cardFieldData{
                                         constructor(cObj){
                                            super(cObj);
                                                this.sortType = cObj.parent.title;
                                                this.text_1 = ((t2 = "") => { 
                                                                const t1 = su.getNamedObj(su.getParentName(cObj.name), system.wireframe).text_1;
                                                                return t1+t2; 
                                                                })(wfData.textMod);
                                                this.val_1 = wfData.val_1;
                                                this.val_2 = ((v2 = "") => v2)(wfData.val_2);
                                                this.asocComps = [];
                                         }
                                     }
                                     this.sortCardFieldData = new sortCardFieldData(this);
                                     delete this.sortCardFieldData.title;
                                     delete this.sortCardFieldData.description;
                                     this.sortCardFieldData.cardRef = this.sortCardFieldData.cardIndex;
                                     this.card = makeCard("#sortCard", this.name, this.sortCardFieldData);
                                     this.card.querySelector(".reciver").setAttribute("data-appendto", this.name);
                                     this.card.addEventListener("drop", system.utils.drop_handler);
                                     this.card.addEventListener("dragover", system.utils.dragover_handler);
                                     //this.pgEle = this.card;
                                 }
                                break;
                                
                            case 5:
                                // 5th Level
                                // COMPATANCY CARDS : Group = NA – Element = Components - Add to dimention card
                                // else
                                // SORT CARDS : NA 
                                lastLevel = true; 
                                break;
                                    
                            default:
                                throw("beyond expected range");
                                break;
                        }
                    
                        if(typeNo > 1 && !lastLevel) { 
                            this.pgEle? this.parent.pgEle.appendChild(this.pgEle) : this.parent.pgEle.appendChild(this.card);
                        }
                    }
                },

            utils: {
                  
                createNode: function createNode (ele, i, c) {
                            let node = document.createElement(ele);      
                            node.id = i;
                            node.className = c;
                            return node;
                        },
                            
                namePath: n => n.split("_"),

                getParentName: n => {
                    let pn = system.utils.namePath(n);
                    pn.pop();
                    return pn.join("_");
                },
                
                getNamedObj: function getNamedObj(n, t = system.model ){
                
                    let nArr = system.utils.namePath(n),
                        srt = "",
                        dad = t,
                        objBarst;
                    
                    nArr.forEach( srtFrag => {
                        srt += srtFrag;
                        objBarst = dad[srt];
                        dad = objBarst.children;
                        srt += "_";  
                    });
                    
                return objBarst;
                },
                
                cardDims: {
                    cardWidth: 218,
                    cardHeight: 122,
                    cardGap: 16
                },
    
                dragstart_handler: function(ev){
                    ev.dataTransfer.setData("text", ev.target.id);
                    pageArea.style.cursor = "no-drop";
                    ev.target.classList.add("dragging");
                    console.log(ev.target);
                },
                        
                drop_handler: function(ev){

                    const sortTable = doc.getElementById("sortResults"),
                          data = ev.dataTransfer.getData("text"),
                          card = system.utils.getNamedObj(data),
                          cDims = system.utils.cardDims,
                          hDis1 = (cDims.cardWidth/2) - (cDims.cardGap + 2),
                          hook = ev.target,
                          targetSortCard = system.utils.getNamedObj(hook.getAttribute("data-appendto")),
                          sortName = system.utils.getNamedObj(hook.getAttribute("data-appendto"), system.wireframe).val_1,
                          sortLev = sortTable.querySelector("#" + sortName.replace(/ /g, "_")),
                          li = system.utils.createNode("li");
                    
                    
                    // add the compatancy card to the list of Sort Cards accosiati=ed cards 
                    let noAsocComps = targetSortCard.sortCardFieldData.asocComps.push(card);
                    li.innerHTML = "<span class='compTitle'>" + card.title + "</span>&nbsp;<span class='compRef'>" + card.cardFieldData.cardRef + "</span>";
                    sortLev.appendChild(li);
                    card.card.classList.add("aniOff");
                    card.card.querySelector(".cardBodyText").classList.add("selected");
                    card.pos.cords = [targetSortCard.pos.x - hDis1, targetSortCard.pos.y  - cDims.cardGap + (noAsocComps -1) * 29] ;
//                    card.card.style.top = "122px";
                    card.card.style.zIndex = 10 - noAsocComps;
//                    hook.appendChild(card.card);
                    
                    ev.preventDefault();
                },

                dragover_handler: function(ev){

                    pageArea.style.cursor = "pointer";
                    ev.preventDefault();
                    ev.dataTransfer.dropEffect = "move";

                },
                    
                chooseSort: function(sn){

                    let sortTypes = doc.getElementById("UCF_SortCards").querySelectorAll(".sortType"),
                        wfSortName = "UCF_SortCards_" + sn,
                        sortLevels = system.wireframe.UCF.children.UCF_SortCards.children[wfSortName].children;

                    function addToTable(e,t){
                        let ele = system.utils.createNode(e);
                        ele.innerHTML = t;
                        sortResultTable.appendChild(ele);
                    }

                    addToTable("h4", "Sort:");
                    addToTable("h5", sn.replace("Sort", " Sort"));


                    for (let [key, value] of Object.entries(sortLevels)) {

                    addToTable("h4", value.val_1);

                    sortResultTable.appendChild(system.utils.createNode("ul", value.val_1.replace(/ /g, "_")));

                    }
                },
                
                noScroll: function() {
                  window.scrollTo(0, 0);
                },

                recursiveCall: function (wireFrame, model) {

                    var enityName,
                        parent,
                        child;

                    if (model === undefined) {
                        model = system.model;
                    }

                    for (child in wireFrame) {
                        if (wireFrame.hasOwnProperty(child)) {

                            enityName = wireFrame[child].name;
                            model[enityName] = new system.FrameworkItem(wireFrame[child]);
                            model[enityName].buildPgEle();
                            
                            if (wireFrame[child].children) {
                                model[enityName].children = {};
                                system.utils.recursiveCall(wireFrame[child].children, model[enityName].children);
                            }
                        }
                    }
                    deckPlace.appendChild(system.model.UCF.pgEle);
                }
            }
        };
    
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          system.wireframe = JSON.parse(this.responseText);
          system.utils.recursiveCall(system.wireframe);
      }
    };

    xmlhttp.open("GET", "data/UCF_data4.json", true);
    xmlhttp.send();
    window.addEventListener('scroll', system.utils.noScroll);
    
    doc.system = system;
    
}(window.document));